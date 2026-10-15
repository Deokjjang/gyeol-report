# V4-ANNUAL-FORTUNE-SPECIALIST-ENGINE-01

Annual Fortune Specialist Engine은 오프라인으로 구현했다. 기존 고객 원고, Writer/Reader, Book 발행과 연결하지 않았다. 실제 연구의 고객 승인·선택·claim은 모두 0이며 고객 ranking은 null이다. 이 완료는 판매 원고 완성 또는 Production 승인과 다르다.

Base: `a87257c04930ed3204abba279decb6e02baeb69c` (`v4/major-fortune-specialist-engine-01`). 작업 브랜치: `v4/annual-fortune-specialist-engine-01`. 원본 checkout은 `c048218cc5961e0f53a1deab2603511e17559fc3`에 남겼다. 시작 시 기존 worktree는 보고된 44개보다 하나 많은 45개였으며, 원본 미커밋 11개와 함께 보호한다. 독립 작업 경로는 `/private/tmp/gyeol-annual-specialist-engine-01`이다.

## 인수와 실행

전체 연구 20군·18,610건, Foundation source slot 4,799개, potential candidate 4,270개를 보존한다. Annual Registry 1,792개는 조건부 연구 109개, reference view 1,634개, source/design/rejected 49개다. 109개 연구는 12개 연구 유형으로 분리하며 원래 ID, locator/hash, sourceRefs, 의미·긍정·위험·반전·행동·가상 장면, 반례 및 미해결 적용 조건을 인수한다. reference view를 독립 해석 후보나 실제 발생 근거로 세지 않는다.

`AnnualFortuneSpecialistEngine.diagnose`는 같은 준비된 Catalog/Foundation와 원래 in-memory Graph/producer packet을 사용한다. 원래 Foundation 질문·annualMonthContracts·annualRoleSelector·evaluateTypedSelector·ActualBindingIndex·bindKnowledgeCandidate 및 12 Hard Gates를 실제 실행한다. 추가 자연어 조건은 미해결 조건으로 보존하고 계산 predicate나 source AND/OR group을 추정하지 않는다.

| 집계 | 기준/결과 |
|---|---:|
| 원래 Graph 비교군 | 5 |
| 후보 × Graph | 109 × 5 = 545 |
| Source match 전/후 | 1,570 / 1,570 |
| 실제 Binder evidence match 전/후 | 0 / 0 |
| Structural match 전/후 | 0 / 0 |
| 별도 Foundation 기간평가 | 124 |
| 별도 Foundation 기간 witness | 372 |
| 모호한 월간/본기 역할 대안 witness | 248 |
| 별도 실제 원고 관찰 | 11권 / 132개월 |
| 관찰 Book의 전체 구간 수 | 24개 8권, 25개 2권, 26개 1권 |
| 실제 승인·고객 선택·claim | 0 / 0 / 0 |

0개의 Binder match와 372개의 기간 witness, 248개의 역할 대안을 합산하지 않는다. 원래 월운 십성 연구는 월간과 월지 본기를 명시하지 않으므로 대안 관측이 있어도 AMBIGUOUS_MONTHLY_GOD_ROLE로 보류한다. 질문별 구간 관측도 모든 전문 적용 조건의 승인과 다르다.

원래 다섯 Graph의 전체 월 계약은 `annual-binder-cohort-ledger.json`에 원본 Foundation artifact/hash와 함께 기록했다. 새 CLI에서 같은 다섯 Graph를 실제 재실행하고 모든 segment의 producer/원천 ID/root/구간과 대운 상태를 검사한다. 이 자료와 11권 Book 관찰은 별도 집계한다.

## 실제 계산·원고 경로

`reportInputAdapter.normalizeReportInputPayload`는 연도 정책과 실제 스키마를 검증한다. `runtimeShadow`/`runtimeProjection`의 Annual composition은 `annualProductAdapter.buildV4AnnualProduct` → `annualComposer.composeAnnualFortuneNarrative` → `annualEvidence.annualNarrativeEvidence`로 이어진다. 기존 `generateAnnualFortuneProductDraft`를 Writer disabled로 실행해 customerDayun, annualFortuneEvidence, annualFortuneReading의 canonical 계산 결과를 받는다. `buildAnnualMonthCalendar`는 기존 solarTerms/lunarJavascriptPillars/customerDayun으로 절입·교운에 따른 전체 ledger를 만든다. `extendAnnualMonthEvidence`/`annualTransitMaterials`는 원국 anchor와 실제 month target의 확장 관측을 accepted/held로 분리한다.

원고는 전체 ledger에서 원래 focus를 선택한다. 평가 시각이 해당 월 안이면 활성 구간, 아니면 Jie가 시작되는 구간, 없으면 첫 구간이다. `annualMonthNarrative`의 월간 우선/사용횟수에 따른 본기 선택은 편집 동작이며 전문 연구의 역할 계약이 아니다. 기존 contentSynthesis, timeProductContext, editorialGuard 및 product adapter의 결과를 원래 Book projection/snapshot/storedBook 경로로 검증했다. 관련 29개 실행 파일의 실제 export/import/hash는 `execution-source-inventory.json`에 있다.

선택 가능 연도는 `ANNUAL_FORTUNE_COMMERCE_YEAR_COUNT = 6` 그대로다. 고정 정책 시각 2026-10-12 12:00 KST에서는 2021~2026만 허용한다. 실제 읽는 currentDate와 오프라인 policyDate를 구분한다. 2027/2028은 명시적인 오프라인 policyDate 사례이며 FUTURE_REJECT의 SELECTED_YEAR_INVALID는 그대로 유지한다.

## 기간·역할·관계 안전성

12개 양력월의 정확한 KST `[start,end)` 범위와 모든 가변 segment를 인수했다. 공백·중복·역전·잘못된 월 순서를 차단한다. 원래 focus를 월 전체로 확장하거나 미표시 관측을 실제 표시로 승격하지 않는다. 원래 producer file/symbol/version/system, Evidence ID/pointer, owner, window, Canonical Fact Root identity를 검증하며 새 ID/root를 발급하지 않는다.

- 2026 입춘 `2026-02-04 05:02:08 KST`: 직전 乙巳/己丑, 정각부터 丙午/庚寅. T−1초/T/T+1초와 전체 12개 Jie를 실제 producer와 대조했다.
- 정확 교운 `2026-12-30 15:30 KST`: cycle 2→3, 12월 3구간. 월주 유지와 대운 변경을 분리했다.
- C2028 4월: 4월 1일 乙卯/壬申 → 4월 4일 15:03:06 丙辰/壬申 → 4월 23일 21:42 丙辰/辛未. 절입 후·교운 전 申辰 반합을 교운 뒤로 복제하지 않는다.
- 범위 교운: `2027-04-08 00:00`~`2027-08-08 21:59:59 KST`. 입추 `2027-08-08 02:26:46`과 별개다. 중앙값을 만들지 않고 불확실 두 주기를 확정 활성화하지 않는다. 독립 확정 월주·실효 연주·원국 관측은 유지한다.
- 첫 대운 전 before_first_cycle은 가상 cycle이나 Dayun pair를 만들지 않는다. 저수준 달력 성공을 구매·발행 정책 통과로 승격하지 않는다.

월간/월지 본기는 원국 일간을 기준으로 구분한다. annualGod/cycle.god의 일간 기준과 flowGod의 대운 천간 기준을 구분하며, flowGod에 없는 전용 Graph ID를 만들지 않는다. nominal annualStemRelations를 입춘 전 실효 연주에 자동 적용하지 않는다. 원래 11권 관찰의 과거/정확교운 사례에서 실제 target-stem 불일치도 확인했다.

natal_saeun/dayun_saeun 연도 관측과 natal_wolun/dayun_wolun/saeun_wolun 구간 관측은 별개다. 월운 pair는 원래 ID, 원국 위치, 실제 참가자, cycle index, certainty, 기간을 검사한다. H 사례의 申·子·辰 삼합은 실제 세 참가자를 확인한다. 두 참가자 삼합, 3/4층 복합 성립·강도·합화·해소·사건 판정은 지원하지 않는다.

확장 transit은 원래 accepted/held 판정과 Graph의 natal anchor/month target/source ancestry를 함께 확인한다. Accepted는 계산 관측이며 전문 claim 승인이 아니다. 방합·모호한 망신·미지원 문곡/복성/천의 등을 문단 충족을 위해 승인하거나 다른 자료로 대체하지 않는다.

## 정보 비교와 선택

같은 월의 인접 구간, 인접 양력월의 마지막/첫 구간, 연간 전체 root 재사용을 분리해 비교한다. 월주·실효 연주·대운·십성 역할·새 관계·accepted/held transit·지속·경계 변화를 기록한다. 실제 계산 변화와 새로운 생활 해석 승인은 다르다. 원래 132개월의 전체 표시 문장도 문자 단위로 일치한다. 기존 다양성·의미 반복·표시 감사는 `annual-existing-information-audit.json`에 원본/hash와 함께 읽기 전용으로 인수했다.

109개 의미는 전부 검토 대기다. 5개 Graph에서 5,886쌍씩 총 29,430쌍의 의미 검토 관계는 확정 의미 충돌 29,430건을 뜻하지 않는다. 기계적으로 확인되는 producer/기간/참가자 보류는 별도 structural blocking graph다. informationRoots와 supportingAncestryRoots를 분리해 동일 원국·대운 배경을 새 독립 사실로 중복 계상하지 않는다. 실제 display ledger는 발급하지 않는다.

독립 synthetic Registry/owner/producer/fact/root/segment/meaning/approval/display만 private selection session을 만들 수 있다. 원래 12 Hard Gates 뒤 정확 역할·참가자·구간·의미·반례 조건을 검사한다. 실제 연구의 가상 승격은 금지된다.

| 같은 합성 12개월 질문 | FIRST_ELIGIBLE | MONTH_LOCAL_GREEDY | GLOBAL_CONSTRAINT_AWARE |
|---|---:|---:|---:|
| 질문 충족 | 11 | 11 | 12 |
| 기간/모호 역할/미지원 관계 위반 | 0 | 0 | 0 |
| 실제 고객 claim | 0 | 0 | 0 |

이 fixture에서는 전역 선택이 1월의 대안을 사용해 2월 경계 질문의 공유 root를 예약했다. 모든 입력에서 우월하다는 주장은 하지 않는다. 범위 구간의 독립 월운은 선택 가능하지만 대운 의존 후보는 보류된다. 실제 표시 없는 Recall 0건/등록된 합성 표시 후 1건이다. 검색 상한 초과는 SEARCH_LIMIT_NO_OPTIMALITY_CLAIM으로 반환한다. 생활 상태/수입/건강/혼인/과거 경험을 입력 없이 확정하는 후보는 차단한다.

## 검증과 보존

최종 결과는 `validation-summary.json`, 테스트 이름은 `new-test-results.json`과 `existing-related-test-results.json`, 기존 46건의 전후 전체 normalized signature 비교는 `baseline-failure-comparison.json`에 기록한다. 원래 테스트 삭제·skip·fixture·시간 제한 변경은 없다. 신규 artifact 테스트의 큰 Buffer deep equality가 4GB heap을 소진한 초기 실행은 exact-byte SHA256 비교로 수정했고, 최종 테스트는 기존 기본 heap/timeouts로 통과했다. 전체 CLI만 오프라인 검증용 명시적 8GB heap으로 실행한다.

최종 CLI 두 번의 생성 JSON은 바이트 동일해야 하며 시간·RSS·임시 경로는 결정론 JSON에서 제외한다. 원래 4509개 tracked file, 기존 10개 artifact family의 59/20/23/105/83/64/29/35/38/28 JSON과 기타 원본 자료를 모두 보존한다. 17권·102개 digest와 원고·Book 전체 객체, 저장본 offline roundtrip을 비교한다. Production DB나 기존 고객 Book에 쓰기는 없다.

로컬 Production build와 TypeScript/lint/diff-check, 원래 88개 app/server NFT(Next server trace 포함 90개)의 경로와 dependency set를 확인한다. 신규 연구/검증 JSON·CLI·Specialist 코드를 고객 함수에 추가하지 않는다. 측정된 오프라인 실행 시간을 고객 Runtime 성능으로 주장하지 않는다.

Git push 후 구현 SHA의 Preview READY를 기록하고, 최종 브랜치 HEAD의 SHA/branch/project/target=null을 다시 확인한다. 최종 exact-SHA receipt와 94개 최종 보고 항목은 운영자 최종 응답 및 외부 검증 경로 `/tmp/gyeol-annual-specialist-engine-01-validation/`에서 확인한다. master push, Production 배포, DB·인증·결제·Worker·환경변수 변경은 실행하지 않는다.

## 남은 조건

월간/본기 역할의 원본 명세, 미해결 자연어 적용 조건, 정확한 source ancestry/domain, 의미 검토 및 운영자/고객 승인이 남아 있다. flowGod와 nominal stem relation의 전용 정확 구간 Graph 주소, 미지원 복합/Transit Producer를 이번 작업에서 새로 만들지 않았다. 후속 Planner는 `annual-specialist-handoff.md`와 정형 worklist를 인수할 수 있지만 고객 원고에 연결할 준비가 완료됐다는 의미는 아니다. 이번 Annual 작업 후 다음 Specialist 개발을 시작하지 않는다.
