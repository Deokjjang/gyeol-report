/**
 * v5 원국·유입 감지 계약 (P2). calculateSaju 출력은 바꾸지 않고, analyzeChartDetections(saju)가 별도로 낸다.
 * 규칙표와 학파 기본값: docs/manseryeok-policy.md "v5 감지 규칙". 시간 미상이면 hour가 관여하는 감지는 0건이다.
 */
import type { EarthlyBranch, FiveElement, HeavenlyStem, Pillar, TenGod } from "../types";

export const DETECTIONS_VERSION = "chart-detections-v1" as const;

export type ChartPosition = "year" | "month" | "day" | "hour";
/** 유입 자리: 대운·세운·월운. */
export type TemporalPosition = "dayun" | "annual" | "monthly";
export type AnyPosition = ChartPosition | TemporalPosition;
export type PositionedPillar = { readonly position: AnyPosition; readonly pillar: Pillar };

/** 지식 DB relation 가족 + 배지(BADGE_KINDS)와 같은 이름. WONJIN은 지식 DB에서 shinsal:WONJIN. */
export type RelationKind = "STEM_HAP" | "YUKHAP" | "SAMHAP" | "BANGHAP" | "CHUNG" | "HYEONG" | "PA" | "HAE" | "WONJIN";

export type RelationMember = { readonly position: AnyPosition; readonly char: HeavenlyStem | EarthlyBranch };

export type RelationHit = {
  readonly kind: RelationKind;
  /** 지식 DB variants.key와 같은 표기. 예 "子午", "甲己", "申子辰", "寅巳申", "子卯", "辰辰". */
  readonly key: string;
  readonly members: readonly RelationMember[];
  /** SAMHAP: full(3자)·half(왕지 포함 2자). HYEONG 삼형: full(3자)·partial(2자). 그 외 full. */
  readonly completeness: "full" | "half" | "partial";
  /** HYEONG 세부: 삼형·상형·자형. */
  readonly subtype?: "삼형" | "상형" | "자형";
  /** 합의 결과 오행(STEM_HAP 化氣, SAMHAP·BANGHAP 국) 또는 YUKHAP 합화 오행. 충·형·파·해·원진은 없음. */
  readonly element?: FiveElement;
  /** 구성원 중 인접 자리(년-월, 월-일, 일-시)끼리의 관계인가. 유입 관계는 false. */
  readonly adjacent: boolean;
};

export const TWELVE_STAGES = ["長生", "沐浴", "冠帶", "建祿", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"] as const;
export type TwelveStage = (typeof TWELVE_STAGES)[number];
export type TwelveStageHit = { readonly position: AnyPosition; readonly branch: EarthlyBranch; readonly stage: TwelveStage };

export type Season = "spring" | "summer" | "autumn" | "winter";
export type ClimateNeed = {
  /** 필요한 천간(조후 용신 후보). 예 "丙". */
  readonly stem: HeavenlyStem;
  readonly role: "primary" | "secondary" | "support";
  /** 천간으로 드러난 자리 + 지지 본기/중기로 있는 자리. 시간 미상이면 hour 제외. */
  readonly foundAt: readonly ChartPosition[];
};
export type ClimateDetection = {
  readonly season: Season;
  readonly monthBranch: EarthlyBranch;
  readonly dayMaster: HeavenlyStem;
  /** 지식 DB id 꼬리: climate:<dayMaster>:<season>. */
  readonly featureKey: `${HeavenlyStem}:${Season}`;
  readonly needs: readonly ClimateNeed[];
  /** strong=필요 기운이 갖춰짐, medium=일부, weak=없음(조후가 비어 있음). */
  readonly level: "strong" | "medium" | "weak";
  /** 조후상 아쉬운 오행(needs 중 foundAt이 빈 primary·secondary의 오행). */
  readonly lackingElements: readonly FiveElement[];
};

export type GongmangDetection = {
  readonly basis: "day" | "year";
  /** 순(旬) 첫 간지. 예 "甲子". */
  readonly xun: string;
  readonly branches: readonly [EarthlyBranch, EarthlyBranch];
  /** 원국에서 공망 지지가 놓인 자리(basis 자리 자신은 제외). */
  readonly positions: readonly ChartPosition[];
};

/** 기존 detectShinsal이 내지 않는 신살·귀인. 지식 DB shinsal:<code> / gwiin:<code>와 1:1. */
export type ExtraShinsalCode =
  | "GOEGANG" | "YANGIN" | "WONJIN" | "GWIMUN" | "CHEONMUN" | "EUMCHAK_YANGCHA" | "CHEONRA_JIMANG" | "GONGMANG"
  | "AMROK" | "BOKSEONG" | "CHEON_EUI" | "GEUMYEO" | "MUNGOK" | "JAEGO";
export type ExtraShinsalHit = {
  readonly code: ExtraShinsalCode;
  readonly family: "shinsal" | "gwiin";
  readonly positions: readonly ChartPosition[];
  /** 규칙 한 줄(내부용). 예 "일간 甲 → 亥(암록)". */
  readonly basis: string;
};

/** 타입에만 있던 구조 코드 3개(SajuStructurePatternCode). 지식 DB structure:<code>. */
export type StructureFlowCode = "RESOURCE_SUPPORTS_DAYMASTER" | "OUTPUT_GENERATES_WEALTH" | "WEALTH_GENERATES_OFFICER";
export type StructureFlowHit = { readonly code: StructureFlowCode; readonly scores: Readonly<Record<string, number>> };

export type ChartDetections = {
  readonly version: typeof DETECTIONS_VERSION;
  /** 시주가 감지에 들어갔는가. 시간 미상이면 false이고 어떤 항목에도 hour가 없다. */
  readonly hourIncluded: boolean;
  readonly relations: readonly RelationHit[];
  /** 일간 기준 각 지지의 십이운성. */
  readonly twelveStages: readonly TwelveStageHit[];
  readonly climate: ClimateDetection;
  /** 기본은 일주 기준 1개. 옵션 gongmangBasis="day+year"면 년주 기준도 추가. */
  readonly gongmang: readonly GongmangDetection[];
  readonly extraShinsal: readonly ExtraShinsalHit[];
  readonly structureFlows: readonly StructureFlowHit[];
};

export type DetectionOptions = {
  /** 공망 기준. 기본 "day". */
  readonly gongmangBasis?: "day" | "day+year";
};

/** 대운·세운·월운 한 기둥과 원국의 관계. */
export type IncomingDetection = {
  readonly position: TemporalPosition;
  readonly pillar: Pillar;
  /** 일간 대비 유입 천간·지지(본기) 십성. */
  readonly stemTenGod: TenGod;
  readonly branchTenGod: TenGod;
  /** 유입 기둥이 구성원으로 들어간 관계만(원국끼리 관계 제외). */
  readonly relations: readonly RelationHit[];
  /** 일간 기준 유입 지지의 십이운성. */
  readonly twelveStage: TwelveStage;
  /** 유입 지지가 원국(일주 기준) 공망 지지인가. */
  readonly gongmang: boolean;
};
