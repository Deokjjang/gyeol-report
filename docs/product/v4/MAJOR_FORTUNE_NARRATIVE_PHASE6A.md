# V4 Major Fortune Narrative — Phase 6A

기준: `v4/rebuild`, Phase 5C `630736baf34b6fcace4cb7530efde95a1e244161`.
검수 시각: `2026-10-01T12:00:00+09:00`. UI/route/paid delivery 연결 없음.

## 구현과 경계

| 모듈 | 역할 / 재사용 |
| --- | --- |
| `majorEvidence.ts` | 기존 `createMajorFortuneV3`의 writer-disabled 경로에서 canonical horizon/전환을 읽음. `calculateMajorFortuneSaju`, `buildMajorFortuneDecadeReading`, 기존 연간 간지·십성 규칙 재사용 |
| `majorMaterials.ts` | 계산된 대운/세운 십성의 좋은 힘·과사용·돈·사람·생활·제목 재료. 오행은 생활 이미지로만 사용 |
| `majorContext.ts` | 기존 Career Context의 function 우선, work mode 분기. 직장/사업/프리랜서/학생/취준/휴식. 재무 직무의 장면 별도, 영업·디자인 장면 보정 |
| `majorAnnualStories.ts`, `majorSceneDetails.ts` | 실제 연간 십성에 따른 20개 첫/재등장 서사, 현재 일에 비춘 구체적인 장면. 미래 직업·과거 사건을 확정하지 않음 |
| `majorYearNarrative.ts` | 14개 연도, 실제 합/충 등 관계 선택, 전환 연도 보강, 연도별 근거 연결. 표현·배움 주인공에 따라 문단 순서 변화 |
| `majorBehavior.ts` | 기존 Fusion과 실제 MBTI DB trait가 함께 있는 경우만 현재/다음 대운에 대한 행동을 보정 |
| `majorComposer.ts` | 도입 → 현재 맥락/원래 좋은 패/관계 → 전환 비교 → 14년 → 긍정적인 결말. 기존 `paragraph/proof`와 editorial guard 사용 |

- 공개 진입점: `composeMajorFortuneNarrative(payload, evaluatedAt)`; 타임존 포함 평가 시각을 명시적으로 받음. 같은 입력/시각은 같은 packet.
- 새 역법·대운·세운 엔진 없음. V3 본문을 V4 본문으로 복사하지 않음.
- 숫자 점수/등급 없음. 정확한 수익·사건·결혼시점·질병 예언 없음.
- provider/DB/결제/환경파일 변경 없음. 생성 경로의 `fetch` 호출 0 테스트.
- 원국 신살은 **원래의 좋은 패**에서만 사용. 연도 신살로 둔갑시키지 않음. 연도 block의 natal `features`는 빈 배열이고 canonical 연도 evidence refs를 가짐.
- 강한 V4 structure material만 기존 gate를 거쳐 선택. 망신살 충돌 및 unsupported 항목의 기존 suppress 유지.
- 전환의 exact instant 또는 `earliestKst/latestKst` 보존. 현재 시각이 불확실한 전환 범위 안이면 `CURRENT_DAYUN_BOUNDARY_UNCERTAIN`으로 반환하며 이후 대운을 현재로 단정하지 않음.
- 나이는 기존 계약의 세는나이. 전환 연도의 제목에는 `이전 대운 → 이후 대운` 모두 표시.
- 현재 bridge는 ENTJ/INFJ/ENFP/ESTP/INTP의 검증된 Fusion rule을 지원. 나머지 유형도 전체 명리 본문은 생성하되, 해당 bridge가 없으면 MBTI 문장을 억지로 만들지 않음. 16유형 + unknown의 달력 불변/빈 결과 정책 검사. **16유형 모두의 개별 대운 행동 문체를 완성했다는 의미는 아님.**

## Structured packet

```text
ok / errors
narrative: headline, opening, sections, finalLine, finalProof
evidence: input, calculation, materials, evaluatedAt, currentYear,
          horizon(rows, activeCycle, transitions), years, precision,
          dayunSelection, sourceRefs
years[14]: year, age, cycle, beforeCycle, annual,
           timePosition, title, goodTheme, cautionTheme,
           selectedRelation, sceneFamily, blocks, proof
transitions: exact/range, before/after, blocks
behaviorBasis: MBTI type, actual Fusion rule/trait refs, periodTenGod, stage
completeness / editorial
```

전환 문단은 이전·이후 cycle refs를 각각 보존. 연도별 전체 relation facts와 선택된 harmony/tension 모두 남기므로 고객 문장에서 생략한 근거도 내부 추적 가능.

## 6명 전문 검수

자동 guard 결과와 아래 수동 판정은 구분한다. 전문을 읽고 고친 항목: 주제어의 과도한 반복, 휴식 중인 사람의 현재 회사 전제, 학생 장면의 표현, 전환 연도 한쪽 대운만 보이던 표기, 사전식 연결 문장, 연도별 동일 도입부.

| 인물 / 실제 입력 | 현재 → 다음 대운 | 직접 읽은 특징 | 최종 판정 |
| --- | --- | --- | --- |
| 도윤, 남, 1985-06-30 06:00, INFJ, 온라인 교육사업 대표, 기혼 | 戊寅 편인 → 2033 丁丑 정관 | 재구매 이유·가격·팀·대표의 판단이 각각 다른 해의 장면. 배움에서 신뢰/역할로 이동 | No issue |
| 서진, 여, 1990-07-18 05:30, ENTJ, B2B SaaS 영업기획, 연애 | 己卯 정재 → 2034 戊寅 편재 | 고객 요구·제품팀·평가·결정권·이직 제안. 책임을 권한과 함께 잡으려는 반응 | No issue |
| 서윤, 여, 1994-11-18 07:42, ENFP, 프리랜서 브랜드 디자이너, 솔로 | 壬申 편재 → 2028 辛未 상관 | 소개 의뢰·단가·수정 범위·개인 작업·다른 분야 고객. 바깥의 거래에서 자기 표현으로 이동 | No issue |
| 하린, 여, 2001-01-27 18:20, ESTP, 체육 전공 학생, 썸 | 丁亥 정관 → 2028 丙戌 편관 | 실습·경쟁·현직자·준비비·처음 맡은 역할. 직접 해보며 판단하는 반응 | Minor 1 |
| 준서, 남, 1987-05-18 09:30, MBTI 모름, 휴식/이직 준비(이전 바리스타), 관계 미선택 | 辛丑 편재 → 2031 庚子 정재 | 생활비·작은 재시작·지인·기술·내 속도. MBTI를 추정하거나 모름을 결핍으로 표현하지 않음 | No issue |
| 나영, 여, 1984-07-27 15:30, INTP, 제조업 재무기획 과장, 결혼 준비 | 丁卯 정재 → 2031 丙寅 편재 | 예산/실적·비용 판단·검토 가치·부서 간 기준. 숫자 뒤 이유를 이해한 뒤 움직이는 반응 | Minor 2 |

**수동 합계: Blocker 0 / Major 0 / Minor 2 / No issue 4.**

- Minor 1: 학생의 먼 미래도 현재 배움/실습에 비춘 예시가 많다. 학생 신분 지속을 예언하지는 않지만, 이후 생활의 폭을 더 풍부하게 보여줄 여지는 남음.
- Minor 2: 재무 보고서에서 긴 주제어(예산 판단, 검토 가치 등)의 재등장이 다른 인물보다 눈에 띔. 동일 문장/장구절 중복은 없지만 의미상 리듬은 추가 변주 가능.
- 문장을 삭제하는 후처리로 guard를 통과시키지 않음. 원래 생성 문장/장면을 수정했으며 고객 전문은 약 10,556~11,932자. 길이는 참고값이지 품질 판정 근거가 아님.

### 대표 도윤의 14년 제목

| 연도 / 나이 | headline |
| --- | --- |
| 2023 / 39 | ‘원래 그래요’가 유난히 거슬리는 시기 — 큰 배경도 바뀝니다 |
| 2024 / 40 | 밖으로 나간 대화가 돈의 힌트가 됩니다 |
| 2025 / 41 | 벌고 끝내지 않고, 내 것으로 남기는 해 |
| 2026 / 42 | 어려울수록 내 판단을 찾는 사람이 생깁니다 |
| 2027 / 43 | 칭찬에서 끝나지 않고 역할이 붙는 해 |
| 2028 / 44 | 딴생각 같던 질문이 다음 길의 입구입니다 |
| 2029 / 45 | 배워둔 것이 나 대신 문을 열어줍니다 |
| 2030 / 46 | 허락을 기다리던 자리에서 내가 고르는 쪽으로 |
| 2031 / 47 | 같이 하자는 말이 평소보다 솔깃해집니다 |
| 2032 / 48 | 좋아해서 한 일이 내 실력을 보여줍니다 |
| 2033 / 49 | 잘 참는 사람보다 다른 답을 내는 사람으로 — 큰 배경도 바뀝니다 |
| 2034 / 50 | 큰 제안보다 끝까지 돌아오는 돈을 봅니다 |
| 2035 / 51 | 덜 새는 돈과 덜 지치는 하루가 힘이 됩니다 |
| 2036 / 52 | 책임이 커질수록 내 몫도 선명해야 합니다 |

### 전환 before / after

도윤: **2033-07-15 08:00 KST**, 戊寅 편인 → 丁丑 정관.

| 축 | 이전 | 이후 |
| --- | --- | --- |
| 중심 | 원인을 파고 전문성을 쌓음 | 신뢰가 이름·역할로 남음 |
| 일 | 재구매가 멈춘 이유를 고객 경험에서 찾음 | 대표의 판단을 믿고 맡기는 역할 |
| 돈 | 다른 지식에 시간을 쓰는 선택 | 책임과 보상을 같이 보는 기준 |
| 사람 | 새 관점을 나누는 사람 | 경험을 믿고 맡기는 사람 |
| 관계/생활 | 혼자 생각할 여백 | 함께 지킬 약속, 일 뒤 조용한 저녁 |
| INFJ 반응 | 오래 할 이유와 의미를 먼저 그림 | 많은 연락처보다 깊은 대화/협력으로 확장 |

다른 전환: 서진 `2034-01-14 17:30`, 서윤 `2028-04-23 21:42`, 하린 `2028-06-09 08:20`, 준서 `2031-05-15 11:30`, 나영 `2031-05-07 17:30` (모두 KST, 기존 계산 그대로).

### 실제 문장 예

- 돈/사업: “많이 팔렸다는 기쁨과 마감 뒤 남는 돈은 표정이 다를 수 있습니다. 준비비와 응대 시간이 보이기 시작하면 가격을 말하는 자신감도 달라져요.”
- 자리/명예: “함께 일하는 사람이 대표의 판단을 기다리는 자리는 맡겨도 되는 사람으로 인정받을 명예운을 써볼 한 장면입니다.”
- 원국 천을 사람복: “고객에게 줄 경험에서 막힌 이야기를 편하게 꺼낼 사람이 있다는 것은 큰 자산입니다.” (연도에 새 귀인이 생긴다는 주장이 아님)
- ENFP 행동: “반응이 오면 더 신나지만, 재미있는 제안 셋이 동시에 오면 몸은 여전히 하나라는 점이 난감합니다.”
- ENTJ 행동: “책임이 생겼다는 말보다 무엇까지 내가 결정할 수 있는지가 더 궁금해집니다.”
- INFJ 행동: “의미 있는 일을 혼자 감당해야 한다는 마음까지 가져갈 필요는 없어요.”
- 현실 팩폭: “매출은 늘었는데 둘 다 자기가 더 많이 했다고 느끼면 반가운 숫자도 불편해집니다.”

## 검증

| 항목 | 결과 |
| --- | --- |
| 6개 fixture completeness | 각각 14/14, 미래 10/10, age 14/14, final 있음 |
| 전환 | 총 8개 구간 변화 모두 본문에 있음. exact 전환 직전/직후 active cycle 테스트 PASS |
| 84개 연도 | 4~6개 prose block, 연간 본문 391~623자, strongest ten-god/actual relation 기반 |
| 문장/장구절 guard | 6개 내부 및 cohort exact sentence/headline/final 중복 0, guard의 12어절 span 중복 0 |
| V4 전체 | 809 tests (관련 회귀 실행에 모두 포함) |
| 계산/V3/테이블/V4/기존 Major/paid delivery 관련 회귀 | **3,023 PASS / 0 FAIL, 152 files** |
| 기존 V4 해시 | Comprehensive 12 / Career 8 / Love 8 / Compatibility 8 유지 |
| 상태/MBTI | 6 관계상태, 별도 취준, unknown MBTI, same saju/different MBTI, same MBTI/different saju PASS |
| 시간 정밀도 | exact, approximate, unknown의 canonical 계약 비교; 불확실 전환 중간은 fail-closed |
| lint | PASS, 경고 없음 |
| build | PASS, 로컬 Next build. 샌드박스에서 진행이 멈춘 첫 실행 종료 후 제한 밖 로컬 빌드 재실행. 배포 없음 |
| TypeScript 추가 확인 | 기존 389 diagnostics 유지, 이번 V4 파일 신규 오류 0. 저장소 전체 `tsc`가 깨끗한 상태는 아님 |
| diff-check | PASS |

실행 로그: `/tmp/gyeol-v4-phase6a-{regression-final,lint-final,build-final,tsc-final}.log`.

### 전문과 재현

```sh
V4_PHASE6A_EXPORT=1 pnpm test tests/unit/interpretation-v4
```

생성물: `/tmp/gyeol-v4-phase6a/index.md`, `01-business`~`06-transition`의 `.md` 전문 및 `.json` structured packet, `evidence.json`, `cohort-qa.json`. 임시 검수 산출물은 commit하지 않음.

원격 push 범위는 `origin v4/rebuild`뿐. 기존 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 보존. 기존 소스/DB/계산/UI/유료 배송 수정 없음. **Annual/UI/master merge는 시작하지 않고 STOP.**
