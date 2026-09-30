import { interpretCareerContextV3 } from "../interpretation-v3/careerContextV3";
import { careerEditorialScenes } from "../interpretation-v3/careerEditorialScenes";
import type { UserLifeStatus } from "../report-knowledge/userContextTypes";
import type { NarrativeInput } from "./narrativeTypes";
import { particle } from "./copyRealizer";

/** Read-only setting adapter. A job never establishes a natal trait. */
export function narrativeContext(input: NarrativeInput) {
  const raw = input.context.detailJob.trim();
  const status = input.context.jobStatus;
  const life: UserLifeStatus = status === "self_employed" ? "business_owner" :
    status === "unemployed" ? "resting" : ["student", "job_seeker", "employee", "freelancer", "business_owner"].includes(status) ? status as UserLifeStatus : "other";
  const career = interpretCareerContextV3(raw, true, life);
  const scenes = careerEditorialScenes({ lifeStatus: life, fieldLabel: raw }, career);
  const setting = status === "student" ? (raw ? `${raw} 분야를 배우는 지금` : "지금 배우고 경험하는 과정") :
    status === "job_seeker" ? (raw ? `${raw} 쪽을 준비하는 지금` : "다음 일을 준비하는 지금") :
    status === "unemployed" ? "쉬며 생활을 다시 고르는 지금" : status === "homemaker" ? "생활의 크고 작은 일을 챙기는 지금" :
    raw ? `현재 ${particle(raw, "이라는", "라는")} 일에서도` : "지금 맡은 일을 해나가는 과정에서도";
  const quiet = status === "unemployed" || status === "homemaker" || status === "" || status === "other";
  return { raw, status, career, setting,
    scenes: quiet ? { ...scenes, entry: "하루에 할 일이 겹쳐 무엇부터 끝낼지 고르는 순간", pressure: "예정에 없던 부탁이 들어와 내 시간이 밀리는 날",
      recognition: "내가 챙긴 덕분에 하루가 편해졌다는 말을 듣는 순간", learning: "관심 있던 취미를 직접 배워보는 시간", next: "다음 달에는 어떤 시간을 더 남기고 싶은지 생각하는 순간" } : scenes,
    money: status === "student" ? "수업료와 교재비, 친구들과 놀 돈이 같은 지갑에서 나갑니다. 지금은 가진 돈의 크기만큼 무엇을 배우고 경험하는 데 쓰고 싶은지도 중요합니다." :
      status === "job_seeker" ? "준비를 위한 돈과 오늘 생활할 돈을 함께 생각하게 됩니다. 아직 받지 않은 연봉보다 지금 들이는 시간이 어떤 경험으로 남는지 볼 일이 많습니다." :
      status === "freelancer" ? "내 이름으로 의뢰를 받으면 잘 만들었다는 반응만큼 이번 일에 얼마의 시간이 들어갔는지도 남습니다. 통장에 찍힌 금액이 같아도 수정을 몇 번 했느냐에 따라 마음은 꽤 다릅니다." :
      life === "business_owner" ? "들어온 매출을 보고 기뻤다가 비용을 빼고 다시 보는 날이 있습니다. 잘 팔리는 것과 내 생활에 남는 것이 항상 같은 속도로 자라지는 않습니다." :
      status === "employee" ? "일을 잘 끝냈을 때의 뿌듯함과 평가표를 받아드는 마음은 조금 다릅니다. 맡은 역할이 늘었다면 그 변화가 보상에도 보이는지 자연스럽게 신경이 갑니다." :
      status === "homemaker" ? "생활비는 눈에 보이는데 집안을 챙기는 시간은 숫자로 잘 남지 않습니다. 같은 예산으로 하루를 더 편하게 만드는 선택도 분명한 실력입니다." :
      "큰 수입 이야기만이 돈 이야기는 아닙니다. 지금의 생활을 편하게 하는 지출과 지나고 나면 별로 기억나지 않는 지출 사이에서도 내 취향이 드러납니다.",
    direction: status === "student" ? "아직 직업 하나로 나를 고정할 때는 아닙니다. 어떤 과제를 할 때 더 궁금해지고 어떤 경험 뒤에 자신감이 붙었는지가 다음 선택의 힌트입니다." :
      status === "job_seeker" ? "첫 선택 하나가 내 모든 가능성을 결정하지는 않습니다. 내가 잘했던 일을 설명할 수 있고 실제로 배울 사람이 있는 자리를 알아보는 눈도 이미 자라는 중입니다." :
      status === "freelancer" ? "다음 의뢰가 들어오는 것만큼 내 이름으로 어떤 작업을 남길지도 중요해집니다. 나를 알아보고 다시 찾는 이유가 분명할수록 선택할 수 있는 일도 달라집니다." :
      life === "business_owner" ? "더 많이 파는 다음 단계에는 내가 자리를 비워도 지켜지는 약속이 있습니다. 내 손재주와 판단이 다른 사람에게도 전해질수록 혼자보다 큰 일을 남길 수 있습니다." :
      status === "employee" ? "앞으로 맡을 역할은 지금 하는 일을 더 많이 하는 것만은 아닙니다. 무엇을 판단할 때 나를 찾는지 분명해질수록 내 이름이 필요한 자리도 달라집니다." :
      "생활을 새로 고르는 시간에도 지금까지 해온 것이 사라지지는 않습니다. 편하게 잘했던 일과 다시 해보고 싶은 일을 알아보는 데서 다음 방향이 시작됩니다.",
  };
}

export const LOVE_STATE_COPY = {
  "": { title: "가까워지면 보이는 다른 표정", entry: "사람에게 마음을 줄 때 어떤 모습이 되는지 떠올려볼 차례입니다. 관계의 이름보다 편해지는 순간과 유난히 신경 쓰이는 순간에 내 성향이 더 잘 드러납니다.", scene: "누군가와 이야기를 나눈 뒤 그 사람의 말이 다시 떠오르는 밤", ending: "나를 오래 궁금해하는 사람 앞에서는 급하게 괜찮은 모습을 증명할 필요가 줄어듭니다." },
  single: { title: "아직 만나기 전에도 마음의 취향은 있습니다", entry: "지금은 솔로여도 어떤 사람에게 눈이 가는지는 남아 있습니다. 모두가 매력적이라고 하는 사람보다 내 표정이 달라지는 사람을 떠올리면 취향이 더 또렷해집니다.", scene: "친구 소개로 처음 대화를 나눈 뒤 집에 돌아오는 길", ending: "혼자인 시간을 비어 있는 시간으로만 볼 필요는 없습니다. 어떤 만남에서 내가 더 편하고 재미있어지는지 알아가는 시간도 됩니다." },
  some: { title: "아직 이름 붙이지 않았는데 이미 신경 씁니다", entry: "썸에서는 작은 반응에 마음이 바빠집니다. 연락 횟수만큼 답장 속의 농담이나 다음 약속을 꺼내는 태도가 오래 남습니다. 아직 정해진 관계가 아니어서 평소의 내 방식이 더 선명하게 드러납니다.", scene: "메시지가 왔다는 알림을 보고 바로 열까 잠깐 기다릴까 생각하는 순간", ending: "말 한마디의 정답을 맞히는 것보다 만날수록 내 표정이 편해지는지가 더 오래 남는 단서입니다." },
  dating: { title: "익숙해진 뒤에 더 잘 보이는 애정", entry: "연애가 익숙해지면 처음의 설렘만으로 설명되지 않는 내 모습이 나옵니다. 바쁜 날 어떻게 시간을 내는지, 서운할 때 무엇을 먼저 말하는지에 사랑하는 방식이 묻어납니다.", scene: "오랜만의 데이트에서 서로 피곤한 하루 이야기를 꺼내는 저녁", ending: "편해졌다고 성의가 줄어든 것은 아니지만 둘이 편하다고 느끼는 방식은 다를 수 있습니다. 그 차이를 알아보는 만큼 함께 있는 시간에도 여유가 생깁니다." },
  marriage_preparing: { title: "결혼 준비를 하며 서로의 생활이 보입니다", entry: "결혼을 준비하면 마음만 묻던 대화에 돈과 일정과 가족 이야기가 들어옵니다. 무엇을 먼저 결정하고 무엇은 천천히 합의하고 싶은지에서 두 사람의 생활 취향이 보입니다.", scene: "집과 예산을 이야기하다 꼭 지키고 싶은 한 가지가 달라지는 순간", ending: "모든 선택을 같게 만드는 것이 준비의 끝은 아닙니다. 다른 취향을 가진 채로도 같이 결정할 수 있다는 경험이 든든함을 만듭니다." },
  married: { title: "한집에 살 때 드러나는 진짜 마음 씀씀이", entry: "기혼의 관계에서는 큰 고백보다 매일의 작은 배분에 마음이 보입니다. 누가 쉬고 누가 챙겼는지, 부탁을 어떻게 받아들였는지에 오늘의 분위기가 달라집니다.", scene: "집안일을 마친 뒤 서로 남은 저녁 시간을 어떻게 쓸지 이야기하는 장면", ending: "한집에 있다는 이유로 마음까지 자동으로 같은 속도가 되지는 않습니다. 함께 쉬는 방식과 각자 숨 돌리는 방식이 모두 남을 때 일상도 더 편해집니다." },
} as const;
