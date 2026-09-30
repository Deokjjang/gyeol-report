# V4 Phase 3 — 명리 해석 재료 깊이

- 기준: `e53c08767ba8c5abb34c8cba4a01efd65f658346`, `v4/rebuild`.
- **130개 feature / 140개 상태별 재료 / 1,572개 seed**. 오행 5개를 high/low/balanced 15묶음으로 구분한다.
- 해석 재료와 offline packet만 구현. 장문 composer, UI, 현재 6상품 생성 경로는 연결하지 않았다.
- 원국/역법/대운/세운/월운 계산, Phase2 구조 판정, Phase1 Fusion 규칙, MBTI DB 모두 변경 없음.
- 이는 기존 명리 지식의 엔터테인먼트용 표현 확장이다. 관찰·장면은 개인의 실제 행동을 검증한 사실이나 사건 예측이 아니다.

## 1. 기존 빈칸과 변경

| 기존 빈칸 | 이번 보강 | 유지한 경계 |
|---|---|---|
| 일주 60개의 상당 부분이 일간 문장 + 일지 문장 + 공통 꼬리 | 60개 개별 첫인상·속마음·장단점·일·돈·연애·장면·팩폭·질문·마무리, 학습 15개 | 기존 `sajuDayPillarKnowledge` 이미지/키워드 재사용, V3 원본은 보존 |
| V4 registry가 대부분 한 줄 의미 | `Material.depth`로 여러 역할의 독립 문장 연결 | 기존 semantic tags/domains/Fusion rules를 임의 확장하지 않음 |
| native 신살 일부는 KB 행이 없어 재료 선택이 비어 있음 | 실제 gate 지원 31종 모두 재료 보유 | 망신살 충돌 격리, 문곡/복성/천의성 생성 금지 |
| 오행 정의를 생활 제안으로 옮길 재료 부족 | 5오행 × 강함/약함·없음/균형, 사람·환경·취미 이미지 | 기존 weighted labels 그대로, 부족 오행의 과학적 처방으로 쓰지 않음 |
| 구조 정의 뒤 반복되는 분석식 설명 | Phase2 근거에 속마음·현실 장면·질문·팩폭·긍정 마무리 추가 | supported/uncertain 구조의 단정형 hero 차단 |

## 2. Coverage

각 행의 모든 묶음에 이미지, 캐릭터/속마음, 장점, 단점, 장면, 팩폭, 질문, 긍정 마무리가 있다. **이름만 있고 쓸 seed가 없는 지원 대상: 0**.

| 구분 | feature | 상태별 묶음 | seed | 이미지/긍정/부정/장면 보유 |
|---|---:|---:|---:|---|
| 일간 | 10 | 10 | 131 | 10/10 |
| 일주 | 60 | 60 | 675 | 60/60 |
| 오행 | 5 | 15 | 140 | 15/15 |
| 십성 | 10 | 10 | 139 | 10/10 |
| Phase2 구조 | 14 | 14 | 153 | 14/14 |
| 계산 가능한 신살·귀인 | 31 | 31 | 334 | 31/31 |

다음은 해당 domain에 하나 이상의 seed가 있는 **묶음 수**다. seed 수나 명리 강도 점수가 아니다.

| 구분 | 일 | 돈 | 공부 | 연애 | 결혼·관계 | 별도 좋은 운 |
|---|---:|---:|---:|---:|---:|---:|
| 일간 | 10 | 10 | 5 | 10 | 10 | 6 |
| 일주 | 60 | 60 | 15 | 60 | 60 | 0 |
| 오행 상태 | 5 | 3 | 5 | 2 | 5 | 0 |
| 십성 | 10 | 10 | 9 | 10 | 10 | 10 |
| 구조 | 12 | 12 | 4 | 13 | 12 | 12 |
| 신살·귀인 | 26 | 4 | 10 | 10 | 20 | 16 |

- 모든 묶음의 identity/strengths/weaknesses는 존재한다. 긍정 역할 seed 수가 부정 역할 수보다 많다. 역할 태그는 편집 분류이지 검증된 성공 확률이 아니다.
- 빈 domain을 공통 문장으로 채우지 않는다. 예: 홍염의 돈 재료, 백호의 재물복 재료 없음.
- 일주의 장점·일·돈·긍정 마무리는 풍부하게 제공하되, 일주 이름만으로 별도 귀인/재물복을 추가하지 않는다. `ending`을 자동으로 `success/fortune`에 넣지 않는다.
- 결혼·관계 일부는 연애의 애정/신뢰 seed를 동일 ID로 함께 참조한다. 별도 문장인 것처럼 복제하거나 수량을 늘리지 않는다.

### 신살·귀인 31종

현침, 도화(년살 alias 통합), 홍염, 역마, 화개, 장성, 반안, 귀문, 양인, 백호,
천을, 천덕, 월덕, 태극, 문창, 학당, 재고, 금여록, 암록,
고신, 과숙, 겁살, 재살, 천살, 지살, 월살, 육해, 괴강, 원진, 공망, 천문성.

- `DEPTH_ALIASES`는 재료의 동일성만 정한다. 계산 규칙/Fusion canonical ID는 바꾸지 않는다.
- 도화/년살 및 native/extractor alias는 packet의 같은 feature에 합치고 모든 observation/source/lineage를 남긴다. 좋은 패 지지 근거를 추가로 만들지 않는다.
- 양인은 결단·경계·독립, 현침은 오류 탐지·정확한 말로 분리했다.
- 도화는 첫인상, 홍염은 친밀해진 뒤의 매력으로 분리했다.
- 귀문/백호에 귀신·질병·사고·죽음 해석을 넣지 않았다.

## 3. Phase 4가 사용할 packet

진입: `src/lib/interpretation-v4/materialPacket.ts`의 `buildMyeongliMaterialPacket({ calculation, mbti?, subject? })`.

| 필드 | 의미/사용 제한 |
|---|---|
| `version`, `scope`, `subject` | `v4-material-packet-1`, `natal-material-only`, 기존 주체 |
| `selected[]` | 현재 gate를 통과한 strong 근거에 연결된 재료. 단순 KB 존재는 통과 근거가 아님 |
| `selected[].material` | feature/category/imagery/use/sourceRefs와 seeds 배열 |
| `seeds[]` | 안정된 ID, role, domains, valence, 고객 문장. 같은 문자열을 여러 domain으로 복제하지 않음 |
| `selected[].evidence` | 원래 observation 및 status/strength/reasons 전체. alias 합치기 전의 근거도 보존 |
| `sourceRefs`, `lineage` | 계산 근거와 지식 source + 새 V4 편집 재료 출처 |
| `held[]` | 불확실/미지원/약한 근거/재료 없음의 이유. 고객 카피를 포함하지 않음 |
| `symbolicElements[]` | 검증된 4주에서 기존 weighted label을 투영한 5개 symbolic suggestion. 항상 `heroEligible:false`, `symbolicOnly:true` |
| `fusions`, `fortuneComposites` | 기존 Phase1/2 결과 그대로. 재료 증설로 새 pair/rule/score를 만들지 않음 |

### 선택 정책

- `confirmed-profile`: 확인된 일간/일주의 서로 다른 관점을 제공한다. 확정된 사건이나 전인격 진단으로 사용하지 않는다.
- `strong-evidence`: 기존 evidencePolicy에서 strong/usable이어야 한다. 같은 재료 alias 중 하나가 불확실하면 전체를 보수적으로 보류한다.
- 구조는 Phase2 confidence를 그대로 사용한다. strong 미만에 단정형 카피 없음.
- 무인성/무식상은 `support-only`. 중립적인 자기 점검 재료를 저장하지만 현재 packet은 선택하지 않는다. 능력·가족·사랑의 결핍으로 바꾸지 않는다.
- 오행 low는 기존 WEAK/MISSING을 묶은 생활 이미지다. 강약 숫자나 신규 판정식이 아니다. 출생시간 불명/4주 미확정이면 5개 모두 보류한다.
- 오행 projection은 원본 weighted/visible/labels가 기존 `analyzeFullElements`와 일치하는지도 확인한다. 계산 함수 자체 변경 없음.
- 원국 신살을 대운/세운/월운 신살로 재사용하지 않는다. 이 packet에는 transit adapter가 없다.

### 후속 composer가 해야 할 일 — 이번에는 구현하지 않음

- packet을 순서대로 모두 출력하지 않는다. `role/domain/use`로 필요한 대안을 골라 감정·분량·주인공 feature를 분산한다.
- 같은 뿌리의 일간/일주/십성/구조 문장을 별개의 장점으로 모두 반복하지 않는다. 현재 provenance를 이용해 문맥 중복을 조정해야 한다.
- MBTI와 일주가 다른 방향을 보이는 것은 자동 오류나 자동 fusion이 아니다. 이미 검토된 Fusion만 쓰고, 나머지는 다음 단계에서 검토한다.
- 같은 feature의 identity/work/love/scene 중 역할이 다른 문장을 선택한다. 본문의 재미/호흡 평가는 최종 composer 단계에서 별도로 필요하다.
- symbolic suggestion을 원인·효능·치료처럼 쓰거나 “오행이 부족해서 수영해야 한다”로 변환하지 않는다.

## 4. 실제 고객 seed 예 15개

| 근거 | seed |
|---|---|
| 정축 일주 · 애정 | 좋아하면 시간을 내고 약속을 지킵니다. 자주 곁에 있는 것이 꽤 큰 표현입니다. |
| 병자 일주 · 장면 | 모임에서는 제일 즐겁게 웃고 돌아오는 길에는 내가 한 말을 복기합니다. |
| 무신 일주 · 팩폭 | 혼자 해결해놓고 다들 일이 쉬웠던 줄 아는 게 억울합니다. |
| 경자 일주 · 팩폭 | 위로 한마디를 기다렸는데 사건 정리표부터 건넵니다. |
| 경오 일주 · 팩폭 | 재미로 한다더니 지고 나면 표정부터 달라집니다. |
| 겁재 · 장면 | 친구가 운동 기록을 올리자 안 가려던 날에도 운동화를 신습니다. |
| 정재 · 돈 | 돈복 중에서도 들어온 것을 지키고 쌓아두는 감각이 선명합니다. |
| 편관 · 팩폭 | 위기는 끝났는데 혼자만 아직 비상근무 중입니다. |
| 장성 · 좋은 패 | 앞에 서고 이름을 알리는 명예의 힘이 있습니다. |
| 천을 · 캐릭터 | 사람복이 있습니다. 도움을 주고받을 연결이 좋은 패입니다. |
| 재고 · 장점 | 돈뿐 아니라 기술·경험·고객을 쌓아두는 힘이 있습니다. |
| 현침 · 장점 | 허점을 찾아 고치는 예리한 눈과 정확한 말이 무기입니다. |
| 도화 · 연애 | 처음 마주친 순간의 표정과 인상이 만남의 문을 여는 좋은 패입니다. |
| 홍염 · 연애 | 여럿이 있을 때보다 둘이 이야기할 때 상대가 느끼는 매력이 더 커집니다. |
| 재다신약 후보 · 팩폭 | 벌 시간을 늘렸는데 정작 쓸 시간은 사라졌습니다. |

## 5. 12개 실제 계산 fixture 검수

모두 실제 `calculateSaju` → 기존 Fusion/구조 → material packet을 통과한다. 서로 다른 일주만 골랐다. 아래는 입력의 정확한 시각이며 unknown 별도 반례도 검증한다. 사용자 실데이터가 아닌 테스트 입력이다.

| 생년월일/시간 | MBTI | 일주 | 신살 종류 | 읽히는 차이 |
|---|---|---|---:|---|
| 1984-03-18 05:30 | ENTJ | 신해 | 13 | 조용한 취향 탐구 + 현실 결과 욕심; strong 재다신약/식상생재 |
| 1990-03-18 01:30 | ISTJ | 임오 | 9 | 큰 경험·표현과 약속을 지키려는 Fusion의 대비; 재생관 |
| 1984-09-27 13:30 | INFJ | 갑자 | 9 | 신중하게 준비한 출발, 자료를 모아 방향 제시; 관인상생 |
| 1984-07-27 15:30 | INTP | 임술 | 20 | 새 길을 보되 약속부터 정리, 문제를 깊게 배우는 살인상생 |
| 1999-12-06 01:30 | ESTP | 임진 | 14 | 큰 그림과 첫 실행의 간격, 잘못된 방식을 묻는 상관견관 |
| 1994-11-18 07:42 | ENFP | 무신 | 15 | 위기 수습·재활용 감각, 상상과 경험 연결; strong 구조 없음 |
| 1988-03-22 14:10 | ISTJ | 병자 | 10 | 겉의 밝음과 귀가 후 복기, 확인·기억의 Fusion |
| 1997-08-05 09:30 | ISFP | 기묘 | 11 | 식사·귀가시간까지 챙기다 내 선택을 미룸; strong 구조 없음 |
| 1995-04-09 09:15 | ESFJ | 경오 | 15 | 관객 앞의 결단·승부욕, 돈과 이름 fortune composite |
| 1985-06-30 06:00 | INFJ | 경자 | 10 | 하소연에서 사실관계를 정리, 혼자 생각할 시간 |
| 2001-01-27 18:20 | ESTP | 경인 | 15 | 직접 길 확인·빠른 행동, 설명보다 먼저 움직임 |
| 1987-05-18 09:30 | ISFJ | 정묘 | 5 | 부드러운 온도와 선물 기억, 말하지 않은 취향 |

- 신강/신약 레벨 weak/balanced/strong/veryStrong, 오행 high/low/balanced, 신살 5~20종, 구조 성립/미성립 포함.
- 12개 일주 seed 전체와 연결된 Fusion/fortune 문장을 읽어 차이를 확인했다. 성향 재료가 서로 다른 것이며 완성 report 품질을 검증했다는 뜻은 아니다.
- ESFJ 경오/ISFJ 정묘는 현재 검토된 MBTI Fusion 매칭이 0이다. 명리 packet은 정상이며 억지 pair를 추가하지 않았다. MBTI 규칙 빈칸은 후속 검토 사항이다.
- 도화/년살 중복은 신해 등 실제 fixture에서 하나의 재료로 합쳐진다. provenance는 각각 유지된다.
- 출생시간 모름(1997-08-05)은 확인된 일간/일주 유지, 오행 상태와 낮은 confidence 구조 단정은 보류한다.

재현/전체 JSON export:

```sh
V4_PHASE3_EXPORT=/tmp/gyeol-v4-phase3-material-packets.json pnpm test tests/unit/interpretation-v4/materialDepth.test.ts
```

이 로컬 파일에는 coverage와 12개 **전체 material packet**이 들어간다. export는 테스트의 명시적 opt-in에서만 실행되고 repository/runtime에는 쓰지 않는다.

## 6. 검증

| 검증 | 결과 |
|---|---|
| Phase3 coverage/품질/packet/12 fixture | 160 PASS |
| 전체 V4 | 7 files / 525 PASS |
| 관련 saju/knowledge/tables/V3/V4/generation/paid delivery 회귀 | 129 files / 2,539 PASS, 0 FAIL (V4 포함) |
| exact duplicate | 정규화한 seed 0, 이미지 0 |
| 60일주 같은 role의 공통 뼈대 | 18자 도입부 중복 허용 최대 2 gate 통과, 4문자 n-gram Jaccard 0.68 이상인 쌍 0 |
| source integrity | 실제 KB/taxonomy/일주/native rule의 참조 확인 |
| unsupported/mangsin/weak hero | 선택 0 |
| JSON / 순수성 | serializable, deterministic, 입력 mutation 0 |
| lint | PASS |
| build | PASS, `OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build` |
| diff-check | PASS |

중복 검사는 문구 차이에 대한 제한된 gate이며 의미 반복 0을 증명하지 않는다. 긍정 마무리의 비슷한 표현이나 같은 근거의 영역 간 중복은 Phase4 전체 문맥 검수가 필요하다.

### 변경 파일 범위

- `interpretation-v4`: dayMaster/dayPillar/element/tenGod/marker/structureDepth 자료, materialDepthTypes/materialDepth/materialPacket, 기존 materialRegistry/types의 연결.
- 테스트 `tests/unit/interpretation-v4/materialDepth.test.ts`, 이 문서.
- V3/계산/paid delivery/UI/DB/결제/Production/env 파일 변경 없음.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 상태를 보존하고 stage 대상에서 제외.
- `v4/rebuild`만 commit/push. composer/UI/master merge는 시작하지 않고 STOP.
