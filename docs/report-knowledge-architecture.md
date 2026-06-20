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

## REPORT-09 Generate and Persist Smoke

REPORT-09 orchestrates generation and persistence.

The server-only smoke flow connects computed facts to evidence packet,
OpenAI writer, validated draft, and snapshot persistence. This is the first
step where a real generated comprehensive report draft can be saved and then
viewed on the result page.

The result page can render after save because REPORT-08 already reads and
validates the stored snapshot. REPORT-09 still does not wire automatic report
generation into the payment success flow. Payment flow wiring happens later
after quality review.

## REPORT-10 Draft Quality Guardrails

REPORT-10 improves draft quality guardrails.

The writer prompt and draft validator block internal meta copy from paid report
body text. Terms such as storage details, debug notes, schema details, and test
copy are not user-facing report content.

Unsupported Saju terms are rejected when the writer validates against the
allowed terms derived from the evidence packet. If a Saju term such as a sinsal,
gwiin, ten-god, five-element state, day master, day pillar, or pattern is not in
the evidence, the generated draft must not introduce it.

Display sections are separated from interpretation. manse_table and mbti_table
may contain only short neutral display copy, while interpretation belongs in
saju_core, saju_mbti_fusion, personality, strengths, weaknesses, work, money,
love, relationships, study, environment, and final advice sections.

MBTI-first phrasing is rejected outside MBTI-specific sections. The report
should not open a core interpretation with "ENTJ라서 그렇다." It should start
from Saju structure and then explain how MBTI supports, contrasts, or compensates
that structure.

## REPORT-11 Report UX and Content Density

REPORT-11 improves comprehensive report UX and content density.

Display sections are not treated as long interpretation prose. The result page
separates deterministic display-style areas from interpretation sections, so
the user sees a cleaner Saju summary card and MBTI summary card before reading
the generated body.

Evidence UI is secondary. Section bodies are shown first, while evidence
summaries, Saju terms, and MBTI support terms are tucked into a collapsible
analysis evidence area.

The OpenAI writer prompt demands deeper Saju term explanation. The report must
explain what a Saju term means in plain Korean and why that term produces a
behavioral, relational, money, or career consequence. It should not merely list
terms.

Draft validation now includes generated-section density checks for the OpenAI
writer path. Interpretation sections that are too short, repeat the one-line
summary, use generic placeholder copy, omit Saju-term explanation, or repeat
the same key phrase too often are rejected.

## REPORT-12 Narrative Product Format

REPORT-12 converts the comprehensive report from an analysis-table format into
a narrative product format.

The V2 draft version is `comprehensive_v2_draft`. Instead of many small
sections, V2 uses eight long-form chapters: opening, Saju identity, personality
pattern, work-money-study, love relationships, people-family-environment,
risk and growth, and final message.

Saju remains primary and MBTI remains supporting, but evidence lists are no
longer repeated as visible report UI. Saju terms, MBTI support, and fusion
logic are written into the body naturally so the user reads a paid report, not
a debug view of the evidence packet.

The V2 prompt asks for richer scenes, examples, metaphors, direct tone, study
and career detail, money and asset behavior, love and relationship patterns,
family and environment fit, and concrete growth strategy.

The V2 validator enforces narrative chapter density, required chapter ids,
Saju-first structure, unsupported Saju term rejection, internal meta copy
rejection, no visible evidence debug labels, and repeated full sentence checks.

Migration 0012 supports saving and reading both `comprehensive_v1_draft` and
`comprehensive_v2_draft` snapshots. Existing V1 snapshots remain readable, and
the result page renders V2 without analysis evidence blocks while keeping V1
backward compatibility.

## REPORT-13 Hit-Reading and Prescription Layer

REPORT-13 adds hit-reading and prescription to the V2 narrative product
format. The report should move from "this person has these traits" to "this
situation probably happens often, the Saju structure explains why, and this is
how to use it."

The V2 result page starts with a compact deterministic manseok/profile table
instead of report id, product, status, or explanatory summary cards. The table
shows only available facts such as pillars, day master, day pillar, element
distribution, excessive or missing elements, ten-god signals, sinsal, gwiin,
and MBTI. It must not invent missing pillars or unsupported Saju terms.

The V2 prompt requires each major chapter to include 바로 와닿는 장면 문장, Saju
basis, MBTI support, concrete scene examples, and practical prescriptions.
Product-facing solution labels such as 이렇게 쓰면 좋습니다, 피해야 할 패턴,
맞는 환경, 관계에서 써먹을 것, and 공부/일 루틴 may appear in the body, while
debug-style evidence labels remain hidden.

The work-money-study chapter covers work roles, earning style, asset defense,
certificates, professional books, 직무 학습, 사업 학습, motivation, routines,
and burnout prevention. The love chapter includes partner fit criteria, bad match
patterns, and cautious MBTI examples without deterministic compatibility claims.
The risk-and-growth chapter includes interpretation-based element
remedies such as water, fire, and earth balance habits without medical or luck
guarantees.
Bad match patterns are part of the love prescription, but they must be written
as cautious fit guidance rather than deterministic compatibility claims.
The prompt and validator also check bad match patterns as a product requirement.

The V2 validator checks for enough direct hit-reading, practical solutions,
study/work scope, partner prescriptions, element-based remedies, unsupported
Saju terms, visible debug labels, and repeated full sentences. V1 compatibility
remains, and payment or Toss flow wiring is still separate.

## REPORT-15A Saju Feature Taxonomy and Scoring

REPORT-15A adds a 명리학 Feature Taxonomy so the report can grow beyond a small
set of repeated Saju terms. A feature entry stores its category, Korean label,
aliases, polarity, topics, narrative weight, symbolic image, positive reading,
caution reading, practical use, scene seeds, phrase seeds, and future MBTI bridge
needs.

Feature Scoring ranks available computed Saju features before writing. The score
combines base weight, topic relevance, category relevance, vividness, polarity
balance, and duplicate category penalty. Vivid mixed features such as 도화살,
반안살, 백호대살, 현침살, 원진살, and strong gwiin features can be selected without
letting warning-only material dominate the report.

Chapter Feature Selector maps scored features to V2 chapters. For example,
work_money_study can receive ten-god, gwiin, twelve-sinsal, structure, and
element features, while love_relationships can receive sinsal, element,
ten-god, relation, and gwiin features. Each chapter receives top positive
features, warning or mixed features, one vivid feature when available, and one
practical-use feature.

Future MBTI Bridge Needs prepare the next integration layer. Saju features can
declare needs such as emotional_buffer, warmth, stability, autonomy_respect,
intellectual_match, pace_flexibility, responsibility_clarity, and
expression_support. REPORT-15A only stores the bridge hints; it does not build
the full MBTI complement scorer yet.

OpenAI does not invent Saju features. OpenAI receives selected feature evidence
from the taxonomy, scoring, and selector layers, then writes natural Korean
prose. Feature taxonomy enables richer and more varied report generation while
keeping deterministic Saju feature ownership outside the writer.

## REPORT-15B Sinsal Gwiin Gilshin Expansion

REPORT-15B expands the 신살·귀인·길신 knowledge layer inside the feature
taxonomy. The goal is broader interpretation material for 십이신살, 주요 신살,
귀인, 길신, and structure helpers, without changing calculation logic or report
generation flow.

The expansion policy is feature based. Entries such as 반안살, 장성살, 역마살,
화개살, 지살, 육해살, 망신살, 겁살, 재살, 천살, 월살, 도화살, 홍염살,
백호대살, 현침살, 귀문관살, 원진살, 양인살, 괴강살, 공망, 천문성,
문곡귀인, 천을귀인, 문창귀인, 재고귀인, 금여록, 천의성, and 암록 are
stored as reusable feature entries. They are not fixed sentence templates for a
specific person.

Strong metaphor is allowed when it helps the user feel the feature. A good
feature entry can describe 반안살 as a general on a saddle, 도화살 as a place
where attention rests, or 백호대살 as a sharp crisis-response energy. The
metaphor must stay interpretive and should not turn into deterministic claims.

The forbidden expression policy blocks certainty, guarantee, medicalized, and
profit-promise wording from taxonomy phrase fields. Good features can feel
clearly positive, but positive gilsin still needs cautious language such as
"can stand out", "can become useful", or "this flow can open when the
environment fits."

MBTI bridge needs are assigned where useful. For example, water missing can
connect to emotional_buffer, fire missing to warmth and expression_support,
earth excess to pace_flexibility, and learning-related gwiin such as 문창귀인 or
학당귀인 to intellectual_match. The full MBTI complement scorer remains a later
step.

## REPORT-15C 60 Day Pillar Knowledge Database

REPORT-15C adds a 60갑자 일주 지식 DB. Each day pillar entry stores its Korean
label, stem, branch, element image, symbolic image, core keywords, personality
reading, work-money reading, love-relationship reading, family-people reading,
growth reading, positive reading, caution reading, practical use, scene seeds,
phrase seeds, related topics, polarity, vividness, and future MBTI bridge needs.

Day pillar data is the identity anchor for the narrative report. It lets the
system say "this chart has this 일주, this is the image, this is the style, and
this is how to use it" without asking the writer to invent day pillar meanings.
For example, 갑신일주 can be represented as a large tree standing on sharp metal,
병오일주 as the midday sun, and 계해일주 as deep water.

The day pillar knowledge maps into the same feature scoring model as 신살,
귀인, 오행, 십성, and structures. The mapped feature category is `day_pillar`, so
saju_identity can prioritize it, personality_pattern can use it when the
personality topic matches, work_money_study and love_relationships can use it
when topic tags match, and final_message can keep it as an identity anchor.

The 금지 표현 정책 also applies to day pillar fields. Day pillar entries should
not contain certainty claims, guarantee claims, medicalized claims, bankruptcy
or death predictions, or English template residue. Strong Korean phrasing is
allowed when it remains interpretive and practical.

OpenAI should not invent day pillar meanings. OpenAI should receive selected
day pillar evidence after deterministic selection. Day pillar knowledge will be
connected to report generation in a later task.

## REPORT-15D V2 Report Evidence Connection

REPORT-15D connects the feature warehouse to V2 generation evidence. The flow is
computed saju facts -> feature id extraction -> taxonomy and day-pillar lookup
-> Feature Scoring -> Chapter Feature Selector -> selectedSajuFeatureEvidence
inside the comprehensive evidence packet.

Feature extraction from computed facts only maps facts that were actually
calculated. For example, 갑신 maps to the `day_pillar_gapsin` feature, 화 부족
to `element_fire_missing`, 수 부족 to `element_water_missing`, 토 과다 to
`element_earth_excess`, 현침살 to `sinsal_hyeonchim`, 홍염살 to
`sinsal_hongyeom`, 귀문관살 to `sinsal_gwimun`, 원진살 to `sinsal_wonjin`, and
재고귀인 to `gwiin_jaego`. If a feature such as 반안살, 백호대살, 천을귀인, or
문창귀인 is not present in computed facts, it is not included.

Chapter-level feature evidence is grouped by V2 chapter. Opening receives a
compact identity mix, saju_identity receives day-pillar and strong structure
features, work_money_study receives money/work/study features, love_relationships
receives relationship features, risk_and_growth receives missing/excess element
and warning or mixed features, and final_message receives a balanced practical
closing set. The prompt size cap keeps opening at four features, most chapters
at six features, and final_message at five features.

OpenAI feature invention prevention is explicit. The writer receives
selectedSajuFeatureEvidence and is told to use only provided 명리학 feature
evidence, not to invent missing 신살, 귀인, 길신, 일주 meanings, 오행, 십성, or
patterns. Positive features should feel desirable without certainty claims, and
warning features should be explained as energy plus 운영법 rather than fear.

## REPORT-15E Computed Feature Extraction

REPORT-15E expands deterministic computed feature extraction before V2 evidence
selection. The rule set version is `SAJU_FEATURE_EXTRACTION_RULESET_VERSION =
"v1"`. V1 is the internal calculation standard used for service consistency;
some 신살, 귀인, and 십이신살 formulas can differ by school, so school-variant
items are documented here and can be revised by changing the rule-set version.

Computed Feature Extraction receives available pillars, stems, branches,
element balance, ten-god signals, structures, existing sinsal facts, and existing
gwiin facts. It returns `ComputedSajuFeatureExtractionResult` with the rule-set
version, deduped feature ids, and safe details describing whether each feature
came from a pillar, branch, stem, element, ten_god, pattern, or existing_fact.

The V1 twelve-sinsal calculation uses the day branch as the base when available,
and falls back to the year branch when day branch is unavailable. It applies the
four 삼합 groups: 申子辰, 寅午戌, 亥卯未, and 巳酉丑. The extractor can produce
feature ids such as `twelve_sinsal_banan`, `twelve_sinsal_jangseong`,
`twelve_sinsal_yeokma`, `twelve_sinsal_hwagae`, `twelve_sinsal_jisal`,
`twelve_sinsal_yukhae`, `twelve_sinsal_mangsin`, `twelve_sinsal_cheonsal`,
`twelve_sinsal_wolsal`, and `twelve_sinsal_nyeonsal` only when a matching branch
exists in the chart input.

The V1 gwiin calculation is table-driven by day master plus branch presence.
The minimum computed set is 천을귀인, 문창귀인, 재고귀인, 금여록, and 암록,
mapped to `gwiin_cheoneul`, `gwiin_munchang`, `gwiin_jaego`,
`gwiin_geumyeorok`, and `gwiin_amrok`. Existing gwiin facts and aliases such as
천덕귀인, 월덕귀인, 태극귀인, 학당귀인, 복성귀인, 문곡귀인, and 천의성 are
still mapped when upstream calculation already provides them.

Major sinsal extraction is also table-driven where V1 rules are stable enough
for internal use. Day-pillar tables detect 백호대살 and 괴강살. Stem-to-branch
or branch-pair rules detect 양인살, 현침살, 도화살, 귀문관살, 원진살, 공망,
and 천문성 where the required stem, branch, or pair exists. Existing facts and
aliases such as 백호살, 백호대살, 도화, 홍염, 귀문살, 귀문관살, 원진살,
반안살, 장성살, 역마살, and 화개살 are still accepted as existing_fact input.

Evidence builder integration is:

1. computed facts
2. computed feature extractor
3. feature-id merge and de-duplication
4. scoring
5. chapter selector
6. selectedSajuFeatureEvidence

No feature invention policy remains unchanged. If the extractor does not compute
or receive a feature such as 반안살, 백호대살, 천을귀인, or 문창귀인, that feature
is not passed to OpenAI. OpenAI can only use selected feature evidence already
present in the evidence packet.

## REPORT-15F Evidence Debug and Surfacing

REPORT-15F adds a diagnostic path for the full feature flow:

1. computed feature ids
2. selected saju feature evidence
3. prompt evidence
4. deterministic profile table display
5. narrative usage requirements

When `OPENAI_REPORT_WRITER_DEBUG_SAFE=1` is enabled, smoke scripts can print a
safe evidence summary. The summary includes feature counts and Korean labels
only. It does not print birth dates, raw birth data, API keys, OpenAI prompts,
or full report text. The debug output includes `computed saju feature ids`,
`computed saju feature labels`, `selected saju feature evidence total`,
`selected saju feature evidence by chapter`, and `excluded high scoring
features`.

The debug layer also emits a selected evidence narrowness warning when the
selected evidence stays on the older narrow set, when no `twelve_sinsal` feature
is selected, or when no 귀인/길신 beyond 재고귀인 is selected. These warnings are
diagnostic only and do not fail report generation.

The deterministic V2 profile table can now surface grouped computed features:
`십이신살`, `주요 신살`, and `귀인/길신`. These rows must be populated only from
computed or selected feature evidence. Taxonomy-only features are not displayed.

The prompt now requires each chapter to naturally use at least two features from
its own `selectedSajuFeatureEvidence[chapterId]`. Good 길신 and 귀인 should use
their symbolic image and practical direction at least once. Warning or mixed
신살 should be explained as strength plus 운영법, not as fear.

Until a dedicated MBTI complement scorer exists, relationship copy should not
list fixed MBTI examples such as `ISFP`, `INFP`, or `INTP`. The report should
describe relationship needs instead, such as emotional buffering, stable life
rhythm, responsibility clarity, and respect for distance.

REPORT-15F-A aligns this no-type-example policy with the V2 validator. The love
chapter still needs an MBTI limitation sentence, but the accepted form is a
caution such as "MBTI is a support indicator, not a compatibility guarantee" or
"actual life rhythm, promise habits, and emotional expression matter more than
the type name." Fixed recommended-type examples stay blocked until a dedicated
MBTI complement scorer exists.

## REPORT-15G Feature Spotlight and Signature Scenes

REPORT-15G adds deterministic surfacing for computed feature evidence. The
evidence packet can now include `sajuFeatureSpotlight` and
`sajuSignatureScenes`.

`sajuFeatureSpotlight` groups selected computed features into:

- `good_fortune`: good fortune and supportive features such as 천을귀인, 재고귀인,
  and 암록.
- `talent`: strengths and talents such as 장성살, 현침살, 갑신일주, 편관, and
  정관.
- `caution`: mixed or warning features such as 원진살, 공망, 망신살, 천살, and
  재다신약.
- `balance`: missing or excessive balance features such as 수 부족, 화 부족,
  무식상, 무인성, and 토 과다.

The result page renders this spotlight under the deterministic V2 profile
table. Empty groups are hidden, and taxonomy-only features are not displayed.

`sajuSignatureScenes` are deterministic combination rules. They fire only when
all required feature ids are present, with optional MBTI gating when explicitly
defined. Example rules include 현침살 + ENTJ, 천을귀인 + 무인성, 재고귀인 +
편재/정재, 장성살 + 정관, and 수 부족 + 무인성. These scenes are not final prose;
they are concrete scene evidence that helps the writer produce a more vivid
report without inventing unsupported features.

Safe debug summaries now include spotlight groups and signature scene titles.
They still print counts and labels only, not birth data, prompts, or full report
body.

The prompt instructs the writer to use at least one spotlight or signature scene
in each major chapter when available. This is a usage requirement for provided
evidence only. OpenAI must not invent missing feature ids, 신살, 귀인, 길신,
일주 meanings, 오행 states, 십성, or patterns.

## REPORT-15H Feature Accuracy Audit and Reading Polish

REPORT-15H adds a deterministic feature audit layer for checking what the V1
rule set actually detects from the four pillars. The audit reports normalized
pillars, stems, branches, day master, day branch, detected feature labels,
twelve-sinsal results under multiple basis checks, and watched-but-not-detected
items such as 반안살, 백호대살, 문창귀인, 금여록, 도화살, 역마살, and 화개살.

The audit is diagnostic only. If a watched feature is not detected under the
current V1 rule set, it must not be shown in the final user report. Computed
features are surfaced strongly, but absent features are not invented.

The local smoke helper `scripts/smoke_audit_saju_features.ts` runs without
OpenAI, Supabase, payment state, or API keys. It prints safe labels and rule
diagnostics only.

Spotlight cards remain deterministic but are more compact: feature name, badge,
one-line meaning, short vivid reading, and one practical line. Good fortune
features should feel desirable, while caution features should explain a scene
and an operating method instead of frightening the user.

Signature scene rules can now carry multiple `sceneLines`. The report writer
should use these as varied scene evidence, not copy them verbatim, and should
mix concrete contexts such as meetings, KakaoTalk, family requests, account
separation, professional reading, relationship conversations, and late-night
rumination.

Final generated report copy must not leak internal generation terms such as
`signature scene`, `spotlight`, `feature evidence`, `selected evidence`,
`computed feature`, `prompt`, `schema`, `OpenAI`, `JSON`, `draft`, `debug`,
체감형 명중, 정리와 각인, 시그니처 장면, 스포트라이트, 선택된 근거, 계산된
feature, 생성 프롬프트, or 내부 지시.

## REPORT-15I Grid Table and Scene Density Polish

REPORT-15I changes the visible V2 profile table from a vertical list into a
four-pillar grid. The grid order is 시주, 일주, 월주, 연주, and the rows are
천간, 지지, 십성, 지장간, 십이운성, 십이신살, 신살, and 귀인. Only deterministic
values may be filled. If per-pillar 십성, 지장간, 십이운성, 신살, or 귀인 data is
not available, the UI renders `-` instead of guessing.

Compact summary rows remain below the grid for 일간, 오행 분포, 과다/부족, 주요
구조, 신살 요약, 귀인/길신 요약, and MBTI 입력값. These rows can show computed
feature summaries without pretending they are per-pillar cells.

Spotlight rendering is card-based and capped at three items per group. Each card
uses feature name, badge, a compact meaning/reading line, and one practical line.
Good fortune copy may be strong and desirable, but must not use certainty or
guarantee language.

The prompt now limits question-style lines per chapter and pushes concrete
scenes first. Validator warnings flag dense or consecutive question-like lines,
and exact duplicate questions remain a failure. Repeated tracked phrases warn
after moderate overuse and fail only after heavy overuse.

The feature audit smoke output includes basis diagnostics for watched items:
반안살 is checked across year/day/month/hour branch basis, and 백호대살 is checked
under day-pillar and all-pillar diagnostics. This audit is still diagnostic only
and does not make absent features visible in the final report.

## REPORT-16A Manseok Parity and Pillar-Level Placement

REPORT-16A separates the default smoke fixture from the canonical external
manse fixture used for parity checks.

- `DEFAULT_SMOKE_SAJU_FIXTURE`: the historical smoke fixture, `丙子 己亥 甲申 丁未`.
- `DEOKMIN_EXTERNAL_MANSE_FIXTURE`: the external comparison fixture for
  `1999-07-31 07:30 KST`, expected as `己卯 辛未 甲申 戊辰`.

The smoke audit can be run with:

- `pnpm dlx tsx scripts/smoke_audit_saju_features.ts --fixture default`
- `pnpm dlx tsx scripts/smoke_audit_saju_features.ts --fixture deokmin`

For the external fixture, the audit prints external expected pillars, current
calculated pillars, and per-pillar parity PASS/FAIL. If a birth-to-pillar
calculator is unavailable or fails, the audit must say that explicitly instead
of silently treating fixture pillars as calculated pillars.

Pillar-level placement is represented by `SajuPillarFeaturePlacement`. It stores
the feature id, Korean label, category, pillar key, Korean pillar label, source
pillar, source stem/branch when available, calculation basis, and confidence.
Final report rendering uses only `production` placements. `diagnostic` and
`external_fixture` placements are for audit/debug comparison and must not be
displayed as confirmed user features.

The four-pillar table can now fill deterministic rows when source data exists:

- heavenly stem and earthly branch
- heavenly-stem ten-god and branch main ten-god relative to the day master
- hidden stems
- twelve life stage
- per-pillar twelve-sinsal, major sinsal, and gwiin/gilshin placements

Missing cells still render as `-`. The UI must not invent unavailable ten-god,
hidden-stem, twelve-life-stage, sinsal, or gwiin data.

반안살 and 백호살 discrepancy handling is explicit:

- production result: whether the V1 production extraction selected the feature
- diagnostic basis result: whether alternate audit checks saw the feature
- external fixture placement result: whether the external fixture comparison
  marks the feature and where

If a feature appears only in external comparison, it stays out of the final
confirmed table unless the production rule set later adopts that basis.

## REPORT-16B Fixture Matrix and Differentiation Modules

REPORT-16B makes report smoke fixture-driven instead of relying on the
historical default fixture only.

- `--fixture default` uses the historical `default-smoke` fixture.
- `--fixture deokmin` uses `deokmin-external-manse`, whose expected pillars are
  `己卯 辛未 甲申 戊辰` and whose report facts use `기묘 신미 갑신 무진`.

Draft and generation-save smoke scripts print `report fixture: ...` before
calling OpenAI or Supabase. If OpenAI configuration is missing, the smoke can
skip safely while still showing which fixture would have been used.

`reportQualityFixtureMatrix` is a knowledge-layer QA matrix. It contains varied
Saju pillars, day masters, feature labels, quality focus tags, and MBTI types so
report quality can be checked beyond a single ENTJ-centered example. These
fixtures are not final user profiles and must not cause missing features to be
invented.

`reportDifferentiationModules` adds deterministic evidence modules:

- `내 사주의 무기`
- `반복되는 함정`
- `찔리는 일상 장면`
- `바꾸는 스위치`
- `관계에서 봐야 할 조건`

Modules are built only from selected Saju feature evidence, spotlight items,
signature scenes, and the current MBTI. They are capped at five modules with at
most three items each. They are added to the evidence packet for the writer, but
they are not part of the OpenAI response schema. The deterministic final V2 draft
can persist these modules and the result page renders them under `읽기 전에 잡고
갈 핵심 포인트` between spotlight and narrative chapters.

The prompt treats differentiation modules as reading aids. It should not copy
module titles mechanically; it should fold the concrete scenes and switch
actions into chapter prose. MBTI is still a behavior lens, not a recommended
type list.

REPORT-16C adds a sample quality-matrix smoke path:

- `pnpm dlx tsx scripts/smoke_generate_comprehensive_report_draft.ts --fixture-matrix sample`
- The sample includes `deokmin-external-manse`, an INFP reflection fixture, an
  ESTP resource/action fixture, and an ISTJ stability fixture.
- If OpenAI configuration is missing, the matrix smoke prints `SKIPPED` per
  fixture instead of failing on secrets.

REPORT-16C also moves direct-hit scenes away from a corporate-only meeting
default. Signature scenes and prompts should mix conversation, KakaoTalk or DM,
class, team project, family, friends, part-time or office work, money/account,
study, and bedtime recovery scenes. `회의` remains allowed, but overuse is a
quality warning and extreme overuse is a validation failure.

## REPORT-16D Comprehensive Report V1 Quality Freeze

REPORT-16D freezes the comprehensive Saju x MBTI report as a v1.0 product
surface. Internal schema and product metadata keep their version fields, but
the generated report page should not expose `v1.0` in the report body heading.
Version labels are product-selection metadata, not report-content copy.

Each report product owns its own version. Minor copy improvements, safety
wording, and rendering polish are not separate paid upgrades. A separate product
or upgrade should be considered only when the analysis scope clearly expands,
for example compatibility, career/money specialization, or yearly/decade luck
engines.

The branch symbol layer is deterministic. `sajuBranchSymbolKnowledge` covers all
12 earthly branches with animal, element, yin-yang, season, color token,
symbolic image, keywords, and scene seeds. Animal symbols are allowed, but they
must not become shallow zodiac claims. The correct interpretation path is:

1. earthly branch animal
2. five element
3. season
4. pillar position
5. ten-god relation
6. sinsal or gwiin placement when computed

For example, `亥` can be explained as pig, water, and winter storage. It should
not be reduced to a simple pig-zodiac fortune claim. `申` can be explained as
monkey, metal, early autumn, quick judgment, and survival structure when it is
actually present in the chart.

`sajuSymbolicNickname` builds a deterministic one-line nickname from day pillar,
branch symbols, and element balance. The nickname is attached to the evidence
packet and final V2 draft, but it is not part of the OpenAI response schema. The
writer may use it in opening or Saju identity prose, and the result page renders
it as a compact block under the four-pillar table.

Five-element color badges are deterministic UI labels:

- `목 · 초록`
- `화 · 빨강`
- `토 · 갈색`
- `금 · 금색`
- `수 · 파랑`

The result page renders these as text badges and element background class tokens
first. A later visual design pass may map the same tokens to CSS colors.

Generated and deterministic user-visible copy must not use generic labels such
as `사용자님`, `고객님`, or `유저님`. If no display name is available, use neutral
wording such as `이 사주에서`, `이 리포트에서`, or `당신은`.

The quality matrix smoke now prints compact per-fixture summaries: fixture id,
MBTI, pillars, computed feature count, spotlight groups, differentiation module
count, draft status, and validator warning count. If OpenAI configuration is
missing, it still skips safely without reading secrets.

## REPORT-16E Production Diagnostic Policy and V1 Final Gate

REPORT-16E freezes the display policy for the comprehensive Saju x MBTI v1.0
surface. Computation and display are intentionally separate.

Production features are the items the product can show as confirmed in the
default report body, basic table, spotlight, and deterministic modules.
Diagnostic features are school-variant or platform-variant items. They may be
computed, audited, and compared in safe debug output, but they are not shown as
confirmed final features unless a later production rule set adopts that basis.

Feature visibility levels are represented by `SajuFeatureVisibilityLevel`:

- `core`: day master, day pillar, month branch, element excess/missing, key ten
  gods, and key structures.
- `visible`: user-facing high-signal items such as 천을귀인, 역마살, 도화/홍염,
  화개, 공망, and 장성살.
- `supplementary`: good-fortune or symbolic features such as 금여록, 암록,
  재고귀인, 양인살, 현침살, 원진살, 귀문관살, 천살, and 육해살. These can appear
  in spotlight or narrative when selected, but they should not overtake core
  structure.
- `diagnostic`: 반안살, 백호살/백호대살, and alternate-basis feature checks.
  These stay out of the basic table and spotlight by default.
- `hidden`: direct scare-copy features that could be misunderstood as disease,
  death, bankruptcy, or divorce claims.

The feature display policy is presentation control only. It must not add
features that were not computed or selected.

The manse table visual policy is:

- render a single four-pillar manse table at the top, followed only by compact
  summary chips;
- render stems and branches with Korean and Hanja together, for example
  `무(戊)` and `진(辰)`;
- render the five-element token as both text and chip class, for example
  `element-chip--earth` and `element-bg--earth`;
- keep branch animal knowledge available for symbolic nicknames and narrative
  metaphor, but do not show animal labels as plain manse-table cell text;
- never rely on color alone.

MBTI usage is frozen for the comprehensive report:

- MBTI is not an official diagnosis.
- MBTI is self-reported behavioral language.
- MBTI is a secondary translation layer that makes Saju structure easier to
  understand.
- Luck-cycle or date-selection products should not use MBTI by default.
- Compatibility, career, and comprehensive products may use MBTI only for
  behavior scenes and communication style.
- Unsupported MBTI type recommendation lists remain blocked until a dedicated
  scorer provides them.

`ComprehensiveV1QualityGate` is a deterministic final-gate helper for product
readiness checks. It verifies product version, four-pillar grid, Hanja
stem/branch rendering, element chips, symbolic nickname, spotlight,
differentiation modules, universal scenes, MBTI caution, final actions, generic
label cleanup, internal-artifact blocking, and unsupported MBTI recommendation
blocking.

Future product engines should be separate:

- MBTI Knowledge Engine
- Compatibility Engine
- Career/Money/Study Engine
- Luck Cycle Engine

## REPORT-17 MBTI Knowledge Engine

REPORT-17 adds a dedicated MBTI Knowledge Engine for the next product layer.
MBTI is still not an official diagnosis. It is self-reported behavior language
used to translate Saju structure into scenes users can recognize.

The engine has four parts:

- `mbtiTypeKnowledgeBase`: 16-type data with context-specific trait seeds,
  scenes, strengths, risks, switches, relationship needs, and friction
  conditions.
- `mbtiKnowledgeSelector`: product-aware selection. The comprehensive report
  selects behavior scenes for identity, communication, work, study, money,
  love, family, stress, recovery, and growth. Yearly flow, major luck, and date
  selection return empty or minimal MBTI data by default.
- `sajuMbtiBridgeScorer`: bridges actual selected/computed Saju features to
  selected MBTI trait seeds. It only creates bridge evidence when the required
  Saju feature IDs are present.
- `mbtiCompatibilityCandidateEngine`: future compatibility candidate selector.
  It is data-driven and returns candidates only for compatibility or
  relationship-family products. The comprehensive report must not render MBTI
  candidate type recommendations.

Comprehensive report usage policy:

- Do not create a standalone MBTI section.
- Use `selectedMbtiKnowledge` and `sajuMbtiBridgeEvidence` inside each chapter
  as behavior scenes and practical switches.
- Avoid shallow E/I, T/F summaries.
- Explain overlap as "the pattern becomes clearer" and tension as "this is why
  an operating rule is needed."
- Do not recommend MBTI candidate types in the comprehensive report.

Compatibility product policy:

- Candidate MBTI types may be shown only when the compatibility engine selects
  them.
- A candidate is never a soulmate claim.
- The output should be trait condition -> candidate types -> reasons -> friction
  risks -> reminder that actual compatibility also depends on Saju and life
  habits.

## REPORT-18A Compatibility Foundation

REPORT-18A starts the `사주×MBTI 궁합 리포트 v1.0` foundation. This step only
builds deterministic input, fixture, bridge, scoring, and evidence packet logic.
It does not add the long-form compatibility writer, response schema, result
renderer, payment wiring, or sharing flow.

Product policy:

- Product: `saju_mbti_compatibility`, version `1.0`.
- Relationship types: `love`, `some`, `marriage`, and `friendship`.
- Launch price direction is 990 KRW, but REPORT-18A does not modify payment
  catalog or checkout code.
- Missing counterpart birth time is allowed. Hour-pillar based interpretation is
  lowered in confidence instead of invented.
- Missing counterpart MBTI is allowed. MBTI bridge output becomes limited and
  warning-based.
- Scores include total plus attraction, communication, lifestyle rhythm,
  conflict recovery, long-term stability, and growth complement.
- Scores are not fate judgments. They summarize where the two charts and
  self-reported MBTI styles align or require rules.
- MBTI candidate recommendations are not part of compatibility v1.0 foundation.
  Future relationship products may add data-driven candidate logic, but this
  packet does not expose recommended types.

Foundation files:

- `compatibilityTypes`: product input, score, evidence item, chart summary, and
  packet types.
- `compatibilityFixtureMatrix`: two-person fixtures including
  `deokmin-sodam-love`, an unknown-time fixture, and a friendship fixture.
- `compatibilitySajuBridge`: compares confirmed Saju features across two people
  and excludes diagnostic-only features as confirmed evidence.
- `compatibilityMbtiBridge`: compares the two input MBTI types using the MBTI
  knowledge engine without recommending other types.
- `compatibilityScoreEngine`: deterministic 35-95 clamped score model.
- `compatibilityEvidenceBuilder`: builds the compatibility evidence packet for
  fixture smoke and later REPORT-18B writer/render work.
- `scripts/smoke_build_compatibility_evidence.ts`: safe local evidence smoke
  with no OpenAI, Supabase, payment, or migration dependency.

Future REPORT-18B should add the compatibility report writer, schema, render
surface, and product UI on top of this packet.

## REPORT-18B Compatibility Writer And Render

REPORT-18B adds the first renderable draft path for `사주×MBTI 궁합 리포트 v1.0`.
It still does not add payment wiring, persistence changes, sharing links, or
database migrations.

Compatibility draft policy:

- Draft version: `compatibility_v1_draft`.
- Product type: `saju_mbti_compatibility`, product version `1.0`.
- The launch price planning value is 990 KRW, but this is documentation only in
  REPORT-18B.
- The draft includes an opening, total score, score breakdown, two-person chart
  comparison, key compatibility points, narrative chapters, final advice, and
  safety notes.
- Score caution must explain that the score is a summary of alignment and
  adjustment points, not a success/failure or destiny judgment.

Writer/render policy:

- `openaiCompatibilityReportWriterPrompt` receives only the compatibility
  evidence packet, allowed Saju terms, and the two input MBTI terms.
- The writer may repair missing direct-hit scenes, unsafe copy, missing final
  advice, candidate MBTI recommendations, and unsupported Saju terms, but it may
  not silently pass an invalid draft.
- Result rendering shows the product label, relationship type, two person
  labels, total score, itemized score cards, chart comparison, key points,
  chapters, final advice, and safety notes.
- Compatibility v1.0 does not recommend MBTI candidate types. It analyzes only
  the two input MBTIs when present.
- Unsafe fixed-outcome language such as `천생연분 확정`, `운명 확정`,
  `이별 확정`, `이혼 확정`, and `소울메이트 확정` is blocked.

Future REPORT-18C should refine the compatibility table UX, score copy,
chapter order, tone, and product persistence/share integration after reviewing
actual generated drafts.

## REPORT-18C Compatibility Product Polish

REPORT-18C keeps the REPORT-18B writer/render path but improves first-draft
product quality.

Compatibility copy policy:

- Each chapter must introduce a distinct angle instead of repeating the same
  advice.
- Repeated practical phrases such as 연락 빈도, 약속 변경, 생활비, 숫자로 합의,
  바로 결론, 하루 뒤 재검토, and 혼자 쉬는 시간 should appear at most once
  unless the later use adds a new situation and evidence.
- Direct-hit scenes should show who acts, what the other person feels, what
  Saju/MBTI structure explains it, and the everyday setting.
- Chapter titles should read like paid report section titles, not internal
  taxonomy labels.
- 65-74 scores are framed as `조율형 궁합`, meaning attraction and complement
  exist but speed, lifestyle, and recovery rules need active coordination.
- The final chapter can be a final message, but the bottom action list is
  headed `오늘부터 할 일` to avoid duplicate final-advice headings.
- Relationship type flavor differs: love focuses on dating rhythm and emotional
  temperature, some on ambiguity and timing, marriage on long-term lifestyle
  and responsibility, and friendship on distance, loyalty, help style, and
  boundaries.

The compatibility validator now emits non-fatal
`COMPATIBILITY_REPETITIVE_ADVICE_WARNING` warnings for excessive repeated advice
phrases. These warnings are printed by the draft smoke but do not block a valid
draft unless separate safety or evidence rules fail.

## REPORT-18D-B Diagnostic Term Guard

Compatibility reports keep diagnostic-only Saju terms out of user-facing copy.
`백호대살` is blocked as `UNSUPPORTED_COMPATIBILITY_TERM: 백호대살` and must not
appear in opening copy, key points, chapters, direct-hit scenes, practical
advice, final advice, safety notes, or preview rendering.

The compatibility writer applies a deterministic diagnostic-term sanitizer
before validation and again after repair. The sanitizer omits diagnostic-only
terms instead of replacing them with another unsupported Saju term. Repair
prompts also receive the concrete unsupported term list so the model can rewrite
affected sentences using only allowed evidence.

## REPORT-18E Compatibility UI/UX Polish

REPORT-18E keeps the existing compatibility writer, validator, fixture, and
snapshot-preview path, but upgrades the browser surface so the draft reads like
a paid `사주×MBTI 궁합 리포트 v1.0` product instead of a development output.

The dev preview snapshot workflow is:

- generate a local `.tmp/compatibility-preview/*-latest.json` snapshot from the
  compatibility smoke script;
- open `/dev/compatibility-preview?fixture=deokmin-sodam-love&snapshot=latest`;
- read the snapshot directly without calling the OpenAI writer;
- show missing-snapshot instructions that point back to the smoke command.

Dev-only status such as `preview snapshot` is shown only in a small preview
metadata strip. It is not rendered inside the paid-style report hero, score
area, or main report metadata.

The paid-style hero now puts product label, person pair, relationship type,
large score card, score label, and score caution in the first screen. A 65-74
score remains framed as `조율형 궁합`; `69점은 안 맞는 점수가 아니라` is a score
caution, not a failure message.

The score breakdown is rendered as compact cards for attraction,
communication, lifestyle rhythm, conflict recovery, long-term stability, and
growth complement. The two-person manse comparison keeps compact four-pillar
display while adding a per-person compatibility summary with `핵심 결` and
`주의 결`. Branch animal labels and diagnostic-only terms stay out of this
table.

Chapter rendering is card-based. Each chapter separates the title, headline,
body, `반복될 수 있는 장면`, and `실전 조언` so long generated prose does not become a
single wall of text. Key compatibility points are grouped into `왜 끌리는지`,
`잘 맞는 지점`, `부딪히는 지점`, and `관계 규칙`.

The final `오늘부터 할 일` section renders action items as numbered cards with
concrete categories such as 대화 규칙, 생활 기준, 도움 요청, and 갈등 회복. The
prompt requires final advice to be today-actionable and relationship-specific,
and the validator continues to emit
`COMPATIBILITY_REPETITIVE_ADVICE_WARNING` as a warning when advice concepts are
over-repeated across practical advice and final actions.

## REPORT-18F Compatibility Deep Saju Bridge

REPORT-18F expands the compatibility evidence layer so the product does not
repeat only 천을귀인, 재고귀인, 원진살, 오행 과부족, and MBTI speed mismatch.
Compatibility now compares three things: person A's natal chart, person B's
natal chart, and the new structures created between the two charts.

The deterministic deep bridge adds day-master relation, cross ten-god relation,
pair element climate, element complement, branch relation detection, spouse
palace relation, month rhythm, and hour/life rhythm notes. For example, the
deokmin-sodam fixture can surface 갑목 -> 정화 as a day-master generating
relation, 상관/정인 as the cross ten-god relation, 오행 상호 보완,
combined earth-heavy climate, 亥卯未 and 申子辰 branch trine structures, and
丑未 or 申亥 pressure signals.

Branch relation detection is cross-person by default. It can detect 육합,
삼합, 반합, 충, and 해 from the two people's branches without treating 합 as
unconditionally good or 충/해 as unconditionally bad. Diagnostic-only terms such
as 백호대살 remain excluded from user-facing compatibility evidence.

The evidence packet carries `deepSajuBridge` alongside the existing Saju and
MBTI bridge output. Score calculation can use positive notes such as element
complement and generating day-master relation, while also applying modest
pressure to conflict recovery or lifestyle rhythm when branch clash/harm or a
heavy combined climate is present. The clamp remains unchanged.

Writer guidance now assigns different layers by chapter: overview uses pair
element climate and score, attraction uses day-master/cross-ten-god/branch
trine, strengths use element complement and good-fortune evidence, frictions
use branch clash/harm plus 원진살, communication uses cross ten-god and MBTI,
relationship scenes use day branch/month rhythm, money/lifestyle uses combined
earth and 재고귀인, conflict recovery uses branch pressure and recovery style,
and long-term rules combine element complement, branch relation, and
relationship type.

The result UI renders a `두 사람 사이에 생기는 명리학 구조` card when
`deepSajuBridge` is available. The card shows a compact set of deep notes with
plain Korean explanations so the user sees the added compatibility structure
without reading raw diagnostic data.

## REPORT-18G Deep Interpretation Translation Layer

REPORT-18G keeps the REPORT-18F calculation scope but adds the interpretation
translation layer that turns calculation values into relationship language.
The product should not stop at labels such as 갑목 -> 정화, 상관/정인, 토 7,
申子辰, 亥卯未, 丑未, or 申亥. Each deep compatibility note now carries:

- `principleExplanation`: what the Saju calculation means.
- `relationshipTranslation`: how that calculation can appear between the two
  people.
- `positiveExpression`: how it works when used well.
- `riskExpression`: how it becomes tiring when unmanaged.
- `everydayScene`: where the user might recognize it in daily life.
- `actionRule`: what to do with it.
- `plainKoreanSummary`: a non-technical one-line summary.

The interpretation path is:

1. calculation
2. principle
3. relationship translation
4. everyday scene
5. action

For example, day-master relation should not be written only as
`갑목이 정화를 생합니다`. It should explain that wood generates fire, translate
that into one person's direction helping the other person's expression and
temperature come alive, then show the everyday scene and the rule for keeping
the give-and-response pattern balanced.

The `두 사람 사이에 생기는 명리학 구조` UI card now renders each selected deep
note as a 3-step explanation style card with headings such as `명리학적으로는`,
`두 사람에게는`, `좋게 쓰면`, `조심할 점`, `실제 장면`, and `관계 운영법`.
The card should prefer `plainKoreanSummary` for the visible heading and avoid
showing internal English relation labels to users.

The writer prompt requires every chapter to translate at least one Saju
calculation into everyday relationship language. Raw calculation-only output and
internal labels are not enough for the paid compatibility product.

## REPORT-18H Compatibility UI Copy Density Polish

REPORT-18H is a final product-surface polish pass for compatibility reports. It
does not expand calculation scope and does not change payment, legal, or
migration behavior.

The browser report label `찔리는 장면` is replaced with `반복될 수 있는 장면`
so the section can be read by two people together without sounding accusatory.
The generic `Chapter` label is removed from compatibility chapter cards.

Birth-time display is product-facing rather than form-facing:

- known birth time: `시주 반영`
- unknown birth time: `시주 미반영`

The two-person chart summary should show the day pillar with the `일주` suffix,
for example `갑신일주` or `정축일주`.

The `두 사람 사이에 생기는 명리학 구조` card keeps the deep interpretation
layer but reduces default density. At most four notes are expanded with full
principle/translation/scene/action sections. Extra notes move under
`더 살펴볼 구조` as compact summaries. Technical relation labels can appear only
under `계산값:` and internal English labels such as `mutual element complement`
or layer ids must not be user-visible.

Score breakdown cards include one-line interpretations so low sub-scores do not
feel like cold verdicts. Key compatibility point groups show at most three
bullets in the UI to reduce repetition before the chapters.

The validator emits
`COMPATIBILITY_FINAL_ADVICE_LABEL_MISMATCH_WARNING` when the default 도움 요청
slot contains conflict/recovery content such as 서운함, 갈등, or 어긋남 instead
of help-request content. The compatibility validator also sanitizes narrow
awkward Korean phrases such as `목·금가` -> `목과 금의 흐름이` and
`충가 있어` -> `충이 있어`.

## REPORT-18I Compatibility Category Expansion and Copy Cleanup

REPORT-18I fixes the compatibility v1 relationship category scope at exactly
six supported product categories:

1. `love`: 연애
2. `marriage`: 결혼/장기연애
3. `some`: 썸
4. `friendship`: 친구
5. `family`: 가족
6. `business_work_partner`: 동업/업무 파트너

The shared relationship helpers live in the compatibility type layer. They
provide the display label, relationship focus text, tone guidance, score
display labels, and score explanation copy for each supported category. The
internal score fields remain stable, but the visible labels now change by
relationship type, such as `끌림` for love, `부부 온도` for marriage,
`호감 신호` for some, `친밀감` for friendship, `정서 연결` for family, and
`협업 시너지` for business/work partner.

The writer prompt now names the six v1 categories explicitly and gives each
one a category-specific focus. Family, friendship, and business/work partner
reports must not use romance wording such as 연애, 데이트, 애인, or 설렘.
Love, some, and marriage reports must not collapse into work-partner-only
analysis.

Fixture coverage now includes one sample per relationship category:
`deokmin-sodam-love`, `deokmin-sodam-marriage`, `unknown-time-some`,
`friendship-mbti-known`, `family-unknown-mbti`, and
`business-work-partner-sample`. Smoke scripts print the relationship label and
relationship-specific score labels so fixture review can confirm category
copy without opening the browser.

Final advice copy has a prefix normalizer. If a generated item starts with a
known label prefix such as `갈등 회복:` or `도움 요청:`, the UI strips that
prefix from the body and uses it as the visible action label. The validator
keeps `COMPATIBILITY_FINAL_ADVICE_LABEL_MISMATCH_WARNING` as a warning-only
guard when a help-request label contains conflict/recovery content.

The awkward Korean sanitizer was extended across validator, writer sanitizer,
deep bridge output, and the render guard for narrow known phrases:
`목·금가`, `목·금이 약해`, `화·수가 약해`, and `충가 있어`.

## REPORT-18J Dynamic Interpretation and Category Language Fix

REPORT-18J fixes a product-quality issue where deep compatibility explanations
could reuse the Deokmin/Sodam `갑목 -> 정화` and `상관/정인` wording even when a
different fixture had different calculated relations. Day-master interpretation
now follows the actual five-element relation label, including cases such as
`무토 -> 경금` as 토가 금을 생하는 구조 and `계수 -> 무토` as 토가 수를 제어하는
구조. Cross ten-god interpretation now uses the actual pair, such as
`식신/편인`, `정관/정재`, or `상관/정인`, instead of a fixed explanation.

The compatibility type layer also provides relationship-type language
adaptation. Business/work-partner, family, and friendship outputs remove
romance/dating wording from visible generated copy while love, some, and
marriage preserve relationship-appropriate language. Score caution copy is now
relationship-specific so work and family reports do not reuse love-specific
`끌림` framing.

Visible safety notes are sanitized away from internal artifact terms such as
`diagnostic-only`, `진단용`, `evidence`, and `debug`. The final-advice prefix
normalizer also strips nested prefixes from the body across categories, so
labels remain separate from the action text.

## REPORT-18K Korean Grammar and Category Copy Stabilization

REPORT-18K does not add a new calculation layer. It stabilizes the Korean copy
that is produced from the existing compatibility calculations. The validator,
writer sanitizer, and report renderer now share a deterministic Korean copy
sanitizer for narrow particle and wording errors such as `정화을`, `무토은`,
`Partner A이`, `파트너십가`, `협업 시너지은`, `목·금가`, and `충가 있어`.

The relationship-type vocabulary adapter was expanded for non-romance
categories. Business/work-partner reports convert romance or soft relationship
phrases into work vocabulary such as 업무 미팅, 협업 신호, 확인 피드백, 수정
의견, 검토/응답 시간, 역할, 권한, and 책임. Family and friendship reports
similarly replace dating language with family/lifestyle or friendship language
while love/some/marriage keep romance-appropriate wording.

The deep Saju bridge no longer emits the `빈 오행` fallback. Weak element text
names the actual flow, for example `화의 흐름`, `화와 수의 흐름`, `목과 금의
흐름`, or `목·화·수의 흐름`. Day-master scene copy also follows the actual
five-element relation: wood-fire uses direction and expression, earth-metal
uses 기준, 틀, 판단, 실행, and water-earth uses 흐름, 현실 기준, 생활 규칙.

Final advice rendering now strips nested label prefixes and deduplicates labels
where possible. Money, role, decision, feedback, conflict, help, schedule, and
conversation keywords can relabel repeated advice cards so the visible action
list does not show duplicate labels unless no better label is available.

Safety notes remain plain user copy. Family missing-MBTI notes use everyday
Korean guidance, and business/work-partner safety notes avoid internal policy
terms while reminding users that the report does not determine partnership
success or failure.

## REPORT-18L Category Differentiation QA

REPORT-18L is the final copy-stability and category-differentiation QA layer for
compatibility v1.0. It does not add another Saju calculation layer. It tightens
the grammar sanitizer for remaining particle errors such as `표현의 온도이`,
`기준 정리이`, `관리 부담가`, `협업 시너지과`, `Family A은`, and
`Partner A은`, and applies the same recursive sanitizer through validator and
writer paths.

Final advice labels now use a relationship-type whitelist. Love and some avoid
business labels such as 피드백 규칙, 의사결정, 신뢰 관리, and 업무 기준. Family
uses family-safe labels such as 대화 규칙, 생활 기준, 도움 요청, 갈등 회복,
역할 분담, and 정서 회복. Business/work-partner uses 의사결정, 역할 분담,
돈과 자원, 피드백 규칙, 갈등 조정, 신뢰 관리, and 업무 기준. Duplicate labels
are reduced when body keywords allow a clearer category-specific label.

The vocabulary guard is category-specific. Business output removes romance
language and favors 협업, 역할, 기준, 책임, 의사결정, and 피드백. Family output
uses 가족, 생활, 정서, 말의 통로, 역할, and 경계 vocabulary. Friendship output
uses 거리감, 도움 방식, 대화 리듬, and 경계선. Love output can still use
romance vocabulary and should not be forced into work labels.

`scripts/smoke_generate_compatibility_category_matrix.ts` runs the six v1
fixtures as a matrix: `deokmin-sodam-love`, `deokmin-sodam-marriage`,
`unknown-time-some`, `friendship-mbti-known`, `family-unknown-mbti`, and
`business-work-partner-sample`. The matrix prints fixture, relationship type,
localized relationship label, total score, score labels, first chapter title,
warning count, snapshot path, and preview URL. It checks that category labels
and score labels differ across love/family/business, first chapter titles are
not all identical when generated, and category-forbidden vocabulary is absent.
If OpenAI writer settings are not present, generation is skipped safely and the
deterministic evidence matrix still prints without preview URLs.

## REPORT-18M Final Compatibility Copy Stabilization

REPORT-18M is the final copy and label stabilization pass before considering
compatibility v1.0 functionally locked. It keeps the existing engine,
relationship categories, and UI structure unchanged, and only tightens the
visible Korean copy layer.

The grammar sanitizer now covers the final particle list: `파트너십가`,
`관리 부담가`, `협업 시너지과`, `표현의 온도이`, `기준 정리이`,
`Partner A을`, `Partner B을`, `Family A을`, `Family B을`,
`Partner A은`, `Partner B은`, `Family A은`, `Family B은`,
`Partner A이`, `Partner B이`, `Family A이`, `Family B이`, `정화을`,
`무토은`, and `계수은`. The same sanitizer is applied recursively through
draft validation, writer sanitization, final advice rendering, safety notes,
and deep-structure fields that are rendered in the compatibility UI.

Final advice label enforcement is category-specific. Love and some can use
relationship labels such as 대화 규칙, 생활 리듬, 감정 표현, 갈등 회복,
돈과 생활, 관계 속도, and 실행 규칙, but not business-only labels such as
피드백 규칙, 의사결정, 신뢰 관리, 업무 기준, 협업 시너지, or 역할 분담.
Business/work-partner labels stay inside 의사결정, 역할 분담, 돈과 자원,
피드백 규칙, 갈등 조정, 신뢰 관리, and 업무 기준. Family labels stay inside
대화 규칙, 생활 기준, 도움 요청, 갈등 회복, 역할 분담, and 정서 회복.

Business deep-note vocabulary is finalized toward 협업 구조, 역할, 책임,
권한, 피드백, 기록, 업무 미팅, 짧은 재정비 시간, and 관리 부담 language.
Family deep-note vocabulary is finalized toward 가족, 생활, 정서, 말의 통로,
역할, 생활 기준과 정리감, and 가족 안의 분위기. Love remains allowed to use
romantic relationship vocabulary such as 끌림, 데이트, 감정, 관계, and 설렘,
and the label guards prevent love final advice from drifting into business-only
labels.

The category matrix smoke now prints quality counts for generated sanitized
outputs: bad Korean phrase count, forbidden category vocabulary count,
finalAdvice forbidden label count, duplicate finalAdvice label count, internal
artifact count, snapshot path, and preview URL. With OpenAI settings absent it
prints `SKIPPED OpenAI generation` and still verifies deterministic category
coverage without writing preview URLs.

## REPORT-18M-A Final Render and Snapshot Sanitization

REPORT-18M-A fixes the gap between passing sanitizer tests and the actual
browser snapshot. The compatibility renderer now uses a final visible-text
sanitizer for every rendered text path, so grammar fixes and relationship-type
vocabulary replacements happen at the last UI boundary as well as during draft
validation.

The preview snapshot writer now sanitizes the saved payload before writing
`.tmp/compatibility-preview/<fixture>-latest.json`. It sanitizes the draft and
the evidence packet's visible string values, including nested deepSajuBridge
fields, which is important because the preview UI can render deep bridge fields
from snapshot data even when the main draft was already validated.

Business/work-partner deep notes no longer generate the romance-style element
complement scene. Instead of text like `감정을 말로 바로 풀지 못할 때` or
`온도를 올려 대화를 열고`, business notes use issue, field feedback, 기준,
선택지, 역할, 책임, and 피드백 language. The category matrix smoke reads the
actual saved snapshot after write and counts bad Korean phrases, forbidden
category vocabulary, forbidden finalAdvice labels, duplicate labels, and
internal artifacts from saved string values.

## REPORT-18M-B Matrix Visible-Text QA and Business Copy Cleanup

REPORT-18M-B narrows category matrix quality checks to user-visible text. The
matrix no longer treats raw snapshot JSON keys such as `evidencePacket` as
visible copy. It builds the quality text from draft opening copy, score summary,
key compatibility points, chapter text, final advice, safety notes, and the
deep-structure note fields that the report view renders.

The visible internal-artifact guard still fails when terms such as
`diagnostic-only`, `진단용`, `evidence`, or `debug` appear in rendered draft
text or rendered deep-note text. The false positive from internal JSON key names
is removed without weakening the user-facing copy guard.

Business/work-partner copy cleanup now avoids broad global replacement of every
`관계`, `온도`, or `반응`. Instead, it cleans only known awkward business phrases
such as `협업의 협업 시너지을`, `현장 실행 피드백과 즉시성에 더 실행 피드백할 수 있습니다`,
`표현의 협업 분위기`, and `실행 피드백만 하는 구조`, while preserving natural
phrases such as 빠르게 반응할 수 있습니다.

## SEUN-01 Annual Fortune Evidence Engine

SEUN-01 starts the 세운 리포트 v1.0 product as an evidence engine only. It does
not add payment, public product pages, report UI, or OpenAI generation. 세운 is
명리 primary, not MBTI primary. MBTI can remain input metadata later, but the
annual flow evidence comes from the user's 원국 and the selected year's 간지.

Annual product policy:

1. All report products keep the 990원 price policy.
2. Past five years are selectable as 회고.
3. The current year is selectable as 올해 흐름.
4. The next year opens as 신년운세 only from December 1 of the current year.
5. Later future years are locked.

For example, on June 18, 2026, the selectable years are 2021-2025 as 회고 and
2026 as 올해 흐름. 2027 is locked until December 1, 2026, and 2028 or later
remains locked.

The annual fortune rules calculate the selected year's 천간, 지지, 간지, 오행,
and 음양 from deterministic cycles. Known anchors include 2021 辛丑, 2022 壬寅,
2023 癸卯, 2024 甲辰, 2025 乙巳, 2026 丙午, and 2027 丁未. The annual stem is
compared against the user's 일간 to produce the 세운 십성. For a 甲 day master,
丙 is 식신, 丁 is 상관, 甲 is 비견, 乙 is 겁재, 戊 is 편재, 己 is 정재, 庚 is
편관, 辛 is 정관, 壬 is 편인, and 癸 is 정인.

The annual evidence packet combines:

1. selected-year ganji and element effect
2. annual stem ten-god against the user's day master
3. annual branch interactions with natal year, month, day, and hour branches
4. missing-element fill signals
5. heavy-element overload signals, including indirect overload such as fire
   generating already-heavy earth
6. life-area, difficulty, and opportunity signals

This double-effect logic is important. A year can help and burden at the same
time. For Deokmin's 2026 丙午 evidence, fire fills missing fire and activates
식신 expression/output, but fire can also generate already-heavy earth, so work,
money, responsibility, and management pressure may rise together.

The branch interaction layer detects annual branch 육합, 삼합, 반합, 충, 해, 형,
and 파 against natal branches. Month branch interactions are treated as
work/social/life-rhythm signals, day branch interactions as close
relationship/body/private-rhythm signals, hour branch interactions as
habit/recovery/future-rhythm signals, and year branch interactions as outer or
background social signals.

`scripts/smoke_build_annual_fortune_evidence.ts` builds annual evidence from
fixtures and prints ganji, ten-god, element fill/overload, branch interactions,
life area signals, difficulty signals, opportunity signals, and warnings. The
smoke script does not import an OpenAI writer and has no API cost.

## SEUN-02 Annual Fortune Draft/Preview Layer

SEUN-02 adds the browser-review layer for 세운 리포트 v1.0 without adding payment,
public product pages, or persistence. The paid product policy stays: one 990원
purchase unlocks one selected annual-fortune year, including 1-12 monthly flow.

The draft schema is `AnnualFortuneReportDraft`. It represents one selected year
and includes:

1. opening title, summary, and core line
2. selected-year summary with ganji, element label, ten-god label, mode label,
   and year tone
3. total flow score and caution copy
4. flow cards for life areas
5. key signals tied to evidence labels
6. annual structure explanations for ganji, ten-god, element effect, and branch
   interactions
7. six to ten chapters with likely scenes and practical advice
8. exactly twelve monthly-flow items
9. final advice and safety notes

The validator checks structure, clamps scores to 0-100, sanitizes known awkward
Korean, weakens hard deterministic claims, removes internal/debug terms from
visible text, and enforces mode tone. `past_review` drafts must read like
회고, while `current_year` and `new_year_preview` drafts must emphasize 준비,
활용, 기회, and 조심.

The OpenAI writer prompt is annual-fortune specific. It tells the model to use
only the provided SEUN-01 evidence packet, not invent or change pillars, ganji,
ten-god, element effects, branch interactions, or mode. It requires concrete
생활 장면 and forbids guaranteed outcomes such as fixed 합격, 이직, 승진, 결혼,
or illness claims. The writer is gated by `OPENAI_REPORT_WRITER_ENABLED`,
`OPENAI_API_KEY`, and `OPENAI_REPORT_MODEL`, and uses the strict response format
name `annual_fortune_report_draft`.

The preview snapshot helper writes
`.tmp/annual-fortune-preview/<fixture>-latest.json` with the fixture id,
generation time, annual evidence packet, and sanitized draft. Snapshot writing
does not require OpenAI by itself.

The dev preview route is:

`/dev/annual-fortune-preview?fixture=deokmin-2026-current&snapshot=latest`

The page reads only local annual-fortune snapshots and renders
`AnnualFortuneReportView`. It does not import the OpenAI writer and must not call
OpenAI from the browser route. The view renders a paid-style report structure:
hero, score summary, year structure table, flow cards, key signals, annual
structure explanations, chapters, twelve monthly items, final advice, and safety
notes.

`scripts/smoke_generate_annual_fortune_report_draft.ts` is the cost-saving entry
point. With the writer disabled, it prints the annual evidence summary and skips
draft generation. With the writer enabled and `--write-preview`, it generates
one fixture draft and writes the preview snapshot for browser review.

## SEUN-03 Annual Fortune First Generated Draft QA

SEUN-03 is the first paid-generation QA step for 세운 리포트 v1.0. It intentionally
limits OpenAI generation to one fixture only: `deokmin-2026-current`. Do not run
an annual fixture matrix for this step. The goal is to inspect one real current
year draft, calibrate copy quality, and preserve API cost.

The interpretation policy remains:

1. 계산은 정직하게.
2. 해석은 구체적으로.
3. 문장은 용하게.
4. 결과는 단정하지 않는다.

For 2026 丙午 and a 甲 day master, the draft must preserve the evidence shape:
식신 activation, fire filling weak fire, and the double effect where fire can
also generate already-heavy earth. This means the report should not frame 2026
as simply good. It should explain that expression, output, production, content,
and visibility can rise while work, money, responsibility, performance, and
reality pressure may rise together.

The writer prompt now requires every chapter to include:

1. the relevant 명리 calculation value
2. at least two likely life-scene candidates
3. why the flow can feel that way
4. how to use the flow constructively

Required scene domains are 일·성과, 돈·현실, 인간관계, 연애·가족, 학업·자격증, and
몸·생활 리듬. Generic fortune-cookie phrases such as "책임이 커질 수 있습니다",
"관계가 흔들릴 수 있습니다", "기회가 올 수 있습니다", or "돈 문제가 생길 수
있습니다" are tracked as vague copy unless the sentence names a concrete area
or scene such as 직장, 가족, 돈, 시험, 자격증, 승진, 이직, 관계, 연락, 일정,
계약, 성과, 결과물, 생활비, 부모, 동료, 상사, or 프로젝트.

The validator and smoke script report quality counters:

1. vague copy warnings
2. hard claim warnings
3. internal artifact warnings
4. monthly flow count
5. chapter count

Current-year mode must read as a live-use report, not only as past 회고. It should
use ideas such as 올해, 지금부터, 준비, 활용, 조율, 손실을 줄이기, and 흐름을
쓰기. Hard deterministic claims remain blocked or softened: 반드시, 무조건,
합격합니다, 불합격합니다, 이직합니다, 퇴사합니다, 승진합니다, 돈을 법니다,
병이 생깁니다, 결혼합니다, 헤어집니다.

## SEUN-03A Annual Fortune Strict Schema Fix

SEUN-03A fixes OpenAI strict JSON schema compatibility for
`annual_fortune_report_draft`. OpenAI strict response formats require every key
listed in an object `properties` map to also appear in that object's `required`
array. The annual monthly flow item now treats `elementFocus` as a required
nullable field: `string | null` in TypeScript and `["string", "null"]` in JSON
schema.

The validator remains backward-compatible with older generated drafts and local
snapshots by normalizing missing or empty `monthlyFlow[].elementFocus` values to
`null` before returning the sanitized draft.

## SEUN-04 Annual Fortune Product Calibration

SEUN-04 calibrates the annual fortune report before product lock. The former
score copy is no longer framed as a good/bad grade. `scoreSummary` now uses
`flowIndex`, `flowTypeLabel`, and `flowIndexCaution`, and the UI renders it as
`올해 흐름 지표`, `회고 흐름 지표`, or `신년 흐름 지표` depending on report mode.

Flow cards keep their numeric indicator but display metric-specific labels:
`일·성과 활성도`, `돈·현실 체감도`, `인간관계 노출도`, `연애·가족 조율도`,
`학업·자격증 활용도`, and `몸·생활 리듬 주의도`. Key signal enum values remain
internal JSON values, but the view localizes them as `기회 신호`, `부담 신호`,
`양면 신호`, `연결 신호`, and `주의 신호`.

The validator and render path sanitize repeated explanatory terms such as
`식신(식신, 말·결과물·생산성)`, `甲 일간(갑 일간)`, and
`토 과다(흙이 무거움)` into cleaner Korean copy. Final advice remains a string
array for schema stability, but the view labels advice by domain rather than
repeating generic `실행 기준` labels.

Current-year prompt guidance now supports a mid-year structure: 상반기에는 이미
체감됐을 수 있는 신호를 짚고, 하반기에는 남은 흐름을 어떻게 활용하고 조율할지
쓴다. The prompt also requires concrete event candidates with nouns such as
직장, 프로젝트, 상사, 동료, 가족, 부모, 연인, 친구, 돈, 정산, 계약, 생활비,
시험, 자격증, 승진, 이직, 수면, 식사, 일정, and 연락.

Monthly flow now has an evidence foundation through `monthlyFortuneSeeds`.
SEUN-04 uses `calendar_month_approximation` as the explicit basis, so the UI
labels the section `월별 운영 가이드` and the prompt must not present it as exact
절기 월운. Exact solar-term monthly fortune can be added later under
`solar_term_exact`.

## SEUN-05 User Context Profile Layer

SEUN-05 fixes the annual fortune personalization layer to two fields only:
`lifeStatus` and `fieldLabel`. There is no interest-area field. Annual fortune
and major-luck reports remain whole-flow products, while love, career, money,
study, and relationship depth are reserved for separate 990 won products.

`UserContextProfile` is intentionally interpretive, not computational. It does
not change ganji, ten-god, element balance, branch interactions, monthly seeds,
or any other calculated evidence. It only translates the same computed annual
flow into concrete scene nouns that fit the user's current situation.

Annual evidence now carries `userContext` plus `contextTranslationHints`.
Examples:

1. `employee`: 상사, 동료, 프로젝트, 보고, 마감, 성과, 역할 분담, 회의
2. `student`: 과제, 발표, 시험, 전공, 교수, 팀플, 포트폴리오
3. `exam_certificate`: 시험, 모의고사, 오답노트, 실기, 자격증, 면접
4. `business_owner`: 고객, 매출, 계약, 직원, 외주, 재고, 운영 리스크

The writer prompt must still keep all six annual domains: 일·성과, 돈·현실,
인간관계, 연애·가족, 학업·자격증, 몸·생활 리듬. Context can choose better nouns
inside those sections, but it must not remove domains or ask the user to choose
a focus area.

The annual report draft can include `userContextSummary` for display. The view
uses a deduplicated hero context line and field note rather than repeating
status and field chips. Final advice labels are inferred from advice body
keywords first, and later locked to the six standard annual domains before
rendering.

## SEUN-06 Annual Fortune Final QA

SEUN-06 tightens the annual fortune report before v1 product lock. Final advice
labels are inferred from body keywords instead of fixed index order. The
inference prioritizes body rhythm, study/certificate, money/reality,
love/family, work/output, relationship, then general operating advice, while
using keyword counts to avoid labeling project/report/presentation advice as a
study item.

The annual terminology sanitizer now removes repeated explanatory parentheses
such as `식신(식신, ...)`, `파(파, ...)`, `육합(육합, ...)`, `생(생, 낳아줌)`, and
`甲 일간(갑 일간)`. The first visible explanation can define the term, but the same
term should not be repeated inside parentheses.

Monthly flow now exposes clearer evidence fields in the draft and UI:
`monthGanji`, `monthlyBasis`, `elementFocus`, and `natalInteractionSummary`.
The UI shows 월 간지, 오행 포인트, 기준, and 원국과의 작용 when available. Until exact
solar-term month calculation is implemented, `calendar_month_approximation`
must be described as 달력월 기준 운영 가이드 or 월별 운영 가이드, never exact 절기 월운.

Context balance rules are explicit. `UserContextProfile` can translate scenes
into more concrete nouns, but it must not flatten every domain into work-only
copy. 인간관계, 연애·가족, 학업·자격증, and 몸·생활 리듬 each retain their own noun
sets even when the user is an employee.

`UserContextProfile` is currently wired to annual fortune only. 종합 and 궁합 do
not consume this context yet; those integrations require future tasks. The
common type exists so 대운 and 종합 can reuse it later without changing the
annual calculation rules.

## SEUN-06A Annual Fortune Final Systemic Polish

SEUN-06A is a systemic polish pass, not a one-off text patch. The annual report
pipeline now reinforces the same copy rules across evidence, prompt,
validator, snapshot sanitization, report view, and smoke QA counters.

Final advice domain inference is weighted and meaning-based. It does not rely
on item index: project/report/documentation/presentation copy resolves to
일·성과, certificate/error-note/study copy resolves to 학업·자격증, sleep/meal/fatigue
copy resolves to 몸·생활 리듬, family/parent/partner copy resolves to 연애·가족, and
settlement/contract/living-cost copy resolves to 돈·현실.

The visible term sanitizer removes repeated parenthetical 명리 expressions such
as `식신(식신, ...)`, `卯午 파(卯午 파, ...)`, `午未 육합(午未 육합, ...)`,
`寅申 충(寅申 충, ...)`, `申寅 형(申寅 형, ...)`, `생(생, 낳아줌)`, and
`甲일간`. Snapshot writes use the same sanitizer boundary.

Monthly basis values are converted for display. `calendar_month_approximation`
is shown to users as `달력월 기준 운영 가이드`, and the view explicitly explains that
the current monthly section is not exact solar-term 월운 yet.

The hero context line is now written as a readable summary such as
`덕민님 · 甲(갑목) 일간 · 직장인`, followed by the field-based interpretation note
when a field label is available.

Key signal balance is prompt-guided and smoke-checked. If difficulty and
opportunity evidence exist, the generated draft should include 부담 and 기회
signals, and mixed fill/overload evidence should produce a 양면 signal. The
validator reports warning counters instead of inventing missing signals.

Context domain balance remains warning-only. Employee context can sharpen scene
nouns, but it must not turn 연애·가족, 학업·자격증, or 몸·생활 리듬 into work-only copy.

## SEUN-06B Annual Fortune Final Lock Polish

SEUN-06B is the final product-lock polish pass for annual fortune v1. The report
view renders hero context as a deduplicated line such as
`덕민님 · 甲(갑목) 일간 · 직장인`, followed by `개발·서비스 기획 기준으로 해석` when a
field label is available. It must not repeat `직장인` or the field label in
multiple hero chips.

Paid report copy must not expose future-development wording such as `추후
고도화`, `추후 개발`, or `개발 예정`. The monthly guide uses the product-facing
copy: `월별 흐름은 달력월 기준 운영 가이드입니다. 실제 체감 시점은 절기와 개인 일정에
따라 조금 달라질 수 있습니다.`

Final advice is rendered through domain-locked action cards. The view always
shows exactly one item for each standard domain: 일·성과, 돈·현실, 인간관계,
연애·가족, 학업·자격증, 몸·생활 리듬. Generated finalAdvice text is reused only
when it clearly matches the target domain; otherwise the validator/view layer
derives safer domain-specific copy from chapters, flow cards, or deterministic
rescue advice.

The annual visible-text sanitizer also catches grammar residue such as
`별으로` and `甲일간`, and rewrites awkward 식신 phrasing into natural Korean like
`식신으로 들어와 결과물과 표현을 밖으로 꺼내는 힘을 키웁니다.`

The annual smoke script reports final lock counters: hero duplication warnings,
future development wording warnings, final advice domain lock warnings, and
grammar residue warnings.

## SEUN-06C Annual Fortune Final Visible Sanitizer

SEUN-06C adds the final visible-render guard before annual fortune v1 lock. The
hero line is deduplicated at render time, so a generated title that repeats
`덕민님 · 甲(갑목) 일간 · 직장인` is not rendered again above the same context line.

The annual visible-text sanitizer blocks abnormal foreign-script artifacts in
user-facing copy, including Arabic/Persian script ranges. Known bad fragments
such as `فاص` are converted to natural Korean (`거리감`), and remaining characters
from those ranges are stripped at the sanitizer boundary.

Monthly basis wording is split between one section note and short per-card
labels. The section says the monthly flow is a calendar-month operating guide
and actual timing may vary by solar terms and personal schedules. Individual
monthly cards show only short labels such as `달력월 기준`, preventing the same
long disclaimer from repeating twelve times.

The grammar sanitizer catches final residue such as `보여지는 결과`, `구조과`,
`별으로`, `甲일간`, and awkward 식신 phrases like `식신: 결과를 밖으로 꺼내는 힘으로
들어옵니다`. Branch-relation terms with long parentheses are normalized to colon
style: `卯午 파(...)` becomes `卯午 파: ...`, and the same rule covers 육합, 충, 형,
해, 삼합, and 반합 descriptions.

Smoke QA now includes abnormal script warnings, monthly basis repetition
warnings, grammar residue warnings, and parenthetical term warnings. These are
visible-text checks, not raw JSON key scans.

## SEUN-06D Annual Fortune Final Tiny UI Cleanup

SEUN-06D removes the last duplicated standalone person label from the annual
fortune hero. The visible order is now the product label, one hero context line
such as `덕민님 · 甲(갑목) 일간 · 직장인`, one field interpretation line such as
`개발·서비스 기획 기준으로 해석`, then the selected year display title and mode.

This is still a report-body and preview lock step, not the annual product input
flow. The engine already has year access policy for the recent five years,
current year, next-year opening from December 1, and locked future years. The
user-facing year selection UI, selectable year cards, pre-December locked
new-year card, and paid annual generation flow are not implemented yet and
belong to a later product input flow task.

## DAEUN-01 Major Fortune Evidence Engine

DAEUN-01 starts the 대운 리포트 v1.0 foundation. 세운 is a selected one-year flow;
대운 is a roughly ten-year background that frames career, money, relationships,
family, study, health rhythm, and identity direction over a longer cycle.

This task only builds the evidence layer. It does not add an OpenAI writer,
draft schema, preview page, product UI, year/cycle selection screen, payment,
or public product page. The smoke script is evidence-only and must not import
an OpenAI writer.

The Deokmin development fixture now uses an explicitly supplied major fortune
table. Because an exact 대운 start-age/direction algorithm is not implemented
yet, the fixture must declare its source basis instead of pretending the app has
calculated the start point itself. For DAEUN-03B, the supplied table places the
active cycle at `戊辰` from 2026 through 2035, and 2026 is read as the first year
of that cycle.

The major fortune evidence engine selects previous, current, and next cycles by
year range, parses the current cycle ganji, maps heavenly stem and earthly
branch elements/yin-yang, and calculates the ten-god relationship from the
user's day master to the major cycle stem. It reuses annual fortune stem/branch
and ten-god rules where possible.

Element effect logic checks whether the major cycle strengthens elements that
fill natal missing elements, overload already-heavy elements, or indirectly
overload heavy elements through generation. For example, fire can fill fire
shortage while indirectly intensifying heavy earth because fire generates earth.

Branch interaction logic reuses the annual branch detector for 충, 육합, 삼합,
반합, 해, 형, and 파, with affected natal pillar positions preserved. The same
relationship is interpreted as a ten-year background rather than a one-year
event.

The packet also produces life-area signals, difficulty signals, opportunity
signals, transition signals from previous/current/next cycles, and strong years
within the current cycle. Strong years are found when annual ganji repeats or
strengthens the major cycle element, repeats the major ten-god, shares the
major branch, or strongly interacts with major/natal branches.

UserContextProfile is reused only to translate long-cycle scenes into concrete
nouns such as 프로젝트, 보고, 계약, 정산, 동료, 상사, 자격증, and 생활 리듬. It does
not change the major fortune calculations.

## DAEUN-02 Major Fortune Draft/Preview Layer

DAEUN-02 adds the report-generation and preview layer for 대운 리포트 v1.0. It
does not add public input UI, cycle selection UI, payment, DB persistence, or
production route wiring.

The major fortune draft schema is `major_fortune_report_draft`. It contains
hero copy, user context summary, current cycle structure, flow index, exactly
six decade cards, key signals, major structure explanations, 6 to 10 cycle
chapters, a three-part phase timeline, strong years within the cycle, exactly
six domain-locked final advice items, and safety notes. The strict OpenAI JSON
schema keeps every nested property required so the response format is
strict-compatible.

The validator clamps visible indexes to 0-100, normalizes repeated 명리 terms,
removes hard deterministic claims, strips internal artifacts, enforces the
early/middle/late phase timeline, keeps strong years to 3-5 items, and requires
final advice to cover the six standard domains: 일·성과, 돈·현실, 인간관계,
연애·가족, 학업·자격증, 몸·생활 리듬.

The writer prompt treats 대운 as a 10-year background, not a single-year event.
It tells the model to use only the evidence packet, never invent cycles, never
change ganji/ten-god/elements/branch interactions, translate scenes through
userContext only, explain early/middle/late phases, and explain strong years
within the cycle.

The OpenAI writer is gated by `OPENAI_REPORT_WRITER_ENABLED`,
`OPENAI_API_KEY`, and `OPENAI_REPORT_MODEL`. It uses the strict response format
name `major_fortune_report_draft`, validates the returned draft, and redacts
diagnostics. Free smoke and preview page execution do not call OpenAI.

Preview snapshots are written to
`.tmp/major-fortune-preview/<fixture>-latest.json` and contain the fixture id,
generation time, evidence packet, and sanitized draft. The dev preview route is
`/dev/major-fortune-preview?fixture=deokmin-current-major-fortune&snapshot=latest`.
The page reads only local snapshots, is gated by
`MAJOR_FORTUNE_DEV_PREVIEW_ENABLED`, and does not import the OpenAI writer.

The report view renders the current major cycle structure table, descriptive
cycle type, decade themes, 10-year timeline, strong-year highlights, domain
strategy, phase timeline, final advice, and safety notes. Raw internal basis
values are not user-facing; a supplied table is shown as `입력된 대운표 기준`.

## DAEUN-03 Major Fortune First Generated Draft QA

DAEUN-03 prepares the first paid-generation QA pass for the major fortune
writer. API cost is intentionally limited to one manually triggered fixture:
`deokmin-current-major-fortune`. Codex-side verification remains free and does
not call OpenAI.

The prompt and validator now distinguish 대운 from 세운 more strongly. A major
fortune report must not read like a one-year annual fortune, must not focus on
`올해` or monthly flow, and must emphasize `이 대운`, `이 10년`, `이 구간`,
초반/중반/후반, previous/current/next cycle transition, and repeated long-term
themes.

Each main chapter is expected to connect the 대운 calculation value to a
10-year repeated scene, explain why the scene can keep repeating, name the
domain where it is likely to be felt, and give a way to use the decade less
exhaustingly.

The phase timeline is locked to three parts: early, middle, and late. The
writer prompt frames them as 초반 1~3년 for new roles or environments, 중반
4~7년 for repeated and hardened roles, and 후반 8~10년 for cleanup,
transition, and next-cycle preparation.

Strong years must not look random. Each strong year should explain why it is
strong by referencing repeated or strengthened major-cycle elements, repeated
ten-god themes, annual branch interactions with major/natal branches, missing
element fill, or heavy element overload.

The smoke draft script reports annual-tone warnings, decade-tone warnings,
strong year reason warnings, hard claim warnings, internal artifact warnings,
and repeated terminology warnings before writing a preview snapshot.

## DAEUN-03A Major Fortune Big-Picture Redesign

DAEUN-03A redirects the 대운 report away from small-event annual-style reading
and toward a 10-year big-picture product. The report should answer what this
decade is as an 인생 배경, how roles and direction change, what themes repeat,
and which years are highlights inside the larger structure.

The evidence packet now carries a user-facing calculation basis object. Current
cycle selection uses the provided major fortune table, and the current year is
used only to locate the user's position inside that cycle. This task does not
implement a new exact 절기-based 대운 start-age algorithm, so the view explains
the source as `입력된 대운표 기준` or `만세력 대운표 기준` when those sources are
available and avoids raw internal wording.

`currentCycle.index` is treated only as 대운 순번. It must not appear as a flow
score. The visible report shows 대운 순번, current position in the cycle, a
descriptive 대운 유형, 체감 강도, and 핵심 방향 instead of a score-like numeric
card.

The report schema adds `bigThemes` and `cycleYearTimeline`. `bigThemes` holds
3 to 5 deeper decade themes with metaphor, scenes, and strategy. The full
10-year timeline is required for every year from the current cycle start year
through end year. Strong years remain a separate `TOP 5` highlight section and
must not replace the full timeline.

The prompt now requires plain Korean or metaphor translation for 명리 terms
before interpretation. Examples include 비견 as "내 기준을 세우는 힘", 토 과다
as responsibility piling up like earth, 충 as a direction collision, 형 as
inner pressure, and 육합 as people, schedules, or roles becoming tied together.

The smoke draft script reports cycle year timeline count, missing cycle year
warnings, cycle index leak warnings, technical term warnings, and small event
overfocus warnings so the report can be checked as a large 10-year structure
before any paid OpenAI retry.

## DAEUN-03B Major Fortune Strategic Redesign

DAEUN-03B fixes the source-of-truth boundary before copy polish. If the active
major fortune cycle is wrong, every generated interpretation is invalid. The
selected/current year only locates the active cycle; the report must then cover
that active cycle's full 10 years.

The Deokmin fixture is treated as a user-supplied major fortune table until an
exact 대운 start algorithm is implemented. With `currentYear = 2026`, the active
cycle is `戊辰` from 2026 through 2035, not an older `甲戌` cycle. The visible
basis is `입력된 대운표 기준`, while raw words such as fixture, precomputed,
debug, or evidence stay out of product copy.

`UserContextProfile` still has no interest-area field. DAEUN-03B adds optional
`relationshipStatus` so love/family/relationship scenes can be translated more
realistically without changing calculations. Unknown relationship status must
not be written as if the user is single, dating, or married.

The evidence packet now exposes strategic big-flow fields: cycle basis, cycle
position, previous-to-current shift, decade archetype, strategic themes, long
range risks and opportunities, relationship-status translation hints, a full
10-year strategic timeline, and strong-year highlights.

The 10-year timeline is not a mini annual report. Each year needs a role inside
the active cycle, a plain interpretation, a strategic focus, and a reason why it
matters. Generic wording such as `대운 지지 또는 원국 지지와 강한 작용` is treated as
a QA warning.

Strong years are shown as `TOP 5` highlights only. They must explain why the
year is strong, what area it may hit, and what action to take. The strong-year
section title appears once and must not be repeated as each card headline.

The major fortune report structure is now strategic and big-picture first:
current cycle basis and position, the 10-year conclusion, core themes,
previous-to-current shift, the 10-year flow map, strong-year highlights, domain
strategy, phase timeline, and final advice. Domain cards are secondary; they
must not make the product read like a repeated annual summary.

The smoke and validator report additional QA counters for wrong cycle basis,
generic timeline wording, repeated summaries, weak strategy copy, relationship
status misuse, and repeated strong-year section titles. OpenAI remains manual
and one-fixture-only for paid QA.

## DAEUN-03C Timeline UI and Expanded Myeongli Evidence

DAEUN-03C turns the 대운 report into a compact 10-year strategy map. The active
cycle remains source-of-truth driven: for the Deokmin development fixture,
`currentYear = 2026` resolves to the user-supplied `戊辰` cycle from 2026 through
2035. The report compares the active 대운 and each year's 세운 side by side
instead of reading like a small annual report.

The evidence packet now includes expanded 명리 layers beyond five elements:
ten-god flow across all 10 years, branch interactions, hidden stems in the
major branch, and auxiliary star references that are safe for user-facing copy.
Diagnostic-only terms such as 백호대살 remain excluded from visible output.

`majorFortuneTimelineRows` is the UI-ready timeline source. Each row includes
the year, age label, current/start/end flags, badges such as 올해 and 전환, 대운
ganji, 세운 ganji, annual ten-god label, key interaction label, one-line
interpretation, and a short strategy. The current year is highlighted in the
view, and the timeline is rendered as a compact table/list similar to a 10-year
map.

Strong years are still separate TOP highlights, not the whole timeline. Each
highlight carries `whyStrong`, `likelyArea`, `pushStrategy`, and
`reduceStrategy`, so the view can show "밀어볼 것" and "줄일 것" rather than
generic advice.

Relationship status is used as a translation layer only. If status is unknown,
the prompt and validator prevent copy that writes as if the user is definitely
single, dating, or married. Known statuses can guide the relationship/love/family
scene nouns without changing any calculation.

The prompt now allows stronger non-deterministic strategy language such as
"가능성이 올라갑니다", "유리해집니다", "불리해집니다", and "밀려날 수 있습니다",
while still forbidding deterministic outcomes. It also requires every major
section to add a new strategic angle instead of repeating 책임, 정리, 관리, 구조,
문서화, 일정, and 고정지출 in every paragraph.

Smoke QA now includes the compact 대운/세운 timeline, expanded 명리 layer output,
strong-year push/reduce strategies, and repeated-theme warnings.

## DAEUN-03D Timeline Quality and Relationship Status Cleanup

DAEUN-03D simplifies relationship status for product UX. `UserRelationshipStatus`
now supports only `single`, `dating`, `married`, and `unknown`, displayed as
솔로, 연애 중, 기혼, and 미입력. The interest-area field remains removed.

The compact 대운 timeline must not use repeated generic language. Rows must vary
by annual stem ten-god, branch interactions, repeated major-cycle stem/branch,
missing-element fill, heavy-element overload, and early/middle/late phase. For
the Deokmin `戊辰` 2026~2035 fixture, 2028 `戊申` is treated as a 편재-strengthened
money/external-opportunity year, while 2030 `庚戌` highlights `辰戌 충` and
structure reallocation.

Age is secondary in the timeline. The primary row identifier is now
`year + yearIndexInCycle`, such as `2026년 · 1년차`; age appears only with a
basis label such as `대운표 기준 나이`.

Strong-year `likelyArea` now uses ten-god priority before branch-interaction
fallbacks. 편재 years map to `돈·외부기회`, while 정재 years map to
`돈·현실관리`; 식상 years to `일·성과`; 관성 years to `일·성과` or `전환`;
인성 years to `학업·자격증`; and 비겁 years to relationship/self-standard
themes.

The 명리 근거 section must render compact actual content: 십성, 오행, 지지 작용,
지장간, and safe 신살·귀인 references. 백호대살 and other diagnostic-only terms
remain excluded from visible output.

The prompt allows sharper but still non-deterministic strategy language such as
가능성이 올라갑니다, 불리해질 수 있습니다, 접점이 늘어날 수 있습니다, and 외부
프로젝트 가능성이 커질 수 있습니다. Hard outcome claims remain forbidden.

Validator and smoke QA now include repeated strategy warnings in addition to
generic timeline and repeated-theme warnings. A timeline strategy repeated more
than three times is treated as a product-quality warning.

## DAEUN-04 Major Fortune Generalization Fixture Matrix

DAEUN-04 adds a major fortune fixture matrix so the 대운 engine is not tuned only
to the Deokmin fixture. The matrix keeps `deokmin-current-major-fortune` and adds
fictional samples that cover wealth, officer, expression, resource, and peer
major-fortune themes.

The matrix is designed to vary the source inputs that should change the report:
major ten-god, major-cycle elements, natal 과다/부족 labels, branch interactions,
life status, field label, and relationship status. Relationship coverage includes
`single`, `dating`, `married`, and `unknown`; `interestArea` remains absent.

The fixture set includes at least five different major ten-god outcomes:
편재/정재 for money, resources, contracts, and outside projects; 관성 for rules,
evaluation, and responsibility verification; 식상 for output, expression,
portfolio, and public results; 인성 for study, recovery, documents, and knowledge
accumulation; and 비겁 for competition, self-standard, peers, independence, and
collaboration conflict.

Matrix smoke commands run without OpenAI. `smoke_build_major_fortune_evidence.ts
--all` prints one compact evidence summary per fixture and matrix QA counters.
`smoke_generate_major_fortune_report_draft.ts --all` prints draft-readiness
checks while the writer is disabled and does not import or call the OpenAI writer
path.

Matrix QA checks include timeline similarity, fixture leakage, relationship hint
coverage, likely-area diversity, and diagnostic/internal term leakage. Fixture
labels may contain diagnostic-only terms such as 백호대살 for guard testing, but
those terms must not appear in user-facing evidence text.

## DAEUN-04A Safety Notes Validation Repair

The first paid major-fortune generation reached OpenAI and produced report
content, but final draft validation failed at `safetyNotes` with
`MAJOR_FORTUNE_SAFETY_NOTES_INVALID`. This was a validator robustness issue, not
an evidence-generation issue.

Safety notes are now repairable. If `safetyNotes` is missing, not an array, empty,
too short, too long, or contains empty items, hard deterministic claims, or
internal/debug words, the major fortune validator normalizes it instead of
failing the whole draft. The repaired notes are constrained to 2-4 user-facing
Korean strings.

The default fallback notes explain that the report reads a 10-year 대운 background
and repeated patterns, does not guarantee specific events, interprets
relationship/money/work from provided inputs and 명리 evidence, and treats health
copy only as lifestyle rhythm guidance rather than medical diagnosis.

The OpenAI writer prompt now explicitly asks for 2-4 short Korean `safetyNotes`
and forbids internal terms such as evidence, debug, fixture, precomputed, and
schema in those notes. Smoke output reports safety note count, safety note
warnings, and whether repair occurred. DAEUN-04A itself does not call OpenAI.

## DAEUN-04B Major Fortune View Density and Evidence Rendering

DAEUN-04B addresses product polish after the first generated 대운 preview. The
명리 근거 section must render actual content rather than an empty collapsed
summary. The visible basis includes 십성, 오행, 지지 작용, 지장간, and safe
신살·귀인 references. Diagnostic-only or internal terms such as 백호대살,
diagnostic-only, evidence, debug, and fixture are filtered from the user-facing
view.

대운 timeline rows are compact. The view shows `year + yearIndexInCycle`, badges,
`대운 戊辰 · 세운 丙午` style labels with spacing, one short row interpretation,
and one short strategy. Detailed technical explanations move to the 명리 근거
section. The age basis is displayed once above the table, not repeated in every
row.

`bigThemes` must be distinct strategic angles. For a 戊辰 편재 대운, preferred
themes are 돈과 자원 운용, 역할과 책임의 설계, and 생활 리듬과 관계 경계. The
validator warns when themes repeat the same money/resource angle without adding a
new strategic purpose.

Strong-year TOP 5 strategies must vary by the year. The validator and smoke
output now track duplicate push and reduce strategies separately, so 2028 戊申 can
focus on external projects/contracts while 2029 己酉 focuses on fixed costs,
settlement, and cash-flow management.

Smoke QA now prints empty myeongli basis warnings, duplicate big theme warnings,
duplicate strong-year push/reduce warnings, timeline spacing warnings, age basis
repetition warnings, and generic timeline warnings. DAEUN-04B does not call
OpenAI.

## DAEUN-04C Immersive Strategy Copy and Context Filters

DAEUN-04C moves the 대운 report from safe-but-thin copy toward an immersive
10-year strategy reading. The interpretation remains non-deterministic, but the
prompt now permits stronger directional phrases such as 수익화 접점이 늘어날 수
있습니다, 이직·직무 전환을 검토하기 쉬운 흐름입니다, 연애 가능성이
올라갑니다, and 결혼을 고민할 만한 압력이 커질 수 있습니다. Hard outcome
claims remain forbidden.

The evidence packet now carries `lifeStageContext`. Age range, current age,
lifeStatus, fieldLabel, and relationshipStatus are used as interpretation
filters only. For a late-20s to mid-30s employed user, relevant themes include
career proof, income and side-income windows, job transfer review, relationship
or marriage consideration, independence, housing/living cost, and long-term
health routines. For minors, career/marriage/salary framing is suppressed in
favor of school, exams, family rules, friendships, and study rhythm.

Unknown relationship status must not be exposed in interpretive copy. The status
pill may show 미입력, but body text must not say 관계 상태가 미입력, 연애 상태가
입력되지 않아, or similar product-limitation wording. Unknown status is handled
silently as a general relationship pattern around 생활 반경, 만남 주기, 연락 방식,
and 역할 분담.

Strong-year TOP 5 push/reduce strategies are now treated as unique year-specific
actions. Repeating the same push or reduce text across TOP years triggers QA
warnings. Reality strategy sections are expected to read as substantial strategy
blocks rather than short generic summaries; smoke reports short strategy body,
unknown status exposure, weak specificity, duplicate top push, and duplicate top
reduce warnings. DAEUN-04C does not call OpenAI.

## DAEUN-04D Major Fortune Final Exposure Polish

DAEUN-04D is the final exposure polish pass before another paid major-fortune
generation check. Unknown relationship status is hidden from the top status
pills; only known statuses such as single, dating, and married are shown. The
interpretive body must still avoid exposing missing-input language.

Strong-year TOP 5 reasons must read as interpretation, not slash-separated raw
evidence. Each strong year needs a unique headline, and its reason should
translate ten-god and branch evidence into plain Korean life strategy. For
example, a regular-wealth year should explain numeric money management, while a
clash year should explain structure, role, contract, or routine reallocation.

The auxiliary-star basis is filtered for user-facing usefulness. The view and
validator show at most five useful entries, always hide diagnostic-only or scary
items such as 백호대살, and remove filler lines such as generic "carefully
reference in life scenes" wording. DAEUN-04D adds smoke QA counters for unknown
relationship pills, slash-separated whyStrong text, duplicate strong-year
headlines, and weak auxiliary-star explanations. DAEUN-04D does not call OpenAI.

## DAEUN-04E Major Fortune Final Micro Polish Before Lock

DAEUN-04E keeps the 대운 v1.0 lock candidate stable while applying only final
user-facing micro polish. In TOP-year labels, 편재 and 정재 are separated:
편재 remains `돈·외부기회`, while 정재 becomes `돈·현실관리` because it is
about fixed costs, settlement, contract stability, and cashflow management.

The visible sanitizer also repairs punctuation residue in 명리 근거 copy, such
as `장면 생각이`, `장면 관계`, and `장면 돈`, by converting them into sentence
boundaries. Age remains secondary in the timeline, and the UI explains only that
ages are shown by the supplied major-fortune table basis. It does not claim 만
나이, 세는나이, or another exact age convention until that source is standardized.
DAEUN-04E does not call OpenAI.

## REPORT-VERSION-UI-01 Version Label Placement

REPORT-VERSION-UI-01 moves visible `v1.0` labels out of generated report pages.
Report pages and dev previews should render product names such as `종합 리포트`,
`세운 리포트`, `대운 리포트`, and `궁합 리포트` without appending `v1.0`.

Version information remains in internal schema and draft metadata fields such as
`version` and `productVersion`. Product selection cards may show a small muted
`v1.0` badge beside the product title so the user can see product maturity
without the generated report body looking like a development artifact.

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
