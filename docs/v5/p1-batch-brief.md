# P1 지식 DB 작성 배치 브리프 (서브에이전트용)

당신은 결리포트 v5 지식 DB의 명리 요소를 쓰는 작가다. 이 문서 + 아래 "먼저 읽을 것" 네 가지가 당신의 전체 맥락이다. 저장소 밖을 탐색하지 말고, API를 호출하지 말고, 커밋하지 말라.

## 먼저 읽을 것 (순서대로, 전부)
1. `docs/v5/SPEC.md` 1절(제품 원칙) — 문체·금지 사항의 원본.
2. `src/data/knowledge-v5/schema.ts` — `MyeongriFeatureSchema`와 공통 타입. 글자 수 상한은 여기 정의가 기준이다.
3. `docs/v5/p1-gold-samples.md` — 기준 항목 20개. **최소 4개(일간 정화, 일주 경진, 현침살, 정재)는 끝까지 읽고** 문장의 구체성 수준을 몸에 익혀라. 당신이 쓰는 모든 문장은 이 수준이어야 한다.
4. `src/data/knowledge-v5/behavior-ontology.json` — `dimensionTags`에 쓸 수 있는 차원 id 31개(여기 없는 id는 쓰면 lint 실패).

## 문장 기준 (SPEC 1절 요약 + 이 작업의 구체 규칙)
- **장면(scenes)**: 사람·상황·행동이 보이는 1~2문장, 20~140자. "회의에서 다들 고개를 끄덕일 때 혼자 '근데 그거 누가 책임지는데요?'라고 묻는 사람" 수준. 장소·시간·물건·대사 중 둘 이상이 들어가면 합격이다.
  - 금지: 정보량 0 표현("남다른 잠재력", "무한한 가능성", "특별한 존재", "큰 복"), 성향 라벨만 있는 문장("리더십이 있습니다", "~성향입니다"), 날짜·사건 확정("올해 결혼합니다", "승진합니다"), 비하, 흐린 말투("~일 수도 있습니다").
  - 장면 문장 안에 MBTI 코드와 명리 체계 용어(사주·명리·일간·일주·월지·지지·오행·십성·신살·귀인·대운·세운·원국·용신·격국·삼합·육합)를 쓰지 말라. 장면은 그 사람의 생활이지 설명이 아니다. (strengths·overuse·positionNuance·strengthRules에는 써도 된다.)
  - 7영역 각각 2개 이상(work 3개 권장). 영역: work 일, money 돈, study 공부, love 연애, marriage 결혼, relationships 사람, alone 혼자.
- **image**: metaphor(비유 한 줄)와 visual(눈에 보이는 형상 한 줄). 둘 다 **전체 DB에서 유일**해야 한다. 특히 일주 60개는 서로 다른 사물·장면이어야 한다. 흔한 비유(큰 나무, 큰 바위, 태양)는 피하고 구체 사물로 가라.
- **strengths**(2~6): 좋은 면, 단정형으로. "당신에게는 ~가 있어서 ~합니다".
- **overuse**(1~5): 과사용·팩폭. 문장 안에 **근거 조건**을 적는다("~가 많을 때", "일지에 있으면"). 따뜻하게 끝낸다.
- **positionNuance**: stem·branch·tenGod·shinsal·gwiin·twelveStage 가족은 year/month/day/hour 네 개 모두 필수(각 10~220자). 년=집안·어린 시절, 월=직장·사회·부모, 일=본인·배우자, 시=자녀·말년·속마음.
- **strengthRules**: strong/weak 필수, duplicate/clash 권장, rule(내부 계산 메모, 고객 비노출) 권장.
- **mbtiLinks**(2~8): target은 유형 코드(ENTJ), 인지기능(Te·Ni·Se·Fi·Ti·Ne·Si·Fe), 또는 축(E/I/S/N/T/F/J/P). resonance(공명)와 tension(긴장) 둘 다 넣어라. why는 한 줄, 인지기능 근거를 적어라.
- **dimensionTags**(2개 이상): 온톨로지 id → -1~1(0 금지).
- **sources**(내부 전용): 형식 `classic:sm2:論咸池`, `deep:marker:dohwa`, `foundation:shinsal_gwiin:dohwa`, `v4:depth:sinsal_dohwa`, `통용`, `추정`. 고전 출처가 있으면 반드시 적고, 없으면 `통용` 또는 `추정`으로 쓰고 confidence를 맞춰라.
- **confidence**: 통용(한국 명리에서 널리 쓰는 해석) / 학파차이(고전·학파마다 다름) / 추정(출처 없이 편집 판단).
- **engineSupport/engineKey**: 아래 배치 표에 적힌 대로.
- 한자는 `name` 필드에만("정관(正官)"). 다른 필드는 한글.
- 문장 하나 ≤ 90자. 존댓말이되 가볍게(~입니다/~예요 혼용). "당신"을 써도 된다.
- 같은 문장을 두 번 쓰지 말라(전체 DB 기준). 기준 항목의 문장을 베끼지 말라.

## 참고 자료 (grep으로만, 전체 읽기 금지)
- 고전 정의·출처: `src/lib/report-knowledge/sajuFoundationKnowledge.ts` — `grep -n '"id": "foundation:<category>:<key>"' -A 40`. definition.text와 sourceRefs(sourceId·locator)를 sources로 옮겨 적는다(`classic:<sourceId>:<locator>` 형식).
- 연구용 DB(출처 엄격): `src/lib/report-knowledge/foundation-deep/*.ts` — `grep -n 'deep:marker:<key>\|deep:ten_god:<key>\|deep:day_pillar:<한자>' -A 30`. traditionalMeaning·formation·caution을 근거로 쓰고 sourceRefs를 옮긴다. `deep-editorial`만 있으면 confidence=추정.
- V4 깊이 시드(구체 문장 재료): `src/lib/interpretation-v4/materialDepth.ts`와 `*Materials.ts` — `grep -n '<feature id>' -A 20`. 문장을 그대로 쓰지 말고 장면으로 다시 써라.
- v1 데이터(장면 재료): `src/data/knowledge-v5/legacy/myeongri-features.json` — `grep -n '"id": "<old id>"' -A 60`. 30~40%는 쓸 만한 장면이니 **고쳐 쓰되 그대로 복사하지 말라**(중복 검사에 걸린다).
- 엔진 코드·탐지 규칙: `src/lib/saju/shinsalConstants.ts`(신살 표), `src/lib/saju/constants.ts`(지장간·합충), `src/lib/saju/tags.ts`.

## 작업 절차
1. 위 "먼저 읽을 것"을 읽는다.
2. 배치 표의 id를 **정확히** 그대로 쓴다(철자·한자·대소문자). 빠뜨리지 말라.
3. 대상마다 참고 자료를 grep해 정의·출처·재료를 모은다.
4. 파일 하나를 쓴다: `{ "version": "myeongri-v5-2", "family": "<family>", "features": [...] }`. JSON 문법 오류가 없어야 한다.
5. 검사: `pnpm exec tsx scripts/knowledge-lint.ts --only src/data/knowledge-v5/myeongri/<file>.json` → `issueCount: 0`이 될 때까지 고친다. 그다음 **전체** `pnpm exec tsx scripts/knowledge-lint.ts`를 돌려 다른 파일과의 중복 문장·이미지 중복도 0으로 만든다(다른 파일은 고치지 말고 자기 파일만 고친다).
6. 보고(최종 메시지): 쓴 id 목록, 전체 lint의 stats와 issueCount, confidence=추정으로 둔 id와 이유, 가장 자신 있는 장면 3개와 가장 약하다고 생각하는 장면 2개(원문 인용). 2,000자 이내.

## 배치 표
| 배치 | 파일 | family | id (정확히) | engineSupport / engineKey |
|---|---|---|---|---|
| A1 | myeongri/stem-01.json | stem | stem:甲 stem:乙 stem:丙 stem:丁 stem:戊 stem:己 stem:庚 stem:辛 stem:壬 stem:癸 | true / 한자 한 글자 |
| A2 | myeongri/branch-01.json | branch | branch:子 branch:丑 branch:寅 branch:卯 branch:辰 branch:巳 branch:午 branch:未 branch:申 branch:酉 branch:戌 branch:亥 | true / 한자 한 글자 |
| A3 | myeongri/day-master-02.json | dayMaster | dayMaster:甲 dayMaster:乙 dayMaster:丙 dayMaster:戊 dayMaster:己 dayMaster:庚 dayMaster:辛 dayMaster:壬 dayMaster:癸 (丁은 이미 있음) | true / DAY_MASTER_GAP_WOOD, DAY_MASTER_EUL_WOOD, DAY_MASTER_BYEONG_FIRE, DAY_MASTER_MU_EARTH, DAY_MASTER_GI_EARTH, DAY_MASTER_GYEONG_METAL, DAY_MASTER_SIN_METAL, DAY_MASTER_IM_WATER, DAY_MASTER_GYE_WATER |
| B1 | myeongri/day-pillar-02.json | dayPillar | 甲子 乙丑 丙寅 丁卯 戊辰 己巳 庚午 辛未 壬申 癸酉 (id는 `dayPillar:甲子` 형식) | true / 한자 두 글자 |
| B2 | myeongri/day-pillar-03.json | dayPillar | 甲戌 乙亥 丙子 戊寅 己卯 辛巳 壬午 癸未 甲申 乙酉 | true |
| B3 | myeongri/day-pillar-04.json | dayPillar | 丙戌 丁亥 戊子 己丑 庚寅 辛卯 壬辰 癸巳 甲午 乙未 | true |
| B4 | myeongri/day-pillar-05.json | dayPillar | 丙申 丁酉 戊戌 己亥 庚子 辛丑 壬寅 癸卯 甲辰 乙巳 | true |
| B5 | myeongri/day-pillar-06.json | dayPillar | 丙午 丁未 戊申 己酉 庚戌 辛亥 壬子 癸丑 甲寅 乙卯 | true |
| B6 | myeongri/day-pillar-07.json | dayPillar | 丙辰 丁巳 戊午 己未 庚申 辛酉 壬戌 癸亥 (丁丑·庚辰은 이미 있음) | true |
| C1 | myeongri/ten-god-02.json | tenGod | tenGod:比肩 tenGod:劫財 tenGod:食神 tenGod:傷官 tenGod:偏財 tenGod:偏官 tenGod:正印 | true / 한자 |
| C2 | myeongri/ten-god-balance-01.json | tenGodBalance | tenGodBalance:PEER:STRONG tenGodBalance:PEER:WEAK tenGodBalance:OUTPUT:STRONG tenGodBalance:OUTPUT:WEAK tenGodBalance:WEALTH:STRONG tenGodBalance:WEALTH:WEAK tenGodBalance:OFFICER:STRONG tenGodBalance:OFFICER:WEAK tenGodBalance:RESOURCE:STRONG tenGodBalance:RESOURCE:WEAK | true / TEN_GOD_PEER_STRONG 등 (`src/lib/saju/tags.ts`) |
| D1 | myeongri/shinsal-02.json | shinsal | shinsal:BAEKHODAESAL shinsal:MANGSINSAL shinsal:HWAGAE shinsal:GOSINSAL shinsal:GWASUKSAL shinsal:TWELVE_GEOPSAL shinsal:TWELVE_JAESAL shinsal:TWELVE_CHEONSAL shinsal:TWELVE_JISAL shinsal:TWELVE_NYEONSAL shinsal:TWELVE_WOLSAL shinsal:TWELVE_MANGSINSAL shinsal:TWELVE_YEOKMASAL shinsal:TWELVE_YUKHAESAL shinsal:TWELVE_HWAGAE | true / 코드 그대로 |
| D2 | myeongri/shinsal-03.json | shinsal | shinsal:GONGMANG shinsal:GOEGANG shinsal:YANGIN shinsal:WONJIN shinsal:GWIMUN shinsal:CHEONMUN shinsal:EUMCHAK_YANGCHA shinsal:CHEONRA_JIMANG | false / 없음 |
| D3 | myeongri/gwiin-02.json | gwiin | gwiin:TAEGEUK_GWIIN gwiin:MUN_CHANG_GWIIN gwiin:HAK_DANG_GWIIN gwiin:WOL_DEOK_GWIIN gwiin:CHEON_DEOK_GWIIN (엔진 true) + gwiin:AMROK gwiin:BOKSEONG gwiin:CHEON_EUI gwiin:GEUMYEO gwiin:MUNGOK gwiin:JAEGO (엔진 false) | 혼합 |
| E1 | myeongri/twelve-stage-02.json | twelveStage | twelveStage:長生 twelveStage:沐浴 twelveStage:冠帶 twelveStage:建祿 twelveStage:衰 twelveStage:病 twelveStage:死 twelveStage:墓 twelveStage:絶 twelveStage:胎 twelveStage:養 | false |
| E2 | myeongri/relation-02.json | relation | relation:STEM_HAP(variants 甲己·乙庚·丙辛·丁壬·戊癸) relation:YUKHAP(子丑·寅亥·卯戌·辰酉·巳申·午未) relation:SAMHAP(申子辰·寅午戌·巳酉丑·亥卯未) relation:BANGHAP(寅卯辰·巳午未·申酉戌·亥子丑) relation:HYEONG(寅巳申·丑戌未·子卯·辰辰·午午·酉酉·亥亥) relation:PA(子酉·丑辰·寅亥·卯午·巳申·戌未) relation:HAE(子未·丑午·寅巳·卯辰·申亥·酉戌) | STEM_HAP·YUKHAP true(engineKey STEM_COMBINATION·BRANCH_COMBINATION), 나머지 false. variants 필수, positionNuance 권장 |
| F1 | myeongri/element-02.json | element | element:WOOD:STRONG element:WOOD:WEAK element:WOOD:MISSING element:WOOD:BALANCED element:FIRE:STRONG element:FIRE:WEAK element:FIRE:MISSING element:FIRE:BALANCED | true / WOOD_STRONG 등 (BALANCED는 engineKey 생략, engineSupport true) |
| F2 | myeongri/element-03.json | element | element:EARTH:* 4 element:METAL:* 4 element:WATER:MISSING element:WATER:BALANCED | true |
| F3 | myeongri/yin-yang-02.json | yinYang | yinYang:YANG_HEAVY yinYang:YANG_HEAVY:MALE yinYang:YIN_HEAVY yinYang:YIN_HEAVY:MALE yinYang:YIN_HEAVY:FEMALE yinYang:BALANCED | true / YANG_HEAVY·YIN_HEAVY·BALANCED |
| G1 | myeongri/climate-01.json | climate | climate:甲:spring/summer/autumn/winter, climate:乙:* , climate:丙:spring, climate:丙:summer | false |
| G2 | myeongri/climate-02.json | climate | climate:丙:autumn/winter, climate:丁:*, climate:戊:* | false |
| G3 | myeongri/climate-03.json | climate | climate:己:*, climate:庚:*, climate:辛:spring, climate:辛:summer | false |
| G4 | myeongri/climate-04.json | climate | climate:辛:autumn/winter, climate:壬:*, climate:癸:* | false |
| H1 | myeongri/structure-01.json | structure | structure:WEAK_DAYMASTER_WITH_STRONG_WEALTH structure:WEAK_DAYMASTER_WITH_STRONG_OUTPUT structure:WEAK_DAYMASTER_WITH_STRONG_OFFICER structure:RESOURCE_HEAVY structure:PEER_HEAVY structure:OUTPUT_HEAVY structure:WEALTH_HEAVY structure:OFFICER_HEAVY structure:MIXED_OFFICER_KILLING structure:RESOURCE_SUPPORTS_DAYMASTER structure:OUTPUT_GENERATES_WEALTH structure:WEALTH_GENERATES_OFFICER structure:FIRE_METAL_TENSION structure:WATER_WEAK_RECOVERY_NEEDED | true / 코드 그대로 |

가족별 특수 규칙:
- **element WEAK·MISSING**: `remedy { actions 3~6(장면), partner 2~4(장면), places 3~6 }` 필수. 보완 행동은 그 오행의 상징(목=식물·새벽·시작, 화=빛·사람·열, 토=땅·요리·루틴, 금=정리·운동·쇠, 수=물·독서·밤)을 생활 행동으로 바꾼 것.
- **climate**: 계절은 월지 기준(spring 寅卯辰, summer 巳午未, autumn 申酉戌, winter 亥子丑). 그 일간이 그 계절에 무엇을 원하는지(조후 용신: 예 겨울 丁은 甲木과 따뜻함, 여름 庚은 壬水)를 image·strengths·overuse의 근거로 삼는다. 출처: `窮通寶鑑`은 저장소에 없으니 `통용`으로 쓰고 confidence=통용 또는 학파차이.
- **relation**: 종류 항목에 scenes 7영역을 쓰고, 짝은 variants에 image·oneLiner·nuance로. positionNuance에는 "어느 자리끼리 만나느냐"의 뉘앙스를 쓴다.
- **dayPillar**: 지장간과 일간 대비 십성(`deep:day_pillar:<한자>`의 stored)을 image와 overuse의 근거로. 60개 이미지는 전부 다른 사물이어야 한다. 괴강(庚辰·庚戌·壬辰·戊戌), 백호(甲辰·乙未·丙戌·丁丑·戊辰·壬戌·癸丑), 양인(丙午·壬子·戊午) 같은 일주 통념은 overuse에 근거로 적어도 된다.
- **structure**: `src/lib/saju/structureAnalysis.ts`의 패턴 탐지 조건을 strengthRules.rule에 적고, 그 조건이 생활에서 어떻게 보이는지를 장면으로.
