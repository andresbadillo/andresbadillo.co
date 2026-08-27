export const ADMIN_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
export const ADMIN_LAST_ACTIVITY_KEY = "andres_badillo_admin_last_activity";

export function getAdminInactivityRemainingMs(
  lastActivityAt: number,
  now = Date.now(),
): number {
  return Math.max(0, lastActivityAt + ADMIN_INACTIVITY_TIMEOUT_MS - now);
}

