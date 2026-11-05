/**
 * 정답지 자기검증(최종판3 1): 정답지 안의 사실끼리 모순이 없는지 본다. 걸리면 엔진 라벨 기준 문제(고친다) 또는 계산 문제(보고만)다.
 *  - 다섯 힘 라벨 ↔ 신강약: 신약인데 비겁·인성이 강, 신강인데 비겁·인성이 모두 약
 *  - 오행 개수 ↔ 세기 표현: 없음인데 글자가 있음, 많음인데 겉 글자 0 등
 *  - 신살 위치 ↔ 원국 글자: 신살 칸 글자가 그 기준 글자 집합에 있는지(천문·현침), 칸 글자가 원국에 있는지
 *  - 관계: 구성원 글자 수 ↔ 완성도(반합 2자·삼합 3자·삼형 full 3자/partial 2자)
 *  - 대운: 10년 간격·시작 해 오름차순
 */
import { CHEONMUN_BRANCHES, HYEONCHIM_CHARS } from "@/lib/saju/detections/tables";
import type { FactSheet, PersonFacts } from "./build";

export type SelfIssue = { readonly who: string; readonly kind: "group_vs_strength" | "count_vs_status" | "shinsal_glyph" | "relation_form" | "dayun_order"; readonly detail: string };

function personIssues(p: PersonFacts): SelfIssue[] {
  const out: SelfIssue[] = [];
  const push = (kind: SelfIssue["kind"], detail: string) => out.push({ who: p.name, kind, detail });
  const lv = p.strength.level, g = p.groups;
  if ((lv === "VERY_WEAK" || lv === "WEAK") && (g.PEER.level === "강" || g.RESOURCE.level === "강")) push("group_vs_strength", `${p.strength.labelKo}인데 ${g.PEER.level === "강" ? `비겁 강(${g.PEER.value})` : `인성 강(${g.RESOURCE.value})`}`);
  if ((lv === "VERY_STRONG" || lv === "STRONG") && g.PEER.level === "약" && g.RESOURCE.level === "약") push("group_vs_strength", `${p.strength.labelKo}인데 비겁(${g.PEER.value})·인성(${g.RESOURCE.value}) 모두 약`);
  for (const e of Object.keys(p.elements.count) as (keyof PersonFacts["elements"]["count"])[]) {
    const c = p.elements.count[e], st = p.elements.status[e];
    if (st === "없음" && (c > 0 || p.elements.hidden[e])) push("count_vs_status", `${e} 없음인데 겉 ${c}·땅속 ${p.elements.hidden[e]}`);
    if (st === "많음" && c === 0) push("count_vs_status", `${e} 많음인데 겉 글자 0`);
  }
  if (!(p.elements.status[p.elements.strongest] === "많음" || p.elements.strength[p.elements.strongest] >= Math.max(...Object.values(p.elements.strength)))) push("count_vs_status", `가장 센 기운 ${p.elements.strongest}가 세기 최댓값이 아님`);
  const glyphsOf = new Set(Object.values(p.pillars).flatMap(x => (x ? [x.stem, x.branch] : [])));
  for (const s of p.shinsal) {
    for (const gph of s.glyphs) if (!glyphsOf.has(gph as never)) push("shinsal_glyph", `${s.name} 칸 글자 ${gph}가 원국에 없음`);
    if (s.code === "CHEONMUN" && s.glyphs.some(x => !(CHEONMUN_BRANCHES as readonly string[]).includes(x))) push("shinsal_glyph", `천문성 글자 ${s.glyphs.join("·")}가 기준(${CHEONMUN_BRANCHES.join("·")}) 밖`);
    if (s.code === "HYEONCHIMSAL" && s.glyphs.some(x => !(HYEONCHIM_CHARS as readonly string[]).includes(x))) push("shinsal_glyph", `현침살 글자 ${s.glyphs.join("·")}가 기준 밖`);
    if (!s.slots.length) push("shinsal_glyph", `${s.name} 칸 없음`);
  }
  for (const r of [...p.relations, ...p.annual.flatMap(a => a.relations)]) {
    if (r.kind === "SAMHAP" && r.completeness === "half" && r.glyphCount !== 2) push("relation_form", `반합 ${r.key} 글자 ${r.glyphCount}`);
    if (r.kind === "SAMHAP" && r.completeness === "full" && r.glyphCount !== 3) push("relation_form", `삼합 ${r.key} 글자 ${r.glyphCount}`);
    if (r.kind === "HYEONG" && r.subtype === "삼형" && r.completeness === "full" && r.glyphCount !== 3) push("relation_form", `삼형 ${r.key} 글자 ${r.glyphCount}`);
  }
  const cy = p.dayun.cycles;
  for (let i = 1; i < cy.length; i++) if (cy[i].startYear - cy[i - 1].startYear !== 10) push("dayun_order", `대운 ${cy[i - 1].ganji}→${cy[i].ganji} 간격 ${cy[i].startYear - cy[i - 1].startYear}`);
  return out;
}

export function selfCheck(f: FactSheet): SelfIssue[] {
  const out = f.people.flatMap(personIssues);
  if (f.pair?.score) {
    const sum = f.pair.score.base + f.pair.score.components.reduce((s, c) => s + c.points, 0);
    if (sum !== f.pair.score.value) out.push({ who: "pair", kind: "relation_form", detail: `궁합 점수 합 ${sum} ≠ 총점 ${f.pair.score.value}` });
  }
  return out;
}
