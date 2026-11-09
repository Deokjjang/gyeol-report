import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MetaSettingsLink from "../../../src/components/analytics/MetaSettingsLink";
import { META_CARD_SEEN_KEY, META_NOTICE_VERSION } from "../../../src/lib/analytics/metaConsent";

const read = (path: string) => readFileSync(path, "utf8");

describe("Meta consent card (mobile visible, once, footer settings)", () => {
  it("is visible on small screens and sits in the page flow, never over a button, field or page navigation", () => {
    const css = read("src/components/analytics/metaConsent.module.css");
    expect(css).not.toMatch(/max-width:\s*768px/);
    expect(css).not.toContain("display: none");
    expect(css).toMatch(/\.root \{[^}]*order: -1/);
    expect(css).not.toMatch(/\.root \{[^}]*position: fixed/);
    // Fixed-height Book screens subtract the card so the page navigation stays inside the viewport.
    expect(read("src/app/dev/book-preview/book.module.css")).toContain("var(--meta-card-h, 0px)");
  });

  it("결정 A: 첫 방문 안내 카드는 안내 판마다 한 번 — 거부·자세히·확인, 확인(닫기)은 거부가 아니다", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    // 판이 바뀌어 예전 「동의 요청」 카드를 본 사람도 새 안내(기본 허용·거부 방법)를 한 번 본다.
    expect(META_CARD_SEEN_KEY).toBe(`gyeol-meta-card-seen:${META_NOTICE_VERSION}`);
    expect(source).toContain("${SEEN_COOKIE}=${META_NOTICE_VERSION}");
    expect(source).toContain("result.choice === null && result.ready === true && !cardSeen()");
    expect(source).toContain("if (firstVisit || result.choice !== null) markCardSeen();");
    expect(source).toContain("const dismiss = () => { markCardSeen(); setCard(false); setOpen(false); };");
    expect(source).not.toContain("choose(false); };");
    expect(source).toContain("onClick={dismiss}>확인</button>");
    expect(source).toContain("onClick={() => void choose(false)}>거부</button>");
    expect(source).toContain("이름·이메일·전화번호는 보내지 않습니다. 원하지 않으면 거부를 누르세요.");
    expect(source).toContain("SEEN_MAX_AGE = 60 * 60 * 24 * 365");
    expect(source).not.toContain("styles.settings");
  });

  it("결정 A: 픽셀은 서버 답을 받은 뒤 거부하지 않은 브라우저에만(기본 허용·선택 동의), 서버 사실 주기 확인은 선택 동의만", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    expect(source).toContain("const allowed = choice !== undefined && choice !== false;");
    expect(source).toContain("useState<boolean | null | undefined>(undefined)");
    expect(source).toContain('{!bundleCallback && allowed && ready && <iframe ref={frame} src="/api/analytics/meta/pixel"');
    expect(source.match(/\/api\/analytics\/meta\/pixel/g)).toHaveLength(1);
    expect(source).toContain("setMetaChoice(result.ready === true ? known : false)");
    expect(source).toContain("const timer = explicit ? setInterval(");
    // 선택 동의 버튼은 세 칸 모두 체크해야 눌린다(개인 식별 정보).
    expect(source).toContain("disabled={busy || !Object.values(consents).every(Boolean)} onClick={() => void choose(true)}>선택 동의");
  });

  it("offers a footer '광고 설정' link in both footers, rendered only where the panel can open", () => {
    expect(renderToStaticMarkup(<MetaSettingsLink />)).toBe("");
    expect(read("src/components/analytics/MetaSettingsLink.tsx")).toContain(">광고 설정</button>");
    expect(read("src/components/legal/BusinessFooter.tsx")).toContain("<MetaSettingsLink />");
    expect(read("src/app/dev/book-preview/BookPages.tsx")).toContain("<MetaSettingsLink /></nav>");
  });
});
