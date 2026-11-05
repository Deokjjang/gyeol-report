# 결리포트 코드 정리 분석 — 분류 보고서 (읽기 전용)

- 기준: `origin/v5/final` = `bdedbe6f` (2026-11-05 11:57 KST), worktree `~/Developer/gyeol-worktrees/v5-cleanup-scan`, 브랜치 `v5/cleanup-scan`
- 조사일: 2026-11-05. **이번에는 아무것도 지우거나 옮기지 않았다.** 추적 파일 변경은 이 보고서 1개뿐이다.
- 하지 않은 것: 운영 DB·Vercel 환경변수 조회(→ 운영 실제 값은 UNVERIFIED), `v5-final` worktree 접근(명령문 A 작업 중), package.json·lockfile 변경.
- 실행한 것: `pnpm install --frozen-lockfile`, `pnpm build` ×2, `pnpm exec tsc --noEmit`, `pnpm test`, `npx knip@5`, `npx jscpd@4`, 자체 도달성 그래프 스크립트, git worktree·브랜치 조회(`--no-optional-locks`).

---

## 0. 결론 먼저

1. **추적 파일 7,916개·2.77GB 중 2.55GB(92%)가 `docs/validation/`(v4 검증 산출물 3,656개)다.** 운영·개발 라우트에서 도달 0(import·경로 문자열·빌드 추적 모두). 시험·도구만 읽는다. worktree 69개에 사본이 하나씩 있어 **디스크 169.4GB**를 차지한다.
2. **운영 코드는 870개·8.7MB.** 운영에서 import로 닿지 않는 src 코드는 888개·57.4MB이고, 거의 전부 `src/lib/report-knowledge/` v4 연구·전문 엔진(시험만 살려 둠)이다. 완전 고아(어디서도 import 안 됨)는 70개(knip 결과와 일치).
3. **V4 결정론 작가는 죽은 코드가 아니다.** `WRITER_V5_PRODUCTS`가 비면 6개 상품 모두 V4로 만든다(코드 기본값). v5 경로도 표를 만들려고 V4 생성기를 부른다(`writer/publish.ts:85-87`). 지금 지울 수 없다.
4. **과거 Book을 열 때 발행 검사를 다시 돌리고, 실패하면 격리(quarantine)한다.** 기본 SQL은 격리 시 `snapshot_json=null`(복구 불가), 패치 SQL은 상태만 바꾼다. 운영에 어느 쪽이 적용됐는지는 UNVERIFIED(R1). → **v1~v4 열람에 쓰이는 코드(415개·4.9MB)는 파일을 남기는 것만이 아니라 "동작을 바꾸지 않는 것"이 조건이다.**
5. OpenAI: 운영의 임시본 레인(`llm/providers.ts`)은 살아 있는 기능이라 유지. **옛 OpenAI 작가 잔재 5개 파일만 삭제 후보.**
6. 함정 3개: ① 운영 Book 리더가 `src/app/dev/book-preview/`에 있다(12개). ② dev 라우트(`runtimeBooks.ts`)가 `tests/unit/interpretation-v4/*Fixtures.ts` 6개를 import해 **빌드가 시험 파일에 의존**한다. ③ src가 `tools/`를 import한다(`tools/llm/budget`, `tools/*-specialist-engine`).
7. worktree: 등록 133개 = 실재 69개(249.5GB) + 디렉터리 없는 prunable 63개 + 기타 1개. 메인 저장소(`~/Dev/projects/gyeol-report`)는 master가 아닌 `v4/annual-editorial-quality-fix-01`에 미커밋 변경을 안고 있다.

---

## 1. 범주별 파일 수·크기 (추적 파일 전수)

분류 규칙은 부록 A. 한 파일은 한 범주에만 넣었다. "중복"과 "과거 Book 열람 필수"는 다른 범주와 겹치는 **겹침 표시**라 아래 별도 행으로 적었다.

| 범주 | 파일 | 크기 |
|---|---:|---:|
| 1 운영 사용 (진입점에서 import로 도달 + 설정) | 913 | 9.2 MB |
| 2 시험 (tests/**) | 803 | 81.4 MB |
| 3 데이터 (런타임에 읽는 자료) | 143 | 13.7 MB |
| 4 기록 (결정·판독·비용 문서, 지침) | 753 | 13.4 MB |
| 5 migration (+ migration 밖 RPC 패치 SQL) | 54 | 0.6 MB |
| 6 개발 라우트 전용 (`/dev/**`, `/api/dev/**`) | 83 | 0.3 MB |
| 7 개발 도구 (tools/**, scripts/**) | 283 | 2.4 MB |
| 8 죽은 코드·자산 (운영 미도달) | 896 | 58.7 MB |
| 9 생성물 (검증 산출물·스크린샷) | 3,988 | 2,586.9 MB |
| **합계** | **7,916** | **2,766.7 MB** |
| (겹침) 과거 Book 열람 필수 — 범주 1·3 안 | 415 | 4.9 MB |
| (겹침) 내용 해시가 같은 사본 — 202묶음의 남는 사본 | 447 | 35.8 MB |

세부:

| 범주 | 세부 | 파일 | 크기 |
|---|---|---:|---:|
| 1 | src 코드 | 870 | 8.7 MB |
| 1 | src 자산(css·아이콘) | 28 | 316 KB |
| 1 | 설정(package.json·lockfile·next/vitest/tsconfig·vercel.json 등) | 13 | 180 KB |
| 1 | public (참조됨: OG 이미지, 카카오 공유 아이콘) | 2 | 45 KB |
| 2 | 시험: 운영 코드·소스 검사 | 566 | 4.3 MB |
| 2 | 시험: 운영 + 운영 미도달 코드를 함께 import | 62 | 1.2 MB |
| 2 | 시험: 운영 미도달 코드만 시험 | 33 | 0.4 MB |
| 2 | 시험 도우미·픽스처 코드 | 65 | 0.2 MB |
| 2 | 시험 픽스처·스냅샷(tests/fixtures 등) | 77 | 75.3 MB |
| 3 | `src/data/knowledge-v5` (legacy 제외) | 107 | 6.1 MB |
| 3 | `src/data/knowledge-v5/legacy` (loadKnowledge가 안 읽음 → §2.3) | 16 | 2.3 MB |
| 3 | `docs/product/mbti/source/*.json` (런타임 읽기, docs 아래 있음) | 16 | 2.4 MB |
| 3 | `src/lib/book/fonts` (OG 폰트 + OFL 라이선스) | 4 | 3.0 MB |
| 4 | docs (v1~v4 문서) | 194 | 3.6 MB |
| 4 | docs/v5 문서·판정표·오라클 결과 | 170 | 2.9 MB |
| 4 | docs/v5/trial (시범 원고, `tests/unit/writer/p6d.test.ts`가 읽음) | 386 | 6.9 MB |
| 4 | 루트 CLAUDE.md·AGENTS.md·README.md | 3 | 8 KB |
| 5 | supabase/migrations | 36 | 393 KB |
| 5 | scripts/*.sql (운영에 손으로 적용한 RPC 패치) | 18 | 224 KB |
| 6 | dev 라우트 전용 코드·자산 | 83 | 348 KB |
| 7 | tools | 230 | 2.0 MB |
| 7 | scripts (.sql 제외) | 53 | 396 KB |
| 8 | src 운영 미도달 — 시험만 import | 601 | 55.2 MB |
| 8 | src 운영 미도달 — 시험+도구만 import | 214 | 1.7 MB |
| 8 | src 운영 미도달 — 도구만 import | 3 | 38 KB |
| 8 | src 완전 고아(import 0) | 70 | 465 KB |
| 8 | src 비코드 미참조(`src/app/dev/book-preview/fixture.json`) | 1 | 24 KB |
| 8 | public 미참조 | 7 | 1.3 MB |
| 9 | `docs/validation/**` | 3,656 | 2,549.5 MB |
| 9 | docs 스크린샷(png/jpg, 대부분 docs/v5/ui-*) | 332 | 37.5 MB |

추적 밖(.gitignore) 생성물·캐시: `.next/`(메인 저장소 24.9GB, worktree 합계 35.1GB), `node_modules/`(worktree 합계 33.1GB), `.cache/`(작가 원문·예산 원장 — **v5-final에만 있을 것으로 추정, 미조사**). `.cache/`는 이미 무시 대상이라 "git 밖으로 옮길 대상"은 추적 파일 중 생성물(§2.9)이다.

---

## 2. 범주별 내용

### 2.1 운영 사용
- 진입점: Next 앱 라우트 100개(`next build` 출력) 중 비-dev 59개(페이지 28·라우트 31), Vercel cron 5개(`vercel.json`: report-jobs·report-ticket-jobs·meta-events·report-writer-recovery·ops-jobs) — 모두 앱 라우트 안.
- import 기준 도달: src 코드 870개·8.7MB. 큰 덩어리: `lib/interpretation-v4` 276개(3.0MB), `lib/report-knowledge` 루트 76개(1.2MB), `lib/interpretation-v3` 51개(1.1MB), `lib/report-generation` 44개(0.7MB), `lib/brief` 32개, `lib/writer` 25개.
- 생성 경로(코드 기본값, 서브에이전트 조사 + 직접 grep 확인):

| 경로 | 조건 | 생성기 | 근거 |
|---|---|---|---|
| 결제(cron report-jobs) | 상품이 `WRITER_V5_PRODUCTS`에 있음 | v5 (`runPaidV5Job`→`buildV5Snapshot`) | `book/paidRuntime.ts:41-47` |
| 결제 | 주문에 `bookGeneration.version="v4"`(새 주문 전부) | V4 `generateV4ShadowReport` + `validateV4Publication` | `payment-checkout/prepare/route.ts:384-385`, `paidRuntime.ts:33-38` |
| 결제 | `bookGeneration` 없는 옛 주문(관리자 재시도 포함) | `generateProductReport`(v3 또는 그 이전 v2 결정론) | `paidRuntime.ts:37`, `generateProductReport.ts` |
| 이용권(cron report-ticket-jobs) | 목록에 있음 / 없음 | v5 / V4 | `tickets/publicationWorker.ts:21-41` |
| v5 내부 | 표·인물 정보 | **V4 생성기를 돌려 표만 씀** (`v4People`) | `writer/publish.ts:17,85-87,405` |

- `WRITER_V5_PRODUCTS` 기본은 빈 값 = 전 상품 V4(`writer/flags.ts:7-8`). 배포 체크리스트는 "덕짱님 결정(예: 판매 중 4종)"으로 둠(`docs/v5/deploy-checklist.md:71`) → 목록 밖 상품은 계속 V4.
- `writer/flags.ts:3` 주석 "결제(paid) 경로는 바뀌지 않는다"는 낡았다(`paidRuntime.ts:41`이 결제 경로에도 v5를 연결). 정리 때 고칠 문장.

### 2.2 과거 Book 열람 필수 (v4 이전 저장 Book)
저장 형식은 모두 `paid_report_snapshots.snapshot_json`(이용권 Book 포함). 구분은 `productVersion`(= `draft.productVersion`)과 `productType`.

| 형식 | 구분 값 | 읽는 경로 | 실제 형식 표본 | 확인 |
|---|---|---|---|---|
| v4 (6상품) | `draft.version=v4-runtime-shadow-1`, `evidencePacket.version=v4-runtime-evidence-1`, 판 구분 `integration.publishedEdition`·`compatibilityIndex.version`·`bookEditorialRevision` | `storedReport.tsx` → `projectV4Snapshot` → `projectBook` → BookReader | `tests/fixtures/production-version-combos/*-v4.json.gz` 6개, 옛 판 `completed-report/*-editorial-base.json` | Y (키 일치) |
| career v1 | `draft.version v1` | 옛 발행 검사 → CareerReportView | `career_money_study-v1.json.gz` | Y |
| compatibility 1.0 | `compatibility_v1_draft` | CompatibilityReportView | `saju_mbti_compatibility-1.0.json.gz` | Y |
| saju_mbti_full v2 | `comprehensive_v2_draft` | ComprehensiveReportV2View(렌더 때 재검증) | `saju_mbti_full-v2.json.gz` | Y |
| v3 | `draft.version` + 증거 확장(`annualV3`·`loveV3`…) | `validate*V3` → `*V3View` | `v5-lmt-snapshots/v3-{annual,love,major}*.json.gz` | 연간·연애·대운만. 2026-10-28 운영 목록엔 v3 없음 |
| v1 연애·대운·연간 | v1 | 각 View | 없음 | UNVERIFIED (운영 목록에 없음) |

- 표본 근거: `tests/unit/payment/productionVersionCombos.test.ts:10-17` — "운영 paid_report_snapshots에서 본 9개 (productType, productVersion) 조합(2026-10-28)". **표본은 실고객 행이 아니라 그 시기 코드로 만든 가상 인물이다.** 10-28 이후~v5 출시 사이 Book은 목록에 없다.
- **열람 때 다시 계산한다(원 입력에서 재생성은 아님):**
  - v1/v2: `productPublishGate.validateProductPublication`이 저장된 출생 정보로 원국 표를 다시 계산해 비교(`natalTableEvidence.ts:135-141`, `saju/analyze`·`relations`·`shinsal`·`tenGods`)하고 옛 원고 검사기를 돈다.
  - v3: 검사기가 interpretation-v3 빌더로 원고 전체를 다시 만들어 **JSON 완전 일치**를 요구(`comprehensiveV3Generation.ts:63-90` 등). `AnnualFortuneReportV3View.tsx:60`은 렌더 때 다시 생성.
  - v4: `validateV4Publication`(`runtimeProjection.ts:88-175`) 해시 검사 + 궁합 지수 재계산, `projectBook`이 부록·주석을 저장된 계산으로 재구성(`bookProjection.ts:40-79,221-232`).
  - MBTI 표: `docs/product/mbti/source/*.json`을 런타임에 읽음(`mbtiSourceRegistry.ts:89-96`, `report-knowledge/mbti/sourceRuntimeAdapter.ts:288`).
- **실패 시**: `readPublishedReport`가 `quarantine` 호출(`paidReportReliability.ts:114-131`). 기본 SQL은 `snapshot_json=null`(`supabase/migrations/20260920163924_production_reliability_reconcile.sql:432-433`), 패치 `scripts/paid_report_quarantine_recovery_patch.sql:149-164`는 상태만 바꿈. 운영 적용 상태는 체크리스트 R1(`docs/v5/release-phase0-manseryeok.md:73`) — 이번에 조회 안 함.
- 열람 폐포(정적 import, 보고서·공유·저장 Book 경로): **415개·4.86MB**. interpretation-v3 51/56, interpretation-v4 43/279, report-generation 43/53, report-knowledge 68/939, saju 31/40, report-tables 12/12, writer 6, brief 3.
- 이름은 옛것 같지만 열람에 필요한 것(지우면 안 됨):
  - `report-generation/*V3Generation.ts` — 생성기처럼 보이나 열람 검사기를 담음
  - `interpretation-v4/compatibilityIndexLegacy.ts` — 궁합 지수 `13b-1` 판
  - `saju/shinsalConstants.ts:765-772`(`KST_V2_SHINSAL_RULES`), `saju/calendarVersion.ts:5,8`(LEGACY_* 버전 목록)
  - 옛 v4 판 분기(`comprehensiveRuleHeadings`·`careerRuleHeadings`·`bookEditorialRevision` 조건·`majorPeriodCopy`)
  - `book/publicGate.ts:5`(`bookExperiencePublicEnabled()` = true 고정 — false가 되면 v4/v5 Book이 옛 검사기로 가서 격리됨)
  - `src/app/dev/book-preview/` 운영 사용 12개(§3 함정 1)
- 열람을 지키는 시험: `tests/unit/payment/productionVersionCombos.test.ts`, `tests/unit/payment/readVersionTolerance.test.ts`, `tests/unit/saju/legacyBookProtection.test.ts`, `tests/unit/app/bookBodySameness.test.tsx`, 그리고 `tests/unit/report-knowledge/*GenerationPreservation.test.ts`·`*ResearchPreservation.test.ts` 9개(생성 결과 digest를 `docs/validation`의 기준과 비교 → §3 C1 주의).

### 2.3 데이터
- `src/data/knowledge-v5/**` 123개 8.4MB: 작가·브리프가 `brief/knowledge.ts`로 읽음. 버전 해시는 `legacy/`를 뺀 JSON 전체(`writer/publish.ts:57`).
- **`src/data/knowledge-v5/legacy/` 16개·2.3MB**: `loadKnowledge`가 읽는 하위 폴더 목록(myeongri·mbti·fusion·timeline·love·career·compat·deep·mbti-seeds·루트 JSON)에 없고, 저장소 어디에도 경로 참조 없음. 2026-10-28 `1a061fff`에서 v1 데이터를 옮겨 둔 것. 그런데도 워커 함수 4개 빌드 추적에 들어간다(§4).
- `docs/product/mbti/source/*.json` 16개 2.4MB: 런타임 자료인데 docs 아래 있음 → docs를 정리할 때 함께 지우면 과거 Book MBTI 표가 깨진다.
- 폰트: `src/lib/book/fonts/NotoSansKR-Book.woff`(OG 이미지), `OFL.txt`(라이선스 — 폰트와 함께 보존 의무), `coverage.json`, `README.md`.

### 2.4 기록 (보존)
- `CLAUDE.md`, `AGENTS.md`, `README.md`(README는 V1 범위 서술이라 내용이 낡음 — 갱신 후보, 삭제 아님)
- `docs/v5/*.md`: SPEC·결정·판독(final-read·final2-read·p6*-read)·비용(`api-cost-log.md`)·배포(`deploy-checklist.md`)·인프라·브랜치표.
- `docs/v5/trial/**` 386개: 시범 원고. `tests/unit/writer/p6d.test.ts`가 읽는 품질 하한선 기준이라 보존.
- `docs/*.md`(v1~v4) 194개, `docs/baseline-failures*.txt` 3개(현행 기준선은 `docs/baseline-failures.txt` 하나, 나머지 2개는 옛 기준).

### 2.5 migration — 전부 보존
- `supabase/migrations` 36개. `src/lib/tickets/localDatabase.ts` 등 PGlite 시험이 디렉터리째 읽는다.
- `scripts/*.sql` 18개: migration 밖에서 운영에 적용한 RPC 패치(`docs/v5/infra-notes.md` §5). 시험도 일부를 읽는다(`localDatabase.ts:19`). migration과 같은 등급으로 보존.

### 2.6 중복
- **내용 해시 같음**(git blob 기준): 202묶음, 남는 사본 447개·35.8MB. `docs/validation` 안 91묶음 23.0MB, `docs/v5` 스크린샷 107묶음 12.5MB(freeze-base와 freeze-branch에 같은 그림), 코드 사본은 1건(`docs/validation/.../baseline-test.ts.txt` = 시험 파일 사본).
- **거의 같은 모듈**(jscpd 4, 120토큰 이상): 전체 262,869줄 중 중복 4,497줄(1.71%). 큰 것:
  - `report-knowledge/compatibility-{coworker,business-partner,manager-report}-research/contractInventory.ts` 426줄씩 — 운영 미도달(삭제 묶음 C2와 같이 사라짐)
  - `report-tables/daeunTableData.ts` ↔ `saeunFortuneTableData.ts` 165줄 — **운영·열람 코드** → 합치지 말 것(열람 동작 고정 원칙), 정리 대상 아님
  - `report-generation/{annual,major,careerMoneyStudy}GenerationHandler.ts` 95~105줄 — 열람 폐포 안 → 손대지 않음
  - tools 단계별 사본: `p6b/p6c/p6d generate.*.ts`, `p6b-ui/p6c-ui2/p6d capture.mjs`, v4 `*/verify.mjs` 다수 — 도구 정리 때 한 번에

### 2.7 죽은 코드 (V4 결정론 작가·OpenAI 경로 포함)
판정 기준: 운영 진입점(비-dev 앱 라우트)에서 import(정적·동적·`import type`·require)로 닿지 않음. 도구 2개(자체 그래프, knip) 교차 확인. ts-prune은 유지보수 중단 상태라 knip으로 대체했다.

| 묶음 | 파일 | 크기 | 상태 |
|---|---:|---:|---|
| 완전 고아(import 0) | 70 | 465 KB | knip `unused files` 74개와 70개 일치(knip 나머지 4개는 디렉터리 단위 표기) |
| report-knowledge v4 연구·전문 엔진(시험·도구만 import) | 약 815 | 약 57 MB | 운영 미도달. `*-research/`, `knowledge-integration-foundation/*-specialist-engine` 등 |
| 옛 OpenAI 작가 잔재 | 5 | 38 KB | `report-generation/comprehensiveReportDraftSchema.ts`(:493 `openAIComprehensiveReportV2NarrativeDraftJsonSchema`), `compatibilityReportDraftSchema.ts`, `comprehensiveReportDraftSanitizer.ts`, `comprehensiveReportNarrativePostProcessor.ts`, `report-generation/index.ts`(아무도 import 안 하는 barrel) |
| V4 shadow 전용 조각 | 2 + 함수 1 | 소 | `components/report/V4ShadowReportView.tsx`(시험만), `runV4ShadowJob`(`runtimeShadow.ts:105`, 시험만) |
| dev 미리보기(v1~v3 시기) | 8 라우트 + 4 모듈 | 소 | §2.10 |

**살아 있어서 죽은 코드가 아닌 것:**
- **V4 결정론 작가** (`interpretation-v4/runtimeShadow.ts` + 생성 전용 약 219개): 코드 기본값에서 새 결제·이용권 전부를 만들고 v5도 부른다. 유지. 열람용 43개는 별개로 영구 유지.
- **v2/v3 결정론 생성 진입**(`generateProductReport`): `bookGeneration` 없는 옛 주문의 재시도용으로만 남음. 대기 중인 옛 작업 0건을 DB로 확인하기 전에는 유지. v3 빌더 자체는 열람 검사기가 쓰므로 영구 유지.
- **OpenAI 임시본 레인**: `llm/providers.ts:89-128`(`openaiDriver`), `llm/streamCompletion.ts`, 관리자 전환 스위치(`ops/admin/actions.ts:232-237`), 가격표(`llm/prices.ts`). Sonnet이 2시간 넘게 실패하고 `OPENAI_API_KEY`가 있을 때만 호출(`ops/generation/policy.ts:14-17,56-58`, `supervisor.ts:47-51`). 유지.
- OpenAI 관련 텍스트 가드(검사기의 금칙어 목록 등)·주석·시험 77개: 대부분 "옛 작가가 없어야 한다"는 부정 단언이다. 잔재 5개를 지울 때 함께 정리.

### 2.8 안 쓰는 패키지
- **확정된 미사용 패키지 없음.** 직접 의존 7 + 개발 12.
- knip 보고 3개는 모두 오탐:
  - `lunar-javascript` — `createRequire`로 부름(`saju/solarTerms.ts:54`, `saju/customerDayun.ts:68`)
  - `tailwindcss` — CSS `@import`로 씀
  - `astronomy-engine` — `tests/oracle/oracle.ts`가 씀(오라클 시험)
- 선언 없이 쓰는 것(정리 때 판단, 이번에는 package.json 변경 금지):
  - `playwright`·`axe-core` — tools의 캡처·E2E 스크립트(`tools/p6d/e2e.mjs` 등)
  - `server-only` — Next 내장 별칭 + `tools/llm/shim`
  - `postcss` — `@tailwindcss/postcss`의 하위 의존
- `@electric-sql/pglite`(devDependency)는 src의 로컬 검수 경로가 import한다. dev 라우트 추적에 20.6MB씩 들어가지만 운영 라우트 추적에는 없다.

### 2.9 생성물 (git 밖으로 옮길 대상)
- `docs/validation/**` 3,656개·2.55GB: v4 검증 단계 산출물(JSON·gz). 운영 도달 0. 참조하는 쪽:
  - 시험 75개 — 그중 운영 회귀 시험 9개 + 소스 검사 6개(§3 C1)
  - 도구 47개
  - v4 연구 src 41개
  - scripts 4개
- `docs/v5/ui-*/**` 등 스크린샷 332개·37.5MB: UI 판독 증거. 같은 그림 사본 107묶음.
- tools 안 산출 JSON: `tools/p35/enrich/{in,out}/*.json` 12개, `tools/p36/props-patch.json`, `tools/p6d/compat-*.json` 등 약 0.5MB.
- 추적 밖: 메인 저장소 `.next` 24.9GB, worktree `.next` 합계 35.1GB(재생성 가능).

### 2.10 개발 라우트 (참고 범주)
`/dev/**`·`/api/dev/**` 41개 함수가 운영 빌드에 들어간다(전체 100개 중). 운영에서는 막혀 있다(근거: `NODE_ENV`·`localAccountAllowed`·`manualReviewAllowed` 검사). 예외로 `*-preview` 5개는 `{ANNUAL_FORTUNE,COMPATIBILITY,CAREER_REPORT,COMPREHENSIVE,LOVE_MARRIAGE_CHILD,MAJOR_FORTUNE}_DEV_PREVIEW_ENABLED=1`이면 운영에서도 켜진다(예: `dev/annual-fortune-preview/page.tsx:33-37`).

| 라우트 | 시기 | v5 도구·문서 참조 | 판정 |
|---|---|---:|---|
| book-preview | 운영 리더가 여기 있음 | 70 | **옮김 대상**(지우면 운영 깨짐) |
| v5-login, book-flow, content-review, account, campaign, launch-event, measurement | v4~v5 로컬 검수 | 0~18 | 유지 |
| annual-fortune-preview, annual-v3-preview, career-report-preview, compatibility-preview, comprehensive-preview, love-marriage-child-report-preview, major-fortune-preview(+export), v3-editorial-preview | v1~v3 미리보기(마지막 수정 07-05~10-28) | 1~4(옛 문서) | 삭제 후보 C6 |

---

## 3. 삭제·이동 후보

### 3.1 먼저 옮길 것 (지우기 전에 필수, 동작 불변 이동)

| # | 대상 | 이유 | 검증 |
|---|---|---|---|
| M1 | `src/app/dev/book-preview/` 중 운영 사용 12개(`bookProjection.ts`, `bookTypes.ts`, `bookNavigation.ts`, `comprehensiveBook.ts`, `model.ts`, `BookReader.tsx`, `BookPages.tsx`, `BookPeriodData.tsx`, `BookLegal.tsx`, `readerLayout.ts`, `coverflowAuto.ts`, `book.module.css`) → 예: `src/components/book/reader/` | `lib/book/storedReport.tsx:5`, `lib/writer/book.ts:6-7`, `lib/book/*Adapter.ts` 등이 import. dev 폴더 정리 때 지우면 운영 Book 열람이 깨진다 | tsc·build, 열람 시험 4종, `bookBodySameness` |
| M2 | `src/app/dev/book-preview/runtimeBooks.ts`의 `tests/unit/interpretation-v4/{runtime,narrative,compatibility,annual,love,major}Fixtures.ts` import | 시험 파일을 지우면 `next build`가 깨진다 | build |
| M3 | 운영 회귀 시험 9개가 읽는 `docs/validation` 기준 파일(예: `.../input-cases.json`, `.../baseline-generation-digests.json`) → `tests/fixtures/` | C1을 지우면 V4/V3 생성 결과 고정 시험이 사라진다(열람 검사기가 v3 빌더 결과 일치를 요구하므로 이 시험이 열람 보호막) | 해당 9개 시험 통과 |
| M4 | (선택) `docs/product/mbti/source/` → `src/data/` | 런타임 자료가 docs에 있음. 옮길 때 바이트 동일·경로 2곳(`mbtiSourceRegistry.ts`, `sourceRuntimeAdapter.ts`) | 열람 시험, MBTI 표 시험 |

### 3.2 삭제 후보 (큰 순)

| # | 경로 | 파일·크기 | 근거(도달 불가 증거) | 위험 | 삭제 후 검증 |
|---|---|---|---|---|---|
| C1 | `docs/validation/**` | 3,656 · 2.55GB | 운영·dev 진입점 도달 0(import·경로 문자열), 빌드 추적(nft) 0 | **중**: 시험 75개가 읽음. 운영 회귀 9개는 M3로 먼저 이전, 나머지 66개는 v4 연구 시험(C2와 함께 삭제). git 이력엔 남으므로 `.git`(666MB)은 줄지 않고 체크아웃만 줄어든다 | tsc, `pnpm test`(기준선 대비 신규 실패 0), build, 열람 시험 |
| C2 | `src/lib/report-knowledge/` 운영 미도달분(시험만 601 + 시험·도구 214 + 고아 64) + `tools/` v4 단계 39개 폴더 + 그 시험(운영 미도달만 시험 33개, 혼합 62개는 미도달 부분만) + 그 시험만 쓰는 `tests/fixtures` 19개(12폴더) | 약 880 + 39폴더 · 약 57MB + 픽스처 6.6MB(혼합 시험이 같이 쓰는 `*-specialist-engine-01` 픽스처 약 60MB는 혼합 시험 정리 결과에 따라 추가) | import 그래프: 운영·dev·package 스크립트 진입점에서 미도달. knip도 64개를 unused로 봄 | **중**: 운영 루트 `report-knowledge/*.ts` 76개와 같은 폴더. 열람 폐포 68개가 섞여 있어 **폴더 단위 삭제 금지, 파일 목록 단위로**. `report-knowledge/knowledge-integration-foundation/*-specialist-engine`이 `tools/*-specialist-engine`을 import(같이 지워야 함) | tsc, test, build, 열람 시험, 워커 추적 크기 |
| C3 | src 완전 고아 70개 | 70 · 465KB | import 0(자체 그래프), knip unused 일치. 이름 grep 0(표본 6개 확인) | 낮음 | tsc, test, build |
| C4 | 옛 OpenAI 작가 잔재 5개 + 시험 4개(`tests/unit/report-generation/{compatibilityReportDraftSchema,comprehensiveReportDraftSanitizer,comprehensiveReportDraftSchema,comprehensiveReportNarrativePostProcessor}.test.ts`) | 9 · 약 75KB | 운영 진입점 미도달, 시험만 import | 낮음. 혼합 시험 3개는 운영 코드도 시험 → 해당 부분 분리 확인 | tsc, test, build, `grep -ri openai src`(임시본 레인만 남는지) |
| C5 | dev 미리보기 8개 라우트 + `report-generation/{annualFortune,compatibility,careerReport,majorFortune}PreviewSnapshot.ts` (`.tmp/*-preview` 읽기·쓰기) | 약 13 · 약 100KB | 운영 기본 404, 각 페이지만 import(`productPreviewSnapshot.ts`는 다른 모듈로 운영 사용 — 지우지 말 것) | 낮음~중: 운영 env로 켤 수 있는 페이지라 누가 쓰는지 확인. 빌드 함수 수 감소 | build 라우트 목록, test |
| C6 | `public/{file,globe,next,vercel,window}.svg` | 5 · 3KB | create-next-app 기본 파일(2026-05-01 초기 커밋), 참조 0 | 없음 | build |
| C7 | `public/brand/gyeol-report-og.png`, `gyeol-kakao-app-128.png` | 2 · 1.3MB | 코드 참조 0(현행 OG는 `gyeol-report-og-20261030.png`) | **외부 참조 가능**: 이미 공유된 카카오·메신저 카드, 카카오 개발자 콘솔 앱 아이콘 URL → 덕짱님 결정 | 외부 URL 확인 |
| C8 | `src/data/knowledge-v5/legacy/` | 16 · 2.3MB | `loadKnowledge` 미사용, 해시 제외, 경로 참조 0 | 낮음(Book 버전 해시 불변). v1 지식 기록 가치 → 태그 보관 후 삭제 또는 docs로 이동 | test(`tests/unit/brief`, writer), 워커 추적 크기 |
| C9 | scripts 구형: `smoke_*.ts` 15개(2026-06~07, v1~v2 RPC), `verify-v4-*.mjs` 14개, `print-report-fixture.mjs`, `dump_full_report_qa.ts`, `lib/loadLocalEnv.ts`(참조 0) | 약 32 · 약 200KB | package.json·CLAUDE.md·v5 문서 미참조. 옛 RPC는 회수됨 | 낮음(개발 전용). 단 `tsconfig` include가 `**/*.ts`라 지우면 tsc 대상이 준다 | tsc |
| C10 | 소소한 미참조: `src/app/dev/book-preview/fixture.json`, `tests/unit/interpretation-v4/{contentRebuildBaseline,majorEditorialSafetyLocks}.json`, `docs/baseline-failures-{84826020,v5main}.txt` | 5 · 약 300KB | 이름 grep 0 / 옛 기준선 | 없음 | test |
| C11 | 스크린샷 사본(docs/v5 freeze-base·freeze-branch 같은 그림) | 107묶음 · 12.5MB | blob 해시 동일 | 없음(판독 문서 링크 확인) | 문서 링크 점검 |

### 3.3 지금은 지우면 안 되는 것 (조건부)

| 대상 | 지울 수 있는 조건 |
|---|---|
| V4 생성 전용 약 219개(`runtimeShadow` 계열) | ① 운영 `WRITER_V5_PRODUCTS`가 6상품 전부 ② v5의 `v4People`을 표 전용 경로(`v4TableEvidence`, `publish.ts:67`)로 바꿔 표가 같음을 확인(옛 경로는 상품별 계산 `calculateCareerSaju` 등을 씀) ③ 대기·재시도 중 V4 작업 0건(DB) ④ v5로 표시된 이용권 행은 플래그를 꺼도 v5로 남음(`20261104100000_v5_p6d_ops.sql:777-788`) |
| `generateProductReport` 생성 진입(v2/v3) | `bookGeneration` 없는 옛 결제 작업이 대기·재시도에 0건 (DB) |
| 열람 폐포 415개, `docs/product/mbti/source`, migration·scripts/*.sql | 영구 보존 (동작 변경도 금지) |
| `tools/llm/{budget,env,audit}.ts` | 영구(운영 코드 `ops/generation/devBudget.ts:20`가 개발 분기에서 동적 import — 운영 빌드에선 빠지지만 파일이 없으면 tsc·build 실패) |

---

## 4. 기준선 측정

환경: macOS(darwin-arm64), Node 25.9.0, pnpm 10.33.0, Next 16.2.4(Turbopack). 숫자는 이 장비 기준이며 Vercel(linux)과 네이티브 바이너리 크기가 다르다.

### 4.1 빌드·검사 시간
| 명령 | 결과 |
|---|---|
| `pnpm build` 1회차(.next 없음) | 40.2s 실측(wall), 컴파일 8.9s, **TypeScript 26.7s**, 정적 페이지 54개 0.2s, 최대 메모리 4.5GB, exit 0 |
| `pnpm build` 2회차 | 43.0s (빌드 캐시 효과 없음) |
| `pnpm exec tsc --noEmit` | 26.1s, exit 0 |
| `pnpm test` | **1,354.7s(22.6분)**, 파일 660개(실패 157·통과 501·건너뜀 2), 사례 31,461개(실패 839·통과 27,322·건너뜀 3,300), exit 1. 기준선(`docs/baseline-failures.txt`, master 0dde75a8·2026-10-28, 실패 파일 142개)과 비교: 기준선 142개는 모두 여전히 실패, **기준선 밖 실패 15개** = 시간 초과 14개(부하 상태 실행: 명령문 A와 동시 실행, 5~180초 제한 초과) + **스냅샷 불일치 1개**(`tests/unit/brief/buildBrief.test.ts`, 브리프 `tokens` 11083→11110 등 — v5/final에서 지식·브리프가 바뀐 뒤 스냅샷 미갱신으로 보임, 정리 작업과 무관) |
| `pnpm install --frozen-lockfile` | 2.6s(저장소 캐시 있음) |

### 4.2 의존성
- 직접 의존 7, 개발 의존 12. 설치 패키지 디렉터리 400개(`node_modules/.pnpm`), `node_modules` 512MB.
- 큰 것: next 168MB, @next/swc 116MB, pglite 25MB, typescript 23MB, rolldown 19MB, sharp-libvips 15MB.

### 4.3 라우트별 크기 (`.next` 매니페스트에서 계산)
Next 16은 크기 표를 출력하지 않아 `page_client-reference-manifest`(클라이언트 JS)와 `*.nft.json`(서버 함수 추적)을 합산했다.

클라이언트 JS(첫 로드, raw / gzip):
| 라우트 | raw | gzip |
|---|---:|---:|
| 공통 기준(`/`, 법무 페이지 등) | 652KB | 192KB |
| `/r/[token]` | 891KB | 256KB |
| `/reports/[reportId]` | 887KB | 255KB |
| `/report/new` | 857KB | 236KB |
| `/login`, `/account` | 782KB | 231KB |
| `/payments/toss/success` | 753KB | 223KB |
| `/admin/orders` | 692KB | 205KB |
| `/dev/content-review`(최대) | 903KB | 271KB |

서버 함수 추적 크기(함수 1개 기준, 중복 포함):
| 라우트 | 합계 | 번들 청크 | node_modules | 저장소 파일 |
|---|---:|---:|---:|---:|
| `/api/internal/report-writer-recovery` | 21.9MB | 7.7MB | 1.4MB | 12.8MB |
| `/api/internal/report-ticket-jobs` | 21.2MB | 7.0MB | 1.4MB | 12.8MB |
| `/api/internal/ops-jobs` | 20.6MB | 6.5MB | 1.4MB | 12.8MB |
| `/api/internal/report-jobs` | 20.6MB | 6.4MB | 1.4MB | 12.8MB |
| `/r/[token]/book-og` | 30.3MB | 4.1MB | 20.8MB(sharp-libvips 15.7MB darwin) | 5.4MB(폰트 3.0MB + MBTI 2.4MB) |
| `/r/[token]`, `/reports/[reportId]` | 8.1MB | 4.4MB | 1.2MB | 2.4MB(MBTI 원천) |
| 일반 페이지 | 약 2.1MB | 0.9MB | 1.2MB | 0 |

워커 함수의 저장소 파일 12.8MB 내역:
- `knowledge-v5/myeongri` 2.5MB
- `docs/product/mbti/source` 2.4MB
- **`knowledge-v5/legacy` 2.3MB(안 읽음)**
- **`report-knowledge/foundation-deep/*.ts` 1.5MB(런타임 읽는 코드 못 찾음 — 빌드 추적 과포함으로 추정, 원인 미확정)**
- `materials.json` 1.2MB
- `fusion` 0.8MB 외

라우트 수: 100개(운영 페이지 28·라우트 31, dev 페이지 23·라우트 18). 서버 추적 합(함수별 단순합): 운영 314MB, **dev 627MB**.

### 4.4 디스크
| 대상 | 크기 |
|---|---:|
| 추적 파일(체크아웃 1개) | 2.77GB, 그중 `docs/validation` 2.55GB |
| `.git` (메인) | 666MB |
| 메인 저장소 전체 | 26GB(그중 `.next` 24.9GB) |
| worktree 69개 합계(v5-final 제외 68개 측정 + 이 worktree) | 249.5GB = docs/validation 169.4 + .next 35.1 + node_modules 33.1 + 나머지 |

### 4.5 최적화 후보 (실측 근거 있는 것만)
요청서의 "PDF 11번" 원문은 저장소에서 찾지 못했다(PDF 0개, docs에 해당 번호 없음). 성능·용량 최적화 항목으로 해석해 실측 근거가 있는 것만 적는다.

| # | 후보 | 실측 근거 | 기대 효과 | 위험 |
|---|---|---|---|---|
| O1 | worktree·체크아웃에서 `docs/validation` 제거(C1) | worktree 사본 169.4GB, 체크아웃 2.55GB | 디스크 −169GB, 새 worktree 생성 시간·용량 대폭 감소 | §3 C1 |
| O2 | 메인 저장소 `.next` 삭제, worktree 정리(§5) | 24.9GB + worktree `.next` 35.1GB | 디스크 −60GB | 없음(재생성) |
| O3 | 운영 빌드에서 dev 라우트 41개 제외 또는 축소(C5 + 장기적으로 `/dev`를 별도 조건부 빌드) | 함수 100개 중 41개, 서버 추적 합 627MB(운영 314MB의 2배), dev 추적마다 pglite 20.6MB | 배포 산출물·함수 수 감소 | 로컬 검수 흐름 유지 방법 필요 |
| O4 | 워커 함수 추적에서 `knowledge-v5/legacy`(2.3MB)·`report-knowledge/foundation-deep`(1.5MB) 제외(`outputFileTracingExcludes` 또는 C8) | 워커 4개 각 20.6~21.9MB 중 3.8MB(약 18%) | 함수 크기 감소. 콜드스타트 효과는 미측정 | 낮음(안 읽는 파일), 단 foundation-deep 포함 원인 확인 후 |
| O5 | 타입 검사 대상 축소(C2·C9로 src·tools 축소) | 빌드 40s 중 TypeScript 26.7s(67%), `tsc --noEmit` 26.1s | 빌드·검사 시간 감소(얼마인지는 삭제 후 측정) | C2 위험과 같음 |
| O7 | 시험 시간 | `pnpm test` 22.6분. 누적 단계 시간: import 636.8s, transform 262.2s, 시험 17,737.6s. 시간이 찍힌 파일(실패·건너뜀 157개, 통과 파일은 비-TTY 출력에 시간 없음) 중 상위는 V4 생성 시험(`contentRebuild` 683s, `comprehensiveStability` 635s)과 `docs/validation`을 읽는 `*GenerationPreservation` 3개(579~624s), 연구 혼합 시험(463~539s) | C1·C2로 연구 시험과 대형 TS 자료 import가 줄면 감소. V4 생성 시험은 V4가 살아 있는 동안 유지 | 회귀 보호 시험을 같이 지우지 않게 M3 선행 |
| O6 | Book 화면 클라이언트 JS | `/r/[token]`·`/reports/[reportId]`가 공통 기준보다 +239KB raw / +64KB gzip | 측정만 함. 모듈 단위 원인은 이번에 미분석 | — |

---

## 5. worktree·경로 정리 제안

### 5.1 현재 목록 (2026-11-05 조회, `git worktree list --porcelain` + 각 worktree `git --no-optional-locks status`)
- 등록 133개 = 실재 69개 + **prunable 63개**(`/private/tmp/gyeol-*` 디렉터리 없음, v4 브랜치 62 + detached 1) + Codex 폴더 1개(`~/Documents/Codex/2026-09-29/.../gyeol-share-brand`, master 병합됨).
- origin/master = `d846c2ea`. v5/final은 master보다 225커밋 앞, master에만 있는 커밋 2개(`d846c2ea` event-end, `c5c11ca8` ops-1)는 v5/final에 `hotfix/event-end-v5` 등 다른 커밋으로 반영된 것으로 보인다(내용 대조는 명령문 A 범위, UNVERIFIED).
- 기존 보관 태그: `archive/p5-ui`(f3cd5cdc), `archive/p6e-content`(363bedfe, 원격에도 있음).

| 묶음 | worktree | 미커밋 | 병합 상태 | 제안 |
|---|---|---|---|---|
| W0 | `v5-final` | **미조사(명령문 A 작업 중)** | origin과 같음, master 미병합 | 손대지 않음 |
| W1 | prunable 63개 | — | — | `git worktree prune`(메타데이터만 지움, 브랜치 유지) |
| W2 | master에 병합·깨끗 28개: `hotfix-event-end`, `hotfix-ops-1`, `master-pristine`(detached = master), v4-* 24개, Codex `gyeol-share-brand` | 0 | master 조상, 원격 브랜치 동일 | 바로 제거 가능 |
| W3 | v5/final에 포함·깨끗: `v5-main`(v5/p1-knowledge), `v5-p2-brief`, `v5-p3-writer`, `v5-p35-p4`, `v5-p36`~`p38`, `v5-p6`, `v5-p6-manse`, `v5-p6b`, `v5-p6b-ui`, `v5-p6c-*`(4), `v5-p6d-*`(3), `v5-p6e-base`, `v5-p6e-ops`, `v5-ui`, `v5-read`, `v5-final-base`, `event-end-v5` | 0 (v5-read는 `.read-latest.log` 1개) | v5/final 조상 | **v5/final이 master에 병합된 뒤** 제거. `v5-read`는 `scripts/read-latest.sh` 기본 경로라 마지막에 |
| W3' | `v5-final2-base`(detached) | **추적 안 된 `tools/final/brief2.ts`, `tools/final/stored-flags2.ts` — v5/final에 없음** | v5/final 조상 | 두 파일 보존(브랜치 커밋 또는 이동) 후 제거 |
| W4 | 고유 커밋 있음(어디에도 미병합) | | | archive 태그 후 제거 |
| | `v4-all-products-final-assembly-01` | 0 | +1(`010ab431`), 원격 없음 | `archive/v4-all-products-final-assembly-01` |
| | `v4-foundation-engine-complete-01`(v4/foundation-evidence-contract-01) | 0 | +10, 원격 동일 | 태그 선택 |
| | `v4-phase2-product-narrative-01` | **수정 25 + 추적 안 됨 6** (interpretation-v4 composer 등) | +10(위와 같은 커밋), 원격 없음 | 미커밋을 wip 브랜치에 커밋 후 태그 |
| | `hotfix-ui`(hotfix/ui-requested `651d6653`) | 0 | master +1, 원격 없음. 같은 제목 커밋이 `v5/p5-revert`(`34f65006`)에도 있음. 내용(Threads 아이콘·버전 붙은 공유 이미지)은 v5/final에 있음 | 태그 후 제거 |
| | `v5-p5-revert` | 0 | +1, 원격 없음 | 태그 후 제거 |
| | `v5-event-1plus1` | 0 | +1, 원격 없음, 문서상 "보류·병합 금지" | 태그 후 제거 |
| | `v5-manseryeok-lmt`(v5/manseryeok-merge) | 추적 안 됨 1(`docs/audit-step0.md`) | +1(문서), 원격 동일 | 제거(파일은 메인 저장소에도 같은 이름 있음 — 대조 후) |
| | `v5-p6e-content` | 0 | +1, `archive/p6e-content` 태그 있음 | 제거 |
| | `v5-quality-q0` | **수정 5**(`docs/eval/failure-rate/*.json`) | +1, 원격 없음 | wip 커밋 후 태그 |
| | `v5-quality-q1`, `q2`, `q2-openai`, `q3-q2-baseline` | 0 | +2~+7, 원격 없음 | 태그 후 제거 |
| | `v5-quality-q3` | **수정 1 + 추적 안 됨 6**(`src/app/dev/review/`, `scripts/q3-export-books.ts`, `docs/eval/q3/*`) | +11, 원격 없음 | wip 커밋 후 태그 |
| | `v5-quality-q3c` | **추적 안 됨 4**(`docs/eval/feedback/`, `docs/eval/q3/books/` 등) | +17, 원격 없음 | wip 커밋 후 태그 |
| W5 | 메인 `~/Dev/projects/gyeol-report` | **수정 3**(`.gitignore`, `AGENTS.md`, `CLAUDE.md`) + **추적 안 됨 3**(`docs/audit-step0.md`, `docs/claude-md-proposal.md`, `supabase/.temp/`) | 브랜치 `v4/annual-editorial-quality-fix-01`(`9af380b1`, master +1 "hide ad consent popup on mobile", 원격보다 앞섬) | 미커밋 보존 → master로 전환(§5.3) |

worktree 제거 때 같이 사라지는 무시 파일(이름만 확인, 내용 미열람):
- `.env.development.local` — 14개 worktree에 있음
- `.env.local` — `v5-main`, `v5-quality-q2`, 메인 저장소에 있음

`tools/p6/cases.ts:21-22`는 `v5-quality-q2/.env.local`과 `v5-p3-writer/.env.development.local`을 키 파일 경로로 직접 가리킨다. 그 worktree를 지우면 이 도구가 깨진다. P6 단계 도구라 영향은 작다. 키 원본은 메인 저장소 `.env.local`을 기준으로 한다.

### 5.2 archive 태그 제안
- 형식: 기존 관례를 따른다. `archive/<브랜치 이름에서 / 를 - 로>`, 주석 태그(annotated)로 만들고 메시지에 "무엇·왜 보관·병합 안 함"을 적는다.
- 미커밋 작업이 있는 곳은 먼저 `wip/<worktree 이름>` 브랜치에 커밋한 뒤 그 커밋에 태그를 단다. stash는 쓰지 않는다(저장소 규칙).
- 대상(13개):
  - v4 계열: `v4/all-products-final-assembly-01`, `v4/phase2-product-narrative-01`(+wip), `v4/foundation-evidence-contract-01`
  - 핫픽스: `hotfix/ui-requested`
  - v5 계열: `v5/p5-revert`, `v5/event-1plus1`, `v5/quality-q0`(+wip), `v5/quality-q1`, `v5/quality-q2`, `v5/quality-q2-openai-removal`, `v5/quality-q3`(+wip), `v5/quality-q3c`(+wip)
  - 메인 저장소: `v4/annual-editorial-quality-fix-01`(+wip)
- 대규모 삭제 직전 기준점 태그: `archive/v4-validation-<날짜>`를 C1 직전 커밋에 단다. 같은 커밋에서 `docs/validation`을 되살릴 수 있다.
- 태그 push와 원격 브랜치 정리는 승인 필요 항목(CLAUDE.md "권한").

### 5.3 저장소 경로 통일
현재:
- 메인 `~/Dev/projects/gyeol-report` — master가 아닌 브랜치, 미커밋 있음, 26GB
- 작업 worktree `~/Developer/gyeol-worktrees/*` 69개
- 과거 임시 `/private/tmp/gyeol-*` 63개(사라짐)
- Codex 폴더 1개

목표:
- `gyeol-report` = master 전용. 배포 기준이며 직접 작업하지 않는다.
- `gyeol-worktrees/<작업명>` = 작업별

안 A (권장): 메인을 `~/Developer/gyeol-report`로 옮겨 한 부모 아래 둔다.
- 영향:
  - 모든 worktree의 `.git` 파일이 `gitdir: /Users/Deokmin/Dev/projects/gyeol-report/.git/worktrees/<이름>` 절대 경로를 가진다. 메인을 옮긴 뒤 새 위치에서 `git worktree repair <worktree 경로들>`을 한 번 실행해야 한다. **worktree 정리(W1~W4)를 먼저 하면 고칠 대상이 줄어든다.**
  - Claude Code 메모리 폴더가 경로를 키로 쓴다(`~/.claude/projects/-Users-Deokmin-Dev-projects-gyeol-report`). 새 경로용 폴더로 옮겨야 기존 메모리가 이어진다.
  - IDE 작업공간 경로
  - `.vercel/`(프로젝트 ID 기반, 경로 무관)
  - `supabase/.temp/`(link 정보, 메인 안에 같이 이동)
  - 저장소 안 코드의 절대 경로: `scripts/read-latest.sh:10`(`~/Developer/gyeol-worktrees/v5-read` 기본값, 환경변수로 바꿀 수 있음), `tools/p6/cases.ts:21-22`(다른 worktree의 env 파일) — 메인 경로를 가리키는 코드는 0개
  - 문서 24개의 경로 언급은 기록이라 고치지 않는다.
- master 전환 순서:
  1. 미커밋 3+3개를 `wip/main-claude-md` 브랜치로 커밋. `supabase/.temp`는 무시 대상으로 두고 이동만 한다.
  2. `git switch master`. master는 다른 worktree에 체크아웃돼 있지 않다(`master-pristine`은 detached).
  3. `.next` 24.9GB 삭제
  4. 이동
  5. `git worktree repair`
  6. 이후 메인에서는 `git pull`만 하고 작업은 하지 않는다.

안 B: 경로는 그대로 두고 규칙만 문서화한다. 위험은 가장 작지만 경로 이원화가 남는다.

---

## 6. 실행 계획 초안 (배포 안정 후, 커밋 단위)

공통 검증 세트(모든 커밋):
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm test` — `docs/baseline-failures.txt` 대비 신규 실패 0
- `pnpm build` — 라우트 목록 대조
- 열람 시험: `pnpm exec vitest run tests/unit/payment/productionVersionCombos.test.ts tests/unit/payment/readVersionTolerance.test.ts tests/unit/saju/legacyBookProtection.test.ts tests/unit/app/bookBodySameness.test.tsx`

**0단계 — 코드 변경 없음**
- 0-1 (덕짱님, 운영 SQL 편집기 읽기 전용):
  - R1 격리 패치 적용 여부
  - 10-28 이후 `paid_report_snapshots`·이용권 Book의 (productType, productVersion) 목록 → `productionVersionCombos` 갱신
  - `bookGeneration` 없는 대기·재시도 작업 수
  - 운영 `WRITER_V5_PRODUCTS` 값
- 0-2: W4·W5의 미커밋 작업을 `wip/*` 커밋으로 보존하고 archive 태그를 단다. 태그 push는 승인 후.
- 0-3: W1 `git worktree prune`, W2 제거, 메인 `.next` 삭제. W3는 v5/final이 master에 병합된 뒤 제거.

**1단계 — 이동 (동작 불변, 커밋 1개씩)**
- 1-1: M1. book-preview 운영 파일 12개를 `src/components/book/reader/`로 옮기고 import 경로만 바꾼다.
- 1-2: M2. `runtimeBooks.ts`가 tests 파일을 import하지 않게 한다. 픽스처를 dev 폴더로 옮기거나 dev 페이지를 정리한다.
- 1-3: M3. 운영 회귀 시험 9개의 기준 파일을 `tests/fixtures/`로 옮긴다. 시험 경로만 바꾼다.
- 1-4 (선택): M4. MBTI 원천을 `src/data`로 옮긴다.

**2단계 — 작은 삭제 (위험 낮음)**
- 2-1: C3 고아 70개 + C10 + C6
- 2-2: C4 옛 OpenAI 잔재 + 시험. `writer/flags.ts:3` 낡은 주석도 고친다.
- 2-3: C5 dev 미리보기 8개 + PreviewSnapshot 4개
- 2-4: C9 구형 scripts (덕짱님 결정 후)

**3단계 — 큰 삭제**
- 3-1: C1 `docs/validation`. 직전 커밋에 `archive/v4-validation-<날짜>` 태그를 단다. 이것만 읽는 시험 66개도 정리한다. 2.55GB 감소.
- 3-2: C2 v4 연구·전문 엔진 + `tools/` v4 39개 폴더 + 그 시험·픽스처. **파일 목록 단위로 하고, 열람 폐포 415개 목록과 교집합 0을 확인**한 뒤 지운다. 커밋은 엔진 단위로 나눈다(궁합 7종·대운·연간·종합·연애·직업·공통 기반).
- 3-3: C8 `knowledge-v5/legacy` 처리, O4 워커 추적 제외 설정.

**4단계 — 조건부 (조건 충족 전 금지)**
- V4 생성 전용 약 219개, `generateProductReport` 생성 진입: §3.3 조건 ①~④를 DB와 운영 값으로 확인한 뒤에만 한다. 열람 폐포는 계속 유지한다.

**5단계 — 경로 통일**
- §5.3 안 A 또는 B. worktree 정리 뒤 언제든 할 수 있다.

각 단계 뒤 기록: 파일 수·크기, `pnpm build` 시간, 워커 추적 크기, 시험 수를 이 보고서 §4 표와 대조한다.

---

## 7. 덕짱님 결정이 필요한 사항

1. **운영 `WRITER_V5_PRODUCTS` 범위** — 6상품 전부로 갈지에 따라 V4 생성기(약 219개)를 언젠가 지울 수 있는지가 갈린다.
2. **운영 DB 읽기 전용 조회 4건**(§6 0-1) — 직접 실행할지, 승인 후 맡길지.
3. **`docs/validation` 처리 방식** — (a) 삭제하고 git 이력·태그로만 보관, (b) 외부 저장소(드라이브 등)에 묶어 보관한 뒤 삭제, (c) 유지.
4. **고유 커밋 브랜치 13개 + 미커밋 6곳** — 태그만 남기고 버릴지, 일부를 살릴지. 특히 `v4-phase2-product-narrative-01`의 미커밋 31개와 `v5-quality-q3`의 `src/app/dev/review/`.
5. **public 옛 이미지 2개**(`gyeol-report-og.png` 1.3MB, `gyeol-kakao-app-128.png`) — 외부에 쓰인 URL이 있는지.
6. **dev 미리보기 8개 라우트·구형 scripts 29개 삭제 여부** — 운영 env로 켜서 쓰는 사람이 있는지.
7. **경로 통일 안 A/B** — 메인을 `~/Developer/gyeol-report`로 옮길지.
8. **"PDF 11번"** — 원문을 저장소에서 찾지 못했다. §4.5 해석(성능·용량)이 맞는지, 다른 항목이면 원문이 필요하다.

---

## 부록 A. 분류 방법 (재현)
- 대상: `git ls-files` 7,916개, 크기는 작업 트리 기준.
- 간선:
  - import — TypeScript `preProcessFile` + 동적 `import()`·`typeof import()`·`require`·`*Require()` 정규식. `@/` 별칭, `.js`→`.ts`, `index.*`를 해석한다.
  - 경로 문자열 — `"src/…"`, `` `${…}/src/…` ``, `join/resolve("a","b")` 조각. 디렉터리를 가리키면 그 아래 전부로 잇는다.
  - public URL, CSS `@import`
- 진입점:
  - 운영: `src/app/**`의 page·layout·route·loading·error·not-found 등과 앱 아이콘, `/dev/**`·`/api/dev/**` 제외
  - dev: `/dev/**`·`/api/dev/**`
  - package 스크립트: `package.json`이 부르는 파일 5개
  - 시험: `*.test.*` 661개 + 오라클
  - 도구: tools·scripts에서 다른 파일이 import하지 않는 실행 파일 195개
- **범주 판정은 import 간선만 쓴다**(경로 문자열 간선은 소스 검사 시험의 디렉터리 순회 때문에 과대 연결됨). 데이터 파일은 경로 문자열 간선을 쓴다.
- 교차 확인:
  - knip 5: 미사용 파일 74 vs 자체 70 일치, 의존성 오탐 3건 확인
  - 열람 폐포: 서브에이전트가 별도 정적 import 스크립트로 415개를 산출했고, 범주 1·3과 100% 겹침을 확인했다(운영 413 + 데이터 2)
  - 생성·열람 경로 주장 중 핵심(`flags.ts`, `paidRuntime.ts`, `publish.ts` v4People, `runtimeBooks.ts`의 tests import, quarantine SQL)은 직접 grep으로 재확인했다
- 한계: 정규식 기반이라 문자열로 조립한 동적 경로는 놓칠 수 있다. 삭제 실행 때는 각 커밋에서 tsc·build·test로 다시 확인한다. 운영 env·DB 값은 보지 않았다.
