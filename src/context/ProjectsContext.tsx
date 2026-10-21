import { rowToProject } from "@/data/projectMapper";
import type { Project } from "@/data/projectModel";
import { useLocale } from "@/i18n/LocaleProvider";
import { supabase } from "@/lib/supabaseClient";
import type { ProjectRow } from "@/types/database";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const PROJECT_COLUMNS =
  "id, slug, date, display_order, featured, anonymized, hero, tags, screens, copy";

interface ProjectsContextValue {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  getProjectBySlug: (slug: string) => Project | undefined;
  refetch: () => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    void (async () => {
      const { data, error: queryError } = await supabase
        .from("projects")
        .select(PROJECT_COLUMNS)
        .order("display_order", { ascending: true });
      if (queryError) {
        setError(new Error(queryError.message));
        setProjects([]);
        setLoading(false);
        return;
      }
      const rows = (data ?? []) as ProjectRow[];
      setProjects(rows.flatMap((row) => {
        const project = rowToProject(row, locale);
        return project ? [project] : [];
      }));
      setLoading(false);
    })();
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  const getProjectBySlug = useCallback(
    (slug: string) => projects.find((project) => project.slug === slug),
    [projects],
  );

  const value = useMemo<ProjectsContextValue>(
    () => ({ projects, loading, error, getProjectBySlug, refetch: load }),
    [projects, loading, error, getProjectBySlug, load],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects debe usarse dentro de ProjectsProvider");
  }
  return context;
}
