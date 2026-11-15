// W6 S0·S1(외부 호출 0, 가상 인물 + 합성 문장만): 차단/개선 분류 · 깨진 문장 · 표시 렌더 통합(A1) · 계절·궁합 십성·일주 대조(A2·A3) ·
// 성격 요약표·모순(A4) · 합·충 × MBTI 연결(S1-5) · 개선 규칙 3문장 하한 · S4 직접 읽기에서 찾은 결함 고침.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { gateClassOf, gateKindOf } from "@/lib/writer/gate";
import { markTableFor, personProfileOf, renderWriterBrief } from "@/lib/writer/prompt";
import { newMarkState, placeForms, renderMarks, type Mark } from "@/lib/writer/marks";
import { brokenSentence, dupPhrase, unbalancedAt } from "@/lib/writer/safety/broken";
import { assertedPoles, contradictionFlags, inferiorAsStrength, relationLink, relationLinkAfter, relationLinkFrame } from "@/lib/writer/safety/contradiction";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { INTERNAL_LABEL } from "@/lib/writer/safety/sentences";
import { careerGroupNames } from "@/lib/writer/safety/p6e";
import { personNames } from "@/lib/writer/publish";
import { dropSentences, leadNamesSubject, postRepairTidy } from "@/lib/writer/repairPlan";
import { sentenceViolation } from "@/lib/writer/safety";
import { deleteFlagged } from "@/lib/writer/repair3";
import { HARD_RULES, type LintFlag } from "@/lib/writer/safety/p6c";
import { improveOnly } from "@/lib/writer/repairPlan";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-11-14";
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const compatIn = { product: "saju_mbti_compatibility", baseDate, person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput;
const fullIn: BriefInput = { product: "saju_mbti_full", baseDate, person: person("minjun", "c3", "ESFJ") };
const make = (input: BriefInput) => { const brief = buildBrief(input, k); const sheet = buildFactSheet(input, brief, k); return { brief, sheet, marks: markTableFor(brief, sheet) }; };
const C = make(compatIn), F = make(fullIn);
const mk = (key: string, text: string, extra: Partial<Mark> = {}): [string, Mark] => [key, { key, kind: key.split(":")[0] as Mark["kind"], text, ...extra }];
const ch = (n: number, sections: string[][]) => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer" as const, chars: 0, sections: sections.map((ps, i) => ({ heading: `소제목 ${i}`, paragraphs: ps })) });

describe("S0-1 차단 / 개선", () => {
  it("결정 1의 네 갈래만 차단, 노출·반복·경험 단정은 개선 · 안전망은 세부 규칙으로 가른다", () => {
    expect(gateKindOf("fact_relation")).toBe("fact");
    expect(gateKindOf("pair_profile")).toBe("link");
    expect(gateKindOf("self_contradiction")).toBe("contradiction");
    expect(gateKindOf("broken_sentence")).toBe("broken");
    expect(gateKindOf("safety", "hour_pillar")).toBe("fact");
    expect(gateKindOf("safety", "internal_term")).toBe("broken");
    for (const r of ["grade_leak", "rule_leak", "phrase_repeat", "scene_unbacked", "seed_assert", "question_excess"]) expect(gateClassOf(r)).toBe("improve");
    expect(gateClassOf("safety", "old_negative")).toBe("improve");
    expect(gateClassOf("review_C")).toBe("block");
    expect(gateClassOf("review_F")).toBe("improve");
  });
  it("개선 규칙은 떼고 난 문단이 3문장 이상일 때만 뗀다(차단 규칙은 그대로)", () => {
    const p3 = "첫 문장이에요. 내부 규칙을 말한 문장이에요. 셋째 문장이에요.", p4 = `${p3} 넷째 문장이에요.`;
    const t = (p: string, rule: string, detail?: string) => dropSentences([ch(1, [[p, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "내부 규칙을 말한 문장이에요.", rule, hard: HARD_RULES.has(rule as never), ...(detail ? { detail } : {}) }]);
    expect(t(p3, "rule_leak").chapters[0].sections[0].paragraphs[0]).toBe(p3);
    expect(t(p4, "rule_leak").chapters[0].sections[0].paragraphs[0]).toBe("첫 문장이에요. 셋째 문장이에요. 넷째 문장이에요.");
    expect(t(p3, "broken_sentence").chapters[0].sections[0].paragraphs[0]).toBe("첫 문장이에요. 셋째 문장이에요.");
    const flags = [{ chapter: 1, section: 0, paragraph: 0, rule: "grade_leak", sentence: "내부 규칙을 말한 문장이에요.", hint: "" }] as LintFlag[];
    const d = deleteFlagged([ch(1, [[p3, "다른 문단이에요."]])], flags, HARD_RULES, improveOnly);
    expect(d.chapters[0].sections[0].paragraphs[0]).toBe(p3);
    expect(d.deleted[0].kept).toBe("thin");
  });
});

describe("S0-2 깨진 문장", () => {
  const phrases = ["태어난 날 땅 글자(일지)", "두 사람 모두에게 있는 현침살", "현침살", "을축 대운(정재의 10년)"];
  it("W5 알려진 꼴: 렌더 구절 겹침 · 대운 구절 두 문장 연속 · 신살 주인 겹침 · 괄호 앞 말 되풀이", () => {
    expect(brokenSentence("태어난 날 땅 글자(일지)에 태어난 날 땅 글자(일지)의 절이 있어요.", { phrases })?.kind).toBe("dup_phrase");
    expect(brokenSentence("두 사람 모두에게 있는 현침살처럼 이 기운은 두 사람 모두에게 있습니다.", { phrases })?.kind).toBe("dup_phrase");
    expect(brokenSentence("을축 대운(정재의 10년)은 꾸준한 돈의 흐름입니다.", { phrases, prev: "지금은 을축 대운(정재의 10년)이 들어와 있어요." })?.kind).toBe("render_overlap");
    expect(brokenSentence("지금 대운은 기사(기사 대운(정재의 10년))로 정재의 10년이에요.")?.kind).toBe("render_overlap");
  });
  it("대구·날짜는 되풀이가 아니다 · 말 더듬기 · 조사 겹침 · 조사로 시작 · 소제목 첫 문장 기댐 · 괄호 짝", () => {
    expect(dupPhrase("도윤님에게 모자란 나무 기운을 하린님이 갖고 있고, 하린님에게 모자란 흙 기운은 도윤님이 갖고 있어요.")).toBeNull();
    expect(dupPhrase("같은 말이 한 사람에게는 지나가고 한 사람에게는 남습니다.")).toBeNull();
    expect(dupPhrase("2017년 5월 무렵부터 2027년 5월 무렵까지 이어져요.")).toBeNull();
    expect(dupPhrase("끝까지 해내는 힘이 끝까지 해내는 힘이 있어요.")).not.toBeNull();
    expect(brokenSentence("태어난 날 땅 글자(일지)을를 봐요.")?.kind).toBe("particle");
    expect(brokenSentence("에서 보듯 정화로 달궈질 때 쓸모가 커집니다.")?.kind).toBe("orphan");
    expect(brokenSentence("이건 서운함이 쌓이기 쉬운 구조입니다.", { sectionFirst: true })?.kind).toBe("orphan");
    expect(brokenSentence("이건 서운함이 쌓이기 쉬운 구조입니다.")).toBeNull();
    expect(brokenSentence("안정을 지키는 쪽과 새 시도를 하는 쪽이 만났기 때문입니다.", { sectionFirst: true })?.kind).toBe("orphan");
    expect(brokenSentence("같은 다툼이 되풀이되는 건 서운함이 쌓였다가 터지기 때문이에요.", { sectionFirst: true })).toBeNull();
    expect(unbalancedAt(["앞 문장(괄호가 열렸어요.", "다음 문장이에요."])).toBe(0);
    expect(unbalancedAt(["“괜찮아?", "먼저 갈게.”라고 말해요."])).toBe(-1);
  });
});

describe("S1 A1 표시 렌더 통합", () => {
  const t = new Map([mk("at:t8", "태어난 날 땅 글자(일지)", { short: "이 자리", codes: ["일지"] }), mk("un:now", "기사 대운(정재의 10년)", { short: "이 대운", codes: ["기사 대운"] }), mk("un:next", "무진 대운(편재의 10년)", { short: "다음 대운", codes: ["무진 대운"] }),
    mk("at:t2", "x", { short: "이 세 자리", codes: ["연지", "월간", "시지"], list: "세 자리(태어난 해 땅 글자·태어난 달 하늘 글자·태어난 시각 땅 글자)", later: "세 자리(연지·월간·시지)" })]);
  it("괄호 안 표시는 구절 하나로 · 바로 앞 같은 자리 말 + 「의」는 표시를 뗀다", () => {
    expect(renderMarks("지금 대운은 기사(⟦un:now⟧)로 이어져요.", t)).toBe("지금 대운은 기사 대운(정재의 10년)으로 이어져요.");
    expect(renderMarks("다음은 무진 대운(⟦un:next⟧)으로 넘어가요.", t)).toBe("다음은 무진 대운(편재의 10년)으로 넘어가요.");
    expect(renderMarks("정재(⟦at:t8⟧)가 있어요.", t)).toBe("정재가 있어요.");
    expect(renderMarks("태어난 날 땅 글자(일지)에 ⟦at:t8⟧의 절이 있어요.", t)).toBe("태어난 날 땅 글자(일지)에 절이 있어요.");
  });
  it("같은 문단·바로 앞 문단 끝 문장에 같은 표시가 있으면 짧은 꼴, 자리 셋 이상은 책에서 처음 한 번만 목록", () => {
    expect(renderMarks("지금은 ⟦un:now⟧이 들어와 있어요. ⟦un:now⟧은 꾸준한 돈의 흐름입니다.", t)).toBe("지금은 기사 대운(정재의 10년)이 들어와 있어요. 이 대운은 꾸준한 돈의 흐름입니다.");
    const st = newMarkState();
    expect(renderMarks("편인이 ⟦at:t2⟧에 있어요.", t, st, "1.0")).toBe("편인이 세 자리(태어난 해 땅 글자·태어난 달 하늘 글자·태어난 시각 땅 글자)에 있어요.");
    expect(renderMarks("⟦at:t2⟧의 편인이 깊어요.", t, st, "1.0")).toBe("이 세 자리의 편인이 깊어요.");
    expect(renderMarks("다른 이야기예요.", t, st, "1.0")).toBe("다른 이야기예요.");
    expect(renderMarks("⟦at:t2⟧에 편인이 있어서요.", t, st, "3.1")).toBe("세 자리(연지·월간·시지)에 편인이 있어서요.");
  });
  it("자리 줄이기: 같은 기둥의 하늘·땅 글자는 기둥 하나로, 셋 이상은 목록·칸 이름·짧은 꼴", () => {
    expect(placeForms("태어난 달 하늘 글자(월간) · 태어난 달 땅 글자(월지)").text).toBe("태어난 달 기둥(월주)");
    const f = placeForms("태어난 해 땅 글자(연지) · 태어난 날 땅 글자(일지) · 태어난 시각 땅 글자(시지)");
    expect(f.list).toBe("세 자리(태어난 해 땅 글자·태어난 날 땅 글자·태어난 시각 땅 글자)");
    expect(f.later).toBe("세 자리(연지·일지·시지)");
    expect(f.short).toBe("이 세 자리");
  });
  it("궁합: 일주 이름·서로 보는 십성 표시가 정답지 값으로 표에 있다", () => {
    const a = C.sheet.people[0].pillars.day!.ganjiKo;
    expect(C.marks.get("ju:a")?.text).toContain(`(일주) ${a}`);
    expect(C.marks.get("tg:ab")?.text).toContain(`${C.brief.compatibility!.tenGodAB.tenGod.replace(/\(.*\)/, "")}인`);
    expect(C.marks.get("tg:ba")?.text).toContain(`${C.brief.compatibility!.tenGodBA.tenGod.replace(/\(.*\)/, "")}인`);
    const view = renderWriterBrief(C.brief, { knowledge: k, facts: C.sheet }).marks as { dayPillars?: string[]; views?: string[] };
    expect(view.dayPillars?.length).toBe(2); expect(view.views?.length).toBe(2);
  });
});

describe("S1 A2·A3 계절 · 십성 방향 · 일주를 땅 글자로", () => {
  it("태어난 계절과 다른 계절 주장(「겨울을 앞둔 봄」 꼴)은 fact_season — 맞는 계절·가정 문장은 통과", () => {
    const ctx = factCtxOf(F.sheet, k, personNames(F.brief));
    const real = ({ spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" } as Record<string, string>)[F.sheet.people[0].climate.season];
    const next = ({ 봄: "여름", 여름: "가을", 가을: "겨울", 겨울: "봄" } as Record<string, string>)[real];
    const wrong = ({ 봄: "가을", 여름: "겨울", 가을: "봄", 겨울: "여름" } as Record<string, string>)[real];
    expect(factCheck(`당신은 ${wrong}에 태어난 사람이라 차분해요.`, ctx)?.rule).toBe("fact_season");
    expect(factCheck(`${wrong}을 앞둔 ${real}의 기운이라 서두르지 않아요.`, ctx)?.rule).toBe("fact_season");
    expect(factCheck(`${next}을 앞둔 ${real}의 기운이라 서두르지 않아요.`, ctx)).toBeNull();
    expect(factCheck(`당신은 ${real}에 태어나 기운이 고르게 흘러요.`, ctx)).toBeNull();
    expect(factCheck(`${wrong}생이거나 흙이 받치면 더 단단해져요.`, ctx)).toBeNull();
  });
  it("궁합: 「A님에게 B님은 X」의 방향 · 「X의 눈으로」 · 두 이름 문장의 「일지 갑신」은 가장 가까운 이름으로 주인", () => {
    const ctx = factCtxOf(C.sheet, k, personNames(C.brief));
    const [a, b] = [C.brief.compatibility!.a.callName, C.brief.compatibility!.b.callName];
    const ko = (x: string) => x.replace(/\s?\([^)]*\)/g, "");
    const ab = ko(C.brief.compatibility!.tenGodAB.tenGod), ba = ko(C.brief.compatibility!.tenGodBA.tenGod);
    expect(factCheck(`${a}에게 ${b}은 ${ab} 같은 사람이에요.`, ctx)).toBeNull();
    if (ab !== ba) expect(factCheck(`${a}에게 ${b}은 ${ba} 같은 사람이에요.`, ctx)?.rule).toBe("fact_direction");
    expect(factCheck(`${ab}의 눈으로 보는 사람`, ctx)?.rule).toBe("fact_direction");
    const g = C.sheet.people[0].pillars.day!.ganjiKo;
    expect(factCheck(`${a}의 일지 ${g}에는 쇠 기운이 있어 ${b}이 움츠러들어요.`, ctx)?.rule).toBe("fact_ganji");
  });
});

describe("S1 A4 성격 요약표 · 모순 · S1-5 잘못된 연결", () => {
  it("한 사람 4종 책: 성격 요약표가 작가 브리프 맨 앞에 한 줄 · 궁합은 사람별 성격표 그대로", () => {
    const p = personProfileOf(F.brief, k);
    expect(p?.line).toContain(F.brief.person.callName);
    const view = renderWriterBrief(F.brief, { knowledge: k, facts: F.sheet });
    expect(Object.keys(view)[0]).toBe("profile");
    expect((view.profile as { line: string }).line).toBe(p!.line);
    expect(personProfileOf(C.brief, k)).toBeNull();
  });
  it("같은 사람·같은 차원 반대 끝 단정은 뒤 문장에 · 한 사람 책은 요약표와 반대도 · 조언·가정·대비·같은 절 대비는 아니다", () => {
    const ctx = { compat: false, people: [{ names: ["민준"], label: "민준님", codes: { energy: "E" as const, lead: "front" as const, conflict: "now" as const, express: "말" as const, decide: "fast" as const } }] };
    const s = (chapter: number, section: number, sentence: string) => ({ chapter, section, paragraph: 0, sentence });
    expect(contradictionFlags([s(2, 0, "당신은 모임이 끝나면 오히려 기운이 나는 편이에요.")], ctx)).toHaveLength(0);
    expect(contradictionFlags([s(3, 0, "당신은 약속이 이어지면 지쳐서 혼자 있는 시간이 꼭 필요해요.")], ctx)[0]?.detail).toContain("성격 요약표");
    expect(contradictionFlags([s(2, 0, "당신은 일정표와 준비물을 전날 정리해 두는 편이에요."), s(5, 1, "당신은 그때그때 정하는 편이라 계획이 흔들려요.")], ctx)).toHaveLength(1);
    expect(contradictionFlags([s(2, 0, "당신은 일정표와 준비물을 전날 정리해 두는 편이에요."), s(2, 0, "그런데 ESTP의 결은 그때그때 정하는 쪽이에요.")], ctx)).toHaveLength(0);
    expect(assertedPoles("그때그때 말로 푸는 쪽이 좋습니다.", ctx)).toHaveLength(0);
    expect(assertedPoles("결정을 미루면 둘 다 잃기 쉽습니다.", ctx)).toHaveLength(0);
    expect(assertedPoles("속상해도 티를 안 내는 쪽과 기분이 표정에 바로 묻어나는 쪽이 같이 있어요.", ctx)).toHaveLength(0);
    const pair = { compat: true, people: [{ names: ["도윤"], label: "도윤님" }, { names: ["하린"], label: "하린님" }] };
    expect(assertedPoles("거슬리는 말에 그 자리에서 받아치는 하린님은 곧장 풀고 싶어 해요.", pair)[0]?.who).toBe(1);
  });
  it("합·충을 MBTI 성향과 잇기 · 열등 기능을 강점으로", () => {
    const anchor = /ISTP|속으로 따지는 논리/;
    expect(relationLink("ISTP의 판단이 인오술 삼합과 만나 방향이 또렷해요.", undefined, anchor)).not.toBeNull();
    expect(relationLink("이 성향이 인오술 삼합과 만나면 방향이 또렷해져요.", "ISTP는 속으로 따지는 논리(Ti)가 주기능이에요.", anchor)).not.toBeNull();
    expect(relationLink("인오술 삼합이 있어 한 판에 힘이 모여요.", undefined, anchor)).toBeNull();
    expect(inferiorAsStrength("주변 마음 살피기(Fe)가 당신의 강점이에요.", "ISTP", { Fe: "주변 마음 살피기" })).not.toBeNull();
    expect(inferiorAsStrength("주변 마음 살피기(Fe)는 가장 늦게 자라는 힘이라 연습이 필요해요.", "ISTP", { Fe: "주변 마음 살피기" })).toBeNull();
  });
});

describe("S4 직접 읽기 결함 고침(측정 8권)", () => {
  it("마침표로 끝난 인용 뒤 인용 동사는 문장을 끊지 않는다 — 새 문장 머리(하지만)는 끊는다", () => {
    expect(splitSentences('도윤님은 "이 부분은 내가 맡을게." 하고 알려 주고, 하린님은 웃어요.')).toHaveLength(1);
    expect(splitSentences('"좋아요." 하지만 다음엔 달라요.')).toHaveLength(2);
  });
  it("처방 종류 이름·절 구조가 서술어로 나오면 내부 말 — 자연스러운 「하루 묵히기를 해 보세요」는 아님", () => {
    expect(INTERNAL_LABEL.test("그래서 이 절의 한 가지는 끝까지 듣기예요.")).toBe(true);
    expect(INTERNAL_LABEL.test("그래서 맞는 한 가지가 끝까지 듣기예요.")).toBe(true);
    expect(INTERNAL_LABEL.test("이번 주에는 하루 묵히기를 해 보세요.")).toBe(false);
  });
  it("자리 표시를 서술어·동격·글자 자리에 씀 · 같은 사람을 「반면」으로 맞세움 · 주어를 서술어로 되풀이", () => {
    expect(brokenSentence("유나님의 태어난 날 기둥(일주)은 이 자리예요.")?.kind).toBe("slot");
    expect(brokenSentence("태어난 달 땅 글자의 겁재, 곧 이 자리는 이 엔진의 연료예요.")?.kind).toBe("slot");
    expect(brokenSentence("땅 글자 자리에는 태어난 날 기둥(일주)이 놓여 있어요.")?.kind).toBe("slot");
    expect(brokenSentence("반면 도윤님은 앞날을 천천히 재요.", { prev: "도윤님은 익숙한 길을 지켜요." })?.kind).toBe("slot");
    expect(brokenSentence("반면 하린님은 앞날을 가볍게 말해요.", { prev: "도윤님은 익숙한 길을 지켜요." })).toBeNull();
    expect(brokenSentence("반대로 하린님이 세부 없이 제안하면 도윤님은 불안해져요.", { prev: "하린님이 던진 제안을 도윤님이 따지면 하린님은 서운해요." })).toBeNull();
    expect(brokenSentence("도윤님의 진술충은 진술충으로, 두 방향을 붙들어요.")?.kind).toBe("render_overlap");
  });
  it("개선 규칙은 문단 첫 문장(주어 자리)과 다음 문장이 「이 순서」로 가리키는 문장을 떼지 않는다", () => {
    const p = "태어난 달 땅 글자에 망신살이 있어요. 속마음이 얼굴에 드러나는 힘이라 숨기기 어려워요. 솔직해서 믿음을 얻어요. 들킬 때도 있어요.";
    expect(dropSentences([ch(1, [[p]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "태어난 달 땅 글자에 망신살이 있어요.", rule: "phrase_repeat", hard: HARD_RULES.has("phrase_repeat" as never) }]).dropped[0].kept).toBe("lead");
    const q = "셋째는 결정 습관에서 나온 원칙입니다. 큰 결정 앞에서는 같은 확인 순서를 쓰세요. 마음이 가는 날일수록 이 순서가 방패가 됩니다. 세 원칙은 모두 규칙 지키기예요.";
    expect(dropSentences([ch(1, [[q]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "큰 결정 앞에서는 같은 확인 순서를 쓰세요.", rule: "phrase_repeat", hard: HARD_RULES.has("phrase_repeat" as never) }]).dropped[0].kept).toBe("leans");
  });
  it("렌더: 「자리의 ⟦at⟧에는」 · 두 사람 자리 + 관계 표시 · 「○○님의 사주에는 ⟦rel⟧」", () => {
    const mk = (key: string, text: string, extra: Partial<Mark> = {}): [string, Mark] => [key, { key, kind: key.split(":")[0] as Mark["kind"], text, ...extra }];
    const t = new Map([mk("at:t5", "태어난 달 땅 글자(월지)", { short: "이 자리", codes: ["월지"] }),
      mk("rel:7", "도윤님의 태어난 해 땅 글자 유와 하린님의 태어난 날 땅 글자 자 사이의 파(맞춰 둔 것에 금이 감)", { short: "이 관계" }),
      mk("rel:5", "도윤님 사주 안의 태어난 달 땅 글자 진과 태어난 날 땅 글자 술 사이의 충(마주 서서 부딪침)", { short: "이 관계" })]);
    expect(renderMarks("태어난 달 땅 글자의 ⟦at:t5⟧에는 고신살이 있어요.", t)).toBe("태어난 달 땅 글자에는 고신살이 있어요.");
    expect(renderMarks("도윤님의 해와 하린님의 자 사이에는 ⟦rel:7⟧도 있어요.", t)).toBe("도윤님의 태어난 해 땅 글자 유와 하린님의 태어난 날 땅 글자 자 사이에는 파(맞춰 둔 것에 금이 감)도 있어요.");
    expect(renderMarks("도윤님의 사주에는 ⟦rel:5⟧이 있어요.", t)).toBe("도윤님의 사주에는 태어난 달 땅 글자 진과 태어난 날 땅 글자 술 사이의 충(마주 서서 부딪침)이 있어요.");
  });
  it("커리어 묶음 이름은 괄호 풀이 안에 또 달지 않는다 · 관계 문장 뒤 「…과도 맞아요」 잇기", () => {
    expect(careerGroupNames("땅 글자 속에서 편관(나를 압박해 단단하게 만드는 규칙의 힘)이 일을 밀어붙여요.", new Set()).text).toBe("땅 글자 속에서 편관(나를 압박해 단단하게 만드는 규칙의 힘)이 일을 밀어붙여요.");
    expect(relationLinkAfter("누군가 나서지 않을 때 궂은일을 맡는 INFJ의 습관과도 맞아요.", "태어난 달과 날 사이에는 인신충이 있어요. 정체된 모임이 흐르기 시작해요.", /INFJ/)).not.toBeNull();
  });
});

describe("S4 2판 직접 읽기 결함 고침(측정 8권 2판)", () => {
  const mk = (key: string, text: string, extra: Partial<Mark> = {}): [string, Mark] => [key, { key, kind: key.split(":")[0] as Mark["kind"], text, ...extra }];
  it("두 사람 자리 + 관계 표시: 풀이 괄호 안의 「사이의」에서 자르지 않는다(「사이에는 해(…)가」)", () => {
    const t = new Map([mk("rel:8", "도윤님의 태어난 날 땅 글자 술과 하린님의 태어난 달 땅 글자 유 사이의 해(가까운 사이의 작은 서운함)", { short: "이 관계" })]);
    expect(renderMarks("도윤님의 태어난 날 땅 글자와 하린님의 태어난 달 땅 글자 사이에는 ⟦rel:8⟧가 있어서 말이 상처가 돼요.", t))
      .toBe("도윤님의 태어난 날 땅 글자 술과 하린님의 태어난 달 땅 글자 유 사이에는 해(가까운 사이의 작은 서운함)가 있어서 말이 상처가 돼요.");
  });
  it("자리 표시를 주어·목적어로 쓰면 특성 이름을 붙인다 · 자리(에)·주제(는)·이름이 이미 있으면 그대로", () => {
    const t = new Map([mk("at:a3", "도윤님의 태어난 날 땅 글자(일지)", { short: "이 자리", codes: ["일지"], owner: "도윤님", name: "반안살" })]);
    expect(renderMarks("하지만 ⟦at:a3⟧를 떠올려 보세요.", t)).toBe("하지만 도윤님의 태어난 날 땅 글자(일지)의 반안살을 떠올려 보세요.");
    expect(renderMarks("⟦at:a3⟧가 이때 힘이 됩니다.", t)).toBe("도윤님의 태어난 날 땅 글자(일지)의 반안살이 이때 힘이 됩니다.");
    expect(renderMarks("⟦at:a3⟧에 반안살이 있어요.", t)).toBe("도윤님의 태어난 날 땅 글자(일지)에 반안살이 있어요.");
    expect(renderMarks("⟦at:a3⟧는 안정을 챙기는 자리예요.", t)).toBe("도윤님의 태어난 날 땅 글자(일지)는 안정을 챙기는 자리예요.");
    expect(renderMarks("반안살은 ⟦at:a3⟧가 받쳐 줘요.", t)).toBe("반안살은 도윤님의 태어난 날 땅 글자(일지)가 받쳐 줘요.");
  });
  it("문단 첫 문장 지키기는 다음 문장의 주어(근거 이름)를 꺼낼 때만 — 틀 문장은 뗀다", () => {
    expect(leadNamesSubject("태어난 달 땅 글자에 망신살이 있어요.", "속마음이 얼굴에 드러나는 힘이라 숨기기 어려워요.")).toBe(true);
    expect(leadNamesSubject("이번 장의 행동은 이거예요.", "하루를 마칠 때 끝낸 일 세 가지를 적어 두세요.")).toBe(false);
    expect(leadNamesSubject("망신살이 있어요.", "망신살은 기분이 말투에 묻어나는 힘이에요.")).toBe(false);
    const p = "이번 장의 행동은 이거예요. 하루를 마칠 때 끝낸 일 세 가지를 적어 두세요. 적는 데 오 분이면 충분해요. 그 기록이 다음 날 첫 줄이 돼요.";
    expect(dropSentences([ch(1, [[p]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "이번 장의 행동은 이거예요.", rule: "rule_leak", hard: HARD_RULES.has("rule_leak" as never) }]).dropped[0].kept).toBeUndefined();
  });
  it("같은 사람 감정 회복 모순(수 부족 「뒤끝 없음」 ↔ 「완충이 얇아 오래 머묾」) · 조언 앞 까닭 마디의 단정 · 자기 실수 곱씹기는 아니다", () => {
    const one = { compat: false, people: [{ names: ["한결"], label: "한결님", codes: { decide: "fast" as const } }] };
    const s = (chapter: number, section: number, sentence: string) => ({ chapter, section, paragraph: 0, sentence });
    expect(contradictionFlags([s(3, 0, "뒤끝 없이 감정을 금방 털고, 부딪쳐도 회복이 빠릅니다."), s(4, 1, "물이 부족하면 완충이 얇아서 부딪친 일이 마음에 오래 머물기 쉽습니다.")], one)).toHaveLength(1);
    expect(contradictionFlags([s(3, 0, "뒤끝 없이 감정을 금방 털고, 부딪쳐도 회복이 빠릅니다."), s(6, 0, "사소한 실수를 며칠씩 곱씹다가 몸부터 지칩니다.")], one)).toHaveLength(0);
    expect(contradictionFlags([s(8, 2, "규정과 선례를 먼저 확인하고 정하는 절차형이라, 큰 결정 앞에서는 같은 확인 순서를 그대로 쓰세요.")], one)).toHaveLength(1);
    expect(contradictionFlags([s(8, 2, "큰 결정은 하루를 묵힌 다음 다시 보세요.")], one)).toHaveLength(0);
  });
  it("「X 글자가 셋 이상이면」은 겉 글자가 그보다 적으면 fact_count · 건강 「신호가 오죠」", () => {
    const ctx = factCtxOf(F.sheet, k, personNames(F.brief));
    const count = F.sheet.people[0].elements.count, W: Record<number, string> = { 2: "둘", 3: "셋", 4: "넷", 5: "다섯" };
    const KO: Record<string, string> = { WOOD: "나무", FIRE: "불", EARTH: "흙", METAL: "쇠", WATER: "물" };
    const low = Object.entries(count).find(([, c]) => c <= 4)!, high = Object.entries(count).find(([, c]) => c >= 2);
    expect(factCheck(`다만 ${KO[low[0]]} 글자가 ${W[Math.max(2, low[1] + 1)]} 이상이면 욕심이 체력을 앞지르기 쉽습니다.`, ctx)?.rule).toBe("fact_count");
    if (high) expect(factCheck(`다만 ${KO[high[0]]} 글자가 ${W[high[1] >= 5 ? 5 : Math.max(2, high[1])]} 이상이면 욕심이 체력을 앞지르기 쉽습니다.`, ctx)).toBeNull();
    const single = { birthTimeKnown: false, mbti: null, relationship: "single" as const, children: "unknown" as const, job: "none" as const };
    expect(sentenceViolation("소화와 수면에서 먼저 신호가 오죠.", single)).toBe("health_claim");
    expect(sentenceViolation("몸이 신호를 보내기 전에 쉬는 시간을 챙기세요.", single)).toBeNull();
  });
  it("관계 문장 두 문장 뒤에도 기능 부호(Fi)로 이은 MBTI 성향은 잇기", () => {
    expect(relationLinkAfter("서운함을 속으로 오래 담아 두는 면은 내 감정을 안으로 곱씹는 성향(Fi)과 닮아 있어요.", "여기에는 원진살이라는 근거가 있어요. 태어난 해와 날 사이에 거슬리는 짝이 있어요.", /ENTJ|\(Fi\)/)).not.toBeNull();
  });
});

describe("S4 3판 직접 읽기 결함 고침(측정 8권 3판)", () => {
  it("MBTI 문단 뒤 「사주 쪽도 같은 방향을 가리킵니다」 + 다음 문장 관계 = 잇기 · 다음 문장이 관계가 아니면 아니다", () => {
    expect(relationLinkFrame("사주 쪽도 같은 방향을 가리킵니다.", "태어난 해·날·시각 땅 글자 술·인·오가 모인 삼합이 있어서 힘이 한 방향으로 쏠려요.", "ISTP는 손끝 해결사예요.", /ISTP/)).not.toBeNull();
    expect(relationLinkFrame("사주 쪽도 같은 방향을 가리킵니다.", "현침살이 있어서 숫자를 날카롭게 봐요.", "ISTP는 손끝 해결사예요.", /ISTP/)).toBeNull();
    expect(relationLinkFrame("생각의 방향이 같은 쪽으로 몰린다는 점은 사주의 일간(日干)과 십성에서도 비슷하게 읽힙니다.", "술·인·오가 모인 삼합이 있어서 힘이 쏠려요.", "ISTP는 손끝 해결사예요.", /ISTP/)).not.toBeNull();
  });
  it("구절에 이미 특성 이름이 있는 자리 표시에는 이름을 또 붙이지 않는다(「자유파의 자유파」)", () => {
    const t = new Map<string, Mark>([["at:bt6", { key: "at:bt6", kind: "at", text: "하린님의 태어난 달과 날 사이의 자유파", short: "자유파", codes: ["자유파"], owner: "하린님", name: "자유파" }]]);
    expect(renderMarks("이 관계는 ⟦at:bt6⟧가 만들어요.", t)).toBe("이 관계는 하린님의 태어난 달과 날 사이의 자유파가 만들어요.");
  });
  it("수리가 차단 원문을 고쳤으면 이웃과 뜻이 겹쳐도(개선) 원문으로 되돌리지 않는다 · 차단 아닌 원문은 예전처럼 되돌린다", () => {
    const before = "규정과 선례를 먼저 확인하고 정하는 절차형이라 확인 순서를 쓰세요.", after = "마음 가는 쪽으로 빠르게 정하는 직감형이라 확인 순서를 쓰세요.";
    const p = `셋째는 결정 습관에서 나온 원칙입니다. ${after} 마음 가는 쪽으로 빠르게 정하는 직감형이라 결정이 빨라요. 세 원칙은 모두 규칙 지키기예요.`;
    const applied = [{ id: 1, kind: "sentence" as const, at: "1.0.0", before, after, source: ["lint"] }];
    expect(postRepairTidy([ch(1, [[p]])], applied as never, () => true).chapters[0].sections[0].paragraphs[0]).toContain(after);
    expect(postRepairTidy([ch(1, [[p]])], applied as never).chapters[0].sections[0].paragraphs[0]).toContain(before);
  });
  it("지운 문장을 받는 짧은 「…더 그래요」도 함께 지운다", () => {
    const p = "배우는 자리에서도 수 부족의 영향을 받아요. 물이 부족하면 완충이 얇아서 부딪친 일이 오래 머물러요. INFJ가 겹치면 더 그래요. 하지만 배운 것은 바로 써 봅니다. 그 방식이 맞는 공부예요.";
    const f = { chapter: 1, section: 0, paragraph: 0, rule: "self_contradiction", sentence: "물이 부족하면 완충이 얇아서 부딪친 일이 오래 머물러요." } as LintFlag;
    const r = deleteFlagged([ch(1, [[p]])], [f], HARD_RULES);
    expect(r.chapters[0].sections[0].paragraphs[0]).not.toContain("더 그래요");
    expect(r.deleted.some(d => d.rule.endsWith(":orphan_summary"))).toBe(true);
    // 수리 전 떼기(검수 C 등 차단)도 같은 고아를 함께 뗀다.
    const d = dropSentences([ch(1, [[p]])], [{ ...f, rule: "review_C", hard: true }]);
    expect(d.chapters[0].sections[0].paragraphs[0]).not.toContain("더 그래요");
  });
});
