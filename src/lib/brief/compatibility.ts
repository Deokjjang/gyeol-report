/**
 * 궁합 브리프: 두 사람 요약, 공통점·차이(행동 차원), 오행 보완, A→B·B→A 십성, 일주끼리 관계, MBTI 통념 궁합, 관계 유형 관점, 기존 점수(재설계 예정).
 * 일주끼리 관계는 원국 감지와 같은 detectRelations를 쓴다(두 일주를 년·월 자리 라벨로 넣는다 — 라벨은 계산에 쓰이지 않는다).
 */
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import { buildCompatibilityEvidenceFromGenerationInput } from "@/lib/report-generation/compatibilityGenerationHandler";
import type { CompatibilityGenerationInput } from "@/lib/report-generation/reportInputAdapter";
import { compatibilityRoleLabels, type CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { detectRelations } from "@/lib/saju/detections";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, SajuCalcResult } from "@/lib/saju/types";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, ganjiLabel, josa, tenGodLabel } from "./labels";
import type { ChartBrief, CompatibilityBrief, Trait } from "./schema";

const LENS_FOCUS: Record<CompatibilityRelationshipType, string> = {
  love: "감정·표현", marriage: "생활·역할·돈", parentChild: "기대·독립", coworker: "협업·경쟁", managerReport: "권한·속도", businessPartner: "지분·책임", friendship: "거리·빈도",
};

export type PairSide = {
  readonly saju: SajuCalcResult; readonly chart: ChartBrief; readonly traits: readonly Trait[]; readonly hitIds: readonly string[];
  readonly mbti: MbtiProfile | null; readonly callName: string; readonly generationInput: CompatibilityGenerationInput["personA"];
};

function dimensionVector(side: PairSide, k: Knowledge): Map<string, number> {
  const v = new Map<string, number>();
  const add = (tags: Readonly<Record<string, number>>, w: number) => { for (const [d, x] of Object.entries(tags)) v.set(d, (v.get(d) ?? 0) + x * w); };
  for (const t of side.traits) { const f = k.features.get(t.featureId); if (f) add(f.dimensionTags, t.score); }
  if (side.mbti) add(side.mbti.dimensionTags, 1.5 * Math.max(1, ...side.traits.map(t => t.score)));
  return v;
}

export function buildCompatibility(category: CompatibilityRelationshipType, a: PairSide, b: PairSide, k: Knowledge, lensFromNarrative: { roleLabels: [string, string]; tone: string; forbidden: string[] } | undefined): CompatibilityBrief {
  const roles = compatibilityRoleLabels(category);
  const featureName = (id: string) => k.features.get(id)?.name ?? id;
  const common = [
    ...a.hitIds.filter(id => b.hitIds.includes(id) && !/:BALANCED$|^(stem|branch|tenGod):/.test(id)).slice(0, 4).map(id => `둘 다 ${featureName(id)}`),
    ...a.chart.elements.lacking.filter(e => b.chart.elements.lacking.includes(e)).map(e => `둘 다 ${josa(ELEMENT_KO[e], "이가")} 부족`),
    ...(a.mbti && b.mbti ? [...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c).length ? [`MBTI 같은 글자: ${[...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c).join("")}`] : [] : []),
  ];
  const va = dimensionVector(a, k), vb = dimensionVector(b, k);
  const dims = k.ontology.dimensions.map(d => ({ d, x: va.get(d.id) ?? 0, y: vb.get(d.id) ?? 0 }))
    .filter(z => Math.sign(z.x) !== Math.sign(z.y) && Math.abs(z.x - z.y) > 0.3)
    .sort((p, q) => Math.abs(q.x - q.y) - Math.abs(p.x - p.y) || p.d.id.localeCompare(q.d.id)).slice(0, 3);
  const pole = (d: (typeof dims)[number]["d"], x: number) => (x >= 0 ? d.poles.plus.label : d.poles.minus.label);
  const fills = (from: PairSide, to: PairSide, fromName: string, toName: string) => to.chart.elements.lacking
    .filter((e: FiveElement) => from.chart.elements.excess.includes(e) || (from.chart.elements.counts[e] ?? 0) >= 2)
    .map(e => `${fromName}의 ${ELEMENT_KO[e]} 기운이 ${toName}에게 부족한 ${josa(ELEMENT_KO[e], "을를")} 채워 줌`);
  const ab = getTenGod(a.saju.dayMaster, b.saju.dayMaster), ba = getTenGod(b.saju.dayMaster, a.saju.dayMaster);
  const rel = detectRelations([{ position: "year", pillar: a.saju.pillars.day }, { position: "month", pillar: b.saju.pillars.day }]);
  const badge = (kind: string, key: string) => k.badges.find(x => x.kind === kind && (x.pair === key || x.pair === [...key].reverse().join(""))) ?? k.badges.find(x => x.kind === kind && !x.pair);
  const conv = a.mbti && b.mbti ? a.mbti.conventionalCompat.find(c => c.type === b.mbti!.type) : undefined;
  let score: number | null = null;
  try {
    score = buildCompatibilityEvidenceFromGenerationInput({ kind: "compatibility", productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: category, personA: a.generationInput, personB: b.generationInput, productOptions: {} }, { personA: a.saju, personB: b.saju }).score.totalScore;
  } catch { score = null; }
  const person = (s: PairSide, role: string) => ({
    role, callName: s.callName, mbti: s.mbti?.type ?? null, dayPillar: ganjiLabel(s.saju.pillars.day),
    image: s.traits.find(t => t.family === "dayPillar" || t.family === "dayMaster")?.image.metaphor ?? s.chart.dayMaster.metaphor,
    traitIds: s.traits.map(t => t.id), excess: s.chart.elements.excess, lacking: s.chart.elements.lacking,
  });
  return {
    relationshipType: category,
    lens: { focus: LENS_FOCUS[category], roleLabels: lensFromNarrative?.roleLabels ?? [roles.personA, roles.personB], tone: lensFromNarrative?.tone ?? "", forbidden: lensFromNarrative?.forbidden ?? [] },
    a: person(a, roles.personA), b: person(b, roles.personB),
    common: common.length ? common : ["눈에 띄는 공통 기운이 적어 서로 다른 점이 이야기의 중심"],
    differences: dims.map(z => ({ dimension: z.d.name, a: pole(z.d, z.x), b: pole(z.d, z.y) })),
    complement: [...fills(b, a, roles.personB, roles.personA), ...fills(a, b, roles.personA, roles.personB)],
    tenGodAB: { tenGod: tenGodLabel(ab), reading: k.features.get(`tenGod:${ab}`)?.oneLiner ?? "" },
    tenGodBA: { tenGod: tenGodLabel(ba), reading: k.features.get(`tenGod:${ba}`)?.oneLiner ?? "" },
    dayRelations: rel.map(r => `${r.kind}(${r.key}): ${badge(r.kind, r.key)?.line ?? ""}`),
    mbtiConvention: conv ? { fit: conv.fit, why: conv.why, note: "통념" } : null,
    score: { value: score, status: "재설계 예정(P4)", basis: "v4 scoreCompatibility(오행·십성·MBTI 다리) 값을 그대로 전달. 본문과 맞물리게 P4에서 다시 설계한다" },
  };
}
