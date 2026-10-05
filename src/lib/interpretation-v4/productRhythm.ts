import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { MATERIAL_BY_FEATURE } from "./materialRegistry";
import { paragraph, proof } from "./copyRealizer";
import type { ContentEvidencePool } from "./contentEvidence";
import type { NarrativeInput } from "./narrativeTypes";
import type { SemanticTag } from "./types";

/** A supplementary rhythm, not yin=I / yang=E. Only a confirmed complete
 * distribution AND a separate relevant material license this paragraph. */
export function rhythmReading(input: NarrativeInput, pool: ContentEvidencePool, product: "comprehensive" | "career" | "love") {
  const yy = pool.yinYang;
  if (!yy.complete || yy.total !== 8 || Math.abs(yy.yin - yy.yang) < 4) return null;
  const inward = yy.direction === "inward";
  const tags: SemanticTag[] = inward ? ["solitude", "inquiry", "consistency", "reserved-affection"] : ["leadership", "expression", "mobility", "autonomy"];
  const support = pool.materials.find(m => MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.some(t => tags.includes(t)));
  if (!support) return null;
  const profile = getMbtiSourceProfile(input.mbti), external = profile?.type.startsWith("E"), internal = profile?.type.startsWith("I");
  const relation = profile ? ((inward && external) || (!inward && internal) ? "tension" : "reinforce") : "natal";
  const scene = product === "career"
    ? inward ? "바로 의견을 말하라는 순간보다 자료를 한 번 읽고 나서 더 정확한 말을 꺼내는 쪽입니다. 말이 늦어도 판단까지 느린 것은 아니죠." : "아무도 다음 순서를 정하지 않을 때 직접 작은 시작을 만드는 힘이 있어요. 직함이 생겨야만 주도권을 쓰는 사람은 아닙니다."
    : product === "love"
      ? inward ? "좋아한다는 말을 한 번에 쏟기보다 만남이 끝난 뒤에도 상대의 말을 오래 기억합니다. 빨리 대답하는 것보다 진짜 마음을 정리할 시간이 중요한 편이에요." : "마음이 움직이면 관계에도 작은 변화를 만들고 싶어요. 다음 만남을 제안하거나 어색한 분위기를 먼저 바꾸는 쪽에서 관심이 드러납니다."
      : inward ? "사람들과 잘 어울리고 돌아온 밤에도 혼자 다시 생각하는 시간이 남습니다. 오늘 한 선택을 자기 기준으로 한 번 더 정리해야 하루가 끝나는 편이에요." : "생각만 하며 기다리기보다 작게라도 움직여보면 다음 선택이 보입니다. 마음에 드는 일을 남이 먼저 시작하면 관심 없던 척하기도 쉽지 않죠.";
  const lens = !profile ? "이건 말수의 많고 적음보다 힘을 쓰고 거두는 박자에 가까워요."
    : relation === "tension" ? inward
      ? `${profile.type}의 바깥으로 반응을 나누는 모습과는 다른 리듬이에요. 활발하게 이야기해도 중요한 속마음은 혼자 정리한 뒤 꺼낼 수 있죠. 말이 많은 날에도 혼자 있고 싶은 이유가 따로 있습니다.`
      : `${profile.type}의 혼자 생각하는 시간과는 결이 달라요. 조용히 검토하다가 할 이유가 잡히면 먼저 움직이는 모습으로 합쳐집니다. 조용한 사람인데 시작은 빠르다는 인상을 줄 수 있죠.`
      : inward ? `${profile.type}에서도 안에서 생각을 정리하는 쪽에 무게를 둡니다. 두 해석이 겹치는 곳은 소극성이 아니라, 쉽게 말하지 않은 답에 오래 책임지는 힘이에요.`
        : `${profile.type}의 밖에서 반응을 확인하는 행동과 만나는 부분입니다. 사주와 MBTI가 함께 비추는 것은 시끄러움보다 먼저 해보고 판을 움직이는 힘이에요.`;
  return { relation, block: paragraph("rhythm-synthesis", `${scene} 확인된 여덟 글자에서 ${inward ? "음" : "양"}이 ${inward ? yy.yin : yy.yang}개라는 분포도 이 리듬을 보조해요. ${lens}`,
    proof([support], [], [], [...yy.provenance, "planner:rhythm:supplementary", ...(profile ? [`mbti:${profile.type}:preferenceAxes`, `content-synthesis:${relation}:rhythm`] : [])]), "observation", `${product}-inner-outer-rhythm`) };
}

const ELEMENT_TAGS: Record<string, readonly SemanticTag[]> = {
  WOOD: ["learning", "experimentation", "mobility"], FIRE: ["expression", "sociability", "first-attraction"],
  EARTH: ["accumulation", "wealth", "consistency"], METAL: ["precision", "autonomy", "decisive-correction"], WATER: ["inquiry", "learning", "solitude"],
};
const ELEMENT_LIFE: Record<string, readonly [string, string, string]> = {
  WOOD: ["가지가 뻗듯 다음 가능성을 찾습니다", "한 가지를 배워도 어디에 더 써볼지 궁금해요. 시작하는 힘을 결과 하나까지 이어가면 새로움이 경력이 됩니다.", "같은 일을 제자리걸음처럼 느끼면 흥미가 빨리 식습니다."],
  FIRE: ["보여줄 때 힘이 살아납니다", "혼자 좋다고 느낀 생각도 사람의 반응을 받으면 더 선명해져요. 발표나 대화처럼 내 생각이 밖으로 나오는 자리가 재능을 알아보게 합니다.", "반응이 없는 시간을 실패처럼 받아들이기 쉽습니다."],
  EARTH: ["흩어진 것을 내 생활로 남기는 힘이 있습니다", "좋은 계획을 듣고 나면 결국 누가 언제까지 챙길지가 궁금해요. 이어갈 수 있는 약속과 돈, 경험을 남기는 일이 장점입니다.", "챙길 수 있다는 이유로 남의 몫까지 맡기 쉽습니다."],
  METAL: ["자를 것은 자르고 기준을 세웁니다", "다들 괜찮다고 넘기는 선택에서도 무엇이 빠졌는지 눈에 들어와요. 정확히 구분하는 힘을 사람의 평가보다 결과를 다듬는 데 쓰면 믿음이 쌓입니다.", "애매한 답을 오래 듣는 데 인내심이 짧습니다."],
  WATER: ["보이지 않는 연결까지 생각이 흐릅니다", "하나를 알면 그 앞뒤가 궁금해서 질문이 이어져요. 남이 지나친 이유를 찾아내는 시간을 설명이나 실력으로 남길 때 깊이가 장점으로 보입니다.", "머릿속에서는 이미 오래 했는데 밖에 남긴 것은 적을 수 있습니다."],
};
export function elementCharacter(pool: ContentEvidencePool) {
  for (const element of pool.elements.filter(e => e.state === "high")) {
    const root = pool.materials.find(m => MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.some(t => ELEMENT_TAGS[element.element].includes(t)));
    if (!root) continue;
    const [title, life, shadow] = ELEMENT_LIFE[element.element];
    return { title, block: paragraph("element-character", `${life} 오행의 ${element.material.imagery} 이미지도 같은 방향을 보탭니다. ${shadow}`,
      proof([root], [], [], [...element.sourceRefs, `natal-element:${element.element}:${element.state}`, "planner:element:corroborated"]), "positive", "element-lived-strength") };
  }
  return null;
}
