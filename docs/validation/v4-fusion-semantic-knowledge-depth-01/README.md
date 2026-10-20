# V4-FUSION-SEMANTIC-KNOWLEDGE-DEPTH-01

검증일: 2026-10-13 KST. 기준 브랜치 `v4/semantic-axis-knowledge-expansion-01`, 기준 SHA `071acdc456ddba3b8467667d53f4ff809c9b39dd`에서 독립 worktree를 만들었다. 시작 시 원격 기준 SHA도 일치했다. 작업 브랜치는 `v4/fusion-semantic-knowledge-depth-01`이다.

이번 범위의 **독립적인 조건부 Fusion 연구 자료 구축과 검증을 완료했다.** 새 자료는 실증된 명리·심리 사실이나 고객별 적용 결과가 아니다. runtime 연결·고객 사용 승인·새 계산 Evidence·새 점수 기여는 모두 0이다. 후속 연결 및 전문 상품 DB 작업은 수행하지 않았다.

## 실제 구축 범위와 집계

| 항목 | 결과 | 의미와 한계 |
|---|---:|---|
| 기존 상품용 Fusion | 44/44 | 원래 ID·유형·feature·trait·tag·Domain·원문·선택 조건 보존 |
| 기존 의미 축 Complement | 96/96 | 원본 변경 없이 별도 긍정·위험·조건·반례·차별점 작성 |
| Complement 그룹 | 8/8 | 역할과 Context 차이 검토 |
| Tension Split | 10/10 | 분리 조건·양면성·미해결 조건·추가 근거 작성 |
| 기존 SemanticTag | 22/22 | 원래 44규칙의 양측 태그와 축 관련 참조를 구분; 새 연결 승인 아님 |
| 의미 축 | 36/36 | 기존 축·방향 계약 보존 |
| facet | 109/109 | 104개는 Fusion 쌍에서, 5개는 별도 조건 연구에서 비교 |
| 신규 source-task 후보 | 24 | 18개 facet 상호작용 후보 + 6개 기존 의미의 과제 조건 확장 |
| MBTI 유형 | 16/16 | 실제 trait를 사용하는 후보 및 유형별 부족 영역 검토; 균등 배정 아님 |
| 개별 의미 자료 | 169 | 44+96+24+5; split 10개는 별도 |
| 긍정 / 위험 / 가상 장면 / 조건 연구 | 각 179 | 개별 자료 169 + split 10; 실증 사실 수가 아님 |
| 반전 자료 | 169 | 조건부 반전; 관찰된 고객의 행동·경험이 아님 |
| 상품 적용 질문 | 164×6 = 984칸 | 기존 축별 질문과 조합 고유 초점의 적용 조건 |
| 관계 적용 질문 | 164×7 = 1,148칸 | 역할·방향·동의·권력 조건; 전문 관계 DB가 아님 |
| 관계 종류 계약 / 반려 사례 | 3 / 16 | legacy와 semantic의 비동등성, 잘못된 추론의 금지 조건 |
| 새 runtime 규칙 / 새 Evidence 사실 | 0 / 0 | 생성기·점수·계산·선택·Book 변경 없음 |

프로토콜·그룹·원천 목록·복제한 기존 원문·적용 질문 칸을 추가 해석 재료 수에 합산하지 않았다. 2,132칸을 새 전문 해석 2,132개로 주장하지 않는다. 숫자는 [coverage-manifest.json](coverage-manifest.json)에 같은 정책으로 기록했다.

## 기존 경로 전수 감사

필수 16개 모듈의 구현·호출자를 읽고 hash를 보존했다. 주석의 `offline-only`/`no-writer` 표시와 실제 adapter 호출이 다른 곳이 있으므로 현재 기준 코드의 실제 호출을 기준으로 판정했다. 아래의 active는 **이 기준 브랜치의 코드 경로**이며 Production 배포 확인을 뜻하지 않는다.

| 시스템 | 확인한 실제 경로 | 구분 |
|---|---|---|
| 상품용 44규칙 | `runtimeShadow` → adapter/composer/Evidence → `buildMyeongliMaterialPacket` → `buildFusionCore` → `interpretFusion` | 현재 V4 경로에서 사용 |
| 의미 축 Fusion·96 Complement | 상품 view → integrated natal·MBTI profile → `buildMyeongliMbtiFusion` → claim·Resonance·편집 후보 | 현재 V4 경로에서 사용 |
| 기간 상품 참고 | major/annual adapter → 원국 profile + 실제 기간 십성 relevance → 출력 | 원국 Fusion을 새 기간 계산으로 재명명하지 않음 |
| 기존 지식 78규칙 | `knowledgeSelectors.findFusionRules` → FactCondition·실제 trait·interaction trace | 44/96과 다른 선택 경로 |
| Bridge 31장면·hint | 기존 상품 Evidence builder → Bridge packet → fact·trait·장면 조건 | 별도 연결 계층; hint는 MBTI 축 점수의 원천 아님 |
| Personal Resonance 96규칙 | profile·Fusion·claim → `evaluatePersonalResonance` → 인물 서술 | 파생 편집 계층; 추가 독립 사실 아님 |
| MBTI Pair 연구 | 기존 notablePairs 256 + 신규 방향 연구 256 | 개인 Fusion이나 명리 사실이 아님 |
| 이번 신규 연구 | 신규 자료를 읽는 연구 테스트만 존재 | runtime import·lookup·barrel 없음 |

전체 모듈·직접 소비자·hash는 [existing-module-graph.json](existing-module-graph.json), 경로의 역할은 [fusion-system-inventory.json](fusion-system-inventory.json), 78/96/31의 개별 ID·조건은 [other-fusion-systems-inventory.json](other-fusion-systems-inventory.json)에 기록했다. 원본 파일은 수정하지 않았다.

### 실제 44규칙 계약

원본은 overlap 32, contrast 8, complement 4개다. 같은 owner의 eligible observation, 실제 MBTI trait `plainKo`와 direct/inferred, 요청·규칙·Material의 Domain 교집합, Material tag와 semantic connection을 확인한다. gap은 complement에만 사용하고 growth는 제외한다. 근거 강도 → 종류 → lexical 순서와 feature/Domain별 경쟁 조건을 보존했다. 원천 누락은 억제하며 fallback 사실을 만들지 않는다. 새 자료의 `legacyTagReview`는 원래 양측 태그와 기존 22개 태그 연구의 RELATED_CONDITIONAL/ONE_TO_MANY/NOT_EQUIVALENT/NO_TRAIT_INFERENCE 상태를 보존한다. 관련 축의 참조를 새 semanticConnection 승인으로 사용하지 않는다. [semantic-tag-crosswalk.json](semantic-tag-crosswalk.json) 참조. 자세한 각 규칙 원문·trait pointer·Material·선택 조건은 [legacy-fusion-inventory.json](legacy-fusion-inventory.json)에 있다.

원본 유형별 개수: INTJ 3, INTP 4, ENTJ 6, ENTP 3, INFJ 2, INFP 2, ENFJ 2, ENFP 4, ISTJ 3, ISFJ 2, ESTJ 2, ESFJ 2, ISTP 3, ISFP 2, ESTP 2, ESFP 2. 이것은 정적 규칙 분포이며 Production 선택 빈도는 측정하지 않았다. 기존 44개 중 inferred trait를 쓰는 3개도 그대로 유지했다.

### 실제 96규칙·8그룹 계약

원본 96개 전부의 `positiveMeaning`과 `shadowMeaning`은 비어 있었다. 원본을 채워 runtime 의미를 바꾸지 않고 새 연구 자료에 대응되는 의미를 작성했다. 그룹별로 THINKING_ANALYSIS 12, EXECUTION_STRATEGY 12, LEADERSHIP_STATUS 12, MONEY_REALITY 12, SOCIAL_COMMUNICATION 12, CREATION_LEARNING 12, RELATIONSHIP 10, CHANGE_RECOVERY 14개다.

원래 축A/축B·부호·Context를 그대로 보존했다. 축A를 항상 명리, 축B를 항상 MBTI로 고정하지 않는다. 두 source assignment 각각에 실제 원천 검토가 필요하다. 이 연구 단계에서 **96개의 구체 명리 Evidence와 MBTI source node가 바인딩된 수는 0**이다. 축 조합의 역할을 연구한 것과 개인에게 성립한 것을 구분한다.

### 일치·긴장·보완

- 일치는 정확히 같은 의미·대상·방향을 각각의 원천이 지원하는지 검토한다. 두 체계가 같은 말을 한다는 이유로 실증 확신을 올리지 않는다.
- 긴장은 반대 부호인지, 다른 Context·대상·시점인지를 구분한다. 실제 분리 조건이 없으면 미해결 또는 조건부 가설로 남긴다.
- 보완은 두 기능이 같은 과제에서 맡는 역할과 필요한 자원·동의를 구분한다. 장점 두 개의 합이나 자동 성공이 아니다.

legacy overlap/contrast/complement와 semantic REINFORCE/TENSION/COMPLEMENT는 자동 동치가 아니다. 특히 기존 gap complement와 등록된 두 축의 기능 보완은 다르다. [fusionRelationContracts.json](fusionRelationContracts.json)에 세 종류의 실제 계약·반례를 기록했다.

10개 split은 원래 enum과 알고리즘을 유지했다. ACTION_TEMPO의 기본 BEFORE_AFTER 분리는 추가 축 없이도 CONDITIONAL_HYPOTHESIS로 resolved될 수 있어 실제 고객의 결정 전후 경험을 입증하지 않는다. HEAD_HEART의 CARE/STRATEGY, DESIRE_BEHAVIOR의 EXPRESSION/BOUNDARY 등 보조 근거가 부족하면 UNRESOLVED를 정상 상태로 유지한다.

## 실제로 추가한 정보의 예

전체 169개 개별 자료와 10개 split은 [materials-review.md](materials-review.md)에서 원천·기여 facet·긍정·과용·좋은 의도의 실수·반전·장면·행동·반례까지 읽을 수 있다. 아래는 서로 다른 정보가 무엇인지 확인하는 예다. 모두 조건부 편집 연구다.

| 자료 | 추가한 질문·역할 | 과용·반례 |
|---|---|---|
| `entj-wealth-pressure-structure` | 성과 목표와 실제 지원 인력·현금 여력을 다른 항목으로 점검 | 목표의 크기를 능력 증거로 쓰며 혼자 부담; 지원이 충분한 경우와 구분 |
| `entj-made-value-structure` | 제작 완료와 구매 이유·가격·유지 책임을 구분 | 작품 만족과 판매 의사는 다를 수 있음; 위 규칙과 같은 trait를 써도 다른 과제 |
| `intp-pressure-learning-structure` | 원인 조사와 임시 복구, 필요한 도움을 병행 | 이해가 끝나야 한다며 복구를 지연; 과도한 압박에서는 보호가 먼저 |
| `C001 / C081` | 동일 PRECISION+CARE 쌍을 검수 지원과 친밀한 선호 갱신의 서로 다른 대상으로 검토 | 공통 social Context의 같은 의미 재사용은 독립 근거가 늘지 않음 |
| `C006 / C064 / C065 / C066 / C067` | 이해 재현·제작 시험·산출 형식·설명 수신·전이 범위를 구분 | 모두 “배운 것을 써보라”로 압축하지 않음 |
| `C025 / C027 / C031 / C036` | 지원 여력·위임 책임·공식 역할·산출 완료를 구분 | 모두 책임감이라는 한 성격으로 묶지 않음 |
| `C037 / C038 / C041 / C047` | 자원 흐름·비축 목적·선택권 교환·사용 순서를 구분 | 실제 소득·수익·안전한 투자 결과를 보장하지 않음 |

가상 생활 장면은 모두 가상임을 표시했다. 장면을 실제 고객의 과거 사건이나 관찰된 성격으로 바꾸지 않는다. 최종 고객 문장·조사·어미를 만드는 결합기는 추가하지 않았다.

## 원천 조사와 부족 영역

기존 연구 2,991레코드를 실제 export/index로 다시 읽어 hash를 대조했다. 명리 연구 2,181개와 MBTI 연구 810개를 합친 수이며 전부를 새 명리 사실로 세지 않는다.

| 기존 조사 family | 레코드 수 |
|---|---:|
| foundation | 213 |
| completion | 173 |
| deep | 838 |
| composite | 301 |
| relation | 246 |
| temporal | 410 |
| MBTI individual | 531 |
| MBTI pair | 279 |

위 수에는 정의·적용·프로토콜 등 서로 다른 역할의 레코드가 들어 있다. 신규 개인 조건 연구 512개와 방향 pair 연구 256개는 해당 family 안의 부분집합이다. 원래 검토·출처·지원 상태는 [inherited-research-index.json](inherited-research-index.json)과 [fusion-source-crosswalk.json](fusion-source-crosswalk.json)에 보존했다.

음양·오행·일간·60일주·십성·십이운성·신살/귀인·지장간·원국 구조·천간/지지 관계·기간 상호작용의 **11개 family**를 [saju-family-readiness.json](saju-family-readiness.json)에서 실제 계산 가능성, 연구만 존재하는 경우, 비교할 의미, 필요한 원국 조건, 금지 추론으로 구분했다. 신규 후보에 사용한 22개 명리 원천 locator는 실제 ID·export·index·hash를 확인했다. 22개가 전체 DB의 새 사실 수를 뜻하지 않는다.

MBTI 원천 1,213 trait의 실제 JSON pointer·ID·내용 hash·direct/inferred를 전수 확인했다. direct 938, inferred 275개이며 둘 다 실증 타당성 표시가 아니다. 신규 후보는 실제 primary trait와 해당 원천 파일 hash를 사용한다. 기존 annotation은 수정하지 않았다.

16유형 각각의 정적 분포·영역 편중·부족한 질문·추가한 후보·원천 한계는 [mbti-type-review.md](mbti-type-review.md)와 [mbti-16type-gap-audit.json](mbti-16type-gap-audit.json)에 있다. 유형별 규칙 수를 맞추지 않았다. source 자료 안의 직업·소득·학교·관계 일반화는 원문으로 보존하되 새 개인 사실로 승인하지 않았다.

외부에서 실제 접근한 [Myers & Briggs Foundation의 관계 설명](https://www.myersbriggs.org/type-in-my-life/personality-type-and-relationships/home.htm)은 특정 유형 조합의 성공 우열을 주장할 수 없다는 제한을 뒷받침한다. 이 자료는 명리×MBTI Fusion의 실증 근거가 아니다. 별도 윤리 자료의 접근 실패도 기록했고 확인하지 못한 내용을 인용하지 않았다. 과거 연구의 모든 역사적 출처를 이번에 다시 접속했다고 주장하지 않는다. [source-verification.json](source-verification.json), [source-audit-results.json](source-audit-results.json) 참조.

## 범위·독립성·상품 적용

개인 Fusion은 같은 개인의 명리와 MBTI만 비교한다. A와 B는 별도 유지하고 실제 관계 enum과 A→B/B→A를 확인한다. 부모·자녀는 보호·자율·발달 단계, 상사·팀원은 권한·평가·보고가 비대칭이므로 이름 반전으로 반대 방향을 만들지 않는다. 기존 Pair 연구의 별도 이름과 실제 canonical enum 간의 대응도 역할 검증을 대신하지 않는다.

기존 `interpretFusion`은 명리 observation의 subject를 검사하지만 MBTI 입력은 owner envelope 없는 유형 문자열이다. 현재 호출자가 올바른 slot의 MBTI를 넘겨야 하는 계약이 있다. 새 binding에서 양측 소유자를 별도로 검증할 요구를 기록했으며 **이번에 runtime owner validator를 구현했다고 주장하지 않는다.**

기간 활용은 실제 producer·참여 기둥·원국/대운/세운/월운 origin·[start,end)·전환 전후·교집합이 필요하다. MBTI는 시기 계산 근거가 아니다. 시간 지평 선호와 운의 기간은 동치가 아니다. 상세 구간이 지원되지 않으면 연도 전체로 확대하지 않고 보류한다.

명리 사실의 여러 설명·태그·facet은 같은 fact root로 묶고, trait의 다른 표현도 같은 원천으로 묶는다. Fusion wrapper를 추가된 제3의 독립 사실로 세지 않는다. 서로 다른 데이터셋이라는 이유만으로 통계적 독립성이 증명되지는 않는다.

상품·관계 적용은 [product-applicability.json](product-applicability.json), [relationship-applicability.json](relationship-applicability.json)에 조합의 초점과 기존 축별 서로 다른 질문을 연결했다. 업무/돈 원천뿐인 의미를 연애 행동으로 이전할 수 없으면 `not_transferable`, 기간 상품은 `temporal_evidence_required`로 표시했다. 실제 챕터·문단 배정과 전문 6상품·7유형 DB는 후속 작업이다.

## 중복·충돌·반려

44규칙 내부 946쌍, 96규칙 내부 4,560쌍, 44↔96 교차 4,224쌍의 source root·feature·축/방향·Context를 기계적으로 전수 비교했다. **이 수는 모든 쌍을 사람이 의미 동등성 승인한 수가 아니다.** 동일한 순서 무관 축·부호 쌍은 C001/C081이며 조건·대상을 직접 비교했다. 기존 12개 복합 의미와의 연결도 별도 목록화했다.

22개 정성 감사 항목은 [semantic-review.md](semantic-review.md)와 [semantic-duplication-audit.json](semantic-duplication-audit.json)에 있다. 같은 주장, 같은 원천의 다른 조건, 같은 핵심의 분야 적용, 다른 주장, 직접 근거 없는 연결을 구분했다. 공통 단어·축 유사도만으로 동등성을 확정하지 않았다.

특히 다음은 승인하지 않았다.

- 현침의 전통 자형을 현대적 정밀함·거짓말 탐지 능력의 직접 근거로 바꾸는 해석.
- 귀인의 도움 **수혜**를 CARE의 도움 **제공**과 자동 동치화하는 해석.
- 도화·홍염의 노출/매력 상징으로 상대의 실제 호감·동의를 확정하는 해석.
- sourceCoverage direct/inferred를 실증 검증·개인 적합으로 승격하는 해석.
- 동일 fact를 facet·Fusion·Resonance로 재사용하며 독립 근거 수를 늘리는 해석.
- 반대 축을 결함으로 처리하거나 부정 신호의 부재로 긍정을 확정하는 해석.
- A/B·방향·기간 혼동, 성공·재물·연애·건강 보장, 가상 장면을 과거 사실로 처리하는 해석.

16개 반려 사례와 재검토 조건은 [rejectedFusionResearch.json](rejectedFusionResearch.json)에 있다. 신규 자료의 실증 검증·개인 적용 수는 각각 0이다. 기존 10개 현대 신살 대응의 검증 부족, 96개 미바인딩 source, 기존 보류 상태, 외부 자료 접근 실패·선택 빈도 미측정·통계 독립성 미확립은 [unverified-research.json](unverified-research.json)에 남겼다.

## 후속 연결 준비

[fusion-binding-handoff.md](fusion-binding-handoff.md)는 기존 Evidence blueprint를 참고해 원천 → 계산 → 기존 Evidence → MBTI node → 조건 → Fusion → 상품/관계 → 기간 → 배정의 입력·배제·중복 계약을 정리한다. `fusionBindingProposalTypes.ts`는 제안 타입만 제공한다. 새 producer·실행 validator·runtime binding은 없다. `fkr:` 연구 ID와 실제 계산 Evidence ID는 타입으로 구별했다.

후속 작업에는 원천 현대 적용 검토, 실제 계산/입력 조건, owner·direction·interval 검증, 같은 의미의 사용 장부, 전문 상품·관계 질문의 구체화, 실제 고객 표현과 독해 검수가 필요하다. 이번 작업에서 시작하지 않았다.

## 실행 검증과 보존

환경: Node v25.9.0, npm 11.12.1, Next.js 16.2.4, Vitest 4.1.5. 실제 실행 로그는 [logs](logs/)에 있으며 명령·exit code는 [validation-results.json](validation-results.json)에 기록했다.

| 검사 | 결과 |
|---|---|
| 기준 SHA의 알려진 실패 재현 | 36 PASS / 3 FAIL |
| 신규 연구 테스트 | 201 PASS / 0 FAIL |
| 관련 40개 테스트 파일(신규 포함) | 2,544 PASS / 3 FAIL |
| 6상품 통합·digest·저장본 읽기 | 64 PASS / 0 FAIL |
| 관련 + 6상품 합계(중복 없이) | **2,608 PASS / 기존 3 FAIL; 신규 실패 0** |
| TypeScript | 기준 0 → 변경 후 0 |
| lint | PASS |
| Production build | PASS; 47 static pages; NFT/새 경고 없음 |
| diff-check | PASS; 신규 파일 staging 후 cached diff 포함 |
| 원천 재검사 | 기존 연구 2,991개·trait 1,213개·명리 locator 22개 actual/hash 일치 |
| 기존 파일 | src·MBTI 원천·검증 문서·tests 2,133개 byte hash 일치 |
| 원본 checkout·기존 worktree | 기존 20개 전체 branch·HEAD·status·tracked/nonignored 파일 hash 유지 |

기존 실패는 다음과 같으며 수정·skip·삭제하지 않았다.

1. `foundationAdapter.test.ts:116`: `careerReleaseMaterials.ts`를 허용하지 않는 기존 격리 기대식 실패. 기준 SHA에서도 동일 메시지.
2. `customerDayunGeneration.test.ts:50`: major_fortune bypass 사례에서 `Unexpected end of JSON input`.
3. 같은 위치의 annual_fortune bypass 사례에서 같은 JSON 오류. 기준 SHA에서도 동일.

초기 관련 검사에서 새 자료의 원천 **문자열 경로**를 import로 간주하는 기존 검사 2개가 추가로 걸렸다. 실제 runtime import는 없었다. 전체 파일/export/index를 별도 감사 catalog로 보존하고 연구 자료는 안정적인 auditRef로 참조하도록 정리했다. 기존 테스트를 바꾸지 않은 최종 실행에서 이 2건은 해결됐다.

빌드는 `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack`으로 실행했다. 로컬 검증 프로세스의 설정이며 환경 파일·Production 설정을 수정하지 않았다. 외부 원고 API·운영 DB·결제·배포는 실행하지 않았다.

6상품 통합의 64개 사례 중 성공 생성 62개의 기존 draft/evidence/calculation/narrative/integration/Book/snapshot/page structure digest와 2개의 기존 거절 결과가 일치했다. owner/shared 저장본 읽기 및 이전 6개 저장 Book의 재생성 없는 재열람 계약도 통과했다. 운영 DB의 실제 고객 Book을 읽거나 덮어쓰지 않았다.

원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`로 유지됐다. `.gitignore`, `AGENTS.md`, `supabase/.temp/`의 기존 11개 변경 파일과 모든 기존 worktree를 보존했다. 새 worktree를 포함하면 총 21개다. [preservation-results.json](preservation-results.json) 참조.

## 산출물 찾기

| 목적 | 파일 |
|---|---|
| 전체 시스템·호출·기존 원천 | `fusion-system-inventory.json`, `existing-module-graph.json`, `baseline-inventory.json`, `other-fusion-systems-inventory.json` |
| 44/96 전수 원본·연구 | `legacy-fusion-inventory.json`, `legacy-44-review.json`, `complement-96-inventory.json`, `complement-96-review.json` |
| 8그룹·10split·종류 계약 | `fusion-group-review.json`, `fusion-tension-review.json`, `fusion-context-matrix.json`, `fusionRelationContracts.json` |
| 36축·109facet·12복합 | `semantic-facet-crosswalk.json`, `semantic-tag-crosswalk.json`, `facet-fusion-studies.json`, `semantic-composite-cross-audit.json` |
| 신규 후보·MBTI 16유형 | `fusion-rule-candidates.json`, `mbti-16type-gap-audit.json`, `mbti-type-review.md` |
| 명리·MBTI 원천·추적 | `saju-family-readiness.json`, `inherited-research-index.json`, `fusion-source-crosswalk.json`, `mbti-source-traits.json`, `mbti-trait-fusion-crosswalk.json`, `source-ref-catalog.json`, `source-verification.json`, `source-audit-results.json` |
| 실제 전체 의미·장면 | `materials-review.md` |
| 상품·관계·scope·독립성 | `product-applicability.json`, `relationship-applicability.json`, `applicability-gates.json`, `scope-independence-contracts.json` |
| 중복·충돌·보류·반려 | `legacy-pair-audit.json`, `complement-pair-audit.json`, `legacy-complement-cross-audit.json`, `semantic-review.md`, `semantic-duplication-audit.json`, `unverified-research.json`, `rejectedFusionResearch.json` |
| 후속 binding | `fusion-binding-handoff.md` |
| coverage·보존·실행 | `coverage-manifest.json`, `existing-files-preservation.json`, `preservation-results.json`, `validation-results.json`, `logs/` |

코드 자료는 `src/lib/report-knowledge/fusion-knowledge-research/`의 정적 타입·레코드 13개 파일이다. 관련 신규 테스트는 `tests/unit/report-knowledge/fusionKnowledgeResearch.test.ts` 하나다. 기존 파일 수정은 0개다. Git commit/push는 이 신규 경로만 포함하며 최종 SHA와 원격 일치는 완료 응답에서 보고한다.

연구 레지스트리로서 후속 검토에 전달할 준비는 됐다. 실제 Evidence 연결·고객 승인·판매/배포 승인은 남아 있다. master·Production은 변경하지 않았으며 다음 작업은 시작하지 않는다.
