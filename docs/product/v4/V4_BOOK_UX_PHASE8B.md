# V4 Book UX — Phase 8B

## 범위 / 기준

- Branch: `v4/rebuild`; base `62db08879c65b2ce4f7c30d3b4745b3ce8e20f14`.
- `/dev/book-preview`만 변경. 개발 모드 외 404, public route 연결 없음.
- Phase 8A의 표지/페이지 넘김/발행 체험/서진 고정 샘플 유지. 새로운 계산·본문 생성·저장 없음.
- 공개 약관/푸터/리포트/결제/공유 runtime, 원문 데이터, fixture, 환경 파일 변경 없음.

## 실제 구현 감사 / 재사용

| 대상 | 확인한 source / contract | 이번 재사용 |
|---|---|---|
| 만세력 | `src/components/report-tables/ManseRyeokCommonTable.tsx`, `src/lib/report-tables/types.ts` | 기존 customer projection의 4열, 천간·지지, 십성, 상세 행, semantic colorToken |
| MBTI | `src/components/report-tables/MbtiCommonProfileTable.tsx` | full variant의 type/title/archetype/oneLine, 양쪽 선호축, 기능서열, 핵심 요약, 전체 keywords |
| 공유 | `src/components/report/ReportShareActions.tsx` | Kakao/공유/복사 3개 기능 위계와 동일 SVG geometry. SDK가 같이 import되지 않도록 dev-only presentation에서 사용 |
| 푸터/법적 정보 | `BusinessFooter.tsx`, `LegalPageLayout.tsx`, `src/lib/legal/businessInfo.ts` | 기존 소셜 URL/사업자 config, legal document 구분. 기존 visual token 미사용 |
| 법적 원문 | `src/lib/legal/{termsPolicy,privacyPolicy,refundPolicy}.ts`, `src/app/{terms,privacy,refund,business}/page.tsx` | 데이터 직접 import, route 안의 문장은 원문 그대로. 4개 문서 paragraph/table value parity test |
| 동의 | `src/components/payment/DevTossCheckoutLauncher.tsx`, `src/lib/payment/checkoutConsent.ts` | 6개 기존 assertion, adult/minor/under14 계약. 정책 3개는 기존 단일 grouped checkbox 유지 |

## Before → After

| 영역 | 8A | 8B |
|---|---|---|
| 만세력 | 한 셀에 한자/읽기/십성, 오행색 없음, 넓은 여백 | 천간/십성/지지/십성 분리, 29px 한자와 compact 10–11px 상세, 얇은 rule |
| 만세력 정보 | 상세 행은 이미 존재 | 하나도 삭제하지 않음. 음양·목木/화火/토土/금金/수水 text 추가; 원국/가중 수치 병기. 부동소수점 표시만 소수 2자리 이내 |
| MBTI | 큰 제목과 문단 세로 나열 | 선택축 밑줄+체크, 대조축 2열, 기능서열 표, summary dl. archetype/영문 축명/기능 attitude·domain 복원 |
| 공유 | 텍스트 row 3개 | 검정 뒤표지 안 icon+label 3열. `이 책 공유하기`, 거대 CTA 없음 |
| 영수증 | 긴 동의 문장·고지가 기본 노출 | 기존 항목별 짧은 label + 보기. 전체동의/개별동의/indeterminate. 상세 native bottom sheet |
| 독서 chrome | 상하단 모두 GYEOL REPORT | 위=서비스, 아래=현재 책 제목·페이지. Annual 선택 연도 표시 및 잘못된 값 fallback |
| footer/legal | public legal route로 이동 | dev-only 정책 bottom sheet + 단일 열림 accordion. 사업자 정보 기본 접힘 |

### 만세력 유지 필드

- 시/일/월/연주, 천간·지지 한자/독음, 각각의 십성, 오행, 음양.
- 지장간의 한자/십성, 십이운성, 십이신살, 신살/귀인, 계산된 원국 관계와 위치.
- 원국 8글자 오행 분포 + 지장간 포함 가중 수치.
- source에 없는 형/파/해나 별도 표식은 만들지 않음. `합·충` 행의 원래 label은 abbr title로 보존.
- canonical `wood-green/fire-red/earth-soil/metal-gold/water-sky` 의미 유지. 흰 종이에 맞춘 진한 녹/적/토/회/청색. 표지 accent와 분리.

### MBTI 유지 필드

- type, 한글 title, archetype, oneLine.
- E/I, S/N, T/F, J/P의 양쪽 code/nameKo/nameEn/description, 실제 선택 방향.
- 4개 기능의 순서/코드/한글명/태도/영역/설명.
- 정체성/강점/주의점/성장 전략 전부, 가까운 30개/먼 31개 키워드 전부.
- 리포트 활용 포인트 UI 제외 계약 유지. DB/trait injection 변경 없음.

## Guest / Member 영수증

- Guest: 기존 필수 5개(미성년자는 6개) 그대로. 개인정보를 별도 독립 assertion으로 임의 생성하지 않음.
- 전체동의는 현재 필요한 항목만 묶으며 개별 해제 가능. 일부 선택은 mixed 상태.
- 긴 동의 원문/환불 안내/개인정보 고지/정책 전문은 `보기`에서 접근. 기본 영수증에는 펼치지 않음.
- optional marketing 항목 없음. 실제 결제/동의 evidence 저장하지 않음.
- Member: 일반 grouped policy 동의를 가입 시 완료했다고 가정하는 **체험 상태만** 유지. 입력/생성/환불/연령/미성년 고지는 보존.
- **member checkout legal audit required before activation**: 실제 production에는 이러한 member 면제가 없으며, 이번 prototype이 법적 면제의 근거가 아님. 가입 동의와 구매별 필수 동의를 activation 전에 다시 매핑해야 함.
- native dialog의 close 후 unmount 순서로 Escape/닫기/배경 클릭 및 focus 복귀 보장. 약관은 원래 보기 버튼, 각주는 자동 스크롤을 피하도록 읽던 영역에 복귀. dialog 안 화살표가 배경 책 페이지를 넘기지 않음.

## Kakao support migration audit (공개 원문 변경 없음)

| 분류 | 위치 | 현재 표시 / 후속 조치 |
|---|---|---|
| A 연락처 유지 | `businessInfo.ts`; `/business` businessInfoRows | 상호/대표/등록/주소/전화/이메일/도메인/호스팅 전부 유지. prototype은 tel/mailto CTA가 아닌 receipt text |
| B 행동 안내 | `termsPolicy.ts` `고객 문의 및 분쟁 처리` (139행) | 전화 또는 이메일 접수 문장. 이후 legal/copy audit에서 Kakao 행동 안내 전환 검토 |
| A+B 구분 필요 | `/privacy/page.tsx` `개인정보 문의처` (124–127행) | 개인정보 권리 행사 채널은 일반 상담과 다를 수 있음. 연락처 보존, 법적 검토 없이 대체하지 않음 |
| B 행동 안내 | `/refund/page.tsx` `문의 방법` (50–54행) | 요청 시 전달할 정보는 유지; 접수 CTA만 후속 Kakao 전환 대상 |
| A+B 혼재 | `BusinessFooter.tsx` address contacts (35–39행) | 법적 연락처는 접힘 영역에 계속 표시; 문의 primary는 기존 Kakao chat |
| B 보조 소개 | `/business/page.tsx` description (25행), `termsPolicy.ts` `사업자 정보` (24행) | 사업자 정보와 문의 채널을 함께 소개. 이후 연락처/문의 행동의 분리 검토 |
| 유지 | `refundPolicySupportRequestGuidanceKo`, privacy 문의처리 목적 문구 | 이메일/전화로 유도하지 않음. 변경 대상 아님 |

Prototype support presentation: `고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.` + `/chat` 링크. 법적 원문은 현재 문구임을 명시하고 그대로 보존한다. 전문을 요약하거나 연락처를 삭제하지 않는다.

## 검증 / screenshots

- Local URL: `http://127.0.0.1:3188/dev/book-preview`.
- Browser acceptance: `scripts/verify-v4-book-preview.mjs`, artifacts `/tmp/gyeol-v4-8b/`.
- 관련 regression **58 files / 1,223 PASS**, 이 중 prototype unit **29 PASS**. 마지막 scroll/MBTI 열 너비 보정 후 전체 해당 regression 재실행.
- lint / production build / diff-check PASS. tsc baseline 389, 현재 389, 신규 diagnostic 0 (file/line/code 비교).
- 로컬 production 서버: `/dev/book-preview` 404, `?preview=true`도 404, `/` 200. 서버 종료; 배포 아님.
- browser acceptance **113 checks PASS**: 390/430/768/1440 표와 nav, MBTI 설명 열 너비, consent sync/indeterminate/상세/Escape, member, 16페이지 이동, 각주, 3개 share demo, footer/business, 법률 단일 펼침, 연도 선택 title, reduced motion. hydration/console/page error 0, backend/provider 요청 0.
- React/Next 경계 검토: client state만 변경, 직접 data import, public server action/SDK import 없음. 별도 실제 Chrome 창에서도 각주 Escape → 만세력 이동 확인.

### 실제 확인한 screenshots

경로 prefix: `/tmp/gyeol-v4-8b/` (임시 검수 산출물, Git에 넣지 않음).

| 390 | 430 / 768 / 1440 |
|---|---|
| `390-manse.png`, `390-manse-elements.png` | `{430,768,1440}-manse.png` |
| `390-mbti.png`, `390-mbti-functions.png`, `390-mbti-keywords.png` | `{430,768,1440}-mbti.png` |
| `390-receipt-guest.png`, `390-guest-terms-detail.png`, `390-guest-terms-expanded.png` | — |
| `390-receipt-member.png` | — |
| `390-back-cover.png`, `390-report.png` | `1440-back-cover.png`, `{430,768,1440}-report.png` |
| `390-footer.png`, `390-footer-business.png` | `1440-footer.png` |
| `390-legal-collapsed.png`, `390-legal-terms.png`, `390-legal-privacy.png` | `1440-legal.png` |
| `390-annual-nav.png` | `{430,768,1440}-annual-nav.png` |

표의 한자/텍스트 겹침·잘림, 가로 스크롤, 하단 nav 브랜드 중복 없음. 원문과 긴 MBTI keyword는 세로 스크롤로 전부 읽는다. 일반 chapter는 계속 흰 종이/검은 글, black은 뒤표지에만 사용.

### 검증 환경 주의

- 이 로컬 agent-browser/Chrome 154 **headless** 조합은 각주 종료 다음 CDP 명령에서 timeout이 반복됐다. **headed** 실행에서는 전체 113건 통과했고 실제 Chrome 창의 동일 동작도 통과했다. headless timeout을 테스트 PASS로 집계하지 않음.
- 재현 명령: `BOOK_BROWSER_HEADED=1 BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-book-preview.mjs`.
- iOS Safari 실기기/실제 키보드 검수는 미실행. viewport 검수를 실기기 인증으로 해석하지 않음.

## 남은 범위 / 다음 단계

- 검수한 viewport에서 남은 visual blocker 없음. 실기기 Safari/키보드 및 아래 실제 계약 연결은 별도 검증 대상.
- 개발용 고정 샘플. 사용자 입력으로 리포트를 재생성하지 않으며 6표지의 본문은 동일 서진 샘플임을 계속 표시.
- 실제 결제/회원 동의면제/공유 SDK는 연결하지 않음. 상태·버튼 디자인만 검토 가능.
- 실제 runtime integration 전: 승인된 table presentation에 기존 production customer projection을 연결 → 각 상품 title/year/role·unknown/approx fixture 검증 → legal audit 및 동의 계약 매핑 → 기존 share handler의 세 액션 연결. public 활성화는 별도 승인 필요.
- 법률 renderer의 route-only 원문은 production과 parity test로 동기화. 향후 공통 legal content contract 추출은 별도 작업이며 이번에는 public 파일을 건드리지 않음.
