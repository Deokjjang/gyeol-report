import type { LoveMarriageChildReportEvidencePacket as Packet, LoveMarriageChildMbtiTraitEvidence as Trait } from "../report-knowledge/loveMarriageChildReportTypes";
import { selectLoveRelationshipEvidence } from "../report-knowledge/loveRelationshipSelection";
import { formatBridgeScene } from "../report-knowledge/bridge/interactionScenes";
import { correctKoreanParticleSlots } from "../report-knowledge/koreanCopyUtils";
import type { LoveMarriageChildReportDraft, LoveMarriageChildTextSection } from "./loveMarriageChildReportDraftTypes";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";

// These are situation questions for the existing ten-god meanings, not new natal facts.
const perspectives = {
  wealth: {
    name: "생활을 함께 감당하는 기준", gods: ["정재", "편재"],
    love: "좋아한다는 말에 더해 만남에 시간과 수고를 실제로 쓰는지 보게 되는 근거입니다. 일정이 바뀌었을 때 대안을 제안하는 행동은 화려한 첫인상보다 오래 남을 수 있습니다. 단, 애정을 비용이나 기여도로만 계산하면 상대가 해 준 작은 배려를 놓칩니다.",
    strength: "좋아하는 마음을 식사 준비, 이동, 일정 조율처럼 손에 잡히는 돌봄으로 옮겨 볼 수 있습니다. 같이 쓸 시간을 미리 확보하는 일이 장점이 되는 대신, 내가 낸 수고만 장부처럼 기억하지 않는지가 관건입니다.",
    friction: "함께 부담할 일을 한쪽이 계속 미룰 때 피로가 생기는지 살펴보세요. 이때 '나만 신경 쓰네'라는 총평보다 이번 약속에서 누가 무엇을 맡았는지를 짚어야 요구가 선명해집니다.",
    marriage: "공동생활에서는 생활비와 돌봄에 투입하는 시간도 같은 자원입니다. 소득이 많은 사람이 모든 결정권을 갖거나, 시간을 더 쓰는 사람이 무조건 양보하는 방식은 다른 기여를 보이지 않게 만듭니다.",
    money: "공동비와 개인비를 나누는 기준뿐 아니라 예상 밖 지출의 합의선을 정해 보세요. 선물이나 양가 지원을 좋은 뜻으로 먼저 약속한 뒤 통보하면, 액수보다 결정 과정에서 마음이 멀어질 수 있습니다.",
    parent: "돌봄에서는 필요한 물건과 시간을 마련하는 실용성이 자산입니다. 다만 교육비를 들인 만큼 결과가 나와야 한다는 거래로 바뀌지 않게 살펴보세요. 선택지를 함께 비교하되 최종 선택의 작은 부분은 아이에게 남겨 두는 연습이 됩니다.",
    repair: "섭섭했던 기여와 고마웠던 기여를 따로 말해 보세요. 지난 지출을 모두 다시 꺼내기보다 다음 한 번의 부담을 어떻게 나눌지 합의하면, 정산이 애정을 시험하는 장면으로 번지는 일을 줄일 수 있습니다.",
    comfort: "돈과 시간을 얼마나 쓰는지보다, 할 수 있는 몫과 어려운 몫을 솔직하게 말하는 사람",
    attraction: "좋은 제안을 실제 약속과 행동으로 이어 주는 사람",
    cost: "베푸는 순간은 크지만 이후의 생활 부담과 약속은 계속 미루는 관계",
  },
  officer: {
    name: "약속과 책임의 경계", gods: ["정관", "편관"],
    love: "관계의 이름이나 약속이 무엇인지 확인하려는 기준으로 읽습니다. 만나기로 한 뒤 연락이 달라졌을 때 불편한 것이 기다림인지, 합의가 지켜지지 않은 것인지 구분해 보세요. 아직 말하지 않은 기대를 상대의 의무로 바꾸면 초반부터 평가받는 느낌을 줄 수 있습니다.",
    strength: "한번 한 약속을 가볍게 넘기지 않는 태도를 관계의 신뢰로 쓸 수 있습니다. 일이 바빠 계획이 바뀐다면 먼저 알리고 새로운 약속을 제안하는 식입니다. 신뢰는 상대를 단속할 때보다 내 기준을 설명하고 지킬 때 드러납니다.",
    friction: "옳은 기준을 빨리 세우려는 순간에는 상대가 왜 그렇게 했는지 들을 자리가 줄어들 수 있습니다. 설명을 듣기 전에 결론을 정해 두면, 정확한 요구도 평가나 압박으로 전달됩니다. 기준에 동의했는지부터 물어보는 편이 낫습니다.",
    marriage: "집안일은 '누가 도와주나'보다 책임의 시작과 끝을 정하는 문제가 됩니다. 한 사람이 지시하고 확인하는 역할까지 맡으면 실행을 나눠도 피로가 남습니다. 결과 기준을 함께 정한 뒤 맡은 방식에는 자율을 주어야 합니다.",
    money: "큰돈을 쓰기 전 서로 확인할 금액과 각자 결정할 금액을 구분해 보세요. 규칙을 만든 사람이 예외를 독점하면 생활의 안정 장치가 통제로 느껴집니다. 수입이나 가족 상황이 바뀌면 기존 합의도 함께 고쳐야 합니다.",
    parent: "양육에서는 예측 가능한 규칙을 설명하는 힘으로 쓸 수 있습니다. 실수한 날에도 아이 자체를 평가하기보다 어떤 약속이 어긋났는지 다루세요. 안전에 필요한 규칙과 부모의 취향을 나누고, 성장하면 허용 범위를 다시 협의하는 것이 중요합니다.",
    repair: "갈등 뒤에는 누가 더 옳았는지보다 다음에 지킬 약속을 한 가지로 좁혀 보세요. 사과를 즉시 받아내려 하면 말은 얻어도 이해는 남지 않을 수 있습니다. 상대가 자기 말로 합의를 설명할 시간을 남깁니다.",
    comfort: "경계를 말해도 거절로 몰지 않고, 서로 합의한 약속을 지키는 사람",
    attraction: "관계에 성의를 보이고 자신의 선택을 책임지는 사람",
    cost: "관계를 분명히 말하지만 실제 합의에는 참여하지 않거나, 기준을 일방적으로 정하는 관계",
  },
  output: {
    name: "표현과 실제 행동", gods: ["식신", "상관"],
    love: "마음을 말이나 행동으로 꺼내는 통로를 보는 근거입니다. 같이 해 보고 싶은 활동을 제안하거나 취향을 나누며 가까워지는 장면에서 확인해 보세요. 내가 재미있게 이야기한 시간과 상대가 자신의 마음을 이야기한 시간이 균형을 이루는지도 중요합니다.",
    strength: "함께 먹을 것, 해 볼 일, 나누고 싶은 이야기를 관계 안으로 가져오는 힘으로 쓸 수 있습니다. 특별한 이벤트만이 아니라 평범한 날을 즐겁게 만드는 작은 표현이 쌓입니다. 상대의 반응을 듣고 제안을 바꿀 수 있을 때 표현이 배려로 이어집니다.",
    friction: "솔직함이 장점이어도 상대의 말이 끝나기 전에 평가하거나 농담으로 덮으면 진심을 놓칠 수 있습니다. 설명을 많이 했다는 사실이 충분히 들었다는 뜻은 아닙니다. 특히 가까운 사이일수록 편한 말투와 함부로 말하는 것을 구별해야 합니다.",
    marriage: "공동생활에서도 함께 즐기는 시간을 남기는 쪽을 살펴볼 수 있습니다. 다만 새로운 계획을 제안하는 일과 그 뒤의 정리까지 맡는 일은 다릅니다. 가족 행사나 여행을 정할 때 준비와 마무리의 역할까지 이야기해 보세요.",
    money: "즐거움을 위한 지출을 모두 낭비로 취급할 필요는 없습니다. 다만 선물이나 외식이 불편한 대화를 대신하고 있지는 않은지 보세요. 함께 즐길 예산과 혼자 즐길 예산을 구분하면 표현의 자유와 생활의 안정이 부딪히는 지점이 줄어듭니다.",
    parent: "설명하고 함께 시도하는 양육 장면에 사용할 수 있는 근거입니다. 정답을 알려 주는 속도보다 아이가 자기 방식으로 해 볼 시간을 남겨 보세요. 실수한 결과를 바로 고쳐 주기 전에 어떻게 해 보았는지 묻는 것이 표현력과 자율을 함께 지키는 방법입니다.",
    repair: "긴 설명보다 상대가 이해한 내용을 먼저 들어 보세요. 농담으로 분위기를 푸는 것은 잘못을 인정한 다음이어야 합니다. 다시 만나서 할 작은 행동을 정하면 말로만 끝난 사과와 실제 회복의 차이를 확인할 수 있습니다.",
    comfort: "표현을 받아 주면서도 자기 취향과 거절을 편하게 말하는 사람",
    attraction: "대화와 새로운 경험을 함께 만들고 반응을 나눌 수 있는 사람",
    cost: "즐거운 순간은 많지만 불편한 이야기는 농담이나 이벤트로 덮는 관계",
  },
  resource: {
    name: "안전감과 이해받는 방식", gods: ["정인", "편인"],
    love: "상대가 내 이야기를 어떻게 듣고 기억하는지가 가까워지는 기준인지 살펴볼 수 있습니다. 바로 결론을 내리지 않고 마음을 정리할 여지를 주는 장면이 중요합니다. 이해해 주는 느낌이 좋아도 필요한 요구를 말하지 않은 채 알아주기만 기다리지는 않는지 확인하세요.",
    strength: "상대가 낯선 일을 겪을 때 맥락을 듣고 함께 배울 수 있는 돌봄으로 이어집니다. 당장 해결할 수 없는 이야기도 끝까지 듣는 경험은 신뢰가 됩니다. 다만 이해한다는 이유로 모든 부담을 대신 짊어지는 것은 다른 문제입니다.",
    friction: "설명과 확인을 충분히 하고 싶어도 대화가 같은 걱정 주위를 돌면 양쪽이 지칩니다. 위로를 원하는지, 정보를 원하는지, 결정을 같이 하고 싶은지를 구분해 보세요. 상대의 반응 한 번을 마음 전체의 증거로 삼지는 않아야 합니다.",
    marriage: "집이 쉬는 장소가 되려면 생활의 효율뿐 아니라 회복 방식도 합의해야 합니다. 퇴근 직후 바로 대화할지 잠깐 혼자 쉴지, 가족에게 들은 고민을 어디까지 나눌지 정하면 돌봄과 사생활의 경계가 선명해집니다.",
    money: "가족을 돕는 지출에서도 마음과 지속 가능성을 함께 보세요. 부탁을 거절하기 어려워 공동 예산을 먼저 약속하면 둘의 결정권이 밀립니다. 지원 가능한 범위를 정하고, 그 밖의 도움은 시간이나 정보로 대신할 수 있는지 논의해 보세요.",
    parent: "아이의 감정을 듣고 배움을 돕는 역할에 연결되는 신호입니다. 도움을 주기 전에 아이가 어느 부분까지 해 보았는지 묻고, 필요한 만큼만 보태 보세요. 걱정을 줄이려고 선택을 대신하면 보호하려는 마음이 독립을 늦추는 방식으로 전달될 수 있습니다.",
    repair: "갈등에서 들은 말과 내가 붙인 의미를 따로 적어 보세요. '그렇게 말했을 때 나는 이렇게 들었다'고 확인하면 기억만으로 상대의 뜻을 확정하는 일을 줄입니다. 위로가 필요했던 순간과 해결이 필요한 문제는 다른 속도로 다뤄도 됩니다.",
    comfort: "생각을 정리할 시간을 존중하고 필요한 도움을 먼저 물어보는 사람",
    attraction: "내 이야기를 깊게 듣고 기억하며 새로운 관점을 열어 주는 사람",
    cost: "이해해 준다는 이유로 서로의 선택을 대신하거나 확인을 끝없이 요구하는 관계",
  },
  peer: {
    name: "대등함과 각자의 영역", gods: ["비견", "겁재"],
    love: "가까워져도 각자의 선택권이 남아 있는지가 중요한 질문이 됩니다. 상대에게 맞추는 것과 내 취향을 숨기는 것은 다릅니다. 약속이 없는 날의 혼자 시간을 존중받는지, 다른 의견을 내도 관계가 위협받지 않는지를 살펴보세요.",
    strength: "상대를 돌봄의 대상만이 아니라 자기 판단을 가진 사람으로 대하는 힘으로 쓸 수 있습니다. 함께 도전하면서도 서로의 성과를 비교하지 않는 관계가 장점을 살립니다. 부탁을 주고받되 누가 더 필요로 하는지 힘겨루기를 하지 않는 것이 중요합니다.",
    friction: "의견 차이가 내 자리를 지키는 싸움이 되면 작은 선택도 양보하기 어려워집니다. 이번에 무엇을 얻고 싶은지와 존중받고 싶은 마음을 구분해 보세요. 상대의 제안을 따르는 한 번의 선택이 내 독립성을 없애는 것은 아닙니다.",
    marriage: "공동생활의 안정과 개인 영역을 함께 설계하는 질문으로 이어집니다. 친구를 만나는 시간, 혼자 쓰는 공간, 각자 결정할 일의 범위를 명시해 보세요. 모든 시간을 공유해야 친밀하다는 기준도, 아무 설명 없이 각자 행동하는 방식도 합의가 필요합니다.",
    money: "공동 목표에 쓰는 돈과 설명 없이 쓸 수 있는 개인 예산을 구분하면 선택권을 지킬 수 있습니다. 소득 차이를 관계의 서열로 만들지 않는지도 중요합니다. 한 사람이 양보한 선택은 빚처럼 쌓기보다 다른 방식의 기여로 조정해 보세요.",
    parent: "아이를 독립된 선택의 주체로 존중하는 연습과 연결됩니다. 의견이 다를 때 권위로 이기는 것보다 선택의 결과를 함께 살피는 쪽을 시도해 보세요. 자율을 준다는 이유로 필요한 안전 기준까지 맡기거나, 경쟁하듯 성취를 비교하지 않는 균형이 필요합니다.",
    repair: "누가 먼저 연락했는지를 손해처럼 세지 않는 것이 회복의 출발점입니다. 양보하기 어려운 경계와 바꿀 수 있는 방식을 나누어 말해 보세요. 서로의 취향을 하나로 통일하지 않고도 지킬 수 있는 약속을 찾습니다.",
    comfort: "혼자 있는 시간과 다른 의견을 관계의 거절로 받아들이지 않는 사람",
    attraction: "자기 관심사와 선택이 분명하고 서로에게 자극을 주는 사람",
    cost: "다른 취향을 우열로 비교하거나 모든 결정을 힘겨루기로 만드는 관계",
  },
} as const;

const paragraphs = (values: readonly (string | undefined)[]) => correctKoreanParticleSlots(values.filter(Boolean).join("\n\n"));
const section = (headline: string, body: string, keyPoints: readonly string[], caution: string | null = null): LoveMarriageChildTextSection => ({ headline, body, keyPoints, caution });

export function buildLoveRelationshipNarrative(packet: Packet, context?: SinglePersonGenerationInput["userContext"]): LoveMarriageChildReportDraft {
  const selected = packet.relationshipReading ?? selectLoveRelationshipEvidence(packet);
  const s = packet.sajuBasis;
  const m = packet.mbtiBasis;
  const type = packet.personContext.mbtiType;
  const readings = Object.values(perspectives).flatMap(p => {
    const gods = selected.tenGods.filter(t => (p.gods as readonly string[]).includes(t.tenGod));
    return gods.length ? [{ ...p, labels: gods.map(t => t.tenGod).join("·"), priority: selected.tenGods.indexOf(gods[0]) }] : [];
  }).sort((a, b) => a.priority - b.priority);
  const lead = readings[0];
  const read = (key: "love" | "strength" | "friction" | "marriage" | "money" | "parent" | "repair", limit = 2) => readings.slice(0, limit).map(r => `${r.labels} — ${r[key]}`);
  const trait = (items: readonly Trait[], index = 0) => items[index] ? `${type}의 ${items[index].label}: ${items[index].plain}` : undefined;
  const risk = (items: readonly Trait[], index = 0) => items[index]?.risk ? `${items[index].label}의 부담: ${items[index].risk}` : undefined;
  // Allocate each validated scene once. Different chapters must not repeat the same bridge paragraph.
  const usedScenes = new Set<string>();
  const scene = (...contexts: string[]) => selected.scenes.filter(v => !usedScenes.has(v.interactionId) && v.contexts.some(c => contexts.includes(c)))
    .slice(0, 2).map(v => { usedScenes.add(v.interactionId); return formatBridgeScene(v); });
  const loveScenes = scene("love");
  const familyScenes = selected.scenes.filter(v => !usedScenes.has(v.interactionId) && v.contexts.includes("family") && v.mbtiBasis.some(b => b.area === "parenting" || b.area === "child")).map(v => { usedScenes.add(v.interactionId); return formatBridgeScene(v); });
  const marriageScenes = scene("marriage", "family");
  const conflictScenes = scene("conflict", "recovery");
  const day = s.fullPillars.find(p => p.key === "day");
  const personalBasis = `${s.dayPillar} 일주에서 일간 ${s.dayMaster}는 나를, 일지 ${s.dayBranch}는 가까운 생활을 보는 자리입니다.${day?.branchTenGod ? ` 일지의 중심 지장간을 일간과 비교한 ${day.branchTenGod}부터 관계 질문을 읽습니다.` : " 일지의 글자만으로 상대의 성격을 정하지 않습니다."}`;
  const features = (items: typeof s.conflictSignals) => items.map(v => `${v.label}: ${v.plain}`);
  const stage = selected.status;
  const solo = stage === "single" || stage === "some";
  const living = stage === "married" || stage === "marriage_preparing";
  const partnerCriteria = readings.slice(0, 2);
  const partnerExamples = selected.partnerExamples.map(p => {
    const tier = { comfort: "편안함을 비교할 예시", attraction: "끌림을 비교할 예시", adjustment: "조율 비용을 살필 예시" }[p.tier];
    const question = p.tier === "comfort" ? "익숙한 방식이 다른 날에도 편안함을 유지할 수 있는지, 약속을 바꿀 때의 대화를 살펴보세요."
      : p.tier === "attraction" ? "처음 매력적으로 느낀 행동이 반복되는 생활에서도 서로 원하는 방식인지 비교해 보세요."
      : "다른 의견을 말했을 때 상대가 조율할 여지를 주는지, 내 기준도 바꿀 수 있는지 확인해 보세요.";
    return `${tier} — ${p.sourceType}와 ${p.exampleType}. ${p.tier === "comfort" ? p.pair.sharedGround[0] ?? p.pair.lovePattern : p.tier === "attraction" ? p.pair.positiveInfluence[0] ?? p.pair.lovePattern : p.pair.friction[0]}\n${p.pair.lovePattern} 장기 생활에서는: ${p.pair.marriagePattern} ${question} 조율 방법으로는 ${p.pair.repairStrategy[0]}`;
  });
  const affection = paragraphs([
    selected.scene, ...read("love"), trait(m.loveTraits), trait(m.loveTraits, 1),
    type ? "유형 설명은 실제 습관과 비교하는 보조 기준입니다. 원국의 신호가 행동 방식과 겹치거나 엇갈리는 장면을 함께 읽어 보세요." : "MBTI가 입력되지 않아 유형이나 말투를 추정하지 않습니다. 아래 명리 기준과 실제로 편안했던 만남을 비교해 보세요.",
    ...loveScenes,
  ]);
  const attraction = paragraphs([
    solo ? "끌림은 다음 만남을 궁금하게 만드는 힘이고, 편안함은 다르게 반응해도 관계를 설명할 수 있는 여유입니다. 둘을 같은 조건으로 고르지 마세요." : "아래 기준은 현재 상대를 분석한 결과가 아닙니다. 내가 관계에서 기대하는 행동을 확인하고, 실제 상대와는 대화로 차이를 확인하는 기준입니다.",
    ...partnerCriteria.map(r => `${r.labels}의 ${r.name}으로 보면, 처음 끌릴 수 있는 특징은 ${r.attraction}입니다. 오래 편한지는 ${r.comfort}인지에 달려 있습니다. 반면 ${r.cost}에서는 설렘과 별개로 조율할 일이 늘어납니다.`),
    trait(m.relationshipTraits), trait(m.relationshipTraits, 1),
    ...[...new Set(selected.partnerExamples.map(p => p.sajuCriterion))].map(basis => `아래 유형 예시와 비교할 내 원국의 기준은 ${basis}입니다. 이 기준이 실제 상대의 행동과 만나는지는 별도로 확인합니다.`),
    ...partnerExamples,
    solo && type ? "유형 예시는 내 유형의 관계 자료에 있는 사례이며 정답이나 순위가 아닙니다. 상대의 실제 원국은 알 수 없으므로 위 명리 기준을 상대의 성격으로 옮기지 않습니다. 특정 두 사람의 비교는 궁합 리포트에서 다룹니다." : undefined,
    solo && !type ? "유형 예시는 제시하지 않습니다. 약속이 바뀐 날, 거절을 전한 날, 조용히 쉬고 싶은 날에 위 행동 기준이 지켜지는지 보는 것이 더 구체적인 선택 자료가 됩니다." : undefined,
  ]);
  const parenting = paragraphs([
    "이 장은 자녀 유무를 가정하지 않습니다. 돌봄을 맡는다면 내가 어떻게 설명하고 도우며 선택권을 남길지를 읽습니다.",
    ...read("parent", 3), trait(m.parentingTraits), trait(m.parentingTraits, 1), trait(m.parentingTraits, 2),
    ...familyScenes,
    "실수한 날에는 결과, 노력, 다음 시도를 따로 말해 보세요. 부모가 느낀 걱정을 아이의 능력 평가로 바꾸지 않는 것이 핵심입니다. 교육이나 진로를 이야기할 때도 내가 바라는 것과 아이가 경험한 것을 번갈아 듣고, 도와줄 범위를 합의합니다.",
  ]);
  return {
    version: "v1", productType: "love_marriage_child", productVersion: "v1", personLabel: packet.personContext.name,
    headline: selected.question,
    openingSummary: paragraphs([`${packet.personContext.name}님의 ${selected.label} 관점에서 읽습니다. ${personalBasis}`, lead ? `첫 질문은 ${lead.labels}의 ${lead.name}입니다. 이 신호의 존재를 성격의 강도나 결혼의 결과로 단정하지 않고, 표현·생활·돌봄에서 각각 다르게 살펴봅니다.` : undefined,
      context?.detailJob ? `${context.detailJob}${context.focusAreas.length ? `, 관심 영역 ${context.focusAreas.join(", ")}` : ""}은 계산 원인이 아니라 생활 장면을 고르는 참고 정보입니다. 직업명만으로 관계 역할을 추정하지 않습니다.` : undefined]),
    loveStyle: section(solo ? "마음을 여는 속도와 호감을 전하는 방법" : "가까운 사람에게 내가 보내는 신호", affection, ["시작하는 방식", "표현의 통로", "내 기대와 합의의 구분"], "내 의도와 상대가 받은 인상은 다를 수 있습니다. 상대의 마음은 여기서 확정하지 않습니다."),
    attractionPattern: { ...section("처음 끌리는 결, 오래 편한 결, 조율이 필요한 결", attraction, [], null),
      repeatedPattern: [risk(m.loveTraits) ?? (lead ? `${lead.labels}의 기준을 상대에게 말하지 않고 기대하고 있지는 않은지 살펴보세요.` : "내 기대를 합의된 약속처럼 다루지 않습니다."), risk(m.loveTraits, 1) ?? "초반에 좋았던 행동이 의견이 다른 날에도 이어지는지 확인합니다."],
      betterUse: [selected.action, "한 번의 좋은 인상과 반복해서 지켜진 행동을 따로 기억해 보세요."] },
    loveStrengths: section("내가 관계에 보탤 수 있는 힘", paragraphs([...read("strength", 3), ...features(s.attractionSignals), trait(m.loveTraits, 2)]), readings.slice(0, 3).map(r => r.name), "장점은 상대에게 같은 방식을 요구하는 근거가 아닙니다."),
    loveFriction: { ...section("좋은 의도가 다르게 들리는 순간", paragraphs([...read("friction"), ...features(s.conflictSignals), trait(m.communicationTraits), trait(m.communicationTraits, 1), ...conflictScenes]), [], null),
      repeatedPattern: [risk(m.communicationTraits) ?? "갈등의 사실과 그 사실에 붙인 해석을 구분합니다.", risk(m.relationshipTraits) ?? "내게 편한 거리를 상대도 같게 느낀다고 가정하지 않습니다."],
      betterUse: ["연락의 횟수보다 연락이 어려울 때 알리는 방식을 이야기해 보세요.", "혼자 정리할 시간이 필요하면 대화를 다시 시작할 시점도 같이 전해 보세요."] },
    marriageRhythm: section(living ? "함께 사는 일에서 다시 맞출 것" : "오래 함께 살려면 확인할 생활 리듬", paragraphs([
      stage === "marriage_preparing" ? "결혼 준비에서는 예식을 잘 치르는 능력과 앞으로 생활을 함께 운영하는 능력을 나누어 보세요. 준비를 주도한 사람이 결혼 뒤에도 모든 결정을 떠맡아야 하는 것은 아닙니다." : stage === "married" ? "이미 해 오던 방식이라는 이유만으로 지금도 공평한 것은 아닙니다. 보이지 않는 일정 관리와 감정 노동까지 포함해 현재 역할을 다시 확인하는 것이 출발점입니다." : "공동생활은 미래에 반드시 해야 할 일이 아니라, 원한다면 미리 확인할 선택입니다. 데이트의 편안함과 반복되는 살림의 편안함은 다른 장면에서 드러납니다.",
      ...read("marriage", 3), trait(m.marriageTraits), trait(m.marriageTraits, 1), ...marriageScenes]), ["가사와 결정 업무", "혼자 쉬는 시간", "양가와의 거리"], "가족과의 친밀함을 이유로 둘이 합의할 문제를 다른 사람에게 먼저 약속하지 않습니다."),
    householdMoneyAndRoleSplit: section("사랑과 별도로 합의할 돈과 역할", paragraphs([...read("money", 3), trait(m.marriageTraits, 2),
      "반복 업무는 실행뿐 아니라 기억하고 준비하고 마무리하는 수고까지 나누어야 합니다. 누가 더 잘하는지를 이유로 한쪽에 고정하기보다, 바쁜 시기에 서로 교대할 수 있는지 확인하세요. 돈의 액수와 역할의 양을 애정의 크기로 판정하지 않습니다."]), ["개인 결정권", "공동 예산", "보이지 않는 수고"], "현재 상대의 소비 습관이나 경제 상황은 이 입력으로 알 수 없습니다."),
    conflictRecovery: section("다시 대화할 수 있게 만드는 회복 방식", paragraphs([...read("repair", 3), trait(selected.recoveryTraits), trait(selected.recoveryTraits, 1), ...features(s.supportSignals),
      ...s.relationInteractionSignals.slice(0, 2).map(v => `${v.label}은 내 원국 안에서 확인한 작용입니다. 상대와의 충돌을 계산한 것이 아닙니다. 가까워지고 싶은 마음과 생활 방식이 어긋나는 장면을 살피되, 관계의 끝을 예측하는 근거로 사용하지 않습니다.`)]), ["들은 말과 붙인 의미", "다음 한 번의 행동", "대화 재개 시점"]),
    parentMode: { ...section("돌봄의 강점과, 도움을 멈춰야 할 자리", parenting, [], "내 원국과 MBTI는 아이의 성격이나 능력을 대신 설명하지 않습니다."),
      parentingRolePattern: ["규칙: 안전에 꼭 필요한 것과 내 취향을 구분해 설명하기", "학습: 먼저 해 본 과정과 필요한 도움을 물어보기", "기대: 결과 평가와 아이를 존중하는 말을 분리하기", "독립: 선택할 수 있는 범위를 성장에 맞춰 넓히기"],
      avoidProjection: ["내가 안심되는 방식이 아이에게도 편하다고 가정하지 않습니다.", "실수했을 때 곧바로 해결할지, 들어줄지 먼저 묻습니다.", "부모가 익숙한 진로를 유일한 안전한 선택처럼 제시하지 않습니다."] },
    breakupReunionPattern: { ...section("관계의 결론보다 내 반복을 이해하기", paragraphs([
      stage === "single" ? "지난 관계가 있다면 그리운 사람의 특징과 그 관계에서 힘들었던 생활을 따로 돌아보세요. 관계 경험이 없다면 아직 겪지 않은 이별 습관을 자기 성격으로 받아들일 필요는 없습니다." : "갈등이 있다고 이별을 전제하지 않습니다. 현재 관계의 결론을 내리는 대신, 마음이 상한 뒤 내가 무엇을 반복하는지를 살펴보는 장입니다.",
      trait(m.loveTraits, 3), trait(m.relationshipTraits, 2),
      lead ? `${lead.labels}의 ${lead.name}이 충족되지 않았던 장면부터 되짚어 보세요. 같은 상대를 다시 만나는 일보다, 같은 문제를 다른 방식으로 다룰 합의가 있는지가 중요합니다.` : undefined,
      "다시 연락하고 싶을 때는 외로움을 줄이고 싶은지, 사과하고 싶은지, 실제로 바꿀 일이 있는지 구분합니다. 연락하고 싶은 마음이 상대의 동의나 대화할 준비를 뜻하지는 않습니다."]), [], null),
      myLoop: [risk(m.relationshipTraits, 1) ?? "좋았던 순간만으로 힘들었던 조건을 지우지 않기"],
      emotionalProcessing: [trait(selected.recoveryTraits, 2) ?? "그리움과 불편함을 동시에 기록하고 한 감정만으로 결론내리지 않기"],
      repairBoundary: ["상대가 대화를 원하지 않는다는 뜻은 존중합니다.", "달라질 구체적인 행동이 없는 약속만으로 같은 관계를 반복하지 않습니다."] },
    relationshipTimingHints: [{label: "지금의 관계 질문", headline: selected.question, body: selected.scene, push: [selected.action], avoid: ["상대의 반응을 미래의 결론으로 확정하기"]}],
    actionPlan: [
      { label: "연애", headline: solo ? "호감과 편안함을 따로 관찰하기" : "내 의도가 전달된 방식 확인하기", body: lead ? `${lead.labels}의 ${lead.name}을 실제 만남에서 확인하는 작은 실험입니다. 상대를 채점하기보다 내가 요구하지 않고 기대했던 것이 무엇인지 찾아보세요.` : "실제 만남의 경험으로 기준을 확인합니다.", firstAction: selected.action },
      { label: "결혼", headline: "결정권까지 나누기", body: "함께 살 계획이 있거나 이미 살고 있다면, 집안일 하나에 누가 준비하고 결정하고 마무리하는지 적어 봅니다. 맡은 사람이 계속 지시를 기다려야 한다면 일만 나눈 상태일 수 있습니다.", firstAction: "다음 주 반복 업무 하나의 시작과 끝을 함께 정합니다." },
      { label: "갈등 회복", headline: "해결 전에 대화의 목적 확인하기", body: trait(m.communicationTraits, 2) ?? "불편한 이야기를 시작할 때 들어주길 원하는지, 함께 방법을 찾고 싶은지 말합니다. 같은 대화에서도 목적이 다르면 조언이 간섭으로, 침묵이 무관심으로 들릴 수 있습니다.", firstAction: "지금은 들어줬으면 하는지, 의견을 듣고 싶은지 먼저 전합니다." },
      { label: "부모 역할", headline: "돕기 전에 남길 선택권 찾기", body: trait(m.parentingTraits, 3) ?? "돌봄 상황에서는 내가 대신하면 빨리 끝나는 일과, 시간을 들여 스스로 해 볼 일을 구분합니다. 보호와 자율의 비율은 한 번 정하고 끝내는 규칙이 아닙니다.", firstAction: "대신 결정하고 싶어진 순간에 선택지 두 개를 제안해 봅니다." },
      { label: "관계 정리", headline: "바뀐 행동을 기준으로 보기", body: "관계를 이어 갈지 고민할 때 좋은 말 한 번과 지속적으로 달라진 행동을 구분합니다. 상대의 가능성을 대신 책임지거나 내 불편함을 전부 참고 버티는 것으로 답을 만들지 않습니다.", firstAction: "내가 지킬 경계와 다시 협의할 조건을 나눠 적습니다." },
      { label: "생활 리듬", headline: "각자의 회복 시간을 설명하기", body: trait(m.relationshipTraits, 3) ?? "혼자 쉬는 시간이 필요하다는 말과 관계를 멀리하고 싶다는 말은 다릅니다. 함께하는 시간과 혼자 회복하는 시간을 모두 계획에 넣고 실제로 편안해지는지 확인해 보세요.", firstAction: "이번 주 함께할 시간과 혼자 쉴 시간을 각각 정합니다." },
    ],
    riskManagement: [{title: "유형 설명을 상대에게 투사하는 위험", body: "여기에 나온 유형 사례는 행동 차이를 살피는 예시입니다. 실제 상대를 특정 유형처럼 행동하도록 요구하면 관계를 이해하기보다 틀에 맞추게 됩니다.", prevention: "타입 이름보다 실제로 있었던 한 행동을 이야기합니다." },
      {title: "좋은 의도와 실제 부담의 차이", body: risk(m.marriageTraits) ?? (lead ? `${lead.labels}의 기준도 서로 동의하지 않은 의무로 바뀌면 부담이 됩니다.` : "필요한 도움인지 묻지 않은 배려가 부담이 될 수 있습니다."), prevention: "내가 하고 싶은 배려와 상대가 요청한 도움을 구분합니다."}],
    safetyNotes: ["이 리포트는 나의 관계 성향을 살피는 참고 자료이며 관계의 결과를 확정하지 않습니다.", "특정 상대나 실제 아이의 사주·MBTI를 분석하지 않습니다.", "유형별 사례와 명리의 해석은 실제 생활 경험과 대조해서 읽어 주세요."],
  };
}
