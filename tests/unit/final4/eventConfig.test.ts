// 최종 A 11·14: 1+1 기간(env, 오프셋 없으면 KST·끝 23:59:59 포함) · 팝업 고르기(상황마다 하나, 화면 제한) · 오늘 하루 보지 않기.
import { describe, expect, it } from "vitest";
import { GIFT_EVENT_DEFAULT_END, GIFT_EVENT_DEFAULT_START, giftEventActive, giftEventConfig, giftEventPublicView, giftEventWindow, parseEventInstant } from "@/lib/ops/config";
import { eventRangeLabel, eventStartLabel, expiryLabel, kstDay, popupAllowedPath, popupHidden, remainingLabel, rememberPopup, selectPopup, timesLabel, type PopupState } from "@/lib/ops/comp/popupSelect";

const T = (s: string) => Date.parse(s);
const ON = { GIFT_EVENT_ENABLED: "1" } as const;

describe("1+1 기간(서버 시각, KST)", () => {
  it("오프셋 없는 env는 KST, 오프셋·Z는 그대로", () => {
    expect(parseEventInstant("2026-11-07 00:00:00")).toBe(T("2026-11-07T00:00:00+09:00"));
    expect(parseEventInstant("2026-11-07T00:00")).toBe(T("2026-11-06T15:00:00Z"));
    expect(parseEventInstant("2026-11-07")).toBe(T("2026-11-07T00:00:00+09:00"));
    expect(parseEventInstant("2026-11-06T15:00:00Z")).toBe(T("2026-11-07T00:00:00+09:00"));
    expect(parseEventInstant("2026-11-07T09:00:00+0900")).toBe(T("2026-11-07T00:00:00Z"));
    expect(parseEventInstant("11/07/2026")).toBeNaN();
  });
  it("끝은 23:59:59를 포함한다(경계 = 다음 날 0시), 날짜만이면 그 날 끝", () => {
    expect(parseEventInstant("2026-11-16 23:59:59", "end")).toBe(T("2026-11-17T00:00:00+09:00"));
    expect(parseEventInstant("2026-11-16", "end")).toBe(T("2026-11-17T00:00:00+09:00"));
    expect(parseEventInstant("2026-11-17T00:00:00+09:00", "end")).toBe(T("2026-11-17T00:00:00+09:00"));
  });
  it("기본 기간 2026-11-07 00:00:00 ~ 11-16 23:59:59 KST, 켜짐(=1)일 때만", () => {
    expect([GIFT_EVENT_DEFAULT_START, GIFT_EVENT_DEFAULT_END]).toEqual(["2026-11-07T00:00:00+09:00", "2026-11-16T23:59:59+09:00"]);
    expect(giftEventWindow({}, T("2026-11-08T00:00:00+09:00")).phase).toBe("off");
    expect(giftEventWindow(ON, T("2026-11-06T23:59:59+09:00")).phase).toBe("before");
    expect(giftEventWindow(ON, T("2026-11-07T00:00:00+09:00")).phase).toBe("during");
    expect(giftEventWindow(ON, T("2026-11-16T23:59:59.999+09:00")).phase).toBe("during");
    expect(giftEventWindow(ON, T("2026-11-17T00:00:00+09:00")).phase).toBe("after");
    const c = giftEventConfig(ON, T("2026-11-10T12:00:00+09:00"));
    expect(c).toMatchObject({ active: true, start: "2026-11-06T15:00:00.000Z", end: "2026-11-16T15:00:00.000Z", maxPerAccount: 2, validDays: 30 });
    expect(giftEventActive(ON, T("2026-11-17T00:00:01+09:00"))).toBe(false);
  });
  it("env로 시작·끝을 바꾼다(Vercel UTC 서버에서도 KST로)", () => {
    const env = { ...ON, GIFT_EVENT_START: "2026-11-08 10:00", GIFT_EVENT_END: "2026-11-09 23:59:59" };
    expect(giftEventWindow(env, T("2026-11-08T00:59:59Z")).phase).toBe("before");
    expect(giftEventWindow(env, T("2026-11-08T01:00:00Z")).phase).toBe("during");
    expect(giftEventWindow(env, T("2026-11-09T15:00:00Z")).phase).toBe("after");
    expect(giftEventWindow({ ...ON, GIFT_EVENT_START: "2026-11-10", GIFT_EVENT_END: "2026-11-09" }).phase).toBe("off");
  });
  it("공개 정보에는 보상 이야기가 없다", () => {
    const v = giftEventPublicView(ON, T("2026-11-10T00:00:00+09:00"));
    expect(Object.keys(v).sort()).toEqual(["endsAt", "maxPerAccount", "phase", "serverNow", "startsAt", "validDays"]);
    expect(JSON.stringify(v)).not.toMatch(/comp|보상/);
  });
});

describe("팝업 고르기", () => {
  const event = (phase: "off" | "before" | "during" | "after") => ({ phase, serverNow: "2026-11-10T00:00:00.000Z", startsAt: "2026-11-06T15:00:00.000Z", endsAt: "2026-11-16T15:00:00.000Z", maxPerAccount: 2, validDays: 30 });
  const comp = (tier: "A" | "B", unused = tier === "A" ? 2 : 1, expiresAt = "2026-12-06T03:00:00.000Z") => ({ tier, quantity: unused, unused, expiresAt });
  const now = T("2026-11-10T00:00:00Z");
  const pick = (s: PopupState, path = "/") => selectPopup(s, path, now);
  it("로그인 안 함·신규 가입 → ①(기간에만)", () => {
    expect(pick({ member: false, comp: null, event: event("during") })).toBe("event-1plus1");
    expect(pick({ member: true, comp: null, event: event("during") })).toBe("event-1plus1");
    for (const p of ["off", "before", "after"] as const) expect(pick({ member: false, comp: null, event: event(p) })).toBeNull();
  });
  it("안 쓴 보상 이용권: B → ②, A → ③ (이벤트와 무관)", () => {
    expect(pick({ member: true, comp: comp("B"), event: event("during") })).toBe("comp-b");
    expect(pick({ member: true, comp: comp("B"), event: event("after") })).toBe("comp-b");
    expect(pick({ member: true, comp: comp("A"), event: event("off") })).toBe("comp-a");
  });
  it("다 쓰거나 만료되면 ②·③ 없음(기간이면 ①로)", () => {
    expect(pick({ member: true, comp: comp("A", 0), event: event("during") })).toBe("event-1plus1");
    expect(pick({ member: true, comp: comp("B", 1, "2026-11-09T00:00:00Z"), event: event("after") })).toBeNull();
    expect(pick({ member: false, comp: comp("A"), event: event("off") })).toBeNull(); // 회원이 아니면 보상 정보가 와도 쓰지 않는다
  });
  it("메인·상품 화면만, 읽는 화면·그 밖에는 없음", () => {
    for (const p of ["/", "/products", "/report/new", "/report/new/"]) expect(popupAllowedPath(p)).toBe(true);
    for (const p of ["/reports/report_abc", "/r/token", "/account", "/gift/x", "/payments/toss/success", "/example", "/terms"]) {
      expect(popupAllowedPath(p)).toBe(false);
      expect(pick({ member: true, comp: comp("A"), event: event("during") }, p)).toBeNull();
    }
  });
  it("오늘 하루 보지 않기는 팝업 id마다, KST 날짜 기준 · 닫기는 이 탭에서만", () => {
    const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; };
    const local = mem(), session = mem(), at = T("2026-11-10T14:59:00Z"); // KST 23:59
    rememberPopup("comp-b", "today", at, local, session);
    expect(popupHidden("comp-b", at, local, session)).toBe(true);
    expect(popupHidden("event-1plus1", at, local, session)).toBe(false);
    expect(popupHidden("comp-b", T("2026-11-10T15:00:00Z"), local, mem())).toBe(false); // 다음 날(KST 0시)
    const s2 = mem(); rememberPopup("event-1plus1", "close", at, local, s2);
    expect(popupHidden("event-1plus1", at, local, s2)).toBe(true);
    expect(popupHidden("event-1plus1", at, local, mem())).toBe(false);
    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    expect(() => rememberPopup("comp-a", "today", at, broken, broken)).not.toThrow();
    expect(popupHidden("comp-a", at, broken, broken)).toBe(false);
    expect(kstDay(at)).toBe("2026-11-10");
  });
  it("표시 문구", () => {
    expect(eventRangeLabel(event("during"))).toBe("11월 7일 – 11월 16일");
    expect(eventStartLabel("2026-11-06T15:00:00.000Z")).toBe("11월 7일 00시 시작");
    expect(expiryLabel("2026-12-06T03:00:00.000Z")).toBe("12월 6일");
    expect(remainingLabel(6 * 86400_000 + 3 * 3600_000 + 4 * 60_000 + 5_000)).toBe("6일 03:04:05");
    expect(timesLabel(2)).toBe("두 번");
  });
});
