# P6c-score 진행 기록

브랜치 `v5/p6c-score`(origin/v5/main bcef108a에서), worktree `~/Developer/gyeol-worktrees/v5-p6c-score`. 운영 배포 없음(v5/main까지).

## 1. 현재 상태(시작 시점)

- v5 궁합 Book의 점수: P4 재설계 `compat-score-v5-1`(`src/lib/compat/score.ts`, 커밋 b171c429)이 연결돼 있다. fab74934(v5/p35-p4 끝)는 v5/main 조상이다.
  - 경로: `buildCompatibility`(`src/lib/brief/compatibility.ts`) → 브리프 `compatibility.score` → `assembleV5Book`이 스냅샷 `evidencePacket.pair.score`(version `compat-score-v5-1`)에 고정 → `projectV5Book`이 점수 쪽을 만든다. 읽을 때 다시 계산하지 않는다.
- 화면의 "3칸": `src/lib/writer/book.ts`의 `LEVEL_POINTS = { 좋음: 3, 보통: 2, 조율: 1 }`. 구성요소 수준(좋음·보통·조율)을 3칸 막대로 바꾼 것이고 하위 점수가 아니다(P4 §4: 하위 점수 평균이 총점과 어긋나 보이는 것을 피하려고).
- V4 Book: `compatibilityIndex.ts` 점수 + `bookProjection.ts`의 V4 점수 쪽(항목 점수/만점). 이번 작업에서 건드리지 않는다.

## 결정(AskUserQuestion, 2026-11-03)

- 부록(c): v5 Book에는 부록 쪽이 없었다(V4만). → **새 v5 Book에 추가**: 생성 시점에 내 사주 기운 + 지식 DB meaning 한 줄을 스냅샷에 저장. 필드 없는 과거 v5 Book과 V4 Book은 그대로.
- 보정 문구(a)·표지 keep-all(b): 운영 V4 Book과 같은 코드를 쓴다. → **모든 Book에 적용**(같은 사실의 표현 변경·줄바꿈만, V4 본문·점수 불변).
- 분포 목표 충돌(AskUserQuestion): 총점=40+항목 합을 지키면 90점 이상 5%는 도달 불가(필요 표준편차 약 12, 항목 7개 독립 합의 최대 약 8). → **40+항목 합 유지, 90점 이상은 드물게**(약 0.1~0.4%). 중앙값 70±3·50 미만 ≤5%는 맞춘다.
- MBTI 한쪽이라도 없음(자체 결정, 원고 규칙 "MBTI 근거 날조 금지"): MBTI 항목을 빼고 사주 항목 합(만점 45, 친구 42)을 60점으로 환산한다. 막대는 실제 항목 점수, 안내 문장에 환산을 적는다.

## 진행

- [x] 1 현재 상태 확인
- [x] 2 점수 v2 엔진·보정(FLOOR 0.36, 1만 쌍 중앙값 69~70) — 문서는 5단계에서 마무리
- [x] 3a 브리프·스냅샷·점수 쪽·결정론 작가·안전망(구간 이름 기준)·작가 지침 v5-17
- [x] 3 점수 쪽 화면·브리프(onScorePage) — 커밋 525aa62f
- [x] 4 작은 화면 수정 a~d — 같은 커밋. d: 왼쪽 굵은 줄 = `data-impact=HIGH` = v5 카드 흐름 세기 4 이상(`writer/book.ts` importance) → 뜻이 분명해 범례 한 줄(v5 표만)
- [ ] 5 시험·캡처·보고·병합
  - 캡처용 로컬 Book(결정론 원고, 비용 0): `tools/p6c-score/books.p6c.ts` → `docs/v5/ui-p6c/books.json`
  - 캡처: before = 기준 트리(v5-p6b-ui, bcef108a) dev 3300, after = 이 브랜치 dev 3400, `tools/p6c-score/capture.mjs`
