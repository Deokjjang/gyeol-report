import { getMbtiSourceProfile, type MbtiTraitArea } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { materialLabel } from "./contentEvidence";
import type { BoundMaterial } from "./materialPacket";

type Link = readonly [type: string, area: MbtiTraitArea, trait: string, labels: string, kind: "reinforce" | "tension", scene: string];
/** Domain-specific second and third lenses. Every line is bound to the exact
 * pre-existing source trait; no type guessing and no personality-from-pillar. */
const LINKS: readonly Link[] = [
  ["ISFP", "relationships", "accepting_but_boundaried", "비견", "reinforce", "맞춰주다가도 취향을 함부로 고치려 들면 조용히 선을 그어요. 비견의 자기 자리를 지키는 마음과 ISFP의 영역을 존중받고 싶은 마음이 겹칩니다. 평소의 순한 반응만 보고 무엇이든 괜찮을 거라고 생각한 상대는 그 단단함에 놀라죠."],
  ["ISFP", "relationships", "harmony_before_argument", "현침살", "tension", "현침은 어긋난 말투를 빨리 알아채는데 ISFP는 싸움으로 번지는 것을 반기지 않아요. 그래서 아무것도 몰라서 조용한 게 아닙니다. 다 알아차리고도 분위기를 깨기 싫어 넘기는 쪽이죠. 표정이 먼저 굳는 날에는 말하지 않은 이유가 꽤 쌓여 있을 수 있어요."],
  ["ISFP", "marriage", "freedom_needed_marriage", "비견|화개살", "reinforce", "집 안에서도 혼자 고를 수 있는 작은 자리가 있어야 편해요. 화개나 비견에서 읽는 자기 시간의 중요성이 ISFP의 생활 취향과 만나는 모습입니다. 함께 쉬는 날 각자 다른 영화를 보고도 식탁에서는 즐겁게 이야기할 수 있는 관계가 좋죠."],
  ["ISFP", "parenting", "friend_like_parent", "비견", "reinforce", "부모가 된다면 비견의 독립적인 기준과 ISFP의 편하게 기대게 해주고 싶은 마음을 함께 쓸 수 있어요. 아이가 고른 색이 내 취향과 달라도 바로 바꾸지 않는 식이죠. 친구처럼 놀아주는 장점이 있으면서도 내 선을 지키는 어른일 수 있습니다."],
  ["ENTJ", "love", "independence_support_need", "비견|편관|정관", "reinforce", "ENTJ가 원하는 독립성과 비견·관성에서 읽는 자기 판단의 중요성은 가까운 사이에서도 남아요. 약속을 잡을 때 모든 빈 시간을 상대에게 맡기지는 않습니다. 각자 해내고 싶은 일을 존중해주는 사람이면 떨어져 있는 시간도 응원으로 느낄 수 있죠."],
  ["ENTJ", "relationships", "useful_support_style", "편인|정인|문창귀인", "reinforce", "상대가 고민을 털어놓으면 위로 한마디보다 찾아볼 정보부터 떠오를 때가 있어요. 인성·문창의 이해하고 설명하는 힘을 ENTJ는 해결에 쓰고 싶은 거죠. 본인은 정성을 쏟았는데 상대는 아직 자기 이야기를 덜 했다고 느끼기도 합니다. 답을 잘 찾는 재능 옆에 끝까지 듣는 시간을 놓으면 도움이 훨씬 따뜻해져요."],
  ["ENTJ", "marriage", "decision_authority_agreement", "정관|편관|정재", "reinforce", "집과 돈을 정할 때도 누가 무엇을 결정하는지 알고 싶어요. 재관의 현실적인 기준에 ENTJ의 빠른 결정이 붙으면 미뤄둔 일이 잘 정리되죠. 다만 이미 정한 답을 설명하는 것과 처음부터 함께 고르는 것은 다릅니다. 생활을 잘 꾸리는 힘을 둘의 선택을 넓히는 데 쓸 수 있어요."],
  ["ENTJ", "parenting", "serious_responsible_parent", "정관|편관", "reinforce", "부모가 된다면 관성의 책임감과 ENTJ의 방향을 잡는 힘이 아이의 하루에도 들어가요. 숙제부터 끝낼지 잠깐 쉬었다 할지 순서를 정하는 데 망설임이 적죠. 지켜야 할 기준이 있다는 든든함은 장점입니다. 다만 아이가 원하는 도움이 계획표인지 같이 앉아 있는 시간인지는 들어볼 만해요."],
  ["ENFP", "relationships", "likes_and_dislikes_visible", "홍염살|비견", "reinforce", "좋아하는 사람이 들어오면 다른 사람보다 반응이 한 박자 빨라져요. ENFP의 표정에 드러나는 호감이 홍염의 친밀한 반응, 비견의 분명한 취향과 닿습니다. 친구에게 관심 없다고 했는데 그 사람 이야기만 유난히 자세히 기억하고 있지는 않나요?"],
  ["ENFP", "marriage", "freedom_in_marriage", "비견|역마살", "reinforce", "비견·역마에서 읽는 자기 선택과 새로운 경험은 ENFP에게도 중요한 즐거움이에요. 같이 산다고 서로의 취미까지 하나가 될 필요는 없죠. 따로 다녀온 모임 이야기가 저녁의 새 대화가 되면, 자유가 거리감보다 관계의 생기로 남습니다."],
  ["ENFP", "marriage", "domestic_follow_through_gap", "정재|정관", "tension", "재관의 기운은 생활의 약속을 분명히 보고 싶은데 ENFP는 그날 떠오른 재미에도 마음이 빨리 움직여요. 집을 정리하다 발견한 사진을 보느라 정리는 멈추는 식이죠. 기준을 싫어하는 사람이라기보다 하고 싶은 일이 옆에서 자꾸 말을 거는 쪽입니다. 작게라도 끝나는 약속을 두면 다정함이 신뢰로도 남아요."],
  ["INFJ", "love", "noise_sensitive_date", "편인|정인", "reinforce", "인성의 깊이 들여다보는 힘과 INFJ의 조용히 마음을 여는 방식은 만나는 장소에서도 보여요. 시끄러운 곳에서 무리해 재밌는 말을 할 때보다 나란히 걸으며 한 가지를 오래 이야기할 때 더 가까워집니다. 흥분시키는 사람만큼 편하게 숨 쉬게 하는 사람이 기억에 남죠."],
  ["INFJ", "marriage", "private_time_needed", "편인|비견|화개살", "reinforce", "혼자 생각을 모으는 명리의 결에 INFJ의 회복 시간이 겹칩니다. 같이 사는 사람이 좋아도 문을 닫고 책 한 장을 조용히 읽고 싶은 밤이 있어요. 그 시간이 마음이 식었다는 증거는 아닙니다. 머릿속 소리가 잦아든 뒤에는 오히려 상대의 이야기를 더 오래 들을 수 있죠."],
  ["INTP", "relationships", "respect_for_listening_mind", "현침살|문창귀인|정인", "reinforce", "현침·문창·정인의 정확히 알고 싶은 힘을 INTP는 대화의 태도에서도 써요. 모른다고 솔직히 말하는 사람보다 틀린 설명을 끝까지 우기는 사람에게 더 답답해집니다. 같이 정답을 찾을 수 있다는 느낌이 호감이 되는 쪽이죠. 논쟁에서 이기는 것보다 생각을 바꿀 줄 아는 사람을 오래 기억합니다."],
  ["INTP", "parenting", "parent_needs_alone_time", "비견|편인|화개살", "reinforce", "부모가 된다면 혼자 생각을 정리하는 시간이 아이에게도 도움이 될 수 있어요. 비견·편인·화개의 자기 시간과 INTP의 머릿속 정돈이 만나는 지점입니다. 질문 열 개에 곧장 답하느라 지친 날보다 잠깐 쉬고 돌아온 날에 아이의 엉뚱한 질문도 재미있게 받아줄 수 있죠."],
  ["ESTP", "relationships", "intent_reader", "현침살|편인", "reinforce", "현침과 편인의 놓친 뜻을 보는 힘에 ESTP의 빠른 현장 반응이 붙어요. 말을 믿고 기다리는 동안에도 표정과 행동이 달라졌는지는 이미 보고 있죠. 눈치가 빨라 함께 있는 분위기를 바꾸는 데 능하지만, 알아챈 것과 확인한 것을 나누면 불필요한 오해도 줄어듭니다."],
  ["ESTP", "marriage", "freedom_time_contract", "비견|역마살|식신", "reinforce", "같이 살아도 서로 움직일 자유가 남아 있어야 즐거워요. 비견·역마·식신의 선택과 활동을 ESTP는 함께 해보는 경험으로 꺼냅니다. 갑자기 떠나는 산책 하나도 생활에 재미를 넣죠. 어디까지는 즉흥적으로 해도 괜찮은지 알면 자유가 불안 대신 활기가 됩니다."],
  ["ISFJ", "relationships", "hard_to_enter_reliable_once_in", "비견|정인", "reinforce", "정인의 오래 쌓는 믿음과 비견의 자기 기준은 ISFJ에게도 낯설지 않아요. 처음에는 예의 있게 대하다가 편해진 사람에게는 아주 오래 같은 편이 됩니다. 여러 사람에게 빨리 마음을 나누는 것보다 몇 사람과 쌓은 기억이 훨씬 든든하죠."],
  ["ISFJ", "marriage", "gratitude_needed_marriage", "정인|정재", "reinforce", "정인·정재의 꾸준히 챙기는 힘을 ISFJ는 반복되는 생활에서 보여줘요. 다 쓴 세제를 채워두거나 상대 일정에 맞춰 저녁을 미루는 작은 수고입니다. 너무 자연스러워서 아무도 못 본 척하면 서운함도 커지죠. 그 정성을 알아보는 한마디가 다시 다정해질 여유를 만듭니다."],
  ["ISTJ", "relationships", "few_but_stable_bonds", "비견|편인", "reinforce", "비견·편인의 자기 기준과 ISTJ의 담백한 관계 방식이 겹쳐요. 연락이 뜸하다고 사이가 바로 끝났다고 보지 않습니다. 오랜만에 만나도 필요한 일을 정확히 기억하고 돕는 쪽이죠. 자주 반응해야 안심하는 사람에게는 이 편안함을 조금 설명해줄 필요가 있어요."],
];

export function relationshipMbtiReading(type: string | null | undefined, roots: readonly BoundMaterial[], chapter: string, used: ReadonlySet<string>) {
  const profile = getMbtiSourceProfile(type); if (!profile) return null;
  const areas: readonly MbtiTraitArea[] = chapter === "pair-nonromantic" ? ["relationships"] : chapter === "parenting" ? ["parenting"] : chapter === "home" ? ["marriage"] : ["love", "relationships", "marriage"];
  for (const [t, area, id, labels, kind, scene] of LINKS) {
    if (t !== profile.type || !areas.includes(area) || used.has(`${t}:${id}`)) continue;
    const trait = profile.traits?.[area]?.find(v => v.id === id), root = roots.find(m => labels.split("|").includes(materialLabel(m)));
    if (!root || !trait || !["direct", "inferred"].includes(trait.sourceCoverage ?? "")) continue;
    // Multi-root alternatives in the copy name only confirmed roots. This is
    // textual realization of this exact allowlist, not dynamic interpretation.
    const present = roots.filter(m => labels.split("|").includes(materialLabel(m))).map(materialLabel);
    const text = scene.replace(/비견·관성|인성·문창|재관|화개나 비견|정인·정재|비견·편인·화개|비견·역마·식신|비견·역마|비견·편인|현침·문창·정인|현침과 편인/g, () => present.join("·"));
    // A few source lines discuss two separate faces, not alternatives. Both
    // must really be present; never silently turn one into the other.
    if (id === "hard_to_enter_reliable_once_in" && !(present.includes("정인") && present.includes("비견"))) continue;
    if (id === "likes_and_dislikes_visible" && !(present.includes("홍염살") && present.includes("비견"))) continue;
    return { id: `${t}:${id}`, root, roots: roots.filter(m => present.includes(materialLabel(m))), text, kind, area,
      provenance: `mbti:${t}:traits:${area}:${id}`, coverage: trait.sourceCoverage };
  }
  return null;
}
