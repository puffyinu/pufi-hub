import { createClient } from "@supabase/supabase-js";

// Client-side safe. Uses ANON_KEY (respects RLS, read-only for public tables).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
