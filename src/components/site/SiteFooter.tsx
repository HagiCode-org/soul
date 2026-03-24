import { filingLinks, footerLinkSections, getSiteLinkRel, getSiteLinkTarget } from "@/components/site/site-links"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo" aria-label="HagiSoul 页脚">
      <div className="site-footer-grid">
        <section className="site-footer-brand" aria-label="品牌说明">
          <p className="site-footer-eyebrow">HagiSoul</p>
          <h2 className="font-display text-3xl tracking-[0.03em]">HagiSoul</h2>
          <p className="max-w-[32rem] text-sm leading-7 text-muted-foreground">
            HagiSoul 聚焦开发者场景，提供更方便快捷的 Soul 创建、分享与浏览体验。
          </p>
          <p className="text-sm text-muted-foreground">© {currentYear} HagiCode. All rights reserved.</p>
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
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        ))}
      </div>

      {/* Footer values mirror the public HagiCode filing block without importing cross-repo runtime modules. */}
      <div className="site-footer-filings">
        {Object.values(filingLinks).map((link) => (
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
