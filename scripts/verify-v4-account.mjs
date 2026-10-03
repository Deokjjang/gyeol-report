// Local-only browser acceptance. Restart the local dev server for fresh fixtures.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const bin = process.env.BOOK_BROWSER_BIN || "agent-browser", origin = "http://127.0.0.1:3188", out = "/tmp/gyeol-v4-9b", session = `account9b-${process.pid}`, checks = [];
mkdirSync(out, { recursive: true });
function cli(...args) { const r = JSON.parse(execFileSync(bin, ["--headed", "--session", session, "--json", ...args], { encoding: "utf8", timeout: 45000 })); assert.equal(r.success, true, JSON.stringify(r)); return r.data; }
const ev = code => cli("eval", code).result;
const check = (label, condition) => { assert.ok(condition, label); checks.push(label); process.stdout.write(`PASS ${label}\n`); };
function open(path) { cli("open", origin + path); cli("wait", "--load", "networkidle"); }
function click(text) { cli("find", "role", "button", "click", "--name", text, "--exact"); cli("wait", "--load", "networkidle"); }
function shot(name) { ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')"); cli("screenshot", `${out}/${name}.png`); }
function sizes(name) {
  for (const width of [390, 430, 768, 1440]) {
    cli("set", "viewport", String(width), width < 768 ? "844" : "960");
    check(`${name} ${width} overflow`, ev("document.documentElement.scrollWidth<=innerWidth"));
    check(`${name} ${width} errors`, cli("errors").errors.length === 0); shot(`${width}-${name}`);
  }
  cli("set", "viewport", "390", "844");
}
function allConsent() {
  cli("find", "label", "전체 동의", "check");
  check("all required synchronized", ev("Array.from(document.querySelectorAll('fieldset input')).every(e=>e.checked)"));
}
try {
  cli("--allowed-domains", "127.0.0.1", "open", origin + "/dev/account"); cli("set", "viewport", "390", "844"); cli("wait", "--load", "networkidle");
  sizes("login"); check("exactly Kakao Google, no password", ev("document.querySelectorAll('input[type=password]').length===0 && document.body.innerText.includes('Google로 계속하기')"));
  click("카카오로 계속하기"); cli("wait", "fieldset");
  check("new account requires first consent", ev("document.body.innerText.includes('시작하기 전에')"));
  check("no invented marketing contract", !ev("document.body.innerText").includes("마케팅"));
  check("default unchecked and disabled", ev("Array.from(document.querySelectorAll('fieldset input')).every(e=>!e.checked) && Array.from(document.querySelectorAll('button')).find(e=>e.textContent.includes('동의하고 계속하기')).disabled"));
  sizes("consent"); click("이용약관 상세 보기"); cli("wait", "dialog[open]"); shot("390-consent-detail");
  check("full existing legal body", ev("document.querySelector('dialog').innerText.includes('디지털')")); click("상세 닫기");
  allConsent(); cli("find", "label", "[필수] 개인정보처리방침 동의", "click");
  check("individual uncheck makes all indeterminate", ev("document.querySelector('fieldset input').indeterminate"));
  allConsent(); click("동의하고 계속하기 →"); cli("wait", "--text", "반갑습니다.");
  cli("wait", "--text", "아직 꽂힌 책이 없습니다.");
  check("account library empty state", ev("document.body.innerText.includes('아직 꽂힌 책이 없습니다.')")); sizes("account");
  cli("reload"); cli("wait", "--load", "networkidle"); check("reload retains member", ev("document.body.innerText.includes('반갑습니다')"));
  open("/dev/book-flow"); cli("wait", "--text", "내 서재"); shot("390-member-header");
  // Reuse actual 9A canonical input; no invented report or payment text.
  const { book, state } = JSON.parse(readFileSync("/tmp/gyeol-v4-9a/full.json", "utf8"));
  open(`/dev/book-flow/input?product=${book.slug}`); cli("wait", "#a-name");
  const fill = (selector, value) => ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  cli("fill", "#a-name", state.person.name); fill("#a-birthDate", state.person.birthDate); cli("select", "#a-gender", state.person.gender);
  ev("document.querySelectorAll('input[name=a-precision]')[0].click()"); fill("#a-birthTime", state.person.birthTime);
  click("다음 페이지 →"); click("다음 페이지 →"); cli("wait", "[data-book-checkout]"); cli("wait", "--text", "환불정책 동의");
  check("member general terms dedup; digital/refund/input/age remain", ev("(()=>{const t=document.querySelector('[data-book-checkout]').innerText;return t.includes('환불정책 동의')&&!t.includes('이용약관·개인정보·환불정책 동의')&&document.querySelectorAll('[data-book-checkout] input[type=checkbox]').length>=6})()"));
  sizes("member-receipt");
  cli("tab", "new", "--label", "logout", origin + "/dev/account"); cli("wait", "--load", "networkidle"); click("로그아웃"); cli("wait", "--text", "카카오로 계속하기"); shot("390-logout");
  cli("tab", "t1"); ev("window.dispatchEvent(new Event('focus'))"); cli("wait", "--text", "약관"); cli("wait", "--load", "networkidle");
  check("another tab logout resets purchase choices", ev("Array.from(document.querySelectorAll('[data-book-checkout] input[type=checkbox]')).every(e=>!e.checked)"));
  check("guest full policy restored", ev("document.querySelector('[data-book-checkout]').innerText.includes('이용약관')")); sizes("guest-receipt");
  open("/dev/account"); click("카카오로 계속하기"); cli("wait", "--text", "반갑습니다.");
  check("returning current consent skips first consent", ev("document.querySelector('fieldset')===null"));
  click("로그아웃"); click("Google로 계속하기"); cli("wait", "fieldset");
  check("second provider is not merged by email or display name", ev("document.body.innerText.includes('회원님') && document.body.innerText.includes('시작하기 전에')"));
  allConsent(); click("동의하고 계속하기 →"); cli("wait", "--text", "반갑습니다."); click("로그아웃");
  open("/dev/account/api/callback?error=access_denied&error_description=provider-secret-text"); cli("wait", "--load", "networkidle");
  check("cancelled login generic, guest escape retained", ev("document.body.innerText.includes('로그인을 완료하지 못했습니다')&&!document.body.innerText.includes('provider-secret-text')&&document.body.innerText.includes('로그인 없이도')")); shot("390-error");
  cli("find", "role", "link", "click", "--name", "로그인 없이도 책을 만들 수 있습니다. →"); cli("wait", "[data-book-home]");
  check("guest escape works without login", ev("location.pathname==='/dev/book-flow'"));
  check("no provider network from local harness", ev("performance.getEntriesByType('resource').every(r=>new URL(r.name).origin===location.origin)"));
  writeFileSync(`${out}/browser-checks.json`, JSON.stringify({ checks, result: "PASS" }, null, 2));
} finally { cli("close"); }
