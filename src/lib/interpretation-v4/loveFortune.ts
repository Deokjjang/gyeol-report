import { paragraph, proof } from "./copyRealizer";
import type { NarrativeState } from "./narrativeTypes";

const DOHWA: Readonly<Record<string, string>> = {
  decisive: "도화의 좋은 패는 처음 마주쳤을 때 존재감이 남는 쪽입니다. 만남을 자신 있게 이끄는 태도와 표정이 관심의 문을 엽니다. 멀리서도 눈에 들어오는 매력이 있으니, 매 순간 상대를 설득하려고 애쓸 필요는 없습니다.",
  depth: "도화가 주는 첫인상의 힘이 있습니다. 말이 많지 않아도 분위기와 태도가 먼저 기억에 남을 수 있습니다. 당신이 속마음을 천천히 여는 것과 별개로, 누군가는 생각보다 일찍 당신을 눈여겨봅니다.",
  radiant: "도화는 눈길이 머무는 매력입니다. 여럿이 있는 자리에서 웃고 반응하는 얼굴만으로도 말을 걸 계기가 생깁니다. 당신에게는 만남의 첫 장면을 환하게 만드는 좋은 패가 있습니다.",
  caring: "도화의 매력은 꼭 화려한 행동으로만 나타나지 않습니다. 상대를 편하게 맞이하는 표정이나 단정한 분위기가 처음의 호감을 만들기도 합니다. 친해지기 전부터 좋은 인상이 남는다는 것은 관계를 시작할 때 분명한 장점입니다.",
  natal: "첫인상에서 사람의 시선을 끄는 도화의 매력이 있습니다. 처음 간 자리에서도 말 걸 계기가 생기고, 아직 서로를 잘 몰라도 분위기가 기억에 남습니다. 모든 관심에 답해야 하는 의무가 아니라 내 이야기를 시작하게 하는 좋은 문입니다.",
};
const HONGYEOM: Readonly<Record<string, string>> = {
  decisive: "홍염은 첫눈의 주목과 다른 좋은 매력입니다. 여럿 앞에서 보인 단호함이 둘이 있을 때의 부드러운 반응으로 바뀌면, 가까이 온 사람은 그 차이를 크게 느낍니다. 처음의 존재감 뒤에 오래 알고 싶은 온기가 남는 쪽입니다.",
  associative: "홍염의 매력은 알아갈수록 짙어집니다. 둘이 이야기하며 나오는 표정과 말투, 상대의 말에 살아나는 반응이 친밀함을 만듭니다. 첫 만남보다 두 번째, 세 번째 만남에서 더 매력적으로 느껴질 좋은 패입니다.",
  inquiry: "홍염이 있어 가까운 대화에서 살아나는 매력이 좋습니다. 평소 담담하던 사람이 흥미로운 이야기에 웃고 풀어지는 순간은 상대에게 특별하게 남습니다. 모두에게 같은 친근함을 보여주지 않기에 둘만의 온도가 더 선명해질 수 있습니다.",
  sensory: "가까워질수록 매력이 커지는 홍염의 기운이 있습니다. 말로 크게 알리지 않던 다정함이 둘이 편하게 있는 순간 드러납니다. 천천히 마음을 여는 사람 안에 따뜻한 반응이 있어, 알아가는 시간이 매력을 더해줍니다.",
  natal: "홍염은 가까운 사이에서 느껴지는 친밀한 매력입니다. 둘이 편해진 뒤의 말투와 표정에 온기가 살아납니다. 멀리서 한번 보고 끝낼 때보다 알아갈수록 더 좋은 사람이라는 인상을 남길 힘입니다.",
};
const HELPERS: Readonly<Record<string, string>> = {
  decisive: "사람복도 당신의 좋은 패입니다. 모든 일을 직접 정리하는 모습 뒤에서 필요한 때 도움을 받을 길도 있습니다. 믿을 만한 사람의 조언을 받아들이고 수고를 나누면, 연애도 혼자 책임지는 일이 아니라 같이 든든해지는 경험이 됩니다.",
  associative: "가까운 사이에 쌓인 온화한 신뢰가 관계를 돕는 좋은 흐름입니다. 재미있는 일에만 함께하는 사람을 넘어, 마음이 복잡한 날에도 말을 나눌 인연이 힘이 됩니다. 좋은 반응을 주고받는 재주는 즐거움뿐 아니라 오래 남는 사람복으로도 쓸 수 있습니다.",
  depth: "좋은 사람의 도움을 받을 인복이 있습니다. 혼자 오래 고민하는 순간에도 내 생각을 판단하지 않고 들어줄 사람이 관계의 힘이 됩니다. 당신이 깊게 마음을 주는 능력과 사람에게 기대는 경험은 서로 반대가 아닙니다.",
  inquiry: "관계를 거칠게 몰아가기보다 한 번 더 이해할 여지가 좋은 패입니다. 생각이 달라도 대화를 이어갈 사람, 막혔을 때 다른 관점을 건네는 인연이 도움을 줍니다. 머릿속에서만 풀리지 않던 마음이 누군가의 한마디 덕분에 가벼워지는 경험도 당신의 인복에 포함됩니다.",
  radiant: "주목받는 힘과 별개로 좋은 사람에게 도움받을 사람복이 있습니다. 즐거운 모임만큼 필요할 때 진심으로 손을 보태는 인연도 소중한 패입니다. 밝게 만나는 사람이 많아도 가까이 둘 사람은 내 사정을 편하게 이야기할 수 있는 쪽이 좋습니다.",
  caring: "사람복이 있습니다. 내 수고를 알아보고 힘든 날에 먼저 손을 내미는 인연을 기대할 좋은 재료입니다. 배려를 주는 역할에만 머무르지 않을 때, 당신이 쌓아온 신뢰가 돌봄을 받는 경험으로도 돌아올 자리가 생깁니다.",
  natal: "좋은 도움과 관계를 만날 사람복이 있습니다. 혼자 견디던 일도 믿을 만한 사람과 나누면 선택의 폭이 넓어집니다. 누군가의 호의를 받을 줄 아는 것도 가까운 관계에서 쓸 수 있는 좋은 힘입니다.",
};

export function loveFortune(state: NarrativeState, voice: string) {
  const find = (feature: string) => state.packet.selected.find(m => m.feature === feature);
  const blocks = [];
  for (const [feature, copies] of [["sinsal_dohwa", DOHWA], ["sinsal_hongyeom", HONGYEOM]] as const) {
    const m = find(feature); if (!m) continue;
    blocks.push(paragraph(`love-${feature}`, copies[voice] ?? copies.natal, proof([m], [], [], [`v4:love-fortune:${feature}:${voice}`]), "positive"));
  }
  const helper = ["gwiin_cheoneul", "gwiin_woldeok", "gwiin_cheondeok"].map(find).find(Boolean);
  if (helper) blocks.push(paragraph("love-people-luck", HELPERS[voice] ?? HELPERS.natal, proof([helper], [], [], [`v4:love-helper:${voice}`]), "positive", "receiving-help"));
  else {
    const amrok = find("gwiin_amrok"), geumyeo = find("gwiin_geumyeorok");
    if (amrok) blocks.push(paragraph("love-quiet-support", "암록은 드러나지 않게 받쳐주는 도움의 좋은 패입니다. 큰 말을 해주기보다 필요한 것을 조용히 챙겨주는 인연, 막막한 날에 부담 없이 연락할 사람이 힘이 됩니다. 눈에 띄는 고백만큼 평소 내 편에서 움직인 작은 수고도 사랑을 알아보는 단서가 됩니다.", proof([amrok]), "positive", "quiet-support"));
    else if (geumyeo) blocks.push(paragraph("love-good-living", "금여록의 좋은 결은 서로를 귀하게 대하는 생활에서 빛납니다. 비싼 선물보다 편안한 자리와 정성 있는 대접을 알아보는 감각입니다. 거창한 조건만 보지 않아도 일상을 품위 있게 나눌 수 있는 사람의 가치를 알아볼 좋은 패가 있습니다.", proof([geumyeo]), "positive", "mutual-respect"));
  }
  const leader = find("twelve_sinsal_jangseong"), seat = find("twelve_sinsal_banan");
  // Strength in a relationship, never a promise about the future partner's status.
  if (leader && seat && voice === "decisive") blocks.push(paragraph("love-steady-presence", "장성과 반안이 함께 있어 앞에 서고 신뢰를 얻는 존재감도 좋습니다. 둘이 갑자기 계획을 바꿔야 하거나 난처한 선택을 할 때 ‘같이 있으면 어떻게든 해보겠구나’라는 인상을 줄 수 있습니다. 주도하는 힘을 상대의 선택까지 빼앗는 데만 쓰지 않으면, 든든함은 충분히 매력이 됩니다.", proof([leader, seat]), "positive", "shared-decision"));
  if (!blocks.length) {
    const seed = state.pillar.material.seeds.find(s => s.role === "strength")!;
    const love = state.pillar.material.seeds.find(s => s.role === "love");
    blocks.push(paragraph("love-natal-gift", `${seed.text} ${love?.text ?? "내 마음을 존중하는 태도는 상대를 알아갈 때도 중요한 바탕입니다."} 내 장점이 자연스럽게 나오는 관계에서는 억지로 다른 사람이 될 필요가 줄어듭니다.`, proof([state.pillar], [seed, ...(love ? [love] : [])]), "positive"));
  }
  return blocks;
}
