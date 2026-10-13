import type { Rejected } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_REJECTED_RESEARCH: readonly Rejected[] = [
  {
    "id": "mfpr:rejected:fourteen-year-cycle",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "14년 전체를 하나의 대운으로 취급",
    "reason": "고객용 창과 10년 cycle은 별개",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:no-transition-fourteen",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "완전히 덮이는 14년 안에 교운이 없는 정상 입력",
    "reason": "10년 연속 cycle에서는 불가능; 누락·불확실성은 무전환 사실이 아님",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:year-fixed",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "항상 2023~2036년으로 출력",
    "reason": "baseYear-3~baseYear+10을 유지",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:before-relations",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "전환 이후 관계로 전환 전 구간 설명",
    "reason": "현재 producer의 해당 부분 미지원; 보류",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:current-natal-all-cycles",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "current packet의 natal 관계를 모든 cycle로 복제",
    "reason": "해당 cycle 한정 근거",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:three-layer",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "하나의 pair 관계로 원국×대운×세운 성립 확정",
    "reason": "독립 pair와 실제 composite verdict를 구별",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:luck-score",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "관계 수나 연구 수를 확률·점수로 사용",
    "reason": "기존 편집 중요도와 예측 점수는 다름",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:mbti-forecast",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "MBTI로 교운·재물·이직·혼인 시점 계산",
    "reason": "개인 반응 참고와 시간 사실 분리",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:history",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "과거 손실·성공·돌봄 경험을 이미 겪었다고 서술",
    "reason": "입력되지 않은 사건은 조건부 질문만",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:context-frozen",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "현재 직업·관계가 14년 내내 유지",
    "reason": "연도마다 실제 생활 상태 미상",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:phase-fate",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "초기 시작·중기 성공·후기 쇠퇴 자동 분류",
    "reason": "경과 위치는 편집 표지",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:unsupported-tradition",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "희기·통관·합화·해소·격국 변화를 자동 계산한 것처럼 사용",
    "reason": "전통 논의 존재와 producer 지원을 구분",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "mfpr:rejected:birthday-anchor",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "고객용 calendar-year 연주를 모든 instant의 입춘 연주로 간주",
    "reason": "major annual row 계약과 precise interval 계산을 별도 확인",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "approved": false
  }
];
