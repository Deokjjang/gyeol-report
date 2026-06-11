# Report Knowledge Architecture

## Purpose

REPORT-01 creates the foundation for the Saju x MBTI knowledge base. It does
not generate the final report body, call OpenAI, run RAG at runtime, or change
payment behavior.

The goal is to make the future comprehensive report depend on structured
evidence instead of a loose prompt.

## Product Rule

The user should feel:

> 내 MBTI가 이래서 그런 줄 알았는데, 사주에도 이 구조가 있었네.

That means the report must not read like MBTI first and Saju second. The base
interpretation starts from the Saju chart. MBTI is used as the user's felt
self-image, then it amplifies, softens, or contrasts the Saju evidence.

## Why Saju Is Primary

사주가 1차 근거다.

The Saju layer contains day master, day pillar, five elements, ten gods,
special patterns, sinsal, noblemen, combinations, balance, and useful element
hints. These are the first basis for personality, work, money, love, relation,
family, study, environment, and advice sections.

## Why MBTI Is Secondary

MBTI는 보조 근거다.

MBTI is still important because users already recognize themselves through it.
It helps the report speak in a way the user can feel. Internally, MBTI tags are
used to confirm, amplify, or contrast the Saju basis. It should never replace
the Saju basis.

## Knowledge Layers

Layer 1 is Saju facts: day masters, day pillars, five elements, ten gods,
special patterns, noblemen, sinsal, relation signals, element balance, and
useful element hints.

Layer 2 is MBTI facts: all 16 types, preference tendencies, function stacks,
relationship preferences, work style, money style, weakness tags, and Saju
bridge tags.

Layer 3 is interpretation tags: typed traits such as achievement drive,
sharp analysis, emotional dryness, romantic attraction, responsibility
pressure, burnout risk, precision skill, independence, and competition.

Layer 4 is fusion rules: Saju feature x MBTI feature, Saju feature x missing
element, sinsal x MBTI function, ten god x topic, and nobleman x support
patterns.

Layer 5 is section-ready evidence: each report section receives Saju evidence,
MBTI evidence, and matched fusion rules. Saju evidence is ordered first.

## RAG And Source Collection

RAG/source collection is for DB building, not output copying.

External reading may help refine the structured DB later, but raw source
paragraphs should not be copied into app data or final output. The app stores
short original summaries, typed tags, and phrase seeds. The final report writer
will consume these structured entries, not pasted source text.

## How Entries Work

Each Saju entry has an id, category, Korean label, aliases, summary, meaning,
positive tags, risk tags, topic weights, MBTI bridge tags, and short phrase
seeds.

Each MBTI entry has the type, Korean label, common alias, function stack,
summary, trait tags, risk tags, topic weights, Saju bridge tags, relationship
preferences, and short phrase seeds.

Each fusion rule has a kind:

- reinforcement: Saju and MBTI point in the same direction.
- contrast: Saju and MBTI appear different, increasing credibility.
- compensation: one layer explains how to balance the other.
- topic_specialization: the match matters mainly in a topic such as money,
  work, love, study, or relationships.

## Expansion Rule

Future expansion should add entries, not rewrite section logic. The DB should
grow toward all 60 day pillars, more day-master variants, more element balance
states, more ten-god combinations, richer nobleman and sinsal conditions, and
more topic-specific fusion rules.

Every new entry must use typed interpretation tags. Every fusion rule must
reference valid Saju entry ids. No entry should contain long copied source
paragraphs or deterministic prediction phrasing.

## REPORT-02 Saju Knowledge Expansion

REPORT-02 expands Saju DB first.

The Saju knowledge base must be deep enough to explain a report even before
MBTI is considered. 사주 단독 해석 is required. 오행, 십성, 신살,
귀인, 일주 are first-class knowledge, and 격국, 구조, 용희신-style hints
should be added as distilled structured entries rather than copied paragraphs.

MBTI remains secondary. MBTI reinforces, contrasts, or personalizes the Saju
interpretation, but the report must visibly begin from Saju terms such as
오행, 십성, 일주, 신살, 귀인, 격국, and 용희신.

RAG/source collection may be used in future offline research to identify
meanings and variants, but source/RAG collection is used for DB refinement,
not output copying. The stored knowledge base must contain original structured
entries with topic weights, phrase seeds, risks, advice, and bridge tags.

## REPORT-03 MBTI Knowledge Expansion

REPORT-03 expands MBTI DB.

MBTI knowledge is not used as the primary fortune basis. MBTI remains secondary:
it represents the user's self-recognized personality pattern and helps
reinforce, contrast, and personalize Saju interpretation.

The report should not say "ENTJ라서 그렇습니다" first. It should say
"사주에는 이런 구조가 있고, 입력하신 ENTJ 성향도 이 구조와 맞물립니다."

All 16 types are structured by function stack, topic-specific behavior,
relationship style, work style, money style, risks, growth advice, and Saju
bridge tags. No copied source paragraphs should be stored in the DB.

## REPORT-04 Fusion Rules and Evidence Packets

REPORT-04 expands fusion rules.

Fusion rules explain how Saju and MBTI interact. A reinforcement rule is used
when Saju and MBTI point in the same direction. A contrast rule is used when
the user's MBTI self-image and Saju structure differ. A compensation rule is
used when one system explains what the other lacks. A topic specialization
rule is used for love, money, career, human relations, study, and environment.

A compensation rule is used to describe the balancing work needed when one
system exposes a gap that the other system can explain.

Before OpenAI generation, the system builds a comprehensive evidence packet.
The evidence packet is not final prose. It is the structured basis for the
final report writer. It contains primary Saju evidence, supporting MBTI
evidence, and matched fusion evidence for each canonical report section.

Saju remains primary. MBTI supports and contrasts the Saju basis. The report
should feel Saju-first, with MBTI increasing personal accuracy.

## REPORT-05 Computed Facts Mapping

REPORT-05 maps computed Saju facts to knowledge entry ids.

The system separates Saju calculation from report interpretation. A calculation
layer produces computed facts such as day master, day pillar, element balance,
ten-god signals, patterns, sinsal, and gwiin. REPORT-05 maps those computed
facts to the structured Saju knowledge base.

Computed facts are not invented by the mapper. The mapper must never invent a
Saju entry. Unsupported facts are returned as warnings and unmapped facts so the
knowledge base can be expanded safely. Mapping happens before evidence packet
construction, and full manse calculation is separate from mapping when no
compatible calculator is available.

## REPORT-06 OpenAI Writer Boundary

REPORT-06 uses OpenAI only as writer.

OpenAI does not calculate Saju facts. Deterministic calculation and knowledge
mapping happen first, then the evidence packet comes before generation. The
model receives the comprehensive evidence packet and writes a structured Korean
report draft JSON.

OpenAI must not invent Saju terms, mention Saju entries outside the packet, or
make MBTI the primary basis. MBTI remains a support layer that reinforces,
contrasts, or personalizes the Saju interpretation.

The structured JSON draft is validated before any future save or rendering
step. DB save/rendering happens later. REPORT-06 does not save the generated
report to the database and does not render it on the result page.

## REPORT-07 Draft Snapshot Persistence

REPORT-07 persists validated draft JSON.

OpenAI generation happens before persistence, but this persistence boundary
does not call OpenAI. It accepts an already generated ComprehensiveReportDraft,
validates the draft JSON, and saves the validated snapshot to the paid report
record.

The save boundary verifies that the report is linked to a paid payment order
before writing the snapshot. It returns safe metadata only and does not expose
the stored report body, input snapshot, payment provider identifiers, access
tokens, or share tokens.

DB save is separate from result rendering. Validated snapshot only is stored
in REPORT-07, and there is no result page rendering yet.

## REPORT-08 Result Snapshot Rendering

REPORT-08 renders saved validated snapshot data.

The result page reads a paid report by report id, receives the stored
ComprehensiveReportDraft from report_snapshot, validates it again, and renders
the opening, core line, sections, evidence summaries, Saju terms, MBTI support
terms, and final advice.

OpenAI generation is not called here. DB save already happened in REPORT-07.
Result page rendering is separate from generation and payment. If a paid report
does not have a generated snapshot yet, the page keeps the safe placeholder state
instead of exposing raw JSON or private fields.

## Future OpenAI Use

OpenAI generation later will receive section-ready evidence from selectors:

1. Saju evidence
2. MBTI evidence
3. Fusion rules
4. Section schema and weights

The model will be a sentence generator, not the source of truth. The knowledge
base decides what can be said. The generator only turns evidence into readable
Korean copy.

## REPORT-01 Boundary

REPORT-01 does not implement final content.

This task only creates schema, seed data, selectors, validators, and
documentation. Final Saju x MBTI interpretation content, prompt design, OpenAI
API integration, runtime RAG, and result-page UX are separate future phases.
