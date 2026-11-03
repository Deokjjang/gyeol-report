# P6b 진행

브랜치 `v5/p6b`(worktree `~/Developer/gyeol-worktrees/v5-p6b`, v5/main bace26c8에서). 운영 배포 없음(v5/main까지).
예산: Anthropic $3, OpenAI $0.2(이번 단계). 호출마다 `api-cost-log.md`.

## 결정

- 2026-11-03 필드 계약 `p6b-fields.md`를 v5/p6b·v5/main에 먼저 push(0c0db442). 새 필드는 모두 선택, `draft.version` 유지.
- 그림 별명(easyName·image·imageVariants·oneLiner)은 지식 DB에 내부 별칭으로 남기고 작가에게 보내지 않는다. 작가는 이름(한자)+meaning+forYou+shadow+life만 받는다.
- 이전 Book 참조(E-1)는 기존 `report_tickets` 동작 `library`·`read`로 읽는다(마이그레이션 없음). 1+1 동시 발행 대비로 같은 사람의 상품별 장면 몫을 결정론으로 나눈다.
- 대운 14장 카드는 유지(과거 3년 카드는 짧은 돌아보기, 요약은 1장).

## 할 일 / 상태

| 항목 | 상태 | 메모 |
|---|---|---|
| 필드 계약 push | 완료 | 0c0db442 |
| B 지식 스키마·lint(P6b 금지어·별명·뜻 필드) | 완료 | 기존 위반 288건(소품 78·별명 210) |
| B 뜻 필드 250개·별명/소품 정리·간지 그림 줄 60 | 진행 | 서브에이전트 8(Sonnet), 검수는 메인 |
| A 작가 기본 Sonnet·대체 terra·결정론 | | |
| A 희소도 표 재측정 | | |
| A edition | | |
| B-4 핵심 이미지 규칙·합성 | | |
| B-6 장면 필터 | | |
| C·D 장 구성·분량·지침 | | |
| E 결함 11 | | |
| F 시험 7권 | | |
| G 게이트·병합 | | |
