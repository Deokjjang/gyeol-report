import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { ITEM_MAX } from "@/lib/compat/score";
import { assembleV5Book, createV5Snapshot, type V5BookDraft, type V5Evidence } from "@/lib/writer/book";
import { buildWriterPrompt, renderWriterBrief } from "@/lib/writer/prompt";
import { applySafetyNet } from "@/lib/writer/safety";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { storedBook } from "@/lib/book/storedReport";
import { readerBook } from "@/app/dev/book-preview/readerLayout";
import { BookReader } from "@/app/dev/book-preview/BookReader";
import type { BookData, BookPage } from "@/app/dev/book-preview/bookTypes";
import { PEOPLE } from "../../../tools/p35/people";

// P6c: 궁합 점수 v2 점수 쪽·브리프 표시, 표지 핵심 이미지, v5 부록, 대운·세운 표 범례. 만세력 보정 문구는 saju/legacyBookProtection.
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const BASE = "2026-11-03";
type Product = "major_fortune" | "saju_mbti_full" | "saju_mbti_compatibility";
const v4 = (name: string) => JSON.parse(gunzipSync(readFileSync(`tests/fixtures/production-version-combos/${name}.json.gz`)).toString("utf8"));
const PEOPLE_TABLES = { single: () => storedBook(v4("saju_mbti_full-v4"))!.data.people, pair: () => storedBook(v4("saju_mbti_compatibility-v4"))!.data.people };
function built(product: Product) {
  const pair = product === "saju_mbti_compatibility";
  const brief = buildBrief({ product, baseDate: BASE, person: PEOPLE.c1, ...(pair ? { partner: PEOPLE.c2, relationshipType: "love" as const } : {}) }, k);
  const plan = buildWriterPrompt(brief).chapters;
  const { chapters, report } = applySafetyNet(brief, plan, new Map());
  const payload = (pair ? { productKey: product, personA: PEOPLE.c1, personB: PEOPLE.c2 } : { productKey: product, person: PEOPLE.c1 }) as never;
  const b = assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: `${BASE}T03:00:00.000Z`, people: PEOPLE_TABLES[pair ? "pair" : "single"](), writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 0, briefHash: "", knowledgeVersion: "", promptVersion: "", recovered: false });
  return { brief, ...b };
}
const snap = (product: Product, edit: (d: V5BookDraft, e: V5Evidence) => [V5BookDraft, V5Evidence] = (d, e) => [d, e]) => {
  const b = built(product), [draft, evidence] = edit(b.draft, b.evidence);
  return createV5Snapshot({ reportId: `report_p6c${product.replace(/_/g, "")}`.slice(0, 40), createdAtIso: `${BASE}T03:00:00.000Z`, draft, evidence });
};
const read = (s: ReturnType<typeof snap>) => readerBook(storedBook(s, null, BASE)!.data);
const html = (data: BookData, page: BookPage) => renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
const pageOf = <K extends BookPage["kind"]>(data: BookData, kind: K) => data.pages.find((p): p is Extract<BookPage, { kind: K }> => p.kind === kind)!;
const pagesOf = <K extends BookPage["kind"]>(data: BookData, kind: K) => data.pages.filter((p): p is Extract<BookPage, { kind: K }> => p.kind === kind);

describe("궁합 점수 v2.2 점수 쪽", () => {
  const data = read(snap("saju_mbti_compatibility"));
  it("총점 = 기본점 40 + 항목 점수 합(최종판3 7: 기본점 줄로 줄 합 = 총점), 항목 막대는 점수/만점(연애 배점), 이유는 2~3문장, 버전 v2.2", () => {
    const score = pageOf(data, "score"), out = html(data, score);
    expect(score.scoreVersion).toBe("v2.2");
    expect(score.total).toBe(54); // 하람×서윤 연애(P4 49 → v2 62 → v2.1 54)
    expect(score.band).toBe("노력이 필요한 사이");
    expect(out).toContain('data-score-version="v2"'); // v2·v2.1·v2.2는 같은 화면(이유 keep-all)
    // v2.2: MBTI 이유 첫 문장에 세 부분 점수(5점씩), 합 = MBTI 막대 점수.
    const mbti = score.scores.find(s => s.label === "MBTI")!, parts = [...mbti.reason!.matchAll(/(대화의 결|마음의 기능|에너지·생활 리듬) (\d+)\/5/g)];
    expect(parts.map(p => p[1])).toEqual(["대화의 결", "마음의 기능", "에너지·생활 리듬"]);
    expect(parts.reduce((n, p) => n + Number(p[2]), 0)).toBe(mbti.value);
    expect(score.scores[0]).toMatchObject({ label: "기본점", value: 40, max: 40 });
    expect(score.total).toBe(score.scores.reduce((n, s) => n + s.value, 0));
    expect(score.scores.map(s => s.max)).toEqual([40, ...Object.values(ITEM_MAX.love)]);
    expect(score.scores[0].reason).toBe(`기본점은 두 사람 누구에게나 똑같이 주는 40점이에요. 여기에 아래 일곱 항목의 점수 ${score.total - 40}점(60점 만점)을 더해 총점 ${score.total}점이 돼요.`);
    for (const s of score.scores) { expect(out).toContain(`${s.value} / ${s.max}`); const n = splitSentences(s.reason!).length; expect(n).toBeGreaterThanOrEqual(2); expect(n).toBeLessThanOrEqual(3); }
    expect(out).toContain("기본 40점에 일곱 항목");
    expect(out).not.toContain("3칸");
  });
  it("저장된 v2.1 Book은 저장된 점수·이유 그대로(다시 계산하지 않음), 같은 v2 화면", () => {
    const stored = { total: 54, version: "v2.1" as const, band: "노력이 필요한 사이", verdict: "예전 판정", notice: "예전 안내", components: [{ name: "MBTI", points: 0, max: 15, reason: "예전 MBTI 이유. 두 사람 이야기." }] };
    const old = read(snap("saju_mbti_compatibility", (d, e) => [d, { ...e, pair: { ...e.pair!, score: stored } }]));
    const score = pageOf(old, "score"), out = html(old, score);
    expect(score.scoreVersion).toBe("v2.1");
    expect(score.total).toBe(54);
    expect(score.scores).toEqual([{ label: "MBTI", value: 0, max: 15, reason: "예전 MBTI 이유. 두 사람 이야기." }]);
    expect(out).toContain('data-score-version="v2"'); expect(out).toContain("0 / 15"); expect(out).toContain("예전 안내");
  });
  it("최종판3 7: 기본점 줄이 없는 저장 v2.x Book은 합이 맞을 때만 화면에서 기본점 줄을 붙인다(저장본 그대로)", () => {
    const stored = { total: 79, version: "v2.2" as const, band: "끌림과 보완이 있는 사이", verdict: "판정", notice: "안내",
      components: [{ name: "오행 보완", points: 12, max: 12, reason: "가. 나." }, { name: "타고난 중심 관계", points: 10, max: 10, reason: "가. 나." }, { name: "생활 자리", points: 7, max: 10, reason: "가. 나." }, { name: "자란 환경·사회 자리", points: 3, max: 6, reason: "가. 나." },
        { name: "서로에게 주는 역할", points: 2, max: 4, reason: "가. 나." }, { name: "음양 균형", points: 1, max: 3, reason: "가. 나." }, { name: "MBTI", points: 4, max: 15, reason: "가. 나." }] };
    const old = read(snap("saju_mbti_compatibility", (d, e) => [d, { ...e, pair: { ...e.pair!, score: stored } }]));
    const score = pageOf(old, "score"), out = html(old, score);
    expect(score.scores.map(s => `${s.label} ${s.value}/${s.max}`)).toEqual(["기본점 40/40", "오행 보완 12/12", "타고난 중심 관계 10/10", "생활 자리 7/10", "자란 환경·사회 자리 3/6", "서로에게 주는 역할 2/4", "음양 균형 1/3", "MBTI 4/15"]);
    expect(score.scores.reduce((n, s) => n + s.value, 0)).toBe(79);
    expect(out).toContain("40 / 40"); expect(out).toContain("일곱 항목의 점수 39점(60점 만점)을 더해 총점 79점");
  });
  it("저장된 v5-1 Book(P4)은 예전 3칸 표시 그대로", () => {
    const old = read(snap("saju_mbti_compatibility", (d, e) => [d, { ...e, pair: { ...e.pair!, score: { total: 49, version: "compat-score-v5-1", band: "노력이 필요한", verdict: "예전 판정", components: [{ name: "오행 보완", level: "좋음", line: "예전 이유" }, { name: "MBTI", level: "조율", line: "예전 MBTI 이유" }] } } }]));
    const score = pageOf(old, "score"), out = html(old, score);
    expect(score.scoreVersion).toBe("compat-score-v5-1");
    expect(score.scores).toEqual([{ label: "오행 보완", value: 3, max: 3, reason: "예전 이유" }, { label: "MBTI", value: 1, max: 3, reason: "예전 MBTI 이유" }]);
    expect(out).toContain("3칸 중 몇 칸");
  });
  it("브리프: 항목 점수와 이유를 넘기고, 점수 쪽에 이미 쓴 문장(onScorePage)이라고 표시한다", () => {
    const { brief, evidence } = built("saju_mbti_compatibility");
    const s = brief.compatibility!.score;
    expect(s.components.map(c => c.onScorePage)).toEqual(("notice" in evidence.pair!.score! ? evidence.pair!.score!.components : []).map(c => c.reason));
    expect(s.components.every(c => c.points <= c.max)).toBe(true);
    // 최종판3 7: 작가에게 가는 요약도 줄 합 = 총점(맨 앞 기본점 40/40, level "기본").
    expect(s.components[0]).toMatchObject({ name: "기본점", points: 40, max: 40, level: "기본" });
    expect(s.components.reduce((n, c) => n + c.points, 0)).toBe(s.value);
    expect(s.rules.join(" ")).toContain("onScorePage는 점수 쪽에 이미 실린 문장");
    const w = JSON.stringify(renderWriterBrief(brief));
    expect(w).toContain("onScorePage"); expect(w).not.toContain("\"appendix\"");
  });
});

describe("표지 아래 한 줄", () => {
  it("핵심 이미지 한 줄을 쓰고, 핵심 이미지가 없는 Book은 예전 첫 문장", () => {
    const b = built("saju_mbti_full");
    expect(pageOf(read(snap("saju_mbti_full")), "cover").headline).toBe(b.draft.coreImage!.line);
    expect(pageOf(read(snap("saju_mbti_full", (d, e) => [{ ...d, coreImage: undefined }, e])), "cover").headline).toBe(b.draft.headline);
    const pair = built("saju_mbti_compatibility");
    expect(pageOf(read(snap("saju_mbti_compatibility")), "cover").headline).toBe(pair.draft.headline);
  });
  it("한국어 단어가 중간에서 끊기지 않게 keep-all", () => {
    expect(readFileSync("src/app/dev/book-preview/book.module.css", "utf8")).toMatch(/\.readerCover h1 \{[^}]*word-break: keep-all/);
  });
});

describe("부록 내 모든 기운(v5)", () => {
  it("내 사주 기운마다 지식 DB 뜻 한 줄, 머리말은 '내 사주에 있는 기운과 그 뜻'", () => {
    const data = read(snap("saju_mbti_full")), page = pageOf(data, "appendix"), out = html(data, page);
    expect(page.title).toBe("내 모든 기운");
    expect(out).toContain("내 사주에 있는 기운과 그 뜻이에요.");
    expect(out).not.toContain("지장간은 지지 안에 담긴 천간입니다");
    expect(page.items.length).toBeGreaterThan(5);
    const meanings = new Set([...k.features.values()].flatMap(f => splitSentences(f.meaning)));
    for (const item of page.items) { expect(meanings.has(item.meaning), item.name).toBe(true); expect(out).toContain(item.name); }
    expect(page.items.some(i => i.core)).toBe(true);
    expect(data.pages.at(-2)!.kind).toBe("appendix");
  });
  it("궁합은 사람마다 한 쪽, 번호는 이어진다", () => {
    const pages = pagesOf(read(snap("saju_mbti_compatibility")), "appendix");
    // 최종판3 7: 사람마다 한 쪽 뒤에 두 사람 사이 관계 전체 쪽.
    expect(pages.map(p => p.title)).toEqual(["하람의 모든 기운", "서윤의 모든 기운", "두 사람 사이의 모든 기운"]);
    expect(pages[1].from).toBe(pages[0].from + pages[0].items.length);
    expect(pages[0].lead).toBe("하람님 사주에 있는 기운과 그 뜻이에요.");
  });
  it("부록 필드가 없는 v5 Book과 과거 V4 Book은 그대로", () => {
    expect(pagesOf(read(snap("saju_mbti_full", (d, e) => [{ ...d, appendix: undefined }, e])), "appendix")).toEqual([]);
    const old = readerBook(storedBook(v4("saju_mbti_full-v4"))!.data), page = pageOf(old, "appendix");
    expect(page.lead).toBeUndefined();
    expect(html(old, page)).not.toContain("내 사주에 있는 기운과 그 뜻");
  });
});

describe("대운·세운 표 왼쪽 굵은 줄 범례", () => {
  it("v5 표에 굵은 줄(흐름 세기 4칸 이상)이 있으면 표 위에 한 줄 범례", () => {
    const data = read(snap("major_fortune")), tl = pageOf(data, "timeline"), out = html(data, tl);
    expect(tl.years.filter(y => y.importance === "HIGH").every(y => (y.flow ?? 0) >= 4)).toBe(true);
    expect(tl.years.some(y => y.importance === "HIGH")).toBe(true);
    expect(out).toContain("왼쪽 굵은 줄은 흐름 세기가 4칸 이상인 해예요.");
    expect(out.indexOf("왼쪽 굵은 줄")).toBeLessThan(out.indexOf("data-impact"));
  });
  it("과거 V4 표에는 범례를 두지 않는다", () => {
    for (const name of ["major_fortune-v4", "annual_fortune-v4"]) {
      const old = readerBook(storedBook(v4(name))!.data), page = old.pages.find(p => p.kind === "timeline" || p.kind === "months")!;
      expect(html(old, page)).not.toContain("왼쪽 굵은 줄");
    }
  });
});
