# Career Money Study Product Rebuild Plan

## 1. Product Goal

직업·커리어·돈·학업 리포트는 결리포트 V2의 첫 독립 상품 후보로 둔다.

상품 목표:

- 명리의 일간, 십성, 오행, 원국 label을 중심으로 타고난 직업성을 해석한다.
- MBTI는 사용자가 체감하기 쉬운 행동 언어와 선택 방식으로 보조한다.
- 현재 직업은 메인 판정 기준이 아니라 적합도 비교용 현실 context로만 사용한다.
- 돈, 투자, 공부 전략은 별도 조언처럼 떼어 쓰지 않고 하나의 성향 흐름으로 연결한다.
- 직업명, 수익, 합격, 취업, 연봉, 투자 성과를 확정하지 않는다.
- 표는 deterministic facts layer, 본문은 writer narrative layer로 분리한다.

출시 기준의 핵심 경험:

1. 사용자가 입력한 명리/MBTI facts를 상단 표에서 먼저 확인한다.
2. 본문에서 타고난 직업성, 맞는 환경, 돈 버는 방식, 투자/저축 성향, 공부/자격증 전략을 한 흐름으로 읽는다.
3. 추천 직업과 피해야 할 직무/환경을 구체적으로 받는다.
4. 전체 리포트와 AI용 요약본을 복사할 수 있다.
5. 무료 미리보기와 유료 잠금 구조가 깨지지 않는다.

## 2. Current Implementation State

현재 구현된 영역:

- `src/lib/report-knowledge/careerReportTypes.ts`
  - `CareerReportEvidencePacket`
  - `CareerReportFixturePerson`
  - 직업/돈/투자/공부 archetype 타입
  - `bridgeEvidence: ProductBridgeEvidencePacket`
- `src/lib/report-knowledge/careerReportEvidence.ts`
  - `buildCareerReportEvidence`
  - 명리 career basis
  - MBTI career basis
  - `bridgeEvidence` 생성
  - 추천 직업, 커리어 경로, 돈 전략, 투자 프로필, 공부 전략, timing hint, safety note
- `src/lib/report-knowledge/careerReportFixtures.ts`
  - dev/smoke용 fixture matrix
- `src/lib/report-generation/careerReportDraftTypes.ts`
  - `CareerReportDraft`
  - OpenAI JSON schema
- `src/lib/report-generation/careerReportDraftValidator.ts`
  - draft validator
  - hard claim, financial guarantee, ticker, buy/sell instruction, internal artifact QA
  - visible text sanitizer
- `src/lib/report-generation/openaiCareerReportWriterPrompt.ts`
  - `bridgeEvidence` 포함
  - 타고난 직업성 중심 prompt 정책
  - 현재 직업 비교용 정책
  - 약한 표현 회피, 금지 표현, 문장 밀도 정책
- `src/lib/report-generation/openaiCareerReportWriter.ts`
  - OpenAI Responses API writer
  - strict JSON schema response format
  - validator 연결
- `scripts/smoke_build_career_report_evidence.ts`
  - evidence QA smoke
- `scripts/smoke_generate_career_report_draft.ts`
  - writer-enabled draft smoke
  - `.tmp/career-report-preview` snapshot write option
- `src/app/dev/career-report-preview/page.tsx`
  - dev preview page
  - browser에서 OpenAI를 직접 호출하지 않고 snapshot만 읽음
- `src/app/reports/[reportId]/CareerReportView.tsx`
  - career draft 렌더링 view
  - 현재는 dev preview에서 사용됨

공통 표 구현 상태:

- 공통 만세력표 data/UI/report page 연결은 종합 결과 페이지 쪽에 구현되어 있다.
- 공통 MBTI표 data/UI/report page 연결도 종합 결과 페이지 쪽에 구현되어 있다.
- career 전용 view에는 아직 공통 만세력표와 공통 MBTI표가 연결되어 있지 않다.

상품/결제/결과 조회 상태:

- `src/lib/product/gyeolProducts.ts`의 구매 가능 상품은 현재 종합 리포트 중심이다.
- `src/lib/payment/reportProductCatalog.ts`의 구매 가능 상품도 `saju_mbti_full` 중심이다.
- `src/lib/reports/paidReportResultTypes.ts`와 `supabasePaidReportResultClient.ts`는 paid result를 `saju_mbti_full`로 제한한다.
- `career_money_study`는 현재 출시 상품 경로가 아니라 dev preview/smoke 중심 구조다.

최근 QA 상태:

- prompt/evidence unit test는 통과했다.
- writer-enabled smoke는 OpenAI writer env가 없으면 draft generation을 skip한다.
- 실제 writer output 품질 QA는 `OPENAI_REPORT_WRITER_ENABLED=1`, `OPENAI_API_KEY`, `OPENAI_REPORT_MODEL`이 있는 환경에서 별도 실행이 필요하다.

## 3. Gap From Launch-Ready Product

현재 dev preview/smoke 구조와 출시급 상품 구조의 차이:

- 입력
  - 현재 career fixture 기반이다.
  - 출시 상품은 실제 사용자 입력에서 `CareerReportEvidencePacket`을 생성해야 한다.
  - 공통 입력 form이 career product context를 받을 수 있어야 한다.
- 계산/evidence
  - 현재 fixture의 `pillars`와 `labels`를 직접 사용한다.
  - 출시 상품은 기존 사주 계산 엔진 결과, V2 `profileTable`, 사용자 context를 career evidence input으로 변환해야 한다.
- 결과 화면
  - 현재 `CareerReportView`는 draft 본문 렌더링 중심이다.
  - 출시 상품은 상단에 공통 만세력표와 공통 MBTI표가 있어야 한다.
  - 키워드 블록, 복사 기능, 무료/유료 잠금 구조가 필요하다.
- writer
  - prompt와 schema는 존재한다.
  - 실제 writer-enabled smoke로 출력 문장 품질을 검수해야 한다.
  - 약한 표현, 보장 표현, 투자 자문 표현을 실제 draft 기준으로 다시 체크해야 한다.
- persistence/result
  - 현재 paid result union은 종합 리포트만 처리한다.
  - career draft snapshot 저장/조회 타입과 mapper가 필요하다.
- route/API
  - dev preview route는 있다.
  - 출시용 product route, create flow, result flow는 아직 없다.
- payment
  - 현재 실제 결제 가능 상품은 종합 리포트다.
  - career 상품 결제 활성화는 별도 단계로 분리한다.
  - 이번 리빌딩 계획에서는 결제 활성화 전까지 product card는 비구매 또는 내부 QA 상태로 둔다.

## 4. Required User Flow

출시급 사용자 흐름:

1. 사용자가 상품 목록에서 `직업·커리어·돈·학업 리포트`를 확인한다.
2. 상품 상세 또는 입력 화면으로 이동한다.
3. 공통 입력을 받는다.
   - 이름
   - 생년월일
   - 태어난 시간
   - 태어난 시간 모름 여부
   - 성별
   - MBTI
   - 현재 직업
   - 세부 직업/관심 분야
   - 관계 상태
4. 입력값으로 사주 계산과 V2 profile facts를 만든다.
5. career evidence를 만든다.
6. writer가 `CareerReportDraft`를 만든다.
7. validator/sanitizer/QA gate를 통과한 draft만 저장한다.
8. 결과 화면에서 아래 순서로 보여준다.
   - 상품 header
   - report id
   - 공통 만세력표
   - 공통 MBTI표
   - 무료 미리보기 또는 유료 본문
   - 직업·커리어·돈·투자·공부 본문
   - 전체 리포트 복사
   - AI용 요약본 복사

무료/유료 흐름:

- 결제 활성화 전 QA 단계에서는 dev/internal route로만 검수한다.
- 결제 활성화 단계에서는 기존 종합 리포트의 locked/preview/unlock 구조를 참고한다.
- 무료 미리보기에는 핵심 요약, 일부 추천 직업, 표 일부 또는 표 전체 정책을 별도로 정한다.
- 유료 본문에는 전체 draft section, 추천/비추천 직무, action plan, copy 기능을 제공한다.

## 5. Required Result Sections

출시급 결과 화면 필수 섹션:

- 상품 header
  - 상품명
  - 버전 badge
  - 생성/조회 상태
  - report id
- 공통 만세력표
  - 시주/일주/월주/연주
  - 천간/지지
  - 십성, 오행 색상
  - 가능한 detail rows
- 공통 MBTI표
  - type header
  - preference axes
  - function stack
  - close/far keyword
  - report usage note
- 입력/context 요약
  - 현재 상태
  - 현재 직업 또는 관심 분야
  - 관계 상태
  - 현재 직업은 비교용임을 노출 문구로 정리
- 핵심 요약
  - opening title
  - opening summary
  - core line
- 직업·커리어 본문
  - career identity
  - 명리 core
  - MBTI core
  - combined reading
  - career paths
- 돈 본문
  - money earning style
  - best income channels
  - risky income channels
  - side-income ideas
- 투자 본문
  - investment and saving style
  - suitable patterns
  - caution patterns
  - visible financial disclaimer
- 공부/자격증 본문
  - recommended certificates
  - study methods
  - portfolio strategy
  - avoid patterns
- 키워드 블록
  - 가까운 결
  - 멀게 느껴지는 결
  - MBTI source keyword와 career evidence keyword를 함께 쓸지 정책 확정 필요
- 추천 직업
  - 8~20개
  - fit
  - reason
  - caution
  - example fields
- 피해야 할 직무/환경
  - 3~8개
  - reason
  - warning
- 강한 시기·조심할 시기
  - career timing
  - 단, 사건 확정이 아니라 행동 기준으로 표시
- action plan
  - 직업
  - 커리어
  - 돈
  - 투자·저축
  - 학업·자격증
  - 포트폴리오
- risk warnings
- safety notes
- 전체 리포트 복사
- AI용 요약본 복사

## 6. Required Common Tables

공통 만세력표:

- SSOT: V2 `profileTable.fourPillarGrid`
- UI: `ManseRyeokCommonTable`
- builder: `buildManseRyeokCommonTableData`
- career 결과 화면에서는 writer draft가 아니라 deterministic profile facts에서 만든다.
- `profileTable.fourPillarGrid`가 없으면 빈 표를 writer가 보완하지 않는다.

공통 MBTI표:

- SSOT: `docs/product/mbti/source/*.json`
- runtime source: MBTI source registry/adapter
- UI: `MbtiCommonProfileTable`
- builder: `buildMbtiCommonProfileTableData`
- career 결과 화면에서는 `profileTable.mbti` 또는 입력 snapshot의 MBTI를 기준으로 source를 조회한다.
- unknown MBTI면 화면을 죽이지 않고 입력값 요약만 유지한다.

career 상품 추가 표:

- 1차 출시 범위에서는 대운/세운/궁합표를 기본으로 붙이지 않는다.
- career timing은 본문 section으로 유지한다.
- 추후 확장 시 대운/세운 흐름과 career timing을 연결할 수 있다.

## 7. Evidence And Bridge Requirements

필수 evidence:

- `myeongliCareerBasis`
  - dayMasterPlain
  - dominantElements
  - missingElements
  - heavyElements
  - tenGodFocus
  - careerPlain
  - moneyPlain
  - studyPlain
- `mbtiCareerBasis`
  - type
  - workStylePlain
  - strengthPlain
  - riskPlain
  - moneyBehaviorPlain
  - studyPlain
- `bridgeEvidence`
  - productKey: `careerMoneyStudy`
  - primaryEvidence
  - supportingEvidence
  - cautionEvidence
  - recommendedTone
  - forbiddenAngles
- `combinedCareerProfile`
  - headline
  - plain
  - workStyleArchetypes
  - moneyStyleArchetypes
  - investmentStyleArchetypes
  - studyStyleArchetypes
- `recommendedJobs`
- `careerPaths`
- `moneyStrategies`
- `investmentProfile`
- `studyCertificateStrategy`
- `workRiskWarnings`
- `opportunitySignals`
- `timingHints`
- `safetyNotes`

bridge 요구사항:

- `buildMyeongliMbtiBridgePacket`은 MBTI source DB와 명리 signal을 evidence로만 결합한다.
- `buildProductBridgeEvidence(packet, "careerMoneyStudy")`를 통해 writer용 bucket으로 나눈다.
- `primaryEvidence`는 핵심 문단에 반영한다.
- `supportingEvidence`는 보조 근거로 반영한다.
- `cautionEvidence`는 리스크/주의 문단에 반영한다.
- `forbiddenAngles`는 절대 사용자 문장으로 출력하지 않는다.
- unknown MBTI 또는 MBTI 미입력은 empty bridge packet으로 처리하고 career evidence 생성은 유지한다.

실제 입력 adapter 요구사항:

- fixture가 아니라 계산 엔진 결과와 사용자 입력 snapshot에서 career evidence input을 만든다.
- 현재 `labels`는 fixture에서 직접 주입된다.
- 출시 전에는 원국 계산 결과에서 career label을 생성하는 adapter가 필요하다.
- adapter는 명리 계산 엔진을 바꾸지 않고 현재 available facts만 사용한다.

## 8. Writer And Draft Requirements

현재 draft schema는 출시 초안으로 사용할 수 있다.

필수 draft 구조:

- openingTitle
- openingSummary
- coreLine
- userContextSummary
- careerIdentity
- myeongliMbtiSummary
- recommendedJobs
- unsuitableJobs
- careerPaths
- moneyEarningStyle
- investmentAndSavingStyle
- careerTiming
- studyCertificatePlan
- actionPlan
- riskWarnings
- safetyNotes

writer 요구사항:

- writer는 deterministic evidence packet만 사용한다.
- writer는 사주 계산값, MBTI type, timing hint를 새로 만들지 않는다.
- 명리가 중심이고 MBTI는 행동/체감 보조층이다.
- 현재 직업은 적합도 비교용 context다.
- 직업·돈·투자·공부는 따로 쓰되 하나의 성향 흐름으로 연결한다.
- 수익/합격/취업/연봉/직업 성공을 보장하지 않는다.
- 투자 문장은 성향 기반 해석으로 제한하고 금융 자문이 아님을 표시한다.

출시 전 writer QA 필요 항목:

- writer-enabled smoke를 실제 OpenAI 환경에서 실행한다.
- draft가 schema validator를 통과하는지 확인한다.
- 문장 톤이 강하고 구체적인지 확인한다.
- 약한 표현이 과다하지 않은지 확인한다.
- 금지 표현과 내부 artifact가 없는지 확인한다.
- 추천 직업이 fixture마다 다양하게 나오는지 확인한다.
- action plan 6개 label이 모두 채워지는지 확인한다.

draft 보강 후보:

- keyword block을 draft schema에 둘지, MBTI source/table layer에서 별도 렌더링할지 결정한다.
- AI용 요약본 전용 structured output을 draft에 포함할지, presenter layer에서 생성할지 결정한다.
- 무료 미리보기용 excerpt를 draft에 포함할지, result presenter에서 자를지 결정한다.

## 9. Route, API, Persistence, Payment Scope

출시까지 필요한 route/API/persistence 범위:

- product route
  - `/products/career-money-study` 또는 동일한 상품 slug 결정
  - 상품 설명, 자동 생성 디지털 리포트 고지, 안전 고지
- input route
  - 기존 `/report/new`를 product-aware로 확장하거나 career 전용 입력 route를 만든다.
  - 공통 입력 + career context를 받는다.
- generation route/API
  - career product type을 받는 생성 경로가 필요하다.
  - 사주 계산, profile facts, career evidence, writer, validator, snapshot 저장을 연결한다.
- result route
  - `/reports/[reportId]`에서 `career_money_study` snapshot을 읽고 `CareerReportView`를 렌더링한다.
  - 기존 종합 리포트 result union과 충돌하지 않게 product type union을 확장한다.
- persistence
  - career draft snapshot type
  - career snapshot version
  - Supabase row mapper
  - validation failure handling
- payment
  - 이번 계획에서는 실제 결제 활성화는 별도 단계로 분리한다.
  - 초기 구현은 purchasable false 또는 internal QA flag로 둔다.
  - 결제 활성화 전까지 Toss/Supabase payment mutation은 건드리지 않는다.

payment 활성화 전 필수 조건:

- writer-enabled smoke 통과
- mobile result QA 통과
- free/paid locked state QA 통과
- refund/legal product wording 확인
- production price/launch badge 확정
- Supabase schema/RPC migration 별도 검토

## 10. Copy And AI Summary Requirements

전체 리포트 복사:

- 화면에 보이는 유료 본문을 복사한다.
- 상품 header, 입력 요약, 상단 표 요약, 본문 section, safety notes를 포함한다.
- payment id, access token, debug field, evidence id, internal source id는 제외한다.
- 투자 문장은 금융 자문이 아니라는 고지를 유지한다.

AI용 요약본:

- 다른 AI 도구에 붙여 넣기 쉬운 구조화 요약이다.
- 긴 본문 전체가 아니라 핵심만 압축한다.
- 포함 항목:
  - 입력 요약
  - 원국 핵심
  - MBTI 핵심
  - 직업성 핵심
  - 돈/투자 성향
  - 공부/자격증 전략
  - 추천 직업 상위 항목
  - 주의점
  - 실행 action
- 예언, 진단, 보장 표현 없이 참고용 자기이해 요약임을 유지한다.

구현 정책:

- copy text는 writer가 새로 쓰지 않는다.
- draft와 deterministic table data에서 presenter가 만든다.
- 무료 미리보기 상태에서는 복사 범위를 제한한다.
- 유료 unlock 상태에서는 전체 복사와 AI 요약본 복사를 제공한다.

## 11. QA Gate

필수 자동 검증:

- `pnpm test -- tests/unit/report-knowledge/careerReportEvidence.test.ts`
- `pnpm test -- tests/unit/report-generation/openaiCareerReportWriterPrompt.test.ts`
- `pnpm test -- tests/unit/report-generation/openaiCareerReportWriter.test.ts`
- `pnpm test -- tests/unit/report-generation/careerReportDraftValidator.test.ts`
- career view source/component 테스트
- copy/AI summary 테스트
- paid result union 테스트
- `pnpm lint`
- `pnpm build`

필수 smoke QA:

- `scripts/smoke_build_career_report_evidence.ts --all`
- `scripts/smoke_generate_career_report_draft.ts --fixture deokmin-career`
- writer-enabled smoke
  - `OPENAI_REPORT_WRITER_ENABLED=1`
  - `OPENAI_API_KEY`
  - `OPENAI_REPORT_MODEL`
- snapshot preview smoke
  - `--write-preview`
  - `/dev/career-report-preview?fixture=...&snapshot=latest`

출시급 수동 QA:

- 모바일 화면 QA
  - 390px
  - 430px
  - 공통 만세력표
  - 공통 MBTI표
  - career 본문
  - 추천 직업 목록
  - copy buttons
- 금지 표현 QA
  - 수익 보장
  - 확정 수익
  - 합격 보장
  - 취업 보장
  - 연봉 보장
  - 질병/사고/사망 확정
  - 특정 종목 추천
  - 매수/매도 지시
- 문체 QA
  - 약한 표현 과다 여부
  - 문단 밀도
  - 현재 직업 비교용 정책
  - MBTI 보조 evidence 반영
  - 명리/MBTI 동일시 금지
- 잠금/무료 미리보기 QA
  - locked state
  - unlocked state
  - missing snapshot
  - invalid snapshot
  - copy 제한

## 12. Implementation Tasks

추천 구현 순서:

1. `career_money_study` 출시 scope audit
   - product type naming 확정
   - route slug 확정
   - 무료/유료 preview 범위 확정
2. 실제 입력 adapter 설계
   - 사용자 입력 snapshot에서 `CareerReportFixturePerson`에 준하는 plain input 생성
   - fixture 의존 제거 경로 정리
3. career evidence input adapter 구현
   - 기존 사주 계산 결과와 V2 profile facts에서 labels/pillars/userContext 생성
   - 계산 엔진 수정 없이 현재 facts만 사용
4. career product card 초안 추가
   - purchasable false
   - 출시 준비 또는 internal QA 상태
   - 실제 결제 활성화 제외
5. career result presenter 설계
   - draft
   - profileTable
   - MBTI source table data
   - copy text data
   - locked preview data
6. `CareerReportView` 상단 표 연결
   - 공통 만세력표
   - 공통 MBTI표
   - context summary
   - 키워드 블록
7. career 본문 레이아웃 정리
   - 카드 과분할 완화
   - 챕터 단위 accordion 여부 결정
   - 모바일 spacing QA
8. copy 기능 구현
   - 전체 리포트 복사
   - AI용 요약본 복사
   - internal field 제외 테스트
9. writer-enabled smoke QA
   - 주요 fixture 전부 실행
   - output quality report 정리
   - prompt 보완 필요 시 별도 task로 분리
10. career snapshot persistence 설계
    - draft snapshot type
    - snapshot version
    - paid result union 확장안
    - Supabase migration은 별도 task로 분리
11. career result route 연결
    - `/reports/[reportId]`에서 career snapshot 분기
    - missing/invalid/locked 상태 처리
12. 무료/유료 잠금 구조 연결
    - preview section
    - unlock section
    - copy 제한
13. QA gate 실행
    - tests
    - lint
    - build
    - writer smoke
    - mobile screenshot QA
    - forbidden expression QA
14. payment activation 별도 계획 작성
    - price
    - product catalog purchasable true
    - Toss/Supabase/RPC
    - legal/refund wording

## 13. Non Goals

이번 계획 문서에서 하지 않을 것:

- UI 구현
- writer 실행 로직 수정
- validator 수정
- 사주 계산 엔진 수정
- MBTI source JSON 수정
- 대운/세운/궁합 상품 구현
- 실제 결제 활성화
- Toss/Supabase/payment migration 수정
- 법률/환불 문구 수정
- production OpenAI 비용/모델 정책 확정
