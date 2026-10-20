/** Offline marriage research; no runtime binding or customer approval. */
import type { InputCase } from "./researchTypes";
export const MARRIAGE_INPUT_CASES: readonly InputCase[] = [
  {
    "id": "cmpr:case:A",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "A",
    "description": "양쪽 유형 기지",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "both_mbti",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:B",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "B",
    "description": "A만 유형 기지",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "a_only",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:C",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "C",
    "description": "B만 유형 기지",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "b_only",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:D",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "D",
    "description": "양쪽 MBTI 미상",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "neither_mbti",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:E",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "E",
    "description": "A 시간 미상",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "a_unknown_hour",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:F",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "F",
    "description": "B 시간 미상",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "b_unknown_hour",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:G",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "G",
    "description": "양쪽 시간 확정",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "both_known_hour",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:H",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "H",
    "description": "같은 유형",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "INTP",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "same_mbti",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:I",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "I",
    "description": "다른 유형",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "different_mbti",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:J",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "J",
    "description": "실제 합",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "harmony",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:K",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "K",
    "description": "실제 충",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "clash",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:L",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "L",
    "description": "합·충 공존",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "both_relations",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:M",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "M",
    "description": "교차 지지 관계 부재; 일간 방향은 남음",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "검수가상고요A",
          "birthDate": "1996-12-08",
          "birthTime": "",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "검수가상고요B",
          "birthDate": "1996-12-08",
          "birthTime": "",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "no_cross_branch",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:N",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "N",
    "description": "미지원 원진 연구만 참조한 가상 조건; 검출·참여자 추정 금지",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "검수가상고요A",
          "birthDate": "1996-12-08",
          "birthTime": "",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "검수가상고요B",
          "birthDate": "1996-12-08",
          "birthTime": "",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "unsupported_reference_only",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:O",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "O",
    "description": "수신자 기준 십성 다른 경우",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "different_ten_god",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:P",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "P",
    "description": "양방향 비견의 수렴",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "도윤",
          "birthDate": "1985-06-30",
          "birthTime": "06:00",
          "mbtiType": "INFJ",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "하린",
          "birthDate": "2001-01-27",
          "birthTime": "18:20",
          "mbtiType": "ESTP",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "same_ten_god",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:Q",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "Q",
    "description": "전체 A/B 순서 교환",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      },
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "whole_swap",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:R",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "R",
    "description": "이름만 교환",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      },
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "소연",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "현우",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "name_swap",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:S",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "S",
    "description": "원국 유지·A MBTI만 변경",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      },
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INFJ",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "mbti_counterfactual",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:T",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "T",
    "description": "동일 인물 love→marriage",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "love",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      },
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "category_counterfactual",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:U",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "U",
    "description": "marriage 선택; 실제 혼인·동거 입력 없음",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "unconfirmed_status",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:V",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "V",
    "description": "공동 지출을 검토한다는 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "hypothetical_financial",
    "hypotheticalContext": {
      "kind": "FINANCIAL_SCENE",
      "condition": "공동 비용을 관리하기로 한다면",
      "unconfirmed": [
        "income",
        "debt",
        "assets",
        "joint_accounts"
      ]
    },
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:W",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "W",
    "description": "가사 단계를 나눈다는 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "hypothetical_household",
    "hypotheticalContext": {
      "kind": "HOUSEHOLD_SCENE",
      "condition": "업무 하나를 공동으로 나눈다면",
      "unconfirmed": [
        "current_tasks",
        "ability",
        "time_available",
        "care_dependents"
      ]
    },
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:X",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "X",
    "description": "친족 행사 참석을 논의한다는 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "hypothetical_family",
    "hypotheticalContext": {
      "kind": "FAMILY_SCENE",
      "condition": "친족 행사를 논의한다면",
      "unconfirmed": [
        "family_exists_or_demands",
        "attendance",
        "support_duty"
      ]
    },
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:Y",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "Y",
    "description": "근무·소득이 달라진다는 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "hypothetical_transition",
    "hypotheticalContext": {
      "kind": "LIFE_TRANSITION_SCENE",
      "condition": "근무·소득 조건이 달라진다면",
      "unconfirmed": [
        "employment",
        "income_change",
        "date",
        "cause"
      ]
    },
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:Z",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "Z",
    "description": "생활 갈등이 반복된다면이라는 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "hypothetical_repair",
    "hypotheticalContext": {
      "kind": "REPAIR_SCENE",
      "condition": "실제로 갈등이 반복되어 다시 논의하기로 동의했다면",
      "unconfirmed": [
        "past_conflict",
        "fault",
        "willingness_to_reconcile"
      ]
    },
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:AA",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AA",
    "description": "실제 개인 원천과 합이 풍부한 경우; 공동생활 강점은 조건부",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "현우",
          "birthDate": "1992-12-14",
          "birthTime": "22:30",
          "mbtiType": "INTP",
          "gender": "MALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "소연",
          "birthDate": "1995-04-08",
          "birthTime": "09:15",
          "mbtiType": "ESFJ",
          "gender": "FEMALE",
          "birthTimeUnknown": false,
          "birthTimePrecision": "exact",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "rich_sources",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  },
  {
    "id": "cmpr:case:AB",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AB",
    "description": "기존 동일 원국 reader fallback 검수",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "marriage",
        "personA": {
          "name": "검수가상고요A",
          "birthDate": "1996-12-08",
          "birthTime": "",
          "mbtiType": "",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        },
        "personB": {
          "name": "검수가상고요B",
          "birthDate": "1996-12-08",
          "birthTime": "",
          "mbtiType": "",
          "gender": "MALE",
          "birthTimeUnknown": true,
          "birthTimePrecision": "unknown",
          "approximateBirthTimeSlot": ""
        }
      }
    ],
    "requiredPredicate": "existing_fallback",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "maritalStatusConfirmed": false,
    "isFictional": true,
    "notCustomerHistory": true
  }
];
