import { dayunReadiness } from "../../../../lib/saju/dayunReadiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AM2-4 7부 입력 단계 대운 판정(계산만 — 주문·생성 없음): 대운 입력 첫 쪽에서 출생 시각을 「모름·대략」으로 고르면 부른다.
 * 응답: { ok: true } | { ok: false, code: "DAYUN_NEED_SLOT", slots } | { ok: false, code: "DAYUN_UNDETERMINABLE", recommend: "annual_fortune" }.
 * 결제·주문 서버(payment-checkout/prepare)도 같은 엔진 판정(normalizeReportInputPayload)으로 대운을 거절한다 — 이 응답은 안내용.
 */
export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  try {
    const text = await request.text();
    if (text.length > 4_096) return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
    const p = JSON.parse(text) as Record<string, unknown>;
    if (!p || typeof p !== "object" || typeof p.birthDate !== "string" || (p.gender !== "MALE" && p.gender !== "FEMALE")) return Response.json({ ok: true }, { headers });
    const r = dayunReadiness({ birthDate: p.birthDate, birthTime: typeof p.birthTime === "string" ? p.birthTime : "", birthTimeUnknown: p.birthTimeUnknown === true, approximateBirthTimeSlot: typeof p.approximateBirthTimeSlot === "string" ? p.approximateBirthTimeSlot : "", gender: p.gender, name: "" });
    return Response.json(r, { headers });
  } catch {
    return Response.json({ ok: false, message: "입력 정보를 확인해 주세요." }, { status: 400, headers });
  }
}
