# P3.5 B 결제 경로 종단 시험 — WRITER_V5_PRODUCTS 켬

로컬 서버 http://localhost:3200 + 로컬 Supabase. 결제 확정 직후 단계부터 주입(같은 confirm RPC, Toss 승인 응답만 DONE). 외부 호출 0, LLM 키 없음(v5 작가는 결정론).

| 사례 | reportId | 결제 상태 | 발행 상태 | 판(productVersion) | 장별 source | 페이지 | 소요(초) |
|---|---|---|---|---|---|---|---|
| 종합 · 하람 | `report_71e5eb9105b5461ea48aea1bdebe12a8` | paid | COMPLETED | v5 | deterministic 13 | 200 열림 | 8 |
| 궁합 연인 · 하람×서윤 | `report_f271a8c719344b828a4f3d98c44e198b` | paid | COMPLETED | v5 | deterministic 9 | 200 열림 | 0 |
| 세운 2026 · 하람 | `report_adda8ae3bfc54a489e87a2dee28397d9` | paid | COMPLETED | v5 | deterministic 5 | 200 열림 | 3 |
