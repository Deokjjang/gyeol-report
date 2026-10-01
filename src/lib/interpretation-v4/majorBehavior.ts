import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { proof, paragraph, particle } from "./copyRealizer";
import { MAJOR_MEANINGS } from "./majorMaterials";
import type { MajorEvidence } from "./majorEvidence";
import type { MajorContext } from "./majorContext";
import type { TenGod } from "../report-knowledge/annualFortuneTypes";

/** MBTI changes the response to a calculated period, never the period facts.
 * Authored bridges require BOTH a reviewed Fusion rule and its actual DB traits. */
export function majorBehavior(e: MajorEvidence, c: MajorContext, god: TenGod, stage: "now" | "next") {
  const profile = getMbtiSourceProfile(e.input.mbti);
  if (!profile) return null;
  const accepted = ["entj-pressure", "entj-wealth", "entj-needle", "infj-depth", "enfp-connection", "estp-needle", "estp-study", "intp-inquiry", "intp-pressure-learning-structure"];
  const fusion = e.materials.fusions.find(f => accepted.includes(f.ruleId));
  if (!fusion) return null; // No type-label-only fusion or guessed personality.
  const m = MAJOR_MEANINGS[god];
  const response = profile.type === "ENTJ" ? stage === "now"
    ? `‘${m.theme}’이라는 흐름 앞에서 가만히 기다리는 쪽은 아닙니다. ${particle(c.noun, "을", "를")} 키울 수 있다 싶으면 해야 할 순서부터 머릿속에 잡히죠. 책임이 생겼다는 말보다 무엇까지 내가 결정할 수 있는지가 더 궁금해집니다.`
    : `새 장에서는 ${particle(m.work, "을", "를")} 다른 사람에게도 맡길 수 있는지가 재미있는 시험대입니다. ${particle(c.craft, "이", "가")} 내 손에서만 돌아가면 커진 역할만큼 퇴근은 늦어집니다. 직접 해결할 때와 사람을 움직일 때의 성취감이 달라질 거예요.`
    : profile.type === "INFJ" ? stage === "now"
    ? `${particle(m.work, "을", "를")} 만나면 왜 이걸 오래 해야 하는지부터 묻게 됩니다. ${particle(c.noun, "이", "가")} 누군가의 하루를 어떻게 바꾸는지 보일 때 끈기가 살아나요. 남들이 보기에 조용한 준비여도, 안에서는 다음 몇 년의 그림을 꽤 멀리 그리고 있습니다.`
    : `다음 흐름의 ${particle(m.people, "은", "는")} 많은 연락처보다 깊은 대화로 남습니다. ${particle(c.craft, "을", "를")} 알아듣는 사람과 함께라면 혼자 오래 품던 생각도 구체적인 약속이 됩니다. 의미 있는 일을 혼자 감당해야 한다는 마음까지 가져갈 필요는 없어요.`
    : profile.type === "ENFP" ? stage === "now"
    ? `${particle(m.theme, "을", "를")} 혼자 계획표에만 넣어두지는 않습니다. ${particle(c.noun, "을", "를")} 누군가에게 이야기하다가 없던 길까지 떠올리는 쪽이에요. 반응이 오면 더 신나지만, 재미있는 제안 셋이 동시에 오면 몸은 여전히 하나라는 점이 난감합니다.`
    : `전환 뒤 ${particle(m.work, "을", "를")} 시작할 때는 ‘같이 해볼까?’라는 말이 좋은 입구가 됩니다. ${particle(c.craft, "이", "가")} 다른 사람의 경험을 만나면 처음 예상한 것보다 흥미로운 모양이 나올 수 있어요. 오래 붙들 한 가지를 고르는 즐거움도 새로 배울 만합니다.`
    : profile.type === "ESTP" ? stage === "now"
    ? `${particle(m.work, "을", "를")} 설명으로만 들으면 아직 감이 안 옵니다. ${particle(c.craft, "은", "는")} 작게라도 몸을 움직여 확인할 때 살아나는 쪽이에요. 반응이 빠른 만큼 좋은 기회를 발견하는 발도 빠르지만, 준비할 여유까지 앞질러 뛰지는 않는 게 좋습니다.`
    : `다음 장의 ${particle(m.theme, "은", "는")} 움직이면서 자기 것이 될 거예요. ${particle(c.craft, "을", "를")} 시험해볼 작은 현장이 생기면 긴 설명보다 한 번의 경험이 더 많이 남습니다. 속도를 줄이는 순간도 후퇴가 아니라 다음 선택을 더 정확히 보는 시간이 됩니다.`
    : stage === "now"
    ? `${particle(m.theme, "을", "를")} 볼 때 남들이 납득한 설명에서도 질문이 남습니다. ${particle(c.noun, "이", "가")} 왜 그렇게 돌아가는지 이해해야 마음 놓고 맡을 수 있죠. 혼자 파고든 시간이 길수록 밖에서는 갑자기 좋은 답을 내놓은 사람처럼 보이기도 합니다.`
    : `새 흐름에서는 ${particle(m.work, "을", "를")} 완벽하게 이해한 뒤에만 시작하려 하지 않아도 됩니다. ${particle(c.craft, "을", "를")} 작게 써보면 머릿속에서는 안 보이던 질문이 나와요. 오래 생각하는 재능에 직접 확인하는 재미가 붙을 때 전문성도 더 살아납니다.`;
  return { fusion, block: paragraph(`behavior-${stage}`, response, proof([], [], [fusion], [...e.sourceRefs, `period-ten-god:${god}`, ...c.provenance]), "positive"),
    source: { type: profile.type, rule: fusion.ruleId, traits: fusion.mbtiEvidence, periodTenGod: god, stage } };
}
