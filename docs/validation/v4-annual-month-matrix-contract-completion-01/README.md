# V4-ANNUAL-MONTH-MATRIX-CONTRACT-COMPLETION-01

Base: `v4/native-requirement-binding-resolution-01` / `c565cb76a0bafc411576d8507c7111081934cb10`.
작업 브랜치: `v4/annual-month-matrix-contract-completion-01`.
지속 Worktree: `~/Developer/gyeol-worktrees/v4-annual-month-matrix-contract-completion-01`.

**판정: 7월·12월 두 계약의 제한된 기술 구현 완료. 12개월 전체 엔진 완성 또는 고객 발행 승인 아님.**
기존 5월을 포함한 기술 계약은 3/12이며 나머지 9개는 명시적으로 남겼다.
원래 11개 월의 Source ID·Locator·Hash·Version·요구문을 모두 대조하고 실제 Annual 4사례의 전체 월별 Evidence를 확인했다.

## 원본별 구현

원본 파일: `src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts`,
export `ANNUAL_MONTH_MATRIX`. 기존 파일과 5월 구현은 변경하지 않았다.
공통 File SHA256: `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`.
Source Version: `6d471db103d53dd9165e4832744501a686e59edc`.

7월 `afpr:month-slot:07` / index 6:

- Record SHA256: `33eff463556f20ad6118ff6e78ebcf461e460e51affd1004dda17253f5abefa1`.
- 원문: `actual boundaries + active cycle + continuing annual pillar`.
- 새 기술 버전: `annual-july-active-context-v1`.
- 이전 6월 마지막과 7월 전체 원래 ledger로 실효 연주 유지 여부를 확인한다.
- 모든 7월 구간에 확정된 활성 대운과 실제 검증된 DAYUN_STEM·ANNUAL_STEM Unit이 있어야 한다.
- 각 구간의 실효 연주·active dayun context·경계 node를 기존 Binder로 선택한다.
- active context는 새 십성 Graph field가 아니다. god 의미를 배정하지 않으며 FLOW_GOD의 참조를 바꾸지 않는다.
- 원래 기간이 다른 이전 구간은 Source 선행조건 witness로 구분한다. 해당 구간의 동시 선택 Receipt에 이전 구간을 넣지 않는다.
- A·C2028에서 4개 바인딩 / Unit 연결 8개. F는 실제 DAYUN Unit 검증 부족, ranged는 `transition_uncertain`으로 7월 전체 보류.
- 각 구간 일부만 성공하면 월 계약 완료로 내보내지 않는다.

12월 `afpr:month-slot:12` / index 11:

- Record SHA256: `ddde19351c827b889f5bb8da48cb3a668f3fac2911d0b2ccdcd74585793cd0a7`.
- 원문: `actual last segment + optional next-year canonical segment + boundaries`.
- 새 기술 버전: `annual-december-last-boundary-v1`.
- 모든 실제 12월 구간·마지막 구간·정확한 다음 1월 1일 00:00 KST 직전까지의 bound를 확인한다.
- 원문이 다음 연도 구간을 **optional**로 명시하므로 자료가 없으면 `UNAVAILABLE_NO_EXTRAPOLATION`으로 기록한다.
- 연말 bound는 다음 연도 segment가 아니다. 새 연도 구간·비교·사건을 생성하지 않는다.
- 기존 월주·경계 Graph 사실을 직접 Binder로 선택한다. 기존 Typed Unit에 없는 월주 Unit을 임의 발급하지 않는다.
- 4사례의 전체 12월 구간에 8개 바인딩. 이 8개는 Unit 연결 8개가 아니며 `verifiedActualUnitIds=[]`이다.

새 후보 버전은 `annual-month-matrix-candidate-v1`이다. 원본 Receipt와 새 Typed Receipt를 별도로 보관한다.
Source 선행조건 witness, Native 선택, 추가 일간 참조 root를 구분한다.
후보 ID는 내부 기술 ID이며 Original Meaning/Claim Identity를 대체하지 않는다.

## 실제 결과

| 지표 | Base | 이번 결과 |
| --- | ---: | ---: |
| 기술 계약 | 1 (5월) | 3 (5·7·12월) |
| Verified Actual Units | 422 | 422 |
| Withheld Attempts | 164 | 164 |
| Original Native Receipts | 703 | 703 |
| Major 후보 | 2 | 2 |
| 기존 5월 후보 | 8 | 8 |
| Annual 기술 후보 합계 | 8 | 20 |
| 신규 기술 바인딩 | — | 12 (7월 4, 12월 8) |
| 신규 Unit 연결 | — | 8 |
| 미연결 Units | 404 | 396 |
| Original distinct roots | 246 | 246 |
| Root 참조 횟수 | 855 | 855 |
| 신규 root / 고객 Claim / 승인 / Reader Bridge | 0 | 0 |

7월 A의 실제 첫 구간: `[2026-07-01 00:00, 2026-07-07 10:56:57) KST`.
원래 Receipt `kb:receipt:159a107a4eb7d31db4fcc7c84603d67932179b139b2a1bbe3d59ccf762b3af0a`의 빈 선택은 유지한다.
새 Receipt는 `kb:receipt:25619168c0efde2b12140582eb2c04e42eeeee7801037e43505debdaa5228f29`이다.
일간 庚의 기존 활성 주기 戊寅과 실효 연주 丙午를 실제 계산 Unit으로 검증하며, 6월 마지막과 같은 실효 연주임을 확인한다.
두 Unit의 일간 참조 root는 검증된 보조 근거로 보관하며 Native 선택 root에 덧붙이지 않는다.

12월 A의 첫 구간: `[2026-12-01 00:00, 2026-12-07 11:52:32) KST`.
새 Receipt `kb:receipt:f4ba5f612002470b136d5216d3c6f2c61e4e0f3ebf98c31c2acc2b3e12d4a388`은 기존 월주·경계 node만 선택한다.
마지막 구간과 2027-01-01 경계를 확인하지만 2027년 구간을 만들지 않는다.

Unit/Graph node 참조 횟수와 내부 후보 수를 독립 정보 또는 승인된 Claim 수로 해석하지 않는다.

## 남은 월별 상태

| 월 | 분류 | 남은 요구 |
| --- | --- | --- |
| 1 | C | 실제 이전 12월 canonical segment 없음; 이전 비교 보류 |
| 2 | C | 실효 연주 전후는 존재. nominal 천간합의 구간별 유효성과 전용 Graph 주소 부족 |
| 3 | B | 전후 월주·관계 자료 존재. 비중첩 기간 비교 계약과 signature 검증 연결 필요 |
| 4 | C | 실제 관계 node·참가자 존재. 관계 occurrence/affectedPillars/ancestry를 보존하는 Fact 계약 필요 |
| 6 | D | 이전 동일 십성의 공식 역할·발생 구간·관계 Source Scope 검토 필요 |
| 8 | C | 불확실성 범위·조건부 상대 주기 자료를 확정 Unit으로 승격할 수 없음 |
| 9 | B | 전월 마지막·현재 첫/절입 구간 존재. 동시기간 Gate를 완화하지 않는 비교 계약 필요 |
| 10 | B | 실제 읽기 시각·focus·미선택 구간과 경계 node의 focus/timePosition 존재. 이번 두 계약 batch에서 보류 |
| 11 | D | 실제 Context timestamp 미입력. 독해 시각 대체 및 가상 scene의 고객 경험 승격 금지 |

A/B/C/D는 기술 준비도 분류다. 의미 승인이나 해당 월 구현 완료 판정이 아니다.
10월은 Producer가 없다고 주장하지 않는다. 향후 actual active interval과 미래 연도의 representative focus를 구분해야 한다.
원본 월간 십성 연구 10개는 모두 ROLE_AMBIGUOUS 유지. 다른 월 질문이 같은 Unit을 사용했다고 해당 연구가 승인되지 않는다.
신규 7월 context 연결은 기존 연간 십성 연구의 annual-wide 범위나 기본 DAYUN god field 문제를 해결한 것으로 세지 않는다.

## 검증과 보존

- 기존 Major A/C 후보 2개와 May 후보 8개의 ID 및 전체 hash 일치.
- 실제 7입력의 Graph·계산·fact handoff·전체 nativeDiagnosticHash와 원본 Receipt 703개 재평가 결과를 Base와 비교했다.
- Source FAIL 30개, 원래 12 Gate, Source Groups, Counterexamples, Prohibitions, unresolved 조건 보존.
- 의미·상품·Context·고객 승인 보류와 null Meaning/Claim Identity 유지. 대운 조건부 의미 30개 공식 검토 대기 유지.
- 신규 테스트 32 PASS / 0 FAIL.
- 기존 관련 19개 파일: 1,280 PASS / 기존 2 FAIL. 전체 Suite를 실행하지 않았다.
- 두 실패는 Base에서 재현한 아래 이름과 전체 메시지까지 동일한 과거 `compatibilityProductAdapter.ts` 해시 기대값 차이다.
  - `preserves all 4509 existing tracked files including Writer, Books and research`
  - `X preserves every original research/runtime/Book source byte`
- 기존 테스트·skip·timeout·해시 기대값을 변경하지 않았다.
- strict TypeScript 진단 0, ESLint PASS, Webpack Production Build PASS, 경고 0.
- Runtime AST 46 roots / 700 modules, digest `9515564668afceeca302fc7073ae0f54352672e59eef9e76c73357c9981da736` 동일.
- NFT 90 traces(88 route + 2 shared)의 소스·의존성 집합 동일. 빌드별 `.next` 생성 파일은 별도 취급.
- 17 Books / 102 digests, 저장·재열람 roundtrip 동일.
- Publication Safety 39사례: 32 SAFE_OFFLINE / 7 WITHHELD, 기존 errors·Book hash·재열람 Gate 동일.
- 신규 12개 후보를 실제 Source·계산·Binder로 재생성하여 determinism을 확인했다.
- CLI는 원본 입력 이름·생년월일이 export에 포함되면 실패한다. Synthetic 의미 정의 파일 사용 0.

재현:

```sh
node tools/annual-month-matrix/verify.mjs /absolute/new/external/output
node node_modules/vitest/vitest.mjs run tests/unit/report-knowledge/annualMonthMatrix.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js .
node node_modules/next/dist/bin/next build --webpack
git diff --check
```

기존 고정 Node v24.22.0 사용. 환경변수 복사·변경, 의존성 설치 없음.
외부 로그와 Git/Preview 최종 증빙:
`~/Documents/gyeol-validation/v4-annual-month-matrix-contract-completion-01/`.

## 환경 및 운영 경계

기존 72개 Worktree(지속 경로 11개, 임시 등록 경로 61개), 원본 Dirty 11개,
Git Common Directory, 포렌식 915파일을 전후 snapshot으로 대조했고 기존 경로의 파일·상태·HEAD·Branch 변경은 0이었다.
포렌식 915파일의 hash·mtime도 일치했다.
새 영구 Worktree 등록 후 73개다. Branch/ref/object/index/upstream 등록은 의도된 Git metadata 변경이다.
기존 임시 경로를 복구·정리·삭제하지 않는다. 과거 ignored·미기록 자료의 무손실은 UNVERIFIED다.
ACTIVE_PERSISTENT_WORKSPACE_INTEGRITY와 LEGACY_TEMP_WORKTREE_RISK는 별도로 기록한다.

고객 Runtime·Planner·Korean Editorial·Writer·Book·계산·연구 원본·결제·Auth·Worker·DB·Production·master 변경 없음.
Preview는 정확한 작업 commit의 기술적 빌드 확인이며 고객 발행 승인이 아니다.
후속 작업은 handoff에 기록하고 자동으로 시작하지 않는다.
