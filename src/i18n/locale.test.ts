import { describe, expect, it } from "vitest";
import { pickLocalized, resolveLocale } from "@/i18n/locale";

describe("resolveLocale", () => {
  it("uses Spanish when the first compatible language starts with es", () => {
    expect(resolveLocale(["fr-FR", "es-CO", "en-US"])).toBe("es");
    expect(resolveLocale(["es"])).toBe("es");
  });

  it("uses English for any other case", () => {
    expect(resolveLocale(["en-US", "es-CO"])).toBe("en");
    expect(resolveLocale(["de-DE", "fr"])).toBe("en");
    expect(resolveLocale([])).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
  });
});

describe("pickLocalized", () => {
  it("falls back to the other language when the field is empty", () => {
    expect(pickLocalized("es", "", "English")).toBe("English");
    expect(pickLocalized("en", "Español", "  ")).toBe("Español");
    expect(pickLocalized("es", "Hola", "Hello")).toBe("Hola");
  });
});
