/** Static offline career research; no runtime selection or customer approval. */
import type { JobResearch } from "./researchTypes";

export const CAREER_JOB_RESEARCH: readonly JobResearch[] = [
  {
    "id": "ckr:job:photography",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "photography",
    "label": "사진가·프리랜서 사진가",
    "jobStatuses": [
      "freelancer",
      "employee",
      "self_employed"
    ],
    "existingRouteRefs": [
      "create",
      "experience",
      "review"
    ],
    "testedInputText": "사진가",
    "observedFunction": "unknown",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "freelancer",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "independent"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "employee"
      },
      {
        "jobStatus": "self_employed",
        "baseFunction": "business_operations",
        "effectiveFunction": "business_operations",
        "workMode": "independent_owner"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [],
      "outputTypes": [],
      "successMetrics": [],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "independent"
    },
    "occupationIsAbilityProof": false,
    "task": "사용 목적과 촬영 대상, 납품 형태를 의뢰인에게 각각 묻는다",
    "workflow": [
      "목적 확인",
      "촬영 설계",
      "현장 촬영",
      "선별",
      "보정",
      "납품 확인"
    ],
    "outputs": "사용 매체에 맞춘 선별 이미지와 보정 범위 안내",
    "collaboration": "의뢰인·모델·현장 담당자가 원하는 장면과 촬영 가능 조건을 합의",
    "difficulty": "작품으로 좋은 컷과 실제 사용할 수 있는 컷이 다를 수 있다",
    "comfortable": "사진의 용도와 선정 기준을 공유하고 현장 판단을 허용하는 의뢰",
    "uncomfortable": "참고 이미지 없이 취향 수정만 반복하고 변경을 모두 최초 비용에 포함하는 의뢰",
    "learn": "광원·움직임·색관리의 선택 이유를 비교할 테스트 촬영",
    "validateResult": "장비 성능 대신 실제 납품 규격과 사용 목적 충족 여부로 검토",
    "economic": "보정 횟수·이동·준비·저장·사용 범위가 촬영 시간 밖의 투입이 될 수 있다",
    "smallExperiment": "연습 사진 두 장을 같은 용도로 골라 왜 한 장을 납품할지 설명",
    "fictionalScene": "촬영 전 상품 상세용 사진을 요청받았는데 포트폴리오의 분위기 사진을 참고로 받은 가상 상황",
    "taskBasis": "onet:photo",
    "restrictions": "사진 분야 내 인물·상품·보도는 서로 다른 조건이며 실제 촬영 분야부터 확인",
    "materialRefs": [
      "ckr:material:CH03.P2:route-create-photo",
      "ckr:material:CH03.P4:creative-scope-chaos",
      "ckr:material:CH04.P1:client-brief",
      "ckr:material:CH05.P1:status-freelancer",
      "ckr:material:CH05.P2:current-photo-selection",
      "ckr:material:CH05.P3:grow-photo-client-fit",
      "ckr:material:CH05.P4:next-photo-brief",
      "ckr:material:CH06.P2:photo-use-value",
      "ckr:material:CH06.P3:unpriced-revision",
      "ckr:material:CH06.P3:tool-demand-gap",
      "ckr:material:CH06.P4:cashflow-timing",
      "ckr:material:CH07.P2:photo-light-comparison",
      "ckr:material:CH07.P3:activity-to-language",
      "ckr:material:CH08.P4:positive-to-client-use",
      "ckr:material:CH09.P1:choose-freelance-purpose",
      "ckr:material:CH09.P3:strategy-photo-cycle",
      "ckr:material:CH09.P4:closing-creative-purpose"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:finance",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "finance",
    "label": "재무기획",
    "jobStatuses": [
      "employee"
    ],
    "existingRouteRefs": [
      "review",
      "manage",
      "investigate"
    ],
    "testedInputText": "재무기획",
    "observedFunction": "finance_planning",
    "baseClassifierFunction": "finance_planning",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "finance_planning",
        "effectiveFunction": "finance_planning",
        "workMode": "employee"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "finance_planning",
      "customerFacing": null,
      "analysisIntensity": "high",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "medium",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "low",
      "keyWorkModes": [
        "예산 편성",
        "실적과 계획 비교",
        "투자안 검토"
      ],
      "outputTypes": [
        "손익 전망",
        "경영진 보고"
      ],
      "successMetrics": [
        "예측 정확도",
        "비용 구조 개선"
      ],
      "stakeholders": [
        "부서 담당자",
        "경영진"
      ],
      "function": "finance_planning",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "집계 기간과 예산 가정이 같은지 원자료에서 확인",
    "workflow": [
      "기간 통일",
      "실적 대조",
      "차이 분해",
      "시나리오 비교",
      "판단 자료 전달"
    ],
    "outputs": "가정과 오차 범위가 보이는 손익 전망·예산 비교표",
    "collaboration": "사업 부서의 운영 가정과 의사결정자의 비교 질문을 연결",
    "difficulty": "예측 오차를 모두 담당자의 실수로 볼 수 없다",
    "comfortable": "가정 변경을 공개하고 불확실성을 함께 보고하는 조직",
    "uncomfortable": "원자료 접근 없이 원하는 결론에 숫자만 맞추는 조직",
    "learn": "스프레드시트 검증·집계 기준·시나리오 민감도 연습",
    "validateResult": "같은 수치에서도 가정 변화와 실제 사업 변화를 구분해 설명",
    "economic": "예산 절감이 미루는 활동과 다시 생길 비용을 함께 검토",
    "smallExperiment": "가상 매출표의 가격·수량·시점 가정을 각각 바꿔 비교",
    "fictionalScene": "매출은 늘었지만 회수 시점이 늦어진 가상 전망 검토",
    "taskBasis": "repo:finance",
    "restrictions": "개인 투자 수익·회사의 실제 재무상태를 추정하지 않음",
    "materialRefs": [
      "ckr:material:CH02.P2:resource-distinct",
      "ckr:material:CH03.P1:task-not-title",
      "ckr:material:CH03.P2:route-review-finance",
      "ckr:material:CH03.P4:blocked-review",
      "ckr:material:CH05.P1:status-employee",
      "ckr:material:CH05.P2:current-finance-variance",
      "ckr:material:CH05.P3:grow-finance-communication",
      "ckr:material:CH05.P4:next-employee-role",
      "ckr:material:CH06.P1:wealth-not-balance",
      "ckr:material:CH06.P2:employee-contribution",
      "ckr:material:CH07.P2:finance-scenario-learning",
      "ckr:material:CH07.P3:familiarity-trap",
      "ckr:material:CH09.P3:strategy-finance-cycle"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:software",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "software",
    "label": "개발·IT 구현",
    "jobStatuses": [
      "employee",
      "freelancer",
      "job_seeker",
      "student"
    ],
    "existingRouteRefs": [
      "investigate",
      "review",
      "create"
    ],
    "testedInputText": "개발자",
    "observedFunction": "engineering",
    "baseClassifierFunction": "engineering",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "engineering",
        "effectiveFunction": "engineering",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "engineering",
        "effectiveFunction": "engineering",
        "workMode": "independent"
      },
      {
        "jobStatus": "job_seeker",
        "baseFunction": "engineering",
        "effectiveFunction": "engineering",
        "workMode": "job_seeker"
      },
      {
        "jobStatus": "student",
        "baseFunction": "engineering",
        "effectiveFunction": "engineering",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "software",
      "roleFamily": "engineering",
      "customerFacing": null,
      "analysisIntensity": "high",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "설계",
        "검증",
        "코드 리뷰",
        "문제 재현"
      ],
      "outputTypes": [
        "설계안",
        "기능 결과물",
        "코드",
        "테스트"
      ],
      "successMetrics": [
        "요구사항 충족",
        "서비스 안정성"
      ],
      "stakeholders": [
        "사용자",
        "협업팀",
        "리뷰 동료"
      ],
      "function": "engineering",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "사용자 요구와 현재 오류의 재현 조건을 나눈다",
    "workflow": [
      "요구 정의",
      "작은 구현",
      "오류 재현",
      "검증",
      "연결 확인",
      "인계"
    ],
    "outputs": "작동 코드·검증 사례·변경 이유",
    "collaboration": "요청자·검토 동료·운영 담당자에게 영향 범위를 전달",
    "difficulty": "기술적으로 가능한 구현과 당장 필요한 기능은 다르다",
    "comfortable": "검토와 실험 시간을 주고 기존 동작을 확인할 환경",
    "uncomfortable": "새 기능 수만 평가하며 유지보수 책임을 설명하지 않는 환경",
    "learn": "실패 입력·경계 조건·설계 대안 비교",
    "validateResult": "예제와 다른 입력에서도 같은 약속이 지켜지는지 확인",
    "economic": "구현 외 유지보수·장애 대응·설명 시간을 별도 투입으로 본다",
    "smallExperiment": "작은 기능 하나에 실패 사례와 복구 기준까지 적기",
    "fictionalScene": "작동 화면은 같지만 입력 누락 때 결과가 달라지는 가상 구현",
    "taskBasis": "onet:software",
    "restrictions": "현재 실력·서비스 운영 이력·특정 기술 사용을 입력만으로 인정하지 않음",
    "materialRefs": [
      "ckr:material:CH01.P2:source-review-link",
      "ckr:material:CH01.P3:start-finish-contract",
      "ckr:material:CH01.P4:autonomy-with-checkpoint",
      "ckr:material:CH02.P4:transfer-test",
      "ckr:material:CH03.P1:investigation-object",
      "ckr:material:CH03.P2:route-investigate-dev",
      "ckr:material:CH03.P4:false-speed",
      "ckr:material:CH04.P1:shared-vocabulary",
      "ckr:material:CH04.P2:quality-gate-role",
      "ckr:material:CH04.P3:scope-refusal-cost",
      "ckr:material:CH05.P1:status-seeker",
      "ckr:material:CH05.P3:grow-dev-maintain",
      "ckr:material:CH05.P4:next-seeker-sample",
      "ckr:material:CH06.P1:skill-to-use",
      "ckr:material:CH06.P4:value-not-cheapest",
      "ckr:material:CH07.P1:learn-by-doing",
      "ckr:material:CH07.P2:dev-new-input",
      "ckr:material:CH07.P4:work-based-upskill",
      "ckr:material:CH08.P3:career-drive-repeat-fire",
      "ckr:material:CH09.P1:choose-learning-sample",
      "ckr:material:CH09.P2:guard-drive-review",
      "ckr:material:CH09.P2:guard-boundary-isolation",
      "ckr:material:CH09.P3:strategy-dev-cycle"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:brand_design",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "brand_design",
    "label": "브랜드·시각 디자인",
    "jobStatuses": [
      "freelancer",
      "employee",
      "student"
    ],
    "existingRouteRefs": [
      "create",
      "review",
      "experience"
    ],
    "testedInputText": "브랜드 디자이너",
    "observedFunction": "design",
    "baseClassifierFunction": "design",
    "observedVariants": [
      {
        "jobStatus": "freelancer",
        "baseFunction": "design",
        "effectiveFunction": "design",
        "workMode": "independent"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "design",
        "effectiveFunction": "design",
        "workMode": "employee"
      },
      {
        "jobStatus": "student",
        "baseFunction": "design",
        "effectiveFunction": "design",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "design",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "기획",
        "초안 검토",
        "시안 제작",
        "수정"
      ],
      "outputTypes": [
        "기획안",
        "콘텐츠",
        "작업물",
        "포트폴리오"
      ],
      "successMetrics": [
        "결과물 완성도",
        "완성도",
        "재의뢰"
      ],
      "stakeholders": [
        "협업팀",
        "의뢰인"
      ],
      "function": "design",
      "seniority": "unspecified",
      "workMode": "independent"
    },
    "occupationIsAbilityProof": false,
    "task": "독자·매체·전달할 정보의 우선순위를 묻는다",
    "workflow": [
      "요구 정리",
      "대안 시안",
      "선택 근거",
      "매체 적용",
      "읽기 확인"
    ],
    "outputs": "시안·매체별 적용안·핵심 표현 기준",
    "collaboration": "의뢰인의 취향과 실제 이용자의 읽기 문제를 분리",
    "difficulty": "눈에 띄는 표현이 항상 필요한 정보 전달을 돕지는 않는다",
    "comfortable": "초안의 목적을 듣고 다른 매체 적용까지 평가하는 환경",
    "uncomfortable": "완성 후 결정자가 바뀌어 방향을 전부 뒤집는 환경",
    "learn": "정보 계층·대비·출력 매체의 제약을 비교",
    "validateResult": "작은 화면에서도 핵심 문구가 먼저 읽히는지 확인",
    "economic": "새 방향 재제작과 같은 방향 수정의 범위를 구분",
    "smallExperiment": "같은 문구를 포스터와 작은 배너로 옮겨 비교",
    "fictionalScene": "보기 좋은 포스터가 작은 배너에서는 상품명을 가린 가상 시안",
    "taskBasis": "repo:design",
    "restrictions": "디자인 전공과 상업 납품 경험은 구별",
    "materialRefs": [
      "ckr:material:CH01.P1:draft-as-question",
      "ckr:material:CH02.P1:make-alternative",
      "ckr:material:CH02.P3:precision-to-visual",
      "ckr:material:CH02.P4:feedback-not-praise",
      "ckr:material:CH03.P1:output-audience",
      "ckr:material:CH03.P4:creative-scope-chaos",
      "ckr:material:CH04.P1:student-role-dialogue",
      "ckr:material:CH04.P4:culture-feedback-safety",
      "ckr:material:CH05.P1:status-student",
      "ckr:material:CH05.P2:current-design-student",
      "ckr:material:CH06.P4:learning-budget-question",
      "ckr:material:CH07.P2:design-constraint-learning",
      "ckr:material:CH07.P4:portfolio-decision",
      "ckr:material:CH09.P4:closing-creative-purpose"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:ux",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "ux",
    "label": "사용자 경험 설계",
    "jobStatuses": [
      "employee",
      "freelancer",
      "student"
    ],
    "existingRouteRefs": [
      "investigate",
      "create",
      "experience"
    ],
    "testedInputText": "UX 기획",
    "observedFunction": "project_creation",
    "baseClassifierFunction": "project_creation",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "independent"
      },
      {
        "jobStatus": "student",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "project_creation",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "기획",
        "초안 검토"
      ],
      "outputTypes": [
        "기획안",
        "콘텐츠"
      ],
      "successMetrics": [
        "결과물 완성도"
      ],
      "stakeholders": [
        "협업팀",
        "의뢰인"
      ],
      "function": "project_creation",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "누가 어느 단계에서 무엇을 하려는지 관찰 질문을 정한다",
    "workflow": [
      "문제 가설",
      "사용 흐름",
      "작은 시안",
      "사용 확인",
      "수정"
    ],
    "outputs": "과제 흐름도·시제품·관찰 근거",
    "collaboration": "개발·디자인·사용자의 서로 다른 제약을 비교",
    "difficulty": "말로 좋다는 반응과 실제 과제 수행은 다르다",
    "comfortable": "실제 사용 상황을 볼 수 있고 문제 정의를 고칠 수 있는 팀",
    "uncomfortable": "버튼 색 변경을 모든 사용 문제의 해답으로 요구하는 팀",
    "learn": "관찰 질문·과제 설계·편향을 줄이는 기록",
    "validateResult": "도움 없이 목적을 달성한 단계와 멈춘 이유를 확인",
    "economic": "수정의 값은 화면 수보다 피할 수 있는 혼선과 검증 범위",
    "smallExperiment": "가상 예약 흐름에서 안내 없이 완료 가능한지 확인",
    "fictionalScene": "호감은 높지만 예약 날짜를 고르지 못하는 가상 시제품",
    "taskBasis": "repo:planning",
    "restrictions": "소수 관찰을 모든 사용자 성향으로 일반화하지 않음",
    "materialRefs": [
      "ckr:material:CH02.P3:execution-to-experiment",
      "ckr:material:CH03.P3:alternative-ux"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:video",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "video",
    "label": "영상·콘텐츠 편집",
    "jobStatuses": [
      "freelancer",
      "employee",
      "student"
    ],
    "existingRouteRefs": [
      "create",
      "experience",
      "review"
    ],
    "testedInputText": "영상 편집",
    "observedFunction": "unknown",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "freelancer",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "independent"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "employee"
      },
      {
        "jobStatus": "student",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "시안 제작",
        "수정"
      ],
      "outputTypes": [
        "작업물",
        "포트폴리오"
      ],
      "successMetrics": [
        "완성도",
        "재의뢰"
      ],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "independent"
    },
    "occupationIsAbilityProof": false,
    "task": "메시지·시청 맥락·원본 자료 상태를 구분한다",
    "workflow": [
      "소재 확인",
      "구성",
      "초벌 편집",
      "피드백",
      "색·음향",
      "출력"
    ],
    "outputs": "버전별 영상·자막·출력 규격표",
    "collaboration": "기획자·출연자·사운드 담당자와 장면 의도를 맞춤",
    "difficulty": "촬영 자료의 부족을 편집 기술만으로 모두 해결할 수 없다",
    "comfortable": "검토 시점을 나누고 메시지 변경을 새 범위로 인정하는 환경",
    "uncomfortable": "최종 단계에 이야기 전체를 바꾸면서 납기를 유지하라는 환경",
    "learn": "컷의 순서·음성 명료도·자막 가독성의 선택 비교",
    "validateResult": "소리 없이도 핵심이 전달되는지, 실제 출력 환경에서 검토",
    "economic": "촬영 재요청·자료 정리·렌더링·추가 버전의 시간을 구분",
    "smallExperiment": "같은 소재로 길이가 다른 두 영상을 구성해 차이를 설명",
    "fictionalScene": "행사용 긴 영상을 짧은 세로 광고로 바꾸라는 가상 요청",
    "taskBasis": "editorial:task",
    "restrictions": "영상이라는 단어는 일부 시각 연출만 보강하며 편집 세부 function은 unknown",
    "materialRefs": [
      "ckr:material:CH01.P3:iterate-selected-idea",
      "ckr:material:CH03.P1:output-audience",
      "ckr:material:CH03.P3:alternative-video",
      "ckr:material:CH08.P2:recognized-experience"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:translation",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "translation",
    "label": "전문 번역·언어 중개",
    "jobStatuses": [
      "freelancer",
      "employee"
    ],
    "existingRouteRefs": [
      "investigate",
      "review",
      "teach"
    ],
    "testedInputText": "번역가",
    "observedFunction": "language_mediation",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "freelancer",
        "baseFunction": "unknown",
        "effectiveFunction": "language_mediation",
        "workMode": "independent"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "language_mediation",
        "workMode": "employee"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [],
      "outputTypes": [],
      "successMetrics": [],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "independent"
    },
    "occupationIsAbilityProof": false,
    "task": "독자·전문 분야·용어 기준·사용 목적을 확인",
    "workflow": [
      "원문 이해",
      "용어 확인",
      "초벌",
      "대조",
      "독자 검수",
      "납품"
    ],
    "outputs": "번역문·용어표·불명확한 원문의 질의",
    "collaboration": "작성자와 이용자 사이에서 의미와 표현 제약을 중개",
    "difficulty": "매끄러운 문장도 핵심 조건을 바꾸면 좋은 번역이 아니다",
    "comfortable": "질문할 담당자와 용어 결정 기준이 있는 의뢰",
    "uncomfortable": "원문이 바뀌는데 최종 분량만으로 작업을 계산하는 의뢰",
    "learn": "병렬 문장 대조·용어 근거·분야별 문체",
    "validateResult": "핵심 조건과 숫자를 원문에 되짚어 오류를 확인",
    "economic": "문자 수 외 조사·질의·검수·변경된 원문의 재작업을 구분",
    "smallExperiment": "짧은 안내문을 다른 독자용으로 옮기고 선택 이유 설명",
    "fictionalScene": "약어가 다른 뜻으로 쓰인 두 문서를 통일해야 하는 가상 의뢰",
    "taskBasis": "repo:language",
    "restrictions": "language_mediation 장면 자료는 있지만 현재 문자열 번역가의 직접 분류는 unknown",
    "materialRefs": [
      "ckr:material:CH03.P3:alternative-translation",
      "ckr:material:CH08.P2:recognized-translation"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:teaching",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "teaching",
    "label": "교육·강의",
    "jobStatuses": [
      "employee",
      "freelancer",
      "self_employed"
    ],
    "existingRouteRefs": [
      "teach",
      "create",
      "experience"
    ],
    "testedInputText": "강사",
    "observedFunction": "teaching",
    "baseClassifierFunction": "teaching",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "teaching",
        "effectiveFunction": "teaching",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "teaching",
        "effectiveFunction": "teaching",
        "workMode": "independent"
      },
      {
        "jobStatus": "self_employed",
        "baseFunction": "teaching",
        "effectiveFunction": "teaching",
        "workMode": "independent_owner"
      }
    ],
    "observedContext": {
      "industry": "education",
      "roleFamily": "teaching",
      "customerFacing": true,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "설명",
        "이해 확인"
      ],
      "outputTypes": [
        "수업 자료",
        "피드백"
      ],
      "successMetrics": [
        "이해의 변화",
        "학습 지속"
      ],
      "stakeholders": [
        "학습자",
        "보호자"
      ],
      "function": "teaching",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "학습자가 지금 혼자 할 수 있는 것과 수업 목적을 묻는다",
    "workflow": [
      "선행 이해 확인",
      "설명",
      "연습",
      "오류 피드백",
      "다른 문제 적용"
    ],
    "outputs": "수업 자료·학습 과제·이해 확인 기록",
    "collaboration": "학습자·보호자·동료와 기대하는 변화를 구분",
    "difficulty": "수업 만족도와 혼자 풀 수 있는 실력은 다르다",
    "comfortable": "준비와 개별 피드백 시간을 인정하는 교육 환경",
    "uncomfortable": "수업 시간만 계산하면서 상시 상담을 당연시하는 환경",
    "learn": "오개념 분류·설명 대안·평가 과제 설계",
    "validateResult": "익숙한 예제 밖에서도 원리를 설명할 수 있는지 확인",
    "economic": "준비·채점·질문 응대가 강의 시간 밖의 비용",
    "smallExperiment": "같은 개념을 두 방식으로 설명하고 다른 문제를 제시",
    "fictionalScene": "설명을 따라 했지만 조건을 바꾸자 막힌 가상 학습자",
    "taskBasis": "onet:instruction",
    "restrictions": "자격 요건·과목·실제 학습자 나이는 입력 없이 확정하지 않음",
    "materialRefs": [
      "ckr:material:CH01.P1:people-entry",
      "ckr:material:CH02.P1:explain-to-use",
      "ckr:material:CH02.P3:analysis-to-teaching",
      "ckr:material:CH03.P1:help-task-scope",
      "ckr:material:CH03.P2:route-teach-instruction",
      "ckr:material:CH03.P4:care-always-on",
      "ckr:material:CH04.P2:instruction-role",
      "ckr:material:CH05.P3:grow-teaching-transfer",
      "ckr:material:CH06.P2:learning-investment-value",
      "ckr:material:CH07.P1:learn-by-explain",
      "ckr:material:CH07.P3:social-solo-gap",
      "ckr:material:CH08.P3:career-help-overload",
      "ckr:material:CH09.P2:guard-help-responsibility",
      "ckr:material:CH09.P4:closing-help-sustainable"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:care",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "care",
    "label": "의료·돌봄 지원",
    "jobStatuses": [
      "employee"
    ],
    "existingRouteRefs": [
      "teach",
      "review",
      "manage"
    ],
    "testedInputText": "간호사",
    "observedFunction": "care_operations",
    "baseClassifierFunction": "care_operations",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "care_operations",
        "effectiveFunction": "care_operations",
        "workMode": "employee"
      }
    ],
    "observedContext": {
      "industry": "healthcare",
      "roleFamily": "care_operations",
      "customerFacing": true,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "high",
      "ruleIntensity": "high",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "high",
      "keyWorkModes": [
        "상태 확인",
        "인계"
      ],
      "outputTypes": [
        "인계 기록",
        "처치 확인"
      ],
      "successMetrics": [
        "안전",
        "누락 없는 인계"
      ],
      "stakeholders": [
        "환자",
        "보호자",
        "다음 근무자"
      ],
      "function": "care_operations",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "직무 권한과 안전 절차, 인계할 관찰 정보를 확인",
    "workflow": [
      "상태 확인",
      "정해진 지원",
      "변화 기록",
      "담당자 전달",
      "인계"
    ],
    "outputs": "허용된 범위의 관찰·인계 기록",
    "collaboration": "대상자·보호자·다음 담당자에게 사실과 추정을 구분해 전달",
    "difficulty": "친절과 의료 판단 권한은 별개다",
    "comfortable": "확인 절차와 인계·휴식 시간을 실제 보장하는 환경",
    "uncomfortable": "안전 확인을 속도 문제로 취급하고 개인 희생으로 메우는 환경",
    "learn": "허용된 업무 절차·사례 기록·정확한 보고",
    "validateResult": "누락 없는 전달과 확인 경로로 평가하며 치료 결과를 약속하지 않음",
    "economic": "인력·대기·응대 부담은 개인 성향만으로 해결할 문제가 아니다",
    "smallExperiment": "익명 가상 인계에서 관찰과 해석을 나누기",
    "fictionalScene": "기록과 대상자의 설명이 달라 재확인하는 가상 인계",
    "taskBasis": "onet:nurse",
    "restrictions": "건강 예측·진단·치료 조언 및 자격 없는 업무 추천 금지",
    "materialRefs": [
      "ckr:material:CH01.P2:source-help-boundary",
      "ckr:material:CH03.P1:help-task-scope",
      "ckr:material:CH04.P1:handoff-observation",
      "ckr:material:CH05.P2:current-care-record"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:counsel_support",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "counsel_support",
    "label": "상담·지원 업무",
    "jobStatuses": [
      "employee",
      "freelancer"
    ],
    "existingRouteRefs": [
      "teach",
      "experience",
      "investigate"
    ],
    "testedInputText": "상담 지원",
    "observedFunction": "unknown",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "independent"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [],
      "outputTypes": [],
      "successMetrics": [],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "요청한 도움과 제공 가능한 지원 범위를 먼저 묻는다",
    "workflow": [
      "경청",
      "요청 명료화",
      "지원 가능 범위",
      "관련 기관 연결",
      "종결 확인"
    ],
    "outputs": "동의된 지원 계획·연결 정보",
    "collaboration": "상대의 선택권을 남기며 전문 기관과 범위를 나눔",
    "difficulty": "잘 공감하는 것과 전문 치료를 할 수 있는 것은 다르다",
    "comfortable": "비밀보호·슈퍼비전·역할 경계가 명확한 환경",
    "uncomfortable": "모든 어려움을 한 담당자가 해결하도록 맡기는 환경",
    "learn": "질문·기록·경계·적절한 의뢰 절차",
    "validateResult": "상대가 원하는 도움과 실제 연결이 맞는지 확인",
    "economic": "사례 준비·후속 연락·회복 시간을 업무 범위에 포함",
    "smallExperiment": "가상 요청에서 정보 제공과 전문 의뢰를 구분",
    "fictionalScene": "생활 정보 요청이 심리 치료 기대와 섞인 가상 상황",
    "taskBasis": "editorial:task",
    "restrictions": "자격·진단 권한·상대의 유형을 추정하지 않음",
    "materialRefs": [
      "ckr:material:CH01.P4:mission-with-basics",
      "ckr:material:CH03.P1:help-task-scope",
      "ckr:material:CH03.P4:care-always-on",
      "ckr:material:CH04.P4:culture-recovery",
      "ckr:material:CH06.P3:help-hidden-cost"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:administration",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "administration",
    "label": "행정·공공 사무",
    "jobStatuses": [
      "employee"
    ],
    "existingRouteRefs": [
      "manage",
      "review",
      "teach"
    ],
    "testedInputText": "행정",
    "observedFunction": "administration",
    "baseClassifierFunction": "administration",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "administration",
        "effectiveFunction": "administration",
        "workMode": "employee"
      }
    ],
    "observedContext": {
      "industry": "public_service",
      "roleFamily": "administration",
      "customerFacing": true,
      "analysisIntensity": "high",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "high",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "low",
      "keyWorkModes": [
        "일정 조율",
        "서류 확인"
      ],
      "outputTypes": [
        "처리 기록",
        "안내 자료"
      ],
      "successMetrics": [
        "정확한 안내",
        "누락 예방"
      ],
      "stakeholders": [
        "이용자",
        "담당 부서"
      ],
      "function": "administration",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "신청 목적과 필요한 증빙, 처리 권한을 나눈다",
    "workflow": [
      "접수",
      "요건 확인",
      "보완 안내",
      "결정 담당 전달",
      "처리 기록"
    ],
    "outputs": "처리 근거·보완 안내·일정 기록",
    "collaboration": "이용자와 담당 부서의 언어 차이를 줄임",
    "difficulty": "빠른 안내가 처리 가능성의 보장이 되어서는 안 된다",
    "comfortable": "예외 질의 경로와 변경된 기준을 확인할 수 있는 곳",
    "uncomfortable": "지침을 공개하지 않고 담당자의 암묵적 기억에만 의존하는 곳",
    "learn": "기준 대조·문서 작성·쉬운 안내",
    "validateResult": "다른 담당자도 같은 근거로 처리할 수 있는지 확인",
    "economic": "누락 보완과 반복 문의를 줄인 시간의 가치를 설명",
    "smallExperiment": "가상 신청서의 누락을 찾아 필요한 보완만 안내",
    "fictionalScene": "사용자가 서류를 냈지만 제출 목적과 다른 양식을 고른 가상 접수",
    "taskBasis": "repo:administration",
    "restrictions": "공무원 신분·법률 자문 권한을 단정하지 않음",
    "materialRefs": [
      "ckr:material:CH01.P1:request-framing",
      "ckr:material:CH02.P3:care-to-process",
      "ckr:material:CH03.P2:route-manage-admin",
      "ckr:material:CH03.P3:alternative-support",
      "ckr:material:CH04.P3:silent-disagreement",
      "ckr:material:CH04.P4:culture-exception-path",
      "ckr:material:CH07.P1:structured-practice",
      "ckr:material:CH08.P2:recognized-enablement"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:sales",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "sales",
    "label": "영업·고객 제안",
    "jobStatuses": [
      "employee",
      "freelancer"
    ],
    "existingRouteRefs": [
      "market",
      "experience",
      "lead"
    ],
    "testedInputText": "영업기획",
    "observedFunction": "sales_operations",
    "baseClassifierFunction": "sales_operations",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "sales_operations",
        "effectiveFunction": "sales_operations",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "sales_operations",
        "effectiveFunction": "sales_operations",
        "workMode": "independent"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "sales_operations",
      "customerFacing": true,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "high",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "기획",
        "초안 검토",
        "제안",
        "협상",
        "후속 관리"
      ],
      "outputTypes": [
        "기획안",
        "콘텐츠",
        "제안서",
        "계약",
        "영업 보고서"
      ],
      "successMetrics": [
        "결과물 완성도",
        "계약 전환",
        "회수 일정"
      ],
      "stakeholders": [
        "협업팀",
        "의뢰인",
        "고객",
        "영업팀"
      ],
      "function": "sales_operations",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "실제 사용 문제·예산 검토·결정 시점·제공 가능성을 나눈다",
    "workflow": [
      "요청 확인",
      "제안",
      "내부 제공 범위 확인",
      "결정 조건",
      "인계"
    ],
    "outputs": "조건이 명확한 제안과 내부 인계",
    "collaboration": "고객의 기대와 제공 팀의 현실을 같은 문서로 맞춤",
    "difficulty": "긍정적 반응과 구매 승인, 실제 도입은 서로 다르다",
    "comfortable": "과장 없이 조건을 조정하고 미확인 내용을 되물을 수 있는 환경",
    "uncomfortable": "지킬 수 없는 기능을 먼저 팔라고 압박하는 환경",
    "learn": "질의·대안 제시·도입 조건 확인",
    "validateResult": "제안이 어떤 판단을 도왔고 어떤 조건에서 멈췄는지 기록",
    "economic": "접촉량 외 사전 조사·도입 지원·미성사 제안 시간을 검토",
    "smallExperiment": "가상 고객 질문에 두 제공안을 비교",
    "fictionalScene": "호감은 높지만 내부 승인자가 정해지지 않은 가상 거래",
    "taskBasis": "repo:sales",
    "restrictions": "실제 실적·고객 수·계약 가능성 단정 금지",
    "materialRefs": [
      "ckr:material:CH01.P4:change-with-baseline",
      "ckr:material:CH02.P2:opportunity-distinct",
      "ckr:material:CH03.P2:route-market-sales",
      "ckr:material:CH04.P3:invisible-change"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:marketing",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "marketing",
    "label": "마케팅·캠페인 기획",
    "jobStatuses": [
      "employee",
      "freelancer",
      "student"
    ],
    "existingRouteRefs": [
      "create",
      "market",
      "investigate"
    ],
    "testedInputText": "마케팅 기획",
    "observedFunction": "project_creation",
    "baseClassifierFunction": "project_creation",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "independent"
      },
      {
        "jobStatus": "student",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "project_creation",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "기획",
        "초안 검토"
      ],
      "outputTypes": [
        "기획안",
        "콘텐츠"
      ],
      "successMetrics": [
        "결과물 완성도"
      ],
      "stakeholders": [
        "협업팀",
        "의뢰인"
      ],
      "function": "project_creation",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "대상·메시지·확인할 반응을 따로 정의",
    "workflow": [
      "목적",
      "대상 가설",
      "표현안",
      "작은 노출",
      "반응 검토"
    ],
    "outputs": "메시지 가설·실험 계획·결과 해석",
    "collaboration": "제작·영업·운영에 전달할 약속을 맞춤",
    "difficulty": "조회·관심·문의·실제 구매를 같은 성과로 보지 않음",
    "comfortable": "실패한 가설도 비교해 다음 선택을 바꿀 수 있는 팀",
    "uncomfortable": "목표 없이 좋아요만 올리면서 매출 책임을 묻는 팀",
    "learn": "실험 설계·반응 분류·정보 전달",
    "validateResult": "대상과 조건을 바꾼 영향과 다른 요인을 구분",
    "economic": "노출 비용뿐 아니라 제작·응대·사용 후 지원의 부담",
    "smallExperiment": "같은 상품의 다른 메시지 두 개를 목표에 맞춰 비교",
    "fictionalScene": "조회는 높지만 사용 목적 문의가 반복된 가상 캠페인",
    "taskBasis": "editorial:task",
    "restrictions": "광고 수익 예측이나 현재 광고 집행 권고가 아님",
    "materialRefs": [
      "ckr:material:CH03.P4:purpose-mismatch",
      "ckr:material:CH06.P1:opportunity-to-demand",
      "ckr:material:CH06.P3:many-opportunities-cost"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:cafe",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "cafe",
    "label": "카페·소상공인 운영",
    "jobStatuses": [
      "self_employed",
      "business_owner",
      "employee"
    ],
    "existingRouteRefs": [
      "manage",
      "experience",
      "market"
    ],
    "testedInputText": "카페 운영",
    "observedFunction": "customer_service",
    "baseClassifierFunction": "customer_service",
    "observedVariants": [
      {
        "jobStatus": "self_employed",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "independent_owner"
      },
      {
        "jobStatus": "business_owner",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "owner"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "employee"
      }
    ],
    "observedContext": {
      "industry": "local_service",
      "roleFamily": "customer_service",
      "customerFacing": true,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "medium",
      "operationsIntensity": "high",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "high",
      "keyWorkModes": [
        "응대",
        "예약·주문 관리"
      ],
      "outputTypes": [
        "고객 경험",
        "완성 서비스"
      ],
      "successMetrics": [
        "재방문",
        "고객 만족",
        "원가"
      ],
      "stakeholders": [
        "단골",
        "신규 고객"
      ],
      "function": "customer_service",
      "seniority": "unspecified",
      "workMode": "self_employed"
    },
    "occupationIsAbilityProof": false,
    "task": "상품·고객 시간대·준비·폐기·응대의 흐름을 나눈다",
    "workflow": [
      "준비",
      "주문",
      "제공",
      "대기 확인",
      "정리",
      "다음 준비 조정"
    ],
    "outputs": "상품 품질·대기 흐름·준비량 점검",
    "collaboration": "고객 약속과 같이 일하는 사람의 실제 처리량을 맞춤",
    "difficulty": "매출이 늘어도 폐기와 마감 시간이 함께 늘면 여유는 다르다",
    "comfortable": "품질·원가·체력을 함께 조정할 수 있는 운영",
    "uncomfortable": "손님 수만 늘리고 준비·청소 시간을 보지 않는 운영",
    "learn": "작업 동선·품질 확인·반복 준비의 비교",
    "validateResult": "바쁜 시간에도 지킬 품질과 다시 찾는 이유를 분리해 검토",
    "economic": "재료·폐기·고정 비용·준비와 마감 투입의 차이",
    "smallExperiment": "가상 메뉴 하나의 준비부터 정리까지 단계별 기록",
    "fictionalScene": "인기 메뉴가 늘어 전체 주문 대기가 길어진 가상 가게",
    "taskBasis": "onet:food",
    "restrictions": "매출·직원 고용·건강 상태·이미 있는 단골을 추정하지 않음",
    "materialRefs": [
      "ckr:material:CH01.P1:capacity-entry",
      "ckr:material:CH03.P1:repeat-vs-search",
      "ckr:material:CH04.P4:culture-frontline-voice",
      "ckr:material:CH05.P1:status-self-employed",
      "ckr:material:CH05.P2:current-cafe-flow",
      "ckr:material:CH05.P4:next-cafe-test",
      "ckr:material:CH06.P2:cafe-unit-value",
      "ckr:material:CH06.P4:fixed-variable-time",
      "ckr:material:CH08.P1:resource-foundation-positive",
      "ckr:material:CH08.P4:positive-to-repeat-system",
      "ckr:material:CH09.P1:choose-repeat-burden",
      "ckr:material:CH09.P3:strategy-cafe-cycle"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:small_business",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "small_business",
    "label": "소규모 사업 운영",
    "jobStatuses": [
      "business_owner"
    ],
    "existingRouteRefs": [
      "lead",
      "manage",
      "market"
    ],
    "testedInputText": "사업 대표",
    "observedFunction": "business_operations",
    "baseClassifierFunction": "business_operations",
    "observedVariants": [
      {
        "jobStatus": "business_owner",
        "baseFunction": "business_operations",
        "effectiveFunction": "business_operations",
        "workMode": "owner"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "business_operations",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "high",
      "operationsIntensity": "high",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "high",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "상품 설계",
        "고객 획득",
        "운영 조율"
      ],
      "outputTypes": [
        "상품",
        "사업계획"
      ],
      "successMetrics": [
        "현금흐름",
        "재구매",
        "수익성"
      ],
      "stakeholders": [
        "고객",
        "팀",
        "파트너"
      ],
      "function": "business_operations",
      "seniority": "owner",
      "workMode": "owner"
    },
    "occupationIsAbilityProof": false,
    "task": "고객에게 약속할 결과와 담당자가 정할 방법을 분리",
    "workflow": [
      "상품 약속",
      "역할 분배",
      "자원 계획",
      "중간 확인",
      "고객 결과"
    ],
    "outputs": "위임 기준·상품 범위·운영 판단표",
    "collaboration": "제공 담당·고객·파트너의 결정 경계를 맞춤",
    "difficulty": "대표가 직접 잘하는 방식이 다른 사람도 재현할 방식은 아니다",
    "comfortable": "담당자의 판단 범위와 질문 통로가 있는 조직",
    "uncomfortable": "이름만 위임하고 모든 변경 결정을 대표가 다시 가져오는 조직",
    "learn": "수행과 관리의 차이·업무 설명·결정 권한",
    "validateResult": "대표가 개입하지 않은 작은 과제에서 약속한 결과가 이어지는지",
    "economic": "매출 외 회수 시점·운영 지출·인력 투입·미확정 주문 구분",
    "smallExperiment": "반복 과제 하나의 결과 기준과 질의 지점을 작성",
    "fictionalScene": "담당자가 모두 대표의 답을 기다리는 가상 하루",
    "taskBasis": "onet:management",
    "restrictions": "직원 수·현재 이익·법적 사업자 지위를 만들지 않음",
    "materialRefs": [
      "ckr:material:CH01.P2:source-resource-link",
      "ckr:material:CH02.P2:coordination-distinct",
      "ckr:material:CH02.P4:two-skill-complement",
      "ckr:material:CH03.P3:alternative-operations",
      "ckr:material:CH04.P2:decision-owner",
      "ckr:material:CH04.P3:take-back-work",
      "ckr:material:CH05.P1:status-owner",
      "ckr:material:CH05.P3:grow-owner-question",
      "ckr:material:CH06.P2:business-repeat-value",
      "ckr:material:CH09.P2:guard-drive-review"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:retail",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "retail",
    "label": "판매·매장 운영",
    "jobStatuses": [
      "employee",
      "self_employed"
    ],
    "existingRouteRefs": [
      "experience",
      "manage",
      "market"
    ],
    "testedInputText": "매장 운영",
    "observedFunction": "customer_service",
    "baseClassifierFunction": "customer_service",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "employee"
      },
      {
        "jobStatus": "self_employed",
        "baseFunction": "customer_service",
        "effectiveFunction": "retail_operations",
        "workMode": "independent_owner"
      }
    ],
    "observedContext": {
      "industry": "local_service",
      "roleFamily": "customer_service",
      "customerFacing": true,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "medium",
      "operationsIntensity": "high",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "high",
      "keyWorkModes": [
        "응대",
        "예약·주문 관리"
      ],
      "outputTypes": [
        "고객 경험",
        "완성 서비스"
      ],
      "successMetrics": [
        "재방문",
        "고객 만족",
        "원가"
      ],
      "stakeholders": [
        "단골",
        "신규 고객"
      ],
      "function": "customer_service",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "재고·고객 요청·진열·주문 이후의 약속을 구분",
    "workflow": [
      "입고 확인",
      "진열",
      "요구 확인",
      "판매 안내",
      "재고와 반품 기록"
    ],
    "outputs": "일관된 안내·재고 기록·진열 개선안",
    "collaboration": "고객과 재고·물류 담당자에게 실제 가능한 약속 전달",
    "difficulty": "많이 들여놓는 것이 선택의 편리함과 같지는 않다",
    "comfortable": "재고 상태와 고객 질문을 다음 운영에 반영하는 곳",
    "uncomfortable": "실제 재고 확인 없이 당일 제공을 약속하게 하는 곳",
    "learn": "상품 비교 설명·재고 기록·서비스 범위",
    "validateResult": "다른 담당자도 같은 조건으로 안내하는지",
    "economic": "묶여 있는 재고 자원·폐기·반품 대응·정리 시간을 구분",
    "smallExperiment": "가상 고객의 사용 목적에 맞는 상품 두 개 비교",
    "fictionalScene": "진열된 상품은 많지만 필요한 규격은 없는 가상 매장",
    "taskBasis": "repo:retail",
    "restrictions": "retail_operations 장면과 현재 customer_service 분류를 혼동하지 않음",
    "materialRefs": [
      "ckr:material:CH03.P1:repeat-vs-search",
      "ckr:material:CH03.P3:alternative-retail",
      "ckr:material:CH04.P4:culture-frontline-voice"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:logistics",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "logistics",
    "label": "생산·물류·현장",
    "jobStatuses": [
      "employee"
    ],
    "existingRouteRefs": [
      "manage",
      "review",
      "lead"
    ],
    "testedInputText": "현장 물류",
    "observedFunction": "field_operations",
    "baseClassifierFunction": "field_operations",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "field_operations",
        "effectiveFunction": "field_operations",
        "workMode": "employee"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "field_operations",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "high",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "high",
      "keyWorkModes": [
        "작업 순서 조정",
        "이상 확인"
      ],
      "outputTypes": [
        "작업 기록",
        "인수인계"
      ],
      "successMetrics": [
        "안전",
        "납기",
        "재작업 감소"
      ],
      "stakeholders": [
        "현장 작업자",
        "다음 공정"
      ],
      "function": "field_operations",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "앞뒤 공정과 안전 기준, 실제 지연 지점을 확인",
    "workflow": [
      "시작 상태",
      "순서 조정",
      "이상 확인",
      "담당 전달",
      "인수인계"
    ],
    "outputs": "작업 기록·이상 전달·다음 공정 인계",
    "collaboration": "앞 공정과 다음 작업자의 조건을 함께 조율",
    "difficulty": "납기를 앞당기려고 확인을 생략하면 다음 공정 재작업이 될 수 있다",
    "comfortable": "안전·품질과 납기를 함께 판단하는 현장",
    "uncomfortable": "개인 속도만 평가하면서 공정 지연을 개인 탓으로 돌리는 곳",
    "learn": "이상 사례·표준 순서·예외 보고",
    "validateResult": "다음 작업자가 다시 확인할 부분이 줄었는지",
    "economic": "대기·재처리·재고 유지·안전 확인의 투입을 구분",
    "smallExperiment": "가상 지연 사례에서 원인과 전달 대상을 분리",
    "fictionalScene": "앞 공정의 작은 오차가 포장 때 발견된 가상 상황",
    "taskBasis": "repo:field",
    "restrictions": "사고 예측·안전 절차 생략·설비 조작 지시 금지",
    "materialRefs": [
      "ckr:material:CH01.P3:handoff-finish",
      "ckr:material:CH02.P1:reliable-execution",
      "ckr:material:CH03.P3:alternative-field",
      "ckr:material:CH03.P4:false-speed",
      "ckr:material:CH04.P2:operations-bridge",
      "ckr:material:CH07.P2:field-anomaly-learning",
      "ckr:material:CH07.P4:skill-repeatability"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:research",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "research",
    "label": "전문 연구·분석",
    "jobStatuses": [
      "employee",
      "student"
    ],
    "existingRouteRefs": [
      "investigate",
      "review"
    ],
    "testedInputText": "연구원",
    "observedFunction": "unknown",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "employee"
      },
      {
        "jobStatus": "student",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [],
      "outputTypes": [],
      "successMetrics": [],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "검증할 질문과 반증할 조건을 먼저 정한다",
    "workflow": [
      "질문",
      "자료 수집",
      "가정 분리",
      "대안 비교",
      "한계 보고"
    ],
    "outputs": "근거표·분석 결과·한계와 다음 질문",
    "collaboration": "연구 의뢰자와 자료 제공자의 다른 기대 조율",
    "difficulty": "분석이 길어졌다는 사실이 결론의 신뢰를 보장하지 않는다",
    "comfortable": "맞지 않는 결과도 보고하고 질문을 바꿀 수 있는 곳",
    "uncomfortable": "원하는 결론을 먼저 정하고 반례를 제외하는 곳",
    "learn": "자료 품질·추론 범위·재현 절차",
    "validateResult": "다른 사람이 같은 자료로 판단 과정을 따라갈 수 있는지",
    "economic": "조사 범위와 의사결정에 필요한 확실성 수준의 균형",
    "smallExperiment": "가상 자료에서 같은 결과를 설명하는 가설 두 개 비교",
    "fictionalScene": "상관은 보이지만 원인이 확인되지 않은 가상 분석",
    "taskBasis": "editorial:task",
    "restrictions": "분석 대상 분야의 전문 자격과 실제 연구 실적은 미확인",
    "materialRefs": [
      "ckr:material:CH01.P1:hypothesis-first",
      "ckr:material:CH01.P3:timeboxed-inquiry",
      "ckr:material:CH02.P1:causal-model",
      "ckr:material:CH03.P1:investigation-object",
      "ckr:material:CH04.P2:independent-contributor",
      "ckr:material:CH04.P4:culture-evidence-decision",
      "ckr:material:CH06.P1:expertise-value",
      "ckr:material:CH07.P1:concept-structure",
      "ckr:material:CH07.P3:perfection-start",
      "ckr:material:CH08.P1:cheoneul-help-network",
      "ckr:material:CH08.P1:taegeuk-understanding",
      "ckr:material:CH08.P3:career-depth-without-use",
      "ckr:material:CH08.P3:career-boundary-isolation",
      "ckr:material:CH08.P4:positive-conditions-to-proof",
      "ckr:material:CH08.P4:positive-to-learning-humility",
      "ckr:material:CH09.P2:guard-depth-delay",
      "ckr:material:CH09.P2:guard-boundary-isolation",
      "ckr:material:CH09.P4:closing-depth-use"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:project_planning",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "project_planning",
    "label": "기획·전략",
    "jobStatuses": [
      "employee",
      "freelancer"
    ],
    "existingRouteRefs": [
      "investigate",
      "lead",
      "create"
    ],
    "testedInputText": "기획",
    "observedFunction": "project_creation",
    "baseClassifierFunction": "project_creation",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "project_creation",
        "effectiveFunction": "project_creation",
        "workMode": "independent"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "project_creation",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "기획",
        "초안 검토"
      ],
      "outputTypes": [
        "기획안",
        "콘텐츠"
      ],
      "successMetrics": [
        "결과물 완성도"
      ],
      "stakeholders": [
        "협업팀",
        "의뢰인"
      ],
      "function": "project_creation",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "목표·해결할 문제·실행 제약을 서로 나눈다",
    "workflow": [
      "문제 정의",
      "선택지",
      "검증 조건",
      "실행 범위",
      "결과 회수"
    ],
    "outputs": "선택 이유가 보이는 기획안과 우선순위",
    "collaboration": "실행 부서가 실제 할 수 있는 조건과 목표를 연결",
    "difficulty": "큰 방향이 좋아도 가까운 실행을 설명하지 못하면 전달이 멈춘다",
    "comfortable": "가정과 검증 시점을 수정할 수 있는 팀",
    "uncomfortable": "자료의 장수만으로 준비를 평가하는 팀",
    "learn": "가설·범위·선택 비용·의사결정 기록",
    "validateResult": "사용할 결정과 바뀐 행동으로 기획의 쓸모를 확인",
    "economic": "여러 선택 가운데 포기할 활동과 검증 투입을 비교",
    "smallExperiment": "가상 제안 세 개에서 같은 목표로 하나를 고른 이유 기록",
    "fictionalScene": "모두 좋은 의견이지만 이번에 끝낼 과제가 없는 가상 회의",
    "taskBasis": "onet:management",
    "restrictions": "기획이라는 문자열만으로 전략 권한이나 리더 직책을 부여하지 않음",
    "materialRefs": [
      "ckr:material:CH02.P3:meaning-to-proposal",
      "ckr:material:CH02.P4:value-trace",
      "ckr:material:CH03.P2:route-lead-project",
      "ckr:material:CH03.P3:alternative-business-analysis",
      "ckr:material:CH04.P1:parallel-constraints",
      "ckr:material:CH06.P3:fast-commitment",
      "ckr:material:CH08.P1:jangseong-responsibility",
      "ckr:material:CH08.P2:recognized-clarity",
      "ckr:material:CH08.P4:positive-to-shared-decision"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:accounting",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "accounting",
    "label": "회계·증빙 검토",
    "jobStatuses": [
      "employee",
      "freelancer"
    ],
    "existingRouteRefs": [
      "review",
      "manage"
    ],
    "testedInputText": "회계",
    "observedFunction": "finance_planning",
    "baseClassifierFunction": "finance_planning",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "finance_planning",
        "effectiveFunction": "finance_planning",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "finance_planning",
        "effectiveFunction": "finance_planning",
        "workMode": "independent"
      }
    ],
    "observedContext": {
      "industry": "professional_services",
      "roleFamily": "finance_planning",
      "customerFacing": null,
      "analysisIntensity": "high",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "medium",
      "ruleIntensity": "high",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "low",
      "keyWorkModes": [
        "예산 편성",
        "실적과 계획 비교",
        "투자안 검토"
      ],
      "outputTypes": [
        "손익 전망",
        "경영진 보고"
      ],
      "successMetrics": [
        "예측 정확도",
        "비용 구조 개선"
      ],
      "stakeholders": [
        "부서 담당자",
        "경영진"
      ],
      "function": "finance_planning",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "거래 내용·기간·증빙과 적용 기준을 나눈다",
    "workflow": [
      "자료 접수",
      "누락 확인",
      "증빙 대조",
      "질의",
      "검토 기록"
    ],
    "outputs": "출처를 되짚을 수 있는 검토표",
    "collaboration": "자료 제공자와 검토 책임자의 확인 범위를 분리",
    "difficulty": "합계가 맞아도 분류나 증빙이 다를 수 있다",
    "comfortable": "판단의 근거와 추가 질의 시간을 보장하는 환경",
    "uncomfortable": "누락을 덮고 마감만 맞추라는 환경",
    "learn": "기준 대조·검토 흔적·오류 유형화",
    "validateResult": "다른 검토자가 근거를 찾을 수 있는지",
    "economic": "검토 범위·자료 정리 상태·추가 질의의 투입 차이",
    "smallExperiment": "가상 거래 세 건의 근거와 불명확 항목을 나누기",
    "fictionalScene": "총액은 같지만 두 기간에 중복된 가상 자료",
    "taskBasis": "repo:finance",
    "restrictions": "법률·세무 결론 제공이 아닌 검토 기능 연구이며 자격은 별도 확인",
    "materialRefs": [
      "ckr:material:CH01.P4:permission-to-correct",
      "ckr:material:CH02.P1:detect-mismatch",
      "ckr:material:CH02.P4:criterion-before-practice",
      "ckr:material:CH03.P1:task-not-title",
      "ckr:material:CH04.P3:sharp-correction-cost",
      "ckr:material:CH07.P4:certificate-requirement",
      "ckr:material:CH08.P2:recognized-prevention",
      "ckr:material:CH08.P3:career-precision-lock",
      "ckr:material:CH09.P1:choose-task-rights",
      "ckr:material:CH09.P2:guard-precision-loop",
      "ckr:material:CH09.P4:closing-precision-value"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:customer_support",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "customer_support",
    "label": "고객 지원·서비스",
    "jobStatuses": [
      "employee",
      "freelancer"
    ],
    "existingRouteRefs": [
      "experience",
      "teach",
      "manage"
    ],
    "testedInputText": "서비스",
    "observedFunction": "unknown",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "independent"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "unknown",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [],
      "outputTypes": [],
      "successMetrics": [],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "employee"
    },
    "occupationIsAbilityProof": false,
    "task": "고객이 하려는 일과 이미 시도한 방법을 나눈다",
    "workflow": [
      "요청 확인",
      "재현 또는 조회",
      "안내",
      "담당 연결",
      "종결 확인"
    ],
    "outputs": "해결 안내·문제 분류·인계 정보",
    "collaboration": "고객과 제공 부서가 같은 문제를 이해하도록 연결",
    "difficulty": "빠른 답변과 문제 해결은 서로 다른 성과다",
    "comfortable": "반복 문의의 원인을 바꿀 통로가 있는 곳",
    "uncomfortable": "답변 수만 평가하며 해결 권한은 없는 곳",
    "learn": "질문·쉬운 설명·예외 전달·지원 범위",
    "validateResult": "안내 뒤 고객이 다음 행동을 할 수 있는지",
    "economic": "응대량 외 미해결 재문의·대기·인계 시간을 검토",
    "smallExperiment": "가상 문의의 감정과 해결할 요청을 구분",
    "fictionalScene": "같은 설명을 세 번 들었지만 신청을 못 한 가상 고객",
    "taskBasis": "editorial:task",
    "restrictions": "현재 고객 민원이나 개인의 감정 노동 이력을 추정하지 않음",
    "materialRefs": [
      "ckr:material:CH01.P3:feedback-loop-entry",
      "ckr:material:CH02.P2:care-distinct",
      "ckr:material:CH03.P2:route-experience-service",
      "ckr:material:CH06.P1:service-value",
      "ckr:material:CH09.P4:closing-help-sustainable"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:writing",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "writing",
    "label": "글·정보 콘텐츠",
    "jobStatuses": [
      "freelancer",
      "employee",
      "student"
    ],
    "existingRouteRefs": [
      "create",
      "investigate",
      "teach"
    ],
    "testedInputText": "작가",
    "observedFunction": "unknown",
    "baseClassifierFunction": "unknown",
    "observedVariants": [
      {
        "jobStatus": "freelancer",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "independent"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "employee"
      },
      {
        "jobStatus": "student",
        "baseFunction": "unknown",
        "effectiveFunction": "unknown",
        "workMode": "student"
      }
    ],
    "observedContext": {
      "industry": "unknown",
      "roleFamily": "unknown",
      "customerFacing": null,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "unknown",
      "operationsIntensity": "unknown",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "unknown",
      "keyWorkModes": [
        "시안 제작",
        "수정"
      ],
      "outputTypes": [
        "작업물",
        "포트폴리오"
      ],
      "successMetrics": [
        "완성도",
        "재의뢰"
      ],
      "stakeholders": [],
      "function": "unknown",
      "seniority": "unspecified",
      "workMode": "independent"
    },
    "occupationIsAbilityProof": false,
    "task": "독자가 해결할 질문과 확인 가능한 자료를 나눈다",
    "workflow": [
      "질문",
      "취재 또는 자료 확인",
      "구성",
      "초고",
      "검증",
      "편집"
    ],
    "outputs": "독자 질문에 답하는 글·출처·편집 기준",
    "collaboration": "자료 제공자와 편집자의 뜻을 바꾸지 않고 독자에게 전달",
    "difficulty": "문장이 매끄러워도 근거 없는 내용이 정확해지지는 않는다",
    "comfortable": "검증과 편집 시간을 구분해 주는 환경",
    "uncomfortable": "조회만을 위해 과장된 결론을 요구하는 환경",
    "learn": "자료 대조·구성·퇴고·용어 설명",
    "validateResult": "처음 보는 독자가 주장과 근거를 구분하는지",
    "economic": "조사·자료 사용 허가·수정과 매체 변경의 투입",
    "smallExperiment": "가상 설명문에서 사실·의견·예시를 표시",
    "fictionalScene": "인터뷰 인용과 편집자의 추론이 섞인 가상 초고",
    "taskBasis": "editorial:task",
    "restrictions": "작가가 visual 보강에 걸려도 실제 function unknown이며 경력 생성 금지",
    "materialRefs": [
      "ckr:material:CH01.P2:source-expression-link",
      "ckr:material:CH01.P4:protected-depth-window",
      "ckr:material:CH03.P1:output-audience",
      "ckr:material:CH07.P1:story-to-rule",
      "ckr:material:CH07.P3:collecting-not-learning",
      "ckr:material:CH08.P1:siksang-output-potential"
    ],
    "adapterImplemented": false
  },
  {
    "id": "ckr:job:hands_on_service",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "key": "hands_on_service",
    "label": "미용·공방 등 손기술 서비스",
    "jobStatuses": [
      "self_employed",
      "employee",
      "freelancer"
    ],
    "existingRouteRefs": [
      "experience",
      "create",
      "review"
    ],
    "testedInputText": "미용",
    "observedFunction": "customer_service",
    "baseClassifierFunction": "customer_service",
    "observedVariants": [
      {
        "jobStatus": "self_employed",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "independent_owner"
      },
      {
        "jobStatus": "employee",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "employee"
      },
      {
        "jobStatus": "freelancer",
        "baseFunction": "customer_service",
        "effectiveFunction": "customer_service",
        "workMode": "independent"
      }
    ],
    "observedContext": {
      "industry": "local_service",
      "roleFamily": "customer_service",
      "customerFacing": true,
      "analysisIntensity": "unknown",
      "creativeIntensity": "high",
      "salesIntensity": "medium",
      "operationsIntensity": "high",
      "ruleIntensity": "unknown",
      "leadershipIntensity": "unknown",
      "physicalIntensity": "high",
      "keyWorkModes": [
        "응대",
        "예약·주문 관리",
        "시안 제작",
        "수정"
      ],
      "outputTypes": [
        "고객 경험",
        "완성 서비스",
        "작업물",
        "포트폴리오"
      ],
      "successMetrics": [
        "재방문",
        "고객 만족",
        "원가",
        "완성도",
        "재의뢰"
      ],
      "stakeholders": [
        "단골",
        "신규 고객"
      ],
      "function": "customer_service",
      "seniority": "unspecified",
      "workMode": "self_employed"
    },
    "occupationIsAbilityProof": false,
    "task": "고객의 원하는 결과와 재료·시간·안전 제약을 확인",
    "workflow": [
      "상담",
      "가능 범위 설명",
      "작업",
      "중간 확인",
      "관리 안내"
    ],
    "outputs": "합의한 범위의 완성 서비스·이후 안내",
    "collaboration": "고객의 취향과 가능한 작업 범위를 명확히 조율",
    "difficulty": "새로운 표현과 반복 가능한 품질은 별도 숙련이다",
    "comfortable": "사전 확인과 중간 점검 시간을 인정하는 환경",
    "uncomfortable": "고객 요청을 모두 가능하다고 답하게 하는 환경",
    "learn": "모형·연습 재료로 과정과 품질 비교",
    "validateResult": "조건이 다른 재료에서도 같은 기준을 지키는지",
    "economic": "재료·재작업·예약 사이 준비·정리 시간을 구분",
    "smallExperiment": "가상 요청에서 가능한 결과와 어려운 부분 설명",
    "fictionalScene": "참고 결과와 실제 재료 조건이 다른 가상 요청",
    "taskBasis": "editorial:task",
    "restrictions": "전문 시술이나 건강·위생 기준의 대체 지침이 아님",
    "materialRefs": [
      "ckr:material:CH01.P2:source-two-sided-tempo",
      "ckr:material:CH02.P2:technical-distinct"
    ],
    "adapterImplemented": false
  }
];
