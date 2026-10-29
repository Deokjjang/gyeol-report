/**
 * 궁합 브리프: 두 사람 요약, 공통점·차이(행동 차원), 오행 보완, A→B·B→A 십성, 일주끼리 관계, MBTI 통념 궁합, 관계 유형 관점, v5 궁합 점수(P4: 구성요소·구간·방향).
 * 일주끼리 관계는 원국 감지와 같은 detectRelations를 쓴다(두 일주를 년·월 자리 라벨로 넣는다 — 라벨은 계산에 쓰이지 않는다).
 */
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import { computeCompatScore, type ConventionalFit } from "@/lib/compat/score";
import { compatibilityRoleLabels, type CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { detectRelations } from "@/lib/saju/detections";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, SajuCalcResult } from "@/lib/saju/types";
import type { ElementState } from "./chart";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, ganjiLabel, josa, tenGodLabel } from "./labels";
import type { ChartBrief, CompatibilityBrief, Trait } from "./schema";

const LENS_FOCUS: Record<CompatibilityRelationshipType, string> = {
  love: "감정·표현", marriage: "생활·역할·돈", parentChild: "기대·독립", coworker: "협업·경쟁", managerReport: "권한·속도", businessPartner: "지분·책임", friendship: "거리·빈도",
};

export type PairSide = {
  readonly saju: SajuCalcResult; readonly chart: ChartBrief; readonly st: ElementState; readonly traits: readonly Trait[]; readonly hitIds: readonly string[];
  readonly mbti: MbtiProfile | null; readonly callName: string;
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
  // 고객 본문에 "A·B" 기호가 나오지 않게(P3.5 A9 1회차): 기호 역할은 이름으로, 부모·상사 같은 역할은 "역할(이름)"으로.
  const label = (role: string, s: PairSide) => (/^[AB]$/.test(role) ? s.callName : `${role}(${s.callName})`);
  const featureName = (id: string) => k.features.get(id)?.name ?? id;
  const common = [
    ...a.hitIds.filter(id => b.hitIds.includes(id) && !/:BALANCED$|^(stem|branch|tenGod):/.test(id)).slice(0, 4).map(id => `둘 다 ${featureName(id)}`),
    ...a.st.lacking.filter(e => b.st.lacking.includes(e)).map(e => `둘 다 ${josa(ELEMENT_KO[e], "이가")} 부족`),
    ...(a.mbti && b.mbti ? [...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c).length ? [`MBTI 같은 글자: ${[...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c).join("")}`] : [] : []),
  ];
  const va = dimensionVector(a, k), vb = dimensionVector(b, k);
  const dims = k.ontology.dimensions.map(d => ({ d, x: va.get(d.id) ?? 0, y: vb.get(d.id) ?? 0 }))
    .filter(z => Math.sign(z.x) !== Math.sign(z.y) && Math.abs(z.x - z.y) > 0.3)
    .sort((p, q) => Math.abs(q.x - q.y) - Math.abs(p.x - p.y) || p.d.id.localeCompare(q.d.id)).slice(0, 3);
  const pole = (d: (typeof dims)[number]["d"], x: number) => (x >= 0 ? d.poles.plus.label : d.poles.minus.label);
  const fills = (from: PairSide, to: PairSide, fromName: string, toName: string) => to.st.lacking
    .filter((e: FiveElement) => from.st.excess.includes(e) || (from.saju.elements.visible[e] ?? 0) >= 2)
    .map(e => `${fromName}의 ${ELEMENT_KO[e]} 기운이 ${toName}에게 부족한 ${josa(ELEMENT_KO[e], "을를")} 채워 줌`);
  const ab = getTenGod(a.saju.dayMaster, b.saju.dayMaster), ba = getTenGod(b.saju.dayMaster, a.saju.dayMaster);
  const rel = detectRelations([{ position: "year", pillar: a.saju.pillars.day }, { position: "month", pillar: b.saju.pillars.day }]);
  const badge = (kind: string, key: string) => k.badges.find(x => x.kind === kind && (x.pair === key || x.pair === [...key].reverse().join(""))) ?? k.badges.find(x => x.kind === kind && !x.pair);
  const conv = a.mbti && b.mbti ? a.mbti.conventionalCompat.find(c => c.type === b.mbti!.type) : undefined;
  const conventional: ConventionalFit = (x, y) => k.mbti.get(x)?.conventionalCompat.find(c => c.type === y)?.fit ?? null;
  const s = computeCompatScore(category, { saju: a.saju, name: a.callName, mbti: a.mbti?.type ?? null }, { saju: b.saju, name: b.callName, mbti: b.mbti?.type ?? null }, { conventional });
  const person = (s: PairSide, role: string) => ({
    role, callName: s.callName, mbti: s.mbti?.type ?? null, dayPillar: ganjiLabel(s.saju.pillars.day),
    image: s.traits.find(t => t.family === "dayPillar" || t.family === "dayMaster")?.image.metaphor ?? s.chart.dayMaster.metaphor,
    traitIds: s.traits.map(t => t.id), excess: s.st.excess, lacking: s.st.lacking,
  });
  return {
    relationshipType: category,
    lens: { focus: LENS_FOCUS[category], roleLabels: [label(lensFromNarrative?.roleLabels[0] ?? roles.personA, a), label(lensFromNarrative?.roleLabels[1] ?? roles.personB, b)], tone: lensFromNarrative?.tone ?? "", forbidden: lensFromNarrative?.forbidden ?? [] },
    a: person(a, label(roles.personA, a)), b: person(b, label(roles.personB, b)),
    common: common.length ? common : ["눈에 띄는 공통 기운이 적어 서로 다른 점이 이야기의 중심"],
    differences: dims.map(z => ({ dimension: z.d.name, a: pole(z.d, z.x), b: pole(z.d, z.y) })),
    complement: [...fills(b, a, b.callName, a.callName), ...fills(a, b, a.callName, b.callName)],
    tenGodAB: { tenGod: tenGodLabel(ab), reading: k.features.get(`tenGod:${ab}`)?.oneLiner ?? "" },
    tenGodBA: { tenGod: tenGodLabel(ba), reading: k.features.get(`tenGod:${ba}`)?.oneLiner ?? "" },
    dayRelations: rel.map(r => `${r.kind}(${r.key}): ${badge(r.kind, r.key)?.line ?? ""}`),
    mbtiConvention: conv ? { fit: conv.fit, why: conv.why, note: "통념" } : null,
    score: {
      value: s.total, version: s.version, band: { label: s.band.label, tone: s.band.tone, verdict: s.band.verdict },
      components: s.components.map(c => ({ name: c.name, level: c.level, weight: c.weight, line: c.line })),
      direction: s.direction,
      rules: [
        `점수 ${s.total}점은 '${s.band.label}' 구간이다. 결론과 분위기를 이 구간에 맞춘다(다른 구간 이름·다른 점수를 쓰지 않는다)`,
        "구성요소의 line을 근거로 왜 그런 점수인지 쉬운 말로 풀고, '조율' 요소마다 보완법을 하나씩 쓴다",
        "점수가 낮아도 헤어짐·멀어짐을 권하지 않는다. 점수를 스스로 깎아내리는 말(근거가 없다, 재미로 보는)도 쓰지 않는다",
      ],
    },
  };
}
