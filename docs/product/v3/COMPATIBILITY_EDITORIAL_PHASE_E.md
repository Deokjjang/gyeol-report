# Compatibility V3 · Phase E

Branch: `v3/rebuild`. Product: `saju_mbti_compatibility` only.

## New input contract

- New form payloads carry `compatibilityRoleVersion: compatibility-fixed-ab-v1`.
- `parentChild`: A = 부모, B = 자녀. Input and review labels name those roles explicitly.
- `managerReport`: A = 상사, B = 부하·팀원. No age/gender/name inference.
- All seven canonical relationship enums remain unchanged.
- Missing version remains the legacy input contract; it is not retroactively assigned roles. Unknown/invalid versions fail closed.
- Snapshot validation binds the role labels, raw names/MBTI, category and generated body to the stored input basis. Changing a label or role without the matching contract fails publication.
- Existing legacy snapshots and their unassigned direction evidence retain their old readers/validators. No persistence migration.

## Evidence and editorial boundary

- Reuses the existing natal calculation, weighted evidence prominence, cross ten-god, element, cross-branch and local MBTI pair DB. No scoring engine or new natal/MBTI calculation.
- A→B uses B as the ten-god viewer; B→A uses A. Symmetric pair prose uses stable identity order; parent/manager prose follows input slots.
- Cross-person day/day relations take precedence over more distant positions. Canonical relation identities survive swaps. Identical birth/name observations are deduplicated, not counted twice.
- Existing cross rules expose 육합/삼합/반합/충/해. No invented cross-person 형/파/원진. The expansion fixture includes an actual natal 원진; it is not relabeled as a pair relation.
- Actual substantial 도화/홍염 remain distinct: visible first impression vs closer/intimate appeal. Weak/absent charm never becomes a hero.
- MBTI behavior is bound to communication trait IDs and notablePairs source entries. Unknown input stays unknown. Reviewed wording avoids treating an insulting type verdict as a customer fact.
- Legacy score remains inside the old evidence packet for compatibility only. V3 draft, body, conclusion and customer HTML never use it as meaning or display it.
- Opening: four paragraphs. Conclusion: five paragraphs. Pair directions, category-specific scenes, good assets, blunt observations and optional short tips use varying forms.
- Advice is below 25%; no forced tip in every block, dictionary tails or analyst narration.
- Two separate canonical tables retain the existing primary-ten/all-signals interaction. Non-exact time displays confirmed pillars only, not an exact-hour weighted profile.
- The new view is server-rendered; internal evidence objects/role version/source IDs do not cross client table boundaries.

## Category examples

- 연애: attraction, replies, jealousy, date choices, conflict, distance, spending and time.
- 결혼: home rhythm, chores, money, family events, decisions and repair.
- 친구: reconnection, contact gaps, shared hobbies, advice vs sympathy, loyalty, lending and different life stages.
- 동료: meeting pace, division, feedback, deadlines, credit and stress.
- 상사부하: manager instructions, team member reports, autonomy, feedback, authority and growth.
- 사업파트너: opportunity, risk, customer promises, hiring, margin, expansion and exit conditions.
- 부모자녀: protection, autonomy, study, praise, rules, emotional language and independence. No prediction of the child's future.

## Representative local previews

These are local preview-memory URLs, not Production; restarting the local server can expire them.

- [연애 · 가온/유나](http://127.0.0.1:3100/reports/report_q12wq9wqti6ab)
- [사업파트너 · 가온/유나](http://127.0.0.1:3100/reports/report_24w1t3h5to7zg)
- [친구 · 가온/유나](http://127.0.0.1:3100/reports/report_d6r9jg9ghh575)
- [부모자녀 · A=부모](http://127.0.0.1:3100/reports/report_e3hg0fvovgntm)
- [상사부하 · A=상사](http://127.0.0.1:3100/reports/report_ujzp8vwt1rwmg)

Full expanded customer text: `COMPATIBILITY_EDITORIAL_PHASE_E_REVIEW.txt`.

### Text review

- A→B: 가온 앞에서 유나는 선택을 더 끝까지 설명하고 싶어짐; 가온의 빠른 결론과 유나가 기다리는 마음의 확인이 엇갈림.
- B→A: 유나를 통해 가온은 평소 지나쳤을 제안과 장소에 관심이 붙음; 유나의 세밀함이 가온의 짧은 표현을 다시 보게 함.
- Humor: “연락은 왔는데 안심은 아직 도착하지 않은 날, 둘이 보고 있는 자막이 다릅니다.”
- Good asset: 실제 酉丑 반합의 연결, 가온의 천을귀인·역마, 유나의 홍염을 구분해 사용.
- Business: “계약은 불신이 아니라 우정을 덜 시험하는 방법”. Friendship: “친구 상담소의 메뉴부터 다릅니다”.

## Validation

- 21 fixtures: three different pairs × seven categories; generation → publication → JSON snapshot → SSR.
- 17 × 17 MBTI combinations (including unknown), plus twelve natal fixtures × seven categories; A/B swap, same-pair category, charm presence/absence/weak-evidence, unknown time, duplicate name/identity and tampered role checks.
- Day/day clash: 가온/유나 丑未. Day/day harmony: quiet pair 巳申. Supporting harmony is not mislabeled as a day/day fact.
- New form raw values survive category changes; explicit labels and version arrive in the input snapshot without any SDK/payment action.
- B/C2/D2 editorial and legacy compatibility regression retained.
- Targeted: 480 tests / 21 files PASS.
- Full suite: 4,355 PASS / 3 existing failures (4,358 total, 377 files). Unchanged failures: legal date expectations in `legalPagesSource` and `policyPagesSource`; old score-label expectation in `dev/compatibilityPreviewPageSource`.
- Local API: 21 generated previews, external call count 0.
- SSR/hydration: 21 reports × 390/768/1440 = 63 views; expanded tables, no horizontal overflow or browser errors. Basic signals = ten per person, remainder in full expansion.
- `pnpm lint`, `pnpm build`, `git diff --check`: PASS. Build required running outside the filesystem sandbox after the first sandboxed Turbopack build stalled; no deployment.
- Standalone `tsc --noEmit`: same 384 pre-existing test diagnostics, no new source diagnostics. The Next build TypeScript step passes.

No master push, Production change, provider call, payment change, database write/migration, or other-product content change. Phase F not started.
