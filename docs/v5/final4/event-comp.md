# 최종 A 11~14 — 1+1 이벤트 · 보상 이용권 · 메인 배너 · 팝업

로컬에서만 시험했다(운영 지급·운영 migration·env 입력 0). Anthropic 호출 0.

## 1. 1+1 이벤트(11)

- 기간: 2026-11-07 00:00:00 ~ 11-16 23:59:59 KST(서버 시각). 코드 기본값이라 `GIFT_EVENT_ENABLED=1`만 넣으면 이 기간으로 돈다.
- 바꿀 때: `GIFT_EVENT_START`·`GIFT_EVENT_END`. 오프셋이 없으면 KST로 읽는다(예 `2026-11-16 23:59:59`). 끝이 `:59`초면 그 초까지 포함(경계 = 다음 날 0시), 날짜만이면 그 날 끝까지.
- 규칙(기존 구현 확인): 회원 결제 1건마다 1장(`gift_rewards.source_order_id` unique), 한 계정 2회(`GIFT_EVENT_MAX_PER_ACCOUNT`, 기본 2), 받은 날부터 30일(SQL도 30일 상한), 장마다 내가 쓰기 또는 선물 1회(받은 친구 쪽은 일반 이용권이라 다시 선물 불가), 선물해도 처음 기한 그대로, 선물받은 친구의 첫 결제 → 보낸 사람 +1장(`GIFT_EVENT_BONUS_MAX`, 기본 2, 이벤트 기간에만).
- 고침: 1+1 계정 상한이 보상 이용권(kind='comp')까지 세던 결함 → 이벤트 이용권만 센다(migration 1)). 서재 안내의 「계정당 2회」 → 설정값.

## 2. 보상 이용권 캠페인(12)

migration `supabase/migrations/20261106100000_v5_final4_event_comp.sql`: 표 `comp_campaign_grants`(캠페인 id + 계정 = 한 번), 함수 `ops_comp_campaign('roster'|'run'|'popup')`(service_role만 실행). 지급은 기존 보상과 같은 `gift_rewards(kind='comp', gift_only=false)` 행이라 서재 이용권 목록·내가 쓰기·선물 링크·환불 없음 규칙이 그대로다. `comp_grants`에도 한 줄 남겨 서재 지연 지급(`ops_comp sync`, `COMP_ENABLED=1`일 때)이 같은 계정에 또 주지 않는다. **`COMP_ENABLED`는 넣지 않는다**(지급은 이 도구로만).

- A: `f6122631-…`, `35c222b2-…`, `67db6b1f-…` 2장씩(코드 기본값 `DEFAULT_A_USERS`).
- B: `--cutoff`(배포 시각) 전에 가입(가입 동의 완료 = `account_profiles.created_at`)한 계정 − A − `ADMIN_USER_IDS` − 시험 계정 목록, 1장씩.
- 시험 계정 표시 열이 없어 `--exclude id,id` / `--exclude-file 파일`(한 줄에 하나, `#` 주석)로만 뺀다. dry-run 출력에 가입 시각·가린 이메일이 있어 목록을 보고 고른다.
- B가 `--expect-b`(기본 36)와 다르면 지급하지 않고 명단·제외 목록·기준 시각 뒤 가입 수를 출력한다. `--expect-file`(기대 B 목록)을 주면 빠진·더한 계정을 바로 보여 준다. SQL `run`도 같은 검사를 한 트랜잭션 안에서 다시 한다.

### 배포 명령에서(운영)

```bash
# 0) migration 적용(배포 체크리스트 순서대로) 뒤
# 1) dry-run — 명단 개수 확인(36이 아니면 멈춤)
SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… ADMIN_USER_IDS=… \
  pnpm exec tsx tools/final4/comp-campaign.ts --remote --campaign v5-relaunch-2026-11 --cutoff "<배포 시각 KST, 예 2026-11-06 18:00>" \
  --exclude-file <시험 계정 목록> --expect-b 36
# 2) 실행(같은 인자 + 확인 플래그). 다시 실행해도 이미 받은 계정은 건너뛴다.
… --execute --confirm v5-relaunch-2026-11
```

SQL Editor로 할 때(같은 함수): `select public.ops_comp_campaign('roster', '{"campaignId":"v5-relaunch-2026-11","cutoff":"2026-11-06T18:00:00+09:00","a":["…3개"],"exclude":["관리자·시험 계정 id"]}');` → 개수 확인 → `select public.ops_comp_campaign('run', '{… 같은 값 …,"expectB":36,"confirm":true,"aQty":2,"bQty":1,"days":30,"products":["saju_mbti_full","career_money_study","love_marriage_child","saju_mbti_compatibility"]}');`

### 로컬 결과

- A 3명(검수 계정) + B 9명(로컬 가입자 14 − A 3 − 관리자 1 − 시험 1), 기대 36으로 실행 → `B_COUNT_MISMATCH`로 멈춤(지급 0).
- `--expect-b 9` dry-run → 지급 0 / 실행 → 새로 12명(A 6장·B 9장, 30일) / 다시 실행 → 새로 0명·이미 12명.

## 3. 메인 배너·타이머(13)

`src/components/growth/GiftEventCountdown.tsx`(지난 `LaunchCountdown`과 같은 구조·같은 CSS 모듈에 `.gift` 크기만 더함). `/api/gift-event`(공개, no-store)의 서버 시각 + 흐른 시간(performance.now)으로 센다. 시작 전 「11월 7일 00시 시작」 + 시작까지, 진행 중 종료까지(일·시간·분·초), 끝나면 사라짐. 메인 책장(`BookShelf`)에서 옛 `LaunchCountdown` 자리를 바꿨다.

## 4. 팝업 ①②③(14)

- 고르기(`src/lib/ops/comp/popupSelect.ts`): 안 쓴 보상 이용권이 있는 A → ③, B → ②(이벤트와 무관). 그 밖(손님·신규 가입·다 쓴 회원) → 1+1 기간에만 ①. 다 쓰거나 만료(사용 가능 장 0)면 ②③ 없음. 화면: `/`, `/products`, `/report/new`만(읽는 화면 없음).
- 상태: `GET /auth/event-popup`(읽기 전용 — 지급·만료 처리 안 함, 보상 정보는 로그인한 회원 본인에게만). 실패하면 공개 기간 정보(`/api/gift-event`)로 ①만.
- 닫기·ESC·바깥 누르기, 같은 탭에서는 다시 안 뜸(sessionStorage), 「오늘 하루 보지 않기」는 팝업 id마다 KST 날짜(localStorage, try/catch). `role=dialog`(native `<dialog>` showModal)·`aria-modal`·`aria-labelledby`·`aria-describedby`·닫기 라벨.
- 글꼴: 책 화면과 같은 Geist + 시스템 한글 고딕(새 웹폰트 없음). 모바일은 위에 붙여 아래 쪽 넘김 줄을 가리지 않는다(상품 화면 측정: 카드 아래 461px < 쪽 넘김 790px, 화면 844).
- ①의 [예시 먼저 보기] → `/example`(예시 페이지 담당이 만드는 주소), [리포트 고르기] → 메인 책장. ②③ [이용권으로 만들기] → `/account#gifts`(서재 이용권 목록: 내가 쓰기 / 선물 링크).

캡처: `docs/v5/final4/captures/` — 메인 타이머 시작 전·중, 팝업 ①②③ 데스크톱 1280·모바일 390, 상품 화면 ① 모바일. 진행 중 캡처는 서버 env `GIFT_EVENT_START=2026-11-05 00:00`으로 기간을 당겨 찍어서 범위 줄이 「11월 5일 – 11월 16일」로 보인다(기본값이면 「11월 7일 – 11월 16일」, 시험으로 확인).
