import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { customerProps, matchJob } from "@/lib/brief/props";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { applySafetyNet, sentenceViolation, type DraftChapter } from "@/lib/writer/safety";
import { briefCopyMetric, connectorRepeats } from "@/lib/writer/safety/metrics";
import { fixBackrefs, mergeShrunk } from "@/lib/writer/safety/tidy";
import { chapterChars, type BookSection } from "@/lib/writer/format";
import { DET_MIN_CHARS } from "@/lib/writer/deterministic";
import { PEOPLE } from "../../../tools/p35/people";

const k = loadKnowledge();
const base = "2026-10-29";
const facts = { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "none", job: "employed" } as const;

describe("P3.5 안전망·작가 보강", () => {
  it("A6: 스스로 김빼는 말·이별 권유를 지우고, 행동 묘사는 남긴다", () => {
    expect(sentenceViolation("물론 궁합은 과학적 근거가 없는 재미일 뿐이에요.", facts)).toBe("self_deflating");
    expect(sentenceViolation("이 풀이는 그냥 재미로 보는 이야기입니다.", facts)).toBe("self_deflating");
    expect(sentenceViolation("이런 사이라면 헤어지는 게 나을 수도 있어요.", facts)).toBe("breakup_advice");
    expect(sentenceViolation("숫자와 근거가 없으면 도장을 찍지 않습니다.", facts)).toBeNull();
    expect(sentenceViolation("오래 참다가 어느 날 관계를 끊습니다.", facts)).toBeNull();
  });

  it("C3: 궁합 점수·구간과 어긋나는 말을 지운다", () => {
    const f = { ...facts, compat: { score: 68, band: "맞춰 가면 좋아지는" } };
    expect(sentenceViolation("두 사람은 타고난 짝입니다.", f)).toBe("band_mismatch");
    expect(sentenceViolation("두 사람은 서로 다른 세계에서 왔어요.", f)).toBe("band_mismatch");
    expect(sentenceViolation("최악의 궁합이라는 말은 잊으세요.", f)).toBe("band_mismatch");
    expect(sentenceViolation("두 사람의 궁합은 82점입니다.", f)).toBe("score_mismatch");
    expect(sentenceViolation("두 사람의 궁합은 68점, 맞춰 가면 좋아지는 사이입니다.", f)).toBeNull();
    expect(sentenceViolation("두 사람은 타고난 짝입니다.", { ...f, compat: { score: 92, band: "타고난 짝" } })).toBeNull();
  });

  it("A4: 삭제로 2문장 이하가 된 소제목은 앞 소제목에 합친다(첫 소제목이면 다음에)", () => {
    const a: BookSection = { heading: "하나", paragraphs: ["첫 문장입니다. 둘째 문장입니다. 셋째 문장입니다."] };
    const b: BookSection = { heading: "둘", paragraphs: ["남은 한 문장입니다."] };
    const c: BookSection = { heading: "셋", paragraphs: ["원래 짧은 소제목입니다."] };
    const r = mergeShrunk([a, b, c], new Set([b]));
    expect(r.merged).toBe(1);
    expect(r.sections.map(s => s.heading)).toEqual(["하나", "셋"]); // c는 삭제가 없어 그대로
    expect(r.sections[0].paragraphs.at(-1)).toContain("남은 한 문장입니다.");
    const first = mergeShrunk([b, a], new Set([b]));
    expect(first.sections).toHaveLength(1); expect(first.sections[0].paragraphs[0].startsWith("남은 한 문장입니다.")).toBe(true);
  });

  it("A4: 소개되지 않은 '앞에서 본 X'는 쉬운 이름 + 이미지로 처음 소개한다", () => {
    const brief = buildBrief({ product: "saju_mbti_full", person: PEOPLE.c1, baseDate: base }, k);
    const t = brief.traits[1];
    const sections: BookSection[] = [{ heading: "h", paragraphs: [`앞에서 본 ${t.easyName} 기운은 돈 앞에서도 움직입니다.`] }];
    const fresh = fixBackrefs(sections, brief, { text: "" });
    expect(fresh.fixed).toBe(1);
    expect(fresh.sections[0].paragraphs[0]).toContain(t.image.metaphor);
    expect(fresh.sections[0].paragraphs[0]).not.toContain("앞에서 본");
    const known = fixBackrefs(sections, brief, { text: `당신에게는 ${t.easyName}이 있습니다.` });
    expect(known.fixed).toBe(0);
    // X 없는 "앞에서 본 것처럼": 앞 글이 있으면 그대로, 없으면 의존명사까지 지워 깨진 문장을 남기지 않는다(P3.8 r2).
    const generic: BookSection[] = [{ heading: "h", paragraphs: ["앞에서 본 것처럼 당신은 지친 걸 가장 늦게 압니다."] }];
    expect(fixBackrefs(generic, brief, { text: "몸이 먼저 말합니다." })).toMatchObject({ fixed: 0, sections: generic });
    expect(fixBackrefs(generic, brief, { text: "" }).sections[0].paragraphs[0]).toBe("당신은 지친 걸 가장 늦게 압니다.");
  });

  it("A1·A2: 브리프 일치 비율과 연결 어구 반복을 메타에 기록한다(지우지 않음)", () => {
    const brief = buildBrief({ product: "saju_mbti_full", person: PEOPLE.c1, baseDate: base }, k);
    const scene = brief.chapters.flatMap(c => c.materials).find(m => m.kind === "trait" && m.scene)!;
    const copied = { heading: "h", paragraphs: [`${(scene as { scene: string }).scene} 이 기운 때문에 그렇습니다. 이 기운 때문에 또 그렇습니다. 이 기운 때문에 늘 그렇습니다.`] };
    const m = briefCopyMetric(brief, [{ sections: [copied], source: "writer" }]);
    expect(m.writerMatched).toBeGreaterThanOrEqual(1);
    expect(connectorRepeats([{ sections: [copied], source: "writer" }])).toEqual([{ phrase: "이 기운 때문에", count: 3 }]);
    const plan = buildWriterPrompt(brief).chapters;
    const drafts = new Map<number, DraftChapter>(plan.map(ch => [ch.n, { source: "writer", chapter: { n: ch.n, title: ch.title, sections: [copied, { heading: "x", paragraphs: ["채움 문장입니다. ".repeat(80)] }] } }]));
    const { report } = applySafetyNet(brief, plan, drafts);
    expect(report.metrics?.briefCopy.writerSentences).toBeGreaterThan(0);
    expect(report.metrics?.connectors.length).toBeGreaterThanOrEqual(0);
  });

  it("A7: 결정론 작가 비반복 장은 대부분 900자 이상(c1·X·Y 종합, c2 연애, 커리어)", () => {
    const cases = [["saju_mbti_full", PEOPLE.c1], ["saju_mbti_full", PEOPLE.x], ["saju_mbti_full", PEOPLE.y], ["love_marriage_child", PEOPLE.c2], ["career_money_study", PEOPLE.x]] as const;
    for (const [product, person] of cases) {
      const brief = buildBrief({ product, person, baseDate: base }, k), plan = buildWriterPrompt(brief).chapters;
      const { chapters } = applySafetyNet(brief, plan, new Map());
      for (const c of chapters) if (!c.keys) expect(chapterChars({ n: c.n, title: c.title, sections: c.sections }), `${product} ${c.n}`).toBeGreaterThanOrEqual(DET_MIN_CHARS);
    }
  });

  it("A1: 소품 사전 — 직업군 매칭과 장마다 장면 변주 힌트", () => {
    expect(matchJob("서비스 기획자")?.props).toContain("출시 일정");
    expect(matchJob("간호사")?.name).toBe("간호사");
    const brief = buildBrief({ product: "saju_mbti_full", person: PEOPLE.x, baseDate: base }, k);
    const hinted = brief.chapters.filter(c => c.sceneHint?.length);
    expect(hinted.length).toBe(brief.chapters.length);
    const props = customerProps({ detailJob: "간호사", jobStatus: "employee", age: 37 }, { relationship: "married", children: "unknown", job: "employed" });
    expect(hinted.some(c => c.sceneHint!.some(p => props.job.props.includes(p)))).toBe(true);
    // 궁합은 개인 소품 힌트를 넣지 않는다
    const pair = buildBrief({ product: "saju_mbti_compatibility", person: PEOPLE.c1, partner: PEOPLE.y, relationshipType: "love", baseDate: base }, k);
    expect(pair.chapters.every(c => !c.sceneHint)).toBe(true);
  });
});
