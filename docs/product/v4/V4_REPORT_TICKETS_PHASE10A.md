# Phase 10A — 리포트 이용권 원장

- Branch `v4/rebuild`, base `333f5cfc16447554e1b8db79ae130e2bf600b179`.
- 고객 계약: **리포트 이용권 1장 = 현재 6상품 중 1권**. 유료 가격 1,290원 변경 없음.
- Production 지급/마이그레이션/Auth/Book 활성화/배포 없음. 쿠폰·추천·이벤트 자동 지급·bundle·gift 미구현.

## 1. 기존 commerce 감사 / 가장 작은 연결

| 질문 | 실제 source / 결론 |
|---|---|
| 무료도 기존 생성 가능한가? | `generateProductReport`, `generateV4ShadowReport` 자체에는 결제 호출 없음. 계산/문장/validator 재사용 가능. |
| payment order 없이 기존 DB 발행 가능한가? | 이전 `paid_report_snapshots.order_id NOT NULL`, `paid_report_reliability`의 paid order join 때문에 불가능했음. |
| paid-only 경계? | `paid_report_reliability` SQL confirm/claim/finish/read, TS worker의 Annual acceptance, `validateNewProductPublication`의 버전 검사. 이 결제 검증은 그대로 유지. |
| 최소 변경? | 기존 TS worker의 생성→완전성 검증→snapshot 부분만 `generateReportSnapshot`으로 추출. paid worker와 ticket 내부 흐름이 같은 함수를 사용. snapshot에 payment order **또는** ticket origin 중 정확히 하나만 허용. |
| 가격/취소/환불? | `reportProductCatalog` 그대로. 실제 Toss/checkout success/환불·취소/guest 결제 코드 변경 없음. 이용권 복구는 금융 환불이 아님. |
| Auth/소유권? | 9B verified session/current consent, 9C `report_account_links`를 사용. 이메일·클라이언트 user ID로 권리 판단하지 않음. |

`access.mode=paid`는 기존 전체 본문 unlock 직렬화 형식만 유지한다. Toss 승인·0원 결제·가짜 payment order는 만들지 않는다. 실제 생성 원천은 `ticket_redemption_id`와 `ticket-fulfillment-v1`에 기록한다. 아직 public 읽기/공유/worker를 이용권에 활성화하지 않는다.

## 2. 원장 / 지급 / 사용 / 역이벤트

| Table | 최소 계약 |
|---|---|
| `report_ticket_grants` | 사용자, 수량, source type/ref, idempotency key, 사유, 지급시각, 명시적 만료 또는 NULL, optional 단일 product scope |
| `report_ticket_ledger` | GRANT +N / REDEEM -1 / REVERSAL +1 / EXPIRE -N. 사용자·lot·report·redemption·product·사유·key·시각 추적 |
| `report_ticket_redemptions` | 요청 ID와 입력 hash, 원천 버전, 실제 server 검증 동의 evidence, report, RUNNING/COMPLETED/REVERSED, lease, 실패 코드 |

- grant/ledger는 UPDATE/DELETE 권한 제거 + append-only trigger. balance 컬럼/cache 없음.
- 동일 source type/ref는 전체에서 1회, 동일 user/idempotency key도 1회. 다른 계정으로 같은 원천을 재지급하지 못함.
- 같은 사용 요청은 다시 생성/차감하지 않음. 다른 입력/product로 같은 요청을 재사용하면 conflict.
- 같은 redemption의 REDEEM/REVERSAL 각각 unique. 복구는 원래 lot에만 적립.
- fixture grant는 `grantTestReportTickets` 또는 로컬 SQL test뿐. 가입/로그인/서재 방문 시 자동 지급 0.
- 완성된 책의 자동 reversal은 거절. 운영자 보상은 향후 별도 승인된 수동 지급/감사 절차가 필요하며 admin UI/API는 만들지 않음.

## 3. 잔여 수량 / 만료 / FEFO

- 유효 lot의 ledger delta 합계가 유일한 잔여 원천. projection을 재구축할 필요조차 없음.
- 기간을 새로 정하지 않음: `expires_at=NULL` 또는 지급자가 명시한 deadline.
- 소비 순서: expires_at 오름차순 → 지급시각 → lot ID. NULL 만료는 뒤.
- 계정 단위 DB advisory transaction lock (9B와 구분한 namespace 10)으로 지급/사용/만료/발행/복구 직렬화. **lock을 획득한 뒤 현재 시각**으로 만료 판단.
- EXPIRE는 해당 lot의 남은 수량만 기록. 만료 뒤 실패 복구되면 REVERSAL 후 즉시 EXPIRE되어 원래 기한이 늘어나지 않음.
- ledger insert guard가 lot의 0 이하 과소/지급량 초과 합계 및 잘못된 report 원천을 거절.
- 상품 scope는 nullable(all)/canonical 1상품만 지원. 이번 UI 기본권은 6상품 동일 1장.

## 4. 생성 / 실패 회복

`서버 회원+동의 확인 → canonical 입력 검증 → 원장 REDEEM → 동일 생성/validator/snapshot → 발행+9C 소유권 원자 확정`

| 실패/재시도 | 결과 |
|---|---|
| 입력/동의 실패 | 차감 전 거절 |
| generator 예외 / validation / completeness 실패 | REVERSAL, 책 없음 |
| persistence 실패 / 실제 ownership unique 충돌 | 전체 발행 transaction rollback, REVERSAL |
| commit 성공 후 응답 유실 | reverse RPC가 이미 COMPLETED임을 확인, 복구하지 않음 |
| DB 자체가 잠시 불가 | 성공/복구를 허위 안내하지 않고 RUNNING. 동일 요청 재확인 가능 |
| worker 중단 | 기존 worker와 같은 10분 lease. 다음 summary/history/redeem/reconcile에서 원자 복구, 늦은 publish는 차단 |
| generation/publish/reversal 재시도 | 기존 report/state 반환. 중복 차감/책/복구 없음 |
| logout | 차감 직전 세션 재확인. 이미 승인된 원자 사용은 원래 사용자에 귀속; 로그아웃을 복구 근거로 쓰지 않음 |

복구 확인이 필요한 모든 operation은 **같은 계정 lock → redemption/report lock** 순서다. 입력은 성공/복구 시 지운다. 성공 시 입력 hash·동의 evidence·원장·원천만 감사 기록으로 남긴다.

독립적인 약한 report generator는 없음. 버전별 validator는 그대로: V3 paid default는 `validateNewProductPublication`, V4 local은 기존 `validateV4Publication`. 로컬 ticket engine에는 별도로 development/test gate가 있고 public API에서 redeem을 노출하지 않는다.

## 5. 9C 서재 / 90일 / V3

- 유효 발행, snapshot 저장, `report_account_links(link_source=ticket)`, 완료 전환이 한 transaction. 실패 report는 서재에 안 보임.
- 목록은 metadata만. paid/guest 소유권 목록 + 본인 ticket 목록을 합침. ticket 본문 read도 본인 session과 9C link/revocation 검사.
- 기존 `paid_report_snapshots_access_expiry_check`의 **첫 유효 발행부터 2160시간**을 그대로 적용. 기존 expiry job이 ticket 결과도 정리하고 trigger로 이름을 지움.
- report의 90일 만료/비활성화/소유권 revoke는 이용권 복구가 아님. 사용 기록을 영구 소진 상태로 보존. audit FK 때문에 보고서 hard delete로 사용 이력을 지울 수도 없음.
- V3 재생성/업그레이드 없음. 기존 paid/share access와 payload/문장 hash 회귀 유지.
- 내 서재에는 `리포트 이용권 0장/1장/6장`의 작은 요약만 추가. bundle 버튼/전체 내역 dashboard 없음.
- internal receipt의 회원에게만 결제/이용권 방법 표시. 이용권 선택 시 가격 위치도 `리포트 이용권 1장`; 유료 방법은 기존 1,290원. 기존 필수 동의는 유지.

## 6. 보안 / SQL 권한

- RLS 모든 새 table ON. anon/authenticated의 direct read/write/RPC execute 모두 거절; 본인 read는 서버 getUser/current consent 후 own-user RPC로만 제공.
- 새 함수는 SECURITY INVOKER, search_path 빈 값. PUBLIC execute 및 default table grants 회수. ledger/grant 서비스 권한은 select/insert만.
- auth.users는 id SELECT만 추가; 잠금을 위해 Auth identity UPDATE 권한을 부여하지 않음.
- client user_id/ownerId/quantity/source_type 금지. redeem POST exact Origin, bounded body, current session 재확인. 응답 private no-store/Vary Cookie.
- grant 함수 자체는 internal service SQL용. public `/auth`에는 summary/history만 closed gate 뒤 준비됨. local fixture는 loopback+development+회원+Origin 필수, 정해진 시나리오만; quantity/임의 사용자 입력 없음.
- local 실패 주입은 실제 validator를 끄지 않고, 완성본의 persistence 실패를 흉내 내어 정상 reversal RPC를 검증한다.
- [Supabase RLS/grants 문서](https://supabase.com/docs/guides/database/postgres/row-level-security)를 확인해 최소 권한을 적용. 연결된 Production advisor/DB는 호출하지 않음.

## 7. 검증 / 화면

| 검증 | 결과 |
|---|---|
| 로컬 SQL | PGlite에 기존 schema/paid expiry patch → 9B → 9C → 10A 순서 실행. service_role 권한으로 실제 RPC |
| 원장 | grant/중복/합계재구성/FEFO/scope/expiry/복구/retry/lease/음수방지/RLS |
| 충돌 | 1장에 서로 다른 2요청 중 1회만 성공. 동일 요청 1회. ownership DB 충돌 rollback. 발행 응답 유실에서도 소비 유지 |
| 6상품 | 각각 1장 생성→기존 gate→snapshot→9C owner→library. 본문/evidence 동일. Major 14/14, Annual 12/12 |
| 궁합 | 연애 + parentChild(A=부모) + managerReport(A=상사) 실제 runtime |
| Browser | 100 PASS; 390/430/768/1440, 0/1/여러장, 선택/확인/실패복구/생성/서재/타인차단/guest 옵션 없음 |
| Visual | overflow 0, runtime/console/hydration error 0. 실제 screenshot 확인: receipt/실패 안내/서재 1권·6권 |

최종 검증(현재 코드에서 실제 실행):

- 관련 auth/library/payment/paid delivery/report/sharing/V4/Book regression: **260 files / 4,231 PASS / 0 FAIL**. 이 중 이용권 신규 테스트 31건.
- `pnpm lint`, `pnpm build`, `git diff --check`: **PASS**.
- TypeScript: baseline **390 → 390**, 신규 진단 **0**. 기존 오류를 지웠거나 전체 typecheck가 깨끗하다는 뜻은 아님.
- 최종 새 로컬 SQL/browser 세션: **100 PASS**. 개발 DB에서만 테스트 지급/실패 주입. 외부 리소스/결제/AI 호출 없음.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/` 원래 내용/hash 유지, 커밋 제외.

스크린샷/결과: `/tmp/gyeol-v4-10a/` (`390-zero.png`, `390-one.png`, `390-selection.png`, `390-restored.png`, `390-consumed.png`, `390-six-books.png`, `1440-six-books.png`, `browser-results.json`).

```sh
TICKET_REVIEW_EXPORT=/tmp/gyeol-v4-10a pnpm test tests/unit/account/tickets.test.ts
# Fresh local dev server at 127.0.0.1:3189; no external provider/writer.
BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-tickets.mjs
```

## 8. Production 적용 순서 / 남은 제한

1. 기존 reliability/first-publication/expiry prerequisites 별도 검토.
2. 준비된 9B account → 9C library → `20261003114045_v4_report_tickets.sql` 순서. **이번에는 적용 안 함**.
3. 실제 staging PostgreSQL 복수 connection/process race 및 advisors 검사. PGlite의 Promise 경쟁은 실제 SQL 제약 검증이지만 복수 connection 부하 시험은 아님.
4. 별도 승인 후 production job scheduling/reconciliation, ticket-origin read/share dispatch, 법적 동의/복구 안내, Auth/Book activation 검수. 현재 gate는 OFF이며 ticket generation에는 dev/test 방어가 추가됨.
5. 동의/원장 감사 기록의 보존기간·계정 삭제 운영 정책 별도 검토. 이번에는 지갑/결제 기록을 임의 삭제하지 않음.

Production 준비가 끝났다고 주장하지 않는다. 특히 백그라운드 scheduler는 추가하지 않았고, 사용자가 돌아오지 않은 중단 작업은 internal reconcile을 실행하기 전까지 RUNNING audit 상태다. 잔여 조회 시 복구되어 영구 차감되지 않는다. 공개 cron/자동 지급/운영자 화면은 이번 범위 아님.

향후 promotion/referral/bundle purchase는 **별도 승인된 원천 검증 → 동일 grant RPC + 고유 source_ref**에 붙일 수 있다. 자동 hook, 판매 UI, 할인/이벤트 규칙은 만들지 않았다.

STOP: 쿠폰/referral/bundle/Production 작업을 시작하지 않는다.
