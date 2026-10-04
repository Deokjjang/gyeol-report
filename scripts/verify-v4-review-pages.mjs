import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const binary = process.env.AGENT_BROWSER_BIN || "agent-browser", session = "gyeol12c", out = "/tmp/gyeol-v4-12c", origin = "http://127.0.0.1:3193";
const report = JSON.parse(readFileSync(`${out}/browser-report.json`, "utf8")), pages = [];
function browser(...args) { return JSON.parse(execFileSync(binary, ["--session", session, "--allowed-domains", "127.0.0.1", "--json", ...args], { encoding: "utf8", timeout: 60000 })); }
function evaluate(code) { const r = browser("eval", code); if (!r.success) throw Error(JSON.stringify(r)); return r.data.result; }
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
for (const id of ["A", "D", "E", "F"]) {
  browser("open", origin + report.cases.find(c => c.id === id).regeneratedHref); browser("snapshot", "-i");
  for (let i = 0; i < 100 && !evaluate("!!document.querySelector('[data-page]')"); i++) await wait(100);
  browser("set", "viewport", "390", "844");
  const captured = new Set();
  for (let i = 0; i < 45; i++) {
    const state = evaluate(`(() => { const e=document.querySelector('[data-page]');return {kind:e.dataset.page,number:e.dataset.pageNumber,overflow:e.scrollWidth>e.clientWidth+1};})()`);
    pages.push({ id, ...state });
    if (!captured.has(state.kind)) {
      captured.add(state.kind);
      browser("screenshot", `${out}/${id}-${state.kind}-390.png`);
      if (state.kind === "narrative") {
        evaluate("document.querySelector('[data-page]').scrollTop=100000");
        browser("screenshot", `${out}/${id}-footnotes-390.png`);
      }
    }
    if (state.kind === "back") {
      evaluate("document.querySelector('[data-page]').scrollTop=100000");
      browser("screenshot", `${out}/${id}-share-390.png`);
      break;
    }
    evaluate("document.querySelector('button[aria-label=\"다음 페이지\"]').click()");
    await wait(530);
    if (evaluate("document.querySelector('[data-page]').scrollTop") !== 0) throw Error("Page scroll not reset");
  }
  for (const width of [430, 768, 1440]) {
    browser("set", "viewport", String(width), "1000");
    pages.push({ id, width, overflow: evaluate("document.documentElement.scrollWidth>innerWidth") });
  }
}
browser("open", `${origin}/dev/content-review/experience`);browser("snapshot", "-i");
browser("set", "viewport", "1440", "1000"); browser("screenshot", `${out}/experience-1440.png`);
browser("open", `${origin}/dev/account`);browser("snapshot", "-i");
browser("set", "viewport", "390", "844");browser("screenshot", `${out}/login-390.png`);
writeFileSync(`${out}/pages-report.json`, JSON.stringify({ pages, errors: browser("errors"), console: browser("console") }, null, 2));
process.stdout.write(JSON.stringify({ traversed: pages.length, overflow: pages.filter(p=>p.overflow) }));
