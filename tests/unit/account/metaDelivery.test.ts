import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
// 운영 DB·로그인 대신 가짜(Meta·Supabase 네트워크 없음). 기본값은 「DB에 아무것도 없음·로그인 안 함」.
const fake=vi.hoisted(()=>({row:null as null|{agreed:boolean;version:string},rpc:vi.fn<(name:string,args?:unknown)=>Promise<{data:unknown;error:null}>>(async()=>({data:null,error:null})),currentUser:vi.fn(async():Promise<{id:string}|null>=>null)}));
vi.mock("../../../src/lib/db/supabaseServer",()=>({createSupabaseServerClient:()=>({
  from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:fake.row,error:null})})})}),rpc:(name:string,args:unknown)=>fake.rpc(name,args)})}));
vi.mock("../../../src/lib/account/supabase",()=>({createAccountPort:()=>({currentUser:fake.currentUser,finish:(r:unknown)=>r})}));
import { browserMetaEvent, metaDeliveryReady, metaPublicRequest, runMetaDeliveries, transmitMeta } from "../../../src/lib/analytics/metaDelivery";
import { GET, POST } from "../../../src/app/api/analytics/meta/route";
import { POST as PURCHASE } from "../../../src/app/api/analytics/purchase/route";
import { GET as PIXEL } from "../../../src/app/api/analytics/meta/pixel/route";
import { META_CONSENT_VERSION, META_DEFAULT_FROM, META_DEFAULT_PURCHASE, metaDefaultOn, metaMaySend } from "../../../src/lib/analytics/metaConsent";
import { measurementOrigin } from "../../../src/lib/analytics/server";
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();fake.row=null;fake.rpc.mockReset();fake.rpc.mockImplementation(async()=>({data:null,error:null}));fake.currentUser.mockReset();fake.currentUser.mockImplementation(async()=>null);});
const ready=()=>{vi.stubEnv("VERCEL_ENV","production");vi.stubEnv("META_MEASUREMENT_APPROVED",META_CONSENT_VERSION);vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID","1912751453433745");vi.stubEnv("META_CONVERSIONS_ACCESS_TOKEN","isolated-nonsecret-test-token");vi.stubEnv("META_GRAPH_API_VERSION","v99.0");};
describe("private Meta transport boundary",()=>{
  it("same-origin www/apex accepted; mixed origin, hostile host and preview rejected",()=>{
    vi.stubEnv("NODE_ENV","production");
    for(const origin of ["https://gyeolreport.com","https://www.gyeolreport.com"]){
      const request=new NextRequest(origin+"/api/analytics/meta",{headers:{origin}});expect(metaPublicRequest(request)).toBe(true);expect(measurementOrigin(request,false)).toBe(true);
    }
    for(const [url,origin] of [["https://www.gyeolreport.com","https://evil.com"],["https://evil.com","https://www.gyeolreport.com"],["https://preview.vercel.app","https://preview.vercel.app"],["https://www.gyeolreport.com","https://gyeolreport.com"]])expect(metaPublicRequest(new NextRequest(url,{headers:{origin}}))).toBe(false);
  });
  it("only three browser interaction names and catalog products allowed; rejects PII, values, registration and free purchase",()=>{
    expect(browserMetaEvent({event:"PageView",requestId:"test"})).toEqual({event:"PageView",params:{}});
    expect(browserMetaEvent({event:"ViewContent",productType:"saju_mbti_full"})?.event).toBe("ViewContent");
    for(const event of ["CompleteRegistration","Purchase","FreeTicketGranted","account_created"])expect(browserMetaEvent({event})).toBeNull();
    for(const key of ["email","name","url","userId","eventId","value","birthDate","mbti","params"])expect(browserMetaEvent({event:"PageView",[key]:"private"})).toBeNull();
    expect(browserMetaEvent({event:"ViewContent",productType:"unknown"})).toBeNull();
  });
  it("missing token/version/approval, preview and local fail closed without network",async()=>{
    const transport=vi.fn();vi.stubEnv("VERCEL_ENV","preview");expect(metaDeliveryReady()).toBe(false);
    expect(await transmitMeta({event_name:"CompleteRegistration",event_id:"registration_"+"a".repeat(32),event_time:1,user_data:{client_ip_address:"192.0.2.1",client_user_agent:"isolated"}},transport)).toBe(false);
    expect(transport).not.toHaveBeenCalled();ready();vi.stubEnv("META_MEASUREMENT_APPROVED","");expect(metaDeliveryReady()).toBe(false);
  });
  it("isolated local UI uses the actual Host, cannot enable vendor transport or production persistence",async()=>{
    vi.stubEnv("NODE_ENV","development");
    const request=(origin:string)=>new NextRequest("http://localhost:3198/api/analytics/meta",{method:"POST",headers:{host:"127.0.0.1:3198",origin,"content-type":"application/json"},body:JSON.stringify({agreed:false,requestId:"11111111-1111-4111-8111-111111111111"})});
    const response=await POST(request("http://127.0.0.1:3198")); expect(response.status).toBe(200); expect(response.cookies.get("gyeol-local-meta-consent")?.value).toContain(":no:");
    expect((await POST(request("https://evil.com"))).status).toBe(403);
    vi.stubEnv("NODE_ENV","production");expect((await POST(request("http://127.0.0.1:3198"))).status).toBe(403);
  });
  it("테스트 이벤트 코드(META_TEST_EVENT_CODE)가 있을 때만 test_event_code를 붙인다(모양이 틀리면 무시)",async()=>{
    ready();const transport=vi.fn(async()=>({ok:true,json:async()=>({events_received:1})})) as unknown as typeof fetch;
    const event={event_name:"PageView" as const,event_id:"11111111-1111-4111-8111-111111111111",event_time:1,user_data:{client_ip_address:"192.0.2.1",client_user_agent:"isolated"}};
    const sent=async(code?:string)=>{ if(code===undefined) vi.stubEnv("META_TEST_EVENT_CODE",""); else vi.stubEnv("META_TEST_EVENT_CODE",code); await transmitMeta(event,transport); return JSON.parse(String(vi.mocked(transport).mock.calls.at(-1)![1]?.body)); };
    expect((await sent()).test_event_code).toBeUndefined();
    expect((await sent("TEST12345")).test_event_code).toBe("TEST12345");
    expect((await sent("not a code")).test_event_code).toBeUndefined();
    expect((await sent("TEST12345")).data[0].event_source_url).toBe("https://www.gyeolreport.com/");
  });
  it("constant URL, exact payload and provider acknowledgement; retry preserves id and time",async()=>{
    ready();const transport=vi.fn(async()=>({ok:true,json:async()=>({events_received:1})})) as unknown as typeof fetch;
    const event={event_name:"CompleteRegistration" as const,event_id:"registration_"+"a".repeat(32),event_time:1,user_data:{client_ip_address:"192.0.2.1",client_user_agent:"isolated"}};
    expect(await transmitMeta(event,transport)).toBe(true);expect(await transmitMeta(event,transport)).toBe(true);
    const calls=vi.mocked(transport).mock.calls;expect(calls[0][0]).toBe("https://graph.facebook.com/v99.0/1912751453433745/events");
    const body=JSON.parse(String(calls[0][1]?.body));expect(body.data).toEqual([{...event,action_source:"website",event_source_url:"https://www.gyeolreport.com/"}]);
    expect(calls[0][1]?.body).toEqual(calls[1][1]?.body);
    expect(await transmitMeta(event,vi.fn(async()=>({ok:true,json:async()=>({events_received:0})})) as unknown as typeof fetch)).toBe(false);
    expect(await transmitMeta(event,vi.fn(async()=>{throw Error("isolated timeout");}))).toBe(false);
  });
});

// 시행일(덕짱님 결정 2026-11-09): 2026-12-10 00:00 KST부터 기본 측정. 시험은 시계를 시행 직전·직후로 바꿔 두 동작을 본다(Date만 가짜).
const AFTER="2026-12-10T00:00:00+09:00", BEFORE="2026-12-09T23:59:59.999+09:00";
const at=(iso:string)=>{ beforeEach(()=>{vi.useFakeTimers({toFake:["Date"]});vi.setSystemTime(new Date(iso));}); afterEach(()=>{vi.useRealTimers();}); };

describe("시행일 스위치(법률 검토 결과로 끌 수 있는 설정)",()=>{
  it("시행 시각은 2026-12-10 00:00 KST 한 곳 — 직전까지 꺼짐, 그 순간부터 켜짐. null이면 계속 꺼짐(동의한 사람만)",()=>{
    expect(META_DEFAULT_FROM).toBe(AFTER); expect(META_DEFAULT_PURCHASE).toBe(true);
    expect(metaDefaultOn(Date.parse(BEFORE))).toBe(false); expect(metaDefaultOn(Date.parse(AFTER))).toBe(true);
    expect(metaDefaultOn(Date.parse("2030-01-01T00:00:00+09:00"),null)).toBe(false);
  });
  it("보내는 조건: 동의는 언제나, 기록 없음은 시행일부터(결제는 결제 스위치를 따름), 거부·서버 답 전은 언제나 안 됨",()=>{
    for(const on of [false,true]){ expect(metaMaySend(true,on,"PageView")).toBe(true); expect(metaMaySend(true,on,"Purchase",false)).toBe(true);
      expect(metaMaySend(false,on)).toBe(false); expect(metaMaySend(undefined,on)).toBe(false); }
    expect(metaMaySend(null,false,"PageView")).toBe(false); expect(metaMaySend(null,false,"Purchase")).toBe(false);
    expect(metaMaySend(null,true,"PageView")).toBe(true); expect(metaMaySend(null,true,"Purchase")).toBe(true);
    // 「결제는 선택 동의로」: 결제만 빠지고 나머지 기본 측정은 그대로.
    expect(metaMaySend(null,true,"Purchase",false)).toBe(false); expect(metaMaySend(null,true,"InitiateCheckout",undefined,)).toBe(true);
  });
});

// ── 결정 A(2026-11-09): 기본 허용 · 거부 뒤 미전송 · 선택 동의에만 개인 식별 정보 ──
const decisionA=(name:string,iso:string,body:()=>void)=>describe(name,()=>{ at(iso); body(); });
decisionA("결정 A(시행일 뒤, 시계 2026-12-10 00:00 KST): 광고 측정 기본 허용(실제 Meta 전송 본문 기준, 네트워크는 가짜)",AFTER,()=>{
  const U="22222222-2222-4222-8222-222222222222", RID="11111111-1111-4111-8111-111111111111", H1="a".repeat(64), H2="b".repeat(64);
  const YES=`__Host-gyeol-meta-consent=${META_CONSENT_VERSION}:yes:33333333-3333-4333-8333-333333333333`, NO=`__Host-gyeol-meta-consent=${META_CONSENT_VERSION}:no:33333333-3333-4333-8333-333333333333`;
  const setup=()=>{ vi.stubEnv("NODE_ENV","production");vi.stubEnv("VERCEL","1");ready();
    vi.stubGlobal("fetch",vi.fn(async()=>({ok:true,json:async()=>({events_received:1})}))); };
  const req=(path:string,{cookie,body,method="POST"}:{cookie?:string;body?:object;method?:string}={})=>new NextRequest(`https://www.gyeolreport.com${path}`,{method,
    headers:{origin:"https://www.gyeolreport.com","content-type":"application/json","x-vercel-forwarded-for":"192.0.2.10","user-agent":"isolated-agent","x-request-id":RID,...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const sent=()=>vi.mocked(fetch).mock.calls.filter(([url])=>String(url).startsWith("https://graph.facebook.com/")).map(([,init])=>JSON.parse(String(init?.body)).data[0]);
  const events=[{event:"PageView"},{event:"ViewContent",productType:"saju_mbti_full"},{event:"InitiateCheckout",productType:"saju_mbti_full"}];
  const purchaseId="purchase_"+"c".repeat(32), purchaseParams={value:3900,currency:"KRW",content_ids:["saju_mbti_full"],content_type:"product",num_items:1};
  const cron=(user_data:Record<string,unknown>)=>fake.rpc.mockImplementation(async(name:string,args?:unknown)=>{
    const action=(args as {p_action?:string})?.p_action;
    if(name==="meta_delivery_batch") return {data:action==="claim"?[{event_name:"Purchase",event_id:purchaseId,event_time:1,custom_data:purchaseParams,user_data,lease:"44444444-4444-4444-8444-444444444444"}]:true,error:null};
    return {data:null,error:null};
  });

  it("기본 상태(설정 기록 없음): PageView·ViewContent·InitiateCheckout을 서버로 보내고 픽셀 거울 id를 준다 — 개인 식별 정보 없음, 로그인·DB도 보지 않음",async()=>{
    setup();
    for(const body of events){ const r=await POST(req("/api/analytics/meta",{body:{...body,requestId:RID}})); expect(r.status).toBe(200); expect((await r.json()).pixel).toMatchObject({event:body.event,eventId:RID}); }
    expect(sent().map(e=>e.event_name)).toEqual(["PageView","ViewContent","InitiateCheckout"]);
    for(const e of sent()) expect(e.user_data).toEqual({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent"});
    expect(fake.currentUser).not.toHaveBeenCalled(); expect(fake.rpc).not.toHaveBeenCalled();
    expect((await PIXEL(req("/api/analytics/meta/pixel",{method:"GET"}))).status).toBe(200);
    expect((await (await GET(req("/api/analytics/meta",{method:"GET"}))).json())).toEqual({choice:null,ready:true,optout:true});
  });

  it("기본 상태 Purchase: 결제 완료 화면이 로그인한 구매 회원으로 대기표에 넣고 같은 응답에 픽셀 거울을 준다 → 서버 전송(크론)도 개인 식별 정보 없이 같은 id",async()=>{
    setup(); fake.currentUser.mockImplementation(async()=>({id:U}));
    fake.rpc.mockImplementation(async(name:string)=>({data:name==="queue_meta_purchase"?true:name==="claim_meta_browser_events"?[{event:"Purchase",eventId:purchaseId,params:purchaseParams}]:null,error:null}));
    const r=await PURCHASE(req("/api/analytics/purchase",{body:{reportId:"report_abcdefghijklmnop",requestId:RID}}));
    expect(await r.json()).toEqual({ok:true,events:[{event:"Purchase",eventId:purchaseId,params:purchaseParams}]});
    expect(fake.rpc).toHaveBeenCalledWith("queue_meta_purchase",{p_report:"report_abcdefghijklmnop",p_browser:null,p_ip:"192.0.2.10",p_agent:"isolated-agent",p_user:U});
    expect(fake.rpc).toHaveBeenCalledWith("claim_meta_browser_events",{p_browser:null,p_user:U});
    cron({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent"});
    expect(await runMetaDeliveries()).toEqual({ready:true,sent:1,failed:0});
    expect(sent()).toEqual([expect.objectContaining({event_name:"Purchase",event_id:purchaseId,user_data:{client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent"},custom_data:purchaseParams})]);
  });

  it("거부 뒤 미전송: 거부 쿠키면 행동 이벤트·결제 완료 화면·서버 사실 확인·픽셀 창 모두 막히고 Meta·DB를 부르지 않는다. 동의 쿠키라도 DB 기록이 거부면 거부",async()=>{
    setup();
    for(const body of [...events,{poll:true}]){ const r=await POST(req("/api/analytics/meta",{cookie:NO,body:{...body,requestId:RID}})); expect(r.status).toBe(202); expect(await r.json()).toMatchObject({choice:false}); }
    expect((await PURCHASE(req("/api/analytics/purchase",{cookie:NO,body:{reportId:"report_abcdefghijklmnop",requestId:RID}}))).status).toBe(202);
    expect((await PIXEL(req("/api/analytics/meta/pixel",{cookie:NO,method:"GET"}))).status).toBe(404);
    expect(sent()).toEqual([]); expect(fake.rpc).not.toHaveBeenCalled();
    fake.row={agreed:false,version:META_CONSENT_VERSION}; // 다른 브라우저에서 로그인한 채 거부 → 이 브라우저의 동의 기록도 거부로 바뀐 경우
    expect((await POST(req("/api/analytics/meta",{cookie:YES,body:{event:"PageView",requestId:RID}}))).status).toBe(202);
    expect((await PIXEL(req("/api/analytics/meta/pixel",{cookie:YES,method:"GET"}))).status).toBe(404);
    expect(sent()).toEqual([]);
  });

  it("거부한 계정: 설정 쿠키 없는 다른 브라우저로 로그인해도 GET이 거부를 알려 주고 거부 쿠키를 남긴다(로그인 쿠키가 없으면 계정을 보지 않음)",async()=>{
    setup(); fake.currentUser.mockImplementation(async()=>({id:U}));
    fake.rpc.mockImplementation(async(name:string)=>({data:name==="meta_user_choice"?false:null,error:null}));
    const refused=await GET(req("/api/analytics/meta",{method:"GET",cookie:"sb-xscosaueqpatcqzbgkbl-auth-token=isolated"}));
    expect(await refused.json()).toEqual({choice:false,ready:true,optout:true});
    expect(refused.cookies.get("__Host-gyeol-meta-consent")?.value).toMatch(new RegExp(`^${META_CONSENT_VERSION}:no:[a-f0-9-]{36}$`));
    fake.rpc.mockImplementation(async()=>({data:null,error:null}));
    const open=await GET(req("/api/analytics/meta",{method:"GET",cookie:"sb-xscosaueqpatcqzbgkbl-auth-token=isolated"}));
    expect(await open.json()).toEqual({choice:null,ready:true,optout:true}); expect(open.cookies.get("__Host-gyeol-meta-consent")).toBeUndefined();
    // 계정 설정을 못 읽으면(DB 장애·migration 전 배포) 이번 화면만 보내지 않고 거부 쿠키는 남기지 않는다.
    fake.rpc.mockImplementation(async()=>({data:null,error:{message:"function meta_user_choice does not exist"}} as never));
    const unknown=await GET(req("/api/analytics/meta",{method:"GET",cookie:"sb-xscosaueqpatcqzbgkbl-auth-token=isolated"}));
    expect(await unknown.json()).toEqual({choice:false,ready:true,optout:true}); expect(unknown.cookies.get("__Host-gyeol-meta-consent")).toBeUndefined();
    fake.currentUser.mockClear(); await GET(req("/api/analytics/meta",{method:"GET"})); expect(fake.currentUser).not.toHaveBeenCalled();
  });

  it("선택 동의에만 개인 식별 정보: 동의 쿠키+DB 동의+로그인 회원이면 em·ph 해시(64자 하나씩만, 다른 칸 버림). 로그인 안 했거나 동의 기록이 없으면(180일 정리) 기본 측정만",async()=>{
    setup(); fake.row={agreed:true,version:META_CONSENT_VERSION}; fake.currentUser.mockImplementation(async()=>({id:U}));
    fake.rpc.mockImplementation(async(name:string,args?:unknown)=>({data:name==="meta_user_match"&&(args as {p_user:string}).p_user===U?{em:[H1],ph:[H2],raw:"buyer@example.com"}:null,error:null}));
    await POST(req("/api/analytics/meta",{cookie:YES,body:{event:"PageView",requestId:RID}}));
    expect(sent()[0].user_data).toEqual({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent",em:[H1],ph:[H2]});
    fake.currentUser.mockImplementation(async()=>null);
    await POST(req("/api/analytics/meta",{cookie:YES,body:{event:"PageView",requestId:RID}}));
    expect(sent()[1].user_data).toEqual({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent"});
    fake.row=null; fake.currentUser.mockImplementation(async()=>({id:U})); fake.currentUser.mockClear();
    await POST(req("/api/analytics/meta",{cookie:YES,body:{event:"PageView",requestId:RID}}));
    expect(sent()[2].user_data).toEqual({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent"}); expect(fake.currentUser).not.toHaveBeenCalled();
    // 서버 전송(크론): DB가 선택 동의 줄에만 붙인 해시는 그대로, 해시 모양이 아니면 버린다.
    vi.mocked(fetch).mockClear(); cron({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent",em:[H1],ph:[H2]}); await runMetaDeliveries();
    cron({client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent",em:["buyer@example.com"],ph:[H2,H1]}); await runMetaDeliveries();
    expect(sent().map(e=>e.user_data)).toEqual([{client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent",em:[H1],ph:[H2]},{client_ip_address:"192.0.2.10",client_user_agent:"isolated-agent"}]);
  });
});

decisionA("시행일 전(시계 2026-12-09 23:59:59.999 KST): 지금 동작 그대로 — 동의한 브라우저만 보내고, 설정 기록 없는 브라우저는 Meta·DB·로그인을 부르지 않는다",BEFORE,()=>{
  const U="22222222-2222-4222-8222-222222222222", RID="11111111-1111-4111-8111-111111111111";
  const YES=`__Host-gyeol-meta-consent=${META_CONSENT_VERSION}:yes:33333333-3333-4333-8333-333333333333`, SB="sb-xscosaueqpatcqzbgkbl-auth-token=isolated";
  const setup=()=>{ vi.stubEnv("NODE_ENV","production");vi.stubEnv("VERCEL","1");ready(); vi.stubGlobal("fetch",vi.fn(async()=>({ok:true,json:async()=>({events_received:1})}))); };
  const req=(path:string,{cookie,body,method="POST"}:{cookie?:string;body?:object;method?:string}={})=>new NextRequest(`https://www.gyeolreport.com${path}`,{method,
    headers:{origin:"https://www.gyeolreport.com","content-type":"application/json","x-vercel-forwarded-for":"192.0.2.10","user-agent":"isolated-agent","x-request-id":RID,...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const sent=()=>vi.mocked(fetch).mock.calls.filter(([url])=>String(url).startsWith("https://graph.facebook.com/"));
  const events=[{event:"PageView"},{event:"ViewContent",productType:"saju_mbti_full"},{event:"InitiateCheckout",productType:"saju_mbti_full"}];

  it("미동의자(설정 기록 없음): 행동 3종 202·픽셀 창 404·결제 완료 화면 202, Meta 전송 0·DB 0·로그인 확인 0. GET은 optout:false(화면이 시행일 전 카드를 그림)",async()=>{
    setup(); fake.currentUser.mockImplementation(async()=>({id:U}));
    for(const body of [...events,{poll:true}]){ const r=await POST(req("/api/analytics/meta",{cookie:SB,body:{...body,requestId:RID}})); expect(r.status).toBe(202); expect(await r.json()).toEqual({ok:false,ready:false,choice:null}); }
    expect((await PIXEL(req("/api/analytics/meta/pixel",{method:"GET"}))).status).toBe(404);
    expect((await PURCHASE(req("/api/analytics/purchase",{cookie:SB,body:{reportId:"report_abcdefghijklmnop",requestId:RID}}))).status).toBe(202);
    const got=await GET(req("/api/analytics/meta",{method:"GET",cookie:SB}));
    expect(await got.json()).toEqual({choice:null,ready:true,optout:false}); expect(got.cookies.get("__Host-gyeol-meta-consent")).toBeUndefined();
    expect(sent()).toEqual([]); expect(fake.rpc).not.toHaveBeenCalled(); expect(fake.currentUser).not.toHaveBeenCalled();
  });

  it("동의한 브라우저(쿠키 + DB 동의)는 예전처럼 보낸다: 행동 이벤트 서버 전송·픽셀 창 200·결제 완료 화면 대기표 넣기",async()=>{
    setup(); fake.row={agreed:true,version:META_CONSENT_VERSION};
    fake.rpc.mockImplementation(async(name:string)=>({data:name==="queue_meta_purchase"?true:name==="claim_meta_browser_events"?[]:name==="meta_user_match"?{}:null,error:null}));
    expect((await POST(req("/api/analytics/meta",{cookie:YES,body:{event:"PageView",requestId:RID}}))).status).toBe(200);
    expect(sent()).toHaveLength(1);
    expect((await PIXEL(req("/api/analytics/meta/pixel",{cookie:YES,method:"GET"}))).status).toBe(200);
    expect(await (await PURCHASE(req("/api/analytics/purchase",{cookie:YES,body:{reportId:"report_abcdefghijklmnop",requestId:RID}}))).json()).toEqual({ok:true,events:[]});
    expect(fake.rpc).toHaveBeenCalledWith("queue_meta_purchase",expect.objectContaining({p_report:"report_abcdefghijklmnop",p_browser:expect.stringMatching(/^[a-f0-9]{64}$/)}));
    expect(await (await GET(req("/api/analytics/meta",{method:"GET",cookie:YES}))).json()).toEqual({choice:true,ready:true,optout:false});
  });

  it("같은 브라우저·같은 요청이 시행 시각(2026-12-10 00:00 KST)을 넘으면 기본 측정으로 바뀐다(배포 없이 자동)",async()=>{
    setup();
    expect((await POST(req("/api/analytics/meta",{body:{event:"PageView",requestId:RID}}))).status).toBe(202);
    vi.setSystemTime(new Date(AFTER));
    expect((await POST(req("/api/analytics/meta",{body:{event:"PageView",requestId:RID}}))).status).toBe(200);
    expect(sent()).toHaveLength(1);
    expect(await (await GET(req("/api/analytics/meta",{method:"GET"}))).json()).toEqual({choice:null,ready:true,optout:true});
  });
});
