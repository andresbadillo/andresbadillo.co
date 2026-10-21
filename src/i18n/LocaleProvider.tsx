import { ui, type MessageKey } from "@/data/ui";
import { otherLocale, readNavigatorLocale, type Locale } from "@/i18n/locale";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

interface LocaleContextValue {
  locale: Locale;
  t: (key: MessageKey, vars?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useMemo(() => readNavigatorLocale(), []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const translate = (key: MessageKey, vars?: Record<string, string>) => {
      const primary = ui[locale][key];
      const fallback = ui[otherLocale(locale)][key];
      let text = primary || fallback || key;
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, replacement);
        }
      }
      return text;
    };
    return { locale, t: translate };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale debe usarse dentro de LocaleProvider");
  }
  return context;
}
