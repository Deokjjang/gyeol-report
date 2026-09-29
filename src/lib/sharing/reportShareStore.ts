import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { createPaidReportReliabilityStore } from "../payment/paidReportReliabilityStore";
import { isProductPreviewSnapshot, type ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { validateProductPublication } from "../report-generation/productPublishGate";
import { withDeadline } from "../network/withDeadline";
import { describeReportShare, SHARE_TOKEN_PATTERN, shareUrl } from "./reportShareMetadata";

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

export async function loadShareableReport(reportId: string): Promise<ProductPreviewSnapshot | null> {
  if (!validShareReportId(reportId)) return null;
  // Read-only publication check. Never invoke quarantine or regenerate a purchased report here.
  const result = await createPaidReportReliabilityStore().call("read_report", { reportId });
  const snapshot = result.snapshot;
  if (!result.ok || result.status !== "COMPLETED" ||
      typeof result.expiresAt !== "string" || !(Date.parse(result.expiresAt) > Date.now()) ||
      !isProductPreviewSnapshot(snapshot) || snapshot.reportId !== reportId ||
      snapshot.access.mode !== "paid" ||
      !validateProductPublication(snapshot.productType, snapshot.draft, snapshot.evidencePacket).ok) return null;
  return snapshot;
}

export async function existingReportShareUrl(reportId: string): Promise<string | null> {
  const db = client();
  if (!db || !validShareReportId(reportId)) return null;
  try {
    const { data, error } = await withDeadline(async signal => await db.from("report_share_links")
      .select("token,revoked_at").eq("report_id", reportId).abortSignal(signal).maybeSingle(), 5000);
    return !error && data && !data.revoked_at && SHARE_TOKEN_PATTERN.test(data.token) ? shareUrl(data.token) : null;
  } catch { return null; }
}

export async function issuePublishedReportShare(reportId: string) {
  const unavailable = { ok: false as const, error: "SHARE_UNAVAILABLE" };
  try {
    const snapshot = await loadShareableReport(reportId);
    const db = client();
    if (!snapshot || !db) return unavailable;
    const token = `gr_${randomBytes(24).toString("base64url")}`;
    // Unique report_id + DO NOTHING makes concurrent clicks converge on the original link.
    // A revoked link is deliberately not recreated by a visitor.
    const { error } = await withDeadline(async signal => await db.from("report_share_links")
      .upsert({ report_id: reportId, token }, { onConflict: "report_id", ignoreDuplicates: true })
      .abortSignal(signal), 5000);
    if (error) return unavailable;
    const url = await existingReportShareUrl(reportId);
    return url ? { ok: true as const, data: { ...describeReportShare(snapshot), url } } : unavailable;
  } catch { return unavailable; }
}

export const loadSharedReport = cache(async (token: string) => {
  if (!SHARE_TOKEN_PATTERN.test(token)) return null;
  const db = client();
  if (!db) return null;
  try {
    const { data, error } = await withDeadline(async signal => await db.from("report_share_links")
      .select("report_id,revoked_at").eq("token", token).abortSignal(signal).maybeSingle(), 5000);
    if (error || !data || data.revoked_at) return null;
    const snapshot = await loadShareableReport(data.report_id);
    return snapshot ? { snapshot, share: { ...describeReportShare(snapshot), url: shareUrl(token) } } : null;
  } catch { return null; }
});
