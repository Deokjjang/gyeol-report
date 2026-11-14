import { NextResponse } from "next/server";
import { salesPausedMessage } from "../../../lib/ops/config";

// W3 P0: 4종 판매 중지 공개 상태(책 고르기·입력 화면이 읽는다). DB 스위치를 10초 기억, 못 읽으면 판매 중으로 답한다.
export const dynamic = "force-dynamic";
export async function GET() {
  const { readSalesPause, SALES_PAUSE_CACHE_MS } = await import("../../../lib/ops/salesPause");
  const state = await readSalesPause({ maxAgeMs: SALES_PAUSE_CACHE_MS }), paused = state?.on === true;
  // W4 Q0: 문구만 이유대로 바꾼다(내부 이유 이름은 보내지 않는다).
  return NextResponse.json(paused ? { paused, message: salesPausedMessage(state?.reason) } : { paused }, { headers: { "cache-control": "no-store" } });
}
