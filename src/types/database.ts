export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          slug: string;
          title: string;
          excerpt: string;
          published_at: string;
          featured: boolean;
          tags: string[] | null;
          cover_key: string | null;
          linkedin_embed: Json | null;
          display_order: number;
        };
        Insert: {
          id?: number;
          slug: string;
          title: string;
          excerpt: string;
          published_at: string;
          featured?: boolean;
          tags?: string[] | null;
          cover_key?: string | null;
          linkedin_embed?: Json | null;
          display_order?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          excerpt?: string;
          published_at?: string;
          featured?: boolean;
          tags?: string[] | null;
          cover_key?: string | null;
          linkedin_embed?: Json | null;
          display_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
