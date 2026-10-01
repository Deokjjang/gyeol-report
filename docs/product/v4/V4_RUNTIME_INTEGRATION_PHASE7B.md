# V4 Phase 7B — shadow runtime integration

기준: `95763b32053802f6b67154fb87149f329c058166`, `v4/rebuild`.

**지금 이 commit을 master에 merge해도 고객이 V4를 받을 수 있는가? NO.**

V4 생성기·projection·renderer는 공개 route/worker가 import하지 않는다. 새 환경변수, feature flag, API parameter, migration은 없다. 아래 PASS는 **명시적인 local shadow 호출**의 결과이며 Production 활성화/배포를 의미하지 않는다.

## 1. 실제 기존 runtime

| 경계 | 실제 source / 보존 계약 |
|---|---|
| 입력/preview | `src/app/report/new/page.tsx` → `src/app/api/reports/create/route.ts` → `generateProductReport.ts` |
| 입력 계산 | `reportInputAdapter.ts` → `productGenerationDispatcher.ts`; Comprehensive/Career/Love/Compatibility/Major/Annual 기존 generation handlers |
| 현재 고객 생성 | `generateProductReport.ts`의 6상품 V3 분기. 현재 form input은 V3, 과거 unversioned/V2 입력은 기존 legacy 동작 유지 |
| 결제 경계 | `api/payment-checkout/prepare`, `api/payment-orders/create-ready`, `api/payments/toss/confirm` → `confirmPaidReport`; immutable server input snapshot으로 작업 생성 |
| paid worker | `api/internal/report-jobs/route.ts` → `runPaidReportJob` → input/annual acceptance 검증 → generation → publish gate → snapshot → `finish_job` |
| reliability | `paidReportReliability.ts`, `paidReportReliabilityStore.ts`; lease/attempt/one-call/retry/recovery/quarantine/attention 정책 유지 |
| 저장 | `createProductPreviewSnapshot` → `paid_report_snapshots.snapshot_json` JSONB; `gate_version=paid-report-v1`, first-publish + 2160시간 expiry 유지 |
| direct | `/reports/[reportId]/page.tsx` → `readPublishedReport` → 기존 version별 validator/renderer |
| full share | `reportShareStore.ts`: published/unexpired/paid snapshot 확인 → unique `report_share_links.report_id` → `/r/[token]`에서 동일 direct page 사용 |
| legacy 공유 | `/r/[token]`의 기존 legacy access-token 경로도 변경 없음 |

SQL 검토: `20260920163924_production_reliability_reconcile.sql`, 기존 quarantine/payment recovery/publication expiry/external call guard patches, `20260929113608_report_share_links.sql`. 이 파일은 **읽기 및 PGlite 로컬 실행만** 했으며 수정하지 않았다.

## 2. adapter와 version 계약

| 새 모듈 | 책임 |
|---|---|
| `runtimeShadow.ts` | server-only 6상품 adapter. 기존 input normalizer/계산 handler/composer 사용. 명시적 `evaluatedAt` 필수. 외부 writer 없음 |
| `runtimeProjection.ts` | server-only allowlist projection, frozen snapshot 검증, JSONB key 순서와 무관한 integrity digest |
| `runtimeTypes.ts` | calculation/proof import가 없는 JSON customer DTO |
| `V4ShadowReportView.tsx` | 기존 cover/reading/table/share 컴포넌트와 CSS 재사용. 공개 route에는 연결하지 않음 |

`generateV4ShadowReport(payload, clock)` 또는 `runV4ShadowJob(localStore, clock)`를 **서버 코드/테스트가 직접 호출**해야만 V4가 생성된다. payload의 `reportVersion`, `contentVersion=v4`, `mode=shadow`는 활성화 수단이 아니다.

기존 worker/read/share 함수에 내부 validator 인자를 추가했다. 기본값은 기존 V3/legacy validator 그대로다. HTTP handler는 이 인자를 읽거나 전달하지 않는다. shadow도 동일 worker의 claim → annual 구매계약 확인 → attempt → gate → snapshot → finish를 통과한다. 별도 queue/retry/payment service나 V3 rescue는 만들지 않았다.

## 3. snapshot / projection

| 영역 | 저장 내용 | 고객 전달 |
|---|---|---|
| draft | `productType`, `version=v4-runtime-shadow-1`, `productVersion/reportVersion=v4`, headline/opening/sections/finalLine | allowlist 전체 |
| 상품 구조 | Love 상태; Compatibility 이름/역할/category/양방향; Major 14개년/나이/대운/세운/theme/전환; Annual selectedYear/12개월/theme/time | 사람이 읽을 필드만 |
| evidencePacket | `version=v4-runtime-evidence-1`, shadow mode, normalized input, 원 composer packet, material/proof/sourceRefs, 계산, natal tables, MBTI tables, generatedAt, digest | 전달하지 않음 |
| table projection | canonical natal table + 기존 MBTI DB의 **생성 시 저장된** table; 원국/지장간 가중 오행 | natalEvidence/활용포인트 제외. 계산은 본문에서 역추출하지 않음 |

- **DB migration 불필요**: 기존 JSONB envelope와 SQL gate를 6상품 모두 실제 local SQL로 통과했다. `paid-report-v1`은 발행 프로토콜 버전이지 narrative 버전이 아니다.
- V4를 기존 V3 draft인 척 저장하지 않는다. 저장된 `productVersion=v4`가 독립 계약이다. 기존 `ProductPreviewSnapshotDraft` legacy union은 확장하지 않고, generic worker의 기존 unknown-draft 경계에서 metadata envelope를 재사용한다.
- reader는 저장된 composer 결과를 allowlist projection만 한다. composer, 역법, 월운을 다시 실행하지 않는다. V2/V3 snapshot은 shadow projection이 거부하고 기존 reader가 계속 담당한다.
- digest는 accidental truncation/tamper 검출용이며 인증 서명/접근권한을 대신하지 않는다. 권한·만료·발행 여부는 기존 store/share 계약이 담당한다.
- Major evaluatedAt/14년 horizon/실제 전환 시각과 범위, Annual currentDate/selectedYear/purchase policy instant/전체 Jie segments 및 provenance를 저장한다. 날짜를 2038년으로 바꿔도 본문 projection은 동일하다.

## 4. 발행 gate

| 대상 | 검사 |
|---|---|
| 공통 | product/version/clock/input 일치, seal, exact allowlist, opening/본문/마지막 문장, 중복 section, editorial Blocker/Major, 내부 source 문자열 |
| Career | current/money/roles/study/direction 존재 |
| Love | 6개 기존 상태; current/home/parenting/direction/fortune, 저장 input 상태와 일치, 솔로/기혼 금지 전제 |
| Compatibility | 7 category, fixed A/B roles, 실제 person ID 기반 방향, 양방향/좋은 힘/마찰/화해, numeric score/grade/percent 없음 |
| Major | 14/14, 미래 10, 연속 연도/계산된 나이·cycle·연운 일치, substantive blocks, 모든 전환 section/시각 보존 |
| Annual | 12/12, 1~12 순서, 선택연도/시각, dayun-cross/fortune/final, canonical `annual-month-jie-kst-v2`, 연속 segment 구간, 월별 provenance와 본문 일치 |
| 표 | 출생시각 precision/기둥 일치, unknown hour 비생성, person별 MBTI table 일치 |

missing final / Major 13년 / Annual 11개월 / 역할 누락 / 미지원 선택연도 / 잘못된 context / nested proof leak / numeric score를 거부한다. 실제 worker에 missing-final 결과를 주면 기존 3회 attempt 이후 `FAILED_REQUIRES_ATTENTION`, snapshot null이다. 부분 발행/몰래 V3 fallback 없음.

## 5. local E2E와 노출 차단

`runtimeShadow.test.tsx`는 기존 `paidDeliveryCompleteness.test.tsx` 방식의 PGlite fixture를 재사용한다. 실제 SQL 파일들을 ephemeral memory DB에 적용하고 confirmation transport/Supabase SDK만 mock한다.

input → canonical calculation → V4 composer → gate → 기존 worker/snapshot → SQL JSONB → 기존 read/공유 store(명시적 V4 validator) → projection → SSR → 공유 본문 비교.

- 6상품 direct/shared HTML 및 모든 문단·순서·final 동일. 공유 unique token 재발급 idempotency 유지.
- `/r/{token}`를 구성하는 기존 token lookup/store는 검증했다. **공개 route 자체에 V4 분기를 넣지는 않았다**. shadow validator를 생략한 실제 share reader는 V4를 거부하고 direct reader는 기존 quarantine 정책을 따른다.
- 모든 7 category 및 A/B swap invariant/방향 반전, 부모/자녀·상사/팀원 역할 유지.
- exact / approximate / unknown, MBTI unknown 및 Love 6상태 검증.
- query/cookie/header가 실제 internal worker handler의 기본 호출 인자를 바꾸지 못함. public payload의 V4 hints도 기존 생성 결과를 바꾸지 못함. 명시적으로 잘못된 `contentVersion=v4`는 V4를 선택하지 못함; legacy 동작을 새로 V3로 변경하지도 않음.
- source guard: 공개 app/worker/share 경로가 shadow adapter/projection/view를 import하지 못하게 잠금. 기존 offline import guard는 새 shadow view의 **type-only DTO import 한 줄만** 예외로 허용.
- 로컬 Next 16 임시 harness에서 실제 client hydration 확인. 6상품 모두 제목/모든 본문/section 순서/final 유지, console/page error 0, 공유 1개, footer 0, 390/768/1440 overflow 0. 초기 barrel-import의 node:fs client 유입은 직접 component import로 해결.
- production build 및 임시 client chunks에서 V4 composer/material/proof runtime 없음. Next/React 스킬의 server/client 경계·직접 import 원칙 적용.

## 6. readiness matrix

모든 열은 shadow/local 범위다. `기본 노출 PASS`는 **V3 기본값 유지 및 V4 차단**을 뜻한다.

| 상품 | 생성 | packet | 직렬화 | gate | snapshot 호환 | server projection | direct render | shared render | completeness | 기본 노출 |
|---|---|---|---|---|---|---|---|---|---|---|
| Comprehensive | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Career | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Love | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Compatibility | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Major | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS (14/14 + 미래10) | PASS |
| Annual | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS (12/12) | PASS |

## 7. 검증 및 남은 경계

- 신규 shadow suite: 40 PASS. 실제 HTTP worker 노출 차단 포함 관련 API suite와 합계 48 PASS.
- V4/V3/payment/sharing/API/saju/knowledge/tables/generation 관련 regression: **245 files / 4,417 PASS / 0 FAIL**. Phase 7A의 66 narrative/evidence hash도 유지.
- `pnpm lint`, `pnpm build`, `git diff --check` PASS. build는 writer/reliability 실행 비활성화; deploy 아님.
- standalone tsc: **기존 389건 → 389건, 신규 진단 0**. 두 기존 진단의 union 표시 순서만 달라짐. clean tsc라고 보고하지 않음.
- 재현: `V4_SHADOW_EXPORT=/tmp/gyeol-v4-7b pnpm test tests/unit/interpretation-v4/runtimeShadow.test.tsx tests/unit/api/paidReportProductionRuntime.test.ts`.
- 로컬 증빙: `/tmp/gyeol-v4-7b/`의 6개 customer JSON/SSR HTML, `browser-results.json`, `*-hydrated.png`. 저장소에는 temporary route/env/DB 파일 없음.

Phase 7B shadow blocker 없음. Production 활성화는 **의도적으로 BLOCKED**이며 별도 승인이 필요하다. 다음 단계에서 명시적 서버 rollout 선택, 저장 version별 공개 read/renderer 분기, direct/share 동시 연결, 기존 snapshot 공존·실패 운영 정책 및 실제 운영 환경 호환성 검증 순으로 진행해야 한다. 이번에는 Production schema를 조회하거나 V4 snapshot을 쓰지 않았으므로 운영 DB의 현 상태까지 검증했다고 주장하지 않는다.

UI redesign / V4 activation / master merge / Production deploy는 수행하지 않는다.
