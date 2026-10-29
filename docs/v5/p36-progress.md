# P3.6 진행 기록

브랜치 `v5/p36`(v5/main fab74934에서 분기), worktree `~/Developer/gyeol-worktrees/v5-p36`. 운영 핫픽스는 `hotfix/ops-1`(origin/master 0dde75a8에서 분기), worktree `~/Developer/gyeol-worktrees/hotfix-ops-1`.
비용: Anthropic 0, OpenAI 0(이 단계까지).

## C 운영 결함 (hotfix/ops-1)

### C1 궁합 상대 출생시간 미상 → v4 발행 실패
- 재현: 운영 코드(origin/master)의 `generateV4ShadowReport`(결제 워커·이용권 워커가 부르는 함수, 발행 검사 포함)에 실제 입력 화면이 만드는 payload로 7관계 × (정확/미상/대략 조합) 294건.
  - 시간 미상·대략 상대 모두 **발행 성공**. 실패는 입력 단계 `BIRTH_TIME_UNCERTAIN`(절입일 + 시간 미상·대략, 8건)뿐이고 결제 준비(prepare)가 결제 전에 이미 거절한다.
  - P3.5 로컬 종단의 `V4_COMPATIBILITY_GENERATION_FAILED`는 시험 스크립트 payload에 `compatibilityRoleVersion`이 빠져서였다(`V4_COMPATIBILITY_FIXED_ROLE_INPUT_REQUIRED`). 같은 입력에 그 필드를 넣으면 성공.
- 조치(최소): v4 생성 로직은 건드리지 않음. 입력 화면이 궁합에도 계산 전용 사전 검사(`/api/reports/validate-input`)를 돌려, 절입일 + 시간 미상이면 결제 단계 전에 "절기가 바뀌는 날에 태어난 분은…" 안내. 시간 미상 상대는 계속 허용(필수 입력으로 바꾸지 않음 — 필요 없고 정상 구매를 막는다).
- 시험: `tests/unit/api/compatibilityUnknownTimePreflight.test.ts`(7관계 시간 미상 발행 성공, 역할 버전 없는 payload는 실패 재현, 사전 검사 거절·교정 후 통과).

### C2 모바일 Meta 동의 UI
- 768px 이하 숨김 CSS 삭제. 첫 방문 1회 작은 카드(동의 버전별 localStorage 표시, try/catch), "자세히 보고 선택" → 기존 전체 고지·3개 별도 동의. 떠 있던 설정 버튼 삭제.
- 위치: Book 하단 페이지 이동(54px + safe area) 위 `bottom: calc(66px + env(safe-area-inset-bottom))`.
- 푸터 "광고 설정"(Book 푸터·법정 푸터) → 패널 다시 열기. 패널이 열릴 수 있는 곳(운영 출처)에서만 보인다.
- 동의 전 Pixel 미로드(iframe은 choice === true일 때만) 유지.
- 시험: `tests/unit/components/metaConsentCard.test.tsx`.

### 게이트
- tsc 0, eslint 0(바뀐 ts/tsx), `pnpm build` 성공, 관련 시험 통과(기존 실패 2건 `legalPagesSource`·`bookPreview`는 master 기준선 목록에 있음).
- 배포 전 공개 페이지 점검(www): PASS 4 · WARN 2(sitemap·robots 404 정상) · FAIL 0. 기본 base(gyeolreport.com)는 www로 리다이렉트돼 스크립트가 FAIL로 본다 → `--base https://www.gyeolreport.com` 사용.
- 전체 시험: 기준선 파일(`docs/baseline-failures.txt`)은 옛 master(8482602) 기준이라 깨끗한 origin/master(0dde75a8) worktree 전체 실행과 대조. master 31,192건 중 실패 806 / 핫픽스 31,198건 중 실패 808. 차이 2건(`tickets.test.ts` 궁합 역할 2건)은 master 쪽 같은 파일이 훅 타임아웃으로 안 돌았던 것 — 단독 재실행 시 두 트리 모두 31/31 통과 → **신규 실패 0**.

### 배포 (2026-10-29)
| 단계 | 결과 |
|---|---|
| 프리뷰 `dpl_CEkeK2JrUfEfDyLxvdX5M9V6hqB6` (hotfix/ops-1 c5c11ca8) | READY, `/products` 200·오류 표식 0 |
| master fast-forward | 0dde75a8 → c5c11ca8, 08:41:33Z push(force 없음) |
| Production `dpl_CFiYpGF586fsT7hbG3mdZPBXwsLD` | READY 08:43:56Z, SHA c5c11ca8, 별칭 www·apex 포함, www가 08:44:08Z부터 새 배포 제공 |
| 공개 페이지 점검 1분 간격 3회(08:47:27·08:48:31·08:49:33Z) | 3회 모두 PASS 4 · WARN 2 · FAIL 0, 보이는 글자 수까지 배포 전과 동일 |
| 운영 확인 | 궁합 사전 검사: 보통 시간 미상 200 ok / 1974-11-08 시간 미상 400 새 안내. CSS: 768px 숨김 0, 카드 bottom 66px+safe area. 런타임 오류 0 |
| 롤백 | 불필요 |
| v5 반영 | v5/p36에 cherry-pick(8086996f), 충돌 없음(해당 파일이 v5/main과 master에서 같음), 관련 시험 8/8 |

## A 원고 남은 문제 (v5/p36)

| 항목 | 내용 | 결과 |
|---|---|---|
| A1 소품 반복 | 직업군 58개 소품 5~6 → 13개, 직업 상태·관계 12개. `sceneHints`가 책 단위 사용 기록으로 한 소품 2회까지, 브리프 `usedProps`(안전망용, 작가 입력·토큰 추정에서 제외). 안전망 `metrics.props`(본문 장 수)와 `prop_overuse` 경고 | PASS(시험) |
| A2 생활 단계 | 나이대 소품 → 생활 단계 9개(학생·취준·사회 초년·직장 중견·자영업·프리랜서·살림·육아기·은퇴기·기타). `lifeStage(나이, 직업 상태, 자녀)`: 29세 회사원 = 사회 초년. 육아기는 자녀 입력이 있을 때만 | PASS(시험) |
| A3 전문 용어 | `src/lib/brief/data/terms.json` 172개(지식 DB 이름 → easyName + 체계 용어 + 지지 짝 관계 이름), `tools/p36/build-terms.ts`가 생성. 안전망 `term_first` 경고 범위 = 트레이트 이름 + 사전 전체(조사 앞에서만 잡아 일주일·도화지 오탐 없음). 지침에 "서로 부딪치는 기운(충)" 예시 | PASS(시험) |
| A4 자리 설명 | 감지 단계에서 관계 짝별 자리를 보존(`FeatureHit.pairs`) → 트레이트 `where`("태어난 달과 시각 사이, 태어난 날과 시각 사이"). 팩폭 근거에서 합친 자리 목록 제거. 지침: "자리 설명은 trait.where와 같은 뜻으로만" | PASS(X 시험) · 기존 원고 점검은 아래 |
| A5 민감 이미지 | 십이운성 病 "병상에서 얻은 눈" → "처마 밑 쉼표"(이미지·변형·장면·과사용·자리·MBTI 연결·강점 13곳), 신살 병원 장면 4개, 癸未 "(묘지)" → "(창고)", ISFP 융합 1. lint 금지어 `SICK_DEATH_IMAGE`(무덤덤·상여금 제외) | PASS(lint 0) |
| A6 경험 단정 잔여 | `EXPERIENCE_RESIDUE`("요령이 늘어난", "~해 본 일이", "~해 왔습니다", 부정형 "안 해 본"은 제외). 안전망: 경향형·질문형으로 바꿀 수 있으면 바꾸고(`replacements`), 아니면 지움(`experience_assert`) → 삭제 후 정리. 메타 `metrics.experience` | PASS(시험) |

### A4 기존 시험 원고 점검(P3·P3.5 전부, 자리 + 합충형해·신살 문장 15개, 11개 파일)
실제 자리(현재 빌더의 where): c1 방합 해·달·날 / c1 음착양차 날 / c2 해(묘진) 달–날 / X 충(축미) 달–시각·날–시각, 파(축진) 해–달·해–날 / Y 육해살 날 / 궁합 c1×c2 일지 파(축진).

| 판정 | 문장 | 위치 |
|---|---|---|
| 틀림 | "태어난 달과 날, 날과 시처럼 이웃한 자리에서 서로 부딪치는 기운(축미충)" — 달·날은 둘 다 丑이라 충 없음 | p35 r2 x-full(out·final), p35-fullbook |
| 틀림 | "육해살은 태어난 달과 날에 걸쳐 있으면…" — 육해살은 날 자리만 | p35 r1 y-full |
| 부정확 | "이 충은 태어난 달·날·시 세 곳에 걸려" / "충이 태어난 달·날·시에 이어져" — 관련 자리 셋은 맞지만 짝(달–시각, 날–시각)을 구분하지 않아 달–날로 읽힘 | p35 r1·r2 x-full |
| 맞음 11 | c2 해 달–날(2), c1 음착양차 날(4), c1 방합 해·달·날(4), 궁합 두 사람 날 자리 파(1) | p3 r2, p35 r1·r2, p3-fullbook |

원인: 브리프가 같은 관계의 자리를 하나로 합쳐(`positions` month,day,hour) 짝을 잃었고, 팩폭 근거가 그 합친 목록을 "(태어난 달·태어난 날·태어난 시각)"으로 썼으며, strengthNote의 일반 규칙("바로 붙은 자리(월과 일, 일과 시)")을 작가가 이 사람 자리로 옮겼다. → where·지침·근거 변경으로 막음.

- 지침 `writer-prompt-v5-6`(1,500토큰 이하 유지). 종합 브리프 토큰 상한 시험 10k → 10.1k(소품 확대·자리 문장, 무작위 표본 1개가 10,005).

## B 미검증 상품 6권
- 1회차(지침 v5-6): 6권 안전망 삭제 0. 채점(편집자 서브에이전트 2개, 브리프 대조) → 원인 브리프·지침 확인 후 수정(dbe73c90, f26f90bf).
- 2회차(지침 v5-7): 6권 1회씩 재작성, 안전망 삭제 0. 채점 2개 → 즉시 고칠 수 있는 3건 수정(9d1f217e, 원고 미검증).
- 고객 간 같은 문장 10권 0.026%, 키 매칭 100%. 결과 `p36-fullbook.md`, 보고 `p36-report.md`.
- 작가 에이전트 1개가 API 타임아웃·DNS 오류로 두 번 멈춤 → SendMessage로 재개(파일을 일찍 쓰도록 지시).
- v5 전체 시험: 기준선(`baseline-failures-v5main.txt`) 밖 실패 1파일(`launchEvent.test.ts`)은 단독 실행 28/28 통과(v5/main도 28/28) → 신규 실패 0.
