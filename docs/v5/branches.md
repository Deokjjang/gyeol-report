# v5/* 브랜치 현황표

기준: origin/master = 0dde75a8 (2026-10-28 조회). "master 미반영 커밋"은 `git cherry origin/master <branch>` 기준.
상태: **배포됨**(master 반영) · **보관**(참고용 유지, 병합 안 함) · **보류**(나중에 판단).

| 브랜치 | SHA | master 대비 | 포함 커밋 요약 | 상태 |
|---|---|---|---|---|
| v5/phase0-version-tolerant | 463c4f8e | 0 (조상) | 읽기 경로가 v5-lmt calculation version 허용, 모르는 버전은 지우지 않음 | 배포됨 |
| v5/manseryeok-lmt | df60d562 | +5 (패치는 master에 다른 SHA로 반영) | v5-lmt 달력(IANA 시간, 진태양시 일·시주), 기본 경도 127.5E 보정, 망신·고진·과숙 고전 표, 락 픽스처, 보고서 2 | 배포됨 (master: 4bc9cfd0·76c32862·628570a5 등) |
| v5/manseryeok-merge | 0f9b781a | +1 | 릴리스 1·2 배포 기준선과 배포 후 점검 문서(docs only) | 보관 (origin push 완료, master 미병합) |
| v5/event-1plus1 | 0d87ac3c | +1 | 1+1 이벤트 지급 훅, 단일 이벤트 일정 | **보류** (병합 금지) |
| v5/quality-q0 | 6ee79242 | +1 | Q0 진단: 기준 Book, 근거 인벤토리, 실패율, 프리뷰 스모크, 계약 초안 | 보관 |
| v5/quality-q1 | 580705ae | +2 (q0 포함) | knowledge-v5 자산(특징·MBTI 프로필·교차 발견), 스키마, knowledge-lint | 보관 — **P0-2에서 일부 가져옴** |
| v5/quality-q2 | 4494b49f | +7 | 품질 엔진 연결(WRITER_V5_PRODUCTS), 검증기 보정, OpenAI 작가 코드 제거(a7265be7, −23,035줄), 로딩 화면 lint, Q2 평가 문서 | 보관 — 제거 커밋을 v5/main에 직접 적용 |
| v5/quality-q2-openai-removal | ca1aad97 | +3 (q1 위) | OpenAI 미사용 작가 코드 제거만 분리한 브랜치 | 보관 (제거 범위 참고) |
| v5/quality-q3 | b2398fc9 | +11 | Q3 일관성·반복·시간미상 가드, annualEvidence 해시 재고정(4eab02e0), 측정 스크립트, 절입일 안내 문구(b2398fc9) | 보관 — 안내 문구·해시 재고정만 가져옴 |
| v5/quality-q3c | d750e190 | +17 | Q3c 채택 가시성·판정·부분 수리·장 단위 폴백, /dev/review, 재생 평가 | 보관 (writer-v5·/dev/review는 가져오지 않음) |
| v5/main | (현재 HEAD) | +1 이상 | origin/master 위 P0-2 작업 브랜치. dc5707f4 = verify 스크립트 apex↔www 허용 | **진행 중** |

비고
- 로컬 전용(origin 미push): event-1plus1, manseryeok-lmt, quality-q0~q3c. 원격에 있는 v5 브랜치는 manseryeok-merge, phase0-version-tolerant뿐이다(P0-2 push 전 기준).
- master가 Production이므로 "master 반영 = 배포됨"으로 표기했다. 실제 Vercel 배포 상태는 이 문서에서 확인하지 않았다(UNVERIFIED).
