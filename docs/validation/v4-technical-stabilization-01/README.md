# V4 Technical Stabilization 01

지정된 지속 worktree와 기존 브랜치에서 수행했다. Base `7ef25fcc0ae6f7765473433a826cb7cf96068a7b`. Node24.22.0(공식 checksum 검증), pnpm10.33.0, frozen lockfile을 사용했다. 원본 checkout과63개 다른 등록 worktree를 보존했다. 새 branch/worktree 생성, 복구, 정리, 환경 파일 복사는 하지 않았다.

현재 Base는 strict TypeScript0건·lint PASS·Webpack Production build PASS였다. 과거 Release Stabilization의390건 진단이나 Page export 실패를 이번 실패로 취급하지 않았다. 과거56개 중55개가 재현됐고, BusinessPartner1개는 기본 설정에서 이미 통과했다. 이번 수정은 기존 테스트19개와 새 검증 계약·자료에 한정된다. **src·계산·MBTI·Fusion·원고·Book Adapter·결제·인증·Worker·운영 설정 변경0**이다.

## 최종 결과

기존6953개 동일 test identity를 비교해6898 PASS/55 FAIL에서6953 PASS/0 FAIL로 검증했다. 신규 계약32개·Origin/binding4개와 기존 UI 회귀를 포함한 최종 7152개/38파일은 모두 통과했다. 저장소 전체 suite를 실행했다고 주장하지 않는다. 최종 pending/skip0이며 전역 timeout·Vitest 설정·검사 옵션은 바꾸지 않았다.

|코호트|PASS|FAIL|
|---|---:|---:|
|related|5887|0|
|business-partner|383|0|
|runtime|40|0|
|governance|558|0|
|publication|30|0|
|governance-slots|59|0|
|contracts|32|0|
|ui|163|0|

strict TypeScript0건, ESLint PASS/경고0, `next build --webpack` 전체 Production build PASS, diff-check PASS. 기본 Turbopack 로컬 빌드를 실행했다고 주장하지 않는다. 동일한 disabled writer/confirm/reliability flags로 전후 비교했다. 상세 명령·시간·실제 오류·정규화 signature는 [테스트 비교](before-after-test-comparison.json)와 [원인별55개](failure-root-cause-matrix.json), 외부 원본 로그를 참조한다.

## 확인한 원인과 최소 수정

- Book11개: 저장된 Reader의 제목·purpose·본문·주소를 직접 대조하고 원문 전체 순서·최종 문장·목차 target·anchor 고유성을 검사한다. 전환 연도는 기존 `majorYearPeriod`의 두 대운 표시 계약으로 검증한다. 현재 제목 문자열을 새 literal로 덮어쓴 수정이 아니다.
- 과거 Edition22개: 과거 lock 파일과 inline 원래 hash를 보존한다. 변경 전 Base에서 실제 생성한 현재/legacy-composer-on-current-source의 결과를 별도 fixture로 고정하고, 실제 과거 저장본3개도 변경 없이 재열람한다. 현재 생성기를 과거 source에서 실행한 것처럼 주장하지 않는다.
- 정적 격리3개+Runtime1개: TypeScript AST로 명시적인 type-only와 실제 실행 import를 구분한다. Base의 정확한 실행 edge와 공개46개 진입점/700개 모듈 전체를 고정한다. 값 import·재수출·지연 import·require·계산식 import 및 type→value 변조를 음성 테스트한다. Offline 연구/Planner/Publication의 고객 유입0을 유지한다.
- 배정2개: 기존 회복 classifier가 요구하는 실제 회복 의미가 없는 단위 fixture를 보완한다. 축/flag만 있는 일반 문장을 회복으로 승격시키지 않는 음성 검증도 유지한다. Scheduler/배정 알고리즘은 바꾸지 않았다.
- 대운 요청2개: 잘못된 Origin의 빈403 응답을 JSON 성공으로 가정하던 fixture를 교정한다. 실제 same-origin·binding 코드와 새 결제 전 검증은 그대로 실행하고 외부 auth/library port만 mock한다. 누락/외부 Origin403 및 binding 실패503도 확인한다.
- 연구 보존6개: 원래 hash manifest를 유지하고 Publication Safety/Trace 수정과 이번 테스트의 정확한 before→after chain만 허용한다. [버전 계약](versioned-regression-validation.json)의 원본9개 receipt도 보존한다. 실제 source/연구 내용 변경은 허용하지 않는다.
- 시간 초과8개: PGlite 문제가 아니라 한5000ms 테스트에서 기준+교환 원고를 모두 생성한 사례다. 기준 입력은 bounded60000ms fixture 준비로 분리하고 기존 동일 입력1개를 재사용한다. 각 테스트는 교환 원고를 실제 생성하며 기본5000ms를 유지한다. 전체 생성량은16→15이며 큰 제품 성능 개선을 주장하지 않는다. 독립 PGlite 초기화/첫 쿼리는 523.84ms, 동일 로컬 SQL 준비는 44.63ms였다. [측정·한계](performance-timeout-analysis.json).

추가 UI 검사에서는 Base와 동일한 `bookReading13b`의 전역 hook이6권 생성 중 기본10000ms를 넘어16개 assertion이 실행되지 않았다. 책별 기본10000ms hook으로 격리해 모든 원래 assertion을 유지했으며 gesture/순수 navigation 검사는 생성과 분리했다. 추가 UI hook 실패는 최초55개 테스트 실패와 별도 기록하고, 최종 UI163개는 모두 실행해 통과했다. 실행 입력·source가 바뀌지 않은 기존 통과 코호트는 실제 이전 실행 결과를 유지하고, 영향받은 코호트만 다시 실행했다. `after-verified/selection-provenance.json`은 각 결과의 원본 실행을 명시하며 한 번에 실행한 전체 suite 결과처럼 합성하지 않는다.

신규 검증 중 공개 section에 내부 ID가 있다고 가정한3개 assertion, binding 실패에 도달하기 전 mock config가 없어 차단된1개 assertion, callback union 진단1개를 발견해 교정했다. 중간 로그를 보존했으며 최종 전체 검증의 신규 실패·진단은0이다.

## 계산·원고·발행·UI 보존

기존 통합17권/102개 digest가 원래 한국어 지식 baseline과 전후 모두 일치한다. 전체 raw packet/Book/snapshot JSON도 byte 동일하다. UI golden15권 전체 Book JSON도 byte 동일하다. 종합13장52문단, 커리어·연애·궁합9장36문단, 궁합7유형의 역할/양방향, 대운14년·정확 교운, 세운12개월·절기 및 미상 입력 계약은 기존 테스트와 실제 생성으로 보존한다. 실제 고객 DB의 저장본을 조회·수정·재생성하지 않았다.

실제39사례는 **32 SAFE_OFFLINE /7 WITHHELD**를 유지한다. 차단 사례는 coworker W, managerReport AJ/AK, businessPartner AM/AN, friendship A0/H0다. ParentChild CH06.P4/CH08.P2의 성인 자녀 선택권과 미입력 법적 권한/동의 UNKNOWN을 유지한다. 독립2회 생성의5개 논리 JSON 산출물이 byte 동일하고 기존21개 변조 시나리오는 모두 차단된다.

고객 Bridge/실제 Operator approval/Customer approval/Book allocation은0이다. 잔여 source2677, domain2966(명시 금지1040), 대운 SOURCE_INTEGRITY30, 원본 Reader2060은 **이전 감사 기준선**이며 이번에 해결됐다고 선언하지 않는다. [발행 안전성](publication-safety-preservation.json).

NFT 90개와 모든 dependency set, 고객 runtime graph가 전후 동일하다. UI 회귀는 책장4500/8500ms·실제 발행 상태·서재 로딩·공식 카카오 아이콘·공유/OG·서재/기존 열람 경로를 포함한다. UI를 다시 개발하지 않았다. 실제 브라우저 구매/로그인·실결제·운영 DB 검증은 이번 범위에서 실행하지 않았다.

## 보존·Git·후속 경계

원본 dirty11개와 다른63개 worktree의 HEAD/branch/status/기존 파일 hash, 포렌식915개 파일을 보존했다.17개 유실 worktree는 복구/정리하지 않았다. 현재 branch commit/push로 발생하는 Ref/Object/현재 index/reflog 변경은 의도된 Git 관리 변경이며 metadata 변경0이라고 주장하지 않는다. [보존 검사](workspace-preservation.json).

최종 commit/remote SHA/정확한 Vercel Preview identity·READY는 commit 후 영구 외부 `/Users/Deokmin/Documents/gyeol-validation/v4-technical-stabilization-01/git-preview-receipt.json`에 기록한다. README 자체에 미래 commit SHA를 조작해 넣지 않는다. 최종 사용자 보고와 그 receipt를 함께 확인한다.

기술 인계는 준비됐으나 고객 활성화·판매 품질·Production 배포 승인은 별개다. 기존 출시 runbook의 콘텐츠/UI 통합, 최종 회귀·실측 성능 점검, 전체 원고 독해, 카카오 앱 아이콘 수동 등록, Google OAuth 브랜딩, master/Production 검증, 이벤트 운영자 승인과 광고 순서를 보존한다. 이번 작업은 master merge/push·Production·DB/migration·실결제/환불·이벤트 활성화·광고·최적화를 실행하지 않았다. [Protected Staging 인계](protected-staging-handoff.json)의 다음 작업은 시작하지 않았다.

외부 대용량 원본/측정/로그: `/Users/Deokmin/Documents/gyeol-validation/v4-technical-stabilization-01`. 신규 테스트 fixture에는 hash/주소/시각만 저장하며 실제 고객 데이터·비밀키·새 해석 원문은 포함하지 않는다.
