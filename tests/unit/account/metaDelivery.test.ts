import { afterEach, describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { browserMetaEvent, metaDeliveryReady, metaPublicRequest, transmitMeta } from "../../../src/lib/analytics/metaDelivery";
import { POST } from "../../../src/app/api/analytics/meta/route";
import { META_CONSENT_VERSION } from "../../../src/lib/analytics/metaConsent";
import { measurementOrigin } from "../../../src/lib/analytics/server";
afterEach(()=>vi.unstubAllEnvs());
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
