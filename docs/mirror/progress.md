# 「남이 본 나」 진행 (명령 1/3 · 브랜치 mirror/01 · 기준 origin/master e9d82f02)

| 단계 | 상태 | 메모 |
|---|---|---|
| 0 준비 | 통과 | worktree mirror-01, SPEC · 시안 옮김, SPEC 보정 3건 반영, 용어 확인 받음 |
| D0 문항 · 계산 엔진 | 통과 | src/data/mirror/items.ts · src/lib/mirror/{engine,order,constellation,constellationSvg,text,hash,home}.ts |
| D1 데이터 · 계정 | 통과 | migration 20261127120000_mirror_core(로컬 적용), /api/mirror/*, 로그인 겉모습 · 프로필, /@아이디(proxy.ts — 덕짱 선택) |
| D2 자가 질문지 · 빅뱅 · 홈 | 통과 | src/components/mirror/*(three 0.187.0 동적 import, 2D 대체 · 컨텍스트 손실 복구 · 움직임 줄이기), scripts/dev/mirror-seed.ts |
| 검증 · 마무리 | 통과 | tsc 0 · lint 0 · pnpm test 6,085 중 실패 1(writerThinking, 기준선과 같음 — 신규 0) · build OK · 390×844 흐름 · 홈 0/1/5/40/100 · 2D · 손실 복구 |

결정 기록: 별자리 SHAPE(lean 0.24 · inner 0.16 · span 0.66 · 흔들림 0.05/0.10 · 선 끊기 0.6 · 최소 간격 0.09) — 무작위 100명 × 30번 최저 99%.
결정 기록: 처음 만든 아이디는 바로 한 번 바꿀 수 있고 그 뒤 30일(handle_changed_at null로 시작). 홈 숫자는 서버 계산만 보낸다(친구 답 원본 · 세션 id 미전송).
다음 할 일: 명령 2(D3 친구 응답 · D4 공유 · 이야기 · 보고서 호 migration). 폰 확인은 이 Mac 방화벽에서 node 허용 필요할 수 있음.
