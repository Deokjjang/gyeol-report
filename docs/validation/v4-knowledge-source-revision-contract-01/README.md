# V4-KNOWLEDGE-SOURCE-REVISION-CONTRACT-01

기술적 판본 연결 검증 완료. 세 Source drift는 원본 연구 손상이 아니라 검증된 Publication Safety 후속 판본이다. 두 보존 실패를 기존 정확한 판본 계약에 연결했다. 의미 승인·고객 사용 승인·Runtime 연결은 0이다.

- Base: `fdc93c0a60b20bbdd848a7ba1535afad588506b3` / `v4/protected-staging-integration-01`
- Branch: `v4/knowledge-source-revision-contract-01`
- Worktree: `/Users/Deokmin/Developer/gyeol-worktrees/v4-knowledge-source-revision-contract-01`
- Git common: `/Users/Deokmin/Dev/projects/gyeol-report/.git` (지속 저장 위치)

## 원인과 수정

`ker:term:2`(십성), `ker:term:6`(합), `ker:term:7`(충)은 같은 compatibilityReleaseRenderer의 과거 hash `48b54e1d5c6112f8f678b406c731afd1b0ffd90679aa0039443f343c9cb37999`를 참조한다. 현재 hash는 `1ef6ab02d9a7cedc08aea244158ad806dae1ce0caedca1250054d5a9129cdf63`다. 변경 commit `0a8e685b07f5cd60226ced986d4e3fe92f392b64`의 실제 before/after, Base 조상 관계, Publication Safety 목적과 기존 두 receipt를 대조했다. 세 레코드/연구 파일은 선언된 과거 commit `6d471db103d53dd9165e4832744501a686e59edc`와 byte 일치한다. 모두 `VERIFIED_COMMITTED_REVISION`이다. ID·locator·record hash·변경 목적은 [3건 판정](source-drift-resolution.json)에 있다.

보존 테스트 21/33의 첫 실패는 compatibilityProductAdapter의 승인된 `bfc8…→a02b…` 변경이다. 두 frozen-file assertion만 `expectVersionedFile`에 연결했다. Semantic Domain의 과거 목록에는 이번에 수정한 Source Verification 테스트 자체가 포함되므로 이번 두 테스트의 정확한 before/after만 기존 helper의 마지막 판본으로 추가했다. 기존 Publication/Technical/Staging fixture와 원래 hash manifest는 그대로다. 새 Source identity registry나 Source 예외를 만들지 않았다.

기존 helper는 주어진 계약의 flags/파일 패턴은 검사했지만 priorRevisions의 commit·identity·누락을 sealed 원본 전체와 대조하지 않았다. 원본 receipt를 hash로 고정하고 전체 정확한 계약과 비교하도록 최소 보강했다. 잘못된 commit, 체인 누락, 판본/identity 혼합, 범위 밖 Source, receipt 변경은 거부한다. 기존 테스트 scope·각 link의 시작 hash·최종 실제 파일 검사는 유지한다. [판본/변조 검증](revision-chain-validation.json).

**기술적 원인 규명 3/3과 기존 raw catalog mismatch 3은 다른 지표다.** 원래 연구 `sourceHash`와 Catalog/한국어 엔진을 수정하지 않았으므로 raw mismatch 3과 `explainTerm`의 Source 보류는 남는다. 합·충 formation 지원/의미 승인도 생기지 않는다. 다음 별도 작업에서 검토된 판본 proof를 소비할 수 있도록 인수하며, 이번에는 보류 해제나 엔진 연결을 하지 않았다.

## 실제 검증

|검사|결과|
|---|---|
|동일 Node24.22.0 감사 7파일|620 PASS /2 FAIL →622 PASS /0 FAIL|
|계약·identity·변조·고객 import|62 PASS /0 FAIL|
|영향받는 기존 연구/Publication 8파일|5639 PASS /0 FAIL|
|최종 선택 검사 합계|6323 PASS /0 FAIL /skip0; 저장소 전체 suite 아님|
|TypeScript /ESLint|진단0 /PASS·경고0|
|Webpack Production build /diff-check|PASS /PASS; 관찰 build 경고0|
|기존 Book|17권·102 digest 전부 일치, 기존 snapshot JSON 재열람 성공|
|Publication Safety|39사례:32 SAFE_OFFLINE /7 WITHHELD; 기존 Book hash/차단 오류 일치|
|Customer runtime|46 roots/700 modules exact, 신규 import0;88 NFT 실제 Source·의존성 집합 일치|

서로 다른 독립 worktree 빌드의 생성 chunk 파일명은72 trace에서 달라졌다. 실제 소스·설치 의존성 집합 변경은0이며 새 연구/테스트의 runtime 유입은0이다. raw NFT byte 동일이라고 주장하지 않는다. 고정 오프라인 시각과 원래 fixture를 사용했다. 기존 Source/Semantic 결정론 검사를 재실행했고 17 Book/39 Safety의 기존 hash와도 일치한다. 전체 연구의 의미나 판매 품질을 다시 승인한 것은 아니다.

[전후 테스트 비교](test-comparison.json)는 실제 실패 이름/메시지와 파일별 결과를 기록한다. source/연구 DB/계산/MBTI/Fusion/전문 엔진/Planner/한국어/Writer/원고/Book/고객 Runtime 변경0. 변경 파일은 테스트 helper1, 테스트3, 정확한 테스트 판본 fixture1, 이번 보고서5개다. 원래 src tree `e6e2728b9be3b6ef5360cda0eb577affc092a750`는 보존한다. 새 fixture는 hash/경로만 담으며 고객 정보·키·Token은 없다. .env/ignored 비밀 파일 복사나 운영 서비스 접근은 하지 않았다.

## 보존·Git·후속 경계

작업 전65개 worktree의 HEAD/branch/status/기존 파일 hash, 원본 dirty11과 포렌식915파일을 비교해 보존했다. 현재66개이며 새 지속 worktree와 branch 등록은 의도된 Git metadata 변경이다.17개 유실 경로를 복구/정리하지 않았다. commit/push로 추가되는 feature Ref/Object/index/reflog와 원격 추적 ref도 의도된 변경이며 metadata 변경0으로 표현하지 않는다.

최종 feature commit/remote SHA 및 정확한 Vercel Preview 상태는 commit 이후 외부 `git-preview-receipt.json`과 최종 응답에 확정한다. 자기 자신의 commit SHA를 보고서에 만들어 넣지 않는다. master/Production/운영 DB/결제/Auth/Worker는 변경하지 않는다.

후속 [인수 명세](next-implementation-handoff.json)의 Korean term 판본 proof 소비는 **미시작**이다. Source 기술 기준 확인은 의미 승인·전체 지식 시스템 완성·판매·배포 승인이 아니다. 기존 ancestry/domain/Reader/승인 공백도 유지한다. 이번 작업에서 다음 개발을 자동 시작하지 않는다.

외부 원본 로그·hash 증거: `/Users/Deokmin/Documents/gyeol-validation/v4-knowledge-source-revision-contract-01`.
