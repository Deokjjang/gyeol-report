import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession } from "../account/policy";
import { claimCookieName, claimHash, type LibraryPort } from "../library/server";
import { issuePublishedReportShare, loadSharedReport, validShareReportId, sharePort, type ShareStorePort } from "../sharing/reportShareStore";
import type { ReportGenerationInput } from "../report-generation/reportInputAdapter";
import { validateBookPublication, storedBook } from "./storedReport";
import { projectBookShare } from "./shareModel";
import type { ReferralStore } from "../referrals/service";

export const BOOK_SHARE_HEADERS = { "Cache-Control": "private, no-store, max-age=0", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow, noarchive", "Vary": "Cookie" };
export async function loadBookShare(token: string, port?: ShareStorePort) {
  const shared = await loadSharedReport(token, validateBookPublication, port);
  if (!shared || shared.snapshot.productVersion !== "v4") return null;
  // The stored-version validator above already verified the complete sealed packet.
  const { input } = shared.snapshot.evidencePacket as { input: ReportGenerationInput };
  // Compatibility external preview follows the existing A-only name policy.
  const names = input.kind === "compatibility" ? input.personA.name : input.person.name;
  const selectedYear = input.productOptions.selectedYear;
  const model = projectBookShare({ productType: shared.snapshot.productType, names, selectedYear,
    shareUrl: shared.share.url, publishedAt: shared.snapshot.createdAtIso, expiresAt: shared.expiresAt });
  return model?.isShareable ? { snapshot: shared.snapshot, model } : null;
}
export async function loadSharedBookData(token: string, port?: ShareStorePort) {
  const shared = await loadBookShare(token, port);
  if (!shared) return null;
  const book = storedBook(shared.snapshot);
  return book ? { data: book.data, share: shared.model } : null;
}
// Read-only reuse of 9C purchase authority. A share credential never proves ownership.
export async function mayShareBook(request: NextRequest, reportId: string, auth: AccountPort, library: LibraryPort, local: boolean, port?: ShareStorePort) {
  const user = await auth.currentUser(), account = user ? await auth.read(user) : undefined;
  if (account === null) return false;
  const member = user && accountSession(user, account).status === "member" ? user : null;
  if(member&&port?.owned&&await port.owned(reportId,member.id))return true;
  const order = await library.orderForReport(reportId);
  const secret = order ? request.cookies.get(claimCookieName(order, local))?.value : undefined;
  const hash = secret && /^[a-f0-9]{64}$/.test(secret) ? claimHash(secret) : null;
  const state = await library.claim(reportId, member?.id ?? null, hash, false);
  return state === "owned" || state === "claimable";
}
export async function prepareBookShare(request: NextRequest, auth: AccountPort, library: LibraryPort, port: ShareStorePort = sharePort(), local = false, referrals?: ReferralStore) {
  const json = (body: object, status: number) => auth.finish(NextResponse.json(body, { status, headers: BOOK_SHARE_HEADERS }));
  const url = new URL(request.url); if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  if (request.method !== "POST") return json({}, 405);
  if (request.headers.get("origin") !== (local ? url.origin : "https://gyeolreport.com")) return json({}, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 1024) return json({}, 413);
  try {
    const raw = await request.text(); if (raw.length > 1024) return json({}, 413);
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some(k => k !== "reportId") || !validShareReportId(body.reportId)) return json({}, 400);
    if (!await mayShareBook(request, body.reportId, auth, library, local, port)) return json({}, 403);
    const result = await issuePublishedReportShare(body.reportId, (p, d, e) =>
      typeof d === "object" && d !== null && "productVersion" in d && d.productVersion === "v4" ? validateBookPublication(p, d, e) : { ok: false, errors: ["V4_REQUIRED"] }, port);
    if (!result.ok) return json({}, 404);
    const token = new URL(result.data.url).pathname.slice(3), shared = await loadBookShare(token, port);
    if (!shared || !await mayShareBook(request, body.reportId, auth, library, local, port)) return json({}, 403);
    const model = referrals ? await (await import("../referrals/service")).attachReferral(shared.model, body.reportId, shared.snapshot, auth, referrals) : shared.model;
    return json({ model }, 200);
  } catch { return json({ error: "공유 링크를 준비하지 못했습니다. 다시 시도해 주세요." }, 503); }
}
