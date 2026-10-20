# V4-ANNUAL-OCTOBER-FOCUS-CONTRACT-01

Base: `v4/annual-month-matrix-contract-completion-01` / `14d486fc9b1af927705dca67c148e1c172d50023`.
작업 브랜치: `v4/annual-october-focus-contract-01`.
지속 Worktree: `~/Developer/gyeol-worktrees/v4-annual-october-focus-contract-01`.

**10월의 제한된 오프라인 기술 계약 구현 완료. 의미·상품·고객 발행 승인은 아니다.**
기술 계약은 3/12에서 4/12(5·7·10·12월)로 증가했다. 다른 월을 자동 승인하지 않는다.

## 구현과 Source

새 소스 2개:

- `src/lib/report-knowledge/knowledge-integration-foundation/annual-october-focus/contract.ts`
- `src/lib/report-knowledge/knowledge-integration-foundation/annual-october-focus/adapter.ts`

기존 소스·계산·연구 DB·5/7/12월 계약은 수정하지 않았다.
기술 버전 `annual-october-reading-focus-v1`은 내부 기술 식별자이며 Meaning/Claim Identity가 아니다.

원본 `afpr:month-slot:10` / `ANNUAL_MONTH_MATRIX[9]`:

- 파일: `src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts`
- Record SHA256: `6bafa2af71967a35934e08b7705fed9b7f4ddcfb881788f4b85a084488fd3c94`
- File SHA256: `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`
- Source Version: `6d471db103d53dd9165e4832744501a686e59edc`
- 원문 요구: `selectedYear + actual civil month bounds`, `every canonical segment`, `actual reading instant + focus interval + all unselected segments`.
- 원본 Meaning/Claim null, Source Groups, unresolved 조건, Counterexamples, Prohibitions 보존.

## Focus와 세 시각

원본 `annualNarrativeEvidence`를 원래 packet의 normalized input과 `AnnualClock`으로 다시 실행한다.
원래 calendar와 focus가 일치해야 한다. 활성 구간 → 절입 구간 → 첫 구간의 원본 선택 코드를 재사용하며 별도 선택 알고리즘을 만들지 않았다.
Producer 파일 hash `89f8d78841501317f4623a6f130c74d95ac5c9110a2eb27f257f089cec7b6533`도 확인한다.

`READING_INSTANT`는 `/composition/result/evidence/clock/currentDate`,
`GRAPH_EVALUATION_INSTANT`는 `/context/evaluatedAt`, `SELECTED_YEAR`는 원래 선택 연도다.
`policyDate`는 오프라인 구매 연도 정책에만 사용하며 독해 시각으로 대체하지 않는다.
각 시간 판정에는 해당 원래 시각을 사용한다. `[start,endExclusive)` 경계를 유지한다.

현재 원본 Graph는 평가 시각과 packet 생성 시각이 일치해야 하며 원본 publication 계약은 독해 시각과 생성 시각의 일치를 요구한다.
다른 Graph 시각을 강제로 지원하지 않는다. 불일치는 기존 Graph 계약에서 차단되며 이를 회귀 검증했다.
이 제약을 두 시각이 본질적으로 같은 개념이라는 뜻으로 해석하지 않는다.

| 기존 Annual 입력 | 선택 연도 | 원래 독해 시각 | focus index | 판정 |
| --- | ---: | --- | ---: | --- |
| fixture-annual-A | 2026 | 2026-10-12T12:00:00+09:00 | 1 | ACTUAL_ACTIVE_AT_READING |
| fixture-annual-F | 2026 | 2026-10-12T12:00:00+09:00 | 1 | ACTUAL_ACTIVE_AT_READING |
| fixture-annual-C2028 | 2028 | 2026-10-12T12:00:00+09:00 | 1 | REPRESENTATIVE_FOCUS_NOT_ACTIVE |
| fixture-annual-ranged-transition | 2027 | 2026-10-12T12:00:00+09:00 | 1 | REPRESENTATIVE_FOCUS_NOT_ACTIVE |

기존 4사례의 10월 전체 8구간, 미선택 4구간을 모두 보존했다.
실제 활성 focus와 과거·미래의 대표 focus를 분리한다.
Focus는 편집상 선택 정보이며 새 독립 계산 Fact가 아니다.

| 별도 실제 Producer 실행 | 선택 연도 | 명시적 독해 시각 | 선택 이유 | 활성 |
| --- | ---: | --- | --- | --- |
| A_FIRST | 2026 | 2026-10-01T00:00:00+09:00 | ACTIVE_SEGMENT_AT_READING | True |
| B_AFTER_JIE | 2026 | 2026-10-08T06:29:17.001Z | ACTIVE_SEGMENT_AT_READING | True |
| C_EXACT_JIE | 2026 | 2026-10-08T15:29:17+09:00 | ACTIVE_SEGMENT_AT_READING | True |
| D_BEFORE_OCTOBER | 2026 | 2026-09-30T23:59:59+09:00 | REPRESENTATIVE_JIE_SEGMENT | False |
| E_AFTER_OCTOBER | 2026 | 2026-11-01T00:00:00+09:00 | REPRESENTATIVE_JIE_SEGMENT | False |
| F_FUTURE_YEAR | 2028 | 2026-10-12T12:00:00+09:00 | REPRESENTATIVE_JIE_SEGMENT | False |
| G_PAST_YEAR | 2025 | 2026-10-12T12:00:00+09:00 | REPRESENTATIVE_JIE_SEGMENT | False |

일곱 사례는 기존 fixture를 수정하지 않은 별도 오프라인 실행이다.
정확한 절입 시각에는 뒤 구간이 활성이고 앞 구간은 past다.
10월 이전·이후 및 미래/과거 선택 연도에서 대표 focus는 현재 활성이라고 표시되지 않는다.
이 추가 사례는 기준 7입력 cohort의 후보·Unit 집계에 포함하지 않는다.

## Binder와 전체 Segment

전체 10월 구간의 raw hash·pointer·owner·월주·실효 연주·활성 대운 context·Producer·원래 Graph node·roots·ancestry·시간·확실성·focus·timePosition을 검증한다.
정확히 한 focus와 모든 `UNSELECTED_SEGMENT_WITNESS`를 유지한다.
전체 ledger는 Source 선행조건이다. 비중첩 미선택 구간을 하나의 동시기간 Native Receipt에 넣지 않는다.

기존 `ActualBindingIndex`, `annualRoleSelector`, `bindKnowledgeCandidate`가 focus의 월주·경계 두 node만 정확한 focus window에서 선택한다.
기존 12 Gate를 유지한다. 새 Typed Receipt에서 기술 Gate 5개만 실제 근거에 따라 PASS가 되며,
원본 Receipt·Gate·Source Groups 및 나머지 보류 상태는 그대로다.
검증된 원본 Receipt와 root 목록은 내부 snapshot으로 보존한다.
의미·상품·고객 상태는 실제 Gate 결과를 기록하며 고객 사용은 허용하지 않는다.
시간·Source·원본 연결이 검증되지 않으면 후보를 발급하지 않는다.

## 결과

| 지표 | Base | 결과 |
| --- | ---: | ---: |
| Verified Units / Withheld Attempts | 422 / 164 | 422 / 164 |
| Original Native Receipts | 703 | 703 |
| Major 후보 | 2 | 2 |
| Annual 기술 후보 | 20 | 24 |
| 완료 월 계약 | 3/12 | 4/12 |
| 미연결 Units | 396 | 396 |
| Original distinct roots | 246 | 246 |
| 신규 Fact roots / Actual Units / Unit links | 0 | 0 |
| 고객 Claim / 승인 / Reader Bridge | 0 | 0 |

신규 10월 바인딩은 기준 cohort 4개다. 추가 clock 사례 7개는 별도 검증이다.
기존 Major 2·May 8·July/December 12 후보의 ID 및 전체 hash가 동일하다.
703개 원본 Receipt의 전체 nativeDiagnosticHash, 원본 계산·Graph·fact-handoff hash가 모두 Base와 일치했다.
Source Integrity FAIL 30개 및 월간 십성 10개 ROLE_AMBIGUOUS 상태도 보존했다.

## 검증

- 신규 38개 각각 검증 완료 / 미해결 실패 0. 전체 실행 37 PASS와 수정 후 해당 1개 재검증 PASS를 합산한다.
- 신규 보존 테스트에 24초의 실제 Matrix 재생성을 넣어 기본 5초 timeout이 발생했다. 준비 작업을 기존 beforeAll(240000)로 이동했으며 assertions·timeout은 변경하지 않았다. 실패 원본 로그도 보존했다.
- 기존 테스트 삭제·skip·timeout 변경 없음. 기존 20파일 실행에는 pending 0.
- 실제 Producer의 7시각 실행 및 필수 21개 위조 차단 포함.
- 재해시한 위조 focus를 Graph·Bridge로 재구성해도 원본 Producer 재검증에서 차단.
- mutable 외부 handoff 컨테이너가 원본 Receipt snapshot에 영향을 주지 못함을 검증.
- 기존 관련 20개 파일: 1312 PASS / 2 FAIL / 0 pending. 전체 Suite 미실행.
- 두 기존 실패를 정확한 Base에서 먼저 재현했고 전체 이름·메시지가 동일하다.
  - `preserves all 4509 existing tracked files including Writer, Books and research`
  - `X preserves every original research/runtime/Book source byte`
  - 원인: 과거 `compatibilityProductAdapter.ts` 해시 기대값 차이. 테스트·기대값을 수정하지 않았다.
- strict TypeScript 0, ESLint PASS, Webpack Production Build PASS, 경고 0.
- Runtime AST: 46 roots / 700 modules / digest `9515564668afceeca302fc7073ae0f54352672e59eef9e76c73357c9981da736` 동일.
- NFT 90 traces(88 routes + 2 shared)의 소스·의존성 집합 동일. 빌드별 `.next` 생성 파일은 별도 취급.
- 17 Books / 102 digests, 저장·재열람 roundtrip 동일.
- Publication Safety 39사례: 32 SAFE_OFFLINE / 7 WITHHELD. errors·Book hash·재열람 Gate 동일.
- 11개 신규 후보를 Source·Binder로 재생성하여 전체 hash determinism 확인.
- CLI export에서 입력 이름·생년월일 검사 PASS. Synthetic 의미 정의 의존 0.

재현:

```sh
node tools/annual-october-focus/verify.mjs /absolute/new/external/output
node node_modules/vitest/vitest.mjs run tests/unit/report-knowledge/annualOctoberFocus.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js .
node node_modules/next/dist/bin/next build --webpack
git diff --check
```

고정 Node v24.22.0 사용. 의존성 설치·환경변수 복사/변경 없음.
새 후보와 실제 Graph 증빙은 5개 요청 보고서에 기록했다. 큰 원본 Receipt를 복제하지 않고 ID·전체 hash로 참조한다.
Graph node proof는 보고서 내 dictionary에 한 번 저장하고 원래 node ID로 참조한다.
외부 최종 실행: `~/Documents/gyeol-validation/v4-annual-october-focus-contract-01/verified-run/`.
Git·Preview 최종 증빙: 같은 외부 경로의 `git-preview-receipt.json`, `FINAL-RESULT.json`.

## 환경과 후속 범위

기존 지속 경로 12개와 임시 등록 경로 61개, 원본 Dirty 11개,
Git Common Directory, 포렌식 915파일을 시작/종료 snapshot으로 대조한다.
기존 경로의 파일·상태·HEAD·Branch 변경은 0이며 새 영구 Worktree 등록 후 총 74개다.
새 Branch/ref/object/index/reflog/upstream 등록은 의도된 Git metadata 변경이다. Metadata 변경 0이라고 주장하지 않는다.
기존 임시 경로를 복구·정리·삭제하지 않는다. 과거 ignored·미기록 자료의 무손실은 UNVERIFIED다.
ACTIVE_PERSISTENT_WORKSPACE_INTEGRITY와 LEGACY_TEMP_WORKTREE_RISK를 분리한다.

3월 Before/After·9월 Adjacent Comparison 및 나머지 8개 월의 계약은 미완료 상태로 유지한다.
의미·상품·고객 승인, 기존 Source FAIL, 미입력 Context 등은 별도 차단 사유다.
계산·연구·12 Specialist·Binder Gate·Planner·Korean Editorial·Writer·Book·UI·고객 Runtime·DB·결제·Auth·Worker·master·Production 변경 없음.
Preview READY는 정확한 작업 commit의 기술적 빌드 확인이며 고객 사용 승인이 아니다.
후속 개발은 시작하지 않는다.
