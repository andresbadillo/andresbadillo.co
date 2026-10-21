/*
 * Fija el idioma antes del primer pintado. El mismo criterio está en src/i18n/locale.ts:
 * español si el primer idioma compatible de navigator.languages empieza por "es";
 * inglés en cualquier otro caso.
 */
(function () {
  var languages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ""];
  var locale = "en";
  for (var i = 0; i < languages.length; i++) {
    var tag = String(languages[i] || "").toLowerCase();
    if (tag.indexOf("es") === 0) {
      locale = "es";
      break;
    }
    if (tag.indexOf("en") === 0) {
      locale = "en";
      break;
    }
  }
  document.documentElement.lang = locale;
  document.documentElement.setAttribute("data-locale", locale);
})();
