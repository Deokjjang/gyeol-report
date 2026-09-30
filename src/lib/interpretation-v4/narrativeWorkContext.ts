import type { NarrativeCareerContext } from "./narrativeContext";
import type { NarrativeInput } from "./narrativeTypes";

/** Settings only. Function/work-mode never creates evidence of talent or fortune. */
export function workManifestation(input: NarrativeInput, career: NarrativeCareerContext) {
  const { jobStatus: status, detailJob: raw } = input.context;
  const functionName = status === "homemaker" ? "caregiving" : status === "unemployed" ? "recovery" :
    /번역|통역|현지화|로컬라이[즈징]/.test(raw) ? "language_mediation" :
    /매장|소매|서점|판매|샵/.test(raw) && ["self_employed", "business_owner"].includes(status) ? "retail_operations" : career.function ?? "unknown";
  const mode = status === "self_employed" ? "independent_owner" : career.workMode;
  const context = functionName === "language_mediation" ? {
    entry: "원문의 말뜻과 읽는 사람이 이해할 순서를 함께 고르는 순간",
    conversation: "의뢰인이 원하는 말투와 원문의 뜻 사이를 조율하는 대화",
    pressure: "문장을 옮기다 같은 용어가 앞뒤에서 다른 뜻으로 쓰인 걸 발견한 순간",
    learning: "어려운 한 구절을 풀기 위해 배경 자료와 실제 쓰임을 나란히 보는 시간",
    handoff: "옮긴 문장을 처음 읽는 사람에게도 뜻이 통하는지 확인하는 자리",
    money: "끝낸 분량만 보면 짧아도 한 표현을 확인하느라 쓴 시간은 길 수 있습니다. 당신의 일값에는 적힌 글자뿐 아니라 틀리지 않게 건너게 한 뜻도 들어 있습니다.",
    direction: "다음 일에서는 처리한 양만이 아니라 어떤 내용을 믿고 맡길 수 있는지가 이름의 값이 됩니다. 어려운 뜻을 정확하게 건넨 경험은 다시 의뢰할 이유로 남습니다.",
  } : functionName === "caregiving" ? {
    entry: "서로 필요한 시간이 달라 하루의 순서를 맞추는 순간",
    conversation: "가족이 원하는 도움과 혼자 해보고 싶은 것을 구분해 듣는 대화",
    pressure: "예정에 없던 부탁이 생겨 내 쉬는 시간이 밀리는 날",
    learning: "취미로 배운 작은 요령을 집에서 써보는 시간",
    handoff: "함께 할 일을 나누고 상대가 해볼 때 잠깐 기다리는 자리",
    money: "생활비는 눈에 보이는데 집안을 챙기는 시간은 숫자로 잘 남지 않습니다. 같은 예산으로 하루를 더 편하게 만드는 선택도 분명한 실력입니다.",
    direction: "다른 사람의 하루를 편하게 만드는 동안 내 취향까지 없어진 건 아닙니다. 잘 챙겨온 경험 옆에 나를 위해 배울 것과 즐길 자리도 남을 수 있습니다.",
  } : functionName === "recovery" ? {
    entry: "바쁘던 때와 달리 내 속도로 하루를 정해보는 순간",
    conversation: "앞으로 무엇을 하고 싶은지 묻는 말에 당장 답하지 않아도 되는 대화",
    pressure: "쉬고 있는데도 뭔가 해내야 할 것 같아 마음이 바빠지는 날",
    learning: "성과를 내기 위해서가 아니라 재미있어서 작은 취미를 익히는 시간",
    handoff: "부탁을 어디까지 받아줄지 내 시간을 먼저 살피는 자리",
    money: "쉬는 동안에는 큰 수입보다 생활을 오래 편하게 이어갈 지출이 먼저 보입니다. 아끼고 싶은 마음과 나를 위해 기분 좋게 쓰고 싶은 마음을 같이 가질 수 있습니다.",
    direction: (/^이전\s*직업\s*/.test(raw) ? `${raw.replace(/^이전\s*직업\s*/, "").trim()} 일을 하며 익힌 감각도 쉬는 사이에 사라지지는 않습니다. ` : "지금 서둘러 직업 이름을 새로 붙이지 않아도 해왔던 감각은 남아 있습니다. ") + "편했던 일과 다시는 반복하고 싶지 않은 일을 아는 것도 다음 생활을 고르는 힘입니다.",
  } : functionName === "retail_operations" && ["independent_owner", "owner"].includes(mode ?? "") ? {
    entry: "고객이 둘러보는 동안 무엇을 궁금해하는지 지켜보는 순간",
    conversation: "처음 온 사람이 원하는 것과 내가 소개하고 싶은 것을 맞춰보는 대화",
    pressure: "직접 응대하는 사이에 주문과 정리할 일이 함께 쌓이는 날",
    learning: "다시 찾아온 사람이 무엇 때문에 돌아왔는지 듣는 시간",
    handoff: "자리를 잠깐 비워도 지켜졌으면 하는 일을 적어두는 자리",
    money: "하루의 판매가 괜찮아도 들여온 물건과 유지비를 빼면 느낌이 달라집니다. 오래 지킬 취향과 계속 감당할 비용을 같이 보는 것이 내 공간을 운영하는 현실입니다.",
    direction: "내가 좋아하는 것을 다른 사람도 다시 찾아올 이유로 남기는 쪽입니다. 규모만 크게 하는 것보다 내 취향과 생활이 함께 오래 갈 수 있는 자리가 어울립니다.",
  } : functionName === "finance_planning" ? {
    money: "실적을 설명하는 일에 익숙해도 내 보상 이야기는 별개의 마음입니다. 맡은 판단의 무게가 늘었다면 연봉과 평가에서도 그 차이가 보였으면 합니다.",
    direction: "숫자를 맞히는 사람에서 그 숫자가 뜻하는 다음 선택을 설명할 사람으로 커갈 수 있습니다. 확인해온 경험이 쌓일수록 내 판단을 믿고 묻는 자리도 생깁니다.",
  } : functionName === "administration" ? {
    money: "혼선을 막아낸 일은 별일 없었다는 말로 지나가기도 합니다. 같은 급여 안에서 챙길 일이 계속 늘면 얼마나 많이 했는지보다 무엇을 책임졌는지가 마음에 남습니다.",
    direction: "조용히 잘 돌아가게 만든 경험도 분명히 내 실력입니다. 남이 놓친 연결을 챙기는 감각이 당연한 심부름으로만 남지 않는 자리에서 더 든든해집니다.",
  } : career.creativeIntensity === "high" && career.salesIntensity !== "high" && status === "employee" ? {
    money: "결과를 보여주는 순간까지 들어간 준비는 밖에서 잘 보이지 않습니다. 멋졌다는 반응만큼 그 과정의 판단과 수고도 평가에 담겼으면 하는 마음이 있습니다.",
    direction: "의도를 알아듣고 실제 경험으로 옮기는 감각이 내 이름으로 남을 수 있습니다. 무엇을 맡았을 때 사람이 다르게 느꼈는지 기억하면 다음 역할도 더 또렷해집니다.",
  } : undefined;
  return { functionName, mode, context };
}
