# V4 명리 구조 layer · Phase 2

기준 `e07ec2fea3356eb5e14a4487614b7ff8454b20b6`, branch `v4/rebuild`.

**별도 결정적 해석 후보 layer**다. 기존 역법/4주/대운/세운/월운 계산, V3 runtime, MBTI 원본, 고객 UI, 결제/저장은 변경하지 않았다. UI/장문 composer/Production 연결 없음.

## 1. 구현과 계약

| 모듈 | 책임 |
| --- | --- |
| `src/lib/interpretation-v4/strength.ts` | 기존 확정 기둥·지장간을 위치별로 읽고 월지/뿌리/노출/생조·소모 교차 확인. 기존 시주 후보의 민감도 검사 |
| `structureTypes.ts` | `v4-structure-evidence-1`, 5단계 level, strong/supported/uncertain, 근거·연결·provenance |
| `structureRules.ts` | 14개 구조의 십성 조건, 최소 지원, 위치 연결, 보류 조건 명시 |
| `structureEvidence.ts` | 조건 평가, 실제 연결 graph, 미성립/불확실 이유. 조건 미달 구조명·seed 생성 안 함 |
| `structureMaterials.ts` | 14개 × 성격/장점/단점/일·돈/연애·관계/좋은 패/이미지 = 98개 material 필드 |
| 기존 V4 5개 모듈 | 새 evidence/material 읽기, strong만 Fusion·fortune으로 승인. core 버전 `v4-fusion-core-2` |

`buildMyeongliStructure(calculation)` → `strength`, `candidates`, `assessments`.

- `strength`: level, supportingEvidence[], weakeningEvidence[], confidence, provenance, hourSensitivity. **score 없음**.
- `candidates`: 검증된 조건이 성립한 strong/supported 후보만. supportingEvidence에 위치/천간/십성/가중/source, connections에 생/극/인성→일간 방향 유지.
- `assessments`: 14개 모두의 strong/supported/uncertain/suppressed와 내부 이유. 불확실/미성립에는 고객 구조명·문장 없음.
- `strong`은 이 버전의 **규칙 지원 수준**이며 과학적 성격 확률이나 고전 모든 학파의 확정 판정이 아니다.
- 흐름의 성립과 일간 강약은 별도다. 예를 들어 일간 강약이 경계여도 식상→재성 연결 자체는 확인할 수 있다. 재다신약은 반드시 강약 판정까지 명확해야 한다.

## 2. 신강·신약: 채택한 제한적 규칙

### 재사용 / 계산하지 않는 것

| 입력 | 처리 |
| --- | --- |
| `SajuCalcResult.pillars` + `BirthTimeCalculationContext` | 버전/생일/입력 시간 정밀도·구간/확정 기둥·candidate 일치 확인. legacy context가 없으면 uncertain |
| 기존 `getTenGod`, `HIDDEN_STEMS` | 천간 1, 지장간 MAIN 0.6 / SUB 0.3 / MINOR 0.1의 **기존 가중** 재사용. 지지 본기와 지장간을 두 번 더하지 않음 |
| 일간 자기 자신 | 일간 천간을 비견 1표로 세지 않음. 일지의 실제 지장간은 포함 |
| 월지 | 본기의 십성 관계로 생조(비겁/인성) 또는 설기·극(식상/재성/관성) 구분 |
| 지지 기반 | 동일 오행 통근과 인성의 생조 기반을 별도 evidence로 표시. 본기/여기 가중·위치 보존 |
| legacy `structureAnalysis`와 분포 label | 신뢰 입력으로 쓰지 않음. legacy score/distribution을 조작해도 같은 기둥이면 V4 판정 동일 |
| 합·충 | 기존 `analyzeRelations` 재사용. 합화·충 해소를 새로 계산하지 않으며, 있으면 강약 confidence는 supported 이하 |

월령 하나로 강약을 결정하지 않고 뿌리와 다른 기둥을 함께 본다는 참고 원칙은 [《子平真詮》 원문 〈論十干得時不旺失時不弱〉](https://www.donglishuzhai.net/chapter/3719.html)를 확인했다. **아래 숫자는 원문 공식이 아니라 보수적인 V4 선택 경계**다. 계절의 한난조습·절입 후 인원사령 일수·조후·합화·종격은 미구현이며 이를 완성된 고전 강약 엔진이라고 부르지 않는다.

### 명시적 판정 경계

아래 비율은 내부에서 동일 원국의 비겁+인성 가중 / 전체 십성 가중을 비교하는 보조 조건이다. 고객 점수로 반환하지 않는다.

| level | 모두 필요한 조건 |
| --- | --- |
| strong | 생조 비중 ≥0.58, 의미 있는 생조 위치 ≥2, 그리고 (월지 본기 생조 + 동일 오행 지지 기반 ≥1) 또는 (동일 오행 기반 ≥2 + 생조 천간 노출 ≥1) |
| veryStrong | 위 조건 + 비중 ≥0.8 + 월지 생조 + 동일 오행 본기 뿌리 ≥2 + 생조 천간 노출 ≥1 |
| weak | 비중 ≤0.30, 월지 본기가 생조 아님, 동일 오행 본기 뿌리 0, SUB 이상 동일 오행 뿌리 ≤1, 의미 있는 소모 위치 ≥3, 소모 천간 노출 ≥1 |
| veryWeak | 위 조건 + 비중 ≤0.15 + SUB 이상 동일 오행 뿌리 0 + 생조 천간 노출 0 |
| balanced / supported | 비중 0.42–0.58, 의미 있는 생조·소모 근거가 양쪽에 존재 |
| balanced / uncertain | 그 외 경계/상충. balanced를 확정 중화로 읽지 말 것 |

같은 원본 atom을 ‘월지/뿌리/숨은 기운’에서 설명할 수 있지만 투표 수나 독립 가중으로 다시 합산하지 않는다. 합·충으로 해석이 달라질 여지가 있으면 strong confidence를 내리지 않는다.

### 출생시간 unknown

- 없는 시주를 만들어 현재 원국으로 넣지 않는다. 기존 역법의 `candidates.hour`만 **가정별 민감도 검사**에 사용한다.
- 모든 후보에서 강약 방향이 같고 불확실 판정이 없어야 weak/strong + supported. 그 외 balanced + uncertain.
- 출력 supporting/weakening evidence는 확정 기둥만 포함한다. 가정의 시주를 고객 사실로 바꾸지 않는다.
- unknown의 구조는 모든 시주 후보에서 유지되어도 supported 상한. 재다신약·무인성·무식상은 이번 버전에서 unknown이면 항상 보류한다.
- approximate라도 시간 구간 전체의 네 기둥이 확정된 경우에만 complete 취급한다.

## 3. 주요 구조의 실제 조건

공통 ‘유의미한 군’: 가중 ≥1.2, **서로 다른 위치 ≥2**의 본기/천간 근거, (투간 + SUB 이상 지지 기반) 또는 본기 ≥2. 가벼운 숨은 십성 하나나 같은 기둥의 중복만으로 승인하지 않는다.

| 구조 | 연결/추가 조건 | 주요 suppress |
| --- | --- | --- |
| 재다신약 후보 | strong confidence의 weak/veryWeak + 재성 우세(가중 ≥2, 전체 ≥34%, 복수 위치·투간·기반) + 재성 ≥생조 가중의 1.5배 + 확정 시주 | 신강/경계·합충 미검토·미약한 재성·시주 미상 |
| 식상생재 | 식상/재성 각각 유의미, 같은 기둥 또는 인접 위치에 생 관계, 최소 한쪽 천간 노출 | 인성의 유의미한 간섭, 연결 없는 공존 |
| 재생관 | 재성/정관 각각 유의미 + 인접 생 관계·최소 한쪽 노출 | 편관 또는 상관의 유의미한 혼입. **편관만 있는 재생살은 이 rule에 포함 안 함** |
| 관인상생 | 정관→인성 연결 + 같은 인성이 일간과 인접하여 생조 | 편관 혼입, 재극인, 상관 간섭, 끊긴 경로 |
| 살인상생 | 편관→인성 연결 + 같은 인성→일간 | 정관 혼입, 재극인, 식상 제살 간섭, 끊긴 경로 |
| 상관견관 | 상관/정관 각각 유의미 + 양쪽 투간·기반 + 인접 천간의 실제 극 관계 | 숨은 공존, 인성·재성의 유의미한 완충, 노출 경로 없음 |
| 관살혼잡 후보 | 정관/편관 각각 유의미 + 양쪽 투간·지지 기반 | 가벼운 숨은 혼입, 인성·식상 완충 |
| 비겁/식상/재성/관성/인성 강함 | 각각 가중 ≥2, 전체 ≥34%, 독립 복수 위치·투간·지지 기반 | 단일 위치/노출만 있거나 상대적 우세 아님 |
| 무인성/무식상 범위 관측 | 확정 4주 천간·지장간 모두 해당 군 0 | 시간 모름, 미약하더라도 존재. supported 상한·hero 금지 |

주요 흐름의 supporting 위치가 기존 천간합/육합/충에 걸리면 supported로 남겨 후속 검토한다. 제화가 완성됐다고 새로 추정하지 않는다. strong만 Phase 1 overlap/fortune에 들어간다.

## 4. 실제 날짜 fixtures / coverage

양력·남성·정확한 KST. 1984–2007년 × 12개월 × 6/18/27일 × 12시간대 = **10,368건**. 23:30의 일주도 기존 역법을 그대로 따른다. 출생일에 맞추기 위해 계산식을 바꾸지 않았다.

| 구조 | strong | supported | uncertain | suppressed | strong 실제 예 |
| --- | ---: | ---: | ---: | ---: | --- |
| 재다신약 후보 | 47 | 0 | 1,384 | 8,937 | 1984-03-18 05:30 |
| 식상생재 | 183 | 715 | 170 | 9,300 | 1984-01-18 05:30 |
| 재생관 | 25 | 247 | 14 | 10,082 | 1990-03-18 01:30 |
| 관인상생 | 32 | 158 | 50 | 10,128 | 1984-09-27 13:30 |
| 살인상생 | 57 | 128 | 67 | 10,116 | 1984-07-27 15:30 |
| 상관견관 | 1 | 9 | 8 | 10,350 | 1999-12-06 01:30 |
| 관살혼잡 | 1 | 21 | 4 | 10,342 | 1986-01-18 15:30 |
| 비겁 강함 | 362 | 1,016 | 0 | 8,990 | 1984-08-18 21:30 |
| 식상 강함 | 303 | 1,089 | 0 | 8,976 | 1984-01-18 01:30 |
| 재성 강함 | 263 | 1,170 | 0 | 8,935 | 1984-01-06 15:30 |
| 관성 강함 | 162 | 1,098 | 0 | 9,108 | 1984-01-06 21:30 |
| 인성 강함 | 357 | 1,073 | 0 | 8,938 | 1984-04-27 07:30 |
| 무인성 범위 관측 | 0 | 454 | 0 | 9,914 | strong 승격 안 함 |
| 무식상 범위 관측 | 0 | 416 | 0 | 9,952 | strong 승격 안 함 |

각 구조의 7개 material 필드 모두 존재한다. supported/uncertain 수를 strong coverage로 합산하지 않는다. **위 빈도는 선택한 테스트 표본에서의 코드 출력이며 실제 인구 비율이나 명리 정확도의 실증 수치가 아니다.** 드문 상관견관/관살혼잡을 더 출력하려고 조건을 느슨하게 하지 않았다.

| 강약 실제 예 | 출력 |
| --- | --- |
| 1986-06-18 09:30 | veryWeak / strong confidence |
| 1985-05-06 09:30 | weak / strong confidence |
| 1984-03-06 09:30 | balanced / supported |
| 1984-10-06 17:30 | strong / strong confidence |
| 1987-05-18 09:30 | veryStrong / strong confidence |
| 1985-05-18 17:30 등 4개 경계 fixture | balanced / uncertain |
| 1985-03-06 23:30 | strong / supported + 재성 강함, **재다신약 아님** |

전체 강약 strong confidence 478건, supported 4,920건, uncertain 4,970건. unknown 별도 5개 날짜 및 기존 경계 역법 회귀 포함.

## 5. 고객 seed / Phase 1 연결

| 사례 | 실제 출력 / 연결 |
| --- | --- |
| 재다신약 | “돈과 현실적인 결과를 크게 의식하는데, 그만큼 스스로를 몰아붙이기 쉬운 구조입니다.” |
| 상관견관 | “틀린 걸 보면 그냥 넘기지 못합니다.” / “윗사람에게도 그대로 말해서 부딪힐 수 있습니다.” |
| 1984-03-18 05:30 ENTJ | 재다신약 + `money.high_earning_orientation`: “작게 해놓고 만족하기보다 제대로 남기고 싶습니다. 다만 하고 싶은 일의 크기만큼 혼자 맡는 일도 커지면, 쉬는 날까지 다음 일을 생각하게 됩니다.” |
| 1986-06-18 19:30 ENTJ | 재다신약 + 장성 + 반안: “현실 성과를 향한 욕심에 앞에 서고 인정받는 힘이 함께 있습니다. 사람과 시간을 잘 나눠 쓰면 혼자보다 큰 판을 키워갈 여지가 있습니다.” |
| 1984-03-18 13:30 ENTJ | 식상생재 + 재고귀인: “솜씨를 결과로 바꾸는 힘에 쌓아가는 복이 더해집니다. 만든 것이 돈과 기술, 고객으로 남을 좋은 바탕이 있습니다.” |

- 새 overlap 4개(ENTJ 2, INTP 1, ENTP 1), 구조 fortune 2개. 기존 40개 Fusion/9개 atomic fortune은 유지.
- 위 두 합성은 실제 matrix에서 각각 4건/40건 성립. supportingEvidence와 MBTI trait ID, structure material의 `fusionRefs`/`fortuneRefs`로 후속 composer가 연결 가능.
- 구조 lineage에 원본 atom과 해당 십성 refs를 보존해 구조와 그 원재료를 독립 표로 재사용하지 않는다. ‘독립’은 중복 source/위치가 아니라는 뜻이지 통계적 독립 증거라는 뜻이 아니다.
- 강한 구조가 없으면 강한 단점/좋은 복을 만들지 않는다. supported material은 `heroEligible: false`; uncertain에는 material binding 없음.
- 이름/직업 hardcode, 장문 writer, 외부 API 없음. MBTI source의 inferred provenance 정책도 그대로다.

## 6. 망신살 audit note

| 확인 | 결과 |
| --- | --- |
| `saju/shinsalConstants.ts` 일반 MANGSINSAL | 연지 亥卯未→申, 寅午戌→亥, 巳酉丑→寅, 申子辰→巳 |
| 같은 파일 TWELVE_MANGSINSAL | 같은 연지 기준 亥卯未→寅, 寅午戌→巳, 巳酉丑→申, 申子辰→亥 |
| 비교 | 12개 연지 전부 target 불일치. 어느 쪽을 canonical로 채택해야 하는지 확정할 추가 repo 근거 없음 |
| 현재 고객 영향 | `detectShinsal` → `buildCanonicalNatalTable` → `buildCanonicalManseRyeokTableData` → `ManseRyeokCommonTable`로 망신 표시 가능. 1984-11-18 09:30에서 두 코드의 위치가 다르고 SSR HTML에 ‘망신’이 있음을 특성 테스트로 확인 |
| 이번 처리 | V3 표/본문·계산 수정 없음. V4 `ambiguous/conflicted` suppress 유지. 기준 선택/기존 고객 UI 수정은 별도 승인 필요 |

## 7. False-positive / 회귀 검증

- 단순 약한 식상+재성, 복수 위치 부족, 연결 없는 공존, 인성/재성 완충, 관살 혼입, 숨은 상관·정관만 있는 경우를 거절.
- 실제 날짜 반례 13건을 이유 코드까지 고정. 예: 1985-05-06 07:30 식상·재성은 있어도 연결 부족으로 식상생재 미생성.
- strong 구조 원본에서 필수 anchor 하나 제거/약화/동일 lineage 처리 시 좋은 복 합성 0.
- unknown을 결핍으로 판정하지 않음. 옛 version/mismatched 시각·기둥/context, supplied 구조명은 승인하지 않음.
- 단순 weighted 총합이 같아도 월지와 뿌리 조건이 달라지면 판정이 달라지는 별도 mechanism test.
- 계산 객체 불변, 같은 기둥 deterministic, 같은 사주에서 MBTI만 바꾸면 구조 불변/Fusion 변경.

| 검증 | 결과 |
| --- | --- |
| V4 전체 | 365 PASS / 0 FAIL, 6 files. 10,368건 matrix는 1개 테스트 안에서 전수 실행 |
| 관련 saju/knowledge/table/V3/paid-delivery | V4 포함 2,379 PASS / 0 FAIL, 128 files |
| lint / build / diff-check | PASS. build는 `OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build`, 프로세스 한정·env 파일 불변 |
| 추가 standalone tsc | baseline e07ec2f 389 / 현재 389 diagnostics, 신규 0. 기존 test 오류 때문에 full tsc는 PASS라고 하지 않음 |
| 보호 범위 | 기존 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 보존·staging 제외. 역법/V3 runtime/결제/DB/public UI 파일 수정 0 |

## 8. 미지원 / Phase 3 검토 목록

| 미지원 또는 다음 보강 | 경계 |
| --- | --- |
| 완전한 고전 격국·종격·용신·조후·합화·월령 사령 일수 | 이번의 신강/신약·흐름 후보와 구분. 별도 규칙/기준 fixture 승인 필요 |
| 방합, 문곡/복성/천의성 | canonical producer 없음. 계속 unsupported/db-only |
| 망신살 채택 규칙 | suppress 해제하지 않음 |
| 신살/귀인 | 실제 위치·강도·중복 lineage별 의미와 영역별 장면 보강. 귀문·현침·도화/홍염 의미 혼용 방지 |
| 일주 | 기존 60일주의 alias/provenance 유지, 배우자궁·생활 모습·도메인별 material 확장 |
| 오행 | 월지/뿌리/강약과 정합적인 생활 이미지 보강. 신체 질병이나 부족 능력의 확정으로 바꾸지 않음 |
| 구조 × 신살 × MBTI | strong 조건 유지하며 유형/domain coverage를 의미 검토 후 확대. 결합 개수로 강도를 높이지 않음 |
| 대운/세운/월운/궁합 구조 | 별도 scope/period/A↔B 계약 승인 전 이번 natal layer 재명명 금지 |

완료 후 STOP. UI/장문 composer/master merge 자동 진행 없음.
