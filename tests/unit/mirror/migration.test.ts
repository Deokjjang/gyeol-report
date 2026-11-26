// 「남이 본 나」 migration(실제 SQL, PGlite): 아이디 규칙 · 예전 아이디 · 30일 · 주인 기기 · 권한(외부 호출 0).
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";

const MIGRATION = "supabase/migrations/20261127120000_mirror_core.sql";
const A = "00000000-0000-4000-8000-00000000000a", B = "00000000-0000-4000-8000-00000000000b";
let db: PGlite;
const save = async (user: string, name: string, handle: string, age14 = true, birth: [string | null, string | null] = [null, null]) =>
  (await db.query<{ r: Record<string, unknown> }>("select public.mirror_save_profile($1,$2,$3,$4::date,$5::time,$6) r", [user, name, handle, birth[0], birth[1], age14])).rows[0].r;

beforeAll(async () => {
  db = new PGlite();
  // Supabase와 같게: service_role은 RLS를 건너뛰고, 세 역할 모두 public 스키마를 쓸 수 있다(표 권한은 migration이 정한다).
  await db.exec("create role anon; create role authenticated; create role service_role; alter role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); grant usage on schema public, auth to anon, authenticated, service_role;");
  await db.exec(`insert into auth.users values ('${A}'), ('${B}');`);
  await db.exec(readFileSync(MIGRATION, "utf8"));
  await db.exec("set role service_role;");
});

describe("mirror_core migration", () => {
  it("새 테이블 7개 모두 RLS, 브라우저 역할(anon · authenticated)은 읽지 못한다", async () => {
    await db.exec("reset role;");
    const rls = (await db.query<{ tablename: string; rowsecurity: boolean }>("select tablename, rowsecurity from pg_tables where tablename like 'mirror_%' order by 1")).rows;
    expect(rls.map(r => r.tablename)).toEqual(["mirror_devices", "mirror_friend_answers", "mirror_friend_sessions", "mirror_handle_history", "mirror_handoffs", "mirror_profiles", "mirror_self_answers"]);
    expect(rls.every(r => r.rowsecurity)).toBe(true);
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role};`);
      await expect(db.query("select * from public.mirror_profiles")).rejects.toThrow(/permission denied/);
      await expect(db.query("select public.mirror_owner_board($1)", [A])).rejects.toThrow(/permission denied/);
      await db.exec("reset role;");
    }
    await db.exec("set role service_role;");
  });
  it("프로필: 만 14세 확인 필수, 아이디는 소문자로 저장 · 대소문자 무시 중복 금지", async () => {
    expect(await save(A, "민지", "minji.k", false)).toEqual({ ok: false, code: "AGE_REQUIRED" });
    expect(await save(A, "민지", "Minji.K", true, ["2001-03-04", "09:30"])).toEqual({ ok: true });
    expect((await db.query("select handle, birth_date::text, birth_time::text, is_public, handle_changed_at from public.mirror_profiles where user_id=$1", [A])).rows[0])
      .toEqual({ handle: "minji.k", birth_date: "2001-03-04", birth_time: "09:30:00", is_public: true, handle_changed_at: null });
    expect(await save(B, "서연", "MINJI.K")).toEqual({ ok: false, code: "HANDLE_TAKEN" });
    expect(await save(B, "서연", "bad handle!")).toEqual({ ok: false, code: "INPUT_INVALID" });
    expect(await save(B, "서", "seoyeon")).toEqual({ ok: false, code: "INPUT_INVALID" });
    expect(await save(B, "서연", "seoyeon", true, [null, "10:00"])).toEqual({ ok: false, code: "INPUT_INVALID" });
    expect(await save(B, "서연", "seoyeon")).toEqual({ ok: true });
  });
  it("아이디 변경: 처음 한 번은 바로, 그 뒤 30일에 한 번 · 예전 아이디는 남이 못 쓰고 본인은 되찾을 수 있다", async () => {
    expect(await save(A, "민지", "minji.new")).toEqual({ ok: true });
    expect((await db.query("select handle, user_id from public.mirror_handle_history")).rows).toEqual([{ handle: "minji.k", user_id: A }]);
    expect(await save(B, "서연", "minji.k")).toMatchObject({ ok: false, code: "HANDLE_TAKEN" });
    const cooldown = await save(A, "민지", "minji.k");
    expect(cooldown).toMatchObject({ ok: false, code: "HANDLE_COOLDOWN" });
    expect(typeof cooldown.until).toBe("string");
    // 이름 · 생일만 바꾸는 것은 30일과 무관
    expect(await save(A, "민지야", "minji.new", true, ["2001-03-04", null])).toEqual({ ok: true });
    await db.exec("reset role;");
    await db.query("update public.mirror_profiles set handle_changed_at = now() - interval '31 days' where user_id=$1", [A]);
    await db.exec("set role service_role;");
    expect(await save(A, "민지", "minji.k")).toEqual({ ok: true });
    expect((await db.query("select handle from public.mirror_handle_history order by 1")).rows).toEqual([{ handle: "minji.new" }]);
  });
  it("자가 답: 사용자 × 문항 × 버전 하나, 선택은 0/1만", async () => {
    await db.query("insert into public.mirror_self_answers(user_id,item_id,item_version,choice) values ($1,'soc-1',1,0)", [A]);
    await expect(db.query("insert into public.mirror_self_answers(user_id,item_id,item_version,choice) values ($1,'soc-1',1,1)", [A])).rejects.toThrow(/duplicate key/);
    await expect(db.query("insert into public.mirror_self_answers(user_id,item_id,item_version,choice) values ($1,'soc-2',1,2)", [A])).rejects.toThrow(/check/);
  });
  it("친구 답: 한 세션에서 같은 문항은 한 번 · 주인 기기(로그인한 채 쓴 기기 · 가입 뒤 연결) 표시", async () => {
    const dev = (c: string) => c.repeat(64);
    const s1 = (await db.query<{ id: string }>("insert into public.mirror_friend_sessions(owner_id,closeness,device_hash) values ($1,2,$2) returning id", [A, dev("1")])).rows[0].id;
    const s2 = (await db.query<{ id: string }>("insert into public.mirror_friend_sessions(owner_id,closeness,device_hash) values ($1,3,$2) returning id", [A, dev("2")])).rows[0].id;
    const s3 = (await db.query<{ id: string }>("insert into public.mirror_friend_sessions(owner_id,closeness,device_hash,linked_user_id) values ($1,1,$2,$1) returning id", [A, dev("3")])).rows[0].id;
    await db.query("insert into public.mirror_friend_answers(session_id,item_id,item_version,choice) values ($1,'soc-1',1,0),($1,'lead-1',1,2),($2,'soc-1',1,1)", [s1, s2]);
    await expect(db.query("insert into public.mirror_friend_answers(session_id,item_id,item_version,choice) values ($1,'soc-1',1,1)", [s1])).rejects.toThrow(/duplicate key/);
    await db.query("insert into public.mirror_devices(device_hash,user_id) values ($1,$2)", [dev("2"), A]);
    const board = (await db.query<{ r: Array<{ id: string; closeness: number; ownerDevice: boolean; answers: unknown[] }> }>("select public.mirror_owner_board($1) r", [A])).rows[0].r;
    // 시작 시각이 같으면 id 순이라 순서 대신 집합으로 본다.
    expect(board.map(s => [s.id, s.closeness, s.ownerDevice, s.answers.length])).toEqual(expect.arrayContaining([[s1, 2, false, 2], [s2, 3, true, 1], [s3, 1, true, 0]]));
    expect(board).toHaveLength(3);
    const first = board.find(s => s.id === s1)!;
    expect(first.answers).toHaveLength(2);
    expect(first.answers).toEqual(expect.arrayContaining([["soc-1", 1, 0], ["lead-1", 1, 2]]));
    expect((await db.query<{ r: unknown }>("select public.mirror_owner_board($1) r", [B])).rows[0].r).toEqual([]);
  });
  it("일회용 토큰 표: 기기 토큰 형식 · 돌아갈 곳은 이 사이트 경로만", async () => {
    const ok = "a".repeat(64), tok = "A".repeat(43);
    await db.query("insert into public.mirror_handoffs(token_hash,device_token,next_path,expires_at) values ($1,$2,'/@minji.k',now()+interval '10 minutes')", [ok, tok]);
    await expect(db.query("insert into public.mirror_handoffs(token_hash,device_token,next_path,expires_at) values ($1,$2,'//evil.example',now())", ["b".repeat(64), tok])).rejects.toThrow(/check/);
    await expect(db.query("insert into public.mirror_handoffs(token_hash,device_token,next_path,expires_at) values ($1,$2,'/',now())", ["c".repeat(64), "short"])).rejects.toThrow(/check/);
  });
});
