import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession } from "../account/policy";
import { opsOriginAllowed } from "../ops/origin";
import { readWallet } from "../ops/gift/service";
import { giftEventWindow } from "../ops/config";
import type { OpsStores } from "../ops/store";
import type { LibraryPort } from "./server";
import { buildShelf, RESULT_DAYS_MS, type ShelfOrder, type ShelfPending, type ShelfRequest } from "./shelf";

/** W3 P2: 이용권을 돌려준 책(접수 뒤 7일 안) — 서재에 「이용권을 돌려드렸어요」 카드로 남긴다. 읽기 전용(회원 id로 거른다), 못 읽으면 빈 목록. */
export async function returnedTicketBooks(db: OpsStores["db"], userId: string, now: number): Promise<ShelfPending[]> {
  if (!db) return [];
  try {
    const r = await db.from("report_ticket_redemptions").select("report_id,product_type,state,created_at,display_name").eq("user_id", userId).eq("state", "REVERSED")
      .gte("created_at", new Date(now - RESULT_DAYS_MS).toISOString()).order("created_at", { ascending: false }).limit(20).abortSignal(AbortSignal.timeout(10_000));
    if (r.error || !Array.isArray(r.data)) return [];
    return (r.data as { report_id: string; product_type: string; state: string; created_at: string; display_name: string | null }[])
      .map(x => ({ reportId: x.report_id, productType: x.product_type, state: x.state, createdAt: x.created_at, displayName: x.display_name ?? "" }));
  } catch { return []; }
}

/**
 * 서재 한 번에 받기(P 속도 + P 추가 F): GET /auth/library-home.
 * 예전에는 화면이 세션 확인 뒤 목록·이용권·구매 내역·선물·보상·가입 정보를 7번 따로 불렀고, 부를 때마다 로그인 확인(getUser)부터 다시 했다.
 * 이제 로그인 확인 1번 + 조회 6개를 동시에(목록·주문·만드는 중·이용권 지갑·문의 결과(운영 Q)·이용권 반환(W3 P2)). 책 본문(snapshot)은 받지 않는다 — 책을 열 때만 받는다.
 * Server-Timing: auth(로그인·계정 확인) / data(조회 4개 동시) — 운영에서 브라우저 개발자 도구로 구간 시간을 본다.
 */
export async function handleLibraryHome(request: NextRequest, auth: AccountPort, library: LibraryPort, ops: Pick<OpsStores, "order" | "gift" | "notify"> & Partial<Pick<OpsStores, "db">>, now = Date.now()): Promise<NextResponse> {
  const t0 = performance.now();
  const headers = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie", "Referrer-Policy": "no-referrer" };
  const json = (body: object, status = 200, timing?: string) => auth.finish(NextResponse.json(body, { status, headers: timing ? { ...headers, "Server-Timing": timing } : headers }));
  if (request.method !== "GET") return json({}, 405);
  if (!opsOriginAllowed(request)) return json({}, 403);
  try {
    const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : undefined;
    if (snapshot === null) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    if (!user || accountSession(user, snapshot).status !== "member") return json({ ok: false, code: "MEMBER_REQUIRED" }, 401);
    const t1 = performance.now();
    const [rows, orders, pending, wallet, requests, returned] = await Promise.all([
      library.list(user.id),
      ops.order.call("summary", { userId: user.id }),
      ops.order.call("pending_books", { userId: user.id }),
      readWallet(ops.gift, user.id),
      ops.notify.call("card_results", { userId: user.id }).catch(() => ({ ok: false })),
      returnedTicketBooks(ops.db ?? null, user.id, now),
    ]);
    const t2 = performance.now();
    if (!rows || !orders.ok) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    const w = giftEventWindow(process.env, now);
    return json({
      ok: true,
      books: buildShelf(rows, (orders.orders ?? []) as ShelfOrder[], [...(pending.ok ? pending.books ?? [] : []) as ShelfPending[], ...returned], now,
        (requests.ok === true && Array.isArray((requests as { results?: unknown }).results) ? (requests as { results: ShelfRequest[] }).results : [])),
      wallet,
      event: { during: w.phase === "during", endsAt: Number.isFinite(w.endMs) ? new Date(w.endMs - 1000).toISOString() : null },
    }, 200, `auth;dur=${Math.round(t1 - t0)}, data;dur=${Math.round(t2 - t1)}`);
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503); }
}
