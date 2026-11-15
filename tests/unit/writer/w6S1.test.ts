// W6 S0·S1(외부 호출 0, 가상 인물 + 합성 문장만): 차단/개선 분류 · 깨진 문장 · 표시 렌더 통합(A1) · 계절·궁합 십성·일주 대조(A2·A3) ·
// 성격 요약표·모순(A4) · 합·충 × MBTI 연결(S1-5) · 개선 규칙 3문장 하한.
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
import { assertedPoles, contradictionFlags, inferiorAsStrength, relationLink } from "@/lib/writer/safety/contradiction";
import { personNames } from "@/lib/writer/publish";
import { dropSentences } from "@/lib/writer/repairPlan";
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
