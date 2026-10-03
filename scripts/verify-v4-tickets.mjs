// Explicit localhost SQL fixtures; never a grant/payment/Production admin tool.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const bin=process.env.BOOK_BROWSER_BIN||"agent-browser",origin="http://127.0.0.1:3189",out="/tmp/gyeol-v4-10a",session=`tickets10a-${process.pid}`,checks=[];
const fixtures=JSON.parse(readFileSync(`${out}/fixtures.json`,"utf8"));
mkdirSync(out,{recursive:true});
const cli=(...args)=>{const r=JSON.parse(execFileSync(bin,["--headed","--session",session,"--json",...args],{encoding:"utf8",timeout:60000}));assert.ok(r.success,JSON.stringify(r));return r.data;};
const ev=code=>cli("eval",code).result;
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);process.stdout.write(`PASS ${name}\n`);};
const open=path=>{cli("open",origin+path);cli("wait","--load","networkidle");};
const click=name=>{cli("find","role","button","click","--name",name,"--exact");cli("wait","--load","networkidle");};
const shot=name=>{ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')");cli("screenshot",`${out}/${name}.png`);};
function sizes(name){for(const w of [390,430,768,1440]){cli("set","viewport",String(w),w<768?"844":"960");check(`${name} ${w} overflow`,ev("document.documentElement.scrollWidth<=innerWidth&&[...document.querySelectorAll('[aria-label=\"책 입력\"]')].every(e=>e.scrollWidth<=e.clientWidth+1)"));check(`${name} ${w} runtime errors`,cli("errors").errors.length===0);check(`${name} ${w} console/hydration`,!cli("console").messages.some(m=>m.type==="error"));shot(`${w}-${name}`);}cli("set","viewport","390","844");}
const request=(action,body)=>ev(`(async()=>{const r=await fetch('/dev/account/api/ticket-${action}',${body===undefined?"{cache:'no-store'}":`{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(${JSON.stringify(body)})}`});return {status:r.status,body:await r.json()};})()`);
const fixture=name=>ev(`fetch('/dev/account/api/ticket-fixture',{method:'POST',body:${JSON.stringify(name)}}).then(r=>r.json())`);
function login(provider){click(provider==="kakao"?"카카오로 계속하기":"Google로 계속하기");if(ev("!!document.querySelector('fieldset')")){cli("find","label","전체 동의","check");click("동의하고 계속하기 →");}cli("wait","--text","리포트 이용권");cli("wait","--load","networkidle");}
function receipt(payload){
  const p=payload.person,ctx=payload.userContext;
  const person={name:p.name,birthDate:p.birthDate,paidBirthTimeMode:p.birthTimePrecision||(p.birthTimeUnknown?"unknown":"exact"),birthTime:p.birthTime,timeBranch:p.approximateBirthTimeSlot||"",birthTimeUnknown:p.birthTimeUnknown,gender:p.gender,mbtiType:p.mbtiType,jobStatus:ctx.jobStatus,detailedJob:ctx.detailJob,relationshipStatus:ctx.relationshipStatus,focusAreas:[],selectedYear:String(new Date().getFullYear())};
  ev(`sessionStorage.setItem('gyeol-book-input-v1:${payload.productKey}',JSON.stringify(${JSON.stringify({version:1,state:{person,personB:{...person},category:"love"}})}))`);
  open(`/dev/book-flow/input?product=${payload.productSlug}`);cli("wait","#a-name");
  for(let i=0;i<2;i++){cli("snapshot","-i");click("다음 페이지 →");}
  cli("wait","[data-book-checkout]");cli("wait","--load","networkidle");
}
try{
  cli("--allowed-domains","127.0.0.1","open",origin+"/dev/account");cli("set","viewport","390","844");cli("set","media","light","reduced-motion");cli("wait","--load","networkidle");cli("snapshot","-i");
  check("dev page loaded without error overlay",ev("document.body.innerText.includes('내 이야기를 이어서')&&!document.querySelector('[data-nextjs-dialog]')"));login("kakao");
  check("signup gives no automatic tickets",request("summary").body.quantity===0);sizes("zero");
  check("explicit local one-ticket fixture",fixture("one").ok);cli("reload");cli("wait","--text","리포트 이용권 1장");sizes("one");
  receipt(fixtures[0].payload);cli("wait","input[name=method]");cli("find","label","리포트 이용권 1장 사용 · 남은 이용권 1장","check");
  cli("find","label","전체 동의","check");check("ticket confirmation is explicit",ev("document.body.innerText.includes('리포트 이용권 1장을 사용합니다.')"));sizes("selection");
  check("local persistence failure fixture",fixture("failure").ok);click("리포트 이용권 1장 사용 →");cli("wait","--text","이용권을 복구했습니다.");
  check("failure restores one ticket",request("summary").body.quantity===1);shot("390-restored");
  check("failed book not in library",ev("fetch('/dev/account/api/library-list').then(r=>r.json()).then(b=>b.items.length)")===0);
  click("리포트 이용권 1장 사용 →");cli("wait","[data-book-report]");const urls={comprehensive:ev("location.pathname")};
  check("ticket creates real Book reader",urls.comprehensive.includes("book-local-"));shot("390-created");
  open("/dev/account");cli("wait","ul[aria-label=\"내 책 목록\"]");check("publication linked to library",ev("document.querySelectorAll('ul[aria-label=\"내 책 목록\"]>li').length")===1);check("success consumed exactly one",request("summary").body.quantity===0);sizes("consumed");
  check("explicit multi-ticket fixture",fixture("several").ok);cli("reload");cli("wait","--text","리포트 이용권 6장");sizes("several");
  const consent=JSON.parse(readFileSync(`${out}/consent.json`,"utf8"));
  for(const f of fixtures.slice(1)){
    const body={requestId:ev("crypto.randomUUID()"),payload:f.payload,consent};const r=request("redeem",body);check(`${f.id} real ticket generation`,r.status===200&&r.body.ok);urls[f.id]=r.body.reportUrl;
    check(`${f.id} same request idempotent`,request("redeem",body).body.reportUrl===urls[f.id]);
    open(urls[f.id]);cli("wait","[data-book-report]");shot(`390-${f.id}`);open("/dev/account");
  }
  cli("wait","ul[aria-label=\"내 책 목록\"]");check("six real books in own library",ev("document.querySelectorAll('ul[aria-label=\"내 책 목록\"]>li').length")===6);check("six products cost one each",request("summary").body.quantity===1);sizes("six-books");
  const history=request("history").body.history;check("audit grant/redeem/reversal retained",history.filter(e=>e.event==="REDEEM").length===7&&history.filter(e=>e.event==="REVERSAL").length===1);
  click("로그아웃");login("google");check("another account has zero and no books",request("summary").body.quantity===0&&ev("!document.querySelector('ul[aria-label=\"내 책 목록\"]')"));
  open(urls.comprehensive);check("other account cannot read ticket report",ev("!document.querySelector('[data-book-report]')"));
  open("/dev/account");click("로그아웃");receipt(fixtures[0].payload);check("guest has no ticket option",!ev("document.body.innerText.includes('리포트 이용권 1장 사용')"));
  check("no external resources",ev("performance.getEntriesByType('resource').every(r=>new URL(r.name).origin===location.origin)"));
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({result:"PASS",checks,urls},null,2));process.stdout.write(`${checks.length} checks PASS\n`);
}finally{cli("close");}
