/**
 * P6c 화면 캡처용 로컬 Book(비용 0): 운영과 같은 경로(enqueue → claim → runV5TicketJob)로 만들되 작가 호출은 바로 실패시켜
 * 결정론 작가 원고로 발행한다(키를 읽지 않는다). 점수 쪽·표지·만세력·부록·대운 표는 원고와 무관하게 새 코드로 만들어진다.
 *   pnpm exec vitest run --config tools/p6c-score/vitest.p6c.config.ts   (로컬 Supabase가 떠 있어야 함)
 * 결과: docs/v5/ui-p6c/books.json(사례 → reportId).
 */
import { randomUUID, createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { CHECKOUT_POLICY_VERSIONS } from "@/lib/legal/policyVersions";
import { purchaseMetadata } from "@/lib/library/model";
import { createCheckoutConsentEvidence } from "@/lib/payment/checkoutConsent";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import type { TicketPublicationStore } from "@/lib/tickets/publication";
import { runV5TicketJob } from "@/lib/writer/ticketJob";
import type { BriefPersonInput } from "@/lib/brief/buildBrief";
import { localSupabase } from "../../scripts/dev/local";
import { prepareLocalDb } from "../../scripts/dev/v5-db";
import { P6_CASES } from "../p6/cases";
import { P36_PEOPLE } from "../p36/people";
import { PEOPLE } from "../p35/people";

const ROOT = resolve(import.meta.dirname, "../..");
const person = (p: BriefPersonInput) => ({ name: p.name, birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "", gender: p.gender, mbtiType: p.mbtiType });
const pair = (relationshipType: string, a: BriefPersonInput, b: BriefPersonInput) => ({ productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType, personA: person(a), personB: person(b) });
const CASES = [
  { id: "pair-love", payload: pair("love", PEOPLE.c1, PEOPLE.c2) },
  { id: "pair-parent", payload: pair("parentChild", P36_PEOPLE.parent, P36_PEOPLE.child) },
  { id: "pair-boss", payload: pair("managerReport", P36_PEOPLE.boss, PEOPLE.c1) },
  ...P6_CASES.filter(c => c.id === "c1-full" || c.id === "x-major"),
];

test("P6c 캡처용 Book(결정론 원고)", async () => {
  const s = localSupabase(), seed = await prepareLocalDb();
  const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const store: TicketPublicationStore = { async call(action, user, data = {}) {
    const r = await db.rpc("report_ticket_publication", { p_action: action, p_user: user, p_data: data });
    return !r.error && r.data && typeof r.data.ok === "boolean" ? r.data : { ok: false, code: r.error?.message ?? "STORAGE_UNAVAILABLE" };
  } };
  const consent = { policyVersions: CHECKOUT_POLICY_VERSIONS, assertions: { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true } };
  const out: Record<string, string> = {};
  for (const c of CASES) {
    const now = new Date(), n = normalizeReportInputPayload(c.payload, { now: () => now });
    if (!n.ok) throw new Error(`${c.id} 입력 오류 ${n.error}`);
    const input = n.value as { productKey: string; person?: { birthDate: string }; personA?: { birthDate: string } };
    const requestId = randomUUID(), reportId = `report_${randomUUID().replaceAll("-", "")}`;
    const evidence = createCheckoutConsentEvidence(consent, (input.person ?? input.personA)!.birthDate, now);
    const enq = await store.call("enqueue", seed.userId, { requestId, input, productType: input.productKey, inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"), reportId, policyAt: now.toISOString(), consentEvidence: evidence, ...purchaseMetadata(input) });
    if (!enq.ok) throw new Error(`${c.id} 접수 실패 ${enq.code}`);
    const job = await store.call("claim", null, { v5Products: [input.productKey] });
    if (!job.ok || job.reportId !== reportId) throw new Error(`${c.id} claim이 다른 작업(${job.reportId ?? job.code})`);
    const dry = { stream: async () => ({ text: "", finishReason: "error" as const, usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "dry", message: "dry" } }) };
    const result = await runV5TicketJob(store, job, { provider: "anthropic", model: "claude-sonnet-5-5", apiKey: "dry", fallback: null, ...dry });
    const snap = (await db.from("paid_report_snapshots").select("status").eq("report_id", reportId).maybeSingle()).data;
    console.log(c.id, reportId, snap?.status ?? `발행 실패 ${result.code}`);
    if (snap) out[c.id] = reportId;
  }
  mkdirSync(join(ROOT, "docs/v5/ui-p6c"), { recursive: true });
  writeFileSync(join(ROOT, "docs/v5/ui-p6c/books.json"), JSON.stringify(out, null, 1) + "\n");
}, 0);
