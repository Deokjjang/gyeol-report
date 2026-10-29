# P5 UI 정돈 보고 — "고급 도서관 열람실"

브랜치 `v5/p5-ui` → v5/main(운영 배포 없음, master 무변경). 진행·결정은 `docs/v5/p5-progress.md`.
원고 생성 로직·지식 DB·브리프·작가 코드는 바꾸지 않았다(`src/data/knowledge-v5`, `src/lib/brief`, `src/lib/writer` 변경 0줄, 읽기·타입 import만).
캡처는 로컬 dev(`PORT=3300 pnpm dev:v5`) 모바일 390px·데스크톱 1440px: `docs/v5/ui/before/`(42장) · `docs/v5/ui/after/`(46장). 도구 `tools/p5/capture.ts`.

## 1. 의도 유지 확인
| 의도 | 결과 | 캡처 |
|---|---|---|
| 홈 순서: 머리 → 이벤트 블록(진행 중일 때만, 상품 위) → 6권 회전 진열 | 유지. 이벤트 블록은 A의 event-end 동작 그대로(ACTIVE·남은 시간 있을 때만, 없으면 블록 자체 없음) | `after/home-event-390.png`(진행 중 응답을 끼운 홈), `after/home-390.png`(종료·대기 → 블록 없음) |
| 시작 버튼·가격 없음, 표지를 누르면 상품으로 | 유지(가격은 주문서에서만) | `after/home-390.png`, `after/home-1440.png` |
| 회전 진열 | 유지·다듬음: 400ms ease-out, 앞 표지 떠오름, 뒤 표지 어둡고 작게, 모바일 자동 회전, 터치·호버 정지, 스와이프 | 탐침 `tools/p5/probe/autoplay.mjs`: iPhone 13 에뮬레이션·데스크톱 모두 6초 뒤 다음 책으로(PASS) |

## 2. 문제 목록 체크리스트 (전 항목)
| # | 문제 | 조치 | 판정 | after 캡처 |
|---|---|---|---|---|
| 홈1 | 이벤트 링크 2개 중복 | 제목·혜택·카운트다운·링크 하나("기간·혜택 자세히 보기" → 이벤트 페이지) | PASS | `after/home-event-390.png` |
| 홈2 | 표지 ISSUE 0x | 제거, "결리포트 + 작은 번호" | PASS | `after/home-390.png` |
| 홈3 | 겹친 표지 제목 잘림 | 제목 크기를 표지 폭 기준(cqi)으로, 뒤 표지 제목은 흐리게+어둡게 덮음, 두 칸 뒤는 보기만 | PASS | `after/home-390.png` |
| 홈4 | 모바일 자동 회전 안 됨(#5) | 진열 밖에서 손을 떼거나 페이지가 스크롤되면 손 떼기 전 상태가 남아 회전이 멈추던 경로를 창 전체 pointerup·pointercancel·scroll에서 해제 | PASS(에뮬레이션) · 실기기 UNVERIFIED | 탐침 결과 위 표 |
| 푸터1 | 인스타(선)·카카오(면) 혼재 | 카카오톡·인스타그램·X·Threads 단색 면 아이콘, 같은 크기(44px 누름 영역)·간격, 접근 가능한 이름("… (새 창)") | PASS | `after/home-390.png` 하단 |
| 푸터2 | "채널 보기" | 삭제 | PASS | 같음 |
| 책01 | 표지 아래 1장 제목만 붙음 | 표지 + 헌정 한 줄(작은 명조), 제목은 화면 낭독용만 | PASS | `after/book-cover-390.png` |
| 책02 | 목차 ↗ | 장 번호 · 제목 · 점선 리더 · 쪽수, 아이콘 제거 | PASS | `after/book-contents-390.png` |
| 책03 | 라벨 굵기 혼재, 양력·시간 보정 없음 | 라벨 한 굵기, "1996년 12월 6일 (양력)", "태양시 보정 −30분 → 09:00 기준 계산" | PASS | `after/book-person-390.png` |
| 책04a | 만세력 제목·캡션 중복, 머리글 "정확·08:27" 중복 | 제목 1회(캡션은 낭독용), 머리글 삭제 | PASS | `after/book-manse-390.png` |
| 책04b | 합·충이 천간합만·한 기둥 칸에만 | 표 아래 별도 목록. v5 Book은 저장된 네 기둥 글자로 엔진 관계 감지(`detectRelations`) 전부를 기둥 쌍과 함께("연지·일지 子丑 육합(토)"), 과거 v4 Book은 저장된 합·충 칸 그대로(재계산 없음) | PASS | `after/book-manse-390.png`(v5), `after/book-v4-manse-390.png`(v4) |
| 책04c | 오행 "가중" 수치, 0개를 "약함" | 5개 막대 + 많음·보통·적음·없음(가중 0이면 없음, 지장간에만 있으면 적음), 수치 숨김 | PASS | `after/book-manse-390.png` |
| 책05a | 16Personalities 유형명 | 지식 DB easyName(`src/data/book-pages/mbti.json`) | PASS | `after/book-mbti-390.png` |
| 책05b | 핵심 요약 해라체 | 지식 DB 인지 기능 쉬운 설명 4줄(존댓말) | PASS | 같음 |
| 책05c | 가까운·먼 키워드 30여 개(비하어 포함) | 원자료 삭제, dimensionTags 상위 5개를 부드러운 낱말로, 선호지표 4쌍 유지 | PASS | 같음 |
| 전반1 | 영문 머리글 | 쪽 머리글 한글(제n장·이름·부록·연도), 영문은 로고 GYEOL REPORT만 | PASS | `after/book-chapter-390.png` |
| 전반2 | 데스크톱 한 줄 약 70자 | 본문 폭 660px(18px 명조 약 36자) | PASS | `after/book-chapter-1440.png` |
| 전반3 | 종이 틀 안 이중 스크롤 | 문서 자체 스크롤, 머리 막대는 아래로 읽으면 숨김, 하단은 장 이동+진행 막대 | PASS | `after/book-chapter-390.png` |
| 전반4 | 겹겹 그림자 | 그림자 1단계 토큰 하나 | PASS | 전 화면 |
| 전반5 | 본문 고딕 | 본문·제목 명조(Noto Serif KR), UI 고딕 | PASS | `after/book-chapter-390.png` |
| 부록1 | 설명 말투 혼재 | 지식 DB oneLiner로 통일(없는 항목만 저장 설명) | PASS | `after/book-appendix-390.png` |
| 부록2 | 십이운성 "쇠"와 오행 쇠(금) 혼동 | "은퇴 첫해의 노장 (쇠 衰)"처럼 쉬운 이름(용어 漢字) | PASS | 같음 |
| 부록3 | 머리말(지장간)과 목록 불일치 | 머리말을 내용에 맞는 한 줄로 | PASS | 같음 |
| 부록4 | 46개 두 단 빽빽 | 묶음(신살·귀인/십성/십이운성/오행·음양/일간·일주/지장간)별 접고 펼치기, 한 단 | PASS | 같음 |
| 끝장 | 이벤트 규정 10줄 이상 | 진행 중일 때만 한 줄 + "자세히"(펼침), 종료 후엔 없음(A 동작) | PASS | `after/book-back-390.png` |
| 서재1 | 표지와 카드 아래 제목·이름 중복 | 공용 표지 컴포넌트, 표지 아래는 발행일·열람 기한만 | PASS | `after/library-books-390.png` |
| 서재2 | 영문 머리글 | 삭제, 계정 정보는 단순 목록 | PASS | `after/library-390.png` |
| 입력1a | 기본 달력·시계 | 연·월·일 숫자 3칸, 시·분 2칸(숫자 키패드, 다 차면 다음 칸) | PASS | `after/input-1-390.png` |
| 입력1b | 성별 "미선택" 드롭다운 | 두 버튼 세그먼트 | PASS | 같음 |
| 입력1c | 라벨 중복("주인공"/"주인공 이름") | "이름" 하나(궁합만 사람 묶음 제목) | PASS | 같음, `after/input-compat-390.png` |
| 입력1d | 다음 버튼이 약한 링크 | 주 버튼 | PASS | 같음 |
| 입력1e | "책장 ↗" vs "내 서재" | "내 서재"로 통일 | PASS | 같음 |
| 입력2a | 관심 분야 라벨 세로 깨짐 | 삭제(v5 브리프·작가가 쓰지 않음, 검색 0건) | PASS | `after/input-2-390.png` |
| 입력2b | MBTI 16개 드롭다운 | E/I·S/N·T/F·J/P 4쌍 토글 + "모르면 무료 검사"(새 창) 1개 | PASS | 같음 |
| 입력2c | 직업 칸 안내 없음 | 예시 안내 | PASS | 같음 |
| 입력2d | 현재 상태와 직업 중복 | "하는 일" 하나에 상태 칩 + 직업 칸 | PASS | 같음 |
| 주문1 | 이름 줄바꿈 | 한 줄 말줄임 | PASS | `after/order-390.png` |
| 주문2 | 점선 두 줄·빈 행 | 점선 1줄, 빈 행 없음 | PASS | 같음 |
| 주문3 | 이용권 0장인데 비활성 선택지 | 0장이면 선택지 숨김(결제만) | PASS | 시험 `ticketCheckout` |
| 주문4 | 같은 안내 반복 | 안내 1문단 + 작은 법적 고지 | PASS | 같음 |
| 주문5 | 동의 여러 개 | "전체 동의(필수 n개)" + 항목별 펼치기(항목·전문 보기 유지) | PASS | 같음 |
| 주문6 | 결제 버튼이 첫 화면 아래 | 하단 고정 결제 막대 | PASS | 같음 |
| 주문7 | "최대 24시간 이내" | 본문은 v5 기준 "결제하면 바로 집필을 시작해 보통 몇 분 안에 완성", 법적 고지(제공 기간 최대 24시간·90일 열람)는 작은 글씨로 유지 | PASS | 같음 |
| #6 | Meta 동의 | 운영 C2 동작 그대로(첫 방문 1회 카드·푸터 "광고 설정"·동의 전 Pixel 미로드), 토큰·둥근 버튼만 | PASS | `after/home-390.png` |
| #7 | 생성 대기 | 단계마다 종이 한 장씩 채우기 + 단계 목록(원국 분석→성향 연결→책 집필→검수→제본), 나갔다 와도 시작 시각 이어짐(기존), 폴링 멈춤 방지(기존) | PARTIAL(단계는 경과 시간 기준, 서버 진행 신호 없음) | `after/waiting-390.png` |
| #8 | 아이폰 Safari 제안 사진 | OG `og-v5.jpg`(1200×630, 실제 표지·명조), apple-touch-icon·manifest 아이콘·favicon(책등 여섯 권), theme-color(밝음·어두움). 메타 점검 `tools/p5/verify-meta.mts` 9항목 PASS | PASS | `public/brand/og-v5.jpg` |

합계: 47항목 중 PASS 46 · PARTIAL 1(생성 대기 실제 진행 신호).

## 3. 디자인 시스템
- 토큰(`src/app/globals.css`): 미색 종이·먹색·포인트 자주 1색·금박(장 제목 위 짧은 선만), 다크 모드(`after/dark-home-390.png`, `after/dark-book-chapter-390.png`), 그림자 1단계, 얇은 선 1종, 모션 150/250/400ms ease-out(회전 진열·책 넘김·생성 대기·페이지 전환), `prefers-reduced-motion`이면 정지, 포커스는 `:focus-visible` 얇은 링.
- 서체: 명조 Noto Serif KR(SIL OFL 1.1, google/fonts METADATA·OFL.txt 확인) `next/font` 자체 호스팅, latin 조각만 preload, 한글은 unicode-range 조각, `display: optional`, 폴백 AppleMyungjo·Nanum Myeongjo·Batang. UI 고딕은 시스템 한 스택(내려받기 0).
- 표지 6종(홈·책 첫 쪽·서재·공유 입구 공용 `Cover`): 6색 계열 유지·채도 낮춤, CSS 천 결, 명조 제목.

## 4. 탭 수(입력 → 결제 버튼까지, 종합·비회원·정확 시각·MBTI 있음)
| 단계 | 전 | 후 |
|---|---|---|
| 표지 | 1 | 1 |
| 1쪽: 이름 1, 생년월일(달력 열기 1+바퀴 3+완료 1), 성별(열기·바퀴·완료 3), 시각(열기 1+바퀴 2+완료 1), 다음 1 | 14 | 이름 1, 연 칸 1(이후 자동 이동), 성별 1, 시 칸 1, 다음 1 = 5 |
| 2쪽: MBTI(드롭다운 3), 상태(3), 직업 1, 관계(3), 다음 1 | 11 | MBTI 4, 상태 칩 1, 직업 1, 관계 칩 1, 주문서 보기 1 = 8 |
| 주문서: 전체 동의 1, 결제 1(전: 스크롤 후) | 2 | 2 |
| 합계 | **28** | **16** |
기준: 키보드 타자는 세지 않음, iOS 기본 선택기는 열기·바퀴 돌림·완료를 각 1탭으로 셈. 토스 결제창 안은 같아서 제외.

## 5. Lighthouse(모바일, 로컬 `pnpm build` + `pnpm start`, lighthouse 13.6.0)
| 화면 | 성능 | 접근성 | 권장사항 | CLS | LCP | 비고 |
|---|---|---|---|---|---|---|
| 홈 `/` | **90** | **100** | 96 | **0.006** | 1.5s | Speed Index 11.8s: 자동 회전이 측정 창 안에서 화면을 바꿈(의도된 연출) |
| 입력 `/report/new?product=saju-mbti-full` | 88 | **100** | 96 | **0** | 3.9s | 입력이 주소의 상품을 클라이언트에서 읽어(Suspense, 정적 페이지) 첫 그림이 JS 뒤에 옴 |
권장사항 96의 감점은 로컬 프로덕션에 DB 환경 변수가 없어 `/api/*`가 500을 내는 콘솔 오류(환경 탓). 정돈 중 고친 것: 회전 때 새 표지 제목이 새 LCP가 되던 것(뒤 표지 제목 흐리게), 입력 대기 자리 높이(CLS 0.449→0), 가려진 좁은 누름 영역(두 칸 뒤 표지 inert), 표지 글자와 낭독 이름 불일치(aria-hidden). 키보드: 진열은 화살표·버튼, 모든 조작 `:focus-visible`. 명도 대비: color-contrast 감사 통과(종이 위 먹·보조 #5d564c 6.3:1).
책 열람 화면은 로컬 프로덕션에 DB가 없어 Lighthouse 미측정(UNVERIFIED).

## 6. 16Personalities 한국어 유형명 검색(저장소 전체, `git grep -F`)
| 이름 | 파일 수 |
|---|---|
| 대담한 통솔자 30 · 모험을 즐기는 사업가 13 · 용감한 수호자 12 · 청렴결백한 논리주의자 6 · 호기심 많은 예술가 4 · 재기발랄한 활동가 4 · 용의주도한 전략가 3 · 사교적인 외교관 3 · 만능 재주꾼 2 · 자유로운 영혼의 연예인 2 · 엄격한 관리자 2 | 선의의 옹호자·열정적인 중재자·논리적인 사색가·뜨거운 논쟁을 즐기는 변론가·정의로운 사회운동가 0 |
- 출처(런타임): `docs/product/mbti/source/*.json`의 `titleKo`(ENTJ 대담한 통솔자, ESTJ 엄격한 관리자, ISTJ 청렴결백한 논리주의자, INTJ 용의주도한 전략가, ISTP 만능 재주꾼, ISFP 호기심 많은 예술가, ENFP 재기발랄한 활동가, ESFJ 사교적인 외교관, ESFP 자유로운 영혼의 연예인, ESTP 모험을 즐기는 사업가, ISFJ archetype 용감한 수호자) → v4 계산 `src/lib/report-knowledge/mbti/sourceRuntimeAdapter.ts` → `src/lib/interpretation-v4/runtimeProjection.ts`가 Book `table.mbti.titleKo`로 저장. 책 MBTI 쪽은 이제 이 값을 쓰지 않는다.
- src: `src/app/dev/book-preview/fixture.json`(개발 미리보기 픽스처), `src/lib/report-generation/comprehensiveReportDraftValidator.ts`(옛 v3 검사 패턴 `/대담한 통솔자 성향은/`).
- 시험: `tests/unit/components/report-tables/*`, `tests/unit/report-tables/*`, `tests/unit/app/reports/*`, `tests/unit/interpretation-v3/comprehensiveStorytelling.test.tsx` 등(옛 표·v3).
- 문서: `docs/product/v3/*REVIEW*.txt`, `docs/validation/*`.
- knowledge-v5: 0건(easyName은 자체 이름. 단 ISFJ "조용한 수호자"·ENFP "불씨를 퍼뜨리는 활동가"는 16P와 낱말 일부(수호자·활동가)가 겹침 — 고치지 않고 보고만).

## 7. 기존 Book 렌더 동일성
`tests/unit/app/bookRenderSameness.test.tsx`(기준 `tests/fixtures/production-version-combos/render-text.json`, 정돈 전 코드로 생성): 운영 버전 조합 9종 중 Book 렌더러로 여는 v4 5종(annual·career·love·major·compatibility·full의 v4)은 모든 쪽의 렌더된 본문 문단·장 제목·소제목 SHA-256이 정돈 전과 같다(PASS). 레거시 v1·1.0·v2 4종은 `storedBook`이 null(기존 결과 화면이 열며 그 화면 파일은 무변경)이고 `productionVersionCombos.test.ts` 18건이 그대로 통과.

## 8. 시험
- tsc 0, eslint 0(바뀐 ts/tsx/mjs/mts), `pnpm build` 성공.
- 관련 시험 110파일: 의도한 표시 변경에 맞춰 12파일 갱신. 남은 실패는 기준선 파일(`docs/baseline-failures-v5main.txt`)에 있는 것과 `bookPreview 'reader contains actual pages…'` 1건 — origin/v5/main 63e7bab0 깨끗한 worktree(`v5-ui-base`)에서도 같은 실패라 기존 오류.
- 전체 시험 결과는 아래 §10.

## 9. 남은 문제
1. 생성 대기 단계가 경과 시간 기준(PARTIAL). 실제 진행 신호(계산 끝·장별 집필 저장·검수)를 작가 실행기/작업 상태에서 내보내야 함 → A 영역(`src/lib/writer` runner·ticketJob) 변경 필요.
2. 입력 화면 LCP 3.9s(성능 88): 상품을 클라이언트 `useSearchParams`로 읽어 첫 그림이 JS 뒤. 상품을 서버에서 넘기려면 `src/app/report/new`(레거시 페이지·소스 시험 다수) 구조 변경 필요.
3. 홈 Speed Index는 자동 회전 때문에 높음(성능 90 유지).
4. 모바일 자동 회전: 에뮬레이션 PASS, 실제 iPhone Safari UNVERIFIED.
5. v5 Book 표시 보강(합충 목록·대운/세운 카드)은 읽을 때 저장 데이터로 만든다(`src/lib/book/v5View.ts`). 생성 때 저장하게 하려면 `src/lib/writer/book.ts`(A 영역) 변경 필요.
6. 캠페인 페이지의 책 목록에는 ISSUE 표기가 남음(이벤트 종료 페이지 전환과 그 시험 `MobileEventCopy`를 건드리지 않음).
7. Playwright devDependency 추가(`playwright@1.56.1`, 브라우저는 설치된 Chrome 사용).
