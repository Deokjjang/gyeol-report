import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput } from "@/lib/brief";
import { estimateTokens } from "@/lib/brief/size";
import { COMPATIBILITY_CATEGORIES } from "@/data/knowledge-v5/schema";
import { assembleV5Book, createV5Snapshot, projectV5Book, validateV5Publication } from "@/lib/writer/book";
import { completedChapters, parseChapters } from "@/lib/writer/format";
import { buildWriterPrompt, WRITER_PREFIX, writerChapters } from "@/lib/writer/prompt";
import { STYLE_EXAMPLES } from "@/lib/writer/prompt/examples";
import { WRITER_SYSTEM } from "@/lib/writer/prompt/system";
import { applySafetyNet, isPastAssertion, OLD_NEGATIVE, sentenceViolation, splitSentences, type SafetyFacts } from "@/lib/writer/safety";

const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const haram = { name: "하람", gender: "MALE" as const, birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, mbtiType: "ENTJ" as const, context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자" } };
const seoyun = { name: "서윤", gender: "FEMALE" as const, birthDate: "1989-03-21", birthTime: "", birthTimeUnknown: true, mbtiType: "INFP" as const, context: { relationshipStatus: "dating", jobStatus: "freelancer", detailJob: "일러스트레이터" } };
const minjun = { name: "민준", gender: "MALE" as const, birthDate: "1978-07-15", birthTime: "22:10", birthTimeUnknown: false, mbtiType: "" as const };
const inputs: [string, BriefInput][] = [
  ...(["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune"] as const).flatMap(product => [
    [`${product} 정시`, { product, baseDate: "2026-10-27", selectedYear: 2026, person: haram }] as [string, BriefInput],
    [`${product} 시간 미상`, { product, baseDate: "2026-10-27", selectedYear: 2026, person: seoyun }] as [string, BriefInput],
  ]),
  [`saju_mbti_full MBTI 없음`, { product: "saju_mbti_full", baseDate: "2026-10-27", person: minjun }],
  ...COMPATIBILITY_CATEGORIES.map(rel => [`궁합 ${rel}`, { product: "saju_mbti_compatibility", baseDate: "2026-10-27", relationshipType: rel, person: haram, partner: rel === "parentChild" ? minjun : seoyun }] as [string, BriefInput]),
];

describe("작가 지침(B)", () => {
  it("시스템 지침 1,500토큰 이하, 출력 형식·금지·브리프 읽는 법 포함", () => {
    expect(estimateTokens(WRITER_SYSTEM)).toBeLessThanOrEqual(1500);
    for (const s of ["## N. 장 제목", "### 소제목", "### {key}", "15자 이상", "forbiddenFacts", "materials"]) expect(WRITER_SYSTEM).toContain(s);
    expect(WRITER_PREFIX.startsWith(WRITER_SYSTEM)).toBe(true);
  });
  it("문체 예시 2개는 A-3 규칙을 지킨다(옛 부정 낱말·과거 단정 없음, 용어는 쉬운 말 다음 괄호)", () => {
    expect(STYLE_EXAMPLES).toHaveLength(2);
    for (const e of STYLE_EXAMPLES) for (const s of splitSentences(e.text)) { expect(OLD_NEGATIVE.test(s), s).toBe(false); expect(isPastAssertion(s), s).toBe(false); }
    expect(STYLE_EXAMPLES[1].text).toContain("매력(홍염살)");
    // P3.5 A3: 시험 고객(c1 丁丑·ENTJ, c2 庚辰·INFP, X 丁丑·ISFJ, Y ENFP)과 원국·MBTI가 겹치지 않는 가상 인물
    for (const e of STYLE_EXAMPLES) for (const banned of ["ENTJ", "INFP", "ISFJ", "ENFP", "(정축)", "(경진)", "천문성", "정관"]) expect(e.text.includes(banned), banned).toBe(false);
  });
  it("대운·세운은 반복 장을 keys로 묶는다", () => {
    const major = writerChapters(buildBrief({ product: "major_fortune", baseDate: "2026-10-27", person: haram }, k));
    expect(major).toHaveLength(5); expect(major[2].keys).toHaveLength(14);
    const annual = writerChapters(buildBrief({ product: "annual_fortune", baseDate: "2026-10-27", selectedYear: 2026, person: haram }, k));
    expect(annual).toHaveLength(5); expect(annual[2].keys).toHaveLength(12);
  });
  it("브리프는 사용자 메시지, 내부 값(seed·budget·score)은 빼고 보낸다", () => {
    const p = buildWriterPrompt(buildBrief({ product: "saju_mbti_full", baseDate: "2026-10-27", person: haram }, k));
    expect(p.user).not.toMatch(/"seed"|"budget"|"score"|"featureId"/);
    expect(p.system).not.toContain("하람"); expect(sentenceViolation("[이름]님, 반갑습니다.", { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "none", job: "employed" })).toBe("internal_term");
  });
});

describe("출력 형식 파서", () => {
  it("장·소제목·문단, 스트리밍 중에는 마지막 장을 완성으로 치지 않는다", () => {
    const t = "앞말\n## 1. 첫 장\n### 가\n문단 하나.\n둘째 줄.\n\n문단 둘.\n## 2. 둘째 장\n### 나\n쓰는 중";
    expect(parseChapters(t).map(c => [c.n, c.title, c.sections.length])).toEqual([[1, "첫 장", 1], [2, "둘째 장", 1]]);
    expect(parseChapters(t)[0].sections[0].paragraphs).toEqual(["문단 하나. 둘째 줄.", "문단 둘."]);
    expect(completedChapters(t, false).map(c => c.n)).toEqual([1]);
  });
});

describe("안전망 문장 검사(D)", () => {
  const single: SafetyFacts = { birthTimeKnown: false, mbti: null, relationship: "single", children: "unknown", job: "none" };
  it.each([
    ["2027년에 결혼하게 됩니다.", "date_event"],
    ["반드시 승진합니다.", "date_event"],
    ["남자친구에게 서운한 날이 있습니다.", "fact_partner"],
    ["남편과 장을 보러 갑니다.", "fact_spouse"],
    ["아이가 학교에서 돌아오면 간식을 챙깁니다.", "fact_children"],
    ["팀장님이 당신을 부릅니다.", "fact_job"],
    ["시주에 놓인 기운이 늦게 피어납니다.", "hour_pillar"],
    ["ENTJ다운 결정입니다.", "mbti_absent"],
    ["t3 재료는 브리프에 있습니다.", "internal_term"],
    ["옛날에는 흉으로 읽었지만 괜찮습니다.", "old_negative"],
    ["알림을 다 끄고 소파에 누워 천장만 보는 한 시간이 필요합니다.", "example_copy"],
  ])("%s → %s", (s, rule) => { expect(sentenceViolation(s, single)).toBe(rule); });
  it.each(["함께 살게 되면 배우자와 장을 볼 때 목록부터 씁니다.", "배우자 자리에는 겨울 땅이 놓여 있습니다.", "아이처럼 웃습니다.", "물기둥을 쏟아내는 댐 같은 달입니다.", "올해는 이직을 고민하기 좋은 흐름입니다."])("통과: %s", s => {
    expect(sentenceViolation(s, single)).toBeNull();
  });
});

describe("결정론 작가(E)·Book 연결(F) — 6상품 + 궁합 7유형", () => {
  it.each(inputs)("%s: 결정론 책이 안전망을 위반 0으로 통과하고 기존 렌더러 형식으로 투영된다", (_, input) => {
    const brief = buildBrief(input, k);
    const plan = buildWriterPrompt(brief).chapters;
    const { chapters, report } = applySafetyNet(brief, plan, new Map());
    expect(report.deletions).toEqual([]);
    expect(chapters.every(c => c.source === "deterministic" && c.sections.length > 0)).toBe(true);
    for (const c of chapters.filter(x => x.keys)) expect(c.sections.map(s => s.heading)).toEqual(c.keys);
    const payload = { productKey: input.product } as never;
    const { draft, evidence } = assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: "2026-10-27T03:00:00.000Z", people: [], writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 1, briefHash: "h", knowledgeVersion: "kv", promptVersion: "pv", recovered: false });
    expect(validateV5Publication(input.product, draft, evidence).ok).toBe(true);
    expect(evidence.meta.chapters.every(c => c.evidence.length >= 3 && c.evidence.length <= 5)).toBe(true);
    const data = projectV5Book(createV5Snapshot({ reportId: "report_abcdefghijklmn", createdAtIso: "2026-10-27T03:00:00.000Z", draft, evidence }));
    expect(data).not.toBeNull();
    const kinds = data!.pages.map(p => p.kind);
    expect(kinds[0]).toBe("cover"); expect(kinds).toContain("contents"); expect(kinds.at(-1)).toBe("back");
    if (input.product === "major_fortune") expect(data!.pages.find(p => p.kind === "timeline")).toMatchObject({ years: expect.arrayContaining([expect.objectContaining({ year: 2026 })]) });
    if (input.product === "annual_fortune") expect((data!.pages.find(p => p.kind === "months") as { months: unknown[] }).months).toHaveLength(12);
  }, 30_000);
});
