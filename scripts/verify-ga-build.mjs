import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Checks the built Soul homepage: one shared analytics setup, one footer and one banner, the footer
// build line and attribution, the generated discovery files, and feed links that resolve.
const projectDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(projectDirectory, "../dist")
const origin = "https://soul.hagicode.com"

const [html, robots, sitemapIndex, llms] = await Promise.all([
  readFile(path.join(outputDirectory, "index.html"), "utf-8"),
  readFile(path.join(outputDirectory, "robots.txt"), "utf-8"),
  readFile(path.join(outputDirectory, "sitemap-index.xml"), "utf-8"),
  readFile(path.join(outputDirectory, "llms.txt"), "utf-8"),
])

const expectOne = (count, label) => {
  if (count !== 1) {
    throw new Error(`Built homepage must contain exactly one ${label}, found ${count}`)
  }
}
const countOccurrences = (source, pattern) => source.split(pattern).length - 1
const countMatches = (source, regex) => [...source.matchAll(regex)].length

// Locale footers are pre-rendered inside <template data-locale>; they are not visible on the page.
const localeTemplatePattern = /<template\s+data-locale="([^"]+)"[^>]*>([\s\S]*?)<\/template>/gu
const localeTemplates = [...html.matchAll(localeTemplatePattern)]
const visibleHtml = html.replace(localeTemplatePattern, "")

expectOne(countOccurrences(html, "https://www.googletagmanager.com/gtag/js?id=G-EN03FMT2Q4"), "Google Analytics loader")
expectOne(countOccurrences(html, `gtag('config', "G-EN03FMT2Q4")`), "Google Analytics gtag('config') initialization")
expectOne(countMatches(html, /<script[^>]*GoogleAnalytics\.astro_astro_type_script[^>]*>/gu), "click-listener script")
expectOne(countOccurrences(html, "sdk.51.la/js-sdk-pro.min.js"), "51LA SDK loader")
expectOne(countOccurrences(html, "LA.init("), "51LA initialization")
expectOne(countOccurrences(visibleHtml, "<hagilight-promoto-banner"), "promotion banner")
expectOne(countOccurrences(visibleHtml, "<footer"), "visible footer outside <template>")

const footerLabels = ["Powered By hagilight@", "Branch:", "Commit:", "Built:"]
const visibleFooter = visibleHtml.match(/<footer[\s\S]*?<\/footer>/u)?.[0] ?? ""
for (const label of footerLabels) {
  if (!visibleFooter.includes(label)) {
    throw new Error(`Visible footer is missing the build or attribution label: ${label}`)
  }
}
if (localeTemplates.length === 0) {
  throw new Error("Built homepage has no locale footer templates to check")
}
for (const [, locale, template] of localeTemplates) {
  for (const label of footerLabels) {
    if (!template.includes(label)) {
      throw new Error(`Locale footer template ${locale} is missing the build or attribution label: ${label}`)
    }
  }
}

// Every RSS link in every footer (visible and locale templates) must resolve to a published feed file.
const footerSegments = [...html.matchAll(/<footer[\s\S]*?<\/footer>/gu)].map(([segment]) => segment)
const rssHrefs = new Set(
  footerSegments.flatMap((segment) => [...segment.matchAll(/href="([^"]*rss[^"]*\.xml)"/gu)].map(([, href]) => href)),
)
if (rssHrefs.size === 0) {
  throw new Error("Built footers link to no RSS feed")
}
for (const href of rssHrefs) {
  const pathname = decodeURIComponent(new URL(href, `${origin}/`).pathname).replace(/^\//u, "")
  try {
    await stat(path.join(outputDirectory, pathname))
  } catch {
    throw new Error(`Footer RSS link does not resolve to a published file: ${href}`)
  }
}

// Generated discovery files.
if (!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`)) {
  throw new Error("Built robots.txt does not reference sitemap-index.xml")
}
if (!sitemapIndex.includes("<sitemapindex")) {
  throw new Error("Built sitemap-index.xml is not a sitemap index")
}
if (!llms.trim().startsWith("#")) {
  throw new Error("Built llms.txt is empty or does not start with a Markdown heading")
}
await stat(path.join(outputDirectory, "rss.xml")).catch(() => {
  throw new Error("Built output is missing rss.xml")
})
// The favicon is emitted by Astro under /_astro, so it is checked through the head link.
if (!/<link rel="icon" href="\/_astro\/favicon\.[^"]+\.ico"/u.test(html)) {
  throw new Error("Built homepage head does not link the shared Hagilight favicon")
}

console.log("Built Soul homepage has one analytics setup, one footer and one banner, and the generated discovery files.")
