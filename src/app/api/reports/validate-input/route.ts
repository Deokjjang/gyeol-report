import { normalizeReportInputPayload } from "../../../../lib/report-generation/reportInputAdapter";
import { DAYUN_UNCERTAIN_MESSAGE } from "../../../../lib/saju/customerDayun";
import { dayunReadiness } from "../../../../lib/saju/dayunReadiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Compatibility allows unknown hours; only a solar-term birth day makes the chart itself undecidable.
const COMPATIBILITY_BIRTH_TIME_UNCERTAIN_MESSAGE = "절기가 바뀌는 날에 태어난 분은 태어난 시각에 따라 사주가 달라집니다. 그분의 태어난 시각을 입력해 주세요.";

// Calculation-only readiness check (Dayun products and compatibility). Never generates a report or prepares an order.
export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  try {
    const text = await request.text();
    if (text.length > 16_384) return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
    const payload: unknown = JSON.parse(text);
    if (!payload || typeof payload !== "object" || !("productKey" in payload) ||
        (payload.productKey !== "major_fortune" && payload.productKey !== "annual_fortune" && payload.productKey !== "saju_mbti_compatibility")) {
      return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
    }
    const result = normalizeReportInputPayload(payload);
    // AM2-4 7부: 대운을 정할 수 없는 생일 — 대략 시간대로 정해지면 시간대를 묻고, 그래도 안 되면 대운 결제 전에 막고 세운을 권한다.
    if (!result.ok && result.error === "DAYUN_UNCERTAIN" && payload.productKey === "major_fortune" && "person" in payload && payload.person && typeof payload.person === "object") {
      const r = dayunReadiness(payload.person as never);
      if (!r.ok) return Response.json({ ok: false, code: r.code, message: r.message, ...(r.code === "DAYUN_NEED_SLOT" ? { slots: r.slots } : { recommend: r.recommend }) }, { status: 400, headers });
    }
    if (!result.ok) {
      const message = result.error === "DAYUN_GENDER_REQUIRED" ? "성별을 선택해 주세요."
        : payload.productKey === "saju_mbti_compatibility" && result.error === "BIRTH_TIME_UNCERTAIN" ? COMPATIBILITY_BIRTH_TIME_UNCERTAIN_MESSAGE
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
