import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const state=vi.hoisted(()=>({ready:true,consent:true}));
vi.mock("../../../src/lib/analytics/metaDelivery",()=>({metaDeliveryReady:()=>state.ready,metaRequestConsent:async()=>state.consent}));
import { GET } from "../../../src/app/api/analytics/meta/pixel/route";
afterEach(()=>{state.ready=true;state.consent=true;});
describe("opaque Pixel privacy boundary (no vendor network)",()=>{
  it("fails closed for previews, missing consent, disabled delivery and URL queries",async()=>{
    const request=(url="https://www.gyeolreport.com/api/analytics/meta/pixel")=>new NextRequest(url);
    expect((await GET(request("https://preview.vercel.app/api/analytics/meta/pixel"))).status).toBe(404);
    expect((await GET(request("https://www.gyeolreport.com/api/analytics/meta/pixel?email=private"))).status).toBe(404);
    state.consent=false;expect((await GET(request())).status).toBe(404);state.consent=true;state.ready=false;expect((await GET(request())).status).toBe(404);
  });
  it("sandbox forbids parent access, suppresses referrers and admits only a bounded allowlist",async()=>{
    const response=await GET(new NextRequest("https://www.gyeolreport.com/api/analytics/meta/pixel"));
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");expect(response.headers.get("cache-control")).toContain("no-store");
    const csp=response.headers.get("content-security-policy")!;expect(csp).toContain("sandbox allow-scripts;");expect(csp).not.toContain("allow-same-origin");
    const html=await response.text(),script=html.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)![1];
    let receive: (event:object)=>void=()=>{};
    const parent={postMessage:vi.fn()},window:Record<string,unknown>={},document={createElement:vi.fn(()=>({})),head:{appendChild:vi.fn()}};
    runInNewContext(script,{window,parent,document,addEventListener:(_type:string,fn:typeof receive)=>{receive=fn;}});
    expect(document.head.appendChild).toHaveBeenCalledOnce();
    const fbq=window.fbq as {queue: unknown[][]};
    const id="registration_"+"a".repeat(32),send=(data:object,origin="https://www.gyeolreport.com",source=parent)=>receive({source,origin,data:{type:"gyeol:pixel",...data}});
    for(let i=0;i<100;i++)send({event:"CompleteRegistration",eventId:id,params:{}});
    send({event:"CompleteRegistration",eventId:"registration_"+"b".repeat(32),params:{email:"private"}});
    send({event:"CompleteRegistration",eventId:"registration_"+"c".repeat(32),params:{}},"https://evil.com");
    send({event:"Purchase",eventId:"purchase_"+"d".repeat(32),params:{value:0,currency:"KRW"}});
    send({event:"ViewContent",eventId:"11111111-1111-4111-8111-111111111111",params:{content_ids:["private"],value:1,currency:"KRW",content_type:"product"}});
    const tracks=fbq.queue.map(args=>Array.from(args)).filter(args=>args[0]==="trackSingle");
    expect(tracks).toEqual([["trackSingle","1912751453433745","CompleteRegistration",{},{eventID:id}]]);
    expect(html).not.toMatch(/document\.cookie|parent\.location|top\.location|parent\.document|document\.referrer/);
  });
});
