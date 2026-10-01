import { readFileSync, readdirSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); } }));
import Page, { metadata } from "../../../../src/app/dev/book-preview/page";
import Preview from "../../../../src/app/dev/book-preview/BookPreview";
import { Cover, PersonFields, Receipt, Publishing, ReaderContent, PreviewFooter } from "../../../../src/app/dev/book-preview/BookPages";
import { BOOKS, CONSENTS, INITIAL_PERSON, NOTES, PUBLISHING_STATES, coverOffset, wrapBook, inputPageCount, readerPages, requiredConsents, roleNames, toggleAll } from "../../../../src/app/dev/book-preview/model";
import fixture from "../../../../src/app/dev/book-preview/fixture.json";
const base = "src/app/dev/book-preview/";
const source = (name: string) => readFileSync(base + name, "utf8");
const noop = () => {};
afterEach(() => vi.unstubAllEnvs());

describe("book preview: development-only presentation", () => {
  it.each(["production", "test", ""])("fails closed outside development: %s", async env => {
    vi.stubEnv("NODE_ENV", env);
    await expect(Page()).rejects.toThrow("404");
  });
  it("development entry renders the prototype, with noindex/nofollow", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const result = await Page();
    expect(result.type).toBe(Preview);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(source("page.tsx").indexOf("notFound();")).toBeLessThan(source("page.tsx").indexOf('await import("./BookPreview")'));
  });
  it("has no runtime, auth, payment, persistence, sharing or tracking integration", () => {
    for (const file of readdirSync(base).filter(n => /\.(tsx?|css)$/.test(n))) {
      expect(source(file), file).not.toMatch(/fetch\(|localStorage|sessionStorage|navigator\.(?:share|clipboard)|\/api\/|runtimeShadow|runtimeProjection|generateProductReport|supabase|TossPayments|Kakao\.Share|fbq\(/);
    }
    expect(readFileSync("src/app/page.tsx", "utf8")).not.toContain("book-preview");
    expect(readFileSync("src/app/layout.tsx", "utf8")).not.toContain("book-preview");
  });
  it("home first surface only has wordmark, login and covers/rotation controls", () => {
    const html = renderToStaticMarkup(<Preview />).split("<footer")[0];
    expect(html).toContain("여섯 권의 책 고르기");
    expect(html).not.toMatch(/1,290|사주 ×|종합 리포트|리뷰|누적|통계/);
  });
  it("six covers have unique agreed titles and solid WCAG AA colors", () => {
    expect(BOOKS.map(b => b.title.replace("\n", " "))).toEqual(["나라는 사람", "내가 잘되는 방식", "내 사랑 이야기", "우리라는 사이", "앞으로의 나", "나의 2026"]);
    const luminance = (hex: string) => {
      const rgb = hex.slice(1).match(/../g)!.map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    for (const b of BOOKS) {
      const values = [luminance(b.color), luminance(b.ink)].sort((a, b) => b - a);
      expect((values[0] + .05) / (values[1] + .05), b.id).toBeGreaterThanOrEqual(4.5);
      expect(renderToStaticMarkup(<Cover book={b} />)).toContain(b.issue);
    }
  });
  it("cover selection/arrow wrapping and perspective ordering are deterministic", () => {
    expect(wrapBook(-1)).toBe(5); expect(wrapBook(6)).toBe(0);
    for (let c = 0; c < 6; c++) {
      expect(coverOffset(c, c)).toBe(0);
      expect(coverOffset(wrapBook(c + 1), c)).toBe(1);
      expect(coverOffset(wrapBook(c - 1), c)).toBe(-1);
    }
    expect(source("BookPreview.tsx")).toContain('event.key === "ArrowRight"');
    expect(source("BookPreview.tsx")).toContain('event.key === "ArrowLeft"');
  });
  it("only relevant products have a third input page; fixed roles preserved", () => {
    expect(BOOKS.map(b => inputPageCount(b.id))).toEqual([2, 2, 3, 3, 2, 3]);
    expect(roleNames("parentChild")).toEqual(["부모", "자녀"]);
    expect(roleNames("managerReport")).toEqual(["상사", "부하·팀원"]);
  });
  it.each(["exact", "approximate", "unknown"])("precision %s changes the local form only", precision => {
    const html = renderToStaticMarkup(<PersonFields person={{ ...INITIAL_PERSON, precision }} onChange={noop} prefix="person" label="부모" />);
    expect(html).toContain("부모 이름");
    expect(html.includes('type="time"')).toBe(precision !== "unknown");
  });
  it("guest/member receipt retains purchase disclosures and does not invent optional consent", () => {
    for (const member of [false, true]) {
      const html = renderToStaticMarkup(<Receipt book={BOOKS[0]} person={INITIAL_PERSON} member={member} setMember={noop} consents={{}} setConsents={noop} />);
      expect(html).toContain("₩1,290"); expect(html).toContain("환불이 제한될 수");
      expect(html.includes(CONSENTS[3].label)).toBe(!member);
      expect(html).toContain("결제·저장되지 않습니다");
    }
    const production = readFileSync("src/components/payment/DevTossCheckoutLauncher.tsx", "utf8");
    CONSENTS.forEach(c => expect(production).toContain(c.label));
  });
  it("all-consent and individual deselection sync; under14/minor handling remains explicit", () => {
    const { items } = requiredConsents(false, INITIAL_PERSON.birth);
    const checked = toggleAll(items.map(c => c.id), true, {});
    expect(items.every(c => checked[c.id])).toBe(true);
    checked.inputAccuracy = false;
    expect(items.every(c => checked[c.id])).toBe(false);
    expect(Object.values(toggleAll(items.map(c => c.id), false, checked)).some(Boolean)).toBe(false);
    expect(requiredConsents(false, "2020-01-01").allowed).toBe(false);
    expect(requiredConsents(true, "2010-01-01").items.at(-1)?.id).toBe("minorLegalRepresentative");
  });
  it("publishing is a five-state decorative sequence without fake progress", () => {
    expect(PUBLISHING_STATES).toEqual(["preparing", "composing", "binding", "covering", "complete"]);
    for (const state of PUBLISHING_STATES) {
      const html = renderToStaticMarkup(<Publishing book={BOOKS[0]} name="서진" state={state} />);
      expect(html).toContain(`data-publishing="${state}"`);
      expect(html).not.toMatch(/progressbar|\d+%|리포트 생성 중/);
    }
  });
  it("reader contains all frozen chapters in order and final back cover", () => {
    const pages = readerPages(fixture.chapters.length);
    expect(pages.slice(0, 3)).toEqual(["opening", "manse", "mbti"]);
    expect(pages.slice(-2)).toEqual(["glossary", "back"]);
    pages.forEach(page => {
      const html = renderToStaticMarkup(<ReaderContent page={page} onNote={noop} onShare={noop} />);
      expect(html).not.toMatch(/<details|<footer|sourceRefs|confidence|seedIds|natalEvidence|fusionIds/);
      if (page.startsWith("chapter-")) {
        const c = fixture.chapters[Number(page.split("-")[1])];
        c.paragraphs.forEach(p => expect(html).toContain(renderToStaticMarkup(<span>{p}</span>).slice(6, -7)));
      }
    });
  });
  it("sample notes use existing material and actual fixture markers", () => {
    const material = readFileSync("src/lib/interpretation-v4/markerMaterials.ts", "utf8");
    const markers = JSON.stringify(fixture.tables.manse.detailRows);
    NOTES.forEach(n => { expect(material).toContain(n.text); expect(material).toContain(n.image); expect(markers).toContain(n.name); });
  });
  it("complete MBTI keywords/function stack and natal detail rows remain available", () => {
    const html = renderToStaticMarkup(<ReaderContent page="mbti" onNote={noop} onShare={noop} />);
    fixture.tables.mbti.closeKeywords.concat(fixture.tables.mbti.farKeywords).forEach(k => expect(html).toContain(k));
    fixture.tables.mbti.functionRows.forEach(r => expect(html).toContain(r.description));
    expect(html).not.toContain("리포트 활용");
    const natal = renderToStaticMarkup(<ReaderContent page="manse" onNote={noop} onShare={noop} />);
    fixture.tables.manse.detailRows.forEach(r => expect(natal).toContain(r.label));
  });
  it("footer reuses legal values and chat URL; existing paid route rule untouched", () => {
    const html = renderToStaticMarkup(<PreviewFooter />);
    expect(html).toContain("고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.");
    expect(html).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
    expect(html).toContain("support@gyeolreport.com"); expect(html).toContain("050-6664-8562");
    expect(html).toContain("사업자 정보 보기"); expect(html).not.toContain("채팅하기");
    expect(readFileSync("src/components/legal/BusinessFooter.tsx", "utf8")).toContain("(?:reports|r)");
  });
  it("reduced motion removes auto/3D; keyboard and explicit controls supplement gestures", () => {
    expect(source("BookPreview.tsx")).toContain("paused || hovered || focused || reduced");
    expect(source("book.module.css")).toContain("@media (prefers-reduced-motion: reduce)");
    expect(source("book.module.css")).toContain("animation: none !important; transition: none !important;");
    expect(source("BookPreview.tsx")).toContain('aria-label="다음 페이지"');
    expect(source("BookPreview.tsx")).toContain('aria-label="각주 닫기"');
    expect(source("book.module.css")).not.toContain("gradient");
  });
});
