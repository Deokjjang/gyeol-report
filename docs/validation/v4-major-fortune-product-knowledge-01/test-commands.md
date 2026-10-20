# 검증 실행 기록

실행 환경은 frozen lockfile의 pnpm 의존성이다. 설치는 독립 worktree에서 기존 로컬 store를 사용한 `pnpm install --frozen-lockfile --ignore-scripts --offline`로 수행했다. 환경변수 파일·키·운영 설정을 복사하거나 변경하지 않았다.

## 기준 SHA와 최종 비교

기준/최종에 동일한 다음 8파일을 `pnpm exec vitest run ... --reporter=json --outputFile=...`로 실행했다.

```text
tests/unit/interpretation-v4/careerProductLocks.test.ts
tests/unit/interpretation-v4/careerRelease.test.ts
tests/unit/interpretation-v4/comprehensiveAllocation.test.ts
tests/unit/interpretation-v4/comprehensiveEditorialPlan.test.ts
tests/unit/interpretation-v4/foundationAdapter.test.ts
tests/unit/report-generation/customerDayunGeneration.test.ts
tests/unit/app/dev/bookRuntime.test.tsx
tests/unit/interpretation-v4/sixProductIntegration.test.ts
```

225 PASS / 기존 27 FAIL, 이름·첫 오류 동일. 아래 8파일도 기준/최종에 실행해 9,298 PASS / 기존 hash lock 6 FAIL을 비교했다.

```text
tests/unit/report-knowledge/compatibilityLoveResearch.test.ts
tests/unit/report-knowledge/compatibilityMarriageResearch.test.ts
tests/unit/report-knowledge/compatibilityParentChildResearch.test.ts
tests/unit/report-knowledge/compatibilityCoworkerResearch.test.ts
tests/unit/report-knowledge/compatibilityManagerReportResearch.test.ts
tests/unit/report-knowledge/compatibilityBusinessPartnerResearch.test.ts
tests/unit/report-knowledge/compatibilityFriendshipResearch.test.ts
tests/unit/account/localDatabaseTracing.test.ts
```

## 대운 회귀와 새 자료

```text
tests/unit/saju/customerDayun.test.ts
tests/unit/interpretation-v3/majorFortuneHorizon.test.tsx
tests/unit/interpretation-v4/majorSafety.test.ts
tests/unit/interpretation-v4/majorEditorialSafety.test.ts
tests/unit/interpretation-v4/majorEvidenceSeparation.test.ts
tests/unit/interpretation-v4/majorInteraction.test.ts
tests/unit/interpretation-v4/majorPersonalization.test.ts
tests/unit/interpretation-v4/majorReaderQuality.test.ts
```

162 PASS / 6 FAIL. 추가로 드러난 `majorEvidenceSeparation.test.ts`의 6건을 정확한 기준 SHA worktree에서도 실행하여 동일한 이름·첫 오류를 확인했다. 기존 lock은 변경하지 않았다.

신규 두 파일 전체 실행은 다음과 같다.

```sh
pnpm exec vitest run \
  tests/unit/report-knowledge/majorFortuneProductResearch.test.ts \
  tests/unit/report-knowledge/majorFortuneResearchPreservation.test.ts
```

실제 생성 관찰을 저장할 때만 `MAJOR_RESEARCH_CAPTURE`를 외부 `/tmp` JSON 경로로 지정했다. 기준 캡처는 `MAJOR_RESEARCH_BASELINE=1`로 만든다. 이 값은 새 테스트의 비교/캡처 모드이며 생성기·운영 gate를 바꾸지 않는다. fetch는 기존 networkGuard에서 차단된다. 전체 테스트 실행에서 삭제·skip된 검사는 없다. 경계 부분 검증에 사용한 `-t` 필터를 전체 테스트 PASS 수에 더하지 않았다.

## 정적 검사·빌드

```sh
pnpm exec tsc --noEmit --incremental false
pnpm run lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 \
  PAID_REPORT_RELIABILITY_ENABLED=0 pnpm run build
git diff --check
```

기준 TypeScript도 원래 기준 SHA worktree에서 `--incremental false`로 읽기 전용 실행했다. 기본 Turbopack build를 사용했고 webpack 전환·tracing exclude·대형 함수 우회 설정을 추가하지 않았다.

원시 로그와 실행 JSON은 `/tmp/gyeol-major-fortune-product-knowledge-01-validation/`에 있다. 저장소에는 재현 입력, baseline 생성 관찰, 실패별 메시지, 요약 결과, file/record digest, trace·worktree 보존 결과를 남겼다. 전체 프로젝트 suite를 모두 통과했다고 주장하지 않는다.
