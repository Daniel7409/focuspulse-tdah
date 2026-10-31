import { z } from "zod";

// Env vars vacías ("") en .env.local cuentan como "todavía no configuradas", no como inválidas.
const optionalSecret = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().min(1).optional(),
);

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: optionalSecret,
  ANTHROPIC_API_KEY: optionalSecret,
  AI_MODEL: z.string().min(1).default("claude-sonnet-4-6"),
  AI_DAILY_BUDGET_USD: z.coerce.number().positive().default(20),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  AI_MODEL: process.env.AI_MODEL,
  AI_DAILY_BUDGET_USD: process.env.AI_DAILY_BUDGET_USD,
});
