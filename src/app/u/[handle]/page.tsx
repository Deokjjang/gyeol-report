import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { mirrorPublicEnabled } from "../../../lib/mirror/gate";
import { handleProblem, normalizeHandle } from "../../../lib/mirror/profileRules";

// 「남이 본 나」 링크 랜딩(gyeolreport.com/@아이디 → src/proxy.ts가 여기로 넘김). 명령 2/3: 친구 응답 흐름(D3) + 링크 미리보기(D4).
// Next에서 폴더 이름 @는 병렬 라우트라 /u/[handle]에 두고, 주소창에는 /@아이디가 그대로 보인다.
// 없는 아이디 · 탈퇴한 아이디는 404, 예전 아이디는 지금 아이디로 영구 이동.
export const dynamic = "force-dynamic";
type Params = { params: Promise<{ handle: string }> };

async function lookup(params: Params["params"]) {
  if (!mirrorPublicEnabled()) notFound();
  const raw = decodeURIComponent((await params).handle), handle = normalizeHandle(raw);
  if (handleProblem(handle) && handleProblem(handle) !== "reserved") notFound();
  const { landingData } = await import("../../../lib/mirror/landing");
  const found = await landingData(handle);
  if (!found) notFound();
  if (found.status === "moved") permanentRedirect(`/@${found.handle}`);
  if (raw !== handle) permanentRedirect(`/@${handle}`);
  return found.data;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  if (!mirrorPublicEnabled()) return { robots: { index: false, follow: false } };
  const d = await lookup(params);
  const image = `/api/mirror/og/${d.handle}`, description = "질문 12개 · 1분 · 이름은 남지 않아요";
  return {
    title: `${d.title} · 결리포트`, description, robots: { index: false, follow: false },
    openGraph: { title: d.title, description, url: `/@${d.handle}`, images: [{ url: image, width: 1200, height: 630, alt: d.title }], type: "website", siteName: "결리포트" },
    twitter: { card: "summary_large_image", title: d.title, description, images: [image] },
  };
}

export default async function MirrorLanding({ params }: Params) {
  if (!mirrorPublicEnabled()) notFound();
  const d = await lookup(params);
  const { FriendEntry } = await import("../../../components/mirror/friend/FriendEntry");
  return <main data-mirror-landing={d.handle} style={{ minHeight: "100dvh", background: "#000" }}>
    <FriendEntry handle={d.handle} name={d.name} line={d.line} shape={d.shape} />
  </main>;
}
