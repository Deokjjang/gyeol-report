# V4-ANNUAL-MARCH-SEPTEMBER-INTERPRETATION-REVIEW-PILOT-01

실제 3월·9월 비교 계약을 현재 SHA에서 실행해, 계산 설명과 조건부 검토 질문을 분리한 오프라인 한국어 검토 원고를 구현했다. Base `7b624535c1d052ec21d28e89f717397aa73cc456`, branch `v4/annual-march-september-interpretation-review-pilot-01`.

[march-september-review-draft.html](./march-september-review-draft.html)을 연다. 월·Fixture 이동 링크, 실제 계산, 기간 비교, 모델 작성 질문, 원본 연구, 조건·반례·금지·필요 Context와 승인 상태를 볼 수 있다. 정적 문서이며 승인 UI·고객 Reader가 아니다. 이전 12개월 사실 미리보기는 바이트 단위로 보존한다.

## 실제 실행과 경계

Annual A/F/C2028/Ranged Transition 4개 입력을 기존 실제 계산기와 Graph로 다시 실행한다. 기존 `prepareFactualPreview` 안에서 November→June→January→August→February→April→March/September Comparison 계약이 실행된다. 이 실제 반환 Candidate와 `validateComparisonCandidate`를 재검증한다. 재현 fixture와 고정 시각은 기존 실제 오프라인 recipe 그대로다. 고객의 새로운 입력이나 사건을 생성하지 않는다.

현재 March 2 / September 3, 총 5개 검토 가능 사례와 3개 기술 보류 사례다. F의 두 월과 Ranged 3월에는 초안을 만들지 않는다. 기술적 비교 자격은 Meaning·상품·고객 승인이 아니다. C2028 Registry 주소 불일치와 기존 등록 범위를 변경하지 않는다.

원본 `afpr:month-slot:03` / `09`의 Record Hash, monthMatrix 파일 Hash `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`, Source Version `6d471db103d53dd9165e4832744501a686e59edc`를 검증한다. 원래 requires/positive/risk/twist/action/scene/counterexample/disallowed/sourceRefs를 읽고 보존한다. `readOriginal`·`validateReading` 및 기존 Workbench `meaningDecomposition`을 사용한다. 기존 extractor가 제외하는 action/scene는 이미 검증된 원본 필드를 이번 Reading에 명시적으로 제공한다. 기존 extractor나 연구를 변경하지 않는다.

`conditionalTemporalMeaningReview`의 원문·제안·미확인 직접 의미·필요 Context 구분을 따른다. 이번에는 특정 십성 역할을 선택하지 않으므로 그 십성별 apply API를 임의 호출하지 않는다. 관련 원래 테스트로 보존을 확인한다. 기존 `realizePredicate`의 유한한 있다면/확인해 볼까요와 `joinReviewedClauses`만 재사용하며, 새로운 자유 추론이나 문법 엔진을 추가하지 않는다.

## 원문·사실·제안·승인 분리

`CALCULATED_FACT_EXPLANATION`: 기존 사실 미리보기의 원문 및 기존 비교 Witness가 직접 확인한 Signature 연속/변경과 공유 Root 수다. 실제 Node·Producer·정확한 전후 기간·완전 ancestry로 연결한다. 비교는 서로 다른 기간이며 동시 발생이 아니다. 월간/월지 본기 역할을 모두 구분하고, 조건부 대운과 미상 시주를 임의 확정하지 않는다.

`CONDITIONAL_INTERPRETATION_PROPOSAL`: 이번 작업에서 작성한 제한된 질문·해석 한계·필요 Context다. 계산의 생활 효과가 아니며 `MODEL_PROPOSED_REVIEW`, `DIRECT_MEANING_SOURCE_UNVERIFIED`, `MEANING_REVIEW_REQUIRED`, `PRODUCT_REVIEW_REQUIRED`, `CUSTOMER_APPROVAL_PENDING`을 유지한다. 실제 학습 목표·작업 순서·점검 기준과 적용 기간/관찰 시각은 연결된 근거가 없어 개인 적용을 보류한다. 원문 sourceRefs 확인은 참조 파일 현행 내용이나 고전 직접 명제·현대 조언 효과를 새로 검증했다는 뜻이 아니다. 원본 가상 scene은 사용자 경험이 아니다.

`WITHHELD_UNSUPPORTED_INFERENCE`: 수입·관계 사건·실패·가상 경험 단정 시도는 검토 Ledger에 시도와 차단 이유만 기록한다. 본문 sentenceText=null이며 HTML 독해 원고에 넣지 않는다. 새로운 Meaning Identity·Claim Identity·Reviewer·Official Approval Envelope·Planner Assignment·Reader 주소·Book Allocation을 발급하지 않는다.

원본 연구 텍스트는 packets의 originalResearch, 실제 계산은 comparisonWitnesses와 Ledger Node/기간, 작성 제안은 classification과 sentenceFunction, 직접 출처와 한계는 directSourceSupport/sourceSupportLimitations, 미연결 정보는 requiredContext로 별도 보존한다. 인간 검토 완료/Meaning/Product/Customer 승인=false다.

## 산출물과 재검증

`actual-meaning-review-packets.json`은 네 실제 입력·8개 월 사례, 원래 비교 Witness/원본 Candidate/Native Receipt ID·Hash와 Source 및 Workbench 분해를 담는다. 기술 보류 사례도 원래 Node metadata와 ancestry 상태·missing ancestor ID·Graph 차단 사유를 보존하며, 보류 사실을 승인된 근거로 승격하지 않는다. 원래 Graph 전체를 복제하지 않는다.

`sentence-interpretation-review-ledger.json`은 문장 Text/Hash/분류·Source·Node·Producer·Root·완전 ancestry·기간·조건·반례·금지·보류·승인 상태를 담는다. 반복 ancestry와 Source는 원래 신원으로 참조하며 재구성하면 실제 API 반환값과 정확히 같다. Root 참조를 독립 의미 수로 세지 않으며 신규 Root/Meaning/Claim=0이다.

새 검토 사실 레코드 136, 조건부 제안·한계·Context 문장 35(그중 실제 조건부 질문 10), 차단 시도 20, 검토 문단 40개다. 사실 레코드에는 여러 계산 절이 연결될 수 있어 문법적 단문 수와 같다고 주장하지 않는다. 기존 사실 1052개와 별도 Ledger이며 합산하지 않는다. HTML 표시 Text/ID/Hash/분류를 전부 다시 비교한다.

`node tools/annual-interpretation-review-pilot/verify.mjs <존재하지 않는 외부 출력 경로>`로 실제 7개 기준선(3 Major+4 Annual), 4개 검토 입력, 원래 사실 미리보기, 고객/Planner 차단과 원래 STRICT 경로를 재실행한다. 고객 Claim/승인/Reader/Book 배정0, 전체 2060 Reader 질문 보존이다. 신규 사실/검토 생성 중 Synthetic 정의 읽기·사용0이며 기존 STRICT의 무결성 확인용 읽기는 별도로 계측하고 선택·승격0을 유지한다. 기존 Writer/Gate는 수정하지 않는다.

422 Units /703 Receipts /246 Typed Roots /396 unmatched /42 Annual·2 Major /10/12개월·June/November 보류 /Source Integrity FAIL30을 보존한다. 원래 Native Receipt의 ID/전체 Hash와 Candidate multiset, 계산/Graph/Handoff Hash를 대조한다. Book17권·102 digest 및 재열람, Publication32 SAFE_OFFLINE/7 WITHHELD를 실행해 비교한다. 검증 결과는 packets verification 및 외부 로그에 기록한다. 전체 Repository Suite PASS를 주장하지 않는다. Workbench의 기존 고정 Base 검사도 정확한 Base에서 재현한다. 이 초기화가 compatibilityProductAdapter.ts에서 중단되면 87개 assertion은 미실행으로 명시하며, 테스트 코드의 Skip 추가로 처리하지 않는다.

신규 핵심2파일·테스트1·CLI1·문서5개만 추가한다. 기존 6510 tracked 파일, 원본 Dirty11, 이전82 Worktree, Git Object 및 포렌식915개를 보존한다. 신규 Branch/Worktree/Index/Object/upstream은 의도된 Metadata 변경이다. 지속 환경 무결성, 과거 임시 경로 위험, Codex 내부 Ref 변화는 별도로 보고하며, 과거 ignored/미기록 자료는 UNVERIFIED다. 임시 절전 방지는 검증 프로세스에만 한정한다.

외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-march-september-interpretation-review-pilot-01`. master/Production/DB/결제/Auth/Worker를 변경하지 않는다. Preview READY는 기술 빌드 확인이며 판매 또는 의미 승인이 아니다. 후속 작업은 시작하지 않는다.

### 실제 생성 예 · A 3월

2026-02-04 05:02:08 KST부터 2026-03-01 00:00:00 KST 전까지의 앞 구간과 비교하면, 월주 庚寅 → 庚寅(동일), 실효 연주 丙午 → 丙午(동일)입니다. 월간 십성은 비견 → 비견, 월지 본기 십성은 편재 → 편재입니다. 대운 상태는 확정 활성 戊寅 → 확정 활성 戊寅입니다. 서로 다른 기간의 비교이며 동시 발생을 뜻하지 않습니다. 2026-03-01 00:00:00 KST부터 2026-03-05 22:59:00 KST 전까지의 앞 구간과 비교하면, 월주 庚寅 → 辛卯(변경), 실효 연주 丙午 → 丙午(동일)입니다. 월간 십성은 비견 → 겁재, 월지 본기 십성은 편재 → 정재입니다. 대운 상태는 확정 활성 戊寅 → 확정 활성 戊寅입니다. 서로 다른 기간의 비교이며 동시 발생을 뜻하지 않습니다. 2026-03-01 00:00:00 KST 경계 앞뒤에서는 월주·실효 연주·대운·십성 역할·관계 Signature가 이어집니다. 양쪽 구간이 함께 참조하는 원래 Root는 9개입니다. 2026-03-05 22:59:00 KST 경계 앞뒤에서 실제로 달라진 항목은 월주·월간 십성 역할·월지 본기 십성 역할·관계 Signature와 참가자입니다. 양쪽 구간이 함께 참조하는 원래 Root는 9개입니다.

실제로 유지하고 있는 학습 목표와 비교할 과제가 있다면, 같은 목표를 두 과제에 적용할 때 확인할 조건이 같은지 확인해 볼까요? 같은 목표를 실제로 점검하려는 상황이 있다면, 2월 말과 경칩 뒤의 계산상 차이 가운데 검토 질문을 달리해야 할 항목이 있는지 확인해 볼까요?

원본 연구의 반례를 그대로 확인합니다: 계절 이미지가 활력·성공을 증명하지 않는다. 같은 Root의 반복 참조와 달력의 월 이름은 새로운 독립 의미나 개인 사건의 근거가 되지 않습니다.

### 실제 생성 예 · A 9월

2026-08-07 20:42:43 KST부터 2026-09-01 00:00:00 KST 전까지의 앞 구간과 비교하면, 월주 丙申 → 丙申(동일), 실효 연주 丙午 → 丙午(동일)입니다. 월간 십성은 편관 → 편관, 월지 본기 십성은 비견 → 비견입니다. 대운 상태는 확정 활성 戊寅 → 확정 활성 戊寅입니다. 서로 다른 기간의 비교이며 동시 발생을 뜻하지 않습니다. 2026-09-01 00:00:00 KST부터 2026-09-07 23:41:16 KST 전까지의 앞 구간과 비교하면, 월주 丙申 → 丁酉(변경), 실효 연주 丙午 → 丙午(동일)입니다. 월간 십성은 편관 → 정관, 월지 본기 십성은 비견 → 겁재입니다. 대운 상태는 확정 활성 戊寅 → 확정 활성 戊寅입니다. 서로 다른 기간의 비교이며 동시 발생을 뜻하지 않습니다. 2026-09-01 00:00:00 KST 경계 앞뒤에서는 월주·실효 연주·대운·십성 역할·관계 Signature가 이어집니다. 양쪽 구간이 함께 참조하는 원래 Root는 9개입니다. 2026-09-07 23:41:16 KST 경계 앞뒤에서 실제로 달라진 항목은 월주·월간 십성 역할·월지 본기 십성 역할·관계 Signature와 참가자입니다. 양쪽 구간이 함께 참조하는 원래 Root는 9개입니다.

이미 정한 작업 순서와 실제 점검 기준이 있다면, 월초에 이어지는 조건과 백로 뒤 조건을 나누어 같은 작업 순서를 계속 쓸지 확인해 볼까요? 다시 검토하려는 실제 계획이 있다면, 계산 조건이 이어지는 구간과 달라지는 구간을 구별해 유지할 기준과 다시 확인할 기준이 있는지 확인해 볼까요?

원본 연구의 반례를 그대로 확인합니다: 월 이름이나 계절만으로 결실·평가 결과를 예측하지 않는다. 같은 Root의 반복 참조와 달력의 월 이름은 새로운 독립 의미나 개인 사건의 근거가 되지 않습니다.

## 최종 테스트

{
  "newTests": {
    "passed": 50,
    "failed": 0
  },
  "relatedTests": {
    "files": 13,
    "passed": 858,
    "failed": 1,
    "failedSuites": 2,
    "setupBlockedAssertions": 87
  },
  "featureProtectedHashTargetedTests": {
    "passed": 0,
    "failed": 2
  },
  "exactBaseHashTests": {
    "passed": 0,
    "failed": 2,
    "nameFilteredNotExecuted": 149
  },
  "exactBaseClockTest": {
    "passed": 1,
    "failed": 0,
    "nameFilteredNotExecuted": 37
  },
  "baselineFailureComparisons": [
    {
      "name": "preserves all 4509 existing tracked files including Writer, Books and research",
      "classification": "EXACT_BASE_SAME_FULL_NORMALIZED_FAILURE",
      "messages": [
        "AssertionError: src/lib/interpretation-v4/compatibilityProductAdapter.ts: expected 'a02bfc2e1cfab018a8b1fa8ab43e679aec6a1…' to be 'bfc8e0844c7eb5bf0711c463745fda00b1cae…' // Object.is equality\n    at <ROOT>/tests/unit/report-knowledge/annualFortuneSpecialistEngine.test.ts:95:193\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:1903:26\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2326:20\n    at new Promise (<anonymous>)\n    at runWithCancel (file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2323:10)\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2305:20\n    at new Promise (<anonymous>)\n    at runWithTimeout (file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2272:10)\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2955:64"
      ]
    },
    {
      "name": "X preserves every original research/runtime/Book source byte",
      "classification": "EXACT_BASE_SAME_FULL_NORMALIZED_FAILURE",
      "messages": [
        "AssertionError: src/lib/interpretation-v4/compatibilityProductAdapter.ts: expected 'a02bfc2e1cfab018a8b1fa8ab43e679aec6a1…' to be 'bfc8e0844c7eb5bf0711c463745fda00b1cae…' // Object.is equality\n    at <ROOT>/tests/unit/report-knowledge/majorFortuneSpecialistEngine.test.ts:95:182\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:1903:26\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2326:20\n    at new Promise (<anonymous>)\n    at runWithCancel (file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2323:10)\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2305:20\n    at new Promise (<anonymous>)\n    at runWithTimeout (file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2272:10)\n    at file://<ROOT>/node_modules/.pnpm/@vitest+runner@4.1.5/node_modules/@vitest/runner/dist/chunk-artifact.js:2955:64"
      ]
    }
  ],
  "baselineSetupFailureComparisons": [
    {
      "file": "semanticDomainReviewWorkbench.test.ts",
      "classification": "EXACT_BASE_SAME_SETUP_FAILURE_FROZEN_COMPATIBILITY_FILE",
      "unexecutedAssertions": 87,
      "testsSkippedInSource": false,
      "normalizedFullMessage": "Command failed: /Users/Deokmin/Documents/gyeol-validation/v4-technical-stabilization-01/toolchain/node-v24.22.0-darwin-arm64/bin/node tools/semantic-domain-review-workbench/verify.mjs <REVIEW_TEMP_OUTPUT>\nfile://<ROOT>/tools/semantic-domain-review-workbench/bootstrap.mjs:8\n for(const entry of tree.split('\\0').filter(Boolean)){const [metadata,file]=entry.split('\\t'),oid=metadata.split(' ')[2],bytes=fs.readFileSync(path.join(root,file)),gitHash=crypto.createHash('sha1').update('blob '+bytes.length+'\\0').update(bytes).digest('hex');if(gitHash!==oid)throw Error('FROZEN_BASE_CHANGED:'+file);frozen.set(file,sha(bytes));}\n                                                                                                                                                                                                                                                                                            ^\n\nError: FROZEN_BASE_CHANGED:src/lib/interpretation-v4/compatibilityProductAdapter.ts\n    at bootstrap (file://<ROOT>/tools/semantic-domain-review-workbench/bootstrap.mjs:8:285)\n    at file://<ROOT>/tools/semantic-domain-review-workbench/verify.mjs:4:9\n    at ModuleJob.run (node:internal/modules/esm/module_job:561:25)\n    at async node:internal/modules/esm/loader:647:26\n    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)\n\nNode.js v24.22.0\n",
      "sourceProofs": [
        {
          "file": "tests/unit/report-knowledge/semanticDomainReviewWorkbench.test.ts",
          "sha256": "c7b1936203a766101dfb883e17409677d4e8c82a4b92a74e8e98920377c26f62",
          "exactBaseUnchanged": true
        },
        {
          "file": "tools/semantic-domain-review-workbench/bootstrap.mjs",
          "sha256": "78f3a406268aa6ffce2890fa01a37a4b25c4c6e5b966ee0322b05f42b83e3d4a",
          "exactBaseUnchanged": true
        },
        {
          "file": "src/lib/interpretation-v4/compatibilityProductAdapter.ts",
          "sha256": "a02bfc2e1cfab018a8b1fa8ab43e679aec6a18628363f56b5b3197264b272d36",
          "exactBaseUnchanged": true
        }
      ]
    }
  ],
  "newRegressions": [],
  "wholeRepositorySuiteRun": false,
  "existingTestsDeletedSkippedOrTimeoutIncreased": false
}

## 빌드·Runtime 검증

strict TypeScript 진단0, ESLint 경고0, Webpack Production PASS / 경고0개. Runtime AST 46 roots / 700 modules 및 NFT 90개 trace의 소스·의존성 집합이 정확한 Base와 같다. 새 검토 경로와 문서는 고객 Runtime/NFT에 포함되지 않는다.

기존 tracked6510개 변경·누락0, 이전82 Worktree·원본 Dirty11·포렌식915 hash/914mtime 및 Git Object 접근을 보존했다. 신규 Branch/Worktree/Index/Object/upstream은 의도된 Metadata 변경이다. 과거 ignored/미기록 임시 자료는 UNVERIFIED이며 복구·정리하지 않았다.
