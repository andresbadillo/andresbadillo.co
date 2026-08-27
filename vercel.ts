import { routes, type VercelConfig } from "@vercel/config/v1";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasePublishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required for deployment.");
}
if (supabasePublishableKey.startsWith("sb_secret_")) {
  throw new Error("A Supabase secret key must never be exposed to the frontend.");
}

const parsedSupabaseUrl = new URL(supabaseUrl);
if (parsedSupabaseUrl.protocol !== "https:") {
  throw new Error("VITE_SUPABASE_URL must use HTTPS for Vercel deployments.");
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src 'self' ${parsedSupabaseUrl.origin}`,
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src https://www.linkedin.com",
  "img-src 'self' data:",
  "manifest-src 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join("; ");

const config: VercelConfig = {
  framework: "vite",
  rewrites: [routes.rewrite("/(.*)", "/index.html")],
  headers: [
    routes.header("/(.*)", [
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
    ]),
  ],
};

export default config;
