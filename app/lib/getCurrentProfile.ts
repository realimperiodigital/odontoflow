import { supabase } from "@/app/lib/supabaseClient";

export interface Profile {
  id: string;
  user_id: string;
  clinic_id: string | null;
  role: string | null; // 'master', 'clinic_admin', 'reception', 'financial', 'dentist', 'staff'
  full_name: string | null;
  department?: string | null;
  job_title?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  must_change_password?: boolean;
}

export async function getCurrentProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) return { session: null, profile: null };

  const user = session.user;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return { session, profile: null };

  return { session, profile: profile as Profile };
}
