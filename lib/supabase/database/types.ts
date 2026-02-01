// lib/supabase/database/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AnyTable = {
  Row: any;
  Insert: any;
  Update: any;
  Relationships: any[];
};

export type Database = {
  public: {
    Tables: {
      // ✅ Isso aqui é o "cura geral":
      // permite usar from("profiles"), from("clinics") etc sem virar "never"
      [key: string]: AnyTable;
    };
    Views: {
      [key: string]: never;
    };
    Functions: {
      [key: string]: never;
    };
    Enums: {
      [key: string]: string;
    };
    CompositeTypes: {
      [key: string]: never;
    };
  };
};
