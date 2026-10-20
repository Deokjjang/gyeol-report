// Run with PILOT_TOOL_ROOT pointing to an independent npm install of playwright and axe-core.
// Browser drafts and raw evidence stay outside the repository and grant no approval.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import {execFileSync} from 'node:child_process';
const [htmlFile,out]=process.argv.slice(2);
assert(htmlFile&&out&&process.env.PILOT_TOOL_ROOT,'USAGE: PILOT_TOOL_ROOT=... node browser-validation.mjs html output');
assert(!path.resolve(out).startsWith(process.cwd()+path.sep),'RAW_BROWSER_RESULTS_MUST_BE_EXTERNAL');
fs.mkdirSync(out,{recursive:true});
const require=createRequire(path.join(process.env.PILOT_TOOL_ROOT,'package.json'));
const {chromium}=require('playwright');
const html=fs.readFileSync(htmlFile,'utf8');
const originalData=JSON.parse(html.match(/<script id="workbench-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const receipt={classification:'SYNTHETIC_BROWSER_TEST_DRAFT',browser:null,tests:[],cards:[],layouts:[],filters:[],negative:[],performance:{},logs:[],csp:[],screenshots:[]};
const save=()=>fs.writeFileSync(path.join(out,'browser-raw.json'),JSON.stringify(receipt,null,2)+'\n');
const check=(name,actual,detail=null)=>{assert(actual,name);receipt.tests.push({name,status:'PASS',detail});save();};
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
receipt.browser={name:'Google Chrome',version:browser.version(),headless:true,platform:process.platform,arch:process.arch,access:'file://'};
const context=await browser.newContext({acceptDownloads:true,viewport:{width:1440,height:900}});
let page=await context.newPage();
page.on('pageerror',e=>receipt.logs.push({type:'pageerror',text:e.message}));
page.on('console',m=>receipt.logs.push({type:m.type(),text:m.text()}));
const samples=[],rssSamples=[];const processCdp=await browser.newBrowserCDPSession();const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
async function heap(){const {metrics}=await cdp.send('Performance.getMetrics');samples.push(Object.fromEntries(metrics.map(m=>[m.name,m.value])).JSHeapUsedSize);const info=await processCdp.send('SystemInfo.getProcessInfo');const ids=info.processInfo.map(p=>p.id).join(',');const rss=execFileSync('/bin/ps',['-o','rss=','-p',ids],{encoding:'utf8'}).trim().split(/\s+/).reduce((a,n)=>a+Number(n)*1024,0);rssSamples.push(rss);}
async function time(name,action){const t=performance.now();const r=await action();(receipt.performance[name]??=[]).push(performance.now()-t);await heap();return r;}
async function shot(name){const file=path.join(out,name+'.png');await page.screenshot({path:file});receipt.screenshots.push(file);}
async function openCard(c){await page.locator('#search').fill(c.reviewUnitId);await page.locator('[data-review-unit="'+c.reviewUnitId+'"]').click();}
try{
await time('htmlLoadAndFirstCard',()=>page.goto(pathToFileURL(path.resolve(htmlFile)).href,{waitUntil:'load'}));
check('Actual file HTML, permitted script, dashboard and first card',await page.evaluate(()=>document.readyState==='complete'&&window.workbenchTest.cardCount===37&&window.workbenchTest.indexCount===6965&&document.querySelectorAll('#dashboard strong').length>0));
receipt.performance.initialScriptExecution=(await cdp.send('Performance.getMetrics')).metrics.filter(m=>['ScriptDuration','TaskDuration'].includes(m.name));
receipt.performance.navigation=await page.evaluate(()=>performance.getEntriesByType('navigation')[0].toJSON());
check('36 originals, 37 cards, 12 engines, 7 relationships',new Set(originalData.cards.map(c=>c.catalogKey)).size===36&&originalData.cards.length===37&&new Set(originalData.cards.flatMap(c=>c.unit.engines)).size===12&&new Set(originalData.cards.map(c=>c.relationshipScope).filter(Boolean)).size===7);
check('200 row limit clearly displayed',(await page.locator('#count').textContent()).includes('6965 검토 단위 · 표시 200개'));
const panelLabels=['전체 원본 Record와 정확한 Source Proof','Supporting Source Provenance','상품·관계·Owner·방향·기간·필수 계산 근거','Domain 정책과 전체 Required Ancestry','원래 반례·금지 추론과 모델 제안','Remaining Gates — 원래 상태 유지','다음 행동'];
for(const c of originalData.cards){
 await time('cardSearchAndSwitch',()=>openCard(c));
 assert.equal(await page.locator('#card h2').textContent(),c.originalResearchId);
 assert((await page.locator('#card').textContent()).includes(c.productScope));
 for(const label of panelLabels){const summary=page.locator('#card summary').filter({hasText:label});await summary.click();assert(await summary.evaluate(e=>e.parentElement.open));assert((await summary.locator('..').locator('pre').textContent()).length>0);}
 const fields=await page.locator('.compare section').count();assert.equal(fields,2);
 receipt.cards.push({reviewUnitId:c.reviewUnitId,originalId:c.originalResearchId,product:c.productScope,relationship:c.relationshipScope,sourceProofHash:c.sourceProofHash,packetHash:c.reviewPacketHash,originalTextFields:c.reading.contentFields.length,details:panelLabels.length,status:'PASS'});
}
check('All 37 scoped cards render original/proposal/source/evidence/domain/gates/next actions',receipt.cards.length===37);
await page.locator('#reset').click();
for(const id of ['engine','product','relationship','source','domain','structural','witness','review']){
 const options=await page.locator('#'+id+' option').evaluateAll(es=>es.map(e=>e.value).filter(Boolean));
 for(const value of options){
  await time('filter',()=>page.locator('#'+id).selectOption(value));
  const expected=originalData.index.filter(r=>id==='engine'?r.engines.includes(value):id==='source'||id==='domain'?r[id].includes(value):id==='structural'||id==='witness'?Boolean(r[id])===(value==='YES'):id==='review'?value==='READ'?originalData.cards.some(c=>c.reviewUnitId===r.id):value==='UNREAD'?!originalData.cards.some(c=>c.reviewUnitId===r.id):value==='DRAFT_SELECTED'?false:true:r[id]===value).length;
  assert((await page.locator('#count').textContent()).startsWith(expected+' 검토 단위'));
  receipt.filters.push({id,value,expected,status:'PASS'});
 }
 await page.locator('#reset').click();
}
check('Every filter option and reset',receipt.filters.length>30);
await page.locator('#first-wave').click();check('First wave shortcut / READ',await page.locator('#list button').count()===37);
await page.locator('#review').selectOption('UNREAD');await page.locator('#list button').first().click();check('Unread units have no decision controls',await page.locator('#decision').count()===0);
await page.locator('#reset').click();
for(const row of [originalData.index[0],originalData.index[199],originalData.index[200],originalData.index.at(-1)]){await time('exactSearch',()=>page.locator('#search').fill(row.id));assert.equal(await page.locator('#list button').count(),1);}
check('Units beyond first 200 remain reachable by exact ID',true);
// Exhaustive search algorithm execution is measured in the real browser, using the same input handler.
const allSearch=await page.evaluate(()=>{const data=JSON.parse(document.querySelector('#workbench-data').textContent),input=document.querySelector('#search');let missing=[];const t=performance.now();for(const r of data.index){input.value=r.id;input.dispatchEvent(new Event('input',{bubbles:true}));if(document.querySelector('#list button')?.dataset.reviewUnit!==r.id)missing.push(r.id);}return {count:data.index.length,missing,milliseconds:performance.now()-t};});
check('All 6965 exact Unit searches resolve through actual input handler',allSearch.count===6965&&allSearch.missing.length===0,allSearch);
await page.locator('#reset').click();const korean=originalData.index.find(r=>typeof r.meaning==='string'&&/[가-힣]{3}/.test(r.meaning));const term=korean.meaning.match(/[가-힣]{3}/)[0];await page.locator('#search').fill(term);check('Korean meaning search',(await page.locator('#list button').count())>0);
await page.locator('#reset').click();const card=originalData.cards[0];await openCard(card);
await page.locator('#decision').selectOption('REQUEST_CONTEXT');await page.locator('#export').click();check('Incomplete reviewed fields block export',(await page.locator('#notice').textContent()).includes('REQUIRED_REVIEW_FIELDS_MISSING'));
for(const box of await page.locator('#card input[type=checkbox]').all())await box.check();
await page.locator('#reviewer-notes').fill('SYNTHETIC_BROWSER_TEST_DRAFT — 실제 운영자 검토 아님');
check('Unsaved status for decision/checks/notes',(await page.locator('#save-status').textContent()).includes('미저장 초안'));
await page.locator('#search').fill('');await page.locator('#review').selectOption('DRAFT_SELECTED');check('Selected filter includes draft',await page.locator('#list button').count()===1);
await page.locator('#decision').selectOption('UNSELECTED');check('Selected filter updates immediately',await page.locator('#list button').count()===0);
await page.locator('#decision').selectOption('REQUEST_CONTEXT');await page.locator('#reset').click();await openCard(originalData.cards[1]);await openCard(card);
check('Card switching retains notes/checkboxes/decision',(await page.locator('#reviewer-notes').inputValue()).includes('SYNTHETIC_BROWSER_TEST_DRAFT')&&await page.locator('#card input:checked').count()===8&&await page.locator('#decision').inputValue()==='REQUEST_CONTEXT');
const download=await time('jsonExport',async()=>{const pending=page.waitForEvent('download');await page.locator('#export').click();const d=await pending;const filename=path.join(out,'synthetic-browser-downloaded-draft.json');await d.saveAs(filename);assert.equal(await d.failure(),null);return filename;});
const exported=JSON.parse(fs.readFileSync(download,'utf8'));assert.equal(exported.purpose,'REVIEW_DRAFT_NOT_APPROVAL');check('Real JSON download / parse / no approval',exported.decisions.filter(d=>d.selectedDecision!=='UNSELECTED').length===1);
check('Export state and download reminder',!(await page.locator('#save-status').textContent()).includes('미저장 초안이')&&(await page.locator('#notice').textContent()).includes('다운로드된 파일을 확인'));
await page.reload();check('Reload requires explicit import; no silent persistent store',await page.locator('#reviewer-notes').inputValue()==='');
await time('jsonImport',()=>page.locator('#import').setInputFiles(download));await page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('무결성 확인 완료'));
check('Real file import restores checks/decision/notes',(await page.locator('#reviewer-notes').inputValue()).includes('SYNTHETIC_BROWSER_TEST_DRAFT')&&await page.locator('#card input:checked').count()===8&&await page.locator('#decision').inputValue()==='REQUEST_CONTEXT');
const cases=[...['catalogKey','originalResearchId','originalRecordHash','originalSourceVersion','productScope','relationshipScope','reviewPacketHash','sourceProofHash'].map(key=>({name:key,change:v=>{v.decisions[0][key]='WRONG';},error:'DRAFT_SCOPE_OR_HASH_MISMATCH:'+key})),{name:'duplicate',change:v=>v.decisions.push(structuredClone(v.decisions[0])),error:'DUPLICATE_DECISION'},{name:'unknownUnit',change:v=>v.decisions[0].reviewUnitId='UNKNOWN',error:'UNKNOWN_REVIEW_UNIT'},{name:'missingField',change:v=>{const d=v.decisions.find(d=>d.selectedDecision!=='UNSELECTED');d.reviewedFields.pop();},error:'REQUIRED_REVIEW_FIELDS_MISSING'},{name:'decision',change:v=>v.decisions[0].selectedDecision='APPROVED',error:'INVALID_DECISION_CHOICE'},{name:'approval',change:v=>v.decisions[0].operatorApproved=true,error:'UNSUPPORTED_APPROVAL_FIELD'},{name:'extra',change:v=>v.decisions[0].unknown=true,error:'INVALID_DECISION_SHAPE'}];
for(const test of [...cases,{name:'oversized',raw:' '.repeat(2097153),error:'DRAFT_TOO_LARGE'},{name:'malformed',raw:'{broken',error:null}]){
 const value=structuredClone(exported);if(test.change)test.change(value);const before=await page.evaluate(()=>JSON.stringify(window.workbenchTest.draft()));const content=test.raw??JSON.stringify(value);await page.locator('#import').setInputFiles({name:test.name+'.json',mimeType:'application/json',buffer:Buffer.from(content)});await page.waitForFunction(()=>document.querySelector('#notice').textContent.startsWith('가져오기 차단:'));
 const reason=await page.locator('#notice').textContent();if(test.error)assert(reason.includes(test.error));assert.equal(await page.evaluate(()=>JSON.stringify(window.workbenchTest.draft())),before);
 receipt.negative.push({name:test.name,reason,atomic:true,status:'PASS'});
}
check('All 16 negative imports are atomic and blocked',receipt.negative.length===16);
// Keyboard uses actual trusted browser input. No DOM focus replacement during typing.
await page.locator('#reset').click();await page.locator('#search').focus();await page.keyboard.press('Tab');check('Tab moves to engine filter',await page.locator('#engine').evaluate(e=>e===document.activeElement));await page.keyboard.press('Shift+Tab');check('Shift Tab returns to search',await page.locator('#search').evaluate(e=>e===document.activeElement));
await page.locator('#reset').focus();await page.keyboard.press('Enter');check('Enter activates reset',await page.locator('#search').inputValue()==='');
const box=page.locator('#card input[type=checkbox]').first();await box.focus();await page.keyboard.press('Space');assert(!(await box.isChecked()));await page.keyboard.press('Space');check('Space toggles checkbox',await box.isChecked());
await page.locator('#decision').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');check('Select keyboard changes decision',await page.locator('#decision').inputValue()!=='UNSELECTED');
await page.locator('#reviewer-notes').focus();await page.keyboard.type(' keyboard');check('Textarea keyboard input / focus preserved',await page.locator('#reviewer-notes').evaluate(e=>e===document.activeElement&&e.value.endsWith(' keyboard')));
const summary=page.locator('#card summary').first();await summary.focus();await page.keyboard.press('Enter');check('Details keyboard expansion / focus visible',await summary.evaluate(e=>e.parentElement.open&&getComputedStyle(e).outlineStyle==='solid'));
check('Live status and labels',await page.evaluate(()=>['notice','save-status'].every(id=>document.getElementById(id).getAttribute('aria-live')==='polite')&&[...document.querySelectorAll('input,select,textarea')].every(e=>e.labels?.length>0)));
// CDP evaluation is the QA execution context; it does not relax page CSP for page-created resources.
await page.evaluate(fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8'));
receipt.accessibility=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passes:r.passes.length,incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),screenReaderSession:'UNVERIFIED'};});
check('Automated WCAG audit',receipt.accessibility.violations.length===0,receipt.accessibility);
await page.evaluate(()=>{window.pilotViolations=[];document.addEventListener('securitypolicyviolation',e=>window.pilotViolations.push({directive:e.effectiveDirective,blockedURI:e.blockedURI}));});
let networkResponses=0;page.on('response',r=>{if(r.url().startsWith('https://'))networkResponses++;});
await page.evaluate(async()=>{const script=document.createElement('script');script.src='https://example.invalid/pilot.js';document.body.append(script);const image=new Image();image.src='https://example.invalid/pilot.png';document.body.append(image);const inline=document.createElement('script');inline.textContent='window.pilotInlineExecuted=true';document.body.append(inline);document.styleSheets[0].insertRule('@font-face{font-family:PilotBlocked;src:url("https://example.invalid/pilot.woff2")}');await Promise.allSettled([fetch('https://example.invalid/pilot'),document.fonts.load('12px PilotBlocked')]);});
await page.waitForFunction(()=>window.pilotViolations.length>=5);
receipt.csp=await page.evaluate(()=>window.pilotViolations);check('CSP enforced for external script/network/image/font and untrusted inline', ['script-src-elem','connect-src','img-src','font-src'].every(d=>receipt.csp.some(v=>v.directive===d))&&await page.evaluate(()=>window.pilotInlineExecuted!==true)&&networkResponses===0,receipt.csp);
// Genuine hostile content fixture; never use this as a review source or approval artifact.
const payload='</script><img src="https://example.invalid/x" onerror="window.pilotXss=true">';const hostile=structuredClone(originalData);hostile.cards[0].proposal.says=payload;
const safe=JSON.stringify(hostile).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');const hostileFile=path.join(out,'synthetic-xss-fixture.html');fs.writeFileSync(hostileFile,html.replace(/(<script id="workbench-data" type="application\/json">)[\s\S]*?(<\/script>)/,(_m,a,b)=>a+safe+b));
const xss=await context.newPage();await xss.goto(pathToFileURL(hostileFile).href);check('Hostile source text renders literally without unsafe HTML',await xss.locator('#card').evaluate((e,p)=>e.textContent.includes(p)&&!e.querySelector('img')&&window.pilotXss!==true,payload));await xss.close();
// Clear security probes by reload, handle the actual beforeunload prompt.
let warningSeen=false;page.once('dialog',async d=>{warningSeen=d.type()==='beforeunload';await d.dismiss();});await page.reload({timeout:3000}).catch(error=>{assert(error.name==='TimeoutError');});check('Unsaved beforeunload warning / cancel retains draft',warningSeen&&(await page.locator('#reviewer-notes').inputValue()).includes('keyboard'));
page.once('dialog',d=>d.accept());await page.reload();check('Confirmed reload discards memory; import instructions remain',await page.locator('#reviewer-notes').inputValue()===''&&(await page.locator('header').textContent()).includes('다음 접속 시 가져오세요'));
for(const [width,height]of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[375,812],[320,568]]){
 await page.setViewportSize({width,height});await page.locator('#first-wave').click();
 let maxOverflow=0;
 for(const c of originalData.cards){await openCard(c);for(const label of panelLabels){await page.locator('#card summary').filter({hasText:label}).click();}const state=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth}));maxOverflow=Math.max(maxOverflow,state.scroll-state.w,state.body-state.w);assert(maxOverflow<=1,'overflow '+width+' '+c.originalResearchId);}
 // Longest source detail, notes and controls remain reachable at each size.
 await time('longSourceExpand',async()=>{await page.locator('#card summary').first().click();await page.locator('#card summary').first().click();});
 await page.locator('#export').scrollIntoViewIfNeeded();assert(await page.locator('#export').isVisible());await page.evaluate(()=>scrollTo(0,0));await shot('viewport-'+width+'-header');await page.locator('#filters').scrollIntoViewIfNeeded();await shot('viewport-'+width+'-filters');await page.locator('.compare').scrollIntoViewIfNeeded();await shot('viewport-'+width+'-comparison');await page.locator('#reviewer-notes').scrollIntoViewIfNeeded();assert(await page.locator('#reviewer-notes').isVisible());await shot('viewport-'+width+'-draft');
 const last=originalData.cards.reduce((a,b)=>JSON.stringify(a).length>JSON.stringify(b).length?a:b);await openCard(last);await page.locator('#card summary').first().click();await page.locator('#card summary').first().scrollIntoViewIfNeeded();await shot('viewport-'+width+'-source');
 receipt.layouts.push({width,height,allCards:37,maxHorizontalOverflow:maxOverflow,sourceWrapping:true,controlsReachable:true,status:'PASS'});save();
}
check('All layouts, long IDs/Korean source text and bottom controls',receipt.layouts.length===7);
receipt.performance.heap={method:'CDP Performance.JSHeapUsedSize sampled after measured actions',samples:samples.length,peakObservedBytes:Math.max(...samples),wholeBrowserRSS:{method:'CDP process IDs, ps RSS summed; sampled after actions, not a continuous absolute peak',samples:rssSamples.length,peakObservedBytes:Math.max(...rssSamples)}};
receipt.performance.scriptExecution={method:'CDP ScriptDuration cumulative',metrics:(await cdp.send('Performance.getMetrics')).metrics.filter(m=>['ScriptDuration','TaskDuration','JSHeapUsedSize','JSHeapTotalSize'].includes(m.name))};
check('Actual authority, claims and allocations stay zero',await page.evaluate(()=>{const d=JSON.parse(document.querySelector('#workbench-data').textContent);return Object.entries(d.progress).filter(([k])=>/actual|approvalRecordsIssued|draftDecisionCollected/.test(k)).every(([,v])=>v===0)&&d.cards.every(c=>c.operatorApproved===false&&c.customerApproved===false);}));
check('No unexpected browser runtime errors',!receipt.logs.some(l=>l.type==='pageerror'));
receipt.status='CHROME_BROWSER_ACCEPTANCE_PASS';save();process.stdout.write(JSON.stringify({status:receipt.status,tests:receipt.tests.length,cards:receipt.cards.length,layouts:receipt.layouts.length,raw:path.join(out,'browser-raw.json')})+'\n');
}catch(error){receipt.status='FAIL';receipt.error=error.stack;save();throw error;}finally{await context.close();await browser.close();}
