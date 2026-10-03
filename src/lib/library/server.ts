import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession } from "../account/policy";
import { libraryItem, purchaseMetadata, validLibraryReportId, type ClaimState, type LibraryRow } from "./model";

export type PurchaseBinding = { orderId: string; buyerId: string | null; claimHash: string | null; displayName: string; selectedYear: string | null };
export type LibraryPort = {
  bind(binding: PurchaseBinding): Promise<boolean>;
  orderForReport(reportId: string): Promise<string | null>;
  claim(reportId: string, userId: string | null, hash: string | null, commit: boolean): Promise<ClaimState>;
  list(userId: string): Promise<LibraryRow[] | null>;
};
export const CLAIM_COOKIE_SECONDS = 7 * 24 * 60 * 60; // capability lifetime, NOT report retention
export const claimHash = (secret: string) => createHash("sha256").update(secret).digest("hex");
export const claimCookieName = (orderId: string, local: boolean) => `${local ? "gyeol-local-claim-" : "__Host-gyeol-claim-"}${claimHash(orderId).slice(0, 24)}`;

// Internal hook after ready-order persistence and BEFORE returning provider checkout.
// The caller cannot provide buyerId or proof; identity is verified again here.
export async function bindCheckout(request: NextRequest, response: NextResponse, orderId: string, payload: unknown, auth: AccountPort, port: LibraryPort, local = false): Promise<NextResponse | null> {
  const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : undefined;
  if (snapshot === null) return null;
  const buyer = user && accountSession(user, snapshot).status === "member" ? user.id : null;
  const secret = buyer ? null : randomBytes(32).toString("hex");
  if (!await port.bind({ orderId, buyerId: buyer, claimHash: secret ? claimHash(secret) : null, ...purchaseMetadata(payload) })) return null;
  response.headers.set("Cache-Control", "private, no-store"); response.headers.set("Vary", "Cookie");
  if (secret) response.cookies.set(claimCookieName(orderId, local), secret, { httpOnly: true, secure: !local, sameSite: "lax", path: "/", maxAge: CLAIM_COOKIE_SECONDS });
  return auth.finish(response);
}

export async function handleLibrary(request: NextRequest, action: string, auth: AccountPort, port: LibraryPort, local = false): Promise<NextResponse> {
  const headers = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie", "Referrer-Policy": "no-referrer" };
  const json = (body: object, status = 200) => auth.finish(NextResponse.json(body, { status, headers }));
  if (!["list", "status", "claim"].includes(action)) return json({}, 404);
  if (request.method !== (action === "claim" ? "POST" : "GET")) return json({}, 405);
  const url = new URL(request.url);
  if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  if (action === "claim" && request.headers.get("origin") !== (local ? url.origin : "https://gyeolreport.com")) return json({}, 403);
  try {
    const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : undefined;
    if (snapshot === null) return json({ error: "서재를 확인하지 못했습니다. 다시 시도해 주세요." }, 503);
    const member = user && accountSession(user, snapshot).status === "member" ? user : null;
    if (action === "list") {
      if (!member) return json({}, 401);
      const rows = await port.list(member.id);
      return rows ? json({ items: rows.map(r => libraryItem(r, local)).filter(Boolean) }) : json({}, 503);
    }
    let reportId: unknown = url.searchParams.get("reportId");
    if (action === "claim") {
      if (!member) return json({}, 401);
      if (Number(request.headers.get("content-length") ?? 0) > 1024) return json({}, 413);
      const raw = await request.text();
      if (raw.length > 1024) return json({}, 413);
      let body: Record<string, unknown>;
      try { body = JSON.parse(raw); } catch { return json({}, 400); }
      if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some(k => k !== "reportId")) return json({}, 400);
      reportId = body.reportId;
    }
    if (!validLibraryReportId(reportId, local)) return json({}, 400);
    const order = await port.orderForReport(reportId);
    const secret = order ? request.cookies.get(claimCookieName(order, local))?.value : undefined;
    const hash = secret && /^[a-f0-9]{64}$/.test(secret) ? claimHash(secret) : null;
    const state = await port.claim(reportId, member?.id ?? null, hash, action === "claim");
    // No order ID, auth ID, hash, paymentKey or capability in JSON.
    return action === "claim" ? json(state === "owned" ? { ok: true } : { error: "이 책을 서재에 보관할 수 없습니다." }, state === "owned" ? 200 : 403)
      : json({ state, needsLogin: !member });
  } catch { return json({ error: "서재를 확인하지 못했습니다. 다시 시도해 주세요." }, 503); }
}
