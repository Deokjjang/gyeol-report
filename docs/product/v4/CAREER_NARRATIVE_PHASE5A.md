# Career V4 · Phase 5A

- Branch `v4/rebuild`, base `05e36223e925bbc734d73583ff5373557e16c287`.
- Offline deterministic text / structured packet only. No route, renderer, delivery or production integration.
- Deep human editorial review: eight complete reports, six women / two men. Ratings below are editorial judgment, not user research or automatically generated scores.

## Composition contract

| Layer | Reuse / behavior |
| --- | --- |
| `careerComposer.ts` | Existing `NarrativeInput` and `buildMyeongliMaterialPacket`; canonical input validation; no clock/network; failure result for invalid input |
| `careerVoices.ts` | Real, strong reviewed Fusion chooses the working character. No MBTI-letter inference, name/date hash or fixture-specific selector. No matching strong Fusion → actual natal material |
| `careerWorkNarrative.ts` | Read-only V3 Career Context Interpreter through Phase 4B adapter. Function before seniority/mode/industry; V4-only narrow extension recognizes 개발/프로그래밍 when original function is unknown |
| `careerRecommendations.ts`, `careerRoleScenes.ts` | Supported semantic material gates each role; real Fusion and work function guide ordering. Explain problem, working strength, role examples and suitable environment together |
| `careerStudy.ts` | Exact existing study trait IDs for all 16 types + compatible strong natal semantic tags. Records direct/derived source coverage; matching hints alone never establish a chart fact |
| `careerFortune.ts` | Existing strong composites first, then actually selected atomic markers. Learning copy names the supported 학당/문창, not an absent alternative |
| `careerNatalMoney.ts` | No-MBTI earning mechanism from strong natal evidence. Does not turn precision/inquiry into a claim of wealth fortune |
| `careerBalance.ts` | Verified low-element material only; work/people/environment imagery explicitly symbolic. Unknown hour never establishes a deficit |
| `editorialGuard.ts` | Only widens the accepted text shape to omit product version; existing check behavior unchanged. No sentence removal or post-generation deduplication |

- Output: version, headline, opening, sections/blocks, 3–5 selected recommendation paths in the representative corpus, 2–3 unsuitable environments, final line and proof.
- Every role/paragraph preserves material/Fusion/context references; study keeps trait ID/type/provenance. Internal references are not printed in customer text.
- Recommendation count is evidence-led, not a quota. Sparse charts can return fewer supported paths plus an explicitly exploratory sample-first path; no invented talent to reach three.
- Structure varies with life stage and significance: student/seeker learning earlier; business customers/earnings earlier; learning-depth specialist study earlier; wealth/name composite brings money forward. Complement/contrast is included only when actually available; supporting complement is not promoted to a strong hero.
- Broad semantic similarity is not perfectly detectable by string checks. Same supported tendencies can recur across arbitrary customers; no promise of globally unique reports.

## Actual setting differences

| State | Customer scenes |
| --- | --- |
| Employee · finance | Budget assumptions, plans versus actuals, explaining to other departments, judgment scope, promotion/compensation |
| Employee · development | Reproducing a problem, comparing conditions, handing over an explanation, specialist value rather than feature count |
| Business | Customers, repeat purchase, product, price, preparation/support cost, conditional team delegation; does not assume employees exist |
| Freelancer | Brief, draft, revision scope, contract, rate, quiet months, repeat clients and personal work identity |
| Student | Major, assignment choices, team projects, examination, internship, qualifications as paths to experience |
| Job seeker | Vacancy versus actual day, portfolio, small task, interview, practitioner conversation, first-role learning |
| Resting / unknown MBTI | Recovery and next choice; explicitly marked previous job remains previous. Natal skill/people/fortune/learning still present; Fusion stays zero |

## Examples read in full context

**Role recommendation · INTP / supported inquiry**

> 이유를 오래 붙드는 힘을 개발·연구·기술 분석에 써볼 만합니다. 특히 한 번의 답보다 다시 통할 원인을 찾아야 하는 문제에서 전문성을 만들 여지가 큽니다.

**Money and name · ENTJ / actual 재성·편관·장성·반안 composite**

> 돈과 이름을 같이 노려볼 만한 힘입니다. 혼자 실무를 많이 해내는 데서 더 나아가 중요한 판단을 맡고 그 결과를 인정받는 쪽에 좋은 패가 있습니다.

**Accumulation · ENFP / actual 재고 composite**

> 익힌 기술과 선택의 안목, 다시 맡기고 싶은 경험도 다음 일의 밑천이 됩니다.

**Short direct flaw**

> 재미있는 수정은 공짜로 더 해주고 싶어집니다. 시작의 설렘에 비해 마무리와 정산은 늦게 챙길 때가 있습니다.

**Overlap**: 현침 × ENTJ — seeing a flaw becomes wanting to fix the next action; 현침 × ISTJ — the last unchecked gap matters even when a result looks fine.

**Contrast**: actual 정관 × ENTP — keep the promised outcome, question the inherited method; actual 정인 × ESTP — try first, then return to the reason.

**Complement counterfactual**: real `1984-09-27 13:30` chart with ENFP, `enfp-expression`, supporting strength unchanged:

> 혼자 정리할 때 막히던 생각도 누군가 반응해주면 말과 표정으로 풀립니다. 표현이 저절로 많이 나오는 원국은 아니어도 ENFP의 관심을 주고받는 방식이 실제 통로가 됩니다.

## Eight complete-text verdicts

| Person / input | Verdict | Reading finding |
| --- | --- | --- |
| 민재 · ISTJ · 제조업 재무기획 과장 | No issue | Quiet error prevention becomes compensation and decision-making value; no entrepreneur premise |
| 도윤 · INFJ · 온라인 교육사업 대표 | No issue | Understanding customers, repeat experience, price/cost and recognized leadership join coherently |
| 서윤 · ENFP · freelance 브랜드 디자이너 | No issue | Connecting taste and ideas, proposal scope, unpaid revisions, assets left by completed work |
| 유진 · ENTP · 컴퓨터공학 student | Minor | Credible question/experiment/study character; five consecutive role explanations still form a denser explanatory stretch |
| 하린 · ESTP · IT 서비스 기획 job seeker | No issue | Observed user reaction, before/after portfolio, experience-first learning, first opportunity; no current-employer assumption |
| 채원 · unknown · resting, previous 바리스타 | No issue | Full natal earning/learning/leadership/mobility story; no inferred type, missing-MBTI warning or current café premise |
| 나영 · INTP · 검색 서비스 개발 연구원 | Minor | Accurate function and specialization; 이유/문제/이해 vocabulary remains comparatively dense |
| 서진 · ENTJ · B2B SaaS 영업기획 | No issue | Decision/action/reward, actual money-name gift, negotiation and role authority; no repetitive CRM script |

**Blocker 0 / Major 0 / Minor 2 / No issue 6.** All eight were read from opening through final line, not judged from automated counts alone.

During review: replaced repeated role templates with evidence-gated manifestations; fixed raw 개발 function recognition; removed assumed finance work from an ISTJ-only voice; corrected Korean particles; deepened unknown-MBTI money beyond spending taste; retained actual learning marker only. Broader chart tests caught missing complement precedence and repetitive unmapped-role fallback, both corrected without deleting generated sentences.

## Verification

- Career tests: **66 PASS / 0 FAIL** in two files.
- V4 total: **658 PASS / 0 FAIL** in 12 files.
- Related saju / V3 / knowledge / report tables / generation / paid-delivery regression: **2,672 PASS / 0 FAIL** in 134 files, including V4 (not additive).
- Eight independent reports: normalized exact body sentence duplicates **0**, shared 12-word spans **0**, headline/final duplicates **0**. Repeated structural headings are excluded from body-sentence counting, as in Phase 4B.
- 16 MBTI × 8 real charts: no runtime failure or automated Blocker/Major; 10 canonical job states × 8 charts: no invalid current-status assumption in the current-work section.
- 13 real charts × 16 MBTI: exercised actual overlap/contrast/complement body selection; references and natal packet preserved.
- Same-chart/different-MBTI and same-MBTI/different-chart checks; unsupported role materials removed → recommendation removed, not just relabeled.
- Twelve Comprehensive Phase 4B packet hashes remain exactly unchanged. Runtime import isolation also tested.
- `pnpm lint`: PASS. `OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build`: PASS. `git diff --check`: PASS.
- Initial sandboxed build remained waiting at the compilation stage; stopped only that local build and reran the identical command outside the sandbox successfully. No config, environment file, deployment or secret changes.
- Supplementary `tsc --noEmit`: 389 existing diagnostics outside V4, zero Career/V4 diagnostics; not a claim of a clean repository-wide standalone TypeScript check.
- No visual/SSR check requested or performed: there is deliberately no UI/route integration in this phase.

## Review artifacts / reproduction

```sh
V4_PHASE5A_EXPORT=1 pnpm test tests/unit/interpretation-v4
```

- `/tmp/gyeol-v4-phase5a/index.md`: eight complete customer texts and corresponding `.json` packets.
- `cohort-qa.json`: empty finding list; `fusion-counterfactuals.json`: actual bridge examples with calculation input/rule ID.
- No permanent preview route. No changes to V3 Career, calculation, paid delivery, DB, payment, public UI or other product composer.
- Stop here; Love/Compatibility/Major/Annual/UI and master integration require a separate request.
