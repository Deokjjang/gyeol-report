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
