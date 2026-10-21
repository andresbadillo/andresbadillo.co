export type Locale = "es" | "en";

/** Primer idioma compatible: es* gana español; en* gana inglés; si no hay ninguno, inglés. */
export function resolveLocale(languages: readonly string[] | undefined): Locale {
  for (const language of languages ?? []) {
    const tag = language.trim().toLowerCase();
    if (tag.startsWith("es")) return "es";
    if (tag.startsWith("en")) return "en";
  }
  return "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function readNavigatorLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const list = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];
  return resolveLocale(list);
}

/** Un campo vacío usa el otro idioma. */
export function pickLocalized(
  locale: Locale,
  es: string | null | undefined,
  en: string | null | undefined,
): string {
  const primary = (locale === "es" ? es : en)?.trim() ?? "";
  const fallback = (locale === "es" ? en : es)?.trim() ?? "";
  return primary || fallback;
}
