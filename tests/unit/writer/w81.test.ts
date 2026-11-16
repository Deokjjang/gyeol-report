// W8.1(외부 호출 0, 가상 인물 + 합성 문장만): 모순 출처 추적으로 고른 고침 — G1 세기 1 짝 · G3 성격 요약표 대조 · G5 특징 벡터 꼬리표 · 결정 4 상한 · G6 수리 뒤 대조.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { personProfileOf, pieceAudit, renderWriterBrief } from "@/lib/writer/prompt";
import { materialKey, materialTable } from "@/lib/writer/prompt/materials";
import { featureLineDims, MAX_DROPS } from "@/lib/writer/prompt/pairTidy";
import { cueKeys, profilePoles, type ContradictionCtx } from "@/lib/writer/safety/contradiction";
import { revertRepairPoles, type AppliedRepair } from "@/lib/writer/repair3";
import { renderMarks, type Mark } from "@/lib/writer/marks";
import { inferiorAsStrength } from "@/lib/writer/safety/contradiction";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-11-14";
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const make = (input: BriefInput) => { const brief = buildBrief(input, k); const sheet = buildFactSheet(input, brief, k); return { brief, sheet }; };
const F = make({ product: "saju_mbti_full", baseDate, person: person("minjun", "c3", "ISTP") });
const L = make({ product: "love_marriage_child", baseDate, person: person("minjun", "c3", "ENTJ") });
const C = make({ product: "saju_mbti_compatibility", baseDate, person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput);
const strings = (o: unknown, out: string[] = []): string[] => { if (typeof o === "string") out.push(o); else if (Array.isArray(o)) o.forEach(x => strings(x, out)); else if (o && typeof o === "object") Object.values(o).forEach(x => strings(x, out)); return out; };
const table = materialTable(k);

describe("W8.1 작가 입력 재료 정리(4종)", () => {
  it("결정 4: 한 권에서 빼는 줄은 상한 이하, 넘친 것은 audit.left로 남긴다", () => {
    for (const X of [F, L, C]) {
      const a = pieceAudit(X.brief, { knowledge: k, facts: X.sheet })!;
      expect(a.drops.length).toBeLessThanOrEqual(MAX_DROPS);
      expect(a.capped ?? 0).toBe(a.left?.length ?? 0);
      const view = strings(renderWriterBrief(X.brief, { knowledge: k, facts: X.sheet })).join("\n");
      // 궁합은 같은 DB 줄이 주인(0·1·−1)마다 따로 나오고 정리도 주인별이다 → 한 주인에만 나오는 줄만 글로 확인한다.
      const owners = new Map<string, Set<number>>(); for (const p of a.pieces) owners.set(p.key, (owners.get(p.key) ?? new Set()).add(p.owner));
      for (const d of a.drops) if ((owners.get(materialKey(d.dropped))?.size ?? 1) === 1) expect(view.includes(table.exact.get(d.dropped) ?? d.dropped)).toBe(false);
    }
  });
  it("G3: 남은 성격·상황 줄(유일한 재료·상한으로 남긴 줄 제외)에는 성격 요약표와 반대 끝이 더 센 줄이 없다", () => {
    for (const X of [F, L, C]) {
      const a = pieceAudit(X.brief, { knowledge: k, facts: X.sheet })!;
      const compat = Boolean(X.brief.compatibility);
      const poles = compat ? (X.brief.compatibility!.profiles ?? []).map(c => profilePoles(c)) : [profilePoles(personProfileOf(X.brief, k))];
      const gone = new Set([...a.drops, ...(a.left ?? [])].map(d => `${d.owner}|${materialKey(d.dropped)}`));
      const feat = featureLineDims(X.brief, k);
      for (const p of a.pieces) {
        if (p.sole || gone.has(`${p.owner}|${p.key}`)) continue;
        const t = k.personaTags.get(p.key);
        const d = t?.d.length ? (t.k === "trait" || t.k === "situ" ? t.d : []) : (!t || t.k === "explain" ? feat.get(p.key) ?? [] : []);
        const who = p.owner >= 0 ? [p.owner] : compat ? [0, 1] : [];
        for (const i of who) {
          const pv = poles[i]; if (!pv) continue;
          const opp = d.filter(([dim, pole]) => pv.get(dim) === -pole).reduce((s, x) => s + x[2], 0), agree = d.filter(([dim, pole]) => pv.get(dim) === pole).reduce((s, x) => s + x[2], 0);
          expect(opp > 0 && opp > agree, `${p.owner} ${p.text.slice(0, 40)}`).toBe(false);
        }
      }
    }
  });
  it("G1: 남은 줄에는 같은 사람·같은 차원·같은 조건 반대 끝 짝이 세기 1 줄까지 없다(유일한 재료·상한 제외)", () => {
    for (const X of [F, L, C]) {
      const a = pieceAudit(X.brief, { knowledge: k, facts: X.sheet })!;
      const gone = new Set([...a.drops, ...(a.left ?? [])].map(d => `${d.owner}|${materialKey(d.dropped)}`));
      const feat = featureLineDims(X.brief, k);
      const poles = new Map<string, Set<number>>();
      for (const p of a.pieces) {
        if (p.owner < 0 || p.sole || gone.has(`${p.owner}|${p.key}`)) continue;
        const t = k.personaTags.get(p.key);
        const d = t?.d.length ? (t.k === "trait" || t.k === "situ" ? t.d : []) : (!t || t.k === "explain" ? feat.get(p.key) ?? [] : []);
        const c = t?.d.length ? `${t.c?.who ?? ""}|${t.c?.sit ?? ""}` : "|";
        for (const [dim, pole] of d) { const key = `${p.owner}|${dim}|${c}`; poles.set(key, (poles.get(key) ?? new Set()).add(pole)); }
      }
      expect([...poles].filter(([, v]) => v.size > 1).map(([kk]) => kk)).toEqual([]);
    }
  });
  it("G5: 특징 글의 차원 꼬리표는 과함·그림자 칸을 빼고, 특징 벡터 |w| ≥ 0.5만 쓴다", () => {
    const dims = featureLineDims(F.brief, k);
    for (const t of F.brief.traits) {
      const f = k.features.get(t.featureId); if (!f) continue;
      for (const o of f.overuse ?? []) if (typeof o === "string" && o !== f.meaning && !(f.strengths ?? []).includes(o)) expect(dims.has(materialKey(o))).toBe(false);
      if (typeof f.shadow === "string" && f.shadow !== f.meaning) expect(dims.has(materialKey(f.shadow))).toBe(false);
    }
    expect(dims.size).toBeGreaterThan(0);
    for (const d of dims.values()) for (const [, , s] of d) expect(s).toBe(1);
  });
});

describe("W8.1 G6 수리 뒤 대조", () => {
  const ctx: ContradictionCtx = { compat: false, people: [{ names: ["지민"], label: "지민님", codes: { energy: "I", lead: "back", conflict: "later", express: "행동", decide: "fast" } }] };
  const book = (s: string) => [{ n: 1, title: "1장", source: "writer" as const, sections: [{ heading: "소제목", paragraphs: [s] }] }];
  const rep = (before: string, after: string): AppliedRepair => ({ id: 1, kind: "sentence", at: "1.0.0", before, after, source: ["lint"] });
  it("원문에 없던 성향 단정 꼴(「~편은 아닙니다」)은 원문으로 되돌린다", () => {
    const before = "봄 나무에 해당하는 재성이 많아서 시도할 일과 돈 될 일이 눈에 자주 띕니다.", after = "재성은 보통이라 시도할 일과 돈 될 일이 눈에 띄긴 해도, 눈에 띄는 만큼 다 쫓는 편은 아닙니다.";
    const r = revertRepairPoles(book(after), [rep(before, after)], ctx);
    expect(r.reverted.map(x => x.rule)).toEqual(["repair_pole_frame"]);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe(before);
  });
  it("성격 요약표와 반대 끝(앞에 나섬 ↔ 뒤에서 제 몫)을 새로 단정하면 되돌린다", () => {
    const before = "당신의 사주에는 장성살이 있어요.", after = "당신은 장성살 덕분에 가운데에 서는 쪽이에요.";
    const r = revertRepairPoles(book(after), [rep(before, after)], ctx);
    expect(r.reverted[0]?.rule).toBe("repair_pole_profile:attentionSeeking");
  });
  it("사실만 고친 수리(차원 끝 없음)와 원문에 같은 단서가 있던 수리는 그대로 둔다", () => {
    const a1 = rep("식상은 하나도 없어서 표현이 늦어요.", "식상은 겉에 드러나지 않아서 표현이 늦어요.");
    expect(revertRepairPoles(book(a1.after), [a1], ctx).reverted).toEqual([]);
    const a2 = rep("약속이 이어지면 혼자 있는 시간이 필요한 편이에요.", "당신은 혼자 있는 시간이 꼭 필요한 편이에요.");
    expect(cueKeys(a2.before).has("socialEnergy-")).toBe(true);
    expect(revertRepairPoles(book(a2.after), [a2], ctx).reverted).toEqual([]);
  });
});

describe("W8.1 측정 중 고침(m2 — 직접 읽기에서 확인한 깨진 문장·잘못된 연결의 꼴)", () => {
  it("⑦'' 자리 표시 구절의 주인을 성 뺀 이름으로 이미 불렀으면 「○○님의」를 뗀다", () => {
    const m: Mark = { key: "at:at1", kind: "at", text: "장덕민님의 세 자리(연지·월간·일주)", owner: "장덕민님" } as Mark;
    const r = renderMarks("현침살은 덕민님이 ⟦at:at1⟧에 두고 있는 기운이에요.", new Map([["at:at1", m]]));
    expect(r).toBe("현침살은 덕민님이 세 자리(연지·월간·일주)에 두고 있는 기운이에요.");
    expect(renderMarks("현침살은 ⟦at:at1⟧에 있어요.", new Map([["at:at1", m]]))).toContain("장덕민님의 세 자리");
  });
  it("⑫ 「사이의 X」 구절 뒤 작가의 「사이에는」 겹침을 뗀다", () => {
    const m: Mark = { key: "at:t5", kind: "at", text: "태어난 해와 날 사이의 원진" } as Mark;
    expect(renderMarks("⟦at:t5⟧ 사이에는 원진살이 있어요.", new Map([["at:t5", m]]))).toBe("태어난 해와 날 사이의 원진에는 원진살이 있어요.");
  });
  it("열등 기능 행동: Fi가 열등인 유형에 「감정도 분명하게 말함」을 그 유형 버릇으로 단정하면 걸고, 늦음·서툶을 말하면 두지 않는다", () => {
    expect(inferiorAsStrength("ENTJ는 계획을 세워 곧게 다가가고 감정도 분명하게 말합니다.", "ENTJ", {})).not.toBeNull();
    expect(inferiorAsStrength("ENTJ는 감정을 분명하게 말하는 데 서툴 수 있어요.", "ENTJ", {})).toBeNull();
    expect(inferiorAsStrength("ENFP는 감정도 분명하게 말합니다.", "ENFP", {})).toBeNull();
  });
});
