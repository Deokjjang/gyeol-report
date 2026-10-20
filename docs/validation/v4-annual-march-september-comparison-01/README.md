# V4 Annual March / September Comparison Contract 01

기준 `1e03899455eaf46ce0d613bf48d9a21ea88b1917`, 브랜치 `v4/annual-march-september-comparison-01`.

## 결과와 승인 경계

실제 원본 3월·9월 질문을 계산 구간의 비동시 비교에 연결했다. 월 계약 **4/12 → 6/12**, Annual 내부 후보 **24 → 29**. 3월 2개, 9월 3개. 미상 입력의 불완전 관계는 보류한다. 기존 Major 2개 및 전체 과거 후보 26개의 ID·전체 hash가 동일하다.

Witness 16개 중 10개 기술 검증, 6개 WITHHELD. 의미·생활 사건·운세 강도 승인이 아니다. Meaning/Claim Identity null, 고객 Claim/Approval/Reader Bridge·Planner 사용·신규 Fact Root·독립 사실 추가는 0/false다. Source Integrity FAIL 30, Meaning REVIEW_REQUIRED, Product UNKNOWN, Customer PENDING을 유지한다.

## 구현과 시간 계약

신규 핵심 소스는 `annual-temporal-comparison/contract.ts`, `adapter.ts` 두 개다. 기존 Comparator, Graph, Ledger, Boundary Validator, Selector, Binder 및 12 Hard Gates는 수정하지 않았다. October → Matrix → May → Actual adapter로 원본 Producer와 703 Receipt를 재검증한다. 변조된 Graph·Receipt·Source와 복제 context는 거부한다.

각 월의 이전 달 마지막 구간과 현재 모든 Canonical Segment를 확인한다. Before/After는 원래 `[start,endExclusive)`를 유지하고 정확하게 인접하며 교집합이 없다. 검증된 월은 각 구간에 독립적인 정확한 window의 Binder Receipt를 발급한다(15개). 월주·실효 연주·월간 십성·월지 본기 십성·경계 5개 요구는 실제 4개 Graph node로 검증된다. 원본 Source 조건·그룹·반례·금지·Identity·나머지 Gate 차단 상태를 유지한다. 여러 기간을 하나의 동시 Receipt로 합치지 않는다.

기존 `compareAnnualSegments`의 관측과 `comparisonApproved=false`를 보존한다. 별도 Witness는 실제 값·Participant·Relation 종류/범위·Producer·방향·Ancestry domain을 비교한다. Evidence ID 및 기간별 Root 주소 차이만으로 의미 차이를 만들지 않는다. 공유·변경 Root는 참조 집합이며 독립 정보 수로 집계하지 않는다. Typed Unit Root 246개는 불변이며 추가 63개 참조는 **이미 존재하던 Graph Root**로 따로 기록했다. 신규 Root·Unit 연결 0, unmatched 396 유지.

## 원본 Source

공통 `src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts`, export `ANNUAL_MONTH_MATRIX`.

- 파일 SHA256 `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`
- Source version `6d471db103d53dd9165e4832744501a686e59edc`
- 3월 `afpr:month-slot:03`, index 2, record SHA256 `ec1daf02dd14578a4d6bd69fe8870144f81ebb0ad94ca1fd9de257ffe1fe9303`
- 9월 `afpr:month-slot:09`, index 8, record SHA256 `81de9d7b2756401b029c4d8c2eabdabaffe097fc812ee86ec1a75125831aee82`

3월: 2월 마지막 → 3월 첫 → 실제 경칩 이후. 실효 연주 유지, 지난 입춘 재발급 0.
9월: 8월 마지막 → 9월 첫 이월 → 실제 백로 이후. 월 이름 변경을 새 독립 사실로 만들지 않는다.

## 실제 입력별 결과

기존 Annual 가상 입력 4개, 실제 현재 구간 16개, 이전 구간을 포함한 Side Proof 24개를 확인했다. 구간 수를 가정하거나 추가하지 않았다.

| 기존 Fixture | 월 | 현재 실제 구간 | 인접 비교 결과 |
|---|---:|---:|---|
| fixture-annual-A | 03 | 2 | CONTINUITY → VERIFIED_SIGNATURE_DIFFERENCE |
| fixture-annual-A | 09 | 2 | CARRYOVER_CONTINUITY → VERIFIED_SIGNATURE_DIFFERENCE |
| fixture-annual-F | 03 | 2 | WITHHELD → WITHHELD |
| fixture-annual-F | 09 | 2 | WITHHELD → WITHHELD |
| fixture-annual-C2028 | 03 | 2 | CONTINUITY → VERIFIED_SIGNATURE_DIFFERENCE |
| fixture-annual-C2028 | 09 | 2 | CARRYOVER_CONTINUITY → VERIFIED_SIGNATURE_DIFFERENCE |
| fixture-annual-ranged-transition | 03 | 2 | WITHHELD → WITHHELD |
| fixture-annual-ranged-transition | 09 | 2 | CARRYOVER_CONTINUITY → VERIFIED_SIGNATURE_DIFFERENCE |

F는 미상 출생시간에 따른 `UNKNOWN_BIRTH_TIME_ELEMENT_LIMIT`를 유지한다. Ranged는 3월 같은 제약으로 보류하지만 9월에는 미확정 오행 관계가 없다. Ranged 8월의 실제 3개 구간과 전환 불확실 구간을 보존했다. 9월 비교에는 실제 마지막 확정 구간만 사용하며 앞의 불확실 구간을 대체 선택하지 않는다.

## 실제 A 비교 예

- 03월 ADJACENT_MONTH: `2026-02-04T05:02:08+09:00`–`2026-03-01T00:00:00+09:00` → `2026-03-01T00:00:00+09:00`–`2026-03-05T22:59:00+09:00`. 월주 `庚寅` → `庚寅`, 실효 연주 `丙午` 유지. 결과 `CONTINUITY`.
- 03월 WITHIN_MONTH: `2026-03-01T00:00:00+09:00`–`2026-03-05T22:59:00+09:00` → `2026-03-05T22:59:00+09:00`–`2026-04-01T00:00:00+09:00`. 월주 `庚寅` → `辛卯`, 실효 연주 `丙午` 유지. 결과 `VERIFIED_SIGNATURE_DIFFERENCE`.
- 09월 ADJACENT_MONTH: `2026-08-07T20:42:43+09:00`–`2026-09-01T00:00:00+09:00` → `2026-09-01T00:00:00+09:00`–`2026-09-07T23:41:16+09:00`. 월주 `丙申` → `丙申`, 실효 연주 `丙午` 유지. 결과 `CARRYOVER_CONTINUITY`.
- 09월 WITHIN_MONTH: `2026-09-01T00:00:00+09:00`–`2026-09-07T23:41:16+09:00` → `2026-09-07T23:41:16+09:00`–`2026-10-01T00:00:00+09:00`. 월주 `丙申` → `丁酉`, 실효 연주 `丙午` 유지. 결과 `VERIFIED_SIGNATURE_DIFFERENCE`.

이월 경계는 Root 주소가 달라도 전체 Signature가 동일하여 CONTINUITY로 남는다. 절입 이후 실제로 달라진 필드만 기록한다. 성공·실패·재물·인간관계 사건을 생성하지 않는다. Producer·원본 근거 ID·기간·Ancestry는 `temporal-comparison-witnesses.json`의 Node 사전과 Witness를 참조한다.

## 검증과 보존

- 신규 34 PASS / 0 FAIL. 필수 25개 변조, 실제 비중첩 동시 Binder 실패, 결정론, F 미상 입력 포함.
- 정확한 Base 재현 149 PASS / 2 FAIL.
- 기존 관련 21개 파일 1350 PASS / 2 FAIL. 실패 이름과 정규화한 **전체 오류 메시지** 동일. 전체 저장소 suite는 실행하지 않았다.
- 기존 실패: `preserves all 4509 existing tracked files including Writer, Books and research`, `X preserves every original research/runtime/Book source byte`. 과거 보호 manifest가 compatibilityProductAdapter.ts의 이전 hash를 기대하나 정확한 Base부터 불일치한다. 테스트·manifest·해당 소스를 수정하지 않았다.
- TypeScript strict 0 diagnostics, ESLint PASS. 최종 build/NFT는 아래 최종 검증 절 참조.
- 실제 7개 오프라인 입력: Unit 422 / Withheld attempt 164 / Native Receipt 703 / Typed Root 246 / Root reference 855 / 과거 후보 26개 전체 hash / Source FAIL 30 불변.
- 17 Book, 102 digest 일치, 저장본 재열람 roundtrip 동일. Publication 39사례 = 32 SAFE_OFFLINE / 7 WITHHELD 및 기존 판정·근거·재열람 동일.
- Runtime AST 46 root / 700 module, digest `9515564668afceeca302fc7073ae0f54352672e59eef9e76c73357c9981da736` 동일. 신규 기능 고객 Runtime 연결 없음.
- 이름·생일 export scan PASS. Synthetic 의미 파일 sync read guard 0, 실제 연구·고객 근거로 사용하지 않음.

## 작업 환경과 남은 조건

지속 worktree `/Users/Deokmin/Developer/gyeol-worktrees/v4-annual-march-september-comparison-01`, Git common `/Users/Deokmin/Dev/projects/gyeol-report/.git`. 기존 74 worktree(지속 13 / 임시 61)의 HEAD·Branch·status·기록 파일·.git 표시 파일 불변. 원본 dirty 11파일, 포렌식 915파일 hash·mtime 동일. 새 branch/worktree·index/object/ref/reflog/upstream 등록은 의도된 metadata 변경이며 변경 0이라고 주장하지 않는다.

Legacy 임시 경로를 계속 검사했고 이번 관측 변화는 없다. 과거 ignored·미기록 자료의 무손실은 UNVERIFIED다. 복구·정리·삭제하지 않았다. 기존 코드·연구·환경변수·DB·결제·Auth·Worker·고객 Runtime·master·Production 변경은 없다.

미완료 월 01/02/04/06/08/11, 미상 입력 관계 조건, Source FAIL 30, 월별 십성 ROLE_AMBIGUOUS 10, 의미·상품·고객 승인, 기존 hash 테스트 두 실패는 남는다. 후속 개발은 새 사용자 지시가 필요하다. 고객 Claim/Planner/Writer/Book 발행 및 다음 개발은 시작하지 않았다.

외부 전체 로그·JSON: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-march-september-comparison-01`. 보고서는 기존 대형 Receipt 대신 ID·전체 hash·원본 Gate·분리 Receipt·Source Proof·Graph node 근거를 기록한다. 최종 Git/정확한 Preview SHA는 외부 `git-preview-receipt.json`, `FINAL-RESULT.json`에 기록한다. Preview READY는 기술 빌드 확인이며 고객 발행·판매 승인이 아니다.

## 최종 빌드·패키징 확인

보고서 파일을 포함한 Webpack Production build PASS, 경고 0. NFT 90개(앱 route 88개 및 공통 2개)의 기존 소스 의존 집합이 Base와 동일하다. 생성된 `.next` 내부 파일은 내용이 빌드별로 달라 비교에서 제외하고, 실제 소스·외부 의존 경로를 비교했다. 신규 비교 모듈·검증 CLI·이번 보고서는 고객 Runtime 및 NFT에 포함되지 않았다. 기존 6,438개 파일의 SHA256 모두 동일, 누락 0. TypeScript strict 0 diagnostics, 전체 ESLint 및 마지막 추가 테스트 ESLint PASS.
