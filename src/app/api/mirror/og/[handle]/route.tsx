import { NextResponse, type NextRequest } from "next/server";
import { mirrorPublicEnabled } from "../../../../../lib/mirror/gate";
import { handleProblem, normalizeHandle } from "../../../../../lib/mirror/profileRules";

// 「남이 본 나」 링크 미리보기 이미지(/@아이디의 og:image · 카카오 공유 카드 이미지). 공개 관문 뒤 — 닫혀 있으면 404.
// 사진은 쓰지 않는다. 지금 아이디만(예전 · 탈퇴 아이디는 404).
export async function GET(_request: NextRequest, context: { params: Promise<{ handle: string }> }) {
  if (!mirrorPublicEnabled()) return new NextResponse(null, { status: 404 });
  const handle = normalizeHandle(decodeURIComponent((await context.params).handle).replace(/\.png$/, ""));
  if (handleProblem(handle) && handleProblem(handle) !== "reserved") return new NextResponse(null, { status: 404 });
  const [{ landingData }, { renderMirrorOg }] = await Promise.all([import("../../../../../lib/mirror/landing"), import("../../../../../lib/mirror/og")]);
  const found = await landingData(handle).catch(() => null);
  if (!found || found.status !== "found") return new NextResponse(null, { status: 404 });
  const d = found.data;
  return renderMirrorOg({ name: d.name, handle: d.handle, title: d.title, sync: d.sync, friends: d.friends, showCount: d.showCount, line: d.line, shape: d.shape });
}
