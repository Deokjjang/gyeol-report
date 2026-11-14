/**
 * AM2-8 뿌리 7(화면 입력 거름, 호출 0): 세운 · 대운 책 화면에 보이는 글(할 일 · 돌아보기 · 살필 점 · 좋은 것 · 핵심 해 이유 · 십성 풀이 · 용어 풀이 ·
 * 열쇠말 · 그림 줄 · 배지 줄 · 카드 핵심 줄 · 표 뜻 · 십성 한 줄 사전 · 평생 지도 · 키워드 쪽 · 나를 돕는 것)을 입력 행렬
 * (일 7 × 관계 4 × 상품 2 × 원국 6)로 모아 본다. 작가 없이 브리프 → 조립(assembleV5Book, 빈 본문) → 투영(projectV5Book) 그대로.
 * (a) 낱말표(premise.ts) 위반 0, (b) 돈 버는 일이 없는 입력(학생 · 취업 준비 · 쉬는 중 · 미입력)에 일터 말 0, (c) 기혼에 연애 시작 말 0, (d) [좋은 것]에 주의 뜻 0.
 * 앞 판(AM2-7 행렬)은 설계도 · 카드 글만 보고 화면 조립 글(핵심 해 이유 · 용어 풀이 · 카드 핵심 줄)과 가운뎃점 목록 안 말을 보지 못했다.
 */
import { describe, expect, it } from "vitest";
import { buildBrief } from "@/lib/brief";
import { inputsOf, itemFits, neutralize, premiseHits } from "@/lib/brief/premise";
import { coreLine, SEAT_SHORT_KO } from "@/lib/brief/core";
import { deepLines } from "@/lib/brief/knowledge";
import { goodLineOf } from "@/lib/brief/productEvidence";
import type { Brief } from "@/lib/brief/schema";
import { assembleV5Book, createV5Snapshot, payloadToBriefInput, projectV5Book } from "@/lib/writer/book";
import { writerChapters } from "@/lib/writer/prompt";
import { kstDate, writerKnowledge } from "@/lib/writer/publish";
import type { FinalChapter } from "@/lib/writer/safety";
import { MATRIX_CHARTS } from "../../../tools/annual-major/am2-7-matrix";
import { payloadOf } from "../../../tools/annual-major/mockRun";
import { CAUTION_MEANING, LOVE_START, WORKPLACE } from "./am28-words";

const AT = "2026-12-02T03:00:00.000Z";
const JOBS = ["employee", "self_employed", "freelancer", "student", "job_seeker", "unemployed", ""] as const;
const RELS = ["single", "dating", "married", ""] as const;
const PRODUCTS = ["annual_fortune", "major_fortune"] as const;
/** 원국 6(AM2-7 행렬 표본 그대로 — 일간 · 성별 · 나이대가 다르다). */
const CHARTS = MATRIX_CHARTS;

type Facts = Brief["person"]["facts"];
type ScreenText = { where: string; text: string };

/** 작가 없이 화면에 나오는 글 전부(브리프 시간표 + 조립 · 투영 쪽). 본문 문단은 빈 글이라 보지 않는다. */
function screenTexts(payload: unknown): { facts: Facts; texts: ScreenText[] } | null {
  const { k } = writerKnowledge();
  let brief: Brief;
  try { brief = buildBrief(payloadToBriefInput(payload as never, kstDate(AT), AT) as never, k); } catch (e) { if (/Uncertain|시각|birth|Dayun/i.test(String(e))) return null; throw e; }
  const out: ScreenText[] = [];
  const add = (where: string, t: string | null | undefined) => { if (t && t.trim()) out.push({ where, text: t }); };
  const tl = brief.timeline;
  for (const e of tl?.entries ?? []) {
    add("할 일", e.todo); add("돌아보기", e.review); add("살필 점", e.caution); add("좋은 것", e.good); add("그림 줄", e.imageLine); add("머리 줄", e.head);
    for (const w of e.keywords) add("열쇠말", w);
    for (const b of e.badges) add("배지 줄", b.line);
    for (const r of e.keyYear?.reasons ?? []) add("핵심 해 이유", r);
  }
  for (const v of Object.values(tl?.tenGodNotes ?? {})) { add("십성 풀이", v.meaning); add("십성 풀이", v.caution); }
  for (const g of brief.glossary ?? []) add("용어 풀이", g.meaning);
  for (const p of brief.appendix ?? []) for (const it of p.items) add("부록 기운 뜻", it.meaning);
  for (const c of tl?.lifetime ?? []) add("평생 지도", c.theme);
  if (brief.display) { for (const w of brief.display.keywords ?? []) add("키워드 쪽", w); add("나를 돕는 것", brief.display.lucky?.why); add("나를 돕는 것", brief.display.samjae?.line); }
  // 조립 · 투영(작가 본문 대신 빈 문단): 카드 핵심 줄 · 관계 뜻 · 십성 한 줄 · 표 뜻 · 평생 지도 머리.
  const plan = writerChapters(brief);
  const finals: FinalChapter[] = plan.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, sections: (ch.keys?.length ? ch.keys : ["소제목"]).map(h => ({ heading: h, paragraphs: ["본문."] })), source: "deterministic", chars: 3, ...(ch.keys ? { keys: ch.keys } : {}) }));
  const { draft, evidence } = assembleV5Book({ brief, plan, finals, report: { deletions: [], warnings: [] }, payload: payload as never, generatedAt: AT, people: [], writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 0, briefHash: "", knowledgeVersion: "", promptVersion: "", recovered: false });
  const book = projectV5Book(createV5Snapshot({ reportId: "am28screen", createdAtIso: AT, draft, evidence }), kstDate(AT));
  if (!book) throw new Error("투영 실패");
  for (const p of book.pages) {
    if (p.kind === "periodCard") { add("카드 그림 줄", p.line); add("카드 할 일", p.one?.text); add("카드 핵심 줄", p.core); add("십성 한 줄", p.skyLine); add("십성 한 줄", p.groundLine); add("카드 채움", p.fills); for (const r of p.relations) add("카드 관계 뜻", r.plain); }
    if (p.kind === "flowTable" || p.kind === "decadeTable") { for (const r of p.rows) { add("표 뜻", r.line); add("표 구분 줄", r.divider); } for (const d of p.dict) add("십성 한 줄", d.line); }
    if (p.kind === "flowTable" && p.year) { add("십성 한 줄", p.year.skyLine); add("십성 한 줄", p.year.groundLine); add("해 판정", p.year.verdict); }
    if (p.kind === "lifetime") { add("평생 지도", p.head); for (const c of p.cycles) add("평생 지도", c.theme); }
    if (p.kind === "keywords") { for (const w of p.keywords) add("키워드 쪽", w); add("해 판정", p.verdict); }
    if (p.kind === "lucky") add("나를 돕는 것", p.why);
  }
  return { facts: brief.person.facts, texts: out };
}

const NO_WORK = new Set(["student", "job_seeker", "unemployed", ""]);
type Viol = { cat: "a" | "b" | "c" | "d"; where: string; who: string; text: string; why: string };
function violations(): { viol: Viol[]; cases: number; texts: number } {
  const viol: Viol[] = []; let cases = 0, texts = 0;
  for (const [ci, [birthDate, birthTime, gender]] of CHARTS.entries()) for (const product of PRODUCTS) for (const job of JOBS) for (const rel of RELS) {
    const r = screenTexts(payloadOf(product, { name: "가상화면", birthDate, birthTime, gender, mbti: "ENFP", job, rel }));
    if (!r) continue;
    cases++; texts += r.texts.length;
    const x = inputsOf(r.facts), who = `${product.slice(0, 5)} 원국${ci} 일=${job || "없음"} 관계=${rel || "없음"}`;
    for (const t of r.texts) {
      const hits = premiseHits(t.text, x);
      if (hits.length) viol.push({ cat: "a", where: t.where, who, text: t.text, why: hits.map(h => h.word).join(",") });
      const w = NO_WORK.has(job) ? t.text.match(WORKPLACE) : null;
      if (w) viol.push({ cat: "b", where: t.where, who, text: t.text, why: w[0] });
      const l = rel === "married" ? t.text.match(LOVE_START) : null;
      if (l) viol.push({ cat: "c", where: t.where, who, text: t.text, why: l[0] });
      const c = t.where === "좋은 것" ? t.text.match(CAUTION_MEANING) : null;
      if (c) viol.push({ cat: "d", where: t.where, who, text: t.text, why: c[0] });
    }
  }
  return { viol, cases, texts };
}

describe("AM2-8 화면 입력 거름(입력 행렬, 호출 0)", () => {
  const { viol, cases, texts } = violations();
  const summary = (cat: Viol["cat"]) => { const v = viol.filter(x => x.cat === cat), by: Record<string, number> = {};
    for (const x of v) by[`${x.where}:${x.why}`] = (by[`${x.where}:${x.why}`] ?? 0) + 1;
    return { n: v.length, unique: new Set(v.map(x => `${x.where}|${x.text}`)).size, by, samples: [...new Map(v.map(x => [`${x.where}|${x.text}`, `${x.who} · ${x.where} · ${x.why} · ${x.text.slice(0, 90)}`])).values()].slice(0, 12) }; };
  it("행렬이 돈다(세운 · 대운 × 일 7 × 관계 4 × 원국 6)", () => { expect(cases).toBe(CHARTS.length * PRODUCTS.length * JOBS.length * RELS.length); expect(texts).toBeGreaterThan(cases * 40);
    // 보고(AM28_REPORT=1): 범주별 걸린 줄 수 · 서로 다른 글 수 · 자리:낱말별 수(고치기 전 · 뒤 수를 잰다).
    if (process.env.AM28_REPORT) process.stdout.write(`AM28_REPORT ${JSON.stringify({ cases, texts, a: summary("a"), b: summary("b"), c: summary("c"), d: summary("d") })}\n`); });
  it("판독 인용 줄이 입력에 맞는 꼴로 바뀐다", () => {
    const f = (job: string, rel = "single") => inputsOf({ relationship: rel, children: "unknown", job: { status: job, class: job === "student" ? "student" : "none", detail: "" } });
    const rest = f("unemployed"), emp = f("employee");
    for (const t of ["답답했던 일 처리 방식을 하나 골라, 바꾸고 싶은 점을 세 줄 제안으로 적어 두세요", "혼자 파고든 내용은 한 장 요약으로 만들어 함께 일하는 사람과 나누세요", "바쁜 때일수록 일주일에 한 번은 정해진 요일에 안부 전화를 거세요"]) {
      expect(itemFits("todo", t, rest), t).toBe(false); expect(itemFits("todo", t, emp), t).toBe(true); }
    expect(neutralize("소속·직함·역할이 분명해지고, 규칙을 지킨 만큼 평판이 쌓여요.", rest)).toBe("내 자리와 역할이 분명해지고, 규칙을 지킨 만큼 평판이 쌓여요.");
    expect(neutralize("소속·직함·역할이 분명해지고, 규칙을 지킨 만큼 평판이 쌓여요.", emp)).toBe("소속·직함·역할이 분명해지고, 규칙을 지킨 만큼 평판이 쌓여요.");
    expect(neutralize("비슷한 처지의 동료·친구·경쟁자가 늘어나는 해예요.", f("student"))).toBe("비슷한 처지의 친구·경쟁자가 늘어나는 해예요.");
    expect(neutralize("자기 힘으로 서려는 자립심과 어깨를 나란히 하는 동료 관계를 뜻합니다.", rest)).toBe("자기 힘으로 서려는 자립심과 어깨를 나란히 하는 친구 관계를 뜻합니다.");
    expect(neutralize("사람과 거래", rest)).toBe("사람과 교류");
    expect(neutralize("크게 드러내지 않아도 가까이 온 사람에게 번지는 은근한 매력과 호감을 뜻합니다.", f("employee", "married"))).toBe("크게 드러내지 않아도 가까이 온 사람에게 번지는 은근한 매력을 뜻합니다.");
    // 카드 핵심 줄 · 핵심 해 이유의 달 자리 뜻(「일터」 → 「사회생활」), 지식 DB short:life와 같은 값.
    const badge = { kind: "CHUNG", label: "인신충", line: "부딪쳐 바뀌는 해", tone: "minus", with: "태어난 달" } as const;
    expect(coreLine([{ kind: "rel", badge: badge as never, name: "인신충", weight: 3 }], { work: false })).toBe("태어난 달 자리(사회생활)와 인신충 · 부딪쳐 바꿀 계기");
    expect(coreLine([{ kind: "rel", badge: badge as never, name: "인신충", weight: 3 }])).toBe("태어난 달 자리(일터)와 인신충 · 부딪쳐 바꿀 계기");
    expect(deepLines(writerKnowledge().k, "seat-meaning", "seat:month", "short:life")[0]).toBe(SEAT_SHORT_KO.monthLife);
    // R-S3: [좋은 것]은 좋은 쪽 줄만 — 상관 돈 「기분 따라 쓰는 지출이 늘기 쉬움」 대신 다른 영역의 좋은 쪽 줄, 편관 달은 비운다.
    expect(goodLineOf("傷官", 1)).toBe("아이디어와 말이 날카로워져 틀을 바꾸고 싶어짐");
    expect(goodLineOf("偏官", 0)).toBeUndefined();
    expect(goodLineOf("比肩", 2)).toBe("내 이름을 걸고 직접 하려는 마음이 커짐");
  });
  it("(a) 화면 글에 입력과 맞지 않는 전제 말이 없다(낱말표)", () => { expect(summary("a").samples).toEqual([]); });
  it("(b) 학생 · 취업 준비 · 쉬는 중 · 미입력에 일터 말이 없다", () => { expect(summary("b").samples).toEqual([]); });
  it("(c) 기혼에 연애 시작 말(호감 · 고백 · 썸 · 소개팅 · 마음을 확인 · 새 인연)이 없다", () => { expect(summary("c").samples).toEqual([]); });
  it("(d) [좋은 것]에 주의 뜻 줄이 없다", () => { expect(summary("d").samples).toEqual([]); });
}, 600_000);
