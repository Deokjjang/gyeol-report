# 검증 실행 기록

독립 worktree에서 frozen lockfile/offline store를 사용했다. env 파일·키·설정 변경 없음. 기존 검사 baseline은 실제 기준 SHA의 코드에서 실행했으며 한국어4파일은 깨끗한 기준 Annual worktree에서 실행했다.

## regression

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
  --reporter=json --outputFile=/tmp/gyeol-korean-editorial-knowledge-01-validation/after-regression.json
```

228 PASS / 33 FAIL; baseline과 이름·첫 오류 동일.

## inherited

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
  --reporter=json --outputFile=/tmp/gyeol-korean-editorial-knowledge-01-validation/after-inherited.json
```

7245 PASS / 6 FAIL; baseline과 이름·첫 오류 동일.

## annual

```sh
pnpm exec vitest run \
  tests/unit/interpretation-v4/annualEditorialQuality.test.ts \
  tests/unit/interpretation-v4/annualReaderQuality.test.ts \
  tests/unit/interpretation-v4/annualSafety.test.ts \
  tests/unit/report-generation/annualMonthJie.test.tsx \
  tests/unit/report-generation/annualMonthlyRelationFacts.test.tsx \
  tests/unit/report-knowledge/annualFortuneEvidence.test.ts \
  tests/unit/report-knowledge/annualFortuneYearRules.test.ts \
  --reporter=json --outputFile=/tmp/gyeol-korean-editorial-knowledge-01-validation/after-annual.json
```

185 PASS / 6 FAIL; baseline과 이름·첫 오류 동일.

## language

```sh
pnpm exec vitest run \
  tests/unit/interpretation-v4/commonEditorial.test.ts \
  tests/unit/interpretation-v4/compatibilityTitleSafety.test.ts \
  tests/unit/interpretation-v4/koreanNarrativeCore.test.ts \
  tests/unit/report-knowledge/koreanCopyUtils.test.ts \
  --reporter=json --outputFile=/tmp/gyeol-korean-editorial-knowledge-01-validation/after-language.json
```

138 PASS / 1 FAIL; baseline과 이름·첫 오류 동일.

## 신규 연구와 실제 발행 보존

```sh
KOREAN_EDITORIAL_CAPTURE=/tmp/gyeol-korean-editorial-knowledge-01-validation/generation-final.json \
  pnpm exec vitest run tests/unit/report-knowledge/koreanEditorialKnowledge.test.ts \
  tests/unit/report-knowledge/koreanEditorialPreservation.test.ts
```

기준 캡처만 KOREAN_EDITORIAL_BASELINE=1. 새 테스트의 비교 모드이며 운영 gate 변경이 아니다. 캡처는 실제 기존 생성 함수를 실행하며 mocked prose나 외부 AI를 사용하지 않는다. externalCalls=[]/publication validation/Book/snapshot 재열람/전체 관찰 동일을 검사한다. 고정 시각은 기존 fixture의 2026-10-12 12:00 KST. JSON 보조 export 검증 보강 뒤 static 파일만 추가 재실행했고 합계에 더하지 않았다.

## 정적 검사/빌드

```sh
pnpm exec tsc --noEmit --incremental false
pnpm run lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 \
  PAID_REPORT_RELIABILITY_ENABLED=0 pnpm run build
git diff --check
git diff --cached --check
```

기본 Turbopack build. 공개 폰트 접근 외 운영 요청 없음. 기존 실패를 삭제/수정/skip하지 않았다. 전체 프로젝트 suite가 아니다. raw JSON/log/helper는 /tmp/gyeol-korean-editorial-knowledge-01-validation/에 있고, 재현 입력·전체 원문/Book·source/hash·실패 목록·결과는 이 문서 폴더에 남겼다.
