import { Seo } from "@/components/Seo/Seo";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./NotFoundPage.module.scss";

export function NotFoundPage() {
  const { t } = useLocale();
  return (
    <section className={`container ${styles.wrap}`}>
      <Seo title={t("seoNotFoundTitle")} description={t("seoNotFoundDescription")} noindex />
      <div className={styles.poem}>
        <h1>404</h1>
        <p>{t("notFoundLine1")}</p>
        <p>{t("notFoundLine2")}</p>
        <TransitionLink to="/">{t("backHome")}</TransitionLink>
      </div>
    </section>
  );
}
