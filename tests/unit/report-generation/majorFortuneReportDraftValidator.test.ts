import { describe, expect, it } from "vitest";

import type { MajorFortuneReportDraft } from "../../../src/lib/report-generation/majorFortuneReportDraftTypes";
import {
  DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES,
  classifyMajorFortuneBigThemeDomain,
  sanitizeMajorFortuneVisibleText,
  summarizeMajorFortuneDraftQuality,
  validateMajorFortuneReportDraft,
} from "../../../src/lib/report-generation/majorFortuneReportDraftValidator";

export function createValidMajorFortuneDraft(
  overrides: Partial<MajorFortuneReportDraft> = {},
): MajorFortuneReportDraft {
  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: "덕민",
    headline: "덕민님의 戊辰 대운 리포트",
    openingTitle: "현재 대운 戊辰 흐름",
    openingSummary:
      "이 대운은 10년 동안 역할과 책임 기준을 다시 잡는 배경으로 체감될 수 있습니다.",
    coreLine:
      "戊辰 대운은 현실 구조와 책임 기준을 다시 까는 10년 흐름입니다.",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      relationshipStatusLabel: "미입력",
      translationNote:
        "개발·서비스 기획의 프로젝트, 문서화, 운영 책임 장면으로 번역했습니다.",
    },
    cycleSummary: {
      ganji: "戊辰",
      displayTitle: "현재 대운 戊辰",
      cycleIndexLabel: "3번째 대운",
      currentPositionLabel: "2026년 기준 1년차",
      ageRangeLabel: "대운표 기준 구간",
      yearRangeLabel: "2026년~2035년",
      stemLabel: "戊 · 양토",
      branchLabel: "辰 · 양토",
      elementLabel: "토의 대운",
      tenGodLabel: "편재의 대운",
      basisLabel: "입력된 대운표 기준",
    },
    calculationBasis: {
      basisType: "user_supplied_major_fortune_table",
      displayLabel: "입력된 대운표 기준",
      explanation:
        "이 대운 구간은 사용자가 검증해 입력한 대운표를 기준으로 잡았습니다.",
      ageBasisLabel: "표기 나이는 대운표 기준 나이입니다.",
      note: "현재 리포트에서는 2026년을 기준으로 현재 위치한 대운을 읽습니다.",
    },
    previousToCurrentShift: {
      previousGanji: "丁卯",
      currentGanji: "戊辰",
      plain:
        "丁卯 대운에서 戊辰 대운으로 넘어오며 표현과 관계의 배경이 현실 구조와 책임의 배경으로 바뀝니다.",
      whatChanged: [
        "표현과 관계 조율보다 현실 구조, 계약, 책임 기준이 더 중요해집니다.",
        "2026년은 戊辰 대운의 1년차라 초반 기준 설정이 이후 10년에 반복될 수 있습니다.",
      ],
    },
    decadeArchetype: {
      label: "현실 구조 재편형",
      metaphor: "흙더미를 다시 설계도로 바꾸는 10년",
      plain:
        "戊辰 대운은 해야 할 일, 관리할 일, 책임질 일을 흙처럼 쌓아 두기보다 구조로 다시 짜야 하는 배경입니다.",
    },
    flowIndexSummary: {
      flowIndex: 72,
      flowTypeLabel: "책임·구조 재편형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨이 아니라 10년 동안 반복될 체감 강도를 보여 줍니다.",
    },
    bigThemes: [
      {
        title: "기준을 직접 세우는 10년",
        metaphor: "일이 흙처럼 쌓이기 전에 길을 먼저 내는 흐름",
        body: "편재는 돈과 현실 자원을 다루는 힘이고, 토는 책임을 쌓이게 만드는 배경입니다.",
        likelyScenes: [
          "프로젝트 기준을 직접 문서화하는 장면",
          "맡을 일과 맡지 않을 일을 나누는 장면",
        ],
        strategy: "초반부터 역할 경계를 문서로 남기세요.",
      },
      {
        title: "현실 숫자를 정리하는 10년",
        metaphor: "돈과 계약의 흙더미를 월 단위로 나누는 흐름",
        body: "토 과다는 급여, 생활비, 계약처럼 관리할 항목이 늘어나는 구조로 체감될 수 있습니다.",
        likelyScenes: [
          "고정지출을 월초에 나누는 장면",
          "계약과 정산 기준을 다시 맞추는 장면",
        ],
        strategy: "반복 비용과 책임 비용을 먼저 분리하세요.",
      },
      {
        title: "관계의 거리와 역할을 재배치하는 10년",
        metaphor: "사람과 약속이 실제 역할로 묶이는 흐름",
        body: "육합과 충은 사람, 일정, 역할이 묶였다가 다시 조정되는 장면으로 나타날 수 있습니다.",
        likelyScenes: [
          "가족 일정과 업무 일정이 겹치는 장면",
          "상사, 동료, 친구와 역할 경계를 다시 맞추는 장면",
        ],
        strategy: "관계 안에서도 감정보다 역할과 시간을 먼저 확인하세요.",
      },
    ],
    myeongliLayers: {
      tenGodLayer: {
        majorStemTenGod: "편재",
        annualStemTenGodsInCycle: Array.from({ length: 10 }, (_, index) => {
          const year = 2026 + index;
          const stems = ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"];
          const tenGods = [
            "식신",
            "상관",
            "편재",
            "정재",
            "편관",
            "정관",
            "편인",
            "정인",
            "비견",
            "겁재",
          ];

          return {
            year,
            stem: stems[index] ?? "丙",
            tenGod: tenGods[index] ?? "식신",
            plain: `${year}년 천간은 甲(갑목) 일간에게 ${tenGods[index] ?? "식신"}으로 작용해 그해의 행동 방식과 압박 지점을 바꿉니다.`,
          };
        }),
        plain:
          "戊辰 대운의 천간 戊는 甲(갑목) 일간에게 편재입니다. 편재는 돈, 자원, 거래, 현실을 실제로 움직이는 힘입니다.",
      },
      elementLayer: {
        majorElements: ["토"],
        fillMissing: [],
        overloadHeavy: ["토"],
        plain:
          "戊辰 대운은 토의 책임과 현실 기준을 키우며, 이미 무거운 토 과다를 더 체감하게 만들 수 있습니다.",
      },
      branchInteractionLayer: {
        interactions: [
          {
            year: null,
            type: "해",
            plainType: "큰 충돌은 아니지만 피로와 누수가 쌓이는 장면",
            plain:
              "卯辰 해는 관계와 일정에서 겉으로 큰 충돌 없이 피로가 쌓이는 장면으로 나타날 수 있습니다.",
            impactArea: "relationship",
          },
        ],
        plain:
          "대운 지지는 원국의 지지와 맞물리며 관계, 일, 생활 리듬의 장기 배치를 바꿉니다.",
      },
      hiddenStemLayer: {
        majorBranchHiddenStems: ["戊(편재)", "乙(겁재)", "癸(정인)"],
        plain:
          "辰 지장간은 戊(편재)·乙(겁재)·癸(정인)입니다. 겉으로는 토이지만 안쪽에는 돈, 자기 기준, 회복 이슈가 같이 들어옵니다.",
      },
      twelveStageLayer: null,
      auxiliaryStarsLayer: [
        {
          label: "천을귀인",
          plain: "막혔을 때 도움을 주는 사람, 제도, 조언이 들어올 수 있는 보호 장치입니다.",
          caution: null,
        },
      ],
    },
    decadeCards: [
      {
        label: "일·성과",
        index: 78,
        headline: "프로젝트 기준을 잡는 역할이 반복됩니다.",
        body: "보고, 문서화, 일정 조율처럼 결과를 보이게 만드는 일이 중요해집니다.",
      },
      {
        label: "돈·현실",
        index: 70,
        headline: "고정지출과 장기 관리 기준이 중요해집니다.",
        body: "급여, 생활비, 계약, 정산처럼 현실 숫자를 직접 챙기는 장면이 늘 수 있습니다.",
      },
      {
        label: "인간관계",
        index: 64,
        headline: "연락과 역할 경계를 다시 맞춥니다.",
        body: "동료, 친구, 메시지, 거리감의 기준을 짧고 분명하게 정리해야 합니다.",
      },
      {
        label: "연애·가족",
        index: 62,
        headline: "가족과 가까운 관계의 역할이 재배치됩니다.",
        body: "부모, 집안 일정, 약속, 생활 동선에서 맡아야 할 몫을 조율하게 됩니다.",
      },
      {
        label: "학업·자격증",
        index: 68,
        headline: "업무 공부와 포트폴리오를 장기 자산으로 만듭니다.",
        body: "자격증, 실무 정리, 발표 자료처럼 남는 결과물을 쌓는 방식이 좋습니다.",
      },
      {
        label: "몸·생활 리듬",
        index: 59,
        headline: "회복 루틴을 구조화해야 합니다.",
        body: "수면, 식사, 피로, 컨디션을 일정처럼 관리해야 장기 압박을 버틸 수 있습니다.",
      },
    ],
    keySignals: [
      {
        type: "opportunity",
        title: "역할 재정리 기회",
        body: "결과물을 보이게 만들고 기준을 세우는 방식으로 커리어 기반을 만들 수 있습니다.",
        evidenceLabel: "비견 대운",
      },
      {
        type: "difficulty",
        title: "현실 책임 부담",
        body: "토 과다가 자극되어 돈, 계약, 관리 책임이 누적될 수 있습니다.",
        evidenceLabel: "토 과다 자극",
      },
      {
        type: "transition",
        title: "이전 대운과 다른 배경",
        body: "이전 금·수 배경에서 목·토 배경으로 바뀌며 선택 기준이 달라집니다.",
        evidenceLabel: "previous_to_current",
      },
    ],
    majorStructure: {
      ganjiExplanation:
        "戊辰은 토가 강하게 들어와 현실 구조와 책임 기준을 동시에 건드립니다.",
      tenGodExplanation:
        "비견: 자기 기준, 동등함, 경쟁과 공감이 장기 배경으로 반복됩니다.",
      elementEffectExplanation:
        "목은 방향을 세우고 토는 현실 책임을 무겁게 만들 수 있습니다.",
      branchInteractionExplanation:
        "卯戌 육합: 사람과 일정이 묶이며 실제 움직임이 생기기 쉽습니다.",
      transitionExplanation:
        "丁卯 대운에서 戊辰 대운으로 넘어오며 현실 구조와 책임 기준이 중요해졌습니다.",
    },
    cycleChapters: [
      {
        title: "일의 기준을 새로 세우는 구간",
        headline: "프로젝트와 보고 체계가 장기 과제로 반복됩니다.",
        body:
          "개발·서비스 기획에서는 요구사항 정리, 문서화, 일정 조율이 내 쪽으로 모이며 기준을 직접 세우는 장면이 반복될 가능성이 큽니다.",
        likelyScenes: [
          "프로젝트 기준을 문서로 남겨야 하는 장면",
          "상사와 실무자 사이에서 요구사항을 번역하는 장면",
        ],
        practicalAdvice: [
          "역할과 마감 기준을 말보다 문서로 남기세요.",
          "결정권자와 담당자를 초반에 분리해 두세요.",
        ],
      },
      {
        title: "돈과 현실 숫자를 단순화하는 구간",
        headline: "수입보다 고정비와 계약 기준이 중요해집니다.",
        body:
          "토가 무거운 대운에서는 급여, 생활비, 계약, 정산처럼 현실 숫자를 직접 관리해야 하는 일이 길게 반복될 수 있습니다.",
        likelyScenes: [
          "고정지출과 관리비를 월초에 나누는 장면",
          "계약과 정산 기준을 다시 맞추는 장면",
        ],
        practicalAdvice: [
          "돈과 일정은 월 단위로 먼저 나누어 보세요.",
          "새는 비용과 반복 책임을 따로 표시하세요.",
        ],
      },
      {
        title: "사람과 역할 경계를 맞추는 구간",
        headline: "관계는 감정보다 역할과 연락 방식으로 체감됩니다.",
        body:
          "가까운 관계에서는 좋은 말보다 만나는 주기, 연락 방식, 맡을 역할을 현실적으로 조율하는 일이 중요해질 수 있습니다.",
        likelyScenes: [
          "친구나 동료와 연락 빈도를 다시 맞추는 장면",
          "가족 일정과 업무 일정이 겹치는 장면",
        ],
        practicalAdvice: [
          "가능한 범위와 시간을 짧게 말하세요.",
          "애매한 부탁은 바로 답하기보다 조건을 확인하세요.",
        ],
      },
      {
        title: "가족과 생활 책임을 나누는 구간",
        headline: "집안 일정과 가까운 관계의 몫을 다시 봅니다.",
        body:
          "연애 상태가 미입력이라 특정 관계를 단정하지 않고, 가족과 가까운 사람 사이의 약속, 생활 동선, 현실 책임을 중심으로 봅니다.",
        likelyScenes: [
          "부모나 가족 일정의 역할을 조정하는 장면",
          "가까운 사람과 약속 시간을 현실적으로 맞추는 장면",
        ],
        practicalAdvice: [
          "감정 설명보다 시간과 역할을 먼저 확인하세요.",
          "대신 맡을 수 있는 일과 어려운 일을 구분하세요.",
        ],
      },
      {
        title: "공부와 포트폴리오를 남기는 구간",
        headline: "업무 공부를 결과물로 바꾸는 방식이 유리합니다.",
        body:
          "자격증, 실무 정리, 포트폴리오, 발표 자료처럼 남는 산출물을 쌓으면 대운의 현실 구조를 커리어 자산으로 바꾸기 쉽습니다.",
        likelyScenes: [
          "업무 공부를 체크리스트로 정리하는 장면",
          "포트폴리오나 발표 자료를 결과물로 남기는 장면",
        ],
        practicalAdvice: [
          "공부 시간보다 결과물 단위를 먼저 정하세요.",
          "실무에서 반복되는 내용을 템플릿으로 남기세요.",
        ],
      },
      {
        title: "몸과 생활 리듬을 구조화하는 구간",
        headline: "큰 사건보다 피로 누적과 회복 루틴이 먼저 신호를 줍니다.",
        body:
          "수면, 식사, 앉아 있는 시간, 회복 루틴이 흔들리면 현실 책임을 오래 버티기 어렵기 때문에 생활 리듬을 일정처럼 다뤄야 합니다.",
        likelyScenes: [
          "야근이나 일정 과밀로 수면이 밀리는 장면",
          "식사와 회복 시간이 계속 뒤로 밀리는 장면",
        ],
        practicalAdvice: [
          "수면과 식사 시간을 일정표에 먼저 고정하세요.",
          "무리한 주간에는 회복 시간을 비용처럼 따로 잡으세요.",
        ],
      },
    ],
    phaseTimeline: [
      {
        phase: "early",
        label: "초반 1~3년",
        headline: "새 기준을 세우는 구간",
        body: "이전 대운과 달라진 역할을 파악하는 시간이 됩니다.",
        advice: "큰 결론보다 반복되는 압박의 원인을 먼저 기록하세요.",
      },
      {
        phase: "middle",
        label: "중반 4~7년",
        headline: "책임이 구체화되는 구간",
        body: "프로젝트, 돈, 관계의 기준이 실제 선택으로 굳어집니다.",
        advice: "맡을 일과 맡지 않을 일을 구분하세요.",
      },
      {
        phase: "late",
        label: "후반 8~10년",
        headline: "다음 대운으로 넘어갈 준비",
        body: "쌓아 둔 구조가 다음 선택의 기반이 됩니다.",
        advice: "성과와 비용을 정리해 다음 방향을 준비하세요.",
      },
    ],
    strongYears: [
      {
        year: 2026,
        ganji: "丙午",
        headline: "대운이 바뀌며 현실 구조를 새로 까는 해",
        body: "戊辰 대운 1년차라 책임 범위와 돈의 기준을 새로 잡는 이유가 분명합니다.",
        advice: "계약, 정산, 역할 범위를 초반부터 문서로 남기세요.",
        whyStrong:
          "대운 戊辰이 시작되고 세운 丙午가 화의 속도와 노출을 올려 토 책임을 자극하기 때문입니다.",
        likelyArea: "일·성과",
        pushStrategy: "프로젝트 기준, 문서화, 운영 체계",
        reduceStrategy: "권한 없는 책임, 끝없는 일정 추가, 기록 없는 구두 지시",
      },
      {
        year: 2028,
        ganji: "戊申",
        headline: "대운 천간이 반복되어 돈과 역할이 강해지는 해",
        body: "戊가 반복되어 편재의 돈, 거래, 현실 자원 테마가 같은 방향으로 겹칩니다.",
        advice: "무리한 확장보다 고정비와 책임 비용을 줄이세요.",
        whyStrong:
          "대운 천간 戊와 세운 戊가 겹쳐 편재의 돈, 계약, 현실 자원 테마가 강해지기 때문입니다.",
        likelyArea: "돈·외부기회",
        pushStrategy: "외부 프로젝트, 계약, 정산 기준, 비용 구조 단순화",
        reduceStrategy: "감으로 하는 투자, 애매한 돈거래, 구두 약속",
      },
      {
        year: 2030,
        ganji: "庚戌",
        headline: "辰戌 충으로 구조가 크게 흔들릴 수 있는 해",
        body: "대운 辰과 戌이 부딪혀 일, 집, 계약, 관계의 기준을 다시 조정해야 하는 이유가 생깁니다.",
        advice: "중요한 약속과 비용 구조는 미리 점검하세요.",
        whyStrong:
          "대운 辰과 세운 戌이 충으로 부딪혀 이미 깔린 구조와 새 책임이 충돌하기 쉽기 때문입니다.",
        likelyArea: "관계",
        pushStrategy: "역할 조율, 연락 방식 정리, 가족·동료와의 일정 합의",
        reduceStrategy: "말하지 않은 기대, 무리한 대신 처리, 애매한 약속",
      },
    ],
    majorFortuneTimelineRows: Array.from({ length: 10 }, (_, index) => {
      const year = 2026 + index;
      const yearIndexInCycle = index + 1;
      const phase =
        yearIndexInCycle <= 3
          ? "early"
          : yearIndexInCycle <= 7
            ? "middle"
            : "late";
      const annualGanjis = ["丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯"];
      const annualTenGods = ["식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인", "비견", "겁재"];
      const strategies = [
        "책임 범위와 비용 기준을 첫해부터 작게 나누세요.",
        "반복 요청은 바로 처리하기보다 기록으로 먼저 남기세요.",
        "돈이 움직이는 접점은 조건과 숫자를 먼저 고정하세요.",
        "평가와 보고가 엮이는 일은 근거 자료를 같이 준비하세요.",
        "충돌이 커지기 전 계약, 역할, 일정의 경계선을 줄이세요.",
        "관계와 생활 리듬이 새는 지점을 주간 단위로 점검하세요.",
        "커리어 설명에 남길 결과물과 배운 내용을 묶어 두세요.",
        "불필요한 비용과 대신 맡은 일을 다음 구간 전에 덜어내세요.",
        "공부와 포트폴리오는 다음 선택의 근거가 되게 정리하세요.",
        "다음 대운으로 가져갈 관계, 돈, 역할 기준만 남기세요.",
      ];

      return {
        year,
        ageLabel: `${27 + index}세`,
        ageBasisLabel: "대운표 기준 나이",
        yearIndexInCycle,
        phase,
        isCurrentYear: year === 2026,
        isCycleStartYear: year === 2026,
        isCycleEndYear: year === 2035,
        badges: [
          ...(year === 2026 ? ["올해" as const, "전환" as const] : []),
          ...(year === 2028 ? ["강함" as const] : []),
          ...(year === 2030 ? ["주의" as const] : []),
          ...(year === 2035 ? ["정리" as const] : []),
        ],
        majorGanji: "戊辰",
        annualGanji: annualGanjis[index] ?? "丙午",
        annualTenGodLabel: annualTenGods[index] ?? "식신",
        keyInteractionLabel: year === 2030 ? "충: 굳어 있던 배치가 부딪혀 바뀌는 장면" : null,
        oneLine:
          year === 2026
            ? "2026년 丙午: 대운 戊辰이 시작되고, 세운 丙午가 속도와 노출을 올립니다. 일을 크게 벌리기보다 책임 범위부터 좁혀야 하는 해입니다."
            : `${year}년 ${annualGanjis[index] ?? "丙午"}: 세운 ${annualTenGods[index] ?? "식신"} 테마가 대운 戊辰 안에서 다른 장면으로 드러납니다. 해당 해에는 돈, 역할, 관계 중 먼저 움직이는 영역을 골라 전략을 조정합니다.`,
        strategy: strategies[index] ?? "책임 범위와 회복 시간을 같이 잡으세요.",
        yearDetail: {
          coreFlow: `${year}년 ${annualGanjis[index] ?? "丙午"} 연운은 ${annualTenGods[index] ?? "식신"} 흐름으로 대운 戊辰 안에서 역할과 생활 기준을 건드립니다. ${year}년에는 대운의 장기 배경 위에 연운의 단기 자극이 올라와 ${annualTenGods[index] ?? "식신"} 방식의 실행 압력을 만듭니다.`,
          realWorldScenes: `${year}년 직업·일에서는 맡은 역할과 성과 기준을 먼저 좁히고, 돈·자원에서는 지출, 계약, 정산 기준을 숫자로 확인해야 합니다. 관계·연애와 건강관리·생활 리듬에서는 약속 기준과 회복 시간을 같이 잡고, ENTJ 성향은 ${year}년 흐름을 빠른 결정과 실행 기준으로 드러내기 쉽지만 대운의 원인은 아닙니다.`,
          cautionPoint: `${year}년 주의할 점은 특정 사건 예언이 아니라 반복되는 피로와 과부하 관리입니다.`,
          actionStandard:
            strategies[index] ?? "그해 먼저 고정할 역할, 돈 기준, 회복 루틴을 하나씩 정합니다.",
        },
      };
    }),
    cycleYearTimeline: Array.from({ length: 10 }, (_, index) => {
      const year = 2026 + index;
      const yearIndexInCycle = index + 1;
      const phase =
        yearIndexInCycle <= 3
          ? "early"
          : yearIndexInCycle <= 7
            ? "middle"
            : "late";
      const roles = [
        "새 대운 진입, 현실 구조를 다시 까는 해",
        "초반 기준을 실제 생활에 시험하는 해",
        "책임 범위를 사람과 일에 적용하는 해",
        "반복 업무를 시스템으로 굳히는 해",
        "돈과 계약 구조를 크게 점검하는 해",
        "관계와 생활 리듬을 다시 배치하는 해",
        "장기 역할이 커리어 기준으로 굳는 해",
        "다음 구간을 위해 비용과 역할을 줄이는 해",
        "성과와 공부 결과물을 정리하는 해",
        "다음 대운 전 관계와 생활 기반을 정리하는 해",
      ];
      const focuses = [
        "책임 범위와 비용 구조를 먼저 정리하기",
        "초반에 생기는 반복 요청을 기록하기",
        "담당자와 결정권자를 분리해 두기",
        "반복 업무를 체크리스트로 고정하기",
        "계약, 정산, 고정비를 다시 점검하기",
        "관계와 일정의 경계를 짧게 확인하기",
        "커리어 기준과 포트폴리오를 연결하기",
        "불필요한 책임과 비용을 줄이기",
        "남는 결과물과 배운 내용을 정리하기",
        "다음 대운으로 가져갈 구조만 남기기",
      ];
      const reasons = [
        "첫해에 잡은 기준이 이후 10년 운영 방식으로 반복되기 쉽기 때문입니다.",
        "초반 요청을 기록하지 않으면 책임 범위가 흐려지기 쉽기 때문입니다.",
        "역할과 권한을 나누어야 장기 소모를 줄일 수 있기 때문입니다.",
        "중반부터는 임시 대응이 반복 시스템으로 굳기 쉽기 때문입니다.",
        "현실 숫자가 커지는 해에는 새는 비용이 장기 부담으로 남기 때문입니다.",
        "사람과 일정의 경계가 흔들리면 일과 생활이 같이 피로해지기 때문입니다.",
        "대운 중반의 선택이 이후 커리어 설명 방식으로 남기 때문입니다.",
        "후반에는 더할 일보다 덜어낼 일을 정해야 다음 구간이 가벼워지기 때문입니다.",
        "정리된 결과물이 다음 선택의 근거가 되기 때문입니다.",
        "마지막 해에는 관계, 비용, 역할을 정돈해야 다음 대운으로 넘어가기 쉽기 때문입니다.",
      ];

      return {
        year,
        ganji: ["丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯"][index] ?? "丙午",
        yearIndexInCycle,
        phase,
        headline: roles[index] ?? `${yearIndexInCycle}년차 현실 구조 조정`,
        roleOfYearInCycle: roles[index] ?? "현실 구조를 다시 점검하는 해",
        plainInterpretation: `${year}년은 戊辰 대운의 ${yearIndexInCycle}년차로 돈, 역할, 생활 기준을 조정하는 해입니다.`,
        strategicFocus: focuses[index] ?? "책임 범위와 비용 구조를 먼저 정리하기",
        whyItMatters: reasons[index] ?? "같은 현실 테마가 반복되며 장기 선택의 기준이 되기 때문입니다.",
      };
    }),
    currentCycleSummary:
      "戊辰 대운은 2026년부터 2035년까지 현실 구조, 돈, 역할 기준을 다시 까는 10년 흐름입니다.",
    tenYearTheme:
      "편재와 토의 흐름이 강해져 계약, 책임, 고정비, 역할 경계가 장기 과제로 올라옵니다.",
    timelineReading:
      "초반에는 기준을 세우고, 중반에는 책임이 구체화되며, 후반에는 다음 대운으로 가져갈 구조만 남기는 흐름입니다.",
    annualCrossReading:
      "2026년 丙午 세운은 戊辰 대운의 첫해에 속도와 노출을 더해 책임 범위를 초반부터 정리하게 만듭니다.",
    careerWorkFlow: {
      title: "직업·일 흐름",
      summary:
        "일에서는 프로젝트 기준, 문서화, 보고 체계처럼 책임 범위를 보이게 만드는 일이 반복됩니다.",
      supportingSignals: ["편재 대운", "戊辰 토 흐름", "2026년 丙午 세운"],
      frictionSignals: ["권한 없는 책임", "기록 없는 구두 지시"],
      actionHint: "역할과 마감 기준을 말보다 문서로 남기세요.",
    },
    moneyResourceFlow: {
      title: "돈·자원 흐름",
      summary:
        "돈은 한 번의 기회보다 고정비, 계약, 정산, 책임 비용을 관리하는 장면으로 나타납니다.",
      supportingSignals: ["편재", "정산 기준", "현실 자원"],
      frictionSignals: ["감으로 하는 투자", "애매한 돈거래"],
      actionHint: "수입 기대보다 고정비와 책임 비용을 먼저 분리하세요.",
    },
    relationshipFlow: {
      title: "관계·연애 흐름",
      summary:
        "관계에서는 감정보다 만나는 주기, 연락 방식, 맡을 역할을 현실적으로 맞추는 일이 중요합니다.",
      supportingSignals: ["생활 역할", "연락 기준", "관계 경계"],
      frictionSignals: ["말하지 않은 기대", "무리한 대신 처리"],
      actionHint: "가까운 관계에서도 시간과 역할을 짧게 확인하세요.",
    },
    healthRoutineFlow: {
      title: "건강관리·생활 리듬",
      summary:
        "생활 리듬은 큰 사건보다 수면, 식사, 회복 시간이 밀리는 방식으로 먼저 신호를 줄 수 있습니다.",
      supportingSignals: ["회복 루틴", "생활 구조", "토 책임"],
      frictionSignals: ["일정 과밀", "회복 시간 부족"],
      actionHint: "수면과 식사 시간을 일정표에 먼저 고정하세요.",
    },
    mbtiExpression:
      "ENTJ 성향은 戊辰 대운의 책임 흐름을 빠른 판단, 기준 제시, 실행 압박으로 드러나게 만들 수 있습니다.",
    riskManagement: [
      "권한 없는 책임은 역할 범위와 승인선을 문서화해 줄입니다.",
      "고정비와 책임 비용은 월초에 나누어 관리합니다.",
      "회복 루틴은 일정처럼 고정해 과밀한 주간을 버팁니다.",
    ],
    actionPlan: [
      "역할과 마감 기준을 문서로 남깁니다.",
      "고정지출과 계약 조건을 월 단위로 분리합니다.",
      "수면, 식사, 회복 시간을 일정표에 먼저 넣습니다.",
    ],
    finalAdvice: [
      {
        label: "일·성과",
        body: "프로젝트·보고·문서화는 중간 점검 기준을 먼저 잡아 두세요.",
      },
      {
        label: "돈·현실",
        body: "급여·생활비·정산·계약은 월초에 분리해 두세요.",
      },
      {
        label: "인간관계",
        body: "상사·동료·친구와의 연락은 요청 사항을 짧게 정리해 전달하세요.",
      },
      {
        label: "연애·가족",
        body: "연인·가족·부모와의 약속은 시간과 역할을 먼저 맞춰 두세요.",
      },
      {
        label: "학업·자격증",
        body: "자격증·업무 공부·포트폴리오는 결과물 단위로 쪼개서 남기세요.",
      },
      {
        label: "몸·생활 리듬",
        body: "수면·식사·회복 시간을 일정처럼 고정하세요.",
      },
    ],
    safetyNotes: [
      "이 리포트는 인생의 성공이나 실패를 단정하지 않습니다.",
      "대운은 장기 배경이며 실제 선택과 환경에 따라 체감이 달라질 수 있습니다.",
    ],
    ...overrides,
  };
}

describe("majorFortuneReportDraftValidator", () => {
  it("accepts a valid major fortune draft", () => {
    const result = validateMajorFortuneReportDraft(createValidMajorFortuneDraft());

    expect(result.ok).toBe(true);
    expect(result.value?.productType).toBe("major_fortune");
    expect(result.value?.headline).toContain("대운 리포트");
    expect(result.value?.annualCrossReading).toContain("2026년");
    expect(result.value?.careerWorkFlow?.supportingSignals.length).toBeGreaterThan(0);
    expect(result.value?.riskManagement?.length).toBeGreaterThanOrEqual(2);
    expect(result.value?.phaseTimeline).toHaveLength(3);
    expect(result.value?.finalAdvice).toHaveLength(6);
  });

  it("rejects empty launch contract sections", () => {
    const result = validateMajorFortuneReportDraft(
      createValidMajorFortuneDraft({
        headline: "",
        annualCrossReading: "",
        careerWorkFlow: {
          title: "",
          summary: "",
          supportingSignals: [],
          frictionSignals: [],
          actionHint: "",
        },
        riskManagement: [],
        actionPlan: [],
      }),
    );

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      "MAJOR_FORTUNE_LAUNCH_SECTION_MISSING:headline",
    );
    expect(result.errors).toContain(
      "MAJOR_FORTUNE_DOMAIN_FLOW_INVALID:careerWorkFlow:text",
    );
    expect(result.errors).toContain(
      "MAJOR_FORTUNE_DOMAIN_FLOW_INVALID:careerWorkFlow:supportingSignals",
    );
    expect(result.errors).toContain("MAJOR_FORTUNE_RISK_MANAGEMENT_INVALID");
    expect(result.errors).toContain("MAJOR_FORTUNE_ACTION_PLAN_INVALID");
  });

  it("rejects deterministic forbidden launch expressions", () => {
    const result = validateMajorFortuneReportDraft(
      createValidMajorFortuneDraft({
        annualCrossReading: "이 구간은 투자 수익 보장 흐름입니다.",
      }),
    );

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      "MAJOR_FORTUNE_FORBIDDEN_EXPRESSION:투자 수익 보장",
    );
  });

  it("keeps valid safetyNotes unchanged", () => {
    const safetyNotes = [
      "이 리포트는 대운의 10년 배경을 해석한 것입니다.",
      "특정 사건이나 결과를 보장하지 않습니다.",
    ];
    const result = validateMajorFortuneReportDraft(
      createValidMajorFortuneDraft({ safetyNotes }),
    );

    expect(result.ok).toBe(true);
    expect(result.value?.safetyNotes).toEqual(safetyNotes);
    expect(result.warnings).not.toContain("MAJOR_FORTUNE_SAFETY_NOTES_REPAIRED");
  });

  it("repairs missing safetyNotes with default notes", () => {
    const draftWithoutSafetyNotes: Partial<MajorFortuneReportDraft> = {
      ...createValidMajorFortuneDraft(),
    };
    delete draftWithoutSafetyNotes.safetyNotes;
    const result = validateMajorFortuneReportDraft(draftWithoutSafetyNotes);

    expect(result.ok).toBe(true);
    expect(result.value?.safetyNotes).toEqual(DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES);
    expect(result.warnings).toContain("MAJOR_FORTUNE_SAFETY_NOTES_REPAIRED");
  });

  it("repairs non-array safetyNotes with default notes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      safetyNotes: "debug safety note",
    });

    expect(result.ok).toBe(true);
    expect(result.value?.safetyNotes).toEqual(DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES);
    expect(result.warnings).toContain("MAJOR_FORTUNE_SAFETY_NOTES_REPAIRED");
  });

  it("repairs empty and one-item safetyNotes to minimum length", () => {
    const emptyResult = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      safetyNotes: [],
    });
    const oneItemResult = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      safetyNotes: ["대운은 장기 배경 해석입니다."],
    });

    expect(emptyResult.ok).toBe(true);
    expect(emptyResult.value?.safetyNotes).toEqual(
      DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES,
    );
    expect(oneItemResult.ok).toBe(true);
    expect(oneItemResult.value?.safetyNotes.length).toBeGreaterThanOrEqual(2);
    expect(oneItemResult.value?.safetyNotes[0]).toBe(
      "대운은 장기 배경 해석입니다.",
    );
  });

  it("slices overly long safetyNotes to maximum length", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      safetyNotes: [
        "첫 번째 안내입니다.",
        "두 번째 안내입니다.",
        "세 번째 안내입니다.",
        "네 번째 안내입니다.",
        "다섯 번째 안내입니다.",
        "여섯 번째 안내입니다.",
        "일곱 번째 안내입니다.",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value?.safetyNotes).toHaveLength(4);
    expect(result.value?.safetyNotes[3]).toBe("네 번째 안내입니다.");
  });

  it("repairs empty, deterministic, and internal safety note items", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      safetyNotes: [
        "",
        "반드시 돈을 법니다.",
        "fixture debug evidence",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.errors).not.toContain("MAJOR_FORTUNE_SAFETY_NOTES_INVALID");
    expect(result.value?.safetyNotes.join("\n")).not.toContain("반드시");
    expect(result.value?.safetyNotes.join("\n")).not.toContain("돈을 법니다");
    expect(result.value?.safetyNotes.join("\n")).not.toContain("fixture");
    expect(result.value?.safetyNotes.join("\n")).not.toContain("debug");
    expect(result.value?.safetyNotes.join("\n")).not.toContain("evidence");
    expect(
      result.warnings.some((warning) =>
        warning.startsWith("MAJOR_FORTUNE_SAFETY_NOTE_WARNING"),
      ),
    ).toBe(true);
  });

  it("rejects unsupported productType", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      productType: "annual_fortune",
    });

    expect(result.ok).toBe(false);
  });

  it("rejects missing phaseTimeline", () => {
    const draft = {
      ...createValidMajorFortuneDraft(),
    } as Partial<MajorFortuneReportDraft>;
    delete draft.phaseTimeline;

    expect(validateMajorFortuneReportDraft(draft).ok).toBe(false);
  });

  it("rejects phaseTimeline not length 3", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      phaseTimeline: createValidMajorFortuneDraft().phaseTimeline.slice(0, 2),
    });

    expect(result.errors).toContain("MAJOR_FORTUNE_PHASE_TIMELINE_INVALID");
  });

  it("rejects finalAdvice not length 6", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      finalAdvice: createValidMajorFortuneDraft().finalAdvice.slice(0, 5),
    });

    expect(result.errors).toContain("MAJOR_FORTUNE_FINAL_ADVICE_INVALID");
  });

  it("rejects missing big themes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      bigThemes: createValidMajorFortuneDraft().bigThemes.slice(0, 2),
    });

    expect(result.errors).toContain("MAJOR_FORTUNE_BIG_THEMES_INVALID");
  });

  it("requires exactly ten cycle timeline years", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleYearTimeline: createValidMajorFortuneDraft().cycleYearTimeline.slice(0, 9),
    });

    expect(result.errors).toContain(
      "MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_INVALID",
    );
  });

  it("rejects missing or shifted cycle timeline years", () => {
    const timeline = createValidMajorFortuneDraft().cycleYearTimeline.map(
      (year, index) => (index === 4 ? { ...year, year: 2099 } : year),
    );
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleYearTimeline: timeline,
    });

    expect(result.errors).toContain(
      "MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_MISSING_YEARS",
    );
  });

  it("clamps decade card indexes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      decadeCards: createValidMajorFortuneDraft().decadeCards.map((card) => ({
        ...card,
        index: card.label === "일·성과" ? 130 : card.index,
      })),
    });

    expect(result.ok).toBe(true);
    expect(result.value?.decadeCards[0]?.index).toBe(100);
  });

  it("sanitizes hard claims and internal artifacts", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "반드시 성공합니다. evidence debug schema fixture precomputed 진단용",
    });

    expect(result.ok).toBe(true);
    expect(result.value?.openingSummary).not.toMatch(
      /반드시|성공합니다|evidence|debug|schema|fixture|precomputed|진단용/u,
    );
  });

  it("keeps sharper non-deterministic strategy phrases", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "외부 프로젝트 가능성이 커질 수 있습니다. 돈이 움직이는 장면이 늘어날 수 있습니다. 가능성이 올라갑니다.",
    });

    expect(result.ok).toBe(true);
    expect(result.value?.openingSummary).toContain(
      "외부 프로젝트 가능성이 커질 수 있습니다",
    );
    expect(result.value?.openingSummary).toContain(
      "돈이 움직이는 장면이 늘어날 수 있습니다",
    );
    expect(result.value?.openingSummary).toContain("가능성이 올라갑니다");
  });

  it("sanitizes repeated terms and branch parentheses", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      majorStructure: {
        ...createValidMajorFortuneDraft().majorStructure,
        tenGodExplanation: "편관(편관, 압박과 책임)과 甲일간이 만납니다.",
        branchInteractionExplanation:
          "卯戌 육합(卯戌 육합, 실제 약속과 움직임이 묶이는 흐름), 辰戌 충(충, 부딪혀 방향이 바뀌는 구조), 귀문관살: 생각이 한 방향으로 깊게 꽂히거나 예민한 판단이 강해지는 장면 생각이 깊어지는 만큼 혼자 결론을 고정하지 않는 장치가 필요합니다.",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.majorStructure.tenGodExplanation).toContain(
      "편관: 압박과 책임",
    );
    expect(result.value?.majorStructure.tenGodExplanation).toContain(
      "甲(갑목) 일간",
    );
    expect(result.value?.majorStructure.branchInteractionExplanation).toContain(
      "卯戌 육합: 실제 약속과 움직임이 묶이는 흐름",
    );
    expect(result.value?.majorStructure.branchInteractionExplanation).toContain(
      "辰戌 충: 부딪혀 방향이 바뀌는 구조",
    );
    expect(result.value?.majorStructure.branchInteractionExplanation).toContain(
      "장면입니다. 생각이",
    );
    expect(result.value?.majorStructure.branchInteractionExplanation).not.toContain(
      "장면 생각이",
    );
  });

  it("maps old precomputed basis to dev-only user-facing Korean", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleSummary: {
        ...createValidMajorFortuneDraft().cycleSummary,
        basisLabel: "fixture_precomputed",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.cycleSummary.basisLabel).toBe(
      "개발용 사전 계산 대운표 기준",
    );
    expect(result.value?.calculationBasis.displayLabel).toBe(
      "입력된 대운표 기준",
    );
  });

  it("summarizes quality counters", () => {
    const result = validateMajorFortuneReportDraft(createValidMajorFortuneDraft());

    expect(result.ok).toBe(true);
    expect(summarizeMajorFortuneDraftQuality(result.value!)).toEqual({
      hardClaimWarnings: 0,
      internalArtifactWarnings: 0,
      repeatedTerminologyWarnings: 0,
      annualToneWarnings: 0,
      decadeToneWarnings: 0,
      strongYearReasonWarnings: 0,
      cycleYearTimelineCount: 10,
      missingCycleYearWarnings: 0,
      cycleIndexLeakWarnings: 0,
      technicalTermWithoutExplanationWarnings: 2,
      smallEventOverfocusWarnings: 0,
      wrongCycleBasisWarnings: 0,
      genericTimelineWarnings: 0,
      repeatedSummaryWarnings: 1,
      weakStrategyWarnings: 0,
      relationshipStatusMisuseWarnings: 0,
      strongYearTitleRepeatWarnings: 0,
      repeatedThemeWarnings: 0,
      repeatedStrategyWarnings: 0,
      emptyMyeongliBasisWarnings: 0,
      duplicateBigThemeWarnings: 0,
      duplicateBigThemeDomainWarnings: 0,
      duplicateStrongYearPushWarnings: 0,
      duplicateStrongYearReduceWarnings: 0,
      duplicateTopPushWarnings: 0,
      duplicateTopReduceWarnings: 0,
      shortStrategyBodyWarnings: 0,
      unknownStatusExposureWarnings: 0,
      weakSpecificityWarnings: 0,
      unknownRelationshipPillWarnings: 0,
      slashSeparatedWhyStrongWarnings: 0,
      duplicateStrongYearHeadlineWarnings: 0,
      weakAuxiliaryStarWarnings: 0,
      timelineSpacingWarnings: 0,
      ageBasisRepetitionWarnings: 0,
    });
  });

  it("warns when a major fortune draft overuses annual tone", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "올해는 2026년에는 이번 해 흐름을 봅니다. 올해 1월과 2월의 월별 흐름처럼 보입니다.",
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).annualToneWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_ANNUAL_TONE_WARNING"),
    )).toBe(true);
  });

  it("accepts decade tone markers for a major fortune draft", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "이 대운은 이 10년 동안 반복되는 구조를 봅니다. 이 구간은 초반, 중반, 후반으로 나뉘며 이전 대운과 다음 대운 사이의 연도 구간도 함께 봅니다.",
    });

    expect(result.ok).toBe(true);
    expect(summarizeMajorFortuneDraftQuality(result.value!).decadeToneWarnings).toBe(0);
  });

  it("rejects missing early/middle/late phase order and more than three phases", () => {
    const missingEarly = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      phaseTimeline: [
        createValidMajorFortuneDraft().phaseTimeline[1],
        createValidMajorFortuneDraft().phaseTimeline[2],
        createValidMajorFortuneDraft().phaseTimeline[0],
      ],
    });
    const tooMany = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      phaseTimeline: [
        ...createValidMajorFortuneDraft().phaseTimeline,
        createValidMajorFortuneDraft().phaseTimeline[2],
      ],
    });

    expect(missingEarly.errors).toContain("MAJOR_FORTUNE_PHASE_TIMELINE_ORDER_INVALID");
    expect(tooMany.errors).toContain("MAJOR_FORTUNE_PHASE_TIMELINE_INVALID");
  });

  it("warns when strong years do not explain why the year is strong", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      strongYears: createValidMajorFortuneDraft().strongYears.map((year) => ({
        ...year,
        headline: "강한 해",
        body: "중요하게 체감될 수 있습니다.",
        advice: "기록하세요.",
        whyStrong: "중요하게 체감될 수 있습니다.",
        pushStrategy: "활용하세요.",
        reduceStrategy: "조심하세요.",
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).strongYearReasonWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_STRONG_YEAR_REASON_WARNING"),
    )).toBe(true);
  });

  it("warns when cycle index leaks into flow-like indexes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      flowIndexSummary: {
        ...createValidMajorFortuneDraft().flowIndexSummary,
        flowIndex: 3,
      },
      decadeCards: createValidMajorFortuneDraft().decadeCards.map((card) => ({
        ...card,
        index: 3,
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).cycleIndexLeakWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_CYCLE_INDEX_LEAK_WARNING"),
    )).toBe(true);
  });

  it("warns when active cycle does not contain the current year", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleSummary: {
        ...createValidMajorFortuneDraft().cycleSummary,
        currentPositionLabel: "2040년 기준 1년차",
      },
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).wrongCycleBasisWarnings,
    ).toBeGreaterThan(0);
  });

  it("warns when timeline keeps generic source wording", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleYearTimeline: createValidMajorFortuneDraft().cycleYearTimeline.map(
        (year) => ({
          ...year,
          plainInterpretation:
            "대운 지지 또는 원국 지지와 강한 작용 흐름을 봅니다.",
        }),
      ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).genericTimelineWarnings,
    ).toBeGreaterThan(0);
  });

  it("requires the compact major fortune timeline rows", () => {
    const draft = createValidMajorFortuneDraft();
    const result = validateMajorFortuneReportDraft(draft);

    expect(result.ok).toBe(true);
    expect(result.value?.majorFortuneTimelineRows).toHaveLength(10);
    expect(result.value?.majorFortuneTimelineRows[0]).toMatchObject({
      year: 2026,
      majorGanji: "戊辰",
      annualGanji: "丙午",
      isCurrentYear: true,
      isCycleStartYear: true,
    });
    expect(result.value?.majorFortuneTimelineRows[0]?.badges).toContain("올해");
    expect(result.value?.majorFortuneTimelineRows[0]?.badges).toContain("전환");
    expect(result.value?.majorFortuneTimelineRows.every((row) => row.oneLine.length > 0)).toBe(true);
    expect(result.value?.majorFortuneTimelineRows.every((row) => row.strategy.length > 0)).toBe(true);
  });

  it("accepts regular-wealth strong years as money reality management", () => {
    const draft = createValidMajorFortuneDraft();
    const result = validateMajorFortuneReportDraft({
      ...draft,
      strongYears: draft.strongYears.map((year) =>
        year.year === 2028
          ? {
              ...year,
              ganji: "己酉",
              headline: "돈의 흐름을 숫자로 고정하는 해",
              whyStrong:
                "己酉는 정재 흐름이 강해져 돈과 현실을 감이 아니라 숫자로 고정하려는 힘이 커집니다. 계약, 정산, 고정비, 현금흐름이 중요해질 수 있습니다.",
              likelyArea: "돈·현실관리",
            }
          : year,
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.value?.strongYears.find((year) => year.ganji === "己酉")?.likelyArea).toBe(
      "돈·현실관리",
    );
  });

  it("requires expanded myeongli layers and removes diagnostic-only stars", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      myeongliLayers: {
        ...createValidMajorFortuneDraft().myeongliLayers,
        auxiliaryStarsLayer: [
          ...createValidMajorFortuneDraft().myeongliLayers.auxiliaryStarsLayer,
          {
            label: "백호대살",
            plain: "사용자 화면에 나오면 안 됩니다.",
            caution: null,
          },
        ],
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.myeongliLayers.tenGodLayer.majorStemTenGod).toBe("편재");
    expect(result.value?.myeongliLayers.branchInteractionLayer.interactions).toHaveLength(1);
    expect(result.value?.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems).toContain(
      "戊(편재)",
    );
    expect(
      result.value?.myeongliLayers.auxiliaryStarsLayer.some((star) =>
        star.label.includes("백호대살"),
      ),
    ).toBe(false);
  });

  it("warns when the same major theme repeats too often", () => {
    const repeated = Array.from({ length: 60 }, () => "책임").join(" ");
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary: repeated,
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).repeatedThemeWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_REPEATED_THEME_WARNING"),
    )).toBe(true);
  });

  it("warns when the same timeline strategy repeats more than three times", () => {
    const repeatedStrategy =
      "크게 벌리기보다 계약, 역할, 일정의 충돌 지점을 먼저 줄이세요.";
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      majorFortuneTimelineRows: createValidMajorFortuneDraft().majorFortuneTimelineRows.map(
        (row) => ({
          ...row,
          strategy: repeatedStrategy,
        }),
      ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).repeatedStrategyWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_REPEATED_STRATEGY_WARNING"),
    )).toBe(true);
  });

  it("repairs duplicate money/resource bigThemes with relationship life boundary", () => {
    const draft = createValidMajorFortuneDraft();
    const result = validateMajorFortuneReportDraft({
      ...draft,
      bigThemes: [
        {
          ...draft.bigThemes[0]!,
          title: "돈과 자원 운용",
          metaphor: "외부 프로젝트와 자원을 실제 돈으로 묶는 흐름",
          body: "돈, 자원, 계약, 외부 프로젝트를 다루는 테마입니다.",
          strategy: "외부 프로젝트와 계약 기준을 먼저 정하세요.",
        },
        {
          ...draft.bigThemes[1]!,
          title: "역할과 책임의 설계",
          metaphor: "일에서 맡게 되는 운영 책임을 선으로 나누는 흐름",
          body: "역할, 책임, 프로젝트 운영 기준을 다루는 테마입니다.",
          strategy: "맡을 역할과 맡지 않을 책임을 문서로 나누세요.",
        },
        {
          ...draft.bigThemes[2]!,
          title: "돈과 현실 구조",
          metaphor: "정산과 고정비를 현실 숫자로 고정하는 흐름",
          body: "정산, 계약, 고정비, 현금흐름을 다루는 테마입니다.",
          strategy: "돈과 비용 구조를 월 단위로 나누세요.",
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value?.bigThemes.map((theme) => theme.title)).toEqual([
      "돈과 자원 운용",
      "역할과 책임의 설계",
      "생활 리듬과 관계 경계",
    ]);
    expect(result.value?.bigThemes[2]?.body).not.toContain("미입력");
    expect(result.value?.bigThemes[2]?.body).not.toContain("관계 상태");
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).duplicateBigThemeWarnings,
    ).toBe(0);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .duplicateBigThemeDomainWarnings,
    ).toBe(0);
  });

  it("classifies major fortune big theme domains", () => {
    const draft = createValidMajorFortuneDraft();

    expect(
      classifyMajorFortuneBigThemeDomain({
        ...draft.bigThemes[0]!,
        title: "외부 프로젝트와 돈의 흐름",
        metaphor: "계약과 자원을 움직이는 흐름",
      }),
    ).toBe("money_resource");
    expect(
      classifyMajorFortuneBigThemeDomain({
        ...draft.bigThemes[0]!,
        title: "일에서 맡게 되는 운영 책임",
        metaphor: "프로젝트 기준과 보고 라인을 세우는 흐름",
      }),
    ).toBe("work_role");
    expect(
      classifyMajorFortuneBigThemeDomain({
        ...draft.bigThemes[0]!,
        title: "생활 리듬과 관계 경계",
        metaphor: "사람과 일정이 실제 역할로 묶이는 테마",
        likelyScenes: [
          "만남 주기와 연락 방식을 맞추는 장면",
          "가족과 가까운 관계의 경계를 정하는 장면",
        ],
        strategy: "관계에서는 만남 주기와 연락 방식을 먼저 맞추세요.",
      }),
    ).toBe("relationship_life");
  });

  it("preserves already diverse bigThemes", () => {
    const draft = createValidMajorFortuneDraft();
    const result = validateMajorFortuneReportDraft(draft);

    expect(result.ok).toBe(true);
    expect(result.value?.bigThemes.map((theme) => theme.title)).toEqual(
      draft.bigThemes.map((theme) => theme.title),
    );
  });

  it("warns when strong year push and reduce strategies repeat too much", () => {
    const repeatedPush = "외부 프로젝트, 계약, 부업성 수익, 자원 배치";
    const repeatedReduce = "감으로 하는 투자, 애매한 돈거래, 구두 약속";
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      strongYears: createValidMajorFortuneDraft().strongYears.map((year) => ({
        ...year,
        pushStrategy: repeatedPush,
        reduceStrategy: repeatedReduce,
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .duplicateStrongYearPushWarnings,
    ).toBeGreaterThan(0);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .duplicateStrongYearReduceWarnings,
    ).toBeGreaterThan(0);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).duplicateTopPushWarnings,
    ).toBeGreaterThan(0);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).duplicateTopReduceWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_PUSH_WARNING"),
    )).toBe(true);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_REDUCE_WARNING"),
    )).toBe(true);
  });

  it("warns when timeline labels are missing spacing", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      majorFortuneTimelineRows:
        createValidMajorFortuneDraft().majorFortuneTimelineRows.map((row, index) =>
          index === 0
            ? {
                ...row,
                oneLine: "대운戊辰과 세운丙午가 겹치는 해입니다.",
              }
            : row,
        ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).timelineSpacingWarnings,
    ).toBeGreaterThan(0);
  });

  it("normalizes age basis labels to one timeline row", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      majorFortuneTimelineRows:
        createValidMajorFortuneDraft().majorFortuneTimelineRows.map((row) => ({
          ...row,
          ageBasisLabel: "대운표 기준 나이",
        })),
    });

    expect(result.ok).toBe(true);
    expect(
      result.value?.majorFortuneTimelineRows.filter(
        (row) => row.ageBasisLabel !== null,
      ),
    ).toHaveLength(1);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).ageBasisRepetitionWarnings,
    ).toBe(0);
  });

  it("warns when myeongli basis content is empty", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      myeongliLayers: {
        ...createValidMajorFortuneDraft().myeongliLayers,
        tenGodLayer: {
          ...createValidMajorFortuneDraft().myeongliLayers.tenGodLayer,
          plain: "",
        },
      },
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).emptyMyeongliBasisWarnings,
    ).toBeGreaterThan(0);
  });

  it("warns when unknown relationship status is interpreted as known", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      decadeCards: createValidMajorFortuneDraft().decadeCards.map((card) =>
        card.label === "연애·가족"
          ? { ...card, body: "솔로탈출과 애인 운이 강하게 들어옵니다." }
          : card,
      ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .relationshipStatusMisuseWarnings,
    ).toBeGreaterThan(0);
  });

  it("warns when unknown relationship status is exposed in interpretive body", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      finalAdvice: createValidMajorFortuneDraft().finalAdvice.map((advice) =>
        advice.label === "연애·가족"
          ? {
              ...advice,
              body: "관계 상태가 미입력이므로 단정하지 않고 봅니다. 연애 상태가 입력되지 않아 생활 반경 중심으로 해석합니다.",
            }
          : advice,
      ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .unknownStatusExposureWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_UNKNOWN_STATUS_EXPOSURE_WARNING"),
    )).toBe(true);
  });

  it("warns when a reality strategy body is too short", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      finalAdvice: createValidMajorFortuneDraft().finalAdvice.map((advice, index) =>
        index === 0 ? { ...advice, body: "짧은 조언입니다." } : advice,
      ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).shortStrategyBodyWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_SHORT_STRATEGY_BODY_WARNING"),
    )).toBe(true);
  });

  it("preserves newly allowed immersive but non-deterministic phrases", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "수익화 접점이 늘어날 수 있습니다. 외부 프로젝트 가능성이 커질 수 있습니다. 프로젝트에서 큰 성과를 볼 수 있습니다. 연애 가능성이 올라갑니다. 결혼을 고민할 만한 압력이 커질 수 있습니다. 이직·직무 전환을 검토하기 쉬운 흐름입니다.",
    });

    expect(result.ok).toBe(true);
    expect(result.value?.openingSummary).toContain("수익화 접점이 늘어날 수 있습니다");
    expect(result.value?.openingSummary).toContain("외부 프로젝트 가능성이 커질 수 있습니다");
    expect(result.value?.openingSummary).toContain("연애 가능성이 올라갑니다");
    expect(result.value?.openingSummary).toContain(
      "이직·직무 전환을 검토하기 쉬운 흐름입니다",
    );
  });

  it("warns when strong year headline repeats the section title", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      strongYears: createValidMajorFortuneDraft().strongYears.map((year) => ({
        ...year,
        headline: "특히 강하게 체감될 수 있는 해 TOP 5",
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .strongYearTitleRepeatWarnings,
    ).toBeGreaterThan(0);
  });

  it("warns when strong year whyStrong is a slash-separated evidence list", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      strongYears: createValidMajorFortuneDraft().strongYears.map((year, index) =>
        index === 0
          ? {
              ...year,
              whyStrong:
                "대운의 오행이 반복됨 / 육합·충 작용으로 조정됨 / 토 과다 압박이 커짐",
            }
          : year,
      ),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .slashSeparatedWhyStrongWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_SLASH_SEPARATED_WHY_STRONG_WARNING"),
    )).toBe(true);
  });

  it("warns when strong year headlines repeat", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      strongYears: createValidMajorFortuneDraft().strongYears.map((year) => ({
        ...year,
        headline: "이미 깔린 구조와 새 책임이 부딪히는 해",
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!)
        .duplicateStrongYearHeadlineWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_HEADLINE_WARNING"),
    )).toBe(true);
  });

  it("filters weak auxiliary star filler lines", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      myeongliLayers: {
        ...createValidMajorFortuneDraft().myeongliLayers,
        auxiliaryStarsLayer: [
          ...createValidMajorFortuneDraft().myeongliLayers.auxiliaryStarsLayer,
          {
            label: "육해살",
            plain: "육해살은 대운 해석에서 생활 장면으로만 조심스럽게 참고합니다.",
            caution: null,
          },
        ],
      },
    });

    expect(result.ok).toBe(true);
    expect(
      result.value?.myeongliLayers.auxiliaryStarsLayer
        .map((star) => star.plain)
        .join("\n"),
    ).not.toContain("생활 장면으로만 조심스럽게 참고합니다");
    expect(result.value?.myeongliLayers.auxiliaryStarsLayer.length).toBeLessThanOrEqual(5);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).weakAuxiliaryStarWarnings,
    ).toBe(0);
  });

  it("exposes visible sanitizer directly", () => {
    expect(sanitizeMajorFortuneVisibleText("식신(식신, 결과물·표현·생산성)")).toBe(
      "식신: 결과물·표현·생산성",
    );
    expect(sanitizeMajorFortuneVisibleText("甲일간")).toBe("甲(갑목) 일간");
    expect(
      sanitizeMajorFortuneVisibleText(
        "귀문관살: 생각이 깊어지는 장면 생각이 고정될 수 있습니다.",
      ),
    ).toBe("귀문관살: 생각이 깊어지는 장면입니다. 생각이 고정될 수 있습니다.");
    expect(sanitizeMajorFortuneVisibleText("관계가 흔들리는 장면 관계 기준을 정합니다.")).toBe(
      "관계가 흔들리는 장면입니다. 관계 기준을 정합니다.",
    );
    expect(sanitizeMajorFortuneVisibleText("현실이 움직이는 장면 돈 기준을 잡습니다.")).toBe(
      "현실이 움직이는 장면입니다. 돈 기준을 잡습니다.",
    );
  });
});
