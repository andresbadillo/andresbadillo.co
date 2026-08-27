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
import { AdminLoginPage } from "@/pages/Admin/AdminLoginPage";
import { AdminPostsPage } from "@/pages/Admin/AdminPostsPage";
import { AdminPostEditorPage } from "@/pages/Admin/AdminPostEditorPage";

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
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPostsPage />} />
        <Route path="/admin/posts" element={<AdminPostsPage />} />
        <Route path="/admin/posts/new" element={<AdminPostEditorPage mode="create" />} />
        <Route path="/admin/posts/:id/edit" element={<AdminPostEditorPage mode="edit" />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
