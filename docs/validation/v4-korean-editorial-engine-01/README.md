# V4-KOREAN-EDITORIAL-ENGINE-01

실행 가능한 오프라인 한국어 편집 엔진을 구현했다. 12개 전문 경로에서 실제 한국어 48문장·28문단을 생성했다. 독립 Friendship 표시 Fixture에서는 7문장·6문단을 생성하고 REPAIR·RECALL을 검증했다. **전체 고객 Book 완성이나 판매 품질 향상을 뜻하지 않는다. 실제 운영자 승인·고객 승인·적격·선택·Claim·Book 배정은 모두 0이다.**

기준은 `f104134ffac56d7d0ec32055d1a3095411c9d702`, 작업 브랜치는 `v4/korean-editorial-engine-01`이다. 원본 6,111개 파일이 바이트 단위로 동일하며 기존 Writer/Reader/Book/Binder/Planner/Approval Contract 및 연구 자료를 수정하지 않았다. 최종 자체 commit SHA와 Git 원격/Preview 결과는 commit 이후 확정하므로 최종 응답과 `/tmp/gyeol-korean-editorial-engine-01-validation/release-receipt.json`에 기록한다.

## 구현과 실제 계약

`createEditorialInput`은 인증된 기존 Planning Request 및 Plan으로 기존 `compileEditorialHandoff`를 호출한다. 원래 질문·Material·Source·근거·Root·Ancestry·Owner·Direction·기간·조건·반례·금지 추론·지원 정보를 유지한다. 해시나 단순 실행 플래그만 바꾼 복제 입력은 허용하지 않는다. STRICT 모드는 현재 모든 질문을 고객 승인 대기로 남기며 문장을 생성하지 않는다. 실제 실행에서 27개 실제 연구 Graph / 5,073개 원래 평가와 Plan hash가 유지됐다.

ISOLATED 모드에서는 기존 12 Specialist가 인증한 Native Synthetic Plan의 원래 1,085배정과 별도 Friendship180배정의 hash를 대조한다. 승인·Source·의미의 원래 범위를 확장하지 않는다. 기존 Official Approval Contract에 암호 검증과 철회 검사를 위임하며, 원래 네 서명이 새 테스트 정의를 승인했다는 주장은 하지 않는다. 실제 Trusted Reviewer·Approval 등록·고객 활성화는 수행하지 않았다.

인증 입력 → 원래 Claim/질문 → 명시적 Semantic Unit → 기능/문체 → typed 명사·술어 → 조건부 문장 → 문단 → 반복·표시·의미 감사 순서로 실행한다. 새로운 사실이나 명리 관계를 계산하지 않는다. 문장별 ledger에는 원래 근거 ID, Root 소유권, 원래 방향의 subject/recipient/day-master witness, 조건·부정·기간, 원래 Source 및 새 표현 Source를 구분해 저장한다.

## 추가로 허용된 Synthetic 정의

운영자는 `required-2`, `condition-c`, `action-c`가 구조 검증용 ID이고 별도의 의미 원문이 없음을 확인했다. 이후 **기존 원본을 보존한 새 테스트 전용 정의 파일 추가**를 허용했다. 이를 `tests/fixtures/korean-editorial-engine-01/synthetic-meaning-definitions.json`에 30개 독립 정의로 작성했다.

각 정의는 원래 engine/fixture/product/relationship/question/material/claim/meaning, 전체 Assignment hash, 원래 Meaning hash, Source file/record/version을 정확히 묶는다. 세 ID에는 각각 새 한국어 의미·조건·행동과 Semantic Unit 참조를 명시한다. 다음 예는 이전에 존재하던 연구 의미를 복원한 것이 아니다.

- `required-2`: 판단 기준이 정해지지 않은 조건에서 반복해 늘린 검토가 결정 시점을 늦출 수 있다는 **새 Synthetic 위험 사례**.
- `condition-c`: “판단할 기준이 정해지지 않았다면,”.
- `action-c`: 같은 조건에서 검토를 마칠 기준과 결론을 낼 시점을 확인하는 **새 테스트 행동 표현**.

`provenance=SYNTHETIC_TEST_ONLY`, `existingResearchMeaning=false`, `automaticClaimAnchorMapping=false`, `actualCustomerAuthorization=false`를 유지한다. 기존 한국어 연구의 12 Claim Anchor·24 Expression Variant와 자동 대응하지 않는다. 새 한국어 질문 풀이는 Synthetic gloss이며 원래 Reader 질문의 공식 교체 승인이 아니다. 정의가 없는 배정은 채우지 않고 부족 상태를 반환한다.

## 실제 출력 범위

| 전문 경로 | Native 배정 | 문장 | 문단 | 보류 질문 |
|---|---:|---:|---:|---:|
| comprehensive | 4 | 5 | 4 | 0 |
| career | 5 | 3 | 2 | 3 |
| love | 7 | 3 | 2 | 5 |
| major-fortune | 17 | 4 | 2 | 166 |
| annual-fortune | 12 | 4 | 2 | 10 |
| compatibility-love | 160 | 4 | 2 | 178 |
| compatibility-marriage | 160 | 4 | 2 | 178 |
| compatibility-parent-child | 160 | 4 | 2 | 178 |
| compatibility-coworker | 140 | 4 | 2 | 178 |
| compatibility-manager-report | 140 | 4 | 2 | 178 |
| compatibility-business-partner | 140 | 4 | 2 | 178 |
| compatibility-friendship | 140 | 5 | 4 | 176 |
| compatibility-friendship · independent display | 180 | 7 | 6 | 174 |

기본 12경로의 전체 질문 중 1,428개, 별도 표시 Fixture의 174개는 정의 부족 또는 원래 정책에 따라 보류한다. 특히 종합/Career의 문단 주소가 없는 질문에 가짜 P번호를 부여하지 않았다. 위 28문단은 52/36문단 고객 Book의 완성을 뜻하지 않는다.

[실제 Synthetic 원고 화면](synthetic-korean-preview.html)에서 모든 생성 문단을 읽을 수 있다. 기존 고객 UI를 재현한 화면이 아니다. [문단 원본](synthetic-editorial-paragraphs.json)과 [문장 ledger](sentence-claim-ledger.json)는 필요 시 기존 GZIP/SHARDS Reader로 해제할 수 있다.

## 실제 14기능 출력 예

| 기능 | 실제 생성 문장 |
|---|---|
| risk | 판단할 기준이 정해지지 않았다면, 반복해서 늘린 검토는 결정 시점을 늦출 수 있습니다. |
| summary | 판단할 기준이 정해지지 않았다면, 반복해서 늘린 검토가 결정 시점을 늦출 수 있다는 뜻입니다. |
| closing | 판단할 기준이 정해지지 않았다면, 반복해서 늘린 검토가 결정 시점을 늦출 수 있다는 점을 확인 질문으로 남길 수 있어요. |
| action | 판단할 기준이 정해지지 않았다면, 검토를 마칠 기준과 결론을 낼 시점을 물어볼 수 있어요. |
| opening | 결정을 앞두고 확인 순서를 정한다면, 결정 전에 먼저 정할 기준을 어떻게 확인해 볼까요? |
| explanation | 검토와 결정의 역할을 나누어 본다면, 확인이 필요한 항목과 결정에 필요한 이유를 구분해 볼 수 있죠. |
| concretization | 제출할 자료를 점검하는 상황이라면, 비교할 두 항목과 제출 시점을 확인해 볼 수 있습니다. |
| positive | 점검할 기준과 마감이 분명한 상황이라면, 결정에 활용할 검토 자료를 남길 수 있습니다. |
| twist | 무엇을 확인할지 먼저 정했다면, 검토를 끝내고 결정할 수 있는 기준을 확인해 볼 수 있어요. |
| comparison | 혼자 살펴볼 때와 함께 결정할 때를 비교한다면, 개인이 확인할 근거와 함께 합의할 기준을 구분해 볼 수 있습니다. |
| scene | 가령 서로 다른 약속 중 하나를 골라야 한다면, 서로 겹친 시간과 먼저 지킬 약속을 비교해 볼 수 있죠. |
| transition | 그 기준의 적용을 다른 질문에서 살펴본다면, 이미 확인한 정보와 다음에 확인할 질문을 구분해 볼 수 있죠. |
| blunt | 판단할 기준이 정해지지 않았다면, 늘어난 검토는 결정을 늦출 수 있습니다. |
| fusion | 부모 A가 자녀 B에게 설명하는 상황이라면, 같은 사람의 명리 근거와 MBTI 선호가 각각 설명하는 범위를 구분해 볼 수 있습니다. |

팩폭은 같은 위험의 비용을 짧게 전달하며 새 반대 성격을 만들지 않는다. 회수는 이미 소개한 동일 Semantic Unit에 한정한다. 문장 표현의 변화나 같은 근거의 반복을 새로운 독립 사실로 집계하지 않는다.

## 문법·장면·문체·반복

392개 원래 연구 record를 원래 ID·SourcePointer·검토 상태와 함께 전수 인수했다. 14기능, 6상품 문체, 7관계/70질문, 19가상 장면, 28문법 연구, 46문법 Fixture, 15연결, 12리듬, 15용어, 144역할 참조, 14불변식, 20금지 표현을 구분했다. 연구량을 새 개인 사실의 수로 세지 않았다.

기존 `withKoreanParticle`, `narrativeSurfaces`, `detectEnding`, `freshNarrativeMemory`, `memoryCount`, `openingFamily`, `narrativeSubject`를 재사용했다. 기존 Renderer 상태를 공유하지 않는다. 조사·인용 명사구·ㄹ 예외·이름·높임·영문/MBTI/한자·숫자·단위·소수점·명사 술어·시제·부정·조건을 제한된 typed slot에서 처리한다. 알 수 없는 발음이나 활용은 보류한다. 기존 helper를 수정하지 않았으며 범용 한국어 형태소 분석기라고 주장하지 않는다.

46문법 Fixture의 실제 결과가 기대값과 일치했다. 19장면은 모두 가상·상품·관계·조건 범위의 정상/부정 검사를 거친다. 실제 Scene construction 예는 적격 한 장면에 한정되며 19개 실제 고객 장면을 생성했다는 뜻이 아니다. 연결은 검증된 A→B/B→A 전환처럼 실제 대응이 있는 것만 출력한다. 접속어로 새 인과를 만들지 않는다.

15용어의 기존 source code hash를 확인했고 9개는 일반 용어 사용 경계의 연구 참조로 실행했다. 신강·신약·충·합·귀인·도화 6개는 상세 실제 조건 공급자가 부족하여 보류했다. 이 참조는 새 개인 해석이나 고객 승인으로 승격되지 않으며, 별도 private memory에서 최초 소개/회수를 구분한다. 개인별 용어 해석의 전체 통합은 완료했다고 주장하지 않는다.

반복 감사는 문단/장/Book 범위를 구분한다. 동일 AST의 반복은 배정 ID·어미 변화와 무관하게 제어하며 Owner·Direction·기간이 다른 원래 설명은 합치지 않는다. 같은 Claim의 primary/action 및 검증된 recall 등 64개의 진단 그룹을 보존했다. 이 그룹을 새 독립 의미 64개나 오류 64개로 집계하지 않는다. 보편적인 자연어 동의어 판별이나 Book 전체 반복 감소의 독자 만족도 개선을 입증한 것은 아니다.

## 표시와 의미 검증

Synthetic 표시 증명은 실제 생성·의미 검증한 문단의 문장 ID/텍스트 hash, Semantic Unit payload hash, Material/Claim/Meaning/Owner/Direction/Root/Source Group/주소를 대조해 만든다. PLANNED를 고객 표시로 바꾸지 않는다. REPAIR에는 원래 Native 선행 조건과 실제 생성된 선행 unit이 모두 필요하다. RECALL에는 원래 introduction 및 동일 소유자·방향·기간의 실제 표시된 의미가 필요하다. 복사한 proof 객체나 단순 actuallyDisplayed 플래그는 인증되지 않는다.

Meaning Validator는 인증된 Claim 및 고정된 finite AST와 실제 문장을 대조한다. Claim/Meaning/Source/근거/Root/소유자/방향/기간/확정성/조건/부정/반례/금지 추론·지원 정보를 바꾸거나 허용되지 않은 텍스트를 넣으면 `WITHHELD_MEANING_NOT_VERIFIED`가 된다. 일반 자연어 의미 동등성을 검증하는 NLP 시스템은 아니다. 원래 14 UnsafeAfter와 20금지 표현 및 어미를 부드럽게 바꾼 반례를 직접 실행했다. CLI 부정 사례 212개 모두 차단됐다.

## 검증과 보존

| 항목 | 실제 결과 |
|---|---|
| 신규 테스트 | 272 PASS / 0 FAIL |
| 기존 Planner / Approval Contract | 125 PASS / 146 PASS |
| 기존 관련 16파일 묶음 | Base/current 5837 PASS / 46 FAIL; 이름·전체 정규화 오류·signature 동일 |
| BusinessPartner 별도 기본5초 | Base/current Engine360 PASS / 1 FAIL + artifacts22 PASS; 합계382 PASS / 1 동일 FAIL |
| TypeScript | Base0 / current0 / new0 |
| 전체 lint | PASS / 0 warnings |
| Production build | Next16.2.4, Node24.22.0 PASS / 관찰 경고0 |
| NFT | 90경로·의존 집합 동일; 새 고객 Runtime 항목0 |
| 기존 원본 | 6111파일 전부 바이트 동일 |
| 새로 생성한 보존 비교 | Book17/102 digests + Friendship20/140 digests + Profile40 전부 동일; 저장본 roundtrip 보존 |
| 독립 CLI | 2개 최종 프로세스 / 33개 물리 산출물 바이트 동일 / 실행 입력20개 hash 봉인 |

전체 Repository Suite를 실행했다고 주장하지 않는다. 기존 테스트를 삭제·skip하거나 timeout을 변경하지 않았다. 보고된 46+1 실패는 이번 범위에서 수정하지 않았다. 원본 checkout의 dirty11개와 기존60 worktree는 전후 별도 hash 스냅샷으로 확인하며, 최종 push 후 보존 결과를 외부 release receipt에 추가한다. master·Production·운영 DB·결제·인증·Worker 변경은 실행하지 않는다.

CLI는 `node --max-old-space-size=8192 tools/korean-editorial-engine/verify.mjs /tmp/<output>`로 실행한다. 테스트한 heap 설정은 8GiB이며 최소 필요 heap을 찾았다는 뜻은 아니다. 동일 로직의 Node 내장 측정 실행은 각각 약83.0초, Node resourceUsage.maxRSS 약3.69/3.75GiB였다. event loop가 긴 동기 단계에서 막히므로 interval RSS 샘플을 peak로 사용하지 않았다. 측정 로그·시간·메모리·임시 경로는 결정론 JSON에서 제외했다. `/usr/bin/time -l`의 sandbox sysctl 제약은 Node 내장 측정으로 우회했으며 운영 설정은 바꾸지 않았다.

## 남은 범위

실제 의미·근거·정확한 Reader bridge, 네 단계의 실제 승인, 최신 trust/revocation, 실제 Binder/Planner 및 Writer/Reader 통합은 후속 별도 승인 범위다. 현재 일반 용어 사용 참조와 제한된 문법을 전체 개인 해석으로 바꾸지 않는다. 조건절의 반복과 한정된 술어·어미 등 문체 한계도 남아 있다. 전체 Book의 자연스러움·판매 품질·독자 만족도 향상을 자동 PASS로 선언하지 않는다. 이번 오프라인 엔진 작업을 마친 뒤 Full Product Integration을 자동 시작하지 않는다.

## 최종 필드

커밋 자체 SHA/최종 Preview처럼 commit 뒤에만 결정되는 값은 최종 응답 및 외부 release receipt에서 확인한다.

| 필드 | 결과 |
|---|---|
| TASK | V4-KOREAN-EDITORIAL-ENGINE-01 |
| BASE_SHA | f104134ffac56d7d0ec32055d1a3095411c9d702 |
| BRANCH | v4/korean-editorial-engine-01 |
| COMMIT_SHA | Resolved after commit in final response and external release-receipt.json |
| REMOTE_SHA_MATCH | Verified after push; external release receipt |
| EDITORIAL_ENGINE | OFFLINE_KOREAN_EDITORIAL_ENGINE |
| EDITORIAL_STATUS | OFFLINE_IMPLEMENTED |
| EDITORIAL_ENGINE_VERSION | offline-korean-editorial-engine-v1 |
| PRODUCT_KEYS | 6 |
| SPECIALIST_ROUTES | 12 |
| COMPATIBILITY_CATEGORIES | 7 |
| PLANNER_HANDOFF_VERSION | global-book-editorial-handoff-v1 |
| PLANNER_HANDOFF_VALIDATION | 27 strict cases / 5073 original evaluations unchanged; 12 native plans + independent Friendship plan exact hashes |
| OFFICIAL_APPROVAL_BOUNDARY | Original four signatures delegated and verified; new definitions are not signed original meanings; real activation pending |
| KOREAN_RESEARCH_RECORDS | 392 |
| EDITORIAL_FUNCTIONS | 14 executable synthetic constructions |
| CLAIM_ANCHORS | 12 references preserved; automatic mappings 0 |
| EXPRESSION_VARIANTS | 24 research references; copied into personal claims 0 |
| PRODUCT_STYLES | 6 exact research policies; 6 distinct product scenarios |
| RELATIONSHIP_STYLES | 7 policies / 70 question references |
| RELATIONSHIP_ROLE_VIEWS | 144 reference-only; new personal facts 0 |
| CONDITIONAL_SCENES | 19 intake + scope/negative tests; 1 licensed hypothetical construction example |
| GRAMMAR_RESEARCH | 28 original studies retained; bounded implementation, not complete morphology |
| GRAMMAR_FIXTURES | 46 executed / 46 passed |
| TRANSITION_RESEARCH | 15 original references; only proven direction changes emitted |
| RHYTHM_RESEARCH | 12 references; private memory / deterministic ending choice; human gain not proven |
| TERM_EXPLANATIONS | 15 exact source hashes / 9 general usage references / 6 withheld |
| INVARIANT_FIXTURES | 14 original UnsafeAfter cases executed and blocked |
| REJECTED_EXPRESSIONS | 20 original cases + softened variants executed and blocked |
| CLAIM_MEANING_PRESERVATION | Original identities and full source snapshots preserved; 30 newly declared SYNTHETIC_TEST_ONLY definitions |
| SEMANTIC_UNIT_PRESERVATION | Exact pinned typed units; no claim that new units existed in original research |
| SOURCE_PROVENANCE | Original native source file/record/version + separate new-definition file/record hash |
| ACTUAL_EVIDENCE_VALIDATION | Unchanged native twelve Gates; strict customer sentences 0 |
| FACT_ROOT_OWNERSHIP | Canonical roots and ownership retained; new independent facts 0 |
| OWNER_DIRECTION_VALIDATION | Original owner/direction and subject/recipient/day-master witness objects retained |
| TEMPORAL_SCOPE_VALIDATION | Exact native windows, before/after and month scope; no new calculations |
| NEGATION_CONDITION_VALIDATION | Exact finite AST + explicit conditional clauses and negation scope |
| COUNTEREXAMPLE_PRESERVATION | Original + separate synthetic counterexamples/prohibitions retained |
| EDITORIAL_FUNCTION_SELECTION | 14 purposes tested; missing risk/twist/display support withheld |
| PRODUCT_STYLE_DISTINCTION | 6 product policies and original question scopes retained |
| RELATIONSHIP_STYLE_DISTINCTION | 7 specialized scenarios; fixed parent/child and manager/report roles retained |
| TYPED_KOREAN_GRAMMAR | Bounded noun/phonology/predicate/construction slots; unknown forms withheld |
| PARTICLE_VALIDATION | Known slots reuse existing withKoreanParticle; quotes/rieul/unknown pronunciation tested |
| PREDICATE_VALIDATION | Closed reviewed forms; copula separate from verbs; uncertainty/negation retained |
| PUNCTUATION_SPACING | Protected literal joins preserve decimals/versions; no whole-prose regex correction |
| TERM_EXPLANATION | General usage references only; first introduction/recall memory; unavailable strength/formations/markers withheld |
| CONDITIONAL_SCENE_VALIDATION | Hypothetical scope mandatory; source/product/category/context checked |
| NARRATIVE_MEMORY | Existing seven helper functions reused; private draft state |
| SEMANTIC_REPETITION_CONTROL | Exact semantic payload ignores assignment IDs/ending variation; native reuse policy retained; no universal NLP claim |
| PARAGRAPH_TRANSITIONS | Verified AB to BA reading connectors; no inferred causality |
| REPAIR_DEPENDENCIES | Native dependency + genuinely generated prerequisite unit required |
| RECALL_DISPLAY_DEPENDENCIES | Native introduction + same owner/direction/time + exact displayed semantic payload required |
| SENTENCE_CLAIM_LEDGER | 48 default + 7 separate display-fixture sentences; original source/claim/scope and new expression source |
| SYNTHETIC_ROUTES_GENERATED | 12 |
| SYNTHETIC_KOREAN_SENTENCES | 48 default; separate Friendship display fixture 7 |
| SYNTHETIC_KOREAN_PARAGRAPHS | 28 default; separate Friendship display fixture 6; not complete customer paragraphs/Books |
| SYNTHETIC_DISPLAY_RECORDS | 28 default + 6 independent-session records; customer display 0 |
| SYNTHETIC_HARD_GATE_VIOLATIONS | 0 |
| READER_QUESTION_PRESERVATION | Original IDs/text/addresses unchanged; new Korean gloss explicitly synthetic, not a real Reader bridge |
| UNVERIFIED_READER_BRIDGES | Existing Reader/Scheduler bridge remains unverified; new bridges 0 |
| EDITORIAL_SHORTAGES | 1428 default questions + 174 separate Friendship questions; retained explicitly |
| WHOLE_DRAFT_QUALITY_AUDIT | Structural/meaning checks pass; blind human reading and satisfaction improvement not proven |
| MEANING_PRESERVATION_FAILURES | 0 accepted output violations; 212 CLI negative cases blocked |
| GRAMMAR_FAILURES | 0 among 46 bounded grammar fixtures |
| DUPLICATE_MEANING_GROUPS | 64 diagnostic groups across paragraph/chapter/Book scopes, including primary/action/recall; not 64 new independent meanings |
| PROHIBITED_ASSERTIONS_BLOCKED | 20 original rejected expressions + softened variants; all 14 UnsafeAfter invariants blocked |
| ACTUAL_OPERATOR_APPROVED | 0 |
| ACTUAL_CUSTOMER_APPROVED | 0 |
| ACTUAL_CUSTOMER_ELIGIBLE | 0 |
| ACTUAL_CUSTOMER_SELECTIONS | 0 |
| ACTUAL_CUSTOMER_CLAIMS | 0 |
| ACTUAL_BOOK_ALLOCATIONS | 0 |
| CALCULATION_PRESERVATION | 40 Profiles + 17 Books/102 digests + Friendship20/140 digests byte-identical |
| COMPATIBILITY_SCORE_PRESERVATION | Fresh original/current compatibility output and Profiles identical |
| NARRATIVE_PRESERVATION | 6111 original files byte-identical; fresh narrative digests identical |
| BOOK_PRESERVATION | 17 Books/102 + Friendship20/140 + stored roundtrip preserved; Production writes 0 |
| EXISTING_TEST_FAILURES | 5837 PASS / 46 identical FAIL; separately BP382 PASS / 1 identical FAIL at default 5000ms |
| NEW_TEST_FAILURES | 272 PASS / 0 FAIL; original Planner125 and Approval146 pass |
| TYPESCRIPT | 0 before / 0 after / 0 new |
| LINT | PASS / 0 warnings |
| BUILD | PASS / Next16.2.4 / Node24.22.0 / 0 observed warnings |
| DIFF_CHECK | PASS — staged new files only |
| NFT_TRACE_PRESERVATION | 90 paths + dependency sets identical; new runtime entries 0 |
| DETERMINISTIC_BUILD | 2 independent final CLI processes; 33 physical output files byte-identical; 20 executable input hashes sealed |
| PRIVACY_CHECK | PASS — final full scope scan before commit |
| VERCEL_PREVIEW | Verify exact final commit/ref/repository/project/target=null after push; external receipt |
| REMAINING_GAPS | Unfilled questions; real approvals/activation and real Reader bridge pending; bounded grammar; 6 term scopes withheld; human quality gain unproven; legacy 46+1 failures |
| NEXT_STAGE_READY | Offline foundation available; full customer integration/sales approval not enabled; next phase not started |
