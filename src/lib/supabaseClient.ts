import { createClient } from "@supabase/supabase-js";

// URL del proyecto (Data API) y clave pública para el cliente web.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env (copia .env.example).");
}

// Cliente singleton reutilizado en toda la app para consultas a Supabase.
export const supabase = createClient(url, key);
