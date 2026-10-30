import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, sceneFits, type Brief, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { GROUPS } from "@/lib/brief/traits";
import type { SceneRequires } from "@/data/knowledge-v5/schema";
import { createRng } from "@/lib/brief/seed";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-10-27";
const person = (key: string, ctx?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};

// 장면 원문 → 사실 조건(지식 DB 전체)
const sceneIndex = new Map<string, SceneRequires>();
for (const f of k.features.values()) for (const list of Object.values(f.scenes)) for (const s of list) sceneIndex.set(s.text, s.requires);
for (const p of k.mbti.values()) for (const list of Object.values(p.signals)) for (const s of list) sceneIndex.set(s.text, s.requires);
for (const rules of k.fusionByFeature.values()) for (const r of rules) if (r.scene) sceneIndex.set(r.scene.text, r.scene.requires);
for (const e of k.tenGodPeriod.values()) for (const s of [...e.year.scenes, ...e.month.scenes]) sceneIndex.set(s.text, s.requires);

function scenesOf(b: Brief): string[] {
  return [
    ...b.chapters.flatMap(c => c.materials.flatMap(m => ((m.kind === "trait" || m.kind === "mbti") && m.scene ? [m.scene] : []))),
    ...b.traits.flatMap(t => (t.fusion?.scene ? [t.fusion.scene] : [])),
    ...(b.timeline?.entries.flatMap(e => (e.material.scene ? [e.material.scene] : [])) ?? []),
  ];
}
function digest(b: Brief) {
  return {
    traits: b.traits.map(t => `${t.id} ${t.featureId} ${t.strength} ${t.positions.join(",")} ${t.fusion ? `${t.fusion.target}/${t.fusion.kind}` : "-"} [${t.chapters.join(",")}]`),
    fortunes: b.fortunes.map(f => f.featureId), shadows: b.shadows.map(s => s.traitId), unused: b.unused.map(u => u.key),
    chapters: b.chapters.map(c => `${c.id}: ${c.materials.map(m => (m.kind === "trait" ? `${m.traitId}/${m.domain}/${m.angle}` : m.kind === "ref" ? m.ref : m.kind === "evidence" ? `ev:${m.key}` : m.kind === "timeline" ? `tl:${m.entryKey}` : m.kind === "rel" ? `rel:${m.topic}` : `mbti/${m.domain}`)).join(" ")}`),
    timeline: b.timeline?.entries.map(e => `${e.key} ${e.ganji.hanja} ${e.tenGod.stem} f${e.flow.score} ${e.badges.map(x => x.kind).join("+") || "-"} ${e.action.templateId}`),
    chart: `${b.chart.pillars.year.hanja} ${b.chart.pillars.month.hanja} ${b.chart.pillars.day.hanja} ${b.chart.pillars.hour?.hanja ?? "-"} ${b.chart.thisYear.ganji.hanja}`,
    tokens: b.budget.estimatedTokens,
  };
}

describe("brief builder — 고정 입력 스냅샷", () => {
  const fixed: [string, BriefInput][] = [
    ["c1 종합", { product: "saju_mbti_full", person: person("haram", "c1"), baseDate }],
    ["c2 연애(시간 미상)", { product: "love_marriage_child", person: person("seoyun", "c2"), baseDate }],
    ["c3 커리어(MBTI 없음)", { product: "career_money_study", person: person("minjun", "c3"), baseDate }],
    ["c1 세운", { product: "annual_fortune", person: person("haram", "c1"), baseDate, selectedYear: 2026 }],
    ["c2 대운", { product: "major_fortune", person: person("seoyun", "c2"), baseDate }],
    ["궁합 연인", { product: "saju_mbti_compatibility", person: person("haram"), partner: person("jiwoo"), relationshipType: "love", baseDate }],
  ];
  it.each(fixed)("%s", (_, input) => { expect(digest(buildBrief(input, k))).toMatchSnapshot(); });
});

// ---------- 성질 테스트: 무작위 고객(결정론 PRNG) ----------
const MBTIS = [...k.mbti.keys()];
const REL = ["", "single", "some", "dating", "married"], JOB = ["", "student", "employee", "freelancer", "self_employed", "business_owner", "homemaker"];
function randomPerson(i: number): BriefPersonInput {
  const r = createRng(9000 + i);
  const y = 1950 + r.int(60), m = 1 + r.int(12), d = 1 + r.int(28);
  const unknown = r.next() < 0.4;
  return {
    name: `고객${i}`, gender: (["MALE", "FEMALE", ""] as const)[r.int(3)],
    birthDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    birthTime: unknown ? "" : `${String(r.int(24)).padStart(2, "0")}:${String(r.int(60)).padStart(2, "0")}`, birthTimeUnknown: unknown,
    mbtiType: r.next() < 0.25 ? "" : r.pick(MBTIS),
    context: { relationshipStatus: r.pick(REL), jobStatus: r.pick(JOB), detailJob: "", children: (["has", "none", "unknown"] as const)[r.int(3)] },
  };
}
const PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune"] as const;
const samples: { input: BriefInput; brief: Brief }[] = [];
for (let i = 0; i < 30; i++) {
  const input: BriefInput = { product: PRODUCTS[i % PRODUCTS.length], person: randomPerson(i), baseDate, ...(i % PRODUCTS.length === 4 ? { selectedYear: 2026 } : {}) };
  try { samples.push({ input, brief: buildBrief(input, k) }); } catch (e) {
    // 절기 경계일 + 시간 미상은 calculateSaju가 거절한다(기존 동작). 그 밖의 실패는 테스트 실패.
    if (!String(e).includes("Uncertain")) throw e;
  }
}
const pairTypes = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const;
pairTypes.forEach((rt, i) => {
  const input: BriefInput = { product: "saju_mbti_compatibility", person: randomPerson(100 + i), partner: randomPerson(200 + i), relationshipType: rt, baseDate };
  try { samples.push({ input, brief: buildBrief(input, k) }); } catch (e) { if (!String(e).includes("Uncertain")) throw e; }
});

describe("brief builder — 성질", () => {
  it("표본이 충분하다", () => { expect(samples.length).toBeGreaterThanOrEqual(30); });

  it("사실 조건 위반 장면 0 (모든 장면이 고객 프로필에 맞는다)", () => {
    for (const { brief } of samples) {
      const f = brief.person.facts;
      const profile = { relationship: f.relationship, children: f.children, job: f.job.class };
      for (const s of scenesOf(brief)) {
        const req = sceneIndex.get(s);
        expect(req, `지식 DB에 없는 장면: ${s}`).toBeDefined();
        expect(sceneFits(req!, profile), `${brief.product} ${JSON.stringify(profile)} ← ${JSON.stringify(req)} ${s}`).toBe(true);
      }
    }
  });

  it("같은 장면 재사용 0", () => {
    for (const { brief } of samples) { const all = scenesOf(brief); expect(new Set(all).size).toBe(all.length); }
  });

  it("시간 미상이면 시주 관련 0", () => {
    for (const { input, brief } of samples) {
      const sides = [{ p: input.person, chart: brief.chart, facts: brief.person, pre: input.partner ? "a" : "" }];
      if (input.partner && brief.partner) sides.push({ p: input.partner, chart: brief.partner.chart, facts: brief.partner.person, pre: "b" });
      for (const s of sides) {
        if (!s.p.birthTimeUnknown) continue;
        expect(s.chart.pillars.hour).toBeUndefined();
        for (const t of brief.traits) if (t.id.startsWith(s.pre)) expect(t.positions).not.toContain("hour");
        expect(s.facts.forbiddenFacts.join(" ")).toContain("시주");
        if (!input.partner) for (const c of brief.chapters) for (const m of c.materials) if (m.kind === "evidence" && m.key === "childPalace") expect(m.facts[0]).toContain("보지 않습니다");
      }
    }
  });

  it("금지 사실 위반 0 (MBTI 없음→MBTI 재료 0, 성별 없음→배우자·자녀 별 보류)", () => {
    for (const { input, brief } of samples) {
      if (!input.person.mbtiType && !input.partner) {
        expect(brief.mbti).toBeNull();
        for (const t of brief.traits) expect(t.fusion).toBeUndefined();
        for (const c of brief.chapters) for (const m of c.materials) expect(m.kind).not.toBe("mbti");
      }
      if (!input.person.gender && brief.product === "love_marriage_child") {
        const star = brief.chapters.flatMap(c => c.materials).find(m => m.kind === "evidence" && m.key === "spouseStar");
        if (star && star.kind === "evidence") expect(star.facts[0]).toContain("보류");
      }
    }
  });

  it("trait 8~12개, 가족 다양성 상한, trait는 소개 1 + 적용 2·한 장에 한 번(P3.8)", () => {
    for (const { brief } of samples) {
      const persons = brief.compatibility ? ["a", "b"] : [""];
      for (const pre of persons) {
        const ts = brief.traits.filter(t => (pre ? t.id.startsWith(pre) : true));
        expect(ts.length).toBeGreaterThanOrEqual(brief.compatibility ? 6 : 8);
        expect(ts.length).toBeLessThanOrEqual(12);
        for (const g of GROUPS) expect(ts.filter(t => g.families.includes(t.family)).length).toBeLessThanOrEqual(g.max);
      }
      for (const t of brief.traits) expect(t.chapters.length).toBeLessThanOrEqual(3);
      for (const [id, u] of Object.entries(brief.plan!.traits)) {
        expect(u.applies.length, id).toBeLessThanOrEqual(2);
        expect(new Set([u.intro, ...u.applies]).size, id).toBe(1 + u.applies.length);
      }
      expect(brief.plan!.warnings).toEqual([]);
    }
  });

  it("비반복 장은 절 1~5개(절마다 재료 1~4, 절이 적으면 목표 분량도 줄임, 3개 미만인 장은 책에 1개까지), 반복 장은 타임라인 항목을 가진다", () => {
    for (const { brief } of samples) {
      for (const c of brief.chapters) {
        if (c.id.includes(":")) { expect(c.materials[0].kind).toBe("timeline"); continue; }
        expect(c.sections!.length, c.id).toBeGreaterThanOrEqual(1); expect(c.sections!.length).toBeLessThanOrEqual(5);
        for (const s of c.sections!) expect(s.materials.length).toBeGreaterThanOrEqual(1);
        if (c.sections!.length < 4) expect(c.targetChars[1]).toBeLessThan(1250);
      }
      // MBTI가 없으면 MBTI가 1순위인 절이 빠져 짧은 장이 하나 더 생길 수 있다.
      expect(brief.chapters.filter(c => c.sections && c.sections.length < 3).length, brief.product).toBeLessThanOrEqual(brief.mbti ? 1 : 2);
    }
  });

  it("세운 12개월 행동 템플릿 반복 0", () => {
    for (const { brief } of samples) if (brief.product === "annual_fortune") {
      const months = brief.timeline!.entries.filter(e => e.kind === "month");
      expect(months).toHaveLength(12);
      expect(new Set(months.map(e => e.action.templateId)).size).toBe(12);
    }
  });

  it("결정론: 같은 입력 = 같은 브리프", () => {
    for (const { input, brief } of samples.slice(0, 8)) expect(buildBrief(input, k)).toEqual(brief);
  });

  // P3.6: 소품 사전 확대(직업군 13개)와 합충 자리 문장(where)으로 상한을 1% 올렸다.
  // P3.8: 추정을 작가가 실제로 받는 입력으로 바꿨다(배정 기록·안 쓰는 trait·style.rules 제외). 절 질문 52개가 늘어 10.8k.
  it("종합 브리프 토큰 추정 10.8k 이내", () => {
    for (const { brief } of samples) if (brief.product === "saju_mbti_full") expect(brief.budget.estimatedTokens).toBeLessThanOrEqual(10_800);
  });
});
