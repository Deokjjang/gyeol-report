import "server-only";
import { CLAIM_COOKIE_SECONDS, type LibraryPort, type PurchaseBinding } from "./server";
import type { LibraryRow } from "./model";

type Entry = { binding: PurchaseBinding; claimUntil: number; report?: LibraryRow; owner?: string; revoked?: boolean; deleted?: boolean };
const state = globalThis as typeof globalThis & { __libraryReview?: Map<string, Entry> };
const rows = () => state.__libraryReview ??= new Map<string, Entry>();
const allowed = () => ["test", "development"].includes(process.env.NODE_ENV);
export function createLocalLibraryPort(): LibraryPort {
  return {
    async bind(binding) {
      if (!allowed()) return false;
      const row = rows().get(binding.orderId);
      if (row) return JSON.stringify(row.binding) === JSON.stringify(binding);
      if (rows().size >= 100) return false;
      rows().set(binding.orderId, { binding, claimUntil: Date.now() + CLAIM_COOKIE_SECONDS * 1000 }); return true;
    },
    async orderForReport(id) { return allowed() && rows().has(id) ? id : null; },
    async claim(id, user, hash, commit) {
      if (!allowed()) return "unavailable";
      const r = rows().get(id);
      if (!r?.report || r.revoked || r.deleted || r.report.status !== "available" || Date.parse(r.report.expiresAt) <= Date.now()) return "unavailable";
      if (r.owner) return r.owner === user ? "owned" : "unavailable";
      if (r.binding.buyerId || !hash || r.binding.claimHash !== hash || r.claimUntil <= Date.now()) return "unavailable";
      if (!commit) return "claimable";
      if (!user) return "unavailable";
      // No await between check and write: process-local mirror of SQL row lock + PK.
      r.owner = user; return "owned";
    },
    async list(user) {
      if (!allowed()) return null;
      return [...rows().values()].flatMap(r => r.owner === user && r.report ? [{ ...r.report, status: r.revoked || r.deleted ? "unavailable" as const : r.report.status }] : []);
    },
  };
}
// Only called AFTER the existing read/publication validator succeeds.
// Publication expiry is passed from the existing paid retention helper. The
// process-local one-hour cache TTL is separate and never presented as retention.
export function publishLocalLibrary(report: LibraryRow) {
  if (!allowed()) return;
  const r = rows().get(report.reportId);
  if (!r || r.report || r.revoked || r.deleted) return;
  r.report = { ...report, displayName: r.binding.displayName, selectedYear: r.binding.selectedYear };
  if (r.binding.buyerId) r.owner = r.binding.buyerId;
}
