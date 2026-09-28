# 종합 V3.2 · Phase 2C Rich Editorial

기준: 2026-09-28, `v3/rebuild`, 이전 V3.1 커밋 `7dda445bce3d67b9cce1109212e8d1bc98fb0b27`.
문자 수나 compound 수를 늘리는 작업이 아닙니다. 사람 중심의 서사, 다른 읽기 방식, 강한 근거의 선별과 중복 조언 제거를 종합의 명시적 V3 요청에만 적용했습니다.

## 사용자 검토

- [가온 V3.2 실제 로컬 리포트](http://127.0.0.1:3100/reports/report_pfwbkr0v6rhn2)
- [전체 고객 텍스트](COMPREHENSIVE_V32_REVIEW.txt)
- [가온 compound 선택 추적](COMPREHENSIVE_V32_PROMINENCE.md)

텍스트는 실제 브라우저 article의 만세력·MBTI·선호지표/기능서열·목차·기운표·행별 위치/출처를 모두 펼쳐 추출했습니다. 원문 17,496자, 행 끝 공백을 정리한 파일은 17,492자입니다(마지막 개행 제외). 기본 화면에서 보이지 않는 전문 출처까지 포함하므로 본문 비교 문자 수와 다릅니다. 공유/사업자 footer는 제외했습니다. 로컬 preview memory URL이며 서버를 재시작하면 없어집니다. 대표 화면을 열어 두고 다른 상품은 시작하지 않습니다.

## 상단 UI

제목/소개 → 목차 → 만세력 ▾ → 내 명리에 있는 주요 기운 → MBTI ▾ → 핵심 결/본문.

- 만세력과 MBTI는 기본 접힘입니다. 두 오행 분포는 만세력 내부에만 있습니다.
- 가온 겉글자: 목 1 / 화 3 / 토 2 / 금 0 / 수 2.
- 가온 지장간 포함 기존 가중치: 목 1.3 / 화 3.6 / 토 2.9 / 금 0.2 / 수 3.5.
- 설명: “위는 원국 8글자, 아래는 지장간을 포함한 해석용 가중 분포입니다.”
- 기운표는 기운 / 쉽게 말하면 / 나에게 쓰이는 힘의 세 열입니다. 실제 일주, 의미 있는 십성, 신살/귀인, canonical 합·충, 기존 강한 구조를 표시합니다. 계산기에 없는 형·파·해를 만들지 않았습니다.
- 행별 위치·출처 펼침에 기준, 위치, 기존 가중치/천간·지장간 본기 여부, sourceRef를 넣었습니다. 별도 전체 feature 재나열과 “계산 기준 자세히 보기”는 제거했습니다. 내부 표현 “원국 전체의 파생 근거”는 고객 기본 문구에서 제외했습니다.
- 다른 상품의 공통 만세력 기본 출력은 그대로입니다. 종합 V3.2만 optional Server-rendered 오행 슬롯을 전달합니다.

## 중심 해석 선택 기준

기존 계산식·가중치·feature extractor·Common Core/registry·MBTI pair DB는 변경하지 않았습니다. 종합 편집 선택에만 아래 기준을 적용했습니다.

1. confirmed evidence, source/lineage, 종합 domain 관련성을 요구합니다.
2. 십성은 기존 가중치 0.6 이상이면서 겉글자 또는 지장간 본기 위치가 있거나, 기존 합산 가중치 1 이상인 경우 중심 재료로 사용합니다. 0.6은 기존 본기 기여량을 읽는 **편집 자격 경계**이지 새 명리 강도 계산식이 아닙니다.
3. 신살/귀인은 직접 위치가 확인된 재료를 우선합니다. 위치 없는 파생 표식은 존재 사실/보조 층에 남기며 중심 복합 근거로 승격하지 않습니다.
4. 복합 해석은 서로 다른 명리 feature/lineage를 요구합니다. 같은 feature 복제, 별칭, MBTI trait 여러 개, 직업 이름만으로 강해지지 않습니다.
5. 자격 → 겉글자 직접성 → 구성 요소 중 약한 쪽의 기존 가중치 → 독립 근거 → 월/일 위치 → 현재 맥락 관련성 순으로 정렬합니다. 자격이 있어도 발견/조언 중복 때문에 선택되지 않을 수 있습니다.

가온의 편재 0.1 + 정재 0.1은 모두 보조 지장간 근거입니다. 돈의 중심 조합으로 쓰지 않습니다. 실제 강한 식신의 결과/시간 가치, 겁재의 비교 지출, 직장인 자원 맥락을 읽습니다. 약한 재성이 있다는 사실은 과장하지 않고 설명하며 숨기거나 계산을 바꾸지 않습니다.

D의 도화·홍염은 실제 존재하므로 사랑의 보조 단락에 남깁니다. 현 canonical 도화에는 직접 위치가 없어 강한 compound로 집계하지 않습니다. C의 기존 `WEALTH_HEAVY` MEDIUM 구조와 겉글자 편재 1은 읽되, 정재 0.4까지 강한 pair로 부풀리지 않습니다.

## 읽기와 내용

- 핵심 결은 사람부터 시작하는 5문단입니다. 가온은 경쟁이 손을 움직이는 성격 → 정축/화개·편인의 겉과 속 → 천을의 좋은 자원 → 일 밖의 취향과 관계 → 깊이를 지키며 연결하는 삶으로 이어집니다.
- A–J: 강한 판정, 체감 질문, 명리 이미지, 겉/속 반전, 잘 쓰면/과하면, 두 힘의 긴장, 좋은 패 선언, 현대 적용, 선택 기준, 마무리. 실제 문장을 다른 순서로 배치하거나 같은 발견을 합치며, 같은 문장을 mode 이름만 바꿔 다양성으로 세지 않습니다.
- 6 fixture에 9–10가지 mode, 인접 동일 mode 0. 질문은 강한 십성/현침 근거와 개별 질문 소유권으로 선택해 2–3개입니다. 모든 항목을 질문으로 만들지 않습니다.
- 좋은 패는 정의 반복 대신 쓰이는 장면과 사용법입니다. 천을은 답을 맡기기보다 관점을 얻는 관계, 반안은 인정 뒤 남길 경험, 장성은 통제하지 않는 리더십, 재고는 다시 쓰는 자산입니다. 위치 없는 천문을 가온의 중심 좋은 패로 밀어 올리지 않습니다.
- 사람 관계는 공개적 주도성과 사적 거리, 관심을 정보로 건네는 ENTJ/편인의 방식 등으로 구체화했습니다. MBTI는 exact trait와 실제 명리 지지가 함께 있어야 사용합니다.
- 가온의 사랑: “고쳐 주고 싶은 마음이 위로를 앞설 때”, “좋아하면 마음을 앞으로 움직입니다.” 개선하려는 피드백과 감정의 수용, 자율성을 지키며 먼저 다가가는 애정을 구분합니다. 각 단락은 사랑의 장점/편한 관계/답답함/망치는 패턴/기억할 행동을 이어 갑니다. 핵심 chip은 2–4개입니다.
- 다른 fixture는 INFP의 정서적 언어, ISTP의 자율성/거리두기, ENFJ의 몰입과 확인, ESTP의 함께하는 경험으로 달라집니다. MBTI 미입력은 유형이나 fusion을 만들지 않습니다. 모든 16유형에 새 전용 장면을 작성한 것은 아니며, 미작성 유형은 기존 매칭 장면과 명리 근거를 사용합니다.
- 오행 숫자는 상단 표에 두고 본문은 생활 선택에 집중합니다. 금의 정리/기준/기록/운동, 수 부족의 공부/기록/물가 여가 등 기존 근거의 현대 적용입니다. 이사·운 상승·치료 효과를 보장하지 않습니다.
- 마지막은 4문단으로 일·돈·사람·나 자신을 연결합니다. “삶을 전부 증명으로 채우지 마세요. 당신의 힘은 자신을 소모하는 데가 아니라, 자기다운 날을 오래 만드는 데 쓰는 것입니다.”

## V3.1 → V3.2 비교

아래 본문 문자 수는 두 버전에 동일한 `comprehensiveV3CustomerText` helper를 적용한 참고치입니다. 접힌 기술 표/목차/공통 MBTI 설명은 제외합니다. 실제 DOM의 모든 전문 층을 포함한 export와 비교하지 않습니다.

| Fixture | 본문 문자 | 고유 compound | 강한 compound | MBTI fusion | 고유 명리 feature | 체감 질문 | 약한 기존 후보의 본문 승격 | 좋은 패 전용 항목 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A 가온 | 9,114 → 8,151 | 12 → 6 | 7 → 6 | 5 → 6 | 20 → 17 | 0 → 2 | 4 → 0 | 5 → 4 |
| B 나래 | 7,148 → 6,882 | 7 → 3 | 2 → 3 | 2 → 4 | 17 → 14 | 0 → 2 | 4 → 0 | 4 → 4 |
| C 다온 | 6,422 → 6,240 | 9 → 4 | 6 → 4 | 1 → 3 | 13 → 11 | 0 → 3 | 2 → 0 | 4 → 4 |
| D 라온 | 6,970 → 6,583 | 9 → 4 | 7 → 3 | 1 → 3 | 16 → 16 | 0 → 2 | 0 → 0 | 5 → 5 |
| E 마루 | 6,404 → 6,332 | 5 → 4 | 3 → 3 | 0 → 0 | 15 → 12 | 0 → 2 | 1 → 0 | 4 → 3 |
| F 이든 | 4,923 → 4,935 | 8 → 2 | 2 → 2 | 1 → 2 | 7 → 6 | 0 → 2 | 5 → 0 | 3 → 1 |

측정과 해석:

- compound는 고유 조합 ID로 중복 제거합니다. 강한 compound는 두 버전의 기존 후보에 같은 새 자격 기준을 소급 적용하며, 새 story compound는 실제 hero 판정만 포함합니다. 과거에 메타데이터가 없다고 0으로 세지 않습니다.
- fusion은 명리와 MBTI trait가 함께 쓰인 고유 장면입니다. 고유 명리 feature는 본문/패턴의 일주·십성·신살·귀인 canonical ID이며 오행/raw facts는 제외합니다.
- 가온의 긍정 신호 사용 지침은 **6 → 6**입니다. 전: 장성·반안·천을·화개·재고·천문. 후: 장성·반안·천을·화개·재고·천덕. 천문 중심 활용을 빼고 천덕의 중재 범위/과용 회복을 추가했습니다. 좋은 패 전용 항목 수와 본문/패턴 전체의 긍정 신호 활용 수를 구분합니다.
- F는 기존 좋은 패 중 약한 재성/위치가 없는 신호를 빼고 직접 확인된 편인 1항목을 남겼습니다. 좋은 패 개수를 맞추려고 귀인이나 강도를 만들지 않습니다.
- 40자 이상 동일 문장 재등장은 6 fixture 모두 **0 → 0**입니다. 이것만으로 의미 중복까지 없다고 판단하지 않습니다.
- 의미 중복은 위임/기준, 생각 외부화, 비교 지출, 회복, 자율적 리더십, 자산 재사용 등의 명시적 조언 family로 억제합니다. 가온의 기존 책임/위임 반복, 깊은 생각/공개 지연 반복을 제거하고 천덕 중재처럼 다른 발견으로 전진합니다. V3.2 discovery-key 중복과 인접 동일 mode는 모두 0입니다. V3.1에는 discovery-key가 없어 0이라고 보고하지 않습니다.
- 의미 중복 검사는 저술된 family와 수동 독해 범위입니다. 모든 한국어 의미를 자동 판별하는 보편 semantic 엔진이나 LLM 검수는 추가하지 않았습니다.
- 약한 후보 승격 열은 기존 Common Core 매칭 후보 기준입니다. 실제 새 hero compound에도 같은 독립 근거/강도 검사를 추가했습니다. 보조 배우자궁 문단과 D의 도화·홍염 사실 해석은 strong count에 포함하지 않습니다.

## Fixture와 브라우저

| ID | 입력/검사 포인트 | 실제 로컬 URL |
|---|---|---|
| A | 가온, 1996-12-06 09:30, ENTJ, 직장인/소프트웨어 기획, 여러 귀인·금 약함·재성 0.1+0.1 | http://127.0.0.1:3100/reports/report_pfwbkr0v6rhn2 |
| B | 나래, 1989-09-07 07:24, INFP, 프리랜서/브랜드 디자인 | http://127.0.0.1:3100/reports/report_sz2d5g95bgjc9 |
| C | 다온, 1984-06-15 14:20, ISTP, 사업가/제조 품질, 기존 WEALTH_HEAVY 구조 | http://127.0.0.1:3100/reports/report_e7yvdgyiw5uf6 |
| D | 라온, 2003-03-22 18:10, ENFJ, 학생/콘텐츠 디자인, 월·시 현침, 도화·홍염 | http://127.0.0.1:3100/reports/report_m4vtqze0je5bu |
| E | 마루, 1999-11-02 05:45, MBTI 미입력, 취업 준비, 연·시 현침, 수 없음 | http://127.0.0.1:3100/reports/report_m74p6spdlve7j |
| F | 이든, 1992-02-08 15:30, ESTP, 프리랜서/외부 프로젝트 영업, 월·일 역마 | http://127.0.0.1:3100/reports/report_o316s4d2hijz7 |

6건 모두 generate → publication → SSR PASS, 실제 로컬 API 200, `externalCallCount=0`. source가 없는 evidence reference 0, 본문/기운표 copy guard 위반 0. 실제 원국과 MBTI trait만 사용하며 미래 사건/새 표식을 만들지 않는 경계를 검사했습니다. 이 검증은 명리/MBTI 해석의 과학적 타당성을 입증한다는 뜻은 아닙니다.

6건 모두 390px에서 초기 접힘, 실제 만세력 클릭/hydration, 오행 내부 통합, overflow 없음, browser errors 0을 확인했습니다. A는 390/768/1440px에서 만세력·기운표·행 출처·MBTI·2차 선호지표를 펼쳐도 페이지 overflow와 잘린 table이 0입니다. 모바일 오행/출처와 데스크톱 사랑 본문을 스크린샷으로 확인했습니다. 스크린샷은 로컬 `/tmp/gyeol-v32-*.png`에 있으며 배포 자산에 넣지 않았습니다.

## 호환성/검증/범위

- 새 버전은 `comprehensive_v3.2-story.1`. 저장된 V3와 V3.1은 기존 composer/view로 계속 검증합니다. V3.1 6 fixture 전체 draft hash가 이전과 같고 publish/SSR PASS, 실제 기존 가온 V3.1 URL도 정상입니다.
- V2 6상품의 draft/evidence/SSR golden hash, 다른 5상품의 V3 옵션 무영향 회귀를 유지했습니다. 기본 paid/V2 경로는 바꾸지 않았습니다.
- canonical 계산·Common Core 원자/조합 규칙·직업 taxonomy·MBTI pair DB, payment/provider/persistence contract와 production 설정은 변경하지 않았습니다. 시각 불명/근사 처리도 기존 경로입니다.
- Next.js/React 스킬에 따라 계산·선별을 서버에 두고 기존 client toggle을 재사용했습니다. browser 스킬에 따라 실제 클릭·화면·브라우저 오류를 확인했습니다.

```sh
V32_REVIEW_OUTPUT=1 pnpm exec vitest run tests/unit/interpretation-v3 tests/unit/api/createReportRoute.test.ts tests/unit/app/reports/completedReadingExperience.test.tsx tests/unit/report-generation/deterministicProductQuality.test.tsx tests/unit/persistence/paidReportLookupBoundary.test.ts tests/unit/components/report-tables/ManseRyeokCommonTable.test.tsx --silent
pnpm test -- --silent
pnpm lint
pnpm build
git diff --check
```

- 최종 targeted: **10파일 / 215 PASS** (V3 core 5파일 / 119).
- 최종 전체: **4,160 PASS / 기존 실패 3**, 총 4,163 tests / 369파일.
- 기존 실패: `legalPagesSource.test.ts`, `policyPagesSource.test.ts` 날짜 기대값; `compatibilityPreviewPageSource.test.ts` 제거된 `scoreLabel` 기대값. 이전 Phase 2B에서도 실패하던 범위 밖 항목으로 수정하지 않았습니다.
- lint/build/diff check PASS. 로컬 build만 수행했으며 배포하지 않았습니다. sandbox 내 첫 build 대기는 해당 프로세스만 종료하고 같은 명령을 로컬 권한으로 재실행했습니다.
- 전체 TypeScript 검사에는 기존 test 진단 384개가 있습니다. `src/`와 V3 tests 신규 진단 0이며 전체 타입 검사 clean으로 보고하지 않습니다.
- OpenAI/Toss/Production/Supabase/Vercel 접근·호출/변경 없음. 로컬 preview memory만 사용했습니다.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 unrelated 상태를 유지하고 커밋에서 제외합니다. 관련 파일만 선택해 `feat: enrich comprehensive v3 storytelling`으로 커밋하고 `origin v3/rebuild`만 push합니다. master push 없음.
