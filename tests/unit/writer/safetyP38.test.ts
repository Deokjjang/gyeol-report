import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput } from "@/lib/brief";
import { MAX_TRAIT_APPLIES } from "@/lib/brief/chapters";
import type { Brief } from "@/lib/brief/schema";
import { sentenceViolation } from "@/lib/writer/safety/sentences";
import { traitMentions } from "@/lib/writer/safety/metrics";
import { renderWriterBrief } from "@/lib/writer/prompt";
import { PEOPLE } from "../../../tools/p35/people";
import { P36_PEOPLE as P36 } from "../../../tools/p36/people";

const k = loadKnowledge();
const base = "2026-10-30";
const build = (input: BriefInput) => buildBrief(input, k);
const c1Career = build({ product: "career_money_study", baseDate: base, person: PEOPLE.c1 });
const c1Full = build({ product: "saju_mbti_full", baseDate: base, person: PEOPLE.c1 });
const xMajor = build({ product: "major_fortune", baseDate: base, person: PEOPLE.x });
const pairs = (["parentChild", "managerReport", "coworker", "businessPartner", "friendship", "love", "marriage"] as const).map(rt => [rt, build({ product: "saju_mbti_compatibility", baseDate: base, person: rt === "parentChild" ? P36.parent : P36.boss, partner: rt === "parentChild" ? P36.child : PEOPLE.c1, relationshipType: rt })] as const);
const refTraits = (b: Brief, c: Brief["chapters"][number]) => [...new Set(c.materials.flatMap(m => m.kind === "trait" ? [m.traitId] : m.kind === "ref" && /^shadows\./.test(m.ref) ? [b.shadows.find(s => `shadows.${s.id}` === m.ref)!.traitId] : m.kind === "ref" && /^traits\./.test(m.ref) ? [m.ref.split(".")[1]] : []))];

describe("P3.8 질문 중심 배정·직무·관계 장면·명칭", () => {
  it("1: 절마다 질문과 재료, trait는 소개 1 + 적용 2·한 장 1회, 소개는 책 순서상 첫 절", () => {
    for (const b of [c1Career, c1Full, xMajor, ...pairs.map(p => p[1])]) {
      const seen = new Set<string>();
      // 궁합 두 사람이 같은 요소를 가지면 먼저 나온 쪽만 소개(P3.8 r2)
      const keyOf = (id: string) => { const t = b.traits.find(x => x.id === id)!; return /^[ab]/.test(id) ? `pair:${t.featureId}` : id; };
      for (const c of b.chapters) {
        if (c.sections) for (const s of c.sections) { expect(s.q).not.toMatch(/\{topic\}|(?<![A-Za-z])[AB](가|는|의|를|에게)/); expect(s.materials.length).toBeGreaterThan(0); }
        for (const m of c.materials) if (m.kind === "trait") { const k = keyOf(m.traitId); expect(m.angle, `${c.id} ${m.traitId}`).toBe(seen.has(k) ? "new-domain" : "first"); seen.add(k); }
        const ids = c.materials.filter(m => m.kind === "trait").map(m => (m as { traitId: string }).traitId);
        expect(new Set(ids).size, c.id).toBe(ids.length);
      }
      for (const [id, u] of Object.entries(b.plan!.traits)) expect(u.applies.length, id).toBeLessThanOrEqual(MAX_TRAIT_APPLIES);
      expect(b.plan!.warnings).toEqual([]);
      // 같은 요소는 두 사람 합쳐 책 3회·한 장 1회
      const shared = new Map<string, string[]>();
      for (const t of b.traits) if (/^[ab]/.test(t.id)) shared.set(t.featureId, [...(shared.get(t.featureId) ?? []), ...t.chapters]);
      for (const [f, chs] of shared) { expect(chs.length, f).toBeLessThanOrEqual(3); expect(new Set(chs).size, f).toBe(chs.length); }
    }
    // 하람 커리어의 음착양차살(P3.7: 5장 두 문단 + 8장)은 한 장에 한 번, 책 전체 3회까지.
    const t = c1Career.traits.find(x => x.featureId === "shinsal:EUMCHAK_YANGCHA")!;
    const chapters = c1Career.chapters.filter(c => refTraits(c1Career, c).includes(t.id));
    expect(chapters.length).toBeLessThanOrEqual(3);
  });

  it("1: 마지막 장(실행 플랜·먼저 맞출 한 가지·흐름 타는 법)은 새 특성 소개 없이 앞 장 종합, 커리어 플랜은 일·돈·공부 축", () => {
    const plan = c1Career.chapters.find(c => c.id === "plan")!;
    expect(plan.materials.every(m => m.kind === "ref" && /^chapters\.(fit|money|study|timing-risk)$/.test(m.ref))).toBe(true);
    for (const [, b] of pairs) {
      const last = b.chapters.find(c => c.id === "one-thing")!;
      expect(last.materials.some(m => m.kind === "trait" && m.angle === "first"), b.compatibility!.relationshipType).toBe(false);
    }
    expect(xMajor.chapters.at(-1)!.materials.some(m => m.kind === "trait" && m.angle === "first")).toBe(false);
  });

  it("1: 전환 장은 전환 해가 건드린 trait만(앞에서 소개된 것) 참조, 원국 특성 재소개 없음", () => {
    const tr = xMajor.chapters.find(c => c.id === "transition")!;
    expect(tr.materials.some(m => m.kind === "trait")).toBe(false);
    const keys = xMajor.timeline!.keyEntries;
    for (const m of tr.materials) if (m.kind === "ref" && /^traits\./.test(m.ref)) expect(m.note).toMatch(new RegExp(keys.join("|")));
  });

  it("1: 이미지 계열은 그림 대상(저장·식물…)으로 묶어 대표 하나, 연·월 열쇠말은 일간 기준 십성", () => {
    const store = xMajor.traits.filter(t => /독|곳간|창고|이삿짐/.test(t.image.metaphor) && t.chapters.length);
    expect(store.filter(t => !t.sameImageAs).length).toBeLessThanOrEqual(1);
    const seen = new Map<string, string>();
    for (const e of xMajor.timeline!.entries) {
      const tg = e.tenGod.stem.match(/\((.+)\)/)![1], kw = k.tenGodPeriod.get(tg)!.year.keywords;
      for (const w of e.keywords) expect(kw, e.key).toContain(w);
      // 같은 십성이 다시 오면 앞 key를 가리키고 다른 열쇠말을 준다(P3.8 r1: 2023·2033 편관이 같은 말).
      if (seen.has(tg)) { expect(e.repeatOf, e.key).toBe(seen.get(tg)); expect(e.keywords).not.toEqual(xMajor.timeline!.entries.find(x => x.key === seen.get(tg))!.keywords); }
      else { expect(e.repeatOf).toBeUndefined(); seen.set(tg, e.key); }
      expect(e.material).not.toHaveProperty("mood");
    }
    const stages = xMajor.timeline!.entries.flatMap(e => e.material.stage ? [e.material.stage] : []);
    expect(new Set(stages).size).toBe(stages.length);
    const next = c1Career.chart.currentDayun?.next;
    if (next) { expect(next.reading).toBeTruthy(); expect(next.easyName).toBeTruthy(); }
    expect(c1Career.chart.strength.reading).toBeTruthy();
  });

  it("1: 반대 극성은 원국 읽기·궁합 공통점에서도 정리한다(공통점이 두 사람 차이와 같은 차원에서 반대면 뺀다)", () => {
    for (const [rt, b] of pairs) {
      const c = b.compatibility!;
      for (const item of c.common) {
        const id = [...k.features.values()].find(f => item.includes(f.name.replace(/\(.*?\)/g, "").trim()) && /같은 기운/.test(item))?.id;
        if (!id) continue;
        const tags = k.features.get(id)!.dimensionTags;
        for (const d of c.differences) {
          const dim = k.ontology.dimensions.find(x => x.name === d.dimension)!;
          if (Math.abs(tags[dim.id] ?? 0) >= 0.5) throw new Error(`${rt} 공통점 ${item} ↔ 차이 ${d.dimension}`);
        }
      }
      expect(c.common.join(" "), rt).not.toMatch(/텃밭 같은 기운\(기토\)/);
    }
  });

  it("2: 직무 = 명리 × MBTI × 인접성 × 생활 단계, 3단 출력, MBTI 핵심과 정면으로 어긋난 직무 제외", () => {
    const ev = (key: string) => c1Career.chapters.flatMap(c => c.materials).find(m => m.kind === "evidence" && m.key === key) as { facts: string[] };
    const adjacent = ev("jobAdjacent").facts.slice(1).map(f => f.split(" — ")[0]);
    const clusters = new Map(k.catalog.jobs.map(j => [j.title, j.cluster]));
    const near = new Set(["plan", ...k.catalog.clusters.find(c => c.id === "plan")!.near]);
    for (const t of adjacent) expect(near.has(clusters.get(t)!), t).toBe(true);
    const entj = k.mbti.get("ENTJ")!;
    for (const t of [...adjacent, ...ev("jobLongterm").facts.slice(1).map(f => f.split(" — ")[0])]) {
      const job = k.catalog.jobs.find(j => j.title === t)!;
      for (const [d, v] of Object.entries(job.dims)) if (Math.abs(v) >= 0.5 && Math.abs(entj.dimensionTags[d] ?? 0) >= 0.6) expect(Math.sign(v), `${t} ${d}`).toBe(Math.sign(entj.dimensionTags[d]!));
    }
  });

  it("3: 궁합 장면은 그 관계 유형의 주제에서만, 부모·자녀는 자녀 나이대, 다른 관계 낱말 없음", () => {
    for (const [rt, b] of pairs) {
      const own = new Set(k.compatScenes.types.find(t => t.type === rt)!.topics.flatMap(t => t.scenes.map(s => s.text)));
      const rel = b.chapters.flatMap(c => c.materials).filter(m => m.kind === "rel") as { scene: string; topic: string }[];
      expect(rel.length, rt).toBeGreaterThanOrEqual(15);
      for (const r of rel) expect(own.has(r.scene), `${rt} ${r.scene}`).toBe(true);
      expect(b.chapters.flatMap(c => c.materials).some(m => (m.kind === "trait" && m.scene) || m.kind === "mbti"), rt).toBe(false);
    }
    const pc = pairs.find(([rt]) => rt === "parentChild")![1];
    const scenes = k.compatScenes.types.find(t => t.type === "parentChild")!.topics.flatMap(t => t.scenes);
    for (const m of pc.chapters.flatMap(c => c.materials)) if (m.kind === "rel") expect(scenes.find(s => s.text === m.scene)!.ages ?? "any").not.toBe("minor");
    expect(pc.compatibility!.lens.tone).not.toContain("학교");
  });

  it("4: 타사 유형명 0건 — 원본 titleKo = 지식 DB 이름, 16Personalities 이름·핵심 낱말 없음", () => {
    // 저장소 검색이 이 시험 파일에 걸리지 않게 이름을 [꾸밈말, 이름]으로 나눠 두고 실행할 때 잇는다.
    const P16 = new RegExp([["용의주도한", "전략가"], ["논리적인", "사색가"], ["대담한", "통솔자"], ["논쟁을 즐기는", "변론가"], ["선의의", "옹호자"], ["열정적인", "중재자"], ["정의로운", "사회운동가"], ["재기발랄한", "활동가"], ["청렴결백한", "논리주의자"], ["용감한", "수호자"], ["엄격한", "관리자"], ["사교적인", "외교관"], ["만능", "재주꾼"], ["호기심 많은", "예술가"], ["모험을 즐기는", "사업가"], ["자유로운 영혼의", "연예인"]].map(x => x.join(" ")).join("|"));
    const HEAD = /통솔자|전략가|건축가|사색가|논리술사|변론가|옹호자|중재자|선도자|사회운동가|활동가|논리주의자|현실주의자|수호자|관리자|경영자|외교관|집정관|재주꾼|장인|예술가|모험가|사업가|연예인/;
    const dir = join(__dirname, "../../../docs/product/mbti/source");
    for (const f of readdirSync(dir).filter(x => x.endsWith(".json"))) {
      const raw = readFileSync(join(dir, f), "utf8"), d = JSON.parse(raw.replace(/^﻿/, ""));
      expect(raw, f).not.toMatch(P16);
      expect(d.titleKo, f).toBe(k.mbti.get(d.type)!.easyName);
      expect(`${d.titleKo} ${d.archetype}`, f).not.toMatch(HEAD);
    }
    for (const p of k.mbti.values()) expect(p.easyName).not.toMatch(HEAD);
  });

  it("5: 금지 위반 유형별 안전망·작가 입력 — 궁합 평가 문장 삭제, 작가에게 배정 기록·안 쓰는 trait를 주지 않는다", () => {
    const compat = { birthTimeKnown: true, mbti: "ESTJ", relationship: "unknown", children: "has", job: "none", compat: { score: 45, band: "노력이 필요한" } } as const;
    expect(sentenceViolation("다만 정확함이 마음의 넉넉함을 대신하지는 않아요.", compat)).toBe("compat_judgement");
    expect(sentenceViolation("좋은 부모가 되려면 먼저 들어야 합니다.", compat)).toBe("compat_judgement");
    expect(sentenceViolation("문자가 얼굴 보고 하는 말을 대신하지는 못해도 다리가 됩니다.", compat)).toBeNull();
    expect(sentenceViolation("다만 정확함이 마음의 넉넉함을 대신하지는 않아요.", { ...compat, compat: undefined })).toBeNull();
    const w = renderWriterBrief(c1Full) as { traits: { id: string }[]; chapters: { sections?: unknown; materials?: unknown }[] };
    expect(w).not.toHaveProperty("plan");
    for (const t of w.traits) expect(c1Full.traits.find(x => x.id === t.id)!.chapters.length + c1Full.traits.filter(x => x.sameImageAs === t.id).length).toBeGreaterThan(0);
    for (const c of w.chapters) if (c.sections) expect(c).not.toHaveProperty("materials");
  });

  it("안전망 측정: 원고의 trait 언급(소개·적용)·장 안 중복·같은 축을 세고 상한을 넘으면 경고", () => {
    const t = c1Career.traits.find(x => c1Career.plan!.traits[x.id])!;
    const sec = (text: string) => ({ heading: "h", paragraphs: [text] });
    const ok = traitMentions(c1Career, [{ n: 1, sections: [sec(`${t.easyName} 이야기`)] }, { n: 2, sections: [sec("다른 이야기")] }]);
    expect(ok.warnings).toEqual([]);
    expect(ok.traits.find(x => x.id === t.id)!.sections).toBe(1);
    const bad = traitMentions(c1Career, [{ n: 1, sections: [sec(t.easyName), sec(t.easyName)] }, { n: 2, sections: [sec(t.easyName), sec(t.easyName)] }]);
    expect(bad.warnings.some(x => x.includes("한 장 2개"))).toBe(true);
    expect(bad.warnings.some(x => x.includes("소제목 4개"))).toBe(true);
  });
});
