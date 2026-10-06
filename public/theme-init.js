/*
 * Fija el tema antes del primer pintado para que no parpadee. Misma clave y mismo criterio
 * que getInitialTheme en src/App.tsx. El color de theme-color coincide con --home-hero-bg
 * de src/styles/theme.scss.
 */
(function () {
  var theme;
  try {
    theme = localStorage.getItem("andres_badillo_theme");
  } catch (e) {
    theme = null;
  }
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#1a1a1a");
})();
