import { paragraph } from "./copyRealizer";
import type { NarrativeState } from "./narrativeTypes";

/** Symbolic partner imagery, not the other person's unknown chart or a causal rule. */
export function loveBalance(state: NarrativeState, voice: string) {
  const priorities: Readonly<Record<string, readonly string[]>> = { faithful: ["METAL", "FIRE"], radiant: ["WATER", "FIRE"] };
  const lows = state.packet.symbolicElements.filter(e => e.state === "low");
  const low = priorities[voice]?.map(element => lows.find(e => e.element === element)).find(Boolean) ?? lows[0];
  if (!low) return;
  const copy = {
    WATER: voice === "radiant" ? "수의 차분한 흐름을 사람 모습으로 떠올리면, 즐거운 만남 뒤에 편안히 숨을 고르게 해주는 사람이 어울립니다. 내 흥을 꺾지 않으면서 오늘 있었던 일을 조용히 들어주는 사람입니다. 늘 같이 뛰어야만 가까운 사이인 것은 아니고, 천천히 걷는 시간도 함께 좋은 사람이 든든할 수 있습니다." : "수의 여유를 사람 이미지로 옮기면, 내가 서둘러 결론을 내릴 때 감정부터 조용히 들어주는 사람이 떠오릅니다. 독서나 공부처럼 천천히 파고드는 시간을 좋아하는 사람도 한 모습입니다. 덜 드러난 수를 이런 상징으로 바라보면, 더 세게 밀어붙이는 사람보다 한 박자 쉬게 해주는 관계가 편할 수 있습니다.",
    FIRE: voice === "caring" ? "화의 따뜻한 표현을 닮은 사람을 떠올려볼 만합니다. 고마웠던 일을 말로 알려주고, 내가 먼저 챙기지 않아도 반가움을 보여주는 사람입니다. 조용한 배려 옆에 알아듣기 쉬운 표현이 놓이면 혼자 마음을 짐작하느라 힘을 덜 써도 됩니다." : "화가 덜 드러난 결을 생활의 이미지로 보면, 마음을 따뜻하게 표현하고 먼저 분위기를 풀어주는 사람이 잘 어울립니다. 내 이야기에 편하게 웃어주고 자기 마음도 숨기지 않는 모습입니다. 밝게 보여야 한다는 의무보다 서로의 반응을 부담 없이 주고받는 관계를 떠올리면 됩니다.",
    EARTH: "토의 안정된 땅을 사람으로 그리면 생활 리듬과 약속이 일정한 사람입니다. 만나기로 한 날과 돈을 나누기로 한 기준이 자주 바뀌지 않는 모습입니다. 재미를 줄이는 사람보다 즐거운 경험 뒤의 일상까지 함께 지킬 사람이 편할 수 있습니다.",
    METAL: voice === "faithful" ? "금의 분명한 선을 닮은 사람은 기준을 강요하기보다 서로 정한 범위를 지킵니다. 가족 부탁이나 큰 지출 앞에서도 둘의 의견을 먼저 확인하는 모습입니다. 작은 일까지 내가 매번 점검하지 않아도 되는 상대라면 책임감 사이에 쉴 틈이 생깁니다." : "금의 구분하는 힘을 관계의 이미지로 옮기면, 도울 일과 쉴 시간을 명확히 말할 줄 아는 사람이 떠오릅니다. 거절을 곧 미움으로 받지 않고 내 경계도 존중하는 사람입니다. 사람 마음을 오래 살피는 당신에게는 이런 분명함이 오히려 편안한 여유가 될 수 있습니다.",
    WOOD: "목의 가지가 뻗는 모습을 닮은 사람은 새로운 경험을 재촉이 아니라 초대로 건넵니다. 다 알아본 뒤에 움직이려 할 때 작은 시도 하나를 같이 해보자는 사람입니다. 생각을 그만하라는 말 대신 궁금한 것을 밖에서도 만나게 해주는 관계가 어울릴 수 있습니다.",
  }[low.element];
  return { low, block: paragraph("love-symbolic-partner", copy, { features: [low.material.feature], seedIds: [], fusionIds: [], sourceRefs: [...low.sourceRefs, "v4:love-symbolic-partner"] }, "direction", "partner-environment") };
}
