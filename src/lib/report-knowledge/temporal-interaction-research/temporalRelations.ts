import type { RelationTemporal } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_RELATIONS = [
  {
    "id": "tr:relation:stem_hap:natal_dayun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "천간합 / natal_dayun",
    "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
    "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
    "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
    "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "stem_hap",
    "definitionRef": "rr:profile:stem_hap",
    "combinationRefs": [
      "rr:combination:stem_hap:甲己",
      "rr:combination:stem_hap:乙庚",
      "rr:combination:stem_hap:丙辛",
      "rr:combination:stem_hap:丁壬",
      "rr:combination:stem_hap:戊癸"
    ],
    "scope": "natal_dayun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:stem_hap:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "천간합 / natal_saeun",
    "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
    "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
    "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
    "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "stem_hap",
    "definitionRef": "rr:profile:stem_hap",
    "combinationRefs": [
      "rr:combination:stem_hap:甲己",
      "rr:combination:stem_hap:乙庚",
      "rr:combination:stem_hap:丙辛",
      "rr:combination:stem_hap:丁壬",
      "rr:combination:stem_hap:戊癸"
    ],
    "scope": "natal_saeun",
    "producerSupport": "partial",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. V4 선택 연주 투영은 구간별 실효 연주 ledger가 아니므로 입춘 전 적용을 승인하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:stem_hap:natal_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "천간합 / natal_wolun",
    "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
    "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
    "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
    "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "stem_hap",
    "definitionRef": "rr:profile:stem_hap",
    "combinationRefs": [
      "rr:combination:stem_hap:甲己",
      "rr:combination:stem_hap:乙庚",
      "rr:combination:stem_hap:丙辛",
      "rr:combination:stem_hap:丁壬",
      "rr:combination:stem_hap:戊癸"
    ],
    "scope": "natal_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:stem_hap:dayun_saeun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "천간합 / dayun_saeun",
    "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
    "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
    "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
    "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "stem_hap",
    "definitionRef": "rr:profile:stem_hap",
    "combinationRefs": [
      "rr:combination:stem_hap:甲己",
      "rr:combination:stem_hap:乙庚",
      "rr:combination:stem_hap:丙辛",
      "rr:combination:stem_hap:丁壬",
      "rr:combination:stem_hap:戊癸"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:stem_hap:dayun_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "천간합 / dayun_wolun",
    "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
    "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
    "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
    "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "stem_hap",
    "definitionRef": "rr:profile:stem_hap",
    "combinationRefs": [
      "rr:combination:stem_hap:甲己",
      "rr:combination:stem_hap:乙庚",
      "rr:combination:stem_hap:丙辛",
      "rr:combination:stem_hap:丁壬",
      "rr:combination:stem_hap:戊癸"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:stem_hap:saeun_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "천간합 / saeun_wolun",
    "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
    "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
    "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
    "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "stem_hap",
    "definitionRef": "rr:profile:stem_hap",
    "combinationRefs": [
      "rr:combination:stem_hap:甲己",
      "rr:combination:stem_hap:乙庚",
      "rr:combination:stem_hap:丙辛",
      "rr:combination:stem_hap:丁壬",
      "rr:combination:stem_hap:戊癸"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:yukhap:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "육합 / natal_dayun",
    "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
    "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
    "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
    "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "yukhap",
    "definitionRef": "rr:profile:yukhap",
    "combinationRefs": [
      "rr:combination:yukhap:子丑",
      "rr:combination:yukhap:寅亥",
      "rr:combination:yukhap:卯戌",
      "rr:combination:yukhap:辰酉",
      "rr:combination:yukhap:巳申",
      "rr:combination:yukhap:午未"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:yukhap:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "육합 / natal_saeun",
    "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
    "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
    "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
    "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "yukhap",
    "definitionRef": "rr:profile:yukhap",
    "combinationRefs": [
      "rr:combination:yukhap:子丑",
      "rr:combination:yukhap:寅亥",
      "rr:combination:yukhap:卯戌",
      "rr:combination:yukhap:辰酉",
      "rr:combination:yukhap:巳申",
      "rr:combination:yukhap:午未"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:yukhap:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "육합 / natal_wolun",
    "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
    "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
    "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
    "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "yukhap",
    "definitionRef": "rr:profile:yukhap",
    "combinationRefs": [
      "rr:combination:yukhap:子丑",
      "rr:combination:yukhap:寅亥",
      "rr:combination:yukhap:卯戌",
      "rr:combination:yukhap:辰酉",
      "rr:combination:yukhap:巳申",
      "rr:combination:yukhap:午未"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:yukhap:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "육합 / dayun_saeun",
    "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
    "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
    "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
    "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "yukhap",
    "definitionRef": "rr:profile:yukhap",
    "combinationRefs": [
      "rr:combination:yukhap:子丑",
      "rr:combination:yukhap:寅亥",
      "rr:combination:yukhap:卯戌",
      "rr:combination:yukhap:辰酉",
      "rr:combination:yukhap:巳申",
      "rr:combination:yukhap:午未"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:yukhap:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "육합 / dayun_wolun",
    "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
    "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
    "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
    "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "yukhap",
    "definitionRef": "rr:profile:yukhap",
    "combinationRefs": [
      "rr:combination:yukhap:子丑",
      "rr:combination:yukhap:寅亥",
      "rr:combination:yukhap:卯戌",
      "rr:combination:yukhap:辰酉",
      "rr:combination:yukhap:巳申",
      "rr:combination:yukhap:午未"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_dayun_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:yukhap:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "육합 / saeun_wolun",
    "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
    "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
    "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
    "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "yukhap",
    "definitionRef": "rr:profile:yukhap",
    "combinationRefs": [
      "rr:combination:yukhap:子丑",
      "rr:combination:yukhap:寅亥",
      "rr:combination:yukhap:卯戌",
      "rr:combination:yukhap:辰酉",
      "rr:combination:yukhap:巳申",
      "rr:combination:yukhap:午未"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_annual_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:chung:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충 / natal_dayun",
    "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
    "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
    "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
    "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "chung",
    "definitionRef": "rr:profile:chung",
    "combinationRefs": [
      "rr:combination:chung:子午",
      "rr:combination:chung:丑未",
      "rr:combination:chung:寅申",
      "rr:combination:chung:卯酉",
      "rr:combination:chung:辰戌",
      "rr:combination:chung:巳亥"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:chung:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충 / natal_saeun",
    "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
    "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
    "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
    "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "chung",
    "definitionRef": "rr:profile:chung",
    "combinationRefs": [
      "rr:combination:chung:子午",
      "rr:combination:chung:丑未",
      "rr:combination:chung:寅申",
      "rr:combination:chung:卯酉",
      "rr:combination:chung:辰戌",
      "rr:combination:chung:巳亥"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:chung:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충 / natal_wolun",
    "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
    "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
    "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
    "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "chung",
    "definitionRef": "rr:profile:chung",
    "combinationRefs": [
      "rr:combination:chung:子午",
      "rr:combination:chung:丑未",
      "rr:combination:chung:寅申",
      "rr:combination:chung:卯酉",
      "rr:combination:chung:辰戌",
      "rr:combination:chung:巳亥"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:chung:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충 / dayun_saeun",
    "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
    "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
    "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
    "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "chung",
    "definitionRef": "rr:profile:chung",
    "combinationRefs": [
      "rr:combination:chung:子午",
      "rr:combination:chung:丑未",
      "rr:combination:chung:寅申",
      "rr:combination:chung:卯酉",
      "rr:combination:chung:辰戌",
      "rr:combination:chung:巳亥"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:chung:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충 / dayun_wolun",
    "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
    "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
    "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
    "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "chung",
    "definitionRef": "rr:profile:chung",
    "combinationRefs": [
      "rr:combination:chung:子午",
      "rr:combination:chung:丑未",
      "rr:combination:chung:寅申",
      "rr:combination:chung:卯酉",
      "rr:combination:chung:辰戌",
      "rr:combination:chung:巳亥"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_dayun_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:chung:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충 / saeun_wolun",
    "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
    "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
    "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
    "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "chung",
    "definitionRef": "rr:profile:chung",
    "combinationRefs": [
      "rr:combination:chung:子午",
      "rr:combination:chung:丑未",
      "rr:combination:chung:寅申",
      "rr:combination:chung:卯酉",
      "rr:combination:chung:辰戌",
      "rr:combination:chung:巳亥"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_annual_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:samhap:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "삼합 / natal_dayun",
    "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
    "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
    "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
    "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "samhap",
    "definitionRef": "rr:profile:samhap",
    "combinationRefs": [
      "rr:combination:samhap:申子辰",
      "rr:combination:samhap:亥卯未",
      "rr:combination:samhap:寅午戌",
      "rr:combination:samhap:巳酉丑"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:samhap:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "삼합 / natal_saeun",
    "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
    "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
    "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
    "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "samhap",
    "definitionRef": "rr:profile:samhap",
    "combinationRefs": [
      "rr:combination:samhap:申子辰",
      "rr:combination:samhap:亥卯未",
      "rr:combination:samhap:寅午戌",
      "rr:combination:samhap:巳酉丑"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:samhap:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "삼합 / natal_wolun",
    "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
    "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
    "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
    "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "samhap",
    "definitionRef": "rr:profile:samhap",
    "combinationRefs": [
      "rr:combination:samhap:申子辰",
      "rr:combination:samhap:亥卯未",
      "rr:combination:samhap:寅午戌",
      "rr:combination:samhap:巳酉丑"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:samhap:dayun_saeun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "삼합 / dayun_saeun",
    "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
    "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
    "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
    "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "samhap",
    "definitionRef": "rr:profile:samhap",
    "combinationRefs": [
      "rr:combination:samhap:申子辰",
      "rr:combination:samhap:亥卯未",
      "rr:combination:samhap:寅午戌",
      "rr:combination:samhap:巳酉丑"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:samhap:dayun_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "삼합 / dayun_wolun",
    "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
    "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
    "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
    "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "samhap",
    "definitionRef": "rr:profile:samhap",
    "combinationRefs": [
      "rr:combination:samhap:申子辰",
      "rr:combination:samhap:亥卯未",
      "rr:combination:samhap:寅午戌",
      "rr:combination:samhap:巳酉丑"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:samhap:saeun_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "삼합 / saeun_wolun",
    "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
    "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
    "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
    "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "samhap",
    "definitionRef": "rr:profile:samhap",
    "combinationRefs": [
      "rr:combination:samhap:申子辰",
      "rr:combination:samhap:亥卯未",
      "rr:combination:samhap:寅午戌",
      "rr:combination:samhap:巳酉丑"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hyeong:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "형 / natal_dayun",
    "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
    "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
    "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
    "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "hyeong",
    "definitionRef": "rr:profile:hyeong",
    "combinationRefs": [
      "rr:combination:hyeong:寅巳",
      "rr:combination:hyeong:巳申",
      "rr:combination:hyeong:申寅",
      "rr:combination:hyeong:丑戌",
      "rr:combination:hyeong:戌未",
      "rr:combination:hyeong:未丑",
      "rr:combination:hyeong:子卯",
      "rr:combination:hyeong:辰辰",
      "rr:combination:hyeong:午午",
      "rr:combination:hyeong:酉酉",
      "rr:combination:hyeong:亥亥",
      "rr:combination:hyeong:寅巳申",
      "rr:combination:hyeong:丑戌未"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hyeong:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "형 / natal_saeun",
    "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
    "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
    "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
    "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "hyeong",
    "definitionRef": "rr:profile:hyeong",
    "combinationRefs": [
      "rr:combination:hyeong:寅巳",
      "rr:combination:hyeong:巳申",
      "rr:combination:hyeong:申寅",
      "rr:combination:hyeong:丑戌",
      "rr:combination:hyeong:戌未",
      "rr:combination:hyeong:未丑",
      "rr:combination:hyeong:子卯",
      "rr:combination:hyeong:辰辰",
      "rr:combination:hyeong:午午",
      "rr:combination:hyeong:酉酉",
      "rr:combination:hyeong:亥亥",
      "rr:combination:hyeong:寅巳申",
      "rr:combination:hyeong:丑戌未"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hyeong:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "형 / natal_wolun",
    "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
    "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
    "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
    "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "hyeong",
    "definitionRef": "rr:profile:hyeong",
    "combinationRefs": [
      "rr:combination:hyeong:寅巳",
      "rr:combination:hyeong:巳申",
      "rr:combination:hyeong:申寅",
      "rr:combination:hyeong:丑戌",
      "rr:combination:hyeong:戌未",
      "rr:combination:hyeong:未丑",
      "rr:combination:hyeong:子卯",
      "rr:combination:hyeong:辰辰",
      "rr:combination:hyeong:午午",
      "rr:combination:hyeong:酉酉",
      "rr:combination:hyeong:亥亥",
      "rr:combination:hyeong:寅巳申",
      "rr:combination:hyeong:丑戌未"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hyeong:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "형 / dayun_saeun",
    "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
    "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
    "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
    "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "hyeong",
    "definitionRef": "rr:profile:hyeong",
    "combinationRefs": [
      "rr:combination:hyeong:寅巳",
      "rr:combination:hyeong:巳申",
      "rr:combination:hyeong:申寅",
      "rr:combination:hyeong:丑戌",
      "rr:combination:hyeong:戌未",
      "rr:combination:hyeong:未丑",
      "rr:combination:hyeong:子卯",
      "rr:combination:hyeong:辰辰",
      "rr:combination:hyeong:午午",
      "rr:combination:hyeong:酉酉",
      "rr:combination:hyeong:亥亥",
      "rr:combination:hyeong:寅巳申",
      "rr:combination:hyeong:丑戌未"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hyeong:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "형 / dayun_wolun",
    "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
    "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
    "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
    "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "hyeong",
    "definitionRef": "rr:profile:hyeong",
    "combinationRefs": [
      "rr:combination:hyeong:寅巳",
      "rr:combination:hyeong:巳申",
      "rr:combination:hyeong:申寅",
      "rr:combination:hyeong:丑戌",
      "rr:combination:hyeong:戌未",
      "rr:combination:hyeong:未丑",
      "rr:combination:hyeong:子卯",
      "rr:combination:hyeong:辰辰",
      "rr:combination:hyeong:午午",
      "rr:combination:hyeong:酉酉",
      "rr:combination:hyeong:亥亥",
      "rr:combination:hyeong:寅巳申",
      "rr:combination:hyeong:丑戌未"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_dayun_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hyeong:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "형 / saeun_wolun",
    "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
    "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
    "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
    "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "hyeong",
    "definitionRef": "rr:profile:hyeong",
    "combinationRefs": [
      "rr:combination:hyeong:寅巳",
      "rr:combination:hyeong:巳申",
      "rr:combination:hyeong:申寅",
      "rr:combination:hyeong:丑戌",
      "rr:combination:hyeong:戌未",
      "rr:combination:hyeong:未丑",
      "rr:combination:hyeong:子卯",
      "rr:combination:hyeong:辰辰",
      "rr:combination:hyeong:午午",
      "rr:combination:hyeong:酉酉",
      "rr:combination:hyeong:亥亥",
      "rr:combination:hyeong:寅巳申",
      "rr:combination:hyeong:丑戌未"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_annual_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hae:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "해 / natal_dayun",
    "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
    "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
    "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
    "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "hae",
    "definitionRef": "rr:profile:hae",
    "combinationRefs": [
      "rr:combination:hae:子未",
      "rr:combination:hae:丑午",
      "rr:combination:hae:寅巳",
      "rr:combination:hae:卯辰",
      "rr:combination:hae:申亥",
      "rr:combination:hae:酉戌"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hae:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "해 / natal_saeun",
    "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
    "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
    "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
    "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "hae",
    "definitionRef": "rr:profile:hae",
    "combinationRefs": [
      "rr:combination:hae:子未",
      "rr:combination:hae:丑午",
      "rr:combination:hae:寅巳",
      "rr:combination:hae:卯辰",
      "rr:combination:hae:申亥",
      "rr:combination:hae:酉戌"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hae:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "해 / natal_wolun",
    "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
    "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
    "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
    "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "hae",
    "definitionRef": "rr:profile:hae",
    "combinationRefs": [
      "rr:combination:hae:子未",
      "rr:combination:hae:丑午",
      "rr:combination:hae:寅巳",
      "rr:combination:hae:卯辰",
      "rr:combination:hae:申亥",
      "rr:combination:hae:酉戌"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hae:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "해 / dayun_saeun",
    "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
    "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
    "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
    "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "hae",
    "definitionRef": "rr:profile:hae",
    "combinationRefs": [
      "rr:combination:hae:子未",
      "rr:combination:hae:丑午",
      "rr:combination:hae:寅巳",
      "rr:combination:hae:卯辰",
      "rr:combination:hae:申亥",
      "rr:combination:hae:酉戌"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hae:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "해 / dayun_wolun",
    "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
    "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
    "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
    "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "hae",
    "definitionRef": "rr:profile:hae",
    "combinationRefs": [
      "rr:combination:hae:子未",
      "rr:combination:hae:丑午",
      "rr:combination:hae:寅巳",
      "rr:combination:hae:卯辰",
      "rr:combination:hae:申亥",
      "rr:combination:hae:酉戌"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_dayun_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:hae:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "해 / saeun_wolun",
    "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
    "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
    "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
    "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "hae",
    "definitionRef": "rr:profile:hae",
    "combinationRefs": [
      "rr:combination:hae:子未",
      "rr:combination:hae:丑午",
      "rr:combination:hae:寅巳",
      "rr:combination:hae:卯辰",
      "rr:combination:hae:申亥",
      "rr:combination:hae:酉戌"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_annual_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:banhap:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합 / natal_dayun",
    "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
    "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
    "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
    "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "banhap",
    "definitionRef": "rr:profile:banhap",
    "combinationRefs": [
      "rr:combination:banhap:申子",
      "rr:combination:banhap:申辰",
      "rr:combination:banhap:子辰",
      "rr:combination:banhap:亥卯",
      "rr:combination:banhap:亥未",
      "rr:combination:banhap:卯未",
      "rr:combination:banhap:寅午",
      "rr:combination:banhap:寅戌",
      "rr:combination:banhap:午戌",
      "rr:combination:banhap:巳酉",
      "rr:combination:banhap:巳丑",
      "rr:combination:banhap:酉丑"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:banhap:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합 / natal_saeun",
    "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
    "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
    "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
    "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "banhap",
    "definitionRef": "rr:profile:banhap",
    "combinationRefs": [
      "rr:combination:banhap:申子",
      "rr:combination:banhap:申辰",
      "rr:combination:banhap:子辰",
      "rr:combination:banhap:亥卯",
      "rr:combination:banhap:亥未",
      "rr:combination:banhap:卯未",
      "rr:combination:banhap:寅午",
      "rr:combination:banhap:寅戌",
      "rr:combination:banhap:午戌",
      "rr:combination:banhap:巳酉",
      "rr:combination:banhap:巳丑",
      "rr:combination:banhap:酉丑"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:banhap:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합 / natal_wolun",
    "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
    "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
    "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
    "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "banhap",
    "definitionRef": "rr:profile:banhap",
    "combinationRefs": [
      "rr:combination:banhap:申子",
      "rr:combination:banhap:申辰",
      "rr:combination:banhap:子辰",
      "rr:combination:banhap:亥卯",
      "rr:combination:banhap:亥未",
      "rr:combination:banhap:卯未",
      "rr:combination:banhap:寅午",
      "rr:combination:banhap:寅戌",
      "rr:combination:banhap:午戌",
      "rr:combination:banhap:巳酉",
      "rr:combination:banhap:巳丑",
      "rr:combination:banhap:酉丑"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:banhap:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합 / dayun_saeun",
    "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
    "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
    "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
    "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "banhap",
    "definitionRef": "rr:profile:banhap",
    "combinationRefs": [
      "rr:combination:banhap:申子",
      "rr:combination:banhap:申辰",
      "rr:combination:banhap:子辰",
      "rr:combination:banhap:亥卯",
      "rr:combination:banhap:亥未",
      "rr:combination:banhap:卯未",
      "rr:combination:banhap:寅午",
      "rr:combination:banhap:寅戌",
      "rr:combination:banhap:午戌",
      "rr:combination:banhap:巳酉",
      "rr:combination:banhap:巳丑",
      "rr:combination:banhap:酉丑"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:banhap:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합 / dayun_wolun",
    "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
    "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
    "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
    "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "banhap",
    "definitionRef": "rr:profile:banhap",
    "combinationRefs": [
      "rr:combination:banhap:申子",
      "rr:combination:banhap:申辰",
      "rr:combination:banhap:子辰",
      "rr:combination:banhap:亥卯",
      "rr:combination:banhap:亥未",
      "rr:combination:banhap:卯未",
      "rr:combination:banhap:寅午",
      "rr:combination:banhap:寅戌",
      "rr:combination:banhap:午戌",
      "rr:combination:banhap:巳酉",
      "rr:combination:banhap:巳丑",
      "rr:combination:banhap:酉丑"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_dayun_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:banhap:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합 / saeun_wolun",
    "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
    "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
    "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
    "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "banhap",
    "definitionRef": "rr:profile:banhap",
    "combinationRefs": [
      "rr:combination:banhap:申子",
      "rr:combination:banhap:申辰",
      "rr:combination:banhap:子辰",
      "rr:combination:banhap:亥卯",
      "rr:combination:banhap:亥未",
      "rr:combination:banhap:卯未",
      "rr:combination:banhap:寅午",
      "rr:combination:banhap:寅戌",
      "rr:combination:banhap:午戌",
      "rr:combination:banhap:巳酉",
      "rr:combination:banhap:巳丑",
      "rr:combination:banhap:酉丑"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_annual_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:pa:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "파 / natal_dayun",
    "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
    "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
    "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
    "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "pa",
    "definitionRef": "rr:profile:pa",
    "combinationRefs": [
      "rr:combination:pa:子酉",
      "rr:combination:pa:丑辰",
      "rr:combination:pa:寅亥",
      "rr:combination:pa:卯午",
      "rr:combination:pa:巳申",
      "rr:combination:pa:未戌"
    ],
    "scope": "natal_dayun",
    "producerSupport": "supported",
    "producerRefs": [
      "majorFortuneEvidence:branchInteractions"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:pa:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "파 / natal_saeun",
    "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
    "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
    "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
    "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "pa",
    "definitionRef": "rr:profile:pa",
    "combinationRefs": [
      "rr:combination:pa:子酉",
      "rr:combination:pa:丑辰",
      "rr:combination:pa:寅亥",
      "rr:combination:pa:卯午",
      "rr:combination:pa:巳申",
      "rr:combination:pa:未戌"
    ],
    "scope": "natal_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:pa:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "파 / natal_wolun",
    "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
    "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
    "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
    "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "pa",
    "definitionRef": "rr:profile:pa",
    "combinationRefs": [
      "rr:combination:pa:子酉",
      "rr:combination:pa:丑辰",
      "rr:combination:pa:寅亥",
      "rr:combination:pa:卯午",
      "rr:combination:pa:巳申",
      "rr:combination:pa:未戌"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:pa:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "파 / dayun_saeun",
    "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
    "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
    "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
    "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "pa",
    "definitionRef": "rr:profile:pa",
    "combinationRefs": [
      "rr:combination:pa:子酉",
      "rr:combination:pa:丑辰",
      "rr:combination:pa:寅亥",
      "rr:combination:pa:卯午",
      "rr:combination:pa:巳申",
      "rr:combination:pa:未戌"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:pa:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "파 / dayun_wolun",
    "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
    "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
    "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
    "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "pa",
    "definitionRef": "rr:profile:pa",
    "combinationRefs": [
      "rr:combination:pa:子酉",
      "rr:combination:pa:丑辰",
      "rr:combination:pa:寅亥",
      "rr:combination:pa:卯午",
      "rr:combination:pa:巳申",
      "rr:combination:pa:未戌"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_dayun_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:pa:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "파 / saeun_wolun",
    "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
    "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
    "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
    "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "pa",
    "definitionRef": "rr:profile:pa",
    "combinationRefs": [
      "rr:combination:pa:子酉",
      "rr:combination:pa:丑辰",
      "rr:combination:pa:寅亥",
      "rr:combination:pa:卯午",
      "rr:combination:pa:巳申",
      "rr:combination:pa:未戌"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthJie:month_annual_branch"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:wonjin:natal_dayun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 / natal_dayun",
    "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
    "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
    "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
    "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
    "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "relation": "wonjin",
    "definitionRef": "rr:profile:wonjin",
    "combinationRefs": [
      "rr:combination:wonjin:子未",
      "rr:combination:wonjin:丑午",
      "rr:combination:wonjin:寅酉",
      "rr:combination:wonjin:卯申",
      "rr:combination:wonjin:辰亥",
      "rr:combination:wonjin:巳戌"
    ],
    "scope": "natal_dayun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:wonjin:natal_saeun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 / natal_saeun",
    "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
    "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
    "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
    "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
    "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "relation": "wonjin",
    "definitionRef": "rr:profile:wonjin",
    "combinationRefs": [
      "rr:combination:wonjin:子未",
      "rr:combination:wonjin:丑午",
      "rr:combination:wonjin:寅酉",
      "rr:combination:wonjin:卯申",
      "rr:combination:wonjin:辰亥",
      "rr:combination:wonjin:巳戌"
    ],
    "scope": "natal_saeun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:wonjin:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 / natal_wolun",
    "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
    "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
    "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
    "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
    "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "relation": "wonjin",
    "definitionRef": "rr:profile:wonjin",
    "combinationRefs": [
      "rr:combination:wonjin:子未",
      "rr:combination:wonjin:丑午",
      "rr:combination:wonjin:寅酉",
      "rr:combination:wonjin:卯申",
      "rr:combination:wonjin:辰亥",
      "rr:combination:wonjin:巳戌"
    ],
    "scope": "natal_wolun",
    "producerSupport": "supported",
    "producerRefs": [
      "annualMonthRelationFacts + annualMonthExtendedEvidence"
    ],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:wonjin:dayun_saeun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 / dayun_saeun",
    "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
    "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
    "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
    "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
    "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "relation": "wonjin",
    "definitionRef": "rr:profile:wonjin",
    "combinationRefs": [
      "rr:combination:wonjin:子未",
      "rr:combination:wonjin:丑午",
      "rr:combination:wonjin:寅酉",
      "rr:combination:wonjin:卯申",
      "rr:combination:wonjin:辰亥",
      "rr:combination:wonjin:巳戌"
    ],
    "scope": "dayun_saeun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:wonjin:dayun_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 / dayun_wolun",
    "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
    "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
    "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
    "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
    "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "relation": "wonjin",
    "definitionRef": "rr:profile:wonjin",
    "combinationRefs": [
      "rr:combination:wonjin:子未",
      "rr:combination:wonjin:丑午",
      "rr:combination:wonjin:寅酉",
      "rr:combination:wonjin:卯申",
      "rr:combination:wonjin:辰亥",
      "rr:combination:wonjin:巳戌"
    ],
    "scope": "dayun_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:relation:wonjin:saeun_wolun",
    "class": "G",
    "sourceRefs": [
      "repo-relations",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 / saeun_wolun",
    "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
    "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
    "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
    "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
    "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
    "requires": [
      "실제 참가자의 소유자·자리·간지",
      "유효 구간의 교집합",
      "이전 연구의 성립·제외 조건"
    ],
    "excludes": [
      "미상 시주 대체",
      "서로 다른 시점의 관계 합산",
      "연구 조합을 검출 결과로 위장"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "relation": "wonjin",
    "definitionRef": "rr:profile:wonjin",
    "combinationRefs": [
      "rr:combination:wonjin:子未",
      "rr:combination:wonjin:丑午",
      "rr:combination:wonjin:寅酉",
      "rr:combination:wonjin:卯申",
      "rr:combination:wonjin:辰亥",
      "rr:combination:wonjin:巳戌"
    ],
    "scope": "saeun_wolun",
    "producerSupport": "unsupported",
    "producerRefs": [],
    "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
    "fieldClasses": {
      "meaning": "G",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  }
] as const satisfies readonly RelationTemporal[];
