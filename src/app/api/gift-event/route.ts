import { NextResponse } from "next/server";
import { giftEventPublicView, signupPublicView } from "../../../lib/ops/config";

// 1+1 이벤트 공개 정보(최종 A 13): 메인 배너 타이머·팝업 ①·결제 영수증 한 줄이 서버 시각으로 기간을 판단한다. 보상 이야기는 없다.
export const dynamic = "force-dynamic";
// F: 가입 이용권 캠페인 공개 상태(기간 + DB 켜짐/꺼짐, 30초 기억)도 함께 — 메인 띠·/free가 쓴다.
export async function GET() {
  const { createOpsStores } = await import("../../../lib/ops/store");
  const { signupGrantOn } = await import("../../../lib/ops/gift/service");
  const on = await signupGrantOn(createOpsStores().signup);
  return NextResponse.json({ ...giftEventPublicView(), signup: signupPublicView(on) }, { headers: { "cache-control": "no-store" } });
}
