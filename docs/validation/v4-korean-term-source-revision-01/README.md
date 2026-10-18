# V4-KOREAN-TERM-SOURCE-REVISION-01

**엔진 구현·기술 검증은 통과했다. 전체 작업 상태는 WORKSPACE_PRESERVATION_BLOCKED다.** 작업 중 기존 `/private/tmp` worktree17개에서 파일 소실을 관찰했다. 원인은 확정하지 못했고 복구/정리/삭제는 실행하지 않았다. 원본 checkout·dirty11·기존 지속 worktree·포렌식915파일은 보존했다. 전체 worktree 보존 PASS 또는 무조건적인 완료/출시 승인을 선언하지 않는다.

Base: `0f66fb1abe45da533a97066eb6c641345e8e34bc` / `v4/knowledge-source-revision-contract-01`. 새 브랜치 `v4/korean-term-source-revision-01`, 지속 worktree `/Users/Deokmin/Developer/gyeol-worktrees/v4-korean-term-source-revision-01`, Git common `/Users/Deokmin/Dev/projects/gyeol-report/.git`.

## 실제 엔진 변경

프로덕션 소스는2파일이다. `termSourceRevision.ts`는 이전 작업의 봉인된3레코드 proof와 기존 Publication/Technical receipt를 읽는다. 테스트용 versionedProtection helper를 import하지 않는다. 원래 연구 ID/record hash/file/hash, 정확한 변경 commit, 두 receipt의 before/after 체인, 현재 renderer hash를 모두 대조한다. 임의 레코드/파일에는 적용하지 않는다. 과거 renderer만 존재하는 경우도 거부한다. 검증 실패/누락은 기존 Source 보류로 반환한다. 기존 SourceReader/SourceProof 타입을 재사용하며 새 Source registry나 JSON DB를 만들지 않았다.

기존 `termExplanation.ts`가 실제로 이 proof를 소비한다. 원래 `sourceHash`와 연구 문구는 그대로 출력 계약에 보존하고, revision proof는 별도 provenance로 취급한다. `TECHNICALLY_VERIFIED_SOURCE`는 의미/고객/Claim 승인으로 전환하지 않는다.

실제 원본은 `ker:term:2=십성`, `ker:term:6=합`, `ker:term:7=충`이다. 첨부의6/7 이름 순서와 달라 원본을 보존했다. 세 레코드가 가리키는 renderer `48b54…→1ef6a…`, commit `0a8e685b07f5cd60226ced986d4e3fe92f392b64`를 실제 Git before/after와 대조했다. 원본 카탈로그의 역사적 raw mismatch3은 유지한다. [Source 결과](term-source-verification.json).

십성은 Direction Witness의 존재만으로 허용하지 않는다. 기존 실제 Producer/version, 기준(받는 사람)·대상(보내는 사람)의 일간, 원래 십성 값이 포함된 root의 무결성, Owner/Direction, 두 참가자와 실제 일간 부모 근거, natal scope를 확인한다. 계산을 다시 수행하거나 root/관계를 발급하지 않는다. 실제 기존 Graph의 A→B/B→A 관측2개는 이 context 검증을 통과했다. 이는 실제 Claim 발행이 아니다.

원래 인증된 Synthetic Claim2개에서는 세 용어 모두 `REQUIRED_SOURCE_NOT_VERIFIED`에서 `MISSING_REQUIRED_CONTEXT`로 바뀌었다. Source가 인식된 뒤 실제 근거 부족을 계속 보류한다는 뜻이다. Synthetic Direction을 개인별 십성으로 승인하지 않았다. 합/충의 기존 Formation 보류는 유지했고 새 Producer를 만들지 않았다. [실제 explainTerm/Context 결과](term-eligibility-validation.json).

## 검증

|검사|최종 결과|
|---|---|
|신규 정상/부정|35 PASS /0 FAIL|
|기존 선택 코호트|6323 PASS /0 FAIL; 전체 저장소 suite 아님|
|최종 선택 합계|6358 PASS /0 FAIL /skip0|
|한국어 연구/문법|392원본/46 fixture 보존·통과|
|Synthetic12경로|1085배정,48문장,28부분문단; 수정 전후 draft digest 동일|
|TypeScript/ESLint|진단0 /PASS|
|Webpack Production build/diff-check|PASS /PASS; 관찰 경고0|
|고객 Runtime|46 roots/700 modules exact;신규 import0|
|NFT|88 route Source·의존성 집합 동일;신규 연구/테스트 유입0|
|기존 Book|17권/102 digest 동일·저장본 재열람 성공|
|Publication Safety|32 SAFE_OFFLINE/7 WITHHELD;원래 hash/차단 오류 일치|

독립 빌드의 생성 chunk 이름은72 trace에서 달라졌으며, 실제 Source·설치 의존성 집합 변경은0이다. raw NFT byte 일치로 표현하지 않는다. 신규 테스트 초기 준비 코드의 null 처리 오류와3개 타입 진단은 수정 후 재실행했다. 실패/준비 로그는 외부에 남겼으며 성공으로 집계하지 않았다. [회귀·보존 상세](regression-comparison.json).

기존 authenticClaim, Input identity, TermMemory, 중복 소개 방지, Source provenance, Owner/Direction/Temporal Scope, newIndependentFacts0, 고객 승인 false를 유지한다. 고객 Writer/Book/Reader/결제/Auth/Worker/계산/DB/연구 자료는 수정하지 않았다. 실제 연구 승인·고객 Claim·신규 고객 Book·Reader bridge는0이다. 검증용 기존 가상 fixture만 오프라인으로 재실행했다.

## Worktree 소실 관찰과 Git 경계

작업 전66개 등록에서 새 지속 worktree1개를 더해67개다. 기존17개 임시 worktree에서 총56,642개 기존 파일의 소실이 관찰됐다.16개는 .git 표시 파일도 소실됐고,1개는 기존 부분 유실 경로에서 추가 소실됐다. 관찰된17개 HEAD/branch는 같고, 소실 관찰 시점의 기존 Git metadata byte 변경은0이며 모든 해당 HEAD tree object에 접근할 수 있다.49개 기존 worktree 상태/파일은 같다. 원본 checkout/dirty11, 기존 지속 worktree, 포렌식915개 파일은 일치한다. 원인은 UNDETERMINED다. 이 관찰을 운영체제나 특정 프로세스의 삭제로 확정하지 않는다.

부정 테스트에서 삭제한 파일은 사용자 OS 임시 디렉터리의 새 독립 복사본뿐이다. 기존 worktree에 대한 remove/prune/repair/restore/reset/clean 명령은 실행하지 않았다. 소실 경로·파일 수·Git 정보는 회귀 JSON과 외부 before/validated 보존 ledger에 기록했다. 복구 작업은 별도 검토가 필요하며 시작하지 않는다.

엔진 기술 검증과 workspace 보존 문제를 분리해 보고한다. 검증된 Source 변경·테스트·이 보고서만 신규 feature 브랜치에 commit/push한다. 최종 commit/remote SHA/정확한 Preview 상태와 post-commit 보존 결과는 외부 `git-preview-receipt.json` 및 최종 응답에서 확정한다. 새 branch/worktree/upstream/ref/index/object/reflog는 의도된 metadata 변경이며 metadata 변경0을 주장하지 않는다. master/Production/운영 DB/결제/Auth/Worker/환경변수는 변경하지 않는다.

[후속 인수](next-implementation-handoff.json)는 worktree 소실 별도 검토와 기존 temporal Source 계약을 미착수로 남긴다. 의미·고객 판매 승인은 없고 다음 개발을 자동 시작하지 않는다.

외부 실제 로그·봉인 증거: `/Users/Deokmin/Documents/gyeol-validation/v4-korean-term-source-revision-01`.
