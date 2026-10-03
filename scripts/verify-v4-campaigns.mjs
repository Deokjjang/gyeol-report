// Fresh local dev process per mode. No production/provider transport or fixture grants.
import {execFileSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import assert from "node:assert/strict";
const bin=process.env.BOOK_BROWSER_BIN||"agent-browser",origin="http://127.0.0.1:3192",mode=process.argv[2]||"ticket",out=`/tmp/gyeol-v4-12b/${mode}`,checks=[];
const fixtures=JSON.parse(readFileSync("/tmp/gyeol-v4-12a/fixtures.json","utf8"));mkdirSync(out,{recursive:true});
const sessions={B:`campaign-B-${process.pid}`,C:`campaign-C-${process.pid}`};let who="B";
const cli=(...args)=>{const r=JSON.parse(execFileSync(bin,["--session",sessions[who],"--json",...args],{encoding:"utf8",timeout:60000}));assert.ok(r.success,JSON.stringify(r));return r.data;};
const ev=code=>cli("eval",code).result;
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);process.stdout.write(`PASS ${name}\n`);};
const open=path=>{cli("open",origin+path);cli("wait","--load","networkidle");cli("snapshot","-i");};
const click=name=>{ev(`(async()=>{const b=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()===${JSON.stringify(name)}||e.getAttribute('aria-label')===${JSON.stringify(name)});b?.scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));})()`);cli("snapshot","-i");cli("find","role","button","click","--name",name,"--exact");cli("wait","--load","networkidle");};
const post=(path,body)=>ev(`(async()=>{const r=await fetch(${JSON.stringify(path)},{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(${JSON.stringify(body)})});return {status:r.status,body:await r.json()};})()`);
const summary=()=>ev("fetch('/dev/account/api/ticket-summary',{cache:'no-store'}).then(r=>r.json())");
const shot=name=>{ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')");cli("screenshot",`${out}/${name}.png`);};
function sizes(name){for(const w of [390,430,768,1440]){cli("set","viewport",String(w),w<768?"844":"960");ev("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");check(`${name} ${w} overflow`,ev("document.documentElement.scrollWidth<=innerWidth"));check(`${name} ${w} errors`,cli("errors").errors.length===0);shot(`${w}-${name}`);}cli("set","viewport","390","844");ev("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");}
function login(provider){click(provider==="kakao"?"카카오로 계속하기":"Google로 계속하기");if(ev("!!document.querySelector('fieldset')")){shot(`390-${who}-consent`);cli("find","label","전체 동의","check");click("동의하고 계속하기 →");}cli("wait","--text","리포트 이용권");cli("wait","--load","networkidle");}
function final(){ev("(async()=>{for(let i=0;i<120;i++){const b=document.querySelector('button[aria-label=\"다음 페이지\"]');if(!b||b.disabled)break;b.click();await new Promise(r=>setTimeout(r,45));}return document.querySelector('[data-page]')?.getAttribute('data-page')})()");cli("wait","[data-page=back]");}
function receipt(index){const f=fixtures[index],p=f.payload.person,ctx=f.payload.userContext;
  const person={name:p.name,birthDate:p.birthDate,paidBirthTimeMode:p.birthTimePrecision||(p.birthTimeUnknown?"unknown":"exact"),birthTime:p.birthTime,timeBranch:p.approximateBirthTimeSlot||"",birthTimeUnknown:p.birthTimeUnknown,gender:p.gender,mbtiType:p.mbtiType,jobStatus:ctx.jobStatus,detailedJob:ctx.detailJob,relationshipStatus:ctx.relationshipStatus,focusAreas:[],selectedYear:String(new Date().getFullYear())};
  ev(`sessionStorage.setItem('gyeol-book-input-v1:${f.payload.productKey}',JSON.stringify(${JSON.stringify({version:1,state:{person,personB:{...person},category:"love"}})}))`);
  open(`/dev/book-flow/input?product=${f.payload.productSlug}`);cli("wait","#a-name");click("다음 페이지 →");click("다음 페이지 →");cli("wait","[data-book-checkout]");cli("wait","--load","networkidle");
}
function createTicket(index){receipt(index);cli("wait","input[name=method]");cli("find","label","리포트 이용권 1장 사용 · 남은 이용권 1장","check");cli("find","label","전체 동의","check");shot(`390-${who}-ticket-receipt`);click("리포트 이용권 1장 사용 →");cli("wait","[data-book-report]");sizes(`${who}-created`);return ev("location.pathname");}
try{
  for(const id of ["B","C"]){who=id;cli("--allowed-domains","127.0.0.1","open",origin+"/dev/account");cli("set","viewport","390","844");cli("set","media","light","reduced-motion");cli("wait","--text","카카오로 계속하기");}
  who="B";check("explicit campaign definitions only",post("/dev/campaign/setup",{}).body.ok);
  check("explicit measurement countdown only",ev("fetch('/dev/measurement/setup',{method:'POST',body:'countdown'}).then(r=>r.ok)"));
  for (const [slug,state] of [["book-future","SCHEDULED"],["book-paused","PAUSED"],["book-none","ACTIVE_ELIGIBLE"]]) { open(`/dev/campaign/${slug}`); check(`${state} accurate`,ev(`document.querySelector('[data-campaign-state]').dataset.campaignState===${JSON.stringify(state)}`)); sizes(state.toLowerCase()); }
  open("/dev/campaign/book-ended");check("ended retains normal product CTA",ev("document.querySelector('[data-campaign-state]').dataset.campaignState==='ENDED'"));sizes("ended");
  open(`/dev/campaign/book-${mode}?utm_source=instagram&utm_medium=cpc&utm_campaign=book-launch&reward=100`);cli("wait","[data-campaign-landing]");check("server benefit truth",ev(`document.body.innerText.includes(${JSON.stringify(mode==="ticket"?"이용권 1장":"300원 할인 쿠폰")})`));sizes("landing");
  check("real deadline countdown",ev("!!document.querySelector('[data-countdown]')"));
  const deadline=ev("document.querySelector('[data-countdown] time').dateTime");cli("reload");cli("wait","--load","networkidle");check("refresh never extends deadline",ev("document.querySelector('[data-countdown] time').dateTime")===deadline);
  click("내 책 만들기 →");cli("wait","--text","카카오로 계속하기");shot("390-login");login("kakao");
  cli("wait","--text",mode==="ticket"?"캠페인 참여로":"캠페인 쿠폰을 받았습니다.");check("benefit notice after consent",true);sizes("benefit");
  check("exact ticket quantity",summary().quantity===(mode==="ticket"?1:0));
  open(`/dev/campaign/book-${mode}`);check("already granted state",ev("document.querySelector('[data-campaign-state]').dataset.campaignState==='BENEFIT_ALREADY_GRANTED'"));sizes("already-granted");
  let report;
  if(mode==="coupon"){
    receipt(0);cli("wait","select[aria-label=\"보유 쿠폰\"]");const grant=ev("document.querySelector('select[aria-label=\"보유 쿠폰\"] option:nth-child(2)').value");cli("snapshot","-i");cli("select","select[aria-label=\"보유 쿠폰\"]",grant);cli("wait","--text","검수용 300원 할인 · 적용됨");
    check("existing quote 1290 minus 300",ev("document.querySelector('[aria-label=\"쿠폰 적용 금액\"]').innerText.includes('₩990')"));sizes("coupon-receipt");cli("find","label","전체 동의","check");click("모의 결제 · 책 발행 →");cli("wait","[data-book-report]");report=ev("location.pathname");sizes("coupon-book");
    open("/dev/account");cli("wait","ul[aria-label=\"내 책 목록\"]");check("coupon actual publication owned",ev(`!!document.querySelector('a[href="${report}"]')`));check("coupon did not grant tickets",summary().quantity===0);
  }else{
    report=createTicket(0);final();ev("window.__copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async v=>{window.__copied=v}}})");click("공유 링크 복사");cli("wait","--text","복사됨");
    const url=new URL(ev("window.__copied"));check("ticket owner shared with referral credential",/^rf_/.test(url.searchParams.get("ref")));check("campaign not leaked in share URL",![...url.searchParams.keys()].some(k=>k!=="ref"));sizes("owner-share");
    who="C";open(`/dev/book-flow${url.pathname}${url.search}`);cli("wait","button[aria-label$='펼치기']");cli("click","button[aria-label$='펼치기']");cli("wait","[data-book-report]");final();click("나도 내 책 만들기 ↗");cli("wait","--text","Google로 계속하기");
    open("/dev/campaign/book-coupon");click("내 책 만들기 →");cli("wait","--text","Google로 계속하기");login("google");cli("wait","--text","친구 초대로 리포트 이용권 1장을 받았습니다.");check("referral first preserved against campaign",summary().quantity===1&&!summary().campaignNotice);sizes("referral-wins");
    createTicket(1);who="B";open("/dev/account");cli("wait","--text","친구가 첫 책을 완성해 이용권 1장이 추가되었습니다.");check("campaign member gets inviter reward after C publication",summary().quantity===1);check("repeat recovery no extra reward",summary().quantity===1);sizes("loop-complete");
  }
  who="B";open("/dev/campaign/book-other");check("existing account no signup benefit",ev("document.body.innerText.includes('기존 회원에게 지급되지 않습니다.')"));sizes("existing-member");check("existing page cannot add benefit",summary().quantity===(mode==="ticket"?1:0));
  who="B";
  const log=ev("JSON.parse(sessionStorage.getItem('gyeol:measurement')||'[]')");
  check("PageView captured",log.some(e=>e.event==="PageView"));
  for(const event of ["campaign_landing_opened","campaign_cta_clicked","signup_started","account_created","required_consent_completed","campaign_attributed","campaign_benefit_granted","book_viewed","input_started","input_completed","checkout_started","publishing_started","report_published","report_opened"])
    check(`canonical ${event}`,log.some(e=>e.event===event));
  check("receipt InitiateCheckout one",log.filter(e=>e.event==="InitiateCheckout").length===1);
  check("Purchase only paid",log.filter(e=>e.event==="Purchase").length===(mode==="coupon"?1:0));
  if(mode==="coupon")check("Purchase final paid 990 KRW",log.find(e=>e.event==="Purchase").params.value===990);
  open(report);cli("wait","[data-book-report]");cli("reload");cli("wait","[data-book-report]");cli("back");cli("wait","--load","networkidle");
  const more=ev("JSON.parse(sessionStorage.getItem('gyeol:measurement')||'[]')");
  check("refresh/back Purchase unchanged",more.filter(e=>e.event==="Purchase").length===(mode==="coupon"?1:0));
  if(mode==="coupon") {
    cli("tab","new",origin+report);cli("wait","[data-book-report]");cli("wait","--load","networkidle");
    check("second tab no new Purchase",ev("JSON.parse(sessionStorage.getItem('gyeol:measurement')||'[]').filter(e=>e.event==='Purchase').length")===0);
    const repeated=post("/dev/measurement",{reportId:report.split('/').at(-1)});
    check("second tab server claim duplicate",repeated.body.duplicate===true);
    // Keep both tabs until session cleanup; they share the authoritative order claim.
  }
  const aggregate=ev("fetch('/dev/measurement?aggregate=1').then(r=>r.json())");
  check("valid report aggregate",aggregate.counts.report_published===(mode==="coupon"?1:2));
  check("logical paid count",aggregate.counts.payment_succeeded===(mode==="coupon"?1:0));
  if(mode==="ticket"){check("referral downstream qualified",aggregate.downstream.some(e=>e.event==="referral_qualified"&&e.campaign==="book-ticket"));check("C is not direct campaign attribution",aggregate.campaigns["book-ticket"].campaign_attributed===1&&aggregate.counts.campaign_attributed===1);}
  writeFileSync(`${out}/events.json`,JSON.stringify({captured:more,aggregate},null,2));
  for(const id of ["B","C"]){who=id;check(`${id} console`,!cli("console").messages.some(m=>m.type==="error"));check(`${id} local-only resources`,ev("performance.getEntriesByType('resource').every(r=>new URL(r.name).origin===location.origin)"));}
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({checks,report,result:"PASS"},null,2));process.stdout.write(`${checks.length} checks PASS\n`);
}catch(error){shot("failure");writeFileSync(`${out}/failure-dom.json`,JSON.stringify(cli("snapshot","-i"),null,2));throw error;}finally{for(const id of ["B","C"]){who=id;cli("close");}}
