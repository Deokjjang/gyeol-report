# V4-MAJOR-FORTUNE-PRODUCT-KNOWLEDGE-01

기준: `v4/compatibility-friendship-product-knowledge-01` / `565c4613d4e01d65510380e0f597c535f81396c0`. 작업: `v4/major-fortune-product-knowledge-01`, 독립 worktree `/private/tmp/gyeol-major-fortune-product-knowledge-01`.

**대운 전용 독립 연구 DB 작성·오프라인 검증 완료. 런타임 연결·고객 승인·판매 승인 없음.** 기존 계산·후보 선택·원고·Book 코드는 한 줄도 바꾸지 않았다. 원본 checkout과 기존 32개 worktree, 미커밋 11개를 보존했다. master·Production·DB·결제·환경변수는 변경하지 않았다.

## 산출물과 수량의 의미

[연구 DB](../../../src/lib/report-knowledge/major-fortune-product-research/)는 타입과 정적 레코드로만 구성한다. 모든 신규 레코드는 `productKey=major_fortune`, `connectedToRuntime=false`, `approvedForCustomer=false`, `existingScoreContribution=false`, `runtimeEvidenceIds=[]`다. 실제 입력도 동일한 productKey, slug는 `major-fortune`, 정규화 kind는 `majorFortune`이다.

| 자료 | 수 | 파일 |
|---|---:|---|
| 대운 자체 전문 주제 | 16 | cycleResearch.ts |
| 십성별 장기 연구 | 10 | tenGodResearch.ts |
| 십성별 주기 내 발전 질문 | 10 | cycleDevelopmentResearch.ts |
| 초기·중기·후기 | 3 | phaseResearch.ts |
| 교운·확정성 상태 | 7 | transitionResearch.ts |
| 기간 관계 scope | 4 | interactionResearch.ts |
| 상대 연도 슬롯 | 14 | yearMatrix.ts |
| 연도 비교·중복 판단 | 9 | comparisonResearch.ts |
| 생활 영역 | 8 | domainResearch.ts |
| 실제 계산에 비춘 전문 적용 사례 | 8 | observedPeriodResearch.ts |
| 기존 기간 연구 참조 | 410 | temporalCrosswalk.ts |
| MBTI 유형 참조 묶음 | 16 | mbtiCrosswalk.ts |
| 기존 축·facet 참조 | 36 / 109 | axisCrosswalk.ts / facetCrosswalk.ts |
| 기존 Fusion 활용 참조 | 164 | fusionCrosswalk.ts |
| 후속 Binding 단계 | 9 | bindingDesign.ts |
| 반려·보류 | 13 | rejectedResearch.ts |
| 출처와 한계 | 17 | sourceInventory.ts |

총 **863개 registry 레코드**다. 이 가운데 735개는 기존 자료의 locator·상태·원문 보존을 위한 참조이고, 89개는 위 표의 전문 연구·질문·관찰 사례다. 나머지는 출처 17, 설계 9, 반려 13이다. **863개의 새로운 명리 사실이나 독립 계산 근거를 만들었다는 뜻이 아니다.** 14슬롯×12질문=168개는 분석 질문의 뷰이며 168개의 독립 의미로 세지 않는다. [coverage manifest](coverage-manifest.json), [정보 중복 감사](information-duplication-audit.json)를 제공한다.

## 실제 실행 경로와 사용 여부

[38개 실행 파일·심볼·SHA inventory](execution-source-inventory.json), [상품 계약](product-contract.json), [producer 지원 매트릭스](producer-support-matrix.json)를 확인할 수 있다.

1. 유료 공개 경로의 `src/lib/book/paidRuntime.ts`는 기존 gate와 주문 맥락 검증을 거쳐 `generateV4ShadowReport`를 호출한다. 명칭에 shadow가 있어도 현재 유료 경로와 공유하는 실제 편집 함수다. 이용권 Worker도 같은 생성 함수를 사용한다. 이번 검증은 함수를 오프라인 호출하며 Worker·주문·DB를 실행하지 않는다.
2. 입력 정규화 → `buildV4MajorProduct` → `composeMajorFortuneNarrative` → `majorNarrativeEvidence` → writer가 꺼진 `createMajorFortuneV3` → 기존 `calculateCustomerDayun`·명리 계산·`buildMajorFortuneEvidence`를 재사용한다.
3. `majorFortuneHorizon`은 기존 cycle을 고객용 14년 창에 투영한다. legacy horizon 기본 인수는 futureYears=6이지만 현재 final/outlook 경로는 10을 전달한다. 이를 14년짜리 대운으로 바꾸지 않는다.
4. `majorFortuneDecadeReading`은 실제 연주·십성과 원국/대운 지지 관계, reason ID를 만든다. V4는 겹치는 cycle의 연도 row를 재구성한다. 원국–대운 factor는 원래 packet의 currentCycle 것만 전달한다. 다른 cycle에 그대로 복제할 수 없다.
5. 기존 material packet, 연도 개인화, 관계 bind, periodPlanner, timeProductContext가 후보를 고르고 문장을 조합한다. 신규 DB는 이 경로에서 import되지 않는다.
6. 기존 `projectV4Composition`·publication validator·`projectBook`·snapshot/저장본 읽기 계약을 유지한다. 과거 저장본은 다시 생성하지 않는다.

필수 A–K 구분은 다음과 같다.

| 구분 | 확인 결과 |
|---|---|
| A 만세력 사실 | 기존 원국 계산·일간·자리·미상 시간 계약 그대로 |
| B 대운 | sect2 / lunar-javascript 1.7.7 / KST / 실제 12주기와 10년 범위 |
| C 원국×대운 | base currentCycle의 실제 관계와 제한된 factor만 전달 |
| D 대운×세운 | cycleRelations와 original reason ID; 전환 연도는 완료 이후 설명 |
| E 원국×세운 | natalRelations의 affectedPillars와 실제 지지 보존 |
| F 교운 | 정확 시각·범위·활성 null·미지원 구간 별도 |
| G 후보 | selected material/seed, available Fusion 및 주제 관련 projection |
| H 실제 사용 | 실제 표시 block의 proof와 represented ledger를 별도 수집 |
| I 미사용 연구 | 17개 기존 연구 폴더의 자료는 존재만으로 런타임 사용이 아님 |
| J 미지원 | 천간합화, 강도/희기/해소, dedicated 3층 verdict, 두 참가자 삼합 등 |
| K 구조 한계 | 전환 전 상세 관계, 다른 cycle의 원국 factor, 연도 요약과 정밀 시각 근거의 차이 |

[후보·표시 감사](candidate-display-audit.json)에서 A는 material 17개 중 13개 feature root, B는 25개 중 15개, C는 23개 중 13개가 실제 표시 proof에 나타났다. C의 available Fusion 1개는 표시 proof에 사용되지 않았다. E/F의 MBTI 미상은 available/표시 Fusion 모두 0이다. 후보 수·문장 수·반복 root를 독립 사실 수로 환산하지 않는다.

## 14년·10년·교운 계약

상대 슬롯은 **baseYear−3부터 baseYear+10까지, 양끝 포함 14년**이다. 2026년 사례는 2023–2036, 별도 2027년 검증은 2024–2037이다. 자동으로 2023–2036에 고정하지 않는다. 연도 row의 달력 cycle과 평가 instant의 활성 cycle은 다를 수 있다.

정확 경계 T는 직전까지 이전 주기, T부터 새 주기다. 범위는 기존 selector대로 earliest 직전까지 이전, `[earliest,latest)` 활성 미확정, latest부터 새 주기다. 범위의 중간값을 생성하지 않는다. 현재 평가가 범위 안이면 기존 `CURRENT_DAYUN_BOUNDARY_UNCERTAIN`을 유지한다. 첫 대운 이전의 실제 target-year 요청은 `DAYUN_CYCLE_UNAVAILABLE`; 가상 0번 주기를 만들지 않는다.

C는 **2028-04-23 21:42 KST** 전 壬申/편재, 정각부터 辛未/상관이다. 2028 戊申/비견은 연주 십성이다. 이 연도 row의 after-cycle 관계를 전환 전으로 소급할 수 없다. D/F의 2033 교운 범위 **2033-06-14 02:00 ~ 2033-10-15 23:59:59 KST**도 그대로 남겼다.

요청된 **“전환 없는 14년”은 완전히 덮이는 정상 10년 cycle의 14연도 창에서 성립하지 않는다.** 누락이나 미확정을 무전환 사례로 위장하지 않았다. 실제 A–F에 최소 한 번의 전환과 전환 없는 개별 연도가 모두 존재함을 검사했다. 이 도달 불가능 조건과 대체 검증은 manifest·반려 자료에 명시했다.

초기/중기/후기는 기존 편집 위치를 검토하는 질문이다. 경과 연수만으로 시작·성공·정리를 정하지 않는다. 고객용 마지막 해도 대운의 끝이나 인생의 도착점이 아니다.

## 전문 의미와 실제 적용 사례

십성 10개 각각 장기 핵심, 긍정, 과용, 다른 십성과의 차이, 필요한 원국·오행 근거, 일·돈·학습·관계 조건, 환경, 의외의 장점, 반전, 금지를 구분한다. 예를 들어 정재는 반복 운영의 지속 조건, 편재는 외부 선택의 범위이며 부의 크기·수입·투자 수익을 보장하지 않는다. 정관의 합의 기준과 편관의 긴급 대응 한계도 분리한다. 원국/대운/세운의 동일 십성은 각각 개인 구성/장기 조건/해당 연도 조건이다.

[실제 원고·관계·원래 ID](actual-period-observations.md)와 [8개 전문 관찰 연구](../../../src/lib/report-knowledge/major-fortune-product-research/observedPeriodResearch.ts)는 다음 차이를 다룬다.

- A 2028: 戊寅/편인 대운과 戊申/편인 세운. 대운–세운 寅申 충·申寅 형과 세운–원국 일지 申子 반합은 서로 다른 scope다. 연결 가능성이 긴장을 없앤다고 말하지 않는다.
- A 2027: cycle 관계가 비어도 원국의 실제 관계는 남는다. 관계의 부재를 전체 기간의 평온으로 확장하지 않는다.
- B 2028: 己卯/정재 배경, 戊申/편재 연주지만 두 branch relation 배열 모두 비었다. 일반 십성 비교와 유지 질문으로 제한한다.
- B 2034: 다음 대운 戊寅/편재, 이전 己卯/정재, 해당 연주 甲寅/비견을 분리한다. 원국 설명을 다음 대운 십성으로 잘못 붙이지 않는다.
- C 2028: 전환 전후 배경을 나누고, 원국 편관 설명과 다음 辛未/상관의 역할을 혼합하지 않는다.
- C 2033: 대운–세운 충·형과 원국 연지/시지의 형·파는 대상과 질문이 다르다.
- C 2026과 A 2028: 같은 편인 세운이어도 대운과 원국 관계가 달라 같은 사건·같은 원고를 강제할 근거가 아니다.
- D 2033: 시주를 만들거나 교운 범위를 중앙값으로 축소하지 않는다.

생활 연구는 자기 이해·일·자원·학습·대인·연애/결혼·가족/생활·장기 선택 8영역이다. 직업·소득·혼인·가족 역할은 해당 시점에 확인되지 않으면 조건부 장면이며 현재 입력을 14년 이력으로 확장하지 않는다. 긍정/위험/반전은 각각 활용 조건/과용 조건/다른 선택의 가능성을 전달한다.

## 기존 지식 인수와 출처

[전체 inherited inventory](inherited-research-inventory.json)는 17개 연구 폴더 **15,563개 레코드**의 export·index·원래 ID·SHA·확인 상태를 보존한다. [foundation handoff](foundation-handoff-audit.json)의 2,991개는 이전 인수 집합과 겹치므로 별도로 더해 새 자료 수로 부풀리지 않는다. 기존 실행형 [명리 DB export inventory](legacy-knowledge-inventory.json)도 제공한다.

| 기존 연구 폴더 | 레코드 |
|---|---:|
| career-product-research | 839 |
| compatibility-business-partner-research | 1,917 |
| compatibility-coworker-research | 1,948 |
| compatibility-friendship-research | 2,138 |
| compatibility-love-research | 851 |
| compatibility-manager-report-research | 1,741 |
| compatibility-marriage-research | 1,133 |
| compatibility-parent-child-research | 1,209 |
| composite-structure-research | 301 |
| comprehensive-product-research | 512 |
| fusion-knowledge-research | 374 |
| love-product-research | 764 |
| mbti-foundation-research | 531 |
| mbti-pair-research | 279 |
| relation-research | 246 |
| semantic-axis-research | 370 |
| temporal-interaction-research | 410 |

선행 독립 전문 DB는 종합·커리어·연애와 궁합 7유형이다. 기존 대운·세운 실행 자료를 별도의 완성된 전문 연구 DB라고 부르지 않는다. 대운은 커리어나 연애의 사건 장면을 이름만 바꿔 복제하지 않고 장기 조건·유지·전환의 관점으로 검토한다.

MBTI 16유형의 기존 512개 연구 레코드는 locator와 전체 원래 상태를 인수한다. 36축·109facet·Fusion 활용 164개도 원래 조건과 미검증 상태를 보존한다. `timeProductContext`는 실제 개인 근거와 시간 주제의 관련성이지 새로운 명리 강화·인과 계산이 아니다. MBTI는 실제 운세 변화의 시각·사건 근거가 아니다. [MBTI Pair 적용 제한](mbti-pair-applicability.json)처럼 단독 대운 입력에는 두 번째 사람이 없어 256 방향 Pair를 시간 사실로 연결하지 않는다.

고전은 2026-10-14에 다음 전사 본문을 직접 열람했다. 장문 복제 없이 제한된 원칙만 요약했다.

- [三命通會 卷二 論大運](https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷02): 기반과 행운, 10년 단위 및 기산 시각 논의. 스캔 교감·현행 계산 독립 검증은 미실시.
- [滴天髓 歲運論](https://zh.wikisource.org/wiki/滴天髓/09): 세 층위의 역할과 조건별 충·합 논의. 해설의 저자 계보·예측 타당성은 확정하지 않음.
- [子平真詮 論行運](https://donglishuzhai.net/chapter/3738.html): 원국 조건과 행운 간지 비교. 본문/교감/현대 편집자 주석과 이견을 구분한다.

고전의 성공·죽음·질병 단정은 고객용 사실로 승인하지 않았다. 현대 생활 적용은 편집 연구이며 전통 문헌이나 실증 사실로 표시하지 않았다. 전체 출처 재검증·계보 교감 작업은 이번에 수행하지 않는다.

## Binding 설계와 남은 한계

[타입 설계](../../../src/lib/report-knowledge/major-fortune-product-research/bindingProposalTypes.ts)는 실제 Evidence ID와 연구 ID를 구별한다. 원국 → 대운 → 활성 판정 → 세운 → 관계 → 시간 유효성 → 연구 대조 → 14년 배정 → 원고의 9단계마다 source/version, scope, 참가자, 성립, 확정성, 반례, 기간별 fact root, 미지원 사유를 요구한다. 구현 함수·ID 발급·점수·가중치는 없다.

남은 한계는 전환 전의 상세 관계 packet, 다른 cycle의 원국 factor, dedicated 3층 성립/강도/해소 판단, 고전 교감·실증 검증이다. 새 연구로 이 빈칸을 계산 사실처럼 채우지 않는다. 후속 계산 요구사항만 기록했으며 producer 확장은 실행하지 않았다. Evidence Binding·후보 선택·문단 배정·생성기 연결도 후속 별도 작업이다.

## 검증

[입력](input-cases.json), [기준 실제 생성 원본](baseline-generation.json), [생성 보존](generation-preservation.json), [검증 결과](validation-results.json), [실패별 파일·이름·첫 오류](existing-failures.json)를 제공한다.

- 새 테스트 **1,671 PASS / 0 FAIL**. 기존 상속 레코드 전체의 원래 상태·hash, offline 경계, 10십성/16주제/14슬롯/전환/지원 관계/미상 입력을 검사한다.
- 알려진 기준 실패 **27+6=33건**을 실제 재현했다. 추가 대운 회귀에서 `majorEvidenceSeparation.test.ts`의 과거 원고 frozen hash 6건도 기준 SHA에서 이미 실패했다. 기존 39건 모두 수정 전후 테스트 이름·첫 오류가 일치한다. 삭제·수정·skip하지 않았다.
- 관련 26파일 최종 **11,356 PASS / 기존 39 FAIL / 신규 0**. 전체 프로젝트 테스트를 모두 다시 실행한 결과는 아니다.
- 기존 6상품 frozen 통합 **64검사**에서 계산·전체 Evidence·원고·Book·snapshot·과거 저장본/공유 재열람 digest가 일치했다. 실제 A–F 대운의 계산/Evidence/draft/원고/Book **30/30 digest**와 전체 관찰이 동일했다.
- 실제 정확 경계 직전/정각/직후, 범위 earliest 직전/정각·latest 직전/정각/직후, 첫 대운 이전, 미판정 입력, 다른 기준 연도, 현재 교운 범위 내부의 발행 거절을 확인했다.
- TypeScript **기준 0 → 최종 0**, lint PASS, 기본 Next.js 16.2.4 **Turbopack Production build PASS / 경고 0**, diff-check PASS. 신규 테스트의 변수명 lint 오류는 수정 후 재검증했다.
- [기준 3,603파일](base-file-preservation.json) 모두 byte hash 동일. 신규 연구 외의 코드·연구·기존 테스트·보호 파일은 변경하지 않았다.
- [워크스페이스 보존](workspace-preservation.json): 기존 32 worktree의 HEAD·브랜치·상태와 tracked/untracked bytes 동일, 원본 dirty 11개 유지.
- [trace 보존](trace-preservation.json): 88개 app NFT, 불필요한 raw 연구/검증 문서 0. 문제 대상은 430파일/31,731,151 bytes, 최대 path 합 54,618,281 bytes. 로컬 NFT 측정이며 원격 함수 패키지의 정확한 크기라고 주장하지 않는다. 이전 `localDatabase.ts` trace 수정 hash 유지.

## Git·Preview·종료

신규 대운 연구·두 테스트·본 검증 폴더만 commit/push한다. 정확한 push SHA의 Preview 결과는 검증 receipt와 최종 응답에 기록한다. master·Production 배포·이벤트 활성화는 실행하지 않는다.

현재 단계는 독립 연구 인수 준비 완료다. 고객용 원고나 판매 품질 PASS, Production 배포 승인을 뜻하지 않는다. 세운 12개월 DB·표현 DB·전체 출처 검증·실제 Binding·선택·배정·생성기 작업을 시작하지 않고 종료한다.
