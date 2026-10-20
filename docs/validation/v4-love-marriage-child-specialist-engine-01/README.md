# V4-LOVE-MARRIAGE-CHILD-SPECIALIST-ENGINE-01

연애·결혼·자녀의 원래 전문 연구를 실제 개인 근거·입력 상태·원천 소유권과 대조하는 독립 **오프라인 Specialist Engine**이다. 실제 연구의 운영자/고객 승인, 고객 ranking/selection/claim, Book 배정은 0이다. 기존 고객 원고를 개선하거나 판매를 승인한 작업이 아니다.

- Base: `8a1ec54384fa4bff2f1d962bf9dd340ac028ed04`, `v4/career-money-study-specialist-engine-01`.
- Branch: `v4/love-marriage-child-specialist-engine-01`.
- Worktree: `/private/tmp/gyeol-love-specialist-engine-01`.
- Product: `love_marriage_child` / `love-marriage-child`.
- Status: `LOVE_MARRIAGE_CHILD_SPECIALIST_ENGINE / OFFLINE_IMPLEMENTED`.
- 원본 checkout: `v4/annual-editorial-quality-fix-01 / c048218cc5961e0f53a1deab2603511e17559fc3`.
- 시작 시 기존 worktree는 지시문의 42개와 달리 **43개**였다. 직전 Career worktree를 포함한 실제 43개와 원본 미커밋 11개를 보호한다. 기존 추적 파일 **4,372개**를 동결했다.

## 실행과 경계

```sh
node tools/love-specialist-engine/verify.mjs
pnpm exec vitest run tests/unit/report-knowledge/loveSpecialistEngine.test.ts
```

신규 코드는 `src/lib/report-knowledge/knowledge-integration-foundation/love-specialist-engine/`에 있다. 새 API Route, 고객 Runtime import, Writer 변경, 원래 연구 수정, DB 또는 실제 고객 승인은 없다.

| 모듈 | 실행 책임 |
| --- | --- |
| `candidateIndex.ts` | 원래 Material/Question/Reader 주소/SourceKey/축/facet/상태/원천 domain/양육/승인 색인 |
| `requirementAdapter.ts` | 원래 Source Registry·ID·locator·file/record hash 및 명시적 native target 확인 |
| `relationshipContext.ts` | 원래 6 enum 범위, 추가 생활 사실, 개인/상대/자녀/공동생활/안전 적용 조건 |
| `parentingSources.ts` | 16유형·48필드의 정확한 소유권·pointer·field·coverage·classification 검증 |
| `evidenceBoundaries.ts` | 필수 Pair/Child 조상, 같은 owner의 Fusion, 실제 native 상징 관측 |
| `conflictGraph.ts` | 실제 root/축/선행 참조 색인을 이용한 의미·조건·적용 관계와 검토 필요 상태 |
| `reuseConstraints.ts` | Love 원래 facet/장/recall 계약, 의미 비교와 실제 도입 ledger |
| `selectionEngine.ts` | 독립 합성 session, 12 Gates, 전문 조건, 세 선택 방법, 검색 상한 |
| `syntheticValidation.ts` | 새로 선언한 합성 Registry/Graph/root/승인/Context의 긍정·부정 실행 |
| `inputProbes.ts` | 원래 A~W 29개 입력의 실제 유료 오프라인 producer 재현 |
| `artifacts.ts`, `types.ts` | 진단·coverage·operator worklist·개인정보 제거·인수 계약 |

공통 Catalog, ActualBindingIndex, bindKnowledgeCandidate, ProductSpecialistFoundation, QuestionRegistry/Index와 12 Hard Gates를 그대로 재사용한다. 원본 식별자/해시 확인은 기존 Career의 `resolveCareerReference`, native 십성 존재 관측은 기존 Comprehensive의 `adaptComprehensiveRequirements`를 좁은 읽기 전용 구조 view로 재사용한다. 이 view는 다른 상품의 연구/Context/예산을 복제하지 않는다. 기존 `resolveMeaningRelationship`, `checkSyntheticRecall`, `privacySafeGraph`도 재사용한다.

종합·커리어의 선택 session은 상품·fixture·Context·예산이 고정돼 있으므로 그대로 호출하지 않는다. Love의 관계 상태·소유권·안전·상징·양육·recall 조건을 별도로 실행한다. 기존 엔진을 공통 계층으로 리팩터링하지 않았다.

CLI는 기존 Career CLI → Foundation → Binder → Actual Graph의 원래 27개 fixture를 그대로 실행한다. Foundation의 원래 return을 교체하지 않고 Love 두 비교군의 진단만 추가한다. 같은 Graph를 다시 계산하지 않는다. 원래 Career 35 JSON과 그 CLI가 검증하는 종합 29/Foundation 64/Binder 83/Graph 105의 재생 결과를 확인한다. 성능/RSS는 별도 임시 로그이며 결정론 JSON에 넣지 않는다. 네트워크는 차단한다.

## 실제 Runtime 인수

`existing-runtime-boundary-audit.json`은 요청한 26개 원본 파일의 hash·import·export와 A~L 실행 경계를 기록한다.

1. 기존 `buildV4LoveProduct`는 `composeLoveNarrative`와 `buildRelationshipProfiles`를 사용한다.
2. 개인 원국 → MBTI 원천 → Fusion → Claim/Resonance → Contextual Guidance의 기존 계산을 보존한다. 관계 상태는 개인의 core를 바꾸지 않는다.
3. `projectRelationshipView`는 원래 개인 관계 domain/축을 투영한다.
4. 직접 take는 L1/L3/L4/L5/L6/L7/L8/L9이며 L2는 직접 take하지 않는다. 매력·상대 이미지는 retained legacy와 Release 자료의 기존 경로다.
5. 개인 출력의 직접 Pair sourceRefs 제거, 원래 Voice/Natal/Fortune/Balance/Fusion scene/Context/Parenting 구성은 변경하지 않았다.
6. `renderLoveRelease`의 CH01~09는 L번호와 일대일 대응하지 않는다. Bridge는 `READER_L_QUESTION_BRIDGE_UNVERIFIED`다.
7. 원래 hardErrors, 필수 section, reviewNarrative 조건에 따른 Release 채택/legacy fallback을 보존한다. Quality Issue를 새 결제 실패 Gate로 바꾸지 않았다.

## 원본 및 집계 단위

| 단위 | 원본/신규 인수 결과 |
| --- | ---: |
| 전체 Research / Potential Interpretation Candidates | 18,610 / 4,270 |
| Foundation Slots | 4,799 |
| Reader 장 / 문단 / 역할 / Question | 9 / 36 / 144 / 180 |
| Material / 조건부 / 회수 / 보류 | 164 / 155 / 8 / 1 |
| 적용 Catalog 후보 / 원래 Love Graph | 170 / 2 |
| Candidate-Fixture / Material-Fixture | 340 / 328 |
| Source Registry / Material source occurrence | 137 / 190 |
| A~W 원래 입력 probe | 29, Binder 비교군과 별도 |
| CH04 상태 연구 | 24 = 6상태 × 4문단 |
| 양육 유형 / 강점 / 위험 | 16 / 32 / 16 |
| Repair / Reuse / Rejected 연구 | 12 / 14 / 24 |

Foundation의 원래 Question-Fixture 360, witness 보유 행 60, witness 참조 170은 별도 단위다. Binder Graph witness 34에 합산하지 않는다.

## Source 및 실제 근거

원래 Material의 190개 SourceKey occurrence를 정확한 Registry/원본에 연결한다. 사용된 distinct key는 126개이며, 사용하지 않는 11개를 포함한 전체 Registry 137개도 별도 `source-registry-identity-audit.json`에서 검증했다. 원래 sourceVersion·originalState·ID·별칭·review를 변경하지 않는다.

- MBTI qualified ref는 실제 원본 타입·area·trait ID·JSON pointer·file/record hash가 모두 같은 경우만 연결한다.
- 관계 상태 enum은 입력 계약의 참조다. 개인 계산 사실이 아니다.
- legacy_application은 원래 편집 자료의 참조다. 실제 연애 경험이 아니다.
- native 십성은 명시적인 원래 target 및 기존 native 정의/producer/별칭을 확인한 **존재 관측**이다. 원래 위치·강약·상황 조건은 남아 있다. 다른 기둥의 관측으로 시주나 위치 조건을 충족시킨다고 하지 않는다.
- 새 Fact Root, 계산식, 점수, Fusion rule, source evidence ID를 발급하지 않는다.

| 같은 2 Graph / 340 후보 평가 | Before | After |
| --- | ---: | ---: |
| Source reference occurrence | 638 | 648 |
| 실제 Graph witness occurrence | 34 | 49 |
| ACTUAL_CALCULATED_FACT Gate PASS | 16 | 16 |
| Structurally matched | 6 | 6 |
| 고객 사용 가능 / claim | 0 / 0 | 0 / 0 |

추가 15 witness는 기존 native 관측의 연결이며 새 독립 해석 15개나 고객 승인 15건이 아니다. 원래 자연어 미해결 조건은 222 occurrence이며 정형 Material Source Group record는 0이다. 원래 조건/Group 계약을 삭제하거나 완화하지 않는다.

## 관계·상대·공동생활·자녀 경계

원래 enum `"" / single / some / dating / marriage_preparing / married`만 사용한다. scope 포함 여부와 추가 사실/적용 조건은 따로 검사한다. CH04는 다른 현재 상태의 자료를 현재 상황으로 함께 적용하지 않는다.

개인의 표현·선호·돌봄·자율성·매력 상징은 실제 상대의 성격·MBTI·감정·반응·동의가 아니다. Source Registry의 필수 조상, 기존 Semantic Domain 결정 및 실제 Graph 필수 조상을 검사한다. Pair 참고 자료와 CHILD/CHILDREN 원천의 개인/부모 적용은 차단한다. 해당 원천을 전역 삭제하거나 궁합 7유형 정책을 바꾸지 않는다.

기혼은 입력된 상태만 확인한다. 동거·가사·재정·정보 접근 권한·가족 동의는 미상이다. 본인의 양육 관점은 자녀 존재·나이·발달·건강·성적·MBTI·양육 경험을 입증하지 않는다.

CH06의 원래 12 Repair 연구는 개인 특성/가능 행동/가능한 상대 해석/실제 반응 미상/회복 조건/안전 경계로 구별한다. 폭력·위협·강압·감시·스토킹·성적 동의 침해·경제 통제·사생활 침해·아동 학대·반복 강요를 성향 차이로 정상화하지 않는다. 실제 위험을 추정하지도 않는다. 회복 적용은 안전과 자발적 동의를 요구한다.

## 16유형 PARENTS 원천

원래 강점 32행·위험 16행·위험 trait 참조 16개를 보존한다. 48개 원천 필드의 타입, trait ID, pointer, field, hash, sourceCoverage 및 classification을 확인한다.

- `plainKo` 16개: SCORING_SEMANTIC.
- `positiveUse` 16개와 `risk` 16개: REFERENCE_ONLY.
- 원천 존재/정확성 검증 48개와 개인 계산 근거 자격 16개는 다른 단위다.
- 참고 필드 32개를 scoring으로 승격하지 않는다. 원래 조건부 응용도 검토/고객 승인이 별도로 필요하다.
- SourceReader의 BOM 제거 문자열과 원본 파일 hash를 혼동하지 않고 raw byte hash를 사용한다.
- 실제 개인 Graph의 같은 owner·타입·PARENTS·원래 hash를 갖는 source만 본인 관측으로 다룬다.

## Fusion 및 긍정 상징

Fusion은 같은 본인의 실제 natal/SCORING MBTI root, 원래 producer의 rule, signed axis/Context/source assignment/조건부 split/반례를 유지한다. 기존 Graph의 명시 rule ID가 UNKNOWN이거나 필수 root가 없으면 보류한다. REINFORCE/TENSION의 일부 기존 producer는 명시 ruleId를 제공하지 않으므로 새 ID를 지어내지 않았다. 독립적인 원국 근거까지 무효로 하지 않는다.

도화·천을귀인은 기존 `foundationMarkerKey`와 실제 natal-table 관측을 사용한다. 추가 실제 도화 입력에서도 검증했다. 전통 상징은 실제 인기·호감·결혼·출산·배우자 재물을 보장하지 않는다. 천을귀인의 도움 받는 상징을 도움 주는 능력으로 바꾸지 않는다. 홍염 연구의 출처 보류는 기존 producer 존재와 별도로 유지하며 다른 신살로 대체하지 않는다.

## 의미·재사용·회수

실제 의미 승인 0, 검토 필요 Material 164개다. 의미 관계 8,715쌍과 두 fixture 합계 duplicate root group 43개를 기록한다. 같은 Fact와 같은 Meaning은 다르며 미검토 응용의 독립 정보 여부는 null이다. 검증 완료된 다른 응용은 0이다.

Love Renderer의 비회수 facet 선택 조건 `< 6`, 회수의 전역 facet 예외, 같은 장 facet 중복 제한, root 사용량의 정렬 선호를 기록한다. 별도 L selector의 Theme 중복 제한도 보존한다. 종합 facet 5/커리어 facet 4/root hard cap을 가져오지 않는다.

Canonical Root↔Release Atom, 연구 facet↔Release facet, Reader↔L은 검증된 동일성 bridge가 없다. 연구 facet마다 새 고객 예산을 발급하지 않는다. 합성의 root 사용 수는 primary 정보 사용이며 회수 지원 참조는 새 primary 사실이 아니다.

CH09 P1/P2의 긍정 상징과 P3/P4의 회수를 구분한다. 회수 8개는 실제 표시된 선행 의미, 같은 owner/MBTI/root/meaning/claim, 호환 status/Context/question/address, 원래 preceding reference를 요구한다. 실제 연구에서는 display ledger를 발급하지 않는다. 후보 존재와 예정 선택은 표시 이력이 아니다.

## 합성 알고리즘

실제 연구/Graph를 clone해 승인하지 않았다. 독립 Registry·JSON hash·Graph·owner·root·meaning 승인과 WeakSet authenticity, private session을 사용한다. 실제 Graph의 CONTEXT_INPUT과 입력이 같아야 하며 함수 flag만으로 사실·안전·상태를 만들 수 없다. Metadata-only GraphInput은 격리 Binder용이고 실제 원고/Book/Foundation에 전달하지 않는다.

| 같은 합성 사례 | FIRST_ELIGIBLE | QUESTION_FIT_FIRST | CONSTRAINT_AWARE_SELECTION |
| --- | ---: | ---: | ---: |
| facet 예약으로 충족한 질문 | 6 | 6 | 7 |
| 직접 전문성 선택 | indirect | specialist | specialist |

기존 12 Gates를 먼저 실행한다. 높은 fit으로 실패를 보상하지 않는다. 그 뒤 실제 질문·의미·상태·상대/자녀/양육·안전·상징·회수·충돌·Love 재사용 조건을 검사한다. 목적 함수는 질문 충족/중요 질문/요구 의미/직접 전문성/독립 의미/root 압력/기능 다양성을 사전식으로 비교한다.

검색 상한은 24 질문/256 옵션/200,000 방문이다. 낮은 한도 테스트는 SEARCH_LIMIT_NO_OPTIMALITY_CLAIM을 반환한다. 미해결 tension은 차단하고 등록된 split/complement만 허용한다. 실제 표시 없을 때 회수 0, 호환 표시 있을 때 1이다. 미입력 공동생활 0, 명시적인 격리 합성 입력에서 1이며 실제 고객 입력을 확장하지 않는다. 잘못된 source hash는 해당 후보만 차단한다.

## MBTI/시간 미상과 보존

원래 A~W 29개 입력은 Binder의 두 Graph와 별도다. S의 6상태는 개인 계산/personal digest가 같고 Context 원고는 다르다. B/N/P는 실제 기존 producer에서 **9장·30문단·7,213자·부족 6문단·HardErrors 0**을 재현한다. 36문단 PASS라고 하지 않으며 빠진 문단을 채우지 않는다.

`mbti-unknown-shortage-audit.json`은 각 부족 주소·원래 역할·Question·차단 Material·MBTI/Fusion/원국 요구·남은 실제 원국 근거·후속 Producer/승인 필요성을 기록한다. 미상 MBTI/Fusion/시주를 만들지 않는다. 출생시간 미상에서도 유효한 다른 기둥의 근거는 독립적으로 평가한다.

검증 결과와 상세 오류 signature는 `validation-summary.json`, `baseline-failure-comparison.json`, `book-preservation.json`, `preservation-audit.json`, `deterministic-rebuild.json`, `trace-audit.json`에 기록한다. 기존 실패를 삭제/skip/수정하지 않는다. 전체 repository suite green을 선언하지 않는다. 저장본 재열람은 오프라인 roundtrip 검증이며 Production 고객 E2E가 아니다.

## 남은 조건과 Git

실제 의미/적용 검토 164개, 원래 자연어 조건, Source Group 정형화, 미지원/부분 producer 및 명시 Fusion rule, 상대/자녀 실제 사실, identity/Reader bridge, 실제 표시 ledger와 운영자/고객 승인이 남아 있다. 현재 Release의 부족/fallback/일반 문장/한국어/실제 독해 품질은 후속 Writer/Publication 감사 항목이며 여기서는 수정하지 않았다.

`love-specialist-handoff.md`는 후속 인수 계약이다. Global Planner·Writer·다른 상품은 시작하지 않았다. master·Production·결제·인증·Worker·Supabase·환경변수를 변경하지 않는다. 구현 commit/push 및 최종 exact-SHA Preview 결과는 검증 후 기록한다.

## 최종 로컬 검증

| 검증 | 결과 |
| --- | --- |
| 최종 신규 회귀 | 56 PASS / 0 FAIL / 0 skip |
| 기존 관련 회귀 | 422 PASS / 0 FAIL |
| 기존 실패 16파일 | 기준/수정 후 5,837 PASS / 46 FAIL; 이름·첫 오류·전체 signature 동일 |
| TypeScript | 기준 0 → 최종 0 |
| lint / build / diff-check | PASS / PASS / PASS; 경고 0 |
| 기존 파일 | 4,372개 byte 동일 |
| 실제 Book | 17권 / 102 digest / 전체 원고·Book 객체 / 저장본 오프라인 roundtrip 동일 |
| 결정론 | 최종 소스 독립 2회 / 생성 JSON 38개 byte 동일 |
| NFT trace | 88개 전체 경로 집합 동일; 신규 엔진/연구/검증/fixture/CLI 추적 없음 |

전체 Registry 137개 중 Material이 사용하는 distinct key는 126개다. 사용하지 않는 11개도 원본 식별자를 검증했다. 양육 48개 원천 필드는 모두 일치하며 scoring 16개/reference 32개를 구분했다. 선택된 Fusion 관측 10개 중 4개 일치/6개 보류는 후보 승인 수가 아니다. 긍정 상징 관측은 2개 확인/4개 보류이며 별도 실제 도화 입력도 검증했다.

정확한 집계 단위와 47절 지표는 `readiness-units.json`, 전체 최종 보고 필드는 `task-results.json`에 있다. 실제 연구에서 상대/자녀 사실을 주장하는 시도는 0이며, 그러한 주장에 필요한 사실 차단은 독립 합성 negative에서 실행했다. 미상 상태·추가 사실의 범위는 29개 원래 입력 probe와 원래 6 enum 회귀에서 별도로 확인했다.

## Git 및 Preview 확인

- 구현 커밋: `69f8be3c88639b2a02099004648fb9e3863ea199`; 원격 작업 브랜치 SHA 일치 확인.
- 구현 Preview: **READY**, deployment `dpl_48FjgJ1VsNWNpgwgzT2qxx3hsMoW`.
- URL: https://gyeol-report-lb0lm5ff2-gyeol-report-s-projects.vercel.app
- gitCommitSha·branch·project와 `target: null`인 Preview를 대조했다.
- 정형 확인 기록: `implementation-preview-receipt.json`.

이 기록을 담는 문서 전용 후속 커밋의 최종 SHA/Preview는 별도로 확인하고 최종 보고 및 저장소 외부 receipt에 기록한다. 문서에 자기 commit SHA를 넣기 위한 반복 커밋은 만들지 않는다. 구현·테스트·결정론 산출물·기존 파일은 기록 단계에서 변경하지 않는다. Preview READY는 고객 기능 연결·판매 승인·Production 배포를 뜻하지 않는다.
