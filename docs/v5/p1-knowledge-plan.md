# P1 지식 DB 계획 — 현황 조사와 작성 배치

조사일 2026-10-28. 조사 방법: 서브에이전트 2개(V4 DB 전수, knowledge-v5 품질) + 엔진 타입 직접 확인. 글자 수는 한글 음절 기준.

## 1. V4 DB 현황

| 대상 | 경로 | 형식 | 항목 | 품질 판정 |
|---|---|---|---|---|
| 명리 런타임 | `src/lib/report-knowledge/sajuKnowledgeBase.ts` | TS | 77 (오행 5·과부족 5·십성 10·구조 13·신살 15·귀인 7·일간 10·일주 12) | 하. 토픽 문장이 템플릿이라 조사 오류("생산성가")·영어 누출("visibility, popularity…를 보는 신호") |
| 명리 일주 | `report-knowledge/sajuDayPillarKnowledge.ts` | TS | 60 | 중. 이미지는 있으나 60개 모두 같은 맺음 문장 |
| 명리 깊이 시드 | `interpretation-v4/materialDepth.ts` (+6 *Materials.ts) | TS | 140 요소 × 역할 14 | **상**. V4 명리 중 가장 구체적 ("남을 챙기면서도 정작 내 속마음은 쉽게 꺼내지 않습니다") |
| 명리 기초(오프라인) | `report-knowledge/sajuFoundationKnowledge.ts` | TS | 213 | 정의·출처는 좋음, 문장은 건조·유보형. 런타임 미사용 |
| MBTI 원본 | `docs/product/mbti/source/{16}.json` (2.5MB, 376k자) | JSON | 유형당 trait ~90(16영역), notablePairs 16×16=256 | **상**. "당신은 권위보다 논리를 먼저 보기 때문에, 틀린 지시 앞에서는 침묵이 쉽지 않습니다" |
| Fusion | `interpretation-v4/fusionRules.ts` | TS | 44 (+운 11) | **상**이나 적음. "다들 우물쭈물하면 결국 내가 순서를 정하고 있습니다" |
| Fusion 보완 | `interpretation-v4/fusionComplementRegistry.ts` | TS | 96 | 하. 축 설명형 추상문 |
| Fusion 구 | `report-knowledge/fusionKnowledgeBase.ts` | TS | 78 | 하. "X와 Y가 겹치면 …" 공식 |
| 상품별 | `interpretation-v4/*ReleaseMaterials.ts`, `majorMaterials.ts`, `annualSceneDetails.ts` | TS | 문자열 600+ | 중. 구체적이지만 길고 상담 말투("~해 보세요") |
| 궁합 7유형 | `interpretation-v4/compatibilityCategoryCopy.ts`, `report-knowledge/compatibilityCategoryReading.ts` | TS | 7×템플릿, 7×8 질문 | 중. 유형별 현실은 있으나 조언형 |
| 연구용 DB | `report-knowledge/foundation-deep/` (10 TS, 236,571자) | TS 배열 | 838 (applications 560, dayPillars 60, markers 38, tenGods 10 …) | 출처 엄격(808/838에 sourceRefs, 三命通會·協紀辨方書·KCI 논문 등 15 출처). 문장은 단편·유보문. 고객 문장 아님 |
| 기타 연구 | `report-knowledge/*-research` 24개 디렉터리 | TS | 939 파일 60MB | 런타임 소비 0. `research_not_customer_sentence` |

샘플 10개 인용은 서브에이전트 보고 원문 기준(위 표의 따옴표 문장이 그 일부). V4 문장의 공통 약점: 템플릿 반복, 유보형 어미, 조언 말투. 강점: 깊이 시드·fusionRules·MBTI 원본의 구체 문장.

## 2. knowledge-v5 (v1) 현황

- `src/data/knowledge-v5/` 2.6MB: feature 205(+alias 36), MBTI 16, 교차 200, 온톨로지 31차원, 상품 서사 6, source-index.
- 가족별: dayPillar 60, shinsal 24, element 20, structure 20, gwiin 12, twelveStage 12, branch 12, tenGod 10, dayMaster 10, stem 10, relation 9, tenGodFamily 5, other 1.
- 문장 품질: 행동 신호 846개 중 **진짜 장면은 30~40%**. 69%가 "~편입니다", 그림자 57%가 "~쉽습니다"로 끝나는 한 절짜리 성향문. 원인은 lint의 문장 60자·평균 40자 상한(스키마 90자보다 엄격)이 "상황→행동→결과" 구조를 막은 것.
- 좋은 예: 일간 계수 "다들 웃고 있을 때 한 사람의 웃음이 짧아진 걸 혼자 알아채곤 합니다", 상관 "그냥 질문했을 뿐인데 회의가 갑자기 조용해질 때가 많습니다".
- 나쁜 예: 충 "하던 방식이 막히면 아까워하지 않고 판을 엎고 새 선택지를 만드는 쪽입니다"(합충이 성격문으로 적힘), 편재 "돈을 묶어 두는 것만큼 돈을 써서 무엇을 넓힐지도 같이 생각하는 편입니다".
- 교차 200: 장면 문장은 데이터 중 최상. 두 번째 통찰 문장은 "타고난 X는 …, Y 성격은 …" 고정 공식. 점수는 태그 겹침 크기(경험 근거 아님). gwiin·relation 교차 0.
- 출처: sourceRefs 2,278개 중 v4:depth 917·foundation 510·taxonomy 454. 외부 고전 인용은 장 제목 수준. 사실상 내부 순환 참조.
- 유지: 온톨로지 31차원, alias 지도, lint 골격, cross-score.ts, source-index(내부 전용), product-narratives. 재작성: feature 문장 전부, MBTI 7영역 확장, 교차 통찰.

## 3. 엔진 사실 (id 정합)

`src/lib/saju/`: 천간·지지·십성은 한자 리터럴, 신살 27 코드(`ShinsalCode`), 오행 라벨 `WOOD_STRONG|WEAK|MISSING` 15, 음양 `YIN_HEAVY|YANG_HEAVY|BALANCED`, 구조 패턴 14, 십성 균형 `TEN_GOD_<FAMILY>_STRONG|WEAK` 10. 합충은 천간합·육합·충만 계산. **삼합·방합·형·파·해·십이운성·조후·공망은 엔진에 없다** → 지식은 쓰되 `engineSupport:false`, P2에서 엔진 확장.

## 4. 통합 방침

- 단일 소스 `src/data/knowledge-v5/` (JSON + `schema.ts` v2). 파일: `myeongri/<family>.json`, `mbti/<TYPE>.json`, `fusion/<batch>.json`, `timeline/{ganji,ten-god-period,badges,flow-rule,action-templates}.json`, `behavior-ontology.json`(7영역으로 확장), `product-narratives.json`(유지), `id-map.json`.
- id 규칙(엔진 정합): `stem:丁`, `branch:丑`, `dayPillar:丁丑`, `dayMaster:丁`, `tenGod:正官`, `tenGodBalance:OFFICER:STRONG`, `shinsal:HYEONCHIMSAL`(엔진 코드) / `shinsal:GONGMANG`(비엔진), `gwiin:CHEON_EUL_GWIIN`, `twelveStage:帝旺`, `relation:CHUNG`(짝은 variants), `element:WATER:STRONG|WEAK|MISSING|BALANCED`, `yinYang:YANG_HEAVY:FEMALE`, `climate:丁:winter`, `structure:WEALTH_HEAVY`.
- V4 DB·v1 데이터는 삭제하지 않는다. `id-map.json`에 old→new 매핑(V4 77+60+140, v1 205+36)만 둔다. 제거는 P3 이후.
- 스키마 상한: 장면 20~140자(1~2문장), 문장 90자, 설명문 220자. 평균 길이 상한 없음. 어미 강제 없음(존댓말 혼용). 금지 표현·용어 누출·중복은 유지·강화.

## 5. 가족별 작성량과 배치

장면 수 = 7영역 × 2 이상 = 항목당 최소 14.

| 가족 | 항목 | 비고 | 배치 |
|---|---|---|---|
| 천간 stem | 10 | 위치 뉘앙스 | A1 |
| 지지 branch | 12 | 위치 뉘앙스 | A1 |
| 일간 dayMaster | 10 | 기준 항목 1(정화) | A2 |
| 일주 dayPillar | 60 | 고유 이미지 필수, 중복 0 | B1~B5 (12개씩) |
| 십성 tenGod | 10 | 과다·부족은 strengthRules + tenGodBalance 10 | C1 |
| 십성 균형 tenGodBalance | 10 | 엔진 `TEN_GOD_*_STRONG/WEAK` | C1 |
| 신살 shinsal | 27 엔진 + 비엔진 ~8(공망·괴강·양인·원진·귀문·천문·음착양차·천라지망) | 12신살 포함 | D1~D3 |
| 귀인 gwiin | 6 엔진 + 6 비엔진(암록·복성·천의·금여록·문곡·재고) | | D3 |
| 십이운성 twelveStage | 12 | engineSupport false | E1 |
| 합충형해 relation | 8 종류 + variants 짝 ~44 | 위치 조합은 positionNuance | E2 |
| 오행 element | 20 (5 × STRONG/WEAK/MISSING/BALANCED) | WEAK·MISSING은 remedy 필수 | F1~F2 |
| 음양 yinYang | 7 (양과다·음과다 × 남/여/중립 + 균형) | | F2 |
| 조후 climate | 40 (일간 10 × 계절 4) | engineSupport false(월지→계절은 P2 한 줄) | G1~G4 |
| 구조 structure | 14 엔진 패턴 | | H1 |
| **명리 합계** | **≈260** | 장면 ≈3,700 | 약 22 배치 |
| MBTI | 16 | 7영역×3, 그림자 2, 통념 궁합 15, 직업 | M1~M4 (4개씩) |
| Fusion | 300+ (상위 60은 장면) | cross-score 재계산 후 상위 선정 | X1~X6 |
| Timeline 간지 | 60 (연·월) | | T1~T3 |
| Timeline 십성 | 10 × 연/월 | | T4 |
| 배지·흐름 규칙·행동 템플릿 | 배지 ~50, 규칙 1, 템플릿 ≥20 | 테스트 포함 | T5 (메인) |
| 연구 DB 추출 | foundation-deep 838 → 근거 문장·출처 | 메인 채택 | R1~R4 |

배치 운영: 각 서브에이전트(Opus)는 schema.ts + p1-gold-samples.md + 해당 가족의 V4 깊이 시드·연구 DB 발췌를 받고, 파일 하나를 쓰고, `pnpm exec tsx scripts/knowledge-lint.ts --only <file>`을 통과시킨 뒤 보고한다. 메인은 가족마다 20%를 읽고 미달 시 재작성 지시.

## 6. 결정 기록
- (P1-D1) 장면 길이 상한을 60→140자로 올린다. 근거: v1 품질 저하의 직접 원인.
- (P1-D2) id는 엔진 코드·한자 리터럴에 맞춘다. 근거: 브리프(P2)가 변환표 없이 바로 찾게.
- (P1-D3) 합충형해 짝(子午충 등)은 종류 항목의 `variants`로 둔다. 근거: 짝 44개 × 14 장면은 정보량 대비 비용 과다. 짝마다 이미지·한 줄은 가진다.
- (P1-D4) v1 데이터 처리와 조후 범위는 사용자 결정(아래 질문).
