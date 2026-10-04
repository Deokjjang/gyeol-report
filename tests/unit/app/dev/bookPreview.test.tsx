import { readFileSync, readdirSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); } }));
import Page, { metadata } from "../../../../src/app/dev/book-preview/page";
import Preview from "../../../../src/app/dev/book-preview/BookPreview";
import { Cover, PersonFields, Receipt, Publishing, PreviewFooter, ELEMENT_LABELS } from "../../../../src/app/dev/book-preview/BookPages";
import { BookReader } from "../../../../src/app/dev/book-preview/BookReader";
import { loadBookLibrary } from "../../../../src/app/dev/book-preview/runtimeBooks";
import type { BookLibrary, BookPage } from "../../../../src/app/dev/book-preview/bookTypes";
import { BOOKS, CONSENTS, CONSENT_SHORT_LABELS, INITIAL_PERSON, PUBLISHING_STATES, coverOffset, wrapBook, inputPageCount, readerTitle, requiredConsents, roleNames, toggleAll } from "../../../../src/app/dev/book-preview/model";
import { LegalAccordion, LegalDocument, BUSINESS_ROWS } from "../../../../src/app/dev/book-preview/BookLegal";
import Terms from "../../../../src/app/terms/page";
import Privacy from "../../../../src/app/privacy/page";
import Refund from "../../../../src/app/refund/page";
import Business from "../../../../src/app/business/page";
const base = "src/app/dev/book-preview/";
const source = (name: string) => readFileSync(base + name, "utf8");
const noop = () => {};
let library: BookLibrary;
beforeAll(async () => { library = (await loadBookLibrary())!; expect(library).not.toBeNull(); }, 60000);
const reader = (kind: BookPage["kind"]) => renderToStaticMarkup(<BookReader data={library.books[0]} page={library.books[0].pages.find(p => p.kind === kind)!} onNote={noop} onShare={noop} onPage={noop} />);
afterEach(() => vi.unstubAllEnvs());

describe("book preview: development-only presentation", () => {
  it.each(["production", "test", ""])("fails closed outside development: %s", async env => {
    vi.stubEnv("NODE_ENV", env);
    await expect(Page({})).rejects.toThrow("404");
  });
  it("development entry renders the prototype, with noindex/nofollow", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const result = await Page({});
    expect(result.type).toBe(Preview);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(source("page.tsx").indexOf("notFound();")).toBeLessThan(source("page.tsx").indexOf('await import("./BookPreview")'));
  });
  it("runtime is server-only; no public auth/payment/persistence/share activation", () => {
    for (const file of readdirSync(base).filter(n => /\.(tsx?|css)$/.test(n))) {
      expect(source(file), file).not.toMatch(/fetch\(|localStorage|sessionStorage|navigator\.(?:share|clipboard)|\/api\/|generateProductReport|supabase|TossPayments|Kakao\.Share|fbq\(/);
      if (["runtimeBooks.ts", "bookProjection.ts"].includes(file)) expect(source(file)).toContain('import "server-only"');
      else expect(source(file)).not.toMatch(/runtimeShadow|runtimeProjection/);
    }
    expect(readFileSync("src/app/page.tsx", "utf8")).not.toContain("book-preview");
    expect(readFileSync("src/app/layout.tsx", "utf8")).not.toContain("book-preview");
  });
  it("home first surface only has wordmark, login and covers/rotation controls", () => {
    const html = renderToStaticMarkup(<Preview library={library} />).split("<footer")[0];
    expect(html).toContain("여섯 권의 책 고르기");
    expect(html).not.toMatch(/1,290|사주 ×|종합 리포트|리뷰|누적|통계/);
  });
  it("six covers have unique agreed titles and solid WCAG AA colors", () => {
    expect(BOOKS.map(b => b.title.replace("\n", " "))).toEqual(["나라는 사람", "내가 잘되는 방식", "내 사랑 이야기", "우리라는 사이", "앞으로의 나", "나의 한 해"]);
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
      expect(html).toContain("₩1,290"); expect(html).toContain("환불·청약철회 제한 확인");
      expect(html.includes(CONSENT_SHORT_LABELS.policyAgreement)).toBe(!member);
      expect(html).not.toMatch(/<dialog|<details|마케팅/);
      expect(html).not.toContain(CONSENTS[0].label);
      expect(html).toContain("구매 전 안내 보기");
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
  it("reader contains actual pages in order and final back cover", () => {
    const data = library.books[0], pages = data.pages;
    expect(pages.slice(0, 4).map(p => p.kind)).toEqual(["cover", "input", "manse", "mbti"]);
    expect(pages.slice(-2).map(p => p.kind)).toEqual(["appendix", "back"]);
    pages.forEach(page => {
      const html = renderToStaticMarkup(<BookReader data={data} page={page} onNote={noop} onShare={noop} onPage={noop} />);
      expect(html).not.toMatch(/<details|<footer|sourceRefs|confidence|seedIds|natalEvidence|fusionIds/);
      if (page.kind === "narrative") page.paragraphs.forEach(p => expect(html).toContain(renderToStaticMarkup(<span>{p.text}</span>).slice(6, -7)));
    });
  });
  it("chapter notes exist at the bottom, not only in a dialog", () => {
    const data = library.books[0];
    const page = data.pages.find(p => p.kind === "narrative" && p.notes.length > 0);
    expect(page).toBeDefined();
    const html = renderToStaticMarkup(<BookReader data={data} page={page!} onNote={noop} onShare={noop} onPage={noop} />);
    expect(html).toContain('aria-label="이 장의 각주"');
    expect(html.indexOf('aria-label="이 장의 각주"')).toBeGreaterThan(html.indexOf("data-narrative-paragraph"));
    const withoutNotes = data.pages.find(p => p.kind === "narrative" && p.notes.length === 0);
    expect(withoutNotes).toBeDefined();
    expect(renderToStaticMarkup(<BookReader data={data} page={withoutNotes!} onNote={noop} onShare={noop} onPage={noop} />)).not.toContain('aria-label="이 장의 각주"');
  });
  it("complete MBTI keywords/function stack and natal detail rows remain available", () => {
    const html = reader("mbti"), tables = library.books[0].people[0].table;
    tables.mbti!.closeKeywords.concat(tables.mbti!.farKeywords).forEach(k => expect(html).toContain(k));
    tables.mbti!.functionRows.forEach(r => expect(html).toContain(r.description));
    expect(html).not.toContain("리포트 활용");
    const natal = reader("manse");
    tables.manse.detailRows.forEach(r => expect(natal).toContain(r.label));
  });
  it("footer reuses legal values and chat URL; existing paid route rule untouched", () => {
    const html = renderToStaticMarkup(<PreviewFooter />);
    expect(html).toContain("고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.");
    expect(html).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
    expect(html).toContain("support@gyeolreport.com"); expect(html).toContain("050-6664-8562");
    expect(html).toContain("사업자 정보"); expect(html).not.toContain("채팅하기");
    expect(html).not.toMatch(/<details[^>]*open|href="(?:tel:|mailto:)/);
    BUSINESS_ROWS.forEach(([, value]) => expect(html).toContain(value));
    expect(readFileSync("src/components/legal/BusinessFooter.tsx", "utf8")).toContain("(?:reports|r)");
  });
  it("natal cells preserve every detail, yin/yang and semantic color independently from cover", () => {
    const html = reader("manse"), tables = library.books[0].people[0].table;
    for (const row of [tables.manse.stemRow, tables.manse.branchRow]) {
      for (const cell of Object.values(row)) {
        if (!cell) continue;
        expect(html).toContain(`data-element="${cell.colorToken}">${cell.hanja}`);
        expect(html).toContain(cell.tenGod);
      }
    }
    tables.manse.detailRows.forEach(row => Object.values(row.cells).flat().forEach(value => expect(html).toContain(value)));
    Object.keys(ELEMENT_LABELS).forEach(token => expect(source("book.module.css")).toContain(`[data-element="${token}"]`));
    expect(html).toContain("지장간 포함 가중"); expect(html).not.toContain("2.9000000000000004");
  });
  it("all MBTI axes, alternatives, summaries and function metadata are retained", () => {
    const html = reader("mbti");
    const m = library.books[0].people[0].table.mbti!;
    expect(html).toContain(m.archetype); expect(html).toContain(m.oneLine);
    expect(html.match(/data-selected="true"/g)).toHaveLength(4);
    expect(html.match(/data-selected="false"/g)).toHaveLength(4);
    m.preferenceRows.forEach(r => [r.left, r.right].forEach(v => { expect(html).toContain(v.nameEn); expect(html).toContain(v.description); }));
    m.functionRows.forEach(r => { expect(html).toContain(r.attitude + " · " + r.domain); expect(html).toContain(r.nameKo); });
    m.coreSummary.forEach(r => expect(html).toContain(r.text));
  });
  it("back cover has exactly three icon actions, without SDK/runtime or second CTA", () => {
    const html = reader("back");
    expect(html.match(/<button\b/g)).toHaveLength(3);
    expect(html.match(/<svg\b/g)).toHaveLength(3);
    for (const label of ["카카오톡", "공유", "링크 복사"]) expect(html).toContain(label);
    expect(html).not.toMatch(/SHARE YOUR|DISCOVER|내 리포트/);
  });
  it("navigation names the current book, including selected Annual year with safe fallback", () => {
    BOOKS.forEach(b => expect(readerTitle(b, "2027")).toBe(b.id === "annual" ? "나의 2027" : b.title.replace("\n", " ")));
    expect(readerTitle(BOOKS[5], "<script>")).toBe("나의 한 해");
    const nav = source("BookPreview.tsx").split('aria-label="책 읽기 위치"')[1].split("{turn ?")[0];
    expect(nav).not.toContain("GYEOL REPORT"); expect(nav).toContain("data.title");
  });
  it("legal accordion defaults closed and contains all four documents", () => {
    const html = renderToStaticMarkup(<LegalAccordion />);
    expect(html.match(/<details\b/g)).toHaveLength(4);
    expect(html).not.toMatch(/<details[^>]*open/);
    expect(html).toContain('target="_blank" rel="noopener noreferrer"');
  });
  it.each([[0, Terms], [1, Privacy], [2, Refund], [3, Business]] as const)("document %s preserves all existing policy paragraphs/table values", (index, PublicPage) => {
    const normalize = (html: string) => html.replace(/<[^>]*>/g, "").replace(/\s+/g, "");
    const old = renderToStaticMarkup(<PublicPage />).split('<nav')[0];
    const content = normalize(renderToStaticMarkup(<LegalDocument index={index} />));
    for (const match of old.matchAll(/<(?:p|li|td|th|dt|dd|h2|caption)\b[^>]*>([\s\S]*?)<\/(?:p|li|td|th|dt|dd|h2|caption)>/g)) {
      // Only the service-brand header precedes the actual document.
      const value = normalize(match[1]);
      if (["결리포트", "GyeolReport", "결리포트정책"].includes(value)) continue;
      expect(content, value).toContain(value);
    }
  });
  it("reduced motion removes auto/3D; keyboard and explicit controls supplement gestures", () => {
    expect(source("BookPreview.tsx")).toContain('stage === "home" && !hovered && !reduced && visible');
    expect(renderToStaticMarkup(<Preview library={library} />)).not.toMatch(/자동 회전|재생|일시정지/);
    expect(source("book.module.css")).toContain("@media (prefers-reduced-motion: reduce)");
    expect(source("book.module.css")).toContain("animation: none !important; transition: none !important;");
    expect(source("book.module.css")).toContain(".coverflow { pointer-events: none; }");
    expect(source("book.module.css")).toContain(".bookSlot { pointer-events: auto; }");
    expect(source("book.module.css")).toContain(".bookShell { overflow: clip; }");
    expect(source("BookPreview.tsx")).toContain('aria-label="다음 페이지"');
    expect(source("BookPreview.tsx")).toContain('closeLabel="각주 닫기"');
    expect(source("book.module.css")).not.toContain("gradient");
  });
});
