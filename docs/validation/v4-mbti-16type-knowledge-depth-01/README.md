# V4-MBTI-16TYPE-KNOWLEDGE-DEPTH-01

기준 `022ef437f34c04d36671120b19b5f5c3e494d5f6`에서 독립 worktree로 MBTI 16유형·256영역을 조사하고 **512개 조건부 생활 적용 후보**를 추가했다. 런타임·원천 JSON·의미 축·Fusion·6상품 생성기에는 연결하지 않았다.

이는 512개의 실증적 유형 사실이나 유형별 독점 특성을 새로 입증했다는 뜻이 아니다. 공유되는 실천은 **64개 검토 관점**으로 묶었다. 조건·관찰 대상·상황이 다른 적용 기록으로 보존하며, 점수나 독립 근거 수로 합산하면 안 된다. 외부 검증이 남은 범위는 아래에 명시한다.

## 산출물과 전수 조사

- [16유형 inventory](type-inventory.json): 파일 크기·글자 수·digest·영역별 수·원천 작성 상태.
- [1,213 trait 감사](existing-traits-audit.json): 모든 trait ID, JSON pointer, 원천 의미, coverage, 사용 목적, 실제 adapter 분류, 정확한 문자열 중복.
- [25,750 primitive leaf inventory](all-source-leaves.json): 모든 JSON 말단 경로·해시·원천 coverage·기존 의미 분류. 실제 `inventoryMbtiSource → annotateMbtiSource → validateMbtiAnnotations` 결과와 전수 대조했다.
- [256영역 개별 coverage](domain-coverage.json): 각 영역의 기존 수·출처 상태·원천 누락 메모·두 개의 개별 보강 주제·반례·유사 유형 비교.
- [512개 후보 읽기](materials-review.md), [64개 공통 관점](semantic-families.json), [중복 검사](duplication-audit.json).
- [96상품 활용 영역](report-use-cases-audit.json), [256방향 관계](pair-inventory.json), [기존 enrichment](enrichment-audit.json), [70개 누락 사유 대조](enrichment-reconciliation.json).
- [기존 민감 주장 후보 113건](existing-claim-screen.json), [출처 확인 상태](source-verification.json), [coverage manifest](coverage-manifest.json).
- [ID 감사](id-audit.json): 기존 ISTP의 `technical_problem_income`은 career/money에 각각 존재한다. 원천 ID는 바꾸지 않고 유형·영역·JSON pointer를 포함해 구분한다. 신규 연구 ID 512개는 모두 유일하다.
- 실제 신규 정적 자료: `src/lib/report-knowledge/mbti-foundation-research/mbtiResearch{TYPE}.ts` 16개, `mbtiResearchTypes.ts`, `mbtiResearchSources.ts`. 테스트 전용 import 외에 runtime import 없음.

원천 총 **1,748,049 Unicode 문자(BOM 포함)**, trait **1,213**, source 직접 설명 분류 **938**, 기존 추론 **275**. 실제 adapter 말단 분류는 scoring **1,070**, reference **18,671**, metadata **6,009**다. `direct`/`DIRECT`는 기존 자료 범위 및 annotation의 출처 표지이며 실증적 정확성 등급이 아니다.

| 유형 | 기존 trait | direct | inferred | 검토 영역 | 새 후보 |
| --- | ---: | ---: | ---: | ---: | ---: |
| INTJ | 81 | 65 | 16 | 16 | 32 |
| INTP | 81 | 68 | 13 | 16 | 32 |
| ENTJ | 78 | 63 | 15 | 16 | 32 |
| ENTP | 78 | 59 | 19 | 16 | 32 |
| INFJ | 81 | 66 | 15 | 16 | 32 |
| INFP | 81 | 68 | 13 | 16 | 32 |
| ENFJ | 69 | 52 | 17 | 16 | 32 |
| ENFP | 70 | 50 | 20 | 16 | 32 |
| ISTJ | 65 | 48 | 17 | 16 | 32 |
| ISFJ | 76 | 60 | 16 | 16 | 32 |
| ESTJ | 79 | 62 | 17 | 16 | 32 |
| ESFJ | 79 | 61 | 18 | 16 | 32 |
| ISTP | 67 | 51 | 16 | 16 | 32 |
| ISFP | 76 | 56 | 20 | 16 | 32 |
| ESTP | 75 | 54 | 21 | 16 | 32 |
| ESFP | 77 | 55 | 22 | 16 | 32 |

기존 항목이 적은 ISTJ·ISTP·ENFJ도 같은 16영역을 검토하고 각각 32개 후보를 작성했다. 개수 균등만으로 충분성을 판정하지 않고 각 영역에서 서로 다른 질문·조건·행동·가상 장면을 확인했다. 대표 원천 설명은 직접 읽고, 전체 원천 항목의 경로·분류·보존은 자동 대조했다. **1,213개 설명의 사실성을 모두 외부 자료로 검증했다는 주장은 하지 않는다.**

## 조사한 사용 경로와 변경 경계

`sourceRuntimeAdapter.ts`는 기존 16파일을 읽고 product→trait 영역을 선택한다. `mbtiKnowledgeBase.ts`는 trait의 plainKo/positiveUse/risk 등을 기존 지식 타입으로 투영한다. `mbtiTypeKnowledgeBase.ts`는 context별 trait seed와 기존 Bridge 별칭을 만든다.

`mbtiSourceAdapter.ts`는 모든 말단을 inventory하며 plainKo만 명시적 검토 대상으로 남긴다. `mbtiSemanticAnnotations.ts`와 NT/NF/SJ/SP manifest는 기존 의미 축·가중치·맥락을 부여한다. strongLine/positiveUse/risk와 관계·직업·상품 활용 문구는 별도 reference이므로 동일 의미를 독립 점수로 더하지 않는다. 기존 `matchingMyeongliSignals`는 원국 사실의 증거가 아니다.

이 경로와 모든 기존 코드 **977개 파일의 SHA256을 보존**했다. 신규 자료는 static literal과 type-only import이며 lookup·barrel·함수·DB를 추가하지 않았다. Production build의 server/static JS에서 신규 자료 sentinel도 발견되지 않았다.

## 실제 보강 내용과 독해 평가

각 레코드에는 안정 ID, 유형·영역, 실제 기존 trait ID/pointer/coverage/hash, 조건부 핵심 관점, 긍정·과용 위험, 행동, 환경, 반전, 비교 유형의 원천 참조, 가상 예시, 반례, 적용 게이트, 출처·검증 상태가 있다. 조건부 후보 512개와 가상 장면 512개는 원천 직접 설명과 분리했다. 모두 `approvedForCustomer=false`, `connectedToRuntime=false`다.

- **성격·사고**: INTJ `mkr:INTJ:thinkingStyle:01`은 구조 설명 밖 사례를 남겨 적용 범위를 확인한다. INTP `mkr:INTP:thinkingStyle:02`는 반론이 바꾸는 전제를 특정한다. 독립 사고라는 공통점을 인정하면서 방향 선택과 모델 수정의 관찰 질문을 나눈다.
- **직업·조직**: ENTJ `mkr:ENTJ:career:02`는 확장 전 기존 운영의 반복 가능성을 검토한다. ESTJ `mkr:ESTJ:career:02`는 건수 외 재작업·유지 부담을 본다. 직함이나 특정 직업을 성공 조건으로 쓰지 않는다.
- **돈**: INFP `mkr:INFP:money:01`은 유료 도움의 대가와 무료 범위를 나눈다. ISFJ `mkr:ISFJ:money:01`은 장보기·선물 등 작은 반복 돌봄 비용을 함께 본다. 수입 예측을 대신해 실제 비용·계약 맥락을 확인한다.
- **투자**: INTJ `mkr:INTJ:investment:01`은 반유행 태도도 검토한다. ISFP `mkr:ISFP:investment:01`은 브랜드 취향과 실제 조건을 분리한다. 모든 장면은 기록·모의 검토이며 투자 종목·금액·수익이나 감내 능력을 권고하지 않는다.
- **학업**: ISTP `mkr:ISTP:study:01`은 실습 뒤 작동 이유를 설명한다. ENFJ `mkr:ENFJ:study:01`은 스터디 설명 뒤 혼자 재현한다. 배움의 형식을 구분하고 지능·성적·합격을 예측하지 않는다.
- **연애·결혼**: ENFP `mkr:ENFP:love:01`은 따뜻한 반응과 교제 의사를 구분한다. ISTJ `mkr:ISTJ:marriage:01`은 처음 합의한 역할도 현재 부담에 맞게 다시 묻는다. 연애·혼인 상태와 상대 반응을 만들지 않는다.
- **양육·자녀**: ENTJ `mkr:ENTJ:parenting:02`는 어른의 목표와 아이 바람을 나눈다. ESFJ `mkr:ESFJ:child:02`는 주변 분위기와 아이 자신의 감정을 구분한다. 실제 돌봄/관찰이 있을 때만 적용하며 성인 입력에서 자녀 성격·존재·어린 시절을 역추론하지 않는다.
- **관계·소통**: INFJ `mkr:INFJ:relationships:02`는 안전감을 위해 상대를 조절하기 전에 사실을 질문한다. ESTP `mkr:ESTP:communication:01`은 유머의 상대 동의를 확인한다. 타인의 마음을 감지한 확정 사실로 쓰지 않는다.
- **강점·위험·성장**: ENTP `mkr:ENTP:risks:02`는 문제의 옳음과 개입 시점을 나눈다. ESFP `mkr:ESFP:growth:02`는 즐거운 모임 뒤 남은 연락과 정리를 확인한다. 강점의 과용 조건과 실제 다음 행동을 연결했다.

문체는 연구용 명사구·행동 후보다. 고객용 완성 원고를 새로 만들거나 교정하지 않았다. 긍정·위험은 가능한 관찰 방향이며 실천 효과를 보장하지 않는다. 유사 유형 비교도 구분 검사나 궁합 추천이 아니다.

## 중복·유형 고정관념 검토

원천 plainKo의 정규화된 완전 일치 중복 0, 새 행동 문구 완전 일치 0. 같은 영역에서 편집거리 유사도 0.75 이상인 행동 후보 3쌍을 발견해 실제 조건과 예시를 읽었다. INFJ/INFP의 우회 표현→명시 요청, INFP/ESFP의 원하는 행동 덧붙이기, ENFP/ESFP의 표현 속도 조율이다. **공통 실천의 맥락 변형으로 보존하며 독립적인 유형 지식으로 세지 않는다.**

문자열 검사는 의미 중복의 증명이 아니다. 64개 공유 실천 관점별 수동 분류와 256개 비교를 함께 제공한다. 유형 간 겹침을 지우기 위해 가짜 차이를 만들지 않았다. 새로운 자료는 원천 단서가 실제 본인에게 맞을 때만 검토하며 환경·경험이 더 적절한 설명이면 적용하지 않는다.

## 출처와 미확인 범위

기존 16파일은 sourceStatus에서 사용자 제공 자료를 정리·재작성했다고 밝힌다. 최초 원문·저자·개별 인용의 확인 자료는 없다. 이를 임의 보충하지 않았다. 275 inferred는 그대로이며 신규 direct 승격 0이다.

실제로 열어 확인한 외부 자료는 Myers & Briggs Foundation의 [윤리 기준](https://www.myersbriggs.org/using-type-as-a-professional/mbti-code-of-ethics/home.htm), [결과 이해](https://www.myersbriggs.org/my-mbti-personality-type/my-mbti-results/home.htm), [직업과 유형](https://www.myersbriggs.org/type-in-my-life/personality-type-and-careers/)이다. 확인 범위는 선호를 능력·성공 판정으로 쓰지 않기, 자가보고와 개인 환경 고려, 유형만으로 직업을 제한하지 않기다. 이 지침은 512개 적용 후보의 실증 근거가 아니다. 외부 문장을 대량 복제하지 않았다.

기존 113개 민감·과장 문자열 후보는 원문과 경로를 보존하고 새 승인 자료로 복제하지 않았다. 스크리닝에는 금지 문구를 부정하는 문장도 포함될 수 있어 113개를 확정 결함 수로 부르지 않는다. 질환·지능·성적·투자 수익·범죄·결혼/출산 결과·우월성·실제 과거 경험은 신규 핵심 설명으로 채택하지 않았다.

## 상품 활용·관계 자료·누락 사유

96개 활용 영역은 원천 특징을 가져올 수 있는 경로와 기존 상품 편집 지침을 구분해 기록했다. 대운·세운에서 MBTI는 **계산된 시기에 대응할 행동 참고**이며 시기 계산·사건 예측 근거가 아니다. 6상품 전문 DB나 챕터·문단을 만들지 않았다.

관계 256방향은 source direct 158/inferred 98. 양방향 reportLine이 다른 216방향, 동일 40방향, 이름 없이 시작하는 공통형 reportLine 72방향, 양쪽 label이 다른 148방향(74개 무순서 조합)을 기록했다. 500자 미만 stringified 설명은 0개지만 길이로 출처 깊이나 타당성을 판정하지 않는다.

예: INTJ→INTP는 Friendly, INTP→INTJ는 Quasi-Identical; INTJ→ENTP는 Interesting/Alpha-Opposite, 역방향은 Extinguishment다. 이는 동일한 계보가 확인된 관계 분류라고 볼 수 없으며, 명칭 차이만으로 실제 해석 충돌도 확정하지 않는다. 원문·방향·coverage·hash를 보존하고 후속 페어 연구에서 정의·계보·조건을 따로 확인해야 한다. 개인 성향이나 점수로 합산하지 않았다.

70개 missingAreas 사유는 조건부 개인 자료 보강/원출처 미확인 34개, 페어 심화 보류 24개, 민감 해석 재구축 제외 12개로 대조했다. 투자·돈·결혼 장면을 실제로 보강했지만 원출처가 없는 direct 부족을 해결했다고 표시하지 않았다.

## 검증

| 실행 | 실제 결과 |
| --- | --- |
| 기준 SHA 알려진 실패 재현 | 36 PASS / 3 기존 FAIL |
| 신규 연구 + 기존 명리 레지스트리 + 기준 실패 재검사 | 869 PASS / 3 동일한 기존 FAIL; 신규 54/54 PASS |
| 기존 MBTI adapter·의미 축·지식·라우팅·원천 등록 | 187/187 PASS |
| 6상품 실제 digest·구조·snapshot·owner/shared replay | PASS (64/64) |
| 최종 관련 테스트 합계 | 1,120 PASS / 3 기존 FAIL; 기준 재현 실행은 중복 합산하지 않음 |
| TypeScript | 0 → 0 (`--noEmit --incremental false`) |
| lint | PASS |
| Production build | PASS; 47/47 정적 페이지; NFT 경고 0 |
| source bytes | 기존 src 977 + 원천 JSON16 동일 |
| 기존 worktree | 17개 branch/HEAD/status/파일 hash 동일 |
| diff-check | PASS (`git diff --cached --check`); 신규 파일 46개만 stage |

6상품 suite는 성공 생성 62개와 기존 DAYUN_UNCERTAIN 거부 2개를 포함한 64사례다. 성공 사례는 계산·편집 invariant·원고·근거·Book·snapshot digest를 기존 lock과 비교하고 owner/shared 저장본을 재생 없이 읽었다. 이전 Book 6개도 snapshot hash와 재열람을 확인한다. 운영 DB·결제·외부 원고 API를 호출하지 않은 오프라인 테스트이며 실제 Production 열람 검증이라고 주장하지 않는다.

기존 실패는 `foundationAdapter.test.ts:116`의 careerReleaseMaterials 참조 격리 기대 1건과 `customerDayunGeneration.test.ts:50`의 JSON 파싱 2건이다. 기준 SHA에서 동일하게 재현했다. 기존 보고서의 원인 분석과 현재 메시지를 확인했고 이 작업에서 결제·인증 테스트나 구현을 변경하지 않았다.

[실행 로그](research-preservation-tests.log), [기준 실패](baseline-tests.log), [MBTI](mbti-existing-tests.log), [6상품](six-product-tests.log), [빌드](build.log), [lint](lint.log), [TS 전](tsc-before.log), [TS 후](tsc-after.log). 저장한 로그는 git whitespace 검사를 위해 줄 끝 공백/마지막 빈 줄만 정리했다. 원본 실행 로그는 `/tmp/gyeol-mbti-depth-validation/`에 있다.

## 후속 인수와 종료 경계

[페어 연구 인수 문서](pair-research-handoff.md)를 제공하되 해당 작업을 시작하지 않았다. 새로운 후보를 runtime에 연결하는 작업, 의미 축·점수·Fusion·표현 재료·상품별 전문 DB는 별도 범위다. 현재 후보는 고객 승인 0이며 기존 발행물은 불변이다.

원출처 미확인, 실증 검증 없는 조건부 적용, 관계 분류의 계보·양방향 명칭 차이, 기존 민감 문구 검토, 기존 실패 3건이 남는다. **원천 조사·조건부 보강 coverage와 기술 보존은 확인했지만 실증 검증 완료·판매 승인·배포 준비 완료를 선언하지 않는다.**

브랜치 `v4/mbti-16type-knowledge-depth-01`; commit/remote SHA는 최종 응답에 기록한다. master·Production·운영 DB는 변경하지 않는다.

## 요청 항목별 최종 상태

```text
MBTI_FOUNDATION_STATUS: 전수 조사와 조건부 연구 coverage 구축 완료; 실증 검증 완료 상태 아님
TYPES_REVIEWED: 16/16
EXISTING_TRAITS: 1,213/1,213 보존·경로/분류 대조
NEW_DISTINCT_MATERIALS: 512개 맥락별 적용 후보; 공유 실천 관점 64개로 중복 구분; 신규 실증 사실 0개
TOTAL_DOMAIN_CELLS: 256/256
DOMAIN_COVERAGE: 모든 칸에 서로 다른 초점·행동·예시 2개와 조건·반례·비교 자료
SOURCE_DIRECT: 기존 trait 938개 유지; direct 승격 0개
INFERRED: 기존 trait 275개 유지; 실증 자료로 재분류하지 않음
CONDITIONAL_MATERIALS: 512개; 가상 상황 512개 별도 구분
UNVERIFIED_MATERIALS: 신규 적용 후보 전체 실증 미검증; 기존 원천 최초 저자·개별 인용 미확인
TYPE_DIFFERENTIATION: 16유형별 원천 참조와 유사 유형 비교; 공통점 인정·배타적 진단 금지
DOMAIN_INDEPENDENCE: 16영역의 개별 적용 조건과 행동 구분; 공유 실천은 독립 사실로 중복 계산하지 않음
CAREER_DEPTH: career/workplace 64개; 업무 범위·협업·피드백·책임 조건
MONEY_INVESTMENT_DEPTH: 64개; 비용·계약·판단 기록; 수익·감내 능력 추론 금지
STUDY_DEPTH: 32개; 이해·재현·학습 환경; 지능·성적·합격 추론 금지
LOVE_MARRIAGE_DEPTH: 64개; 표현·합의·갈등·공동생활; 관계 상태 추론 금지
PARENTING_CHILD_DEPTH: 64개; 실제 돌봄/관찰 게이트; 자녀 존재·성인 과거 역추론 금지
RELATIONSHIP_DEPTH: 개인 relationships 32개; 페어 심화 미실행
COMMUNICATION_DEPTH: 32개; 동의·질문·경계·요청 조건
STRENGTH_RISK_GROWTH: 96개; 과용 조건·반례·구체적 행동
REPORT_USE_CASES: 96/96 감사; 원천 특징과 상품 활용 지침 분리
PAIR_DATA_PRESERVATION: 256/256 보존; direct 158/inferred 98; 별도 인수 문서
DUPLICATION_AUDIT: 완전 일치 행동 중복 0; 유사 3쌍은 공통 실천의 맥락 변형으로 구분
SOURCE_VERIFICATION: 원천 16개와 실제 접근한 공식 지침 3개; 지침을 적용 후보의 실증 근거로 쓰지 않음
CALCULATION_PRESERVATION: 기존 소스 977개 바이트 동일; 6상품 기존 계산·근거 digest 검증
NARRATIVE_PRESERVATION: 원고 digest 불변; runtime 연결 0
BOOK_PRESERVATION: 64개 통합 사례의 Book/snapshot·owner/shared 재열람 계약 PASS; 오프라인 검증
TESTS: 1,120 PASS / 3 동일한 기존 FAIL; 신규 연구 54/54 PASS; 신규 실패 0
TYPESCRIPT: 0 → 0
LINT_BUILD: lint PASS; Production build PASS; 47/47 정적 페이지; NFT 경고 0; diff-check는 아래 검증 표 참조
BRANCH: v4/mbti-16type-knowledge-depth-01
COMMIT_SHA: 최종 응답 및 Git 이력 참조
REMOTE_SHA_MATCH: push 후 최종 응답에서 실제 SHA 대조 결과 기록
REMAINING_GAPS: 원출처/실증 미확인·관계 분류 계보 및 양방향 명칭·기존 민감 문구·기존 테스트 실패 3건
NEXT_STAGE_READY: 후속 연구 인수 자료 준비; 고객 사용·runtime 연결·판매·배포 승인 아님; 후속 작업 미시작
```
