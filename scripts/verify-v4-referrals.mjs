// Loopback-only, existing dev OAuth and SQL fixture routes. No provider transport.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const bin=process.env.BOOK_BROWSER_BIN||"agent-browser",origin="http://127.0.0.1:3189",out="/tmp/gyeol-v4-11b",checks=[];
const fixtures=JSON.parse(readFileSync(`${out}/fixtures.json`,"utf8"));mkdirSync(out,{recursive:true});
const sessions={A:`referral-A-${process.pid}`,B:`referral-B-${process.pid}`};let who="A";
const cli=(...args)=>{const r=JSON.parse(execFileSync(bin,["--session",sessions[who],"--json",...args],{encoding:"utf8",timeout:60000}));assert.ok(r.success,JSON.stringify(r));return r.data;};
const ev=code=>cli("eval",code).result;
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);process.stdout.write(`PASS ${name}\n`);};
const open=path=>{cli("open",origin+path);cli("wait","--load","networkidle");cli("snapshot","-i");};
const click=name=>{cli("snapshot","-i");cli("find","role","button","click","--name",name,"--exact");};
const post=(path,body)=>ev(`(async()=>{const r=await fetch(${JSON.stringify(path)},{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(${JSON.stringify(body)})});return {status:r.status,body:await r.json()};})()`);
const summary=()=>ev("fetch('/dev/account/api/ticket-summary',{cache:'no-store'}).then(r=>r.json())");
const shot=name=>{ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')");cli("screenshot",`${out}/${name}.png`);};
function sizes(name){for(const w of [390,430,768,1440]){cli("set","viewport",String(w),w<768?"844":"960");check(`${name} ${w} overflow`,ev("document.documentElement.scrollWidth<=innerWidth"));check(`${name} ${w} errors`,cli("errors").errors.length===0);shot(`${w}-${name}`);}cli("set","viewport","390","844");}
function login(provider){click(provider==="kakao"?"카카오로 계속하기":"Google로 계속하기");cli("wait","--load","networkidle");if(ev("!!document.querySelector('fieldset')")){shot(`390-${who}-consent`);cli("find","label","전체 동의","check");click("동의하고 계속하기 →");}cli("wait","--text","리포트 이용권");cli("wait","--load","networkidle");}
function final(){ev("(async()=>{for(let i=0;i<120;i++){const b=document.querySelector('button[aria-label=\"다음 페이지\"]');if(!b||b.disabled)break;b.click();await new Promise(r=>setTimeout(r,45));}return document.querySelector('[data-page]')?.getAttribute('data-page')})()");cli("wait","[data-page=back]");}
try{
  for(const id of ["A","B"]){who=id;cli("--allowed-domains","127.0.0.1","open",origin+"/dev/account");cli("set","viewport","390","844");cli("set","media","light","reduced-motion");cli("wait","--text","카카오로 계속하기");}
  who="A";login("kakao");check("ordinary signup no bonus",summary().quantity===0);
  const made=post("/dev/book-flow/share-fixture",fixtures[0].payload);check("A mock paid actual V4 publication",made.status===200);
  open(made.body.reportUrl);cli("wait","[data-book-report]");final();
  ev("window.__copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async v=>{window.__copied=v}}})");click("공유 링크 복사");cli("wait","--text","복사됨");
  const copied=ev("window.__copied"),url=new URL(copied);check("owner copied distinct opaque ref",/^rf_[A-Za-z0-9_-]{43}$/.test(url.searchParams.get("ref"))&&/^\/r\/gr_/.test(url.pathname));
  check("accurate staggered reward notice",ev("document.body.innerText.includes('친구는 처음 가입·동의하면 1장')"));sizes("A-owner-share");
  const shared=`/dev/book-flow${url.pathname}${url.search}`;
  who="B";open(shared);cli("wait","button[aria-label$='펼치기']");sizes("B-cover");cli("snapshot","-i");cli("click","button[aria-label$='펼치기']");cli("wait","[data-book-report]");final();
  check("B conditional newcomer notice",ev("document.body.innerText.includes('처음 가입하고 필수 동의를')"));sizes("B-shared-cta");
  click("나도 내 책 만들기 ↗");cli("wait","--text","Google로 계속하기");shot("390-B-login");login("google");
  cli("wait","--text","리포트 이용권 1장");check("B referred grant notice",ev("document.body.innerText.includes('친구 초대로 리포트 이용권 1장을 받았습니다.')"));sizes("B-reward");
  who="A";check("A not rewarded at signup",summary().quantity===0);
  who="B";
  const payload=fixtures[1].payload,p=payload.person,ctx=payload.userContext;
  const person={name:p.name,birthDate:p.birthDate,paidBirthTimeMode:p.birthTimePrecision||(p.birthTimeUnknown?"unknown":"exact"),birthTime:p.birthTime,timeBranch:p.approximateBirthTimeSlot||"",birthTimeUnknown:p.birthTimeUnknown,gender:p.gender,mbtiType:p.mbtiType,jobStatus:ctx.jobStatus,detailedJob:ctx.detailJob,relationshipStatus:ctx.relationshipStatus,focusAreas:[],selectedYear:String(new Date().getFullYear())};
  ev(`sessionStorage.setItem('gyeol-book-input-v1:${payload.productKey}',JSON.stringify(${JSON.stringify({version:1,state:{person,personB:{...person},category:"love"}})}))`);
  open(`/dev/book-flow/input?product=${payload.productSlug}`);cli("wait","#a-name");click("다음 페이지 →");click("다음 페이지 →");cli("wait","[data-book-checkout]");cli("wait","input[name=method]");
  cli("find","label","리포트 이용권 1장 사용 · 남은 이용권 1장","check");cli("find","label","전체 동의","check");shot("390-B-ticket-receipt");click("리포트 이용권 1장 사용 →");cli("wait","[data-book-report]");
  const report=ev("location.pathname");check("different product valid book created",ev("document.body.innerText.includes('내가 잘되는')"));sizes("B-created");
  open("/dev/account");cli("wait","--text","리포트 이용권 0장");check("B ticket spent once",summary().quantity===0);
  who="A";open("/dev/account");cli("wait","--text","리포트 이용권 1장");check("A reward after B publication",summary().quantity===1);check("no B PII in notice",ev("document.body.innerText.includes('친구가 첫 책을 완성해 이용권 1장이 추가되었습니다.')"));sizes("A-reward");
  check("repeat summary recovery grants no duplicate",summary().quantity===1&&summary().quantity===1);
  open(shared);cli("wait","button[aria-label$='펼치기']");cli("click","button[aria-label$='펼치기']");cli("wait","[data-book-report]");final();
  check("existing account no free-ticket invitation",!ev("document.body.innerText.includes('처음 가입하고 필수 동의를')"));sizes("existing-member-cta");click("나도 내 책 만들기 ↗");cli("wait","--url","**/dev/book-flow");check("existing member normal selection",summary().quantity===1);
  for(const id of ["A","B"]){who=id;check(`${id} hydration/console`,!cli("console").messages.some(m=>m.type==="error"));check(`${id} no external resources`,ev("performance.getEntriesByType('resource').every(r=>new URL(r.name).origin===location.origin)"));}
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({checks,shared,report},null,2));process.stdout.write(`${checks.length} checks PASS\n`);
}finally{for(const id of ["A","B"]){who=id;cli("close");}}
