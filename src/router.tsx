import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/Home/HomePage";
import { PortfolioPage } from "@/pages/Portfolio/PortfolioPage";
import { ProjectDetailPage } from "@/pages/Portfolio/ProjectDetailPage";
import { BlogPage } from "@/pages/Blog/BlogPage";
import { BlogTagPage } from "@/pages/Blog/BlogTagPage";
import { AboutPage } from "@/pages/About/AboutPage";
import { ContactPage } from "@/pages/Contact/ContactPage";
import { PrivacyPolicyPage } from "@/pages/Legal/PrivacyPolicyPage";
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/tag/:tag" element={<BlogTagPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
