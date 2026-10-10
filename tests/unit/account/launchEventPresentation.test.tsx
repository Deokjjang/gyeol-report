import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe,it,expect,vi } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { LaunchCountdown } from "../../../src/components/growth/LaunchCountdown";
import { launchCountdown,launchRemaining,isLaunchEventView,LAUNCH_START,LAUNCH_END,LAUNCH_NOTICE,type LaunchEventView } from "../../../src/lib/growth/launchEvent";
import { launchEventView } from "../../../src/lib/growth/launchServer";
import { captureCampaign } from "../../../src/lib/growth/service";
import { captureReferral } from "../../../src/lib/referrals/service";
import { ticketAuth } from "../../helpers/ticketPublicationSql";
import { GET as publicState } from "../../../src/app/api/launch-event/route";
import { GET as localState } from "../../../src/app/dev/launch-event/route";
const view:LaunchEventView={state:"ACTIVE",serverNow:LAUNCH_START,startsAt:LAUNCH_START,endsAt:LAUNCH_END,campaignAvailable:true,referralAvailable:true,inviterAvailable:true,budgetApproved:true,campaignSlug:"launch-local"};
describe("launch display is not reward authority",()=>{
  it("server monotonic countdown: fixed end, no wall-clock extension, start floor is not activation",()=>{
    expect(launchCountdown(launchRemaining(view,0)!)).toBe("21일 00 : 00 : 00");
    vi.spyOn(Date,"now").mockReturnValue(0);expect(launchRemaining(view,2000)).toBe(Date.parse(LAUNCH_END)-Date.parse(LAUNCH_START)-2000);vi.restoreAllMocks();
    expect(launchRemaining(view,9999999999)).toBe(0);
    expect(launchRemaining({...view,state:"SCHEDULED",serverNow:"2026-10-10T14:59:59Z"},0)).toBe(1000);
    expect(launchRemaining({...view,state:"SCHEDULED"},0)).toBeNull();
    expect(launchRemaining({...view,state:"SCHEDULED",serverNow:"2026-10-12T03:00:00Z"},0)).toBeNull();
    expect(launchRemaining({...view,serverNow:"2026-10-28T14:59:59Z"},1000)).toBe(launchRemaining({...view,serverNow:"2026-10-28T15:00:00Z"},0));
    for(const state of ["PAUSED","ENDED"] as const)expect(launchRemaining({...view,state},0)).toBeNull();
  });
  it("malformed/failed server payload is fail closed; no budget or IDs disclosed",async()=>{
    expect(isLaunchEventView(view)).toBe(true);expect(isLaunchEventView({...view,endsAt:"2099-01-01"})).toBe(false);
    expect(isLaunchEventView({...view,serverNow:"invalid"})).toBe(false);
    expect(isLaunchEventView({...view,budgetApproved:false})).toBe(false);
    expect(isLaunchEventView({...view,serverNow:LAUNCH_END})).toBe(false);
    expect(isLaunchEventView({...view,serverNow:"2026-10-10T14:59:59Z"})).toBe(false);
    expect(await launchEventView({call:async()=>null})).toBeNull();
    expect(await launchEventView({call:async()=>{throw new Error("offline");}})).toBeNull();
    expect(await launchEventView({call:async()=>view})).toEqual(view);
  });
  it("stable SSR loading; no eligibility/CTA until authoritative response, accessible static summary",()=>{
    const html=renderToStaticMarkup(<LaunchCountdown/>);
    expect(html).toContain('data-launch-state="UNAVAILABLE"');expect(html).not.toContain('href="/campaign/');
    expect(html).toContain("EVENT COUNTDOWN");expect(html).toContain("11월 1일 00:00 종료");
    expect(html).not.toMatch(/단 3일|3일 한정|72시간|10\.29|이벤트 진행 중/);
    expect(html).toContain("기간·혜택 안내");expect(html).not.toContain('aria-live="assertive"');
    expect(LAUNCH_NOTICE).toMatch(/평생 최대 1장.*평생 최대 1장/);expect(LAUNCH_NOTICE).toContain("처리 지연");
  });
  it.each(["https://gyeolreport.com","https://www.gyeolreport.com"])("exact same origin accepted at %s; cross-origin/preview/suffix/forwarded rejected",async origin=>{
    const store={call:vi.fn(async()=>({ok:false}))};
    for(const capture of [captureCampaign,captureReferral]){
      const request=(source:string,url=origin)=>new NextRequest(`${url}/api/entry`,{method:"POST",headers:{origin:source,"x-forwarded-host":"gyeolreport.com"},body:"{}"});
      expect((await capture(request(origin),ticketAuth(null),store)).status).toBe(400);
      for(const source of ["https://evil.test","https://gyeolreport.com.evil.test",origin.includes("www")?"https://gyeolreport.com":"https://www.gyeolreport.com"])
        expect((await capture(request(source),ticketAuth(null),store)).status).toBe(403);
      expect((await capture(request(origin,"https://preview.vercel.app"),ticketAuth(null),store)).status).toBe(403);
    }
    expect(store.call).not.toHaveBeenCalled();
  });
  it("public Book/Auth gate unchanged OFF and dev inaccessible in Production",async()=>{
    expect((await publicState()).status).toBe(404);
    vi.stubEnv("NODE_ENV","production");expect((await localState(new Request("http://localhost/dev/launch-event?now=2026-10-29"))).status).toBe(404);vi.unstubAllEnvs();
  });
  it("poll/focus/visibility cleanup, isolated 1-second render, no client date/storage/query authorization",()=>{
    const ui=readFileSync("src/components/growth/LaunchCountdown.tsx","utf8"),shelf=readFileSync("src/components/book/BookShelf.tsx","utf8");
    expect(ui).toContain("performance.now()");expect(ui).toContain('"focus"');expect(ui).toContain('"visibilitychange"');
    expect(ui).toContain("clearInterval(tick)");expect(ui).not.toMatch(/Date\.now|localStorage|searchParams/);
    expect(shelf.indexOf("<LaunchCountdown")).toBeLessThan(shelf.indexOf('<section className={s.home}'));
    expect(shelf).toContain("onPointerUp");expect(shelf).toContain("createCoverflowAuto");
    expect(readFileSync("src/components/growth/launchCountdown.module.css","utf8")).toContain("tabular-nums");
  });
});
