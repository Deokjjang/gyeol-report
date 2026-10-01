import { MAJOR_MEANINGS } from "./majorMaterials";
import { majorAnnualStory } from "./majorAnnualStories";
import { paragraph, proof, particle } from "./copyRealizer";
import type { MajorEvidence, MajorYearEvidence } from "./majorEvidence";
import type { MajorContext } from "./majorContext";
import type { NarrativeBlock } from "./narrativeTypes";

export function majorYearNarrative(e: MajorEvidence, y: MajorYearEvidence, c: MajorContext) {
  const a = MAJOR_MEANINGS[y.annual.tenGod];
  const mature = e.years.some(previous => previous.year < y.year && previous.annual.tenGod === y.annual.tenGod);
  const relations = [...y.annual.cycleRelations, ...y.annual.natalRelations];
  const harmony = relations.find(r => ["육합", "삼합", "반합"].includes(r.type));
  const tension = relations.find(r => ["충", "형"].includes(r.type)) ?? relations.find(r => ["파", "해"].includes(r.type));
  const transition = e.horizon.transitions.find(t => t.year === y.year);
  const sources = proof([], [], [], [...e.sourceRefs, ...y.annual.evidenceIds, ...c.provenance]);
  const story = majorAnnualStory(y.annual.tenGod, c, mature, y.timePosition === "past", y.timePosition === "current");
  const blocks: NarrativeBlock[] = [];
  const add = (id: string, text: string, tone: NarrativeBlock["tone"] = "positive") => blocks.push(paragraph(`${y.year}-${id}`, text, sources, tone));
  add("character", story.portrait);
  add("scene", story.scene, "observation");
  add("gift", story.gift);
  add(tension ? "friction" : "life", tension ? story.shadow : story.reflection, tension ? "shadow" : "observation");
  if (harmony) {
    const joined = harmony.type === "육합" ? "서로의 필요를 맞춰볼 접점" : harmony.type === "삼합" ? "따로 있던 경험을 함께 쓸 방향" : "다른 경험을 보태볼 여지";
    add("harmony", mature
      ? `${particle(a.people, "과", "와")} ${particle(story.topic, "을", "를")} 새롭게 이야기할 때도 ${particle(joined, "이", "가")} 남습니다. ${particle(story.topic, "의", "의")} 다음 모습에는 다른 사람의 경험을 함께 담을 여지도 있어요.`
      : `${particle(a.people, "과", "와")} ${particle(story.topic, "을", "를")} 함께 다룰 접점이 있습니다. ${particle(story.topic, "에도", "에도")} ${particle(joined, "이", "가")} ${y.timePosition === "past" ? "있었는지 되짚어볼 만합니다" : "반가운 힘으로 보태질 수 있어요"}.`);
  }
  if (transition) add("boundary", `${transition.dateLabel}${y.timePosition === "past" ? "을 경계로" : "부터"} ${transition.before.ganji}에서 ${transition.after.ganji}로 ${y.timePosition === "past" ? "옮겨온 해입니다" : "넘어가는 해입니다"}. ${particle(MAJOR_MEANINGS[transition.after.tenGod].theme, "과", "와")} ${particle(story.topic, "을", "를")} 이어볼 때, 전환 뒤에 남길 몫도 달라 보입니다.`);
  if (["식신", "상관"].includes(y.annual.tenGod)) [blocks[0], blocks[1]] = [blocks[1], blocks[0]];
  if (y.annual.tenGod === "정인" && harmony) [blocks[0], blocks[2]] = [blocks[2], blocks[0]];
  const title = `${a.titles[mature ? 1 : 0]}${transition ? " — 큰 배경도 바뀝니다" : ""}`;
  return { ...y, title, protagonist: a.theme, goodTheme: a.gift, cautionTheme: tension ? a.cost : null,
    selectedRelation: { harmony: harmony ?? null, tension: tension ?? null }, sceneFamily: `${c.mode}:${y.annual.tenGod}:${mature ? "mature" : "first"}`,
    blocks, proof: sources };
}
