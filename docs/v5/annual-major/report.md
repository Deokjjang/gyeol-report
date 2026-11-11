# AM 보고 — 세운 「나의 2027」 · 대운 「앞으로의 나」 v5 + 생성 대기 화면 + 4종 품질 점검

브랜치 `v5/annual-major-01`(기준 origin/master 1dc3fd2c) · worktree `~/Developer/gyeol-worktrees/v5-annual-major` · 작성 2026-11-11.
배포·운영 DB 쓰기·운영 환경변수 변경 없음. migration은 로컬 Supabase에만 적용했다.

## 1. 결론과 항목별 판정

**결론: 코드·엔진·지식 DB·화면·할인·대기 화면·안전망은 가짜 작가(호출 0)로 끝까지 통과했다. 7부 실호출(최종 생성 14권 + 임시본 시험 2회)은 아직 하지 않았다** — 이 worktree에 작가 키가 없고, 다른 worktree의 환경 파일에서 키를 찾는 일은 자동 모드 검사가 막아서(비밀값 탐색) 우회하지 않았다. 키를 두면 바로 돌릴 수 있게 생성 도구·자동 점검·래칫·임시본 시험 도구를 다 만들어 두었다(7절). 그래서 검토 묶음(원고·캡처)은 아직 없다.

| 부 | 항목 | 판정 | 근거 |
|---|---|---|---|
| 0부 | 현재 확인 | PASS | 2절 |
| 1부 | 1-1 미뤄 둔 목록 ①~⑤ | PASS(고침) · ⑤ UNVERIFIED | 운영 7권 읽기 전용 점검 → 재발 ①②③④ 고침, ⑤ 운영에 궁합 v5 책 0권 → 7부 생성으로 확인 |
| | 1-2 21개 재발 검사 | PARTIAL | 재발 6 · 경미 4 · 해결 5. 재발분 중 4유형은 결정론으로 다 못 막음(3절) |
| | 1-3 새 오류 | PASS | 운영 7권 오프라인 재생(호출 0), 유형별 건수 3절 |
| | 1-4 공통 문체 기준 | PASS | 결정론 검사 `style.ts`(반복률·시작 다양성·연결어·용어표·리듬), 책마다 점수(점검표) |
| | 1-5 하한선 | PARTIAL | 오프라인 재생(기준 원고 5권, 오탐 0) 완료. 같은 입력 재생성 래칫은 7부 대기 → UNVERIFIED |
| 2부 | 세운 엔진·지식 DB·장 구성·키워드 카드 | PASS(코드) · 원고 UNVERIFIED | 가짜 작가 6권 발행·검사·투영 통과, 엔진 시험 12건 |
| 3부 | 대운 구조·평생 지도·핵심 해·연결 할인 | PASS(코드) · 원고 UNVERIFIED | 가짜 작가 4권, 할인 SQL 되돌림 점검 10항 + TS 시험 |
| 4부 | 생성 대기 화면 | PASS(단위) · 브라우저 UNVERIFIED | 진행률·남은 시간·먼저 읽기·주기 시험. 휴대폰·Safari 실화면은 개발 서버 환경 파일이 없어 못 봄 |
| 5부 | 공통 지킴(법무·매출 봇·퍼널) | PASS | 약관·처리방침 개정(동의 버전 그대로), legal-review.md AM 절, 매출 봇 표시, 퍼널은 상품 구분 없는 단계라 그대로 집계 |
| 6부 | 원가·가격안 | PARTIAL | 프롬프트 크기·기존 실측으로 추정(6절). 실측 중앙값은 7부 뒤 |
| 7부 | 가짜 작가 전 과정 | PASS | 14권 발행 + 임시본→정식본 교체 2회(호출 0) |
| | 최종 생성·검토 묶음 | UNVERIFIED | 키 없음 |
| 8부 | tsc · eslint · build · 전체 시험 | PASS | tsc·lint·build exit 0, 전체 시험에서 AM이 만든 실패 13건 모두 처리, 남은 실패는 master에도 있는 것(8절) |
| 9부 | 배포 계획 | PASS(작성만) | 8절 |

## 2. 0부 현황

- 상품: `major_fortune`·`annual_fortune`. 판매는 `FORTUNE_SALES_OPEN`이 막고 있었고(문구 「12월 1일에 다시 만나요」), 가격은 자리값 4,900원(`src/lib/payment/reportProductCatalog.ts:21`).
- 「책 1권 = 작가 1회」: 발행 함수 `buildV5Snapshot`(`src/lib/writer/publish.ts:375`) → 작가 호출 `call(s, "first", …)`(`src/lib/writer/runner.ts:146`), 장 단위 부분 저장(`runner.ts:170`, 저장소 `src/lib/ops/generation/sinks.ts:9·15`), 끊긴 장만 이어 쓰기(`continuation`). 회수 크론 `src/app/api/internal/report-writer-recovery/route.ts:10`.
- 임시본: 2시간 실패 뒤 OpenAI `gpt-6.1-terra`(`src/lib/ops/generation/policy.ts:14·17`), 감독 `superviseQueueJob`(`supervisor.ts:105`), 교체 레인 `runLaneJob`(`supervisor.ts:156`).
- 대기 화면: 진행 단계가 0/2 두 칸뿐이었고, 이용권 책은 대기 화면이 없었다. 조회는 3초 고정.
- 이용권 범위: 약관은 「4종만」인데 이벤트·관리자·추천 이용권은 상품 범위가 비어 대운·세운도 쓸 수 있었다(틈) → 고침(3절 끝).
- 래칫 `tools/quality/ratchet.ts`는 master에 없고 미병합 `v5/p6e-content`(363bedfe)에만 있어 경로 복원으로 가져왔다. 기준 원고 `docs/v5/baseline/p6d/` 5권.
- 그 밖에 찾은 것: 세운 제목 연도 버그(고침), 작가 지침의 옛 약속 문장(고침), 운영 `LLM_PROMPT_CACHE` 꺼짐(9부에 켜기 제안).

## 3. 1부 — 4종 품질

운영 책은 `supabase db query --linked`로 SELECT만, 메모리에서만 읽었다(`tools/annual-major/prodRead.ts`·`prodBooks.ts`, 쓰기 낱말·상태 RPC 이름 거절, 이름은 ○○로 가림). 대상: 시험 계정·시험 책을 뺀 v5 완성 7권(종합 4·커리어 2·연애 1, 궁합 0).

### 1-1 판정과 수정

| 항목 | 운영 책 확인 | 판정 | 고친 곳 |
|---|---|---|---|
| ① 4종이 세운×원국 관계를 안 씀 | 7권 모두 관계가 있는데(자오충 3권, 병신합 3권 등) 본문은 십성·오행만 | 재발 | 엔진 카드 `src/lib/brief/yearRelation.ts`(2부와 같은 코드). 발행 시각 기준 해 + 11월~입춘 전이면 다음 해, 해마다 관계 1개, 「2026년 병오년」 꼴만 허용(달 고정·「올해·이번 달」 금지 유지), 충=나쁨·합=좋음 단정 금지. 넣은 곳: 종합 흐름 장·커리어 시기 장·연애 흐름 장·궁합 한 가지 장 |
| ② 커리어 같은 문구 4번 / 연차 흔적 | 4번 반복 0건(해결), 2~3번 반복 남음, 「연차를 구체적으로 적기보다」류 흔적 변형 재발 | 재발(변형) | 장 안 같은 구절 상한(`chapter_phrase_repeat`), 제약 흔적 `META_TRACE`(「상태가 ~이니」「숫자 없이 … 적어」「햇수 대신」 등) |
| ③ 「처방은 간단해요」·「쉬는 날 없는 주말」·고객 사이 같은 조언·표지 모순 | 「처방」 1권 4문장, 같은 구절 2묶음, 표지 모순 0 | 재발 | 처방 꼴 내부 용어(한의 문맥은 허용), 장면 소품 시작 자리를 고객 해시로(`fnv1a(이름|생일|시각|성별|상품)`), 행동 조언 배정 회전, 표지 밤+해·겨울+여름 모순 검사(`imageClash.ts`) |
| ④ 연애 문단 논리 | 한 문단에 주어·청자가 섞임 재발 | 재발 | 공통 규칙 2줄(문단 주어·청자 하나, 장면→이유→행동) |
| ⑤ 궁합 v5 | 운영 0권 | UNVERIFIED | 7부 4종 생성(pair-business)으로 확인 |

### 1-2 21개 재발 검사(P6e-content 목록 번호)
재발 1·6·10·13·15·16·18 → 고침(내부 라벨 꼴·면책 꼴·자녀 미입력 단정·십이운성 맨몸·땅 글자 혼동·MBTI 주기능 오기·몸 증상 단정·같은 문장 연속). 경미 2·8·14·19. 해결 4·5·7·12·17.
**결정론으로 다 못 막은 4유형**(판독으로 보는 것): 오행 세기와 십성 묶음 세기의 서로 다른 말, 고객 사이 DB 뜻풀이 문장 복사, 같은 사람 두 책(48·49)의 주장 어긋남, 직업과 맞지 않는 장면.

### 1-3 새 오류(새 검사 오프라인 재생, 호출 0)
운영 7권: 연결어 과다 8 · 내부 용어(처방) 4 · 같은 시작 3연속 0 · 장 안 구절 반복 0. 권당 깃발 최대 14(수리 상한 40 안).

### 1-4 공통 문체 기준
`src/lib/writer/safety/style.ts`: 반복률(장 사이 문장 유사), 문장 시작 다양성·3연속, 연결어 비율·상위, 금지 표현, 용어표 위반, 리듬(평균 길이·변동·짧은/긴 문장 비율). 점검표(`check.md`)에 책마다 점수.

### 1-5 하한선 — 오프라인 재생(호출 0)
기준 원고 5권을 master 코드와 AM 코드로 같은 래칫(lint ⑤)으로 다시 쟀다.

| 권 | master lint(사실) | AM lint(사실) | 새로 걸린 것 |
|---|---|---|---|
| chaerin-love | 11 (3) | 12 (3) | 연결어 과다 1 |
| pair-business | 2 (2) | 2 (2) | 없음 |
| sodam-full | 9 (3) | 12 (3) | 연결어 과다 3 |
| taeo-career | 23 (8) | 25 (10) | 지침 복사 「입력하지 않은 경력과 연차는 쓰지 마세요」, 내부 라벨 「장기 분산형」 |
| haram-full-p6c | 19 (8) | 23 (9) | 처방 꼴 1, 연결어 2, 같은 조언 1 |

새로 걸린 강한 깃발 4건은 모두 의도한 적발(오탐 0). 같은 입력 재생성 래칫 표와 장별 판독은 7부 뒤.

### 덤: 고친 기존 오탐
사실 검사(`src/lib/factsheet/check.ts`)가 엔진 표준 풀이 「반합(세 글자 중 두 글자만 모여 반쯤 묶임)」의 「세 글자」를 글자 수 주장으로 읽어 맞는 문장을 지웠다(세운 달 카드에 반합이 자주 나와 드러남) → 그 풀이 꼴만 「두 글자」로 읽게 고침, 시험 추가.

## 4. 세운·대운 구조, 엔진·지식 DB 추가분

**세운 「나의 2027」**(9장, 소망을 적으면 10장): 0 키워드 카드 → 큰 그림(명리×MBTI 한 문단, 소망) → 사랑(솔로·연애 중·기혼) → 돈의 흐름 → 일·취업·공부 → 사람 → 마음·컨디션 → 1월 다리 + 12 절기월(반복 13칸: 그림·좋은 것·살필 점·이달의 한 가지, 영역 신호) → 운을 쓰는 법(할 것 3·피할 것 3·색·방향·숫자·삼재는 해당 띠만) → 소망(적은 때만) → 이어지는 큰 흐름 + 대운 이어 보기.
- 달 이름은 표와 본문이 한 체계: 「1월 · 신축월 (1/5~2/4) · 2026년 병오년 마지막 달」, 「2월 · 임인월 (2/4~3/6)」 … 「2028년 1월 · 계축월」. 절입 시각은 엔진 값.
- 입력: 신년판 연도 고정(설정값 `ANNUAL_PRODUCT_YEAR`, 기본 2027) + 소망 200자(제어문자·링크 제거, 「이전 지시 무시」류는 자료로도 안 씀, 위험 표현은 원고에 옮기지 않음, 작가에게는 「지시 아님」 인용 블록).
- 엔진: 세운 × 원국·지금 대운 관계, 영역 신호(연애·돈·일·사람·마음 ↑→↓, 결정론), 삼재(띠 기준, 2027 정미 = 해묘미 띠, `timeline/annual-extra.json`), 행운 요소(원국 오행 과부족 보완), 한 해 판정(밀고 갈 해/고르게 다질 해/버티며 다질 해).
- 키워드 카드 1080×1350(`src/lib/book/keywordCard.tsx`, `/r/[token]/keyword-card`), 저장·공유 버튼(이름은 기본 꺼짐).

**대운 「앞으로의 나」**(9장): 대운 읽는 법·평생 지도 → 지난 시간 → 지금 대운 → 바뀌는 때(교운기) → 앞으로 10년(반복 10해) → 영역 지도 → 성장 곡선 → 가까운·먼 계획 → 편지. 핵심 해 3개(일·월 자리 충·형·합, 교운, 세운×대운 관계 점수)와 근거.

**지식 DB**(`src/data/knowledge-v5/deep/`, 모두 `deep-check` 통과): annual-domain · annual-relation · year-energy(병오·정미·무신) · annual-situation(일 4 × 연애 3) · annual-mbti · major-mind · major-domain · mbti-growth. 출처는 내부 파일, 고객 본문에 표기 안 함.

**할인**(세운 → 대운 50%, `MAJOR_DISCOUNT_RATE`): 세운 결제 1건당 1회, 7일 안, 같은 사람(이름·생년월일·시각·성별), 환불되면 안 쓴 할인 회수, 금액은 서버가 정함. 결제 준비 쪽만(`am_major_discount` SQL, 승인 경로 그대로). 매출 봇에 「대운 · 세운 연결 할인」.

**이용권**: 약관대로 모든 이용권(보상·증정·가입·추천·묶음·관리자 지급)을 출시 4종에만(`ticketProductAllowed`).

**연도 정책(이번에 나눔)**: v3·v4 계산이 읽는 달력 해 범위는 master 그대로(v4 출력 고정값 보호), 주문 관문(입력 정규화·결제 정책)만 신년판 연도를 더 받는다(`isAnnualOrderYearSelectable`). 신년판 다음 해(2028)는 그대로 거절.

## 5. API 호출 표와 총액

| 공급자 | 호출 | 비용 |
|---|---|---|
| Anthropic | 0 | $0 |
| OpenAI | 0 | $0 |

이번 작업에서 실호출은 없었다(개발·시험은 모두 가짜 작가·가짜 공급자). 7부를 돌리면 호출마다 모델·입력·캐시·출력 토큰·비용·소요 시간이 `.cache/llm-ledger.json`과 `docs/v5/api-cost-log.md`에 남는다(범위 `am-final` 상한 $8, `am-interim` 상한 $1).

## 6. 원가·가격안 (추정 — 7부 실측으로 바꿈)

추정 근거: 작가 프롬프트 크기(세운 입력 약 5.1만 자·대운 4.5만 자, 시스템 7.1천 자 캐시), 목표 분량(세운 14,590~18,840자·대운 13,100~17,080자), Sonnet 5.5 단가($2·$10/MTok, 캐시 읽기 $0.2), 한글 1자 ≈ 출력 1.1토큰(P6 실측), 기존 4종 실측(권당 $0.14~0.21, 최대 $0.256), 검수 Haiku 약 $0.006 + 수리 약 $0.02.

| 상품 | 권당 비용(추정) | 출력 토큰(추정) | 소요 시간(추정) |
|---|---|---|---|
| 세운 | $0.26~0.30 | 1.6~2.1만 | 3.5~4.5분 |
| 대운 | $0.23~0.28 | 1.5~1.9만 | 3~4분 |
| 4종(실측) | $0.14~0.26 | 1.1~1.6만 | 2~4분 |

남는 돈 = 가격 ÷ 1.1(부가세) − 가격 × 3.63%(카드 3.3% + 수수료 부가세) − 원가(상한 추정 × 1,400원/$).

| 가격안 | 정가 남는 돈 | 할인 50% 가격 | 할인가 남는 돈 | 원가 비율 |
|---|---|---|---|---|
| 세운 3,900 | 2,984원 | — | — | 11.8% |
| 세운 4,900 | 3,857원 | — | — | 9.4% |
| 대운 5,900 | 4,757원 | 2,950 | 2,183원 | 7.3% |
| 대운 6,900 | 5,630원 | 3,450 | 2,619원 | 6.2% |
| 대운 7,900 | 6,503원 | 3,950 | 3,056원 | 5.5% |

가격 상수는 비워 두었다. **가격 설정값이 비어 있으면 판매 플래그를 켜도 팔지 않는다**(`fortunePriceSet`) — 자리값 4,900원으로 잘못 팔리는 일을 막는다.

## 7. 검토 묶음 경로와 책별 점검표

경로(만들면): `~/Desktop/gyeol-review/annual-major/`(git 밖) — 책마다 `snapshot.json`·`book.md`(원문)·`check.md`(입력 요약·분량·장 수·소요 시간·비용·토큰·문체 점수·용어표 위반·금지 표현·키워드·소망 반영 위치·핵심 해 3개와 근거·자동 점검), 4종은 `ratchet/`(래칫 입력), `interim/`(임시본 시험).
**지금은 비어 있다(7부 실호출 전).** 휴대폰 HTML·PDF·캡처(키워드 카드 6, 대기 화면, 평생 지도)는 로컬 개발 서버로 찍는데, 이 worktree에 개발용 환경 파일(로컬 Supabase·토스 시험 키)이 없어 키와 함께 받아야 한다.

책 목록(가상 인물, 엔진으로 조건 확인함):

| 권 | 조건 | 확인 |
|---|---|---|
| 세운 ①~⑥ | 20대 후반 직장인 솔로 소망 / 20대 초반 취준 연애 중 소망 / 30대 초반 사업 기혼 소망 없음 / 1999 토끼띠(2027 날삼재) / 시간 미상 / 남성 | 일간 甲·乙·丁·丙·己·壬, MBTI 6가지 모두 다름 |
| 대운 ① | 순행 28세 | 다음 교운 2030 |
| 대운 ② | 역행 35세 | 다음 교운 2029 |
| 대운 ③ | 교운기 1~2년 안(27세) | 다음 교운 2027 |
| 대운 ④ | 50대 부모·시간 미상(52세, 역행) | 엔진이 시간 미상에도 대운 기준 하나로 확정하는 생일만(처음 고른 1972-10-05는 한로 직전이라 엔진이 거절 → 1974-04-20) |
| 4종 4권 | 기준 원고와 같은 입력 | sodam-full · taeo-career · chaerin-love · pair-business |

가짜 작가 전 과정(호출 0) 결과: 14권 모두 발행·형식 검사·투영 통과(세운 10장 1.3만 자대, 대운 9장 1.2만 자대 — 가짜 원고라 분량·깃발은 의미 없음). 임시본 시험(가짜 공급자): 세운·대운 모두 「Anthropic 장애 → 1·5·15·60분 재시도 → 2시간째 임시본(terra) 발행 → 장애 해제 → 교체 레인이 정식본(Sonnet)으로 바꾸고 임시본 보관」 PASS.

실행 명령(키를 둔 뒤):
```
NODE_PATH=tools/llm/shim LLM_PROMPT_CACHE=on pnpm exec tsx tools/annual-major/final.ts --budget 8      # 상품별 첫 권 자동 점검 → 나머지, 실패하면 멈춤
NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/interim.ts annual                             # 임시본 시험(OpenAI 1회 + 정식본 교체 1회)
NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/interim.ts major
NODE_PATH=tools/quality/shim pnpm exec tsx tools/quality/ratchet.ts --current ~/Desktop/gyeol-review/annual-major/ratchet
```
시작 전 예상 비용(권당 실측 최대 × 1.3 × 14권) 약 $4.7 + 교체 2회 약 $0.6 → 상한 $8 안.

## 8. 검증 · 배포 계획 · 남은 위험 · 결정 필요

### 8부 검증
| 명령 | 결과 |
|---|---|
| `pnpm exec tsc --noEmit` | exit 0 |
| `pnpm lint` | exit 0(경고 0) |
| `pnpm build` | exit 0(로컬, `deploy-strip`은 Vercel에서만 돎 — 작업 파일 변화 없음) |
| `pnpm exec vitest run`(전체, JSON) | 700파일 · 31,971건: 통과 27,880 · 실패 829 · 건너뜀 3,262 |

기존 오류와 신규 오류 구분(기준 `docs/baseline-failures.txt`는 10-28 master 0dde75a8이라 그 뒤 master 1dc3fd2c에서 같은 파일을 다시 돌려 사례 단위로 대조):
- 실패 파일 149 = 기준 목록 140 + 기준 밖 9. 기준 밖 9개(library·bookReading13b·claimProfile·comprehensiveEditorialPlan·guidanceProfile·koreanNarrativeCore·personalResonanceProfile·protected-staging/security·bookSharing)는 master에서도 같이 실패 → 기존.
- 실패 사례 829 = 기준 목록 278 + 기준 밖 551. 기준 밖 551 중 538은 master도 실패(기준 목록 뒤 master에서 생긴 것) → 기존. **AM에서만 13건 → 다 처리:**
  - 원천 해시 4건(세운 지식 `year-rules`·`schema`, 커리어 `jobStatus`·연애 `relationshipStatus` 입력 계약): 세운 계산 연도 파일 `annualFortuneYearRules.ts`는 **master와 바이트까지 같게 되돌렸다**(주문 관문은 새 모듈 `src/lib/report-generation/annualOrderYear.ts`, 신년판 연도는 `ops/config.annualProductYear` 하나로 — 중복 함수 없앰). 바꿀 수밖에 없는 입력 파일 2개(`reportInputAdapter.ts` 소망·주문 연도, `reportInputTypes.ts` 소망 칸)는 살아 있는 등록부 3곳만 해시를 다시 고정(선례 8456483b). `docs/validation/**`의 옛 보존 기록은 그때의 기록이라 손대지 않았다(그 기록을 읽는 11월·2월 계약 시험은 master에서도 beforeAll에서 실패하는 기준 목록 파일).
  - 캠페인 이용권 2건(`campaigns.test.ts` 대운·세운): 이용권 4종 전용(3부)에 맞춰 `TICKET_PRODUCT_EXCLUDED`·전환 없음으로.
  - 시간 초과 7건(`contentRebuild` 3, `manualReview` 4): master에서 같은 두 파일을 혼자 돌리면 같은 사례들이 같은 소요 시간(합계 314초 대 314초)으로 실패 — 부하에 따라 걸리는 사례만 바뀐다 → 기존.
- 고친 뒤 확인: `tests/unit/{report-knowledge,interpretation-v4,payment,report-generation,book,components}` 371파일 재실행 → 위 13건 외 새 실패 0(부하 시간 초과 2건은 혼자 돌리면 통과), 캠페인·대운세운 결제·이용권·공유·운영 32파일 재실행 → 새 실패 0(남은 실패는 기준 목록 사례뿐).

새 시험 파일 5: `tests/unit/brief/annualMajor.test.ts`(세운×원국 관계·1월 다리·절기월·삼재·행운 요소·핵심 해·평생 지도·소망 거르기·반합 오탐), `components/waitingProgress.test.ts`(진행률·남은 시간·먼저 읽기·조회 주기), `payment/fortunePriceConfig.test.ts`(가격이 비면 판매 안 함), `payment/majorDiscount.test.ts`(연결 할인 1회·7일·환불·같은 사람·서버 금액), `tickets/ticketProductScope.test.ts`(이용권 4종 전용). 고친 시험 32개 파일 — 모두 의도한 변경(신년판·9장 구조·달 라벨·가격 설정값·이용권 4종)이고 커밋 메시지에 적었다.

겹치는 파일(다른 작업도 쓰는 곳, 최소로만 고침): 등록부 해시 3줄(`annual-fortune-product-research/sourceInventory.ts`, `career-product-research/sourceRegistry.ts`, `love-product-research/sourceRegistry.ts`), `reportInputAdapter.ts`·`reportInputTypes.ts`(소망 칸·주문 연도), `ops/config.ts`(가격·연도·이용권 범위 함수 추가).

규칙 실수 1건(알림): 커밋 전 색인을 비우려고 `git reset -q`를 한 번 썼다(CLAUDE.md 금지 명령). 색인만 비웠고 작업 파일·커밋 기록은 바뀌지 않았다. 그 뒤로는 `git restore --staged <경로>`만 쓴다.

### 9부 배포 계획(작성만, 실행 안 함)
1. **운영 migration**(순서대로): `20261112090000_v5_am_major_discount.sql`(할인 표·판정 함수), `20261112091000_v5_am_writer_progress.sql`(진행률 읽기 함수). 둘 다 새 표·함수만 만들고 기존 표를 바꾸지 않는다.
2. **환경변수**(Production):
   - `WRITER_V5_PRODUCTS` = `saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility,major_fortune,annual_fortune`(대운·세운 추가)
   - `FORTUNE_PRICE_ANNUAL_KRW`·`NEXT_PUBLIC_FORTUNE_PRICE_ANNUAL_KRW`, `FORTUNE_PRICE_MAJOR_KRW`·`NEXT_PUBLIC_FORTUNE_PRICE_MAJOR_KRW` = 덕짱님이 정한 가격(비우면 안 팖)
   - `ANNUAL_PRODUCT_YEAR`·`NEXT_PUBLIC_ANNUAL_PRODUCT_YEAR` = 2027(기본값과 같음, 명시 권장)
   - `MAJOR_DISCOUNT_RATE` = 0.5(기본값과 같음)
   - `LLM_PROMPT_CACHE` = on(12/1 오픈 몰림 대비, 시간당 3건 넘으면 이득)
   - `FORTUNE_SALES_OPEN` = 1 — **판매 시작 시각 2026-12-01 09:00 KST에 켠다**(이것만 마지막)
3. **순서**: migration → 환경변수(판매 플래그 빼고) → 배포 → 판매 꺼진 상태로 확인(대운·세운 결제 409, 4종 정상) → 09:00 `FORTUNE_SALES_OPEN=1` + 재배포.
4. **30분 확인**: 매출 봇에 대운·세운 이름·할인 표시, `book_generation_runs`에 세운·대운 published, 대기 화면 진행률, 첫 책 1권 직접 열기, 할인 1건 결제 준비 금액.
5. **롤백**: `FORTUNE_SALES_OPEN` 끄기(판매만 즉시 멈춤, 진행 중 주문은 그대로 생성) → 필요하면 이전 배포로 되돌림. migration은 새 표·함수뿐이라 그대로 둬도 된다.
6. **약관·처리방침 개정일**: 문서에 「2026-12-01 개정」으로 적었다(`AM_POLICY_DATE`). 배포일이 바뀌면 그 값만 바꾼다.
7. **오픈 전 덕짱님 할 일**: 가격 결정, 검토 묶음 판독, legal-review.md AM 절 확인 질문 3개 답, 판매 시작 시각 확정.

### 원격 SHA
- `origin/v5/annual-major-01` = 로컬 `a5519db80a118b835effe0860e2af2e975747ef5`(`git ls-remote`로 일치 확인, 2026-11-11). 코드 마지막 커밋은 그 바로 앞 `48bba1f0`(tsc·lint·build를 이 커밋에서 다시 돌림).
- 이 줄을 적은 문서 커밋이 그 뒤에 하나 더 붙는다(내용은 이 절뿐). master·v5/main 병합 없음.

### 남은 위험
- 대운 원고가 5분을 넘거나 잘리면 2회 호출 나누기가 필요할 수 있다(7부 첫 권 자동 점검이 잰다).
- 1-2의 결정론으로 못 막은 4유형은 판독에 기댄다.
- 운영 `LLM_PROMPT_CACHE`가 꺼져 있으면 오픈 몰림 때 원가가 약 5% 높다.
- 대기 화면 휴대폰·Safari 실화면 미확인(4부 UNVERIFIED).

### 결정 필요
1. 7부 실호출: 이 worktree `.env.development.local`에 `ANTHROPIC_API_KEY`·`OPENAI_API_KEY`(+ 화면 캡처용 로컬 개발 환경 변수)를 두는 것.
2. 세운·대운 가격(6절 표).
