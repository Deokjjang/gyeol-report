# V4-CAREER-MONEY-STUDY-SPECIALIST-ENGINE-01

커리어·금전·학업의 원래 연구와 실제 계산·입력·추천 proof 사이의 적용 가능성을 판정하는 독립 **오프라인 Specialist Engine**을 구현했다. 실제 연구에서는 진단만 실행하며 고객 순위·선택·claim·Book 배정은 0이다. 기존 고객 원고의 개선이나 판매 승인을 뜻하지 않는다.

- Base: `96fe614cc32e130a9fce9311a6330f443b22ab5a` (`v4/comprehensive-specialist-engine-01`).
- Branch: `v4/career-money-study-specialist-engine-01`.
- Worktree: `/private/tmp/gyeol-career-specialist-engine-01`.
- Product: `career_money_study` / `career-money-study`.
- Status: `CAREER_SPECIALIST_ENGINE / OFFLINE_IMPLEMENTED`.
- 원본 checkout은 `v4/annual-editorial-quality-fix-01 / c048218cc5961e0f53a1deab2603511e17559fc3` 그대로 보호한다. 기존 worktree 42개·미커밋 11개·base 추적 파일 4,304개를 보존한다.

## 구현 및 실행

신규 코드: `src/lib/report-knowledge/knowledge-integration-foundation/career-specialist-engine/`.

| 파일 | 실행 책임 |
| --- | --- |
| `candidateIndex.ts` | 원래 192 Material·180 질문 연결 및 SourceKey/주소/역할/facet/직업/직무/추천 참조 색인 |
| `requirementAdapter.ts` | 원래 SourceKey→Registry→원본 locator/hash 연결; 명시적 native target만 존재 관측으로 추가 |
| `context.ts` | 원래 10 JobStatus 범위 비교와 기존 V3/V4 직무 분류 관측; 능력·경험과 구분 |
| `proofMatcher.ts` | 원래 추천 ID·순서·이유·proof와 회피 환경을 읽고 실제 Graph 근거의 완전성·root 호환성 검사 |
| `domainRequirements.ts` | 경제·학습의 구별되는 의미와 원래 조건 보존, 실제 재무/숙련 정보 미입력 차단 |
| `conflictGraph.ts` | 원래 연구의 root·질문·직무·조건·회수 관계 및 검토 필요 상태 |
| `reuseConstraints.ts` | Career facet 4회·같은 장 중복·root 사용 정렬·회수/Context 제약 |
| `selectionEngine.ts` | 격리 합성 session, 기존 12 Gates, 전문 조건, 세 선택 방식과 검색 한도 |
| `syntheticValidation.ts` | 독립 합성 Registry/Graph/승인/입력 관측으로 긍정·부정 사례 실행 |
| `artifacts.ts`, `types.ts` | 정형 receipt·coverage·worklist·개인정보 제거·인수 계약 |

```sh
node tools/career-specialist-engine/verify.mjs
pnpm exec vitest run tests/unit/report-knowledge/careerSpecialistEngine.test.ts
```

기존 Catalog, SourceReader, Source/Semantic 검증, ActualBindingIndex, bindKnowledgeCandidate, ProductSpecialistFoundation을 재사용한다. 의미 관계는 기존 종합 엔진의 `resolveMeaningRelationship`, 일반 회수 검사는 `checkSyntheticRecall`, 개인정보 처리는 기존 `privacySafeGraph`를 재사용한다.

종합의 선택 session은 상품·fixture registry·Context·예산이 고정되어 있어 그대로 사용하지 않는다. 종합의 root hard cap 3/facet 5 정책도 복제하지 않았다. 기존 종합 엔진을 공통 계층으로 리팩터링하거나 수정하지 않고 Career의 상태·직무·추천·경제·학습 및 예산 조건을 별도로 구현했다.

CLI는 원래 Foundation/Binder/Graph CLI를 수정 없이 실행한다. 같은 Catalog와 실제 27 Graph를 인수하고 원래 종합 4사례 산출물 29개도 재생해 비교한다. Career 평가는 원래 3사례만 사용한다. 실제 Graph를 다시 계산하지 않으며 고객 API Route·Writer·운영 DB·결제·Worker 연결은 없다. 예상하지 않은 네트워크 호출은 차단한다.

## 원본 목록 및 집계 단위

| 항목 | 확인 결과 |
| --- | ---: |
| 전체 Research / Interpretation Candidates | 18,610 / 4,270 |
| Reader 장 / 문단 / 역할 | 9 / 36 / 144 |
| 원래 Question | 180 = 문단 36 + 역할 144 |
| 전문 Material | 192 |
| 조건부 / 회수 / 보류 | 171 / 20 / 1 |
| Source Registry / Material의 SourceKey occurrence | 117 / 198 |
| 직무 연구 / 상세 응용 / 원래 직무 기능 연구 | 23 / 24 / 11 |
| 원래 A~T 입력 연구 / 추천 경로 | 20 / 8 |
| applicable Catalog 후보 | 268 |
| 원래 Career Graph / 후보×fixture | 3 / 804 |

원래 review 필드는 그대로 보존한다. 조건부 171개는 회수 20개를 제외한 수이며, 회수 Material의 원래 review 값을 다른 상태로 바꾸지 않는다. Material의 원문·SourceKey·원래 의미·역할·장면·조건·반례·금지·locator/hash는 수정하지 않는다. 원래 질문이나 Material 연결이 없는 경우를 문구 유사도로 채우지 않는다.

원래 Foundation의 질문 지표는 **540 question-fixture / witness 보유 140 / witness 참조 205**다. Binder의 Graph witness 41과 서로 다른 단위이므로 합산하지 않는다. 추가 입력 및 직무 분류 probe도 3개 Binder 비교군에 합산하지 않는다.

## 실제 Binding 전후

| 같은 3개 Graph, 같은 268개 후보 | Before | After |
| --- | ---: | ---: |
| 후보×fixture | 804 | 804 |
| Source reference match occurrence | 960 | 1,248 |
| Graph-node witness occurrence | 41 | 215 |
| ACTUAL_CALCULATED_FACT Gate PASS | 20 | 20 |
| 구조 Gate 전체 충족 | 0 | 0 |
| Source Group PASS | 0 | 0 |
| 운영자 승인 / 고객 eligible / 고객 claim | 0 / 0 / 0 | 0 / 0 / 0 |

48개 native 요구조건 template에서 기존 Source reference 288건과 실제 witness 174건이 추가됐다. 이것은 새로운 계산·Fact Root·개인 능력·경제 결과의 생성이 아니다. 실제 조건·Domain·의미·승인 Gate는 계속 적용되어 구조 매칭과 고객 사용 가능 수가 증가하지 않았다.

## SourceKey 및 native 연결

SourceKey는 연구 참조이며 Actual Evidence ID가 아니다. 198개 SourceKey occurrence는 다음 방식으로 원본까지 추적한다.

1. 원래 Source Registry의 unique key 및 Registry record/source 파일 hash 확인.
2. 명리·Fusion: 원래 ID, record hash, 파일 hash가 같은 Catalog 원본 확인.
3. MBTI: 정규화 참조 `mbti:TYPE:traits:AREA:TRAIT`와 실제 Catalog의 trait ID가 다르다. **타입·정확한 영역/pointer·원본 파일 hash·record hash**로 같은 원본 trait를 확인한다. 별칭은 Registry에 그대로 남기며 실제 ID를 별도 기록한다. 유사 trait을 찾거나 이름을 바꾸지 않는다.
4. JobStatus: `input-contract:jobStatus`는 원래 `JOB_STATUSES` export의 파일/배열 hash로 확인한다. 입력 enum 참조이지 계산 사실이 아니며 native selector를 만들지 않는다.
5. 정확히 연결할 수 없는 참조는 CONTRACT_NOT_MACHINE_CHECKABLE로 남긴다. 잘못된 타입·영역·파일/record hash는 거부한다.

native 십성은 원래 deep 정의의 **명시적 targetId**가 가리키는 native definition만 사용한다. 광범위한 ancestry나 비슷한 label로 target을 고르지 않는다. 원래 native support/getTenGod, source hash, 기존 TenGod literal과 exact alias, `collectStructureAtoms / STRUCTURE_VERSION / system=myeongli / person owner`를 확인한다. matched node의 실제 pillar·position·slot·participants를 보존하며 자연어 위치 조건이 해결됐다고 표시하지 않는다.

원래 definition requirement, Source Group, 모든 자연어 조건 677개 occurrence와 반례·금지는 그대로 남긴다. 십성의 존재를 직업 적성·전문 숙련·소득으로 바꾸지 않는다. 실제 의미 identity 승인 수는 0이고 192개 모두 의미/적용 검토가 필요하다.

## 실제 직업 입력과 업무 기능

JobStatus는 원래 10값 `"" / student / job_seeker / employee / freelancer / self_employed / business_owner / homemaker / unemployed / other`만 사용한다. 빈 값은 UNKNOWN이다. `other`는 직업 상세를 알려 주지 않는다. 모든 10값을 허용하는 Material은 MATCHED_SCOPE_ONLY이며 전문 상황 검증이 아니다.

상세 직업은 실제 입력, 원래 직무 연구의 testedInputText, V3 base classifier, narrativeContext 및 V4 override를 각각 구분한다. 상태는 EXACT_ENTERED_CONTEXT / SUPPORTED_WORK_FUNCTION / V4_OVERRIDE_OBSERVED / GENERIC_WORK_FUNCTION / UNKNOWN_WORK_FUNCTION / JOB_RESEARCH_REFERENCE_ONLY / PERSONAL_SKILL_UNVERIFIED로 기록한다. 직무 연구나 상세 응용의 task·workflow·outputs·skillVerification은 일반 연구 자료이며 고객의 수행 경험이 아니다.

재검증한 예:

- 프리랜서 사진가·상품/인물 사진가: unknown 유지. 사진 연구의 존재로 parser 지원을 주장하지 않는다.
- 번역가: V3 unknown과 V4 language_mediation override를 구분한다.
- 매장 운영: employee와 self_employed의 기존 기능 차이를 보존한다.
- homemaker / unemployed: 기존 caregiving / recovery 분기를 보존한다.
- 재무·개발·교육: 기존 producer가 반환하는 기능만 관측한다.

새 직무 classifier나 자유문 NLP 추론은 없다. 직업 명칭으로 숙련·계약·고객·직원·권한·자격을 만들지 않는다. A~T 및 직무/상태 probe는 classifier-only이며 Graph witness 또는 Binder fixture로 계산하지 않는다. 별도 실제 생성 테스트에서는 같은 원국·MBTI/다른 직업 상태의 핵심 계산·프로필 불변과 같은 MBTI/다른 원국의 실제 계산 차이를 확인했다.

## 기존 추천·회피 proof

원래 8개 경로와 실제 결과의 ID·순서·이유·proof·sourceRefs를 그대로 인수한다. route 연구의 존재, 실제 추천 결과의 존재, 실제 proof의 완전 매칭, 전문 응용 승인, 고객 eligible을 구분한다.

실제 3사례의 추천·회피 proof에는 Actual Graph에서 전부 address할 수 없는 legacy 참조가 남는다. 일부 native/MBTI/Fusion node와 root가 연결돼도 전체 proof 매칭으로 취급하지 않는다. **완전한 추천 proof match 0 / 회피 proof match 0**이며, 원래 결과의 부분 연결과 부족한 source refs는 그대로 출력한다. 직무 연구의 가능한 route 참조를 새로운 추천으로 만들지 않는다.

원본 MBTI 직업 Hint의 미해결 참조는 INTP 2건·ENFP 1건, 총 3건으로 재확인했다. 유사 trait을 연결해 보완하지 않았다. 실제 수행 능력·건강·자격 부족·조직 부적합·선호·갈등 경험은 서로 다른 사실이며 회피 환경 문구만으로 그 사실을 확정하지 않는다.

## 경제·학습 조건

경제 vocabulary는 매출·이익·현금흐름·보수·가격·시간·기회비용·유지 비용을 구분한다. 학습 vocabulary는 흥미·선호·개념 이해·실습·독립 수행·전이·자격·법적 권한·숙련을 구분한다.

원래 자유문 조건을 단어 하나로 자동 분류하거나 통과시키지 않는다. Material별 semantic classification은 검토 필요로 남긴다. 전통 재성/RESOURCE_SENSE는 실제 돈이나 투자 수익률이 아니며, 배움 선호는 자격·학력·성적·독립 수행의 증거가 아니다. 실제 금액·수익·자산·직원·계약·학력·자격·숙련 등은 UNKNOWN이다.

합성에서는 명시적으로 선언된 경제/학습 요구와 실제 격리 입력 관측을 정확히 비교한다. 관심만 입력한 경우 독립 수행 조건을 충족시키지 않는다. 실제 유료 입력 스키마에 재무/자격 필드를 추가하지 않았다.

## 의미·충돌·사용 예산

동일 root의 별칭·semantic axis·facet·Fusion·claim wrapper를 독립 사실로 늘리지 않는다. 실제 의미 pair 8,982건과 fixture별 duplicate root group 47건을 감사한다. 이 수는 확정 모순이나 승인된 독립 의미 수가 아니다. SAME_FACT도 meaning/claim 독립성 승인이 아니며, 다른 질문·조건·행동의 응용은 검토 전까지 승인하지 않는다.

Career Conflict Graph는 동일 근거/의미, 다른 직무·응용, 긴장·보완, Context·JobStatus 충돌, 추천 proof 불일치, 경제·학습의 사실 전제, 선행 회수를 구분한다. 원래 조건이 미해결이면 REVIEW_REQUIRED다. 실제 돈/능력 정보가 없다는 사실 자체를 확정 모순이나 실패 경험으로 해석하지 않는다.

기존 Release를 조사한 제약:

- positive facet 사용 최대 4회; risk/recall은 이 positive cap의 기존 예외를 유지한다.
- 같은 장 positive facet 중복 제한과 원래 risk 예외를 구분한다.
- root atom 사용 수는 정렬 조건이며 hard cap 3이 아니다.
- 기존 K 선택의 duplicateGroup/semanticTheme 및 broadTheme 제한은 별도 계약이다.
- 기존 Career narrative renderer의 명시 MBTI 예산 6도 변경하지 않는다. 신규 엔진은 고객 문장을 생성하지 않는다.

Canonical Fact Root ↔ Release atom, 연구 facet ↔ Release facet, Reader CH01~09 ↔ K1~10은 IDENTITY_BRIDGE_UNVERIFIED다. 연구 facet마다 새 예산을 주거나 종합의 facet 5/root 3 정책을 가져오지 않는다. 합성의 root 사용 지표는 새 primary 정보 사용량이며 recall의 지원 참조를 새 primary 사실로 세지 않는다.

CH09의 20개 회수 Material은 실제 표시 ledger, 같은 owner·MBTI·root·meaning·claim, 호환 jobStatus/function/detail context/질문과 원래 preceding reference가 필요하다. 후보 존재나 예정 배정은 표시 이력이 아니다. 실제 연구 경로에서는 고객 ledger를 발급하지 않는다.

## 합성 선택 검증

실제 연구나 Graph를 clone해 가상 승인하지 않았다. 독립 JSON Registry·원래 파일/record hash·자체 Graph/owner/root·authentic 승인 계약과 private session을 사용한다. Graph에 기록된 합성 직무 Context와 실제 입력이 일치해야 하며 함수 flag로 대체할 수 없다. Metadata-only GraphInput은 격리 Binder용이며 실제 report/Book/composer/Foundation에 전달하지 않는다.

기존 12 Gates를 재실행한 뒤 전문 Context·추천·경제·학습 조건과 의미/충돌/사용 제약을 적용한다. 높은 fit이나 직접 자료라는 이유로 Gate 실패를 보상하지 않는다. 실제 자료의 ranking/selection/claim은 없다.

| 비교 | FIRST_ELIGIBLE | QUESTION_FIT_FIRST | CONSTRAINT_AWARE_SELECTION |
| --- | --- | --- | --- |
| Career facet 예약 사례 | 4개 질문 | 4개 질문 | 대체 facet 예약으로 5개 질문 |
| 직접 전문성 사례 | 간접 i | 직접 j | 직접 j |

선택은 질문 충족·중요 질문·요구 의미·직접 전문성·검토된 독립 의미·root 재사용 압력·긍정/위험/반전 기능을 사전식으로 비교한다. 불투명 승인 점수는 없다. 질문 24/후보 256/방문 200,000 상한을 두며, 실제 낮은 한도 테스트에서 SEARCH_LIMIT_NO_OPTIMALITY_CLAIM을 확인했다.

추가 결과:

- 경제/숙련 요구 미입력 0, 명시적 합성 요구 충족 1; 학습 흥미만으로 숙련 통과 불가.
- 추천 proof 부재/다른 root 0, 정확한 격리 proof 1.
- CH09 실제 표시 없음 0, 호환 display ledger 있음 1. 예정 선택을 display로 변환하지 않는다.
- 미해결 같은 Context의 반대 방향은 차단, 등록된 split/complement는 공존.
- 잘못된 owner·source hash·source definition만 존재·필수 root withheld·missing fact·AND 누락·Domain 금지·다른 상태·unknown function은 차단.
- 같은 root를 요구하는 유효한 AND 두 항목도 독립 root 두 개가 되지 않는다.

## 검증 및 보존

| 검증 | 결과 |
| --- | --- |
| 신규 Career 회귀 | 78 PASS / 0 FAIL / 0 skip |
| 기존 Catalog/Source/Semantic/Graph/Binder/Foundation/종합 엔진/Book 관련 | 344 PASS / 0 FAIL |
| 기존 실패 16개 파일 | 기준/수정 후 모두 5,837 PASS / 46 FAIL; 전체 signature 동일 |
| TypeScript | 기준 0 → 최종 0; 신규 0 |
| lint / Production build / diff-check | PASS / PASS / PASS |
| 실제 17 Book | 102 digest 및 전체 원고/Book/grammar probe 객체 동일; 저장 snapshot roundtrip PASS |
| 원본 파일 | 4,304개 byte 동일 |
| 기존 generated JSON | Catalog59 / Source20 / Semantic23 / Graph105 / Binder83 / Foundation64 / 종합29 보존 |
| 파일 추적 | 기존 88 NFT path set 동일; 신규 엔진/연구/검증/fixture/CLI 추가 추적 없음 |
| 결정론 | 독립 2회 생성 JSON 35개 byte 동일 |
| 개인정보 | 이름·생년월일·원본 node/root ID 제거; 실제 상세 자유문은 caller에만 보존 |

기존 실패를 삭제·skip·수정하지 않았다. 전체 repository suite green을 선언하지 않는다. 실제 Production DB 고객 열람 E2E를 새로 실행한 것이 아니라 기존 저장본의 오프라인 roundtrip과 전체 객체를 비교했다. 로컬 NFT 결과를 원격 압축 함수 크기 수치로 주장하지 않는다. 실행 시간/RSS는 별도 오프라인 관측이며 고객 성능 개선 주장이 아니다.

## 산출물·남은 조건

manifest, 원래 Candidate/Question/SourceKey 연결, 9장/36문단/144역할 matrix, binding receipt 전체, JobStatus/직무 probe, 추천·회피 proof, 경제·학습 계약, 의미/충돌/root 계약, 합성 결과, operator worklist 및 보존/오류/개인정보/trace 자료를 제공한다. `deterministic-output.json`은 엔진 생성 35개만 포함한다. timing·보고서·배포 receipt는 별도다.

남은 조건:

- 192개 의미/응용 검토와 실제 운영자/고객 승인 0.
- 원래 자연어 조건 677개 occurrence, 정형 Source Group record 0 및 실제 반례/적용 검토.
- legacy 추천/회피 proof의 완전한 Graph addressability, 현재 미지원 직무, 부분 Facet/Fusion producer.
- Reader/K, canonical root/Release atom, 연구/Release facet bridge.
- 실제 고객 표시 ledger.
- 기존 독립 테스트 실패 46개.
- 현재 Release 길이·일반 문장·legacy fallback은 후속 Writer/Publication의 필수 감사 항목이며 여기서 수정하지 않는다.

`career-specialist-handoff.md`는 후속 인수 계약이다. 고객 연결·Writer·Global Planner·다른 상품은 시작하지 않았다. master·Production·DB·결제·인증·Worker·환경변수는 변경하지 않는다. 신규 브랜치 commit/push 및 final SHA의 실제 Preview 상태는 최종 보고에서 확인한다.
