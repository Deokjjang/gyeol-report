import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { majorNarrativeEvidence } from "./majorEvidence";
import { majorContext } from "./majorContext";
import { majorYearNarrative } from "./majorYearNarrative";
import { majorBehavior } from "./majorBehavior";
import { MAJOR_MEANINGS, MAJOR_ELEMENT_IMAGES } from "./majorMaterials";
import { paragraph, proof, particle } from "./copyRealizer";
import { reviewNarrative } from "./editorialGuard";
import type { NarrativeBlock, NarrativeSection } from "./narrativeTypes";

/** Offline only. Explicit instant is required; no clock, storage, UI or writer. */
export async function composeMajorFortuneNarrative(payload: unknown, evaluatedAt: string) {
  const e = await majorNarrativeEvidence(payload, evaluatedAt);
  if (!e.ok) return e;
  // A range crossing 'now' must never turn its after-cycle into a current fact.
  if (!e.horizon.activeCycle) return { ok: false as const, errors: ["CURRENT_DAYUN_BOUNDARY_UNCERTAIN"] };
  const pillar = e.materials.selected.find(m => m.material.category === "dayPillar");
  if (!pillar) return { ok: false as const, errors: ["UNVERIFIED_MAJOR_NATAL_MATERIAL"] };
  const c = majorContext(e.input), active = e.horizon.activeCycle;
  const now = e.horizon.activeCycle, m = MAJOR_MEANINGS[now.tenGod];
  const future = e.horizon.transitions.find(t => t.after.index > active.index);
  const last = e.years.at(-1)!, destination = MAJOR_MEANINGS[last.cycle.tenGod];
  const source = proof([], [], [], [...e.sourceRefs, ...c.provenance, `dayun-cycle:${now.index}:${now.ganji}`]);
  const b = (id: string, text: string, tone: NarrativeBlock["tone"] = "positive") => paragraph(id, text, source, tone);
  const section = (id: string, title: string, blocks: readonly NarrativeBlock[], domain: NarrativeSection["domain"] = "success/fortune"): NarrativeSection => ({ id, title, domain, blocks });
  const headline = `${e.input.name}님, ${c.noun} — ${destination.theme}까지 이어갈 힘`;
  const strength = pillar.material.seeds.find(s => s.role === "strength")!;
  const opening = [
    b("big-flow", `${e.input.name}님이 지금 지나고 있는 ${now.ganji}의 큰 흐름은 ${m.theme}입니다. ${particle(m.money, "을", "를")} ${particle(c.noun, "과", "와")} 함께 보게 되는 시간이에요.`),
    b("first-gift", `${particle(c.noun, "을", "를")} 생각하면 ${particle(m.gift, "이", "가")} 특히 반가운 패입니다. ${particle(c.scenes[now.tenGod][0], "에서", "에서")} 잘한 만큼 남는 것이 무엇인지 보고 싶어질 거예요. ${particle(c.craft, "이", "가")} 혼자만 아는 실력으로 끝나지 않을 길도 열어볼 만합니다.`),
    b("next-boundary", future ? `${future.dateLabel}, ${future.before.ganji}에서 ${future.after.ganji}로 큰 장이 넘어갑니다. ${particle(c.noun, "을", "를")} 보는 눈도 ${withKoreanParticle(MAJOR_MEANINGS[future.after.tenGod].theme, "to")} 넓어질 겁니다. 지금부터 ${particle(c.craft, "을", "를")} 어디에 가져갈지 생각하면 이 변화도 막연한 기다림은 아니게 됩니다.` : `${e.horizon.through}년까지는 ${particle(c.noun, "을", "를")} ${particle(destination.theme, "과", "와")} 함께 다뤄갈 구간입니다. 큰 장이 같아도 해마다 힘을 줄 곳은 달라집니다.`),
    paragraph("natal-strength", `${strength.text} ${particle(c.craft, "을", "를")} ${particle(m.work, "과", "와")} 연결해볼 때 이 장점도 살아납니다.`, proof([pillar], [strength])),
  ];
  const sections: NarrativeSection[] = [], behavior = majorBehavior(e, c, now.tenGod, "now");
  if (behavior) opening.push(behavior.block);
  sections.push(section("current-context", e.input.context.jobStatus === "unemployed" ? "쉬는 지금도 다음에 가져갈 실력은 남아 있습니다" : `${c.raw || "지금의 경험"}에서 출발하되, 그 자리에만 묶이지는 않습니다`, [
    b("current-setting", `${particle(c.scenes[now.tenGod][1], "을", "를")} 떠올려보면 지금 흐름이 쉬워집니다. ${particle(m.work, "이", "가")} 중요해지는 때라 ${particle(c.craft, "을", "를")} 어디에 쓸지도 더 신중히 고르게 돼요. 여기서 얻은 경험은 ${particle(c.noun, "을", "를")} 다른 자리에서 다루게 되더라도 가져갈 수 있습니다.`),
    b("money-flow", `${particle(m.money, "을", "를")} 따져보면 ${particle(c.noun, "의", "의")} 실속도 보입니다. 바쁘게 지냈는데 생활은 그대로라면 ${particle(c.craft, "의", "의")} 값을 다시 보고 싶어질 거예요. ${particle(c.noun, "을", "를")} 새롭게 다룰 때도 ${particle(destination.money, "이", "가")} 다음 선택의 바탕이 됩니다.`),
  ], "work"));
  const gifts: Record<string, string> = { gwiin_cheoneul: "막힐 때 좋은 도움과 연결될 사람복", gwiin_jaego: "돈만 아니라 기술과 고객까지 쌓아둘 축적복", twelve_sinsal_jangseong: "앞에 서서 중심을 잡는 리더십", twelve_sinsal_banan: "자리와 인정을 붙잡는 힘", gwiin_munchang: "배운 것을 쉬운 말로 펼칠 표현력", gwiin_hakdang: "하나를 제대로 익혀 남길 학습의 힘", twelve_sinsal_yeokma: "움직이며 낯선 기회를 발견하는 감각", sinsal_hongyeom: "가까워질수록 살아나는 친밀한 매력", sinsal_dohwa: "첫인상에서 사람의 눈에 들어오는 매력", gwiin_geumyeo: "사람과 생활에서 좋은 것을 알아보는 안목", gwiin_amrok: "겉으로 드러나지 않아도 실속을 챙기는 힘" };
  const natalGift = e.materials.selected.filter(v => gifts[v.feature]).slice(0, 2);
  const giftScene: Record<string, string> = {
    gwiin_cheoneul: `${particle(c.noun, "에서", "에서")} 막힌 이야기를 편하게 꺼낼 사람이 있다는 것은 큰 자산입니다. ${particle(c.craft, "을", "를")} 알아보고 좋은 기회를 소개해줄 인연도 소중히 여길 만해요.`,
    gwiin_jaego: `${particle(c.craft, "은", "는")} 쓰고 사라지는 힘만이 아니라 다음에도 꺼낼 재산입니다. ${particle(c.noun, "을", "를")} 다뤄본 기록과 경험이 쌓일수록 처음부터 다시 시작할 일은 줄어듭니다.`,
    twelve_sinsal_jangseong: `${particle(c.noun, "을", "를")} 두고 사람들이 망설일 때 앞에서 방향을 고를 힘이 있습니다. ${particle(c.craft, "을", "를")} 믿고 판단까지 맡기는 사람이 생긴다면 존재감도 더 분명해질 수 있어요.`,
    twelve_sinsal_banan: `${particle(c.craft, "을", "를")} 알아보는 자리에서 역할이 더 커질 좋은 바탕입니다. ${particle(c.noun, "을", "를")} 오래 다룬 시간이 인정으로 돌아오는 장면을 기대해볼 만해요.`,
    gwiin_hakdang: `${particle(c.craft, "의", "의")} 바탕을 한 번 제대로 익히면 다음 문제에도 가져갈 수 있습니다. ${particle(c.noun, "을", "를")} 두고 남이 지나친 질문까지 붙드는 배움이 오래 남을 좋은 패예요.`,
    gwiin_munchang: `${particle(c.noun, "을", "를")} 내 말로 쉽게 풀어줄 때 배운 깊이도 보입니다. ${particle(c.craft, "을", "를")} 다른 사람이 써볼 설명으로 남기는 즐거움을 기대해볼 만해요.`,
    twelve_sinsal_yeokma: `${particle(c.noun, "을", "를")} 익숙한 곳 밖에서도 바라볼 만합니다. 낯선 사람과 장소가 ${particle(c.craft, "의", "의")} 새로운 쓰임을 알아보는 계기가 될 수 있어요.`,
    sinsal_hongyeom: `${particle(c.noun, "을", "를")} 나누는 자리에서도 여러 번 만날수록 내 분위기가 더 전해집니다. ${particle(c.craft, "을", "를")} 편하게 풀어놓는 모습에 친밀한 매력도 살아날 만해요.`,
    sinsal_dohwa: `${particle(c.noun, "을", "를")} 처음 소개하는 자리에서 눈길을 끌 좋은 힘입니다. ${particle(c.craft, "이", "가")} 드러나는 표정과 말투도 사람에게 기억될 만한 매력입니다.`,
    gwiin_geumyeo: `${particle(c.noun, "을", "를")} 고를 때 값싼 것과 오래 좋은 것을 구분하는 안목이 힘이 됩니다. ${particle(c.craft, "을", "를")} 알아주는 사람과 편한 생활을 함께 그려볼 좋은 바탕이에요.`,
    gwiin_amrok: `${particle(c.noun, "의", "의")} 겉모습보다 조용히 남는 실속을 알아볼 힘입니다. ${particle(c.craft, "을", "를")} 오래 써온 곳에서 이미 내 편인 도움도 발견할 만해요.`,
  };
  if (natalGift.length) sections.push(section("natal-gifts", "시기가 달라져도 가져갈 수 있는 원래의 좋은 패", natalGift.map((v, index) => paragraph(`natal-gift-${index}`,
    `원래 가진 ${particle(gifts[v.feature], "을", "를")} ${particle(c.noun, "에도", "에도")} 가져갈 만합니다. ${giftScene[v.feature] ?? `${particle(c.craft, "을", "를")} 혼자 쓰는 데서 사람과 나누는 쪽으로 넓혀볼 좋은 바탕이에요. ${particle(c.scenes[now.tenGod][1], "에서도", "에서도")} 이 장점을 기억하면 이미 가진 것을 알아보는 눈이 달라집니다.`}`, proof([v])))));
  const structure = e.materials.selected.find(v => v.material.category === "structure");
  if (structure) {
    const seed = structure.material.seeds.find(s => s.role === "strength");
    if (seed) sections.push(section("natal-structure", "앞으로의 역할에도 따라갈 내 강점", [paragraph("structure-strength", `${seed.text} ${particle(c.noun, "을", "를")} ${particle(destination.work, "과", "와")} 이어볼 때도 이 힘은 출발점이 됩니다.`, proof([structure], [seed]))], "strengths"));
  }
  const relation = e.input.context.relationshipStatus;
  const relationshipScene = relation === "married" ? "배우자와 생활비와 쉬는 시간을 나누는 대화" : relation === "dating" ? "바쁜 주에도 둘이 만날 시간을 고르는 약속" : relation === "some" ? "한 번 더 만나고 싶은 사람에게 먼저 꺼내는 제안" : relation === "marriage_preparing" ? "집과 예산을 준비하며 각자의 우선순위를 맞추는 대화" : relation === "single" ? "새로운 모임에서 내 이야기를 편하게 꺼내는 만남" : "가까운 사람과 서로 어떤 시간을 원하는지 묻는 대화";
  sections.push(section("relationships", "일이 달라지면 가까운 사람 앞의 표정도 달라집니다", [
    b("relationship-context", `지금 ${particle(relationshipScene, "을", "를")} 떠올려볼 수 있습니다. ${particle(m.home, "을", "를")} 지키는 마음은 ${particle(c.noun, "을", "를")} 대하는 태도와도 이어집니다. ${particle(relationshipScene, "에서도", "에서도")} 각자의 다음 생활을 궁금해하는 마음은 오래 남길 만합니다.`),
    b("element-life", `${now.ganji}의 ${now.elements.join("·")} 기운은 ${MAJOR_ELEMENT_IMAGES[now.elements[0]]}에 ${particle(c.noun, "을", "를")} 놓는 그림입니다. ${now.elements[1] && now.elements[1] !== now.elements[0] ? MAJOR_ELEMENT_IMAGES[now.elements[1]] : MAJOR_ELEMENT_IMAGES[now.elements[0]]}에도 ${particle(c.craft, "이", "가")} 어울립니다. ${particle(m.life, "을", "를")} 남기면 ${particle(c.noun, "을", "를")} 잠시 내려놓는 하루도 이 흐름과 어울립니다.`, "observation"),
  ], "relationships"));
  const nextBehavior = future ? majorBehavior(e, c, future.after.tenGod, "next") : null;
  const transitions = e.horizon.transitions.map(t => {
    const a = MAJOR_MEANINGS[t.before.tenGod], z = MAJOR_MEANINGS[t.after.tenGod], past = t.year < e.currentYear;
    const b = (id: string, text: string) => paragraph(id, text, proof([], [], [], [...e.sourceRefs, ...c.provenance,
      `dayun-cycle:${t.before.index}:${t.before.ganji}`, `dayun-cycle:${t.after.index}:${t.after.ganji}`, `transition:${t.startSolarKst ?? t.dateLabel}`]), "positive");
    const blocks = [
      b(`transition-${t.year}-focus`, `${t.dateLabel}${past ? "을 지나며" : "을 경계로"} ${t.before.ganji}의 ${particle(a.theme, "에서", "에서")} ${t.after.ganji}의 ${withKoreanParticle(z.theme, "to")} 무게가 ${past ? "옮겨온 흐름입니다" : "옮겨갑니다"}. ${particle(c.noun, "에서도", "에서도")} ${particle(z.work, "이", "가")} 더 눈에 들어오는 경계예요.`),
      b(`transition-${t.year}-work`, `일에서는 ${particle(c.scenes[t.before.tenGod][0], "에서", "에서")} 익힌 감각을 가져갑니다. 그 힘을 ${particle(z.work, "에", "에")} 쓰게 되면 ${particle(c.noun, "의", "의")} 범위도 달라질 겁니다. ${particle(a.money, "을", "를")} 보던 때에서 ${particle(c.craft, "의", "의")} 값을 ${particle(z.money, "에도", "에도")} 비춰보는 변화${past ? "였는지 돌아볼 수 있어요" : "가 기대됩니다"}.`),
      b(`transition-${t.year}-people`, `${particle(a.people, "과", "와")} 나누던 경험을 ${particle(z.people, "과", "와")} ${particle(c.noun, "에", "에")} 새롭게 써볼 때입니다. ${particle(z.home, "을", "를")} 바라며 ${particle(relationshipScene, "을", "를")} 꺼내볼 수 있습니다. ${particle(z.people, "을", "를")} 알아보는 눈이 ${particle(c.noun, "을", "를")} 혼자 감당하지 않게 할 여지도 있어요.`),
      b(`transition-${t.year}-life`, `${particle(c.noun, "을", "를")} 보는 눈에는 ${particle(a.life, "의", "의")} 흔적도 남습니다. ${particle(c.craft, "과", "와")} ${particle(z.life, "은", "는")} ${particle(c.noun, "을", "를")} 키우며 함께 지킬 몫입니다. ${particle(c.scenes[t.after.tenGod][1], "은", "는")} ${particle(z.gift, "을", "를")} 써볼 한 장면입니다.`),
      ...(future?.year === t.year && nextBehavior ? [nextBehavior.block] : []),
    ];
    return { ...t, blocks };
  });
  for (const t of transitions) sections.push(section(`transition-${t.year}`, `${t.year}년, ${t.before.ganji}에서 ${t.after.ganji}로 달라지는 것`, t.blocks));
  const years = e.years.map(y => majorYearNarrative(e, y, c));
  for (const y of years) {
    const transition = e.horizon.transitions.find(t => t.year === y.year);
    sections.push(section(`year-${y.year}`, `${y.year}년 · ${y.age}세 · 세운 ${y.annual.ganji} · 대운 ${transition ? `${transition.before.ganji} → ${transition.after.ganji}` : y.cycle.ganji} · ${y.timePosition === "past" ? "돌아보기" : y.timePosition === "current" ? "지금" : "앞으로"}\n${y.title}`, y.blocks));
  }
  sections.push(section("final", `${e.horizon.through}년의 나에게 남겨줄 것`, [
    b("final-strength", `${e.input.name}님이 이 시간을 지나며 가져갈 것은 ${particle(c.noun, "을", "를")} 더 넓게 다루는 경험입니다. ${particle(destination.work, "을", "를")} 만날 때도 ${particle(c.craft, "은", "는")} 가져갈 재산입니다.`),
    b("final-gift", `마지막 해의 큰 배경에서는 ${particle(c.noun, "에", "에")} ${particle(destination.gift, "을", "를")} 써볼 만합니다. ${particle(c.craft, "이", "가")} 가진 값은 ${particle(destination.money, "을", "를")} 볼 때도 작아지지 않습니다.`),
    b("final-people", `다만 ${particle(destination.cost, "은", "는")} ${particle(c.noun, "을", "를")} 키울수록 알아둘 그림자입니다. ${particle(c.noun, "을", "를")} 함께 다룰 ${particle(destination.people, "을", "를")} 알아보는 눈도 내 편입니다.`, "observation"),
    b("final-direction", `${future ? `${future.year}년의 전환` : "앞으로의 시간"}은 ${particle(c.craft, "을", "를")} 다른 크기로 쓰는 입구로 봐도 좋습니다. ${particle(c.noun, "이", "가")} 커지는 동안 ${particle(destination.home, "도", "도")} 함께 남기면 좋겠습니다.`),
  ]));
  const narrative = { version: "v4-major-fortune-narrative-1" as const, headline, opening, sections,
    finalLine: `${particle(c.craft, "은", "는")} 사라지지 않습니다 — ${particle(c.noun, "에서", "에서")} 키운 힘으로 ${particle(destination.work, "을", "를")} 만날 차례입니다.`, finalProof: source };
  return { ok: true as const, narrative, evidence: e, years, transitions, materials: e.materials,
    behaviorBasis: [behavior?.source, nextBehavior?.source].filter(v => v !== undefined),
    completeness: { years: years.length, futureYears: years.filter(y => y.timePosition === "future").length, ages: years.every(y => Number.isInteger(y.age)), transitions: transitions.length, final: true },
    editorial: reviewNarrative(narrative) };
}
