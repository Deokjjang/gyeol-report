import { getMbtiSourceProfile, type MbtiTraitArea } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import { validateStoryCopy } from "./comprehensiveStorytelling";
import type { NarrativeAudit } from "./mbtiNarrative";

// Routes the existing usage-note library, including identity traits previously
// omitted by the fortune area's shortlist. Tags select prose, never natal facts.
const routing: Record<TenGod, { areas: readonly MbtiTraitArea[]; affinity: RegExp; arrival: string; use: string }> = {
  비견: { areas: ["identity", "thinkingStyle", "growth"], affinity: /독립|자기|자율|선택|확신/, arrival: "내 선택에 내 이름을 붙이고 싶어지는 흐름", use: "다른 사람과 똑같이 잘하는 것보다 내가 납득한 방식으로 끝낸 결과가 더 오래 만족스럽습니다." },
  겁재: { areas: ["relationships", "workplace", "identity"], affinity: /동료|경쟁|협력|확신|팀/, arrival: "사람과 함께 판을 키우는 흐름", use: "함께 시작할 때의 열정과 끝까지 남을 몫을 동시에 보게 돼요. 잘하는 사람에게 자극받는 마음도, 내 기준을 지키고 싶은 마음도 더 선명해집니다." },
  식신: { areas: ["career", "identity", "thinkingStyle"], affinity: /표현|창작|실행|결과|성취/, arrival: "생각을 눈앞의 결과로 꺼내는 흐름", use: "내가 쉽게 해준 일을 누군가 다시 찾을 때 즐거움이 실력의 이름을 얻습니다. 한 번 잘한 사람보다 자기 방식이 있는 사람으로 기억되는 쪽이에요." },
  상관: { areas: ["identity", "workplace", "thinkingStyle"], affinity: /효율|개편|개선|비판|변화/, arrival: "익숙한 방식에 질문을 던지는 흐름", use: "‘왜 꼭 이렇게 해야 하지?’라는 질문이 더 자주 올라오죠. 불평으로 끝내기보다 직접 대안을 보여줄 때 날카로운 눈이 설득력으로 바뀝니다." },
  편재: { areas: ["money", "career", "identity"], affinity: /기회|확장|자원|연결/, arrival: "바깥 기회와 자원이 눈에 들어오는 흐름", use: "알고 있던 사람이나 기술을 다른 판에 연결할 길이 보입니다. 큰 이야기에 반응하는 속도와 실제로 회수할 수 있는 몫을 보는 눈이 같이 움직일 때 든든해요." },
  정재: { areas: ["money", "thinkingStyle", "identity"], affinity: /관리|구조|지속|자원|효율/, arrival: "돈과 생활을 반복 가능한 구조로 굳히는 흐름", use: "한 번의 성과로 끝내기보다 사람·시간·돈이 다음 달에도 돌아가는 방식을 보고 싶어집니다. 잘 벌인 일을 오래 남길 수 있게 만드는 데 성격의 강점이 쓰여요." },
  편관: { areas: ["identity", "workplace", "career"], affinity: /지휘|위기|목표|확신|권위/, arrival: "급한 판단과 책임이 커지는 흐름", use: "사람들이 머뭇거리는 순간에는 평소의 판단 습관이 더 크게 드러납니다. 어려운 문제를 다루는 힘은 좋은 패지만 모든 긴급함을 내 것으로 만들 필요는 없어요." },
  정관: { areas: ["identity", "career", "workplace"], affinity: /권위|공적|인정|책임|신뢰/, arrival: "신뢰가 자리와 역할로 이어지는 흐름", use: "직함만 커지는 것으로 끝내기보다 왜 이 판단을 맡는 사람인지 결과로 보여주는 자리가 중요해져요. 주변의 기대도 커지지만 그 기대 속에서 자기 기준이 더 또렷해집니다." },
  편인: { areas: ["thinkingStyle", "study", "identity"], affinity: /패턴|직관|탐구|전략|통찰/, arrival: "남들이 넘긴 단서에서 다른 연결을 찾는 흐름", use: "배운 내용의 양보다 따로 알던 것을 연결하는 순간이 재미있어져요. 엉뚱하다고 여긴 관심이 지금 하는 일의 막힌 부분을 풀어주기도 합니다." },
  정인: { areas: ["study", "thinkingStyle", "growth"], affinity: /이해|학습|체계|정리|성장/, arrival: "배움과 도움을 자기 기반으로 바꾸는 흐름", use: "좋은 자료를 모으는 데서 끝나지 않고 내 경험에 이름을 붙이는 힘이 됩니다. 누군가에게 설명하다가 오히려 내가 이해한 깊이를 알아차리는 순간이 남아요." },
};
const safe = (text: string) => !validateStoryCopy(text).length && !/입력값|알고리즘|엔진|무자비|찢고|독재|반드시|무조건|\b(?:Te|Ti|Fe|Fi|Ne|Ni|Se|Si)\b/.test(text);

export function fortuneTraitFusion(input: {
  mbti: string; name: string; god: TenGod; section: string; returning?: boolean;
  used: Set<string>; evidenceRefs: readonly string[];
}): { paragraph: string; audit: NarrativeAudit } | null {
  const profile = getMbtiSourceProfile(input.mbti); if (!profile) return null;
  const route = routing[input.god];
  const sectionAreas: Record<string, readonly MbtiTraitArea[]> = { opening: ["identity", "thinkingStyle"], career: ["career", "workplace"], money: ["money", "investment"], people: ["relationships", "communication"], learning: ["study", "thinkingStyle"], finale: ["growth", "strengths"] };
  const areas = sectionAreas[input.section] ?? route.areas;
  const selected = areas.flatMap((area, areaIndex) => (profile.traits?.[area] ?? []).flatMap(trait => {
    const id = `mbti:${profile.type}:traits:${area}:${trait.id}`;
    if (!trait.id || !trait.strongLine || !safe(trait.strongLine) || input.used.has(id)) return [];
    const matched = trait.matchingMyeongliSignals?.includes(input.god) ?? false;
    return [{ trait, area, id, matched, rank: (route.affinity.test(trait.label ?? "") ? 8 : 0) + (matched ? 4 : 0) + areas.length - areaIndex }];
  })).sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id))[0];
  if (!selected) return null;
  input.used.add(selected.id);
  const behavior = selected.trait.strongLine!.replaceAll(`${profile.type}에게`, `${input.name}님에게`).replaceAll(`${profile.type}는`, `${input.name}님은`).replaceAll(`${profile.type}가`, `${input.name}님이`).replaceAll(`${profile.type}의`, `${input.name}님의`);
  // The personality behavior sits inside the period's cause → manifestation,
  // not as a type slogan appended to the end of every year.
  const sectionCopy: Record<string, string> = {
    opening: `${behavior} 지금의 ${route.arrival}은 그 성격을 머릿속 계획이 아니라 실제로 남기는 경험에 쓰게 합니다. 남들이 좋다는 결과보다 내가 다시 하고 싶은 방식이 무엇인지 더 분명해지는 쪽이에요.`,
    career: `${behavior} ${route.arrival}을 일에서 만날 때도 무작정 업무량을 늘리는 것이 답은 아니에요. 남이 부탁하는 일과 내가 다음 역할로 가져가고 싶은 일이 어디서 겹치는지 더 잘 보이기 시작합니다.`,
    money: `${behavior} 돈과 시간을 나란히 놓아보면 성격이 계산표에도 드러납니다. 얻은 보상보다 맡은 일만 빨리 늘고 있지는 않은지, 새 기회를 잡고도 내 생활을 유지할 수 있는지 보는 눈이 이 흐름에서 함께 자라요.`,
    people: `${behavior} 내 역할이 바뀌면 가까운 사람에게 받고 싶은 도움도 달라집니다. 예전처럼 자주 만나지 못해도 중요한 고민을 편하게 꺼낼 수 있는 연결은 다음 장에서도 힘이 돼요.`,
    learning: `${behavior} 배우는 속도만큼 배운 것을 어디에 쓸지가 중요해집니다. 혼자 이해했다고 생각한 내용을 실제 문제에 가져가 보면, 이미 아는 것과 아직 자기 것이 아닌 것의 경계가 선명해져요.`,
    finale: `${behavior} 지금의 강점을 더 세게 쓰는 것만이 성장은 아닙니다. 앞으로 맡을 일과 지킬 생활의 크기에 맞게 힘을 고를 때, 같은 성격도 훨씬 넓은 선택을 남길 수 있어요.`,
  };
  const paragraph = sectionCopy[input.section] ?? (input.returning ? `${behavior} 같은 주제가 다시 돌아와도 이제는 처음의 나와 같지 않습니다. 알고 있는 방식 중 무엇을 다시 쓸지, 누구와 나눌지 고를 경험이 생겼어요. 성격의 강점에 지나온 시간의 판단이 붙는 해입니다.` : input.god === "상관" ? `${behavior} ${route.arrival}까지 겹치면 ${route.use}`
    : input.god === "정관" || input.god === "편관" ? `${route.use} ${behavior}`
      : input.god === "편인" || input.god === "정인" ? `${behavior} ${route.use}`
        : `${route.arrival}에서는 평소의 선택 방식도 더 잘 보입니다. ${behavior} ${route.use}`);
  return { paragraph, audit: { section: input.section, subject: "person", traitId: selected.id,
    evidenceRefs: input.evidenceRefs, sourceRefs: [`docs/product/mbti/source/${profile.type}.json:traits:${selected.area}:${selected.trait.id}`], kind: selected.matched ? "amplification" : "strength" } };
}
