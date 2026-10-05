import type { MajorEvidence } from "./majorEvidence";
import type { AnnualEvidence, AnnualMonthEvidence } from "./annualEvidence";

export type PeriodImportance = "HIGH" | "MEDIUM" | "BACKGROUND";
/** Relative reading priority only. No good/bad luck score is calculated. */
export function planMajorYears(e: MajorEvidence) {
  const ranked = e.years.map(y => {
    const relations = [...y.annual.natalRelations, ...y.annual.cycleRelations];
    const transition = e.horizon.transitions.some(t => t.year === y.year);
    const tension = relations.filter(r => ["충", "형", "파", "해"].includes(r.type));
    const harmony = relations.filter(r => ["삼합", "육합", "반합"].includes(r.type));
    const aligned = y.cycle.tenGod === y.annual.tenGod;
    return { year: y.year, priority: (transition ? 12 : 0) + (y.timePosition === "current" ? 8 : 0) + Math.min(4, tension.length * 2) + Math.min(2, harmony.length) + Number(aligned),
      reasons: [...(transition ? ["DAYUN_TRANSITION"] : []), ...(y.timePosition === "current" ? ["CURRENT_YEAR"] : []), ...(tension.length ? ["CANONICAL_TENSION"] : []), ...(harmony.length ? ["CANONICAL_HARMONY"] : []), ...(aligned ? ["SAME_TEN_GOD"] : [])],
      sourceRefs: [...y.annual.evidenceIds] };
  }).sort((a, b) => b.priority - a.priority || a.year - b.year);
  const high = new Set(ranked.filter(y => y.priority >= 4).slice(0, 4).map(y => y.year));
  return e.years.map(y => { const row = ranked.find(r => r.year === y.year)!; return { ...row,
    importance: (high.has(y.year) ? "HIGH" : row.priority >= 3 ? "MEDIUM" : "BACKGROUND") as PeriodImportance }; });
}

export function planAnnualMonths(e: AnnualEvidence) {
  const candidates = e.months.map(m => {
    const confirmed = m.focus.relationFacts.filter(f => f.certainty === "confirmed");
    const tensions = confirmed.filter(f => ["충", "형", "파", "해", "원진"].includes(f.type));
    const harmonies = confirmed.filter(f => ["육합", "삼합", "반합"].includes(f.type));
    const gifts = m.transit.accepted.filter(f => /gwiin|dohwa|hongyeom|jangseong|banan/.test(f.feature));
    return { month: m.month, current: m.time === "current", priority: (m.time === "current" ? 20 : 0) + Math.min(4, tensions.length * 2) + Math.min(3, gifts.length) + Math.min(2, harmonies.length),
      tone: tensions.length >= 2 ? "careful" as const : harmonies.length || gifts.length ? "supported" as const : "prepare" as const,
      reasons: [...(tensions.length ? ["CONFIRMED_RELATION_TENSION"] : []), ...(gifts.length ? ["CALCULATED_MONTH_GIFT"] : []), ...(harmonies.length ? ["CONFIRMED_RELATION_HARMONY"] : [])],
      sourceRefs: m.sourceRefs };
  });
  const focus = new Set([...candidates].sort((a, b) => b.priority - a.priority || a.month - b.month).slice(0, 3).map(m => m.month));
  return candidates.map(m => ({ ...m, importance: (m.current || focus.has(m.month) ? "HIGH" : "MEDIUM") as PeriodImportance,
    depth: (m.current ? "current" : e.months[m.month - 1].time === "past" && !focus.has(m.month) ? "brief" : "standard") as "current" | "brief" | "standard",
    mbtiEligible: focus.has(m.month) }));
}

export function annualYearMap(e: AnnualEvidence) {
  const plans = planAnnualMonths(e);
  const groups = [
    { label: "돈과 내 몫", gods: ["편재", "정재"], tags: ["jaego", "amrok"] },
    { label: "일과 자리", gods: ["정관", "편관"], tags: ["jangseong", "banan"] },
    { label: "표현과 매력", gods: ["식신", "상관"], tags: ["dohwa", "hongyeom"] },
    { label: "사람의 도움", gods: [], tags: ["cheoneul", "cheondeok", "woldeok"] },
    { label: "배우고 준비", gods: ["정인", "편인"], tags: ["munchang", "hakdang"] },
  ];
  return [...groups.map(g => ({ label: g.label, months: e.months.filter(m => g.gods.includes(m.focus.stemTenGod) || m.transit.accepted.some(f => g.tags.some(t => f.feature.includes(t)))).map(m => m.month) })),
    { label: "속도를 살필 달", months: plans.filter(p => p.tone === "careful").map(p => p.month) }].filter(g => g.months.length);
}

/** Keeps the entire canonical segment ledger. The displayed focus is allowed
 * to be the previous Jie month until the actual boundary has passed. */
export function monthBoundaryDescription(m: AnnualMonthEvidence) {
  const distinct = [...new Set(m.segments.map(s => s.monthPillar.stem + s.monthPillar.branch))];
  const next = m.segments.find(s => s.monthPillar.stem + s.monthPillar.branch !== distinct[0]);
  return { label: `${m.month}월 운 · 절기 기준`, explanation: next
    ? `${m.month}월 ${Number(next.startKst.slice(8, 10))}일 절기 전후로 ${distinct[0]}에서 ${next.monthPillar.stem}${next.monthPillar.branch}로 바뀝니다. 달력의 1일에 명리월이 바뀌는 것은 아니에요.`
    : "이 달은 표시된 절기 구간의 흐름으로 읽습니다.",
    segments: m.segments.map(s => ({ start: s.startKst, end: s.endKstExclusive, ganji: s.monthPillar.stem + s.monthPillar.branch })) };
}

export function friendlyTransition(label: string) {
  const dates = label.match(/\d{4}-\d{2}-\d{2}/g);
  if (!dates?.length) return label;
  const season = (date: string) => { const month = Number(date.slice(5, 7)); return month <= 2 || month === 12 ? "겨울" : month <= 5 ? "봄" : month <= 8 ? "여름" : "가을"; };
  if (dates.length === 1) return `${dates[0].slice(0, 4)}년 ${Number(dates[0].slice(5, 7))}월 ${Number(dates[0].slice(8, 10))}일 무렵`;
  const first = dates[0], last = dates.at(-1)!;
  return `${first.slice(0, 4)}년 ${season(first)}${season(first) !== season(last) || first.slice(0, 4) !== last.slice(0, 4) ? `~${first.slice(0, 4) !== last.slice(0, 4) ? `${last.slice(0, 4)}년 ` : ""}${season(last)}` : ""} 무렵`;
}
