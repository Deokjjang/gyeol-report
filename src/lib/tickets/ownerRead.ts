import "server-only";
import type { AccountPort } from "../account/handler";
import { mayReadOwnedBooks } from "../account/policy";
import type { TicketStore } from "./service";
import { isProductPreviewSnapshot, type ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectV4Snapshot } from "../interpretation-v4/runtimeProjection";
import { projectV5Book } from "../writer/book";

export type TicketOwnerRead = { kind: "absent" | "storageError" | "expired" | "invalidSnapshot" } | { kind: "ticketBook"; snapshot: ProductPreviewSnapshot };
export async function readOwnedTicketReport(reportId: string, auth: AccountPort, store: TicketStore): Promise<TicketOwnerRead> {
  if (!/^report_[a-z0-9_-]{13,80}$/i.test(reportId)) return { kind: "absent" };
  try {
    const user = await auth.currentUser(); if (!user) return { kind: "absent" };
    const account = await auth.read(user);
    if (account === null) return { kind: "storageError" };
    // 최종판3 1-7: 이미 받은 이용권 책은 예전 동의로도 읽는다(새 이용권 사용은 재동의 뒤).
    if (account.profile?.id !== user.id || !mayReadOwnedBooks(user, account)) return { kind: "absent" };
    const result = await store.call("read", user.id, { reportId });
    if (!result.ok) return { kind: result.code === "REPORT_NOT_FOUND" ? "absent" : "storageError" };
    if ((await auth.currentUser())?.id !== user.id) return { kind: "absent" };
    if (result.status === "EXPIRED") return { kind: "expired" };
    const snapshot = result.snapshot;
    if (result.status !== "COMPLETED" || !isProductPreviewSnapshot(snapshot) || snapshot.reportId !== reportId
      || (snapshot.productVersion === "v5" ? !projectV5Book(snapshot) : snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot))) return { kind: "invalidSnapshot" };
    return { kind: "ticketBook", snapshot };
  } catch { return { kind: "storageError" }; }
}
