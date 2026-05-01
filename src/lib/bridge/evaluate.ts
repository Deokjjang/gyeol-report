import { BRIDGE_RULES } from "./rules";
import type {
  BridgeEvidence,
  BridgeResult,
  BridgeRule,
  BridgeSignal,
} from "./types";
import type { MbtiProfile } from "../mbti/types";
import type { SajuTag } from "../saju/tags";

function hasAllSajuTags(
  requiredSajuTags: BridgeRule["requiredSajuTags"],
  sajuTagCodes: ReadonlySet<SajuTag["code"]>,
): boolean {
  return requiredSajuTags.every((code) => sajuTagCodes.has(code));
}

function hasAllMbtiTraits(
  requiredMbtiTraits: BridgeRule["requiredMbtiTraits"],
  mbtiTraitCodes: ReadonlySet<MbtiProfile["traits"][number]["code"]>,
): boolean {
  return requiredMbtiTraits.every((code) => mbtiTraitCodes.has(code));
}

function createEvidence(rule: BridgeRule): BridgeEvidence[] {
  return [
    ...rule.requiredSajuTags.map((code) => ({
      sajuTagCode: code,
      reasonKo: `사주 태그 ${code}가 감지되었습니다.`,
    })),
    ...rule.requiredMbtiTraits.map((code) => ({
      mbtiTraitCode: code,
      reasonKo: `MBTI 특성 ${code}가 감지되었습니다.`,
    })),
  ];
}

function createBridgeSignal(rule: BridgeRule): BridgeSignal {
  return {
    direction: rule.direction,
    strength: rule.strength,
    confidence: rule.confidence,
    titleKo: rule.titleKo,
    summaryKo: rule.summaryKo,
    evidence: createEvidence(rule),
  };
}

export function evaluateSajuMbtiBridge(params: {
  sajuTags: readonly SajuTag[];
  mbtiProfile: MbtiProfile;
}): BridgeResult {
  const sajuTagCodes = new Set(params.sajuTags.map((tag) => tag.code));
  const mbtiTraitCodes = new Set(
    params.mbtiProfile.traits.map((trait) => trait.code),
  );

  const signals = BRIDGE_RULES.filter(
    (rule) =>
      hasAllSajuTags(rule.requiredSajuTags, sajuTagCodes) &&
      hasAllMbtiTraits(rule.requiredMbtiTraits, mbtiTraitCodes),
  ).map((rule) => createBridgeSignal(rule));

  return {
    mbtiType: params.mbtiProfile.type,
    signals,
    notices: [],
  };
}
