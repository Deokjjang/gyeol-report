import { depthFeature } from "./materialDepth";
import { proof, uniqueRefs } from "./copyRealizer";
import { ATOMIC_FORTUNE } from "./narrativeAtomicFortune";
import type { NarrativeState, NarrativeProof } from "./narrativeTypes";

export function careerFortune(state: NarrativeState, voice: string) {
  const priorities = voice === "inquiry" ? ["learning-depth", "lasting-assets", "recognized-place"] :
    ["wealth-and-name", "ambition-with-place", "created-value-accumulates", "lasting-assets", "recognized-place", "people-support", "show-your-thought", "outside-opportunity", "learning-depth", "lead-under-pressure", "two-charms"];
  const available = state.packet.fortuneComposites;
  const fortune = priorities.flatMap(id => available.find(f => f.ruleId === id) ?? [])[0];
  const learningMarker = fortune?.supportingEvidence.some(d => depthFeature(d.evidence.feature) === "gwiin_munchang") ? "문창" : "학당";
  const stories: Readonly<Record<string, readonly [string, string]>> = {
    "wealth-and-name": ["돈과 이름, 둘 다 작게 바라볼 필요는 없습니다", "현실적인 몫을 보는 재성에 압박 속에서 앞에 서는 힘, 장성과 반안의 자리·명예가 겹칩니다. 돈과 이름을 같이 노려볼 만한 힘입니다. 혼자 실무를 많이 해내는 데서 더 나아가 중요한 판단을 맡고 그 결과를 인정받는 쪽에 좋은 패가 있습니다. 한 번의 운 좋은 성과보다 내 결정으로 달라진 일이 쌓일 때 이 장점이 더 크게 보입니다."],
    "ambition-with-place": ["크게 바라보는 마음 옆에, 앞에 설 패도 있습니다", "성과를 향한 욕심만 있는 것이 아니라 장성과 반안의 명예·자리운도 함께 있습니다. 일을 크게 벌이고 싶은 마음을 혼자 감당하려 하면 먼저 지치지만, 사람과 역할을 나눌 수 있다면 그림이 달라집니다. 내 힘을 다 쓰는 사람이 아니라 다른 힘도 함께 쓰는 사람이 될 때 기대해볼 좋은 바탕입니다."],
    "created-value-accumulates": ["만들어낸 것이 내 자산으로 남는 쪽입니다", "솜씨가 현실의 값으로 이어지는 흐름에 재고의 축적복이 더해집니다. 한 번 끝낸 작업도 다음 상품의 기술이나 다시 찾아올 고객의 이유로 남기 좋습니다. 시간만 팔고 끝내기보다 다음에도 쓸 수 있는 결과를 만드는 쪽에서 재물의 좋은 패를 써볼 만합니다."],
    "lasting-assets": ["이번 작업이 끝나도, 실력과 고객은 남습니다", "재고귀인의 축적복은 돈만 쌓는 그림이 아닙니다. 익힌 기술과 선택의 안목, 다시 맡기고 싶은 경험도 다음 일의 밑천이 됩니다. 잘 만든 작업 하나를 매번 새 출발로 버리지 않고 내 이름의 이유로 모아갈 수 있는 좋은 패입니다. 지금 하는 일을 남이 쉽게 대신할 수 없는 경험으로 남기는 데 힘이 있습니다."],
    "recognized-place": ["잘하는 사람에서, 자리를 맡기는 사람으로", state.input.context.jobStatus === "student" ?
      "장성과 반안이 함께 있어 앞에 서고 인정받는 명예·자리의 좋은 패가 있습니다. 학생인 지금부터 높은 직함을 예언하는 말은 아닙니다. 팀 과제에서 방향을 잡거나 서로 다른 의견을 실제 결과로 이어본 경험처럼, 함께할 때 무엇을 맡길 수 있는지가 자라날 자리입니다. 질문 잘하는 학생에서 한 번 맡겨보고 싶은 사람으로 커갈 힘을 작게 볼 필요는 없습니다." :
      "장성의 앞에 서는 힘과 반안의 인정받는 자리가 함께 있습니다. 좋은 일을 조용히 만드는 것만큼 그 일을 이끄는 사람으로 이름을 남길 패도 있습니다. 고객과 동료가 방향을 묻고 싶어지는 대표, 믿고 역할을 맡기는 사람의 모습으로 이 명예운을 써볼 수 있습니다. 내 판단이 다른 사람의 일도 편하게 만들 때 존재감이 더 또렷해집니다."],
    "people-support": ["혼자만의 실력으로 끝나지 않는 사람복", "천을과 덕을 돕는 귀인의 힘이 겹쳐 사람복을 좋은 패로 말할 수 있습니다. 준비한 것을 먼저 알아보거나 막힌 부분에 다른 길을 알려주는 인연이 도움의 모습입니다. 지금 만나는 현직자나 함께 시도해보는 사람도 그런 연결을 확인할 자리가 될 수 있습니다. 혼자 다 갖춘 뒤에야 세상에 나갈 수 있는 사람은 아닙니다."],
    "learning-depth": ["어려웠던 것이, 당신에게 맡길 이유가 됩니다", `인성의 배움을 쌓는 힘에 ${learningMarker}의 학습운이 겹칩니다. 공부한 시간이 자격 이름 하나로 끝나지 않고 내 전문성으로 남을 좋은 바탕입니다. 어려운 일을 설명하고 다음 사람이 덜 헤매게 만들수록 지식은 남에게도 쓸모 있는 실력이 됩니다. 깊게 배운 분야가 당신의 경력에서 오래 지킬 자리가 될 수 있습니다.`],
    "show-your-thought": ["배운 것을 보이게 만드는 표현의 복", "식상의 표현과 문창의 정리하는 힘이 함께 있어 생각을 결과로 꺼내는 데 좋은 패가 있습니다. 글과 설명, 작품처럼 남이 보고 이해할 수 있는 모양을 만들 때 실력이 잘 드러납니다. 알고 있는 것의 양만 겨루기보다 상대가 알아듣게 된 변화에 내 값이 붙는 쪽입니다."],
    "outside-opportunity": ["바깥의 만남에서 일이 시작될 수 있습니다", "역마의 이동과 편재의 기회 감각이 만나 바깥 접점에 좋은 흐름이 있습니다. 낯선 고객의 질문이나 다른 현장의 방식에서 지금 하는 일을 넓힐 실마리를 찾는 그림입니다. 무조건 멀리 가야 한다기보다 익숙한 사람끼리만 나누던 답 밖에서 새 필요를 듣는 힘에 가깝습니다."],
    "lead-under-pressure": ["급한 때일수록 중심이 보이는 힘", "편관과 장성이 함께 있어 압박 속에서 중심을 잡고 앞에 설 좋은 패가 있습니다. 다들 누구부터 움직일지 볼 때 순서를 정하는 판단이 존재감을 만듭니다. 급한 일을 혼자 견뎌주는 사람으로만 남지 않고, 다음에는 덜 급하게 만들 결정까지 맡을 만한 힘입니다."],
    "two-charms": ["첫 관심을 오래 남는 인상으로 바꿀 수 있습니다", "도화의 눈에 띄는 매력과 홍염의 가까워질수록 살아나는 온기가 함께 있습니다. 처음 소개할 때 남는 인상과 대화가 이어질 때 느끼는 편안함은 서로 다른 좋은 패입니다. 사람을 직접 만나거나 내 작업을 소개하는 자리에서 각각의 장점을 써볼 수 있지만, 매력만으로 계약이나 수입이 정해지는 것은 아닙니다."],
  };
  if (fortune && stories[fortune.ruleId]) return { title: stories[fortune.ruleId][0], paragraphs: [stories[fortune.ruleId][1]], proof: {
    features: uniqueRefs(fortune.supportingEvidence.map(d => depthFeature(d.evidence.feature))), seedIds: [], fusionIds: [], sourceRefs: [...fortune.provenanceRefs, `v4:career-fortune:${fortune.ruleId}`],
  } satisfies NarrativeProof };
  const markers = state.packet.selected.filter(m => m.feature in ATOMIC_FORTUNE);
  const preferred = voice === "precise" ? ["twelve_sinsal_jangseong", "gwiin_geumyeorok"] : ["twelve_sinsal_yeokma", "gwiin_cheoneul", "gwiin_jaego", "twelve_sinsal_banan", "twelve_sinsal_jangseong"];
  const chosen = [...markers].sort((a, b) => (preferred.indexOf(a.feature) < 0 ? 99 : preferred.indexOf(a.feature)) - (preferred.indexOf(b.feature) < 0 ? 99 : preferred.indexOf(b.feature))).slice(0, 2);
  if (chosen.length) return { title: voice === "precise" ? "검토하는 사람에게도 앞에 설 운이 있습니다" : "지금 조용해도, 사라지지 않은 좋은 패",
    paragraphs: chosen.map(m => m.feature === "twelve_sinsal_jangseong" && voice === "precise" ?
      "장성에는 앞에 서고 인정받는 명예운이 있습니다. 꼼꼼한 사람이라고 늘 뒤에서 확인만 맡아야 하는 것은 아닙니다. 쌓인 경험을 바탕으로 이 선택이 왜 안전한지 설명하는 순간, 당신은 자료를 만드는 사람을 넘어 결정을 함께 맡는 사람이 됩니다." :
      m.feature === "twelve_sinsal_yeokma" ? "역마에는 바깥으로 움직이며 새 기회를 만나는 좋은 힘이 있습니다. 쉬는 때에도 새로운 분야의 사람을 만나거나 익숙하지 않은 배움을 접하는 경험이 다음 일을 생각할 재료가 될 수 있습니다. 당장 이직을 정해야 한다는 뜻보다, 늘 보던 선택지만이 전부는 아니라는 여지를 주는 패입니다." : ATOMIC_FORTUNE[m.feature][1]),
    proof: proof(chosen, chosen.flatMap(m => m.material.seeds.filter(s => s.role === "fortune")), [], ["v4:career-fortune:atomic"]) };
  const gifts = [state.pillar, state.master].flatMap(m => m.material.seeds.filter(s => s.role === "fortune"));
  return { title: "내가 잘해온 힘을 작은 것으로 볼 필요는 없습니다", paragraphs: gifts.map(s => s.text), proof: proof([state.pillar, state.master], gifts) };
}
