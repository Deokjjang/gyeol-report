import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { assembleV5Book, createV5Snapshot, projectV5Book } from "@/lib/writer/book";
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
  // AM 2부(작업 지시 「달 이름은 표와 본문 모두 한 체계(예: 「2월 · 임인월」, 절기 경계 함께 표기)」): 신년판(기본 2027) 1월 다리 + 12 절기월.
  // 예전 P6b·P6c 규칙(「N번째 달」, 달력 달 이름 금지)은 이 신년판에서 바뀌었다. 이전 v5 책(카드에 절기 구간 없음)은 예전 표기 그대로.
  const annual = snapshot("annual_fortune");
  // AM2-3 5부(덕짱님과 정한 시안): AM 신년판 표는 책 앞머리 「2027 한 해 흐름표」(flowTable)가 맡는다 — 같은 이름·절기 구간·지금 달 규칙을 새 표에서 본다.
  it("「2월 · 임인월」 이름 + 절기 구간, 1월 다리 포함 13칸, 「N번째 달」 없음", () => {
    const rows = pageOf(projectV5Book(annual, BASE)!, "flowTable").rows;
    expect(rows).toHaveLength(13);
    expect([rows[0].name, rows[0].sub]).toEqual(["1월 · 신축월", "1/5~2/4"]);
    expect([rows[1].name, rows[1].sub]).toEqual(["2월 · 임인월", "2/4~3/6"]); // 끝 = 다음 절입일(엔진 절입 시각)
    expect(rows[12].name).toBe("2028년 1월 · 계축월");
    const out = html(projectV5Book(annual, BASE)!, pageOf(projectV5Book(annual, BASE)!, "flowTable"));
    expect(out).toContain("2월 · 임인월"); expect(out).toContain("2/4~3/6");
    expect(out).not.toContain("번째 달"); expect(out).not.toContain("<b>0월</b>");
  });
  it("2026-11-03(신년판 전)이면 지금 달 없음, 2027-06-10이면 6월 · 병오월이 지금", () => {
    expect(pageOf(projectV5Book(annual, BASE)!, "flowTable").rows.filter(m => m.now)).toEqual([]);
    const rows = pageOf(projectV5Book(annual, "2027-06-10")!, "flowTable").rows;
    expect(rows.filter(m => m.now).map(m => [m.name, m.ganji, m.sub])).toEqual([["6월 · 병오월", "丙午", "6/6~7/7"]]);
    expect(rows.slice(0, 5).every(m => m.past) && rows.slice(6).every(m => !m.past && !m.now)).toBe(true);
  });
  it("읽는 날이 바뀌면 지금 달도 따라간다(경계 하루 포함)", () => {
    const now = (day: string) => { const i = pageOf(projectV5Book(annual, day)!, "flowTable").rows.findIndex(m => m.now); return i < 0 ? undefined : i; };
    expect([now("2027-01-04"), now("2027-01-05"), now("2027-02-03"), now("2027-02-04"), now("2027-11-07"), now("2027-11-08"), now("2028-02-03"), now("2028-02-04")]).toEqual([undefined, 0, 0, 1, 9, 10, 12, undefined]);
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
    // 방향 바로가기는 없다. 사람마다 있던 부록 바로가기(P6c-ui2 f)도 v5 최종 1-17에서 뺐다.
    expect(out).not.toContain("↗"); expect(out).not.toMatch(/다른 기운들? 보기/); expect(out).not.toContain("보는");
  });
  it("과거 V4 관계 쪽은 원자료 줄·바로가기 없이 예전 소개를 유지", () => {
    const old = readerBook(storedBook(v4("saju_mbti_compatibility-v4"))!.data), out = html(old, pageOf(old, "pair"));
    // 방향 바로가기는 없다. 사람마다 있던 부록 바로가기(P6c-ui2 f)도 v5 최종 1-17에서 뺐다.
    expect(out).not.toContain("두 사람 사이의 기운"); expect(out).not.toContain("↗"); expect(out).not.toMatch(/다른 기운들? 보기/);
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
  // AM2-3 5부: AM 대운 표는 「앞으로 10년표」(decadeTable) + 해 카드(periodCard, 달 카드와 같은 문법).
  it("한 줄에 연도·만 나이·간지·십성·흐름·한 줄 뜻, 누르면 해 카드(지난 해는 돌아보기만 · 살필 점 없음)", () => {
    const dt = pageOf(data, "decadeTable"), out = html(data, dt);
    const now = dt.rows.find(y => y.now)!;
    expect(now.name).toBe("2026년"); expect(now.sub).toBe(`만 ${2026 - 1996}세`);
    expect(dt.rows.every(y => y.sky && y.ground && y.flowWord && y.line)).toBe(true);
    expect(out).toContain("흐름"); expect(out).not.toContain("좋은 힘"); expect(out).not.toMatch(/흐름 세기 \d\/5/);
    const cards = dt.rows.map(r => data.pages[r.page]).filter((p): p is Extract<BookPage, { kind: "periodCard" }> => p.kind === "periodCard");
    expect(cards).toHaveLength(dt.rows.length);
    expect(cards.filter(c => c.past).every(c => !c.caution && c.one?.label === "돌아보기")).toBe(true);
    expect(cards.filter(c => !c.past).every(c => !c.good || c.good.label === "해 볼 것")).toBe(true);
  });
  it("과거 V4 대운 표는 좋은 힘 라벨을 유지한다", () => {
    const old = readerBook(storedBook(v4("major_fortune-v4"))!.data);
    expect(html(old, pageOf(old, "timeline"))).toContain("좋은 힘");
  });
});

describe("개정본 표기", () => {
  it("v5는 제6판 기준일(최종판 1-13: 기준일은 판 표기에만), 과거 V4는 제4판 발행일", () => {
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
