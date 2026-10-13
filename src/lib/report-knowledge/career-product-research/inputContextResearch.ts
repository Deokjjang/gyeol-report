/** Offline career research only; no runtime binding. */
import type { InputCase } from "./researchTypes";
export const CAREER_INPUT_CASES: readonly InputCase[] = [
  {
    "id": "ckr:case:A",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "A",
    "description": "프리랜서 사진가",
    "inputs": [
      {
        "jobStatus": "freelancer",
        "detailJob": "프리랜서 사진가",
        "mbtiType": "ISFJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "unknown"
    ],
    "invariant": "사진이라는 입력은 능력·장비·고객·계약 이력이 아니다",
    "questions": [
      "용도",
      "선별",
      "보정",
      "수정",
      "납품"
    ],
    "forbidden": "고객 수·단가·장비 보유 추정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:B",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "B",
    "description": "직장인 재무기획",
    "inputs": [
      {
        "jobStatus": "employee",
        "detailJob": "재무기획",
        "mbtiType": "ISTJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "finance_planning"
    ],
    "invariant": "직업 상태·직무는 원국 점수가 아니다",
    "questions": [
      "기간",
      "가정",
      "판단권",
      "평가"
    ],
    "forbidden": "급여·승진·회사 재무상태 추정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:C",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "C",
    "description": "구직 중 개발자 지망",
    "inputs": [
      {
        "jobStatus": "job_seeker",
        "detailJob": "개발자 지망",
        "mbtiType": "INTP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "engineering"
    ],
    "invariant": "희망 직업은 실제 개발 경력이 아니다",
    "questions": [
      "공고 과제",
      "샘플",
      "필수 기술"
    ],
    "forbidden": "취업·경력 보장",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:D",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "D",
    "description": "디자인 전공 학생",
    "inputs": [
      {
        "jobStatus": "student",
        "detailJob": "디자인 전공",
        "mbtiType": "ISFP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "design"
    ],
    "invariant": "전공은 상업 납품 경험이 아니다",
    "questions": [
      "매체",
      "목적",
      "피드백",
      "개인 수행"
    ],
    "forbidden": "성적·고객·계약 생성",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:E",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "E",
    "description": "자영업 카페",
    "inputs": [
      {
        "jobStatus": "self_employed",
        "detailJob": "카페 운영",
        "mbtiType": "ENFP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "customer_service"
    ],
    "invariant": "운영 상황과 개인 강점은 별도",
    "questions": [
      "상품",
      "준비",
      "폐기",
      "마감"
    ],
    "forbidden": "매출·단골·직원 추정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:F",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "F",
    "description": "소규모 사업 운영",
    "inputs": [
      {
        "jobStatus": "business_owner",
        "detailJob": "사업 대표",
        "mbtiType": "ENTJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "business_operations"
    ],
    "invariant": "운영자 입력만으로 직원 수를 만들지 않음",
    "questions": [
      "권한",
      "위임 대상",
      "결과 기준"
    ],
    "forbidden": "확장 성공·실제 고용 추정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:G",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "G",
    "description": "교육·강의",
    "inputs": [
      {
        "jobStatus": "freelancer",
        "detailJob": "강사",
        "mbtiType": "ENFJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "teaching"
    ],
    "invariant": "직무 선호는 자격·학습 효과의 증명이 아님",
    "questions": [
      "준비",
      "실습",
      "전이",
      "후속 질문"
    ],
    "forbidden": "합격·학습자 연령·성적 생성",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:H",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "H",
    "description": "의료·돌봄",
    "inputs": [
      {
        "jobStatus": "employee",
        "detailJob": "간호사",
        "mbtiType": "ISFJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "care_operations"
    ],
    "invariant": "직업 정보만으로 권한·건강을 추정하지 않음",
    "questions": [
      "허용 범위",
      "관찰",
      "인계"
    ],
    "forbidden": "진단·치료·안전 숙련 보장",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:I",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "I",
    "description": "행정",
    "inputs": [
      {
        "jobStatus": "employee",
        "detailJob": "행정",
        "mbtiType": "ISTJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "administration"
    ],
    "invariant": "행정 기능과 공무원 신분은 다름",
    "questions": [
      "요건",
      "증빙",
      "처리",
      "예외 질의"
    ],
    "forbidden": "공무원·법률 자격 생성",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:J",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "J",
    "description": "판매·서비스",
    "inputs": [
      {
        "jobStatus": "employee",
        "detailJob": "매장 판매 서비스",
        "mbtiType": "ESFP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "customer_service"
    ],
    "invariant": "employee 매장과 독립 매장 운영은 분류가 다를 수 있음",
    "questions": [
      "용도",
      "재고",
      "약속",
      "응대"
    ],
    "forbidden": "실적·고객 수·친화력 단정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:K",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "K",
    "description": "가사·돌봄 중심",
    "inputs": [
      {
        "jobStatus": "homemaker",
        "detailJob": "",
        "mbtiType": "INFJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "caregiving"
    ],
    "invariant": "caregiving은 상황 분기이며 가족 사실이 아님",
    "questions": [
      "역할",
      "시간",
      "새 탐색"
    ],
    "forbidden": "자녀·경력 단절 추정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:L",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "L",
    "description": "일을 쉬는 상태",
    "inputs": [
      {
        "jobStatus": "unemployed",
        "detailJob": "",
        "mbtiType": "INFP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "recovery"
    ],
    "invariant": "recovery는 상황 분기이며 질병·실직 사실이 아님",
    "questions": [
      "회복",
      "탐색",
      "다시 할 범위"
    ],
    "forbidden": "게으름·질병·구직 의사 추정",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:M",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "M",
    "description": "직업 상태 미입력",
    "inputs": [
      {
        "jobStatus": "",
        "detailJob": "개발자",
        "mbtiType": "INTJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "engineering"
    ],
    "invariant": "detailJob은 남겨도 고용 관계는 미상",
    "questions": [
      "현재 하는가 관심 분야인가"
    ],
    "forbidden": "회사·고용 관계 생성",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:N",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "N",
    "description": "detailJob 미입력",
    "inputs": [
      {
        "jobStatus": "freelancer",
        "detailJob": "",
        "mbtiType": "ISTP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "unknown"
    ],
    "invariant": "독립 작업 방식만 알며 제작 분야는 미상",
    "questions": [
      "의뢰 대상",
      "산출물",
      "범위"
    ],
    "forbidden": "기본 직무를 개발·디자인으로 보충",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:O",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "O",
    "description": "MBTI 미입력",
    "inputs": [
      {
        "jobStatus": "freelancer",
        "detailJob": "사진가",
        "mbtiType": "",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "unknown"
    ],
    "invariant": "명리에서 유형을 만들지 않고 Fusion은 보류",
    "questions": [
      "명리 단독 전제",
      "실제 과제"
    ],
    "forbidden": "유형·동료 Pair 생성",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:P",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "P",
    "description": "출생시간 미상",
    "inputs": [
      {
        "jobStatus": "employee",
        "detailJob": "재무기획",
        "mbtiType": "ISTJ",
        "birthTimePrecision": "unknown"
      }
    ],
    "observedFunctions": [
      "finance_planning"
    ],
    "invariant": "시주 합성·전체 부재·완성 구조를 만들지 않음",
    "questions": [
      "stable",
      "candidates",
      "확인된 원국 범위"
    ],
    "forbidden": "시주 추정·확정 성향 보충",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:Q",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "Q",
    "description": "동일 원국·유형 다른 상태",
    "inputs": [
      {
        "jobStatus": "student",
        "detailJob": "디자인",
        "mbtiType": "ISFP",
        "birthTimePrecision": "exact"
      },
      {
        "jobStatus": "freelancer",
        "detailJob": "디자인",
        "mbtiType": "ISFP",
        "birthTimePrecision": "exact"
      },
      {
        "jobStatus": "employee",
        "detailJob": "디자인",
        "mbtiType": "ISFP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "design",
      "design",
      "design"
    ],
    "invariant": "계산·유형은 같고 적용 질문만 달라야 함",
    "questions": [
      "과제",
      "의뢰",
      "조직의 다른 조건"
    ],
    "forbidden": "상태를 성향 점수로 변환",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:R",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "R",
    "description": "동일 상태 다른 직무",
    "inputs": [
      {
        "jobStatus": "freelancer",
        "detailJob": "사진가",
        "mbtiType": "ISFJ",
        "birthTimePrecision": "exact"
      },
      {
        "jobStatus": "freelancer",
        "detailJob": "번역가",
        "mbtiType": "ISFJ",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "unknown",
      "language_mediation"
    ],
    "invariant": "유형은 같고 촬영·언어의 과제와 비용은 다름",
    "questions": [
      "선별",
      "보정과 용어",
      "원문 검수"
    ],
    "forbidden": "직업 이름만 바꾼 같은 장면",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:S",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "S",
    "description": "유사 분야 다른 작업 조건",
    "inputs": [
      {
        "jobStatus": "freelancer",
        "detailJob": "상품 사진가",
        "mbtiType": "ISFP",
        "birthTimePrecision": "exact"
      },
      {
        "jobStatus": "freelancer",
        "detailJob": "인물 사진가",
        "mbtiType": "ISFP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "unknown",
      "unknown"
    ],
    "invariant": "현재 parser 둘 다 unknown이며 별도 adapter 미구현",
    "questions": [
      "정보 전달 목적",
      "인물 연출",
      "사용 규격"
    ],
    "forbidden": "촬영 분야를 이미 인식했다고 표시",
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "ckr:case:T",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "letter": "T",
    "description": "분류기가 인식 못하는 세부 역할",
    "inputs": [
      {
        "jobStatus": "employee",
        "detailJob": "데이터저널리스트",
        "mbtiType": "INTP",
        "birthTimePrecision": "exact"
      }
    ],
    "observedFunctions": [
      "unknown"
    ],
    "invariant": "명칭에서 새로운 parser 결과를 만들어내지 않음",
    "questions": [
      "조사",
      "시각화",
      "기사 중 실제 수행 질문"
    ],
    "forbidden": "지원되는 직무라고 허위 기록",
    "isFictional": true,
    "notCustomerHistory": true
  }
];
