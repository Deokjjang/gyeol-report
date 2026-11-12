/**
 * 대운 「앞으로의 나」 전용 설계기(AM 3부). 엔진(대운·세운 계산)과 지식 DB(major-mind·major-domain·mbti-growth)에서 만든 결정론 근거.
 * - 평생 대운 지도: 대운마다 시작 만 나이(대운수 규칙, labels.dayunLabel 그대로)·연도·간지·십성·한 줄 주제.
 * - 앞으로 10년 핵심 해 3개(결정론): 원국 날·달 자리와의 합·충·형(가장 무거움) + 대운 전환 해 + 그 해 기둥과 대운 기둥의 관계·겹침 + 흐름 세기 쏠림.
 *   핵심 해마다 근거 배지(reasons)를 단다. 나머지 7개 해는 짧게.
 */
import { detectRelations, getAnnualPillar, natalEntries } from "@/lib/saju/detections";
import type { CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { getTenGod } from "@/lib/saju/tenGods";
import type { Pillar, SajuCalcResult, TenGod } from "@/lib/saju/types";
import type { DayunInfo } from "../chart";
import { deepLines, type Knowledge } from "../knowledge";
import { dayunLabel, FLOW_WORD, ganjiLabel, HALF_HAP_PLAIN, halfHapLine, REL_PLAIN, TEN_GOD_GROUP, tenGodLabel } from "../labels";
import type { Material, TimelineEntry } from "../schema";
import { DOMAIN_BY_TEN_GOD } from "../productEvidence";
import type { Rng } from "../seed";

type Evidence = Extract<Material, { kind: "evidence" }>;
type Group = "PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE";
const GROUP_THEME: Readonly<Record<Group, string>> = { PEER: "내 이름으로 서는 10년", OUTPUT: "재능을 밖으로 꺼내는 10년", WEALTH: "성과와 돈을 다루는 10년", OFFICER: "책임과 자리를 갖추는 10년", RESOURCE: "배우고 채우는 10년" };
const groupOfTg = (tg: TenGod) => TEN_GOD_GROUP[tg] as Group;
const ev = (key: string, facts: readonly (string | false | null | undefined)[], note?: string): Evidence | null => { const f = facts.filter((x): x is string => Boolean(x)); return f.length ? { kind: "evidence", key, facts: f, ...(note ? { note } : {}) } : null; };

export type LifetimeCycle = { readonly ganji: string; readonly hanja: string; readonly startYear: number; readonly endYear: number; readonly ages: string; readonly tenGod: string; readonly theme: string; readonly current: boolean; readonly label: string };
/** 평생 대운 지도(엔진 대운 목록 전부, 표기는 공통 함수). */
/** 평생 지도에 싣는 대운(AM2-3 1-7: 카드 「N개 대운」과 화면 칸 수를 맞춘다 — 시작 나이 만 100세 전까지. 엔진 대운 계산은 그대로). */
export const LIFETIME_MAX_START_AGE = 100;
export function lifetimeMap(saju: SajuCalcResult, dayun: DayunInfo, thisYear: number): LifetimeCycle[] {
  return dayun.cycles.filter(c => dayunLabel(c, dayun.daeunsu, dayun.cycles.find(x => x.index === c.index + 1)).daeunsu + 10 * (c.index - 1) < LIFETIME_MAX_START_AGE).map(c => {
    const l = dayunLabel(c, dayun.daeunsu, dayun.cycles.find(x => x.index === c.index + 1));
    const tg = getTenGod(saju.dayMaster, c.stem);
    return { ganji: ganjiLabel(c), hanja: `${c.stem}${c.branch}`, startYear: c.startYear, endYear: c.endYear, ages: l.ages, tenGod: tenGodLabel(tg), theme: GROUP_THEME[groupOfTg(tg)], current: c.startYear <= thisYear && thisYear <= c.endYear, label: l.line };
  });
}

/** 앞으로 10년 핵심 해 3개(결정론). 점수 = 날 자리 충·합·형 3 / 달 자리 2 / 대운 전환 3 / 세운×대운 충·합 2·같은 땅 글자 1 / 흐름 세기 쏠림(|세기−3|). */
export function keyYears(saju: SajuCalcResult, future: readonly TimelineEntry[], cycles: readonly CustomerDayunCycle[]): Map<string, { rank: number; reasons: string[] }> {
  const scored = future.map(e => {
    const y = Number(e.key), p = getAnnualPillar(y), reasons: string[] = []; let score = 0;
    for (const b of e.badges) {
      const w = b.with ?? "";
      if (/CHUNG|HYEONG|YUKHAP|STEM_HAP|SAMHAP/.test(b.kind) && /태어난 날/.test(w)) { score += 3; reasons.push(`태어난 날 자리와 ${b.label}`); }
      else if (/CHUNG|HYEONG|YUKHAP|SAMHAP|PA/.test(b.kind) && /태어난 달/.test(w)) { score += 2; reasons.push(`태어난 달(일터) 자리와 ${b.label}`); }
    }
    if (e.dayun?.transition) { score += 3; reasons.push(`새 대운(${e.dayun.ganji}) 시작`); }
    const cyc = cycles.find(c => c.startYear <= y && y <= c.endYear);
    if (cyc) {
      const dp: Pillar = { stem: cyc.stem, branch: cyc.branch };
      const rel = detectRelations([{ position: "dayun", pillar: dp }, { position: "annual", pillar: p }]).filter(r => ["CHUNG", "YUKHAP", "STEM_HAP", "STEM_CHUNG"].includes(r.kind));
      if (rel.length) { score += 2; reasons.push(`그 해와 대운 기둥 사이 ${rel.map(r => (REL_PLAIN[r.kind] ?? r.kind).split("(")[0]).join("·")}`); }
      if (dp.branch === p.branch) { score += 1; reasons.push("대운과 같은 땅 글자가 겹쳐 그 기운이 짙어짐"); }
    }
    if (Math.abs(e.flow.score - 3) >= 2) { score += Math.abs(e.flow.score - 3) - 1; reasons.push(`흐름이 ${FLOW_WORD[e.flow.score]}인 해`); }
    return { key: e.key, score, reasons };
  });
  const top = [...scored].filter(x => x.reasons.length).sort((a, b) => b.score - a.score || a.key.localeCompare(b.key)).slice(0, 3);
  // 근거가 셋이 안 되면 흐름 세기 높은 해로 채운다(근거 배지는 흐름 세기).
  for (const e of [...future].sort((a, b) => b.flow.score - a.flow.score || a.key.localeCompare(b.key))) { if (top.length >= 3) break; if (!top.some(t => t.key === e.key)) top.push({ key: e.key, score: 0, reasons: [`흐름이 ${FLOW_WORD[e.flow.score]}인 해`] }); }
  return new Map(top.sort((a, b) => a.key.localeCompare(b.key)).map((x, i) => [x.key, { rank: i + 1, reasons: x.reasons.slice(0, 3) }]));
}

export type MajorCtx = {
  readonly saju: SajuCalcResult; readonly k: Knowledge; readonly dayun: DayunInfo; readonly thisYear: number; readonly age: number; readonly birthYear: number;
  readonly entries: readonly TimelineEntry[]; readonly mbti: string | null; readonly rng: Rng;
  readonly currentLabel?: string; readonly nextLabel?: string; readonly nextStart?: string;
};
const AGE_FACET = (age: number) => (age < 30 ? "twenties" : age < 40 ? "thirties" : age < 50 ? "forties" : "fifties");

export function majorEvidence(c: MajorCtx): Record<string, Evidence> {
  const life = lifetimeMap(c.saju, c.dayun, c.thisYear);
  const curI = life.findIndex(x => x.current), cur = life[curI], next = life[curI + 1], prev = life[curI - 1];
  const tgOf = (label: string) => label.match(/\((.+)\)/)?.[1] as TenGod | undefined;
  const gCur = cur && tgOf(cur.tenGod) ? groupOfTg(tgOf(cur.tenGod)!) : undefined, gNext = next && tgOf(next.tenGod) ? groupOfTg(tgOf(next.tenGod)!) : undefined;
  const pick = (lines: readonly string[], n: number, label: string) => { const r = c.rng.fork(label), pool = [...lines], out: string[] = []; while (pool.length && out.length < n) out.push(pool.splice(r.int(pool.length), 1)[0]); return out; };
  const mind = (g: Group | undefined, facet: string, n = 1) => (g ? pick(deepLines(c.k, "major-mind", `group:${g}`, facet), n, `mind:${g}:${facet}`) : []);
  const dom = (g: Group | undefined, facet: string, n = 2) => (g ? pick(deepLines(c.k, "major-domain", `group:${g}`, facet), n, `dom:${g}:${facet}`) : []);
  const past = c.entries.filter(e => e.period === "past"), future = c.entries.filter(e => Number(e.key) > c.thisYear);
  const pastCycles = [...new Set(past.map(e => e.dayun?.ganji).filter(Boolean))];
  const ageAt = (y: number) => y - c.birthYear;
  const growth = (facet: string, n = 1) => (c.mbti ? pick(deepLines(c.k, "mbti-growth", `mbti:${c.mbti}`, facet), n, `gr:${facet}`) : []);
  const futureAge = AGE_FACET(c.age + 10), nowAge = AGE_FACET(c.age);
  const curMid = cur ? Number(cur.ages.match(/(\d+)~(\d+)/)?.[1] ?? c.age) + 5 : c.age;
  const near = future.slice(0, 3), mid = future.find(e => Number(e.key) === c.thisYear + 5), far = future.at(-1);
  const yearTg = (e?: TimelineEntry) => (e ? tgOf(e.tenGod.stem) : undefined);
  const line = (e: TimelineEntry | undefined) => { const tg = yearTg(e); return e && tg ? `${e.key}년(만 ${ageAt(Number(e.key))}세 무렵) ${e.tenGod.stem}: 일 = ${DOMAIN_BY_TEN_GOD[tg][0]}` : ""; };
  const out: Record<string, Evidence | null> = {
    dayunHow: ev("dayunHow", ["대운: 타고난 달 기둥에서 10년마다 한 칸씩 움직이는 큰 흐름(그 10년의 하늘 글자 십성이 주제)", "세운: 해마다 들어오는 기운 — 대운이 계절이라면 세운은 그해 날씨", cur ? `이 책의 지도: ${life.length}개 대운, 내가 서 있는 대운은 ${cur.label}` : ""], "짧게 한 소제목: 대운과 세운의 관계를 쉬운 그림 하나로"),
    lifetime: ev("lifetime", life.map(x => `${x.label} · ${x.tenGod} — ${x.theme}${x.current ? " (내가 서 있는 대운)" : ""}`), "평생 지도에서 큰 줄기(이어지는 주제, 꺾이는 곳) 두세 개만 짚는다. 표는 화면이 보여 주니 전부 나열하지 않는다"),
    pastSummary: ev("pastSummary", [`지난 세 해: ${past.map(e => `${e.key}년 ${e.ganji.hangul} ${e.tenGod.stem}`).join(" → ")}`, pastCycles.length ? `그 시기 대운: ${pastCycles.join(" → ")}` : ""], "지난 일을 겪었다고 단정하지 않는다. '~했다면'·질문형으로, 세 해를 하나의 흐름으로"),
    pastDayun: ev("pastDayun", [prev && past.some(e => e.dayun?.ganji !== cur?.ganji + " 대운") ? `지난 대운: ${prev.label} · ${prev.tenGod}` : "", ...mind(gCur, "enter", 1)], "그 시기를 지나며 남은 힘(태도·습관)을 조건형으로"),
    nowTheme: cur ? ev("nowTheme", [`내가 서 있는 대운: ${cur.label} · ${cur.tenGod} — ${cur.theme}`, ...mind(gCur, "inside", 2), ...dom(gCur, "work", 1)], "주제를 한 줄로 먼저, 그 10년의 태도 둘") : null,
    nowRelation: cur ? ev("nowRelation", relationsWithNatal(c.saju, c.k, { stem: cur.hanja[0] as Pillar["stem"], branch: cur.hanja[1] as Pillar["branch"] }), "원국 자리와 이 대운 기둥의 관계만(없으면 '부딪힘 없이 이어지는 쪽'). 충=나쁨·합=좋음 단정 금지") : null,
    nowCards: cur ? ev("nowCards", [`좋은 패: ${dom(gCur, "money", 1)[0] ?? ""}`, `숙제: ${mind(gCur, "leave", 1)[0] ?? ""}`], "좋은 패와 숙제를 한 쌍으로") : null,
    turnWhen: next ? ev("turnWhen", [`다음 대운: ${next.label} · ${next.tenGod} — ${next.theme}`, `교운기: ${next.startYear - 1}~${next.startYear + 1}년 무렵(앞뒤 1~2년)`, c.dayun.error ? "출생 시각 미상이라 교운 연·월은 범위로만" : ""], c.dayun.error ? "경계 연도는 범위로만 쓴다(단서·면책 문장 없이)" : "교운 연·월은 엔진 값 그대로") : null,
    turnMind: gCur && gNext ? ev("turnMind", [...mind(gCur, `to:${gNext}`, 1), ...mind(gNext, "enter", 1), ...mind(gCur, "leave", 1)], "바뀌기 전 정리할 것 → 바뀐 뒤 마음가짐 순서로") : null,
    mapWorkMoney: ev("mapWorkMoney", [...dom(gCur, "work", 2), ...dom(gNext, "work", 1), ...dom(gCur, "money", 1), ...dom(gNext, "money", 1)], "이 대운 → 다음 대운으로 이어지게, 영역마다 장면 하나"),
    mapLovePeople: ev("mapLovePeople", [...dom(gCur, "love", 1), ...dom(gNext, "love", 1), ...dom(gCur, "people", 1), ...dom(gNext, "people", 1)], "사랑·결혼·가족은 조건형('함께하는 사람이 있다면'). 결혼 시기를 쓰지 않는다"),
    mapMindMove: ev("mapMindMove", [...dom(gCur, "mind", 1), ...dom(gNext, "mind", 1), ...dom(gCur, "move", 1), ...dom(gNext, "move", 1)], "마음·컨디션은 병명·증상 없이 생활 장면으로, 이동·거주는 '~하기 쉬운 해'처럼(단서·면책 문장 없이 — 책 끝에 시스템이 한 번 넣는다)"),
    growthCurve: c.mbti ? ev("growthCurve", [...growth("order", 1), ...growth(nowAge, 2), ...(futureAge !== nowAge ? growth(futureAge, 1) : [])], "MBTI 발달은 경향이다(나이에 맞춰 반드시 그렇게 된다고 쓰지 않는다)") : null,
    // AM2-3 2-2(P2 판독 major-1 P3 「다음 대운 주제」·P4 B5 문구 복사): 짝의 이유는 「이 대운 10년과 같은 나이대에 성격 쪽에서 자라는 것」 — 둘 다 엔진·지식 DB 값(나이 구간)이라 지어낸 인과가 아니다.
    growthDayun: c.mbti && cur ? ev("growthDayun", [`이 대운 주제: ${cur.theme}`, ...growth(AGE_FACET(curMid), 1).map(g => `${cur.label.split(":")[0]} 10년(${cur.ages})과 같은 나이대에 성격으로는 ${g}`)], "명리 × MBTI: 같은 나이대에 겹치는 두 흐름을 나란히") : null,
    // AM2-3 1-7: MBTI 미입력이면 7장은 명리만으로 쓰는 대체 장 「나이와 함께 자라는 결」(MBTI 문장 0).
    ageGrowth: !c.mbti && cur ? ev("ageGrowth", [`이 대운: ${cur.label} · ${cur.ages} — ${cur.theme}`, ...mind(gCur, "inside", 1), ...mind(gCur, "leave", 1)], "나이와 함께 단단해지는 쪽을 생활 장면으로") : null,
    ageNext: !c.mbti && next ? ev("ageNext", [`다음 대운: ${next.label} · ${next.ages} — ${next.theme}`, ...mind(gNext, "inside", 1), ...dom(gNext, "mind", 1)], "다음 10년에 새로 자라는 쪽을 조건형으로") : null,
    planNear: ev("planNear", [`이 책을 쓴 ${c.thisYear}년 무렵: ${cur?.theme ?? ""}`, ...near.map(line)], "가까운 1년 / 2~3년 뒤를 각각 행동 하나로"),
    planFar: ev("planFar", [mid ? `5년 뒤: ${line(mid)}` : "", far ? `10년 뒤: ${line(far)}` : "", next ? `그 무렵 대운: ${next.label}` : ""], "5년 뒤 / 10년 뒤를 각각 준비 하나로. 일어날 사건 대신 준비할 것을 쓴다(단서·면책 문장 없이)"),
  };
  return Object.fromEntries(Object.entries(out).filter((x): x is [string, Evidence] => Boolean(x[1])));
}

/** 대운 기둥과 원국 자리 관계(쉬운 줄). */
function relationsWithNatal(saju: SajuCalcResult, k: Knowledge, dp: Pillar): string[] {
  const natal = natalEntries(saju);
  const seat = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as const;
  return detectRelations([...natal, { position: "dayun", pillar: dp }]).filter(r => r.members.some(m => m.position === "dayun") && REL_PLAIN[r.kind])
    // AM2 P2 판독(major-1 3장): 관계 이름만 주면 작가가 뜻을 지어낸다(반합에 「사람 사이」 뜻) → 지식 DB 배지 뜻을 함께(반합은 「반쯤 묶여」 꼴).
    .slice(0, 3).map(r => { const pairs = [r.key, [...r.key].reverse().join("")], b = k.badges.find(x => x.kind === r.kind && x.pair !== undefined && pairs.includes(x.pair)) ?? k.badges.find(x => x.kind === r.kind && x.pair === undefined);
      // 삼형 세 글자 중 두 글자만 만난 형은 일반 형 풀이(「세 땅이 서로 눌러」는 세 글자일 때 말 — 타임라인 카드와 같은 원리).
      const twoHyeong = r.kind === "HYEONG" && r.completeness === "partial" && [...r.key].length === 3, plain = twoHyeong ? k.badges.find(x => x.kind === "HYEONG" && x.pair === undefined) : undefined;
      const half = r.kind === "SAMHAP" && r.completeness !== "full", src = plain ?? b, mean = (src?.line ? (half ? halfHapLine(src.line) : src.line) : "").replace(/ (해|달)$/, " 흐름");
      return `이 대운 기둥과 ${[...new Set(r.members.filter(m => m.position !== "dayun").map(m => seat[m.position as keyof typeof seat]).filter(Boolean))].join("·")} 자리: ${half ? HALF_HAP_PLAIN : REL_PLAIN[r.kind]}${mean ? ` — ${mean}` : ""}`; });
  // AM 재생성 판독(major-1 3장): 丑·巳 두 글자(반합)를 「삼합(세 글자가 한 기운으로 모임)」으로 줘서 작가가 그대로 썼다 → 반합 풀이.
}

/** 앞으로 10년 연도 key 근거: 핵심 해는 깊게(근거 배지), 나머지는 짧게. */
export function decadeKeyEvidence(e: TimelineEntry, key: { rank: number; reasons: string[] } | undefined): Evidence {
  return key
    ? { kind: "evidence", key: `depth:${e.key}`, facts: [`핵심 해 ${key.rank}: ${key.reasons.join(" · ")}`], note: "깊게: 문단 3개, 근거 배지마다 생활 장면 하나. 사건 대신 흐름과 장면으로(단서·면책 문장 없이)" }
    : { kind: "evidence", key: `depth:${e.key}`, facts: ["짧게 읽는 해: 흐름 한 가지만"], note: "짧게: 문단 2개(그해 기운 한 문단, 할 일 한 문단), 카드 줄은 그대로" };
}
