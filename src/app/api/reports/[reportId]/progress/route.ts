import { NextResponse, type NextRequest } from "next/server";
import { readGenerationProgress } from "../../../../../components/report/generationProgressServer";
import type { AccountPort } from "../../../../../lib/account/handler";

/**
 * 생성 대기 화면이 묻는 진행 상태(읽기 전용, W3 P2 30분 결론). 응답 모양은 GenerationProgress
 * (state · stage · origin · attempt · chapters · serverNow · startedAt)뿐 — 원고·사유·비용·금액·결제 키는 내보내지 않는다.
 * 결제 책은 Book 주소를 아는 사람이 이미 볼 수 있는 대기 화면과 같은 정보. 이용권 책은 로그인한 주인에게만(아니면 unknown).
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ reportId: string }> }) {
  let auth: AccountPort | null = null;
  // 이용권 책일 때만 로그인 회원을 확인한다(결제 책 조회에는 계정 호출이 없다).
  const ticketOwner = async () => {
    const [{ createAccountPort }, { ticketReaderId }] = await Promise.all([import("../../../../../lib/account/supabase"), import("../../../../../lib/tickets/ownerRead")]);
    auth = createAccountPort(request);
    return auth ? ticketReaderId(auth) : null;
  };
  const progress = await readGenerationProgress((await context.params).reportId ?? "", { ticketOwner });
  const response = NextResponse.json(progress, { headers: { "cache-control": "no-store" } });
  return (auth as AccountPort | null)?.finish(response) ?? response;
}
