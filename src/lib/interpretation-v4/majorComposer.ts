import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { majorNarrativeEvidence } from "./majorEvidence";
import { majorContext } from "./majorContext";
import { majorYearNarrative } from "./majorYearNarrative";
import { majorBehavior } from "./majorBehavior";
import { MAJOR_MEANINGS, MAJOR_ELEMENT_IMAGES, MAJOR_VOICE } from "./majorMaterials";
import { paragraph, proof, particle } from "./copyRealizer";
import { reviewNarrative } from "./editorialGuard";
import { composeEvidenceChapters } from "./contentSynthesis";
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
  const source = proof([], [], [], [...e.sourceRefs, ...c.provenance, `dayun-cycle:${now.index}:${now.ganji}`, `period-ten-god:${now.tenGod}`]);
  const b = (id: string, text: string, tone: NarrativeBlock["tone"] = "positive") => paragraph(id, text,
    id.startsWith("final-") ? proof([], [], [], [...source.sourceRefs, `period-ten-god:${last.cycle.tenGod}`, `dayun-cycle:${last.cycle.index}:${last.cycle.ganji}`]) :
    id === "element-life" ? proof([], [], [], [...source.sourceRefs, ...now.elements.map(element => `period-element:${element}`)]) : source, tone);
  const section = (id: string, title: string, blocks: readonly NarrativeBlock[], domain: NarrativeSection["domain"] = "success/fortune"): NarrativeSection => ({ id, title, domain, blocks });
  const headline = `${e.input.name}님, ${c.noun} — ${destination.theme}까지 이어갈 힘`;
  const strength = pillar.material.seeds.find(s => s.role === "strength")!;
  const natalScene = pillar.material.seeds.find(s => s.role === "scene");
  const opening = [
    b("big-flow", `${e.input.name}님이 지금 지나고 있는 ${now.ganji} 대운의 중심은 ‘${m.theme}’입니다. 예전과 같은 일을 해도 ‘${m.next}’ 쪽에 더 마음이 가는 변화예요. 지금은 특히 ${particle(m.money, "을", "를")} 가까이서 보게 되는 시기죠.`),
    b("first-gift", `이 흐름의 좋은 패는 ${m.gift}입니다. ‘${c.scenes[now.tenGod][0]}’ 같은 순간을 떠올려볼까요? ${MAJOR_VOICE[now.tenGod].opening}`),
    b("next-boundary", future ? `${future.dateLabel}, ${future.before.ganji}에서 ${future.after.ganji}로 큰 장이 넘어갑니다. 지금의 ‘${m.theme}’에서 ‘${MAJOR_MEANINGS[future.after.tenGod].theme}’ 쪽으로 관심의 중심도 옮겨갈 전망이에요. 다음 장에도 ${particle(c.craft, "을", "를")} 함께 가져갑니다.` : `${e.horizon.through}년까지 이어지는 큰 배경은 ‘${destination.theme}’입니다. 큰 장이 같아도 ${particle(m.work, "을", "를")} 다루는 장면은 해마다 달라집니다. 뒤의 연도별 이야기에서는 ${particle(c.noun, "에", "에")} 힘을 더할 시기와 다른 경험을 보탤 시기를 나눠 읽을 수 있습니다.`),
    paragraph("natal-strength", `${strength.text} ${natalScene?.text ?? ""}`, proof([pillar], [strength, ...(natalScene ? [natalScene] : [])])),
  ];
  const sections: NarrativeSection[] = [], behavior = majorBehavior(e, c, now.tenGod, "now");
  if (behavior) opening.push(behavior.block);
  sections.push(section("current-context", e.input.context.jobStatus === "unemployed" ? "쉬는 지금도 다음에 가져갈 실력은 남아 있습니다" : `${c.raw || "지금의 경험"}에서 출발하되, 그 자리에만 묶이지는 않습니다`, [
    b("current-setting", `지금의 경험에서 이 흐름이 보이는 장면은 ‘${c.scenes[now.tenGod][1]}’입니다. ${particle(m.work, "이", "가")} 왜 요즘 더 신경 쓰이는지 생각해보면, 단순히 일이 많아서만은 아닐 거예요. ${particle(c.craft, "을", "를")} 어디에 쓰느냐에 따라 똑같이 바쁜 하루도 만족감이 달라집니다.`),
    b("money-flow", `돈에서는 ${particle(m.money, "을", "를")} 먼저 봅니다. ${particle(m.cost, "이", "가")} 커지면 잘하고도 생활은 제자리처럼 느껴질 수 있어요. ${MAJOR_VOICE[now.tenGod].money}`),
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
    `지금 ${particle(c.noun, "을", "를")} 다루는 힘 옆에는 ${gifts[v.feature]}도 있습니다. ${giftScene[v.feature] ?? `${particle(c.craft, "을", "를")} 혼자 쓰는 데서 사람과 나누는 쪽으로 넓혀볼 좋은 바탕이에요. ${particle(c.scenes[now.tenGod][1], "에서도", "에서도")} 이 장점을 기억하면 이미 가진 것을 알아보는 눈이 달라집니다.`}`, proof([v])))));
  const structure = e.materials.selected.find(v => v.material.category === "structure");
  if (structure) {
    const seed = structure.material.seeds.find(s => s.role === "strength");
    if (seed) sections.push(section("natal-structure", "앞으로의 역할에도 따라갈 내 강점", [paragraph("structure-strength", `${seed.text} ${particle(c.noun, "을", "를")} ${particle(destination.work, "과", "와")} 이어볼 때도 이 힘은 출발점이 됩니다.`, proof([structure], [seed]))], "strengths"));
  }
  const relation = e.input.context.relationshipStatus;
  const relationshipScene = relation === "married" ? "배우자와 생활비와 쉬는 시간을 나누는 대화" : relation === "dating" ? "바쁜 주에도 둘이 만날 시간을 고르는 약속" : relation === "some" ? "한 번 더 만나고 싶은 사람에게 먼저 꺼내는 제안" : relation === "marriage_preparing" ? "집과 예산을 준비하며 각자의 우선순위를 맞추는 대화" : relation === "single" ? "새로운 모임에서 내 이야기를 편하게 꺼내는 만남" : "가까운 사람과 서로 어떤 시간을 원하는지 묻는 대화";
  sections.push(section("relationships", "일이 달라지면 가까운 사람 앞의 표정도 달라집니다", [
    b("relationship-context", `가까운 관계에서는 ${particle(m.home, "이", "가")} 중요해집니다. ${particle(relationshipScene, "을", "를")} 떠올려보세요. ${MAJOR_VOICE[now.tenGod].relationship}`),
    b("element-life", `${now.ganji}의 ${now.elements.join("·")} 기운은 ${MAJOR_ELEMENT_IMAGES[now.elements[0]]}과 닮았습니다. ${now.elements[1] && now.elements[1] !== now.elements[0] ? `여기에 ${particle(now.elements[1], "은", "는")} ${MAJOR_ELEMENT_IMAGES[now.elements[1]]}을 더해요.` : `같은 ${now.elements[0]}의 성질이 거듭 들어오니 한 가지 속도에 오래 머물지 않는지도 살펴볼 만해요.`} 하루를 꽉 채우는 것만큼 ‘${m.life}’도 남겨둘 수 있습니다. ${particle(c.noun, "을", "를")} 잠시 내려놓는 날에도 이 생활의 리듬은 남길 수 있어요.`, "observation"),
  ], "relationships"));
  const nextBehavior = future ? majorBehavior(e, c, future.after.tenGod, "next") : null;
  const transitions = e.horizon.transitions.map(t => {
    const a = MAJOR_MEANINGS[t.before.tenGod], z = MAJOR_MEANINGS[t.after.tenGod], past = t.year < e.currentYear;
    const b = (id: string, text: string) => paragraph(id, text, proof([], [], [], [...e.sourceRefs, ...c.provenance,
      `dayun-cycle:${t.before.index}:${t.before.ganji}`, `dayun-cycle:${t.after.index}:${t.after.ganji}`, `transition:${t.startSolarKst ?? t.dateLabel}`, `period-ten-god:${t.before.tenGod}`, `period-ten-god:${t.after.tenGod}`]), "positive");
    const blocks = [
      b(`transition-${t.year}-focus`, `${t.dateLabel}${past ? "을 지나며" : "을 경계로"} ${t.before.ganji}의 ${particle(a.theme, "에서", "에서")} ${t.after.ganji}의 ${withKoreanParticle(z.theme, "to")} 무게가 ${past ? "옮겨온 흐름입니다" : "옮겨갑니다"}. ${particle(c.noun, "에서도", "에서도")} ${particle(z.work, "이", "가")} 더 눈에 들어오는 경계예요.`),
      b(`transition-${t.year}-work`, `일의 질문도 ‘${a.work}’에서 ‘${z.work}’로 달라집니다. ‘${c.scenes[t.before.tenGod][0]}’에서 얻은 경험이 출발점이에요. 돈 역시 ${particle(a.money, "을", "를")} 보는 데서 ${particle(z.money, "을", "를")} 더 중요하게 보는 변화${past ? "였는지 돌아볼 만합니다" : "를 기대할 만합니다"}. 다음 질문은 ‘${z.next}’입니다.`),
      b(`transition-${t.year}-people`, `전에는 ${particle(a.people, "과", "와")} 나누는 이야기가 중심이었다면, 새 장에서는 ${particle(z.people, "이", "가")} 더 반갑게 느껴질 수 있어요. 가까운 사이에서는 ‘${z.home}’이 새 균형점입니다. ${past ? `그때 ${particle(z.people, "에게", "에게")} 받은 자극이 지금도 남았는지 돌아볼 만해요.` : `앞으로 ${particle(z.people, "에게", "에게")} 어떤 이야기를 묻고 싶은지 생각하면 새로운 관계의 입구도 보일 겁니다.`}`),
      b(`transition-${t.year}-life`, `생활에서는 ‘${a.life}’에서 누리던 편안함을 모두 버릴 필요가 없습니다. 그 옆에는 ‘${z.life}’도 들어갈 자리를 만드는 쪽에 가까워요. ${particle(c.scenes[t.after.tenGod][1], "을", "를")} 떠올리면 무엇을 새로 해볼지 한결 구체적이죠. ${particle(z.gift, "은", "는")} 그 변화 속에서 써볼 좋은 패입니다.`),
      ...(future?.year === t.year && nextBehavior ? [nextBehavior.block] : []),
    ];
    return { ...t, blocks };
  });
  for (const t of transitions) sections.push(section(`transition-${t.year}`, `${t.year}년, ${t.before.ganji}에서 ${t.after.ganji}로 달라지는 것`, t.blocks));
  const periodRoots = new Set<string>();
  const years = e.years.map(y => majorYearNarrative(e, y, c, periodRoots));
  for (const y of years) {
    const transition = e.horizon.transitions.find(t => t.year === y.year);
    sections.push(section(`year-${y.year}`, `${y.year}년 · ${y.age}세 · 세운 ${y.annual.ganji} · 대운 ${transition ? `${transition.before.ganji} → ${transition.after.ganji}` : y.cycle.ganji} · ${y.timePosition === "past" ? "돌아보기" : y.timePosition === "current" ? "지금" : "앞으로"}\n${y.title}`, y.blocks));
  }
  sections.push(section("final", `${e.horizon.through}년의 나에게 남겨줄 것`, [
    b("final-strength", `${e.input.name}님에게 이미 있는 것은 ${c.craft}입니다. ${future ? `${future.year}년의 전환을 거치며` : "앞으로의 여러 해를 지나며"} ‘${destination.work}’까지 다뤄볼 수 있는 사람으로 넓어지는 쪽을 바라볼 만합니다.`),
    b("final-gift", `마지막 해가 놓인 장의 좋은 힘은 ${destination.gift}입니다. ${MAJOR_VOICE[last.cycle.tenGod].confidence}`),
    b("final-people", `놓치지 말 것은 ${destination.cost}입니다. ${particle(destination.people, "과", "와")} 함께 ${particle(destination.work, "을", "를")} 나누는 편이 혼자 버티는 것보다 든든해요.`, "observation"),
    b("final-direction", `돈에서는 ‘${destination.money}’, 관계에서는 ‘${destination.home}’을 남겨보고 싶습니다. ${MAJOR_VOICE[last.cycle.tenGod].closing}`),
  ]));
  const narrative = { version: "v4-major-fortune-narrative-1" as const, headline, opening, sections,
    finalLine: `${particle(c.craft, "은", "는")} 사라지지 않습니다 — ${particle(c.noun, "에서", "에서")} 키운 힘으로 ${particle(destination.work, "을", "를")} 만날 차례입니다.`, finalProof: source };
  const composed = composeEvidenceChapters(e.input, e.materials, narrative, "major");
  const publishedYears = years.map(y => ({ ...y, blocks: composed.narrative.sections.find(s => s.id === `year-${y.year}`)!.blocks }));
  const publishedTransitions = transitions.map(t => ({ ...t, blocks: composed.narrative.sections.find(s => s.id === `transition-${t.year}`)!.blocks }));
  return { ok: true as const, ...composed, evidence: e, years: publishedYears, transitions: publishedTransitions, materials: e.materials,
    behaviorBasis: [behavior?.source, nextBehavior?.source].filter(v => v !== undefined),
    completeness: { years: years.length, futureYears: years.filter(y => y.timePosition === "future").length, ages: years.every(y => Number.isInteger(y.age)), transitions: transitions.length, final: true },
    editorial: reviewNarrative(composed.narrative) };
}
