import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { renderWriterBrief, buildWriterPrompt } from "@/lib/writer/prompt";
import { assembleV5Book, cardRelationsPlain, createV5Snapshot, projectV5Book, type V5BookDraft } from "@/lib/writer/book";
import { applySafetyNet } from "@/lib/writer/safety";
import { storedBook } from "@/lib/book/storedReport";
import { readableBookText } from "@/lib/book/readerCopy";
import { readerBook } from "@/app/dev/book-preview/readerLayout";
import { BookReader } from "@/app/dev/book-preview/BookReader";
import type { BookData, BookPage } from "@/app/dev/book-preview/bookTypes";
import { PEOPLE } from "../../../tools/p35/people";

// P6c-ui2: 표지 한 줄(c)·부록 바로가기(f)·핵심 구절과 용어(g)·세운 달 이름(h)·카드 관계 쉬운 문장(i)·V4 세운 지금(j). 점수 v2.1은 compat/score·p6cScore.
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const BASE = "2026-11-03";
type Product = "annual_fortune" | "saju_mbti_full" | "saju_mbti_compatibility";
const v4 = (name: string) => JSON.parse(gunzipSync(readFileSync(`tests/fixtures/production-version-combos/${name}.json.gz`)).toString("utf8"));
const PEOPLE_TABLES = { single: () => storedBook(v4("saju_mbti_full-v4"))!.data.people, pair: () => storedBook(v4("saju_mbti_compatibility-v4"))!.data.people };
function built(product: Product) {
  const pair = product === "saju_mbti_compatibility";
  const brief = buildBrief({ product, baseDate: BASE, person: PEOPLE.c1, ...(pair ? { partner: PEOPLE.c2, relationshipType: "love" as const } : {}), ...(product === "annual_fortune" ? { selectedYear: 2026 } : {}) }, k);
  const plan = buildWriterPrompt(brief).chapters;
  const { chapters, report } = applySafetyNet(brief, plan, new Map());
  const payload = (pair ? { productKey: product, personA: PEOPLE.c1, personB: PEOPLE.c2 } : { productKey: product, person: PEOPLE.c1 }) as never;
  return { brief, ...assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: `${BASE}T03:00:00.000Z`, people: PEOPLE_TABLES[pair ? "pair" : "single"](), writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 0, briefHash: "", knowledgeVersion: "", promptVersion: "", recovered: false }) };
}
const snap = (product: Product, edit: (d: V5BookDraft) => V5BookDraft = d => d) => {
  const b = built(product);
  return createV5Snapshot({ reportId: `report_p6cui2${product.replace(/_/g, "")}`.slice(0, 40), createdAtIso: `${BASE}T03:00:00.000Z`, draft: edit(b.draft), evidence: b.evidence });
};
const read = (product: Product, edit?: (d: V5BookDraft) => V5BookDraft) => readerBook(storedBook(snap(product, edit), null, BASE)!.data, BASE);
const html = (data: BookData, page: BookPage) => renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
const pageOf = <K extends BookPage["kind"]>(data: BookData, kind: K) => data.pages.find((p): p is Extract<BookPage, { kind: K }> => p.kind === kind)!;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

describe("c 표지 아래 한 줄", () => {
  it("coverLine → 핵심 이미지 → 예전 첫 문장 순서", () => {
    const b = built("saju_mbti_full");
    expect(pageOf(read("saju_mbti_full", d => ({ ...d, coverLine: "새 표지 한 줄" })), "cover").headline).toBe("새 표지 한 줄");
    expect(pageOf(read("saju_mbti_full", d => ({ ...d, coverLine: "  " })), "cover").headline).toBe(b.draft.coreImage!.line);
    expect(pageOf(read("saju_mbti_full", d => ({ ...d, coreImage: undefined })), "cover").headline).toBe(b.draft.headline);
  });
});

// v5 최종 1-17: 고객 열람 화면(/reports/[id] → BookReading → BookReader)의 첫 쪽에서 "다른 기운들 보기" 바로가기를 뺐다.
// 부록 쪽은 책 끝에 그대로 있다.
describe("f 첫 쪽 부록 바로가기 없음(부록 쪽은 그대로)", () => {
  it("주인공 쪽·궁합 관계 쪽 모두 바로가기 없음, 책 끝의 부록 쪽은 남는다", () => {
    const full = read("saju_mbti_full"), out = html(full, pageOf(full, "input"));
    expect(out).toContain("오행의 구성");
    expect(out).not.toMatch(/다른 기운들? 보기/); expect(out).not.toContain("↗");
    const pair = read("saju_mbti_compatibility"), pairOut = html(pair, pageOf(pair, "pair"));
    expect(pairOut).not.toMatch(/다른 기운들? 보기/);
    for (const book of [full, pair]) {
      const appendix = book.pages.findIndex(p => p.kind === "appendix");
      expect(appendix).toBeGreaterThan(book.pages.findIndex(p => p.kind === "input" || p.kind === "pair"));
      expect(html(book, book.pages[appendix])).toContain("<h1>");
    }
  });
});

describe("g 핵심 구절과 용어", () => {
  const full = read("saju_mbti_full"), page = pageOf(full, "narrative");
  const text = (v: string) => readableBookText(v, full.people.map(p => p.name));
  it("필드가 없으면 문단 글자 그대로(굵게·용어 표시 없음)", () => {
    const plain = { ...full, glossary: undefined }, out = html(plain, page);
    expect(out).not.toMatch(/_keySpan_|_term_/);
    for (const p of page.paragraphs) expect(out).toContain(`<p data-narrative-paragraph="true">${esc(text(p.text))}`);
  });
  it("keySpan [시작, 끝)은 굵게(strong), 범위 밖은 버린다", () => {
    const draft = (d: V5BookDraft) => ({ ...d, chapters: d.chapters.map((c, i) => i ? c : { ...c, sections: c.sections.map((s, j) => j ? s : { ...s, keySpans: [[0, 5], [3, 99_999]] as const }) }) });
    const data = read("saju_mbti_full", draft), p = pageOf(data, "narrative");
    expect(p.paragraphs[0].keySpan).toEqual([0, 5]); expect(p.paragraphs[1].keySpan).toBeUndefined();
    expect(html({ ...data, glossary: undefined }, p)).toMatch(new RegExp(`<p data-narrative-paragraph="true"><strong class="_keySpan_\\w+">${esc(text(p.paragraphs[0].text.slice(0, 5)))}</strong>`));
  });
  it("용어는 장마다 첫 등장만 표시하고 낱말로 나온 곳만(상관없이·장생하는은 아님)", () => {
    const custom: BookPage = { kind: "narrative", title: "시험 장", notes: [], paragraphs: [{ text: "정관이 서면 기준이 생겨요. 정관은 다시 나와도 한 번만.", notes: [] }, { text: "상관없이 장생하는 날도 있어요. 상관은 표현이에요.", notes: [] }] };
    const data = { ...full, glossary: [{ name: "정관", meaning: "기준을 세우는 힘" }, { name: "상관", meaning: "말과 재주" }, { name: "장생", meaning: "새로 자람" }] };
    const out = html(data, custom);
    expect(out.match(/_term_\w+/g)?.length).toBe(2);
    expect(out).toMatch(/>정관<\/button>이 서면/); expect(out).toMatch(/>상관<\/button>은 표현/);
    expect(out).toContain("상관없이 장생하는");
    expect(out).not.toContain("book-term-tip"); // 팝오버는 누를 때만
  });
  it("Book 용어 목록: 지식 DB 십성·신살·귀인·십이운성 중 본문에 나온 것만, 작가 입력에는 없음", () => {
    const b = built("saju_mbti_full"), body = b.draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs)).join("\n");
    expect(b.brief.glossary!.length).toBeGreaterThan(40);
    expect(b.brief.glossary!.some(t => t.name.length < 2)).toBe(false);
    for (const t of b.draft.glossary ?? []) { expect(body).toContain(t.name); expect(t.meaning.length).toBeGreaterThan(5); }
    expect(JSON.stringify(renderWriterBrief(b.brief))).not.toContain("\"glossary\"");
    expect(projectV5Book(snap("saju_mbti_full"), BASE)!.glossary).toEqual(b.draft.glossary?.map(t => ({ name: t.name, meaning: t.meaning })));
  });
});

describe("h 세운 달 이름", () => {
  it("v5: 표와 상세 모두 'N번째 달 · 간지월 · 날짜'", () => {
    const data = read("annual_fortune"), months = pageOf(data, "months");
    const m = months.months[0], detail = data.pages[m.page];
    expect(m.sub).toMatch(/^[가-힣]{2}월 · 2\/4~3\/5$/);
    expect(detail.title).toBe(`1번째 달 · ${m.sub}`);
    expect(html(data, months)).toContain(`<small>${m.sub}</small>`);
    expect(data.pages.filter(p => p.kind === "narrative" && /무렵|절입부터|이번 달/.test(p.title))).toEqual([]);
  });
  it("V4 세운: 달력 달 이름 + 그 달의 절기월·날짜, 옛 머리말 없음, '좋은 힘'은 V4 카드 이름 그대로", () => {
    const data = readerBook(storedBook(v4("annual_fortune-v4"), null, BASE)!.data, BASE), page = pageOf(data, "months"), out = html(data, page);
    expect(page.months[0].sub).toBe("기축월 · 1/5~1/31");
    expect(data.pages[page.months[0].page].title.split("\n")[0]).toBe("1월 · 기축월 · 1/5~1/31"); // 상세 쪽 머리 줄(두 번째 줄은 V4 제목 그대로)
    expect(out).not.toContain("달력월과 절기월은 경계가 달라요"); expect(out).toContain("달력 달마다 그 달의 절기월과 날짜");
    expect(out).toContain("<b>1월</b>"); expect(out).toContain("좋은 힘");
  });
});

describe("i 대운·세운 카드 관계 쉬운 문장", () => {
  it("배지 → 1~2줄(궁합 relationsPlain과 같은 문장 틀), 달 카드는 '해'를 '달'로, 자리 관계가 아닌 배지는 뜻 문장만", () => {
    const badges = [
      { kind: "YUKHAP", label: "인해합", line: "큰 나무와 바닷물이 만나 새 일이 자라는 흐름", tone: "plus", with: "태어난 달" },
      { kind: "SAMHAP", label: "화국(반쯤)", line: "반합(세 글자 중 두 글자만 만남): 세 글자가 한 팀이 되어 한 가지 힘이 크게 뭉치는 해", tone: "plus", with: "태어난 날" },
      { kind: "HYEONG", label: "인사신형", line: "글자끼리 서로를 다듬고 벌주듯 눌러 손봐야 할 일이 드러나는 해", tone: "minus", with: "태어난 해" },
    ] as never;
    expect(cardRelationsPlain({ kind: "month", badges })).toEqual([
      "이 달의 땅 글자와 태어난 달 땅 글자가 육합(땅 글자끼리 맞물림) 관계예요. 큰 나무와 바닷물이 만나 새 일이 자라는 흐름이에요.",
      "이 달의 땅 글자와 태어난 날 땅 글자가 반합(삼합 세 글자 중 두 글자가 만남) 관계예요. 세 글자가 한 팀이 되어 한 가지 힘이 크게 뭉치는 달이에요.",
    ]);
    expect(cardRelationsPlain({ kind: "year", badges: [{ kind: "GONGMANG", label: "공망", line: "공망에 든 해, 힘을 줘도 빠져나가니 기대를 낮추는 흐름", tone: "minus" }] as never })).toEqual(["공망에 든 해, 힘을 줘도 빠져나가니 기대를 낮추는 흐름이에요."]);
  });
  it("상세: 쉬운 문장 아래 원어(배지 이름)는 작은 글씨, 배지 없는 카드는 그대로", () => {
    const data = read("annual_fortune"), page = pageOf(data, "months"), row = page.months.find(m => m.badges?.length)!, out = html(data, page);
    expect(row.relationsPlain!.length).toBeGreaterThanOrEqual(1); expect(row.relationsPlain!.length).toBeLessThanOrEqual(2);
    for (const line of row.relationsPlain!) expect(out).toContain(`관계 · ${esc(readableBookText(line, data.people.map(p => p.name)))}`);
    expect(out).toMatch(new RegExp(`class="_rowTerms_\\w+">${esc(row.badges!.map(b => b.label).join(" · ")).replace(/[()]/g, "\\$&")}<`));
    expect(out).not.toContain("_rowBadges_");
  });
});

describe("j V4 세운 Book의 지금", () => {
  it("저장된 '지금'(만든 날 10월)이 아니라 읽는 날 기준, 읽는 날을 모르면 숨긴다", () => {
    const saved = storedBook(v4("annual_fortune-v4"), null, BASE)!.data;
    expect(pageOf(saved, "months").months.find(m => m.time === "지금")!.month).toBe(10); // 저장값(2026-10-01 생성)
    const now = pageOf(readerBook(saved, BASE), "months").months;
    expect(now.filter(m => m.time === "지금").map(m => m.month)).toEqual([11]);
    expect(now.slice(0, 10).every(m => m.time === "돌아보기") && now[11].time === "앞으로").toBe(true);
    const unknown = readerBook(saved), page = pageOf(unknown, "months");
    expect(page.months.every(m => m.time === "")).toBe(true);
    expect(html(unknown, page)).not.toContain("굵은 선");
    expect(readerBook(saved, BASE).pages.filter(p => p.kind === "narrative" && /^\d+월 · (지금|돌아보기|앞으로)(\n|$)/.test(p.title))).toEqual([]);
  });
});
