# Phase 0–1 검증 결과

2026-09-28 로컬 검증. 기준 production 소스는 `edacb1b`이며 이 작업은 새 V3 source/test/docs만 추가한다.

| 검사 | 결과 |
| --- | --- |
| `pnpm test tests/unit/interpretation-v3 tests/unit/report-generation/deterministicProductQuality.test.tsx` | 3 files, 107 tests PASS |
| V2 대표 6상품 generate → publish → SSR | 전체 draft/evidence/HTML 고정 해시 일치, V3 소비 후 원본 불변 |
| 기존 deterministic quality 회귀 | 18개 상품/프로필 fixture 및 맥락·방향성 검사 PASS |
| `pnpm lint` | PASS, 0 warnings/errors |
| `pnpm build` | PASS, compilation/TypeScript/static generation 완료 |
| 전체 Vitest 최종 재실행 | 4,125 PASS / 3 FAIL / 총 4,128; 아래 기존 실패만 발생 |
| `pnpm exec tsc --noEmit --incremental false` | 기존 테스트 진단 384개 그대로, production 소스 0개, V3 source/test 0개 |
| `git diff --check`, `git diff --cached --check` | PASS |
| Production import 격리 | 기존 src에서 V3를 import하는 경로 0 |
| 외부 호출 | 실제 OpenAI/Toss/Production 접근 0; 테스트는 network guard 및 disabled writer 사용 |

전체 tsc는 기존 진단 때문에 exit 2이며 clean으로 보고하지 않는다. 진단 첫 줄의 baseline SHA-256은 작업 전후 `8b39b660531cb46094153777c7858cb9971975b1e6db56f8e15f0a0c112b0c8d`로 같다. V3 경로의 신규 진단은 없다.

## 기존 전체 테스트 실패 — 범위 밖으로 유지

1. `tests/unit/app/legalPagesSource.test.ts`: `2026년 6월 14일` 시행일을 기대하지만 현재 source는 `2026년 9월 24일`이다.
2. `tests/unit/app/policyPagesSource.test.ts`: 같은 옛 시행일 기대값.
3. `tests/unit/app/dev/compatibilityPreviewPageSource.test.ts`: 이전 궁합 점수 UI의 `draft.scoreSummary.scoreLabel`을 기대한다. 현행 고객 renderer에서는 점수 표시가 제거되어 있다.

세 테스트와 해당 production 소스는 기준 커밋 이후 이번 작업에서 수정하지 않았다. 스테이징 전에 `git diff --quiet edacb1b -- src tests package.json pnpm-lock.yaml tsconfig.json vitest.config.ts`로 기존 tracked source/test/config의 동일성을 확인했다. 새 V3 테스트와 기존 source 검사 사이에는 production import 연결이 없다. 테스트를 녹색으로 만들기 위한 약관/궁합/UI 수정은 하지 않았다.

`.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 상태를 보존하고 스테이징에서 제외한다. 커밋과 push 대상은 `v3/rebuild`뿐이며 master push/Production 배포를 실행하지 않는다.
