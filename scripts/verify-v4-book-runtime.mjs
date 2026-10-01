// Dev-only Phase 8C acceptance; first export actual packets with bookRuntime.test.
// BOOK_BROWSER_BIN=/installed/agent-browser node scripts/verify-v4-book-runtime.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const bin = process.env.BOOK_BROWSER_BIN || "agent-browser";
const url = process.env.BOOK_PREVIEW_URL || "http://127.0.0.1:3188/dev/book-preview";
assert.equal(new URL(url).hostname, "127.0.0.1", "Local only");
const out = "/tmp/gyeol-v4-8c", session = `book8c-${process.pid}`, results = [];
mkdirSync(out, { recursive: true });
function cli(...args) {
  const r = JSON.parse(execFileSync(bin, ["--headed", "--session", session, "--json", ...args], { encoding: "utf8", timeout: 45000 }));
  assert.equal(r.success, true, JSON.stringify(r)); return r.data;
}
const evaluate = js => cli("eval", js).result;
const wait = ms => cli("wait", String(ms));
const click = name => cli("click", `button[aria-label="${name}"]`);
const shot = name => cli("screenshot", `${out}/${name}.png`);
function check(label, value) { assert.ok(value, label); results.push(label); process.stdout.write(`PASS ${label}\n`); }
const selected = () => evaluate("document.querySelector('[data-center=true]').getAttribute('aria-label')");
const stage = () => evaluate("document.querySelector('[data-book-preview]').dataset.stage");
function screen(label) {
  check(`${label}: width fits and only chapter scrolls`, evaluate(`document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight+1 && Array.from(document.querySelectorAll('[data-page], [data-page] table')).every(e=>e.scrollWidth <= e.clientWidth+1)`));
  check(`${label}: no internal text`, !/sourceRefs|confidence|seedIds|fusionIds|natalEvidence|calendarMonths:|v4_structure:|MYOSI|망신/.test(evaluate("document.body.innerText")));
  check(`${label}: one mounted chapter`, evaluate("document.querySelectorAll('[data-page]').length === 1 && document.querySelectorAll('[data-page] *').length < 1200"));
  check(`${label}: no visible footer/duplicate brand`, evaluate(`Array.from(document.querySelectorAll('footer')).every(e=>getComputedStyle(e).display==='none') && !document.querySelector('[aria-label="책 읽기 위치"]').innerText.includes('GYEOL REPORT')`));
}
function open(path = "") {
  cli("open", url + path); cli("wait", "--load", "networkidle");
  evaluate("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')");
}
function page(n) {
  // Exercise real navigation handlers (no React state/properties injection).
  const actual = evaluate(`(async()=>{for(let i=0;i<50;i++){const p=document.querySelector('[data-page]');if(Number(p.dataset.pageNumber)===${n})return Number(p.dataset.pageNumber);document.querySelector(Number(p.dataset.pageNumber)<${n}?'button[aria-label="다음 페이지"]':'button[aria-label="이전 페이지"]').click();await new Promise(r=>setTimeout(r,75));}return 0;})()`);
  assert.equal(actual, n); wait(100);
}
function sizes(label) {
  for (const width of [390, 430, 768, 1440]) {
    cli("set", "viewport", String(width), width < 768 ? "844" : "960"); screen(`${width} ${label}`); shot(`${width}-${label}`);
  }
  cli("set", "viewport", "390", "844");
}
try {
  cli("--allowed-domains", "127.0.0.1", "open", url);
  cli("set", "viewport", "390", "844"); open(); cli("mouse", "move", "1", "1");
  check("no auto-control button or empty slot", !evaluate("document.body.innerText").match(/자동 회전|재생|일시정지/));
  const first = selected(); wait(6700); check("auto advances", selected() !== first);
  click("다음 책"); cli("mouse", "move", "1", "1"); const manual = selected(); wait(4500); check("manual pauses auto", selected() === manual);
  wait(4100); check("idle resumes auto", selected() !== manual);
  // Synthetic pointerType=touch exercises the real mobile handler. All selection
  // assertions use DOM and the same click event synthesized by a browser tap.
  const side = evaluate(`(()=>{const b=Array.from(document.querySelectorAll('[data-center=false]')).find(e=>Math.abs(Number(e.style.getPropertyValue('--offset')))===1);const r=b.getBoundingClientRect();b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',clientX:r.x+5,clientY:r.y+5}));b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch',clientX:r.x+5,clientY:r.y+5}));b.click();return b.getAttribute('aria-label').replace(' 선택','');})()`);
  wait(600); check("side touch selects only", selected().includes(side) && stage() === "home"); shot("390-side-book-selected");
  cli("mouse", "move", "1", "1"); wait(8600); check("side selection idle resumes", !selected().includes(side));
  const beforeHidden = selected(), originalTab = cli("tab").tabs.find(t => t.active).tabId;
  cli("tab", "new", url); wait(6900); cli("tab", originalTab);
  check("hidden tab pauses automatic movement", selected() === beforeHidden);
  cli("mouse", "move", "1", "1"); wait(6700); check("visible tab resumes automatic movement", selected() !== beforeHidden);
  cli("set", "media", "light", "reduced-motion"); wait(100); const reduced = selected(); wait(6700); check("reduced motion disables automatic movement", selected() === reduced);
  cli("focus", '[data-center="true"]'); cli("press", "ArrowRight"); wait(100); check("reduced motion keeps keyboard", selected() !== reduced);
  const touchPoint = evaluate(`(()=>{const r=document.querySelector('[aria-label="책 표지"]').getBoundingClientRect(),y=r.top+r.height/2;for(let x=8;x<innerWidth-8;x+=4){const b=document.elementFromPoint(x,y)?.closest('[data-center=false]');if(b&&getComputedStyle(b).visibility!=='hidden')return {x,y,label:b.getAttribute('aria-label').replace(' 선택','')};}return null;})()`);
  check("visible side-book has a real hit target", touchPoint);
  cli("mouse", "move", String(touchPoint.x), String(touchPoint.y)); cli("mouse", "down"); cli("mouse", "up"); wait(100);
  check("actual side-book hit selects without opening", selected().includes(touchPoint.label) && stage() === "home");
  for (const width of [390, 430, 768, 1440]) {
    cli("set", "viewport", String(width), "844"); check(`${width} home overflow`, evaluate("document.documentElement.scrollWidth <= innerWidth")); shot(`${width}-home`);
  }
  cli("set", "viewport", "390", "844"); open("?book=full");
  cli("click", '[data-center="true"]'); wait(100); check("center opens selected book input", stage() === "input");
  click("다음 페이지"); wait(100); check("actual receipt", stage() === "receipt"); shot("390-receipt-guest");
  check("terms default collapsed", !evaluate("!!document.querySelector('dialog[open]')"));
  click("이용약관·개인정보·환불정책 동의 상세 보기"); shot("390-terms-detail"); cli("press", "Escape");
  cli("find", "label", "전체 동의", "check"); check("all consents checked", evaluate("Array.from(document.querySelectorAll('input[type=checkbox]')).every(e=>e.checked)"));
  evaluate("document.querySelectorAll('input[type=checkbox]')[1].click()"); check("individual uncheck and indeterminate", evaluate("!document.querySelector('input[type=checkbox]').checked && document.querySelector('input[type=checkbox]').indeterminate"));
  cli("click", '[aria-label="영수증 체험 상태"] button:last-child'); shot("390-receipt-member");
  cli("back"); wait(100); check("browser back returns to bookshelf", stage() === "home");
  const products = ["comprehensive", "career", "love", "compatibility", "major", "annual"];
  for (const id of products) {
    const data = JSON.parse(readFileSync(`${out}/data/${id}.json`, "utf8"));
    open(`?fixture=${id}&book=${data.bookId}&read=1`); check(`${id} actual name`, evaluate("document.body.innerText").includes(data.people[0].name));
    const find = kind => data.pages.findIndex(p => p.kind === kind) + 1;
    page(find("manse")); sizes(`${id}-manse`);
    if (id === "comprehensive") check("five element colors preserved", evaluate("new Set(Array.from(document.querySelectorAll('[data-element]')).map(e=>getComputedStyle(e).color)).size") === 5);
    if (id === "love") check("unknown hour visible, no invented Hanja", evaluate("document.querySelector('[data-page]').innerText").includes("미확인"));
    page(find("mbti")); sizes(`${id}-mbti`);
    if (id === "comprehensive") {
      check("selected and opposite MBTI axes present", evaluate("new Set(Array.from(document.querySelectorAll('[data-selected]')).map(e=>e.dataset.selected)).size") === 2);
      page(find("narrative")); sizes("narrative");
      evaluate("document.querySelector('[data-page]').scrollTop=100000"); shot("390-chapter-bottom-notes");
      check("bottom footnotes visible", evaluate("document.querySelector('[aria-label=\"이 장의 각주\"]').getBoundingClientRect().bottom < innerHeight"));
      click("다음 페이지"); wait(100); check("page turn resets scroll", evaluate("document.querySelector('[data-page]').scrollTop") === 0);
      page(find("appendix")); sizes("appendix"); evaluate("document.querySelector('[data-page]').scrollTop=100000"); shot("390-appendix-bottom");
    }
    if (id === "major" || id === "annual" || id === "compatibility") {
      const kind = id === "major" ? "timeline" : id === "annual" ? "months" : "pair";
      page(find(kind)); sizes(kind);
      if (id === "major") check("14 years mounted with ages", evaluate("document.querySelectorAll('[data-year]').length") === 14);
      if (id === "annual") check("12 months mounted", evaluate("document.querySelectorAll('[data-month]').length") === 12);
      evaluate("document.querySelector('[data-page]').scrollTop=100000"); shot(`390-${kind}-bottom`);
      if (id !== "compatibility") {
        const selector = id === "major" ? '[data-year="2036"] button' : '[data-month="12"] button';
        cli("click", selector); wait(100); check(`${id} overview opens detail`, evaluate("document.querySelector('[data-page]').dataset.page") === "narrative"); sizes(`${id}-detail`);
      }
    }
    page(data.pages.length); screen(`${id} final/back`);
    check(`${id} final intact`, evaluate("document.querySelector('[data-final-line]').textContent") === data.pages.at(-1).finalLine);
    check(`${id} 3 share icons`, evaluate("document.querySelectorAll('[aria-label=\"이 책 공유하기 미리보기\"] svg').length") === 3);
    shot(`390-${id}-back-cover`);
    if (id === "comprehensive") { cli("set", "viewport", "1440", "960"); shot("1440-back-cover"); cli("set", "viewport", "390", "844"); }
  }
  const major = JSON.parse(readFileSync(`${out}/data/major.json`, "utf8"));
  open("?book=major&read=1"); page(major.pages.findIndex(p => p.kind === "narrative" && p.title.startsWith("2036년")) + 1);
  cli("set", "media", "light"); wait(100);
  check("normal motion restored", evaluate("document.querySelector('[data-book-preview]').dataset.reducedMotion") === "false");
  const beforeTurn = evaluate("Number(document.querySelector('[data-page]').dataset.pageNumber)");
  evaluate("document.querySelector('[data-page]').scrollTop=100000;const b=document.querySelector('button[aria-label=\"이전 페이지\"]');b.click();b.click()"); wait(80); shot("390-long-page-turn"); wait(550);
  check("long-page rapid turn advances once and resets scroll", evaluate("Number(document.querySelector('[data-page]').dataset.pageNumber)") === beforeTurn - 1 && evaluate("document.querySelector('[data-page]').scrollTop") === 0);
  screen("long page normal animation");
  for (const id of ["full-unknown", "full-approximate", "pair-03-parent", "pair-05-manager"]) {
    const data = JSON.parse(readFileSync(`${out}/data/${id}.json`, "utf8"));
    open(`?fixture=${id}&book=${data.bookId}&read=1`); page(data.pages.findIndex(p => p.kind === (id === "full-unknown" ? "mbti" : id === "full-approximate" ? "manse" : "pair")) + 1);
    screen(id); shot(`390-${id}`);
    if (id === "full-unknown") check("unknown MBTI no inferred type", evaluate("document.body.innerText").includes("MBTI 모름"));
    if (id.startsWith("pair")) check(`${id} fixed roles`, data.people.every(p => evaluate("document.body.innerText").includes(p.role)));
  }
  const errors = cli("errors"), consoleData = cli("console"), network = cli("network", "requests");
  writeFileSync(`${out}/errors.json`, JSON.stringify(errors)); writeFileSync(`${out}/console.json`, JSON.stringify(consoleData)); writeFileSync(`${out}/network.json`, JSON.stringify(network));
  check("no hydration/console errors", !JSON.stringify(consoleData).includes('"type":"error"'));
  check("no page errors", !JSON.stringify(errors).includes('"message"'));
  check("no backend/provider calls", !/supabase|toss|openai|facebook|\/api\//i.test(JSON.stringify(network)));
  writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  process.stdout.write(`${results.length} checks PASS; ${out}\n`);
} catch (error) { shot("failure"); throw error; }
finally { cli("close"); }
