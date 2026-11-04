/**
 * 궁합 브리프: 두 사람 요약, 공통점·차이(행동 차원), 오행 보완, A→B·B→A 십성, 일주끼리 관계, MBTI 통념 궁합, 관계 유형 관점, v5 궁합 점수(P4: 구성요소·구간·방향).
 * 두 사람 기둥끼리 관계는 원국 감지와 같은 detectRelations를 쓴다(두 기둥을 년·월 자리 라벨로 넣는다 — 라벨은 계산에 쓰이지 않는다).
 */
import { poleFits } from "./mbtiFn";
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import { computeCompatScore } from "@/lib/compat/score";
import { compatibilityRoleLabels, type CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { detectRelations } from "@/lib/saju/detections";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, SajuCalcResult } from "@/lib/saju/types";
import type { ElementState } from "./chart";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, ganjiLabel, josa, relationPlain, tenGodLabel } from "./labels";
import type { ChartBrief, CompatibilityBrief, Trait } from "./schema";
import { pairImage } from "./coreImage";
import { groupValues } from "@/lib/saju/groupStrength";
import { splitSentences } from "@/lib/writer/safety/patterns";

const LENS_FOCUS: Record<CompatibilityRelationshipType, string> = {
  love: "감정·표현", marriage: "생활·역할·돈", parentChild: "기대·독립", coworker: "협업·경쟁", managerReport: "권한·속도", businessPartner: "지분·책임", friendship: "거리·빈도",
};

export type PairSide = {
  readonly saju: SajuCalcResult; readonly chart: ChartBrief; readonly st: ElementState; readonly traits: readonly Trait[]; readonly hitIds: readonly string[];
  readonly mbti: MbtiProfile | null; readonly callName: string; readonly gender: "MALE" | "FEMALE" | null;
};

function dimensionVector(side: PairSide, k: Knowledge): Map<string, number> {
  const v = new Map<string, number>();
  const add = (tags: Readonly<Record<string, number>>, w: number) => { for (const [d, x] of Object.entries(tags)) v.set(d, (v.get(d) ?? 0) + x * w); };
  for (const t of side.traits) { const f = k.features.get(t.featureId); if (f) add(f.dimensionTags, t.score); }
  if (side.mbti) add(side.mbti.dimensionTags, 1.5 * Math.max(1, ...side.traits.map(t => t.score)));
  return v;
}

const PILLAR_KO = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as const;
/**
 * 두 사람 사이 관계의 자리 문장(P3.7 1-5): "정희님의 태어난 날 땅 글자 亥와 지우님의 태어난 날 땅 글자 巳: 서로 부딪치는 기운(충)".
 * 날–날을 먼저, 그다음 날이 낀 짝, 그 밖 짝 순으로 4개까지. 시간 미상인 사람의 시각 기둥은 보지 않는다.
 */
function pairRelations(a: PairSide, b: PairSide, k: Knowledge): string[] {
  const POS = ["day", "month", "year", "hour"] as const;
  const ORDER: Readonly<Record<string, number>> = { year: 0, month: 1, day: 2, hour: 3 };
  type Row = { pas: string[]; pbs: string[]; kind: string; key: string; sky: boolean; line: string; rank: number };
  const raw: Row[] = [];
  for (const pa of POS) for (const pb of POS) {
    // 시각 기둥은 원국 요약에 있을 때(시간을 알 때)만.
    const x = pa === "hour" && !a.chart.pillars.hour ? undefined : a.saju.pillars[pa], y = pb === "hour" && !b.chart.pillars.hour ? undefined : b.saju.pillars[pb];
    if (!x || !y) continue;
    for (const r of detectRelations([{ position: "year", pillar: x }, { position: "month", pillar: y }])) {
      const sky = r.kind === "STEM_HAP";
      const line = k.badges.find(z => z.kind === r.kind && (z.pair === r.key || z.pair === [...r.key].reverse().join("")))?.line ?? "";
      raw.push({ pas: [pa], pbs: [pb], kind: r.kind, key: [...r.key].sort().join(""), sky, line, rank: (pa === "day" ? 0 : 2) + (pb === "day" ? 0 : 2) + (sky ? 1 : 0) });
    }
  }
  // P6e 20: 같은 관계(같은 글자 짝·같은 관계 이름)가 한 사람의 여러 자리에 걸리면 한 줄로 합친다("태어난 해·달 땅 글자 모두와").
  const merge = (rows: Row[], side: "pas" | "pbs"): Row[] => {
    const other = side === "pas" ? "pbs" : "pas", by = new Map<string, Row>();
    for (const r of rows) {
      const g = `${r.kind}|${r.key}|${r.sky}|${r[other].join(",")}`;
      const m = by.get(g);
      if (!m) by.set(g, { ...r, pas: [...r.pas], pbs: [...r.pbs] });
      else { m[side] = [...new Set([...m[side], ...r[side]])]; m.rank = Math.min(m.rank, r.rank); }
    }
    return [...by.values()];
  };
  const SHORT: Readonly<Record<string, string>> = { year: "해", month: "달", day: "날", hour: "시각" };
  const where = (s: PairSide, ps: string[], glyph: string) => { const sorted = [...ps].sort((p, q) => ORDER[p] - ORDER[q]); return sorted.length === 1 ? `${s.callName}의 ${PILLAR_KO[sorted[0] as keyof typeof PILLAR_KO]} ${glyph}` : `${s.callName}의 태어난 ${sorted.map(p => SHORT[p]).join("·")} ${glyph} 모두`; };
  // 쉬운 문장(P6b D 궁합 relationsPlain): 글자 표기 없이 자리와 관계 이름·뜻만(E-9: "(정축·정축(丁丑))" 같은 겹친 표기 방지).
  return merge(merge(raw, "pbs"), "pas").sort((p, q) => p.rank - q.rank).slice(0, 4)
    .map(r => { const glyph = r.sky ? "하늘 글자" : "땅 글자"; return relationPlain(where(a, r.pas, glyph), where(b, r.pbs, glyph), r.kind, r.kind === "SAMHAP", r.line); });
}

/**
 * 장면 역할(P6b D 궁합): 같은 장면에서 누가 무엇을 먼저 하는지 근거와 함께 정한다. MBTI 글자가 다르면 그 글자로,
 * MBTI가 없으면 십성 묶음(비겁=앞장섬, 식상=먼저 말함, 관성=규칙 챙김) 세기로. 작가는 장면마다 이 역할로 A·B를 나눈다.
 */
function sceneRoles(a: PairSide, b: PairSide): string[] {
  const out: string[] = [];
  const LETTER: [number, string, string, string][] = [[0, "E", "I", "먼저 말을 꺼내고 사람을 부르는 쪽"], [3, "J", "P", "일정과 계획을 먼저 짜는 쪽"], [2, "T", "F", "결정을 사실과 원칙으로 정리하는 쪽"], [1, "N", "S", "큰 그림을 먼저 말하는 쪽"]];
  if (a.mbti && b.mbti) for (const [i, x, y, what] of LETTER) {
    const ca = a.mbti.type[i], cb = b.mbti.type[i];
    if (ca !== cb) { const lead = ca === x ? a : cb === x ? b : null; const other = lead === a ? b : a; if (lead) out.push(`${what}: ${lead.callName}(${x}), 받아서 맞추는 쪽: ${other.callName}(${y})`); }
  }
  if (out.length < 2) {
    const ga = groupValues(a.saju), gb = groupValues(b.saju);
    for (const [g, what] of [["PEER", "앞장서서 정하는 쪽"], ["OUTPUT", "먼저 표현하는 쪽"], ["OFFICER", "약속과 규칙을 챙기는 쪽"]] as const) {
      if (Math.abs(ga[g] - gb[g]) < 1 || out.length >= 3) continue;
      const lead = ga[g] > gb[g] ? a : b;
      out.push(`${what}: ${lead.callName}(${({ PEER: "비겁", OUTPUT: "식상", OFFICER: "관성" })[g]}이 더 강함)`);
    }
  }
  return out.length ? out : ["두 사람의 속도가 비슷해, 장면마다 먼저 움직이는 쪽을 번갈아 둔다"];
}

/** 십성 뜻 한 문장(정의 문장 다음의 "~을 뜻합니다"). */
const meaningLine = (k: Knowledge, tg: string) => { const m = k.features.get(`tenGod:${tg}`)?.meaning ?? ""; const s = splitSentences(m); return s[1] ?? s[0] ?? ""; };

export function buildCompatibility(category: CompatibilityRelationshipType, a: PairSide, b: PairSide, k: Knowledge, lensFromNarrative: { roleLabels: [string, string]; tone: string; forbidden: string[] } | undefined): CompatibilityBrief {
  const roles = compatibilityRoleLabels(category);
  // 고객 본문에 "A·B" 기호가 나오지 않게(P3.5 A9 1회차): 기호 역할은 이름으로, 부모·상사 같은 역할은 "역할(이름)"으로.
  const label = (role: string, s: PairSide) => (/^[AB]$/.test(role) ? s.callName : `${role}(${s.callName})`);
  // 공통 기운은 "쉬운 말(이름)" 꼴로 준다(P3.6 B: 이름만 주면 작가가 "백호대살과 겁살" 같은 용어를 그대로 옮겼다).
  // 일간·일주는 두 사람 대표 그림이 따로 있어 공통점에는 그림을 새로 붙이지 않는다(P3.7 r2: 모래톱·마른 밭·베란다 텃밭이 한 책에).
  // 그림 별명은 쓰지 않는다(P6b B-2): 용어 이름만, 뜻은 작가가 traits.meaning으로 푼다.
  const featureName = (id: string) => { const f = k.features.get(id); if (!f) return id; const name = f.name.replace(/\(.*?\)/g, "").trim(); return /^(dayMaster|dayPillar):/.test(id) ? `태어난 날의 글자가 같음(${name})` : name; };
  const va = dimensionVector(a, k), vb = dimensionVector(b, k);
  const dims = k.ontology.dimensions.map(d => ({ d, x: va.get(d.id) ?? 0, y: vb.get(d.id) ?? 0 }))
    .filter(z => Math.sign(z.x) !== Math.sign(z.y) && Math.abs(z.x - z.y) > 0.3)
    // P6e 4: 그 사람 MBTI의 기능·태도에 맞지 않는 끝은 그 사람의 차이로 쓰지 않는다.
    .filter(z => poleFits(a.mbti?.type, z.d.id, z.x) && poleFits(b.mbti?.type, z.d.id, z.y))
    .sort((p, q) => Math.abs(q.x - q.y) - Math.abs(p.x - p.y) || p.d.id.localeCompare(q.d.id)).slice(0, 3);
  // 공통 기운이 두 사람 차이(같은 차원의 반대)와 부딪치면 뺀다(P3.7 r2: 공통점 역마살 ↔ 차이 '익숙한 것 유지').
  const clashesDiff = (id: string) => { const tags = k.features.get(id)?.dimensionTags ?? {}; return dims.some(z => Math.abs(tags[z.d.id] ?? 0) >= 0.5 && (Math.sign(tags[z.d.id]) !== Math.sign(z.x) || Math.sign(tags[z.d.id]) !== Math.sign(z.y))); };
  const common = [
    ...a.hitIds.filter(id => b.hitIds.includes(id) && !/:BALANCED$|^(stem|branch|tenGod):/.test(id) && !clashesDiff(id)).slice(0, 4).map(id => `둘 다 ${featureName(id)}`),
    ...a.st.lacking.filter(e => b.st.lacking.includes(e)).map(e => `둘 다 ${josa(ELEMENT_KO[e], "이가")} 부족`),
    ...(a.mbti && b.mbti ? [...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c).length ? [`MBTI 같은 글자: ${[...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c).join("")}`] : [] : []),
  ];
  // 축 이름·양끝 이름(내부 라벨)은 넘기지 않는다(P6b E-6): 그 쪽의 쉬운 설명 문장만.
  const pole = (d: (typeof dims)[number]["d"], x: number) => (x >= 0 ? d.poles.plus.description : d.poles.minus.description);
  const fills = (from: PairSide, to: PairSide, fromName: string, toName: string) => to.st.lacking
    .filter((e: FiveElement) => from.st.excess.includes(e) || (from.saju.elements.visible[e] ?? 0) >= 2)
    .map(e => `${fromName}의 ${ELEMENT_KO[e]} 기운이 ${toName}에게 부족한 ${josa(ELEMENT_KO[e], "을를")} 채워 줌`);
  const ab = getTenGod(a.saju.dayMaster, b.saju.dayMaster), ba = getTenGod(b.saju.dayMaster, a.saju.dayMaster);
  const rel = pairRelations(a, b, k);
  const conv = a.mbti && b.mbti ? a.mbti.conventionalCompat.find(c => c.type === b.mbti!.type) : undefined;
  const s = computeCompatScore(category, { saju: a.saju, name: a.callName, mbti: a.mbti?.type ?? null, gender: a.gender }, { saju: b.saju, name: b.callName, mbti: b.mbti?.type ?? null, gender: b.gender });
  const person = (s: PairSide, role: string) => ({
    role, callName: s.callName, mbti: s.mbti?.type ?? null, dayPillar: ganjiLabel(s.saju.pillars.day),
    image: s.chart.coreImage.line,
    traitIds: s.traits.map(t => t.id), excess: s.st.excess, lacking: s.st.lacking,
    // P6e 3: 신살·귀인은 사람별로(이 사람에게 있는 것만). 다른 사람 것을 이 사람 이름으로 쓰지 않는다.
    shinsal: [...new Set(s.hitIds.filter(id => /^(shinsal|gwiin):/.test(id)).map(id => (k.features.get(id)?.name ?? "").replace(/\(.*?\)/g, "").replace(/·.*$/, "").trim()).filter(Boolean))],
  });
  return {
    relationshipType: category,
    lens: { focus: LENS_FOCUS[category], roleLabels: [label(lensFromNarrative?.roleLabels[0] ?? roles.personA, a), label(lensFromNarrative?.roleLabels[1] ?? roles.personB, b)], tone: lensFromNarrative?.tone ?? "", forbidden: lensFromNarrative?.forbidden ?? [] },
    a: person(a, label(roles.personA, a)), b: person(b, label(roles.personB, b)),
    common: common.length ? common : ["눈에 띄는 공통 기운이 적어 서로 다른 점이 이야기의 중심"],
    differences: dims.map(z => ({ a: pole(z.d, z.x), b: pole(z.d, z.y) })),
    complement: [...fills(b, a, b.callName, a.callName), ...fills(a, b, a.callName, b.callName)],
    tenGodAB: { tenGod: tenGodLabel(ab), reading: meaningLine(k, ab) },
    pairImage: pairImage({ stem: a.saju.dayMaster, image: a.chart.coreImage }, { stem: b.saju.dayMaster, image: b.chart.coreImage }),
    // 두 방향이 같은 십성이면 같은 문장을 두 장에 주지 않는다(P3.7 r1: 3·4장이 같은 "나란히 걷는 같은 편").
    tenGodBA: { tenGod: tenGodLabel(ba), reading: ab === ba ? `서로를 같은 기운으로 본다. 앞 장과 겹치지 않게, 이 방향에서는 ${k.features.get(`tenGod:${ba}`)?.strengths[1] ?? k.features.get(`tenGod:${ba}`)?.strengths[0] ?? ""}` : meaningLine(k, ba) },
    dayRelations: rel, relationsPlain: rel, roles: sceneRoles(a, b),
    mbtiConvention: conv ? { fit: conv.fit, why: conv.why, note: "통념" } : null,
    // 점수 v2(P6c): 항목 점수·만점·이유. onScorePage = 점수 쪽에 이미 실린 문장(본문에서 되풀이하지 않고 더 깊게 푼다).
    score: {
      value: s.total, version: s.version, band: { label: s.band.label, tone: s.band.tone, verdict: s.band.verdict }, notice: s.notice,
      components: s.items.map(c => ({ name: c.name, points: c.points, max: c.max, level: c.level, onScorePage: c.reason })),
      direction: s.direction,
      rules: [
        `점수 ${s.total}점은 '${s.band.label}' 구간이다. 결론과 분위기를 이 구간에 맞춘다(다른 구간 이름·다른 점수를 쓰지 않는다)`,
        "components의 onScorePage는 점수 쪽에 이미 실린 문장이다. 그대로 옮기거나 같은 말로 되풀이하지 말고, 그 항목이 두 사람의 장면에서 어떻게 드러나는지 더 깊게 푼다. '조율' 항목마다 보완법을 하나씩 쓴다",
        "항목 점수(points/max)를 본문에 다시 적지 않는다(점수 쪽에 있다)",
        "점수가 낮아도 헤어짐·멀어짐을 권하지 않는다. 점수를 스스로 깎아내리는 말(근거가 없다, 재미로 보는)도 쓰지 않는다",
      ],
    },
  };
}
