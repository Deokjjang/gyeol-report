/**
 * P6e 회귀: 판독 문장 1~21이 원인 계층에서 고쳐졌는지(브리프·지식 DB·렌더)와, 저장된 P6d 최종 4권(docs/v5/baseline/p6d)을 새 검사로 다시 읽으면 인용 문장이 모두 걸리는지.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import type { Brief } from "@/lib/brief/schema";
import { POLE_TAGS, poleFits, tagFits } from "@/lib/brief/mbtiFn";
import { sceneTagsOf } from "@/lib/brief/facts";
import { koCount } from "@/lib/brief/labels";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput, v5EditionLabel, type V5BookDraft } from "@/lib/writer/book";
import { buildWriterPrompt, chapterClaims, renderWriterBrief } from "@/lib/writer/prompt";
import { coverLineOf, insertFixedLines, lintContext, renderTerms } from "@/lib/writer/publish";
import { applyRepairs, dropHardSections, hardSections, parseRepair, repairPrompt, repairTargets } from "@/lib/writer/repair";
import type { FinalChapter } from "@/lib/writer/safety";
import { groupClaims } from "@/lib/writer/safety/lint";
import { HARD_RULES, lintBook, tidyBook, type LintCtx } from "@/lib/writer/safety/p6c";
import * as E from "@/lib/writer/safety/p6e";
import { sentenceViolation } from "@/lib/writer/safety/sentences";
import { matchJob } from "@/lib/brief/props";
import { P6D_CASES } from "../../../tools/p6d/cases";
import { P6B_CASES } from "../../../tools/p6b/cases";

const ROOT = resolve(import.meta.dirname, "../../..");
const k = loadKnowledge();
const brief = (id: string): Brief => {
  const c = P6D_CASES.find(x => x.id === id)!;
  const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-04T05:00:00Z") });
  if (!n.ok) throw new Error(n.error);
  return buildBrief(payloadToBriefInput(n.value as never, "2026-11-04") as never, k);
};
const B = { sodam: brief("sodam-full"), taeo: brief("taeo-career"), chaerin: brief("chaerin-love"), pair: brief("pair-business") };
const ctxOf = (b: Brief): LintCtx => lintContext(b, k, buildWriterPrompt(b, { knowledge: k }).chapters, []);
const one = (b: Brief, text: string, at: { n?: number; section?: number; paragraph?: number } = {}) => {
  const sections = Array.from({ length: (at.section ?? 0) + 1 }, (_, i) => ({ heading: `h${i}`, paragraphs: i === (at.section ?? 0) ? [...Array(at.paragraph ?? 0).fill("앞 문단이에요."), text] : ["앞 소제목이에요."] }));
  return lintBook([{ n: at.n ?? 2, id: "x", title: "x", source: "writer", chars: 0, sections }], ctxOf(b)).map(f => f.rule);
};

describe("P6e 출시 차단 1~10", () => {
  it("1 작가 지침 노출: 독자에게 옮긴 규칙은 guide_copy(사실·금지), 사실 마디는 걸리지 않는다. 브리프 note는 작가용 rule로 간다", () => {
    expect(one(B.taeo, "입력하지 않은 경력과 연차는 쓰지 마세요.", { paragraph: 1 })).toContain("guide_copy");
    expect(one(B.taeo, "태어난 달은 사회에서 일하는 자리라서, 이 두 힘이 곧 당신이 일하는 방식이에요.", { paragraph: 1 })).not.toContain("guide_copy");
    // r1 오탐: 자연스러운 장면 문장은 사실·금지로 보지 않는다(지침 겹침은 문체 guide_echo, 시스템 지침 12자 창만).
    expect(one(B.taeo, "이런 사람이 곁에 오면 일이 안정적으로 굴러가는 편이에요.", { paragraph: 1 })).not.toContain("guide_copy");
    expect(E.guideCopy("우리는 사주와 MBTI 개인화 리포트를 책 한 권으로 쓴다는 걸 알아요.", ctxOf(B.taeo).guide!)).not.toBeNull();
    expect(HARD_RULES.has("guide_echo")).toBe(false);
    expect(HARD_RULES.has("guide_copy")).toBe(true);
    const w = JSON.stringify(renderWriterBrief(B.taeo, { knowledge: k }));
    expect(w).not.toMatch(/"note":/); expect(w).toMatch(/"rule":/);
  });
  it("2 고아 문장: 소제목 첫 문장이 앞말에 기대면 orphan_start(사실·금지), 문단 가운데는 괜찮다. 세기 오탐 '많이 씁니다'는 세기가 아니다", () => {
    expect(one(B.taeo, "성격도 같은 쪽을 가리킵니다. ISFP는 혼자 곱씹는 편이에요.")).toContain("orphan_start");
    expect(one(B.chaerin, "여기에 식신의 다정함이 더해집니다.")).toContain("orphan_start");
    expect(one(B.taeo, "성격도 같은 쪽을 가리킵니다.", { paragraph: 1 })).not.toContain("orphan_start");
    for (const ok of ["정도는 상황마다 달라요.", "속도보다 방향이 먼저예요.", "어디도 가지 않아요."]) expect(E.orphanStart(ok), ok).toBeNull();
    expect(groupClaims("조직의 일은 대체로 배움과 보호(인성), 책임과 규칙(관성)의 힘을 많이 씁니다.")).toEqual([]);
  });
  it("2 소제목 재작성 대상 → 그래도 걸리면 소제목을 통째로 빼고 자리·규칙·문장을 남긴다(반복 장 key는 문단 단위)", () => {
    const chs: FinalChapter[] = [{ n: 2, id: "now", title: "t", source: "writer", chars: 0, sections: [{ heading: "a", paragraphs: ["성격도 같은 쪽을 가리킵니다.", "둘째 문단이에요."] }, { heading: "b", paragraphs: ["멀쩡한 소제목이에요."] }] }];
    const flags = lintBook(chs, ctxOf(B.taeo));
    const t = hardSections(flags, chs, HARD_RULES);
    expect(t.map(x => `${x.chapter}.${x.section}`)).toEqual(["2.0"]);
    const d = dropHardSections(chs, t);
    expect(d.chapters[0].sections.map(s => s.heading)).toEqual(["b"]);
    expect(d.dropped).toEqual([{ at: "2.0", heading: "a", rules: ["orphan_start"], sentences: ["성격도 같은 쪽을 가리킵니다."] }]);
  });
  it("3 신살 주인: 궁합 브리프는 신살·귀인을 사람별로 넘기고, 다른 사람 것을 이 사람 이름으로 쓰면 feature_owner", () => {
    expect(B.pair.compatibility!.a.shinsal).toContain("겁살"); expect(B.pair.compatibility!.b.shinsal).not.toContain("겁살");
    expect(one(B.pair, "그런데 백은솔님에게는 겁살(劫煞)에 해당하는 경계심이 일지에 있어요.", { paragraph: 1 })).toContain("feature_owner");
    expect(one(B.pair, "남궁현님에게는 겁살에 해당하는 경계심이 있어요.", { paragraph: 1 })).not.toContain("feature_owner");
    const w = renderWriterBrief(B.pair, { knowledge: k }) as { traits: { owner?: string }[] };
    expect(w.traits.every(t => t.owner)).toBe(true);
  });
  it("4 MBTI 기능 오귀속: ISFP에게 Si·Fe·E 성향 문장은 mbti_misattr, 16유형 DB 값은 모두 그 유형의 기능·태도에 맞는다", () => {
    for (const s of ["식상의 힘은 맞지만 구체 사실을 하나씩 확인하는 ISFP의 성향상 준비가 길어질 수 있어요.", "숫자와 날짜를 먼저 확인하는 성향은 맞지만, 가격을 비교하는 역할은 버거워요.",
      "ISFP는 말하지 않아도 필요한 것을 미리 챙겨 두는 편이에요.", "말보다 표정을 먼저 읽는 ISFP에게 맞는데, 모임이 끝나면 오히려 기운이 나는 사람의 역할을 계속 요구받는 때는 맞지 않습니다."]) expect(one(B.taeo, s, { paragraph: 1 }), s).toContain("mbti_misattr");
    expect(one(B.taeo, "ISFP는 혼자 맡겨 두면 마감까지 조용히 다듬는 편이에요.", { paragraph: 1 })).not.toContain("mbti_misattr");
    for (const [t, p] of k.mbti) for (const [d, v] of Object.entries(p.dimensionTags)) if (Math.abs(v) >= 0.3) expect(poleFits(t, d, v), `${t} ${d} ${v}`).toBe(true);
    expect(Object.keys(POLE_TAGS)).toHaveLength(62);
    expect(tagFits("ISFP", POLE_TAGS["detailFocus+"])).toBe(false); expect(tagFits("ISFP", POLE_TAGS["caretaking+"])).toBe(false); expect(tagFits("ISFP", POLE_TAGS["socialEnergy+"])).toBe(false);
    // 직무 조건은 직무가 요구하는 일(POLE_DEMAND)과 그 유형에 맞는 끝으로만.
    const w = JSON.stringify(B.taeo.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]).filter(m => m.kind === "evidence"));
    expect(w).not.toMatch(/ISFP는 (숫자, 날짜|말하지 않아도|모임이 끝나면)/);
  });
  it("5 기둥 자리: 월간 비견·월지 정인을 바꿔 쓰면 pillar_claim, 브리프는 자리별 십성을 준다", () => {
    expect(B.taeo.chart.positions?.monthStem).toEqual(["비견"]); expect(B.taeo.chart.positions?.monthBranch[0]).toBe("정인");
    expect(one(B.taeo, "월지의 비견은 내 이름을 걸고 직접 하려는 마음을 키워요.", { paragraph: 1 })).toContain("pillar_claim");
    expect(one(B.taeo, "월간의 비견은 내 이름을 걸고 직접 하려는 마음을 키우고, 월지의 정인은 배움을 결과로 잇습니다.", { paragraph: 1 })).not.toContain("pillar_claim");
  });
  it("6·15 안내·면책: 작가가 쓴 안내 문장은 notice_repeat, 책 한 줄 안내는 마지막 장 끝에 한 번(투자 안내 포함)", () => {
    for (const s of ["이 장은 권유가 아니라 성향 이야기예요.", "다만 이것은 경향이고 사건을 단정하는 말은 아닙니다.", "실제 누군가를 지목하는 말은 아니에요.", "결과를 단정하는 말은 아니에요.",
      "지금 바꾸라는 말이 아니라 선택지를 넓혀 두는 이야기입니다.", "창업을 권하거나 말리는 이야기가 아니라, 작게 시험해 보면 좋다는 이야기예요."]) expect(E.isNoticeSentence(s), s).toBe(true);
    for (const s of ["맞는 조건은 일정과 방식을 혼자 정할 수 있는 작업이에요.", "당신은 하고 싶은 일을 끝까지 해내는 힘이 있어요."]) expect(E.isNoticeSentence(s), s).toBe(false);
    expect(one(B.taeo, "이 장은 투자 권유가 아니라 타고난 돈 성향을 풀이한 것이에요.", { paragraph: 1 })).toContain("notice_repeat");
    const chs: FinalChapter[] = [{ n: 1, id: "engine", title: "e", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["엔진이에요."] }] }, { n: 9, id: "roadmap", title: "r", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["마지막이에요."] }] }];
    const once = insertFixedLines(insertFixedLines(chs, B.taeo), B.taeo);
    expect(once.flatMap(c => c.sections.flatMap(s => s.paragraphs)).filter(p => E.isNoticeSentence(p))).toEqual([E.bookNotice("career_money_study")]);
  });
  it("7 한자: 작가 출력의 한자는 지우고(경고 수), 렌더 단계가 장마다 첫 등장에만 사전 표기를 붙인다(오기 0)", () => {
    expect(E.stripHanja("편인(偏人)이 강해요. 丁丑일주예요.")).toEqual({ text: "편인이 강해요. 정축일주예요.", count: 2 });
    const chs: FinalChapter[] = [1, 2].map(n => ({ n, id: `c${n}`, title: "t", source: "writer" as const, chars: 0, sections: [{ heading: "h", paragraphs: ["편인은 혼자 배우는 힘이에요. 편인이 다시 나와도 한 번만 붙여요. 정축 일주는 겨울 불이에요."] }] }));
    const r = renderTerms(chs, B.sodam, k);
    for (const c of r.chapters) { const p = c.sections[0].paragraphs[0]; expect(p.match(/편인\(偏印\)/g)).toHaveLength(1); expect(p).toContain("정축(丁丑) 일주"); }
    expect(JSON.stringify(renderWriterBrief(B.sodam, { knowledge: k }))).not.toMatch(/[一-鿿]/);
  });
  it("8 연애 상태 분기: 연애 중 2장은 오래된 사이의 매력·처음 끌렸던 모습, 4장은 표현과 대화의 리듬(고백·첫 만남 질문 없음)", () => {
    const ch = (id: string) => B.chaerin.chapters.find(c => c.id === id)!;
    expect(ch("charm").sections!.map(s => s.q)).toEqual(["사람을 끄는 내 매력은?", "오래된 사이에서 다시 보이는 내 매력은?", "처음 끌렸던 모습은 어떻게 다시 켤까?"]);
    expect(ch("contact").title).toBe("표현과 대화의 리듬");
    expect(JSON.stringify([ch("charm"), ch("contact")].map(c => c.sections!.map(s => s.q)))).not.toMatch(/프로필|첫 만남 30분|고백/);
  });
  it("10 종합: 씨앗 꼬리표 그대로는 seed_copy, 앞 장 주장·반대 주장 짝(INTP 열등 기능), 같은 일주 두 사람의 핵심 이미지가 다르고 표지 = 1장 이미지", () => {
    expect(one(B.sodam, "정화의 소수 앞 밝음과 INTP의 한두 명에게만 말하는 습관이 겹쳐요.", { paragraph: 1 })).toContain("seed_copy");
    const cl = chapterClaims(B.sodam, k);
    expect([...cl.values()].flatMap(x => x.tension).join(" ")).toMatch(/INTP 열등 기능/);
    const hc = P6B_CASES.find(c => c.id === "c1-full")!, hn = normalizeReportInputPayload(hc.payload as never, { now: () => new Date("2026-11-04T05:00:00Z") });
    if (!hn.ok) throw new Error(hn.error);
    const haram = buildBrief(payloadToBriefInput(hn.value as never, "2026-11-04") as never, k);
    expect(haram.chart.pillars.day.hangul).toBe(B.sodam.chart.pillars.day.hangul);
    expect(haram.chart.coreImage.line).not.toBe(B.sodam.chart.coreImage.line);
    expect(coverLineOf("빗속에서도 꺼지지 않는 카페 불빛", B.sodam).line).toBe(B.sodam.chart.coreImage.line);
  });
});

describe("P6e B·C 요청·품질 11~21", () => {
  it("12 본문 기준일 줄 없음, 기준일은 판 표기에만", () => {
    const out = insertFixedLines([{ n: 1, id: "a", title: "a", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["첫 문단이에요."] }] }], B.sodam);
    expect(out[0].sections[0].paragraphs[0]).toBe("첫 문단이에요.");
    expect(v5EditionLabel({ edition: { number: 6, label: "제6판", revisedAt: "2026-11-04" }, baseDate: "2026-11-04" } as V5BookDraft)).toBe("제6판 · 2026년 11월 4일 기준");
  });
  it("11 책 첫 쪽 만세력 칸의 '내 사주의 다른 기운 보기' 링크 없음(부록 쪽은 그대로)", () => {
    const src = readFileSync(join(ROOT, "src/app/dev/book-preview/BookReader.tsx"), "utf8");
    expect(src).not.toMatch(/다른 기운들? 보기/);
    expect(src).toMatch(/page\.kind === "appendix"/);
  });
  it("14 다섯 힘 쉬운 이름: 브리프는 '내 방식의 힘(비겁)' 꼴, 검사는 쉬운 이름의 세기 말도 엔진 단계와 견준다", () => {
    expect(B.taeo.chart.groups!.line).toMatch(/^내 방식의 힘\(비겁\) 강 · 만드는 힘\(식상\) 강 · 값을 받는 힘\(재성\) 약 · 규칙의 힘\(관성\) 약 · 배우는 힘\(인성\) 보통/);
    expect(groupClaims("규칙의 힘이 강해서 절차를 즐겨요.")).toEqual([{ group: "관성", level: "강" }]);
    expect(one(B.taeo, "규칙의 힘이 강해서 절차를 즐겨요.", { paragraph: 1 })).toContain("group_claim");
  });
  it("16 씨앗 직업군·상태 태그: 모든 MBTI 씨앗에 ctx, 카페 사장·물리치료사·구직자에게 맞지 않는 씨앗·소품이 가지 않는다", () => {
    for (const [, seeds] of k.mbtiSeeds) for (const list of Object.values(seeds)) for (const s of list) expect(s.ctx, s.text).toEqual(sceneTagsOf(s.text));
    const text = (b: Brief) => JSON.stringify(renderWriterBrief(b, { knowledge: k }));
    expect(text(B.sodam)).not.toMatch(/작은 프로그램|보고서 서론|업무 지시/);
    expect(text(B.chaerin)).not.toMatch(/연차 눈치|보고서 수정본/);
    expect(text(B.taeo)).not.toMatch(/팀에 나눠/);
  });
  it("17 MBTI 기능 이어 쓰기는 '~와 ~'로 풀고(fn_join), 약어는 렌더 단계가 장마다 첫 등장에 붙인다", () => {
    const ctx = ctxOf(B.taeo);
    const t = tidyBook([{ n: 1, id: "a", title: "a", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["이 솜씨는 ISFP의 속마음의 가치 기준(Fi)-지금 이 순간 감각(Se) 감각과 겹쳐요."] }] }], ctx).chapters[0].sections[0].paragraphs[0];
    expect(t).not.toMatch(/[-–]|\((Fi|Se)\)|감각 감각/);
    const r = renderTerms([1, 2].map(n => ({ n, id: `c${n}`, title: "t", source: "writer" as const, chars: 0, sections: [{ heading: "h", paragraphs: [t, t] }] })), B.taeo, k).chapters;
    for (const c of r) expect(c.sections[0].paragraphs.join(" ").match(/\(Fi\)/g)).toHaveLength(1);
  });
  it("18 같은 일주 장면은 고객 해시로 돌린다: 장소담 브리프에 하람이 받은 '국물을 데워 두는' 장면이 없다", () => {
    expect(JSON.stringify(B.sodam)).not.toMatch(/국물을 데워/);
  });
  it("19 숫자 표기: 한 자리 수 + 고유어 단위는 고유어 수, 날짜·한자어 단위는 숫자", () => {
    expect(E.nativeNumbers("남은 해는 1해이고 3번 만나요. 11월 4일, 2개월, 3년.").text).toBe("남은 해는 한 해이고 세 번 만나요. 11월 4일, 2개월, 3년.");
    expect(koCount(1, "해")).toBe("한 해"); expect(koCount(12, "달")).toBe("12달");
    expect(JSON.stringify(B.taeo)).not.toMatch(/뒤로 \d해/);
  });
  it("20 궁합 관계 목록: 같은 관계는 한 줄로 합친다", () => {
    const rel = B.pair.compatibility!.dayRelations;
    expect(rel.filter(r => /파\(/.test(r))).toHaveLength(1);
    expect(rel.some(r => /태어난 해·달 땅 글자 모두/.test(r))).toBe(true);
  });
  it("21 비문 꼴은 awkward", () => {
    expect(one(B.taeo, "어차피 비겁이 강한 당신은 지분이 불분명하면 손해를 보기 쉬워요.", { paragraph: 1 })).toContain("awkward");
    expect(one(B.sodam, "마감 전날 직원에게 커피를 챙기는 점심 같은 작은 배려로 나타나죠.", { paragraph: 1 })).toContain("awkward");
  });
});

describe("P6e 짧은 소제목(분량 하한선)", () => {
  it("문단 3개 미만·짧은 소제목은 short_section(문체, 빼지 않음) → 수리가 겹치지 않는 새 문단 하나만 뒤에 붙인다(원문은 그대로)", () => {
    const chs: FinalChapter[] = [{ n: 2, id: "now", title: "t", source: "writer", chars: 0, sections: [{ heading: "a", paragraphs: ["첫 문단이에요. 근거가 있어요.", "둘째 문단이에요. 행동이 있어요."] }, { heading: "b", paragraphs: ["하나예요.", "둘이에요.", "셋이에요."] }] }];
    const flags = lintBook(chs, ctxOf(B.taeo)).filter(f => f.rule === "short_section");
    expect(flags.map(f => `${f.section}.${f.paragraph}`)).toEqual(["0.1"]);
    expect(HARD_RULES.has("short_section")).toBe(false);
    const t = repairTargets(flags, chs);
    const prompt = repairPrompt(B.taeo, chs, t, renderWriterBrief(B.taeo, { knowledge: k })).user;
    expect(prompt).toContain("덧붙일 새 문단 하나"); expect(prompt).toContain("첫 문단이에요.");
    const out = applyRepairs(chs, t, parseRepair("[P1] 새로 더한 문단이에요. 다른 근거예요.")).chapters[0].sections[0].paragraphs;
    expect(out).toEqual(["첫 문단이에요. 근거가 있어요.", "둘째 문단이에요. 행동이 있어요.", "새로 더한 문단이에요. 다른 근거예요."]);
  });
});

describe("P6e 부모 역할 장(자녀 미입력): 가정·명식 설명은 통과, 자녀가 있다는 단정만 잡는다", () => {
  const facts = { birthTimeKnown: true, mbti: "INFP", relationship: "single", children: "unknown", job: "employed" } as const;
  it("r1에서 소제목을 뺐던 세 문장은 부모 역할 장에서 통과, 다른 장에서는 그대로 잡힌다", () => {
    for (const s of ["아이를 키우는 일은 이 성향이 가장 크게 드러나는 영역일 수 있어요.", "자녀를 떠올리게 되는 자리는 이 사주에서 겉으로 드러나 있지 않아요.", "상상으로 아이의 마음을 읽는 재능이 이미 있으니, 일상의 틀만 달력에 맡기면 돼요."]) {
      expect(sentenceViolation(s, facts as never, undefined, false, true)).toBeNull();
      expect(sentenceViolation(s, facts as never, undefined, false, false)).toBe("fact_children");
    }
  });
  it("아이가 이미 있다고 단정하면 부모 역할 장에서도 fact_children", () => {
    for (const s of ["아이가 있으니 주말 계획이 늘 먼저예요.", "우리 아이는 당신을 닮았어요.", "아이를 키우고 있는 지금은 쉬는 시간이 부족해요.", "딸이 어린이집에 다니는 동안 시간을 써 보세요."]) expect(sentenceViolation(s, facts as never, undefined, false, true)).toBe("fact_children");
  });
  it("lintContext는 부모 역할 장(parenting)을 childChapters로 넘긴다", () => {
    const ctx = ctxOf(B.chaerin);
    const plan = buildWriterPrompt(B.chaerin, { knowledge: k }).chapters;
    expect([...(ctx.childChapters ?? [])]).toEqual(plan.filter(ch => ch.id === "parenting").map(ch => ch.n));
  });
});

describe("P6e 판독 뒤 원인 수정(r1·r4 장별 판독)", () => {
  it("직업 입력에 분야 낱말이 있으면 상태 직업군(구직·자영업)보다 분야 쪽: 권태오 직군 1순위는 목표 분야(마케팅), 물류·운송 직군 없음", () => {
    expect(matchJob("마케팅 직무 재취업준비")?.id).toBe("marketer");
    expect(matchJob("카페 사장")?.id).toBe("cafe");
    expect(matchJob("재취업준비")?.id).toBe("job-seeker");
    expect(matchJob("자영업")?.id).toBe("self-employed");
    const text = JSON.stringify(B.taeo);
    expect(text).toMatch(/1순위 직군: [^"]*마케팅·브랜드 직군\(지금 목표·직업 분야\)/);
    expect(text).not.toMatch(/택배 기사|항공 조종사|시내버스 기사/);
  });
  it("남은 안내 꼴('권하는 글이 아니라', '사건이 아니라 분위기를 말하는 이야기')은 안내 문장, 작가 용어 '조건형'은 내부 용어", () => {
    expect(E.isNoticeSentence("이 장은 투자를 권하는 글이 아니라 성향을 읽는 글이에요.")).toBe(true);
    expect(E.isNoticeSentence("이건 사건이 아니라 분위기를 말하는 이야기예요.")).toBe(true);
    expect(E.isNoticeSentence("이 해들은 평가와 문서를 마주할 일이 늘어나요.")).toBe(false);
    const sf = { birthTimeKnown: true, mbti: "ISFP", relationship: "single", children: "unknown", job: "other" } as never;
    for (const s of ["어느 쪽이든 조건형으로 생각하면 됩니다.", "상황 씨앗처럼 같이 모을 돈 이야기를 한 번 꺼내 보는 일이 좋은 연습이 됩니다.", "지금은 솔로이고 자녀 이야기는 입력에 없으니 가볍게 읽어요."]) expect(sentenceViolation(s, sf)).toBe("internal_term");
    for (const s of ["결혼의 시기나 여부는 여기서 말하지 않아요.", "만남이나 결혼, 이별을 단정해서 말하지는 않아요.", "결혼관은 성향의 이야기일 뿐, 시기나 여부를 정하는 이야기가 아닙니다."]) expect(E.isNoticeSentence(s)).toBe(true);
  });
  it("장 재료의 MBTI 기능 줄은 쉬운 이름을 함께 준다(연애 r1 기능 이름 0회), 기능 목록은 이름(약어) · 역할: 방향", () => {
    const wb = JSON.stringify(renderWriterBrief(B.chaerin, { knowledge: k }));
    expect(wb).toMatch(/연애 기능: 분위기를 읽는 마음: /);
    expect(wb).toMatch(/"분위기를 읽는 마음\(Fe\) · 주기능: [^"]*"/);
    expect(wb).not.toMatch(/주기능: 분위기를 읽는 마음:/);
  });
});

describe("P6e H 저장된 P6d 최종 4권을 새 검사로 다시 읽으면 인용 문장이 걸린다", () => {
  const read = (id: string) => JSON.parse(readFileSync(join(ROOT, "docs/v5/baseline/p6d", `${id}.snapshot.json`), "utf8")) as { draft: V5BookDraft };
  const flagsOf = (id: string, b: Brief) => lintBook(read(id).draft.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, sections: c.sections, source: "writer" as const, chars: 0, ...(c.keys ? { keys: c.keys } : {}) })), ctxOf(b));
  const hit = (flags: ReturnType<typeof flagsOf>, rule: string, part: string) => flags.some(f => f.rule === rule && f.sentence.includes(part));
  it("커리어(권태오)", () => {
    const f = flagsOf("taeo-career", B.taeo);
    expect(hit(f, "guide_copy", "입력하지 않은 경력과 연차는 쓰지 마세요")).toBe(true);
    expect(hit(f, "orphan_start", "성격도 같은 쪽을 가리킵니다")).toBe(true);
    expect(hit(f, "pillar_claim", "월지의 비견")).toBe(true);
    for (const p of ["구체 사실을 하나씩 확인하는", "숫자와 날짜를 먼저 확인하는", "말하지 않아도 필요한 것을 미리 챙겨 두는", "모임이 끝나면 오히려 기운이 나는"]) expect(hit(f, "mbti_misattr", p), p).toBe(true);
    expect(hit(f, "notice_repeat", "이 장은 권유가 아니라 성향 이야기예요")).toBe(true);
    expect(hit(f, "fn_join", "가치 기준(Fi)-지금 이 순간 감각(Se)")).toBe(true);
    expect(hit(f, "awkward", "어차피 비겁이 강한 당신은")).toBe(true);
  });
  it("연애(문채린)·궁합·종합(장소담)", () => {
    expect(hit(flagsOf("chaerin-love", B.chaerin), "orphan_start", "여기에 식신(食神)의 다정함이 더해집니다")).toBe(true);
    expect(hit(flagsOf("pair-business", B.pair), "feature_owner", "백은솔님에게는 겁살(劫煞)")).toBe(true);
    const s = flagsOf("sodam-full", B.sodam);
    expect(hit(s, "seed_copy", "정화의 소수 앞 밝음과")).toBe(true);
    expect(hit(s, "awkward", "커피를 챙기는 점심 같은")).toBe(true);
  });
});
