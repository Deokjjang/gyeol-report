# V4-KOREAN-EDITORIAL-KNOWLEDGE-01

한국어 편집 언어 연구 DB를 독립적으로 구축했다. 기존 계산·전문 연구·한국어 생성기·문장 결합·후보 선택·Book을 변경하지 않았다. 연구 예시는 고객 문장 사용 승인이나 실제 원고 개선 완료를 뜻하지 않는다.

## 기준과 보호

- 기준 branch/SHA: `v4/annual-fortune-product-knowledge-01` / `39a08dcc43c467f0dba71da820d0e879dff91ec1`; 원격 일치 확인.
- 작업 branch/worktree: `v4/korean-editorial-knowledge-01` / `/private/tmp/gyeol-korean-editorial-knowledge-01`.
- 원본 checkout: `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`, 변경하지 않음.
- 기존 worktree **34개**와 원본 dirty **11파일**(`.gitignore`, `AGENTS.md`, `supabase/.temp/` 9개)을 HEAD/branch/status/추적 및 비무시 untracked 파일 hash로 보호. 이 작업용까지 총35개.
- 원격 조회·독립 branch 생성·offline frozen 의존성 설치 후 기준 테스트를 재현했다. reset/restore/stash/clean 사용 없음.
- 실제 원고 관찰 시각은 **2026-10-12 12:00 KST**이며 실행일과 구분한다. 운영 고객 API/DB/결제/외부 AI 호출 없음.

## 기존 시스템 감사

[existing-system-inventory.json](existing-system-inventory.json)은 필수17파일과 관련 경로 **121파일·2,055개 함수/메서드/콜백 위치**를 AST로 인덱싱하고 byte/body hash·imports·line을 기록한다. 이 숫자는 2,055개의 문장 엔진 또는 전부 의미적으로 증명한 함수 수가 아니다. [existing-expression-use.json](existing-expression-use.json)에 실제 역할과 선언/사용의 차이를 정리했다.

| 영역 | 실제 구현·확인 사항 |
|---|---|
| 재료와 결합 | `copyRealizer.ts`는 whole seed 보존·proof 합치기·단순 조사·paragraph 생성. `contentSynthesis.ts`는 실제 domain/root/MBTI/Fusion 선택·limited ending 변형·기존 설명/scene 조합. |
| 어미/문법 | `koreanCopyUtils.ts`의 받침·숫자 표·일부 닫는 부호 제거·중립 fallback, 제한된 조사 슬롯 보정·spacing/join. `narrativeEndings.ts`의 닫힌 접미사 목록과 `narrativeVariant.ts`의 deterministic 표면 순서. 보편적인 형태·구문 분석기는 아님. |
| 표현 다양성 | `narrativeVariation.ts`의 실제 Fusion lens와 DOMAIN/PORTRAIT/LIFE 재료 조건. `narrativeSurface`, `narrativeComposer`, `narrativeBlockRenderer`, scene/title/meaning registry도 조사. 무작위 표현 교체가 새 정보는 아님. |
| 검증 | `editorialGuard.ts`는 exact/long phrase/scene/theme/톤/금지 문구 점검, `contentQuality.ts`는 source root·trait·어미·semantic family 진단, `narrativeValidator.ts`는 supplied phrase/role/provenance/surface/조건 검증. 정규식과 점수가 모든 의미·문법을 증명하지 않음. |
| 기존 memory | `narrativeMemory.ts`에 usedClaims/terms/roots/phrases/ending/section 기록이 이미 존재. 종합·커리어 renderer가 `freshNarrativeMemory`를 실제 import한다. 오래된 “완전 격리” 주석/테스트를 현재 사용 계약과 구분. |
| 종합·커리어·연애 | 각 release renderer의 실제 13/52·9/36·9/36 구조, 전문 facet/문맥/후보와 기존 introduced root/term bookkeeping 보존. |
| 궁합 | `compatibilityReleaseContracts.ts` 9장·36문단·144문장 역할. renderer의 SOURCE/CONDITIONAL_APPLICATION/RECALL와 subject/target/direction/provenance 확인. `compatibilityTitle.ts`의 명시적 {{A}}/{{B}} callback 치환은 이미 안전하게 구현되어 있음. MBTI/영문 A/B 전역 치환하지 않음. |
| 대운 | `majorComposer.ts`, `majorAnnualStories.ts`, `majorYearNarrative.ts`의 과거/현재/미래·14년·원국/대운 출처 분리·정확/범위 전환 설명 및 conditional scene 확인. |
| 세운 | `annualComposer.ts`, `annualStories.ts`, `annualMonthNarrative.ts`의 한 해·12양력월·대표 focus/전체 segment 구분, nominal/effective 연주·월운 transit·원국 source 구분. |
| Book | 실제 offline shadow 경로 → 실제 상품 생성 → publication 검증 → projectBook → local snapshot → storedBook 재열람. 고객 저장본 접근·재생성 없음. |

기존 **19개 연구군 18,218레코드**의 locator/record hash/원래 검증 상태는 [inherited-research-inventory.json](inherited-research-inventory.json), 영역별 수는 [inherited-research-summary.json](inherited-research-summary.json)에 있다. flat foundation 자료를 포함한 기존 추적 파일 전체 byte 보존도 별도 검증했다. 기존 전문 DB의 인수는 customer 승인이나 런타임 사용을 의미하지 않는다.

## 신규 타입 기반 레지스트리

경로: `src/lib/report-knowledge/korean-editorial-research/`. 런타임 import/barrel 연결 없음. 전부 `connectedToRuntime=false`, `approvedForCustomer=false`, `runtimeEvidenceIds=[]`, `existingScoreContribution=false`다.

| 자료 | 레코드 | 역할 |
|---|---:|---|
| functionResearch | 14 | 도입·설명·구체화·긍정·위험·팩폭·반전·비교·Fusion·장면·행동·전환·요약·마무리 |
| claimResearch | 12 | 기존 전문 자료의 실제 질문/뜻·locator/hash/state를 인수한 의미 anchor. 새 개인 해석 아님 |
| expressionMaterials | 24 | 12주장×2표현. 같은 claim/meaning/semanticUnits/조건/금지 유지; 24개 새 해석으로 세지 않음 |
| productStyles | 6 | 실제 productKey별 질문·구조·비유·장면·긍정/위험/반전·행동·연결·마무리·차이 |
| relationshipStyles | 7 | 각 유형의 A/B·공통·차이·양방향·긍정·갈등·회복·유지: **70개 서로 다른 질문** |
| sceneResearch | 19 | 일상·일·돈·학습·친밀·양육·계약·회복·장기/연월·7관계. 전부 hypothetical_only |
| grammarResearch / grammarFixtures | 28 / 46 | 조사·ㄹ·이름·숫자/단위·영문/한자/MBTI·부호·호응·시제/조건/부정/높임·어미/불규칙·방향·시간 + 예외 |
| transitionResearch | 15 | 주장→근거, 설명→장면, 강점→과용, 위험→반전, 차이→보완, 갈등→회복, 과거/현재/미래, 대운/세운/월운, A/B·방향, 새 질문·챕터·결론 |
| rhythmResearch | 12 | 길이·설명/장면·직설/완곡·용어·비유·질문·긍정/위험·어미·도입·밀도·회수·끝맺음 |
| termExplanationResearch | 15 | 원국·일간·십성·오행·신강/신약·충/합·귀인/도화·대운/세운/월운·MBTI/Fusion의 쉬운 설명 계약. 새 명리 정의 아님 |
| compatibilityRoleViews | 144 | 기존144역할과 **7유형×144=1,008 원천 locator** 대응. 자동 claim 배정이 아닌 reference view |
| invariantFixtures | 14 | 주장·owner·방향·기간·계산·확정성·부정/조건·출처·가상·새근거금지·slot·중복·분량채움금지·Book 불변식 |
| rejectedMaterials | 20 | 과장·단정·비난·허위 경험·상대 경험 확정·권한/발달·계약·시기·마무리 오류 |
| bindingDesign / sourceInventory | 9 / 7 | 후속 연결 계약과 실제 확인한 출처/접근 상태 |

총 **392레코드**는 연구116 + 표현변형24 + 역할참조144 + claim anchor/fixture/반려/계약/출처108이다. 392개 새 지식·독립 Evidence 또는 검증된 예측이 아니다. 신규 해석 사실·계산 Evidence·점수·가중치 0개.

기계 판독용 [coverage-manifest.json](coverage-manifest.json) 및 JSON export `editorial-function-inventory`, `expression-materials`, `conditional-scenes`, `product-expression-matrix`, `relationship-expression-matrix`, `korean-grammar-contract`, `paragraph-transition-research`, `rejected-expression-materials`를 제공한다. JSON은 TS 레지스트리의 보조 export이며 테스트에서 서로 일치함을 검사한다.

## 의미·표현·장면의 분리

`researchTypes.ts`는 claimIdentity / meaningIdentity / expressionIdentity / sceneIdentity / rhetorical function / requiredContext / prohibitedInference를 분리한다. 24표현은 각각 기존 연구 anchor의 조건부 질문을 전달하는 예시다. 원천이 아직 customer 승인되지 않았으면 표현의 문법이 맞아도 사용할 수 없다.

예: 커리어 anchor `ckr:material:CH01.P1:request-framing`의 “요청의 목적·완료 조건을 구분하는 착수 기능”.

- 표현1: “업무를 시작할 때는 요청의 목적과 완료 조건을 나누어 확인하는 질문을 적용할 수 있습니다.”
- 표현2: “일을 받는 상황이라면, 왜 필요한 일인지와 어디까지 끝내야 하는지를 구분해 물어볼 수 있습니다.”

같은 목적/완료 조건/업무 상황을 보존하며 문장 구조와 질문 초점만 다르다. 실제 고객이 일을 받았다는 이력·능력·보상이나 새로운 Evidence를 추가하지 않는다. 두 문장을 같은 문단에 모두 넣으면 의미 중복일 수 있다.

긍정은 특성이 유용한 조건, 위험은 과용/상황 불일치의 비용, 팩폭은 그 비용을 짧게 직설적으로 전달하는 기능, 반전은 같은 뜻의 다른 유효한 활용 관점이다. 음의 축·약한 신호를 결함/반대 성격으로 바꾸거나 MBTI만으로 행동을 단정하지 않는다. 각 기능 자료에 목적/입력/구조/적합·부적합/좋은·나쁜 예/문법/의미 보존/근거 수준/차이를 명시했다. 기능 예시는 독립 편집 예시이며 개인에 대해 승인된 실제 claim이 아니다.

## 6상품과 궁합의 전문성

실제 key는 `saju_mbti_full`, `career_money_study`, `love_marriage_child`, `saju_mbti_compatibility`, `major_fortune`, `annual_fortune`다.

종합은 여러 면의 인물상, 커리어는 과제/권한/시간/돈/학습, 연애는 표현/수신/동의/친밀, 궁합은 양쪽 소유와 방향, 대운은 장기 배경·14년·전환, 세운은 한 해·12월·실제 segment를 다르게 묻는다. 공통 문법을 공유해도 분석 관점과 장면은 통일하지 않는다.

7관계(enum `love`, `marriage`, `parentChild`, `coworker`, `managerReport`, `businessPartner`, `friendship`)는 연락과 애정 / 공동생활 약속과 조정 / 보호·발달·성인 책임 / 인계와 검토 / 권한·보고·평가 / 수요·비용·동의·종료 / 비독점 친밀감과 거리라는 다른 질문을 갖는다. 각10질문과 예시는 관계 이름만 바꾸지 않았다. 실제 관계 역할·발달 단계·권한은 별도 입력/근거로 확인해야 한다.

144 role view는 원래 roleDescription을 보존하고 7유형의 기존 연구 locator를 정확히 잇는다. CH05 A→B는 수신자 B 기준, CH06 B→A는 수신자 A 기준을 명시했다. 실제 사람 ID나 direction Evidence는 binding 전에는 발급하지 않는다. 경로 문자열까지 runtime 연결로 판단하는 기존 격리 계약을 보존하기 위해, 원천 경로/export/index/hash는 `specialized-source-catalog.json`에 두고 TS 자료는 SourcePointer(catalogKey/originalId/hash/version)만 참조한다. 기존 전문 자료의 auditRef/source-catalog 패턴을 따른다. 새로운 runtime resolver는 없고 테스트에서만 catalog를 읽어 원천 전체 hash를 검증한다. 같은 의미이면 억지로 역방향 차이를 만들지 않는다.

## 문법과 기존 한계

[existing-language-findings.json](existing-language-findings.json)에 파일·symbol·재현 입력·결과·원인·영향·후속 조건을 기록했다. 기존 함수를 고치지 않았다.

| 함수 수준 재현 | 실제 현재 출력 | 연구상 올바른 표현/후속 조건 |
|---|---|---|
| `copyRealizer.particle('길','으로','로')` | 길으로 | 길로. kind별 ㄹ 예외 필요 |
| 같은 함수 `‘제안’`+이/가 | ‘제안’가 | ‘제안’이. 인용 명사구 head/읽기 필요 |
| `normalizeKoreanSentenceSpacing` 소수점 | 버전 3. 14에서 확인합니다. | 버전 3.14에서 확인합니다. literal span 필요 |
| `narrativeSurfaces` 정보입니다 | 이 자료는 정보여요. | 이 자료는 정보예요. 명사 술어/동사 접미사 충돌 방지 |

이 네 가지는 **standalone helper 한계**다. 운영 고객 원고에서 실제 발생했다고 단정하지 않는다. 마지막 probe는 유효한 발행 Evidence를 가진 claim이 아니라 어미 함수를 직접 부르는 문법 예시다. 숫자 `3이`는 ‘삼’ 읽기에서는 맞을 수 있지만 ‘세/셋’·단위·번호 맥락이 다르므로 무조건 오류로 처리하지 않았다. 외국어는 발음 미확인 시 기본 받침 추정 대신 님 또는 조사 없는 구조를 계약으로 남겼다.

기존 `withKoreanParticle`은 알려진 한글·ㄹ·일부 닫는 부호를 처리하며, 기존 `compatibilityTitle`은 explicit token·literal callback·외국 이름+님으로 안전성을 유지한다. 이를 새 기능으로 보고하지 않는다. 후속 slot 타입은 명사구/끝소리/괄호 head/용언 lemma/검토된 surface/주체/높임/시제/부정/조건을 구분한다. 엔진 구현 없음.

문법 연구의 **요청된 항목 coverage**와 **한국어 문법 전체 완전성**은 다르다. 전자는 자료를 갖췄고, 후자의 보편 자동 판정·전체 활용 사전 교감·형태/구문 분석의 완전성은 미검증이다. 테스트를 맞추려고 올바른 짧은 자료를 늘리지 않았다. 초기 신규 테스트의 임의 최소 글자 수 조건은 실제 계약에 맞게 비어 있지 않음 검사로 수정했다. 의미/독해 평가는 별도 독해 기록으로 남겼다.

## 실제 문장과 중복 감사

[baseline-generation.json](baseline-generation.json)에 실제 생성된 17권의 전체 narrative·Book·proof·integration·digest를 보관한다. 각 책의 Book 구조·snapshot 재열람은 검증했고, 6상품/7관계·미상 입력을 포함한다. 본문 전체를 자동 비교했지만 **17권 전체 판매 독해 감사를 했다는 뜻은 아니다**.

[actual-reading-samples.md](actual-reading-samples.md)에 124선택 표본을 원문 그대로 보관하고, [human-review.md](human-review.md)에 직접 읽은 6상품/7유형의 주장·조건·행동·장면 비교를 기록했다. [actual-book-metrics.json](actual-book-metrics.json)에는 실제 해석 본문 길이와 구조가 있다. 길이는 Book narrative paragraph.text 공백 포함 합계, 표지/목차/부록/기본표는 제외.

전체 17권의 exact sentence 분석은 25자 이상 정규화 문장 677공유 그룹, 같은 책 안 exact 중복 그룹0을 관찰했다. A/F 미상 변형과 같은 가상 pair의 7관계라 cross-book 재사용은 예상되는 부분도 크다. **677개 품질 오류 또는 의미 중복0으로 해석하지 않는다.**

실제 독해에서는 종합의 원국 정의 재인용, 커리어 마지막 두 문단의 같은 권한 확인 행동, 연애의 세심함→평가 부담 설명, 궁합의 같은 개인/방향 설명과 공통 회복 골격, 세운의 가상 lead 뒤 현재형 장면 등을 구분했다. 새로운 적용/범위 정보가 있는 경우도 있어 무조건 삭제 대상으로 판단하지 않았다. 원고·guard·분량은 그대로다.

## 후속 연결 계약

[expression-binding-blueprint.md](expression-binding-blueprint.md), `bindingDesign.ts`, 타입 `ApprovedClaimEnvelope`/`IntroducedLedgerRequirement`를 제공한다.

검증된 계산 → 승인 전문 해석 → 상품 claim → 문단 배정 → 표현 기능 → 가상 장면 → typed 문장 → 연결 → Book 검수의9단계다. 각 단계에 입력/출력·owner·방향·시간·확정성·ancestry·slot·실패·introduced·중복·승인·금지 조건이 있다. 14불변식의 변경 예시를 반려 fixture로 남겼다.

기존 `NarrativeMemory`, 각 release renderer의 introduced root/term 관리와 호환 가능성을 먼저 검토하도록 적었다. 새 ledger·binding·선택·배정·문법 엔진은 구현하지 않았다. 표현 부족은 누락 기능/조건/보강 요구로 반환하는 설계이고 범용 문장으로 채우지 않는다.

## 출처 상태

- [한국어기초사전 으로](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=85784&nation=eng), [과](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=78624&nation=eng) 및 로/와 counterpart는 실제 검색 응답의 공식 entry를 읽었다. 일부 직접 fetch는 실패해 `indexed_entry_read_full_fetch_failed`로 구분했다.
- [온라인가나다 따옴표](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=307840), [여기예요/여기에요](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&qna_seq=333742)는 답변 본문을 열어 읽었다. 전자는 인용 용도, 후자는 문맥에 따른 서술/위치 표현 구분에만 사용한다.
- 어문 규범 사이트 직접 접근403. 기관명만으로 전체 규범·사전·독해 연구를 확인했다고 하지 않는다. 모든 문장 예시는 독립 작성했고 외부 원문 대량 복제 없음.
- 불규칙 활용 예시는 bounded 편집 자료다. 전체 어휘 활용·발음 사전 교감과 읽기 효과의 실증은 보류다. 전문 연구 원천의 미검증 상태를 승인으로 승격하지 않았다.

## 검증 결과

아래 최종 결과 및 실행 파일을 기준으로 한다. 전체 프로젝트 suite가 아니며 기존 실패를 수정/삭제/skip하지 않았다.

| 검사 | 최종 결과 |
|---|---|
| 신규2파일 | **669 PASS / 0 FAIL**; JSON export 검증 보강 후 static-only 651 PASS 재실행, 합계에 중복 가산하지 않음 |
| 기존 회귀9파일 | 전후 228 PASS / 33 FAIL |
| 기존 연구/trace8파일 | 전후 7,245 PASS / 6 FAIL |
| Annual7파일 | 전후 185 PASS / 6 FAIL |
| 한국어4파일 | 전후 138 PASS / 1 FAIL |
| 관련 전체30파일 | **8,465 PASS / 기존46 FAIL / 신규0**. 전체 프로젝트 suite 아님 |
| 기존 실패 | 알려진45 재현 + koreanNarrativeCore의 오래된 격리 assertion1. 이름·첫 오류 전후 동일 |
| TypeScript / lint / 기본 build / diff-check | 0→0 / PASS / PASS(로컬 경고0) / PASS |
| 실제 Book | 17권 계산/Evidence/draft/narrative/Book/snapshot **102/102 digest 동일**, 전체 관찰 동일 |
| 기존6상품 | frozen64 통합 검사에서 현재/과거 snapshot 재열람과 원고·근거·구조 보존 |
| 기존 추적 파일/연구 | **3,699파일 byte 불변 / 19군18,218레코드 ID·hash·상태 보존** |
| worktree | 기존34개/원본dirty11 보존 |
| trace | 88app NFT; raw연구/검증문서0; 대상430경로/31,731,151bytes, 최대54,618,281bytes. 로컬 path bytes이며 원격 압축 함수 용량 아님 |

[validation-results.json](validation-results.json), [existing-failures.json](existing-failures.json), [test-commands.md](test-commands.md), [generation-preservation.json](generation-preservation.json), [workspace-preservation.json](workspace-preservation.json), [trace-preservation.json](trace-preservation.json) 참조.


## Git 및 Preview

신규 연구·신규 테스트2개·이 검증 폴더만 stage/commit/push한다. Vercel trace 수정과 설정은 유지한다. 자동 Preview의 정확한 최종 SHA/branch/target/READY를 확인한다. 구현 SHA 확인 receipt를 문서 마감 commit으로 남길 경우 최종 문서 SHA READY도 별도로 확인해 최종 보고하며 자기 SHA를 그 commit 내부에 반복 기록하지 않는다.

Preview: **push 후 확인 예정**.

## 완료 범위와 남은 조건

연구 DB와 요청한 표현 기능/상품/관계/문법 항목/연결 자료는 구축했다. 원래 claim 의미·상황·주체·시기의 적용 자격을 보존하는 연구 계약이며 실제 언어 결합 구현은 아니다. 기존 함수 수준 한계와 원고의 반복은 그대로다. 보편 문법 검증·전체 출처/근거 검증·실증 독해·customer 승인·실제 binding/선택/정보 배정/생성기 변경·Production은 후속 별도 범위다.

이번 작업만 종료한다.
