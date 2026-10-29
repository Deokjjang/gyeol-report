/**
 * 작가용 브리프(결정론 취재 노트) 스키마. 작가는 이 JSON에 있는 사실만 쓴다(SPEC §3).
 * 압축 원칙: 장면은 장에 배정된 것만 담는다. trait 본문(이미지·좋은 면·Fusion)은 한 번만 두고 장은 id로 가리킨다.
 */
import { z } from "zod";
import { COMPATIBILITY_CATEGORIES, DOMAINS, FEATURE_FAMILIES, MBTI_TYPES, PRODUCT_KEYS } from "@/data/knowledge-v5/schema";

export const BRIEF_VERSION = "brief-v5-1" as const;
const Position = z.enum(["year", "month", "day", "hour"]);
const Element = z.enum(["WOOD", "FIRE", "EARTH", "METAL", "WATER"]);
const Image = z.object({ metaphor: z.string(), visual: z.string() });
const Ganji = z.object({ hanja: z.string().regex(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/), hangul: z.string().length(2) });
const ElementColor = z.object({ element: Element, hex: z.string().regex(/^#[0-9A-F]{6}$/) });

export const PersonBriefSchema = z.object({
  name: z.string(),
  callName: z.string(),
  nameUse: z.array(z.string()).min(1),
  gender: z.enum(["MALE", "FEMALE"]).nullable(),
  age: z.number().int(),
  ageBand: z.string(),
  facts: z.object({
    birthTimeKnown: z.boolean(),
    mbti: z.enum(MBTI_TYPES).nullable(),
    relationship: z.enum(["single", "dating", "married", "unknown"]),
    children: z.enum(["has", "none", "unknown"]),
    job: z.object({ class: z.enum(["employed", "business", "student", "none"]), status: z.string(), detail: z.string() }),
  }),
  forbiddenFacts: z.array(z.string()).min(1),
});

export const MbtiBriefSchema = z.object({
  type: z.enum(MBTI_TYPES), easyName: z.string(), oneLiner: z.string(), image: Image,
  functions: z.array(z.string()).length(4),
  shadows: z.array(z.string()),
});

export const ChartBriefSchema = z.object({
  pillars: z.object({ year: Ganji, month: Ganji, day: Ganji, hour: Ganji.optional() }),
  dayMaster: z.object({ stem: z.string(), name: z.string(), easyName: z.string(), metaphor: z.string() }),
  strength: z.object({ level: z.string(), label: z.string() }),
  yinYang: z.object({ yin: z.number(), yang: z.number(), label: z.string(), reading: z.string() }),
  /** 오행 단일 판단의 결론 하나(가장 강한·가장 약한 기운)와 쉬운 이유. 겉 글자 수만 보고 판단하지 않도록 숫자는 주지 않는다. */
  elements: z.object({
    strongest: z.object({ element: Element, name: z.string(), level: z.string(), reason: z.string() }),
    weakest: z.object({ element: Element, name: z.string(), level: z.string(), reason: z.string() }),
    reading: z.array(z.string()),
  }),
  climate: z.object({ season: z.string(), needs: z.array(z.string()), level: z.enum(["strong", "medium", "weak"]), lacking: z.array(Element), reading: z.string() }),
  currentDayun: z.object({ ganji: Ganji, ages: z.string(), years: z.string(), tenGod: z.string(), reading: z.string(), next: z.object({ ganji: Ganji, startYear: z.number().int(), tenGod: z.string() }).optional() }).nullable(),
  thisYear: z.object({ year: z.number().int(), ganji: Ganji, tenGod: z.string(), effect: z.string() }),
});

export const FusionBriefSchema = z.object({ target: z.string(), kind: z.enum(["resonance", "tension", "conditional"]), why: z.string(), scene: z.string().optional(), source: z.enum(["fusion", "mbtiLink", "computed"]) });

export const TraitSchema = z.object({
  id: z.string().regex(/^[ab]?t\d+$/),
  featureId: z.string(),
  family: z.enum(FEATURE_FAMILIES),
  name: z.string(),
  easyName: z.string(),
  positions: z.array(Position),
  strength: z.enum(["strong", "medium", "weak"]),
  score: z.number(),
  image: Image,
  oneLiner: z.string(),
  positionNote: z.string().optional(),
  strengthNote: z.string().optional(),
  good: z.array(z.string()).min(1).max(2),
  overuse: z.string().optional(),
  fusion: FusionBriefSchema.optional(),
  chapters: z.array(z.string()),
});

export const FortuneSchema = z.object({ featureId: z.string(), name: z.string(), easyName: z.string(), image: Image, oneLiner: z.string(), direct: z.string(), traitId: z.string().optional() });
export const ShadowSchema = z.object({ id: z.string(), traitId: z.string(), text: z.string(), basis: z.string(), warmTurn: z.string() });
export const UnusedSchema = z.object({ kind: z.enum(["element", "tenGod"]), key: z.string(), name: z.string(), easyName: z.string(), oneLiner: z.string(), actions: z.array(z.string()), places: z.array(z.string()) });

export const MaterialSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("trait"), traitId: z.string(), domain: z.enum(DOMAINS), scene: z.string(), angle: z.enum(["first", "new-domain"]) }),
  z.object({ kind: z.literal("mbti"), domain: z.enum(DOMAINS), scene: z.string() }),
  z.object({ kind: z.literal("ref"), ref: z.string(), note: z.string().optional() }),
  z.object({ kind: z.literal("evidence"), key: z.string(), facts: z.array(z.string()).min(1) }),
  z.object({ kind: z.literal("timeline"), entryKey: z.string() }),
]);
export type Material = z.infer<typeof MaterialSchema>;

export const ChapterBriefSchema = z.object({
  id: z.string(), index: z.number().int(), title: z.string(), question: z.string(), role: z.string(),
  targetChars: z.tuple([z.number().int(), z.number().int()]),
  subheadings: z.tuple([z.number().int(), z.number().int()]),
  paragraphs: z.tuple([z.number().int(), z.number().int()]),
  useName: z.boolean(),
  materials: z.array(MaterialSchema).min(1).max(6),
  note: z.string().optional(),
});

export const TimelineEntrySchema = z.object({
  key: z.string(), label: z.string(), kind: z.enum(["year", "month"]),
  ganji: Ganji, colors: z.object({ stem: ElementColor, branch: ElementColor }),
  tenGod: z.object({ stem: z.string(), branch: z.string() }),
  badges: z.array(z.object({ kind: z.string(), pair: z.string().optional(), label: z.string(), line: z.string(), tone: z.string() })),
  fillsLack: z.object({ fills: z.boolean(), elements: z.array(Element), feedsExcess: z.array(Element) }),
  flow: z.object({ score: z.number().int().min(1).max(5), label: z.string(), basis: z.array(z.string()), note: z.literal("참고") }),
  keywords: z.array(z.string()).min(2).max(3),
  action: z.object({ templateId: z.string(), text: z.string() }),
  dayun: z.object({ ganji: z.string(), transition: z.boolean() }).optional(),
  change: z.object({ tenGodFrom: z.string(), flowFrom: z.number() }).optional(),
  material: z.object({ image: z.string(), mood: z.string(), scene: z.string().optional(), stage: z.string() }),
});
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

export const PairPersonSchema = z.object({ role: z.string(), callName: z.string(), mbti: z.string().nullable(), dayPillar: z.string(), image: z.string(), traitIds: z.array(z.string()), excess: z.array(Element), lacking: z.array(Element) });
export const CompatibilityBriefSchema = z.object({
  relationshipType: z.enum(COMPATIBILITY_CATEGORIES),
  lens: z.object({ focus: z.string(), roleLabels: z.tuple([z.string(), z.string()]), tone: z.string(), forbidden: z.array(z.string()) }),
  a: PairPersonSchema, b: PairPersonSchema,
  common: z.array(z.string()), differences: z.array(z.object({ dimension: z.string(), a: z.string(), b: z.string() })),
  complement: z.array(z.string()),
  tenGodAB: z.object({ tenGod: z.string(), reading: z.string() }), tenGodBA: z.object({ tenGod: z.string(), reading: z.string() }),
  dayRelations: z.array(z.string()),
  mbtiConvention: z.object({ fit: z.string(), why: z.string(), note: z.literal("통념") }).nullable(),
  /** v5 궁합 점수(P4, src/lib/compat/score.ts). 본문은 band 톤과 맞아야 하고(안전망), 낮은 점수에도 보완법을 쓴다. */
  score: z.object({
    value: z.number().int().min(35).max(95), version: z.string(),
    band: z.object({ label: z.string(), tone: z.string(), verdict: z.string() }),
    components: z.array(z.object({ name: z.string(), level: z.enum(["좋음", "보통", "조율"]), weight: z.number(), line: z.string() })).min(5).max(6),
    direction: z.object({ aToB: z.object({ tenGod: z.string(), role: z.string(), gives: z.string().nullable() }), bToA: z.object({ tenGod: z.string(), role: z.string(), gives: z.string().nullable() }) }),
    rules: z.array(z.string()),
  }),
});

export const BriefSchema = z.object({
  version: z.literal(BRIEF_VERSION),
  product: z.enum(PRODUCT_KEYS),
  productTitle: z.string(),
  seed: z.string(),
  baseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  person: PersonBriefSchema,
  mbti: MbtiBriefSchema.nullable(),
  chart: ChartBriefSchema,
  traits: z.array(TraitSchema).min(1),
  fortunes: z.array(FortuneSchema),
  shadows: z.array(ShadowSchema),
  unused: z.array(UnusedSchema),
  chapters: z.array(ChapterBriefSchema).min(5),
  timeline: z.object({ entries: z.array(TimelineEntrySchema), keyEntries: z.array(z.string()), tenGodNotes: z.record(z.string(), z.object({ meaning: z.string(), caution: z.string().optional() })), cycles: z.array(z.object({ ganji: z.string(), years: z.string(), tenGod: z.string(), current: z.boolean() })) }).optional(),
  partner: z.object({ person: PersonBriefSchema, mbti: MbtiBriefSchema.nullable(), chart: ChartBriefSchema }).optional(),
  compatibility: CompatibilityBriefSchema.optional(),
  style: z.object({
    version: z.string(), register: z.string(), readingLevel: z.string(),
    totalChars: z.tuple([z.number().int(), z.number().int()]),
    rules: z.array(z.string()), forbidden: z.array(z.string()),
  }),
  budget: z.object({ estimatedTokens: z.number().int(), bySection: z.record(z.string(), z.number().int()), method: z.string() }),
});
export type Brief = z.infer<typeof BriefSchema>;
export type Trait = z.infer<typeof TraitSchema>;
export type ChapterBrief = z.infer<typeof ChapterBriefSchema>;
export type ChartBrief = z.infer<typeof ChartBriefSchema>;
export type PersonBrief = z.infer<typeof PersonBriefSchema>;
export type CompatibilityBrief = z.infer<typeof CompatibilityBriefSchema>;
