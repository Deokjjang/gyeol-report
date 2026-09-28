# Career V3 C2 editorial polish

Branch: `v3/rebuild`. Version: `career_v3.0-editorial.2`.

## Customer experience

- Title → compact input information → contents → existing professional tables → body.
- Display the validated customer's original job text, Korean status label and actual MBTI; unknown MBTI remains 모름. Student/seeker labels are 관심 분야/희망 분야, not an invented current job.
- No DOB/time duplication. No unused relationship/focus input presented as an interpretation basis. No normalized taxonomy or evidence/debug identifiers in customer HTML.
- Work settings use the existing normalized dimensions, not a person's name/date or a fixture-specific raw-job match. Nine distinct setting facets cover meeting, negotiation, friction, recognition, analysis, handoff, learning, outside contact and next role.
- Employee, owner, freelancer, student and seeker have separately authored situations and narrative stakes, not noun substitutions. Owners do not receive employee job-change scenes; students keep study/first-experience priority.
- Dictionary tails and analyst narration are removed from the new body. Definitions remain in the unchanged professional tables. Most scenes finish with recognition, praise or reversal instead of another instruction.
- Strong-evidence gifts keep their original meanings: leadership/recognition, people help, accumulation, external opportunity, expression and study. No score, new weight, fortune prediction engine or feature invention.
- Current-job alternatives remain a collapsed auxiliary section; environment/problem precedes role examples. Final conclusion is four paragraphs without feature-name explanation.

## Before / after: Gaon

Counts below are body occurrences, excluding professional tables.

| Expression | C | C2 |
| --- | ---: | ---: |
| CRM | 7 | 1 |
| 고객 요구 분석 | 5 | 1 |
| 재계약 | 8 | 0 |
| 보고서 | 6 | 0 |

C2 uses all nine setting facets: customer meeting, proposal/negotiation, product-team schedule conflict, unblocked contract, sales analysis, explaining to a junior, stalled negotiation review, external event, and job-listing evaluation/compensation.

Examples:

- “관심 없다던 일도 동료가 잘한다는 말을 들으면 갑자기 검색 기록에 등장합니다.” — confirmed competition/connection anchor.
- “연봉 이야기는 어색해하면서 맡은 일은 계속 늘어나면 어느 날 칭찬이 할인 쿠폰처럼 느껴집니다.” — current employee compensation context with a substantial money-domain anchor.
- “명예와 리더십의 좋은 직업운이 있습니다.” — substantial 장성.
- “돈·고객·기술·경험을 쌓아 남기는 재물복, 축적의 좋은 패가 있습니다.” — substantial 재고.
- “사람복도 실력의 일부입니다.” — substantial 천을.

Gaon authored advice share: 12.3% → 8.8%. Across 12 fixtures: 8.8–11.6%, all lower than C. These annotations supplement manual reading, not a semantic-quality score or length KPI.

## Compatibility and scope

- C's generator/corpus remain frozen. A new version-specific copy pass reuses its selected scenes, chapter route, natal/compound/MBTI anchors and work normalization. It is revalidated by the existing common composer.
- Publication/read validation dispatches by saved version. All 12 old C draft hashes match the committed baseline; old JSON snapshots still publish/read/render. Relabeling C2 as C fails the content contract.
- Existing calculation, evidence packet version, default legacy generation route, payments and persistence contracts are unchanged. Explicit local V3 generation still makes zero provider calls, including with an enabled-writer test configuration.
- Conditional Comprehensive request: the shared composer assembles/validates authored text; it does not append definitions or force advice. A global text deletion would change saved B drafts under their current contract. No such deletion or new Comprehensive rewrite was applied. All six committed Phase B hashes remain identical; structure/UI/calculation are unchanged.
- No master, Production, provider, Toss or Supabase operation. Unrelated `.gitignore`, `AGENTS.md`, `supabase/.temp/` excluded.

## Verification

- Targeted regression: 19 files / 387 tests, including 12 charts × 16 MBTI types + unknown, eight job counterfactuals, five statuses with the same job/chart, missing-fortune-evidence counterfactual, raw/escaped long input, old C/B hashes, local generate → publish → snapshot → SSR.
- All 12 new fixtures: zero rejected scenes, warnings, weak evidence heroes, unsupported feature anchors, body meta/definition matches, internal/debug HTML identifiers and external calls.
- Actual local API: 12/12 HTTP 200, new version and input panel in SSR.
- Browser: 12 fixtures × 390/768/1440 = 36 checks. All tables/details expanded; zero document/element horizontal overflow, console errors or error overlays. Manse/MBTI hydration, contents links and initial collapsed alternatives verified.
- `pnpm lint`, `pnpm build`, `git diff --check`: pass.
- Standalone `tsc --noEmit`: the existing 384 test diagnostics remain; source diagnostics and new C2 diagnostics are both zero. This is not a clean standalone TypeScript check.
- Full-suite baseline: existing failures in legal effective-date source expectations (2) and removed compatibility score source expectation (1); unrelated files not changed.

## Local review links

These are local preview-memory reports, not Production URLs. They require the local server and expire when its memory is reset.

| Fixture | Input | Result |
| --- | --- | --- |
| A 가온 | 직장인 · B2B SaaS 영업기획 · ENTJ | http://127.0.0.1:3100/reports/report_6gputtgoobwb3 |
| B 도윤 | 직장인 · 백엔드 개발자 · INTJ | http://127.0.0.1:3100/reports/report_6kv1tg1h66w8b |
| C 서연 | 직장인 · 병원 간호사 · ISFJ | http://127.0.0.1:3100/reports/report_24yjzlarzgk63 |
| D 나래 | 직장인 · 중학교 교사 · ENFJ | http://127.0.0.1:3100/reports/report_9datcg3vp1iki |
| E 다온 | 자영업 · 카페 사장 · ESFP | http://127.0.0.1:3100/reports/report_b6w0bwb8irzml |
| F 이든 | 프리랜서 · 영상 크리에이터 디자이너 · ENFP | http://127.0.0.1:3100/reports/report_0c5hvadq6vjx3 |
| G 수현 | 직장인 · 세무 회계 전문직 · ISTJ | http://127.0.0.1:3100/reports/report_3q4e47hsdpbrm |
| H 라온 | 학생 · 콘텐츠 디자인 · INFP | http://127.0.0.1:3100/reports/report_ixnbmdj1gfz00 |
| I 마루 | 취업 준비 · 분야 미입력 · INTP | http://127.0.0.1:3100/reports/report_q092yz15108y7 |
| J 지온 | 직장인 · 생산관리 · 모름 | http://127.0.0.1:3100/reports/report_cr2ytknccg6lj |
| K 유나 | 사업자·자영업 · 네일아티스트 매장 대표 · ISFP | http://127.0.0.1:3100/reports/report_530aeq3bd0nh4 |
| L 하람 | 직장인 · 행정 공무원 · ESTJ | http://127.0.0.1:3100/reports/report_c9qhxn0oy6xnk |

Full rendered Gaon customer text (all report panels open): [CAREER_EDITORIAL_PHASE_C2_REVIEW.txt](CAREER_EDITORIAL_PHASE_C2_REVIEW.txt).

Stop after C2. Do not start Phase D automatically.
