import { supabase } from "@/lib/supabaseClient";
import type { Post } from "@/data/posts";
import { buildAvailableTags, rowToPost, type PostRow } from "@/data/postMapper";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface PostsContextValue {
  posts: Post[];
  availableTags: string[];
  loading: boolean;
  error: Error | null;
  getPostBySlug: (slug: string) => Post | undefined;
  refetch: () => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    void (async () => {
      const { data, error: qError } = await supabase
        .from("posts")
        .select(
          "id, slug, title, excerpt, published_at, featured, tags, cover_key, linkedin_embed, display_order",
        )
        .order("display_order", { ascending: true });
      if (qError) {
        setError(new Error(qError.message));
        setPosts([]);
        setLoading(false);
        return;
      }
      const rows = (data ?? []) as PostRow[];
      setPosts(rows.map(rowToPost));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const availableTags = useMemo(() => buildAvailableTags(posts), [posts]);

  const getPostBySlug = useCallback(
    (slug: string) => posts.find((p) => p.slug === slug),
    [posts],
  );

  const value = useMemo<PostsContextValue>(
    () => ({
      posts,
      availableTags,
      loading,
      error,
      getPostBySlug,
      refetch: load,
    }),
    [posts, availableTags, loading, error, getPostBySlug, load],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts debe usarse dentro de PostsProvider");
  }
  return ctx;
}
