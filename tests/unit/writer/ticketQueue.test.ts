import { writeFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TICKET_A as A } from "../../helpers/ticketPublicationSql";
import { enqueue, readBook, SCENARIOS, scenario, v5Queue, type Queue } from "../../helpers/v5Scenarios";

let h: Queue;
const ALL = "saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility,major_fortune,annual_fortune";
beforeAll(async () => { h = await v5Queue(); }, 60_000);
afterAll(async () => { delete process.env.WRITER_V5_PRODUCTS; await h?.db.close(); });
const minutes = async (redemptionId: string) => (await h.db.query<{ w: number | null; l: number; v: string | null }>(
  "select (extract(epoch from writer_lease_until-clock_timestamp())/60)::float8 w, (extract(epoch from lease_until-clock_timestamp())/60)::float8 l, writer_version v from report_ticket_redemptions where id=$1", [redemptionId])).rows[0];
const expireWriterLease = async (id: string) => { await h.db.exec("reset role"); await h.db.query("update report_ticket_redemptions set writer_lease_until=clock_timestamp()-interval '1 second' where id=$1", [id]); await h.db.exec("set role service_role"); };
const snap = (c: Record<string, unknown>, v: string) => ({ reportId: c.reportId, productType: c.productType, productVersion: v, draft: {}, evidencePacket: {} });

describe("이용권 큐 v5 lease(PGlite)", () => {
  it("플래그 꺼짐: claim은 기존과 같다(lease 10분, v5 아님, v5 발행 거부)", async () => {
    const job = await enqueue(h);
    const c = await h.queue.call("claim", null, {});
    expect(c.redemptionId).toBe(job.redemptionId); expect(c.writerVersion).toBeNull();
    const m = await minutes(job.redemptionId);
    expect(m.v).toBeNull(); expect(m.w).toBeNull(); expect(m.l).toBeGreaterThan(9.9); expect(m.l).toBeLessThanOrEqual(10);
    expect((await h.queue.call("publish", A, { redemptionId: c.redemptionId, token: c.token, gateVersion: "paid-report-v1", snapshot: snap(c, "v5") })).code).toBe("PUBLISH_REJECTED");
    expect((await h.queue.call("save-chapter", A, { redemptionId: c.redemptionId, token: c.token, n: 1, source: "writer", chapter: {} })).code).toBe("STALE_LEASE");
    await h.queue.call("reverse", A, { redemptionId: c.redemptionId, token: c.token, reason: "TEST" });
  });

  it("v5 claim: 작가 lease 15분 > 워커 800초, 정산 기한 25분. 중복 claim·lease 중 회수 불가", async () => {
    const job = await enqueue(h);
    const claims = await Promise.all(Array.from({ length: 5 }, () => h.queue.call("claim", null, { v5Products: ["saju_mbti_full"] })));
    const got = claims.filter(c => c.token);
    expect(got).toHaveLength(1); expect(got[0].redemptionId).toBe(job.redemptionId); expect(got[0].writerVersion).toBe("v5");
    expect(claims.filter(c => c.empty)).toHaveLength(4);
    const m = await minutes(job.redemptionId);
    expect(m.w! * 60).toBeGreaterThan(800); expect(m.w).toBeLessThanOrEqual(15); expect(m.l).toBeGreaterThan(24.9);
    expect((await h.queue.call("recover", null, {})).empty).toBe(true);
    expect((await h.queue.call("claim", null, { v5Products: ["saju_mbti_full"] })).empty).toBe(true);
    // 현재 토큰만 장을 저장한다.
    expect((await h.queue.call("save-chapter", A, { redemptionId: job.redemptionId, token: got[0].token, n: 1, source: "writer", chapter: { n: 1 } })).ok).toBe(true);
    expect((await h.queue.call("save-chapter", A, { redemptionId: job.redemptionId, token: crypto.randomUUID(), n: 2, source: "writer", chapter: { n: 2 } })).code).toBe("STALE_LEASE");
    // 작가 lease가 지나면 회수자 하나만 이어받고, 이전 토큰의 저장·발행은 거부된다.
    await expireWriterLease(job.redemptionId);
    const recs = await Promise.all([h.queue.call("recover", null, {}), h.queue.call("recover", null, {})]);
    const rec = recs.find(r => r.token)!;
    expect(recs.filter(r => r.token)).toHaveLength(1); expect(rec.recover).toBe(true); expect(rec.token).not.toBe(got[0].token);
    expect((await h.queue.call("save-chapter", A, { redemptionId: job.redemptionId, token: got[0].token, n: 2, source: "writer", chapter: { n: 2 } })).code).toBe("STALE_LEASE");
    expect((await h.queue.call("publish", A, { redemptionId: job.redemptionId, token: got[0].token, gateVersion: "paid-report-v1", snapshot: snap(got[0], "v5") })).code).toBe("STALE_LEASE");
    expect(((await h.queue.call("chapters", A, { redemptionId: job.redemptionId, token: rec.token })).chapters as unknown[])).toHaveLength(1);
    expect((await h.queue.call("publish", A, { redemptionId: job.redemptionId, token: rec.token, gateVersion: "paid-report-v1", snapshot: snap(rec, "v5") })).state).toBe("COMPLETED");
    expect((await h.db.query("select 1 from report_writer_chapters where redemption_id=$1", [job.redemptionId])).rows).toHaveLength(0);
  });
});

// 결과표: P3_TABLE_OUT=<파일> pnpm exec vitest run tests/unit/writer/ticketQueue.test.ts
const table: string[] = ["| 시나리오 | 최종 상태 | Book 열림 | 장별 source | LLM 호출 | 소요(ms) | 비고 |", "|---|---|---|---|---|---|---|"];
describe("실패 주입 → 모든 경우 Book 저장·열림(목업 LLM, 비용 0)", () => {
  beforeAll(() => { process.env.WRITER_V5_PRODUCTS = ALL; });
  afterAll(() => { if (process.env.P3_TABLE_OUT) writeFileSync(process.env.P3_TABLE_OUT, table.join("\n") + "\n"); });
  it.each(SCENARIOS)("$name", async ({ name, behaviors, opts }) => {
    const r = await scenario(h, name, behaviors, opts);
    table.push(`| ${r.name} | ${r.state} | ${r.opens ? "예" : "아니오"} | ${r.sources} | ${r.calls} | ${r.ms} | ${r.note ?? ""} |`);
    expect(r.state).toBe("COMPLETED");
    expect(r.opens).toBe(true);
    if (name === "정상") expect(r.sources).toBe("writer 13");
    if (name.includes("이어쓰기")) expect(r.sources).toMatch(/continuation/);
    if (name.includes("401")) expect(r.sources).toBe("deterministic 13");
    if (name.includes("강제 종료")) expect(r.sources).toBe("writer 3 · deterministic 10");
  }, 60_000);

  it("v5 Book은 이용권 읽기(read)로 다시 열린다", async () => {
    const job = await enqueue(h);
    const { llmDeps, mockTextFor } = await import("../../helpers/v5Scenarios");
    const { runTicketPublicationJob } = await import("@/lib/tickets/publicationWorker");
    await runTicketPublicationJob(h.queue, undefined, llmDeps([{ text: mockTextFor(job.input).text }]).deps);
    const read = await h.tickets.call("read", A, { reportId: job.reportId });
    expect(read.ok).toBe(true);
    expect((await readBook(h, job.reportId)).opens).toBe(true);
  }, 60_000);
});
