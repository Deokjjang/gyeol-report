import { withKoreanParticle as p } from "../report-knowledge/koreanCopyUtils";
import { MAJOR_MEANINGS } from "./majorMaterials";
import type { AnnualBranchInteraction } from "../report-knowledge/annualFortuneTypes";
import type { MajorEvidence, MajorYearEvidence } from "./majorEvidence";
import type { NarrativeBlock } from "./narrativeTypes";

const positions = { year: "연지", month: "월지", day: "일지", hour: "시지" } as const;
const harmonyTypes = ["육합", "삼합", "반합"];
type Scope = "cycle" | "natal";

/** Bind existing relations to their existing reason IDs. No relation detection,
 * new meanings, annual selection, or inference from ambiguous `plain` labels. */
export function majorInteractionReading(e: MajorEvidence, y: MajorYearEvidence) {
  const cycle = y.cycle;
  const prefix = `major:${cycle.index}:${cycle.ganji}:year:${y.year}:${y.annual.ganji}`;
  const validPeriod = y.annual.evidenceIds.includes(prefix);
  const natalActors = (r: AnnualBranchInteraction) => (r.affectedPillars ?? []).map(position => {
    const branch = e.calculation.pillars[position]?.branch;
    return branch && r.branches.includes(branch) ? `원국 ${positions[position]} ${branch}` : null;
  });
  const bind = (scope: Scope, r: AnnualBranchInteraction) => {
    const id = `${prefix}:${scope}:${r.type}:${r.branches.join("")}:${r.affectedPillars?.join("-") ?? "cycle"}`;
    const reason = y.annual.reasons.find(reason => reason.evidenceId === id && reason.kind === `${scope}-relation`);
    const meaning = reason?.text.split(": ")[1];
    const actors = scope === "cycle" ? [`대운 ${cycle.ganji}의 지지 ${cycle.ganji.slice(-1)}`] : natalActors(r);
    if (!validPeriod || !reason || !meaning || !y.annual.evidenceIds.includes(id)
      || !actors.length || actors.some(a => !a) || !r.branches.includes(y.annual.ganji.slice(-1) as typeof r.branches[number])
      || (scope === "cycle" && !r.branches.includes(cycle.ganji.slice(-1) as typeof r.branches[number]))) return null;
    return { scope, relation: r, id, meaning, actors: actors.join("·") };
  };
  const relations = [...y.annual.cycleRelations.map(r => bind("cycle", r)), ...y.annual.natalRelations.map(r => bind("natal", r))]
    .filter(r => r !== null);
  const harmony = relations.find(r => harmonyTypes.includes(r.relation.type));
  const tension = relations.find(r => ["충", "형"].includes(r.relation.type)) ?? relations.find(r => ["파", "해"].includes(r.relation.type));
  // Keep the existing lead relation; expose a co-occurring clash/punishment
  // on the same participants instead of silently discarding its distinct reason.
  const tensions = tension ? [tension, ...relations.filter(r => r !== tension && r.scope === tension.scope
    && ["충", "형"].includes(r.relation.type) && r.actors === tension.actors
    && [...r.relation.branches].sort().join("") === [...tension.relation.branches].sort().join(""))] : [];
  const transition = e.horizon.transitions.find(t => t.year === y.year);
  const describe = (r: NonNullable<ReturnType<typeof bind>>) =>
    `${y.year}년${transition && r.scope === "cycle" ? " 전환이 완료된 뒤의" : ""} ${r.actors}, ${y.annual.ganji}(${y.annual.tenGod}) 세운의 ${y.annual.ganji.slice(-1)} 사이의 ${r.relation.branches.join("·")} ${p(r.relation.type, "topic")} ${p(`‘${r.meaning}’`, "object")} ${y.annual.tenGod} 흐름과 함께 살펴볼 근거입니다.`;
  const timing = transition
    ? `${transition.dateLabel}을 경계로 ${transition.before.ganji}에서 ${p(`${transition.after.ganji} 대운`, "to")} 넘어갑니다. 이 해의 ${cycle.ganji}(${cycle.tenGod}) 대운과 세운 설명은 전환이 완료된 뒤의 흐름으로 읽어주세요.` : "";
  const background = validPeriod
    ? `${timing}${timing ? " " : ""}${y.year}년은 ${cycle.ganji} 대운의 ${cycle.tenGod}, ${y.annual.ganji} 세운의 ${p(y.annual.tenGod, "subject")} 만나는 해입니다. ${cycle.tenGod === y.annual.tenGod
      ? `장기 과제인 ${p(`‘${MAJOR_MEANINGS[cycle.tenGod].theme}’`, "object")} 같은 관점에서 다시 살펴볼 때예요.`
      : `큰 배경인 ‘${MAJOR_MEANINGS[cycle.tenGod].theme}’ 속에서 ${y.year}년에는 ‘${MAJOR_MEANINGS[y.annual.tenGod].theme}’에 주목합니다.`}` : "";
  // Current packet only; show its lasting natal relationship once, in the
  // current-year chapter. Other cycles have no safely carried factors here.
  const majorNatal = y.timePosition === "current" && validPeriod && !transition
    && e.majorNatal.cycleIndex === cycle.index && e.majorNatal.ganji === cycle.ganji
    ? e.majorNatal.relations.slice(0, 1).flatMap(f => {
      const actors = natalActors(f.relation), meaning = f.text.split(": ")[1];
      if (!meaning || !actors.length || actors.some(a => !a) || !f.relation.branches.includes(cycle.ganji.slice(-1) as typeof f.relation.branches[number])) return [];
      return [{ id: f.evidenceId, text: `한 해의 세운과는 따로, ${cycle.ganji}(${cycle.tenGod}) 대운의 지지 ${cycle.ganji.slice(-1)}, ${actors.join("·")} 사이에는 ${f.relation.branches.join("·")} ${f.relation.type} 관계가 있습니다. ${p(`‘${meaning}’`, "topic")} ${cycle.tenGod} 대운 전체의 점검점이며, 특정 연도의 사건을 확정하지 않습니다.` }];
    }) : [];
  return { background, majorNatal,
    backgroundIds: validPeriod ? [`dayun-cycle:${cycle.index}:${cycle.ganji}`, `period-ten-god:${cycle.tenGod}`,
      ...(transition ? [`dayun-cycle:${transition.before.index}:${transition.before.ganji}`, `transition:${transition.startSolarKst ?? transition.dateLabel}`] : [])] : [],
    tension: tensions.map(describe).join(" "), tensionIds: tensions.map(r => r.id),
    harmony: harmony ? describe(harmony) : "", harmonyIds: harmony ? [harmony.id] : [],
  };
}

/** Attach explanations after voice realization so every existing sentence,
 * scene selection, paragraph ID and ordering remains unchanged. */
export function withMajorInteractions(e: MajorEvidence, y: MajorYearEvidence, blocks: readonly NarrativeBlock[]): NarrativeBlock[] {
  const reading = majorInteractionReading(e, y);
  const harmonyBlock = blocks.some(b => b.id === `${y.year}-harmony`) ? "harmony" : "gift";
  return blocks.map(b => {
    const character = b.id === `${y.year}-character`;
    const prefix = character ? [reading.background, ...reading.majorNatal.map(r => r.text)].filter(Boolean).join(" ")
      : b.id === `${y.year}-friction` ? reading.tension
      : b.id === `${y.year}-${harmonyBlock}` ? reading.harmony : "";
    if (!prefix) return b;
    return { ...b, text: `${prefix} ${b.text}`, proof: character
      ? { ...b.proof, sourceRefs: [...new Set([...b.proof.sourceRefs, ...reading.backgroundIds, ...reading.majorNatal.map(r => r.id)])] }
      : b.proof };
  });
}
