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
  /** note: 일간 강약과 오행 쏠림이 다른 이야기임을 푸는 한 문장(P3.7 1-2). */
  /** reading: 강약 한 줄 해석(P3.8 5: 해석이 비어 작가가 채웠다). */
  strength: z.object({ level: z.string(), label: z.string(), reading: z.string().optional(), note: z.string().optional() }),
  yinYang: z.object({ yin: z.number(), yang: z.number(), label: z.string(), reading: z.string() }),
  /** 오행 단일 판단의 결론 하나(가장 강한·가장 약한 기운)와 쉬운 이유. 겉 글자 수만 보고 판단하지 않도록 숫자는 주지 않는다. */
  elements: z.object({
    strongest: z.object({ element: Element, name: z.string(), level: z.string(), reason: z.string() }),
    weakest: z.object({ element: Element, name: z.string(), level: z.string(), reason: z.string() }),
    reading: z.array(z.string()),
  }),
  climate: z.object({ season: z.string(), needs: z.array(z.string()), level: z.enum(["strong", "medium", "weak"]), lacking: z.array(Element), reading: z.string() }),
  currentDayun: z.object({ ganji: Ganji, ages: z.string(), years: z.string(), tenGod: z.string(), reading: z.string(), next: z.object({ ganji: Ganji, startYear: z.number().int(), tenGod: z.string(), easyName: z.string().optional(), reading: z.string().optional() }).optional() }).nullable(),
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
  /** 합충형해의 자리 문장(P3.6 A4). 작가는 자리를 이 문장과 같은 의미로만 쓴다. */
  where: z.string().optional(),
  strengthNote: z.string().optional(),
  good: z.array(z.string()).min(1).max(2),
  overuse: z.string().optional(),
  fusion: FusionBriefSchema.optional(),
  /** 같은 대상을 그린 이미지 계열의 대표 trait id(P3.7 1-3). 있으면 그 그림이 주제이고, 이 trait는 "같은 불의 다른 얼굴"로 한 구절만 잇는다. */
  sameImageAs: z.string().optional(),
  chapters: z.array(z.string()),
});

export const FortuneSchema = z.object({ featureId: z.string(), name: z.string(), easyName: z.string(), image: Image, oneLiner: z.string(), direct: z.string(), traitId: z.string().optional() });
export const ShadowSchema = z.object({ id: z.string(), traitId: z.string(), text: z.string(), basis: z.string(), warmTurn: z.string() });
export const UnusedSchema = z.object({ kind: z.enum(["element", "tenGod"]), key: z.string(), name: z.string(), easyName: z.string(), oneLiner: z.string(), actions: z.array(z.string()), places: z.array(z.string()) });

export const MaterialSchema = z.discriminatedUnion("kind", [
  /** angle: first = 이 trait를 책에서 처음 소개(그림 + 쉬운 말(용어)), new-domain = 앞에서 소개된 trait를 "앞에서 본 ○○" 한 문장으로만 부르고 이 절의 새 정보를 붙인다(P3.8 1). */
  z.object({ kind: z.literal("trait"), traitId: z.string(), domain: z.enum(DOMAINS), scene: z.string().optional(), angle: z.enum(["first", "new-domain"]) }),
  z.object({ kind: z.literal("mbti"), domain: z.enum(DOMAINS), scene: z.string(), who: z.string().optional() }),
  z.object({ kind: z.literal("ref"), ref: z.string(), note: z.string().optional() }),
  /** note: 쓰는 법(작가 지시). 본문에 옮기지 않는다(P3.7 r1: 지시문이 독자용 면책 문구로 옮겨졌다). */
  z.object({ kind: z.literal("evidence"), key: z.string(), facts: z.array(z.string()).min(1), note: z.string().optional() }),
  z.object({ kind: z.literal("timeline"), entryKey: z.string() }),
  /** 궁합 관계 장면(P3.8 3): 이 관계 유형의 생활 주제와 장면. 다른 관계 유형 장면은 쓰지 않는다. */
  z.object({ kind: z.literal("rel"), topic: z.string(), scene: z.string() }),
]);
export type Material = z.infer<typeof MaterialSchema>;

export const ChapterBriefSchema = z.object({
  id: z.string(), index: z.number().int(), title: z.string(), question: z.string(), role: z.string(),
  targetChars: z.tuple([z.number().int(), z.number().int()]),
  subheadings: z.tuple([z.number().int(), z.number().int()]),
  paragraphs: z.tuple([z.number().int(), z.number().int()]),
  useName: z.boolean(),
  /** 장 재료 전체(절 재료를 모은 것). 반복 장은 타임라인 항목 + 짧은 참조. */
  materials: z.array(MaterialSchema).min(1).max(12),
  /** 절 계획(P3.8 1): 절마다 질문과 그 절 전용 재료. 작가는 절 하나를 소제목 하나로 쓴다. */
  sections: z.array(z.object({ q: z.string(), domain: z.enum(DOMAINS), materials: z.array(MaterialSchema).min(1).max(4) })).min(1).max(5).optional(),
  note: z.string().optional(),
  /** 장면 변주 힌트(P3.5 A1): 이 고객의 생활 소품 2개. 재료 장면을 이 소품으로 다시 짠다(문장 복사 방지). */
  sceneHint: z.array(z.string()).min(1).max(3).optional(),
});

export const TimelineEntrySchema = z.object({
  key: z.string(), label: z.string(), kind: z.enum(["year", "month"]),
  ganji: Ganji, colors: z.object({ stem: ElementColor, branch: ElementColor }),
  tenGod: z.object({ stem: z.string(), branch: z.string() }),
  /** with: 그해·그달 글자와 엮인 원국 자리("태어난 달·태어난 날"), P3.7 1-1. */
  badges: z.array(z.object({ kind: z.string(), pair: z.string().optional(), label: z.string(), line: z.string(), tone: z.string(), with: z.string().optional() })),
  fillsLack: z.object({ fills: z.boolean(), elements: z.array(Element), feedsExcess: z.array(Element) }),
  flow: z.object({ score: z.number().int().min(1).max(5), label: z.string(), basis: z.array(z.string()), note: z.literal("참고") }),
  keywords: z.array(z.string()).min(2).max(3),
  action: z.object({ templateId: z.string(), text: z.string() }),
  dayun: z.object({ ganji: z.string(), transition: z.boolean() }).optional(),
  change: z.object({ tenGodFrom: z.string(), flowFrom: z.number(), line: z.string().optional() }).optional(),
  /** 기준일 대비: past(돌아보는 말), now, future(경향). P3.6 B. */
  when: z.enum(["past", "now", "future"]).optional(),
  /** 그림은 간지(image), 뜻은 일간 기준 십성(tenGodNotes·keywords)으로 나눈다(P3.8 1: 간지 기준 mood가 십성과 어긋났다). */
  /** stage: 같은 십이운성 단계가 앞 항목에 이미 나왔으면 뺀다(같은 문구 반복 방지). */
  material: z.object({ image: z.string(), scene: z.string().optional(), stage: z.string().optional() }),
  /** 앞 항목과 같은 십성이 다시 들어오면 그 항목 key(P3.8 r1). 작가는 뜻을 다시 풀지 않고 이번에 달라진 것만 쓴다. */
  repeatOf: z.string().optional(),
  /** 그해·그달 글자가 실제로 건드리는 원국 trait와 어떻게 건드리는지(P3.7 1-1). 장에 배정된 것만 남긴다. 없으면 원국 특성을 쓰지 않는다. */
  touched: z.array(z.object({ traitId: z.string(), how: z.string() })).optional(),
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
  /**
   * 배정 기록(P3.8 1, 작가에게는 안 감): trait별 소개 장·적용 장, 축별 사용 수. 안전망이 원고의 실제 언급과 비교한다.
   * axis = 의미 그룹 또는 가장 센 행동 차원(+/-). 상한: trait 소개 1 + 적용 2, 축 3, 한 장에 같은 trait·같은 축 1.
   */
  plan: z.object({
    traits: z.record(z.string(), z.object({ intro: z.string().nullable(), applies: z.array(z.string()), axes: z.array(z.string()) })),
    axes: z.record(z.string(), z.number().int()),
    warnings: z.array(z.string()),
  }).optional(),
  /** 책 단위 소품 사용 기록(P3.6 A1): 소품 → 힌트로 준 장 수(최대 2). */
  usedProps: z.record(z.string(), z.number().int().min(1).max(2)).optional(),
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
