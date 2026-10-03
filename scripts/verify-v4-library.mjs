// Local ownership E2E only; no real provider, payment, DB, or writer requests.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const bin = process.env.BOOK_BROWSER_BIN || "agent-browser", origin = "http://127.0.0.1:3188", out = "/tmp/gyeol-v4-9c", session = `library9c-${process.pid}`, checks = [];
mkdirSync(out, { recursive: true });
function cli(...args) { const r = JSON.parse(execFileSync(bin, ["--headed", "--session", session, "--json", ...args], { encoding: "utf8", timeout: 45000 })); assert.equal(r.success, true, JSON.stringify(r)); return r.data; }
const ev = code => cli("eval", code).result;
const check = (name, result) => { assert.ok(result, name); checks.push(name); process.stdout.write(`PASS ${name}\n`); };
function open(path) { cli("open", origin + path); cli("wait", "--load", "networkidle"); }
function click(text) { cli("find", "role", "button", "click", "--name", text, "--exact"); cli("wait", "--load", "networkidle"); }
function shot(name) { ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')"); cli("screenshot", `${out}/${name}.png`); }
function sizes(name) {
  for (const width of [390, 430, 768, 1440]) {
    cli("set", "viewport", String(width), width < 768 ? "844" : "960");
    check(`${name} ${width} overflow`, ev("document.documentElement.scrollWidth<=innerWidth"));
    check(`${name} ${width} browser errors`, cli("errors").errors.length === 0); shot(`${width}-${name}`);
    check(`${name} ${width} console/hydration`, !cli("console").messages.some(m => m.type === "error"));
  }
  cli("set", "viewport", "390", "844");
}
function login(provider) {
  click(provider === "kakao" ? "카카오로 계속하기" : "Google로 계속하기");
  if (ev("!!document.querySelector('fieldset')")) { cli("find", "label", "전체 동의", "check"); click("동의하고 계속하기 →"); }
}
function create(id, longName = false) {
  const { payload } = JSON.parse(readFileSync(`/tmp/gyeol-v4-9a/${id}.json`, "utf8"));
  if (longName && payload.person) payload.person.name = "긴 이름을 쓰는 고객";
  // Use the actual already-audited form projection and consent contract exported
  // by the unit test. No price/owner/auth fields accepted from this fixture.
  const body = JSON.parse(readFileSync(`${out}/request-${id}.json`, "utf8"));
  if (longName) { body.inputSnapshot.displayName = payload.person.name; body.inputSnapshot.reportInputPayload.person.name = payload.person.name; }
  return ev(`(async()=>{const r=await fetch('/dev/book-flow/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({operation:'prepare',request:${JSON.stringify(body)}})});const p=await r.json();if(!p.ok)throw new Error(JSON.stringify(p));const publish=await fetch('/dev/book-flow/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({operation:'publish',orderId:p.orderId})});const result=await publish.json();if(!result.ok)throw new Error(JSON.stringify(result));return {id:p.orderId,url:result.reportUrl,amount:p.tossCheckoutRequest.requestPayment.amount.value};})()`);
}
function backCover() {
  ev("(async()=>{for(let n=0;n<100;n++){if(document.querySelector('[data-page]')?.dataset.page==='back')return true;document.querySelector('button[aria-label=\"다음 페이지\"]').click();await new Promise(r=>setTimeout(r,70));}throw new Error('missing back cover')})()");
  cli("wait", "--load", "networkidle");
}
try {
  cli("--allowed-domains", "127.0.0.1", "open", origin + "/dev/account"); cli("set", "viewport", "390", "844"); cli("set", "media", "light", "reduced-motion"); cli("wait", "--load", "networkidle");
  cli("snapshot", "-i"); check("local server has content, no overlay", ev("document.body.innerText.includes('내 이야기를 이어서')&&!document.querySelector('[data-nextjs-dialog]')")); shot("390-login");
  // Guest gets a private cookie when the existing mock checkout creates its order.
  const guest = create("major"); check("guest has no login requirement and still pays 1290", guest.amount === 1290);
  open(guest.url); cli("wait", "[data-book-report]"); backCover(); cli("wait", "--text", "내 서재에 보관하기"); shot("390-guest-save");
  check("capability absent from JS cookies", !ev("document.cookie").includes("claim-"));
  check("claim proof absent from report URL", !ev("location.href").includes("claim"));
  cli("find", "role", "link", "click", "--name", "내 서재에 보관하기 →"); cli("wait", "--load", "networkidle");
  check("safe report return is in login path, not capability", ev("new URLSearchParams(location.search).get('next')")==guest.url);
  login("kakao"); cli("wait", "[data-book-report]"); check("login and any first consent return to original book", ev("location.pathname")===guest.url);
  backCover(); cli("wait", "--text", "내 서재에 보관하기"); click("내 서재에 보관하기"); cli("wait", "--text", "내 서재에 보관했습니다."); shot("390-saved");
  open("/dev/account"); cli("wait", 'ul[aria-label="내 책 목록"]'); check("claimed one book", ev("document.querySelectorAll('ul[aria-label=\"내 책 목록\"]>li').length")===1); sizes("one-book");
  // Direct book opening uses stored packet, no generation on click.
  cli("find", "role", "link", "click", "--name", /앞으로의/.source); cli("wait", "[data-book-report]"); backCover();
  check("already owner has no save CTA", !ev("document.body.innerText").includes("내 서재에 보관하기")); shot("390-owned-book");
  open("/dev/account"); click("로그아웃"); cli("wait", "--text", "카카오로 계속하기");
  check("logout removes library rows", ev("document.querySelectorAll('ul[aria-label=\"내 책 목록\"]>li').length")===0); shot("390-logout");
  login("google"); cli("wait", "--text", "아직 꽂힌 책이 없습니다."); sizes("empty");
  check("B cannot see A's book", ev("document.querySelector('ul[aria-label=\"내 책 목록\"]')===null"));
  open(guest.url); cli("wait", "[data-book-report]"); backCover(); check("other user cannot claim even in original purchasing browser", !ev("document.body.innerText").includes("내 서재에 보관하기"));
  open("/dev/account"); const career = create("career"); cli("reload"); cli("wait", 'ul[aria-label="내 책 목록"]');
  check("logged-in B purchase auto attached", ev("document.querySelectorAll('ul[aria-label=\"내 책 목록\"]>li').length")===1); shot("390-b-career");
  click("로그아웃"); login("kakao"); cli("wait", 'ul[aria-label="내 책 목록"]');
  const urls = { guest: guest.url, bCareer: career.url };
  for (const id of ["full", "career", "love", "compatibility", "annual"]) urls[id] = create(id, id === "full").url;
  cli("reload"); cli("wait", 'ul[aria-label="내 책 목록"]');
  check("six real generated books, no B duplicate", ev("document.querySelectorAll('ul[aria-label=\"내 책 목록\"]>li').length")===6); sizes("six-books");
  const list = ev("(async()=>{const r=await fetch('/dev/account/api/library-list');return {body:await r.json(),cache:r.headers.get('cache-control')}})()");
  check("metadata only no body/proof/account ID", !/evidencePacket|claimHash|draft|buyerId|user_id/.test(JSON.stringify(list.body)));
  check("stored publication expiry is 90 days, not local cache TTL", list.body.items.every(i => Date.parse(i.expiresAt)-Date.parse(i.publishedAt)===90*86400000));
  check("library private no-store", list.cache.includes("no-store"));
  open("/dev/account/library-preview"); cli("wait", "--text", "열람기간이 끝난 책"); sizes("long-name-expired");
  ev("document.querySelector('[data-availability=expired]').scrollIntoView({block:'center'})"); shot("390-expired-detail");
  check("expired entries disabled, not color-only", ev("!!document.querySelector('[data-availability=expired] [aria-disabled=true]') && document.body.innerText.includes('열람기간이 끝난 책')"));
  check("only local network", ev("performance.getEntriesByType('resource').every(r=>new URL(r.name).origin===location.origin)"));
  open("/dev/account"); cli("wait", 'ul[aria-label="내 책 목록"]');
  writeFileSync(`${out}/browser-results.json`, JSON.stringify({ checks, urls, result: "PASS", expiredFixture: "visual metadata only; actual SQL expiry verified separately" }, null, 2));
} finally { cli("close"); }
