import type { NarrativeState } from "./narrativeTypes";
import { particle } from "./copyRealizer";

/** Symbolic scenery only; no claim that an element causes job outcomes. */
export function careerBalance(state: NarrativeState, voice: string) {
  const low = state.packet.symbolicElements.find(e => e.state === "low");
  if (!low) return;
  const people = { WATER: "차분하게 들어주고 생각을 정리할 사람", EARTH: "마감과 약속을 잊지 않게 이어주는 환경", WOOD: "작은 시작을 같이 궁리할 동료", FIRE: "내가 만든 것을 편하게 보여줄 자리", METAL: "받을 일과 거절할 일을 구분할 기준" }[low.element];
  const symbol = { WATER: "수", EARTH: "토", WOOD: "목", FIRE: "화", METAL: "금" }[low.element];
  const scenes: Readonly<Record<string, readonly [string, string]>> = {
    precise: ["혼자 정확하게 확인한 것을 밖에서도 알아볼 수 있었으면 합니다", "단정한 설명을 같이 다듬어줄 동료가 있다면 꼼꼼함 뒤의 생각까지 더 잘 전할 수 있습니다"],
    meaning: ["상대의 사정을 오래 듣다 보면 내 일의 경계도 흐려질 수 있습니다", "좋은 뜻을 오래 지키려면 모든 부탁을 다 받는 것과 도울 수 있는 범위를 아는 것이 구분되어도 좋습니다"],
    creative: ["아이디어가 많아도 전부 혼자 완성할 필요는 없습니다", "중간 결과를 가볍게 이야기할 사람이 있으면 흩어진 생각 중 무엇을 남길지 고르는 시간도 즐거워질 수 있습니다"],
    inquiry: ["납득할 때까지 머무는 힘 옆에는 작은 출발도 필요합니다", "다 알아낸 뒤가 아니라 지금 확인할 수 있는 한 가지를 같이 정할 동료가 있으면 깊이를 버리지 않고 움직일 수 있습니다"],
    challenger: ["좋은 반박 뒤에는 내 답을 보여줄 순간도 남아야 합니다", "이야기를 흥미롭게 듣는 사람만큼 짧은 결과를 기다려줄 사람이 있으면 발상이 실제 경험이 되기 쉽습니다"],
    field: ["빨리 알아챈 변화를 남도 볼 수 있으면 첫인상이 달라집니다", "현장에서 느낀 차이를 짧게 설명하는 연습은 움직이는 감각에 또 하나의 통로를 만들어줍니다"],
    decisive: ["내가 빠르다고 모두 더 빨리 달려야 하는 것은 아닙니다", "내 결론에 바로 따르는 사람보다 미처 안 들은 이야기를 조용히 건네는 동료가 판단을 넓혀줄 때가 있습니다"],
    natal: ["새 출발을 혼자 힘으로 완벽하게 준비할 필요는 없습니다", "편한 생활의 순서가 생기면 새 일을 알아볼 여유도 조금씩 남길 수 있고, 그 안에서 내 속도를 다시 찾아볼 만합니다"],
  };
  const scene = scenes[voice] ?? scenes.natal;
  const fireImages: Readonly<Record<string, string>> = { precise: "검토한 내용을 짧게 전할 자리", creative: "초안을 펼치고 함께 반응할 시간", challenger: "새로운 답을 실제로 보여줄 기회", field: "직접 바꾼 차이를 소개할 순간" };
  const image = low.element === "FIRE" && fireImages[voice] ? fireImages[voice] : people;
  return { low, text: `${scene[0]}. ${particle(symbol, "이", "가")} 덜 드러난 결의 상징으로 ${particle(image, "을", "를")} 떠올려보면, ${scene[1]}.` };
}
