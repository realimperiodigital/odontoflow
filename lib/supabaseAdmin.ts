import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
    // This might happen during build time if envs aren't loaded, but runtime validation is important.
    console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Backend operations will fail.");
}

// Service role client - bypasses RLS. Use ONLY in trusted server environments (API Routes).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
