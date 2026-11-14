// v5 최종3(배포 차단 위험 1): 과거 Book 보호.
// 열람은 저장본을 바꾸지 않는다 — 격리(quarantine) 호출 0, 저장 스냅샷·화면 그대로. 검사는 그 책이 발행된 계약(저장된 판 계열)으로만,
// 실패해도 로그만 남긴다. 새 발행 검사(정답지·렌더·시점·라벨·의미 검수)는 열람 경로 import 그래프에 없다.
// 운영 고객 책 계열(덕짱님 확인 2026-11-05): v1·1.0·v2(8권) / v4(33권) + 이번 출시 v5. 표본: 운영 모양 fixture(production-version-combos),
// 이전 판 v5 저장본(docs/v5/baseline p6d 제5판·p6e 제6판). READ_REGRESSION_OUT=<폴더>이면 책마다 보이는 글자·열람 데이터 해시를 남긴다(전·후 대조용).
import { PGlite } from "@electric-sql/pglite";
import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
const ports = vi.hoisted(() => ({ call: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams(), notFound: () => { throw new Error("404"); } }));
vi.mock("../../../src/lib/account/gate", () => ({ accountPublicEnabled: () => true, localAccountAllowed: () => false }));
vi.mock("../../../src/lib/book/ownerAccess", () => ({ loadOwnedTicketBook: async () => ({ kind: "absent" }), canReadPurchasedBook: async () => true }));
vi.mock("../../../src/lib/sharing/reportShareStore", () => ({ existingReportShareUrl: async () => null }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", async original => ({ ...await original<object>(), createPaidReportReliabilityStore: () => ({ call: ports.call }) }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);
vi.mock("../../../src/components/analytics/MetaPurchaseTracker", () => ({ default: () => null }));
import ReportPage from "../../../src/app/reports/[reportId]/page";
import { readPublishedReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { storedBook, validateBookPublication } from "../../../src/lib/book/storedReport";
import { BookReadingPresentation } from "../../../src/components/book/BookEntry";
import { readModuleGraph } from "../../helpers/moduleDependencyGraph";

type Snapshot = Record<string, unknown> & { reportId: string; productType: string; productVersion: string };
const combo = (name: string): Snapshot => JSON.parse(gunzipSync(readFileSync(`tests/fixtures/production-version-combos/${name}.json.gz`)).toString("utf8"));
const LEGACY = ["career_money_study-v1", "saju_mbti_compatibility-1.0", "saju_mbti_full-v2"];
const V4 = ["annual_fortune-v4", "career_money_study-v4", "love_marriage_child-v4", "major_fortune-v4", "saju_mbti_compatibility-v4", "saju_mbti_full-v4"];
const V5 = ["p6d", "p6e"].flatMap(dir => readdirSync(`docs/v5/baseline/${dir}`).filter(f => f.endsWith(".snapshot.json")).sort().map(f => `${dir}/${f.replace(/\.snapshot\.json$/, "")}`));
const v5 = (name: string): Snapshot => JSON.parse(readFileSync(`docs/v5/baseline/${name}.snapshot.json`, "utf8"));
const BOOKS: [string, string, () => Snapshot][] = [
  ...LEGACY.map(n => ["legacy", n, () => combo(n)] as [string, string, () => Snapshot]),
  ...V4.map(n => ["v4", n, () => combo(n)] as [string, string, () => Snapshot]),
  ...V5.map(n => ["v5", n, () => v5(n)] as [string, string, () => Snapshot]),
];
const TODAY = "2026-11-05";
const sha = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const visible = (html: string) => html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
const OUT = process.env.READ_REGRESSION_OUT;
const record = (row: Record<string, unknown>) => { if (OUT) appendFileSync(`${OUT}/read-regression.jsonl`, `${JSON.stringify(row)}\n`); };
const actions = () => ports.call.mock.calls.map(([action]) => action);
const serve = (snapshot: unknown) => ports.call.mockReset().mockImplementation(async (action: string) => action === "read_report" ? { ok: true, status: "COMPLETED", snapshot } : { ok: true });
async function open(reportId: string) { return renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId }) })); }

const errors = vi.spyOn(console, "error").mockImplementation(() => {});
beforeAll(async () => {
  if (OUT) mkdirSync(OUT, { recursive: true });
  vi.stubEnv("NODE_ENV", "production");
  // Node의 next/dynamic은 Next 사전 로드가 없어 실제 컴포넌트를 먼저 불러 둔다(bookPublicFlow와 같은 방식).
  await (BookReadingPresentation as unknown as { render: { preload: () => Promise<unknown> } }).render.preload();
});
afterAll(() => { vi.unstubAllEnvs(); errors.mockRestore(); });

describe("과거 Book 열람: 격리 0, 저장본·화면 그대로 (v1·1.0·v2 / v4 / v5)", () => {
  it("계열마다 표본이 3권 이상", () => {
    expect(BOOKS.filter(([f]) => f === "legacy").map(([, , load]) => load().productVersion).sort()).toEqual(["1.0", "v1", "v2"]);
    expect(BOOKS.filter(([f]) => f === "v4").length).toBeGreaterThanOrEqual(3);
    expect(BOOKS.filter(([f]) => f === "v5").length).toBeGreaterThanOrEqual(3);
  });

  it.each(BOOKS)("%s %s: 읽기만 하고(격리 호출 0) 책을 그린다", async (family, name, load) => {
    const snapshot = load(), before = JSON.stringify(snapshot);
    serve(snapshot); errors.mockClear();
    const html = await open(snapshot.reportId);
    const text = visible(html), data = family === "legacy" ? null : storedBook(snapshot, null, TODAY)?.data ?? null;
    record({ family, name, reportId: snapshot.reportId, productVersion: snapshot.productVersion, calls: actions(), textChars: text.length, textSha: sha(text), readerSha: data ? sha(JSON.stringify(data)) : null });
    expect(actions()).toEqual(["read_report"]);
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(errors).not.toHaveBeenCalled();
    if (family === "legacy") { expect(html.match(/<main[ >]/g)).toHaveLength(1); expect(text.length).toBeGreaterThan(2000); }
    else { expect(html).toContain("data-book-report"); expect(data?.pages.length).toBeGreaterThan(5); }
    expect(text).not.toContain("저장된 책 정보를 확인할 수 없습니다");
  });

  // 같은 판 계약의 검사에 걸리는 손상본: 내용은 보이지 않지만(그대로 안내) 격리하지 않고 로그만 남긴다.
  const BROKEN: [string, () => Snapshot][] = [
    ["legacy v2 근거 없음", () => ({ ...combo("saju_mbti_full-v2"), evidencePacket: undefined }) as Snapshot],
    ["v4 화면 투영 불일치", () => { const s = combo("saju_mbti_full-v4"); return { ...s, draft: { ...(s.draft as object), title: "바뀐 제목" } }; }],
    ["v5 근거 판 불일치", () => { const s = v5("p6e/sodam-full"); return { ...s, evidencePacket: { ...(s.evidencePacket as object), version: "v5-evidence-x" } }; }],
  ];
  it.each(BROKEN)("%s: 격리 호출 없이 로그만, 손상 내용은 그리지 않는다", async (_label, load) => {
    const snapshot = load(), before = JSON.stringify(snapshot);
    serve(snapshot); errors.mockClear();
    const html = await open(snapshot.reportId);
    expect(actions()).toEqual(["read_report"]);
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(html).not.toContain("data-book-report");
    expect(html).not.toContain("리포트 공유하기");
    const logged = errors.mock.calls.map(([line]) => JSON.parse(String(line)) as Record<string, unknown>);
    expect(logged).toEqual([expect.objectContaining({ event: "REPORT_READ_VALIDATION_FAILED", reportId: snapshot.reportId, productVersion: snapshot.productVersion, errors: expect.any(Array) })]);
  });

  it("검사기가 예외를 던져도 격리하지 않는다", async () => {
    const snapshot = combo("saju_mbti_full-v4"), store = { call: vi.fn(async (action: string) => action === "read_report" ? { ok: true, status: "COMPLETED", snapshot } : { ok: true }) };
    errors.mockClear();
    const read = await readPublishedReport(store as ReliabilityStore, snapshot.reportId, () => { throw new Error("validator crashed"); });
    expect(read).toEqual({ ok: true, status: "FAILED_REQUIRES_ATTENTION", snapshot: null, readRejected: true });
    expect(store.call.mock.calls.map(([a]) => a)).toEqual(["read_report"]);
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it("판 계열로 검사기를 고른다: v5→v5 계약, v4→v4 계약, 그 밖→기존 열람 검사(새 발행 검사 아님)", () => {
    for (const [family, , load] of BOOKS) {
      const s = load();
      expect({ family, ok: validateBookPublication(s.productType, s.draft, s.evidencePacket).ok }).toEqual({ family, ok: true });
    }
  });
});

describe("새 발행 검사는 열람 경로에 없다 (import 그래프, 동적 import 포함)", () => {
  const NEW_CHECKS = /^src\/lib\/factsheet\/|^src\/lib\/writer\/(review|repair3|repair|publish|runner)\.ts$|^src\/lib\/writer\/safety\/p6c\.ts$|^src\/lib\/writer\/prompt\/index\.ts$|^src\/lib\/llm\/|^src\/lib\/ops\/generation\//;
  const READ_ROOTS = ["src/app/reports/[reportId]/page.tsx", "src/app/r/[token]/page.tsx", "src/app/r/[token]/book-data/route.ts", "src/app/r/[token]/book-og/route.tsx", "src/lib/book/storedReport.tsx", "src/lib/tickets/ownerRead.ts"];
  it("열람 진입점에서 닿는 모듈에 정답지·검수·수리·발행·작가 호출 모듈이 없다", () => {
    const graph = readModuleGraph(), seen = new Set<string>();
    const visit = (f: string) => { if (seen.has(f) || !graph[f]) return; seen.add(f); graph[f].dependencies.forEach(visit); };
    READ_ROOTS.forEach(r => { expect(graph[r]).toBeDefined(); visit(r); });
    expect(seen.size).toBeGreaterThan(100);
    expect([...seen].filter(f => NEW_CHECKS.test(f))).toEqual([]);
  }, 60000); // 저장소 전체 TS 파싱 — 여러 파일을 함께 돌리면 5초를 넘는다.
});

describe("SQL: quarantine 동작은 어떤 행도 바꾸지 않는다 (새 migration, 기본 본문·R1 본문 모두)", () => {
  const MIGRATION = readFileSync("supabase/migrations/20261105130000_v5_final3_read_no_quarantine.sql", "utf8");
  const PATCHES = ["scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql",
    "scripts/paid_report_external_call_guard_patch.sql", "scripts/paid_checkout_consent_evidence_patch.sql", "scripts/paid_report_one_call_delivery_patch.sql"];
  async function database(r1: boolean) {
    const db = new PGlite();
    await db.exec("create role anon; create role authenticated; create role service_role;");
    for (const f of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/u.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${f}`, "utf8").replace(/^﻿/u, ""));
    await db.exec(readFileSync("supabase/migrations/20260920163924_production_reliability_reconcile.sql", "utf8"));
    if (r1) for (const f of PATCHES) await db.exec(readFileSync(f, "utf8"));
    const store: ReliabilityStore = { async call(action, data = {}) {
      return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value;
    } };
    return { db, store };
  }
  async function published(db: PGlite, store: ReliabilityStore, snapshot: Snapshot) {
    expect(await store.call("create_order", { paymentOrderId: "po-1", providerOrderId: "order-1", productType: snapshot.productType, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: { productKey: snapshot.productType } } })).toMatchObject({ ok: true });
    const claim = await store.call("confirm_claim", { orderId: "order-1", paymentKey: "key-1", amount: 1290 });
    const reportId = String((await store.call("confirm_finish", { orderId: "order-1", paymentKey: "key-1", token: claim.token })).reportId);
    const stored = { ...snapshot, reportId };
    await db.query("update paid_report_snapshots set status='COMPLETED', snapshot_json=$2::jsonb, gate_version='paid-report-v1', published_at=now(), expires_at=now()+interval '2160 hours' where report_id=$1", [reportId, JSON.stringify(stored)]);
    await db.query("update report_generation_jobs set status='COMPLETED' where report_id=$1", [reportId]);
    return { reportId, stored };
  }
  const row = async (db: PGlite, reportId: string) => (await db.query<{ status: string; snapshot_json: unknown; job: string; code: string | null }>(
    "select s.status, s.snapshot_json, j.status job, j.last_error_code code from paid_report_snapshots s join report_generation_jobs j using(report_id) where report_id=$1", [reportId])).rows[0];

  it.each([["기본 본문(snapshot_json=null로 지우던 것)", false], ["R1 본문(status만 바꾸던 것)", true]] as const)("%s → 새 migration 뒤 quarantine은 무동작", async (_label, r1) => {
    const { db, store } = await database(r1);
    try {
      const { reportId, stored } = await published(db, store, combo("saju_mbti_full-v4"));
      await db.exec(MIGRATION); await db.exec(MIGRATION); // 다시 실행해도 같다
      const body = (await db.query<{ d: string }>("select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) d")).rows[0].d;
      expect(body.split("READ_QUARANTINE_DISABLED").length - 1).toBe(1);
      expect(await store.call("quarantine", { reportId, expectedSnapshot: stored })).toEqual({ ok: true, quarantined: false, code: "READ_QUARANTINE_DISABLED" });
      expect(await store.call("quarantine", { reportId })).toEqual({ ok: true, quarantined: false, code: "READ_QUARANTINE_DISABLED" });
      expect(await row(db, reportId)).toEqual({ status: "COMPLETED", snapshot_json: stored, job: "COMPLETED", code: null });
      expect(await store.call("read_report", { reportId })).toMatchObject({ ok: true, status: "COMPLETED", snapshot: stored });
    } finally { await db.close(); }
  }, 60000);
});
