import "server-only";
import type { AccountPort } from "../account/handler";
import { mayReadOwnedBooks } from "../account/policy";
import type { TicketStore } from "./service";
import { isProductPreviewSnapshot, type ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectV4Snapshot } from "../interpretation-v4/runtimeProjection";
import { projectV5Book } from "../writer/book";

/** ticketPending(W3 P2): 아직 발행 전(만드는 중·이용권 반환됨)인 내 이용권 책 — 같은 대기 화면을 그린다. userId = 확인한 주인. */
export type TicketOwnerRead = { kind: "absent" | "storageError" | "expired" | "invalidSnapshot" } | { kind: "ticketBook"; snapshot: ProductPreviewSnapshot } | { kind: "ticketPending"; userId: string };
/** 이 회원이 이 주소의 이용권 접수(아직 발행 전: QUEUED · RUNNING · REVERSED)를 가졌는지. 읽기 실패는 예외. */
export type TicketPendingLookup = (userId: string, reportId: string) => Promise<boolean>;

/** 내 책을 읽을 수 있는 지금 회원 id(로그인 + 가입 프로필 + 필수 동의, readOwnedTicketReport와 같은 기준). 아니면 null, 계정을 못 읽으면 예외. */
export async function ticketReaderId(auth: AccountPort): Promise<string | null> {
  const user = await auth.currentUser(); if (!user) return null;
  const account = await auth.read(user);
  if (account === null) throw new Error("STORAGE_UNAVAILABLE");
  return account.profile?.id === user.id && mayReadOwnedBooks(user, account) ? user.id : null;
}

export async function readOwnedTicketReport(reportId: string, auth: AccountPort, store: TicketStore, pending?: TicketPendingLookup): Promise<TicketOwnerRead> {
  if (!/^report_[a-z0-9_-]{13,80}$/i.test(reportId)) return { kind: "absent" };
  try {
    const user = await auth.currentUser(); if (!user) return { kind: "absent" };
    const account = await auth.read(user);
    if (account === null) return { kind: "storageError" };
    // 최종판3 1-7: 이미 받은 이용권 책은 예전 동의로도 읽는다(새 이용권 사용은 재동의 뒤).
    if (account.profile?.id !== user.id || !mayReadOwnedBooks(user, account)) return { kind: "absent" };
    const result = await store.call("read", user.id, { reportId });
    if (!result.ok) {
      if (result.code !== "REPORT_NOT_FOUND") return { kind: "storageError" };
      // W3 P2: 발행 전인 내 이용권 책(접수 직후 이 주소로 온다). 주인 확인은 같은 회원의 접수 행으로만 한다.
      // 이 확인을 못 읽어도 결제 책 열람을 막지 않는다(없음으로 보고 결제 책 경로로 — 이용권 책이면 그 화면이 다시 확인한다).
      if (!pending || !await pending(user.id, reportId).catch(() => false)) return { kind: "absent" };
      return (await auth.currentUser())?.id === user.id ? { kind: "ticketPending", userId: user.id } : { kind: "absent" };
    }
    if ((await auth.currentUser())?.id !== user.id) return { kind: "absent" };
    if (result.status === "EXPIRED") return { kind: "expired" };
    const snapshot = result.snapshot;
    if (result.status !== "COMPLETED" || !isProductPreviewSnapshot(snapshot) || snapshot.reportId !== reportId
      || (snapshot.productVersion === "v5" ? !projectV5Book(snapshot) : snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot))) return { kind: "invalidSnapshot" };
    return { kind: "ticketBook", snapshot };
  } catch { return { kind: "storageError" }; }
}
