import { MAJOR_MEANINGS } from "./majorMaterials";
import { majorAnnualStory } from "./majorAnnualStories";
import { majorHarmonyCopy } from "./majorHarmonyCopy";
import { paragraph, proof, particle } from "./copyRealizer";
import { periodExplanation } from "./contentPeriod";
import { planMajorYears, friendlyTransition, type PeriodImportance } from "./periodPlanner";
import type { MajorEvidence, MajorYearEvidence } from "./majorEvidence";
import type { MajorContext } from "./majorContext";
import type { NarrativeBlock } from "./narrativeTypes";

export function majorYearNarrative(e: MajorEvidence, y: MajorYearEvidence, c: MajorContext, usedRoots = new Set<string>(), importance: PeriodImportance = planMajorYears(e).find(p => p.year === y.year)!.importance) {
  const a = MAJOR_MEANINGS[y.annual.tenGod];
  const mature = e.years.some(previous => previous.year < y.year && previous.annual.tenGod === y.annual.tenGod);
  const relations = [...y.annual.cycleRelations, ...y.annual.natalRelations];
  const harmony = relations.find(r => ["육합", "삼합", "반합"].includes(r.type));
  const tension = relations.find(r => ["충", "형"].includes(r.type)) ?? relations.find(r => ["파", "해"].includes(r.type));
  const transition = e.horizon.transitions.find(t => t.year === y.year);
  const sources = proof([], [], [], [...e.sourceRefs, ...y.annual.evidenceIds, `period-ten-god:${y.annual.tenGod}`, ...c.provenance]);
  const story = majorAnnualStory(y.annual.tenGod, c, mature, y.timePosition === "past", y.timePosition === "current", y.year >= e.currentYear + 3);
  const blocks: NarrativeBlock[] = [];
  const add = (id: string, text: string, tone: NarrativeBlock["tone"] = "positive") => blocks.push(paragraph(`${y.year}-${id}`, text, sources, tone));
  add("character", story.portrait);
  add("scene", story.scene, "observation");
  if (importance !== "BACKGROUND") {
    blocks.push(periodExplanation(String(y.year), `${y.year}년`, y.annual.tenGod, mature ? 1 : 0, e.materials, y.annual.evidenceIds, usedRoots));
  }
  add("gift", story.gift);
  if (importance === "HIGH" || tension) add(tension ? "friction" : "life", tension ? story.shadow : story.reflection, tension ? "shadow" : "observation");
  if (harmony && importance === "HIGH") {
    add("harmony", majorHarmonyCopy(y.annual.tenGod, story.topic, story.setting, mature, y.timePosition === "past"));
  }
  if (transition) add("boundary", `${friendlyTransition(transition.dateLabel)}${y.timePosition === "past" ? "을 경계로" : "부터"} ${transition.before.ganji}에서 ${transition.after.ganji}로 ${y.timePosition === "past" ? "옮겨온 해입니다" : "넘어가는 해입니다"}. ${particle(MAJOR_MEANINGS[transition.after.tenGod].theme, "과", "와")} ${particle(story.topic, "을", "를")} 이어볼 때, 전환 뒤에 남길 몫도 달라 보입니다.`);
  if (["식신", "상관"].includes(y.annual.tenGod)) [blocks[0], blocks[1]] = [blocks[1], blocks[0]];
  if (y.annual.tenGod === "정인" && harmony && blocks.length > 2) [blocks[0], blocks[2]] = [blocks[2], blocks[0]];
  const title = `${a.titles[mature ? 1 : 0]}${transition ? " — 큰 배경도 바뀝니다" : ""}`;
  return { ...y, title, importance, protagonist: a.theme, goodTheme: a.gift, cautionTheme: tension ? a.cost : null,
    selectedRelation: { harmony: harmony ?? null, tension: tension ?? null }, sceneFamily: `${c.mode}:${y.annual.tenGod}:${mature ? "mature" : "first"}`,
    blocks, proof: sources };
}
