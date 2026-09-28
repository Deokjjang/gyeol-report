import { composeEditorial, type EditorialScene, type EditorialForm, type EditorialTone } from "./editorialComposer";
import { categoryScenes, CATEGORY_LABELS, CATEGORY_ENDINGS, PAIR_GODS, PAIR_VOICES, PAIR_MISREADS, PAIR_FRICTION_COPY } from "./compatibilityEditorialCopy";
import { PAIR_SLOTS, otherSlot, type PairSlot, type compatibilityEditorialEvidence } from "./compatibilityEditorialEvidence";
import { compatibilityRoleLabels, COMPATIBILITY_ROLE_VERSION, type CompatibilityRelationshipType } from "../report-generation/reportInputTypes";
import type { Evidence } from "./types";

export const COMPATIBILITY_V3_VERSION = "compatibility_v3.0-editorial.1";
type PairEvidence = ReturnType<typeof compatibilityEditorialEvidence>;
export type CompatibilityV3Draft = {
  readonly productType: "saju_mbti_compatibility"; readonly productVersion: "v3"; readonly version: typeof COMPATIBILITY_V3_VERSION;
  readonly compatibilityRoleVersion: typeof COMPATIBILITY_ROLE_VERSION;
  readonly relationshipType: CompatibilityRelationshipType; readonly title: string;
  readonly people: Readonly<Record<PairSlot, { readonly name: string; readonly mbti: string; readonly role: string }>>;
  readonly chapters: readonly { readonly id: string; readonly title: string; readonly scenes: readonly EditorialScene[] }[];
  readonly editorialAudit: Omit<ReturnType<typeof composeEditorial>, "scenes">;
};
export function isCompatibilityV3Draft(value: unknown): value is CompatibilityV3Draft {
  return !!value && typeof value === "object" && "version" in value && value.version === COMPATIBILITY_V3_VERSION && "productType" in value && value.productType === "saju_mbti_compatibility" && "productVersion" in value && value.productVersion === "v3";
}
export function compatibilityV3CustomerText(draft: CompatibilityV3Draft) {
  return [draft.title, ...PAIR_SLOTS.map(s => `${draft.people[s].role} · ${draft.people[s].name} · ${draft.people[s].mbti || "모름"}`), `관계 유형 · ${CATEGORY_LABELS[draft.relationshipType]}`,
    ...draft.chapters.flatMap(c => [c.title, ...c.scenes.flatMap(s => [s.headline, ...s.parts.map(p => p.text)])])].join("\n\n");
}

export function buildCompatibilityV3(e: PairEvidence, category: CompatibilityRelationshipType): CompatibilityV3Draft {
  const { direction, facts, relations } = e, roles = compatibilityRoleLabels(category);
  const people = Object.fromEntries(PAIR_SLOTS.map(slot => [slot, { name: direction.persons[slot].name, mbti: direction.persons[slot].mbti ?? "", role: roles[slot] }])) as CompatibilityV3Draft["people"];
  const asymmetric = category === "parentChild" || category === "managerReport";
  // Symmetric pair prose has a stable person order. Role-asymmetric prose MUST
  // instead follow the explicitly versioned A=parent/manager input contract.
  const first: PairSlot = asymmetric || direction.persons.personA.personId <= direction.persons.personB.personId ? "personA" : "personB";
  const displayName = (slot: PairSlot) => people.personA.name === people.personB.name ? `${people[slot].name}(${roles[slot]})` : people[slot].name;
  const second = otherSlot(first), a = displayName(first), b = displayName(second);
  const d = (slot: PairSlot) => slot === "personA" ? direction.aToB : direction.bToA;
  const portrait = (slot: PairSlot) => PAIR_GODS[d(slot).receivedTenGod?.tenGod ?? ""];
  const root = portrait(first), reverse = portrait(second);
  const fact = (slot: PairSlot, key: string) => facts.find(f => f.id === `${slot}:pair:${key}`)!;
  const base = PAIR_SLOTS.map(slot => fact(slot, "received-god")).filter(Boolean);
  const voice = (slot: PairSlot) => {
    const v = PAIR_VOICES[people[slot].mbti];
    const f = v && facts.find(f => f.subject === slot && f.featureId === `mbti:${people[slot].mbti}:traits:communication:${v.trait}`);
    return f ? { ...v, fact: f } : undefined;
  };
  const voices = PAIR_SLOTS.flatMap(slot => voice(slot) ? [voice(slot)!.fact] : []);
  const pairRefs = PAIR_SLOTS.flatMap(slot => fact(slot, "mbti") ? [fact(slot, "mbti")] : []);
  const v1 = voice(first), v2 = voice(second);
  const equal = ["比肩", "劫財"].includes(d(first).receivedTenGod?.tenGod ?? "");
  const pressure = [d(first), d(second)].some(x => ["正官", "偏官"].includes(x.receivedTenGod?.tenGod ?? ""));
  const contrast = !!v1 && !!v2 && v1.style !== v2.style;
  const quiet = [v1, v2].some(v => v?.style === "quiet") && ![v1, v2].some(v => v?.style === "expressive");
  const harmony = relations.find(r => ["six_harmony", "three_harmony", "half_harmony"].includes(r.kind));
  const friction = relations.find(r => r.kind === "clash" || r.kind === "harm");
  const relationFact = (r: typeof harmony) => r ? facts.find(f => f.id === `personA:pair:${r.identity}`) : undefined;
  const strong = (slot: PairSlot, id: string) => facts.find(f => f.subject === slot && f.featureId === id && e.substantial.includes(f.id));
  const pair = d(first).mbtiPair;
  // Keep DB statements about BOTH people. Never treat "one side" as the owner
  // of a notablePairs entry. Same-type entries use "두 사람", not one name.
  const personalizePair = (text: string) => text.replace(/\b(ENTJ|INTJ|ENTP|INTP|ENFJ|INFJ|ENFP|INFP|ESTJ|ISTJ|ESFJ|ISFJ|ESTP|ISTP|ESFP|ISFP)(은|는|이|가|을|를|와|과)?/g,
    (_match, type: string, particle: string | undefined) => {
      const name = people[first].mbti === people[second].mbti ? "두 사람" : type === people[first].mbti ? `${a}님` : type === people[second].mbti ? `${b}님` : type;
      return name + (particle ? ({ 는: "은", 가: "이", 를: "을", 와: "과" }[particle] ?? particle) : "");
    }).replace(/한다\./g, "합니다.").replace(/된다\./g, "됩니다.").replace(/준다\./g, "줍니다.").replace(/있다\./g, "있습니다.").replace(/없다\./g, "없습니다.").replace(/느낀다\./g, "느낍니다.").replace(/못한다\./g, "못합니다.");
  const planned: { id: string; title: string }[] = [], scenes: EditorialScene[] = [];
  const chapter = (id: string, title: string) => planned.push({ id, title });
  const add = (chapter: string, angle: string, headline: string, parts: readonly string[], form: EditorialForm, tone: EditorialTone, anchors: readonly Evidence[] = [...base, ...voices], subject: PairSlot = "personA", advice = false) => {
    const refs = [...new Map(anchors.map(f => [f.id, f])).values()];
    scenes.push({ id: `compatibility:${chapter}:${angle}`, chapter, angle, order: scenes.length, domain: "relationship", subject, toward: otherSlot(subject), headline, form, tone,
      parts: parts.map(text => ({ role: advice ? "advice" : "character", text })), evidenceRefs: refs.map(f => f.id), sourceRefs: [...new Set([...refs.flatMap(f => f.sourceRefs), "compatibilityEditorial:reviewed-copy", `input:relationshipType:${category}`, COMPATIBILITY_ROLE_VERSION])] });
  };
  const finish = (): CompatibilityV3Draft => {
    const { scenes: composed, ...editorialAudit } = composeEditorial({ product: "saju_mbti_compatibility", facts, chapters: planned.map(c => c.id), scenes,
      selectedEvidenceRefs: [...new Set(scenes.flatMap(s => s.evidenceRefs))], substantialEvidenceRefs: e.substantial });
    return { productType: "saju_mbti_compatibility", productVersion: "v3", version: COMPATIBILITY_V3_VERSION, compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
      relationshipType: category, title: `${people.personA.name}님과 ${people.personB.name}님 사이의 결`, people,
      chapters: planned.map(c => ({ ...c, scenes: composed.filter(s => s.chapter === c.id) })), editorialAudit };
  };
  if (!root || !reverse || base.length !== 2) return finish(); // Publication fails closed.
  chapter("chemistry", "둘이 만나면 생기는 제삼의 분위기");
  add("chemistry", "opening", equal ? "닮아서 반갑고, 닮아서 은근히 지기 싫습니다" : pressure ? "서로를 단단하게 하는데, 가끔은 너무 열심입니다" : "혼자일 때 안 하던 반응이 둘 사이에서 나옵니다", [
    `${a}님과 ${b}님은 ${root.need}에서 가까워지고, ${reverse.need}에서는 서로 다른 마음의 순서를 만납니다. ${equal ? "함께하면 나도 한번 해보고 싶어지는 조합이라 응원과 경쟁의 경계가 생각보다 가깝습니다." : pressure ? "서로의 존재가 선택을 더 진지하게 만드는 만큼 가볍게 넘길 말에도 힘이 실립니다." : "혼자였다면 그냥 지나갔을 장면에 상대가 새로운 표정과 생각을 붙여줍니다."}`,
    `${a}님이 가져오는 힘과 ${b}님이 돌려주는 힘은 ${equal ? "서로 닮아 있어도 각자의 선택에서 다른 모습으로 드러납니다" : "같은 방향이 아닙니다"}. 둘의 좋은 패는 ${root.gift}입니다. 상대에게서 무엇을 받는지 알아차릴수록 나와 다르게 반응하는 점도 관계의 재료가 됩니다.`,
    contrast ? `${v1 ? `${v1.doing} ${a}님` : a}과 ${v2 ? `${v2.hears} ${b}님` : b}이 만나면, 한쪽은 충분히 설명했다고 느끼는데 다른 쪽은 가장 듣고 싶던 말이 빠졌다고 느낍니다. 관심이 없어서가 아니라 관심을 전달하는 포장이 달라 생기는 웃기고도 억울한 엇갈림입니다.` : quiet ? "대화를 아껴서 편해지는 순간도 있지만, 둘 다 알아서 이해해 주겠거니 하면 침묵이 지나치게 유능한 통역사 취급을 받습니다. 말하지 않은 마음까지 자동으로 전달되지는 않는 사이입니다." : "주변에서 보기에 호흡이 맞는 날에도 둘 사이에는 자기만 아는 속사정이 있습니다. 같이 신나게 움직였다고 같은 지점에서 쉬고 싶은 것까지 일치하지는 않습니다.",
    asymmetric ? category === "parentChild" ? `부모 ${people.personA.name}님의 보호와 자녀 ${people.personB.name}님의 선택은 같은 자리에 놓이지 않습니다. 돌봐주는 마음이 자녀의 자기 힘을 키우는 쪽으로 이어질 때 이 관계의 좋은 힘이 살아납니다.` : `상사 ${people.personA.name}님의 결정은 팀원 ${people.personB.name}님의 실행 환경이 됩니다. 둘의 성향이 잘 만나는 순간에는 지시와 보고를 넘어 서로가 놓친 것을 발견하는 팀이 됩니다.`
      : `이 관계가 재미있는 건 서로를 닮게 만들 때보다 둘이어서 가능한 반응을 발견할 때입니다. ${CATEGORY_LABELS[category]}라는 이름 안에서도 두 사람이 편히 웃는 순간과 힘을 주는 순간은 이렇게 다른 얼굴을 갖습니다.`,
  ], "prose", "recognition");

  chapter("directions", "나는 너에게, 너는 나에게");
  for (const slot of PAIR_SLOTS) {
    const target = otherSlot(slot), s = displayName(slot), t = displayName(target), p = portrait(slot), sv = voice(slot), tv = voice(target);
    const precise = strong(slot, "sinsal_hyeonchim"), deep = strong(slot, "twelve_sinsal_hwagae");
    const roleScene = asymmetric ? category === "parentChild" ? slot === "personA"
      ? `부모 ${s}님의 기대는 자녀 ${t}님에게 도전의 기준이 되기도 합니다. 먼저 도와주고 싶은 순간에도 자녀가 직접 고른 부분이 남아 있으면 응원이 통제로 바뀌는 간격이 줄어듭니다.`
      : `자녀 ${s}님이 자기 생각을 꺼내는 장면은 부모 ${t}님의 익숙한 돌봄 방식을 다시 보게 합니다. 부모가 예상하지 못한 선택을 했다는 이유만으로 마음까지 멀어진 것은 아닙니다.`
      : slot === "personA" ? `상사 ${s}님의 한마디는 팀원 ${t}님에게 선택의 기준으로 남습니다. 방향을 주는 힘이 큰 만큼 중간에 바뀐 생각도 팀원에게는 실제 업무가 됩니다.`
      : `팀원 ${s}님이 현장에서 가져오는 반응은 상사 ${t}님의 계획을 현실에 맞게 다듬습니다. 허락을 구하는 보고에서 자기 판단을 담은 제안으로 바뀔 때 둘 사이의 신뢰도 다음 단계로 갑니다.` : undefined;
    add("directions", `${slot}-toward-${target}`, `${s}님이 ${t}님에게 남기는 반응`, [
      slot === first ? `${s}님과 마주한 ${t}님은 ${p.received}. ${p.need}이 이 관계에서 유난히 생생해지는 이유입니다.` : `${s}님에게서 받는 힘을 ${t}님 쪽에서 보면 ${p.need}이 더 중요해집니다. ${t}님은 ${p.received}. ${s}님이 곁에 있을 때 평소와 달라지는 선택에도 이 관계의 색이 묻어납니다.`,
      ...(sv ? [`${p.need}을 주고받는 과정에서 ${sv.doing} ${s}님의 방식이 드러납니다. ${tv ? `${tv.hears} ${t}님에게는 ${sv.style === tv.style ? "익숙한 말투라 뜻을 빨리 알아듣는 반면, 서로 생략한 설명까지 같다고 믿기 쉽습니다." : "의도와 도착한 느낌 사이에 한 번의 번역이 필요합니다."}` : `${t}님이 실제로 어떤 말에 반응하는지 주고받는 대화에서 알아갈 여지가 남습니다.`}`] : []),
      ...(precise ? [slot === first ? `${s}님은 ${t}님의 평소와 다른 짧은 대답이나 말의 모순을 일찍 알아차리는 쪽입니다. ${sv?.style === "direct" ? "눈치챈 순간 이유와 수정안까지 바로 꺼내면 상대는 자기 마음보다 분석 결과를 먼저 받기도 합니다." : "알아차린 것을 바로 따지지 않아도 그 한마디를 기억하고 다음 반응과 이어보게 됩니다."}` : `${s}님의 세밀함은 ${t}님이 대수롭지 않게 넘긴 표현까지 붙잡습니다. 제대로 듣고 있다는 든든함과 작은 말도 허투루 할 수 없다는 긴장감이 같은 관찰에서 나옵니다.`] : deep ? [slot === first ? `${s}님에게 혼자 생각을 숙성하는 시간은 ${t}님과 나눌 이야기를 없애는 시간이 아닙니다. 잠깐 조용해졌다가 돌아왔을 때 더 깊은 한마디를 꺼내는 반전이 있습니다.` : `${s}님은 ${t}님과 나눈 주제를 혼자 있을 때 더 깊게 파고들기도 합니다. 그 자리에서는 짧게 들었던 이야기가 며칠 뒤에는 뜻밖에 세심한 질문으로 돌아옵니다.`] : []),
      ...(roleScene ? [roleScene] : [slot === first ? `${t}님이 느끼는 부담은 ${s}님의 장점이 너무 열심히 작동할 때 생깁니다. ${p.excess}.` : `${t}님이 ${s}님을 가까이 느끼는 만큼 힘이 들어가는 지점도 있습니다. ${t}님 쪽에서는 ${p.excess}.`]),
    ], slot === "personA" ? "quote" : "observations", slot === "personA" ? "reversal" : "affection", [...base, ...voices, ...(precise ? [precise] : deep ? [deep] : [])], slot);
  }

  const categoryCopy = categoryScenes(category, { a, b, equal, pressure, quiet, contrast });
  const headings = category === "businessPartner" ? ["기회를 볼 때 켜지는 둘의 다른 눈", "고객 앞과 운영 안에서", "같이 키우고 같이 책임지는 돈"]
    : category === "parentChild" ? ["챙겨주는 마음과 직접 해볼 마음", "공부와 규칙 사이에 있는 표정", "마음의 말투도 같이 자랍니다"]
      : category === "managerReport" ? ["지시와 보고에 숨어 있는 기대", "맡기는 순간 드러나는 신뢰", "책임 다음에 필요한 자리"]
        : category === "coworker" ? ["일을 시작하면 보이는 두 사람", "급할 때 더 선명해지는 장점", "다음에도 함께 일하고 싶은 이유"]
          : category === "marriage" ? ["생활이 가까워질수록 보이는 취향", "집 밖의 가족, 집 안의 결정", "다시 같은 편이 되는 저녁"]
            : category === "friendship" ? ["우리 우정이 재미있어지는 순간", "고민과 은근한 승부욕 사이", "다른 삶을 살아도 남는 사이"]
              : ["관심이 붙고 마음이 움직이는 순간", "좋아서 가까워지고 그래서 부딪힙니다", "익숙해진 뒤에 더 잘 보이는 사랑"];
  for (let i = 0; i < 3; i++) {
    chapter(`life-${i}`, headings[i]);
    for (const c of categoryCopy.slice(i === 0 ? 0 : i === 1 ? 3 : 5, i === 0 ? 3 : i === 1 ? 5 : 7)) add(`life-${i}`, c.key, c.title, [c.text], c.form, c.tone, [...base, ...voices], "personA", c.tip);
  }

  chapter("assets", "둘 사이에 이미 있는 좋은 패");
  const good = harmony ? `두 사람 사이에는 맞춰가며 연결되는 좋은 합이 있습니다. ${harmony.refs.every(r => r.position === "day") ? "가까운 생활에서 서로의 자리를 찾아가는 힘이라, 사소한 취향을 같이 맞춰본 경험이 오래 남습니다." : "서로 다른 반응을 하나의 경험으로 이어가는 힘입니다. 같이 움직여본 뒤 전보다 편히 말을 건네는 순간에도 이런 접점이 살아납니다."}`
    : `${a}님과 ${b}님에게는 ${root.gift}이 좋은 관계 자원입니다. 다른 반응을 없애려 하지 않을 때 혼자서는 잘 쓰지 않던 힘을 서로에게서 얻습니다.`;
  add("assets", "connection", harmony ? "둘 사이의 좋은 합은 같이 해볼 일을 늘립니다" : "상대를 만나고 나서 쓸 수 있는 힘이 늘어납니다", [good,
    ...(pair?.positiveInfluence[0] ? [`그 접점을 말과 행동으로 옮기는 방식에도 둘의 색이 있습니다. ${personalizePair(pair.positiveInfluence[0])} 그래서 같이 보낸 시간 뒤에 혼자서는 떠올리지 못했던 선택이 남습니다.`] : []),
  ], "prose", "fortune", [...base, ...pairRefs, ...(relationFact(harmony) ? [relationFact(harmony)!] : [])]);
  if (friction) add("assets", "tension", friction.kind === "clash" ? "엇갈린다고 연결된 힘까지 없어지는 건 아닙니다" : "작은 불편을 알아차리는 시점이 다릅니다", [
    friction.kind === "clash" ? `${a}님과 ${b}님은 익숙한 속도와 방식이 맞부딪히는 순간이 있습니다. ${category === "businessPartner" ? "확장을 정하는 회의에서" : category === "parentChild" ? "가족의 규칙을 이야기할 때" : category === "coworker" || category === "managerReport" ? "마감과 수정 순서를 잡을 때" : "함께 보낼 하루를 정할 때"} 한 사람에게는 자연스러운 출발이 다른 사람에게는 갑작스러운 방향 전환이 됩니다.`
      : `${a}님과 ${b}님은 대놓고 다른 의견보다 작은 습관이 반복될 때 불편을 더 늦게 꺼낼 수 있습니다. 괜찮다고 넘긴 장면이 여러 개 쌓이면 방금 한 말 하나가 예전 일까지 불러옵니다.`,
    ...(pair?.friction[1] ? [`여기에 평소 말의 리듬까지 겹칩니다. ${personalizePair(PAIR_FRICTION_COPY[`${people[first].mbti}:${people[second].mbti}`] ?? pair.friction[1])} 싸움의 크기보다 서로 어떤 대목에서 속도를 잃었는지가 둘의 차이를 더 잘 보여줍니다.`] : []),
  ], "quote", "reversal", [...base, ...pairRefs, relationFact(friction)!]);

  for (const slot of PAIR_SLOTS) {
    const name = displayName(slot), target = displayName(otherSlot(slot));
    for (const [id, title, body] of [
      ["gwiin_cheoneul", "사람복도 관계에 가져오는 좋은 패입니다", `${name}님에게는 좋은 사람의 도움과 연결을 얻는 귀인의 패가 있습니다. ${target}님과 함께 있을 때도 혼자 끙끙대는 대신 믿을 만한 사람에게 길을 묻고 연결을 나누는 모습으로 살아납니다.`],
      ["twelve_sinsal_yeokma", "자리 하나 바꿨는데 이야기가 새로 생깁니다", `${name}님이 가진 이동의 힘은 ${target}님과 함께 겪을 경험을 넓힙니다. ${category === "businessPartner" || category === "coworker" || category === "managerReport" ? "밖의 고객이나 현장을 만나고 돌아오면 책상 앞에서 막혔던 질문에 구체적인 얼굴이 생깁니다." : "늘 하던 근황 이야기도 낯선 길을 함께 걸으면 새로운 표정으로 이어집니다."}`],
      ...(category === "love" || category === "marriage" ? [
        ["sinsal_dohwa", "여럿 속에서도 먼저 눈에 들어오는 사람", `${name}님에게는 첫인상에서 시선을 끄는 도화의 매력이 있습니다. ${target}님이 함께 있는 자리에서도 평범하게 웃거나 자기 취향을 고르는 장면이 유난히 잘 보입니다. 모두에게 주목받는 표정과 둘만 있을 때 편히 짓는 표정의 차이도 재미있는 부분입니다.`],
        ["sinsal_hongyeom", "알아갈수록 다른 온도로 보입니다", `${name}님에게는 가까워질수록 매력이 짙어지는 홍염의 힘이 있습니다. ${target}님과 둘만 아는 대화가 쌓이면 처음 소개받았을 때는 몰랐던 말투와 친밀한 온도가 드러납니다. 첫 시선을 끄는 것과는 다른, 다시 만나며 더 궁금해지는 매력입니다.`],
      ] : []),
    ]) {
      const anchor = strong(slot, id);
      if (anchor && (slot === first || !strong(first, id))) add("assets", `${slot}-${id}`, `${name}님 · ${title}`, [body], id === "sinsal_hongyeom" || id === "gwiin_cheoneul" ? "observations" : "punchline", id === "sinsal_hongyeom" || id === "gwiin_cheoneul" ? "affection" : "praise", [...base, anchor], slot);
    }
  }
  add("assets", "over-eager", "좋은 마음도 가끔 과하게 일합니다", [PAIR_MISREADS[d(first).receivedTenGod!.tenGod]], "quote", "blunt", base);
  add("assets", "outside-view", "옆에서 보는 사람은 여기가 조금 웃깁니다", [
    contrast ? `${a}님이 ${v1!.doing} 순간 ${b}님은 ${v2!.hears} 자기 방식으로 받아들입니다. 둘 다 상대를 생각했다는데, 생각한 경로를 펼쳐보면 서로 다른 지도에 도착해 있습니다.`
      : quiet ? `${a}님과 ${b}님 중 말이 줄어든 사람의 속에서는 생각이 바쁘게 움직일 수 있습니다. 조용히 기다려주는 배려와 알아서 알아주길 바라는 기대가 함께 앉으면 옆 사람만 누가 먼저 입을 열지 궁금해집니다.`
        : equal ? `${a}님과 ${b}님은 서로가 잘되길 바라면서도 자기 선택이 틀렸다는 말까지 반가운 건 아닙니다. 둘의 응원에는 가끔 ‘그래도 내 방법도 괜찮지?’라는 작은 자막이 붙습니다.`
          : `${a}님은 ${root.need}을, ${b}님은 ${reverse.need}을 앞에 놓고 있습니다. 둘 다 좋은 쪽으로 가자는 마음인데 오늘 무엇부터 할지에서는 잠깐 각자의 안내 방송이 나옵니다.`,
  ], "punchline", "reversal", [...base, ...voices]);
  chapter("ending", "결국 둘 사이에 남을 모습");
  add("ending", "whole-pair", `${a}님과 ${b}님이 함께일 때`, [
    `${a}님과 ${b}님은 ${equal ? "서로의 의욕을 깨우며 나란히 커지는" : pressure ? "서로의 선택에 무게를 더하고 단단해지게 하는" : "서로에게 없던 반응을 열어주는"} 관계입니다. ${root.need}과 ${reverse.need}이 한 관계 안에서 만나니 언제나 같은 답을 원하지는 않습니다.`,
    harmony ? "함께 맞춰본 경험은 둘 사이에 든든한 접점으로 남습니다. 다른 취향 하나를 없애지 않고 같이 즐기는 방법을 찾았던 날이 다시 시도해 볼 마음을 만들어줍니다." : `이 관계의 든든함은 ${reverse.gift}에도 있습니다. 한 사람이 건넨 힘이 다른 모양으로 돌아오니, 똑같이 주고받아야만 서로에게 좋은 사이가 되는 것은 아닙니다.`,
    contrast ? `${a}님이 마음을 전달하는 말투와 ${b}님이 편하게 받는 말투 사이에는 차이가 있습니다. 뜻이 통하지 않은 날을 곧바로 애정이나 신뢰가 없는 날로 바꾸지만 않아도 둘이 가진 좋은 힘을 덜 소모합니다.` : `${a}님과 ${b}님은 익숙해질수록 설명하지 않은 생각까지 같을 거라 믿기 쉽습니다. 서로를 오래 봤다는 사실과 오늘의 마음을 이미 안다는 생각은 조금 다릅니다.`,
    CATEGORY_ENDINGS[category],
    root.ending,
  ], "prose", "direction", [...base, ...voices, ...(relationFact(harmony) ? [relationFact(harmony)!] : [])]);
  return finish();
}
