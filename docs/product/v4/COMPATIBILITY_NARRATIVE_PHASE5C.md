# V4 Phase 5C — Compatibility Narrative

기준: `47964d05471fd0d53f09156a2677e8f85cc741fa` · `v4/rebuild` · 2026-10-01.

## 경계와 구현

| 모듈 | 역할 |
|---|---|
| `compatibilityEvidence.ts` | 기존 입력 adapter / 궁합 계산 / 방향 evidence / canonical natal table 재사용. V4에 필요한 사실만 투영 |
| `compatibilityCharacters.ts` | 각자의 기존 material packet + 실제 Fusion rule로 핵심 결·장점·단점·관계 방식 생성 |
| `compatibilityCategoryCopy.ts` | 7 category의 별도 현실 장면·갈등·화해·결말. 연애에는 독립성 중심의 별도 리듬 |
| `compatibilityInteractions.ts` | 상대 일간을 viewer로 읽는 A→B/B→A, MBTI pair 양쪽 출처와 검수된 장면 |
| `compatibilityHarmony.ts` | 실제 교차 관계 / 검증된 오행 상태 / 개인별 신살·귀인을 관계 안의 좋은 힘으로 번역 |
| `compatibilityComposer.ts` | offline structured narrative와 내부 근거 조립, 기존 read-only editorial guard 호출 |

- UI, report route, paid delivery, DB, OpenAI, 계산 엔진, 기존 V3 및 기존 V4 파일 변경 없음.
- source packet의 legacy 점수/카피/역할 미지정 값은 V4에 복사하지 않는다. V4 출력에는 score/grade/rating/rank/percent 필드도 없다.
- 점수 대신 실제 대화·생활·역할·좋은 영향으로 해석한다. exact/approximate/unknown 입력을 기존 adapter 그대로 통과한다.
- `parentChild`: A 부모 / B 자녀. `managerReport`: A 상사 / B 팀원. 새 V4 입력에는 `compatibility-fixed-ab-v1` 필수. legacy 저장본은 기존 reader 그대로 둔다.
- source rule과 실제 feature가 없는 Fusion은 만들지 않는다. MBTI 모름/미지원 조합은 일주 material로 정상 전개하며 유형을 추정하지 않는다.
- 원국 귀인 보유를 곧바로 “상대가 운명의 귀인”이라는 관계 사실로 승격하지 않는다. 자녀의 미래·직업·성공 예언 없음.
- 같은 일주 material은 두 번 출력하지 않고 두 사람의 공통 관찰로 묶는다. 같은 Fusion끼리는 첫 문단에서 차이를 강제하지 않고 닮은 출발점을 설명한다.

## 대칭과 방향

| 항목 | 처리 |
|---|---|
| A→B 십성 | B 일간을 viewer, A 일간을 target으로 기존 `getCrossTenGodRelation` 사용 |
| B→A 십성 | 위 방향의 정확한 반대 |
| 원본의 반합/삼합 대표 위치 | 기존 detector는 첫 일치 위치를 고르므로 입력 순서에 따라 대표 근거가 달라지는 현상 확인 |
| V4 순서 중립 투영 | 사람의 고정 식별자 순서로 **같은** detector를 호출. 실제 refs의 person/position/branch는 그대로 유지. 별도 계산식·룰·강도 점수 없음 |
| swap | 대칭 invariant와 선택 harmony/tension 동일. 대칭 category의 방향 본문은 정확히 교환. 역할형 category는 새 A/B 슬롯의 부모/상사 역할 유지 |
| 동일 관계 중복 | 같은 identity만 합침. 계산 위치와 provenance는 보존, 여러 위치를 점수처럼 합산하지 않음 |

현재 재사용하는 교차 producer의 지원은 육합/삼합/반합/충/해다. 교차 천간합·형·파·원진·방합은 이 producer에 없으므로 `unsupportedCrossRelations`로 명시했다. 원국 내부에서 계산된 표식을 두 사람 사이의 관계로 재활용하지 않았다. 이번에 새 궁합 계산기는 만들지 않았다.

## 본문 선택과 MBTI

- 각 person packet: `core`, `strength`, `shadow`, `relationship`, `fusion`, `proof`, `materials`.
- 고객 본문은 이 둘의 장점을 관계 장면에서 바로 쓰고, 긴 독립 인물 분석을 연속으로 붙이지 않는다.
- overlap 예: 현우 `intp-inquiry` × 소연 `esfj-help` → 검증 후 말하는 사람 / 반응과 챙김으로 마음을 전하는 사람.
- contrast 예: 유진 `enfp-alone` → 밝게 어울리지만 혼자 회복할 시간도 필요한 친구. 탐구/모임이라는 하나의 문장을 반복하지 않는다.
- complement는 기존 지원 조건이 성립할 때만 표현 통로로 읽는다. output-low를 강한 명리 영웅 근거로 승격하지 않는다.
- pair DB의 `sharedGround`, `friction`, `positiveInfluence`, `lovePattern`, `marriagePattern`, `repairStrategy`, `sourceCoverage`와 양방향 source refs를 보존한다.
- 검수된 pair scene 8종: INTP–ESFJ / ISTJ–ENFP / ISFJ–ENTP / ENTJ–INTP / INFJ–ESTP / ENTJ–ISTJ / ISFP–ENFP / INFJ–ISTP. 그 외 pair는 검수하지 않은 설명을 생성하지 않고 각자의 evidence-gated character와 실제 교차 근거로 전개한다. 전체 256조합의 수동 품질 인증을 주장하지 않는다.
- 오행 보완은 기존 Phase3의 **검증된** weighted high ↔ low만 상징적으로 연결. 시간 모름에서는 결핍을 단정하지 않는다.
- final은 category + 두 사람의 실제 선택된 행동/욕구를 포함. 이름만 바꾼 한 문장 결론을 7관계에 공통 적용하지 않는다.

## 전문 8건 수동 판정

초안과 최종 export를 읽어 검사했다. 자동 통과를 수동 평가로 대신하지 않았다. 초안에서 조사 오류, 반복되는 합·충 설명, 부모가 자녀에게 감정적 부담을 넘기는 듯한 표현, 홍염을 수고로 표현한 부조화를 수정했다.

| fixture | 입력 | 읽기 결과 | 판정 |
|---|---|---|---|
| 01 love | 현우 1992-12-14 22:30 INTP × 소연 1995-04-08 09:15 ESFJ | 검증/반응의 차이, 챙김, 홍염의 가까운 매력, 약속 충돌이 이어짐 | No issue |
| 02 marriage | 민재 1988-03-22 14:10 ISTJ × 서윤 1994-11-18 07:42 ENFP | 냉장고·장보기·개인 돈·가족 행사. 성실함과 새로움이 실제 생활의 보완으로 읽힘 | No issue |
| 03 parentChild | 예린 1984-09-27 13:30 ISFJ 부모 × 지우 2012-06-17 10:20 ENTP 자녀 | 질문/숙제/선택권. 보호와 자율성, 어른의 사과가 구체적. 역할 역전·자녀 미래 예언 없음 | No issue |
| 04 coworker | 서진 1990-07-18 05:30 ENTJ × 나영 1984-07-27 15:30 INTP | 빠른 수정과 이유 검증, 초안·발표·공 인정이 한 관계로 이어짐 | No issue |
| 05 managerReport | 도윤 1985-06-30 06:00 INFJ 상사 × 하린 2001-01-27 18:20 ESTP 팀원 | 긴 시야/현장 반응, 지시와 보고, 권력 차이를 팀원만의 숙제로 만들지 않음 | No issue |
| 06 businessPartner | 다은 1984-03-18 05:30 ENTJ × 준호 1986-05-12 11:20 ISTJ | 고객 약속·기여·비용·계약·종료 조건이 선명. 후반은 실무 합의 문체가 다소 우세 | Minor |
| 07 friendship | 지아 1997-08-05 시간 모름 ISFP × 유진 1999-12-06 01:30 ENFP | 취향·여행·새 친구·상담·비용. 유진의 외향성과 혼자 회복하는 반전이 함께 존재 | No issue |
| 08 love | 수아 1990-03-18 01:30 INFJ × 정우 1987-05-18 사시 approximate ISTP | 조용한 관심과 행동, 독립성 있는 친밀감. 후반 자유/혼자 시간의 의미 근접이 조금 남음 | Minor |

합계 **Blocker 0 / Major 0 / Minor 2 / No issue 6**. 8건의 headline/final 중복, exact sentence 중복, 12어절 장구절 재사용은 0. 이 수치는 해당 검수 cohort의 결과이며 모든 입력에서 문장이 절대 재사용되지 않는다는 뜻은 아니다.

01은 실제 `esfj-help`가 성립하는 4월 8일 계산을 사용했다. 인접한 4월 9일은 Fusion이 성립하지 않는 반례로 별도 테스트해 강제로 동일 캐릭터를 부여하지 않았다.

## 실제 문장

| 목적 | 예 |
|---|---|
| 첫 핵심 차이 | “현우님은 생각이 끝나야 말이 나오고, 소연님은 반응이 와야 마음이 놓입니다.” |
| 좋은 조화 | “민재님이 새로움을 전부 막지 않고 서윤님이 마무리를 떠넘기지 않으면, 생각만 했던 즐거움이 실제 하루가 됩니다.” |
| 갈등 | “설거지 하나를 놓고 싸우는데 지난 가족 행사까지 등장하면, 지금 다투는 것은 접시의 개수가 아닙니다.” |
| 동료 | “답을 늦추는 질문처럼 보여도 한번 짚고 나면 나중에 다시 할 일이 줄어듭니다.” |
| 오행 | 소연의 검증된 토 high / 현우 토 low → “흐트러진 일상을 붙잡는 꾸준함”과 만날 약속·작은 준비 |
| 방향 | 현우→소연 정관: 약속/책임을 의식하게 함. 소연→현우 정재: 시간/돈을 어디에 쓰는지 구체적으로 보게 함. 같은 문장으로 단순 복제하지 않음 |
| pair-specific final | “수아님의 생각을 마칠 시간과 정우님의 혼자 결정해볼 여지가 함께 남아 있을 때, 혼자여도 편한 두 사람이 굳이 함께 있고 싶은 이유가 생깁니다.” |

## 검증 / 재생성

| 검증 | 결과 |
|---|---|
| Compatibility 전용 | 51 tests / 3 files PASS |
| V4 전체 | 776 tests / 18 files PASS |
| 계산 / knowledge / table / V3 / V4 / compatibility generation / paid delivery 관련 regression | 2,911 tests / 145 files PASS |
| 기존 V4 출력 해시 | Comprehensive 12 / Career 8 / Love 8 그대로 |
| counterfactual | 같은 pair 7 category; 8 pair A/B swap; 같은 사주/MBTI 변경 3; 같은 MBTI/사주 변경 3 PASS |
| runtime coverage | 16 MBTI + 모름 × 7 category, 양쪽 모름, adjacent no-Fusion, 제거된 evidence suppression PASS |
| 정적 검사 | lint / build / diff-check PASS |
| 별도 TypeScript 검사 | 기존 V4 밖 진단 389개와 byte-identical. 새 진단 0; 전체 tsc가 clean이라는 뜻은 아님 |

```sh
V4_PHASE5C_EXPORT=1 pnpm test tests/unit/interpretation-v4
pnpm lint
OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
git diff --check
```

전문/packet: `/tmp/gyeol-v4-phase5c/index.md`, `01-love.md` … `08-love.md`, 각 `.json`, `inputs.json`, `category-counterfactual.json`, `person-counterfactual.json`, `cohort-qa.json`.

관련 신규 파일만 selective commit/push. `.gitignore`, `AGENTS.md`, `supabase/.temp/` 보존. master/Production 미변경. UI / Major / Annual 작업은 시작하지 않고 STOP.
