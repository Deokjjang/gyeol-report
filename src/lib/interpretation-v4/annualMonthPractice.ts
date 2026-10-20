import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import type { MajorContext } from "./majorContext";
import { monthlyAction } from "./monthActions";

type Practice = { question: string; check: string; action: string; avoid: string };
// Questions follow the calculated ten-god's existing meaning and scene. They
// are decision criteria, not new meanings assigned to a particular branch pair.
const questions: Record<TenGod, readonly [string, string]> = {
  비견: ["스스로 고를 부분과 도움받을 부분이 어디인지", "내 판단과 다른 사람의 몫"],
  겁재: ["각자의 실력이 어떤 부분을 채워줄 수 있는지", "각자의 기여와 공동 비용"],
  식신: ["배운 것을 어디까지 실제 결과로 보여줄 수 있는지", "완성할 범위와 마무리 순서"],
  상관: ["기존 방법에서 무엇을 바꾸면 실제로 나아지는지", "바꿀 부분과 유지할 기준"],
  편재: ["낯선 제안에서 무엇을 직접 경험할 수 있는지", "직접 맡을 역할과 참여 비용"],
  정재: ["다음에도 이어갈 수 있는 생활의 크기가 얼마인지", "반복 지출과 남겨둘 여유"],
  편관: ["어떤 판단을 먼저 하고 어디서 도움을 청할지", "판단할 범위와 책임을 넘길 시점"],
  정관: ["믿고 맡길 수 있다는 말을 어떤 결과로 보여줄지", "맡은 역할과 완료 기준"],
  편인: ["어떤 가정을 확인해야 궁금했던 차이를 설명할 수 있는지", "확인할 가정과 조사에 쓸 시간"],
  정인: ["받은 설명을 스스로 어디까지 써볼 수 있는지", "막힌 개념과 적용할 과제"],
};
const laterCheck: Record<TenGod, string> = {
  비견: "지킬 기준과 바꿔도 될 방법", 겁재: "결과에 남길 기여와 다음 협업의 분담",
  식신: "다시 만들 때 쓸 순서와 쉴 시간", 상관: "전달할 대안과 상대가 확인할 결과",
  편재: "투입할 시간과 얻을 경험", 정재: "줄일 고정비와 지킬 생활 시간",
  편관: "결정권과 책임의 끝", 정관: "다음 역할의 기준과 보여줄 경험",
  편인: "실험해볼 조건과 다시 확인할 예외", 정인: "설명에서 빠진 부분과 혼자 해볼 순서",
};
const laterQuestion: Record<TenGod, string> = {
  비견: "함께하더라도 내 선택을 지킬 여지가 어디인지", 겁재: "비교에서 어떤 방법을 배워 내 것으로 바꿀지",
  식신: "한 번 낸 결과를 다시 만들 방법이 있는지", 상관: "다른 답을 상대가 확인할 수 있는 방식은 무엇인지",
  편재: "제안들 가운데 시간과 비용을 감당할 선택이 어느 것인지", 정재: "생활의 여유를 남기려면 어떤 비용과 시간을 줄일지",
  편관: "어려운 상황에서 직접 결정할 범위를 어디까지로 할지", 정관: "지난 경험이 새 역할의 기준을 어디까지 채우는지",
  편인: "서로 다른 관심을 실제 문제에서 시험할 수 있는지", 정인: "배운 내용을 혼자 설명하고 다시 쓸 수 있는지",
};
// A student's wealth is not an assumed business or salary. Keep the existing
// learning/exploration scenes and distinguish first contact from later choice.
const student: Record<TenGod, readonly (readonly [string, string])[]> = {
  비견: [["친구가 고른 방향과 내 흥미를 비교하고, 내가 해볼 주제를 하나 정해보세요.", "주변의 선택을 그대로 내 진로의 답으로 삼는 것"], ["스스로 고른 작은 도전에 쓸 시간을 남겨보세요.", "남의 진도로 내 흥미의 값을 매기는 것"]],
  겁재: [["공동 과제에서 각자 잘하는 부분과 맡을 결과를 나눠보세요.", "친하다는 이유로 기여와 비용 분담을 생략하는 것"], ["친구의 연습에서 내게 필요한 방법 하나를 배워 직접 해보세요.", "비교에 쓴 시간이 정작 내 연습을 대신하는 것"]],
  식신: [["발표나 실습에서 배운 것을 보여줄 작은 결과 하나를 완성해보세요.", "아이디어를 더 보태느라 보여줄 결과를 끝내지 못하는 것"], ["처음 시도와 지금의 결과를 나란히 놓고 다시 해낼 순서를 남겨보세요.", "만든 양만 늘리고 어려웠던 순서를 돌아보지 않는 것"]],
  상관: [["교재의 방법과 실제 조건이 갈린 지점을 찾고 작은 대안을 시험해보세요.", "다른 답을 냈다는 이유로 사람 전체를 평가하는 것"], ["다르게 푼 과제의 전후 차이를 짧게 보여주고 반응을 들어보세요.", "새롭다는 이유만으로 기존 기준을 전부 버리는 것"]],
  편재: [["관심 분야 밖의 현직자에게 배운 것을 어디에 쓰는지 묻고, 직접 맡아볼 역할과 참여 비용을 확인해보세요.", "흥미로운 소개만 듣고 경험의 범위도 모른 채 참여하는 것"], ["외부 활동의 시간·비용·배울 내용을 나란히 놓고, 지금 감당할 경험 하나를 골라보세요.", "기회를 놓치기 싫어서 수업과 생활에 쓸 여유까지 채우는 것"]],
  정재: [["준비비와 생활비를 나누고 계속 배울 수 있는 예산을 정해보세요.", "당장 아끼느라 필요한 배움까지 모두 미루는 것"], ["새 교재나 장비를 사기 전에 가진 것으로 더 익힐 부분을 확인해보세요.", "더 사는 일을 실력이 늘어나는 일과 같은 것으로 보는 것"]],
  편관: [["시험이나 과제에서 먼저 판단할 한 가지와 도움을 청할 기준을 적어보세요.", "긴장한 채 모든 문제를 혼자 풀어야 한다고 여기는 것"], ["준비대로 되지 않은 과제를 작은 결정 순서로 나눠 다시 해보세요.", "어려웠던 한 장면으로 실력 전체를 단정하는 것"]],
  정관: [["모임에서 맡은 일의 기한과 완료 기준을 확인하고 끝낸 결과를 남겨보세요.", "성실해 보이려고 지키기 어려운 약속까지 받는 것"], ["첫 지원에서 내가 맡아 끝낸 부분을 기대하는 역할과 연결해 설명해보세요.", "참여했다는 사실만으로 맡을 준비까지 설명됐다고 여기는 것"]],
  편인: [["수업 뒤에도 남는 질문의 가정 하나를 자료와 실제 사례로 비교해보세요.", "자료만 늘리며 확인해볼 기회를 미루는 것"], ["서로 다른 관심사를 과제 하나에 대입하고 달라진 이유를 적어보세요.", "한 번의 예외로 배운 설명 전체를 틀렸다고 보는 것"]],
  정인: [["막힌 개념을 구체적으로 묻고 받은 설명을 과제 하나에 써보세요.", "알아들은 느낌만으로 적용까지 끝났다고 여기는 것"], ["배운 내용을 친구에게 설명해보고 막힌 부분을 다시 익혀보세요.", "익숙한 내용만 되풀이하며 모르는 부분을 숨기는 것"]],
};

export function annualMonthPractice(c: MajorContext, god: TenGod, occurrence: number) {
  const variant = occurrence ? 1 : 0;
  const base = god === "정인" && occurrence
    ? { action: "배운 방법을 내 말로 풀어주고 상대가 다시 써볼 수 있는지 확인해보세요.", avoid: "내가 잘 안다는 이유로 상대에게도 같은 설명이면 충분하다고 여기는 것" }
    : god === "겁재" && occurrence ? monthlyAction(god, 2)
    : monthlyAction(god, occurrence);
  const [action, avoid] = c.mode === "student" ? student[god][variant]
    : [`‘${c.scenes[god][variant]}’ 같은 장면이라면 ${base.action}`, `‘${c.scenes[god][variant]}’에서 ${base.avoid}`];
  const [question, check] = questions[god];
  const later = god === "겁재" && c.mode !== "student" ? "같이 낸 결과에서 각자의 기여를 어떻게 설명할지" : laterQuestion[god];
  const practice: Practice = { question: occurrence ? later : question, check: occurrence ? laterCheck[god] : check, action, avoid };
  return { ...practice, setting: c.scenes[god][variant], provenance: c.provenance };
}
