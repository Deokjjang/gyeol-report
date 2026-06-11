import {
  INTERPRETATION_TAG_IDS,
  type InterpretationTagId,
} from "./interpretationTags";
import type {
  ComprehensiveReportEvidencePacket,
  EvidenceRole,
} from "./comprehensiveReportEvidenceTypes";
import { FUSION_KNOWLEDGE_BASE } from "./fusionKnowledgeBase";
import type { FusionKnowledgeRule, FusionRuleKind } from "./fusionKnowledgeTypes";
import { MBTI_KNOWLEDGE_BASE } from "./mbtiKnowledgeBase";
import { MBTI_TYPES, type MbtiKnowledgeEntry, type MbtiType } from "./mbtiKnowledgeTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "./reportSectionSchema";
import { FIVE_ELEMENTS, SAJU_KNOWLEDGE_BASE, TEN_GODS } from "./sajuKnowledgeBase";
import {
  SAJU_KNOWLEDGE_TOPICS,
  type FiveElement,
  type KnowledgePhraseSeeds,
  type SajuKnowledgeEntry,
  type SajuKnowledgeTopic,
} from "./sajuKnowledgeTypes";

export type ReportKnowledgeValidationInput = {
  readonly sections?: readonly ComprehensiveReportSectionDefinition[];
  readonly sajuEntries?: readonly SajuKnowledgeEntry[];
  readonly mbtiEntries?: readonly MbtiKnowledgeEntry[];
  readonly fusionRules?: readonly FusionKnowledgeRule[];
};

export type ReportKnowledgeValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
};

const forbiddenPredictionPhrases = [
  "반드시 " + "결혼한다",
  "죽" + "는다",
  "사고가 " + "난다",
  "무조건 " + "이혼한다",
  "몇월 " + "며칠에",
  "몇월 " + "며칠에 " + "반드시",
  "100% " + "확정",
  "100% " + "이런 사람",
  "무조건 " + "CEO",
  "반드시 " + "예술가",
  "절대 " + "실패한다",
  "절대 " + "성공한다",
] as const;

const requiredMbtiTopics = [
  "personality",
  "strengths",
  "weaknesses",
  "work_career",
  "money_asset",
  "love_relationship",
  "human_relations",
  "family_independence",
  "study_growth",
  "final_advice",
] as const satisfies readonly SajuKnowledgeTopic[];

const entjRequiredTags = [
  "achievement_drive",
  "efficiency_focus",
  "leadership",
  "control_need",
  "strategic_thinking",
  "money_orientation",
  "authority_orientation",
  "direct_speech",
  "responsibility_pressure",
  "growth_orientation",
  "workplace_romance",
  "emotional_dryness",
  "burnout_risk",
  "relationship_distance",
] as const satisfies readonly InterpretationTagId[];

const requiredFusionKindCounts = {
  reinforcement: 20,
  contrast: 15,
  compensation: 10,
  topic_specialization: 15,
} as const satisfies Record<FusionRuleKind, number>;

const requiredEntjFusionSummaries = [
  "갑신일주 + ENTJ leadership/control",
  "편관 + ENTJ responsibility_pressure",
  "정관 + ENTJ authority_orientation",
  "현침살 + ENTJ 직설성",
  "수 부족/무인성 + ENTJ emotional_dryness",
  "수 부족 + ENTJ 감정 건조함",
  "화 부족 + ENTJ 외향성 contrast",
  "무식상 + ENTJ 자기 어필 contrast",
  "재다신약 + ENTJ 워커홀릭",
  "토 과다 + ENTJ 현실성",
  "금 강함 + ENTJ 판단력",
  "갑목/갑신 + ENTJ 지휘 욕구",
  "편관/정관 + ENTJ 리더십",
  "현침살 + ENTJ strategic thinking",
  "편재/정재 + ENTJ 돈 구조 설계",
  "재고귀인 + ENTJ 자산화",
  "홍염살 + ENTJ 카리스마",
  "도화살 + ENTJ public_presence",
  "화 부족 + ENTJ 애정표현 contrast",
  "재성 강함 + ENTJ 현실적 연애",
  "무인성 + ENTJ 들어주는 힘",
  "관성 강함 + ENTJ 높은 기준",
  "비겁 + ENTJ competition",
] as const;

const requiredContrastFusionSummaries = [
  "화 부족 + E 유형 expression contrast",
  "F 유형 + 금/관성 strong 기준과 책임",
  "T 유형 + 수 강함 감정 깊이",
  "P 유형 + 정관 strong 규칙 책임",
  "J 유형 + 역마살 변화 욕구",
  "I 유형 + 도화/홍염 존재감",
  "S 유형 + 인성/문창 학습 기획",
  "N 유형 + 토 과다 현실 책임",
] as const;

const privatePacketMarkers = [
  "paymentKey",
  "providerPaymentId",
  "provider_payment_id",
  "inputSnapshot",
  "input_snapshot",
  "shareToken",
  "accessTokenHash",
  "TOSS_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE",
] as const;

const requiredTenGodTopics = [
  "personality",
  "work_career",
  "money_asset",
  "love_relationship",
  "human_relations",
  "weaknesses",
  "final_advice",
] as const satisfies readonly SajuKnowledgeTopic[];

const requiredFiveElementIds = [
  "element_wood",
  "element_fire",
  "element_earth",
  "element_metal",
  "element_water",
] as const;

const requiredTenGodIds = [
  "ten_god_bijian",
  "ten_god_jie_cai",
  "ten_god_shi_shen",
  "ten_god_shang_guan",
  "ten_god_pian_cai",
  "ten_god_zheng_cai",
  "ten_god_qi_sha",
  "ten_god_zheng_guan",
  "ten_god_pian_yin",
  "ten_god_zheng_yin",
] as const;

const requiredPatternIds = [
  "pattern_jaeda_sinyak",
  "pattern_gwansal_honjob",
  "pattern_siksang_saengjae",
  "pattern_jaesaenggwan",
  "pattern_salin_sangsaeng",
  "pattern_singang",
  "pattern_sinyak",
  "pattern_no_resource",
  "pattern_no_output",
  "pattern_toda_maegeum",
  "pattern_geumda_mokjeol",
  "pattern_mokda_hwasik",
  "pattern_suda_mokbu",
] as const;

const requiredSignalIds = [
  "sinsal_hyeonchim",
  "sinsal_hongyeom",
  "sinsal_mangsin",
  "sinsal_baekho",
  "sinsal_yeokma",
  "sinsal_gwimun",
  "sinsal_wonjin",
  "nobleman_cheoneul",
  "nobleman_cheondeok",
  "nobleman_woldeok",
  "nobleman_munchang",
  "nobleman_taegeuk",
  "nobleman_jaego",
  "gwiin_jaego",
  "sinsal_dohwa",
  "sinsal_hwagae",
  "sinsal_goegang",
  "sinsal_yangin",
  "sinsal_cheonmun",
  "sinsal_wolsal",
  "sinsal_jangseong",
  "sinsal_banan",
] as const;

const requiredDayMasterIds = [
  "day_master_gabmok",
  "day_master_eulmok",
  "day_master_byeonghwa",
  "day_master_jeonghwa",
  "day_master_muto",
  "day_master_gito",
  "day_master_gyeonggeum",
  "day_master_singeum",
  "day_master_imsu",
  "day_master_gyesu",
] as const;

const requiredDayPillarIds = [
  "day_pillar_gapsin",
  "day_pillar_gihae",
  "day_pillar_gabja",
  "day_pillar_gapjin",
  "day_pillar_eulsa",
  "day_pillar_byeongoh",
  "day_pillar_jeonghae",
  "day_pillar_mujin",
  "day_pillar_gyeongsin",
  "day_pillar_sinyu",
  "day_pillar_imja",
  "day_pillar_gyemyo",
] as const;

function pushDuplicateErrors(
  errors: string[],
  label: string,
  ids: readonly string[],
): void {
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      errors.push(`${label} duplicate id: ${id}`);
    }
    seen.add(id);
  }
}

function hasPhraseSeeds(value: KnowledgePhraseSeeds): boolean {
  return (
    value.analytical.length > 0 &&
    value.conversational.length > 0 &&
    value.caution.length > 0 &&
    value.advice.length > 0
  );
}

function hasDensePhraseSeeds(value: KnowledgePhraseSeeds): boolean {
  return (
    value.analytical.length >= 3 &&
    value.conversational.length >= 3 &&
    value.caution.length >= 2 &&
    value.advice.length >= 2
  );
}

function getDuplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
}

function collectPhraseSeeds(value: KnowledgePhraseSeeds): readonly string[] {
  return [
    ...value.analytical,
    ...value.conversational,
    ...value.caution,
    ...value.advice,
  ];
}

function collectUnknownTags(
  tags: readonly InterpretationTagId[],
  validTagIds: ReadonlySet<string>,
): string[] {
  return tags.filter((tag) => !validTagIds.has(tag));
}

function appendTagErrors(
  errors: string[],
  owner: string,
  tags: readonly InterpretationTagId[],
  validTagIds: ReadonlySet<string>,
): void {
  const unknownTags = collectUnknownTags(tags, validTagIds);

  for (const tag of unknownTags) {
    errors.push(`${owner} references unknown tag: ${tag}`);
  }
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, item]) => [
      key,
      ...collectStrings(item),
    ]);
  }

  return [];
}

function appendTextSafetyErrors(
  errors: string[],
  label: string,
  source: unknown,
): void {
  for (const text of collectStrings(source)) {
    if (text.length > 420) {
      errors.push(`${label} contains an overlong text fragment.`);
    }

    for (const phrase of forbiddenPredictionPhrases) {
      if (text.includes(phrase)) {
        errors.push(`${label} contains forbidden prediction phrase: ${phrase}`);
      }
    }
  }
}

function appendPhraseSeedSafetyErrors(
  errors: string[],
  entry: SajuKnowledgeEntry | MbtiKnowledgeEntry,
  label: string,
): void {
  for (const text of collectStrings(entry.phraseSeeds)) {
    if (text.length > 160) {
      errors.push(`${label} contains an overlong phrase seed.`);
    }
  }
}

function isFiveElement(value: string): value is FiveElement {
  return (FIVE_ELEMENTS as readonly string[]).includes(value);
}

function isTenGod(value: string): boolean {
  return (TEN_GODS as readonly string[]).includes(value);
}

function appendElementErrors(errors: string[], entry: SajuKnowledgeEntry): void {
  const elements = [
    ...(entry.matchingHints?.helpfulElements ?? []),
    ...(entry.matchingHints?.difficultElements ?? []),
  ];

  for (const element of elements) {
    if (!isFiveElement(String(element))) {
      errors.push(`saju ${entry.id} references invalid element: ${String(element)}`);
    }
  }
}

function hasTopicInterpretations(entry: SajuKnowledgeEntry): boolean {
  return (
    entry.topicInterpretations !== undefined &&
    Object.keys(entry.topicInterpretations).length > 0
  );
}

function hasTopicWeights(entry: SajuKnowledgeEntry): boolean {
  return Object.keys(entry.topicWeights).length > 0;
}

function hasMbtiTopicWeights(entry: MbtiKnowledgeEntry): boolean {
  return Object.keys(entry.topicWeights).length > 0;
}

function hasMbtiTopicInterpretations(entry: MbtiKnowledgeEntry): boolean {
  return (
    entry.topicInterpretations !== undefined &&
    Object.keys(entry.topicInterpretations).length > 0
  );
}

function hasRelationshipPreferences(entry: MbtiKnowledgeEntry): boolean {
  return (
    entry.relationshipPreferences.attracts.length > 0 ||
    entry.relationshipPreferences.needs.length > 0 ||
    entry.relationshipPreferences.risks.length > 0
  );
}

function validateSections(
  errors: string[],
  sections: readonly ComprehensiveReportSectionDefinition[],
): void {
  const interpretationSections = sections.filter(
    (section) =>
      section.primaryBasis !== "display" && section.id !== "mbti_core",
  );
  const sajuFirstCount = interpretationSections.filter(
    (section) => section.sajuWeight > section.mbtiWeight,
  ).length;

  pushDuplicateErrors(
    errors,
    "section",
    sections.map((section) => section.id),
  );

  if (sajuFirstCount < Math.ceil(interpretationSections.length * 0.75)) {
    errors.push("Most interpretation sections must be saju-first.");
  }

  for (const section of sections) {
    if (section.titleKo.trim().length === 0) {
      errors.push(`section ${section.id} is missing Korean title.`);
    }
    if (section.primaryBasis !== "display" && section.minimumEvidenceCount < 1) {
      errors.push(`section ${section.id} needs at least one evidence item.`);
    }
  }
}

function validateSajuEntries(
  errors: string[],
  entries: readonly SajuKnowledgeEntry[],
  validTagIds: ReadonlySet<string>,
): void {
  pushDuplicateErrors(
    errors,
    "saju",
    entries.map((entry) => entry.id),
  );

  for (const entry of entries) {
    if (!hasPhraseSeeds(entry.phraseSeeds)) {
      errors.push(`saju ${entry.id} is missing phrase seeds.`);
    }
    if (!hasDensePhraseSeeds(entry.phraseSeeds)) {
      errors.push(`saju ${entry.id} needs dense phrase seeds.`);
    }
    if (!hasTopicWeights(entry)) {
      errors.push(`saju ${entry.id} has empty topic weights.`);
    }
    if (!hasTopicInterpretations(entry)) {
      errors.push(`saju ${entry.id} is missing topic interpretations.`);
    }
    for (const alias of getDuplicateValues(entry.aliases)) {
      errors.push(`saju ${entry.id} has duplicate alias: ${alias}`);
    }
    appendTagErrors(errors, `saju ${entry.id}`, entry.positiveTags, validTagIds);
    appendTagErrors(errors, `saju ${entry.id}`, entry.riskTags, validTagIds);
    appendTagErrors(errors, `saju ${entry.id}`, entry.mbtiBridgeTags, validTagIds);
    appendElementErrors(errors, entry);
    appendPhraseSeedSafetyErrors(errors, entry, `saju ${entry.id}`);
  }
}

function validateMbtiEntries(
  errors: string[],
  entries: readonly MbtiKnowledgeEntry[],
  validTagIds: ReadonlySet<string>,
): void {
  const existingTypes = new Set(entries.map((entry) => entry.type));

  pushDuplicateErrors(
    errors,
    "mbti",
    entries.map((entry) => entry.type),
  );

  for (const type of MBTI_TYPES) {
    if (!existingTypes.has(type)) {
      errors.push(`missing MBTI type: ${type}`);
    }
  }

  for (const entry of entries) {
    if (!hasPhraseSeeds(entry.phraseSeeds)) {
      errors.push(`mbti ${entry.type} is missing phrase seeds.`);
    }
    if (!hasDensePhraseSeeds(entry.phraseSeeds)) {
      errors.push(`mbti ${entry.type} needs dense phrase seeds.`);
    }
    if (getDuplicateValues(collectPhraseSeeds(entry.phraseSeeds)).length > 0) {
      errors.push(`mbti ${entry.type} has duplicate phrase seeds.`);
    }
    if (entry.functionStack.length !== 4) {
      errors.push(`mbti ${entry.type} needs a function stack.`);
    }
    if (!hasMbtiTopicWeights(entry)) {
      errors.push(`mbti ${entry.type} has empty topic weights.`);
    }
    if (!hasMbtiTopicInterpretations(entry)) {
      errors.push(`mbti ${entry.type} is missing topic interpretations.`);
    }
    if (!hasRelationshipPreferences(entry)) {
      errors.push(`mbti ${entry.type} is missing relationship preferences.`);
    }
    if (entry.sajuBridgeTags.length === 0) {
      errors.push(`mbti ${entry.type} is missing saju bridge tags.`);
    }
    for (const element of [
      ...(entry.sajuBridge?.usefulSajuElements ?? []),
      ...(entry.sajuBridge?.difficultSajuElements ?? []),
    ]) {
      if (!isFiveElement(String(element))) {
        errors.push(`mbti ${entry.type} references invalid element: ${String(element)}`);
      }
    }
    for (const tenGod of entry.sajuBridge?.resonantTenGods ?? []) {
      if (!isTenGod(String(tenGod))) {
        errors.push(`mbti ${entry.type} references invalid ten god: ${String(tenGod)}`);
      }
    }
    for (const topic of Object.keys(entry.topicWeights)) {
      if (!SAJU_KNOWLEDGE_TOPICS.includes(topic as SajuKnowledgeTopic)) {
        errors.push(`mbti ${entry.type} references unknown topic: ${topic}`);
      }
    }
    for (const topic of Object.keys(entry.topicInterpretations ?? {})) {
      if (!SAJU_KNOWLEDGE_TOPICS.includes(topic as SajuKnowledgeTopic)) {
        errors.push(`mbti ${entry.type} has unknown topic interpretation: ${topic}`);
      }
    }
    appendPhraseSeedSafetyErrors(errors, entry, `mbti ${entry.type}`);
    appendTagErrors(errors, `mbti ${entry.type}`, entry.traitTags, validTagIds);
    appendTagErrors(errors, `mbti ${entry.type}`, entry.riskTags, validTagIds);
    appendTagErrors(errors, `mbti ${entry.type}`, entry.sajuBridgeTags, validTagIds);
    appendTagErrors(
      errors,
      `mbti ${entry.type}`,
      entry.relationshipPreferences.attracts,
      validTagIds,
    );
    appendTagErrors(
      errors,
      `mbti ${entry.type}`,
      entry.relationshipPreferences.needs,
      validTagIds,
    );
    appendTagErrors(
      errors,
      `mbti ${entry.type}`,
      entry.relationshipPreferences.risks,
      validTagIds,
    );
  }
}

function appendMissingMbtiTypeErrors(
  errors: string[],
  entriesByType: ReadonlyMap<MbtiType, MbtiKnowledgeEntry>,
): void {
  for (const type of MBTI_TYPES) {
    if (!entriesByType.has(type)) {
      errors.push(`missing MBTI type: ${type}`);
    }
  }
}

function validateMbtiEntryDensity(
  errors: string[],
  entry: MbtiKnowledgeEntry,
): void {
  if (entry.functionStack.length !== 4 || entry.functionProfile === undefined) {
    errors.push(`mbti ${entry.type} needs expanded function stack profile.`);
  }
  for (const topic of requiredMbtiTopics) {
    if (entry.topicInterpretations?.[topic] === undefined) {
      errors.push(`mbti ${entry.type} needs topic interpretation for ${topic}.`);
    }
  }
  if (!hasDensePhraseSeeds(entry.phraseSeeds)) {
    errors.push(`mbti ${entry.type} needs phrase seed density.`);
  }
  if (entry.sajuBridgeTags.length === 0 || entry.sajuBridge === undefined) {
    errors.push(`mbti ${entry.type} needs saju bridge data.`);
  }
  if (entry.workStyleKo === undefined || entry.workStyleKo.length === 0) {
    errors.push(`mbti ${entry.type} needs work style data.`);
  }
  if (entry.moneyStyleKo === undefined || entry.moneyStyleKo.length === 0) {
    errors.push(`mbti ${entry.type} needs money style data.`);
  }
  if (entry.loveStyleKo === undefined || entry.loveStyleKo.length === 0) {
    errors.push(`mbti ${entry.type} needs love style data.`);
  }
  if (entry.relationshipStyleKo === undefined || entry.relationshipStyleKo.length === 0) {
    errors.push(`mbti ${entry.type} needs relationship style data.`);
  }
  if (entry.growthAdviceKo === undefined || entry.growthAdviceKo.length === 0) {
    errors.push(`mbti ${entry.type} needs growth advice data.`);
  }
}

function validateKeyMbtiSemantics(
  errors: string[],
  entriesByType: ReadonlyMap<MbtiType, MbtiKnowledgeEntry>,
): void {
  const entj = entriesByType.get("ENTJ");
  const istj = entriesByType.get("ISTJ");
  const infp = entriesByType.get("INFP");

  if (entj !== undefined) {
    const entjTags = new Set([...entj.traitTags, ...entj.riskTags, ...entj.sajuBridgeTags]);

    for (const tag of entjRequiredTags) {
      if (!entjTags.has(tag)) {
        errors.push(`ENTJ missing required high-detail tag: ${tag}`);
      }
    }
  }
  if (istj !== undefined) {
    const text = collectStrings(istj).join(" ");

    for (const marker of ["신뢰", "책임", "안정", "규칙"]) {
      if (!text.includes(marker)) {
        errors.push(`ISTJ missing semantic marker: ${marker}`);
      }
    }
  }
  if (infp !== undefined) {
    const text = collectStrings(infp).join(" ");

    for (const marker of ["가치", "내면", "상처", "감성형"]) {
      if (!text.includes(marker)) {
        errors.push(`INFP missing semantic marker: ${marker}`);
      }
    }
  }
}

function appendMissingIdErrors(
  errors: string[],
  entriesById: ReadonlyMap<string, SajuKnowledgeEntry>,
  label: string,
  requiredIds: readonly string[],
): void {
  for (const id of requiredIds) {
    if (!entriesById.has(id)) {
      errors.push(`${label} missing required saju entry: ${id}`);
    }
  }
}

function validateElementDensity(
  errors: string[],
  entriesById: ReadonlyMap<string, SajuKnowledgeEntry>,
): void {
  for (const id of requiredFiveElementIds) {
    const entry = entriesById.get(id);

    if (entry === undefined) {
      continue;
    }
    if (entry.coreImageKo === undefined) {
      errors.push(`${id} needs a core image.`);
    }
    if (
      entry.balanceHints === undefined ||
      entry.careerHints === undefined ||
      entry.moneyHints === undefined ||
      entry.matchingHints === undefined
    ) {
      errors.push(`${id} needs expanded element hints.`);
    }
    for (const topic of [
      "personality",
      "work_career",
      "money_asset",
      "love_relationship",
      "human_relations",
      "study_growth",
      "environment_luck",
    ] as const satisfies readonly SajuKnowledgeTopic[]) {
      if (entry.topicInterpretations?.[topic] === undefined) {
        errors.push(`${id} needs topic interpretation for ${topic}.`);
      }
    }
  }
}

function validateTenGodDensity(
  errors: string[],
  entriesById: ReadonlyMap<string, SajuKnowledgeEntry>,
): void {
  for (const id of requiredTenGodIds) {
    const entry = entriesById.get(id);

    if (entry === undefined) {
      continue;
    }
    for (const topic of requiredTenGodTopics) {
      if (entry.topicInterpretations?.[topic] === undefined) {
        errors.push(`${id} needs ten-god topic interpretation for ${topic}.`);
      }
    }
  }
}

function validatePatternDensity(
  errors: string[],
  entriesById: ReadonlyMap<string, SajuKnowledgeEntry>,
): void {
  for (const id of requiredPatternIds) {
    const entry = entriesById.get(id);

    if (entry !== undefined && entry.patternHints === undefined) {
      errors.push(`${id} needs pattern hints.`);
    }
  }
}

function validateDayDensity(
  errors: string[],
  entriesById: ReadonlyMap<string, SajuKnowledgeEntry>,
): void {
  for (const id of requiredDayMasterIds) {
    const entry = entriesById.get(id);

    if (entry !== undefined && entry.coreImageKo === undefined) {
      errors.push(`${id} needs a day-master image.`);
    }
  }
  for (const id of requiredDayPillarIds) {
    const entry = entriesById.get(id);

    if (entry !== undefined && entry.dayPillarHints === undefined) {
      errors.push(`${id} needs day-pillar hints.`);
    }
  }
}

function validateFusionRules(
  errors: string[],
  rules: readonly FusionKnowledgeRule[],
  sajuEntries: readonly SajuKnowledgeEntry[],
  mbtiEntries: readonly MbtiKnowledgeEntry[],
  validTagIds: ReadonlySet<string>,
): void {
  const validSajuIds = new Set(sajuEntries.map((entry) => entry.id));
  const validMbtiTypes = new Set<MbtiType>(mbtiEntries.map((entry) => entry.type));
  const validTopics = new Set<string>(SAJU_KNOWLEDGE_TOPICS);

  pushDuplicateErrors(
    errors,
    "fusion",
    rules.map((rule) => rule.id),
  );

  for (const rule of rules) {
    const isSajuGated =
      rule.sajuEntryIds.length > 0 ||
      (rule.requiredSajuTags !== undefined && rule.requiredSajuTags.length > 0);

    if (!isSajuGated) {
      errors.push(`fusion ${rule.id} needs saju basis.`);
    }
    for (const id of rule.sajuEntryIds) {
      if (!validSajuIds.has(id)) {
        errors.push(`fusion ${rule.id} references unknown saju id: ${id}`);
      }
    }
    if (!validTopics.has(rule.topic)) {
      errors.push(`fusion ${rule.id} references unknown topic: ${rule.topic}`);
    }
    if (!Number.isFinite(rule.priority)) {
      errors.push(`fusion ${rule.id} priority must be numeric.`);
    }
    for (const type of rule.mbtiTypes ?? []) {
      if (!validMbtiTypes.has(type)) {
        errors.push(`fusion ${rule.id} references unknown MBTI type: ${type}`);
      }
    }
    appendTagErrors(
      errors,
      `fusion ${rule.id}`,
      rule.requiredSajuTags ?? [],
      validTagIds,
    );
    appendTagErrors(
      errors,
      `fusion ${rule.id}`,
      rule.requiredMbtiTags ?? [],
      validTagIds,
    );
    if (rule.phraseSeeds.length === 0) {
      errors.push(`fusion ${rule.id} is missing phrase seeds.`);
    }
  }
}

function validateFusionKindCounts(
  errors: string[],
  rules: readonly FusionKnowledgeRule[],
): void {
  for (const [kind, minimumCount] of Object.entries(requiredFusionKindCounts)) {
    const count = rules.filter((rule) => rule.kind === kind).length;

    if (count < minimumCount) {
      errors.push(`fusion kind ${kind} needs at least ${minimumCount} rules.`);
    }
  }
}

function appendMissingSummaryErrors(
  errors: string[],
  rules: readonly FusionKnowledgeRule[],
  label: string,
  summaries: readonly string[],
): void {
  const existingSummaries = new Set(rules.map((rule) => rule.summary));

  for (const summary of summaries) {
    if (!existingSummaries.has(summary)) {
      errors.push(`${label} missing required fusion rule: ${summary}`);
    }
  }
}

function validateEvidenceRoles(
  errors: string[],
  packet: ComprehensiveReportEvidencePacket,
): void {
  const allowedFusionRoles = new Set<EvidenceRole>([
    "fusion_reinforcement",
    "fusion_contrast",
    "fusion_compensation",
    "topic_specialization",
  ]);

  for (const section of packet.sections) {
    for (const item of section.primarySaju) {
      if (item.role !== "primary_saju") {
        errors.push(`${section.sectionId} primary saju has invalid role.`);
      }
      if (item.sourceId.startsWith("mbti_")) {
        errors.push(`${section.sectionId} has MBTI in primary saju evidence.`);
      }
    }
    for (const item of section.supportingMbti) {
      if (item.role !== "supporting_mbti") {
        errors.push(`${section.sectionId} supporting MBTI has invalid role.`);
      }
    }
    for (const item of section.fusion) {
      if (!allowedFusionRoles.has(item.role)) {
        errors.push(`${section.sectionId} fusion has invalid role.`);
      }
    }
  }
}

function appendPrivatePacketErrors(
  errors: string[],
  packet: ComprehensiveReportEvidencePacket,
): void {
  const serialized = collectStrings(packet).join("\n");

  for (const marker of privatePacketMarkers) {
    if (serialized.includes(marker)) {
      errors.push(`evidence packet contains private field marker: ${marker}`);
    }
  }
}

export function validateReportKnowledgeBase(
  input: ReportKnowledgeValidationInput = {},
): ReportKnowledgeValidationResult {
  const sections = input.sections ?? COMPREHENSIVE_REPORT_SECTION_DEFINITIONS;
  const sajuEntries = input.sajuEntries ?? SAJU_KNOWLEDGE_BASE;
  const mbtiEntries = input.mbtiEntries ?? MBTI_KNOWLEDGE_BASE;
  const fusionRules = input.fusionRules ?? FUSION_KNOWLEDGE_BASE;
  const validTagIds = new Set<string>(INTERPRETATION_TAG_IDS);
  const errors: string[] = [];

  validateSections(errors, sections);
  validateSajuEntries(errors, sajuEntries, validTagIds);
  validateMbtiEntries(errors, mbtiEntries, validTagIds);
  validateFusionRules(errors, fusionRules, sajuEntries, mbtiEntries, validTagIds);
  appendTextSafetyErrors(errors, "report knowledge", {
    sections,
    sajuEntries,
    mbtiEntries,
    fusionRules,
  });

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function validateSajuKnowledgeDensity(
  entries: readonly SajuKnowledgeEntry[] = SAJU_KNOWLEDGE_BASE,
): ReportKnowledgeValidationResult {
  const errors: string[] = [];
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));

  appendMissingIdErrors(errors, entriesById, "five element", requiredFiveElementIds);
  appendMissingIdErrors(errors, entriesById, "ten god", requiredTenGodIds);
  appendMissingIdErrors(errors, entriesById, "pattern", requiredPatternIds);
  appendMissingIdErrors(errors, entriesById, "sinsal gwiin", requiredSignalIds);
  appendMissingIdErrors(errors, entriesById, "day master", requiredDayMasterIds);
  appendMissingIdErrors(errors, entriesById, "day pillar", requiredDayPillarIds);
  validateElementDensity(errors, entriesById);
  validateTenGodDensity(errors, entriesById);
  validatePatternDensity(errors, entriesById);
  validateDayDensity(errors, entriesById);

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function validateMbtiKnowledgeDensity(
  entries: readonly MbtiKnowledgeEntry[] = MBTI_KNOWLEDGE_BASE,
): ReportKnowledgeValidationResult {
  const errors: string[] = [];
  const entriesByType = new Map(entries.map((entry) => [entry.type, entry]));

  appendMissingMbtiTypeErrors(errors, entriesByType);
  for (const entry of entries) {
    validateMbtiEntryDensity(errors, entry);
  }
  validateKeyMbtiSemantics(errors, entriesByType);

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function validateFusionKnowledgeDensity(
  rules: readonly FusionKnowledgeRule[] = FUSION_KNOWLEDGE_BASE,
): ReportKnowledgeValidationResult {
  const errors: string[] = [];
  const validTagIds = new Set<string>(INTERPRETATION_TAG_IDS);

  if (rules.length < 60) {
    errors.push("fusion knowledge base needs at least 60 rules.");
  }
  validateFusionKindCounts(errors, rules);
  validateFusionRules(
    errors,
    rules,
    SAJU_KNOWLEDGE_BASE,
    MBTI_KNOWLEDGE_BASE,
    validTagIds,
  );
  appendMissingSummaryErrors(
    errors,
    rules,
    "ENTJ density",
    requiredEntjFusionSummaries,
  );
  appendMissingSummaryErrors(
    errors,
    rules,
    "contrast density",
    requiredContrastFusionSummaries,
  );
  appendTextSafetyErrors(errors, "fusion knowledge", rules);

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function validateComprehensiveEvidencePacket(
  packet: ComprehensiveReportEvidencePacket,
): ReportKnowledgeValidationResult {
  const errors: string[] = [];
  const sectionsById = new Map(packet.sections.map((section) => [section.sectionId, section]));

  for (const sectionDefinition of COMPREHENSIVE_REPORT_SECTION_DEFINITIONS) {
    const section = sectionsById.get(sectionDefinition.id);

    if (section === undefined) {
      errors.push(`evidence packet missing section: ${sectionDefinition.id}`);
      continue;
    }
    if (
      sectionDefinition.primaryBasis !== "display" &&
      sectionDefinition.id !== "mbti_core" &&
      section.primarySaju.length === 0
    ) {
      errors.push(`${sectionDefinition.id} needs primary saju evidence.`);
    }
    if (sectionDefinition.id === "mbti_core" && section.supportingMbti.length === 0) {
      errors.push("mbti_core needs supporting MBTI evidence.");
    }
    if (sectionDefinition.id === "saju_mbti_fusion") {
      const roles = new Set(section.fusion.map((item) => item.role));

      if (!roles.has("fusion_reinforcement")) {
        errors.push("saju_mbti_fusion needs reinforcement evidence.");
      }
      if (!roles.has("fusion_contrast")) {
        errors.push("saju_mbti_fusion needs contrast evidence.");
      }
    }
  }

  validateEvidenceRoles(errors, packet);
  appendTextSafetyErrors(errors, "evidence packet", packet);
  appendPrivatePacketErrors(errors, packet);

  return {
    ok: errors.length === 0,
    errors,
  };
}
