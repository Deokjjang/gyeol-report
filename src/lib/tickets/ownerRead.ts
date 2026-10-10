import "server-only";
import type { AccountPort } from "../account/handler";
import { accountSession } from "../account/policy";
import type { TicketStore } from "./service";
import { isProductPreviewSnapshot, type ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectV4Snapshot } from "../interpretation-v4/runtimeProjection";

export type TicketOwnerRead = { kind: "absent" | "storageError" | "expired" | "invalidSnapshot" } | { kind: "ticketBook"; snapshot: ProductPreviewSnapshot };
export async function readOwnedTicketReport(reportId: string, auth: AccountPort, store: TicketStore): Promise<TicketOwnerRead> {
  if (!/^report_[a-z0-9_-]{13,80}$/i.test(reportId)) return { kind: "absent" };
  try {
    const user = await auth.currentUser(); if (!user) return { kind: "absent" };
    const account = await auth.read(user);
    if (account === null) return { kind: "storageError" };
    if (account.profile?.id !== user.id || accountSession(user, account).status !== "member") return { kind: "absent" };
    const result = await store.call("read", user.id, { reportId });
    if (!result.ok) return { kind: result.code === "REPORT_NOT_FOUND" ? "absent" : "storageError" };
    if ((await auth.currentUser())?.id !== user.id) return { kind: "absent" };
    if (result.status === "EXPIRED") return { kind: "expired" };
    const snapshot = result.snapshot;
    if (result.status !== "COMPLETED" || !isProductPreviewSnapshot(snapshot) || snapshot.reportId !== reportId || snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot)) return { kind: "invalidSnapshot" };
    return { kind: "ticketBook", snapshot };
  } catch { return { kind: "storageError" }; }
}
