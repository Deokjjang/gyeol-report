/**
 * 브리프 빌더 진입점. 순수 함수: (입력, 지식 DB) → Brief. 같은 입력 = 같은 브리프(입력 해시 시드).
 * 6상품 공통, 궁합은 7관계 유형 공통. V4 문장은 쓰지 않는다(지식 DB v5만).
 */
import type { MbtiType } from "@/data/knowledge-v5/schema";
import type { CompatibilityRelationshipType } from "@/lib/report-generation/reportInputTypes";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { analyzeChartDetections } from "@/lib/saju/detections";
import { getTenGod } from "@/lib/saju/tenGods";
import { groupValues } from "@/lib/saju/groupStrength";
import type { SajuCalcResult } from "@/lib/saju/types";
import { buildChartBrief, dayunOf, stateOf, type ElementState } from "./chart";
import { conditionalFamily, planChapters, PRODUCT_CHARS, topDimension, type TraitSource } from "./chapters";
import { buildCompatibility, profiledVector, type PairSide } from "./compatibility";
import { careerEvidence, loveEvidence } from "./evidence";
import { ageAt, ageBand, forbiddenFacts, sceneCtxOf, sceneFits, toFactProfile, type CustomerFacts, type FactProfile } from "./facts";
import { collectFeatureHits } from "./featureHits";
import type { Knowledge } from "./knowledge";
import { createRng, fnv1a, stableStringify, type Rng } from "./seed";
import { BRIEF_VERSION, BriefSchema, type Brief, type ChartBrief, type Material, type PersonBrief, type Trait } from "./schema";
import { sectionBudget, TOKEN_METHOD } from "./size";
import { buildYearEntries, buildMonthEntries, buildEntry, cycleSummary, type TimelineCtx } from "./timeline";
import { buildFortunes, buildShadows, buildTrait, buildUnused, enforceMbtiLinks, GROUPS as TRAIT_GROUPS, scoreHits, selectTraits, type ProductKey } from "./traits";
import { getAnnualPillar } from "@/lib/saju/detections";
import { sentenceViolation, splitSentences, type SafetyFacts } from "@/lib/writer/safety";
import { dropSourceSentences } from "@/lib/writer/safety/patterns";
import { ganjiLabel, josa } from "./labels";
import { renderWriterBrief } from "@/lib/writer/prompt";
import { balanceHolds, keepBalanced, opposes, opposesLoose, oppositeToDrop, type BalanceCtx } from "./balance";
import { customerProps, lifeStage, matchJob } from "./props";
import { avoidImagesFor, coverMotifs, type LedgerView } from "./imageLedger";
import { cautionFor, cautionHolds, type CautionCtx } from "./caution";
import { annualDesign, familyDesign, keyMonthsLink, loveDesign, majorDesign } from "./productEvidence";
import { conditionsHold } from "./conditions";
import { CAREER_BUSINESS_NOSHOP_Q, CAREER_STATUS_Q, careerDesign, careerStatusOf } from "./design/career";
import { LOVE_STATUS_Q, LOVE_STATUS_TITLE, loveDesign2, loveStatusOf } from "./design/love";

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
const HAN_GLYPH: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
/** 명식 여덟 글자(한글, 시간 미상이면 시각 기둥 없이). */
export function ownGlyphs(saju: { pillars: Partial<Record<"year" | "month" | "day" | "hour", { stem: string; branch: string } | null>> }): Set<string> {
  return new Set(Object.values(saju.pillars).flatMap(p => (p ? [HAN_GLYPH[p.stem], HAN_GLYPH[p.branch]] : [])).filter(Boolean));
}
const GLYPH_LIST = /([갑을병정무기경신임계자축인묘진사오미유술해](?:·[갑을병정무기경신임계자축인묘진사오미유술해]){1,7})(?= ?(글자|자리))/g;
function onlyOwnGlyphs<T extends object>(t: T, own: ReadonlySet<string>): T {
  const fix = (x: unknown): unknown => typeof x === "string" ? x.replace(GLYPH_LIST, m => { const kept = [...new Set(m.split("·").filter(g => own.has(g)))]; return kept.length ? kept.join("·") : m; })
    : Array.isArray(x) ? x.map(fix) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k2, v]) => [k2, fix(v)])) : x;
  return fix(t) as T;
}

export type BriefInput = {
  readonly product: ProductKey;
  readonly person: BriefPersonInput;
  readonly partner?: BriefPersonInput;
  readonly relationshipType?: CompatibilityRelationshipType;
  /** 기준 날짜(KST, YYYY-MM-DD). 올해·현재 대운·나이를 정한다. */
  readonly baseDate: string;
  /** 세운 상품의 선택 연도(없으면 기준 날짜의 사주 해). */
  readonly selectedYear?: number;
  /** 같은 고객의 이전 Book이 쓴 지식 DB 장면(P6b E-1): 이번 책에서는 고르지 않는다. */
  readonly excludeScenes?: readonly string[];
  /** 같은 고객의 이전 Book이 뜻을 푼 특성(P6c A3): 이번 책에서는 처음 나와도 뜻을 다시 풀지 않는다(angle=known). */
  readonly knownTraits?: readonly string[];
  /** 같은 고객의 앞 책이 쓴 근거 줄·각도·씨앗(P6d F 고객 원장): 이번 책은 쓰지 않은 것을 먼저 고른다. */
  readonly priorEvidence?: readonly string[];
  readonly excludeAngles?: readonly string[];
  readonly excludeSeeds?: readonly string[];
  /** 최종판2 1-1: 같은 고객 다른 상품 책의 이미지 줄(표지·핵심 이미지·종합 1장 첫 소제목) — 피할 이미지에 더한다. */
  readonly priorImages?: readonly string[];
  /** 최종판3 2i: 고객 원장 — 같은 사주 주인의 이전 책 처방 문장·표지 줄(시험 책 제외). 처방 계열·표지 모티프 계열을 피한다. */
  readonly priorActions?: readonly string[];
  readonly priorCovers?: readonly string[];
  /** 최종판2 1-1: 이미지 대장에서 뺄 책(저장본 검사·replay: 그 책 자신과 그 뒤에 만든 책). */
  readonly ledgerView?: LedgerView;
};

const STYLE_RULES = [
  "장점·좋은 기운은 직설 단정형: '당신에게는 ~가 있어서 ~합니다'. 돌려 말하지 않는다",
  "팩폭은 shadows 재료만, 근거(어떤 기운·자리 때문인지)를 함께 쓰고 warmTurn으로 따뜻하게 끝낸다",
  "초·중등도 아는 쉬운 단어, 짧은 문장. 진부하고 애매한 표현 금지",
  "핵심 이미지(chart.coreImage) 외 비유는 장당 최대 1개. 용어는 첫 등장에 '이름(한자)은 명리학에서 ~를 뜻해요. 그래서 당신에게는 ~', 이후 이름만",
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
  readonly det: ReturnType<typeof analyzeChartDetections>; readonly dayun: ReturnType<typeof dayunOf>; readonly st: ElementState; readonly bc: BalanceCtx;
  /** 이 재료(feature id·차원)가 고른 trait와 같은 차원에서 반대인가(P3.8 1). */
  readonly clashes: (id: string, tags: Readonly<Record<string, number>> | undefined) => boolean;
};

/** 고객 원장(P6d F): 앞 책이 쓴 특성(feature id)·각도(feature:facet). 이번 책은 쓰지 않은 특성을 먼저, 쓴 각도(Fusion 연결·팩폭)는 다시 주지 않는다. */
export type PriorLedger = { readonly features: ReadonlySet<string>; readonly angles: ReadonlySet<string> };
function analyzePerson(input: BriefPersonInput, product: ProductKey, baseDate: string, k: Knowledge, rng: Rng, prefix: "" | "a" | "b", usedScenes: Set<string>, override?: Partial<FactProfile>, traitTarget?: number, fnUsed?: Map<string, number>, prior?: PriorLedger): PersonPack {
  const gender = input.gender === "MALE" || input.gender === "FEMALE" ? input.gender : null;
  const saju = calculateSaju({ birthDate: input.birthDate, birthTime: input.birthTime, birthTimeUnknown: input.birthTimeUnknown, approximateBirthTimeSlot: (input.approximateBirthTimeSlot ?? "") as never, calendarType: "SOLAR", gender: gender ?? "OTHER_OR_UNSPECIFIED", timezone: "Asia/Seoul" });
  const det = analyzeChartDetections(saju);
  const hits = collectFeatureHits(saju, det);
  const facts: CustomerFacts = {
    name: input.name, gender, birthDate: input.birthDate, birthTimeUnknown: input.birthTimeUnknown || !det.hourIncluded, mbti: input.mbtiType || null,
    relationshipStatus: input.context?.relationshipStatus ?? "", jobStatus: input.context?.jobStatus ?? "", detailJob: input.context?.detailJob ?? "", children: input.context?.children,
  };
  const base = { ...toFactProfile(facts), ...override };
  // 장면 글 검사용 생활 맥락(P6b B-6). 궁합은 관계 유형이 정한 사실만(직업 입력은 쓰지 않는다).
  const sceneCtx = sceneCtxOf({ jobGroupId: override ? null : matchJob(facts.detailJob)?.id ?? null, job: base.job, age: ageAt(input.birthDate, baseDate), familyOk: false, freelancer: !override && facts.jobStatus === "freelancer" });
  // 최종판2 1-2: 종합은 P6d(d9985cda) 장면 고르기 — 직업 꼬리표(코드·팀·가게·돌봄·외주)로 거르지 않는다(직업과 무관한 보편 성향 장면, 직업은 작가에게 맡김).
  const profile: FactProfile = { ...base, scene: product === "saju_mbti_full" ? { office: sceneCtx.office, school: sceneCtx.school, familyOk: sceneCtx.familyOk } : sceneCtx };
  const dayun = dayunOf({ ...input, gender, approximateBirthTimeSlot: input.approximateBirthTimeSlot });
  const chart = buildChartBrief(saju, det, k, { gender, baseDate, dayun, birthYear: Number(input.birthDate.slice(0, 4)) });
  const fusionFacts = { mbti: facts.mbti, birthTimeKnown: !facts.birthTimeUnknown, genderKnown: gender !== null, contextKnown: Boolean(input.context?.jobStatus || input.context?.relationshipStatus) };
  // 강약·균형 단정은 엔진 단일 판단과 맞는 문장만(P3.7 1-2).
  const st0 = stateOf(det.elementBalance);
  const level = saju.structureAnalysis.dayMasterStrength.level;
  const bc: BalanceCtx = { strength: level === "VERY_WEAK" || level === "WEAK" ? "WEAK" : level === "STRONG" || level === "VERY_STRONG" ? "STRONG" : "BALANCED", excess: st0.excess, lacking: st0.lacking };
  // 한 줄 설명이나 그림이 모두 이 원국과 어긋나는 요소는 고르지 않는다(P3.7 r2: '물이 모자란 여름 흙'인데 물이 가장 많은 원국).
  // 성별이 다른 사람 그림(여성 고객에게 "기다리는 아버지")도 고르지 않는다(P3.8 r1).
  const OTHER_GENDER = gender === "FEMALE" ? /아버지|아빠|남편|아들|할아버지|오빠|형(?![가-힣])/ : gender === "MALE" ? /어머니|엄마|아내|딸(?![기])|할머니|언니|누나/ : null;
  const imageOk = (im: { metaphor: string; visual: string }) => balanceHolds(im.metaphor, bc) && balanceHolds(im.visual, bc) && !(OTHER_GENDER?.test(im.metaphor) || OTHER_GENDER?.test(im.visual));
  const balanceImage = (im: { metaphor: string; visual: string }) => balanceHolds(im.metaphor, bc) && balanceHolds(im.visual, bc);
  // 앞 책이 쓴 특성은 점수를 낮춰 쓰지 않은 특성을 먼저 고른다(P6d G: 심화 상품 근거의 60% 이상은 종합에서 쓰지 않은 것). 일간·일주는 책의 뿌리라 그대로.
  const scored0 = scoreHits(hits, k, product, fusionFacts).filter(x => balanceHolds(x.feature.oneLiner, bc) && [x.feature.image, ...(x.feature.imageVariants ?? [])].some(balanceImage));
  // 최종판3 2d: 대표 신살(신살·귀인 중 강하고 두 자리 이상, 점수 최고 — 장덕민 현침살 甲·辛·卯·申)은 종합에서 앞 책 원장 감점을 받지 않고 반드시 고른다.
  // 실제 결함(최종판2): 앞 책 2권이 현침살을 썼다는 원장(feature:shinsal:HYEONCHIMSAL) 때문에 ×0.45 감점으로 종합 12특성에서 빠졌다.
  const repId = product === "saju_mbti_full" ? [...scored0].filter(x => (x.hit.family === "shinsal" || x.hit.family === "gwiin") && x.hit.strength === "strong" && x.hit.positions.length >= 2).sort((a, b) => b.score - a.score || a.hit.id.localeCompare(b.hit.id))[0]?.hit.id : undefined;
  const scored = scored0
    .map(x => prior?.features.has(x.hit.id) && x.hit.family !== "dayMaster" && x.hit.family !== "dayPillar" && x.hit.id !== repId ? { ...x, score: x.score * 0.45 } : x).sort((a, b) => b.score - a.score || a.hit.id.localeCompare(b.hit.id));
  // 같은 핵심 차원을 반대로 당기는 trait 둘은 긴장(MBTI와 반대로 당기는 Fusion) 표시가 없으면 점수 낮은 쪽을 빼고 다시 고른다(P3.7 1-2).
  const dropped = new Set<string>();
  let selected = selectTraits(scored, traitTarget);
  for (let guard = 0; guard < 6; guard++) {
    const lose = oppositeToDrop(selected.map(s => ({ id: s.hit.id, score: s.score, tags: s.feature.dimensionTags, tension: s.fusion?.kind === "tension", keep: s.hit.family === "dayMaster" || s.hit.family === "dayPillar" || s.hit.id === repId })));
    if (!lose) break;
    dropped.add(lose.id); selected = selectTraits(scored.filter(x => !dropped.has(x.hit.id)), traitTarget);
  }
  // 대표 신살이 자리 수 상한 등으로 빠졌으면 일간·일주가 아닌 가장 낮은 특성과 바꾼다.
  if (repId && !selected.some(s => s.hit.id === repId)) {
    // 신살·귀인 묶음 상한(GROUPS)을 넘기지 않게, 묶음이 차 있으면 그 묶음의 가장 낮은 것과 바꾼다.
    const rep = scored.find(x => x.hit.id === repId)!, same = selected.filter(s => s.group === rep.group), cap = TRAIT_GROUPS.find(g => g.key === rep.group)?.max ?? Infinity;
    const lowest = (same.length >= cap ? [...same] : [...selected]).reverse().find(s => s.hit.family !== "dayMaster" && s.hit.family !== "dayPillar");
    if (lowest) selected = [...selected.filter(s => s !== lowest), rep].sort((a, b) => b.score - a.score || a.hit.id.localeCompare(b.hit.id));
  }
  const groups = groupValues(saju);
  const hitIdSet = new Set(hits.map(h => h.id));
  // 최종판2 1-4: 신살·오행 설명이 나열한 글자("갑·신·묘·오 글자 셋 이상 겹침")는 이 사람 명식에 있는 글자만 남긴다(DB 규칙 문구가 그대로 재료로 갔다).
  const own = ownGlyphs(saju);
  const traits = selected.map((s, i) => onlyOwnGlyphs(buildTrait(s, `${prefix}t${i + 1}`, rng.fork(`trait:${s.hit.id}`), saju.structureAnalysis.dayMasterStrength.level, groups, { saju, det, positions: s.hit.positions, hitIds: hitIdSet }, imageOk), own));
  const sources: TraitSource[] = selected.map((s, i) => ({ trait: traits[i], feature: s.feature }));
  // MBTI 연결 밀도(P3): 핵심 특성 정확 유형, 같은 글자·기능 최대 2, 계산 연결로 70% 이상.
  // 특성 설명 중 고객 사실과 어긋나는 문장(미혼에게 "배우자와 ~", 시간 미상에 시주 등)은 작가에게 넘기지 않는다(P3, 안전망과 같은 규칙).
  const sf: SafetyFacts = { birthTimeKnown: !facts.birthTimeUnknown, mbti: facts.mbti, relationship: profile.relationship, children: profile.children, job: profile.job };
  // 조건 문장("월지 본기가 겁재면", "갑목과 경금이 함께 있으면")은 이 원국에서 성립할 때만 남긴다(P3.8 r1: 조건을 판정하지 않아 작가가 단정).
  const clean = (t: string | undefined, positions: readonly ("year" | "month" | "day" | "hour")[] = []) => t ? splitSentences(t).filter(x => !/^(fact_|hour_pillar|old_negative|source_mention|family_member|rural_prop|internal_label)/.test(sentenceViolation(x, sf) ?? "") && balanceHolds(x, bc) && conditionsHold(x, { saju, det, positions, hitIds: hitIdSet })).join(" ") || undefined : undefined;
  for (const t of traits) {
    const positionNote = clean(t.positionNote, t.positions), strengthNote = clean(t.strengthNote, t.positions), overuse = clean(t.overuse, t.positions);
    if (positionNote) t.positionNote = positionNote; else delete t.positionNote;
    if (strengthNote) t.strengthNote = strengthNote; else delete t.strengthNote;
    if (overuse) t.overuse = overuse; else delete t.overuse;
    const good = t.good.map(g => clean(g, t.positions)).filter((x): x is string => Boolean(x));
    if (good.length) t.good = good;
    // 뜻·나에게(P6b)도 같은 규칙: 조건이 원국과 어긋나거나 시간 미상인데 시주를 말하는 문장은 뺀다(다 빠지면 원문).
    t.forYou = clean(t.forYou, t.positions) ?? clean(k.features.get(t.featureId)?.forYou.base, t.positions) ?? t.forYou;
    t.meaning = splitSentences(t.meaning).filter(x => sentenceViolation(x, sf) !== "hour_pillar").join(" ") || t.meaning;
  }
  const replacedScenes = enforceMbtiLinks(traits, selected.map(s => s.feature), facts.mbti ? k.mbti.get(facts.mbti) ?? null : null, k, fusionFacts, fnUsed);
  for (const t of traits) if (t.fusion) { const why = clean(keepBalanced(t.fusion.why, bc, splitSentences), t.positions); if (why) t.fusion.why = why; else delete t.fusion; }
  // 앞 책이 쓴 Fusion 각도(같은 특성 × 같은 MBTI 연결)는 이번 책에 다시 주지 않는다(P6d F: 하람 "식신은 따라간다"·"서운함이 터진다"가 세 권에 반복).
  // 대표 신살의 명리×MBTI 연결은 종합에 꼭 한 번 있어야 하므로 앞 책이 썼어도 지우지 않는다(최종판3 2d).
  for (const t of traits) if (t.fusion && t.featureId !== repId && prior?.angles.has(`${t.featureId}:fusion:${t.fusion.target}`)) delete t.fusion;
  chart.climate.reading = keepBalanced(chart.climate.reading, bc, splitSentences) ?? "";
  // 오행 읽기 문장도 trait와 같은 차원에서 반대면 뺀다(P3.7 r2: 오행 읽기 "거절하는 힘이 얇다·오래 잰다" ↔ trait "바로 정함").
  const readingIds = [
    ...(chart.elements.strongest.level === "많음" ? [`element:${chart.elements.strongest.element}:STRONG`] : []),
    ...(/^(부족|없음)/.test(chart.elements.weakest.level) ? [`element:${chart.elements.weakest.element}:${chart.elements.weakest.level.startsWith("없음") ? "MISSING" : "WEAK"}`] : []),
  ].filter(id => k.features.get(id)?.oneLiner);
  const traitTags = selected.filter(x => x.fusion?.kind !== "tension").map(x => ({ id: x.hit.id, tags: x.feature.dimensionTags }));
  const clashes = (id: string, tags: Readonly<Record<string, number>> | undefined) => Boolean(tags) && traitTags.some(t => t.id !== id && opposes(tags!, t.tags));
  const readingClash = (id: string) => { const tags = k.features.get(id)?.dimensionTags ?? {}; return traitTags.some(t => t.id !== id && opposesLoose(tags, t.tags)); };
  chart.elements.reading = chart.elements.reading.filter((_, i) => !readingIds[i] || !readingClash(readingIds[i]));
  // Fusion 장면: 사실 조건에 맞고 아직 안 쓴 것만 trait에 붙인다.
  selected.forEach((s, i) => {
    const sc = replacedScenes.has(traits[i].id) ? replacedScenes.get(traits[i].id) : s.fusion?.source === "fusion" && s.fusion.target === traits[i].fusion?.target ? s.fusion.scene : undefined;
    // 결혼·자녀 언젠가형 장면은 연애 상품에서만(P3.5 A5, 종합 '사람' 장 배정은 장 단계에서 본다).
    if (sc && traits[i].fusion?.source === "fusion" && sceneFits(sc.requires, profile, sc.text) && !usedScenes.has(sc.text) && (product === "love_marriage_child" || !conditionalFamily(sc))) { traits[i].fusion = { ...traits[i].fusion!, scene: sc.text }; usedScenes.add(sc.text); }
  });
  const age = ageAt(input.birthDate, baseDate);
  const person: PersonBrief = {
    name: input.name, callName: `${input.name}님`,
    nameUse: ["제목", "1장 첫 문단", "가운데 장 전환 문장", "마지막 장 마무리", "그 밖에는 '당신'"],
    gender, age, ageBand: ageBand(age),
    // 궁합은 관계 유형이 정한 사실만 쓴다: 입력에 직업이 있어도 넘기지 않는다(P3.7 r1: "대학생"과 "학생 전제 금지"가 함께 나갔다).
    facts: { birthTimeKnown: !facts.birthTimeUnknown, mbti: facts.mbti, relationship: profile.relationship, children: profile.children, job: { class: profile.job, status: override ? "" : facts.jobStatus, detail: override ? "" : facts.detailJob } },
    forbiddenFacts: forbiddenFacts(facts, profile),
    ...(override ? {} : (() => { const stage = lifeStage({ jobStatus: facts.jobStatus, age }, profile), job = matchJob(facts.detailJob);
      return { lifeStage: LIFE_STAGE_KO(stage, age), ...(job?.stages ? { workScenes: job.stages } : {}) }; })()),
  };
  return { saju, facts, profile, person, chart, traits, sources, hitIds: hits.map(h => h.id), scored, selected, det, dayun, st: st0, bc, clashes };
}

/** 생활 단계 이름(P6c C1): 작가가 장면을 이 고객의 삶에 맞추게 한다. */
const LIFE_STAGE_KO = (stage: string, age: number) => ({
  student: age < 19 ? "초·중·고 학생" : "대학생 이상 학생(초·중·고 장면 금지: 모의고사·학원·급식·담임 등)",
  job_seeker: "구직 중(학교 장면 금지)", early_career: "사회 초년 직장인(학교 장면 금지)", mid_career: "직장인(학교 장면 금지)",
  self_employed: "사업·자영업·프리랜서(학교 장면 금지)", homemaker: "살림(학교 장면 금지)", parenting: "아이를 키우는 중", retired: "은퇴 뒤 생활", unknown: "생활 단계 모름(학교 장면 금지)",
} as Record<string, string>)[stage] ?? "생활 단계 모름";

const FAMILY_KO: Record<string, string> = { stem: "천간", branch: "지지", dayMaster: "일간", dayPillar: "일주", element: "오행", yinYang: "음양", climate: "계절", tenGod: "십성", tenGodBalance: "십성", twelveStage: "십이운성", relation: "합·충", shinsal: "신살", gwiin: "귀인", structure: "짜임" };
const FAMILY_ORDER = Object.keys(FAMILY_KO);
/** meaning에서 뜻을 말하는 문장("~을 뜻합니다·맡습니다")을 고르고, 정의·자리 설명·많고 적음 문장은 피한다. */
const MEANS = /뜻[합하]|맡[습으아고]/, DEFINES = /부릅니다|라는 뜻입니다|때 봅니다|째 (천간|지지)|물상으로|많으면|없으면|이상이면|앉은 날입니다|상태입니다|상태를 말합니다|태어난 것이고|나뉘는데/;
export const meaningLine = (meaning: string) => { const s = splitSentences(meaning); return s.find(x => MEANS.test(x) && !DEFINES.test(x)) ?? s.find(x => !DEFINES.test(x)) ?? s[1] ?? s[0] ?? ""; };
/** 부록 한 사람분: 감지된 기운(지식 DB에 있는 것)과 뜻 한 줄. core: 본문 trait로 쓴 기운. */
function appendixOf(p: PersonPack, k: Knowledge) {
  const core = new Set(p.traits.map(t => t.featureId));
  const items = [...new Set(p.hitIds)].flatMap(id => { const f = k.features.get(id); if (!f) return [];
    return [{ family: f.family, group: FAMILY_KO[f.family] ?? "명리 기운", name: f.name, meaning: meaningLine(f.meaning), core: core.has(id) }]; });
  items.sort((a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family) || a.name.localeCompare(b.name));
  return { name: p.person.name, items: items.map(x => ({ group: x.group, name: x.name, meaning: x.meaning, core: x.core })) };
}

/** 용어 뜻(P6c-ui2 g): 화면에서 장마다 첫 등장을 표시하고 누르면 뜻 한 줄을 띄운다. 이름은 괄호 앞 한글, 같은 이름은 앞의 것.
 * 십이운성 한 글자 이름(쇠·병·사·묘·절·태·양)은 보통 낱말과 겹쳐 뺀다. */
const GLOSSARY_FAMILIES = ["tenGod", "shinsal", "gwiin", "twelveStage"] as const;
function glossaryOf(k: Knowledge) {
  const out = new Map<string, { group: string; name: string; meaning: string }>();
  for (const family of GLOSSARY_FAMILIES) for (const f of [...k.features.values()].filter(f => f.family === family).sort((a, b) => a.id.localeCompare(b.id))) {
    const name = f.name.split("(")[0].trim();
    if (name.length < 2 || out.has(name)) continue;
    out.set(name, { group: FAMILY_KO[family], name, meaning: meaningLine(f.meaning) });
  }
  return [...out.values()];
}

function mbtiBrief(k: Knowledge, type: MbtiType | null) {
  const p = type ? k.mbti.get(type) : undefined;
  if (!p) return null;
  return {
    type: p.type, easyName: p.easyName, oneLiner: p.oneLiner, image: p.image,
    functions: p.cognitiveFunctions.map((c, i) => (i < 2 ? `${c.code}(${c.role}): ${c.easy}` : `${c.code}(${c.role})`)),
    // 그늘 문장은 하나만: 여러 개면 trait 팩폭·과사용과 같은 뜻이 겹쳐 반복된다(P3.7 r1).
    shadows: p.shadows.slice(0, 1),
  };
}

export function buildBrief(input: BriefInput, k: Knowledge): Brief {
  // 시드는 이전 책 목록과 무관하게(같은 입력 = 같은 시드).
  const { excludeScenes: _exclude, knownTraits: _known, priorEvidence: _pe, excludeAngles: _ea, excludeSeeds: _es, priorImages: _pi, ledgerView: _lv, priorActions: _pa, priorCovers: _pc, ...seedInput } = input; void _pa; void _pc; void _exclude; void _known; void _pe; void _ea; void _es; void _pi; void _lv;
  const seed = fnv1a(stableStringify(seedInput));
  const rng = createRng(seed);
  const usedScenes = new Set<string>(input.excludeScenes ?? []);
  const narrative = k.narratives.get(input.product);
  if (!narrative) throw new Error(`product-narratives에 ${input.product} 없음`);
  const isPair = input.product === "saju_mbti_compatibility";
  if (isPair && (!input.partner || !input.relationshipType)) throw new Error("궁합 브리프는 partner·relationshipType이 필요하다");
  const pairRel = input.relationshipType === "love" ? "dating" : input.relationshipType === "marriage" ? "married" : undefined;
  // 궁합 입력에는 직업·관계 칸이 없다. 관계 유형이 말해 주는 사실만 쓴다(P3.6 B: 상사·팀원 책에 "상사·팀장을 전제하지 않는다"가 나갔다).
  const pairJob = input.relationshipType === "managerReport" || input.relationshipType === "coworker" ? "employed" : input.relationshipType === "businessPartner" ? "business" : "none";
  const override = isPair ? { relationship: pairRel ?? "unknown", job: pairJob, children: "unknown" } as const : undefined;
  const overrideA = override && input.relationshipType === "parentChild" ? { ...override, children: "has" as const } : override;
  const fnUsed = new Map<string, number>();
  // 종합은 52절이라 trait 12개(소개 1 + 적용 2 × 12)까지: trait를 늘려 같은 trait 재사용 대신 새 정보로 채운다(P3.8 1).
  const priorLedger: PriorLedger = { features: new Set((input.priorEvidence ?? []).filter(x => x.startsWith("feature:")).map(x => x.slice(8))), angles: new Set(input.excludeAngles ?? []) };
  const me = analyzePerson(input.person, input.product, input.baseDate, k, rng.fork("A"), isPair ? "a" : "", usedScenes, overrideA, isPair ? 6 : input.product === "saju_mbti_full" ? 12 : undefined, fnUsed, priorLedger);
  const otherRaw = isPair ? analyzePerson(input.partner!, input.product, input.baseDate, k, rng.fork("B"), "b", usedScenes, override, 6, fnUsed) : null;

  // 두 사람이 같은 요소를 가지면 같은 그림이 두 번 나온다: 뒤 사람은 다른 그림 변형으로(P3.8, 부모·자녀 둘 다 '교문 앞 우산').
  const other = otherRaw;
  // 두 사람에게 같은 오행 읽기 문장이 가면 한 사람 것만 둔다(P3.8 r1: "첫발 시동이 늦게"가 두 사람 모두에게).
  if (other) other.chart.elements.reading = other.chart.elements.reading.filter(x => !me.chart.elements.reading.includes(x));
  if (other) for (const t of other.traits) {
    if (!me.traits.some(x => x.image.metaphor === t.image.metaphor)) continue;
    const f = k.features.get(t.featureId);
    const alt = [f?.image, ...(f?.imageVariants ?? [])].find(im => im && !me.traits.some(x => x.image.metaphor === im.metaphor) && balanceHolds(im.metaphor, other.bc));
    if (alt) t.image = alt;
  }
  const profile0 = me.profile;
  const fortunes = buildFortunes(me.scored, me.traits);
  const hourFree = (t: string) => splitSentences(t).filter(x => sentenceViolation(x, { birthTimeKnown: me.person.facts.birthTimeKnown, mbti: me.facts.mbti, relationship: profile0.relationship, children: profile0.children, job: profile0.job }) !== "hour_pillar").join(" ") || t;
  for (const f of fortunes) { f.meaning = hourFree(f.meaning); f.forYou = hourFree(f.forYou); }
  // 종합은 팩폭 장(절 3개)과 긴장 장이 팩폭 재료를 쓰므로 3개 이상(P3.8).
  // 앞 책이 팩폭으로 쓴 특성(feature:shadow)은 이번 책 팩폭에서 뺀다(P6d F).
  const shadows = buildShadows(me.selected, me.traits, input.product === "saju_mbti_full" ? 3 : 2).filter(s => { const t = me.traits.find(x => x.id === s.traitId); return !t || !priorLedger.angles.has(`${t.featureId}:shadow`); }).map((s, i) => ({ ...s, id: `s${i + 1}` }));
  if (other) buildShadows(other.selected, other.traits).forEach((s, i) => shadows.push({ ...s, id: `s${shadows.length + i + 1}` }));
  const unused = buildUnused(me.saju, me.st.missing, k).map(u => ({ ...u, meaning: hourFree(u.meaning), forYou: hourFree(u.forYou) }));
  const mbti = mbtiBrief(k, me.facts.mbti);
  const profile = me.profile;

  // 타임라인(대운 14년·세운 12개월)
  let timeline: Brief["timeline"];
  let timelineKeys: string[] = [];
  if (input.product === "major_fortune" || input.product === "annual_fortune") {
    const tctx: TimelineCtx = { saju: me.saju, k, st: me.st, facts: profile, rng: rng.fork("timeline"), usedScenes, usedTemplates: new Set(), traits: me.traits, seenTenGod: new Map(), seenStage: new Set() };
    const thisYear = me.chart.thisYear.year;
    const tenGodOf = (s: Parameters<typeof getTenGod>[1]) => getTenGod(me.saju.dayMaster, s);
    // 십성 주의 문장의 조건("원국에 편관까지 있으면")은 이 원국에서 성립할 때만(P3.8 r1, P6b E-2 구조화).
    const tenGodNotes = tenGodNotesOf(k, { strength: me.saju.structureAnalysis.dayMasterStrength.level, distribution: me.saju.tenGods.distribution, groups: groupValues(me.saju) });
    if (input.product === "major_fortune") {
      const entries = buildYearEntries(tctx, thisYear, me.dayun.cycles);
      const transitions = entries.filter(e => e.dayun?.transition).map(e => e.key);
      timeline = { entries, tenGodNotes: tenGodNotes(entries, "year"), keyEntries: transitions.length ? transitions : [...entries].sort((a, b) => b.flow.score - a.flow.score || a.key.localeCompare(b.key)).slice(0, 2).map(e => e.key), cycles: cycleSummary(me.dayun.cycles, thisYear - 3, thisYear + 10, thisYear, tenGodOf) };
      timelineKeys = entries.map(e => e.key);
    } else {
      const year = input.selectedYear ?? thisYear;
      const yp = getAnnualPillar(year);
      const yearEntry = buildEntry(tctx, "year", String(year), `${year}년 ${ganjiLabel(yp)}`, yp, "annual", 0);
      const months = buildMonthEntries(tctx, year, input.baseDate);
      timeline = { entries: [yearEntry, ...months], tenGodNotes: { ...tenGodNotes(months, "month"), ...tenGodNotes([yearEntry], "year") }, keyEntries: [...months].sort((a, b) => b.flow.score - a.flow.score || a.key.localeCompare(b.key)).slice(0, 3).map(e => e.key), cycles: cycleSummary(me.dayun.cycles, year, year, year, tenGodOf) };
      timelineKeys = months.map(e => e.key);
    }
  }

  // 살필 점 결정론 값(P6d D): 같은 십성 해(2023·2033 癸)에 같은 문장이 가지 않게, 관계 → 천간 십성 → 지지 십성 순으로 아직 안 쓴 줄.
  if (timeline) {
    const cctx: CautionCtx = { strength: me.saju.structureAnalysis.dayMasterStrength.level, distribution: me.saju.tenGods.distribution, groups: groupValues(me.saju) };
    const used = new Set<string>();
    for (const e of timeline.entries) e.caution = cautionOf(e, k, cctx, used);
  }

  // 궁합
  const compatibility = isPair && other ? buildCompatibility(input.relationshipType!, side(me, k), side(other, k), k, narrative.compatibility?.[input.relationshipType!]) : undefined;

  // 상품 근거
  const tagsOf = (key: string) => key.startsWith("mbti:") ? k.mbti.get(key.slice(5) as never)?.dimensionTags : k.features.get(key)?.dimensionTags;
  const priorEvidence = new Set(input.priorEvidence ?? []);
  const evidence: Record<string, Material> = input.product === "love_marriage_child" ? (() => {
      const base = { ...loveDesign(me.saju, k, me.person.gender, me.st, mbti ? k.mbti.get(mbti.type)! : null, profile), ...loveEvidence(me.saju, me.det, k, me.person.gender, me.st, mbti ? k.mbti.get(mbti.type)! : null, { hitIds: new Set(me.hitIds), facts: profile, usedScenes, avoid: key => me.clashes(key, tagsOf(key)) }) };
      // 연애 전용 설계기(P6d G): 장마다 정해진 근거·관계 상태별 근거. 기존 근거(배우자·자녀 별·자리, 맞는 유형)는 base로 넘겨 재사용.
      return { ...base, ...loveDesign2({ saju: me.saju, det: me.det, k, chart: me.chart, mbti: mbti ? k.mbti.get(mbti.type)! : null, gender: me.person.gender, relationshipStatus: me.facts.relationshipStatus, facts: profile, hitIds: new Set(me.hitIds), baseDate: input.baseDate, priorEvidence, base }) };
    })()
    : input.product === "major_fortune" && timeline ? majorDesign(timeline.entries, timeline.cycles, me.chart.thisYear.year)
    : input.product === "annual_fortune" && timeline ? (() => { const months = timeline!.entries.filter(e => e.kind === "month"), link = keyMonthsLink(months, timeline!.keyEntries); return { ...annualDesign(timeline!.entries.find(e => e.kind === "year"), months), ...(link ? { keyMonthsLink: link } : {}) }; })()
    : input.product === "career_money_study" ? (() => {
      const base = careerEvidence(me.saju, k, me.chart, mbti ? k.mbti.get(mbti.type)! : null, me.facts.detailJob, me.facts.jobStatus, me.traits, { stage: lifeStage({ jobStatus: me.facts.jobStatus, age: me.person.age }, profile), hitIds: new Set(me.hitIds), work: matchJob(me.facts.detailJob)?.stages });
      // 커리어 전용 설계기(P6d G): 장마다 정해진 근거·상태별 근거. 직무 3단·진로 다섯 갈래·돈 새는 곳은 base에서 재사용.
      return { ...base, ...careerDesign({ saju: me.saju, det: me.det, k, chart: me.chart, mbti: mbti ? k.mbti.get(mbti.type)! : null, jobStatus: me.facts.jobStatus, detailJob: me.facts.detailJob, hitIds: new Set(me.hitIds), baseDate: input.baseDate, priorEvidence, base, shop: me.profile.scene?.shop, jobProps: matchJob(me.facts.detailJob)?.props }) };
    })()
    : input.product === "saju_mbti_full" ? familyDesign(me.saju, groupValues(me.saju)) : {};

  // 상품 근거 문장도 고객 사실과 어긋나는 문장은 뺀다(미혼에게 "배우자와는 ~" 등).
  const esf: SafetyFacts = { birthTimeKnown: me.person.facts.birthTimeKnown, mbti: me.facts.mbti, relationship: profile.relationship, children: profile.children, job: profile.job };
  for (const [key, m] of Object.entries(evidence)) if (m.kind === "evidence") {
    // 시주 규칙은 빼고 본다: 시간 미상이면 근거 쪽에 '자녀 자리는 보지 않습니다' 같은 유보 안내가 들어 있다.
    // 지울 문장이 없으면 원문 그대로(나눴다 다시 이으면 "0.1"이 "0. 1"이 된다).
    const facts = m.facts.map(t => { const ss = splitSentences(t), kept = ss.filter(x => !/^(fact_|old_negative|source_mention)/.test(sentenceViolation(x, esf) ?? "") && balanceHolds(x, me.bc)); return kept.length === ss.length ? t : kept.join(" "); }).filter(Boolean);
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
  // 전환 해(대운 전환·세운 핵심 달)가 건드리는 trait: 전환 장은 원국 특성을 다시 소개하지 않고 이것만 짧게 부른다(P3.8 1).
  const transitionTouched = timeline ? timeline.entries.filter(e => timeline!.keyEntries.includes(e.key)).flatMap(e => (e.touched ?? []).map(t => ({ traitId: t.traitId, how: `${e.label}: ${t.how}`, key: e.key }))) : [];
  const mbtiTop = mbti ? topDimension(k.mbti.get(mbti.type)!.dimensionTags) : null;
  const relTopics = isPair ? k.compatScenes.types.find(t => t.type === input.relationshipType)?.topics : undefined;
  const { chapters, plan } = planChapters({
    product: input.product, narrative, traits: [...me.sources, ...(other?.sources ?? [])], facts: profile, rng: rng.fork("chapters"), usedScenes,
    ...(input.knownTraits?.length ? { known: new Set(input.knownTraits) } : {}),
    mbtiSeeds: k.mbtiSeeds, ...(input.excludeSeeds?.length ? { excludeSeeds: new Set(input.excludeSeeds) } : {}),
    mbti: mbti ? k.mbti.get(mbti.type)! : null, has, evidence, shadows, timelineKeys,
    ...(isPair && other ? { mbtiPair: ([[me, me.facts.mbti], [other, other.facts.mbti]] as const).flatMap(([p, t]) => t && k.mbti.get(t) ? [{ who: p.person.callName, profile: k.mbti.get(t)! }] : []) } : {}),
    ...(isPair ? {} : { props: customerProps({ detailJob: me.facts.detailJob, jobStatus: me.facts.jobStatus, age: me.person.age }, profile) }),
    ...(timeline ? { touched: new Map(timeline.entries.map(e => [e.key, (e.touched ?? []).map(t => t.traitId)])), transitionTouched } : {}),
    ...(mbtiTop ? { mbtiAxes: [mbtiTop] } : {}),
    // 궁합 장면은 그 관계 유형의 생활 주제에서만(P3.8 3: 부모·자녀 책에 친구 보온병·동창 회비). 부모·자녀는 자녀 나이대로 거른다.
    ...(relTopics && other ? { relScenes: { topics: relTopics, ...pairSides(me, other, k), ...(input.relationshipType === "parentChild" ? { childAge: other.person.age >= 20 ? "adult" as const : "minor" as const, exclude: parentChildExclude(me.person.gender, other.person.gender, other.person.age >= 20 ? rng.fork("living").pick(["together", "apart"] as const) : "together") } : {}) } } : {}),
  });

  // 항목의 touched는 그 장에 배정된 trait만 남긴다(P3.7 1-1: 원국 특성은 건드려진 것만, 배정된 것만 짧게 부른다).
  if (timeline) for (const e of timeline.entries) {
    const assigned = new Set(chapters.filter(c => c.id.endsWith(`:${e.key}`)).flatMap(c => c.materials.flatMap(m => m.kind === "trait" ? [m.traitId] : m.kind === "ref" && /^traits\.[ab]?t\d+$/.test(m.ref) ? [m.ref.slice(7)] : [])));
    const kept = (e.touched ?? []).filter(t => assigned.has(t.traitId));
    if (kept.length) e.touched = kept; else delete e.touched;
  }

  // 입력 직업이 없으면 '지금 일' 장은 원래 주제(장점이 부담이 되는 환경)로 둔다(P3.7 1-4).
  if (input.product === "career_money_study" && !me.facts.detailJob) for (const c of chapters) if (c.id === "current-fit") { c.title = "내 힘이 빛나는 일의 환경"; c.question = "내 힘은 어떤 일의 환경에서 가장 잘 쓰일까?"; }
  // 상태별 절 질문(P6d G): "{status:now}" → 입력 상태의 질문(미입력이면 단정하지 않는 질문).
  const noShopBiz = careerStatusOf(me.facts.jobStatus) === "business" && me.profile.scene?.shop === false;
  const statusQ = input.product === "career_money_study" ? (key: string) => (noShopBiz ? CAREER_BUSINESS_NOSHOP_Q[key] : undefined) ?? CAREER_STATUS_Q[key]?.[careerStatusOf(me.facts.jobStatus)]
    : input.product === "love_marriage_child" ? (key: string) => LOVE_STATUS_Q[key]?.[loveStatusOf(me.facts.relationshipStatus)] : null;
  if (statusQ) for (const c of chapters) for (const x of c.sections ?? []) { const m = x.q.match(/^\{status:(\w+)\}$/); if (m) x.q = statusQ(m[1]) ?? x.q; }
  // P6e 8: 연애 4장 제목은 상태에 따라(연애 중·기혼 = 표현과 대화의 리듬).
  if (input.product === "love_marriage_child") for (const c of chapters) { const t = LOVE_STATUS_TITLE[c.id]?.[loveStatusOf(me.facts.relationshipStatus)]; if (t) (c as { title: string }).title = t; }
  // 최종판 1-7·최종판2 1-1: 같은 일주의 이전 책이 쓴 이미지 줄(이미지 대장) + 같은 고객 다른 상품 책의 이미지 줄을 피할 이미지로. 궁합은 두 사람 일주 모두.
  { const avoid = [...new Set([...avoidImagesFor([me.chart.pillars.day.hanja, ...(other ? [other.chart.pillars.day.hanja] : [])], input.ledgerView), ...(input.priorImages ?? []).map(x => x.trim()).filter(x => x.length >= 6)])];
    if (avoid.length) (me.chart as { avoidImages?: string[] }).avoidImages = avoid; }
  const ledgerNotes = input.priorActions?.length || input.priorCovers?.length ? { ...(input.priorActions?.length ? { avoidActions: [...input.priorActions].slice(0, 30) } : {}), ...(input.priorCovers?.length ? { avoidCoverMotifs: [...new Set(input.priorCovers.flatMap(coverMotifs))] } : {}) } : undefined;
  // 다음 대운이 1년 안에 시작하면 지금 대운 설명에 전환을 붙인다(P3.7 r1: 2026년에 끝나는 대운을 시기 장이 끝나는 줄 모르고 썼다).
  const cd = me.chart.currentDayun, ty = me.chart.thisYear.year;
  if (cd?.next && cd.next.startYear - ty <= 1) cd.reading = `${cd.reading} 이 흐름은 ${cd.next.start ?? `${cd.next.startYear}년부터`} ${cd.next.ganji.hanja}(${cd.next.ganji.hangul}) ${cd.next.tenGod} 쪽 10년으로 넘어갑니다(전환을 함께 씁니다).`;
  // 궁합 장 제목·질문의 "A·B" 기호(예 "A가 보는 B")는 두 사람 호칭으로 바꾼다(고객 본문에 기호가 나오지 않게, P3.5 A9).
  if (other) {
    const name: Record<string, string> = { A: me.person.callName, B: other.person.callName };
    const PAIR = { 가: "이가", 는: "은는", 와: "과와", 를: "을를" } as const;
    const sub = (s: string) => s.replace(/(?<![A-Za-z])([AB])(가|는|와|를|의)?(?![A-Za-z])/g, (_, x: string, p?: keyof typeof PAIR | "의") => !p ? name[x] : p === "의" ? `${name[x]}의` : josa(name[x], PAIR[p]));
    for (const c of chapters) { c.title = sub(c.title); c.question = sub(c.question); for (const x of c.sections ?? []) x.q = sub(x.q); }
  }
  const chars = PRODUCT_CHARS[input.product];
  // 책 단위 소품 사용 기록(P3.6 A1): 안전망이 본문에서 같은 소품이 2회를 넘는지 센다.
  const usedProps: Record<string, number> = {};
  for (const c of chapters) for (const x of c.sceneHint ?? []) usedProps[x] = (usedProps[x] ?? 0) + 1;
  const draft = {
    version: BRIEF_VERSION, product: input.product, productTitle: narrative.title, seed: seed.toString(16), baseDate: input.baseDate,
    person: me.person, mbti, chart: me.chart, traits: traitsAll, fortunes, shadows, unused, chapters, plan,
    ...(timeline ? { timeline } : {}),
    ...(other ? { partner: { person: other.person, mbti: mbtiBrief(k, other.facts.mbti), chart: other.chart } } : {}),
    ...(compatibility ? { compatibility } : {}),
    style: { version: "style-v5-1", register: "존댓말, 가볍게(~입니다/~예요 혼용)", readingLevel: "초·중등", totalChars: chars.total, rules: STYLE_RULES, forbidden: [...narrative.forbidden] },
  };
  // 토큰 추정은 작가가 실제로 받는 입력 그대로(P3.8: 절·배정 기록·안 쓰는 trait를 빼고 센다).
  const budget = sectionBudget(renderWriterBrief({ ...draft, budget: { estimatedTokens: 0, bySection: {}, method: "" } } as Brief));
  // usedProps는 안전망용, appendix·glossary는 부록·용어 표시용이라 작가 토큰 추정·작가 입력에서 뺀다.
  const appendix = [me, ...(other ? [other] : [])].map(p => appendixOf(p, k));
  return BriefSchema.parse({ ...draft, ...(ledgerNotes ? { ledgerNotes } : {}), ...(Object.keys(usedProps).length ? { usedProps } : {}), appendix, glossary: glossaryOf(k), budget: { ...budget, method: TOKEN_METHOD }, ...(input.ledgerView ? { ledgerView: input.ledgerView } : {}) });
}

/**
 * 부모·자녀 장면 거르기(P3.8 r1): 부모·자녀 성별과 다른 호칭(엄마인데 아빠 장면), 함께 사는지·따로 사는지 섞임(외박 알림 ↔ 올라오는 기차표).
 * 함께 사는지는 입력에 없어, 성인 자녀는 책마다 한쪽으로 정하고 다른 쪽 장면을 뺀다.
 */
function parentChildExclude(parent: "MALE" | "FEMALE" | null, child: "MALE" | "FEMALE" | null, living: "together" | "apart"): RegExp {
  const parts = [
    ...(parent === "FEMALE" ? ["아빠", "아버지"] : parent === "MALE" ? ["엄마", "어머니"] : ["아빠", "아버지", "엄마", "어머니"]),
    ...(child === "FEMALE" ? ["아들"] : child === "MALE" ? ["(?<![가-힣])딸(?![기])"] : ["아들", "(?<![가-힣])딸(?![기])"]),
    ...(living === "together" ? ["올라오", "내려오", "올라가", "내려가", "기차표", "버스표", "표를 (끊|예매)", "택배", "영상 통화", "자취", "혼자 사는", "다녀가", "들르"] : ["외박", "현관", "귀가", "늦은 밤[^.]{0,12}(들어|오)", "거실", "아침 식탁", "방문을", "같은 집"]),
  ];
  return new RegExp(parts.join("|"));
}

/** 타임라인 항목이 가리키는 십성 뜻을 한 번만 싣는다(항목마다 반복하면 토큰이 두 배). */
function tenGodNotesOf(k: Knowledge, ctx: CautionCtx) {
  return (entries: readonly { tenGod: { stem: string } }[], kind: "year" | "month") => Object.fromEntries(entries.map(e => {
    const tg = e.tenGod.stem.match(/\((.+)\)/)?.[1] ?? ""; const p = k.tenGodPeriod.get(tg);
    // 살필 점은 원국으로 판정해 성립하는 문장만(P6b E-2: "원국에 ~있으면", "일간이 약하면"이 그대로 카드에 나갔다).
    const caution = p ? cautionFor(p.year.caution, ctx) : "";
    return [e.tenGod.stem, kind === "year" ? { meaning: dropSourceSentences(p?.year.meaning ?? ""), ...(caution ? { caution } : {}) } : { meaning: dropSourceSentences(p?.month.meaning ?? "") }];
  }));
}

/** 살필 점 후보(P6d D): ① 주의 쪽 관계 표시(충·형·파·해·원진·공망 등) ② 천간 십성 주의 문장(원국 조건 성립분) ③ 지지 십성 주의 문장. 앞 항목이 쓴 문장은 건너뛴다. */
const CAUTION_KINDS = /CHUNG|HYEONG|PA|HAE|WONJIN|GONGMANG|CLASH/;
function cautionOf(e: import("./schema").TimelineEntry, k: Knowledge, c: CautionCtx, used: Set<string>): string | undefined {
  const unit = e.kind === "month" ? "달" : "해";
  const tgOf = (label: string) => label.match(/\((.+)\)/)?.[1] ?? "";
  const lines = (tg: string) => (k.tenGodPeriod.get(tg)?.year.caution ?? []).filter(l => cautionHolds(l.when, c)).map(l => l.text.replace(/해(예요|입니다|라)/g, `${unit}$1`));
  const badge = e.badges.filter(b => CAUTION_KINDS.test(b.kind) || b.tone === "minus").map(b => `${b.with ? `${b.with} 글자와 ` : ""}${josa(b.label.replace(/\(.*\)$/, ""), "이가")} 걸리는 ${unit}: ${b.line}`.replace(/ (흐름|해|달)$/, " 쪽을 살피기"));
  const cands = [...badge, ...lines(tgOf(e.tenGod.stem)), ...lines(tgOf(e.tenGod.branch))].filter(x => x.length >= 8 && x.length <= 60);
  const pick = cands.find(x => !used.has(x));
  if (pick) used.add(pick);
  return pick;
}

/** 최종판 1-5: 궁합 장면 주인을 정할 두 사람의 행동 차원 값과 차원 양끝 이름. */
function pairSides(a: PersonPack, b: PersonPack, k: Knowledge) {
  const short = (x: string) => x.replace(/\s*편입니다\.?$/, " 편").replace(/입니다\.?$/, "").replace(/\.$/, "");
  // 최종판2 1-3: 장면 주인은 성격표를 반영한 값으로(표와 반대 끝에 그 사람을 세우지 않는다).
  return { sides: [{ name: a.person.callName, vec: profiledVector(side(a, k), k) }, { name: b.person.callName, vec: profiledVector(side(b, k), k) }] as const,
    poles: Object.fromEntries(k.ontology.dimensions.map(d => [d.id, { plus: short(d.poles.plus.description), minus: short(d.poles.minus.description) }])) };
}
function side(p: PersonPack, k: Knowledge): PairSide {
  return {
    saju: p.saju, chart: p.chart, st: p.st, traits: p.traits, hitIds: p.hitIds, mbti: p.facts.mbti ? k.mbti.get(p.facts.mbti) ?? null : null, callName: p.person.callName, gender: p.person.gender,
  };
}
