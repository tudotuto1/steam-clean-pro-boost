import { createClient } from "@supabase/supabase-js";

// Browser Supabase client. URL + anon key are public (VITE_ prefixed) and
// inlined by Vite for both client and server bundles.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
