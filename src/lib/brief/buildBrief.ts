/**
 * 브리프 빌더 진입점. 순수 함수: (입력, 지식 DB) → Brief. 같은 입력 = 같은 브리프(입력 해시 시드).
 * 6상품 공통, 궁합은 7관계 유형 공통. V4 문장은 쓰지 않는다(지식 DB v5만).
 */
import type { MbtiType } from "@/data/knowledge-v5/schema";
import type { CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { analyzeChartDetections } from "@/lib/saju/detections";
import { getTenGod } from "@/lib/saju/tenGods";
import { getTenGodGroupScores } from "@/lib/saju/extractTags";
import type { SajuCalcResult } from "@/lib/saju/types";
import { buildChartBrief, dayunOf, stateOf, type ElementState } from "./chart";
import { conditionalFamily, planChapters, PRODUCT_CHARS, type TraitSource } from "./chapters";
import { buildCompatibility, type PairSide } from "./compatibility";
import { careerEvidence, loveEvidence } from "./evidence";
import { ageAt, ageBand, forbiddenFacts, sceneFits, toFactProfile, type CustomerFacts, type FactProfile } from "./facts";
import { collectFeatureHits } from "./featureHits";
import type { Knowledge } from "./knowledge";
import { createRng, fnv1a, stableStringify, type Rng } from "./seed";
import { BRIEF_VERSION, BriefSchema, type Brief, type ChartBrief, type Material, type PersonBrief, type Trait } from "./schema";
import { sectionBudget, TOKEN_METHOD } from "./size";
import { buildYearEntries, buildMonthEntries, buildEntry, cycleSummary, type TimelineCtx } from "./timeline";
import { buildFortunes, buildShadows, buildTrait, buildUnused, enforceMbtiLinks, scoreHits, selectTraits, type ProductKey } from "./traits";
import { getAnnualPillar } from "@/lib/saju/detections";
import { sentenceViolation, splitSentences, type SafetyFacts } from "@/lib/writer/safety";
import { ganjiLabel, josa } from "./labels";
import { customerProps } from "./props";

export type BriefPersonInput = {
  readonly name: string;
  readonly gender: "MALE" | "FEMALE" | "";
  readonly birthDate: string;
  readonly birthTime: string;
  readonly birthTimeUnknown: boolean;
  readonly approximateBirthTimeSlot?: string;
  readonly mbtiType: MbtiType | "";
  readonly context?: { readonly relationshipStatus: string; readonly jobStatus: string; readonly detailJob: string; readonly children?: "has" | "none" | "unknown" };
};
export type BriefInput = {
  readonly product: ProductKey;
  readonly person: BriefPersonInput;
  readonly partner?: BriefPersonInput;
  readonly relationshipType?: CompatibilityRelationshipType;
  /** 기준 날짜(KST, YYYY-MM-DD). 올해·현재 대운·나이를 정한다. */
  readonly baseDate: string;
  /** 세운 상품의 선택 연도(없으면 기준 날짜의 사주 해). */
  readonly selectedYear?: number;
};

const STYLE_RULES = [
  "장점·좋은 기운은 직설 단정형: '당신에게는 ~가 있어서 ~합니다'. 돌려 말하지 않는다",
  "팩폭은 shadows 재료만, 근거(어떤 기운·자리 때문인지)를 함께 쓰고 warmTurn으로 따뜻하게 끝낸다",
  "초·중등도 아는 쉬운 단어, 짧은 문장. 진부하고 애매한 표현 금지",
  "장마다 비유 1개 이상(trait image) + 현실 장면 1개 이상(장 재료의 scene). 같은 비유를 두 장에서 다시 쓰지 않는다",
  "MBTI가 있으면 fusion.why로 '이 기운 때문에 당신의 유형이 이렇게 나온다'를 잇는다(소름 포인트). 없으면 MBTI 언급 금지",
  "장면은 재료 장면을 고객에 맞게 다시 쓰되 person.forbiddenFacts를 넘지 않는다. 브리프에 없는 사실·사건·날짜를 만들지 않는다",
  "존댓말이되 가볍게(~입니다/~예요 혼용). 소제목 3~5개, 문단 4~6문장. 한자는 처음 한 번만 괄호로",
  "내부 id·ref·family·score·자료 이름, 그리고 '팩폭'·'재료'·'브리프'·'명식' 같은 편집 용어는 본문·소제목에 쓰지 않는다",
  "같은 MBTI 연결(같은 기능·같은 글자)을 두 장에서 되풀이하지 않는다. 장마다 그 장 재료의 fusion만 쓴다",
];

type PersonPack = {
  readonly saju: SajuCalcResult; readonly facts: CustomerFacts; readonly profile: FactProfile; readonly person: PersonBrief;
  readonly chart: ChartBrief; readonly traits: Trait[]; readonly sources: TraitSource[]; readonly hitIds: string[];
  readonly scored: ReturnType<typeof scoreHits>; readonly selected: ReturnType<typeof selectTraits>;
  readonly det: ReturnType<typeof analyzeChartDetections>; readonly dayun: ReturnType<typeof dayunOf>; readonly st: ElementState;
};

function analyzePerson(input: BriefPersonInput, product: ProductKey, baseDate: string, k: Knowledge, rng: Rng, prefix: "" | "a" | "b", usedScenes: Set<string>, override?: Partial<FactProfile>, traitTarget?: number): PersonPack {
  const gender = input.gender === "MALE" || input.gender === "FEMALE" ? input.gender : null;
  const saju = calculateSaju({ birthDate: input.birthDate, birthTime: input.birthTime, birthTimeUnknown: input.birthTimeUnknown, approximateBirthTimeSlot: (input.approximateBirthTimeSlot ?? "") as never, calendarType: "SOLAR", gender: gender ?? "OTHER_OR_UNSPECIFIED", timezone: "Asia/Seoul" });
  const det = analyzeChartDetections(saju);
  const hits = collectFeatureHits(saju, det);
  const facts: CustomerFacts = {
    name: input.name, gender, birthDate: input.birthDate, birthTimeUnknown: input.birthTimeUnknown || !det.hourIncluded, mbti: input.mbtiType || null,
    relationshipStatus: input.context?.relationshipStatus ?? "", jobStatus: input.context?.jobStatus ?? "", detailJob: input.context?.detailJob ?? "", children: input.context?.children,
  };
  const profile = { ...toFactProfile(facts), ...override };
  const dayun = dayunOf({ ...input, gender, approximateBirthTimeSlot: input.approximateBirthTimeSlot });
  const chart = buildChartBrief(saju, det, k, { gender, baseDate, dayun });
  const fusionFacts = { mbti: facts.mbti, birthTimeKnown: !facts.birthTimeUnknown, genderKnown: gender !== null, contextKnown: Boolean(input.context?.jobStatus || input.context?.relationshipStatus) };
  const scored = scoreHits(hits, k, product, fusionFacts);
  const selected = selectTraits(scored, traitTarget);
  const groups = getTenGodGroupScores(saju.tenGods.distribution);
  const hitIdSet = new Set(hits.map(h => h.id));
  const traits = selected.map((s, i) => buildTrait(s, `${prefix}t${i + 1}`, rng.fork(`trait:${s.hit.id}`), saju.structureAnalysis.dayMasterStrength.level, groups, { saju, det, positions: s.hit.positions, hitIds: hitIdSet }));
  const sources: TraitSource[] = selected.map((s, i) => ({ trait: traits[i], feature: s.feature }));
  // MBTI 연결 밀도(P3): 핵심 특성 정확 유형, 같은 글자·기능 최대 2, 계산 연결로 70% 이상.
  // 특성 설명 중 고객 사실과 어긋나는 문장(미혼에게 "배우자와 ~", 시간 미상에 시주 등)은 작가에게 넘기지 않는다(P3, 안전망과 같은 규칙).
  const sf: SafetyFacts = { birthTimeKnown: !facts.birthTimeUnknown, mbti: facts.mbti, relationship: profile.relationship, children: profile.children, job: profile.job };
  const clean = (t: string | undefined) => t ? splitSentences(t).filter(x => !/^(fact_|hour_pillar|old_negative)/.test(sentenceViolation(x, sf) ?? "")).join(" ") || undefined : undefined;
  for (const t of traits) {
    const positionNote = clean(t.positionNote), strengthNote = clean(t.strengthNote), overuse = clean(t.overuse);
    if (positionNote) t.positionNote = positionNote; else delete t.positionNote;
    if (strengthNote) t.strengthNote = strengthNote; else delete t.strengthNote;
    if (overuse) t.overuse = overuse; else delete t.overuse;
    const good = t.good.map(clean).filter((x): x is string => Boolean(x));
    if (good.length) t.good = good;
  }
  const replacedScenes = enforceMbtiLinks(traits, selected.map(s => s.feature), facts.mbti ? k.mbti.get(facts.mbti) ?? null : null, k, fusionFacts);
  // Fusion 장면: 사실 조건에 맞고 아직 안 쓴 것만 trait에 붙인다.
  selected.forEach((s, i) => {
    const sc = replacedScenes.has(traits[i].id) ? replacedScenes.get(traits[i].id) : s.fusion?.source === "fusion" && s.fusion.target === traits[i].fusion?.target ? s.fusion.scene : undefined;
    // 결혼·자녀 언젠가형 장면은 연애 상품에서만(P3.5 A5, 종합 '사람' 장 배정은 장 단계에서 본다).
    if (sc && traits[i].fusion?.source === "fusion" && sceneFits(sc.requires, profile) && !usedScenes.has(sc.text) && (product === "love_marriage_child" || !conditionalFamily(sc))) { traits[i].fusion = { ...traits[i].fusion!, scene: sc.text }; usedScenes.add(sc.text); }
  });
  const age = ageAt(input.birthDate, baseDate);
  const person: PersonBrief = {
    name: input.name, callName: `${input.name}님`,
    nameUse: ["제목", "1장 첫 문단", "가운데 장 전환 문장", "마지막 장 마무리", "그 밖에는 '당신'"],
    gender, age, ageBand: ageBand(age),
    facts: { birthTimeKnown: !facts.birthTimeUnknown, mbti: facts.mbti, relationship: profile.relationship, children: profile.children, job: { class: profile.job, status: facts.jobStatus, detail: facts.detailJob } },
    forbiddenFacts: forbiddenFacts(facts, profile),
  };
  return { saju, facts, profile, person, chart, traits, sources, hitIds: hits.map(h => h.id), scored, selected, det, dayun, st: stateOf(det.elementBalance) };
}

function mbtiBrief(k: Knowledge, type: MbtiType | null) {
  const p = type ? k.mbti.get(type) : undefined;
  if (!p) return null;
  return {
    type: p.type, easyName: p.easyName, oneLiner: p.oneLiner, image: p.image,
    functions: p.cognitiveFunctions.map((c, i) => (i < 2 ? `${c.code}(${c.role}): ${c.easy}` : `${c.code}(${c.role})`)),
    shadows: [...p.shadows],
  };
}

export function buildBrief(input: BriefInput, k: Knowledge): Brief {
  const seed = fnv1a(stableStringify(input));
  const rng = createRng(seed);
  const usedScenes = new Set<string>();
  const narrative = k.narratives.get(input.product);
  if (!narrative) throw new Error(`product-narratives에 ${input.product} 없음`);
  const isPair = input.product === "saju_mbti_compatibility";
  if (isPair && (!input.partner || !input.relationshipType)) throw new Error("궁합 브리프는 partner·relationshipType이 필요하다");
  const pairRel = input.relationshipType === "love" ? "dating" : input.relationshipType === "marriage" ? "married" : undefined;
  const override = isPair ? { relationship: pairRel ?? "unknown", job: "none", children: "unknown" } as const : undefined;
  const me = analyzePerson(input.person, input.product, input.baseDate, k, rng.fork("A"), isPair ? "a" : "", usedScenes, override, isPair ? 6 : undefined);
  const other = isPair ? analyzePerson(input.partner!, input.product, input.baseDate, k, rng.fork("B"), "b", usedScenes, override, 6) : null;

  const fortunes = buildFortunes(me.scored, me.traits);
  const shadows = buildShadows(me.selected, me.traits);
  if (other) buildShadows(other.selected, other.traits).forEach((s, i) => shadows.push({ ...s, id: `s${shadows.length + i + 1}` }));
  const unused = buildUnused(me.saju, me.st.missing, k);
  const mbti = mbtiBrief(k, me.facts.mbti);
  const profile = me.profile;

  // 타임라인(대운 14년·세운 12개월)
  let timeline: Brief["timeline"];
  let timelineKeys: string[] = [];
  if (input.product === "major_fortune" || input.product === "annual_fortune") {
    const tctx: TimelineCtx = { saju: me.saju, k, st: me.st, facts: profile, rng: rng.fork("timeline"), usedScenes, usedTemplates: new Set() };
    const thisYear = me.chart.thisYear.year;
    const tenGodOf = (s: Parameters<typeof getTenGod>[1]) => getTenGod(me.saju.dayMaster, s);
    const tenGodNotes = tenGodNotesOf(k);
    if (input.product === "major_fortune") {
      const entries = buildYearEntries(tctx, thisYear, me.dayun.cycles);
      const transitions = entries.filter(e => e.dayun?.transition).map(e => e.key);
      timeline = { entries, tenGodNotes: tenGodNotes(entries, "year"), keyEntries: transitions.length ? transitions : [...entries].sort((a, b) => b.flow.score - a.flow.score || a.key.localeCompare(b.key)).slice(0, 2).map(e => e.key), cycles: cycleSummary(me.dayun.cycles, thisYear - 3, thisYear + 10, thisYear, tenGodOf) };
      timelineKeys = entries.map(e => e.key);
    } else {
      const year = input.selectedYear ?? thisYear;
      const yp = getAnnualPillar(year);
      const yearEntry = buildEntry(tctx, "year", String(year), `${year}년 ${ganjiLabel(yp)}`, yp, "annual", 0);
      const months = buildMonthEntries(tctx, year);
      timeline = { entries: [yearEntry, ...months], tenGodNotes: { ...tenGodNotes(months, "month"), ...tenGodNotes([yearEntry], "year") }, keyEntries: [...months].sort((a, b) => b.flow.score - a.flow.score || a.key.localeCompare(b.key)).slice(0, 3).map(e => e.key), cycles: cycleSummary(me.dayun.cycles, year, year, year, tenGodOf) };
      timelineKeys = months.map(e => e.key);
    }
  }

  // 궁합
  const compatibility = isPair && other ? buildCompatibility(input.relationshipType!, side(me, k), side(other, k), k, narrative.compatibility?.[input.relationshipType!]) : undefined;

  // 상품 근거
  const evidence: Record<string, Material> = input.product === "love_marriage_child" ? loveEvidence(me.saju, me.det, k, me.person.gender, me.st, mbti ? k.mbti.get(mbti.type)! : null)
    : input.product === "career_money_study" ? careerEvidence(me.saju, k, me.chart, mbti ? k.mbti.get(mbti.type)! : null, me.facts.detailJob, me.facts.jobStatus) : {};

  // 상품 근거 문장도 고객 사실과 어긋나는 문장은 뺀다(미혼에게 "배우자와는 ~" 등).
  const esf: SafetyFacts = { birthTimeKnown: me.person.facts.birthTimeKnown, mbti: me.facts.mbti, relationship: profile.relationship, children: profile.children, job: profile.job };
  for (const [key, m] of Object.entries(evidence)) if (m.kind === "evidence") {
    // 시주 규칙은 빼고 본다: 시간 미상이면 근거 쪽에 '자녀 자리는 보지 않습니다' 같은 유보 안내가 들어 있다.
    const facts = m.facts.map(t => splitSentences(t).filter(x => !/^(fact_|old_negative)/.test(sentenceViolation(x, esf) ?? "")).join(" ")).filter(Boolean);
    evidence[key] = { ...m, facts: facts.length ? facts : m.facts.slice(0, 1) };
  }
  const has = (ref: string): boolean => {
    if (ref === "mbti") return mbti !== null;
    if (ref === "chart.currentDayun") return me.chart.currentDayun !== null;
    if (ref === "fortunes") return fortunes.length > 0;
    if (ref === "unused") return unused.length > 0;
    if (ref.startsWith("timeline.")) return Boolean(timeline);
    if (ref === "compatibility.mbtiConvention") return Boolean(compatibility?.mbtiConvention);
    if (ref.startsWith("compatibility.")) return Boolean(compatibility);
    return true;
  };
  const traitsAll = [...me.traits, ...(other?.traits ?? [])];
  const chapters = planChapters({
    product: input.product, narrative, traits: [...me.sources, ...(other?.sources ?? [])], facts: profile, rng: rng.fork("chapters"), usedScenes,
    mbti: mbti ? k.mbti.get(mbti.type)! : null, has, evidence, shadows, timelineKeys,
    ...(isPair ? {} : { props: customerProps({ detailJob: me.facts.detailJob, jobStatus: me.facts.jobStatus, age: me.person.age }, profile) }),
    ...(isPair ? {
      sceneDomains: narrative.compatibility?.[input.relationshipType!]?.sceneDomains,
      prefer: (cid: string, t: Trait) => (cid === "direction-ab" ? (t.id.startsWith("b") ? 1 : 0) : cid === "direction-ba" ? (t.id.startsWith("a") ? 1 : 0) : 0),
    } : {}),
  });

  // 궁합 장 제목·질문의 "A·B" 기호(예 "A가 보는 B")는 두 사람 호칭으로 바꾼다(고객 본문에 기호가 나오지 않게, P3.5 A9).
  if (other) {
    const name: Record<string, string> = { A: me.person.callName, B: other.person.callName };
    const PAIR = { 가: "이가", 는: "은는", 와: "과와", 를: "을를" } as const;
    const sub = (s: string) => s.replace(/(?<![A-Za-z])([AB])(가|는|와|를|의)?(?![A-Za-z])/g, (_, x: string, p?: keyof typeof PAIR | "의") => !p ? name[x] : p === "의" ? `${name[x]}의` : josa(name[x], PAIR[p]));
    for (const c of chapters) { c.title = sub(c.title); c.question = sub(c.question); }
  }
  const chars = PRODUCT_CHARS[input.product];
  // 책 단위 소품 사용 기록(P3.6 A1): 안전망이 본문에서 같은 소품이 2회를 넘는지 센다.
  const usedProps: Record<string, number> = {};
  for (const c of chapters) for (const x of c.sceneHint ?? []) usedProps[x] = (usedProps[x] ?? 0) + 1;
  const draft = {
    version: BRIEF_VERSION, product: input.product, productTitle: narrative.title, seed: seed.toString(16), baseDate: input.baseDate,
    person: me.person, mbti, chart: me.chart, traits: traitsAll, fortunes, shadows, unused, chapters,
    ...(timeline ? { timeline } : {}),
    ...(other ? { partner: { person: other.person, mbti: mbtiBrief(k, other.facts.mbti), chart: other.chart } } : {}),
    ...(compatibility ? { compatibility } : {}),
    style: { version: "style-v5-1", register: "존댓말, 가볍게(~입니다/~예요 혼용)", readingLevel: "초·중등", totalChars: chars.total, rules: STYLE_RULES, forbidden: [...narrative.forbidden, ...narrative.noRepeatRules.slice(0, 2)] },
  };
  const budget = sectionBudget(draft);
  // usedProps는 안전망용이라 작가 토큰 추정·작가 입력에서 뺀다.
  return BriefSchema.parse({ ...draft, ...(Object.keys(usedProps).length ? { usedProps } : {}), budget: { ...budget, method: TOKEN_METHOD } });
}

/** 타임라인 항목이 가리키는 십성 뜻을 한 번만 싣는다(항목마다 반복하면 토큰이 두 배). */
function tenGodNotesOf(k: Knowledge) {
  return (entries: readonly { tenGod: { stem: string } }[], kind: "year" | "month") => Object.fromEntries(entries.map(e => {
    const tg = e.tenGod.stem.match(/\((.+)\)/)?.[1] ?? ""; const p = k.tenGodPeriod.get(tg);
    return [e.tenGod.stem, kind === "year" ? { meaning: p?.year.meaning ?? "", caution: p?.year.caution } : { meaning: p?.month.meaning ?? "" }];
  }));
}

function side(p: PersonPack, k: Knowledge): PairSide {
  return {
    saju: p.saju, chart: p.chart, st: p.st, traits: p.traits, hitIds: p.hitIds, mbti: p.facts.mbti ? k.mbti.get(p.facts.mbti) ?? null : null, callName: p.person.callName,
  };
}
