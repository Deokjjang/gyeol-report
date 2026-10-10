// Local-only coupon review. Actual SQL + deterministic report, mock provider only.
import {execFileSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import assert from "node:assert/strict";
const bin=process.env.BOOK_BROWSER_BIN||"agent-browser",origin="http://127.0.0.1:3189",out="/tmp/gyeol-v4-10b",session=`coupons10b-${process.pid}`,checks=[];
const fixtures=JSON.parse(readFileSync(`${out}/fixtures.json`,"utf8"));
mkdirSync(out,{recursive:true});
const cli=(...args)=>{const r=JSON.parse(execFileSync(bin,["--headed","--session",session,"--json",...args],{encoding:"utf8",timeout:60000}));assert.ok(r.success,JSON.stringify(r));return r.data;};
const ev=code=>cli("eval",code).result;
const check=(name,value)=>{assert.ok(value,name);checks.push(name);process.stdout.write(`PASS ${name}\n`);};
const open=path=>{cli("open",origin+path);cli("wait","--load","networkidle");cli("snapshot","-i");};
const click=name=>{cli("snapshot","-i");cli("find","role","button","click","--name",name,"--exact");cli("wait","--load","networkidle");};
const post=(action,body={})=>ev(`(async()=>{const r=await fetch('/dev/account/api/coupon-${action}',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(${JSON.stringify(body)})});return {status:r.status,body:await r.json()};})()`);
const shot=name=>{ev("document.querySelector('nextjs-portal')?.setAttribute('style','display:none')");cli("screenshot",`${out}/${name}.png`);};
const checkLabel=name=>{ev(`(()=>{const label=[...document.querySelectorAll('label')].find(e=>e.textContent.trim()===${JSON.stringify(name)});(label?.querySelector('input')??label)?.scrollIntoView({block:'center',behavior:'instant'});})()`);cli("snapshot","-i");cli("find","label",name,"check");};
function sizes(name){for(const w of [390,430,768,1440]){cli("set","viewport",String(w),w<768?"844":"960");check(`${name} ${w} overflow`,ev("document.documentElement.scrollWidth<=innerWidth&&[...document.querySelectorAll('[aria-label=\"책 입력\"]')].every(e=>e.scrollWidth<=e.clientWidth+1)"));check(`${name} ${w} runtime`,cli("errors").errors.length===0);check(`${name} ${w} hydration`,!cli("console").messages.some(m=>/hydration|did not match|uncaught/i.test(m.text||m.message||"")));shot(`${w}-${name}`);if(ev("!!document.querySelector('input[placeholder=\"코드 입력\"]')")){ev("document.querySelector('input[placeholder=\"코드 입력\"]').scrollIntoView({block:'center'})");shot(`${w}-${name}-controls`);ev("document.querySelector('[data-book-checkout]').scrollIntoView({block:'start'})");}}cli("set","viewport","390","844");}
function receipt(){const p=fixtures[0].payload.person,ctx=fixtures[0].payload.userContext;const person={name:p.name,birthDate:p.birthDate,paidBirthTimeMode:p.birthTimePrecision||(p.birthTimeUnknown?"unknown":"exact"),birthTime:p.birthTime,timeBranch:p.approximateBirthTimeSlot||"",birthTimeUnknown:p.birthTimeUnknown,gender:p.gender,mbtiType:p.mbtiType,jobStatus:ctx.jobStatus,detailedJob:ctx.detailJob,relationshipStatus:ctx.relationshipStatus,focusAreas:[],selectedYear:String(new Date().getFullYear())};
  ev(`sessionStorage.setItem('gyeol-book-input-v1:${fixtures[0].payload.productKey}',JSON.stringify(${JSON.stringify({version:1,state:{person,personB:{...person},category:"love"}})}))`);
  open(`/dev/book-flow/input?product=${fixtures[0].payload.productSlug}`);cli("wait","#a-name");click("다음 페이지 →");click("다음 페이지 →");cli("wait","[data-book-checkout]");cli("wait","--load","networkidle");
}
function apply(code){cli("snapshot","-i");cli("find","label","쿠폰 코드","fill",code);click("적용");}
try{
  cli("--allowed-domains","127.0.0.1","open",origin+"/dev/book-flow");cli("set","viewport","390","844");cli("set","media","light","reduced-motion");cli("wait","--load","networkidle");
  check("initial load",ev("document.body.innerText.includes('나에 관한 한 권')&&!document.querySelector('[data-nextjs-dialog]')"));
  check("explicit local fixture only",post("fixture").body.ok);receipt();sizes("no-coupon");
  check("normal price 1490",ev("document.querySelector('[data-book-checkout]').innerText.includes('1,490원')"));
  apply("GYEOL300");cli("wait","--text","300원 할인 · 적용됨");check("fixed price 1190",ev("document.querySelector('[aria-label=\"쿠폰 적용 금액\"]').innerText.includes('₩1,190')"));sizes("fixed");
  apply("20PERCENT");cli("wait","--text","20% 할인 · 적용됨");check("percentage price 1192",ev("document.querySelector('[aria-label=\"쿠폰 적용 금액\"]').innerText.includes('₩1,192')"));sizes("percentage");
  for(const [code,message] of [["INVALID_CODE","쿠폰 코드를 확인해 주세요."],["EXPIRED","사용 기간이 지난 쿠폰입니다."],["CAREER_ONLY","이 상품에는 적용할 수 없는 쿠폰입니다."],["MEMBER_ONLY","회원만 사용할 수 있는 쿠폰입니다."]]){
    apply(code);cli("wait","--text",message);check(code+" rejects",ev(`document.body.innerText.includes(${JSON.stringify(message)})`));shot(`390-${code.toLowerCase()}`);
  }
  apply("GYEOL300");cli("wait","--text","300원 할인 · 적용됨");checkLabel("전체 동의");click("모의 결제 · 책 발행 →");cli("wait","[data-book-report]");const guestUrl=ev("location.pathname");check("guest coupon creates actual book",guestUrl.includes("report_"));shot("390-guest-book");
  open("/dev/account");click("카카오로 계속하기");if(ev("!!document.querySelector('fieldset')")){checkLabel("전체 동의");click("동의하고 계속하기 →");}cli("wait","--text","리포트 이용권");
  check("explicit member code claim",post("claim",{code:"MEMBER_ONLY"}).body.ok);
  check("explicit ticket fixture",ev("fetch('/dev/account/api/ticket-fixture',{method:'POST',body:'one'}).then(r=>r.json()).then(b=>b.ok)"));receipt();cli("wait","select[aria-label=\"보유 쿠폰\"]");
  cli("snapshot","-i");const grant=ev("document.querySelector('select[aria-label=\"보유 쿠폰\"] option:nth-child(2)').value");cli("select","select[aria-label=\"보유 쿠폰\"]",grant);cli("wait","--text","회원 300원 할인 · 적용됨");sizes("member-coupon");
  const ticketLabel=ev("[...document.querySelectorAll('label')].find(e=>e.textContent.includes('리포트 이용권 1장 사용')).textContent.trim()");checkLabel(ticketLabel);check("ticket disables coupon UI",ev("document.querySelector('input[placeholder=\"코드 입력\"]').matches(':disabled')&&!document.querySelector('[aria-label=\"쿠폰 적용 금액\"]')"));sizes("ticket-exclusive");
  checkLabel("1,490원 결제");check("payment restores coupon quote",ev("document.querySelector('[aria-label=\"쿠폰 적용 금액\"]').innerText.includes('₩1,190')"));
  checkLabel("전체 동의");click("모의 결제 · 책 발행 →");cli("wait","[data-book-report]");const memberUrl=ev("location.pathname");check("member coupon actual book",memberUrl.includes("report_"));
  open("/dev/account");cli("wait","ul[aria-label=\"내 책 목록\"]");check("coupon book linked to library",ev(`!!document.querySelector('a[href="${memberUrl}"]')`));sizes("library");
  open(guestUrl);cli("wait","[data-book-report]");check("guest proof retained after login",ev("!!document.querySelector('[data-book-report]')"));
  for(let n=0;n<80&&ev("document.querySelector('[data-page]').dataset.page!=='back'");n++)click("다음 페이지");
  cli("wait","--text","내 서재에 보관하기");click("내 서재에 보관하기");cli("wait","--text","내 서재에 보관했습니다.");check("guest coupon book claim uses existing proof",true);shot("390-guest-claimed");
  // Six server-priced products, tampering rejected before monetary persistence.
  for(const f of fixtures){const q=post("quote",{productType:f.payload.productKey,selection:{code:"20PERCENT"}});check(`${f.id} pricing`,q.body.finalAmount===1192);}
  for(const field of ["finalAmount","user_id","discount_value","ticket"]){check(`tamper ${field}`,post("quote",{productType:"saju_mbti_full",[field]:1}).status===400);}
  check("resources stay local",ev("performance.getEntriesByType('resource').every(r=>new URL(r.name).origin===location.origin)"));
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({checks,guestUrl,memberUrl,result:"PASS"},null,2));process.stdout.write(`${checks.length} checks PASS\n`);
}catch(error){shot("failure");writeFileSync(`${out}/failure-dom.json`,JSON.stringify({snapshot:cli("snapshot","-i"),layout:ev("[...document.querySelectorAll('input,button')].map(e=>({label:e.textContent||e.getAttribute('aria-label'),rect:e.getBoundingClientRect().toJSON()}))")},null,2));throw error;}finally{cli("close");}
