# 실행 명령과 범위

독립 worktree, frozen lockfile, 기존 로컬 pnpm store를 사용했다. env 파일·키를 복사/변경하지 않았다. 외부 AI·DB·결제 호출 없음.

## 기존 회귀 9파일

```sh
pnpm exec vitest run \
  tests/unit/interpretation-v4/careerProductLocks.test.ts \
  tests/unit/interpretation-v4/careerRelease.test.ts \
  tests/unit/interpretation-v4/comprehensiveAllocation.test.ts \
  tests/unit/interpretation-v4/comprehensiveEditorialPlan.test.ts \
  tests/unit/interpretation-v4/foundationAdapter.test.ts \
  tests/unit/interpretation-v4/majorEvidenceSeparation.test.ts \
  tests/unit/interpretation-v4/sixProductIntegration.test.ts \
  tests/unit/report-generation/customerDayunGeneration.test.ts \
  tests/unit/app/dev/bookRuntime.test.tsx \
  --reporter=json --outputFile=/tmp/gyeol-annual-fortune-product-knowledge-01-validation/after-regression.json
```

228 PASS / 33 FAIL.

## 연구 인수/trace 8파일

```sh
pnpm exec vitest run \
  tests/unit/account/localDatabaseTracing.test.ts \
  tests/unit/report-knowledge/compatibilityBusinessPartnerResearch.test.ts \
  tests/unit/report-knowledge/compatibilityCoworkerResearch.test.ts \
  tests/unit/report-knowledge/compatibilityLoveResearch.test.ts \
  tests/unit/report-knowledge/compatibilityManagerReportResearch.test.ts \
  tests/unit/report-knowledge/compatibilityMarriageResearch.test.ts \
  tests/unit/report-knowledge/compatibilityParentChildResearch.test.ts \
  tests/unit/report-knowledge/majorFortuneProductResearch.test.ts \
  --reporter=json --outputFile=/tmp/gyeol-annual-fortune-product-knowledge-01-validation/after-inherited.json
```

7,245 PASS / 6 FAIL.

## Annual 관련 7파일

```sh
pnpm exec vitest run \
  tests/unit/interpretation-v4/annualEditorialQuality.test.ts \
  tests/unit/interpretation-v4/annualReaderQuality.test.ts \
  tests/unit/interpretation-v4/annualSafety.test.ts \
  tests/unit/report-generation/annualMonthJie.test.tsx \
  tests/unit/report-generation/annualMonthlyRelationFacts.test.tsx \
  tests/unit/report-knowledge/annualFortuneEvidence.test.ts \
  tests/unit/report-knowledge/annualFortuneYearRules.test.ts \
  --reporter=json --outputFile=/tmp/gyeol-annual-fortune-product-knowledge-01-validation/after-annual.json
```

185 PASS / 6 FAIL.

## 신규 2파일

```sh
pnpm exec vitest run \
  tests/unit/report-knowledge/annualProductKnowledge.test.ts \
  tests/unit/report-knowledge/annualProductResearchPreservation.test.ts \
  --reporter=json --outputFile=/tmp/gyeol-annual-fortune-product-knowledge-01-validation/new-tests-final.json
```

3,591 PASS / 0 FAIL.

기존 24파일은 기준 SHA와 변경 후에 같은 명령으로 실행했다. 알려진39 + 추가baseline6 = 기존45실패의 이름·첫 오류가 같다. `annualSafety`의 추가6은 오래된 Major 원고 해시 lock이다. 실패를 수정/skip하지 않았다. 기준 Annual7파일은 정확한 기준 SHA의 Major worktree에서 실행했으며 절대경로만 다르다. 검사 결과 비교는 tests/ 이후 경로를 정규화했다.

신규 두 파일의 실제 생성 캡처는 `ANNUAL_RESEARCH_CAPTURE=/tmp/gyeol-annual-fortune-product-knowledge-01-validation/generation-final.json`을 사용했다. 기준 캡처만 `ANNUAL_RESEARCH_BASELINE=1`; 이는 새 테스트의 비교/캡처 모드이고 운영 gate나 생성기 설정이 아니다. 새 파일을 임시 외부 경로에서 기준 소스로 실행해 생성 baseline을 확보했다. 기존 network guard가 외부 호출을 차단하며 각 결과 externalCalls=[]를 검증한다. 기준/최종 전체 관찰을 비교했다. 부분 경계 테스트 실행을 전체 PASS 합계에 더하지 않았다.

```sh
pnpm exec tsc --noEmit --incremental false
pnpm run lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 \
  PAID_REPORT_RELIABILITY_ENABLED=0 pnpm run build
git diff --check
git diff --cached --check
```

기준 TypeScript는 정확한 기준 SHA worktree에서 읽기 전용 `--incremental false`로 실행했다. 기본 Turbopack build이며 webpack 전환·새 trace exclude·large-function 우회는 없다. build는 공개 Google 폰트 접근이 필요한 환경에서 실행했다. 빌드·검증 결과를 통과로 기록하기 전에 종료코드를 확인했다.

외부 원시 로그·JSON·helper는 `/tmp/gyeol-annual-fortune-product-knowledge-01-validation/`에 있다. 재현 입력, full baseline, 실패 목록, file/record hash와 최종 요약은 이 보고서 폴더에도 남긴다. 전체 프로젝트 suite를 모두 통과했다고 주장하지 않는다.
