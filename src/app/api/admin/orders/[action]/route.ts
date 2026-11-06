import type { NextRequest } from "next/server";
import { defaultAdminDeps, handleAdminAction } from "../../../../../lib/ops/admin/actions";

// 관리자 작업(재생성·이용권·환불·문의 처리·공급자 스위치). 같은 출처 + ADMIN_USER_IDS를 매번 다시 확인한다.
export const dynamic = "force-dynamic";
// 환불은 토스 조회·취소(각 15초 상한)를 한 번에 처리한다.
export const maxDuration = 60;

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  return handleAdminAction(request, (await context.params).action, defaultAdminDeps());
}
