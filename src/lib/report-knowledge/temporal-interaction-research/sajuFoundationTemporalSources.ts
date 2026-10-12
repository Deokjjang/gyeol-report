import type { TemporalSource } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_SOURCES = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  }
] as const satisfies readonly TemporalSource[];
