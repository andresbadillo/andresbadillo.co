import { Seo } from "@/components/Seo/Seo";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.scss";

export function AdminLoginPage() {
  const { loading, isAdmin, refreshUser, signOut } = useAuth();
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
      <Seo title="Admin — Andres Badillo" description="Acceso privado al editor del blog." />
      <p className={styles.eyebrow}>Área privada / autenticación</p>
      <h1 className={styles.title}>Consola editorial</h1>
      <p className={styles.subtitle}>Acceso exclusivo para cuentas creadas y autorizadas en Supabase.</p>

      <div className={styles.loginPanel}>
        <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
          <div className={styles.field}>
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              className={styles.input}
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={submitting}>
              {submitting ? "Verificando…" : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
