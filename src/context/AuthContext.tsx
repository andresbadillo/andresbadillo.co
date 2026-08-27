import { supabase } from "@/lib/supabaseClient";
import {
  ADMIN_LAST_ACTIVITY_KEY,
  getAdminInactivityRemainingMs,
} from "@/lib/adminInactivity";
import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  inactivityTimedOut: boolean;
  refreshUser: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const ACTIVITY_THROTTLE_MS = 1_000;
const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"] as const;

function hasAdminRole(user: User | null): boolean {
  return user?.app_metadata?.role === "admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimedOut, setInactivityTimedOut] = useState(false);

  const refreshUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setUser(null);
      return null;
    }
    setUser(data.user);
    if (data.user) setInactivityTimedOut(false);
    return data.user;
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY);
    await supabase.auth.signOut({ scope: "local" });
    setUser(null);
    setInactivityTimedOut(false);
  }, []);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (session?.user) setInactivityTimedOut(false);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hasAdminRole(user)) {
      localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastRecordedAt = 0;
    let expiring = false;

    const readStoredActivity = () => {
      const value = Number(localStorage.getItem(ADMIN_LAST_ACTIVITY_KEY));
      return Number.isFinite(value) && value > 0 ? value : null;
    };

    let lastActivityAt = readStoredActivity() ?? Date.now();
    localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(lastActivityAt));

    const expireSession = async () => {
      if (expiring) return;
      expiring = true;
      if (timeoutId) clearTimeout(timeoutId);
      localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY);
      await supabase.auth.signOut({ scope: "local" });
      setUser(null);
      setInactivityTimedOut(true);
    };

    const scheduleExpiration = () => {
      if (timeoutId) clearTimeout(timeoutId);
      const remaining = getAdminInactivityRemainingMs(lastActivityAt);
      if (remaining === 0) {
        void expireSession();
        return;
      }
      timeoutId = setTimeout(() => void expireSession(), remaining);
    };

    const registerActivity = () => {
      if (expiring) return;

      const now = Date.now();
      const storedActivity = readStoredActivity();
      if (storedActivity !== null) lastActivityAt = Math.max(lastActivityAt, storedActivity);

      if (getAdminInactivityRemainingMs(lastActivityAt, now) === 0) {
        void expireSession();
        return;
      }

      if (now - lastRecordedAt < ACTIVITY_THROTTLE_MS) return;
      lastRecordedAt = now;
      lastActivityAt = now;
      localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(lastActivityAt));
      scheduleExpiration();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") registerActivity();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== ADMIN_LAST_ACTIVITY_KEY || event.newValue === null) return;
      const activityAt = Number(event.newValue);
      if (!Number.isFinite(activityAt) || activityAt <= lastActivityAt) return;
      lastActivityAt = activityAt;
      scheduleExpiration();
    };

    scheduleExpiration();
    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, registerActivity, { passive: true });
    }
    window.addEventListener("focus", registerActivity);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, registerActivity);
      }
      window.removeEventListener("focus", registerActivity);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: hasAdminRole(user),
      inactivityTimedOut,
      refreshUser,
      signOut,
    }),
    [user, loading, inactivityTimedOut, refreshUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return value;
}
