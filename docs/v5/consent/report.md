# 광고 측정 동의 방식 변경(결정 A) — 보고

작성 2026-11-09 · 브랜치 `v5/consent-01`(기준 v5/main `dc5dc158` = master `05f7f592` + 문서 정정) · worktree `~/Developer/gyeol-worktrees/v5-consent` · **운영 반영 안 함**(migration·push·배포 모두 승인 대기)

## 1. 결정과 동작

덕짱님 결정 A: 개인 식별 정보 없는 행태정보 이벤트(PageView·ViewContent·InitiateCheckout·Purchase)는 **기본으로 보내고**, 「광고 설정」에서 **거부한 사람에게는 보내지 않는다**. 이메일·전화 해시 등 개인 식별 정보는 **명시적으로 동의한 사람만**. 처리방침 행태정보 항목을 고치고 동의 버전은 올리지 않는다(문서 개정 공지).

| 이벤트 | 기본(설정 기록 없음) | 거부 | 선택 동의(로그인한 채 동의) |
|---|---|---|---|
| PageView·ViewContent·InitiateCheckout | 픽셀 + 서버 전송(event id·IP·브라우저 정보) | 안 보냄 | 기본 + 서버 전송에 `em`·`ph`(SHA-256) |
| Purchase | 구매 회원 결제 → 대기표(회원으로 묶음) → 결제 완료 화면(구매 회원 본인)이 IP·브라우저 정보 채움 → 서버 전송 + 같은 응답으로 픽셀 거울 | 안 보냄 · 결제 뒤 거부하면 대기 중 전송 취소 | 기본 + `em`·`ph` |
| CompleteRegistration | 안 보냄 | 안 보냄 | 보냄(예전 그대로) |

- 「거부」 범위: 그 브라우저(쿠키 1년) + 로그인한 채 거부하면 그 계정(그 계정으로 로그인한 다른 브라우저도 처음 열 때 거부 쿠키를 받음, 그 계정 결제 Purchase 안 보냄).
- 픽셀에는 개인 식별 정보를 넣지 않는다(Advanced Matching 안 씀 — `init`에 사용자 값 없음, 자동 설정 끔). 해시는 서버 전송에만, DB 함수가 동의를 다시 확인하고 해시로만 준다(원문 이메일·번호는 DB 밖으로 안 나감).
- 첫 방문 카드는 안내로 바뀜: 「거부 / 자세히 / 확인」, **닫기·확인은 거부가 아니다**(예전 「닫기 = 거부」 없앰). 안내 판을 새로 둬서 예전 카드를 본 사람도 새 안내를 한 번 본다.
- 판 그대로: 처리방침 동의 버전 `2026-11-06.1`, 광고 설정 판 `meta-20261020-v2`(올리면 지금의 거부 기록·쿠키가 풀린다).
- 기본 허용 브라우저는 5초 주기 서버 확인을 하지 않는다(방문자 전원이 5초마다 서버를 부르지 않게). 주기 확인은 선택 동의 브라우저만(가입 완료 거울용).

현재 그대로인 것(바꾸지 않음): 서버 전송 user_data는 IP·브라우저 정보뿐이고 `fbp`·`fbc`는 보내지 않는다(픽셀이 격리 창이라 1st-party `_fbp` 쿠키·`fbclid`를 못 읽음). 페이지 첫 로드 때 서버 설정 답이 오기 전에 생긴 상품 조회는 예전처럼 빠진다.

## 2. 바꾼 파일

| 파일 | 내용 |
|---|---|
| `supabase/migrations/20261110100000_v5_meta_default_measurement.sql`(새) | 대기표 `browser_key` not null 풀기 + 검사(`browser_key` 있거나 회원 Purchase), `meta_user_choice`(회원의 가장 최근 기록: 동의/거부/없음), `meta_user_match`(선택 동의 회원의 이메일·휴대폰 SHA-256), `meta_order_buyer`, 결제 트리거·`queue_meta_purchase`(인자 `p_user` 추가, 예전 4개 인자 호출 그대로 동작)·`meta_delivery_batch`·`claim_meta_browser_events` 교체. 데이터 삭제·변경 없음 |
| `src/lib/analytics/metaConsent.ts` | 안내 문구(기본·선택 동의·이전), 방침 13번 표 행, 안내 판 키 |
| `src/lib/analytics/metaDelivery.ts` | 설정 3가지(동의 `true`·기본 `null`·거부 `false`, 동의 쿠키인데 DB 기록이 없으면 기본), 계정 거부 확인, 해시 통과(64자 하나씩만) |
| `src/app/api/analytics/meta/route.ts` · `meta/pixel/route.ts` · `purchase/route.ts` | 거부만 막음, 해시는 선택 동의 + 로그인 회원만, 계정 거부를 이 브라우저 쿠키로, 결제 완료 응답에 픽셀 거울 |
| `src/lib/analytics/client.ts` · `src/components/analytics/MetaPixel.tsx` | 서버 답 뒤 거부가 아니면 보냄, 안내 카드·설정 창 |
| `src/lib/legal/privacyPolicy.ts` · `policyVersions.ts` | 1·2·5·7·10·13·16번(문장 전후: [legal-review 첫 절](../final4/legal-review.md)), 시행일 상수 `META_OPTOUT_POLICY_EFFECTIVE_DATE = null` |
| `docs/v5/final4/legal-review.md` | 첫 절: 동작·운영 기록·바뀐 문장·근거 4개·확인 질문 10개 |
| 시험 7개 파일 | 아래 3절 |

## 3. 시험

| 지시 | 시험 | 판정 |
|---|---|---|
| 기본 상태에서 4개 이벤트 전송 | `metaDelivery.test.ts` 「기본 상태」: 설정 쿠키 없이 PageView·ViewContent·InitiateCheckout → 실제 Meta 전송 본문 3건(user_data = IP·브라우저 정보만, 로그인·DB 안 봄), 픽셀 창 200, GET `choice:null`. 「기본 상태 Purchase」: 결제 완료 화면 → `queue_meta_purchase(p_browser null, p_user 구매 회원)` + 같은 응답에 픽셀 거울 → 크론 전송 본문 Purchase(같은 id·3,900 KRW, 해시 없음). `metaRegistration.test.ts`(PGlite, 실제 SQL) 「기본 허용」: 기록 없는 구매 회원 결제 → 기본 줄 → 다른 회원·비로그인은 못 채움 → 본인이 IP 채움 → 거울 1번·서버 전송 1번 같은 id. `metaCheckout.test.ts`: `setMetaChoice(null)`이면 InitiateCheckout·ViewContent 나감, 결제 완료 응답의 사실만 픽셀로(위조 id 버림) | PASS |
| 거부 뒤 미전송 | 거부 쿠키 → 행동 3종·서버 사실 확인 202, 결제 완료 화면 202, 픽셀 창 404, Meta·DB 호출 0. 동의 쿠키라도 DB 기록이 거부면 거부. 계정이 거부했으면 다른 브라우저 GET이 `choice:false` + 거부 쿠키. SQL: 결제 뒤 거부 → 대기 줄 CANCELED(IP 지움)·allowed false·거울 없음·크론 없음, 거부 회원의 다음 결제는 줄 없음, 거부 브라우저의 결제 완료 화면 false. 클라이언트: `setMetaChoice(false)`면 요청 0 | PASS |
| 동의 시에만 PII 포함 | 라우트: 동의 쿠키 + DB 동의 + 로그인 회원 → `em`·`ph`, 로그인 안 함·DB 기록 없음 → 없음, 해시 모양 아닌 값·여러 개는 버림. SQL: 로그인한 채 동의한 회원만 `em`=sha256(소문자·공백 제거 이메일)·`ph`=sha256(82+앞 0 뺀 번호), 기본 회원·로그인 없이 동의한 브라우저·거부 뒤 → `{}`, 대기표 결과에 이메일 원문·회원 id 없음, anon·authenticated 역할은 새 함수 못 부름. 픽셀 `init`에 사용자 값 없음 | PASS |
| 처리방침·카드 | `privacyPolicy`·`refundPolicy`·`LegalDocuments`·`metaConsentCard` 시험을 새 문장·제목·시행일 상수·변경 이력 순서·「확인 ≠ 거부」로 고침 | PASS |
| 관련 9개 파일 | 81개 통과 | PASS |
| 타입·린트 | `tsc --noEmit` 0, 바꾼 파일 eslint 0 | PASS |
| 전체 시험 | (아래 4절) | |
| 운영 화면 실측 | 배포 전이라 안 함(배포 뒤 WebKit + 아이폰 UA로 — 헤드리스 Chromium은 픽셀이 안 보냄) | UNVERIFIED |
| 판매 품질 | 이 변경은 광고 측정만 — 리포트 원고·결제 경로 영향 없음(결제 트리거는 예외를 삼켜 결제 상태 변경을 막지 않음, 시험 「트리거가 실패해도 결제 승인은 그대로」 통과) | — |

## 4. 전체 시험(기준 트리와 동시 실행)

기준 = v5/main `dc5dc158`(scratchpad 분리 worktree), 브랜치 = `abf54724`. 두 트리를 같은 시각에 `vitest run --reporter=json`으로 돌려 시험 이름 단위로 비교.

| | 전체 | 통과 | 실패 | 건너뜀 |
|---|---|---|---|---|
| 기준 | 31,818 | 27,428 | 851 | 3,539 |
| 브랜치 | 31,829(+11 = 새 시험) | 27,438 | 852 | 3,539 |

- 브랜치에서만 실패 3개 → 두 트리에서 파일 하나씩 따로 다시 돌리면 결과가 같다: `temporalTenGodSourceContract`(둘 다 11 실패 / 38 통과 — 기존 실패, 전체 실행의 12번째는 STACK_TRACE_ERROR 시간 초과), `v5ManseTableConsistency`(둘 다 27 통과), `productionTestDataCleanupMigration`(둘 다 4 통과). 기준에서만 실패 2개(`ticketPublication`·`customerDayunGeneration`)도 단독으로는 둘 다 통과. → 동시 실행 부하 시간 초과이며 **새 실패 0**(이 변경이 건드린 파일과 무관한 영역).
- 판정: **PASS**(기존 실패 851개는 그대로 — 이 작업 범위 밖).

## 5. 운영 동의 기록 수(배포 전, 읽기만)

2026-11-09 19:38 KST 다시 셈(18:3x와 같음). `meta_tracking_consents`(브라우저별 1줄):

| | 동의 | 거부 | 계 |
|---|---|---|---|
| 익명(로그인 없이 기록) | 3 | 10 | 13 |
| 회원 연결 | 0 | 11 | 11(회원 9명, 9명 모두 가장 최근 기록이 거부) |
| 계 | 3 | 21 | 24 |

- 대기표(`meta_conversion_outbox`) 0줄. 다른 판 기록 0. 기록 기간 2026-10-20 ~ 11-09.
- 동의 3건은 모두 오늘 16:25~16:32 KST(메타 복구 배포 확인 시간대, 16:17 적용)에 남은 기록이라 배포 확인용 브라우저로 보인다(추정 — 확인하지 않음). IP·브라우저 정보가 아직 있지만 7일 안이다.
- 배포 뒤 이 24개 브라우저·9명은: 거부 21건(회원 9명 포함)은 계속 안 보냄, 동의 3건은 선택 동의로 읽힘(계정 연결이 없어 해시 없음). 그 밖의 모든 방문자는 기본 허용.
- 예전 카드의 「닫기」도 거부로 저장돼 「거부」 버튼과 구분할 수 없다. 거부로 둔다(legal-review 확인 질문 5).

## 6. 배포 전에 정할 것 · 배포 순서

**정할 것(덕짱님)**
1. **시행일·공지 기간** — 처리방침 16번이 「불리한 변경은 30일 전 공지」를 약속한다. 「동의해야만 보냄 → 기본으로 보냄」은 불리한 변경으로 볼 소지가 크다(legal-review 확인 질문 2). (가) 지금까지처럼 배포일 시행(운영 Q·P 모두 공지 없이 배포일 시행) (나) 공지를 먼저 띄우고 30일 뒤 배포. 코드는 (가) 기준(시행일 상수 한 줄)이다.
2. 법률 검토 전 배포 여부 — 확인 질문 1(IP·Meta 쿠키·회원과 이어지는 Purchase가 개인정보인지)의 답에 따라 기본 단계에서 IP를 빼거나 Purchase를 선택 동의로 되돌려야 할 수 있다.

**배포 순서(승인 뒤)**
1. `git fetch` → origin/master가 `05f7f592`에서 움직였는지, Vercel 지금 운영 배포(롤백 기준) 확인.
2. 운영 함수 본문 md5가 그대로인지 다시 확인 — 2026-11-09 읽기: `meta_purchase_on_paid` 160405b8…, `queue_meta_purchase`(4인자) a56496ec…, `meta_delivery_batch` 5faf0033…, `claim_meta_browser_events` 609278f5…, `record_meta_consent` 6ea6e104… (다섯 개 모두 저장소 원본과 같음). 새 함수 이름 3개·검사 `meta_outbox_owner`는 운영에 없음. `account_contacts.email`·`phone` 있음.
3. **migration `20261110100000` 먼저**(저장소 밖 임시 폴더 CLI 방법, dry-run → `--yes`). 먼저 넣어도 예전 코드는 그대로 돈다(기본 줄은 IP가 안 채워져 서버 전송 0, 거울은 동의 브라우저만 폴링).
   - 코드가 먼저 나가도 깨지지 않게 했다: 계정 설정을 못 읽으면 그 화면만 안 보내고 거부 쿠키를 남기지 않음(시험 있음), 결제 완료 화면은 `p_user` 인자 오류로 0건.
4. `META_OPTOUT_POLICY_EFFECTIVE_DATE` = 배포일(KST) 한 줄 → 관련 시험(`refundPolicy` 등은 상수를 따라감) → v5/main → master push → Production.
5. 배포 뒤 확인: WebKit + 아이폰 Safari UA(헤드리스 Chromium은 픽셀이 안 보냄)로 ① 설정 없음 → 안내 카드 + `facebook.com/tr` PageView, ② 「거부」 → 그 뒤 0건·픽셀 창 404, ③ 시험 결제 1건 → 대기표 기본 줄(`browser_key` 없음, IP 채워짐) → 5분 크론 `sent_at` + `browser_dispatched_at`, ④ Vercel 관측 쿼리로 `/api/analytics/meta` 200·202 수. 방문자 전원이 행동마다 서버를 부르게 되므로 함수 호출 수 증가를 하루 뒤 한 번 본다.

**되돌리기**: 이전 배포 승격 + 함수 4개를 저장소 원본(`20261020062611`·`20261107120000`)대로 다시 넣고(`queue_meta_purchase` 5인자 drop → 4인자 create), 새 함수 3개·검사 drop. `browser_key` not null을 되살리려면 기본 줄(browser_key 없음 — 측정 대기 줄, 고객 데이터 아님)을 먼저 지워야 한다(삭제라 승인 필요). 처리방침 문구는 코드 롤백으로 함께 돌아간다.
