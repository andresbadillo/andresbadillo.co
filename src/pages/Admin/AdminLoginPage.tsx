import { Seo } from "@/components/Seo/Seo";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import controls from "@/styles/formControls.module.scss";
import styles from "./AdminPage.module.scss";

export function AdminLoginPage() {
  const { loading, isAdmin, inactivityTimedOut, refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isAdmin) navigate("/admin/posts", { replace: true });
  }, [loading, isAdmin, navigate]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("No se pudo iniciar sesión. Revisa las credenciales.");
      setSubmitting(false);
      return;
    }

    const user = await refreshUser();
    if (user?.app_metadata?.role !== "admin") {
      await signOut();
      setError("La cuenta no tiene permisos de administración.");
      setSubmitting(false);
      return;
    }

    navigate("/admin/posts", { replace: true });
  };

  return (
    <section className={`container ${styles.page}`}>
      <Seo title="Admin — Andres Badillo" description="Acceso privado al editor del blog." noindex />
      <p className={styles.eyebrow}>Área privada / autenticación</p>
      <h1 className={styles.title}>Consola editorial</h1>
      <p className={styles.subtitle}>Acceso exclusivo para cuentas autorizadas.</p>
      {inactivityTimedOut ? (
        <p className={styles.error} role="status">
          La sesión se cerró tras 15 minutos de inactividad.
        </p>
      ) : null}

      {/* Mismos controles que el formulario de contacto (src/styles/formControls.module.scss). */}
      <form className={styles.loginForm} onSubmit={(event) => void onSubmit(event)}>
        <div className={styles.field}>
          <label className={controls.srOnly} htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            className={controls.input}
            type="email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={controls.srOnly} htmlFor="admin-password">
            Contraseña
          </label>
          <input
            id="admin-password"
            className={controls.input}
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? (
          <p className={controls.fieldError} role="alert">
            {error}
          </p>
        ) : null}
        <button className={controls.submit} type="submit" disabled={submitting}>
          {submitting ? "Verificando…" : "Iniciar sesión"}
        </button>
      </form>
    </section>
  );
}
