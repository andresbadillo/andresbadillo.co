import { Seo } from "@/components/Seo/Seo";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectsContext";
import { parseProjectCopy } from "@/data/projectMapper";
import { pickLocalized } from "@/i18n/locale";
import { supabase } from "@/lib/supabaseClient";
import type { ProjectRow } from "@/types/database";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.scss";

const PROJECT_COLUMNS = "id, slug, date, display_order, featured, anonymized, hero, tags, screens, copy";

export function AdminProjectsPage() {
  const { user, signOut } = useAuth();
  const { refetch } = useProjects();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .order("display_order", { ascending: true });
    if (queryError) {
      setError("No se pudo cargar la lista de proyectos.");
      setProjects([]);
    } else {
      setProjects((data ?? []) as ProjectRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const titleOf = (project: ProjectRow) => {
    const copy = project.copy && typeof project.copy === "object" && !Array.isArray(project.copy) ? project.copy : {};
    const es = parseProjectCopy("es" in copy ? copy.es : null);
    const en = parseProjectCopy("en" in copy ? copy.en : null);
    return pickLocalized("es", es.title, en.title) || project.slug;
  };

  const deleteProject = async (project: ProjectRow) => {
    const confirmed = window.confirm(`Eliminar definitivamente “${titleOf(project)}”?`);
    if (!confirmed) return;
    setBusyId(project.id);
    setMessage("");
    setError("");
    const { data: deleted, error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .select("id");
    if (deleteError || !deleted || deleted.length === 0) {
      setError("No se pudo eliminar el proyecto. Verifica la sesión y las políticas RLS.");
    } else {
      setMessage("Proyecto eliminado.");
      await loadProjects();
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
      <Seo title="Proyectos admin — Andres Badillo" description="Administración privada de proyectos." noindex />
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Consola editorial / proyectos</p>
          <h1 className={styles.title}>Proyectos</h1>
          <p className={styles.subtitle}>Los cambios guardados se publican inmediatamente. El orden es el de la página pública.</p>
        </div>
        <div className={styles.rowActions}>
          <Link className={styles.linkAction} to="/admin/posts">Publicaciones</Link>
          <Link className={styles.button} to="/admin/projects/new">Crear proyecto</Link>
        </div>
      </div>
      <div className={styles.shell}>
        <div className={styles.panel}>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {message ? <p className={styles.success} role="status">{message}</p> : null}
          {loading ? <p aria-live="polite">Cargando proyectos…</p> : null}
          {!loading && projects.length === 0 ? <p className={styles.empty}>No hay proyectos todavía.</p> : null}
          <ul className={styles.postList}>
            {projects.map((project) => (
              <li className={styles.postRow} key={project.id}>
                <span className={styles.order}>{String(project.display_order).padStart(2, "0")}</span>
                <div>
                  <h2 className={styles.postTitle}>{titleOf(project)}</h2>
                  <p className={styles.postMeta}>/{project.slug}</p>
                </div>
                <div className={styles.rowActions}>
                  <Link className={styles.linkAction} to={`/admin/projects/${project.id}/edit`}>Editar</Link>
                  <button className={styles.buttonDanger} type="button" disabled={busyId === project.id} onClick={() => void deleteProject(project)}>
                    {busyId === project.id ? "Eliminando…" : "Eliminar"}
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
          <button className={styles.linkAction} type="button" onClick={() => void logout()}>Cerrar sesión</button>
        </aside>
      </div>
    </section>
  );
}
