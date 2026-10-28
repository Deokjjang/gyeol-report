import { z } from "zod";

// knowledge-v5 데이터 파일의 zod 스키마. 런타임 코드는 아직 이 파일을 import하지 않는다(scripts/knowledge-lint.ts 전용).
export const DOMAINS = ["work", "money", "love", "relationships", "study"] as const;
export const DomainSchema = z.enum(DOMAINS);
export type Domain = z.infer<typeof DomainSchema>;

export const MBTI_TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"] as const;
export const MbtiTypeSchema = z.enum(MBTI_TYPES);
export type MbtiType = z.infer<typeof MbtiTypeSchema>;

export const PRODUCT_KEYS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
export const COMPATIBILITY_CATEGORIES = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const;

const DimensionId = z.string().regex(/^[a-z][a-zA-Z]+$/);
const Sentence = z.string().min(8).max(90);
const SourceRefs = z.array(z.string().min(3)).min(1);

/** 행동 신호·그림자 신호. 문장 + 영역 태그 + 출처. */
export const SignalSchema = z.object({ text: Sentence, domains: z.array(DomainSchema).min(1), sourceRefs: SourceRefs });
export type Signal = z.infer<typeof SignalSchema>;

/** dimensionTags: 차원 id → -1~1 (0 금지). */
export const DimensionTagsSchema = z.record(DimensionId, z.number().min(-1).max(1).refine(v => v !== 0, "0은 태그를 빼라"));

// 1) behavior-ontology.json
export const BehaviorDimensionSchema = z.object({
  id: DimensionId, name: z.string().min(2).max(10), definition: Sentence,
  poles: z.object({ plus: z.object({ label: z.string().min(2).max(12), description: Sentence }), minus: z.object({ label: z.string().min(2).max(12), description: Sentence }) }),
  domains: z.array(DomainSchema).min(1),
  sceneTemplates: z.array(z.object({ pole: z.enum(["+", "-"]), domain: DomainSchema, text: z.string().min(8).max(120) })).length(2),
});
export const BehaviorOntologySchema = z.object({ version: z.string(), note: z.string().optional(), domains: z.array(DomainSchema), dimensions: z.array(BehaviorDimensionSchema).min(25).max(35) });
export type BehaviorOntology = z.infer<typeof BehaviorOntologySchema>;

// 2) myeongri-features.json
export const FEATURE_FAMILIES = ["tenGod", "tenGodFamily", "shinsal", "gwiin", "twelveStage", "relation", "element", "dayPillar", "dayMaster", "structure", "stem", "branch", "other"] as const;
export const FeatureFamilySchema = z.enum(FEATURE_FAMILIES);
const Position = z.string().regex(/^(year|month|day|hour)(-(year|month|day|hour))?$/);
export const MyeongriFeatureSchema = z.object({
  id: z.string().min(2),
  family: FeatureFamilySchema,
  traditionalName: z.string().min(1).max(20),
  easyName: z.string().min(2).max(12),
  definition: z.string().min(8).max(140),
  behaviorSignals: z.array(SignalSchema).min(3).max(5),
  shadowSignals: z.array(SignalSchema).min(2).max(3),
  dimensionTags: DimensionTagsSchema.refine(t => Object.keys(t).length >= 2, "dimensionTags 2개 이상"),
  positionNuance: z.array(z.object({ position: Position, text: z.string().min(8).max(140), sourceRefs: SourceRefs })).optional(),
  strengthRule: z.object({ strong: z.string().min(8).max(140), weak: z.string().min(8).max(140), duplicate: z.string().min(8).max(140).optional(), clash: z.string().min(8).max(140).optional(), sourceRefs: SourceRefs }),
  sourceRefs: SourceRefs,
  aliases: z.array(z.string()).optional(),
});
export type MyeongriFeature = z.infer<typeof MyeongriFeatureSchema>;
/** 같은 개념의 다른 id(오행 4종 id 체계, 특수격 2종 등). 정본 항목으로 해석한다. */
export const FeatureAliasSchema = z.object({ id: z.string().min(2), aliasOf: z.string().min(2), note: z.string().optional() });
export const MyeongriFeaturesSchema = z.object({ version: z.string(), features: z.array(MyeongriFeatureSchema), aliases: z.array(FeatureAliasSchema) });
export type MyeongriFeatures = z.infer<typeof MyeongriFeaturesSchema>;

// 3) mbti-profiles.json
export const MbtiProfileSchema = z.object({
  type: MbtiTypeSchema,
  easyName: z.string().min(2).max(16),
  oneLine: Sentence,
  dimensionTags: DimensionTagsSchema.refine(t => Object.keys(t).length >= 8, "dimensionTags 8개 이상"),
  cognitiveFunctions: z.array(z.object({ code: z.enum(["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"]), role: z.enum(["주기능", "부기능", "3차기능", "열등기능"]), easy: z.string().min(8).max(120), sourceRefs: SourceRefs })).length(4),
  signals: z.object({ work: z.array(SignalSchema).length(3), money: z.array(SignalSchema).length(3), love: z.array(SignalSchema).length(3), relationships: z.array(SignalSchema).length(3), study: z.array(SignalSchema).length(3) }),
  shadows: z.array(SignalSchema).length(2),
  sourceRefs: SourceRefs,
});
export type MbtiProfile = z.infer<typeof MbtiProfileSchema>;
export const MbtiProfilesSchema = z.object({ version: z.string(), profiles: z.array(MbtiProfileSchema).length(16) });

// 4) cross-findings.json
export const CrossFindingSchema = z.object({
  id: z.string().min(4),
  featureId: z.string().min(2),
  mbti: MbtiTypeSchema,
  dimension: DimensionId,
  kind: z.enum(["resonance", "tension", "conditional"]),
  score: z.number(),
  insight: z.string().min(20).max(200),
  scene: z.string().min(10).max(120),
  factBoundary: z.object({ requires: z.array(z.enum(["exactTime", "approximateTime", "mbtiKnown", "genderKnown", "contextKnown"])), forbids: z.array(z.string()) }),
  sourceRefs: SourceRefs,
});
export type CrossFinding = z.infer<typeof CrossFindingSchema>;
export const CrossFindingsSchema = z.object({ version: z.string(), method: z.string(), findings: z.array(CrossFindingSchema).min(200), runtimeTemplateRule: z.string() });

// 5) product-narratives.json
export const ChapterRoleSchema = z.enum(["HOOK", "WHY", "SCENE", "TWIST", "PAYOFF"]);
export const ChapterPlanSchema = z.object({
  id: z.string().min(2), title: z.string().min(2).max(30), question: z.string().min(8).max(80), role: ChapterRoleSchema,
  domains: z.array(DomainSchema).min(1), dimensionFocus: z.array(DimensionId).optional(),
  evidenceFamilies: z.array(FeatureFamilySchema).optional(), requires: z.array(z.enum(["exactTime", "approximateTime", "mbtiKnown", "genderKnown", "contextKnown", "pair"])).optional(),
  paragraphs: z.object({ min: z.number().int().min(1), max: z.number().int().min(1) }),
  /** 같은 장 계획을 반복 적용하는 수(대운 14년, 세운 12개월). 없으면 1. */
  repeat: z.number().int().min(2).optional(),
});
export const ProductNarrativeSchema = z.object({
  productKey: z.enum(PRODUCT_KEYS), title: z.string(), funType: z.string().min(2).max(20), narrativeMode: z.string().min(8).max(200),
  chapters: z.array(ChapterPlanSchema).min(5),
  forbidden: z.array(z.string().min(4)).min(1),
  noRepeatRules: z.array(z.string().min(8)).min(1),
  compatibility: z.record(z.enum(COMPATIBILITY_CATEGORIES), z.object({ sceneDomains: z.array(DomainSchema).min(1), roleLabels: z.tuple([z.string(), z.string()]), forbidden: z.array(z.string()).min(1), tone: z.string().min(4).max(80) })).optional(),
});
export const ProductNarrativesSchema = z.object({ version: z.string(), products: z.array(ProductNarrativeSchema).length(6) });
export type ProductNarratives = z.infer<typeof ProductNarrativesSchema>;
