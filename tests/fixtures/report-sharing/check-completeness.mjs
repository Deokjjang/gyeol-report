import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const base = process.env.SHARE_QA_BASE ?? "http://127.0.0.1:3141";
const dir = process.env.RELEASE_QA_DIR, binary = process.env.AGENT_BROWSER_BIN ?? "agent-browser";
const session = process.env.RELEASE_BROWSER_SESSION ?? "release-delivery";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base) || !dir) throw new Error("Local fixture verification only");
const manifests = JSON.parse(readFileSync(dir + "/manifests.json", "utf8"));
const snapshots = JSON.parse(readFileSync(dir + "/snapshots.json", "utf8"));
const links = JSON.parse(readFileSync(dir + "/links.json", "utf8"));
const run = (args, input) => execFileSync(binary, ["--session", session, ...args], { encoding: "utf8", input, maxBuffer: 8 * 1024 * 1024, timeout: 60000 });
const evaluate = code => {
  let value = JSON.parse(run(["eval", "--stdin"], code).trim());
  if (typeof value === "string") value = JSON.parse(value);
  return value;
};
const results = [];
mkdirSync(dir + "/screenshots", { recursive: true });
try {
  for (const [key, manifest] of Object.entries(manifests)) {
    const snapshot = snapshots[key], link = links.find(l => l.report_id === snapshot.reportId);
    assert(link && /^gr_[\w-]{32}$/.test(link.token));
    const sharedPath = "/r/" + link.token;
    // Actual HTTP SSR and crawler metadata, before any hydration.
    for (const ua of ["kakaotalk-scrap/1.0", "facebookexternalhit/1.1", "Twitterbot/1.0"]) {
      // Synchronous browser CLI work can outlive Next's idle socket timeout.
      // Use a fresh crawler connection rather than reuse that stale socket.
      const response = await fetch(base + sharedPath, { headers: { "User-Agent": ua, Connection: "close" } });
      assert.equal(response.status, 200);
      const html = await response.text(), head = html.split("</head>")[0];
      assert(head.includes('property="og:url" content="https://gyeolreport.com' + sharedPath + '"'));
      assert(head.includes('name="twitter:card" content="summary_large_image"'));
      assert(head.includes('name="robots" content="noindex, nofollow'));
      assert(!head.includes(snapshot.reportId) && !/1992-08-21|1996-12-06|09:30|ENTJ|ENFP|evidencePacket|paymentKey/.test(head));
      assert(html.includes(manifest.finalText));
    }
    let directContent;
    for (const [kind, path] of [["direct", "/reports/" + snapshot.reportId], ["shared", sharedPath]]) {
      run(["open", base + path]);
      run(["wait", "--load", "networkidle"]);
      // Client-state interaction confirms hydration, not just static HTML.
      const hydration = evaluate(`(() => { const b=[...document.querySelectorAll("button")].find(b=>b.textContent.includes("만세력") && b.hasAttribute("aria-expanded")); if(!b)return JSON.stringify({found:false}); b.click(); return JSON.stringify({found:true}); })()`);
      assert(hydration.found);
      for (const width of [390, 768, 1440]) {
        run(["set", "viewport", String(width), "1000"]);
        const check = evaluate(`(() => {
          const m=${JSON.stringify(manifest)}, normalize=t=>t.replace(/\\s+/gu," ").trim();
          document.querySelectorAll("details").forEach(d=>d.open=true);
          const missing=[], article=document.querySelector("article[data-report-version]");
          for(const s of m.sections){const node=document.querySelector(s.selector); if(!node){missing.push(s.id);continue;} const text=normalize(node.textContent);
            for(const p of s.text)if(!text.includes(normalize(p)))missing.push(s.id+":"+p.slice(0,40));}
          const share=document.querySelectorAll('[aria-label="리포트 공유하기"]'), final=document.querySelector(m.finalSelector);
          return JSON.stringify({missing,version:article?.getAttribute("data-report-version"),content:normalize(article?.textContent??""),
            hydrated:[...document.querySelectorAll("button")].some(b=>b.textContent.includes("만세력")&&b.getAttribute("aria-expanded")==="true"),
            overflow:document.documentElement.scrollWidth>innerWidth,footer:document.querySelectorAll("footer").length,
            shares:share.length,after:!!final&&!!share[0]&&!!(final.compareDocumentPosition(share[0])&Node.DOCUMENT_POSITION_FOLLOWING),
            final:normalize(final?.textContent??"").includes(normalize(m.finalText)),cta:document.body.textContent.includes("나도 내 리포트 보기"),
            months:document.querySelectorAll("[data-month-story]").length,tableMonths:document.querySelectorAll('[aria-label="12개월 월운표"] li').length,current:document.querySelectorAll("[data-current-month=true]").length,
            timeline:[...document.querySelectorAll("[data-horizon-timeline] ol li a")].map(a=>Number(a.textContent.match(/\\d{4}/)?.[0])),
            bodyYears:[...document.querySelectorAll('[id^="year-"]')].map(e=>Number(e.id.slice(5))),
            overlay:!!document.querySelector("[data-nextjs-dialog]")});
        })()`);
        assert.deepEqual(check.missing, [], key + " " + kind + " missing text");
        assert.equal(check.version, manifest.version); assert(check.hydrated && check.final && check.after && check.cta);
        assert(!check.overflow && !check.overlay); assert.equal(check.footer, 0); assert.equal(check.shares, 1);
        if (manifest.collections.months) { assert.equal(check.months, 12); assert.equal(check.tableMonths, 12); assert.equal(check.current, manifest.currentMonths); }
        if (manifest.years.length) { assert.deepEqual(check.timeline, manifest.years); assert.deepEqual(check.bodyYears, manifest.years); }
        if (kind === "direct") directContent = check.content; else assert.equal(check.content, directContent, key + " shared customer content differs");
        // Walk and capture the actual top, middle, final and share surfaces.
        const middle = manifest.sections[Math.floor(manifest.sections.length / 2)].selector;
        for (const [position, selector] of [["top", "h1"], ["middle", middle], ["final", manifest.finalSelector], ["share", '[aria-label="리포트 공유하기"]']]) {
          evaluate(`(() => {document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:"center"});return JSON.stringify({ok:true});})()`);
          run(["screenshot", dir + "/screenshots/" + key + "-" + kind + "-" + width + "-" + position + ".png"]);
        }
        results.push({ key, kind, width, sections: manifest.sections.length, final: true, hydrated: true });
        console.log("PASS", key, kind, width, "all sections + final + share");
      }
      const errors = run(["errors"]).trim();
      assert(!errors, key + " runtime errors: " + errors);
    }
  }
  writeFileSync(dir + "/browser-results.json", JSON.stringify(results, null, 2));
  console.log("PASS: " + results.length + " full-delivery browser checks, " + Object.keys(manifests).length + " fixtures, 3 widths, direct/shared.");
} finally { run(["close"]); }
