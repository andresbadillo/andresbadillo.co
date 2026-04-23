import thumb1 from "@/assets/placeholders/thumb-1.svg";
import thumb2 from "@/assets/placeholders/thumb-2.svg";
import project1 from "@/assets/placeholders/project-1.svg";
import project2 from "@/assets/placeholders/project-2.svg";
import project3 from "@/assets/placeholders/project-3.svg";

const COVER_BY_KEY: Record<string, string> = {
  "thumb-1": thumb1,
  "thumb-2": thumb2,
  "project-1": project1,
  "project-2": project2,
  "project-3": project3,
};

const DEFAULT_KEY = "thumb-1";

export function coverKeyToImageUrl(coverKey: string | null | undefined): string {
  if (!coverKey) return COVER_BY_KEY[DEFAULT_KEY] ?? thumb1;
  return COVER_BY_KEY[coverKey] ?? COVER_BY_KEY[DEFAULT_KEY] ?? thumb1;
}
