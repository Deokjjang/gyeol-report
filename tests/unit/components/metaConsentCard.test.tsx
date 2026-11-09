import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MetaSettingsLink from "../../../src/components/analytics/MetaSettingsLink";
import { META_CARD_SEEN_KEY, META_NOTICE_VERSION, metaChangeCardNotice, metaOptInMeasurementLabel } from "../../../src/lib/analytics/metaConsent";

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

  it("시행일 전 카드(공지 기간): 동의·거부·자세히 — 닫기(×)는 결정 보류(거부로 저장 안 함, 이 방문 동안만 숨기고 다음 방문에 다시)", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    expect(source).toContain("setCard(known === null && result.ready === true && !cardLater());");
    expect(source).toContain('sessionStorage.setItem(META_CARD_LATER_KEY, "1")');
    expect(source).toContain("const dismiss = () => { if (optout) markCardSeen(); else markCardLater(); setCard(false); setOpen(false); };");
    const card = source.slice(source.indexOf('data-meta-card="change"'), source.indexOf('data-meta-card="notice"'));
    expect(card).toContain("<p>{metaChangeCardNotice}</p>");
    expect(card.match(/<button[^>]*>[^<]+<\/button>/g)!.map(b => b.replace(/^.*>([^<]+)<\/button>$/, "$1"))).toEqual(["동의", "거부", "자세히", "×"]);
    expect(card).toContain('onClick={() => openPanel(true)}>동의</button>'); // 동의는 상세 고지·따로 동의 세 칸 창으로(바로 저장 안 함)
    expect(card).toContain('onClick={() => void choose(false)}>거부</button>');
    expect(card).toContain('aria-label="닫기(나중에 정하기)" onClick={dismiss}>×</button>');
    expect(card).not.toContain("choose(true)");
    expect(metaChangeCardNotice).toBe("광고 성과 측정 방식이 12월 10일(목)부터 바뀝니다. 지금은 동의한 경우에만 방문·상품 조회·결제 여부 같은 행동 정보를 Meta에 보내지만, 그날부터는 거부하지 않으면 기본으로 보냅니다. 이름·이메일·전화번호는 보내지 않습니다. 원하지 않으면 거부를 누르세요. 거부해도 이용에 영향이 없습니다.");
    // 시행일 전 광고 설정 창: 변경 안내 표 + 지금 문구 + 세 칸(첫 칸은 시행일부터 해시값까지 알림) → 「동의하고 허용」. 닫기도 보류.
    const panel = source.slice(source.indexOf("{open && !optout ?"), source.indexOf(": open ?"));
    expect(panel).toContain("metaChangeRows.map"); expect(panel).toContain("<p>{metaOptInNotice}</p>"); expect(panel).toContain("{metaOptInTransferNotice}");
    expect(panel).toContain("{metaOptInMeasurementLabel}"); expect(panel).toContain(">동의하고 허용</button>"); expect(panel).toContain("onClick={dismiss}>닫기</button>");
    expect(metaOptInMeasurementLabel).toContain("12월 10일(목)부터는 로그인한 채 동의한 회원의 이메일·휴대폰 번호 해시값도 함께");
  });

  it("시행일 뒤 카드(결정 A): 안내 판마다 한 번 — 거부·자세히·확인, 확인(닫기)은 거부가 아니다", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    // 판이 바뀌어 예전 「동의 요청」 카드를 본 사람도 새 안내(기본 허용·거부 방법)를 한 번 본다.
    expect(META_CARD_SEEN_KEY).toBe(`gyeol-meta-card-seen:${META_NOTICE_VERSION}`);
    expect(source).toContain("${SEEN_COOKIE}=${META_NOTICE_VERSION}");
    expect(source).toContain("const firstVisit = known === null && result.ready === true && !cardSeen();");
    expect(source).toContain("if (firstVisit || known !== null) markCardSeen();");
    const card = source.slice(source.indexOf('data-meta-card="notice"'));
    expect(card).toContain("onClick={dismiss}>확인</button>");
    expect(card).toContain("onClick={() => void choose(false)}>거부</button>");
    expect(card).toContain("이름·이메일·전화번호는 보내지 않습니다. 원하지 않으면 거부를 누르세요.");
    expect(source).not.toContain("choose(false); };");
    expect(source).toContain("SEEN_MAX_AGE = 60 * 60 * 24 * 365");
    expect(source).not.toContain("styles.settings");
  });

  it("픽셀은 서버 답(choice·optout) 뒤 보낼 수 있는 브라우저에만 — 시행일 전 동의만, 뒤 거부 안 함. 서버 사실 주기 확인은 동의한 브라우저만", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    expect(source).toContain("const allowed = metaMaySend(choice, optout);");
    expect(source).toContain("useState<boolean | null | undefined>(undefined)");
    expect(source).toContain('{!bundleCallback && allowed && ready && <iframe ref={frame} src="/api/analytics/meta/pixel"');
    expect(source.match(/\/api\/analytics\/meta\/pixel/g)).toHaveLength(1);
    expect(source).toContain("setMetaChoice(result.ready === true ? known : false, effective)");
    expect(source).toContain("effective = result.optout === true");
    expect(source).toContain("const timer = explicit ? setInterval(");
    // 선택 동의 버튼은 세 칸 모두 체크해야 눌린다(개인 식별 정보).
    expect(source).toContain("disabled={busy || !Object.values(consents).every(Boolean)} onClick={() => void choose(true)}>선택 동의");
    expect(source).toContain("disabled={busy || !Object.values(consents).every(Boolean)} onClick={() => void choose(true)}>동의하고 허용");
  });

  it("offers a footer '광고 설정' link in both footers, rendered only where the panel can open", () => {
    expect(renderToStaticMarkup(<MetaSettingsLink />)).toBe("");
    expect(read("src/components/analytics/MetaSettingsLink.tsx")).toContain(">광고 설정</button>");
    expect(read("src/components/legal/BusinessFooter.tsx")).toContain("<MetaSettingsLink />");
    expect(read("src/app/dev/book-preview/BookPages.tsx")).toContain("<MetaSettingsLink /></nav>");
  });
});
