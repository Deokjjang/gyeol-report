import type { Material } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_INTERACTION_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:interaction:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "participants": "원국의 각 자리와 실제 대운 지지",
    "window": "두 범위의 유효 교집합",
    "supported": "current packet의 branchInteractions 및 majorNatal factor ID에 한정",
    "unsupported": "재구성된 다른 cycle의 원국 관계와 stem 합화·강도·격국 변화",
    "positive": "타고난 반응과 장기 조건을 나눠 이해",
    "risk": "한 currentCycle 관계를 다른 주기에 복제",
    "twist": "관계가 없어도 확정된 원국 성향은 유지",
    "requires": [
      "원국 position·cycle index·ganji·original reason ID"
    ],
    "formation": "existing producer confirmed result only; possible/unsupported remain separate",
    "traditionalStatus": "상속 TEMPORAL_SCOPES·TEMPORAL_RELATIONS의 class/support를 보존; 현대 적용과 별도",
    "counterconditions": [
      "해당 participant 부재",
      "유효 기간 교집합 없음",
      "출처·방향·자리 불일치",
      "성립 조건 미검증"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:temporal",
      "mfpr:source:decade",
      "mfpr:source:interaction"
    ],
    "verification": "repository_scope_checked"
  },
  {
    "id": "mfpr:interaction:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "participants": "원국의 각 자리와 해당 연주 지지",
    "window": "해당 calendar-year row; 정밀 연운 구간은 별도 producer",
    "supported": "annual.natalRelations 및 reason/evidenceIds",
    "unsupported": "미상 시주·실제 사건·운세 강도·미검출의 평온",
    "positive": "같은 개인 기반에 해마다 어떤 접점이 더해지는지 비교",
    "risk": "affectedPillars를 대운 소유자로 바꾸기",
    "twist": "동일 원국의 다른 자리가 다른 질문을 제공",
    "requires": [
      "원국 position·year·annual ganji·relation ID"
    ],
    "formation": "existing producer confirmed result only; possible/unsupported remain separate",
    "traditionalStatus": "상속 TEMPORAL_SCOPES·TEMPORAL_RELATIONS의 class/support를 보존; 현대 적용과 별도",
    "counterconditions": [
      "해당 participant 부재",
      "유효 기간 교집합 없음",
      "출처·방향·자리 불일치",
      "성립 조건 미검증"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:temporal",
      "mfpr:source:decade",
      "mfpr:source:interaction"
    ],
    "verification": "repository_scope_checked"
  },
  {
    "id": "mfpr:interaction:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "participants": "해당 cycle 지지와 해당 연주 지지",
    "window": "전환 연도에는 완료 이후 구간에만 적용",
    "supported": "annual.cycleRelations; 육합/반합/충/형/파/해 기존 검출 결과. 대운 지지와 세운 지지 두 참가자만으로 완전한 삼합은 생성되지 않는다.",
    "unsupported": "전환 이전 대운 관계·stem 합화·원진 period-pair·두 참가자만으로 완전한 삼합",
    "positive": "장기 배경과 올해 조건의 차이를 보임",
    "risk": "충·형 공존을 불행 점수 합산",
    "twist": "연결과 긴장이 함께 있으면 약속 범위를 조정",
    "requires": [
      "cycle index·ganji·year·annual ganji·reason ID"
    ],
    "formation": "existing producer confirmed result only; possible/unsupported remain separate",
    "traditionalStatus": "상속 TEMPORAL_SCOPES·TEMPORAL_RELATIONS의 class/support를 보존; 현대 적용과 별도",
    "counterconditions": [
      "해당 participant 부재",
      "유효 기간 교집합 없음",
      "출처·방향·자리 불일치",
      "성립 조건 미검증"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:temporal",
      "mfpr:source:decade",
      "mfpr:source:interaction"
    ],
    "verification": "repository_scope_checked"
  },
  {
    "id": "mfpr:interaction:natal_dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun_saeun",
    "participants": "독립적으로 확인된 세 층위 참가자",
    "window": "모든 관계가 동시에 유효한 교집합만",
    "supported": "기존 pair별 관계가 있을 수 있으나 dedicated 3layer verdict 없음",
    "unsupported": "하나의 충/합에서 삼층 결론·합화 성립·강도·해소 계산",
    "positive": "확인된 pair들을 출처별로 나란히 비교",
    "risk": "동일 root를 여러 이름으로 독립 증거화",
    "twist": "세 층위의 관련성이 약하면 pair별 설명만 유지",
    "requires": [
      "각 pair ID·participant owner·period·formation·countercondition"
    ],
    "formation": "existing producer confirmed result only; possible/unsupported remain separate",
    "traditionalStatus": "상속 TEMPORAL_SCOPES·TEMPORAL_RELATIONS의 class/support를 보존; 현대 적용과 별도",
    "counterconditions": [
      "해당 participant 부재",
      "유효 기간 교집합 없음",
      "출처·방향·자리 불일치",
      "성립 조건 미검증"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:temporal",
      "mfpr:source:decade",
      "mfpr:source:interaction"
    ],
    "verification": "conditional_not_composite_verdict"
  }
];
