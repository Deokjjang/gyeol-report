/**
 * 상품별 필수 근거(SPEC §2).
 * 연애: 배우자성(남=재성, 여=관성)·배우자궁(일지), 자녀성(남=관성, 여=식상)·자녀궁(시지, 시간 미상이면 유보), 잘 맞는 상대(부족 오행 보완 + MBTI 통념), 만남 장소.
 * 커리어: 직업·역할 추천 근거(강한 십성 묶음 + MBTI 통념 직업 + 입력 직업), 올해 기운이 돈·재산 흐름에 주는 영향(투자 지시 아님).
 */
import { matchJob, type LifeStage } from "./props";
import { dropSourceSentences } from "@/lib/writer/safety/patterns";
import type { CareerJob, MbtiProfile, SceneItem } from "@/data/knowledge-v5/schema";
import { sceneFits, type FactProfile } from "./facts";
import { BRANCH_MAIN_ELEMENT } from "@/lib/saju/constants";
import type { ChartDetections, ChartPosition } from "@/lib/saju/detections/types";
import { getTenGodGroupScores } from "@/lib/saju/extractTags";
import type { SajuCalcResult, TenGod } from "@/lib/saju/types";
import type { ElementState } from "./chart";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, josa, POSITION_KO, TEN_GOD_GROUP, TEN_GOD_KO } from "./labels";
import type { ChartBrief, Trait } from "./schema";

type Evidence = { kind: "evidence"; key: string; facts: string[]; note?: string };
const STARS = { WEALTH: ["偏財", "正財"], OFFICER: ["偏官", "正官"], OUTPUT: ["食神", "傷官"] } as const satisfies Record<string, readonly TenGod[]>;
const GROUP_KO = { PEER: "비겁(나와 같은 기운)", OUTPUT: "식상(표현·생산)", WEALTH: "재성(재물·현실)", OFFICER: "관성(책임·규칙)", RESOURCE: "인성(배움·보호)" } as const;
/** 강한 십성 묶음 → 맞는 공부 방식(P3.6 B 학업 방향). */
const STUDY_BY_GROUP = {
  PEER: "혼자 목표를 세우고 스스로 진도를 재는 공부(독학·실기 자격)",
  OUTPUT: "직접 만들고 발표하며 익히는 공부(프로젝트·포트폴리오·실습)",
  WEALTH: "숫자와 결과가 바로 보이는 실무 공부(실무 자격·데이터·회계)",
  OFFICER: "범위와 기한이 정해진 공부(시험·공인 자격·학위 과정)",
  RESOURCE: "깊이 파고 정리하는 공부(이론·연구·글쓰기)",
} as const;
/** 묶음별 구체 공부 예(P3.7 r1: "분야 하나를 짝지어 쓴다"만 주니 공부 이름이 비었다). */
const STUDY_EXAMPLES = {
  PEER: "실기형 자격과 독학 과정(예: 번역 자격, 코딩 부트캠프, 생활체육 지도자)",
  OUTPUT: "포트폴리오를 남기는 실습 과정(예: UX 라이팅, 영상 편집, 콘텐츠 기획 과정)",
  WEALTH: "숫자로 성과가 보이는 실무 자격(예: 전산회계, 데이터분석 준전문가, 물류관리사)",
  OFFICER: "범위가 정해진 공인 자격(예: 정보처리기사, 품질경영기사, 행정사)",
  RESOURCE: "깊이 파는 학위·연구형 과정(예: 대학원 강좌, 상담·교육 관련 자격)",
} as const;
/** 입력 상태 값(내부 영문 값을 본문에 옮기지 않게). */
const JOB_STATUS_KO: Readonly<Record<string, string>> = { student: "학생", job_seeker: "구직 중", employee: "직장인", freelancer: "프리랜서", self_employed: "자영업", business_owner: "사업 운영", homemaker: "살림", unemployed: "쉬는 중" };
/** 강한 묶음이 힘을 내는 판. 다른 직업 예시는 붙이지 않는다(P6: "공무, 법무, 품질, 회계 같은 일은"이 원고에 그대로 나열됐다). */
const ROLE_BY_GROUP = {
  PEER: "혼자 판을 짜고 내 이름으로 책임지는 일",
  OUTPUT: "만들고 말해서 결과물을 내는 일",
  WEALTH: "숫자와 결과를 다루며 자원을 굴리는 일",
  OFFICER: "규칙과 책임이 분명한 조직의 일",
  RESOURCE: "배우고 정리해서 남에게 전하는 일",
} as const;

/** 십성 위치: 드러난 천간(년·월·시) + 지지 본기(일지 포함). 시간 미상이면 시주 제외. */
function starPositions(saju: SajuCalcResult, det: ChartDetections, stars: readonly TenGod[]): { tenGod: TenGod; where: string }[] {
  const out: { tenGod: TenGod; where: string }[] = [];
  for (const p of ["year", "month", "hour"] as const) { const t = saju.tenGods.stems[p]; if (t && stars.includes(t) && (p !== "hour" || det.hourIncluded)) out.push({ tenGod: t, where: `${POSITION_KO[p]} 하늘 글자` }); }
  for (const p of ["year", "month", "day", "hour"] as const) {
    const pillar = saju.pillars[p]; if (!pillar || (p === "hour" && !det.hourIncluded)) continue;
    const main = saju.tenGods.hiddenStems.find(h => h.branch === pillar.branch && h.weight >= 0.5);
    if (main?.tenGod && stars.includes(main.tenGod)) out.push({ tenGod: main.tenGod, where: `${POSITION_KO[p]} 땅 글자 속` });
  }
  return out;
}

function starEvidence(key: string, label: string, saju: SajuCalcResult, det: ChartDetections, k: Knowledge, stars: readonly TenGod[] | null): Evidence {
  if (!stars) return { kind: "evidence", key, facts: [`성별 정보가 없어 ${label} 판단은 보류합니다.`], note: "본문에서 이 별을 말하지 않는다" };
  const found = starPositions(saju, det, stars);
  const names = stars.map(t => TEN_GOD_KO[t]).join("·");
  if (!found.length) {
    return { kind: "evidence", key, facts: [`${josa(`${label}(${names})`, "이가")} 드러난 자리에 없습니다. '정해진 틀보다 스스로 찾아 쓰는 인연'으로 읽습니다.`], note: "단정하지 않는다" };
  }
  const main = found[0].tenGod; const f = k.features.get(`tenGod:${main}`);
  return { kind: "evidence", key, facts: [`${label}(${names}) ${found.length}자리: ${found.map(x => `${x.where} ${TEN_GOD_KO[x.tenGod]}`).join(", ")}`, ...(f ? [`${TEN_GOD_KO[main]}의 결: ${f.oneLiner}`] : [])] };
}

function palaceEvidence(key: string, label: string, position: ChartPosition, saju: SajuCalcResult, det: ChartDetections, k: Knowledge): Evidence {
  const pillar = saju.pillars[position];
  if (!pillar || (position === "hour" && !det.hourIncluded)) return { kind: "evidence", key, facts: [`출생시간을 몰라 ${label.replace(/\(.*\)$/, "")}는 보지 않습니다.`], note: "본문에서 이 자리를 말하지 않는다" };
  const b = pillar.branch; const f = k.features.get(`branch:${b}`);
  const stage = det.twelveStages.find(s => s.position === position);
  const stageF = stage ? k.features.get(`twelveStage:${stage.stage}`) : undefined;
  const main = saju.tenGods.hiddenStems.find(h => h.branch === b && h.weight >= 0.5)?.tenGod;
  // 자리는 땅 글자다: 천간합(하늘 글자끼리)은 이 자리의 관계가 아니다(P3.6 B).
  const rel = det.relations.filter(r => r.kind !== "STEM_HAP" && r.members.some(m => m.position === position) && r.members.length >= 2)
    .map(r => { const line = k.badges.find(b => b.kind === r.kind && (b.pair === r.key || b.pair === [...r.key].reverse().join("")))?.line; return `${josa(r.members.filter(m => m.position !== position).map(m => POSITION_KO[m.position as ChartPosition]).join("·"), "과와")} ${RELATION_KO[r.kind]}(${r.key})${line ? `: ${line}` : ""}`; });
  return { kind: "evidence", key, facts: [
    `${label}: ${b}(${ELEMENT_KO[BRANCH_MAIN_ELEMENT[b]]})${main ? `, 속 기운 ${TEN_GOD_KO[main]}` : ""}`,
    ...(f?.positionNuance ? [f.positionNuance[position]] : []),
    ...(stageF ? [`그 자리의 단계: ${stageF.name} — ${stageF.oneLiner}`] : []),
    ...(rel.length ? [`그 자리와 엮인 관계: ${rel.join(", ")}`] : []),
  ] };
}

/** 관계 코드는 작가에게 쉬운 이름으로 넘긴다(내부 코드 노출 방지). */
const RELATION_KO: Record<string, string> = { STEM_HAP: "천간합", YUKHAP: "육합", SAMHAP: "삼합", BANGHAP: "방합", CHUNG: "충", HYEONG: "형", PA: "파", HAE: "해", WONJIN: "원진" };

/**
 * 추천 상대 초상(P3.5 A6): 부족한 기운을 채우는 오행 성향 + 잘 맞는 MBTI를 한 사람으로 합친 재료.
 * 예) "물 기운이 넉넉한 INFJ 같은 사람: 말수가 적고 핵심을 한 마디로 짚는…". 오행은 가장 부족한 기운(없으면 가장 약한 기운),
 * MBTI는 통념 궁합표의 첫 '좋음'. MBTI가 없으면 오행 초상만.
 */
export function partnerPortrait(k: Knowledge, st: ElementState, mbti: MbtiProfile | null): string[] {
  const e = st.lacking[0] ?? st.missing[0];
  if (!e) return [];
  const bal = k.features.get(`element:${e}:BALANCED`), remedy = k.features.get(`element:${e}:${st.missing.includes(e) ? "MISSING" : "WEAK"}`)?.remedy;
  const fit = mbti?.conventionalCompat.find(c => c.fit === "좋음");
  const other = fit ? k.mbti.get(fit.type) : undefined;
  const who = `${ELEMENT_KO[e]} 기운이 넉넉한 ${other ? `${other.type} 같은 사람` : "사람"}`;
  return [
    `초상(한 사람으로 합쳐 쓴다): ${who}`,
    ...(bal ? [`${ELEMENT_KO[e]} 기운이 넉넉한 사람의 결: ${bal.oneLiner}. ${bal.strengths[0]}`] : []),
    ...(other ? [`${other.type}(${other.easyName})의 결: ${other.oneLiner}. 모습: ${other.image.visual}`] : []),
    `맞는 이유: 당신에게 부족한 ${josa(ELEMENT_KO[e], "을를")} 채워 줌${fit ? ` / ${fit.why}` : ""}`,
    ...(remedy?.partner[1] ? [`곁에 있을 때 장면: ${remedy.partner[1]}`] : []),
  ];
}

const ASPECT_KO = { crush: "호감 표현", contact: "연락 패턴", pushPull: "밀당" } as const;
/**
 * 연애 신호(P3.7 1-4): 도화·홍염(있으면) → 가장 센 십성 둘 → MBTI 순으로 근거를 모아, 측면마다 근거별 한 줄 + 고객 사실에 맞는 장면 하나.
 * crush·contact는 '호감이 생기는 순간' 장, pushPull은 '표현하는 방식과 밀당' 장 재료다.
 */
function loveSignals(saju: SajuCalcResult, hitIds: ReadonlySet<string>, k: Knowledge, mbti: MbtiProfile | null, facts: FactProfile, usedScenes: Set<string>, aspects: readonly (keyof typeof ASPECT_KO)[], key: string, avoid?: (featureKey: string) => boolean): Evidence | null {
  const d = saju.tenGods.distribution as Partial<Record<TenGod, number>>;
  const tenGods = (Object.keys(TEN_GOD_KO) as TenGod[]).filter(t => (d[t] ?? 0) > 0).sort((a, b) => (d[b] ?? 0) - (d[a] ?? 0) || a.localeCompare(b)).slice(0, 2);
  // 이 사람의 trait와 같은 차원에서 반대인 근거는 쓰지 않는다(P3.7 r2: 1장 "날카롭게" ↔ 밀당 "한참 지켜봄").
  const keys = [...["shinsal:DOHWASAL", "shinsal:HONGYEOMSAL"].filter(x => hitIds.has(x)), ...tenGods.map(t => `tenGod:${t}`), ...(mbti ? [`mbti:${mbti.type}`] : [])].filter(x => !avoid?.(x));
  // 근거는 명리 하나 + MBTI 하나까지(P3.7 r1: 세 갈래 나열이 장면 대신 목록 복사를 불렀다).
  const all = keys.flatMap(x => { const e = k.loveSignals.get(x); if (!e) return []; const f = k.features.get(x); return [{ e, label: f ? `${f.easyName}(${f.name.replace(/\(.*?\)/g, "").replace(/·.*$/, "")})` : e.name }]; });
  const sources = [...all.filter(x => !x.e.key.startsWith("mbti:")).slice(0, 1), ...all.filter(x => x.e.key.startsWith("mbti:"))].slice(0, 2);
  if (!sources.length) return null;
  const facts_: string[] = [];
  for (const a of aspects) {
    facts_.push(`${ASPECT_KO[a]}: ${sources.map(x => `${x.label} 쪽은 ${x.e[a].line}`).join(" / ")}`);
    const scene = sources.flatMap(x => x.e[a].scenes).find((sc: SceneItem) => sceneFits(sc.requires, facts) && !usedScenes.has(sc.text));
    if (scene) { usedScenes.add(scene.text); facts_.push(`${ASPECT_KO[a]} 장면: ${scene.text}`); }
  }
  return { kind: "evidence", key, facts: facts_ };
}

export function loveEvidence(saju: SajuCalcResult, det: ChartDetections, k: Knowledge, gender: "MALE" | "FEMALE" | null, st: ElementState, mbti: MbtiProfile | null, signals?: { hitIds: ReadonlySet<string>; facts: FactProfile; usedScenes: Set<string>; avoid?: (featureKey: string) => boolean }): Record<string, Evidence> {
  // 호감 표현·연락 패턴·밀당은 절마다 따로(P3.8 1: 절 하나에 질문 하나).
  const sig = signals ? Object.fromEntries((["crush", "contact", "pushPull"] as const).map(a => [a, loveSignals(saju, signals.hitIds, k, mbti, signals.facts, signals.usedScenes, [a], a, signals.avoid)])) : {};
  const spouseStars = gender === "MALE" ? STARS.WEALTH : gender === "FEMALE" ? STARS.OFFICER : null;
  const childStars = gender === "MALE" ? STARS.OFFICER : gender === "FEMALE" ? STARS.OUTPUT : null;
  const lack = st.lacking;
  const partnerLines = lack.flatMap(e => { const f = k.features.get(`element:${e}:${st.missing.includes(e) ? "MISSING" : "WEAK"}`); return f?.remedy ? [`채워 줄 ${josa(ELEMENT_KO[e], "을를")} 가진 사람: ${f.remedy.partner[0]}`] : []; });
  // 남녀가 나뉘는 곳(사우나·온천·찜질방)은 새 인연을 만나는 자리가 아니다(P3.7 r1).
  const places = lack.flatMap(e => (k.features.get(`element:${e}:${st.missing.includes(e) ? "MISSING" : "WEAK"}`)?.remedy?.places ?? []).filter(x => !/사우나|온천|찜질|목욕/.test(x)).slice(0, 3));
  return {
    spouseStar: starEvidence("spouseStar", "배우자 별", saju, det, k, spouseStars),
    spousePalace: palaceEvidence("spousePalace", "배우자 자리(태어난 날의 땅 글자)", "day", saju, det, k),
    childStar: starEvidence("childStar", "자녀 별", saju, det, k, childStars),
    childPalace: palaceEvidence("childPalace", "자녀 자리(태어난 시각의 땅 글자)", "hour", saju, det, k),
    partnerMatch: { kind: "evidence", key: "partnerMatch", facts: [...partnerPortrait(k, st, mbti), ...(partnerLines.length ? partnerLines : ["뚜렷하게 부족한 기운이 없어 '나와 속도가 비슷한 사람'이 편합니다."])] },
    ...Object.fromEntries(Object.entries(sig).filter((x): x is [string, Evidence] => x[1] !== null)),
    meetingPlaces: { kind: "evidence", key: "meetingPlaces", facts: places.length ? [`새 인연을 만나기 좋은 곳(부족한 기운을 채우는 곳): ${places.join(", ")}`] : ["부족한 기운이 뚜렷하지 않아 장소 추천은 일상 동선(늘 가는 곳에서 한 번 더 말 걸기)으로 둡니다."], note: "쉼터가 아니라 사람을 만나는 자리로 쓴다" },
  };
}

/** 십성 묶음의 행동 차원: 두 십성 feature의 dimensionTags 평균(지금 자리 역할의 MBTI 근거를 찾는 데 쓴다). */
function groupDims(k: Knowledge, g: keyof typeof GROUP_KO): Record<string, number> {
  const out: Record<string, number> = {};
  for (const t of (Object.keys(TEN_GOD_GROUP) as TenGod[]).filter(x => TEN_GOD_GROUP[x] === g)) for (const [d, v] of Object.entries(k.features.get(`tenGod:${t}`)?.dimensionTags ?? {})) out[d] = (out[d] ?? 0) + v / 2;
  return out;
}
/** MBTI 적성(-1~1): 직무가 요구하는 행동 차원과 이 유형 차원의 내적 ÷ 직무 차원 크기. 가장 크게 맞는 차원을 근거로 돌려준다. */
function mbtiFit(k: Knowledge, dims: Readonly<Record<string, number>>, mbti: MbtiProfile): { fit: number; clash: boolean; reason?: string; reasons: string[] } {
  let dot = 0, size = 0, best: [string, number] | null = null, clash = false;
  const pos: [string, number][] = [];
  for (const [d, v] of Object.entries(dims)) {
    const m = mbti.dimensionTags[d] ?? 0; dot += v * m; size += Math.abs(v);
    if (v * m > 0) pos.push([d, v * m]);
    if (v * m > (best?.[1] ?? 0)) best = [d, v * m];
    // 직무의 핵심 요구(0.5 이상)가 유형의 핵심(0.6 이상)과 정면으로 반대면 뺀다(ENTJ에게 지시를 따르는 임원 비서).
    if (Math.abs(v) >= 0.5 && Math.abs(m) >= 0.6 && Math.sign(v) !== Math.sign(m)) clash = true;
  }
  // 근거는 그 성향의 쉬운 설명 한 구절(P6: "ENTJ의 '말이 많음' 쪽(말수)"을 작가가 "말수가 많은 ENTJ의 쪽이"로 옮겼다).
  const say = (id: string) => { const dim = k.ontology.dimensions.find(x => x.id === id)!; const pole = dims[id] > 0 ? dim.poles.plus : dim.poles.minus; return `${mbti.type}는 ${pole.description.replace(/입니다\.?$/, "")}`; };
  const reasons = pos.sort((a, b) => b[1] - a[1]).map(([d]) => say(d));
  return { fit: size ? dot / size : 0, clash, ...(best ? { reason: say(best[0]) } : {}), reasons };
}

type JobCtx = { readonly k: Knowledge; readonly traits: readonly Trait[]; readonly hitIds: ReadonlySet<string>; readonly scores: Record<string, number>; readonly mbti: MbtiProfile | null; readonly stage: LifeStage; readonly cluster?: string; readonly detailJob: string };
type Scored = { job: CareerJob; total: number; myeongri: number; fit: number; adjacency: number; basis: string; mbtiReason?: string; mbtiReasons?: readonly string[] };
/**
 * 직무 점수(P3.8 2) = 명리 적성(십성 묶음 세기·특히 맞는 신살·귀인·십성·구조) × MBTI 적성(행동 차원) × 지금 직업과의 인접성(전환 비용) × 생활 단계.
 * 한쪽만 맞는 직무는 근거가 강할 때만, MBTI 핵심과 정면으로 어긋나는 직무는 뺀다.
 */
function scoreJobs(c: JobCtx): Scored[] {
  const near = new Set(c.k.catalog.clusters.find(x => x.id === c.cluster)?.near ?? []);
  const traitByKey = new Map(c.traits.map(t => [t.featureId, t]));
  const out: Scored[] = [];
  for (const job of c.k.catalog.jobs) {
    if (c.detailJob && (job.title.includes(c.detailJob) || c.detailJob.includes(job.title))) continue;
    const g = Math.max(...job.groups.map(x => Math.min(1, (c.scores[x] ?? 0) / 3)));
    const keyHit = (job.keys ?? []).find(x => traitByKey.has(x) || c.hitIds.has(x));
    const myeongri = Math.min(1, g + (keyHit ? 0.35 : 0));
    const m = c.mbti ? mbtiFit(c.k, job.dims, c.mbti) : { fit: 0.3, clash: false, reasons: [] as string[] };
    if (m.clash) continue;
    // 한쪽만 맞는 직무: 명리가 약하면 MBTI가 아주 잘 맞을 때만, MBTI가 맞지 않으면 명리 근거(특히 맞는 기운)가 있을 때만.
    if (myeongri < 0.4 && m.fit < 0.55) continue;
    if (c.mbti && m.fit < 0.1 && !keyHit) continue;
    const adjacency = !c.cluster ? 0.7 : job.cluster === c.cluster ? 1 : near.has(job.cluster) ? 0.75 : 0.4;
    const stageOk = !job.stages || job.stages.includes(c.stage as never);
    const entry = job.entry === "license" ? (c.stage === "student" || c.stage === "job_seeker" || job.cluster === c.cluster ? 0.8 : 0.3) : job.entry === "retrain" ? (c.stage === "mid_career" ? 0.7 : 0.85) : 1;
    const total = myeongri * (0.5 + 0.5 * Math.max(0, m.fit)) * adjacency * (stageOk ? 1 : 0.5) * entry;
    const t = keyHit ? traitByKey.get(keyHit) : undefined;
    const top = job.groups.slice().sort((a, b) => (c.scores[b] ?? 0) - (c.scores[a] ?? 0))[0];
    const basis = t ? `${t.easyName}(${t.name.replace(/\(.*?\)/g, "").replace(/·.*$/, "").trim()})` : `강한 ${GROUP_KO[top as keyof typeof GROUP_KO]}`;
    out.push({ job, total, myeongri, fit: m.fit, adjacency, basis, ...("reason" in m && m.reason ? { mbtiReason: m.reason, mbtiReasons: m.reasons } : {}) });
    // 특히 맞는 기운이 있어도 같은 근거가 이미 쓰였으면 십성 묶음 근거로도 고를 수 있게 한 번 더 둔다(점수는 그대로).
    if (t) out.push({ job, total: total * 0.98, myeongri, fit: m.fit, adjacency, basis: `강한 ${GROUP_KO[top as keyof typeof GROUP_KO]}`, ...("reason" in m && m.reason ? { mbtiReason: m.reason, mbtiReasons: m.reasons } : {}) });
  }
  return out.sort((a, b) => b.total - a.total || a.job.title.localeCompare(b.job.title));
}
const jobLine = (x: Scored) => `${x.job.title} — 명리: ${x.basis}, ${x.job.why}${x.mbtiReason ? ` / MBTI: ${x.mbtiReason}` : ""}`;
/**
 * 같은 묶음은 한 단에서 2개까지(목록이 한 분야로 쏠리지 않게). 같은 명리 근거(trait·십성 묶음 이름)가 이미 쓰였으면 점수를 깎아 다른 근거를 먼저 고른다
 * (P3.8 r1: 직무 줄마다 "바른 관리자(정관)"를 근거로 붙여 한 장에 세 번 나왔다). 점수가 min 아래면 넣지 않는다.
 */
function takeSpread(list: readonly Scored[], n: number, used: Set<string>, basisUse: Map<string, number>, min = 0): Scored[] {
  const out: Scored[] = [], per = new Map<string, number>();
  // MBTI 근거도 같은 축이 이미 쓰였으면 다음 근거로(P3.8 r1: 직무 7개 중 5개가 '미리 짬').
  const reasonOf = (x: Scored) => x.mbtiReasons?.find(r => !basisUse.has(r)) ?? x.mbtiReason;
  const eff = (x: Scored) => x.total * 0.8 ** (basisUse.get(x.basis) ?? 0) * 0.85 ** (basisUse.get(reasonOf(x) ?? "") ?? 0);
  while (out.length < n) {
    const best = list.filter(x => !used.has(x.job.title) && (per.get(x.job.cluster) ?? 0) < 2 && x.total >= min).sort((a, b) => eff(b) - eff(a) || a.job.title.localeCompare(b.job.title))[0];
    if (!best) break;
    const reason = reasonOf(best);
    out.push({ ...best, ...(reason ? { mbtiReason: reason } : {}) }); used.add(best.job.title); per.set(best.job.cluster, (per.get(best.job.cluster) ?? 0) + 1);
    basisUse.set(best.basis, (basisUse.get(best.basis) ?? 0) + 1); if (reason) basisUse.set(reason, (basisUse.get(reason) ?? 0) + 1);
  }
  return out;
}

/** 돈 굴리는 성향·원칙(P3.7 1-4): 재성의 결(정재·편재·옅음) × 강한 묶음의 버릇 × 올해 십성. 방식 수준만(종목·시점·액수 금지). */
function investment(d: Partial<Record<TenGod, number>>, scores: Record<string, number>, strength: string, yearTg: TenGod | undefined): { invest: string[]; leak: string[] } {
  const jung = d.正財 ?? 0, pyeon = d.偏財 ?? 0;
  const style = Math.max(jung, pyeon) < 0.5 ? { name: "지키는 쪽부터(돈 기운이 옅은 편)", rules: ["비상금을 먼저 채우고, 그다음에 적립을 시작한다", "잘 아는 것에만 넣고 남이 권하는 것은 한 번 미룬다"] }
    : Math.abs(jung - pyeon) < 0.3 ? { name: "고정 수입과 성과 수입을 나눠 굴리는 쪽", rules: ["고정 수입은 자동 적립, 성과로 들어온 돈은 나눠서 일부만 도전 몫으로", "도전 몫의 크기를 처음에 정해 두고 넘기지 않는다"] }
    : jung > pyeon ? { name: "정해진 금액을 꾸준히 모으는 안정형(정재 쪽)", rules: ["매달 같은 날 같은 금액을 자동으로 적립한다", "한곳에 몰지 않고 여러 갈래로 나눠 둔다"] }
    : { name: "기회를 보고 크게 움직이는 기회형(편재 쪽)", rules: ["대부분은 적립으로 묶어 두고 기회 몫은 작게 따로 둔다", "들어가기 전에 '여기까지 잃으면 멈춘다'를 적어 둔다"] };
  const habit = [
    ...(scores.PEER >= 2.5 ? ["나와 같은 기운(비겁)이 강해 빌려주기·공동 투자·보증에서 돈이 새기 쉽다: 이런 제안은 하루 미루고 답한다"] : []),
    ...(scores.OUTPUT >= 2.5 ? ["버는 힘이 지키는 힘보다 크다: 들어온 날 먼저 떼어 두는 규칙이 맞다"] : []),
    ...(scores.RESOURCE >= 2.5 ? ["생각이 길어 시점을 놓치기 쉽다: 날짜와 금액을 자동이체로 정해 두면 편하다"] : []),
    ...(scores.OFFICER >= 2.5 ? ["정한 규칙은 잘 지킨다: 원칙을 한 장에 적어 두면 흔들림이 적다"] : []),
    ...((strength === "WEAK" || strength === "VERY_WEAK") && scores.WEALTH >= 2.5 ? ["재물 기운에 비해 내 힘이 약한 편: 감당할 만큼만 굴리고 현금 비율을 넉넉히 둔다"] : []),
  ].slice(0, 2);
  const group = yearTg ? TEN_GOD_GROUP[yearTg] : undefined;
  // 올해 십성이 '새는 곳' 버릇과 같은 묶음이면 올해 줄은 뺀다(같은 주의를 두 장에서 하지 않게, P3.8 r1).
  const sameAsHabit = group !== undefined && scores[group] >= 2.5 && ["PEER", "OUTPUT", "RESOURCE", "OFFICER"].includes(group);
  const year = sameAsHabit ? "" : group === "WEALTH" ? "올해는 재물 기운이 들어와 기회가 많아 보이는 해: 한도를 먼저 정하고 움직인다"
    : group === "PEER" ? "올해는 같은 기운이 들어와 돈이 나가기 쉬운 해: 빌려주기·동업 제안은 천천히"
    : group === "OUTPUT" ? "올해는 버는 길이 늘어나는 해: 새로 생긴 수입은 들어온 날 일부를 적립으로 돌린다"
    : group === "OFFICER" ? "올해는 책임과 고정 지출이 붙기 쉬운 해: 고정 지출부터 한 번 점검한다"
    : group === "RESOURCE" ? "올해는 공부·준비의 해: 큰 결정보다 공부와 기록을 먼저 한다" : "";
  return { invest: [`돈 굴리는 성향: ${style.name}`, `운영 원칙: ${[...style.rules, "생활비 몇 달 치는 현금으로 따로 둔다"].join(" / ")}`, ...(year ? [year] : [])], leak: habit };
}

export function careerEvidence(saju: SajuCalcResult, k: Knowledge, chart: ChartBrief, mbti: MbtiProfile | null, detailJob: string, jobStatus: string, traits: readonly Trait[] = [], opts: { stage?: LifeStage; hitIds?: ReadonlySet<string> } = {}): Record<string, Evidence> {
  const scores = getTenGodGroupScores(saju.tenGods.distribution);
  const top = (Object.entries(scores) as [keyof typeof GROUP_KO, number][]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 2);
  const yearTg = chart.thisYear.tenGod.match(/\((.+)\)/)?.[1] as TenGod | undefined;
  const period = yearTg ? k.tenGodPeriod.get(yearTg) : undefined;
  const d = saju.tenGods.distribution as Partial<Record<TenGod, number>>;
  const job = matchJob(detailJob);
  const topG = top.map(([g]) => g);
  const fit = job ? k.career.fits.find(f => f.jobId === job.id) : undefined;
  const fitLevel = fit ? (fit.groups.includes(topG[0]) ? "잘 맞는 편" : fit.groups.some(g => topG.includes(g)) ? "절반쯤 맞는 편" : "다른 힘으로 하는 일(맞지 않는다는 뜻이 아니라 쓰는 근육이 다르다)") : null;
  // 직무 3단(P3.8 2): 지금 자리에서 넓힐 역할 2~3 · 옮겨 갈 인접 직무 3~4 · 길게 보면 다른 길 2~3. 줄마다 명리 근거와 MBTI 근거를 함께.
  const cluster = job ? k.catalog.jobClusters[job.id] : undefined;
  const scored = scoreJobs({ k, traits, hitIds: opts.hitIds ?? new Set(traits.map(t => t.featureId)), scores, mbti, stage: opts.stage ?? "unknown" as LifeStage, cluster, detailJob });
  const used = new Set<string>(), basisUse = new Map<string, number>();
  const adjacent = takeSpread(scored.filter(x => x.adjacency >= 0.75), 4, used, basisUse);
  // 다른 길은 인접 직무 점수의 절반 이상인 것만(억지로 세 개를 채우지 않는다, 최소 2개).
  const farList = scored.filter(x => x.adjacency < 0.75 && x.myeongri >= 0.5 && (!mbti || x.fit >= 0.3));
  const longterm = takeSpread(farList, 3, used, basisUse, (adjacent[0]?.total ?? 0) * 0.5);
  if (longterm.length < 2) longterm.push(...takeSpread(farList, 2 - longterm.length, used, basisUse));
  const roleReasons = new Set<string>();
  const roleMbti = (g: keyof typeof GROUP_KO) => { if (!mbti) return ""; const rs = mbtiFit(k, groupDims(k, g), mbti).reasons; const r = rs.find(x => !roleReasons.has(x)) ?? rs[0]; if (r) roleReasons.add(r); return r ? ` / MBTI: ${r}` : ""; };
  // 명리 근거와 MBTI 근거가 함께 있는 묶음만(MBTI가 있으면): 강한 묶음 → 그다음 묶음 순(P3.8 2).
  const groupsForRoles = [...new Set([...topG, ...(Object.entries(scores) as [keyof typeof GROUP_KO, number][]).sort((a, b) => b[1] - a[1]).filter(([, v]) => v >= 1.5).map(([g]) => g)])]
    .filter(g => !mbti || mbtiFit(k, groupDims(k, g), mbti).reasons.length).slice(0, 3);
  const roles = fit
    ? [...new Map(groupsForRoles.map(g => [fit.grow[g], g])).entries()].slice(0, 3).map(([role, g]) => `${role} — 명리: 강한 ${GROUP_KO[g]}${roleMbti(g)}`)
    : groupsForRoles.slice(0, 2).map(g => `${ROLE_BY_GROUP[g]} — 명리: 강한 ${GROUP_KO[g]}${roleMbti(g)}`);
  const inv = investment(d, scores, saju.structureAnalysis.dayMasterStrength.level, yearTg);
  // 줄마다 같은 틀("A는 ~과 ~이 함께 쓰이는 일이에요")이 9번 되풀이됐다(P6): 문장 모양을 줄마다 바꾸게 한다.
  const lineNote = "줄마다 직무 하나, 명리·MBTI 근거를 함께 쓰되 문장 모양은 줄마다 다르게(그 일의 한 장면으로·지금 일과 견주어·근거부터). 지금 직업을 바꾸라고 단정하지 않는다";
  // 직업 소품은 목록이 아니라 장면 하나(P6: "하루는 A, B, C, D, E로 채워져요"가 그대로 나왔다). 같은 직업군이어도 고객마다 다르게.
  const prop = job ? job.props[[...detailJob].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7) % Math.min(5, job.props.length)] : undefined;
  return {
    jobFit: { kind: "evidence", key: "jobFit", facts: [
      // 숫자는 주지 않는다(작가가 그대로 옮기고, 문장 나누기에서 "1.9"가 "1. 9"로 쪼개졌다).
      `강한 십성 묶음: ${top.map(([g]) => GROUP_KO[g]).join(" · ")}`,
      ...top.map(([g]) => `어울리는 판: ${ROLE_BY_GROUP[g]}`),
      `입력 직업: ${detailJob || "없음"}${JOB_STATUS_KO[jobStatus] ? ` (${JOB_STATUS_KO[jobStatus]})` : ""}`,
    ], note: "위 판과 입력 직업이 겹치는 지점을 짚는다" },
    jobRoles: { kind: "evidence", key: "jobRoles", facts: [`${detailJob ? `지금 자리(${detailJob})` : "지금 하는 일"}에서 넓힐 역할`, ...roles], note: lineNote },
    ...(adjacent.length ? { jobAdjacent: { kind: "evidence" as const, key: "jobAdjacent", facts: ["옮겨 갈 만한 가까운 직무(지금 일에서 쓰던 힘을 그대로 가져가는 쪽)", ...adjacent.map(jobLine)], note: lineNote } } : {}),
    ...(longterm.length ? { jobLongterm: { kind: "evidence" as const, key: "jobLongterm", facts: ["길게 보면 열려 있는 다른 길(준비 기간이 필요한 쪽)", ...longterm.map(jobLine)], note: lineNote } } : {}),
    // 지금 직업 해설(P3.6 B): 입력 직업이 있으면 그 직업의 일상 소품과 강한 판을 함께 준다. 키울 역할은 jobRoles에만(같은 말 반복 방지).
    currentJob: { kind: "evidence", key: "currentJob", facts: detailJob ? [
      `지금 직업: ${detailJob}`,
      ...(prop ? [`이 직업의 장면 소품: ${prop}`] : []),
      // 강한 십성 묶음은 jobFit 한 곳에서만 말한다(P3.8 r1: 근거 다섯 곳이 '식상·비겁이 강하다'를 되풀이).
      ...(fit && fitLevel ? [`지금 직업 적합도: ${fitLevel} — 이 일이 주로 쓰는 힘은 ${fit.groups.map(g => GROUP_KO[g]).join("·")}(앞 장의 강한 힘과 견준다)`] : [`이 사주가 지금 일에서 쓰이는 곳: ${ROLE_BY_GROUP[top[0][0]]}`]),
    ] : ["입력 직업 없음"], note: detailJob ? "적합도와 이유, 이 일에서 타고난 힘이 빛나는 장면 하나(소품은 그 장면에만), 덜 맞는 지점 하나. 직업 분류 이름·하루 일과 목록은 쓰지 않는다" : "지금 직업을 지어내지 않는다. 강한 판에서 어울리는 일만 쓴다" },
    studyFit: { kind: "evidence", key: "studyFit", facts: top.map(([g]) => `맞는 공부 방식: ${STUDY_BY_GROUP[g]}`), note: "합격·성적은 단정하지 않는다. 강한 힘의 설명은 다시 하지 않는다" },
    studyPick: { kind: "evidence", key: "studyPick", facts: [...new Set([
      ...(fit && detailJob ? [`지금 일(${detailJob})과 이어지는 공부: ${STUDY_EXAMPLES[fit.groups[0]]}`] : []),
      ...(!fit || fit.groups[0] !== topG[0] ? [`더 넓혀 볼 공부: ${STUDY_EXAMPLES[topG[0]]}`] : topG[1] ? [`더 넓혀 볼 공부: ${STUDY_EXAMPLES[topG[1]]}`] : []),
    ])], note: "합격·성적은 단정하지 않는다. 괄호 속 예는 하나만 골라 쓴다(나열하지 않는다)" },
    earnStyle: { kind: "evidence", key: "earnStyle", facts: [
      // 숫자는 주지 않는다(작가가 그대로 옮김). 둘 다 옅거나 비슷하면 유형을 붙이지 않는다(P3.6 B).
      `돈 버는 방식: ${Math.max(d.正財 ?? 0, d.偏財 ?? 0) < 0.5 ? "돈 기운(재성)이 옅어, 큰 판을 굴리기보다 일한 만큼 받는 구조에서 돈이 남는 쪽" : Math.abs((d.正財 ?? 0) - (d.偏財 ?? 0)) < 0.3 ? "고정 수입과 성과형 수입을 함께 굴리는 쪽(어느 한쪽으로 기울지 않음)" : (d.正財 ?? 0) > (d.偏財 ?? 0) ? "고정 수입을 차곡차곡 쌓을 때 돈이 남는 쪽(정재형)" : "성과·부업·기회를 크게 굴릴 때 돈이 붙는 쪽(편재형)"}`,
    ] },
    moneyLeak: { kind: "evidence", key: "moneyLeak", facts: inv.leak.length ? inv.leak : [`올해 ${josa(chart.thisYear.tenGod, "이가")} 들어오는 해의 돈 주의: ${(period ? dropSourceSentences(period.year.caution) : undefined) ?? "큰 지출은 하루 미뤄 다시 본다"}`] },
    investment: { kind: "evidence", key: "investment", facts: [
      `올해 ${chart.thisYear.ganji.hanja}(${chart.thisYear.ganji.hangul}): ${josa(chart.thisYear.tenGod, "이가")} 들어오는 해(돈의 주의는 '새는 곳'에서 한 번만)`,
      // '새는 곳'이 올해 주의 문장을 쓰면(버릇 줄이 없으면) 올해 줄을 여기서 다시 쓰지 않는다.
      ...inv.invest.filter(x => inv.leak.length || !x.startsWith("올해는")),
    ], note: "방식 수준으로만 쓴다: 특정 종목·시점·액수·수익률은 말하지 않는다" },
  };
}
