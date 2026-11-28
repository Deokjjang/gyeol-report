# 「남이 본 나」 진행 (명령 1~3/3 · 브랜치 mirror/01 · 기준 origin/master e9d82f02)

| 단계 | 상태 | 메모 |
|---|---|---|
| 0 준비 | 통과 | worktree mirror-01, SPEC · 시안 옮김, SPEC 보정 3건 반영, 용어 확인 받음(명령 1 · 명령 2 각각) |
| D0 문항 · 계산 엔진 | 통과 | src/data/mirror/items.ts · src/lib/mirror/{engine,order,constellation,constellationSvg,text,hash,home}.ts |
| D1 데이터 · 계정 | 통과 | migration 20261127120000_mirror_core(로컬 적용), /api/mirror/*, 로그인 겉모습 · 프로필, /@아이디(proxy.ts — 덕짱 선택) |
| D2 자가 질문지 · 빅뱅 · 홈 | 통과 | src/components/mirror/*(three 0.187.0 동적 import, 2D 대체 · 컨텍스트 손실 복구 · 움직임 줄이기), scripts/dev/mirror-seed.ts |
| 명령 1 검증 | 통과 | tsc 0 · lint 0 · pnpm test 6,085 중 실패 1(writerThinking, 기준선과 같음) · build OK |
| D3 친구 응답 | 통과 | src/lib/mirror/social.ts(friend · friend-start · friend-answer · friend-bundle · friend-finish), src/components/mirror/friend/*, /u/[handle] 랜딩(SSR + 미리보기 메타) |
| D4 공유 | 통과 | src/components/mirror/share/ShareSheet.tsx, src/lib/mirror/card/{model,draw}.ts(2D 캔버스 9:16), src/lib/mirror/og.tsx + /api/mirror/og/[handle](서브셋 글꼴 197KB) |
| D5 기록판 · 결 보고서 | 통과 | src/lib/mirror/{boardView,report/*}.ts, src/data/mirror/reportBank.ts, src/components/mirror/report/ReportView.tsx, 견본 10개 · Sonnet 검사 10차에 0건(엔진 점검기 repetitionFindings · report.test.ts 51개) |
| D6 이야기 | 통과 | migration 20261128090000_mirror_social(CREATE만, 로컬 적용), src/lib/mirror/storyFilter.ts, src/components/mirror/pages.tsx(받은 이야기 · 모두의 이야기 · 기록판 · 내 계정) |
| 추가 1 사업자 정보 | 통과 | src/components/mirror/BusinessLine.tsx(GYEOL_BUSINESS_INFO · legalLinks 재사용) — 로그인 맨 아래 한 줄, 내 계정 > 설정 링크. 홈 · 질문지 · 친구 응답에는 없음(사이트 공통 푸터도 그 화면에서만 숨김) |
| 추가 2 별자리 가독성 | 통과 | scene3d.ts: 내 별 크기 하한 1.9 · 어두운 테두리 · 맨 앞 그리기, 친구 별 상한 1.1 · 친구 수에 따라 옅게, 성단 · 성운 · 은하 뒤쪽 깊이 + 밝기 상한(GROWTH_CAP). 친구 100 · 400명 3D · 2D 확인 |
| 추가 3 탈퇴 | 통과 | mirror_withdraw(security definer) ← src/lib/account/profile.ts(mirrorWithdraw, 기존 탈퇴 뒤 · auth 소프트 삭제 앞, 감사 기록 mirror=done/failed). PGlite 시험 + 로컬 실제 탈퇴 흐름 |
| 명령 2 검증 | 통과 | tsc 0 · lint 0 · pnpm test 6,155 중 실패 1(writerThinking, 기준선 목록) · build OK(ƒ Proxy 등록) · 로컬 실제 브라우저 mirror-check: friend(아는 사이 50 · 친구 60 황금별, 가까운 사이 12 + 이야기, 이어서 하기 · 주인 · 비공개 · 404 · 옛 아이디 308 · 0.3초 무효) · share(버튼 전부 · Web Share 없음 폴백 · 파일 공유 · WebKit · 사진 미전송) · og(PNG 2장 · 메타) · stories(거르기 5 · 본인 작성 · 미리보기 · ♥ · 신고 3번 숨김) · board(1호 발행 · 장면 공유) · home 100 · 400 · withdraw · screens 모두 통과. 배포 모드(next start) 새 주소 전부 404 · "/" 책 홈 그대로. 보고서 견본 10개 Sonnet 검사 26 → 26 → 30 → 12 → 8 → 1 → 5 → 4 → 1 → 0(기록 reports-10/99-review-log.txt) |
| 0 준비(명령 3) | 통과 | 용어 확인(숨은 공개 · 정식 공개 · 말끝 흐림 · 면 근거 짝). 추가 지시(2026-11-28): 운영 일(운영 migration · 운영 DB 조회 · master · Production 배포) 전부 보류, mirror/01까지만 |
| 1-1 문항 4개 | 통과 | imag-1 · imag-3 · trust-4 · check-5(version 1 그대로, 자가 · 친구 같은 행동), SPEC 표 · items-120.txt(scripts/dev/mirror-items-text.ts) |
| 1-2 결 보고서 규칙 | 통과 | 뱅크 · 꼭지 만들기 다시 씀(src/data/mirror/reportBank.ts · src/lib/mirror/report/engine.ts), 점검기 styleFindings(규칙 a~h) + repetitionFindings, report.test.ts 35개(무작위 40판 포함), 견본 10개 reports-10/(이전 reports-10-old/), Sonnet 검사 차수별 36 → 9 → 7 → 8 → 10 → 8 → 4 → 4 → 4 → 3 → 1 → 0(기록 reports-10/99-review-log.txt) · 무작위 600판 문장 규칙 0 · 1호 반복 0 · 2호 반복 300판 중 17판 |
| 1-3 홈 성장 보상 | 통과 | 은하 밝기 상한(GROWTH_CAP)을 없애고 growthOf(n) 표 — 100 · 400명이 40명보다 밝고 · 색이 진하고 · 크다. 별자리 뒤에만 어두운 받침(3D 선 · 별 밑, 2D 같은 층). home/home-compare-3d · 2d.png, home-metrics.json |
| D7 내 계정 | 통과 | /me(src/app/me, components/mirror/account/MeApp.tsx): 프로필 + 「내 리포트 ›」 · 「설정 ›」. 아이디 없는 회원도 들어온다. 서재 대조 0건 → ACCOUNT_MOVED_TO_ME = true(정식 공개 때만 /account → /me). 유료 입력 생년월일 · 출생시간 미리 채움(/api/mirror/prefill, 폼 값만) |
| 3 관문 두 개 | 통과 | mirrorRoutesEnabled(/@아이디 · /start · /api/mirror/* · /me · 문항 통계) · mirrorRootEnabled("/" 전환, /start → "/"). 배포 상수 둘 다 false(배포 전 정지). 로그인 콜백은 "/"(root) · /start(routes)로 시작했을 때만 이 서비스가 동의를 받는다. 「책 고르기」류 링크 "/" → /products |
| D8 점검 | 부분 | release:check · 공유 회귀 · 화면 폭 3개 · UA 6개 · 기존 회원 (a)~(e) · "/" 흐름 · 내 계정 대조 · 문항 통계(/admin/mirror-items) · migration CREATE만 시험 · 묶음 크기(scripts/dev/mirror-launch-check.ts bundle) · 배포 빌드 세 판(관문 끔 · 숨은 공개 · 정식 공개, next start 로컬). 운영 DB 조회(옛 비회원 주문) · 운영 migration 적용은 보류(추가 지시 1) |
| 로컬 시험 서버 | 통과 | pnpm mirror:trial(scripts/dev/mirror-trial.ts): 로컬 DB → 시험 계정(t0 · t5 · t40 · t100 · cust) → 로컬 배포 빌드 → Cloudflare 빠른 터널 → next start → Caddy 기본 인증. 시험 모드 src/lib/mirror/trial.ts(시험 변수 · 로컬 Supabase · Vercel 아님 셋 다일 때만, tests/unit/mirror/trial.test.ts): 관문 둘 · /dev/v5-login(as=new는 매번 새 계정) · 터널 주소 한 개 출처 · 링크 · 카드 호스트. 유료 키 빈 값 · 토스 대역. 터널 주소로 맥 · 폰 크기 E2E 15/15 |

결정 기록(명령 3, 2026-11-28):
- 친구 1명 보고서(한 사람이 본 나)는 규칙 d의 예외(덕짱님 선택): 장면은 비율 없이 그 친구가 고른 보기, 면 문장은 그 친구가 그 면 5문항을 다 답했을 때만.
- 꼭지 모양: 첫 문장 → 문장들 → 장면 · 이야기 → 마지막 한 줄. 장면이 두 면 이상이면 첫 문장은 숫자 문장(LEADS, 면을 특정하지 않음).
- 애착(규칙 a): 두 면 모두 5/5(친구는 90% 이상)일 때만 「~이에요」, 그 밖은 「~에 가까워요」. 2호부터는 자가 유형을 다시 말하지 않는다(자가 답은 바뀌지 않는다 — 지난 호와 같다는 숫자만).
- 확인 · 거리 면의 숫자 · 장면은 「가까운 관계의 나」만(꼭지 2~4에서 같은 숫자를 되풀이하지 않게). 「나만 아는 나」 면의 문항은 「나만 모르는 나」 장면으로 쓰지 않는다.
- 끝맺음: 바로 앞 문장과 다르고, 한 보고서 3번까지(문장이 짧아져 2 → 3), 한 꼭지 안 한 번. 같은 사람의 2호는 지난 호 같은 꼭지의 뼈대 · 앞 네 낱말을 피한다.
- 다른 사람 사이 글자 그대로 점검에서 빼는 줄: 형식이 정해진 줄(친구 수 · 싱크로율 · 날짜 · 열림 안내), 애착 유형 문장(규칙 a 꼴), 가까운 관계의 나 추측 한 줄(문항 · 쪽마다 한 문장), 꼭지 마지막 한 줄(면 · 쪽 · 유형마다 정한 결론). 한 보고서 안 · 같은 사람의 호끼리는 이 줄들도 본다.
- 총평 정도 말은 숫자에 맞춘다(「정확히」 95%+ · 「거의 다」 85%+ · 「거의 다 알아봤어요」류는 싱크로율 90%+). 「헷갈렸다」 · 「본인만 알아요」(친구 40~60%가 같은 쪽)는 쓰지 않는다.
- 내 계정 /me: 기존 /account의 동의(「전체 동의」 포함, 약관 보기는 새 탭 /terms · /privacy) · 가입 정보 · 가입 이용권 팝업 · 카카오 채널 안내 · 혜택 알림 · 탈퇴 부품을 그대로 쓴다. 로그인 전 화면은 이 서비스 로그인 + 채널 안내 한 줄 + 「로그인 없이 둘러보기」(/products).
- 「아직 아무도 모르는 나」는 답 6개 미만인 면 이름을 답 수와 함께 말한다(가장 적게 답한 면을 알려 주는 꼭지 — 명령 2 D5). 규칙 d의 「면 문장」은 면의 성격을 말하는 문장으로 읽었다(Sonnet 8차 지적, 판단으로 둠).
- 가까운 관계의 나: 답이 모자라면 기준(면마다 6개)만 말하고, 바로 뒤 「아직 아무도 모르는 나」가 확인 · 거리를 말하면 되풀이하지 않는다. 가까울수록 보이는 나 장면은 그 문항에서도 묶음마다 3명 이상(SPEC 익명).
- 이야기 꼬리표의 친밀도는 늘 보인다(SPEC 이야기 카드 = 종류 · 친밀도, 받은 이야기 판과 같음 — 보고서에서만 숨겨도 가려지지 않는다).
- 하늘 성장 값(growthOf · GROWTH · BACKING · heatRGB)은 sky/growth.ts에 둔다: Sky2D가 scene3d.ts에서 가져오면 WebGL이 없는 폰 · ?sky=2d에서도 3D 장면 코드(약 27KB)를 받았다. 옮긴 뒤 2D 판은 three · 3D 코드 0KB.
- 로컬 결제 시험: 개발 서버에 tools/p6d/toss-mock.mjs(서버 쪽 토스 승인 대역) + 가짜 test_ 키(프로세스 환경에만, 파일에 쓰지 않음) + OPS_MOCK_WRITER=ok. 브라우저의 토스 스크립트는 막는다(외부 호출 0).

결정 기록(명령 1): 별자리 SHAPE(lean 0.24 · inner 0.16 · span 0.66 · 흔들림 0.05/0.10 · 선 끊기 0.6 · 최소 간격 0.09) — 무작위 100명 × 30번 최저 99%.
결정 기록(명령 1): 처음 만든 아이디는 바로 한 번 바꿀 수 있고 그 뒤 30일(handle_changed_at null로 시작). 홈 숫자는 서버 계산만 보낸다(친구 답 원본 · 세션 id 미전송).

결정 기록(명령 2, 2026-11-27):
- proxy matcher를 `/@:path*` → `/@:handle([A-Za-z0-9._]{3,20})`로 고쳤다. 앞의 것은 Next 안의 path-to-regexp가 거부해 proxy 전체가 등록되지 않았다(명령 1부터, /dev 차단 포함 — 배포 빌드는 /dev 진입 파일을 빼서 404는 유지됐다). routes.test.ts가 Next의 path-to-regexp로 컴파일을 확인한다.
- 용어(덕짱 확인): 숨길 수 없는 나 = 친구 80% 이상 같은 답 + 내 답도 같음(문항당 3명 이상) · 나만 모르는 나 = 60% 이상 반대 · 나만 아는 나 = 내 면 4/5 이상 + 친구 40~60%(면당 6개 이상) · 가까울수록 보이는 나 = 두 묶음 각 3명 이상.
- 「이번 주 가장 많은 마음」 = 최근 7일 동안 받은 마음 수(달력 주가 아니라 늘 7일 창 — 월요일 아침에도 비지 않게).
- 「본인 작성」은 읽을 때 계산한다: 쓴 기기가 나중에 주인 계정에 연결돼도 붙는다(그 세션 답도 주인 기기로 빠진다).
- 무효(0.3초 미만 연속): 직전 두 간격이 모두 0.3초 미만인 답이 오면 그 세션 전체를 mirror_session_voids에 넣는다(점수 · 순위 · 보고서 · 묶음 고르기에서 뺀다). 화면은 답마다 최소 0.45초를 둔다.
- 폭주 제한(10분 칸): 시작 기기 20 · IP 300, 답 기기 240 · IP 2,400, 이야기 기기 10 · IP 120, 마음 · 신고 기기 120 · IP 1,200. IP는 배포의 x-vercel-forwarded-for만 믿고 해시(앞 32자)만 둔다.
- 2호부터는 SPEC대로 "마지막 발행 + 7일"만 본다(새 친구 답이 없어도 열린다 — 문장 변형은 호 번호로 바뀐다).
- 링크 미리보기는 공유 시트의 한마디 · 「답해 준 친구 수 보이기」를 그대로 따른다. 카카오 공유 이미지는 같은 미리보기 주소를 쓴다(사진은 어디에도 올라가지 않는다).
- 카카오 버튼: JavaScript 키(NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY)가 있고 주소가 gyeolreport.com일 때만 켜진다(로컬은 키 없음 → 막힘).
- 신고 3번 알림: ops_notifications kind 제약을 바꾸지 않으려고(CREATE만) 기존 처리 봇 통로(src/lib/ops/notify/telegram)로 바로 보낸다. 토큰이 없으면 보내지 않는다.
- 탈퇴: 아이디(지금 · 예전)는 mirror_retired_handles에 문자열만 남기고, 서버는 mirror_save_profile_v2(같은 규칙 + 사용된 아이디 막기)만 부른다. 기존 표 권한은 넓히지 않고 mirror_withdraw를 security definer로 둔다. 공개 관문이 닫혀 있으면(배포) 부르지 않는다.
- 보고서 반복 검사 범위(4차부터): 한 보고서 안 · 같은 사람의 호끼리는 뼈대까지, 다른 사람 보고서 사이는 글자까지 같은 문장 · 마디만 센다. 뱅크 설계(12면 × 2쪽 × 변형 3+, 사용자 · 호 시드)상 사람끼리 비슷한 틀은 나올 수 있고 각자 자기 보고서만 읽기 때문(1~3차는 사람 사이 틀 반복도 셌다). 엔진 점검기 repetitionFindings가 같은 기준으로 견본 생성 때마다 막는다.
- 보고서 숫자 말: 「반반 · 엇비슷」은 적은 쪽 45~55%일 때만, 「팽팽」은 그때나 차이 1 이하, 「~만」은 절반 미만일 때만. 요약에는 맞힌 개수를 쓰지 않는다(싱크로율은 면별 평균이라 합계 개수와 1%쯤 어긋난다).
- 친구가 1명이면 꼭지 제목도 「친구가 남긴 이야기」(SPEC 표의 「친구들이」를 숫자에 맞춤).
- 기록판 · 이야기 · 내 계정 페이지가 열려 있는 동안 홈 글자는 숨기고(visibility · inert) 별만 뒤에 비친다(배포 전 확인 때 홈 글자가 비쳐 보였다).

검증 스크립트: scripts/dev/mirror-check.ts(prep · friend · share · og · stories · board · home 40|100|400|all · withdraw · screens), scripts/dev/mirror-launch-check.ts(existing · root · me · viewports · ua · peek), 보고서 견본 scripts/dev/mirror-report-samples.ts, 문항 원문 scripts/dev/mirror-items-text.ts.
다음 할 일: 배포 전 정지 — 덕짱님 검증 · 추가 개발 뒤 따로 지시(숨은 공개 → 폰 확인 → 정식 공개). 운영 migration 2개 적용 · 옛 비회원 주문 조회는 그때. 카카오 JavaScript 키는 운영 환경 변수에 이미 있음(덕짱님 확인).
