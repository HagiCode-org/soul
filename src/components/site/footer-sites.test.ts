import { describe, expect, it } from 'vitest'

import { resolveFooterSiteEntryById, resolveFooterSiteEntryByUrl } from './footer-sites'

describe('soul footer site helpers', () => {
  it('localizes snapshot metadata by locale code', () => {
    expect(resolveFooterSiteEntryById('hagicode-docs', 'en-US')).toMatchObject({
      title: 'HagiCode Docs',
      description: 'Official guides and references.',
    })

    expect(resolveFooterSiteEntryById('hagicode-docs', 'pt-BR')).toMatchObject({
      title: 'HagiCode Docs',
      description: 'Guias e referências oficiais.',
    })
  })

  it('matches entries by canonical URL for local link deduplication', () => {
    expect(resolveFooterSiteEntryByUrl('https://docs.hagicode.com/#intro', 'zh-CN')).toMatchObject({
      id: 'hagicode-docs',
      title: 'HagiCode Docs',
      description: '使用指南',
    })
  })
})
