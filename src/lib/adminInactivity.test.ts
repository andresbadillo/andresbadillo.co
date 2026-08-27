import { describe, expect, it } from "vitest";
import {
  ADMIN_INACTIVITY_TIMEOUT_MS,
  getAdminInactivityRemainingMs,
} from "./adminInactivity";

describe("admin inactivity timeout", () => {
  it("mantiene la sesión antes de cumplir 15 minutos", () => {
    expect(getAdminInactivityRemainingMs(1_000, 1_000 + ADMIN_INACTIVITY_TIMEOUT_MS - 1)).toBe(1);
  });

  it("vence exactamente a los 15 minutos", () => {
    expect(getAdminInactivityRemainingMs(1_000, 1_000 + ADMIN_INACTIVITY_TIMEOUT_MS)).toBe(0);
  });

  it("permanece vencida después del límite", () => {
    expect(getAdminInactivityRemainingMs(1_000, 1_000 + ADMIN_INACTIVITY_TIMEOUT_MS + 60_000)).toBe(0);
  });
});

