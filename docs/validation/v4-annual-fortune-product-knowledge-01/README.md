# V4-ANNUAL-FORTUNE-PRODUCT-KNOWLEDGE-01

세운 상품의 독립 오프라인 연구 DB를 구축했다. 기존 생성기·계산·후보 선택·원고·Book은 변경하지 않았다. 신규 연구의 존재는 현재 고객 원고의 개선이나 판매 품질 승인을 의미하지 않는다.

- 기준: `v4/major-fortune-product-knowledge-01` / `efe32658f8c0b0defa07601e64b49d6329665634`
- 작업: `v4/annual-fortune-product-knowledge-01` / `/private/tmp/gyeol-annual-fortune-product-knowledge-01`
- 식별자: `annual_fortune` / `annual-fortune` / `annualFortune`
- 평가: **2026-10-12 12:00 KST**. 현재 실행일과 구분한다.
- 원본 checkout: `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`; 원격 기준 branch/SHA 확인 후 독립 worktree 생성.
- 원본 미커밋 11파일(`.gitignore`, `AGENTS.md`, `supabase/.temp/` 9파일), 기존 33 worktree 보존. 이 작업용 worktree를 포함하면 34개다.

## 산출물과 수량의 의미

신규 정형 레코드는 **1,792개**다. 이 수를 새로운 검증 명리 사실이나 독립 예측 수로 해석하면 안 된다.

| 구분 | 수 | 파일/역할 |
|---|---:|---|
| 세운 핵심 의미 | 13 | `annualCoreResearch.ts`: 천간·지지·십성·오행·원국·장기 배경·유지·변화·연간 질문·긍정·과용·반전·월 연결 |
| 세운 십성 | 10 | `annualTenGodResearch.ts`: 연간 선택의 조건 |
| 월운 십성 | 10 | `monthlyTenGodResearch.ts`: 짧은 구간의 구체 행동·과용·반례; 연간 설명 복제 방지 |
| 월운 오행 | 5 | `monthlyElementResearch.ts`: 전통 상징과 현대 질문 구분 |
| 12개월 질문 | 12 | `monthMatrix.ts`: 달 이름을 사건·성공의 근거로 사용하지 않음 |
| 절입·교운·시간 | 10 | `timeBoundaryResearch.ts`: 정확/범위/첫 대운 전/가까운 경계/복수 구간 |
| 상호작용 scope | 8 | `interactionResearch.ts`: 5개 단일·3개 미지원 복합 |
| 관계별 활용 | 7 | `relationPracticeResearch.ts`: 관계 의미와 적용 조건·금지 구분 |
| 생활 영역 | 8 | `domainResearch.ts`: 자기·직업·돈·학습·사회·친밀·가족생활·새 선택 |
| 정보 다양성 | 9 | `informationResearch.ts`: 정의·행동·장면·근거 root·시간·domain 중복 감사 |
| 연간/월간 연결 | 3 | `yearMonthConnectionResearch.ts`: 유지·비교·새 적용 구분 |
| 실제 관찰 기반 조건 연구 | 14 | `observedApplicationResearch.ts`: 실제 segment/locator/hash와 반례 |
| 기간 연구 참조 | 410 | `temporalCrosswalk.ts`: 원래 상태별 보류 조건 보존 |
| 대운 연구 인수 | 863 | `majorResearchHandoff.ts`: 장기 배경과 전환의 참조; 14년 구조를 세운에 전용하지 않음 |
| 의미 축/Facet | 36 / 109 | 기존 Annual applicability와 부모 조건·자체 조건 구분 |
| Fusion 참조 | 164 | `fusionCrosswalk.ts`: 실제 annual_fortune 적용 가능성/원천 상태 보존; 새 Fusion 규칙 없음 |
| MBTI 유형 참조 | 16 | 16유형 × 32 원천 locator = 512 원천 항목. 512개 새 연구로 더하지 않음 |
| 실제 월 관찰 view | 36 | A/B/C 각 12월; 원천 관찰이지 새 의미가 아님 |
| 출처 / Binding 단계 / 반려 | 23 / 12 / 14 | 출처 상태, 미래 계약, 금지·보류 |

합계는 **조건부 편집 연구 109 + 참조 view 1,634 + 출처/계약/반려 49 = 1,792**다. 모든 레코드가 `connectedToRuntime=false`, `approvedForCustomer=false`, `existingScoreContribution=false`, `runtimeEvidenceIds=[]`다. 신규 계산 Evidence·점수·가중치는 0개다.

기존 18개 연구군 **16,426개 레코드**의 전체 목록·locator·원래 상태·record hash는 [inherited-research-inventory.json](inherited-research-inventory.json), 영역별 수는 [inherited-research-summary.json](inherited-research-summary.json)에 있다. `foundation-handoff-audit.json`의 2,991개는 이 inventory와 겹치는 원천 감사이며 신규/기존 합계에 다시 더하지 않았다. 원래 ID·별칭·검증 상태를 수정하지 않았다.

## 실행 경로 감사

[execution-source-inventory.json](execution-source-inventory.json)에 필수 16파일과 실제 경로 39파일의 file hash/export/위치를 기록했다. [product-contract.json](product-contract.json)과 [producer-support-matrix.json](producer-support-matrix.json)을 함께 읽는다.

| 단계 | 실제 계약과 관찰 |
|---|---|
| 입력/연도 | `annualEvidence.ts` → 기존 normalize 및 `annualFortuneYearRules.ts`. 현재 KST 연도 포함 최근 6년. 2026 평가의 판매 허용은 2021–2026이며 2028은 `SELECTED_YEAR_INVALID`. |
| 오프라인 실행 | `generateV4ShadowReport` → 실제 V4 adapter/composer → 기존 publication validator → `projectBook`. 기존 검증용 policyDate만 사용해 미래 사례 관찰. 외부 호출 `[]`. |
| 원천 사실 | 기존 명리·MBTI·Fusion을 사용. `annualFortuneEvidence`의 nominal annualGanji와 segment effectiveAnnualPillar 구분. 원국 십성은 세운 십성이 아님. |
| 월 계산 | `annualMonthJie.ts`의 `annual-month-jie-kst-v2`. 12개 양력월을 실제 절입·교운 경계로 나눔. 구간은 `[startKst,endKstExclusive)`, 수는 가변. |
| 월 확장 | `annualMonthExtendedEvidence.ts`: natal anchor + 실제 month target. 원국 신살을 transit로 승격하지 않음. 허용 규칙/미지원/모호한 코드 구분. |
| 월 원고 | `annualMonthNarrative.ts`: 실제 월간 또는 실제 월지 본기 십성, 반복 variant, 적합한 accepted transit, 제한된 개인 원천, 기존 brief/current/standard 계획. |
| 관계 문장 | `annualInteractionReading.ts`: focus의 확정된 실제 actor/source 검증. 대표 관계 및 다른 성격의 보조 관계 중심이며 전체 ledger가 모두 본문에 쓰이는 것은 아님. |
| 상품 통합 | `annualProductAdapter.ts`의 `annual-product-13d-7c-v1`, `timeProductContext.ts`의 개인 조건·기간 관련성 투영. 이것이 새로운 시간적 인과관계는 아님. |
| 발행/재열람 | `annualMonthlyPublication.ts` 등 기존 저장 계약 검증. 저장된 Dayun/선택 연도/순서 재검증; 과거 unversioned snapshot은 원래 계약 유지. DB 접근·기존 고객 Book 재생성 없음. |

선택된 개인 재료, 사용되지 않은 유효 후보, 실제 표시된 proof, 연구에만 있는 자료, producer 미지원, 시간 조건 부족은 별도 층이다. `candidate-display-audit.json` 및 `monthly-information-matrix.json`이 실제 관찰을 담는다. 후보 목록의 rule ID와 본문 proof의 생성된 Fusion ID는 namespace가 다를 수 있어 단순 문자열 교집합으로 사용률을 계산하지 않았다. availableFusion 목록 하나가 모든 proof의 원천 우주라는 가정도 하지 않았다.

## 시간·scope의 정확한 구분

- selectedYear 기준 `annualGanji`는 연간 표의 명목 간지다. 입춘 이전 segment는 전년도 `effectiveAnnualPillar`를 사용한다. 연도 단위 `annualStemRelations`를 1월·입춘 전 구간으로 자동 연장하면 안 된다.
- natal dayMaster 기준 annualGod/cycle.god와 **cycle stem 기준 flowGod**는 참조자가 다르다.
- focus는 평가 순간이 해당 월에 있으면 그 순간 segment, 그렇지 않으면 첫 Jie 시작 segment, 없으면 첫 segment다. focus는 월 전체의 단일 사실이 아니다.
- 불확실 교운 `[earliest,latest)`의 두 cycle은 조건부 후보다. latest부터 새 cycle이 활성화된다. 첫 대운 전에는 활성 cycle이 없고 관련 Dayun fact를 만들지 않는다.
- `natal_saeun`, `natal_wolun`, `dayun_saeun`, `dayun_wolun`, `saeun_wolun`의 참가자·원국 자리·기간을 분리한다. pair table은 육합/반합/충/형/파/해를 지원한다. 실제 세 지지로 확인된 월운×원국 삼합과 2개 참가자의 pair를 구분한다.
- `natal_dayun_saeun`, `natal_saeun_wolun`, `natal_dayun_saeun_wolun`에 전용 복합 성립·강도·해소·사건 판정 producer는 없다. 나란히 비교할 단일 사실이 있어도 복합 Evidence로 발급하지 않는다.
- natal-only/모호한 transit, 미지원 방합·문곡·복성·천의, 불분명한 망신 계열은 해당 기존 gate에 따라 보류한다. 천을·도화 등 허용 자료도 `calendarMonths:` canonical provenance와 월운 target 검증이 필요하다.

### 실제 경계 사례

| 사례 | 실제 결과 |
|---|---|
| 2026 입춘 | **2/4 05:02:08 KST**. 직전 乙巳/己丑 → 정각부터 丙午/庚寅. T−1초/T/T+1초와 6월 일반 Jie 검증. |
| 미래 C의 2028년 4월 | 4/1 乙卯·壬申 → 4/4 15:03:06 丙辰·壬申 → **4/23 21:42** 丙辰·辛未. 절입 뒤 교운 전에는 申辰 반합, 교운 뒤에는 해당 Dayun pair 검출 없음. 양쪽 모두 같은 관계가 있다고 주장하지 않음. |
| 정확 교운 | 2026/12/30 **15:30 KST**, cycle 2 → 3. 12월 3segment; T부터 새 cycle. |
| 불확실 교운 | 2027/4/8 00:00부터 8/8 **21:59:59 KST** 미확정. 8/8 입추 02:26:46와 종료 경계는 19시간33분13초 떨어진 서로 다른 경계; 8월 3segment. |
| 첫 대운 전 | 저수준 2000 달력 모든 segment `before_first_cycle`; Dayun pair fact 0. 실제 상품 생성은 cycle 없는 선택 연도를 거절할 수 있어 이 검사를 Book 생성 성공으로 표현하지 않음. |
| 관계가 빈 focus | B 2026년 8월 입추 뒤 丙申의 지지 관계는 비어 있음. 다른 segment/오행 자료까지 모두 없다는 뜻이 아님. H 11월은 지지 관계가 없어도 별도 천을 transit 존재. |
| 실제 삼합 | H 2026년 8월 월운 申 + 원국 子·辰 세 참가자. H 4월 월지 子 반합과 연지 辰 형, 10월 午 반합과 辰 충은 원국 자리·상대가 다름. |

관찰 JSON에 실제 Evidence ID와 전체 ledger를 그대로 남겼다. 연구 ID `afpr:*`는 계산 ID로 변환되지 않는다.

## 12개월 연구와 실제 원고 감사

[human-review.md](human-review.md)에 A/B/C **36개월 본문 전체** 독해 결과와 실제 문장을 기록했다. [actual-abc-narratives.md](actual-abc-narratives.md)는 생성 원문을 교정·요약하지 않고 보관한다.

| 원천 관찰 | 책/연도 | 월 문단 | 월 본문 글자 수 | segment |
|---|---|---:|---:|---:|
| A 도윤 / INFJ | 2026 | 55 | 7,980 | 24 |
| B 서진 / ENTJ | 2026 | 56 | 7,892 | 24 |
| C 서윤 / ENFP | 2026 | 56 | 7,911 | 24 |

글자 수는 월별 실제 block.text를 개행으로 결합한 길이를 합산했다. 표지·목차·만세력·기본 정보표·월 사이 구분 문자는 제외했다. 길이만으로 품질 PASS를 부여하지 않았다.

전체 관찰은 11권×12월=132행이다. 신규 12개월 질문은 특정 달의 운세를 고정하지 않는다. 1월은 명목 연도와 실효 연주, 2월은 입춘, 3월은 유지되는 연주와 월주 변화, 4월은 참가자/root, 5월은 월간/본기, 6월은 반복 십성 비교, 7월은 유지와 실제 변경, 8월은 범위 교운이 실제 존재할 때의 조건, 9월은 월초 carryover, 10월은 읽는 순간과 focus, 11월은 미래 생활 상태, 12월은 양력 연말과 명리 흐름을 구분한다. 예를 들어 8월이라는 이유로 누구에게나 교운이 있다고 하지 않는다.

- [monthly-information-matrix.json](monthly-information-matrix.json): 실제 132월의 focus·선택/미선택/보류·문단·원문·source refs.
- [monthly-diversity-matrix.json](monthly-diversity-matrix.json): 132행을 12개 전문 질문, Primary/Secondary, Positive/Risk/Twist, 가상 장면/반례, 실제 이전/다음 focus signature와 대조. 다음 연도 ledger가 없으면 연결 근거 없음으로 남김.
- [meaning-repetition-audit.json](meaning-repetition-audit.json): 실제 공통 귀인 문단 1그룹, 반복 십성, 의미 반복 유형.
- [information-duplication-audit.json](information-duplication-audit.json): 신규 109연구의 meaning/positive/risk/twist/action 동일 필드 문자열 중복 0. 의미 독립성의 증명으로 사용하지 않음. 참조 1,634개도 독립 새 의미로 세지 않음.

같은 십성의 재등장을 반드시 새로운 사실로 세거나 무조건 쓸모없는 반복으로 처리하지 않았다. 다른 행동·범위·반례가 실제 추가되는지 사람이 읽고 비교했다. 신규 월간 십성은 단순 연간 표현 재사용 대신 짧은 마감·공동 작업·산출물 검토·수정 제안·제안 비용·정산·긴급 책임·절차·정보 선별·도움 요청의 다른 조건으로 정리했다. 커리어·연애 DB 문구에 기간만 붙이지 않았다.

## 출처·검증 상태

`sourceInventory.ts`의 23source와 모든 crosswalk locator/hash는 실제 확인한 저장소 원천과 상태를 보존한다. 기존 전통 지식·현재 편집 자료·이번 조건부 응용을 구분했다. 외부 접근 자료는 다음 세 전사 페이지의 제한된 원칙만 확인했다.

- [三命通會 卷二 論大運](https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷02): 원국과 행운을 함께 살피는 조건론.
- [滴天髓 歲運論](https://zh.wikisource.org/wiki/滴天髓/09): 대운·세운 구분 및 충·합을 조건별로 논하는 부분.
- [子平真詮 論行運](https://donglishuzhai.net/chapter/3738.html): 원국과 행운 간지의 역할 구분.

상태는 `historical_transcription_read_not_empirical`다. 고전 원본 스캔 교감·전사/주석 계보 확정·전체 출처 검증·예측 성능 실증은 수행하지 않았다. 현대 생활 장면과 행동은 `conditional_editorial_not_calculated_fact`; 고전의 직접 주장으로 표시하지 않았다. 서로 다른 희기·격국 해석을 새 계산으로 추가하지 않았다. 원문 대량 복제 없음.

MBTI 16유형의 기존 direct/inferred·domain·sourceRefs·applicationGate를 보존한다. MBTI는 개인의 조건부 반응 자료이며 특정 연월 사건의 원인이 아니다. 미상 시 근거 0; Pair 자료는 단일 인물의 양방향 관계 Evidence가 아니다. 36축·109facet은 의미 관련성, Fusion 164참조는 기존 상품 조건이며 새 월운 계산이 아니다.

## 후속 Binding 계약과 보류

`bindingDesign.ts`의 12단계는 원국 → 연도 정책 → 실효 연주 → 활성 대운 → Jie ledger → 월운 → 관계 → 출처 검증 → 연구 후보 → 정보 배정 → 한국어 원고 → Book이다. 각 단계에 입력/출력, 원천·버전, owner, 기간, 확정성, ancestry, 반례, 실패·중복·승인·금지 조건을 명시했다. `FutureBinding`은 실제 Evidence ID를 research ID와 타입으로 구분하고 원국 위치/참조 천간/상대/기간/cycle/source ancestry를 요구한다. **계약만 있고 구현·연결은 없다.**

14반려 자료에 확정 예언, 충=실패/합=성공, 가짜 경험, unknown hour, nominal 연주 자동 전용, 두 참가자 삼합, 미지원 복합, MBTI 시기 인과, 현재 직업의 과거/미래 강제 등을 기록했다. E/F/G 등 기존 보류·반려 상태를 상향 승인하지 않았다.

남은 범위는 복합 producer, 희기·강도/해소 판정, 미지원 transit, 모든 segment의 원고 사용, 전체 출처 교감, 실제 Evidence Binding·선택·배정·한국어 표현 DB·원고 연결이다. 이 작업에서 시작하지 않는다.

## 검증 결과

[test-commands.md](test-commands.md), [validation-results.json](validation-results.json), [existing-failures.json](existing-failures.json)에 명령과 실패 이름·첫 오류를 기록했다.

| 검사 | 결과 |
|---|---|
| 신규 2파일 | **3,591 PASS / 0 FAIL** |
| 기존 회귀 9파일 | 변경 전후 **228 PASS / 33 FAIL**, 이름·첫 오류 동일 |
| 인수/trace 8파일 | 변경 전후 **7,245 PASS / 6 FAIL**, 이름·첫 오류 동일 |
| Annual 7파일 | 변경 전후 **185 PASS / 6 FAIL**, 이름·첫 오류 동일 |
| 전체 관련 26파일 | **11,249 PASS / 기존 45 FAIL / 신규 0**. 전체 프로젝트 suite가 아님 |
| 기존 39실패 | 기존27 + Vercel 역사적file-hash lock6 + 대운 frozen hash6 재현 |
| 추가 baseline6 | `annualSafety.test.ts`가 과거 Major 원고 해시를 고정한 6건. 정확한 기준 SHA에서도 재현. 테스트 수정/삭제/skip 없음 |
| TypeScript | 기준 0 → 최종 0; `--incremental false` |
| lint / 기본 Production build / diff-check | PASS / PASS / PASS. 로컬 build 경고 0 |
| 실제 Annual | 성공11권·정책거절1, 132월, 계산/Evidence/draft/narrative/Book **55/55 digest 동일**; 전체 관찰·경계도 동일 |
| 6상품 | 기존 통합 frozen64검사에서 계산·원고·근거·Book·저장본 재열람 계약 보존 |
| 기존 파일 | 기준 추적 **3,649파일 byte hash 동일**, 기존 연구 18군 전체 보존 |
| 기존 worktree | **33개 HEAD/branch/status/파일 hash 동일**, 원본 dirty11 보존 |
| Vercel trace | 88 app NFT; raw 연구/검증문서 추적0. 대상 dev/account/api 430경로, 31,731,151bytes; 최대54,618,281bytes. 로컬 path bytes이며 원격 압축 함수 용량과 동일 측정은 아님 |

`trace-preservation.json`에 기록한 `localDatabase.ts`의 기존 수정 hash도 동일하다. build 옵션 변경/새 exclude/대형 함수 우회 없음. DB·결제·외부 유료 API·기존 고객 Book 읽기/쓰기 0. UI·인증·Worker·공유·기존 발행 코드는 byte 단위로 보존했다. 실제 운영 로그인/결제/기존 고객 Book 접근을 실행했다고 주장하지 않는다.

## Git 및 Preview

신규 연구 폴더, 신규 테스트 2파일, 이 검증 문서만 commit/push한다. master·Production·운영 DB·환경변수 변경 없음. 자동 Preview는 정확한 pushed SHA의 branch/target/READY를 확인해 아래에 기록한다. 구현 SHA의 receipt를 문서에 보관한 뒤 문서 마감 commit을 올릴 경우 최종 SHA READY도 별도로 확인한다. 실행 순서 때문에 최종 자기 SHA를 그 commit 내부에 삽입하지 않는다.

Preview 결과: **push 후 확인 예정**. 최종 결과는 아래 receipt 및 최종 보고를 기준으로 한다.

이번 DB는 후속 연구 검토용이며 customer approval·출시 승인이 아니다. 다음 작업은 시작하지 않는다.
