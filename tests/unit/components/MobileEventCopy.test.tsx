import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CampaignLanding } from "../../../src/components/growth/CampaignLanding";
import { BookEventNotice } from "../../../src/components/book/BookEventNotice";
import { LAUNCH_START, LAUNCH_END, LAUNCH_NOTICE, type LaunchEventView } from "../../../src/lib/growth/launchEvent";
import type { CampaignView, CampaignState } from "../../../src/lib/growth/model";
const campaign: CampaignView = { slug: "gyeol-opening-2026", message: "오픈 이벤트", headline: "오픈 이벤트", description: "나만의 책을 만나보세요.", eligibility: "가입 자격을 확인합니다.", state: "ACTIVE_ELIGIBLE", cta: "capture", serverNow: "2026-10-20T00:00:00Z", active: true, status: "ACTIVE", offer: "REPORT_TICKET", quantity: 1, startsAt: LAUNCH_START, endsAt: LAUNCH_END, coupon: null, launchEvent: true };
const launch: LaunchEventView = { state: "ACTIVE", serverNow: campaign.serverNow, startsAt: LAUNCH_START, endsAt: LAUNCH_END, campaignAvailable: true, referralAvailable: true, inviterAvailable: true, budgetApproved: true, campaignSlug: campaign.slug };
describe("mobile event explanation follows server presentation", () => {
  it("short headline, eligible participation, six books and closed complete conditions", () => {
    const html = renderToStaticMarkup(<CampaignLanding campaign={campaign} utm={{}} />), main = html.split("<details")[0];
    expect(html).toContain("<h1>오픈 이벤트</h1>"); expect(main).toContain("이벤트 참여하고 가입하기"); expect(main).toContain("필수 동의");
    expect(html.match(/ISSUE /g)).toHaveLength(6); expect(html).not.toMatch(/<details[^>]*open|KST|\+09:00/);
    for (const text of ["유입 기록 없이", "전체 최대 2장", "광고·친구 초대 중복 불가", "첫 리포트를 정상 발행 완료", "11월 1일 0시", "처리 지연", "유료 이용권"]) expect(LAUNCH_NOTICE).toContain(text);
  });
  it.each(["SCHEDULED", "PAUSED", "ENDED", "ACTIVE_INELIGIBLE", "BENEFIT_ALREADY_GRANTED"] as CampaignState[])("%s offers only the possible action", state => {
    const html = renderToStaticMarkup(<CampaignLanding campaign={{ ...campaign, state, active: !["PAUSED", "ENDED", "SCHEDULED"].includes(state) }} utm={{}} />), main = html.split("<details")[0];
    expect(main).not.toContain("이벤트 참여하고 가입하기"); expect(main).not.toContain("리포트 1권 무료"); expect(main).toContain("내 책 고르기");
    if (["PAUSED", "ENDED", "SCHEDULED"].includes(state)) expect(main).not.toContain("나에게도 이용권 1장이 추가돼요");
  });
  it("generic sharing is distinct from an invitation, and recipients never see inviter copy", () => {
    expect(renderToStaticMarkup(<BookEventNotice view={launch} remaining={1000} invitation={false} />).split("<details")[0]).toContain("일반 책 공유 링크입니다");
    const recipient = renderToStaticMarkup(<BookEventNotice view={launch} remaining={1000} recipient />).split("<details")[0];
    expect(recipient).toContain("친구의 초대 링크"); expect(recipient).not.toContain("나에게도");
    for (const state of ["SCHEDULED", "PAUSED", "ENDED"] as const) expect(renderToStaticMarkup(<BookEventNotice view={{ ...launch, state }} remaining={null} />).split("<details")[0]).not.toContain("추가돼요");
  });
});
