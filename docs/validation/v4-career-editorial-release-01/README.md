# GYEOL-V4-CAREER-EDITORIAL-RELEASE-01

기준: `dbc2e81c2ad90aafd40a4b71c00bf1d99055d4ca` (`origin/v4/comprehensive-editorial-release-01`).
브랜치: `v4/career-editorial-release-01`.
새 생성본 원고 버전: `career-editorial-release-01-v1`.

커리어 생성 시점에만 독립적인 9장 편집 계약을 적용한다. 기존 K1~K10, 직업 추천 순위·근거·회피 환경, 명리·MBTI·Fusion 계산은 유지한다. 안전한 원고를 만들지 못하는 경우 기존 편집본으로 돌아가며, 분량·문단 진단을 새로운 유료 발행 실패로 연결하지 않는다. 저장된 과거 Book에서는 편집기를 실행하지 않는다.

## 보존한 검수 자료

- [A~H 원고 요약·직업 추천·검증 결과](./manuscript-summary.json)
- [A 직장인 ENTJ](./manuscripts/A.txt), [B 프리랜서 ENFP](./manuscripts/B.txt), [C A와 같은 원국 INFP](./manuscripts/C.txt), [D A와 같은 MBTI·입력 직업, 다른 원국](./manuscripts/D.txt)
- [E 학생 ENTP](./manuscripts/E.txt), [F 기술문서 번역 프리랜서 INTP](./manuscripts/F.txt), [G 구직 ESTP](./manuscripts/G.txt), [H MBTI·시간 불확실](./manuscripts/H.txt)
- 각 전문 옆의 `*.provenance.json`: 문장별 실제 후보·명리 근거·MBTI 노드·Fusion ID·조건부 적용/회수·직업 상태·문장 역할
- [A~D 공통 문단 및 문장 전문](./cross-reader.json)
- [16유형 학업 연결 검증 기록](./study-types.json)

모두 기존 합성 fixture로 생성했다. 실제 고객 데이터, 실제 결제 또는 외부 생성 API를 사용하지 않았다. 본문 글자 수는 실제 발행 해석 문단을 `\n\n`으로 연결한 JavaScript `length`이며, 제목·목차·별도 추천 목록·근거 표시는 제외한다.

## 전문 검수

A/B/C/D 전문을 처음부터 끝까지 읽고, 보강 후 변경 문단을 다시 대조했다. 자동 PASS만으로 판정하지 않았다. 조사 오류, 문장 안에 완결 문장을 끼워 넣는 문제, 재물 보조 근거의 이름 누락, 세 번째 실제 추천의 본문 누락, 날카로운 말의 위험을 완벽주의로 설명하던 불일치, 학습 위험에 비해 일반적이던 처방을 수정했다.

- 첫 도입: A의 실행력, B의 유연성, C의 독립성, D의 다른 실제 명리 근거를 구분한다. A/D의 진행 방식도 변화 지향과 상황 적응으로 구분한다.
- 실제 추천: A는 lead/market/manage, B는 create/experience/investigate, C는 lead/market/experience, D는 lead/market/review. 기존 결과와 직무 예시는 그대로이며, 본문에는 세 추천 모두의 이유가 나온다.
- 돈: 실제 재물 후보·원국 근거와 MBTI 금전 자료를 함께 사용한다. 직접 사용할 주 후보가 없는 C/H는 기존 `careerNatalMoney`의 실제 보조 근거를 명시하며 재물복으로 승격하지 않는다. A/D처럼 같은 성향으로 읽히는 부분의 경제적 적용 문장은 공통이다.
- 학업: 기존 16유형 bridge, 별도의 실제 학업 trait, 해당 유형의 실제 risk 및 이에 맞춘 처방을 사용한다. ENTJ의 기초 반복 경시, ENFP의 과목 편차, INFP의 의미에 따른 동기 저하 등을 같은 처방으로 덮지 않는다.
- 직업 상태: 직장인과 프리랜서의 역할·계약·학습·비용 조건을 구분한다. 입력 직업명은 능력이나 추천의 새로운 근거가 되지 않는다.
- 팩폭: 실제 fact-bomb 후보를 업무·돈·성공 비용에 연결한다. D의 상관/날카로운 말은 상대의 방어 반응과 수정 지연, 전달 방법까지 연결한다. 승인된 복 근거가 없으면 검증된 능력의 발휘 조건으로 희망을 설명한다.
- 종합과의 구분: 종합 전용 문장·렌더러를 가져오지 않고, 역할·직업 추천·직업 상태·경제적 가치·학습으로 질문을 좁혔다.

공통 문장을 숨기거나 모든 원고가 완전히 독립적이라고 주장하지 않는다. A~D의 동일 위치 완전 동일 문단 수 / 공통 완전 동일 문장 수는 다음과 같다.

| 비교 | 동일 문단 | 공통 문장 |
|---|---:|---:|
| A/B | 1 | 35 |
| A/C | 3 | 49 |
| A/D | 5 | 68 |
| B/C | 0 | 28 |
| B/D | 1 | 35 |
| C/D | 2 | 33 |

A/D의 공통 문단은 CH02.P1, CH03.P4, CH05.P4, CH07.P3, CH08.P4다. 같은 MBTI·직업 상태·직업명과 실제 공통 근거에서 나온 강점/회피 환경/다음 단계/학습 위험/발휘 조건이다. 같은 근거의 공통 해석은 남겼으며, 이름 치환으로 독창성을 높였다고 집계하지 않았다. 공통 문장의 모든 내용은 `cross-reader.json`에서 확인할 수 있다. 공통 의미를 공유하지만 문장이 다른 부분까지 정량적으로 탐지한 결과는 아니다.

## 최종 보고

CAREER_EDITORIAL_READY: YES — 이번 범위 구현·전문 검수 완료. Production 미배포.

9_CHAPTERS_IMPLEMENTED: YES — CH01~CH09, 문단·문장 역할과 저장본 기반 Book 연결.

36_PARAGRAPHS: YES for A~G — 각 36문단, 문단당 3~5문장. H는 근거 부족으로 30문단.

V4_MYEONGLI_CONNECTED: YES — 실제 유효 후보와 같은 방향의 원국 근거, 또는 기존 보조 자료의 실제 provenance.

V4_MBTI_CONNECTED: YES — 실제 semantic source node와 기존 16유형 학업 자료. 미입력 유형 추정 없음.

V4_FUSION_CONNECTED: YES — 실제 REINFORCE/COMPLEMENT 근거. 결합 엔진 변경 없음.

CAREER_RECOMMENDATIONS_PRESERVED: YES — 기존 추천 ID·직무 예시·회피 환경 비교 PASS, 실제 추천 이유 보존.

JOB_CONTEXT_PERSONALIZATION: YES — 원문 상태 9종 및 미입력 계약 검증. 비직장인에게 상사·승진·현재 회사 단정 없음.

MONEY_INTERPRETATION_DEPTH: YES — 경제적 가치, 실제 금전 성향, 시간·비용 위험, 관리 조건. 투자 권유·소득 보장 없음.

STUDY_INTERPRETATION_DEPTH: YES — 16유형 실제 bridge/다른 trait/risk/처방/전문 기술과 현재 상태 연결.

POSITIVE_FORTUNE_QUALITY: 실제 승인된 근거가 있을 때만 복 해석, 그 외 검증된 능력과 실행 조건으로 설명.

FACT_BOMB_QUALITY: 실제 위험 근거·업무 결과·비용·조정 행동 연결, 단정적 운명 예고 없음.

NARRATIVE_LENGTH: 아래 표와 `manuscript-summary.json` 참조.

| 원고 | 본문 글자 수 | 문단 |
|---|---:|---:|
| A | 9,733 | 36 |
| B | 9,856 | 36 |
| C | 9,734 | 36 |
| D | 9,771 | 36 |
| E | 9,788 | 36 |
| F | 9,779 | 36 |
| G | 9,872 | 36 |
| H | 8,039 | 30 |

CROSS_PERSON_DIFFERENTIATION: A~D 도입·추천·상태·학업·실제 근거 차이 확인. 공통 문장은 위 표와 전문 기록에 명시.

HUMAN_READABILITY: A~D 전문 및 수정 문단 재검수 완료. 모든 고객 원고가 무공통 문장인 것은 아님.

EVIDENCE_INTEGRITY: A~H hard error 0, A~G editorial diagnostic 0. H의 근거 부족 진단은 보존. 알 수 없는 root·방향 반전 거부 검증.

BOOK_PUBLICATION: 로컬 생성→완료 검증→JSON 저장→직접/공유 재열람의 동일 내용, 9장 목차·상세 목차·모든 target/anchor 검증 PASS. 실제 발행/결제 실행 없음.

COMPREHENSIVE_PRESERVED: 기준 커밋에서 미리 캡처한 draft/evidence/Book 3개 digest 모두 동일. 기존 구형 종합 기대값만 현재 기준 커밋 값으로 교정.

OTHER_FOUR_PRODUCTS_PRESERVED: 연애·궁합·대운·세운의 현재 생성본 3종 digest 및 기존 legacy 저장본 재열람 비교 PASS.

V3_PRESERVED: V3 계산·원고·저장 경로 수정 없음, V2 회귀 PASS. V3 메모리 생성→전체 결과 페이지 테스트 1개는 기준 커밋에서도 동일 실패(아래 참조). 실제 Production V3 열람을 이번에 재실행한 것은 아님.

REGRESSION: 관련 테스트 234 PASS / 기존 실패 1개. 마지막 도입 조사 수정 뒤 A~H 및 비교 9개 및 허위 추천 거부 1개 추가 PASS. 전체 종합 96+24 회귀 미실행.

LINT_BUILD: lint PASS / build PASS / diff-check PASS. TypeScript 전체는 기준 389개 진단이 남으며, 기존 로컬 `.next/dev/types/app/report/new/page.ts` 생성물 진단 1개를 포함해 390개. 변경한 소스·테스트의 새 file/code 진단 없음. 빌드에는 기존 로컬 DB 경로 asset tracing 경고 7개가 남음.

BRANCH: `v4/career-editorial-release-01`

SHA: 이 보고서를 포함한 feature branch 커밋. 정확한 값은 최종 전달 응답 및 `git rev-parse HEAD`에서 확인.

DEPLOY_READY: REVIEW_READY / NOT_DEPLOYED — master 병합·Production 배포는 별도 승인 대상. 기존 V3 통합 테스트 실패를 포함한 무조건적인 전체 green은 주장하지 않음.

REMAINING_QUALITY_ISSUES: H의 근거 부족에 따른 축약, 같은 MBTI·상태·실제 근거에서 공통인 문장, 기존 V3 통합 테스트 1개 및 전체 TypeScript 부채. 이 작업에서는 범위를 넓혀 수정하지 않음.

NEXT_ACTION: 사용자 최종 검수. 배포·연애 상품 작업·다음 Phase 미실행.

## 테스트 증거와 한계

- `careerRelease.test.ts`: 42/42 PASS. A~H 실제 원고, 16개 MBTI, 10개 raw 상태, 잘못된 근거 거부, 6상품 저장/내용 보존.
- `careerProduct.test.tsx`, `careerProductLocks.test.ts`, `careerNarrative.test.ts`, `careerSafety.test.ts`: 93/93 PASS.
- `v2Regression.test.tsx`, `bookPublicFlow.test.tsx`, `bookSharing.test.tsx`: 53/53 PASS.
- `productPreviewSnapshot`, `careerEditorialPolish`, `careerEditorial`: 46 PASS / 1 FAIL.
- 해당 FAIL: `tests/unit/interpretation-v3/careerEditorial.test.tsx:84`, `local create → memory snapshot → full result page reads V3 with no provider`. 기대한 `career_v3.0-editorial.2` 대신 열람 정보 확인 실패 화면이 반환됨. 정확한 기준 SHA를 `/tmp`에 archive한 별도 사본에서 같은 테스트 하나를 실행해 동일한 실패를 재현함. 테스트 기대값이나 인증·열람 경로를 수정해 통과시키지 않음.
- 최종 문구 수정 뒤 A~H 원고/공통 문장 비교 9/9 재확인. 전문과 요약은 이 마지막 출력으로 갱신함. 16유형 기록은 직전 전체 42개 PASS 실행의 결과로, 마지막 변경은 모든 유형에 공통인 도입 조사를 바로잡는 수정임.
- 보존 digest: `tests/unit/interpretation-v4/careerReleaseLocks.json`. 이전 커리어 실제 합성 저장본: `tests/fixtures/completed-report/career-editorial-base.json`.
- 기존 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 변경은 보존하며 커밋에 포함하지 않음.
- 보호한 결제·Worker·DB·인증·공유·90일·가격·정책·유료 묶음 OFF·무료 이벤트 SCHEDULED 경로에는 변경 없음. 운영 상태를 수정하거나 실제 운영 DB에서 재검증하지 않음.
