import { randomUUID } from "node:crypto";

import { markTossPaymentOrderPaid } from "../src/lib/payment/supabaseTossPaymentOrderPaidAdapter";
import { createSupabaseTossPaymentOrderPaidClient } from "../src/lib/payment/supabaseTossPaymentOrderPaidClient";
import { createReadyPaymentOrder } from "../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../src/lib/payment/supabaseReadyPaymentOrderClient";
import { fulfillPaidPaymentOrder } from "../src/lib/payment/supabasePaidReportFulfillmentAdapter";
import { createSupabasePaidReportFulfillmentClient } from "../src/lib/payment/supabasePaidReportFulfillmentClient";
import { saveComprehensiveReportDraftSnapshot } from "../src/lib/report-persistence/supabaseComprehensiveReportSnapshotAdapter";
import type { ComprehensiveReportDraft } from "../src/lib/report-generation/comprehensiveReportDraftTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../src/lib/report-knowledge/reportSectionSchema";

type RequiredSupabaseEnvName = "SUPABASE_URL" | "SUPABASE_ANON_KEY";

const requiredSupabaseEnvNames = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const satisfies readonly RequiredSupabaseEnvName[];
const productType = "saju_mbti_full";
const provider = "toss";
const inputSnapshot = {
  displayName: "SAVE_COMPREHENSIVE_DRAFT_SNAPSHOT_SMOKE",
  birthDate: "1996-12-06",
  birthTime: "14:15",
  calendarType: "SOLAR",
  gender: "FEMALE",
  mbtiType: "ENTJ",
  timezone: "Asia/Seoul",
} as const;

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function createSmokeError(message: string): Error {
  return new Error(`Save comprehensive report draft snapshot smoke failed: ${message}`);
}

function getRequiredEnvValue(name: RequiredSupabaseEnvName): string {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw createSmokeError(`set ${name} first.`);
  }

  return value;
}

function assertRequiredSupabaseEnv(): void {
  for (const name of requiredSupabaseEnvNames) {
    getRequiredEnvValue(name);
  }
}

function createSafeSampleSection(
  definition: ComprehensiveReportSectionDefinition,
): ComprehensiveReportDraft["sections"][number] {
  if (definition.id === "manse_table") {
    return {
      sectionId: definition.id,
      titleKo: definition.titleKo,
      oneLine: "사주 기본 구조를 정리했습니다.",
      body: "사주 원국의 기본 구조를 정리했습니다.",
      evidenceSummary: ["사주 기본 구조"],
      sajuTermsUsed: [],
      mbtiTermsUsed: [],
      cautionLevel: "low",
    };
  }

  if (definition.id === "mbti_table") {
    return {
      sectionId: definition.id,
      titleKo: definition.titleKo,
      oneLine: "MBTI 입력 기준을 정리했습니다.",
      body: "입력하신 MBTI 유형을 리포트 보조 기준으로 반영했습니다.",
      evidenceSummary: ["ENTJ"],
      sajuTermsUsed: [],
      mbtiTermsUsed: ["ENTJ", "Te/Ni"],
      cautionLevel: "low",
    };
  }

  const isMbtiDisplay =
    definition.id === "mbti_core";

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} 핵심을 사주 근거로 정리합니다.`,
    body:
      `${definition.titleKo}에서는 갑목과 갑신일주를 먼저 보고 ENTJ는 보조 근거로 연결합니다. ${definition.id} 항목은 저장 전 검증 가능한 본문으로 둡니다.`,
    evidenceSummary: ["갑목", "갑신일주", "ENTJ"],
    sajuTermsUsed:
      definition.primaryBasis === "display" && isMbtiDisplay
        ? []
        : ["갑목", "갑신일주"],
    mbtiTermsUsed: isMbtiDisplay ? ["ENTJ", "Te/Ni"] : ["ENTJ"],
    cautionLevel: "medium",
  };
}

function createSafeSampleDraft(): ComprehensiveReportDraft {
  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: ["saju_first", "conversational", "direct"],
    openingTitle: "사주가 먼저 보이는 종합 리포트",
    openingSummary:
      "사주 원국의 구조를 먼저 놓고 MBTI는 사용자가 체감하는 자기상을 보조로 연결합니다.",
    coreLine: "갑목의 방향성과 ENTJ의 성취 지향이 같은 방향으로 겹칩니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createSafeSampleSection),
    finalAdvice:
      "성과를 만드는 힘은 살리되 휴식, 감정 표현, 관계 완충은 의식적으로 보완해 주세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

async function run(): Promise<void> {
  assertRequiredSupabaseEnv();
  writeStatus("start");

  const supabaseUrl = getRequiredEnvValue("SUPABASE_URL");
  const supabaseAnonKey = getRequiredEnvValue("SUPABASE_ANON_KEY");
  const readyClient = createSupabaseReadyPaymentOrderClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const paidClient = createSupabaseTossPaymentOrderPaidClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const fulfillmentClient = createSupabasePaidReportFulfillmentClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const runId = randomUUID();
  const createResult = await createReadyPaymentOrder({
    productType,
    provider,
    inputSnapshot,
    providerOrderId: `smoke_provider_order_snapshot_${runId}`,
    client: readyClient,
  });

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created ready payment order id: ${createResult.order.paymentOrderId}`);

  const paidResult = await markTossPaymentOrderPaid({
    providerOrderId: createResult.order.providerOrderId,
    providerPaymentId: `toss_payment_snapshot_smoke_${runId}`,
    amount: 990,
    currency: "KRW",
    client: paidClient,
  });

  if (!paidResult.ok) {
    throw createSmokeError(paidResult.error.code);
  }

  writeStatus(`marked paid payment order id: ${paidResult.order.paymentOrderId}`);

  const fulfillmentResult = await fulfillPaidPaymentOrder({
    providerOrderId: paidResult.order.providerOrderId,
    client: fulfillmentClient,
  });

  if (!fulfillmentResult.ok) {
    throw createSmokeError(fulfillmentResult.error.code);
  }

  writeStatus(`fulfilled report id: ${fulfillmentResult.fulfillment.reportId}`);

  const savedSnapshot = await saveComprehensiveReportDraftSnapshot({
    supabaseUrl,
    supabaseAnonKey,
    reportId: fulfillmentResult.fulfillment.reportId,
    providerOrderId: fulfillmentResult.fulfillment.providerOrderId,
    draft: createSafeSampleDraft(),
    generationModel: "sample-model",
  });

  writeStatus(`saved snapshot report id: ${savedSnapshot.reportId}`);
  writeStatus(`snapshot version: ${savedSnapshot.snapshotVersion}`);
  writeStatus(`status: ${savedSnapshot.status}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${
      error instanceof Error
        ? error.message
        : "Save comprehensive report draft snapshot smoke failed."
    }\n`,
  );
  process.exitCode = 1;
});
