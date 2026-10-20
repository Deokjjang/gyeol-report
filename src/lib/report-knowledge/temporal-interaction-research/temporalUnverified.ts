import type { ResearchBoundary } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_UNVERIFIED = [
  {
    "id": "tr:held:five-year-halves",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운 전후 5년 간·지 분할",
    "rule": "G: 새 기간 계산·근거 승인 없음",
    "required": "전통 논의는 있으나 현재 계산이 5년마다 운의 소유자를 바꾸지 않는다.",
    "prohibited": "운간·운지를 독립 5년 지배자로 확정",
    "nextEvidence": "판본별 행운론 대조와 후속 계약 검토"
  },
  {
    "id": "tr:held:transition-lead-lag",
    "class": "E",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "교운 전후 선행·잔류 효과",
    "rule": "E: 시간 차이와 해석 잔류의 독립 검증",
    "required": "고전의 전환 주변 비유가 기존 startSolarRange와 같은 모델이라는 근거는 없다.",
    "prohibited": "교운 전 1년·후 1년을 임의 추가",
    "nextEvidence": "전승별 원문·현재 경계와 별도 변수 검토"
  },
  {
    "id": "tr:held:strength",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "기간 강약·용신",
    "rule": "G: 현재 근거만으로 배합 판단 불충분",
    "required": "빈도·missing/heavy는 신강약·희기 산출이 아니다.",
    "prohibited": "부족=용신·다수=기신",
    "nextEvidence": "월령·통근·투간 등 검증된 producer 계약 필요"
  },
  {
    "id": "tr:held:full-hyeong",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "기간 전체 삼형",
    "rule": "G: 실제3자 기간 producer 없음",
    "required": "이전64조합 중 전체 삼형2건은 쌍 검출과 다른 연구 개념이다.",
    "prohibited": "2개 지지에 나머지 하나 채움",
    "nextEvidence": "정의·owner·기간·발생 규칙의 별도 승인"
  },
  {
    "id": "tr:held:stem-hap-periods",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "기간끼리 천간합",
    "rule": "G: natal_saeun V4투영 외 기간 천간합 미지원",
    "required": "표의 존재만으로 각 scope에 producer가 있는 것은 아니다.",
    "prohibited": "stem 표를 임의 적용해 runtime 근거 생성",
    "nextEvidence": "각 생산자 계약과 시간 ledger 검토"
  },
  {
    "id": "tr:held:wonjin-periods",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "기간끼리 원진",
    "rule": "G: 실제 기간간 원진 producer 없음",
    "required": "월운 확장의 natal anchor 원진과 기간 쌍 원진은 다르다.",
    "prohibited": "확장 원진을 dayun_saeun 원진으로 바꿈",
    "nextEvidence": "쌍의 owner와 source 도입 승인 필요"
  },
  {
    "id": "tr:held:haphwa",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "합화·격국 전환",
    "rule": "G: 현재 기간 합화·격국변화 근거 없음",
    "required": "관계 구성과 화·격국 판정은 같은 단계가 아니다.",
    "prohibited": "합 검출을 오행 변환으로 확정",
    "nextEvidence": "성립·실패 조건의 학파 비교와 계산 승인"
  },
  {
    "id": "tr:held:domain-effects",
    "class": "E",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "조합별 생활 효력",
    "rule": "E: 생활 결과의 실증 자료 없음",
    "required": "D 질문의 유용성이 사건 예측을 검증하지 않는다.",
    "prohibited": "직업·재물·혼인 성공 예측",
    "nextEvidence": "사전 정의한 반례·비예측적 독해 검토"
  },
  {
    "id": "tr:held:month-wolun-lineage",
    "class": "E",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월운 세부 전거",
    "rule": "E: 일부 월별 적용의 독립 전통 전거 미확인",
    "required": "월령의 계절론을 현재 모든 월별 현대 조언의 전거로 쓸 수 없다.",
    "prohibited": "월별 질문을 고전 원문 해석으로 표시",
    "nextEvidence": "월운 자체를 다루는 일차 판본 추가 대조"
  },
  {
    "id": "tr:held:legacy-impact",
    "class": "E",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "레거시 고객 영향",
    "rule": "E: 호출자별 실제 출력 영향 추가 추적 필요",
    "required": "혼합 배열은 확인됐으나 모든 고객 경로의 영향 범위는 이번 DB 작업에서 확정하지 않았다.",
    "prohibited": "영향 없음 또는 현재 고객 오류 확정",
    "nextEvidence": "별도 읽기 전용 재현·고객 저장본 불변 원칙"
  },
  {
    "id": "tr:held:element-magnitude",
    "class": "G",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "오행 영향 크기",
    "rule": "G: 연구25칸은 크기 계산 아님",
    "required": "방향은 비교할 수 있으나 기간의 유입량·강도 점수는 제공되지 않는다.",
    "prohibited": "오행 하나 증가를 20% 개선으로 표기",
    "nextEvidence": "강도 모델의 근거·후속 승인 필요"
  }
] as const satisfies readonly ResearchBoundary[];
