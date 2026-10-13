/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ThemeReview } from "./researchTypes";
export const PC_CONFLICT_REPAIR: readonly ThemeReview[] = [
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P1:expectation-and-interest-differ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P1:expectation-and-interest-differ",
    "coreMeaning": "부모가 바라는 안정과 자녀의 현재 관심이 다른 조건을 연구한다.",
    "question": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "parentResponsibleAction": "현재 목적과 실제 지원을 확인한다.",
    "childAvailableChoice": "다른 관심·보류·도움 필요를 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "목적과 지원을 다시 확인할 여지",
    "risk": "같은 미래를 원해야 좋은 자녀라고 평가",
    "factBomb": "부모의 계획과 다르다는 사실만으로 자녀의 계획이 없는 것은 아니다.",
    "twist": "작은 탐색으로 차이가 실제 무엇인지 알아볼 수 있다.",
    "scene": "가상으로 활동 선택이 다르다면 부모는 관심과 걱정을 따로 듣는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P1:privacy-and-safety-are-different",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P1:privacy-and-safety-are-different",
    "coreMeaning": "안전 확인과 자녀의 사적 정보 공개를 구분해야 할 조건을 연구한다.",
    "question": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "parentResponsibleAction": "목적·범위·지원 통로를 점검한다.",
    "childAvailableChoice": "어려운 공개 범위를 말하거나 안전한 지원자를 고를 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "확인 범위를 좁힐 가능성",
    "risk": "감시를 관심으로 정당화",
    "factBomb": "걱정된다는 마음만으로 모든 비밀을 알아야 할 권한이 생기지는 않는다.",
    "twist": "정보를 덜 요구해도 필요한 안전 확인은 가능할 수 있다.",
    "scene": "가상으로 연락 범위를 정한다면 부모는 안전 목적과 필요한 정보만 설명한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P1:device-rule-needs-reason",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P1:device-rule-needs-reason",
    "coreMeaning": "디지털 기기 약속에서 안전 목적·생활 필요·선택 범위를 나눌 질문을 연구한다.",
    "question": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "parentResponsibleAction": "목적·대안·재검토를 마련한다.",
    "childAvailableChoice": "현재 필요한 사용과 불편한 규칙을 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "규칙의 목적을 알아볼 가능성",
    "risk": "질문을 기기 중독이나 불순종으로 진단",
    "factBomb": "기기를 싫어한다는 부모의 마음과 실제 위험은 같은 근거가 아니다.",
    "twist": "목적을 좁히면 바꾸어도 되는 사용 방식이 보일 수 있다.",
    "scene": "가상으로 기기 사용을 논의한다면 부모는 실제 필요한 사용과 걱정할 조건을 확인한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P1:adult-contact-is-not-permission",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P1:adult-contact-is-not-permission",
    "coreMeaning": "성인 자녀의 연락·방문 경계와 부모의 관계 기대가 다를 조건을 연구한다.",
    "question": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "parentResponsibleAction": "기대와 실제 동의를 분리한다.",
    "childAvailableChoice": "거절·다른 날짜·정보 경계를 선택할 수 있다.",
    "developmentalContexts": [
      "ADULT"
    ],
    "positive": "현재 가능한 연결을 찾을 여지",
    "risk": "답이 늦다는 이유로 독립 결정을 제한",
    "factBomb": "가족이라는 말이 상대의 시간을 언제든 써도 된다는 허락은 아니다.",
    "twist": "동의한 작은 연결이 요구만 늘리는 연락보다 지속 가능할 수 있다.",
    "scene": "가상으로 방문을 논의한다면 부모는 날짜와 범위를 미리 묻는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P2:clash-without-family-blame",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P2:clash-without-family-blame",
    "coreMeaning": "실제 子午 충과 대화의 어려움을 인과로 확정하지 않는 자료다.",
    "question": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "parentResponsibleAction": "계산 사실과 행동의 선택을 분리한다.",
    "childAvailableChoice": "다른 의견과 지원 필요를 표현할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "갈등 질문의 출처를 구분할 가능성",
    "risk": "충 때문에 갈등이 필연적이라고 판단",
    "factBomb": "충을 설명하는 말이 부모의 반응을 돌아볼 책임을 없애지는 않는다.",
    "twist": "출처를 구분하면 고칠 수 있는 실제 행동을 남길 수 있다.",
    "scene": "가상으로 규칙에 이견이 있다면 부모는 관계 명칭 대신 발언과 지원 조건을 듣는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P2:harm-not-wonjin-child",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P2:harm-not-wonjin-child",
    "coreMeaning": "같은 글자의 해와 미지원 원진을 구분하고 자녀의 성격 판정으로 옮기지 않는다.",
    "question": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "parentResponsibleAction": "검출과 연구 정의를 구분한다.",
    "childAvailableChoice": "관계 명칭을 자기 문제로 받아들일 의무 없이 질문할 수 있다.",
    "developmentalContexts": [
      "UNKNOWN"
    ],
    "positive": "지원 범위를 정확히 알 가능성",
    "risk": "해를 원진으로 바꿔 가족 불행을 설명",
    "factBomb": "같은 글자가 적혔다고 서로 다른 관계 이름을 바꾸어 쓸 수는 없다.",
    "twist": "모르는 관계를 남겨두어도 실제 도움 질문은 할 수 있다.",
    "scene": "가상으로 관계를 설명한다면 부모·자녀의 실제 필요는 별도 확인한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P2:no-relation-is-not-missing-bond",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P2:no-relation-is-not-missing-bond",
    "coreMeaning": "교차 관계가 없을 때 가족의 연결 부족을 만들어내지 않는 연구다.",
    "question": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "parentResponsibleAction": "근거의 부재를 관계의 결함으로 읽지 않는다.",
    "childAvailableChoice": "필요한 도움이나 다른 의견을 말할 수 있다.",
    "developmentalContexts": [
      "UNKNOWN"
    ],
    "positive": "없는 근거를 정확히 남길 가능성",
    "risk": "관계가 없으니 애착이나 이해가 부족하다고 평가",
    "factBomb": "사주 관계가 안 나왔다는 사실이 실제로 서로를 모른다는 답은 아니다.",
    "twist": "검출하지 못한 설명 대신 현재 필요한 지원을 물을 수 있다.",
    "scene": "가상으로 어려움을 논의한다면 부모는 관계 명칭 없이 지금의 필요를 듣는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P2:harmony-and-disagreement-coexist",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P2:harmony-and-disagreement-coexist",
    "coreMeaning": "합과 충이 실제로 함께 있어도 다른 대상의 조건을 구분해 연구한다.",
    "question": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "parentResponsibleAction": "각각의 출처와 비단정 조건을 유지한다.",
    "childAvailableChoice": "관계 분류와 실제 경험이 다르다고 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "출처를 분리한 복합 질문",
    "risk": "좋고 나쁨 하나로 가족을 평가",
    "factBomb": "좋은 관계 하나가 어려운 행동을 정당화하지는 않는다.",
    "twist": "다른 연결을 구분하면 실제로 확인할 질문도 달라질 수 있다.",
    "scene": "가상으로 지원 방식을 이야기한다면 부모는 참여 관계와 현재 질문을 각각 설명한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P3:result-debt-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P3:result-debt-loop",
    "coreMeaning": "기대→지원 대가 요구→관심 설명 위축의 반복 가능성을 연구한다.",
    "question": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "parentResponsibleAction": "기대와 조건 없는 보호를 구분한다.",
    "childAvailableChoice": "관심·부담·보류를 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "반복의 조건을 알아볼 기회",
    "risk": "설명이 줄면 지원을 줄이겠다고 압박",
    "factBomb": "결과로 증명하라는 말을 반복하면 필요한 도움을 묻는 말은 줄어들 수 있다.",
    "twist": "성과를 약속받지 않아도 현재 시도는 함께 확인할 수 있다.",
    "scene": "가상으로 같은 진로 논의가 반복된다면 부모는 현재 한 결정만 분리한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P3:protection-question-test-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P3:protection-question-test-loop",
    "coreMeaning": "걱정→정답 확인 질문→자녀 설명 차단의 반복 조건을 연구한다.",
    "question": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "parentResponsibleAction": "질문의 목적과 실제 선택 범위를 확인한다.",
    "childAvailableChoice": "이유를 묻거나 다른 방법을 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "보호와 검사 질문을 구분할 가능성",
    "risk": "질문 형식만으로 선택권을 줬다고 여김",
    "factBomb": "모든 선택지를 없애고 묻는 말은 자녀에게 정답 맞히기만 남길 수 있다.",
    "twist": "바꿀 부분을 실제 남기면 질문의 역할이 달라질 수 있다.",
    "scene": "가상으로 활동 허용을 논의한다면 부모는 안전 조건과 열어둘 방법을 구분한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P3:debate-silence-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P3:debate-silence-loop",
    "coreMeaning": "빠른 반박→설명 중단→더 많은 질문의 반복 조건을 연구한다.",
    "question": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "parentResponsibleAction": "반박을 멈추고 수신을 확인한다.",
    "childAvailableChoice": "말·글·보류를 고를 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "설명할 통로를 다시 고를 기회",
    "risk": "말이 없으니 더 몰아붙여야 한다고 판단",
    "factBomb": "대답을 늘리라고 할수록 들으려는 내용이 멀어질 수 있다.",
    "twist": "대화의 속도를 낮추면 적게 말해도 정확한 정보가 올 수 있다.",
    "scene": "가상으로 대화가 막힌다면 부모는 질문을 멈추고 전달 방법을 다시 묻는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P3:child-comfort-parent-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P3:child-comfort-parent-loop",
    "coreMeaning": "부모 불편→자녀 위로 기대→자녀 경계 축소의 반복 가능성을 연구한다.",
    "question": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "parentResponsibleAction": "자신의 반응·요구·성인 지원을 점검한다.",
    "childAvailableChoice": "대화 범위를 줄이거나 도움을 요청할 수 있다.",
    "developmentalContexts": [
      "SCHOOL",
      "TEEN"
    ],
    "positive": "정서 책임의 경계를 확인할 기회",
    "risk": "좋은 자녀는 부모 마음을 알아야 한다고 요구",
    "factBomb": "아이에게 위로받는 편함이 아이에게 어떤 일을 남기는지 어른이 먼저 봐야 한다.",
    "twist": "부모가 성인 도움을 구하면 자녀는 관심을 표현하는 데서 멈출 수 있다.",
    "scene": "가상으로 자녀에게 자꾸 마음을 털어놓고 싶다면 부모는 지원 대상을 다시 확인한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P4:comparison-removes-own-question",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P4:comparison-removes-own-question",
    "coreMeaning": "다른 가족·또래와의 비교가 현재 지원 질문을 지울 조건을 연구한다.",
    "question": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "parentResponsibleAction": "비교를 멈추고 실제 지원을 확인한다.",
    "childAvailableChoice": "자기 질문과 도움 필요를 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "현재 필요한 지원을 볼 가능성",
    "risk": "비교를 동기부여로만 정당화",
    "factBomb": "다른 아이 이야기를 오래 해도 지금 내 아이가 막힌 곳은 알 수 없다.",
    "twist": "현재 한 질문을 듣는 것이 더 구체적인 지원을 만들 수 있다.",
    "scene": "가상으로 학습을 논의한다면 부모는 또래 순위 대신 필요한 자료를 묻는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P4:digital-monitoring-is-not-trust",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P4:digital-monitoring-is-not-trust",
    "coreMeaning": "확인 필요를 무제한 감시나 위협으로 바꾸지 않을 경계를 연구한다.",
    "question": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "parentResponsibleAction": "안전 문제를 성격의 탓으로 돌리지 않는다.",
    "childAvailableChoice": "안전한 성인·전문 지원을 선택할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "필요한 안전 범위를 구별할 가능성",
    "risk": "몰래 모든 정보를 보는 것을 보호 성향으로 미화",
    "factBomb": "걱정의 크기만으로 사생활 침해가 사라지지는 않는다.",
    "twist": "정보를 덜 요구하면서도 도움을 요청할 통로를 강화할 수 있다.",
    "scene": "가상으로 온라인 안전을 논의한다면 부모는 실제 위험과 지원 경로를 먼저 확인한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P4:adult-choice-not-permanent-approval",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P4:adult-choice-not-permanent-approval",
    "coreMeaning": "성인 자녀의 선택을 과거 부모 역할의 영구 승인 대상으로 볼 위험을 연구한다.",
    "question": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "parentResponsibleAction": "승인 요구를 줄이고 정보 제공 범위를 확인한다.",
    "childAvailableChoice": "결정·조언 수신·연락 경계를 고를 수 있다.",
    "developmentalContexts": [
      "ADULT"
    ],
    "positive": "현재에 맞는 경계를 정할 가능성",
    "risk": "지원했으니 진로·방문·연락을 모두 정함",
    "factBomb": "예전의 보호 책임이 지금 모든 선택의 허락권으로 남는 것은 아니다.",
    "twist": "요청받은 지원만 맡아도 연결을 유지할 수 있다.",
    "scene": "가상으로 대학 생활 결정을 논의한다면 부모는 원하는 지원 범위만 묻는다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH07.P4:coercion-not-equal-style-conflict",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH07.P4:coercion-not-equal-style-conflict",
    "coreMeaning": "폭력·방임·강압을 부모와 자녀의 같은 성향 차이로 만들지 않는 안전 경계를 연구한다.",
    "question": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "parentResponsibleAction": "안전 확보와 전문 판단을 우선한다.",
    "childAvailableChoice": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
    "developmentalContexts": [
      "YOUNG",
      "SCHOOL",
      "TEEN"
    ],
    "positive": "성격 설명과 안전 판단을 구분할 가능성",
    "risk": "학대를 궁합이 안 맞는 결과로 미화",
    "factBomb": "어른의 위험한 행동을 아이가 더 잘 이해했어야 할 문제로 돌릴 수는 없다.",
    "twist": "안전한 지원으로 거리를 두는 선택도 보호의 일부일 수 있다.",
    "scene": "가상으로 안전 우려가 있다면 성인은 적절한 보호·전문 지원을 확인한다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P1:repair-result-debt",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P1:repair-result-debt",
    "coreMeaning": "지원 대가로 결과를 요구하는 반복을 부모의 기대 수정과 현재 지원 확인으로 바꾸는 절차다.",
    "question": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "parentResponsibleAction": "기대 압박을 줄이고 실제 지원을 마련한다.",
    "childAvailableChoice": "관심을 말하거나 답하지 않을 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "지원과 선택을 분리할 가능성",
    "risk": "사과 뒤에도 같은 결과를 요구",
    "factBomb": "아이의 답을 바꾸게 하는 사과라면 어른의 기대는 아직 그대로일 수 있다.",
    "twist": "결과 약속 없이도 지원할 한 행동을 정할 수 있다.",
    "scene": "가상으로 진로 논의가 반복된다면 부모는 지금 필요한 자료와 수정 가능한 결정을 확인한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:result-debt-loop"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P1:repair-protection-test",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P1:repair-protection-test",
    "coreMeaning": "정답을 요구하는 보호 질문을 실제 위험·지원·선택의 구분으로 바꾸는 절차다.",
    "question": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "parentResponsibleAction": "안전 기준을 설명하고 불필요한 제한을 줄인다.",
    "childAvailableChoice": "방법을 고르거나 멈추고 도움을 요청할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "보호와 선택이 함께 남을 가능성",
    "risk": "자녀가 동의하면 부모 책임이 끝났다고 봄",
    "factBomb": "고르게 했다는 말만으로 어른의 안전 확인이 끝나지는 않는다.",
    "twist": "제한의 이유를 좁히면 남길 선택이 더 분명해질 수 있다.",
    "scene": "가상으로 활동을 시험한다면 부모는 지원·중단 신호·다시 볼 때를 마련한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:protection-question-test-loop"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P1:repair-debate-and-return",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P1:repair-debate-and-return",
    "coreMeaning": "반박과 설명 중단의 반복을 수신 확인·표현 통로·재확인으로 바꾸는 절차다.",
    "question": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "parentResponsibleAction": "반박·답변 요구를 줄이고 실제 수신을 확인한다.",
    "childAvailableChoice": "요약을 고치거나 다른 통로로 전할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "설명할 시간을 남길 가능성",
    "risk": "중단을 벌이나 잠수로 사용",
    "factBomb": "기다리겠다는 말에도 다시 들을 자리가 있어야 한다.",
    "twist": "바로 답을 얻지 않아도 다음 확인을 분명히 할 수 있다.",
    "scene": "가상으로 대화가 막힌다면 부모는 표현 방법과 다시 확인할 때를 묻는다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:debate-silence-loop"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P1:repair-parent-emotional-responsibility",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P1:repair-parent-emotional-responsibility",
    "coreMeaning": "자녀의 위로를 기다리는 반복을 부모의 반응 조절·사과·성인 지원으로 바꾸는 절차다.",
    "question": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "parentResponsibleAction": "반응 조절·안전 돌봄·성인 지원을 직접 맡는다.",
    "childAvailableChoice": "사과에 즉시 답하지 않고 자신의 필요를 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "자녀가 감정 관리 역할을 내려놓을 가능성",
    "risk": "사과받은 자녀에게 괜찮다고 해달라고 요구",
    "factBomb": "미안하다는 말의 끝이 아이의 위로 요구가 되어서는 안 된다.",
    "twist": "부모가 외부 지원을 받는 선택이 가족의 책임을 더 정확히 남길 수 있다.",
    "scene": "가상으로 거칠게 반응했다면 부모는 안전을 유지하고 멈춘 뒤 수정할 행동을 말한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:child-comfort-parent-loop"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P2:a-change-expectation-before-enrollment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P2:a-change-expectation-before-enrollment",
    "coreMeaning": "부모가 지원을 대가로 삼은 기대를 확정 전의 실제 선택권으로 조정하는 연구다.",
    "question": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "parentResponsibleAction": "확정 전 선택과 지원 조건을 다시 연다.",
    "childAvailableChoice": "다른 관심이나 보류를 말할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "관심이 실제 결정에 들어갈 가능성",
    "risk": "의견을 묻고도 결정을 바꾸지 않음",
    "factBomb": "물어봤다는 기록만으로 선택권을 돌려준 것은 아니다.",
    "twist": "지원의 목적을 바꾸면 결과 약속이 없어도 도움이 남는다.",
    "scene": "가상으로 활동 신청 전이라면 부모는 수정·거절·보류할 항목을 남긴다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-expectation-becomes-result-debt"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P2:a-reduce-unnecessary-restriction",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P2:a-reduce-unnecessary-restriction",
    "coreMeaning": "부모가 필요한 보호와 바꾸어도 되는 제한을 구분해 수정하는 연구다.",
    "question": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "parentResponsibleAction": "불필요한 제한을 수정하고 보호를 유지한다.",
    "childAvailableChoice": "방법·도움·중단을 고를 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "안전을 유지하면서 선택을 돌려줄 가능성",
    "risk": "보호를 줄이려 모든 판단을 자녀에게 넘김",
    "factBomb": "통제를 줄이는 일은 돌봄을 줄이는 일과 다르다.",
    "twist": "도울 준비가 있을 때 직접 해볼 범위가 남을 수 있다.",
    "scene": "가상으로 활동 방식을 다시 본다면 부모는 제한한 이유와 지원을 점검한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-protection-removes-small-choice"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P2:a-receive-before-rebuttal",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P2:a-receive-before-rebuttal",
    "coreMeaning": "부모가 반박 전 수신한 내용을 확인하고 표현 속도를 자녀에게 남기는 연구다.",
    "question": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "parentResponsibleAction": "반박을 멈추고 실제 수신을 확인한다.",
    "childAvailableChoice": "요약을 고치거나 나중에 전할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "목소리 크기와 다른 이해의 기회",
    "risk": "요약을 자녀 논리를 공격할 준비로 사용",
    "factBomb": "잘 듣는다는 말은 반박 순서를 기다리는 것과 다르다.",
    "twist": "부모가 모른다고 인정하면 설명을 다시 시작할 수 있다.",
    "scene": "가상으로 의견이 다르다면 부모는 먼저 들은 내용을 되짚는다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-debate-overwhelms-child"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P2:a-stop-comfort-demand",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P2:a-stop-comfort-demand",
    "coreMeaning": "부모가 자녀에게 요구한 위로를 거두고 성인 지원을 찾는 연구다.",
    "question": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "parentResponsibleAction": "사과·반응 조절·안전 돌봄을 직접 맡는다.",
    "childAvailableChoice": "답변·거리·지원 요청을 선택할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "자녀에게 정서 책임을 남기지 않을 가능성",
    "risk": "사과 뒤에도 마음을 알아달라고 반복",
    "factBomb": "사과를 끝내는 책임까지 아이에게 맡기면 부담은 남는다.",
    "twist": "성인 지원을 받는 행동이 부모의 수정 의사를 보여줄 수 있다.",
    "scene": "가상으로 부모가 피로를 쏟아냈다면 자녀에게 계속 듣지 않아도 된다고 말하고 지원을 구한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-care-asks-for-parent-comfort"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P3:child-question-route-parent-receives",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P3:child-question-route-parent-receives",
    "coreMeaning": "자녀가 질문할 통로를 고르고 부모가 권한 반응을 수정할 회복 자료다.",
    "question": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "parentResponsibleAction": "불이익 없는 반응과 설명을 마련한다.",
    "childAvailableChoice": "질문·보류·안전한 지원자를 선택할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "안전하게 질문할 가능성",
    "risk": "자녀의 설명 솜씨에 회복을 맡김",
    "factBomb": "질문할 자리를 여는 일은 질문을 잘하는 아이만의 몫이 아니다.",
    "twist": "짧은 질문도 부모가 행동을 바꿀 정보를 줄 수 있다.",
    "scene": "가상으로 규칙을 다시 본다면 부모는 의견을 받을 통로와 수정할 범위를 설명한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-question-treated-as-rejection"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P3:child-short-request-parent-supports",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P3:child-short-request-parent-supports",
    "coreMeaning": "자녀가 짧게 요청해도 부모가 필요한 안전과 지원을 확인하는 회복 자료다.",
    "question": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "parentResponsibleAction": "수신·지원·추가 질문의 범위를 나눈다.",
    "childAvailableChoice": "짧은 요청·보류·다른 안전한 도움을 고를 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "지원 요청의 부담을 낮출 가능성",
    "risk": "부모가 만족할 설명을 해야 도와줌",
    "factBomb": "설명이 완성될 때까지 필요한 도움을 미뤄야 하는 것은 아니다.",
    "twist": "도움을 받은 뒤 더 말할 여지도 생길 수 있다.",
    "scene": "가상으로 짧게 도움을 청한다면 부모는 급한 위험과 원하는 지원부터 묻는다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-quiet-response-increases-parent-demand"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P3:child-change-parent-replans",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P3:child-change-parent-replans",
    "coreMeaning": "자녀가 바뀐 관심을 말하고 부모가 현재 지원을 조정하는 회복 자료다.",
    "question": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "parentResponsibleAction": "자신의 기대와 지원 계획을 수정한다.",
    "childAvailableChoice": "관심·대안·휴식을 선택할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "현재 관심을 지원에 반영할 가능성",
    "risk": "마지막 기회라며 변경을 압박",
    "factBomb": "바뀐 관심을 설명하는 일이 부모의 수고를 갚는 시험이 되어서는 안 된다.",
    "twist": "종료 조건을 정하면 현재 탐색도 구체적으로 볼 수 있다.",
    "scene": "가상으로 활동을 바꾼다면 부모는 필요한 지원과 실제 남은 부담을 확인한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-interest-changes-parent-plan"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P3:child-boundary-parent-seeks-adult",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P3:child-boundary-parent-seeks-adult",
    "coreMeaning": "자녀가 부모 감정의 돌봄을 멈출 수 있게 부모가 지원 책임을 되찾는 회복 자료다.",
    "question": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "parentResponsibleAction": "반응 조절과 성인 지원을 직접 맡는다.",
    "childAvailableChoice": "멈춤·거리·도움 요청을 고를 수 있다.",
    "developmentalContexts": [
      "SCHOOL",
      "TEEN"
    ],
    "positive": "자녀의 관심과 경계를 함께 남길 가능성",
    "risk": "거절한 자녀를 차갑다고 평가",
    "factBomb": "아이의 경계를 존중하는 일도 부모가 감당할 반응의 일부다.",
    "twist": "부모가 지원받으면 자녀는 가족의 조정자가 되지 않아도 된다.",
    "scene": "가상으로 자녀가 듣기 어렵다고 말한다면 부모는 받아들이고 필요한 지원을 구한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-care-becomes-parent-dependence"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P4:young-rule-repair-with-model",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P4:young-rule-repair-with-model",
    "coreMeaning": "어린 자녀에게 규칙을 다시 설명할 때 성인의 행동 모델과 실제 작은 선택을 남긴다.",
    "question": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "parentResponsibleAction": "설명·모델·안전 지원을 맡는다.",
    "childAvailableChoice": "작은 방법을 고르거나 도움을 요청할 수 있다.",
    "developmentalContexts": [
      "YOUNG"
    ],
    "positive": "실행 가능한 규칙을 다시 알아볼 가능성",
    "risk": "어른의 큰 사과 뒤 같은 모욕 반복",
    "factBomb": "다음 행동이 바뀌지 않으면 미안하다는 설명만으로 규칙이 달라지지 않는다.",
    "twist": "어른도 지키는 모습을 보이는 것이 길게 설명하는 것보다 명확할 수 있다.",
    "scene": "가상으로 정리 규칙이 어려웠다면 부모는 필요한 행동을 보여주고 가능한 방법을 남긴다.",
    "precedingMeaningRefs": [],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P4:teen-device-rule-review",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P4:teen-device-rule-review",
    "coreMeaning": "기기 약속을 실제 목적·지원·재검토 계기로 다시 정할 자료다.",
    "question": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "parentResponsibleAction": "안전·이유·선택·재검토를 마련한다.",
    "childAvailableChoice": "의견·대안·도움 요청을 선택할 수 있다.",
    "developmentalContexts": [
      "TEEN"
    ],
    "positive": "목적에 맞는 약속을 만들 가능성",
    "risk": "일방 규칙을 공동 합의라고 부름",
    "factBomb": "함께 정했다는 말에는 자녀가 바꿀 수 있었던 부분도 있어야 한다.",
    "twist": "작은 항목을 시험하면 모든 사용을 한 번에 판단하지 않아도 된다.",
    "scene": "가상으로 기기 규칙을 다시 본다면 부모는 목적과 다음 검토 계기를 정한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P1:device-rule-needs-reason"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P4:adult-consent-and-contact-review",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P4:adult-consent-and-contact-review",
    "coreMeaning": "성인 자녀의 연락·방문·정보 경계를 현재 동의로 다시 정하는 자료다.",
    "question": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "parentResponsibleAction": "승인 요구를 줄이고 동의한 지원만 맡는다.",
    "childAvailableChoice": "방문·연락·조언·정보 경계를 선택할 수 있다.",
    "developmentalContexts": [
      "ADULT"
    ],
    "positive": "독립 속에서 가능한 연결을 남길 가능성",
    "risk": "과거 지원을 경계 거절의 벌로 사용",
    "factBomb": "예전에 도왔다는 사실이 지금의 방문 동의를 대신하지 않는다.",
    "twist": "작은 연락 합의로도 연결과 각자 생활을 함께 남길 수 있다.",
    "scene": "가상으로 방문을 조정한다면 부모는 날짜·범위·공개 정보를 먼저 묻는다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P1:adult-contact-is-not-permission"
    ],
    "notAdditionalIndependentFact": true
  },
  {
    "id": "pcpr:view:conflictRepairResearch:material:CH08.P4:safety-support-not-forced-reunion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "materialRef": "pcpr:material:CH08.P4:safety-support-not-forced-reunion",
    "coreMeaning": "안전 우려를 일반 화해가 아닌 성인의 보호·전문 지원으로 구분하는 인수 자료다.",
    "question": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "parentResponsibleAction": "보호·지원·안전 확인을 맡는다.",
    "childAvailableChoice": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
    "developmentalContexts": [
      "YOUNG",
      "SCHOOL",
      "TEEN"
    ],
    "positive": "안전과 일반 조율의 경계를 남길 가능성",
    "risk": "화해·용서·가족 재결합을 우선 요구",
    "factBomb": "아이의 안전이 어른의 체면을 지키는 일 뒤로 밀려서는 안 된다.",
    "twist": "거리를 두고 지원받는 선택도 관계 판단과 별개로 필요할 수 있다.",
    "scene": "가상으로 안전 우려가 있다면 성인은 적절한 보호와 전문 지원을 확인한다.",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P4:coercion-not-equal-style-conflict"
    ],
    "notAdditionalIndependentFact": true
  }
];
