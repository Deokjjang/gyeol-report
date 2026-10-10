# V4 RELEASE FINAL QA 01

검증일: 2026-10-11. **Production 활성화 승인서가 아니다.**

| 항목 | 확인 |
|---|---|
| Base | `v4/launch-brand-kakao-01` · `1716645e1b43f1c1b2c866e27ca38cabd92f6319` |
| 작업 branch | `v4/release-final-qa-01` |
| 실제 Production | `master` · `4e26f2ec97e00e10b0d70ebdfc30e5893b547458` · READY |
| 범위 | 발행 P0 최소 수정, worker 등록 누락, 관련 회귀, 읽기 전용 운영 감사 |
| 변경하지 않은 것 | 가격, 계산, Auth/결제/환불 정책, 원장, 공개 gate, Production DB/배포 |
| 보호 경로 | 기존 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 보존·스테이징 제외 |

## 1. 지정 P0: 해결

안전한 재현용 가상 입력: 종합 / 준호 / MALE / 1989-09-21 / exact 17:40 / INTP / freelancer / 프리랜서 번역가 / single.

| 경로 | 실제 결과 |
|---|---|
| normalization → 계산 → MBTI/semantic bridge | 정상; 원국·MBTI를 바꿀 이유 없음 |
| 종합 manuscript C4 | `editorial:PERSONAL_RESONANCE:resonance:PR009` primary 미출력 |
| 원인 | `STRUCTURE_STYLE`의 명리 이유와 마무리가 같은 문장으로 실현됨. 문단의 중복 방지기가 필수 role을 동시에 유지할 수 없어 `PRIMARY_NOT_RENDERED` |
| 왜 보정되지 않았나 | 기존 `HUMAN_VALUE` registry에 해당 축의 긍정적 활용 문장이 빠져 있었음 |
| 최종 거절 | adapter가 실제 hard violation을 감지하여 `COMPREHENSIVE_MANUSCRIPT_UNSAFE` 반환. validator 오탐이 아님 |
| 최소 수정 | `narrativeHumanOutcome.ts`의 기존 registry에 STRUCTURE_STYLE 활용 문장 1개 추가 |
| 유지 | 필수 C1~C10/role/중복/unsafe/completeness 검사, 계산·직업 입력, 금융 복구 모두 그대로 |

수정 문장: “여러 일을 함께 맡아도 기준과 순서를 잡아두면, 빠뜨린 일을 뒤늦게 수습하는 수고를 줄일 수 있어요.”

회귀는 실제 renderer의 C4 primary, MYEONGLI_REASON/CLOSER, 문장 고유성, C10 존재, publication validator, snapshot JSON 재저장, 직접/공유 Book projection을 확인한다. 실제 Chrome에서도 이용권 발행 → Book → reload → 서재 → 공유 Book까지 완료했다. 빈 원고/강제 COMPLETED/validator 완화는 없다.

## 2. Bounded 발행 표본: 23건 중 21건 생성, 2건 안전 거절

`sixProductSale.test.ts` 기존 대표 6 + 기존 edge 4 = 10건 성공. 신규 `releaseContent.test.ts`의 지정 P0 1 + 신규 edge 12 = 11건 성공, 2건 거절. **자동 테스트가 초록이어도 발행 성공률 100%라고 보고하지 않는다.** 아래 거절은 명시적 재현 assertion으로 남겼고 성공 표본에 포함하지 않았다. 표본의 2/23은 일반 고객 실패율 추정치가 아니다.

| 상품 | 기존 대표/edge | 신규 approximate | 신규 unknown + MBTI unknown + 직업 없음 |
|---|---:|---|---|
| 종합 | 2/2 | PASS | **V4_CONTENT_INCOMPLETE** |
| Career | 2/2 | PASS | PASS |
| Love | 2/2 | PASS | PASS |
| Compatibility | 2/2 | PASS · managerReport | PASS · parentChild |
| Major | 1/1 | PASS · 14/14 | PASS · 14/14 |
| Annual | 1/1 | PASS · 12/12 | **DAYUN_UNCERTAIN** |

- 신규 종합 unknown: 1993-02-06, 시간·MBTI 모름, 직업 없음. planner 출력이 why/fortune/work/direction **4 section**뿐이고 현재 최소 5 section 계약을 못 채운다. 필수 분량을 줄여 통과시키지 않았다. sparse evidence의 적법한 section 배분 보강이 필요한 **잔여 콘텐츠 P0**다.
- 신규 Annual unknown: 1998-08-29. 대운 경계 불확실성으로 canonical input 단계에서 거절된다. 시주를 추측하면 안 된다. 생성 후 유실이 아니라 **구매 전 지원 범위/안내 확인이 필요한 P1**이며, unknown을 항상 지원한다고 광고하면 안 된다.
- 그 외 신규 DOB는 2002-10-09 / 1991-06-24 / 1987-12-03 / 1979-04-17. approximate는 YUSI, 알려진 MBTI는 INTJ/ESFP/INFJ/ENTP/ISTP/ENFJ. 궁합 B는 독립 입력, 역할 계약 유지.
- 성공 표본: 실제 계산/현재 V4 engine, externalCalls `[]`, publication validation, final/back/목차 anchor, serialization, snapshot 재열람/공유 projection 확인. Major 미래10/age/transition 및 Annual 월별 순서는 기존 `timeProduct`/Book 회귀도 실행했다.
- 저장·서재·공유는 PGlite 실제 SQL 회귀와 local Chrome 경로다. 실제 Production 저장 성공으로 확대 해석하지 않는다.

## 3. Commerce / Auth / Event

| 항목 | 이번 근거 / 한계 |
|---|---|
| 단품 1,490원 · 회원/비회원 | 기존 production prepare/launcher/소유권 회귀 PASS; 실제 PG 결제는 미실행 |
| 1/3/5/10장 | 서버 catalog 1,490/4,290/6,890/13,400 유지; 기존 동시 지급/재확인/계정 scope 회귀 PASS |
| 이용권 발행 | 실제 Chrome의 준호 Book 정상 완료·잔액 1장 소비·입력 복귀; SQL 실패/중복/lease/reversal 회귀 PASS |
| 환불 | 원래 결제단가 × 미사용 수량, refund_hold, 계정 lock, PG 확인 후 REFUND, 다른 lot/Book 보존 PASS |
| PostgreSQL 환불 | PG17.11, 11 시나리오 그룹, 독립 backend 290개, 최대 동시10, deadlock 0; 실제 coordinator + **주입 mock Toss**, 외부 금융 호출 0 |
| Google/Kakao | local opaque session/동의/계정별 권한 회귀 PASS. 실제 OAuth provider/리디렉션은 미검증 |
| Kakao 선택 안내 | 로그인과 분리, 채널 ID 없으면 숨김, 클릭 전 추가 성공 가정 없음. 자동 채널 추가 없음 |
| Share/brand | Book 공유/일반 공유/copy/SDK fallback 및 favicon/apple icon 관련 회귀; 실제 채널/메시지 발송 없음 |
| 이벤트 | earliest 2026-10-11 00:00 KST, exclusive end 2026-11-01 00:00 KST; 승인·활성 상태에서만 countdown |
| 무료 상한 | 신규 획득 1 + 추천 성공 1, 광고/추천 중복 방지, 추천인 평생 1회 및 A→B→C 보존 |
| 만료 | 무료권 공통 종료시각, 유료권 영향 없음, Book 생성일+90일 그대로 |
| 승인 | 캠페인 총예산 **미승인**, 공개/이벤트 활성화 안 함 |

## 4. 실제 Chrome 잔여 QA

`127.0.0.1:3112`의 기존 dev routes만 사용. 외부 origin을 CDP에서 차단했고 최종 시나리오의 runtime exception/외부 요청은 0. 아래는 과거 로그 재사용이 아니다.

| 항목 | 결과 |
|---|---|
| 390 / 430 / 768 / 1440 이용권 화면 | PASS, 수평 overflow 0, screenshot 직접 확인 |
| desktop 실제 200% | PASS. Chrome default zoom=2, outerWidth1440/innerWidth720/DPR2/visualViewport.scale1. pinch 대체 아님. 이후 zoom=1 복원 |
| 지급 지연 | PAID_PENDING_GRANT에서 잔액 미증가 → 같은 주문 복구 → 1회 지급 |
| 다중 탭 | 한 탭 지급 후 기존 다른 탭 잔액 자동 갱신 |
| 취소 | 모의 취소 뒤 추가 지급 0 |
| 환불 보류/철회 | 사용 가능 잔액에서 1장 제외, held=1; 철회 시 복구 |
| 계정 변경 | 서버 scope 변경 후 이전 잔액/내역 숨김 |
| 같은 이름 두 계정 | PASS(제한 명시): Chrome session 응답의 **displayName만 동일하게 주입**, 실제 로컬 두 계정·cookie·소유권·scope는 그대로. 타 계정의 준호 Book 미노출. 실서비스 OAuth 동명이인 로그인은 미실행 |
| 세션 만료 | 로컬 세션 cookie 제거 후 재검증, 기존 잔액 숨김·로그인 안내 |
| 입력 복귀 | 묶음 구매 → 준호 입력/주문서 복구, 구매 동의 자동 복구 없음 |
| 발행/서재/공유 | 수정한 실제 준호 Book 생성·reload·서재·뒤표지 공유링크·공유 Book 재열람 PASS |
| 모바일 safe-area | **FAIL/P1**: top47/bottom34 에뮬레이션에서 nav bottom844/button bottom839.5/뷰포트844, bottom padding0. 홈 인디케이터 영역 여백 미확보. 물리 iOS 미검수 |

safe-area는 이번 허용된 P0 코드 수정 범위를 넘어 Book 공통 layout에 영향을 주므로 임의 패치하지 않았다. 일반 viewport overflow PASS와 safe-area PASS를 혼동하지 않는다.

산출물: `/private/tmp/gyeol-release-browser/`

- `{390,430,768,1440}-ticket-store.png`
- `desktop-actual-200-percent.png`
- `390-paid-pending-grant.png`, `390-bundle-cancel.png`, `390-refund-hold-balance.png`
- `390-session-expired.png`, `390-same-name-different-owner.png`
- `390-restored-book-receipt.png`, `390-p0-published-book.png`, `390-library-p0.png`
- `390-safe-area-back-cover.png`, `390-owner-share-created.png`, `390-shared-book-open.png`
- `flows.json`, `same-name.json`, `reader.json`

최초 QA 스크립트의 상품 selector `PACK_1` 오기(실제 SINGLE_1), 페이지 전환 510ms보다 짧은 자동 클릭 대기는 임시 스크립트만 수정 후 재실행했다. 앱 결함이나 통과 근거로 세지 않았다.

## 5. Production catalog: 현재 실제로 확인한 것

Supabase `xscosaueqpatcqzbgkbl`, ap-northeast-2, ACTIVE_HEALTHY, Free, PostgreSQL **17.6.1.127**. migration history `[]`는 빈 DB가 아니다.

| 확인 | 실제 catalog |
|---|---|
| 기존 public tables | reports, payment_orders, report_input_snapshots, report_generation_jobs, report_generation_attempts, paid_report_snapshots, report_share_links |
| 구조 | 7 tables / 90 columns / 35 validated constraints / 29 indexes / 8 functions / 81 table grants / 1 policy / 비내부 public trigger 0 |
| RLS | 위 7개 모두 enabled, force=false |
| 신뢰성 RPC | 기존 만료2160h, 외부 호출 이력, consent evidence, one-call delivery 포함. worker 비용 predicate patch는 아직 없음 |
| RPC security | SECURITY DEFINER, `search_path=public, pg_temp`, timezone UTC, postgres/service_role EXECUTE |
| V4 회원/이용권/묶음/캠페인/추천 | 신규 테이블·ticket publication RPC 없음 |
| DB size | 13,724,819 bytes(약13.1MiB), catalog 크기 함수만 조회. 고객 row 조회 없음 |
| 확장 | pgcrypto1.3, uuid-ossp1.1, pg_stat_statements1.11, plpgsql1.0, supabase_vault0.3.1 |

읽기 결과는 `/private/tmp/gyeol-release-production-{metadata,schema}.json`. 함수 정의·컬럼 타입·FK·index·ACL·policy만 사용했고 PII/원고/결제키/secret 값은 수집하지 않았다.

### PG17 사전 적용

`scripts/verify-release-schema-postgres.mjs --isolated-local`은 명시한 임시 Docker 컨테이너의 image/network=none/tmpfs/no ports/no bind를 확인한 뒤 **새 DB만** 만든다. Production 연결 코드가 없다.

- catalog-only 구조 재현 → [runbook](v4-production-activation-runbook.md)의 **13개 forward SQL** 순서 PASS.
- cost patch 재적용 시 함수 MD5 불변, RLS 유지, ticket/bundle/refund 핵심 RPC anon/authenticated 실행 금지/service_role 허용 PASS.
- 별도 PG17 환불 동시성 검증 PASS.
- PG17.11은 운영17.6과 같은 major 검증이지 정확한 patch-level/platform 복제는 아니다.
- auth.users/auth.uid는 최소 stub. 실제 OAuth/Auth triggers/Vault/storage/실데이터 backfill/대용량 lock·WAL·소요시간은 보장하지 않는다. 운영 승인 전 실제 백업 복구 rehearsal 필요.
- 기존 destructive cleanup migration은 절대 자동 replay하지 않는다. Supabase migration 이력을 비웠다고 과거 full-body RPC 덮어쓰기를 반복하지 않는다.

## 6. Infra / 운영 설정

| 구분 | 확인 / 미확인 |
|---|---|
| Vercel | gyeol-report, Next.js, Node24.x. Production `dpl_7wQ9FyRseuHwvPv2pEa7Rhki9MH9`, master SHA 위와 동일, region iad1 |
| Domain | gyeolreport.com / www.gyeolreport.com 확인 |
| Preview | 기존 READY preview 확인. **이번 RC push 후 preview E2E는 별도 승인·접근 단계** |
| Runtime 거리 | iad1 ↔ Supabase 서울. 실제 latency/region 변경은 미측정·미변경 |
| Paid worker | route300s, 순차최대8, claim window45s, RSS1.25GiB admission |
| Ticket worker | route300s, 순차최대2, window30s, RSS1.25GiB, lease10분 |
| Cron | repo에 paid만 있어 ticket 매분 entry를 이번 branch에 추가. Production cron 활성/최근 실행은 metadata API로 확인 불가 |
| Cron plan | 실제 Vercel billing plan 조회 불가. 매분 Cron 가능한 plan 확인 필요([공식 계약](https://vercel.com/docs/cron-jobs/usage-and-pricing)) |
| Memory/Fluid | 실제 프로젝트 memory·Fluid·overlap 설정은 미확인. 코드 admission limit을 플랫폼 메모리 보장으로 간주하지 않음 |
| Supabase Compute | 현재 Free의 실제 부하/큐/connection 여유 미측정. 특정 Compute 등급을 충분하다고 확정할 자료 없음 |
| 용량 계획 | 90일 보관 × 일 발행수 × 실제 저장 snapshot 크기 + 금융 원장/index/WAL 여유로 산정해야 함. 13.1MiB 현재 DB만으로 이벤트 용량 판단 금지 |

이전 OPS-01의 약1GiB 로컬 generation RSS/처리량 모델은 참고일 뿐 이번 Production 부하 측정이 아니다. 처음부터 무료 대량 이벤트를 열지 말고 백업 가능한 운영 plan/실제 connection·메모리·큐 지연 검증을 승인받는다. 이번에 compute/region/plan/환경변수는 변경하지 않았다.

이번 성공 표본11건의 **직렬화 snapshot JSON**은 101,006~844,908 bytes, 평균376,470 bytes였다. 같은 표본 분포를 가정하면 하루100권×90일의 원문 합계 약3.16GiB, 하루1,000권이면31.56GiB다. 이는 **물리 DB 사용량이 아니다**: JSONB/TOAST 압축·중복 컬럼·index·금융 원장·WAL·보관 정책에 따라 달라진다. 실제 물리 저장량과 광고 유입 목표를 합쳐 plan을 승인해야 한다. 측정은 `/private/tmp/gyeol-release-snapshot-sizes.json`이며 개인정보/원고 대신 상품 ID·byte 수만 기록한다.

공식 Free 계약은 database500MB 제한과 disk1GB를 구분하고 database quota에서 read-only 전환될 수 있으므로 현재13.1MiB만 보고 출시 여유를 확정하면 안 된다([database size](https://supabase.com/docs/guides/platform/database-size)). Free 백업은 직접 export·외부 보관을 준비해야 한다([backup](https://supabase.com/docs/guides/platform/backups)). 승인 후 초기 부하검증 후보는 백업·용량을 확보한 유료 plan의 Micro부터 잡되, 실제 DB 부하 자료가 없어 충분한 Compute 등급이라고 확정하지 않는다([compute](https://supabase.com/docs/guides/platform/compute-and-disk)).

### 환경변수: 이름·target 존재만 조회

Production에 존재: `CRON_SECRET`, `REPORT_ADMIN_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAID_REPORT_RELIABILITY_ENABLED`, `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`, `TOSS_PAYMENTS_SECRET_KEY`, `TOSS_CONFIRM_API_ENABLED`, `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`, `NEXT_PUBLIC_META_PIXEL_ID`, `OPENAI_API_KEY`, `OPENAI_REPORT_MODEL`, `OPENAI_REPORT_WRITER_ENABLED`.

**미등록**: Auth client가 실제 읽는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; 선택 채널용 `NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID`.

값은 조회하지 않았다. 따라서 키의 live/test 조합, 만료, enabled 값, secret 정확성은 **미확인**이다. 현재 Book/Auth/bundle 공개 gate는 각각 서버 코드 `false`, 구매 정책 version=null, 자동환불=false다.

| Provider | 실제 출시 전에 확인할 계약 |
|---|---|
| Google/Kakao OAuth | Supabase provider 활성 여부·허용 scopes·Site URL/redirect allowlist·앱 승인/도메인. MCP 제공 metadata로 확인 못 함 |
| Redirect | provider → `https://xscosaueqpatcqzbgkbl.supabase.co/auth/v1/callback`; 앱 → 허용 origin의 `/auth/callback?flow=…`. wildcard 전체 도메인 허용 금지 |
| Kakao channel | JS key 존재와 앱-채널 연결/채널 ID는 다른 계약. 현재 채널 ID 없음은 선택 안내만의 blocker |
| Toss | merchant 판매 품목/카드·간편결제/부분취소/콜백도메인/live·test key pair·GET/POST 확인·응답 유실복구 별도 확인 필요 |
| 환불 운영 | 현재 mock 주입 coordinator만 있으며 실제 실행용 운영 경로/권한·SLA 승인 없음. provider client가 있다고 운영 READY 아님 |

## 7. 승인 결정표

법률 해석을 새로 확정하지 않는다. `LEGAL_CLASSIFICATION_REVIEW_REQUIRED`, `BUNDLE_PURCHASE_POLICY_VERSION=null` 유지. 다음은 운영자/법률 검토자에게 제출할 결정 항목이다.

| 결정 | 필수성 / 권장 검토안 | 담당 |
|---|---|---|
| 이용권 법적 분류 | 묶음 출시 필수. 자체 디지털콘텐츠 이용권의 실제 계약 구조 검토 | 사업자 + 법률 검토자 |
| 사용기한·탈퇴·서비스 종료 | 필수. 현재 NULL 만료를 영구 보장으로 쓰지 말고 미사용분 반환/이관 절차 확정 | 사업자 + 법률 |
| 일부 사용 / 법정 기간 이후 | 필수. 원래 구매단가 비례 환불 유지, 법정 권리와 추가 자발적 정책 구분 | 사업자 + 법률 |
| 결제수단별 반환 | 필수. 부분 취소/장기 경과/계좌수단/PG 불가 시 수동 반환 증빙 경로 | 사업자 + Toss |
| 고객 처리기한·휴일·검토자 | 필수. 문의 접수부터 PG 확인/원장 반영까지 담당·기한·대체 담당 확정 | 운영 책임자 |
| 최종 전문/consent version | 묶음 필수. UI/서버 저장 evidence와 같은 승인본 version | 사업자 + 개발 |
| 이벤트 전체 예산 | 이벤트 필수. 총 지급 한도와 승인자·중단 기준 명시; 임의 숫자 입력 금지 | 사업자 |
| Kakao 앱-채널 연결 | 선택 안내에만 필요; 로그인·결제 출시와 분리 | 사업자 |
| 메모리/쿼리 최적화 | 실제 부하에 따라 출시 후 개선 가능, 최소 용량·백업 확보는 출시 전 | 운영 + 개발 |

## 8. 잔여 blocker / owner / 다음 행동

| 등급 | 항목 | 담당 / 다음 행동 |
|---|---|---|
| P0 | sparse 종합 unknown 입력 4-section 거절 | 콘텐츠 개발: 재현 fixture 보존, 합법적 section allocation 보강 후 별도 회귀. gate 완화 금지 |
| P0 | Production V4 schema/RPC 없음 | DB 운영: 백업·13단계 계획 승인 후만 적용; 이번 실행 금지 |
| P0 | 실제 Toss 구매·취소/merchant 미검증 | 사업자+결제 개발: 별도 승인된 provider test 및 통제 실결제 |
| P0(이용권 공개 시) | Production ticket Cron 미연결 | 운영: RC config 반영·plan/secret/로그 확인 후 승인된 배포 |
| P0(묶음 공개 시) | 구매 policy version=null, 환불 운영 경로/승인 없음 | 사업자+법률+개발: 최종 정책 및 권한 있는 실행 절차 확정 |
| P1 | Auth public env 누락 / 실제 OAuth 미검증 | 운영: provider/redirect/키 존재 확인과 별도 실로그인 승인 |
| P1 | Annual unknown DAYUN_UNCERTAIN | 콘텐츠/UX: 지원 불가 경계를 구매 전에 안내하는지 확인; 시간 추정 금지 |
| P1 | 모바일 safe-area | UI 개발: navigation 여백 최소 보강 승인 및 물리 iOS 확인 |
| P1 | 이벤트 예산/활성 승인 없음 | 사업자: 한도 승인 전 PAUSED/SCHEDULED, 지급·광고 안 함 |
| P1 | 백업복구/DB·Vercel 용량·Cron 실제 운영확인 | 운영: runbook 순서로 증빙 확보 |
| P1 | TypeScript 기존390 | 개발: app/runtime 진단과 test-fixture/legacy 진단 분리 triage. 신규0은 전체 타입 안전 보장 아님 |
| P2 | 선택 Kakao channel ID 없음 | 사업자: 앱-채널 연결 승인 시 설정. 미설정 숨김 유지 |
| P2 | dev-only SQL 추적 build warnings | 개발: 별도 정리. 이번 runtime/fixture 대형 리팩터링 제외 |

## 9. 검증 집계와 한계

| 검사 | 이번 결과 |
|---|---|
| Account/payment/refund/ledger/campaign/referral/share + 6상품/원고 + checkout | **957 PASS / 0 FAIL / 2 SKIP**, 69 files PASS/2 skipped |
| V3/V2·public runtime·gate·Book 추가 회귀 | 최종 **115 PASS / 0 FAIL**. 최초114 PASS/1 FAIL: 기존 source assertion이 새 authEnabled 계약과 SSR session 대기를 놓침. 실제 runtime 변경 없이 테스트를 갱신, 해당 파일32/32 재실행 PASS |
| Countdown/Kakao/Share 상호작용 + 최종 P0 재실행 | 29/29 PASS. 신규 별도16 + 앞 집계와 중복되는 releaseContent13 |
| 고유 최종 Vitest 결과 | **1,088 PASS / 0 FAIL / 2 SKIP**. 재실행 중복 제외. 안전 거절2건을 발행 성공으로 세지 않음 |
| 성능 skip | paidWorkerCapacity / paidWorkerMeasurement opt-in. 이번에 과거 성능 실험을 무의미하게 재실행하지 않음 |
| PostgreSQL17 | schema chain13 PASS; 별도 refund11그룹 PASS. Vitest 개수에 더하지 않음 |
| lint/build | PASS. sandbox build 무출력 대기만 종료하고 동일 명령 로컬 권한으로 완료. 미수정 dev SQL 모듈의 Turbopack trace warning12개 유지 |
| TypeScript | baseline390/현재390/신규0, 진단 경로·행과 union 순서 정규화 대조. `tsc` exit2 |
| diff-check | PASS |
| 실행하지 않은 것 | 전체6천+suite, 실제 OAuth/Toss/채널추가/Production CRUD·migration·배포, 실제 이벤트 예산소진 |

결과 파일: `/private/tmp/gyeol-release-{regression,v3-gates,activation-final,final-targeted,lint-final,build-final,tsc-final2}.log`, `/private/tmp/gyeol-release-schema-result.json`, `/private/tmp/gyeol-release-refund-pg17/postgres-concurrency.json`.

재현 명령은 `pnpm exec vitest run tests/unit/account tests/unit/payment tests/unit/sharing tests/unit/app/ticketCheckout.test.tsx tests/unit/app/ticketOwnerRoute.test.tsx tests/unit/interpretation-v4/releaseContent.test.ts tests/unit/interpretation-v4/sixProductSale.test.ts tests/unit/interpretation-v4/timeProduct.test.tsx tests/unit/interpretation-v4/manuscriptSafety.test.ts tests/unit/interpretation-v4/manuscriptHumanClosure.test.ts --maxWorkers=2 --testTimeout=30000 --hookTimeout=60000`.

추가 회귀: `tests/unit/interpretation-v3/v2Regression.test.tsx`, `tests/unit/api/paidReportProductionRuntime.test.ts`, `tests/unit/app/releaseActivation.test.tsx`, `tests/unit/app/bookPublicFlow.test.tsx`, `tests/unit/app/dev/bookRuntime.test.tsx`.

## 10. 출시 판단

| 항목 | 값 | 이유 |
|---|---|---|
| DIRECT_REPORT_READY | NO | 잔여 종합 입력 blocker + 실제 PG/운영 검증 없음 |
| MEMBER_AUTH_READY | NO | Production Auth 설정/키/실로그인 미완료 |
| TICKET_REDEMPTION_READY | NO | Production schema/worker 없음 |
| BUNDLE_SALES_READY | NO | 정책 승인·schema·PG 미완료 |
| REFUND_OPERATIONS_READY | NO | 실제 실행 경로/담당·SLA·provider 검증 없음 |
| CAMPAIGN_READY | NO | schema/예산/활성 승인 없음 |
| REFERRAL_READY | NO | schema/Auth/이벤트 예산 미완료 |
| PRODUCTION_MIGRATION_PLAN_READY | YES | 현재 catalog와 의존성, 격리PG17 순서 검증. 적용 승인은 별개 |

이번 RC는 **출시 준비 감사용 후보**이지 즉시 판매 가능한 승인본이 아니다. fetch 기준 `origin/master...HEAD`는 behind0/ahead10(base 상태), 현재 master는 ancestor라 기술적으로 FF 가능하다. 이후 master 변경 시 재확인해야 하며 실제 merge하지 않았다. 이번 커밋 SHA는 최종 응답과 branch tip에 기록한다(자기 자신 SHA를 문서 안에 쓰는 순환 갱신 없음).

현재 Production 대비 V4 회원/서재/이용권/묶음·환불/캠페인·추천 schema, Auth env, 별도 ticket worker, 공개 gate의 승인된 활성화가 필요하다. **브랜치 push가 이 준비를 대신하지 않는다.**

```
CONTENT_P0_RESOLVED: YES (지정 준호 재현; 새 sparse-input blocker는 남음)
RELEASE_CODE_READY: NO
PRODUCTION_SCHEMA_READY: NO
OPERATOR_APPROVALS_COMPLETE: NO
PRODUCTION_ACTIVATION_RUNBOOK_READY: YES
PUBLIC_SALES_READY: NO
PRODUCTION_ACTIVATED: NO
```
