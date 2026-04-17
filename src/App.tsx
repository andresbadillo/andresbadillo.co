import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppRouter } from "@/router";
import { SiteLayout } from "@/layouts/SiteLayout";
import { CurtainProvider } from "@/components/CurtainTransition/CurtainTransition";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";

const THEME_KEY = "andres_badillo_theme";

const getInitialTheme = (): "dark" | "light" => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CurtainProvider>
        <SiteLayout theme={theme} onThemeChange={setTheme}>
          <AppRouter />
        </SiteLayout>
      </CurtainProvider>
    </BrowserRouter>
  );
}
