// W6.1(외부 호출 0, 가상 이름 + 합성 문장만): 후처리 P1~P5 · 사실 D5·D7.
import { describe, expect, it } from "vitest";
import { brokenSentence, contrastSame, fixBareParenParticle, glossEchoes, stripGlossEcho } from "@/lib/writer/safety/broken";
import { dependsOnRemoved } from "@/lib/writer/safety/orphan";
import { relationLinkAfter, relationLinkFrame, reversalFlags } from "@/lib/writer/safety/contradiction";
import { revertRepairRegressions } from "@/lib/writer/repair3";
import { contradictionFlags, type ContradictionCtx } from "@/lib/writer/safety/contradiction";
import { dropSentences } from "@/lib/writer/repairPlan";
import { deleteFlagged } from "@/lib/writer/repair3";
import { HARD_RULES, type LintFlag } from "@/lib/writer/safety/p6c";
import { improveOnly } from "@/lib/writer/repairPlan";
import type { FinalChapter } from "@/lib/writer/safety";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet, type FactSheet, type PersonFacts } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { personNames } from "@/lib/writer/publish";
import { renderMarks, type Mark } from "@/lib/writer/marks";

const ch = (paras: string[]): FinalChapter[] => [{ n: 3, id: "c3", title: "장", source: "writer", chars: 0, sections: [{ heading: "절", paragraphs: paras }] } as unknown as FinalChapter];

describe("W6.1 P1 괄호 풀이 되풀이", () => {
  const s = "하늘 글자(월간)에는 정관(평가와 기준이 또렷한 자리에서 인정받는 힘)이 있어서 평가와 기준이 또렷한 자리에서 인정받을 기회가 생깁니다.";
  it("잡고, 정리는 풀이 괄호를 뗀다", () => {
    expect(glossEchoes(s)).toHaveLength(1);
    expect(brokenSentence(s)?.kind).toBe("dup_phrase");
    expect(stripGlossEcho(s).text).toBe("하늘 글자(월간)에는 정관이 있어서 평가와 기준이 또렷한 자리에서 인정받을 기회가 생깁니다.");
  });
  it("조사는 앞 이름 받침에 맞춘다 · 되풀이 없으면 그대로", () => {
    expect(stripGlossEcho("편재(기회를 잡아 크게 굴리는 힘)이 있어서 기회를 잡아 크게 굴리는 일이 잦아요.").text).toBe("편재가 있어서 기회를 잡아 크게 굴리는 일이 잦아요.");
    const keep = "정관(평가와 기준이 또렷한 자리에서 인정받는 힘)이 있어서 맡은 일을 끝까지 챙겨요.";
    expect(stripGlossEcho(keep).text).toBe(keep);
  });
  it("괄호 이름 뒤 빠진 조사", () => {
    expect(fixBareParenParticle("약한 쪽은 만드는 힘(식상) 적은 쪽이라, 생각이 늦게 풀려요.").text).toBe("약한 쪽은 만드는 힘(식상)이 적은 쪽이라, 생각이 늦게 풀려요.");
    expect(brokenSentence("약한 쪽은 만드는 힘(식상) 적은 쪽이라, 생각이 늦게 풀려요.")?.kind).toBe("particle");
  });
});

describe("W6.1 P2 떼기 뒤 기대는 문장", () => {
  it("「~도 함께」 · 비교 꼬리 · 조사 시작은 기댄다", () => {
    expect(dependsOnRemoved("당신의 재능은 끝까지 남는 힘이었습니다.", "새 길을 내는 속도와 다시 시작하는 용기도 함께 있었어요.")).toBe("leans");
    expect(dependsOnRemoved("두 사람 모두 계획을 먼저 세워요.", "그중 가람님이 더 그렇습니다.")).toBe("leans");
  });
  it("궁합: 한 사람을 주어로 세운 문장을 떼면 사람 말 없는 다음 문장은 주어를 잃는다", () => {
    const names = [["가람"], ["나래"]];
    expect(dependsOnRemoved("가람님의 태어난 달 하늘 글자는 돈과 기회의 눈입니다.", "좋은 조건이 보이면 바로 관심을 보여요.", { names })).toBe("subject");
    expect(dependsOnRemoved("가람님의 태어난 달 하늘 글자는 돈과 기회의 눈입니다.", "나래님은 분위기로 골라요.", { names })).toBeNull();
  });
  it("한 사람 책: 근거 이름 문장을 떼면 「…힘이라」만 남는 문장", () => {
    expect(dependsOnRemoved("망신살이 있어요.", "속마음이 숨겨지지 않고 드러나는 힘이라 솔직해요.", { names: [["가람"]] })).toBe("subject");
    expect(dependsOnRemoved("망신살이 있어요.", "당신은 솔직한 편이에요.", { names: [["가람"]] })).toBeNull();
  });
  it("차단 떼기는 기대는 문장도 함께, 개선 떼기는 원문을 둔다", () => {
    const paras = ["데이트 계획 앞에서 두 사람의 방식은 갈려요. 가람님의 태어난 달 하늘 글자는 돈과 기회의 눈입니다. 좋은 조건이 보이면 바로 관심을 보여요. 가람님은 잔고부터 확인하는 사람이에요."];
    const hard = dropSentences(ch(paras), [{ chapter: 3, section: 0, paragraph: 0, sentence: "가람님의 태어난 달 하늘 글자는 돈과 기회의 눈입니다.", rule: "broken_sentence", hard: true }], { names: [["가람"], ["나래"]] });
    expect(hard.chapters[0].sections[0].paragraphs[0]).toBe("데이트 계획 앞에서 두 사람의 방식은 갈려요. 가람님은 잔고부터 확인하는 사람이에요.");
    const p2 = ["당신의 재능은 끝까지 남는 힘이었습니다. 새 길을 내는 속도와 다시 시작하는 용기도 함께 있었어요. 하나를 끝까지 마치는 경험이 필요합니다. 그 경험이 다음 길을 엽니다."];
    const soft = dropSentences(ch(p2), [{ chapter: 3, section: 0, paragraph: 0, sentence: "당신의 재능은 끝까지 남는 힘이었습니다.", rule: "scene_repeat", hard: false }]);
    expect(soft.dropped[0].kept).toBe("leans");
    expect(soft.chapters[0].sections[0].paragraphs[0]).toBe(p2[0]);
  });
  it("수리 뒤 지우기(deleteFlagged)도 같은 판정", () => {
    const paras = ["망신살이 있어요. 속마음이 숨겨지지 않고 드러나는 힘이라 솔직해요. 당신은 표정이 먼저 움직여요. 그래서 거짓말이 서툴러요."];
    const f: LintFlag = { chapter: 3, section: 0, paragraph: 0, sentence: "망신살이 있어요.", rule: "broken_sentence" } as LintFlag;
    const r = deleteFlagged(ch(paras), [f], HARD_RULES, improveOnly, { names: [["가람"]] });
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("당신은 표정이 먼저 움직여요. 그래서 거짓말이 서툴러요.");
  });
});

describe("W6.1 P3 비교 꼬리 · 같은 말 「반면」", () => {
  it("공통 성향 없는 「그중 X님이 더」", () => {
    expect(brokenSentence("그중 가람님이 더 그렇습니다.", { prev: "가람님은 결론부터 말하고, 나래님은 속으로 정리한 뒤 말해요." })?.kind).toBe("slot");
    expect(brokenSentence("그중 가람님이 더 그렇습니다.", { prev: "두 사람 모두 계획을 먼저 세우는 편이에요." })).toBeNull();
  });
  it("앞 문장과 같은 말을 「반면」으로", () => {
    expect(contrastSame("반면 손익 계산이 어려운 날에는 마음 가는 쪽으로 정하는 방식으로 메웁니다.", "의사결정은 마음 가는 쪽을 먼저 보고 빠르게 정하는 직감형이에요.")).not.toBeNull();
    expect(contrastSame("반면 혼자 있는 시간에는 기록을 다시 읽어요.", "의사결정은 마음 가는 쪽을 먼저 보고 빠르게 정하는 직감형이에요.")).toBeNull();
    expect(contrastSame("반면 나래님은 마음 가는 쪽으로 정해요.", "가람님은 마음 가는 쪽을 먼저 보고 정해요.")).toBeNull();
  });
});

describe("W6.1 P5 궁합 성격 단서", () => {
  const ctx: ContradictionCtx = { compat: true, people: [{ names: ["가람"], label: "가람", codes: { energy: "I", lead: "back", conflict: "later", express: "행동", decide: "mid" } }, { names: ["나래"], label: "나래", codes: { energy: "E", lead: "front", conflict: "now", express: "말", decide: "fast" } }] };
  it("「말 그대로 받아들임」 ↔ 「표정을 먼저 믿음」(같은 절이어도 대비 표지 없으면)", () => {
    const hits = contradictionFlags([
      { chapter: 8, section: 0, paragraph: 0, sentence: "나래님은 괜찮다는 말보다 괜찮지 않은 표정을 먼저 믿는 사람이에요." },
      { chapter: 8, section: 0, paragraph: 1, sentence: "나래님은 말을 그대로 받아들이는 편이라 행동의 정성을 놓치기 쉬워요." },
    ], ctx);
    expect(hits.map(h => h.detail)).toEqual([expect.stringContaining("cueReading")]);
  });
  it("앞 문장 「둘 다」를 이은 이름 없는 문장 ↔ 성격표 말(E·말)", () => {
    const hits = contradictionFlags([
      { chapter: 2, section: 1, paragraph: 0, sentence: "둘 다 만드는 힘이 적은 사주예요." },
      { chapter: 2, section: 1, paragraph: 0, sentence: "말보다 속으로 깊이 생각하는 힘이 있고, 배우는 일을 좋아하는 결이 같아요." },
    ], ctx);
    expect(hits.map(h => h.detail)).toEqual([expect.stringContaining("나래 verbalOutput")]);
  });
  it("「한쪽은 … 다른 쪽은」은 잇지 않는다", () => {
    expect(contradictionFlags([
      { chapter: 1, section: 0, paragraph: 0, sentence: "둘 다 데이트 비용 앞에서 생각이 많아요." },
      { chapter: 1, section: 0, paragraph: 0, sentence: "한쪽은 미리 한도를 정하고, 다른 쪽은 그때그때 쓰고 싶어 해요." },
    ], ctx)).toEqual([]);
  });
});

// ── 정답지 대조(가상 인물 eval 입력) ──

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => { const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined; return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) }; };
const make = (input: BriefInput) => { const brief = buildBrief(input, k); return { brief, sheet: buildFactSheet(input, brief, k) }; };
const TG = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];

describe("W6.1 D5 없는 십성을 근거로 단정", () => {
  const F = make({ product: "career_money_study", baseDate: "2026-11-14", person: person("minjun", "c3", "ESFJ") } as BriefInput);
  const ctx = factCtxOf(F.sheet, k, personNames(F.brief));
  const have = new Set(Object.values(F.sheet.people[0].tenGods).flatMap(v => v ?? []));
  const absent = TG.find(t => !have.has(t)), present = TG.filter(t => have.has(t));
  it("나열 가운데 하나라도 원국·지장간에 없으면 fact_term", () => {
    expect(absent).toBeDefined();
    expect(factCheck(`${absent}나 ${present[0]} 쪽이 더 크기 때문인데, 규칙으로 묶어 두는 편이 맞습니다.`, ctx)?.rule).toBe("fact_term");
    expect(factCheck(`${present[0]} 쪽이 더 크기 때문인데, 규칙으로 묶어 두는 편이 맞습니다.`, ctx)).toBeNull();
    expect(factCheck(`${absent}이 없어서 기회를 덜 쫓는 편이에요.`, ctx)).toBeNull();
  });
});

describe("W6.1 D7 같은 신살 두 이름 · P4 주인 자리 + 공통", () => {
  const F = make({ product: "love_marriage_child", baseDate: "2026-11-14", person: person("minjun", "c3", "ESFJ") } as BriefInput);
  const p0 = F.sheet.people[0];
  const dh = { id: "shinsal:DOHWASAL", code: "DOHWASAL", family: "shinsal", name: "도화살", positions: ["day"], slots: ["dayBranch"], glyphs: [], count: 1, twelve: false } as const;
  const ny = { ...dh, id: "shinsal:TWELVE_NYEONSAL", code: "TWELVE_NYEONSAL", name: "년살", twelve: true, sameAs: "도화살" } as const;
  const sheet: FactSheet = { ...F.sheet, people: [{ ...p0, shinsal: [...p0.shinsal.filter(s => !/DOHWA|NYEON/.test(s.code)), dh, ny] } as PersonFacts] };
  const ctx = factCtxOf(sheet, k, personNames(F.brief));
  it("sameAs 이름(년살)으로 쓰면 fact_term, 둘이 같다고 풀면 통과", () => {
    expect(factCheck("태어난 날 땅 글자(일지)의 년살은 새것을 먼저 써 보는 힘이에요.", ctx)?.detail).toContain("같은 신살");
    expect(factCheck("도화살과 년살은 같은 글자를 달리 부른 이름이에요.", ctx)).toBeNull();
    expect(factCheck("태어난 날 땅 글자(일지)의 도화살은 눈길을 모으는 힘이에요.", ctx)).toBeNull();
  });
  const C = make({ product: "saju_mbti_compatibility", baseDate: "2026-11-14", person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput);
  const cctx = factCtxOf(C.sheet, k, personNames(C.brief));
  const common = C.sheet.pair?.common.shinsal[0];
  it("한 사람 자리에 걸린 신살을 「두 사람 모두에게」 — 공통 신살이어도 fact_term", () => {
    expect(common).toBeDefined();
    const call = C.brief.compatibility!.a.callName;
    expect(factCheck(`${call}의 태어난 날 땅 글자(일지)에 걸린 ${common}이 두 사람 모두에게 있어서 눈이 날카로워요.`, cctx)?.detail).toContain("주인 자리 + 공통");
    expect(factCheck(`${common}은 두 사람 모두에게 있어서 눈이 날카로워요.`, cctx)).toBeNull();
  });
});

describe("W6.1 P4 렌더 ⑤ — 관계 구절 뒤에서 같은 자리를 또 말함", () => {
  const m: Mark = { key: "in:1", kind: "in", text: "태어난 해·날·시각 땅 글자 술·인·오가 모인 삼합(세 글자가 한 기운으로 모임)", short: "이 관계", glyph: "술·인·오가 모인 삼합(세 글자가 한 기운으로 모임)" } as Mark;
  const table = new Map([["in:1", m]]);
  it("뒤에 「태어난 해·날·시각」이 오면 글자만 꼴, 아니면 그대로", () => {
    expect(renderMarks("⟦in:1⟧가 있어서, 태어난 해·날·시각의 세 땅 글자가 한데 모여요.", table)).toBe("술·인·오가 모인 삼합(세 글자가 한 기운으로 모임)이 있어서, 태어난 해·날·시각의 세 땅 글자가 한데 모여요.");
    expect(renderMarks("⟦in:1⟧가 있어서, 한 방향으로 힘이 쏠려요.", table)).toBe("태어난 해·날·시각 땅 글자 술·인·오가 모인 삼합(세 글자가 한 기운으로 모임)이 있어서, 한 방향으로 힘이 쏠려요.");
  });
});

describe("W6.1 다시 발행 읽기에서 찾은 것", () => {
  const names = [["가람"], ["나래"]];
  it("궁합 주어 판정은 이름이 문장 머리 주어일 때만 · 근거 이름 「…덕이라」는 궁합도", () => {
    expect(dependsOnRemoved("그중 가람님이 더 그렇습니다.", "그래서 해결을 묻는 쪽과 마음을 묻는 쪽이 갈려요.", { names })).toBeNull();
    expect(dependsOnRemoved("두 사람에게는 천덕귀인과 월덕귀인이 힘이 되어 줘요.", "어려움의 세기를 낮추고 다툼의 온도를 낮추는 덕이라, 크게 번지지 않아요.", { names })).toBe("subject");
  });
  it("차단 떼기는 기대는 문장을 3문장까지 따라 지운다", () => {
    const paras = ["두 사람은 서로 채워 주는 사이예요.", "두 사람에게는 천덕귀인과 월덕귀인이 힘이 되어 줘요. 어려움의 세기를 낮추는 덕이라, 크게 번지지 않아요. 이 덕은 부드러운 태도 안에서 잘 작동해요.", "또 천을귀인이 있어서 막힐 때 길이 열려요."];
    const f = { chapter: 3, section: 0, paragraph: 1, sentence: "두 사람에게는 천덕귀인과 월덕귀인이 힘이 되어 줘요.", rule: "fact_term" } as LintFlag;
    const r = deleteFlagged(ch(paras), [f], HARD_RULES, improveOnly, { names });
    expect(r.chapters[0].sections[0].paragraphs).toEqual([paras[0], paras[2]]);
  });
  it("목록 항목은 개선 떼기로 떼지 않는다", () => {
    const p = ["원칙은 세 개예요. 하나, 손실 금액을 적어 보세요. 둘, 시세를 조사하세요. 셋, 감당 범위를 먼저 적고 결정하세요. 셋째는 결정 습관에서 나온 원칙이에요."];
    const d = dropSentences(ch(p), [{ chapter: 3, section: 0, paragraph: 0, sentence: "셋, 감당 범위를 먼저 적고 결정하세요.", rule: "review_R", hard: false }]);
    expect(d.dropped[0].kept).toBe("list");
    expect(dependsOnRemoved("셋, 감당 범위를 먼저 적고 결정하세요.", "셋째는 결정 습관에서 나온 원칙이에요.")).toBe("leans");
  });
  it("관계 문단 뒤 「이 … 결을 더 키웁니다」 · 「사주의 구조도 … 쪽을 가리킵니다」", () => {
    const anchor = /ENTP|Ne|ISTP|Ti|Se/;
    expect(relationLinkAfter("ENTP의 끝없는 가능성(Ne)이 이 자유로운 결을 더 키웁니다.", "나래님의 사주에는 태어난 달과 날 사이에 자유파가 있어요.", anchor)).not.toBeNull();
    expect(relationLinkFrame("사주의 구조도 한곳으로 모이는 쪽을 가리킵니다.", "술·인·오가 모인 삼합이 있어서 힘이 쏠려요.", "부기능인 지금 이 순간 감각(Se)은 손을 빠르게 해요.", anchor)).not.toBeNull();
  });
  it("「반면」: 낱말 셋 이어짐이 끊겨도 내용 낱말 셋 이상 같으면", () => {
    expect(contrastSame("반면 손익 계산이 어려운 날에는 마음 가는 쪽으로 정하는 방식으로 메웁니다.", "의사결정은 마음이 먼저 가는 쪽으로 빠르게 정하는 직감형이에요.")).not.toBeNull();
  });
  it("수리가 유형 이름을 바꿨는데 같은 문단이 옛 이름을 쓰면 원문으로", () => {
    const before = "몰입은 정해진 일과표대로 하루를 운영하는 규칙형이에요.", after = "몰입은 그날 끌리는 일에 바로 들어가는 즉흥형이에요.";
    const chs = ch([`${after} 빠른 결정과 규칙형 몰입이 한 사람 안에서 같이 도는 셈이에요.`]);
    const r = revertRepairRegressions(chs, [{ id: 1, kind: "sentence", at: "3.0.0", before, after, source: ["lint"] }] as never, { flags: [], names: [] });
    expect(r.reverted[0]?.rule).toContain("repair_label_flip");
    expect(r.chapters[0].sections[0].paragraphs[0]).toContain(before);
  });
});

describe("W6.1 v8: 자리를 글로 말한 뒤 「이 자리는 ⟦at⟧입니다」 · 앞 주장 뒤집기", () => {
  const m: Mark = { key: "at:t5", kind: "at", text: "태어난 해 땅 글자(연지)와 태어난 달 기둥(월주)", short: "이 자리", codes: ["연지", "월간", "월지"] } as Mark;
  it("앞 마디가 하늘·땅 글자를 말했으면 뒤 마디를 뗀다", () => {
    expect(renderMarks("태어난 해 땅 글자와 태어난 달 하늘 글자·땅 글자에 편인이 있고, 이 자리는 ⟦at:t5⟧입니다.", new Map([["at:t5", m]]))).toBe("태어난 해 땅 글자와 태어난 달 하늘 글자·땅 글자에 편인이 있어요.");
  });
  it("「앞서 본 X는 Y가 아니라」가 다른 장의 Y 단정을 뒤집으면 모순", () => {
    const hits = reversalFlags([
      { chapter: 6, section: 0, paragraph: 0, sentence: "같은 글자가 겹쳐 서로를 몰아붙이는 흐름이에요." },
      { chapter: 9, section: 0, paragraph: 0, sentence: "앞서 본 부딪힘은 서로를 몰아붙이는 마찰이 아니라 속도의 어긋남에서 왔습니다." },
    ]);
    expect(hits).toHaveLength(1);
    expect(reversalFlags([{ chapter: 9, section: 0, paragraph: 0, sentence: "앞서 본 부딪힘은 서로를 몰아붙이는 마찰이 아니라 속도의 어긋남에서 왔습니다." }])).toHaveLength(0);
  });
});
