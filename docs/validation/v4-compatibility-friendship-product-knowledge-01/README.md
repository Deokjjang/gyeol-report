# V4-COMPATIBILITY-FRIENDSHIP-PRODUCT-KNOWLEDGE-01

친구·인간관계 전용 오프라인 연구 레지스트리를 구축했다. 기존 6유형의 문장을 관계 이름만 바꿔 사용하지 않았으며, 새 자료는 계산·Evidence·점수·선택·원고·Book에 연결하지 않았다. 고객 적용·판매 품질·Production 배포 승인은 아니다.

- 기준: `v4/vercel-function-trace-fix-01` / `1e836a5606745d5f2d1d7972afdca6cd2ae9f86a`
- 작업: `v4/compatibility-friendship-product-knowledge-01`
- 독립 worktree: `/private/tmp/gyeol-compatibility-friendship-product-knowledge-01`
- 원본 checkout: `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`
- 평가 시각: `2026-10-12T12:00:00+09:00`, 가상 입력·offline paid generator·disabled external writer

## 실제 연구 DB

신규 자료는 `src/lib/report-knowledge/compatibility-friendship-research/`에 있다. [coverage manifest](coverage-manifest.json)는 실제 데이터에서 집계했다.

| 자료 | 범위와 의미 |
|---|---|
| `friendshipConcepts.ts` | 필수 26영역. 질문·구분·적용 조건·반례·원천·문단 연결 |
| `chapterResearch.ts` | 실제 기존 9장 제목·key 보존; 전문 연구 초점은 별도 필드 |
| `paragraphResearch.ts` | 36문단: 독립 질문·핵심/추가 의미·긍정·위험·직설·반전·장면·A/B 행동·반례·구분·후속 연결 조건 |
| `sentenceRoleResearch.ts` | 실제 144역할과 각각의 연구 기여. 역할 설명은 원본과 동일 |
| `personResearch.ts` | A16/B16 독립 owner 기록. 실제 각 유형 원천 3곳과 질문 연결 |
| `directionalResearch.ts` | A→B4/B→A4. 수신자 일간·기존 방향 ID·각자 source 요구 |
| `conflictRepairResearch.ts` | 13마찰/회복 쌍. 사실 확인·각자 행동·합의·재검토·반례·중단 조건 |
| `lifeContextResearch.ts` | 접근·공개·모임 변화·생활 변화·재회·재정의 6맥락. 실제 상태 UNKNOWN, 필연적 단계 아님 |
| `canonicalRelationCrosswalk.ts` | 64정의, 지원 membership34/미지원30. 전통 class·성립·반례·기둥 소유 보존 |
| `recipientTenGodResearch.ts` | 기존 십성 효과 10정의와 우정 질문. 정의는 실제 수신 경험이 아님 |
| `individualMbtiCrosswalk.ts` | 16유형 전체 1,213 traits, raw·locator·hash·node·annotation·projection 대조 |
| `mbtiPairCrosswalk.ts` | 256방향 참고. direct158/inferred98 유지. 개인 사실로 사용 금지 |
| `semanticCrosswalk.ts` | 기존 36축·109facet. 선택 질문에 연결한 facet23, 나머지 직접 배정 보류 |
| `fusionCrosswalk.ts` | 기존 164연구 보존. social/recovery 맥락 후보36도 개인의 실제 두 root 미연결 |
| `categoryDifferenceResearch.ts` | 기존 6유형과 공유 가능한 개념·다른 질문·금지 전용 구분 |
| `sourceRegistry.ts` / `sourceInventory.ts` | 실제 확인한 외부 자료 7개와 내부 원천 그룹. 지식·관찰·계산 구분 |
| `rejectedResearch.ts` | 20반려/보류: 이력·기간·신뢰·질투·성패·권한·domain·계보의 부당한 승격 차단 |
| `bindingDesign.ts` / `researchTypes.ts` | 후속 검토 규칙·타입만. 실제 producer·binder·resolver 구현 없음 |

독립 조건부 편집 질문은 **32개**, 선행 의미 회수는 **4개**다. 26개 concept·144개 역할·32개 owner별 타입 기록·crosswalk의 수를 추가 독립 지식으로 합산하지 않는다. 신규 전통 사실·실증 사실·계산 사실은 모두 0이다. 자료 개수나 문장 차이만으로 의미의 독립성을 판정하지 않았다.

모든 신규 최상위 연구 record는 `connectedToRuntime=false`, `approvedForCustomer=false`, `existingScoreContribution=false`, `runtimeEvidenceIds=[]`다. 원본 source의 상태를 보존한 `originalState`는 신규 승인 상태가 아니다. MBTI audit의 1,213개 row는 동일 내용을 16개 typed data group으로 나누어 TypeScript의 과도한 union 추론을 피했다. 데이터·분류·원천 상태는 동일하다.

## 기존 연구 인수

기존 6유형의 모든 exported record를 file/export/index/ID/hash와 원천·조건·소유권·방향·facet·반례·검토 상태별로 조사했다. [인수 전체 목록](inherited-six-category-audit.json)과 [요약](inherited-six-category-summary.json)을 제공한다.

| 기존 카테고리 | 조사 record | 기존 챕터 후보 |
|---|---:|---:|
| love | 851 | 80 |
| marriage | 1,133 | 112 |
| parentChild | 1,209 | 120 |
| coworker | 1,948 | 172 |
| managerReport | 1,741 | 96 |
| businessPartner | 1,917 | 96 |
| 합계 | 8,799 | 676 |

이 수에는 index·view·감사 자료가 포함되며 독립 명리 사실 수가 아니다. 기초 원천 2,991개도 원본 locator/hash와 대조했다. 그중 `deep:`/`foundation:` 접두사의 natal 정의는 1,036개다. 기존 자료의 조건·출처·미해결 문제를 새 연구의 사실로 승격하지 않았다. 원본 DB 전체는 기준 파일 3,537개 hash 보존 검사로 따로 확인한다.

## 친구 관계의 독립 정보

연애의 독점 기대, 결혼의 공동생활 책임, 부모·자녀의 보호·양육 권한, 동료의 산출물, 상사의 평가 권한, 사업 파트너의 계약·손익을 friendship으로 전용하지 않았다. 우정에서는 선택한 만남, 다른 친구와의 관계, 비독점적 연결, 별도 삶의 가용 시간, 사적인 정보의 사용 허락, 호의의 부담, 관계 형태를 바꿀 자유를 묻는다.

예를 들어 “같은 취향은 같은 사용 설명서가 아니다”는 활동 이름의 공통점과 시간·예산·강도의 기대를 구분한다. “말하지 않은 호의 장부의 잔액을 상대에게 갚으라고 할 수는 없다”는 요청·수락·보답 기대의 차이를 묻는다. “사과를 받아 주는 것과 예전처럼 지내는 것은 같은 약속이 아니다”는 사과 수락·공개 범위·접촉·친밀감의 회복을 나눈다. 모두 조건부 편집 연구이며 실제 고객 이력이 아니다.

36개 질문·핵심 의미·positive/risk/twist의 완전 중복은 없고, 676개 선행 후보와 이름·역할·관계명을 일반화한 핵심/장면의 완전 일치도 없다. 문자열 검사는 표절·복제의 일부 검사일 뿐 의미 차이의 증명으로 사용하지 않았다. [독해 및 의미 구분 검토](human-review.md)는 가까운 주제 사이의 다른 정보와 재사용 범위를 기록한다.

## 원천과 검증 수준

원본 개인 MBTI traits의 source-local 상태는 direct938/inferred275다. 현재 비연애 projection에 허용되는 trait는 336개다. `direct`는 실제 개인 효과가 검증됐다는 뜻이 아니며, 원문에 친구 수·외로움·지속에 대한 단정이 있어도 그 단정을 새 우정 사실로 사용하지 않는다. 모든 입력 유형과 모든 Pair를 조사했지만 **16유형×36문단 또는 256방향×36문단의 승인된 전문 원고를 완성한 것은 아니다.**

원국은 실제 해당 개인의 성립 조건이 확인돼야 하고, 교차 관계는 현재 producer가 지원하는 양쪽 실제 refs가 필요하다. 전통 해석의 `E_UNVERIFIED` 등 원래 검토 상태를 유지했다. 미지원 천간합·형·파·원진을 충·해로 바꿔 출력하지 않는다. 개별 Fusion은 같은 개인의 실제 명리·MBTI 두 root가 필요하며, 하나가 없으면 해당 Fusion을 보류한다. 유효한 natal까지 지우거나 상대의 MBTI로 채우지 않는다.

외부 자료는 [출처와 접근 범위](source-verification.md)에 기록했다. 원문 구간을 확인한 논문3개, 초록만 확인한 논문3개, 저자 해설1개다. 문헌의 관찰·이론과 이 DB의 현대적 편집 적용을 구분했다. 한국 고객의 실제 우정·MBTI·명리 효과를 해당 문헌이 검증했다고 주장하지 않는다.

## 실제 생성에서 재현한 기존 공백

[20개 실제 생성 관찰](baseline-generation-digests.json)과 [friendship ancestry 관찰](friendship-provenance-observations.json)을 제공한다. 기존 가상 입력을 실제 friendship 스키마로 매핑했고, 관계 이력 필드를 payload에 추가하지 않았다. 양쪽 MBTI 유/무, 한쪽 출생시간 미상, 동일/다른 유형, 합·충·미검출, 같은/다른 수신 십성, 전체 슬롯 교환, 이름만 교환을 포함한다.

INTP의 `mbti:INTP:traits:child:socially_detached_child:plainKo`는 개인 projection에서 제외되지만 일부 mixed side/comparison을 통해 실제 friendship 문장의 provenance에 남는다. 대표 A0의 CH07.P1 S1–S4, 동일 유형 H0의 CH04.P1 S1–S4에서 확인했다. 두 slot 관찰까지 합친 19개 감사 항목은 사례·slot별 중복을 포함하며 19종의 서로 다른 결함을 뜻하지 않는다. raw 아동 원문 복사나 canonical 지수의 인과적 기여량을 확인했다는 주장은 하지 않는다.

현재 비연애 projection의 WORK/CAREER/THINKING/MONEY/INVESTMENT/STUDY/CHILDREN 등의 제한은 그대로다. 친구 사이의 돈·학업·도움 질문이 관련돼도 domain을 우회하지 않는다. 전체 ancestry의 owner/domain/context 검토를 후속 연결의 필수 조건으로 인수했다.

L0/M0는 기존 `compatibility-product-13d-7b-v1` fallback을 유지한다. 새 연구의 9/36/144 coverage와 모든 현재 입력이 새 reader edition으로 실제 발행된다는 주장은 구별한다. 실제 paid generator의 계산·전체 Evidence·원고·integration·개인A/B·Book 7종 digest를 비교하며 저장본에 접근·재생성·덮어쓰기하지 않는다.

## 검증 결과와 Git

기준 SHA의 알려진 실패 27건을 실제 재현했다. 추가로 기존 6유형 연구의 과거 파일-hash lock 검사 6건도 **기준 SHA에서 이미 실패**한다. 원인은 승인된 이전 Vercel 수정의 `src/lib/tickets/localDatabase.ts`를 오래된 hash와 비교하는 것이다. 기존 검사나 과거 보고서는 수정·삭제·skip하지 않는다.

최종 수치·실패 이름/첫 오류 비교·보존 결과는 [validation-results.json](validation-results.json) 및 [existing-failures.json](existing-failures.json)에 기록한다. TypeScript·lint·기본 Turbopack Production build·NFT·diff-check를 확인한다. 전체 프로젝트의 모든 테스트가 PASS라고 표현하지 않는다.

최종 실행 결과:

- 신규 정형 검사 3,715 PASS + 실제 생성/방향 교환 21 PASS = **3,736 PASS / 0 FAIL / 0 skip**.
- 기존 관련 회귀 225 PASS / 27 FAIL, 선행 6유형 연구·trace 검사 5,583 PASS / 6 FAIL. 기준 SHA와 수정 후의 실패 이름·첫 오류가 모두 일치한다. 중복 제거한 최종 관련 17파일은 **9,544 PASS / 기존 33 FAIL / 신규 실패 0**이다.
- 실제 friendship 20관찰의 계산·전체 Evidence·원고·integration·개인A/B·Book **140/140 digest 일치**. 전체 관찰도 동일하다. 기존 6상품 frozen 통합 64검사도 포함한다.
- TypeScript 진단 0, lint PASS, 기본 Turbopack Production build PASS, build 경고 0, staged diff-check PASS.
- 최종 app NFT 88개에 raw validation/knowledge 파일의 불필요한 포함 0. 대상 `/dev/account/api/[action]`은 430파일·31,731,151bytes(30.26MiB), 최대 app trace는 54,618,281bytes(52.09MiB)다. 원격 함수의 정확한 패키지 크기와 동일한 수치로 주장하지 않는다.
- 기존 3,537파일과 인수한 8,799개 연구 record가 모두 동일하다. 기존 worktree31개·원본 미커밋11개도 HEAD·브랜치·status·tracked/nonignored untracked hash가 동일하다.

신규 레지스트리의 최상위 record는 2,138개이며 대부분 원천 대조·역할·참조 자료다. 이 숫자를 2,138개 독립 우정 해석으로 표시하지 않는다.

관련 신규 연구·테스트·검증 파일만 commit/push한다. 정확한 신규 SHA의 자동 Vercel Preview READY는 최종 응답과 외부 `/tmp/gyeol-compatibility-friendship-product-knowledge-01-validation/preview-receipt.json`으로 확인한다. 로컬 build 성공을 Preview READY로 대신하지 않는다.

연구 구현 커밋 `c2e23f0fc6119efd14cbc7d7d2e1be0a12f8a43d`의 [Vercel Preview](https://gyeol-report-7bfc5lncm-gyeol-report-s-projects.vercel.app)는 **READY**다. 동일 project·작업 branch·정확한 SHA·Preview 환경을 확인했고, 컴파일·TypeScript·47/47 static 생성·함수 출력 배포가 완료됐으며 경고 0건이었다. [구현 Preview 실측 기록](preview-implementation-receipt.json)에 메타데이터와 수집한 로그를 남겼다. 이 결과를 기록하는 마지막 문서 커밋의 SHA·Preview도 별도로 확인하여 최종 응답과 외부 receipt에 남긴다. 이번 확인은 Production 배포나 판매 승인을 의미하지 않는다.

기존 worktree31개·미커밋11개·Vercel 추적 수정·원본 checkout·master·Production·운영 DB·결제·인증·기존 Book을 보존한다. 대운/세운 전문 DB·한국어 표현 DB·Evidence Binding 구현·원고 생성기 수정은 시작하지 않는다.
