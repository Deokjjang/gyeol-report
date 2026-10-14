# Global Book Planner — design contract only

Plan the complete Book jointly after binding hard gates. `PlannerParagraphRequirement` records Reader Question, primary/secondary meaning, required Evidence, allowed products/context, explanation/positive/risk/twist role, introduced meaning, duplicate group, source roots and expression requirement. No planner executes in this task.

Use a lexicographic objective; weights are deliberately not fixed:

1. Zero evidence, owner, direction, domain, time or approval violations.
2. Maximize satisfied mandatory paragraph questions.
3. Maximize independently distinguishable meaning units.
4. Maximize product and relationship specificity.
5. Minimize repeated meanings between chapters.
6. Minimize excessive reuse of the same source root.
7. Improve reading continuity without adding unsupported claims.
8. Preserve deterministic output for identical versioned inputs.

Compare a constraint solver, constrained global search and a deterministic baseline on identical eligible-candidate sets before choosing an implementation. Report constraint violations, question coverage, unique meaning count, specialist coverage, interchapter duplication, source-root concentration, recall validity, transition quality, runtime and deterministic digest. Do not invent an aggregate score to hide a hard failure.

Maintain a ledger for SAME_FACT, SAME_CLAIM, SAME_MEANING, NEW_APPLICATION, VALID_RECALL and DIFFERENT_MEANING. A new approved application may share a source fact while answering a different question; a synonym or alternate sentence does not add a meaning. Record the first introduced chapter, explained semantic units, actual owner/direction/window, claim identity and source ancestry. Recall requires an actually displayed compatible antecedent. Missing mandatory questions return gaps, not filler.

A future deterministic tie-break can use reviewed paragraph order and stable candidate keys after the objective comparison; candidate discovery order and machine locale cannot alter the result. Tie-break policy, algorithm/version and candidate set digest must be recorded. The policy is a proposal to evaluate, not a current runtime change.
