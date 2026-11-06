import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession, mayReadOwnedBooks } from "../account/policy";
import { isPublicSameOrigin } from "../account/origin";
import { claimCookieName, claimHash, type LibraryPort } from "../library/server";
import { issuePublishedReportShare, loadSharedReport, validShareReportId, sharePort, type ShareStorePort } from "../sharing/reportShareStore";
import type { ReportGenerationInput } from "../report-generation/reportInputAdapter";
import { validateBookPublication, storedBook } from "./storedReport";
import { projectBookShare } from "./shareModel";
import type { V5BookDraft, V5Evidence } from "../writer/book";

export const BOOK_SHARE_HEADERS = { "Cache-Control": "private, no-store, max-age=0", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow, noarchive", "Vary": "Cookie" };
/** 공유 링크로 여는 책: V4 Book과 v5(작가 원고) Book. 그 밖의 저장본(V3 등)은 책 공유가 아니다. */
export const isShareableBookVersion = (version: unknown): version is "v4" | "v5" => version === "v4" || version === "v5";
// hotfix-share: 예전에는 "v4"만 받아 v5 책(2026-11-06 출시)의 링크 발급이 V4_REQUIRED → 404로 막혔다.
const validateShareableBook: typeof validateBookPublication = (product, draft, evidence) =>
  typeof draft === "object" && draft !== null && "productVersion" in draft && isShareableBookVersion(draft.productVersion)
    ? validateBookPublication(product, draft, evidence) : { ok: false, errors: ["BOOK_VERSION_REQUIRED"] };
export async function loadBookShare(token: string, port?: ShareStorePort) {
  const shared = await loadSharedReport(token, validateBookPublication, port);
  if (!shared || !isShareableBookVersion(shared.snapshot.productVersion)) return null;
  // The stored-version validator above already verified the complete sealed packet.
  // Compatibility external preview follows the existing A-only name policy(v5도 열람 화면 storedBook과 같은 첫 사람·제목 연도).
  let names: string, selectedYear: string | undefined;
  if (shared.snapshot.productVersion === "v5") {
    const e = shared.snapshot.evidencePacket as V5Evidence, d = shared.snapshot.draft as unknown as V5BookDraft;
    names = e.people[0]?.name ?? e.names; selectedYear = d.title.match(/\d{4}/)?.[0];
  } else {
    const { input } = shared.snapshot.evidencePacket as { input: ReportGenerationInput };
    names = input.kind === "compatibility" ? input.personA.name : input.person.name; selectedYear = input.productOptions.selectedYear;
  }
  const model = projectBookShare({ productType: shared.snapshot.productType, names, selectedYear,
    shareUrl: shared.share.url, publishedAt: shared.snapshot.createdAtIso, expiresAt: shared.expiresAt });
  return model?.isShareable ? { snapshot: shared.snapshot, model } : null;
}
export async function loadSharedBookData(token: string, port?: ShareStorePort) {
  const shared = await loadBookShare(token, port);
  if (!shared) return null;
  const book = storedBook(shared.snapshot);
  return book ? { data: book.data, share: shared.model, ...(book.edition ? { edition: book.edition } : {}) } : null;
}
// Read-only reuse of 9C purchase authority. A share credential never proves ownership.
// readOnly(최종판3 1-7): 산 책 열람만 할 때는 예전 동의로도 소유를 확인한다(공유 링크 발급은 현재 약관 동의 회원만).
export async function mayShareBook(request: NextRequest, reportId: string, auth: AccountPort, library: LibraryPort, local: boolean, port?: ShareStorePort, readOnly = false) {
  const user = await auth.currentUser(), account = user ? await auth.read(user) : undefined;
  if (account === null) return false;
  const member = user && (readOnly ? mayReadOwnedBooks(user, account) : accountSession(user, account).status === "member") ? user : null;
  if(member&&port?.owned&&await port.owned(reportId,member.id))return true;
  const order = await library.orderForReport(reportId);
  const secret = order ? request.cookies.get(claimCookieName(order, local))?.value : undefined;
  const hash = secret && /^[a-f0-9]{64}$/.test(secret) ? claimHash(secret) : null;
  const state = await library.claim(reportId, member?.id ?? null, hash, false);
  return state === "owned" || state === "claimable";
}
// 책 주인에게만, 같은 책은 같은 링크(report_share_links report_id 하나). 추천(referral) 초대 토큰은 붙이지 않는다 —
// 친구 보너스는 삭제됐고(P 추가 C), 공유는 추천 저장소가 실패해도 끊기지 않아야 한다(hotfix-share).
export async function prepareBookShare(request: NextRequest, auth: AccountPort, library: LibraryPort, port: ShareStorePort = sharePort(), local = false) {
  const json = (body: object, status: number) => auth.finish(NextResponse.json(body, { status, headers: BOOK_SHARE_HEADERS }));
  const url = new URL(request.url); if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  if (request.method !== "POST") return json({}, 405);
  if (!(local ? request.headers.get("origin") === url.origin : isPublicSameOrigin(request))) return json({}, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 1024) return json({}, 413);
  try {
    const raw = await request.text(); if (raw.length > 1024) return json({}, 413);
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some(k => k !== "reportId") || !validShareReportId(body.reportId)) return json({}, 400);
    if (!await mayShareBook(request, body.reportId, auth, library, local, port)) return json({}, 403);
    const result = await issuePublishedReportShare(body.reportId, validateShareableBook, port);
    if (!result.ok) return json({}, 404);
    const token = new URL(result.data.url).pathname.slice(3), shared = await loadBookShare(token, port);
    if (!shared || !await mayShareBook(request, body.reportId, auth, library, local, port)) return json({}, 403);
    return json({ model: shared.model }, 200);
  } catch { return json({ error: "공유 링크를 준비하지 못했습니다. 다시 시도해 주세요." }, 503); }
}
