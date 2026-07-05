import { describe, expect, it } from "vitest";

import {
  validateLoveMarriageChildReportDraft,
} from "../../../src/lib/report-generation/loveMarriageChildReportDraftValidator";
import type {
  LoveMarriageChildReportDraft,
} from "../../../src/lib/report-generation/loveMarriageChildReportDraftTypes";

function textSection(overrides: Partial<LoveMarriageChildReportDraft["loveStyle"]> = {}) {
  return {
    headline: "기준이 선명한 관계에서 안정되는 타입",
    body:
      "당신은 애매한 호감보다 약속, 생활 기준, 감정 처리 방식이 정리된 관계에서 안정됩니다.",
    keyPoints: ["기준", "책임", "표현"],
    caution: "말이 빨라질 때 상대가 압박으로 받아들일 수 있습니다.",
    ...overrides,
  };
}

function patternSection(
  overrides: Partial<LoveMarriageChildReportDraft["attractionPattern"]> = {},
) {
  return {
    ...textSection(),
    repeatedPattern: ["상대의 태도와 책임감을 빠르게 봅니다."],
    betterUse: ["초반부터 관계 기준을 부드럽게 확인합니다."],
    ...overrides,
  };
}

function createValidDraft(): LoveMarriageChildReportDraft {
  return {
    version: "v1",
    productType: "love_marriage_child",
    productVersion: "v1",
    personLabel: "덕민",
    headline: "기준과 책임이 선명할수록 안정되는 관계 구조",
    openingSummary:
      "연애, 결혼, 부모 역할을 예언이 아니라 반복 패턴과 관계 운영 기준으로 해석한 리포트입니다.",
    loveStyle: textSection(),
    attractionPattern: patternSection(),
    loveStrengths: textSection({
      headline: "관계의 방향을 빠르게 정리하는 힘",
      body: "좋아하는 마음을 막연히 두기보다 약속과 행동 기준으로 옮길 때 강점이 살아납니다.",
    }),
    loveFriction: patternSection({
      headline: "말이 날카로워지는 순간",
      body: "정확한 피드백이 관계에서는 공격처럼 들릴 수 있어 속도 조절이 필요합니다.",
    }),
    marriageRhythm: textSection({
      headline: "역할과 생활 기준이 맞을 때 편해지는 결혼 리듬",
      body: "가사, 돈, 시간 사용 기준을 미리 맞추면 관계 피로가 줄어듭니다.",
    }),
    householdMoneyAndRoleSplit: textSection({
      headline: "돈과 역할은 말보다 기준으로 정리",
      body: "공동비, 개인비, 책임 범위를 문서나 숫자로 맞추는 방식이 안정적입니다.",
    }),
    conflictRecovery: textSection({
      headline: "감정이 커지기 전 기준을 다시 맞추기",
      body: "상대 성격을 단정하기보다 상황, 말투, 생활 기준을 분리해서 회복합니다.",
    }),
    parentMode: {
      ...textSection({
        headline: "부모가 되었을 때 기준과 루틴을 세우는 방식",
        body: "당신은 감정만으로 돌보기보다 생활 기준, 공부 습관, 약속을 잡아주는 역할에 강합니다.",
      }),
      parentingRolePattern: ["생활 기준을 세우고 반복 루틴을 잡아줍니다."],
      avoidProjection: ["내 기준을 아이의 감정까지 밀어붙이지 않습니다."],
    },
    breakupReunionPattern: {
      ...textSection({
        headline: "관계 정리와 회복은 내 반복 패턴부터 봅니다",
        body: "감정이 커질수록 결론부터 내리기보다 내가 반복하는 말투와 회피 방식을 먼저 확인합니다.",
      }),
      myLoop: ["상대의 태도 변화를 빠르게 평가합니다."],
      emotionalProcessing: ["감정을 결론으로 바꾸기 전에 말로 정리합니다."],
      repairBoundary: ["회복 가능한 기준과 멈춰야 할 기준을 구분합니다."],
    },
    relationshipTimingHints: [
      {
        label: "관계 점검",
        headline: "감정이 커지기 전 기준을 맞춥니다",
        body: "갈등 신호는 결론이 아니라 말투와 속도를 조율하라는 기준입니다.",
        push: ["생활 기준 정리", "대화 기록"],
        avoid: ["상대 단정", "결론 서두르기"],
      },
    ],
    actionPlan: [
      {
        label: "연애",
        headline: "관계 기준을 말로 꺼내기",
        body: "호감만 확인하지 말고 서로의 속도와 기준을 확인합니다.",
        firstAction: "이번 주 대화에서 원하는 관계 속도를 한 문장으로 말합니다.",
      },
      {
        label: "결혼",
        headline: "생활 기준을 숫자로 맞추기",
        body: "돈, 시간, 역할 분담 기준을 미리 확인합니다.",
        firstAction: "공동비와 개인비 기준을 적어봅니다.",
      },
      {
        label: "갈등 회복",
        headline: "말투보다 상황을 분리하기",
        body: "상대 성격을 단정하지 않고 문제가 된 장면을 분리합니다.",
        firstAction: "갈등 장면을 사실, 감정, 요청으로 나눕니다.",
      },
      {
        label: "부모 역할",
        headline: "루틴을 세우되 감정을 밀어붙이지 않기",
        body: "기준과 돌봄을 함께 둡니다.",
        firstAction: "생활 루틴과 감정 대화 시간을 따로 둡니다.",
      },
      {
        label: "관계 정리",
        headline: "내 반복 패턴부터 확인하기",
        body: "관계 결론보다 내가 반복하는 반응을 봅니다.",
        firstAction: "최근 반복된 말투를 세 가지 적습니다.",
      },
      {
        label: "생활 리듬",
        headline: "혼자 정리하는 시간을 확보하기",
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
    ],
    safetyNotes: [
      "이 리포트는 관계 성향과 반복 패턴을 해석한 참고용입니다.",
      "결과를 단정하지 않고 선택과 대화 기준을 정리합니다.",
    ],
  };
}

describe("loveMarriageChildReportDraftValidator", () => {
  it("accepts a valid love marriage child draft", () => {
    const validation = validateLoveMarriageChildReportDraft(createValidDraft());

    expect(validation.ok).toBe(true);
    expect(validation.value?.productType).toBe("love_marriage_child");
  });

  it("catches missing required sections", () => {
    const draft = {
      ...createValidDraft(),
      loveStyle: undefined,
      relationshipTimingHints: [],
    };
    const validation = validateLoveMarriageChildReportDraft(draft);

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_loveStyle_MISSING",
    );
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_relationshipTimingHints_TOO_SHORT",
    );
  });

  it("catches forbidden deterministic relationship and family expressions", () => {
    const validation = validateLoveMarriageChildReportDraft({
      ...createValidDraft(),
      openingSummary:
        "이 사람은 반드시 결혼하고 상대가 돌아온다. 재회 확률도 높다.",
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_FORBIDDEN_EXPRESSION",
    );
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_BREAKUP_REUNION_CLAIM",
    );
  });

  it("catches child fate naming and breakup prediction naming", () => {
    const validation = validateLoveMarriageChildReportDraft({
      ...createValidDraft(),
      parentMode: {
        ...createValidDraft().parentMode,
        body: "childFortune과 childAnalysis를 봅니다.",
      },
      breakupReunionPattern: {
        ...createValidDraft().breakupReunionPattern,
        body: "willBreakup과 reunionProbability를 봅니다.",
      },
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_CHILD_CLAIM",
    );
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_BREAKUP_REUNION_CLAIM",
    );
  });

  it("requires all six action plan labels", () => {
    const validation = validateLoveMarriageChildReportDraft({
      ...createValidDraft(),
      actionPlan: createValidDraft().actionPlan.slice(0, 5),
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_actionPlan_INVALID_LENGTH",
    );
    expect(validation.errors).toContain(
      "LOVE_MARRIAGE_CHILD_REPORT_ACTION_PLAN_LABELS_INVALID",
    );
  });
});
