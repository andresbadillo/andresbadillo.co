import { Seo } from "@/components/Seo/Seo";
import { usePosts } from "@/context/PostsContext";
import {
  COVER_KEYS,
  linkedInFrameToIframeCode,
  parseLinkedInIframeCode,
  postInputToInsert,
  postRowToInput,
  validatePostInput,
  type CoverKey,
  type PostInput,
  type PostValidationErrors,
} from "@/data/postValidation";
import type { LinkedInEmbedPair } from "@/data/posts";
import { supabase } from "@/lib/supabaseClient";
import type { PostRow } from "@/types/database";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./AdminPage.module.scss";

interface AdminPostEditorPageProps {
  mode: "create" | "edit";
}

interface EditorState {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  featured: boolean;
  tagsText: string;
  coverKey: CoverKey | "";
  displayOrder: string;
  useEmbed: boolean;
  compactCode: string;
  compactSrc: string;
  compactWidth: string;
  compactHeight: string;
  fullCode: string;
  fullSrc: string;
  fullWidth: string;
  fullHeight: string;
}

const POST_COLUMNS = "id, slug, title, excerpt, published_at, featured, tags, cover_key, linkedin_embed, display_order";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyState(): EditorState {
  return {
    slug: "",
    title: "",
    excerpt: "",
    publishedAt: todayUtc(),
    featured: false,
    tagsText: "",
    coverKey: "thumb-1",
    displayOrder: "0",
    useEmbed: false,
    compactCode: "",
    compactSrc: "",
    compactWidth: "504",
    compactHeight: "420",
    fullCode: "",
    fullSrc: "",
    fullWidth: "504",
    fullHeight: "760",
  };
}

function dimension(value: string): number | undefined {
  return value.trim() === "" ? undefined : Number(value);
}

function stateToInput(state: EditorState): PostInput {
  const linkedinEmbed: LinkedInEmbedPair | null = state.useEmbed
    ? {
        compact: {
          src: state.compactSrc.trim(),
          width: dimension(state.compactWidth),
          height: dimension(state.compactHeight),
        },
        full: {
          src: state.fullSrc.trim(),
          width: dimension(state.fullWidth),
          height: dimension(state.fullHeight),
        },
      }
    : null;

  return {
    slug: state.slug,
    title: state.title,
    excerpt: state.excerpt,
    publishedAt: state.publishedAt,
    featured: state.featured,
    tags: state.tagsText.split(","),
    coverKey: state.coverKey || null,
    linkedinEmbed,
    displayOrder: Number(state.displayOrder),
  };
}

function inputToState(input: PostInput): EditorState {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    publishedAt: input.publishedAt,
    featured: input.featured,
    tagsText: input.tags.join(", "),
    coverKey: input.coverKey ?? "",
    displayOrder: String(input.displayOrder),
    useEmbed: input.linkedinEmbed !== null,
    compactCode: input.linkedinEmbed ? linkedInFrameToIframeCode(input.linkedinEmbed.compact) : "",
    compactSrc: input.linkedinEmbed?.compact.src ?? "",
    compactWidth: String(input.linkedinEmbed?.compact.width ?? 504),
    compactHeight: String(input.linkedinEmbed?.compact.height ?? 420),
    fullCode: input.linkedinEmbed ? linkedInFrameToIframeCode(input.linkedinEmbed.full) : "",
    fullSrc: input.linkedinEmbed?.full.src ?? "",
    fullWidth: String(input.linkedinEmbed?.full.width ?? 504),
    fullHeight: String(input.linkedinEmbed?.full.height ?? 760),
  };
}

export function AdminPostEditorPage({ mode }: AdminPostEditorPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refetch } = usePosts();
  const [state, setState] = useState<EditorState>(emptyState);
  const [loading, setLoading] = useState(mode === "edit");
  const [postAvailable, setPostAvailable] = useState(mode === "create");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<PostValidationErrors>({});
  const [requestError, setRequestError] = useState("");

  const postId = mode === "edit" ? Number(id) : null;

  useEffect(() => {
    if (mode !== "edit") return;
    if (!Number.isInteger(postId) || postId === null || postId < 1) {
      setRequestError("El identificador del post no es válido.");
      setLoading(false);
      return;
    }

    let active = true;
    void supabase
      .from("posts")
      .select(POST_COLUMNS)
      .eq("id", postId)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setRequestError("No se encontró el post solicitado.");
        } else {
          setState(inputToState(postRowToInput(data as PostRow)));
          setPostAvailable(true);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mode, postId]);

  const update = <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
    setState((current) => ({ ...current, [field]: value }));
  };

  const updateEmbedCode = (variant: "compact" | "full", code: string) => {
    const parsed = parseLinkedInIframeCode(code);
    const codeField = variant === "compact" ? "compactCode" : "fullCode";
    const srcField = variant === "compact" ? "compactSrc" : "fullSrc";
    const widthField = variant === "compact" ? "compactWidth" : "fullWidth";
    const heightField = variant === "compact" ? "compactHeight" : "fullHeight";
    const errorField = variant === "compact" ? "linkedinCompact" : "linkedinFull";

    setState((current) => ({
      ...current,
      [codeField]: code,
      [srcField]: parsed.ok ? parsed.value.src : "",
      [widthField]: parsed.ok ? String(parsed.value.width ?? "") : "",
      [heightField]: parsed.ok ? String(parsed.value.height ?? "") : "",
    }));
    setErrors((current) => ({
      ...current,
      [errorField]: parsed.ok ? undefined : parsed.error,
      linkedinEmbed: undefined,
    }));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestError("");
    setErrors({});

    if (state.useEmbed) {
      const compactCode = parseLinkedInIframeCode(state.compactCode);
      const fullCode = parseLinkedInIframeCode(state.fullCode);
      if (!compactCode.ok || !fullCode.ok) {
        setErrors({
          linkedinCompact: compactCode.ok ? undefined : compactCode.error,
          linkedinFull: fullCode.ok ? undefined : fullCode.error,
        });
        return;
      }
    }

    const validation = validatePostInput(stateToInput(state));
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    const payload = postInputToInsert(validation.value);
    const result = postId === null
      ? await supabase.rpc("create_post_at_top", {
          p_slug: payload.slug,
          p_title: payload.title,
          p_excerpt: payload.excerpt,
          p_published_at: payload.published_at,
          p_featured: payload.featured ?? false,
          p_tags: payload.tags ?? [],
          p_cover_key: payload.cover_key ?? null,
          p_linkedin_embed: payload.linkedin_embed ?? null,
        })
      : await supabase.from("posts").update(payload).eq("id", postId).select("id").single();

    if (result.error) {
      if (result.error.code === "23505") {
        setErrors({ slug: "Ya existe un post con este slug." });
        setSaving(false);
        return;
      }
      setRequestError("No se pudo guardar la publicación. Intenta nuevamente.");
      setSaving(false);
      return;
    }

    refetch();
    navigate("/admin/posts", { replace: true });
  };

  if (loading) {
    return <section className={`container ${styles.page}`} aria-live="polite">Cargando editor…</section>;
  }

  if (!postAvailable) {
    return (
      <section className={`container ${styles.page}`}>
        <Seo title="Post no encontrado — Andres Badillo" description="El post solicitado no existe." />
        <p className={styles.eyebrow}>Consola editorial / error</p>
        <h1 className={styles.title}>Post no disponible</h1>
        <p className={styles.error} role="alert">{requestError}</p>
        <Link className={styles.buttonSecondary} to="/admin/posts">Volver a posts</Link>
      </section>
    );
  }

  return (
    <section className={`container ${styles.page}`}>
      <Seo
        title={`${mode === "create" ? "Crear" : "Editar"} post — Andres Badillo`}
        description="Editor privado de publicaciones."
      />
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Consola editorial / {mode === "create" ? "nuevo" : "edición"}</p>
          <h1 className={styles.title}>{mode === "create" ? "Crear publicación" : "Editar publicación"}</h1>
        </div>
        <Link className={styles.buttonSecondary} to="/admin/posts">Volver a posts</Link>
      </div>

      <div className={styles.panel}>
        {requestError ? <p className={styles.error} role="alert">{requestError}</p> : null}
        <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="post-title">Título</label>
              <input id="post-title" className={styles.input} value={state.title} onChange={(event) => update("title", event.target.value)} maxLength={120} required />
              {errors.title ? <span className={styles.error}>{errors.title}</span> : null}
            </div>
            <div className={styles.field}>
              <label htmlFor="post-slug">Slug</label>
              <input id="post-slug" className={styles.input} value={state.slug} onChange={(event) => update("slug", event.target.value)} maxLength={80} placeholder="mi-publicacion" required />
              {errors.slug ? <span className={styles.error}>{errors.slug}</span> : null}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="post-excerpt">Resumen</label>
            <textarea id="post-excerpt" className={styles.textarea} value={state.excerpt} onChange={(event) => update("excerpt", event.target.value)} maxLength={300} required />
            {errors.excerpt ? <span className={styles.error}>{errors.excerpt}</span> : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="post-date">Fecha de publicación</label>
            <input id="post-date" className={styles.input} type="date" value={state.publishedAt} onChange={(event) => update("publishedAt", event.target.value)} required />
            {errors.publishedAt ? <span className={styles.error}>{errors.publishedAt}</span> : null}
            {mode === "create" ? <span className={styles.hint}>La nueva publicación se guardará automáticamente en la posición 0.</span> : null}
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="post-tags">Etiquetas</label>
              <input id="post-tags" className={styles.input} value={state.tagsText} onChange={(event) => update("tagsText", event.target.value)} placeholder="React, Supabase, Web" />
              <span className={styles.hint}>Separadas por comas; máximo 10.</span>
              {errors.tags ? <span className={styles.error}>{errors.tags}</span> : null}
            </div>
            <div className={styles.field}>
              <label htmlFor="post-cover">Portada</label>
              <select id="post-cover" className={styles.select} value={state.coverKey} onChange={(event) => update("coverKey", event.target.value as CoverKey | "")}>
                <option value="">Sin portada específica</option>
                {COVER_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
              </select>
              <span className={styles.hint}>Con embed se muestra LinkedIn. Sin embed, esta opción usa thumb-1.</span>
              {errors.coverKey ? <span className={styles.error}>{errors.coverKey}</span> : null}
            </div>
          </div>

          <label className={styles.checkboxField}>
            <input type="checkbox" checked={state.featured} onChange={(event) => update("featured", event.target.checked)} />
            Marcar como destacado
          </label>

          <label className={styles.checkboxField}>
            <input type="checkbox" checked={state.useEmbed} onChange={(event) => update("useEmbed", event.target.checked)} />
            Usar embeds de LinkedIn
          </label>

          {state.useEmbed ? (
            <fieldset className={styles.fieldset}>
              <legend>Embeds permitidos</legend>
              <p className={styles.hint}>En LinkedIn, elige cada opción y pega aquí el código completo que aparece al pulsar “Copiar código”. Solo guardaremos la URL y las dimensiones.</p>

              <section className={styles.embedCard} aria-labelledby="compact-embed-title">
                <h2 id="compact-embed-title" className={styles.embedTitle}>Opción colapsada · menos texto</h2>
                <div className={styles.field}>
                  <label htmlFor="compact-code">Código iframe colapsado</label>
                  <textarea id="compact-code" className={`${styles.textarea} ${styles.codeInput}`} value={state.compactCode} onChange={(event) => updateEmbedCode("compact", event.target.value)} placeholder={'<iframe src="https://www.linkedin.com/embed/…" width="504" height="420"></iframe>'} spellCheck={false} required />
                  {errors.linkedinCompact ? <span className={styles.error}>{errors.linkedinCompact}</span> : null}
                  {!errors.linkedinCompact && state.compactSrc ? <span className={styles.success}>Código leído. Puedes ajustar ancho y alto.</span> : null}
                </div>
                <div className={styles.field}>
                  <label htmlFor="compact-src">URL extraída</label>
                  <input id="compact-src" className={`${styles.input} ${styles.readonlyInput}`} type="url" value={state.compactSrc} readOnly aria-readonly="true" />
                </div>
                <div className={styles.embedGrid}>
                  <div className={styles.field}>
                    <label htmlFor="compact-width">Ancho</label>
                    <input id="compact-width" className={styles.input} type="number" min="320" max="800" value={state.compactWidth} onChange={(event) => update("compactWidth", event.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="compact-height">Alto</label>
                    <input id="compact-height" className={styles.input} type="number" min="200" max="1000" value={state.compactHeight} onChange={(event) => update("compactHeight", event.target.value)} />
                  </div>
                </div>
              </section>

              <section className={styles.embedCard} aria-labelledby="full-embed-title">
                <h2 id="full-embed-title" className={styles.embedTitle}>Opción completa · publicación completa</h2>
                <div className={styles.field}>
                  <label htmlFor="full-code">Código iframe completo</label>
                  <textarea id="full-code" className={`${styles.textarea} ${styles.codeInput}`} value={state.fullCode} onChange={(event) => updateEmbedCode("full", event.target.value)} placeholder={'<iframe src="https://www.linkedin.com/embed/…" width="504" height="760"></iframe>'} spellCheck={false} required />
                  {errors.linkedinFull ? <span className={styles.error}>{errors.linkedinFull}</span> : null}
                  {!errors.linkedinFull && state.fullSrc ? <span className={styles.success}>Código leído. Puedes ajustar ancho y alto.</span> : null}
                </div>
                <div className={styles.field}>
                  <label htmlFor="full-src">URL extraída</label>
                  <input id="full-src" className={`${styles.input} ${styles.readonlyInput}`} type="url" value={state.fullSrc} readOnly aria-readonly="true" />
                </div>
                <div className={styles.embedGrid}>
                  <div className={styles.field}>
                    <label htmlFor="full-width">Ancho</label>
                    <input id="full-width" className={styles.input} type="number" min="320" max="800" value={state.fullWidth} onChange={(event) => update("fullWidth", event.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="full-height">Alto</label>
                    <input id="full-height" className={styles.input} type="number" min="200" max="1000" value={state.fullHeight} onChange={(event) => update("fullHeight", event.target.value)} />
                  </div>
                </div>
              </section>
              {errors.linkedinEmbed ? <p className={styles.error}>{errors.linkedinEmbed}</p> : null}
            </fieldset>
          ) : null}

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            <Link className={styles.buttonSecondary} to="/admin/posts">Cancelar</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
