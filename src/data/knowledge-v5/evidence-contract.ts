/**
 * 챕터별 근거 계약 — v5 확정 타입 (초안: docs/design/evidence-contract-draft.md, 결정 기록: docs/design/evidence-contract.md).
 * 데이터 파일(knowledge-v5/*.json)과 1:1로 맞물린다. 아직 어떤 런타임 코드도 이 파일을 import하지 않는다.
 *
 * 확정된 규칙
 *  - 시간 미상(birthTime === "unknown")이면 `pillar: "hour"` 근거는 계약에 아예 들어오지 않는다.
 *  - MBTI 없음(mbti === null)이면 `family: "mbtiTrait"` 근거와 crossFindings[]는 비어 있다.
 *  - behaviorSignals가 비어 있는 근거는 PRIMARY가 될 수 없다(결정 D1).
 *  - 문장 ↔ 근거 연결은 Writer가 붙이고 Validator가 재검증한다(결정 D2). 결정론 Writer는 신호 문장 자체가 근거 id를 가진다.
 *  - 반복 금지 메모리는 책 안에서만 유지한다. 책 사이의 다양성은 데이터(항목별 고유 문장 + 사람별 선택)로 보장한다(결정 D3).
 *  - 폴백은 챕터 단위다. 책 전체 거절은 HOOK/PAYOFF 장을 만들 수 없을 때만 일어난다(결정 D4).
 */
import type { Domain, MbtiType } from "./schema";

export type ProductKey = "saju_mbti_full" | "career_money_study" | "love_marriage_child" | "saju_mbti_compatibility" | "major_fortune" | "annual_fortune";
export type ChapterRole = "HOOK" | "WHY" | "SCENE" | "TWIST" | "PAYOFF";
export type EvidenceFamily =
  | "dayMaster" | "dayPillar" | "tenGod" | "tenGodFamily" | "shinsal" | "gwiin" | "twelveStage" | "relation" | "element" | "structure" | "stem" | "branch" | "other"
  | "period"     // 대운·세운·월운 (temporal)
  | "mbtiTrait"  // mbti-profiles.json
  | "context";   // 입력 상황(jobStatus, detailJob, relationshipStatus, focusAreas)
export type EvidenceCertainty = "calculated" | "derived" | "conditional" | "db-only";
export type Pillar = "year" | "month" | "day" | "hour";
export type Requirement = "exactTime" | "approximateTime" | "mbtiKnown" | "genderKnown" | "contextKnown" | "pair";

/** 한 챕터가 답할 질문. product-narratives.json의 ChapterPlan에서 온다. */
export type ChapterQuestion = {
  readonly chapterId: string;
  readonly product: ProductKey;
  readonly title: string;
  readonly question: string;
  readonly role: ChapterRole;
  readonly domains: readonly Domain[];
  readonly dimensionFocus: readonly string[];      // behavior-ontology 차원 id
  readonly paragraphBudget: { readonly min: number; readonly max: number };
  readonly period?: { readonly kind: "dayun" | "annual" | "month"; readonly key: string; readonly index: number; readonly total: number }; // 대운·세운 반복 장
};

/** 행동 신호 한 문장. myeongri-features/mbti-profiles의 Signal과 같은 모양 + 안정 id. */
export type SignalRef = { readonly id: string; readonly text: string; readonly domains: readonly Domain[]; readonly sourceRefs: readonly string[] };

/** Writer가 문장으로 바꿀 수 있는 최소 단위. */
export type EvidenceItem = {
  readonly id: string;                                  // `${family}:${featureId}` | `mbti:${type}:${traitId}` | `period:${kind}:${key}` | `context:${field}`
  readonly family: EvidenceFamily;
  readonly featureId: string;                           // myeongri-features.json id(별칭은 정본으로 바꿔 전달) / MBTI 유형 / period key
  readonly label: string;                               // easyName
  readonly traditionalName?: string;                    // definition 필드에서만 쓰는 전통 명칭
  readonly definition?: string;                         // 용어 + 쉬운 뜻 (이 챕터가 용어 정의 소유자일 때만 전달)
  readonly pillar?: Pillar;                             // 위치가 있는 feature만. 시간 미상이면 hour 항목은 전달되지 않는다
  readonly subject?: "person" | "personA" | "personB";
  readonly certainty: EvidenceCertainty;
  readonly strength: "strong" | "supporting" | "weak";
  readonly behaviorSignals: readonly SignalRef[];       // 비어 있으면 role은 SUPPORT/RECALL만 가능
  readonly shadowSignals: readonly SignalRef[];         // 비어 있으면 이 근거로 팩폭 금지
  readonly positionNuance?: string;                     // 해당 위치의 뉘앙스 한 문장
  readonly strengthNote?: string;                       // strengthRule 중 해당 상태(strong/weak/duplicate/clash) 문장
  readonly dimensionTags: Readonly<Record<string, number>>;
  readonly sourceRefs: readonly string[];               // 고객 노출 금지, Validator 전용
  readonly usage: {
    readonly role: "PRIMARY" | "SUPPORT" | "RECALL";
    readonly reuseIntent: "FIRST_MEANING" | "DIFFERENT_APPLICATION" | "RESULT_ONLY" | "OPERATING_RULE_RECALL";
    readonly usedInChapters: readonly string[];
    readonly definesTerms: boolean;
  };
};

/** 두 근거가 만나는 지점. cross-findings.json(작성본) 또는 런타임 템플릿 생성. */
export type CrossFindingRef = {
  readonly id: string;
  readonly kind: "resonance" | "tension" | "conditional" | "fortune-composite" | "period-interaction" | "pair-interaction";
  readonly leftEvidenceIds: readonly string[];
  readonly rightEvidenceIds: readonly string[];
  readonly dimension: string;
  readonly insight: string;                             // 2문장(작성본) 또는 템플릿 실현문
  readonly scene: string;                               // 조건부 장면 1문장
  readonly authored: boolean;                           // cross-findings.json에서 왔는가(false = 템플릿)
  readonly presentation: "EXPLICIT" | "HIDDEN";         // MBTI 코드를 드러낼지(explicitMbtiMax 예산)
  readonly strength: number;                            // cross-score strength
  readonly sourceRefs: readonly string[];
};

export type FactBoundary = {
  readonly birthTime: "exact" | "approximate" | "unknown";
  readonly mbti: MbtiType | null;
  readonly gender: "MALE" | "FEMALE" | null;
  readonly requirements: readonly Requirement[];        // 이 챕터가 전제하는 입력 조건(product-narratives requires)
  readonly allowedFeatureIds: readonly string[];        // evidence[].featureId 전체 — 밖의 명리 용어 등장 = 위반
  readonly allowedTerms: readonly string[];             // definition이 전달된 용어만
  readonly forbiddenClaims: readonly ("marriage-timing" | "specific-event" | "money-amount" | "health-diagnosis" | "death" | "legal-outcome" | "investment-instruction")[];
  readonly forbiddenPhrases: readonly string[];         // 상품 forbidden + knowledge-lint FORBIDDEN 정규식 문자열
  readonly maxFactBombs: number;                        // TWIST 장만 > 0
  readonly explicitMbtiMax: number;
  readonly requireNewEvidence: boolean;                 // PAYOFF 마지막 장(recall)만 false
};

export type ChapterTone = {
  readonly register: "plain-direct";
  readonly readingLevel: "middle-school";
  readonly person: "second";
  readonly emotionalIntent: readonly string[];          // V4 EditorialEmotion 그대로 전달(RELATABLE | SURPRISING | FACT_BOMB | …)
  readonly bridgeIntent?: string;                       // 앞 장에서 넘어오는 연결 의도
  readonly punchRatio: { readonly min: number; readonly max: number };
  readonly hedgeLimit: number;
  readonly metaphorLimit: number;
  readonly adviceLimit: number;                         // PAYOFF 장만 > 0
  readonly titleLocked: boolean;
};

/** Writer 입력 = Validator 기준. 챕터 하나당 하나. */
export type ChapterEvidenceContract = {
  readonly version: "evidence-contract-v5-1";
  readonly question: ChapterQuestion;
  readonly evidence: readonly EvidenceItem[];
  readonly crossFindings: readonly CrossFindingRef[];
  readonly factBoundary: FactBoundary;
  readonly tone: ChapterTone;
  readonly reader: { readonly name: string; readonly names?: { readonly personA: string; readonly personB: string }; readonly context: { readonly jobStatus: string; readonly detailJob: string; readonly relationshipStatus: string; readonly focusAreas: readonly string[] } };
  readonly memory: {
    readonly coreLine: string;                          // 1장의 핵심 한 줄(RECALL 전용)
    readonly usedThemes: readonly string[];             // 앞 장이 중심으로 쓴 차원 id
    readonly usedSentenceKeys: readonly string[];       // 이 책 안에서 이미 쓴 문장 키(sentenceKey) — 책 안 반복 금지(D3)
    readonly usedSignalIds: readonly string[];          // 이미 쓴 신호 id
  };
};

export type SentenceKind = "claim" | "behavior" | "meaning" | "bridge" | "advice" | "punch";
export type ChapterDraft = {
  readonly chapterId: string;
  readonly title: string;
  readonly paragraphs: readonly { readonly text: string; readonly sentences: readonly { readonly text: string; readonly kind: SentenceKind; readonly evidenceIds: readonly string[]; readonly signalIds: readonly string[]; readonly crossFindingIds: readonly string[] }[] }[];
  readonly writer: "deterministic" | "llm";
};

export type HardCode = "EVIDENCE_NOT_IN_CONTRACT" | "SIGNAL_NOT_IN_CONTRACT" | "HOUR_PILLAR_WITH_UNKNOWN_TIME" | "MBTI_CODE_WITHOUT_MBTI" | "FORBIDDEN_CLAIM" | "FORBIDDEN_PHRASE" | "FACT_BOMB_WITHOUT_SHADOW_SIGNAL" | "PRIMARY_WITHOUT_BEHAVIOR_SIGNAL" | "NO_NEW_PRIMARY_EVIDENCE" | "TERM_NOT_DEFINED" | "SENTENCE_REUSED_IN_BOOK" | "PARAGRAPH_BUDGET";
export type SoftCode = "HEDGE_OVER_LIMIT" | "METAPHOR_REPEATED" | "ADVICE_OUTSIDE_PAYOFF" | "READING_LEVEL" | "SENTENCE_TOO_LONG" | "EXPLICIT_MBTI_OVER_BUDGET";
export type ChapterValidation = {
  readonly ok: boolean;
  readonly hard: readonly { readonly code: HardCode; readonly where: string; readonly text?: string }[];
  readonly soft: readonly { readonly code: SoftCode; readonly where: string; readonly text?: string }[];
  readonly coverage: { readonly primaryEvidenceUsed: number; readonly primaryEvidenceTotal: number; readonly crossFindingsUsed: number; readonly newEvidenceCount: number };
};

/** 폴백 단위(D4): 챕터. hard 실패 → 같은 계약으로 결정론 Writer가 다시 쓴다. 그래도 실패하면 그 장은 SUPPORT 근거만으로 최소 문단을 만든다. */
export type ChapterFallback = { readonly chapterId: string; readonly reason: readonly HardCode[]; readonly stage: "rewrite" | "minimal" | "book-rejected" };
