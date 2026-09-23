# MBTI-PRODUCT-UTILIZATION-QUALITY-01

기준 HEAD: `e2b9f05`. 기존 16개 JSON의 knowledge routing을 통합했다. source JSON, calendar/Dayun, 결제, DB, UI, 운영 설정은 수정하지 않았다.

## Source와 소비 경로

SSOT는 `docs/product/mbti/source/{TYPE}.json` → `mbti/sourceRuntimeAdapter.ts`다. 16개 프로필에 trait 1,213개, 직무 예시 190개, 회피 환경 120개, 명리 연결 hint 160개, 방향별 pair 256개가 있다. money/investment/marriage/study는 별도 DB가 아니라 `traits` 하위 영역이다.

| 상품 | 이전 소비 / 문제 | 현재 소비 |
| --- | --- | --- |
| 종합 | source 전체 basis와 별도의 legacy 지식층 병존. INTP/ENTJ 상세 seed, 나머지 14유형은 글자 조합 공통 seed. topic 문장도 공통 틀 | identity/summary, close/far, preferenceAxes, functionStack, topic별 source traits, growth, 검증된 Fusion/Bridge. 기존 지식층 API는 유지하고 내용은 source에서 파생 |
| 직업 | 직전 작업에서 jobs/avoid/money/investment/study 및 16유형 coverage 해결 | 공통 product trait routing 사용. 기존 명리 일치 정렬, 추천 confidence, source ID, 금융 표현 제한 그대로 유지 |
| 연애 | love/marriage/parenting/child/relationship/communication/risk/growth가 evidence·prompt에 존재하나 fallback은 relationship 중심 | 연애·표현·결혼·관계 조건·회복·부모 역할에 각각 해당 source trait 선택. SOLO도 상대 유형을 추정하지 않고 자신의 관계 조건으로 연결 |
| 궁합 | 최근 person profile/양방향 pair와 별개로 ENTJ–INTP 전용 bridge 및 고정 감점 잔존 | 동일 source profile 계약과 양방향 notablePairs. 슬롯과 사람 귀속, category role, Bridge v2 ID 유지. 유형 이름 전용 감점 제거 |
| 대운 | 별도 trait 수집 함수, use-case 지시문까지 coreTraits에 섞임 | 공통 fortune basis: career/money/study 3개 행동 관점 + 판단·일·관계·압박·성장 각 1개. use-case는 작성용 evidence로 분리 |
| 세운 | 대운과 다른 trait 우선순위·공통 fallback 설명 | 대운과 동일 선택 계약, `saeunReport` use-case는 별도로 유지. 운의 사실·연도 계산은 변경 없음 |

`MBTI_PRODUCT_TRAIT_AREAS`가 상품별 영역을 명시한다. `getMbtiProductTraits`는 source record와 `mbti:TYPE:traits:AREA:ID`를 반환한다. missing/invalid type은 빈 결과이며 유형 글자로 성향을 생성하지 않는다.

`mbtiKnowledgeBase.ts`의 기존 가중치·태그·Fusion 연결 메타데이터는 보존했다. 중복 narrative, functionStack 배열, preference 배열은 source로 교체했다. 검증된 명리 fact를 받지 않는 topic helper는 명리 강약을 주장하지 않는다. 실제 교차 해석은 기존 Fusion/Bridge 조건에서만 만든다.

## 제거 / 보존한 분기

- 2유형 상세 + 14유형 compact personality 생성 분리 제거. 16유형이 같은 source mapping을 사용한다.
- `isT/isF/isJ/isP/isE/isN`으로 장문을 조립하던 generic 분기 제거.
- ENTJ–INTP 전용 궁합 narrative 분기와 -5 speed penalty 제거. source에 점수 근거가 없으므로 다른 수치 규칙을 발명하지 않았다.
- 양방향 pair는 하나의 기존 evidence 가산 예산(합계 1)을 공유한다. 같은 pair를 두 번 조회한다고 가산을 두 배로 만들지 않는다. missing-MBTI 처리, 명리 score와 전체 가중치는 유지한다.
- ISTJ/INFP의 특정 단어를 강제하던 density 검사를 16유형 source identity/functionStack 일치 검사로 교체. 다른 유형의 identity나 기능표를 주입하면 실패한다.
- 기존 6개 authored Bridge scene ID는 **명시적인 source trait alias**로 유지한다. 이 6개는 일부 유형만 지원하는 기본 personality 분기가 아니라 기존 interaction 자산과의 호환 ID다. 최근 Bridge v2 rule/ID/조건은 변경하지 않았다.
- `mbtiKnowledgeBase`의 authored Fusion tag/scoring metadata와 ENTJ tag 완전성 검사는 기존 Fusion 계약이므로 유지한다. 새 유형 내용의 대체 DB로 쓰지 않는다.

## 기능론 / 미사용 자산

- functionStack은 source가 소유한다. 종합 본문은 실제 stack에 포함된 기능을 이름으로 명시하는 `thinkingStyle` trait가 있을 때만 그 설명을 선택한다. 단순 `Ti`/`Te` 문자열의 다른 단어 내부 일치는 제외한다.
- 기능에 연결된 source 설명이 없으면 기존 communication trait를 사용한다. 3차/열등 기능의 장문을 새로 만들지 않았다. 이 둘은 여전히 표/기존 용어 설명 비중이 크다.
- `comfortableTypes/challengingTypes`는 자동 배우자 추천 순위로 사용하지 않는다. SOLO는 관계 조건, 궁합은 실제 입력 두 유형의 directional entry를 사용한다.
- childRole/risk의 전체 자산은 연애 writer evidence에 남는다. fallback은 관련 section별 일부 trait만 사용하며 아동 성향을 성인이나 입력하지 않은 자녀에게 옮기지 않는다.
- jobs/avoid도 전부 나열하지 않고 기존 cap과 명리 일치 조건으로 선택한다. 미선택 row는 삭제 대상이 아니다.
- `mbtiCompatibilityCandidateEngine`은 현재 production caller가 없는 export/test 경로다. source 기반 지식층을 받지만 별도의 추천 상품으로 활성화하지 않았다.
- `reportQualityGate`의 오래된 일부 유형명 검사도 현재 production caller가 없는 legacy export/test 경로다. 유료 publish gate가 아니며 이번 작업에서 운영 경로로 연결하지 않았다.

## Before / After 측정

수정 전 HEAD를 `/tmp`의 별도 사본으로 실행하고, 동일 clock `2026-09-23 KST`, 동일 3원국 × (16유형 + 미입력) × 6상품으로 비교했다. 고객은 2001-06-22 13:30 남성, 1980-03-09 13:30 여성, 1999-07-31 13:30 남성이다. 궁합의 두 번째 사람은 1980년 고객/ENFP로 고정했다. OpenAI는 비활성이고 fetch는 테스트에서 차단했다.

| 상품 | 생성/publish 전→후 | SSR 문자 평균 전→후 | writer messages UTF-8 bytes 평균 전→후 |
| --- | --- | --- | --- |
| 종합 | 51/51 → 51/51 | 16,272 → 16,265 | 513,349 → 529,998 |
| 직업 | 51/51 → 51/51 | 10,282 → 10,282 | 84,611 → 84,611 |
| 연애 | 51/51 → 51/51 | 7,733 → 8,548 | 72,510 → 72,510 |
| 궁합 | 51/51 → 51/51 | 7,936 → 7,936 | 143,587 → 148,924 |
| 대운 | 51/51 → 51/51 | 12,210 → 12,242 | 130,966 → 130,259 |
| 세운 | 51/51 → 51/51 | 13,801 → 13,801 | 134,388 → 133,964 |

SSR 문자는 실제 render HTML에서 tag를 제거하고 공백을 합친 근삿값(HTML entity 포함)이다. prompt 수치는 실제 message builder의 system/developer/user JSON을 byte로 측정한 값이며 token이나 API 비용 추정이 아니다.

- unsupported valid MBTI: 0 → 0. 미입력 추정 / 다른 소유 유형의 source reference: 변경 후 0.
- 종합 selector의 description/scene/strength/risk/action 중 40자 이상 필드에서 유형명만 TYPE으로 정규화: 서로 다른 유형이 공유하는 문구 **49 → 0**, 공유 유형별 발생 **290 → 0**, 고유 문구 **325 → 647**.
- 이는 선택된 MBTI 지식의 지표다. 전체 report draft의 공통 안내/명리 문장까지 반복이 사라졌다는 뜻은 아니다. 51개 draft 모두에 공통인 40자 이상 문장은 종합 105, 직업 22, 연애 22, 궁합 31, 대운 88, 세운 30으로 전후 동일했다.
- 종합 prompt 약 3.2%, 궁합 약 3.7% 증가. generic 설명을 실제 source 설명으로 교체한 결과이며 정보량 축소를 목표로 하지 않았다. 중복 payload 축약은 별도 품질/비용 작업으로 남긴다.

## 영구 회귀 검증

- `mbtiProductUtilization.test.tsx`: 306개 행동 테스트. dispatcher → deterministic generation → 실제 publish gate → 6개 실제 SSR renderer. source owner/type, 미입력, 직무/회피/돈/투자/학업 source IDs, 연애의 관련 문장 실제 출력, fortune 공통 basis, Bridge v2 ID와 계산 fact 포함 여부.
- `mbtiProductRouting.test.ts`: 16유형 × 6 routing, missing/invalid, 6개 기존 Bridge ID alias, 16×16 directional pair 양방향/swap, 유형 라벨만 바꿔도 score 불변, source identity/functionStack 변조 거부.
- 기존 career counterfactual/16유형, Fusion/Bridge facts, compatibility 7category/swap/repair, 기타 5상품 suites 유지.
- worker build trace에 source JSON 16개 모두 포함됨을 확인했다.

검증: `pnpm test` **352 files / 3,569 tests PASS**, `pnpm lint` PASS(경고 0), `pnpm build` PASS, `git diff --check` PASS.

`pnpm exec tsc --noEmit`: 기존 387건 → 387건, 모두 tests. production source 0, 신규 의미 진단 0. 기존 한 union 오류의 타입 나열 순서만 바뀌었으며 tsc 전체를 PASS로 보고하지 않는다.

실제 OpenAI 0 / Toss 0 / production DB 0 / deploy 0. 임시 audit test는 repo에서 제거했다.

## 남은 QUALITY-P1

source가 제공하는 내용을 문맥별로 사용하는 경로를 정리한 작업이다. source의 강한 일반화 표현 자체에 대한 문헌/문체 감사, 연애의 기존 공통 본문 개인화, fortune의 추가 trait 중요도 선택, prompt 중복 축약은 남는다. 본문 전체 rewrite나 16유형 DB 재작성은 하지 않았다.

## 수정 파일

- `src/lib/report-generation/comprehensiveV2GenerationHandler.ts`
- `src/lib/report-generation/loveMarriageChildGenerationHandler.ts`
- `src/lib/report-knowledge/annualFortuneEvidence.ts`
- `src/lib/report-knowledge/careerEvidenceSelection.ts`
- `src/lib/report-knowledge/compatibilityDirectionEvidence.ts`
- `src/lib/report-knowledge/compatibilityMbtiBridge.ts`
- `src/lib/report-knowledge/compatibilityScoreEngine.ts`
- `src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder.ts`
- `src/lib/report-knowledge/comprehensiveReportEvidenceTypes.ts`
- `src/lib/report-knowledge/knowledgeValidators.ts`
- `src/lib/report-knowledge/loveMarriageChildReportEvidence.ts`
- `src/lib/report-knowledge/majorFortuneEvidence.ts`
- `src/lib/report-knowledge/mbti/sourceRuntimeAdapter.ts`
- `src/lib/report-knowledge/mbtiKnowledgeBase.ts`
- `src/lib/report-knowledge/mbtiKnowledgeTypes.ts`
- `src/lib/report-knowledge/mbtiTypeKnowledgeBase.ts`
- `tests/unit/report-display/comprehensiveReportDisplayBuilder.test.ts`
- `tests/unit/report-knowledge/compatibilityMbtiBridge.test.ts`
- `tests/unit/report-knowledge/comprehensiveReportEvidenceInputBuilder.test.ts`
- `tests/unit/report-knowledge/knowledgeSelectors.test.ts`
- `tests/unit/report-knowledge/majorFortuneEvidence.test.ts`
- `tests/unit/report-knowledge/mbtiKnowledgeBase.test.ts`
- `tests/unit/report-knowledge/mbtiKnowledgeSelector.test.ts`
- `tests/unit/report-knowledge/mbtiTypeKnowledgeBase.test.ts`
- `tests/unit/report-generation/mbtiProductUtilization.test.tsx`
- `tests/unit/report-knowledge/mbtiProductRouting.test.ts`
- `docs/mbti-product-utilization-quality-01.md`
