import React, { type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const hooks=vi.hoisted(()=>({slots:[] as unknown[],index:0,effects:[] as (()=>void|(()=>void))[]}));
vi.mock("react",async original=>({...await original<typeof import("react")>(),
  useState:(initial:unknown)=>{const i=hooks.index++;if(!(i in hooks.slots))hooks.slots[i]=initial;return[hooks.slots[i],(v:unknown)=>{hooks.slots[i]=v;}];},
  useEffect:(fn:()=>void|(()=>void))=>{hooks.effects.push(fn);},
}));
import { LaunchCountdown } from "../../../src/components/growth/LaunchCountdown";
import { LAUNCH_START,LAUNCH_END,type LaunchEventView } from "../../../src/lib/growth/launchEvent";
const active:LaunchEventView={state:"ACTIVE",serverNow:"2026-10-12T03:00:00Z",startsAt:LAUNCH_START,endsAt:LAUNCH_END,campaignAvailable:true,referralAvailable:true,inviterAvailable:true,budgetApproved:true,campaignSlug:"launch-local"};
let payload:LaunchEventView,cleanup:void|(()=>void);
const render=()=>{hooks.index=0;hooks.effects=[];return LaunchCountdown({local:true});};
function text(n:ReactNode):string{return typeof n==="string"||typeof n==="number"?String(n):Array.isArray(n)?n.map(text).join(""):React.isValidElement<{children:ReactNode}>(n)?text(n.props.children):"";}
const flush=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
async function mount(){render();cleanup=hooks.effects[0]();await flush();}
beforeEach(()=>{
  hooks.slots=[];payload={...active};vi.useFakeTimers({toFake:["setInterval","clearInterval","Date","performance"]});
  vi.stubGlobal("document",Object.assign(new EventTarget(),{hidden:false}));vi.stubGlobal("window",new EventTarget());
  vi.stubGlobal("fetch",vi.fn(async()=>new Response(JSON.stringify(payload))));
});
afterEach(()=>{cleanup?.();cleanup=undefined;vi.useRealTimers();vi.unstubAllGlobals();});
describe("countdown actual component effects with isolated browser clock",()=>{
  it("late entry immediately targets fixed end, survives wall clock jumps and remount",async()=>{
    await mount();const before=text(render());expect(before).toContain("이벤트 진행 중");expect(before).toContain("19일 12 : 00 : 00");
    vi.setSystemTime("2040-01-01");await vi.advanceTimersByTimeAsync(1000);expect(text(render())).toContain("19일 11 : 59 : 59");
    vi.setSystemTime("2000-01-01");await vi.advanceTimersByTimeAsync(1000);expect(text(render())).toContain("19일 11 : 59 : 58");
    cleanup?.();hooks.slots=[];await mount();expect(text(render())).toContain("19일 12 : 00 : 00");
  });
  it("passing start floor is never activation; focus accepts explicit server activation",async()=>{
    payload={...active,state:"SCHEDULED",serverNow:"2026-10-10T14:59:59Z",budgetApproved:false,campaignAvailable:false};
    await mount();expect(render()).toBeNull();await vi.advanceTimersByTimeAsync(2000);expect(render()).toBeNull();
    payload={...active};window.dispatchEvent(new Event("focus"));await flush();expect(text(render())).toContain("이벤트 진행 중");
  });
  it("scheduled after earliest start shows no block and no false countdown",async()=>{
    payload={...active,state:"SCHEDULED",budgetApproved:false,campaignAvailable:false};await mount();expect(render()).toBeNull();
  });
  it("background return refreshes authoritative state; cleanup leaves no timers or requests",async()=>{
    await mount();Object.assign(document,{hidden:true});await vi.advanceTimersByTimeAsync(20_000);expect(fetch).toHaveBeenCalledTimes(1);
    payload={...active,state:"PAUSED",campaignAvailable:false};Object.assign(document,{hidden:false});document.dispatchEvent(new Event("visibilitychange"));await flush();
    expect(render()).toBeNull();expect(fetch).toHaveBeenCalledTimes(2);
    cleanup?.();cleanup=undefined;expect(vi.getTimerCount()).toBe(0);window.dispatchEvent(new Event("focus"));await flush();expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("deadline removes the whole block (no 0일 00:00:00); failure clears old active state",async()=>{
    payload={...active,serverNow:"2026-10-31T14:59:59Z"};await mount();expect(text(render())).toContain("00일 00 : 00 : 01");
    await vi.advanceTimersByTimeAsync(1000);expect(render()).toBeNull();
    payload={...active};window.dispatchEvent(new Event("focus"));await flush();expect(text(render())).toContain("이벤트 진행 중");
    vi.mocked(fetch).mockResolvedValue(new Response(null,{status:503}));window.dispatchEvent(new Event("focus"));await flush();expect(render()).toBeNull();
  });
  it("Oct 29 is a continuing countdown, not a restart",async()=>{
    payload={...active,serverNow:"2026-10-28T14:59:59Z"};await mount();expect(text(render())).toContain("03일 00 : 00 : 01");
    await vi.advanceTimersByTimeAsync(2000);expect(text(render())).toContain("02일 23 : 59 : 59");expect(text(render())).toContain("이벤트 진행 중");
  });
  // Fixed KST times around the end: 10/31 23:59:59 counts down, 11/1 00:00:00 and 11/2 show nothing (server says ENDED; a stale ACTIVE after the end is rejected).
  it.each([
    ["2026-10-31T14:59:59Z","ACTIVE","00일 00 : 00 : 01"],["2026-10-31T15:00:00Z","ENDED",null],["2026-11-01T15:00:00Z","ENDED",null],["2026-10-31T15:00:00Z","ACTIVE",null],
  ] as const)("server %s %s → %s",async(serverNow,state,shown)=>{
    payload={...active,state,serverNow,campaignAvailable:state==="ACTIVE",referralAvailable:state==="ACTIVE",inviterAvailable:state==="ACTIVE"};await mount();
    if(shown)expect(text(render())).toContain(shown);else expect(render()).toBeNull();
  });
});
