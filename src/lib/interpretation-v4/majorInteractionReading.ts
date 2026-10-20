import { withKoreanParticle as p } from "../report-knowledge/koreanCopyUtils";
import { majorYearPeriod } from "./majorPeriodCopy";
import { MAJOR_MEANINGS } from "./majorMaterials";
import type { AnnualBranchInteraction, TenGod } from "../report-knowledge/annualFortuneTypes";
import type { MajorEvidence, MajorYearEvidence } from "./majorEvidence";
import type { NarrativeBlock } from "./narrativeTypes";

const positions = { year: "연지", month: "월지", day: "일지", hour: "시지" } as const;
const harmonyTypes = ["육합", "삼합", "반합"];
type Scope = "cycle" | "natal";

// The reviewed annualMonthRelationFacts.branchReadings / annualFortuneReading
// relationActions distinguish the scope of a connection. These are limited
// reading questions, not new meanings or events inferred from branch pairs.
const harmonyMeanings = {
  육합: "서로 연결되는 흐름을 약속과 협업의 접점으로 읽습니다",
  삼합: "세 지지가 모이는 흐름을 함께 추진할 일의 접점으로 읽습니다",
  반합: "일부 지지가 연결되는 흐름이며, 완성된 삼합으로 확대하지 않습니다",
};
const checks: Record<TenGod, readonly [string, string]> = {
  비견: ["내가 직접 고를 부분과 함께 지킬 기준", "계속 지킬 방향과 다시 열어둘 선택"],
  겁재: ["서로 보탤 실력과 공동 비용", "결과에 남길 기여와 다음 협업의 분담"],
  식신: ["처음 보여줄 결과의 완성 기준", "다시 만들 수 있는 순서와 공유할 방법"],
  상관: ["불편했던 절차와 바꿔볼 범위", "고친 방법의 전후 차이와 다른 사람이 써볼 조건"],
  편재: ["외부 제안에 투입할 시간과 돌아올 몫", "제안들 가운데 감당할 비용과 이어갈 조건"],
  정재: ["고정 수입·지출과 남는 여유", "결과를 계속 내기 위한 비용과 내 생활의 몫"],
  편관: ["먼저 처리할 요구와 도움을 청할 기준", "결정할 권한과 책임의 끝"],
  정관: ["맡을 범위와 끝냈다고 볼 기준", "다음 역할에 보여줄 경험과 함께 지킬 기준"],
  편인: ["확인할 가정과 조사를 끝낼 기준", "서로 다른 설명을 시험할 작은 적용"],
  정인: ["도움받을 부분과 혼자 써볼 과제", "상대가 다시 써볼 설명과 빠진 순서"],
};


/** Bind existing relations to their existing reason IDs. No relation detection,
 * new meanings, annual selection, or inference from ambiguous `plain` labels. */
export function majorInteractionReading(e: MajorEvidence, y: MajorYearEvidence, explained = new Set<string>()) {
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
  const sameActors = harmony && tension && harmony.scope === tension.scope && harmony.actors === tension.actors
    && [...harmony.relation.branches].sort().join("") === [...tension.relation.branches].sort().join("");
  const transition = e.horizon.transitions.find(t => t.year === y.year);
  const definition = (type: AnnualBranchInteraction["type"], meaning: string) => {
    const first = !explained.has(type); explained.add(type);
    if (first) return harmonyMeanings[type as keyof typeof harmonyMeanings] ?? `‘${meaning}’을 살필 조건입니다`;
    return ({ 육합: "함께하기 쉬운 접점입니다", 삼합: "여러 힘이 모일 접점입니다", 반합: "일부가 맞닿는 접점입니다", 충: "기존 배치와 새 요구를 조정할 자리입니다", 형: "되풀이되는 부담을 점검할 자리입니다", 파: "세부 방식을 손볼 자리입니다", 해: "드러내지 않은 불편을 확인할 자리입니다" })[type];
  };
  const previous = e.years.find(v => v.year < y.year && v.annual.tenGod === y.annual.tenGod);
  const check = checks[y.annual.tenGod][previous ? 1 : 0];
  const describe = (group: NonNullable<ReturnType<typeof bind>>[]) => {
    const first = group[0];
    if (!first) return "";
    const meanings = group.map(r => `${p(`${r.relation.branches.join("·")} ${r.relation.type}`, "topic")} ${definition(r.relation.type, r.meaning)}`);
    return `${y.year}년${transition ? " 전환이 완료된 뒤의 구간에서" : ""}, ${first.actors} 및 세운 ${y.annual.ganji}(${y.annual.tenGod})의 지지 ${y.annual.ganji.slice(-1)} 사이에서 읽는 ${meanings.join(". ")}.`;
  };
  const timing = majorYearPeriod(e, y).explanation;
  const adjacent = e.years.find(v => v.year === y.year - 1);
  const following = e.years.find(v => v.year === y.year + 1);
  const nextBoundary = e.horizon.transitions.find(t => t.year === following?.year);
  const cycleOpens = !adjacent || adjacent.cycle.index !== cycle.index;
  const annualMeaning = MAJOR_MEANINGS[y.annual.tenGod];
  // Compare supplied calendar rows, not invented events or new relations.
  // A cycle's full theme is introduced once; later years carry its context.
  const cycleReading = cycleOpens
    ? `${transition ? "전환 이후에는" : `${y.year}년은`} ${cycle.ganji} 대운의 ${cycle.tenGod}, ${y.annual.ganji} 세운의 ${p(y.annual.tenGod, "subject")} 만나는 흐름입니다. 큰 배경인 ‘${MAJOR_MEANINGS[cycle.tenGod].theme}’ 속에서 ‘${annualMeaning.theme}’에 주목합니다.`
    : y.timePosition === "current"
      ? `지금 ${y.year}년의 ${y.annual.ganji}(${y.annual.tenGod}) 세운은 ${cycle.ganji}(${cycle.tenGod}) 대운 안에서 ‘${annualMeaning.work}’에 힘을 줄 자리입니다.`
      : "";
  const comparison = previous
    ? `같은 ${p(y.annual.tenGod, "object")} 읽었던 ${previous.year}년(${previous.cycle.ganji}·${previous.cycle.tenGod})과 비교하며, ${p(`‘${check}’`, "object")} ‘${MAJOR_MEANINGS[cycle.tenGod].theme}’의 관점에서 살펴볼 만해요.`
    : adjacent && (y.year - e.horizon.from) % 2 === 0
      ? `${cycle.ganji} 대운에서 ${p(`‘${MAJOR_MEANINGS[cycle.tenGod].work}’`, "object")} 다루는 동안, ${adjacent.year}년의 ‘${MAJOR_MEANINGS[adjacent.annual.tenGod].theme}’에서 ${p(`‘${annualMeaning.work}’`, "to")} 질문이 옮겨옵니다. 전해의 방식을 그대로 늘리기보다 ${annualMeaning.next}에 눈을 돌려볼 변화예요.`
      : following && !e.horizon.transitions.some(t => t.year === following.year)
        ? `${p(`‘${annualMeaning.work}’`, "object")} 다루는 데서 ${following.year}년의 ‘${MAJOR_MEANINGS[following.annual.tenGod].theme}’로 시선이 이어집니다. ${y.timePosition === "past" ? "그해" : "이때"} ${p(annualMeaning.gift, "object")} 써볼 장면이 있었다면, 다음에는 ${p(MAJOR_MEANINGS[following.annual.tenGod].work, "to")} 그 힘을 옮겨볼 수 있다는 뜻입니다.`
        : following && nextBoundary ? `${following.year}년에는 ${nextBoundary.before.ganji}의 ‘${MAJOR_MEANINGS[nextBoundary.before.tenGod].theme}’에서 ${nextBoundary.after.ganji}의 ‘${MAJOR_MEANINGS[nextBoundary.after.tenGod].theme}’로 큰 장이 넘어갑니다. ‘${annualMeaning.work}’를 그때 ${`‘${MAJOR_MEANINGS[nextBoundary.after.tenGod].work}’에`} 가져간다면 무엇을 달리 써볼지 생각해볼 시간입니다.` : "";
  const compared = previous ?? (adjacent && (y.year - e.horizon.from) % 2 === 0 ? adjacent : following);
  const background = validPeriod ? [timing, cycleReading, comparison].filter(Boolean).join(" ") : "";
  const application = (r: NonNullable<ReturnType<typeof bind>> | undefined) => {
    if (!r) return "";
    const target = p(`‘${check}’`, "object");
    if (r.relation.type === "육합") return `${target} 함께 맡을 범위와 종료 조건에 맞춰보세요.`;
    if (r.relation.type === "삼합") return `함께 추진할 일이 있다면 ${target} 공통 목표와 각자의 기여에 비춰 정해보세요.`;
    if (r.relation.type === "반합") return `${target} 작은 시도로 확인한 뒤 연결을 넓혀보세요.`;
    if (r.relation.type === "충") return `기존 일정과 새 요구가 다르다면 ${target} 먼저 조정해보세요.`;
    if (r.relation.type === "형") return `같은 부담이 되풀이된다면 ${target} 어디까지 감당할지 다시 정해보세요.`;
    if (r.relation.type === "파") return `유지하던 방식 가운데 ${target} 손볼 필요가 있는지 확인해보세요.`;
    return `겉으로 말하지 못한 불편이 있다면 ${target} 상대가 이해한 내용과 나란히 놓아보세요.`;
  };
  // Current packet only; show its lasting natal relationship once, in the
  // current-year chapter. Other cycles have no safely carried factors here.
  const majorNatal = y.timePosition === "current" && validPeriod && !transition
    && e.majorNatal.cycleIndex === cycle.index && e.majorNatal.ganji === cycle.ganji
    ? e.majorNatal.relations.slice(0, 1).flatMap(f => {
      const actors = natalActors(f.relation), meaning = f.text.split(": ")[1];
      if (!meaning || !actors.length || actors.some(a => !a) || !f.relation.branches.includes(cycle.ganji.slice(-1) as typeof f.relation.branches[number])) return [];
      return [{ id: f.evidenceId, text: `한 해의 세운과 구분해, ${cycle.ganji}(${cycle.tenGod}) 대운의 지지 ${cycle.ganji.slice(-1)}, ${actors.join("·")} 사이에는 ${f.relation.branches.join("·")} ${f.relation.type}: ${definition(f.relation.type, meaning)}. ${cycle.ganji} 대운의 이 관계를 특정 연도의 사건으로 단정하지 않습니다.` }];
    }) : [];
  return { background, majorNatal,
    backgroundIds: validPeriod ? ["v4:major-reader-periods-01", `dayun-cycle:${cycle.index}:${cycle.ganji}`, `period-ten-god:${cycle.tenGod}`,
      ...(compared ? [`period-ten-god:${compared.annual.tenGod}`, `period-ten-god:${compared.cycle.tenGod}`, `dayun-cycle:${compared.cycle.index}:${compared.cycle.ganji}`] : []),
      ...(transition ? [`dayun-cycle:${transition.before.index}:${transition.before.ganji}`, `transition:${transition.startSolarKst ?? transition.dateLabel}`] : [])] : [],
    harmonyAction: harmony && tension
      ? harmony.relation.type === "삼합" ? `각자 끝낼 몫을 나눌 때 ${p(`‘${check}’`, "object")} 이 해에 함께 조정할 조건으로 놓아보세요.`
        : harmony.relation.type === "육합" ? `호흡이 맞아도 ${p(`‘${check}’`, "object")} 정할 때는 함께 나타난 긴장을 덮으면서까지 약속을 넓히지는 않아도 됩니다.`
        : `맞닿는 부분만 시험하며 ${p(`‘${check}’`, "object")} 먼저 확인하되, 모든 조건에 동의할 필요는 없습니다.`
      : application(harmony), tensionAction: application(tension),
    // When a connection and a strain share participants, explain that one
    // meeting once; retain separate supportive/cautionary decisions and proofs.
    tension: sameActors ? "" : describe(tensions), tensionIds: tensions.map(r => r.id),
    harmony: harmony ? describe(sameActors ? [harmony, ...tensions] : [harmony]) : "",
    harmonyIds: harmony ? [harmony.id] : [],
  };
}

/** Attach bound relations and limited practice after the natal reading. */
export function withMajorInteractions(e: MajorEvidence, y: MajorYearEvidence, blocks: readonly NarrativeBlock[], explained = new Set<string>()): NarrativeBlock[] {
  const reading = majorInteractionReading(e, y, explained);
  const harmonyBlock = blocks.some(b => b.id === `${y.year}-harmony`) ? "harmony" : "gift";
  return blocks.map(b => {
    const character = b.id === `${y.year}-character`;
    const prefix = character ? [reading.background, ...reading.majorNatal.map(r => r.text)].filter(Boolean).join(" ")
      : b.id === `${y.year}-friction` ? reading.tension
      : b.id === `${y.year}-${harmonyBlock}` ? reading.harmony : "";
    const action = b.id === `${y.year}-friction` ? reading.tensionAction
      : b.id === `${y.year}-${harmonyBlock}` ? reading.harmonyAction : "";
    if (!prefix && !action) return b;
    return { ...b, text: [prefix, b.text, action].filter(Boolean).join(" "), proof: character
      ? { ...b.proof, sourceRefs: [...new Set([...b.proof.sourceRefs, ...reading.backgroundIds, ...reading.majorNatal.map(r => r.id)])] }
      : { ...b.proof, sourceRefs: [...new Set([...b.proof.sourceRefs, ...(b.id === `${y.year}-friction` ? reading.tensionIds : [...reading.harmonyIds, ...(!reading.tension ? reading.tensionIds : [])])])] } };
  });
}
