import type { BindingStage } from "./researchTypes";

/** Offline contract only; no runtime binding. */
export const KOREAN_EXPRESSION_BINDING: readonly BindingStage[] = [
  {
    "id": "ker:binding:evidence",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "evidence",
    "input": "original calculated facts",
    "output": "verified evidence envelope",
    "owner": "source owner and exact natal/period role",
    "direction": "actual directionId + subject/target retained",
    "time": "original [start,end) / exact or range",
    "certainty": "original certainty, no upgrade",
    "ancestry": "calculation version → Evidence IDs → ancestry",
    "slotTypes": [
      "literal_fact",
      "period"
    ],
    "failureReasons": [
      "missing/wrong-owner/unsupported formation",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "no introduction yet; no claim before facts",
    "duplicatePolicy": "same fact root not extra Evidence",
    "approval": "validated calculation and actual eligible source",
    "forbidden": "research ID must not become calculated Evidence",
    "implemented": false
  },
  {
    "id": "ker:binding:interpretation",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "interpretation",
    "input": "verified evidence + specialized source state",
    "output": "future approved conditional interpretation",
    "owner": "same person/pair source owners",
    "direction": "single vs pair and both directions separate",
    "time": "intersection of all required source windows",
    "certainty": "source uncertainty remains conditional",
    "ancestry": "specialized locator/hash + all actual roots",
    "slotTypes": [
      "approved_claim"
    ],
    "failureReasons": [
      "unapproved source or inapplicable domain",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "source-state review before first introduction",
    "duplicatePolicy": "same original meaning stays one identity",
    "approval": "future specialist source/conditions/counterexample review",
    "forbidden": "offline research is not approval",
    "implemented": false
  },
  {
    "id": "ker:binding:claim",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "claim",
    "input": "approved interpretation",
    "output": "product claimIdentity/meaningIdentity/semanticUnits",
    "owner": "owner explicit; current status not historical fact",
    "direction": "direction pair explicitly required where relevant",
    "time": "claim carries exact/range and reference period",
    "certainty": "negation/condition/epistemic mode unchanged",
    "ancestry": "claim → approved interpretation → actual facts",
    "slotTypes": [
      "noun_phrase",
      "predicate",
      "condition"
    ],
    "failureReasons": [
      "meaning unit unsupported or new fact appended",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "register only after actual expression introduces unit",
    "duplicatePolicy": "paraphrases share same meaning identity",
    "approval": "all units licensed by approved interpretation",
    "forbidden": "new claim from a metaphor or scene",
    "implemented": false
  },
  {
    "id": "ker:binding:allocation",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "allocation",
    "input": "approved claims and actual product structure",
    "output": "future assignment plan only",
    "owner": "same owner in each paragraph",
    "direction": "A/B chapter and recipient source maintained",
    "time": "period/chapter key retained",
    "certainty": "no certainty change by importance/ranking",
    "ancestry": "chapter purpose → assigned claim roots",
    "slotTypes": [
      "claim_ref"
    ],
    "failureReasons": [
      "missing eligible claim for paragraph purpose",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "firstChapter,explainedUnits,scope,owner,direction,time required",
    "duplicatePolicy": "allow recall/comparison/new application without extra fact count",
    "approval": "future allocation task only; not implemented",
    "forbidden": "generic filler to satisfy length/144roles",
    "implemented": false
  },
  {
    "id": "ker:binding:function",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "function",
    "input": "assigned claim and paragraph purpose",
    "output": "eligible rhetorical function",
    "owner": "retain source owner",
    "direction": "comparison requires both separate licensed claims",
    "time": "same claim window",
    "certainty": "positive/risk/twist cannot strengthen certainty",
    "ancestry": "function → assigned claimIdentity",
    "slotTypes": [
      "rhetorical_purpose"
    ],
    "failureReasons": [
      "function needs unapproved risk/twist",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "summary/closing can recall only introduced units",
    "duplicatePolicy": "same unit in another function not new meaning",
    "approval": "meaning-preserving role reviewed",
    "forbidden": "word choice implies stronger fact",
    "implemented": false
  },
  {
    "id": "ker:binding:scene",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "scene",
    "input": "approved claim + actual/conditional state",
    "output": "hypothetical-only scene candidate",
    "owner": "actors do not become new real people",
    "direction": "actor action and recipient reaction separate",
    "time": "current state not copied to past/future",
    "certainty": "hypothetical status immutable",
    "ancestry": "sceneIdentity → claim and required context",
    "slotTypes": [
      "hypothetical_scene"
    ],
    "failureReasons": [
      "unsupported job/marriage/child/contract/history",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "scene example distinct from introduced person fact",
    "duplicatePolicy": "same scene family not new information automatically",
    "approval": "domain/state/permission/safety checks + human realism review",
    "forbidden": "fictional lead dropped in later paragraph",
    "implemented": false
  },
  {
    "id": "ker:binding:sentence",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "sentence",
    "input": "claim/function/optional scene and typed slots",
    "output": "proposed sentence only",
    "owner": "predicate subjectOwner equals intended actor",
    "direction": "literal A/B slots substituted once",
    "time": "tense and exact/range references retained",
    "certainty": "same condition and negation scope",
    "ancestry": "sentence → semanticUnits → claim → roots",
    "slotTypes": [
      "noun_phrase",
      "predicate",
      "literal_label",
      "condition"
    ],
    "failureReasons": [
      "unknown phonology or unreviewed inflection",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "sentence records exactly introduced semantic units",
    "duplicatePolicy": "syntactic variant not independent analysis",
    "approval": "typed slot checks + manual morphology/meaning review",
    "forbidden": "global A/B replacement or blind suffix rewrite",
    "implemented": false
  },
  {
    "id": "ker:binding:transition",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "transition",
    "input": "two licensed paragraphs/chapters",
    "output": "logical bridge proposal",
    "owner": "switching owner is explicit",
    "direction": "AB→BA requires new recipient context",
    "time": "past/current/future and Dayun/annual/monthly distinct",
    "certainty": "connective cannot introduce causal confidence",
    "ancestry": "from/to introduced units and source roots",
    "slotTypes": [
      "logical_relation",
      "introduced_claim_ref"
    ],
    "failureReasons": [
      "missing antecedent or unsupported causal link",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "only actual introduced meaning may be recalled",
    "duplicatePolicy": "new view needs new question or explicit continuity",
    "approval": "logical relation and nonduplication human review",
    "forbidden": "last chapter suddenly invents missing meaning",
    "implemented": false
  },
  {
    "id": "ker:binding:book-quality",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "stage": "book-quality",
    "input": "proposed full Book and traceable sentence map",
    "output": "future quality verdict or shortage reasons",
    "owner": "all owner metadata preserved",
    "direction": "all direction identities preserved",
    "time": "all canonical windows and legacy Book contract",
    "certainty": "no forced certainty for readability",
    "ancestry": "Book → chapter → paragraph → sentence → claims → facts",
    "slotTypes": [
      "immutable_book_contract"
    ],
    "failureReasons": [
      "grammar/meaning/history/role/time drift or expression shortage",
      "not enough eligible expressions -> explicit shortage, no invented filler"
    ],
    "introducedLedgerRequirement": "introduced ledger checked across whole Book",
    "duplicatePolicy": "review claim/action/scene overlap beyond string similarity",
    "approval": "human readability review separately from grammar; existing publication validator still controls",
    "forbidden": "modify existing snapshots, generator, guard or publication engine",
    "implemented": false
  }
];
