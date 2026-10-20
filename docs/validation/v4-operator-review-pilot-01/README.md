# V4-OPERATOR-REVIEW-PILOT-01

기존 오프라인 Workbench를 실제 Chrome의 `file://` 환경에서 검증하고 재현된 UI 문제 3개만 수정했다. 사람의 원문 의미 심사나 고객 사용 승인을 대신하지 않는다. 실제 판정·운영자 승인·고객 승인·선택·Claim·Book 배정·ApprovalRecord는 모두 0이다.

## 운영자 시작점

[검토 화면](review-workbench.html)을 Chrome에서 열고 [운영자 가이드](operator-review-guide.md)를 따라 읽는다. ‘첫 검토 묶음 37개 보기’는 READ 필터의 바로가기다. 36개 원문과 37개 적용 카드를 구분한다. 전체 6,965개 Unit의 정확한 ID 검색이 가능하며 미독해 항목에는 판정 입력이 없다.

[카드별 검토 요약](first-wave-review-summary.md)과 [읽기 순서](first-wave-review-priority.json)는 기존 원문·모델 제안·Source·Witness·Domain·반례·실제 맥락·Gate·다음 행동을 인수한다. 이 순서는 운영자 업무 순서이며 고객 Rank나 원래 Gate를 변경하지 않는다. 요약만 읽고 실제 원문을 읽었다고 처리하지 않는다.

초안은 탭 메모리에만 있다. 새로고침·탭·브라우저 종료·강제 종료에 대비해 JSON을 자주 내보내고 실제 다운로드 파일을 확인한다. 다음 접속 시 가져온다. beforeunload는 Chrome에서 실제 확인했지만 브라우저가 생략하거나 강제 종료 시 실행하지 않을 수 있다. 자동 업로드·자동 저장·공식 승인 보관소는 구현하지 않았다.

## 기준과 수정

- Base: `v4/semantic-domain-review-workbench-01` / `428199630a1a70796cf79ba3234cf2a74c1be0ba`.
- 작업: 독립 worktree `/private/tmp/gyeol-operator-review-pilot-01`, branch `v4/operator-review-pilot-01`.
- 현재 기준은 기존 worktree 56개, 미커밋 파일 11개, Base 추적 파일 5,427개였다. 과거 55개 기록과 구분한다.
- 기존 파일 수정은 `offlineUi.ts` 한 개다. 기존 5,426개 파일 및 모든 원문·Proposal·Source Proof·Packet·Scope·ReviewUnit ID·승인 경계는 보존했다.
- 모바일 Domain 필터의 intrinsic width로 전체 화면 폭이 402px까지 늘어나는 문제를 label 폭 제한으로 수정했다.
- 안내 없이 메모가 사라지는 문제에 미저장 표시·다운로드 요청 안내·재접속 Import 안내·조건부 beforeunload를 추가했다. Draft 형식과 validator는 변경하지 않았다.
- 판정 변경 시 DRAFT_SELECTED 목록이 늦게 갱신되는 문제를 해당 change handler의 목록 갱신으로 수정했다.
- 작은 READ 바로가기와 details의 명시적 focus-visible 표시를 추가했다. 기존 UI를 재설계하지 않았다.

## 실제 검증과 한계

실제 설치된 Google Chrome 155.0.8059.84를 Playwright로 실행했다. headless 실제 Chrome이며 JSDOM 결과와 분리한다. Desktop 1920×1080 / 1440×900 / 1024×768, Tablet 768×1024, Mobile viewport 390×844 / 375×812 / 320×568에서 37개 카드 전수를 열었다. 화면별 가로 넘침은 0px이다. 이는 실제 휴대폰 Safari/Android 하드웨어 검사와 다르다.

Chrome 검증은 36개 묶음 assertion과 37개 카드/7개 화면/48개 필터 옵션/6,965개 전체 ID 검색/16개 부정 Import를 포함한다. 실제 클릭·입력·키보드·JSON 다운로드 파일·가져오기·독립 CLI 검증을 실행했다. 합성 Draft는 `SYNTHETIC_BROWSER_TEST_DRAFT`이며 Git에 포함하거나 운영자 판정으로 집계하지 않았다.

CSP가 허용 script/style을 실행하고 외부 script·fetch·image·font 및 미허용 inline script를 실제 차단했다. 악성 문자열은 textContent로 표시됐으며 실행 요소가 생기지 않았다. 원시 Console에는 이 의도적인 차단 오류를 남겼다. CSP 완화나 외부 서버/CDN/API 사용은 없다.

실제 키보드 Tab/Shift+Tab/Enter/Space/Select/Textarea/details와 focus-visible, ARIA 상태 및 control label을 확인했다. axe 자동 WCAG 검사 위반은 0이다. 실제 VoiceOver/스크린 리더 세션은 UNVERIFIED다. 자동 검사와 스크린샷은 사람의 품질 승인 증거가 아니다.

Safari WebDriver는 `You must enable 'Allow remote automation' in the Developer section of Safari Settings`로 세션 생성이 차단됐다. 설정을 변경하지 않았다. Safari 검증은 UNVERIFIED다. CUA 재시도도 `Sky Computer Use native pipe startup failed`였다. Chrome의 별도 자동화 경로로 작업을 계속했다.

실제 초기 HTML/첫 카드 104.42ms, 초기 ScriptDuration 14.765ms, 검색 중앙값 4.66ms, 필터 중앙값 4.01ms, 검색+카드 전환 중앙값 32.33ms, JSON export 36.42ms/import 5.63ms였다. 한 번 측정한 환경의 결과이며 임의 SLA/PASS 임계값은 만들지 않았다. 99회 표본의 JS heap 관찰 최대 38,738,512 bytes, Chrome 프로세스 RSS 합계 관찰 최대 1,367,392,256 bytes다. 절대·연속 peak라고 주장하지 않는다. 6,965개 검색을 연속 수행한 11.72초는 QA 부하이며 단일 검색 지연이 아니다.

실제 스크린샷 35개와 원시 브라우저 로그·다운로드 초안·기존 테스트 로그·전체 Book/프로필 비교본은 `/tmp/gyeol-operator-review-pilot-01-validation/`에 보관한다. Git 보고서의 각 영수증은 실제 외부 로그 위치와 측정 방법을 기록한다.

## 재실행

기존 package.json과 pnpm-lock.yaml을 변경하지 않는다. Playwright/axe-core/JSDOM은 독립 임시 환경에 설치한다.

```sh
node tools/semantic-domain-review-workbench/verify.mjs /tmp/new-empty-workbench-output
PILOT_TOOL_ROOT=/tmp/gyeol-operator-review-pilot-01-tools node tools/operator-review-pilot/browser-validation.mjs /tmp/new-empty-workbench-output/review-workbench.html /tmp/new-browser-validation
PILOT_DOM_ROOT=/tmp/gyeol-workbench-dom-validation node tools/operator-review-pilot/dom-validation.mjs /tmp/new-empty-workbench-output/review-workbench.html /tmp/new-browser-validation
node tools/semantic-domain-review-workbench/validate-review-draft.mjs /tmp/new-browser-validation/synthetic-browser-downloaded-draft.json
node tools/operator-review-pilot/prepare-handoff.mjs /tmp/new-empty-workbench-output/review-workbench.html /tmp/new-empty-handoff
```

Browser QA의 실행 환경은 macOS의 설치 Chrome이며 `CHROME_PATH`로 다른 설치 경로를 명시할 수 있다. raw output은 저장소 밖에 둔다. browser validation은 테스트 초안만 작성한다. 실제 운영자의 판단은 자동 입력하지 않는다.

## 보존과 검증 영수증

[원본 파일](original-preservation.json), [전체 Workbench payload](workbench-data-preservation.json), [Book](book-preservation.json), [NFT](nft-trace-preservation.json), [결정론 재빌드](deterministic-rebuild.json), [Privacy](privacy-audit.json), [기존 실패 비교](known-failure-comparison.json), [기술 검증](technical-validation.json), [최종 체크](final-validation.json)를 참조한다.

20 research families / 18,610 records, 12 Specialist / 27 Graph / 5,073 평가, Source 복구 525/보류 2,677, Domain 2,966, Structural 81회/65원문 및 대운 Source 실패 30회는 불변이다. 17 Book/102 digest와 Friendship 20사례/140 digest, 40개 전체 프로필/308,432,008 bytes per side를 기준/현재에서 새로 생성해 byte 비교했다. 저장 Book 직렬화·재열람 roundtrip을 확인했다. Production Book은 읽거나 쓰지 않았다.

기존 알려진 테스트 16개 파일을 기준/현재에서 실행하고 46개 실패의 전체 메시지·stack을 정확한 checkout 경로만 정규화해 대조한다. 과거 BusinessPartner 기본 5초 실패는 그대로 기록하고 현재 실행 결과를 따로 기록한다. 기존 테스트·timeout·fixture·설정은 바꾸지 않았다. 전체 프로젝트 suite를 실행했다고 주장하지 않는다.

두 독립 Workbench CLI의 60개 물리 파일 및 독립 handoff 생성 7개 파일이 byte 동일하다. 측정 시간·메모리·스크린샷·raw log는 결정론 core에 넣지 않았다. 최종 commit/remote SHA/Preview 상태는 commit 후 외부 영수증과 최종 응답에서 확인한다. Preview READY는 오프라인 브라우저 acceptance와 별도 상태다.

실제 승인 Provider·Customer Approval·Global Planner·Korean Editorial Engine·Customer Runtime Integration은 시작하지 않았다. [후속 승인 인수 계약](future-approval-handoff.json)의 인증·권한·정확한 Source/Scope/Meaning/Evidence·유효기간·철회·별도 고객 승인이 필요하다. 이번 결과는 운영자의 사람 검토 초안을 시작할 준비이며 판매·배포 승인이 아니다.
