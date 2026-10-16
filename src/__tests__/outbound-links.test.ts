import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SOURCE_ROOT = path.resolve(process.cwd(), 'src');
// Matches a new-tab target on an element (`target="_blank"` or `target={getSiteLinkTarget(link)}`).
const NEW_TAB_TARGET = /\btarget=\s*(?:"_blank"|\{)/u;
const TAGGED = /gaEventAttributes\(|getSiteLinkAnalyticsAttributes\(/u;

async function listSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listSourceFiles(fullPath);
      return /\.(?:ts|tsx)$/u.test(entry.name) && !/\.test\.(?:ts|tsx)$/u.test(entry.name) ? [fullPath] : [];
    }),
  );
  return nested.flat();
}

describe('first-party outbound links', () => {
  it('tags every new-tab anchor, so no first-party link is left unreported', async () => {
    const files = await listSourceFiles(SOURCE_ROOT);
    const untagged: string[] = [];

    for (const file of files) {
      const source = await readFile(file, 'utf8');
      if (!NEW_TAB_TARGET.test(source)) continue;
      if (!TAGGED.test(source)) untagged.push(path.relative(SOURCE_ROOT, file));
    }

    expect(untagged).toEqual([]);
  });

  it('leaves the in-page workbench anchors untagged', async () => {
    const hero = await readFile(path.join(SOURCE_ROOT, 'components/builder/BuilderHeroIntro.tsx'), 'utf8');
    const workbench = hero.match(/<a href="#home-workbench"[^>]*>/u)?.[0] ?? '';

    expect(workbench).not.toBe('');
    expect(workbench).not.toContain('gaEventAttributes');
  });
});
