import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildSoulTemplateSnapshot, writeSoulTemplateSnapshot } from './generate-agent-templates.mjs';

const tempRoots = [];

describe('soul agent template generation', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })));
  });

  it('builds stable ids and complete detail payloads from canonical materials', async () => {
    const snapshot = await buildSoulTemplateSnapshot({ generatedAt: '2026-03-26T12:00:00.000Z' });
    const item = snapshot.details.find((detail) => detail.id === 'soul-main-12-aloof-ace-scholar');

    expect(item).toMatchObject({
      id: 'soul-main-12-aloof-ace-scholar',
      templateType: 'soul',
      name: '高冷禁欲学霸系',
      styleType: 'persona-archetype',
      summary: '智商拉满的高冷学霸，话少精准，主打理性问题解决，附带笨拙温柔的反差感',
      path: '/agent-templates/soul/templates/soul-main-12-aloof-ace-scholar.json',
      tags: expect.arrayContaining(['soul', 'persona-archetype', 'mandarin', 'mentor', 'scholar']),
      tagGroups: {
        languages: expect.arrayContaining(['mandarin']),
        domains: expect.arrayContaining(['conversation-style', 'persona-design', 'persona-archetype']),
        roles: expect.arrayContaining(['mentor', 'scholar']),
      },
    });
    expect(item?.soul).toContain('你的人设内核来自「高冷禁欲学霸系」');
    expect(item?.previewText).toContain('保持以下标志性语言特征');
  });

  it('keeps orthogonal catalog entries previewable with grouped metadata', async () => {
    const snapshot = await buildSoulTemplateSnapshot({ generatedAt: '2026-03-26T12:00:00.000Z' });
    const orthogonal = snapshot.details.find((detail) => detail.id.startsWith('soul-orth-'));

    expect(orthogonal).toBeDefined();
    expect(orthogonal?.styleType).toBe('orthogonal-dimension');
    expect(orthogonal?.tagGroups.languages).toEqual(expect.arrayContaining(['mandarin']));
    expect(orthogonal?.previewText.length).toBeGreaterThan(40);
  });

  it('writes canonical type index and detail files', async () => {
    const outputDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'soul-agent-templates-'));
    tempRoots.push(outputDirectory);

    const snapshot = await writeSoulTemplateSnapshot({
      outputDirectory,
      generatedAt: '2026-03-26T12:00:00.000Z',
    });

    const index = JSON.parse(await fs.readFile(path.join(outputDirectory, 'index.json'), 'utf8'));
    const detail = JSON.parse(await fs.readFile(path.join(outputDirectory, 'templates', `${snapshot.details[0].id}.json`), 'utf8'));

    expect(index.templateType).toBe('soul');
    expect(index.templates.length).toBe(snapshot.details.length);
    expect(detail.soul).toBeTruthy();
    expect(detail.previewText).toContain('输出规则');
  });
});
