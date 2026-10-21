import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Seo } from "@/components/Seo/Seo";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRef } from "react";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";

export function ContactPage() {
  const { t } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={t("seoContactTitle")} description={t("seoContactDescription")} />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>{t("contactHeading")}</span>
        </h1>
        <ContactForm idPrefix="contact" />
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
