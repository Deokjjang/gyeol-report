import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession } from "../account/policy";
import { opsOriginAllowed } from "../ops/origin";
import { readWallet } from "../ops/gift/service";
import { giftEventWindow } from "../ops/config";
import type { OpsStores } from "../ops/store";
import type { LibraryPort } from "./server";
import { buildShelf, type ShelfOrder, type ShelfPending } from "./shelf";

/**
 * 서재 한 번에 받기(P 속도 + P 추가 F): GET /auth/library-home.
 * 예전에는 화면이 세션 확인 뒤 목록·이용권·구매 내역·선물·보상·가입 정보를 7번 따로 불렀고, 부를 때마다 로그인 확인(getUser)부터 다시 했다.
 * 이제 로그인 확인 1번 + 조회 4개를 동시에(목록·주문·제본 중·이용권 지갑). 책 본문(snapshot)은 받지 않는다 — 책을 열 때만 받는다.
 * Server-Timing: auth(로그인·계정 확인) / data(조회 4개 동시) — 운영에서 브라우저 개발자 도구로 구간 시간을 본다.
 */
export async function handleLibraryHome(request: NextRequest, auth: AccountPort, library: LibraryPort, ops: Pick<OpsStores, "order" | "gift">, now = Date.now()): Promise<NextResponse> {
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
    const [rows, orders, pending, wallet] = await Promise.all([
      library.list(user.id),
      ops.order.call("summary", { userId: user.id }),
      ops.order.call("pending_books", { userId: user.id }),
      readWallet(ops.gift, user.id),
    ]);
    const t2 = performance.now();
    if (!rows || !orders.ok) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    const w = giftEventWindow(process.env, now);
    return json({
      ok: true,
      books: buildShelf(rows, (orders.orders ?? []) as ShelfOrder[], (pending.ok ? pending.books ?? [] : []) as ShelfPending[], now),
      wallet,
      event: { during: w.phase === "during", endsAt: Number.isFinite(w.endMs) ? new Date(w.endMs - 1000).toISOString() : null },
    }, 200, `auth;dur=${Math.round(t1 - t0)}, data;dur=${Math.round(t2 - t1)}`);
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503); }
}
