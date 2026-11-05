import { NextResponse } from "next/server";
import { giftEventPublicView } from "../../../lib/ops/config";

// 1+1 이벤트 공개 정보(최종 A 13): 메인 배너 타이머·팝업 ①·결제 영수증 한 줄이 서버 시각으로 기간을 판단한다. 보상 이야기는 없다.
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json(giftEventPublicView(), { headers: { "cache-control": "no-store" } });
}
