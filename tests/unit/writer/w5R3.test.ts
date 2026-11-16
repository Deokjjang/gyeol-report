// W5 R3 나머지 고칠 곳(외부 호출 0, 가상 인물 + 합성 문장): F3 판정어 풀어쓰기 틀 · F4 씨앗 장면 단정 · F5 3인칭 물음 · F7 칸 이름 노출 · F8 궁합 성격표 ↔ 차이 줄 · 지식 DB 9건.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { exposureHits } from "@/lib/writer/safety/exposure";
import { conditionalScene, lintBook, tidyBook, type LintCtx } from "@/lib/writer/safety/p6c";
import { modeOf } from "@/lib/writer/repairPlan";
import { renderWriterBrief } from "@/lib/writer/prompt";
import { plainGrade } from "@/lib/brief/cards/features";
import { applyProfile, PROFILE_CUES } from "@/lib/brief/pairProfile";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const ch = (n: number, sections: string[][]) => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer" as const, chars: 0, sections: sections.map((ps, i) => ({ heading: `소제목 ${i}`, paragraphs: ps })) });
const baseCtx = (extra: Partial<LintCtx> = {}): LintCtx => ({
  facts: { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "unknown", job: "employee" }, jobDetail: "", schoolStage: "none", coreImage: "x",
  nicknames: [], corpus: new Set(), prior: [], jobProps: [], noJobChapters: new Set(), parentingChapters: new Set(), monthChapters: new Set(), compat: false, mbtiPlain: {}, ...extra,
} as LintCtx);

describe("R3 F3 · F7 노출", () => {
  it("「보통 세기·중간 세기·있는 만큼 쓰는 쪽·보통 수준」은 grade 노출, 「언제·무엇에·얼마나」 칸 이름은 rule 노출(문장 떼기)", () => {
    for (const s of ["한결님에게 보통 세기라서 무리가 없어요.", "규칙의 힘이 있는 만큼 쓰는 쪽이에요.", "만드는 힘은 중간 세기로 있어요.", "보통 수준의 힘이라 무난해요."]) expect(exposureHits(s).map(h => h.id), s).toContain("plain_frame");
    expect(exposureHits("돈이 언제 새는지, 무엇에 쓰는지, 얼마나 쓰는지를 적어 두세요.").map(h => h.id)).toContain("field_name");
    for (const s of ["보통은 주말에 쉬어요.", "언제든 물어보세요.", "중간에 멈추지 않아요."]) expect(exposureHits(s), s).toEqual([]);
    expect(modeOf("rule_leak")).toBe("drop");
  });
  it("작가 브리프: 묶음 세기 「보통」은 주지 않고(넉넉·적음만), 재료 글의 「재성 보통」은 등급 말 없이", () => {
    const b = buildBrief({ product: "saju_mbti_full", baseDate: "2026-11-14", person: person("minjun", "c3", "ESFJ") }, k);
    const w = JSON.stringify(renderWriterBrief(b, { knowledge: k }));
    expect(w).not.toContain("있는 만큼 쓰는 쪽");
    expect(plainGrade("재성 보통, 관성 강")).toBe("재성, 관성 넉넉한 쪽");
    expect(plainGrade("식상이 보통이라 무난해요")).toBe("식상이 있어 무난해요");
  });
});

describe("R3 F4 씨앗 장면 단정 · F5 3인칭 물음", () => {
  const seedScenes = new Map([["1.0", ["사람을 많이 만난 날 저녁엔 헬스장에서 이어폰을 끼고 혼자 기구를 돌리며 하루를 정리합니다."]]]);
  it("씨앗으로만 받쳐진 장면을 이 사람의 버릇으로 단정 → seed_assert(문장 떼기) · 「~할 때」 조건·물음·입력 소품으로 받쳐진 장면은 아님", () => {
    const book = [ch(1, [["당신은 사람을 많이 만난 날 저녁엔 헬스장에서 이어폰을 끼고 기구를 돌리며 하루를 정리해요. 근거 문장이에요. 또 다른 문장이에요."]])];
    const flags = lintBook(book, baseCtx({ seedScenes })).filter(f => f.rule === "seed_assert");
    expect(flags.length).toBe(1);
    expect(modeOf("seed_assert")).toBe("drop");
    const cond = [ch(1, [["사람을 많이 만난 날 헬스장에서 이어폰을 끼고 기구를 돌릴 때 하루가 정리되는 편이에요. 근거 문장이에요. 또 다른 문장이에요."]])];
    expect(lintBook(cond, baseCtx({ seedScenes })).filter(f => f.rule === "seed_assert")).toEqual([]);
    // 같은 장면 낱말이 모두 입력 소품(sceneHint·직업 장면)에도 있으면 이 고객 입력이 받친 장면이다.
    expect(lintBook(book, baseCtx({ seedScenes, sceneProps: flags[0].detail!.split("·") })).filter(f => f.rule === "seed_assert")).toEqual([]);
    expect(conditionalScene("일정을 정할 때 먼저 묻는 편이에요.")).toBe(true);
    expect(conditionalScene("주말이면 늘 헬스장에 가요.")).toBe(false);
  });
  it("한 사람 책의 독자 물음 「이 사람은 ~편이죠?」 → 「당신은 ~편이죠?」(서술문·궁합은 그대로)", () => {
    const book = [ch(1, [["이 사람은 두세 가지만 보고 정하는 편이죠? 이 사람의 결정은 빨라요."]])];
    const t = tidyBook(book, baseCtx({ seedScenes })).chapters[0].sections[0].paragraphs[0];
    expect(t).toBe("당신은 두세 가지만 보고 정하는 편이죠? 이 사람의 결정은 빨라요.");
    expect(tidyBook(book, baseCtx({ seedScenes, compat: true })).chapters[0].sections[0].paragraphs[0]).toBe("이 사람은 두세 가지만 보고 정하는 편이죠? 이 사람의 결정은 빨라요.");
  });
});

describe("R3 F8 궁합 성격표 ↔ 차이 줄 · 지식 DB 9건", () => {
  it("성격표 「새 제안은 묵혔다가」(J)면 위험 감수·새것 찾기 차원도 그 값(−), 「돈은 계획해」면 돈 조절 +", () => {
    const v = applyProfile(new Map([["riskTaking", 0.9], ["noveltySeeking", 0.7], ["spendingControl", -0.8]]), { energy: "E", lead: "front", conflict: "now", express: "말", decide: "fast", offer: "hold", money: "plan" });
    expect([v.get("riskTaking"), v.get("noveltySeeking"), v.get("spendingControl")]).toEqual([-1, -1, 1]);
    const b = buildBrief({ product: "saju_mbti_compatibility", baseDate: "2026-11-14", person: person("doyun", "c2", "ENTJ"), partner: person("jiwoo", "c2", "ISTJ"), relationshipType: "love" } as BriefInput, k);
    const diffs = b.compatibility!.differences, risky = k.ontology.dimensions.find(d => d.id === "riskTaking")!.poles.plus.description;
    // 두 사람 다 J(「새 제안은 묵혔다가」)라 「일단 시작하고 가면서 고치는」은 어느 쪽 차이 줄에도 나오지 않는다.
    expect(diffs.some(d => d.a === risky || d.b === risky)).toBe(false);
  });
  it("극 설명 3개 바꿈 + 그 문구에 기대는 단서(mbtiFn POLE_CUES·pairProfile)가 새 문구를 잡는다 · 태그 삭제(챙김·원진·반대 행동 쌍)", () => {
    const pole = (id: string, side: "plus" | "minus") => k.ontology.dimensions.find(d => d.id === id)!.poles[side].description;
    expect(pole("independence", "minus")).toBe("혼자 붙들기보다 처음부터 도움을 구하고 같이 푸는 편입니다.");
    expect(pole("attentionSeeking", "minus")).toBe("앞에 나서기보다 뒤에서 조용히 제 몫을 하는 자리가 편한 편입니다.");
    expect(pole("reactivity", "plus")).toBe("거슬리는 말이나 일에 그 자리에서 바로 반응이 나오는 편입니다.");
    expect(PROFILE_CUES.back.test(pole("attentionSeeking", "minus"))).toBe(true);
    const tags = (id: string) => k.features.get(id)!.dimensionTags as Record<string, number>;
    expect(tags("structure:RESOURCE_HEAVY").caretaking).toBeUndefined();
    expect(tags("gwiin:AMROK").caretaking).toBeUndefined();
    expect(tags("gwiin:GEUMYEO").caretaking).toBeUndefined();
    expect(tags("tenGod:正印").caretaking).toBe(0.5);
    for (const d of ["detailFocus", "trustThreshold", "conflictApproach"]) expect(tags("shinsal:WONJIN")[d]).toBeUndefined();
    expect(tags("dayMaster:辛").reactivity).toBeUndefined(); expect(tags("dayPillar:己卯").reactivity).toBeUndefined();
    expect(tags("dayPillar:己巳").reactivity).toBe(0.5); expect(tags("dayPillar:癸巳").reactivity).toBe(0.8);
    expect(tags("dayPillar:壬辰").conflictApproach).toBeUndefined();
    expect(tags("element:WOOD:MISSING").planning).toBeUndefined(); expect(tags("element:FIRE:MISSING").directness).toBeUndefined();
    expect(tags("tenGod:食神").socialEnergy).toBe(0.4);
    // 규칙(한 항목 안 반대 행동 쌍은 약한 쪽 삭제)을 지식 DB 전체에 다시 돌려 0.
    const PAIRS: [string, number, string, number][] = [["directness", 1, "reactivity", -1], ["directness", 1, "conflictApproach", -1], ["reactivity", 1, "conflictApproach", -1], ["reactivity", 1, "emotionalExpression", -1], ["reactivity", -1, "conflictApproach", 1], ["planning", -1, "ruleAdherence", 1]];
    const left = [...k.features.values()].filter(f => PAIRS.some(([a, sa, b, sb]) => ((f.dimensionTags as Record<string, number>)[a] ?? 0) * sa >= 0.3 && ((f.dimensionTags as Record<string, number>)[b] ?? 0) * sb >= 0.3)).map(f => f.id);
    expect(left).toEqual([]);
  });
});
