# P5 UI 정돈 진행 기록 ("고급 도서관 열람실")

브랜치 `v5/p5-ui`(origin/v5/main 36bca34b에서 분기), worktree `~/Developer/gyeol-worktrees/v5-ui`. 로컬 dev 서버 `PORT=3300 pnpm dev:v5`, 로컬 Supabase(기존 컨테이너 공유, 초기화·파괴 작업 없음). 운영 배포·master push 없음.
경계: `src/data/knowledge-v5/`, `src/lib/brief/`, `src/lib/writer/`는 수정하지 않음(읽기·타입 import만). 원고 생성 로직 무변경.

## 준비
- 프론트엔드 디자인 skill: 이 세션에는 없음. `artifact-design`은 claude.ai Artifact용이라 쓰지 않음.
- Playwright: devDependency `playwright@1.56.1` 추가, 브라우저는 설치된 Chrome(channel: chrome)을 씀(브라우저 내려받기 없음).
- 캡처 도구 `tools/p5/capture.ts before|after|wip [필터]` → `docs/v5/ui/<phase>/<화면>-<390|1440>.png`. 입력·주문서는 입력 화면이 복원하는 sessionStorage 초안으로 같은 사람을 채운다.
  - 공개 `/auth/*`는 운영 출처만 받아(보안 설계) 로컬에서 403 → 주문서·서재는 같은 컴포넌트의 내부 경로(`/dev/book-flow/input`, `/dev/account`)로 찍는다.
  - 운영 버전 조합 v4 Book·v5 대운/세운/궁합 점수는 개발 전용 `/dev/ui-fixtures?combo=…`(저장 데이터 그대로), 생성 대기는 `/dev/ui-status?stage=n`.
  - v5 픽스처: 로컬 개발 DB의 결정론 작가 Book 4권을 `tests/fixtures/ui-v5/*.json.gz`로 뽑음(가상 인물).
- before 캡처 42장(`docs/v5/ui/before/`).
- 본문 동일성 기준: `tests/unit/app/bookRenderSameness.test.tsx` + `tests/fixtures/production-version-combos/render-text.json`(정돈 전 코드로 생성). v4 5종은 쪽마다 렌더된 본문 문단·장 제목 해시 비교, 레거시 v1·1.0·v2 4종은 Book 렌더러가 아니라 기존 결과 화면이 그대로 연다(그 화면 파일 무변경).

## 결정 (사용자가 바꿀 수 있음)
| 항목 | 결정 | 이유 |
|---|---|---|
| 명조 | Noto Serif KR(SIL OFL 1.1, google/fonts `ofl/notoserifkr` METADATA·OFL.txt 확인), `next/font/google` 400·600, latin 조각만 preload, 한글은 unicode-range 조각을 필요할 때, 폴백 AppleMyungjo·Nanum Myeongjo·Batang | 오픈 라이선스·자체 호스팅(빌드 때 내려받아 같은 출처로 제공)·조각 로딩으로 성능 |
| 고딕 | 시스템 고딕 1종 스택(-apple-system·Apple SD Gothic Neo·Noto Sans KR·Malgun Gothic). Geist 제거 | 내려받기 0, 한글 UI에 Geist(라틴 전용)는 의미 없음 |
| 색 | 종이 #f6f2e9 · 먹 #26231f · 포인트 자주 #7b2e3a · 금박 #9c7e44(제목 장식 짧은 선만). 다크: 종이 #1b1916 · 먹 #ece6da · 포인트 #d8a0a9 | 도서관 가죽 장정 느낌, 6색 표지와 겹치지 않는 1색 |
| 표지 6색 | 같은 계열 유지, 채도만 낮춤(노랑 #D6B758, 녹색 #2F5A47, 주황 #C46A4C, 보라 #5B4A82, 남색 #2D3E56, 회색 #C8C4BA) + CSS 천 결(가로·세로 1px 줄) | 상품 정체성 유지 |
| 표지 글자 | ISSUE·GYEOL REPORT·PERSONAL EDITION 제거 → "결리포트" + 작은 번호, 명조 제목(표지 폭 기준 cqi 크기로 잘림 0), 이름이 있으면 "○○의 책". 뒤 표지는 제목을 숨김 | 영문은 로고 하나만, 겹친 표지 제목 잘림 제거 |
| 관심 분야 입력 | 삭제(상태는 빈 배열 그대로 보냄) | v5 브리프·작가가 `focusAreas`를 쓰지 않음(`src/lib/brief`, `src/lib/writer` 검색 0건). v4 런타임도 0건, 옛 v3 처리기만 사용 |
| MBTI 이름 | knowledge-v5 `easyName` 재사용(`src/data/book-pages/mbti.json`, `tools/p5/build-mbti-pages.ts`) | 16Personalities 유형명 미사용 |
| MBTI 무료 검사 링크 | 16personalities.com/ko(새 창) 1개 | 가장 알려진 무료 검사 |
| 생성 대기 단계 | 기존과 같이 경과 시간 기준 단계(원국 분석→성향 연결→책 집필→검수→제본) + 종이 한 장씩 채우기 | 서버 진행 신호가 없음(작가 진행 노출은 A 영역 → 보고서 남은 문제) |
| 주문서 제공 시기 | 본문 "결제하면 바로 집필을 시작해 보통 몇 분 안에 완성됩니다", 작은 법적 고지 "제공 기간 최대 24시간 · 90일 열람" 유지 | 이용약관 서비스 제공기간(최대 24시간)과 전자상거래 고지 유지 |
| 아이콘 | 책등 여섯 권(6색) 단색 면 SVG → `public/brand/icon-v5.svg`, `apple-touch-icon-v5.png`, `icon-192-v5.png`, `icon-512-v5.png`, favicon.ico, 공유 이미지 `og-v5.jpg`(1200×630) | 글자 없는 상징으로 모든 크기에서 선명, 파일명 버전 |

## 단위 기록
| 커밋 | 내용 |
|---|---|
| ebc3ab7a(리베이스 후) | 디자인 시스템·표지·홈·책 열람·고정 쪽·입력·주문서·생성 대기·서재·푸터·아이콘·공유 이미지, 본문 동일성 시험, 도구 |
| 47f4348d | origin/v5/main(63e7bab0 event-end) 위로 리베이스 후 이벤트 블록(제목·혜택·카운트다운·링크 하나)·마지막 장(한 줄+자세히) 정돈. 종료 동작(launchActive 아닐 때 null, 캠페인 종료 화면)은 A 그대로 |

| 6555f509 | 관련 시험 110파일 비교 → 의도한 표시 변경 12파일 갱신(남은 1건은 깨끗한 base worktree에서도 같은 기존 실패) |
| 2cd633ee | Lighthouse 보정(뒤 표지 제목 흐리게·두 칸 뒤 inert·aria-hidden·입력 대기 높이·display optional) |
| 8d0a8007 | 옛 밑줄 입력 규칙 제거, 어절 단위 줄바꿈 |
| 51f68a4d | 완료 보고 초안 `docs/v5/p5-report.md` |

주의(시간을 쓴 함정): `pnpm start`를 TaskStop으로 끄면 `next-server` 자식이 남아 이전 빌드를 계속 낸다 → 새 빌드 뒤 CSS 조각이 없어 무스타일 페이지를 측정하게 된다. 포트로 pid를 찾아 끈다(`kill $(lsof -nP -iTCP:3400 -sTCP:LISTEN -t)`). zsh에서 `path` 변수 이름은 PATH를 덮는다.

## 마무리
- origin/v5/main 95223c07(P3.7) 위로 리베이스(충돌 없음), 카카오 공유 카드 이미지 크기 수정, after 46장 재촬영, 전체 시험 비교(신규 실패 0, 보고서 §8), v5/main fast-forward push.
