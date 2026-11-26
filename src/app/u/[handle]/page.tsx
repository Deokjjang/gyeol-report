import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { mirrorPublicEnabled } from "../../../lib/mirror/gate";
import { handleProblem, normalizeHandle } from "../../../lib/mirror/profileRules";

// 「남이 본 나」 링크 랜딩(gyeolreport.com/@아이디 → src/proxy.ts가 여기로 넘김). 명령 1/3은 빈 화면만, 내용은 명령 2(D3).
// Next에서 폴더 이름 @는 병렬 라우트라 /u/[handle]에 두고, 주소창에는 /@아이디가 그대로 보인다.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function MirrorLanding({ params }: { params: Promise<{ handle: string }> }) {
  if (!mirrorPublicEnabled()) notFound();
  const raw = decodeURIComponent((await params).handle), handle = normalizeHandle(raw);
  if (handleProblem(handle) && handleProblem(handle) !== "reserved") notFound();
  const { createMirrorStore } = await import("../../../lib/mirror/store");
  const store = createMirrorStore();
  const found = store ? await store.resolveHandle(handle) : null;
  if (!found) notFound();
  // 대문자로 들어왔거나 예전 아이디면 지금 아이디 주소로 옮긴다.
  if (found.status === "moved") permanentRedirect(`/@${found.handle}`);
  if (raw !== handle) permanentRedirect(`/@${handle}`);
  return <main data-mirror-landing={handle} style={{ minHeight: "100dvh", background: "#000" }} />;
}
