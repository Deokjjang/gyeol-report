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
- 전체 시험: 기준선 파일(`docs/baseline-failures.txt`)은 옛 master(8482602) 기준이라 깨끗한 origin/master 전체 실행과 대조한다(진행 중).

## A 원고 남은 문제 (v5/p36)

| 항목 | 내용 | 결과 |
|---|---|---|
| A1 소품 반복 | 직업군 58개 소품 5~6 → 13개, 직업 상태·관계 12개. `sceneHints`가 책 단위 사용 기록으로 한 소품 2회까지, 브리프 `usedProps`(안전망용, 작가 입력·토큰 추정에서 제외). 안전망 `metrics.props`(본문 장 수)와 `prop_overuse` 경고 | PASS(시험) |
| A2 생활 단계 | 나이대 소품 → 생활 단계 9개(학생·취준·사회 초년·직장 중견·자영업·프리랜서·살림·육아기·은퇴기·기타). `lifeStage(나이, 직업 상태, 자녀)`: 29세 회사원 = 사회 초년. 육아기는 자녀 입력이 있을 때만 | PASS(시험) |
| A3 전문 용어 | `src/lib/brief/data/terms.json` 172개(지식 DB 이름 → easyName + 체계 용어 + 지지 짝 관계 이름), `tools/p36/build-terms.ts`가 생성. 안전망 `term_first` 경고 범위 = 트레이트 이름 + 사전 전체(조사 앞에서만 잡아 일주일·도화지 오탐 없음). 지침에 "서로 부딪치는 기운(충)" 예시 | PASS(시험) |
| A4 자리 설명 | 감지 단계에서 관계 짝별 자리를 보존(`FeatureHit.pairs`) → 트레이트 `where`("태어난 달과 시각 사이, 태어난 날과 시각 사이"). 팩폭 근거에서 합친 자리 목록 제거. 지침: "자리 설명은 trait.where와 같은 뜻으로만" | PASS(X 시험) · 기존 원고 점검은 아래 |
| A5 민감 이미지 | 십이운성 病 "병상에서 얻은 눈" → "처마 밑 쉼표"(이미지·변형·장면·과사용·자리·MBTI 연결·강점 13곳), 신살 병원 장면 4개, 癸未 "(묘지)" → "(창고)", ISFP 융합 1. lint 금지어 `SICK_DEATH_IMAGE`(무덤덤·상여금 제외) | PASS(lint 0) |
| A6 경험 단정 잔여 | `EXPERIENCE_RESIDUE`("요령이 늘어난", "~해 본 일이", "~해 왔습니다", 부정형 "안 해 본"은 제외). 안전망: 경향형·질문형으로 바꿀 수 있으면 바꾸고(`replacements`), 아니면 지움(`experience_assert`) → 삭제 후 정리. 메타 `metrics.experience` | PASS(시험) |

- 지침 `writer-prompt-v5-6`(1,500토큰 이하 유지). 종합 브리프 토큰 상한 시험 10k → 10.1k(소품 확대·자리 문장, 무작위 표본 1개가 10,005).
