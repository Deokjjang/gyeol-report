# V4-TEMPORAL-TEN-GOD-SOURCE-CONTRACT-01

상태: **PARTIAL**. 기존 10개 `tr:god:*`에 정확한 기초 정의의 기술적 Source 계약을 연결했다. 조건부 기간 적용의 정확한 원본/의미 대응은 검증되지 않아 기존 대운 Source Integrity 실패는 **30 → 30**, 해결 0이다. 정의 출처 확인을 조건부 해석·고객 승인으로 바꾸지 않았다.

Base: `ac0405dbc9f19b2291a9d7ad1adadb83dc7d5de0` / `v4/korean-term-source-revision-01`.
Branch: `v4/temporal-ten-god-source-contract-01`.
지속 worktree: `/Users/Deokmin/Developer/gyeol-worktrees/v4-temporal-ten-god-source-contract-01`. Common Git: `/Users/Deokmin/Dev/projects/gyeol-report/.git`.

## 구현

기능 소스는 새 파일 **2개**다. 기존 연구 DB·SourceReader·ExactSourceResolver·Binder·12 Specialist·Planner·한국어 Writer·계산·고객 Runtime 파일은 수정하지 않았다.

- [temporalTenGodSource.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource.ts): 기존 ExactSourceResolver를 확장한다. 원래 `repo-gods`의 명시적 파일 선언, 10개 정확한 기존 definition ID, catalog locator/record hash/file hash/version, native 계산 지원 선언을 확인한다. `traditionalRef` 원문은 설명문으로 보존하며 ID로 치환하지 않는다. 이름 유사성으로 다른 Source를 선택하지 않는다.
- [temporalTenGodEvidence.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodEvidence.ts): 실제 Graph/원본 packet의 Owner·Reference Stem·Target Stem·God·Producer/version·source hash·기존 root/ancestry·기간을 검증한다. 기존 Binder를 그대로 호출하고 별도 기술 진단을 붙인다. 계산 함수를 재구현하거나 새 fact/root를 만들지 않는다.

원국의 기존 visible stem 십성, 대운간, 실효 연간, 월간, 월지 본기, 기존 flowGod를 구별한다. 원국은 native 한자 enum을 유지하고 기간 Producer의 한국어 label과 무단 병합하지 않는다. flowGod는 **대운간 → 실효 연간** 기준이며 원국 일간 기준 annualGod로 바꾸지 않는다. 정의 판본은 catalog의 `6d471…`, 기존 mfpr inheritedRole은 `565c…`의 명시적 pointer/hash/version proof로 각각 반환한다. 두 원본 파일의 해당 Git 판본과 현재 byte 일치도 별도 확인했다.

기초 정의의 기존 검토 상태(repository_only/source_checked)는 그대로 보존한다. 이번 기술 검증이 외부 전통 원문을 새로 재검토했다는 뜻은 아니다. 조건부 의미·실제 적용 조건·고객 사용의 자격과 분리한다. 새 고객 Claim/승인/Reader bridge는 모두 0이다.

## 실제 측정과 분모

|항목|결과|
|---|---:|
|tr:god 원본 Record / 정확한 기초 정의 proof|10 / 10|
|조건부 기간 의미의 정확한 Source 미검증|10|
|기존 대운 Source Integrity cohort|10 mfpr × 3 fixture = 30|
|Source Integrity before / after FAIL|30 / 30|
|원래 Source 실패 Gate 내용·ID별 3회 분모|정확히 일치|
|새 API 적용 전후 native 12 Gates|변경 0|
|기존 실제 Graph 입력 재실행|27; 109,333 nodes / 351,274 edges|
|계산 관찰 / 기술 검증 / 기간 유효|767 / 749 / 685|
|실제 고객 승인 / Claim / Reader bridge|0 / 0 / 0|

767은 독립적인 사실 767개 또는 고객에게 승인된 해석 수가 아니다. 동일 native 근거의 역할별·기간별 관찰이다. 18개 미검증은 ranged-transition의 FLOW_GOD이며 조건부 대운 context와 일치하는 확정 target-root 계약을 충족하지 않아 보류했다. 확인된 계산도 실제 적용 기간이나 의미·승인 조건이 부족하면 계속 WITHHELD다. 기존 Global 5,073 Candidate-Fixture와 Source 보류 2,677은 다른 분모다. 원본 artifact를 보존했고 전체 Global 평가를 이번에 재실행했다고 주장하지 않는다.

## 기간 경계 사례

선택 연도 2026의 Annual-A: 2월 1일~**2월 4일 05:02:08 KST 미만**은 실효 연주 `乙巳`, 기준 `庚`→대상 `乙`, 정재다. 그 시각부터 다음 월 구간은 `丙午`, `庚`→`丙`, 편관이다. 명목 연주 `丙午`를 입춘 이전까지 적용하지 않는다.

Annual-C2028: **2028-04-23 21:42 KST** 이전 flowGod는 `壬`→`戊` 편관, 이후는 `辛`→`戊` 정인이다. 각각 기존 대운간을 기준으로 한다. 절입·교운으로 나뉜 실제 월 구간과 원본 cross-period 계산 구간을 별도 반환한다. 포함 관계 및 실효 연주/대운 context를 함께 확인하며 월 구간을 연도 전체로 넓히지 않는다. Major의 정확한 연간 endpoints가 없는 관찰은 nominalAnnualPillar만 보존하고 effectiveAnnualPillar는 null이다. 10년 cycle·14년 horizon·원래 교운 시각은 변경하지 않았다.

## 검증

- 신규 49 PASS / 0 FAIL. ID/hash/version/파일 부재, Producer/Owner/Direction/기준·대상·God/Root 변조, 미상 시간, end-exclusive·입춘·교운, Source/의미/승인 분리와 30건 Gate 보존을 검증했다.
- 기존 선택 13파일: **887 PASS / 2 FAIL**(889). 전체 저장소 suite가 아니다. 두 실패는 Major/Annual Specialist의 과거 원본 파일 hash 검사이며, 정확한 Base에서도 **149 PASS / 2 FAIL**(151, 두 파일 전체)로 재현했다. 실패 이름과 worktree 경로를 정규화한 전체 오류 메시지가 일치한다. 기존 테스트 삭제·skip·timeout 변경은 없다.
- 기존 실패 파일: `src/lib/interpretation-v4/compatibilityProductAdapter.ts`. 승인된 과거 판본과 frozen 기대 hash 차이가 원인이며 이번 작업은 이 파일이나 기존 hash/검사를 바꾸지 않았다. 역사적 Graph CLI도 같은 BASE_INPUT_CHANGED를 Base/변경 후 모두 재현했다. 동일한 기존 27 입력 recipe를 현재 실제 Producer/Graph로 실행하는 새 offline verifier로 별도 검증했다. 과거 CLI 자체를 통과로 기록하지 않는다.
- TypeScript strict 진단 0, ESLint PASS, Webpack Production build PASS / 관찰 경고 0. 초기 준비 실패와 수정 전 로그는 외부 보존했다.
- Runtime AST: 46 roots / 700 modules / 새 오프라인 import 0 / 기존 digest 동일.
- NFT: 88 route + 2 shared = 90개; 기준과 route keys·Source/설치 의존성 집합 동일. 생성 build 파일 집합 차이 72는 chunk 이름 등이며 raw NFT byte 동일이라고 하지 않는다. 연구/테스트/새 계약의 고객 trace 유입 0.
- 기존 17 Books / 102 digest 모두 일치, 저장본 roundtrip/reopen 통과. Publication 32 SAFE_OFFLINE / 7 WITHHELD의 hash·오류·열람 Gate 일치.
- Synthetic 12경로의 기존 draft digest 동일(1085 배정 / 48문장 / 28부분문단); 실제 고객 Claim으로 승격하지 않았다.
- 동일 입력 반복 Graph 27 digest 및 신규 검증 반복 결과 일치. 원본 이름/생년월일·비밀 값은 신규 Git 산출물에 저장하지 않는다. DB·결제·Auth·Worker·Production 작업은 0이다.

두 기존 단위 테스트 실패와 미검증 조건부 Source는 남은 차단 사항이다. 전체 테스트 PASS, 판매 품질 PASS 또는 고객 발행 승인을 선언하지 않는다.

## 작업 환경 보존

기존 67개 등록 경로의 HEAD/branch/status/선택 파일 SHA256/표시 파일/symlink가 동일하다. 새 지속 worktree 1개로 총 68개다. 원본 dirty 11개, 기존 지속 위치 6개, 포렌식 915개 보존. `/private/tmp` 기존 61개도 계속 검사했고 신규 감소는 관찰되지 않았다. 두 사고 영향 합집합 33개 및 ignored/미기록 자료 미확인·원인 미확정은 별도 legacy 위험으로 유지한다. 기록된 중요한 신규 미커밋 유실 증거는 없다. ignored 전 파일의 과거 무손실을 보장하지 않는다.

새 branch/worktree/index/ref/reflog와 이후 commit/object/upstream/remote-ref 등록은 의도된 Git metadata 변경이다. 기존 temp worktree 복구·prune/remove/repair/reset/clean/gc는 하지 않았다. 최종 commit/remote SHA/정확한 Preview 상태와 post-commit 보존 영수증은 외부 `git-preview-receipt.json`에서 확정한다. Preview READY는 빌드 검증이며 고객 승인이나 Production 배포가 아니다.

기계 산출물: [Source 계약](temporal-source-contract.json), [십성/기간별 coverage](ten-god-source-coverage.json), [30건 비교](source-integrity-comparison.json), [후속 인수](next-implementation-handoff.json).

원본 Receipt·Source Hash는 그대로 두었다. 큰 실행 로그·실제 계산 관찰·보존 ledger는 `/Users/Deokmin/Documents/gyeol-validation/v4-temporal-ten-god-source-contract-01`에 저장했다. 원고·Book·연구 원문을 새 DB로 복제하지 않았다. 이번 작업만 마치고 다음 Source/의미 검토 또는 고객 연결은 시작하지 않는다.
