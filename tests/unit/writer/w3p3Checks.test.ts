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
import { concreteScene, evidenceUsed, infoMetrics, lifeScene, nameTokens, plainName, sameSentence, unbackedScene, type InfoCard } from "@/lib/writer/safety/info";
import { HARD_RULES, HINT, lintBook, type LintCtx } from "@/lib/writer/safety/p6c";
import { productEvidence, plainTraitName, writerCard } from "@/lib/brief/cards/design";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { styleFlags } from "@/lib/writer/safety/style";
import type { FinalChapter } from "@/lib/writer/safety";
import type { LintFlag } from "@/lib/writer/safety/p6c";
import { deleteFlagged, lostFactTokens, repairItems, revertRepairRegressions, type AppliedRepair } from "@/lib/writer/repair3";
import { buildV5Snapshot, coverNumberIssue, lintContext } from "@/lib/writer/publish";
import { designCardIds, guardReview, REVIEW_DEFAULT_VERSION, REVIEW_SYSTEM, REVIEW_SYSTEM_CARD, REVIEW_VERSION, REVIEW_VERSION_CARD, reviewPrompt } from "@/lib/writer/review";
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
    // W4: 같은 문장을 정답지 강약 대조(fact_strength)가 먼저 잡을 수 있다 — 어느 HARD로든 지워지면 된다.
    expect(review.deleted.some(d => d.rule === "grade_leak" || d.rule === "fact_strength")).toBe(true);
    const body = JSON.stringify(built.snapshot.draft.chapters);
    expect(body).not.toContain("세기는 신강");
    expect(body).toContain("다듬어진 결입니다");
    // 7절: 정보량 지표는 Book 메타에 기록만(본문은 지표 계산 전후 같다).
    const info = (built.meta.safety as { metrics?: { info?: { version: string; sentences: number } } }).metrics?.info;
    expect(info?.version).toBe("info-v4"); expect(info!.sentences).toBeGreaterThan(50);
  }, 180_000);
});

describe("W3 P3 0.6·6절 설계 카드 검수 변형(선택, 기본은 review-v4)", () => {
  const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
  const input = { product: "saju_mbti_full" as const, baseDate: "2026-11-04", person: { name: "장소담", gender: "FEMALE" as const, birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, mbtiType: "INTP" as const } };
  const brief = buildBrief(input, k), sheet = buildFactSheet(input, brief, k);
  const chapters = [ch(1, [["첫 문장은 근거로 엽니다. 둘째 문장은 장면이에요."]])];
  const summary = "card:1.0 | 근거: 편인(일지) | 연결: 공통 introspection | 장면: 없음 | 팩폭: 없음 | 처방: 하루 두기";
  it("기본(v4)은 지침·입력이 그대로다(설계 요약을 넣어도 v4에는 안 들어간다)", () => {
    const a = reviewPrompt({ brief, sheet, k, chapters, cover: "표지" }), b = reviewPrompt({ brief, sheet, k, chapters, cover: "표지", reviewDesignSummary: summary });
    expect(REVIEW_DEFAULT_VERSION).toBe(REVIEW_VERSION);
    expect(a.system).toBe(REVIEW_SYSTEM); expect(a.version).toBe("review-v4");
    expect(b.user).toBe(a.user); expect(a.user).not.toContain("설계 카드");
  });
  it("review-v6-card: 카드 지침 + 「설계 카드(design)」 칸(DB 뜻풀이 다음·책 앞), card id만 F 근거로 받는다", () => {
    const p = reviewPrompt({ brief, sheet, k, chapters, cover: "표지", version: REVIEW_VERSION_CARD, reviewDesignSummary: summary });
    expect(p.system).toBe(REVIEW_SYSTEM_CARD); expect(p.version).toBe("review-v6-card");
    expect(p.user).toContain("검수 판: review-v6-card");
    const at = p.user.indexOf("설계 카드(design):\n" + summary);
    expect(at).toBeGreaterThan(p.user.indexOf("DB 뜻풀이:")); expect(at).toBeLessThan(p.user.indexOf("책:\n"));
    expect(p.ids.has("card:1.0")).toBe(true);
    const n = p.numbered.find(x => x.text.startsWith("둘째"))!.n;
    const issues = (ref: string, cat = "F", field = "") => JSON.stringify({ issues: [{ cat, s: n, quote: "둘째 문장은 장면이에요", why: "카드에 장면이 없는데 생활 장면을 단정", ref, s2: 0, field, fix: "" }] });
    expect(guardReview(issues("card:1.0"), p.numbered, p.ids)?.kept).toHaveLength(1);
    expect(guardReview(issues("card:9.9"), p.numbered, p.ids)?.dropped[0]?.reason).toBe("F_without_ref");
    expect(guardReview(issues("", "I", "card.scene"), p.numbered, p.ids)?.kept).toHaveLength(1);
    const v4 = reviewPrompt({ brief, sheet, k, chapters, cover: "표지" });
    expect(guardReview(issues("card:1.0"), v4.numbered, v4.ids)?.dropped[0]?.reason).toBe("F_without_ref");
    expect(guardReview(issues("", "I", "card.scene"), v4.numbered, v4.ids)?.dropped[0]?.reason).toBe("I_without_field");
    expect(designCardIds(`${summary}\ncard:2.1 | 근거: 정관(월간)`)).toEqual(["card:1.0", "card:2.1"]);
  });
});

describe("W3 P3 7절 정보량 지표(info.ts)", () => {
  const book = (chs: { n: number; sections: string[][] }[]) => chs.map(c => ({ n: c.n, source: "writer", sections: c.sections.map((ps, i) => ({ heading: `소제목 ${c.n}.${i}`, paragraphs: ps })) }));
  const dup = "서운한 일이 생기면 그날이 가기 전에 짧게 말해 두는 게 당신에게 맞아요.";
  const chapters = book([
    { n: 1, sections: [["당신의 일지에 편인이 있어 혼자 깊이 파고들어요. 택배 도착 알림이 오면 상자부터 열어 보는 편이죠.", `${dup} 내 힘의 세기는 신강이에요.`]] },
    { n: 2, sections: [[`월간의 정관이 규칙을 잡아 줘요. ${dup} 생각을 적어 두세요.`], ["당신은 결국 혼자 길을 내는 사람이에요. 오늘 할 일을 목록으로 적어 두세요."]] },
    { n: 3, sections: [["시동이 걸리면 남들 한 달 치를 몰아서 해요. 해야 할 일을 메모장에 적어 두세요.", "느긋함은 게으름이 아니라 나만의 속도예요."]] },
    { n: 4, sections: [["한 번 시동이 걸리면 남들 한 달 치를 끝내는 편이에요. 저녁 산책길 카페에 들러 노트북을 여는 날이 많죠. 떠오른 생각은 노트에 적어 두세요."]] },
  ]);
  const dict = { traits: ["편인", "정관"], names: ["INTP"], scenes: ["저녁 산책길에 카페에 들러 노트북을 여는 날이 많다"] };
  const m = infoMetrics(chapters, { dict });
  it("같은 문장·장 사이 같은 구절·처방 계열·재진술·교훈문·노출을 센다", () => {
    expect(m.version).toBe("info-v4"); expect(m.cards).toBe(false);
    expect(m.totals.sameSentence).toBe(1);
    expect(m.totals.phraseRepeat).toBeGreaterThanOrEqual(1); // 「시동이 걸리면 남들」
    expect(m.rxFamilies["적기·목록"]).toBe(4); expect(m.totals.rxRepeat).toBe(2); expect(m.totals.rxFamilies3).toBe(1);
    expect(m.totals.restatements).toBe(1);
    expect(m.totals.lessons).toBe(1);
    expect(m.totals.exposureGrade).toBe(1); expect(m.totals.exposureRule).toBe(0);
    expect(m.hits).toBeUndefined();
  });
  it("근거 없는 생활 장면: 씨앗과 겹치면 근거 있음, 소품만 있는 장면은 근거 없음(첫 문장·MBTI 따로)", () => {
    expect(m.totals.scenes).toBe(2);
    expect(m.totals.sceneUnbacked).toBe(1); // 택배 알림(씨앗 없음) · 카페 노트북은 씨앗과 겹침
    expect(lifeScene("택배 도착 알림이 오면 상자부터 열어 보는 편이죠.")).toEqual(["택배", "상자", "알림"]);
    expect(lifeScene("택배가 오면 상자부터 열어 보세요.")).toBeNull(); // 권유
    expect(lifeScene("주말에 쉬게 된다면 카페에 가 보는 편이에요.")).toBeNull(); // 가정
    const first = infoMetrics(book([{ n: 1, sections: [["INTP답게 퇴근길 지하철에서 메시지를 몇 번이고 고쳐 쓰곤 해요. 그다음 문장이에요."]] }]), { dict: { scenes: [] } });
    expect([first.totals.sceneUnbacked, first.totals.sceneFirst, first.totals.sceneMbti, first.totals.sceneAsk]).toEqual([1, 1, 1, 0]);
    // W4(info-v4): 같은 꼴의 물음도 근거 없는 장면으로 센다(sceneAsk는 그 가운데 물음 수).
    const ask = infoMetrics(book([{ n: 1, sections: [["INTP답게 퇴근길 지하철에서 메시지를 몇 번이고 고쳐 쓰지 않나요? 그다음 문장이에요."]] }]), { dict: { scenes: [] } });
    expect([ask.totals.sceneUnbacked, ask.totals.sceneAsk]).toEqual([1, 1]);
  });
  it("근거 사용: 카드 없으면 trait·자리 이름 사전, 카드 있으면 card.evidence·card.scene만", () => {
    const s11 = m.bySection.find(x => x.at === "1.1")!; expect(s11.evidenceUsed).toBe(2); // 일지 · 편인
    const cards = [{ chapter: 1, section: 0, evidence: [{ name: "편인", where: ["일지"] }, { name: "정재" }], scene: { text: "택배 도착 알림이 오면 상자부터 여는 사람" } }];
    const c = infoMetrics(chapters, { dict, cards });
    expect(c.cards).toBe(true);
    expect(c.bySection.find(x => x.at === "1.1")!.evidenceUsed).toBe(1);
    expect(c.bySection.find(x => x.at === "1.1")!.sceneUnbacked).toBe(0); // 카드 장면과 겹침
    expect(c.bySection.find(x => x.at === "4.1")!.sceneUnbacked).toBe(1); // 카드 장면이 없는 절은 씨앗이 있어도 근거 없음
  });
  it("detail은 문장마다 걸린 지표를 준다(평가 도구용), 같은 문장 기준은 수리 재검과 같다", () => {
    const d = infoMetrics(chapters, { dict, detail: true });
    expect(d.hits!.filter(h => h.kinds.includes("sameSentence"))).toHaveLength(2);
    expect(sameSentence(dup, dup.replace("짧게", "짧게라도"))).toBe(true);
    expect(sameSentence("짧은 문장이에요.", "짧은 문장이에요.")).toBe(false); // 14자 미만
  });
});

describe("W3 P3 보강 1 — 카드에 없는 구체 장면(concreteScene · scene_unbacked)", () => {
  it("버릇·조건 꼴의 구체 장면 단정을 잡는다(장소·기기·앱·물건·사건)", () => {
    for (const x of [
      "새 동네로 이사 가면 단골 가게 사장님과 어느새 인사하는 사이가 되어 있어요.",
      "단톡방에 누가 고민을 올리면 이미 통화 버튼을 누르고 있어요.",
      "이어폰을 끼고 아무 일정 없는 두 시간이 있어야 다음 날 다시 사람을 만날 수 있어요.",
      "가까운 사람의 일이 터지면 당신은 말보다 전화부터 겁니다.",
      "쉬는 날에도 냉장고 정리로 오후를 보내는 편이에요.",
    ]) expect(concreteScene(x), x).toMatchObject({ ask: false });
    expect(concreteScene("단톡방에 누가 고민을 올리면 이미 통화 버튼을 누르고 있어요.")!.nouns).toEqual(["단톡방", "통화 버튼"]);
  });
  it("권유·물음·드러낸 가정·비유·관용구·구체 낱말 없는 성향 문장·꼴 없는 일반 문장은 단정으로 잡지 않는다", () => {
    for (const x of [
      "퇴근길에는 이어폰을 빼고 십 분만 걸어 보세요.", // 권유
      "한 주에 한 번은 약속 없는 저녁을 달력에 비워 두면 덜 지쳐요.", // 권유의 결과
      "연인이 생긴다면 주말마다 카페 데이트 코스를 짜는 편이에요.", // 드러낸 가정
      "예를 들어 맛집에서 음식 사진을 찍는 장면을 볼게요.", // 예로 세운 장면
      "당신은 빗속에서도 꺼지지 않는 캠핑 랜턴 같은 사람입니다.", // 비유
      "시동이 걸리면 남들 한 달 치 일을 일주일에 해냅니다.", // 관용구
      "새로운 사람을 만나면 먼저 말을 거는 편이에요.", // 구체 낱말 없음
      "책상 위에서만 오래 도는 일은 기운이 빨리 빠집니다.", // 꼴 없는 일반 문장
      "데이트를 주도하는 쪽이 됩니다.", // 흔한 배경 낱말 + 성향 꼴
    ]) expect(lifeScene(x), x).toBeNull();
    expect(concreteScene("택배 알림이 오면 상자부터 여는 편이죠?")).toMatchObject({ ask: true }); // 물음은 ask(지표만)
  });
  const card = (section: number, scene: string | null, text: string[] = []): InfoCard => ({ chapter: 1, section, evidence: [{ name: "편재", where: ["연간"] }], scene: scene ? { text: scene } : null, text });
  it("그 절 카드 장면을 고쳐 쓴 문장·카드 글(사실·뜻)·입력 직업 장면에 낱말이 있는 문장은 근거 있음", () => {
    const s = "새 동네로 이사 가면 단골 가게 사장님과 어느새 인사하는 사이가 되어 있어요.";
    expect(unbackedScene(s, card(0, null))).toEqual(["동네", "이사", "단골", "가게"]);
    expect(unbackedScene(s, card(0, "새 동네로 이사 오면 단골 미용실·세탁소 주인과 금세 친해진다."))).toBeNull(); // 낱말 절반 이상이 카드 장면에
    expect(unbackedScene("쉬는 날에도 냉장고 정리로 오후를 보내는 편이에요.", card(0, null, ["주말에 냉장고 정리하기"]))).toBeNull();
    expect(unbackedScene("회의실에 먼저 들어가 자리를 정리하는 편이에요.", card(0, null), ["회의실 세팅"])).toBeNull();
    // W4 Q2-4: 근거 없는 구체 장면은 물음 꼴이어도 잡는다(W3 P4 — 「헬스장에서 무게를 올리며 …죠?」).
    expect(unbackedScene("택배 알림이 오면 상자부터 여는 편이죠?", card(0, null))).toEqual(["택배", "상자", "알림"]);
    expect(unbackedScene("사람이 많은 곳에서 먼저 말을 거는 편이죠?", card(0, null))).toBeNull(); // 구체 낱말 없는 성향 물음은 허용
  });
  it("지식 DB·관계 장면(ask)은 물음 재료: 그 장면을 단정하면 근거 없음, 물음은 허용 · 작가 카드에 ask, 씨앗은 그대로 장면", () => {
    const s = "새 동네로 이사 가면 단골 가게 사장님과 어느새 인사하는 사이가 되어 있어요.", kb = "새 동네로 이사 오면 단골 미용실·세탁소 주인과 금세 친해진다.";
    const ask: InfoCard = { chapter: 1, section: 0, evidence: [{ name: "편재", where: ["연간"] }], scene: { text: kb, ask: true }, text: [] };
    expect(unbackedScene(s, ask)).toEqual(["동네", "이사", "단골", "가게"]);
    // W4 Q2-1: 지식 DB 장면은 작가에게 보내지 않으므로 물음으로 써도 근거 없음.
    expect(unbackedScene("새 동네로 이사 가면 단골 가게 사장님과 금세 친해지는 편이죠?", ask)).toEqual(["동네", "이사", "단골", "가게"]);
    const base = { q: "q", evidence: [], link: null, punch: null, rx: null };
    expect(writerCard({ ...base, scene: { text: kb, from: "knowledge" } }, new Map()).scene).toEqual({ text: kb, ask: true });
    expect(writerCard({ ...base, scene: { text: kb, from: "relation", who: "A / B" } }, new Map()).scene).toMatchObject({ ask: true });
    expect(writerCard({ ...base, scene: { text: kb, from: "seed" } }, new Map()).scene).toEqual({ text: kb });
  });
  const ctx: LintCtx = {
    facts: { birthTimeKnown: true, mbti: "ISTP", relationship: "single", children: "unknown", job: "employee" }, jobDetail: "", schoolStage: "none", coreImage: "봄 숲의 새 철길",
    nicknames: [], corpus: new Set(), prior: [], jobProps: [], noJobChapters: new Set(), parentingChapters: new Set(), monthChapters: new Set(), compat: false, mbtiPlain: {},
    sceneCards: [card(0, null, ["사람이 모이는 자리를 먼저 알아본다"]), card(1, "단톡방 대화는 읽기만 하다가 누가 차 시동이 안 걸린다고 올리면 바로 전화를 겁니다.")], sceneProps: [],
  };
  const scenes = [ch(1, [["연간의 편재는 사람이 모이는 자리를 먼저 알아봐요. 새 동네로 이사 가면 단골 가게 사장님과 어느새 인사하는 사이가 되어 있어요. 사람이 많은 곳에서 먼저 말을 거는 편이죠?"], ["단톡방에 누가 차 시동이 안 걸린다고 올리면 당신은 이미 전화를 걸고 있어요."]])];
  it("4종 카드 책: 카드에 없는 구체 장면 단정만 SOFT scene_unbacked(물음·카드 장면 문장은 아님), 수리 힌트는 지우지 말고 근거에 묶인 성향 물음으로", () => {
    const f = lintBook(scenes, ctx).filter(x => x.rule === "scene_unbacked");
    expect(f.map(x => `${x.chapter}.${x.section}.${x.paragraph}:${x.detail}`)).toEqual(["1.0.0:동네·이사·단골·가게"]);
    expect(HARD_RULES.has("scene_unbacked")).toBe(false);
    expect(HINT.scene_unbacked).toMatch(/구체 소품을 빼고/); expect(HINT.scene_unbacked).toMatch(/물음은 장마다 하나/);
    expect(lintBook(scenes, { ...ctx, sceneCards: undefined }).some(x => x.rule === "scene_unbacked")).toBe(false); // 카드 없는 책(세운·대운·옛 책)은 걸지 않는다
  });
  it("수리 항목: 문체 깃발 가운데 scene_unbacked를 먼저 넣는다(40칸 상한 앞자리), 장면 숫자를 빼는 수리는 되돌리지 않는다", () => {
    const scene = lintBook(scenes, ctx).find(x => x.rule === "scene_unbacked")!;
    const style: LintFlag = { chapter: 1, section: 1, paragraph: 0, rule: "start_repeat", sentence: "단톡방에 누가 차 시동이 안 걸린다고 올리면 당신은 이미 전화를 걸고 있어요.", hint: "같은 시작" };
    const items = repairItems({ chapters: scenes, flags: [style, scene], issues: [], numbered: [] });
    expect(items[0].problems[0]).toContain(HINT.scene_unbacked.slice(0, 20));
    const before = "택배 3개가 한꺼번에 오면 상자부터 다 뜯어 보는 편이에요.", after = "새 물건이 오면 바로 열어 보고 싶은 편이죠?";
    const cs = [ch(1, [[`앞 문장이에요. ${after}`]])], a: AppliedRepair = { id: 1, kind: "sentence", at: "1.0.0", before, after, source: ["lint"] };
    const flag: LintFlag = { chapter: 1, section: 0, paragraph: 0, rule: "scene_unbacked", sentence: before, hint: "" };
    expect(revertRepairRegressions(cs, [a], { flags: [flag], names: [] }).reverted).toEqual([]);
    expect(revertRepairRegressions(cs, [a], { flags: [], names: [] }).reverted.map(x => x.rule)).toEqual(["repair_fact_lost:num:3개"]);
  });
  it("발행 검사 문맥: 4종 카드 책만 절 카드를 싣는다(세운은 없음)", () => {
    const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
    const P: BriefPersonInput = { name: "가람", gender: "MALE", birthDate: "1993-03-16", birthTime: "10:30", birthTimeUnknown: false, mbtiType: "ENFJ", context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "회계 담당" } };
    const full = buildBrief({ product: "saju_mbti_full", baseDate: "2026-10-27", person: P }, k), annual = buildBrief({ product: "annual_fortune", baseDate: "2026-10-27", selectedYear: 2027, person: P }, k);
    const c1 = lintContext(full, k, buildWriterPrompt(full, { knowledge: k }).chapters, []), c2 = lintContext(annual, k, buildWriterPrompt(annual, { knowledge: k }).chapters, []);
    expect(c1.sceneCards?.length).toBeGreaterThan(30); expect(c1.sceneProps).toContain("회계 담당");
    expect(c2.sceneCards).toBeUndefined();
  });
});

describe("W3 P3 보강 2·3 — 카드 근거 이름 정리·지표 대조", () => {
  it("상품 근거 이름: 한자·괄호 라벨·깨진 조사 없이, 자리표 머리는 사실 줄의 이름으로, 이름이 없으면 맥락 근거", () => {
    expect(productEvidence("charm", ["장성살(將星殺): 자신감 있는 태도", "편재(偏財): 넓은 인맥"], undefined)).toMatchObject({ name: "장성살" });
    expect(productEvidence("dayRelations", ["태어난 날 땅 글자의 卯申원진(태어난 해과): WONJIN"], undefined)).toMatchObject({ name: "묘신 원진", where: "일지" });
    expect(productEvidence("talkRhythm", ["관계 상태: 솔로", "편재(偏財): 바쁠 땐 뜸하다가 한 번에 몰아 연락"], undefined)).toMatchObject({ name: "편재" });
    expect(productEvidence("meetState", ["관계 상태: 솔로", "상황 씨앗: 와인 클래스 옆자리"], undefined)).toMatchObject({ name: "관계 상태", kind: "context" });
    expect(productEvidence("docs", ["2030년 편관(偏官)(관성의 해: 평가·문서가 앞에 오는 경향)"], undefined)).toMatchObject({ name: "2030년 편관", where: "" });
    expect(productEvidence("loveTiming", ["2028년 무신 편재(偏財): 배우자 별 쪽 기운이 들어오는 해"], undefined)).toMatchObject({ name: "2028년 무신 편재" });
    expect(productEvidence("loveEngine", ["배우자 자리(태어난 날의 땅 글자)에는 쇠 기운의 글자가 앉아 있습니다. 그 속 기운은 편관이고, 결단하는 힘을 뜻합니다."], undefined)).toMatchObject({ name: "편관", where: "일지" });
    expect(productEvidence("childStar", ["자녀 별로 보는 기운(편관·정관)이 태어난 달·태어난 날 자리에 두 번 보입니다."], undefined)).toMatchObject({ name: "편관·정관" });
    expect(productEvidence("money", ["값을 받는 힘(재성) 강: 고정 수입과 기회 수입을 함께 굴리는 쪽"], undefined).name).not.toMatch(/ 강$/); // 판정 등급어는 뜻 말로
    expect(plainTraitName("원진살(怨嗔殺) 묘신 원진")).toBe("묘신 원진"); expect(plainTraitName("해(害) 신해해")).toBe("신해해"); expect(plainTraitName("삼합 인오술 화국")).toBe("삼합 인오술 화국");
  });
  it("작가 카드: 맥락 근거는 이름을 보내지 않는다(사실 줄·쓰는 법만)", () => {
    const w = writerCard({ q: "q", evidence: [{ name: "관계 상태", where: "", facts: ["관계 상태: 솔로"], kind: "context" }, { name: "편재", where: "", facts: ["편재: 넓은 인맥"] }], link: null, scene: null, punch: null, rx: null }, new Map());
    expect(w.evidence).toEqual([{ facts: ["관계 상태: 솔로"] }, { name: "편재", facts: ["편재: 넓은 인맥"] }]);
  });
  it("가상 인물 4종 브리프: 카드 근거 이름에 한자·괄호·영문 코드·「해과」가 없고, 일지 관계 사실 줄도 한글 간지·맞는 조사", () => {
    const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
    const P: BriefPersonInput = { name: "가람", gender: "MALE", birthDate: "1993-03-16", birthTime: "10:30", birthTimeUnknown: false, mbtiType: "ENFJ", context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "" } };
    for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child"] as const) {
      const b = buildBrief({ product, baseDate: "2026-10-27", person: P }, k);
      for (const e of b.chapters.flatMap(c => (c.sections ?? []).flatMap(s => s.card?.evidence ?? []))) expect(e.name, `${product} ${e.name}`).not.toMatch(/[一-鿿()]|[A-Z]{5,}|해과/);
      if (product === "love_marriage_child") {
        const rel = b.chapters.flatMap(c => (c.sections ?? []).flatMap(s => s.materials)).flatMap(m => (m.kind === "evidence" && m.key === "dayRelations" ? m.facts : []));
        expect(rel.join(" ")).toMatch(/묘신 원진\(태어난 달과\)/); expect(rel.join(" ")).not.toMatch(/WONJIN|[卯申]|해과/);
      }
    }
  });
  it("지표 근거 대조: 한자·괄호 라벨을 뗀 이름, 핵심 낱말(원진·묘신, 장성), 사실 낱말 — 맥락 근거는 이름표가 아니라 사실 낱말, 넓은 자리(두 사람)는 세지 않는다", () => {
    expect(plainName("태어난 날 땅 글자의 卯申원진(태어난 해과)")).toBe("태어난 날 땅 글자의 묘신 원진");
    expect(nameTokens("원진살 묘신 원진")).toEqual(expect.arrayContaining(["원진살", "원진", "묘신"]));
    expect(nameTokens("최지우님의 신해해")).toEqual(["신해해"]);
    expect(nameTokens("토 많음")).toEqual(expect.arrayContaining(["흙 기운", "토 기운"]));
    expect(evidenceUsed("연지와 일지 사이의 원진이 엇박자를 만들어요.", { name: "원진살 묘신 원진" })).toBe(true);
    expect(evidenceUsed("당당한 장성의 기운이 첫인상을 만들어요.", { name: "장성살(將星殺)" })).toBe(true);
    expect(evidenceUsed("흙의 기운이 가장 셉니다.", { name: "토 많음", where: ["원국 전체"] })).toBe(true);
    expect(evidenceUsed("넓은 인맥을 가진 편재의 쪽이에요.", { name: "호감 표현", facts: ["호감 표현: 편재 쪽은 마음이 가면 통 크게 표현"] })).toBe(true);
    expect(evidenceUsed("지금은 솔로라서 새 만남이 열려 있어요.", { name: "관계 상태", facts: ["관계 상태: 솔로"], context: true })).toBe(true);
    expect(evidenceUsed("관계 상태를 먼저 봐요.", { name: "관계 상태", facts: ["관계 상태: 솔로"], context: true })).toBe(false);
    expect(evidenceUsed("두 사람의 궁합은 좋아요.", { name: "궁합 점수", where: ["두 사람"] })).toBe(false);
  });
});
