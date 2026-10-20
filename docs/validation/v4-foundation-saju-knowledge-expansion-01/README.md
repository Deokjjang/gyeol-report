# V4-FOUNDATION-SAJU-KNOWLEDGE-EXPANSION-01

2026-10-13. 원천 연구 자료 보강이며 생성기·의미 축·Fusion 연결은 하지 않았다.

## 결과와 한계

**기존 739개 레지스트리 레코드를 조사·고정하고, 분리된 연구 항목 213개를 추가했다.** 739는 중복 활용을 포함한 레코드 수이며 독립 명리 사실의 수가 아니다. 신규 항목도 213개 모두가 검증된 심층 해석이라는 뜻은 아니다.

기본 정의 156개는 직접 열람한 문헌의 기술을 확인했고, 57개는 저장소 내부 정의만 확인했다. `source_checked`는 **역사적 문헌에 그런 기술이 있음을 확인했다는 상태**이며 경험과학적 예측 검증이나 판본 전체 교감 완료를 뜻하지 않는다. 생활 적용 159개는 편집자의 조건부 예시다. 개별 의미의 전거가 부족한 60일주, 일부 신살·귀인, 영역별 상세 해석은 보류다. **전체 해석 완성도는 PARTIAL**이다.

새 자료는 [sajuFoundationKnowledge.ts](../../../src/lib/report-knowledge/sajuFoundationKnowledge.ts), [타입](../../../src/lib/report-knowledge/sajuFoundationKnowledgeTypes.ts), [출처 레지스트리](../../../src/lib/report-knowledge/sajuFoundationSources.ts)에만 존재한다. 기존 DB를 덮어쓰거나 기존 타입을 바꾸지 않았다. 신뢰 수준·전통 해석·현대 예시·적용 조건·금지 조건·차이·기존 참조·보류 사유를 분리했다. 새 파일에는 계산식·가중치·근거 생성 함수·네트워크 접근이 없다.

## 작업 기준과 보호

- Base: `v4/release-technical-stabilization-01`, `be4054671d166b3a11127c5bf013b77eab5cd919`.
- 작업: `v4/foundation-saju-knowledge-expansion-01`, `/private/tmp/gyeol-foundation-saju-knowledge-expansion-01` 독립 worktree.
- 원본 checkout은 `v4/annual-editorial-quality-fix-01`, `c048218cc5961e0f53a1deab2603511e17559fc3`였다. 해당 checkout을 변경하지 않고 지정 SHA에서 새 worktree를 생성했다.
- 원본 dirty 상태: `.gitignore`, `AGENTS.md` 수정 + `supabase/.temp/` 미추적 9개, 총 11개 파일. 작업 시작과 종료의 파일 SHA256·Git 상태·HEAD·브랜치를 비교한다.
- 실제 확인된 기존 worktree는 11개였다. 전부 보존 대상에 포함했다. 기존 문서/사용자 AGENTS의 범위·보호·Production 금지 지침을 확인했다.
- reset/restore/stash/clean, master 변경, Production 배포, DB·결제·환불·환경변수·이벤트 변경을 수행하지 않았다. 원본 환경 파일을 새 worktree에 복사하지 않았다.

## 기존 자료 전체 목록과 수량

[existing-inventory.json](existing-inventory.json)은 아래 **739개 레코드 각각의 ID·별칭·필드·A~J 누락 상태·SHA256**을 보관한다. 상수, 27개 신살 규칙, 14개 V4 구조 규칙, 원생 관계 미지원 목록도 담았다. `dayPillarProfiles` 10개와 별도 60일주 DB를 혼동하지 않는다.

| 기존 레지스트리 | 수량 | 내부 분류별 수량 |
| --- | ---: | --- |
| knowledge | 77 | day_master: 10, day_pillar: 12, element_balance: 5, five_element: 5, nobleman: 7, sinsal: 15, special_pattern: 13, ten_god: 10 |
| taxonomy | 124 | day_pillar: 60, element: 10, gwiin: 12, sinsal: 10, structure: 10, ten_god: 10, twelve_sinsal: 12 |
| dayPillars | 60 | uncategorized: 60 |
| branches | 12 | uncategorized: 12 |
| shinsal | 27 | CHARM: 2, INTENSITY: 1, MOVEMENT: 1, NOBLE_HELP: 6, PRECISION: 1, RELATION: 2, SOCIAL_VISIBILITY: 1, STRUCTURAL: 1, TWELVE_SHINSAL: 12 |
| materials | 188 | uncategorized: 188 |
| depth | 140 | dayMaster: 10, dayPillar: 60, element: 15, marker: 31, structure: 14, tenGod: 10 |
| legacyProfiles | 10 | uncategorized: 10 |
| v4YinYang | 2 | uncategorized: 2 |
| v4Elements | 5 | uncategorized: 5 |
| v4Stems | 10 | uncategorized: 10 |
| v4Branches | 12 | uncategorized: 12 |
| v4TenGods | 10 | uncategorized: 10 |
| v4Stages | 12 | uncategorized: 12 |
| v4Stars | 27 | uncategorized: 27 |
| v4Structures | 14 | uncategorized: 14 |
| v4Relations | 9 | uncategorized: 9 |

원천·계산 조사 경로:

- `src/lib/report-knowledge/sajuKnowledgeBase.ts`, `sajuKnowledgeTypes.ts`: 77개 기존 정의·태그·분량 재료. 10일간·10십성·5오행 및 5균형 항목, 13패턴, 15신살, 7귀인, 12일주. 출처/판본/검토 상태의 전용 필드가 없다.
- `sajuFeatureTaxonomy.ts`, `sajuFeatureTypes.ts`: 124개 feature. 타입에 day_master/twelve_life_stage/relation이 선언되어 있어도 해당 taxonomy에 그 범주의 레코드가 존재한다는 뜻은 아니다. 60일주는 별도 DB와 중복 지원한다.
- `sajuDayPillarKnowledge.ts`, `sajuBranchSymbolKnowledge.ts`: 60일주·12지지 의미/생활 재료. `sajuComputedFactsTypes.ts`, mapper/extractor/extractionRules는 검출·별칭 투영과 지식 존재를 구분하는 근거다.
- `src/lib/saju/constants.ts`, `types.ts`, `tenGods.ts`, `relations.ts`, `shinsalConstants.ts`, `structureAnalysis.ts`: 계산 결과와 실제 상수·판정 지원. 십성과 지장간의 관계 산출은 여기의 기존 규칙을 그대로 따른다.
- `dayPillarProfiles.ts`: 기존 상세 프로필은 10개. 이 숫자가 60일주 지식 전체 수량은 아니다.
- `sajuPillarFeaturePlacement.ts`: 십이운성 10일간×12지지 **표시 투영**. `SajuCalcResult`의 직접 필드와 구별한다. Book 부록에는 `comprehensiveBook.ts`의 12개 뜻풀이도 있다.
- `src/lib/interpretation-v4/foundationYinYang.ts`, `foundationElements.ts`, `foundationPillars.ts`, `foundationTenGods.ts`, `foundationTwelveStages.ts`, `foundationShinsal.ts`, `foundationRelations.ts`: 이미 존재하는 현대 의미·축·가중치 자료다. 조사·digest 고정만 했고 수정하지 않았다. 가족별 감쇠는 `foundationShinsalFamilies.ts`에서 파생되므로 독립 지식으로 중복 계수하지 않았다.
- `materialRegistry.ts`, `materialDepth.ts`, `structureRules.ts`, `structureMaterials.ts`: 기존 재료 목록과 내부 참조를 조사했다. 내부 `sourceRefs`와 계산 신뢰도를 외부 문헌 출처로 승격하지 않았다.
- `docs/ssot/02_SAJU_CALC_SPEC.md`, `06_SAJU_ANALYSIS_DEPTH_SPEC.md`, `docs/product/v4/MYEONGLI_STRUCTURE_PHASE2.md`: 기존 계산·해석 원칙과 제한을 확인했다. 과거 DRAFT 문서의 범위와 최신 런타임의 지원 범위는 구분한다. 기존 문서가 링크한 다른 외부 판본을 이번에 열람했다고 주장하지 않는다.

## 계산 지원 / 자료만 존재하는 범위

| 분류 | 실제 지원과 제한 |
| --- | --- |
| 음양·오행·천간·지지·일간·일주 | 기존 `SajuCalcResult`/상수에서 원생 지원. 60조합 목록 완전. 개별 60일주 성격의 문헌 검증은 별도 문제다. |
| 십성 | 일간 대비 생극·음양으로 10종 산출. 원국·대운·세운 출처는 별도. 기존 의미/가중치는 변경 없음. |
| 지장간 | 12지지, 총 28개 저장 천간. MAIN/SUB/MINOR 가중치 0.6/0.3/0.1은 현행 프로젝트 계약이며 고전의 확률이 아니다. |
| 십이운성 | 별도 표시 투영 10×12. 건록=臨官 표시와 建祿 격국을 구분한다. |
| 신살·귀인 | 원생 metadata/rule은 27개. 같은 이름의 망신·역마 등 서로 다른 기준을 보존한다. 귀문·원진·괴강·양인·공망·재고·금여·암록은 추가 feature 투영 경로가 있어 `projection`으로 구분했다. 문곡·복성·천의·천문 등은 자료의 존재를 원생 계산 지원으로 오인하지 않는다. |
| 구조 | 기존 원생 타입은 패턴 코드 14종을 선언하지만 `detectStructurePatterns`의 실제 push는 11종이다. 강약은 별도 결과다. V4의 14개 구조 후보 layer는 원생 휴리스틱과 다르다. 이번에 어느 것도 변경하지 않았다. |
| 관계 | 원생 `relations`는 천간합·지지합·지지충. `RELATIONS_WITHOUT_NATAL_PRODUCER`의 삼합·반합·형·파·해는 의미 레지스트리가 있어도 원생 원국 producer와 다르다. 궁합/시간 흐름의 다른 생산자까지 없다고 주장하지 않는다. |
| 위치 | 연·월·일·시 4자리. 시각 미상이면 시주를 가정해 해석하지 않는다. |

신규 항목의 `support`는 **기존 계산/투영의 존재를 설명하는 메타데이터**다. 신규 자료가 런타임에서 사용된다는 뜻이 아니다. 165 native / 32 projection / 16 knowledge_only로 표시했지만, **213개 전부 현재 런타임 미연결**이다.

## 누락 조사 A~J와 보강 방식

| 기준 | 기존 자료에서 확인한 부족 | 이번 보강 / 남은 제한 |
| --- | --- | --- |
| A 기본 정의 | 일간/성격 재료와 기본 간지 분류가 여러 파일에 분산 | 전체 유한 분류를 목록화하고 독립 정의·출처를 추가. 57개 내부 정의는 외부 미검증으로 표시 |
| B 전통/현대 분리 | 같은 객체에 상징·성격·직업 재료가 함께 존재 | `definition`, `traditional`, `editorial` 분리. 편집자의 예시는 전통 사실로 표시하지 않음 |
| C 긍정 | 기존 positive 필드는 있으나 독립 전거가 없음 | 56개 항목에 조건부 긍정 관점. 천간에는 문헌의 긍정 조건 별도 보관. 빈 필드의 심층 전통 의미는 보류 |
| D 주의·과용 | 일반적인 주의 문장의 반복과 과용/부족의 구분 한계 | 별도 caution/excessOrDeficit·금지 조건. 비어 있는 경우 manifest에 deferred |
| E 8개 생활 영역 | 여러 태그/주제에 분산, 결혼/학업 등의 독립 근거 불명 | 각 영역 상태를 전 항목에서 표시. 159개 현대 조건부 예시만 채움. 1,545개 영역 칸은 보류 |
| F 적용 조건 | 문장이 있다는 것과 성립 조건 검증은 별개 | 월령·강약·출처·실제 계산/생활 상황 조건. 부족한 개별 성립 조건은 보류 사유에 명시 |
| G 금지 해석 | 일부 avoidClaims만 있고 저장소마다 구조가 다름 | 모든 신규 항목에 doNotApply. 재물·혼인·건강·사고·과거 경험 단정 금지 |
| H 차이 | 유사 이름/동일 한글의 다른 개념 혼동 가능 | 음양≠성별/MBTI, 일간≠십성, 건록≠격국, 亡神≠亡身, 학당≠詞館, 지장간≠사령일수, 합≠합화 |
| I 중복 | 레지스트리 재사용과 일반 문구 반복 | exact 중복 목록과 별칭 충돌 기록. 기존 삭제 없음. 신규 정의 동일 문자열 0개, 공통 안전 조건은 지식 수로 추가 계수하지 않음 |
| J 출처 | 기존 sourceRefs는 대체로 내부 코드/재료 참조 | 실제 열람한 외부 8개와 내부 12개 출처 구분. 전사 경고 2개는 source_checked의 근거로 사용 금지 |

[coverage-manifest.json](coverage-manifest.json)에 **213개 항목별** 기본 정의 검토 상태, 전통 해석 aspect, 긍정/주의/과용 자료 상태, 8영역 filled/deferred, 적용·금지·차이·출처·보류 사유를 기록했다. 빈 칸을 같은 뜻 복제로 메우지 않았다.

## 영역별 신규 수량과 완성도

기존 각 DB의 수량은 위 표에 보존했다. 아래는 기존 항목을 대체한 수량이 아니라 **별도 연구 레코드 추가 수량**이다.

| 영역 | 신규 항목 | 문헌 확인 기본 정의 | 현대 예시가 있는 항목 |
| --- | ---: | ---: | ---: |
| 일간 | 10 | 10 | 0 |
| 일주 | 60 | 60 | 0 |
| 지지 | 12 | 12 | 0 |
| 오행 | 5 | 5 | 5 |
| 천간 | 10 | 10 | 10 |
| 지장간 | 12 | 0 | 0 |
| 원국 위치 | 4 | 4 | 4 |
| 간지 관계 | 9 | 6 | 0 |
| 신살·귀인 | 38 | 15 | 13 |
| 구조·해석 조건 | 29 | 14 | 0 |
| 십성 | 10 | 6 | 10 |
| 십이운성 | 12 | 12 | 12 |
| 음양 | 2 | 2 | 2 |

- 음양 2/2, 오행 5/5, 천간 10/10, 지지 12/12, 일간 10/10, 60일주 60/60, 십성 10/10, 십이운성 12/12, 지장간 12/12, 위치 4/4의 **유한 목록은 누락 없음**.
- 일간 10개는 해당 천간을 참조하며 같은 성격 문장을 다시 복사하지 않았다. 일간을 중심으로 나머지 기둥을 읽는 조건을 설명한다.
- 60일주는 정확한 간지·순번·일간·지지·지장간 참조를 확보했다. **개별 60일주의 전통 성격/재물/혼인 해석 60종이 검증 완료된 것은 아니다.** 기존 60종 편집 DB는 보존했다.
- 신살·귀인은 기존 목록을 이름/기준별로 통합한 36개 + 신규 亡神/詞館 2개 = 38개 연구 항목. 신살 전체에는 합의된 유한 전집이 없어 '모든 신살 완성'이라고 표시하지 않는다.
- 구조 29개는 기존 구조 이름/후보 24개와 미연결 일반 연구 개념 5개다. 격국·조후·용신의 완성된 판정 DB라는 뜻은 아니다.

| 현대 적용 영역 | 조건부 예시 | 추가 검토/보류 항목 |
| --- | ---: | ---: |
| 성격 | 26 | 187 |
| 직업 | 33 | 180 |
| 재물 | 15 | 198 |
| 학업 | 17 | 196 |
| 연애 | 16 | 197 |
| 결혼 | 15 | 198 |
| 가족 | 17 | 196 |
| 대인관계 | 20 | 193 |

159개 예시는 전통의 성패 예언을 현대 문장으로 포장한 자료가 아니다. 해당 행동/맥락을 당사자가 실제로 확인한 때 사용할 수 있는 질문·생활 적용이다. 의미 축이나 상품 원고로의 연결은 하지 않았다.

## 실제 보강 사례와 계보 차이

- **戊/辛/壬**: 滴天髓 주석의 산언덕/성벽 비판, 辛을 보석에만 고정하지 말라는 견해, 壬/癸를 강/비로 고정 분리하지 않는 견해를 보관했다. 기존 DB의 성벽·보석·강/비 비유는 삭제하거나 오답으로 단정하지 않았다.
- **지장간/인원사령**: 三命通會 卷二의 계절별 人元司事와 현재 고정 지장간 집합/weight는 서로 다른 표다. 淵海子平의 장간 노래와 집합을 대조했지만 출처 경고가 있는 전사만으로 외부 검증 완료라고 하지 않았다.
- **십성**: 생아/아생/극아/아극과 음양에 따른 관계 정의를 기존 엔진과 대조했다. 비견/겁재의 상세 전통 비유와 편재의 외부·공동 재물 비유는 별도 신뢰 가능한 판본 대조 전 내부 정의/보류로 남겼다. 정재와 편재의 계산 관계를 바꾸지 않았다.
- **십이운성**: 생애 순환의 비유와 실제 출산·질병·죽음의 사건을 분리했다. 두 문헌의 생왕/사절 단정 경계를 기록하고 건록/임관 별칭을 표시했다.
- **문창/학당**: 三命通會 卷三의 文昌貴 배치 구절과 현행 표 사이의 차이·전사 오자 가능성을 발견했다. 계산 오류라고 확정하지 않고 교감 보류로 기록했다. 학당은 납음/장생 등 논법 차이를 명시했다.
- **亡神/詞館**: 기존 십이신살 亡身과 구별되는 亡神, 학당과 구별되는 詞館의 기본 정의를 추가했다. 현재 계산 ID·증거로 발급하지 않는다.
- **월령·부억·한난·조습·통관**: 당장 생성기에 쓰이는지와 무관하게 문헌에 있는 해석 조건을 별도 축적했다. 새 검출 규칙이나 용신 엔진을 만들지 않았다.
- **합/충/형**: 합의 존재≠합화 성립, 일부 지지≠완전한 삼합 화국. 충·형만으로 흉사를 확정하지 않는 조건을 기록했다. 현대 원진/파의 세부 전통 뜻풀이는 출처 확보 전 보류다.

## 실제 확인한 외부 출처

고전 본문의 개념을 한국어로 재서술했다. 저작권 원문 대량 복제나 온라인 생활 운세 설명의 복사는 하지 않았다. 고전의 성별 위계·불륜·질병·사망·신분 단정은 고객 사실로 전용하지 않았다. 날짜는 2026-10-13이며 원본 판본의 전면 교감은 수행하지 않았다.

- `sm1` [三命通會 四庫全書本 卷一](https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷01): **text_accessed**. 原造化之始·論五行生尅·論支干源流·論十干名字之義
- `sm2` [三命通會 卷二](https://zh.wikisource.org/wiki/三命通會/卷二): **text_accessed**. 論地支·論人元司事·寄生十二宮·論遁月時·論年月日時·三合·將星華蓋·咸池
- `sm3` [三命通會 卷三](https://zh.wikisource.org/wiki/三命通會/卷三): **text_accessed**. 論金輿·驛馬·天乙貴人·天月德·太極貴·學堂詞館·劫煞亡神·羊刃·空亡
- `sm5` [三命通會 卷五](https://zh.wikisource.org/wiki/三命通會/卷五): **text_accessed**. 卷首 印食官財 명의·論正官·論偏官·官煞混雜
- `sm6` [三命通會 卷六](https://zh.wikisource.org/wiki/三命通會/卷六): **transcription_warning**. 目錄·魁罡 등 전반부를 열람. 十干十二年生大貴人例 뒤에 以下内容与书不合 경고를 확인. 이후 財/印/食/傷 본문은 검증된 전거로 사용하지 않음.
- `dt` [滴天髓 輯要 및 주석 전사](https://zh.wikisource.org/wiki/滴天髓): **text_accessed**. 通天論·天干論 甲~癸·地支論·體用論; 단일 상징 및 生死 단정 비판; 衰旺論·寒暖論·燥濕論·月令論·通隔論·清濁論·順反論·眾寡論
- `yh` [淵海子平 온라인 전사](https://zh.wikisource.org/wiki/淵海子平): **transcription_warning**. 基礎 및 又地支藏遁歌를 열람. 검증된 전통 사실의 단독 출처로 사용하지 않음
- `aks` [한국민족문화대백과사전 사주](https://encykorea.aks.ac.kr/Article/E0025957): **text_accessed**. 사주·일간·간지·십이운성·대운·세운의 개념 소개

`sm6`는 후반에 원서와 내용이 맞지 않는다는 자체 경고가 있고, `yh`는 페이지 자체의 출처 불명/미검증 경고가 있다. 이 둘을 단독 근거로 삼은 `source_checked` 문장은 **0개**다. 문헌 간 차이를 임의로 하나의 정답으로 통합하지 않았다. 세부 문장별 locator와 검토 수준은 데이터 파일/manifest에서 확인할 수 있다.

## 중복 정리 결과

[knowledge-duplication.json](knowledge-duplication.json)에 기존 공통 별칭 **재성/관성/인성** 충돌 3군, 재고귀인·망신·역마 등의 중복 이름, 20자 이상 의미/편집 재료의 동일 문자열 **558군**을 기록했다. 일부는 레지스트리 재사용에 따른 의도적 중복이다. 이 수치는 의미 중복의 자동 확정 판정이나 558개의 결함이라는 뜻이 아니다.

기존 ID·별칭·자료를 삭제하지 않았다. 신규 ID는 기존 ID를 재사용하지 않으며 별칭은 **분류 내부에서 유일**하다. 일간은 천간을 참조하고 일주는 일간/지지/지장간을 참조한다. 같은 문장을 복사해서 의미 수를 늘리지 않았다. 신규 기본 정의의 exact 중복은 0개다. 조건·금지 문장의 공통 사용은 안전 메타데이터이며 독립 지식으로 계수하지 않는다.

## 보류 자료와 후속 DB 작업

1. 60일주별 개별 심층 해석의 신뢰할 수 있는 판본·조건 확보. 기존 편집 자료가 문헌 자체인 것처럼 승격되지 않도록 한다.
2. 비견/겁재 및 재·인·식·상의 세부 전통 의미에 대한 경고 없는 독립 판본 교감. 편재의 외부 재물 비유도 포함.
3. 신살·귀인의 계보별 성립 기준: 문창 표의 차이, 학당/납음의 기준, 양인 음간 인정 여부, 고신·과숙·귀문·홍염·현침·천문·문곡·복성·천의 등 개별 전거 보강.
4. 지장간 표·사령일수·가중치의 계보 대조. 현행 상수를 고치거나 사령일수와 합산하는 작업은 금지 범위다.
5. 위치×십성×지지, 한난조습·통근·투간·격국 성립/파격·용신 등 상세 조건의 추가 교감. 미래 원고 연결과는 별도 승인·검증이 필요하다.
6. 8개 생활 영역의 1,545개 deferred 상태는 근거/조건 확보 전 유지한다. 가족·건강·결혼·재물의 단정적 결과를 채워 넣지 않는다.
7. 다른 의미 사이의 **의미적** 중복은 문헌과 사람이 추가 검토해야 한다. exact 문자열 검사만으로 의미 동등성을 확정하지 않는다.

현재 `knowledge_only`로 표시한 자료는 다음과 같다. 이 목록 외의 native/projection 메타데이터 항목도 신규 데이터 파일 자체는 모두 런타임에 미연결이다. 전체 213개 미연결 목록은 coverage manifest의 entries다.

- `foundation:shinsal_gwiin:cheonmun` — 천문성
- `foundation:shinsal_gwiin:mungok` — 문곡귀인
- `foundation:shinsal_gwiin:bokseong` — 복성귀인
- `foundation:shinsal_gwiin:cheoneuiseong` — 천의성
- `foundation:shinsal_gwiin:wangshen` — 망신(亡神)
- `foundation:shinsal_gwiin:ciguan` — 사관(詞館)
- `foundation:structure:season_command` — 월령
- `foundation:structure:support_restraint` — 부억
- `foundation:structure:temperature` — 한난
- `foundation:structure:moisture` — 조습
- `foundation:structure:mediation` — 통관
- `foundation:relation:samhap` — 지지 삼합
- `foundation:relation:hyeong` — 지지 형
- `foundation:relation:hae` — 지지 해
- `foundation:relation:banhap` — 지지 반합
- `foundation:relation:pa` — 지지 파

MBTI·Fusion·상품용 phraseSeeds/표현 재료 제작, 근거 연결, 후보 선택·상품 원고 생성기는 후속 작업으로 시작하지 않았다.

## 기존 계산·원고·Book 보존

- 기존 추적 소스/설정/테스트/고정 fixture는 수정 0개. 변경은 신규 파일만이다.
- 기존 `sixProductIntegration.test.ts` **64/64 PASS**: 62개 실제 생성과 2개 기존 정책 거절 사례. 고정 lock 대비 계산·불변 근거·draft·evidence·narrative·Fusion integration·Book·snapshot digest와 페이지 구조가 일치한다.
- 위 검증에서 신규 저장본 owner/shared 재열람, 기존 6상품 저장본 재열람, 양쪽 인물 십이운성 부록의 기존 뜻풀이 일치를 확인했다. 실제 고객 DB나 Book은 읽거나 재생성하지 않았다.
- 런타임 소스 전체에서 새 DB import/export/dynamic load/상수명 참조가 없음을 검사한다. 기존 타입/별칭/점수/계산 ID·엔진/만세력/MBTI/Fusion·생성기·Book 발행 코드는 그대로다.
- 원본과 기존 11개 worktree의 파일 SHA256·HEAD·브랜치·Git 상태가 작업 전후 일치한다. 독립 worktree의 의존성 심볼릭 링크와 build 산출물은 Git에 포함하지 않는다.

## 검증

실행 환경: Node v25.9.0, npm 11.12.1, Next 16.2.4, TypeScript 5.9.3, Vitest 4.1.5. 원본 설치 의존성의 node_modules를 재사용했고 운영 환경 파일은 사용하지 않았다.

- 신규 foundation 테스트 12개: 유한 목록, ID/별칭, 출처 검토 수준, 기존/상호 참조, 지장간 집합, 해석/예시 분리, 보류/계보 차이, 미연결, inventory/coverage/중복 manifest.
- 기존 지식/계산 테스트 69개 + 신규 12개 = **81/81 PASS**.
- 기존 6상품 계산/근거/원고/Book 보존 **64/64 PASS**. 총 **145/145 PASS**, 실패/skip 0개. 전체 테스트 suite를 실행했다고 주장하지 않는다.
- strict TypeScript `tsc --noEmit --incremental false`: **0 diagnostics**. 과거 390건은 이 기준 SHA에서 이미 안정화된 값이므로 이번 변경의 기준선으로 혼용하지 않았다.
- `npm run lint`: **PASS**, 신규 warning/error 없음.
- `npm run build -- --webpack`: **PASS**, 47/47 static pages 및 trace 완료. NFT/신규 경고 0개. 기본 Turbopack build 성공을 주장하지 않는다.
- 첫 sandbox build는 Google Fonts DNS 접근 실패(`fonts.googleapis.com ENOTFOUND`)로 중단됐다. 소스/설정 변경 없이 네트워크 접근이 가능한 승인된 환경에서 동일한 Webpack build가 성공했다. 폰트 대체/검사 우회 없음.
- build flags: `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0`. 기존 오프라인 검증과 같은 외부 연동 차단값이며 저장소 환경변수 설정을 수정하지 않았다.
- `git diff --check`: PASS. 최종 stage diff도 확인한다.

커밋된 로그는 줄 끝 공백/CR과 마지막 빈 줄만 정규화했다. 원래 실행 로그는 `/tmp/gyeol-foundation-saju-validation/`에 보존했다. 실행 결과는 [verification-results.json](verification-results.json) 및 logs에 기록한다. 문헌 열람/사람 검토와 자동 검증의 범위를 구분한다. 자동 테스트가 명리 예측의 실제 정확성이나 모든 신규 생활 해석의 판매 품질을 입증하지 않는다.

manifest 재검증:

```sh
./node_modules/.bin/vitest run tests/unit/report-knowledge/sajuFoundationKnowledge.test.ts
```

의도적인 자료 변경 후 manifest를 다시 생성하는 명시적 명령:

```sh
UPDATE_SAJU_FOUNDATION_MANIFEST=1 ./node_modules/.bin/vitest run tests/unit/report-knowledge/sajuFoundationKnowledge.test.ts
```

기본 실행은 파일을 쓰지 않고 고정 manifest와 비교한다. 기존 생성/Book lock은 갱신하지 않았다. 새 연구 DB를 연결하는 단계에 앞서 보류 자료와 출처 조건을 검토해야 한다. 이번 결과는 master 통합·Production 배포·판매 품질 승인으로 해석하지 않는다.
