import type { CareerContext } from "./context";
import type { UserContextProfile } from "../report-knowledge/userContextTypes";

// Editorial settings only. The existing interpreter still owns normalization;
// these facets neither infer a customer's job nor change any evidence weight.
export type CareerWorkScenes = {
  entry: string; conversation: string; pressure: string; recognition: string;
  craft: string; handoff: string; learning: string; outside: string; next: string;
};
export function careerEditorialScenes(context: UserContextProfile, work: CareerContext): CareerWorkScenes {
  if (["student", "exam_certificate"].includes(context.lifeStatus)) return {
    entry: "같은 수업을 듣는데도 유독 다음 내용이 궁금해지는 순간",
    conversation: "팀 과제의 방향을 정하다 서로 좋아하는 부분이 다르다는 걸 알았을 때",
    pressure: "시험이 다가오는데 잘하는 과목만 계속 들여다보고 있을 때",
    recognition: "친구가 답 대신 내가 푼 과정을 물어오는 순간",
    craft: "전공 과제를 끝내고도 다른 방식으로 한 번 더 만들어보는 시간",
    handoff: "동아리 친구에게 내가 아는 내용을 설명하는 자리",
    learning: "오답의 이유를 찾다가 처음 배운 개념까지 다시 연결하는 경험",
    outside: "공모전·현장 체험에서 다른 학교 사람의 작업을 만나는 자리",
    next: "첫 인턴 공고에서 해보고 싶은 일과 실제 지원 요건을 나란히 보는 순간",
  };
  if (["job_seeker", "resting"].includes(context.lifeStatus)) return {
    entry: "채용 공고의 멋진 직무명 아래에 적힌 하루의 일을 읽는 순간",
    conversation: "현직자에게 그 일에서 가장 자주 막히는 지점을 묻는 자리",
    pressure: "준비한 것은 많은데 면접에서 꺼낼 경험 하나가 바로 떠오르지 않을 때",
    recognition: "작은 작업 샘플을 본 사람이 왜 그렇게 했는지 물어오는 순간",
    craft: "관심 있는 직무의 문제를 골라 내 방식으로 끝까지 풀어보는 시간",
    handoff: "모의 면접에서 내 선택의 이유를 처음 듣는 사람에게 전하는 자리",
    learning: "실무 과제를 해보다 알고 있던 이론의 빈칸을 발견하는 경험",
    outside: "직무 모임에서 내 경험이 예상 밖의 역할에도 쓰인다는 걸 알게 되는 자리",
    next: "첫 선택을 앞두고 회사 이름보다 배울 담당자와 맡을 문제를 비교하는 순간",
  };
  let scenes: CareerWorkScenes = {
    entry: "맡은 일을 시작하기 전에 무엇부터 확인할지 고르는 순간",
    conversation: "서로 다른 기대를 한 가지 결과로 맞춰가는 대화",
    pressure: "끝난 줄 알았던 일에 새로운 조건이 붙을 때",
    recognition: "내가 놓치지 않은 부분을 상대가 알아봐 주는 순간",
    craft: "익숙한 방식에서 한 군데만 바꿔 결과를 비교하는 시간",
    handoff: "다음 사람이 시작할 수 있도록 진행 상황을 설명하는 자리",
    learning: "최근 막혔던 사례를 다시 풀며 이유를 알아가는 경험",
    outside: "다른 환경에서 같은 문제를 푸는 사람을 만나는 자리",
    next: "다음 역할에서 반복하고 싶은 일과 줄이고 싶은 소모를 따져보는 순간",
  };
  if (work.roleFamily === "engineering") scenes = {
    entry: "요구사항을 읽다가 아직 적히지 않은 예외를 떠올리는 순간",
    conversation: "코드 리뷰에서 서로 다른 설계의 장단점을 설명하는 자리",
    pressure: "배포 직전 수정 요청이 들어와 테스트할 시간이 줄어들 때",
    recognition: "장애가 줄어든 이유를 동료가 내 설계에서 찾아주는 순간",
    craft: "코드 한 줄의 수정이 다른 기능에 미칠 영향을 재현하는 시간",
    handoff: "후배에게 정답 코드보다 그 설계를 고른 이유를 설명하는 자리",
    learning: "버그의 재현 조건을 바꾸다 서비스 구조를 새로 이해하는 경험",
    outside: "기술 모임에서 다른 팀이 기술 부채를 다루는 방법을 듣는 자리",
    next: "이직 공고에서 전문가의 깊이와 기술 관리 역할 사이를 비교하는 순간",
  };
  else if (work.industry === "healthcare") scenes = {
    entry: "인계가 끝났는데 환자의 작은 변화가 마음에 남는 순간",
    conversation: "보호자가 걱정하는 것과 의료진이 확인할 내용을 연결하는 대화",
    pressure: "처치 일정과 보호자의 질문이 동시에 몰릴 때",
    recognition: "다음 근무자가 덕분에 놓치지 않았다고 말해주는 순간",
    craft: "분주한 동선에서도 확인 순서를 빠뜨리지 않는 현장",
    handoff: "신규 동료에게 기록만으로는 알기 어려운 주의점을 전하는 자리",
    learning: "개인정보를 뺀 사례를 복기하며 안전 기준을 익히는 경험",
    outside: "다른 부서의 교육에서 환자를 보는 새로운 관점을 만나는 자리",
    next: "숙련을 더 깊게 할지 교육·조정 역할을 넓힐지 생각하는 순간",
  };
  else if (work.industry === "education") scenes = {
    entry: "설명을 끝냈는데 아직 멈춰 있는 학생의 표정을 보는 순간",
    conversation: "수업에서 같은 질문을 서로 다른 말로 다시 받아보는 자리",
    pressure: "개별 질문이 이어져 다음 수업 준비 시간이 밀릴 때",
    recognition: "포기했던 학생이 자기 말로 설명을 시작하는 순간",
    craft: "지난 수업의 반응을 보고 자료의 순서를 바꾸는 시간",
    handoff: "동료 교사에게 잘된 활동과 뜻밖에 막힌 지점을 나누는 자리",
    learning: "같은 개념의 여러 풀이를 비교하며 설명을 다듬는 경험",
    outside: "학교 밖 교육 모임에서 다른 교실의 사례를 만나는 자리",
    next: "수업 전문성과 교육과정·동료 지원 중 더 오래 맡고 싶은 일을 고르는 순간",
  };
  else if (work.roleFamily === "regulated_analysis") scenes = {
    entry: "합계는 맞지만 증빙 하나가 설명되지 않는 순간",
    conversation: work.industry === "public_service" ? "민원인의 기대와 적용 가능한 기준 사이를 설명하는 자리" : "의뢰인에게 가능한 처리와 넘지 못할 기준을 설명하는 자리",
    pressure: "마감 직전에 누락 자료가 도착하고 검토 시간은 줄어들 때",
    recognition: "아무 문제 없어 보이던 자료에서 위험을 미리 걸러냈다고 인정받는 순간",
    craft: "지난 기준과 바뀐 규정을 대조해 적용 범위를 가르는 시간",
    handoff: "검토 담당자에게 결론과 아직 애매한 근거를 구분해 넘기는 자리",
    learning: "예외 사례를 따라가며 원래 규정의 취지를 이해하는 경험",
    outside: "다른 기관의 실무자와 해석이 갈린 사례를 나누는 자리",
    next: "검토의 깊이와 고객 설명 중 다음 전문성을 고르는 순간",
  };
  else if (work.roleFamily === "field_operations" || work.operationsIntensity === "high" && work.industry === "manufacturing") scenes = {
    entry: "앞 공정의 작은 지연이 뒤 일정에 번지는 걸 보는 순간",
    conversation: "현장 작업자와 일정 담당자가 서로 다른 우선순위를 말하는 자리",
    pressure: "납기 때문에 안전 확인을 생략하자는 말이 나올 때",
    recognition: "큰 문제 없이 끝난 하루에 내가 막아낸 재작업이 드러나는 순간",
    craft: "작업 순서 하나를 바꿔 대기와 불량의 차이를 확인하는 현장",
    handoff: "다음 공정에 평소와 다른 조건을 짧게 짚어주는 자리",
    learning: "이상 발생 전후의 기록에서 반복되는 신호를 찾는 경험",
    outside: "다른 생산 라인의 운영을 보고 우리 현장을 새로 보는 자리",
    next: "직접 해결하는 숙련과 공정 전체의 조정 중 다음 역할을 고르는 순간",
  };
  else if (work.industry === "local_service") scenes = {
    entry: "예약과 주문이 겹쳐도 단골의 작은 취향은 떠오르는 순간",
    conversation: "처음 온 고객에게 가격과 서비스의 차이를 설명하는 자리",
    pressure: "손님은 늘었는데 마감 뒤 남는 돈과 시간은 줄어들 때",
    recognition: "다른 곳도 많은데 여기여서 다시 왔다는 말을 듣는 순간",
    craft: "서비스의 작은 순서를 바꿔 기다림과 만족을 함께 살피는 시간",
    handoff: "직원에게 손님을 편하게 만든 응대의 이유를 알려주는 자리",
    learning: "고객 반응과 재방문 이유를 연결해 새 서비스를 시험하는 경험",
    outside: "동네 밖에서 전혀 다른 고객층의 취향을 만나는 자리",
    next: "매장 확장 전에 원가와 품질을 어디까지 지킬 수 있을지 따져보는 순간",
  };
  else if (work.salesIntensity === "high") scenes = {
    entry: "고객 미팅에서 좋다는 반응과 실제 구매 의사가 달라 보이는 순간",
    conversation: "제안·협상에서 상대가 가격보다 다른 조건에 머뭇거리는 자리",
    pressure: work.industry === "software" ? "고객에게 한 약속과 제품팀 일정이 어긋날 때" : "거래처의 요청과 내부 공급 일정이 어긋날 때",
    recognition: "막혔던 계약이 풀린 이유를 동료가 내 질문에서 찾아주는 순간",
    craft: "실적 분석에서 성사된 거래와 멈춘 거래의 갈림길을 비교하는 시간",
    handoff: "후배에게 제안서 문구보다 고객의 망설임을 들었던 순서를 설명하는 자리",
    learning: "협상이 멈춘 사례를 되짚으며 놓친 의사결정자를 발견하는 경험",
    outside: "외부 행사에서 기존 고객과 다른 문제를 가진 사람을 만나는 자리",
    next: "이직 공고에서 목표 매출뿐 아니라 평가·보상과 협업 조건까지 읽는 순간",
  };
  else if (work.creativeIntensity === "high") scenes = {
    entry: "초안을 보여줬는데 좋다는 말 뒤의 미묘한 망설임이 걸리는 순간",
    conversation: "시안의 취향이 아니라 전달할 의도를 맞춰보는 대화",
    pressure: "마무리 직전 서로 다른 방향의 수정 요청이 쌓일 때",
    recognition: "내가 원한 느낌을 어떻게 알았느냐는 반응을 듣는 순간",
    craft: "익숙한 표현 하나를 바꿨더니 작업의 분위기가 달라지는 시간",
    handoff: "함께 만드는 사람에게 완성 이미지와 남겨둘 여지를 설명하는 자리",
    learning: "초안과 최종 결과 사이에서 결정적이었던 선택을 다시 보는 경험",
    outside: "전시나 다른 분야 작업에서 내 표현에 붙일 새 실마리를 찾는 자리",
    next: "제작의 깊이와 기획·디렉팅 중 내 이름으로 넓힐 일을 고르는 순간",
  };
  if (context.lifeStatus === "business_owner") return { ...scenes,
    handoff: "함께 일할 사람에게 내 손을 거치지 않아도 지켜질 품질을 설명하는 자리",
    next: "새 고객을 늘리기 전에 가격·비용·사람이 함께 버틸 규모를 따져보는 순간",
  };
  if (context.lifeStatus === "freelancer") return { ...scenes,
    recognition: "내 이름을 지정한 의뢰가 들어와 지난 작업의 취향을 알아봐 주는 순간",
    pressure: "계약에는 없던 수정이 이번만 부탁한다는 말과 함께 도착할 때",
    handoff: "고객과 협업자에게 결과의 의도와 이번 계약에서 마무리한 범위를 전하는 자리",
    next: "단가는 높지만 내 전문성에서 멀어지는 의뢰와 오래 남길 작업을 비교하는 순간",
  };
  return scenes;
}
