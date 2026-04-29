import { useTranslation } from "react-i18next"

import { getFilingLinks, getFooterLinkSections, getSiteLinkRel, getSiteLinkTarget } from "@/components/site/site-links"
import { normalizeLocale } from "@/i18n/locales"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const { t, i18n } = useTranslation()
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language)
  const footerLinkSections = getFooterLinkSections(t, locale)
  const filingLinks = getFilingLinks(t)

  return (
    <footer id="soul-footer" className="site-footer" role="contentinfo" aria-label={t("site.footer.ariaLabel")}>
      <div className="site-footer-grid">
        <section className="site-footer-brand" aria-label={t("site.footer.brandSectionAria")}>
          <div className="site-window-dots" aria-hidden="true">
            <span className="site-window-dot" data-tone="red" />
            <span className="site-window-dot" data-tone="yellow" />
            <span className="site-window-dot" data-tone="green" />
          </div>
          <p className="site-footer-eyebrow">HagiSoul</p>
          <h2
            className="font-display text-[2.5rem] leading-[0.94] tracking-[-0.01em] sm:text-[3.4rem]"
            style={{ fontVariationSettings: '"wght" 500' }}
          >
            {t("site.footer.tagline")}
          </h2>
          <p className="max-w-[34rem] text-sm leading-7 text-muted-foreground sm:text-base">{t("site.footer.description")}</p>
          <p className="text-sm text-muted-foreground">{t("site.footer.copyright", { year: currentYear })}</p>
        </section>

        {footerLinkSections.map((section) => (
          <nav key={section.id} className="site-footer-section site-surface-soft rounded-[18px] p-4" aria-label={section.title}>
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
