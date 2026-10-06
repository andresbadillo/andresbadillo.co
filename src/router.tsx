import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/Home/HomePage";
import { PortfolioPage } from "@/pages/Portfolio/PortfolioPage";
import { ProjectDetailPage } from "@/pages/Portfolio/ProjectDetailPage";
import { BlogPage } from "@/pages/Blog/BlogPage";
import { BlogPostDetailPage } from "@/pages/Blog/BlogPostDetailPage";
import { BlogTagPage } from "@/pages/Blog/BlogTagPage";
import { AboutPage } from "@/pages/About/AboutPage";
import { ContactPage } from "@/pages/Contact/ContactPage";
import { PrivacyPolicyPage } from "@/pages/Legal/PrivacyPolicyPage";
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage";
import { AdminRoute } from "@/components/AdminRoute/AdminRoute";
import adminStyles from "@/pages/Admin/AdminPage.module.scss";

/* El admin se descarga aparte: quien visita el sitio público no carga su código. */
const AdminLoginPage = lazy(() =>
  import("@/pages/Admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
);
const AdminPostsPage = lazy(() =>
  import("@/pages/Admin/AdminPostsPage").then((m) => ({ default: m.AdminPostsPage })),
);
const AdminPostEditorPage = lazy(() =>
  import("@/pages/Admin/AdminPostEditorPage").then((m) => ({ default: m.AdminPostEditorPage })),
);

function AdminChunk({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <section className={`container ${adminStyles.page}`} aria-live="polite">
          Cargando consola…
        </section>
      }
    >
      {children}
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/tag/:tag" element={<BlogTagPage />} />
      <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/admin/login" element={<AdminChunk><AdminLoginPage /></AdminChunk>} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminChunk><AdminPostsPage /></AdminChunk>} />
        <Route path="/admin/posts" element={<AdminChunk><AdminPostsPage /></AdminChunk>} />
        <Route path="/admin/posts/new" element={<AdminChunk><AdminPostEditorPage mode="create" /></AdminChunk>} />
        <Route path="/admin/posts/:id/edit" element={<AdminChunk><AdminPostEditorPage mode="edit" /></AdminChunk>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
