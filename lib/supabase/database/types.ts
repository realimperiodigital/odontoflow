// lib/supabase/database/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      profiles: {
        Row: {
          id: string;
          role: string | null;
          clinic_id: string | null;
          full_name: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          role?: string | null;
          clinic_id?: string | null;
          full_name?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          role?: string | null;
          clinic_id?: string | null;
          full_name?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, never>;
  };
};
