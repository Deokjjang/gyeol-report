/** Static offline coworker research. No runtime registration or customer approval. */
import type { InputCase } from "./researchTypes";
export const CW_INPUT_CASES: readonly InputCase[] = [
  {
    "id": "cwpr:case:A",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "A",
    "description": "양쪽 MBTI 있음",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:B",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "B",
    "description": "A만 MBTI",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:C",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "C",
    "description": "B만 MBTI",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:D",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:E",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "E",
    "description": "A 출생시간 미상",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:F",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "F",
    "description": "B 출생시간 미상",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:G",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:H",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:I",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:J",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:K",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:L",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "L",
    "description": "교차 지지 미검출",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:M",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "M",
    "description": "미지원 정의만 존재",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:N",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "N",
    "description": "방향 십성이 다름",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:O",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "O",
    "description": "방향 십성이 같음",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:P",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "P",
    "description": "전체 인물 순서 교환",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:Q",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "Q",
    "description": "이름만 교환",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
        "relationshipType": "coworker",
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
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:R",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "R",
    "description": "deterministic replay",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
        "relationshipType": "coworker",
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
    "requiredPredicate": "replay",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:S",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "S",
    "description": "coworker 범위",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "coworker_scope",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:T",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "T",
    "description": "managerReport 비교",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "managerReport",
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
    "requiredPredicate": "manager_category",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:U",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "U",
    "description": "businessPartner 비교",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "businessPartner",
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
    "requiredPredicate": "business_category",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:V",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "V",
    "description": "friendship 비교",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "friendship",
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
    "requiredPredicate": "friend_category",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:W",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "W",
    "description": "WORK 원천과 projection 차이",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "work_gap",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:X",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "X",
    "description": "실제 업무 정보 없음",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "unknown_work",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:Y",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "Y",
    "description": "계획 실행 검토 가상 작업",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "hypothetical_process",
    "hypotheticalContext": {
      "status": "hypothetical_only",
      "condition": "계획 실행 검토 가상 작업"
    },
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:Z",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "Z",
    "description": "마감 변경 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "hypothetical_deadline",
    "hypotheticalContext": {
      "status": "hypothetical_only",
      "condition": "마감 변경 가상 상황"
    },
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AA",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AA",
    "description": "인수인계 누락 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "hypothetical_handoff",
    "hypotheticalContext": {
      "status": "hypothetical_only",
      "condition": "인수인계 누락 가상 상황"
    },
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AB",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AB",
    "description": "피드백 오해 가상 상황",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "hypothetical_feedback",
    "hypotheticalContext": {
      "status": "hypothetical_only",
      "condition": "피드백 오해 가상 상황"
    },
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AC",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AC",
    "description": "다른 강점의 실제 signed 비교",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "different_strengths",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AD",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AD",
    "description": "같은 입력의 강점 비교",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
          "name": "검수가상동료B",
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
    "requiredPredicate": "similar_strengths",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AE",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AE",
    "description": "실제 권한 미확인",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "unknown_authority",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AF",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AF",
    "description": "업무 적용 domain 미승인 보류",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "research_withhold",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AG",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AG",
    "description": "기존 fallback 관찰",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "fallback_observe",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AH",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AH",
    "description": "다른 6카테고리 격리",
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
      },
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "parentChild",
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
        "relationshipType": "managerReport",
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
        "relationshipType": "businessPartner",
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
        "relationshipType": "friendship",
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
    "requiredPredicate": "other_categories",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  },
  {
    "id": "cwpr:case:AI",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "letter": "AI",
    "description": "기존 Book 원고 보존",
    "variants": [
      {
        "productKey": "saju_mbti_compatibility",
        "productSlug": "compatibility",
        "compatibilityRoleVersion": "compatibility-fixed-ab-v1",
        "relationshipType": "coworker",
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
    "requiredPredicate": "book_preservation",
    "hypotheticalContext": null,
    "contextIsNotPayload": true,
    "authority": "UNKNOWN",
    "jobRole": "UNKNOWN",
    "workplace": "UNKNOWN",
    "workHistory": "UNKNOWN",
    "isFictional": true,
    "researchBindingAllowed": false
  }
];
