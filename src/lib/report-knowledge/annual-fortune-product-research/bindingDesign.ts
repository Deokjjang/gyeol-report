import type { Binding } from "./researchTypes";

/** Future contract design only. No binding or runtime execution. */
export const ANNUAL_BINDING_DESIGN: readonly Binding[] = [
  {
    "id": "afpr:binding:natal",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "natal",
    "meaning": "확정 원국·미상 자리",
    "input": "person facts",
    "output": "confirmed natal facts",
    "checks": "natal source IDs/version·owner·position",
    "forbidden": "미상 시주·신살을 생성하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "owner from verified input, no second person",
    "periodContract": "natal facts timeless; downstream claims still require segment intersection",
    "certaintyContract": "confirmed natal positions; unknown hour stays unknown",
    "sourceAncestryContract": "birth source → confirmed natal position IDs",
    "failureReasons": [
      "unknown required natal position"
    ],
    "duplicatePolicy": "same person/position/original fact root; repeated prose does not multiply facts",
    "counterexamples": [
      "unknown hour does not invalidate independently confirmed day stem"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:year-policy",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "year-policy",
    "meaning": "선택 연도 검증",
    "input": "payload selectedYear + policy clock",
    "output": "normalized selectedYear or existing error",
    "checks": "policy version·context timestamp",
    "forbidden": "오프라인 policyDate를 실제 판매 허용으로 표시하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same owner as natal/input",
    "periodContract": "KST policy clock determines allowed year; does not set transit claim interval",
    "certaintyContract": "normalized input or explicit rejection",
    "sourceAncestryContract": "original selectedYear + policy clock/version → normalization result",
    "failureReasons": [
      "SELECTED_YEAR_INVALID"
    ],
    "duplicatePolicy": "one normalized selectedYear per input; offline policy clock kept separately",
    "counterexamples": [
      "offline future validation is not a purchase authorization"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:effective-annual",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "effective-annual",
    "meaning": "실효 연주",
    "input": "actual reading segment start",
    "output": "canonical effectiveAnnualPillar",
    "checks": "calendar version·[start,end)·annual participant",
    "forbidden": "annualGanji를 입춘 전 counterpart로 대체하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same natal owner",
    "periodContract": "canonical segment [startKst,endKstExclusive); reject annual target mismatch",
    "certaintyContract": "canonical effective year at segment start",
    "sourceAncestryContract": "calendar version + segment boundary → effectiveAnnualPillar",
    "failureReasons": [
      "annualGanji/effectiveAnnualPillar mismatch for requested claim"
    ],
    "duplicatePolicy": "same annual participant and actual period key",
    "counterexamples": [
      "January selectedYear annualGanji can differ from effective annual pillar"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:active-dayun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "active-dayun",
    "meaning": "활성 상태",
    "input": "existing CustomerDayun + instant",
    "output": "active/before_first/uncertain cycle refs",
    "checks": "dayun calculation version·exact/range·certainty",
    "forbidden": "후보 두 개를 동시 확정하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same natal owner; exact source cycle index",
    "periodContract": "intersect with exact cycle or uncertainty window; first cycle may not exist",
    "certaintyContract": "confirmed active or conditional candidate; never two confirmed cycles",
    "sourceAncestryContract": "CustomerDayun version + cycle boundary refs → active state",
    "failureReasons": [
      "missing cycle or unsupported certainty for claim"
    ],
    "duplicatePolicy": "owner/cycle index/actual window; candidate cycles stay separate",
    "counterexamples": [
      "before_first_cycle supplies no Dayun relation"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:jie-ledger",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "jie-ledger",
    "meaning": "절입 구간",
    "input": "selectedYear + actual boundaries",
    "output": "ordered continuous civil-month segments",
    "checks": "annual-month-jie-kst-v2·start/end·reasons",
    "forbidden": "segment 수를 2개로 고정하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same natal owner across ordered ledger",
    "periodContract": "continuous [Jan1,nextJan1), variable segments per civil month",
    "certaintyContract": "retain original boundary precision and range status",
    "sourceAncestryContract": "calendar input + Jie/Dayun reasons → each segment",
    "failureReasons": [
      "gap/overlap/zero length or missing boundary provenance"
    ],
    "duplicatePolicy": "one boundary at same instant may carry multiple reasons; preserve actual participant changes",
    "counterexamples": [
      "Jie and Dayun boundaries less than a day apart must not be merged"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:month",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "month",
    "meaning": "실제 월운",
    "input": "canonical segment",
    "output": "month pillar·stem/main-branch tenGod·elements",
    "checks": "person dayMaster·month target·calendar version",
    "forbidden": "지원하지 않는 지장간 효과를 활성 fact로 추가하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same natal dayMaster owner",
    "periodContract": "the originating segment interval only",
    "certaintyContract": "canonical month pillar; no activation of unsupported hidden stems",
    "sourceAncestryContract": "calendar segment + dayMaster + original tenGod rule → monthly facts",
    "failureReasons": [
      "missing reference stem or month target"
    ],
    "duplicatePolicy": "month stem versus branch-main god kept distinct; same label is not same root",
    "counterexamples": [
      "two different months can carry the same tenGod without a new meaning"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:relations",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "relations",
    "meaning": "구간별 관계",
    "input": "actual participants and existing producer",
    "output": "confirmed/conditional relation packets",
    "checks": "original Evidence ID·source/version·formation·counterconditions",
    "forbidden": "single pair를 composite verdict로 승격하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same owner with explicit natal positions and period counterpart",
    "periodContract": "intersection of actual actor periods; conditional candidates retain windows",
    "certaintyContract": "original producer certainty; composite unsupported",
    "sourceAncestryContract": "original Evidence IDs/version + exact actors → relation packet",
    "failureReasons": [
      "unsupported formation, wrong actor/scope or conditional treated as confirmed"
    ],
    "duplicatePolicy": "source fact root + actual actor identities + scope + period key",
    "counterexamples": [
      "two participants cannot establish a three-participant trine or three-layer verdict"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:source-validation",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "source-validation",
    "meaning": "원천·조건 검증",
    "input": "source ancestry and period window",
    "output": "supported / held / rejected result",
    "checks": "owner·scope·time intersection·fact roots",
    "forbidden": "다른 기간의 근거를 같은 root로 잘못 병합하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "all ancestors must resolve to same verified person",
    "periodContract": "nonempty intersection; no nominal-year extension into prior effective year",
    "certaintyContract": "lowest certainty among required sources; missing stays withheld",
    "sourceAncestryContract": "every original ID/version/hash through all ancestors",
    "failureReasons": [
      "owner/time/source mismatch or withheld ancestor"
    ],
    "duplicatePolicy": "deduplicate ancestors without merging different scopes/windows",
    "counterexamples": [
      "valid annual source exists but is inapplicable before Ipchun"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:research",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "research",
    "meaning": "전문 후보 대조",
    "input": "verified facts + offline research locators",
    "output": "conditional applicable research references",
    "checks": "source status/hash·counterexample·domain",
    "forbidden": "연구 ID를 actual Evidence ID로 발급하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "single-person source only; MBTI pair not allowed",
    "periodContract": "natal/MBTI supplies personal condition; transit supplies actual claim window",
    "certaintyContract": "editorial hypothesis remains unapproved even with matching facts",
    "sourceAncestryContract": "source-local review state + locator/hash + verified facts → candidate",
    "failureReasons": [
      "unverified/rejected source, unsupported composite, context absent"
    ],
    "duplicatePolicy": "reference crosswalk is not an additional fact or authored independent meaning",
    "counterexamples": [
      "a personal trait does not calculate this year/month event"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:allocation",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "allocation",
    "meaning": "12개월 정보 배정",
    "input": "candidate and displayed-root ledgers",
    "output": "future information assignment design only",
    "checks": "primary/secondary·duplicate group·comparison/continuity",
    "forbidden": "실제 배정·선택 알고리즘이나 새 가중치를 구현하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same book owner and selectedYear",
    "periodContract": "keep full 12-month ledger and per-claim segment bounds",
    "certaintyContract": "preserve source uncertainty and withheld options",
    "sourceAncestryContract": "candidate roots + displayed roots + prior/next actual signatures",
    "failureReasons": [
      "no eligible candidate or unsupported new-information claim"
    ],
    "duplicatePolicy": "same roots may be continuity/comparison/new application, never extra Evidence count",
    "counterexamples": [
      "new wording of the same action is not independent information"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:prose",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "prose",
    "meaning": "한국어 표현",
    "input": "future verified claims and conditions",
    "output": "customer-safe conditional prose design only",
    "checks": "claim-to-source mapping·scene status·time tense",
    "forbidden": "가짜 경험·성공 예언·MBTI 시기 인과를 추가하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "same owner; fictional scenes never customer history",
    "periodContract": "each claim bounded to its actual source interval; tense follows reading clock",
    "certaintyContract": "conditional prose cannot upgrade a source certainty",
    "sourceAncestryContract": "verified future claim map → proposed sentence source map",
    "failureReasons": [
      "fabricated experience, forecast certainty or missing condition"
    ],
    "duplicatePolicy": "avoid retelling same fact as multiple predictions; retain needed time caveats",
    "counterexamples": [
      "current job/relationship is not proven for a selected past or future year"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  },
  {
    "id": "afpr:binding:book",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "future_binding_design",
    "stage": "book",
    "meaning": "발행 계약",
    "input": "existing validated draft and evidence",
    "output": "existing Book/snapshot contract",
    "checks": "publication seal·period data·immutable stored edition",
    "forbidden": "기존 Book 저장본을 재생성·덮어쓰기하지 않음",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:publication"
    ],
    "implemented": false,
    "missingPolicy": "withhold affected claim, retain valid independent facts",
    "approval": "requires future verified source/formation/time/domain review; research not customer approval",
    "ownerContract": "existing authorized Book owner, unchanged access checks",
    "periodContract": "store original source windows and selectedYear contract; existing access expiry unchanged",
    "certaintyContract": "existing publication validator controls validity",
    "sourceAncestryContract": "draft + original evidence + publication seal → immutable Book",
    "failureReasons": [
      "existing publication validation failure"
    ],
    "duplicatePolicy": "one immutable edition; research must not regenerate saved snapshots",
    "counterexamples": [
      "legacy unversioned monthly snapshots keep their original stored contract"
    ],
    "sourceVersionContract": "original producer version and source-local locator/hash, never research ID as Evidence",
    "approvalConditions": [
      "all required source/owner/time/formation checks pass",
      "required source review is approved in a future task",
      "human review of conditional meaning and domain fit; no automatic customer approval"
    ]
  }
];
