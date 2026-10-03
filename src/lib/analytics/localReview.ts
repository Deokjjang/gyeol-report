import "server-only";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import type { PGlite } from "@electric-sql/pglite";
import { localCampaignDatabase } from "../growth/localReview";
import { campaignCookie } from "../growth/service";
import { referralHash } from "../referrals/service";
import { createLocalAccountPort } from "../account/localReview";
import { localTicketUserId } from "../tickets/localDatabase";
import { MEASUREMENT_MIGRATION, type MeasurementPort } from "./server";
import type { FunnelEvent } from "./events";

export async function installMeasurementSchema(db: PGlite) { await db.exec(await readFile(MEASUREMENT_MIGRATION, "utf8")); }
export function sqlMeasurementStore(db: PGlite): MeasurementPort {
  return { async call(name, args) {
    // Function names are not browser input. Keep the SQL identifier allowlist explicit.
    const queries: Record<string, string> = { campaign_presentation_v2: "select campaign_presentation_v2($1,$2) result", growth_measurement_facts: "select growth_measurement_facts($1) result", claim_meta_purchase: "select claim_meta_purchase($1) result" };
    if (!queries[name]) return null;
    const values = name === "campaign_presentation_v2" ? [args.p_slug, args.p_user] : [name === "claim_meta_purchase" ? args.p_report : args.p_user];
    return db.transaction(async tx => { await tx.exec("set local role service_role"); return (await tx.query<{ result: unknown }>(queries[name], values)).rows[0]?.result; });
  } };
}
const root = globalThis as typeof globalThis & { __measurementDb?: Promise<PGlite | null>; __measurementInteractions?: Map<string, FunnelEvent & { subject?: string }> };
export async function localMeasurementDatabase() {
  if (!["development", "test"].includes(process.env.NODE_ENV)) return null;
  return root.__measurementDb ??= (async () => { const db = await localCampaignDatabase(); if (db) await installMeasurementSchema(db); return db; })();
}
export async function measurementIdentity(request: NextRequest) {
  const auth = createLocalAccountPort(request), user = await auth?.currentUser();
  return user ? localTicketUserId(user.id) : null;
}
// Bounded dev collector, not a second durable analytics/reward database. Restart
// clears interaction counts; business facts are always re-read from their owners.
export async function collectInteraction(request: NextRequest, event: FunnelEvent) {
  const db = await localMeasurementDatabase(), user = await measurementIdentity(request);
  const secret = request.cookies.get(campaignCookie(true))?.value;
  const context = secret && /^[a-f0-9]{64}$/.test(secret) ? referralHash(secret) : null;
  const row = db ? (await db.query<{ campaign: string; subject: string }>(`select g.public_slug campaign,a.id::text subject from campaign_attributions a join growth_campaigns g on g.id=a.campaign_id
    where (a.user_id=$1 or ($1::uuid is null and a.context_hash=$2)) and (a.attributed_at is not null or a.context_expires_at>clock_timestamp()) limit 1`, [user, context])).rows[0] : undefined;
  const map = root.__measurementInteractions ??= new Map();
  // A landing interest is NOT attribution. Referral landing/CTA never inherits B's campaign.
  const referral = event.event.startsWith("referral_");
  const campaign = referral ? undefined : event.campaign ?? row?.campaign;
  const subject = createHash("sha256").update(user ?? row?.subject ?? event.eventId.split(":")[0]).digest("hex");
  const safe = { ...event }; delete safe.campaign;
  const record = { ...safe, ...(campaign ? { campaign } : {}), subject, occurredAt: new Date().toISOString() };
  const key = `${subject}:${event.event}:${event.productType ?? ""}:${campaign ?? ""}`;
  if (!map.has(key)) map.set(key, record);
  if (map.size > 5000) map.delete(map.keys().next().value!);
}
export function localInteractions() { return [...(root.__measurementInteractions?.values() ?? [])].map(row => { const event = { ...row }; delete event.subject; return event; }); }
