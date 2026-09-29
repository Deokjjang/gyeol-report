# 공유·브랜드 시스템

외부 링크는 `https://gyeolreport.com/r/gr_...` 형식입니다. 서버에서 192비트 무작위 토큰을 만들며 URL에 이름·상품·생년월일·MBTI·내부 reportId를 넣지 않습니다. 카드는 이름(최대 20자)과 상품명, 상품별 브랜드 설명, 고정 이미지 `/brand/gyeol-report-og.png`만 사용합니다. 제공받은 원본 이미지를 그대로 보존했습니다. 프로필 이미지는 이미 사용자가 적용했으므로 중복 저장하지 않습니다.

공유 페이지는 현재 유료 리포트 화면을 그대로 재사용합니다. 매번 기존 read_report 조회로 결제·완료·유효기간을 확인하고, 게시 검증을 통과해야 열립니다. 공유 링크를 가진 사람은 리포트 전체를 볼 수 있으며 이 사실을 공유 버튼 아래 안내합니다. 현재 구매 리포트 URL의 bearer 접근 방식을 유지하고, 로그인이나 새로운 결제 절차는 추가하지 않았습니다.

## 적용 전 필요한 작업

1. 새 migration `20260929113608_report_share_links.sql`을 검토하고 별도로 적용합니다. 이번 구현에서는 운영 DB에 실행하지 않습니다. 기존 결제·Toss·API·legal 파일은 변경하지 않습니다.
2. 기존 서버 환경의 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAID_REPORT_RELIABILITY_ENABLED=1`이 필요합니다. 서비스 키는 서버에서만 사용합니다. `report_share_links`는 RLS를 활성화하고 서비스 역할만 접근할 수 있습니다.
3. 카카오 JavaScript 키를 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`로 설정한 뒤 다시 빌드합니다. JavaScript 키는 공개용이며 REST API 키·Admin 키·서비스 키를 넣으면 안 됩니다.
4. Kakao Developers → 앱 → 플랫폼 키 → JavaScript 키 → **JavaScript SDK 도메인**에 `https://gyeolreport.com`과 `https://www.gyeolreport.com`을 등록합니다. 현재 운영 사이트는 www로 전환되므로 두 도메인이 필요합니다. 테스트 도메인은 필요할 때 별도로 등록합니다.
5. 앱 → 제품 링크 관리 → **웹 도메인**에도 두 도메인을 등록합니다. SDK 도메인과 카드 링크 도메인은 별도 설정입니다. 카카오 로그인 설정은 필요하지 않습니다.

공식 문서: [SDK 시작하기](https://developers.kakao.com/docs/ko/javascript/getting-started), [카카오톡 공유](https://developers.kakao.com/docs/ko/kakaotalk-share/js-link), [제품 링크 관리](https://developers.kakao.com/docs/ko/app-setting/app#product-link).

## 동작과 운영

- 첫 공유 시 서버 액션이 링크를 만들고, 이후 같은 리포트는 같은 링크를 사용합니다. 동시 요청은 report_id 유일 제약으로 합쳐집니다. 읽기 요청은 새 링크를 생성하지 않습니다.
- 처음 링크를 만드는 동안 모바일 사용자 클릭 권한이 만료될 수 있으므로, 최초 카카오·네이티브 공유에서는 링크 준비 후 한 번 더 누르도록 안내합니다. 이후에는 바로 공유 화면을 엽니다.
- 카카오 키 없음·SDK 로딩 실패 시 동일 공유 링크 복사로 전환합니다. 일반 공유는 Web Share API를 쓰고, 미지원·오류 시 복사합니다. 취소 시 복사하거나 공유 성공 이벤트를 기록하지 않습니다.
- Instagram DM 표시 여부는 기기·설치 앱·운영체제에 따라 달라집니다. 웹에서 특정 앱의 표시를 강제하지 않습니다. [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- 자동 복사도 거부되면 공유 링크를 선택할 입력란을 제공합니다. 내부 구매 URL을 대신 복사하지 않습니다.
- 공유 페이지는 noindex/nofollow/noarchive와 no-referrer를 사용합니다. robots.txt로 공유 경로를 차단하지 않아 미리보기 크롤러가 메타데이터를 읽을 수 있습니다. 초기 HTML head에 OG/Twitter 정보를 포함합니다.
- 공유 테이블이 아직 없거나 서버 설정이 빠졌으면 공유만 안내 메시지와 함께 실패하며 기존 리포트 열람은 유지됩니다.
- `revoked_at`이 설정된 링크는 열리지 않고 재발급으로 덮어쓰지 않습니다. 만료·환불·미완료 리포트도 공개하지 않습니다. 원본 리포트 삭제 시 연결도 삭제됩니다. 토큰은 접근 권한이므로 로그·분석 데이터에 넣지 않습니다.
- 기존 구형 `rpat_` 경로는 보존했습니다. 현재 공유 기능은 최신 유료 저장소의 6개 상품을 대상으로 하며, 구형 저장소의 이전 RPC 권한을 다시 열지 않습니다.

## 분석 확장

브라우저 `gyeol:share` CustomEvent에 `{ event, product }`만 전달합니다. 이벤트는 `share_kakao`, `share_native`, `share_copy`, `shared_report_open`입니다. 이름·URL·토큰·reportId는 전달하지 않습니다. 실제 분석 저장은 연결하지 않았으며, 공유 화면 열림과 실제 수신자 전달 완료는 구분해야 합니다. 특히 카카오 이벤트는 SDK 호출 성공 시점입니다.

## 검증

`pnpm test`, `pnpm lint`, `pnpm build`를 실행합니다. 공유 전용 테스트는 `pnpm exec vitest run tests/unit/sharing/reportSharing.test.tsx tests/unit/components/ReportShareInteraction.test.tsx`입니다. 새 테이블 제약·권한은 로컬 PGlite에서만 실행합니다.

브라우저 검증용 합성 데이터는 `SHARE_QA_DIR=/absolute/local/path pnpm exec vitest run tests/unit/sharing/reportSharing.test.tsx`로 생성하고, 같은 환경변수로 `node tests/fixtures/report-sharing/server.mjs`를 실행합니다. 서버는 127.0.0.1:3140에만 바인딩됩니다. 별도 Next 서버의 SUPABASE_URL은 이 주소, 서비스 키는 로컬 더미 값으로 설정합니다. 실제 운영 비밀값을 사용하지 않습니다.

배포 후 확인: 실제 /r/ 링크의 HTML head, 고정 이미지 URL의 공개 HTTP 200, 카카오 실기기 공유, iOS/Android 공유 시트. 운영 배포와 migration 적용 전에는 이 브랜치의 변경이 운영 도메인에 반영되지 않습니다.

## 이번 작업의 검증 기록

- 시작 기준: v3/rebuild, e33f4c3bbc06e8010ed04371875d8461939b2908. 원본의 .gitignore / AGENTS.md / supabase/.temp 변경을 보존하고 feat/share-brand-system 작업 폴더에서 구현했습니다.
- 전체 테스트: 4,563개 통과, 기존 실패 3개 유지(원본 기준 4,543개 통과/동일 3개 실패). 실패는 legalPagesSource, policyPagesSource, compatibilityPreviewPageSource의 기존 문구 기대값입니다. 관련 없는 파일은 수정하지 않았습니다.
- lint 통과. Next.js 프로덕션 빌드 통과. 별도 전체 tsc는 원본에도 존재하는 테스트 타입 오류 때문에 깨끗하지 않으며 새 공유 파일의 진단은 해결했습니다.
- 6개 V3 상품의 직접/공유 렌더링 HTML 일치, 무작위 토큰 동시 발급, 철회·미결제·미완료·만료·잘못된 스냅샷 차단 테스트 통과.
- 로컬 Next HTTP 검증: 6상품 × 카카오/Meta/Twitter User-Agent 18회, 초기 head의 OG/Twitter/noindex, 고정 이미지 응답과 원본 해시 일치, 아이콘 3종 HTTP 200 통과.
- 모바일 390px 브라우저에서 3버튼·하단 CTA·가로 넘침 없음 확인. 브라우저 API 모의 주입으로 native 성공/취소/미지원, 카카오 키 없음, 자동 복사 거부 시 수동 선택을 확인했습니다. 콘솔 오류·오류 화면 없음.
- 실제 서버 액션으로 로컬 합성 세운 리포트의 새 무작위 링크를 발급하고 해당 공유 URL에서 전체 본문과 동적 제목이 열리는 것을 확인했습니다.
- 카카오 SDK 초기화·카드 구성은 모의 SDK로 검증했습니다. 실제 카카오 메시지 발송, Instagram 실기기 DM, 운영 DB 변경·운영 배포는 수행하지 않았습니다.
- 최종 공유 관련 검증 5개 파일/29개 테스트 통과. 운영 이미지 URL은 배포 전 확인 시 www로 308 전환 후 404이며, 로컬에서는 200입니다. 운영 반영 후 공개 접근을 다시 확인해야 합니다.
