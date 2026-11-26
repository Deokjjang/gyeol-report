/**
 * ZW-1 4부 · 엔진 × DB 연결 확인(호출 0). 무작위 2,000명 명반(seed 20261200 — random1~4의 20261125~28과 다름) → DB 조회(src/lib/ziwei/lookup.ts).
 * (가) 빠짐 0: 별 · 궁 · 쌍성 · 사화 · 오행국 · 심화 4궁 · MBTI 짝. 공궁은 빌려 읽기(맞은편 쌍성까지).
 * (나) 입력 거름: 연애 5(솔로 · 썸 · 연애 중 · 기혼 · 미입력) × 자녀 3(미입력 · 있음 · 없음) × 일 4(직장 · 사업 · 학생 · 그 밖) —
 *      장면은 sceneFits에 맞는 것만 · 맞는 것은 모두, 렌즈 줄은 입력 상태를 따라 바뀜, MBTI 16유형(명궁 단독 · 쌍성 · 공궁).
 * (다) 분포 보고(실패 아님): 명궁 묶음 · 칸별 쌍성 · 공궁 · 화기 칸. ZW_LINK_REPORT=<경로>면 JSON, 아니면 짧은 요약.
 * 돌리기: pnpm exec vitest run tests/unit/ziwei/link.test.ts
 */
import { writeFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { MBTI_TYPES, type MbtiType } from "@/data/knowledge-v5/schema";
import { sceneFits, type FactProfile } from "@/lib/brief/facts";
import { computeZiweiChart } from "@/lib/ziwei/chart";
import { MAJOR_STARS, MUTAGENS, pairIdOf, PALACES, STAR_NAMES, STAR_PAIRS, type PalaceId } from "@/lib/ziwei/ids";
import { loadZiweiKnowledge, type ZiweiKnowledge, type ZiweiScene } from "@/lib/ziwei/knowledge";
import { lookupZiwei, ziweiLensState, ZIWEI_DEEP_PALACES, type ZiweiFacts, type ZiweiLensState, type ZiweiLookup, type ZiweiPickedScene } from "@/lib/ziwei/lookup";
import type { ZiweiChart } from "@/lib/ziwei/types";
import { randomInputs } from "./helpers";

const SEED = 20261200;
const N = 2000;
const AS_OF = "2026-11-24";
const LONG = 600_000;

let kb: ZiweiKnowledge;
let charts: ZiweiChart[] = [];
/** (가) 기본 입력: 연애 · 일 미입력, 자녀 미입력, MBTI는 16유형을 돌려 가며(짝 조회도 2,000명에 고루). */
let base: ZiweiLookup[] = [];
const ms = { charts: 0, lookups: 0, filter: 0 };

const kindOf = (c: ZiweiChart, palace: PalaceId) => {
  const p = c.palaces.find(x => x.id === palace)!;
  return p.majors.length === 0 ? "empty" : p.majors.length === 1 ? "single" : "pair";
};
const bundleOf = (c: ZiweiChart, palace: PalaceId) => {
  const p = c.palaces.find(x => x.id === palace)!;
  return p.majors.length === 0 ? "empty" : p.majors.length === 1 ? p.majors[0] : p.pair!;
};

/** 조회 결과에서 거른 항목(id · entry · scenes)을 모두 모은다. 거르지 않은 장면 칸(scene · scenes 아닌 꼴)이 남아 있으면 leaks. */
function pickedOf(look: ZiweiLookup): { picked: { id: string; scenes: readonly ZiweiPickedScene[] }[]; leaks: string[] } {
  const picked = new Map<string, { id: string; scenes: readonly ZiweiPickedScene[] }>();
  const leaks: string[] = [];
  const seen = new Set<object>();
  const walk = (v: unknown, path: string) => {
    if (!v || typeof v !== "object" || seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${path}[${i}]`)); return; }
    const o = v as Record<string, unknown>;
    if (typeof o.id === "string" && "entry" in o && Array.isArray(o.scenes)) picked.set(o.id, o as { id: string; scenes: ZiweiPickedScene[] });
    for (const [k, x] of Object.entries(o)) {
      if (k === "scene" || (k === "scenes" && !Array.isArray(x))) leaks.push(`${path}.${k}`);
      else if (k !== "scenes") walk(x, `${path}.${k}`);
    }
  };
  walk(look, "");
  return { picked: [...picked.values()], leaks };
}
/** DB 원래 항목의 장면 전부(영역 장면 + 장면 하나). */
function rawScenesById(k: ZiweiKnowledge): Map<string, readonly ZiweiScene[]> {
  const out = new Map<string, readonly ZiweiScene[]>();
  const all = [...k.stars.values(), ...k.palaces.values(), ...k.pairs.values(), ...(k.emptyRule ? [k.emptyRule] : []), ...k.mutagens.values(), ...k.deep.values(), ...k.mbti.values()];
  for (const e of all) out.set(e.id, [...("scenes" in e ? Object.values(e.scenes).flat() : []), ...("scene" in e ? [e.scene] : [])]);
  return out;
}

beforeAll(() => {
  kb = loadZiweiKnowledge();
  let t = performance.now();
  charts = randomInputs(SEED, N).map(input => computeZiweiChart(input, AS_OF));
  ms.charts = Math.round(performance.now() - t);
  t = performance.now();
  base = charts.map((c, i) => lookupZiwei(c, kb, { relationshipStatus: "", jobStatus: "", mbti: MBTI_TYPES[i % 16] }));
  ms.lookups = Math.round(performance.now() - t);
}, LONG);

describe("(가) 무작위 2,000명 명반 → DB 조회", () => {
  it("빠짐 0(관문): 조회가 찾지 못한 id 없음", () => {
    const missing = new Map<string, number>();
    for (const l of base) for (const id of l.missing) missing.set(id, (missing.get(id) ?? 0) + 1);
    expect(base).toHaveLength(N);
    expect([...missing.keys()].sort()).toEqual([]);
  }, LONG);

  it("별 32 · 궁 12 + 신궁 · 쌍성: 항목 · 칸 줄 모두 있음, 밝기 글은 「통용」 칸에만", () => {
    const bad: string[] = [];
    base.forEach((l, i) => {
      const c = charts[i];
      const starIds = new Set<string>();
      if (l.palaces.map(r => r.palace).join() !== PALACES.join()) bad.push(`${i} 궁 순서`);
      if (!l.body.entry || l.body.palace !== c.bodyPalace.palace || !l.body.lens) bad.push(`${i} 신궁`);
      for (const r of l.palaces) {
        const p = c.palaces.find(x => x.id === r.palace)!;
        if (!r.entry || !r.lens) bad.push(`${i} ${r.palace} 궁 항목`);
        if (r.majors.map(m => m.star).join() !== p.majors.join()) bad.push(`${i} ${r.palace} 주성 목록`);
        for (const m of r.majors) {
          starIds.add(m.star);
          if (!m.entry || !m.nuance) bad.push(`${i} ${r.palace} ${m.star} 항목 · palaceNuance`);
          const placed = c.stars.find(s => s.id === m.star)!;
          const agreed = placed.brightnessBasis === "통용" && placed.brightness !== null;
          if (agreed !== (m.brightness !== null)) bad.push(`${i} ${m.star} 밝기 근거 ${placed.brightnessBasis}인데 밝기 글 ${m.brightness ? "있음" : "없음"}`);
          if (m.brightness && (!m.brightness.text || (m.brightness.level === "normal") !== (m.brightness.forYou === null))) bad.push(`${i} ${m.star} 밝기 ${m.brightness.level} 글`);
        }
        for (const [list, ids] of [[r.helpers, p.helpers], [r.malefics, p.malefics], [r.loves, p.loves]] as const) {
          if (list.map(x => x.star).join() !== ids.join()) bad.push(`${i} ${r.palace} 보조 별 목록`);
          for (const x of list) { starIds.add(x.star); if (!x.entry) bad.push(`${i} ${x.star} 항목`); }
        }
        if (Boolean(p.pair) !== Boolean(r.pair) || (r.pair && (!r.pair.entry || r.pair.id !== p.pair))) bad.push(`${i} ${r.palace} 쌍성 ${p.pair}`);
      }
      if (starIds.size !== Object.keys(STAR_NAMES).length) bad.push(`${i} 별 ${starIds.size}개`);
    });
    expect(bad.slice(0, 20)).toEqual([]);
  }, LONG);

  it("심화 원고 대상 4궁 덮음 100%(단독 → 별 · 쌍성 → 쌍성 · 공궁 → empty)", () => {
    const uncovered = new Map<string, number>();
    const bad: string[] = [];
    base.forEach((l, i) => {
      const c = charts[i];
      if (l.deep.map(d => d.palace).join() !== ZIWEI_DEEP_PALACES.join()) bad.push(`${i} 심화 궁 목록`);
      for (const d of l.deep) {
        if (d.kind !== kindOf(c, d.palace) || d.bundle !== bundleOf(c, d.palace)) bad.push(`${i} ${d.palace} 묶음 ${d.bundle}`);
        if (d.kind === "empty" && !d.borrow?.pair?.entry) bad.push(`${i} ${d.palace} 공궁 심화에 빌린 쌍성 없음`);
        if (!d.entry) { const id = `zw:deep:${d.palace}:${d.bundle}`; uncovered.set(id, (uncovered.get(id) ?? 0) + 1); }
      }
    });
    expect(bad.slice(0, 20)).toEqual([]);
    expect([...uncovered.keys()].sort()).toEqual([]);
  }, LONG);

  it("공궁은 빌려 읽기: 맞은편 칸 주성 둘(쌍성) · 쌍성 항목 · 그 별들의 palaceNuance[빈 칸] · 규칙 항목", () => {
    const bad: string[] = [];
    let empties = 0;
    base.forEach((l, i) => {
      const c = charts[i];
      for (const r of l.palaces) {
        const p = c.palaces.find(x => x.id === r.palace)!;
        if (!p.empty) { if (r.borrow) bad.push(`${i} ${r.palace} 공궁 아닌데 빌림`); continue; }
        empties++;
        const b = r.borrow;
        if (!b) { bad.push(`${i} ${r.palace} 빌려 읽기 없음`); continue; }
        const from = c.palaces.find(x => x.id === p.borrowFrom)!;
        if (b.from !== p.borrowFrom || b.majors.map(m => m.star).join() !== from.majors.join()) bad.push(`${i} ${r.palace} 빌린 칸 ${b.from}`);
        if (!b.rule) bad.push(`${i} zw:empty:rule`);
        if (b.majors.length !== 2) bad.push(`${i} ${r.palace} 빌린 주성 ${b.majors.length}개(쌍성 아님)`);
        if (!b.pair?.entry || b.pair.id !== pairIdOf(from.majors[0], from.majors[1])) bad.push(`${i} ${r.palace} 빌린 쌍성 ${b.pair?.id}`);
        for (const m of b.majors) if (!m.entry || !m.nuance || m.nuance !== kb.stars.get(m.star)?.palaceNuance?.[r.palace]) bad.push(`${i} ${r.palace} 빌린 ${m.star} palaceNuance`);
      }
    });
    expect(empties).toBeGreaterThan(0);
    expect(bad.slice(0, 20)).toEqual([]);
  }, LONG);

  it("사화 4(앉은 별 · 칸) + 연간 표 한 줄 · 오행국", () => {
    const bad: string[] = [];
    base.forEach((l, i) => {
      const c = charts[i];
      if (l.mutagens.map(m => m.mutagen).join() !== MUTAGENS.join()) bad.push(`${i} 사화 ${l.mutagens.length}`);
      for (const m of l.mutagens) {
        if (!m.entry || m.entry.id !== `zw:mutagen:${m.mutagen}`) bad.push(`${i} zw:mutagen:${m.mutagen}`);
        if (c.stars.find(s => s.id === m.star)?.palace !== m.palace) bad.push(`${i} ${m.mutagen} 칸`);
      }
      if (!l.mutagenYear || l.mutagenYear.stem !== c.year.stem || [l.mutagenYear.rok, l.mutagenYear.gwon, l.mutagenYear.gwa, l.mutagenYear.gi].join() !== l.mutagens.map(m => m.star).join()) bad.push(`${i} 연간 표 ${c.year.stem}`);
      if (!l.fiveClass.entry || l.fiveClass.entry.number !== c.fiveClass.number || l.fiveClass.id !== c.fiveClass.id) bad.push(`${i} zw:class:${c.fiveClass.id}`);
    });
    expect(bad.slice(0, 20)).toEqual([]);
  }, LONG);
});

// ---------- (나) 입력 거름 ----------
type Case<F, P, L> = { readonly label: string; readonly input: F; readonly fact: P; readonly lens: L };
const REL: readonly Case<string, FactProfile["relationship"], ZiweiLensState["relationship"]>[] = [
  { label: "솔로", input: "single", fact: "single", lens: "single" },
  { label: "썸", input: "some", fact: "dating", lens: "some" },
  { label: "연애 중", input: "dating", fact: "dating", lens: "dating" },
  { label: "기혼", input: "married", fact: "married", lens: "married" },
  { label: "연애 미입력", input: "", fact: "unknown", lens: "unknown" },
];
const CHILD: readonly Case<"has" | "none" | undefined, FactProfile["children"], ZiweiLensState["children"]>[] = [
  { label: "자녀 미입력", input: undefined, fact: "unknown", lens: "unknown" },
  { label: "자녀 있음", input: "has", fact: "has", lens: "has" },
  { label: "자녀 없음", input: "none", fact: "none", lens: "none" },
];
const JOB: readonly Case<string, FactProfile["job"], ZiweiLensState["job"]>[] = [
  { label: "직장", input: "employee", fact: "employed", lens: "employed" },
  { label: "사업", input: "self_employed", fact: "business", lens: "business" },
  { label: "학생", input: "student", fact: "student", lens: "student" },
  { label: "그 밖 · 미입력", input: "", fact: "none", lens: "other" },
];
const COMBOS = REL.flatMap(r => CHILD.flatMap(c => JOB.map(j => ({ r, c, j }))));
const factsOf = (x: (typeof COMBOS)[number], mbti?: MbtiType): ZiweiFacts => ({ relationshipStatus: x.r.input, jobStatus: x.j.input, ...(x.c.input ? { children: x.c.input } : {}), ...(mbti ? { mbti } : {}) });

/** 프로필에 나가도 되는 requires 값(sceneFits와 따로 적은 표 — 「솔로에게 기혼 장면 없음」 · 「자녀 미입력에 자녀 있음 장면 없음」 · 「일 상태 밖 직업 장면 없음」). */
const allowedRel = (p: FactProfile["relationship"]) => new Set(["any", ...(p === "unknown" ? [] : [p]), ...(p === "married" ? [] : ["unmarried"])]);
const allowedChild = (p: FactProfile["children"]) => new Set(["any", ...(p === "has" ? ["has"] : ["none"])]);
const allowedJob = (p: FactProfile["job"]) => new Set(["any", ...(p === "none" ? [] : [p])]);

describe("(나) 입력 거름: 연애 5 × 자녀 3 × 일 4", () => {
  it("입력 원문 → 렌즈 상태(결혼 준비 = 연애 중, 자영업 · 사업 = business, 나머지 일 = other)", () => {
    const st = (relationshipStatus: string, jobStatus: string, children?: "has" | "none") => ziweiLensState({ relationshipStatus, jobStatus, ...(children ? { children } : {}) });
    expect(st("marriage_preparing", "business_owner")).toEqual({ relationship: "dating", children: "unknown", job: "business" });
    expect(st("some", "freelancer", "none")).toEqual({ relationship: "some", children: "none", job: "other" });
    for (const j of ["", "job_seeker", "freelancer", "homemaker", "unemployed", "other"]) expect(st("", j).job).toBe("other");
    expect(st("", "").relationship).toBe("unknown");
  });

  it("장면: 입력에 맞는 것만 나가고, 맞는 것은 모두 나감(같은 2,000명 × 60 입력)", () => {
    const rawScenes = rawScenesById(kb);
    const bad: string[] = [];
    const totals = { kept: 0, droppedByRequires: 0, droppedByText: 0 };
    const t = performance.now();
    for (const x of COMBOS) {
      const want: FactProfile = { relationship: x.r.fact, children: x.c.fact, job: x.j.fact };
      const [rel, child, job] = [allowedRel(want.relationship), allowedChild(want.children), allowedJob(want.job)];
      const label = `${x.r.label} · ${x.c.label} · ${x.j.label}`;
      charts.forEach((c, i) => {
        const l = lookupZiwei(c, kb, factsOf(x));
        if (i === 0 && JSON.stringify(l.profile) !== JSON.stringify(want)) bad.push(`${label}: 프로필 ${JSON.stringify(l.profile)}`);
        const { picked, leaks } = pickedOf(l);
        if (leaks.length) bad.push(`${label}: 거르지 않은 장면 칸 ${leaks.slice(0, 3).join(" ")}`);
        let n = 0;
        for (const e of picked) {
          for (const s of e.scenes) {
            n++;
            if (!sceneFits(s.requires, l.profile, s.text)) bad.push(`${label}: ${e.id} sceneFits 아님 ${s.text}`);
            if (!rel.has(s.requires.relationship) || !child.has(s.requires.children) || !job.has(s.requires.job)) bad.push(`${label}: ${e.id} 조건 ${JSON.stringify(s.requires)}`);
          }
          const expected = (rawScenes.get(e.id) ?? []).filter(s => sceneFits(s.requires, want, s.text)).map(s => s.text);
          if (expected.join("|") !== e.scenes.map(s => s.text).join("|")) bad.push(`${label}: ${e.id} 맞는 장면 ${expected.length} ≠ 나간 장면 ${e.scenes.length}`);
        }
        if (n !== l.sceneCount.kept) bad.push(`${label}: 장면 수 ${n} ≠ kept ${l.sceneCount.kept}`);
        totals.kept += l.sceneCount.kept; totals.droppedByRequires += l.sceneCount.droppedByRequires; totals.droppedByText += l.sceneCount.droppedByText;
      });
    }
    ms.filter = Math.round(performance.now() - t);
    expect(bad.slice(0, 20)).toEqual([]);
    // 거름이 실제로 일한다(DB에 연애 상태 · 자녀 조건 장면이 있다).
    expect(totals.droppedByRequires).toBeGreaterThan(0);
    expect(totals.kept).toBeGreaterThan(0);
  }, LONG);

  it("렌즈 줄: DB에 상태 줄이 있는 궁은 입력 상태를 따라 바뀌고, 없으면 default", () => {
    const c = charts[0];
    const bad: string[] = [];
    const seenLines = new Map<string, Set<string>>();
    for (const x of COMBOS) {
      const l = lookupZiwei(c, kb, factsOf(x));
      const st = l.lensState;
      if (st.relationship !== x.r.lens || st.children !== x.c.lens || st.job !== x.j.lens) bad.push(`${x.r.label} · ${x.c.label} · ${x.j.label}: 렌즈 상태 ${JSON.stringify(st)}`);
      for (const r of [...l.palaces.map(p => ({ key: p.palace as string, lens: p.lens })), { key: "sin", lens: l.body.lens }]) {
        const lens = kb.palaces.get(r.key)!.lens;
        // 연애 → 자녀 → 일 순서(지금 DB는 궁마다 상태 갈래가 많아야 하나다).
        const want = (x.r.lens !== "unknown" && lens.relationship?.[x.r.lens]) ? { key: `relationship.${x.r.lens}`, line: lens.relationship[x.r.lens]! }
          : lens.children?.[x.c.lens === "unknown" ? "none" : x.c.lens] ? { key: `children.${x.c.lens === "unknown" ? "none" : x.c.lens}`, line: lens.children[x.c.lens === "unknown" ? "none" : x.c.lens]! }
            : lens.job?.[x.j.lens] ? { key: `job.${x.j.lens}`, line: lens.job[x.j.lens]! }
              : { key: "default", line: lens.default };
        if (r.lens?.key !== want.key || r.lens.line !== want.line) bad.push(`${r.key}: ${r.lens?.key} ≠ ${want.key}`);
        const set = seenLines.get(r.key) ?? new Set<string>();
        set.add(r.lens!.line);
        seenLines.set(r.key, set);
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
    // 상태 줄이 실제로 갈린다: 부처궁 = 연애 4 + default, 자녀궁 = 있음 · 없음(미입력도 「자녀 미입력 렌즈」 none), 관록궁 · 재백궁 = 일 4.
    expect(seenLines.get("bucheo")?.size).toBe(5);
    expect(seenLines.get("janyeo")?.size).toBe(2);
    expect(seenLines.get("gwanrok")?.size).toBe(4);
    expect(seenLines.get("jaebaek")?.size).toBe(4);
    expect(seenLines.get("myeong")?.size).toBe(1);
  }, LONG);

  it("MBTI 16유형: 명궁 단독 주성 · 쌍성 · 공궁(빌린 쌍성)마다 짝을 찾음, 유형이 없으면 짝 없음", () => {
    const bad: string[] = [];
    for (const kind of ["single", "pair", "empty"] as const) {
      const c = charts.find(x => kindOf(x, "myeong") === kind);
      if (!c) { bad.push(`표본에 명궁 ${kind} 없음`); continue; }
      const life = c.palaces[0];
      const stars = kind === "empty" ? c.palaces.find(p => p.id === life.borrowFrom)!.majors : life.majors;
      for (const type of MBTI_TYPES) {
        const l = lookupZiwei(c, kb, { relationshipStatus: "", jobStatus: "", mbti: type });
        const m = l.mbti;
        if (!m || m.type !== type || m.borrowed !== (kind === "empty") || m.stars.join() !== stars.join()) { bad.push(`${kind} ${type}: 짝 대상 ${m?.stars.join()}`); continue; }
        if (m.rules.length !== (kind === "single" ? 1 : 2)) bad.push(`${kind} ${type}: 짝 ${m.rules.length}개`);
        for (const r of m.rules) {
          const e = r.entry;
          if (!e || e.id !== `zw-mbti:${r.star}:${type}` || e.entry.mbtiTarget !== type || e.entry.ziweiId !== `zw:star:${r.star}`) bad.push(`${kind} zw-mbti:${r.star}:${type}`);
          for (const s of e?.scenes ?? []) if (!sceneFits(s.requires, l.profile, s.text)) bad.push(`${kind} ${type}: 짝 장면 거름`);
        }
      }
      if (lookupZiwei(c, kb, { relationshipStatus: "", jobStatus: "" }).mbti !== null) bad.push(`${kind}: 유형 없는데 짝`);
    }
    expect(bad).toEqual([]);
  }, LONG);
});

// ---------- (다) 분포 보고(실패 아님) ----------
describe("(다) 분포 보고(3중 대비)", () => {
  it("명궁 주성 · 쌍성 · 공궁 빈도 · 화기 칸", () => {
    const zero = <K extends string>(keys: readonly K[]) => Object.fromEntries(keys.map(k => [k, 0])) as Record<K, number>;
    const myeongBundle = zero<string>([...MAJOR_STARS, ...STAR_PAIRS, "empty"]);
    const myeongKind = zero(["single", "pair", "empty"] as const);
    const palaceShape = Object.fromEntries(PALACES.map(p => [p, zero(["single", "pair", "empty"] as const)])) as Record<PalaceId, Record<"single" | "pair" | "empty", number>>;
    const pairFrequency = zero<string>(STAR_PAIRS);
    const emptyPerChart: Record<string, number> = {};
    const giPalace = zero<PalaceId>(PALACES);
    const giStar: Record<string, number> = {};
    const deepCoverage = Object.fromEntries(ZIWEI_DEEP_PALACES.map(p => [p, { found: 0, total: 0 }])) as Record<string, { found: number; total: number }>;
    const missing: Record<string, number> = {};
    const scenes = { kept: 0, droppedByRequires: 0, droppedByText: 0 };
    charts.forEach((c, i) => {
      myeongBundle[bundleOf(c, "myeong")]++;
      myeongKind[kindOf(c, "myeong")]++;
      for (const p of c.palaces) palaceShape[p.id][kindOf(c, p.id)]++;
      for (const pr of c.pairs) pairFrequency[pr.id]++;
      const e = String(c.palaces.filter(p => p.empty).length);
      emptyPerChart[e] = (emptyPerChart[e] ?? 0) + 1;
      const gi = c.mutagens.find(m => m.mutagen === "gi")!;
      giPalace[gi.palace]++;
      giStar[gi.star] = (giStar[gi.star] ?? 0) + 1;
      const l = base[i];
      for (const d of l.deep) { deepCoverage[d.palace].total++; if (d.entry) deepCoverage[d.palace].found++; }
      for (const id of l.missing) missing[id] = (missing[id] ?? 0) + 1;
      scenes.kept += l.sceneCount.kept; scenes.droppedByRequires += l.sceneCount.droppedByRequires; scenes.droppedByText += l.sceneCount.droppedByText;
    });
    const missingIds = Object.keys(missing).sort();
    const report = {
      seed: SEED, n: N, asOf: AS_OF, files: kb.files.length, ms,
      myeongKind, myeongBundle, palaceShape, pairFrequency, emptyPerChart, giPalace, giStar, deepCoverage,
      missing: { ids: missingIds.length, allPairDeep: missingIds.every(id => /^zw:deep:[a-z]+:[a-z]+-[a-z]+$/.test(id)), byId: missing },
      scenes,
    };
    const out = process.env.ZW_LINK_REPORT;
    if (out) writeFileSync(out, JSON.stringify(report, null, 1));
    else {
      const top = (r: Record<string, number>, n: number) => Object.entries(r).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} ${v}`).join(" · ");
      console.log([
        `[ZW 4부] ${N}명 seed ${SEED} · 명반 ${ms.charts}ms · 조회 ${ms.lookups}ms · 거름 ${ms.filter}ms`,
        `명궁: 단독 ${myeongKind.single} · 쌍성 ${myeongKind.pair} · 공궁 ${myeongKind.empty} | 상위 ${top(myeongBundle, 6)}`,
        `칸별 공궁: ${PALACES.map(p => `${p} ${palaceShape[p].empty}`).join(" · ")}`,
        `칸별 쌍성: ${PALACES.map(p => `${p} ${palaceShape[p].pair}`).join(" · ")}`,
        `공궁 수/명반: ${JSON.stringify(emptyPerChart)} | 쌍성 상위 ${top(pairFrequency, 5)}`,
        `화기 칸: ${top(giPalace, 12)}`,
        `빠짐 id ${missingIds.length}개(모두 쌍성 심화: ${report.missing.allPairDeep}) · 장면 ${JSON.stringify(scenes)}`,
      ].join("\n"));
    }
    expect(charts).toHaveLength(N);
  }, LONG);
});
