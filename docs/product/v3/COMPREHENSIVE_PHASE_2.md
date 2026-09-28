# 종합 V3 · Phase 2 검토

기준: 2026-09-28, `v3/rebuild`. Production/master 배포 없음.

## 연결 범위

- `saju_mbti_full`의 **명시적 V3 요청만** 연결했다. 기본 요청과 paid worker/writer 계약은 V2 그대로다.
- 서버 호출: `generateProductReport(payload, runtime, strategy, undefined, { comprehensiveVersion: "v3" })`.
- 로컬 실제 생성 API: `POST /api/reports/create`, `productOptions: { contentVersion: "v3" }`. 이 API의 기존 development/test 제한은 유지했다.
- 계산/입력 정규화/원국 evidence는 기존 함수를 재사용한다. V2 장문을 중간 산출물로 생성하지 않는다.
- 저장 식별자: `productVersion: v3`, `version: comprehensive_v3.1`, evidence `comprehensive-evidence-v3.1`.
- 입력 kind `comprehensiveV2`는 기존 dispatcher 호환성을 위해 유지하며 고객에게 노출하지 않는다.
- V3 publication은 canonical natal table과 evidence refs 및 결정적 문구 일치를 확인한다. JSON 키 순서 변경은 허용한다. 읽을 때 캘린더/외부 API 호출이나 저장 데이터 보정은 없다.
- V2 snapshot/renderer와 공유·재진입 경로는 유지한다. 다른 5상품은 V3 옵션을 전달해도 기존 draft/evidence 해시와 동일하다.
- 결제, DB/schema, Toss, OpenAI 설정/호출, Vercel/Production 변경 없음. 실제 로컬 생성 5건 모두 externalCallCount=0.

## 읽기 구조

핵심 결 → 가장 강한 힘 → 좋은 패 → 생각/선택 → 일 → 돈 → 사람 → 사랑 → 배움 → 오행 보완 → 위험 패턴 3–5개와 보완 → 하나의 최종 방향.

첫 장은 고정 번호 없이 고객별 4–7개 고유 신호를 묶는다. 복합 해석과 좋은 패, MBTI modifier, 현재 상태의 선택 기준을 먼저 보여준다. 근거가 없는 장은 생략한다. 예를 들어 C/E에서는 별도 사랑 해석을 억지로 채우지 않았다.

전문 층에는 만세력, 십성, 지장간, 십이운성, 전체 신살/귀인/원국 표식, 확인된 합충형파해, 겉글자/가중 오행 분포, 구조 판정 근거, MBTI 선호지표·기능서열을 보존한다. 기존 공통 표를 기본 접힘으로 재사용했다. 확인되지 않은 관계 유형은 추가하지 않는다.

V2의 중복 마지막 요약, 반복 실행 조언, 별도 안전문구 묶음, 긴 MBTI 설명의 본문 배치를 없앴다. 약관·정책 페이지는 변경하지 않았다.

## 근거와 카피

- 전체 원자 registry 195개를 후보 조회에 연결한다. source material이 없거나 약한 근거/미검토 위험 문장은 본문으로 승격하지 않고 전문 층에 남긴다. 195개 모두에 새 해석을 창작했다는 뜻은 아니다.
- 개별 해석은 체감 질문, 이미 가진 강점, 실행 지침, 이유와 근거로 구성한다. 동일 긴 문장은 한 곳에서만 설명한다.
- 대표 compound: `정관 · 장성살 · ENTJ` → 역할·기준을 조직의 방향으로 쓰되 담당 권한을 명시한다. `정재 · 편재` → 확보한 자원을 지키는 감각과 외부 기회를 나누어 적용한다.
- 천을귀인: 도움 통로를 이미 가진 자원으로 보고 필요한 지원을 구체적으로 요청한다. 반안/재고귀인 등 다른 길신에도 실제 사용 지침을 붙였다.
- 기존 실제 trait 조건에 매칭된 MBTI scene만 modifier로 사용한다. ENTJ의 운영 감각은 일과 사적인 계획에서 상대에게 남길 선택권을 달리한다. INFP는 학습 비유의 원래 정의·조건을 함께 확인한다. 모름은 MBTI fact/fusion이 0개다.
- 직장인/사업가/학생의 일·돈·성장 지침이 각각 다르다. 세부 직업도 소프트웨어의 유지보수, 제조의 재작업, 디자인의 표현 비교 등 다른 선택을 만든다. 같은 원국의 명리 evidence는 변하지 않는다.
- 오행 보완은 기존 지장간 포함 canonical weighted label만 쓴다. 겉글자 부족 표시는 본문 evidence에서 제외한다. 불명/근사 시간에는 생활 보완을 확정하지 않는다. 월령 가중치를 새로 계산하거나 주장하지 않는다.

## 대표 A 비교

| 항목 | V2 | V3 |
|---|---:|---:|
| 초기 고객 화면 문자량 | 18,457 | 4,324 |
| 40자 이상 동일 문장 재등장 | 9 | 0 |
| 완곡/hedge 패턴 | 63 | 0 |
| 별도 안전문구 | 3 | 0 |
| 명시적 명리 compound | 0 | 7 |
| MBTI fusion | 3 | 2 |
| 상태별 적용 지침 블록 | 0 | 4 |
| 고유 좋은 표식의 사용 지침 | 2 | 3 |

문자/문장 수는 같은 대표 입력의 실제 `article.innerText`, 초기 접힘 상태에서 측정했다. 문장은 문장부호/줄바꿈으로 나누고 공백을 정규화하며, 같은 40자 이상 문장의 첫 출현 이후 횟수를 센다. Hedge는 금지 표현 및 “수 있습니다”를 포함한 패턴이다. 안전문구는 사건 확정 부인/질병 예측 부인/수익 약속 부인의 기존 3줄이다.

구조 수는 V2 narrative plan의 명리 근거 2개 이상 theme / 고유 interaction ID, V3 compound / 명리+MBTI evidence를 함께 가진 블록이다. V3 fusion 2개에는 정관·장성·ENTJ compound와 별도의 행동 장면이 포함된다. 좋은 표식은 실제 귀인 및 도화·홍염·반안의 고유 표식에 사용 지침이 있는지 집계했다. 수를 늘리기 위해 같은 해석을 복제하지 않았다. V2와 V3는 구조가 달라 이 수치는 해석의 품질 점수가 아니다.

전문 층까지 펼친 V3 전체 고객 텍스트는 8,446자다. 전문 MBTI 원문에 “수 있습니다”가 1건 남으며 본문은 0건이다. 전문 source 설명을 숫자 개선을 위해 고치지 않았다.

## Fixture 결과

| Fixture | 입력 맥락 | 본문 문자 | compound | 전용 MBTI scene | generate/publish/SSR/hydration |
|---|---|---:|---:|---:|---|
| A | 1996-12-06 09:30 / ENTJ / 직장인 / 소프트웨어 기획 | 4,125 | 7 | 1 | PASS |
| B | 1989-09-07 07:24 / INFP / 프리랜서 / 브랜드 디자인 | 4,013 | 5 | 2 | PASS |
| C | 1984-06-15 14:20 / ISTP / 사업가 / 제조 품질 | 3,362 | 7 | 1 | PASS |
| D | 2003-03-22 18:10 / ENFJ / 학생 / 콘텐츠 디자인 | 3,797 | 6 | 1 | PASS |
| E | 1999-11-02 05:45 / 모름 / 취준 | 3,343 | 6 | 0 | PASS |

본문 문자량은 export helper 기준(표/공통 UI 제외)이라 위 초기 DOM 문자량과 다르다. 다섯 건 모두 canonical provenance 검사에서 unsupported refs 0, 본문 hedge 0, 긴 문장 반복 0, 안전문구 섹션 0, 도화/홍염 미사용 warning 0. 생성과 발행 검증 후 실제 고객 페이지에서 만세력 버튼을 눌러 hydration을 확인했고 browser errors는 0이다. 대표 A의 MBTI 표도 펼쳐 확인했다. 390px 전 fixture와 대표 768/1440px에서 overflow 0.

같은 출생 입력에서 MBTI 변경/모름, 직업 상태+세부직업 변경, 관계 상태 변경을 추가 검증했다. 명리 facts는 그대로이고 해당 행동/일·돈·성장/관계 지침은 달라졌다. 알 수 없는 출생시간에는 오행 생활보완과 시주를 만들어내지 않는다.

## 검증

- targeted 7파일 **183 PASS**: V3 core/comprehensive/6 V2 golden, 실제 create API 회귀, completed page, deterministic quality, shared lookup boundary.
- 전체 **4,137 PASS / 기존 실패 3** (총 4,140).
- 기존 실패: `legalPagesSource.test.ts`, `policyPagesSource.test.ts`의 날짜 기대값, `compatibilityPreviewPageSource.test.ts`의 제거된 scoreLabel 기대값. 수정하지 않았다.
- `pnpm lint`, `pnpm build`, `git diff --check` PASS. 마지막 빌드는 격리 환경에서 대기해 해당 빌드 프로세스만 종료한 뒤 로컬 권한으로 재실행해 통과했다.
- 전체 TypeScript는 기존 test 진단 **384개 그대로**, src/V3 신규 진단 0. 기존 진단 첫 줄 집합 SHA-256: `8b39b660531cb46094153777c7858cb9971975b1e6db56f8e15f0a0c112b0c8d`.
- Next.js/React 스킬의 서버 계산·직렬화 경계와 기존 client table 재사용, 브라우저 스킬의 실제 버튼/오류/화면 확인 절차를 적용했다.

## 사용자 검토

대표: http://127.0.0.1:3100/reports/report_f9yxfwz3pojvi

나머지 로컬 페이지:
- B: http://127.0.0.1:3100/reports/report_xyv7wvenru8ru
- C: http://127.0.0.1:3100/reports/report_upmnh3ztfqj1m
- D: http://127.0.0.1:3100/reports/report_zzmk4y0kebg0n
- E: http://127.0.0.1:3100/reports/report_uhgxfiz4jljeh

[전체 고객용 텍스트](COMPREHENSIVE_REVIEW.txt)는 전문 층까지 펼친 화면에서 추출했다. 로컬 메모리 preview이므로 개발 서버를 재시작하면 URL이 사라질 수 있다. 다른 상품 V3는 시작하지 않는다.
