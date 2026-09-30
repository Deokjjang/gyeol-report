import { buildCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { structureContext } from "./strength";
import { paragraph } from "./copyRealizer";
import type { NarrativeInput } from "./narrativeTypes";

/** Supporting texture only; the unchanged table producer owns every location. */
export function natalTexture(input: NarrativeInput) {
  if (!structureContext(input.calculation).valid || !input.calculation.birthTimeContext) return [];
  const table = buildCanonicalNatalTable(input.calculation.birthTimeContext);
  if (!table) return [];
  const blocks = [];
  const clash = table.relations.find(r => r.id.includes("BRANCH_CLASH"));
  const union = table.relations.find(r => r.id.includes("COMBINATION"));
  if (clash || union) {
    const relations = [clash, union].filter((r): r is NonNullable<typeof r> => Boolean(r));
    const text = clash && union ? "가까운 사람과 맞춰가고 싶은 마음과 내 리듬을 바꾸기 싫은 마음이 함께 있습니다. 약속을 잡을 때는 즐거웠는데 막상 내 시간이 줄어들면 혼자 조용해지는 식입니다. 한쪽 마음이 거짓인 게 아니라 함께하는 재미와 내 속도를 모두 중요하게 여기는 모습입니다." :
      clash ? "늘 같은 방식으로만 지내면 답답해지는 구석이 있습니다. 익숙해서 편한 생활도 어느 순간에는 순서를 바꾸고 다른 답을 찾고 싶어집니다. 그 변화 욕구를 꼭 큰 사건으로 만들 필요는 없습니다. 내 생활의 속도를 다시 고르는 데서도 움직일 자리는 생깁니다." :
      "내 방식만 잘 지키는 것 못지않게 서로 맞아떨어지는 순간을 좋아합니다. 처음에는 다른 취향이던 사람과 같이할 방법을 찾으면 관계가 한층 편해집니다. 혼자 다 바꾸거나 상대를 전부 바꾸지 않고 함께 쓸 방식을 찾아가는 힘입니다.";
    blocks.push(paragraph("natal-relations", text, { features: relations.map(r => `natal-relation:${r.id}`), seedIds: [], fusionIds: [],
      sourceRefs: [table.version, ...relations.map(r => `canonical-relation:${r.id}:${r.positions.join(",")}:${r.participants.join(",")}`)] }, "observation", "rhythm-with-others"));
  }
  const pillar = table.pillars.find(p => p.columnId === "day");
  const stage = pillar?.twelveLifeStage?.find(s => ["장생", "건록", "제왕"].includes(s));
  const stages: Record<string, string> = {
    장생: "처음 접하는 것을 배워 내 것으로 만드는 장면에도 힘이 있습니다. 아직 서툴다는 사실보다 어제보다 하나 더 알게 됐다는 느낌이 시작을 돕습니다. 잘 모를 때 물어볼 수 있는 환경에서 새로운 관심이 자라기 좋습니다.",
    건록: "스스로 해낼 수 있다는 감각이 중요합니다. 남의 칭찬만 기다리기보다 내가 맡은 하루를 꾸준히 굴릴 때 자신감이 붙습니다. 눈에 확 띄지 않는 반복도 당신의 바탕을 단단하게 만드는 쪽입니다.",
    제왕: "내가 힘을 줄 곳을 정했을 때 존재감이 선명해집니다. 남의 결정을 기다리며 따라가기만 하는 자리보다 내 판단을 써볼 수 있는 장면에서 의욕이 납니다. 그 강한 기세는 모든 것을 차지하는 대신 정말 중요한 것을 맡을 때 더 또렷합니다.",
  };
  if (stage) blocks.push(paragraph("natal-stage", stages[stage], { features: [`natal-life-stage:day:${stage}`], seedIds: [], fusionIds: [],
    sourceRefs: [table.version, `canonical-life-stage:day:${pillar?.pillar}:${stage}`, "sajuPillarFeaturePlacement:twelveLifeStage"] }, "positive"));
  return blocks;
}
