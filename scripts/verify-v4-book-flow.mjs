// Local-only acceptance of the same gated public components. Export inputs via
// BOOK_FLOW_EXPORT=/tmp/gyeol-v4-9a pnpm test tests/unit/app/bookPublicFlow.test.tsx
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const bin = process.env.BOOK_BROWSER_BIN || "agent-browser", origin = process.env.BOOK_FLOW_ORIGIN || "http://127.0.0.1:3188";
assert.equal(new URL(origin).hostname, "127.0.0.1");
const out = "/tmp/gyeol-v4-9a", session = `book9a-${process.pid}`, checks = [], urls = {};
mkdirSync(out, { recursive: true });
function cli(...args) { const r = JSON.parse(execFileSync(bin, ["--headed", "--session", session, "--json", ...args], { encoding: "utf8", timeout: 45000 })); assert.equal(r.success, true, JSON.stringify(r)); return r.data; }
const ev = source => cli("eval", source).result;
const wait = ms => cli("wait", String(ms));
const check = (label, condition) => { assert.ok(condition, label); checks.push(label); process.stdout.write(`PASS ${label}\n`); };
const shot = name => cli("screenshot", `${out}/${name}.png`);
function open(path) { cli("open", origin + path); cli("wait", "--load", "networkidle"); ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')"); }
function clickText(text) { ev(`(()=>{const el=Array.from(document.querySelectorAll('button')).find(e=>e.textContent.trim()===${JSON.stringify(text)});if(!el)throw new Error('Missing button');el.click();return true;})()`); wait(120); }
function until(selector) { cli("wait", selector); }
function fits(label) { check(label + " overflow", ev("document.documentElement.scrollWidth <= innerWidth && Array.from(document.querySelectorAll('[data-page], [data-page] table, [aria-label=\"책 입력\"]')).every(e=>e.scrollWidth<=e.clientWidth+1)")); check(label + " errors", cli("errors").errors.length === 0); }
function sizes(label) { for (const width of [390, 430, 768, 1440]) { cli("set", "viewport", String(width), width < 768 ? "844" : "960"); fits(`${width} ${label}`); shot(`${width}-${label}`); } cli("set", "viewport", "390", "844"); }
function selectLabel(label, value) { ev(`(()=>{const el=Array.from(document.querySelectorAll('label')).find(l=>Array.from(l.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim()===${JSON.stringify(label)})?.querySelector('select');if(!el)throw new Error('Missing label '+${JSON.stringify(label)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`); }
function fillPerson(prefix, p) {
  const nativeFill = (selector, value) => ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return e.value;})()`);
  cli("fill", `#${prefix}-name`, p.name); nativeFill(`#${prefix}-birthDate`, p.birthDate); cli("select", `#${prefix}-gender`, p.gender);
  const mode = p.paidBirthTimeMode, index = ["exact", "approximate", "unknown"].indexOf(mode);
  ev(`document.querySelectorAll('input[name="${prefix}-precision"]')[${index}].click()`);
  if (mode === "exact") nativeFill(`#${prefix}-birthTime`, p.birthTime);
  if (mode === "approximate") cli("select", `#${prefix}-birthTime`, p.timeBranch);
}
function page(target) {
  ev(`(async()=>{for(let n=0;n<80;n++){const p=document.querySelector('[data-page]');if(Number(p.dataset.pageNumber)===${target})return true;document.querySelector(Number(p.dataset.pageNumber)<${target}?'button[aria-label="다음 페이지"]':'button[aria-label="이전 페이지"]').click();await new Promise(r=>setTimeout(r,70));}throw new Error('page missing');})()`);
}
try {
  cli("--allowed-domains", "127.0.0.1", "open", origin + "/dev/book-flow"); cli("set", "viewport", "390", "844"); cli("set", "media", "light", "reduced-motion");
  until("[data-book-home]");
  const first = ev("document.querySelector('[data-center=true]').getAttribute('aria-label')");
  wait(6700);
  check("reduced motion disables auto", ev("document.querySelector('[data-center=true]').getAttribute('aria-label')") === first);
  cli("set", "media", "light", "no-preference");
  ev("document.querySelector('section[aria-label=\"여섯 권의 책 고르기\"]').dispatchEvent(new PointerEvent('pointerout',{bubbles:true,pointerType:'mouse'}))");
  const autoChecks = ev("(async()=>{const selected=()=>document.querySelector('[data-center=true]').getAttribute('aria-label');const pause=ms=>new Promise(r=>setTimeout(r,ms));const first=selected();await pause(6750);const advances=selected()!==first;document.querySelector('[aria-label=\"다음 책\"]').click();await pause(50);const manual=selected();await pause(6750);const pauses=selected()===manual;await pause(2200);const resumes=selected()!==manual;Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));const hidden=selected();await pause(6750);const hiddenPauses=selected()===hidden;delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));await pause(6750);return {advances,pauses,resumes,hiddenPauses,visibleResumes:selected()!==hidden};})()");
  for (const [name, result] of Object.entries(autoChecks)) check(`auto ${name}`, result);
  cli("set", "media", "light", "reduced-motion");
  sizes("home");
  check("no play pause control", !/재생|일시정지/.test(ev("document.body.innerText")));
  ev("(()=>{const b=Array.from(document.querySelectorAll('[data-center=false]')).find(e=>Math.abs(Number(e.style.getPropertyValue('--offset')))===1);b.click();return true;})()"); wait(100);
  check("side selects only", ev("location.pathname === '/dev/book-flow'")); shot("390-side-select");
  for (const id of ["full", "career", "love", "compatibility", "major", "annual"]) {
    const { book, state, view } = JSON.parse(readFileSync(`${out}/${id}.json`, "utf8"));
    open("/dev/book-flow");
    ev(`(()=>{const b=Array.from(document.querySelectorAll('[data-center]')).find(e=>e.getAttribute('aria-label').startsWith(${JSON.stringify(view.data.title)}));if(b.dataset.center!=='true')b.click();return true;})()`); wait(100);
    ev("document.querySelector('[data-center=true]').click()"); until("#a-name");
    check(`${id} center opens correct actual input`, ev(`new URLSearchParams(location.search).get('product')===${JSON.stringify(book.slug)}`));
    if (id === "full") { clickText("다음 페이지 →"); check("near-field validation", ev("document.querySelectorAll('[aria-invalid=true]').length >= 2 && document.activeElement.id==='a-name'")); shot("390-validation"); }
    if (id === "compatibility") selectLabel("관계 유형", state.category);
    fillPerson("a", state.person); if (id === "compatibility") fillPerson("b", state.personB);
    if (id === "full") { sizes("input"); cli("reload"); until("#a-name"); check("reload retains entered input", ev(`document.querySelector('#a-name').value===${JSON.stringify(state.person.name)}`)); }
    clickText("다음 페이지 →");
    const pair = id === "compatibility";
    selectLabel(pair ? "A MBTI" : "MBTI", state.person.mbtiType);
    if (pair) selectLabel("B MBTI", state.personB.mbtiType);
    else {
      selectLabel("현재 상태", state.person.jobStatus); cli("fill", 'input[maxlength="200"]', state.person.detailedJob);
      if (id !== "love") selectLabel("관계 상태", state.person.relationshipStatus);
    }
    if (id === "full") { shot("390-context"); cli("back"); until("#a-name"); check("browser back preserves state", ev(`document.querySelector('#a-name').value===${JSON.stringify(state.person.name)}`)); clickText("다음 페이지 →"); }
    clickText("다음 페이지 →");
    if (id === "love") {
      check("Love third input page", ev("document.querySelector('[data-book-input]').dataset.step==='2'"));
      cli("back"); check("back from third page restores second", ev("document.querySelector('[data-book-input]').dataset.step==='1'"));
      cli("forward"); check("forward restores validated third page", ev("document.querySelector('[data-book-input]').dataset.step==='2'"));
      selectLabel("관계 상태", state.person.relationshipStatus); clickText("다음 페이지 →");
    }
    if (id === "annual") { selectLabel("선택 연도", state.person.selectedYear); clickText("다음 페이지 →"); }
    until("[data-book-checkout]");
    check(`${id} actual catalog price`, ev("document.querySelector('[data-book-checkout]').innerText.includes('1,290원')"));
    check(`${id} consent default collapsed`, ev("document.querySelectorAll('dialog').length===0 && Array.from(document.querySelectorAll('[data-book-checkout] input[type=checkbox]')).every(e=>!e.checked)"));
    if (id === "full") {
      sizes("receipt"); clickText("보기 ›"); until("dialog[open]"); shot("390-consent-detail"); clickText("×");
      ev("document.querySelector('[data-book-checkout] input[type=checkbox]').click()");
      ev("document.querySelectorAll('[data-book-checkout] input[type=checkbox]')[1].click()");
      check("all consent indeterminate after individual uncheck", ev("document.querySelector('[data-book-checkout] input[type=checkbox]').indeterminate"));
    }
    ev("(()=>{const all=document.querySelector('[data-book-checkout] input[type=checkbox]');if(!all.checked)all.click();return true;})()");
    check(`${id} all consent synchronized`, ev("Array.from(document.querySelectorAll('[data-book-checkout] input[type=checkbox]')).every(e=>e.checked)"));
    // Observe the existing launcher while blocking any unexpected real prepare,
    // SDK or provider network. Only the dev mock endpoint is permitted.
    ev("(()=>{window.__bookCalls=[];const fetchOriginal=window.fetch;window.fetch=(input,init)=>{const path=String(input);window.__bookCalls.push(path);if(path.includes('payment-checkout')||path.includes('tosspayments')||path.includes('openai')||path.includes('supabase'))return Promise.reject(new Error('External call forbidden'));return fetchOriginal(input,init)};return true;})()");
    clickText("모의 결제 · 책 발행 →"); if (id === "full") shot("390-publishing");
    until("[data-book-report]"); urls[id] = ev("location.href");
    check(`${id} stored V4 report route`, urls[id].includes("/dev/book-flow/report/book-local-"));
    fits(`${id} cover`); shot(`390-${id}-cover`);
    for (const kind of id === "full" ? ["manse", "mbti", "narrative", "appendix", "back"] : id === "major" ? ["timeline", "narrative", "back"] : id === "annual" ? ["months", "narrative", "back"] : id === "compatibility" ? ["pair", "back"] : ["back"]) {
      const index = view.data.pages.findIndex(p => p.kind === kind); page(index + 1);
      check(`${id} ${kind} mounted only current page`, ev("document.querySelectorAll('[data-page]').length===1 && document.querySelectorAll('[data-page] *').length<1500"));
      if (id === "full" || ["timeline", "months", "pair"].includes(kind)) sizes(`${id}-${kind}`); else { fits(`${id}-${kind}`); shot(`390-${id}-${kind}`); }
      if (kind === "timeline") check("Major 14 years and future 10", ev("document.querySelectorAll('[data-year]').length===14"));
      if (kind === "months") check("Annual 12 months", ev("document.querySelectorAll('[data-month]').length===12"));
      if (kind === "narrative") { ev("document.querySelector('[data-page]').scrollTop=10000"); shot(`390-${id}-footnotes`); }
      if (kind === "back") check(`${id} share and final without footer`, ev("document.querySelector('[data-final-line]') && Array.from(document.querySelectorAll('footer')).every(e=>getComputedStyle(e).display==='none')"));
    }
    cli("reload"); until("[data-book-report]"); check(`${id} reload reads stored result`, ev("document.querySelector('[data-page]').dataset.page==='cover'"));
  }
  open("/dev/book-flow"); ev("document.querySelector('[data-book-footer]').scrollIntoView()"); sizes("footer"); ev("document.querySelector('[data-business] summary').click()"); shot("390-business-open");
  open("/dev/book-flow/legal/terms"); sizes("legal");
  open("/?v4=1&book=1&reportVersion=v4"); ev("localStorage.setItem('bookExperiencePublicEnabled','true');document.cookie='book=1;path=/'"); cli("reload"); check("public overrides fail closed", ev("!document.querySelector('[data-book-home]') && document.body.innerText.includes('오픈 기념')"));
  open("/report/new?product=saju-mbti-full&book=1&v4=1"); check("public input stays V3", ev("!document.querySelector('[data-book-input]')"));
  check("final console errors 0", cli("errors").errors.length === 0);
  writeFileSync(`${out}/browser-results.json`, JSON.stringify({ checks, urls }, null, 2));
  process.stdout.write(`${checks.length} checks PASS\n`);
} finally { cli("close"); }
