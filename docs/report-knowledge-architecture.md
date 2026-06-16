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
surface. The result page can show `사주×MBTI 종합 리포트 v1.0`. This is a
product-specific version label, not a paid upgrade mechanism.

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
