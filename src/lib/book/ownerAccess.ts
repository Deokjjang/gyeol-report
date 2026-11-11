import "server-only";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createAccountPort } from "../account/supabase";
import { createLibraryPort } from "../library/supabase";
import { mayShareBook } from "./shareServer";
import { mayReadOwnedBooks } from "../account/policy";
import { claimCookieName, claimHash } from "../library/server";
import { sharePort } from "../sharing/reportShareStore";
import { readOwnedTicketReport, type TicketOwnerRead } from "../tickets/ownerRead";
import { createTicketStore } from "../tickets/supabase";

export async function loadOwnedTicketBook(reportId: string): Promise<TicketOwnerRead> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    return auth ? readOwnedTicketReport(reportId, auth, createTicketStore()) : { kind: "storageError" };
  } catch { return { kind: "storageError" }; }
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
