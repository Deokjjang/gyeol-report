# V4 Protected Staging Integration 01

독립 검수 앱과 로컬 실제 생성 경로 구현·검증을 완료했다. **원격 보호 Staging은 PROTECTED_DEPLOYMENT_BLOCKED**다. 현재 팀에는 기존 결리포트 프로젝트만 있다. 기존 프로젝트의 설정·환경은 수정하지 않았고 새 프로젝트 생성/보호 설정은 관리자 작업으로 남겼다. 일반 Preview READY를 보호 Staging 완료로 해석하지 않는다.

Base `1b89d8d90fdad2b0a82b783e2d948c9cc5de878f`, 새 지속 worktree/branch `v4/protected-staging-integration-01`. 원본 checkout dirty11개와 기존64개 등록 worktree/포렌식915파일 보존을 외부 최종 receipt에서 확인한다. 새 branch/worktree/index/ref/object 등록은 의도된 Git metadata 변경이다.

## 구현

`tools/protected-staging`에 독립 앱을 추가했다. 추가로 기존 테스트2개의 준비만 분리하고 원래 hash를 보존하는 정확한 버전 계약을 추가했다. 로컬 UI는 기존 ReportInputPayload, enum, BOOKS와 normalizer를 사용하며 6상품/7관계/39기존 fixture 또는 새 가상 입력을 지원한다. 원래 `prepareOfflinePublication`의 비공개 세션 검증→Publisher→Snapshot→storedBook/JSON 재열람을 통과한 결과만 독립 Ed25519 서명으로 내보낸다. Writer/계산/Offline guard는 그대로다. VERCEL을 지우거나 NODE_ENV를 위장하지 않는다.

Reader는 별도 Next 애플리케이션이다. 원래 BookReader/BookPage/CSS/표지/표/목차/연도/월/양방향/각주/부록/마지막 문장을 사용한다. BookReading의 analytics·저장·계정·결제·공유·추천 부수효과는 마운트하지 않는다. 서버는 서명·정확한 Source SHA·Book hash·버전·테스트 전용 상태를 검증하며 계산/Writer를 실행하지 않는다. 서명은 Official Approval을 대체하지 않는다. 기본 Vercel 정책은 전부 차단이다.

## 실제 검증

39사례32 SAFE_OFFLINE/7 WITHHELD 및12전문 경로를 유지했다. 차단은 coworker W, managerReport AJ/AK, businessPartner AM/AN, friendship A0/H0다. 이름·생일 변경, MBTI/시간 미상과 대략 시간 입력을 실제 생성했다. 17권/102기존 digest와 전체 raw packet/Book/snapshot은 byte 동일하다.

기존38파일7152케이스와 신규40케이스를 통과했다. 저장소 전체 suite PASS라는 의미는 아니다. 기존 사업파트너 산출물1건(5.44초)과 runtime2건(6.32/5.39초)은 최초 실행에서 실패했고 기본 설정의 독립 실행과8GiB heap 비교에서도 재현했다. 오류는 명시적인5000ms timeout이었다. heap 확대는 해결책으로 채택하지 않았다. 실제 fixture 생성/산출물 작성만 기존 bounded beforeAll 준비로 옮겼고, 기존 이름·assertion·입력·생성 횟수·기본 timeout을 유지했다. 최종 검증은 기본 heap이다. 최초 결과와 재실행 provenance를 보존했다. 기존 테스트2파일의 준비 위치만 수정하고 helper에 정확한2개 before→after 계약을 추가했다. 원래19개 계약·역사 receipt는 byte 동일하다. 삭제/skip/전역 timeout 증가는0이다.

strict TypeScript0, lint PASS, 고객 앱 및 독립 Reader Webpack Production build PASS. 고객 AST46진입점/700모듈은 정확히 같다. 고객 NFT90개의 실제 source/package 의존성은 같다. Raw trace의72개는 새 worktree 빌드 chunk 이름이 달라 byte 동일이라고 주장하지 않는다. Reader NFT에는 연구/Writer/개인 키/생성 Book이 없다.

설치된 Chrome의 로컬 실제 브라우저에서32권679페이지를 순회하며 모든 해석 문단 문자를 원본과 대조했다. 320/390/430/768/1440px, 키보드·목차·페이지·refresh/reopen·각주를 확인했다. 실제 기기/Safari/Kakao 또는 원격 사용자 인증 검증은 수행하지 않았다. 브라우저 외부 요청·오류0이다. 별도 변조11건은 digest를 다시 계산해도 전부 차단했다.

기존 애플리케이션(src)/고객 런타임/계산/연구/원고/기존 Book/운영 DB/결제/Auth/Worker/Production 설정 변경0이다. 고객 Bridge/실제 승인/새 고객 배정0은 이번 검증 실행 범위이며 운영 DB 전수 조회 결과가 아니다.

## 사용·관리자 작업

실행법과 키 관리: [도구 안내](../../../tools/protected-staging/README.md). 로컬 입력 `http://127.0.0.1:4317`, Reader `http://127.0.0.1:4318`. 전체 가상 Book과 대형 로그는 외부 Documents 검증 경로에만 보관한다.

관리자는 별도 Preview 전용 프로젝트·Vercel Authentication·명시적 검수자 제한·Shareable/Bypass 차단을 설정하고, 정확한 project pin/공개 검증 키를 별도 검토한 후 비로그인/비인가/인가·직접 API/static·cache/log/header를 실제 검증해야 한다. 기존 프로젝트 설정 변경이나 Production 배포는 이번에 실행하지 않았다.

최종 보고 commit SHA/remote match, 최종 SHA에 맞춘 독립 재생성·digest 비교, 소스/워크트리 보존 및 로컬 UI 결과는 자기 참조 SHA를 피하기 위해 외부 `/Users/Deokmin/Documents/gyeol-validation/v4-protected-staging-integration-01/final-receipt.json`에 확정한다. Source SHA가 다른 예비 산출물을 최종 Reader에 전달하지 않는다.

HUMAN_READING_APPROVED, CUSTOMER_RUNTIME_AUTHORIZED, SALES_QUALITY_APPROVED, Production Deployment Approved는 모두 false다. 원격 Staging READY는 선언하지 않으며 다음 연구/활성화/배포 작업을 시작하지 않았다.
