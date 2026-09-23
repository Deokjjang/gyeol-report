# Fusion / Bridge fact-condition audit

Task: FUSION-BRIDGE-FACT-CONDITION-QUALITY-P1-01

2026-09-23 · baseline `1c97326` · deterministic/mock only.

## Data flow and corrections

| Layer | Input | Match | Output / consumer |
|---|---|---|---|
| Fusion knowledge | Computed facts (authoritative), legacy dictionary IDs, actual MBTI | Explicit AND of OR fact groups; MBTI source condition; topic | Matched rule + trace → comprehensive sections → writer/fallback |
| Comprehensive scene | Computed feature IDs + selected MBTI knowledge | All required features AND exact authored trait ID from that type’s source | Scene + trace → interpreted scene (same interactionId) → writer/fallback |
| Product Bridge | Typed signal kind + exact source vocabulary + actual MBTI | Exact fact ID, relevant product domain, related source trait | Relevant hints/traits + trace → exclusive product evidence bucket |

Comprehensive uses Fusion + scene scorer. Career/love/major/annual use the common packet. Compatibility has its own directional person/pair evidence path; it was regression-tested, not replaced with the common packet.

Root causes: tag overlap bypassed rule identity; any listed ID satisfied compound claims; presence stood in for strength; no-match returned all hints; scene scoring substituted unrelated traits; signal count implied high intensity; primary/caution buckets duplicated one item.

## Fact and interaction contract

- `requires.allOf`: every group must match; alternatives inside one group are OR. Empty/unknown conditions fail closed. No rule predicate is parsed from prose or its ID.
- Existing knowledge/feature IDs are retained. Strong/excessive ten-god measurements project to `ten_god_*:strong`; presence alone never does. Element excess comes from the existing computed excess set, not a new threshold.
- Computed facts override dictionary selections. Contradictory element/ten-god/structure values cannot create positive proof. A strong measured fact can support a presence-level MBTI source link; missing cannot.
- `bridgeFactIds` preserves the actual IDs (including strength) in the comprehensive packet. `interactionId`, `ruleId`, type, fact IDs, source MBTI IDs, context, confidence and intensity are traceable.
- Type-specific rules require the actual input type plus authored MBTI tag evidence or exact source trait linkage in the relevant topic. No type is inferred from missing MBTI. No I/E letter classifier was added.
- Common hint matching uses an explicit vocabulary adapter and source `relatedTraits` / `matchingMyeongliSignals` / `productDomains`. Unknown vocabulary is not a match. `reportUseCases` remain source writing guidance, not customer facts.
- The common packet has no count-based high path. Direct source linkage is medium; inferred linkage is low. These are source-confidence labels, not empirical character-strength estimates. Unsupported interactions remain expression; no automatic agreement/tension/compensation is inferred from count.
- Reviewed compensation example: actual 정재 + ENFP `money/recurring_income_anchor`. Reviewed amplification: actual 현침 + ENTJ `workplace/direct_feedback_leader`. No new prose or trait was invented.
- Pure Myeongli rules (14) remain in the asset file but are excluded from cross-system selection. Existing primary Myeongli knowledge remains available.
- Dedup uses sorted fact IDs + MBTI IDs + interaction type + context. Primary/supporting/caution buckets no longer replicate one packet. Comprehensive thematic/overview sections still reference the same interactionId; these are presentation references, not independent evidence. This does not claim NLP-level semantic dedup across differently authored rules.

## Correctness and regression

- Permanent regression: 丁丑/ENTJ with precision/authority tags selects zero 甲申 rules; the true 甲申 positive case still selects.
- All 60 pillar identities, 10 shortage/excess cases, ten-god absent/weak/present/strong/excessive cases, and absent 현침/도화/홍염/역마/문창/천을 cases are tested.
- Contradictory metadata, missing references and another type’s trait IDs are rejected; removing a feature only removes its dependent interactions.
- 3 real natal inputs × (16 types + missing) = 51 deterministic comprehensive generations and publish checks, with unchanged natal facts across MBTI counterfactuals.
- Six products pass the deterministic dispatcher → publication gate. Existing career correctness, compatibility swap, major repetition and annual monthly-fact suites remain intact.
- Mock writer receives the same matched sections/scenes as fallback. Actual network calls are forbidden by the test fetch guard.

## Before / after measurements

Three local synthetic-customer audit inputs: A 1996-12-06 14:15 KST male ENTJ; B 1980-05-15 09:30 KST female ISFJ; C 2001-08-20 16:20 KST male ENFP. Clock: 2026-09-23 12:00 KST. They are test inputs, not production records.

| Missing prerequisite in original selections | Before | After |
|---|---:|---:|
| Day pillar | 2 | 0 |
| Element state | 12 | 0 |
| Feature / nobleman / structure | 53 | 0 |
| Ten god / strength | 7 | 0 |

Counts re-evaluate original selected rule IDs against the corrected explicit predicates and the same canonical natal facts. Families can overlap and should not be added as distinct incidents. The after invariants are checked independently in behavioral tests.

| Metric | Before | After |
|---|---:|---:|
| ENTJ no-signal hints | 9 | 0 |
| Three unrelated signals | high | no interaction |
| One matched item copied into primary + caution | 2 copies | 1 item |
| 60-pillar wrong-selection audit | not exhaustively measured | 0 |
| 51 combinations | not run on baseline | 51 pass |
| Six-product generation | existing baseline | 6 pass |

| Sample | Fusion section references | Unique Fusion after | General hints | Scene count | Serialized prompt characters |
|---|---:|---:|---:|---:|---:|
| A | 112 → 32 | 14 | 9 → 2 | 2 → 2 | 393,031 → 401,640 |
| B | 52 → 6 | 3 | 10 → 5 | 0 → 0 | 342,983 → 339,274 |
| C | 60 → 10 | 5 | 10 → 1 | 0 → 0 | 369,125 → 363,956 |

Prompt measurement is `JSON.stringify(buildOpenAIComprehensiveReportWriterMessages(...)).length`, not tokens or cost. A increases because validated trace metadata is added; B/C decrease. Payload reduction is not used as a correctness claim. Remaining large profile dictionaries were not compressed in this task.

## Coverage

Fusion assets: 78; explicit fact predicates: 78; tag-only fact selection: 0. ENTJ-only: 26. Classification: 36 KEEP, 21 FIX PREDICATE, 14 DEPRECATE from Fusion, 7 NEEDS COVERAGE. KEEP means the authored single-fact interpretation is retained; the common selector hardening applies to it too.

The declared counts below are overlapping type allowlists, not personalized match guarantees. Observed counts are distinct matched Fusion rule IDs across the three natal inputs, recalculated for each type.

| MBTI | Declared type coverage | Observed across 3 natal inputs |
|---|---:|---:|
| INTJ | 21 | 8 |
| INTP | 16 | 7 |
| ENTJ | 49 | 22 |
| ENTP | 18 | 9 |
| INFJ | 15 | 8 |
| INFP | 14 | 7 |
| ENFJ | 15 | 8 |
| ENFP | 18 | 9 |
| ISTJ | 15 | 6 |
| ISFJ | 11 | 6 |
| ESTJ | 20 | 7 |
| ESFJ | 15 | 8 |
| ISTP | 10 | 3 |
| ISFP | 7 | 3 |
| ESTP | 14 | 5 |
| ESFP | 10 | 5 |

| Context | Catalog | Source-link-supported rules |
|---|---:|---:|
| money_asset | 11 | 10 |
| personality | 8 | 7 |
| human_relations | 12 | 9 |
| weaknesses | 7 | 3 |
| love_relationship | 10 | 7 |
| work_career | 13 | 10 |
| study_growth | 7 | 5 |
| final_advice | 4 | 3 |
| strengths | 2 | 1 |
| environment_luck | 4 | 2 |

| Interaction type | Supported Fusion rules |
|---|---:|
| agreement | 19 |
| tension | 14 |
| compensation | 0 |
| amplification | 3 |
| expression | 21 |
| context-switch | 0 |

The six scene rules cover INTP/ENTJ only: 3 agreement, 2 amplification, 1 expression. The common packet primarily preserves source-backed expression, plus the explicit ENFP compensation and ENTJ amplification classifications. Its 160 authored hints are conditional assets, not 160 proven customer interactions. No generic scene is synthesized for the other 14 types.

## Rule disposition

NEEDS COVERAGE: currently no complete source predicate can prove the authored claim, or the required feature strength is unavailable. DEPRECATE means exclude from cross-system selection, not delete the original knowledge text.

| Rule | Disposition |
|---|---|
| `fusion_wealth_strong_entj_achievement` | FIX PREDICATE |
| `fusion_gapsin_entj_leadership_control` | FIX PREDICATE |
| `fusion_qi_sha_entj_responsibility` | KEEP |
| `fusion_zheng_guan_entj_authority` | KEEP |
| `fusion_hyeonchim_entj_direct_speech` | KEEP |
| `fusion_water_no_resource_entj_dryness` | FIX PREDICATE |
| `fusion_water_missing_entj_emotional_dryness` | KEEP |
| `fusion_fire_no_output_entj_expression_contrast` | FIX PREDICATE |
| `fusion_no_output_entj_self_promotion` | KEEP |
| `fusion_jaeda_sinyak_entj_workaholic` | KEEP |
| `fusion_earth_excess_entj_reality` | KEEP |
| `fusion_metal_strong_entj_judgment` | KEEP |
| `fusion_gabmok_gapsin_entj_command` | FIX PREDICATE |
| `fusion_gwan_entj_leadership_work` | FIX PREDICATE |
| `fusion_hyeonchim_entj_strategy_work` | KEEP |
| `fusion_water_missing_entj_burnout_work` | KEEP |
| `fusion_wealth_entj_money_design` | FIX PREDICATE |
| `fusion_jaeda_entj_money_risk` | KEEP |
| `fusion_jaego_entj_asset` | FIX PREDICATE |
| `fusion_hongyeom_entj_charisma` | KEEP |
| `fusion_dohwa_entj_public_love` | KEEP |
| `fusion_fire_missing_entj_love_expression` | KEEP |
| `fusion_wealth_entj_love_realism` | FIX PREDICATE |
| `fusion_no_resource_entj_listening` | KEEP |
| `fusion_gwan_entj_high_standard` | FIX PREDICATE |
| `fusion_bijie_entj_competition` | NEEDS COVERAGE |
| `fusion_wood_nt_strategy` | FIX PREDICATE |
| `fusion_wood_missing_j_rigidity` | KEEP |
| `fusion_fire_e_expression` | FIX PREDICATE |
| `fusion_fire_missing_e_expression_contrast` | NEEDS COVERAGE |
| `fusion_earth_tj_asset` | FIX PREDICATE |
| `fusion_earth_excess_j_overload` | KEEP |
| `fusion_metal_t_precision` | FIX PREDICATE |
| `fusion_metal_excess_t_coldness` | KEEP |
| `fusion_water_nf_inner_flow` | FIX PREDICATE |
| `fusion_water_missing_t_empathy_gap` | NEEDS COVERAGE |
| `fusion_pian_cai_e_business` | KEEP |
| `fusion_zheng_cai_sj_asset` | KEEP |
| `fusion_qi_sha_tj_pressure_leadership` | KEEP |
| `fusion_zheng_guan_j_system` | KEEP |
| `fusion_shi_shen_fp_soft_expression` | KEEP |
| `fusion_shang_guan_np_critique` | KEEP |
| `fusion_zheng_yin_nf_recovery` | KEEP |
| `fusion_pian_yin_n_immersion` | KEEP |
| `fusion_bijian_ej_self_assertion` | KEEP |
| `fusion_jie_cai_ep_competition_risk` | KEEP |
| `fusion_hyeonchim_t_precision` | KEEP |
| `fusion_hongyeom_ef_charm` | KEEP |
| `fusion_dohwa_e_public` | KEEP |
| `fusion_hwagae_inf_art_depth` | NEEDS COVERAGE |
| `fusion_yeokma_pen_change` | KEEP |
| `fusion_gwimun_nfi_sensitivity` | NEEDS COVERAGE |
| `fusion_wonjin_relationship_distance` | DEPRECATE |
| `fusion_munchang_nt_nf_writing` | KEEP |
| `fusion_cheoneul_fj_support` | KEEP |
| `fusion_jaego_tj_sj_storage` | FIX PREDICATE |
| `fusion_f_metal_officer_coldness` | FIX PREDICATE |
| `fusion_t_water_emotional_depth` | FIX PREDICATE |
| `fusion_p_zheng_guan_responsibility` | FIX PREDICATE |
| `fusion_j_yeokma_change` | NEEDS COVERAGE |
| `fusion_i_dohwa_hongyeom_presence` | FIX PREDICATE |
| `fusion_s_resource_munchang_planning` | FIX PREDICATE |
| `fusion_n_earth_excess_reality_weight` | KEEP |
| `fusion_gwansal_honjob_relationship_pressure` | DEPRECATE |
| `fusion_siksang_saengjae_expression_money` | DEPRECATE |
| `fusion_jaesaenggwan_role_reputation` | DEPRECATE |
| `fusion_salin_growth_pressure` | DEPRECATE |
| `fusion_singang_independence` | DEPRECATE |
| `fusion_sinyak_support_need` | DEPRECATE |
| `fusion_toda_maegeum_standard_pressure` | DEPRECATE |
| `fusion_geumda_mokjeol_correction` | DEPRECATE |
| `fusion_mokda_hwasik_output` | DEPRECATE |
| `fusion_suda_mokbu_overthinking` | DEPRECATE |
| `fusion_goegang_tj_force` | NEEDS COVERAGE |
| `fusion_yangin_competition` | DEPRECATE |
| `fusion_cheonmun_n_insight` | KEEP |
| `fusion_jangseong_leadership` | DEPRECATE |
| `fusion_banan_status_support` | DEPRECATE |

## Remaining Bridge v2 work

- Scene coverage for the other 14 types, grounded in their actual trait IDs.
- The 7 explicitly listed coverage gaps need suitable source predicates before activation. Do not relax fact matching to raise coverage.
- 13 `합충형파해` source hints need relation-kind-specific structured bindings. A generic relation label does not prove a particular combination/clash; these hints are currently not selected.
- ENTJ source hint 정재 contains unresolved trait ID `structured_marriage_alliance`; it is ignored. Other valid linked traits can still be used. The source DB was not rewritten.
- Common packets do not infer ten-god strength from `weight` or prose. ENTJ 편관 / ENTP 상관 strength-dependent hints remain unavailable there unless an authoritative strength channel is provided; comprehensive can use existing computed strength facts.
- Better cross-layer semantic dedup and broader compensation/context-switch coverage require reviewed behavior-level bindings, not more generic text.
- Prompt size is still large. Compression and a full prose/quality rewrite are separate work.

## Changed scope and validation

Only report-knowledge fact selection/Bridge metadata and related tests/documentation changed. Calendar, Dayun, annual monthly calculations, payment/reliability, UI, DB schema, legal, consent, expiry, env and launch flags are unchanged.

Validation:

- `pnpm test`: 349 files, 3,172 tests passed. After removing an unused helper, its focused suite was rerun: 25 tests passed.
- `pnpm lint`, `pnpm build`, `git diff --check`: passed.
- `pnpm exec tsc --noEmit`: does not pass the existing repository baseline. Before and after both contain 387 test diagnostics, zero production-source diagnostics. Comparing diagnostic messages and multiplicities while ignoring shifted line numbers gives zero new and zero removed diagnostics.

Changed files (21):

- `src/lib/report-knowledge/bridge/factConditions.ts`
- `src/lib/report-knowledge/bridge/bridgeHintSelection.ts`
- `src/lib/report-knowledge/bridge/myeongliMbtiBridgeEngine.ts`
- `src/lib/report-knowledge/bridge/productBridgeAdapter.ts`
- `src/lib/report-knowledge/bridge/types.ts`
- `src/lib/report-knowledge/fusionFactContext.ts`
- `src/lib/report-knowledge/fusionKnowledgeTypes.ts`
- `src/lib/report-knowledge/fusionKnowledgeBase.ts`
- `src/lib/report-knowledge/knowledgeSelectors.ts`
- `src/lib/report-knowledge/comprehensiveReportEvidenceBuilder.ts`
- `src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder.ts`
- `src/lib/report-knowledge/comprehensiveReportEvidenceTypes.ts`
- `src/lib/report-knowledge/sajuMbtiBridgeScorer.ts`
- `tests/unit/report-knowledge/bridge/factConditions.test.ts`
- `tests/unit/report-knowledge/bridge/myeongliMbtiBridgeEngine.test.ts`
- `tests/unit/report-knowledge/bridge/productBridgeAdapter.test.ts`
- `tests/unit/report-knowledge/annualFortuneEvidence.test.ts`
- `tests/unit/report-knowledge/majorFortuneEvidence.test.ts`
- `tests/unit/report-knowledge/careerReportEvidence.test.ts`
- `tests/unit/report-generation/fusionBridgeFactRegression.test.ts`
- `docs/fusion-bridge-fact-condition-quality-01.md`

Pre-existing `.gitignore` and `supabase/.temp` changes are excluded.

No real OpenAI/Toss calls, production database writes, migrations or deployments were performed.
