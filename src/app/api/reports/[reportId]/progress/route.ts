import { NextResponse } from "next/server";
import { readGenerationProgress } from "../../../../../components/report/generationProgressServer";

/**
 * 생성 대기 화면이 10초마다 묻는 진행 상태(읽기 전용, v5 최종 2-1 #7). Book 주소를 아는 사람이 이미 볼 수 있는
 * 대기 화면과 같은 정보(상태·단계·다음 시도 시각)만 돌려준다. 원고·사유·비용·주문 정보는 내보내지 않는다.
 */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ reportId: string }> }) {
  const progress = await readGenerationProgress((await context.params).reportId ?? "");
  return NextResponse.json(progress, { headers: { "cache-control": "no-store" } });
}
