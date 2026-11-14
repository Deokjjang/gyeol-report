import { NextResponse } from "next/server";
import { SALES_PAUSED_MESSAGE } from "../../../lib/ops/config";

// W3 P0: 4종 판매 중지 공개 상태(책 고르기·입력 화면이 읽는다). DB 스위치를 10초 기억, 못 읽으면 판매 중으로 답한다.
export const dynamic = "force-dynamic";
export async function GET() {
  const { readSalesPause, SALES_PAUSE_CACHE_MS } = await import("../../../lib/ops/salesPause");
  const paused = (await readSalesPause({ maxAgeMs: SALES_PAUSE_CACHE_MS }))?.on === true;
  return NextResponse.json(paused ? { paused, message: SALES_PAUSED_MESSAGE } : { paused }, { headers: { "cache-control": "no-store" } });
}
