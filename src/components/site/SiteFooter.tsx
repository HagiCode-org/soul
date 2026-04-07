import { useTranslation } from "react-i18next"

import { getFilingLinks, getFooterLinkSections, getSiteLinkRel, getSiteLinkTarget } from "@/components/site/site-links"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en-US"
  const footerLinkSections = getFooterLinkSections(t, locale)
  const filingLinks = getFilingLinks(t)

  return (
    <footer className="site-footer" role="contentinfo" aria-label={t("site.footer.ariaLabel")}>
      <div className="site-footer-grid">
        <section className="site-footer-brand" aria-label={t("site.footer.brandSectionAria")}>
          <p className="site-footer-eyebrow">HagiSoul</p>
          <h2 className="font-display text-3xl tracking-[0.03em]">HagiSoul</h2>
          <p className="max-w-[32rem] text-sm leading-7 text-muted-foreground">{t("site.footer.description")}</p>
          <p className="text-sm text-muted-foreground">{t("site.footer.copyright", { year: currentYear })}</p>
        </section>

        {footerLinkSections.map((section) => (
          <nav key={section.id} className="site-footer-section" aria-label={section.title}>
            <h2 className="site-footer-title">{section.title}</h2>
            <div className="site-footer-links">
              {section.links.map((link) => (
                <a
                  key={link.id}
                  className="site-footer-link"
                  href={link.href}
                  aria-label={link.ariaLabel}
                  target={getSiteLinkTarget(link)}
                  rel={getSiteLinkRel(link)}
                >
                  <span className="site-footer-link-text">{link.label}</span>
                  {link.description ? <span className="site-footer-link-description">{link.description}</span> : null}
                </a>
              ))}
            </div>
          </nav>
        ))}
      </div>

      <div className="site-footer-filings">
        {filingLinks.map((link) => (
          <a
            key={link.id}
            className="site-filing-link"
            href={link.href}
            aria-label={link.ariaLabel}
            target={getSiteLinkTarget(link)}
            rel={getSiteLinkRel(link)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
