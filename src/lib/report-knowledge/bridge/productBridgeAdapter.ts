import type { MbtiTraitArea } from "../mbti";
import type {
  BridgeCompatibilityRelationCategory,
  MyeongliMbtiBridgeEvidence,
  MyeongliMbtiBridgePacket,
  ProductBridgeEvidenceItem,
  ProductBridgeEvidencePacket,
  ProductBridgeEvidencePurpose,
  ProductBridgeProductKey,
} from "./types";

export const PRODUCT_BRIDGE_KEYS = [
  "general",
  "careerMoneyStudy",
  "loveMarriageChild",
  "compatibility",
  "daeun",
  "saeun",
] as const satisfies readonly ProductBridgeProductKey[];

export const DEFAULT_FORBIDDEN_BRIDGE_ANGLES = [
  "명리 신호와 MBTI 성향을 같은 원인으로 단정하지 않는다.",
  "확정 예언, 진단, 보장 문장으로 쓰지 않는다.",
  "관계 파탄, 결혼 확정, 수익 확정 같은 결론으로 쓰지 않는다.",
] as const;

const PRODUCT_PRIMARY_PURPOSES = {
  general: ["identity", "growth"],
  careerMoneyStudy: ["career", "money", "investment", "study"],
  loveMarriageChild: ["love", "marriage", "parenting", "relationship"],
  compatibility: ["relationship", "love", "marriage"],
  daeun: ["timing", "career", "money", "growth"],
  saeun: ["timing", "relationship", "career", "growth"],
} as const satisfies Record<
  ProductBridgeProductKey,
  readonly ProductBridgeEvidencePurpose[]
>;

const PRODUCT_SUPPORTING_PURPOSES = {
  general: ["career", "relationship", "caution"],
  careerMoneyStudy: ["identity", "growth", "caution"],
  loveMarriageChild: ["identity", "growth", "caution"],
  compatibility: ["identity", "growth", "caution"],
  daeun: ["investment", "relationship", "caution"],
  saeun: ["identity", "caution"],
} as const satisfies Record<
  ProductBridgeProductKey,
  readonly ProductBridgeEvidencePurpose[]
>;

const PRODUCT_TONES = {
  general: "명리 중심 자기이해에 MBTI를 보조 근거로 짧게 붙인다.",
  careerMoneyStudy: "일, 돈, 투자, 공부 장면을 구체화하되 결과를 보장하지 않는다.",
  loveMarriageChild: "관계와 가족 역할을 조율 언어로 설명하고 확정 결론을 피한다.",
  compatibility: "두 사람의 관계 구조와 조율 포인트를 균형 있게 다룬다.",
  daeun: "10년 흐름의 배경 신호로 다루고 특정 사건을 예언하지 않는다.",
  saeun: "선택 연도의 행동 기준으로 다루고 월별 결과를 확정하지 않는다.",
} as const satisfies Record<ProductBridgeProductKey, string>;

const PRODUCT_FORBIDDEN_ANGLES = {
  general: ["성격 진단 확정", "운명 확정"],
  careerMoneyStudy: ["수익 확정", "합격 확정", "승진·이직 확정"],
  loveMarriageChild: ["무조건 헤어짐", "반드시 결혼", "배우자·자녀복 단정"],
  compatibility: ["절대 안 맞음", "관계 파탄 확정", "결혼 확정"],
  daeun: ["특정 사건 발생 확정", "10년 결과 보장"],
  saeun: ["정확한 날짜 예언", "월별 사건 확정"],
} as const satisfies Record<ProductBridgeProductKey, readonly string[]>;

const TRAIT_AREA_PURPOSES = {
  identity: ["identity"],
  thinkingStyle: ["identity"],
  career: ["career"],
  workplace: ["career"],
  money: ["money"],
  investment: ["investment"],
  study: ["study"],
  love: ["love"],
  marriage: ["marriage"],
  parenting: ["parenting"],
  child: ["parenting"],
  relationships: ["relationship"],
  communication: ["relationship"],
  strengths: ["identity"],
  risks: ["caution"],
  growth: ["growth"],
} as const satisfies Record<MbtiTraitArea, readonly ProductBridgeEvidencePurpose[]>;

const COMPATIBILITY_RELATION_CATEGORY_MAP: Readonly<
  Record<string, BridgeCompatibilityRelationCategory>
> = {
  love: "love",
  loverelationship: "love",
  romance: "love",
  dating: "love",
  marriage: "marriage",
  parentchild: "parentChild",
  workplacecolleague: "workplaceColleague",
  coworker: "workplaceColleague",
  bosssubordinate: "bossSubordinate",
  managerreport: "bossSubordinate",
  businessworkpartner: "businessPartner",
  businesspartner: "businessPartner",
  friendsocial: "friendSocial",
  friendship: "friendSocial",
};

export function buildProductBridgeEvidence(
  packet: MyeongliMbtiBridgePacket,
  productKey: ProductBridgeProductKey,
): ProductBridgeEvidencePacket {
  const items = packet.evidences.map((evidence) =>
    buildProductBridgeEvidenceItem(evidence, productKey),
  );

  return {
    productKey,
    primaryEvidence: items.filter((item) =>
      hasAnyPurpose(item, PRODUCT_PRIMARY_PURPOSES[productKey]),
    ),
    supportingEvidence: items.filter(
      (item) =>
        !hasAnyPurpose(item, PRODUCT_PRIMARY_PURPOSES[productKey]) &&
        hasAnyPurpose(item, PRODUCT_SUPPORTING_PURPOSES[productKey]),
    ),
    cautionEvidence: items.filter((item) => item.purposes.includes("caution")),
    recommendedTone: PRODUCT_TONES[productKey],
    forbiddenAngles: [
      ...DEFAULT_FORBIDDEN_BRIDGE_ANGLES,
      ...PRODUCT_FORBIDDEN_ANGLES[productKey],
    ],
  };
}

export function mapCompatibilityRelationCategory(
  input: string | null | undefined,
): BridgeCompatibilityRelationCategory | null {
  if (input === null || input === undefined) {
    return null;
  }

  return COMPATIBILITY_RELATION_CATEGORY_MAP[normalizeRelationCategory(input)] ?? null;
}

function buildProductBridgeEvidenceItem(
  evidence: MyeongliMbtiBridgeEvidence,
  productKey: ProductBridgeProductKey,
): ProductBridgeEvidenceItem {
  return {
    evidenceId: evidence.id,
    purposes: resolveEvidencePurposes(evidence, productKey),
    evidence,
  };
}

function resolveEvidencePurposes(
  evidence: MyeongliMbtiBridgeEvidence,
  productKey: ProductBridgeProductKey,
): readonly ProductBridgeEvidencePurpose[] {
  const purposes = new Set<ProductBridgeEvidencePurpose>();

  for (const trait of evidence.mbtiEvidence.traits) {
    for (const purpose of TRAIT_AREA_PURPOSES[trait.area]) {
      purposes.add(purpose);
    }
  }

  if (evidence.mbtiEvidence.relationshipPair !== null) {
    purposes.add("relationship");
  }

  if (
    productKey === "daeun" ||
    productKey === "saeun" ||
    evidence.signalKinds.includes("fortuneCycle")
  ) {
    purposes.add("timing");
  }

  if (
    evidence.caution !== null ||
    evidence.signalKinds.includes("shinsal") ||
    evidence.signalKinds.includes("interaction")
  ) {
    purposes.add("caution");
  }

  return [...purposes];
}

function hasAnyPurpose(
  item: ProductBridgeEvidenceItem,
  purposes: readonly ProductBridgeEvidencePurpose[],
): boolean {
  return purposes.some((purpose) => item.purposes.includes(purpose));
}

function normalizeRelationCategory(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9]/gu, "");
}
