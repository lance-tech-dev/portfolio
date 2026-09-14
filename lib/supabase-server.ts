import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local configuration."
  );
}

/**
 * Server-side client whose queries go through Next.js's fetch cache,
 * so repeated requests reuse the cached response instead of hitting
 * Supabase on every page load.
 */
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input, init) =>
      fetch(input, { ...init, next: { revalidate: 60 } }),
  },
});
