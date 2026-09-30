import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { MATERIAL_BY_FEATURE } from "./materialRegistry";
import { proof } from "./copyRealizer";
import type { NarrativeState } from "./narrativeTypes";
import type { SemanticTag } from "./types";

/** Exact existing trait IDs, not type-letter inference or new source DB content. */
export const CAREER_STUDY_BRIDGES: Readonly<Record<string, { trait: string; tags: readonly SemanticTag[]; text: string }>> = {
  ENTJ: { trait: "high_achievement_study", tags: ["precision", "leadership", "learning"], text: "새로운 공부도 도달할 수준이 보이면 의욕이 붙습니다. 막연히 많이 읽는 것보다 지금 틀리는 문제와 넘고 싶은 기준이 있을 때 집중이 선명해집니다. 자신 있는 과목에서 자꾸 빠지는 조건을 다시 보는 시간은 속도를 늦추는 벌이 아니라 실력을 점수 밖에서도 쓰게 하는 과정입니다." },
  ISTJ: { trait: "traditional_exam_strength", tags: ["precision", "consistency", "learning"], text: "시험 범위와 평가 기준이 분명하면 어디까지 익혀야 하는지 차근차근 잡습니다. 틀린 답을 고르는 데서 끝나지 않고 왜 그 선택지가 아닌지 확인할 때 비슷한 실수가 줄어듭니다. 새 자격을 준비한다면 이미 익숙한 실무 사례와 다른 부분을 구분해보는 방식이 잘 맞습니다." },
  INFJ: { trait: "graduate_depth_study", tags: ["inquiry", "learning", "solitude"], text: "한 주제에 의미가 붙으면 가볍게 훑는 것으로는 성에 안 찹니다. 남의 설명을 그대로 외우기보다 왜 필요한지 내 관점으로 정리하면서 깊어집니다. 배운 내용을 누구에게 어떤 순서로 전하면 좋을지 떠올리는 시간도, 흩어진 지식을 하나의 전문 분야로 묶어줍니다." },
  INTP: { trait: "math_science_affinity", tags: ["inquiry", "learning", "precision"], text: "공식을 외우기 전에 그 식이 왜 나왔는지 알고 싶습니다. 수학이나 프로그래밍처럼 원리와 결과를 직접 대조할 수 있는 배움에서 호기심이 오래 갑니다. 예제를 그대로 따라 한 뒤 조건 하나를 바꿔보면, 알았다고 생각했던 것과 정말 이해한 것의 차이가 재미있게 드러납니다." },
  ENFP: { trait: "interest_switch_learning", tags: ["expression", "inquiry", "learning"], text: "배울 이유가 내 관심과 닿으면 갑자기 진도가 빨라집니다. 지금 만들고 싶은 작업이나 설명하고 싶은 이야기에 새 지식을 붙일 때 읽은 것이 살아납니다. 호기심이 옮겨가기 전에 작은 결과 하나를 남기면, 즐겁게 배운 시간이 다음 작업에도 다시 쓰입니다." },
  ESTP: { trait: "experiential_learning", tags: ["learning", "practical-learning", "precision"], text: "직접 해보고 막힌 다음에 읽는 설명은 처음 읽을 때와 다르게 들어옵니다. 실습에서 멈춘 이유를 짧게 확인하고 다시 시험하면 이해가 손에 남습니다. 면접 과제나 자격 공부에서도 전부 읽고 시작하기보다 작은 사례를 풀며 무엇을 모르는지 찾는 순서가 힘을 줍니다." },
  ENTP: { trait: "interest_based_learning", tags: ["inquiry", "expression", "precision"], text: "정해진 내용을 받아 적기만 하면 금세 다른 생각이 끼어듭니다. 반례를 찾거나 두 설명을 비교하는 질문이 생기면 같은 과목도 다르게 보입니다. 답을 바꾸어 설명해본 뒤 원래 문제도 끝까지 풀어보는 경험이, 똑똑하게 이해했다는 기분을 실제 시험과 과제로 옮겨줍니다." },
  INTJ: { trait: "hard_discipline_affinity", tags: ["inquiry", "precision", "learning"], text: "앞에서 배운 내용이 뒤의 원리와 이어질 때 공부가 깊어집니다. 낱개 암기보다 왜 그 순서인지 도식으로 정리하는 일이 이해를 돕습니다. 새 사례에도 같은 설명이 통하는지 확인하면 자기 논리를 믿을 근거도 더 단단해집니다." },
  INFP: { trait: "storytelling_learning", tags: ["expression", "learning", "inquiry"], text: "내가 경험한 이야기로 바꾸어 말하면 낯선 개념도 기억에 남습니다. 외워야 할 문장을 늘리기보다 그 내용이 실제 사람에게 무슨 뜻인지 떠올릴 때 관심이 붙습니다. 짧은 글이나 비유로 다시 꺼내보는 과정에서 아직 흐릿한 부분도 보입니다." },
  ENFJ: { trait: "fast_social_learning", tags: ["help", "expression", "learning"], text: "누군가에게 도움이 될 배움이면 읽는 속도부터 달라집니다. 같이 이야기하며 생각을 나눌 때 몰랐던 연결도 빨리 잡습니다. 먼저 익힌 것을 짧게 설명해보고 상대의 질문을 받으면, 남의 반응이 내 이해를 더 또렷하게 만드는 재료가 됩니다." },
  ISFJ: { trait: "dutiful_study_rhythm", tags: ["consistency", "help", "learning"], text: "해야 할 범위가 보이면 조용히 누적하는 힘이 있습니다. 한 번 겪은 실수와 도움이 됐던 예를 기억해두면 새 문제도 낯설지 않게 풀립니다. 배우는 순서를 자주 뒤집기보다 익힌 것을 실제로 써보며 한 단계씩 늘리는 쪽이 마음도 편합니다." },
  ESFJ: { trait: "rote_exam_strength", tags: ["consistency", "help", "learning"], text: "범위와 정답이 보이는 공부에서 성실하게 익힌 것이 힘을 냅니다. 반복한 내용을 서로 물어보고 설명하는 자리가 있으면 놓친 부분도 빨리 알아챕니다. 함께 공부한 시간과 내가 혼자 답할 수 있는 내용을 구분하면 익숙함이 실력으로 남습니다." },
  ESTJ: { trait: "exam_structure_advantage", tags: ["consistency", "leadership", "learning"], text: "목표와 시험 범위를 알면 오늘 끝낼 분량부터 나눕니다. 흐릿한 격려보다 어디가 나아졌는지 확인되는 공부가 동기를 줍니다. 시간을 채웠다는 만족에 그치지 않고 새 문제에도 답할 수 있는지 보면 준비한 힘이 더 정확히 드러납니다." },
  ISFP: { trait: "hands_on_learning", tags: ["precision", "expression", "practical-learning"], text: "직접 보고 만지고 만들어본 경험은 설명만 들은 것보다 오래 남습니다. 완성한 것을 조금씩 바꾸어보면 어떤 차이가 생기는지 감각으로 잡습니다. 배운 용어를 실제 작업에 붙이는 순서로 가면 낯설던 이론도 필요한 이름이 됩니다." },
  ISTP: { trait: "hands_on_learning", tags: ["precision", "autonomy", "practical-learning"], text: "도구를 직접 써보면 어느 부분을 더 알아야 할지 금방 드러납니다. 처음부터 설명서를 통째로 외우기보다 작은 기능을 시험하며 익히는 재미가 있습니다. 잘된 경우와 안 된 경우를 한 번씩 비교하면 손에 붙은 요령을 다음 작업에도 가져갈 수 있습니다." },
  ESFP: { trait: "study_sitting_dislike", tags: ["expression", "practical-learning", "sociability"], text: "가만히 읽기만 하는 시간보다 몸을 움직이고 반응을 받는 배움이 덜 지루합니다. 짧게 해보고 바로 확인하는 과제를 만들면 관심을 이어가기 좋습니다. 사람 앞에서 보여줄 작은 결과가 생겼을 때 준비가 즐거운 연습으로 바뀝니다." },
};

export function careerStudy(state: NarrativeState) {
  const profile = getMbtiSourceProfile(state.input.mbti), bridge = profile && CAREER_STUDY_BRIDGES[profile.type];
  const trait = bridge && profile?.traits?.study?.find(t => t.id === bridge.trait && t.plainKo);
  const materials = bridge ? state.packet.selected.filter(m => MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.some(t => bridge.tags.includes(t))) : [];
  if (bridge && trait && materials.length) {
    const material = materials.find(m => m.material.seeds.some(s => s.role === "study")) ?? materials[0];
    const seed = material.material.seeds.find(s => s.role === "study");
    const source = `mbti:${profile!.type}:traits:study:${trait.id}`;
    return { text: bridge.text, proof: proof([material], seed ? [seed] : [], state.packet.fusions.filter(f => f.domain === "study").slice(0, 1),
      [source, `mbti:coverage:${trait.sourceCoverage}`, `v4:career-study:${profile!.type}`]),
      basis: { traitId: trait.id, type: profile!.type, provenance: trait.sourceCoverage === "direct" ? "direct" : "derived", feature: material.feature } };
  }
  const material = state.packet.selected.find(m => m.material.category !== "dayMaster" && m.material.seeds.some(s => s.role === "study")) ?? state.master;
  const seed = material.material.seeds.find(s => s.role === "study")!;
  return { text: `${seed.text} 배움의 결과를 다른 사람의 속도와만 비교할 필요는 없습니다. 어제는 어려웠던 것을 오늘 내 방식으로 설명하거나 해낼 수 있게 됐다면 분명히 쌓인 것이 있습니다.`, proof: proof([material], [seed], [], ["v4:career-study:natal"]), basis: null };
}
