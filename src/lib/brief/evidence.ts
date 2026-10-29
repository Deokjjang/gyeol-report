/**
 * 상품별 필수 근거(SPEC §2).
 * 연애: 배우자성(남=재성, 여=관성)·배우자궁(일지), 자녀성(남=관성, 여=식상)·자녀궁(시지, 시간 미상이면 유보), 잘 맞는 상대(부족 오행 보완 + MBTI 통념), 만남 장소.
 * 커리어: 직업·역할 추천 근거(강한 십성 묶음 + MBTI 통념 직업 + 입력 직업), 올해 기운이 돈·재산 흐름에 주는 영향(투자 지시 아님).
 */
import { matchJob } from "./props";
import type { MbtiProfile, SceneItem } from "@/data/knowledge-v5/schema";
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
const ROLE_BY_GROUP = {
  PEER: "혼자 판을 짜고 내 이름으로 책임지는 일(독립 업무·개인 브랜드·현장 리더)",
  OUTPUT: "만들고 말해서 결과물을 내는 일(기획·콘텐츠·디자인·강의)",
  WEALTH: "숫자와 결과를 다루며 자원을 굴리는 일(영업·운영·재무·유통)",
  OFFICER: "규칙과 책임이 분명한 조직의 일(관리·공공·품질·법무)",
  RESOURCE: "배우고 정리해서 남에게 전하는 일(연구·분석·교육·상담)",
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
function loveSignals(saju: SajuCalcResult, hitIds: ReadonlySet<string>, k: Knowledge, mbti: MbtiProfile | null, facts: FactProfile, usedScenes: Set<string>, aspects: readonly (keyof typeof ASPECT_KO)[], key: string): Evidence | null {
  const d = saju.tenGods.distribution as Partial<Record<TenGod, number>>;
  const tenGods = (Object.keys(TEN_GOD_KO) as TenGod[]).filter(t => (d[t] ?? 0) > 0).sort((a, b) => (d[b] ?? 0) - (d[a] ?? 0) || a.localeCompare(b)).slice(0, 2);
  const keys = [...["shinsal:DOHWASAL", "shinsal:HONGYEOMSAL"].filter(x => hitIds.has(x)), ...tenGods.map(t => `tenGod:${t}`), ...(mbti ? [`mbti:${mbti.type}`] : [])];
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

export function loveEvidence(saju: SajuCalcResult, det: ChartDetections, k: Knowledge, gender: "MALE" | "FEMALE" | null, st: ElementState, mbti: MbtiProfile | null, signals?: { hitIds: ReadonlySet<string>; facts: FactProfile; usedScenes: Set<string> }): Record<string, Evidence> {
  const sig = signals ? { loveSignals: loveSignals(saju, signals.hitIds, k, mbti, signals.facts, signals.usedScenes, ["crush", "contact"], "loveSignals"), pushPull: loveSignals(saju, signals.hitIds, k, mbti, signals.facts, signals.usedScenes, ["pushPull"], "pushPull") } : {};
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

/**
 * 구체 직무 추천(P3.7 1-4): 이 고객의 trait(십성·직업 신살·귀인) → 강한 십성 묶음 순으로 근거를 모아 근거마다 돌아가며 한 개씩, 10개(근거당 3개까지).
 * 줄마다 "직무명 — 근거 쉬운 이름: 이유 한 줄".
 */
function jobPicks(k: Knowledge, traits: readonly Trait[], top: readonly (keyof typeof GROUP_KO)[]): string[] {
  const titles = new Map(k.career.titles.map(t => [t.key, t.jobs]));
  const sources = [
    ...[...traits].sort((a, b) => b.score - a.score).flatMap(t => { const jobs = titles.get(t.featureId); return jobs ? [{ label: `${t.easyName}(${t.name.replace(/\(.*?\)/g, "").replace(/·.*$/, "").trim()})`, jobs }] : []; }),
    ...top.flatMap(g => { const jobs = titles.get(`group:${g}`); return jobs ? [{ label: GROUP_KO[g], jobs }] : []; }),
  ];
  const out: string[] = [], seen = new Set<string>(), taken = sources.map(() => 0);
  for (let round = 0; round < 6 && out.length < 10; round++) sources.forEach((src, i) => {
    if (out.length >= 10 || taken[i] >= 3) return;
    const j = src.jobs.find(x => !seen.has(x.title)); if (!j) return;
    seen.add(j.title); taken[i]++; out.push(`${j.title} — ${src.label}: ${j.why}`);
  });
  return out;
}

/** 돈 굴리는 성향·원칙(P3.7 1-4): 재성의 결(정재·편재·옅음) × 강한 묶음의 버릇 × 올해 십성. 방식 수준만(종목·시점·액수 금지). */
function investment(d: Partial<Record<TenGod, number>>, scores: Record<string, number>, strength: string, yearTg: TenGod | undefined): string[] {
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
  const year = group === "WEALTH" ? "올해는 재물 기운이 들어와 기회가 많아 보이는 해: 한도를 먼저 정하고 움직인다"
    : group === "PEER" ? "올해는 같은 기운이 들어와 돈이 나가기 쉬운 해: 빌려주기·동업 제안은 천천히"
    : group === "OUTPUT" ? "올해는 버는 길이 늘어나는 해: 새로 생긴 수입은 들어온 날 일부를 적립으로 돌린다"
    : group === "OFFICER" ? "올해는 책임과 고정 지출이 붙기 쉬운 해: 고정 지출부터 한 번 점검한다"
    : group === "RESOURCE" ? "올해는 공부·준비의 해: 큰 결정보다 공부와 기록을 먼저 한다" : "";
  return [`돈 굴리는 성향: ${style.name}`, `운영 원칙: ${[...style.rules, "생활비 몇 달 치는 현금으로 따로 둔다"].join(" / ")}`, ...habit, ...(year ? [year] : [])];
}

export function careerEvidence(saju: SajuCalcResult, k: Knowledge, chart: ChartBrief, mbti: MbtiProfile | null, detailJob: string, jobStatus: string, traits: readonly Trait[] = []): Record<string, Evidence> {
  const scores = getTenGodGroupScores(saju.tenGods.distribution);
  const top = (Object.entries(scores) as [keyof typeof GROUP_KO, number][]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 2);
  const yearTg = chart.thisYear.tenGod.match(/\((.+)\)/)?.[1] as TenGod | undefined;
  const period = yearTg ? k.tenGodPeriod.get(yearTg) : undefined;
  const d = saju.tenGods.distribution as Partial<Record<TenGod, number>>;
  const job = matchJob(detailJob);
  const topG = top.map(([g]) => g);
  const fit = job ? k.career.fits.find(f => f.jobId === job.id) : undefined;
  const fitLevel = fit ? (fit.groups.includes(topG[0]) ? "잘 맞는 편" : fit.groups.some(g => topG.includes(g)) ? "절반쯤 맞는 편" : "다른 힘으로 하는 일(맞지 않는다는 뜻이 아니라 쓰는 근육이 다르다)") : null;
  const picks = jobPicks(k, traits, topG);
  return {
    ...(picks.length ? { jobPicks: { kind: "evidence" as const, key: "jobPicks", facts: picks, note: "추천 직무를 모두 쓰고 직무마다 근거 한 줄. 지금 직업을 바꾸라고 단정하지 않는다" } } : {}),
    jobFit: { kind: "evidence", key: "jobFit", facts: [
      `강한 십성 묶음: ${top.map(([g, v]) => `${GROUP_KO[g]} ${v.toFixed(1)}`).join(" · ")}`,
      ...top.map(([g]) => `어울리는 판: ${ROLE_BY_GROUP[g]}`),
      ...(mbti ? [`MBTI로 흔히 꼽는 직업: ${mbti.jobs.slice(0, 6).join(", ")}`] : []),
      `입력 직업: ${detailJob || "없음"}${jobStatus ? ` (${jobStatus})` : ""}`,
    ], note: "위 판과 입력 직업이 겹치는 지점을 짚는다" },
    // 지금 직업 해설(P3.6 B): 입력 직업이 있으면 그 직업의 일상 소품과 강한 판을 함께 준다.
    currentJob: { kind: "evidence", key: "currentJob", facts: detailJob ? [
      `지금 직업: ${detailJob}${job ? ` (직업군: ${job.name})` : ""}`,
      ...(job ? [`이 직업의 일상: ${job.props.slice(0, 5).join(", ")}`] : []),
      ...(fit && fitLevel ? [`지금 직업 적합도: ${fitLevel} — 이 일이 주로 쓰는 힘은 ${fit.groups.map(g => GROUP_KO[g]).join("·")}, 당신이 강한 힘은 ${topG.map(g => GROUP_KO[g]).join("·")}`, `이 일 안에서 키울 역할: ${fit.grow[topG[0]]}${topG[1] && fit.grow[topG[1]] !== fit.grow[topG[0]] ? ` / 그다음: ${fit.grow[topG[1]]}` : ""}`] : [`이 사주가 지금 일에서 쓰이는 곳: ${ROLE_BY_GROUP[top[0][0]]}`]),
    ] : ["입력 직업 없음"], note: detailJob ? "두 문단 이상: 적합도와 이유, 이 일에서 타고난 힘이 빛나는 장면 하나, 덜 맞는 지점 하나와 다루는 법, 키울 역할" : "지금 직업을 지어내지 않는다. 강한 판에서 어울리는 일만 쓴다" },
    studyFit: { kind: "evidence", key: "studyFit", facts: [
      ...top.map(([g]) => `맞는 공부 방식(${GROUP_KO[g]}): ${STUDY_BY_GROUP[g]}`),
      ...(fit && detailJob ? [`지금 일(${detailJob})과 이어지는 공부: ${STUDY_EXAMPLES[fit.groups[0]]}`] : []),
      `강한 힘에서 나온 공부: ${STUDY_EXAMPLES[topG[0]]}`,
    ], note: "합격·성적은 단정하지 않는다" },
    earnStyle: { kind: "evidence", key: "earnStyle", facts: [
      // 숫자는 주지 않는다(작가가 그대로 옮김). 둘 다 옅거나 비슷하면 유형을 붙이지 않는다(P3.6 B).
      `돈 버는 방식: ${Math.max(d.正財 ?? 0, d.偏財 ?? 0) < 0.5 ? "돈 기운(재성)이 옅어, 큰 판을 굴리기보다 일한 만큼 받는 구조에서 돈이 남는 쪽" : Math.abs((d.正財 ?? 0) - (d.偏財 ?? 0)) < 0.3 ? "고정 수입과 성과형 수입을 함께 굴리는 쪽(어느 한쪽으로 기울지 않음)" : (d.正財 ?? 0) > (d.偏財 ?? 0) ? "고정 수입을 차곡차곡 쌓을 때 돈이 남는 쪽(정재형)" : "성과·부업·기회를 크게 굴릴 때 돈이 붙는 쪽(편재형)"}`,
      ...(top.some(([g]) => g === "OUTPUT") ? ["만든 결과물이 그대로 돈이 되는 길이 열려 있다(표현하는 기운이 강함)"] : []),
    ] },
    investment: { kind: "evidence", key: "investment", facts: [
      `올해 ${chart.thisYear.ganji.hanja}(${chart.thisYear.ganji.hangul}): ${josa(chart.thisYear.tenGod, "이가")} 들어오는 해${period ? `. 주의: ${period.year.caution}` : ""}`,
      ...investment(d, scores, saju.structureAnalysis.dayMasterStrength.level, yearTg),
    ], note: "방식 수준으로만 쓴다: 특정 종목·시점·액수·수익률은 말하지 않는다" },
  };
}
