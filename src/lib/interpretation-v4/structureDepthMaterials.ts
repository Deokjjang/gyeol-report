import { STRUCTURE_MATERIALS } from "./structureMaterials";
import { depth, type DepthCopy } from "./materialDepthTypes";
import type { StructureId } from "./structureTypes";

type Extra = readonly [inside: string, scene: string, punch: string, question: string, ending: string];
const extras: Readonly<Record<StructureId, Extra>> = {
  wealthHeavyWeakDaymaster: ["눈앞의 기회를 놓치기 싫어 이미 찬 일정에도 하나 더 넣고 싶어집니다.", "쉬려고 카페에 왔는데 옆 테이블 이야기에서 새 일거리를 떠올립니다.", "벌 시간을 늘렸는데 정작 쓸 시간은 사라졌습니다.", "큰 성과를 원하면서도 혼자 감당할 일이 너무 많다고 느끼나요?", "현실을 보는 눈에 함께할 사람의 힘이 더해지면 혼자보다 큰 것을 남길 여지가 있습니다."],
  outputCreatesWealth: ["내가 재미있게 만든 것이 누군가에게 필요한 순간 가장 신납니다.", "친구에게 만들어준 것이 좋아서 또 부탁받자 작은 판매를 떠올립니다.", "좋아서 하던 취미에도 어느새 원가를 계산하고 있습니다.", "잘 만든 것을 보고 이걸 원하는 사람이 있겠다고 느낀 적 있나요?", "당신의 좋은 솜씨는 남의 생활에 들어갈 때 값어치를 얻습니다."],
  wealthCreatesOfficer: ["해낸 것이 쌓이면 더 중요한 판단에도 내 의견이 들어가길 바랍니다.", "성과를 낸 뒤 다음 계획을 정하는 자리에 초대받는 것이 반갑습니다.", "일은 커졌는데 내 결정권만 그대로인 순간이 제일 답답합니다.", "돈만 늘어나는 것보다 맡는 자리도 같이 커질 때 보람이 있나요?", "당신이 남긴 결과는 다음에 무엇을 맡길지 생각하게 만듭니다."],
  officerResourceFlow: ["책임이 생길수록 자신 있게 답할 근거를 더 배우고 싶어집니다.", "처음 맡은 일을 앞두고 예전 기록과 필요한 지식을 차근차근 읽습니다.", "아는 것만 해도 충분한데 모르는 한 가지 때문에 자신감이 줄어듭니다.", "맡은 역할 덕분에 전보다 더 깊이 공부하게 된 적 있나요?", "당신이 익힌 지식은 맡은 자리의 무게를 견디는 실력이 됩니다."],
  killingResourceFlow: ["피하고 싶은 문제도 이유를 알아내면 내 무기가 될 수 있다고 느낍니다.", "처음엔 막막했던 일을 풀려고 배운 기술을 다음에는 남에게 설명합니다.", "다 잘 이겨냈는데 왜 자꾸 어려운 일만 내게 오나 싶습니다.", "버거웠던 경험이 나중에는 남보다 잘 아는 분야가 된 적 있나요?", "어려웠던 것을 이해한 시간은 다음 문제 앞에서 당신의 편이 됩니다."],
  hurtingOfficerMeetsOfficer: ["사람보다 잘못된 방식이 싫은데 상대는 자신을 공격한다고 듣기도 합니다.", "늘 하던 방식이라는 대답에 왜 그래야 하는지 한 번 더 묻습니다.", "문제만 고치려 했는데 윗사람 기분까지 건드렸습니다.", "직급이 높아도 앞뒤가 안 맞는 말은 그냥 듣기 어렵나요?", "당신의 날카로운 질문은 오래된 불편을 바꿀 출발점이 됩니다."],
  mixedOfficers: ["제대로 지켜야 한다는 마음과 빨리 해내야 한다는 마음이 동시에 재촉합니다.", "차근차근 하기로 정했다가 급한 요청이 오면 내 계획부터 다시 뜯어봅니다.", "누구 말이 맞는지보다 누구에게 먼저 혼날지가 신경 쓰입니다.", "안전하게 하라면서 빨리 끝내라는 말에 특히 지치나요?", "서로 다른 요구를 알아보는 눈은 당신이 지킬 기준을 찾게 합니다."],
  peerHeavy: ["사람들과 함께해도 마지막 선택만큼은 내가 내리고 싶습니다.", "같이 공부해도 문제 푸는 순서는 내 방식대로 다시 정합니다.", "좋은 조언인지 따지기 전에 간섭인지부터 따집니다.", "일단 혼자 해봐야 다른 사람 방법도 받아들일 수 있나요?", "당신이 자기 발로 버틴 경험은 새 길 앞에서도 쉽게 사라지지 않습니다."],
  outputHeavy: ["머릿속에서만 좋은 생각보다 밖에 꺼내 반응을 보고 싶습니다.", "모임 아이디어를 말하다가 이미 간단한 그림과 예시를 만들고 있습니다.", "생각은 다 전했는데 상대가 기억한 건 첫 두 가지뿐입니다.", "손으로 만들거나 말로 풀어내야 생각이 정리되는 편인가요?", "당신이 꺼낸 생각들은 세상에서 써볼 수 있는 모양을 얻습니다."],
  wealthHeavy: ["재미도 좋지만 들인 시간만큼 무엇이 남는지 자꾸 확인합니다.", "좋은 기회라는 설명을 듣고도 실제 비용과 남을 몫을 따로 적어봅니다.", "시간을 아끼려다 쉬는 시간의 값까지 매기고 있습니다.", "분주하게 보냈는데 남은 게 없으면 유난히 허전한가요?", "당신은 바쁜 하루보다 내게 남는 결과를 알아보는 사람입니다."],
  officerHeavy: ["다른 사람이 기대하는 수준을 미리 맞추려 애씁니다.", "모두 끝났다고 하는데 혹시 빠진 약속이 없는지 마지막으로 확인합니다.", "믿을 만하다는 칭찬에 기뻤는데 다음 부탁이 바로 따라옵니다.", "누군가 해야 할 일이 남으면 내 일이 아니어도 마음이 쓰이나요?", "당신이 지켜낸 약속은 다음 만남에도 믿고 기댈 이유가 됩니다."],
  resourceHeavy: ["새로운 일을 시작할 때 경험담과 배경을 충분히 알아두고 싶습니다.", "수업 하나를 듣기 전에 추천 교재와 지난 강의부터 찾아봅니다.", "준비 목록이 늘수록 시작 날짜가 뒤로 밀립니다.", "모르는 채로 해보는 것보다 먼저 이해해야 마음이 편한가요?", "당신에게 쌓인 배움은 오래 두고 꺼내 쓸 판단의 바탕입니다."],
  noResource: ["설명을 듣는 방법 말고 직접 해보며 익히는 길도 열려 있습니다.", "설명서를 먼저 읽을지 간단히 눌러보며 익힐지 내 방식을 떠올려봅니다.", "아는 척 넘기면 작은 질문 하나로 풀릴 일도 길어질 수 있습니다.", "가장 잘 배웠던 때는 누가 설명해줬을 때였나요, 직접 해봤을 때였나요?", "내게 맞는 배움의 문은 한 가지 이름으로 닫히지 않습니다."],
  noOutput: ["말과 글 말고 시간을 내거나 직접 챙기는 방식으로도 마음을 전할 수 있습니다.", "고마운 마음을 문자로 보낼지 작은 도움으로 보일지 생각해봅니다.", "전했다고 생각해도 상대가 알아본 표현인지는 다를 수 있습니다.", "좋아하는 것을 보여줄 때 말과 행동 중 무엇이 더 편한가요?", "마음을 드러내는 길은 말의 크기 하나로 정해지지 않습니다."],
};

export const STRUCTURE_DEPTH = (Object.keys(STRUCTURE_MATERIALS) as StructureId[]).map(id => {
  const old = STRUCTURE_MATERIALS[id], [inside, scene, punch, question, ending] = extras[id];
  const supportOnly = id === "noResource" || id === "noOutput";
  const copy: DepthCopy = supportOnly ? {
    character: id === "noResource" ? "배우는 방식에는 듣고 읽는 길과 직접 겪는 길이 있습니다." : "표현에는 크게 말하는 길과 조용히 행동하는 길이 있습니다.",
    inside, strength: id === "noResource" ? "경험으로 익힌 것도 다음 선택을 돕는 실력이 됩니다." : "자주 해온 행동 속에도 충분한 표현의 힘이 담길 수 있습니다.",
    shadow: id === "noResource" ? "모르는 것을 묻지 않은 채 혼자 버티면 돌아갈 길이 길어집니다." : "표현 방법을 혼자만 알고 있으면 마음이 잘 전해지지 않습니다.",
    ...(id === "noResource" ? { study: "직접 풀어보고 알아낸 요령도 다시 쓸 수 있는 배움으로 남습니다." } :
      { love: "말로 하기 어색했던 마음도 함께 보낸 시간과 작은 챙김으로 전할 길이 있습니다." }),
    scene, punch, question, ending,
  } : { character: old.identity, inside, strength: old.strengths, shadow: old.weaknesses, work: old.workMoney,
    ...(id === "officerResourceFlow" ? { study: "맡은 일을 더 잘 이해하려고 배운 것이 다음 판단의 자신감이 됩니다." } :
      id === "killingResourceFlow" ? { study: "어려운 문제의 원인을 공부하며 비슷한 상황을 풀 무기를 늘립니다." } :
      id === "resourceHeavy" ? { study: "쌓아온 설명들을 서로 연결할 때 따로 외운 지식이 내 이해로 바뀝니다." } : {}),
    relationships: old.loveRelationships, fortune: id === "wealthHeavy" ? "현실의 기회를 결과로 남기는 재물 감각이 있습니다." : old.successFortune,
    scene, punch, question, ending };
  const material = depth(`v4_structure:${id}`, "structure", old.imagery, copy,
    [`v4:structure-rule:${id}`, `v4:structure-material:${id}`], supportOnly ? "support-only" : "strong-evidence");
  return { ...material, seeds: material.seeds.map(seed => seed.role === "work" ? { ...seed, domains: ["work", "money"] as const } :
    seed.role === "relationships" ? { ...seed, domains: ["love", "marriage", "relationships"] as const } : seed) };
});
