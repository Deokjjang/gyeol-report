import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { buildCareerReportEvidence } from "../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";
import {
  CareerReportWriterFailure,
  careerMoneyStudyResponseFormatName,
  generateCareerReportDraft,
} from "../../../src/lib/report-generation/openaiCareerReportWriter";
import {
  careerReportDraftJsonSchema,
  type CareerReportDraft,
} from "../../../src/lib/report-generation/careerReportDraftTypes";
import {
  getCareerReportPreviewSnapshotRelativePath,
  sanitizeCareerReportPreviewSnapshotPayload,
} from "../../../src/lib/report-generation/careerReportPreviewSnapshot";

function buildPacket() {
  const fixture = requireCareerReportFixture("deokmin-career");

  return buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
}

function createDraft(): CareerReportDraft {
  return {
    version: "v1",
    productType: "career_money_study",
    productVersion: "v1",
    personLabel: "덕민",
    openingTitle: "운영형 PM",
    openingSummary: "직업과 돈, 학업을 구체적으로 보는 리포트입니다.",
    coreLine: "구조로 묶을 때 성과를 볼 가능성이 커집니다.",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      relationshipStatusLabel: null,
      contextNote: "현재 상태를 해석 필터로 사용했습니다.",
    },
    careerIdentity: {
      headline: "운영형 기획자",
      archetypeLabel: "operator_planner",
      body: "요구사항과 성과 기준을 정리하는 역할이 맞습니다.",
      strongestFit: "PM/PO",
      biggestRisk: "권한 없는 책임",
    },
    myeongliMbtiSummary: {
      myeongliCore: "재성·관성·토 과다가 현실 책임을 키웁니다.",
      mbtiCore: "ENTJ는 전략과 구조화를 씁니다.",
      combinedReading: "운영형 PM 쪽에서 강점이 살아납니다.",
      alignment: "aligned",
      tensionNote: null,
    },
    recommendedJobs: Array.from({ length: 8 }, (_, index) => ({
      title: `추천 직무 ${index + 1}`,
      fit: index < 4 ? "high" : "medium",
      tagline: "구조화 직무",
      reason: "근거와 맞습니다.",
      caution: "역할 범위를 확인하세요.",
      exampleFields: ["SaaS", "핀테크", "정산"],
    })),
    unsuitableJobs: Array.from({ length: 3 }, (_, index) => ({
      title: `덜 맞는 직무 ${index + 1}`,
      reason: "성과 기준이 약합니다.",
      warning: "소모가 커질 수 있습니다.",
    })),
    careerPaths: Array.from({ length: 3 }, (_, index) => ({
      label: `경로 ${index + 1}`,
      fit: "medium",
      headline: "경로",
      body: "실무 산출물을 남깁니다.",
      push: ["문서화", "성과 기준", "계약"],
      avoid: ["구두 지시", "무리한 일정", "범위 없는 책임"],
    })),
    moneyEarningStyle: {
      headline: "계약과 정산",
      body: "외부 프로젝트 접점이 늘어날 수 있습니다.",
      bestIncomeChannels: ["월급", "성과급", "외부 프로젝트"],
      riskyIncomeChannels: ["구두 돈거래", "조건 없는 협업", "감정 단타"],
      sideIncomeIdeas: ["기획 외주", "템플릿", "운영 컨설팅"],
    },
    investmentAndSavingStyle: {
      headline: "분산·적립",
      body: "우량주, ETF, 장기 분산, 적립식이 더 맞습니다.",
      suitablePatterns: ["우량주", "ETF", "장기 분산"],
      cautionPatterns: ["감정 단타", "구두 돈거래", "과도한 레버리지"],
      forbiddenNote:
        "이 내용은 성향 기반 해석이며 금융 자문이 아닙니다. 실제 투자는 본인의 판단과 별도 검토가 필요합니다.",
    },
    careerTiming: Array.from({ length: 3 }, (_, index) => ({
      year: 2026 + index,
      label: "타이밍",
      headline: "검토하기 쉬운 흐름",
      body: "성과를 볼 가능성이 커집니다.",
      push: ["산출물", "계약", "정산"],
      avoid: ["구두 약속", "무리한 일정", "감정 단타"],
    })),
    studyCertificatePlan: {
      headline: "포트폴리오",
      body: "공부를 결과물로 남깁니다.",
      recommendedCertificates: ["SQL", "데이터 분석", "PM 실무"],
      recommendedStudyMethods: ["기출", "오답", "피드백"],
      portfolioStrategy: ["문제 정의", "과정", "결과"],
      avoidStudyPatterns: ["벼락치기", "요약만 읽기", "결과물 없는 공부"],
    },
    actionPlan: [
      "직업",
      "커리어",
      "돈",
      "투자·저축",
      "학업·자격증",
      "포트폴리오",
    ].map((label) => ({
      label: label as CareerReportDraft["actionPlan"][number]["label"],
      headline: `${label} 액션`,
      body: "바로 실행할 수 있는 행동입니다.",
      firstAction: "오늘 하나 기록합니다.",
    })),
    riskWarnings: [
      {
        title: "권한 없는 책임",
        body: "역할 범위가 없으면 소모됩니다.",
        prevention: "문서로 남깁니다.",
      },
    ],
    safetyNotes: [
      "이 리포트는 특정 결과를 보장하지 않습니다.",
      "투자 관련 문장은 금융 자문이 아닙니다.",
    ],
  };
}

describe("openaiCareerReportWriter", () => {
  it("does not call OpenAI when disabled", async () => {
    const fetchImpl = vi.fn<typeof fetch>();

    await expect(
      generateCareerReportDraft({
        evidencePacket: buildPacket(),
        config: {
          enabled: false,
          apiKey: "",
          model: "",
          fetchImpl,
        },
      }),
    ).rejects.toMatchObject({
      code: "OPENAI_REPORT_WRITER_DISABLED",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("uses strict career_money_study_report_draft response format and validates returned draft", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          output_text: JSON.stringify(createDraft()),
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    const result = await generateCareerReportDraft({
      evidencePacket: buildPacket(),
      config: {
        enabled: true,
        apiKey: "sk-test",
        model: "test-model",
        fetchImpl,
      },
    });
    const request = JSON.parse(
      fetchImpl.mock.calls[0]?.[1]?.body as string,
    ) as {
      readonly text: {
        readonly format: {
          readonly name: string;
          readonly strict: boolean;
          readonly schema: unknown;
        };
      };
    };

    expect(result.draft.productType).toBe("career_money_study");
    expect(request.text.format.name).toBe(careerMoneyStudyResponseFormatName);
    expect(request.text.format.strict).toBe(true);
    expect(request.text.format.schema).toEqual(careerReportDraftJsonSchema);
  });

  it("debug diagnostics do not expose API key", () => {
    const failure = new CareerReportWriterFailure({
      code: "OPENAI_CAREER_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: {
        responseFormatName: careerMoneyStudyResponseFormatName,
        schemaTopLevelKeys: ["version"],
        schemaApproxChars: 10,
        diagnosticMessage: "Authorization: Bearer sk-secret OPENAI_API_KEY=sk-secret",
      },
    });

    expect(failure.message).not.toContain("sk-secret");
    expect(failure.message).toContain("[redacted-auth]");
  });

  it("career preview snapshot uses career-report-preview path and has no OpenAI import", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/report-generation/careerReportPreviewSnapshot.ts"),
      "utf8",
    );
    const draft = createDraft();
    const packet = buildPacket();
    const sanitized = sanitizeCareerReportPreviewSnapshotPayload({
      evidencePacket: packet,
      draft: {
        ...draft,
        coreLine: "AAPL 매수하세요",
      },
    });

    expect(getCareerReportPreviewSnapshotRelativePath("deokmin-career")).toBe(
      ".tmp/career-report-preview/deokmin-career-latest.json",
    );
    expect(sanitized.evidencePacket.productType).toBe("career_money_study");
    expect(sanitized.draft.coreLine).not.toContain("AAPL");
    expect(source).not.toContain("openaiCareerReportWriter");
    expect(source).not.toContain("generateCareerReportDraft");
  });
});
