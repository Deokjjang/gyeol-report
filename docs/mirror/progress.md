# 「남이 본 나」 진행 (명령 1~2/3 · 브랜치 mirror/01 · 기준 origin/master e9d82f02)

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

검증 스크립트: scripts/dev/mirror-check.ts(prep · friend · share · og · stories · board · home 100|400 · withdraw · screens), 보고서 견본 scripts/dev/mirror-report-samples.ts.
다음 할 일: 명령 3(D7 내 계정 마무리 · D8 출시 점검 · 공개 관문 열기). 카카오 공유는 덕짱 수동 설정 뒤 실기기 확인.
