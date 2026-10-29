import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LAUNCH_START, LAUNCH_END, launchRemaining, type LaunchEventView } from "../../../src/lib/growth/launchEvent";
import type { CampaignView } from "../../../src/lib/growth/model";

// Fixed KST times around the end. Server payloads follow launch_event_state / campaign_presentation_v2 at that moment.
const LAST_SECOND = "2026-10-31T14:59:59Z", END_AT = "2026-10-31T15:00:00Z", NEXT_DAY = "2026-11-01T15:00:00Z";
const event = vi.hoisted(() => ({ view: null as LaunchEventView | null, elapsed: 0 }));
vi.mock("../../../src/components/growth/LaunchCountdown", () => ({ useLaunchEvent: () => ({ view: event.view, remaining: event.view ? launchRemaining(event.view, event.elapsed) : null }) }));
import { BookShareActions } from "../../../src/components/book/BookShareActions";
import { ReferralBookCta } from "../../../src/components/book/ReferralBookCta";
import { CampaignLanding } from "../../../src/components/growth/CampaignLanding";
import { projectBookShare } from "../../../src/lib/book/shareModel";

const launch = (serverNow: string): LaunchEventView => {
  const on = serverNow < END_AT;
  return { state: on ? "ACTIVE" : "ENDED", serverNow, startsAt: LAUNCH_START, endsAt: LAUNCH_END, campaignAvailable: on, referralAvailable: on, inviterAvailable: on, budgetApproved: true, campaignSlug: "gyeol-opening-2026" };
};
const campaign = (serverNow: string, granted = false): CampaignView => {
  const on = serverNow < END_AT;
  return { slug: "gyeol-opening-2026", message: "오픈 이벤트", headline: "오픈 이벤트", description: "나만의 책을 만나보세요.", eligibility: "가입 자격을 확인합니다.", state: granted ? "BENEFIT_ALREADY_GRANTED" : on ? "ACTIVE_ELIGIBLE" : "ENDED", cta: on && !granted ? "capture" : "product", serverNow, active: on, status: on ? "ACTIVE" : "ENDED", offer: "REPORT_TICKET", quantity: 1, startsAt: LAUNCH_START, endsAt: LAUNCH_END, coupon: null, launchEvent: true };
};
const share = projectBookShare({ productType: "annual_fortune", selectedYear: "2027", names: "김하늘", shareUrl: `https://gyeolreport.com/r/gr_${"a".repeat(32)}`, publishedAt: "2026-10-12T00:00:00Z", expiresAt: "2027-01-10T00:00:00Z" })!;
const lastPage = () => renderToStaticMarkup(<BookShareActions owner={{ reportId: "r1" }} local />);

describe("event end at fixed times", () => {
  it("10/31 23:59:59 KST: last page keeps the event paragraph and share buttons; event page counts down", () => {
    event.view = launch(LAST_SECOND); event.elapsed = 0;
    const html = lastPage();
    expect(html).toContain("카카오톡으로 책 공유"); expect(html).toContain("무료 이용권 참여 조건 보기");
    const page = renderToStaticMarkup(<CampaignLanding campaign={campaign(LAST_SECOND)} utm={{}} />);
    expect(page).toContain("이벤트 참여하고 가입하기"); expect(page).toContain("00:00:01"); expect(page).not.toContain("이벤트가 종료되었습니다");
  });
  it.each([["11/1 00:00:00 KST", END_AT], ["11/2", NEXT_DAY]])("%s: last page shows only sharing; event page shows one line and a home link", (_, at) => {
    event.view = launch(at); event.elapsed = 0;
    const html = lastPage();
    expect(html).toContain("카카오톡으로 책 공유"); expect(html).toContain("공유 링크 복사");
    expect(html).not.toMatch(/이용권|이벤트|초대/);
    for (const granted of [false, true]) {
      const page = renderToStaticMarkup(<CampaignLanding campaign={campaign(at, granted)} utm={{}} />);
      expect(page).toContain("이벤트가 종료되었습니다"); expect(page).toContain('href="/"');
      expect(page).not.toMatch(/이용권|가입하기|내 책 고르기|<details|ISSUE|<time/);
    }
    const recipient = renderToStaticMarkup(<ReferralBookCta share={{ ...share, referral: { token: "rf_x", url: "x", mayJoin: true, launchEvent: true } }} local={false} home="/" />);
    expect(recipient).toContain("나도 내 책 만들기"); expect(recipient).not.toMatch(/이용권|이벤트/);
  });
  it("a page left open across midnight: the local countdown reaching 0 removes event copy without a new request", () => {
    event.view = launch(LAST_SECOND); event.elapsed = 1000;
    expect(lastPage()).not.toMatch(/이용권|이벤트/);
  });
});
