import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { dump } from "js-yaml"
import { afterEach, describe, expect, it } from "vitest"
import { generateI18nResources, verifyGeneratedI18nResources } from "../generate-i18n-resources.mjs"

const expectedLocales = [
  "en-US",
  "zh-CN",
  "zh-Hant",
  "ja-JP",
  "ko-KR",
  "de-DE",
  "fr-FR",
  "es-ES",
  "pt-BR",
  "ru-RU",
]
const expectedGeneratedFiles = expectedLocales.map((locale) => `${locale}.ts`).sort((left, right) => left.localeCompare(right))
const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directoryPath) => fs.rm(directoryPath, { recursive: true, force: true })),
  )
})

async function createFixture(overrides = {}) {
  const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "soul-i18n-"))
  temporaryDirectories.push(fixtureRoot)

  const localesRoot = path.join(fixtureRoot, "locales-source")
  const generatedRoot = path.join(fixtureRoot, "resources")
  const baseResources = {
    common: {
      languages: {
        zhCN: "中文",
        enUS: "EN",
      },
    },
    builder: {
      preview: {
        feedbackSummary: "{{filled}} of 3 slots are filled.",
        inspirationImported: "Imported the inspiration card \"{{title}}\".",
      },
    },
  }
  const zhResources = {
    common: {
      languages: {
        zhCN: "中文",
        enUS: "EN",
      },
    },
    builder: {
      preview: {
        feedbackSummary: "当前 3 个插槽已填写 {{filled}} 个。",
        inspirationImported: "已导入灵感卡「{{title}}」。",
      },
    },
  }

  for (const locale of expectedLocales) {
    const directory = path.join(localesRoot, locale)
    await fs.mkdir(directory, { recursive: true })
    const resources = locale === "zh-CN" ? zhResources : baseResources
    await fs.writeFile(path.join(directory, "translation.yml"), dump(resources, { lineWidth: -1, noRefs: true }), "utf8")
  }

  if (overrides.missingNamespaceLocale) {
    await fs.rm(path.join(localesRoot, overrides.missingNamespaceLocale, "translation.yml"))
  }

  if (overrides.placeholderMismatchLocale) {
    await fs.writeFile(
      path.join(localesRoot, overrides.placeholderMismatchLocale, "translation.yml"),
      dump(
        {
          ...baseResources,
          builder: {
            preview: {
              ...baseResources.builder.preview,
              feedbackSummary: "Slots are filled.",
            },
          },
        },
        { lineWidth: -1, noRefs: true },
      ),
      "utf8",
    )
  }

  return {
    expectedLocales,
    generatedRoot,
    localesRoot,
  }
}

describe("Soul i18n resource generation", () => {
  it("writes deterministic i18next modules for the full Desktop locale set", async () => {
    const fixture = await createFixture()

    await generateI18nResources(fixture)

    await expect(fs.readdir(fixture.generatedRoot).then((files) => files.sort((left, right) => left.localeCompare(right)))).resolves.toEqual(
      expectedGeneratedFiles,
    )
    await expect(fs.readFile(path.join(fixture.generatedRoot, "en-US.ts"), "utf8")).resolves.toContain(
      "export const enUSResources = {",
    )
    await expect(fs.readFile(path.join(fixture.generatedRoot, "zh-CN.ts"), "utf8")).resolves.toContain(
      "export const zhCNResources = {",
    )
    await expect(verifyGeneratedI18nResources(fixture)).resolves.toMatchObject({
      localeCount: expectedLocales.length,
      namespaceCount: 1,
    })
  })

  it("fails stale-output validation with an actionable regeneration message", async () => {
    const fixture = await createFixture()

    await generateI18nResources(fixture)
    await fs.writeFile(path.join(fixture.generatedRoot, "zh-CN.ts"), "stale", "utf8")

    await expect(verifyGeneratedI18nResources(fixture)).rejects.toThrow(
      /src\/i18n\/resources|zh-CN\.ts is stale; rerun npm run i18n:generate/,
    )
  })

  it("fails when an expected namespace file is missing", async () => {
    const fixture = await createFixture({ missingNamespaceLocale: "de-DE" })

    await expect(generateI18nResources(fixture)).rejects.toThrow(/de-DE YAML namespaces must match expected Soul namespaces/)
  })

  it("fails when interpolation placeholders drift from the base locale", async () => {
    const fixture = await createFixture({ placeholderMismatchLocale: "fr-FR" })

    await expect(generateI18nResources(fixture)).rejects.toThrow(
      /fr-FR\/translation\.yml placeholder mismatch at builder\.preview\.feedbackSummary/,
    )
  })
})
