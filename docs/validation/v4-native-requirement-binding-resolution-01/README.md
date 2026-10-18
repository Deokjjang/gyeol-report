# V4-NATIVE-REQUIREMENT-BINDING-RESOLUTION-01

Base: `v4/actual-specialist-claim-contract-01` / `fa0bd03fca59d6a5e3275f1c33acfe04db27acc2`.
작업 브랜치: `v4/native-requirement-binding-resolution-01`.
지속 Worktree: `~/Developer/gyeol-worktrees/v4-native-requirement-binding-resolution-01`.

판정: **원본 근거로 확인한 기술 계약 1개만 해결. 고객 사용 승인 아님.**
신규 연결은 별도 오프라인 adapter의 내부 후보이며 고객 런타임, Planner, Writer, Book에는 연결하지 않았다.

## Annual 연결 0의 실제 원인

1. 기존 Annual Specialist의 109개 원본 기본 Candidate에는 실제 계산 역할을 선택하는 활성 selector가 없었다. 4회 실행의 436개 기본 Receipt는 실제 Unit node를 선택하지 않았다. 자연어 `requires`는 unresolved condition으로 보존되어 있었다.
2. 기존 Foundation의 별도 `periodAttempts`는 civil month의 월주·실효 연주·경계 node를 선택한다. 기존 실제 Specialist adapter는 기본 `native.receipts`만 소비하며, 이 별도 채널을 십성 선택으로 간주하지 않는다. 진단용 monthly role alternatives도 선택 근거가 아니다.
3. 월간 십성 연구 10개는 `requiredRole`이 없으므로 MONTH_STEM / MONTH_BRANCH_MAIN 중 하나를 정할 수 없다. 기존 AMBIGUOUS 처리를 유지했다.
4. 월간 십성 node는 기존 Graph의 파생 관측으로 직접 `fact.rootId`가 null이다. 유효한 원래 근거는 complete ancestry의 root 집합에 있다. 기존 v1 후보의 직접 primary root 조건을 변경하지 않고, 새 기술 버전에서 원래 ancestry를 검증한다. null 대신 root를 만들지 않는다.
5. 나머지 세운/대운/FLOW/원국 Unit에는 기간 범위, 전용 주소, 참조 기준 또는 원국·생활 맥락의 별도 조건이 있다. 420개 전체를 오류로 취급하지 않았다.

## 구현한 정확한 원본 계약

원본 `afpr:month-slot:05`:
`src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts`의
`ANNUAL_MONTH_MATRIX[4]`.

원래 세 요구조건:

- `selectedYear + actual civil month bounds`
- `every canonical segment`
- `month stemTenGod/branchTenGod + main-hidden-stem convention`

Record SHA256: `025e86bd5b175fc3f440867ebceee4deb5d6591ed6902ddce85c4d8a9b017012`.
File SHA256: `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`.
Source Version: `6d471db103d53dd9165e4832744501a686e59edc`.

`native-month-pair-requirement-v1`은 이 정확한 ID·Locator·Hash·Version·원본 요구문을 검증한다.
5월의 모든 canonical segment에 두 역할을 함께 요구한다. 기존 `annualRoleSelector`,
`ActualBindingIndex`, `bindKnowledgeCandidate`와 실제 Unit 재검증을 재사용한다.
명시적인 두 역할 요구를 다른 월간 십성 연구의 역할 승인으로 확장하지 않는다.

새 내부 후보는 `actual-specialist-native-requirement-candidate-v2`이며,
역사적 원본 Receipt와 새 Binder Receipt를 별도 필드에 둔다.
원본 sourceRequirements·sourceGroups·unresolvedConditions·counterexamples·prohibitions·
Meaning/Claim Identity는 보존한다. 12 Gate를 전부 재평가하며 기술적 계산 관련 Gate 이외의
기존 상태와 사유는 동일해야 한다. Context·Meaning·Product·Approval은 보류 상태다.

## 측정 결과와 집계 규칙

| 지표 | 이전 | 이후 |
| --- | ---: | ---: |
| Verified Units | 422 | 422 |
| 원본 Native Receipts | 703 | 703 |
| Major 내부 후보 | 2 | 2 |
| Annual 내부 후보 | 0 | 8 (새 버전) |
| 연결 Unit | 2 | 18 |
| 미연결 Unit | 420 | 404 |
| Original distinct roots | 246 | 246 |
| 새 root / 고객 Claim / 승인 / 리더 연결 | 0 | 0 |

420개 primary gap: 해결된 기술 누락 16, 남은 월간 역할 모호성 182,
연간 연구와 실제 월 구간 범위/selector 차이 99, 대운 십성 전용 Graph field 부재 49,
FLOW 참조 계약 부재 49, 원국 보조 근거 18, 일간 참조 전용 7. 합계 420.

실제 A의 2026-05-01 00:00부터 2026-05-05 20:48:44 KST 직전 구간:
월간은 庚→壬 식신, 월지 본기는 庚→戊 편인이다.
같은 원래 십성 node의 서로 다른 두 역할을 선택하며 경계 node와 함께 Binder가 검증한다.
원본 Receipt `kb:receipt:57f3787fcbaa14c7f13ea6497ce3db477c71897720c2ca8210ef4c4a880c0026`의 빈 선택은 그대로이며,
새 Receipt는 `kb:receipt:881b262ae3a46f9b690c17839cacd217f8cdbc5671709165a34aa682875769f2`이다.
각 역할의 Source ID/hash와 전체 8개 구간 비교는 `annual-typed-requirement-validation.json`에 있다.

상세 수치는 동봉된 JSON의 실제 실행 결과를 따른다.
422 verified Units / 164 withheld attempts / 원본 Native Receipt 703개를 비교했다.
기존 Major A 편인·C 편재의 원래 후보 ID, Receipt, Source, 기간, 선택 근거와 root를 보존했다.

`native-binding-gap-matrix.json`은 420개 Unit 각각에 원래 연구 증명과 실제 Receipt ID/hash를 연결한다.
primary gap은 상호 배타적 집계이며, 연구별 의미·Context·Source 보류는 중복 가능한 별도 지표다.
월간 십성 연구의 역할 모호성은 다른 원본 질문을 통해 일부 Unit이 연결되어도 해소되지 않는다.
다른 질문의 모든 자연어 전제까지 충족되었다고 주장하지 않는다.

새 root, 고객 Claim, 고객 승인, 고객 리더 연결은 모두 0.
기존 Meaning/Claim Identity가 null인 곳은 null 유지.
대운 조건부 의미 30개(24 C/D, 6 E/D weak)의 공식 의미 검토 대기도 유지.
기존 Source Integrity FAIL 30개는 동일 채널별로 보존했다.

## 검증

- 새 테스트: 26 PASS / 0 FAIL. 필수 부정 사례 18종, Source 재검증, 기간·역할·root·원본 조건·고객 사용 금지 검증.
- 기존 관련 18개 테스트 파일: 1,254 PASS / 2 FAIL. 전체 suite를 실행하지 않았다.
- 두 실패는 Base에서 직접 재현한 다음 테스트와 **전체 메시지까지 동일**하다.
  - `preserves all 4509 existing tracked files including Writer, Books and research`
  - `X preserves every original research/runtime/Book source byte`
  - 두 실패 모두 기존 `compatibilityProductAdapter.ts`의 과거 hash 기대값 차이. 테스트·기대값·timeout은 변경하지 않았다.
- strict TypeScript: 진단 0. ESLint PASS. `next build --webpack` PASS. 빌드 경고 0.
- 고객 runtime AST: 46 roots / 700 modules, digest `9515564668afceeca302fc7073ae0f54352672e59eef9e76c73357c9981da736`, 동일.
- NFT: 90 traces(88 route, 2 shared)의 소스·의존성 집합 동일. 빌드별 `.next` 생성 파일은 비교 대상에서 분리했다.
- 기존 17 Books / 102 digests 동일. 저장·재열람 roundtrip 동일.
- Publication Safety 39사례: 32 SAFE_OFFLINE / 7 WITHHELD, 기존 error·Book hash·재열람 gate 동일.
- 실제 7입력의 Graph·계산·fact handoff·원본 진단·703개 Receipt를 이전 실행과 대조한다. 새 후보도 원본 Source와 계산을 다시 검증하여 재생성 일치 확인.
- 외부 CLI는 실제 입력 이름·생년월일이 export에 들어가면 실패한다. Synthetic 의미 정의 파일을 읽지 않도록 차단한다.

재현:

```sh
node tools/native-requirement-binding/verify.mjs /absolute/new/external/output
node node_modules/vitest/vitest.mjs run tests/unit/report-knowledge/nativeRequirementBinding.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js .
node node_modules/next/dist/bin/next build --webpack
git diff --check
```

실제 사용 Node: 기존 고정 toolchain `v24.22.0`.
외부 로그·Git 보존·원격 SHA·정확한 Preview SHA 확인 기록:
`~/Documents/gyeol-validation/v4-native-requirement-binding-resolution-01/`.

## 작업 환경과 남은 제한

원본 Checkout의 Dirty 11개, 기존 지속 Worktree, Git Common Directory와 포렌식 915파일은
전후 snapshot으로 대조했고 기존 71개 Worktree의 파일·상태·HEAD·Branch 변경은 0이었다.
그중 기존 지속 경로 10개와 legacy 임시 경로 61개를 모두 검사했으며, 새 등록 후 총 72개다.
포렌식 915파일의 hash·mtime도 일치했다. 새 Branch/Worktree 등록, 새 commit/object/ref 및 upstream 설정은
의도된 Git metadata 변경이다. metadata 변경 0이라고 주장하지 않는다.

기존 `/private/tmp` 61개 등록 경로도 별도 비교한다. 기존 유실을 복구·삭제·정리하지 않았다.
과거 ignored·미기록 파일의 무손실은 확인 범위 밖이며 보장하지 않는다.
활성 지속 개발 환경의 안전성과 과거 임시 경로 위험은 별도 지표다.

남은 문제는 `next-implementation-handoff.json`에 Source/역할/기간/주소/Context/Meaning별로 기록한다.
이번 결과는 조건부 해석의 타당성이나 판매·고객 사용 승인으로 승격하지 않는다.
후속 구현, master 통합, Production 배포, DB·결제·Auth·Worker 변경은 수행하지 않는다.
Preview는 정확한 작업 commit의 빌드 확인용이며 그 결과는 최종 외부 Git/Preview receipt에 기록한다.
