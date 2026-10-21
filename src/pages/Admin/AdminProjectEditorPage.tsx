import { Seo } from "@/components/Seo/Seo";
import { mockIds, type MockId } from "@/components/mocks/mockIds";
import { useProjects } from "@/context/ProjectsContext";
import { parseProjectCopy } from "@/data/projectMapper";
import {
  copyToDraft,
  draftToCopy,
  emptyDraft,
  isBlankCopy,
  validateProjectInput,
  type CopyDraft,
  type ProjectErrors,
} from "@/data/projectValidation";
import { supabase } from "@/lib/supabaseClient";
import type { Json, ProjectRow } from "@/types/database";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./AdminPage.module.scss";

interface AdminProjectEditorPageProps {
  mode: "create" | "edit";
}

const PROJECT_COLUMNS = "id, slug, date, display_order, featured, anonymized, hero, tags, screens, copy";

function Field({ id, label, value, onChange, area = false }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {area ? (
        <textarea id={id} className={styles.textarea} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} className={styles.input} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function LocaleColumn({ prefix, title, draft, onChange }: {
  prefix: string;
  title: string;
  draft: CopyDraft;
  onChange: (draft: CopyDraft) => void;
}) {
  const set = (key: keyof CopyDraft) => (value: string) => onChange({ ...draft, [key]: value });
  return (
    <section className={styles.embedCard} aria-labelledby={`${prefix}-title`}>
      <h2 id={`${prefix}-title`} className={styles.embedTitle}>{title}</h2>
      <Field id={`${prefix}-title-field`} label="Título" value={draft.title} onChange={set("title")} />
      <Field id={`${prefix}-excerpt`} label="Extracto" value={draft.excerpt} onChange={set("excerpt")} area />
      <Field id={`${prefix}-lead`} label="Apertura" value={draft.lead} onChange={set("lead")} area />
      <Field id={`${prefix}-summary`} label="Resumen (un párrafo por línea)" value={draft.summary} onChange={set("summary")} area />
      <Field id={`${prefix}-facts`} label="Datos (etiqueta | valor)" value={draft.facts} onChange={set("facts")} area />
      <Field id={`${prefix}-paragraphs`} label="Contexto (un párrafo por línea)" value={draft.paragraphs} onChange={set("paragraphs")} area />
      <Field id={`${prefix}-question`} label="Pregunta" value={draft.question} onChange={set("question")} area />
      <Field id={`${prefix}-novelty`} label="Novedad" value={draft.novelty} onChange={set("novelty")} area />
      <Field id={`${prefix}-challenges`} label="Retos (título | texto)" value={draft.challenges} onChange={set("challenges")} area />
      <Field id={`${prefix}-method`} label="Método (un punto por línea)" value={draft.method} onChange={set("method")} area />
      <Field id={`${prefix}-stack`} label="Stack (tecnología | rol)" value={draft.stack} onChange={set("stack")} area />
      <Field id={`${prefix}-architecture`} label="Módulos (nombre | descripción)" value={draft.architecture} onChange={set("architecture")} area />
      <Field id={`${prefix}-flow`} label="Flujo (un paso por línea)" value={draft.flow} onChange={set("flow")} area />
      <Field id={`${prefix}-features`} label="Funcionalidades (título | texto)" value={draft.features} onChange={set("features")} area />
      <Field id={`${prefix}-s1`} label="Pantalla 1 · título" value={draft.screenTitle1} onChange={set("screenTitle1")} />
      <Field id={`${prefix}-c1`} label="Pantalla 1 · pie" value={draft.screenCaption1} onChange={set("screenCaption1")} area />
      <Field id={`${prefix}-s2`} label="Pantalla 2 · título" value={draft.screenTitle2} onChange={set("screenTitle2")} />
      <Field id={`${prefix}-c2`} label="Pantalla 2 · pie" value={draft.screenCaption2} onChange={set("screenCaption2")} area />
      <Field id={`${prefix}-stats`} label="Impacto · cifras (valor | etiqueta)" value={draft.stats} onChange={set("stats")} area />
      <Field id={`${prefix}-rows`} label="Impacto · tabla (indicador | antes | ahora)" value={draft.rows} onChange={set("rows")} area />
      <Field id={`${prefix}-closing`} label="Cierre" value={draft.closing} onChange={set("closing")} area />
    </section>
  );
}

function mockFrom(value: unknown): MockId {
  return typeof value === "string" && (mockIds as readonly string[]).includes(value) ? value as MockId : mockIds[0];
}

export function AdminProjectEditorPage({ mode }: AdminProjectEditorPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refetch } = useProjects();
  const projectId = mode === "edit" ? Number(id) : null;
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featured, setFeatured] = useState(false);
  const [anonymized, setAnonymized] = useState(false);
  const [hero, setHero] = useState<MockId>(mockIds[0]);
  const [tagsText, setTagsText] = useState("");
  const [screenA, setScreenA] = useState<MockId>(mockIds[0]);
  const [screenB, setScreenB] = useState<MockId>(mockIds[1] ?? mockIds[0]);
  const [esDraft, setEsDraft] = useState<CopyDraft>(emptyDraft);
  const [enDraft, setEnDraft] = useState<CopyDraft>(emptyDraft);
  const [errors, setErrors] = useState<ProjectErrors>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [available, setAvailable] = useState(mode === "create");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || projectId === null || !Number.isInteger(projectId)) return;
    let active = true;
    void (async () => {
      const { data, error } = await supabase.from("projects").select(PROJECT_COLUMNS).eq("id", projectId).maybeSingle();
      if (!active) return;
      if (error || !data) {
        setRequestError("No se encontró el proyecto.");
        setAvailable(false);
        setLoading(false);
        return;
      }
      const row = data as ProjectRow;
      const copy = row.copy && typeof row.copy === "object" && !Array.isArray(row.copy) ? row.copy : {};
      const screens = Array.isArray(row.screens) ? row.screens : [];
      setSlug(row.slug);
      setDate(row.date);
      setDisplayOrder(String(row.display_order));
      setFeatured(row.featured);
      setAnonymized(row.anonymized);
      setHero(mockFrom(row.hero));
      setTagsText((row.tags ?? []).join(", "));
      setScreenA(mockFrom(screens[0] && typeof screens[0] === "object" ? (screens[0] as { mock?: string }).mock : ""));
      setScreenB(mockFrom(screens[1] && typeof screens[1] === "object" ? (screens[1] as { mock?: string }).mock : ""));
      setEsDraft(copyToDraft(parseProjectCopy("es" in copy ? copy.es : null)));
      setEnDraft(copyToDraft(parseProjectCopy("en" in copy ? copy.en : null)));
      setAvailable(true);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [mode, projectId]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestError("");
    const es = draftToCopy(esDraft);
    const en = draftToCopy(enDraft);
    const validation = validateProjectInput({
      slug,
      date,
      displayOrder: Number(displayOrder),
      featured,
      anonymized,
      hero,
      tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      screens: [screenA, screenB],
      es: isBlankCopy(es) ? null : es,
      en: isBlankCopy(en) ? null : en,
    });
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSaving(true);
    const value = validation.value;
    const copy: Json = {
      ...(value.es ? { es: value.es as unknown as Json } : {}),
      ...(value.en ? { en: value.en as unknown as Json } : {}),
    };
    const payload = {
      slug: value.slug,
      date: value.date,
      display_order: value.displayOrder,
      featured: value.featured,
      anonymized: value.anonymized,
      hero: value.hero,
      tags: value.tags,
      screens: [{ mock: value.screens[0] }, { mock: value.screens[1] }] as unknown as Json,
      copy,
    };
    const result = projectId === null
      ? await supabase.from("projects").insert(payload).select("id").single()
      : await supabase.from("projects").update(payload).eq("id", projectId).select("id").single();
    if (result.error) {
      setRequestError(result.error.code === "23505"
        ? "Ya existe un proyecto con este slug o con este orden."
        : "No se pudo guardar el proyecto. Intenta nuevamente.");
      setSaving(false);
      return;
    }
    refetch();
    navigate("/admin/projects", { replace: true });
  };

  if (loading) {
    return <section className={`container ${styles.page}`} aria-live="polite">Cargando editor…</section>;
  }
  if (!available) {
    return (
      <section className={`container ${styles.page}`}>
        <h1 className={styles.title}>Proyecto no disponible</h1>
        <p className={styles.error} role="alert">{requestError}</p>
        <Link className={styles.linkAction} to="/admin/projects">Volver a proyectos</Link>
      </section>
    );
  }

  return (
    <section className={`container ${styles.page}`}>
      <Seo title={`${mode === "create" ? "Crear" : "Editar"} proyecto — Andres Badillo`} description="Editor privado de proyectos." noindex />
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Consola editorial / {mode === "create" ? "nuevo proyecto" : "edición"}</p>
          <h1 className={styles.title}>{mode === "create" ? "Crear proyecto" : "Editar proyecto"}</h1>
        </div>
        <Link className={styles.linkAction} to="/admin/projects">Volver a proyectos</Link>
      </div>
      <div className={styles.panel}>
        {requestError ? <p className={styles.error} role="alert">{requestError}</p> : null}
        <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
          <div className={styles.fieldGrid}>
            <Field id="project-slug" label="Slug" value={slug} onChange={setSlug} />
            <Field id="project-date" label="Fecha (AAAA-MM)" value={date} onChange={setDate} />
          </div>
          {errors.slug ? <span className={styles.error}>{errors.slug}</span> : null}
          {errors.date ? <span className={styles.error}>{errors.date}</span> : null}
          <div className={styles.fieldGrid}>
            <Field id="project-order" label="Orden" value={displayOrder} onChange={setDisplayOrder} />
            <div className={styles.field}>
              <label htmlFor="project-hero">Maqueta de portada</label>
              <select id="project-hero" className={styles.select} value={hero} onChange={(event) => setHero(event.target.value as MockId)}>
                {mockIds.map((mock) => <option key={mock} value={mock}>{mock}</option>)}
              </select>
            </div>
          </div>
          {errors.displayOrder ? <span className={styles.error}>{errors.displayOrder}</span> : null}
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="project-screen-a">Maqueta 1</label>
              <select id="project-screen-a" className={styles.select} value={screenA} onChange={(event) => setScreenA(event.target.value as MockId)}>
                {mockIds.map((mock) => <option key={mock} value={mock}>{mock}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="project-screen-b">Maqueta 2</label>
              <select id="project-screen-b" className={styles.select} value={screenB} onChange={(event) => setScreenB(event.target.value as MockId)}>
                {mockIds.map((mock) => <option key={mock} value={mock}>{mock}</option>)}
              </select>
            </div>
          </div>
          {errors.screens ? <span className={styles.error}>{errors.screens}</span> : null}
          <Field id="project-tags" label="Etiquetas técnicas, separadas por comas" value={tagsText} onChange={setTagsText} />
          <label className={styles.checkboxField}>
            <input type="checkbox" checked={anonymized} onChange={(event) => setAnonymized(event.target.checked)} />
            Proyecto anonimizado
          </label>
          <label className={styles.checkboxField}>
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            Destacado (se guarda; la home no lo usa)
          </label>
          <div className={styles.fieldGrid}>
            <LocaleColumn prefix="es" title="Español" draft={esDraft} onChange={setEsDraft} />
            <LocaleColumn prefix="en" title="Inglés" draft={enDraft} onChange={setEnDraft} />
          </div>
          {errors.copy ? <p className={styles.error}>{errors.copy}</p> : null}
          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
            <Link className={styles.linkAction} to="/admin/projects">Cancelar</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
