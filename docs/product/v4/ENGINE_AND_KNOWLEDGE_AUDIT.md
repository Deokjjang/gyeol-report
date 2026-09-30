# 명리 엔진·해석 재료·MBTI 전수 감사

기준: `5f71a7d0ff8ac4481e09a3f90049448035eb2aed` · 2026-10-01.
범위: 현재 저장소의 **계산 → evidence → 지식 → V3 composer → 고객 view**. 외부 명리 학파의 정답 인증이나 실제 사건 예측의 검증은 아니다.

## 1. 판정 기준과 전수 목록

| 표시 | 의미 | V4 사용 |
| --- | --- | --- |
| 정확 계산 가능 | 저장소가 채택한 명시적 표/역법 규칙을 실제 계산하고 테스트함 | 해당 규칙·기준·scope 안에서 사용. 과학적 성격 진단이나 모든 학파와의 일치를 뜻하지 않음 |
| 부분 지원 | 수량 heuristic, 제한된 종류/시점, provenance 부족 또는 상충 규칙 | 확인된 사실만 사용. 미검증 격/강약/사건으로 승격 금지 |
| DB만 있음 | 이름·해석·alias·enum은 있으나 현재 승인된 producer 없음 | 자동 판정·hero 사용 금지 |
| 미구현 | 현재 canonical rule/producer 없음 | unsupported로 남김 |

**`confirmed`는 계산 입력의 확실성이지 해석 규칙의 타당성 인증이 아니다.**

| 인벤토리 | 현재 수량 | 주의 |
| --- | ---: | --- |
| taxonomy / legacy knowledge / V3 atomic | 124 / 77 / 195 ID | alias·native 중복 포함. 독립 의미 195개라는 뜻 아님 |
| reviewed atomic / 일주 | 31 / 60 | reviewed도 모든 domain 카피가 풍부하다는 뜻 아님 |
| native 신살 규칙 | 27 | 15개 일반/귀인 + 12신살. 일부 이름 중복·망신 규칙 충돌 있음 |
| MBTI / trait | 16 / 1,213 | 938 direct + 275 inferred. 자체 sourceCoverage 표기이며 임상/학술 검증 아님 |
| authored bridge / legacy fusion DB | 31 / 78 | 둘은 다른 실행 경로. DB 개수만으로 현재 Fusion coverage를 주장하지 않음 |
| compound / 십성 pair 검토 | 46 / 45 | 생활 해석 조합이지 식상생재 등 격국 계산 엔진 아님 |

[AUDIT_DATA.json](AUDIT_DATA.json)에 **모든 195 ID**의 출처·계산 공급 방식·이미지·8개 domain 문장 수·template 수·보조 hints, **모든 27 native rule의 전체 lookup table**, **16유형의 모든 trait ID·domain·pair·bridge**, 78 fusion 및 46 compound 조건을 기록했다. 해당 JSON을 실제 exports와 재비교하는 테스트가 있다. DB의 존재와 runtime 공급을 구분하기 위해 `extractor=not-listed-in-extractor`를 곧바로 “계산 미구현”으로 판정하지 않는다(일간처럼 다른 adapter에서 공급하는 경우가 있음).

아래 source 약칭: **S**=`src/lib/saju/`, **K**=`src/lib/report-knowledge/`, **I**=`src/lib/interpretation-v3/`, **G**=`src/lib/report-generation/`. 테스트 경로는 `tests/unit/` 기준.

## 2. 계산 계약

| 항목 | 판정 | 실제 source·규칙 | 테스트 / V4 경계 |
| --- | --- | --- | --- |
| 일간·일주·4주 | 정확 계산 가능 | S/`calculateSaju.ts`, `lunarJavascriptPillars.ts`, `birthTimePrecision.ts`; KST 절기 월/연주, 민간일·시주, 확정 후보 교집합 | `saju/{canonicalCalendar,lunarJavascriptPillars,dayPillar,birthTimePrecision}.test.ts`; 모르는 시주 생성 금지. 현재 SOLAR/Asia-Seoul 계약, 음력 직접 지원 아님 |
| 원국 오행 | 정확 계산 가능 | S/`analyze.ts`: 천간 + 지지 본기 visible 분포 | `saju/analyze.test.ts`; 오행 수량을 성격 점수로 표시하지 않음 |
| 지장간 가중 오행 | 정확 계산 가능 | S/`constants.ts:HIDDEN_STEMS`, `analyzeFullElements`: visible + 지장간 weight | `saju/hiddenStems.test.ts`; **계절 강약/득령 모델은 아님** |
| 십성 명칭·분포 | 정확 계산 가능 | S/`tenGods.ts`, `analyzeFullTenGods`: 일간 대비 음양/생극; 일간 자체 제외 천간 + 지장간 가중 | `saju/tenGods.test.ts`, `analyze.test.ts` |
| 십성 강약 | 부분 지원 | 수량 threshold 및 I/`comprehensiveStoryEvidence.ts`의 표면/지장간 본기/weight support | “이야기의 주목도”와 전통 강약을 분리. fractional adapter 위험은 §4 |
| 신강·신약 | 부분 지원 | S/`structureAnalysis.ts`의 비겁+인성−식상×0.6−재성×0.7−관성×0.8 | `saju/structureAnalysis.test.ts`; 월령·통근·투간·조후·합화/제화의 종합 판정 없음 |
| 재다신약 | 부분 지원, **확정 판정 미지원** | 위 score가 WEAK/VERY_WEAK이고 재성 합>=1이면 `WEAK_DAYMASTER_WITH_STRONG_WEALTH` 후보 | 수량 기반 후보를 “재다신약입니다”로 사용 금지 |
| 비겁/식상/재성/관성/인성 과다·부족 | 부분 지원 | 같은 파일의 family 합 threshold: 비겁1.8/식상1.2/재성1.2/관성1/인성1.5; 일부 무인성·무식상은 adapter에서 0 판정 | **많음·없음과 희기/강약은 다름**. 시주 모름이면 없는 것으로 확정 금지 |
| 식상생재 | DB만 있음 | K/`sajuFeatureExtractionRules.ts` alias; S/`structureAnalysisTypes.ts` OUTPUT_GENERATES_WEALTH enum, 현재 analyzer 미발행 | 식상+재성 compound는 가능하나 격 성립의 증거 아님 |
| 재생관 | DB만 있음 | 같은 alias/WEALTH_GENERATES_OFFICER enum, 현재 미발행 | 재성+관성의 생활 장면과 구조 판정을 구분 |
| 관인상생 | 미구현 | 해당 canonical 구조 producer/ID 없음 | 관성+인성 pair를 관인상생으로 자동 rename 금지 |
| 살인상생 | DB만 있음 | `structure_salin_sangsaeng` alias; RESOURCE_SUPPORTS_DAYMASTER enum을 adapter가 연결하나 analyzer 미발행 | 인성이 일간을 돕는다는 것만으로 살인상생이 성립하지 않음 |
| 상관견관 | DB만 있음 | `structure_sanggwan_gyeongwan` / output_attacks_officer supplied alias | 실제 상관·정관 배치/제화 검증 producer 없음 |
| 관살혼잡·토다금매 등 | 부분 지원 | S/`structureAnalysis.ts`, G/`comprehensiveV2GenerationHandler.ts`의 동시 존재/visible threshold 후보 | 확정 격/길흉 hero 보류 |
| 대운 | 정확 계산 가능 | S/`customerDayun.ts`, `calendarVersion.ts`; lunar-javascript Yun sect2, 순역/절기/12 cycles | `saju/customerDayun.test.ts`; `dayun-kst-sect2-v1` 동결 |
| 세운 | 정확 계산 가능 | K/`annualFortuneYearRules.ts`, `annualFortuneEvidence.ts`; 선택연도 간지·원국/대운 교차 | 관련 `report-knowledge` 테스트; 사건 예언으로 확대 금지 |
| 월운 | 정확 계산 가능 | K/`annualMonthJie.ts`; 12 달, 절입/입춘/대운 전환별 반개구간 분할 | `report-generation/annualMonthJie.test.tsx`; **annual-month-jie-kst-v2 동결** |

신강·신약 score의 현재 분기: ≤−1.5 VERY_WEAK, ≤−0.5 WEAK, <0.8 BALANCED, <1.8 STRONG, 나머지 VERY_STRONG. 모든 결과 confidence는 MEDIUM이다. 이 표의 구현 재현을 전통 강약 검증 완료로 오해하지 않는다.

## 3. 관계·운성

| 항목 | 판정 / 실제 범위 | source·규칙 | 테스트·누락 |
| --- | --- | --- | --- |
| 천간합 / 육합 / 충 | 정확 계산 가능 | S/`relations.ts`: 5 천간합·6 육합·6 지지충; 위치 보존 | `saju/relations.test.ts`; 실제 합화 성립은 별도 미지원 |
| 형 / 파 / 해 | 부분 지원 | K/`annualFortuneYearRules.ts:getBranchPairRelations`: pair tables + 辰午酉亥 자형; 대운/세운/월운 overlay 활용 | `report-knowledge/annualFortuneYearRules.test.ts`; canonical natal table은 현재 합/충 중심. 형 pair 하나를 완성 삼형으로 부르지 않음 |
| 원진 | 정확 pair 계산 가능 | K/`sajuFeatureExtractionRules.ts:relationPairs.wonjin`: 子未/丑午/寅酉/卯申/辰亥/巳戌; extractor 및 월운 사용 | `sajuComputedFeatureExtractor.test.ts`, V3 Annual tests; natal provenance는 pair 위치 보강 필요 |
| 삼합 / 반합 | 부분 지원 | K/`annualFortuneYearRules.ts`: 申子辰/亥卯未/寅午戌/巳酉丑; 고유 3지 삼합, 2지 반합 | 왕지 없는 2지 조합도 현재 반합. 완전한 합화·세력 변화 판정 아님 |
| 방합 | 미구현 | K/`annualMonthExtendedEvidence.ts`에서 `NO_VERIFIED_CANONICAL_RULE` | 임의로 계절 3지를 새 rule로 추가하지 않음 |
| 궁합의 합·충·해·삼합·반합 | 정확 계산 가능(지원 종류 한정) | K/`compatibilityRelationRules.ts`: A/B 지지와 cross-reference | `compatibilityRelationRules.test.ts`, `compatibilityDeepSajuBridge.test.ts`; 형/파/원진 등 모든 관계를 pair engine이 지원하는 것은 아님 |
| 십이운성 | 정확 lookup 계산 가능 | K/`sajuPillarFeaturePlacement.ts:twelveLifeStageByStem`: 10일간×12지 표, 월운도 재사용 | `sajuPillarFeaturePlacement.test.ts`; 12운성 각각의 풍부한 domain 서사는 별도 부족 |

## 4. V4에서 그대로 재사용하면 위험한 지점

| 우선순위 | 실제 발견 | V4 처리 / 현재 Phase |
| --- | --- | --- |
| P0 | G/`comprehensiveV2GenerationHandler.ts:getTenGodStrength`: fractional raw weight를 <=0/==1/==2/else로 분기하여 **0.3도 excessive** 가능 | raw 계산과 의미 강도를 분리하는 V4 adapter 필요. V2 저장본/현재 계산 수정하지 않음 |
| P0 | G/`compatibilityGenerationHandler.ts:toComputedSajuFacts`: >=2 strong / ==1 present / 그 외 missing → **0.6·1.3도 missing** 가능 | 단순 문자열 strength를 V4 근거로 쓰지 않음 |
| P0 | 같은 compatibility handler: WEAK_DAYMASTER_WITH_STRONG_OUTPUT → `no_resource`; missingElements → usefulElements | 식상 과다와 무인성, 부족 오행과 용신은 동의어 아님. 이 mapping으로 V4 보완/격국 생성 금지 |
| P0 | I/`evidence.ts`: MEDIUM 구조 후보도 LOW가 아니면 confirmed로 들어올 수 있음 | certainty 외에 **계산 방법·support level·scope** gate 필수 |
| P0 | native **MANGSINSAL / TWELVE_MANGSINSAL**은 같은 연지 기준인데 표가 다름 | 예: 亥 기준 앞 rule은 申, 뒤는 寅. alias로 섞거나 두 독립 근거로 합산 금지. 규칙 검토 전 V4 합성에서 보류 |
| P1 | 귀문·원진 extractor provenance가 `gwimun:pair` / `wonjin:pair`까지만 기록 | 실제 쌍·기둥 위치를 V4 evidence projection에 연결; 근거 없이 위치 추정 금지 |
| P1 | native/derived/12신살에서 같은 이름의 연지·일지 기준이 공존 | rule+basis+target로 보존하고 고객 표시만 묶음. 같은 사실 alias를 2개 좋은 패로 세지 않음 |

위 위험은 **기존 adapter 재사용 시의 계약 위험**이다. V3 본문은 raw calculation, canonical table, substantial support, `storyFeatureRows`의 일부 구조만 사용하는 별도 방어가 있다. 따라서 모든 V3 리포트가 위 잘못된 문장을 현재 노출한다고 단정하지 않는다. 이번 Phase는 발견·문서·특성 테스트만 수행한다.

## 5. 신살·귀인 전체

공통 source: S/`shinsalConstants.ts:SHINSAL_RULES` → S/`shinsal.ts:detectShinsal`; K/`sajuComputedFeatureExtractor.ts`, `sajuFeatureExtractionRules.ts`, `sajuPillarFeaturePlacement.ts`.
공통 tests: `saju/{shinsal,calculateSajuShinsal,twelveShinsal}.test.ts`, `report-knowledge/{sajuComputedFeatureExtractor,sajuFeatureAudit,sajuPillarFeaturePlacement}.test.ts`, `report-tables/natalEvidenceConsistency.test.tsx`.

### 5.1 Native 27 rules

| 표식 | 상태 | 실제 채택 규칙 / 범위 | 월운 target adapter |
| --- | --- | --- | --- |
| 현침살 | 정확 계산 가능(좁은 정의) | 卯/酉 지지 존재. 천간까지 포함하는 타 학파의 현침 규칙은 현재 아님 | 미지원 |
| 홍염살 | 정확 계산 가능 | 일간→지지: 甲午 乙申 丙寅 丁未 戊辰 己辰 庚戌 辛酉 壬子 癸申 | 지원 |
| 백호대살 | 정확 계산 가능 | 甲辰 乙未 丙戌 丁丑 戊辰 壬戌 癸丑; native는 **모든 기둥** 검사. derived는 일주 검사 | 미지원 |
| 망신살 MANGSINSAL | 부분 지원 / 규칙 충돌 | 연지 삼합군→지지. 아래 십이망신과 결과 다름(§4) | 계산은 되나 V4 해석 보류 |
| 역마살 | 정확 계산 가능 | 연지 삼합군별 巳/申/亥/寅 | 지원 |
| 도화살 | 정확 계산 가능 | 연지 삼합군별 子/卯/午/酉; derived는 일지 기준도 별도 존재 | 지원 |
| 화개 | 정확 계산 가능 | 연지 삼합군별 未/戌/丑/辰 | 지원 |
| 고신살 / 과숙살 | 정확 계산 가능 | 연지→지지 lookup; 전체 표 JSON 참조 | 지원 |
| 천을귀인 | 정확 계산 가능 | 일간→丑未/子申/亥酉/卯巳/寅午 등 lookup | 지원 |
| 태극귀인 | 정확 계산 가능 | 일간→지지 lookup | 지원 |
| 문창귀인 / 학당귀인 | 정확 계산 가능 | 각각 독립 일간→지지 lookup | 지원 |
| 월덕귀인 | 정확 계산 가능 | 원국 월지 삼합군→丙/甲/壬/庚 천간 | 지원 |
| 천덕귀인 | 정확 계산 가능 | 원국 월지→천간 또는 지지 12 lookup | 지원 |
| 겁살 / 재살 / 천살 / 지살 | 정확 계산 가능 | YEAR_BRANCH 삼합군→각 target 지지 | 지원 |
| 년살 / 월살 | 정확 계산 가능 | 같은 12신살 rule family. 년살과 도화는 동일 target일 수 있음 | 지원 |
| 십이망신살 TWELVE_MANGSINSAL | 부분 지원 / 규칙 충돌 | 일반 망신과 같은 연지 기준이지만 다른 lookup | 계산은 되나 V4 해석 보류 |
| 장성살 / 반안살 | 정확 계산 가능 | 연지 삼합군→중심지 / 그 다음 지지 lookup | 지원 |
| 십이역마살 / 육해살 / 십이화개 | 정확 계산 가능 | 12신살 lookup. 일반 역마·화개와 중복 가능 | 지원 |

월운 “지원”은 **원국 anchor → 해당 절입 구간의 월간/월지 target** 계산이 있다는 뜻이다. 신살이 실제 매월 나온다는 뜻은 아니다. 27 중 25 rules를 평가하며 현침·백호는 `NATAL_ONLY_RULE_NO_TRANSIT_CONTRACT`로 제외한다. 망신 충돌도 그대로 전달될 수 있으므로 V4 gate가 필요하다.

### 5.2 Derived 및 DB 전용 표식

| 표식 | 상태 | 실제 규칙 | 재료 / 누락 |
| --- | --- | --- | --- |
| **귀문관살** `sinsal_gwimun` | **정확 pair 계산 가능** | 子酉/丑午/寅未/卯申/辰亥/巳戌 중 원국 지지쌍 하나 이상 | 이름만 있는 DB가 아님. 이번 테스트에서 6쌍 전부 + 부재 1건 실제 extractor 검증. 위치 provenance 보강 필요; 정신질환/영적 능력 확정 금지 |
| 원진 `sinsal_wonjin` | 정확 pair 계산 가능 | §3의 6쌍 | 월운은 실제 상대 원국 위치까지 기록. natal는 coarse |
| 양인 `sinsal_yangin` | 정확 계산 가능(채택 표 한정) | 甲卯 乙寅 丙午 丁巳 戊午 己巳 庚酉 辛申 壬子 癸亥 | repo는 음간도 포함. 결단/경계/독립이지 현침식 관찰력으로 바꾸지 않음 |
| 괴강 | 정확 계산 가능 | 일주 庚辰/庚戌/壬辰/戊戌 | day-only. 월운/세운에 임의 재사용 금지 |
| 공망 | 정확 계산 가능 | 일주의 육십갑자 순에 따른 2지지 | whole-chart와 실제 target 구분 필요 |
| 천문성 | 정확 계산 가능(채택 표 한정) | 戌 또는 亥 포함 | 풍부한 예언 능력으로 확대 금지 |
| 재고귀인 | 정확 계산 가능 | 일간 甲乙→辰, 丙丁→丑, 戊己→辰, 庚辛→未, 壬癸→戌 | 돈·기술·경험 축적 재료 있음. 시점 귀인으로 자동 전환 금지 |
| 금여록 / 암록 | 정확 계산 가능 | 각각 일간별 target 지지 lookup | 별도 native code는 없고 derived producer 있음 |
| 천을 / 문창의 derived alias | 정확 계산 가능 | 일간→지지 lookup | native와 독립 표식 2개로 세지 않음 |
| **문곡귀인 / 복성귀인 / 천의성** | **DB만 있음** | taxonomy·copy·alias는 있으나 native/derived canonical producer 없음 | 좋은 카피가 있어도 보유한 귀인처럼 생성 금지 |
| registry의 12신살 canonical ID | 정확 계산 가능(망신 충돌 제외) | extractor 일지 기준 삼합군, 없으면 연지 기준 | native 연지 기준과 출처를 보존. 12개 전체 ID와 rules는 JSON 참조 |

### 5.3 시간 evidence 재사용

| 층 | 원국 | 대운 | 세운 | 월운 |
| --- | --- | --- | --- | --- |
| 간지/십성/오행 | 지원 | 지원 | 지원 | 지원 |
| 합충 등 관계 | canonical natal는 합충 중심 | annual relation helpers 재사용 | pair/trine helpers | 절입 segment별 같은 helpers |
| 신살·귀인 | native+derived | 원국 신살을 배경 재료로 사용. 모든 native의 대운 target engine은 없음 | 모든 native의 연운 target engine은 없음 | native 25 rules target adapter + 운성 + 원진 |
| 귀문/양인/재고/금여/암록 | derived 지원 | 보편적 transit 규칙 layer 없음 | 동일 | 해당 derived transit layer 없음 |
| 방합 | 없음 | 없음 | 없음 | 명시적 unsupported |

K/`majorFortuneEvidence.ts`의 `auxiliaryStarsLayer`는 **natalLabels**에서 온 배경이다. “이번 대운에 새로 생긴 귀인”으로 쓰면 안 된다. K/`annualMonthExtendedEvidence.ts`는 natal detections를 월운 신살로 복사하지 않는다. 현재 표/본문은 같은 month extended packet을 사용한다. 새 시점 지원은 검증된 규칙과 scope 계약이 있는 것만 별도 evidence layer에서 확장해야 한다.

## 6. 명리 해석 재료: 개수와 읽기 재미는 다르다

| 층 / source | 실제 보유 | 빈약한 곳 / V4 재사용 판단 |
| --- | --- | --- |
| K/`sajuKnowledgeBase.ts` | 77 records, core image/meaning/hints + domain packs | 감사한 8 topic의 **2,384문장 모두 topicPack 공통 양식**. 이름·초점만 바뀌는 이 부분을 풍부한 독립 해석으로 세지 않음. coreMeaning/custom hints까지 모두 template라는 뜻은 아님 |
| K/`sajuFeatureTaxonomy.ts`, `sajuDayPillarKnowledge.ts` | 124 taxonomy, 60일주, 이미지·장점·주의·주제·scene seed | 이미지+짧은 공통 scene은 있지만 각 domain별 완결 서사와 같지 않음 |
| I/`atomicRegistry.ts` | 195 union IDs, reviewed 31 | `use[domain]`이 topic advice 또는 같은 practicalUse를 반복 사용. 조언 보고서로 수렴하기 쉬움 |
| I/`compounds.ts` | 45 pair 검토, 46 선택 규칙 | 일반 생활 조합. classic 격/길흉 확정에 사용 금지 |
| 상품별 V3 authored copy | 아래 §7에 구체적 파일 | 고객 수준의 재미는 이 층에 많이 있음. V4 material로 옮길 때 evidence/scene/context를 같이 보존 |

**“이름은 있으나 domain 재료가 얇은” 전수 필터**는 JSON의 `domainMaterial.*.strings=0` 또는 `templatedStrings=strings` 및 `sharedSceneSeeds`로 재현한다.

| category | ID 수 | audited 8 topic pack이 모두 없는 ID | 해석 |
| --- | ---: | ---: | --- |
| 일간 | 10 | 0 | 전부 packs 존재하나 공통 양식; 일간별 실생활 묘사 보강 |
| 일주 | 62 | 50 | 실제 일주 60 + legacy alias 2. exact-ID join 누락과 DB 부족을 구분 |
| 오행 일반 / 오행 상태 | 5 / 10 | 0 / 6 | 없음/과다를 감정 결함으로 단정하지 않는 장면 필요 |
| 오행 균형 | 1 | 0 | 같은 균형 조언보다 해당 사람의 장점으로 번역 |
| 귀인 canonical / legacy nobleman | 12 / 6 | 11 / 0 | alias마다 별개 의미를 만들지 않고 canonical로 통합 |
| special_pattern / structure | 13 / 10 | 0 / 10 | **계산 미지원 구조는 재료부터 보강해도 publish 금지** |
| native-shinsal | 27 | 27 | 명칭/설명 위주. 대응 taxonomy copy 재사용 가능하나 근거 basis 보존 |
| sinsal | 17 | 2 | domain pack이 있어도 보편 template; 실제 발현 확장 필요 |
| 십성 | 10 | 0 | 8 topic은 다 있으나 공통 양식. 현실 강점/단점과 domain별 행동 필요 |
| 십이신살 | 12 | 12 | taxonomy 이미지/scene은 있음; 독립 domain prose 부족 |

결혼·궁합·시간 운세는 atomic schema에 **전용 문장 slot이 없다**. `family_independence`를 결혼 전체로, `matchingHints`를 A→B 궁합으로, `environment_luck`을 특정 대운/월운으로 세면 안 된다. V3의 Love/Compatibility/Major/Annual composer가 각각 보충하므로 “상품 내용이 없다”는 판정은 아니다.

### 6.1 이미지·비유와 실제 영역 확장

| 확인된 재료 | 현재 이미지 / 의미 | V4 영역별 발현 후보(실제 evidence 있을 때만) |
| --- | --- | --- |
| 장성 + 반안 | 깃발 앞 장수 / 말 안장에 올라탄 장군 | 종합: 앞에 서는 사람 / Career: 이름·자리·역할 확대 / 운세: 해당 period 증거가 있으면 인정의 흐름. **둘의 합성은 새 후보이며 현재 검증된 격 아님** |
| 천을귀인 | 어두운 길에서 등불을 들어주는 사람 | 사람복 / 일의 연결 / 관계의 도움. 특정 배우자·합격·계약 보장 아님 |
| 재고귀인 | 돈의 물길 끝 단단한 창고 | 돈·기술·경험·고객이 쌓이는 패. 단일 표식만으로 거부가 된다는 주장 금지 |
| 현침 | 정확히 찌르는 바늘 | 성격 모순 포착 / 공부 오답 / 일 검수 / 관계 말투 / 연애 미세 변화 / 과사용 자기비판 |
| 도화 / 홍염 | 눈에 들어오는 꽃 / 가까워질수록 살아나는 붉은 온기 | 처음 보이는 매력 vs 친밀해진 뒤 매력. 없는 표식 invent 금지 |
| 화개 / 귀문 | 혼자 숙성하는 덮개 / 닫힌 문 뒤 기척 | 탐구·혼자 회복 / 세밀한 내면 반응. 신통력·질병 진단 금지 |
| 양인 / 백호 | 날 선 도구 / 강한 순간의 힘 | 경계·결단 / 압박에서의 집중. 현침과 의미 혼용, 사고·수명 예언 금지 |

## 7. 6상품 현재 실행·재료·위험

진입은 G/`productGenerationDispatcher.ts` → 각 기존 handler → V3 generation. 신규 V4로 교체한 것이 아니다.

| 상품 / 실제 V3 entry | 재사용할 I/ 재료 | 현재 강점 | V4 필요 |
| --- | --- | --- | --- |
| `comprehensiveV3Generation.ts` | comprehensiveStoryCopy, comprehensiveDepthPortraits, comprehensiveDepthScenes, comprehensiveDepthFusion, comprehensiveStoryEvidence | 장점·반전·현실 scene·support-aware prominence | Saju 자체 domain 재료, 3종 Fusion의 일관된 조건, feature 독점 방지 |
| `careerV3Generation.ts` | careerPortraits, careerEditorialScenes, careerEditorialPolish, careerContextV3 | 상태/직업 정규화 기반 scenes, raw 직업 보존 | fractional 강도 adapter 우회. **비정확 birth time은 현재 V3 null→legacy 경로**이므로 별도 연결 검증 |
| `loveV3Generation.ts` | lovePortraits, loveEditorialPolishCopy, loveEditorialContext | 6 관계 상태, 도화/홍염 분리, 부모가 된 나 | 관계 trait 선택 다양화; MBTI 하나로 사주 차이를 덮지 않기 |
| `compatibilityV3Generation.ts` | compatibilityPolishedCopy, compatibilityEditorialEvidence, context | 7 category, A/B 방향, 확정 역할, 비수치 결론 | 한 사람의 trait와 둘 사이 fact 분리, conditional birth evidence hero 방지 |
| `majorFortuneV3Generation.ts` | majorFortuneFinalPolish, majorFortuneHorizon, majorFortuneOutlook, mbtiFortuneFusion | 14년·전환·직업 scene·현재 시제 | 원국 좋은 패와 period 신규 좋은 흐름 구분, yearly 합충 문장 중복 감소 |
| `annualV3Generation.ts` | annualEditorialCopy, annualRobustScenes, mbtiFortuneFusion | 월 12개·현재 달·Jie segment·monthly evidence 연결 | MBTI trait 분산, 월별 주인공·good fortune 합성, 없는 transit 보류 |

재사용 기반: I/`engine.ts`의 independent lineage, `editorialComposer.ts`의 subject/toward/period·support gate, `repetitionGuard.ts`, 기존 robust fixture 및 V2 hash/replay tests. 위 파일들은 이번에 수정하지 않는다.

## 8. MBTI 16유형 전수

source: `docs/product/mbti/source/{TYPE}.json` → K/`mbti/sourceRuntimeAdapter.ts`.
기존 adapter와 동일하게 UTF-8 BOM을 제거한 뒤 JSON parse한다.

**16/16 모두** axes 4, function stack 4, summary(identity/strength/risk/growthStrategy), 아래 모든 trait domain, 가까운/먼 keyword, notablePairs 16개, reportUseCases 6상품, bridge hints를 보유한다. 필수 trait 필드 빈칸 **0**. sourceCoverage의 inferred를 원문 직접 근거처럼 부풀리지 않는다.

표 숫자는 **trait 수**, 품질 점수가 아니다. “일/직장”, “돈/투자”, “연애/결혼”, “관계/소통”, “부모/아이”, “강점/주의/성장”, “가까운/먼 keyword”, “hint/실행 scene rule” 순서다.

| 유형 | 일/직장 | 돈/투자 | 공부 | 연애/결혼 | 관계/소통 | 부모/아이 | 강점/주의/성장 | keyword | hint/rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INTJ | 8/7 | 6/5 | 5 | 4/5 | 4/4 | 4/4 | 4/5/4 | 30/30 | 10/2 |
| INTP | 7/6 | 6/5 | 5 | 4/5 | 4/5 | 3/5 | 4/6/4 | 35/35 | 9/1 |
| ENTJ | 7/6 | 6/5 | 5 | 4/5 | 4/4 | 4/4 | 4/5/4 | 30/31 | 9/2 |
| ENTP | 6/6 | 6/5 | 5 | 4/5 | 4/4 | 4/4 | 4/5/4 | 30/30 | 10/2 |
| INFJ | 7/6 | 6/5 | 5 | 4/5 | 4/5 | 3/5 | 4/6/4 | 28/22 | 11/2 |
| INFP | 7/6 | 6/5 | 5 | 4/5 | 4/5 | 3/5 | 4/6/4 | 30/30 | 11/2 |
| ENFJ | 6/6 | 6/5 | 5 | 4/5 | 3/3 | 3/3 | 3/4/3 | 30/28 | 10/2 |
| ENFP | 6/6 | 6/5 | 5 | 4/5 | 3/3 | 3/4 | 3/4/3 | 31/29 | 10/2 |
| ISTJ | 7/6 | 6/5 | 5 | 3/5 | 3/2 | 3/2 | 2/3/2 | 30/30 | 10/2 |
| ISFJ | 7/6 | 6/5 | 5 | 4/5 | 4/3 | 4/4 | 4/5/4 | 30/30 | 10/2 |
| ESTJ | 6/7 | 6/5 | 5 | 4/5 | 5/4 | 4/4 | 4/5/4 | 38/35 | 10/2 |
| ESFJ | 6/7 | 6/5 | 5 | 4/5 | 5/4 | 4/4 | 4/5/4 | 30/25 | 10/2 |
| ISTP | 7/6 | 6/5 | 5 | 3/5 | 3/2 | 3/3 | 3/3/2 | 35/35 | 10/2 |
| ISFP | 7/6 | 6/5 | 5 | 4/5 | 4/3 | 3/4 | 4/5/4 | 30/30 | 10/2 |
| ESTP | 6/5 | 6/5 | 5 | 4/5 | 4/4 | 3/4 | 4/5/4 | 30/30 | 10/2 |
| ESFP | 6/6 | 6/5 | 5 | 4/5 | 4/4 | 4/4 | 4/5/4 | 30/32 | 10/2 |

identity 5–6, thinkingStyle 4–6개도 전 유형에 있다. 정확한 IDs·수량은 JSON 참조. reportUseCases는 모든 유형 종합4/Career5/Love4/Compatibility4/Major4/Annual4개. notablePairs는 총 256개 directed entry(**direct158 / inferred98**), 각 sharedGround/friction/positiveInfluence/lovePattern/marriagePattern/repairStrategy/reportLine 보유. pair DB가 완비됐다는 사실은 A/B 실제 명리와의 Fusion 완료를 뜻하지 않는다.

### 8.1 Domain별 밀도 판단

| domain | direct / inferred 합계 | 바로 쓸 수 있는 범위 | 정확한 부족 / 보강 |
| --- | --- | --- | --- |
| 정체성 / 생각 | 94/0, 84/0 | 캐릭터·사고 습관 seed 충분 | 동어 반복·type 단정은 scene으로 재작성 |
| 일 / 직장 | 89/17, 81/17 | 풍부한 시작 재료 | 직업/상태와 결합 필요. 직무명 나열을 개인화로 세지 않음 |
| 돈 / 투자 | 28/68, 4/76 | 소비·관리·위험 선호의 후보 | **inferred 비중이 큼**. 실제 수익성·투자 적합성 보장 금지; 특히 투자 76개를 검증 fact로 사용 금지 |
| 공부 | 53/27 | 이해·설명·몰입 scene | 성장 조언뿐인 문장은 순수 관찰로 보강 |
| 연애 | 62/0 | 표현·끌림·거리감 소재 | ISTJ·ISTP 각 3개로 가장 얇음; 6상태별 경험까지 완비된 것은 아님 |
| 결혼 | 32/48 | 생활/자율/역할 seed | inferred 48개; 연애 문장의 단순 가정생활 치환 금지 |
| 부모 / 아이 | 55/0, 63/0 | 부모 반응·배움 모습 seed | ISTJ 아이2, ISTJ/ISTP 부모3; 부모자녀 궁합의 실제 양방향과 별도 |
| 관계 / 소통 | 62/0, 59/0 | 넓고 깊은 관계·말하기 습관 | ISTJ/ISTP 소통2; ENFJ/ENFP 관계3/소통3, ISFJ/ISFP 소통3은 폭이 상대적으로 좁음 |
| 강점 / 주의 / 성장 | 59/0, 76/1, 37/21 | 장단점 대비에 재사용 | ISTJ 강점2/성장2, ISTP 성장2. 성장전략을 이미 가진 습관으로 서술하지 않음 |

**빈 domain은 없지만 Fusion coverage는 빈칸이 많다.** INTP는 authored scene 1개, 나머지 15유형은 각 2개뿐이다. 16×domain×A/B/C를 현재 31개가 포괄하지 않는다. 예: ESTJ는 amplification 2개뿐, INTP는 compensation 1개뿐. 부모/결혼/시간/7 category 궁합까지 유형별로 골고루 연결된 상태가 아니다.

### 8.2 현재 Fusion과 injection은 서로 다름

| source | 현재 실제 동작 | V4 차이 |
| --- | --- | --- |
| K/`bridge/interactionSceneRules.ts` → I/`fusion.ts` | 31 authored rules, 정확 trait ID + feature predicate + subject/period 선택 | strong/support 및 capability gate 추가 필요. 현재 non-weak에는 conditional도 포함 가능 |
| K/`fusionKnowledgeBase.ts` | 78 rules, topic/타입/조건별 legacy material | 전부 V3 `fuseMbti`에 연결된 것은 아님. 재다신약 predicate 같은 미검증 구조 연결 제거/보류 필요 |
| I/`mbtiNarrative.ts` | trait matching 후 최대 8개·domain 중복 제한; strongLine을 문단에 붙이는 경로 있음 | evidence 매칭 없이도 선택 가능. **본문 MBTI 사용이지 자동 Fusion으로 인정하지 않음** |
| I/`mbtiFortuneFusion.ts` | 십성·domain에 맞춘 trait 선택 + period prose | trait 분산은 재사용, 고정 문장 덧붙이기는 V4 합성 기준 미달 |
| 기존 compensation | 주로 명리의 장점으로 MBTI 약점/과제를 보완 | 사용자가 정한 C는 **MBTI 행동이 명리 약한 발현을 보완**. 단순 enum rename 불가 |

## 9. 우선순위와 수락 조건

| 순서 | 구현 필요 | 재사용 | 위험 / 완료 기준 |
| --- | --- | --- | --- |
| P0 | V4 evidence capability/method/scope gate, fractional-safe 읽기 | raw calc + canonical table + substantial evidence | 수량 후보를 확정 격으로 쓰는 사례 0, missing≠unknown, conflict rule 보류 |
| P1 | domain별 인물 묘사 material 정리 | V3 authored portraits/scenes + taxonomy 이미지 | 사전 꼬리/조언만 반복하는 block 감소. unsupported 귀인 추가 0 |
| P2 | A/B/C typed Fusion 및 good-fortune 합성 | 31 bridge 중 유효 조건·실제 trait IDs | 같은 사주/다른 MBTI와 반대 counterfactual, 독립 lineage/period 일치 |
| P3 | 상품별 V4 composer/view의 명시적 버전 연결 | 기존 generator/view/publish/share 계약 | legacy replay, 모든 section/12월/14년/방향성, 고객 내부 ID 0 |
| 보류 | 고전 신강·신약·격국, 방합, 신규 귀인/transit rule | 검증된 규칙만 별도 심사 | 이번에 임의 계산식 추가 안 함. 미지원 유지해도 V4의 재미 있는 명리·Fusion 구현 가능 |

구체적 다음 파일/모듈 범위와 예시는 [FUSION_BLUEPRINT.md](FUSION_BLUEPRINT.md).

## 10. Phase 0 검증

- preflight: `git fetch origin` 후 local master / origin/master / 시작 HEAD가 기준 SHA와 동일함을 확인하고 `v4/rebuild` 생성. 기존 dirty `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 변경·stage하지 않음.
- JSON/data: 195 ID·27 lookup rules·16유형 전체 source 재현 비교, trait 필수 필드/refs, 60일주 확인.
- 귀문 6 pair + negative를 실제 extractor로 검증. DB명만 확인한 검증이 아님.
- 같은 연지에서 일반 망신과 십이망신의 target 위치가 달라지는 현재 동작을 특성 테스트로 기록. 어느 규칙이 옳은지 승인한 테스트는 아님.
- 관련 suite **116 files / 1,776 PASS**, 추가 경계 suite **5 files / 143 PASS**. 합계 **1,919 PASS / 0 FAIL**. 신규 Phase 0 audit는 26 tests.
- JSON 17개(감사 + MBTI 16개) parse 및 문서 내부 링크 확인 PASS. `pnpm lint` PASS. `git diff --check` 및 staged diff-check 확인.
- **V4 runtime/UI는 아직 구현하지 않음**. 이번에는 browser/SSR/build를 새로운 V4 화면의 검증으로 보고하지 않는다. 기존 V3 관련 suite의 SSR 테스트와 V2 replay 검증만 실행 범위에 포함.

재실행 명령:

```sh
pnpm test tests/unit/saju tests/unit/report-knowledge tests/unit/report-tables tests/unit/interpretation-v3 tests/unit/interpretation-v4 tests/unit/report-generation/fusionBridgeFactRegression.test.ts tests/unit/report-generation/mbtiProductUtilization.test.tsx
pnpm test tests/unit/report-generation/annualMonthJie.test.tsx tests/unit/report-generation/annualMonthlyRelationFacts.test.tsx tests/unit/report-generation/customerDayunGeneration.test.ts tests/unit/report-generation/canonicalCalendarGeneration.test.ts tests/unit/report-generation/birthTimePrecisionGeneration.test.ts
pnpm lint
git diff --check
git diff --cached --check
```
