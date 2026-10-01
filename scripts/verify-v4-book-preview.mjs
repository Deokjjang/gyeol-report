// Local-only browser acceptance. Uses an already installed agent-browser CLI.
// BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-book-preview.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const bin = process.env.BOOK_BROWSER_BIN || "agent-browser";
const url = process.env.BOOK_PREVIEW_URL || "http://127.0.0.1:3188/dev/book-preview";
assert.equal(new URL(url).hostname, "127.0.0.1", "Never run this against Production");
const out = "/tmp/gyeol-v4-8a";
mkdirSync(out, { recursive: true });
const session = "book8a-acceptance";
const results = [];
function cli(...args) {
  const r = JSON.parse(execFileSync(bin, ["--session", session, "--json", ...args], { encoding: "utf8", timeout: 45000 }));
  assert.equal(r.success, true, JSON.stringify(r));
  return r.data;
}
const evaluate = js => cli("eval", js).result;
const wait = () => cli("wait", "620");
const click = name => cli("find", "role", "button", "click", "--name", name);
function check(label, condition) { assert.ok(condition, label); results.push(label); }
function shot(name) { cli("screenshot", `${out}/${name}.png`); }
function screen(label) {
  check(`${label}: no overflow/overlay`, evaluate(`document.documentElement.scrollWidth <= innerWidth && !document.querySelector('[data-nextjs-dialog]')`));
  check(`${label}: no internal evidence text`, !/sourceRefs|confidence|seedIds|fusionIds|natalEvidence/.test(evaluate("document.body.innerText")));
}
function home() {
  cli("open", url); cli("wait", "--load", "networkidle");
  click("책 자동 회전 멈춤");
}
function next() { click("다음 페이지"); wait(); }
function stage(value) { check(`stage: ${value}`, evaluate("document.querySelector('[data-book-preview]').dataset.stage") === value); }
try {
  cli("--allowed-domains", "127.0.0.1", "open", url);
  cli("set", "viewport", "390", "844"); home();
  // Hide only the framework dev indicator in captures, not any product element.
  evaluate("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')");
  screen("390 home"); shot("390-home");
  const bookBounds = evaluate(`Array.from(document.querySelectorAll('[data-center]')).filter(e=>getComputedStyle(e).visibility!=='hidden').map(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))`);
  check("390 all visible covers fit viewport", bookBounds.every(b => b.left >= 0 && b.right <= 390));
  cli("focus", '[data-center="true"]'); cli("press", "ArrowRight"); wait();
  check("cover keyboard right", evaluate("document.querySelector('[data-center=true]').getAttribute('aria-label')").includes("내가"));
  cli("press", "ArrowLeft"); wait();
  check("cover keyboard left", evaluate("document.querySelector('[data-center=true]').getAttribute('aria-label')").includes("나라는"));
  // Pointer gesture with real mouse events follows the same pointer path as touch.
  cli("mouse", "move", "285", "575"); cli("mouse", "down"); cli("mouse", "move", "100", "575"); cli("mouse", "up"); wait();
  check("cover horizontal gesture", evaluate("document.querySelector('[data-center=true]').getAttribute('aria-label')").includes("내가"));
  click("이전 책"); wait();
  click("나라는 사람 펼치기"); cli("wait", "220"); shot("390-book-opening"); cli("wait", "850"); stage("input");
  screen("390 input"); shot("390-input");
  cli("fill", "#person-name", "서진");
  cli("set", "viewport", "390", "480"); cli("focus", "#person-time"); cli("scrollintoview", "#person-time");
  check("short visual viewport: focused field visible", evaluate("document.querySelector('#person-time').getBoundingClientRect().bottom < innerHeight"));
  cli("set", "viewport", "390", "844");
  next(); check("input page 2", evaluate("document.querySelector('[data-page]').dataset.page") === "input-1");
  cli("select", "#mbti", ""); check("unknown MBTI selection", evaluate("document.querySelector('#mbti').value") === "");
  cli("select", "#mbti", "ENTJ"); next(); stage("receipt");
  screen("390 receipt"); shot("390-receipt-guest");
  check("order initially disabled", evaluate("Array.from(document.querySelectorAll('button')).find(e=>e.textContent==='발행 체험 →').disabled"));
  cli("scrollintoview", "input[type=checkbox]");
  cli("find", "label", "전체 동의", "check");
  check("all consent checks all", evaluate("Array.from(document.querySelectorAll('input[type=checkbox]')).every(e=>e.checked)"));
} catch (error) {
  shot("failure"); cli("close"); throw error;
}
// Continued separately to keep failures attributable to an actual UI boundary.
try {
  // Toggle the first individual checkbox via its label; all-consent must follow.
  evaluate("document.querySelectorAll('input[type=checkbox]')[1].click()");
  check("individual deselection clears all", !evaluate("document.querySelector('input[type=checkbox]').checked"));
  cli("find", "label", "전체 동의", "check");
  cli("click", '[aria-label="영수증 체험 상태"] button:last-child'); shot("390-receipt-member");
  check("member only omits previously-agreed general terms", evaluate("document.querySelectorAll('input[type=checkbox]').length") === 5);
  cli("click", '[aria-label="영수증 체험 상태"] button:first-child');
  click("발행 체험 →"); stage("publishing"); cli("wait", "1100"); shot("390-publishing"); cli("wait", "3600"); stage("complete"); shot("390-completed");
  click("완성된 책 펼치기"); cli("wait", "1000"); stage("reader"); screen("390 reader"); shot("390-report");
  check("reader no visible site footer", evaluate("Array.from(document.querySelectorAll('footer')).every(e=>getComputedStyle(e).display==='none')"));
  click("각주 1 현침살"); shot("390-footnote"); check("native modal open", evaluate("document.querySelector('dialog').open"));
  cli("press", "Escape"); check("Escape dismisses note", !evaluate("document.querySelector('dialog').open"));
  click("다음 페이지"); cli("wait", "80"); shot("390-page-turn"); wait();
  check("natal table page", evaluate("document.querySelector('[data-page]').dataset.page") === "manse"); shot("390-manse");
  next(); check("MBTI page", evaluate("document.querySelector('[data-page]').dataset.page") === "mbti");
  next(); shot("390-chapter");
  for (const width of [430, 768, 1440]) {
    cli("set", "viewport", String(width), "960"); screen(`${width} reader`); shot(`${width}-report`);
    const w = evaluate("document.querySelector('[data-page]').getBoundingClientRect().width");
    check(`${width} reading width`, width < 768 ? w >= 400 : w >= 620 && w <= 720);
  }
  cli("set", "viewport", "390", "844");
  for (let i = 0; i < 11; i++) next();
  check("all 11 narrative chapters reachable, then glossary", evaluate("document.querySelector('[data-page]').dataset.page") === "glossary");
  shot("390-glossary"); next(); check("back cover last", evaluate("document.querySelector('[data-page]').dataset.page") === "back"); shot("390-back-cover");
  click("링크 복사"); check("share is explicit demo", evaluate("document.body.innerText").includes("실제 공유나 복사는 실행하지 않습니다"));
  click("안내 닫기"); click("책장 ↗");
  cli("scroll", "down", "800"); shot("390-footer");
  cli("click", "summary"); check("legal details expand", evaluate("document.querySelector('details').open"));
  for (const width of [430, 768, 1440]) {
    cli("set", "viewport", String(width), "960"); cli("scroll", "up", "3000"); screen(`${width} home`); shot(`${width}-home`);
  }
  // Product-specific third pages, without any API call.
  cli("set", "viewport", "390", "844");
  for (const [offset, expected] of [[2, "relationship"], [3, "other-name"], [5, "year"]]) {
    home(); for (let i = 0; i < offset; i++) { click("다음 책"); wait(); }
    cli("click", '[data-center="true"]'); cli("wait", "1000"); next();
    if (offset === 3) cli("select", "#category", "parentChild");
    next(); check(`product-specific ${expected}`, evaluate(`!!document.getElementById('${expected}')`));
    if (offset === 3) check("parent role input", evaluate("document.body.innerText").includes("자녀 이름"));
  }
  home(); cli("set", "media", "light", "reduced-motion"); click("책 자동 회전 켜기"); cli("wait", "100");
  check("reduced motion recognized", evaluate("document.querySelector('[data-book-preview]').dataset.reducedMotion") === "true");
  const selected = evaluate("document.querySelector('[data-center=true]').getAttribute('aria-label')");
  cli("wait", "6800"); check("reduced motion stops auto", evaluate("document.querySelector('[data-center=true]').getAttribute('aria-label')") === selected);
  const consoleData = cli("console"), errors = cli("errors");
  writeFileSync(`${out}/console.json`, JSON.stringify(consoleData, null, 2));
  writeFileSync(`${out}/errors.json`, JSON.stringify(errors, null, 2));
  check("no hydration/console errors", !JSON.stringify(consoleData).includes('"type":"error"'));
  check("no page errors", !JSON.stringify(errors).includes('"message"'));
  const network = cli("network", "requests");
  writeFileSync(`${out}/network.json`, JSON.stringify(network, null, 2));
  check("no backend/provider requests", !/supabase|toss|openai|facebook|\/api\//i.test(JSON.stringify(network)));
  writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  process.stdout.write(`${results.length} browser checks PASS; screenshots: ${out}\n`);
} catch (error) { shot("failure"); throw error; }
finally { cli("close"); }
