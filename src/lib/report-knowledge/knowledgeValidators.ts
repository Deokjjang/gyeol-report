import {
  INTERPRETATION_TAG_IDS,
  type InterpretationTagId,
} from "./interpretationTags";
import { FUSION_KNOWLEDGE_BASE } from "./fusionKnowledgeBase";
import type { FusionKnowledgeRule } from "./fusionKnowledgeTypes";
import { MBTI_KNOWLEDGE_BASE } from "./mbtiKnowledgeBase";
import { MBTI_TYPES, type MbtiKnowledgeEntry, type MbtiType } from "./mbtiKnowledgeTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "./reportSectionSchema";
import { SAJU_KNOWLEDGE_BASE } from "./sajuKnowledgeBase";
import {
  SAJU_KNOWLEDGE_TOPICS,
  type KnowledgePhraseSeeds,
  type SajuKnowledgeEntry,
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
  "100% " + "확정",
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
    return Object.values(value).flatMap((item) => collectStrings(item));
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
    appendTagErrors(errors, `saju ${entry.id}`, entry.positiveTags, validTagIds);
    appendTagErrors(errors, `saju ${entry.id}`, entry.riskTags, validTagIds);
    appendTagErrors(errors, `saju ${entry.id}`, entry.mbtiBridgeTags, validTagIds);
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
    if (entry.functionStack.length < 4) {
      errors.push(`mbti ${entry.type} needs a function stack.`);
    }
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
    if (rule.sajuEntryIds.length === 0) {
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
