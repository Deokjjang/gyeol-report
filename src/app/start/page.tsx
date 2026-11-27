import { notFound, redirect } from "next/navigation";
import { mirrorRootEnabled, mirrorRoutesEnabled } from "../../lib/mirror/gate";
import { MirrorEntry } from "../../components/mirror/MirrorEntry";

// 「남이 본 나」 새 시작 주소(명령 3/3). 숨은 공개(routes 관문만)에서는 여기서 로그인 → 프로필 → 질문지 → 홈이 열린다.
// 정식 공개(root 관문까지) 뒤에는 "/"가 이 서비스라 "/"로 보낸다(쿼리 — 「친구에게 물어보기」 ?ask=1 · 인앱 넘김 ?h= — 는 그대로). 관문이 닫혀 있으면 404.
export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function StartPage({ searchParams }: Props) {
  if (!mirrorRoutesEnabled()) notFound();
  if (mirrorRootEnabled()) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(await searchParams)) if ((k === "ask" || k === "h") && typeof v === "string") q.set(k, v);
    redirect(q.size ? `/?${q}` : "/");
  }
  return <MirrorEntry appPath="/start" />;
}
