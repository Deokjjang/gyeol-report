import type { Crosswalk } from "./researchTypes";

/** Original E/F/G states stay withheld; monthly-only references do not enter major annual research. */
export const MAJOR_TEMPORAL_CROSSWALK: readonly Crosswalk[] = [
  {
    "id": "mfpr:temporal-ref:sm-dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 0,
      "originalId": "sm-dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "33eb322c997cc99700325da71e9e8912894fad6442d3202671656420f0759e0d"
    },
    "originalState": {
      "id": "sm-dayun",
      "kind": "historical_transcription",
      "title": "三命通會 四庫全書本 卷02",
      "edition": "Wikisource 전사; 스캔과 전체 교감은 미실시",
      "locator": "論大運",
      "url": "https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷02",
      "verified": "2026-10-13 직접 본문 열람",
      "claims": [
        "원국의 기반을 먼저 살핀 뒤 행운을 함께 보도록 설명한다.",
        "순역·절기 간격의 전통 기산과 세부 시각 논의를 확인했다.",
        "대운 변화 주변의 잔류를 비유적으로 설명하지만 현행 불확실성 구간과 같은 모델은 아니다."
      ],
      "limitations": [
        "현재 sect2 계산의 독립 천문 검증이 아니다.",
        "운의 길흉·질병·죽음 단정은 역사적 주장으로만 보며 사용 승인하지 않는다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:ziping-yun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 1,
      "originalId": "ziping-yun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "520b71270572d4e9c2540eb0429d68a99cfabad1de4af8612b86e518a25c91cf"
    },
    "originalState": {
      "id": "ziping-yun",
      "kind": "historical_transcription",
      "title": "子平真詮 秘本 卷二 二十五 論行運",
      "edition": "東里書齋 전사; 校와 東里山人按은 현대 교감·편집자 주석",
      "locator": "본문과 〖校〗/〖東里山人按〗 분리",
      "url": "https://donglishuzhai.net/chapter/3738.html",
      "verified": "2026-10-13 직접 본문 열람",
      "claims": [
        "행운 간지를 원국의 조건에 맞춰 비교한다.",
        "같은 오행이라도 천간과 지지의 작용을 동일하게 보지 않는 예를 제시한다.",
        "유사 조건의 상반된 길흉 논의가 있으며 현대 편집자는 일부 설명의 불일치를 지적한다."
      ],
      "limitations": [
        "편집자의 이견을 원전 결론으로 합치지 않는다.",
        "격국·희기 계산은 신규 구현하지 않는다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:ditian-suiyun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 2,
      "originalId": "ditian-suiyun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "98ec484d1f33d13786cabe22c7e01944ec9077674deadf622049ae3c6a8ea847"
    },
    "originalState": {
      "id": "ditian-suiyun",
      "kind": "historical_transcription",
      "title": "滴天髓 歲運論 /09",
      "edition": "Wikisource 본문과 해설 혼합 전사; 개별 주석의 저자·계통 확정 안 함",
      "locator": "歲運論 본문 및 何謂戰/衝/和/好 해설",
      "url": "https://zh.wikisource.org/wiki/滴天髓/09",
      "verified": "2026-10-13 직접 본문 열람",
      "claims": [
        "대운과 세운의 역할을 서로 다른 배경으로 비유하고 원국 일간·계절과 함께 살피도록 설명한다.",
        "충·합의 결과를 참가자와 조건에 따라 달리 설명하는 해설이 있다."
      ],
      "limitations": [
        "주석의 귀속·예측 정확성을 확인한 것이 아니다.",
        "비유를 실제 사람·사건으로 대입하지 않는다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:repo-calendar",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 3,
      "originalId": "repo-calendar",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "78a5212391dfb75eabb8d93dd10b6a66a2e41f0cad53d3dcf9d2cbed1ec6cbc4"
    },
    "originalState": {
      "id": "repo-calendar",
      "kind": "repository",
      "title": "기준 SHA 3117327 저장소 정의",
      "edition": "git 3117327c80e8a35e9a476646114ffc3ae42f93ed",
      "locator": "src/lib/saju/customerDayun.ts;src/lib/saju/solarTerms.ts;src/lib/saju/lunarJavascriptPillars.ts",
      "url": null,
      "verified": "2026-10-13 코드 직접 확인",
      "claims": [
        "확정/범위 교운, sect2, KST 및 실제 월주 변경 경계"
      ],
      "limitations": [
        "코드 지원과 전통적 의미·실증적 예측 정확성은 별도다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:repo-periods",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 4,
      "originalId": "repo-periods",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5ed847ec51d8e7d22aed7205e0ea70ab932154c7f79a46633a161eb5a1f1088c"
    },
    "originalState": {
      "id": "repo-periods",
      "kind": "repository",
      "title": "기준 SHA 3117327 저장소 정의",
      "edition": "git 3117327c80e8a35e9a476646114ffc3ae42f93ed",
      "locator": "src/lib/report-knowledge/majorFortuneEvidence.ts;src/lib/report-knowledge/majorFortuneDecadeReading.ts;src/lib/report-knowledge/majorFortuneRules.ts;src/lib/report-knowledge/annualFortuneEvidence.ts;src/lib/report-knowledge/annualMonthJie.ts;src/lib/report-knowledge/annualMonthExtendedEvidence.ts;src/lib/interpretation-v4/majorEvidence.ts;src/lib/interpretation-v4/annualEvidence.ts;src/lib/interpretation-v4/timeProductContext.ts;src/lib/interpretation-v4/periodPlanner.ts",
      "url": null,
      "verified": "2026-10-13 코드 직접 확인",
      "claims": [
        "현재 producer의 출처·기간·확정 상태"
      ],
      "limitations": [
        "코드 지원과 전통적 의미·실증적 예측 정확성은 별도다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:repo-gods",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 5,
      "originalId": "repo-gods",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "365147e021562ddc995d375221beefec37e821309c986c03ed10ea7e33197eb9"
    },
    "originalState": {
      "id": "repo-gods",
      "kind": "repository",
      "title": "기준 SHA 3117327 저장소 정의",
      "edition": "git 3117327c80e8a35e9a476646114ffc3ae42f93ed",
      "locator": "src/lib/report-knowledge/annualFortuneYearRules.ts;src/lib/report-knowledge/sajuFoundationKnowledge.ts",
      "url": null,
      "verified": "2026-10-13 코드 직접 확인",
      "claims": [
        "기준 천간과 대상 천간의 십성; 기존 기초 정의"
      ],
      "limitations": [
        "코드 지원과 전통적 의미·실증적 예측 정확성은 별도다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:repo-elements",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 6,
      "originalId": "repo-elements",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1ed25bb1225fbebf02e74438f3c4f7aa73e513151b7a52a4fe3c9d7e97b47fac"
    },
    "originalState": {
      "id": "repo-elements",
      "kind": "repository",
      "title": "기준 SHA 3117327 저장소 정의",
      "edition": "git 3117327c80e8a35e9a476646114ffc3ae42f93ed",
      "locator": "src/lib/report-knowledge/annualFortuneYearRules.ts;src/lib/saju/constants.ts;src/lib/report-knowledge/annualMonthRelationFacts.ts",
      "url": null,
      "verified": "2026-10-13 코드 직접 확인",
      "claims": [
        "상생·상극 방향과 missing/heavy의 제한"
      ],
      "limitations": [
        "코드 지원과 전통적 의미·실증적 예측 정확성은 별도다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:repo-relations",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 7,
      "originalId": "repo-relations",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "08b53ac8f5c985fa92559ff1e808508cef2d58128c224e4856d2902c189e20c8"
    },
    "originalState": {
      "id": "repo-relations",
      "kind": "repository",
      "title": "기준 SHA 3117327 저장소 정의",
      "edition": "git 3117327c80e8a35e9a476646114ffc3ae42f93ed",
      "locator": "src/lib/report-knowledge/annualFortuneYearRules.ts;src/lib/report-knowledge/annualMonthRelationFacts.ts;src/lib/report-knowledge/annualMonthJie.ts;src/lib/report-knowledge/annualMonthExtendedEvidence.ts;src/lib/interpretation-v4/annualEvidence.ts",
      "url": null,
      "verified": "2026-10-13 코드 직접 확인",
      "claims": [
        "실제 관계 생산자별 지원과 이전 rr ID 참조"
      ],
      "limitations": [
        "코드 지원과 전통적 의미·실증적 예측 정확성은 별도다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:editorial",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts",
      "exportName": "TEMPORAL_SOURCES",
      "index": 8,
      "originalId": "editorial",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c01c2a110bff81f79a278e7f0dc9c6da41ffe3fed08b7b8a36dfe61a9fb2a212"
    },
    "originalState": {
      "id": "editorial",
      "kind": "authored",
      "title": "기간별 조건부 연구·현대 생활 질문",
      "edition": "이번 독립 연구",
      "locator": "C/D 분리; 고객용 문장 승인 없음",
      "url": null,
      "verified": "내용·시간·출처 감사 대상",
      "claims": [
        "실제 조건을 비교하는 연구 질문이며 전통적 사실·실증 예측·생성기 재료로 승인하지 않았다."
      ],
      "limitations": [
        "생활 질문의 유용성을 명리적 결과의 정확성으로 해석하지 않는다."
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:exact-transition",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 0,
      "originalId": "tr:boundary:exact-transition",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c574ba504eae9836587518bcf115cec3b0c42a3898578ae3c0d431115f5d04b5"
    },
    "originalState": {
      "id": "tr:boundary:exact-transition",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "확정 교운",
      "rule": "t < startSolarKst는 이전 운, t >= startSolarKst는 새 운이다. 고정 지연이나 1월1일 경계를 넣지 않는다.",
      "required": "startSolarKst와 양쪽 실제 cycle",
      "prohibited": "연간 요약 cycle을 전환 전까지 확장",
      "nextEvidence": "경계 -1초/정각/+1초의 실제 선택 비교"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:ranged-transition",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 1,
      "originalId": "tr:boundary:ranged-transition",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6c542216f159a5fa2f70307b5975093640633d405e6ec8638ef034a5dc1d12ef"
    },
    "originalState": {
      "id": "tr:boundary:ranged-transition",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "범위 교운",
      "rule": "t < earliest는 이전 운, earliest <= t < latest는 후보 구간, t >= latest는 새 운이다.",
      "required": "각 cycle의 startSolarRange와 이전 cycle 존재 여부",
      "prohibited": "범위 중앙값·대표시각·두 운 동시 확정",
      "nextEvidence": "양끝과 내부의 activeDayunContext 비교"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:stable-not-exact",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 2,
      "originalId": "tr:boundary:stable-not-exact",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "00862972262f5aee16a87ca6060da355186bb3eac17033fd9960fc992fca5c11"
    },
    "originalState": {
      "id": "tr:boundary:stable-not-exact",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "안정성과 정밀도",
      "rule": "stable=true는 연도·간지 순서가 안정적이라는 뜻이며 정확 시각이 확인됐다는 뜻이 아니다.",
      "required": "precision·startSolarKst null 여부",
      "prohibited": "안정적 계산을 초 단위 확정으로 승격",
      "nextEvidence": "exact/approximate/unknown 각각의 결과 확인"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:unknown-refusal",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 3,
      "originalId": "tr:boundary:unknown-refusal",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2ad11c409ec9c1a5c8bb3be32510eb063c346360f40a9cef880b31f7cad65c55"
    },
    "originalState": {
      "id": "tr:boundary:unknown-refusal",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "미상 입력 거절",
      "rule": "가능한 출생 구간에서 연월·방향·시작연도·간지가 안정적이지 않으면 기존 DAYUN_UNCERTAIN을 유지한다.",
      "required": "기존 계산 성공/실패 상태",
      "prohibited": "임의 정오·성별·방향을 대입해 성공 처리",
      "nextEvidence": "지원 가능한 미상 사례와 거절 사례를 둘 다 확인"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:before-first",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 4,
      "originalId": "tr:boundary:before-first",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "85cc3d16719abc20abb84bd2761cf3de5f42763d14d550cadee7660bfa6aedb8"
    },
    "originalState": {
      "id": "tr:boundary:before-first",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "첫 대운 이전",
      "rule": "활성 운이 없으면 before_first_cycle과 빈 cycle 목록을 보존한다.",
      "required": "첫 earliest와 현재 시각",
      "prohibited": "첫 운이 이미 시작됐다고 출력",
      "nextEvidence": "첫 경계 이전과 첫 후보 구간 구분"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:nominal-year",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 5,
      "originalId": "tr:boundary:nominal-year",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "baa64e30b1da0309d6b33d84b15e01c49a6dbf5b2b38fd2186296324ef636f9f"
    },
    "originalState": {
      "id": "tr:boundary:nominal-year",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "명목 시작연도",
      "rule": "startYear/endYear는 연도 요약 선택에 쓰지만 실제 KST 전환 시각과는 다르다.",
      "required": "nominal cycle과 activeCycleAtEvaluation",
      "prohibited": "1월1일에 교운한다고 주장",
      "nextEvidence": "연도별 요약과 실제 segment를 별도로 비교"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:half-open",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 6,
      "originalId": "tr:boundary:half-open",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "969720c9d321c67d90b3feb5c95b3575d8ff02a1fc62174f86201f895285c5dd"
    },
    "originalState": {
      "id": "tr:boundary:half-open",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반열린 구간",
      "rule": "모든 ledger는 [startKst,endKstExclusive)로 비교한다. 경계 정각은 다음 구간이다.",
      "required": "명시 +09:00 또는 절대시각",
      "prohibited": "양끝 중복 소속·지역 시간대별 결과 차이",
      "nextEvidence": "접한 구간 end==다음 start와 t 정각 검사"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:jie-not-midqi",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 7,
      "originalId": "tr:boundary:jie-not-midqi",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4709524955124a9f963fd0df1668a3099c03363b5705831fc89cbea71957a98c"
    },
    "originalState": {
      "id": "tr:boundary:jie-not-midqi",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "절입과 중기",
      "rule": "현재 경계는 24절기 중 실제 canonical month pillar가 바뀌는 절입12개다.",
      "required": "getAnnualJieBoundaries의 월주 before/after",
      "prohibited": "24절기 모두 월주 경계로 사용",
      "nextEvidence": "동지·하지가 월주 변경이라고 가정하지 않기"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:civil-month",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 8,
      "originalId": "tr:boundary:civil-month",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "22a51d0432d39adcfdc41a5c360c4f7656beec57e59a6725fede5301cb7a2bfc"
    },
    "originalState": {
      "id": "tr:boundary:civil-month",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "달력월 분할",
      "rule": "달력월 12개 안에 절입 경계와 대운 earliest/latest가 추가로 들어갈 수 있다.",
      "required": "월 용기와 segments 전체",
      "prohibited": "항상 월마다 단일 간지·두 구간이라고 고정",
      "nextEvidence": "같은 달의 3개 이상 segment도 보존"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:lichun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 9,
      "originalId": "tr:boundary:lichun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "56c201aefbfb15426a67edca3d084aaa7fa9ee2ec498f0e4cd0cc63c6bcb8d3a"
    },
    "originalState": {
      "id": "tr:boundary:lichun",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "입춘 전후",
      "rule": "selectedYear와 effectiveAnnualPillar를 분리해 실제 연주를 사용한다.",
      "required": "segment 시작의 canonical year pillar",
      "prohibited": "1월1일에 연주가 바뀐다고 확정",
      "nextEvidence": "입춘 직전·정각에서 월주와 연주 함께 확인"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:month-main-stem",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 10,
      "originalId": "tr:boundary:month-main-stem",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b8a34751b1810aa1775d007b8e0ea15b854d6f603a7b1adaa67fa32f066fb9ed"
    },
    "originalState": {
      "id": "tr:boundary:month-main-stem",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월지 본기 기준",
      "rule": "branchTenGod는 월지의 본기 한 천간과 natal dayMaster 비교다.",
      "required": "본기 표와 기준 일간",
      "prohibited": "전체 장간·투간·강약 산출로 확대",
      "nextEvidence": "12월지의 본기와 기존 십성 함수 비교"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:conditional-relations",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 11,
      "originalId": "tr:boundary:conditional-relations",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "504b0f4c1cb3ba6ec551e793288103cce7a79f1820a596ca499a11c675e7f246"
    },
    "originalState": {
      "id": "tr:boundary:conditional-relations",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "조건부 관계",
      "rule": "불확실 교운 후보와의 month_dayun_branch는 conditional이고 원국·실효 연주 관계는 별도다.",
      "required": "fact.source·counterpart·certainty",
      "prohibited": "conditional을 confirmed로 합침",
      "nextEvidence": "후보별 ID와 유효 기간 동시 확인"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:legacy-mixed",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 12,
      "originalId": "tr:boundary:legacy-mixed",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "86a4fd7a38c03bf9e0108939f9a06d3ddc0b72509e115bd05a9698422b874b9c"
    },
    "originalState": {
      "id": "tr:boundary:legacy-mixed",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "레거시 혼합 provenance",
      "rule": "majorFortuneEvidence 보조 함수의 [currentCycle.branch,...natalBranches] ordinal은 실제 natal 기둥 위치가 아니다.",
      "required": "현행 함수별 호출 경로·배열 소유자",
      "prohibited": "최신 분리된 cycleRelations와 같은 provenance라고 취급",
      "nextEvidence": "별도 고객 영향 추적 필요; 이번에 수정 안 함"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:major-row-granularity",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 13,
      "originalId": "tr:boundary:major-row-granularity",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "144f81ced5816294d4108955c3b37141448b78a08ac07ab0fa8ed57b6282c89f"
    },
    "originalState": {
      "id": "tr:boundary:major-row-granularity",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운 연도 row의 한계",
      "rule": "majorEvidence는 14년 horizon 경계를 보존하지만 annual row는 해당 명목 cycle의 연간 reading 하나를 선택한다.",
      "required": "horizon.before/after와 annual.cycleRelations 출처",
      "prohibited": "전환 이후 관계를 해당 해 전체에 적용",
      "nextEvidence": "새 연결 전 전환 전후 관계 ledger의 별도 설계 승인 필요"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:annual-stem-time",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 14,
      "originalId": "tr:boundary:annual-stem-time",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "191498bd8a272c79ad0f028ce53e1ea56a1dee0aacffd44e6f494270097a4d92"
    },
    "originalState": {
      "id": "tr:boundary:annual-stem-time",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "선택 연주 천간합의 한계",
      "rule": "annualStemRelations는 실제 표 투영이지만 selectedYear annualGanji를 사용한다. effectiveAnnualPillar 구간과 자동 동일하지 않다.",
      "required": "투영의 natal position·annual stem 및 구간별 연주",
      "prohibited": "선택 연주 투영을 입춘 전에도 그대로 적용",
      "nextEvidence": "구간 연주와 일치 여부 별도 검토"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:duplicate-owner",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 15,
      "originalId": "tr:boundary:duplicate-owner",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7068f6db1201162d43e4de727f6e592399781580ca51d90730122f3629c9df33"
    },
    "originalState": {
      "id": "tr:boundary:duplicate-owner",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "동일값과 소유자",
      "rule": "같은 申이라도 natal day와 dayun branch는 다른 참가자다. 같은 쌍의 재투영과 다른 owner의 실제 접점을 구분한다.",
      "required": "owner·position·period·symbols·source rule",
      "prohibited": "지지 문자열만으로 합치기 또는 출처 수만큼 위험 합산",
      "nextEvidence": "의미 단위 key와 관찰 provenance를 분리"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:boundary:time-position",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalBoundaries.ts",
      "exportName": "TEMPORAL_BOUNDARIES",
      "index": 16,
      "originalId": "tr:boundary:time-position",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "531d81598048fe476bc4790eb18742c46a00fbe7cbc3bbb8a77608e346afce26"
    },
    "originalState": {
      "id": "tr:boundary:time-position",
      "class": "B",
      "sourceRefs": [
        "repo-periods",
        "repo-calendar"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "과거·현재·미래",
      "rule": "구간 t<start 미래, start<=t<end 현재, t>=end 과거다. 연도 요약은 별도의 civil year label이다.",
      "required": "고정 평가 시각 2026-10-12T12:00:00+09:00",
      "prohibited": "과거 구간이면 경험한 사건으로 서술",
      "nextEvidence": "현재 해의 지난 월·현재 구간·다가올 월을 구분"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:concept:natal",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalConcepts.ts",
      "exportName": "TEMPORAL_CONCEPTS",
      "index": 0,
      "originalId": "tr:concept:natal",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8d37a3b7eb670fee0534ec409543f890a97ee9e1c3d693659537914b6fdc3f5e"
    },
    "originalState": {
      "id": "tr:concept:natal",
      "class": "B",
      "sourceRefs": [
        "repo-calendar",
        "repo-periods"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원국은 고정된 출생 기준",
      "meaning": "기간이 바뀌어도 출생 기둥은 바뀌지 않는다. 기간 요소는 별도의 소유자를 갖는 비교 대상이다.",
      "positive": "타고난 반응과 현재 환경을 구별해 원래 가진 자원을 재사용할 질문을 만든다.",
      "risk": "새 월간지를 타고난 월주에 덮어쓰면 개인화 근거와 기간 근거가 함께 훼손된다.",
      "reversal": "불편한 기간이 지나도 원국이 정화되거나 악화됐다고 설명하지 않는다.",
      "distinction": "사주 월주와 현재 월운은 같은 월이라는 글자가 있어도 서로 다른 시점이다.",
      "requires": [
        "실제 계산 버전",
        "기둥 소유자",
        "start/end와 certainty"
      ],
      "excludes": [
        "대표 출생시간 강제 입력",
        "추정 사건을 사실로 서술"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "B",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:concept:dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalConcepts.ts",
      "exportName": "TEMPORAL_CONCEPTS",
      "index": 1,
      "originalId": "tr:concept:dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "448e0189d0ef8a564845e3427ef578b39fda7fc6683d596c4769e899e2491c5b"
    },
    "originalState": {
      "id": "tr:concept:dayun",
      "class": "B",
      "sourceRefs": [
        "repo-calendar",
        "repo-periods"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운은 장기 배경",
      "meaning": "기존 sect2 계산에서 선택된 약 10년 주기 간지와 정확·범위 전환을 함께 읽는다. 명목 시작연도는 실제 시작 시각을 대신하지 않는다.",
      "positive": "일간 대비 운간의 역할을 여러 해의 실천과 연결해 장기 자원 배분을 검토한다.",
      "risk": "대운 십성 하나로 10년간의 직장·혼인·소득 사건을 확정하면 세운 차이와 생활 조건이 사라진다.",
      "reversal": "같은 대운 안에서도 다른 세운과 월운으로 질문은 달라질 수 있다.",
      "distinction": "14년 상품 창과 하나의 10년 대운은 길이도 시작점도 다르다.",
      "requires": [
        "실제 계산 버전",
        "기둥 소유자",
        "start/end와 certainty"
      ],
      "excludes": [
        "대표 출생시간 강제 입력",
        "추정 사건을 사실로 서술"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "B",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:concept:saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalConcepts.ts",
      "exportName": "TEMPORAL_CONCEPTS",
      "index": 2,
      "originalId": "tr:concept:saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1e7c3d08cbe6355ef1c3f24b8943b0fb88511b8b3edf195373bc120aa68b66c4"
    },
    "originalState": {
      "id": "tr:concept:saeun",
      "class": "B",
      "sourceRefs": [
        "repo-calendar",
        "repo-periods"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "세운은 연도 관점",
      "meaning": "선택 연도의 간지를 독립 보존하되 실제 구간의 연주는 입춘 경계를 반영한다. 선택 연주 표와 effectiveAnnualPillar의 용도를 구별한다.",
      "positive": "장기 목표에서 올해 점검할 구체적인 기능을 분리할 수 있다.",
      "risk": "양력 1월 1일부터 선택 연주가 적용된다고 가정하면 월운의 기간간 관계를 잘못 연결한다.",
      "reversal": "올해 새 십성이 나타나도 원래 대운 역할이 지워지는 것은 아니다.",
      "distinction": "civil selectedYear는 상품 선택 단위이고 실제 연주 경계는 calendar context다.",
      "requires": [
        "실제 계산 버전",
        "기둥 소유자",
        "start/end와 certainty"
      ],
      "excludes": [
        "대표 출생시간 강제 입력",
        "추정 사건을 사실로 서술"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "B",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:concept:wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalConcepts.ts",
      "exportName": "TEMPORAL_CONCEPTS",
      "index": 3,
      "originalId": "tr:concept:wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "10ee8d2d924e14e00e2d261cca61b4c8ba7f98a8b94aaea51776c6a4e61439dc"
    },
    "originalState": {
      "id": "tr:concept:wolun",
      "class": "B",
      "sourceRefs": [
        "repo-calendar",
        "repo-periods"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월운은 절입 구간",
      "meaning": "양력 월은 표시 용기다. 절입과 교운 경계로 나뉜 각 구간마다 월주·실효 연주·대운 후보가 있다.",
      "positive": "작은 실행 단위에서 앞 구간과 달라진 요구를 확인한다.",
      "risk": "focus segment 하나를 한 달 전체로 확대하면 절입 전 조건이 누락된다.",
      "reversal": "같은 달의 두 구간이 다른 질문을 줄 수 있으며 어느 하나가 월 전체의 운세 우열을 뜻하지 않는다.",
      "distinction": "월지 본기 십성과 전체 지장간 십성은 같은 자료가 아니다.",
      "requires": [
        "실제 계산 버전",
        "기둥 소유자",
        "start/end와 certainty"
      ],
      "excludes": [
        "대표 출생시간 강제 입력",
        "추정 사건을 사실로 서술"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "B",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:concept:boundary",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalConcepts.ts",
      "exportName": "TEMPORAL_CONCEPTS",
      "index": 4,
      "originalId": "tr:concept:boundary",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a3868c0bdb12fb09aa2e2bfbbb37ed0b47bae77ff34a973ff3e58e4da04a8866"
    },
    "originalState": {
      "id": "tr:concept:boundary",
      "class": "B",
      "sourceRefs": [
        "repo-calendar",
        "repo-periods"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "경계는 소유권의 변경점",
      "meaning": "확정 전환은 시각에서 바로 새 운으로 넘어가며 범위 전환은 earliest 이상 latest 미만에서 후보가 열린다.",
      "positive": "이전·후보·이후를 나눠 근거가 언제 유효한지 설명한다.",
      "risk": "두 후보를 동시에 확정된 하나의 배경으로 합치거나 임의 중간값을 택하면 안 된다.",
      "reversal": "시간이 불확실해도 양끝 밖에서 동일한 조건이 안정적이면 그 부분만 설명할 수 있다.",
      "distinction": "확정 경계와 출생시간 불확실 구간은 서로 다른 상태다.",
      "requires": [
        "실제 계산 버전",
        "기둥 소유자",
        "start/end와 certainty"
      ],
      "excludes": [
        "대표 출생시간 강제 입력",
        "추정 사건을 사실로 서술"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "B",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:personality",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 0,
      "originalId": "tr:domain:natal_dayun:personality",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d7083f2ed101d84045b621249e018e0f21d2a62a0dd529525c63e07a331fd0c3"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:personality",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "personality",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "원래 익숙한 반응과 장기적으로 맡을 역할이 다를 때 어느 부분을 연습할까?",
      "positive": "기존 성향을 자원으로 남기고 새 역할의 연습량을 정한다.",
      "risk": "운간을 새 성격 검사 결과로 읽지 않는다.",
      "reversal": "다른 역할을 맡는 것이 본래 성향의 부정은 아닐 수 있다.",
      "action": "원국 반응·대운 역할·실제 연습을 각각 적는다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:career",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 1,
      "originalId": "tr:domain:natal_dayun:career",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e7b5833ae8bb336bede1eaa53d5dfe21c47eb3c4a375833d87d4a3782645b963"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:career",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "career",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "기존 역량을 오래 쓸 환경과 새 대운 역할 사이에 어떤 업무 조건이 필요한가?",
      "positive": "장기적으로 재사용할 역량과 새로 배울 업무를 나눈다.",
      "risk": "편관 운을 위험한 직업, 정관 운을 취업 확정으로 읽지 않는다.",
      "reversal": "직종을 바꾸지 않고 역할만 바꿔도 적응할 수 있다.",
      "action": "직업명 대신 실제 업무·권한·지원 조건을 비교한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 2,
      "originalId": "tr:domain:natal_dayun:money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5e3e0a2da2184e049d34b5b0685030c5d463607a2b116a283b962ac07a4a398f"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:money",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "money",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "원래의 자원 관리 방식과 장기적인 기회 탐색의 감당 한도가 맞는가?",
      "positive": "기반 자원과 탐색 자원을 분리해 여력을 확인한다.",
      "risk": "재성 운이 10년 부나 손실을 보장하지 않는다.",
      "reversal": "확장보다 한도를 지키는 선택이 기반을 남길 수 있다.",
      "action": "확정 자원·고정 비용·탐색 한도를 나눠 쓴다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:study",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 3,
      "originalId": "tr:domain:natal_dayun:study",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "42d20da40c135d35d43ae0b43ef8134ade6ef913a931280a126d47556ee8abdd"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:study",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "study",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "평소 배우는 방식이 장기 과제의 새 기능을 익히는 데 충분한가?",
      "positive": "기초 학습과 전환 학습의 순서를 구체화한다.",
      "risk": "인성 운을 학력·합격으로 치환하지 않는다.",
      "reversal": "더 배우기보다 이미 아는 것을 활용할 차례일 수 있다.",
      "action": "배울 역량과 실제 적용할 과제를 연결한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:love",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 4,
      "originalId": "tr:domain:natal_dayun:love",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f9ed292502de26bda179b904e209b81a622623ac992d3d21e09c46e4ba99f84f"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:love",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "love",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "익숙한 친밀감 표현을 오래 유지하면서 어떤 생활 경계를 다시 합의할까?",
      "positive": "반복되는 표현과 상대가 원하는 행동을 나눈다.",
      "risk": "원국-운 관계를 상대의 애정 변화로 단정하지 않는다.",
      "reversal": "다르게 표현해도 친밀감의 가치는 유지될 수 있다.",
      "action": "실제 상대의 말과 자신의 기대를 분리한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 5,
      "originalId": "tr:domain:natal_dayun:marriage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6cf228a59a2458f6b85930af0ef180714411b7b5b3536d8f99d62b2945a5711e"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:marriage",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "marriage",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 생활 역할의 변화가 있다면 함께 맡을 책임을 어떻게 조정할까?",
      "positive": "실제 동거·돌봄·가사 조건을 합의할 기회를 검토한다.",
      "risk": "관성·재성 운으로 혼인 시기나 배우자를 지정하지 않는다.",
      "reversal": "결혼 여부보다 기존 공동 생활의 역할 조정이 먼저일 수 있다.",
      "action": "공동 책임과 개인 선택권을 별도로 합의한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:family",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 6,
      "originalId": "tr:domain:natal_dayun:family",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "cacf773fd453567fc5dfb069b4feee2ddd2d58a8b64fcbd1841cd8101f0752db"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:family",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "family",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "오래 맡아 온 가족 역할 가운데 유지할 것과 돌려줄 것은 무엇인가?",
      "positive": "지속 가능한 지원의 범위를 확인한다.",
      "risk": "원국 자리를 특정 가족의 사건으로 대입하지 않는다.",
      "reversal": "지원의 양을 줄여 관계를 지속할 수 있다.",
      "action": "실제 요청·가능 시간·다른 지원 통로를 나눈다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_dayun:relationships",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 7,
      "originalId": "tr:domain:natal_dayun:relationships",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a8e0e6635170041c9c1a0eeb9452813498fb6d0cee9bb41951c13ed1e314897d"
    },
    "originalState": {
      "id": "tr:domain:natal_dayun:relationships",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_dayun",
      "domain": "relationships",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "기존 대인 방식과 장기 역할이 만나는 자리에서 어떤 관계를 지속할까?",
      "positive": "연결의 수보다 유지할 접점과 경계를 찾는다.",
      "risk": "합을 평생 인연, 충을 인연 단절로 읽지 않는다.",
      "reversal": "덜 자주 만나도 필요한 관계가 남을 수 있다.",
      "action": "유지 이유와 실제 상호 기여를 확인한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_dayun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:personality",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 8,
      "originalId": "tr:domain:natal_saeun:personality",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4970b88f2933a409f2742a2ec74dcccb981c7199a6d5759f9e53ab817216644e"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:personality",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "personality",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 자극받는 원국의 반응과 실제 환경 요구를 구별할 수 있는가?",
      "positive": "자동 반응을 관찰하고 올해 선택 범위를 좁힌다.",
      "risk": "세운 요소를 타고난 인격으로 설명하지 않는다.",
      "reversal": "익숙한 반응을 쓰지 않는 선택도 가능하다.",
      "action": "반응이 나타난 실제 상황만 기록한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:career",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 9,
      "originalId": "tr:domain:natal_saeun:career",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0ec4280ff35154420c61c20b96859bda43da80d6be16a71bfac68f0e39ea1ec9"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:career",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "career",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 연주가 닿는 기존 역량을 어떤 실제 과제에서 쓸 수 있는가?",
      "positive": "직업명이 아닌 수행 기능으로 연결한다.",
      "risk": "연간 십성만으로 승진·폐업을 확정하지 않는다.",
      "reversal": "새 일을 맡기보다 기존 과제의 수행 조건을 바꿀 수 있다.",
      "action": "확정 과제·평가 기준·추가 여력을 비교한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 10,
      "originalId": "tr:domain:natal_saeun:money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4e5c48474323d4f5bf9513a492ba027c5820e9aaaa1c45c3e54b7f5c43b4c801"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:money",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "money",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해의 가변 자원과 평소 관리 방식 사이에 어떤 확인이 필요한가?",
      "positive": "미확정 수입과 실제 확보한 자원을 분리한다.",
      "risk": "연지 합을 투자 이익이나 금전 사건으로 쓰지 않는다.",
      "reversal": "기회를 놓치는 비용보다 감당 못할 약속의 비용이 클 수 있다.",
      "action": "예상·확정·최대 감당 손실을 별도 칸에 둔다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:study",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 11,
      "originalId": "tr:domain:natal_saeun:study",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ec4d1aeb95a5abe49d0fc82c0b87d7b2e93a28730ed1976661368476ffc2a7a1"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:study",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "study",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 새 학습 요구가 기존 이해의 어느 공백을 드러내는가?",
      "positive": "전체 재학습보다 필요한 공백에 집중한다.",
      "risk": "인성 등장만으로 학습 성공을 보장하지 않는다.",
      "reversal": "낯선 과제는 다른 설명을 찾는 계기가 될 수 있다.",
      "action": "실제 틀린 문제와 모르는 개념을 연결한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:love",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 12,
      "originalId": "tr:domain:natal_saeun:love",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fb22572dc134f7ec65c56dc06d6245be7c9a21e0266a8baead2970160faa049a"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:love",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "love",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해의 관계 해석과 상대의 확인된 행동은 어디서 다른가?",
      "positive": "추측을 질문으로 바꿀 조건을 검토한다.",
      "risk": "원진·해를 상대 악의의 근거로 쓰지 않는다.",
      "reversal": "판단 유예가 오해의 확대를 막을 수 있다.",
      "action": "들은 말·본 행동·내 추측을 구분한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 13,
      "originalId": "tr:domain:natal_saeun:marriage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9420d2599225504953eef43f256ecd4a8648382042f2dfefe305dce5a24759e3"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:marriage",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "marriage",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 함께 결정할 일이 있다면 기존 책임 분담과 맞는가?",
      "positive": "공동 선택의 실제 조건을 점검한다.",
      "risk": "올해 일지 관계를 결혼·이혼 사건으로 확정하지 않는다.",
      "reversal": "결정 시기를 늦추는 것이 합의를 선명하게 할 수 있다.",
      "action": "의사·자원·책임이 확인된 항목부터 합의한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:family",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 14,
      "originalId": "tr:domain:natal_saeun:family",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "da197eec51cb2e005eb95f59241f26d11c31395880eb367f43b0ae903fc0c7a0"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:family",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "family",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 가족의 실제 요청이 기존 역할에 무엇을 더 요구하는가?",
      "positive": "한 해 단위로 지원 가능한 범위를 정한다.",
      "risk": "연지·시지를 부모나 자녀의 사건 예언으로 쓰지 않는다.",
      "reversal": "지원 방식의 변경이 가족을 버리는 의미는 아니다.",
      "action": "당사자 요청과 내가 떠맡은 기대를 나눈다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_saeun:relationships",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 15,
      "originalId": "tr:domain:natal_saeun:relationships",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9d34c8278084bdf6c0ac2609d3b88a76b21e2df6f6ec399260c9f1085b9e2e89"
    },
    "originalState": {
      "id": "tr:domain:natal_saeun:relationships",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_saeun",
      "domain": "relationships",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 새 접점과 기존 관계를 같은 기준으로 대하고 있는가?",
      "positive": "새 연결에 맞는 상호 기대를 확인한다.",
      "risk": "같은 지지라는 이유로 서로 다른 사람을 같은 인연으로 묶지 않는다.",
      "reversal": "새 관계를 늘리기보다 기존 접점을 정리할 수 있다.",
      "action": "각 관계의 실제 목적과 합의를 확인한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:personality",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 16,
      "originalId": "tr:domain:natal_wolun:personality",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8fd4f91b70c4c8bfe3a36331874372b0033aeba1a67f6ff6083bbc415f04226d"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:personality",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "personality",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "절입 전후 같은 상황에서 내 반응을 다르게 선택할 여지가 있는가?",
      "positive": "짧은 관찰 기간에서 바꿀 행동 하나를 정한다.",
      "risk": "월간지 변화가 성격을 바꿨다고 하지 않는다.",
      "reversal": "실제 변화가 없으면 변화 서사를 억지로 만들지 않는다.",
      "action": "경계 양쪽의 상황과 행동을 따로 기록한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:career",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 17,
      "originalId": "tr:domain:natal_wolun:career",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e006445366056f88044d5bae7bf8ea3a85cacf07013c7ac6bef6d2530a9dd096"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:career",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "career",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 구간 원국 접점이 있는 과제에서 실행 방식을 무엇부터 시험할까?",
      "positive": "전체 경력을 바꾸기보다 작은 업무 단위를 수정한다.",
      "risk": "월운 충을 퇴사나 이직의 신호로 단정하지 않는다.",
      "reversal": "변경 대신 현재 배치가 유효한지 확인하는 시험도 가능하다.",
      "action": "실제 과제 하나와 확인할 결과를 정한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 18,
      "originalId": "tr:domain:natal_wolun:money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "079c3ce0665f6b0a8a88c290b74f57e5e4e86d7e96a3f3218a3c9b205ac24006"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:money",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "money",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 절입 구간의 새 요구가 평소 자원 한도를 넘는가?",
      "positive": "짧은 기간에 쓸 시간·금액의 한도를 확인한다.",
      "risk": "월운 재성을 월별 수익률로 번역하지 않는다.",
      "reversal": "지출을 늦추는 것이 작은 실험의 여력을 남긴다.",
      "action": "확정 지출과 선택 지출을 구분한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:study",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 19,
      "originalId": "tr:domain:natal_wolun:study",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "40e71ade7792042c788769cf97d05cc3831a87be2ac736c84d49e40efbde4489"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:study",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "study",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 월주 기능을 확인할 작은 학습 산출은 무엇인가?",
      "positive": "배운 내용 한 가지를 실제 문제에 적용한다.",
      "risk": "월운 인성을 시험 결과로 확정하지 않는다.",
      "reversal": "더 읽기보다 잘못 이해한 부분을 확인할 수 있다.",
      "action": "복습 범위와 실제 산출 하나를 정한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:love",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 20,
      "originalId": "tr:domain:natal_wolun:love",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "62f6390013c0e537640efffebecf6b139ba6dc3080a79beba2bdb08d7e8f5cb7"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:love",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "love",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 구간에 관계 해석을 확인할 구체적인 대화가 있는가?",
      "positive": "기분의 추측을 실제 질문과 행동으로 옮긴다.",
      "risk": "월운 관계를 만남·이별이 예정됐다는 뜻으로 쓰지 않는다.",
      "reversal": "상대가 답할 준비가 없다면 질문을 미룰 수 있다.",
      "action": "질문 의도와 상대 선택권을 함께 남긴다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 21,
      "originalId": "tr:domain:natal_wolun:marriage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9e587c35f6dee04306836f872c60e638fbed17cbf4fd0b41a27ed8dc65b2ba22"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:marriage",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "marriage",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 구간의 공동 생활 약속을 누가 언제 실행하는가?",
      "positive": "짧은 일정에서 분담의 실행 가능성을 확인한다.",
      "risk": "월운 합을 혼인 확정으로 승격하지 않는다.",
      "reversal": "분담을 줄이는 편이 실제 이행을 높일 수 있다.",
      "action": "당사자 동의가 있는 일정만 점검한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:family",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 22,
      "originalId": "tr:domain:natal_wolun:family",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "855c2c4db889e2da27cffaf559ae8473a0e225cbf1d43f4d3dbaa6f1b2fd764c"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:family",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "family",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 구간 가족 지원에서 지금 가능한 행동은 무엇인가?",
      "positive": "작은 지원의 실제 범위를 정한다.",
      "risk": "시주 미상에 자녀 상황을 만들어 넣지 않는다.",
      "reversal": "직접 해결보다 정보나 다른 지원 연결이 적절할 수 있다.",
      "action": "요청 확인 뒤 가능한 시간 하나를 제시한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:natal_wolun:relationships",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 23,
      "originalId": "tr:domain:natal_wolun:relationships",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8c4593d015abc4ac596fbd341e9184db7078d80a1af484993b5dc1beb6b4e1e9"
    },
    "originalState": {
      "id": "tr:domain:natal_wolun:relationships",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "natal_wolun",
      "domain": "relationships",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "이번 구간 접점에서 서로 다르게 이해한 약속이 있는가?",
      "positive": "한 번의 확인으로 작은 어긋남을 구별한다.",
      "risk": "해·원진 관계로 불화를 확정하지 않는다.",
      "reversal": "약속을 새로 만들기보다 불필요한 기대를 지울 수 있다.",
      "action": "사실 확인과 평가를 분리해 묻는다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:natal_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:personality",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 24,
      "originalId": "tr:domain:dayun_saeun:personality",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "93ccf6e678f25ab808e9f7fd3c00c1052584d101b4a4b8773e1e96a675f3d55c"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:personality",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "personality",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 역할과 올해 역할이 다를 때 내 성향으로 오해한 부담이 있는가?",
      "positive": "역할 간 조정과 개인 성향을 분리한다.",
      "risk": "서로 다른 십성을 이중 인격으로 표현하지 않는다.",
      "reversal": "두 역할을 나누면 충돌이 아니라 선택 자원이 될 수 있다.",
      "action": "장기 유지·올해 추가·내 반응을 분리한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:career",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 25,
      "originalId": "tr:domain:dayun_saeun:career",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "72ed1928011d2abf954ea5c2d9c8fc6698025dacf0b1c221142a5e8a35f1ad36"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:career",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "career",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "대운 역할을 유지하면서 올해 연간 과제의 책임을 누가 맡을까?",
      "positive": "장기 역량과 연간 평가를 연결한다.",
      "risk": "같은 십성 반복을 승진 확률 증가로 읽지 않는다.",
      "reversal": "같은 역할도 수행 조건을 바꾸면 부담을 줄일 수 있다.",
      "action": "장기 목표와 올해 평가 산출을 나눈다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 26,
      "originalId": "tr:domain:dayun_saeun:money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8637c6a8e0e61e54b188c5875c99bda16dbf94d80959265ec3dd1c7261653625"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:money",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "money",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 자원 기반에서 올해 새 제안에 배정할 여력은 얼마인가?",
      "positive": "기간별 자원의 규모와 확정성을 분리한다.",
      "risk": "편재·정재 조합을 자산 상승으로 확정하지 않는다.",
      "reversal": "새 제안을 줄여 장기 기반을 보호할 수 있다.",
      "action": "장기 고정 비용과 올해 탐색 비용을 비교한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:study",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 27,
      "originalId": "tr:domain:dayun_saeun:study",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "103784cdd9ae358b7b8e72ce45e3ccb21dda01ff94340f8225ea9ce2ffa18815"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:study",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "study",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기적으로 익힐 역량과 올해 필요한 지식을 어떻게 순서화할까?",
      "positive": "기초와 단기 과제의 관계를 명확히 한다.",
      "risk": "관인 조합을 합격 공식으로 쓰지 않는다.",
      "reversal": "올해 과제로 장기 학습의 공백을 발견할 수 있다.",
      "action": "지속 학습과 올해 적용 과제를 대응시킨다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:love",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 28,
      "originalId": "tr:domain:dayun_saeun:love",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "21cc9dcdd97612a15d50f93931f0eedb8606be3e3bdae66f992484552069b9fa"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:love",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "love",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 관계 기준과 올해의 실제 생활 요구를 함께 말할 수 있는가?",
      "positive": "기준과 일시적 요구를 구별해 협의한다.",
      "risk": "기간간 합·충을 상대 감정으로 대입하지 않는다.",
      "reversal": "올해 요구를 줄여 장기 약속을 유지할 수 있다.",
      "action": "함께 확인한 생활 요구만 논의한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 29,
      "originalId": "tr:domain:dayun_saeun:marriage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0e099f75a763cb0c54181fe971688b074826d4f5b0450d0e41b094e55d312057"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:marriage",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "marriage",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 공동 계획에서 올해 실행 가능한 책임은 무엇인가?",
      "positive": "큰 약속을 연간 실행 조건으로 나눈다.",
      "risk": "두 기간의 관성을 혼인 예정의 증거로 중복 가산하지 않는다.",
      "reversal": "올해 보류할 부분을 정하면 장기 계획이 선명해질 수 있다.",
      "action": "자원·동의·일정의 확인 상태를 분리한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:family",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 30,
      "originalId": "tr:domain:dayun_saeun:family",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "876f0c20f7d357d5c9ac602262b2954d24e804b95b6fa078a4548988dfc87db6"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:family",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "family",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 가족 역할과 올해 추가 지원이 같은 사람에게 집중되는가?",
      "positive": "지속 지원과 일시 지원을 분담한다.",
      "risk": "두 기간의 긴장을 가족 사건으로 단정하지 않는다.",
      "reversal": "추가 지원을 다른 경로로 나누는 선택을 검토한다.",
      "action": "지속 역할과 연간 한시 요청을 구분한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_saeun:relationships",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 31,
      "originalId": "tr:domain:dayun_saeun:relationships",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5deb0c93aabc6a86791bcec09551b589e6cd08c5793226a6ba174003b13e265f"
    },
    "originalState": {
      "id": "tr:domain:dayun_saeun:relationships",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_saeun",
      "domain": "relationships",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "오래 유지할 관계와 올해 새 접점에 같은 시간을 쓰고 있는가?",
      "positive": "관계별 목적에 맞는 자원을 배정한다.",
      "risk": "기간 쌍을 두 사람 사이의 궁합으로 바꾸지 않는다.",
      "reversal": "새 연결을 작게 시험해 장기 관계를 보호할 수 있다.",
      "action": "연간 접점의 종료·재검토 시점을 정한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_saeun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:personality",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 32,
      "originalId": "tr:domain:dayun_wolun:personality",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "83e74705df3f9929bc0047ce9579e842b626c64bd4227c932b4cd8f02e40737a"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:personality",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "personality",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 역할의 부담과 이번 짧은 구간의 요구를 구별했는가?",
      "positive": "일시적 반응을 평생 성향으로 일반화하지 않는다.",
      "risk": "월운을 이유로 자기 능력 전체를 평가하지 않는다.",
      "reversal": "이번 조정이 장기 기준을 더 명확히 할 수 있다.",
      "action": "유지 기준 하나와 바꿀 행동 하나를 고른다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:career",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 33,
      "originalId": "tr:domain:dayun_wolun:career",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "93416aecd72ab61280fc91c91b13d9f29d2c043b894776e5b6b0d620225a7c26"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:career",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "career",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 업무 목표를 지키며 이번 구간의 배치를 어떻게 바꿀까?",
      "positive": "작은 배치 변경으로 유지 조건을 시험한다.",
      "risk": "교운 후보의 월운 충을 장기 실패로 쓰지 않는다.",
      "reversal": "일을 더 받기보다 순서를 바꾸는 편이 유효할 수 있다.",
      "action": "활성 대운 확정 구간에서 과제 순서를 비교한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 34,
      "originalId": "tr:domain:dayun_wolun:money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f8b49c012f262ca0c225b773638a43a5e63e888b885f6fc8e6ddef63a04c658e"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:money",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "money",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 고정 비용에 이번 구간의 추가 지출이 얹힐 여력이 있는가?",
      "positive": "짧은 기간 예산을 장기 한도와 연결한다.",
      "risk": "월운 합을 투자 시점 보장으로 쓰지 않는다.",
      "reversal": "이번 지출을 보류해 장기 선택지를 남길 수 있다.",
      "action": "구간 종료 전 확정해야 할 지출만 표시한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:study",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 35,
      "originalId": "tr:domain:dayun_wolun:study",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "083a8c09d5e2199ae62853eadf0bd8a18422b0df9bf7394813edcc13cf13b625"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:study",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "study",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "오래 배울 기능을 이번 구간의 어떤 작은 문제에서 시험할까?",
      "positive": "장기 학습을 작은 실행으로 검증한다.",
      "risk": "월간 십성을 역량 취득 완료로 해석하지 않는다.",
      "reversal": "잘 안 되는 부분의 확인도 유효한 결과다.",
      "action": "하나의 과제와 관찰 기준을 정한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:love",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 36,
      "originalId": "tr:domain:dayun_wolun:love",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d70aabb6b7a750297ede023b4c39ecee311c80ac84d541908c13d88b4eaf27e5"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:love",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "love",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "오래 유지할 관계 기준을 이번 구간 대화에서 어떻게 표현할까?",
      "positive": "일시 요구와 장기 약속을 구별한다.",
      "risk": "교운 범위의 두 후보를 두 번의 관계 위기로 쓰지 않는다.",
      "reversal": "지금 말하지 않을 부분을 정하는 것도 선택이다.",
      "action": "현재 확정된 요청에 한정해 대화한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 37,
      "originalId": "tr:domain:dayun_wolun:marriage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d38308f45506d787bdd215a535fd21ef716bb2ea77c020a8b8b2587bde2bac9f"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:marriage",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "marriage",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "공동 생활의 장기 분담을 이번 일정에 실제로 적용할 수 있는가?",
      "positive": "큰 분담을 짧은 일정에서 점검한다.",
      "risk": "월운으로 장기 혼인 결과를 판정하지 않는다.",
      "reversal": "작은 재분담이 큰 계획을 보존할 수 있다.",
      "action": "일정별 책임자와 지원 가능 시간을 확인한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:family",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 38,
      "originalId": "tr:domain:dayun_wolun:family",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "228e156270f5b235cc039ef7b6e3ca513be8dddfdb2783bb25e12c30a3c4350d"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:family",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "family",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "오래 맡는 가족 지원과 이번 구간의 추가 요청을 나눴는가?",
      "positive": "한시 지원을 장기 의무로 굳히지 않는다.",
      "risk": "월운을 가족의 건강·사고로 번역하지 않는다.",
      "reversal": "다른 사람의 도움을 연결해 지속성을 남길 수 있다.",
      "action": "한시 지원의 종료 조건을 합의한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:dayun_wolun:relationships",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 39,
      "originalId": "tr:domain:dayun_wolun:relationships",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "367e40e7e9f4f4c3923efffd29c2a28bc0e99a05fdc4f3b1cc523762a4539c8a"
    },
    "originalState": {
      "id": "tr:domain:dayun_wolun:relationships",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "dayun_wolun",
      "domain": "relationships",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "장기 관계 원칙과 이번 구간의 모임·협의가 맞는가?",
      "positive": "짧은 접점의 역할을 분명히 한다.",
      "risk": "월운 관계를 사람의 성품 판정으로 쓰지 않는다.",
      "reversal": "만남 횟수를 줄여도 필요한 협의는 유지될 수 있다.",
      "action": "실제 목적과 필요한 참여자만 확인한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:dayun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:personality",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 40,
      "originalId": "tr:domain:saeun_wolun:personality",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b0958d60b6dcb2cb7925c1f47fa7e88b8b1138942b02332fc48a528fc42a3025"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:personality",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "personality",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 방향을 이번 구간에 옮기며 어떤 반응을 관찰할까?",
      "positive": "연간 방향을 작은 행동으로 확인한다.",
      "risk": "월별 기분을 연간 성격의 증명으로 쓰지 않는다.",
      "reversal": "월간 반응이 달라도 연간 목표를 바로 포기할 필요는 없다.",
      "action": "실효 연주가 같은 구간에서 행동을 비교한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:career",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 41,
      "originalId": "tr:domain:saeun_wolun:career",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f9ce24d6b164c4162743f2fc80920404feebeeaa15a3b609ba07dfa9bffd70ac"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:career",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "career",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 과제의 이번 구간 산출과 승인 조건은 무엇인가?",
      "positive": "연간 목표를 실제 짧은 납품 단위로 나눈다.",
      "risk": "월운 합·충을 계약 성사·실패로 단정하지 않는다.",
      "reversal": "산출 크기를 줄이면 품질 확인이 쉬워질 수 있다.",
      "action": "구간별 산출·마감·승인을 나눈다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 42,
      "originalId": "tr:domain:saeun_wolun:money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "cbcf966331503e47460d329d4d4ad6a481a592379ee7c203e2e988822b99247f"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:money",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "money",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 자원 목표에서 이번 구간에 확정된 부분은 얼마인가?",
      "positive": "예상과 실제 확보의 차이를 짧게 확인한다.",
      "risk": "연월 재성을 수익률 예측으로 쓰지 않는다.",
      "reversal": "확보가 늦어지면 지출 순서를 바꿀 수 있다.",
      "action": "기간별 확정 자원과 지출 시점을 대응시킨다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:study",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 43,
      "originalId": "tr:domain:saeun_wolun:study",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "16c1b769289e819534321ca16c6e7aa03636b59b74da56ebdce8b3e4f767e0dc"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:study",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "study",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 학습 목표의 어떤 기능을 이번 구간에 확인할까?",
      "positive": "연간 범위를 작은 검증 과제로 나눈다.",
      "risk": "연월 인성의 반복을 합격 확률로 더하지 않는다.",
      "reversal": "복습이 새 진도보다 필요한 구간일 수 있다.",
      "action": "과제 하나와 피드백 시점을 정한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:love",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 44,
      "originalId": "tr:domain:saeun_wolun:love",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "90ce1132a0f356fa9d87db91c41ebdb70c82b5e05497eeb531eb2c77617f7e12"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:love",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "love",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 원하는 관계 방식이 이번 구간 실제 대화와 맞는가?",
      "positive": "연간 기대를 상대가 확인할 행동으로 표현한다.",
      "risk": "월주와 연주 관계를 상대 마음의 변화로 읽지 않는다.",
      "reversal": "기대를 줄이면 실제 합의가 더 선명해질 수 있다.",
      "action": "상대가 동의한 작은 행동만 확인한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 45,
      "originalId": "tr:domain:saeun_wolun:marriage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "16b4b116c9e6d6303c442ade6a2d056ffef79ecd30b09b7109dc578423941b22"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:marriage",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "marriage",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 공동 계획에서 이번 구간에 함께 결정할 것은 무엇인가?",
      "positive": "공동 계획의 실행 순서를 구체화한다.",
      "risk": "연월 합을 혼인·임신으로 예언하지 않는다.",
      "reversal": "결정을 나누면 부담을 줄이고 선택권을 남길 수 있다.",
      "action": "입춘 경계 양쪽을 같은 연간 근거로 묶지 않는다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:family",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 46,
      "originalId": "tr:domain:saeun_wolun:family",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "953682666d4470e8eeffb07e0c74de4c28fe7ecce8969fc5e67fbcc701d9afda"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:family",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "family",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 가족 지원 계획의 이번 구간 분담이 가능한가?",
      "positive": "일정과 실제 가용 자원을 맞춘다.",
      "risk": "연월 관계로 가족 사건을 꾸며내지 않는다.",
      "reversal": "한시적인 외부 지원이 계획을 유지할 수 있다.",
      "action": "당사자의 요청과 실제 가능한 시간을 확인한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:domain:saeun_wolun:relationships",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalDomains.ts",
      "exportName": "TEMPORAL_DOMAINS",
      "index": 47,
      "originalId": "tr:domain:saeun_wolun:relationships",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ff087224e6afb7239687bae34b262fbdd812ee6b66c8a5e707c5c2ea486e57da"
    },
    "originalState": {
      "id": "tr:domain:saeun_wolun:relationships",
      "class": "D",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "scope": "saeun_wolun",
      "domain": "relationships",
      "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
      "question": "올해 연결할 관계에서 이번 구간에 필요한 확인은 무엇인가?",
      "positive": "연간 목적에 맞는 접점을 작게 만든다.",
      "risk": "연월 쌍을 사람 간 궁합으로 옮기지 않는다.",
      "reversal": "새 연결보다 기존 약속 확인이 필요할 수 있다.",
      "action": "접점의 목적과 재검토 시각을 정한다.",
      "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
      "evidenceRequired": [
        "tr:scope:saeun_wolun",
        "참가자 소유자·기준 일간·적용 구간",
        "실제 분야 맥락과 자원·동의"
      ]
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WOOD:WOOD",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 0,
      "originalId": "tr:element:WOOD:WOOD",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "230458f40b012ca1c5c5988aea5d7748b5af699c556039b5591c9b7e10e5d203"
    },
    "originalState": {
      "id": "tr:element:WOOD:WOOD",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WOOD → WOOD",
      "meaning": "같은 목이 겹칠 때 새 확장과 기존 확장의 실제 자원 경쟁을 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WOOD",
      "right": "WOOD",
      "direction": "same",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WOOD:FIRE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 1,
      "originalId": "tr:element:WOOD:FIRE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "47d6b69465693dfdcb01bc49a9dddc05bb4475fa6cab84d237b70965459db4a6"
    },
    "originalState": {
      "id": "tr:element:WOOD:FIRE",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WOOD → FIRE",
      "meaning": "목에서 화로 이어지는 산출이 준비 자원을 소모하는 속도를 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WOOD",
      "right": "FIRE",
      "direction": "generates",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WOOD:EARTH",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 2,
      "originalId": "tr:element:WOOD:EARTH",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "cabe4d9a4cf15cc2c1d58baf3f1a154ef7dba2c06a7c0c38ada7e3ff9b873a45"
    },
    "originalState": {
      "id": "tr:element:WOOD:EARTH",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WOOD → EARTH",
      "meaning": "목극토의 제어 관계와 토 자원을 실제로 감당할 여력을 따로 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WOOD",
      "right": "EARTH",
      "direction": "controls",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WOOD:METAL",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 3,
      "originalId": "tr:element:WOOD:METAL",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6fef3fb6406b1053c7a9599b05d9eb85bc98d47b38aca4a52edd0f546b0dbbfb"
    },
    "originalState": {
      "id": "tr:element:WOOD:METAL",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WOOD → METAL",
      "meaning": "금극목에서 기준·정리가 확장 방향을 제한하는 조건을 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WOOD",
      "right": "METAL",
      "direction": "controlled_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WOOD:WATER",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 4,
      "originalId": "tr:element:WOOD:WATER",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2fcb1e79733e17ecc7301ee8da6f6599af42d50cbb6ec683e1243c004d7efd8e"
    },
    "originalState": {
      "id": "tr:element:WOOD:WATER",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WOOD → WATER",
      "meaning": "수생목의 공급이 실제로 이용 가능한 도움인지 축적만 되는지 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WOOD",
      "right": "WATER",
      "direction": "generated_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:FIRE:WOOD",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 5,
      "originalId": "tr:element:FIRE:WOOD",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "da959eb09702e3cfd3dabd3406ca93e96a11866634c7ef2cb8972bd78a1fd334"
    },
    "originalState": {
      "id": "tr:element:FIRE:WOOD",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "FIRE → WOOD",
      "meaning": "목생화에서 기반의 공급과 밖으로 드러나는 활동의 속도를 비교한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "FIRE",
      "right": "WOOD",
      "direction": "generated_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:FIRE:FIRE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 6,
      "originalId": "tr:element:FIRE:FIRE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "eaefd4729193f53f1454dc616bf4abb92ecbe158d23e7816dfb77a53e9bbc967"
    },
    "originalState": {
      "id": "tr:element:FIRE:FIRE",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "FIRE → FIRE",
      "meaning": "같은 화의 반복은 표현 기회의 증가와 소진 조건을 함께 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "FIRE",
      "right": "FIRE",
      "direction": "same",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:FIRE:EARTH",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 7,
      "originalId": "tr:element:FIRE:EARTH",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e9d32fd258308151ad27d1d3f9fcd89b8d0fec78853b30d37b1335d2cbfcf7bb"
    },
    "originalState": {
      "id": "tr:element:FIRE:EARTH",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "FIRE → EARTH",
      "meaning": "화생토에서 표현 뒤의 결과를 유지할 운영 기반이 있는지 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "FIRE",
      "right": "EARTH",
      "direction": "generates",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:FIRE:METAL",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 8,
      "originalId": "tr:element:FIRE:METAL",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "72a31139b99dedc15654af47b8e26fc1d12e00854645a78ddbcbe7ade8cdca05"
    },
    "originalState": {
      "id": "tr:element:FIRE:METAL",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "FIRE → METAL",
      "meaning": "화극금은 기준을 바꾸려는 활동과 필요한 규율의 보존을 나눠 본다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "FIRE",
      "right": "METAL",
      "direction": "controls",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:FIRE:WATER",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 9,
      "originalId": "tr:element:FIRE:WATER",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ffd0108994031bb7447ab36bf3b0193528c964e03853918bb4170d26f38a2c2d"
    },
    "originalState": {
      "id": "tr:element:FIRE:WATER",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "FIRE → WATER",
      "meaning": "수극화에서 제약이 표현을 막는지 속도를 조절하는지 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "FIRE",
      "right": "WATER",
      "direction": "controlled_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:EARTH:WOOD",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 10,
      "originalId": "tr:element:EARTH:WOOD",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3c4597dbe63cae25742bb87c1e4b353ad7ff82d4ef37ce5aec81597ab7e437fb"
    },
    "originalState": {
      "id": "tr:element:EARTH:WOOD",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "EARTH → WOOD",
      "meaning": "목극토에서 기존 기반을 조정할 요구와 보존할 기능을 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "EARTH",
      "right": "WOOD",
      "direction": "controlled_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:EARTH:FIRE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 11,
      "originalId": "tr:element:EARTH:FIRE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c350c28b40b3b6cec7d9561dcd299df0328350d6f4beaa72563b28806bab9213"
    },
    "originalState": {
      "id": "tr:element:EARTH:FIRE",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "EARTH → FIRE",
      "meaning": "화생토에서 들어오는 활동이 실제 유지 자원이 되는 조건을 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "EARTH",
      "right": "FIRE",
      "direction": "generated_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:EARTH:EARTH",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 12,
      "originalId": "tr:element:EARTH:EARTH",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "334800315bbf79f6dfc20a6d4583ceaf3f441b0bb91eee077215dddae60500bc"
    },
    "originalState": {
      "id": "tr:element:EARTH:EARTH",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "EARTH → EARTH",
      "meaning": "같은 토의 반복은 기반의 안정과 변화가 막히는 비용을 나눠 본다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "EARTH",
      "right": "EARTH",
      "direction": "same",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:EARTH:METAL",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 13,
      "originalId": "tr:element:EARTH:METAL",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d31ef91b387bae2a81d755cd09b68a4972314bff166fd3a2784ed2ea1c3fc961"
    },
    "originalState": {
      "id": "tr:element:EARTH:METAL",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "EARTH → METAL",
      "meaning": "토생금에서 축적 자원을 기준·도구로 옮기는 비용을 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "EARTH",
      "right": "METAL",
      "direction": "generates",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:EARTH:WATER",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 14,
      "originalId": "tr:element:EARTH:WATER",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0b864d79b93bf887bbc6fbcfdedf259444becd5c0b604043cd4811c333905af2"
    },
    "originalState": {
      "id": "tr:element:EARTH:WATER",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "EARTH → WATER",
      "meaning": "토극수에서 유동 자원을 묶는 관리와 필요한 흐름의 방해를 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "EARTH",
      "right": "WATER",
      "direction": "controls",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:METAL:WOOD",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 15,
      "originalId": "tr:element:METAL:WOOD",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "eb27f93af663af33e6e71df788fc89c4a95d2ea5241db29e4dcc4936ba7bb3fa"
    },
    "originalState": {
      "id": "tr:element:METAL:WOOD",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "METAL → WOOD",
      "meaning": "금극목에서 정리가 확장의 낭비를 줄이는지 가능성을 없애는지 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "METAL",
      "right": "WOOD",
      "direction": "controls",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:METAL:FIRE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 16,
      "originalId": "tr:element:METAL:FIRE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5fe586e587da06d171d389d0b83f7397936aa2e173602420ff11d06c952203d0"
    },
    "originalState": {
      "id": "tr:element:METAL:FIRE",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "METAL → FIRE",
      "meaning": "화극금에서 새 활동의 요구에 맞춰 기준을 수정할 여력을 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "METAL",
      "right": "FIRE",
      "direction": "controlled_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:METAL:EARTH",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 17,
      "originalId": "tr:element:METAL:EARTH",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1eee08f7f8a5fefdce90fd92a2ea91e401142ffcdfecc243d4ed00b8e54c88aa"
    },
    "originalState": {
      "id": "tr:element:METAL:EARTH",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "METAL → EARTH",
      "meaning": "토생금에서 기반 자원이 실제 판단 도구로 이어지는 조건을 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "METAL",
      "right": "EARTH",
      "direction": "generated_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:METAL:METAL",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 18,
      "originalId": "tr:element:METAL:METAL",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bbba75a250e0ec4673186e8ce92349ad13ad1911518e73cfe2e2448eff0cc969"
    },
    "originalState": {
      "id": "tr:element:METAL:METAL",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "METAL → METAL",
      "meaning": "같은 금의 반복은 정밀한 기준과 지나친 선별의 차이를 점검한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "METAL",
      "right": "METAL",
      "direction": "same",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:METAL:WATER",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 19,
      "originalId": "tr:element:METAL:WATER",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7d979b583706f1a0181202daabdf839c36abd6a552d966caf9e9a9004c0a9ab2"
    },
    "originalState": {
      "id": "tr:element:METAL:WATER",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "METAL → WATER",
      "meaning": "금생수에서 정리한 지식·도구를 순환시키는 통로를 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "METAL",
      "right": "WATER",
      "direction": "generates",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WATER:WOOD",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 20,
      "originalId": "tr:element:WATER:WOOD",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5d1352bed538a6aef30034be6f2c1d14b75f19a4683ae431405c731fee51c466"
    },
    "originalState": {
      "id": "tr:element:WATER:WOOD",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WATER → WOOD",
      "meaning": "수생목에서 정보·공급을 실제 확장으로 옮길 기반을 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WATER",
      "right": "WOOD",
      "direction": "generates",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WATER:FIRE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 21,
      "originalId": "tr:element:WATER:FIRE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2044692a29e47e2b77265c44ac1af93ef8adff15bda9f66cdf068d407a3a631d"
    },
    "originalState": {
      "id": "tr:element:WATER:FIRE",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WATER → FIRE",
      "meaning": "수극화에서 흐름의 조절이 필요한 표현을 끊지 않는지 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WATER",
      "right": "FIRE",
      "direction": "controls",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WATER:EARTH",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 22,
      "originalId": "tr:element:WATER:EARTH",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "728d0bda766c06ad4bcec7ddd41969da3ece86606b9284ee4d051385c9c7cc5e"
    },
    "originalState": {
      "id": "tr:element:WATER:EARTH",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WATER → EARTH",
      "meaning": "토극수에서 관리 조건과 유동성을 잃는 비용을 비교한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WATER",
      "right": "EARTH",
      "direction": "controlled_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WATER:METAL",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 23,
      "originalId": "tr:element:WATER:METAL",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "72cac88737ebb06c1d8b71be6ef9f0d4db138dce029fe8ce4c0ec88923b38a09"
    },
    "originalState": {
      "id": "tr:element:WATER:METAL",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WATER → METAL",
      "meaning": "금생수에서 기준이 정보의 질을 높이는지 탐색만 늘리는지 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WATER",
      "right": "METAL",
      "direction": "generated_by",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:element:WATER:WATER",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations.ts",
      "exportName": "TEMPORAL_ELEMENT_COMBINATIONS",
      "index": 24,
      "originalId": "tr:element:WATER:WATER",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "63bdd32c6bc1d328266846036d3ffbe0f675c4fb25e92c96fe2ed4e9a6898ebd"
    },
    "originalState": {
      "id": "tr:element:WATER:WATER",
      "class": "C",
      "sourceRefs": [
        "repo-elements",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "WATER → WATER",
      "meaning": "같은 수의 반복은 탐색 범위와 결정을 미루는 조건을 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
      "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
      "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
      "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
      "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
      "requires": [
        "실제 간·지 본기 오행",
        "양쪽 소유자와 적용 구간",
        "월령·통근·배합의 별도 근거",
        "현실 자원의 조건"
      ],
      "excludes": [
        "개수만으로 신강·신약 확정",
        "부족 오행 유입을 자동 호전으로 표현",
        "건강·재물 성공 확정"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "left": "WATER",
      "right": "WATER",
      "direction": "same",
      "strengthCalculated": false,
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 0,
      "originalId": "tr:god-pair:비견:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a0eac5c011bb35aebd375ce24e5e686e67c32bc4274c27cb5b9eeec7a569fcb3"
    },
    "originalState": {
      "id": "tr:god-pair:비견:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "peer>peer",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:비견"
      ],
      "question": "내 방식이 반복되는 해에는 독자 판단과 공동 기준을 어디서 나눌까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 1,
      "originalId": "tr:god-pair:비견:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "683542a0e44922b7b2d187ee0f8d19d8cca017413d69bbc85fb852fd930782ef"
    },
    "originalState": {
      "id": "tr:god-pair:비견:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "peer>peer",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:겁재"
      ],
      "question": "자율적인 장기 역할에서 공동 자원 사용 권한을 어떻게 조정할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 비견의 장기 운영과 겁재의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 2,
      "originalId": "tr:god-pair:비견:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "296b45119a5daa55e0138c31b1c42f27d71c625ca6820c49803f2b2053f354ff"
    },
    "originalState": {
      "id": "tr:god-pair:비견:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "peer>output",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:식신"
      ],
      "question": "독립적으로 쌓은 능력을 올해 반복 산출로 옮길 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 3,
      "originalId": "tr:god-pair:비견:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e04c28fa41decb58b1116fb520b2fd8589f296d7f219977ccad543901d64fd73"
    },
    "originalState": {
      "id": "tr:god-pair:비견:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "peer>output",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:상관"
      ],
      "question": "내 기준을 지키면서 낯선 제안을 검토하는 통로가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 4,
      "originalId": "tr:god-pair:비견:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "419a1df8781c2c768f2256fa6dfa8d7b6a3bfceb287cdaaf289a1a76874785c9"
    },
    "originalState": {
      "id": "tr:god-pair:비견:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "peer>resource",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:편재"
      ],
      "question": "스스로 결정할 장기 과제와 새 외부 제안의 범위를 나눴는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 5,
      "originalId": "tr:god-pair:비견:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "35e4549eb1e6defd8578c0e216a22d4f155cbb61e5d68fe3a928b34621ba3eb3"
    },
    "originalState": {
      "id": "tr:god-pair:비견:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "peer>resource",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:정재"
      ],
      "question": "내 방식의 실행 비용이 확정 예산에 반영됐는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 6,
      "originalId": "tr:god-pair:비견:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "76d8835be6e3a086363c24aee1febb071330f7ee866548f53f41743b4c50de1c"
    },
    "originalState": {
      "id": "tr:god-pair:비견:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "peer>constraint",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:편관"
      ],
      "question": "독자 결정권과 급한 외부 요구가 충돌하면 누구의 지원을 받을까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 7,
      "originalId": "tr:god-pair:비견:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5fb80880ffbf60e2b06b550ec85b2ed1ef3d7930f8ecd7bd64c87dfde12213c9"
    },
    "originalState": {
      "id": "tr:god-pair:비견:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "peer>constraint",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:정관"
      ],
      "question": "자율적인 수행을 공식 평가 기준으로 설명할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 8,
      "originalId": "tr:god-pair:비견:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fe48c90475c200ec90d469988bb4dee0fe55c574a0fa3c8aa60166a0a389ad06"
    },
    "originalState": {
      "id": "tr:god-pair:비견:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "peer>support",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:편인"
      ],
      "question": "내 판단이 막힌 부분을 다른 자료로 검토할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:비견:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 9,
      "originalId": "tr:god-pair:비견:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4c3ddd4af371966fa28f1f1186c06167b191f1c609a188fc6e47cba48bded431"
    },
    "originalState": {
      "id": "tr:god-pair:비견:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "비견",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "peer>support",
      "roleRefs": [
        "tr:god:비견",
        "tr:god:정인"
      ],
      "question": "독립 수행에 필요한 기초 지식을 어디서 보충할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "비견의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 10,
      "originalId": "tr:god-pair:겁재:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "db541940b5be37c362c233ea8b688b83d534cd1887e9444aae9158e3a9ad8213"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "peer>peer",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:비견"
      ],
      "question": "자원을 함께 쓰던 관계에서 올해 독자 책임을 어떻게 남길까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 겁재의 장기 운영과 비견의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 11,
      "originalId": "tr:god-pair:겁재:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "deb6ade01736855d449cadc7d3f64c29935607142268ea5b291d9e04857e7313"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "peer>peer",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:겁재"
      ],
      "question": "공유가 반복되는 해에는 기여와 배분을 같은 기준으로 보고 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 12,
      "originalId": "tr:god-pair:겁재:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "78304609d13bf19d31ab705001472bf90d75391232f336b4bde2293b16b1eeab"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "peer>output",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:식신"
      ],
      "question": "함께 가진 역량이 실제 산출로 이어질 분담이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 13,
      "originalId": "tr:god-pair:겁재:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fdb26d3ff419cba8c3dc79c75fefe0dcd40b8607cf18e8415a5ddcc4158366e4"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "peer>output",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:상관"
      ],
      "question": "공동 자원에 대한 불만을 대안과 함께 설명할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 14,
      "originalId": "tr:god-pair:겁재:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6e5003029f82b3874912fe907fe00723ea800de704527de69ec17f6fb067b0cd"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "peer>resource",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:편재"
      ],
      "question": "새 외부 연결의 이익과 비용을 누가 함께 부담하는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 15,
      "originalId": "tr:god-pair:겁재:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "157c3d7f6e0b2f54413e862109d8f2f3b8b3d4a016215cbb92c2ec7cf956bf58"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "peer>resource",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:정재"
      ],
      "question": "공동 지출과 개인 예산의 경계를 확인했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 16,
      "originalId": "tr:god-pair:겁재:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a72a25aa4c02fd72809f7835bfa5b152ceb240c12698179ba9321486668cd35b"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "peer>constraint",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:편관"
      ],
      "question": "협업 상황에서 급한 요구를 특정 사람에게 몰고 있지 않은가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 17,
      "originalId": "tr:god-pair:겁재:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1492cc546d884b03efafc1019c2fb42ee4cc5f06895f3bc15685240e9065ceba"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "peer>constraint",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:정관"
      ],
      "question": "공유의 관행과 공식 책임이 다르면 어떤 합의를 남길까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 18,
      "originalId": "tr:god-pair:겁재:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f1b77b7e4f31eb22e4bf4701c276ae5825b764a89c64275945aab3692013bae8"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "peer>support",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:편인"
      ],
      "question": "공동 판단에 빠진 전문 정보는 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:겁재:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 19,
      "originalId": "tr:god-pair:겁재:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "afe30b08b5b303e9e18fcead923ee009baf79d0a7d7290d20def719585cbd8a0"
    },
    "originalState": {
      "id": "tr:god-pair:겁재:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "겁재",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "peer>support",
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:정인"
      ],
      "question": "함께 배울 지원과 개인이 책임질 실행을 나눴는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "겁재의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 20,
      "originalId": "tr:god-pair:식신:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8a2e342843b9df3853291a15b985fff2e2cd7f73ac7901624d67eb9ae42acd2a"
    },
    "originalState": {
      "id": "tr:god-pair:식신:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "output>peer",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:비견"
      ],
      "question": "반복 생산 기반에서 독자적으로 바꿔도 되는 단위는 어디인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 21,
      "originalId": "tr:god-pair:식신:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5e0230d6307cca8c8fb96af288cbea1cbfdf3878b7c496d919a546e557afe620"
    },
    "originalState": {
      "id": "tr:god-pair:식신:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "output>peer",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:겁재"
      ],
      "question": "산출을 유지하면서 공동 자원의 사용 규칙을 조정할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 22,
      "originalId": "tr:god-pair:식신:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f6db4059d3235ced5064cedddbc7f1c5db3d674adde953c7ac118b98a08d9f39"
    },
    "originalState": {
      "id": "tr:god-pair:식신:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "output>output",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:식신"
      ],
      "question": "산출이 반복되는 해에는 양보다 유지 비용을 먼저 측정했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 23,
      "originalId": "tr:god-pair:식신:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9ab5e441777ef2018738695843b59a942361941f9bef5b8eca59700dc94e6e36"
    },
    "originalState": {
      "id": "tr:god-pair:식신:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "output>output",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:상관"
      ],
      "question": "꾸준한 생산과 새 표현의 실험을 어떻게 분리할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 식신의 장기 운영과 상관의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 24,
      "originalId": "tr:god-pair:식신:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e2ca1f354ba16b3dad3f1da72a75cb4b76c82e7334dc67416ae0287d3b189635"
    },
    "originalState": {
      "id": "tr:god-pair:식신:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "output>resource",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:편재"
      ],
      "question": "외부 제안이 기존 생산 용량을 넘는지 확인했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 25,
      "originalId": "tr:god-pair:식신:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "aaedb7d18fda2e736a42c666fd9b8304dbf67e14e134d78c7f0d57b234a98d76"
    },
    "originalState": {
      "id": "tr:god-pair:식신:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "output>resource",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:정재"
      ],
      "question": "생산물의 가격과 실제 유지 비용을 함께 계산했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 26,
      "originalId": "tr:god-pair:식신:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f43739f446266bac0894bbd031b572ff66345a757b88861240b5172b4cceef9e"
    },
    "originalState": {
      "id": "tr:god-pair:식신:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "output>constraint",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:편관"
      ],
      "question": "급한 요구가 지속 가능한 생산 리듬을 해치고 있지 않은가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 27,
      "originalId": "tr:god-pair:식신:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1106fb050c73ce25b90f03e04af0dde663b06c2ff220581a86ab07841b9a9dbd"
    },
    "originalState": {
      "id": "tr:god-pair:식신:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "output>constraint",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:정관"
      ],
      "question": "산출물의 품질을 공식 기준으로 증명할 방법이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 28,
      "originalId": "tr:god-pair:식신:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "008375a5eff99cfb116a3f6e7d2581cb6d8971f97597ca7a1ded8fd80a4e9c26"
    },
    "originalState": {
      "id": "tr:god-pair:식신:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "output>support",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:편인"
      ],
      "question": "다른 관점을 넣어도 기존 생산 품질을 확인할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:식신:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 29,
      "originalId": "tr:god-pair:식신:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6d0e570a5c9fe96aa4acde1a9b4e55634fbbc5577299819cf90b99b7ffcd81e6"
    },
    "originalState": {
      "id": "tr:god-pair:식신:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "식신",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "output>support",
      "roleRefs": [
        "tr:god:식신",
        "tr:god:정인"
      ],
      "question": "반복 생산을 돕는 지식을 문서로 남길 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "식신의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 30,
      "originalId": "tr:god-pair:상관:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "18f0609c7c44bcb99a9e022780891bc68a77835bf8629cfe17c9a87e4af460d9"
    },
    "originalState": {
      "id": "tr:god-pair:상관:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "output>peer",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:비견"
      ],
      "question": "관행을 바꾸는 장기 과제에서 올해 지킬 자기 기준은 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 31,
      "originalId": "tr:god-pair:상관:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "72ca5e01a16a451f776c796250249198898ba1ba325de84003d50369d5d0ba9b"
    },
    "originalState": {
      "id": "tr:god-pair:상관:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "output>peer",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:겁재"
      ],
      "question": "새 제안의 비용과 기여를 공동 참여자와 나눴는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 32,
      "originalId": "tr:god-pair:상관:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3f848c638e2c366d93e1f4d6760ef3969fb3bd55b420eb9f9ad7d91b598a1950"
    },
    "originalState": {
      "id": "tr:god-pair:상관:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "output>output",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:식신"
      ],
      "question": "새로운 설명을 반복 가능한 산출로 정리할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 상관의 장기 운영과 식신의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 33,
      "originalId": "tr:god-pair:상관:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ebee9ba350f549c58f4c4f4097df30cda5fe2d70b9cfc822d2095d2e9f8ffab8"
    },
    "originalState": {
      "id": "tr:god-pair:상관:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "output>output",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:상관"
      ],
      "question": "변경 제안이 반복되면 무엇을 시험하고 무엇을 보류할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 34,
      "originalId": "tr:god-pair:상관:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9638d4455086c45b589ae7531bae64dd9753b22ae9408fdaf4fe7fd28e90583e"
    },
    "originalState": {
      "id": "tr:god-pair:상관:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "output>resource",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편재"
      ],
      "question": "새 아이디어에 붙은 외부 기회의 실행 조건은 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 35,
      "originalId": "tr:god-pair:상관:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9489b25547e93df7e68725dbade70f78bfb0a9a5a90faed2d2e3d87f1e5e326a"
    },
    "originalState": {
      "id": "tr:god-pair:상관:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "output>resource",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정재"
      ],
      "question": "관행을 바꾸는 비용이 기존 자원 운영을 해치지 않는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 36,
      "originalId": "tr:god-pair:상관:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c75f1ed13fdc2cc3ccd5fe875cd8a74748beb289c5d2bb7c0aba507eecc28cc9"
    },
    "originalState": {
      "id": "tr:god-pair:상관:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "output>constraint",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편관"
      ],
      "question": "비판과 강한 요구가 만나면 해결 권한을 누가 갖는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 37,
      "originalId": "tr:god-pair:상관:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9b4de4023fc9c3a2b781257b3d951003b74ce46a44b479fa0c6b2f307756c91d"
    },
    "originalState": {
      "id": "tr:god-pair:상관:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "output>constraint",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정관"
      ],
      "question": "새 제안을 기존 규정과 비교할 공통 언어가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 38,
      "originalId": "tr:god-pair:상관:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c6fff1d049e7b42788112a3da4996afab2a3caec11a325fbaf3f258a1ad5a417"
    },
    "originalState": {
      "id": "tr:god-pair:상관:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "output>support",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편인"
      ],
      "question": "다른 관점끼리 맞지 않을 때 검증할 질문을 좁혔는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:상관:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 39,
      "originalId": "tr:god-pair:상관:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1d7536d64a81ae0ef69f6326a8b43ed36dcc869d0906b733258491ce6b78f3d3"
    },
    "originalState": {
      "id": "tr:god-pair:상관:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "상관",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "output>support",
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정인"
      ],
      "question": "새 설명이 기반 지식과 어떻게 다른지 확인했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "상관의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 40,
      "originalId": "tr:god-pair:편재:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c5ca15f420dc7f3dce81828ce6eda64f7382d70e63701eb46c753cac3b817ff2"
    },
    "originalState": {
      "id": "tr:god-pair:편재:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "resource>peer",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:비견"
      ],
      "question": "넓혀 온 외부 연결 중 올해 직접 책임질 것은 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 41,
      "originalId": "tr:god-pair:편재:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "eff0af061fefcd84c590b3eba229f047a63d52e77927e52b2719c8d394cb0f00"
    },
    "originalState": {
      "id": "tr:god-pair:편재:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "resource>peer",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:겁재"
      ],
      "question": "외부 기회가 공동 자원에 얹는 부담을 나눴는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 42,
      "originalId": "tr:god-pair:편재:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5a4c8f65ed0d9a80de30d082a37600c4f22df1f611364ef29f2006c680afb8b9"
    },
    "originalState": {
      "id": "tr:god-pair:편재:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "resource>output",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:식신"
      ],
      "question": "연결의 다양성을 실제 납품 가능한 생산으로 바꿀 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 43,
      "originalId": "tr:god-pair:편재:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2225c899fcca1cc88ca37fa4db13142fe59f2da4f452a17cd22011899228d2d2"
    },
    "originalState": {
      "id": "tr:god-pair:편재:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "resource>output",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:상관"
      ],
      "question": "새 제안의 매력을 비판적으로 설명할 기준이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 44,
      "originalId": "tr:god-pair:편재:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d1a765092c38cdebc40705088f1a6f58bf8e70b92e3240b95a563d7ba047cab3"
    },
    "originalState": {
      "id": "tr:god-pair:편재:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "resource>resource",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:편재"
      ],
      "question": "기회가 반복되면 확장보다 선택 기준이 필요한가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 45,
      "originalId": "tr:god-pair:편재:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fa0c92bf7bc2eecc777752a8e2bd548c87781e4ca4627859c51fb10e2c0fe6b5"
    },
    "originalState": {
      "id": "tr:god-pair:편재:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "resource>resource",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정재"
      ],
      "question": "새 자원을 기존 예산 안에서 유지할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 편재의 장기 운영과 정재의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 46,
      "originalId": "tr:god-pair:편재:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f7b1478febdc9d40814869898bb137830d08594a4fe332064fdc973541d37500"
    },
    "originalState": {
      "id": "tr:god-pair:편재:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "resource>constraint",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:편관"
      ],
      "question": "외부 제안의 급한 요구를 감당할 지원이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 47,
      "originalId": "tr:god-pair:편재:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "77db15c5d93837ec01d92c250d804ab80f69b51bef83660767312dfa5910c161"
    },
    "originalState": {
      "id": "tr:god-pair:편재:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "resource>constraint",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정관"
      ],
      "question": "유연한 연결을 공식 약속으로 바꿀 준비가 됐는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 48,
      "originalId": "tr:god-pair:편재:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "47212860f2527b518f1ad3dc52014f5a0c7b6404ebb77dc00e8dc39344e2b59e"
    },
    "originalState": {
      "id": "tr:god-pair:편재:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "resource>support",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:편인"
      ],
      "question": "새 연결을 판단할 정보의 사각지대는 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편재:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 49,
      "originalId": "tr:god-pair:편재:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d0cea1550f5c4d07adb68508a56a1c479059f31e1b3da95d0c277ff445a7f56e"
    },
    "originalState": {
      "id": "tr:god-pair:편재:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편재",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "resource>support",
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정인"
      ],
      "question": "외부 기회를 활용하기 전에 배울 기반이 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편재의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 50,
      "originalId": "tr:god-pair:정재:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6421ff3c853cdae81076ff43f1f1b1af26e62e8a4e54ea47405187a1b24206a9"
    },
    "originalState": {
      "id": "tr:god-pair:정재:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "resource>peer",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:비견"
      ],
      "question": "정해진 자원 안에서 올해 개인이 결정할 범위는 어디인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 51,
      "originalId": "tr:god-pair:정재:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "80b4caf474c81b070b392a132f755e16e18bab4653cb2c93f4a541300073e6da"
    },
    "originalState": {
      "id": "tr:god-pair:정재:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "resource>peer",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:겁재"
      ],
      "question": "안정적 운영과 공동 사용의 배분 기준이 같은가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 52,
      "originalId": "tr:god-pair:정재:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "aa305cfd29c23c6594d8b08635d0614d775e9d550a113ddb151d54cb2fc2837a"
    },
    "originalState": {
      "id": "tr:god-pair:정재:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "resource>output",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:식신"
      ],
      "question": "관리 중인 자원을 꾸준한 산출에 어떻게 투입할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 53,
      "originalId": "tr:god-pair:정재:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7b6018c12657b721c64a558b2f3e6a03a5f82d52e97fb3403112dd14a423150b"
    },
    "originalState": {
      "id": "tr:god-pair:정재:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "resource>output",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:상관"
      ],
      "question": "정해진 예산의 전제를 재검토할 이유가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 54,
      "originalId": "tr:god-pair:정재:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2e1654e0e4ab457d50062d73165040914469a93f8594cb662c50b827a65bcef8"
    },
    "originalState": {
      "id": "tr:god-pair:정재:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "resource>resource",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편재"
      ],
      "question": "안정적 기반을 지키면서 탐색에 쓸 한도는 얼마인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 정재의 장기 운영과 편재의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 55,
      "originalId": "tr:god-pair:정재:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "76a2a4608f481fe86a59aee77dec67d4774d5eea287217e0909ab64e14b6d883"
    },
    "originalState": {
      "id": "tr:god-pair:정재:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "resource>resource",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정재"
      ],
      "question": "관리 체계가 반복되면 누수와 과도한 통제를 함께 점검했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 56,
      "originalId": "tr:god-pair:정재:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a27055512560b6305a61c6fc070eefc93925f7b5b1c4c3760cd3dac3029e6458"
    },
    "originalState": {
      "id": "tr:god-pair:정재:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "resource>constraint",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편관"
      ],
      "question": "추가 요구가 확정 자원을 초과하면 무엇을 줄일까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 57,
      "originalId": "tr:god-pair:정재:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6c6b4a3f2fff98663e843db6dca41c59e07b9a473dc98177cb85655095e1f2ed"
    },
    "originalState": {
      "id": "tr:god-pair:정재:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "resource>constraint",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정관"
      ],
      "question": "운영 책임을 평가 기준과 맞출 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 58,
      "originalId": "tr:god-pair:정재:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fa10cc6c3a36dbc77b77836be55bd1f719882aa07b47ab3921837bcba774c101"
    },
    "originalState": {
      "id": "tr:god-pair:정재:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "resource>support",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편인"
      ],
      "question": "장부에 드러나지 않는 운영 가정을 조사할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정재:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 59,
      "originalId": "tr:god-pair:정재:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b003ecb7d2cf7a152a769ca9536400a364fd6658e57990c5b4d4fb044b40bde1"
    },
    "originalState": {
      "id": "tr:god-pair:정재:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정재",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "resource>support",
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정인"
      ],
      "question": "기반 자원의 관리 지식을 다른 사람도 쓸 수 있게 남겼는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정재의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 60,
      "originalId": "tr:god-pair:편관:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b653e7cdccf379f54d5c24da7645a26ff1417f189be0d30e581c4c00b7b93628"
    },
    "originalState": {
      "id": "tr:god-pair:편관:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>peer",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:비견"
      ],
      "question": "집중된 요구 속에서도 개인이 거절할 경계를 정했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 61,
      "originalId": "tr:god-pair:편관:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8608ec1578b8897c8d176c68502d29d7093a7b4af61277f8e4926470ffa35045"
    },
    "originalState": {
      "id": "tr:god-pair:편관:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>peer",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:겁재"
      ],
      "question": "강한 요구의 비용을 공동 참여자에게 어떻게 배분할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 62,
      "originalId": "tr:god-pair:편관:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7675830036b0fe2d1b29141f7234b8c183dd3d8c2c9d4ae12483ccc5f72eeed4"
    },
    "originalState": {
      "id": "tr:god-pair:편관:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>output",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:식신"
      ],
      "question": "긴장 속에서 유지할 최소 산출과 회복 시간을 정했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 63,
      "originalId": "tr:god-pair:편관:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8cad3b505b040e15d3e5d888aaa78373da55a018222c3a28816c91024844ed74"
    },
    "originalState": {
      "id": "tr:god-pair:편관:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>output",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:상관"
      ],
      "question": "급한 요구의 전제를 비판할 안전한 통로가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 64,
      "originalId": "tr:god-pair:편관:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "267a46025aa9b76964b3f5b58682153c23037ee91d57b20265f33257970602c4"
    },
    "originalState": {
      "id": "tr:god-pair:편관:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>resource",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:편재"
      ],
      "question": "추가 외부 기회가 기존 부담을 키우지 않는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 65,
      "originalId": "tr:god-pair:편관:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9d3ea4386a5d63bc0cd9ae94139ef3ad1387743cd6d4f222ce864586c740ded8"
    },
    "originalState": {
      "id": "tr:god-pair:편관:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>resource",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:정재"
      ],
      "question": "집중된 과제의 비용을 확정 자원으로 감당할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 66,
      "originalId": "tr:god-pair:편관:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "203f55de28776a4417b24335791b9eac513d2bae65559d034daa3276c39ced05"
    },
    "originalState": {
      "id": "tr:god-pair:편관:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>constraint",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:편관"
      ],
      "question": "강한 요구가 반복되면 지원과 중단 기준이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 67,
      "originalId": "tr:god-pair:편관:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e6822849e723ff88b4e41ed74912d0c34859a293a701097eaabc187a2fa3650a"
    },
    "originalState": {
      "id": "tr:god-pair:편관:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>constraint",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:정관"
      ],
      "question": "즉각적인 요구와 공식 절차의 우선순위를 나눴는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 편관의 장기 운영과 정관의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 68,
      "originalId": "tr:god-pair:편관:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4d9f0e3e217831c3eb20700e2f2cd220b6b6e8b30c61cf3fa9c5c75f6b2eca58"
    },
    "originalState": {
      "id": "tr:god-pair:편관:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>support",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:편인"
      ],
      "question": "대응 방식이 막히면 다른 관점으로 검증할 문제가 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편관:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 69,
      "originalId": "tr:god-pair:편관:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "51a271b6caac9458cf705fbb4d04addd05e9161cfd8a9f30e9d216b55d100bef"
    },
    "originalState": {
      "id": "tr:god-pair:편관:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편관",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>support",
      "roleRefs": [
        "tr:god:편관",
        "tr:god:정인"
      ],
      "question": "긴장을 줄이는 데 실제 이용 가능한 지식과 지원이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편관의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 70,
      "originalId": "tr:god-pair:정관:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "61f1c5ba38143f812df7089800b34bf55a5621732ff96f4e2b2d794526d01bc2"
    },
    "originalState": {
      "id": "tr:god-pair:정관:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>peer",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:비견"
      ],
      "question": "공적 책임 안에서 독자 판단이 허용되는 부분은 어디인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 71,
      "originalId": "tr:god-pair:정관:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8a91917117e3fe0361adabaca2843b446146f293a1dbb416bf5b85246dc3818a"
    },
    "originalState": {
      "id": "tr:god-pair:정관:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>peer",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:겁재"
      ],
      "question": "공식 책임과 공동 기여의 배분이 맞는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 72,
      "originalId": "tr:god-pair:정관:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0068b5b72b9d3d2b53aca95eb023345a6a3b1d4deb1932d371d7da5a2848efeb"
    },
    "originalState": {
      "id": "tr:god-pair:정관:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>output",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:식신"
      ],
      "question": "정해진 기준을 반복 산출의 절차로 만들 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 73,
      "originalId": "tr:god-pair:정관:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "98e1b8b33001eb5ffe229fc8179ec910929e3132a62de2b5a096fd3e5b311c2b"
    },
    "originalState": {
      "id": "tr:god-pair:정관:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>output",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:상관"
      ],
      "question": "새 제안과 현행 규정의 차이를 검토할 자리가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 74,
      "originalId": "tr:god-pair:정관:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "07bcd049c4e19b038e35e1fda468d5089762f55155723c5d69e879cb24ed1156"
    },
    "originalState": {
      "id": "tr:god-pair:정관:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>resource",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:편재"
      ],
      "question": "외부 기회를 맡기 전에 공식 책임 범위를 확인했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 75,
      "originalId": "tr:god-pair:정관:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7914e74db652474783e0059b651c95f351d870cb0ee383e533cc4caf12a42d5b"
    },
    "originalState": {
      "id": "tr:god-pair:정관:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>resource",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:정재"
      ],
      "question": "공적 약속을 수행할 확정 자원이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 76,
      "originalId": "tr:god-pair:정관:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7739a4a18aff8887946ac31e279807612ef81690c4d55061d393680cd65e9c30"
    },
    "originalState": {
      "id": "tr:god-pair:정관:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>constraint",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:편관"
      ],
      "question": "추가 압박과 기존 책임이 겹치면 승인권은 누구에게 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 정관의 장기 운영과 편관의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 77,
      "originalId": "tr:god-pair:정관:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c52bff8d460b25d8c4db8020516fd0b08c19f5e3311ed8b5942ece6f17b88f12"
    },
    "originalState": {
      "id": "tr:god-pair:정관:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>constraint",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:정관"
      ],
      "question": "기준이 반복되는 해에는 실제 목적과 형식이 일치하는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 78,
      "originalId": "tr:god-pair:정관:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9743f430197ed3890a15e208183787d4e09052b33279c2502183f26b0e6bdee7"
    },
    "originalState": {
      "id": "tr:god-pair:정관:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>support",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:편인"
      ],
      "question": "공식 기준이 설명하지 못하는 예외를 조사할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 편인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정관:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 79,
      "originalId": "tr:god-pair:정관:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b051a6899cae6ea0defdc048b64bb71fb155f53ce1a67c838984310fec3dad5e"
    },
    "originalState": {
      "id": "tr:god-pair:정관:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정관",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "constraint>support",
      "roleRefs": [
        "tr:god:정관",
        "tr:god:정인"
      ],
      "question": "책임 수행에 필요한 교육과 지원을 실제 받을 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정관의 장기 기능을 지우지 않고 정인의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 80,
      "originalId": "tr:god-pair:편인:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3b924f3c75deb5021f9f71ea8266262e35a63d770110f429306c11cd5565abdb"
    },
    "originalState": {
      "id": "tr:god-pair:편인:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "support>peer",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:비견"
      ],
      "question": "다른 관점을 탐색하면서 올해 직접 검증할 가설은 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 81,
      "originalId": "tr:god-pair:편인:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d2d494457ffd9e27944ad6d37e9da8b79349568b01bf8a44889e0f3ec16fdc77"
    },
    "originalState": {
      "id": "tr:god-pair:편인:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "support>peer",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:겁재"
      ],
      "question": "특화된 정보의 공유 권한과 해석 책임을 나눴는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 82,
      "originalId": "tr:god-pair:편인:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "41180b17485308f72e1f5586a1daa964d5726cb1b8546a6ee02487280021f4a9"
    },
    "originalState": {
      "id": "tr:god-pair:편인:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "support>output",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:식신"
      ],
      "question": "새 관점을 반복 가능한 결과물로 시험할 수 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 83,
      "originalId": "tr:god-pair:편인:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "28d90ca3c5bbf90320917edee45f30b48154543ced90a135f2e6c01ee758fdb3"
    },
    "originalState": {
      "id": "tr:god-pair:편인:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "support>output",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:상관"
      ],
      "question": "새 설명끼리 경쟁하면 반례를 무엇으로 확인할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 84,
      "originalId": "tr:god-pair:편인:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "47f7fcbf12fbe3348ec34c846ba8d8056a1507ab71f8643b92b37b4f5dc53cbd"
    },
    "originalState": {
      "id": "tr:god-pair:편인:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "support>resource",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편재"
      ],
      "question": "외부 제안의 낯선 부분을 자료로 확인했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 85,
      "originalId": "tr:god-pair:편인:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c4920f58dac3a3370c73cb3d44d1de17e2df0cc6d80c71a0995b6b70ba48a400"
    },
    "originalState": {
      "id": "tr:god-pair:편인:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "support>resource",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정재"
      ],
      "question": "탐색을 계속할 비용을 기존 자원 안에서 제한했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 86,
      "originalId": "tr:god-pair:편인:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "86ce7cf400763aa5f7c4f0ae05a5905dcbe33004e6a6ded666a99a172330d692"
    },
    "originalState": {
      "id": "tr:god-pair:편인:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "support>constraint",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편관"
      ],
      "question": "급한 요구를 받았을 때 확인하지 않은 가설을 결론으로 쓰지 않는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 87,
      "originalId": "tr:god-pair:편인:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4e5f1364d2a0cc1d5e713367354a2257d90633df09700758b8cca13edea7b29d"
    },
    "originalState": {
      "id": "tr:god-pair:편인:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "support>constraint",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정관"
      ],
      "question": "다른 관점을 공식 기준으로 검토할 절차가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "편인의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 88,
      "originalId": "tr:god-pair:편인:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "40abb6048d13d6f1b2b6abb5a7c8ec8d8d6565e63b3a4768bdcd36109264a32d"
    },
    "originalState": {
      "id": "tr:god-pair:편인:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "support>support",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편인"
      ],
      "question": "새 정보가 반복되면 탐색을 멈추고 시험할 시점인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:편인:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 89,
      "originalId": "tr:god-pair:편인:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d581ff20c6d24ec21c36ad3b21d66209716e7242722ce688dde44a50100c4fed"
    },
    "originalState": {
      "id": "tr:god-pair:편인:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "편인",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "support>support",
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정인"
      ],
      "question": "특화된 관점을 기반 지식과 연결할 설명이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 편인의 장기 운영과 정인의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 90,
      "originalId": "tr:god-pair:정인:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3a93600d543239d5039cc9ce8a39121985dc27fec5150606531c7c61fd7630ec"
    },
    "originalState": {
      "id": "tr:god-pair:정인:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "비견",
      "reference": "natal_day_master_both",
      "groupPair": "support>peer",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:비견"
      ],
      "question": "받은 지원을 활용하면서 올해 스스로 책임질 실행은 무엇인가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 비견의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 91,
      "originalId": "tr:god-pair:정인:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "875cc234450b7abd092921628e5ff0430d4025b5e2e482b1554e4cb4ff35b263"
    },
    "originalState": {
      "id": "tr:god-pair:정인:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "겁재",
      "reference": "natal_day_master_both",
      "groupPair": "support>peer",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:겁재"
      ],
      "question": "지원 자원을 함께 쓰는 사람과 이용 조건을 합의했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 겁재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 92,
      "originalId": "tr:god-pair:정인:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8b757fc2ac55ce209e01096476128f96519b499f3aabfd46b7774a4fa5ca23d6"
    },
    "originalState": {
      "id": "tr:god-pair:정인:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "식신",
      "reference": "natal_day_master_both",
      "groupPair": "support>output",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:식신"
      ],
      "question": "배운 것을 반복 산출로 바꿀 작은 실험이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 식신의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 93,
      "originalId": "tr:god-pair:정인:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ec3c42dbfc49672bc1566a5c650966e9eb2ad86e721c126bf0d3b35408ee8891"
    },
    "originalState": {
      "id": "tr:god-pair:정인:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "상관",
      "reference": "natal_day_master_both",
      "groupPair": "support>output",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:상관"
      ],
      "question": "기초 지식의 전제를 재검토할 근거가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 상관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 94,
      "originalId": "tr:god-pair:정인:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0846799e0cdf7d91d40f292f36388e2d8060f5ef96a39fb9e1150b6e3290d53b"
    },
    "originalState": {
      "id": "tr:god-pair:정인:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "편재",
      "reference": "natal_day_master_both",
      "groupPair": "support>resource",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:편재"
      ],
      "question": "새 기회를 활용하기에 기존 학습과 지원이 충분한가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 편재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 95,
      "originalId": "tr:god-pair:정인:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "15abad5ca3e825a9bb0d28e6d6559240c7706ef6d6125f59f61f7ea933f704ef"
    },
    "originalState": {
      "id": "tr:god-pair:정인:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "정재",
      "reference": "natal_day_master_both",
      "groupPair": "support>resource",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:정재"
      ],
      "question": "교육·지원에 쓸 비용과 확보한 자원을 구분했는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 정재의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 96,
      "originalId": "tr:god-pair:정인:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bb2800aa6d45689ca83a84cc089b87be0f3e476268b8fd8847add9f664abe79f"
    },
    "originalState": {
      "id": "tr:god-pair:정인:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "편관",
      "reference": "natal_day_master_both",
      "groupPair": "support>constraint",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:편관"
      ],
      "question": "강한 요구 앞에서 도움을 요청할 실제 경로가 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 편관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 97,
      "originalId": "tr:god-pair:정인:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "46a1504ca22ac9d715733094ae4ee7daec077f7cdde12bd237c7f73e10b58c3b"
    },
    "originalState": {
      "id": "tr:god-pair:정인:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "정관",
      "reference": "natal_day_master_both",
      "groupPair": "support>constraint",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:정관"
      ],
      "question": "배운 내용을 공식 평가에 적용할 기준이 있는가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "정인의 장기 기능을 지우지 않고 정관의 연간 기능과 역할을 나눈다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 98,
      "originalId": "tr:god-pair:정인:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "21fc396e13accc995a1c7475a474bfabb3b640f9ec7e64f320c3394535023023"
    },
    "originalState": {
      "id": "tr:god-pair:정인:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "편인",
      "reference": "natal_day_master_both",
      "groupPair": "support>support",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:편인"
      ],
      "question": "기초 학습과 특화 탐색을 어떤 순서로 할까?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 기능군 안에서 정인의 장기 운영과 편인의 올해 처리 방식을 구별한다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god-pair:정인:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations.ts",
      "exportName": "TEMPORAL_GOD_COMBINATIONS",
      "index": 99,
      "originalId": "tr:god-pair:정인:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "be25b7dff6e976c90901da98a759c281d217b55f9baa06c599733c958eeeb3b3"
    },
    "originalState": {
      "id": "tr:god-pair:정인:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "dayunGod": "정인",
      "annualGod": "정인",
      "reference": "natal_day_master_both",
      "groupPair": "support>support",
      "roleRefs": [
        "tr:god:정인",
        "tr:god:정인"
      ],
      "question": "학습이 반복되면 추가 준비보다 실행이 필요한가?",
      "condition": "두 십성 모두 실제 원국 일간 기준일 때만 검토한다. 강약·배합·실제 생활 정보가 없으면 질문 이상으로 승격하지 않는다.",
      "distinction": "같은 십성의 재등장으로 주제의 반복을 검토하되 힘이나 길흉을 두 배로 더하지 않는다.",
      "notIndependentFact": true
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:비견",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 0,
      "originalId": "tr:god:비견",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "919bb133baec54197fba1fff05feeb8abe8490a9d59144651968ee4b7cf80320"
    },
    "originalState": {
      "id": "tr:god:비견",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "비견",
      "group": "peer",
      "traditionalRef": "자기 기준과 동등한 주체; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "자기 방식과 동료 간 경계를 여러 해 유지할 기반",
      "saeun": "올해 독자 결정과 공동 결정의 경계를 검토",
      "wolun": "이번 구간 혼자 끝낼 일과 함께 나눌 일을 구별",
      "positive": "자율적인 수행 단위를 만든다.",
      "risk": "독립성을 고집해 협의 비용을 상대에게 넘길 수 있다.",
      "reversal": "도움을 받는 선택도 자율성의 포기가 아닐 수 있다.",
      "extraEvidence": "실제 협업 구조·권한"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:겁재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 1,
      "originalId": "tr:god:겁재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9863d8642beb06774fa12710950d04a4b6581e431a25de663f5c26dabc8a3e0a"
    },
    "originalState": {
      "id": "tr:god:겁재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "겁재",
      "group": "peer",
      "traditionalRef": "동류와 자원의 공유·경쟁; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "협력 자원과 배분 규칙을 지속적으로 재점검",
      "saeun": "올해 공동 자원의 비용과 기여를 따로 확인",
      "wolun": "이번 구간 시간·비용을 같이 쓰는 범위를 좁힘",
      "positive": "함께 쓰는 자원의 활용 범위를 넓힐 수 있다.",
      "risk": "경쟁·분배를 도난이나 배신 사건으로 단정하지 않는다.",
      "reversal": "분담을 줄이는 편이 협업을 오래 유지할 수도 있다.",
      "extraEvidence": "실제 소유권·배분 약속"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:식신",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 2,
      "originalId": "tr:god:식신",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "333338cea579b6134c53c7a46065d5acb290b4d52e7b18303fa77a6ac7d3c19b"
    },
    "originalState": {
      "id": "tr:god:식신",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "식신",
      "group": "output",
      "traditionalRef": "지속적으로 밖에 내놓는 산출; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "축적한 능력을 반복 가능한 생산 방식으로 유지",
      "saeun": "올해 결과물을 지속할 공급과 품질 확인",
      "wolun": "이번 구간 작은 산출물의 완성·휴식 리듬 관찰",
      "positive": "한 번의 성과보다 재현 가능한 방식에 강점을 둔다.",
      "risk": "생산량 증가만으로 보상이나 건강을 보장하지 않는다.",
      "reversal": "생산량을 줄여 품질을 남기는 선택을 검토한다.",
      "extraEvidence": "실제 산출·유지 비용"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:상관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 3,
      "originalId": "tr:god:상관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e67b38c01e2c59119d4252dbfd51b9cdee47345be660b38ccad65c2f14f83336"
    },
    "originalState": {
      "id": "tr:god:상관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "상관",
      "group": "output",
      "traditionalRef": "기존 기준 밖의 표현과 재검토; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "축적한 관행을 검토하고 설명하는 통로를 마련",
      "saeun": "올해 다른 제안을 누구에게 어떤 기준으로 설명할지 점검",
      "wolun": "이번 구간 비판과 대안을 분리해 작게 시험",
      "positive": "새 설명이 고정된 운영을 개선할 단서가 될 수 있다.",
      "risk": "반대 의견의 정당성과 전달 방식은 별도로 확인한다.",
      "reversal": "더 많이 표현하기보다 대상에 맞게 다듬는 것이 효과적일 수 있다.",
      "extraEvidence": "실제 기준·제안·수신자"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:편재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 4,
      "originalId": "tr:god:편재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9f5d5e2edbbd312f743bc4f0df801f314e84a0195802761bf1d9a89c0b563a7c"
    },
    "originalState": {
      "id": "tr:god:편재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "편재",
      "group": "resource",
      "traditionalRef": "외부의 가변적인 자원과 기회; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "다양한 연결을 관리할 여력과 자원 경계 구축",
      "saeun": "올해 새 제안의 규모와 실제 확보한 자원 분리",
      "wolun": "이번 구간 탐색 비용과 중단 기준을 정함",
      "positive": "새 연결을 비교할 선택지가 생긴다는 관점이다.",
      "risk": "운간 편재를 매출·투자 수익의 확정으로 쓰지 않는다.",
      "reversal": "기회를 거절하는 편이 중요한 자원을 보존할 수 있다.",
      "extraEvidence": "실제 제안·유동성·감당 여력"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:정재",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 5,
      "originalId": "tr:god:정재",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2722dac82480e160224c7ef79a0cbc335abe0470fbb109f9d1f970bac28c8b96"
    },
    "originalState": {
      "id": "tr:god:정재",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "정재",
      "group": "resource",
      "traditionalRef": "정해진 자원의 축적과 관리; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "기반 자원의 지속적인 운영과 배분 체계를 점검",
      "saeun": "올해 수입·시간·지출의 실제 확정 항목을 확인",
      "wolun": "이번 구간 예정 자원과 이미 확보된 자원을 구분",
      "positive": "작은 누수를 줄여 지속 가능성을 살핀다.",
      "risk": "규칙적 수입이 발생했다고 꾸며내지 않는다.",
      "reversal": "정밀 관리가 기회를 놓치게 하면 허용 범위를 따로 둔다.",
      "extraEvidence": "실제 예산·시간표·확정 금액"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:편관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 6,
      "originalId": "tr:god:편관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ea096abda77e0e956ddfb8652cc89ca97a3dca68fb9012d7b199f22220a4b9e3"
    },
    "originalState": {
      "id": "tr:god:편관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "편관",
      "group": "constraint",
      "traditionalRef": "집중된 통제 요구와 대응; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "부담이 큰 요구를 다룰 준비·지원 구조를 유지",
      "saeun": "올해 강한 요구의 범위와 감당 조건 점검",
      "wolun": "이번 구간 급한 요구의 우선순위와 지원을 확인",
      "positive": "긴장 속에서 실행 조건을 명확히 할 질문이다.",
      "risk": "재난·질병·범죄나 공격적인 성격의 증거가 아니다.",
      "reversal": "혼자 버티기보다 권한을 돌려주는 선택이 유효할 수 있다.",
      "extraEvidence": "실제 위험·요구·지원자"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:정관",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 7,
      "originalId": "tr:god:정관",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "92e2aa5479b78c6a2f46616af1ae92195cd5a19de01003e975140f681d240f67"
    },
    "originalState": {
      "id": "tr:god:정관",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "정관",
      "group": "constraint",
      "traditionalRef": "정해진 기준과 공적 책임; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "기준·책임을 일관되게 수행할 체계 구축",
      "saeun": "올해 평가 기준과 맡을 책임의 경계 확인",
      "wolun": "이번 구간 마감·승인·역할을 명시",
      "positive": "공정한 기준을 공유하는 자원을 검토한다.",
      "risk": "승진·취업·혼인을 기준 하나로 예언하지 않는다.",
      "reversal": "규칙 준수보다 불필요한 규칙의 재협의가 필요할 수 있다.",
      "extraEvidence": "실제 규정·평가 절차"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:편인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 8,
      "originalId": "tr:god:편인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "437fe0b48e8196037c751e7a6ce72278cca1a9102b10693e184cb5a5004a8f64"
    },
    "originalState": {
      "id": "tr:god:편인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "편인",
      "group": "support",
      "traditionalRef": "선별적인 수용과 관점 전환; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "특화된 지식과 다른 관점의 활용 경로 마련",
      "saeun": "올해 익숙한 설명으로 해결되지 않는 질문을 분리",
      "wolun": "이번 구간 다른 자료를 비교하되 적용을 유예",
      "positive": "다른 관점이 막힌 문제의 가설을 넓힌다.",
      "risk": "독특한 생각을 검증된 결론이나 고립 사건으로 만들지 않는다.",
      "reversal": "추가 조사보다 이미 아는 것을 시험할 때일 수 있다.",
      "extraEvidence": "실제 자료·검증 방법"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:god:정인",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts",
      "exportName": "TEMPORAL_GOD_ROLES",
      "index": 9,
      "originalId": "tr:god:정인",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "986a593480c8ec2a38cd30dd3b2e8e8b432032f80adcc69689cce30df34b3aae"
    },
    "originalState": {
      "id": "tr:god:정인",
      "class": "C",
      "sourceRefs": [
        "repo-gods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "god": "정인",
      "group": "support",
      "traditionalRef": "기반이 되는 학습과 보호 자원; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
      "dayun": "받은 지식·지원을 실행 가능한 기반으로 정리",
      "saeun": "올해 배울 내용과 실제 받을 수 있는 도움 구별",
      "wolun": "이번 구간 복습·문서화·질문할 범위를 정함",
      "positive": "기초를 다시 익혀 시행착오의 범위를 줄인다.",
      "risk": "자격증·합격·귀인 출현을 보장하지 않는다.",
      "reversal": "지원이 많아도 스스로 실행할 단위가 필요할 수 있다.",
      "extraEvidence": "실제 교육·지원 이용 조건"
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:same-god",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 0,
      "originalId": "tr:overlap:same-god",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "41323ebcbf476e79d6d89fe31c9e19290c7f550fcd362e4d2cd27c2e59ec2528"
    },
    "originalState": {
      "id": "tr:overlap:same-god",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운·세운 같은 십성",
      "meaning": "동일 natal 일간 기준의 두 십성이 같을 때 역할 주제가 겹친다.",
      "positive": "장기 연습을 올해 구체적인 과제로 확인한다.",
      "risk": "동일 명칭을 힘·확률 두 배로 합산하지 않는다.",
      "reversal": "반복이 도움이 아니라 과용일 수 있어 실제 수행 비용을 살핀다.",
      "distinction": "같은 주제의 장기 계획과 올해 할 일 두 칸이다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:different-god",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 1,
      "originalId": "tr:overlap:different-god",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2803ec1e6ebeaf380296d39747d5a1589eedafbaaa6b506f9f9abd8cc158d3aa"
    },
    "originalState": {
      "id": "tr:overlap:different-god",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운·세운 다른 십성",
      "meaning": "동일 일간 기준에서 다른 두 기능을 비교한다.",
      "positive": "장기 자원과 연간 과제를 분담한다.",
      "risk": "다른 역할을 서로 모순된 예언으로 만들지 않는다.",
      "reversal": "새 역할이 기존 장점을 실행할 통로가 될 수 있다.",
      "distinction": "큰 여행 목적과 올해 이동 수단처럼 질문이 다르다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:annual-clash",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 2,
      "originalId": "tr:overlap:annual-clash",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "39b483be8fe27a7aa28594ca40a4ba35da448c19ec29948bf0aedf644694b02a"
    },
    "originalState": {
      "id": "tr:overlap:annual-clash",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원국·세운 충",
      "meaning": "연지와 실제 natal 지지의 충 참가자·자리를 확인한다.",
      "positive": "기존 배치의 수정 가능성을 검토한다.",
      "risk": "충이면 이사·퇴사·이별한다는 사건을 붙이지 않는다.",
      "reversal": "바꾸지 않을 조건을 확인하는 것이 먼저일 수 있다.",
      "distinction": "고정 배치에 새 요구가 닿는 접점이지 파괴의 예고가 아니다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:major-harmony",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 3,
      "originalId": "tr:overlap:major-harmony",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3e60259d47ed93064314da821539dd22b9b3617494b52970adac1b6f3cae5bfd"
    },
    "originalState": {
      "id": "tr:overlap:major-harmony",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원국·대운 합",
      "meaning": "실제 활성 운지와 natal 구성의 결합을 확인한다.",
      "positive": "장기 활용할 연결 자원을 검토한다.",
      "risk": "합만으로 안정·성공·합화를 확정하지 않는다.",
      "reversal": "과도한 묶임이면 필요한 분리를 검토한다.",
      "distinction": "오래 쓸 연결 통로지만 무엇을 흘릴지는 실제 배합에 달린다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:period-mixed",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 4,
      "originalId": "tr:overlap:period-mixed",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f698beb47f14e181979cd9048850906d44b6deac97aa15b20dc056dc3fbcd78e"
    },
    "originalState": {
      "id": "tr:overlap:period-mixed",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운·세운 복수 관계",
      "meaning": "같은 두 기간의 충·형 등 여러 표 일치가 있는지 확인한다.",
      "positive": "배치 조정 질문과 반복 부담 질문을 구별한다.",
      "risk": "관계 개수로 길흉 점수를 만들지 않는다.",
      "reversal": "서로 다른 질문을 같은 장면에서 확인할 수 있어도 사건은 하나일 수 있다.",
      "distinction": "한 문제를 서로 다른 렌즈로 보는 것이 문제 수 증가를 뜻하지 않는다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:jie-inside",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 5,
      "originalId": "tr:overlap:jie-inside",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6ced5d64cde47cf6553d197b047088ebcf44f8c966679fb99d276f010895fcea"
    },
    "originalState": {
      "id": "tr:overlap:jie-inside",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월 안의 절입",
      "meaning": "실제 절입 전후 월주·십성·관계가 달라지는지 확인한다.",
      "positive": "작은 실행을 비교할 시간 단위를 나눈다.",
      "risk": "절입 후 설명을 월초에 적용하지 않는다.",
      "reversal": "전후 간지가 달라도 관계가 같으면 차이를 부풀리지 않는다.",
      "distinction": "달력 한 장 안에 두 개의 시간표가 들어갈 수 있다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:dayun-inside",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 6,
      "originalId": "tr:overlap:dayun-inside",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "58b1bb63968e321b048c167474705efe0409b7edc4bb81759af830c51454bb9e"
    },
    "originalState": {
      "id": "tr:overlap:dayun-inside",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월 안의 교운",
      "meaning": "월주가 같아도 활성 운이 바뀌면 대운 소유자의 비교 조건이 달라진다.",
      "positive": "이어갈 역할과 새 역할을 구간별로 나눈다.",
      "risk": "대운 전환과 명리월 전환을 같은 이유로 설명하지 않는다.",
      "reversal": "새 운에서 관계가 사라지면 기존 긴장 설명을 중단한다.",
      "distinction": "같은 실행 공간에서 배경 시간표가 바뀌는 경우다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:close-boundaries",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 7,
      "originalId": "tr:overlap:close-boundaries",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "97a57b1ba536d5aa33eb235687e244b15535f38320126cfb94ed7b69092b1a68"
    },
    "originalState": {
      "id": "tr:overlap:close-boundaries",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "절입·교운 근접",
      "meaning": "두 경계가 가까워도 각 실제 시각을 순서대로 보존한다.",
      "positive": "중간 짧은 구간에 어떤 조건이 유효한지 확인한다.",
      "risk": "편의상 경계를 합치거나 가까움을 사건 강도로 번역하지 않는다.",
      "reversal": "짧은 구간의 관계가 연간 전체를 대표하지 않을 수 있다.",
      "distinction": "가까운 두 환승역은 한 역이 아니다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:multi-owners",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 8,
      "originalId": "tr:overlap:multi-owners",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fbfff705340df2ecdd37cd45f40ce082c12d89dd8dfc28d08e80db337ddd687d"
    },
    "originalState": {
      "id": "tr:overlap:multi-owners",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "여러 소유자의 관계",
      "meaning": "원국·대운·세운·월운 관계의 참가자와 교집합을 각각 구별한다.",
      "positive": "영역을 섞지 않고 겹치는 실제 조건만 확인한다.",
      "risk": "다른 source를 하나의 natal 위치나 점수로 합치지 않는다.",
      "reversal": "같은 지지라도 소유자가 달라 질문이 달라질 수 있다.",
      "distinction": "같은 글자가 적혀도 다른 시간표의 자리다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:uncertain-part",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 9,
      "originalId": "tr:overlap:uncertain-part",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3dfe432e4fb250cc4de99a9d21d1f2b44268a2d390e4a96ea8b22e746de91197"
    },
    "originalState": {
      "id": "tr:overlap:uncertain-part",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "일부만 불확실",
      "meaning": "월주·실효 연주는 확정이고 활성 운만 후보일 수 있다.",
      "positive": "확정 정보는 유지하고 불확실 대운 설명만 유예한다.",
      "risk": "일부 불확실 때문에 모든 근거를 버리거나 모두 확정하지 않는다.",
      "reversal": "범위 밖에서 다시 확정되는 조건이 남는다.",
      "distinction": "안개 낀 길만 표시하고 지도 전체를 지우지 않는다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:none",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 10,
      "originalId": "tr:overlap:none",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "476fb14f09966950b932b7a00489188e387b743564a5c6fd5647b43b09140858"
    },
    "originalState": {
      "id": "tr:overlap:none",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "일치 없음",
      "meaning": "해당 scope producer의 관계 배열이 실제로 비었는지 확인한다.",
      "positive": "간지·십성·오행의 다른 확인 가능한 정보로 제한한다.",
      "risk": "관계가 있어야 재미있다는 이유로 허위 연결을 넣지 않는다.",
      "reversal": "관계 없음은 실패가 아니라 설명 범위를 정하는 정보다.",
      "distinction": "빈 접점 표는 아무 일도 없을 해라는 뜻이 아니다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:overlap:time-perspective",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalOverlaps.ts",
      "exportName": "TEMPORAL_OVERLAPS",
      "index": 11,
      "originalId": "tr:overlap:time-perspective",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1ed38fc631fc4bcce28207f9a98a1511b5d398b81125d506aa4b68e9dccc4b41"
    },
    "originalState": {
      "id": "tr:overlap:time-perspective",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "회고·현재·미래",
      "meaning": "고정 평가 시각과 유효 구간을 비교한다.",
      "positive": "과거는 확인 질문, 현재는 선택, 미래는 준비 조건으로 구별한다.",
      "risk": "과거 해의 가능한 장면을 실제 경험처럼 쓰지 않는다.",
      "reversal": "과거 해석과 독자 경험이 다르면 독자 경험을 수정하지 않는다.",
      "distinction": "지난 지도는 실제 여행 일지가 아니다.",
      "requires": [
        "실제 동일 구간",
        "참가자별 source와 certainty"
      ],
      "excludes": [
        "관계 수로 영향 가산",
        "확인되지 않은 사건 생성"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2023",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 0,
      "originalId": "tr:year:A:2023",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7ee7e37bcd212311ac3892342606e7607674f1a15a173d0f42075c38354c381d"
    },
    "originalState": {
      "id": "tr:year:A:2023",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2023",
      "factsRef": "offline-periods.json#/major/A/years/2023",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"癸卯\",\"annualGod\":\"상관\",\"elements\":[\"water\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯午 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"plain\":\"子卯 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2023:癸卯",
        "major:4:戊寅:year:2023:癸卯:ten-god",
        "major:4:戊寅:year:2023:癸卯:boundary",
        "major:4:戊寅:year:2023:癸卯:natal:파:卯午:month",
        "major:4:戊寅:year:2023:癸卯:natal:형:子卯:day"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:상관"
      ],
      "question": "표현을 바꾸는 상관 질문에서 원국 월지의 파와 일지의 형을 서로 다른 자리의 확인으로 나눌 수 있는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:상관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2024",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 1,
      "originalId": "tr:year:A:2024",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1403fdc1e96c7e721f799a098f6a4fb6f011778594941eea22ca8555613d0191"
    },
    "originalState": {
      "id": "tr:year:A:2024",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2024",
      "factsRef": "offline-periods.json#/major/A/years/2024",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"甲辰\",\"annualGod\":\"편재\",\"elements\":[\"wood\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑辰 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2024:甲辰",
        "major:4:戊寅:year:2024:甲辰:ten-god",
        "major:4:戊寅:year:2024:甲辰:natal:반합:辰子:day",
        "major:4:戊寅:year:2024:甲辰:natal:파:丑辰:year",
        "major:4:戊寅:year:2024:甲辰:natal:해:卯辰:hour"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편재"
      ],
      "question": "새 외부 자원을 보는 편재 질문에서 일지 반합과 연지 파·시지 해를 같은 결과로 묶고 있지 않은가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:편재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2025",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 2,
      "originalId": "tr:year:A:2025",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e9b8080b1d2f1f4e34967b08701050f35aad5f1ef81e5f2f7f9e696d59f87760"
    },
    "originalState": {
      "id": "tr:year:A:2025",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2025",
      "factsRef": "offline-periods.json#/major/A/years/2025",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"乙巳\",\"annualGod\":\"정재\",\"elements\":[\"wood\",\"fire\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"寅\",\"巳\"],\"plain\":\"寅巳 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"寅\",\"巳\"],\"plain\":\"寅巳 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"巳\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"巳丑 반합 금 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2025:乙巳",
        "major:4:戊寅:year:2025:乙巳:ten-god",
        "major:4:戊寅:year:2025:乙巳:cycle:해:寅巳:cycle",
        "major:4:戊寅:year:2025:乙巳:cycle:형:寅巳:cycle",
        "major:4:戊寅:year:2025:乙巳:natal:반합:巳丑:year"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정재"
      ],
      "question": "정재의 운영 질문과 대운의 해·형을 연결할 때 실제 관리 비용과 반복 부담을 분리했는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:정재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2026",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 3,
      "originalId": "tr:year:A:2026",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3c66df56c23f8237d35c8dc000cb0407a8a8616118606ed66d0fdddb6b9bae1e"
    },
    "originalState": {
      "id": "tr:year:A:2026",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026",
      "factsRef": "offline-periods.json#/major/A/years/2026",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"丙午\",\"annualGod\":\"편관\",\"elements\":[\"fire\",\"fire\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"午\",\"寅\"],\"plain\":\"午寅 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑午 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"午\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"午午 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"충\",\"branches\":[\"子\",\"午\"],\"affectedPillars\":[\"day\"],\"plain\":\"子午 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯午 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2026:丙午",
        "major:4:戊寅:year:2026:丙午:ten-god",
        "major:4:戊寅:year:2026:丙午:cycle:반합:午寅:cycle",
        "major:4:戊寅:year:2026:丙午:natal:해:丑午:year",
        "major:4:戊寅:year:2026:丙午:natal:형:午午:month",
        "major:4:戊寅:year:2026:丙午:natal:충:子午:day",
        "major:4:戊寅:year:2026:丙午:natal:파:卯午:hour"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편관"
      ],
      "question": "편관의 강한 요구를 운의 반합과 원국 일지 충 가운데 어떤 실제 업무 조건에서 확인할 것인가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:편관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2027",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 4,
      "originalId": "tr:year:A:2027",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6a1c18434ab06582141be8abc130bfd46bb04c29fcc0f740987f91a9cab45f98"
    },
    "originalState": {
      "id": "tr:year:A:2027",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2027",
      "factsRef": "offline-periods.json#/major/A/years/2027",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"丁未\",\"annualGod\":\"정관\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"未卯 반합 목 흐름은 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"丑\",\"未\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑未 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"未\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"未丑 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"육합\",\"branches\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"午未 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"해\",\"branches\":[\"子\",\"未\"],\"affectedPillars\":[\"day\"],\"plain\":\"子未 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2027:丁未",
        "major:4:戊寅:year:2027:丁未:ten-god",
        "major:4:戊寅:year:2027:丁未:natal:반합:未卯:hour",
        "major:4:戊寅:year:2027:丁未:natal:충:丑未:year",
        "major:4:戊寅:year:2027:丁未:natal:형:未丑:year",
        "major:4:戊寅:year:2027:丁未:natal:육합:午未:month",
        "major:4:戊寅:year:2027:丁未:natal:해:子未:day"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정관"
      ],
      "question": "정관의 공적 기준을 설명하면서 원국의 합·충·형·해가 닿는 각 자리를 사건 대신 서로 다른 조건으로 보았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:정관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2028",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 5,
      "originalId": "tr:year:A:2028",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bcd41332366c5232d31bddd614b2f1682a22e0ccff77f72f48cecfb2afb7c953"
    },
    "originalState": {
      "id": "tr:year:A:2028",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2028",
      "factsRef": "offline-periods.json#/major/A/years/2028",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"戊申\",\"annualGod\":\"편인\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[{\"type\":\"충\",\"branches\":[\"寅\",\"申\"],\"plain\":\"寅申 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"申\",\"寅\"],\"plain\":\"申寅 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"申\",\"子\"],\"affectedPillars\":[\"day\"],\"plain\":\"申子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2028:戊申",
        "major:4:戊寅:year:2028:戊申:ten-god",
        "major:4:戊寅:year:2028:戊申:cycle:충:寅申:cycle",
        "major:4:戊寅:year:2028:戊申:cycle:형:申寅:cycle",
        "major:4:戊寅:year:2028:戊申:natal:반합:申子:day",
        "major:4:戊寅:year:2028:戊申:element:metal:missing"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편인"
      ],
      "question": "편인 역할이 반복되는 가운데 운의 寅申 충·申寅 형과 원국 일지 申子 반합을 배치 조정·반복 부담·부분 연결로 나눌 수 있는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:편인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2029",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 6,
      "originalId": "tr:year:A:2029",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "78ca36aca1e63cb9ca67c80217815ccf4ab3ed67d8ff8e6ad570491bd1cca859"
    },
    "originalState": {
      "id": "tr:year:A:2029",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2029",
      "factsRef": "offline-periods.json#/major/A/years/2029",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"己酉\",\"annualGod\":\"정인\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"酉\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"酉丑 반합 금 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"子\",\"酉\"],\"affectedPillars\":[\"day\"],\"plain\":\"子酉 파는 일지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"충\",\"branches\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯酉 충은 시지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2029:己酉",
        "major:4:戊寅:year:2029:己酉:ten-god",
        "major:4:戊寅:year:2029:己酉:natal:반합:酉丑:year",
        "major:4:戊寅:year:2029:己酉:natal:파:子酉:day",
        "major:4:戊寅:year:2029:己酉:natal:충:卯酉:hour",
        "major:4:戊寅:year:2029:己酉:element:metal:missing"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정인"
      ],
      "question": "정인의 기초 지원 질문과 원국 시지 卯酉 충을 연결할 때 도움 수용과 기존 방식 변경을 구별했는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:정인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2030",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 7,
      "originalId": "tr:year:A:2030",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4e9911c82a9921cb34bcb77242022e1c81e3396045b33dbe2060efdf0344309b"
    },
    "originalState": {
      "id": "tr:year:A:2030",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2030",
      "factsRef": "offline-periods.json#/major/A/years/2030",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"庚戌\",\"annualGod\":\"비견\",\"elements\":[\"metal\",\"earth\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"戌\",\"寅\"],\"plain\":\"戌寅 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"戌\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"戌午 반합 화 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"형\",\"branches\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑戌 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯戌 육합은 시지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2030:庚戌",
        "major:4:戊寅:year:2030:庚戌:ten-god",
        "major:4:戊寅:year:2030:庚戌:cycle:반합:戌寅:cycle",
        "major:4:戊寅:year:2030:庚戌:natal:반합:戌午:month",
        "major:4:戊寅:year:2030:庚戌:natal:형:丑戌:year",
        "major:4:戊寅:year:2030:庚戌:natal:육합:卯戌:hour",
        "major:4:戊寅:year:2030:庚戌:element:metal:missing"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:비견"
      ],
      "question": "비견의 독자 판단을 살리면서 운의 반합과 원국의 형·육합이 보여 주는 접점을 별개로 확인했는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:비견",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2031",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 8,
      "originalId": "tr:year:A:2031",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e081415af6bd79202e3a88e4de372e19d38d65e47008bc72dd2b3567a78f28c9"
    },
    "originalState": {
      "id": "tr:year:A:2031",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2031",
      "factsRef": "offline-periods.json#/major/A/years/2031",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"辛亥\",\"annualGod\":\"겁재\",\"elements\":[\"metal\",\"water\"],\"cycleRelations\":[{\"type\":\"육합\",\"branches\":[\"寅\",\"亥\"],\"plain\":\"寅亥 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"파\",\"branches\":[\"寅\",\"亥\"],\"plain\":\"寅亥 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"亥\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"亥卯 반합 목 흐름은 시지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2031:辛亥",
        "major:4:戊寅:year:2031:辛亥:ten-god",
        "major:4:戊寅:year:2031:辛亥:cycle:육합:寅亥:cycle",
        "major:4:戊寅:year:2031:辛亥:cycle:파:寅亥:cycle",
        "major:4:戊寅:year:2031:辛亥:natal:반합:亥卯:hour",
        "major:4:戊寅:year:2031:辛亥:element:metal:missing"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:겁재"
      ],
      "question": "겁재의 공동 배분을 검토할 때 운과 연주의 寅亥 육합·파를 협업 성공과 실패 두 예언으로 만들고 있지 않은가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:겁재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2032",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 9,
      "originalId": "tr:year:A:2032",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ec37ed07f3b205d9abf355a21094a5f6531b1a1698e28aae30f29dd72acc821f"
    },
    "originalState": {
      "id": "tr:year:A:2032",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2032",
      "factsRef": "offline-periods.json#/major/A/years/2032",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"壬子\",\"annualGod\":\"식신\",\"elements\":[\"water\",\"water\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"육합\",\"branches\":[\"子\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"子丑 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"충\",\"branches\":[\"子\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"子午 충은 월지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"子卯 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:4:戊寅:year:2032:壬子",
        "major:4:戊寅:year:2032:壬子:ten-god",
        "major:4:戊寅:year:2032:壬子:boundary",
        "major:4:戊寅:year:2032:壬子:natal:육합:子丑:year",
        "major:4:戊寅:year:2032:壬子:natal:충:子午:month",
        "major:4:戊寅:year:2032:壬子:natal:형:子卯:hour"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:식신"
      ],
      "question": "식신의 지속 산출에서 원국 연지 육합·월지 충·시지 형을 서로 다른 수행 조건으로 정리할 수 있는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:식신",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2033",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 10,
      "originalId": "tr:year:A:2033",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4d2dc2bb8343437bab3aa16102b35669a26bfe31dd9ecca0e67da69703df2446"
    },
    "originalState": {
      "id": "tr:year:A:2033",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2033",
      "factsRef": "offline-periods.json#/major/A/years/2033",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"癸丑\",\"annualGod\":\"상관\",\"elements\":[\"water\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"丑\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"丑午 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"육합\",\"branches\":[\"子\",\"丑\"],\"affectedPillars\":[\"day\"],\"plain\":\"子丑 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
      "evidenceRefs": [
        "major:5:丁丑:year:2033:癸丑",
        "major:5:丁丑:year:2033:癸丑:ten-god",
        "major:5:丁丑:year:2033:癸丑:boundary",
        "major:5:丁丑:year:2033:癸丑:natal:해:丑午:month",
        "major:5:丁丑:year:2033:癸丑:natal:육합:子丑:day"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:상관"
      ],
      "question": "정관 배경으로 바뀌는 구간에서 상관의 제안은 어떤 공통 기준으로 검토할까? 새 대운 관계를 전환 전까지 확장하지 않았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:상관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2034",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 11,
      "originalId": "tr:year:A:2034",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d7a0f456ffd4e72274717e9e70bbdb03418d0ac66a9882dc3eec60a9507d2e25"
    },
    "originalState": {
      "id": "tr:year:A:2034",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2034",
      "factsRef": "offline-periods.json#/major/A/years/2034",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"甲寅\",\"annualGod\":\"편재\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"寅\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"寅午 반합 화 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
      "evidenceRefs": [
        "major:5:丁丑:year:2034:甲寅",
        "major:5:丁丑:year:2034:甲寅:ten-god",
        "major:5:丁丑:year:2034:甲寅:natal:반합:寅午:month"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:편재"
      ],
      "question": "정관 배경에서 편재의 새 제안을 원국 월지 반합이라는 실제 접점과 어떻게 구별할까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:편재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2035",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 12,
      "originalId": "tr:year:A:2035",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bd19b9eab7dc9af972b12ad69b96597799127661b3151844b247fb91a0c2c2f5"
    },
    "originalState": {
      "id": "tr:year:A:2035",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2035",
      "factsRef": "offline-periods.json#/major/A/years/2035",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"乙卯\",\"annualGod\":\"정재\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯午 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"plain\":\"子卯 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:5:丁丑:year:2035:乙卯",
        "major:5:丁丑:year:2035:乙卯:ten-god",
        "major:5:丁丑:year:2035:乙卯:natal:파:卯午:month",
        "major:5:丁丑:year:2035:乙卯:natal:형:子卯:day"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:정재"
      ],
      "question": "정재의 관리 질문이 2025년과 같더라도 운간이 달라지고 운-세운 관계가 없다는 차이를 어떻게 보여 줄까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:정재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:A:2036",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 13,
      "originalId": "tr:year:A:2036",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "138a480e58259912946085bbbf168ccbff339b959aa83fc58502861f3da4b9c6"
    },
    "originalState": {
      "id": "tr:year:A:2036",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2036",
      "factsRef": "offline-periods.json#/major/A/years/2036",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"丙辰\",\"annualGod\":\"편관\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"plain\":\"丑辰 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑辰 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:5:丁丑:year:2036:丙辰",
        "major:5:丁丑:year:2036:丙辰:ten-god",
        "major:5:丁丑:year:2036:丙辰:cycle:파:丑辰:cycle",
        "major:5:丁丑:year:2036:丙辰:natal:반합:辰子:day",
        "major:5:丁丑:year:2036:丙辰:natal:파:丑辰:year",
        "major:5:丁丑:year:2036:丙辰:natal:해:卯辰:hour"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:편관"
      ],
      "question": "편관의 요구를 검토할 때 운의 丑辰 파와 natal 연지의 같은 파를 같은 소유자의 중복으로 오해하지 않았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:편관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2023",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 14,
      "originalId": "tr:year:B:2023",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6205a9e2f570eee8977dcdcdd0377e1ba1f085def6f10995508649e28db9cce6"
    },
    "originalState": {
      "id": "tr:year:B:2023",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2023",
      "factsRef": "offline-periods.json#/major/B/years/2023",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"庚辰\",\"dayunGod\":\"편관\",\"annual\":\"癸卯\",\"annualGod\":\"정인\",\"elements\":[\"water\",\"wood\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"plain\":\"卯辰 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"卯未 반합 목 흐름은 월지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯午 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:3:庚辰:year:2023:癸卯",
        "major:3:庚辰:year:2023:癸卯:ten-god",
        "major:3:庚辰:year:2023:癸卯:boundary",
        "major:3:庚辰:year:2023:癸卯:cycle:해:卯辰:cycle",
        "major:3:庚辰:year:2023:癸卯:natal:반합:卯未:month-hour",
        "major:3:庚辰:year:2023:癸卯:natal:파:卯午:year",
        "major:3:庚辰:year:2023:癸卯:element:water:missing"
      ],
      "roleRefs": [
        "tr:god:편관",
        "tr:god:정인"
      ],
      "question": "편관 장기 배경 속 정인의 지원 질문과 운의 卯辰 해를 어떤 실제 지원 조건에서 분리해 확인할까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편관",
        "tr:god:정인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2024",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 15,
      "originalId": "tr:year:B:2024",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "31869bf8971de85330a48b4e804c51d8e2cc3dcbcbb7ab0c19d1ca5ff141aec9"
    },
    "originalState": {
      "id": "tr:year:B:2024",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2024",
      "factsRef": "offline-periods.json#/major/B/years/2024",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"甲辰\",\"annualGod\":\"비견\",\"elements\":[\"wood\",\"earth\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"plain\":\"卯辰 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰申 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2024:甲辰",
        "major:4:己卯:year:2024:甲辰:ten-god",
        "major:4:己卯:year:2024:甲辰:boundary",
        "major:4:己卯:year:2024:甲辰:cycle:해:卯辰:cycle",
        "major:4:己卯:year:2024:甲辰:natal:반합:辰申:day",
        "major:4:己卯:year:2024:甲辰:natal:해:卯辰:hour"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:비견"
      ],
      "question": "정재 배경의 시작 전후에 비견의 독자 판단 질문을 적용할 때 실제 교운 이전 조건을 남겨 두었는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:비견",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2025",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 16,
      "originalId": "tr:year:B:2025",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4e10311901bc58080f42e97d8bc3f67ac63578830cfc0f1ede7258096ad4d3d9"
    },
    "originalState": {
      "id": "tr:year:B:2025",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2025",
      "factsRef": "offline-periods.json#/major/B/years/2025",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"乙巳\",\"annualGod\":\"겁재\",\"elements\":[\"wood\",\"fire\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"육합\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"형\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 파는 일지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2025:乙巳",
        "major:4:己卯:year:2025:乙巳:ten-god",
        "major:4:己卯:year:2025:乙巳:natal:육합:巳申:day",
        "major:4:己卯:year:2025:乙巳:natal:형:巳申:day",
        "major:4:己卯:year:2025:乙巳:natal:파:巳申:day"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:겁재"
      ],
      "question": "겁재의 공동 배분과 natal 일지 巳申 육합·형·파를 세 사건으로 더하지 않고 어떤 합의 조건으로 나눌까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:겁재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2026",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 17,
      "originalId": "tr:year:B:2026",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6203ec35482f534bf571450ff056240865e46bc2ebaedaf45fa7361a75c4d450"
    },
    "originalState": {
      "id": "tr:year:B:2026",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026",
      "factsRef": "offline-periods.json#/major/B/years/2026",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"丙午\",\"annualGod\":\"식신\",\"elements\":[\"fire\",\"fire\"],\"cycleRelations\":[{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"plain\":\"卯午 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"형\",\"branches\":[\"午\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"午午 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"육합\",\"branches\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"午未 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯午 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2026:丙午",
        "major:4:己卯:year:2026:丙午:ten-god",
        "major:4:己卯:year:2026:丙午:cycle:파:卯午:cycle",
        "major:4:己卯:year:2026:丙午:natal:형:午午:year",
        "major:4:己卯:year:2026:丙午:natal:육합:午未:month",
        "major:4:己卯:year:2026:丙午:natal:파:卯午:hour"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:식신"
      ],
      "question": "정재 배경에서 식신의 산출을 유지하며 운과 원국 시지의 卯午 파가 다른 소유자임을 구별했는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:식신",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2027",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 18,
      "originalId": "tr:year:B:2027",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3a9e67c68a154bd555a2152b27222f4e14f8e3adb838779777eb59c7d71e27da"
    },
    "originalState": {
      "id": "tr:year:B:2027",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2027",
      "factsRef": "offline-periods.json#/major/B/years/2027",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"丁未\",\"annualGod\":\"상관\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"卯\"],\"plain\":\"未卯 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"卯\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"未卯 반합 목 흐름은 월지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"午\",\"未\"],\"affectedPillars\":[\"year\"],\"plain\":\"午未 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2027:丁未",
        "major:4:己卯:year:2027:丁未:ten-god",
        "major:4:己卯:year:2027:丁未:cycle:반합:未卯:cycle",
        "major:4:己卯:year:2027:丁未:natal:반합:未卯:month-hour",
        "major:4:己卯:year:2027:丁未:natal:육합:午未:year"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:상관"
      ],
      "question": "상관 제안을 검토하며 운의 未卯 반합과 원국 월·시지의 반합을 접점별로 설명할 수 있는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:상관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2028",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 19,
      "originalId": "tr:year:B:2028",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "84b23efd40e2154e8bb8c5085632fc81d9d47e8e7a81d4af415c4b66be2ec020"
    },
    "originalState": {
      "id": "tr:year:B:2028",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2028",
      "factsRef": "offline-periods.json#/major/B/years/2028",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"戊申\",\"annualGod\":\"편재\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[]}",
      "evidenceRefs": [
        "major:4:己卯:year:2028:戊申",
        "major:4:己卯:year:2028:戊申:ten-god"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편재"
      ],
      "question": "편재의 외부 자원 질문은 남지만 운·원국 관계 배열이 모두 빈 해에 어떤 근거까지 설명할 수 있는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:편재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2029",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 20,
      "originalId": "tr:year:B:2029",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "854fc7fb1ff4ee5388f7922baf6fc905db8391b5081fcf66ca8210f3769f6ba9"
    },
    "originalState": {
      "id": "tr:year:B:2029",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2029",
      "factsRef": "offline-periods.json#/major/B/years/2029",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"己酉\",\"annualGod\":\"정재\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[{\"type\":\"충\",\"branches\":[\"卯\",\"酉\"],\"plain\":\"卯酉 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}],\"natalRelations\":[{\"type\":\"충\",\"branches\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯酉 충은 시지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2029:己酉",
        "major:4:己卯:year:2029:己酉:ten-god",
        "major:4:己卯:year:2029:己酉:cycle:충:卯酉:cycle",
        "major:4:己卯:year:2029:己酉:natal:충:卯酉:hour"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정재"
      ],
      "question": "정재가 반복돼도 운의 卯酉 충과 원국 시지 충은 어떤 서로 다른 비교를 제공하는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:정재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2030",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 21,
      "originalId": "tr:year:B:2030",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "cb39d7d3c0d09453612a36d359f19e08276cf557808464828b5aa44abac1ae1a"
    },
    "originalState": {
      "id": "tr:year:B:2030",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2030",
      "factsRef": "offline-periods.json#/major/B/years/2030",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"庚戌\",\"annualGod\":\"편관\",\"elements\":[\"metal\",\"earth\"],\"cycleRelations\":[{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"plain\":\"卯戌 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"戌\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"戌午 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"형\",\"branches\":[\"戌\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"戌未 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"未\",\"戌\"],\"affectedPillars\":[\"month\"],\"plain\":\"未戌 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯戌 육합은 시지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2030:庚戌",
        "major:4:己卯:year:2030:庚戌:ten-god",
        "major:4:己卯:year:2030:庚戌:cycle:육합:卯戌:cycle",
        "major:4:己卯:year:2030:庚戌:natal:반합:戌午:year",
        "major:4:己卯:year:2030:庚戌:natal:형:戌未:month",
        "major:4:己卯:year:2030:庚戌:natal:파:未戌:month",
        "major:4:己卯:year:2030:庚戌:natal:육합:卯戌:hour"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편관"
      ],
      "question": "편관 요구를 살필 때 운의 육합과 natal 월지 형·파를 같은 대상의 길흉으로 합산하고 있지 않은가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:편관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2031",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 22,
      "originalId": "tr:year:B:2031",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "dfe1f27aa6e0aa510bfda10715569917ef45296a4932a44e54eb09b96a563258"
    },
    "originalState": {
      "id": "tr:year:B:2031",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2031",
      "factsRef": "offline-periods.json#/major/B/years/2031",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"辛亥\",\"annualGod\":\"정관\",\"elements\":[\"metal\",\"water\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"亥\",\"卯\"],\"plain\":\"亥卯 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"삼합\",\"branches\":[\"亥\",\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"亥卯未 삼합 목 흐름은 월지, 시지를 통해 그 해의 큰 흐름을 키울 수 있습니다.\"},{\"type\":\"해\",\"branches\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"plain\":\"申亥 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2031:辛亥",
        "major:4:己卯:year:2031:辛亥:ten-god",
        "major:4:己卯:year:2031:辛亥:cycle:반합:亥卯:cycle",
        "major:4:己卯:year:2031:辛亥:natal:삼합:亥卯未:month-hour",
        "major:4:己卯:year:2031:辛亥:natal:해:申亥:day",
        "major:4:己卯:year:2031:辛亥:element:water:missing"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정관"
      ],
      "question": "정관의 기준 질문에서 natal 亥卯未 삼합은 실제3자이며 운의 亥卯 반합과 구성이 어떻게 다른가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:정관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2032",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 23,
      "originalId": "tr:year:B:2032",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4d8c2ba91f82043d257e232c258c01d2ea1e82b3532a041881510602db3979cd"
    },
    "originalState": {
      "id": "tr:year:B:2032",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2032",
      "factsRef": "offline-periods.json#/major/B/years/2032",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"壬子\",\"annualGod\":\"편인\",\"elements\":[\"water\",\"water\"],\"cycleRelations\":[{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"plain\":\"子卯 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"子\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"子申 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"子\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"子午 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"해\",\"branches\":[\"子\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"子未 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"子卯 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2032:壬子",
        "major:4:己卯:year:2032:壬子:ten-god",
        "major:4:己卯:year:2032:壬子:cycle:형:子卯:cycle",
        "major:4:己卯:year:2032:壬子:natal:반합:子申:day",
        "major:4:己卯:year:2032:壬子:natal:충:子午:year",
        "major:4:己卯:year:2032:壬子:natal:해:子未:month",
        "major:4:己卯:year:2032:壬子:natal:형:子卯:hour",
        "major:4:己卯:year:2032:壬子:element:water:missing"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편인"
      ],
      "question": "편인의 관점 전환과 운의 子卯 형·원국 연지 충을 각각 다른 검토 질문으로 나눴는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:편인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2033",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 24,
      "originalId": "tr:year:B:2033",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "76e47566da4be4831fe9431b9353f5d03ef72b0b396a3330046012fb6cfabbee"
    },
    "originalState": {
      "id": "tr:year:B:2033",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2033",
      "factsRef": "offline-periods.json#/major/B/years/2033",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"癸丑\",\"annualGod\":\"정인\",\"elements\":[\"water\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑午 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"충\",\"branches\":[\"丑\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"丑未 충은 월지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"未\",\"丑\"],\"affectedPillars\":[\"month\"],\"plain\":\"未丑 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:4:己卯:year:2033:癸丑",
        "major:4:己卯:year:2033:癸丑:ten-god",
        "major:4:己卯:year:2033:癸丑:boundary",
        "major:4:己卯:year:2033:癸丑:natal:해:丑午:year",
        "major:4:己卯:year:2033:癸丑:natal:충:丑未:month",
        "major:4:己卯:year:2033:癸丑:natal:형:未丑:month",
        "major:4:己卯:year:2033:癸丑:element:water:missing"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정인"
      ],
      "question": "정인의 지원 질문에 natal 월지 丑未 충·형이 닿을 때 지원의 존재와 실제 이용 조건을 구별할 수 있는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:정인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2034",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 25,
      "originalId": "tr:year:B:2034",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6996bc7ede945ee1ead6db0634ccbec4bceb7e444f543c952c395a5fc7a947f5"
    },
    "originalState": {
      "id": "tr:year:B:2034",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2034",
      "factsRef": "offline-periods.json#/major/B/years/2034",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편재\",\"annual\":\"甲寅\",\"annualGod\":\"비견\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"寅\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"寅午 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"寅申 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"plain\":\"申寅 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:5:戊寅:year:2034:甲寅",
        "major:5:戊寅:year:2034:甲寅:ten-god",
        "major:5:戊寅:year:2034:甲寅:boundary",
        "major:5:戊寅:year:2034:甲寅:natal:반합:寅午:year",
        "major:5:戊寅:year:2034:甲寅:natal:충:寅申:day",
        "major:5:戊寅:year:2034:甲寅:natal:형:申寅:day"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:비견"
      ],
      "question": "다음 戊寅 편재 배경과 비견의 올해 역할을 구별하고 전환 이후 寅申 충·형을 그 해 전체에 확대하지 않았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:비견",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2035",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 26,
      "originalId": "tr:year:B:2035",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "afb889e2ec9250560c2e0f54ae20dba6763d9a2c66ec8387803615cbde61bd43"
    },
    "originalState": {
      "id": "tr:year:B:2035",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2035",
      "factsRef": "offline-periods.json#/major/B/years/2035",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편재\",\"annual\":\"乙卯\",\"annualGod\":\"겁재\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"卯未 반합 목 흐름은 월지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯午 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:5:戊寅:year:2035:乙卯",
        "major:5:戊寅:year:2035:乙卯:ten-god",
        "major:5:戊寅:year:2035:乙卯:natal:반합:卯未:month-hour",
        "major:5:戊寅:year:2035:乙卯:natal:파:卯午:year"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:겁재"
      ],
      "question": "겁재 질문이 2025년과 같아도 natal 일지가 아닌 월·시지 반합이 접점이라는 차이를 남겼는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:겁재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:B:2036",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 27,
      "originalId": "tr:year:B:2036",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7d6cbba9d22192ba7ece72da9ad70059f700c1d27242eb41249f0e90be5cf2e6"
    },
    "originalState": {
      "id": "tr:year:B:2036",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2036",
      "factsRef": "offline-periods.json#/major/B/years/2036",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편재\",\"annual\":\"丙辰\",\"annualGod\":\"식신\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰申 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:5:戊寅:year:2036:丙辰",
        "major:5:戊寅:year:2036:丙辰:ten-god",
        "major:5:戊寅:year:2036:丙辰:natal:반합:辰申:day",
        "major:5:戊寅:year:2036:丙辰:natal:해:卯辰:hour"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:식신"
      ],
      "question": "식신의 산출 질문이 2026년과 같아도 배경이 편재이고 운의 파가 없다는 차이를 어떤 자원 운영 질문으로 보여 줄까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:식신",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2023",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 28,
      "originalId": "tr:year:C:2023",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f8a86f2c682f63f6e9037422b09a664568aa23eb7f63073ce14ba9117e7d8183"
    },
    "originalState": {
      "id": "tr:year:C:2023",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2023",
      "factsRef": "offline-periods.json#/major/C/years/2023",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"癸卯\",\"annualGod\":\"정재\",\"elements\":[\"water\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯亥 반합 목 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯戌 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:3:壬申:year:2023:癸卯",
        "major:3:壬申:year:2023:癸卯:ten-god",
        "major:3:壬申:year:2023:癸卯:natal:반합:卯亥:month",
        "major:3:壬申:year:2023:癸卯:natal:육합:卯戌:year",
        "major:3:壬申:year:2023:癸卯:natal:해:卯辰:hour"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정재"
      ],
      "question": "편재 장기 배경에서 정재의 확정 자원을 볼 때 natal 연지 육합과 시지 해의 다른 접점을 어떻게 확인할까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:정재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2024",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 29,
      "originalId": "tr:year:C:2024",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "37eec93802f719e3507d0277325096708ffbd2af9a13da0e29b77235ab2426d1"
    },
    "originalState": {
      "id": "tr:year:C:2024",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2024",
      "factsRef": "offline-periods.json#/major/C/years/2024",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"甲辰\",\"annualGod\":\"편관\",\"elements\":[\"wood\",\"earth\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"plain\":\"辰申 반합 수 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"辰申 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"辰戌 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰辰 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:3:壬申:year:2024:甲辰",
        "major:3:壬申:year:2024:甲辰:ten-god",
        "major:3:壬申:year:2024:甲辰:cycle:반합:辰申:cycle",
        "major:3:壬申:year:2024:甲辰:natal:반합:辰申:day-hour",
        "major:3:壬申:year:2024:甲辰:natal:충:辰戌:year",
        "major:3:壬申:year:2024:甲辰:natal:형:辰辰:hour",
        "major:3:壬申:year:2024:甲辰:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:편관"
      ],
      "question": "편관의 요구 질문에 운과 natal의 辰申 반합을 각각 어느 소유자의 연결로 표시할까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:편관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2025",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 30,
      "originalId": "tr:year:C:2025",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f4fde3f3b0b81b4658e2f0abefa0f364d17d8df8954314ed2c54a7b17788b150"
    },
    "originalState": {
      "id": "tr:year:C:2025",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2025",
      "factsRef": "offline-periods.json#/major/C/years/2025",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"乙巳\",\"annualGod\":\"정관\",\"elements\":[\"wood\",\"fire\"],\"cycleRelations\":[{\"type\":\"육합\",\"branches\":[\"巳\",\"申\"],\"plain\":\"巳申 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"형\",\"branches\":[\"巳\",\"申\"],\"plain\":\"巳申 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"巳\",\"申\"],\"plain\":\"巳申 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"충\",\"branches\":[\"巳\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"巳亥 충은 월지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"육합\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"형\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 파는 일지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:3:壬申:year:2025:乙巳",
        "major:3:壬申:year:2025:乙巳:ten-god",
        "major:3:壬申:year:2025:乙巳:cycle:육합:巳申:cycle",
        "major:3:壬申:year:2025:乙巳:cycle:형:巳申:cycle",
        "major:3:壬申:year:2025:乙巳:cycle:파:巳申:cycle",
        "major:3:壬申:year:2025:乙巳:natal:충:巳亥:month",
        "major:3:壬申:year:2025:乙巳:natal:육합:巳申:day",
        "major:3:壬申:year:2025:乙巳:natal:형:巳申:day",
        "major:3:壬申:year:2025:乙巳:natal:파:巳申:day",
        "major:3:壬申:year:2025:乙巳:element:fire:missing"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정관"
      ],
      "question": "정관의 기준과 운의 巳申 육합·형·파, natal 월지 巳亥 충을 같은 실제 업무의 어떤 다른 조건으로 나눌까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:정관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2026",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 31,
      "originalId": "tr:year:C:2026",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "130ed033a0c6be5fd9035a973474cf8eea22f50b93075f662d443d10d87d1669"
    },
    "originalState": {
      "id": "tr:year:C:2026",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026",
      "factsRef": "offline-periods.json#/major/C/years/2026",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"丙午\",\"annualGod\":\"편인\",\"elements\":[\"fire\",\"fire\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"午\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"午戌 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
      "evidenceRefs": [
        "major:3:壬申:year:2026:丙午",
        "major:3:壬申:year:2026:丙午:ten-god",
        "major:3:壬申:year:2026:丙午:natal:반합:午戌:year",
        "major:3:壬申:year:2026:丙午:element:fire:missing"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:편인"
      ],
      "question": "편인의 관점 질문에서 운-세운 관계가 없고 natal 연지 반합만 있는 차이를 어떻게 제한해 설명할까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:편인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2027",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 32,
      "originalId": "tr:year:C:2027",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5e1d69a1cb8734fd5e9fb8b3f74973ecfde249ca79ce639acef9016c97018ba1"
    },
    "originalState": {
      "id": "tr:year:C:2027",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2027",
      "factsRef": "offline-periods.json#/major/C/years/2027",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"丁未\",\"annualGod\":\"정인\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"未亥 반합 목 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"형\",\"branches\":[\"戌\",\"未\"],\"affectedPillars\":[\"year\"],\"plain\":\"戌未 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"未\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"未戌 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:3:壬申:year:2027:丁未",
        "major:3:壬申:year:2027:丁未:ten-god",
        "major:3:壬申:year:2027:丁未:boundary",
        "major:3:壬申:year:2027:丁未:natal:반합:未亥:month",
        "major:3:壬申:year:2027:丁未:natal:형:戌未:year",
        "major:3:壬申:year:2027:丁未:natal:파:未戌:year",
        "major:3:壬申:year:2027:丁未:element:fire:missing",
        "major:3:壬申:year:2027:丁未:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정인"
      ],
      "question": "정인의 기초 지원과 natal 연지 형·파를 연결할 때 실제 지원의 유무를 꾸며내지 않았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:정인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2028",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 33,
      "originalId": "tr:year:C:2028",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "479d09bea9ad4d04db713e7419281e770d4df011082e1320de4463f3bc7de844"
    },
    "originalState": {
      "id": "tr:year:C:2028",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2028",
      "factsRef": "offline-periods.json#/major/C/years/2028",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"戊申\",\"annualGod\":\"비견\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"申\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"申辰 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"해\",\"branches\":[\"申\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"申亥 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2028:戊申",
        "major:4:辛未:year:2028:戊申:ten-god",
        "major:4:辛未:year:2028:戊申:boundary",
        "major:4:辛未:year:2028:戊申:natal:반합:申辰:day-hour",
        "major:4:辛未:year:2028:戊申:natal:해:申亥:month",
        "major:4:辛未:year:2028:戊申:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:비견"
      ],
      "question": "2028-04-23 21:42 KST 이전 壬申 편재와 이후 辛未 상관을 나누고 비견의 연간 역할을 각 구간에 따로 검토할 준비가 됐는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:비견",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2029",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 34,
      "originalId": "tr:year:C:2029",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e4cbc5a654778928a31111a163f51614e8cf1fdcbf70d4c84a1c7f738da05c96"
    },
    "originalState": {
      "id": "tr:year:C:2029",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2029",
      "factsRef": "offline-periods.json#/major/C/years/2029",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"己酉\",\"annualGod\":\"겁재\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"酉\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"酉戌 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"육합\",\"branches\":[\"辰\",\"酉\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰酉 육합은 시지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2029:己酉",
        "major:4:辛未:year:2029:己酉:ten-god",
        "major:4:辛未:year:2029:己酉:natal:해:酉戌:year",
        "major:4:辛未:year:2029:己酉:natal:육합:辰酉:hour",
        "major:4:辛未:year:2029:己酉:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:겁재"
      ],
      "question": "상관 배경에서 겁재의 공동 배분을 논할 때 natal 연지 해와 시지 육합을 실제 합의의 어떤 다른 조건으로 볼까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:겁재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2030",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 35,
      "originalId": "tr:year:C:2030",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fe740480574b70c32b43acd5955a1e8be80ac681b8bf374cb774d21aa4a9d0e0"
    },
    "originalState": {
      "id": "tr:year:C:2030",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2030",
      "factsRef": "offline-periods.json#/major/C/years/2030",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"庚戌\",\"annualGod\":\"식신\",\"elements\":[\"metal\",\"earth\"],\"cycleRelations\":[{\"type\":\"형\",\"branches\":[\"戌\",\"未\"],\"plain\":\"戌未 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"未\",\"戌\"],\"plain\":\"未戌 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"충\",\"branches\":[\"辰\",\"戌\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰戌 충은 시지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2030:庚戌",
        "major:4:辛未:year:2030:庚戌:ten-god",
        "major:4:辛未:year:2030:庚戌:cycle:형:戌未:cycle",
        "major:4:辛未:year:2030:庚戌:cycle:파:未戌:cycle",
        "major:4:辛未:year:2030:庚戌:natal:충:辰戌:hour",
        "major:4:辛未:year:2030:庚戌:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:식신"
      ],
      "question": "식신의 지속 산출 질문에 운의 戌未 형·파와 natal 시지 辰戌 충을 어떻게 별개로 확인할까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:식신",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2031",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 36,
      "originalId": "tr:year:C:2031",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e0879a7569682ab1ad8245e1004f4fbd8782d6eac0d17cac13b26bfa09259771"
    },
    "originalState": {
      "id": "tr:year:C:2031",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2031",
      "factsRef": "offline-periods.json#/major/C/years/2031",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"辛亥\",\"annualGod\":\"상관\",\"elements\":[\"metal\",\"water\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"亥\",\"未\"],\"plain\":\"亥未 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"형\",\"branches\":[\"亥\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"亥亥 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"해\",\"branches\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"plain\":\"申亥 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2031:辛亥",
        "major:4:辛未:year:2031:辛亥:ten-god",
        "major:4:辛未:year:2031:辛亥:cycle:반합:亥未:cycle",
        "major:4:辛未:year:2031:辛亥:natal:형:亥亥:month",
        "major:4:辛未:year:2031:辛亥:natal:해:申亥:day"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:상관"
      ],
      "question": "상관이 반복돼도 운의 亥未 반합과 natal 월지 亥亥 형을 같은 성격 강화로 합치지 않았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:상관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2032",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 37,
      "originalId": "tr:year:C:2032",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "cf871d318b70a22dce8ddd8c857386a1539302ec749114a83405b3a86614edfc"
    },
    "originalState": {
      "id": "tr:year:C:2032",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2032",
      "factsRef": "offline-periods.json#/major/C/years/2032",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"壬子\",\"annualGod\":\"편재\",\"elements\":[\"water\",\"water\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"子\",\"未\"],\"plain\":\"子未 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}],\"natalRelations\":[{\"type\":\"삼합\",\"branches\":[\"申\",\"子\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"申子辰 삼합 수 흐름은 일지, 시지를 통해 그 해의 큰 흐름을 키울 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2032:壬子",
        "major:4:辛未:year:2032:壬子:ten-god",
        "major:4:辛未:year:2032:壬子:cycle:해:子未:cycle",
        "major:4:辛未:year:2032:壬子:natal:삼합:申子辰:day-hour"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편재"
      ],
      "question": "편재의 탐색 질문에서 운의 子未 해와 natal 申子辰 삼합은 참가자 수와 출처가 어떻게 다른가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:편재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2033",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 38,
      "originalId": "tr:year:C:2033",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "62318e1b651e37441dbde26e20f47b0a15ccee979f35fd128ebf91113d6808cf"
    },
    "originalState": {
      "id": "tr:year:C:2033",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2033",
      "factsRef": "offline-periods.json#/major/C/years/2033",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"癸丑\",\"annualGod\":\"정재\",\"elements\":[\"water\",\"earth\"],\"cycleRelations\":[{\"type\":\"충\",\"branches\":[\"丑\",\"未\"],\"plain\":\"丑未 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"未\",\"丑\"],\"plain\":\"未丑 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"형\",\"branches\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑戌 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"丑辰 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2033:癸丑",
        "major:4:辛未:year:2033:癸丑:ten-god",
        "major:4:辛未:year:2033:癸丑:cycle:충:丑未:cycle",
        "major:4:辛未:year:2033:癸丑:cycle:형:未丑:cycle",
        "major:4:辛未:year:2033:癸丑:natal:형:丑戌:year",
        "major:4:辛未:year:2033:癸丑:natal:파:丑辰:hour",
        "major:4:辛未:year:2033:癸丑:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정재"
      ],
      "question": "정재의 관리 질문과 운의 丑未 충·형을 연결할 때 실제 자원 한도부터 확인했는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:정재",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2034",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 39,
      "originalId": "tr:year:C:2034",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d75ae0889040599552792f6a6f09d39e1fe102e4e9e2111efc93cb4a90ff0d36"
    },
    "originalState": {
      "id": "tr:year:C:2034",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2034",
      "factsRef": "offline-periods.json#/major/C/years/2034",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"甲寅\",\"annualGod\":\"편관\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"寅\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"寅戌 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"寅亥 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"파\",\"branches\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"寅亥 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"충\",\"branches\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"寅申 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"plain\":\"申寅 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2034:甲寅",
        "major:4:辛未:year:2034:甲寅:ten-god",
        "major:4:辛未:year:2034:甲寅:natal:반합:寅戌:year",
        "major:4:辛未:year:2034:甲寅:natal:육합:寅亥:month",
        "major:4:辛未:year:2034:甲寅:natal:파:寅亥:month",
        "major:4:辛未:year:2034:甲寅:natal:충:寅申:day",
        "major:4:辛未:year:2034:甲寅:natal:형:申寅:day"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편관"
      ],
      "question": "편관의 대응 질문에 natal 일지 寅申 충·형과 월지 寅亥 육합·파를 서로 다른 접점으로 남겼는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:편관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2035",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 40,
      "originalId": "tr:year:C:2035",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b563ff341e43c158f8fc06957942a0cc9998f7386518c09c0ea4ac7d09e6a67f"
    },
    "originalState": {
      "id": "tr:year:C:2035",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2035",
      "factsRef": "offline-periods.json#/major/C/years/2035",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"乙卯\",\"annualGod\":\"정관\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"未\"],\"plain\":\"卯未 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯亥 반합 목 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯戌 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2035:乙卯",
        "major:4:辛未:year:2035:乙卯:ten-god",
        "major:4:辛未:year:2035:乙卯:cycle:반합:卯未:cycle",
        "major:4:辛未:year:2035:乙卯:natal:반합:卯亥:month",
        "major:4:辛未:year:2035:乙卯:natal:육합:卯戌:year",
        "major:4:辛未:year:2035:乙卯:natal:해:卯辰:hour"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정관"
      ],
      "question": "정관의 기준 질문에서 운의 卯未 반합과 natal 연지 육합·시지 해를 한 관계 결과로 요약하지 않았는가?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:정관",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:year:C:2036",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 41,
      "originalId": "tr:year:C:2036",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3b95835a0f8f0d9a5b8ef9cf005e97bbd0115fc9c2773b657f7d7ab221176c10"
    },
    "originalState": {
      "id": "tr:year:C:2036",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2036",
      "factsRef": "offline-periods.json#/major/C/years/2036",
      "calculatedFactClass": "B",
      "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"丙辰\",\"annualGod\":\"편인\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"辰申 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"辰戌 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰辰 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
      "evidenceRefs": [
        "major:4:辛未:year:2036:丙辰",
        "major:4:辛未:year:2036:丙辰:ten-god",
        "major:4:辛未:year:2036:丙辰:natal:반합:辰申:day-hour",
        "major:4:辛未:year:2036:丙辰:natal:충:辰戌:year",
        "major:4:辛未:year:2036:丙辰:natal:형:辰辰:hour",
        "major:4:辛未:year:2036:丙辰:element:fire:missing",
        "major:4:辛未:year:2036:丙辰:element:earth:heavy"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편인"
      ],
      "question": "편인 역할이 2026년에 다시 나와도 상관 배경과 natal 연지 辰戌 충·시지 辰辰 형의 차이를 어떤 검증 질문으로 드러낼까?",
      "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
      "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:편인",
        "tr:scope:dayun_saeun"
      ],
      "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:1",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 42,
      "originalId": "tr:month:A:1",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7490c076e1cb7a81223caba42f48fb316284b7abb68bcef36508d5d9e92e415c"
    },
    "originalState": {
      "id": "tr:month:A:1",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-01",
      "factsRef": "offline-periods.json#/annual/A/months/1",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-01-01T00:00:00+09:00\",\"end\":\"2026-01-05T17:23:10+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"子\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-01-05T17:23:10+09:00\",\"end\":\"2026-02-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"丑\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:1:1:month",
        "month-v2:2026:1:1:annual",
        "month-v2:2026:1:1:dayun",
        "month-v2:2026:1:1:ten_gods",
        "month-v2:2026:1:1:elements",
        "month-v2:2026:1:1:month:2026:1:branch:육합:子丑",
        "month-v2:2026:1:1:month:2026:1:branch:충:子午",
        "month-v2:2026:1:1:month:2026:1:branch:형:子卯",
        "month-v2:2026:1:2:month",
        "month-v2:2026:1:2:annual",
        "month-v2:2026:1:2:dayun",
        "month-v2:2026:1:2:ten_gods",
        "month-v2:2026:1:2:elements",
        "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
        "month-v2:2026:1:2:month:2026:1:branch:육합:子丑",
        "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:상관",
        "tr:god:정인"
      ],
      "question": "소한 전 戊子 편인·상관과 이후 己丑 정인·정인을 나누고 natal 접점과 이전 연주 반합을 각각 어떻게 확인할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:상관",
        "tr:god:정인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:2",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 43,
      "originalId": "tr:month:A:2",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6fe2be4af9e9ca77774c0c43f36bebf6c9499f7160d51651c60420e6338173ef"
    },
    "originalState": {
      "id": "tr:month:A:2",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-02",
      "factsRef": "offline-periods.json#/annual/A/months/2",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-02-01T00:00:00+09:00\",\"end\":\"2026-02-04T05:02:08+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"丑\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-02-04T05:02:08+09:00\",\"end\":\"2026-03-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:2:1:month",
        "month-v2:2026:2:1:annual",
        "month-v2:2026:2:1:dayun",
        "month-v2:2026:2:1:ten_gods",
        "month-v2:2026:2:1:elements",
        "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
        "month-v2:2026:2:1:month:2026:2:branch:육합:子丑",
        "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
        "month-v2:2026:2:2:month",
        "month-v2:2026:2:2:annual",
        "month-v2:2026:2:2:dayun",
        "month-v2:2026:2:2:ten_gods",
        "month-v2:2026:2:2:elements",
        "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
        "month-v2:2026:2:2:month:2026:2:element:missing:metal",
        "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
      ],
      "roleRefs": [
        "tr:god:정인",
        "tr:god:비견",
        "tr:god:편재"
      ],
      "question": "입춘 전 정인 기반과 이후 庚寅 비견·편재 역할의 차이를 실효 연주 변경과 함께 설명할 수 있는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정인",
        "tr:god:비견",
        "tr:god:편재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:3",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 44,
      "originalId": "tr:month:A:3",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5ff6e66fb500a731e6411599beb26b25743132a93b1f3de8bd709610a2ff07d1"
    },
    "originalState": {
      "id": "tr:month:A:3",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-03",
      "factsRef": "offline-periods.json#/annual/A/months/3",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-03-01T00:00:00+09:00\",\"end\":\"2026-03-05T22:59:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-03-05T22:59:00+09:00\",\"end\":\"2026-04-01T00:00:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"卯\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:3:1:month",
        "month-v2:2026:3:1:annual",
        "month-v2:2026:3:1:dayun",
        "month-v2:2026:3:1:ten_gods",
        "month-v2:2026:3:1:elements",
        "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
        "month-v2:2026:3:1:month:2026:3:element:missing:metal",
        "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
        "month-v2:2026:3:2:month",
        "month-v2:2026:3:2:annual",
        "month-v2:2026:3:2:dayun",
        "month-v2:2026:3:2:ten_gods",
        "month-v2:2026:3:2:elements",
        "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
        "month-v2:2026:3:2:month:2026:3:branch:형:子卯",
        "month-v2:2026:3:2:month:2026:3:element:missing:metal",
        "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
      ],
      "roleRefs": [
        "tr:god:비견",
        "tr:god:편재",
        "tr:god:겁재",
        "tr:god:정재"
      ],
      "question": "비견·편재에서 辛卯 겁재·정재로 바뀔 때 독자 탐색과 공동 자원 관리를 어떤 실제 과제로 구별할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:비견",
        "tr:god:편재",
        "tr:god:겁재",
        "tr:god:정재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:4",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 45,
      "originalId": "tr:month:A:4",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c551b9f8f5e2b8ad12ef49c2b26cf6740ac869e9e4915a8c21162c695a40a291"
    },
    "originalState": {
      "id": "tr:month:A:4",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-04",
      "factsRef": "offline-periods.json#/annual/A/months/4",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-04-01T00:00:00+09:00\",\"end\":\"2026-04-05T03:40:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"卯\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-04-05T03:40:00+09:00\",\"end\":\"2026-05-01T00:00:00+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:반합:辰子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"辰\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:4:1:month",
        "month-v2:2026:4:1:annual",
        "month-v2:2026:4:1:dayun",
        "month-v2:2026:4:1:ten_gods",
        "month-v2:2026:4:1:elements",
        "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
        "month-v2:2026:4:1:month:2026:4:branch:형:子卯",
        "month-v2:2026:4:1:month:2026:4:element:missing:metal",
        "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
        "month-v2:2026:4:2:month",
        "month-v2:2026:4:2:annual",
        "month-v2:2026:4:2:dayun",
        "month-v2:2026:4:2:ten_gods",
        "month-v2:2026:4:2:elements",
        "month-v2:2026:4:2:month:2026:4:branch:반합:辰子",
        "month-v2:2026:4:2:month:2026:4:branch:파:丑辰",
        "month-v2:2026:4:2:month:2026:4:branch:해:卯辰"
      ],
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:정재",
        "tr:god:식신",
        "tr:god:편인"
      ],
      "question": "겁재의 분담에서 壬辰 식신·편인으로 넘어갈 때 작은 산출과 다른 관점의 검증을 나눌 수 있는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:겁재",
        "tr:god:정재",
        "tr:god:식신",
        "tr:god:편인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:5",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 46,
      "originalId": "tr:month:A:5",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fc485cdb5501c5a5cf1debd68c9c733ce824a6e26a5815f942bb7cc7cecb378c"
    },
    "originalState": {
      "id": "tr:month:A:5",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-05",
      "factsRef": "offline-periods.json#/annual/A/months/5",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-05-01T00:00:00+09:00\",\"end\":\"2026-05-05T20:48:44+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:반합:辰子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"辰\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-05-05T20:48:44+09:00\",\"end\":\"2026-06-01T00:00:00+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:반합:巳丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:4:해:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:4:형:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:5:1:month",
        "month-v2:2026:5:1:annual",
        "month-v2:2026:5:1:dayun",
        "month-v2:2026:5:1:ten_gods",
        "month-v2:2026:5:1:elements",
        "month-v2:2026:5:1:month:2026:5:branch:반합:辰子",
        "month-v2:2026:5:1:month:2026:5:branch:파:丑辰",
        "month-v2:2026:5:1:month:2026:5:branch:해:卯辰",
        "month-v2:2026:5:2:month",
        "month-v2:2026:5:2:annual",
        "month-v2:2026:5:2:dayun",
        "month-v2:2026:5:2:ten_gods",
        "month-v2:2026:5:2:elements",
        "month-v2:2026:5:2:month:2026:5:branch:반합:巳丑",
        "month-v2:2026:5:2:month_dayun_branch:4:해:寅巳",
        "month-v2:2026:5:2:month_dayun_branch:4:형:寅巳"
      ],
      "roleRefs": [
        "tr:god:식신",
        "tr:god:편인",
        "tr:god:상관",
        "tr:god:편관"
      ],
      "question": "癸巳 상관·편관 구간에서 운의 寅巳 해·형은 제안과 요구 사이의 어떤 실제 조건을 확인하게 하는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:식신",
        "tr:god:편인",
        "tr:god:상관",
        "tr:god:편관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:6",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 47,
      "originalId": "tr:month:A:6",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "752df4a6d4316cef7e73d3f19f6fc61c7eba15bac7d50b93564d8321587c6243"
    },
    "originalState": {
      "id": "tr:month:A:6",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-06",
      "factsRef": "offline-periods.json#/annual/A/months/6",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-06-01T00:00:00+09:00\",\"end\":\"2026-06-06T00:48:21+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:반합:巳丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:4:해:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:4:형:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-06-06T00:48:21+09:00\",\"end\":\"2026-07-01T00:00:00+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"午\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"午\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_dayun_branch:4:반합:寅午\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:6:1:month",
        "month-v2:2026:6:1:annual",
        "month-v2:2026:6:1:dayun",
        "month-v2:2026:6:1:ten_gods",
        "month-v2:2026:6:1:elements",
        "month-v2:2026:6:1:month:2026:6:branch:반합:巳丑",
        "month-v2:2026:6:1:month_dayun_branch:4:해:寅巳",
        "month-v2:2026:6:1:month_dayun_branch:4:형:寅巳",
        "month-v2:2026:6:2:month",
        "month-v2:2026:6:2:annual",
        "month-v2:2026:6:2:dayun",
        "month-v2:2026:6:2:ten_gods",
        "month-v2:2026:6:2:elements",
        "month-v2:2026:6:2:month:2026:6:branch:해:丑午",
        "month-v2:2026:6:2:month:2026:6:branch:형:午午",
        "month-v2:2026:6:2:month:2026:6:branch:충:子午",
        "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
        "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
        "month-v2:2026:6:2:month_dayun_branch:4:반합:寅午"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:편관",
        "tr:god:편재",
        "tr:god:정관"
      ],
      "question": "甲午 편재·정관 구간의 natal 일지 子午 충과 운의 寅午 반합을 서로 다른 대상의 질문으로 유지했는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:편관",
        "tr:god:편재",
        "tr:god:정관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:7",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 48,
      "originalId": "tr:month:A:7",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "11032ade4ed0944c1738b76c1012c60ca6932ab4e71728f7dce25bac2e8ba6f7"
    },
    "originalState": {
      "id": "tr:month:A:7",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-07",
      "factsRef": "offline-periods.json#/annual/A/months/7",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-07-01T00:00:00+09:00\",\"end\":\"2026-07-07T10:56:57+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"午\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"午\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_dayun_branch:4:반합:寅午\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-07-07T10:56:57+09:00\",\"end\":\"2026-08-01T00:00:00+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"未\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"未\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:7:1:month",
        "month-v2:2026:7:1:annual",
        "month-v2:2026:7:1:dayun",
        "month-v2:2026:7:1:ten_gods",
        "month-v2:2026:7:1:elements",
        "month-v2:2026:7:1:month:2026:7:branch:해:丑午",
        "month-v2:2026:7:1:month:2026:7:branch:형:午午",
        "month-v2:2026:7:1:month:2026:7:branch:충:子午",
        "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
        "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
        "month-v2:2026:7:1:month_dayun_branch:4:반합:寅午",
        "month-v2:2026:7:2:month",
        "month-v2:2026:7:2:annual",
        "month-v2:2026:7:2:dayun",
        "month-v2:2026:7:2:ten_gods",
        "month-v2:2026:7:2:elements",
        "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
        "month-v2:2026:7:2:month:2026:7:branch:충:丑未",
        "month-v2:2026:7:2:month:2026:7:branch:형:未丑",
        "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
        "month-v2:2026:7:2:month:2026:7:branch:해:子未",
        "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정관",
        "tr:god:정재",
        "tr:god:정인"
      ],
      "question": "乙未 정재·정인 구간에서 natal 연지 충·형과 월지 육합을 자원 운영과 지원 조건으로 따로 확인할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:정관",
        "tr:god:정재",
        "tr:god:정인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:8",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 49,
      "originalId": "tr:month:A:8",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "907952a136ce5925fe6542423c8b36ba8e66b272f59be2791a93b8b350495985"
    },
    "originalState": {
      "id": "tr:month:A:8",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-08",
      "factsRef": "offline-periods.json#/annual/A/months/8",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-08-01T00:00:00+09:00\",\"end\":\"2026-08-07T20:42:43+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"未\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"未\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-08-07T20:42:43+09:00\",\"end\":\"2026-09-01T00:00:00+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:8:2:month:2026:8:branch:반합:申子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month_dayun_branch:4:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month_dayun_branch:4:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:8:1:month",
        "month-v2:2026:8:1:annual",
        "month-v2:2026:8:1:dayun",
        "month-v2:2026:8:1:ten_gods",
        "month-v2:2026:8:1:elements",
        "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
        "month-v2:2026:8:1:month:2026:8:branch:충:丑未",
        "month-v2:2026:8:1:month:2026:8:branch:형:未丑",
        "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
        "month-v2:2026:8:1:month:2026:8:branch:해:子未",
        "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
        "month-v2:2026:8:2:month",
        "month-v2:2026:8:2:annual",
        "month-v2:2026:8:2:dayun",
        "month-v2:2026:8:2:ten_gods",
        "month-v2:2026:8:2:elements",
        "month-v2:2026:8:2:month:2026:8:branch:반합:申子",
        "month-v2:2026:8:2:month:2026:8:element:missing:metal",
        "month-v2:2026:8:2:month_dayun_branch:4:충:寅申",
        "month-v2:2026:8:2:month_dayun_branch:4:형:申寅"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:정인",
        "tr:god:편관",
        "tr:god:비견"
      ],
      "question": "丙申 편관·비견 구간에서 운의 寅申 충·형과 natal 일지 申子 반합을 장기 배치와 작은 실행으로 나눴는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:정인",
        "tr:god:편관",
        "tr:god:비견",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:9",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 50,
      "originalId": "tr:month:A:9",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a5193d11e3334e7bda5c29d5f3dd362ac8aa3e8e278bda1f5237b8a3db46f144"
    },
    "originalState": {
      "id": "tr:month:A:9",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-09",
      "factsRef": "offline-periods.json#/annual/A/months/9",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-09-01T00:00:00+09:00\",\"end\":\"2026-09-07T23:41:16+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:9:1:month:2026:9:branch:반합:申子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month_dayun_branch:4:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month_dayun_branch:4:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-09-07T23:41:16+09:00\",\"end\":\"2026-10-01T00:00:00+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:반합:酉丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:파:子酉\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"酉\",\"participants\":[\"子\",\"酉\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:9:1:month",
        "month-v2:2026:9:1:annual",
        "month-v2:2026:9:1:dayun",
        "month-v2:2026:9:1:ten_gods",
        "month-v2:2026:9:1:elements",
        "month-v2:2026:9:1:month:2026:9:branch:반합:申子",
        "month-v2:2026:9:1:month:2026:9:element:missing:metal",
        "month-v2:2026:9:1:month_dayun_branch:4:충:寅申",
        "month-v2:2026:9:1:month_dayun_branch:4:형:申寅",
        "month-v2:2026:9:2:month",
        "month-v2:2026:9:2:annual",
        "month-v2:2026:9:2:dayun",
        "month-v2:2026:9:2:ten_gods",
        "month-v2:2026:9:2:elements",
        "month-v2:2026:9:2:month:2026:9:branch:반합:酉丑",
        "month-v2:2026:9:2:month:2026:9:branch:파:子酉",
        "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
        "month-v2:2026:9:2:month:2026:9:element:missing:metal"
      ],
      "roleRefs": [
        "tr:god:편관",
        "tr:god:비견",
        "tr:god:정관",
        "tr:god:겁재"
      ],
      "question": "丁酉 정관·겁재 구간에서 운-월 관계가 사라지고 natal 시지 卯酉 충이 남는 차이는 무엇인가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편관",
        "tr:god:비견",
        "tr:god:정관",
        "tr:god:겁재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:10",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 51,
      "originalId": "tr:month:A:10",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "54f99e6c6054f6d0935317a5cc3b9af3ad00dea2e4dc127ea48fef049ef6cb01"
    },
    "originalState": {
      "id": "tr:month:A:10",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-10",
      "factsRef": "offline-periods.json#/annual/A/months/10",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-10-01T00:00:00+09:00\",\"end\":\"2026-10-08T15:29:17+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:반합:酉丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:파:子酉\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"酉\",\"participants\":[\"子\",\"酉\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-10-08T15:29:17+09:00\",\"end\":\"2026-11-01T00:00:00+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_dayun_branch:4:반합:寅戌\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:10:1:month",
        "month-v2:2026:10:1:annual",
        "month-v2:2026:10:1:dayun",
        "month-v2:2026:10:1:ten_gods",
        "month-v2:2026:10:1:elements",
        "month-v2:2026:10:1:month:2026:10:branch:반합:酉丑",
        "month-v2:2026:10:1:month:2026:10:branch:파:子酉",
        "month-v2:2026:10:1:month:2026:10:branch:충:卯酉",
        "month-v2:2026:10:1:month:2026:10:element:missing:metal",
        "month-v2:2026:10:2:month",
        "month-v2:2026:10:2:annual",
        "month-v2:2026:10:2:dayun",
        "month-v2:2026:10:2:ten_gods",
        "month-v2:2026:10:2:elements",
        "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
        "month-v2:2026:10:2:month:2026:10:branch:형:丑戌",
        "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
        "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
        "month-v2:2026:10:2:month_dayun_branch:4:반합:寅戌"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:겁재",
        "tr:god:편인"
      ],
      "question": "戊戌 편인·편인 구간에서 운寅·연午·월戌이 보여도 실제 기간쌍 반합만 검출됐음을 구별하고 허위3기간 삼합 승격을 막았는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:겁재",
        "tr:god:편인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:11",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 52,
      "originalId": "tr:month:A:11",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "976b9af4fd201c6dcaf1dda058c7a423a5cf2c23ba0bad42177ea6c4a1b89bff"
    },
    "originalState": {
      "id": "tr:month:A:11",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-11",
      "factsRef": "offline-periods.json#/annual/A/months/11",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-11-01T00:00:00+09:00\",\"end\":\"2026-11-07T18:52:05+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_dayun_branch:4:반합:寅戌\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-11-07T18:52:05+09:00\",\"end\":\"2026-12-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:반합:亥卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:4:육합:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:4:파:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:11:1:month",
        "month-v2:2026:11:1:annual",
        "month-v2:2026:11:1:dayun",
        "month-v2:2026:11:1:ten_gods",
        "month-v2:2026:11:1:elements",
        "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
        "month-v2:2026:11:1:month:2026:11:branch:형:丑戌",
        "month-v2:2026:11:1:month:2026:11:branch:육합:卯戌",
        "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
        "month-v2:2026:11:1:month_dayun_branch:4:반합:寅戌",
        "month-v2:2026:11:2:month",
        "month-v2:2026:11:2:annual",
        "month-v2:2026:11:2:dayun",
        "month-v2:2026:11:2:ten_gods",
        "month-v2:2026:11:2:elements",
        "month-v2:2026:11:2:month:2026:11:branch:반합:亥卯",
        "month-v2:2026:11:2:month_dayun_branch:4:육합:寅亥",
        "month-v2:2026:11:2:month_dayun_branch:4:파:寅亥"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:정인",
        "tr:god:식신"
      ],
      "question": "己亥 정인·식신 구간에서 운과의 육합·파를 지원의 활용과 산출 유지의 어떤 질문으로 나눌까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:정인",
        "tr:god:식신",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:A:12",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 53,
      "originalId": "tr:month:A:12",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7505c9f23eff2059d613278be551b1eddef396c3b5775175098ffdca3ad5ee46"
    },
    "originalState": {
      "id": "tr:month:A:12",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "A",
      "period": "2026-12",
      "factsRef": "offline-periods.json#/annual/A/months/12",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-12-01T00:00:00+09:00\",\"end\":\"2026-12-07T11:52:32+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:반합:亥卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:4:육합:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:4:파:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-12-07T11:52:32+09:00\",\"end\":\"2027-01-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"子\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_annual_branch:丙午:충:子午\",\"source\":\"month_annual_branch\",\"type\":\"충\",\"participants\":[\"子\",\"午\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:12:1:month",
        "month-v2:2026:12:1:annual",
        "month-v2:2026:12:1:dayun",
        "month-v2:2026:12:1:ten_gods",
        "month-v2:2026:12:1:elements",
        "month-v2:2026:12:1:month:2026:12:branch:반합:亥卯",
        "month-v2:2026:12:1:month_dayun_branch:4:육합:寅亥",
        "month-v2:2026:12:1:month_dayun_branch:4:파:寅亥",
        "month-v2:2026:12:2:month",
        "month-v2:2026:12:2:annual",
        "month-v2:2026:12:2:dayun",
        "month-v2:2026:12:2:ten_gods",
        "month-v2:2026:12:2:elements",
        "month-v2:2026:12:2:month:2026:12:branch:육합:子丑",
        "month-v2:2026:12:2:month:2026:12:branch:충:子午",
        "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
        "month-v2:2026:12:2:month:2026:12:element:missing:metal",
        "month-v2:2026:12:2:month_annual_branch:丙午:충:子午"
      ],
      "roleRefs": [
        "tr:god:정인",
        "tr:god:식신",
        "tr:god:비견",
        "tr:god:상관"
      ],
      "question": "庚子 비견·상관 구간에서 natal 월지와 실효 연주 각각의 子午 충은 소유자가 어떻게 다른가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정인",
        "tr:god:식신",
        "tr:god:비견",
        "tr:god:상관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:1",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 54,
      "originalId": "tr:month:B:1",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d08f786279dd01e1b747661a1963ff68d7911cd7565347a2b164e16ebd02f7b9"
    },
    "originalState": {
      "id": "tr:month:B:1",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-01",
      "factsRef": "offline-periods.json#/annual/B/months/1",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-01-01T00:00:00+09:00\",\"end\":\"2026-01-05T17:23:10+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"子\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:반합:子申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month_dayun_branch:4:형:子卯\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"子\",\"卯\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-01-05T17:23:10+09:00\",\"end\":\"2026-02-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:1:1:month",
        "month-v2:2026:1:1:annual",
        "month-v2:2026:1:1:dayun",
        "month-v2:2026:1:1:ten_gods",
        "month-v2:2026:1:1:elements",
        "month-v2:2026:1:1:month:2026:1:branch:반합:子申",
        "month-v2:2026:1:1:month:2026:1:branch:충:子午",
        "month-v2:2026:1:1:month:2026:1:branch:해:子未",
        "month-v2:2026:1:1:month:2026:1:branch:형:子卯",
        "month-v2:2026:1:1:month:2026:1:element:missing:water",
        "month-v2:2026:1:1:month_dayun_branch:4:형:子卯",
        "month-v2:2026:1:2:month",
        "month-v2:2026:1:2:annual",
        "month-v2:2026:1:2:dayun",
        "month-v2:2026:1:2:ten_gods",
        "month-v2:2026:1:2:elements",
        "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
        "month-v2:2026:1:2:month:2026:1:branch:충:丑未",
        "month-v2:2026:1:2:month:2026:1:branch:형:未丑",
        "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정인",
        "tr:god:정재"
      ],
      "question": "戊子 편재·정인에서 己丑 정재·정재로 바뀌는 자원 운영의 실제 확인 항목은 무엇인가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:정인",
        "tr:god:정재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:2",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 55,
      "originalId": "tr:month:B:2",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "39a3c3b436fad43bd7755f52a9302be0c5afd1dcdc57841e0264a9a77c5e4842"
    },
    "originalState": {
      "id": "tr:month:B:2",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-02",
      "factsRef": "offline-periods.json#/annual/B/months/2",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-02-01T00:00:00+09:00\",\"end\":\"2026-02-04T05:02:08+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-02-04T05:02:08+09:00\",\"end\":\"2026-03-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:2:1:month",
        "month-v2:2026:2:1:annual",
        "month-v2:2026:2:1:dayun",
        "month-v2:2026:2:1:ten_gods",
        "month-v2:2026:2:1:elements",
        "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
        "month-v2:2026:2:1:month:2026:2:branch:충:丑未",
        "month-v2:2026:2:1:month:2026:2:branch:형:未丑",
        "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
        "month-v2:2026:2:2:month",
        "month-v2:2026:2:2:annual",
        "month-v2:2026:2:2:dayun",
        "month-v2:2026:2:2:ten_gods",
        "month-v2:2026:2:2:elements",
        "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
        "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
        "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
        "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편관",
        "tr:god:비견"
      ],
      "question": "庚寅 편관·비견과 실효 丙午 식신의 역할을 섞지 않고 요구·독자 수행·산출을 구별할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:편관",
        "tr:god:비견",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:3",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 56,
      "originalId": "tr:month:B:3",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b52f137f505b6af27f0d42649e87ae60b4abcb15520b90d692ff0db72d3bd3a5"
    },
    "originalState": {
      "id": "tr:month:B:3",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-03",
      "factsRef": "offline-periods.json#/annual/B/months/3",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-03-01T00:00:00+09:00\",\"end\":\"2026-03-05T22:59:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-03-05T22:59:00+09:00\",\"end\":\"2026-04-01T00:00:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:반합:卯未\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:3:1:month",
        "month-v2:2026:3:1:annual",
        "month-v2:2026:3:1:dayun",
        "month-v2:2026:3:1:ten_gods",
        "month-v2:2026:3:1:elements",
        "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
        "month-v2:2026:3:1:month:2026:3:branch:충:寅申",
        "month-v2:2026:3:1:month:2026:3:branch:형:申寅",
        "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
        "month-v2:2026:3:2:month",
        "month-v2:2026:3:2:annual",
        "month-v2:2026:3:2:dayun",
        "month-v2:2026:3:2:ten_gods",
        "month-v2:2026:3:2:elements",
        "month-v2:2026:3:2:month:2026:3:branch:반합:卯未",
        "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
        "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
      ],
      "roleRefs": [
        "tr:god:편관",
        "tr:god:비견",
        "tr:god:정관",
        "tr:god:겁재"
      ],
      "question": "辛卯 정관·겁재 구간의 natal 반합과 연운 파를 공동 책임의 어떤 합의에서 따로 확인할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편관",
        "tr:god:비견",
        "tr:god:정관",
        "tr:god:겁재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:4",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 57,
      "originalId": "tr:month:B:4",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "839639f19f65d17959891c9acce1d77c730558eee7846e208df00652f59220a5"
    },
    "originalState": {
      "id": "tr:month:B:4",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-04",
      "factsRef": "offline-periods.json#/annual/B/months/4",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-04-01T00:00:00+09:00\",\"end\":\"2026-04-05T03:40:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:반합:卯未\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-04-05T03:40:00+09:00\",\"end\":\"2026-05-01T00:00:00+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month_dayun_branch:4:해:卯辰\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"卯\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:4:1:month",
        "month-v2:2026:4:1:annual",
        "month-v2:2026:4:1:dayun",
        "month-v2:2026:4:1:ten_gods",
        "month-v2:2026:4:1:elements",
        "month-v2:2026:4:1:month:2026:4:branch:반합:卯未",
        "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
        "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
        "month-v2:2026:4:2:month",
        "month-v2:2026:4:2:annual",
        "month-v2:2026:4:2:dayun",
        "month-v2:2026:4:2:ten_gods",
        "month-v2:2026:4:2:elements",
        "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
        "month-v2:2026:4:2:month:2026:4:branch:해:卯辰",
        "month-v2:2026:4:2:month:2026:4:element:missing:water",
        "month-v2:2026:4:2:month_dayun_branch:4:해:卯辰"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:겁재",
        "tr:god:편인",
        "tr:god:편재"
      ],
      "question": "壬辰 편인·정재 구간에서 운과 natal 시지의 卯辰 해가 다른 참가자임을 어떻게 표시할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:겁재",
        "tr:god:편인",
        "tr:god:편재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:5",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 58,
      "originalId": "tr:month:B:5",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "50dc887f31f39b6c8406a2972fda702a976915a62eabc1615feed38423389978"
    },
    "originalState": {
      "id": "tr:month:B:5",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-05",
      "factsRef": "offline-periods.json#/annual/B/months/5",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-05-01T00:00:00+09:00\",\"end\":\"2026-05-05T20:48:44+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month_dayun_branch:4:해:卯辰\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"卯\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-05-05T20:48:44+09:00\",\"end\":\"2026-06-01T00:00:00+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:5:1:month",
        "month-v2:2026:5:1:annual",
        "month-v2:2026:5:1:dayun",
        "month-v2:2026:5:1:ten_gods",
        "month-v2:2026:5:1:elements",
        "month-v2:2026:5:1:month:2026:5:branch:반합:辰申",
        "month-v2:2026:5:1:month:2026:5:branch:해:卯辰",
        "month-v2:2026:5:1:month:2026:5:element:missing:water",
        "month-v2:2026:5:1:month_dayun_branch:4:해:卯辰",
        "month-v2:2026:5:2:month",
        "month-v2:2026:5:2:annual",
        "month-v2:2026:5:2:dayun",
        "month-v2:2026:5:2:ten_gods",
        "month-v2:2026:5:2:elements",
        "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
        "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
        "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
        "month-v2:2026:5:2:month:2026:5:element:missing:water"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:편재",
        "tr:god:정인",
        "tr:god:식신"
      ],
      "question": "癸巳 정인·식신 구간에서 natal 일지 巳申 육합·형·파를 지원과 생산의 실제 조건으로 나눴는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:편재",
        "tr:god:정인",
        "tr:god:식신",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:6",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 59,
      "originalId": "tr:month:B:6",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b7c276572db9ce11b7801d836cfd33589e99d63e6424d53d69c2d0f14ae612dc"
    },
    "originalState": {
      "id": "tr:month:B:6",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-06",
      "factsRef": "offline-periods.json#/annual/B/months/6",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-06-01T00:00:00+09:00\",\"end\":\"2026-06-06T00:48:21+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-06-06T00:48:21+09:00\",\"end\":\"2026-07-01T00:00:00+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_dayun_branch:4:파:卯午\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:6:1:month",
        "month-v2:2026:6:1:annual",
        "month-v2:2026:6:1:dayun",
        "month-v2:2026:6:1:ten_gods",
        "month-v2:2026:6:1:elements",
        "month-v2:2026:6:1:month:2026:6:branch:육합:巳申",
        "month-v2:2026:6:1:month:2026:6:branch:형:巳申",
        "month-v2:2026:6:1:month:2026:6:branch:파:巳申",
        "month-v2:2026:6:1:month:2026:6:element:missing:water",
        "month-v2:2026:6:2:month",
        "month-v2:2026:6:2:annual",
        "month-v2:2026:6:2:dayun",
        "month-v2:2026:6:2:ten_gods",
        "month-v2:2026:6:2:elements",
        "month-v2:2026:6:2:month:2026:6:branch:형:午午",
        "month-v2:2026:6:2:month:2026:6:branch:육합:午未",
        "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
        "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
        "month-v2:2026:6:2:month_dayun_branch:4:파:卯午"
      ],
      "roleRefs": [
        "tr:god:정인",
        "tr:god:식신",
        "tr:god:비견",
        "tr:god:상관"
      ],
      "question": "甲午 비견·상관 구간에서 독자 판단과 새 표현을 나누고 운과의 卯午 파를 어디까지 적용할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정인",
        "tr:god:식신",
        "tr:god:비견",
        "tr:god:상관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:7",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 60,
      "originalId": "tr:month:B:7",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0d910e01aa08bfa5a9916e863d236f11d4794debc3bd4a4619d2041255f0ecb0"
    },
    "originalState": {
      "id": "tr:month:B:7",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-07",
      "factsRef": "offline-periods.json#/annual/B/months/7",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-07-01T00:00:00+09:00\",\"end\":\"2026-07-07T10:56:57+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_dayun_branch:4:파:卯午\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-07-07T10:56:57+09:00\",\"end\":\"2026-08-01T00:00:00+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_dayun_branch:4:반합:卯未\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"卯\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:7:1:month",
        "month-v2:2026:7:1:annual",
        "month-v2:2026:7:1:dayun",
        "month-v2:2026:7:1:ten_gods",
        "month-v2:2026:7:1:elements",
        "month-v2:2026:7:1:month:2026:7:branch:형:午午",
        "month-v2:2026:7:1:month:2026:7:branch:육합:午未",
        "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
        "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
        "month-v2:2026:7:1:month_dayun_branch:4:파:卯午",
        "month-v2:2026:7:2:month",
        "month-v2:2026:7:2:annual",
        "month-v2:2026:7:2:dayun",
        "month-v2:2026:7:2:ten_gods",
        "month-v2:2026:7:2:elements",
        "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
        "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
        "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
        "month-v2:2026:7:2:month_dayun_branch:4:반합:卯未"
      ],
      "roleRefs": [
        "tr:god:비견",
        "tr:god:상관",
        "tr:god:겁재",
        "tr:god:정재"
      ],
      "question": "乙未 겁재·편재 구간의 운·원국 반합과 연운 육합에서 공동 자원과 외부 탐색을 어떻게 구분할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:비견",
        "tr:god:상관",
        "tr:god:겁재",
        "tr:god:정재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:8",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 61,
      "originalId": "tr:month:B:8",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6051885862e476257ad2b6924327fa31b7d036684e0bc1260daeb77e31984684"
    },
    "originalState": {
      "id": "tr:month:B:8",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-08",
      "factsRef": "offline-periods.json#/annual/B/months/8",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-08-01T00:00:00+09:00\",\"end\":\"2026-08-07T20:42:43+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_dayun_branch:4:반합:卯未\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"卯\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-08-07T20:42:43+09:00\",\"end\":\"2026-09-01T00:00:00+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[]}]",
      "evidenceRefs": [
        "month-v2:2026:8:1:month",
        "month-v2:2026:8:1:annual",
        "month-v2:2026:8:1:dayun",
        "month-v2:2026:8:1:ten_gods",
        "month-v2:2026:8:1:elements",
        "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
        "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
        "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
        "month-v2:2026:8:1:month_dayun_branch:4:반합:卯未",
        "month-v2:2026:8:2:month",
        "month-v2:2026:8:2:annual",
        "month-v2:2026:8:2:dayun",
        "month-v2:2026:8:2:ten_gods",
        "month-v2:2026:8:2:elements"
      ],
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:정재",
        "tr:god:식신",
        "tr:god:편관"
      ],
      "question": "丙申 식신·편관 구간에 관계 배열이 비어 있으면 생산과 요구의 십성 질문만 어떻게 남길까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:겁재",
        "tr:god:정재",
        "tr:god:식신",
        "tr:god:편관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:9",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 62,
      "originalId": "tr:month:B:9",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "38eecc07f97e049242a56a99549163d94211eba74b2349d03be1992f718e3630"
    },
    "originalState": {
      "id": "tr:month:B:9",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-09",
      "factsRef": "offline-periods.json#/annual/B/months/9",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-09-01T00:00:00+09:00\",\"end\":\"2026-09-07T23:41:16+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[]},{\"start\":\"2026-09-07T23:41:16+09:00\",\"end\":\"2026-10-01T00:00:00+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month_dayun_branch:4:충:卯酉\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"卯\",\"酉\"],\"monthBranch\":\"酉\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:9:1:month",
        "month-v2:2026:9:1:annual",
        "month-v2:2026:9:1:dayun",
        "month-v2:2026:9:1:ten_gods",
        "month-v2:2026:9:1:elements",
        "month-v2:2026:9:2:month",
        "month-v2:2026:9:2:annual",
        "month-v2:2026:9:2:dayun",
        "month-v2:2026:9:2:ten_gods",
        "month-v2:2026:9:2:elements",
        "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
        "month-v2:2026:9:2:month_dayun_branch:4:충:卯酉"
      ],
      "roleRefs": [
        "tr:god:식신",
        "tr:god:편관",
        "tr:god:상관",
        "tr:god:정관"
      ],
      "question": "丁酉 상관·정관에서 natal 시지와 운지의 卯酉 충을 서로 다른 기준 검토로 볼 수 있는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:식신",
        "tr:god:편관",
        "tr:god:상관",
        "tr:god:정관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:10",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 63,
      "originalId": "tr:month:B:10",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f72344dcfb3a8505ed710d90bd3fc37bc91d57c029ba70f077592e6728f0458a"
    },
    "originalState": {
      "id": "tr:month:B:10",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-10",
      "factsRef": "offline-periods.json#/annual/B/months/10",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-10-01T00:00:00+09:00\",\"end\":\"2026-10-08T15:29:17+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month_dayun_branch:4:충:卯酉\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"卯\",\"酉\"],\"monthBranch\":\"酉\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-10-08T15:29:17+09:00\",\"end\":\"2026-11-01T00:00:00+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"戌\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_dayun_branch:4:육합:卯戌\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"卯\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:10:1:month",
        "month-v2:2026:10:1:annual",
        "month-v2:2026:10:1:dayun",
        "month-v2:2026:10:1:ten_gods",
        "month-v2:2026:10:1:elements",
        "month-v2:2026:10:1:month:2026:10:branch:충:卯酉",
        "month-v2:2026:10:1:month_dayun_branch:4:충:卯酉",
        "month-v2:2026:10:2:month",
        "month-v2:2026:10:2:annual",
        "month-v2:2026:10:2:dayun",
        "month-v2:2026:10:2:ten_gods",
        "month-v2:2026:10:2:elements",
        "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
        "month-v2:2026:10:2:month:2026:10:branch:형:戌未",
        "month-v2:2026:10:2:month:2026:10:branch:파:未戌",
        "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
        "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
        "month-v2:2026:10:2:month_dayun_branch:4:육합:卯戌"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정관",
        "tr:god:편재"
      ],
      "question": "戊戌 편재·편재 구간의 새 기회 질문이 반복돼도 natal 형·파와 운 육합을 별개로 확인했는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:정관",
        "tr:god:편재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:11",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 64,
      "originalId": "tr:month:B:11",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b65459379a9b381ecea193e2245d3c3247c952a3777ceeb145a876edc10dd568"
    },
    "originalState": {
      "id": "tr:month:B:11",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-11",
      "factsRef": "offline-periods.json#/annual/B/months/11",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-11-01T00:00:00+09:00\",\"end\":\"2026-11-07T18:52:05+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"戌\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_dayun_branch:4:육합:卯戌\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"卯\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-11-07T18:52:05+09:00\",\"end\":\"2026-12-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:삼합:亥卯未\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:4:반합:亥卯\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"亥\",\"卯\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:11:1:month",
        "month-v2:2026:11:1:annual",
        "month-v2:2026:11:1:dayun",
        "month-v2:2026:11:1:ten_gods",
        "month-v2:2026:11:1:elements",
        "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
        "month-v2:2026:11:1:month:2026:11:branch:형:戌未",
        "month-v2:2026:11:1:month:2026:11:branch:파:未戌",
        "month-v2:2026:11:1:month:2026:11:branch:육합:卯戌",
        "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
        "month-v2:2026:11:1:month_dayun_branch:4:육합:卯戌",
        "month-v2:2026:11:2:month",
        "month-v2:2026:11:2:annual",
        "month-v2:2026:11:2:dayun",
        "month-v2:2026:11:2:ten_gods",
        "month-v2:2026:11:2:elements",
        "month-v2:2026:11:2:month:2026:11:branch:삼합:亥卯未",
        "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
        "month-v2:2026:11:2:month:2026:11:element:missing:water",
        "month-v2:2026:11:2:month_dayun_branch:4:반합:亥卯"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:정재",
        "tr:god:편인"
      ],
      "question": "己亥 정재·편인 구간에서 실제 natal 삼합과 운의 반합을 구성 수·원국 자리로 구별했는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:정재",
        "tr:god:편인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:B:12",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 65,
      "originalId": "tr:month:B:12",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4d69b92a66b4afa25d4260fcd3cd1c1cd508a72f187b6080d03b48c34c16b7b0"
    },
    "originalState": {
      "id": "tr:month:B:12",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "B",
      "period": "2026-12",
      "factsRef": "offline-periods.json#/annual/B/months/12",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-12-01T00:00:00+09:00\",\"end\":\"2026-12-07T11:52:32+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:삼합:亥卯未\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:4:반합:亥卯\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"亥\",\"卯\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-12-07T11:52:32+09:00\",\"end\":\"2027-01-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"子\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:반합:子申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_annual_branch:丙午:충:子午\",\"source\":\"month_annual_branch\",\"type\":\"충\",\"participants\":[\"子\",\"午\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_dayun_branch:4:형:子卯\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"子\",\"卯\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:12:1:month",
        "month-v2:2026:12:1:annual",
        "month-v2:2026:12:1:dayun",
        "month-v2:2026:12:1:ten_gods",
        "month-v2:2026:12:1:elements",
        "month-v2:2026:12:1:month:2026:12:branch:삼합:亥卯未",
        "month-v2:2026:12:1:month:2026:12:branch:해:申亥",
        "month-v2:2026:12:1:month:2026:12:element:missing:water",
        "month-v2:2026:12:1:month_dayun_branch:4:반합:亥卯",
        "month-v2:2026:12:2:month",
        "month-v2:2026:12:2:annual",
        "month-v2:2026:12:2:dayun",
        "month-v2:2026:12:2:ten_gods",
        "month-v2:2026:12:2:elements",
        "month-v2:2026:12:2:month:2026:12:branch:반합:子申",
        "month-v2:2026:12:2:month:2026:12:branch:충:子午",
        "month-v2:2026:12:2:month:2026:12:branch:해:子未",
        "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
        "month-v2:2026:12:2:month:2026:12:element:missing:water",
        "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
        "month-v2:2026:12:2:month_dayun_branch:4:형:子卯"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편인",
        "tr:god:편관",
        "tr:god:정인"
      ],
      "question": "庚子 편관·정인 구간에서 연운 子午 충과 운의 子卯 형을 요구·지원의 어떤 조건으로 나눌까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:편인",
        "tr:god:편관",
        "tr:god:정인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:1",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 66,
      "originalId": "tr:month:C:1",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "aa9f8a79251de4ccd303cedbe34889336c5d3e3dd30de1ee81e3410738e772cc"
    },
    "originalState": {
      "id": "tr:month:C:1",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-01",
      "factsRef": "offline-periods.json#/annual/C/months/1",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-01-01T00:00:00+09:00\",\"end\":\"2026-01-05T17:23:10+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"子\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:삼합:申子辰\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"子\",\"participants\":[\"申\",\"子\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month_dayun_branch:3:반합:申子\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"子\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-01-05T17:23:10+09:00\",\"end\":\"2026-02-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:1:1:month",
        "month-v2:2026:1:1:annual",
        "month-v2:2026:1:1:dayun",
        "month-v2:2026:1:1:ten_gods",
        "month-v2:2026:1:1:elements",
        "month-v2:2026:1:1:month:2026:1:branch:삼합:申子辰",
        "month-v2:2026:1:1:month:2026:1:element:heavy:earth",
        "month-v2:2026:1:1:month_dayun_branch:3:반합:申子",
        "month-v2:2026:1:2:month",
        "month-v2:2026:1:2:annual",
        "month-v2:2026:1:2:dayun",
        "month-v2:2026:1:2:ten_gods",
        "month-v2:2026:1:2:elements",
        "month-v2:2026:1:2:month:2026:1:branch:형:丑戌",
        "month-v2:2026:1:2:month:2026:1:branch:파:丑辰",
        "month-v2:2026:1:2:month:2026:1:element:heavy:earth",
        "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
      ],
      "roleRefs": [
        "tr:god:비견",
        "tr:god:정재",
        "tr:god:겁재"
      ],
      "question": "戊子 비견·정재의 natal 삼합과 己丑 겁재·겁재의 natal 형·파를 같은 자원 공유 조언으로 요약하지 않았는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:비견",
        "tr:god:정재",
        "tr:god:겁재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:2",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 67,
      "originalId": "tr:month:C:2",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fc6d219b606fd4b903ed6c0d387bb857822d59cc776ce222cc9fc738da26428a"
    },
    "originalState": {
      "id": "tr:month:C:2",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-02",
      "factsRef": "offline-periods.json#/annual/C/months/2",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-02-01T00:00:00+09:00\",\"end\":\"2026-02-04T05:02:08+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-02-04T05:02:08+09:00\",\"end\":\"2026-03-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:반합:寅戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:육합:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:파:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_dayun_branch:3:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_dayun_branch:3:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:2:1:month",
        "month-v2:2026:2:1:annual",
        "month-v2:2026:2:1:dayun",
        "month-v2:2026:2:1:ten_gods",
        "month-v2:2026:2:1:elements",
        "month-v2:2026:2:1:month:2026:2:branch:형:丑戌",
        "month-v2:2026:2:1:month:2026:2:branch:파:丑辰",
        "month-v2:2026:2:1:month:2026:2:element:heavy:earth",
        "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
        "month-v2:2026:2:2:month",
        "month-v2:2026:2:2:annual",
        "month-v2:2026:2:2:dayun",
        "month-v2:2026:2:2:ten_gods",
        "month-v2:2026:2:2:elements",
        "month-v2:2026:2:2:month:2026:2:branch:반합:寅戌",
        "month-v2:2026:2:2:month:2026:2:branch:육합:寅亥",
        "month-v2:2026:2:2:month:2026:2:branch:파:寅亥",
        "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
        "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
        "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
        "month-v2:2026:2:2:month_dayun_branch:3:충:寅申",
        "month-v2:2026:2:2:month_dayun_branch:3:형:申寅"
      ],
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:식신",
        "tr:god:편관"
      ],
      "question": "庚寅 식신·편관 구간의 운 寅申 충·형과 연운 寅午 반합을 다른 소유자의 요구와 생산 질문으로 나눌까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:겁재",
        "tr:god:식신",
        "tr:god:편관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:3",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 68,
      "originalId": "tr:month:C:3",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d36d6e6033ac9254ac85f43173336fe9752181d99be02776c7cf44945c2499a0"
    },
    "originalState": {
      "id": "tr:month:C:3",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-03",
      "factsRef": "offline-periods.json#/annual/C/months/3",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-03-01T00:00:00+09:00\",\"end\":\"2026-03-05T22:59:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:반합:寅戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:육합:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:파:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_dayun_branch:3:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_dayun_branch:3:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-03-05T22:59:00+09:00\",\"end\":\"2026-04-01T00:00:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:반합:卯亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:3:1:month",
        "month-v2:2026:3:1:annual",
        "month-v2:2026:3:1:dayun",
        "month-v2:2026:3:1:ten_gods",
        "month-v2:2026:3:1:elements",
        "month-v2:2026:3:1:month:2026:3:branch:반합:寅戌",
        "month-v2:2026:3:1:month:2026:3:branch:육합:寅亥",
        "month-v2:2026:3:1:month:2026:3:branch:파:寅亥",
        "month-v2:2026:3:1:month:2026:3:branch:충:寅申",
        "month-v2:2026:3:1:month:2026:3:branch:형:申寅",
        "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
        "month-v2:2026:3:1:month_dayun_branch:3:충:寅申",
        "month-v2:2026:3:1:month_dayun_branch:3:형:申寅",
        "month-v2:2026:3:2:month",
        "month-v2:2026:3:2:annual",
        "month-v2:2026:3:2:dayun",
        "month-v2:2026:3:2:ten_gods",
        "month-v2:2026:3:2:elements",
        "month-v2:2026:3:2:month:2026:3:branch:반합:卯亥",
        "month-v2:2026:3:2:month:2026:3:branch:육합:卯戌",
        "month-v2:2026:3:2:month:2026:3:branch:해:卯辰",
        "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
      ],
      "roleRefs": [
        "tr:god:식신",
        "tr:god:편관",
        "tr:god:상관",
        "tr:god:정관"
      ],
      "question": "辛卯 상관·정관 구간의 natal 연지 육합과 시지 해를 실제 제안의 기준·검토 조건으로 구분할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:식신",
        "tr:god:편관",
        "tr:god:상관",
        "tr:god:정관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:4",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 69,
      "originalId": "tr:month:C:4",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f9c866a1f2cf4ba99fc28d1ab405f6a36edf9ff0ff54ba0890b7f0889302d285"
    },
    "originalState": {
      "id": "tr:month:C:4",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-04",
      "factsRef": "offline-periods.json#/annual/C/months/4",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-04-01T00:00:00+09:00\",\"end\":\"2026-04-05T03:40:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:반합:卯亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-04-05T03:40:00+09:00\",\"end\":\"2026-05-01T00:00:00+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:형:辰辰\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month_dayun_branch:3:반합:申辰\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:4:1:month",
        "month-v2:2026:4:1:annual",
        "month-v2:2026:4:1:dayun",
        "month-v2:2026:4:1:ten_gods",
        "month-v2:2026:4:1:elements",
        "month-v2:2026:4:1:month:2026:4:branch:반합:卯亥",
        "month-v2:2026:4:1:month:2026:4:branch:육합:卯戌",
        "month-v2:2026:4:1:month:2026:4:branch:해:卯辰",
        "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
        "month-v2:2026:4:2:month",
        "month-v2:2026:4:2:annual",
        "month-v2:2026:4:2:dayun",
        "month-v2:2026:4:2:ten_gods",
        "month-v2:2026:4:2:elements",
        "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
        "month-v2:2026:4:2:month:2026:4:branch:충:辰戌",
        "month-v2:2026:4:2:month:2026:4:branch:형:辰辰",
        "month-v2:2026:4:2:month:2026:4:element:heavy:earth",
        "month-v2:2026:4:2:month_dayun_branch:3:반합:申辰"
      ],
      "roleRefs": [
        "tr:god:상관",
        "tr:god:정관",
        "tr:god:편재",
        "tr:god:비견"
      ],
      "question": "壬辰 편재·비견 구간에서 토 heavy 표지와 natal 辰戌 충을 돈의 위험 점수로 더하지 않았는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:상관",
        "tr:god:정관",
        "tr:god:편재",
        "tr:god:비견",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:5",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 70,
      "originalId": "tr:month:C:5",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e152136280617d2d5a25c718a4c01dd33ae7ae47990df3fc7740757350040b28"
    },
    "originalState": {
      "id": "tr:month:C:5",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-05",
      "factsRef": "offline-periods.json#/annual/C/months/5",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-05-01T00:00:00+09:00\",\"end\":\"2026-05-05T20:48:44+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:형:辰辰\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month_dayun_branch:3:반합:申辰\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-05-05T20:48:44+09:00\",\"end\":\"2026-06-01T00:00:00+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:충:巳亥\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:3:육합:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:3:형:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:3:파:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:5:1:month",
        "month-v2:2026:5:1:annual",
        "month-v2:2026:5:1:dayun",
        "month-v2:2026:5:1:ten_gods",
        "month-v2:2026:5:1:elements",
        "month-v2:2026:5:1:month:2026:5:branch:반합:辰申",
        "month-v2:2026:5:1:month:2026:5:branch:충:辰戌",
        "month-v2:2026:5:1:month:2026:5:branch:형:辰辰",
        "month-v2:2026:5:1:month:2026:5:element:heavy:earth",
        "month-v2:2026:5:1:month_dayun_branch:3:반합:申辰",
        "month-v2:2026:5:2:month",
        "month-v2:2026:5:2:annual",
        "month-v2:2026:5:2:dayun",
        "month-v2:2026:5:2:ten_gods",
        "month-v2:2026:5:2:elements",
        "month-v2:2026:5:2:month:2026:5:branch:충:巳亥",
        "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
        "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
        "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
        "month-v2:2026:5:2:month:2026:5:element:missing:fire",
        "month-v2:2026:5:2:month:2026:5:element:heavy:earth",
        "month-v2:2026:5:2:month_dayun_branch:3:육합:巳申",
        "month-v2:2026:5:2:month_dayun_branch:3:형:巳申",
        "month-v2:2026:5:2:month_dayun_branch:3:파:巳申"
      ],
      "roleRefs": [
        "tr:god:편재",
        "tr:god:비견",
        "tr:god:정재",
        "tr:god:편인"
      ],
      "question": "癸巳 정재·편인 구간의 natal 월지 충과 운의 육합·형·파에서 자원 운영과 정보 검증을 어떻게 나눌까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편재",
        "tr:god:비견",
        "tr:god:정재",
        "tr:god:편인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:6",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 71,
      "originalId": "tr:month:C:6",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0ee64b2555e56812762c2b6505fd8dcb36b1c10d3ed3d6f11be58fb939938c98"
    },
    "originalState": {
      "id": "tr:month:C:6",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-06",
      "factsRef": "offline-periods.json#/annual/C/months/6",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-06-01T00:00:00+09:00\",\"end\":\"2026-06-06T00:48:21+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:충:巳亥\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:3:육합:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:3:형:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:3:파:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-06-06T00:48:21+09:00\",\"end\":\"2026-07-01T00:00:00+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:반합:午戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:6:1:month",
        "month-v2:2026:6:1:annual",
        "month-v2:2026:6:1:dayun",
        "month-v2:2026:6:1:ten_gods",
        "month-v2:2026:6:1:elements",
        "month-v2:2026:6:1:month:2026:6:branch:충:巳亥",
        "month-v2:2026:6:1:month:2026:6:branch:육합:巳申",
        "month-v2:2026:6:1:month:2026:6:branch:형:巳申",
        "month-v2:2026:6:1:month:2026:6:branch:파:巳申",
        "month-v2:2026:6:1:month:2026:6:element:missing:fire",
        "month-v2:2026:6:1:month:2026:6:element:heavy:earth",
        "month-v2:2026:6:1:month_dayun_branch:3:육합:巳申",
        "month-v2:2026:6:1:month_dayun_branch:3:형:巳申",
        "month-v2:2026:6:1:month_dayun_branch:3:파:巳申",
        "month-v2:2026:6:2:month",
        "month-v2:2026:6:2:annual",
        "month-v2:2026:6:2:dayun",
        "month-v2:2026:6:2:ten_gods",
        "month-v2:2026:6:2:elements",
        "month-v2:2026:6:2:month:2026:6:branch:반합:午戌",
        "month-v2:2026:6:2:month:2026:6:element:missing:fire",
        "month-v2:2026:6:2:month:2026:6:element:heavy:earth",
        "month-v2:2026:6:2:month_annual_branch:丙午:형:午午"
      ],
      "roleRefs": [
        "tr:god:정재",
        "tr:god:편인",
        "tr:god:편관",
        "tr:god:정인"
      ],
      "question": "甲午 편관·정인 구간의 실효 연주 午午 형이 natal 형이 아닌 기간간 접점임을 남겼는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정재",
        "tr:god:편인",
        "tr:god:편관",
        "tr:god:정인",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:7",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 72,
      "originalId": "tr:month:C:7",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b8bffd12660003df9b2e7f0302ab636ce8305b1989a8d15c0d281cd8c955c768"
    },
    "originalState": {
      "id": "tr:month:C:7",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-07",
      "factsRef": "offline-periods.json#/annual/C/months/7",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-07-01T00:00:00+09:00\",\"end\":\"2026-07-07T10:56:57+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:반합:午戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-07-07T10:56:57+09:00\",\"end\":\"2026-08-01T00:00:00+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:반합:未亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:7:1:month",
        "month-v2:2026:7:1:annual",
        "month-v2:2026:7:1:dayun",
        "month-v2:2026:7:1:ten_gods",
        "month-v2:2026:7:1:elements",
        "month-v2:2026:7:1:month:2026:7:branch:반합:午戌",
        "month-v2:2026:7:1:month:2026:7:element:missing:fire",
        "month-v2:2026:7:1:month:2026:7:element:heavy:earth",
        "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
        "month-v2:2026:7:2:month",
        "month-v2:2026:7:2:annual",
        "month-v2:2026:7:2:dayun",
        "month-v2:2026:7:2:ten_gods",
        "month-v2:2026:7:2:elements",
        "month-v2:2026:7:2:month:2026:7:branch:반합:未亥",
        "month-v2:2026:7:2:month:2026:7:branch:형:戌未",
        "month-v2:2026:7:2:month:2026:7:branch:파:未戌",
        "month-v2:2026:7:2:month:2026:7:element:heavy:earth",
        "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未"
      ],
      "roleRefs": [
        "tr:god:편관",
        "tr:god:정인",
        "tr:god:정관",
        "tr:god:겁재"
      ],
      "question": "乙未 정관·겁재 구간에서 natal 형·파와 연운 육합을 책임 기준과 분담 조건으로 따로 볼 수 있는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편관",
        "tr:god:정인",
        "tr:god:정관",
        "tr:god:겁재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:8",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 73,
      "originalId": "tr:month:C:8",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b390792ac2b48462c4a332a0032687df6398c4c69134184ef801a2609e9de833"
    },
    "originalState": {
      "id": "tr:month:C:8",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-08",
      "factsRef": "offline-periods.json#/annual/C/months/8",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-08-01T00:00:00+09:00\",\"end\":\"2026-08-07T20:42:43+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:반합:未亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-08-07T20:42:43+09:00\",\"end\":\"2026-09-01T00:00:00+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:8:2:month:2026:8:branch:반합:申辰\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:8:1:month",
        "month-v2:2026:8:1:annual",
        "month-v2:2026:8:1:dayun",
        "month-v2:2026:8:1:ten_gods",
        "month-v2:2026:8:1:elements",
        "month-v2:2026:8:1:month:2026:8:branch:반합:未亥",
        "month-v2:2026:8:1:month:2026:8:branch:형:戌未",
        "month-v2:2026:8:1:month:2026:8:branch:파:未戌",
        "month-v2:2026:8:1:month:2026:8:element:heavy:earth",
        "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
        "month-v2:2026:8:2:month",
        "month-v2:2026:8:2:annual",
        "month-v2:2026:8:2:dayun",
        "month-v2:2026:8:2:ten_gods",
        "month-v2:2026:8:2:elements",
        "month-v2:2026:8:2:month:2026:8:branch:반합:申辰",
        "month-v2:2026:8:2:month:2026:8:branch:해:申亥",
        "month-v2:2026:8:2:month:2026:8:element:missing:fire",
        "month-v2:2026:8:2:month:2026:8:element:heavy:earth"
      ],
      "roleRefs": [
        "tr:god:정관",
        "tr:god:겁재",
        "tr:god:편인",
        "tr:god:식신"
      ],
      "question": "丙申 편인·식신 구간에서 natal 월지 申亥 해는 조사와 산출 사이의 어떤 확인 질문을 주는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정관",
        "tr:god:겁재",
        "tr:god:편인",
        "tr:god:식신",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:9",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 74,
      "originalId": "tr:month:C:9",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "57c05428b3f861143646404a259e42946976c9e468d74847703cc79fe0b86dde"
    },
    "originalState": {
      "id": "tr:month:C:9",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-09",
      "factsRef": "offline-periods.json#/annual/C/months/9",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-09-01T00:00:00+09:00\",\"end\":\"2026-09-07T23:41:16+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:9:1:month:2026:9:branch:반합:申辰\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-09-07T23:41:16+09:00\",\"end\":\"2026-10-01T00:00:00+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:해:酉戌\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:육합:辰酉\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"酉\",\"participants\":[\"辰\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:9:1:month",
        "month-v2:2026:9:1:annual",
        "month-v2:2026:9:1:dayun",
        "month-v2:2026:9:1:ten_gods",
        "month-v2:2026:9:1:elements",
        "month-v2:2026:9:1:month:2026:9:branch:반합:申辰",
        "month-v2:2026:9:1:month:2026:9:branch:해:申亥",
        "month-v2:2026:9:1:month:2026:9:element:missing:fire",
        "month-v2:2026:9:1:month:2026:9:element:heavy:earth",
        "month-v2:2026:9:2:month",
        "month-v2:2026:9:2:annual",
        "month-v2:2026:9:2:dayun",
        "month-v2:2026:9:2:ten_gods",
        "month-v2:2026:9:2:elements",
        "month-v2:2026:9:2:month:2026:9:branch:해:酉戌",
        "month-v2:2026:9:2:month:2026:9:branch:육합:辰酉",
        "month-v2:2026:9:2:month:2026:9:element:missing:fire",
        "month-v2:2026:9:2:month:2026:9:element:heavy:earth"
      ],
      "roleRefs": [
        "tr:god:편인",
        "tr:god:식신",
        "tr:god:정인",
        "tr:god:상관"
      ],
      "question": "丁酉 정인·상관 구간의 natal 시지 辰酉 육합과 연지 酉戌 해를 지원 활용과 새 설명으로 구분할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:편인",
        "tr:god:식신",
        "tr:god:정인",
        "tr:god:상관",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:10",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 75,
      "originalId": "tr:month:C:10",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0ba29b4b9d24a5fe9622220b85f38f0d89c73beacc6220613622bc6a38220811"
    },
    "originalState": {
      "id": "tr:month:C:10",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-10",
      "factsRef": "offline-periods.json#/annual/C/months/10",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-10-01T00:00:00+09:00\",\"end\":\"2026-10-08T15:29:17+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:해:酉戌\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:육합:辰酉\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"酉\",\"participants\":[\"辰\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-10-08T15:29:17+09:00\",\"end\":\"2026-11-01T00:00:00+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"戌\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:10:1:month",
        "month-v2:2026:10:1:annual",
        "month-v2:2026:10:1:dayun",
        "month-v2:2026:10:1:ten_gods",
        "month-v2:2026:10:1:elements",
        "month-v2:2026:10:1:month:2026:10:branch:해:酉戌",
        "month-v2:2026:10:1:month:2026:10:branch:육합:辰酉",
        "month-v2:2026:10:1:month:2026:10:element:missing:fire",
        "month-v2:2026:10:1:month:2026:10:element:heavy:earth",
        "month-v2:2026:10:2:month",
        "month-v2:2026:10:2:annual",
        "month-v2:2026:10:2:dayun",
        "month-v2:2026:10:2:ten_gods",
        "month-v2:2026:10:2:elements",
        "month-v2:2026:10:2:month:2026:10:branch:충:辰戌",
        "month-v2:2026:10:2:month:2026:10:element:heavy:earth",
        "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌"
      ],
      "roleRefs": [
        "tr:god:정인",
        "tr:god:상관",
        "tr:god:비견"
      ],
      "question": "戊戌 비견·비견 구간에서 natal 시지 辰戌 충과 연운 午戌 반합의 다른 접점을 어떻게 확인할까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:정인",
        "tr:god:상관",
        "tr:god:비견",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:11",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 76,
      "originalId": "tr:month:C:11",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f20c7a0b9c13a273ea42cddddc6fe5aaf28d9108345b8d0107ce87b3e434cceb"
    },
    "originalState": {
      "id": "tr:month:C:11",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-11",
      "factsRef": "offline-periods.json#/annual/C/months/11",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-11-01T00:00:00+09:00\",\"end\":\"2026-11-07T18:52:05+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"戌\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-11-07T18:52:05+09:00\",\"end\":\"2026-12-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:형:亥亥\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:3:해:申亥\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"申\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:11:1:month",
        "month-v2:2026:11:1:annual",
        "month-v2:2026:11:1:dayun",
        "month-v2:2026:11:1:ten_gods",
        "month-v2:2026:11:1:elements",
        "month-v2:2026:11:1:month:2026:11:branch:충:辰戌",
        "month-v2:2026:11:1:month:2026:11:element:heavy:earth",
        "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
        "month-v2:2026:11:2:month",
        "month-v2:2026:11:2:annual",
        "month-v2:2026:11:2:dayun",
        "month-v2:2026:11:2:ten_gods",
        "month-v2:2026:11:2:elements",
        "month-v2:2026:11:2:month:2026:11:branch:형:亥亥",
        "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
        "month-v2:2026:11:2:month:2026:11:element:heavy:earth",
        "month-v2:2026:11:2:month_dayun_branch:3:해:申亥"
      ],
      "roleRefs": [
        "tr:god:비견",
        "tr:god:겁재",
        "tr:god:편재"
      ],
      "question": "己亥 겁재·편재 구간에서 운과 natal 일지의 申亥 해를 같은 위험의 중복으로 부풀리지 않았는가?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:비견",
        "tr:god:겁재",
        "tr:god:편재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:month:C:12",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications.ts",
      "exportName": "TEMPORAL_PERIOD_APPLICATIONS",
      "index": 77,
      "originalId": "tr:month:C:12",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6ce2f16a541c2d1c550672e80e4615363f51ddb95ec03a53f6268075c7d26fa1"
    },
    "originalState": {
      "id": "tr:month:C:12",
      "class": "D",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "personCase": "C",
      "period": "2026-12",
      "factsRef": "offline-periods.json#/annual/C/months/12",
      "calculatedFactClass": "B",
      "observedSignature": "[{\"start\":\"2026-12-01T00:00:00+09:00\",\"end\":\"2026-12-07T11:52:32+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:형:亥亥\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:3:해:申亥\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"申\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-12-07T11:52:32+09:00\",\"end\":\"2027-01-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"子\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:삼합:申子辰\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"子\",\"participants\":[\"申\",\"子\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_annual_branch:丙午:충:子午\",\"source\":\"month_annual_branch\",\"type\":\"충\",\"participants\":[\"子\",\"午\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_dayun_branch:3:반합:申子\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"子\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
      "evidenceRefs": [
        "month-v2:2026:12:1:month",
        "month-v2:2026:12:1:annual",
        "month-v2:2026:12:1:dayun",
        "month-v2:2026:12:1:ten_gods",
        "month-v2:2026:12:1:elements",
        "month-v2:2026:12:1:month:2026:12:branch:형:亥亥",
        "month-v2:2026:12:1:month:2026:12:branch:해:申亥",
        "month-v2:2026:12:1:month:2026:12:element:heavy:earth",
        "month-v2:2026:12:1:month_dayun_branch:3:해:申亥",
        "month-v2:2026:12:2:month",
        "month-v2:2026:12:2:annual",
        "month-v2:2026:12:2:dayun",
        "month-v2:2026:12:2:ten_gods",
        "month-v2:2026:12:2:elements",
        "month-v2:2026:12:2:month:2026:12:branch:삼합:申子辰",
        "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
        "month-v2:2026:12:2:month_dayun_branch:3:반합:申子"
      ],
      "roleRefs": [
        "tr:god:겁재",
        "tr:god:편재",
        "tr:god:식신",
        "tr:god:정재"
      ],
      "question": "庚子 식신·정재 구간의 실제 natal 申子辰 삼합과 운의 申子 반합을 어떤 산출·운영 조건으로 나눌까?",
      "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
      "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
      "positiveRiskReversalRefs": [
        "tr:god:겁재",
        "tr:god:편재",
        "tr:god:식신",
        "tr:god:정재",
        "tr:scope:natal_wolun",
        "tr:scope:dayun_wolun",
        "tr:scope:saeun_wolun"
      ],
      "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:dayun-stem",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 0,
      "originalId": "tr:depth:dayun-stem",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f5869b3dde8b25674099ceab02f2f3b052e501a59abfaad24eeae520e815a110"
    },
    "originalState": {
      "id": "tr:depth:dayun-stem",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운 천간",
      "meaning": "일간 대비 운간 십성은 장기 역할의 비교 기준이다.",
      "positive": "반복해 쓸 기능을 정리한다.",
      "risk": "운간을 실제 직업명으로 대체하지 않는다.",
      "reversal": "다른 역할을 맡아도 운간의 원국 기준은 유지된다.",
      "distinction": "운지 본기 십성과 다르다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:dayun-branch",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 1,
      "originalId": "tr:depth:dayun-branch",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b7a3820a44e385c9db43914e79870c516c21042e8bdfc7eb3945bc789a92d112"
    },
    "originalState": {
      "id": "tr:depth:dayun-branch",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운 지지",
      "meaning": "운지는 실제 간지의 지지이며 원국과의 쌍·3자 구조를 별도로 확인한다.",
      "positive": "운간의 역할과 실제 접점의 조건을 함께 살핀다.",
      "risk": "운지 자체와 관계 검출을 같은 근거로 중복 가산하지 않는다.",
      "reversal": "같은 운지라도 natal 구성이 다르면 접점이 다르다.",
      "distinction": "운간과 운지는 서로 다른 구성 요소다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:dayun-strength",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 2,
      "originalId": "tr:depth:dayun-strength",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4d7cc97bd4ad2995377a5c264896cd44bc439c0404f663e93fdd2ac336186f36"
    },
    "originalState": {
      "id": "tr:depth:dayun-strength",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운과 원국 강약",
      "meaning": "원국의 개수 분포는 강약·용신 계산을 대신하지 않는다.",
      "positive": "실제 배합 근거가 있을 때만 보완할 기능을 검토한다.",
      "risk": "missing/heavy 표지를 희신·기신으로 읽지 않는다.",
      "reversal": "부족 요소도 필요하지 않을 수 있고 많은 요소도 쓸 기능이 있을 수 있다.",
      "distinction": "존재 빈도와 계절·통근 기반의 힘 판단은 다르다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:dayun-next",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 3,
      "originalId": "tr:depth:dayun-next",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "de4de544e01bf5841321e6483fb5d56aadcf23ea7eb22160a7c151c0c9b85c48"
    },
    "originalState": {
      "id": "tr:depth:dayun-next",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "현재와 다음 대운",
      "meaning": "각 운간의 십성을 원국 일간 기준으로 독립 비교한 뒤 바뀌는 역할을 찾는다.",
      "positive": "이어갈 기반과 새로 준비할 기능을 나눈다.",
      "risk": "원국 정재나 편관 설명을 다음 대운 편재나 상관의 설명으로 바꾸지 않는다.",
      "reversal": "다음 운의 다른 기능도 기존 강점을 없애기보다 쓰는 조건을 바꿀 수 있다.",
      "distinction": "전환 시각 이전과 이후를 한 장기 배경으로 합치지 않는다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:dayun-phase",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 4,
      "originalId": "tr:depth:dayun-phase",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1724466335c46ffe4bf39540edaf178d0baec0f1236c6a0cb10056e4d602c4f1"
    },
    "originalState": {
      "id": "tr:depth:dayun-phase",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운 내부와 세운",
      "meaning": "early/middle/late 편집 단위와 실제 해별 간지는 별개다.",
      "positive": "같은 배경에서 매년 다르게 나타나는 질문을 살핀다.",
      "risk": "3·4·3년 편집 단위를 새 운 계산으로 설명하지 않는다.",
      "reversal": "유사한 십성이 다시 나와도 관계 참가자는 다를 수 있다.",
      "distinction": "원고 배치와 명리 경계는 구별된다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:dayun-first",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 5,
      "originalId": "tr:depth:dayun-first",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fe04dae82fb2bf7f8a8059bc33eb001442ac0bbe491d483ce6816201e357c6d8"
    },
    "originalState": {
      "id": "tr:depth:dayun-first",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "첫 대운 이전",
      "meaning": "첫 시작 전에는 운간·운지의 활성 근거가 없다.",
      "positive": "확인된 원국·연주·월주만으로 범위를 제한한다.",
      "risk": "아직 시작하지 않은 첫 운을 현재 대운으로 쓰지 않는다.",
      "reversal": "첫 운 후보 구간은 이전 cycle 대신 beforeFirst 상태를 포함할 수 있다.",
      "distinction": "이전 대운이 없다는 것과 계산 실패는 다르다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:saeun-stem-branch",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 6,
      "originalId": "tr:depth:saeun-stem-branch",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1c79b3dedd91f9a039ab55e79f0277d30eaa82c9c16773d08918542eb18c9d26"
    },
    "originalState": {
      "id": "tr:depth:saeun-stem-branch",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "세운 간과 지지",
      "meaning": "일간 대비 연간 십성과 연지 본기 십성을 분리한다.",
      "positive": "드러난 역할과 운영 기반을 두 질문으로 읽는다.",
      "risk": "연지 본기를 전체 지장간의 유일한 의미라고 하지 않는다.",
      "reversal": "운간 역할과 연지 조건이 다르면 실행과 유지의 비용을 나눌 수 있다.",
      "distinction": "연간 십성만 바꾸는 설명보다 실제 두 요소가 제공하는 정보가 늘어난다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:saeun-flow-reference",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 7,
      "originalId": "tr:depth:saeun-flow-reference",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ba81e4ddd84ac5bda5a5de48edd6909b9f7b33e76b399eedbf440effe6721d7a"
    },
    "originalState": {
      "id": "tr:depth:saeun-flow-reference",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "기간 기준 십성",
      "meaning": "flowGod는 대운 천간을 기준으로 실효 연간을 비교한 기존 값이다.",
      "positive": "일간 기준과 기간 기준 두 비교를 구별해 장기-연간 기능의 관계를 묻는다.",
      "risk": "flowGod가 natal annualGod를 대체하지 않는다.",
      "reversal": "기준을 바꾸면 십성이 달라져도 오류가 아니라 질문이 다른 것이다.",
      "distinction": "겉 같은 십성 문자열보다 기준 stem·target stem의 방향이 먼저다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:saeun-year-boundary",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 8,
      "originalId": "tr:depth:saeun-year-boundary",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f33d8495cad015fc9be0f437195b7059e9de0194646ce681207ab77aa62cff98"
    },
    "originalState": {
      "id": "tr:depth:saeun-year-boundary",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "입춘의 연주",
      "meaning": "월운 구간 effectiveAnnualPillar는 입춘 전후 다른 연주를 보존한다.",
      "positive": "연간 상품 선택과 실제 구간 관계를 일치시킬 수 있다.",
      "risk": "1월의 월운 관계를 선택 연간과 임의로 비교하지 않는다.",
      "reversal": "달력 해가 바뀌어도 입춘 전 명리 연주는 이전일 수 있다.",
      "distinction": "선택 연도 정책과 명리 연주의 계산 경계는 별개다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:saeun-native-position",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 9,
      "originalId": "tr:depth:saeun-native-position",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "541f64d58fccea61a9d54cfb6a3ddaa053fda483ae108c1dbfda9a523902ec5d"
    },
    "originalState": {
      "id": "tr:depth:saeun-native-position",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "연운과 원국 자리",
      "meaning": "같은 지지가 여러 출생 자리에 있으면 affectedPillars를 보존한다.",
      "positive": "접점의 위치를 근거 범위로 한정한다.",
      "risk": "그 자리를 부모·배우자 실제 사건으로 확정하지 않는다.",
      "reversal": "같은 쌍은 여러 자리에서 확인될 수 있어도 사건 횟수는 늘지 않는다.",
      "distinction": "중복 값의 자리 정보와 독립 관계 종류는 다르다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:saeun-no-relation",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 10,
      "originalId": "tr:depth:saeun-no-relation",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "88b8ab5d13fc0f17d35e7be5e3d68025193272c8a48c18776510c3a33b7936a8"
    },
    "originalState": {
      "id": "tr:depth:saeun-no-relation",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "관계 없는 연도",
      "meaning": "빈 관계 배열은 해당 검출기에서 일치가 없다는 뜻이다.",
      "positive": "간지·십성·오행의 확인된 차이만 읽는다.",
      "risk": "밋밋함을 피하려고 충·합이나 사건을 만들어내지 않는다.",
      "reversal": "관계가 없어도 십성 관점의 유효한 생활 질문은 남는다.",
      "distinction": "no match와 전체 운의 영향 없음은 같은 주장이 아니다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:saeun-rank",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 11,
      "originalId": "tr:depth:saeun-rank",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5896efe389363255ddc9f657e3ce52827dd73a9f3c08dd5337975cd4c75f1b84"
    },
    "originalState": {
      "id": "tr:depth:saeun-rank",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "연도 강조의 의미",
      "meaning": "현재/전환/관계 등 기존 planner의 강조는 편집상 집중도다.",
      "positive": "읽어볼 근거가 많은 구간을 안내한다.",
      "risk": "HIGH 등급을 운의 좋음·실제 사건 가능성 점수로 쓰지 않는다.",
      "reversal": "강조되지 않은 해도 고유 간지와 전체 본문이 존재한다.",
      "distinction": "중요도와 길흉·확률은 다르다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:wolun-container",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 12,
      "originalId": "tr:depth:wolun-container",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d9b12bd16c7e9f978deb29774c2543d4a3e7e019137681114f7aa0dcd9e19c79"
    },
    "originalState": {
      "id": "tr:depth:wolun-container",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "달력월 용기",
      "meaning": "한 양력월 내부에 실제 절입 경계가 존재한다.",
      "positive": "월초와 절입 뒤를 나눠 바뀐 실행 질문을 만든다.",
      "risk": "달력월 제목을 명리월 전체 동일성으로 읽지 않는다.",
      "reversal": "월이 달라져도 절입 전 월주는 이전 달 후반과 같을 수 있다.",
      "distinction": "12개 월 페이지와 12개 단일 월간지 배열은 다르다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:wolun-main-hidden",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 13,
      "originalId": "tr:depth:wolun-main-hidden",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d18e70ac522f8ff016bab2439937cb3dd3dc2d7078b86ba5f5990d9ff5677a3b"
    },
    "originalState": {
      "id": "tr:depth:wolun-main-hidden",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월지 본기",
      "meaning": "월지 십성은 현재 producer의 본기 한 천간을 일간과 비교한 값이다.",
      "positive": "월간의 역할과 본기의 유지 조건을 나눈다.",
      "risk": "여기서 전체 장간 비율·투출·통근을 계산했다고 하지 않는다.",
      "reversal": "같은 월간 십성도 월지 본기가 다르면 질문이 달라질 수 있다.",
      "distinction": "본기는 지지 자체 또는 숨은 모든 성분과 동일하지 않다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:wolun-focus",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 14,
      "originalId": "tr:depth:wolun-focus",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0ffccd9ccb7201aa14dbcf6f02ac20438be320985de5dc1a691ae774978f2146"
    },
    "originalState": {
      "id": "tr:depth:wolun-focus",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월 focus 구간",
      "meaning": "현재 시각 포함 구간 또는 절입 시작 구간을 대표로 골라도 전체 ledger는 남는다.",
      "positive": "핵심 설명을 어디서 가져왔는지 추적한다.",
      "risk": "대표 구간을 월초부터 말일까지 확장하지 않는다.",
      "reversal": "현재 시각이 바뀌면 focus가 달라질 수 있어도 원래 구간 근거는 그대로다.",
      "distinction": "편집 선택과 시간 근거의 존재를 구분한다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:wolun-annual",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 15,
      "originalId": "tr:depth:wolun-annual",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "55633aabdd8c9d18e9c50266f910e0abd576e74c94e40a360424436d6f947f12"
    },
    "originalState": {
      "id": "tr:depth:wolun-annual",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월과 실효 연주",
      "meaning": "월운-세운 관계는 월 branch와 구간 effectiveAnnual branch의 쌍이다.",
      "positive": "연간 방향을 이번 구간의 조건과 비교한다.",
      "risk": "natal 쌍의 위치 설명을 기간간 관계에 붙이지 않는다.",
      "reversal": "입춘에서 월주와 연주가 동시에 바뀌면 두 변경의 역할을 따로 본다.",
      "distinction": "관계 source month_annual_branch를 보존한다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:wolun-dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 16,
      "originalId": "tr:depth:wolun-dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ca389293f720a26bfe213bc42a017511675005067c2b1eccac3f343b254bcf8e"
    },
    "originalState": {
      "id": "tr:depth:wolun-dayun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월과 대운 후보",
      "meaning": "교운의 earliest/latest가 월 내부이면 구간을 추가 분할한다.",
      "positive": "실제 확정되는 배경 안에서만 행동 질문을 검토한다.",
      "risk": "두 후보와의 관계를 둘 다 confirmed라고 쓰지 않는다.",
      "reversal": "불확실 구간 밖의 설명은 확정 근거로 남길 수 있다.",
      "distinction": "월지 변화와 대운 변화는 다른 경계 원인이다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:depth:wolun-extended",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth.ts",
      "exportName": "TEMPORAL_PERIOD_DEPTH",
      "index": 17,
      "originalId": "tr:depth:wolun-extended",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "cc3cbf5a935f75f1a0399f8dc4a0fcccb9d538918e42b74c6d286b702b023f22"
    },
    "originalState": {
      "id": "tr:depth:wolun-extended",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월운 확장 근거",
      "meaning": "월 target과 실제 natal anchor를 갖는 확장 관찰만 기간 근거로 다룬다.",
      "positive": "원진·십이운성 등의 관찰 출처를 분리한다.",
      "risk": "보류 mangsin·mungok·bokseong·cheoneui·banghap을 승인하지 않는다.",
      "reversal": "같은 feature가 반복되면 관찰 목록을 합쳐도 독립 효과를 더하지 않는다.",
      "distinction": "원국 신살을 새 월운 사실로 재포장하지 않는다.",
      "requires": [
        "관련 producer의 실제 필드",
        "추가 배합·생활 맥락"
      ],
      "excludes": [
        "예언·추정된 과거 경험",
        "다른 기간으로 근거 복사"
      ],
      "scopeRefs": [
        "natal_dayun",
        "natal_saeun",
        "natal_wolun",
        "dayun_saeun",
        "dayun_wolun",
        "saeun_wolun"
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:clash-doom",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 0,
      "originalId": "tr:rejected:clash-doom",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8f88e428f7266ab0c521bf51f1cb9099647be0635135c646007aaeb6c73c1ba2"
    },
    "originalState": {
      "id": "tr:rejected:clash-doom",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충이 있으니 반드시 실패한다",
      "rule": "관계 존재와 결과는 다른 주장이다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "충이 있으니 반드시 실패한다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:harmony-money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 1,
      "originalId": "tr:rejected:harmony-money",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ea1db40d4797047a0d7669a91818ea2e829e0c756c0b263dddc41697e9e4d7c0"
    },
    "originalState": {
      "id": "tr:rejected:harmony-money",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "합이 있으니 수익이 늘어난다",
      "rule": "결합은 소득 자료가 아니다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "합이 있으니 수익이 늘어난다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:same-double",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 2,
      "originalId": "tr:rejected:same-double",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2858d156557f1c56dc2312273af9122ad9b6f168d389ced66c8c4484fdc39c50"
    },
    "originalState": {
      "id": "tr:rejected:same-double",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "같은 십성이 두 번이니 효과가 두 배다",
      "rule": "명칭 반복에 가산 모델이 없다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "같은 십성이 두 번이니 효과가 두 배다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:invent-experience",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 3,
      "originalId": "tr:rejected:invent-experience",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e7300f8f12bd066b3c84823511cfdaebf996ecead59ae502e96c4e3caf395f8e"
    },
    "originalState": {
      "id": "tr:rejected:invent-experience",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "과거 연도에 그 일을 겪었다",
      "rule": "입력에 사건 이력이 없다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "과거 연도에 그 일을 겪었다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:midpoint",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 4,
      "originalId": "tr:rejected:midpoint",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "eb2e3ffcf7a4f95b506d72411b1e41e45cca3745d12a5a910c002ce5b7650386"
    },
    "originalState": {
      "id": "tr:rejected:midpoint",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "미상 교운 범위 중앙값을 실제 시각으로 표시",
      "rule": "불확실성을 임의 제거한다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "미상 교운 범위 중앙값을 실제 시각으로 표시",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:jan1",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 5,
      "originalId": "tr:rejected:jan1",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5065308b2627c5c6e3de80802d7d7c6601a9c99b345b9c258c343bd62fa0b54f"
    },
    "originalState": {
      "id": "tr:rejected:jan1",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운은 시작연도 1월1일부터 적용된다",
      "rule": "실제 전환 시각이 다르다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "대운은 시작연도 1월1일부터 적용된다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:whole-month",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 6,
      "originalId": "tr:rejected:whole-month",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "997c592f83d75698308e90704261efd2c6331ecd4bb629ae275356d13c8967cf"
    },
    "originalState": {
      "id": "tr:rejected:whole-month",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월 focus를 월초부터 말일까지 적용",
      "rule": "절입·교운 이전 ledger가 사라진다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "월 focus를 월초부터 말일까지 적용",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:fake-third",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 7,
      "originalId": "tr:rejected:fake-third",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fc6fa85b686726e70d7dbd02708464409d6a5c52175f1d6eb963f5c083ff4951"
    },
    "originalState": {
      "id": "tr:rejected:fake-third",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합에 빠진 지지를 추가해 삼합으로 해석",
      "rule": "실제 참가자가 없다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "반합에 빠진 지지를 추가해 삼합으로 해석",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:double-wonjin",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 8,
      "originalId": "tr:rejected:double-wonjin",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7724b1459c30e6b4b519889ac06aea1778cebd61ed37e144e2f2d5fa4608b561"
    },
    "originalState": {
      "id": "tr:rejected:double-wonjin",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 관계와 원진살을 두 위험으로 가산",
      "rule": "동일 관찰 재투영일 수 있다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "원진 관계와 원진살을 두 위험으로 가산",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:owner-swap",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 9,
      "originalId": "tr:rejected:owner-swap",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5e67869f12d0c18df532b69d2a1cd172a282f9f15408fd98840ca3bdea40f2da"
    },
    "originalState": {
      "id": "tr:rejected:owner-swap",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원국·세운 관계를 대운·세운 관계로 표시",
      "rule": "참가자의 소유자가 바뀐다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "원국·세운 관계를 대운·세운 관계로 표시",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:flow-swap",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 10,
      "originalId": "tr:rejected:flow-swap",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9a3b79175eb605cb451909c81756e9ddd83f564026f54271c8c25fa39040b31a"
    },
    "originalState": {
      "id": "tr:rejected:flow-swap",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "flowGod를 natal annualGod로 표시",
      "rule": "십성 기준이 다르다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "flowGod를 natal annualGod로 표시",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:sick",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 11,
      "originalId": "tr:rejected:sick",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4b61261d685d0c741bbad7fd5eaabe7897df4d67c43f46010b8cd0976a366acc"
    },
    "originalState": {
      "id": "tr:rejected:sick",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "오행·형·해로 질병과 사고를 예언",
      "rule": "의학·실제 사건 근거가 아니다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "오행·형·해로 질병과 사고를 예언",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:change-natal",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 12,
      "originalId": "tr:rejected:change-natal",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "475329d8bff3646bbd3b989b6b1a52d56b6188240a4362b1dddce007be6ec880"
    },
    "originalState": {
      "id": "tr:rejected:change-natal",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "새 운으로 타고난 성격이 교체된다",
      "rule": "출생 기둥은 바뀌지 않는다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "새 운으로 타고난 성격이 교체된다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:rejected:high-luck",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRejected.ts",
      "exportName": "TEMPORAL_REJECTED",
      "index": 13,
      "originalId": "tr:rejected:high-luck",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e9b092217969b82b5c44cc0d5e31cb1018f52519d9bdd2b65c72dc62802af5d1"
    },
    "originalState": {
      "id": "tr:rejected:high-luck",
      "class": "F",
      "sourceRefs": [
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "planner HIGH는 좋은 운 점수다",
      "rule": "편집 강조와 길흉은 별개다.",
      "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
      "prohibited": "planner HIGH는 좋은 운 점수다",
      "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_rejected",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:stem_hap:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 0,
      "originalId": "tr:relation:stem_hap:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d84ef2e177caa889fd86d3c55dbba792540506dd0a5a6b0a88d938436761b037"
    },
    "originalState": {
      "id": "tr:relation:stem_hap:natal_dayun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "천간합 / natal_dayun",
      "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
      "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
      "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
      "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "stem_hap",
      "definitionRef": "rr:profile:stem_hap",
      "combinationRefs": [
        "rr:combination:stem_hap:甲己",
        "rr:combination:stem_hap:乙庚",
        "rr:combination:stem_hap:丙辛",
        "rr:combination:stem_hap:丁壬",
        "rr:combination:stem_hap:戊癸"
      ],
      "scope": "natal_dayun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:stem_hap:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 1,
      "originalId": "tr:relation:stem_hap:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6b04c643670af0856d2ff9696828554853dc12b19d5a8cba7fd5e34d524e3461"
    },
    "originalState": {
      "id": "tr:relation:stem_hap:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "천간합 / natal_saeun",
      "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
      "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
      "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
      "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "stem_hap",
      "definitionRef": "rr:profile:stem_hap",
      "combinationRefs": [
        "rr:combination:stem_hap:甲己",
        "rr:combination:stem_hap:乙庚",
        "rr:combination:stem_hap:丙辛",
        "rr:combination:stem_hap:丁壬",
        "rr:combination:stem_hap:戊癸"
      ],
      "scope": "natal_saeun",
      "producerSupport": "partial",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. V4 선택 연주 투영은 구간별 실효 연주 ledger가 아니므로 입춘 전 적용을 승인하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:stem_hap:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 2,
      "originalId": "tr:relation:stem_hap:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e5017151312e83ae068eb3357f60eea8217f003f501ec175e5489d7030caf260"
    },
    "originalState": {
      "id": "tr:relation:stem_hap:natal_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "천간합 / natal_wolun",
      "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
      "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
      "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
      "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "stem_hap",
      "definitionRef": "rr:profile:stem_hap",
      "combinationRefs": [
        "rr:combination:stem_hap:甲己",
        "rr:combination:stem_hap:乙庚",
        "rr:combination:stem_hap:丙辛",
        "rr:combination:stem_hap:丁壬",
        "rr:combination:stem_hap:戊癸"
      ],
      "scope": "natal_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:stem_hap:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 3,
      "originalId": "tr:relation:stem_hap:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "960816c599288b9b27713646faef990f8216ce392334dd49e835d718e5c83456"
    },
    "originalState": {
      "id": "tr:relation:stem_hap:dayun_saeun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "천간합 / dayun_saeun",
      "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
      "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
      "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
      "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "stem_hap",
      "definitionRef": "rr:profile:stem_hap",
      "combinationRefs": [
        "rr:combination:stem_hap:甲己",
        "rr:combination:stem_hap:乙庚",
        "rr:combination:stem_hap:丙辛",
        "rr:combination:stem_hap:丁壬",
        "rr:combination:stem_hap:戊癸"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:stem_hap:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 4,
      "originalId": "tr:relation:stem_hap:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5a20d0049b0dd443e3c9d64978322d38f402ec54d315797a1887afaf171cce48"
    },
    "originalState": {
      "id": "tr:relation:stem_hap:dayun_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "천간합 / dayun_wolun",
      "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
      "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
      "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
      "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "stem_hap",
      "definitionRef": "rr:profile:stem_hap",
      "combinationRefs": [
        "rr:combination:stem_hap:甲己",
        "rr:combination:stem_hap:乙庚",
        "rr:combination:stem_hap:丙辛",
        "rr:combination:stem_hap:丁壬",
        "rr:combination:stem_hap:戊癸"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:stem_hap:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 5,
      "originalId": "tr:relation:stem_hap:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5e61dc90f7e910f22f335ca908d9b3fd2093623c18603c3c7057285abd5c9f9a"
    },
    "originalState": {
      "id": "tr:relation:stem_hap:saeun_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "천간합 / saeun_wolun",
      "meaning": "겉에 드러난 기간 기능의 결합을 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "조건이 맞으면 역할을 맞춰 활용하는 질문이 가능하다.",
      "risk": "합의 쌍을 합화·혼인 사건으로 승격하지 않는다.",
      "reversal": "필요한 기능을 붙잡는 결합이면 풀어야 할 조건이 될 수 있다.",
      "distinction": "간의 결합과 지지의 결합은 참가자와 계산 표가 다르다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "stem_hap",
      "definitionRef": "rr:profile:stem_hap",
      "combinationRefs": [
        "rr:combination:stem_hap:甲己",
        "rr:combination:stem_hap:乙庚",
        "rr:combination:stem_hap:丙辛",
        "rr:combination:stem_hap:丁壬",
        "rr:combination:stem_hap:戊癸"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:yukhap:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 6,
      "originalId": "tr:relation:yukhap:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "68f0de36a7c9fc7276e54f6fad2968e78dd5d4926bb031785ee6edd108b10934"
    },
    "originalState": {
      "id": "tr:relation:yukhap:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "육합 / natal_dayun",
      "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
      "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
      "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
      "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "yukhap",
      "definitionRef": "rr:profile:yukhap",
      "combinationRefs": [
        "rr:combination:yukhap:子丑",
        "rr:combination:yukhap:寅亥",
        "rr:combination:yukhap:卯戌",
        "rr:combination:yukhap:辰酉",
        "rr:combination:yukhap:巳申",
        "rr:combination:yukhap:午未"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:yukhap:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 7,
      "originalId": "tr:relation:yukhap:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "23d17312a152a3af948e3490fc3a813f12a9a41c238fcbaa9b0eaabff310c1b3"
    },
    "originalState": {
      "id": "tr:relation:yukhap:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "육합 / natal_saeun",
      "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
      "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
      "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
      "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "yukhap",
      "definitionRef": "rr:profile:yukhap",
      "combinationRefs": [
        "rr:combination:yukhap:子丑",
        "rr:combination:yukhap:寅亥",
        "rr:combination:yukhap:卯戌",
        "rr:combination:yukhap:辰酉",
        "rr:combination:yukhap:巳申",
        "rr:combination:yukhap:午未"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:yukhap:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 8,
      "originalId": "tr:relation:yukhap:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8d4d6b4400765d978bfd64e6a0dd4cfd64dd5bb4103de07cae5d3ba188f629b6"
    },
    "originalState": {
      "id": "tr:relation:yukhap:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "육합 / natal_wolun",
      "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
      "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
      "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
      "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "yukhap",
      "definitionRef": "rr:profile:yukhap",
      "combinationRefs": [
        "rr:combination:yukhap:子丑",
        "rr:combination:yukhap:寅亥",
        "rr:combination:yukhap:卯戌",
        "rr:combination:yukhap:辰酉",
        "rr:combination:yukhap:巳申",
        "rr:combination:yukhap:午未"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:yukhap:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 9,
      "originalId": "tr:relation:yukhap:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "72369ec5e3b87ec76cd70cc8773399ca8501096d1e6660ff032d3c74d86719b3"
    },
    "originalState": {
      "id": "tr:relation:yukhap:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "육합 / dayun_saeun",
      "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
      "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
      "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
      "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "yukhap",
      "definitionRef": "rr:profile:yukhap",
      "combinationRefs": [
        "rr:combination:yukhap:子丑",
        "rr:combination:yukhap:寅亥",
        "rr:combination:yukhap:卯戌",
        "rr:combination:yukhap:辰酉",
        "rr:combination:yukhap:巳申",
        "rr:combination:yukhap:午未"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:yukhap:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 10,
      "originalId": "tr:relation:yukhap:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1b2ef7f97bc08fdd56db8fceac26863f5fd71233dcba60e6e86667012e3e38c9"
    },
    "originalState": {
      "id": "tr:relation:yukhap:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "육합 / dayun_wolun",
      "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
      "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
      "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
      "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "yukhap",
      "definitionRef": "rr:profile:yukhap",
      "combinationRefs": [
        "rr:combination:yukhap:子丑",
        "rr:combination:yukhap:寅亥",
        "rr:combination:yukhap:卯戌",
        "rr:combination:yukhap:辰酉",
        "rr:combination:yukhap:巳申",
        "rr:combination:yukhap:午未"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_dayun_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:yukhap:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 11,
      "originalId": "tr:relation:yukhap:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "166aef56a5d2bc2e372bafb19b8c435a30c7168b2814d279e2f7c24497c000b6"
    },
    "originalState": {
      "id": "tr:relation:yukhap:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "육합 / saeun_wolun",
      "meaning": "두 실제 지지의 결합이 어떤 기간 교집합에서 나타나는지 확인한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "연결을 유지할 실제 접점을 구체화할 수 있다.",
      "risk": "좋은 관계나 성공을 보장하는 결합으로 쓰지 않는다.",
      "reversal": "묶임이 필요한 분리를 방해하는 조건도 검토한다.",
      "distinction": "3자 구조의 삼합과 달리 실제 두 참가자의 접점이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "yukhap",
      "definitionRef": "rr:profile:yukhap",
      "combinationRefs": [
        "rr:combination:yukhap:子丑",
        "rr:combination:yukhap:寅亥",
        "rr:combination:yukhap:卯戌",
        "rr:combination:yukhap:辰酉",
        "rr:combination:yukhap:巳申",
        "rr:combination:yukhap:午未"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_annual_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:chung:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 12,
      "originalId": "tr:relation:chung:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0ed124a4ba2a7f01658250eaba81052cc443a9ada7d6eb005cd710e7d4fae2db"
    },
    "originalState": {
      "id": "tr:relation:chung:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충 / natal_dayun",
      "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
      "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
      "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
      "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "chung",
      "definitionRef": "rr:profile:chung",
      "combinationRefs": [
        "rr:combination:chung:子午",
        "rr:combination:chung:丑未",
        "rr:combination:chung:寅申",
        "rr:combination:chung:卯酉",
        "rr:combination:chung:辰戌",
        "rr:combination:chung:巳亥"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:chung:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 13,
      "originalId": "tr:relation:chung:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "24acacef0d15d7bbbfd17f90646a25a6feeb346ba4fe32f5be3e45b26a1a6477"
    },
    "originalState": {
      "id": "tr:relation:chung:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충 / natal_saeun",
      "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
      "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
      "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
      "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "chung",
      "definitionRef": "rr:profile:chung",
      "combinationRefs": [
        "rr:combination:chung:子午",
        "rr:combination:chung:丑未",
        "rr:combination:chung:寅申",
        "rr:combination:chung:卯酉",
        "rr:combination:chung:辰戌",
        "rr:combination:chung:巳亥"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:chung:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 14,
      "originalId": "tr:relation:chung:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "fd2131408aa4878aa365f235847c69bcccea529d6cf023b2fcf02db3e52f8dfb"
    },
    "originalState": {
      "id": "tr:relation:chung:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충 / natal_wolun",
      "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
      "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
      "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
      "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "chung",
      "definitionRef": "rr:profile:chung",
      "combinationRefs": [
        "rr:combination:chung:子午",
        "rr:combination:chung:丑未",
        "rr:combination:chung:寅申",
        "rr:combination:chung:卯酉",
        "rr:combination:chung:辰戌",
        "rr:combination:chung:巳亥"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:chung:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 15,
      "originalId": "tr:relation:chung:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2374567f9ef2d8f927b4b8059c6bbdfaba39e42f759c54e6733aade908871441"
    },
    "originalState": {
      "id": "tr:relation:chung:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충 / dayun_saeun",
      "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
      "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
      "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
      "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "chung",
      "definitionRef": "rr:profile:chung",
      "combinationRefs": [
        "rr:combination:chung:子午",
        "rr:combination:chung:丑未",
        "rr:combination:chung:寅申",
        "rr:combination:chung:卯酉",
        "rr:combination:chung:辰戌",
        "rr:combination:chung:巳亥"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:chung:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 16,
      "originalId": "tr:relation:chung:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b5be2e984aef8811d9137de2a78515381cd419c5c597d54c341c67fe52dcf278"
    },
    "originalState": {
      "id": "tr:relation:chung:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충 / dayun_wolun",
      "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
      "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
      "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
      "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "chung",
      "definitionRef": "rr:profile:chung",
      "combinationRefs": [
        "rr:combination:chung:子午",
        "rr:combination:chung:丑未",
        "rr:combination:chung:寅申",
        "rr:combination:chung:卯酉",
        "rr:combination:chung:辰戌",
        "rr:combination:chung:巳亥"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_dayun_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:chung:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 17,
      "originalId": "tr:relation:chung:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e0653a804fd58c90eb4914d3911cc532bddebd49fd3c15951cf7ce603209692a"
    },
    "originalState": {
      "id": "tr:relation:chung:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "충 / saeun_wolun",
      "meaning": "서로 마주한 지지의 접점을 운영 변경의 질문으로 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "고정된 배치의 불일치를 드러내 조정할 자리를 찾는다.",
      "risk": "이동·파탄·실직·불행을 일어난 사실이나 필연으로 쓰지 않는다.",
      "reversal": "필요한 변화라면 긴장을 줄이는 재배치가 도움이 될 수 있다.",
      "distinction": "충은 형의 반복 압박 질문이나 해의 불일치 질문과 같지 않다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "chung",
      "definitionRef": "rr:profile:chung",
      "combinationRefs": [
        "rr:combination:chung:子午",
        "rr:combination:chung:丑未",
        "rr:combination:chung:寅申",
        "rr:combination:chung:卯酉",
        "rr:combination:chung:辰戌",
        "rr:combination:chung:巳亥"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_annual_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:samhap:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 18,
      "originalId": "tr:relation:samhap:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9cb811a46e16ec380fff0da5377baa8746bd86f62480eee117dad3a24d507d72"
    },
    "originalState": {
      "id": "tr:relation:samhap:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "삼합 / natal_dayun",
      "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
      "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
      "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
      "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "samhap",
      "definitionRef": "rr:profile:samhap",
      "combinationRefs": [
        "rr:combination:samhap:申子辰",
        "rr:combination:samhap:亥卯未",
        "rr:combination:samhap:寅午戌",
        "rr:combination:samhap:巳酉丑"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:samhap:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 19,
      "originalId": "tr:relation:samhap:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9118e920cd8ea00cc984364c80d45239adcdb86d01b32f3108544c3fc52196cc"
    },
    "originalState": {
      "id": "tr:relation:samhap:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "삼합 / natal_saeun",
      "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
      "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
      "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
      "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "samhap",
      "definitionRef": "rr:profile:samhap",
      "combinationRefs": [
        "rr:combination:samhap:申子辰",
        "rr:combination:samhap:亥卯未",
        "rr:combination:samhap:寅午戌",
        "rr:combination:samhap:巳酉丑"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:samhap:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 20,
      "originalId": "tr:relation:samhap:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d299a9c2d5f59f2272f0c0313954ae6bd14ed9b04ecf638649f412ed400feff1"
    },
    "originalState": {
      "id": "tr:relation:samhap:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "삼합 / natal_wolun",
      "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
      "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
      "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
      "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "samhap",
      "definitionRef": "rr:profile:samhap",
      "combinationRefs": [
        "rr:combination:samhap:申子辰",
        "rr:combination:samhap:亥卯未",
        "rr:combination:samhap:寅午戌",
        "rr:combination:samhap:巳酉丑"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:samhap:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 21,
      "originalId": "tr:relation:samhap:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ff44c6b0f896d7ed39d4ab32f9b7e4624fe8eea550098788d371aa38b23a5d5c"
    },
    "originalState": {
      "id": "tr:relation:samhap:dayun_saeun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "삼합 / dayun_saeun",
      "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
      "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
      "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
      "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "samhap",
      "definitionRef": "rr:profile:samhap",
      "combinationRefs": [
        "rr:combination:samhap:申子辰",
        "rr:combination:samhap:亥卯未",
        "rr:combination:samhap:寅午戌",
        "rr:combination:samhap:巳酉丑"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:samhap:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 22,
      "originalId": "tr:relation:samhap:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9e7e5208d89f962233e4d59ad6effd57966b2e8c7092870c58ef560f5c766564"
    },
    "originalState": {
      "id": "tr:relation:samhap:dayun_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "삼합 / dayun_wolun",
      "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
      "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
      "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
      "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "samhap",
      "definitionRef": "rr:profile:samhap",
      "combinationRefs": [
        "rr:combination:samhap:申子辰",
        "rr:combination:samhap:亥卯未",
        "rr:combination:samhap:寅午戌",
        "rr:combination:samhap:巳酉丑"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:samhap:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 23,
      "originalId": "tr:relation:samhap:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b5af058febb423a8c4b1d38aa80db34035cfa65e64c103ba5516de61f9b81b30"
    },
    "originalState": {
      "id": "tr:relation:samhap:saeun_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "삼합 / saeun_wolun",
      "meaning": "실제 세 지지의 구성과 소유자가 동시에 존재하는 기간만 확인한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "여러 자원의 연결 가능성을 단일 쌍보다 넓게 검토한다.",
      "risk": "두 지지로 빠진 세 번째를 채우거나 화국을 확정하지 않는다.",
      "reversal": "연결할 자원이 많아도 동일 목적이 없으면 조율 비용이 커질 수 있다.",
      "distinction": "왕지 반합과 생고 반합, 완성 삼합은 별도의 성립 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "samhap",
      "definitionRef": "rr:profile:samhap",
      "combinationRefs": [
        "rr:combination:samhap:申子辰",
        "rr:combination:samhap:亥卯未",
        "rr:combination:samhap:寅午戌",
        "rr:combination:samhap:巳酉丑"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hyeong:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 24,
      "originalId": "tr:relation:hyeong:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "00df45eced4420c90c25a01892c83f2f8e50967d5cfdaf24dd85533674479fc4"
    },
    "originalState": {
      "id": "tr:relation:hyeong:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "형 / natal_dayun",
      "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
      "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
      "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
      "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "hyeong",
      "definitionRef": "rr:profile:hyeong",
      "combinationRefs": [
        "rr:combination:hyeong:寅巳",
        "rr:combination:hyeong:巳申",
        "rr:combination:hyeong:申寅",
        "rr:combination:hyeong:丑戌",
        "rr:combination:hyeong:戌未",
        "rr:combination:hyeong:未丑",
        "rr:combination:hyeong:子卯",
        "rr:combination:hyeong:辰辰",
        "rr:combination:hyeong:午午",
        "rr:combination:hyeong:酉酉",
        "rr:combination:hyeong:亥亥",
        "rr:combination:hyeong:寅巳申",
        "rr:combination:hyeong:丑戌未"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hyeong:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 25,
      "originalId": "tr:relation:hyeong:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7ac9fab14ca21bad6017adf7d28446f3cad19f5f238dee89c37a8c57007501c7"
    },
    "originalState": {
      "id": "tr:relation:hyeong:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "형 / natal_saeun",
      "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
      "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
      "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
      "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "hyeong",
      "definitionRef": "rr:profile:hyeong",
      "combinationRefs": [
        "rr:combination:hyeong:寅巳",
        "rr:combination:hyeong:巳申",
        "rr:combination:hyeong:申寅",
        "rr:combination:hyeong:丑戌",
        "rr:combination:hyeong:戌未",
        "rr:combination:hyeong:未丑",
        "rr:combination:hyeong:子卯",
        "rr:combination:hyeong:辰辰",
        "rr:combination:hyeong:午午",
        "rr:combination:hyeong:酉酉",
        "rr:combination:hyeong:亥亥",
        "rr:combination:hyeong:寅巳申",
        "rr:combination:hyeong:丑戌未"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hyeong:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 26,
      "originalId": "tr:relation:hyeong:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5d89ae343457f1aa5407898f329fdff00b7ad99147b04dbad0b4f4a407af6114"
    },
    "originalState": {
      "id": "tr:relation:hyeong:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "형 / natal_wolun",
      "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
      "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
      "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
      "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "hyeong",
      "definitionRef": "rr:profile:hyeong",
      "combinationRefs": [
        "rr:combination:hyeong:寅巳",
        "rr:combination:hyeong:巳申",
        "rr:combination:hyeong:申寅",
        "rr:combination:hyeong:丑戌",
        "rr:combination:hyeong:戌未",
        "rr:combination:hyeong:未丑",
        "rr:combination:hyeong:子卯",
        "rr:combination:hyeong:辰辰",
        "rr:combination:hyeong:午午",
        "rr:combination:hyeong:酉酉",
        "rr:combination:hyeong:亥亥",
        "rr:combination:hyeong:寅巳申",
        "rr:combination:hyeong:丑戌未"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hyeong:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 27,
      "originalId": "tr:relation:hyeong:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3960b3d022d9dd3a8f3ac8a1c186b6b633a3332ba6f7c78cf45b94b29c3ea0fc"
    },
    "originalState": {
      "id": "tr:relation:hyeong:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "형 / dayun_saeun",
      "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
      "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
      "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
      "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "hyeong",
      "definitionRef": "rr:profile:hyeong",
      "combinationRefs": [
        "rr:combination:hyeong:寅巳",
        "rr:combination:hyeong:巳申",
        "rr:combination:hyeong:申寅",
        "rr:combination:hyeong:丑戌",
        "rr:combination:hyeong:戌未",
        "rr:combination:hyeong:未丑",
        "rr:combination:hyeong:子卯",
        "rr:combination:hyeong:辰辰",
        "rr:combination:hyeong:午午",
        "rr:combination:hyeong:酉酉",
        "rr:combination:hyeong:亥亥",
        "rr:combination:hyeong:寅巳申",
        "rr:combination:hyeong:丑戌未"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hyeong:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 28,
      "originalId": "tr:relation:hyeong:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1c7177723326e375871cf829c37205e91a222ff264f4ba57125d9f9f677a45aa"
    },
    "originalState": {
      "id": "tr:relation:hyeong:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "형 / dayun_wolun",
      "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
      "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
      "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
      "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "hyeong",
      "definitionRef": "rr:profile:hyeong",
      "combinationRefs": [
        "rr:combination:hyeong:寅巳",
        "rr:combination:hyeong:巳申",
        "rr:combination:hyeong:申寅",
        "rr:combination:hyeong:丑戌",
        "rr:combination:hyeong:戌未",
        "rr:combination:hyeong:未丑",
        "rr:combination:hyeong:子卯",
        "rr:combination:hyeong:辰辰",
        "rr:combination:hyeong:午午",
        "rr:combination:hyeong:酉酉",
        "rr:combination:hyeong:亥亥",
        "rr:combination:hyeong:寅巳申",
        "rr:combination:hyeong:丑戌未"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_dayun_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hyeong:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 29,
      "originalId": "tr:relation:hyeong:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3f4241f1407df100be450494f289cc0f4642ba2454680ad487e6283f385afd96"
    },
    "originalState": {
      "id": "tr:relation:hyeong:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "형 / saeun_wolun",
      "meaning": "기존 쌍 검출이 다루는 참가자 사이 반복 압박의 조건을 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "반복되는 절차나 자기 요구를 살펴 수정할 단서를 찾는다.",
      "risk": "형을 처벌·범죄·질병으로 번역하지 않는다.",
      "reversal": "기준을 다시 세우면 압박이 수행 체계를 정돈할 질문이 될 수 있다.",
      "distinction": "쌍11개와 전체 삼형2개는 서로 다른 지원 상태다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "hyeong",
      "definitionRef": "rr:profile:hyeong",
      "combinationRefs": [
        "rr:combination:hyeong:寅巳",
        "rr:combination:hyeong:巳申",
        "rr:combination:hyeong:申寅",
        "rr:combination:hyeong:丑戌",
        "rr:combination:hyeong:戌未",
        "rr:combination:hyeong:未丑",
        "rr:combination:hyeong:子卯",
        "rr:combination:hyeong:辰辰",
        "rr:combination:hyeong:午午",
        "rr:combination:hyeong:酉酉",
        "rr:combination:hyeong:亥亥",
        "rr:combination:hyeong:寅巳申",
        "rr:combination:hyeong:丑戌未"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_annual_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 참조64개 중 전체 삼형2개는 모든 기간 producer에서 G다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hae:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 30,
      "originalId": "tr:relation:hae:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1e3d611dfa6767eaf56ab64fa863f35bb26187f0987aab97430bbeceab17e81b"
    },
    "originalState": {
      "id": "tr:relation:hae:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "해 / natal_dayun",
      "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
      "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
      "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
      "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "hae",
      "definitionRef": "rr:profile:hae",
      "combinationRefs": [
        "rr:combination:hae:子未",
        "rr:combination:hae:丑午",
        "rr:combination:hae:寅巳",
        "rr:combination:hae:卯辰",
        "rr:combination:hae:申亥",
        "rr:combination:hae:酉戌"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hae:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 31,
      "originalId": "tr:relation:hae:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bef5990c28b14415449522ef668bef3872b7b6b54cca9ce93f3bc1dd378b0bbb"
    },
    "originalState": {
      "id": "tr:relation:hae:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "해 / natal_saeun",
      "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
      "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
      "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
      "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "hae",
      "definitionRef": "rr:profile:hae",
      "combinationRefs": [
        "rr:combination:hae:子未",
        "rr:combination:hae:丑午",
        "rr:combination:hae:寅巳",
        "rr:combination:hae:卯辰",
        "rr:combination:hae:申亥",
        "rr:combination:hae:酉戌"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hae:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 32,
      "originalId": "tr:relation:hae:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "80ceb94773655168d7f556305b0140122e7b36d3e5620cf8bd39a818bae1b3d3"
    },
    "originalState": {
      "id": "tr:relation:hae:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "해 / natal_wolun",
      "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
      "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
      "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
      "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "hae",
      "definitionRef": "rr:profile:hae",
      "combinationRefs": [
        "rr:combination:hae:子未",
        "rr:combination:hae:丑午",
        "rr:combination:hae:寅巳",
        "rr:combination:hae:卯辰",
        "rr:combination:hae:申亥",
        "rr:combination:hae:酉戌"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hae:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 33,
      "originalId": "tr:relation:hae:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6d9d3ae6e8c1683921940660b222c7b5fd21ac04788a2a35811090e40a75ce53"
    },
    "originalState": {
      "id": "tr:relation:hae:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "해 / dayun_saeun",
      "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
      "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
      "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
      "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "hae",
      "definitionRef": "rr:profile:hae",
      "combinationRefs": [
        "rr:combination:hae:子未",
        "rr:combination:hae:丑午",
        "rr:combination:hae:寅巳",
        "rr:combination:hae:卯辰",
        "rr:combination:hae:申亥",
        "rr:combination:hae:酉戌"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hae:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 34,
      "originalId": "tr:relation:hae:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ee5807732c0c92d1422ffff04d8eee99f1f304946cea80fa62da506d9893d427"
    },
    "originalState": {
      "id": "tr:relation:hae:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "해 / dayun_wolun",
      "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
      "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
      "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
      "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "hae",
      "definitionRef": "rr:profile:hae",
      "combinationRefs": [
        "rr:combination:hae:子未",
        "rr:combination:hae:丑午",
        "rr:combination:hae:寅巳",
        "rr:combination:hae:卯辰",
        "rr:combination:hae:申亥",
        "rr:combination:hae:酉戌"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_dayun_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:hae:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 35,
      "originalId": "tr:relation:hae:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e2eca79756227a9b29e88bb526330b5a20f0f809779f7c31f069b4d0026bc868"
    },
    "originalState": {
      "id": "tr:relation:hae:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "해 / saeun_wolun",
      "meaning": "현재 쌍 표의 엇갈리는 접점을 짧은 기간의 확인 질문으로 다룬다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "명시되지 않은 기대를 확인할 계기를 검토한다.",
      "risk": "배신·가해자·악의의 증거로 쓰지 않는다.",
      "reversal": "덜 얽히는 선택이 필요한 역할을 보존할 수 있다.",
      "distinction": "충처럼 양자 대립을 전제하지 않으며 원진과 겹친 쌍도 별도 사건이 아니다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "hae",
      "definitionRef": "rr:profile:hae",
      "combinationRefs": [
        "rr:combination:hae:子未",
        "rr:combination:hae:丑午",
        "rr:combination:hae:寅巳",
        "rr:combination:hae:卯辰",
        "rr:combination:hae:申亥",
        "rr:combination:hae:酉戌"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_annual_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:banhap:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 36,
      "originalId": "tr:relation:banhap:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ce2b656c490e2ff2bcd3c3fb49ad6c632d677783dd9d7e9b5e2e3fd01edcff57"
    },
    "originalState": {
      "id": "tr:relation:banhap:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합 / natal_dayun",
      "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
      "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
      "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
      "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "banhap",
      "definitionRef": "rr:profile:banhap",
      "combinationRefs": [
        "rr:combination:banhap:申子",
        "rr:combination:banhap:申辰",
        "rr:combination:banhap:子辰",
        "rr:combination:banhap:亥卯",
        "rr:combination:banhap:亥未",
        "rr:combination:banhap:卯未",
        "rr:combination:banhap:寅午",
        "rr:combination:banhap:寅戌",
        "rr:combination:banhap:午戌",
        "rr:combination:banhap:巳酉",
        "rr:combination:banhap:巳丑",
        "rr:combination:banhap:酉丑"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:banhap:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 37,
      "originalId": "tr:relation:banhap:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "79e344e06909452b0dec04f44aac3d596ebbf02392b0843cc1def273fdceda1a"
    },
    "originalState": {
      "id": "tr:relation:banhap:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합 / natal_saeun",
      "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
      "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
      "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
      "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "banhap",
      "definitionRef": "rr:profile:banhap",
      "combinationRefs": [
        "rr:combination:banhap:申子",
        "rr:combination:banhap:申辰",
        "rr:combination:banhap:子辰",
        "rr:combination:banhap:亥卯",
        "rr:combination:banhap:亥未",
        "rr:combination:banhap:卯未",
        "rr:combination:banhap:寅午",
        "rr:combination:banhap:寅戌",
        "rr:combination:banhap:午戌",
        "rr:combination:banhap:巳酉",
        "rr:combination:banhap:巳丑",
        "rr:combination:banhap:酉丑"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:banhap:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 38,
      "originalId": "tr:relation:banhap:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "69e71e4df537f5db6d68d0ecdaa10f6259e1aa8f9138c061655b78c2a96f1ecc"
    },
    "originalState": {
      "id": "tr:relation:banhap:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합 / natal_wolun",
      "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
      "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
      "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
      "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "banhap",
      "definitionRef": "rr:profile:banhap",
      "combinationRefs": [
        "rr:combination:banhap:申子",
        "rr:combination:banhap:申辰",
        "rr:combination:banhap:子辰",
        "rr:combination:banhap:亥卯",
        "rr:combination:banhap:亥未",
        "rr:combination:banhap:卯未",
        "rr:combination:banhap:寅午",
        "rr:combination:banhap:寅戌",
        "rr:combination:banhap:午戌",
        "rr:combination:banhap:巳酉",
        "rr:combination:banhap:巳丑",
        "rr:combination:banhap:酉丑"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:banhap:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 39,
      "originalId": "tr:relation:banhap:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7bb3a16033b2fa98d4a53666192d976580558c614b352789e18ade925a606664"
    },
    "originalState": {
      "id": "tr:relation:banhap:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합 / dayun_saeun",
      "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
      "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
      "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
      "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "banhap",
      "definitionRef": "rr:profile:banhap",
      "combinationRefs": [
        "rr:combination:banhap:申子",
        "rr:combination:banhap:申辰",
        "rr:combination:banhap:子辰",
        "rr:combination:banhap:亥卯",
        "rr:combination:banhap:亥未",
        "rr:combination:banhap:卯未",
        "rr:combination:banhap:寅午",
        "rr:combination:banhap:寅戌",
        "rr:combination:banhap:午戌",
        "rr:combination:banhap:巳酉",
        "rr:combination:banhap:巳丑",
        "rr:combination:banhap:酉丑"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:banhap:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 40,
      "originalId": "tr:relation:banhap:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b2ef73bf5eff7f3c51321b2237d178c09ac2959975f9dfa1d37aa06aa4761acc"
    },
    "originalState": {
      "id": "tr:relation:banhap:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합 / dayun_wolun",
      "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
      "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
      "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
      "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "banhap",
      "definitionRef": "rr:profile:banhap",
      "combinationRefs": [
        "rr:combination:banhap:申子",
        "rr:combination:banhap:申辰",
        "rr:combination:banhap:子辰",
        "rr:combination:banhap:亥卯",
        "rr:combination:banhap:亥未",
        "rr:combination:banhap:卯未",
        "rr:combination:banhap:寅午",
        "rr:combination:banhap:寅戌",
        "rr:combination:banhap:午戌",
        "rr:combination:banhap:巳酉",
        "rr:combination:banhap:巳丑",
        "rr:combination:banhap:酉丑"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_dayun_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:banhap:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 41,
      "originalId": "tr:relation:banhap:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "49af8bd061b8b0ecfc20bdaa95a20eac0c767954dc75468a9ef75494b8a64b30"
    },
    "originalState": {
      "id": "tr:relation:banhap:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "반합 / saeun_wolun",
      "meaning": "현재 두 지지의 부분 연결을 확인하며 구성 유형은 이전 조합 자료를 참조한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "이미 있는 연결의 활용 조건을 좁게 살핀다.",
      "risk": "누락된 왕지·생지·고지를 추정하거나 완성 삼합의 효과를 부여하지 않는다.",
      "reversal": "부분 연결이므로 나머지를 억지로 채우기보다 가능한 범위만 활용할 수 있다.",
      "distinction": "완성 삼합과 동시 검출되면 독립 효과가 추가된 것으로 세지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "banhap",
      "definitionRef": "rr:profile:banhap",
      "combinationRefs": [
        "rr:combination:banhap:申子",
        "rr:combination:banhap:申辰",
        "rr:combination:banhap:子辰",
        "rr:combination:banhap:亥卯",
        "rr:combination:banhap:亥未",
        "rr:combination:banhap:卯未",
        "rr:combination:banhap:寅午",
        "rr:combination:banhap:寅戌",
        "rr:combination:banhap:午戌",
        "rr:combination:banhap:巳酉",
        "rr:combination:banhap:巳丑",
        "rr:combination:banhap:酉丑"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_annual_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:pa:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 42,
      "originalId": "tr:relation:pa:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "668d99924e4bd0dc50da5ebd1ed63c4907c6ff8156a84a1d29ef8d2a7596fcde"
    },
    "originalState": {
      "id": "tr:relation:pa:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "파 / natal_dayun",
      "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
      "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
      "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
      "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "pa",
      "definitionRef": "rr:profile:pa",
      "combinationRefs": [
        "rr:combination:pa:子酉",
        "rr:combination:pa:丑辰",
        "rr:combination:pa:寅亥",
        "rr:combination:pa:卯午",
        "rr:combination:pa:巳申",
        "rr:combination:pa:未戌"
      ],
      "scope": "natal_dayun",
      "producerSupport": "supported",
      "producerRefs": [
        "majorFortuneEvidence:branchInteractions"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:pa:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 43,
      "originalId": "tr:relation:pa:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "404f04760a5d0a49ff271edeb7b1a4ab6961d2dd4c74d13770cc14b411cd1254"
    },
    "originalState": {
      "id": "tr:relation:pa:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "파 / natal_saeun",
      "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
      "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
      "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
      "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "pa",
      "definitionRef": "rr:profile:pa",
      "combinationRefs": [
        "rr:combination:pa:子酉",
        "rr:combination:pa:丑辰",
        "rr:combination:pa:寅亥",
        "rr:combination:pa:卯午",
        "rr:combination:pa:巳申",
        "rr:combination:pa:未戌"
      ],
      "scope": "natal_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:pa:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 44,
      "originalId": "tr:relation:pa:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e6f14791e8f466e6c212e03d579162b4c3423ef92b91b7380d21293574ed744d"
    },
    "originalState": {
      "id": "tr:relation:pa:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "파 / natal_wolun",
      "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
      "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
      "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
      "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "pa",
      "definitionRef": "rr:profile:pa",
      "combinationRefs": [
        "rr:combination:pa:子酉",
        "rr:combination:pa:丑辰",
        "rr:combination:pa:寅亥",
        "rr:combination:pa:卯午",
        "rr:combination:pa:巳申",
        "rr:combination:pa:未戌"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:pa:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 45,
      "originalId": "tr:relation:pa:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8c0df127e6c1e6b05b8f34a1aa8e90e2cd88aea0e8e76bbb5fbc943ede479e14"
    },
    "originalState": {
      "id": "tr:relation:pa:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "파 / dayun_saeun",
      "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
      "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
      "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
      "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "pa",
      "definitionRef": "rr:profile:pa",
      "combinationRefs": [
        "rr:combination:pa:子酉",
        "rr:combination:pa:丑辰",
        "rr:combination:pa:寅亥",
        "rr:combination:pa:卯午",
        "rr:combination:pa:巳申",
        "rr:combination:pa:未戌"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:pa:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 46,
      "originalId": "tr:relation:pa:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "efb03db72d0b7b6a6bda600894a597689448ac8161f37de10b99491f47426201"
    },
    "originalState": {
      "id": "tr:relation:pa:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "파 / dayun_wolun",
      "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
      "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
      "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
      "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "pa",
      "definitionRef": "rr:profile:pa",
      "combinationRefs": [
        "rr:combination:pa:子酉",
        "rr:combination:pa:丑辰",
        "rr:combination:pa:寅亥",
        "rr:combination:pa:卯午",
        "rr:combination:pa:巳申",
        "rr:combination:pa:未戌"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_dayun_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:pa:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 47,
      "originalId": "tr:relation:pa:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1a897dbe47e8f7a565488a977c01898388b7651c817789b148344495db47d4de"
    },
    "originalState": {
      "id": "tr:relation:pa:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "파 / saeun_wolun",
      "meaning": "현재 쌍의 조정·분절 가능성을 운영 단위의 질문으로 검토한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "큰 구조를 모두 버리기 전에 접점만 수정하는 선택을 살핀다.",
      "risk": "해체·이별·계약 파기 사건을 확정하지 않는다.",
      "reversal": "낡은 연결을 줄이는 것이 유지할 부분을 남길 수 있다.",
      "distinction": "충과 달리 전면 대립을 상정하지 않으며 겹친 합·해와 산술 합산하지 않는다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "pa",
      "definitionRef": "rr:profile:pa",
      "combinationRefs": [
        "rr:combination:pa:子酉",
        "rr:combination:pa:丑辰",
        "rr:combination:pa:寅亥",
        "rr:combination:pa:卯午",
        "rr:combination:pa:巳申",
        "rr:combination:pa:未戌"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthJie:month_annual_branch"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:wonjin:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 48,
      "originalId": "tr:relation:wonjin:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "798a703e235aed1e460e959cddfafc0a987ac7636e7d96ff41bf217a4111b358"
    },
    "originalState": {
      "id": "tr:relation:wonjin:natal_dayun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 / natal_dayun",
      "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 변하지 않는 출생 자리와 새 장기 배경을 구분해 반복 자원의 배치 조건을 묻는다.",
      "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
      "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
      "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
      "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "relation": "wonjin",
      "definitionRef": "rr:profile:wonjin",
      "combinationRefs": [
        "rr:combination:wonjin:子未",
        "rr:combination:wonjin:丑午",
        "rr:combination:wonjin:寅酉",
        "rr:combination:wonjin:卯申",
        "rr:combination:wonjin:辰亥",
        "rr:combination:wonjin:巳戌"
      ],
      "scope": "natal_dayun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. 원국-대운 검증 근거는 원래 packet의 cycle에 한정하며 다음 cycle로 복사하지 않는다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:wonjin:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 49,
      "originalId": "tr:relation:wonjin:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "76cd1562ded646d37b2200ddf4df28e14d9b1bc7f47d785d8e5e1bfb68d5538e"
    },
    "originalState": {
      "id": "tr:relation:wonjin:natal_saeun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 / natal_saeun",
      "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 올해 운이 닿는 실제 출생 자리만 설명하고 타고난 성향 자체가 변했다고 하지 않는다.",
      "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
      "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
      "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
      "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "relation": "wonjin",
      "definitionRef": "rr:profile:wonjin",
      "combinationRefs": [
        "rr:combination:wonjin:子未",
        "rr:combination:wonjin:丑午",
        "rr:combination:wonjin:寅酉",
        "rr:combination:wonjin:卯申",
        "rr:combination:wonjin:辰亥",
        "rr:combination:wonjin:巳戌"
      ],
      "scope": "natal_saeun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:wonjin:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 50,
      "originalId": "tr:relation:wonjin:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d96a5d8c2a28edae9f19977dd9b3635cbbd802246e38d6b405226343cc22e1bf"
    },
    "originalState": {
      "id": "tr:relation:wonjin:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 / natal_wolun",
      "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 절입 전후 접점이 생기거나 사라지는 구간을 나눠 작은 행동의 관찰 조건을 묻는다.",
      "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
      "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
      "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
      "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "relation": "wonjin",
      "definitionRef": "rr:profile:wonjin",
      "combinationRefs": [
        "rr:combination:wonjin:子未",
        "rr:combination:wonjin:丑午",
        "rr:combination:wonjin:寅酉",
        "rr:combination:wonjin:卯申",
        "rr:combination:wonjin:辰亥",
        "rr:combination:wonjin:巳戌"
      ],
      "scope": "natal_wolun",
      "producerSupport": "supported",
      "producerRefs": [
        "annualMonthRelationFacts + annualMonthExtendedEvidence"
      ],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:wonjin:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 51,
      "originalId": "tr:relation:wonjin:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d85aab00d5e9e767752dc71f2400089d9b03a2937dbbe88b15bd749d07acf7ca"
    },
    "originalState": {
      "id": "tr:relation:wonjin:dayun_saeun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 / dayun_saeun",
      "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 장기 배경과 해당 실효 연주의 접점이며 어느 쪽도 natal ordinal로 부르지 않는다.",
      "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
      "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
      "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
      "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "relation": "wonjin",
      "definitionRef": "rr:profile:wonjin",
      "combinationRefs": [
        "rr:combination:wonjin:子未",
        "rr:combination:wonjin:丑午",
        "rr:combination:wonjin:寅酉",
        "rr:combination:wonjin:卯申",
        "rr:combination:wonjin:辰亥",
        "rr:combination:wonjin:巳戌"
      ],
      "scope": "dayun_saeun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다. major 연도 row의 단일 cycleRelations는 전환 이전 전체를 설명하지 않는다; 구간별 annual crossPeriods와 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:wonjin:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 52,
      "originalId": "tr:relation:wonjin:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5172b60ea2fc1003f863a2939d1832a8fe8603e835e2022be435b66d08ce121a"
    },
    "originalState": {
      "id": "tr:relation:wonjin:dayun_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 / dayun_wolun",
      "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 월운 구간 안의 실제 활성 대운을 비교한다. 교운 후보는 각각 조건부로 남긴다.",
      "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
      "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
      "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
      "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "relation": "wonjin",
      "definitionRef": "rr:profile:wonjin",
      "combinationRefs": [
        "rr:combination:wonjin:子未",
        "rr:combination:wonjin:丑午",
        "rr:combination:wonjin:寅酉",
        "rr:combination:wonjin:卯申",
        "rr:combination:wonjin:辰亥",
        "rr:combination:wonjin:巳戌"
      ],
      "scope": "dayun_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:relation:wonjin:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalRelations.ts",
      "exportName": "TEMPORAL_RELATIONS",
      "index": 53,
      "originalId": "tr:relation:wonjin:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "0f16233596e38e161b308782327502ff820816eb19ad85979df78afac9e549fe"
    },
    "originalState": {
      "id": "tr:relation:wonjin:saeun_wolun",
      "class": "G",
      "sourceRefs": [
        "repo-relations",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "원진 / saeun_wolun",
      "meaning": "기존 원진 관계와 원진살 투영의 중복 출처를 확인한다. 해당 구간의 실효 연주와 월주를 비교한다. 연간 목표와 짧은 실행의 접점을 묻는다.",
      "positive": "상대의 실제 행동과 자신의 해석을 분리할 질문을 마련한다.",
      "risk": "악연·불화·심리 질환·폭력으로 단정하지 않는다.",
      "reversal": "확인할 정보가 없다면 판단을 유예하는 편이 관계 해석을 바로잡을 수 있다.",
      "distinction": "원진살 재투영은 새 관계·추가 위험이 아니며 현재 기간끼리 쌍은 미지원이다.",
      "requires": [
        "실제 참가자의 소유자·자리·간지",
        "유효 구간의 교집합",
        "이전 연구의 성립·제외 조건"
      ],
      "excludes": [
        "미상 시주 대체",
        "서로 다른 시점의 관계 합산",
        "연구 조합을 검출 결과로 위장"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "relation": "wonjin",
      "definitionRef": "rr:profile:wonjin",
      "combinationRefs": [
        "rr:combination:wonjin:子未",
        "rr:combination:wonjin:丑午",
        "rr:combination:wonjin:寅酉",
        "rr:combination:wonjin:卯申",
        "rr:combination:wonjin:辰亥",
        "rr:combination:wonjin:巳戌"
      ],
      "scope": "saeun_wolun",
      "producerSupport": "unsupported",
      "producerRefs": [],
      "timeQualification": "각 구간 [start,end) 보존; conditional 후보와 confirmed 관계를 구별한다.",
      "fieldClasses": {
        "meaning": "G",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:scope:natal_dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalScopes.ts",
      "exportName": "TEMPORAL_SCOPES",
      "index": 0,
      "originalId": "tr:scope:natal_dayun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "88cebf50b314383bb15796166853027bb99498c3d27a91c05bd20fdd73cae19c"
    },
    "originalState": {
      "id": "tr:scope:natal_dayun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "태어난 구조에서 어떤 기능이 장기 환경과 맞물리는가",
      "meaning": "대운의 실제 활성 구간과 원국의 출생 기준을 교차",
      "positive": "원국의 반복 자원을 새로운 장기 역할에 배치한다.",
      "risk": "원국 십성을 대운의 십성처럼 이름 붙이지 않는다.",
      "reversal": "필요한 기능을 묶는 합이라면 합의 존재가 오히려 제약 질문이 된다.",
      "distinction": "연간 변동보다 장기적으로 유지되는 역할의 조건을 다룬다.",
      "requires": [
        "소유자별 실제 간지",
        "실제 기간의 교집합",
        "근거 ID와 확정 여부"
      ],
      "excludes": [
        "누락된 원국 시주 대입",
        "연도만 같은 관계의 합산"
      ],
      "scopeRefs": [
        "natal_dayun"
      ],
      "scope": "natal_dayun",
      "owners": [
        "natal",
        "dayun"
      ],
      "window": "대운의 실제 활성 구간과 원국의 출생 기준을 교차",
      "support": [
        {
          "producer": "majorFortuneEvidence:branchInteractions",
          "supported": [
            "육합",
            "충",
            "삼합(실제 3자만)",
            "형(쌍)",
            "해",
            "반합",
            "파"
          ],
          "unsupported": [
            "천간합",
            "원진",
            "전체 삼형"
          ],
          "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
        }
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:scope:natal_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalScopes.ts",
      "exportName": "TEMPORAL_SCOPES",
      "index": 1,
      "originalId": "tr:scope:natal_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f7603f82d01195f69e0ffdb4021337c514ff684142c2934c9d1e6792e9ab4b75"
    },
    "originalState": {
      "id": "tr:scope:natal_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "타고난 반응 가운데 올해 자극받는 자리는 어디인가",
      "meaning": "세운의 실제 연주 적용 구간과 확인된 원국 자리",
      "positive": "원국의 여러 자리 중 실제 접점만 골라 올해 선택을 좁힌다.",
      "risk": "연지·월지·일지·시지를 사건 당사자로 단정하지 않는다.",
      "reversal": "긴장 관계가 익숙한 방식의 수정 기회를 제시할 수 있다.",
      "distinction": "원국 자체 분석과 달리 올해 요소가 빠지면 성립하지 않는 접점을 다룬다.",
      "requires": [
        "소유자별 실제 간지",
        "실제 기간의 교집합",
        "근거 ID와 확정 여부"
      ],
      "excludes": [
        "누락된 원국 시주 대입",
        "연도만 같은 관계의 합산"
      ],
      "scopeRefs": [
        "natal_saeun"
      ],
      "scope": "natal_saeun",
      "owners": [
        "natal",
        "saeun"
      ],
      "window": "세운의 실제 연주 적용 구간과 확인된 원국 자리",
      "support": [
        {
          "producer": "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations",
          "supported": [
            "육합",
            "충",
            "삼합(실제 3자만)",
            "형(쌍)",
            "해",
            "반합",
            "파",
            "천간합(V4 selectedYear 투영)"
          ],
          "unsupported": [
            "원진",
            "전체 삼형"
          ],
          "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
        }
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:scope:natal_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalScopes.ts",
      "exportName": "TEMPORAL_SCOPES",
      "index": 2,
      "originalId": "tr:scope:natal_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6a030a81c08cf681aa644cd204a754a87b6da0fb602db45683cffcac1fd19b54"
    },
    "originalState": {
      "id": "tr:scope:natal_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "같은 출생 자원과 이 짧은 구간의 요구는 어떻게 만나는가",
      "meaning": "달력월 내부 각 절입·교운 분할 [start,end)",
      "positive": "구체적인 한 가지 실행을 짧게 관찰할 비교 기간을 잡는다.",
      "risk": "절입 뒤의 관계를 절입 전이나 다음 달에 그대로 연장하지 않는다.",
      "reversal": "관계 없음도 근거이며 일반 성향을 관계 효과로 바꾸지 않는다.",
      "distinction": "세운보다 관찰 단위가 짧고 월지 본기·확장 근거의 출처가 더 세밀하다.",
      "requires": [
        "소유자별 실제 간지",
        "실제 기간의 교집합",
        "근거 ID와 확정 여부"
      ],
      "excludes": [
        "누락된 원국 시주 대입",
        "연도만 같은 관계의 합산"
      ],
      "scopeRefs": [
        "natal_wolun"
      ],
      "scope": "natal_wolun",
      "owners": [
        "natal",
        "wolun"
      ],
      "window": "달력월 내부 각 절입·교운 분할 [start,end)",
      "support": [
        {
          "producer": "annualMonthRelationFacts + annualMonthExtendedEvidence",
          "supported": [
            "육합",
            "충",
            "삼합(실제 3자만)",
            "형(쌍)",
            "해",
            "반합",
            "파",
            "원진(확장 경로)"
          ],
          "unsupported": [
            "천간합",
            "전체 삼형"
          ],
          "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
        }
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:scope:dayun_saeun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalScopes.ts",
      "exportName": "TEMPORAL_SCOPES",
      "index": 3,
      "originalId": "tr:scope:dayun_saeun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d8515bc1807a755ae2dfc7b7bd73585faac4e5dcc1802b82ec313a49fff93532"
    },
    "originalState": {
      "id": "tr:scope:dayun_saeun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "장기 역할을 유지하면서 올해 어떤 기능을 따로 처리할 것인가",
      "meaning": "실효 연주 구간 ∩ 실제 대운 활성/후보 구간",
      "positive": "같은 십성이면 역할의 일관성, 다르면 과제 분담을 검토한다.",
      "risk": "대운 기준 flowGod를 일간 기준 annualGod와 혼동하지 않는다.",
      "reversal": "서로 다른 역할은 모순만이 아니라 역할을 나눌 자원이 될 수 있다.",
      "distinction": "원국 비교와 달리 두 기간 모두 끝점이 있고 기준 천간도 명시해야 한다.",
      "requires": [
        "소유자별 실제 간지",
        "실제 기간의 교집합",
        "근거 ID와 확정 여부"
      ],
      "excludes": [
        "누락된 원국 시주 대입",
        "연도만 같은 관계의 합산"
      ],
      "scopeRefs": [
        "dayun_saeun"
      ],
      "scope": "dayun_saeun",
      "owners": [
        "dayun",
        "saeun"
      ],
      "window": "실효 연주 구간 ∩ 실제 대운 활성/후보 구간",
      "support": [
        {
          "producer": "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations",
          "supported": [
            "육합",
            "충",
            "형(쌍)",
            "해",
            "반합",
            "파"
          ],
          "unsupported": [
            "천간합",
            "삼합",
            "원진",
            "전체 삼형"
          ],
          "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
        }
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:scope:dayun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalScopes.ts",
      "exportName": "TEMPORAL_SCOPES",
      "index": 4,
      "originalId": "tr:scope:dayun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "479c649a6c9b0b2280cd1213bb98d2381467c6cf86af0def5d359d26451c7fe9"
    },
    "originalState": {
      "id": "tr:scope:dayun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "장기적으로 유지할 조건과 이번 구간에 바꿀 운영은 무엇인가",
      "meaning": "월운 구간 ∩ 대운 확정/범위 경계",
      "positive": "작은 조정을 통해 장기 목표를 성급히 포기하지 않게 한다.",
      "risk": "불확실 교운에서 두 대운 관계를 모두 confirmed로 제시하지 않는다.",
      "reversal": "월운의 충이 장기 계획 전체의 실패를 뜻하지 않고 실행 순서의 검토가 될 수 있다.",
      "distinction": "대운·세운보다 짧은 관찰 범위이며 첫 대운 이전에는 이 비교가 없다.",
      "requires": [
        "소유자별 실제 간지",
        "실제 기간의 교집합",
        "근거 ID와 확정 여부"
      ],
      "excludes": [
        "누락된 원국 시주 대입",
        "연도만 같은 관계의 합산"
      ],
      "scopeRefs": [
        "dayun_wolun"
      ],
      "scope": "dayun_wolun",
      "owners": [
        "dayun",
        "wolun"
      ],
      "window": "월운 구간 ∩ 대운 확정/범위 경계",
      "support": [
        {
          "producer": "annualMonthJie:month_dayun_branch",
          "supported": [
            "육합",
            "충",
            "형(쌍)",
            "해",
            "반합",
            "파"
          ],
          "unsupported": [
            "천간합",
            "삼합",
            "원진",
            "전체 삼형"
          ],
          "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
        }
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:scope:saeun_wolun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalScopes.ts",
      "exportName": "TEMPORAL_SCOPES",
      "index": 5,
      "originalId": "tr:scope:saeun_wolun",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "dc54f780e265ee93a12e625a6d736818c5cd800c67c8ff6bcca24cd14cff32ee"
    },
    "originalState": {
      "id": "tr:scope:saeun_wolun",
      "class": "C",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "올해의 방향을 이번 구간의 실행으로 옮길 때 무엇을 확인할 것인가",
      "meaning": "월운 구간 ∩ 입춘 전후 실효 연주",
      "positive": "연간 선택을 월별 작은 실험으로 구체화한다.",
      "risk": "1월과 입춘 전 월운에 선택 연주를 고정해서 붙이지 않는다.",
      "reversal": "월간 요구가 연간 목표와 달라도 속도나 방법을 바꾸는 쪽으로 읽을 수 있다.",
      "distinction": "두 요소 모두 운의 소유자이고 natal 자리 ordinal을 부여하지 않는다.",
      "requires": [
        "소유자별 실제 간지",
        "실제 기간의 교집합",
        "근거 ID와 확정 여부"
      ],
      "excludes": [
        "누락된 원국 시주 대입",
        "연도만 같은 관계의 합산"
      ],
      "scopeRefs": [
        "saeun_wolun"
      ],
      "scope": "saeun_wolun",
      "owners": [
        "saeun",
        "wolun"
      ],
      "window": "월운 구간 ∩ 입춘 전후 실효 연주",
      "support": [
        {
          "producer": "annualMonthJie:month_annual_branch",
          "supported": [
            "육합",
            "충",
            "형(쌍)",
            "해",
            "반합",
            "파"
          ],
          "unsupported": [
            "천간합",
            "삼합",
            "원진",
            "전체 삼형"
          ],
          "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
        }
      ],
      "fieldClasses": {
        "meaning": "C",
        "positive": "C",
        "risk": "C",
        "reversal": "C"
      }
    },
    "referenceOnly": true,
    "majorUse": "outside_major_annual_scope",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:tradition:root-before-period",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalTradition.ts",
      "exportName": "TEMPORAL_TRADITION",
      "index": 0,
      "originalId": "tr:tradition:root-before-period",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6ad615718e207f8fda95620bf8fcb47d329de34e384718c248d1ea2ea859be6b"
    },
    "originalState": {
      "id": "tr:tradition:root-before-period",
      "class": "A",
      "sourceRefs": [
        "sm-dayun"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "claim": "원국의 기반을 먼저 확인한 뒤 행운과 함께 살피는 전통 원칙.",
      "locator": "論大運 첫 문단",
      "limitation": "그 원칙이 특정 삶의 결과를 보장하지 않으며 현대 질문은 C/D로 별도 분류한다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:tradition:context-before-label",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalTradition.ts",
      "exportName": "TEMPORAL_TRADITION",
      "index": 1,
      "originalId": "tr:tradition:context-before-label",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6061105f0ddfb5167679aa8427e789f4844fc81f79c4274643427e3406d414e3"
    },
    "originalState": {
      "id": "tr:tradition:context-before-label",
      "class": "A",
      "sourceRefs": [
        "ziping-yun"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "claim": "행운의 간지를 원국 조건과 비교하며 천간·지지의 차이를 구별하는 전통 논의.",
      "locator": "二十五 論行運 본문; 현대 주석은 별도",
      "limitation": "전통 내부의 해석 차이는 남겨 두며 신규 희기·격국을 계산하지 않는다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:tradition:different-time-roles",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalTradition.ts",
      "exportName": "TEMPORAL_TRADITION",
      "index": 2,
      "originalId": "tr:tradition:different-time-roles",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "c27723efe89dc040acd390c4c840ab5d4c0a2ed368812794f7b8e3c08e1f02e1"
    },
    "originalState": {
      "id": "tr:tradition:different-time-roles",
      "class": "A",
      "sourceRefs": [
        "ditian-suiyun"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "claim": "대운·세운을 다른 시간 역할로 구분하고 원국·계절과 함께 검토하는 전승 설명.",
      "locator": "歲運論 본문/해설 분리",
      "limitation": "온라인 해설 귀속은 미확정이며 현대의 실제 사람·사건을 예언하는 근거가 아니다."
    },
    "referenceOnly": true,
    "majorUse": "conditional_review_required",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:five-year-halves",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 0,
      "originalId": "tr:held:five-year-halves",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "86be3ebcaf6ed4d22c5dcc93766c7bb827e4d3b3606b5bec3d887d98fff81429"
    },
    "originalState": {
      "id": "tr:held:five-year-halves",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "대운 전후 5년 간·지 분할",
      "rule": "G: 새 기간 계산·근거 승인 없음",
      "required": "전통 논의는 있으나 현재 계산이 5년마다 운의 소유자를 바꾸지 않는다.",
      "prohibited": "운간·운지를 독립 5년 지배자로 확정",
      "nextEvidence": "판본별 행운론 대조와 후속 계약 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:transition-lead-lag",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 1,
      "originalId": "tr:held:transition-lead-lag",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b3d2a7a2612c3cdbc0d1d9c88981094c6175ad49e28a818a998b325667727cda"
    },
    "originalState": {
      "id": "tr:held:transition-lead-lag",
      "class": "E",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "교운 전후 선행·잔류 효과",
      "rule": "E: 시간 차이와 해석 잔류의 독립 검증",
      "required": "고전의 전환 주변 비유가 기존 startSolarRange와 같은 모델이라는 근거는 없다.",
      "prohibited": "교운 전 1년·후 1년을 임의 추가",
      "nextEvidence": "전승별 원문·현재 경계와 별도 변수 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unverified",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:strength",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 2,
      "originalId": "tr:held:strength",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "2f8e8c474ed3b21d0fb94c1f994ed8fa2c65e70ea876bfeb13b54f88e1847d2c"
    },
    "originalState": {
      "id": "tr:held:strength",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "기간 강약·용신",
      "rule": "G: 현재 근거만으로 배합 판단 불충분",
      "required": "빈도·missing/heavy는 신강약·희기 산출이 아니다.",
      "prohibited": "부족=용신·다수=기신",
      "nextEvidence": "월령·통근·투간 등 검증된 producer 계약 필요"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:full-hyeong",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 3,
      "originalId": "tr:held:full-hyeong",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7688ec322484c7e0569dc14dfb1312972bb7efe370831860446aeefbb625fed7"
    },
    "originalState": {
      "id": "tr:held:full-hyeong",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "기간 전체 삼형",
      "rule": "G: 실제3자 기간 producer 없음",
      "required": "이전64조합 중 전체 삼형2건은 쌍 검출과 다른 연구 개념이다.",
      "prohibited": "2개 지지에 나머지 하나 채움",
      "nextEvidence": "정의·owner·기간·발생 규칙의 별도 승인"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:stem-hap-periods",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 4,
      "originalId": "tr:held:stem-hap-periods",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "02cee4e2f2f0f088b18431840a5d972ed485dff34d5c869cdabeeb8fbdff0c1a"
    },
    "originalState": {
      "id": "tr:held:stem-hap-periods",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "기간끼리 천간합",
      "rule": "G: natal_saeun V4투영 외 기간 천간합 미지원",
      "required": "표의 존재만으로 각 scope에 producer가 있는 것은 아니다.",
      "prohibited": "stem 표를 임의 적용해 runtime 근거 생성",
      "nextEvidence": "각 생산자 계약과 시간 ledger 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:wonjin-periods",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 5,
      "originalId": "tr:held:wonjin-periods",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "638ade8a1c4c731c5ec3401086dcbdba4023843ce47c59c38c4968251791ec50"
    },
    "originalState": {
      "id": "tr:held:wonjin-periods",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "기간끼리 원진",
      "rule": "G: 실제 기간간 원진 producer 없음",
      "required": "월운 확장의 natal anchor 원진과 기간 쌍 원진은 다르다.",
      "prohibited": "확장 원진을 dayun_saeun 원진으로 바꿈",
      "nextEvidence": "쌍의 owner와 source 도입 승인 필요"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:haphwa",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 6,
      "originalId": "tr:held:haphwa",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ae05066e9a1af17487f194801cef18e5dfbc1908fa2a2c3bf0c70674e0529460"
    },
    "originalState": {
      "id": "tr:held:haphwa",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "합화·격국 전환",
      "rule": "G: 현재 기간 합화·격국변화 근거 없음",
      "required": "관계 구성과 화·격국 판정은 같은 단계가 아니다.",
      "prohibited": "합 검출을 오행 변환으로 확정",
      "nextEvidence": "성립·실패 조건의 학파 비교와 계산 승인"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:domain-effects",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 7,
      "originalId": "tr:held:domain-effects",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "87b9281c4f5132d23334ac437bc3ac20f77311715842357a92cc4f96eb49bd66"
    },
    "originalState": {
      "id": "tr:held:domain-effects",
      "class": "E",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "조합별 생활 효력",
      "rule": "E: 생활 결과의 실증 자료 없음",
      "required": "D 질문의 유용성이 사건 예측을 검증하지 않는다.",
      "prohibited": "직업·재물·혼인 성공 예측",
      "nextEvidence": "사전 정의한 반례·비예측적 독해 검토"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unverified",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:month-wolun-lineage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 8,
      "originalId": "tr:held:month-wolun-lineage",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f1b47dfb14797233d79113fbdb41f701ee43e241043a5b5fdaa012424450391b"
    },
    "originalState": {
      "id": "tr:held:month-wolun-lineage",
      "class": "E",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "월운 세부 전거",
      "rule": "E: 일부 월별 적용의 독립 전통 전거 미확인",
      "required": "월령의 계절론을 현재 모든 월별 현대 조언의 전거로 쓸 수 없다.",
      "prohibited": "월별 질문을 고전 원문 해석으로 표시",
      "nextEvidence": "월운 자체를 다루는 일차 판본 추가 대조"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unverified",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:legacy-impact",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 9,
      "originalId": "tr:held:legacy-impact",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a776246f20b0d5598c92877abd8da1d7317459ba292624d4c77c14be0d55e8a2"
    },
    "originalState": {
      "id": "tr:held:legacy-impact",
      "class": "E",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "레거시 고객 영향",
      "rule": "E: 호출자별 실제 출력 영향 추가 추적 필요",
      "required": "혼합 배열은 확인됐으나 모든 고객 경로의 영향 범위는 이번 DB 작업에서 확정하지 않았다.",
      "prohibited": "영향 없음 또는 현재 고객 오류 확정",
      "nextEvidence": "별도 읽기 전용 재현·고객 저장본 불변 원칙"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unverified",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:temporal-ref:tr:held:element-magnitude",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/temporal-interaction-research/temporalUnverified.ts",
      "exportName": "TEMPORAL_UNVERIFIED",
      "index": 10,
      "originalId": "tr:held:element-magnitude",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ca6e9478fe4f49e2ef22bebe573426c41987942ff8f443d64d8488d82f9e73aa"
    },
    "originalState": {
      "id": "tr:held:element-magnitude",
      "class": "G",
      "sourceRefs": [
        "repo-periods",
        "editorial"
      ],
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "runtimeEvidenceIds": [],
      "subject": "오행 영향 크기",
      "rule": "G: 연구25칸은 크기 계산 아님",
      "required": "방향은 비교할 수 있으나 기간의 유입량·강도 점수는 제공되지 않는다.",
      "prohibited": "오행 하나 증가를 20% 개선으로 표기",
      "nextEvidence": "강도 모델의 근거·후속 승인 필요"
    },
    "referenceOnly": true,
    "majorUse": "withhold_unsupported",
    "bindingImplemented": false
  }
];
