import type { Material } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_PHASE_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:phase:early",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "phase": "early",
    "scope": "dayun",
    "meaning": "기존 조건과 새 장기 요구가 겹치는 경계를 확인",
    "positive": "새 주기에 맞게 조정할 선택과 유지할 자원을 나눔",
    "risk": "초기라는 이유로 창업·이직을 강제",
    "twist": "새 요구가 확인되지 않으면 기존 방식 유지도 가능",
    "requires": [
      "전환 정확/범위·이전/새 대운·해당 세운"
    ],
    "distinction": "경과 연수는 위치 표지이며 사건·적응 완료 근거 아님",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial"
  },
  {
    "id": "mfpr:phase:middle",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "phase": "middle",
    "scope": "dayun",
    "meaning": "같은 배경 아래 서로 다른 세운의 실제 차이를 비교",
    "positive": "반복해서 쓰는 자원의 활용 조건을 수정",
    "risk": "중기=수확·성공·절정으로 판단",
    "twist": "관계 근거가 같다면 유지/비교 기능을 표시",
    "requires": [
      "동일 cycle·독립 annual·원국 조건"
    ],
    "distinction": "3~6년 구분은 기존 편집 phase이며 명리 효과 계산 아님",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial"
  },
  {
    "id": "mfpr:phase:late",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "phase": "late",
    "scope": "dayun",
    "meaning": "다음 주기와 차이가 확인되는 과제만 비교",
    "positive": "남길 기준과 새 환경에서도 사용할 자원을 구분",
    "risk": "후기=끝·쇠퇴·정리·매각을 지시",
    "twist": "현행 강점이 다음에도 유효하면 지속 가능",
    "requires": [
      "현재/다음 cycle·경계·원국 비교"
    ],
    "distinction": "7~9년 구분은 경과 위치이며 미래 사건 근거 아님",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial"
  }
];
