import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyHotmart } from "@/lib/hotmart-verify";
import { estadoParaEvento, EVENTO_CAMBIO_DE_PLAN } from "@/lib/membership-fsm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://focuspulse-tdah.vercel.app";
const REPLAY_WINDOW_MS = 5 * 60 * 1000;

// Códigos de oferta reales de los dos planes (del enlace de checkout que diste) — defensa
// de catálogo: un pago de un producto/oferta ajeno se ignora en vez de dar acceso.
const OFERTAS_VALIDAS = new Set(["7kyzw7j1", "il5ezkuo"]);

export async function POST(req: NextRequest) {
  const admin = createAdminClient();

  // 1. RAW body — se lee ANTES de parsear (necesario si algún día hay que verificar una
  //    firma documentada por Hotmart sobre los bytes exactos).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok en tiempo constante, sobre HTTPS.
  let payloadCrudo: Record<string, unknown>;
  try {
    payloadCrudo = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const hottok = req.headers.get("x-hotmart-hottok") ?? (payloadCrudo.hottok as string | undefined);
  if (!verifyHotmart(hottok)) {
    await admin.from("webhook_log").insert({ result: "unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = payloadCrudo as {
    event?: string;
    id?: string;
    creation_date?: number;
    data?: {
      purchase?: {
        transaction?: string;
        approved_date?: number;
        price?: { value?: number; currency_value?: string };
        offer?: { code?: string };
        product?: { id?: string | number };
      };
      subscription?: { subscriber?: { code?: string } };
      buyer?: { email?: string; name?: string };
    };
  };

  // 3. Frescura (anti-replay).
  const marcaTiempo = payload.creation_date ?? payload.data?.purchase?.approved_date;
  if (marcaTiempo && Date.now() - Number(marcaTiempo) > REPLAY_WINDOW_MS) {
    return NextResponse.json({ error: "stale" }, { status: 400 });
  }

  const evento = payload.event ?? "";
  const email = payload.data?.buyer?.email;
  const nombre = payload.data?.buyer?.name ?? "";
  const subscriberCode = payload.data?.subscription?.subscriber?.code;
  const transactionId = payload.data?.purchase?.transaction;
  const eventId = payload.id ?? transactionId ?? `${evento}:${email ?? ""}:${marcaTiempo ?? ""}`;
  const offerCode = payload.data?.purchase?.offer?.code;

  if (evento === EVENTO_CAMBIO_DE_PLAN) {
    // Cambio de plan nativo (mensual↔anual): no mueve el estado de la suscripción.
    // Fuera de alcance de esta primera versión — se deja para cuando haya tráfico real.
    await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: "ignored" });
    return NextResponse.json({ received: true, ignored: evento });
  }

  let nuevoEstado = estadoParaEvento(evento);
  if (!nuevoEstado) {
    return NextResponse.json({ received: true, ignored: evento });
  }

  // Confirmado con una compra de prueba real: Hotmart NO manda un evento propio al iniciar la
  // prueba gratis — manda el mismo PURCHASE_APPROVED que un cobro real, pero con price.value = 0.
  // Sin esto, el inicio de la prueba quedaría marcado como "ya cobrado" (first_paid_at en el día 0).
  if (nuevoEstado === "active" && !payload.data?.purchase?.price?.value) {
    nuevoEstado = "trialing";
  }

  // 4. Catálogo — rechazar ofertas ajenas a las dos reales de esta app.
  if (offerCode && !OFERTAS_VALIDAS.has(offerCode)) {
    await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: "unauthorized" });
    return NextResponse.json({ error: "unknown offer" }, { status: 400 });
  }

  if (!email) {
    await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: "error" });
    return NextResponse.json({ error: "missing buyer email" }, { status: 400 });
  }

  // 5. Resolver el dueño del perfil — si es comprador nuevo, se crea su cuenta ANTES de aplicar
  //    el evento (para no marcar "procesado" un pago cuyo acceso todavía no existe).
  let userId: string | null = null;
  {
    const { data } = await admin.rpc("resolver_perfil_hotmart", {
      p_email: email,
      p_subscriber_code: subscriberCode ?? null,
    });
    userId = (data as string | null) ?? null;
  }

  if (!userId && (nuevoEstado === "trialing" || nuevoEstado === "active")) {
    const { data: creado, error: errorCreacion } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { display_name: nombre || undefined },
      redirectTo: `${SITE_URL}/auth/callback`,
    });
    if (errorCreacion) {
      // Puede fallar porque ya existe (carrera entre un reintento y la creación anterior) — en
      // ese caso, se vuelve a resolver por email en vez de tratarlo como un fallo real.
      const { data: reintento } = await admin.rpc("resolver_perfil_hotmart", {
        p_email: email,
        p_subscriber_code: subscriberCode ?? null,
      });
      userId = (reintento as string | null) ?? null;
      if (!userId) {
        await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: "error" });
        return NextResponse.json({ error: "no se pudo crear la cuenta" }, { status: 500 });
      }
    } else {
      userId = creado.user.id;
    }
  }

  if (!userId) {
    // Evento sobre alguien sin cuenta y que no amerita crear una (p. ej. un reembolso de un
    // comprador que nunca llegó a entrar) — no hay nada que aplicar.
    await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: "ignored" });
    return NextResponse.json({ received: true, ignored: "no profile" });
  }

  const economicKind = nuevoEstado === "active" ? "sale" : nuevoEstado === "refunded" ? "refund" : nuevoEstado === "chargeback" ? "chargeback" : null;
  const precio = payload.data?.purchase?.price;
  const ocurrioEn = marcaTiempo ? new Date(Number(marcaTiempo)) : new Date();
  const trialEndsAt = nuevoEstado === "trialing" ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : null;

  // 6. Idempotencia + transición legal + cambio de estado + ledger — todo atómico en la RPC.
  const { data, error } = await admin.rpc("aplicar_evento_hotmart", {
    p_event_id: eventId,
    p_event_type: evento,
    p_payload_hash: crypto.createHash("sha256").update(rawBody).digest("hex"),
    p_user_id: userId,
    p_subscriber_code: subscriberCode ?? null,
    p_new_status: nuevoEstado,
    p_trial_ends_at: trialEndsAt,
    p_provider: "hotmart",
    p_transaction_id: economicKind && transactionId ? transactionId : null,
    p_economic_kind: economicKind,
    p_product_id: String(payload.data?.purchase?.product?.id ?? offerCode ?? "desconocido"),
    p_offer_id: offerCode ?? null,
    p_amount_minor: precio?.value != null ? Math.round(precio.value * 100) : null,
    p_currency: precio?.currency_value ?? null,
    p_occurred_at: ocurrioEn.toISOString(),
  });

  if (error) {
    console.error("webhook hotmart error", { event: evento, code: error.code }); // sin PII
    await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: "error" });
    return NextResponse.json({ error: "processing failed" }, { status: 500 }); // 5xx → Hotmart reintenta
  }

  const resultado = (data as { status?: string })?.status ?? "applied";
  const resultadoLog = resultado === "applied" || resultado === "duplicate" ? resultado : "illegal";
  await admin.from("webhook_log").insert({ event_id: eventId, type: evento, result: resultadoLog });

  // 7. 200 siempre que se tomó una decisión (incluidos duplicado/ilegal) — Hotmart deja de reintentar.
  return NextResponse.json({ received: true, result: resultado });
}
