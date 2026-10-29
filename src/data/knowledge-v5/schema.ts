import { z } from "zod";

/**
 * knowledge-v5 스키마 v2 (P1). 작가가 쓰는 유일한 해석 재료.
 * 데이터 파일: myeongri/<family>.json, mbti/<TYPE>.json, fusion/*.json, timeline/*.json, behavior-ontology.json, id-map.json
 * 검사: scripts/knowledge-lint.ts. 런타임 로더는 P2(브리프)에서 붙인다. v1 데이터는 legacy/ (P3 이후 제거).
 *
 * 문장 원칙(SPEC §1): 직설·이미지·장면. 장면은 "사람·상황·행동이 보이는" 1~2문장(20~140자).
 * v1의 문장 60자·평균 40자 상한이 문장을 납작하게 만들어 v2는 문장 90자, 장면 140자, 설명문 220자로 올린다.
 */

// ---------- 공통 ----------
export const DOMAINS = ["work", "money", "study", "love", "marriage", "relationships", "alone"] as const;
export const DomainSchema = z.enum(DOMAINS);
export type Domain = z.infer<typeof DomainSchema>;

export const MBTI_TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"] as const;
export const MbtiTypeSchema = z.enum(MBTI_TYPES);
export type MbtiType = z.infer<typeof MbtiTypeSchema>;
export const COGNITIVE_FUNCTIONS = ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"] as const;
export const CognitiveFunctionSchema = z.enum(COGNITIVE_FUNCTIONS);
/** mbtiLinks.target: 유형 코드, 인지기능, 또는 선호 축 한 글자(E/I/S/N/T/F/J/P). */
export const MbtiTargetSchema = z.union([MbtiTypeSchema, CognitiveFunctionSchema, z.enum(["E", "I", "S", "N", "T", "F", "J", "P"])]);
export type MbtiTarget = z.infer<typeof MbtiTargetSchema>;

export const PRODUCT_KEYS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
export const COMPATIBILITY_CATEGORIES = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const;

export const DimensionId = z.string().regex(/^[a-z][a-zA-Z]+$/);
/** 짧은 문장(한 줄 뜻, 비유, 형상, 이유). */
export const Line = z.string().min(6).max(90);
/** 장면: 사람·상황·행동이 보이는 1~2문장. */
export const Scene = z.string().min(20).max(140);
/**
 * 장면 사실 조건(P2). 브리프는 고객 사실과 맞는 장면만 고른다.
 * relationship: unmarried = "결혼하면/함께 살게 되면" 같은 언젠가형(미혼·관계 미상 전용, 기혼 제외).
 * children: has = 자녀 있음 전용, none = "아이를 키우게 되면" 같은 언젠가형(자녀 없음·미상 전용).
 * job: employed = 회사·조직 소속 전제, business = 가게·사업 전제, student = 학교 전제.
 */
export const RELATIONSHIP_REQUIREMENTS = ["any", "single", "dating", "married", "unmarried"] as const;
export const CHILDREN_REQUIREMENTS = ["any", "has", "none"] as const;
export const JOB_REQUIREMENTS = ["any", "employed", "business", "student"] as const;
export const SceneRequiresSchema = z.object({
  relationship: z.enum(RELATIONSHIP_REQUIREMENTS),
  children: z.enum(CHILDREN_REQUIREMENTS),
  job: z.enum(JOB_REQUIREMENTS),
}).strict();
export type SceneRequires = z.infer<typeof SceneRequiresSchema>;
export const SceneItemSchema = z.object({ text: Scene, requires: SceneRequiresSchema }).strict();
export type SceneItem = z.infer<typeof SceneItemSchema>;
/** 설명문(강약 규칙·위치 뉘앙스·근거 포함 팩폭). */
export const Para = z.string().min(10).max(220);
export const Sources = z.array(z.string().min(2)).min(1);
export const ConfidenceSchema = z.enum(["통용", "학파차이", "추정"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;
export const LinkKindSchema = z.enum(["resonance", "tension", "conditional"]);

/** dimensionTags: 차원 id → -1~1 (0 금지). */
export const DimensionTagsSchema = z.record(DimensionId, z.number().min(-1).max(1).refine(v => v !== 0, "0은 태그를 빼라"));

const domainRecord = <T extends z.ZodTypeAny>(inner: T) => z.object(Object.fromEntries(DOMAINS.map(d => [d, inner])) as Record<Domain, T>);
export const ScenesSchema = domainRecord(z.array(SceneItemSchema).min(2).max(6));
export type Scenes = z.infer<typeof ScenesSchema>;

export const ImageSchema = z.object({ metaphor: Line, visual: Line });
export const MbtiLinkSchema = z.object({ target: MbtiTargetSchema, kind: LinkKindSchema, why: Line });
export type MbtiLink = z.infer<typeof MbtiLinkSchema>;

// ---------- 1) behavior-ontology.json ----------
export const BehaviorDimensionSchema = z.object({
  id: DimensionId, name: z.string().min(2).max(10), definition: Line,
  poles: z.object({ plus: z.object({ label: z.string().min(2).max(12), description: Line }), minus: z.object({ label: z.string().min(2).max(12), description: Line }) }),
  domains: z.array(DomainSchema).min(1),
  sceneTemplates: z.array(z.object({ pole: z.enum(["+", "-"]), domain: DomainSchema, text: z.string().min(8).max(140) })).min(2),
});
export const BehaviorOntologySchema = z.object({ version: z.string(), note: z.string().optional(), domains: z.array(DomainSchema), dimensions: z.array(BehaviorDimensionSchema).min(25).max(40) });
export type BehaviorOntology = z.infer<typeof BehaviorOntologySchema>;

// ---------- 2) myeongri/<family>.json ----------
export const FEATURE_FAMILIES = ["stem", "branch", "dayPillar", "dayMaster", "tenGod", "tenGodBalance", "shinsal", "gwiin", "twelveStage", "relation", "element", "yinYang", "climate", "structure"] as const;
export const FeatureFamilySchema = z.enum(FEATURE_FAMILIES);
export type FeatureFamily = z.infer<typeof FeatureFamilySchema>;
/** 년·월·일·시 어디에 있느냐로 뜻이 달라지는 가족. 이 가족은 positionNuance 필수. */
export const POSITIONAL_FAMILIES: readonly FeatureFamily[] = ["stem", "branch", "tenGod", "shinsal", "gwiin", "twelveStage"];

export const PositionNuanceSchema = z.object({ year: Para, month: Para, day: Para, hour: Para });
export const StrengthRulesSchema = z.object({
  strong: Para, weak: Para,
  duplicate: Para.optional(),
  clash: Para.optional(),
  /** 계산식 메모(브리프가 강약을 어떻게 판정하는지). 고객 본문 노출 금지. */
  rule: z.string().min(6).max(200).optional(),
});
/** 합충형해의 짝(子午충 등)처럼 한 요소 안의 변형. 전체 스키마를 반복하지 않고 이미지·한 줄·뉘앙스만 둔다. */
export const VariantSchema = z.object({
  key: z.string().min(1).max(24), name: z.string().min(1).max(30), oneLiner: Line,
  image: ImageSchema,
  nuance: Para.optional(),
});
/** 오행 부족·미흡 전용: 보완 행동, 보완 상대 묘사, 만남 장소. */
export const RemedySchema = z.object({
  actions: z.array(Scene).min(3).max(6),
  partner: z.array(Scene).min(2).max(4),
  places: z.array(z.string().min(2).max(40)).min(3).max(6),
});

export const MyeongriFeatureSchema = z.object({
  id: z.string().min(3).max(60),
  family: FeatureFamilySchema,
  /** 한글(한자) 예: "현침살(懸針殺)", "정화(丁火)" */
  name: z.string().min(1).max(30),
  easyName: z.string().min(2).max(16),
  oneLiner: Line,
  image: ImageSchema,
  /** 이미지 변형(P3.5 A1): 기본 이미지의 핵심 대상은 유지하고 틀·장소·때를 바꾼 그림. 브리프가 고객마다 [기본 + 변형] 중 하나를 고른다. 감지 빈도 상위 30%는 3개 이상(lint). */
  imageVariants: z.array(ImageSchema).max(6).optional(),
  scenes: ScenesSchema,
  /** 좋은 면. 단정형 가능. */
  strengths: z.array(Para).min(2).max(6),
  /** 과사용·팩폭 재료. 문장 안에 근거(어떤 조건에서 그런지)를 적는다. */
  overuse: z.array(Para).min(1).max(5),
  positionNuance: PositionNuanceSchema.optional(),
  strengthRules: StrengthRulesSchema,
  dimensionTags: DimensionTagsSchema.refine(t => Object.keys(t).length >= 2, "dimensionTags 2개 이상"),
  mbtiLinks: z.array(MbtiLinkSchema).min(2).max(8),
  variants: z.array(VariantSchema).optional(),
  remedy: RemedySchema.optional(),
  /** 엔진(src/lib/saju)이 이 요소를 계산해 내는가. false면 브리프가 쓰지 않고 P2 엔진 확장 대상. */
  engineSupport: z.boolean(),
  /** 엔진이 내는 코드·라벨(ShinsalCode, ElementLabel, TenGod 등). */
  engineKey: z.string().optional(),
  /** 내부 전용. 고객 본문 노출 금지. 예: "classic:sm2:論將星華蓋", "deep:marker:dohwa", "v4:depth:day_master_jeonghwa", "통용" */
  sources: Sources,
  confidence: ConfidenceSchema,
  aliases: z.array(z.string()).optional(),
});
export type MyeongriFeature = z.infer<typeof MyeongriFeatureSchema>;
export const MyeongriFileSchema = z.object({ version: z.string(), family: FeatureFamilySchema, features: z.array(MyeongriFeatureSchema).min(1) });
export type MyeongriFile = z.infer<typeof MyeongriFileSchema>;

// ---------- 3) mbti/<TYPE>.json ----------
export const MbtiSignalsSchema = domainRecord(z.array(SceneItemSchema).min(3).max(5));
export const MbtiCompatSchema = z.object({ type: MbtiTypeSchema, fit: z.enum(["좋음", "보통", "노력"]), why: Line });
export const MbtiProfileSchema = z.object({
  type: MbtiTypeSchema,
  easyName: z.string().min(2).max(16),
  oneLiner: Line,
  image: ImageSchema,
  cognitiveFunctions: z.array(z.object({ code: CognitiveFunctionSchema, role: z.enum(["주기능", "부기능", "3차기능", "열등기능"]), easy: Para })).length(4),
  /** 7영역 × 3 행동 신호(장면). */
  signals: MbtiSignalsSchema,
  shadows: z.array(Para).length(2),
  jobs: z.array(z.string().min(2).max(20)).min(5).max(12),
  /** 통념 궁합표. 15개 상대 유형마다 왜 한 줄. 본문에는 "통념"임을 밝힌다. */
  conventionalCompat: z.array(MbtiCompatSchema).length(15),
  dimensionTags: DimensionTagsSchema.refine(t => Object.keys(t).length >= 8, "dimensionTags 8개 이상"),
  sources: Sources,
});
export type MbtiProfile = z.infer<typeof MbtiProfileSchema>;
export const MbtiFileSchema = z.object({ version: z.string(), profiles: z.array(MbtiProfileSchema).min(1) });

// ---------- 4) fusion/*.json ----------
export const FactRequirementSchema = z.enum(["exactTime", "approximateTime", "mbtiKnown", "genderKnown", "contextKnown"]);
export const FusionRuleSchema = z.object({
  id: z.string().min(4),
  myeongriId: z.string().min(3),
  mbtiTarget: MbtiTargetSchema,
  kind: LinkKindSchema,
  dimension: DimensionId.optional(),
  score: z.number().optional(),
  /** 왜 겹치는지(공명) 또는 왜 당기는지(긴장). 명리 근거와 MBTI 근거를 한 문장씩. */
  why: Para,
  /** 상위 쌍은 장면 필수. 나머지는 생략 가능. */
  scene: SceneItemSchema.optional(),
  factBoundary: z.object({ requires: z.array(FactRequirementSchema), forbids: z.array(z.string()) }),
  sources: Sources,
});
export type FusionRule = z.infer<typeof FusionRuleSchema>;
export const FusionFileSchema = z.object({ version: z.string(), method: z.string().optional(), rules: z.array(FusionRuleSchema).min(1) });

// ---------- 5) timeline/*.json ----------
export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const TEN_GODS = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "正印"] as const;
export const TenGodSchema = z.enum(TEN_GODS);
export const ELEMENTS = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"] as const;

/** 60간지의 연 기운·월 기운 해석. */
export const GanjiEnergySchema = z.object({
  ganji: z.string().regex(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/),
  name: z.string().min(2).max(10),
  image: ImageSchema,
  year: z.object({ mood: Para, keywords: z.array(z.string().min(1).max(8)).min(2).max(3), action: Line }),
  month: z.object({ mood: Para, keywords: z.array(z.string().min(1).max(8)).min(2).max(3), action: Line }),
  sources: Sources, confidence: ConfidenceSchema,
});
export const GanjiEnergyFileSchema = z.object({ version: z.string(), entries: z.array(GanjiEnergySchema).length(60) });

/** 일간 대비 십성이 연·월로 들어올 때의 뜻. */
export const TenGodPeriodSchema = z.object({
  tenGod: TenGodSchema,
  year: z.object({ meaning: Para, scenes: z.array(SceneItemSchema).min(2).max(5), action: Line, caution: Para }),
  month: z.object({ meaning: Para, scenes: z.array(SceneItemSchema).min(2).max(5), action: Line }),
  sources: Sources, confidence: ConfidenceSchema,
});
export const TenGodPeriodFileSchema = z.object({ version: z.string(), entries: z.array(TenGodPeriodSchema).length(10) });

/** 합충형해 배지: 원국과 유입 간지 사이 관계의 쉬운 한 줄. */
export const BADGE_KINDS = ["STEM_HAP", "YUKHAP", "SAMHAP", "BANGHAP", "CHUNG", "HYEONG", "PA", "HAE", "WONJIN", "GONGMANG"] as const;
export const BadgeSchema = z.object({
  kind: z.enum(BADGE_KINDS),
  /** 짝(예 "子午"). 없으면 종류 공통 배지. */
  pair: z.string().min(2).max(6).optional(),
  label: z.string().min(2).max(12),
  line: Line,
  tone: z.enum(["plus", "minus", "mixed"]),
});
export const BadgeFileSchema = z.object({ version: z.string(), badges: z.array(BadgeSchema).min(8) });

/** 흐름 세기(1~5) 규칙: 설명 가능한 가중치 합. UI에 "참고" 표기. */
export const FlowRuleSchema = z.object({
  version: z.string(),
  note: z.string(),
  base: z.number().int().min(1).max(5),
  weights: z.array(z.object({ key: z.string().min(2), when: z.string().min(4).max(160), delta: z.number().min(-3).max(3) })).min(5),
  clamp: z.tuple([z.number().int(), z.number().int()]),
  labels: z.record(z.string().regex(/^[1-5]$/), z.string().min(2).max(12)),
});
export type FlowRule = z.infer<typeof FlowRuleSchema>;

/** 추천 행동 템플릿: 십성·영역·세기 조합 → 한 줄 행동. {name} 치환 허용. 사실 중립(직장·연인·자녀 전제 금지).
 *  P2: 십성 10 × 타임라인 영역 6 × 세기 2구간(flow [1,2,3] / [4,5]) = 120 조합이 모두 있어야 한다(세운 12개월 템플릿 반복 0). */
export const TIMELINE_ACTION_DOMAINS = ["work", "money", "study", "love", "relationships", "alone"] as const;
export const ActionTemplateSchema = z.object({
  id: z.string().min(3),
  when: z.object({ tenGod: TenGodSchema.optional(), domain: z.enum(TIMELINE_ACTION_DOMAINS).optional(), element: z.enum(ELEMENTS).optional(), flow: z.array(z.number().int().min(1).max(5)).optional(), badge: z.enum(BADGE_KINDS).optional() }),
  text: z.array(Line).min(2).max(4),
});
export const ActionTemplateFileSchema = z.object({ version: z.string(), templates: z.array(ActionTemplateSchema).min(20) });

// ---------- 6) product-narratives.json (v1 유지) ----------
export const ChapterRoleSchema = z.enum(["HOOK", "WHY", "SCENE", "TWIST", "PAYOFF"]);
export const ChapterPlanSchema = z.object({
  id: z.string().min(2), title: z.string().min(2).max(30), question: z.string().min(8).max(80), role: ChapterRoleSchema,
  domains: z.array(DomainSchema).min(1), dimensionFocus: z.array(DimensionId).optional(),
  evidenceFamilies: z.array(z.string()).optional(), requires: z.array(z.enum(["exactTime", "approximateTime", "mbtiKnown", "genderKnown", "contextKnown", "pair"])).optional(),
  paragraphs: z.object({ min: z.number().int().min(1), max: z.number().int().min(1) }),
  repeat: z.number().int().min(2).optional(),
});
export const ProductNarrativeSchema = z.object({
  productKey: z.enum(PRODUCT_KEYS), title: z.string(), funType: z.string().min(2).max(20), narrativeMode: z.string().min(8).max(200),
  chapters: z.array(ChapterPlanSchema).min(5),
  forbidden: z.array(z.string().min(4)).min(1),
  noRepeatRules: z.array(z.string().min(8)).min(1),
  compatibility: z.record(z.enum(COMPATIBILITY_CATEGORIES), z.object({ sceneDomains: z.array(DomainSchema).min(1), roleLabels: z.tuple([z.string(), z.string()]), forbidden: z.array(z.string()).min(1), tone: z.string().min(4).max(80) })).optional(),
});
export const ProductNarrativesSchema = z.object({ version: z.string(), note: z.string().optional(), products: z.array(ProductNarrativeSchema).length(6) });
export type ProductNarratives = z.infer<typeof ProductNarrativesSchema>;

// ---------- 7) id-map.json (V4·v1 id → v2 id) ----------
export const IdMapSchema = z.object({ version: z.string(), entries: z.array(z.object({ oldId: z.string(), newId: z.string(), source: z.enum(["v4", "knowledge-v5-v1", "engine"]), note: z.string().optional() })).min(1) });
export type IdMap = z.infer<typeof IdMapSchema>;

// ---------- 8) love/signals.json (P3.7 1-4: 호감 표현·연락 패턴·밀당 방식) ----------
/** key = tenGod:<십성> | shinsal:DOHWASAL | shinsal:HONGYEOMSAL | mbti:<유형>. 장면은 고객 사실 조건(requires)으로 거른다. */
export const LoveAspectSchema = z.object({ line: Line, scenes: z.array(SceneItemSchema).min(2).max(3) }).strict();
export const LOVE_SIGNAL_KEY = /^(tenGod:(比肩|劫財|食神|傷官|偏財|正財|偏官|正官|偏印|正印)|shinsal:(DOHWASAL|HONGYEOMSAL)|mbti:[EI][NS][TF][JP])$/;
export const LoveSignalSchema = z.object({
  key: z.string().regex(LOVE_SIGNAL_KEY), name: z.string().min(2).max(30),
  crush: LoveAspectSchema, contact: LoveAspectSchema, pushPull: LoveAspectSchema, sources: Sources,
}).strict();
export const LoveSignalFileSchema = z.object({ version: z.string(), family: z.literal("loveSignal"), entries: z.array(LoveSignalSchema).min(28) }).strict();
export type LoveSignal = z.infer<typeof LoveSignalSchema>;

// ---------- 9) career/jobs.json (P3.7 1-4: 구체 직무명 추천 · 지금 직업 적합도와 키울 역할) ----------
export const TEN_GOD_GROUPS = ["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"] as const;
const TenGodGroupSchema = z.enum(TEN_GOD_GROUPS);
/** key = group:<묶음> | tenGod:<십성> | shinsal:<코드> | gwiin:<코드>. title은 분야가 아니라 구체 직무명, why는 그 기운이 왜 이 직무에서 쓰이는지 한 줄. */
export const JobTitleEntrySchema = z.object({
  key: z.string().regex(/^(group:(PEER|OUTPUT|WEALTH|OFFICER|RESOURCE)|tenGod:(比肩|劫財|食神|傷官|偏財|正財|偏官|正官|偏印|正印)|(shinsal|gwiin):[A-Z_]+)$/),
  jobs: z.array(z.object({ title: z.string().min(2).max(20), why: Line }).strict()).min(4).max(8),
}).strict();
/** 지금 직업(brief/data/props.json 직업군 id) → 잘 맞는 십성 묶음 1~2 + 묶음별 그 직업 안에서 키울 역할 한 줄. */
export const JobFitSchema = z.object({
  jobId: z.string().min(2), groups: z.array(TenGodGroupSchema).min(1).max(2),
  grow: z.object({ PEER: Line, OUTPUT: Line, WEALTH: Line, OFFICER: Line, RESOURCE: Line }).strict(),
}).strict();
export const CareerFileSchema = z.object({ version: z.string(), family: z.literal("career"), titles: z.array(JobTitleEntrySchema).min(15), fits: z.array(JobFitSchema).min(1) }).strict();
export type CareerFile = z.infer<typeof CareerFileSchema>;
