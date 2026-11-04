# P6e-content 읽기 목록

**이번 원고는 v5/main에 병합하지 않았다**(품질 하한선 미완료, `p6e-content-report.md`). 그래서 `bash scripts/read-latest.sh`(origin/v5/main 코드)로 열면 책 본문은 같지만 화면 쪽 P6e 변경(첫 쪽 "다른 기운 보기" 링크 제거, 판 표기 "제6판 · 기준일")은 보이지 않는다. 화면까지 보려면 이 worktree(`~/Developer/gyeol-worktrees/v5-p6e-content`)에서 `pnpm dev:v5`로 띄우고 출력된 포트로 링크의 3100을 바꾼다. 책은 로컬 Supabase에만 있다.

5권 모두 Sonnet 5.5(작가 1회 + 수리 1회 + 소제목 재작성 0~1회), 작가 지침 `writer-prompt-v5-22`. 원고 원문 `docs/v5/trial/p6e/final/<사례>.final.md`, 지표·판정 `p6e-content-report.md`, 장별 판독 `p6e-content-report.md` §2.

| 상품 · 사례 | 회차 | 분량 | 표지 한 줄(핵심 이미지) | 링크 |
|---|---|---|---|---|
| 종합 · 장소담(카페 사장·INTP·관계 미입력) | r1 | 13,238자 | 겨울 오후 카페의 젖은 바람에도 버티는 불빛 | http://localhost:3100/dev/v5-login?next=/reports/report_82cb9a802ad34a02ae24d834361e5625 |
| 커리어 · 권태오(구직, 마케팅 재취업·ISFP) | r4 | 11,759자 | 여름 늦은 오후 스터디 카페의 열기를 품은 흙 | http://localhost:3100/dev/v5-login?next=/reports/report_78351ea1fccf4aacb9111d29fdeae73d |
| 연애 · 문채린(연애 중, 물리치료사·ENFJ) | r2 | 10,083자 | 봄밤 치료실 창밖 숲을 적시며 흐르는 큰 강 | http://localhost:3100/dev/v5-login?next=/reports/report_586fbf1314df4addb4085160248e64b3 |
| 연애 · 윤서하(솔로, 그래픽 디자이너·INFP) — 상태 분기 확인용 새 사례 | r2 | 13,698자 | 가을 아침 작업실 창밖 둑에 막혀 깊어진 빗물 | http://localhost:3100/dev/v5-login?next=/reports/report_56cd726f36b245fbb31718490e3055fe |
| 궁합 사업 파트너 · 남궁현(ESTJ)×백은솔(ENFP) | r1 | 12,513자 | 큰 나무가 불빛을 타오르게 돕는 사이 | http://localhost:3100/dev/v5-login?next=/reports/report_b41e6a1204c74df0bf327e82f178d8f1 |

읽으면서 볼 것:
- 1~21 인용 문장이 없는지(grep 증명은 보고서 §1, `tools/p6e/quoted-check.ts`).
- 표지 한 줄 = 1장 첫 이미지(같은 출처). 장소담 ↔ 하람(같은 일주): "겨울 오후 카페의 … 불빛" ↔ "겨울 오전 회의실의 … 불빛".
- 한자·MBTI 약어는 장마다 첫 등장에만, 괄호 겹침 없음. 본문 기준일 줄 없음, 안내 한 줄은 마지막 장 끝에 한 번.
- 커리어 3장: 직군 → 맞는 이유 → 예시 직업 3~5개(직업 하나에 문단을 주지 않음). **이 책의 직군 선택(경영지원·인사 → 물류·운송)은 판독에서 나빠짐 — 코드는 고쳤고 재생성은 다음 회차**(보고서 §3).
- 연애 문채린(연애 중) 2·4장: 오래된 사이의 매력, "표현과 대화의 리듬"(프로필·첫 만남 30분 없음). 윤서하(솔로): 프로필 한 줄·첫 만남·새 인연 쪽.
- 연애 8장 부모 역할: 소제목 3개가 다 있는지(r1에서 자녀 규칙 오탐으로 1~2개가 빠져 r2로 다시 만들었다).
- 궁합: 신살 주인(겁살은 남궁현 일지), MBTI 점수 v2.2(대화의 결·기능·생활 리듬 부분 점수), 관계 목록 같은 관계 한 줄.
