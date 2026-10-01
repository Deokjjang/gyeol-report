# V4 Book Runtime — Phase 8C

## 범위와 기준

- Branch `v4/rebuild`; base `19ffbe5aa07bc2e268d5b6a5b7aabdce3d6549be`.
- `/dev/book-preview` 전용. `NODE_ENV=development`가 아니면 데이터 import 전에 404.
- 실제 V4 deterministic 생성 → sealed packet 검증 → customer-only Book projection → 현재 장 렌더링.
- 계산·V3/V4 composer·본문·공개 route·결제·DB·법적 원문·환경 파일 변경 없음.
- 공유는 실제 product/name 기반 presentation만 연결. SDK/클립보드/native share/token 발급 없음.

## 감사한 기존 구현과 연결

| source | 재사용 / 경계 |
|---|---|
| `runtimeShadow.ts`, `runtimeProjection.ts` | Phase7B의 실제 6상품 생성, 입력 정규화, publish validation, customer table projection. writer disabled / externalCalls 빈 배열 |
| `V4ShadowReportView.tsx`, 기존 `/reports/[reportId]` V3 views | 고객 데이터 범위, 최종 문장/공유 순서 확인. public renderer 자체 수정 없음 |
| `BookPreview.tsx`, `BookPages.tsx`, `book.module.css` | 8B 표지·자료 페이지·영수증·각주 sheet·뒤표지 디자인 재사용 |
| `ManseRyeokCommonTable.tsx`, `MbtiCommonProfileTable.tsx`, `report-tables/types.ts` | 생산용 표 계약 전체 재사용. 새로운 sample table 계약을 만들지 않음 |
| `natalTableEvidence.ts`, V4 `evidencePolicy/materialRegistry/materialPacket` | 확인된 위치/전체 feature, alias 통합, strong/supporting 구분, unsupported/ambiguous 억제 |
| V3 `comprehensiveStoryEvidence.ts` | canonical 원국 관계의 기존 쉬운 의미/위치 표시만 재사용. V3 본문을 V4 문장에 섞지 않음 |
| `majorEvidence.ts`, `annualEvidence.ts` | 기존 14년 horizon/전환, 12개월/Jie/월운 evidence를 그대로 표시 |
| `compatibilityEvidence.ts` | 기존 방향성/7 category/부모·상사 고정 role/지원 관계만 표시 |
| `reportShareMetadata.ts`, `ReportShareActions.tsx` | 실제 공유 description + 기존 3-action icon 위계. storage/SDK import 금지 |

## Packet → Page composition

`runtimeBooks.ts`는 기존 Phase7 golden 입력 6건과 기존 unknown/approx/category fixture를 서버에서만 생성한다. 유한한 15개 fixture ID만 허용하며 프로세스 내 캐시를 사용한다. arbitrary payload / query 기반 activation은 없다. 기준일은 기존 `SHADOW_CLOCK`의 **2026-10-01**이며 실제 시스템 날짜인 것처럼 표시하지 않는다.

`bookProjection.ts`는 `validateV4Publication` 성공 후 Book DTO를 만든다. proof/sourceRef/내부 registry ID/계산 원본은 브라우저에 전달하지 않는다. `bookTypes.ts`의 discriminated page descriptor만 reader가 받는다.

`BookReader.tsx`는 현재 장 1개만 mount한다. 전체 packet을 giant DOM으로 만들지 않는다. 모든 narrative paragraph/heading/finalLine은 원본과 exact equality 검증한다. 오래된 `fixture.json`은 역사적 8A 자료로만 남으며 활성 reader에서 import하지 않는다.

### 기본 6상품 page map

| 상품 / 실제 입력 | 구성 | 장 수 | 원국 부록 항목 |
|---|---|---:|---:|
| 종합 / 서진 ENTJ | 표지 → 입력 → 만세력 → MBTI → opening/전체 본문 → 부록 → 뒤표지 | 21 | 32 |
| Career / 민재 ISTJ · 제조업 재무기획 과장 | 공통 구성, 실제 직업/상태/관계 표시 | 20 | 24 |
| Love / 지아 ISFP · 연애 · 시간 모름 | 공통 구성, 시주 미확인 유지 | 21 | 15 |
| Compatibility / 현우 INTP × 소연 ESFJ · 연애 | 두 사람 입력/관계 spread → A/B 각각 표 → 본문 → 두 사람 부록 | 22 | 51 |
| Major / 나영 INTP | 공통 구성 + 시간의 흐름 ledger + 전환/14개년 전문 | 31 | 38 |
| Annual / 도윤 INFJ · 2026 | 공통 구성 + 12개월 overview + 대운 교차/12개월 전문 | 26 | 23 |

부록은 10개씩 자동 분할하며 연속 번호와 전체 수를 표시한다. 다른 fixture의 부록은 15~70개. 종합 MBTI unknown 준서와 approximate 서진도 별도 선택 가능하다. 궁합은 7 category 전부 검증하며 부모=A/자녀=B, 상사=A/부하·팀원=B를 유지한다.

## 구조적 데이터 parity

- 만세력: 시/일/월/연, 천간/지지/독음/음양/각각 십성, 지장간, 십이운성, 십이신살, 신살·귀인, 지원 관계, 오행 visible/weighted 전부 보존.
- unknown 시주 null 유지. approximate는 기존 canonical 시간대 label 사용; 내부 `MYOSI` 등 노출하지 않음.
- 오행 한자/label/semantic color 유지. 분포 소수 표시는 기존 8B 반올림만 적용.
- **정책상 예외:** 계산 원본에는 남겨두되, V4에서 충돌로 격리 중인 망신살은 Book 표/각주/부록에서 표시하지 않는다. 나머지 행/값은 canonical customer projection과 동일하다.
- MBTI: 유형/한글명/archetype/oneLine, 양쪽 4축, 기능서열 전체, coreSummary, 가까운/먼 keyword 전체. 임의 truncation 없음. unknown을 추정하지 않음. `reportUsageNotes` UI 제외 유지.
- Appendix: 사용된 각주만이 아니라 **전체 확인된 명리 inventory**. 일간/일주/십성/strong 구조/신살·귀인/원국 관계/검증된 오행 상태. alias 중복 제외. weak observed 십성은 존재 안내만 하고 hero로 승격하지 않는다. 불확실 구조/DB-only/망신살 제외.
- 원국 표가 지원하지 않는 관계를 임의 추가하지 않으며, 시간 모름으로 오행 상태를 확정할 수 없으면 강약 항목을 생성하지 않는다.

## 각주와 특수 장

- 원문 문자열을 바꾸지 않고 paragraph 옆 superscript + **해당 장 하단** thin-rule numbered notes를 표시한다. popup은 보조다.
- proof.features가 실제 참조한 feature만 기재. 월운은 공유 provenance를 이유로 여러 신살을 붙이지 않고 composer의 `selectedTransit`만 각주화한다.
- Major: 현재 대운/연도별 십성/실제 selected relation/전환, Annual: 연간 십성/대운×세운/월별 십성·selected transit을 원본 source로 연결한다. 임의 relation을 계산하지 않는다.
- Major ledger는 최근3 + 현재 + 미래10, 나이, 실제 대운/세운, headline/theme/좋은 힘/주의, 전환을 모두 표시한다. overview에서 전환/연도 전문으로 이동 가능.
- Annual은 1~12월 순서로 전체 overview와 별도 월 전문을 모두 유지한다. raw Jie timestamp는 내부에 보존; UI는 월/지금·회고·전망, 실제 월주/십성/지원 표식을 표시한다.
- Compatibility spread는 두 사람 입력/role/기존 핵심 캐릭터/관계 evidence와 A→B/B→A 연결을 제공한다. 전문을 spread에 중복 복사하지 않고 해당 장으로 이동한다. 숫자 score/grade 없음.

## Coverflow / 읽기 / 공유

- 옆 책 선택 → 가운데로 이동만. 가운데 책 → 입력/영수증 체험 시작.
- 자동 순환 6.5초. arrow/swipe/keyboard/side 선택 후 마지막 조작에서 8.5초 idle. hover/hidden/reduced-motion/책 열린 상태는 중지. 일회성 타이머 1개만 유지, cleanup 취소.
- 재생/일시정지 버튼과 빈 자리 제거. 표지 디자인 자체는 변경하지 않음.
- 실제 좌표 hit-test에서 3D 배경이 음수 깊이의 옆 책을 가리는 문제를 발견했다. 배경 `pointer-events:none` / 책 `auto`로 클릭 경계만 수정하고 실제 좌표 선택 + synthetic touch 모두 재검증했다.
- 1 chapter=1 page unit, 내부 세로 스크롤. 이동 때 scroll reset; 연타 animation lock. 브라우저 back은 입력/영수증 체험에서 책장 복귀.
- 상단 서비스 identity / 하단 실제 책 title·page count. Annual title은 runtime 선택연도. 일반 장 흰 종이, 뒤표지만 검정.
- 뒤표지에는 실제 finalLine과 name/product 기반 share title, Kakao/공유/복사 3개 시각 action. 실제 공유 호출은 실행하지 않는다.

## Receipt copy decision

감사: `src/lib/persistence/paidReportLookupBoundary.ts`의 access-token 조회, `/payments/toss/success/page.tsx`의 결제 확인 URL 재진입 안내, 기존 share token read 경로. 이메일/전화만으로 되찾는 공개 구매조회 계약은 확인되지 않았다. 반면 URL 재진입/지원 경로가 있으므로 **“링크를 잃으면 복구 불가”를 단정하는 경고는 추가하지 않는다.**

영수증과 전체동의 사이에는 기존 법적 상품/제공/열람 고지 3줄만 유지한다. 비회원 filler 없음. 기존 필수 항목/상세 보기/default collapsed/전체동의 mixed state 유지. member는 8B의 가입약관 동의 가정 체험 상태이며 **activation 전 member checkout legal audit 필수**. 가격 1,290원과 public legal contract 불변.

## V3 → V4 structural parity

| 분류 | 항목 | 결정 |
|---|---|---|
| A 이번 복원 | 만세력 detail / MBTI full detail | 실제 canonical table로 연결 |
| A 이번 복원 | 대운 horizon / 14년 / 전환 | compact ledger + 전문 모두 보존 |
| A 이번 복원 | 세운 12개월 overview / 상세 | 월 목록 + 월 전문 모두 보존 |
| A 이번 복원 | 전체 명리 feature / 궁합 A/B 방향성 | 전체 부록 / pair spread와 방향별 장 |
| A 이번 복원 | 직업·관계 context / 최종문장 / 공유 | 실제 입력·packet 그대로 |
| B 후속 audit | V3 좋은 패·강점 structured block의 서사적 장점 | 같은 근거의 V4 coverage와 재미를 비교. 이번에 V3 본문 혼합하지 않음 |
| B 후속 audit | 해석 이유·Fusion 결합감 / 설명 밀도 | 아래 Deferred Content Quality Audit |
| C 의도적 제거 | 일반 목차 / 큰 반복 카드 / popup-only 근거 | 장 단위 독서 + 하단 각주 + 전체 부록 |
| C 의도적 제외 | 망신살 충돌 / DB-only / 숫자 궁합 | 기존 V4 evidence policy 그대로 |

## Deferred Content Quality Audit

**이번 Phase에서 수정하지 않았다.**

- 해석 이유/사주×MBTI 결합 설명이 충분히 와닿는가.
- V3에서 좋았던 장점·강점·좋은 패 서사가 V4에서 빠지거나 약해졌는가.
- 긴 본문의 실제 재미/밀도, 반복 문구·장면·직업/관계 context의 체감.
- 상품별 최종 content parity, MBTI unknown과 불확실 시간 입력의 품질 편차.
- 사용자 방향인 “사주아이의 읽는 재미 + V3의 정보/해석 장점 + V4의 Fusion/Book 경험”을 근거 보존 아래 통합하되 문구 복제·근거 발명은 하지 않는다.

## 검증과 시각 자료

- 단위 검증: 기본6 + unknown/approx + 궁합7category = 15 fixture. 원문 exact parity, 표 parity, 전체 appendix, 14/12 completeness, serialization, proof 비노출, 무네트워크, mutation 없음.
- 기존 public import 차단 테스트는 정확히 4개 dev-only consumer만 허용하도록 수정. server-only 또는 type-only 조건을 검사하며 public/default runtime 허용 범위를 넓히지 않음.
- 자동 타이머 fake-clock 검증: interval/manual/idle/side/hidden/reduced/중복timer/cleanup.
- Browser: `scripts/verify-v4-book-runtime.mjs`; 실제 golden JSON export 후 실행. `/tmp/gyeol-v4-8c/`에 screenshots, network/console/errors, 결과 저장.
- 데이터 export: `V4_BOOK_EXPORT=/tmp/gyeol-v4-8c/data pnpm test tests/unit/app/dev/bookRuntime.test.tsx`.
- 최종 실행 결과와 screenshot 검토는 아래 Final verification에 기록한다.

### Final verification

- 관련 V4/V3/역법/표/대운·세운/궁합/paid delivery/shared completeness/dev UI: **103 files, 2,235 PASS / 0 FAIL**. `/tmp/gyeol-v4-8c-final-tests.log`.
- 마지막 pointer CSS 보정 후 Book UI/timer **39 PASS / 0 FAIL** 재실행. `/tmp/gyeol-v4-8c-pointer-tests.log`.
- 최종 실제 브라우저 **405 checks PASS**. 390/430/768/1440의 가로 overflow/바깥 세로 scroll/내부 ID 노출 0, hydration/console/page error 0. 옆 책 실좌표 선택, auto/idle/hidden/reduced-motion, 긴 장 연타/scroll reset, 부모·상사 고정 역할 포함. `/tmp/gyeol-v4-8c/results.json`, `/tmp/gyeol-v4-8c-browser.log`.
- `pnpm lint` PASS, provider-disabled `pnpm build` PASS. 기존 V4 text/evidence golden hashes와 V3 회귀 유지.
- `pnpm exec tsc --noEmit`: baseline 389 / current 389 / 신규 diagnostic **0**. 기존 오류를 수정하거나 숨기지 않았다.
- 로컬 production-mode `next start`: `/dev/book-preview?fixture=annual&read=1` **404**, `/` **200**. public activation 없음.
- 실제 screenshot 검토 후 연도·나이 metadata를 본제목보다 작게 분리하고, 궁합 입력을 두 열로 압축했다. 원문 문자열/계산값은 불변.
- 긴 MBTI 장에서 perspective의 overflow가 바깥 문서로 전파되는 현상을 발견해 책 경계를 clip 처리했다. 본문은 내부에서 끝까지 scroll되며, 4개 viewport의 바깥 문서 높이도 자동 검사한다.
- 단일 현재 장만 mount, 검증 화면 DOM 1,200개 미만. 기본 6상품 customer DTO JSON 합계 약 306 KiB. 실제 기기 성능 benchmark는 아니며 로컬 viewport/animation 검증이다.
- 임시 캡처/JSON/log는 `/tmp/gyeol-v4-8c/`에 보관하며 Git에는 넣지 않는다. 재현 스크립트와 테스트만 커밋한다.

| 직접 확인한 대표 캡처 | 파일 (`/tmp/gyeol-v4-8c/`) |
|---|---|
| 책장 / 옆 책 선택 | `390-home.png`, `390-side-book-selected.png`, `430-home.png`, `768-home.png`, `1440-home.png` |
| 실제 만세력 / MBTI | `390-comprehensive-manse.png`, `390-love-manse.png`, `430-comprehensive-mbti.png`, `1440-comprehensive-manse.png` |
| 각주 / 전체 부록 | `390-chapter-bottom-notes.png`, `390-appendix.png`, `768-appendix.png` |
| 대운 / 세운 | `390-timeline.png`, `390-major-detail.png`, `390-months.png`, `390-annual-detail.png` |
| 궁합 / 예외 입력 | `390-pair.png`, `1440-pair.png`, `390-full-unknown.png`, `390-full-approximate.png` |
| 영수증 / 공유 | `390-receipt-guest.png`, `390-terms-detail.png`, `390-receipt-member.png`, `390-comprehensive-back-cover.png` |

dev-only 구조·데이터 통합의 남은 blocker는 없다. 실제 기기 Safari 검수와 실 공유/결제 연결은 이번 검증 범위가 아니며, 본문 품질의 최종 판매 가능 판정도 하지 않았다.

### 로컬 검수 URL

- [책장](http://127.0.0.1:3188/dev/book-preview)
- [종합](http://127.0.0.1:3188/dev/book-preview?book=full&read=1)
- [Career](http://127.0.0.1:3188/dev/book-preview?book=career&read=1)
- [Love](http://127.0.0.1:3188/dev/book-preview?book=love&read=1)
- [Compatibility](http://127.0.0.1:3188/dev/book-preview?book=compatibility&read=1)
- [Major](http://127.0.0.1:3188/dev/book-preview?book=major&read=1)
- [Annual](http://127.0.0.1:3188/dev/book-preview?book=annual&read=1)

구조적 출시 승인을 의미하지 않는다. 본문 품질, 실제 공유/checkout/member legal, public integration은 위 경계대로 별도 검수·승인이 필요하다.

## 다음 public integration 계획 (미실행)

1. 승인된 실제 packet→Book projection을 production-safe 읽기 경계로 이동하는 별도 작업.
2. 저장 snapshot/legacy read/shared full projection parity와 access/expiry/default-off gate 재검증.
3. guest/member legal audit 후 기존 checkout 계약과 UI만 연결. 인증/쿠폰/referral은 별도 승인.
4. 기존 share service에 approved cover projection 연결 및 SDK/native/copy 검증.
5. Deferred Content Quality Audit 완료와 별도 activation 승인 전 public V4 노출 금지.
