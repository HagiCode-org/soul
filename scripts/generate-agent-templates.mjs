import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { referenceCatalogSnapshot } from '../src/data/reference-materials.generated.ts';
import {
  mainCatalogEnTranslations,
  orthogonalCatalogEnTranslations,
} from '../src/data/reference-material-translations.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(repoRoot, 'src', 'data', 'generated', 'agent-templates');
const typeIndexPath = path.join(outputRoot, 'index.json');

const CATEGORY_STYLE_TYPES = {
  '治愈陪伴向': 'healing-companion',
  '个性人设向': 'persona-archetype',
  '职业身份向': 'professional-role',
  '圈层文化向': 'subculture-scene',
  '反差设定向': 'contrast-archetype',
  '反差&场景专属向': 'contrast-archetype',
  '职场成长向': 'career-growth',
  '情绪疗愈向': 'emotional-therapy',
  '创意灵感向': 'creative-inspiration',
};

const CATEGORY_DOMAIN_TAGS = {
  '治愈陪伴向': ['companionship', 'emotional-support'],
  '个性人设向': ['persona-design', 'conversation-style'],
  '职业身份向': ['roleplay', 'professional-identity'],
  '圈层文化向': ['subculture', 'interest-community'],
  '反差设定向': ['contrast-archetype', 'dramatic-roleplay'],
  '反差&场景专属向': ['contrast-archetype', 'dramatic-roleplay'],
  '职场成长向': ['career-growth', 'professional-development'],
  '情绪疗愈向': ['emotional-therapy', 'emotional-support'],
  '创意灵感向': ['creative-inspiration', 'creative-tools'],
};

const LANGUAGE_PATTERNS = [
  ['english-mix', /english|英文|留学|海外/i],
  ['cantonese', /粤语|港普|港风|粤语口头禅/i],
  ['classical-chinese', /古风|诗词|文言|戏文|汉服/i],
  ['anime-slang', /二次元|acgn|动漫|萌/i],
  ['beijing-dialect', /京片子|北京|儿化音/i],
  ['japanese-cues', /日式|居酒屋/i],
];

const ROLE_PATTERNS = [
  ['mentor', /学霸|老师|修行者|老中医|顾问|指导|导师|教练系|军师|规划师|向导/i],
  ['companion', /陪伴|治愈|邻家|树洞|朋友|伙伴|搭子|互助/i],
  ['caretaker', /爹系|妈系|管家|照顾|治愈系|祖父母|慰藉|妈妈/i],
  ['performer', /主唱|主播|说书人|调酒师|名角|dm|老板|制作人/i],
  ['coach', /电竞|学习搭子|监督|搭子|教练|撸铁|健身/i],
  ['romantic', /白月光|钓系|傲娇|腹黑|贵公子|大小姐/i],
  ['commander', /霸道|强势|黑帮|大姐大|ceo/i],
  ['comedian', /沙雕|搞笑|乐子人/i],
  ['scholar', /学霸|书店老板|文人/i],
  ['therapist', /疗愈|心理咨询|情绪|正念|悲伤|焦虑|内在小孩/i],
  ['creative-partner', /创意|灵感|写作|音乐|设计|故事|艺术|代码|美学/i],
  ['career-coach', /职场|创业|求职|升职|转型|副业|谈判|领导|猎头|财务/i],
  ['life-mentor', /极简|冥想|生活|节日|周末|旅行|通勤|睡眠/i],
];

const EXTRA_DOMAIN_PATTERNS = [
  ['productivity', /学习|专注|效率|监督|时间管理/i],
  ['gaming', /电竞|游戏|脚本杀/i],
  ['music', /乐队|歌|cantopop|音乐|旋律|歌词/i],
  ['travel', /旅行|露营|户外|航天|在途/i],
  ['craft', /陶艺|咖啡|摄影|宠物|花草|美学/i],
  ['technology', /赛博|科幻|宇宙|数据|代码|编程/i],
  ['business', /ceo|老板|调酒师|项目|产品|创业|变现/i],
  ['career-growth', /职场|晋升|求职|转型|副业|猎头|品牌/i],
  ['emotional-therapy', /疗愈|情绪|正念|冥想|焦虑|悲伤|边界|认知/i],
  ['creative-inspiration', /创意|灵感|写作|设计|故事|叙事|头脑风暴/i],
  ['life-skills', /极简|生活|仪式感|慵懒/i],
  ['parenting', /育儿|妈妈|宝宝/i],
  ['fitness', /健身|撸铁|力量|训练/i],
];

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'template';
}

function resolveLanguageTags(text) {
  const values = ['mandarin'];
  for (const [value, pattern] of LANGUAGE_PATTERNS) {
    if (pattern.test(text)) {
      values.push(value);
    }
  }
  return unique(values);
}

function resolveRoleTags(text) {
  return unique(ROLE_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([value]) => value));
}

function resolveDomainTags(category, text, styleType) {
  return unique([
    ...(CATEGORY_DOMAIN_TAGS[category] ?? []),
    styleType,
    ...EXTRA_DOMAIN_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([value]) => value),
  ]);
}

function buildTags({ styleType, category, name, core, signature, compatibility }) {
  const text = `${name} ${core} ${signature} ${compatibility ?? ''}`;
  const tagGroups = {
    languages: resolveLanguageTags(text),
    domains: resolveDomainTags(category, text, styleType),
    roles: resolveRoleTags(text),
  };
  const tags = unique([
    'soul',
    styleType,
    ...tagGroups.languages,
    ...tagGroups.domains,
    ...tagGroups.roles,
  ]);

  return { tags, tagGroups };
}

function createSoulPrompt({ typeLabel, name, core, signature, compatibility }) {
  const sections = [
    `你的人设内核来自「${name}」：${core}`,
    `保持以下标志性语言特征：${signature}`,
    compatibility ? `兼容性说明：${compatibility}` : null,
    `输出规则：先维持「${typeLabel}」的人设边界，再给出有效回应。`,
    `输出规则：保持措辞、节奏与情绪张力稳定，不要跳出「${name}」的风格外壳。`,
  ];

  return sections.filter(Boolean).join('\n');
}

function createSummary(core) {
  return normalizeText(core).replace(/。+$/u, '');
}

function buildSummary(detail) {
  return {
    id: detail.id,
    templateType: detail.templateType,
    name: detail.name,
    summary: detail.summary,
    styleType: detail.styleType,
    path: detail.path,
    tags: detail.tags,
    tagGroups: detail.tagGroups,
    previewText: detail.previewText,
  };
}

function buildMainCatalogDetails(generatedAt) {
  return referenceCatalogSnapshot.mainCatalogs.map((entry) => {
    const english = mainCatalogEnTranslations[entry.index];
    const slugSource = english?.name ?? `main-${entry.index}`;
    const id = `soul-main-${String(entry.index).padStart(2, '0')}-${slugify(slugSource)}`;
    const styleType = CATEGORY_STYLE_TYPES[entry.category] ?? 'persona-archetype';
    const { tags, tagGroups } = buildTags({
      styleType,
      category: entry.category,
      name: entry.name,
      core: entry.core,
      signature: entry.signature,
    });
    const soul = createSoulPrompt({
      typeLabel: entry.category,
      name: entry.name,
      core: entry.core,
      signature: entry.signature,
    });

    return {
      id,
      templateType: 'soul',
      name: entry.name,
      summary: createSummary(entry.core),
      styleType,
      soul,
      previewText: soul,
      tags,
      tagGroups,
      path: `/agent-templates/soul/templates/${id}.json`,
      sourceRepo: 'repos/soul',
      sourceGeneratedAt: generatedAt,
    };
  });
}

function buildOrthogonalDetails(generatedAt) {
  return referenceCatalogSnapshot.orthogonalCatalogs.map((entry) => {
    const english = orthogonalCatalogEnTranslations[entry.index];
    const slugSource = english?.name ?? `orthogonal-${entry.index}`;
    const id = `soul-orth-${String(entry.index).padStart(2, '0')}-${slugify(slugSource)}`;
    const styleType = 'orthogonal-dimension';
    const { tags, tagGroups } = buildTags({
      styleType,
      category: '正交维度',
      name: entry.name,
      core: entry.core,
      signature: entry.signature,
      compatibility: entry.compatibility,
    });
    const soul = createSoulPrompt({
      typeLabel: '正交维度',
      name: entry.name,
      core: entry.core,
      signature: entry.signature,
      compatibility: entry.compatibility,
    });

    return {
      id,
      templateType: 'soul',
      name: entry.name,
      summary: createSummary(entry.core),
      styleType,
      soul,
      previewText: soul,
      tags,
      tagGroups,
      path: `/agent-templates/soul/templates/${id}.json`,
      sourceRepo: 'repos/soul',
      sourceGeneratedAt: generatedAt,
    };
  });
}

export async function buildSoulTemplateSnapshot({ generatedAt = new Date().toISOString() } = {}) {
  const details = [
    ...buildMainCatalogDetails(generatedAt),
    ...buildOrthogonalDetails(generatedAt),
  ].sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'));

  const summaries = details.map(buildSummary);
  const availableTagGroups = {
    languages: unique(summaries.flatMap((item) => item.tagGroups.languages)),
    domains: unique(summaries.flatMap((item) => item.tagGroups.domains)),
    roles: unique(summaries.flatMap((item) => item.tagGroups.roles)),
  };

  const index = {
    version: '1.0.0',
    generatedAt,
    templateType: 'soul',
    title: 'SOUL Templates',
    description: 'SOUL templates generated from the canonical soul reference materials and ready for Hero draft initialization.',
    availableTagGroups,
    templates: summaries,
  };

  return {
    index,
    details,
  };
}

export async function writeSoulTemplateSnapshot({
  outputDirectory = outputRoot,
  generatedAt,
} = {}) {
  const snapshot = await buildSoulTemplateSnapshot({ generatedAt });
  const nextIndexPath = path.join(outputDirectory, 'index.json');
  const nextTemplatesDir = path.join(outputDirectory, 'templates');

  await fs.rm(nextTemplatesDir, { recursive: true, force: true });
  await fs.mkdir(nextTemplatesDir, { recursive: true });
  await fs.writeFile(nextIndexPath, `${JSON.stringify(snapshot.index, null, 2)}\n`, 'utf8');

  await Promise.all(snapshot.details.map((detail) => {
    const detailPath = path.join(nextTemplatesDir, `${detail.id}.json`);
    return fs.writeFile(detailPath, `${JSON.stringify(detail, null, 2)}\n`, 'utf8');
  }));

  return {
    ...snapshot,
    outputDirectory,
  };
}

async function main() {
  const snapshot = await writeSoulTemplateSnapshot();
  process.stdout.write(`Generated ${snapshot.details.length} soul templates at ${path.relative(repoRoot, typeIndexPath)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
