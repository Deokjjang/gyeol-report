/**
 * W3 P3 검사(4·5·6절): 노출 금지 HARD 규칙 · 개수 말 대조 · 수리 뒤 결정론 재검.
 * 양성 문장은 research-w2(3c2b7bac) 결함 인용(R7·CO4·LO1·LO7·5-5·4-4)과 저장소 원고 꼴, 음성 문장은 운영·저장소 말뭉치에서 본 일상어 꼴.
 */
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import type { BriefPersonInput } from "@/lib/brief/buildBrief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { exposureHits, exposureOf, plainStrength } from "@/lib/writer/safety/exposure";
import { HARD_RULES, HINT } from "@/lib/writer/safety/p6c";
import { styleFlags } from "@/lib/writer/safety/style";
import type { FinalChapter } from "@/lib/writer/safety";
import type { LintFlag } from "@/lib/writer/safety/p6c";
import { deleteFlagged, lostFactTokens, revertRepairRegressions, type AppliedRepair } from "@/lib/writer/repair3";
import { buildV5Snapshot, coverNumberIssue } from "@/lib/writer/publish";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { memorySink } from "@/lib/ops/generation/sinks";
import { RAW_FULL, llmDeps, mockTextFor } from "../../helpers/v5Scenarios";

const ch = (n: number, paragraphs: string[][]): FinalChapter => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer", chars: 0, sections: paragraphs.map((ps, i) => ({ heading: `소제목 ${n}.${i}`, paragraphs: ps })) });

describe("W3 P3 4절 노출 금지", () => {
  it("판정 등급어(신약·신강·중화·과다·세기·힘 단계)를 잡는다", () => {
    const grade = [
      "남궁현님은 매우 신약한 사주라 혼자 버티기보다 도움을 빌려요.", // CO4 꼴
      "규칙의 힘은 약입니다.", // R7 「힘은 약입니다」
      "내 힘의 세기는 중화라서 상황에 맞춰 밀고 당겨요.",
      "내 힘의 세기는 신강이에요.",
      "여기에 토 과다가 겹칩니다.",
      "수가 과다한 사주는 정보가 넘쳐요.",
      "비겁 과다는 혼자 먼저 움직이게 해요.",
      "별의 세기는 보통입니다.",
      "값을 받는 힘은 보통이고, 성과를 크게 굴릴 때 붙어요.",
      "관성 세기 보통이라 규칙을 지키는 힘이 고르게 있어요.",
      "규칙의 힘(관성) 강, 배우는 힘(인성) 약.",
    ];
    for (const s of grade) expect(exposureOf(s)?.kind, s).toBe("grade");
  });
  it("생성 규칙 문구(시간 미상·입력 상태·가정으로만·기준으로 썼어요·기준일)를 잡는다", () => {
    const rule = [
      "시간 미상이 아니라 태어난 시각이 있어서 자녀 자리를 봐요.", // LO1
      "지금은 연애 중이고 자녀는 아직 입력된 게 없으니, 이건 가정 속 이야기예요.", // 4-4·5-2
      "입력하신 정보에 직업이 없어서 일반 장면으로 볼게요.",
      "부모님 이야기는 가정으로만 그려 볼게요.", // LO7
      "이 책은 2026년 11월 13일을 기준으로 썼어요.", // 5-5
      "기준일에 마지막 해를 지나고 있어요.", // 5-5
    ];
    for (const s of rule) expect(exposureOf(s)?.kind, s).toBe("rule");
  });
  it("일상어 꼴은 잡지 않는다(말뭉치 오탐 확인)", () => {
    const plain = [
      "과다 지출을 막으려면 한도를 먼저 정해 두세요.",
      "INTP는 지난 경험을 기준으로 삼는 유형이에요.",
      "관계를 맺는 힘은 약속을 지키는 데서 나와요.",
      "만드는 힘은 강하고, 받는 힘은 약한 편이에요.",
      "이 해의 세기는 무엇을 더할까요?",
      "식상의 세기가 약한 편이라 표현이 천천히 나와요.",
      "중화요리를 좋아하는 사람이에요.",
      "가족을 기준으로 나누면 두 갈래예요.",
      "데이터 입력 업무가 없는 날에는 쉬어 가세요.",
      "지금 버티는 힘이 여린 편이라 도움을 빌리면 수월해요.",
    ];
    for (const s of plain) expect(exposureHits(s), s).toEqual([]);
  });
  it("HARD 규칙이고 수리 힌트가 있다, time_deictic 힌트는 기준일을 권하지 않는다", () => {
    expect(HARD_RULES.has("grade_leak")).toBe(true);
    expect(HARD_RULES.has("rule_leak")).toBe(true);
    expect(HARD_RULES.has("fact_count")).toBe(true);
    expect(HINT.grade_leak.length).toBeGreaterThan(10);
    expect(HINT.time_deictic).not.toMatch(/기준일|기준 날짜/);
  });
  it("뜻 말(plainStrength)은 등급어가 아니다", () => {
    for (const lv of ["VERY_WEAK", "WEAK", "BALANCED", "STRONG", "VERY_STRONG"]) expect(exposureHits(`타고난 힘으로 보면 ${plainStrength(lv)}이에요.`)).toEqual([]);
  });
  it("용어 첫 등장 풀이 없음은 SOFT 깃발(term_unexplained)이다", () => {
    const flags = styleFlags([ch(1, [["당신 사주에는 편인이 두드러져요. 그래서 혼자 생각하는 시간이 길어요."]]), ch(2, [["편인이 다시 나와도 두 번째는 세지 않아요."]])]);
    const t = flags.filter(f => f.rule === "term_unexplained");
    expect(t.map(f => [f.chapter, f.detail])).toEqual([[1, "편인"]]);
    expect(HARD_RULES.has("term_unexplained" as never)).toBe(false);
    const ok = styleFlags([ch(1, [["당신 사주에는 편인(혼자 깊이 파고들어 배우는 힘)이 두드러져요."]])]);
    expect(ok.filter(f => f.rule === "term_unexplained")).toEqual([]);
  });
});

describe("W3 P3 5절 사실 대조: 궁합 관계 셈 하나로 · 개수 말", () => {
  const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
  const BASE = "2026-11-04";
  const SODAM: BriefPersonInput = { name: "장소담", gender: "FEMALE", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, mbtiType: "INTP", context: { relationshipStatus: "dating", jobStatus: "self_employed", detailJob: "카페 사장" } };
  const SEONGMIN: BriefPersonInput = { name: "전성민", gender: "MALE", birthDate: "1992-11-09", birthTime: "19:45", birthTimeUnknown: false, mbtiType: "ISTJ" };
  const input = { product: "saju_mbti_compatibility" as const, baseDate: BASE, person: SODAM, partner: SEONGMIN, relationshipType: "love" as const };
  const brief = buildBrief(input, k);
  const sheet = buildFactSheet(input, brief, k);
  const ctx = factCtxOf(sheet, k, [["장소담", "소담"], ["전성민", "성민"]]);
  it("정답지 두 사람 관계 = 브리프 요약·화면 목록(compat/relations 한 구현, CO5 11 대 15)", () => {
    const rows = [...sheet.pair!.relations, ...sheet.pair!.stemClashes];
    expect(rows.length).toBe(brief.compatibility!.relationsSummary!.names.length);
    expect(rows.length).toBe(12);
    expect(brief.compatibility!.relationsSummary!.line).toContain(`모두 ${rows.length}가지`);
    // 삼형은 한 줄(세 글자), 그 안의 두 글자 형은 맞는 말로 읽는다.
    for (const r of rows.filter(x => x.kind === "HYEONG" && x.subtype === "삼형")) expect(new Set(r.members.map(m => m.char)).size).toBeGreaterThanOrEqual(2);
  });
  it("개수 말이 정답지와 다르면 fact_count, 같으면 통과, 일부를 가리키는 말은 보지 않는다", () => {
    expect(factCheck("두 사람 사이에서 찾은 관계는 모두 15가지예요.", ctx)?.rule).toBe("fact_count");
    expect(factCheck("두 사람 사이에서 찾은 관계는 모두 12가지예요.", ctx)).toBeNull();
    expect(factCheck("두 사람 사이에는 합 6가지가 있어 서로 끌어당겨요.", ctx)).toBeNull();
    expect(factCheck("두 사람 사이에는 합이 다섯 가지 있어요.", ctx)).toMatchObject({ rule: "fact_count" });
    expect(factCheck("두 사람 사이의 관계 가운데 영향이 큰 세 가지를 먼저 볼게요.", ctx)).toBeNull();
    expect(factCheck("서로 끌어당기는 힘이 커요.", ctx)).toBeNull();
  });
  it("한 사람 책은 원국 관계 수와 견준다(때 낱말 문장은 보지 않는다)", () => {
    const one = { product: "saju_mbti_full" as const, baseDate: BASE, person: SODAM };
    const s1 = buildFactSheet(one, buildBrief(one, k), k), c1 = factCtxOf(s1, k, [["장소담", "소담"]]);
    const n = s1.people[0].relations.length + s1.people[0].stemClashes.length;
    expect(factCheck(`타고난 글자 사이에 관계가 ${n + 3}가지 엮여 있어요.`, c1)?.rule).toBe("fact_count");
    expect(factCheck(`타고난 글자 사이에 관계가 ${n}가지 엮여 있어요.`, c1)?.rule).not.toBe("fact_count");
    expect(factCheck(`올해는 관계가 ${n + 3}가지 엮여 있어요.`, c1)?.rule).not.toBe("fact_count");
  });
});

describe("W3 P3 6절 수리 뒤 결정론 재검", () => {
  const C = (n: number, sections: string[][]): FinalChapter => ch(n, sections);
  const applied = (at: string, before: string, after: string): AppliedRepair => ({ id: 1, kind: "sentence", at, before, after, source: ["lint"] });
  const text = (cs: readonly FinalChapter[]) => cs.flatMap(c => c.sections.flatMap(s => s.paragraphs)).join(" ");
  it("수리 문장이 다른 장 문장과 같으면 원문으로 되돌린다(repair_duplicate_book)", () => {
    const other = "서운한 일이 생기면 그날이 가기 전에 짧게 말해 두세요.";
    const cs = [C(1, [[`첫 장 문장이에요. ${other}`]]), C(2, [[`둘째 장 앞 문장이에요. ${other} 끝 문장이에요.`]])];
    const r = revertRepairRegressions(cs, [applied("2.0.0", "원래는 다른 말이었어요.", other)], { flags: [], names: [] });
    expect(r.reverted.map(x => x.rule.split(":")[0])).toEqual(["repair_duplicate_book"]);
    expect(text(r.chapters)).toContain("원래는 다른 말이었어요.");
  });
  it("근거 낱말(관계·십성·신살 이름)을 잃은 수리는 되돌린다 — 그 사실을 고치라는 깃발이면 봐준다", () => {
    const before = "일지와 월지의 축미충이 정관의 틀을 흔들어요.", after = "두 글자가 부딪쳐 틀이 흔들려요.";
    const cs = [C(1, [[`앞 문장이에요. ${after}`]])];
    const r = revertRepairRegressions(cs, [applied("1.0.0", before, after)], { flags: [], names: ["축미충", "도화살"] });
    expect(r.reverted.map(x => x.rule.split(":")[0])).toEqual(["repair_fact_lost"]);
    expect(r.reverted[0].rule).toMatch(/rel:축미충/); expect(r.reverted[0].rule).toMatch(/tg:정관/);
    expect(lostFactTokens(before, after, ["축미충"], new Set(["rel", "tg"]))).toEqual([]);
    const flag: LintFlag = { chapter: 1, section: 0, paragraph: 0, rule: "fact_relation", sentence: before, hint: "" };
    const ok = revertRepairRegressions(cs, [applied("1.0.0", before, "두 글자가 부딪쳐 정관의 틀이 흔들려요.")], { flags: [flag], names: ["축미충"] });
    expect(ok.reverted).toEqual([]);
  });
  it("예고만 남긴 수리는 되돌린다(repair_empty_preview)", () => {
    const cs = [C(1, [["앞 문장이에요. 다음 두 가지를 볼게요."]])];
    const r = revertRepairRegressions(cs, [applied("1.0.0", "먼저 쉬는 시간을 정해 두면 좋아요.", "다음 두 가지를 볼게요.")], { flags: [], names: [] });
    expect(r.reverted.map(x => x.rule)).toEqual(["repair_empty_preview"]);
  });
  it("지운 문장이 앞 수사 물음의 답이면 물음도 함께 지운다(AM cut.ts ASKS), 넓힌 LEANS는 뒤 문장을 함께 지운다", () => {
    const cs = [C(1, [["이 기운이 낯설죠? 내 힘의 세기는 신강이라서예요. 남는 문장이 하나 있어요.", "둘째 문단이에요."]])];
    const flags: LintFlag[] = [{ chapter: 1, section: 0, paragraph: 0, rule: "grade_leak", sentence: "내 힘의 세기는 신강이라서예요.", hint: "" }];
    const d = deleteFlagged(cs, flags, HARD_RULES);
    expect(d.chapters[0].sections[0].paragraphs[0]).toBe("남는 문장이 하나 있어요.");
    expect(d.deleted.map(x => x.rule).sort()).toEqual(["grade_leak", "grade_leak:question"]);
    const cs2 = [C(1, [["앞 문장이에요. 내 힘의 세기는 신강이에요. 그렇다면 이 힘을 어디에 쓸까요. 마지막 문장이에요.", "둘째 문단이에요."]])];
    const d2 = deleteFlagged(cs2, [{ ...flags[0], sentence: "내 힘의 세기는 신강이에요." }], HARD_RULES);
    expect(d2.chapters[0].sections[0].paragraphs[0]).toBe("앞 문장이에요. 마지막 문장이에요.");
  });
  it("표지 숫자·간지: 한글 숫자 연차, 입력과 다른 나이, 이 사람에게 없는 간지는 hard", () => {
    const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
    const b = buildBrief({ product: "love_marriage_child", baseDate: "2026-11-04", person: { name: "장소담", gender: "FEMALE", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, mbtiType: "INTP", context: { relationshipStatus: "dating", jobStatus: "self_employed", detailJob: "카페 사장" } } }, k);
    expect(coverNumberIssue("사 년째 같은 자리를 지키는 등불", b)).toMatch(/연차/);
    expect(coverNumberIssue(`${b.person.age + 3}살 봄에 켜지는 작은 등불`, b)).toMatch(/나이/);
    const own = b.chart.pillars.day.hangul, foreign = ["갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유"].find(g => ![b.chart.pillars.year.hangul, b.chart.pillars.month.hangul, own, b.chart.pillars.hour?.hangul, b.chart.thisYear.ganji.hangul, b.chart.currentDayun?.ganji.hangul].includes(g))!;
    expect(coverNumberIssue(`조용히 타오르는 등불 하나 ${foreign}`, b)).toMatch(/간지/);
    expect(coverNumberIssue(`조용히 타오르는 ${own}일주의 등불`, b)).toBeNull();
    expect(coverNumberIssue("갑자기 켜지는 작은 등불 하나", b)).toBeNull();
  });
  it("검수를 건너뛰어도(budget) 결정론 HARD 검사·지우기는 돈다", async () => {
    const policyAt = "2026-10-27T03:00:00.000Z";
    const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload");
    const { text: t0 } = mockTextFor(n.value, policyAt);
    const anchor = "이 모습은 하루아침에 생긴 것이 아니라 오래 다듬어진 결입니다 2(1).";
    expect(t0).toContain(anchor);
    const t1 = t0.replace(anchor, `${anchor} 내 힘의 세기는 신강이에요.`);
    const { deps } = llmDeps([{ text: t1 }]);
    const built = await buildV5Snapshot({ payload: n.value, reportId: "report_w3p3checks000001", policyAt, sink: memorySink() as never, deps: { ...deps, costCapUsd: 10 } as never });
    const review = built.meta.review as { skipped: string | null; repair: { skipped: string | null }; deleted: { rule: string }[] };
    expect(review.skipped).toBe("budget");
    expect(review.repair.skipped).toBe("budget");
    expect(review.deleted.some(d => d.rule === "grade_leak")).toBe(true);
    const body = JSON.stringify(built.snapshot.draft.chapters);
    expect(body).not.toContain("세기는 신강");
    expect(body).toContain("다듬어진 결입니다");
  }, 180_000);
});
