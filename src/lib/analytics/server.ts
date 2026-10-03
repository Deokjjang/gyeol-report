import "server-only";
import type { NextRequest } from "next/server";
import { validReferralSnapshot } from "../referrals/service";
import { createSupabaseServerClient } from "../db/supabaseServer";
import type { FunnelEvent, PurchaseFact } from "./events";
export const MEASUREMENT_MIGRATION = "supabase/migrations/20261003165059_v4_growth_measurement.sql";
export type MeasurementPort = { call(name: string, args: Record<string, unknown>): Promise<unknown> };
export function measurementStore(): MeasurementPort {
  return { async call(name, args) { const r = await createSupabaseServerClient().rpc(name, args); return r.error ? null : r.data; } };
}
export async function measurementFacts(port: MeasurementPort, user: string | null) {
  const raw = await port.call("growth_measurement_facts", { p_user: user });
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((r: FunnelEvent & { snapshot?: unknown; downstreamCampaign?: string }) => {
    if (["report_published", "share_created"].includes(r.event) && !validReferralSnapshot(r.snapshot)) return [];
    return [{ event: r.event, eventId: r.eventId, occurredAt: r.occurredAt,
      ...(r.productType ? { productType: r.productType } : {}), ...(r.campaign ? { campaign: r.campaign } : {}),
      ...(r.downstreamCampaign ? { downstreamCampaign: r.downstreamCampaign } : {}),
      ...(typeof r.value === "number" ? { value: r.value, currency: "KRW" as const } : {}) }];
  });
}
export async function claimPurchase(port: MeasurementPort, reportId: string): Promise<{ ok?: boolean; duplicate?: boolean; purchase?: PurchaseFact }> {
  const r = await port.call("claim_meta_purchase", { p_report: reportId });
  return r && typeof r === "object" ? r : {};
}
export function measurementOrigin(request: NextRequest, local: boolean) {
  const url = new URL(request.url);
  if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  return request.headers.get("origin") === (local ? url.origin : "https://gyeolreport.com");
}
