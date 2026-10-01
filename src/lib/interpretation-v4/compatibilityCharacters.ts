import { proof } from "./copyRealizer";
import type { PairEvidence } from "./compatibilityEvidence";
import type { PairPerson, PairStyle } from "./compatibilityNarrativeTypes";

/** Authored relationship manifestations of existing Fusion rules. No type-letter
 * guessing: absent rules keep the natal-only portrait, including unknown MBTI. */
const voices: readonly { style: PairStyle; rules: readonly string[]; core: string; strength: string; shadow: string; relationship: string }[] = [
  { style: "inquiry", rules: ["intp-inquiry", "intj-inquiry", "infj-depth"], core: "말하기 전에 이유를 끝까지 알아보는 사람", strength: "남들이 넘긴 의문도 붙들어 답을 찾는 힘", shadow: "혼자 생각이 너무 길어지는 버릇", relationship: "대답을 재촉받지 않고 생각을 마칠 여유" },
  { style: "care", rules: ["esfj-help", "isfj-love", "enfj-help"], core: "가까운 사람의 작은 필요를 기억하는 사람", strength: "도움이 필요한 순간을 알아채는 다정함", shadow: "챙긴 만큼 알아주기를 바라면서도 말을 아끼는 버릇", relationship: "내가 들인 마음을 알아주는 반응" },
  { style: "decisive", rules: ["entj-needle", "entj-pressure", "estj-status", "estj-needle"], core: "문제가 보이면 해결부터 시작하는 사람", strength: "난처한 순간에도 결정을 피하지 않는 힘", shadow: "상대의 말이 끝나기 전에 결론부터 내는 버릇", relationship: "애매하게 돌려 말하지 않는 대화" },
  { style: "steady", rules: ["istj-love", "istj-needle", "istj-marriage"], core: "한 번 한 약속을 행동으로 지키는 사람", strength: "작은 일도 흐지부지 넘기지 않는 성실함", shadow: "내가 지킨 기준을 상대도 당연히 알 것이라 여기는 고집", relationship: "말과 행동이 며칠 뒤에도 같은 믿음" },
  { style: "explore", rules: ["enfp-connection", "entp-needle"], core: "한 이야기에서 다음 재미를 찾아내는 사람", strength: "막힌 대화에 새로운 길을 여는 재주", shadow: "흥미로운 제안이 생기면 먼저 약속부터 늘리는 버릇", relationship: "이상한 생각도 웃어넘기지 않는 호기심" },
  { style: "social-rest", rules: ["enfp-alone", "esfj-alone", "entj-alone"], core: "사람들 사이에서 밝아도 혼자 돌아갈 방이 필요한 사람", strength: "함께 즐긴 일도 혼자 다시 곱씹는 깊이", shadow: "방금까지 즐겁다가 갑자기 말수가 줄어드는 모습", relationship: "반가운 만남과 조용한 회복을 모두 허용하는 사이" },
  { style: "express", rules: ["enfp-expression", "enfj-expression", "intp-expression", "esfp-expression", "esfp-charm"], core: "혼자 정리할 때보다 사람과 나누며 말이 살아나는 사람", strength: "반응을 주고받으며 자기 마음을 꺼내는 통로", shadow: "상대의 반응이 없으면 말문도 함께 닫히는 모습", relationship: "아직 정리되지 않은 말도 나눌 수 있는 사이" },
  { style: "sensitive", rules: ["isfp-needle", "isfp-love", "infp-needle"], core: "큰 말보다 표정의 작은 차이를 알아보는 사람", strength: "말로 다 하지 않은 취향까지 살피는 감각", shadow: "괜찮다고 말하고 속으로 오래 기억하는 버릇", relationship: "거친 말 없이 내 취향을 존중받는 편안함" },
  { style: "independent", rules: ["istp-love", "intp-space", "istp-marriage"], core: "가까워도 자기 시간을 지켜야 편한 사람", strength: "상대의 선택을 대신하려 하지 않는 담백함", shadow: "설명을 생략하고 혼자 결정을 끝내는 버릇", relationship: "붙어 있지 않은 시간까지 믿어주는 여유" },
  { style: "practical", rules: ["estp-needle", "istp-study"], core: "직접 보고 움직이면서 답을 찾는 사람", strength: "어색한 분위기를 실제 행동으로 바꾸는 힘", shadow: "먼저 움직인 뒤 상대의 마음을 확인하는 버릇", relationship: "같이 해보면서 서로를 알아가는 즐거움" },
];
export function compatibilityCharacter(person: PairEvidence["persons"]["personA"]): PairPerson | null {
  const pillar = person.materials.selected.find(m => m.material.category === "dayPillar");
  if (!pillar) return null;
  for (const voice of voices) {
    const fusion = voice.rules.flatMap(rule => person.materials.fusions.filter(f => f.ruleId === rule))[0];
    if (!fusion) continue;
    return { personId: person.personId, name: person.name, mbti: person.mbti, style: voice.style,
      core: voice.core, strength: voice.strength, shadow: voice.shadow, relationship: voice.relationship,
      fusion, proof: proof([], [], [fusion], [`person:${person.personId}`, `v4:compatibility-character:${voice.style}`]), materials: person.materials };
  }
  const seed = (role: string) => pillar.material.seeds.find(s => s.role === role)!;
  return { personId: person.personId, name: person.name, mbti: person.mbti, style: "natal", core: seed("character").text,
    strength: seed("strength").text, shadow: seed("shadow").text, relationship: seed("relationships")?.text ?? seed("love").text,
    fusion: null, proof: proof([pillar], [seed("character"), seed("strength"), seed("shadow")], [], [`person:${person.personId}`]), materials: person.materials };
}
