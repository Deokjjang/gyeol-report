import type { YearStudy } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_YEAR_MATRIX: readonly YearStudy[] = [
  {
    "id": "mfpr:slot:minus3",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": -3,
    "yearExpression": "baseYear-3",
    "timePosition": "past",
    "scope": "year",
    "purpose": "과거 비교의 첫 관찰",
    "focus": "이후 연도의 기준과 비교할 당시의 배경",
    "limit": "경험 여부를 모르면 당시 사건 대신 질문만 남긴다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "과거 비교의 첫 관찰에서 장기 배경을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "과거 비교의 첫 관찰에서 세운이 추가하는 조건을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "과거 비교의 첫 관찰에서 다른 연도와 구별되는 근거을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "과거 비교의 첫 관찰에서 긍정적으로 활용 가능한 조건을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "과거 비교의 첫 관찰에서 함께 존재하는 위험을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "과거 비교의 첫 관찰에서 원국 특성과의 관련을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "과거 비교의 첫 관찰에서 이전 연도와의 비교을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "과거 비교의 첫 관찰에서 다음 연도와 이어갈 질문을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "과거 비교의 첫 관찰에서 교운과 적용 구간을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "과거 비교의 첫 관찰에서 적합한 생활 영역을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "과거 비교의 첫 관찰에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "과거 비교의 첫 관찰에서 독자에게 새로 전달할 정보을 확인할 때, 이후 연도의 기준과 비교할 당시의 배경에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:minus2",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": -2,
    "yearExpression": "baseYear-2",
    "timePosition": "past",
    "scope": "year",
    "purpose": "과거 배경의 지속과 차이",
    "focus": "앞선 해와 비교해 유지·변경된 실제 조건",
    "limit": "기억된 일의 원인을 계산만으로 확정하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "과거 배경의 지속과 차이에서 장기 배경을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "과거 배경의 지속과 차이에서 세운이 추가하는 조건을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "과거 배경의 지속과 차이에서 다른 연도와 구별되는 근거을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "과거 배경의 지속과 차이에서 긍정적으로 활용 가능한 조건을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "과거 배경의 지속과 차이에서 함께 존재하는 위험을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "과거 배경의 지속과 차이에서 원국 특성과의 관련을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "과거 배경의 지속과 차이에서 이전 연도와의 비교을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "과거 배경의 지속과 차이에서 다음 연도와 이어갈 질문을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "과거 배경의 지속과 차이에서 교운과 적용 구간을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "과거 배경의 지속과 차이에서 적합한 생활 영역을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "과거 배경의 지속과 차이에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "과거 배경의 지속과 차이에서 독자에게 새로 전달할 정보을 확인할 때, 앞선 해와 비교해 유지·변경된 실제 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:minus1",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": -1,
    "yearExpression": "baseYear-1",
    "timePosition": "past",
    "scope": "year",
    "purpose": "현재로 이어지는 비교",
    "focus": "지금의 질문과 직전 기간의 차이",
    "limit": "오늘의 직업이나 관계를 작년의 사실로 쓰지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "현재로 이어지는 비교에서 장기 배경을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "현재로 이어지는 비교에서 세운이 추가하는 조건을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "현재로 이어지는 비교에서 다른 연도와 구별되는 근거을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "현재로 이어지는 비교에서 긍정적으로 활용 가능한 조건을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "현재로 이어지는 비교에서 함께 존재하는 위험을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "현재로 이어지는 비교에서 원국 특성과의 관련을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "현재로 이어지는 비교에서 이전 연도와의 비교을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "현재로 이어지는 비교에서 다음 연도와 이어갈 질문을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "현재로 이어지는 비교에서 교운과 적용 구간을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "현재로 이어지는 비교에서 적합한 생활 영역을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "현재로 이어지는 비교에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "현재로 이어지는 비교에서 독자에게 새로 전달할 정보을 확인할 때, 지금의 질문과 직전 기간의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus0",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 0,
    "yearExpression": "baseYear",
    "timePosition": "current",
    "scope": "year",
    "purpose": "평가 순간과 달력 연도의 구분",
    "focus": "연도 row의 cycle과 지금 활성 cycle의 차이",
    "limit": "교운 범위 안이면 현재 대운을 확정하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "평가 순간과 달력 연도의 구분에서 장기 배경을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "평가 순간과 달력 연도의 구분에서 세운이 추가하는 조건을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "평가 순간과 달력 연도의 구분에서 다른 연도와 구별되는 근거을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "평가 순간과 달력 연도의 구분에서 긍정적으로 활용 가능한 조건을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "평가 순간과 달력 연도의 구분에서 함께 존재하는 위험을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "평가 순간과 달력 연도의 구분에서 원국 특성과의 관련을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "평가 순간과 달력 연도의 구분에서 이전 연도와의 비교을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "평가 순간과 달력 연도의 구분에서 다음 연도와 이어갈 질문을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "평가 순간과 달력 연도의 구분에서 교운과 적용 구간을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "평가 순간과 달력 연도의 구분에서 적합한 생활 영역을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "평가 순간과 달력 연도의 구분에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "평가 순간과 달력 연도의 구분에서 독자에게 새로 전달할 정보을 확인할 때, 연도 row의 cycle과 지금 활성 cycle의 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus1",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 1,
    "yearExpression": "baseYear+1",
    "timePosition": "future",
    "scope": "year",
    "purpose": "가까운 선택의 조건",
    "focus": "지금 유지할 기준과 다음 연도의 추가 조건",
    "limit": "현재 계획의 실행·성공이 예정됐다고 쓰지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "가까운 선택의 조건에서 장기 배경을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "가까운 선택의 조건에서 세운이 추가하는 조건을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "가까운 선택의 조건에서 다른 연도와 구별되는 근거을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "가까운 선택의 조건에서 긍정적으로 활용 가능한 조건을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "가까운 선택의 조건에서 함께 존재하는 위험을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "가까운 선택의 조건에서 원국 특성과의 관련을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "가까운 선택의 조건에서 이전 연도와의 비교을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "가까운 선택의 조건에서 다음 연도와 이어갈 질문을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "가까운 선택의 조건에서 교운과 적용 구간을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "가까운 선택의 조건에서 적합한 생활 영역을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "가까운 선택의 조건에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "가까운 선택의 조건에서 독자에게 새로 전달할 정보을 확인할 때, 지금 유지할 기준과 다음 연도의 추가 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus2",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 2,
    "yearExpression": "baseYear+2",
    "timePosition": "future",
    "scope": "year",
    "purpose": "단기 조건과 장기 기준의 비교",
    "focus": "바뀐 연주가 같은 배경에서 만드는 실제 차이",
    "limit": "이미 적응했거나 성과를 냈다고 전제하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "단기 조건과 장기 기준의 비교에서 장기 배경을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "단기 조건과 장기 기준의 비교에서 세운이 추가하는 조건을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "단기 조건과 장기 기준의 비교에서 다른 연도와 구별되는 근거을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "단기 조건과 장기 기준의 비교에서 긍정적으로 활용 가능한 조건을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "단기 조건과 장기 기준의 비교에서 함께 존재하는 위험을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "단기 조건과 장기 기준의 비교에서 원국 특성과의 관련을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "단기 조건과 장기 기준의 비교에서 이전 연도와의 비교을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "단기 조건과 장기 기준의 비교에서 다음 연도와 이어갈 질문을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "단기 조건과 장기 기준의 비교에서 교운과 적용 구간을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "단기 조건과 장기 기준의 비교에서 적합한 생활 영역을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "단기 조건과 장기 기준의 비교에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "단기 조건과 장기 기준의 비교에서 독자에게 새로 전달할 정보을 확인할 때, 바뀐 연주가 같은 배경에서 만드는 실제 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus3",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 3,
    "yearExpression": "baseYear+3",
    "timePosition": "future",
    "scope": "year",
    "purpose": "현재 생활 예시의 유효성 재검토",
    "focus": "현재 입력 맥락이 먼 시기에도 필요한지",
    "limit": "현재 직업·수입을 미래 사실로 반복하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "현재 생활 예시의 유효성 재검토에서 장기 배경을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "현재 생활 예시의 유효성 재검토에서 세운이 추가하는 조건을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "현재 생활 예시의 유효성 재검토에서 다른 연도와 구별되는 근거을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "현재 생활 예시의 유효성 재검토에서 긍정적으로 활용 가능한 조건을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "현재 생활 예시의 유효성 재검토에서 함께 존재하는 위험을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "현재 생활 예시의 유효성 재검토에서 원국 특성과의 관련을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "현재 생활 예시의 유효성 재검토에서 이전 연도와의 비교을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "현재 생활 예시의 유효성 재검토에서 다음 연도와 이어갈 질문을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "현재 생활 예시의 유효성 재검토에서 교운과 적용 구간을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "현재 생활 예시의 유효성 재검토에서 적합한 생활 영역을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "현재 생활 예시의 유효성 재검토에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "현재 생활 예시의 유효성 재검토에서 독자에게 새로 전달할 정보을 확인할 때, 현재 입력 맥락이 먼 시기에도 필요한지에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus4",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 4,
    "yearExpression": "baseYear+4",
    "timePosition": "future",
    "scope": "year",
    "purpose": "공통 근거의 정보 소진 확인",
    "focus": "앞서 설명한 root 외에 새로 확인된 관계",
    "limit": "새로운 근거가 없으면 유지·비교로 남긴다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "공통 근거의 정보 소진 확인에서 장기 배경을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "공통 근거의 정보 소진 확인에서 세운이 추가하는 조건을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "공통 근거의 정보 소진 확인에서 다른 연도와 구별되는 근거을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "공통 근거의 정보 소진 확인에서 긍정적으로 활용 가능한 조건을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "공통 근거의 정보 소진 확인에서 함께 존재하는 위험을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "공통 근거의 정보 소진 확인에서 원국 특성과의 관련을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "공통 근거의 정보 소진 확인에서 이전 연도와의 비교을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "공통 근거의 정보 소진 확인에서 다음 연도와 이어갈 질문을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "공통 근거의 정보 소진 확인에서 교운과 적용 구간을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "공통 근거의 정보 소진 확인에서 적합한 생활 영역을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "공통 근거의 정보 소진 확인에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "공통 근거의 정보 소진 확인에서 독자에게 새로 전달할 정보을 확인할 때, 앞서 설명한 root 외에 새로 확인된 관계에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus5",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 5,
    "yearExpression": "baseYear+5",
    "timePosition": "future",
    "scope": "year",
    "purpose": "장기 유지 비용의 조건",
    "focus": "같은 기준을 유지할 실제 자원과 다른 연주 조건",
    "limit": "경과 연수만으로 피로·권태·성공을 단정하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "장기 유지 비용의 조건에서 장기 배경을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "장기 유지 비용의 조건에서 세운이 추가하는 조건을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "장기 유지 비용의 조건에서 다른 연도와 구별되는 근거을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "장기 유지 비용의 조건에서 긍정적으로 활용 가능한 조건을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "장기 유지 비용의 조건에서 함께 존재하는 위험을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "장기 유지 비용의 조건에서 원국 특성과의 관련을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "장기 유지 비용의 조건에서 이전 연도와의 비교을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "장기 유지 비용의 조건에서 다음 연도와 이어갈 질문을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "장기 유지 비용의 조건에서 교운과 적용 구간을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "장기 유지 비용의 조건에서 적합한 생활 영역을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "장기 유지 비용의 조건에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "장기 유지 비용의 조건에서 독자에게 새로 전달할 정보을 확인할 때, 같은 기준을 유지할 실제 자원과 다른 연주 조건에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus6",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 6,
    "yearExpression": "baseYear+6",
    "timePosition": "future",
    "scope": "year",
    "purpose": "다른 생활 상태로의 적용",
    "focus": "역할 변경 여부와 무관하게 남길 판단 기준",
    "limit": "변경된 직업이나 가족 사건을 창작하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "다른 생활 상태로의 적용에서 장기 배경을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "다른 생활 상태로의 적용에서 세운이 추가하는 조건을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "다른 생활 상태로의 적용에서 다른 연도와 구별되는 근거을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "다른 생활 상태로의 적용에서 긍정적으로 활용 가능한 조건을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "다른 생활 상태로의 적용에서 함께 존재하는 위험을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "다른 생활 상태로의 적용에서 원국 특성과의 관련을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "다른 생활 상태로의 적용에서 이전 연도와의 비교을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "다른 생활 상태로의 적용에서 다음 연도와 이어갈 질문을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "다른 생활 상태로의 적용에서 교운과 적용 구간을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "다른 생활 상태로의 적용에서 적합한 생활 영역을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "다른 생활 상태로의 적용에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "다른 생활 상태로의 적용에서 독자에게 새로 전달할 정보을 확인할 때, 역할 변경 여부와 무관하게 남길 판단 기준에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus7",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 7,
    "yearExpression": "baseYear+7",
    "timePosition": "future",
    "scope": "year",
    "purpose": "전환 후보의 위치 확인",
    "focus": "계산된 교운이 여기 있는지와 범위의 지원",
    "limit": "+7이라는 이유로 전환·정리를 가정하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "전환 후보의 위치 확인에서 장기 배경을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "전환 후보의 위치 확인에서 세운이 추가하는 조건을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "전환 후보의 위치 확인에서 다른 연도와 구별되는 근거을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "전환 후보의 위치 확인에서 긍정적으로 활용 가능한 조건을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "전환 후보의 위치 확인에서 함께 존재하는 위험을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "전환 후보의 위치 확인에서 원국 특성과의 관련을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "전환 후보의 위치 확인에서 이전 연도와의 비교을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "전환 후보의 위치 확인에서 다음 연도와 이어갈 질문을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "전환 후보의 위치 확인에서 교운과 적용 구간을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "전환 후보의 위치 확인에서 적합한 생활 영역을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "전환 후보의 위치 확인에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "전환 후보의 위치 확인에서 독자에게 새로 전달할 정보을 확인할 때, 계산된 교운이 여기 있는지와 범위의 지원에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus8",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 8,
    "yearExpression": "baseYear+8",
    "timePosition": "future",
    "scope": "year",
    "purpose": "여러 주기의 비교 가능성",
    "focus": "현재 또는 새 배경에서 동일 십성의 역할 차이",
    "limit": "+8을 새 대운 초기나 중기라고 고정하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "여러 주기의 비교 가능성에서 장기 배경을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "여러 주기의 비교 가능성에서 세운이 추가하는 조건을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "여러 주기의 비교 가능성에서 다른 연도와 구별되는 근거을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "여러 주기의 비교 가능성에서 긍정적으로 활용 가능한 조건을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "여러 주기의 비교 가능성에서 함께 존재하는 위험을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "여러 주기의 비교 가능성에서 원국 특성과의 관련을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "여러 주기의 비교 가능성에서 이전 연도와의 비교을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "여러 주기의 비교 가능성에서 다음 연도와 이어갈 질문을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "여러 주기의 비교 가능성에서 교운과 적용 구간을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "여러 주기의 비교 가능성에서 적합한 생활 영역을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "여러 주기의 비교 가능성에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "여러 주기의 비교 가능성에서 독자에게 새로 전달할 정보을 확인할 때, 현재 또는 새 배경에서 동일 십성의 역할 차이에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus9",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 9,
    "yearExpression": "baseYear+9",
    "timePosition": "future",
    "scope": "year",
    "purpose": "구간 말미의 지속 질문",
    "focus": "여기까지 제시한 실제 차이와 반복 질문",
    "limit": "책 끝에 가까워졌다고 운이 끝난다고 하지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "구간 말미의 지속 질문에서 장기 배경을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "구간 말미의 지속 질문에서 세운이 추가하는 조건을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "구간 말미의 지속 질문에서 다른 연도와 구별되는 근거을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "구간 말미의 지속 질문에서 긍정적으로 활용 가능한 조건을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "구간 말미의 지속 질문에서 함께 존재하는 위험을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "구간 말미의 지속 질문에서 원국 특성과의 관련을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "구간 말미의 지속 질문에서 이전 연도와의 비교을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "구간 말미의 지속 질문에서 다음 연도와 이어갈 질문을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "구간 말미의 지속 질문에서 교운과 적용 구간을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "구간 말미의 지속 질문에서 적합한 생활 영역을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "구간 말미의 지속 질문에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "구간 말미의 지속 질문에서 독자에게 새로 전달할 정보을 확인할 때, 여기까지 제시한 실제 차이와 반복 질문에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  },
  {
    "id": "mfpr:slot:plus10",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "offset": 10,
    "yearExpression": "baseYear+10",
    "timePosition": "future",
    "scope": "year",
    "purpose": "고객용 창과 대운의 끝 구분",
    "focus": "14년 편집 끝 이후에도 남는 실제 주기 범위",
    "limit": "상품 마지막 해를 인생의 결말·성공 도착점으로 만들지 않는다.",
    "cyclePositionNotDeterminedByOffset": true,
    "requiredFacts": [
      "actual year/ganji/annual tenGod",
      "calendar selected cycle / instant active cycle separately",
      "natalRelations/cycleRelations + reason IDs",
      "transition instant/range and validity",
      "past/current/future from fixed evaluation year"
    ],
    "questions": [
      {
        "key": "background",
        "question": "고객용 창과 대운의 끝 구분에서 장기 배경을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "cycle index·ganji·stem tenGod·기간·활성 여부",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "annual",
        "question": "고객용 창과 대운의 끝 구분에서 세운이 추가하는 조건을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 year·annual ganji·tenGod·year evidence ID",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "novelty",
        "question": "고객용 창과 대운의 끝 구분에서 다른 연도와 구별되는 근거을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "직전/관련 연도의 root·participants·period 비교",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "positive",
        "question": "고객용 창과 대운의 끝 구분에서 긍정적으로 활용 가능한 조건을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "관계·원국 강점의 출처와 조건부 적용",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "risk",
        "question": "고객용 창과 대운의 끝 구분에서 함께 존재하는 위험을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "원국 주의·실제 관계·과용 조건을 별도 보존",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "natal",
        "question": "고객용 창과 대운의 끝 구분에서 원국 특성과의 관련을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "실제 natal ID·자리·단순 주제 관련성 구별",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "previous",
        "question": "고객용 창과 대운의 끝 구분에서 이전 연도와의 비교을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "이전연도 실제 packet; 없으면 비교 불가",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "next",
        "question": "고객용 창과 대운의 끝 구분에서 다음 연도와 이어갈 질문을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "다음연도 실제 packet; 범위 밖이면 미검증",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "transition",
        "question": "고객용 창과 대운의 끝 구분에서 교운과 적용 구간을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "exact/range·before/uncertain/after·지원 관계",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "domain",
        "question": "고객용 창과 대운의 끝 구분에서 적합한 생활 영역을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "시점별 실제 상태 또는 명시된 조건부 장면",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "unsupported",
        "question": "고객용 창과 대운의 끝 구분에서 근거 부족으로 사용할 수 없는 주장을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "미지원 관계·직업/경험/성공·MBTI 예측 금지",
        "missingPolicy": "확인되지 않은 층위는 보류하고 다른 사실로 대체하지 않음",
        "notCalculatedEvidence": true
      },
      {
        "key": "new-information",
        "question": "고객용 창과 대운의 끝 구분에서 독자에게 새로 전달할 정보을 확인할 때, 14년 편집 끝 이후에도 남는 실제 주기 범위에 관해 무엇이 실제로 확인되는가?",
        "requires": "추가 fact/적용/비교/유지/보류 중 정직한 정보 기능",
        "missingPolicy": "새 차이가 없으면 continuity/comparison/withhold로 표시",
        "notCalculatedEvidence": true
      }
    ],
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "relative_editorial_question_not_forecast"
  }
];
