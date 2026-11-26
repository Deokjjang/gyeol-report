/**
 * 「남이 본 나」 로컬 확인용 가짜 친구(명령 1/3). 로컬 Supabase(pnpm db:v5)에서만 돈다 — DB · API 주소가 localhost가 아니면 실행을 거부한다(scripts/dev/local.ts 가드).
 *   pnpm exec tsx scripts/dev/mirror-seed.ts --friends 5                    # 테스트 계정(v5-dev@gyeol.local)에게 친구 5명
 *   pnpm exec tsx scripts/dev/mirror-seed.ts --friends 40 --closeness 2 --answers 12 --reset
 *   pnpm exec tsx scripts/dev/mirror-seed.ts --owner-ready minji.k          # 주인 프로필 · 자가 60문항(무작위)이 없으면 만든다
 *   pnpm exec tsx scripts/dev/mirror-seed.ts --new-owner signup1            # 새 로컬 계정 p6e-signup1@gyeol.local(동의 · 프로필 없음) → 가입 흐름 확인
 * 옵션: --as <이름>(p6e-<이름>@gyeol.local) · --friends N · --closeness mix|1|2|3 · --answers mix|N(묶음 단위로 채움, 최대 열린 문항) · --skip 0.05 · --reset(그 주인의 친구 세션 전부 지움) · --wipe(그 주인의 이 기능 데이터 전부 지움) · --seed N
 */
import { randomUUID } from "node:crypto";
import { MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, type FacetId } from "../../src/data/mirror/items";
import { LOCAL_DEV_ACCOUNT } from "../../src/lib/account/localDevAccount";
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import { isGolden, openItemCount, type Choice, type Closeness, type FriendChoice } from "../../src/lib/mirror/engine";
import { hash32, seededRandom } from "../../src/lib/mirror/hash";
import { pickBundle } from "../../src/lib/mirror/order";
import { assertEnvFileLocal, assertLocal, localSupabase, psql } from "./local";

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const flag = (name: string) => args.includes(`--${name}`);
const q = (v: string) => `'${v.replace(/'/g, "''")}'`;

// 1) 로컬 가드: 환경 변수 · .env.development.local · supabase status가 모두 localhost여야 한다.
for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL", "LOCAL_DB_URL", "DATABASE_URL"]) if (process.env[key]) assertLocal(process.env[key]!, key);
assertEnvFileLocal();
const local = localSupabase();

/** 친구 눈에 잘 보이는 면일수록 주인 답과 잘 맞는다(SPEC 「신뢰를 얻는 장치」, 시안 SIM 값을 12면으로). */
const VISIBLE: Readonly<Record<FacetId, number>> = { soc: .86, lead: .8, emp: .78, trust: .62, plan: .8, drive: .74, imag: .58, inq: .66, emo: .55, worry: .5, check: .6, dist: .62 };

async function main() {
  const rand = seededRandom(Number(opt("seed") ?? Date.now() % 1e9));
  if (opt("new-owner")) return newOwner(opt("new-owner")!);
  const email = opt("as") ? `p6e-${opt("as")}@gyeol.local` : (opt("owner") ?? LOCAL_DEV_ACCOUNT.email);
  if (!/@gyeol\.local$/.test(email)) throw new Error("로컬 검수 계정(@gyeol.local)만 쓸 수 있어요.");
  const owner = psql(`select id from auth.users where email=${q(email)};`);
  if (!/^[0-9a-f-]{36}$/.test(owner)) throw new Error(`로컬 계정이 없어요: ${email} (pnpm db:v5 또는 --new-owner)`);

  if (flag("wipe")) {
    psql(`delete from public.mirror_friend_sessions where owner_id=${q(owner)}; delete from public.mirror_self_answers where user_id=${q(owner)}; delete from public.mirror_handle_history where user_id=${q(owner)}; delete from public.mirror_devices where user_id=${q(owner)}; delete from public.mirror_profiles where user_id=${q(owner)};`);
    console.log(JSON.stringify({ owner: email, wiped: true })); return;
  }
  if (opt("owner-ready")) {
    const handle = opt("owner-ready")!;
    psql(`select public.mirror_save_profile(${q(owner)}, '로컬 검수', ${q(handle)}, null, null, true);`);
    const have = Number(psql(`select count(*) from public.mirror_self_answers where user_id=${q(owner)};`));
    if (have < MIRROR_ITEMS.length) psql(`insert into public.mirror_self_answers(user_id,item_id,item_version,choice) values ${MIRROR_ITEMS.map(i => `(${q(owner)},${q(i.id)},${i.version},${rand() < .5 ? 0 : 1})`).join(",")} on conflict do nothing;`);
    psql(`update public.mirror_profiles set self_completed_at=coalesce(self_completed_at, now()) where user_id=${q(owner)};`);
  }
  const self = Object.fromEntries(psql(`select item_id||':'||choice from public.mirror_self_answers where user_id=${q(owner)};`).split("\n").filter(Boolean).map(r => { const [id, c] = r.split(":"); return [id, Number(c) as Choice]; }));
  if (Object.keys(self).length < MIRROR_ITEMS.length) throw new Error("주인이 자가 질문지 60개를 아직 다 답하지 않았어요(--owner-ready <아이디>로 채울 수 있어요).");
  if (flag("reset")) psql(`delete from public.mirror_friend_sessions where owner_id=${q(owner)};`);

  const friends = Number(opt("friends") ?? 5), closenessOpt = opt("closeness") ?? "mix", answersOpt = opt("answers") ?? "mix", skipRate = Number(opt("skip") ?? 0.05);
  if (!Number.isInteger(friends) || friends < 0 || friends > 1000) throw new Error("--friends는 0~1000");
  const counts = new Map<string, number>();
  for (const r of psql(`select a.item_id||':'||count(*) from public.mirror_friend_answers a join public.mirror_friend_sessions s on s.id=a.session_id where s.owner_id=${q(owner)} and a.choice<>2 group by a.item_id;`).split("\n").filter(Boolean)) { const [id, n] = r.split(":"); counts.set(id, Number(n)); }
  const rows: string[] = [], answerRows: string[] = [];
  let golden = 0, total = 0;
  for (let k = 0; k < friends; k++) {
    const closeness = (closenessOpt === "mix" ? (() => { const r = rand(); return r < .25 ? 3 : r < .7 ? 2 : 1; })() : Number(closenessOpt)) as Closeness;
    if (![1, 2, 3].includes(closeness)) throw new Error("--closeness는 mix · 1 · 2 · 3");
    const open = openItemCount(closeness), per = closeness === 1 ? 10 : 12;
    const want = answersOpt === "mix" ? (() => { const r = rand(); return r < .1 ? open : r < .3 ? per * 2 : per; })() : Math.min(open, Math.max(1, Number(answersOpt)));
    const id = randomUUID(), skill = (rand() - .5) * .2, asked = new Set<string>(), answers: { itemId: string; choice: FriendChoice }[] = [];
    while (answers.length < want) {
      const bundle = pickBundle({ closeness, asked, ownerCounts: counts, seed: id });
      if (!bundle.length) break;
      for (const item of bundle) {
        if (answers.length >= want) break;
        asked.add(item.id);
        const choice: FriendChoice = rand() < skipRate ? "skip" : (rand() < Math.min(.97, VISIBLE[item.facet] + skill) ? self[item.id] : (1 - self[item.id]) as Choice);
        answers.push({ itemId: item.id, choice });
        if (choice !== "skip") counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
      }
    }
    const gold = isGolden({ closeness, answers }); if (gold) golden++;
    const start = new Date(Date.now() - (friends - k) * 3_600_000 * (1 + rand())).toISOString();
    rows.push(`(${q(id)},${q(owner)},${closeness},${q(hash32(`${id}:d`).toString(16).padStart(8, "0").repeat(8))},${q(start)},${q(start)},${gold})`);
    answers.forEach((a, i) => answerRows.push(`(${q(id)},${q(a.itemId)},${MIRROR_ITEM_BY_ID.get(a.itemId)!.version},${a.choice === "skip" ? 2 : a.choice},${q(new Date(Date.parse(start) + i * 4000).toISOString())})`));
    total += answers.length;
  }
  for (let i = 0; i < rows.length; i += 200) psql(`insert into public.mirror_friend_sessions(id,owner_id,closeness,device_hash,started_at,ended_at,golden) values ${rows.slice(i, i + 200).join(",")};`);
  for (let i = 0; i < answerRows.length; i += 2000) psql(`insert into public.mirror_friend_answers(session_id,item_id,item_version,choice,answered_at) values ${answerRows.slice(i, i + 2000).join(",")};`);
  const now = psql(`select count(*) from public.mirror_friend_sessions where owner_id=${q(owner)};`);
  console.log(JSON.stringify({ owner: email, added: friends, answers: total, golden, sessionsNow: Number(now), facets: MIRROR_FACET_IDS.length, db: new URL(local.DB_URL).host }));
}

/** 새 로컬 계정(동의 · 프로필 없음): 로그인은 /dev/v5-login?as=<이름>&next=/ */
async function newOwner(name: string) {
  if (!/^[a-z0-9-]{2,20}$/.test(name)) throw new Error("--new-owner 이름은 영문 소문자 · 숫자 · - 2~20자");
  const email = `p6e-${name}@gyeol.local`, headers = { apikey: local.SERVICE_ROLE_KEY, authorization: `Bearer ${local.SERVICE_ROLE_KEY}`, "content-type": "application/json" };
  const list = await (await fetch(`${local.API_URL}/auth/v1/admin/users?per_page=1000`, { headers })).json() as { users: { id: string; email: string }[] };
  let user = list.users.find(u => u.email === email);
  if (!user) {
    const r = await fetch(`${local.API_URL}/auth/v1/admin/users`, { method: "POST", headers, body: JSON.stringify({ email, password: LOCAL_DEV_ACCOUNT.password, email_confirm: true, user_metadata: { full_name: `새 회원 ${name}` } }) });
    if (!r.ok) throw new Error(`계정 생성 실패: HTTP ${r.status}`);
    user = await r.json() as { id: string; email: string };
  }
  await fetch(`${local.API_URL}/auth/v1/admin/users/${user.id}`, { method: "PUT", headers, body: JSON.stringify({ app_metadata: { provider: "kakao", providers: ["kakao"] } }) });
  console.log(JSON.stringify({ owner: email, userId: user.id, login: `/dev/v5-login?as=${name}&next=/`, consentVersions: ACCOUNT_POLICY_VERSIONS }));
}

main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
