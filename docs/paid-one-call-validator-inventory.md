# Paid writer contract inventory

Source: six product draft validators and their publication/evidence dependencies. This is an inventory of emitted code prefixes; dynamic field paths/terms are parameters, never persisted verbatim.

- **P**: deterministic evidence + complete latest fallback undergo the same product/publication checks **before HTTP**. A failure is contract attention, not a model repair request. This proves the known canonical output is valid; it cannot prevent an LLM from later violating a rule.
- **R**: narrowly replace the matching chapter/reading or marker-containing presentation leaf with its already validated canonical counterpart. Only when **all** issues are in this allowlist. Revalidate the complete result. No new advice/fact is invented.
- **F**: discard the writer draft in full; deliver the exact prevalidated fallback. All unrecognized/new errors also default to F. Unsafe medical or guaranteed claims are F, including attempts to disguise them with safe-word replacement.
- Plain schema/shape diagnostics (`must be`, `is too short`, missing/duplicate IDs, unexpected keys, per-array item errors) have unbounded field paths, not finite issue codes. Every such variant is **P/F**, recorded as `FIELD_INVALID`; no permissive repair.
- Birth-time/Dayun/annual monthly/Bridge validation uses the existing versioned product evidence/publish gate. No validator relaxation or new fact interpretation.
- Safe audit intentionally drops error suffixes because they may contain generated text. Full prompts, responses, names and arbitrary failure messages never enter delivery audit.
- `*_WARNING` entries are warning-only diagnostics: they do not fail publication or trigger fallback on their own.
- Table includes shared helpers and legacy validator codes too; it does not assert every code is reachable for every V2 product. The runtime default F covers all branches, including thrown validation errors.

| Issue prefix | Source | Preflight | Writer response |
|---|---|---|---|
| `ASSEMBLED_LONGFORM_PATTERN` | [comprehensiveReportDraftValidator:3517](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3517) | P | F |
| `CHAPTER_BODY_SAME_AS_HEADLINE` | [comprehensiveReportDraftValidator:56](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L56) | P | F |
| `CHAPTER_BODY_TOO_SHORT` | [comprehensiveReportDraftValidator:55](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L55) | P | F |
| `CHAPTER_DUPLICATE` | [comprehensiveReportDraftValidator:1302](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1302) | P | F |
| `CHAPTER_MISSING` | [comprehensiveReportDraftValidator:1299](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1299) | P | F |
| `CHAPTER_OPENING_PATTERN_REPEATED` | [comprehensiveReportDraftValidator:3689](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3689) | P | F |
| `CHAPTER_SAJU_TERMS_MISSING` | [comprehensiveReportDraftValidator:57](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L57) | P | F |
| `CHAPTER_SAJU_TERM_EXPLANATION_MISSING` | [comprehensiveReportDraftValidator:58](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L58) | P | F |
| `CONSECUTIVE_QUESTION_WARNING` | [comprehensiveReportDraftValidator:3695](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3695) | warning only | W: keep validated draft |
| `DIRECT_HIT_READING_MISSING` | [comprehensiveReportDraftValidator:60](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L60) | P | F |
| `DIRECT_HIT_READING_TOO_GENERIC` | [comprehensiveReportDraftValidator:59](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L59) | P | F |
| `DISPLAY_SECTION_EVIDENCE_TOO_LONG` | [comprehensiveReportDraftValidator:1451](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1451) | P | F |
| `DISPLAY_SECTION_TOO_LONG` | [comprehensiveReportDraftValidator:1448](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1448) | P | F |
| `ELEMENT_REMEDY_MISSING` | [comprehensiveReportDraftValidator:71](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L71) | P | F |
| `EVERYDAY_SCENE_MISSING` | [comprehensiveReportDraftValidator:80](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L80) | P | R, 실패 시 F |
| `FINAL_MESSAGE_CLOSING_MISSING` | [comprehensiveReportDraftValidator:72](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L72) | P | F |
| `FINAL_MESSAGE_SOLUTIONS_MISSING` | [comprehensiveReportDraftValidator:74](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L74) | P | F |
| `FINAL_MESSAGE_TOO_SHORT` | [comprehensiveReportDraftValidator:73](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L73) | P | F |
| `FORBIDDEN_PROPHECY_PHRASE` | [comprehensiveReportDraftValidator:1212](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1212) | P | F |
| `GENERIC_PLACEHOLDER_BODY` | [comprehensiveReportDraftValidator:1503](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1503) | P | F |
| `GENERIC_USER_LABEL_COPY` | [comprehensiveReportDraftValidator:92](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L92) | P | F |
| `INVALID_CHAPTER_ID` | [comprehensiveReportDraftValidator:1305](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1305) | P | F |
| `LONGFORM_READING_MISSING` | [comprehensiveReportDraftValidator:75](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L75) | P | F |
| `LONGFORM_READING_TOO_SHORT` | [comprehensiveReportDraftValidator:76](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L76) | P | F |
| `LOVE_BAD_MATCH_MISSING` | [comprehensiveReportDraftValidator:65](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L65) | P | F |
| `LOVE_BAD_MATCH_PATTERN_MISSING` | [comprehensiveReportDraftValidator:64](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L64) | P | F |
| `LOVE_COMPLEMENT_MISSING` | [comprehensiveReportDraftValidator:66](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L66) | P | F |
| `LOVE_MBTI_CAUTION_MISSING` | [comprehensiveReportDraftValidator:68](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L68) | P | F |
| `LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING` | [comprehensiveReportDraftValidator:67](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L67) | P | F |
| `LOVE_PARTNER_FIT_MISSING` | [comprehensiveReportDraftValidator:63](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L63) | P | F |
| `MBTI_FIRST_FORBIDDEN` | [comprehensiveReportDraftValidator:1536](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1536) | P | F |
| `MBTI_SUPPORT_MISSING` | [comprehensiveReportDraftValidator:81](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L81) | P | F |
| `MBTI_TYPE_EXAMPLE_FORBIDDEN` | [comprehensiveReportDraftValidator:91](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L91) | P | F |
| `MEETING_SCENE_DENSITY_WARNING` | [comprehensiveReportDraftValidator:3681](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3681) | warning only | W: keep validated draft |
| `MEETING_SCENE_OVERUSE` | [comprehensiveReportDraftValidator:90](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L90) | P | F |
| `MILD_INTERNAL_META_COPY` | [comprehensiveReportDraftValidator:84](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L84) | P | F |
| `OPENAI_API_KEY` | [comprehensiveReportDraftValidator:222](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L222) | P | F |
| `PRIVATE_FIELD_LEAK` | [comprehensiveReportDraftValidator:1217](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1217) | P | F |
| `PROFILE_TABLE_INVALID` | [comprehensiveReportDraftValidator:1311](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1311) | P | F |
| `PROFILE_TABLE_MISSING` | [comprehensiveReportDraftValidator:1308](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1308) | P | F |
| `QUESTION_DENSITY_WARNING` | [comprehensiveReportDraftValidator:3692](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3692) | warning only | W: keep validated draft |
| `RAW_SAJU_LABEL_EXPLANATION_MISSING` | [comprehensiveReportDraftValidator:82](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L82) | P | R, 실패 시 F |
| `REPEATED_KEY_PHRASE_OVERUSE` | [comprehensiveReportDraftValidator:3573](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3573) | P | F |
| `REPEATED_KEY_PHRASE_WARNING` | [comprehensiveReportDraftValidator:3677](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3677) | warning only | W: keep validated draft |
| `REPEATED_LONG_SENTENCE` | [comprehensiveReportDraftValidator:1592](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1592) | P | F |
| `REPEATED_QUESTION` | [comprehensiveReportDraftValidator:89](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L89) | P | F |
| `REPEATED_SENTENCE` | [comprehensiveReportDraftValidator:88](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L88) | P | F |
| `SAJU_FEATURE_CHAPTER_MISSING` | [comprehensiveReportDraftValidator:77](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L77) | P | F |
| `SAJU_FEATURE_CHAPTER_TOO_SHORT` | [comprehensiveReportDraftValidator:78](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L78) | P | F |
| `SAJU_FEATURE_ITEM_INCOMPLETE` | [comprehensiveReportDraftValidator:79](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L79) | P | F |
| `SAJU_FEATURE_SPOTLIGHT_EMPTY` | [comprehensiveReportDraftValidator:3662](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3662) | P | F |
| `SAJU_FEATURE_SPOTLIGHT_USAGE_NOT_DETECTED` | [comprehensiveReportDraftValidator:3671](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3671) | P | F |
| `SAJU_SIGNATURE_SCENES_EMPTY` | [comprehensiveReportDraftValidator:3665](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L3665) | P | F |
| `SAJU_TERM_EXPLANATION_MISSING` | [comprehensiveReportDraftValidator:1512](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1512) | P | F |
| `SCHEMA_MISSING_REQUIRED_FIELD` | [comprehensiveReportDraftValidator:1314](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1314) | P | F |
| `SECTION_BODY_SAME_AS_ONELINE` | [comprehensiveReportDraftValidator:1493](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1493) | P | F |
| `SECTION_BODY_TOO_SHORT` | [comprehensiveReportDraftValidator:1496](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1496) | P | F |
| `SOLUTION_LINES_MISSING` | [comprehensiveReportDraftValidator:61](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L61) | P | F |
| `SOLUTION_LINES_TOO_GENERIC` | [comprehensiveReportDraftValidator:62](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L62) | P | F |
| `SUPABASE_SERVICE_ROLE` | [comprehensiveReportDraftValidator:221](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L221) | P | F |
| `TOSS_SECRET_KEY` | [comprehensiveReportDraftValidator:220](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L220) | P | F |
| `UNSAFE_ADVERTISING_COPY` | [comprehensiveReportDraftValidator:86](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L86) | P | F |
| `UNSAFE_CERTAINTY_COPY` | [comprehensiveReportDraftValidator:87](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L87) | P | F |
| `UNSAFE_INVESTMENT_COPY` | [comprehensiveReportDraftValidator:1162](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1162) | P | F |
| `UNSAFE_LEGAL_COPY` | [comprehensiveReportDraftValidator:1160](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1160) | P | F |
| `UNSAFE_MEDICAL_COPY` | [comprehensiveReportDraftValidator:85](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L85) | P | F |
| `UNSUPPORTED_SAJU_TERM` | [comprehensiveReportDraftValidator:1287](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L1287) | P | F |
| `V2_TEMPLATE_LABEL_COPY` | [comprehensiveReportDraftValidator:83](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L83) | P | F |
| `VISIBLE_EVIDENCE_DEBUG_LABEL` | [comprehensiveReportDraftValidator:2891](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L2891) | P | F |
| `WORK_STUDY_CONTEXT_MISSING` | [comprehensiveReportDraftValidator:70](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L70) | P | F |
| `WORK_STUDY_SCOPE_MISSING` | [comprehensiveReportDraftValidator:69](../src/lib/report-generation/comprehensiveReportDraftValidator.ts#L69) | P | F |
| `CAREER_REPORT` | [careerReportDraftValidator:360](../src/lib/report-generation/careerReportDraftValidator.ts#L360) | P | F |
| `CAREER_REPORT_ACTION_PLAN` | [careerReportDraftValidator:407](../src/lib/report-generation/careerReportDraftValidator.ts#L407) | P | F |
| `CAREER_REPORT_ACTION_PLAN_LABELS_INVALID` | [careerReportDraftValidator:413](../src/lib/report-generation/careerReportDraftValidator.ts#L413) | P | F |
| `CAREER_REPORT_BUY_SELL_INSTRUCTION_SANITIZED` | [careerReportDraftValidator:463](../src/lib/report-generation/careerReportDraftValidator.ts#L463) | P | F |
| `CAREER_REPORT_CAREER_PATHS` | [careerReportDraftValidator:393](../src/lib/report-generation/careerReportDraftValidator.ts#L393) | P | F |
| `CAREER_REPORT_CAREER_TIMING` | [careerReportDraftValidator:400](../src/lib/report-generation/careerReportDraftValidator.ts#L400) | P | F |
| `CAREER_REPORT_DRAFT_NOT_OBJECT` | [careerReportDraftValidator:328](../src/lib/report-generation/careerReportDraftValidator.ts#L328) | P | F |
| `CAREER_REPORT_FINANCIAL_GUARANTEE_SANITIZED` | [careerReportDraftValidator:457](../src/lib/report-generation/careerReportDraftValidator.ts#L457) | P | F |
| `CAREER_REPORT_HARD_CLAIM_SANITIZED` | [careerReportDraftValidator:454](../src/lib/report-generation/careerReportDraftValidator.ts#L454) | P | F |
| `CAREER_REPORT_INTERNAL_ARTIFACT_SANITIZED` | [careerReportDraftValidator:466](../src/lib/report-generation/careerReportDraftValidator.ts#L466) | P | F |
| `CAREER_REPORT_INVESTMENT_STYLE_INVALID` | [careerReportDraftValidator:434](../src/lib/report-generation/careerReportDraftValidator.ts#L434) | P | F |
| `CAREER_REPORT_MONEY_STYLE_CHANNELS_INVALID` | [careerReportDraftValidator:423](../src/lib/report-generation/careerReportDraftValidator.ts#L423) | P | F |
| `CAREER_REPORT_PRODUCT_TYPE_INVALID` | [careerReportDraftValidator:345](../src/lib/report-generation/careerReportDraftValidator.ts#L345) | P | F |
| `CAREER_REPORT_PRODUCT_VERSION_INVALID` | [careerReportDraftValidator:348](../src/lib/report-generation/careerReportDraftValidator.ts#L348) | P | F |
| `CAREER_REPORT_RECOMMENDED_JOBS` | [careerReportDraftValidator:379](../src/lib/report-generation/careerReportDraftValidator.ts#L379) | P | F |
| `CAREER_REPORT_RECOMMENDED_JOB_VARIETY_WARNING` | [careerReportDraftValidator:438](../src/lib/report-generation/careerReportDraftValidator.ts#L438) | warning only | W: keep validated draft |
| `CAREER_REPORT_SAFETY_NOTES_REPAIRED` | [careerReportDraftValidator:218](../src/lib/report-generation/careerReportDraftValidator.ts#L218) | P | F |
| `CAREER_REPORT_SAFETY_NOTE_WARNING` | [careerReportDraftValidator:246](../src/lib/report-generation/careerReportDraftValidator.ts#L246) | warning only | W: keep validated draft |
| `CAREER_REPORT_TICKER_SANITIZED` | [careerReportDraftValidator:460](../src/lib/report-generation/careerReportDraftValidator.ts#L460) | P | F |
| `CAREER_REPORT_UNSUITABLE_JOBS` | [careerReportDraftValidator:386](../src/lib/report-generation/careerReportDraftValidator.ts#L386) | P | F |
| `CAREER_REPORT_VERSION_INVALID` | [careerReportDraftValidator:342](../src/lib/report-generation/careerReportDraftValidator.ts#L342) | P | F |
| `OPENAI_API_KEY` | [careerReportDraftValidator:68](../src/lib/report-generation/careerReportDraftValidator.ts#L68) | P | F |
| `CAREER_ELEMENT_ABSENCE` | [careerEvidenceClaims:23](../src/lib/report-generation/careerEvidenceClaims.ts#L23) | P | F |
| `CAREER_ELEMENT_CLAIM` | [careerEvidenceClaims:24](../src/lib/report-generation/careerEvidenceClaims.ts#L24) | P | F |
| `CAREER_EVIDENCE_REQUIRED` | [careerEvidenceClaims:15](../src/lib/report-generation/careerEvidenceClaims.ts#L15) | P | F |
| `CAREER_FEATURE_CLAIM` | [careerEvidenceClaims:27](../src/lib/report-generation/careerEvidenceClaims.ts#L27) | P | F |
| `CAREER_INTERNAL_MARKER` | [careerEvidenceClaims:19](../src/lib/report-generation/careerEvidenceClaims.ts#L19) | P | R, 실패 시 F |
| `CAREER_MBTI_CLAIM` | [careerEvidenceClaims:31](../src/lib/report-generation/careerEvidenceClaims.ts#L31) | P | F |
| `CAREER_STRENGTH_CLAIM` | [careerEvidenceClaims:43](../src/lib/report-generation/careerEvidenceClaims.ts#L43) | P | F |
| `CAREER_TEN_GOD_CLAIM` | [careerEvidenceClaims:39](../src/lib/report-generation/careerEvidenceClaims.ts#L39) | P | F |
| `CAREER_TIMING_BASIS` | [careerEvidenceClaims:54](../src/lib/report-generation/careerEvidenceClaims.ts#L54) | P | F |
| `CAREER_TIMING_CLAIM` | [careerEvidenceClaims:61](../src/lib/report-generation/careerEvidenceClaims.ts#L61) | P | F |
| `CAREER_TIMING_RANGE` | [careerEvidenceClaims:49](../src/lib/report-generation/careerEvidenceClaims.ts#L49) | P | F |
| `LOVE_MARRIAGE_CHILD_DETERMINISTIC_PARTNER` | [loveMarriageChildReportDraftValidator:198](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L198) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT` | [loveMarriageChildReportDraftValidator:69](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L69) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_ACTION_PLAN_LABELS_INVALID` | [loveMarriageChildReportDraftValidator:173](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L173) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_DRAFT_NOT_OBJECT` | [loveMarriageChildReportDraftValidator:114](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L114) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_FORBIDDEN_EXPRESSION` | [loveMarriageChildReportDraftValidator:183](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L183) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_PRODUCT_TYPE_INVALID` | [loveMarriageChildReportDraftValidator:123](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L123) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_PRODUCT_VERSION_INVALID` | [loveMarriageChildReportDraftValidator:126](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L126) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_SAFETY_NOTES_TOO_SHORT` | [loveMarriageChildReportDraftValidator:178](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L178) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_BREAKUP_REUNION_CLAIM` | [loveMarriageChildReportDraftValidator:189](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L189) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_CHILD_CLAIM` | [loveMarriageChildReportDraftValidator:186](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L186) | P | F |
| `LOVE_MARRIAGE_CHILD_REPORT_VERSION_INVALID` | [loveMarriageChildReportDraftValidator:120](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L120) | P | F |
| `LOVE_MARRIAGE_CHILD_UNSUPPORTED_PARTNER_TYPE` | [loveMarriageChildReportDraftValidator:196](../src/lib/report-generation/loveMarriageChildReportDraftValidator.ts#L196) | P | F |
| `COMPATIBILITY_A_TO_B_FATIGUE_MISSING` | [compatibilityReportDraftValidator:639](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L639) | P | F |
| `COMPATIBILITY_B_TO_A_FATIGUE_MISSING` | [compatibilityReportDraftValidator:642](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L642) | P | F |
| `COMPATIBILITY_CATEGORY_EVIDENCE_MISMATCH` | [compatibilityReportDraftValidator:877](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L877) | P | F |
| `COMPATIBILITY_CHAPTER_MISSING` | [compatibilityReportDraftValidator:568](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L568) | P | F |
| `COMPATIBILITY_DIRECTION_EVIDENCE_REQUIRED` | [compatibilityReportDraftValidator:817](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L817) | P | F |
| `COMPATIBILITY_DIRECTION_MISMATCH` | [compatibilityReportDraftValidator:848](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L848) | P | F |
| `COMPATIBILITY_DIRECTION_TEXT_MISMATCH` | [compatibilityReportDraftValidator:852](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L852) | P | F |
| `COMPATIBILITY_DIRECT_HIT_MISSING` | [compatibilityReportDraftValidator:585](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L585) | P | F |
| `COMPATIBILITY_FINAL_ADVICE_LABEL_MISMATCH_WARNING` | [compatibilityReportDraftValidator:129](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L129) | warning only | W: keep validated draft |
| `COMPATIBILITY_FINAL_ADVICE_MISSING` | [compatibilityReportDraftValidator:887](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L887) | P | F |
| `COMPATIBILITY_PERSON_MISMATCH` | [compatibilityReportDraftValidator:830](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L830) | P | F |
| `COMPATIBILITY_RELATIONSHIP_ANALYSIS_MISSING` | [compatibilityReportDraftValidator:628](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L628) | P | F |
| `COMPATIBILITY_RELATIONSHIP_TYPE_NOT_CANONICAL` | [compatibilityReportDraftValidator:599](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L599) | P | F |
| `COMPATIBILITY_REPEATED_LONG_SENTENCE` | [compatibilityReportDraftValidator:742](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L742) | P | F |
| `COMPATIBILITY_REPETITIVE_ADVICE_WARNING` | [compatibilityReportDraftValidator:765](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L765) | warning only | W: keep validated draft |
| `COMPATIBILITY_ROLE_MISMATCH` | [compatibilityReportDraftValidator:824](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L824) | P | F |
| `COMPATIBILITY_SCHEMA_INVALID` | [compatibilityReportDraftValidator:866](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L866) | P | F |
| `COMPATIBILITY_SCORE_MISSING` | [compatibilityReportDraftValidator:882](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L882) | P | F |
| `GENERIC_COMPATIBILITY_ADVICE` | [compatibilityReportDraftValidator:657](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L657) | P | F |
| `MBTI_CANDIDATE_RECOMMENDATION_NOT_ALLOWED` | [compatibilityReportDraftValidator:678](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L678) | P | F |
| `UNSAFE_COMPATIBILITY_COPY` | [compatibilityReportDraftValidator:649](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L649) | P | F |
| `UNSUPPORTED_COMPATIBILITY_TERM` | [compatibilityReportDraftValidator:693](../src/lib/report-generation/compatibilityReportDraftValidator.ts#L693) | P | F |
| `MAJOR_FORTUNE_ACTION_PLAN_INVALID` | [majorFortuneReportDraftValidator:2430](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2430) | P | F |
| `MAJOR_FORTUNE_AGE_BASIS_REPETITION_WARNING` | [majorFortuneReportDraftValidator:2693](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2693) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_ANNUAL_TONE_WARNING` | [majorFortuneReportDraftValidator:2560](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2560) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_ARTIFICIAL_REPETITION_FILLER` | [majorFortuneReportDraftValidator:2539](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2539) | P | F |
| `MAJOR_FORTUNE_BIG_THEMES_INVALID` | [majorFortuneReportDraftValidator:2447](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2447) | P | F |
| `MAJOR_FORTUNE_BIG_THEME_SCENES_INVALID` | [majorFortuneReportDraftValidator:2451](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2451) | P | F |
| `MAJOR_FORTUNE_CHAPTER_COUNT_INVALID` | [majorFortuneReportDraftValidator:2455](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2455) | P | F |
| `MAJOR_FORTUNE_CYCLE_INDEX_LEAK_WARNING` | [majorFortuneReportDraftValidator:2572](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2572) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_INVALID` | [majorFortuneReportDraftValidator:2481](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2481) | P | F |
| `MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_MISSING_YEARS` | [majorFortuneReportDraftValidator:2490](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2490) | P | F |
| `MAJOR_FORTUNE_DECADE_CARDS_INVALID` | [majorFortuneReportDraftValidator:2439](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2439) | P | F |
| `MAJOR_FORTUNE_DECADE_CARD_DOMAINS_INVALID` | [majorFortuneReportDraftValidator:2444](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2444) | P | F |
| `MAJOR_FORTUNE_DECADE_TONE_WARNING` | [majorFortuneReportDraftValidator:2563](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2563) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_DOMAIN_FLOW_INVALID` | [majorFortuneReportDraftValidator:2408](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2408) | P | F |
| `MAJOR_FORTUNE_DUPLICATE_BIG_THEME_WARNING` | [majorFortuneReportDraftValidator:2632](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2632) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_HEADLINE_WARNING` | [majorFortuneReportDraftValidator:2678](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2678) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_PUSH_WARNING` | [majorFortuneReportDraftValidator:2637](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2637) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_REDUCE_WARNING` | [majorFortuneReportDraftValidator:2645](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2645) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_DUPLICATE_TOP_PUSH_WARNING` | [majorFortuneReportDraftValidator:2640](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2640) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_DUPLICATE_TOP_REDUCE_WARNING` | [majorFortuneReportDraftValidator:2648](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2648) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_EMPTY_MYEONGLI_BASIS_WARNING` | [majorFortuneReportDraftValidator:2627](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2627) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_FINAL_ADVICE_DOMAINS_INVALID` | [majorFortuneReportDraftValidator:2498](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2498) | P | F |
| `MAJOR_FORTUNE_FINAL_ADVICE_INVALID` | [majorFortuneReportDraftValidator:2493](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2493) | P | F |
| `MAJOR_FORTUNE_FORBIDDEN_EXPRESSION` | [majorFortuneReportDraftValidator:2535](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2535) | P | F |
| `MAJOR_FORTUNE_GENERIC_TIMELINE_WARNING` | [majorFortuneReportDraftValidator:2592](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2592) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_INTERNAL_WORD_VISIBLE` | [majorFortuneReportDraftValidator:2530](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2530) | P | F |
| `MAJOR_FORTUNE_LAUNCH_SECTION_MISSING` | [majorFortuneReportDraftValidator:2401](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2401) | P | F |
| `MAJOR_FORTUNE_LIKELY_SCENES_INVALID` | [majorFortuneReportDraftValidator:2459](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2459) | P | F |
| `MAJOR_FORTUNE_NORMALIZED_REPETITION` | [majorFortuneReportDraftValidator:2006](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2006) | P | F |
| `MAJOR_FORTUNE_PHASE_TIMELINE_INVALID` | [majorFortuneReportDraftValidator:2469](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2469) | P | F |
| `MAJOR_FORTUNE_PHASE_TIMELINE_ORDER_INVALID` | [majorFortuneReportDraftValidator:2475](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2475) | P | F |
| `MAJOR_FORTUNE_PRACTICAL_ADVICE_INVALID` | [majorFortuneReportDraftValidator:2465](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2465) | P | F |
| `MAJOR_FORTUNE_RELATIONSHIP_STATUS_MISUSE_WARNING` | [majorFortuneReportDraftValidator:2607](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2607) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_REPEATED_LONG_SENTENCE` | [majorFortuneReportDraftValidator:1997](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L1997) | P | F |
| `MAJOR_FORTUNE_REPEATED_STRATEGY_WARNING` | [majorFortuneReportDraftValidator:2622](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2622) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_REPEATED_SUMMARY_WARNING` | [majorFortuneReportDraftValidator:2597](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2597) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_REPEATED_THEME_WARNING` | [majorFortuneReportDraftValidator:2617](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2617) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_RISK_MANAGEMENT_INVALID` | [majorFortuneReportDraftValidator:2427](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2427) | P | F |
| `MAJOR_FORTUNE_SAFETY_NOTES_INVALID` | [majorFortuneReportDraftValidator:2501](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2501) | P | F |
| `MAJOR_FORTUNE_SAFETY_NOTES_REPAIRED` | [majorFortuneReportDraftValidator:2556](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2556) | P | F |
| `MAJOR_FORTUNE_SAFETY_NOTE_WARNING` | [majorFortuneReportDraftValidator:2552](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2552) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_SCHEMA_INVALID` | [majorFortuneReportDraftValidator:2515](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2515) | P | F |
| `MAJOR_FORTUNE_SHORT_STRATEGY_BODY_WARNING` | [majorFortuneReportDraftValidator:2653](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2653) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_SLASH_SEPARATED_WHY_STRONG_WARNING` | [majorFortuneReportDraftValidator:2673](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2673) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_SMALL_EVENT_OVERFOCUS_WARNING` | [majorFortuneReportDraftValidator:2582](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2582) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_STRONG_YEARS_INVALID` | [majorFortuneReportDraftValidator:2478](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2478) | P | F |
| `MAJOR_FORTUNE_STRONG_YEAR_REASON_WARNING` | [majorFortuneReportDraftValidator:2567](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2567) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_STRONG_YEAR_TITLE_REPEAT_WARNING` | [majorFortuneReportDraftValidator:2612](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2612) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_TECHNICAL_TERM_WARNING` | [majorFortuneReportDraftValidator:2577](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2577) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_TIMELINE_CURRENT_YEAR_MISSING` | [majorFortuneReportDraftValidator:2487](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2487) | P | F |
| `MAJOR_FORTUNE_TIMELINE_ROWS_INVALID` | [majorFortuneReportDraftValidator:2484](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2484) | P | F |
| `MAJOR_FORTUNE_TIMELINE_SPACING_WARNING` | [majorFortuneReportDraftValidator:2688](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2688) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_UNKNOWN_RELATIONSHIP_PILL_WARNING` | [majorFortuneReportDraftValidator:2668](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2668) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_UNKNOWN_STATUS_EXPOSURE_WARNING` | [majorFortuneReportDraftValidator:2658](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2658) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_WEAK_AUXILIARY_STAR_WARNING` | [majorFortuneReportDraftValidator:2683](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2683) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_WEAK_SPECIFICITY_WARNING` | [majorFortuneReportDraftValidator:2663](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2663) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_WEAK_STRATEGY_WARNING` | [majorFortuneReportDraftValidator:2602](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2602) | warning only | W: keep validated draft |
| `MAJOR_FORTUNE_WRONG_CYCLE_BASIS_WARNING` | [majorFortuneReportDraftValidator:2587](../src/lib/report-generation/majorFortuneReportDraftValidator.ts#L2587) | warning only | W: keep validated draft |
| `ANNUAL_FORTUNE_ACTION_PLAN_REQUIRED` | [annualFortuneReportDraftValidator:1457](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1457) | P | F |
| `ANNUAL_FORTUNE_CHAPTER_COUNT_INVALID` | [annualFortuneReportDraftValidator:1460](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1460) | P | F |
| `ANNUAL_FORTUNE_CURRENT_YEAR_TONE_REVIEW_ONLY` | [annualFortuneReportDraftValidator:1542](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1542) | P | F |
| `ANNUAL_FORTUNE_DOMAIN_FLOW_EMPTY` | [annualFortuneReportDraftValidator:1517](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1517) | P | F |
| `ANNUAL_FORTUNE_FINAL_ADVICE_INVALID` | [annualFortuneReportDraftValidator:1477](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1477) | P | F |
| `ANNUAL_FORTUNE_FORBIDDEN_EXPRESSION` | [annualFortuneReportDraftValidator:1636](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1636) | P | F |
| `ANNUAL_FORTUNE_INTERNAL_WORD_VISIBLE` | [annualFortuneReportDraftValidator:1631](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1631) | P | F |
| `ANNUAL_FORTUNE_LIKELY_SCENES_INVALID` | [annualFortuneReportDraftValidator:1464](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1464) | P | F |
| `ANNUAL_FORTUNE_MODE_TONE_MISSING` | [annualFortuneReportDraftValidator:1530](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1530) | P | F |
| `ANNUAL_FORTUNE_MONTHLY_FLOW_INVALID` | [annualFortuneReportDraftValidator:1474](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1474) | P | F |
| `ANNUAL_FORTUNE_MONTHLY_HIGHLIGHTS_REQUIRED` | [annualFortuneReportDraftValidator:1451](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1451) | P | F |
| `ANNUAL_FORTUNE_PRACTICAL_ADVICE_INVALID` | [annualFortuneReportDraftValidator:1470](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1470) | P | F |
| `ANNUAL_FORTUNE_REQUIRED_SECTION_EMPTY` | [annualFortuneReportDraftValidator:1500](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1500) | P | F |
| `ANNUAL_FORTUNE_RISK_MANAGEMENT_REQUIRED` | [annualFortuneReportDraftValidator:1454](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1454) | P | F |
| `ANNUAL_FORTUNE_SAFETY_NOTES_INVALID` | [annualFortuneReportDraftValidator:1480](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1480) | P | F |
| `ANNUAL_FORTUNE_SCHEMA_INVALID` | [annualFortuneReportDraftValidator:1582](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1582) | P | F |
| `ANNUAL_FORTUNE_VAGUE_COPY_WARNING` | [annualFortuneReportDraftValidator:1625](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1625) | warning only | W: keep validated draft |
| `ANNUAL_MONTH_EVIDENCE_INVALID` | [annualFortuneReportDraftValidator:1614](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1614) | P | F |
| `ANNUAL_MONTH_FACTS_MISMATCH` | [annualFortuneReportDraftValidator:1595](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1595) | P | F |
| `ANNUAL_MONTH_PUBLICATION_MISMATCH` | [annualFortuneReportDraftValidator:1610](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1610) | P | F |
| `ANNUAL_MONTH_SELECTED_YEAR_MISMATCH` | [annualFortuneReportDraftValidator:1593](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1593) | P | F |
| `ANNUAL_READING_EVIDENCE_MISMATCH` | [annualFortuneReportDraftValidator:1596](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1596) | P | F |
| `ANNUAL_READING_PUBLICATION_MISMATCH` | [annualFortuneReportDraftValidator:1602](../src/lib/report-generation/annualFortuneReportDraftValidator.ts#L1602) | P | F |
| `ANNUAL_MONTH_V2_REQUIRED` | [productPublishGate:23](../src/lib/report-generation/productPublishGate.ts#L23) | P | F |
| `BIRTH_TIME_CONTEXT_INVALID` | [productPublishGate:44](../src/lib/report-generation/productPublishGate.ts#L44) | P | F |
| `BIRTH_TIME_PILLAR_MISMATCH` | [productPublishGate:63](../src/lib/report-generation/productPublishGate.ts#L63) | P | F |
| `CONTENT_DENSITY_LOW` | [productPublishGate:138](../src/lib/report-generation/productPublishGate.ts#L138) | P | F |
| `DRAFT_REQUIRED` | [productPublishGate:45](../src/lib/report-generation/productPublishGate.ts#L45) | P | F |
| `EVIDENCE_INCOMPLETE` | [productPublishGate:88](../src/lib/report-generation/productPublishGate.ts#L88) | P | F |
| `EVIDENCE_MBTI_MISMATCH` | [productPublishGate:126](../src/lib/report-generation/productPublishGate.ts#L126) | P | F |
| `EVIDENCE_PRODUCT_MISMATCH` | [productPublishGate:50](../src/lib/report-generation/productPublishGate.ts#L50) | P | F |
| `EVIDENCE_REQUIRED` | [productPublishGate:49](../src/lib/report-generation/productPublishGate.ts#L49) | P | F |
| `EVIDENCE_SECTIONS_INCOMPLETE` | [productPublishGate:91](../src/lib/report-generation/productPublishGate.ts#L91) | P | F |
| `EXCESSIVE_REPETITION` | [productPublishGate:147](../src/lib/report-generation/productPublishGate.ts#L147) | P | F |
| `EXCESSIVE_SENTENCE_REPETITION` | [productPublishGate:146](../src/lib/report-generation/productPublishGate.ts#L146) | P | F |
| `FIVE_ELEMENTS_INCOMPLETE` | [productPublishGate:122](../src/lib/report-generation/productPublishGate.ts#L122) | P | F |
| `GENERIC_FEATURE_REPETITION` | [productPublishGate:149](../src/lib/report-generation/productPublishGate.ts#L149) | P | F |
| `INTERNAL_MARKER` | [productPublishGate:152](../src/lib/report-generation/productPublishGate.ts#L152) | P | R, 실패 시 F |
| `INVALID_DRAFT_OR_EVIDENCE` | [productPublishGate:83](../src/lib/report-generation/productPublishGate.ts#L83) | P | F |
| `LONGFORM_REQUIRED` | [productPublishGate:134](../src/lib/report-generation/productPublishGate.ts#L134) | P | F |
| `MANSERYEOK_INCOMPLETE` | [productPublishGate:116](../src/lib/report-generation/productPublishGate.ts#L116) | P | F |
| `MBTI_REQUIRED` | [productPublishGate:125](../src/lib/report-generation/productPublishGate.ts#L125) | P | F |
| `PILLAR_REQUIRED` | [productPublishGate:111](../src/lib/report-generation/productPublishGate.ts#L111) | P | F |
| `PRODUCT_MISMATCH` | [productPublishGate:48](../src/lib/report-generation/productPublishGate.ts#L48) | P | F |
| `SAJU_FEATURES_REQUIRED` | [productPublishGate:129](../src/lib/report-generation/productPublishGate.ts#L129) | P | F |
| `UNCONFIRMED_HOUR_PUBLISHED` | [productPublishGate:62](../src/lib/report-generation/productPublishGate.ts#L62) | P | F |
| `UNSUPPORTED_PRODUCT` | [productPublishGate:84](../src/lib/report-generation/productPublishGate.ts#L84) | P | F |
| `EVIDENCE_INVALID` | [productEvidenceValidation:20](../src/lib/report-generation/productEvidenceValidation.ts#L20) | P | F |
| `EVIDENCE_REQUIRED` | [productEvidenceValidation:18](../src/lib/report-generation/productEvidenceValidation.ts#L18) | P | F |
| `CUSTOMER_DAYUN_REQUIRED` | [dayunPublication:35](../src/lib/report-generation/dayunPublication.ts#L35) | P | F |
| `DAYUN_ANNUAL_MISMATCH` | [dayunPublication:122](../src/lib/report-generation/dayunPublication.ts#L122) | P | F |
| `DAYUN_BASIS_INVALID` | [dayunPublication:46](../src/lib/report-generation/dayunPublication.ts#L46) | P | F |
| `DAYUN_CUSTOMER_MISMATCH` | [dayunPublication:48](../src/lib/report-generation/dayunPublication.ts#L48) | P | F |
| `DAYUN_CYCLE_INVALID` | [dayunPublication:72](../src/lib/report-generation/dayunPublication.ts#L72) | P | F |
| `DAYUN_DECADE_READING_INVALID` | [dayunPublication:98](../src/lib/report-generation/dayunPublication.ts#L98) | P | F |
| `DAYUN_DIRECTION_MISMATCH` | [dayunPublication:59](../src/lib/report-generation/dayunPublication.ts#L59) | P | F |
| `DAYUN_DRAFT_CYCLE_MISMATCH` | [dayunPublication:91](../src/lib/report-generation/dayunPublication.ts#L91) | P | F |
| `DAYUN_FIXTURE_FORBIDDEN` | [dayunPublication:124](../src/lib/report-generation/dayunPublication.ts#L124) | P | F |
| `DAYUN_INPUT_MISMATCH` | [dayunPublication:54](../src/lib/report-generation/dayunPublication.ts#L54) | P | F |
| `DAYUN_SELECTION_MISMATCH` | [dayunPublication:77](../src/lib/report-generation/dayunPublication.ts#L77) | P | F |
| `DAYUN_SEQUENCE_INVALID` | [dayunPublication:63](../src/lib/report-generation/dayunPublication.ts#L63) | P | F |
| `DAYUN_START_INVALID` | [dayunPublication:75](../src/lib/report-generation/dayunPublication.ts#L75) | P | F |
| `DAYUN_TARGET_MISMATCH` | [dayunPublication:55](../src/lib/report-generation/dayunPublication.ts#L55) | P | F |
| `DAYUN_TIMELINE_MISMATCH` | [dayunPublication:94](../src/lib/report-generation/dayunPublication.ts#L94) | P | F |
| `DAYUN_TRANSITION_MISMATCH` | [dayunPublication:83](../src/lib/report-generation/dayunPublication.ts#L83) | P | F |
| `DAYUN_UNCERTAINTY_NOTICE_REQUIRED` | [dayunPublication:85](../src/lib/report-generation/dayunPublication.ts#L85) | P | F |
| `DAYUN_YEAR_EMPHASIS_MISMATCH` | [dayunPublication:115](../src/lib/report-generation/dayunPublication.ts#L115) | P | F |
| `DAYUN_YEAR_FACT_MISMATCH` | [dayunPublication:111](../src/lib/report-generation/dayunPublication.ts#L111) | P | F |
| `CANONICAL_PRESENTATION` | [paidWriterRescue:97](../src/lib/report-generation/paidWriterRescue.ts#L97) | P | F |
| `CONTENT_REQUIRED` | [paidWriterRescue:71](../src/lib/report-generation/paidWriterRescue.ts#L71) | P | F |
| `DRAFT_REQUIRED` | [paidWriterRescue:59](../src/lib/report-generation/paidWriterRescue.ts#L59) | P | F |
| `EXCESSIVE_REPETITION` | [paidWriterRescue:78](../src/lib/report-generation/paidWriterRescue.ts#L78) | P | F |
| `FIELD_INVALID` | [paidWriterRescue:20](../src/lib/report-generation/paidWriterRescue.ts#L20) | P | F |
| `UNSAFE_MEDICAL_OR_GUARANTEED_CLAIM` | [paidWriterRescue:70](../src/lib/report-generation/paidWriterRescue.ts#L70) | P | F |
| `UNSUPPORTED_SAJU_TERM` | [paidWriterRescue:65](../src/lib/report-generation/paidWriterRescue.ts#L65) | P | F |
| `WRITER_FACT_MISMATCH` | [paidWriterRescue:60](../src/lib/report-generation/paidWriterRescue.ts#L60) | P | F |
