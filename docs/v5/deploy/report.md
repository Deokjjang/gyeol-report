# v5 배포 보고 (2026-11-06)

작성 2026-11-06 · 브랜치 `v5/final` → `v5/main` → `master` · Anthropic 호출 0 · OpenAI 코드·env 변경 0 · 카드 입력·실결제 0.

## 0. 배포 전 마지막 수정(v5/final, 호출 0)

| # | 결과 |
|---|---|
| 0-1 | 처리방침 6번 위탁 표·7번 국외 이전 표에 OpenAI 추가(Anthropic이 오래 장애일 때 임시본, 미국, 입력 정보·해석 근거·이전 리포트 겹침 방지 표현, 보유 = 남용 감시 기록 최대 30일 — OpenAI API 공식 문서 「Your data」 2026-11-06 확인, 우리 호출은 Responses API `store: false`). 법률 검토 7번 「표에 반영」 |
| 0-2 | 「단순 변심 환불은 어려워요」 → 「되지 않아요」. 주문서·상세 보기 원문·약관·환불정책·결제 전 고지·내 서재 문의 안내를 「단순 변심 환불(청약철회)은 되지 않습니다/않아요」로 통일 |
| 0-3 | 회원 주문서: 「주문 내용과 환불정책을 확인하고 동의해요」 + 「만 14세 이상」(약관·개인정보는 가입 동의). 비회원: 같은 환불 칸 + 「이용약관·개인정보 동의」 + 「만 14세 이상」. consentEvidence 확인 항목 일곱 개 그대로(ui v2에 칸별 덮는 항목, 회원은 `via: signup`), 결제 준비가 회원 배치 ↔ 실제 회원 대조 |
| 0-4 | 보상 B = 기준 시각 전 `auth.users`(익명·삭제 제외) − A − 덕짱님 계정 − ADMIN_USER_IDS, 시험 계정 목록 비움. 가입 미완료 계정 지급 → 가입 완료 뒤 서재(`ops_gift list`)·팝업 ② 시험 통과 |
| 0-5 | `POLICY_EFFECTIVE_DATE = "2026-11-06"` |
| 0-8 | 1+1 시작 2026-11-06 09:00:00 KST(끝 11-16 23:59:59 그대로). SQL은 기간을 갖지 않고 코드의 [시작, 끝)을 받음 — 시험으로 고정. 팝업 ① 「11월 6일 – 11월 16일」, 배너는 서버 시각으로 시작 전/진행 중 자동 |
| 0-6 | 임시 worktree 3개 제거(event·checkout의 미커밋 초안은 v5/final에 더 나중 판이 있어 `~/Developer/gyeol-worktrees/_removed-worktrees/*.patch`로 보관 후 제거). 커밋에 디버그 코드·비밀값·.cache·DB 덤프 0 |
| 0-7 | `tsc --noEmit` 0 · `pnpm lint` 0 오류 · `next build` exit 0 · 전체 시험: 기준 트리(916b0ce6) 31,616개 중 실패 853 / 지금 31,622개 중 실패 859, 차이 6 = 의도된 변경의 시험 표식 3(BookCheckout 소스 표식 `consents`→`effective` 2, 처리방침 「OpenAI 없음」 1 — 고침) + 부하 흔들림 3(bookPublicFlow 궁합·p6cScore·productionTestDataCleanupMigration — 단독 실행 두 트리 모두 통과). **신규 실패 0**. 관련 시험(final4 9파일·legal·주문서·이벤트·보상) 통과 |

## 1. 배포 전 운영 확인(읽기만, 2026-11-06 09:10 KST 무렵)

| 항목 | 결과 | 판정 |
|---|---|---|
| 1-0 전제 | `report_ticket_publication`·`report_tickets`·`report_ticket_grants` 있음, `book_generation_state` 없음(v5 미적용), 결제 복구 가격 목록 `o.amount not in (1290,1490)` 있음, `report_tickets_before_launch` 있음 | PASS |
| [R1] | quarantine_keeps_snapshot=true · clears_snapshot=false · read_quarantine_disabled=false(0번 적용 전) | PASS |
| [R1-b] | read_no_quarantine_ready=true | PASS |
| [R4] 고객 책(결제 주문 조인) | 1.0 3 · v1 1 · v2 4 · v4 5, 모두 COMPLETED, 내용 없음 0 | — |
| [R4] 고객 책(전체 스냅샷) | v1·1.0·v2 **8** · v4 **33**(결제 5 + 이용권 28), 모두 COMPLETED, 내용 없음 0, 만료 0 | PASS(기대 8·33) |
| [R5] 열람 격리 흔적 | 0행 | PASS |
| 대기 작업 | `report_generation_jobs` 13건 전부 COMPLETED, `report_ticket_redemptions` 28건 전부 COMPLETED | PASS(0) |
| 주문 | `payment_orders` paid 58 · ready 45(결제창만 연 주문) | 참고 |
| 롤백용 함수 지문 | `paid_report_reliability` md5 9260b70c…(26,322B) · `report_ticket_publication` 753c9b05…(4,828B) · `report_tickets_before_launch` 47feeb5d…(11,214B) · `report_tickets` 77e420d8…(927B, 감싸기) | 기록 |

[R4]를 결제 주문(`payment_orders.status='paid'`)과 조인하면 이용권 책 28권이 빠져 v4가 5권으로 나온다. 고객 책 41권(8 + 33)은 스냅샷 전체 기준이다.

## 2. 롤백 기준점(1-2)

- 운영 배포 `dpl_84CWqXBCu4UB6uNGmtmWt7Kh3o5P`(master `d846c2ea`, READY, 별칭 www.gyeolreport.com·gyeolreport.com).
- 태그 `v4-last` → `d846c2ea` push 완료.

## 3. migration 0~9 점검(1-3) — 「배포 전에 적용해도 지금 운영 중인 v4 코드(master d846c2ea)가 깨지지 않는가」

| 순서 | 파일 | v4 코드가 닿는 곳 | 판정 | 적용 시점 |
|---|---|---|---|---|
| 0 | `20261105130000_v5_final3_read_no_quarantine` | `paid_report_reliability('quarantine')` 무동작(행 변경 0). v4 열람 경로가 격리를 불러도 책을 바꾸지 않음 | 안전(오히려 보호) | 배포 전, 가장 먼저 |
| 1 | `20261029130000_v5_writer_jobs` | `report_ticket_publication` 교체: v4가 쓰는 claim·enqueue·publish·status와 입력 키 그대로(+recover). claim에 `v5Products`가 없으면 v4 경로. 새 열·표는 v4가 읽지 않음 | 안전 | 배포 전 |
| 2 | `20261104100000_v5_p6d_ops` | `payment_orders` 입력 트리거(`order_records` 1행, `on conflict do nothing`, service_role 권한 있음), `report_ticket_publication` 재교체(+defer, not_before가 null이면 그대로), 새 표 15개·함수(v4는 안 부름), 기존 주문 103건에 주문코드(legacy) | 안전 | 배포 전 |
| 3 | `20261104180000_v5_p6e_ops` | `report_tickets_before_launch` 본문 4곳 패치: `productScopes`가 없으면 예전과 같음(v4 지급은 `productScope` 하나만). 고칠 자리가 정확히 1번이 아니면 아무것도 안 바꾸고 멈춤 | 안전 | 배포 전 |
| 4 | `20261105090000_v5_final_payment_recovery_price_free` | 결제 복구 금액 검사 `not in (1290,1490)` → `amount<100`. v4 가격 1,490원에서 동작 같음. **v5 3,900원 주문 복구에 필수** | 안전 | 배포 전(필수) |
| 5 | `20261105091000_v5_final_comp_choice` | `ops_comp`만(v4는 안 부름) | 안전 | 배포 전 |
| 6 | `20261105120000_v5_final3_tickets_reading` | ① `report_tickets` 감싸기: 기한 없이 들어온 지급은 30일, summary에 `lots` 추가(v4 화면은 모르는 칸 무시). ② 열람 제약에 infinity 허용 + v5 스냅샷만 기한 없음 트리거(v4 발행은 v4라 그대로). ③ 기존 v5 책 기한 변경 **대상 0권**(운영 v5 책 0), 새 제약 위반 0행 | 안전(v4 화면 변화 없음, 그사이 v4가 만드는 기한 없는 지급만 30일) | 배포 직전(코드와 같은 창) |
| 7 | `20261105160000_v5_final3_writer_raw` | 새 표·함수만 | 안전 | 배포 전 |
| 8 | `20261106100000_v5_final4_event_comp` | `ops_gift` 상한 패치(v4는 안 부름), 새 표·함수 | 안전 | 배포 전 |
| 9 | `20261106180000_v5_final4_writer_raw_purge` | `ops_writer_raw` 교체만 | 안전 | 배포 전 |

배포 직후로 옮길 것: 없음. 적용 순서 = 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9(점검표 1-1절과 같음).

적용 방법: 운영 migration 기록 15건이 저장소 파일 버전과 다르게 적혀 있어(예전에 커넥터로 적용, 예 `20261011085143_v4_coupon_foundation` ↔ 저장소 `20261003123157`) `supabase db push`가 그대로는 쓸 수 없다(거절하거나 옛 migration 수십 개를 적용하려 함). 저장소 밖 임시 작업 폴더에 운영 기록 15건의 자리표 파일 + 적용할 파일 하나만 두고 `supabase db push --linked --include-all`(CLI, linked)을 파일마다 돌렸다 — CLI가 저장소 파일을 그대로 읽어 실행하고 기록에 **파일 버전·이름**을 남긴다. 저장소의 `supabase/config.toml`(`[db.migrations] enabled = false`)은 그대로 두고 임시 사본에서만 켰다.
