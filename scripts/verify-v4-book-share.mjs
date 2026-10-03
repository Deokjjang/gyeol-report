// Loopback only. Actual V4 fixtures/SQL, mock provider and SDK; no remote SDK/config.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const origin = process.env.BOOK_SHARE_ORIGIN || "http://127.0.0.1:3189";
assert.equal(new URL(origin).hostname, "127.0.0.1");
const bin = process.env.BOOK_BROWSER_BIN || "agent-browser", session = `book11a-${process.pid}`, out = "/tmp/gyeol-v4-11a";
mkdirSync(out, { recursive: true });
const checks = [], urls = [];
function cli(...args) { const r = JSON.parse(execFileSync(bin, ["--session", session, "--json", ...args], { encoding: "utf8", timeout: 60000 })); assert.equal(r.success, true, JSON.stringify(r)); return r.data; }
const ev = source => cli("eval", source).result;
const check = (label, value) => { assert.ok(value, label); checks.push(label); process.stdout.write(`PASS ${label}\n`); };
const shot = name => cli("screenshot", `${out}/${name}.png`);
function open(path) { cli("open", origin + path); cli("wait", "--load", "networkidle"); ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')"); }
function sizes(label) {
  for (const width of [390,430,768,1440]) {
    cli("set", "viewport", String(width), width < 768 ? "844" : "960");
    check(`${label} ${width} overflow`, ev("document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll('[data-page]')].every(e=>e.scrollWidth<=e.clientWidth+1)"));
    shot(`${width}-${label}`);
  }
  cli("set", "viewport", "390", "844");
}
function end() { return ev("(async()=>{for(let i=0;i<80;i++){const b=document.querySelector('[aria-label=\"다음 페이지\"]');if(!b||b.disabled)break;b.click();await new Promise(r=>setTimeout(r,50));}return document.querySelector('[data-page]')?.dataset.page;})()"); }
function click(label) { cli("find", "role", "button", "click", "--name", label); }
try {
  open("/dev/book-flow"); cli("set", "media", "light", "reduced-motion");
  check("server content", ev("document.body.innerText.includes('나에 관한 한 권')"));
  const inputs = JSON.parse(readFileSync(`${out}/inputs.json`, "utf8"));
  for (const f of inputs) {
    if (f.id === "annual") f.payload.productOptions.selectedYear = String(new Date().getFullYear());
    const created = ev(`(async()=>{const r=await fetch('/dev/book-flow/share-fixture',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(f.payload)})});return {status:r.status,body:await r.json()};})()`);
    check(`${f.id} mock paid → actual V4 publication`, created.status === 200);
    const path = created.body.reportUrl; open(path); cli("wait", "[data-book-report]");
    check(`${f.id} owner final`, end() === "back");
    check(`${f.id} owner actions`, ev("document.querySelectorAll('[aria-label=\"이 책 공유하기\"] button').length===3 && !document.body.innerText.includes('나도 내 책 만들기')"));
    if (f.id === "comprehensive") sizes("owner-back");
    ev("window.__bookEvents=[];window.addEventListener('gyeol:book-share',e=>window.__bookEvents.push(e.detail));window.__copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async s=>{window.__copied=s;}}})");
    click("공유 링크 복사"); cli("wait", "[role=status]");
    cli("wait", "--fn", "document.querySelector('[role=status]')?.textContent==='복사됨'");
    const url = ev("window.__copied"), token = new URL(url).pathname.slice(3);
    check(`${f.id} canonical copy`, /^https:\/\/gyeolreport.com\/r\/gr_[A-Za-z0-9_-]{32}$/.test(url));
    if (f.id === "comprehensive") {
      shot("390-copy-success");
      ev("window.__native=[];Object.defineProperty(navigator,'share',{configurable:true,value:async d=>{window.__native.push(d)}});window.__kakao=[];window.Kakao={isInitialized:()=>true,init:()=>{},Share:{sendDefault:d=>window.__kakao.push(d)}}");
      click("시스템 공유"); click("카카오톡으로 책 공유");
      check("native payload", ev(`window.__native[0].url===${JSON.stringify(url)} && !/report_/.test(JSON.stringify(window.__native))`));
      check("Kakao Book payload", ev(`window.__kakao[0].buttons[0].title==='책 펼쳐보기' && window.__kakao[0].content.imageUrl===${JSON.stringify(url + "/book-og")}`));
      ev("Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('cancel','AbortError')}})"); click("시스템 공유");
      check("native cancel quiet", ev("document.querySelector('[role=status]').textContent===''"));
      ev("Object.defineProperty(navigator,'share',{configurable:true,value:undefined});delete window.Kakao"); click("시스템 공유");
      cli("wait", "--fn", "document.querySelector('[role=status]')?.textContent==='복사됨'");
      check("native fallback copy", ev("document.querySelector('[role=status]').textContent==='복사됨'"));
      ev("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('blocked')}}});document.execCommand=()=>false"); click("공유 링크 복사");
      check("manual fallback URL", ev(`document.querySelector('[aria-label="복사할 공유 링크"]').value===${JSON.stringify(url)}`)); shot("390-manual-copy");
      check("no real Kakao script", ev("!document.querySelector('script[src*=kakao_js_sdk]')"));
    }
    const sharedPath = `/dev/book-flow/r/${token}`; open(sharedPath); cli("wait", "button[aria-label$=펼치기]");
    check(`${f.id} privacy at entry`, ev("!document.body.innerText.match(/MBTI|생년월일|출생시간|직업|내 서재/) && !document.querySelector('[data-narrative-paragraph]')"));
    if (["comprehensive","compatibility","annual"].includes(f.id)) sizes(`${f.id}-entry`);
    // Enter keyboard opens the real lazy reader, without account credentials in the data request.
    ev("document.querySelector('button[aria-label$=펼치기]').focus()"); cli("press", "Enter"); cli("wait", "[data-book-report]");
    check(`${f.id} one mounted page`, ev("document.querySelectorAll('[data-page]').length===1"));
    shot(`390-${f.id}-shared-reader`);
    check(`${f.id} shared full final`, end() === "back");
    check(`${f.id} no owner controls`, ev("!document.body.innerText.match(/내 서재|쿠폰|이용권|보관하기/) && [...document.querySelectorAll('a')].filter(a=>a.textContent.includes('나도 내 책 만들기')).length===1"));
    sizes(`${f.id}-shared-final`);
    check(`${f.id} runtime errors`, cli("errors").errors.length === 0);
    const data = ev(`(async()=>{const r=await fetch(${JSON.stringify(sharedPath + "/book-data")},{credentials:'omit'});return {status:r.status,body:await r.json()};})()`);
    check(`${f.id} token only data`, data.status === 200 && !/reportId|provenance|contentDigest/.test(JSON.stringify(data.body)));
    if (f.id === "major") check("Major 14 years", data.body.data.pages.find(p=>p.kind==="timeline").years.length===14);
    if (f.id === "annual") check("Annual 12 months", data.body.data.pages.find(p=>p.kind==="months").months.length===12);
    urls.push({ id:f.id, owner:path, shared:sharedPath, publicShareUrl:url, og:sharedPath+"/book-og" });
  }
  // Long Korean compatibility name; preview remains A-only and retains full reader data.
  const long = structuredClone(inputs.find(f=>f.id==="compatibility").payload);
  long.personA.name = "김아름다운하늘빛고운별꽃사랑";
  const made = ev(`(async()=>{const r=await fetch('/dev/book-flow/share-fixture',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(long)})});return r.json();})()`);
  const model = ev(`(async()=>{const r=await fetch('/dev/book-flow/share',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reportId:${JSON.stringify(made.reportId)}})});return (await r.json()).model;})()`);
  open(`/dev/book-flow/r/${model.shareToken}`); sizes("long-name-entry");
  check("long-name A only", ev(`document.querySelector('h1').textContent.includes(${JSON.stringify(long.personA.name)}) && !document.body.innerText.includes(${JSON.stringify(long.personB.name)})`));
  check("entry has no site footer",ev("[...document.querySelectorAll('body>footer')].every(e=>getComputedStyle(e).display==='none')"));
  cli("set","media","light");
  // Hold only the local payload response briefly to inspect the opening transition.
  ev("window.__originalFetch=window.fetch;window.fetch=async(...a)=>{if(String(a[0]).endsWith('/book-data'))await new Promise(r=>setTimeout(r,850));return window.__originalFetch(...a)}");
  cli("find","role","button","click","--name",`${model.displayTitle} 펼치기`);
  shot("390-open-animation");cli("wait","[data-book-report]");cli("set","media","light","reduced-motion");
  check("long-name opens",end()==="back");
  ev("window.addEventListener('gyeol:book-share',e=>sessionStorage.setItem('book11a-last-event',e.detail.event))");
  cli("find","role","link","click","--name","나도 내 책 만들기 ↗");
  cli("wait","--url","**/dev/book-flow");
  check("final CTA opens Book home",ev("location.pathname==='/dev/book-flow' && sessionStorage.getItem('book11a-last-event')==='shared_cta_clicked'"));
  // No cookie/session required for shared access; owner endpoint is not exposed to the viewer.
  cli("cookies", "clear"); open(urls[0].shared); check("guest token cover", ev("!!document.querySelector('button[aria-label$=펼치기]')"));
  const denied=ev(`(async()=>{const r=await fetch('/dev/book-flow/share',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reportId:${JSON.stringify(urls[0].owner.split("/").at(-1))}})});return r.status;})()`);
  check("no purchase proof → no issuance",denied===403);
  check("public issue gate OFF",ev("(async()=>{const r=await fetch('/api/book-share',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});return r.status===404})()"));
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({checks,urls},null,2));
} finally { cli("close"); }
