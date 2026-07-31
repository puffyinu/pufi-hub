import { createClient } from "@supabase/supabase-js";

// Server-side only. Uses SERVICE_ROLE_KEY (bypasses RLS).
// NEVER import this file in client components.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});
