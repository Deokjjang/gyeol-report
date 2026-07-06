import { calculateSaju } from "../saju/calculateSaju";
import type {
  Gender as SajuCalcGender,
  HiddenStemEntry,
  Pillar,
  SajuCalcResult,
  TenGod as SajuCalcTenGod,
} from "../saju/types";
import {
  buildLoveMarriageChildReportEvidence,
  type BuildLoveMarriageChildReportEvidenceInput,
  type LoveMarriageChildSajuEvidenceInput,
} from "../report-knowledge/loveMarriageChildReportEvidence";
import type {
  EarthlyBranch,
  HeavenlyStem,
  TenGod,
} from "../report-knowledge/annualFortuneTypes";
import type {
  LoveMarriageChildFullPillarEvidence,
  LoveMarriageChildFullPillarKey,
  LoveMarriageChildGender,
  LoveMarriageChildReportEvidencePacket,
} from "../report-knowledge/loveMarriageChildReportTypes";
import type { UserRelationshipStatus } from "../report-knowledge/userContextTypes";
import {
  validateLoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftValidator";
import type {
  LoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftTypes";
import {
  generateLoveMarriageChildReportDraft,
  type LoveMarriageChildReportWriterConfig,
  type LoveMarriageChildReportWriterResult,
} from "./openaiLoveMarriageChildReportWriter";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";
import type { FocusArea, JobStatus } from "./reportInputTypes";

export type LoveMarriageChildGenerationErrorCode =
  | "LOVE_MARRIAGE_CHILD_GENERATION_FAILED"
  | "LOVE_MARRIAGE_CHILD_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type LoveMarriageChildGenerationResult =
  | {
      readonly ok: true;
      readonly kind: "loveMarriageChild";
      readonly draft: LoveMarriageChildReportDraft;
      readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "loveMarriageChild";
      readonly error: {
        readonly code: LoveMarriageChildGenerationErrorCode;
        readonly message: string;
      };
    };

export type LoveMarriageChildGenerationHandlerOptions = {
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: LoveMarriageChildReportWriterConfig;
  };
};

const tenGodKoByHanja = {
  比肩: "비견",
  劫財: "겁재",
  食神: "식신",
  傷官: "상관",
  偏財: "편재",
  正財: "정재",
  偏官: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
} as const satisfies Record<SajuCalcTenGod, TenGod>;

const jobStatusLabels = {
  "": "미입력",
  student: "학생",
  job_seeker: "취준생",
  employee: "직장인",
  freelancer: "프리랜서",
  self_employed: "자영업",
  business_owner: "사업가",
  homemaker: "주부",
  unemployed: "무직",
  other: "기타",
} as const satisfies Record<JobStatus, string>;

export async function generateLoveMarriageChildProductDraft(
  input: SinglePersonGenerationInput,
  options: LoveMarriageChildGenerationHandlerOptions = {},
): Promise<LoveMarriageChildGenerationResult> {
  if (input.kind !== "loveMarriageChild") {
    return loveMarriageChildFailure({
      code: "INVALID_REPORT_INPUT",
      message: "Love marriage child generation requires loveMarriageChild input.",
    });
  }

  let evidencePacket: LoveMarriageChildReportEvidencePacket;
  try {
    evidencePacket = buildLoveMarriageChildEvidenceFromGenerationInput(input);
  } catch (error) {
    return loveMarriageChildFailure({
      code: "LOVE_MARRIAGE_CHILD_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  let draftResult: LoveMarriageChildReportWriterResult;
  try {
    draftResult =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateLoveMarriageChildReportDraft({
            evidencePacket,
            config: options.writer.config,
          })
        : {
            draft: buildLoveMarriageChildFallbackDraft({
              evidencePacket,
              userContext: input.userContext,
            }),
            model: "local-love-marriage-child-fallback",
          };
  } catch (error) {
    return loveMarriageChildFailure({
      code: "LOVE_MARRIAGE_CHILD_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateLoveMarriageChildReportDraft(draftResult.draft);

  if (!validation.ok || validation.value === undefined) {
    return loveMarriageChildFailure({
      code: "LOVE_MARRIAGE_CHILD_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  return {
    ok: true,
    kind: "loveMarriageChild",
    draft: validation.value,
    evidencePacket,
  };
}

function buildLoveMarriageChildEvidenceFromGenerationInput(
  input: SinglePersonGenerationInput,
): LoveMarriageChildReportEvidencePacket {
  const saju = calculateLoveMarriageChildSaju(input.person);
  const evidenceInput: BuildLoveMarriageChildReportEvidenceInput = {
    name: input.person.name,
    gender: toLoveMarriageChildGender(input.person.gender),
    mbtiType: input.person.mbtiType === "" ? null : input.person.mbtiType,
    relationshipStatus: toLoveRelationshipStatus(
      input.userContext.relationshipStatus,
    ),
    saju: toLoveMarriageChildSajuEvidenceInput(saju),
  };

  return buildLoveMarriageChildReportEvidence(evidenceInput);
}

function calculateLoveMarriageChildSaju(
  person: SinglePersonGenerationInput["person"],
): SajuCalcResult {
  const birthTime = person.birthTime.trim();

  return calculateSaju({
    birthDate: person.birthDate,
    ...(person.birthTimeUnknown || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: person.birthTimeUnknown || birthTime.length === 0,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  });
}

function toLoveMarriageChildSajuEvidenceInput(
  result: SajuCalcResult,
): LoveMarriageChildSajuEvidenceInput {
  const fullPillars = toFullPillars(result);
  const tenGods = collectActiveTenGods(result);
  const sinsal = uniqueStrings(
    result.shinsal.map((detection) => detection.labelKo),
  );
  const gwiin = uniqueStrings(
    result.shinsal
      .filter((detection) => detection.category === "NOBLE_HELP")
      .map((detection) => detection.labelKo),
  );
  const interactions = uniqueStrings([
    ...result.relations.stemCombinations,
    ...result.relations.branchCombinations,
    ...result.relations.branchClashes,
  ]);

  return {
    dayMaster: result.dayMaster as HeavenlyStem,
    dayPillar: formatPillar(result.pillars.day),
    dayBranch: result.pillars.day.branch as EarthlyBranch,
    fullPillars,
    labels: uniqueStrings([
      ...tenGods,
      ...sinsal,
      ...gwiin,
      ...interactions,
    ]),
    tenGods,
    sinsal,
    gwiin,
    interactions,
  };
}

function toFullPillars(
  result: SajuCalcResult,
): readonly LoveMarriageChildFullPillarEvidence[] {
  const pillarEntries = [
    ["year", result.pillars.year],
    ["month", result.pillars.month],
    ["day", result.pillars.day],
    ...(result.pillars.hour === undefined
      ? []
      : [["hour", result.pillars.hour] as const]),
  ] as const;

  const interactions = uniqueStrings([
    ...result.relations.stemCombinations,
    ...result.relations.branchCombinations,
    ...result.relations.branchClashes,
  ]);

  return pillarEntries.map(([key, pillar]) => {
    const hiddenStemEntries = getHiddenStemEntries(result, pillar.branch);

    return {
      key,
      pillar: formatPillar(pillar),
      stem: pillar.stem as HeavenlyStem,
      branch: pillar.branch as EarthlyBranch,
      stemTenGod: getStemTenGod(result, key),
      branchTenGod: toKoreanTenGod(hiddenStemEntries[0]?.tenGod),
      hiddenStems: hiddenStemEntries.map((entry) => formatHiddenStem(entry)),
      sinsal: result.shinsal
        .filter((detection) => detection.positions.includes(key))
        .map((detection) => detection.labelKo),
      gwiin: result.shinsal
        .filter(
          (detection) =>
            detection.category === "NOBLE_HELP" &&
            detection.positions.includes(key),
        )
        .map((detection) => detection.labelKo),
      interactions: interactions.filter(
        (interaction) =>
          interaction.includes(pillar.stem) || interaction.includes(pillar.branch),
      ),
    };
  });
}

function getStemTenGod(
  result: SajuCalcResult,
  key: LoveMarriageChildFullPillarKey,
): TenGod | null {
  if (key === "day") {
    return "비견";
  }

  return key === "hour" || key === "month" || key === "year"
    ? toKoreanTenGod(result.tenGods.stems[key])
    : null;
}

function getHiddenStemEntries(
  result: SajuCalcResult,
  branch: EarthlyBranch,
): readonly HiddenStemEntry[] {
  return result.tenGods.hiddenStems
    .filter((entry) => entry.branch === branch)
    .sort((a, b) => b.weight - a.weight);
}

function formatHiddenStem(entry: HiddenStemEntry): string {
  const tenGod = toKoreanTenGod(entry.tenGod);

  return tenGod === null ? entry.stem : `${entry.stem} ${tenGod}`;
}

function collectActiveTenGods(result: SajuCalcResult): readonly TenGod[] {
  return uniqueStrings(
    Object.entries(result.tenGods.distribution)
      .filter(([, count]) => count > 0)
      .map(([tenGod]) => toKoreanTenGod(tenGod as SajuCalcTenGod))
      .filter((tenGod): tenGod is TenGod => tenGod !== null),
  ) as readonly TenGod[];
}

function toKoreanTenGod(tenGod: SajuCalcTenGod | undefined): TenGod | null {
  return tenGod === undefined ? null : tenGodKoByHanja[tenGod];
}

function toLoveMarriageChildGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): LoveMarriageChildGender {
  if (gender === "MALE") return "male";
  if (gender === "FEMALE") return "female";
  return "unknown";
}

function toSajuGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): SajuCalcGender {
  if (gender === "MALE" || gender === "FEMALE") {
    return gender;
  }

  return "OTHER_OR_UNSPECIFIED";
}

function toLoveRelationshipStatus(
  status: SinglePersonGenerationInput["userContext"]["relationshipStatus"],
): UserRelationshipStatus {
  if (status === "single" || status === "dating" || status === "married") {
    return status;
  }

  if (status === "some" || status === "marriage_preparing") {
    return "dating";
  }

  return "unknown";
}

function buildLoveMarriageChildFallbackDraft(input: {
  readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
  readonly userContext: SinglePersonGenerationInput["userContext"];
}): LoveMarriageChildReportDraft {
  const personLabel = input.evidencePacket.personContext.name;
  const contextLine = formatUserContextLine(input.userContext);
  const focusLine = formatFocusAreas(input.userContext.focusAreas);
  const tenGodLine = formatTenGodLine(input.evidencePacket);
  const mbtiType = input.evidencePacket.personContext.mbtiType ?? "MBTI 미입력";

  return {
    version: "v1",
    productType: "love_marriage_child",
    productVersion: "v1",
    personLabel,
    headline: "관계의 온도보다 운영 기준이 먼저 안정되는 구조",
    openingSummary:
      `${personLabel}님은 마음이 커질수록 관계를 현실의 약속, 생활 리듬, 책임 기준으로 확인하려는 쪽입니다. ${contextLine}은 계산 원인이 아니라 해석을 실제 장면으로 옮기는 참고 정보로만 사용했습니다.\n\n${tenGodLine}가 함께 보이기 때문에, 연애에서는 말의 온도와 속도 조절이 중요하고 결혼·가족 역할에서는 돈과 역할 기준을 흐리지 않는 것이 안정의 핵심입니다.`,
    loveStyle: {
      headline: "호감보다 반복 행동을 더 믿는 연애 방식",
      body:
        `${personLabel}님은 감정 표현이 있어도 상대의 반복 행동, 약속을 지키는 방식, 관계 속도가 맞는지를 함께 봅니다. ${focusLine} 관계에서도 애정 확인만큼 일정, 돈, 일의 리듬이 실제 피로를 좌우합니다.\n\n${mbtiType} 성향은 이 흐름을 빠른 판단과 정리 욕구로 드러내기 쉽습니다. 좋게 쓰면 관계를 방치하지 않는 힘이고, 과하면 상대가 아직 마음을 설명하기 전에 결론부터 요구받는 느낌을 받을 수 있습니다.`,
      keyPoints: ["반복 행동", "관계 속도", "생활 리듬"],
      caution: "기준을 빨리 세우되 상대를 평가하는 말투로 굳히지는 않아야 합니다.",
    },
    attractionPattern: {
      headline: "자기 생활이 정돈된 사람에게 끌립니다",
      body:
        "강한 호감도 오래가려면 상대가 자기 시간, 돈, 관계의 경계를 어떻게 운영하는지가 보여야 합니다. 말이 다정해도 책임이 흐릿하면 금방 피로해지고, 표현이 서툴어도 생활 기준이 선명하면 안정감을 느낄 수 있습니다.\n\n명리 신호는 관계를 단정하는 답이 아니라 끌림이 어디에서 생기고 어디서 비용으로 바뀌는지 보는 근거입니다. 호감이 커질수록 상대의 능력이나 태도를 검증하려는 힘이 강해지니, 초반에는 질문보다 관찰의 비중을 높이는 편이 낫습니다.",
      keyPoints: ["자기관리", "책임감", "현실 감각"],
      caution: "검증이 앞서면 관계가 면접처럼 느껴질 수 있습니다.",
      repeatedPattern: [
        "호감이 있어도 책임 기준을 빠르게 확인합니다.",
        "상대의 말보다 반복 행동을 더 신뢰합니다.",
        "불확실성이 길어지면 결론을 앞당기고 싶어집니다.",
      ],
      betterUse: [
        "초반에는 기준을 선언하기보다 장면을 관찰합니다.",
        "상대의 속도를 늦다고 단정하기 전에 관계 언어를 확인합니다.",
      ],
    },
    loveStrengths: {
      headline: "관계를 현실로 옮기는 힘이 있습니다",
      body:
        "감정이 좋은 순간에만 머무르지 않고 약속, 일정, 생활 기준으로 관계를 정리할 수 있습니다. 그래서 애정이 실제 행동으로 이어질 때 강합니다.\n\n이 장점은 장기 관계에서 특히 빛납니다. 서로의 시간, 돈, 역할을 말로 합의하면 감정 소모가 줄고 관계가 관리 가능한 리듬을 갖게 됩니다.",
      keyPoints: ["실행력", "책임감", "생활 운영"],
      caution: "책임을 혼자 떠안으면 애정이 관리 업무처럼 바뀔 수 있습니다.",
    },
    loveFriction: {
      headline: "정확한 말이 가까운 관계에서는 날카롭게 들릴 수 있습니다",
      body:
        `문제가 보이면 바로 짚고 싶지만, 가까운 관계에서는 정확함보다 순서가 먼저일 때가 많습니다. 상대는 해결책보다 자신이 이해받았는지를 먼저 확인할 수 있습니다.\n\n갈등 때는 감정, 사실, 요청을 분리해야 합니다. 감정을 한 번 받아 준 뒤 장면을 짚고, 마지막에 바꿀 행동을 요청하면 ${personLabel}님의 정확함은 공격이 아니라 회복 도구가 됩니다.`,
      keyPoints: ["직설", "감정 확인", "요청 분리"],
      caution: "상대가 감정을 정리하기 전에 결론을 내리면 피로가 커집니다.",
      repeatedPattern: [
        "문제의 원인을 빠르게 찾습니다.",
        "상대의 느린 반응을 회피로 오해하기 쉽습니다.",
      ],
      betterUse: [
        "해결책 전에 감정을 한 문장으로 확인합니다.",
        "판단과 요청을 분리해 말합니다.",
      ],
    },
    marriageRhythm: {
      headline: "생활 기준이 맞을 때 장기 관계가 안정됩니다",
      body:
        `결혼 리듬은 감정의 크기보다 반복되는 생활 운영에서 갈립니다. 공동비, 개인 시간, 가족 행사, 집안일 기준을 흐릿하게 두면 애정과 별개로 피로가 쌓일 수 있습니다.\n\n${contextLine}에서는 관계도 일상 운영의 일부가 됩니다. 서로의 일과 돈의 리듬을 존중하면서 역할을 숫자와 일정으로 합의할 때 오래 갑니다.`,
      keyPoints: ["공동 생활", "역할 분담", "장기 책임"],
      caution: "기준이 한쪽의 통제로 느껴지지 않게 합의 과정을 남겨야 합니다.",
    },
    householdMoneyAndRoleSplit: {
      headline: "돈과 역할은 감정이 아니라 운영 기준으로 분리해야 합니다",
      body:
        `돈 문제를 사랑의 크기로 해석하면 갈등이 커집니다. 공동비, 개인비, 저축, 가족 지원 기준은 불편해도 먼저 말로 맞추는 편이 관계를 보호합니다.\n\n${focusLine} 특히 관계 안에서 돈과 책임의 경계를 선명하게 둬야 합니다. 좋은 마음으로 시작한 부담이 한쪽의 역할 고정으로 바뀌지 않게, 정산일과 책임 범위를 정해 두는 것이 좋습니다.`,
      keyPoints: ["공동비", "개인 영역", "정산 기준"],
      caution: "돈 이야기를 애정 확인으로 끌고 가지 않는 것이 중요합니다.",
    },
    conflictRecovery: {
      headline: "회복은 빠른 결론보다 말하는 순서에서 시작됩니다",
      body:
        `갈등이 생기면 관계의 결론을 서두르기보다 무엇이 불편했는지, 어떤 기준이 어긋났는지, 다음에는 무엇을 바꿀지로 나눠야 합니다. 이 순서가 없으면 같은 말이 반복되고 감정만 쌓입니다.\n\n${personLabel}님에게 필요한 회복 방식은 단순합니다. 감정 확인, 장면 분리, 요청 정리의 순서를 지키면 관계를 무너뜨리지 않고도 문제를 다룰 수 있습니다.`,
      keyPoints: ["감정 확인", "장면 분리", "요청 정리"],
      caution: "상대 성격을 단정하는 문장은 회복 속도를 늦춥니다.",
    },
    parentMode: {
      headline: "부모 역할에서는 기준과 루틴을 세우는 힘이 강합니다",
      body:
        `부모 역할을 하게 될 때 ${personLabel}님은 감정만으로 돌보기보다 생활 루틴, 약속, 공부 습관, 책임 기준을 잡아주는 쪽에 강합니다. 안정적인 환경을 만들 수 있지만, 기준이 앞서면 상대의 감정 신호를 늦게 볼 수 있습니다.\n\n이 파트는 아이의 운명이나 성향을 말하지 않습니다. 내가 돌봄 역할을 맡을 때 어떤 방식이 강해지고 어떤 말투를 조심해야 하는지만 봅니다.`,
      keyPoints: ["생활 루틴", "책임 기준", "감정 확인"],
      caution: "잘하려는 마음이 통제처럼 들리지 않게 감정 확인 시간을 따로 둡니다.",
      parentingRolePattern: [
        "반복 루틴을 잡아 줍니다.",
        "약속과 책임을 분명히 가르칩니다.",
        "실제 행동으로 돌봄을 보여줍니다.",
      ],
      avoidProjection: [
        "내 속도를 상대의 속도로 착각하지 않습니다.",
        "결과보다 감정 신호를 먼저 확인합니다.",
      ],
    },
    breakupReunionPattern: {
      headline: "흔들리는 관계에서는 내 반복 반응부터 봐야 합니다",
      body:
        `관계가 흔들릴 때 중요한 것은 상대의 미래를 맞히는 일이 아니라 내가 반복하는 말투와 판단 속도를 보는 일입니다. 불확실성이 길어지면 ${personLabel}님은 결론을 앞당기거나 상대의 태도를 빠르게 평가할 수 있습니다.\n\n관계를 회복하든 정리하든, 먼저 내가 바꿀 수 있는 행동과 상대의 몫을 분리해야 합니다. 이 구분이 있어야 같은 장면을 다시 반복하지 않습니다.`,
      keyPoints: ["내 반복 반응", "감정 처리", "경계선"],
      caution: "상대의 미래를 단정하는 방식은 선택에도 회복에도 도움이 되지 않습니다.",
      myLoop: [
        "상대의 태도 변화를 빠르게 평가합니다.",
        "답답함이 커지면 결론을 앞당기려 합니다.",
      ],
      emotionalProcessing: [
        "감정을 사실과 분리해 적습니다.",
        "말하기 전 원하는 요청을 한 문장으로 정리합니다.",
      ],
      repairBoundary: [
        "반복 문제와 일시적 감정을 구분합니다.",
        "내가 바꿀 행동과 상대 몫을 나눕니다.",
      ],
    },
    relationshipTimingHints:
      input.evidencePacket.timingHints.length > 0
        ? input.evidencePacket.timingHints
        : [
            {
              label: "관계 점검",
              headline: "감정이 커지기 전 기준을 맞춥니다",
              body:
                "갈등 신호는 결론이 아니라 말투, 속도, 생활 기준을 조율하라는 기준입니다.",
              push: ["생활 기준 정리", "대화 기록"],
              avoid: ["상대 단정", "결론 서두르기"],
            },
          ],
    actionPlan: [
      {
        label: "연애",
        headline: "관계 속도를 말로 확인하기",
        body: "호감만 확인하지 말고 서로의 관계 속도와 기준을 확인합니다.",
        firstAction: "원하는 관계 속도를 한 문장으로 적습니다.",
      },
      {
        label: "결혼",
        headline: "생활 기준을 숫자로 맞추기",
        body: "돈, 시간, 역할 분담 기준을 미리 확인합니다.",
        firstAction: "공동비와 개인비 기준을 나눠 적습니다.",
      },
      {
        label: "갈등 회복",
        headline: "말투보다 상황을 분리하기",
        body: "상대 성격을 단정하지 않고 문제가 된 장면을 나눕니다.",
        firstAction: "갈등 장면을 사실, 감정, 요청으로 나눕니다.",
      },
      {
        label: "부모 역할",
        headline: "기준과 감정을 같이 보기",
        body: "루틴을 세우되 감정 신호를 놓치지 않습니다.",
        firstAction: "생활 기준과 감정 확인 시간을 따로 둡니다.",
      },
      {
        label: "관계 정리",
        headline: "내 반복 패턴부터 확인하기",
        body: "관계 결론보다 내가 반복하는 반응을 먼저 봅니다.",
        firstAction: "최근 반복된 말투를 세 가지 적습니다.",
      },
      {
        label: "생활 리듬",
        headline: "혼자 정리하는 시간 확보하기",
        body: "거리감이 아니라 회복 리듬으로 시간을 씁니다.",
        firstAction: "주 1회 혼자 정리하는 시간을 일정에 넣습니다.",
      },
    ],
    riskManagement: [
      {
        title: "기준이 압박으로 들리는 위험",
        body: "빠른 판단이 상대에게는 평가처럼 들릴 수 있습니다.",
        prevention: "요청과 판단을 분리해 말합니다.",
      },
      {
        title: "책임이 한쪽으로 몰리는 위험",
        body: "관계를 안정시키려는 마음이 관리 역할로 커질 수 있습니다.",
        prevention: "역할과 책임을 함께 정합니다.",
      },
    ],
    safetyNotes: [
      "이 리포트는 관계 성향과 반복 패턴을 해석한 참고용입니다.",
      "결과를 단정하지 않고 선택과 대화 기준을 정리합니다.",
      "부모 역할 파트는 실제 아이의 사주나 성향이 아니라 당신의 역할 방식을 다룹니다.",
    ],
  };
}

function formatUserContextLine(
  userContext: SinglePersonGenerationInput["userContext"],
): string {
  const jobLabel =
    userContext.detailJob.trim() || jobStatusLabels[userContext.jobStatus];

  return `${jobLabel} 중심의 현재 맥락`;
}

function formatFocusAreas(focusAreas: readonly FocusArea[]): string {
  return focusAreas.length === 0
    ? "입력된 관심 영역이 적더라도"
    : `관심 영역이 ${focusAreas.join(", ")} 쪽인 만큼`;
}

function formatTenGodLine(
  evidencePacket: LoveMarriageChildReportEvidencePacket,
): string {
  const labels = uniqueStrings([
    ...evidencePacket.sajuBasis.loveTenGodSignals.map((signal) => signal.tenGod),
    ...evidencePacket.sajuBasis.marriageTenGodSignals.map(
      (signal) => signal.tenGod,
    ),
  ]).slice(0, 4);

  return labels.length === 0
    ? "관계 기준과 생활 운영 신호"
    : `${labels.join(", ")} 신호`;
}

function loveMarriageChildFailure(input: {
  readonly code: LoveMarriageChildGenerationErrorCode;
  readonly message: string;
}): LoveMarriageChildGenerationResult {
  return {
    ok: false,
    kind: "loveMarriageChild",
    error: input,
  };
}

function formatPillar(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
