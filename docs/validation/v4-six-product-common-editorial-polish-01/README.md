# V4 Six Product Common Editorial Polish 01

**공통 편집 개선·계산/저장본 보존 PASS / 판매 원고 품질 PARTIAL / DEPLOY_READY: NO.**

실제 원고에서 확인한 원인만 수정했다. 모든 고객 간 반복이 해소됐다는 판정은 하지 않는다. 기존 테스트 30건 실패, TypeScript 390건, Page export build 실패는 별도 기술 부채다. master 병합·push, Production 배포·운영 DB 접근·실결제는 실행하지 않았다.

## 기준과 격리

- 기준: `v4/six-product-integration-01`, `a46eff86e305f5a58721bdd83a2249686e54be4c`. 시작 시 원격 SHA 일치 확인.
- 작업: `v4/six-product-common-editorial-polish-01`, `/private/tmp/gyeol-six-product-common-editorial-polish-01` 독립 worktree.
- 원본 checkout의 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 9개, 기존 9개 worktree의 HEAD/status와 모든 tracked/untracked 파일 SHA256을 전후 비교했다. 모두 동일. 무시되는 캐시는 비교에서 제외했다. [보존 결과](workspace-preservation.json)
- reset/restore/stash/clean 사용 없음. 계산·MBTI 원천 DB·Fusion 계산·발행/결제/공유/인증/스키마/설정·각 상품의 선택 알고리즘 파일 수정 없음.

## 실제 원인과 수정 범위

같은 증상이라도 발생 위치가 달랐다. 모든 상품에 공통 문장 치환기를 추가하지 않았다.

|파일|확인한 원인|이번 변경|
|---|---|---|
|`comprehensiveReleaseRenderer.ts`|앞에서 설명한 오행/기둥의 정의가 Fusion 또는 긍정 적용 문단에 다시 삽입됨|기존 후보 배정·중복 검사 완료 후, 실제 동일 sourceType/sourceKey를 이미 설명한 경우에만 정의 문장 제거. MBTI 문장과 생활 적용은 유지하고 최소 3문장 유지|
|`careerReleaseRenderer.ts`|`terms`가 이미 설명한 근거에도 챕터명+task 도입 문장을 재생성. 마지막 전략에서 앞선 경고·실천을 재요청|기존 설명 여부를 사용해 도입 생략. 첫 정의 간결화. CH09는 기존 facet의 권한·평가 결과·시간 조건을 면담 질문으로 적용. 직업 확인 문구의 생성 과정 설명을 줄임|
|`loveReleaseRenderer.ts`|CH06.P2에서 CH01의 핵심 근거 정의를 다시 설명|같은 근거·강점을 상대가 어떻게 받아들일지라는 과사용 질문에 연결. 원인·갈등 확대·회복 문장은 유지|
|`compatibilityReleaseRenderer.ts`|A→B/B→A 마무리 두 문장이 이름만 바꾼 동일 조언|B→A는 도움 뒤 독립적으로 이어갈 몫과 제안에서 선택/보류한 범위를 설명. 방향별 원국·십성·MBTI·관계별 경계는 유지|
|`majorInteractionReading.ts`|관계 참여 요소와 뜻을 콜론으로 나열. 합과 긴장이 함께 있을 때 같은 check를 다시 확인하는 조언|참여 요소에 ‘세운/지지’ 표시, 관계명에 실제 조사 연결. 긴장의 조정 과제는 유지하고 합의 조언은 협업/합의의 범위와 한계로 구분|
|`annualInteractionReading.ts`|`practice.action`의 구체 과제 뒤 같은 `practice.check`를 다시 요구. 같은 관계 제약을 여러 달에 반복|월별 과제·주의점은 유지. 관계 제약은 과제를 평가할 다른 관점으로 연결하고 기존 `used` 상태로 관계 종류별 최초 1회만 안내|
|`bookProjection.ts`|비종합 상품 공통 부록이 모든 십이운성에 동일한 일반 설명을 사용|기존 `COMPREHENSIVE_STAGE_MEANINGS` 재사용. 실제 계산/표시된 항목의 meaning만 보강|
|`runtimeProjection.ts`, `runtimeShadow.ts`|투영 함수만 바꾸면 과거 저장본의 부록도 바뀔 수 있음|새 packet에 선택적인 `bookEditorialRevision: common-editorial-01` 저장. 기존 digest로 함께 봉인. 표식 없는 기존 packet은 기존 설명 유지|

새 엔진·DB 구조·무작위/해시 기반 문구 선택은 없다. 편집판 표식은 저장본 표시를 구분하는 메타데이터이며 계산·공개 gate를 바꾸지 않는다. 종합의 정의 정리는 선택 완료 뒤 실행하므로 문구 길이가 기존 후보 선택을 바꾸지 않는다.

테스트 변경은 새 발행본의 의도한 copy/digest 기대값과 과거 저장본의 기대값을 구분하는 데 한정했다. 기존 `six-product-integration-01/source-locks.json`, 과거 완료 Book fixture, 기존 major safety/interaction lock은 변경하지 않았다. 새 `edition-locks.json`의 불변 해시는 **변경 전** 데이터에서 만들었으며, 새 prose 해시와 별도로 계산·자료·방향·문단별 근거 집합을 검증한다. 기존 30개 실패의 기대값은 재설정하지 않았다.

## 생성 및 직접 독해

Production 유료 Worker의 `src/lib/book/paidRuntime.ts`가 호출하는 **동일한 `generateV4ShadowReport`**를 오프라인에서 실행했다. 명리 계산 → 기존 MBTI 자료 → Fusion/후보 선택 → 각 상품 생성 → `projectBook` → `createProductPreviewSnapshot` → `storedBook` owner/shared 재열람을 사용했다. 네트워크 guard 적용, 외부 AI 호출/결제/운영 저장 없음.

- 동일 입력/clock 64개 전후 생성: 62개 정상, 기존 대운 S-time/S-both 2개는 동일한 `DAYUN_UNCERTAIN` 거절.
- 모든 상품 정상 A/B/C 및 시간 미상 D, MBTI 미상 E, 둘 다 미상 F 포함. 궁합 연애·결혼·부모자녀·동료·상사팀원·사업파트너·친구 7유형 포함.
- 주 기준 시각 `2026-10-12T12:00:00+09:00`. 이전 교차 상품 lock의 기존 시각도 그대로 유지.
- 대표 6권 전체를 처음부터 끝까지 직접 읽고 변경된 문장을 전후 대조했다. 이 독해는 운영자의 최종 판매 승인과 별개다.
- [전체 비교](comparison.json), [반복/개인 간 지표](metrics.json), [대표 문단과 원본 근거](examples-with-proofs.json).

본문 길이는 Book narrative 문단 text의 공백 포함 글자 수 합이다. 표지·목차·제목·만세력·MBTI표·부록과 문단 사이 구분자는 제외한다.

|상품 / 대표|구조|변경 전 → 후|변경 문단 / 전체|전체 전후 원고|
|---|---|---:|---:|---|
|종합 / 김하린 A|13장·52문단|10,200 → 10,049|3 / 52|[전](manuscripts/comprehensive-before.txt) · [후](manuscripts/comprehensive-after.txt)|
|커리어 / 박도윤 A|9장·36문단|9,555 → 9,359|13 / 36|[전](manuscripts/career-before.txt) · [후](manuscripts/career-after.txt)|
|연애 / 최서아 A|9장·36문단|8,329 → 8,336|1 / 36|[전](manuscripts/love-before.txt) · [후](manuscripts/love-after.txt)|
|궁합 / 이준혁·정유진 A|9장·36문단|9,788 → 9,803|2 / 36|[전](manuscripts/compatibility-before.txt) · [후](manuscripts/compatibility-after.txt)|
|대운 / 윤시우 S|2023–2036 14년, Book 본문 108문단|14,967 → 15,375|24 / 108|[전](manuscripts/major-before.txt) · [후](manuscripts/major-after.txt)|
|세운 / 한예린 H|12개월, Book 본문 83문단|10,509 → 10,266|11 / 83|[전](manuscripts/annual-before.txt) · [후](manuscripts/annual-after.txt)|

길이 증감은 품질 점수가 아니다. 기존 생활 장면/긍정 해석·주의점은 아래 의미 검수로 확인했다. 각 txt는 요약 없는 전체 narrative이며 표/부록까지의 전체 Book은 불변 snapshot fixture와 실제 투영 테스트로 확인했다.

## 의미 반복과 개인별 차이

|상품|직접 확인한 개선|유지한 정상 원고 / 남은 한계|
|---|---|---|
|종합|CH03.P1/P3와 CH07.P2의 중복 정의 3문장 제거. 배움의 검증 방법, 회복의 필요, 다른 사람 참여를 돕는 장면이 바로 이어짐|나머지 49문단 동일. CH02의 수 기운 설명과 ‘작은 계획·기록·대화’ 같은 넓은 조언은 남음|
|커리어|이미 소개한 근거의 도입 문장을 생략하고 과제·환경·생활 장면을 남김. 마지막 경고의 재진술을 실제 권한/시간/평가 질문으로 전환|직업별 개발 과제/학업/금전 적용 유지. 전체를 관통하는 권한/범위 확인 패턴은 여전히 많음|
|연애|신금 정의 재설명 대신 같은 세심함이 관심/평가로 다르게 받아들여질 수 있음을 설명|나머지 35문단 동일. 관계 참여/경계/대화 조언의 큰 주제는 반복됨|
|궁합|B→A 마무리 2개를 독립성/피드백이라는 다른 판단으로 변경|나머지 34문단 동일. 양방향 십성 정의의 공통 부분은 근거가 같으면 유지. 7유형 장면/자녀·권력 경계 유지|
|대운|합·긴장 공존 시 합의 범위를 긴장 조정과 구분. 예: S2029 육합의 협업이 별도의 卯酉 충까지 덮는 합의는 아니라는 조건|원국/대운/세운 구분, 각 연도 과제와 10년 뒤 비교는 유지. 연도 도입의 ‘살펴볼 만해요’ 문체와 기술 용어의 양은 여전히 많음|
|세운|H의 관계 제약 11회 → 종류별 6회. 월별 실제 행동은 모두 남김. 기존 generic ‘되풀이/기존 일정/연결 가능성’ 조언 8회 → 0회|각 달의 관계 자체와 질문/과제/피할 행동은 유지. 관계 종류별 공통 설명은 고객 간 공유될 수 있음|

대표 6권의 공백/문장부호를 제외한 **완전 동일 문장 중복은 전후 모두 0**이다. 원래 문제가 같은 의미의 재사용이므로 0이라는 수치로 품질 PASS를 부여하지 않았다.

A/B/C 모두에 나타나는 동일 문장 개수(정의·제약 안내 포함): 종합 20→20, 커리어 20→20, 연애 21→21, 궁합 49→49, 대운 35→34, 세운 63→65. 세운 +2는 고객별 check를 반복하던 문장 대신 관계 공통 제약을 최초 1회 설명한 영향이다. 이 수치에는 타당한 공통 정의도 포함되며 개인화 점수로 해석하지 않는다. **고객 간 차별화 개선은 PARTIAL**, 기존 개인화가 보존된 것은 PASS다. 표현만 무작위로 바꿔 차이를 만들지 않았다.

예를 들어 같은 겁재인 세운 A3/B7/C1은 각각 처음 맡을 일을 나누는 대화 / 동료 공동 업무 / 다른 전문가와 작업 범위를 나누는 협업이며, 형 / 반합 / 형의 실제 근거와 서로 다른 주의점을 유지한다. 커리어 개발자의 테스트/유지보수 사례, 연애 솔로의 호감 단계, 궁합 두 사람의 다른 받는 조건, 대운 전환 전후 관심의 차이도 유지했다.

## 십이운성 부록

새 뜻을 창작하지 않고 기존 종합 Book의 개별 설명과 `foundationTwelveStages.ts`의 검토된 단계별 의미를 확인하여 재사용했다. 성장·정점·회복·저장·준비의 비유이며 길흉/질병/죽음/수명을 확정하지 않는다.

|단계|기존 검토 자료의 뜻|
|---|---|
|장생|새로 자라나며 배우고 시작하는 단계|
|목욕|새 모습에 적응하고 감각·표현과 주변 반응을 의식하는 단계|
|관대|갖춘 모습을 보이며 나서고 역할을 맡는 단계|
|건록|제 몫을 해낼 기반, 스스로 생활을 꾸리고 책임지는 단계|
|제왕|힘이 왕성하고 주도권·자신감·자기 뜻이 커지는 단계|
|쇠|왕성한 힘을 거두며 경험으로 무리하지 않고 고르는 단계|
|병|밖보다 안의 상태를 돌아보는 비유. 질병을 뜻하지 않음|
|사|멈추고 집중·숙고하는 비유. 죽음을 뜻하지 않음|
|묘|기운·경험·생각을 안에 저장하는 단계|
|절|이전 흐름과 거리를 두고 새 출발을 기다리는 단계|
|태|새 기운과 가능성이 막 생기는 준비 단계|
|양|안정된 바탕에서 배우고 보살피며 힘을 키우는 단계|

64입력의 실제 계산 결과 합집합에서 **12단계 모두** 관찰됐다. [사례/인물/기둥별 목록](stage-coverage.json). 각 Book에는 그 인물에게 계산된 단계만 표시한다. 인위적으로 12항목을 채우지 않는다. 예: 종합 A의 시주에는 실제 `절`만 계산되며 해당 단계의 설명을 사용한다.

새 편집판에서 stage item의 `meaning` 외에 이름·group·core·소유자·순서·연결·각주와 다른 십성/신살 설명을 변경하지 않는 테스트가 있다. 기존 종합 전용 부록은 원래 개별 뜻이 있었고 그대로다. 예전 저장본은 표식이 없으므로 기존 일반 설명까지 그대로 유지한다. 표식을 봉인 없이 변경하면 `V4_SNAPSHOT_INTEGRITY`로 거절한다.

## 계산·근거·Book 보존

- 전후 64입력에서 계산, natal table, MBTI 표, 선택 자료, 실제 근거 ID 집합, 궁합 persons/directions/index/점수, 기간/전환/절기 evidence 동일. 첫 4상품은 문단별 명리·MBTI·Fusion ID 집합도 동일.
- 신규 62권 JSON 저장/복원 후 owner/shared Book 동일. 각 입력 반복 생성 결과 동일. 두 정책 거절도 동일.
- 변경 전 62권 snapshot 모두 새 코드로 owner/shared 재열람하여 기존 Book과 같고 snapshot digest 불변 확인. 여기에 과거 상품 개선 이전 대운 8권/세운 10권 **18권**도 재열람 PASS. [결과](legacy-books.json)
- 여섯 대표 이전 전체 snapshot/Book을 `tests/fixtures/common-editorial-01/previous-books.json.gz`에 불변 fixture로 보관. 반복 테스트에서 이전 본문/부록/각주까지 비교한다.
- 대운 S 전환 `2031-11-30 15:10:00 KST`, C `2028-04-23 21:42:00 KST` 보존. 시간 미상은 범위를 특정 시각으로 바꾸지 않았다. 신규 관계 계산/ID 생성 없음.
- 세운 12개월·절입·선택 연도, 대운 14년, 궁합 양방향/7유형, 첫 4상품 챕터/문단 수 및 모든 Book page kind/id 순서 동일.
- 본문/새 packet digest 변경은 허용된 편집 결과다. 과거 snapshot digest는 재작성하지 않는다.

## 검증과 기존 부채

기준 SHA를 `git archive`한 별도 baseline에 같은 의존성·타입 생성 조건·환경·테스트 목록을 적용해 다시 실행했다. 아래 528개 테스트를 동일하게 비교하고 새 회귀 25개는 별도로 보고한다. 로컬 DB 기반 기존 테스트는 유지했으며 Production DB/서비스에는 접근하지 않았다.

|검증 묶음|기준 PASS / FAIL|변경 후 PASS / FAIL|
|---|---:|---:|
|access|36 / 1|36 / 1|
|career|36 / 0|36 / 0|
|compatibility|54 / 2|54 / 2|
|comprehensive|31 / 0|31 / 0|
|love|75 / 2|75 / 2|
|major|72 / 0|72 / 0|
|parity|64 / 0|64 / 0|
|protected|10 / 21|10 / 21|
|shared|120 / 4|120 / 4|
|합계|**498 / 30**|**498 / 30**|

실패 테스트 이름 집합과 첫 오류 메시지 모두 동일하다. [528개 전체 결과 및 원인 비교](test-comparison.json). 신규 실패 0, 기존 실패 제외 없음.

기존 30건의 원인: love/compatibility의 과거 major·annual 교차 hash 4건, Annual preflight 403/400 기대 불일치 1건, Book front/end anchor 기대 불일치 3건, annual purchase policy gate/JSON 오류 21건, 90일 재열람 테스트의 공유 접근성 문구 기대 불일치 1건. 수정하거나 숨기지 않았다.

추가 검증: `commonEditorial.test.ts` **25/25 PASS**(12단계 설명, 실제 계산 inventory, 과거 6권의 편집판/각주/봉인, 실제 6상품 편집 회귀). 이전 대운·세운 저장본 **18/18 PASS**. 전후 실제 64입력 오프라인 생성·결정론성·재열람 **64/64 PASS**이며 이 중 2건은 기존 정책의 동일 거절을 검증한다. 신규 25개를 포함하면 같은 기본 범위 + 추가 테스트는 **523 PASS / 기존 30 FAIL**이다. 오프라인 capture/과거 18권 검증은 별도로 집계했다.

동일 테스트 목록/실행 조건: `vitest run <해당 파일들> --fileParallelism=false --hookTimeout=120000 --reporter=json`. 9묶음, 동시에 최대 2개 프로세스. 새 product edition의 의도한 copy 기대값만 갱신했으며 소스/계산·기존 실패 기대값을 바꾸지 않았다.

TypeScript는 `tsc --noEmit --pretty false`의 **위치·코드·메시지 전체**를 비교했다. 기준 390 → 변경 후 390, 신규/제거 위치·코드 0. 388건은 메시지까지 동일하다. `commonFinal.test.tsx:69`와 `reportQualityFixtureMatrix.test.ts:166`의 2건은 동일 union 구성원의 출력 순서만 다르며, 새 타입/오류는 없다. 이 두 메시지 전후도 비교 파일에 그대로 남겼다. [비교](typescript-comparison.json), [전](logs/ts-before.log) · [후](logs/ts-after.log).

lint PASS. 전체 `npm run build -- --webpack`는 compile 성공 후 `src/app/report/new/page.tsx`의 기존 Page export type 오류로 FAIL. 기준 출력은 `getAsiaSeoulCurrentYear`, 변경 후 출력은 `getAnnualFortuneYearOptions`가 허용되지 않는 export라고 지적한다. 두 export 모두 기존 파일에 있고 이 파일은 기준과 byte-identical이며 전체 TypeScript 진단도 동일하다. 같은 파일/오류 유형이지만 출력된 export 이름이 동일하다고 주장하지 않는다. 이후 단계가 실행되지 않아 NFT 경고가 없다고 확정하지 않는다. [전](logs/build-before.log) · [후](logs/build-after.log). 비활성 플래그: `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0`.

`git diff --check` PASS. 기존 빌드/타입/테스트 부채는 수정하지 않았다.

## 남은 판매 품질과 판정

- **MAJOR / PARTIAL:** 고객 간 실제 근거·질문·생활 장면은 다르지만 정의·관계 공통 조언과 넓은 확인/대화 패턴이 여전히 많다. 특히 세운 고객 간 공통 문장 수는 감소하지 않았다. 전 상품 개인화/의미 반복의 최종 해소로 보고하지 않는다.
- **MINOR / PARTIAL:** 종합의 ‘ENFJ의 학습 방식 자료를 이 상황에 적용하면’, 대운의 반복적인 ‘원국의 …부터 살펴볼까요/살펴볼 만해요’, 참여 지지를 많이 열거하는 문장은 고객 문체로 더 다듬을 여지가 있다. 이번 직접 독해에서 확인했다.
- **기술 출시 차단:** 기존 Page export build FAIL, TypeScript 390건, 동일 30개 회귀 부채. 범위 밖이므로 그대로 보고한다.
- 내부 ID/DB선택/undefined/NaN/객체 문자열 노출은 실제 62개 본문의 지정 패턴 검사 0건. 이것이 모든 한국어 오류나 모든 메타 문구가 없다는 보증은 아니다.
- 새 편집 문장의 강점·주의점·장면 연결과 조사 조합을 직접 확인했다. 관측한 신규 허위 사건 단정이나 잘못된 관계/방향 변경 없음. 자동 검사만으로 판매 품질을 PASS 처리하지 않는다.

**RELEASE_QUALITY: PARTIAL. DEPLOY_READY: NO.** 이번 편집 개선과 보존 검증을 완료한 작업 브랜치만 commit/push한다. 다른 작업·기술 부채 해결·Production 배포를 시작하지 않는다.

## 실제 문장 전후와 근거

아래는 실제 생성 원고의 발췌다. 생략 없는 본문은 위 여섯 전후 txt, 전체 문단·문장별 명리/MBTI/Fusion provenance는 [examples-with-proofs.json](examples-with-proofs.json)에 있다.

### 종합 CH03.P1

변경 전:

> 배운 것을 말이나 결과물로 꺼내 볼 때 이해의 빈틈을 찾기 쉬울 수 있습니다. 화 기운의 ‘생각이나 감정을 밖으로 보여주는 기운’이라는 뜻이 이 해석의 명리 쪽 출발점입니다. ENFJ의 학습 방식 자료를 이 상황에 적용하면, 아이디어와 결과를 다른 사람이 이해할 수 있게 전달하는 역할에서 강점을 발견할 수 있습니다. 새 개념을 짧은 설명이나 간단한 작업으로 만들어 보면, 아는 것 같은 느낌과 실제로 설명할 수 있는 지식을 구분할 수 있습니다.

변경 후:

> 배운 것을 말이나 결과물로 꺼내 볼 때 이해의 빈틈을 찾기 쉬울 수 있습니다. ENFJ의 학습 방식 자료를 이 상황에 적용하면, 아이디어와 결과를 다른 사람이 이해할 수 있게 전달하는 역할에서 강점을 발견할 수 있습니다. 새 개념을 짧은 설명이나 간단한 작업으로 만들어 보면, 아는 것 같은 느낌과 실제로 설명할 수 있는 지식을 구분할 수 있습니다.

실제 source refs: `foundation:element:FIRE:BALANCED`. MBTI: `mbti:ENFJ:traits:study:answer_leader_child:plainKo`. Fusion: `fusion:REINFORCE:ENERGY_DIRECTION:learning:ENERGY_DIRECTION:1:ENERGY_DIRECTION:1`. 전체 연결은 JSON에 보관했다.


### 커리어 CH09.P2

변경 전:

> 선택 앞에서도 중요도가 다른 오류를 모두 같은 무게로 검토하는 습관을 경계해야 하며, 앞서 읽은 약점은 큰 결정에서도 반복될 수 있습니다. 빠진 조건을 찾아내는 정확성이 필요한 일일수록 같은 방식에만 기대기 쉬우므로, 결과와 지금의 부담을 함께 돌아보아야 합니다. 요청이 늘고 시간이 줄어들면 평소의 방법을 자동으로 반복하기 쉬우니, 합의한 범위가 바뀌었는지부터 살펴야 합니다. 앞선 위험에 대응해 ‘핵심 오류와 표현의 흠을 나누어 검토하기’를 실행한 뒤 결과와 부담의 변화를 대조하면, 조정할 부분이 구체적으로 보입니다.

변경 후:

> 앞서 읽은 약점을 새 역할의 선택 기준으로 옮겨보면, 자료를 확인하고 중요한 오류를 고칠 권한이 실제로 주어지는지 물어볼 수 있습니다. 빠진 조건을 찾아내는 정확성이 필요한 일일수록 같은 방식에만 기대기 쉬우므로, 결과와 지금의 부담을 함께 돌아보아야 합니다. 면담에서는 다시 고칠 일의 감소를 평가하는 방법과, 그 일을 위해 쓸 수 있는 시간을 함께 물어보세요. 잘할 수 있다는 이유만으로 그 역할을 골라야 하는 것은 아니며, 필요한 권한과 시간을 얻기 어려운 조건도 선택에 포함할 만합니다.

실제 source refs: `foundation:element:METAL:BALANCED`. 전체 연결은 JSON에 보관했다.


### 연애 CH06.P2

변경 전:

> 일주 일간 신금은 ‘작은 차이와 완성도를 세밀하게 보는 성질’의 뜻으로 읽는 근거이며, 이 힘 자체가 나쁜 것은 아닙니다. 문제는 세심함을 평가보다 관심으로 받는 관계를 원하는 마음이 강해질 때, 상대도 같은 방법을 원한다는 전제를 먼저 둘 수 있다는 점입니다. 차이를 잘 보는 힘이 피곤한 날에도 틀린 점부터 향하면, 상대가 시도한 이유나 이미 잘한 부분을 듣는 순서가 줄어들 수 있습니다.

변경 후:

> 일주 일간 신금에서 읽은 작은 차이를 알아보는 세심함은 장점이지만, 언제 어떻게 쓰는지에 따라 상대가 받는 느낌은 달라질 수 있습니다. 문제는 세심함을 평가보다 관심으로 받는 관계를 원하는 마음이 강해질 때, 상대도 같은 방법을 원한다는 전제를 먼저 둘 수 있다는 점입니다. 차이를 잘 보는 힘이 피곤한 날에도 틀린 점부터 향하면, 상대가 시도한 이유나 이미 잘한 부분을 듣는 순서가 줄어들 수 있습니다.

실제 source refs: `natal:day:stem:辛`. 전체 연결은 JSON에 보관했다.


### 궁합 B→A CH06.P2

변경 전:

> 이준혁님이 어떤 도움이 실제로 필요했는지 알려주면, 정유진님도 수고를 더 늘리기보다 필요한 곳에 힘을 쓸 수 있습니다.

변경 후:

> 정유진님이 보탠 뒤 이준혁님이 혼자 이어갈 부분까지 정하면, 다음에도 같은 도움을 기다려야 하는 부담을 줄일 수 있습니다.

실제 source refs: `b425792e04d53877ee951f97:to:29a2534854378270a988c1f8`, `natal:day:stem:乙`, `natal:day:stem:甲`. 전체 연결은 JSON에 보관했다.


### 대운 S 2029-gift

변경 전:

> 2029년 대운 丙辰의 지지 辰, 己酉(편관) 세운의 酉 사이에는 辰·酉 육합: 함께하기 쉬운 접점입니다. 일을 풀어가는 방식에는 원국의 겁재가 드러납니다. 동료의 좋은 결과가 자극이 되어 내 방식도 빠르게 바꿔봐요. ‘먼저 처리할 요구와 도움을 청할 기준’을 함께 맡을 범위와 종료 조건에 맞춰보세요.

변경 후:

> 2029년, 대운 丙辰의 지지 辰 및 세운 己酉(편관)의 지지 酉 사이에서 읽는 辰·酉 육합은 함께하기 쉬운 접점입니다. 일을 풀어가는 방식에는 원국의 겁재가 드러납니다. 동료의 좋은 결과가 자극이 되어 내 방식도 빠르게 바꿔봐요. 호흡이 맞아도 ‘먼저 처리할 요구와 도움을 청할 기준’을 정할 때는 함께 나타난 긴장을 덮으면서까지 약속을 넓히지는 않아도 됩니다.

실제 source refs: `SajuCalcResult:tenGods.distribution:劫財`, `calendar:saju-calendar-kst-v2`, `careerContextV3:function:project_creation`, `dayun:dayun-kst-sect2-v1`, `input:detailJob`, `major:4:丙辰:year:2029:己酉:cycle:육합:辰酉:cycle`. 별도 긴장의 실제 근거는 `major:4:丙辰:year:2029:己酉:natal:충:卯酉:hour`이다. 전체 연결은 JSON에 보관했다.


### 세운 H month-10-action

변경 전:

> 이번 달 한 가지 · 발표나 실습에서 배운 것을 보여줄 작은 결과 하나를 완성해보세요. 기존 일정과 겹친다면 ‘완성할 범위와 마무리 순서’를 먼저 조정해보세요. 피할 것 · 아이디어를 더 보태느라 보여줄 결과를 끝내지 못하는 것.

변경 후:

> 이번 달 한 가지 · 발표나 실습에서 배운 것을 보여줄 작은 결과 하나를 완성해보세요. 피할 것 · 아이디어를 더 보태느라 보여줄 결과를 끝내지 못하는 것.

실제 source refs: `annual-month-jie-kst-v2`, `calendarMonths:10:2026-10-08T15:29:17+09:00`, `careerContextV3:function:unknown`, `input:detailJob`, `input:jobStatus`. 전체 연결은 JSON에 보관했다.
