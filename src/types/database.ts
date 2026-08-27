export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
          title: string;
          excerpt: string;
          published_at: string;
          created_at: string;
          updated_at: string;
          featured: boolean;
          tags: string[];
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
          created_at?: string;
          updated_at?: string;
          featured?: boolean;
          tags?: string[];
          cover_key?: string | null;
          linkedin_embed?: Json | null;
          display_order?: number;
        };
        Update: {
          id?: number;
          slug?: string;
          title?: string;
          excerpt?: string;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          featured?: boolean;
          tags?: string[];
          cover_key?: string | null;
          linkedin_embed?: Json | null;
          display_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_post_at_top: {
        Args: {
          p_slug: string;
          p_title: string;
          p_excerpt: string;
          p_published_at: string;
          p_featured: boolean;
          p_tags: string[];
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
