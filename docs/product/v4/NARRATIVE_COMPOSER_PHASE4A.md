# V4 Phase 4A — Comprehensive Narrative Composer

## 범위 / 상태

- Base: `f873096737d1747209ac580ffdbf25d30e52149b`, branch: `v4/rebuild`.
- **오프라인 deterministic 종합 텍스트와 structured packet만 구현.** 고객 route, UI, 저장 계약에 연결하지 않았다.
- 명리 역법/4주/운세 계산, Phase 1 Fusion 규칙, Phase 2 구조 판정, Phase 3 원본 material, MBTI DB, V3 결과를 변경하지 않았다.
- OpenAI/결제/DB/Production 호출 없음. 다른 5상품 composer 없음.
- 이 문서의 QA는 작성자가 출력 전체를 읽은 editorial 검수이다. 실제 고객 만족도/정확성 검증 결과로 해석하지 않는다.

## 구현

| 모듈 | 역할 |
| --- | --- |
| `narrativeTypes.ts` | 입력, 문단/section, provenance, 결과 계약 |
| `comprehensiveComposer.ts` | opening → 가변 순서 본문 → 방향 → 마지막 한 줄 |
| `narrativeComposer.ts` | domain/사용 이력/실제 Fusion/기존 evidence weight에 따른 재료 선택 |
| `copyRealizer.ts` | seed 예약, 조사, 공백 정리, provenance 결합 |
| `narrativeSignatures.ts` | 검토된 Fusion 44개와 복수 Fusion의 인물 도입 |
| `narrativeFusionScenes.ts` | Fusion을 실제 행동 장면으로 전개 |
| `narrativeStories.ts` | domain별 긴 문단과 기존 fortune composite의 현실적 발현 |
| `narrativePortraits.ts` | 일간의 겉/속/애정/혼자 시간, 주요 구조의 생활/관계 전개 |
| `narrativeContext.ts` | 기존 Career Context Interpreter를 **읽기 전용** 재사용; 기존 직업/관계 enum 유지 |
| `narrativeNatalTexture.ts` | canonical 만세력의 합/충 및 일부 십이운성 보조 해석 |
| `editorialGuard.ts` | 중복/긴 구절/장면 ID/내부 ID/금칙어/확정 문구/부정 편중 검사 |

호출:

```ts
composeComprehensiveNarrative({ calculation, name, mbti, context: {
  jobStatus, detailJob, relationshipStatus,
}})
```

성공 결과는 `{ ok: true, narrative, materials, editorial }`.
잘못된 입력 enum/검증되지 않은 원국은 `{ ok: false, errors }`.
`narrative`는 JSON 직렬화 가능한 문단/section이며, `materials`에는 사용 가능/보류 재료와 기존 Fusion/fortune provenance가 그대로 남는다.
문단마다 `features`, `seedIds`, `fusionIds`, `sourceRefs`를 보존한다. 이 값은 `narrativeText()` 고객 텍스트에 포함하지 않는다.

### 선택과 억제

- verified Phase 3 packet의 strong 재료만 직접 캐릭터 재료로 사용한다. uncertain 구조, 망신살 충돌, DB-only 표식은 가져오지 않는다.
- complement의 낮은 식상 근거는 기존 `supporting` 그대로이며 강한 명리 장점으로 바꾸지 않는다. 본문은 표현의 **다른 통로**를 설명한다.
- 이름/성별/직업은 명리 성격이나 Fusion 성립을 만들지 않는다. 직업은 장면에만 쓰며 이름·날짜를 보고 문구를 고르는 fixture 분기 없음.
- 관찰된 weight는 이미 strong gate를 통과한 재료의 **편집 우선순위**에만 사용한다. 새 신강/신약 판정이나 고객 점수가 아니다.
- 동일 seed는 한 번 예약한다. 겹치는 `wealth-and-name`/`recognized-place`/`lead-under-pressure`, 축적 합성은 상위 조합이 있으면 중복 묶음을 줄인다.
- 고객이 읽는 문장을 지워 PASS로 만드는 후처리 없음. 문제가 있으면 `editorial` 이슈를 반환하며, 로컬 tests가 실패한다.
- 오행 생활 이미지는 symbolic-only. 출생시간 미상에서는 오행 부족/과다 단락을 생성하지 않는다.
- 보조 합/충은 기존 canonical table의 천간합/육합/충만 재사용한다. 임의 형/파/해/방합 producer를 추가하지 않았다.
- 십이운성은 실제 일지의 장생/건록/제왕에 한해 보조 문단을 제공한다. 다른 운성을 재난/질병/죽음으로 해석하지 않는다.

### section과 리듬

- opening 3–6문단: 합쳐진 캐릭터, 강점, 실제 생활 모습, 짧은 MBTI 접점, 이미 있는 좋은 패.
- 관계형 Fusion은 관계/애정을 앞쪽에, 내면/contrast형은 혼자 생각/배움을 앞쪽에 배치한다. 강한 구조가 없으면 구조 section 자체를 생략한다.
- 강점/겉과 속/일/돈/관계/애정/혼자 시간/좋은 패/환경/방향을 서로 다른 재료로 전개한다.
- 구조는 정의를 반복하지 않고 생활과 가까운 사람 앞에서의 발현으로 쓴다. 모든 block 끝에 해결책을 붙이지 않는다.
- 짧은 단점과 질문을 긴 prose 사이에 배치한다. 제목과 마지막 문장은 이름 교체가 아니라 실제 Fusion/일주 차이를 사용한다.
- 일반적인 카테고리 순서를 3개로 나누는 현재 정책은 무한한 순서 변주를 보장하지 않는다. 같은 근거 조합의 문구도 재사용될 수 있다.

## 대표 ENTJ: 실제 계산과 핵심 결

서진 / 여성 / 1990-07-18 05:30 / ENTJ / B2B SaaS 영업기획 / 연애.

- 실제 4주: **庚午 · 癸未 · 甲申 · 丁卯**.
- `entj-wealth + entj-pressure + entj-needle`: 재성의 현실 결과, 편관의 판단/책임, 현침의 예리함에 ENTJ의 결과 지향/결단이 겹친다.
- 장성/반안까지 기존 gate 통과 → `wealth-and-name`.
- headline: **잘하는 데서 끝내기엔, 눈도 욕심도 빠릅니다**.
- 일: 고객 약속과 제품팀 일정이 엇갈릴 때 결정하고 움직이려는 장면.
- 돈: 제대로 남기는 결과/보상. 애정: 해결해주려는 마음과 함께할 계획에 상대를 넣는 행동.
- 단점: 고집, 뾰족한 말, 쉬는 순간에도 다음을 생각하는 모습. 정확한 수익/사건 약속은 없다.
- 결론: 더 바빠지는 것이 아닌 중요한 판단 → 결과 → 내 몫의 성공. **“결과를 보는 눈과 앞에 설 배짱이 함께 있습니다. 당신에게는 잘될 힘이 있습니다.”**
- 최종 한 줄: **“압박에 휘둘리기보다 방향을 잡아내는 것이 당신의 힘입니다.”**

별도의 탐색 test가 날짜를 실제 계산해 위 조합을 다시 찾는다. 이 날짜와 이름은 fixture에만 있고 runtime 선택 코드에 없다.

## 12명 전체 읽기 검수

여성 9 / 남성 3, 서로 다른 일주 12개. 아래 평가는 자동 guard가 아니라 텍스트를 직접 읽은 뒤 남긴 판단이다.
최종: **Blocker 0 / Major 0 / Minor 있는 fixture 6 / 나머지 6건은 확인한 범위에서 No issue**.

| 사람 / 원국 / 입력 | 인물 차이와 가장 잘 드러난 부분 | 판정 / 남은 사항 |
| --- | --- | --- |
| 서진 · 甲申 · ENTJ · 직장인/영업기획 · 연애 | 결과·책임·예리함 → 돈과 이름. 처음 1분의 인물이 가장 분명함 | No issue |
| 서윤 · 戊申 · ENFP · 브랜드 디자이너 · 솔로 | 호기심의 연결과 침착한 버팀, 프리랜서 작업/축적복, 가까워질수록 매력 | Minor: 탐구/검색의 의미가 인접 section에서 일부 겹침 |
| 지아 · 己卯 · ISFP · 병원 행정직 · 연애/시간 모름 | 미묘한 반응과 생활 배려; 진료/의료인 직무를 추정하지 않음 | No issue; 오행 단락 누락은 안전한 의도적 생략 |
| 다은 · 辛亥 · ENTJ · 온라인 교육사업 대표 · 기혼 | 재다신약 후보+식상생재; 기회를 보는 눈과 꽉 찬 하루, 대표 ENTJ와 다른 도입 | No issue |
| 수아 · 壬午 · INFJ · 전시 기획 · 썸 | 깊이 묻는 사람 + 재생관의 인정/의견 욕구; 보여지는 활기와 생각의 깊이 | Minor: 비합성 좋은 패 문단의 생활 예를 더 늘릴 여지 |
| 예린 · 甲子 · ISFJ · 가정 돌봄 · 기혼 | 기억하고 다시 챙기는 사람, 관인상생의 책임→배움, 생활비 맥락 | Minor: 지식/설명 소재가 겹쳐 취미/가족 장면 변주 여지 |
| 나영 · 壬戌 · INTP · 기술 문서 번역 · 솔로 | 살인상생의 버거움→이해→전문성, 명예/축적/학습 좋은 패 | Minor: 탐구 문단의 정서 변화 폭은 더 키울 수 있음 |
| 유진 · 壬辰 · ENTP · IT 서비스 기획 준비 · 썸 | 규칙과 질문의 긴장, 상관견관, 첫 선택/면접 전의 맥락 | No issue |
| 하린 · 庚寅 · ESTP · 체육학 학생 · 솔로 | 몸은 먼저 해보고 머리는 이유를 묻는 contrast, 학비/경험의 선택 | No issue |
| 민재 · 丙子 · ISTJ · 제조업 재무기획 과장 · 기혼 | 약속의 신뢰+숫자/기준 확인, 겉의 밝음과 혼자 복기하는 모습 | Minor: 밝은 일간과 신중한 Fusion 사이의 전환을 더 매끄럽게 할 여지 |
| 도윤 · 庚子 · INFJ · 독립서점 운영 · 결혼 준비 | 깊은 관계와 혼자 공간을 함께 지키는 복수 Fusion, 집/예산 대화 | No issue |
| 준서 · 丁卯 · MBTI 모름 · 휴식/이전 바리스타 · 관계 미선택 | 작은 배려와 늦게 꺼내는 바람; 현재 직장/상대를 invent하지 않음 | Minor: Fusion/fortune composite가 없어 좋은 패 분량이 더 짧음. 억지 복 생성 대신 후속 atomic 전개 보강 대상 |

### 출력에서 확인한 문장

- ENFP: “정해진 답을 잘 따라가는 것보다 서로 멀어 보이는 것을 붙여 새 답을 만들 때 더 신납니다.”
- ISFP: “작은 불편이 보이면 거창한 계획을 다시 세우기보다 지금 바꿔볼 한 가지를 찾습니다.”
- INTP: “당신은 압박을 그냥 참는 사람보다 그 시간을 자기 지식으로 바꾸는 사람에 가깝습니다.”
- ESTP: “직접 부딪힌 감각과 혼자 따져보는 질문이 번갈아 당신을 앞으로 밀어줍니다.”
- 팩폭: “틀린 건 고쳤는데 상대 표정까지 굳어버렸습니다.” / “벌 시간을 늘렸는데 정작 쓸 시간은 사라졌습니다.”
- 애정의 반전: “본인은 열심히 사랑했는데 상대는 잠깐 내 편만 들어줬으면 했다는, 서로 억울한 장면이 생깁니다.”
- 좋은 복 합성: “현실적인 성과를 잡는 눈과 큰 책임 앞에 서는 배짱, 해낸 만큼 인정받으려는 힘이 겹칩니다. 장수가 말을 타고 깃발을 든 모습에 가깝습니다.”
- unknown MBTI: “오래 참았다고 마음까지 작아지는 것은 아니라서 나중에 한꺼번에 말하면 상대가 놀랍니다. 본인에게는 여러 번 지나온 생각인데 상대에게는 첫 이야기인 겁니다.”

## 반복 / 품질 검사

- 12개 headline / final line 각각 12개로 구분.
- 각 리포트 내부 exact sentence / 정규화 36자 동일 긴 구절 / scene ID 재사용 0.
- **서로 다른 리포트 사이 모든 문장의 중복 0을 뜻하지 않는다.** 동일 근거의 의미/상태 도입/fortune prose는 결정론적으로 재사용된다. 이 범위는 Phase 4B 변주 대상으로 남긴다.
- 12원국 × 16 MBTI + unknown = **204개 조합**, 모두 결정론/guard/계산 input 불변 확인.
- 동일 사주/다른 MBTI, 동일 MBTI/다른 사주, 직업 counterfactual, 관계 6상태, 이름/성별 counterfactual 검사.
- 실제 1988-03-06 09:30 ENFP counterfactual에서 `enfp-expression` complement 도입 확인. 부족 명리 근거는 supporting 유지.
- 12명 모두 실제 선택된 근거와 문단 provenance를 대조. 근거 없는 도화/홍염, 보류 구조, 망신살/DB-only 귀인 노출 없음.
- 장점/좋은 패의 positive 문단 글자는 명시적 shadow 문단보다 16배 이상. 단점은 짧게 남기고 전체는 자연스러운 prose 중심이다.
- 분량은 completeness 지표로 강제하지 않았다. 샘플의 본문 문단 합계는 약 2.7–4.2천 자이며, 제목/입력/마지막 한 줄은 별도다. 이 차이를 가짜 근거로 채우지 않는다.

## 검증 및 재현

```sh
V4_PHASE4_EXPORT=1 pnpm test tests/unit/interpretation-v4
pnpm lint
OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
git diff --check
```

- 신규 narrative 51 + 실제 원국 탐색 1 PASS. V4 전체 **577 PASS / 9 files / 0 FAIL**.
- 관련 regression **2,591 PASS / 131 files / 0 FAIL**: saju, report-knowledge/tables, V3/V4, MBTI/Fusion/절입/운세/출생시간, paidOneCallDelivery, paidDeliveryCompleteness. V4 577은 이 수에 포함되며 더해서 세지 않는다.
- `pnpm lint`, 외부 writer/reliability를 비활성화한 `pnpm build`, `git diff --check` PASS.
- standalone `tsc --noEmit`: 기존 범위 진단 389개가 남음. 이번 V4 신규 파일/테스트 진단은 0. Next build의 TypeScript 단계와 혼동하지 않는다.
- JSON 직렬화/export와 모든 문단 provenance 확인. UI/SSR/hydration 작업은 이번 phase에 없음.

Export: `/tmp/gyeol-v4-phase4a/`

- `index.md`: 12명 전체 텍스트 링크.
- `01-seojin.md` … `12-junseo.md`: 헤드라인부터 마지막 한 줄까지 전부.
- 같은 이름의 `.json`: 입력 fixture + narrative + material/evidence packet + 자동 QA.
- `counterfactual-complement.md`: 실제 저식상 ENFP의 보완형 본문.
- 출력은 로컬 임시 검수 자료이며 재부팅/정리 후 위 명령으로 재생성 가능하다. 영구 preview route를 만들지 않았다.

## Phase 4B 검토 항목 — 자동 시작하지 않음

- 같은 근거를 공유한 고객 사이에서도 domain별 추가 발현을 선택하도록 의미 단위의 변주 보강.
- atomic 좋은 패와 unknown MBTI 사례의 좋은 운/성공 문단 확장. 지원하지 않는 feature를 새로 만들지 않을 것.
- 탐구/설명과 같은 가까운 의미가 연속될 때 소재 간격과 정서 전환 개선.
- 입력 직업이 번역/돌봄/휴식처럼 세부 scene library가 얇은 경우 기존 normalized context의 장면 보강 검토.
- 실제 사용자 리뷰 후 판단. UI/다른 5상품/master 통합은 별도 승인 범위.
