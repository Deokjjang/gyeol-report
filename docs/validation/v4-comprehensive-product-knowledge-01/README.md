# V4-COMPREHENSIVE-PRODUCT-KNOWLEDGE-01

검증일: 2026-10-13 KST. 기준 브랜치 `v4/fusion-semantic-knowledge-depth-01`, 기준 SHA `6d220856fbfa9a681a74625680387f855b5e77f0`에서 독립 worktree를 만들었다. 시작 시 원격 기준 SHA도 일치했다. 작업 브랜치는 `v4/comprehensive-product-knowledge-01`이다.

**종합 상품의 13장·52문단·208역할에 대응하는 독립 연구 DB를 구축했다.** 실제 의미 후보는 179개이며, 175개는 조건부 편집 연구, 4개는 원천·조건 부족으로 보류했다. 실증 검증·개인 적용·고객 사용 승인은 어느 자료에도 부여하지 않았다. 원고·근거 연결·선택·배정·문장 결합·Book 코드는 변경하지 않았다.

검증은 신규 603건 통과, 관련·6상품 합계 **3,444 PASS / 기존 6 FAIL / 기존 조건부 미실행 1**이다. 처음 알려진 실패 3건과 확장 검사에서 확인한 추가 3건을 기준 SHA에서 각각 재현했다. 신규 실패·TypeScript 진단은 0이다. lint·Production build·diff-check도 통과했다. 이를 판매 품질이나 배포 승인으로 해석하지 않는다.

## 실제 자료와 집계

| 항목 | 수 | 집계 의미 |
|---|---:|---|
| 독자 계약 | 13장·52문단·208역할 | 실제 title·Domain·Context·purpose·role 문구 그대로 |
| 해석 후보 | 179 | 문단마다 3~4개; 동일 표현 변형을 늘린 수가 아님 |
| 독립 질문·세부 해석 | 20 | 이 중 17개 조건부, 3개 보류; 새 심리·명리 사실 수가 아님 |
| 조건부 결합 | 77 | 이 중 76개 조건부, 1개 보류 |
| 맥락별 응용 | 47 | 기존 의미의 다른 과제·대상·조건 |
| 실제 도입 의미 회수 | 35 | 선행 후보 풀에서 실제 소개된 호환 부분만 사용 |
| 역할 기여 연결 | 716 | 179×4; 추가 해석 자료 수에 합산하지 않음 |
| 긍정 / 과용 / 팩폭 / 반전 / 가상 장면 / 응용 | 각 179 | 같은 자료 안의 서로 다른 역할; 1,074개 새 사실이라고 세지 않음 |
| 실제 원천 locator | 140 | 명리 56, primary MBTI 54, Fusion 연구 30 |
| 기존 연구 조사 | 2,991 | 명리·개인 MBTI·Pair의 원래 출처·상태·hash 보존 |
| 의미 조사 | 36축·109facet·12복합 | 선택된 것은 35축·83facet; 나머지는 가능성·조건 조사 |
| 입력 조건 / 재사용 계약 / 반려 | 21 / 15 / 24 | 신규 runtime 입력·판정 함수가 아님 |
| 새 runtime 연결 / Evidence 사실 / 점수 기여 | 0 / 0 / 0 | 생성기·원고·기존 Book 불변 |

전부가 한 고객에게 성립하는 후보 목록이 아니다. 서로 다른 유형·원국·입력 상태의 후보를 한 인물상으로 합치지 않는다. `coverage-manifest.json`은 위 집계와 문단별 ID를 기계적으로 확인할 수 있게 제공한다.

## 13장별로 새롭게 답하는 질문

| 장 | 연구의 초점 | 다른 장과 구분 |
|---|---|---|
| CH01 핵심 | 무엇을 먼저 확인하는 사람인지, 근거의 기여와 대표 대비 | 첫인상·모든 재능·미래 결과를 앞에서 소진하지 않음 |
| CH02 오행 | 표지·분포·월령·유효성·구조·부재의 제한 | 낮은 오행을 능력 부족으로 바꾸지 않음 |
| CH03 Fusion | 같은 대상의 공통 기능, 다른 역할, 실제 분리 조건 | 유사 문구·수혜/제공·resolved를 실제 개인 사실로 승격하지 않음 |
| CH04 겉과 안 | 표현 채널·사적 정리·공개·친밀도의 조건 | 타인의 마음·숨은 상처를 읽었다고 하지 않음 |
| CH05 강점 | 분석·실행·제작·배치·설명·유지의 서로 다른 기능 | 두 번째 재능에 독립 기능·fact root 확인 요구 |
| CH06 팩폭 | 좋은 의도·실제 행동·수신·비용·조절 | 모욕·진단·미입력 갈등·과거 경험 금지 |
| CH07 좋은 패 | 지원·학습·산출·교환·역할·관심의 긍정 상징 | 전통 상징·생활 응용·현실 결과의 층위 구분 |
| CH08 일·학업 | 과제·완료 기준·재량·학습 지원·피드백 | 천직·직업·현재 직장·합격을 만들어내지 않음 |
| CH09 돈 | 목적·유입·비축·유지 비용·대가·결과 범위 | 재성을 실제 잔고·수익률·투자 능력으로 전환하지 않음 |
| CH10 연애 | 관심 표현·속도·공간·참여 동의 | 특정 상대·교제 경험·진심·궁합을 만들지 않음 |
| CH11 가족 | 실제 합의 역할·지속 부담·공동 영향·개인정보 | 원국 위치를 가족 구성·의무·부양의 사실로 전환하지 않음 |
| CH12 사회 | 자발적 우정·다른 취향·연락·거절·대화 목적 | 연애 호감·가족 의무·가상 Pair 분석과 구분 |
| CH13 사용법 | 실제 소개된 의미를 판단·실행·관계의 한 기준으로 회수 | 새 성격·새 원국·새 MBTI·예언을 추가하지 않음 |

52개 문단에는 질문·핵심·다른 문단과의 차이·원천 요구·긍정/위험/반전/장면 역할·재사용 조건·다음 정보가 있다. 208개 역할에는 원래 역할 문구와 복수 후보의 실제 기여를 연결했다. 목적을 다시 나열하거나 같은 208개 템플릿을 만든 것으로 완료 처리하지 않았다.

전체 자료는 [materials-review.md](materials-review.md), 긍정은 [positive-materials-review.md](positive-materials-review.md), 팩폭·반전은 [fact-bomb-materials-review.md](fact-bomb-materials-review.md)에서 읽을 수 있다. 최종 고객 원고나 한국어 문장 결합 템플릿이 아니다.

## 원래 계약·자료 감사

필수 13개 생성·계약 모듈의 구조와 실제 호출을 확인하고 hash를 보존했다. reader CH01~CH13과 내부 scheduler C1~C10은 별개다. `legacy-section-reference-matrix.json`은 다대다 **연구 참고표**이며 실제 배정 변경이나 일대일 대응표가 아니다. 실제 release의 `legacySections`는 원래 plan의 Evidence ownership에서 도출된다.

기존 `RELEASE_FACETS`는 정확히 15개이고 각 facet에는 11개 생활 application 맥락이 있다. 별도 positive와 risk·risk scene·social intent·closing·social value/fit·positive activation·money axes/value·social repair·reader application 등 **20개 export 묶음**도 조사했다. 기존 원문·키·축·긍정·위험·장면은 모두 보존했다. 258개 상위 항목은 서로 다른 역할의 tuple/map이 섞인 inventory 수이며 새 독립 해석 수가 아니다.

15개 facet은 이미 구체적인 생활 자료를 갖고 있다. 부족한 점은 자료가 전혀 없다는 것이 아니라 하나의 넓은 기능에 여러 질문이 압축된 데 있다. 예를 들어 order는 오류 발견·논리 정합·누락·기준 일관성을, care는 수혜·필요 확인·제공·비개입·지속 여력을 모두 대신할 수 없다. resources의 기존 PRACTICALITY와 RESOURCE_SENSE도 같은 축이 아니다.

`existing-facet-audit.json`과 [existing-material-review.md](existing-material-review.md)는 15개 각각의 원래 기능·차이·일반화·정보 손실·재사용 위험을 직접 비교한다. 신규 자료는 기존 의미의 세부화, 조건부 결합, 다른 질문, 종합 전용 응용으로 관계를 명시했다. 원래 facet 수·선택 우선순위·사용 예산은 변경하지 않았다.

## 원천의 전체 조사와 실제 선택

| 기존 family | 조사 수 | 종합에서의 적용 제한 |
|---|---:|---|
| 명리 foundation | 213 | 실제 계산·원국 조건·원래 출처 상태 필요 |
| completion | 173 | 보강 전거·적용 조건·보류 상태 유지 |
| deep | 838 | 60일주·십성의 정의·차이·분야 응용을 구분 |
| composite | 301 | 구조가 실제 성립한 것인지 별도 확인 |
| relation | 246 | 원국·두 사람·기간의 참여자와 scope 유지 |
| temporal | 410 | 종합의 타고난 성격·미래 사건 근거로 제외 |
| MBTI individual | 531 | 조건부 개인 연구 512개와 메타 자료를 구분 |
| MBTI pair | 279 | 방향 연구 256개와 메타 자료; 상대 없는 개인 근거로 제외 |

실제 primary MBTI trait 1,213개의 ID·pointer·record hash·sourceCoverage도 확인했다. direct 938, inferred 275이며 원천 직접성이 실증·개인 적합을 뜻하지 않는다. 16유형 전체를 조사했고 새 후보는 실제 primary node만 참조한다. 원천에 담긴 소득·학교·직업·관계의 일반화를 새 개인 사실로 승인하지 않았다.

기초 정의가 `repository_only`인 일부 십성은 해당 상태를 유지한 채 기존 심층 정의·전거도 함께 참조했다. 예를 들어 정인·편인·비견은 기존 deep의 상대 관계 정의·원국 조건·분야 응용의 구분을 참고한다. 이는 원래 기초 레코드를 수정하거나 현대 행동을 실증 검증한 것이 아니다. 여러 정의 참조를 여러 개인 fact로 집계하지 않는다. 자료별 `sourceReviewNotes`에 이 차이를 기록했다.

기존 Fusion 44개·Complement 96개·신규 후보 24개의 총 164개 자료를 조사했으며 실제 신규 문단에서 직접 참조한 Fusion 자료는 30개다. 실제 양측 원천·같은 개인·Domain·source assignment·반례·분리 조건이 필요하다. 연구 후보를 현재 등록 Fusion이나 계산 Evidence로 변환하지 않는다.

기존 파생 계층도 별도 조사했다. Claim 41규칙, Resonance 96규칙, Guidance 문제 40·전략 25·맥락 variant 28개를 `derived-system-inventory.json`에 보존했다. 이 계층을 새로운 독립 명리 사실이나 원천 trait로 세지 않는다.

36축·109facet과 기존 복합 의미 12개는 적용 가능한 질문과 조건을 조사했다. 직접 자료에 사용한 것은 35축·83facet이다. 나머지 26facet과 COMPETITION 축을 숫자를 맞추려고 임의 결합하지 않았다. `semantic-facet-applicability.json`은 선택과 가능 질문을 구분하고, `semantic-composite-applicability.json`은 공유 축과 의미 동등성 승인을 구분한다.

이번에 전통·심리 사실이나 외부 출처를 새로 만들지 않았다. 원천 검증은 실제 저장소의 export/index·pointer·버전/hash·기존 출처 상태를 확인한 것이다. 과거 외부 원전을 이번에 모두 재접속했다고 주장하지 않는다. 현대 생활 장면은 조건부 편집 연구다. [source-verification.json](source-verification.json), `source-catalog.json`, `source-applicability.json` 참조.

## 실제 정보의 차이와 전체 인물상

- CH01의 “먼저 이해할 이유를 찾는다”는 관심 방향이다. CH05는 분석이 수신자의 어떤 결정을 가능하게 하는지를 묻고, CH13은 더 알아볼 질문과 지금 할 단계를 고르는 기준으로 회수한다.
- CH05의 제작은 함께 검토할 견본이라는 기능이다. CH07의 식상생재는 실제 구조의 긍정 의미이고 CH09는 수요·가격·수정·유지 책임의 조건이다. 같은 산출이 있어도 새로운 정보가 다르다.
- CH06의 요청 없는 교정과 CH12의 친구 고민은 관련된 비용이다. 후자는 자발적 대화의 목적·거절권이 추가된다. 같은 팩폭에 친구라는 단어만 붙이지 않는다.
- CH10의 사적 공간, CH11의 공동 준비 정보, CH12의 연락 주기는 다른 합의다. 같은 CARE/AUTONOMY/BOUNDARY라도 친밀감·공동 영향·자발적 참여를 구분한다.
- 원천 대조에서 같은 유형·영역 안의 trait도 동의어로 쓰지 않았다. 실제 INTJ thinkingStyle, ISTJ의 정재/공동생활 inferred node, ISTJ의 안정적 관계 node, ISFJ의 애정 배려 node 등 본문 질문에 맞는 원천을 확인했다.

179자료의 15,931쌍을 구조적으로 비교해 source/facet 공유 1,466쌍을 목록화했다. 이것은 모든 쌍의 의미 동등성을 사람이 승인한 수가 아니다. 핵심·긍정·과용·팩폭·반전·응용의 완전 동일 문장은 없지만 문구 차이만으로 의미 독립성을 판정하지 않는다. 15개 장간 재사용 계약과 실제 사례의 차이는 [chapter-coherence-review.md](chapter-coherence-review.md)에 있다.

후보 풀은 한 고객이 모두 가진 특성의 목록이 아니다. 특히 회수 후보에 다른 유형이 있어도 실제 도입된 동일 개인·유형·맥락의 호환 부분집합만 사용해야 한다. CH13 자료에는 직접 신규 원천이 없고 선행 의미 참조만 있다. 실제 도입 ledger를 검증하는 코드는 후속 작업이며 이번에 구현하지 않았다.

## 미상·입력 상태

실제 jobStatus는 빈 값 포함 10개, relationshipStatus는 빈 값 포함 6개다. 학생·구직·직장·프리랜서·자영업·사업·가사/돌봄·쉬는 상태·기타에 서로 다른 과제·자원·권한 질문을 작성했다. 관계 `other`는 지원하지 않아 반려 목록에 기록했다. MBTI `provided`는 16유형을 묶은 연구 표기이며 신규 enum이 아니다.

MBTI 미상은 원래 빈 문자열/null 경계를 보존한다. 명리 단독 후보 56개와 실제 선행 의미를 회수하는 자료를 준비했다. CH01.P3·CH03 등 양측 비교가 필수인 역할은 보류하고 유형이나 Fusion을 만들지 않는다. 이것은 모든 미상 고객에게 208개 역할이 반드시 발행된다는 주장이 아니다.

exact/approximate/unknown과 기존 stable/candidates/confirmed를 따른다. 미상 시주·전체 부재·완성 구조·가족 역할을 합성하지 않는다. 실제 직무·수입·가족 구성·상대 유형·교제 경험이 없으면 일반 질문 또는 보류 상태다. [unknown-input-policy.md](unknown-input-policy.md), `input-context-coverage.json` 참조.

## 보류·반려와 남은 연결 요구

현재 보류 후보 4개는 CH07의 문창 배치표·전거 대조, 재고 projection·전거, 갑자/자중 장간 정의·생활 응용 조건, 반안 전거 문제다. 계산을 고치거나 기존 검토 상태를 올리지 않았다. 정확한 ID·원천·추가 조건은 `unverified-research.json`에 있다. 모든 현대 응용의 실증·실제 개인 적용 수는 0이다.

24개 반려 자료는 단일 표지로 인물 확정, 유형 생성, prior/direct 승격, 낮은 오행의 결함화, 시주 합성, 미성립 구조, 기간→원국, Pair→개인, 상대 마음, 수혜→제공, 독립 재능 부풀리기, 성공 보장, 가상 경험, 직업 생성, 투자 능력, 가족 사실, 새 enum, CH13 새 근거·유형 혼합·표현량 부풀리기를 다룬다.

[binding-handoff.md](binding-handoff.md)는 원천·실제 계산·primary trait·조건·독립성·독자 역할·도입 ledger·중복·회수·표현의 요구를 구체화한다. `bindingProposalTypes.ts`는 제안 타입만 제공한다. 새 연결 엔진·validator·선택기·문장기는 없다.

## 현재 생성기의 확인된 한계

일반 language pool의 실제 후보 제한, root primary 3회·facet 5회·facet:context 중복, discovery/전체 예약, recall 원천 조건을 보존했다. 자료 수가 늘어도 현재 pool이나 배정에 자동으로 들어오지 않는다. 용어·명시 MBTI 예산과 동일 문장 거절로 문장이 줄거나 3개 미만이면 문단이 생략될 수 있다.

기존 9,000~11,000자·문단 수·반복 문제는 qualityIssues, 원천·source·signed axis·Fusion·유형 오류는 hardErrors다. 실제 adapter는 release hardErrors면 실패하고, release opening과 direction section 존재 여부로 legacyNarrative를 선택한다. qualityIssues만으로 fallback이 일어나는 것은 아니다. 부분 원고도 그 구조 조건을 만족하면 release일 수 있다.

[generator-limitations.md](generator-limitations.md)에 코드 위치·원인·후속 요구를 기록했다. 이번 연구 DB로 현재 고객 원고의 분량·판매 품질이 개선됐다고 주장하지 않는다.

## 검증 결과

환경: Node v25.9.0, npm 11.12.1, Next.js 16.2.4, Vitest 4.1.5. 명령과 exit code는 `validation-results.json`, 실제 로그는 [logs](logs/)에 있다.

| 검사 | 결과 |
|---|---|
| 알려진 실패의 기준 SHA 재현 | 36 PASS / 3 FAIL |
| 추가 실패의 기준 SHA archive 재현 | 대상 3 FAIL 동일; CLI 필터로 나머지 63건 미선택 |
| 신규 연구 검사 | 603 PASS / 신규 실패 0 |
| 관련 48파일 | 3,380 PASS / 기존 6 FAIL / 기존 조건부 미실행 1 |
| 6상품 통합(전·후 각각) | 64 PASS / 0 FAIL |
| 변경 후 합계(중복 없이) | **3,444 PASS / 기존 6 FAIL / 기존 조건부 미실행 1** |
| TypeScript | 기준 0 → 변경 후 0 |
| lint | PASS; 신규 테스트 예약 변수명 lint 문제 수정 후 최종 통과 |
| Production build | PASS; 47 static pages; NFT/신규 경고 0 |
| diff-check | PASS; staging 후 cached diff도 확인 |
| 원천 | 기존 연구 2,991개·primary trait 1,213개·선택 locator 140개 actual/hash 일치 |
| 기존 파일 | 2,201개 src·원천·문서·test/fixture byte hash 일치 |
| 작업 보호 | 기존 21worktree 전체 branch·HEAD·status·tracked/nonignored file hash 일치; 원본 11변경 보존 |

기존 실패 6건은 다음과 같다. 테스트 삭제·기대값 변경·skip 추가·생성기 수정은 하지 않았다.

1. `foundationAdapter.test.ts:116`: 기존 `careerReleaseMaterials.ts` 격리 기대식 실패.
2. `customerDayunGeneration.test.ts:50`: major_fortune bypass의 `Unexpected end of JSON input`.
3. 같은 위치 annual_fortune bypass의 동일 JSON 오류.
4. `comprehensiveAllocation.test.ts:99`: 기존 C9 composite fixture가 현재 recovery 분류에서 선택되지 않음 (`expected [] to include 'composite'`).
5. `comprehensiveAllocation.test.ts:113`: 기존 recovery-axis Fusion fixture의 C9 적격 기대식 (`expected false to be true`).
6. `comprehensiveEditorialPlan.test.ts:145`: 이미 기준 코드에 존재하는 `careerReleaseRenderer.ts`의 PlanCore 참조가 과거 격리 기대식과 충돌.

추가 4~6은 새 자료 없는 기준 SHA archive에서도 같은 파일·메시지로 재현했다. 현재 `classifyRecovery`는 단순 flag/축만이 아니라 sourceText의 실제 회복·환경·부담 의미를 분류하고 GENERIC_TRAIT를 제외한다. 기존 fixture와 이 계약의 정합성은 별도 기술 검수 대상으로 남겼다.

조건부 미실행 1건은 기존 `comprehensiveRelease.test.ts`의 former 13D-6B snapshot 검사다. 원래 `EDITORIAL_LEGACY_SNAPSHOT` 입력이 있어야 실행되며 이번에는 해당 fixture를 제공하지 않았다. 이를 PASS에 포함하지 않았다. 다른 6개 기존 저장 Book과 owner/shared 재열람은 6상품 통합에서 실행·통과했다.

6상품 통합의 성공 생성 62개는 기존 계산·editorial invariant·draft·전체 Evidence·narrative·integration·Book·snapshot·page structure digest가 일치했고, 기존 거절 결과 2개도 유지됐다. 이전 6개 Book은 재생성 없이 저장본으로 읽었다. 실제 운영 고객 DB를 읽거나 Book을 덮어쓰지 않았다.

빌드는 `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack`으로 실행했다. 로컬 검증 프로세스의 설정이며 환경 파일·Production 설정은 수정하지 않았다. 외부 원고 API·운영 DB·결제·환불·배포·이벤트 활성화는 실행하지 않았다.

## 산출물

| 목적 | 파일 |
|---|---|
| 실제 계약 | `chapter-contract-matrix.json`, `paragraph-role-matrix.json`, `required-source-modules.json` |
| 새 주소·후보·역할 | `chapter-research.json`, `paragraph-research.json`, `comprehensive-knowledge-index.json`, `sentence-role-coverage.json`, `coverage-manifest.json` |
| 기존 15facet·20묶음 | `existing-material-inventory.json`, `existing-facet-audit.json`, `existing-material-review.md` |
| 전체 원천·실제 locator | `inherited-research-index.json`, `source-applicability.json`, `mbti-source-traits.json`, `source-catalog.json`, `source-verification.json` |
| Fusion·의미·파생 계층 | `fusion-source-applicability.json`, `semantic-facet-applicability.json`, `semantic-composite-applicability.json`, `derived-system-inventory.json` |
| 긍정·팩폭·전체 읽기 | `positive-materials-review.md`, `fact-bomb-materials-review.md`, `materials-review.md` |
| 입력·미상 | `inputContextResearch.json`, `input-context-coverage.json`, `unknown-input-policy.md` |
| 중복·정보·일관성 | `meaning-diversity-audit.json`, `shared-source-meaning-pairs.json`, `chapter-overlap-audit.json`, `chapter-coherence-review.md`, `reuseResearch.json` |
| 보류·반려 | `unverified-research.json`, `rejectedResearch.json` |
| 내부 구획·후속 요구 | `legacy-section-reference-matrix.json`, `binding-handoff.md`, `generator-limitations.md` |
| 실행·보존 | `existing-files-preservation.json`, `preservation-results.json`, `validation-results.json`, `logs/` |

실제 타입이 있는 정적 자료는 `src/lib/report-knowledge/comprehensive-product-research/`에 있으며, 관련 신규 테스트는 `tests/unit/report-knowledge/comprehensiveProductResearch.test.ts` 하나다. runtime import·lookup·barrel·실행 함수는 없다. 기존 파일 수정은 0이다.

원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`로 유지했다. 기존 21개 worktree와 `.gitignore`·`AGENTS.md`·`supabase/.temp/`의 11개 변경 파일을 보존했다. 새 worktree 포함 총 22개다.

이 연구 자료·신규 테스트·검증 문서만 신규 브랜치에 commit/push하며 최종 SHA·원격 일치는 완료 응답에 기록한다. master·Production은 변경하지 않는다. 후속 근거 연결·전문 상품 DB·표현 DB·생성기 작업은 시작하지 않았다.
