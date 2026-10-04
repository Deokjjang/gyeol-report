import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
// Run after the unit fixture export and the dedicated localhost server.
const binary = process.env.AGENT_BROWSER_BIN || "agent-browser";
const session = process.env.REVIEW_BROWSER_SESSION || "gyeol12c";
const origin = "http://127.0.0.1:3193", out = "/tmp/gyeol-v4-12c";
mkdirSync(out, { recursive: true });
const samples = JSON.parse(readFileSync(`${out}/fixtures.json`, "utf8"));
function browser(...args) { return execFileSync(binary, ["--session", session, "--allowed-domains", "127.0.0.1", "--json", ...args], { encoding: "utf8", timeout: 60000 }); }
function evaluate(code) { const r = JSON.parse(browser("eval", code)); if (!r.success) throw Error(JSON.stringify(r)); return r.data.result; }
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(code) { for (let i = 0; i < 100; i++) { if (evaluate(code)) return; await wait(200); } throw Error(`Timed out: ${code}`); }
function assert(value, label) { if (!value) throw Error(label); }
const report = { cases: [], widths: [], requests: [], errors: [] };
const field = (id, value) => evaluate(`(() => { const e=document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); return e.value; })()`);
const select = (id, value) => evaluate(`(() => { const e=document.getElementById(${JSON.stringify(id)}); e.value=${JSON.stringify(value)}; e.dispatchEvent(new Event('change',{bubbles:true})); return e.value; })()`);
const labelSet = (id, label, value) => evaluate(`(() => { const root=document.querySelector('[data-review-case="${id}"]'); const l=[...root.querySelectorAll('label')].find(l=>l.firstChild?.textContent.trim()===${JSON.stringify(label)}); const e=l?.querySelector('input,select'); if(!e) return false; Object.getOwnPropertyDescriptor(e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
const button = (id, text) => evaluate(`(() => { const b=[...document.querySelector('[data-review-case="${id}"]').querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(text)}); b.click(); return true; })()`);
async function person(caseId, slot, p) {
  field(`${caseId}-${slot}-name`, p.name); field(`${caseId}-${slot}-birthDate`, p.birthDate); select(`${caseId}-${slot}-gender`, p.gender);
  evaluate(`document.querySelectorAll('input[name="${caseId}-${slot}-precision"]')[${["exact", "approximate", "unknown"].indexOf(p.paidBirthTimeMode)}].click()`);
  if (p.paidBirthTimeMode === "exact") field(`${caseId}-${slot}-birthTime`, p.birthTime);
  if (p.paidBirthTimeMode === "approximate") select(`${caseId}-${slot}-birthTime`, p.timeBranch);
}
browser("open", `${origin}/dev/content-review`); browser("snapshot", "-i");
await until("document.querySelector('[data-review-case] button')?.disabled === false");
browser("set", "viewport", "1440", "1000");
for (const f of samples) {
  const otherNames = evaluate(`[...document.querySelectorAll('[data-review-case]')].filter(e=>e.dataset.reviewCase!=='${f.id}').map(e=>e.querySelector('input').value)`);
  button(f.id, "Case Reset");
  assert(evaluate(`document.getElementById('${f.id}-a-name').value`) === "", "Case reset failed");
  assert(JSON.stringify(otherNames) === JSON.stringify(evaluate(`[...document.querySelectorAll('[data-review-case]')].filter(e=>e.dataset.reviewCase!=='${f.id}').map(e=>e.querySelector('input').value)`)), "Reset crossed cases");
  await person(f.id, "a", f.form.person);
  if (f.id === "D") {
    await person(f.id, "b", f.form.personB);
    // The current love contract labels the two independent subjects A/B.
    evaluate(`(() => { const selects=[...document.querySelector('[data-review-case="D"]').querySelectorAll('select')].filter(s=>[...s.options].some(o=>o.value==='INTP')); selects[0].value='INTP';selects[0].dispatchEvent(new Event('change',{bubbles:true}));selects[1].value='ESFJ';selects[1].dispatchEvent(new Event('change',{bubbles:true})); })()`);
  } else {
    assert(labelSet(f.id, "MBTI", f.form.person.mbtiType), "MBTI field");
    labelSet(f.id, "현재 상태", f.form.person.jobStatus); labelSet(f.id, "상세 직업", f.form.person.detailedJob); labelSet(f.id, "관계 상태", f.form.person.relationshipStatus);
  }
  button(f.id, evaluate(`document.querySelector('[data-review-case="${f.id}"] [data-phase]').dataset.phase`)==="ready" ? "다시 생성" : "책 생성");
  await until(`["ready","failed"].includes(document.querySelector('[data-review-case="${f.id}"] [data-phase]')?.dataset.phase)`);
  const phase = evaluate(`document.querySelector('[data-review-case="${f.id}"] [data-phase]').dataset.phase`);
  assert(phase === "ready", `CASE ${f.id}: ${evaluate(`document.querySelector('[data-review-case="${f.id}"]').innerText`)}`);
  const href = evaluate(`document.querySelector('[data-review-case="${f.id}"] a').getAttribute('href')`);
  browser("open", origin + href); browser("snapshot", "-i");
  await until("!!document.querySelector('[data-book-report]')");
  assert(evaluate(`document.body.innerText.includes(${JSON.stringify(f.form.person.name)})`), `${f.id} wrong person`);
  browser("set", "viewport", "390", "844"); browser("screenshot", `${out}/case-${f.id}-390.png`);
  report.cases.push({ id: f.id, open: true, name: f.form.person.name, href, overflow: evaluate("document.documentElement.scrollWidth > innerWidth") });
  browser("open", `${origin}/dev/content-review`);
  await until(`document.querySelector('[data-review-case="${f.id}"] [data-phase]')?.dataset.phase === 'ready'`);
  assert(evaluate(`document.getElementById('${f.id}-a-name').value`) === f.form.person.name, "Input recovery failed");
  button(f.id, "다시 생성"); await until(`document.querySelector('[data-review-case="${f.id}"] [data-phase]')?.dataset.phase === 'ready'`);
  const next = evaluate(`document.querySelector('[data-review-case="${f.id}"] a').getAttribute('href')`);
  assert(next !== href, "Regeneration retained old identity");
  report.cases.at(-1).regeneratedHref = next;
  browser("open", origin + href);
  await until("document.body.innerText.includes('RESULT_MISSING_OR_REPLACED')");
  assert(!evaluate("!!document.querySelector('[data-book-report]')"), "Stale packet rendered");
  if (f.id === "A") {
    browser("tab", "new", origin + next); browser("snapshot", "-i");
    await until("!!document.querySelector('[data-book-report]')");
    report.newTab = true;
  }
  browser("open", `${origin}/dev/content-review`);
  await until(`document.querySelector('[data-review-case="${f.id}"] [data-phase]')?.dataset.phase === 'ready'`);
}
for (const width of [390, 430, 768, 1440]) {
  browser("set", "viewport", String(width), "1000"); browser("screenshot", `${out}/dashboard-${width}.png`);
  report.widths.push({ width, overflow: evaluate("document.documentElement.scrollWidth > innerWidth") });
}
assert(evaluate("[...document.querySelectorAll('[data-phase]')].every(e=>e.dataset.phase==='ready')"), "Case contamination");
report.requests = evaluate("performance.getEntriesByType('resource').filter(r=>/measurement|analytics|facebook|supabase|toss|openai/i.test(r.name)).map(r=>r.name)");
report.errors = JSON.parse(browser("errors"));
writeFileSync(`${out}/browser-report.json`, JSON.stringify(report, null, 2));
process.stdout.write(JSON.stringify(report, null, 2));
