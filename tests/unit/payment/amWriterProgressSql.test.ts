import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// AM 7부(로컬 실화면 확인에서 찾음): am_writer_progress가 jsonb에 max()를 써서 부를 때마다 오류였다(단위 시험은 저장소를 흉내 내 못 봤다).
// 실제 migration SQL을 PGlite에서 돌려 결제 책·이용권 책 두 갈래 모두 진행률·1장 미리보기·중앙값을 돌려주는지 본다.
const SQL = readFileSync("supabase/migrations/20261112091000_v5_am_writer_progress.sql", "utf8");
let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role service_role; create role anon; create role authenticated;
    create table public.paid_report_snapshots(report_id text primary key, product_type text not null, order_id text);
    create table public.report_purchase_bindings(order_id text primary key, buyer_id uuid, claim_hash text, claim_expires_at timestamptz, revoked_at timestamptz);
    create table public.report_account_links(report_id text primary key, user_id uuid, revoked_at timestamptz);
    create table public.report_ticket_redemptions(id uuid primary key, product_type text not null, report_id text);
    create table public.ops_writer_chapters(report_id text, chapter_n int, source text, chapter jsonb);
    create table public.report_writer_chapters(redemption_id uuid, chapter_n int, source text, chapter jsonb);
    create table public.book_generation_runs(report_id text, outcome text, duration_ms bigint, created_at timestamptz default now());
  `);
  await db.exec(SQL);
  await db.exec(`
    insert into public.paid_report_snapshots values ('report_paid000000000001','annual_fortune','order_1'),('report_done000000000001','annual_fortune','order_d1'),('report_done000000000002','annual_fortune','order_d2'),('report_done000000000003','annual_fortune','order_d3'),('report_gues000000000001','major_fortune','order_g'),('report_expi000000000001','major_fortune','order_e');
    insert into public.report_purchase_bindings values ('order_1','00000000-0000-4000-8000-0000000000aa',null,null,null),('order_g',null,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',now()+interval '1 day',null),('order_e',null,'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',now()-interval '1 day',null);
    insert into public.ops_writer_chapters values
      ('report_paid000000000001',1,'writer','{"n":1,"_total":10,"_preview":{"n":1,"title":"2027 큰 그림","sections":[],"hidden":0}}'),
      ('report_paid000000000001',2,'writer','{"n":2,"_total":10}');
    insert into public.book_generation_runs values ('report_done000000000001','published',170000,now()),('report_done000000000002','published',181000,now()),('report_done000000000003','published',195000,now());
    insert into public.report_ticket_redemptions values ('00000000-0000-4000-8000-000000000001','saju_mbti_full','report_tick000000000001');
    insert into public.report_writer_chapters values ('00000000-0000-4000-8000-000000000001',1,'writer','{"n":1,"_total":13,"_preview":{"n":1,"title":"나를 한 줄로","sections":[],"hidden":1}}');
  `);
});
afterAll(async () => { await db.close(); });

const call = async (data: object) => (await db.query<{ p: Record<string, unknown> }>("select public.am_writer_progress($1::jsonb) as p", [JSON.stringify(data)])).rows[0].p;

describe("am_writer_progress (실제 SQL)", () => {
  it("결제 책: 저장 장 수·전체 장 수·1장 미리보기·같은 상품 발행 중앙값(표본 3개 이상)", async () => {
    expect(await call({ reportId: "report_paid000000000001" })).toMatchObject({ ok: true, product: "annual_fortune", done: 2, total: 10, first: { title: "2027 큰 그림" }, medianMs: 181000, samples: 3 });
  });
  it("이용권 책: redemptionId 갈래도 같은 모양", async () => {
    expect(await call({ redemptionId: "00000000-0000-4000-8000-000000000001" })).toMatchObject({ ok: true, product: "saju_mbti_full", done: 1, total: 13, first: { hidden: 1 }, medianMs: null });
  });
  it("생성 중 결제 책의 주인(owner): 구매 회원 · 유효한 구매 확인 쿠키만(다른 회원·만료 쿠키·아무것도 없음은 아님)", async () => {
    expect((await call({ reportId: "report_paid000000000001", userId: "00000000-0000-4000-8000-0000000000aa" })).owner).toBe(true);
    expect((await call({ reportId: "report_paid000000000001", userId: "00000000-0000-4000-8000-0000000000bb" })).owner).toBe(false);
    expect((await call({ reportId: "report_paid000000000001" })).owner).toBe(false);
    expect((await call({ reportId: "report_gues000000000001", claimHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" })).owner).toBe(true);
    expect((await call({ reportId: "report_expi000000000001", claimHash: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" })).owner).toBe(false);
    expect((await call({ reportId: "report_gues000000000001", claimHash: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" })).owner).toBe(false);
  });
  it("저장 장이 없으면 0, 모르는 책·잘못된 id", async () => {
    expect(await call({ reportId: "report_done000000000001" })).toMatchObject({ ok: true, done: 0, total: null, first: null });
    expect(await call({ reportId: "report_none000000000001" })).toMatchObject({ ok: false, code: "NOT_FOUND" });
    expect(await call({ reportId: "x" })).toMatchObject({ ok: false, code: "INVALID" });
  });
});
