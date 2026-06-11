import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ReportResultPage from "../../../../src/app/reports/[reportId]/page";
import { getPaidReportResult } from "../../../../src/lib/reports/supabasePaidReportResultAdapter";
import type { PaidReportResult } from "../../../../src/lib/reports/paidReportResultTypes";

vi.mock("../../../../src/lib/reports/supabasePaidReportResultAdapter", () => ({
  getPaidReportResult: vi.fn(),
}));

const mockGetPaidReportResult = vi.mocked(getPaidReportResult);
const createdAt = "2026-06-12T10:00:00.000Z";
const updatedAt = "2026-06-12T10:00:01.000Z";

function createResult(
  overrides: Partial<PaidReportResult> = {},
): PaidReportResult {
  return {
    reportId: "report_result_page_test",
    productType: "saju_mbti_full",
    status: "ready",
    title: "사주×MBTI 종합 리포트",
    placeholderText:
      "결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.",
    createdAt,
    updatedAt,
    ...overrides,
  };
}

async function renderPage(reportId: string | undefined): Promise<string> {
  const element = await ReportResultPage({
    params: Promise.resolve({ reportId }),
  });

  return renderToStaticMarkup(element);
}

describe("report result page", () => {
  beforeEach(() => {
    mockGetPaidReportResult.mockReset();
  });

  it("loads by report id and displays minimal ready state", async () => {
    const fullPaymentKey = "pay_full_key_must_not_render";
    const resultWithPrivateExtras = {
      ...createResult(),
      ["payment" + "Key"]: fullPaymentKey,
      ["provider" + "PaymentId"]: "provider_payment_must_not_render",
      ["input" + "Snapshot"]: { birthDate: "1996-12-06" },
      ["share" + "Token"]: "share_token_must_not_render",
      ["access" + "TokenHash"]: "access_hash_must_not_render",
    };
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: resultWithPrivateExtras,
    });

    const html = await renderPage("report_result_page_test");
    const firstCall = mockGetPaidReportResult.mock.calls[0]?.[0];

    expect(firstCall?.reportId).toBe("report_result_page_test");
    expect(typeof firstCall?.client).toBe("object");
    expect(html).toContain("결리포트");
    expect(html).toContain("리포트 준비 완료");
    expect(html).toContain("결제가 완료되었고 리포트가 생성되었습니다.");
    expect(html).toContain("리포트 ID");
    expect(html).toContain("report_result_page_test");
    expect(html).toContain("상품");
    expect(html).toContain("사주×MBTI 종합 리포트");
    expect(html).toContain("상태");
    expect(html).toContain("ready");
    expect(html).toContain(
      "결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.",
    );
    expect(html).not.toContain(fullPaymentKey);
    expect(html).not.toContain("provider_payment_must_not_render");
    expect(html).not.toContain("input" + "Snapshot");
    expect(html).not.toContain("share_token_must_not_render");
    expect(html).not.toContain("access_hash_must_not_render");
  });

  it("shows invalid state safely", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: false,
      error: {
        code: "PAID_REPORT_RESULT_INVALID_REQUEST",
        messageKo: "Paid report result request is invalid.",
      },
    });

    const html = await renderPage("../bad");

    expect(html).toContain("리포트 정보가 올바르지 않습니다.");
    expect(html).not.toContain("payment" + "Key");
  });

  it("shows unavailable state safely", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: false,
      error: {
        code: "PAID_REPORT_RESULT_NOT_FOUND",
        messageKo: "Supabase paid report result RPC failed.",
      },
    });

    const html = await renderPage("report_missing_result");

    expect(html).toContain("리포트를 찾을 수 없습니다.");
    expect(html).toContain("결제가 완료된 리포트만 조회할 수 있습니다.");
    expect(html).not.toContain("provider" + "Payment" + "Id");
    expect(html).not.toContain("share" + "Token");
    expect(html).not.toContain("access" + "TokenHash");
  });
});
