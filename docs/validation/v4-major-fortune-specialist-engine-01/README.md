# V4-MAJOR-FORTUNE-SPECIALIST-ENGINE-01

**대운 전용 오프라인 엔진 구현·검증. 고객 원고 개선 완료나 판매 승인이 아니다.**

기준은 `v4/love-marriage-child-specialist-engine-01` / `9963a12351a7d08e60255f29c032b5348152e870`이다. 작업 브랜치는 `v4/major-fortune-specialist-engine-01`, 독립 worktree는 `/private/tmp/gyeol-major-specialist-engine-01`이다. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3` 상태로 보존한다. 기존 worktree는 지시문의 43개와 달리 실제 44개였다. 직전 연애 엔진 worktree가 추가됐으며, 이번 worktree와 구별해 전부 보호했다. 미커밋 11개도 별도 해시로 보존한다.

## 구현 및 수량

[코드](../../../src/lib/report-knowledge/knowledge-integration-foundation/major-fortune-specialist-engine/) / [오프라인 CLI](../../../tools/major-fortune-specialist-engine/verify.mjs) / [회귀 테스트](../../../tests/unit/report-knowledge/majorFortuneSpecialistEngine.test.ts).

863 registry는 전문 연구·질문 89, 상속 참조 735, 출처 17, 미래 Binding 설계 9, 반려·보류 13으로 구분한다. 89개를 독립 계산 사실로 세지 않는다. 연구 유형은 Cycle, TenGod, Development, Phase, Transition, Interaction, Year Question, Comparison, Domain, Observed Fixture의 10종이다. 14개 상대 슬롯×12질문=168개 View는 원문·Foundation ID·locator·record hash·조건·보류 정책을 보존하며 모두 REFERENCE_ONLY다.

기존 세 Major Graph와 89개 후보, 총 267 candidate-fixture를 그대로 사용했다. A–F의 2026/2027 관찰 및 경계 검사는 이 분모에서 제외한다. **Source 633→633, Graph witness 3→3, FACTS_MATCHED 3→3, structural 0→0**이다. 증가를 만들기 위해 기간·출처 조건을 완화하지 않았다. 원래 Binder에 없던 natalRequired/elementRequired 등 원문 조건은 unresolved로 보강하고 원본·확장 requirement hash를 따로 남겼다.

실제 고객 승인·eligible·선택·claim은 0, customerRank=null이다. 연구 참조 조회·계산 관측 일치·질문 View 연결은 의미 승인이나 실제 사건의 증거가 아니다.

## 시간 및 근거 구분

`calculateCustomerDayun`과 `selectCustomerDayun`을 그대로 사용한다. yunSect=2, lunar-javascript=1.7.7, 기존 KST/version/index/ganji/startYear/endYear/startSolarKst/startSolarRange/precision을 보존한다. 10년 주기와 편집 14년 창을 분리하며, 2026 기준 2023–2036, 2027 기준 2024–2037을 검증했다.

C의 정확 경계 **2028-04-23 21:42 KST**에서 T−1ms는 壬申/편재, T와 T+1ms는 辛未/상관이다. 연주 戊申/비견은 별개다. Calendar selectedCycle은 전환 전에도 새 주기를 가리킬 수 있으므로 instantActiveCycle과 구분한다. 실제 C 2028의 after-cycle `cycleRelations`는 **빈 배열**이다. 존재하지 않는 관계로 경계 회귀를 구성하지 않았으며, row의 주기 적용 경계를 실제 활성 주기와 비교했다. 원국×세운 반합·해는 해당 출처에 남긴다.

D/F 2033은 **2033-06-14 02:00 ~ 2033-10-15 23:59:59 KST**다. earliest 직전은 이전, `[earliest,latest)`는 활성 미확정, latest부터 다음 주기다. 중앙값을 만들지 않는다. 범위 내부의 기존 V4 composer 오류 CURRENT_DAYUN_BOUNDARY_UNCERTAIN을 유지하면서 오프라인 진단에는 유효한 14년 관측을 보존한다. 첫 대운 이전의 DAYUN_CYCLE_UNAVAILABLE과 불안정 입력의 DAYUN_UNCERTAIN도 가상 0번 주기나 이웃 주기로 복구하지 않는다.

A 2028의 戊寅 대운×戊申 세운 寅申 충·申寅 형과 세운×원국 일지 申子 반합은 scope·참가자·원래 reason ID를 분리한다. A 2027의 세운×원국 관계는 대운×세운 관계가 적어도 남는다. B 2028의 두 관계 배열은 비어 있으나 평온·실패의 증거가 아니다. B 2034의 戊寅/편재와 甲寅/비견을 구분하고 C 2033의 원국 연지·시지와 대운 참가자를 보존한다.

원국×대운 자료는 원래 base packet cycle에서만 사용한다. 다른 cycle로 복제하지 않고 실제 다음 경계를 벗어난 적용도 차단한다. 연도 관측의 정확 interval이 없으면 YEAR_SCOPE_OBSERVATION을 유지한다. Graph의 불완전 endpoint를 raw 계산 자료로 보충해 Gate를 통과시키지 않는다. Pair 관계가 있다는 이유로 독립 3층 판정, 두 참가자 삼합, 합화·강도·희기·사건을 생성하지 않는다.

## 연도 비교·선택 검증

각 fixture의 14년에서 91개의 연도 쌍을 비교한다. Cycle·TenGod·연주·관계·원국 위치·경계·reason·canonical root·확정성·지원 범위를 구분한다. 새 연도 root와 같은 대운 root의 지속을 따로 기록하며, 계산 차이가 새 생활 응용 승인을 뜻하지 않는다. 실제 의미 승인 0으로 89개 전부 검토 대기다. 확인되지 않은 semantic 충돌을 이름 반대나 문장 차이만으로 확정하지 않는다.

독립 합성 registry는 14년·168질문을 사용한다. 동일 입력에서 FIRST_ELIGIBLE=16, YEAR_LOCAL_GREEDY=16, GLOBAL_CONSTRAINT_AWARE=17 질문을 충족했다. Global은 앞 연도의 후보를 바꿔 뒤의 전환 비교를 예약했다. 독립 정보는 각각 15/15/16이며 Global continuity=1, 지원되지 않는 관계 사용·연도 오배정·claims=0이다. 이 결과를 모든 입력에서 Global이 우월하다는 주장으로 확대하지 않는다. 실제 Binder의 12 Gates 및 등록된 Source/Meaning/Participant/Window/Approval을 재검증하며 검색 한도는 최적성 미주장으로 반환한다. Recall은 계획된 선택과 실제 등록된 합성 표시 ledger를 구분한다. 별도 등록된 범위 시나리오에서 범위 내부의 주기 의존 후보는 보류하고, latest 이후 후보와 대운이 필요 없는 독립 연도 사실은 통과했다. `roots`의 전체 ancestry와 `informationRoots`의 주 정보 근거를 구분해, 같은 대운 배경의 참조가 다른 연도 사실의 중복 발급으로 집계되지 않도록 했다.

## 보존과 재현

기준 추적 파일 4,443개를 SHA256 byte 비교한다. 기존 Catalog 59, Source 20, Semantic 23, Graph 105, Binder 83, Foundation 64, 종합 29, 커리어 35, 연애 38 JSON을 보호한다. Graph/Binder/Foundation/기존 Specialist CLI의 산출물도 동일 경로로 재생·비교한다. 17권의 계산·Evidence·draft·원고·Book·snapshot 102 digest와 전체 원고/Book 객체, 저장본 오프라인 roundtrip을 비교한다. 서버 NFT 88개 경로 집합을 보존하고 신규 엔진·연구·검증 파일이 고객 함수에 들어가지 않았는지 검사한다.

실행:

```sh
node tools/major-fortune-specialist-engine/verify.mjs
pnpm exec vitest run tests/unit/report-knowledge/majorFortuneSpecialistEngine.test.ts
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm build
git diff --check
```

최종 실제 결과는 [검증 요약](validation-summary.json), [테스트 결과](new-test-results.json), [기존 실패 비교](baseline-failure-comparison.json), [결정론성](deterministic-rebuild.json), [추적 결과](trace-audit.json), [보존 결과](preservation-audit.json), [단위별 수량](readiness-units.json), [전체 최종 보고](task-results.json)에 기록한다. 초기 과부하 실행에서 Catalog 기본 제한 부근 오류와 Love 240초 hook timeout이 발생했으며, 소스·fixture를 바꾸거나 skip하지 않고 격리 재실행한 결과를 구분한다.

## 남은 범위 및 중단점

미해결 자연어 계약, Source Group 미선언, 의미·domain·counterexample·고객 승인, 다른 cycle의 원국 관계, 전환 전 대운×세운 packet, Graph endpoint 노출, 정밀 연도 interval, 독립 3층 판정은 남긴다. 원래 calculateCustomerDayun의 원시 경계와 V4/Graph 노출 부족을 구별해야 한다. [후속 인수 계약](major-specialist-handoff.md)은 제안만 하며 이번에 계산기·고객 Planner·Writer를 수정하지 않았다.

master·Production·운영 DB·Supabase·환경변수·결제·Auth·Worker·기존 구매 Book은 변경하지 않는다. Preview는 commit/push 이후 정확 SHA/branch/project/target을 확인하고 Git 검증 receipt와 함께 보고한다. 다음 세운 Specialist Engine은 시작하지 않는다.
