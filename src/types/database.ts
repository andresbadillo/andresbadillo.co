export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface PostTagRow {
  slug: string;
  es: string;
  en: string;
}

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          slug: string;
          title_es: string | null;
          title_en: string | null;
          excerpt_es: string | null;
          excerpt_en: string | null;
          published_at: string;
          created_at: string;
          updated_at: string;
          featured: boolean;
          tags: PostTagRow[];
          cover_key: string | null;
          linkedin_embed: Json | null;
          display_order: number;
        };
        Insert: {
          id?: number;
          slug: string;
          title_es?: string | null;
          title_en?: string | null;
          excerpt_es?: string | null;
          excerpt_en?: string | null;
          published_at: string;
          created_at?: string;
          updated_at?: string;
          featured?: boolean;
          tags?: PostTagRow[];
          cover_key?: string | null;
          linkedin_embed?: Json | null;
          display_order?: number;
        };
        Update: {
          id?: number;
          slug?: string;
          title_es?: string | null;
          title_en?: string | null;
          excerpt_es?: string | null;
          excerpt_en?: string | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          featured?: boolean;
          tags?: PostTagRow[];
          cover_key?: string | null;
          linkedin_embed?: Json | null;
          display_order?: number;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: number;
          slug: string;
          date: string;
          display_order: number;
          featured: boolean;
          anonymized: boolean;
          hero: string;
          tags: string[];
          screens: Json;
          copy: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          date: string;
          display_order?: number;
          featured?: boolean;
          anonymized?: boolean;
          hero: string;
          tags?: string[];
          screens: Json;
          copy: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          date?: string;
          display_order?: number;
          featured?: boolean;
          anonymized?: boolean;
          hero?: string;
          tags?: string[];
          screens?: Json;
          copy?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_post_at_top: {
        Args: {
          p_slug: string;
          p_title_es: string | null;
          p_title_en: string | null;
          p_excerpt_es: string | null;
          p_excerpt_en: string | null;
          p_published_at: string;
          p_featured: boolean;
          p_tags: PostTagRow[];
          p_cover_key: string | null;
          p_linkedin_embed: Json | null;
        };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
