import { normalizeReportInputPayload } from "../../../../lib/report-generation/reportInputAdapter";
import { DAYUN_UNCERTAIN_MESSAGE } from "../../../../lib/saju/customerDayun";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Calculation-only readiness check. Never generates a report or prepares an order.
export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  try {
    const text = await request.text();
    if (text.length > 16_384) return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
    const payload: unknown = JSON.parse(text);
    if (!payload || typeof payload !== "object" || !("productKey" in payload) ||
        (payload.productKey !== "major_fortune" && payload.productKey !== "annual_fortune")) {
      return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
    }
    const result = normalizeReportInputPayload(payload);
    if (!result.ok) {
      const message = result.error === "DAYUN_GENDER_REQUIRED" ? "성별을 선택해 주세요."
        : result.error === "DAYUN_UNCERTAIN" || result.error === "BIRTH_TIME_UNCERTAIN" ? DAYUN_UNCERTAIN_MESSAGE
        : result.error === "DAYUN_CYCLE_UNAVAILABLE" ? "선택한 연도에 제공할 대운 구간이 없습니다. 입력 정보를 확인해 주세요."
        : "리포트 입력 정보를 확인해 주세요.";
      return Response.json({ ok: false, message }, { status: 400, headers });
    }
    return Response.json({ ok: true }, { headers });
  } catch {
    return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
  }
}
