# P1 Fusion 작성 배치 브리프 (서브에이전트용)

Fusion = 명리 요소 하나 × MBTI 대상 하나의 결합 규칙. 리포트의 차별점("이 명리 특징 때문에 내 MBTI가 이렇구나")이 여기서 나온다. 이 문서 + 아래 "먼저 읽을 것"이 전체 맥락이다. 저장소 밖 탐색·API 호출·커밋 금지. 자기 파일만 쓴다.

## 먼저 읽을 것
1. `docs/v5/p1-batch-brief.md`의 "문장 기준" 절(금지 표현·장면 기준·용어 누출 규칙).
2. `src/data/knowledge-v5/schema.ts` → `FusionRuleSchema` / `FusionFileSchema` (정확한 출력 형식).
3. `src/data/knowledge-v5/fusion/gold.json` — 기준 3개. `why`와 `scene`의 수준이 기준이다.
4. `docs/v5/p1-fusion-candidates.json` — 당신 배치(`batch` 필드)의 후보 목록. `featureId`, `mbti`, `kind`, `dimension`, `strength`, `contributions`(어느 차원이 왜 겹치는지)가 적혀 있다.

## 쓰는 법
- 후보마다 `src/data/knowledge-v5/myeongri/*.json`에서 그 `featureId` 항목을, `src/data/knowledge-v5/mbti/<TYPE>.json`에서 그 유형을 **grep으로 읽는다**(oneLiner·image·scenes·strengths·overuse·mbtiLinks / signals·shadows·cognitiveFunctions). 두 쪽의 **실제 문장**에서 겹치는 지점(공명) 또는 당기는 지점(긴장)을 찾아 쓴다. 차원 태그 점수는 출발점일 뿐, 읽어 보고 kind를 바꿔도 된다(겹치면서 동시에 당기면 `conditional`).
- `id`: `fusion:<featureId>:<TYPE>` (예 `fusion:shinsal:DOHWASAL:ESFP`).
- `why`(10~220자, 2~3문장): 첫 문장은 명리 쪽 근거("현침의 바늘은 틀린 것을 그 자리에서 짚고"), 둘째 문장은 MBTI 쪽 근거("ENTJ의 Te는 결론과 책임을 먼저 묻습니다"), 셋째는 둘이 만나면 어떤 사람이 되는지. 명리 용어(현침·도화·정관 등 요소 이름)와 MBTI 코드·인지기능은 여기서 써도 된다. "타고난 X는 …, Y 성격은 …" 같은 고정 공식 반복 금지 — 쌍마다 문장 구조를 바꿔라.
- `scene`(20~140자): `sceneRequired: true`인 후보는 **필수**, 나머지도 가능하면 쓴다. 두 쪽이 겹친 결과가 생활에서 보이는 장면. 장면 안에는 MBTI 코드·명리 용어를 쓰지 않는다. 두 쪽 원본 장면을 그대로 복사하지 말라(전체 중복 검사).
- `dimension`: 후보의 중심 차원 id(온톨로지). `score`: 후보의 strength.
- `factBoundary.requires`: 항상 `"mbtiKnown"` 포함. featureId가 `shinsal:`·`gwiin:`·`twelveStage:`·`stem:`·`branch:`·`relation:`이면서 시주에만 있을 수 있는 요소면 추가로 `"exactTime"`은 넣지 않는다(브리프가 위치로 판정). `yinYang:*:MALE|FEMALE`이면 `"genderKnown"` 추가. `forbids`: 그 쌍에서 쓰기 쉬운 단정("연애 사건 단정", "직업 단정", "건강 단정", "외모 평가", "상사 갈등 사건 단정") 1~3개.
- `sources`: `[featureId, "mbti:<TYPE>:functionStack", ...]`.
- 파일: `src/data/knowledge-v5/fusion/batch-<X>.json` = `{ "version": "fusion-v5-2", "method": "cross-score 상위 후보(배치 X), 작성자 판단으로 kind 조정", "rules": [...] }`.

## 검사·보고
`pnpm exec tsx scripts/knowledge-lint.ts --only src/data/knowledge-v5/fusion/batch-<X>.json` → issueCount 0. 그다음 전체 `pnpm exec tsx scripts/knowledge-lint.ts`에서 자기 파일이 이슈를 더하지 않는지 확인(다른 파일 이슈는 보고만). 보고: 쓴 규칙 수, 장면 수, kind를 후보와 다르게 바꾼 쌍 목록(이유 한 줄), 가장 자신 있는 쌍 3개(why+scene 인용), 가장 약한 쌍 2개. 2,000자 이내.
