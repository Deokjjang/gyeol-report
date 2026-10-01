# Phase 5B · Love deterministic narrative

- Branch/base: `v4/rebuild` / `ebbc2f785257971a65cde4421642e70c1b739827`.
- 범위: 연애·결혼·부모로서의 나를 다루는 **offline 텍스트/structured packet**. UI, route, V3 runtime, 계산, DB, 결제, 다른 상품 composer 수정 없음.
- 실제 고객 route에는 연결하지 않음. OpenAI/네트워크/현재 시각에 의존하지 않음.

## 구현 및 근거 계약

| 모듈 | 역할 / 재사용 경계 |
| --- | --- |
| `loveComposer.ts`, `loveNarrativeTypes.ts` | 기존 `NarrativeInput`, material packet, proof, paragraph, editorial guard를 사용. 기존 6개 관계상태만 허용 |
| `loveVoices.ts` | 기존 Fusion rule + 실제 MBTI trait ID가 모두 성립할 때만 연애 캐릭터 선택. 이름·생일 hash·fixture ID로 문체를 고르지 않음 |
| `loveContext.ts` | 미선택/솔로/썸/연애/결혼 준비/기혼의 장면·생활 시점·결론 연결. 조사 공통 realizer 사용 |
| `loveNatalScenes.ts` | 이미 strong인 십성/Phase 2 구조의 관계 material만 생활 장면으로 확장. 같은 정재도 소비·부부 비용·즐거움 예산으로 다르게 전개 |
| `loveFortune.ts` | 도화·홍염을 별도 근거/문단으로 유지. 천을·월덕·천덕·암록·금여 및 장성+반안은 실제 존재할 때만 사용 |
| `loveBalance.ts` | confirmed 원국의 부족 오행을 상징적 사람 이미지로 번역. 상대의 사주를 추정하거나 특정 오행과 결혼을 보장하지 않음 |
| `loveFusionScenes.ts` | 기존 contrast/complement의 연애 발현. 표현 저조 근거는 supporting complement로만 사용하며 hero 승격 금지 |
| `loveFallback.ts` | 선택 가능한 연애 Fusion 캐릭터가 없으면 검증된 일주·일간·관계 material로 전개. MBTI unknown이면 추정/불이익 문구 없음 |

새 Fusion 계산식, 구조 판정, 신살 판정, MBTI source DB는 만들거나 변경하지 않았다. 전문에 근거 ID를 출력하지 않고 각 block의 `proof`와 `materials`에 유지한다. 불확실/망신살 충돌/DB-only material은 본문의 강한 근거로 사용하지 않는다.

주력 캐릭터 8개는 `isfp-needle`, `entj-needle`, `enfp-connection`, `infj-marriage`, `istj-love`, `intp-inquiry`, `esfp-charm`, `isfj-love`를 재사용한다. 다른 유형/근거 조합은 명리 fallback과 성립한 기존 Fusion turn을 사용한다. **16유형 모두 같은 수의 강한 Fusion을 억지로 만들지 않는다.**

MBTI love/marriage/parenting의 실제 ID, reportUseCases, notablePairs의 관계 특성을 확인했다. notablePairs는 편한 사람의 행동 이미지에만 쓰며 상대 유형 추천/서열/점수로 출력하지 않는다. `mbtiBasis`에 사용 trait와 direct/inferred `sourceCoverage`를 보존한다. child 예측 material은 사용하지 않는다.

## 상태 / 시간 정확도

| 상태 | 현실 장면 / 결혼 문체 |
| --- | --- |
| 미선택 | 관계 유무 단정 없이 편한 사람을 알아보는 선택 / 함께 사는 삶을 선택한다면 |
| 솔로 | 관심 없는 만남을 늘리거나 누구에게나 애정을 쏟을 필요 없음 / 훗날 함께 살게 된다면 |
| 썸 | 다정한 하루와 실제 다음 약속의 차이 / 알아가는 상대와 먼 생활까지 떠올린다면 |
| 연애 | 바쁜 주에도 남기는 배려, 이미 주고받는 애정 / 지금 연애가 공동생활로 이어진다면 |
| 결혼 준비 | 예산·양가 기대·준비 분담 / 결혼 뒤 생활을 준비하며 |
| 기혼 | 반복되는 저녁과 피로를 알아주는 부부 / 함께 살고 있는 지금 |

- exact 5명, approximate 2명, unknown 1명. `calculateSaju`를 실제 canonical precision 입력으로 실행했다.
- approximate는 임의 대표 분을 넣지 않고 `MYOSI` / `MISI` slot 사용. 두 fixture 모두 범위 전체에서 시주 stable 확인.
- 지아(unknown)는 3주만 사용. 시주, 확정 부족 오행, 도화·홍염을 만들어내지 않음.
- 부모 파트는 모든 상태에서 **내가 부모가 된다면**이라는 조건형. 아이 존재·성격·미래 예측, 결혼 시기 예언 없음.

## 8명 전문 검수

검수자가 export 전문을 마지막 문장까지 읽었다. 자동 수치와 별개로 판정했다. 여성 6 / 남성 2. 분량은 약 2,684–3,252자(검수 입력 header 포함)이며 글자 수 자체를 품질 점수로 쓰지 않았다.

| fixture | 입력 | 실제 좋은 패 / 읽기 경험 | 최종 판정 |
| --- | --- | --- | --- |
| 지아 | F · 1997-08-05 · unknown · ISFP · 연애 | 己卯·현침의 섬세함, 편관의 보호하는 면, 비견의 취향 경계, 암록의 조용한 도움. 수동적 헌신으로만 끝나지 않음 | No issue |
| 서진 | F · 1990-07-18 05:30 · ENTJ · 솔로 | 현침×ENTJ, 도화/홍염 각각, 천을·장성/반안. 해결회의 팩폭과 기대어도 되는 다정함이 같이 보임 | No issue |
| 서윤 | F · 1994-11-18 07:42 · ENFP · 썸 | 편인×연결 사고, 홍염, 월덕, 식신의 식사와 편재의 여행. 다음 약속을 혼자 앞서 확정하지 않는 현재 맥락 | No issue |
| 도윤 | M · 1985-06-30 · MYOSI approximate · INFJ · 기혼 | 화개×개인시간, 도화·천을, 상관의 농담, 정재의 생활비. 실제 부부의 회복 시간과 돈으로 이어짐 | **Minor** — 친밀감/화해/환경에서 조용한 시간이라는 의미가 일부 재등장 |
| 민재 | M · 1988-03-22 14:10 · ISTJ · 결혼 준비 | 정관×신뢰, 금여록, strong 식상/인성 구조. 예산·가족 기대·준비 분담, 절제된 사람의 장난이라는 반전 | No issue |
| 나영 | F · 1984-07-27 15:30 · INTP · 솔로 | 편인×탐구, 홍염·월덕, 살인상생·식신. 질문/관심사 초대와 설명 없는 한 끼의 차이, 자유와 생활 책임 분리 | No issue |
| 하린 | F · 2001-01-27 18:20 · ESFP · 미선택 | 도화×표현, supporting 표현 보완, 천을, 비견·정재. 밝음만 반복하지 않고 개인 선택과 예산의 다른 면도 보임 | No issue |
| 예린 | F · 1984-09-27 · MISI approximate · ISFJ · 연애 | 정관×신뢰, 도화·천을, 관인상생·정인. 챙김을 받는 자리까지 긍정적으로 결론 | **Minor** — 배려/돌봄 상호성의 의미가 장점·친밀감·결론에 일부 겹침 |

**Blocker 0 / Major 0 / Minor 2 / No issue 6.** Minor는 내용 오류·상태 오류·잘림이 아니라 의미 밀도의 후속 미세 조정 여지다. broad 16유형 counterfactual의 자동 안전성 통과를 모든 조합의 수동 전문 검수로 과장하지 않는다.

### 초안에서 실제 고친 것

- 지아와 민재: 좋은 매력 표식이 적다는 이유로 상대적으로 짧았던 내용을 실제 strong 편관/비견, 식상/인성 구조의 다른 관계 장면으로 확장. 없는 도화·홍염 추가 안 함.
- 결혼 준비 counterfactual: 현재 장면에 애정 표현 문단을 붙여 중복되던 분기를 독립적인 준비 장면으로 수정. 문장을 사후 삭제하는 guard 사용 안 함.
- `깊이은` 조사와 `관계에서는 … 사랑에는` 연결을 공통 조사/명시적 상태 연결로 정리.
- 정재/식신/비견이 여러 fixture에 공통일 때 같은 문장을 쓰지 않고 예산·공동생활·식사·개별 친구·선택의 경계로 분산.

## 실제 출력 예

- **Overlap** (1990-07-18 / ENTJ / 현침): “현침의 빠른 눈이 ENTJ의 바로 말하고 고치는 방식과 만나면 애정도 손이 빠릅니다.” “다만 챙김은 충분했는데 ‘보고 싶었어’라는 자막만 빠질 수 있습니다.”
- **Contrast** (1994-11-18 / ISFP counterfactual / 홍염): “천천히 마음을 여는 태도와 가까워질수록 살아나는 홍염의 매력이 함께 있습니다.” “관심의 깊이와 관계를 정하는 속도가 꼭 같은 것은 아닙니다.”
- **Complement** (1984-09-27 / ENFP counterfactual / verified output-low): “원국에서 덜 드러난 표현을 ENFP의 감정을 주고받는 행동이 펼칠 통로가 됩니다.” 단 supporting 유지.
- **매력**: “처음의 존재감 뒤에 오래 알고 싶은 온기가 남는 쪽입니다.” 도화의 처음 주목과 홍염의 가까운 온기를 별도 문단으로 확인.
- **사람복**: “사람복이 있습니다. 내 수고를 알아보고 힘든 날에 먼저 손을 내미는 인연을 기대할 좋은 재료입니다.” 천을 실제 존재.
- **편한 사람**: “내 제안에 고맙다고 하면서도 ‘지금은 해결보다 들어줬으면 해’라고 말할 수 있는 사람입니다.”
- **팩폭**: “싸우다가 원래 서운했던 일보다 누가 더 논리적인지가 중요해지면 연애인지 성과평가인지 헷갈립니다.”
- **마무리**: “답을 줄 수 있는 당신이, 답이 없는 날에도 곁에 있어주면 됩니다.”

## 검증 / 재현

| 검사 | 결과 |
| --- | --- |
| 신규 Love targeted | 67 PASS / 0 FAIL (discovery 1 + narrative 44 + safety 22) |
| V4 전체 | 725 PASS / 0 FAIL, 15 files |
| 관련 계산/knowledge/tables/V3/V4/paid delivery 회귀 | 2,739 PASS / 0 FAIL, 137 files (V4 포함, 중복 합산 금지) |
| 동일 원국 × MBTI 3 / 동일 MBTI × 원국 3 | 근거 고정/변경에 따라 opening·fortune·캐릭터 실제 차이 |
| 상태 counterfactual | 16 MBTI × 8실제 원국 × 6상태 = 768 조합 안전성/반복 guard 통과 |
| 도화만 / 홍염만 / 둘 다 / 둘 다 없음 | 실제 계산 fixture 4종에서 해당 본문 존재/부재 및 의미 분리 |
| 종합 12개 / Career 8개 | 이전 narrative SHA-256 동일 |
| 8명 exact sentence / 12어절 span / headline / final 중복 | 모두 0, 본문 문장 및 final 기준. 공통 section label은 중복 검사 대상 아님 |
| unsupported / weak hero / 망신살 / DB-only | strong 본문 근거 승격 0; supporting complement만 별도 예외 계약 검증 |
| lint / build / diff-check | PASS. build는 writer/reliability 외부 호출 비활성화, deploy 안 함 |

별도 `tsc --noEmit` 전체 실행에는 Phase 5A와 동일한 기존 diagnostics 389건이 남아 있다(로그 byte 동일). 이번 변경의 새 TypeScript diagnostic은 0이며, 이를 저장소 전체 TypeScript 무오류로 보고하지 않는다.

회귀 범위는 `saju`, `report-knowledge`, `report-tables`, `interpretation-v3`, `interpretation-v4`, 기존 generation/precision/paid completeness 관련 테스트다. 저장소의 모든 테스트를 실행했다는 뜻은 아니다.

```sh
V4_PHASE5B_EXPORT=1 pnpm test tests/unit/interpretation-v4/loveDiscovery.test.ts tests/unit/interpretation-v4/loveNarrative.test.ts tests/unit/interpretation-v4/loveSafety.test.ts
pnpm test tests/unit/interpretation-v4
pnpm lint
OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
git diff --check
```

Export: `/tmp/gyeol-v4-phase5b/index.md`, `01-jia` … `08-yerin`의 `.md` 전체 텍스트 + `.json` structured packet. 추가 `source-fixtures.json`, `counterfactuals.json`, `fusion-examples.json`, `cohort-qa.json`. 파일은 JSON parse 검증했고 재현 가능하다. 로컬 임시 산출물은 commit에 포함하지 않는다.

기존 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 보존. 이번 단계 후 STOP. Compatibility/Major/Annual/UI 및 master 병합은 시작하지 않는다.
