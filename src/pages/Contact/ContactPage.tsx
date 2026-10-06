import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Seo } from "@/components/Seo/Seo";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import { useRef } from "react";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";

export function ContactPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Contact — Andres Badillo" description="Escríbeme sobre producto, datos o frontend." />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Contact</span>
        </h1>
        <ContactForm idPrefix="contact" />
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
