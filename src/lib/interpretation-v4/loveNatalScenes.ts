import { paragraph, proof } from "./copyRealizer";
import type { NarrativeState, NarrativeSection } from "./narrativeTypes";

type Scene = { title: string; text: string; family: string };
const SCENES: Readonly<Record<string, Scene>> = {
  ten_god_qi_sha: { title: "평소엔 조용한데, 내 사람 일에는 단단해집니다", family: "protecting-boundary", text: "평소에는 맞춰줘도 가까운 사람이 억울한 일을 겪으면 태도가 달라집니다. 소중한 것을 지키려는 힘이 있어, 난처한 상황을 보고도 모르는 척하기는 어렵습니다. 상대는 그런 순간에 당신이 생각보다 단단하다는 걸 알게 됩니다. 다만 지켜주고 싶은 마음이 클수록 상대가 직접 해보겠다는 선택까지 받아들일 여유는 남겨둘 만합니다." },
  ten_god_bijian: { title: "좋아한다고 취향까지 하나가 되지는 않습니다", family: "separate-friends", text: "내 사람과 함께해도 원래 좋아하던 취미와 친구까지 접어두고 싶지는 않습니다. 비견의 자기 자리를 지키는 힘은 관계에서도 남습니다. 서로 다른 모임을 다녀온 뒤 재미있었던 일을 이야기할 수 있다면, 떨어져 있던 시간이 오히려 새 대화가 됩니다. 맞춰주는 것만 애정으로 세지 않는 상대 앞에서 당신의 편한 표정이 더 많이 나옵니다." },
  ten_god_zheng_cai: { title: "사소한 지출에도, 둘의 기준이 보입니다", family: "everyday-spending", text: "정재의 현실감각은 좋아하는 마음을 실제로 지킬 수 있는 크기로 옮기는 데 쓰입니다. 한번 크게 쓰고 다음 만남을 부담스러워하기보다 무리 없이 이어갈 약속을 좋아하는 쪽입니다. 여행 비용이나 평소 식사비도 누가 더 사랑하느냐의 시험보다 함께 편하게 즐길 기준이 될 수 있습니다. 화려함보다 다음에도 자연스럽게 만날 여유를 남기는 사랑입니다." },
  ten_god_zheng_yin: { title: "괜찮은 척하지 않아도 되는 저녁", family: "receiving-care", text: "정인의 이해하고 받쳐주는 힘이 있어, 상대의 사정을 알고 나면 쉽게 모른 척하지 못합니다. 잘한 이야기를 들을 때만 반가운 것이 아니라 일이 마음대로 안 된 날에도 편을 들어주고 싶습니다. 반대로 나도 지친 날에는 해낸 일을 설명하지 않고 쉬어도 되는 사람이 필요합니다. 서로 기댈 수 있을 때 돌봄은 한쪽의 의무가 아니라 관계의 좋은 바탕이 됩니다." },
  ten_god_shi_shen: { title: "맛있는 걸 보면, 같이 먹을 사람이 먼저 떠오릅니다", family: "shared-food", text: "식신의 다정함은 거창한 말보다 같이 누리는 즐거움에 가깝습니다. 맛있었던 것을 기억해두고 다음에 함께 먹고 싶어지는 마음, 괜찮은 장소를 발견하면 보여주고 싶은 마음입니다. 무언가를 증명하지 않아도 한 끼를 편하게 나눌 수 있는 상대가 좋습니다. 즐거웠던 감각이 쌓이면 평범한 장소에도 둘만 아는 기억이 남습니다." },
  ten_god_pian_cai: { title: "둘이 다른 곳에 가보면 드러나는 얼굴", family: "travel-choice", text: "편재의 바깥 기회를 보는 힘은 익숙한 길을 벗어날 때 연애에도 생기를 줍니다. 처음 가본 곳에서 우연히 발견한 가게, 예상과 달랐는데 더 재미있었던 일정에 반응합니다. 모든 선택이 미리 맞아떨어져야만 즐거운 사람은 아닙니다. 함께 뜻밖의 일을 웃어넘길 수 있는 상대라면 여행이 서로를 더 알아보는 경험이 됩니다." },
  ten_god_shang_guan: { title: "친해지면, 조용한 얼굴 뒤의 농담도 나옵니다", family: "private-humor", text: "상관의 표현하는 힘이 있어 관계가 편해지면 말맛이 살아납니다. 처음에는 조심스럽게 넘겼던 장면을 재미있게 짚고, 둘만 이해하는 농담을 만들 수 있습니다. 다만 웃자고 한 관찰이 상대의 약점을 정확히 건드릴 때도 있습니다. 재치가 좋다는 것은 늘 더 센 말을 해야 한다는 뜻이 아니라, 같은 상황을 조금 가볍게 볼 길이 있다는 뜻입니다." },
  "v4_structure:outputHeavy": { title: "담담한 사람도, 좋아하는 일 앞에서는 설명이 길어집니다", family: "sharing-skill", text: "표현과 결과물을 만들어내는 힘이 뚜렷합니다. 마음을 직접 말하는 것이 어색해도 잘 아는 것을 보여주거나 함께 손대는 일을 통해 친해질 길이 있습니다. 무언가를 고르고 비교하거나 같이 만들 때 평소보다 말이 많아지는 식입니다. 상대에게는 생각보다 재미있는 사람이었다는 발견이 되고, 당신도 잘해야 한다는 부담 없이 능숙함을 나눌 수 있습니다." },
  "v4_structure:resourceHeavy": { title: "지나간 한마디가, 다음 만남의 다정함이 됩니다", family: "remembered-comfort", text: "들어온 이야기를 오래 품고 이해하는 힘이 큽니다. 상대가 어떤 일에 지쳤고 무엇을 고마워했는지 기억했다가 다음 선택에 반영합니다. 한 번 듣고 흘리는 사람이 아니라는 점은 오래 만날 때 특히 좋은 장점입니다. 다만 내가 기억한 모습과 오늘의 마음이 같다고 단정하지 않으면, 익숙한 연인도 계속 새롭게 알아갈 수 있습니다." },
  "v4_structure:killingResourceFlow": { title: "둘 사이에 문제가 생겼을 때, 도망보다 이해를 고릅니다", family: "learning-under-pressure", text: "압박을 배움과 이해로 바꾸는 힘이 있습니다. 어려운 대화가 생겼을 때 바로 등을 돌리기보다 무엇이 꼬였는지 알아보고 싶은 쪽입니다. 서로 다른 생활방식을 처음 맞출 때도 이유를 알면 타협할 길이 더 잘 보입니다. 관계를 완벽한 문제풀이로 만들지만 않는다면, 한번 부딪힌 자리에서 다음에는 더 잘 알아듣는 사람이 될 힘입니다." },
  "v4_structure:officerResourceFlow": { title: "말뿐인 약속이 아니라, 기대어도 되는 태도", family: "reliability-and-care", text: "책임을 지려는 마음과 상대를 이해하려는 힘이 함께 받쳐줍니다. 지켜야 한다는 원칙만 앞세우기보다 사정을 듣고, 무엇을 도울 수 있을지 생각합니다. 어려운 부탁을 무조건 허락하는 것과 끝까지 맡을 수 있는 도움은 다르다는 감각이 중요합니다. 당신의 좋은 점은 거절을 모르는 착함보다, 믿고 나눈 일을 가볍게 잊지 않는 태도에 있습니다." },
};
const PRIORITY: Readonly<Record<string, readonly string[]>> = {
  sensory: ["ten_god_qi_sha", "ten_god_bijian"],
  decisive: ["ten_god_zheng_cai", "ten_god_zheng_yin"],
  associative: ["ten_god_shi_shen", "ten_god_pian_cai"],
  depth: ["ten_god_shang_guan", "ten_god_zheng_cai"],
  faithful: ["v4_structure:outputHeavy", "v4_structure:resourceHeavy"],
  inquiry: ["v4_structure:killingResourceFlow", "ten_god_shi_shen"],
  radiant: ["ten_god_bijian", "ten_god_zheng_cai"],
  caring: ["v4_structure:officerResourceFlow", "ten_god_zheng_yin"],
};
/** Same evidence in a different domain; variants are keyed by meaning, not fixtures. */
const VARIANTS: Readonly<Record<string, Readonly<Record<string, Scene>>>> = {
  depth: { ten_god_zheng_cai: { title: "돈 이야기도 편하게 꺼낼 수 있는 사이", family: "household-budget", text: "일상의 비용을 분명히 하는 정재의 힘은 가까운 사이에서 오히려 여유를 만듭니다. 돈 때문에 눈치를 보지 않아도 되면 마음을 알아주는 데 더 많은 시간을 쓸 수 있습니다. 얼마를 써도 되는지, 큰 지출은 언제 함께 정할지를 아는 관계가 편합니다. 낭만과 생활비는 반대말이 아니라 오래 함께하려는 마음의 서로 다른 표현입니다." } },
  inquiry: { ten_god_shi_shen: { title: "머릿속이 복잡해도, 같이 먹는 한 끼는 편합니다", family: "shared-food", text: "생각이 길어지는 당신에게도 설명 없이 나눌 즐거움이 있습니다. 식신의 일상을 누리는 힘은 좋아하는 음식을 함께 고르거나 손으로 간단한 것을 만드는 시간에 나타납니다. 늘 깊은 주제를 이야기해야만 좋은 만남은 아닙니다. 별다른 결론 없이도 기분 좋게 헤어지는 경험이 친밀함을 받쳐줍니다." } },
  radiant: {
    ten_god_bijian: { title: "같이 신나도, 내 선택까지 맡기지는 않습니다", family: "independent-choice", text: "겉으로 잘 어울려도 비견의 자기 기준은 남아 있습니다. 좋아하는 사람이 원한다고 모든 모임에 따라가거나 관심사까지 바꾸지는 않으려 합니다. 함께 즐기는 능력과 각자의 선택을 인정하는 태도가 같이 있으면 관계가 덜 답답합니다. 다른 의견을 냈다고 즐거운 분위기가 끝나는 사이는 당신에게 편하지 않습니다." },
    ten_god_zheng_cai: { title: "즐겁게 쓰는 돈 옆에, 남겨두고 싶은 몫도 있습니다", family: "enjoyment-budget", text: "흥이 나는 순간에도 정재의 꾸준히 남기려는 감각이 한쪽에 있습니다. 만나서 즐겁게 쓰는 것과 다음 달까지 부담을 끌고 가는 것은 다르다고 느낍니다. 둘이 해보고 싶은 일의 크기만큼 어디까지 쓸지 말할 수 있다면 돈 이야기가 분위기를 깨는 일이 되지 않습니다. 잘 즐기는 사람도 자기 생활은 지키고 싶습니다." },
  },
  caring: { ten_god_zheng_yin: { title: "연인의 편이 되어줄 때, 나도 같은 편에 있어야 합니다", family: "mutual-support", text: "정인의 따뜻함은 상대가 말하기 어려운 사정을 조금 더 들어주는 데서 드러납니다. 급하게 평가하기보다 왜 힘들었는지 이해하려는 태도입니다. 다만 위로하는 역할이 오래 고정되면 내 힘든 일은 나중으로 미뤄지기 쉽습니다. 내가 기대는 날에도 상대가 자리를 내어준다면, 당신의 다정함은 줄어드는 것이 아니라 오래 갈 힘을 얻습니다." } },
};
export function loveNatalScenes(state: NarrativeState, voice: string): readonly NarrativeSection[] {
  const chosen = (PRIORITY[voice] ?? []).flatMap(feature => {
    const material = state.packet.selected.find(m => m.feature === feature);
    // A relationship seed must already exist; no work-only structure remapping.
    if (!material?.material.seeds.some(s => s.role === "love" || s.role === "relationships")) return [];
    const scene = VARIANTS[voice]?.[feature] ?? SCENES[feature];
    return [{ material, scene }];
  }).slice(0, 2);
  return chosen.map(({ material, scene }, i) => ({ id: `natal-scene-${i}`, title: scene.title, domain: "relationships",
    blocks: [{ ...paragraph(`love-natal-scene-${i}`, scene.text, proof([material], [], [], [`v4:love-natal-scene:${voice}:${material.feature}`]), "positive", scene.family), editorial: { variant: `${voice}:${material.feature}`, sceneFamily: scene.family } }],
  }));
}
