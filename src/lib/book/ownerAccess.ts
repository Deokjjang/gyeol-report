import "server-only";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createAccountPort } from "../account/supabase";
import { createLibraryPort } from "../library/supabase";
import { mayShareBook } from "./shareServer";
import { mayReadOwnedBooks } from "../account/policy";
import { claimCookieName, claimHash } from "../library/server";
import { sharePort } from "../sharing/reportShareStore";
import { readOwnedTicketReport, ticketReaderId, type TicketOwnerRead } from "../tickets/ownerRead";
import { createTicketStore } from "../tickets/supabase";

/** 이 회원의, 이 주소의 이용권 접수 행(service_role 읽기 — 회원 id로 거른다). 없으면 null, 읽기 실패는 예외. */
async function ownTicketRedemption(userId: string, reportId: string): Promise<{ id: string; state: string } | null> {
  const db = (await import("../ops/store")).createOpsStores().db;
  if (!db) throw new Error("STORAGE_UNAVAILABLE");
  const r = await db.from("report_ticket_redemptions").select("id,state").eq("report_id", reportId).eq("user_id", userId).limit(1).abortSignal(AbortSignal.timeout(10_000));
  if (r.error) throw new Error("TICKET_READ_FAILED");
  const row = (r.data as { id?: unknown; state?: unknown }[] | null)?.[0];
  return row && typeof row.id === "string" && typeof row.state === "string" ? { id: row.id, state: row.state } : null;
}
/** W3 P2: 아직 발행 전인 내 이용권 책(만드는 중 · 이용권 반환됨) — 같은 대기 화면을 그린다. */
const PENDING_TICKET_STATES = new Set(["QUEUED", "RUNNING", "REVERSED"]);
const pendingTicket = async (userId: string, reportId: string) => PENDING_TICKET_STATES.has((await ownTicketRedemption(userId, reportId))?.state ?? "");

export async function loadOwnedTicketBook(reportId: string): Promise<TicketOwnerRead> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    return auth ? readOwnedTicketReport(reportId, auth, createTicketStore(), pendingTicket) : { kind: "storageError" };
  } catch { return { kind: "storageError" }; }
}

/** W3 P2 「1장 먼저 읽기」(이용권 책): 지금 로그인한 주인의 발행 전 접수 id. 주인이 아니거나 못 읽으면 null. */
export async function ownedPendingTicketRedemption(reportId: string): Promise<string | null> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request), userId = auth ? await ticketReaderId(auth) : null;
    const row = userId ? await ownTicketRedemption(userId, reportId) : null;
    return row && (row.state === "QUEUED" || row.state === "RUNNING") ? row.id : null;
  } catch { return null; }
}

// The same verified member / purchase capability used by sharing authorizes
// the original book. Knowing a reportId or a share token is not ownership.
export async function canReadPurchasedBook(reportId: string): Promise<boolean> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    return auth ? await mayShareBook(request, reportId, auth, createLibraryPort(), false, sharePort()) : false;
  } catch { return false; }
}

/**
 * AM 7부: 생성 중인 결제 책의 구매자 식별(「1장 먼저 읽기」 주인 확인용). 완성 전에는 claim_report_account가 늘 unavailable이라
 * canReadPurchasedBook이 false다 — 확인된 회원 id와 구매 확인 쿠키 해시만 넘기고, 판정은 am_writer_progress(owner)가 구매 묶음으로 한다.
 */
export async function purchaserOf(reportId: string): Promise<{ readonly userId: string | null; readonly claimHash: string | null }> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    const user = auth ? await auth.currentUser() : null, account = user && auth ? await auth.read(user) : undefined;
    const member = user && account !== null && mayReadOwnedBooks(user, account) ? user : null;
    const order = await createLibraryPort().orderForReport(reportId);
    const secret = order ? request.cookies.get(claimCookieName(order, false))?.value : undefined;
    return { userId: member?.id ?? null, claimHash: secret && /^[a-f0-9]{64}$/.test(secret) ? claimHash(secret) : null };
  } catch { return { userId: null, claimHash: null }; }
}
