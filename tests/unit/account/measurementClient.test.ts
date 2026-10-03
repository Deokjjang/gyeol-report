import { readFileSync } from "node:fs";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
const storage = () => { const values = new Map<string,string>(); return { getItem:(k:string)=>values.get(k)??null, setItem:(k:string,v:string)=>values.set(k,v), removeItem:(k:string)=>values.delete(k), clear:()=>values.clear() }; };
const captured: Array<Record<string,unknown>> = [];
beforeEach(() => {
  vi.resetModules(); captured.length=0;
  vi.stubGlobal("sessionStorage",storage()); vi.stubGlobal("localStorage",storage());
  vi.stubGlobal("window",{location:{hostname:"127.0.0.1"},dispatchEvent:(e:CustomEvent)=>{captured.push(e.detail);return true;},fbq:vi.fn()});
  vi.stubGlobal("fetch",vi.fn(async()=>({ok:true,json:async()=>({events:[],purchases:[]})})));
});
afterEach(() => {vi.unstubAllGlobals();vi.unstubAllEnvs();vi.useRealTimers();});
describe("canonical browser adapter, no Meta network", () => {
  it("initial/navigation/back emit, rerender/Strict Mode repeat do not",async()=>{
    const {pageView}=await import("../../../src/lib/analytics/client");
    for(const path of ["/","/","/report/new","/report/new","/"])pageView(path);
    expect(captured.map(c=>c.event)).toEqual(["PageView","PageView","PageView"]);expect(window.fbq).not.toHaveBeenCalled();
  });
  it("cover selection/auto never ViewContent; actual product entry only once per journey",async()=>{
    const {interaction}=await import("../../../src/lib/analytics/client");
    interaction("book_selected","saju_mbti_full");interaction("book_selected","annual_fortune");
    expect(captured.filter(e=>e.channel==="meta")).toHaveLength(0);
    interaction("book_viewed","saju_mbti_full");interaction("book_viewed","saju_mbti_full");
    expect(captured.filter(e=>e.event==="ViewContent")).toHaveLength(1);
    vi.resetModules(); (await import("../../../src/lib/analytics/client")).interaction("book_viewed","saju_mbti_full");
    expect(captured.filter(e=>e.event==="ViewContent")).toHaveLength(1);
  });
  it("input is not checkout; receipt/revisit idempotent; ticket is never Purchase",async()=>{
    const {interaction}=await import("../../../src/lib/analytics/client");
    interaction("input_started","love_marriage_child"); interaction("input_completed","love_marriage_child");
    expect(captured.filter(e=>e.channel==="meta")).toHaveLength(0);
    interaction("checkout_started","love_marriage_child");interaction("checkout_started","love_marriage_child");interaction("ticket_selected","love_marriage_child");
    expect(captured.filter(e=>e.channel==="meta").map(e=>e.event)).toEqual(["InitiateCheckout"]);
  });
  it("late SDK is queued once; Purchase supplies stable eventID, safe params only",async()=>{
    vi.stubEnv("NODE_ENV","production"); vi.useFakeTimers();
    Object.assign(window,{location:{hostname:"gyeolreport.com"},fbq:undefined});
    const {sendMeta,flushMeta}=await import("../../../src/lib/analytics/client");
    sendMeta({event:"PageView",params:{}},"navigation");sendMeta({event:"PageView",params:{}},"navigation");
    window.fbq=vi.fn();flushMeta();expect(window.fbq).toHaveBeenCalledTimes(1);
    sendMeta({event:"Purchase",params:{value:990,currency:"KRW"},eventId:`purchase_${"a".repeat(32)}`} ,"purchase");
    expect(window.fbq).toHaveBeenLastCalledWith("track","Purchase",{value:990,currency:"KRW"},{eventID:`purchase_${"a".repeat(32)}`});
    await vi.runAllTimersAsync();expect(window.fbq).toHaveBeenCalledTimes(2);
  });
  it("server claim suppresses cross-tab/retry and storage loss; client supplies no amount",async()=>{
    let issued=false;vi.mocked(fetch).mockImplementation(async(_url,init)=>{
      expect(JSON.parse(String(init?.body))).toEqual({reportId:"report_01234567890123456789"});
      const result=issued?{ok:true,duplicate:true}:{ok:true,purchase:{eventId:`purchase_${"c".repeat(32)}`,productType:"annual_fortune",value:990,currency:"KRW"}};issued=true;
      return {ok:true,json:async()=>result} as Response;
    });
    const {dispatchPurchase}=await import("../../../src/lib/analytics/client");
    await Promise.all(Array.from({length:12},()=>dispatchPurchase("report_01234567890123456789",true)));
    expect(captured.filter(e=>e.event==="Purchase")).toHaveLength(1);
    sessionStorage.clear(); localStorage.clear();vi.resetModules();
    await (await import("../../../src/lib/analytics/client")).dispatchPurchase("report_01234567890123456789",true);
    expect(captured.filter(e=>e.event==="Purchase")).toHaveLength(1);expect(window.fbq).not.toHaveBeenCalled();
  });
  it("preview/nonpublic hosts do not send Meta",async()=>{
    vi.stubEnv("NODE_ENV","production");Object.assign(window,{location:{hostname:"preview.vercel.app"}});
    (await import("../../../src/lib/analytics/client")).sendMeta({event:"PageView",params:{}},"x");expect(window.fbq).not.toHaveBeenCalled();
  });
  it("bindings are effects/actions, not render calls; no direct fbq outside adapter/loader",()=>{
    const read=(p:string)=>readFileSync(`src/${p}`,"utf8");
    const shelf=read("components/book/BookShelf.tsx"),form=read("components/book/BookInput.tsx"),checkout=read("components/book/BookCheckout.tsx");
    expect(shelf).toContain('createCoverflowAuto(() => setCurrent'); expect(shelf).not.toContain('"book_viewed"');
    expect(form).toContain('useEffect(() => { interaction("book_viewed"');expect(checkout).toContain('useEffect(() => { interaction("checkout_started"');
    for(const p of ["components/book/BookCheckout.tsx","app/report/new/page.tsx","components/payment/DevTossCheckoutLauncher.tsx"])expect(read(p)).not.toContain('window.fbq');
    expect(read("components/analytics/MetaPixel.tsx")).not.toContain("fbq('track', 'PageView')");
    expect(read("lib/book/publicGate.ts")).toContain("return false");expect(read("lib/account/gate.ts")).toContain("return false");
  });
});
