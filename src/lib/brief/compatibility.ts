/**
 * 궁합 브리프: 두 사람 요약, 공통점·차이(행동 차원), 오행 보완, A→B·B→A 십성, 일주끼리 관계, MBTI 통념 궁합, 관계 유형 관점, v5 궁합 점수(P4: 구성요소·구간·방향).
 * 두 사람 기둥끼리 관계는 원국 감지와 같은 detectRelations·detectStemClashes를 쓴다(compat/relations.pairRelations, 최종판3 7: 천간충 포함·삼형 한 줄·영향 큰 순).
 */
import { poleFits } from "./mbtiFn";
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import { baseReason, BASE_POINTS, BASE_ROW_NAME } from "@/lib/compat/display";
import { pairRelationCounts, pairRelations, type PairRelation } from "@/lib/compat/relations";
import { computeCompatScore } from "@/lib/compat/score";
import { compatibilityRoleLabels, type CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { STEM_ELEMENT } from "@/lib/saju/constants";
import type { ChartPosition } from "@/lib/saju/detections/types";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, HeavenlyStem, SajuCalcResult } from "@/lib/saju/types";
import type { ElementState } from "./chart";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, ganjiLabel, halfHapLine, josa, relationPlain, SAMHYEONG_PLAIN, tenGodLabel } from "./labels";
import type { ChartBrief, CompatibilityBrief, Trait } from "./schema";
import { pairImage } from "./coreImage";
import { applyProfile, profileCodes, profileLine, type PairProfile } from "./pairProfile";
import { groupValues } from "@/lib/saju/groupStrength";
import { splitSentences } from "@/lib/writer/safety/patterns";

const LENS_FOCUS: Record<CompatibilityRelationshipType, string> = {
  love: "감정·표현", marriage: "생활·역할·돈", parentChild: "기대·독립", coworker: "협업·경쟁", managerReport: "권한·속도", businessPartner: "지분·책임", friendship: "거리·빈도",
};

export type PairSide = {
  readonly saju: SajuCalcResult; readonly chart: ChartBrief; readonly st: ElementState; readonly traits: readonly Trait[]; readonly hitIds: readonly string[];
  readonly mbti: MbtiProfile | null; readonly callName: string; readonly gender: "MALE" | "FEMALE" | null;
};

/** 최종판2 1-3: 이 사람의 고정 성격표. */
export function sideProfile(side: PairSide, k: Knowledge): PairProfile {
  const codes = profileCodes(side.mbti?.type ?? null, dimensionVector(side, k), side.hitIds);
  return { name: side.callName, ...codes, line: profileLine(side.callName, codes, side.mbti?.type ?? null) };
}
/** 성격표를 반영한 행동 차원 벡터(차이 목록·장면 주인 who가 표와 같은 쪽을 가리키게). */
export const profiledVector = (side: PairSide, k: Knowledge) => applyProfile(dimensionVector(side, k), sideProfile(side, k));

export function dimensionVector(side: PairSide, k: Knowledge): Map<string, number> {
  const v = new Map<string, number>();
  const add = (tags: Readonly<Record<string, number>>, w: number) => { for (const [d, x] of Object.entries(tags)) v.set(d, (v.get(d) ?? 0) + x * w); };
  for (const t of side.traits) { const f = k.features.get(t.featureId); if (f) add(f.dimensionTags, t.score); }
  if (side.mbti) add(side.mbti.dimensionTags, 1.5 * Math.max(1, ...side.traits.map(t => t.score)));
  return v;
}

const PILLAR_KO = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as const;
const SHORT: Readonly<Record<string, string>> = { year: "해", month: "달", day: "날", hour: "시각" };
/** 자리 말: "소담님의 태어난 날 땅 글자", 여러 자리면 "소담님의 태어난 날·시각 땅 글자 모두". */
const whereOf = (s: PairSide, ps: readonly ChartPosition[], glyph: string) => ps.length === 1 ? `${s.callName}의 ${PILLAR_KO[ps[0]]} ${glyph}` : `${s.callName}의 태어난 ${ps.map(p => SHORT[p]).join("·")} ${glyph} 모두`;
/** 천간충 뜻(지식 DB 배지가 없어 엔진 글자의 오행으로): 하늘 글자는 겉으로 드러나는 생각·의견의 자리. */
const stemClashLine = (chars: readonly string[]) => { const [x, y] = chars.map(c => ELEMENT_KO[STEM_ELEMENT[c as HeavenlyStem]]); return `${x} 기운과 ${y} 기운이 하늘 글자에서 마주 서서, 겉으로 드러나는 생각과 의견이 부딪치기 쉬운 흐름`; };
/**
 * 관계 뜻 한 문장(최종판3 7: 모든 줄에 뜻 문장 — 형식 통일). 지식 DB 배지(같은 글자 묶음) → 관계 종류 기본 배지 순.
 * 반합은 "완성"이 아니라 반쯤 묶임(halfHapLine), 삼형은 세 글자가 다 모였을 때만 "세 땅", 두 글자면 두 글자 문장, 자형(같은 글자)은 배지 "自刑".
 */
function relationLine(r: PairRelation, k: Knowledge): string {
  if (r.kind === "STEM_CHUNG") return stemClashLine(r.chars);
  if (r.kind === "HYEONG" && r.subtype === "삼형" && r.completeness === "partial") return "삼형 세 글자 중 두 글자만 만나 서로를 깎고 다듬는 흐름";
  const key = r.subtype === "자형" ? "自刑" : r.key;
  const own = k.badges.find(z => z.kind === r.kind && z.pair !== undefined && (z.pair === key || [...z.pair].sort().join("") === key))?.line;
  const line = own ?? k.badges.find(z => z.kind === r.kind && z.pair === undefined)?.line.replace(/ 해$/, " 흐름") ?? "";
  if (r.kind === "SAMHAP" && r.completeness === "half") return halfHapLine(line);
  return r.subtype === "자형" ? line.replace("스스로를", "서로를") : line;
}
/**
 * 두 사람 사이의 관계 쉬운 문장(P3.7 1-5·P6b D, 최종판3 7): "정희님의 태어난 날 땅 글자와 지우님의 태어난 날 땅 글자가 충(마주 서서 부딪침) 관계예요. {뜻}이에요."
 * 목록은 엔진이 감지한 관계 전부(compat/relations.pairRelations: 천간충 포함, 삼형 한 줄), 영향 큰 순. 글자 표기 없이 자리와 관계 이름·뜻만(E-9).
 */
export function pairRelationLines(a: PairSide, b: PairSide, k: Knowledge): { rows: PairRelation[]; lines: string[] } {
  const rows = pairRelations(a.saju, b.saju);
  return { rows, lines: rows.map(r => { const glyph = r.sky ? "하늘 글자" : "땅 글자";
    return relationPlain(whereOf(a, r.a, glyph), whereOf(b, r.b, glyph), r.kind, r.completeness === "half", relationLine(r, k), r.kind === "HYEONG" && r.subtype === "삼형" && r.completeness === "full" ? SAMHYEONG_PLAIN : undefined); }) };
}
/** 첫 쪽 묶음 요약(최종판3 7): "합 6가지(천간합 3·육합 1·반합 2) · 형·충·파·해 6가지(…)"와 줄마다의 관계 이름. 영향 큰 3줄은 relationsPlain 앞 3줄. */
function relationSummary(rows: readonly PairRelation[]): NonNullable<CompatibilityBrief["relationsSummary"]> {
  if (!rows.length) return { line: "두 사람 글자 사이에 합이나 형·충·파·해로 엮인 관계가 따로 없어요.", names: [] };
  const c = pairRelationCounts(rows), part = (g: "hap" | "friction") => c.byName.filter(([n]) => rows.some(r => r.name === n && r.group === g)).map(([n, x]) => `${n} ${x}`).join("·");
  const hap = c.hap ? `합 ${c.hap}가지(${part("hap")})` : "합 0가지", fr = c.friction ? `형·충·파·해 ${c.friction}가지(${part("friction")})` : "형·충·파·해 0가지";
  return { line: `두 사람 사이에서 찾은 관계는 모두 ${rows.length}가지예요. ${hap} · ${fr}.`, names: rows.map(r => r.name) };
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
  const va = profiledVector(a, k), vb = profiledVector(b, k);
  const dims = k.ontology.dimensions.map(d => ({ d, x: va.get(d.id) ?? 0, y: vb.get(d.id) ?? 0 }))
    // 최종판2 1-3: 성격표가 어느 끝도 아니라고 정한 값(0)은 차이로 쓰지 않는다(0을 + 끝 문장으로 적었다).
    .filter(z => Math.sign(z.x) !== Math.sign(z.y) && Math.abs(z.x - z.y) > 0.3 && z.x !== 0 && z.y !== 0)
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
  const { rows: relRows, lines: rel } = pairRelationLines(a, b, k);
  const conv = a.mbti && b.mbti ? a.mbti.conventionalCompat.find(c => c.type === b.mbti!.type) : undefined;
  const s = computeCompatScore(category, { saju: a.saju, name: a.callName, mbti: a.mbti?.type ?? null, gender: a.gender }, { saju: b.saju, name: b.callName, mbti: b.mbti?.type ?? null, gender: b.gender });
  const person = (s: PairSide, role: string) => ({
    role, callName: s.callName, mbti: s.mbti?.type ?? null, dayPillar: ganjiLabel(s.saju.pillars.day),
    // 최종판2 1-1: 인물 줄은 엔진 그림 줄이 아니라 그림 없는 뜻 짧은 꼴(같은 일주 책마다 같은 그림이 나오지 않게).
    image: s.chart.coreImage.short ?? s.chart.coreImage.line,
    traitIds: s.traits.map(t => t.id), excess: s.st.excess, lacking: s.st.lacking,
    // P6e 3: 신살·귀인은 사람별로(이 사람에게 있는 것만). 다른 사람 것을 이 사람 이름으로 쓰지 않는다.
    shinsal: [...new Set(s.hitIds.filter(id => /^(shinsal|gwiin):/.test(id)).map(id => (k.features.get(id)?.name ?? "").replace(/\(.*?\)/g, "").replace(/·.*$/, "").trim()).filter(Boolean))],
  });
  return {
    relationshipType: category,
    lens: { focus: LENS_FOCUS[category], roleLabels: [label(lensFromNarrative?.roleLabels[0] ?? roles.personA, a), label(lensFromNarrative?.roleLabels[1] ?? roles.personB, b)], tone: lensFromNarrative?.tone ?? "", forbidden: lensFromNarrative?.forbidden ?? [] },
    a: person(a, label(roles.personA, a)), b: person(b, label(roles.personB, b)),
    common: common.length ? common : ["눈에 띄는 공통 기운이 적어 서로 다른 점이 이야기의 중심"],
    // 최종판3 2b: 두 사람이 모두 가진 특성 id 전부(자르지 않음). 작가 브리프에서 그 특성의 주인은 「두 사람 모두(공통)」이고 차이의 근거로 쓰지 않는다.
    commonIds: a.hitIds.filter(id => b.hitIds.includes(id) && !/^(stem|branch|tenGod|dayMaster|dayPillar|climate|yinYang):/.test(id)),
    commonNames: [...new Set(a.hitIds.filter(id => b.hitIds.includes(id) && !/^(stem|branch|tenGod|dayMaster|dayPillar|climate|yinYang):/.test(id)).map(id => featureName(id)).filter(Boolean))],
    differences: dims.map(z => ({ a: pole(z.d, z.x), b: pole(z.d, z.y) })),
    complement: [...fills(b, a, b.callName, a.callName), ...fills(a, b, a.callName, b.callName)],
    tenGodAB: { tenGod: tenGodLabel(ab), reading: meaningLine(k, ab) },
    pairImage: pairImage({ stem: a.saju.dayMaster, image: a.chart.coreImage }, { stem: b.saju.dayMaster, image: b.chart.coreImage }),
    // 두 방향이 같은 십성이면 같은 문장을 두 장에 주지 않는다(P3.7 r1: 3·4장이 같은 "나란히 걷는 같은 편").
    tenGodBA: { tenGod: tenGodLabel(ba), reading: ab === ba ? `서로를 같은 기운으로 본다. 앞 장과 겹치지 않게, 이 방향에서는 ${k.features.get(`tenGod:${ba}`)?.strengths[1] ?? k.features.get(`tenGod:${ba}`)?.strengths[0] ?? ""}` : meaningLine(k, ba) },
    dayRelations: rel, relationsPlain: rel, relationsSummary: relationSummary(relRows), roles: sceneRoles(a, b),
    profiles: [sideProfile(a, k), sideProfile(b, k)],
    mbtiConvention: conv ? { fit: conv.fit, why: conv.why, note: "통념" } : null,
    // 점수 v2(P6c): 항목 점수·만점·이유. onScorePage = 점수 쪽에 이미 실린 문장(본문에서 되풀이하지 않고 더 깊게 푼다).
    score: {
      value: s.total, version: s.version, band: { label: s.band.label, tone: s.band.tone, verdict: s.band.verdict }, notice: s.notice,
      // 최종판3 7: 맨 앞 기본점 줄(40/40)로 points 합 = value. 점수 쪽(Book)도 이 줄을 그대로 싣는다.
      components: [{ name: BASE_ROW_NAME, points: BASE_POINTS, max: BASE_POINTS, level: "기본" as const, onScorePage: baseReason(s.items.length, s.total - BASE_POINTS, s.total) },
        ...s.items.map(c => ({ name: c.name, points: c.points, max: c.max, level: c.level, onScorePage: c.reason }))],
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
