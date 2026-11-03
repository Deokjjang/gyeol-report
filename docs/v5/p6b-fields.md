# P6b 새 Book 필드 (화면 작업 ②와의 계약)

확정 2026-11-03. 원고 쪽(P6b, 브랜치 `v5/p6b`)이 저장 스냅샷에 아래 필드를 쓴다. 화면 쪽(②)은 이 이름으로 읽는다.
이름·모양을 바꿔야 하면 이 문서를 먼저 고치고 push한다.

## 공통 규칙

- 저장 위치: `ProductPreviewSnapshot{productVersion:"v5"}`의 `draft`(V5BookDraft)와 `evidencePacket`(V5Evidence). 타입은 `src/lib/writer/book.ts`.
- `draft.version`은 `"v5-book-1"` 그대로 둔다. 새 필드는 모두 **선택(optional)** 이다. P6b 이전에 발행된 Book에는 없으므로 화면은 없을 때 지금처럼 보여 준다.
- 나이는 모두 **만 나이**(숫자만 저장, 표시 "만 N세"는 화면 몫).
- 문자열은 고객에게 그대로 보여 줄 수 있는 문장이다(내부 id·용어 라벨 없음).

## 1. 판 정보 (A-4)

```ts
draft.edition?: { number: 5; label: "제5판"; revisedAt: string /* YYYY-MM-DD, 판 개정일(책마다 같은 값) */ }
```

## 2. 작가 경로 (A-2)

```ts
evidencePacket.meta.writer: { provider: string; model: string } | null   // 실제로 원고를 쓴 모델(기존 필드, 대체되면 대체 모델)
evidencePacket.meta.fallback?: {
  from: { provider: string; model: string };                 // 처음 부른 모델(운영: anthropic/claude-sonnet-5-5)
  to: { provider: string; model: string } | "deterministic"; // 대체한 곳
  reason: string;                                            // 실패 코드(예: http_529, network, refusal)
} | null
```
화면 표시는 필요 없음(운영 기록용).

## 3. 핵심 이미지 (B-4)

```ts
draft.coreImage?: { line: string /* 한 줄, 예: "한여름 도시 아스팔트 위에 선 큰 나무" */; ruleId: string }
draft.pairImage?: { line: string /* 두 사람 관계 이미지 한 줄 */; a: string; b: string /* 각자의 coreImage line */; ruleId: string }   // 궁합만
```
규칙 표는 `docs/v5/core-image-rules.md`. 종합·커리어·연애·대운·세운은 `coreImage`, 궁합은 `pairImage`.

## 4. 궁합 관계 쉬운 문장 (D 궁합)

```ts
evidencePacket.pair.relationsPlain?: string[]   // 예: "두 사람의 태어난 날 글자가 서로 끌어당겨 함께 있으면 편해져요."
```
기존 `pair.relations`(용어 목록)는 그대로 둔다. 화면은 `relationsPlain`이 있으면 그것을 쓴다.

## 5. 대운·세운 카드 (E-2·E-3·E-4·E-5)

`draft.timeline.cards[]`(V5TimelineCard)에 추가:

```ts
period: "past" | "current" | "future"   // 기준일 대비 기간 상태(기존 when: past/now/future와 같은 뜻, 화면은 period를 쓴다)
imageLine: string                        // 카드 그림 줄. 간지 그림을 짧고 현대적으로 쓴 독립 문장(작가 원고를 잘라 오지 않음)
todo?: string                            // period가 current·future일 때: 앞으로 할 일 한 줄
review?: string                          // period가 past일 때: 지난 기간을 돌아보는 한 줄(질문형)
caution: string | null                   // "살필 점". 원국으로 판정해 해당하는 문장만. 해당 없으면 null(화면은 줄을 숨김)
age?: number                             // 연 카드만: 그해 만 나이(year − 출생 연도)
```

`draft.timeline`에 추가:

```ts
cycles?: { ganji: string /* 한자 2자 */; years: string /* "2021~2030" */; ages: [number, number] /* 만 나이 */; tenGod: string; current: boolean }[]
```

세운 달 카드의 `key`(`2026-M02`)는 **절기 순서**(M01 = 인월, 2월 4일 무렵 시작)이고 달력 달이 아니다. 달 이름은 `label`(예: "3월 무렵 辛卯(신묘)월 (03/05 절입부터)", 12번째는 "이듬해 1월 무렵 …")을 쓴다. 본문도 같은 이름을 쓴다.

`projectV5Book`(BookData 투영)은 원고 쪽이 맞춘다: `BookYear.title ← imageLine`, `good ← todo ?? review`, `caution ← caution`, `age ← age`, `time ← period("돌아보기"·"지금"·"앞으로")`. BookMonth도 같은 방식(`title ← imageLine`, `good ← todo ?? review`, `caution ← caution`).

## 6. 장 구성 (D)

장 수는 그대로(종합 13, 커리어·연애·궁합 9, 대운 5, 세운 5). 장 제목과 `chapters[].id`는 바뀐다. 화면은 장 id에 기대지 않는다(1장은 지금처럼 `core`).
새 id 목록은 병합 때 이 문서 끝에 덧붙인다.

### 새 장 id (P6b 병합 기준)

- 종합: `core` 나를 한 줄로 · `portrait` 성격: 겉과 속 · `why` 기질의 뿌리 · `strengths` 재능: 결과가 되는 힘 · `tension` 내 안의 두 방향 · `fact-bomb` 단점: 알면서 또 하는 실수 · `fortune` 좋은 기운과 귀인 · `work` 일과 성과 · `money` 돈의 흐름 · `love` 연애 · `family` 가족 · `relationships` 관계 · `direction` 실행 전략
- 커리어: `current-fit` 지금 일과의 궁합 · `paths` 진로 유형별 적합 · `jobs` 추천 직무 3단 · `wealth` 재물운: 돈이 오는 길 · `invest` 돈 굴리는 원칙 · `honor` 명예와 이름 · `study` 공부와 자격 · `weakness` 약점과 보완 · `plan` 힘을 실어 주는 마무리
- 연애: `love-core` 나의 연애 스타일 · `contact` 호감과 연락 · `push-pull` 표현과 밀당 · `match` 만나야 할 사람 · `combos` 잘 맞는 조합과 어려운 조합 · `conflict-recovery` 다툼과 회복 · `marriage` 함께 살게 된다면 · `parenting` 부모가 된다면 · `strategy` 지금 관계에서 지향점
- 궁합: `pair-core` 한 줄 판정 · `bases` 각자의 바탕 · `attraction` 잘 맞는 부분 · `direction-ab` A가 보는 B · `direction-ba` B가 보는 A · `friction` 안 맞는 부분 · `domain-scene` 관계의 현장에서 · `felt-differently` 보완할 부분 · `one-thing` 조화를 위한 방법
- 대운: `overview` 지난 3년 돌아보기 · `current-cycle` 지금 대운 · `decade` 앞으로 10년의 설계 · `year` 연도별 지침 · `transition` 전환 대비
- 세운: `overview` 올해 전체 설계도 · `current-dayun` 영역별 설계 · `month` 월별 흐름 · `key-months` 눈여겨볼 달 · `closing` 올해 지침

궁합 `direction-ab`·`direction-ba` id는 그대로다(화면의 두 방향 페이지 연결). 대운은 연도 장이 4번째(`year`), 세운은 월 장이 3번째(`month`).
