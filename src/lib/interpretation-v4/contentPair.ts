import { paragraph, proof, particle } from "./copyRealizer";
import { pairProof } from "./compatibilityInteractions";
import { materialLabel, contentFeature } from "./contentEvidence";
import { whyMaterial } from "./contentWhy";
import { conversationalVoice, realizeChapterVoice, CONTENT_REVISION } from "./contentSynthesis";
import { chapterMbtiReadings } from "./contentMbti";
import { relationshipMbtiReading } from "./contentRelationshipMbti";
import { auditContent } from "./contentQuality";
import type { CompatibilityNarrative, PairPerson } from "./compatibilityNarrativeTypes";
import type { PairEvidence } from "./compatibilityEvidence";
import type { NarrativeBlock } from "./narrativeTypes";

const DIRECTION: Record<string, string> = {
  비견: "나와 비슷한 힘을 만나는 비견의 관계라 의견을 꺼내기 쉬워요. 공감이 빠른 만큼 서로 자기 방식까지 쉽게 접지는 않죠.",
  겁재: "겁재의 관계는 비슷한 힘을 보고 자극받는 쪽이에요. 같은 편이면 용기가 커지지만, 비교가 시작되면 사소한 승부도 오래 갈 수 있죠.",
  식신: "식신의 관계에서는 가진 것을 편하게 꺼내주고 싶어져요. 대단한 말보다 함께 먹고 직접 해보는 즐거움에 마음이 풀리는 모습입니다.",
  상관: "상관의 관계는 평소 삼키던 말까지 밖으로 꺼내게 하는 쪽이에요. 다른 생각을 내도 되는 편안함과 말의 날이 같이 생길 수 있죠.",
  편재: "편재의 관계에서는 익숙한 범위 밖의 경험과 실속에 눈이 가요. 함께 무엇을 해볼지 잘 떠오르지만 둘의 여유까지 같은 크기는 아니죠.",
  정재: "정재의 관계는 시간과 약속처럼 눈에 보이는 믿음을 의식하게 해요. 자주 하는 작은 행동이 멋진 한마디보다 더 분명한 표현이 됩니다.",
  편관: "편관의 관계에는 평소보다 잘하고 싶은 긴장이 있어요. 자극이 성장의 힘이 되기도 하지만 계속 평가받는 느낌으로만 남으면 피곤하죠.",
  정관: "정관의 관계에서는 지켜야 할 약속과 책임이 더 선명해져요. 믿고 맡길 좋은 바탕이지만 설명하지 않은 기준까지 저절로 같아지지는 않습니다.",
  편인: "편인의 관계에서는 당연하게 여겼던 답도 다시 보게 돼요. 서로의 낯선 생각이 흥미롭지만 혼자 짐작한 뜻을 사실로 만들지는 않는 게 좋죠.",
  정인: "정인의 관계는 모르는 것을 물어봐도 괜찮다는 여유와 닿아 있어요. 도움을 편하게 주고받되 한 사람이 늘 챙기는 역할로 굳지 않을 때 더 든든하죠.",
};
const RELATION_WHY = {
  six_harmony: "육합은 서로 다른 부분을 이어 맞추는 연결로 읽어요. 처음부터 취향이 똑같다는 뜻보다, 한 사람이 시작한 일에 다른 사람이 자기 몫을 보탤 때 호흡이 생기는 모습입니다. 말만 나눌 때보다 함께 해본 뒤 상대가 더 이해되는 이유를 여기서 찾을 수 있죠.",
  three_harmony: "삼합은 서로 다른 재주가 같은 방향을 향하는 연결이에요. 각자 잘하는 것이 달라도 같이 원하는 것이 생기면 역할을 나눌 여지가 커집니다. 모든 생각을 맞추려 애쓰기보다 함께 만들 결과를 볼 때 차이가 쓸모로 바뀌는 쪽입니다.",
  half_harmony: "반합은 서로에게 이어볼 공통점이 있다는 뜻으로 읽어요. 모든 면이 맞아야 편한 관계가 되는 것은 아니죠. 같이 좋아하는 활동 하나가 있으면, 다른 취향을 알아가는 동안에도 다시 만날 이유가 남습니다.",
  clash: "충은 서로 다른 속도와 방향이 맞부딪히는 관계로 읽습니다. 관심이 없어서가 아니라 중요하게 보는 순서가 달라서 반대할 수도 있어요. 당장 고르고 싶은 쪽과 더 알아보고 싶은 쪽이 같은 결정을 두고 다른 말을 하는 모습이죠.",
  harm: "해는 겉으로 크게 다투지 않아도 기대한 배려가 어긋나는 결이에요. 분명히 약속한 적은 없는데 ‘이 정도는 알아줄 줄 알았어’라는 말이 남을 수 있죠. 말하지 않은 기대가 쌓일 때 서운함도 커지므로, 조용한 날에 오히려 서로의 기준을 알아보는 대화가 도움이 됩니다.",
} as const;

/** Person-bound natal synthesis first, then the EXISTING receiver-view relation.
 * A natal marker is never turned into a cross-person harmony or transit. */
export function composePairContent(draft: CompatibilityNarrative, e: PairEvidence, a: PairPerson, b: PairPerson) {
  const defined = new Set<string>(), traits = new Set<string>();
  const occupational = ["coworker", "managerReport", "businessPartner"].includes(e.category);
  const lens = occupational ? "work" : e.category === "marriage" ? "marriage" : e.category === "love" ? "love" : "relationships";
  const people = [a, b];
  const describedRoots = new Set<string>(), describedFusions = new Set<string>();
  const personBlocks = people.flatMap(p => {
    const root = p.materials.selected.find(m => p.fusion?.myeongliEvidence.some(d => contentFeature(d.evidence.feature) === m.feature))
      ?? p.materials.selected.find(m => m.material.category === "dayPillar");
    if (!root) return [];
    const label = materialLabel(root);
    const why = describedRoots.has(root.feature) ? "" : whyMaterial(root, 0);
    describedRoots.add(root.feature);
    const f = p.fusion;
    const bridge = f && !describedFusions.has(f.ruleId) ? `${p.name}님의 ${f.mbtiEvidence.type}와 나란히 보면 ${f.kind === "contrast" ? "서로 다른 두 반응이 보입니다" : f.kind === "complement" ? "이 마음을 밖으로 쓰는 통로도 보여요" : "닮은 방향이 더 선명해요"}. ${f.insightSeed}` : "";
    if (f) describedFusions.add(f.ruleId);
    if (!why && !bridge) return [paragraph(`pair-shared-${p.personId}`, `${p.name}님에게도 같은 ${particle(label, "의", "의")} 바탕이 있어요. 상대만 그런 게 아니라 나에게도 익숙한 반응이라면, 다툴 때 서로의 답답함을 먼저 알아볼 여지도 있습니다.`, proof([root], [], f ? [f] : [], [`person:${p.personId}`, CONTENT_REVISION]), "positive")];
    const text = `${p.name}님의 ${particle(label, "을", "를")} 보면 가까운 사람에게 보이는 반응을 이해하기 쉬워요. ${why} ${bridge}`;
    return [paragraph(`pair-core-${p.personId}`, conversationalVoice(text, 1), proof([root], [], f ? [f] : [], [`person:${p.personId}`, ...(f ? [`content-synthesis:${f.kind}`] : []), CONTENT_REVISION]), "positive")];
  });
  const sections = draft.sections.map(s => {
    const existing = s.blocks.map((block, i) => ({ ...block, text: conversationalVoice(block.text, i) }));
    if (s.id === "fortune" || s.id === "friction") {
      const kinds: readonly string[] = s.id === "fortune" ? ["six_harmony", "three_harmony", "half_harmony"] : ["clash", "harm"];
      const relation = e.relations.find(r => kinds.includes(r.kind));
      if (!relation) return { ...s, blocks: existing };
      const text = RELATION_WHY[relation.kind as keyof typeof RELATION_WHY];
      return { ...s, blocks: [...existing, paragraph(`${s.id}-relation-why`, text,
        proof([], [], [], [`compatibilityRelationRules:detectCrossBranchRelations:${relation.identity}`, `content-relation:${relation.kind}`, CONTENT_REVISION]), "observation")] };
    }
    if (s.id !== "direction-ab" && s.id !== "direction-ba") return { ...s, blocks: existing };
    const slot = s.id === "direction-ab" ? "aToB" : "bToA";
    const subject = slot === "aToB" ? a : b, target = slot === "aToB" ? b : a;
    const direction = e.directions[slot], god = direction.receivedTenGod?.tenGodKo;
    const extra: NarrativeBlock[] = [];
    if (god && DIRECTION[god] && !defined.has(god)) {
      defined.add(god);
      extra.push(paragraph(`${slot}-why`, `${target.name}님 쪽에서 ${subject.name}님을 볼 때는 ${particle(god, "의", "의")} 자극을 읽습니다. ${DIRECTION[god]}`,
        pairProof(subject.proof, target.proof, proof([], [], [], [`target-viewer:${target.personId}`, `compatibilityRelationRules:getCrossTenGodRelation:${direction.relationId}`, `content-direction:${god}`, CONTENT_REVISION])), "observation"));
    }
    const read = chapterMbtiReadings(target.mbti, target.materials.selected, lens, traits)[0];
    if (read) {
      traits.add(read.id);
      extra.push(paragraph(`${slot}-response`, `${target.name}님의 ${particle(materialLabel(read.root), "과", "와")} ${target.mbti}의 반응을 함께 생각하면 상대가 왜 그렇게 받아들이는지도 보입니다. ${read.behavior} ${read.combined}`,
        proof([read.root], [], [], [`person:${target.personId}`, read.provenance, `content-synthesis:${read.kind}`, CONTENT_REVISION]), "positive"));
    } else if (["parentChild", "friendship"].includes(e.category)) {
      const personal = relationshipMbtiReading(target.mbti, target.materials.selected, "pair-nonromantic", traits);
      if (personal) {
        traits.add(personal.id);
        extra.push(paragraph(`${slot}-response`, `${target.name}님의 관계 방식도 함께 볼 만해요. ${personal.text}`,
          proof(personal.roots, [], [], [`person:${target.personId}`, personal.provenance, `content-synthesis:${personal.kind}`, CONTENT_REVISION]), "positive"));
      }
    }
    return { ...s, blocks: [...existing, ...extra] };
  });
  const narrative = { ...draft, opening: realizeChapterVoice([...draft.opening.map(v => ({ ...v, text: conversationalVoice(v.text) })), ...personBlocks]), sections: sections.map(s => ({ ...s, blocks: realizeChapterVoice(s.blocks) })) };
  return { narrative, contentAudit: auditContent(narrative),
    contentPlan: { revision: CONTENT_REVISION, category: e.category, roles: e.roles, mbtiTraits: [...traits],
      people: people.map(p => ({ personId: p.personId, core: p.core, fusion: p.fusion?.ruleId ?? null })), directions: e.directions } };
}
