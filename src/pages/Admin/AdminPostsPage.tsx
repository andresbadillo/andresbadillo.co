import { Seo } from "@/components/Seo/Seo";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";
import { supabase } from "@/lib/supabaseClient";
import type { PostRow } from "@/types/database";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.scss";

const POST_COLUMNS = "id, slug, title, excerpt, published_at, featured, tags, cover_key, linkedin_embed, display_order";

export function AdminPostsPage() {
  const { user, signOut } = useAuth();
  const { refetch } = usePosts();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("posts")
      .select(POST_COLUMNS)
      .order("display_order", { ascending: true });
    if (queryError) {
      setError("No se pudo cargar la lista de posts.");
      setPosts([]);
    } else {
      setPosts(data as PostRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const deletePost = async (post: PostRow) => {
    const confirmed = window.confirm(`Eliminar definitivamente “${post.title}”?`);
    if (!confirmed) return;

    setBusyId(post.id);
    setMessage("");
    setError("");
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", post.id);
    if (deleteError) {
      setError("No se pudo eliminar el post. Verifica la sesión y las políticas RLS.");
    } else {
      setMessage("Post eliminado.");
      await loadPosts();
      refetch();
    }
    setBusyId(null);
  };

  const logout = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <section className={`container ${styles.page}`}>
      <Seo title="Posts admin — Andres Badillo" description="Administración privada de publicaciones." />
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Consola editorial / posts</p>
          <h1 className={styles.title}>Publicaciones</h1>
          <p className={styles.subtitle}>Los cambios guardados se publican inmediatamente.</p>
        </div>
        <Link className={styles.button} to="/admin/posts/new">Crear post</Link>
      </div>

      <div className={styles.shell}>
        <div className={styles.panel}>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {message ? <p className={styles.success} role="status">{message}</p> : null}
          {loading ? <p aria-live="polite">Cargando publicaciones…</p> : null}
          {!loading && posts.length === 0 ? <p className={styles.empty}>No hay publicaciones todavía.</p> : null}
          <ul className={styles.postList}>
            {posts.map((post) => (
              <li className={styles.postRow} key={post.id}>
                <span className={styles.order}>{String(post.display_order).padStart(2, "0")}</span>
                <div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postMeta}>/{post.slug} · {post.published_at.slice(0, 10)}</p>
                </div>
                <div className={styles.rowActions}>
                  <Link className={styles.buttonSecondary} to={`/admin/posts/${post.id}/edit`}>Editar</Link>
                  <button
                    className={styles.buttonDanger}
                    type="button"
                    disabled={busyId === post.id}
                    onClick={() => void deletePost(post)}
                  >
                    {busyId === post.id ? "Eliminando…" : "Eliminar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.statusRail} aria-label="Estado de la sesión">
          <span className={styles.statusLabel}>Sesión</span>
          <span className={`${styles.statusValue} ${styles.statusOk}`}>Autorizada</span>
          <span className={styles.statusLabel}>Cuenta</span>
          <span className={styles.statusValue}>{user?.email ?? "—"}</span>
          <span className={styles.statusLabel}>Rol</span>
          <span className={styles.statusValue}>admin</span>
          <button className={styles.textButton} type="button" onClick={() => void logout()}>Cerrar sesión</button>
        </aside>
      </div>
    </section>
  );
}
