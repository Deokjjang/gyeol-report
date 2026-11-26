// OPS-1 2부: 1+1 이벤트 종료(2026-11-30 23:59:59 KST, 경계 = 12-01 00:00 KST = 2026-11-30T15:00:00Z) 뒤 첫 방문 팝업 · 검은 띠 · 이벤트 블록과 카운트다운이 저절로 사라지는지(시간 고정).
import { describe, expect, it } from "vitest";
import { giftEventPublicView, signupPublicView } from "../../../src/lib/ops/config";
import { selectPopup } from "../../../src/lib/ops/comp/popupSelect";
import { giftEventPhaseAt, signupStripVisible } from "../../../src/components/growth/GiftEventCountdown";

const END = Date.parse("2026-11-30T15:00:00Z");
const env = { GIFT_EVENT_ENABLED: "1" } as NodeJS.ProcessEnv; // 운영 공개 API(11-26 확인): startsAt 2026-11-06T00:00Z · endsAt 2026-11-30T15:00Z · signup.endsAt 같음
const at = (ms: number) => ({ ...giftEventPublicView(env, ms), signup: signupPublicView(true, env, ms) });
const guestState = (ms: number) => ({ member: false, comp: null, event: at(ms) }) as never;

describe("이벤트 종료 경계(서버가 주는 값)", () => {
  it("운영과 같은 경계", () => expect([at(END - 1000).endsAt, at(END - 1000).signup.endsAt]).toEqual(["2026-11-30T15:00:00.000Z", "2026-11-30T15:00:00.000Z"]));
  it("23:59:59 KST에는 셋 다 보이고, 00:00 KST부터 셋 다 사라진다", () => {
    const before = END - 1000, after = END;
    expect(selectPopup(guestState(before), "/", before)).toBe("event-1plus1");
    expect(signupStripVisible(at(before) as never, before, true)).toBe(true);
    expect(giftEventPhaseAt(at(before) as never, before)).toBe("during");

    expect(at(after).phase).toBe("after");
    expect(selectPopup(guestState(after), "/", after)).toBeNull();
    expect(signupStripVisible(at(after) as never, after, true)).toBe(false);
    expect(giftEventPhaseAt(at(after) as never, after)).toBeNull();
  });
});

describe("이벤트 중에 연 화면을 경계 너머까지 켜 둔 경우(서버 값은 그대로, 시계만 흐름)", () => {
  it("띠와 블록·카운트다운은 경계에서 사라진다", () => {
    const loaded = at(END - 5000) as never;
    expect(signupStripVisible(loaded, END - 1, true)).toBe(true);
    expect(signupStripVisible(loaded, END, true)).toBe(false);
    expect(giftEventPhaseAt(loaded, END - 1)).toBe("during");
    expect(giftEventPhaseAt(loaded, END)).toBeNull();
  });
});
