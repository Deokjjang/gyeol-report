// 「남이 본 나」 명령 2 migration(실제 SQL, PGlite): 새 테이블 권한 · 신고 숨김 · 보고서 호 · 폭주 제한 · 탈퇴(외부 호출 0).
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";

const CORE = "supabase/migrations/20261127120000_mirror_core.sql", SOCIAL = "supabase/migrations/20261128090000_mirror_social.sql";
const A = "00000000-0000-4000-8000-00000000000a", B = "00000000-0000-4000-8000-00000000000b", C = "00000000-0000-4000-8000-00000000000c", D = "00000000-0000-4000-8000-00000000000d";
let db: PGlite;
const one = async <T,>(sql: string, args: unknown[] = []) => (await db.query<{ r: T }>(sql, args)).rows[0].r;
const save = (user: string, name: string, handle: string) => one<Record<string, unknown>>("select public.mirror_save_profile_v2($1,$2,$3,null,null,true) r", [user, name, handle]);
const session = async (owner: string, closeness: number, device: string, linked: string | null = null) =>
  (await db.query<{ id: string }>("insert into public.mirror_friend_sessions(owner_id,closeness,device_hash,linked_user_id) values ($1,$2,$3,$4) returning id", [owner, closeness, device.repeat(64), linked])).rows[0].id;
const story = async (owner: string, sessionId: string | null, writer: string | null, showHandle = false) =>
  (await db.query<{ id: string }>("insert into public.mirror_stories(owner_id,session_id,writer_user_id,show_handle,kind,closeness,body,shared_at) values ($1,$2,$3,$4,'funny',2,'같이 웃었던 날',now()) returning id", [owner, sessionId, writer, showHandle])).rows[0].id;

beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role; alter role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); grant usage on schema public, auth to anon, authenticated, service_role;");
  await db.exec(`insert into auth.users values ('${A}'), ('${B}'), ('${C}'), ('${D}');`);
  await db.exec(readFileSync(CORE, "utf8"));
  await db.exec(readFileSync(SOCIAL, "utf8"));
  await db.exec("set role service_role;");
});

describe("mirror_social migration", () => {
  it("CREATE만: 기존 표 · 함수를 바꾸는 문장이 없다", () => {
    const sql = readFileSync(SOCIAL, "utf8").replace(/^--.*$/gm, "");
    expect(sql).not.toMatch(/\b(alter\s+table\s+(?!public\.mirror_(share_settings|stories|story_hearts|story_reports|report_issues|session_voids|rate_hits|retired_handles)\b)|drop\s+|create\s+or\s+replace)/i);
  });
  it("새 테이블 8개 모두 RLS, 브라우저 역할은 읽지도 함수를 부르지도 못한다", async () => {
    await db.exec("reset role;");
    const rls = (await db.query<{ tablename: string; rowsecurity: boolean }>("select tablename, rowsecurity from pg_tables where tablename like 'mirror_%' order by 1")).rows;
    expect(rls).toHaveLength(15);
    expect(rls.every(r => r.rowsecurity)).toBe(true);
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role};`);
      await expect(db.query("select * from public.mirror_stories")).rejects.toThrow(/permission denied/);
      await expect(db.query("select public.mirror_withdraw($1)", [A])).rejects.toThrow(/permission denied/);
      await db.exec("reset role;");
    }
    await db.exec("set role service_role;");
  });
  it("신고: 계정당 한 번, 세 번째 신고에서 숨기고 모두의 이야기에서 빠진다", async () => {
    const s = await story(A, null, null);
    expect(await one("select public.mirror_story_report($1,$2) r", [s, B])).toEqual({ ok: true, count: 1, hiddenNow: false });
    expect(await one("select public.mirror_story_report($1,$2) r", [s, B])).toEqual({ ok: true, count: 1, hiddenNow: false });
    expect(await one("select public.mirror_story_report($1,$2) r", [s, C])).toEqual({ ok: true, count: 2, hiddenNow: false });
    expect(((await one<unknown[]>("select public.mirror_stories_view(null,null,'latest',20,0) r")) as { id: string }[]).map(x => x.id)).toContain(s);
    expect(await one("select public.mirror_story_report($1,$2) r", [s, D])).toEqual({ ok: true, count: 3, hiddenNow: true });
    expect(await one("select public.mirror_story_report($1,$2) r", [s, A])).toEqual({ ok: true, count: 4, hiddenNow: false });
    expect(((await one<unknown[]>("select public.mirror_stories_view(null,null,'latest',20,0) r")) as { id: string }[]).map(x => x.id)).not.toContain(s);
    // 받은 사람 화면에는 숨김 표시로 남는다
    expect(((await one<unknown[]>("select public.mirror_stories_view(null,$1,'latest',20,0) r", [A])) as { id: string; hidden: boolean }[]).find(x => x.id === s)?.hidden).toBe(true);
  });
  it("보고서 호: 60개부터 · 호 번호 하나씩 · 7일에 한 번", async () => {
    expect(await one("select public.mirror_issue_report($1,1,59,'{}'::jsonb) r", [B])).toEqual({ ok: false, code: "NOT_READY" });
    expect(await one("select public.mirror_issue_report($1,2,60,'{}'::jsonb) r", [B])).toEqual({ ok: false, code: "CONFLICT" });
    expect(await one("select public.mirror_issue_report($1,1,60,'{\"issueNo\":1}'::jsonb) r", [B])).toEqual({ ok: true, issueNo: 1 });
    expect(await one("select public.mirror_issue_report($1,2,80,'{}'::jsonb) r", [B])).toMatchObject({ ok: false, code: "TOO_SOON" });
    await db.exec("reset role;");
    await db.query("update public.mirror_report_issues set issued_at = now() - interval '7 days 1 minute' where owner_id = $1", [B]);
    await db.exec("set role service_role;");
    expect(await one("select public.mirror_issue_report($1,2,80,'{}'::jsonb) r", [B])).toEqual({ ok: true, issueNo: 2 });
  });
  it("폭주 제한: 같은 칸이면 수가 오른다", async () => {
    const key = `start:ip:${"ab".repeat(16)}`;
    expect(await one("select public.mirror_rate_hit($1,600) r", [key])).toBe(1);
    expect(await one("select public.mirror_rate_hit($1,600) r", [key])).toBe(2);
    await expect(db.query("select public.mirror_rate_hit($1,600)", ["bad key"])).rejects.toThrow(/check/);
  });
  it("탈퇴: 받은 것은 지우고, 남에게 남긴 답 · 이야기는 익명으로, 아이디는 「사용됨」만 남는다", async () => {
    // A = 탈퇴하는 사람(아이디 바꾼 적 있음), B = A에게 답하고 이야기를 쓴 친구, A도 B에게 답하고 아이디를 보이게 이야기를 썼다.
    expect(await save(A, "민지", "minji.old")).toEqual({ ok: true });
    expect(await save(A, "민지", "minji.k")).toEqual({ ok: true });
    expect(await save(B, "서연", "seoyeon")).toEqual({ ok: true });
    await db.query("insert into public.mirror_self_answers(user_id,item_id,item_version,choice) values ($1,'soc-1',1,0),($2,'soc-1',1,1)", [A, B]);
    await db.query("insert into public.mirror_share_settings(user_id,line) values ($1,'나 어때?')", [A]);
    await db.query("insert into public.mirror_devices(device_hash,user_id) values ($1,$2)", ["7".repeat(64), A]);
    const toA = await session(A, 2, "1", B), fromA = await session(B, 3, "7", A);
    await db.query("insert into public.mirror_friend_answers(session_id,item_id,item_version,choice) values ($1,'soc-1',1,0),($2,'soc-1',1,1)", [toA, fromA]);
    const received = await story(A, toA, B, true), written = await story(B, fromA, A, true);
    await db.query("insert into public.mirror_story_hearts(story_id,user_id) values ($1,$2),($3,$4)", [received, B, written, A]);
    await db.query("insert into public.mirror_report_issues(owner_id,issue_no,answers,snapshot) values ($1,1,60,'{}')", [A]);
    expect(((await one<unknown[]>("select public.mirror_stories_view(null,$1,'latest',20,0) r", [B])) as { id: string; handle: string | null }[]).find(x => x.id === written)?.handle).toBe("minji.k");

    // 받은 이야기 2편 = 위 신고 시험의 숨긴 이야기 + 이 시험의 공유 이야기
    expect(await one("select public.mirror_withdraw($1) r", [A])).toEqual({ ok: true, retiredHandles: 2, receivedSessions: 1, receivedStories: 2, issues: 1, anonymizedSessions: 1, anonymizedStories: 1 });
    const count = async (sql: string, args: unknown[] = [A]) => Number((await db.query<{ n: number }>(sql, args)).rows[0].n);
    expect(await count("select count(*) n from public.mirror_profiles where user_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_self_answers where user_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_friend_sessions where owner_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_friend_answers where session_id=$1", [toA])).toBe(0);
    expect(await count("select count(*) n from public.mirror_stories where owner_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_report_issues where owner_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_share_settings where user_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_devices where user_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_handle_history where user_id=$1")).toBe(0);
    expect(await count("select count(*) n from public.mirror_story_hearts where user_id=$1")).toBe(0);
    // 남의 별자리에 남긴 답 · 이야기는 그대로, 계정 연결만 끊긴다
    expect((await db.query("select linked_user_id, owner_id from public.mirror_friend_sessions where id=$1", [fromA])).rows).toEqual([{ linked_user_id: null, owner_id: B }]);
    expect(await count("select count(*) n from public.mirror_friend_answers where session_id=$1", [fromA])).toBe(1);
    expect((await db.query("select writer_user_id, show_handle, body from public.mirror_stories where id=$1", [written])).rows).toEqual([{ writer_user_id: null, show_handle: false, body: "같이 웃었던 날" }]);
    expect(((await one<unknown[]>("select public.mirror_stories_view(null,$1,'latest',20,0) r", [B])) as { id: string; handle: string | null }[]).find(x => x.id === written)?.handle).toBeNull();
    // 아이디: 지금 것 · 예전 것 모두 「사용됨」(계정 연결 없음) — 다른 사람이 못 쓰고, 본인 계정에도 묶이지 않는다
    expect((await db.query("select handle from public.mirror_retired_handles order by 1")).rows).toEqual([{ handle: "minji.k" }, { handle: "minji.old" }]);
    expect(await save(C, "다른 사람", "minji.k")).toEqual({ ok: false, code: "HANDLE_TAKEN" });
    expect(await save(C, "다른 사람", "minji.old")).toEqual({ ok: false, code: "HANDLE_TAKEN" });
    // 친구 B의 데이터는 그대로
    expect(await count("select count(*) n from public.mirror_profiles where user_id=$1", [B])).toBe(1);
    expect(await count("select count(*) n from public.mirror_self_answers where user_id=$1", [B])).toBe(1);
  });
});
