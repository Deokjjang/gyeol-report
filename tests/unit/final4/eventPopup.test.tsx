// 최종 A 13·14: 팝업 ①②③ 문구·접근성·링크, 보상 이야기는 ①·공개 정보에 없음 · 팝업 서버(읽기 전용, 회원 본인만) · 메인 배너 시작 전/중/끝.
import React, { type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[], mock: false }));
vi.mock("react", async original => {
  const real = await original<typeof import("react")>();
  return { ...real,
    useState: (initial: unknown) => { if (!hooks.mock) return real.useState(initial); const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = typeof initial === "function" ? (initial as () => unknown)() : initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? (v as (x: unknown) => unknown)(hooks.slots[i]) : v; }]; },
    useEffect: (fn: () => void | (() => void), deps?: unknown[]) => { if (!hooks.mock) return real.useEffect(fn, deps); hooks.effects.push(fn); },
  };
});
vi.mock("server-only", () => ({}));
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { EventPopup } from "@/components/event/EventPopup";
import { GiftEventCountdown } from "@/components/growth/GiftEventCountdown";
import { handleEventPopup } from "@/lib/ops/comp/popup";
import { ACCOUNT_POLICY_VERSIONS } from "@/lib/account/policy";
import type { AccountPort } from "@/lib/account/handler";
import type { PopupState } from "@/lib/ops/comp/popupSelect";

const event = (phase: "off" | "before" | "during" | "after", serverNow = "2026-11-10T00:00:00.000Z") => ({ phase, serverNow, startsAt: "2026-11-06T15:00:00.000Z", endsAt: "2026-11-16T15:00:00.000Z", maxPerAccount: 2, validDays: 30 });
const at = () => Date.parse("2026-11-10T00:00:00.000Z");
const html = (id: "event-1plus1" | "comp-b" | "comp-a", state: PopupState) => renderToStaticMarkup(<EventPopup id={id} state={state} clock={at} onDone={() => undefined} />);
const plain = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("팝업 ①②③", () => {
  it("① 1+1: 문구 그대로, 남은 시간, 예시·리포트 고르기, 보상 이야기 없음", () => {
    const h = html("event-1plus1", { member: false, comp: null, event: event("during") }), t = plain(h);
    for (const line of ["11월 7일 – 11월 16일", "한 권을 펼치면, 한 권이 더", "리포트를 한 권 결제하면 무료 이용권 한 장을 더 드려요. 나를 한 권 더 읽거나, 소중한 사람에게 선물해 보세요.",
      "남은 시간 6일 15:00:00", "한 계정에 두 번까지 · 이용권은 받은 날부터 30일", "예시 먼저 보기", "리포트 고르기", "오늘 하루 보지 않기"]) expect(t).toContain(line);
    expect(h).toContain('href="/example"');
    expect(t).not.toMatch(/보상|사과/);
  });
  it("② B: 문구·이용권 카드·만료일, 1+1 줄은 이벤트 기간에만", () => {
    const comp = { tier: "B" as const, quantity: 1, unused: 1, expiresAt: "2026-12-06T03:00:00.000Z" };
    const during = plain(html("comp-b", { member: true, comp, event: event("during") }));
    for (const line of ["새로 쓴 결리포트", "결리포트를 처음부터 다시 썼어요", "만세력은 더 정확하게, 사주와 MBTI를 잇는 해석은 더 깊게, 문장은 더 내 이야기처럼. 먼저 찾아 주신 분께 새 결리포트를 읽어 볼 이용권을 드려요.",
      "무료 이용권 1장 12월 6일까지", "직접 읽거나, 소중한 사람에게 선물할 수 있어요.", "지금은 1+1 기간이에요. 결제 1건마다 1장을 더 드려요.", "이용권으로 만들기"]) expect(during).toContain(line);
    expect(plain(html("comp-b", { member: true, comp, event: event("after") }))).not.toContain("1+1 기간");
    expect(html("comp-b", { member: true, comp, event: event("during") })).toContain('href="/account#gifts"');
  });
  it("③ A: 문구·이용권 2장 카드, 1+1 줄 없음", () => {
    const t = plain(html("comp-a", { member: true, comp: { tier: "A", quantity: 2, unused: 2, expiresAt: "2026-12-06T03:00:00.000Z" }, event: event("during") }));
    for (const line of ["새로 쓴 결리포트", "믿고 먼저 결제해 주셔서 고맙습니다", "아직 부족했던 결리포트를 믿어 주신 덕분에 처음부터 다시 쓸 수 있었어요. 만세력은 더 정확하게, 해석은 더 깊게, 문장은 더 내 이야기처럼. 고마운 마음을 담아 이용권 두 장을 드려요.",
      "무료 이용권 2장 12월 6일까지", "한 장은 나에게, 한 장은 소중한 사람에게.", "이용권으로 만들기"]) expect(t).toContain(line);
    expect(t).not.toContain("1+1 기간");
  });
  it("접근성: 대화상자·제목·설명 연결, 닫기 라벨", () => {
    const h = html("comp-a", { member: true, comp: { tier: "A", quantity: 2, unused: 2, expiresAt: "2026-12-06T03:00:00.000Z" }, event: null });
    expect(h).toMatch(/<dialog[^>]*aria-modal="true"/);
    const title = h.match(/aria-labelledby="([^"]+)"/)![1], body = h.match(/aria-describedby="([^"]+)"/)![1];
    expect(h).toContain(`<h2 id="${title}"`); expect(h).toContain(`id="${body}"`);
    expect(h).toContain('aria-label="닫기"');
    expect(h).not.toMatch(/font-family:[^;"]*(serif|Myeongjo|명조|궁서)/i);
  });
});

describe("팝업 서버 GET /auth/event-popup", () => {
  const user = { id: "11111111-1111-4111-8111-111111111111", displayName: "하람", provider: "kakao" as const, kakaoId: "1" };
  const consents = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: "2026-11-01T00:00:00Z" }));
  const port = (member: boolean) => ({ currentUser: async () => (member ? user : null), read: async () => ({ profile: user, consents }), finish: (r: unknown) => r }) as unknown as AccountPort;
  const req = (origin = "https://www.gyeolreport.com") => new NextRequest(`${origin}/auth/event-popup`);
  const env = { GIFT_EVENT_ENABLED: "1" }, now = Date.parse("2026-11-10T00:00:00Z");
  it("손님: 공개 기간 정보만(보상 저장소를 부르지 않음)", async () => {
    const calls: string[] = [];
    const r = await handleEventPopup(req(), port(false), { call: async a => { calls.push(a); return { ok: true }; } }, env, now);
    expect(await r.json()).toMatchObject({ ok: true, member: false, comp: null, event: { phase: "during" } });
    expect(calls).toEqual([]);
    expect(r.headers.get("cache-control")).toContain("no-store");
  });
  it("회원: 읽기(popup)만 부르고 지급(sync)은 부르지 않는다, 안 쓴 장이 없으면 comp 없음", async () => {
    const calls: string[] = [];
    const store = (body: Record<string, unknown>) => ({ call: async (a: string) => { calls.push(a); return body; } });
    const a = await handleEventPopup(req(), port(true), store({ ok: true, tier: "A", quantity: 2, unused: 2, expiresAt: "2026-12-06T03:00:00+00:00" }), env, now);
    expect(await a.json()).toMatchObject({ member: true, comp: { tier: "A", unused: 2, expiresAt: "2026-12-06T03:00:00.000Z" } });
    const none = await handleEventPopup(req(), port(true), store({ ok: true, tier: null }), env, now);
    expect((await none.json()).comp).toBeNull();
    const expired = await handleEventPopup(req(), port(true), store({ ok: true, tier: "B", quantity: 1, unused: 1, expiresAt: "2026-11-09T00:00:00Z" }), env, now);
    expect((await expired.json()).comp).toBeNull();
    expect(calls).toEqual(["popup", "popup", "popup"]);
  });
  it("다른 출처는 403, GET만", async () => {
    expect((await handleEventPopup(req("https://evil.example"), port(true), { call: async () => ({ ok: true }) }, env, now)).status).toBe(403);
    expect((await handleEventPopup(new NextRequest("https://www.gyeolreport.com/auth/event-popup", { method: "POST" }), port(true), { call: async () => ({ ok: true }) }, env, now)).status).toBe(405);
  });
});

describe("메인 배너·타이머(서버 시각)", () => {
  let payload: Record<string, unknown>, cleanup: void | (() => void);
  function text(n: ReactNode): string { return typeof n === "string" || typeof n === "number" ? String(n) : Array.isArray(n) ? n.map(text).join("") : React.isValidElement<{ children: ReactNode }>(n) ? text(n.props.children) : ""; }
  const render = () => { hooks.index = 0; hooks.effects = []; return GiftEventCountdown(); };
  const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
  async function mount() { render(); cleanup = hooks.effects[0](); await flush(); }
  beforeEach(() => {
    hooks.mock = true; hooks.slots = []; vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date", "performance"] });
    vi.stubGlobal("document", Object.assign(new EventTarget(), { hidden: false }));
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(payload))));
  });
  afterEach(() => { cleanup?.(); cleanup = undefined; hooks.mock = false; vi.useRealTimers(); vi.unstubAllGlobals(); });
  it("시작 전: 「11월 7일 00시 시작」 + 시작까지, 시작 시각이 지나면 종료까지로 바뀐다", async () => {
    payload = event("before", "2026-11-06T14:59:58.000Z"); await mount();
    const t = text(render());
    expect(t).toContain("11월 7일 00시 시작"); expect(t).toContain("시작까지"); expect(t).toContain("0일00시간00분02초");
    await vi.advanceTimersByTimeAsync(3000);
    const t2 = text(render());
    expect(t2).toContain("종료까지"); expect(t2).toContain("9일23시간59분59초"); expect(t2).toContain("한 계정에 두 번까지");
  });
  it("진행 중 → 끝나면 자동으로 사라진다, 꺼짐·끝은 처음부터 없음", async () => {
    payload = event("during", "2026-11-16T14:59:59.000Z"); await mount();
    expect(text(render())).toContain("종료까지");
    await vi.advanceTimersByTimeAsync(2000);
    expect(render()).toBeNull();
    for (const p of ["off", "after"] as const) { cleanup?.(); hooks.slots = []; payload = event(p); await mount(); expect(render()).toBeNull(); }
  });
  it("배너에도 보상 이야기는 없다", async () => {
    payload = event("during"); await mount();
    expect(text(render())).not.toMatch(/보상|사과/);
  });
});
