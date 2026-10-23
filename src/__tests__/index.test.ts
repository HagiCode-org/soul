import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const pagePath = resolve(process.cwd(), 'src/pages/index.astro');
const astroConfigPath = resolve(process.cwd(), 'astro.config.mjs');
const packagePath = resolve(process.cwd(), 'package.json');

describe('Soul index Astro host Hagilight integration', () => {
  it('mounts the shared footer and banner around the hydrated React island', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).toContain('import Footer from "@hagicode/hagilight/Footer"');
    expect(source).toContain('import PromotoBanner from "@hagicode/hagilight-core/PromotoBanner"');
    expect(source).toContain('client:load');
    expect(source.indexOf('<SoulApp')).toBeLessThan(source.indexOf('<PromotoBanner'));
    expect(source.indexOf('<PromotoBanner')).toBeLessThan(source.indexOf('<Footer'));
  });

  it('pins the Hagilight packages to the same exact version the test reads from the manifest', async () => {
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
    const pin = packageJson.devDependencies?.['@hagicode/hagilight'];
    const corePin = packageJson.devDependencies?.['@hagicode/hagilight-core'];

    expect(pin).toMatch(/^\d+\.\d+\.\d+$/u);
    expect(corePin).toBe(pin);
    expect(packageJson.dependencies?.['@hagicode/hagilight']).toBeUndefined();
    expect(packageJson.dependencies?.['@hagicode/hagilight-starlight']).toBeUndefined();
  });

  it('registers the Hagilight integration and favicon in the Astro config', async () => {
    const config = await readFile(astroConfigPath, 'utf8');

    expect(config).toMatch(/import \{ hagilight, hagilightFavicon \} from "@hagicode\/hagilight\/integration"/u);
    expect(config).toMatch(/integrations:\s*\[react\(\),\s*hagilightFavicon\(\),\s*hagilight\(\)\]/u);
  });

  it('does not keep hand-written discovery or icon files that Hagilight generates', () => {
    for (const file of ['robots.txt', 'sitemap.xml', 'favicon.ico', 'favicon.svg']) {
      expect(existsSync(resolve(process.cwd(), 'public', file)), file).toBe(false);
    }
  });

  it('renders the static head through SEOHead and loads 51LA through the shared component', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).toContain('import SEOHead from "@hagicode/hagilight/SEOHead"');
    expect(source).toContain('<SEOHead');
    expect(source).toContain('structuredData={soulStructuredData}');
    expect(source).toContain('import Analytics51LA from "@hagicode/hagilight-core/Analytics51LA"');
    expect(source).toContain('<Analytics51LA siteId={import.meta.env.VITE_51LA_ID || "L6b88a5yK4h2Xnci"} />');
    expect(source).not.toMatch(/rel="icon"|rel="sitemap"|application\/rss\+xml/u);
  });

  it('configures the shared footer with Soul site identity and required filings', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).toContain('soul-builder');
    expect(source).toContain('https://soul.hagicode.com');
    expect(source).toContain('闽ICP备2026004153号-1');
    expect(source).toContain('闽公网安备35011102351148号');
    // The contact email is a Hagilight default; repeating it as an extra link is dropped by the footer.
    expect(source).not.toContain('mailto:support@hagicode.com');
    expect(source).toContain('store.steampowered.com/app/4625540/Hagicode');
  });

  it('pre-renders a locale template per secondary language and coordinates the live footer', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).toContain('template data-locale');
    expect(source).toContain("querySelector('footer.hagilight-footer')");
    expect(source).toContain("document.querySelector(`template[data-locale=");
  });

  it('removes the legacy local SiteFooter and PromoteCard', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).not.toMatch(/site\/SiteFooter|promote\/PromoteCard|data-promote-card|class="site-footer"/u);
  });
});
