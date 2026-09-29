import { buildCompatibilityV3, COMPATIBILITY_V3_POLISHED_VERSION, type CompatibilityV3Draft } from "./compatibilityEditorial";
import { categoryReceived, polishedCategoryCopy } from "./compatibilityPolishedCopy";
import { PAIR_GODS, PAIR_VOICES } from "./compatibilityEditorialCopy";
import { otherSlot, type PairSlot, type compatibilityEditorialEvidence } from "./compatibilityEditorialEvidence";
import { composeEditorial, type EditorialScene } from "./editorialComposer";
import type { CompatibilityRelationshipType as Category } from "../report-generation/reportInputTypes";
import type { Evidence } from "./types";
import { factLabel } from "./comprehensiveStoryEvidence";
import { customerEvidenceLabels } from "./comprehensivePublicSignals";

type PairEvidence = ReturnType<typeof compatibilityEditorialEvidence>;

/** Display-only E2 pass. E1 remains frozen for stored snapshot replay. The
 * selected facts, directional subjects and provenance are never replaced. */
export function buildCompatibilityV3Polished(e: PairEvidence, category: Category): CompatibilityV3Draft {
  const original = buildCompatibilityV3(e, category), { direction } = e;
  const asymmetric = category === "parentChild" || category === "managerReport";
  const first: PairSlot = asymmetric || direction.persons.personA.personId <= direction.persons.personB.personId ? "personA" : "personB";
  const name = (slot: PairSlot) => original.people.personA.name === original.people.personB.name ? `${original.people[slot].name}(${original.people[slot].role})` : original.people[slot].name;
  const d = (slot: PairSlot) => slot === "personA" ? direction.aToB : direction.bToA;
  const portrait = (slot: PairSlot) => PAIR_GODS[d(slot).receivedTenGod?.tenGod ?? ""];
  const voice = (slot: PairSlot) => {
    const type = original.people[slot].mbti, v = PAIR_VOICES[type];
    return v && e.facts.some(f => f.subject === slot && f.featureId === `mbti:${type}:traits:communication:${v.trait}`) ? v : undefined;
  };
  const second = otherSlot(first), a = name(first), b = name(second), root = portrait(first), reverse = portrait(second);
  if (!root || !reverse || original.editorialAudit.rejected.length) return { ...original, version: COMPATIBILITY_V3_POLISHED_VERSION };
  const v1 = voice(first), v2 = voice(second);
  const equal = ["比肩", "劫財"].includes(d(first).receivedTenGod?.tenGod ?? "");
  const pressure = [d(first), d(second)].some(x => ["正官", "偏官"].includes(x.receivedTenGod?.tenGod ?? ""));
  // Solution-vs-feeling scenes require that actual contrast, not merely two
  // different MBTI labels (e.g. two socially expressive voices).
  const contrast = !!v1 && !!v2 && [v1, v2].some(v => v.style === "direct") && [v1, v2].some(v => v.style === "warm" || v.style === "expressive");
  const quiet = [v1, v2].some(v => v?.style === "quiet") && ![v1, v2].some(v => v?.style === "expressive");
  const copy = polishedCategoryCopy(category, { a, b, equal, pressure, contrast, quiet, gift: root.gift, reverseGift: reverse.gift });
  const harmony = e.relations.find(r => ["six_harmony", "three_harmony", "half_harmony"].includes(r.kind));
  const rewrite = (scene: EditorialScene, headline: string, paragraphs: readonly string[]): EditorialScene => ({
    ...scene, headline, parts: paragraphs.map(text => ({ role: "character", text })),
    sourceRefs: [...scene.sourceRefs, "compatibilityPolished:reviewed-copy"],
  });
  const scenes = original.chapters.flatMap(c => c.scenes).map(scene => {
    if (scene.angle === "opening") return rewrite(scene, copy.headline, [
      ...copy.opening,
      {
        love: `${a}님에게서 느끼는 ${root.gift}은 관심이 깊어지는 이유가 될 수 있습니다. ${b}님이 돌려주는 ${reverse.gift}은 만나기 전과 다른 나를 발견하게 합니다. 설레게 하는 힘과 안심하게 하는 힘이 같은 모양일 필요는 없습니다.`,
        friendship: `${a}님이 가져오는 ${root.gift}은 힘을 내고 싶은 날에, ${b}님이 보태는 ${reverse.gift}은 다른 눈으로 일상을 보고 싶은 날에 살아납니다. 똑같이 챙겨줘야 좋은 친구라면 놓쳤을 서로의 장점입니다.`,
        businessPartner: `${a}님 쪽의 ${root.gift}을 ${b}님 쪽의 ${reverse.gift}과 연결하면 같은 역할을 두 번 하는 팀과 달라집니다. 무엇을 같이 정하고 어디서 각자의 판단을 쓸지에 따라 기회가 실제 사업으로 옮겨가는 모습도 달라집니다.`,
        marriage: `${a}님이 건네는 ${root.gift}과 ${b}님이 보태는 ${reverse.gift}을 생활 속에서 나눠 쓸 수 있습니다. 집을 잘 굴리는 날과 서로를 쉬게 해주는 날에는 필요한 도움의 모양도 달라집니다.`,
        parentChild: `부모 ${a}님의 ${root.gift}이 자녀를 받쳐주는 한편, 자녀 ${b}님의 ${reverse.gift}도 부모에게 새로운 경험을 남깁니다. 돌보는 역할은 정해져 있어도 서로에게 배우는 방향까지 한쪽인 관계는 아닙니다.`,
        managerReport: `상사 ${a}님에게서 오는 ${root.gift}과 팀원 ${b}님이 가져오는 ${reverse.gift}은 다른 위치에서 작동합니다. 계획을 정하는 사람과 실제 상황을 만나는 사람이 서로의 판단에 필요한 것을 건넬 수 있습니다.`,
        coworker: `${a}님 쪽의 ${root.gift}이 필요한 업무와 ${b}님 쪽의 ${reverse.gift}이 살아나는 업무가 다를 수 있습니다. 모든 단계에서 같은 속도를 내기보다 서로 잘 이어받는 구간을 알게 될수록 협업이 편해집니다.`,
      }[category],
      category === "businessPartner" && (equal || pressure)
        ? "매출은 늘었는데 둘 다 ‘내가 더 많이 했다’고 느끼기 시작하면 숫자만 맞춰서는 대화가 끝나지 않습니다. 고객을 데려온 수고와 약속을 지켜낸 수고가 서로 보이지 않을 때, 함께 이긴 결과 안에서도 각자 억울해집니다."
        : category === "friendship" ? "친구의 달라진 생활을 만나는 것도 우정의 일부입니다. 모임에서 새로 친해진 사람을 소개받거나 오랜만에 여행 이야기를 나누면, 예전의 내 친구와 요즘의 그 사람이 한자리에서 다시 이어집니다."
          : {
            love: `${a}님과 ${b}님은 자주 만났다는 사실만으로 안심하기보다 만남 뒤에 남은 느낌을 오래 기억할 수 있습니다. 잘 보이려 애쓴 날보다 별말 없이 웃었던 날이 더 선명하게 남기도 합니다.`,
            marriage: `${a}님과 ${b}님이 하루를 마친 뒤에는 옳은 말을 더 듣고 싶은 날보다 그냥 내 편이 옆에 있었으면 하는 날도 있습니다. 잘 돌아가는 생활 속에서도 두 사람이 따로 쉬어갈 자리가 필요합니다.`,
            parentChild: `부모 ${a}님이 다 챙겨주고 싶었던 일에서 자녀 ${b}님은 혼자 해낸 부분을 먼저 이야기하고 싶을 수 있습니다. 고맙다는 마음과 내 힘도 알아줬으면 하는 마음은 같이 자랍니다.`,
            managerReport: `상사 ${a}님이 진행 상황을 묻는 동안 팀원 ${b}님은 이제 어디까지 혼자 정해도 되는지 가늠합니다. 확인받는 일에 익숙해질수록 자기 판단을 꺼내는 순간이 의외로 더 조심스러워질 수 있습니다.`,
            coworker: `${a}님과 ${b}님이 오래 같이 일해도 서로 머릿속의 마감선까지 같아지지는 않습니다. 한 사람이 끝냈다고 보낸 자료에서 다른 사람은 이제 확인할 일을 시작하는 순간도 있습니다.`,
            businessPartner: `${a}님과 ${b}님이 함께 정한 제안도 실행에 들어가면 각자 맡은 일에서 다른 표정을 만납니다. 잘될 거라는 기대를 나눈 뒤에는 실제로 누가 무엇을 떠안았는지도 보이기 시작합니다.`,
          }[category],
    ]);
    if (scene.chapter === "directions") {
      const slot = scene.subject as PairSlot, target = otherSlot(slot), s = name(slot), t = name(target), sv = voice(slot), tv = voice(target), p = portrait(slot);
      const action = categoryReceived(category, d(slot).receivedTenGod?.tenGod ?? "");
      if (!action) return scene;
      const location = { love: "마음을 표현하는 대화", marriage: "집에서 내일 일정을 나누는 대화", friendship: "친구끼리 근황을 풀어놓는 자리", businessPartner: "고객 제안을 검토하는 회의", coworker: "결과물을 넘기며 의견을 주고받는 자리", parentChild: slot === "personA" ? "부모가 자녀의 선택을 듣는 시간" : "자녀가 부모에게 자기 경험을 이야기하는 시간", managerReport: slot === "personA" ? "상사가 우선순위를 정하는 순간" : "팀원이 현장 상황을 보고하는 순간" }[category];
      const reaction = { love: "관심을 충분히 보냈다는 생각과 사랑받았다는 느낌 사이에 간격이 생깁니다", marriage: "생활의 문제를 정리한 뒤에도 마음이 풀리는 데에는 다른 시간이 필요합니다", friendship: "친구가 바라던 리액션과 정성껏 준비한 답이 엇갈릴 수 있습니다", businessPartner: "바로 실행할 안과 사람을 설득할 과정 중 무엇이 먼저인지 달라집니다", coworker: "고칠 내용은 같아도 동료가 편히 받아들이는 설명 순서는 달라집니다", parentChild: "도와줬다는 부모의 마음과 내 생각을 들어줬다는 자녀의 느낌이 다를 수 있습니다", managerReport: "명확히 전달했다는 상사의 확신과 결정할 수 있다는 팀원의 안심이 어긋날 수 있습니다" }[category];
      // Re-express only the native fact already selected in this E1 scene.
      const nativeFact = e.facts.find(f => scene.evidenceRefs.includes(f.id) && f.subject === slot && ["sinsal_hyeonchim", "twelve_sinsal_hwagae"].includes(f.featureId));
      const native = nativeFact ? [slot !== first ? nativeFact.featureId === "sinsal_hyeonchim" ? {
        love: `${s}님이 ${t}님에게 보내는 관심에는 세밀한 기억이 섞입니다. 전에 좋아한다고 했던 것과 오늘의 표정이 다르면 지나치기보다 이유가 궁금해지는 쪽입니다.`,
        friendship: `${s}님은 ${t}님이 무심코 꺼낸 고민의 작은 단서를 기억합니다. 별말 안 했다고 생각한 친구에게는 다시 물어봐 주는 그 한마디가 뜻밖의 챙김이 됩니다.`,
        businessPartner: `${s}님은 ${t}님이 잡은 기회에 어떤 조건이 빠졌는지 살핍니다. 처음에는 까다로운 질문처럼 들렸던 말이 나중에 계약의 손실을 줄일 확인 항목이 될 수 있습니다.`,
        marriage: `${s}님에게는 ${t}님이 평소와 다르게 놓아둔 물건이나 짧게 답한 말도 눈에 들어옵니다. 자세히 보고 있다는 애정과 오늘도 뭔가 들킨 듯한 느낌이 한집 안에서 만납니다.`,
        coworker: `${s}님의 검토는 ${t}님이 속도를 내느라 지나친 부분까지 닿습니다. 틀린 것을 찾았을 때 누구의 잘못인지보다 결과가 어떻게 나아지는지에서 이 세밀함의 가치가 살아납니다.`,
        parentChild: `${s}님은 ${t}님의 걱정이나 망설임이 말보다 먼저 표정에 나타나는 순간을 잘 봅니다. 서로 가까운 만큼 작은 어조 차이도 크게 들릴 수 있는 가족의 예민한 접점입니다.`,
        managerReport: `${s}님이 다시 짚는 세부 조건은 ${t}님의 판단을 더 정확하게 만들 수 있습니다. 꼬치꼬치 묻는 것처럼 보여도 당장 보이지 않던 업무의 빈틈을 함께 발견하는 장점입니다.`,
      }[category] : {
        love: `${s}님은 ${t}님과 나눈 이야기를 자기만의 시간에 오래 품기도 합니다. 바로 뜨거운 반응이 없었어도 다음에 꺼내는 질문에는 그날의 대화가 깊게 남아 있습니다.`,
        friendship: `${s}님은 ${t}님에게 혼자 발견한 취향을 조심스럽게 보여주는 친구일 수 있습니다. 사람 많은 모임과 다른 깊이의 이야기가 둘만 만났을 때 열립니다.`,
        businessPartner: `${s}님이 혼자 검토해 가져오는 관점은 ${t}님의 익숙한 가정을 다시 보게 합니다. 회의에서 바로 동의하지 않았던 대목이 시간이 지나 더 탄탄한 제안으로 돌아올 수 있습니다.`,
        marriage: `${s}님의 혼자 있는 시간에도 ${t}님과 함께 사는 경험은 천천히 쌓입니다. 모든 여가를 같이 보내지 않더라도 각자의 취향을 존중받는 안심이 생활의 깊이가 됩니다.`,
        coworker: `${s}님은 ${t}님과 떠올린 주제를 혼자 더 파고들며 결과의 밀도를 높이기도 합니다. 빨리 말하는 기여와 깊이 생각해 가져오는 기여가 다른 시간에 보이는 셈입니다.`,
        parentChild: `${s}님이 몰입하는 세계를 ${t}님에게 보여주는 순간에는 설명이 유난히 자세해질 수 있습니다. 늘 하는 안부보다 서로 좋아하는 것을 듣는 자리에서 가족의 다른 얼굴이 보입니다.`,
        managerReport: `${s}님에게 검토할 시간이 남으면 ${t}님에게 가져갈 근거도 단단해집니다. 회의 중 즉답이 없던 사람이 나중에 핵심을 짚는 반전은 생각을 숙성하는 이 방식에서 나옵니다.`,
      }[category] : nativeFact.featureId === "sinsal_hyeonchim" ? {
        love: `${s}님은 ${t}님의 답장이 평소보다 짧아진 날을 빨리 알아차립니다. 관심이 세밀한 만큼 상대가 무심코 고른 단어에도 마음속 확대경이 켜질 수 있습니다.`,
        friendship: `${s}님에게는 모임에서 ${t}님이 잠깐 말수를 줄인 장면이 남습니다. 모두 웃고 넘어간 농담이 친구에게도 괜찮았는지 나중에 따로 떠올리는 세밀함입니다.`,
        businessPartner: `${s}님은 ${t}님이 받은 제안에서 앞뒤가 다른 조건을 빨리 붙잡습니다. 계약의 빈틈을 찾는 눈이 든든하지만 파트너의 말까지 늘 검수하면 회의의 긴장도 높아집니다.`,
        marriage: `${s}님은 ${t}님이 집에서 평소와 다르게 반응하는 작은 습관을 잘 봅니다. 먼저 알아줘서 고마운 날도 있고 오늘은 조금 대충 넘어가줬으면 싶은 날도 있습니다.`,
        coworker: `${s}님은 ${t}님이 넘긴 자료에서 빠진 연결이나 모순을 일찍 짚습니다. 결과물의 허점을 줄이는 장점이 사람에 대한 평가로 들리는 순간에는 동료도 설명에 힘을 주게 됩니다.`,
        parentChild: `${s}님은 ${t}님의 평소와 다른 표정을 일찍 발견합니다. 알아채는 속도가 빠르다고 아직 말하지 않은 마음의 이유까지 맞힌 것은 아니라서 가족 사이에도 뜻밖의 오해가 생길 수 있습니다.`,
        managerReport: `${s}님은 ${t}님의 설명에서 앞뒤가 맞지 않는 부분을 빨리 찾습니다. 일을 정확하게 만드는 힘이지만 짧은 보고에도 질문이 이어지면 판단을 나누는 시간이 시험처럼 느껴질 수 있습니다.`,
      }[category] : {
        love: `${s}님은 ${t}님과 헤어진 뒤 혼자 생각을 정리하며 애정의 모양을 알아가기도 합니다. 조용해진 시간을 마음이 멀어진 시간으로만 읽으면 다음 만남에 가져올 깊은 한마디를 놓칩니다.`,
        friendship: `${s}님은 ${t}님이 추천한 이야기나 취미를 혼자 더 깊게 파고들기도 합니다. 다음에 만났을 때 친구가 던진 가벼운 화제가 뜻밖에 진지한 대화로 돌아옵니다.`,
        businessPartner: `${s}님은 ${t}님과 회의가 끝난 뒤 혼자 가정을 다시 들여다볼 시간이 필요할 수 있습니다. 그 자리의 짧은 반응보다 뒤에 정리해서 가져오는 판단에 무게가 실립니다.`,
        marriage: `${s}님이 집에서도 혼자 몰입할 자리를 찾는 것은 ${t}님과의 생활을 싫어한다는 뜻만은 아닙니다. 자기 세계에서 충분히 쉬고 돌아와야 같이 보내는 시간에도 할 이야기가 살아납니다.`,
        coworker: `${s}님은 ${t}님과 나눈 안건을 혼자 정리한 뒤 더 깊은 답을 가져오기도 합니다. 회의 중 발언량만으로 기여를 재면 뒤에서 숙성된 생각이 잘 보이지 않습니다.`,
        parentChild: `${s}님에게 혼자 좋아하는 것을 파고드는 시간은 가족과 나눌 이야기를 키우는 시간이기도 합니다. ${t}님이 그 세계를 궁금해하면 짧던 대답이 뜻밖에 길어질 수 있습니다.`,
        managerReport: `${s}님은 ${t}님 앞에서 바로 대답할 때보다 혼자 검토한 뒤 판단의 깊이를 보여주기도 합니다. 즉석 반응만으로 생각의 양까지 평가하면 아직 정리 중이던 좋은 의견을 놓칩니다.`,
      }[category]] : [];
      const headline = { love: `${s}님을 좋아할 때 ${t}님에게 생기는 변화`, marriage: `${s}님과 생활을 나누는 ${t}님의 표정`, friendship: `${s}님이라는 친구가 ${t}님을 움직이는 순간`, businessPartner: `${s}님의 제안 앞에서 ${t}님이 더 보게 되는 것`, coworker: `${s}님과 일할 때 ${t}님이 힘을 주는 부분`, parentChild: slot === "personA" ? `부모 ${s}님의 마음이 자녀 ${t}님에게 닿을 때` : `자녀 ${s}님이 부모 ${t}님의 방식을 바꾸는 순간`, managerReport: slot === "personA" ? `상사 ${s}님의 말이 팀원 ${t}님의 판단이 될 때` : `팀원 ${s}님의 현장이 상사 ${t}님의 계획을 바꿀 때` }[category];
      return rewrite(scene, headline, [
        `${s}님과 ${category === "love" ? "마음을 주고받는" : category === "marriage" ? "같이 사는" : category === "friendship" ? "친구로 만나는" : category === "businessPartner" ? "사업을 함께하는" : category === "coworker" ? "일을 나누는" : "매일 영향을 주고받는"} ${t}님은 ${action}.`,
        ...(sv ? [`${location}에서는 ${sv.doing} ${s}님의 말투가 살아납니다. ${tv ? `${tv.hears} ${t}님 쪽에서는 ${sv.style !== tv.style ? reaction : `익숙한 설명이라 뜻을 빨리 잡는 대신 ${s}님도 나와 같은 생각까지 했을 거라 믿기 쉽습니다`}.` : `${t}님이 그 말을 어떤 느낌으로 받았는지는 실제 답을 들으며 알아가게 됩니다.`}`] : []),
        ...native,
        asymmetric ? scene.parts.at(-1)!.text : `${t}님이 ${s}님에게 힘을 받는 만큼 과해질 때도 있습니다. ${s}님과 ${t}님 사이에서는 ${p.excess}.`,
      ]);
    }
    if (scene.angle === "connection") return rewrite(scene, {
      love: "같이 좋아하게 된 것이 둘만의 취향이 됩니다", marriage: "생활을 맞춰본 경험이 집의 편안함으로 남습니다", friendship: "오랜만인데도 다시 편해지는 지름길이 있습니다", businessPartner: "한 사람의 기회가 다른 사람의 실행을 만날 때", coworker: "내 결과물을 동료가 이어서 완성하는 힘", parentChild: "함께 해본 기억이 다음 도전의 발판이 됩니다", managerReport: "맡겨본 경험이 다음 판단의 자리를 넓힙니다",
    }[category], [harmony ? `둘 사이에는 서로 연결되는 좋은 합이 있습니다. ${copy.good}` : `${a}님과 ${b}님이 나누는 ${root.gift}을 실제 장면으로 옮기면 이렇습니다. ${copy.good}`]);
    if (scene.angle.endsWith("-gwiin_cheoneul")) {
      const s = name(scene.subject as PairSlot), t = name(otherSlot(scene.subject as PairSlot));
      return rewrite(scene, scene.headline, [`${s}님에게는 좋은 사람과 도움을 연결하는 귀인의 패가 있습니다. ${{
        love: `${t}님과 고민을 나눌 때도 믿을 만한 사람의 조언이 둘의 막힌 대화에 다른 창을 열 수 있습니다. 함께 만난 사람에게 편히 마음을 놓게 되는 것도 연애에 가져오는 좋은 인복입니다.`,
        friendship: `${t}님이 낯선 선택 앞에서 막혔을 때 혼자 답을 다 내기보다 물어볼 만한 사람을 떠올리는 쪽으로 힘이 살아납니다. 친구 한 명을 만났는데 세상에 기댈 곳도 조금 넓어지는 모습입니다.`,
        businessPartner: `${t}님과 둘이 풀리지 않던 문제를 경험 있는 사람에게 묻거나 믿을 만한 소개로 이어갈 여지가 있습니다. 모든 답을 둘이 갖고 있어야 한다는 부담을 덜어주는 사업의 사람복입니다.`,
        marriage: `${t}님과 생활을 꾸리며 모르는 일이 생겼을 때 의논할 사람과 도움의 연결이 좋은 자원이 됩니다. 둘만 버텨야 한다는 마음을 덜어주는 든든함입니다.`,
        coworker: `${t}님과 막힌 업무를 풀 때 알맞은 경험을 가진 동료나 조언자를 연결하는 장점으로 쓸 수 있습니다. 혼자 해결한 성과만큼 길을 아는 사람을 찾는 힘도 팀에 남습니다.`,
        parentChild: `${t}님과 가족 안에서 풀기 어려운 고민을 나눌 때 믿을 만한 조언자가 생길 여지를 좋은 자원으로 쓸 수 있습니다. 돌봄의 답을 가족끼리만 모두 만들어야 하는 것은 아닙니다.`,
        managerReport: `${t}님과 일을 풀어가며 필요한 경험과 사람을 연결하는 데 보탬이 됩니다. 서로가 유일한 답변자가 되기보다 다른 전문가의 시야까지 팀 안으로 가져올 수 있는 좋은 패입니다.`,
      }[category]}`]);
    }
    if (scene.angle.endsWith("-twelve_sinsal_yeokma")) {
      const s = name(scene.subject as PairSlot), t = name(otherSlot(scene.subject as PairSlot));
      return rewrite(scene, scene.headline, [`${s}님이 가진 이동의 힘은 ${t}님과 익숙한 자리 밖으로 나갔을 때 살아납니다. ${{
        love: "늘 가던 곳을 벗어나면 평소 몰랐던 취향에 눈이 갑니다. 새로운 풍경 못지않게 낯선 곳에서 상대가 무엇을 좋아하는지 발견하는 재미가 있습니다.",
        friendship: "여행길에서 길을 고르고 모임에서 처음 보는 사람을 만나며 친구의 다른 면을 보게 됩니다. 오래 알았다는 이유로 더 알아갈 이야기가 끝난 사이는 아닙니다.",
        businessPartner: "현장과 외부 고객을 만나며 책상 앞에서 가정했던 문제에 실제 얼굴이 붙습니다. 이동이 많다는 사실보다 돌아와 어떤 판단을 바꾸는지가 사업의 기회로 남습니다.",
        marriage: "생활의 배경을 잠깐 바꾸는 경험이 집에서는 반복되던 대화를 새롭게 만들 수 있습니다. 함께 나갔다 돌아오는 길에 가족의 다음 취향이 생기기도 합니다.",
        coworker: "다른 팀이나 현장을 만나고 돌아오면 익숙한 업무의 조건도 새롭게 보입니다. 밖에서 얻은 관찰을 동료에게 가져오는 것이 협업에 보탬이 되는 장면입니다.",
        parentChild: "가족끼리 늘 하던 질문도 바깥 경험을 함께 나누면 다른 답으로 돌아옵니다. 누가 더 잘 아는지 설명하는 시간보다 같이 처음 보는 시간이 가까움을 만들 수 있습니다.",
        managerReport: "팀 밖의 고객이나 현장과 접촉한 경험이 내부 보고에 구체성을 보탭니다. 바깥에서 배운 점이 실제 결정에 반영될 때 이동의 장점이 팀의 자산이 됩니다.",
      }[category]}`]);
    }
    if (scene.angle === "whole-pair") return rewrite(scene, { love: "서로를 다시 고르는 두 사람", marriage: "같은 집에서 각자의 숨도 편해지도록", friendship: "공백 뒤에도 이어 쓸 이야기가 있는 친구", businessPartner: "꿈은 함께 키우고 위험은 분명히 나누는 파트너", coworker: "내 일이 네 일로 잘 이어지는 동료", parentChild: "돌아올 곳을 주고 나아갈 힘을 남기는 가족", managerReport: "확인을 줄이는 것보다 판단을 키우는 팀" }[category], copy.ending);
    return scene;
  });
  const { scenes: composed, ...editorialAudit } = composeEditorial({ product: "saju_mbti_compatibility", facts: e.facts, chapters: original.chapters.map(c => c.id), scenes,
    selectedEvidenceRefs: [...new Set(scenes.flatMap(s => s.evidenceRefs))], substantialEvidenceRefs: e.substantial });
  return { ...original, version: COMPATIBILITY_V3_POLISHED_VERSION, chapters: original.chapters.map(c => ({ ...c, title: c.id === "chemistry" ? copy.title : c.title, scenes: composed.filter(s => s.chapter === c.id) })), editorialAudit };
}

/** Public labels only. No name/provenance strings are shortened heuristically. */
export function compactCompatibilityLabels(scene: EditorialScene, facts: readonly Evidence[], people: CompatibilityV3Draft["people"]): string[] {
  const used = facts.filter(f => scene.evidenceRefs.includes(f.id));
  const types = (["personA", "personB"] as const).flatMap(slot => people[slot].mbti && used.some(f => f.subject === slot && f.kind === "mbti") ? [people[slot].mbti] : []);
  const gods = (["personA", "personB"] as const).flatMap(slot => {
    const f = used.find(f => f.subject === slot && f.featureId === "pair:received-god");
    const value = f?.value as { detail?: { tenGodKo?: string } } | undefined;
    return value?.detail?.tenGodKo ? [value.detail.tenGodKo] : [];
  });
  const labels = [...(types.length ? [types.join(" × ")] : []), ...(gods.length ? [gods.join("↔")] : [])];
  for (const f of used) {
    if (f.kind === "mbti" || f.featureId === "pair:received-god") continue;
    if (!f.featureId.startsWith("pair:")) { labels.push(factLabel(f)); continue; }
    const detail = (f.value as { detail?: { kind?: string; refs?: readonly { branch: string }[] } } | undefined)?.detail;
    const kind = detail?.kind && ({ six_harmony: "육합", three_harmony: "삼합", half_harmony: "반합", clash: "충", harm: "해" } as Record<string, string>)[detail.kind];
    if (kind && detail?.refs) labels.push(kind);
  }
  return [...customerEvidenceLabels(labels)];
}
