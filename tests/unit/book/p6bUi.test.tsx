import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { assembleV5Book, createV5Snapshot, projectV5Book, seasonMonths, seasonTime } from "@/lib/writer/book";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { applySafetyNet } from "@/lib/writer/safety";
import { storedBook } from "@/lib/book/storedReport";
import { readerBook } from "@/app/dev/book-preview/readerLayout";
import { BookReader } from "@/app/dev/book-preview/BookReader";
import type { BookData, BookPage } from "@/app/dev/book-preview/bookTypes";
import { PEOPLE } from "../../../tools/p35/people";

// P6b-ui: 책 화면 지적 항목(앞부분·궁합 첫 화면·점수 쪽·대운/세운 표·카드 라벨·판 표기). 본문 불변은 bookBodySameness.
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const BASE = "2026-11-03";
type Product = "major_fortune" | "annual_fortune" | "saju_mbti_full" | "saju_mbti_compatibility";
const v4 = (name: string) => JSON.parse(gunzipSync(readFileSync(`tests/fixtures/production-version-combos/${name}.json.gz`)).toString("utf8"));
// 실제 발행은 v4 계산으로 만든 사람 표를 people에 고정한다 → 시험에서는 저장된 v4 Book의 사람 표를 빌린다.
const PEOPLE_TABLES = { single: () => storedBook(v4("saju_mbti_full-v4"))!.data.people, pair: () => storedBook(v4("saju_mbti_compatibility-v4"))!.data.people };
function snapshot(product: Product) {
  const pair = product === "saju_mbti_compatibility";
  const brief = buildBrief({ product, baseDate: BASE, person: PEOPLE.c1, ...(pair ? { partner: PEOPLE.c2, relationshipType: "love" as const } : {}), ...(product === "annual_fortune" ? { selectedYear: 2026 } : {}) }, k);
  const plan = buildWriterPrompt(brief).chapters;
  const { chapters, report } = applySafetyNet(brief, plan, new Map());
  const payload = (pair ? { productKey: product, personA: PEOPLE.c1, personB: PEOPLE.c2 } : { productKey: product, person: PEOPLE.c1 }) as never;
  const b = assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: `${BASE}T03:00:00.000Z`, people: PEOPLE_TABLES[pair ? "pair" : "single"](), writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 0, briefHash: "", knowledgeVersion: "", promptVersion: "", recovered: false });
  return createV5Snapshot({ reportId: `report_p6bui${product.replace(/_/g, "")}`.slice(0, 40), createdAtIso: `${BASE}T03:00:00.000Z`, draft: b.draft, evidence: b.evidence });
}
const html = (data: BookData, page: BookPage) => renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
const pageOf = <K extends BookPage["kind"]>(data: BookData, kind: K) => data.pages.find((p): p is Extract<BookPage, { kind: K }> => p.kind === kind)!;

describe("세운 절기월 표기와 지금 달", () => {
  const annual = snapshot("annual_fortune");
  it("절기월 순번·날짜 구간으로 쓰고 달력 달 이름은 쓰지 않는다", () => {
    const months = pageOf(projectV5Book(annual, BASE)!, "months").months;
    expect(months.map(m => m.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(months[0].range).toBe("2/4~3/5"); // 끝 = 다음 절입일(P6c-ui2 결정)
    const out = html(projectV5Book(annual, BASE)!, pageOf(projectV5Book(annual, BASE)!, "months"));
    expect(out).toContain("1번째 달"); expect(out).toContain("2/4~3/5");
    expect(out).not.toMatch(/<b>\d+월<\/b>/);
  });
  it("2026-11-03이면 9번째 달 무술월이 지금", () => {
    const months = pageOf(projectV5Book(annual, BASE)!, "months").months;
    expect(months.filter(m => m.time === "지금").map(m => [m.order, m.ganji, m.range])).toEqual([[9, "戊戌", "10/8~11/7"]]);
    expect(months.slice(0, 8).every(m => m.time === "돌아보기") && months.slice(9).every(m => m.time === "앞으로")).toBe(true);
  });
  it("읽는 날이 바뀌면 지금 달도 따라간다(경계 하루 포함)", () => {
    const now = (day: string) => pageOf(projectV5Book(annual, day)!, "months").months.find(m => m.time === "지금")?.order;
    expect([now("2026-11-06"), now("2026-11-07"), now("2026-12-10"), now("2027-01-05"), now("2027-02-04")]).toEqual([9, 10, 11, 12, undefined]);
    const season = seasonMonths(annual.draft ? (annual.draft as never as { timeline: { cards: { key: string; label: string; kind: string }[] } }).timeline.cards.filter(c => c.kind === "month") : []);
    expect(seasonTime(season[8], "2026-10-08")).toBe("지금");
  });
});

describe("앞부분: 목차 쪽 없음, 주인공·MBTI·만세력 한 쪽", () => {
  it("종합 본문은 3쪽부터, 목차는 버튼 목록으로", () => {
    const data = readerBook(storedBook(snapshot("saju_mbti_full"), null, BASE)!.data);
    expect(data.pages.slice(0, 3).map(p => p.kind)).toEqual(["cover", "input", "narrative"]);
    expect(data.pages.some(p => p.kind === "contents" || p.kind === "manse" || p.kind === "mbti")).toBe(false);
    expect(data.contents!.length).toBeGreaterThan(5);
    expect(data.contents!.every(e => data.pages[e.page] && [data.pages[e.page].id, ...(data.pages[e.page].anchors ?? [])].includes(e.targetId))).toBe(true);
    const front = html(data, data.pages[1]);
    expect(front).toContain("의 만세력"); expect(front).toContain("오행의 구성");
    expect(front).toMatch(/<details class="[^"]*fold[^"]*"><summary>MBTI ENTJ/);
  });
  it("궁합 본문은 점수 해설 포함 4쪽부터(v5·v4)", () => {
    for (const data of [readerBook(storedBook(snapshot("saju_mbti_compatibility"), null, BASE)!.data), readerBook(storedBook(v4("saju_mbti_compatibility-v4"))!.data)])
      expect(data.pages.slice(0, 4).map(p => p.kind)).toEqual(["cover", "pair", "score", "narrative"]);
  });
  it("과거 V4 Book도 같은 앞부분, 표의 쪽 참조는 같은 쪽을 가리킨다", () => {
    const stored = storedBook(v4("major_fortune-v4"))!.data, data = readerBook(stored);
    expect(data.pages.slice(0, 3).map(p => p.kind)).toEqual(["cover", "input", "narrative"]);
    const before = pageOf(stored, "timeline").years.map(y => stored.pages[y.page].id), after = pageOf(data, "timeline").years.map(y => data.pages[y.page].id);
    expect(after).toEqual(before);
  });
});

describe("궁합 첫 화면과 점수 쪽", () => {
  const data = readerBook(storedBook(snapshot("saju_mbti_compatibility"), null, BASE)!.data);
  it("관계 이미지 한 줄이 맨 위, 각자 이미지는 아래 작게, 관계 기운은 쉬운 문장, 바로가기 없음", () => {
    const pair = pageOf(data, "pair"), out = html(data, pair);
    expect(out).toContain(`<h1>${pair.image}</h1>`);
    expect(out.indexOf(pair.image!)).toBeLessThan(out.indexOf(pair.characters[0].core));
    expect(pair.relationsPlain!.length).toBeGreaterThan(0);
    for (const line of pair.relationsPlain!) expect(out).toContain(line.replace(/'/g, "&#x27;"));
    // 방향 바로가기는 없다. P6e 11: 사람마다 있던 부록 바로가기도 뺐다.
    expect(out.match(/↗/g)).toBeNull(); expect(out).not.toContain("다른 기운들 보기"); expect(out).not.toContain("보는");
  });
  it("과거 V4 관계 쪽은 원자료 줄·바로가기 없이 예전 소개를 유지", () => {
    const old = readerBook(storedBook(v4("saju_mbti_compatibility-v4"))!.data), out = html(old, pageOf(old, "pair"));
    // 방향 바로가기는 없다. P6e 11: 사람마다 있던 부록 바로가기도 뺐다.
    expect(out).not.toContain("두 사람 사이의 기운"); expect(out.match(/↗/g)).toBeNull(); expect(out).not.toContain("다른 기운들 보기");
    expect(out).toContain("말하기 전에 이유를 끝까지 알아보는 사람");
  });
  it("점수 쪽: 총점·구간 이름·항목 막대(점수/만점)·항목 이유", () => {
    const score = pageOf(data, "score"), out = html(data, score);
    expect(out).toContain(`${score.band} 구간`);
    expect(score.scores.every(s => s.reason && out.includes(`${s.value} / ${s.max}`))).toBe(true);
    expect((out.match(/scoreMeter/g) ?? []).length).toBe(score.scores.length);
  });
  it("V4 점수 쪽은 설명 줄에서 항목 이유를 찾는다", () => {
    const old = readerBook(storedBook(v4("saju_mbti_compatibility-v4"))!.data), out = html(old, pageOf(old, "score"));
    expect(out).toContain("22 / 30"); expect(out).toContain("함께 살필 좋은 조건은 부족한 오행을 서로 보탬");
  });
});

describe("대운 표와 카드 라벨", () => {
  const data = readerBook(storedBook(snapshot("major_fortune"), null, BASE)!.data);
  it("한 줄에 연도·만 나이·간지·십성·흐름 세기·핵심어·기간 배지, 누르면 해 볼 것/돌아보기·살필 점", () => {
    const tl = pageOf(data, "timeline"), out = html(data, tl);
    const now = tl.years.find(y => y.time === "지금")!;
    expect(now.year).toBe(2026); expect(now.ageLabel).toBe(`만 ${2026 - 1996}세`);
    expect(tl.years.every(y => y.tenGod && y.flow && y.keywords?.length)).toBe(true);
    expect(out).toContain("흐름 세기"); expect(out).not.toContain("좋은 힘");
    expect(tl.years.filter(y => y.time === "돌아보기").every(y => y.goodLabel === "돌아보기")).toBe(true);
    expect(tl.years.filter(y => y.time !== "돌아보기").every(y => y.goodLabel === "해 볼 것")).toBe(true);
  });
  it("과거 V4 대운 표는 좋은 힘 라벨을 유지한다", () => {
    const old = readerBook(storedBook(v4("major_fortune-v4"))!.data);
    expect(html(old, pageOf(old, "timeline"))).toContain("좋은 힘");
  });
});

describe("개정본 표기", () => {
  it("v5는 제6판 기준일(P6e 12: 기준일은 판 표기에만), 과거 V4는 제4판 발행일", () => {
    expect(storedBook(snapshot("saju_mbti_full"), null, BASE)!.edition).toBe(`제6판 · ${Number(BASE.slice(0, 4))}년 ${Number(BASE.slice(5, 7))}월 ${Number(BASE.slice(8, 10))}일 기준`);
    expect(storedBook(v4("saju_mbti_full-v4"))!.edition).toMatch(/^제4판 · \d{4}년 \d{1,2}월 \d{1,2}일 발행$/);
  });
  it("표지 아래와 마지막 쪽에 보인다", () => {
    const stored = storedBook(snapshot("saju_mbti_full"), null, BASE)!, data = readerBook({ ...stored.data, edition: stored.edition });
    expect(html(data, data.pages[0])).toContain(stored.edition!);
    expect(html(data, data.pages.at(-1)!)).toContain(stored.edition!);
    expect(stored.edition).toMatch(/^제6판 · \d{4}년 \d{1,2}월 \d{1,2}일 기준$/);
  });
});

describe("입력 화면", () => {
  it("관심 분야 체크박스가 없다", () => {
    expect(readFileSync("src/components/book/BookInput.tsx", "utf8")).not.toContain("관심 분야");
  });
});
