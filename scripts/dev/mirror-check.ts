/**
 * 「남이 본 나」 명령 2 로컬 확인(실제 브라우저 · 로컬 DB · 개발 서버 http://localhost:3300). 운영 · 외부 호출 없음.
 * 로컬 가드: DB · API 주소가 localhost가 아니면 거부(scripts/dev/local.ts). 화면은 ~/Desktop/gyeol-review/mirror-01/ 아래에 남긴다.
 *   pnpm exec tsx scripts/dev/mirror-check.ts prep            # 검수 계정 동의 · 프로필 · 자가 답(서연 seo.yeon · 친구 3 · 탈퇴용 1)
 *   pnpm exec tsx scripts/dev/mirror-check.ts friend           # 친구 흐름: 아는 사이 50(황금별) · 친구 60(황금별) · 가까운 사이 12 + 이야기 · 이어서 하기 · 주인 · 비공개 · 404 · 옛 아이디
 *   pnpm exec tsx scripts/dev/mirror-check.ts share            # 공유 시트 버튼 전부 + Web Share 없는 브라우저 폴백 + 카드 PNG
 *   pnpm exec tsx scripts/dev/mirror-check.ts og               # 링크 미리보기 이미지 2장 + 메타 태그
 *   pnpm exec tsx scripts/dev/mirror-check.ts stories          # 이야기 거르기 · 본인 작성 · 모두에게 공유 · 마음 · 신고 3번 숨김
 *   pnpm exec tsx scripts/dev/mirror-check.ts board            # 기록판 · 결 보고서 받기 · 장면 공유
 *   pnpm exec tsx scripts/dev/mirror-check.ts home 100|400     # 별자리 가독성(친구 100 · 400명, 3D · 2D)
 *   pnpm exec tsx scripts/dev/mirror-check.ts withdraw         # 탈퇴 → /@아이디 404 · 데이터 정리
 *   pnpm exec tsx scripts/dev/mirror-check.ts screens          # 로그인 사업자 정보 줄 · 내 계정 · 이야기 쓰기(글자 수)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium, webkit, type Browser, type BrowserContext, type Page } from "playwright-core";
import { MIRROR_ITEMS } from "../../src/data/mirror/items";
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import { seededRandom } from "../../src/lib/mirror/hash";
import { assertEnvFileLocal, assertLocal, psql } from "./local";

const BASE = process.env.MIRROR_BASE ?? "http://localhost:3300";
assertLocal(BASE, "개발 서버"); assertEnvFileLocal();
const REVIEW = join(homedir(), "Desktop/gyeol-review/mirror-01");
const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const VIEW = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "ko-KR" };
const OWNER = { as: "seoyeon", name: "서연", handle: "seo.yeon" };
const PEOPLE = [OWNER, { as: "fr1", name: "하나", handle: "hana.fr" }, { as: "fr2", name: "준호", handle: "junho_fr" }, { as: "fr3", name: "다은", handle: "daeun.fr" }, { as: "wd1", name: "떠날사람", handle: "bye.soon" }];
const log = (...a: unknown[]) => console.log(...a);
const shot = async (page: Page, dir: string, name: string) => { await page.waitForTimeout(700); mkdirSync(join(REVIEW, dir), { recursive: true }); await page.screenshot({ path: join(REVIEW, dir, `${name}.png`) }); log("  📸", `${dir}/${name}.png`); };
const uid = (as: string) => psql(`select id from auth.users where email=${q(`p6e-${as}@gyeol.local`)};`);
let failures = 0;
const check = (ok: boolean, what: string) => { log(ok ? "  ✓" : "  ✗", what); if (!ok) failures++; };

async function browser(kind: "chromium" | "webkit" = "chromium"): Promise<Browser> {
  return kind === "webkit" ? webkit.launch() : chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
}
async function login(ctx: BrowserContext, as: string, next = "/") { const p = await ctx.newPage(); await p.goto(`${BASE}/dev/v5-login?as=${as}&next=${encodeURIComponent(next)}`); return p; }
async function api(page: Page, action: string, body?: object, query = "") {
  return page.evaluate(async ([a, b, qs]) => { const r = await fetch(`/api/mirror/${a}${qs}`, b ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) } : {}); return { status: r.status, data: await r.json().catch(() => null) }; }, [action, body ?? null, query] as const);
}

function prep() {
  const rand = seededRandom(20261128);
  const records = JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })));
  for (const p of PEOPLE) {
    const id = uid(p.as);
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error(`계정 없음: ${p.as} (mirror-seed --new-owner ${p.as})`);
    psql(`select public.record_account_consent(${q(id)}, gen_random_uuid(), ${q(p.name)}, 'kakao', 'first_login', ${q(records)}::jsonb);`);
    psql(`select public.mirror_save_profile_v2(${q(id)}, ${q(p.name)}, ${q(p.handle)}, null, null, true);`);
    psql(`insert into public.mirror_self_answers(user_id,item_id,item_version,choice) values ${MIRROR_ITEMS.map(i => `(${q(id)},${q(i.id)},${i.version},${rand() < .5 ? 0 : 1})`).join(",")} on conflict do nothing;`);
    psql(`update public.mirror_profiles set self_completed_at=coalesce(self_completed_at, now()), is_public=true where user_id=${q(id)};`);
  }
  log(JSON.stringify(psql(`select handle||':'||display_name from public.mirror_profiles where handle in (${PEOPLE.map(p => q(p.handle)).join(",")}) order by 1;`).split("\n")));
}

/** 친구 한 명이 끝까지: closeness · 몇 개(묶음 단위) · 건너뛰기 수 · 이야기. 결과 화면 값을 돌려준다. */
async function friendRun(b: Browser, o: { closeness: 1 | 2 | 3; total: number; skips: number; story?: { kind: string; body: string } | null; tag: string; shots?: boolean }) {
  const ctx = await b.newContext(VIEW), page = await ctx.newPage();
  await page.goto(`${BASE}/@${OWNER.handle}`);
  await page.waitForSelector("[data-mirror-friend=landing]");
  if (o.shots) await shot(page, "flow", `friend-01-landing`);
  await page.getByRole("button", { name: `${OWNER.name}에 대해 답하기` }).click();
  await page.waitForSelector("[data-closeness]");
  if (o.shots) await shot(page, "flow", `friend-02-closeness`);
  await page.click(`[data-closeness="${o.closeness}"]`);
  let answered = 0, skipped = 0;
  while (answered < o.total) {
    await page.waitForSelector("[data-friend-count]");
    const item = await page.getAttribute("[data-item]", "data-item");
    if (o.shots && answered === 2) { await page.waitForTimeout(900); await shot(page, "flow", `friend-03-question`); }
    if (skipped < o.skips && answered % 9 === 4) { await page.click("[data-choice=skip]"); skipped++; } else await page.click("[data-choice='0']");
    answered++;
    // 다음 문항 · 체크포인트 · 이야기 중 하나가 뜰 때까지
    await page.waitForFunction(prev => { const el = document.querySelector("[data-item]"); return !el || el.getAttribute("data-item") !== prev || !!document.querySelector("[data-friend-step=story]"); }, item, { timeout: 8000 });
    const per = o.closeness === 1 ? 10 : 12;
    if (answered % per === 0 && answered < (o.closeness === 1 ? 50 : 60)) {
      await page.waitForSelector("text=개 다 답했어요");
      if (o.shots && answered === per) await shot(page, "flow", `friend-04-checkpoint`);
      if (answered >= o.total) { await page.getByRole("button", { name: "질문 끝내기" }).click(); break; }
      await page.getByRole("button", { name: /더 답하기/ }).click();
    }
  }
  await page.waitForSelector("[data-friend-step=story]");
  if (o.story) {
    await page.getByRole("radio", { name: o.story.kind }).click();
    await page.fill("textarea[name=story]", o.story.body);
    if (o.shots) await shot(page, "flow", `friend-05-story`);
    await page.getByRole("button", { name: "보내기", exact: true }).click();
  } else await page.getByRole("button", { name: "건너뛰고 보내기" }).click();
  await page.waitForSelector("[data-mirror-friend=result]", { timeout: 15000 });
  await page.waitForTimeout(400);
  const res = await page.evaluate(() => ({ golden: document.querySelector("[data-result-golden]")?.getAttribute("data-result-golden"), know: document.querySelector("[data-know]")?.getAttribute("data-know") ?? null, rank: document.querySelector("[data-rank]")?.getAttribute("data-rank") ?? null, text: document.querySelector("[data-result-golden]")?.textContent }));
  await shot(page, "flow", `friend-06-result-${o.tag}`);
  return { ctx, page, res, answered, skipped };
}

async function friend() {
  const b = await browser(), ownerId = uid(OWNER.as);
  psql(`delete from public.mirror_friend_sessions where owner_id=${q(ownerId)}; update public.mirror_profiles set is_public=true where user_id=${q(ownerId)};`);
  log("아는 사이 50문항(건너뛰기 3) → 황금별");
  const a = await friendRun(b, { closeness: 1, total: 50, skips: 3, tag: "acq50-golden", shots: true, story: null });
  check(a.res.golden === "true" && /황금별/.test(a.res.text ?? ""), `아는 사이 50 → 황금별 (${a.res.text})`);
  check(Number(psql(`select count(*) from public.mirror_friend_answers a join public.mirror_friend_sessions s on s.id=a.session_id where s.owner_id=${q(ownerId)} and s.closeness=1 and a.item_id ~ '^(check|dist)-';`)) === 0, "아는 사이에게 확인 · 거리 면 문항 0");
  await a.ctx.close();
  log("친구 60문항(건너뛰기 5) → 황금별");
  const f = await friendRun(b, { closeness: 2, total: 60, skips: 5, tag: "friend60-golden", story: null });
  check(f.res.golden === "true", `친구 60 · 건너뛰기 5 → 황금별 (${f.res.text})`);
  await f.ctx.close();
  log("가까운 사이 12문항 + 이야기 → 결과 · 순위");
  const c = await friendRun(b, { closeness: 3, total: 12, skips: 0, tag: "close12", story: { kind: "웃겼던 일", body: "수학여행 때 서연이가 버스에서 노래 부르다가 기사님한테 박수받은 거 아직도 웃겨요" } });
  check(c.res.golden === "false" && c.res.know !== null && c.res.rank !== null, `가까운 사이 12 → 아는 정도 ${c.res.know}% · 순위 ${c.res.rank}`);
  // 같은 기기로 다시: 이어서 · 같은 문항 다시 안 냄 · 최대치
  await c.page.goto(`${BASE}/@${OWNER.handle}`); await c.page.waitForSelector("[data-mirror-friend=landing]");
  check(await c.page.getByRole("button", { name: "이어서 답하기" }).count() === 1, "같은 친구가 다시 오면 「이어서 답하기」");
  await shot(c.page, "flow", "friend-07-resume");
  await c.page.getByRole("button", { name: "이어서 답하기" }).click(); await c.page.waitForSelector("[data-item]");
  const askedBefore = psql(`select string_agg(a.item_id, ',') from public.mirror_friend_answers a join public.mirror_friend_sessions s on s.id=a.session_id where s.owner_id=${q(ownerId)} and s.closeness=3;`).split(",");
  const next = await c.page.getAttribute("[data-item]", "data-item");
  check(!!next && !askedBefore.includes(next), `이어서 하기 첫 문항(${next})은 이미 받은 문항이 아니다`);
  await c.ctx.close();

  log("주인 본인 · 비공개 · 없는 아이디 · 옛 아이디");
  const oc = await b.newContext(VIEW), op = await login(oc, OWNER.as, `/@${OWNER.handle}`);
  await op.waitForSelector("[data-mirror-friend=owner]"); await shot(op, "flow", "friend-08-owner");
  check(await op.locator("text=내 페이지예요").count() === 1 && await op.getByRole("link", { name: "친구에게 물어보기" }).count() === 1, "주인: 「내 페이지예요」 + 「친구에게 물어보기」만");
  const r = await api(op, "settings", { isPublic: false }); check(r.status === 200, "비공개로 돌림");
  const pc = await b.newContext(VIEW), pp = await pc.newPage(); await pp.goto(`${BASE}/@${OWNER.handle}`); await pp.waitForSelector("[data-mirror-friend=closed]");
  await shot(pp, "flow", "friend-09-closed"); check(await pp.locator("text=지금은 답을 받지 않고 있어요").count() === 1, "비공개: 「지금은 답을 받지 않고 있어요」");
  await api(op, "settings", { isPublic: true });
  const missing = await pp.goto(`${BASE}/@no.such.person`); check(missing?.status() === 404, `없는 아이디 404 (${missing?.status()})`);
  // 옛 아이디: 하나(hana.fr) → hana.new 로 바꾼 뒤 옛 주소는 새 주소로 영구 이동, 다시 되돌린다.
  const hid = uid("fr1");
  psql(`update public.mirror_profiles set handle_changed_at=null where user_id=${q(hid)}; select public.mirror_save_profile_v2(${q(hid)}, '하나', 'hana.new', null, null, true);`);
  const moved = await pp.request.get(`${BASE}/@hana.fr`, { maxRedirects: 0 });
  check(moved.status() === 308 && /\/@hana\.new$/.test(moved.headers().location ?? ""), `옛 아이디 → 새 아이디 영구 이동 (${moved.status()} ${moved.headers().location})`);
  psql(`update public.mirror_profiles set handle_changed_at=null where user_id=${q(hid)}; select public.mirror_save_profile_v2(${q(hid)}, '하나', 'hana.fr', null, null, true); update public.mirror_profiles set handle_changed_at=null where user_id=${q(hid)};`);
  // 주인 홈: 새 친구 별이 날아와 달리고 받은 이야기 숫자가 보인다.
  await op.goto(`${BASE}/`); await op.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  await op.waitForTimeout(2500); await shot(op, "flow", "friend-10-owner-home");
  check(await op.getAttribute("[data-stories-new]", "data-stories-new") === "1", "주인 홈: 받은 이야기 숫자 1");
  // 남용: 사람이 불가능한 속도 → 무효(점수에서 빠짐)
  const bot = await b.newContext(VIEW), bp = await bot.newPage(); await bp.goto(`${BASE}/@${OWNER.handle}`); await bp.waitForSelector("[data-mirror-friend=landing]");
  const start = await api(bp, "friend-start", { handle: OWNER.handle, closeness: 2 });
  const items = (start.data?.bundle ?? []) as { id: string; version: number }[];
  for (const it of items.slice(0, 6)) await api(bp, "friend-answer", { handle: OWNER.handle, itemId: it.id, version: it.version, choice: 0 });
  check(Number(psql(`select count(*) from public.mirror_session_voids v join public.mirror_friend_sessions s on s.id=v.session_id where s.owner_id=${q(ownerId)};`)) === 1, "0.3초 미만 연속 답 → 그 세션 무효");
  await bot.close(); await oc.close(); await pc.close(); await b.close();
}

async function share() {
  const b = await browser(), ctx = await b.newContext({ ...VIEW, acceptDownloads: true, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await login(ctx, OWNER.as, "/");
  await page.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  await page.getByRole("button", { name: "친구에게 물어보기" }).click();
  await page.waitForSelector("[data-share-sheet]"); await page.waitForTimeout(800);
  await shot(page, "share", "sheet-01-open");
  const save = async (name: string) => { const [d] = await Promise.all([page.waitForEvent("download"), page.click("[data-share=save]")]); mkdirSync(join(REVIEW, "cards"), { recursive: true }); await d.saveAs(join(REVIEW, "cards", name)); log("  💾 cards/" + name); };
  await save("card-shape-count-off.png");
  await page.click("[data-toggle-count]"); await page.waitForTimeout(500); await save("card-shape-count-on.png");
  await page.fill("input[name=line]", "나 어떤 사람 같아?"); await page.waitForTimeout(1200);
  await save("card-shape-line.png");
  let saved = "";
  for (let i = 0; i < 20 && saved !== "나 어떤 사람 같아?|true"; i++) { await page.waitForTimeout(250); saved = psql(`select line||'|'||show_count from public.mirror_share_settings where user_id=${q(uid(OWNER.as))};`); }
  check(saved === "나 어떤 사람 같아?|true", `한마디 · 토글이 저장된다(${saved})`);
  // 내 사진: 기기 안에서 합성(서버로 안 보냄) · 끌기 · 확대
  const png = await page.evaluate(() => { const c = document.createElement("canvas"); c.width = 900; c.height = 1200; const g = c.getContext("2d")!; const gr = g.createLinearGradient(0, 0, 900, 1200); gr.addColorStop(0, "#f7e6c4"); gr.addColorStop(1, "#7fb2d9"); g.fillStyle = gr; g.fillRect(0, 0, 900, 1200); g.fillStyle = "#fff"; g.beginPath(); g.arc(450, 520, 230, 0, 7); g.fill(); return c.toDataURL("image/png").split(",")[1]; });
  const requests: string[] = []; page.on("request", r => { if (r.method() === "POST") requests.push(`${r.url()} ${(r.postData() ?? "").length}`); });
  await page.setInputFiles("[data-photo-input]", { name: "me.png", mimeType: "image/png", buffer: Buffer.from(png, "base64") });
  await page.waitForTimeout(800);
  const card = page.locator("[data-card=photo]"), box = (await card.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 25, box.y + box.height / 2 + 10, { steps: 5 }); await page.mouse.up();
  await card.hover(); await page.mouse.wheel(0, -300); await page.waitForTimeout(500);
  await shot(page, "share", "sheet-02-photo");
  await save("card-photo-count-on.png");
  await page.click("[data-toggle-count]"); await page.waitForTimeout(500); await save("card-photo-count-off.png");
  check(requests.every(r => !/me\.png|image\/png/.test(r) && Number(r.split(" ").pop()) < 2000), `사진은 서버로 보내지 않는다(POST ${requests.length}건, 모두 2KB 미만)`);
  await page.click("[data-card=shape]");
  // 링크 복사 · 다른 앱(Web Share 없음 → 복사) · 인스타(파일 공유 없음 → 링크 복사 + 이미지 저장) · 카카오(키 없음 → 막힘)
  await page.click("[data-share=copy]"); await page.waitForTimeout(300);
  check((await page.evaluate(() => navigator.clipboard.readText())).endsWith(`/@${OWNER.handle}`), "링크 복사 → 클립보드에 내 링크");
  check(await page.locator("text=복사했어요").count() >= 1, "링크 복사 안내 「복사했어요」");
  const hasShare = await page.evaluate(() => typeof navigator.share === "function");
  await page.evaluate(() => navigator.clipboard.writeText(""));
  if (!hasShare) { await page.click("[data-share=other]"); await page.waitForTimeout(300); check((await page.evaluate(() => navigator.clipboard.readText())).endsWith(`/@${OWNER.handle}`), "다른 앱(Web Share 없음) → 링크 복사로 폴백"); }
  await page.evaluate(() => navigator.clipboard.writeText(""));
  const [insta] = await Promise.all([page.waitForEvent("download", { timeout: 5000 }).catch(() => null), page.click("[data-share=insta]")]);
  await page.waitForTimeout(300);
  check((await page.evaluate(() => navigator.clipboard.readText())).endsWith(`/@${OWNER.handle}`), "인스타 스토리: 누르는 순간 링크 자동 복사");
  check(await page.locator("text=스토리에서 링크 스티커에 붙여 넣으세요").count() >= 1, "인스타 안내 한 줄");
  check(!!insta, "인스타 스토리(파일 공유 안 됨) → 이미지 저장으로 폴백");
  await shot(page, "share", "sheet-03-insta-toast");
  check(await page.locator("[data-share=kakao]").isDisabled(), "카카오톡: JavaScript 키 · 사이트 도메인이 없으면 버튼만 막힘");
  await ctx.close();
  // Web Share(파일)를 지원하는 브라우저 흉내: navigator.share · canShare를 넣어 두고 넘겨진 값을 본다.
  const sctx = await b.newContext({ ...VIEW, permissions: ["clipboard-read", "clipboard-write"] });
  // 문자열로 넣는다(tsx가 함수에 붙이는 __name 도우미는 브라우저에 없다).
  await sctx.addInitScript({ content: "window.__shared=[];Object.defineProperty(navigator,'canShare',{configurable:true,value:function(d){return !!(d&&d.files)}});Object.defineProperty(navigator,'share',{configurable:true,value:function(d){window.__shared.push(d.files?{files:d.files.map(function(f){return f.name+':'+f.type+':'+f.size})}:d);return Promise.resolve()}});" });
  const sp = await login(sctx, OWNER.as, "/"); await sp.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  await sp.getByRole("button", { name: "친구에게 물어보기" }).click(); await sp.waitForSelector("[data-share-sheet]"); await sp.waitForTimeout(1200);
  await sp.click("[data-share=insta]"); await sp.click("[data-share=other]"); await sp.waitForTimeout(300);
  const shared = await sp.evaluate(() => (window as unknown as { __shared: unknown[] }).__shared);
  log("  shared:", JSON.stringify(shared));
  check(JSON.stringify(shared).includes("image/png") && JSON.stringify(shared).includes(`/@${OWNER.handle}`), "Web Share 지원: 인스타 = PNG 파일, 다른 앱 = {url, text}");
  await sctx.close(); await b.close();
  // WebKit(사파리 엔진)에서도 시트가 열리고 카드가 그려지는지
  const wb = await browser("webkit"), wctx = await wb.newContext({ viewport: VIEW.viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "ko-KR" });
  const wp = await login(wctx, OWNER.as, "/"); await wp.waitForSelector("[data-mirror-screen=home]", { timeout: 30000 });
  await wp.getByRole("button", { name: "친구에게 물어보기" }).click(); await wp.waitForSelector("[data-share-sheet]"); await wp.waitForTimeout(1200);
  await shot(wp, "share", "sheet-04-webkit");
  await wp.click("[data-share=copy]"); await wp.waitForTimeout(400);
  check(await wp.locator("text=복사했어요").count() >= 1 || await wp.locator("text=링크를 복사하지 못했어요").count() >= 1, "WebKit: 링크 복사 버튼 반응");
  await wctx.close(); await wb.close();
}

async function og() {
  const b = await browser(), ctx = await b.newContext(), page = await ctx.newPage();
  mkdirSync(join(REVIEW, "og"), { recursive: true });
  for (const [h, name] of [[OWNER.handle, "og-1-seo.yeon.png"], ["minji.k", "og-2-minji.k.png"]] as const) {
    const r = await page.request.get(`${BASE}/api/mirror/og/${h}`);
    const buf = await r.body(); writeFileSync(join(REVIEW, "og", name), buf);
    check(r.status() === 200 && r.headers()["content-type"] === "image/png" && buf.length > 10_000, `OG ${h}: ${r.status()} ${r.headers()["content-type"]} ${buf.length}B`);
  }
  const html = await (await page.request.get(`${BASE}/@${OWNER.handle}`)).text();
  const ogImage = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1] ?? "", ogTitle = /<meta property="og:title" content="([^"]+)"/.exec(html)?.[1] ?? "";
  check(ogImage.endsWith(`/api/mirror/og/${OWNER.handle}`) && ogTitle.length > 0, `메타: og:title="${ogTitle}" og:image=${ogImage}`);
  check((await page.request.get(`${BASE}/api/mirror/og/no.such.person`)).status() === 404, "없는 아이디 미리보기 404");
  await b.close();
}

async function stories() {
  const b = await browser(), ownerId = uid(OWNER.as);
  // 1) 친구가 개인정보 · 욕설을 쓰면 보내기 전에 막고, 고치면 보낸다.
  const fc = await b.newContext(VIEW), fp = await fc.newPage();
  await fp.goto(`${BASE}/@${OWNER.handle}`); await fp.waitForSelector("[data-mirror-friend=landing]");
  await fp.getByRole("button", { name: `${OWNER.name}에 대해 답하기` }).click(); await fp.click('[data-closeness="2"]');
  for (let i = 0; i < 12; i++) { await fp.waitForSelector("[data-item]"); const it = await fp.getAttribute("[data-item]", "data-item"); await fp.click("[data-choice='1']"); await fp.waitForFunction(prev => { const el = document.querySelector("[data-item]"); return !el || el.getAttribute("data-item") !== prev; }, it); }
  await fp.waitForSelector("text=개 다 답했어요");
  await fp.getByRole("button", { name: "질문 끝내기" }).click(); await fp.waitForSelector("[data-friend-step=story]");
  await fp.getByRole("radio", { name: "고마웠던 일" }).click();
  for (const [text, want] of [["번호 010-1234-5678 로 연락 줘", "전화번호"], ["진짜 시발 웃겼어", "고운 말"], ["우리 집 역삼동 123-4 놀러 와", "주소"], ["계좌 110-123-456789", "계좌"], ["메일 seo@naver.com", "이메일"]] as const) {
    await fp.fill("textarea[name=story]", text); await fp.getByRole("button", { name: "보내기", exact: true }).click(); await fp.waitForTimeout(200);
    check(await fp.locator(`[role=alert]:has-text("${want}")`).count() === 1, `거르기: "${text}" → ${want}`);
  }
  await shot(fp, "stories", "01-filter");
  const serverBlocked = await api(fp, "friend-finish", { handle: OWNER.handle, story: { kind: "thanks", body: "010 1234 5678 로 전화해" } });
  check(serverBlocked.status === 400 && serverBlocked.data?.code === "STORY_FILTER", "서버도 같은 거르기(화면을 건너뛰어도 막힘)");
  await fp.fill("textarea[name=story]", "시험 기간에 서연이가 정리 노트를 통째로 빌려줘서 덕분에 살았어요. 그 노트 아직도 있어요.");
  await fp.getByRole("button", { name: "보내기", exact: true }).click(); await fp.waitForSelector("[data-mirror-friend=result]", { timeout: 15000 });
  await fc.close();
  // 2) 주인 기기에서 쓴 이야기 → 「본인 작성」: 익명으로 쓰고 같은 브라우저로 주인이 로그인하면 붙는다.
  const sc = await b.newContext(VIEW), spg = await sc.newPage();
  await spg.goto(`${BASE}/@${OWNER.handle}`); await spg.waitForSelector("[data-mirror-friend=landing]");
  const s2 = await api(spg, "friend-start", { handle: OWNER.handle, closeness: 3 });
  for (const it of (s2.data.bundle as { id: string; version: number }[]).slice(0, 3)) { await api(spg, "friend-answer", { handle: OWNER.handle, itemId: it.id, version: it.version, choice: 0 }); await spg.waitForTimeout(320); }
  await api(spg, "friend-finish", { handle: OWNER.handle, story: { kind: "funny", body: "내가 나한테 쓰는 이야기. 사실 나는 노래방 가면 마이크를 안 놓는다." } });
  await login(sc, OWNER.as, "/"); await spg.goto(`${BASE}/`); await spg.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  await spg.getByRole("button", { name: /받은 이야기/ }).click(); await spg.waitForSelector("[data-story]");
  check(await spg.locator("[data-own]").count() >= 1, "주인 기기에서 쓴 이야기에 「본인 작성」");
  // 6줄 넘는 이야기: 더 보기
  const longId = psql(`insert into public.mirror_stories(owner_id,kind,closeness,body) values (${q(ownerId)},'cool',2,${q(Array.from({ length: 9 }, (_, i) => `${i + 1}번째 줄: 서연이가 발표 직전에 모두를 웃겨서 긴장이 풀렸던 그날을 기억해요.`).join("\n"))}) returning id;`).split("\n")[0];
  await spg.reload(); await spg.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 }); await spg.getByRole("button", { name: /받은 이야기/ }).click(); await spg.waitForSelector(`[data-story="${longId}"]`);
  check(await spg.locator(`[data-story="${longId}"] >> text=더 보기`).count() === 1, "받은 이야기: 6줄까지 + 「더 보기」");
  await shot(spg, "stories", "02-received");
  // 3) 모두에게 공유: 미리보기 한 번 → 올리기 · 끄면 바로 내려감
  const card = spg.locator(`[data-story="${longId}"] [data-share-story]`);
  await card.click(); await spg.waitForSelector("[data-share-preview]"); await shot(spg, "stories", "03-share-preview");
  await spg.click("[data-share-confirm]"); await spg.waitForTimeout(400);
  check(psql(`select shared_at is not null from public.mirror_stories where id=${q(longId)};`) === "t", "켜면 「이렇게 올라가요」 미리보기 → 올리기");
  await card.click(); await spg.waitForTimeout(400);
  check(psql(`select shared_at is null from public.mirror_stories where id=${q(longId)};`) === "t", "끄면 바로 내려감");
  await card.click(); await spg.waitForSelector("[data-share-preview]"); await spg.click("[data-share-confirm]"); await spg.waitForTimeout(300);
  for (const sid of psql(`select id from public.mirror_stories where owner_id=${q(ownerId)} and shared_at is null and id<>${q(longId)};`).split("\n").filter(Boolean)) psql(`update public.mirror_stories set shared_at=now() - interval '1 minute' where id=${q(sid)};`);
  // 4) 모두의 이야기: 마음 · 이번 주 가장 많은 마음 · 신고 3번 숨김(계정 3개)
  await spg.getByRole("button", { name: "내 별" }).click();
  await spg.getByRole("button", { name: "모두의 이야기" }).click(); await spg.waitForSelector(`[data-space-story="${longId}"]`);
  await spg.locator(`[data-space-story="${longId}"] [data-heart]`).first().click(); await spg.waitForTimeout(300);
  check(psql(`select count(*) from public.mirror_story_hearts where story_id=${q(longId)};`) === "1", "마음 ♥ 계정당 하나");
  await spg.reload(); await spg.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 }); await spg.getByRole("button", { name: "모두의 이야기" }).click(); await spg.waitForSelector("text=이번 주 가장 많은 마음");
  await shot(spg, "stories", "04-space");
  await spg.locator(`[data-space-story="${longId}"] >> text=더 보기`).first().click(); await spg.waitForSelector(`[data-space-full="${longId}"]`); await shot(spg, "stories", "05-space-full");
  await sc.close();
  for (const who of ["fr1", "fr2", "fr3"]) {
    const c = await b.newContext(VIEW), p = await login(c, who, "/"); await p.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
    const r = await api(p, "report-story", { id: longId });
    log(`  신고 ${who}:`, JSON.stringify(r.data));
    if (who === "fr3") check(r.data?.hidden === true, "신고 3번째 → 자동 숨김");
    await c.close();
  }
  check(psql(`select hidden_at is not null from public.mirror_stories where id=${q(longId)};`) === "t", "숨김 저장(hidden_at)");
  const c = await b.newContext(VIEW), p = await login(c, "fr1", "/"); await p.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  const space = await api(p, "space", undefined, "?tab=latest");
  check(!JSON.stringify(space.data).includes(longId), "숨긴 이야기는 모두의 이야기에서 빠진다");
  await c.close(); await b.close();
}

async function board() {
  const b = await browser(), ctx = await b.newContext(VIEW);
  const page = await login(ctx, "flow072602", "/");
  psql(`delete from public.mirror_report_issues where owner_id=(select id from auth.users where email='p6e-flow072602@gyeol.local');`);
  await page.waitForSelector("[data-mirror-screen=home]", { timeout: 30000 });
  await page.click("[data-sync]"); await page.waitForSelector("[data-board-sync]"); await page.waitForTimeout(500);
  await shot(page, "board", "01-board");
  await page.evaluate(() => document.querySelector("[data-mirror-page=board]")?.scrollTo(0, 99999)); await page.waitForTimeout(300); await shot(page, "board", "02-board-bottom");
  await page.evaluate(() => document.querySelector("[data-mirror-page=board]")?.scrollTo(0, 0));
  await page.click("[data-issue]"); await page.waitForSelector("text=결 보고서 1호", { timeout: 15000 }); await page.waitForTimeout(400);
  await shot(page, "board", "03-report-1");
  check(psql(`select count(*) from public.mirror_report_issues where owner_id=(select id from auth.users where email='p6e-flow072602@gyeol.local');`) === "1", "결 보고서 1호 발행 · 스냅샷 저장");
  const share = page.getByRole("button", { name: /공유/ }).first();
  if (await share.count()) { await share.click(); await page.waitForSelector("[data-share-sheet=scene]"); await page.waitForTimeout(1200); await shot(page, "board", "04-scene-share"); check(true, "장면 공유 → 공유 시트(장면 카드)"); }
  else check(false, "장면 공유 버튼");
  await ctx.close(); await b.close();
}

async function home(n: number) {
  const who = "flow072602";
  const id = uid(who);
  const have = Number(psql(`select count(*) from public.mirror_friend_sessions where owner_id=${q(id)};`));
  if (have !== n) { const { spawnSync } = await import("node:child_process"); spawnSync("pnpm", ["exec", "tsx", "scripts/dev/mirror-seed.ts", "--as", who, "--friends", String(n), "--reset", "--seed", "7"], { stdio: "inherit" }); }
  const b = await browser();
  for (const mode of ["3d", "2d"] as const) {
    const ctx = await b.newContext(VIEW);
    await ctx.addInitScript({ content: "try{localStorage.setItem('gyeol-mirror-seen-v1:minji.k','9999')}catch(e){}" });
    const page = await login(ctx, who, mode === "2d" ? "/?sky=2d" : "/");
    await page.waitForSelector("[data-mirror-screen=home]", { timeout: 40000 }); await page.waitForTimeout(mode === "3d" ? 6000 : 2500);
    await shot(page, "home", `home-${n}-${mode}`);
    await ctx.close();
  }
  await b.close();
}

async function withdraw() {
  const b = await browser(), id = uid("wd1"), who = PEOPLE.find(p => p.as === "wd1")!;
  psql(`insert into public.mirror_share_settings(user_id,line) values (${q(id)},'안녕') on conflict do nothing;`);
  const ctx = await b.newContext(VIEW), page = await login(ctx, "wd1", "/");
  await page.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  check((await page.request.get(`${BASE}/@${who.handle}`)).status() === 200, "탈퇴 전 /@bye.soon 200");
  // 이 사람이 서연에게 아이디를 보이게 쓴 이야기
  const fs = psql(`insert into public.mirror_friend_sessions(owner_id,closeness,device_hash,linked_user_id) values (${q(uid(OWNER.as))},2,${q("e".repeat(64))},${q(id)}) returning id;`).split("\n")[0];
  const sid = psql(`insert into public.mirror_stories(owner_id,session_id,writer_user_id,show_handle,kind,closeness,body) values (${q(uid(OWNER.as))},${q(fs)},${q(id)},true,'thanks',2,'탈퇴 시험 이야기') returning id;`).split("\n")[0];
  const r = await page.evaluate(async () => { const x = await fetch("/auth/withdraw", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirm: "탈퇴" }) }); return { status: x.status, body: await x.json().catch(() => null) }; });
  log("  withdraw:", JSON.stringify(r));
  check(r.status === 200, "기존 탈퇴 흐름(/auth/withdraw) 성공");
  check((await page.request.get(`${BASE}/@${who.handle}`)).status() === 404, "탈퇴 즉시 /@bye.soon 404");
  check(psql(`select count(*) from public.mirror_profiles where user_id=${q(id)};`) === "0" && psql(`select count(*) from public.mirror_self_answers where user_id=${q(id)};`) === "0", "프로필 · 자가 답 삭제");
  check(psql(`select writer_user_id is null and show_handle=false from public.mirror_stories where id=${q(sid)};`) === "t" && psql(`select linked_user_id is null from public.mirror_friend_sessions where id=${q(fs)};`) === "t", "남에게 남긴 이야기 · 답은 익명으로 남음");
  check(psql(`select count(*) from public.mirror_retired_handles where handle=${q(who.handle)};`) === "1", "아이디는 「사용됨」만 남음");
  const audit = psql(`select detail->>'mirror' from public.ops_audit_log where action='account_withdrawn' and target=${q(id)} order by id desc limit 1;`);
  check(audit === "done", `감사 기록 mirror=${audit}`);
  await ctx.close(); await b.close();
}

async function screens() {
  const b = await browser();
  const g = await b.newContext(VIEW), gp = await g.newPage();
  await gp.goto(`${BASE}/`); await gp.waitForSelector("[data-mirror-screen=login]"); await gp.waitForTimeout(2800);
  await shot(gp, "screens", "01-login-business-line");
  const line = await gp.textContent("[data-business-line]");
  check(!!line && /대표/.test(line) && /사업자등록번호/.test(line) && /통신판매업 신고번호/.test(line), `로그인 맨 아래 사업자 정보 한 줄: ${line?.slice(0, 60)}…`);
  check(await gp.locator("footer:visible").count() === 0, "「남이 본 나」 화면에는 사이트 공통 푸터가 보이지 않는다");
  await g.close();
  const o = await b.newContext(VIEW), op = await login(o, OWNER.as, "/");
  await op.waitForSelector("[data-mirror-screen=home]", { timeout: 20000 });
  check(await op.locator("[data-business-line]").count() === 0, "내 홈에는 사업자 정보 줄이 없다");
  await op.getByRole("button", { name: "내 계정" }).click(); await op.waitForSelector("[data-mirror-page=me]");
  await shot(op, "screens", "02-me");
  await op.evaluate(() => document.querySelector("[data-mirror-page=me]")?.scrollTo(0, 99999)); await shot(op, "screens", "03-me-settings");
  check(await op.locator("[data-me-business]").count() === 1 && await op.locator("[data-withdraw-link]").count() === 1, "내 계정 > 설정: 사업자정보 · 탈퇴 링크");
  await o.close();
  const f = await b.newContext(VIEW), fp = await f.newPage();
  await fp.goto(`${BASE}/@${OWNER.handle}`); await fp.waitForSelector("[data-mirror-friend=landing]");
  check(await fp.locator("[data-business-line]").count() === 0, "친구 응답 화면에는 사업자 정보 줄이 없다");
  await fp.getByRole("button", { name: `${OWNER.name}에 대해 답하기` }).click(); await fp.click('[data-closeness="3"]');
  for (let i = 0; i < 12; i++) { await fp.waitForSelector("[data-item]"); const it = await fp.getAttribute("[data-item]", "data-item"); await fp.click("[data-choice='0']"); await fp.waitForFunction(prev => { const el = document.querySelector("[data-item]"); return !el || el.getAttribute("data-item") !== prev; }, it); }
  await fp.getByRole("button", { name: "질문 끝내기" }).click(); await fp.waitForSelector("[data-friend-step=story]");
  await fp.getByRole("radio", { name: "의외였던 모습" }).click();
  await fp.fill("textarea[name=story]", "평소엔 조용한데 노래방만 가면 마이크를 안 놓는 서연이. ".repeat(14));
  await shot(fp, "screens", "04-story-write-count");
  await f.close(); await b.close();
}

const cmd = process.argv[2];
const run: Record<string, () => Promise<void> | void> = { prep, friend, share, og, stories, board, withdraw, screens, home: () => home(Number(process.argv[3] ?? 100)) };
if (!run[cmd]) { console.error(`사용: ${Object.keys(run).join(" | ")}`); process.exit(2); }
Promise.resolve(run[cmd]()).then(() => { log(failures ? `실패 ${failures}` : "모두 통과"); process.exit(failures ? 1 : 0); }).catch(e => { console.error(e); process.exit(1); });
