import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { createPaidReportReliabilityStore } from "../payment/paidReportReliabilityStore";
import { isProductPreviewSnapshot, type ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { validateProductPublication } from "../report-generation/productPublishGate";
import { withDeadline } from "../network/withDeadline";
import { describeReportShare, SHARE_TOKEN_PATTERN, shareUrl } from "./reportShareMetadata";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";

// Storage injection for local SQL verification; token generation and validation stay here.
export type ShareStorePort = {
  read: ReliabilityStore["call"];
  find(key: "report_id" | "token", value: string): Promise<{ report_id: string; token: string; revoked_at: string | null } | null>;
  insert(reportId: string, token: string): Promise<boolean>;
};
function sharePort(): ShareStorePort {
  return {
    read: (action, data) => createPaidReportReliabilityStore().call(action, data),
    async find(key, value) {
      const db = client(); if (!db) return null;
      const { data, error } = await withDeadline(async signal => await db.from("report_share_links")
        .select("report_id,token,revoked_at").eq(key, value).abortSignal(signal).maybeSingle(), 5000);
      return error ? null : data;
    },
    async insert(reportId, token) {
      const db = client(); if (!db) return false;
      const { error } = await withDeadline(async signal => await db.from("report_share_links")
        .upsert({ report_id: reportId, token }, { onConflict: "report_id", ignoreDuplicates: true }).abortSignal(signal), 5000);
      return !error;
    },
  };
}

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  } catch { return null; }
}

export function validShareReportId(value: unknown): value is string {
  return typeof value === "string" && /^report_[a-z0-9_-]{13,80}$/i.test(value);
}

export async function loadShareablePublication(reportId: string, validatePublication = validateProductPublication, port = sharePort()) {
  if (!validShareReportId(reportId)) return null;
  // Read-only publication check. Never invoke quarantine or regenerate a purchased report here.
  const result = await port.read("read_report", { reportId });
  const snapshot = result.snapshot;
  if (!result.ok || result.status !== "COMPLETED" ||
      typeof result.expiresAt !== "string" || !(Date.parse(result.expiresAt) > Date.now()) ||
      !isProductPreviewSnapshot(snapshot) || snapshot.reportId !== reportId ||
      snapshot.access.mode !== "paid" ||
      !validatePublication(snapshot.productType, snapshot.draft, snapshot.evidencePacket).ok) return null;
  return { snapshot, expiresAt: result.expiresAt };
}

export async function loadShareableReport(reportId: string, validatePublication = validateProductPublication): Promise<ProductPreviewSnapshot | null> {
  return (await loadShareablePublication(reportId, validatePublication))?.snapshot ?? null;
}

export async function existingReportShareUrl(reportId: string, port = sharePort()): Promise<string | null> {
  if (!validShareReportId(reportId)) return null;
  try {
    const data = await port.find("report_id", reportId);
    return data && !data.revoked_at && SHARE_TOKEN_PATTERN.test(data.token) ? shareUrl(data.token) : null;
  } catch { return null; }
}

export async function issuePublishedReportShare(reportId: string, validatePublication = validateProductPublication, port = sharePort()) {
  const unavailable = { ok: false as const, error: "SHARE_UNAVAILABLE" };
  try {
    const publication = await loadShareablePublication(reportId, validatePublication, port);
    if (!publication) return unavailable;
    const { snapshot } = publication;
    const token = `gr_${randomBytes(24).toString("base64url")}`;
    // Unique report_id + DO NOTHING makes concurrent clicks converge on the original link.
    // A revoked link is deliberately not recreated by a visitor.
    if (!await port.insert(reportId, token)) return unavailable;
    const url = await existingReportShareUrl(reportId, port);
    return url ? { ok: true as const, data: { ...describeReportShare(snapshot), url } } : unavailable;
  } catch { return unavailable; }
}

export const loadSharedReport = cache(async (token: string, validatePublication = validateProductPublication, port = sharePort()) => {
  if (!SHARE_TOKEN_PATTERN.test(token)) return null;
  try {
    const data = await port.find("token", token);
    if (!data || data.revoked_at) return null;
    const publication = await loadShareablePublication(data.report_id, validatePublication, port);
    return publication ? { ...publication, share: { ...describeReportShare(publication.snapshot), url: shareUrl(token) } } : null;
  } catch { return null; }
});
