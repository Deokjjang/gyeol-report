# V4-COMPREHENSIVE-SPECIALIST-ENGINE-01

종합 전문 연구의 질문·근거·조건·의미·충돌·재사용을 판정하는 **독립 오프라인 엔진**을 구현했다. 실제 미승인 연구에서는 진단만 실행한다. 고객 순위·선택·claim·Book 배정은 실행하지 않는다. 판매 가능한 원고 완성이나 배포 승인을 의미하지 않는다.

- Base: `e0d27b3c78380bb249ec7dd12aa20e8747bc3666` (`v4/product-specialist-foundation-01`).
- Branch: `v4/comprehensive-specialist-engine-01`.
- Worktree: `/private/tmp/gyeol-comprehensive-specialist-engine-01`.
- Status: `OFFLINE_IMPLEMENTED` / `REAL_RESEARCH_DIAGNOSTICS`.
- 원본 checkout의 미커밋 11개와 기존 worktree 41개를 파일 hash·HEAD·branch·status로 비교한다. 원래 추적 파일 4,246개는 byte 불변이다.

## 실제 코드와 실행

신규 코드는 `src/lib/report-knowledge/knowledge-integration-foundation/comprehensive-specialist-engine/`에만 추가했다. 기존 Runtime, 연구 원문, Binder 및 Foundation 코드는 변경하지 않았다.

| 파일 | 실행 책임 |
| --- | --- |
| `candidateIndex.ts` | 원래 Catalog/Material/Question 연결 및 address·meaning·axis·facet·domain·context·group·approval 색인 |
| `requirementAdapter.ts` | 출처·alias·native producer가 확인된 십성의 존재 관측만 원래 요구조건 복사본에 추가 |
| `engine.ts` | 기존 Foundation/ActualBindingIndex/bindKnowledgeCandidate 실행, 모든 Gate 및 독립 차단 사유 보존 |
| `meaningIdentity.ts` | 기존 classifyMeaningReuse 재사용; 검토되지 않은 의미 독립성 보류 |
| `conflictGraph.ts` | 연구의 root·질문·조건·선행 의미 관계 그래프; 기존 Runtime 편집 충돌 계산과 분리 |
| `reuseConstraints.ts` | 기존 예산의 단위·범위 및 실제 표시 이력 기반 recall 검증 |
| `selectionEngine.ts` | 인증된 격리 합성 session에서만 세 가지 선택 알고리즘 실행 |
| `syntheticValidation.ts` | 독립 합성 Registry/Graph/승인 계약, Gate 부정 사례 및 비교 검증 |
| `artifacts.ts`, `types.ts` | 개인정보를 제거한 결정론적 출력 및 인수 타입 |

실행:

```sh
node tools/comprehensive-specialist-engine/verify.mjs
pnpm exec vitest run tests/unit/report-knowledge/comprehensiveSpecialistEngine.test.ts
```

CLI는 원래 Foundation CLI와 그 하위 Binder/Graph CLI를 변경 없이 호출한다. 원래 Foundation의 `run` 반환값을 그대로 반환하면서 종합 요청만 별도로 진단한다. 기존 27 Graph 전체를 재생하고, 기존 종합 집합 4개에서 동일한 200개 후보를 평가한다. 네트워크 호출을 차단하며 고객 API route, Runtime import, Writer, 결제, 운영 DB 요청은 없다. 원래 파일 hash가 달라지면 중단한다.

## 원본 계약과 평가 단위

| 항목 | 확인 결과 |
| --- | ---: |
| 전체 Research / Interpretation Candidates | 18,610 / 4,270 |
| 기존 machine-checkable / partial / not-machine-checkable | 52 / 2,029 / 2,189 |
| Reader 장 / 문단 / 문장 역할 | 13 / 52 / 208 |
| 원래 질문 | 260 = 문단 질문 52 + 역할 질문 208 |
| 종합 applicable Catalog 후보 | 200 |
| 원래 전문 Material / 질문 연결 Material | 179 / 179 |
| 원래 conditional / held | 175 / 4 |
| natal-only Material | 56 |
| 실제 종합 fixture / 후보×fixture | 4 / 800 |
| 전문 Material×fixture / 질문×fixture | 716 / 1,040 |

수치를 맞추기 위해 fixture나 자료를 추가하지 않았다. 미상 MBTI·시간을 각각 분리한 부정/회귀 입력은 신규 테스트에서 별도로 검증하며 기존 4개 집합의 계수에 합산하지 않는다. 원래 Material의 locator/hash, 내용, 역할 contribution, source refs, 의미 분류, 긍정·위험·팩폭·반전·적용·장면·반례·선행 조건·제외·review 필드를 그대로 보존한다.

DIRECT_QUESTION_MATERIAL, CONDITIONAL_APPLICATION, SHARED_FOUNDATION_MATERIAL, RECALL_ONLY, REFERENCE_ONLY, EXPRESSION_ONLY, UNMAPPED는 기존 Foundation 연결 종류를 보존한다. 문구 유사도로 연결을 만들지 않는다. reference/expression/recall을 독립 primary 해석으로 승격하지 않는다.

## 실제 Evidence 연결의 변화와 한계

| 측정 단위 | 원래 Foundation | 신규 엔진 |
| --- | ---: | ---: |
| Source reference match 발생 수 | 1,820 | 2,156 |
| 실제 Graph-node witness 발생 수 | 287 | 557 |
| 구조 Gate 충족 후보×fixture | 23 | 23 |
| Source group PASS 발생 수 | 0 | 0 |
| 고객 eligible / 운영자 승인 / customer claim | 0 / 0 / 0 | 0 / 0 / 0 |

추가된 witness 270건은 원래 Graph의 계산된 십성 관측이다. 84개 요구조건 template은 다음을 모두 확인한 경우에만 복사본에 추가된다.

1. 원래 Material의 `natal_research` source ref, unique 원본 ID, record hash와 source file hash.
2. Catalog Source Verification PASS, `ten_god`, `support.calculation=native`, 기존 `getTenGod` 계산 참조.
3. 원래 자료의 alias와 기존 `src/lib/saju/types.ts`의 `TenGod` literal이 정확히 하나 일치.
4. 원래 producer `strength.ts / collectStructureAtoms / STRUCTURE_VERSION / system=myeongli`와 person owner 및 `CALCULATED_NATAL_FACT.value.god` 일치.

한국어 label을 한자로 추측 변환하지 않는다. 원래 source definition 요구조건·자연어 prerequisites·반례·source group·미해결 조건은 삭제하거나 완화하지 않는다. 계산된 십성의 존재는 직업 능력, 성격, 과거 경험 또는 질문 답변의 증명이 아니다. 새 계산·근거 ID·Fact Root는 발급하지 않는다. 참조된 distinct 기존 root가 173→181로 늘어난 것은 기존 root를 더 찾은 결과이며 신규 사실 생성 수는 0이다.

195개 질문은 한 fixture 이상에서 실제 witness를 갖고, 60개 질문은 구조 매칭 Material을 갖는다. 이는 260개 중 고객 답변 완료 수가 아니다. 고객에게 답변 가능한 질문은 0개다. 부분 Graph의 관련 없는 withheld node는 독립적으로 유효한 관측을 폐기하지 않지만 필요한 withheld 조상은 통과하지 않는다.

## 의미·충돌·정보 독립성

실제 Material 179개 모두 의미/적용 관계 검토가 필요하다. 승인된 meaning identity는 0개다. 4개 fixture 합계 14,421개 검토 쌍 중:

- 정확히 동일한 비어 있지 않은 root 집합: SAME_FACT 245건. independentInformation은 `null`이다. 같은 사실이 같은 claim 또는 독립 적용을 증명하지 않는다.
- 나머지 14,176건: MEANING_RELATION_REVIEW_REQUIRED.
- duplicate root group: fixture별 합계 149건.
- 원래 조건부 적용 차이 726건과 반대 signed axis의 긴장 258건은 REVIEW_REQUIRED다. 검증된 다른 적용 수는 0이다.
- 기존 root 교집합 4,588건과 source reuse/different question 4,482건은 발생 단위이며 독립 근거나 충돌 확정 건수가 아니다.
- 선행 introduction 관계 356건은 원래 선언의 존재만 확인한다. 실제 표시 이력이 아니다.

검토 쌍 전체를 모순이나 확정 중복으로 보고하지 않는다. 문자열 차이, 같은 axis, facet 라벨만으로 의미 독립성을 승인하지 않는다. 합성 승인 의미에서 SAME_CLAIM/SAME_MEANING/NEW_APPLICATION/DIFFERENT_MEANING/VALID_RECALL을 기존 의미 검증기로 판정한다. 긍정·위험·반전의 역할, 명시적 exclusion/complement/split, context와 원래 조건을 구분한다.

## 예산과 Reader/Scheduler 경계

기존 Runtime 조사 대상 22개 파일의 hash·export·책임을 `existing-runtime-boundary-audit.json`에 기록했다.

| 기존 제약 | 정확한 적용 단위 |
| --- | --- |
| Release primary 최대 3회 | `ReleaseSource.atom.id` |
| Release facet 최대 5회 | 기존 `RELEASE_FACETS` key |
| Facet × Context | 같은 조합 중복 금지 |
| 명시 MBTI 표현 | 최대 7회 |
| Scheduler exact primary exposure | 기존 evidence owner별 최대 1회; support는 원래 조건별 1/2회 |
| Scheduler Theme / Fusion | 기존 core/other/support 및 REINFORCE/TENSION/COMPLEMENT 예산 그대로 |

Canonical Fact Root를 Release atom이나 scheduler exposure ID와 자동 동치로 두지 않는다. 연구의 83 subfacet에 기존 15 Release facet 예산을 각각 새로 부여하지 않는다. 두 bridge는 UNVERIFIED 상태다. 합성의 선언된 root 3/facet 5 제약은 시험 계약이며 실제 고객 정보 배정으로 적용하지 않는다.

CH01~CH13 Reader와 C1~C10 scheduler는 별개다. 번호 대응이나 새 배정표를 만들지 않았다. `READER_SCHEDULER_BRIDGE_UNVERIFIED`를 유지한다. 13/52/208의 원래 제목·목적·domain·context·질문은 전부 조회 가능하지만 전문 의미가 모두 충족됐다는 뜻은 아니다.

## CH03·CH05~CH13 안전성

- CH03: 원래 Fusion rule, same-owner 양쪽 명리/MBTI root, signed axis와 context/split/sourceCoverage를 기록한다. rule 미노출, 필수 root 누락, Facet 부분 의미는 보류한다. 기존 Fusion과 연구 Fusion을 자동 병합하지 않는다.
- CH05/06: 두 번째 강점을 동의어로 독립 계산하지 않는다. 실제 의미 검토·다른 적용 조건이 필요하다. 과용·부담·조절 조건을 원본 그대로 남긴다.
- CH07: 전통 상징과 실제 성공 사건을 구분하고 기존 held 4개를 승격하지 않는다.
- CH08~12: normalized jobStatus/relationshipStatus enum만 입력 범위 내에서 기록한다. 실제 직업 세부정보, 소득, 투자 이력, 관계 경험, 가족 구성, 친구 갈등, 상대 의도와 과거 성공/실패를 만들지 않는다.
- MBTI 미상은 MBTI/Fusion 근거를 보충하지 않는다. 유효한 명리 관측은 남긴다. 시간 미상에 시간주를 추정하지 않는다.
- CH13: 원래 precedingMeaningRefs 또는 예정된 선택만으로 recall을 허용하지 않는다. 같은 인물·같은 MBTI 입력·같은 root/meaning/claim·호환 context·실제 displayed record와 node가 필요하다. 실제 연구의 고객 introduced ledger는 발급하지 않는다.

## 합성 선택 알고리즘 검증

실제 연구 자료·Graph를 clone해 가상 승인하지 않았다. 독립 JSON fixture, 자체 Catalog family/IDs, 자체 Graph producer/root/owner, exact original record/file hash, 승인 scope와 authenticity registry를 사용한다. private WeakMap으로 생성된 session만 선택 함수가 수용한다. 실제 Catalog 또는 provenance만 바꾼 Graph, 위조 session을 거부한다. 모든 후보는 **기존 Binder 12 Hard Gates를 새로 실행한 뒤** 선택 대상이 된다. NODE_ENV 우회는 없다.

합성 GraphInput의 최소 metadata envelope는 타입 단언을 사용한다. 격리 Binder가 읽는 generatedAt/input만 제공하며 실제 report나 계산 결과로 취급하지 않는다. 이 envelope는 Foundation/Composer/Book validator 또는 고객 경로에 전달하지 않는다. 실제 Graph는 원래 producer의 온전한 GraphInput을 사용한다.

| 비교 사례 | FIRST_ELIGIBLE | QUESTION_FIT_FIRST | CONSTRAINT_SEARCH |
| --- | --- | --- | --- |
| q1~q4 root 예약 | 3개 질문 | 3개 질문 | 4개 질문: q1에 대체 root를 남겨 전체 충족 |
| q8 direct 전문성 | 간접 후보 i | 직접 후보 j | 직접 후보 j |

Hard Constraint가 먼저이고 질문 충족·직접 전문성·명시 witness·승인 의미·root 다양성·역할 다양성·재사용 최소화를 사전식으로 비교한다. 불투명 가중치나 승인 점수는 없다. deterministic tie-break를 적용한다. 검색 한도는 합성 질문 24개/후보 256개/방문 200,000이며 한도 도달 시 SEARCH_LIMIT_NO_OPTIMALITY_CLAIM을 보고한다. 실제 고객 52문단 최종 배정은 하지 않는다.

추가 검증:

- unresolved 같은-context 반대 방향은 차단하고, 등록된 split 대안과 명시 complement는 공존한다.
- CH13은 실제 display 없으면 eligible 0, 호환되는 명시 display가 있으면 eligible 1이다. 예정 선택을 display로 변환하지 않는다.
- 잘못된 owner, missing approval/fact, source definition만 존재, source hash 오류, withheld 필수 root, AND source group 누락, Domain 금지를 높은 fit이나 승인으로 보상하지 않는다.
- 유효한 AND group의 두 요구가 같은 root를 참조해도 root를 두 개 만들지 않는다.
- source hash 오류는 해당 후보만 차단한다. 독립적으로 유효한 다른 후보까지 폐기하지 않는다.

## 검증 결과

| 검증 | 결과 / 정확한 범위 |
| --- | --- |
| 신규 엔진 회귀 | 62 PASS / 0 FAIL / 0 skip |
| 기존 Catalog/Source/Semantic/Graph/Binder/Foundation/Book 관련 검증 | 282 PASS / 0 FAIL |
| 기존 실패 재현 | 정확한 base의 기존 실패 16개 파일에서 5,837 PASS / 46 FAIL |
| 수정 후 동일 범위 | 5,837 PASS / 46 FAIL; 파일·이름·첫 오류·전체 normalized signature 동일 |
| TypeScript | frozen base 0 → final 0, 신규 0 |
| lint / Production build | PASS / PASS; 빌드 경고 0 |
| diff-check | PASS |
| 원래 17 Book | 102 digest 및 전체 원고/Book/grammar probe 객체 동일; 저장 snapshot roundtrip 테스트 PASS |
| 원본 연구/계산/Runtime | 4,246 원본 파일 byte 동일 |
| 기존 generated 자료 | Catalog59 / Source20 / Semantic23 / Graph105 / Binder83 / Foundation64 byte 동일 |
| 파일 추적 | 기존 88 NFT path set 동일; 신규 엔진·연구·검증·fixture·CLI 추가 추적 없음 |
| 결정론성 | 새 프로세스 2회에서 생성 JSON 29개 byte 동일 |
| 개인정보 | 이름·생년월일 및 원본 fixture 식별자 제거 검사 PASS; root/node/owner는 case 내 일관된 별칭 |

최종 build의 첫 샌드박스 실행은 compile 단계에서 5분 이상 진행 출력 없이 대기해 해당 프로세스만 종료했다. 코드를 바꾸지 않고 동일 `pnpm build`를 일반 실행 권한으로 재검증했다. 이 대기를 소스 오류나 검증 PASS로 계산하지 않았다.

기존 46 실패를 해결하거나 삭제하지 않았다. 전체 repository suite green이라고 선언하지 않는다. 실패 이름·signature는 `baseline-failure-comparison.json`에 남겼다. 실제 Production DB의 구매자 열람이나 브라우저 E2E를 새로 실행한 것은 아니다. 기존 저장본 오프라인 roundtrip과 전체 Book 객체 보존을 검증했다. 로컬 NFT의 파일 합계는 원격 압축 함수 크기를 뜻하지 않는다.

## 산출물과 운영자 검토

`comprehensive-specialist-manifest.json`은 계수와 Gate 전후 비교, `readiness-units.json`은 단위별 coverage, `shards/*-binding.json` 및 `*-diagnostics.json`은 실제 receipt 전부를 제공한다. candidate index, 원래 질문 registry·Material 연결, 13장/52문단/208역할 matrix, 의미/충돌/root 계약, 합성 결과, 개인정보·보존·trace·baseline 비교를 별도 정형 파일로 제공한다. `deterministic-output.json`의 hash 집합은 엔진 생성 29개만 포함하며 사람이 작성한 보고서·timing·배포 receipt는 제외한다.

운영자 worklist 179개에는 원래 자료와 모든 미해결 Gate·조건·출처·의미·회수 요구를 연결했다. 검토 우선순위는 고객 후보 순위가 아니다. 고객 ranking은 null, 실제 customer selection은 false다. timing/RSS는 `performance-observations.json`의 오프라인 관측값이며 고객 성능 개선 주장이 아니다.

## 남은 조건과 인수 범위

- 179개 meaning/application 검토 및 운영자/고객 승인은 여전히 미완료다.
- 원래 자연어 조건 1,111개 occurrence가 남는다. source definition이나 존재 관측으로 대체하지 않는다.
- 179 Material의 sourceGroups 정형 record는 0개다. 임의 AND/OR group을 만들지 않았다. source group 차단은 기존 Binder 검증과 신규 합성 AND 양·음성으로 확인한다.
- 800 평가 중 producer support FAIL 67, UNKNOWN 264; rule-specific Fusion 미노출 및 충분하지 않은 ancestry/Facet producer 등은 원래 receipt대로 남는다.
- Reader/Scheduler, canonical root/Release atom, 연구 subfacet/Release facet bridge는 아직 검증되지 않았다.
- CH13 실제 고객 display ledger는 없고 발급하지 않았다.
- 기존 독립 테스트 실패 46개는 유지된다.

다음 단계에 넘길 계약은 `comprehensive-specialist-handoff.md`에 정리했다. 오프라인 진단 및 합성 선택 인수는 가능하지만, 실제 고객 선택·Writer 연결·Global Book Planner·판매/Production 승인은 준비되지 않았다. 이번 작업에서 다른 상품, Planner, 원고 수정, master 통합, Production 배포는 시작하지 않는다.

## Git / Preview 검증

관련 신규 파일만 명시적으로 stage/commit/push한다. 원격 SHA 및 exact commit의 Vercel Preview READY를 별도로 확인한다. 최종 receipt와 SHA는 최종 보고를 따른다. Production target은 사용하지 않는다.
