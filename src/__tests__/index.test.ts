import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const pagePath = resolve(process.cwd(), 'src/pages/index.astro');

describe('Soul index Astro host Hagilight integration', () => {
  it('mounts the shared footer and banner around the hydrated React island', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).toContain('import Footer from "@hagicode/hagilight-core/Footer"');
    expect(source).toContain('import PromotoBanner from "@hagicode/hagilight-core/PromotoBanner"');
    expect(source).toContain('client:load');
    expect(source.indexOf('<SoulApp')).toBeLessThan(source.indexOf('<PromotoBanner'));
    expect(source.indexOf('<PromotoBanner')).toBeLessThan(source.indexOf('<Footer'));
  });

  it('configures the shared footer with Soul site identity and required filings', async () => {
    const source = await readFile(pagePath, 'utf8');

    expect(source).toContain('soul-builder');
    expect(source).toContain('https://soul.hagicode.com');
    expect(source).toContain('闽ICP备2026004153号-1');
    expect(source).toContain('闽公网安备35011102351148号');
    expect(source).toContain('mailto:support@hagicode.com');
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