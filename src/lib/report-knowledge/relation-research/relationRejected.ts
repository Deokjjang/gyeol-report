import type { RelationRejected } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_REJECTED = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:stem_hap:01",
    "relation": "stem_hap",
    "class": "F_REJECTED",
    "claim": "천간합이 있으면 합화가 완성되고 본래 오행은 사라진다.",
    "reason": "쌍 검출과 화기 조건은 다르며 원생 함수는 화기·용신·통근을 판정하지 않는다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:yukhap:02",
    "relation": "yukhap",
    "class": "F_REJECTED",
    "claim": "육합이니 좋은 인연이며 결혼과 사업 성공이 보장된다.",
    "reason": "대칭 쌍의 존재가 동의·성품·결과를 증명하지 않는다. 합이 필요한 작용을 묶는 조건도 문헌에 있다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:chung:03",
    "relation": "chung",
    "class": "F_REJECTED",
    "claim": "충이 오면 사고·이혼·실직이 발생한다.",
    "reason": "기호에서 사건을 도출할 근거가 없으며 왕쇠·역할별 작용이 다르다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:samhap:04",
    "relation": "samhap",
    "class": "F_REJECTED",
    "claim": "삼합국이면 해당 오행만 남아 큰 재물을 얻는다.",
    "reason": "세 글자 집결과 화기·격국·경제 결과는 별개의 판단이다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:hyeong:05",
    "relation": "hyeong",
    "class": "F_REJECTED",
    "claim": "자형이 있으니 자해·질병·법적 처벌 성향이 있다.",
    "reason": "동일 지지의 반복 관계를 건강·도덕·법률 진단으로 사용할 근거가 없다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:hae:06",
    "relation": "hae",
    "class": "F_REJECTED",
    "claim": "해는 숨은 적이 실제로 해코지한다는 뜻이다.",
    "reason": "고전의 합·충 매개 설명을 현실의 적대 의도나 인물로 옮길 수 없다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:banhap:07",
    "relation": "banhap",
    "class": "F_REJECTED",
    "claim": "반합이 있으므로 빠진 지지가 숨어 있고 삼합도 완성된다.",
    "reason": "현행 판정은 실제2자리이며 없는 지지·인물·Evidence를 추가할 수 없다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:pa:08",
    "relation": "pa",
    "class": "F_REJECTED",
    "claim": "파와 합이 같이 있으니 먼저 사랑하고 나중에 배신한다.",
    "reason": "동일 쌍의 다른 분류를 사건 순서로 바꾼 허위 인과다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:wonjin:09",
    "relation": "wonjin",
    "class": "F_REJECTED",
    "claim": "원진살과 원진 관계가 각각 있으니 애증·외도 위험이 두 배다.",
    "reason": "같은 신호의 투영은 독립 증거가 아니며 실제 감정·외도·정신 상태를 증명하지 않는다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:hyeong:10",
    "relation": "hyeong",
    "class": "F_REJECTED",
    "claim": "寅巳 두 글자만 있으면 寅巳申 삼형 전체가 완성된다.",
    "reason": "현행 쌍 판정과 세 글자 전체 구성은 다르다. 누락된 申을 만들어낼 수 없다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:stem_hap:11",
    "relation": "stem_hap",
    "class": "F_REJECTED",
    "claim": "丁壬 합의 역사적 이름은 현대 성적 행동과 도덕성을 말해 준다.",
    "reason": "역사적 도덕 평가를 현재 개인에게 적용할 수 없으며 성별 차별·낙인으로 이어진다."
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:rejected:wonjin:12",
    "relation": "wonjin",
    "class": "F_REJECTED",
    "claim": "궁합에서 각자의 원진살이 검출됐으므로 두 사람도 원진이다.",
    "reason": "각자 원국의 신호와 교차 관계는 다르며 교차 원진 producer 자체가 없다."
  }
] as const satisfies readonly RelationRejected[];
