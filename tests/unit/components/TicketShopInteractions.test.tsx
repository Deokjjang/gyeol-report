import React, { type ReactNode, type ReactElement } from "react";
import { randomUUID, webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
vi.mock("react", async importOriginal => ({ ...(await importOriginal<typeof import("react")>()),
  useState: (initial: unknown) => { const i=hooks.index++; if (!(i in hooks.slots)) hooks.slots[i]=initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i]=typeof v === "function" ? v(hooks.slots[i]) : v; }]; },
  useRef: (initial: unknown) => { const i=hooks.index++; if (!(i in hooks.slots)) hooks.slots[i]={current:initial}; return hooks.slots[i]; },
  useCallback: (fn: unknown) => fn,
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
}));
import { TicketShop } from "../../../src/components/account/TicketShop";
import { TicketSummary } from "../../../src/components/account/TicketSummary";
import { BookInput, Fields } from "../../../src/components/book/BookInput";
vi.mock("next/navigation",()=>({useSearchParams:()=>new URLSearchParams("product=career_money_study")}));
import { bundlePendingKey, bundleReturnKey, MOCK_BUNDLE_POLICY } from "../../../src/lib/tickets/shopContract";
const scope = "a".repeat(64), other = "b".repeat(64), values = new Map<string,string>();
const order = { orderId:`bundle_${"c".repeat(32)}`,providerOrderId:`bundle_toss_${"d".repeat(32)}`,bundleId:"PACK_5",quantity:5,amount:6890,currency:"KRW",status:"READY",requestedAt:"2026-10-10T00:00:00Z" };
const response = (data: object, status=200) => new Response(JSON.stringify(data),{status});
let cleanup: (()=>void)|void;
const render = (callback=false) => { hooks.index=0;hooks.effects=[]; return TicketShop({local:true,callback,policyVersion:MOCK_BUNDLE_POLICY}); };
type Node = ReactElement<Record<string,unknown>>;
function nodes(node: ReactNode): Node[] { if (Array.isArray(node)) return node.flatMap(nodes); if (!React.isValidElement<Record<string,unknown>>(node)) return []; return [node,...nodes(node.props.children as ReactNode)]; }
function text(node: ReactNode): string { return typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(text).join("") : React.isValidElement<Record<string,unknown>>(node) ? text(node.props.children as ReactNode) : ""; }
const button = (label: string, callback=false) => nodes(render(callback)).find(n=>n.type==="button"&&text(n).includes(label))!;
const click = (label:string, callback=false) => (button(label,callback).props.onClick as ()=>void)();
const flush = async () => { for(let i=0;i<70;i++)await Promise.resolve(); };
async function mount(callback=false) { render(callback);cleanup=hooks.effects[0]();await vi.advanceTimersByTimeAsync(0);await flush();render(callback); }
function select() {
  const radio=nodes(render()).find(n=>n.type==="input"&&n.props.value==="PACK_5")!;
  (radio.props.onChange as ()=>void)();
  for(let i=0;i<3;i++) { const check=nodes(render()).filter(n=>n.type==="input"&&n.props.type==="checkbox")[i]; (check.props.onChange as (e:unknown)=>void)({target:{checked:true}}); }
}
beforeEach(()=>{
  hooks.slots=[];values.clear();vi.useFakeTimers();vi.stubGlobal("crypto",webcrypto);
  vi.stubGlobal("sessionStorage",{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k)});
  vi.stubGlobal("BroadcastChannel",undefined); vi.stubGlobal("document",Object.assign(new EventTarget(),{hidden:false}));
  vi.stubGlobal("window",Object.assign(new EventTarget(),{location:{href:"http://localhost/dev/account/tickets",pathname:"/dev/account/tickets",assign:vi.fn()},history:{state:{},replaceState:vi.fn()}}));
  vi.stubGlobal("fetch",vi.fn(async (url:string)=> url.endsWith("/state") ? response({scope,quantity:0}) : response({ok:false},503)));
});
afterEach(()=>{cleanup?.();cleanup=undefined;vi.useRealTimers();vi.unstubAllGlobals();});
describe("shop real component callbacks, not browser visual QA",()=>{
  it("0/1/10 balances and all editions render distinctly; no expensive default",async()=>{
    await mount();expect(text(render())).toContain("00 장");expect(button("이용권을 선택").props.disabled).toBe(true);
    for(const quantity of [1,10]){hooks.slots[0]={scope,quantity};expect(text(render())).toContain(`${String(quantity).padStart(2,"0")} 장`);}
    expect(nodes(render()).filter(n=>n.type==="input"&&n.props.type==="radio")).toHaveLength(4);
    select();expect(text(render())).toContain("6,890원");expect(button("이용권 5장 구매").props.disabled).toBe(false);
  });
  it("synchronous double click prepares once, persists before request, dedicated mock checkout only",async()=>{
    await mount();select();
    vi.mocked(fetch).mockImplementation(async (url,init)=>{
      if(String(url).endsWith("/state"))return response({scope,quantity:0});
      expect(JSON.parse(values.get(bundlePendingKey)!).requestId).toBe(JSON.parse(String(init?.body)).requestId);
      return response({ok:true,order,tossCheckoutRequest:{customerKey:`member_${scope}`,metadata:{bundleOrderId:order.orderId},requestPayment:{orderId:order.providerOrderId,amount:{value:6890}}}});
    });
    const submit = button("이용권 5장 구매").props.onClick as ()=>void;
    submit();submit();await flush();
    expect(vi.mocked(fetch).mock.calls.filter(([u])=>String(u).endsWith("/prepare"))).toHaveLength(1);
    expect(window.location.assign).toHaveBeenCalledWith(`/dev/account/tickets/mock?orderId=${order.orderId}`);
    expect(JSON.parse(values.get(bundlePendingKey)!).launched).toBe(true);
  });
  it("storage failure makes zero orders; no durable hint means no network prepare",async()=>{
    await mount();select();vi.mocked(fetch).mockClear();vi.stubGlobal("sessionStorage",{getItem:()=>null,setItem:()=>{throw Error("full");}});
    click("이용권 5장 구매");await flush();expect(fetch).not.toHaveBeenCalled();
  });
  it("same-name account switch clears previous balance/pending/return, never reuses its authority",async()=>{
    values.set(bundlePendingKey,JSON.stringify({requestId:randomUUID(),scope,bundleId:"PACK_5",orderId:order.orderId}));
    values.set(bundleReturnKey,JSON.stringify({scope,product:"career_money_study"}));
    await mount();vi.mocked(fetch).mockResolvedValue(response({scope:other,quantity:10}));window.dispatchEvent(new Event("focus"));await flush();
    expect(values.has(bundlePendingKey)).toBe(false);expect(values.has(bundleReturnKey)).toBe(false);
    expect(text(render())).toContain("10 장");expect(text(render())).toContain("계정이 변경");
  });
  it("callback removes sensitive query; pending grant is not balance arithmetic; same order recovers",async()=>{
    values.set(bundlePendingKey,JSON.stringify({requestId:randomUUID(),scope,bundleId:"PACK_5",orderId:order.orderId,providerOrderId:order.providerOrderId,launched:true}));
    window.location.href=`http://localhost/dev/account/tickets/checkout/success?orderId=${order.providerOrderId}&amount=6890&paymentKey=local-secret`;
    await mount(true);expect(window.history.replaceState).toHaveBeenCalled();expect(String(vi.mocked(window.history.replaceState).mock.calls[0][2])).not.toContain("paymentKey");
    vi.mocked(fetch).mockImplementation(async url=>String(url).endsWith("/state")?response({scope,quantity:0}):response({ok:false,order:{...order,status:"PAID_PENDING_GRANT"}},202));
    click("같은 주문 다시 확인",true);await flush();expect(text(render(true))).toContain("이용권 지급 확인 중");expect(text(render(true))).toContain("00 장");
    vi.mocked(fetch).mockImplementation(async url=>String(url).endsWith("/state")?response({scope,quantity:5}):response({ok:true,order:{...order,status:"GRANTED"}}));
    click("같은 주문 다시 확인",true);await flush();expect(text(render(true))).toContain("이용권이 준비되었습니다");expect(text(render(true))).toContain("05 장");expect(values.has(bundlePendingKey)).toBe(false);
    expect(window.location.assign).not.toHaveBeenCalled();
  });
  it("login expiry does not display a balance or demand a new payment",async()=>{
    vi.mocked(fetch).mockResolvedValue(response({code:"MEMBER_CONSENT_REQUIRED"},401));await mount();
    expect(text(render())).toContain("로그인하고 이어서 확인");expect(text(render())).not.toContain("00 장");
  });
  it("checking an older completed order never forgets a different in-flight order",async()=>{
    values.set(bundlePendingKey,JSON.stringify({requestId:randomUUID(),scope,bundleId:"PACK_5",orderId:order.orderId,launched:true}));
    const previous={...order,orderId:`bundle_${"e".repeat(32)}`,status:"GRANTED"};
    vi.mocked(fetch).mockImplementation(async url=>String(url).endsWith("/state")?response({scope,quantity:0}):String(url).endsWith("/ticket-history")?response({history:[]}):String(url).endsWith("/history")?response({orders:[previous]}):response({ok:true,order:previous}));
    await mount();click("구매·사용 내역");await flush();click("상태 확인");await flush();
    expect(JSON.parse(values.get(bundlePendingKey)!).orderId).toBe(order.orderId);
    expect(button("이용권을 선택").props.disabled).toBe(true);
  });
  it("library balance revalidates on another-tab announcement and unsubscribes",async()=>{
    const channel: {onmessage: null|(()=>void);close: ReturnType<typeof vi.fn>}={onmessage:null,close:vi.fn()};
    vi.stubGlobal("BroadcastChannel",function(){return channel;});
    const summary=()=>{hooks.index=0;hooks.effects=[];return TicketSummary({local:true});};
    vi.mocked(fetch).mockResolvedValue(response({quantity:1}));summary();cleanup=hooks.effects[0]();
    await vi.advanceTimersByTimeAsync(0);await flush();expect(text(summary())).toContain("1장");
    vi.mocked(fetch).mockResolvedValue(response({quantity:6}));channel?.onmessage?.();
    expect(text(summary())).toContain("확인 중");await flush();expect(text(summary())).toContain("6장");
    cleanup?.();cleanup=undefined;expect(channel?.close).toHaveBeenCalledOnce();
  });
  it.each(["other-account","network-error"])("Book return %s preserves the original draft until explicit new input",async mode=>{
    const key="gyeol-book-input-v1:career_money_study",original=JSON.stringify({version:1,state:{privateDraft:"original-account-only"}});
    values.set(key,original);values.set(bundleReturnKey,JSON.stringify({scope,product:"career_money_study"}));
    if(mode==="network-error")vi.mocked(fetch).mockRejectedValue(Error("OFFLINE"));
    else vi.mocked(fetch).mockResolvedValue(response({scope:other,quantity:3}));
    const form=()=>{hooks.index=0;hooks.effects=[];const element=BookInput({internal:true,now:"2026-10-10T00:00:00Z",ticketShopEnabled:true});return (element.type as (p:typeof element.props)=>ReactNode)(element.props);};
    form();cleanup=hooks.effects[1]();await vi.advanceTimersByTimeAsync(0);await flush();
    const view=form();hooks.effects[2]();expect(values.get(key)).toBe(original);
    expect(text(view)).not.toContain("original-account-only");
    const fields=nodes(view).find(n=>n.type===Fields)!;
    (fields.props.change as (p:unknown)=>void)({...fields.props.person as object,name:"새 입력"});
    form();hooks.effects[2]();expect(values.has(bundleReturnKey)).toBe(false);expect(values.get(key)).toContain("새 입력");
  });
});
