/**
 * AM2-12 1부 시험(호출 0): 세운 출시 금지 재료 고침 — 고침마다 불변식 하나.
 *  1 썸 등 연애 상태(입력 선택지 → 엔진 상태 → 소제목 · 카드 · 장 재료의 상태 말이 한 가지) · 2 해 판정 ↔ 해 범위 줄 · 3 사(死) 되살림 원자 ·
 *  4 절에서 뺀 줄의 카드 잔류 · 5 깨진 DB 조각(영역 자기 비교) · 6 영역 달 목록 = 엔진 칩.
 * 2,010명 전수는 verdict · am2.md 22절(무료 검증 도구). 여기서는 고정 인물 + 선택지마다 무작위 표본.
 */
import { describe, expect, it, vi } from "vitest";
import { intakeOf, randomPayload } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";
import { cardEngineIssues, type BlockCtx } from "@/lib/writer/chunked/check";
import { am211Flags } from "@/lib/writer/chunked/claims";
import type { FinalChapter } from "@/lib/writer/safety";
import { chunkPlan, chunkUser, renderCard } from "@/lib/writer/chunked/prompt";
import { premiseHits, type Inputs } from "@/lib/brief/premise";
import { annualTagOf, dropSelfCompare, loveLineFits, workLineFits, YEAR_PACE } from "@/lib/brief/design/annual";
import { atomsOf, dimsOf, refineLog } from "@/lib/writer/chunked/refine";
import { coverIssue, writerKnowledge } from "@/lib/writer/publish";
import type { Intake } from "@/lib/writer/chunked/intake";

// 무작위 표본 브리프를 여러 번 만든다 — 전체 시험(병렬 부하)에서 기본 5초를 넘는다.
vi.setConfig({ testTimeout: 120_000 });
type X = ReturnType<typeof intakeOf>;
const texts = (x: Intake) => [renderCard(x), ...chunkPlan(x).map(ch => chunkUser(x, ch))].join("\n");
const withRel = (seed: number, i: number, rel: string, product: "annual_fortune" | "major_fortune" = "annual_fortune") => { const p = randomPayload(i, product, seed) as { userContext: { relationshipStatus: string } }; p.userContext.relationshipStatus = rel; return p; };
const sample = (rel: string, n: number, product: "annual_fortune" | "major_fortune" = "annual_fortune"): X[] => { const out: X[] = []; for (let i = 0; out.length < n && i < n * 3; i++) { try { out.push(intakeOf(withRel(212, i, rel, product))); } catch { /* 만세력이 받지 않는 출생 시각 */ } } return out; };
const P1117 = intakeOf(randomPayload(0, "annual_fortune", 1117));
const BOOKS = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b"] as const;
const books = Object.fromEntries(BOOKS.map(id => [id, intakeOf(payloadFor(id))])) as Record<(typeof BOOKS)[number], X>;

describe("AM2-12 1부 1 연애 상태 — 상태 말 한 가지 · 썸은 연인 있음도 만나는 사람 없음도 전제하지 않는다", () => {
  const WORD: Record<string, RegExp> = { single: /^솔로$/, some: /^썸$/, dating: /^연애 중$/, marriage_preparing: /^연애 중(\(결혼 준비\))?$/, married: /^기혼$/ };
  const HEAD: Record<string, string> = { single: "솔로로 맞는 2027년, 인연은 어디서 올까?", some: "썸으로 맞는 2027년, 이 인연은 어떻게 이어질까?", dating: "연애 중인 2027년, 둘의 관계는 어떻게 자랄까?", marriage_preparing: "연애 중인 2027년, 둘의 관계는 어떻게 자랄까?", married: "기혼으로 맞는 2027년, 함께 사는 리듬은?" };
  const wordsOf = (x: Intake) => { const all = texts(x), w: string[] = [];
    for (const t of x.person) { const m = /^연애: ([^·]+)/.exec(t); if (m) w.push(m[1].trim()); }
    for (const m of all.matchAll(/입력 한 마디: ([^·\n〕]+)/g)) if (/^(솔로|썸|연애 중|기혼|미입력)/.test(m[1].trim())) w.push(m[1].trim());
    for (const m of all.matchAll(/〔연애: ([^〕]+)〕/g)) w.push(m[1].trim());
    for (const m of all.matchAll(/적어 준 연애 상태(?:: | \| )([^|\n]+)/g)) w.push(m[1].trim());
    // 대운 key는 기준일 + 2년 뒤 해에 시점 조건 꼬리를 단다(「솔로(2029년 기유년에도 그렇다면 — 조건 꼴로)」) — 상태 말은 꼬리 앞.
    return w.map(v => v.replace(/\(\d{4}년 [^)]*그렇다면[^)]*\)$/, "").trim()); };
  it("seed 1117(P11 무작위 썸): 인물 카드 「연애: 썸」 · 소제목 · 고리 한 마디 · 해 재료가 같은 말", () => {
    const { intake, brief } = P1117;
    expect(intake.person).toContain("연애: 썸");
    expect(brief.person.facts.relationship).toBe("single");
    expect(brief.person.facts.relationshipNote).toBe("some");
    expect(intake.chapters.find(c => c.id === "love")!.sections![0].q).toBe(HEAD.some);
    expect(new Set(wordsOf(intake))).toEqual(new Set(["썸"]));
  });
  it.each(Object.keys(WORD))("선택지 %s: 무작위 세운 8명 · 대운 4명 — 상태 말 한 가지 · 2장 소제목", rel => {
    for (const x of [...sample(rel, 8), ...sample(rel, 4, "major_fortune")]) {
      for (const w of wordsOf(x.intake)) expect(w).toMatch(WORD[rel]);
      if (x.intake.product === "annual_fortune") expect(x.intake.chapters.find(c => c.id === "love")!.sections![0].q).toBe(HEAD[rel]);
    }
  });
  it("썸 무작위 세운 10명 · 대운 4명: 카드 · 묶음 지시에 연애 축 전제 말(연인 · 데이트 · 새 인연 · 소개팅 · 만남 기회 …) 0", () => {
    const SOME: Inputs = { job: "none", rel: "some", children: "none", residence: "none", shop: false };
    for (const x of [P1117, ...sample("some", 10), ...sample("some", 4, "major_fortune")]) {
      expect(x.intake.inputs?.rel).toBe("some");
      const hits = texts(x.intake).split("\n").flatMap(t => premiseHits(t, SOME).filter(h => h.need.startsWith("rel:")).map(h => `${h.word} ← ${t.slice(0, 60)}`));
      expect(hits).toEqual([]);
    }
  });
  it("솔로 · 연애 중 · 기혼의 필요 입력은 그대로(rel:solo는 솔로만 · rel:single은 솔로 · 썸)", () => {
    const S = (rel: Inputs["rel"]): Inputs => ({ job: "none", rel, children: "none", residence: "none", shop: false });
    const needs = (t: string, rel: Inputs["rel"]) => premiseHits(t, S(rel)).map(h => h.need);
    expect(needs("소개팅 앱을 켜 보는 해", "single")).toEqual([]);
    expect(needs("소개팅 앱을 켜 보는 해", "some")).toEqual(["rel:solo"]);
    expect(needs("고백할 타이밍을 재는 달", "some")).toEqual([]);
    expect(needs("고백할 타이밍을 재는 달", "dating")).toEqual(["rel:single"]);
    expect(needs("연인과 여행을 계획하는 달", "some")).toEqual(["rel:partner"]);
  });
});

describe("AM2-12 1부 2 해 판정 ↔ 해 범위 줄(덕짱님 답 (A) — 반대 줄 빼기)", () => {
  const yearLines = (x: X) => x.intake.lines.filter(l => l.subject === "year" && l.use.length);
  const verdictOf = (x: X) => yearLines(x).find(l => /^(밀고 갈 해|고르게 다질 해|버티며 다질 해)$/.test(l.value))!.value;
  const norm = (t: string) => t.replace(/지금 /g, "");
  const PACE = new Map(Object.entries(YEAR_PACE).map(([a, b]) => [norm(a), b] as const));
  /** 방향 낱말이 들었지만 해의 방향이 아닌 줄(영역 하나의 속도 · 비유 · 영역 일 꼴) — 2,010명 전수에서 모은 목록. 새 줄이 나오면 이 표나 YEAR_PACE에 넣는다. */
  const NOT_PACE = /^(땅이 뜨겁고 말라 있어 쉼과 여유로 물기를 채워야 하는 해|편안하고 느긋한 분위기가 매력이 되는 흐름|크게 타오르던 불이 등불로 잦아들어|둘 사이|연애 쪽|자격·교육 이수로|계약·증명처럼|한 가지 기술을 깊게|나를 돌보고 마음을 정리|돈이 크게 들어오고|둘만의 시간을|들어오는 돈과 고정 지출|맡은 일을 빈틈없이|예의와 약속을|마감과 압박이|친구·(주변 사람|동료)과 나눠 내는|정해진 절차를 지킬수록|고정 수입과 고정 지출|혼자 있는 시간이 좋아져|모임·행사에서 새 얼굴|시간표를 지키는|정해진 일과를 지키며|연인과는|배우자와는|계획표대로|서로 내 방식이|공모전·대외활동으로|활동 반경이 넓어지고|각자 바깥 일정과|외부 미팅·출장으로|새 툴·자격·강의로|규칙과 평가가 또렷해지는|새 인연은|쌓인 말이|난도 높은 시험|사람 만나는 자리가|나를 편하게 여기는 사람이|평판을 신경 쓰다)/;
  // AM2-12 4부: 속도 말에 「느긋 · 잔잔 · 고요 · 한가」(해 그림 줄 「느긋하게 풀을 뜯는 순한 양」을 1부 표가 놓쳤다).
  const PACE_WORD = /밀어|밀고|추진|확장|넓히|벌이|시작|도전|정비|다듬|다지|쌓|실속|효율|쉬어 가|굳히|느긋|잔잔|고요|한가/;
  it("seed 1117: 「밀고 갈 해」 — Y 「드러낸 것을 정성껏 다듬고 차곡차곡 쌓아 두기 좋은 해」를 카드에서 뺀다", () => {
    expect(verdictOf(P1117)).toBe("밀고 갈 해");
    expect(yearLines(P1117).map(l => l.value)).not.toContain("드러낸 것을 정성껏 다듬고 차곡차곡 쌓아 두기 좋은 해");
  });
  it("annual-p5: 「밀고 갈 해」 — 「확장보다 정비가 어울리는 흐름」을 카드에서 뺀다", () => {
    const p5 = books["annual-p5"];
    expect(verdictOf(p5)).toBe("밀고 갈 해");
    expect(p5.intake.lines.map(l => l.value)).not.toContain("확장보다 정비가 어울리는 흐름");
  });
  it("무작위 세운 40명: 판정과 방향이 반대인 해 범위 줄 0 · 방향 낱말 줄은 모두 표에 있다", () => {
    for (let i = 0, ok = 0; ok < 40; i++) { let x: X; try { x = intakeOf(randomPayload(i, "annual_fortune", 1212)); } catch { continue; } ok++;
      const want = verdictOf(x) === "밀고 갈 해" ? "push" : "settle";
      for (const l of yearLines(x)) { const d = PACE.get(norm(l.value)); if (d) expect(`${l.value} ${d}`).toBe(`${l.value} ${want}`);
        else if (PACE_WORD.test(l.value) && !/^(밀고 갈 해|고르게 다질 해|버티며 다질 해)$/.test(l.value) && !/^2027년 정미년/.test(l.value)) expect(l.value).toMatch(NOT_PACE); } }
  });
});

describe("AM2-12 1부 3 사(死) 되살림 — 남은 카드와 반대인 원자는 되살리지 않는다", () => {
  const { k } = writerKnowledge();
  it("annual-1: 사(死) 줄 「너무 빨리 끝냅니다.」(숙제 조각만) · 쇠(衰) 이름만 줄이 없다", () => {
    const ls = books["annual-1"].intake.lines;
    expect(ls.some(l => /너무 빨리 끝냅니다/.test(l.meaning))).toBe(false);
    expect(ls.some(l => /십이운성 (?:사|쇠)/.test(l.value))).toBe(false);
    expect(cardEngineIssues(books["annual-1"].intake, books["annual-1"].brief).filter(i => i.rule === "homonym")).toEqual([]);
  });
  it("무작위 세운 · 대운 각 20명: 되살린 원자 ↔ 다른 카드 원자(같은 차원 반대 끝) 0", () => {
    for (const product of ["annual_fortune", "major_fortune"] as const) for (let i = 0, ok = 0; ok < 20; i++) { let x: X; try { x = intakeOf(randomPayload(i, product, 1213)); } catch { continue; } ok++;
      const back = (refineLog.last?.tidyOver ?? []).filter(o => /특성 줄 마지막 문장이라 남김/.test(o.why)).map(o => o.text);
      const others = x.intake.lines.filter(l => (l.subject === "natal" || l.subject === "mbti") && l.use.length).flatMap(l => atomsOf(l.meaning)).filter(a => !back.includes(a));
      for (const a of back) { const da = dimsOf(a, k); for (const o of others) expect(dimsOf(o, k).some(([d, s]) => da.some(([d2, s2]) => d2 === d && s2 === -s))).toBe(false); } }
  });
});

describe("AM2-12 1부 4 절에서 뺀 줄의 카드 잔류", () => {
  it("annual-1: Y20 「꼭 필요한 지출까지 미루기」가 카드에 없다(쓰는 장 = 실제로 든 장)", () => {
    expect(renderCard(books["annual-1"].intake)).not.toMatch(/꼭 필요한 지출까지 미루기/);
  });
  it("고정 4권 + seed 1117: 카드 줄의 쓰는 장마다 그 장의 절 · key에 그 줄이 있다", () => {
    for (const x of [...Object.values(books), P1117]) { const at = new Map<string, Set<number>>();
      for (const c of x.intake.chapters) for (const id of [...(c.sections ?? []).flatMap(s => [...s.lines, ...(s.claimIds ?? [])]), ...(c.keys ?? []).flatMap(kk => kk.lines)]) at.set(id, new Set([...(at.get(id) ?? []), c.n]));
      for (const l of x.intake.lines) for (const n of l.use) expect(`${l.id} ${n} ${at.get(l.id)?.has(n)}`).toBe(`${l.id} ${n} true`); }
  });
});

describe("AM2-12 1부 5 깨진 DB 조각 — 영역 자기 비교 머리 말은 렌더에서 뗀다(DB 원문 그대로)", () => {
  it("dropSelfCompare · 꼬리표는 원문으로 찾는다", () => {
    expect(dropSelfCompare("돈보다 관심 분야에 쓰는 지출이 늘기 쉬운 쪽", "돈")).toBe("관심 분야에 쓰는 지출이 늘기 쉬운 쪽");
    expect(dropSelfCompare("겉모습보다 생각이 통하는 사람에게 끌리기 쉬운 흐름", "연애")).toBe("겉모습보다 생각이 통하는 사람에게 끌리기 쉬운 흐름");
    expect(annualTagOf("관심 분야에 쓰는 지출이 늘기 쉬운 쪽")?.d).toEqual([["spendingControl", -1, 2]]);
  });
  it("annual-1 · annual-p6a: 카드 · 묶음 지시에 「돈보다 관심 분야」 0", () => {
    for (const id of ["annual-1", "annual-p6a"] as const) expect(texts(books[id].intake)).not.toMatch(/돈보다 관심 분야/);
  });
});

describe("AM2-12 1부 6 영역 달 목록 = 엔진 칩(list_chip)", () => {
  it("고정 4권 + seed 1117: list_chip 0", () => {
    for (const x of [...Object.values(books), P1117]) expect(cardEngineIssues(x.intake, x.brief).filter(i => i.rule === "list_chip")).toEqual([]);
  });
  it("목록에서 달 하나를 빼거나 더하면 잡는다", () => {
    const { intake, brief } = P1117;
    const cut = { ...intake, lines: intake.lines.map(l => (l.value === "연애 쪽 기운이 오르는 달" ? { ...l, meaning: l.meaning.replace(/, 11월 · 신해월/, "") } : l)) };
    expect(cardEngineIssues(cut, brief).filter(i => i.rule === "list_chip").map(i => i.text)).toEqual(["「연애 쪽 기운이 오르는 달」 빠짐 신해월"]);
    const add = { ...intake, lines: intake.lines.map(l => (l.value === "무리하기 쉬운 달" ? { ...l, meaning: `${l.meaning}, 5월 · 을사월` } : l)) };
    expect(cardEngineIssues(add, brief).filter(i => i.rule === "list_chip").map(i => i.text)).toEqual(["「무리하기 쉬운 달」 엔진 밖 을사월"]);
  });
});

describe("AM2-12 2부 엔진 주장 — P9~P11 판독이 찾은 틀림 가운데 놓친 꼴(걸림) · 맞는 꼴(통과)", () => {
  const ctx = (x: X): BlockCtx => ({ intake: x.intake, brief: x.brief, ...(x.brief.mbti ? { mbtiType: x.brief.mbti.type } : {}) });
  const ch = (n: number, heading: string, paragraphs: string[], keys?: string[]): FinalChapter => ({ n, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading, paragraphs }], ...(keys ? { keys } : {}) });
  const rules = (x: X, c: FinalChapter) => am211Flags([c], ctx(x)).map(f => f.rule);
  it("month_dir: P9 기준 annual-1 「연애와 일, 사람 쪽 기운이 이 세 달에 맞닿아」 · P9 annual-p5 3월 「연애에서는 살필 쪽」 「연애 중인 당신에게는 살필 쪽」(연애 →) 걸림", () => {
    expect(rules(books["annual-1"], ch(1, "적어 준 바람은 이 해와 어떻게 만날까?", ["이 바람과 이어지는 영역이 오르는 달은 2월 · 임인월, 7월 · 정미월, 10월 · 경술월입니다. 연애와 일, 사람 쪽 기운이 이 세 달에 맞닿아 있어요."]))).toContain("month_dir");
    for (const s of ["눌러 다듬을 일이 생깁니다. 연애에서는 살필 쪽이에요.", "연애 중인 당신에게는 살필 쪽이에요."]) expect(rules(books["annual-p5"], ch(7, "2027-M02", [s], ["2027-M02"]))).toContain("month_dir");
    expect(rules(books["annual-p5"], ch(7, "2027-M02", ["일은 살필 쪽이에요."], ["2027-M02"]))).not.toContain("month_dir");
  });
  it("year_dir: P9 기준 annual-p5 「재물 기운이 약한 해라서」(2027 돈 →) 걸림 / 원국 말 「재물 기운이 약한 사주」 통과", () => {
    expect(rules(books["annual-p5"], ch(3, "2027년 돈은 어디서 들어올까?", ["재물 기운이 약한 해라서 들어오는 돈의 크기보다 나가는 돈의 모양을 먼저 보는 쪽이 이 해의 돈 관리입니다."]))).toContain("year_dir");
    expect(rules(books["annual-p5"], ch(3, "2027년 돈은 어디서 들어올까?", ["재물 기운이 약한 사주라서 나가는 돈의 모양을 먼저 봅니다."]))).not.toContain("year_dir");
  });
  it("list_full: P11 annual-1 「사람 쪽은 1월 · 5월 · 8월에 속도를 늦추면」(9월 빠짐) · annual-p6a 「공부 쪽이 오르는 달은 4 · 7 · 8월」 걸림 / 전부 통과", () => {
    const a1 = (m: string) => rules(books["annual-1"], ch(9, "흐름이 도울 때와 기다릴 때", [`일 쪽은 4월 · 갑진월, 사람 쪽은 1월 · 신축월, 5월 · 을사월, 8월 · 무신월${m}에 속도를 늦추면 좋아요.`]));
    expect(a1("")).toContain("list_full");
    expect(a1(", 9월 · 기유월")).not.toContain("list_full");
    expect(rules(books["annual-p6a"], ch(1, "적어 준 바람은 2027년과 어떻게 만날까?", ["공부 쪽이 오르는 달은 4월 · 갑진월, 7월 · 정미월, 8월 · 무신월이에요."]))).toContain("list_full");
    expect(rules(books["annual-p6a"], ch(1, "적어 준 바람은 2027년과 어떻게 만날까?", ["공부 쪽이 오르는 달은 4월 · 갑진월, 7월 · 정미월, 8월 · 무신월, 9월 · 기유월, 10월 · 경술월이에요."]))).not.toContain("list_full");
  });
  it("prev_month: P11 무작위 9월 「앞달에 손본 자리가」(8월은 신해해 · 공망뿐) 걸림 / 앞 달에 형이 있으면 통과", () => {
    expect(rules(P1117, ch(7, "2027-M08", ["앞달에 손본 자리가 이번에는 맺는 쪽으로 옮겨 가요."], ["2027-M08"]))).toContain("prev_month");
    expect(rules(P1117, ch(7, "2027-M07", ["앞달에 손본 자리가 이번에는 다른 쪽으로 옮겨 가요."], ["2027-M07"]))).not.toContain("prev_month");
  });
  it("list_shape: P9 annual-p6b 「네 달은 서로 떨어져」(2 · 3월 이웃) · P9 기준 annual-p6a 「세 달 사이에는 흐름이 잔잔한 시기도」(사이 3월 흐름 5) 걸림", () => {
    expect(rules(books["annual-p6b"], ch(2, "연애 쪽 기운이 오르는 달은 언제일까?", ["연애 쪽 기운이 오르는 달은 2월 · 임인월, 3월 · 계묘월, 6월 · 병오월, 11월 · 신해월입니다. 네 달은 서로 떨어져 있어서, 한 해 사이사이에 고르게 숨을 틔워 주는 셈이에요."]))).toContain("list_shape");
    expect(rules(books["annual-p6b"], ch(2, "연애 쪽 기운이 오르는 달은 언제일까?", ["연애 쪽 기운이 오르는 달은 2월 · 임인월, 6월 · 병오월, 11월 · 신해월입니다. 세 달은 서로 떨어져 있어요."]))).not.toContain("list_shape");
    expect(rules(books["annual-p6a"], ch(1, "적어 준 바람은 이 해와 어떻게 만날까?", ["이 영역이 오르는 달은 2월 · 임인월, 4월 · 갑진월, 5월 · 을사월입니다.", "세 달 사이에는 흐름이 잔잔한 시기도 끼어 있어요."]))).toContain("list_shape");
  });
  it("status_claim: P11 무작위(썸) 「연애 중인 당신은 연인과」 걸림 / 「썸 타는 당신」 · 조건 꼴 통과", () => {
    expect(rules(P1117, ch(7, "2027-M03", ["연애 중인 당신은 연인과 작은 일로 양보 없이 맞설 수 있어요."], ["2027-M03"]))).toContain("status_claim");
    expect(rules(P1117, ch(7, "2027-M03", ["썸 타는 당신에게는 마음을 천천히 보여 주는 달이에요.", "연애 중인 당신이라면 말보다 행동이 먼저예요."], ["2027-M03"]))).not.toContain("status_claim");
  });
  it("verdict_dir: P11 annual-p5 「2027년 정미년은 확장보다 정비가」 · 무작위 「2027년은 밀어붙이기보다 다듬고 쌓는 쪽」(판정 밀고 갈 해) 걸림 / 영역 문장 통과", () => {
    expect(rules(books["annual-p5"], ch(4, "사업하는 2027년, 넓힐 쪽과 다질 쪽은?", ["2027년 정미년은 확장보다 정비가 어울리는 흐름이에요."]))).toContain("verdict_dir");
    expect(rules(P1117, ch(1, "2027년은 밀고 갈 해일까, 다질 해일까?", ["그래서 정유진님의 2027년은 밀어붙이기보다 다듬고 쌓는 쪽에 힘이 실립니다."]))).toContain("verdict_dir");
    expect(rules(books["annual-p5"], ch(3, "2027년 돈은 어디서 들어올까?", ["돈은 확장보다 정비가 어울리는 쪽이에요."]))).not.toContain("verdict_dir");
  });
});

describe("AM2-12 2부 재료 — 낱말표 밖 일터 전제 줄(「보상 이야기」)은 돈을 버는 일이 있을 때만", () => {
  it("workLineFits · seed 1117(학생) 카드에 「보상 이야기」 0", () => {
    expect(workLineFits("한 일을 숫자와 기록으로 남겨 보상 이야기를 꺼내기 좋은 때", "student")).toBe(false);
    expect(workLineFits("한 일을 숫자와 기록으로 남겨 보상 이야기를 꺼내기 좋은 때", "employee")).toBe(true);
    expect(texts(P1117.intake)).not.toMatch(/보상 이야기|보상도 부담도/);
  });
});

describe("AM2-12 4부 측정 중 고침 — P12 판독이 찾은 엔진 틀림 가운데 놓친 꼴(걸림) · 맞는 꼴(통과)", () => {
  const ctx = (x: X): BlockCtx => ({ intake: x.intake, brief: x.brief, ...(x.brief.mbti ? { mbtiType: x.brief.mbti.type } : {}) });
  const ch = (n: number, heading: string, paragraphs: string[], keys?: string[]): FinalChapter => ({ n, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading, paragraphs }], ...(keys ? { keys } : {}) });
  const rules = (x: X, c: FinalChapter) => am211Flags([c], ctx(x)).map(f => f.rule);
  it("prev_month: P12 annual-p5 8월 「연인과는 앞 달인 6월 · 병오월의 부딪침과 달리」(앞 달은 7월) 걸림 / 바로 앞 달 · 「같은 자리의 앞 달인」 통과", () => {
    const m08 = (s: string) => rules(books["annual-p5"], ch(7, "2027-M07", [s], ["2027-M07"]));
    expect(m08("연인과는 앞 달인 6월 · 병오월의 부딪침과 달리 서로의 생각이 한곳으로 모입니다.")).toContain("prev_month");
    expect(m08("앞 달인 7월 · 정미월과 달리 서로의 생각이 한곳으로 모입니다.")).not.toContain("prev_month");
    expect(m08("같은 자리의 앞 달인 6월 · 병오월과 달리 서로의 생각이 한곳으로 모입니다.")).not.toContain("prev_month");
  });
  it("verdict_dir: P12 annual-p5(밀고 갈 해) 1장 「밀어붙이는 해라기보다 맡은 일을 반듯하게 받쳐 가는 해로 읽힙니다」 걸림 / annual-p6b(버티며 다질 해) 통과", () => {
    const s = "밀어붙이는 해라기보다 맡은 일을 반듯하게 받쳐 가는 해로 읽힙니다.";
    expect(rules(books["annual-p5"], ch(1, "2027년은 밀고 갈 해일까, 다질 해일까?", [s]))).toContain("verdict_dir");
    expect(rules(books["annual-p6b"], ch(1, "2027년은 밀고 갈 해일까, 다질 해일까?", [s]))).not.toContain("verdict_dir");
  });
  it("month_dir: P12 annual-p6b 1월 「관계 쪽은 말투가 부드러워져 사이가 편해지는 흐름이에요」(사람 ↓) 걸림 / 2월(사람 →) 통과", () => {
    const s = "관계 쪽은 말투가 부드러워져 사이가 편해지는 흐름이에요.";
    expect(rules(books["annual-p6b"], ch(7, "2026-M12", [s], ["2026-M12"]))).toContain("month_dir");
    expect(rules(books["annual-p6b"], ch(7, "2027-M01", [s], ["2027-M01"]))).not.toContain("month_dir");
  });
  it("list_shape: P12 annual-1 돈 장 「돈이 새기 쉬운 달은 2 · 3월 … 두 달이 지나면 오르는 달이 이어서 오니」(4월 돈 →) 걸림 / 다음 달이 오르면 통과", () => {
    const s = (a: string) => rules(books["annual-1"], ch(3, "돈이 새기 쉬운 구멍은 어디일까?", [a, "두 달이 지나면 오르는 달이 이어서 오니, 그때 쓸 여유를 지금부터 만들어 두는 셈입니다."]));
    expect(s("돈이 새기 쉬운 달은 2월 · 임인(壬寅)월과 3월 · 계묘(癸卯)월이에요.")).toContain("list_shape");
    expect(s("돈을 아껴 둘 달은 5월 · 을사월과 6월 · 병오월이에요.")).not.toContain("list_shape");
  });
  it("seat_ref: P12 annual-1 큰 그림 「가까운 데서 마찰이 생기기 쉬운 만큼」(2027은 태어난 날 자리와 오미합뿐) 걸림 / seed 1117(술미형 — 태어난 날 자리) 통과", () => {
    const s = "가까운 데서 마찰이 생기기 쉬운 만큼 손볼 일이 드러나면 그때 다듬으면 돼요.";
    expect(rules(books["annual-1"], ch(1, "2027년은 밀고 갈 해일까, 다질 해일까?", [s]))).toContain("seat_ref");
    expect(rules(P1117, ch(1, "2027년은 밀고 갈 해일까, 다질 해일까?", [s]))).not.toContain("seat_ref");
  });
  it("cover: P12 seed 1118(2027 흐름 5) 표지 「등불처럼 오래 비추는 느긋한 한 해」 걸림(엔진 표지로) / annual-p6b(흐름 2) 통과 · 4종은 이 검사 밖", () => {
    const r1118 = intakeOf(randomPayload(2, "annual_fortune", 1118));
    expect(coverIssue("등불처럼 오래 비추는 느긋한 한 해", r1118.brief, [])?.reason).toMatch(/속도 말\(느긋\)/);
    expect(coverIssue("늦여름 마른 흙 위에서 등불이 오래 타는 해", r1118.brief, [])).toBeNull();
    expect(coverIssue("등불처럼 오래 비추는 느긋한 한 해", books["annual-p6b"].brief, [])?.reason ?? "").not.toMatch(/속도 말/);
  });
  it("입력 상태: P12 annual-p5(연애 중) 카드 Y12 「아껴 주고 챙겨 주는 사람에게 마음이 열리기 쉬운 때」 — 짝 있음이면 빼고 솔로 · 썸은 그대로", () => {
    const l = "아껴 주고 챙겨 주는 사람에게 마음이 열리기 쉬운 때";
    for (const st of ["dating", "marriage_preparing", "married"]) expect(loveLineFits(l, st)).toBe(false);
    for (const st of ["single", "some"]) expect(loveLineFits(l, st)).toBe(true);
    expect(texts(books["annual-p5"].intake)).not.toMatch(/사람에게 마음이 열리기 쉬운/);
  });
  it("해 그림 줄: 밀고 갈 해(annual-p5 · p6a)는 카드에서 「느긋하게 풀을 뜯는 순한 양」을 빼고, 다질 해(annual-p6b)는 남긴다", () => {
    expect(YEAR_PACE["늦여름 저녁 언덕에서 느긋하게 풀을 뜯는 순한 양"]).toBe("settle");
    for (const id of ["annual-p5", "annual-p6a"] as const) expect(renderCard(books[id].intake)).not.toMatch(/느긋하게 풀을 뜯는 순한 양/);
  });
});
