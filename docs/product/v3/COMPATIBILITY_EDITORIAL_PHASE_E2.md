# Compatibility E2 editorial polish

Branch: `v3/rebuild`. Customer copy and evidence display only.

## Contract boundary

- New drafts: `compatibility_v3.0-editorial.2`.
- Stored `.1` drafts replay the unchanged Phase E composer and copy. The E1 test suite explicitly targets `.1`.
- The evidence packet, natal calculations, MBTI pair sources, relation detection, prominence gates, A/B direction engine, seven categories and fixed role input contract are unchanged.
- E2 reuses the same scene IDs, evidenceRefs, subjects and toward values. Original sourceRefs remain, with an E2 copy provenance entry added only for rewritten scenes.
- No score, grade, ranking, new relationship fact, provider call, database migration or payment change.
- Other five products, Production, master, `.gitignore`, `AGENTS.md` and `supabase/.temp/` are outside this change.

## Editorial review

The shared opening previously started from received-god needs, then used the same general communication description. Directional scenes and the final punchline also converged on general relationship copy.

E2 keeps those actual facts but starts from a different relationship question:

| Category | First impression / directional scenes | Final focus |
| --- | --- | --- |
| Love | attraction, tone, feeling cared for; A's pressure and B's expanding experiences | choosing each other again |
| Marriage | the end of the workday, shared chores, space to recover | an evening both want to return to |
| Parent/child | parental protection vs the child's own choices | a secure place from which to become independent |
| Coworker | handoffs, feedback, different definitions of finished | work that the other person can continue |
| Manager/report | priorities, permission to decide, the weight of a manager's words | room for the team member's judgment |
| Business | opportunities, execution, customer promises, contribution and risk | sharing the dream, defining each person's risk |
| Friendship | play, venting, gatherings, new friends and reconnecting | resuming the conversation after time apart |

Every received-god direction has reviewed manifestations for all seven categories. Qualified hyeonchim/hwagae scenes now use relationship-specific situations in both directions. Cheoneul/yeokma gifts also have distinct category scenes. No fixture names or dates select copy.

The solution-versus-feeling opening requires actual direct and warm/expressive communication evidence; merely having two different MBTI types is not sufficient. Unknown types remain unknown.

Examples from Gaon/Yuna:

- Friendship: “한쪽은 이미 방법을 몇 개 떠올렸는데 다른 쪽은 일단 같이 속상해해 줄 친구가 필요합니다.”
- Business: “매출은 늘었는데 둘 다 ‘내가 더 많이 했다’고 느끼기 시작하면 숫자만 맞춰서는 대화가 끝나지 않습니다.”
- Love: “설레게 하는 힘과 안심하게 하는 힘이 같은 모양일 필요는 없습니다.”
- Friendship final: “오래가는 친구는 공백이 없는 사람이 아니라, 공백 다음 문장을 같이 써주는 사람입니다.”
- Manager/report final: “좋은 위임은 상사의 손을 복제하는 일이 아니라, 팀원의 판단이 설 자리를 만드는 일입니다.”

Dohwa remains first-impression/visible attraction; hongyeom remains growing intimate attraction. Both/neither and individually present counterfactuals pass. Weak/unqualified charm evidence never becomes a hero.

## Public evidence display

- Before: repeated names, full directional labels and long MBTI source chains after almost every block.
- After: `ENTJ × INFJ · 편관↔편재`, `酉丑 반합`, and selected native feature labels.
- Only labels actually referenced by that scene can appear. No unselected relation is added for visual brevity.
- Repeated labels are shown once per chapter, not once per block; a later block can still show its new native/relationship label.
- All 21 fixtures have fewer visible evidence lines and less than half the previous evidence-line text length. This is a display measurement, not a body-length target.
- Full provenance remains server-side; no backend IDs are sent as public chips. The server-only map is not a client prop.

## Validation

- E1 + E2 targeted: 57 tests pass (30 frozen E1, 27 E2).
- E2 covers 21 fixtures (3 pairs × 7 categories), all 289 MBTI combinations including unknown, and 84 natal/category combinations (12 × 7).
- Same-pair first 800-character windows, both directions, good-pair sections and final sentences differ across all seven categories; no identical long opening sentence is reused.
- Symmetric A/B swaps preserve the invariant evidence and reverse directional prose. Parent/child remains A=parent, B=child; manager/report remains A=manager, B=report.
- Generate → publish → JSON snapshot round-trip → SSR passes for both E1 and E2. Wrong-version substitution fails publication.
- Customer text and SSR contain no numeric compatibility score, grade, unsupported new relation or internal evidence identifiers.
- Local preview API: 21 creations, externalCallCount=0 each. No OpenAI or database service was used.
- Browser verification: 21 pages × 390/768/1440; both main tables retain 10 default signals and expansion. Expanded content has no viewport overflow or hydration/error overlay; browser errors are empty.
- `pnpm lint`, `pnpm build`, `git diff --check`: pass.
- Full suite: 4,382 passed / 3 existing failures / 4,385 tests, 378 files. Existing failures are `legalPagesSource.test.ts`, `policyPagesSource.test.ts` (old date assertions) and `dev/compatibilityPreviewPageSource.test.ts` (removed score label). They are not modified here.
- Standalone `tsc --noEmit`: not globally clean. Its 384 existing test diagnostics match the Phase E baseline exactly; no new diagnostics.

## Local review links and exports

Preview-memory links expire if the local server restarts; these are not Production URLs.

- Love: http://127.0.0.1:3100/reports/report_tmda13ghdcw42
- Friendship: http://127.0.0.1:3100/reports/report_kbe4wqy1x1mjp
- Business: http://127.0.0.1:3100/reports/report_4ematu96rezqs
- Parent/child: http://127.0.0.1:3100/reports/report_qb7pbp5jr7gwp
- Manager/report: http://127.0.0.1:3100/reports/report_jhqrvomw1u8lk

Temporary QA artifacts:

- `/tmp/gyeol-compatibility-e2-{category}-{ga-on|expansion|quiet}.json`: reproducible inputs, draft and evidence.
- Corresponding `.txt`: customer body; `-customer.txt`: expanded browser customer text including tables.
- `/tmp/gyeol-compatibility-e2-first-impressions.txt`: seven opening comparisons.
- `/tmp/gyeol-compatibility-e2-browser-results.json`: viewport measurements.
- `/tmp/gyeol-compatibility-e2-{390|768|1440}.png` and `-body-{width}.png`: visual checks.

Stop after E2. Phase F is not started.
