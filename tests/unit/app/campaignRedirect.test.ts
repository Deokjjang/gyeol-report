// 운영 Q 10부: 끝난 오픈 이벤트 주소(/campaign/gyeol-opening-2026)는 메인(/)으로 보낸다 — 라우트 안에서 redirect(307).
// next.config.ts는 v4 검증 기록이 바이트를 고정해 손대지 않는다. 옛 「오픈 이벤트 이용권」 문구가 보이는 화면이 남지 않았는지도 함께 본다.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import CampaignPage from "../../../src/app/campaign/[slug]/page";
import { isLaunchEventView, LAUNCH_END, LAUNCH_START } from "../../../src/lib/growth/launchEvent";

const files = (dir: string): string[] => readdirSync(dir).flatMap(name => { const p = join(dir, name); return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(name) ? [p] : []; });
const SRC = files("src");
const importers = (module: RegExp) => SRC.filter(f => module.test(readFileSync(f, "utf8"))).sort();
const visit = async (slug: string, query: Record<string, string | string[] | undefined> = {}) => {
  try { await CampaignPage({ params: Promise.resolve({ slug }), searchParams: Promise.resolve(query) }); } catch (error) { return error as { digest?: string }; }
  throw new Error("redirect expected");
};

describe("옛 오픈 이벤트 주소 → 메인", () => {
  it("공식 주소와 다른 slug 모두 메인으로 307(임시) — 이벤트 화면을 그리지 않는다", async () => {
    for (const slug of ["gyeol-opening-2026", "other-slug"]) expect((await visit(slug)).digest).toBe("NEXT_REDIRECT;replace;/;307;");
  });
  it("허용된 utm_* 값만 넘기고, 그 밖의 값(이메일·fbclid·생일 같은 숫자)은 버린다", async () => {
    const { digest } = await visit("gyeol-opening-2026", { utm_source: "instagram", utm_campaign: "book-launch", fbclid: "secret", email: "a@b.c", utm_term: "19901118", utm_medium: ["a", "b"] });
    expect(digest).toBe("NEXT_REDIRECT;replace;/?utm_source=instagram&utm_campaign=book-launch;307;");
  });
  it("상태 JSON(/campaign/[slug]/state)·이벤트 API는 그대로 남고, next.config.ts는 바뀌지 않았다(검증 기록 바이트 고정)", () => {
    expect(SRC).toContain(join("src", "app", "campaign", "[slug]", "state", "route.ts"));
    expect(SRC).toContain(join("src", "app", "api", "launch-event", "route.ts"));
    const frozen = JSON.parse(readFileSync("docs/validation/v4-knowledge-source-verification-01/original-file-hashes.json", "utf8").replace(/^﻿/, "")) as Record<string, string>;
    expect(createHash("sha256").update(readFileSync("next.config.ts")).digest("hex")).toBe(frozen["next.config.ts"]);
  });
});

describe("옛 「오픈 이벤트」 문구가 보이는 화면 없음", () => {
  it("이벤트 페이지(CampaignLanding)는 개발 화면(/dev/campaign)에서만 쓴다", () => {
    expect(importers(/from "[^"]*growth\/CampaignLanding"|import\("[^"]*growth\/CampaignLanding"\)/)).toEqual([join("src", "app", "dev", "campaign", "[slug]", "page.tsx")]);
  });
  it("오픈 이벤트 카운트다운 블록(<LaunchCountdown>)은 어디에도 그려지지 않는다(남은 건 책 공유의 useLaunchEvent 훅뿐)", () => {
    expect(SRC.filter(f => readFileSync(f, "utf8").includes("<LaunchCountdown"))).toEqual([]);
  });
  it("보상 안내 문구(compMessages: 「오픈 이벤트에 함께해 주신 분께」)는 화면 코드에서 불러오지 않는다", () => {
    expect(importers(/ops\/compMessages"/)).toEqual([]);
  });
  it("끝난 뒤 서버가 ACTIVE라고 보내도 화면은 이벤트 정보로 받지 않는다(책 공유 이벤트 문단·LAUNCH_NOTICE 숨김)", () => {
    const view = { state: "ACTIVE", serverNow: "2026-11-07T00:00:00Z", startsAt: LAUNCH_START, endsAt: LAUNCH_END, campaignAvailable: true, referralAvailable: true, inviterAvailable: true, budgetApproved: true, campaignSlug: "gyeol-opening-2026" };
    expect(isLaunchEventView(view)).toBe(false);
    expect(isLaunchEventView({ ...view, state: "ENDED", campaignAvailable: false, referralAvailable: false, inviterAvailable: false })).toBe(true);
  });
});
