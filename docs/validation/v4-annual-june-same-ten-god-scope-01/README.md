# V4-ANNUAL-JUNE-SAME-TEN-GOD-SCOPE-01

Base: `4edd0e17ce594b1f5aa045f4edce515a2880f1f0`. Branch: `v4/annual-june-same-ten-god-scope-01`.

**계산 관측 기능은 구현했으나 원본 6월 연구 적용은 보류한다. 월 기술 계약은 10/12를 유지한다.** 현재 Fact 검증을 원본 역할 승인으로 취급하지 않는다. 신규 핵심 소스 contract.ts/adapter.ts 2개, 신규 테스트/CLI 각 1개, 검증 문서 5개만 추가했다. 기존 연구·생성기·Graph·Binder·이전 월·고객 Runtime 파일 변경은 0이다.

## Source와 역할 결정

`afpr:month-slot:06`의 원래 requires 3개, 망종, Source scope, Counterexample/Prohibition/Source Group, null Meaning/Claim을 보존한다. 지정된 record/file SHA, Source Version, catalog key를 실제 원본과 대조했다. 6월에는 특정 십성 역할이 없고 원래 월간 십성 연구 10개에도 requiredRole이 없다. 기존 matcher는 계속 AMBIGUOUS다. MONTH_STEM/MONTH_BRANCH_MAIN 각각을 진단 목적으로 검증하는 것은 특정 역할 또는 역할 독립적 의미의 원본 승인이 아니다. 대표 역할을 고르지 않았으며 원본 6월 Candidate는 모든 입력에서 ROLE_SOURCE_DECISION_REQUIRED다.

## 실제 실행

| Fixture | 실제 6월 전체 구간 | 이전 동일 십성 관측 참조 | 현재 관계 | 현재 Fact Binding | 원본 후보 |
|---|---:|---:|---:|---:|---|
| fixture-annual-A | 2 | 5 | 9 | 2 | ROLE_SOURCE_DECISION_REQUIRED |
| fixture-annual-F | 2 | 5 | 9 | 1 | ROLE_SOURCE_DECISION_REQUIRED |
| fixture-annual-C2028 | 2 | 9 | 13 | 2 | ROLE_SOURCE_DECISION_REQUIRED |
| fixture-annual-ranged-transition | 2 | 5 | 8 | 0 | ROLE_SOURCE_DECISION_REQUIRED |

계산 역할별 관측은 원래 1~5월의 canonical segment에서만 검색했다. Owner/Fixture/선택 연도/현재보다 이전인 half-open 기간, 원래 일간과 기준 천간·대상 천간, Producer/version, 원본 Graph ID·Evidence ID·Source Identity·Root·전체 ancestry·certainty를 기록한다. 원래 계산된 월간 및 월지 본기를 기존 matchMonthlyGod의 명시적 진단 역할로 확인한다. 새 십성을 계산하지 않는다. 같은 Graph node에 있는 두 역할도 개별 observation ID로 구분한다. ANNUAL_STEM/DAYUN_STEM/FLOW_GOD는 출처 감사를 남기되 이전 월간 발생으로 선택하지 않는다.

EXACT_ROLE_SCOPED_MATCH는 역할 일치, SAME_GOD_DIFFERENT_ROLE은 역할 차이다. 기간·연주·대운·관계 조건이 다르면 SAME_GOD_DIFFERENT_CONTEXT로 추가 구분한다. differentPeriodOnly와 calculatedContextChangedBeyondPeriod를 통해 기간만 다른 경우와 계산 관계 자체가 달라진 경우를 구분한다. 같은 역할 일치와 문맥 차이 건수는 서로 다른 관점이며 합산해 독립 관측 수로 취급하지 않는다. 이전 발생 부재와 검증 불가를 별개로 처리한다. 실제 같은 역할의 반복 8건은 모두 기간만 다르고 계산 문맥은 연속이었다. 역할이 다른 16건은 계산 문맥도 달랐지만 같은 발생으로 합치지 않았다. 과거/현재 관계의 불확실성 때문에 문맥 비교 7건은 보류다. 어느 경우에도 독립 정보/의미를 추가 발급하지 않았다. 정확한 건수는 summary, comparisonDimensions와 역할별 Witness에 있다.

## 관계·기간·정보 중복

기존 April RelationWitness 타입과 relationMatcher/annualIdentity 검증을 재사용했다. April의 occurrence helper는 private이므로 그 구조 검증 투영만 신규 June 모듈에서 재사용한다. 기존 파일을 공개 API로 변경하거나 새 관계를 계산하지 않는다. month_natal_branch/month_annual_branch/month_dayun_branch/month_natal_element의 원본 참가자·영향 궁·기간·Producer·Root·ancestry·certainty·blockers를 보존한다. F/Ranged의 미상 시주 오행 관계 제한을 유지한다. Ranged의 실제 6월 대운은 transition_uncertain이며, 6월에는 원래 대운 관계 Fact가 없다. 이를 새로 만들지 않는다. 과거 4~5월의 실제 조건부 대운 관계는 WITHHELD 상태를 유지한다. 검증 가능한 현재 구간만 Fact Binding한다.

기존 compareAnnualSegments를 원래 전체 Ledger에 실행한다. 비인접 과거-현재 비교는 NON_ADJACENT_SOURCE_WITNESS이며 실제 중간 인접 Edge 경로를 참조한다. 직접 인접 비교 결과로 위장하지 않는다. 과거/현재 연주·대운·관계 서명·참가자와 shared/changed roots는 직접 Root가 null인 경우에도 전체 원본 ancestry Root 집합을 비교하여 보존하되 Root 차이/십성 반복을 새로운 의미나 생활 사건으로 승격하지 않는다. 관계 문맥에 보류가 있으면 context comparison도 WITHHELD다. 다른 기간 Fact를 동시 Binder Receipt로 선택하면 기존 NO_TIME_INTERSECTION으로 차단된다.

## 실제 관측 예시

A의 첫 6월 구간은 MONTH_STEM 상관(기준 庚 / 대상 癸), MONTH_BRANCH_MAIN 편관(기준 庚 / 대상 丙)을 별도로 기록한다. 같은 Graph Node에 담긴 값도 동일 역할로 합치지 않는다. 망종 이후 A의 MONTH_BRANCH_MAIN 정관은 1~5월에 검증 가능한 같은 십성 발생이 없어 NO_PREVIOUS_OCCURRENCE다. 현재 MONTH_STEM 편재의 이전 발생으로 이를 대신 채우지 않는다. 이 예시도 원본 연구의 대표 역할 승인이나 새로운 고객용 의미가 아니다.

## Native 계약과 보존

AnnualSpecialistIndex, ActualBindingIndex, annualRoleSelector, bindKnowledgeCandidate를 사용한다. 현재 한 구간의 경계·월주·실효 연주 및 필요한 확정 원본 관계만 선택한다. 과거 발생은 별도 비교 Source Witness다. 원래 12 Gates와 모든 기존 Source Group/Counterexample/Prohibition을 유지한다. 5개 기술 Gate는 실제 근거로 검증하며 나머지 7개 state/reasons와 Source Group 평가는 원래 Receipt와 같다. 이 진단 Binding의 use는 CURRENT_FACT_SCOPE_ONLY_NOT_JUNE_APPLICABILITY이며 6월 원본 후보 발급 승인이 아니다.

Annual 42 / Major 2, 원래 44개 후보 전체 해시의 정확한 multiset, Native Receipt 703개 ID/전체 해시 배열 및 진단 해시, Units 422 / held 164 / unmatched 396 / Typed Roots 246 / root references 855를 보존했다. 기존 10개 월 계약은 변경하지 않았다. 새 Fact Root·독립 의미·고객 Claim/Approval/Reader Bridge·Planner 배정은 0이다. 완료하지 않은 6월을 11번째 월로 집계하지 않는다.

## 검증과 환경

`node tools/annual-june-same-god/verify.mjs <새 외부 출력 디렉터리>`로 A/F/C2028 및 기존 Ranged recipe를 재현한다. 신규 테스트는 실제 정상·부정 사례와 원래 matcher의 모호성, 비중첩 Binder, 미상 시주, 조건부 대운, 변조·권한 위조 차단을 검증한다. 원본 703 Receipt 전문은 중복 저장하지 않고 기존 전체 해시 manifest로 대조한다. 원문 전체 실행 기록은 외부 final-run/june-observations.json에 있다. 공개 문서의 중복 Node/관측/Witness는 ID로 참조하고 원문 자체를 변경하지 않는다.

테스트 건수·정확한 Base 실패 메시지 비교·strict TS/lint·Webpack·Runtime AST/NFT·17 Books/102 digests·39 Publication 결과는 june-native-binding-coverage.json의 verification에 기록했다. 전체 Repository Suite는 실행하지 않았다. 기존 테스트 삭제/skip/timeout 증가 0이다. 과거 October 5000ms 민감성을 이번 실행 결과만으로 해결했다고 주장하지 않는다. 반복 실행 해시는 동일하고 개인정보 이름·생년월일과 Synthetic 의미 파일 의존성이 없는지 검사했다.

지속 Workspace/기존 Worktree/원본 Dirty 11/기존 사용자 Ref/Git Object/포렌식 915파일 비교는 외부 보존 로그로 분리했다. 기존 임시 경로 위험과 Codex 내부 임시 Ref 변화는 별도 지표다. 임시 Ref 변화가 있으면 대상 Object 접근을 검증하며 삭제 주체를 추정하지 않는다. 복구·정리·GC는 하지 않았다.

외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-june-same-ten-god-scope-01/`. master/Production/운영 DB/결제/Auth/Worker 변경은 없다. exact-SHA Preview READY는 기술 배포 확인이며 판매·고객 승인과 다르다. 후속 구현은 시작하지 않았다.

## 최종 실행 결과

신규 50 PASS / 0 FAIL. 기존 관련 17개 파일 792 PASS / 2 FAIL. October 대상 3 PASS / 0 FAIL, 나머지는 name filter로 미실행. 정확한 Base October 단독 실행은 1 PASS / 0 FAIL이었다. 기존 실패의 정규화한 전체 오류 메시지 비교 결과는 coverage.verification.testComparison에 있다. 신규 회귀 0, 원래 테스트/timeout 변경 0. 첫 신규 검증 중 기간만 달라진 문맥의 명시, 원래 기간의 transitionRange 필드, Ranged의 실제 관계 존재 여부에 맞게 신규 코드/테스트를 정정했다. 추가 수동 검토에서 직접 Root가 null인 관측의 상위 ancestry 공유를 누락하지 않도록 전체 원본 ancestry Root 집합으로 보완하고, 신규 테스트와 전체 오프라인 입력을 다시 실행했다. 기존 기능·자료를 바꿔 테스트를 통과시키지 않았다.

이전 동일 십성 관측 참조 24, 역할 일치 8 / 역할 차이 16, 이전 발생 없음 3 / 검증 불가 0. 현재 관계 39 중 검증 36, 보류 3. 현재 Fact Binding 5개, 원본 6월 후보 0, 월 계약 10/12 유지.

17 Books / 102 digests 및 저장 후 재열람 동일. Publication 39개는 32 SAFE_OFFLINE / 7 WITHHELD 동일. strict TypeScript 진단 0, ESLint 경고 0, Webpack Production Build PASS, build 경고 0. Runtime AST 46 roots / 700 modules 및 NFT 90 trace(앱 route 88 + 공통 2)의 실제 소스/외부 의존성이 정확한 Base와 같다. 생성된 .next 내부 산출물만 비교에서 제외했다. 기존 원본 6,483개 파일의 변경·누락 0.

기존 79 Worktree(지속 18, 과거 임시 61), 원본 Dirty 11개, 포렌식 915개 SHA 및 manifest의 914개 mtime 보존. 기존 사용자 Ref와 모든 이전 Worktree HEAD Object 접근 정상. 새 지속 Worktree 및 Branch/Index/Ref/Object/Upstream 등 의도한 Git metadata 변경을 별도 기록하며 변경 0이라고 주장하지 않는다. 과거 ignored·미기록 임시 자료 무손실은 UNVERIFIED다. Codex 내부 Ref 변화와 Object 보존은 외부 비교 로그로 분리하며 삭제 주체는 미확정이다. 정확한 commit/remote SHA 및 Preview는 외부 git-preview-receipt.json/FINAL-RESULT.json에 기록한다.
