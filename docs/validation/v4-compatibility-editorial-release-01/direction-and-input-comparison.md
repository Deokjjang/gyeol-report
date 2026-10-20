# 방향성·입력 변경 검증

| 원고 | A→B (받는 사람 기준) | B→A (받는 사람 기준) | 지수 |
|---|---|---|---:|
| A | 정관 | 정재 | 69 |
| B | 편인 | 식신 | 55 |
| C | 정관 | 정재 | 64 |
| D | 식신 | 편인 | 58 |
| E | 비견 | 비견 | 45 |
| F | 정재 | 정관 | 56 |
| G | 정관 | 정재 | 66 |
| H | 정관 | 정재 | 62 |

각 CH05/CH06 문장의 directionId·subjectPersonId·targetPersonId와 기존 관계 ID를 검증했다. 원고의 주체와 대상이 바뀌어도 기존 계산 필드 자체는 수정하지 않았다.

## 입력 변경

- A-mbti: 9331자 / 36문단 / 변경 챕터 CH01, CH02, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.
- A-natal: 9167자 / 36문단 / 변경 챕터 CH01, CH02, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.
- A-unknown: 8317자 / 33문단 / 변경 챕터 CH01, CH02, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.
- B-mbti: 8959자 / 35문단 / 변경 챕터 CH01, CH03, CH04, CH06, CH07, CH08, CH09 / 안전 오류 0.
- B-natal: 9295자 / 36문단 / 변경 챕터 CH01, CH03, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.
- B-unknown: 8352자 / 33문단 / 변경 챕터 CH01, CH03, CH04, CH07, CH08, CH09 / 안전 오류 0.
- approximate: 9124자 / 36문단 / 변경 챕터 CH02, CH03, CH04, CH05 / 안전 오류 0.
- both-unknown: 8301자 / 33문단 / 변경 챕터 CH01, CH02, CH03, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.
- identical: 9061자 / 35문단 / 변경 챕터 CH01, CH02, CH03, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.
- swapped: 9110자 / 36문단 / 변경 챕터 CH01, CH02, CH03, CH04, CH05, CH06, CH07, CH08, CH09 / 안전 오류 0.

- A만 변경하면 B의 독립적 핵심 digest를, B만 변경하면 A의 digest를 유지했다.
- A/B 교환은 invariant와 지수 전체를 보존하고 aToB와 bToA를 실제 인물을 따라 반전했다. 고정 역할 두 유형은 별도 교환 검증으로 역할 문장 차이를 허용했다.
- MBTI 미상은 CH01.P3을 생략하며 미상 유형을 추정하지 않았다. 양쪽 시간/유형 미상에서 시주 근거와 MBTI 노드가 새로 만들어지지 않았다.
- A는 sharedGround 부족, C/D는 행동 축 friction 부족, H는 명리 tension 부족 사례를 포함한다. 없는 공통점·오행 보완·충돌을 새로 만들지 않았다.
- MBTI notablePairs는 기존 승인된 pair-dialogue와 실제 양쪽 자료 참조에만 사용했다. 점수에 합산하지 않았다.

## 불확실 입력의 실제 생략 진단

- A-unknown: CH01.P3:UNKNOWN_MBTI_NO_PAIR_INFERENCE, CH04.P1:INSUFFICIENT_DISTINCT_MATERIAL, CH09.P1:INSUFFICIENT_DISTINCT_MATERIAL
- B-unknown: CH01.P3:UNKNOWN_MBTI_NO_PAIR_INFERENCE, CH04.P1:INSUFFICIENT_DISTINCT_MATERIAL, CH09.P1:INSUFFICIENT_DISTINCT_MATERIAL
- both-unknown: CH01.P3:UNKNOWN_MBTI_NO_PAIR_INFERENCE, CH04.P1:INSUFFICIENT_DISTINCT_MATERIAL, CH09.P1:INSUFFICIENT_DISTINCT_MATERIAL
