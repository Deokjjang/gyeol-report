# V4 Fusion Core · Phase 1

기준: `3fe3f9094f7e584c1d38ba84f32287890c8379b5`, `v4/rebuild`.
범위는 **offline deterministic core**다. 기존 계산·MBTI DB·V3 본문·고객 UI·결제·저장 계약은 변경하지 않았다. 현재 report dispatcher는 V4를 호출하지 않는다.

## 구현 구조

| 파일 | 책임 / 재사용 |
| --- | --- |
| `src/lib/interpretation-v4/types.ts` | 10 domain, evidence 5등급 분류, overlap/contrast/complement, fortune, provenance 계약 |
| `evidencePolicy.ts` | 현재 `SajuCalcResult` + canonical natal table + V3 `storySupport`를 읽고 승인/격리. 새 계산식 없음 |
| `materialRegistry.ts` | taxonomy/knowledge의 157개 의미 단위 및 alias/source 보존. 그중 26개 항목에 검토한 semantic mapping. 나머지에는 임의 tag를 붙이지 않음 |
| `fusionRules.ts` | 기존 DB의 정확한 type/area/trait ID를 사용하는 Fusion 40개, 좋은 복 합성 9개 |
| `fusion.ts` | evidence 정규화, 의미 매칭, 중복/충돌 억제, 후보 선택, coverage/보류 이유 반환 |

- 진입점: `buildFusionCore({ calculation, mbti, subject?, domains? })`. 계산 입력을 재작성하지 않는다.
- `interpretFusion({ observations, ... })`는 내부 adapter/test용이다. 외부 입력의 feature 이름만으로 생성하는 API가 아니다.
- Fusion 출력: domain/kind, 명리 evidence, MBTI evidence, shared theme, insight seed, strength/confidence, provenance refs.
- Fortune 출력: theme, supporting evidence[], strength, direct copy seed, provenance refs.
- `strength`는 **해석 근거의 편집상 지원 수준**이다. 고전 신강·신약, 고객 점수, 실증적인 성격 확률이 아니다.
- `confidence`의 supported/derived는 사용한 trait의 출처 구분이다. MBTI 행동을 실제 개인에게 관찰한 사실로 주장하지 않는다.
- 동일 입력과 규칙 버전은 동일 결과를 낸다. 시간·랜덤·네트워크 호출 없음.

## Evidence / suppress 정책

| 입력 | 처리 |
| --- | --- |
| confirmed/calculated | 현재 계산 버전·입력·확정 기둥 일치, provenance 확인 후 우선 사용 |
| derived-but-supported | canonical extractor의 검증된 파생 규칙 사용 가능. 귀문관살 포함, 원래 source refs 유지 |
| db-only | 문곡·복성·천의성 등 knowledge만 있는 feature는 강한 해석/합성에 사용하지 않음 |
| ambiguous/conflicted | 망신살의 legacy 두 규칙 충돌, 미확정 입력, 서로 다른 raw weight, 식상 존재와 결핍의 모순을 격리 |
| unsupported | 신강·신약/재다신약 등 미검증 구조, 알 수 없는 feature, provenance 없는 label, Phase 1 외 시간 scope 거절 |
| 약한 십성 | V3의 substantial 판정 + 실제 raw weight 재사용. 0.3 등 미약한 숨은 십성을 hero로 승격하지 않음 |
| complement | 확정·안정된 4주에서 식신+상관 가중이 기존 editorial floor 0.6 미만일 때만 표현 통로 보완 후보. supporting 상한 |
| 출생시간 모름/불안정 | 보이는 실제 근거는 유지하되, 보이지 않는 시주를 결핍으로 판단하지 않음 |
| inferred MBTI | 돈·결혼 등의 `sourceCoverage: inferred`를 `provenance: derived`로 유지. strong으로 승격하지 않음 |
| 의미 불일치 | 명시한 feature/trait/domain/tag 연결이 없으면 suppress. 성장 권고를 이미 가진 보완 행동으로 사용하지 않음 |
| 중복 | alias는 한 근거로 통합하고 모든 refs 보존. 같은 feature/domain 후보는 근거 강도 우선 선택 |
| 좋은 복 | 같은 subject의 서로 다른 strong anchor 전부 필요. 동일 lineage를 두 표로 세지 않음. 약한 근거 개수로 승격 금지 |
| MBTI 모름 | Fusion 0. 확인된 명리 단독 material과 좋은 복 합성은 정상 반환 |

Phase 1은 **natal만 지원**한다. major/annual/monthly 관측을 넣으면 명시적으로 보류한다. 원국 표식을 월운 표식으로 바꾸지 않는다. 망신살은 V4에서만 격리하며 legacy 계산은 그대로다.

## 실제 계산 출력 예

아래는 이름 교체 mock이 아니라 현행 `calculateSaju`로 계산한 양력·남성·09:30 정확·Asia/Seoul fixture의 출력이다. 216개 실제 원국을 탐색해 조건 성립을 검증했다.

| 입력 / 종류 | 실제 seed |
| --- | --- |
| 1988-01-06 ENTJ · 현침 overlap | 오류를 보는 순간 수정안까지 머릿속에 떠오릅니다. 본인은 빨리 해결한 것뿐인데, 상대에게는 말이 꽤 날카롭게 들릴 때가 있습니다. |
| 같은 입력 · 편관 overlap | 다들 우물쭈물하면 결국 내가 순서를 정하고 있습니다. 급한 순간에 더 또렷해지는 힘이 있지만, 쉬는 날까지 지휘할 필요는 없습니다. |
| 같은 입력 · 재성 overlap | 잘했다는 말도 좋지만, 그래서 내 몫이 얼마나 커졌는지가 궁금합니다. 돈 이야기를 피하기보다 실력에 맞는 값을 받고 싶은 사람입니다. |
| 1988-10-27 ENTJ · 화개 contrast | 사람들 앞에서는 결론을 이끌지만 중요한 판단 전에는 혼자 있고 싶습니다. 밖에서 보이는 자신감 뒤에, 조용히 생각을 정리하는 시간이 있습니다. |
| 1988-03-06 ENFP · 표현 complement | 혼자서는 정리 안 되던 마음도 좋아하는 사람 앞에서는 표정과 말로 나옵니다. 표현의 힘을 꼭 혼자 짜낼 필요는 없는 사람입니다. |
| 1988-10-27 · 재성+편관+장성+반안 | 돈과 이름을 같이 노려볼 만한 힘이 있습니다. |

이것은 장문 리포트가 아니라 검토 가능한 interpretation seed다. 후속 composer의 직업/관계/시점/반복 편집을 대신하지 않는다.

## Coverage / 남은 빈칸

| 구분 | 결과 / 제한 |
| --- | --- |
| MBTI DB | 16유형 모두 현행 runtime adapter 사용. source DB 수정 0 |
| 16유형 × 10 domain | 160 조합의 실행/빈 결과 정책 검증. 72조합은 검토한 rule 존재, 88조합은 `no-reviewed-rule`로 명시 |
| rule은 있으나 실제 근거 없음 | `no-matching-evidence`; 억지 seed 없음 |
| INTP | 기존 bridge 1개라는 audit 경고 유지. V4는 탐구/관계 자율성/표현 통로의 3개 rule |
| ISTJ/ISTP 관계 | 기존 trait로 love/marriage 연결 최소 보강. 얇은 love/communication source 경고는 숨기지 않음 |
| 명리 material | 157개 normalized. 26개 semantic mapping 외에는 자동 Fusion 안 함. 일주 등 넓은 material 보유가 풍부한 Fusion coverage를 뜻하지 않음 |
| false-positive | 모든 유형 × 무관한 mapped feature 반례에서 0. 이것은 테스트한 규칙 경계의 결과이며 심리적 정확성의 실증 주장은 아님 |

## 검증

| 항목 | 결과 |
| --- | --- |
| V4 audit/core/실계산 matrix | 294 PASS. 16 × 10, 반례/alias/weak/inferred/unknown/망신/귀문, counterfactual, source JSON/ref 유효성 |
| 전체 관련 regression | 125 test files / 2,308 PASS / 0 FAIL. 위 V4 포함이며 별도 합산하지 않음 |
| 기존 계약 | Saju/MBTI/만세력, V2/V3 snapshot, 대운·세운·절입·출생시간, paid delivery/full-share completeness 회귀 포함 |
| lint | `pnpm lint` PASS |
| build | `OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build` PASS. 프로세스 한정 옵션; env 파일/설정 변경 없음 |
| diff | `git diff --check` 및 staged diff-check PASS |

추가 standalone `tsc --noEmit --incremental false`는 기존 test diagnostics 389개로 실패한다. 기준 commit을 별도 임시 디렉터리에서 동일 검사하여 **기존 389 / 현재 389 / 신규 0**을 확인했다. 이를 clean typecheck로 보고하지 않는다. Next build의 TypeScript 단계는 통과했다.

V3 core의 소비자 whitelist test에는 승인된 읽기 전용 V4 의존 파일 3개만 추가했다. 역방향으로 기존 route/generator/delivery가 V4를 import하지 않는 별도 isolation test를 추가했다. 계산/V3 runtime 파일 수정 없음.

## Phase 2 전에 확정할 확장 목록 · 자동 진행 금지

| 미지원/부족 | 필요한 선행 작업 |
| --- | --- |
| 고전 신강·신약, 재다신약 | 월령·통근·생조/설기·합화 등 canonical 규칙과 경계 fixtures 승인. 현재 weighted-count로 대체 금지 |
| 식상생재·재생관·관인상생·살인상생·상관견관 | 단순 두 십성 존재와 구조 성립 구분. 강약·위치·조건 검증 전 이름 생성 금지 |
| 망신살 | 충돌한 canonical 규칙의 별도 결정/계산 regression. 이번 V4 격리를 해제하지 않음 |
| 방합, 문곡·복성·천의성 등 | 검증된 계산 producer/위치/provenance 승인 전 DB material만 유지 |
| 시간운/궁합 Fusion | 별도 scope·period·Jie·A/B 방향 adapter와 부정 사례. natal 근거 재명명 금지 |
| 88 type-domain 빈칸 / 일주·오행 | 실제 trait와 domain별 의미가 맞는 경우만 추가. source 빈칸은 source 검토부터 |
| 제품 연결 | 사용자 승인 후 명시적 V4 composer/version/UI 분기. core 완료만으로 판매 가능 또는 6상품 완성이라고 주장하지 않음 |

이번 단계에서 UI/전체 report writer/master merge는 시작하지 않는다.
