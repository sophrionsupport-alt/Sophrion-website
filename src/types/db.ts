// src/types/db.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // Add your real tables here when ready (or replace with generated types).
      profiles: {
        Row: { id: string; role: string | null };
        Insert: { id: string; role?: string | null };
        Update: { id?: string; role?: string | null };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          name: string;
          slug: string;
          start_date: string | null;
          location: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Relationships: [];
      };
      colleges: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["colleges"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["colleges"]["Row"]>;
        Relationships: [];
      };
      newsletter: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["newsletter"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["newsletter"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};