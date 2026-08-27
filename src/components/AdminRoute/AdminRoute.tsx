import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import styles from "@/pages/Admin/AdminPage.module.scss";

export function AdminRoute() {
  const { loading, user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className={`container ${styles.page}`} aria-live="polite">
        Verificando acceso…
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <section className={`container ${styles.page}`}>
        <p className={styles.eyebrow}>Área privada / permisos</p>
        <h1 className={styles.title}>Acceso restringido</h1>
        <p>La cuenta autenticada no tiene permisos de administración.</p>
        <button className={styles.buttonSecondary} type="button" onClick={() => void signOut()}>
          Cerrar sesión
        </button>
      </section>
    );
  }

  return <Outlet />;
}
