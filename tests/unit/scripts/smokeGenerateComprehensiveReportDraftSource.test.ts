import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_comprehensive_report_draft.ts"),
  "utf8",
);
const debugHelperSource = readFileSync(
  join(process.cwd(), "src/lib/report-knowledge/sajuFeatureEvidenceDebug.ts"),
  "utf8",
);

describe("generate comprehensive report draft smoke script source", () => {
  it("uses explicit OpenAI report writer envs and sample evidence builder", () => {
    const requiredMarkers = [
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
      "buildComprehensiveReportEvidencePacketFromComputedFacts",
      "buildSafeSajuFeatureEvidenceDebugSummary",
      "formatSafeSajuFeatureEvidenceDebugSummary",
      "generateComprehensiveReportDraft",
      "isComprehensiveReportV2Draft",
      "isSafeReportGenerationError",
      "OPENAI_REPORT_WRITER_DEBUG_SAFE",
      "--write-preview",
      "buildLocalFallbackDraft",
      "buildDeterministicSajuFeatureChapter",
      "validateComprehensiveReportDraft",
      "writer disabled: using local deterministic draft builder.",
      "sajuFeatureChapter",
      "longformReadings",
      "preview snapshot written:",
      ".tmp/comprehensive-report-preview",
      "OpenAI request debug:",
      "input message count",
      "approx prompt chars",
      "response format",
      "schema keys",
      "getReportSmokeFixture",
      "getReportSmokeFixtureIdFromArgs",
      "getComprehensivePreviewSmokeFixtureIdFromArgs",
      "deokmin",
      "deokmin-external-manse",
      "buildCareerReportEvidence",
      "requireCareerReportFixture",
      "deokmin-career",
      "fixture.sajuFacts",
      "report fixture:",
      "draft version",
      "product type",
      "chapters",
      "core line",
      "first chapter",
      "quality repair: attempted",
      "quality repair:",
      "warnings:",
      "failed",
      "code:",
      "stage:",
      "status:",
      "errorType:",
      "errorCode:",
      "message:",
      "requestId:",
      "done",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of [
      "computed saju feature ids",
      "selected saju feature evidence",
      "excluded high scoring features",
      "saju feature spotlight",
      "signature scenes",
      "selected evidence narrowness",
    ]) {
      expect(debugHelperSource).toContain(marker);
    }
  });

  it("keeps writer-disabled fallback preview quality markers in source", () => {
    for (const marker of [
      "공통 만세력표는 근거이고",
      "buildDeterministicSajuFeatureChapter",
      "신살·귀인·합충·지장간",
      "getIntegratedMbtiCopy",
      "buildLaunchBridgeSentences",
      "buildLaunchLongformBody",
      "오행 분포는 목 2, 화 0, 토 4, 금 2, 수 0",
      "비효율적인 사람을 보면",
      "논쟁을 친밀감처럼",
      "책임 없이 말만 많은",
      "프로젝트를 시작할 때는 열정보다 기록과 합의가 먼저",
      "쉬라는 말만 들으면 잘 못 쉴 수 있습니다",
      "밤 산책, 짧은 기록, 물 마시기",
      "LOCAL_COMPREHENSIVE_DRAFT_INVALID",
      "SAJU_FEATURE_CHAPTER_UNAVAILABLE",
      "getPreviewSnapshotRelativePath",
      "writePreviewSnapshot",
      "buildPreviewProfileTable",
      "buildSsotPillarGridForFixture",
      "buildEvidenceBoundSajuFeatureChapter",
      "getLocalSajuFeatureSpotlight",
      "getLocalSajuSignatureScenes",
      "isEvidenceBoundVisibleFeature",
      "getFeatureOneLineSummary",
      "내 사주의 주요 표식 해석",
      "getContextualFeatureKeywords",
      "withTopicParticle",
      "틀린 구조가 먼저 보이는 장면",
      "책임을 끝까지 끌고 가는 장면",
      "돈이 되는 판을 빨리 보는 장면",
    ]) {
      expect(source).toContain(marker);
    }
    expect(source).not.toContain("SAJU_FEATURE_SPOTLIGHT_EMPTY");
    expect(source).not.toContain("SAJU_SIGNATURE_SCENES_EMPTY");
  });

  it("blocks assembled fallback prose patterns and Korean particle regressions", () => {
    for (const marker of [
      "이름을 그대로 믿는 표식이 아니라",
      "속도를 한 번 낮춰야 합니다",
      "안에서 잘 쓰면",
      "과해질 때는",
      "현실 장면은",
      "어떤 생활 장면",
      "생활 장면으로 옮겨",
      "ENTJ는 원인이 아니라",
      "질문과 기록으로 줄여야 합니다",
      "결론이 빨리 보이는 대화",
      "가장 먼저 체감되는 기준입니다",
      "대담한 통솔자 성향은",
      "흐름이 생기므로",
      "로 힘을 얻지만",
      "관계와 일정의 비용이 커질 수 있습니다",
      "결론을 말하기 전, 제가 이해한 핵심은 이것이라고 시작하세요",
      "을 중심에 두고 전체 결",
      "사람의 말투와 선택 속도",
      " 단서는",
      "신호가 함께 나타날 수 있습니다",
      "표현의 온도보다 기준표",
      "쪽을 조심해야 합니다",
      "정재을",
      "편재을",
      "토 과다을",
      "토 과다은",
      "편재이",
      "화개은",
      "갑신일주이",
      "마지막 정리은",
      "나타납니다로",
      "좋습니다 이",
      "좋습니다 당신에게",
      "좋습니다 갑신일주는",
      "합니다 재다신약은",
      "해야 합니다 수 부족은",
      "합니다 그래서",
      "장면. 강점으로",
      "살아납니다 쪽",
      "조심해야 합니다 쪽",
      "관성을",
      "사람, 가족, 환경는",
      "사용자님",
      "placeholder",
      "source registry",
    ]) {
      expect(source).not.toContain(marker);
    }
  });

  it("does not print raw model output private fields or full report body", () => {
    const blockedMarkers = [
      "writeStatus(result.rawText",
      "writeStatus(`rawText",
      "writeStatus(result.draft.sections[0].body",
      "writeStatus(`body",
      "writeStatus(\"OPENAI_API_KEY",
      "writeStatus(`OPENAI_API_KEY",
      "process.stdout.write(apiKey",
      "writeStatus(messages.system",
      "writeStatus(messages.developer",
      "writeStatus(messages.user",
      "Authorization",
      "console.log",
      "payment" + "Key",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "share" + "Token",
      "access" + "TokenHash",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
