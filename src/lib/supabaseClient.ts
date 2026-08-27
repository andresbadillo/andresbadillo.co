import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// URL del proyecto (Data API) y clave pública para el cliente web.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env (copia .env.example).");
}

if (key.startsWith("sb_secret_")) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY no puede contener una clave secreta de Supabase.");
}

const parsedUrl = new URL(url);
const isLocalSupabase = parsedUrl.hostname === "127.0.0.1" || parsedUrl.hostname === "localhost";
if (parsedUrl.protocol !== "https:" && !isLocalSupabase) {
  throw new Error("VITE_SUPABASE_URL debe usar HTTPS fuera del entorno local.");
}

// Cliente singleton reutilizado en toda la app para consultas a Supabase.
export const supabase = createClient<Database>(url, key, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false,
    persistSession: true,
  },
});
