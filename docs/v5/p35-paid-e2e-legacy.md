# P3.5 B 결제 경로 종단 시험 — 플래그 끔(기존 경로)

로컬 서버 http://localhost:3200 + 로컬 Supabase. 결제 확정 직후 단계부터 주입(같은 confirm RPC, Toss 승인 응답만 DONE). 외부 호출 0, LLM 키 없음(v5 작가는 결정론).

| 사례 | reportId | 결제 상태 | 발행 상태 | 판(productVersion) | 장별 source | 페이지 | 소요(초) |
|---|---|---|---|---|---|---|---|
| 종합 · 하람 | `report_e52000519fb74c45aa21f266cdeaabf7` | paid | COMPLETED | v4 | - | 200 열림 | 7 |
| 궁합 연인 · 하람×서윤 | `report_43239f0cf5ac4cf6a721a86c21277bc1` | paid | RETRYING | - | - | 200 열림 | 61 |
| 세운 2026 · 하람 | `report_4627a98845684c309de936615a49f4a0` | paid | COMPLETED | v4 | - | 200 열림 | 3 |

- 궁합 연인(하람×서윤, 서윤 출생시간 미상)은 기존 v4 경로에서 `PUBLISH_REJECTED: V4_COMPATIBILITY_GENERATION_FAILED`로 재시도에 남는다. **기존 오류**다: 플래그를 끄면 v5 훅이 없고, v4 생성 경로(`src/lib/interpretation-v4`, `report-generation`, `saju`, `report-knowledge`)는 v5/main과 한 글자도 다르지 않다(`git diff --stat v5/main` 결과 바뀐 파일은 결제 배선 3개뿐). 같은 입력이 플래그를 켜면 v5로 완성된다(`p35-paid-e2e-v5.md`).
- 결제 상태는 세 건 모두 `paid` 그대로(환불·취소 없음).
