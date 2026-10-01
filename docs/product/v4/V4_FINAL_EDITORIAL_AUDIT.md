# V4 Phase 7A — 최종 본문 교정 감사

기준: `80d32dc3199ddc70542b344d430eea9f99546214`, `v4/rebuild`. 검수 기준시각은 기존 fixture의 명시적 clock(2026-10-01 KST)이다. UI·route·계산·V3·결제·DB·외부 생성 호출은 변경하지 않았다.

## 판정과 검수 범위

- 수동 판정: **Blocker 0 / Major 0 / 기존 Minor 11 → 2**. 9건 해소, 2건은 개선 후에도 남아 있다. 자동 검사를 수동 판정으로 치환하지 않았다.
- 기존 cohort 48개 + 동일 인물 golden 3명 × 6상품 = 66개 실제 deterministic 결과 생성.
- 전문 재독: 아래 알려진 Minor 11개. 이후 수정한 부분은 해당 문단을 다시 읽었다. golden 18개는 opening·핵심 성향·일/돈·관계·좋은 패·마지막을 상품 간 비교했다. 이미 No issue인 모든 전문을 다시 읽었다고 주장하지 않는다.
- 자동 후보: exact sentence, 12어절 공통 구절, 인접 문단 어휘/주제, scene family, 시작어, 길이, headline/final. 어휘 중첩은 의미 반복의 후보일 뿐 의미 판정기가 아니다.
- 새 경고였던 golden INTP Major의 인접 natal-gift 장구절은 근거를 유지하며 교정했다. 남은 경고를 숨기기 위해 guard를 완화하거나 문장을 자동 삭제하지 않았다.

## 기존 Minor 11건 before / after

| 상품 / 대상 | Before: 실제 원인 | After: 교정과 재독 판정 |
| --- | --- | --- |
| 종합 나영 | 후반 좋은 패까지 이해·원리를 다시 설명 | 학습복을 오래된 메모, 손에 익은 솜씨, 처음 배우는 사람에게 보여주는 보람으로 확장. 전문의 `이해` 7→5. **해소** |
| Career 유진 | 추천마다 설명형 3문장, 읽는 박자가 같음 | 프로젝트 조정의 질문, 운영 결과의 관찰, 버튼을 눌러보는 제품 검토, 이용자 연구로 전환. 추천 근거/개수 그대로. **해소** |
| Career 나영 | 강점·반응·돈·결말 모두 이유/문제/이해 | 마지막 확인, 동료가 아낀 시간, 작은 도구, 실력의 값으로 영역 분리. `이유` 9→7, `문제` 13→9, `이해` 5→3. **해소** |
| Love 도윤 | 친밀감·집·마지막까지 혼자 회복 | 공동 기억, 영화, 집의 취향, 둘만의 농담으로 확장. `혼자` 10→5. 경계/화해에 필요한 혼자 시간은 유지. **해소** |
| Love 예린 | 돌봄을 주기만 하지 말라는 뜻 반복 | 친밀감은 별명·사진·추억, 결말은 약속·둘의 역사로 전환. 현재 관계/잘 맞는 상대/생활 분담에는 상호 돌봄의 뜻이 아직 가까움. **Minor 유지** |
| Compatibility 사업 | 계약·역할 지침 뒤 결말도 지침 | 계약/위험 문단은 보존, lasting은 동업자가 아는 수고와 ‘네가 있어서 됐다’는 든든함. 조사 오류도 수정. **해소** |
| Compatibility INFJ×ISTP | opening부터 결말까지 독립/혼자 시간 | 취향을 초대하는 데이트, 말한 바람을 행동으로 받는 장면, 작은 수고를 알아보는 관계. 갈등/화해의 독립성은 유지. **해소** |
| Major 하린 | 먼 미래에도 현재 수업/학교 장면 지속 | 기준연도+3 이후는 생활비·사는 곳·책임의 끝·남에게 전하는 솜씨·새 환경의 도움. 졸업/취업/결혼을 확정하지 않는 조건형 미래. **해소** |
| Major 나영 | 재무 주제어 + 매년 같은 합 관계 문장 | 합이 실제 있는 해만, 각 십성·현재 직무의 만남/설명/신뢰/보상 장면으로 변주. `함께 다룰 접점` 9→0. 다만 `숫자 뒤의 판단` 29회, `예산과 실적을 설명하는 힘` 21회는 상단·전환·마지막까지 남음. **Minor 유지** |
| Annual 서윤 | ENFP는 연결한다는 설명이 짧음 | 취미 대화에서 작업의 단서 발견 → 말하면서 상대 반응으로 다음 질문 → 배움을 솜씨로 옮기는 흐름. 기존 Fusion을 확장, 새 기운 생성 없음. **해소** |
| Annual 하린 | 학생이라는 범주만 보이고 전공 체감이 얕음 | 실습/시범/연습 영상/준비물·공간·이동비/동료에게 보여주기. 체육 외 무용·조리 등 실습 입력에서도 동작 검증. **해소** |

남은 두 건을 무리하게 0으로 만들지 않은 이유:

- 예린: 실제 ISFJ 관계 재료·관인상생·정인 계열의 돌봄/책임이 겹친다. 단어만 바꾸거나 근거 없는 새 연애 캐릭터를 추가하면 오히려 일관성이 깨진다. 다음 교정은 같은 돌봄 안에서 즐거움·갈등 이전의 장면을 더 확보하는 방식이 적절하다.
- Major: 연도별 연결 장면은 달라졌지만 상단/전환/결말의 context 명사 실현 방식은 여전히 눈에 띈다. 기계적으로 동의어를 넣는 시도는 문장 결합을 어색하게 만들어 채택하지 않았다. 반복을 지운 짧은 본문으로 PASS 처리하지 않고 그대로 검수 자산에 남겼다.

## Golden cross-product — 한 사람의 다른 영역

세 인물의 생년월일·성별·시각·MBTI·직업·관계 입력을 상품마다 바꾸지 않았다. 궁합은 같은 인물을 A로, 소연(ESFJ)을 B로 넣은 관계 관점 검수이며 실제 관계 사건을 주장하지 않는다.

| Golden | 같은 핵심 결 | 종합 / Career / Love | Major / Annual / Compatibility |
| --- | --- | --- | --- |
| 서진 ENTJ, 甲 일간, B2B SaaS 영업기획, 연애 | 결과·압박 속 판단·예리함·인정 욕구 | 결과가 보여야 신남 / 고객 약속과 내부 판단·보상 / 좋아하면 해결해주고 싶음 | 축적에서 바깥 기회로 전환 / 2026 표현과 결과물 / 분명한 답과 정서 반응의 차이 |
| 나영 INTP, 기술 문서 번역가, 솔로 | 납득할 때까지 탐구하고 전문성으로 남김 | 버거운 경험을 설명으로 남김 / 원문·용어·검수 범위와 일값 / 한 사람의 생각을 오래 궁금해함 | 축적한 실력의 다른 쓰임 / 2026 외부 기회와 거래 / 생각이 끝나야 말하는 쪽과 반응이 와야 안심하는 쪽 |
| 서윤 ENFP, 브랜드 디자이너, 솔로 | 서로 먼 경험을 잇고 새로운 답을 보여줌 | 호기심과 대안 / 흩어진 요구를 이미지로·단가/범위 / 함께 하고 싶은 경험이 늘어남 | 외부 기회에서 새 표현으로 전환 / 2026 탐구와 전문성 / 새 생각을 나눌 자유와 상대 반응 |

- 5개 개인상품의 material packet이 golden별로 동일하다. narrative는 모두 다르다. 핵심 성향을 근거 없이 반대로 단정한 경우는 비교 범위에서 발견하지 못했다.
- 혼자 탐구하는 명리와 ENFP의 외향적 대화는 기존 contrast/연결 Fusion으로 설명된다. 유형을 바꿔 설명하지 않았다.
- 각 사람의 6상품 headline/final은 서로 다르다. 서로 다른 두 golden의 일반 연애 궁합 headline은 같을 수 있다. 모든 고객의 제목이 전역 유일하다고 주장하지 않는다.
- golden 현재 대운: ENTJ 己卯, INTP 丁卯, ENFP 壬申. 같은 순간의 Annual 활성 대운과 일치. UTC/KST 문자열이 아니라 instant로 비교한다.
- 다음 전환: ENTJ 2034-01-14 17:30, INTP 2031-05-07 17:30, ENFP 2028-04-23 21:42 KST. 두 상품의 canonical cycle 날짜가 일치한다.

## 중복 audit: 0이라고 과장하지 않음

‘묶음’은 같은 정규화 문장이 여러 위치에 등장한 그룹이다. 문장 발생 총수나 품질 점수가 아니다. 12어절 구절은 겹치는 구절을 위치 집합별로 묶었다.

| 범위 | Before | After |
| --- | ---: | ---: |
| 48개 cohort의 동일 문장 재사용 묶음 | 321 | 203 |
| 그중 상품 간 동일 문장 묶음 | 164 | 46 |
| 12어절 공통 구절 묶음 | 156 | 97 |
| 한 전문 내부 guard 경고 | 0 | 0 |
| golden ENTJ / INTP / ENFP 상품 간 동일 문장 | 각 21 | 각 3 |
| golden INTP 내부 장구절 경고 | 1 | 0 |

주요 조치와 남긴 공통 표현:

- Major와 Annual이 같이 쓰던 직업 장면 118개 문장 묶음을 제거했다. 월 단위 장면을 별도 copy 자료로 두되 계산/선택은 그대로다. 직장/사업/프리랜서/학생/취준/휴식 6모드와 재무 function을 구분한다.
- 월운 자료를 분리한 뒤 재무직과 일반 직장인에게 동일한 월 장면이 생기는 후보도 발견했다. 예산 가정, 부서 기여, 재무 설명, 승인, 보상, 다음 담당자 등으로 다시 교정했다.
- golden의 남은 3문장씩은 같은 일주 seed의 안쪽 성격·강점·관계 취향이다. 모든 발생 위치가 공통 seed ID를 갖는지 검증한다. 불필요한 생활 scene 복사와 구분했다.
- cohort의 나머지 46개는 atomic 성향/짧은 단점/동일 좋은 패 등의 공통 재료다. Annual 내부 157개 묶음은 여러 고객에게 같은 월 십성·지원 표식이 선택될 때의 의미/활용 설명이다. 개인화된 문장만으로 전부 교체하지 않았다. 자동적으로 모두 ‘필수 문장’이라고 판정한 것은 아니다.
- Major 6개 cohort의 기존 exact/장구절 guard는 유지해 PASS. Annual 6개 안에서도 전문 내부 exact 중복은 없다. 서로 다른 고객의 같은 사실을 전혀 다른 운으로 바꾸지는 않았다.
- 시작어 최댓값(한 전문): `당신은` 2, `그런데` 1. `이 사람은/올해는/이 달은/둘은/한편` 시작은 0. 제목과 prose를 포함한 진단이며 의미 단조로움이 0이라는 뜻은 아니다.

## 좋은 패·문맥·분량

| 상품 | 실제 근거를 쓴 긍정적 중심 | 문맥/완결성 |
| --- | --- | --- |
| 종합 | ENTJ 재성·압박 속 판단·장성/반안의 돈과 이름, INTP 학습/축적 | 개인 캐릭터 → 생활 → 좋은 패 → 방향 유지 |
| Career | 자리/명예, 전문성을 일값으로, 재고의 경험·기술 축적 | 직무 function과 고용 형태 우선, 취준·휴식에게 현재 회사 생성 없음 |
| Love | 도화 첫인상과 홍염 친밀 매력 구분, 귀인/인복 | 6관계 상태, 조건형 결혼/부모, 시간 unknown과 MBTI unknown 유지 |
| Compatibility | 역할 보완·관계의 합·서로 다른 표현을 해석 | 7category, 부모 A/자녀 B, 상사 A/팀원 B, 방향성과 swap 유지. 점수/등급 없음 |
| Major | 현재 대운의 재물/자리/명예/학습과 실제 전환 | 14/14, 미래 10년, 나이, 전환, final. 먼 미래 신분 확정 없음 |
| Annual | 해당 세운/월운의 좋은 패, 대운과의 실제 교차 | 12/12, 월 provenance/segment 순서/절입 경계, final |

- 66개 모두 positive로 표기된 문단 분량이 shadow보다 크다. 이는 보조 검사일 뿐, ‘좋게 느껴지는가’는 수동 재독으로 따로 확인했다.
- 짧은 지적 뒤 긴 상담 지침을 덧붙이지 않았다. 알려진 지침 과다였던 사업 궁합도 계약·위험은 남기고 마지막을 동업의 보람으로 바꿨다.
- MBTI unknown은 기존 명리 단독 분량과 결말 유지. unsupported/ambiguous evidence를 추가하지 않았다.
- exact/approximate/unknown, 현재/과거/미래 및 12개 절입 직전/직후 테스트는 기존 검증을 그대로 재실행한다. 원국 신살을 월운으로 복사하지 않는다.
- 고객 텍스트의 internal ID/provenance/confidence/undefined와 금지 업무용 어휘를 자동 검사. 읽은 전문에서 설명 없이 내부 구조명을 던지는 문장이나 확정 질병/사건 예언은 발견하지 못했다.
- 분량은 점수화하지 않았다. Major의 먼 미래 장면을 늘렸고, 월운 역시 충분한 설명/장면/좋은 활용을 유지했다. 자동 삭제/문장 자르기 후처리는 없다.

## Product readiness

아래 PASS는 **오프라인 V4 본문/packet**의 이번 검수 범위에 한한다. 유료 runtime/UI 통합이나 출시 승인이 아니다.

| 상품 | 근거 | 본문 | 차별화 | 문맥 | 반복 | 완결성 | 마지막 감정 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Comprehensive | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Career | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Love | PASS | Minor | PASS | PASS | Minor | PASS | PASS |
| Compatibility | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Major | PASS | Minor | PASS | PASS | Minor | PASS | PASS |
| Annual | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

## 개선 문장 예

1. 종합: “예전에 빼곡하게 적어둔 메모를 다시 펴면 이제는 적지 않아도 할 줄 아는 부분이 보입니다.”
2. Career: “남들이 안 누른 버튼을 굳이 눌러보는 눈도 쓸모가 있습니다.”
3. Career: “재미있어서 붙든 일인데 상대에게는 며칠을 아껴준 일이 되기도 합니다.”
4. Love: “깊은 사랑이 꼭 무거운 사랑일 필요는 없습니다.” — 실제 문단에서는 둘만의 농담/즐거움과 연결.
5. Compatibility: “한 고비를 지나 ‘이번엔 네가 있어서 됐다’고 웃는 장면에, 혼자 벌 때는 없던 든든함이 있습니다.”
6. Major: “스스로 남겨둔 돈이 다음 선택을 급하게 만들지 않는 바탕이 될 만합니다.”
7. Annual: “혼자 모은 생각을 말로 꺼내는 동안 상대의 반응이 다음 질문을 만들어줍니다.”
8. Annual: “처음 찍어둔 실습 영상과 지금의 움직임을 나란히 봅니다.”

## 회귀와 재현

- `finalEditorial.test.ts`: 66개 reviewed narrative 해시와 **교정 전** evidence/material/selection/behavior/person/direction/completeness/문단 proof 해시를 각각 검사. 기존 phase의 출력 해시 13개 변경은 승인된 본문 교정에 한해 기록했다. 원래 해시는 `finalEditorialBaseline.json`의 `before`에 보존한다.
- `V4_FINAL_AUDIT_EXPORT=after pnpm test tests/unit/interpretation-v4/finalEditorial.test.ts`: 66개 전문/packet, 비교문, 해시, 자동 후보를 재생성. `/tmp`는 검수 산출물이며 runtime 입력이 아니다.
- V4 전체, 명리/knowledge/table/V3, calendar/Jie/precision/annual/major generation, MBTI/Fusion, paid completeness/one-call delivery 회귀 실행. 최종 수치는 아래 검증 기록에 확정한다.
- lint/build는 로컬 실행. build는 OpenAI writer 및 paid reliability 외부 연동을 비활성화한 기존 검증 방식. `.env` 변경 없음.
- tsc는 baseline 389건 비교만. clean tsc라고 보고하지 않는다.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 작업 전부터 존재한 unrelated 상태를 보존하고 stage하지 않는다.

### 최종 검증 기록

| 검증 | 결과 |
| --- | --- |
| V4 전체 | 25 files / **916 PASS, 0 FAIL** |
| V4 포함 관련 회귀 | 151 files / **2,998 PASS, 0 FAIL** |
| paid completeness / one-call delivery | 위 회귀에 포함, PASS |
| 66개 교정 전 evidence/material/selection/문단 proof | 변경 0 |
| Major / Annual completeness | 각 9개 packet(기존 6+golden 3), 14/14+미래10년 / 12/12 |
| lint | PASS |
| build | PASS (`OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0`) |
| tsc baseline 비교 | 기존 389 / 현재 389 / 신규·제거 진단 0 |
| diff-check | PASS |

로그: `/tmp/gyeol-v4-final-audit-v4-final.log`, `/tmp/gyeol-v4-final-audit-regression-final.log`, `/tmp/gyeol-v4-final-audit-lint.log`, `/tmp/gyeol-v4-final-audit-build-final.log`, `/tmp/gyeol-v4-final-audit-tsc.log`.

로컬 build가 성공해도 repo 전체 tsc 부채가 해결됐다는 뜻은 아니다. 이전 단계의 V4 prose hash 실패는 13개 승인된 본문 교정임을 before/after로 확인한 뒤 갱신했다. 원래 계산·V3·delivery assertion은 완화하지 않았다.

## 다음 runtime/UI integration의 contract — 설계 기록만

- 6개 composer 결과에서 고객에게는 `headline/opening/sections/finalLine`만 projection. `proof`, material, input 원본, rule/source IDs는 internal 저장 계약으로 분리.
- version과 source provenance를 별도로 보존. 기존 V2/V3 snapshot을 V4로 재해석/덮어쓰지 않음.
- Major `evaluatedAt`, Annual `currentDate`/선택연도와 precision을 명시적으로 전달. 저장 report를 읽을 때 ambient 오늘 날짜로 본문 재생성 금지.
- 14개년/12개월/transition/final completeness를 publish 전 검사. 성공한 packet 전체를 저장하고 일부 section만 전달하지 않음.
- 궁합 role version, A/B 방향, category와 symmetric evidence를 보존. 고객 점수 필드를 다시 만들지 않음.
- 원문 직업/관계 입력과 normalized context를 구분. 고객에게 내부 taxonomy 노출 금지.
- 실제 renderer 연결 때 hydration·390/768/1440·만세력/MBTI·공유·paid footer 회귀는 별도 필요. 이번 Phase에서 UI 확인 또는 Production readiness를 주장하지 않음.

산출물: `/tmp/gyeol-v4-final-audit/`의 `before/`, `after/`, `readiness-summary.md`, `golden-summary.md`, `minor-review-index.md`. UI/route/master/배포는 시작하지 않고 종료한다.
