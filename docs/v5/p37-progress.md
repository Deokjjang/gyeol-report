# P3.7 진행 기록

브랜치 `v5/p37`(v5/main 36bca34b에서 분기), worktree `~/Developer/gyeol-worktrees/v5-p37`. 이벤트 종료 핫픽스는 `hotfix/event-end`(origin/master c5c11ca8에서 분기), worktree `~/Developer/gyeol-worktrees/hotfix-event-end`.
비용: Anthropic 0, OpenAI 0. UI 작업(P5, v5/p5-ui)은 별도 에이전트가 동시에 진행(경계: 이 작업은 knowledge-v5·brief·writer·scripts/knowledge-lint 담당).

## 0) 이벤트 종료 대비 (hotfix/event-end)
- 진행 중. 결과는 아래 "배포" 표에 적는다.

## 1) 원고 보강
| 단위 | 내용 | 결과 |
|---|---|---|
| 1-5a 인연 시기 | `LOVE_TIMING`(만남·결혼 낱말에 붙은 늦게·일찍·몇 살쯤) → 지식 lint 금지어. DB 2문장(도화·홍염 년 자리 "인연이 일찍") 경향형으로 | lint 0 |
| 1-4 데이터 스키마 | `love/signals.json`(십성 10·도화·홍염·MBTI 16 × 호감 표현·연락 패턴·밀당), `career/jobs.json`(십성 묶음·십성·직업 신살 → 구체 직무명, 지금 직업 58군 적합 묶음·키울 역할) 스키마·lint. 데이터는 Sonnet 서브에이전트 작성 중 | 진행 중 |
