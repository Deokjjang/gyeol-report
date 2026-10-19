# V4-ANNUAL-JANUARY-CARRYOVER-CONTRACT-01

Base: `c95a5181198ef674f6230f3f2cfa7536902ab9bd`. Branch: `v4/annual-january-carryover-contract-01`.

1월 오프라인 기술 계약을 구현했다. 기존 August Adapter를 재사용하며 핵심 신규 소스는 contract.ts/adapter.ts 2개다. 기존 연구·계산·Graph·Binder·이전 월·고객 Runtime 파일 변경은 0이다. 의미·상품·고객 발행 승인은 하지 않았다.

## 원본과 현재 1월

원본 `afpr:month-slot:01`의 세 requires, 소한, 이전 월 비교 규칙, Counterexample/Prohibition/Source Group과 Meaning/Claim null을 그대로 보존한다. 원본 파일/레코드 SHA와 Source Version은 january-source-proof.json에 기록했다. 양력 1월 1일과 Producer가 계산한 입춘은 별개이며, 명목 연주는 1월 실효 연주로 선택하지 않는다. 원래 1월의 모든 구간·월주·실효 연주·소한·Dayun·Evidence ID·Owner·Graph/Producer/기간·전체 ancestry를 검증한다.

| Fixture | 1월 전체 구간 | 실제 소한 KST | 이전 12월 마지막→1월 첫 비교 |
|---|---:|---|---|
| fixture-annual-A | 2 | 2026-01-05T17:23:10+09:00 | CARRYOVER_CONTINUITY |
| fixture-annual-F | 2 | 2026-01-05T17:23:10+09:00 | CARRYOVER_CONTINUITY |
| fixture-annual-C2028 | 2 | 2028-01-06T04:54:39+09:00 | CARRYOVER_CONTINUITY |
| fixture-annual-ranged-transition | 2 | 2027-01-05T23:09:58+09:00 | CARRYOVER_CONTINUITY |

## 이전 12월의 독립 출처

4개 기존 Packet/Graph에는 이전 연도 12월 Segment가 없다(`PRIOR_DECEMBER_NOT_IN_ORIGINAL_LEDGER`). 기존 annualMonthlyEvidenceMatches의 계산 기반 복원 방식을 재사용하고 buildAnnualMonthCalendar로 현재 연도 12개월 전체를 원본과 정확히 재현한 뒤, 같은 CustomerDayun·일간·원국 지지·부족/과다 오행으로 selectedYear만 하나 줄여 재실행했다. 원래 annualNarrativeEvidence 전체 재현도 별도로 통과했다. 입력의 전체 해시, 비식별 계산 기반, Producer 코드 해시/Version, 전체 이전 연도 기간과 출력 해시, 이전 12월의 모든 Segment를 기록한다.

새 자료는 `SOURCE_ONLY_ADJACENT_YEAR_WITNESS`다. 기존 Packet/Graph/Fact Root/Native Receipt에 끼워 넣지 않는다. 비교용 view에도 Graph Node와 Root는 없다. 기존 compareAnnualSegments와 Temporal Comparison의 half-open 기간/서명 비교 방식을 재사용했다. 이전 12월 마지막 구간과 현재 첫 구간, 현재 구간 간 소한 전후 비교를 독립된 비동시 기간으로 기록한다. 양력 연도 변경만으로 새 사건·의미를 발급하지 않는다. 이전 Graph가 필요한 transit/root 신규성 비교는 `WITHHELD_MISSING_PRIOR_GRAPH`다. 양쪽을 대칭적인 source-signature view로 비교하여 한쪽에만 Graph가 있다는 이유로 NEW_ACCEPTED_TRANSIT/NEW_RELATION_ROOT를 만들지 않는다. 이전 12월/현재 1월의 실제 계산된 월주·실효 연주·Dayun·십성·원국/대운/연주 관계 서명 비교와 Graph 확장 비교 보류를 구분한다.

Source가 확인되지 않으면 현재 1월 Binding과 분리하여 `PRIOR_DECEMBER_RECOMPUTATION_UNVERIFIED` 및 `PRIOR_DECEMBER_COMPARISON_WITHHELD`를 반환한다. 실제 A의 adjacentYear=WITHHOLD 실행으로 현재 1월 Candidate 유지/이전 비교 보류를 테스트했다. 검증된 실제 Source가 있는 이번 기준 4개 Fixture와 보류 경로를 혼동하지 않는다. 기술적 비교 검증은 이전 12월 해석의 의미 승인이 아니다.

## Native 계약과 보존

AnnualSpecialistIndex, ActualBindingIndex, annualRoleSelector, bindKnowledgeCandidate를 그대로 사용한다. 각 1월 Segment의 경계·월주·실효 연주 3개만 정확히 하나의 Window에서 선택한다. 이전 연도 Witness는 Native Evidence로 선택하지 않는다. 원래 12 Hard Gates 및 Source Group 평가를 보존하며 5개 기술 Gate 외의 기존 state/reasons는 원본과 동일하다. 비중첩 기간 동시 Binder는 기존 NO_TIME_INTERSECTION으로 차단된다.

기술 월 계약 9/12 → 10/12(01/02/03/04/05/07/08/09/10/12), 1월 Binding 8개 / 내부 후보 4개다. Annual 38 → 42, Major 2 유지. 기존 40개 후보 전체 해시, Native Receipt 703개 ID/전체 해시와 진단 전체 해시, Units 422 / held 164 / unmatched 396 / Typed Roots 246 / root references 855를 보존했다. 원래 Graph ancestry의 추가 참조는 신규 Root로 합산하지 않는다. 새 Graph Fact/Root, 고객 Claim/Approval/Reader Bridge, Planner 배정은 0이다.

## 재현과 검증

고정 Node v24.22.0에서 `node tools/annual-january-carryover/verify.mjs <새 외부 출력 디렉터리>`로 실행한다. A/F/C2028과 기존 Ranged recipe를 사용했다. Source-only Witness 입력에는 개인정보 대신 해시와 계산 요소만 기록하며, 공개 산출물에서 실제 가상 입력의 이름/생년월일을 검사한다. Synthetic 의미 파일 의존성은 0이다.

원본 703 Receipt는 해시 manifest로 보존하고 신규 Typed Receipt의 12 Gate·선택 Evidence·기간·해시를 별도로 기록한다. 원문 출력 전체는 외부 final-run/january-observations.json에서 확인할 수 있다. 기존 테스트 삭제/skip/timeout 증가는 없다. 전체 저장소 Suite는 실행하지 않았다. 정확한 Base의 기존 실패 전체 메시지와 이번 회귀를 비교한 결과는 coverage.verification에 있다.

외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-january-carryover-contract-01/`. 후속 구현은 시작하지 않았다. master/Production/운영 DB/결제/Auth/Worker 변경은 없다. Preview READY는 기술 빌드 확인이며 판매·고객 발행 승인과 다르다.

## 최종 실행 결과

신규 41 PASS / 0 FAIL. 기존 관련 16개 파일 751 PASS / 2 FAIL. October 대상 3 PASS / 0 FAIL, 나머지는 name filter로 미실행. 정확한 Base October 단독 실행은 1 PASS / 0 FAIL이었다. 기존 실패의 정규화한 전체 오류 메시지 비교 결과는 coverage.verification.testComparison에 있다. 신규 회귀 0, 원래 테스트/timeout 변경 0.

17 Books / 102 digests 및 저장 후 재열람 동일. Publication 39개는 32 SAFE_OFFLINE / 7 WITHHELD 동일. strict TypeScript 진단 0, ESLint 경고 0, Webpack Production Build PASS, build 경고 0. Runtime AST 46 roots / 700 modules 및 NFT 90 trace(앱 route 88 + 공통 2)의 실제 소스/외부 의존성이 정확한 Base와 같다. 생성된 .next 내부 산출물만 비교에서 제외했다. 기존 원본 6,474개 파일의 변경·누락 0.

기존 78 Worktree(지속 17, 과거 임시 61), 원본 Dirty 11개, 포렌식 915개 SHA/mtime 보존. 새 지속 Worktree 및 Branch/Index/Ref/Object/Upstream 등 의도한 Git metadata 변경은 별도 기록한다. Git metadata 변경 0이라고 주장하지 않는다. 과거 ignored·미기록 임시 자료 무손실은 UNVERIFIED로 남긴다. 정확한 commit/remote SHA와 Preview READY는 외부 git-preview-receipt.json에 기록한다.
