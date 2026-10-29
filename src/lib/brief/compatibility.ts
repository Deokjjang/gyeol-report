/**
 * 궁합 브리프: 두 사람 요약, 공통점·차이(행동 차원), 오행 보완, A→B·B→A 십성, 일주끼리 관계, MBTI 통념 궁합, 관계 유형 관점, v5 궁합 점수(P4: 구성요소·구간·방향).
 * 두 사람 기둥끼리 관계는 원국 감지와 같은 detectRelations를 쓴다(두 기둥을 년·월 자리 라벨로 넣는다 — 라벨은 계산에 쓰이지 않는다).
 */
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import { computeCompatScore, type ConventionalFit } from "@/lib/compat/score";
import { compatibilityRoleLabels, type CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { detectRelations } from "@/lib/saju/detections";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, SajuCalcResult } from "@/lib/saju/types";
import type { ElementState } from "./chart";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, ganjiLabel, glyphLabel, josa, tenGodLabel } from "./labels";
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

const PILLAR_KO = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as const;
const REL_EASY: Record<string, string> = {
  STEM_HAP: "끌려 붙는 합(천간합)", YUKHAP: "짝꿍처럼 붙는 합(육합)", SAMHAP: "반쯤 맺힌 짝(반합)", BANGHAP: "같은 계절 모임(방합)",
  CHUNG: "서로 부딪치는 기운(충)", HYEONG: "서로 조이는 기운(형)", PA: "금이 가게 하는 기운(파)", HAE: "서로 거슬리는 기운(해)", WONJIN: "신발 속 모래알 같은 기운(원진)",
};
/**
 * 두 사람 사이 관계의 자리 문장(P3.7 1-5): "정희님의 태어난 날 땅 글자 亥와 지우님의 태어난 날 땅 글자 巳: 서로 부딪치는 기운(충)".
 * 날–날을 먼저, 그다음 날이 낀 짝, 그 밖 짝 순으로 4개까지. 시간 미상인 사람의 시각 기둥은 보지 않는다.
 */
function pairRelations(a: PairSide, b: PairSide, k: Knowledge): string[] {
  const POS = ["day", "month", "year", "hour"] as const;
  const rows: { rank: number; text: string }[] = [];
  for (const pa of POS) for (const pb of POS) {
    // 시각 기둥은 원국 요약에 있을 때(시간을 알 때)만.
    const x = pa === "hour" && !a.chart.pillars.hour ? undefined : a.saju.pillars[pa], y = pb === "hour" && !b.chart.pillars.hour ? undefined : b.saju.pillars[pb];
    if (!x || !y) continue;
    for (const r of detectRelations([{ position: "year", pillar: x }, { position: "month", pillar: y }])) {
      const sky = r.kind === "STEM_HAP", ga = sky ? x.stem : x.branch, gb = sky ? y.stem : y.branch;
      const glyph = sky ? "하늘 글자" : "땅 글자";
      const line = k.badges.find(z => z.kind === r.kind && (z.pair === r.key || z.pair === [...r.key].reverse().join("")))?.line ?? "";
      const rank = (pa === "day" ? 0 : 2) + (pb === "day" ? 0 : 2) + (sky ? 1 : 0);
      rows.push({ rank, text: `${a.callName}의 ${PILLAR_KO[pa]} ${glyph} ${josa(glyphLabel(ga), "과와")} ${b.callName}의 ${PILLAR_KO[pb]} ${glyph} ${glyphLabel(gb)}: ${REL_EASY[r.kind] ?? r.kind}${line ? ` — ${line}` : ""}` });
    }
  }
  return rows.sort((p, q) => p.rank - q.rank).slice(0, 4).map(r => r.text);
}

export function buildCompatibility(category: CompatibilityRelationshipType, a: PairSide, b: PairSide, k: Knowledge, lensFromNarrative: { roleLabels: [string, string]; tone: string; forbidden: string[] } | undefined): CompatibilityBrief {
  const roles = compatibilityRoleLabels(category);
  // 고객 본문에 "A·B" 기호가 나오지 않게(P3.5 A9 1회차): 기호 역할은 이름으로, 부모·상사 같은 역할은 "역할(이름)"으로.
  const label = (role: string, s: PairSide) => (/^[AB]$/.test(role) ? s.callName : `${role}(${s.callName})`);
  // 공통 기운은 "쉬운 말(이름)" 꼴로 준다(P3.6 B: 이름만 주면 작가가 "백호대살과 겁살" 같은 용어를 그대로 옮겼다).
  const featureName = (id: string) => { const f = k.features.get(id); return f ? `${f.easyName} 같은 기운(${f.name.replace(/\(.*?\)/g, "").trim()})` : id; };
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
  const rel = pairRelations(a, b, k);
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
    // 두 방향이 같은 십성이면 같은 문장을 두 장에 주지 않는다(P3.7 r1: 3·4장이 같은 "나란히 걷는 같은 편").
    tenGodBA: { tenGod: tenGodLabel(ba), reading: ab === ba ? `서로를 같은 기운으로 본다. 앞 장과 겹치지 않게, 이 방향에서는 ${k.features.get(`tenGod:${ba}`)?.strengths[1] ?? k.features.get(`tenGod:${ba}`)?.strengths[0] ?? ""}` : k.features.get(`tenGod:${ba}`)?.oneLiner ?? "" },
    dayRelations: rel,
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
