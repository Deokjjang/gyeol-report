import type { TemporalGod } from "./temporalTenGodSource";
export type MeaningField = "dayun" | "saeun" | "wolun";
export type MeaningClass = "A" | "B" | "C" | "D" | "E" | "F";
export type ExternalTemporalSource = {
 id: string; requestedUrl: string; finalUrl: string; accessedAt: string; status: number;
 bodySha256: string; bytes: number; authorOrCompiler: string; title: string; edition: string;
 section: string; page: string; readSummary: string; supports: string[]; doesNotSupport: string[];
 shortLocatorAnchor: string; verification: "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION";
 sourceKind: "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION"; modernNotesArePrimaryText: false; empiricalEvidence: false;
};
export type TemporalMeaningReading = {
 god: TemporalGod; sources: string[]; traditionalSupport: string; classification: MeaningClass;
 commonMeaningId: string; independentTemporalKnowledgeCount: 0; periodAssessment: string; counterexample: string;
 fields: Record<MeaningField, {analysis: string; requiredContext: string; counterexample: string;
 classification: MeaningClass[]; directTraditionalSupport: false; empiricallyValidated: false}>;
};
/** Freshly read historical transcriptions. Authored summaries and modern proposals
 * are not original quotations, empirical predictions, or operator approvals. */
export const EXTERNAL_TEMPORAL_SOURCES: readonly ExternalTemporalSource[] = [
  {
    "id": "sm2",
    "requestedUrl": "https://zh.wikisource.org/w/index.php?oldid=761691&title=%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B702",
    "accessedAt": "2026-10-18T16:33:07.488308+00:00",
    "status": 200,
    "finalUrl": "https://zh.wikisource.org/w/index.php?oldid=761691&title=%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B702",
    "bodySha256": "d680ad00c5a491715d7a9018a1d9d32ff1f4ae4361613e19b0c1ba11c28ebc8b",
    "bytes": 186134,
    "authorOrCompiler": "萬民英",
    "title": "三命通會",
    "edition": "四庫全書本 전사 oldid761691; 스캔 교감 미실시",
    "section": "卷二 論大運 제1·2문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "선원국 후행운·십년 단위·기존 경중을 함께 보는 전통 논의",
    "supports": [
      "선원국 후행운·십년 단위·기존 경중을 함께 보는 전통 논의"
    ],
    "doesNotSupport": [
      "현대 행동 조언, 현재 엔진 경계 시각의 정확성, 경험적 예측 효과",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "先論根基後言運氣",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "sm5",
    "requestedUrl": "https://zh.wikisource.org/w/index.php?oldid=2082207&title=%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B705",
    "accessedAt": "2026-10-18T16:33:07.488694+00:00",
    "status": 200,
    "finalUrl": "https://zh.wikisource.org/w/index.php?oldid=2082207&title=%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B705",
    "bodySha256": "aa11038814baca03183fe80dbf9349d81bd98370d5c62a3877cb32f1bd403d32",
    "bytes": 207175,
    "authorOrCompiler": "萬民英",
    "title": "三命通會",
    "edition": "四庫全書本 전사 oldid2082207; 스캔 교감 미실시",
    "section": "卷五 論古人立印食官財名義/正官/偏官/正財/偏財/印綬/倒食",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "생극 분류와 재·관·인 해석의 원국 조건 및 반대 조건",
    "supports": [
      "생극 분류와 재·관·인 해석의 원국 조건 및 반대 조건"
    ],
    "doesNotSupport": [
      "현대 수입·승진·학습 효과, 월별 행동의 효과, 실제 가족 사실",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "印綬者乃五行生我之名",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "dt9",
    "requestedUrl": "https://zh.wikisource.org/wiki/%E6%BB%B4%E5%A4%A9%E9%AB%93/09",
    "accessedAt": "2026-10-18T16:33:07.488829+00:00",
    "status": 200,
    "finalUrl": "https://zh.wikisource.org/wiki/%E6%BB%B4%E5%A4%A9%E9%AB%93/09",
    "bodySha256": "7c36482c24adf0d3afa77e98cbc12fcde746c6c6c31ee1f9b6978b565174b54f",
    "bytes": 60117,
    "authorOrCompiler": "본문 전통 귀속 劉基; 이 전사 해설 저자 미확정",
    "title": "滴天髓",
    "edition": "Wikisource 歲運論; 본문과 후대 해설 혼재, 스캔 교감 미실시",
    "section": "09 歲運論 첫 문장 및 日主譬如吾身 해설",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "대운 배경과 세운 조건을 구분하는 역사적 비유",
    "supports": [
      "대운 배경과 세운 조건을 구분하는 역사적 비유"
    ],
    "doesNotSupport": [
      "월운별 행동 지침, 해설의 정확한 저자 귀속, 실증적 사건 예측",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "休咎係乎運",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp2",
    "requestedUrl": "https://donglishuzhai.net/chapter/3715.html",
    "accessedAt": "2026-10-18T16:33:07.488938+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3715.html",
    "bodySha256": "83ad5549e99c3da57cfc19ac86c62ea38a3d3cf60b5f3ec82931771126ace245",
    "bytes": 23485,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 校와 東里山人按은 현대 편집층",
    "section": "卷一 二 論陰陽生尅 생극·관살·인성 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "생극과 음양별 관살 구분; 인성 편정의 유사성이라는 이 책의 견해",
    "supports": [
      "생극과 음양별 관살 구분; 인성 편정의 유사성이라는 이 책의 견해"
    ],
    "doesNotSupport": [
      "편인=창의·정인=표준 학습의 실증적 차이; 다른 전통과 단일 정답화",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "印綬之中，偏正相似",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp4",
    "requestedUrl": "https://donglishuzhai.net/chapter/3717.html",
    "accessedAt": "2026-10-18T16:33:08.107777+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3717.html",
    "bodySha256": "996c3f27b659f3069f0ee85564a1401f384b43ee84bffc6ae6266c0c415ae43c",
    "bytes": 23496,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 현대 교감과 이견 분리",
    "section": "卷一 四 論十干配合性情 甲用己財/甲逢乙爲劫 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "비겁·식상·인관의 간지 사례와 합 조건에 따른 해석 차이",
    "supports": [
      "비겁·식상·인관의 간지 사례와 합 조건에 따른 해석 차이"
    ],
    "doesNotSupport": [
      "현대 계약·협업의 존재와 자동 합화; 편집자의 인성 이견을 원저 결론화",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "甲逢乙爲劫",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp25",
    "requestedUrl": "https://donglishuzhai.net/chapter/3738.html",
    "accessedAt": "2026-10-18T16:33:08.516095+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3738.html",
    "bodySha256": "d776ce5f87380eef39980362b24f020a49590729aa3c4b1bde8c65b98c9000a6",
    "bytes": 25473,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 校와 東里山人按 분리",
    "section": "卷二 二十五 論行運 원국 배합·희기 반전·간지 구별 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "운의 글자를 전체 원국과 비교하고 같은 분류도 조건에 따라 다르게 해석",
    "supports": [
      "운의 글자를 전체 원국과 비교하고 같은 분류도 조건에 따라 다르게 해석"
    ],
    "doesNotSupport": [
      "현대 행동 유효성·월별 적용; 편집자 지적의 모순을 해결했다고 주장",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "配命中八字而統觀之",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp37",
    "requestedUrl": "https://donglishuzhai.net/chapter/3750.html",
    "accessedAt": "2026-10-18T16:33:08.594157+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3750.html",
    "bodySha256": "f979ea31e8ca3fde035d2190cb4de481420c4f812bc31e1d99c93873b57ebd13",
    "bytes": 23213,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 역사적 사례의 실증 검증 미실시",
    "section": "卷三 三十七 論食神 첫 문장·全局之勢 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "식신의 설기·생재를 전체 구성과 함께 보는 전통 개념",
    "supports": [
      "식신의 설기·생재를 전체 구성과 함께 보는 전통 개념"
    ],
    "doesNotSupport": [
      "현대 생산 공정·휴식 처방·보상 보장",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "食神本屬洩氣",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp38",
    "requestedUrl": "https://donglishuzhai.net/chapter/3751.html",
    "accessedAt": "2026-10-18T16:33:08.708721+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3751.html",
    "bodySha256": "ec8f2d69a62905ae058c5c14df857ab7b83e3877f7e95a8f4b0c751c782f83f1",
    "bytes": 22091,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 校는 현대 교감층",
    "section": "卷三 三十八 論食神取運 전체 6조건 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "식신격의 구성·재식 경중에 따라 취운 해석이 달라짐",
    "supports": [
      "식신격의 구성·재식 경중에 따라 취운 해석이 달라짐"
    ],
    "doesNotSupport": [
      "운간 식신 하나로 식신격 성립 또는 현대 품질 관리 효과",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "食神取運",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp41",
    "requestedUrl": "https://donglishuzhai.net/chapter/3754.html",
    "accessedAt": "2026-10-18T16:33:08.754759+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3754.html",
    "bodySha256": "f96f3eb5979ec3a20529b5710038b06efd3f9785365d2722adbf42a0f39888f9",
    "bytes": 24437,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 校는 현대 교감층",
    "section": "卷三 四十一 論傷官 첫 문단 및 用官 예외",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "상관의 수기와 기후·경중·구성별 차이; 무조건 흉으로 보지 않음",
    "supports": [
      "상관의 수기와 기후·경중·구성별 차이; 무조건 흉으로 보지 않음"
    ],
    "doesNotSupport": [
      "법적 분쟁·실직 예언, 현대 비판 능력 실측",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "實爲秀氣",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp42",
    "requestedUrl": "https://donglishuzhai.net/chapter/3755.html",
    "accessedAt": "2026-10-18T16:33:09.230199+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3755.html",
    "bodySha256": "4368d1ab55ebb8aaaf790313641afac270d28d5e9d670317fde1cbef888d8ef3",
    "bytes": 22146,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 校는 현대 교감층",
    "section": "卷三 四十二 論傷官取運 用財/佩印/用官 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "상관격의 조건에 따른 서로 다른 취운 기준",
    "supports": [
      "상관격의 조건에 따른 서로 다른 취운 기준"
    ],
    "doesNotSupport": [
      "운간 상관만으로 상관견관 성립, 현대 제안 성공률",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "傷官取運",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  },
  {
    "id": "zp46",
    "requestedUrl": "https://donglishuzhai.net/chapter/3759.html",
    "accessedAt": "2026-10-18T16:33:09.291399+00:00",
    "status": 200,
    "finalUrl": "https://donglishuzhai.net/chapter/3759.html",
    "bodySha256": "81b96bf9f23c4b5e41fda9a5bfa6bb477fad9a2c63c26e815f3933ace84be10d",
    "bytes": 22453,
    "authorOrCompiler": "沈孝瞻 전통 귀속; 東里書齋 교감·按 별도",
    "title": "子平真詮",
    "edition": "秘本 전사; 校는 현대 교감층",
    "section": "卷四 四十六 論建祿月劫取運 用財帶傷食 문단",
    "page": "NOT_ESTABLISHED_TRANSCRIPTION_SECTION_USED",
    "readSummary": "재식 경중에 따라 비견·인성에 대한 해석이 반대가 됨",
    "supports": [
      "재식 경중에 따라 비견·인성에 대한 해석이 반대가 됨"
    ],
    "doesNotSupport": [
      "모든 비견·겁재운에 같은 결과 적용, 협업 구조·배분 권한 실재",
      "미래 사건의 실증적 증거 또는 고객 승인"
    ],
    "shortLocatorAnchor": "而不忌比肩",
    "verification": "ACCESSED_AND_SECTION_READ_NOT_CRITICAL_EDITION",
    "sourceKind": "HISTORICAL_PRIMARY_TEXT_TRANSCRIPTION",
    "modernNotesArePrimaryText": false,
    "empiricalEvidence": false
  }
];
export const CONDITIONAL_TEMPORAL_READINGS: readonly TemporalMeaningReading[] = [
  {
    "god": "비견",
    "sources": [
      "zp4",
      "zp46"
    ],
    "traditionalSupport": "동류의 존재와 조건별 비겁 역할은 확인되나, 자율성·경계라는 심리 정의는 직접 원문에 없다.",
    "classification": "E",
    "commonMeaningId": "conditional-common:비견",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "공동 책임이 필수인 일에서는 단독 수행이 자율성의 해법이 아닐 수 있다.",
    "fields": {
      "dayun": {
        "analysis": "장기간 유지할 자기 방식의 기반은 업무 구조 제안이다. 원국의 동류 유입만으로 독립성이 강해졌다고 말하지 않는다.",
        "requiredContext": "지속 업무의 결정권·협의 의무",
        "counterexample": "조직 개편으로 결정권이 바뀌면 같은 대운에도 재합의가 필요하다.",
        "classification": [
          "E",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "독자 결정과 공동 결정은 다른 승인선의 구별이다. 해당 연도에 새 권한이 생긴다는 뜻은 아니다.",
        "requiredContext": "해당 연도의 실제 담당·승인선",
        "counterexample": "단독 권한이 없는 상황에서는 독자 결정을 권하지 않는다.",
        "classification": [
          "E",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "혼자 끝낼 일과 나눌 일을 구별하는 단기 실행 질문이다. 월간 비견을 협업 사실로 쓰지 않는다.",
        "requiredContext": "구간 안의 실제 작업·분담 가능성",
        "counterexample": "분담 상대가 없으면 함께 나눌 일이 있다고 전제하지 않는다.",
        "classification": [
          "E",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "겁재",
    "sources": [
      "zp4",
      "zp46"
    ],
    "traditionalSupport": "동류와 재의 관계·비겁이 항상 흉하지 않다는 조건은 확인된다. 소유권·배분 합의는 현대적 확장이다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:겁재",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "공동 자원이 없는 사람에게 배분 문제를 가정할 수 없다.",
    "fields": {
      "dayun": {
        "analysis": "지속적 재점검은 배분 규칙의 유지 제안이며 겁재운에 손실이 반복된다는 예측이 아니다.",
        "requiredContext": "지속 공동 자원·기여·종료 규칙",
        "counterexample": "기여가 균등하지 않아도 당사자가 합의한 분담이면 갈등으로 단정하지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "비용과 기여를 따로 확인하는 회계적 질문이다. 올해의 도난·배신이나 분쟁을 입증하지 않는다.",
        "requiredContext": "올해 실제 공동 지출·기여 기록",
        "counterexample": "금전 교류 없는 협업에 공동 비용이 있다고 쓰지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "공유 범위를 좁히라는 선택은 과용 방지 가설이다. 무조건 축소가 유리하다는 뜻은 아니다.",
        "requiredContext": "이번 구간의 공동 사용 범위·상호 동의",
        "counterexample": "긴급 공동 과제에서는 범위 축소가 오히려 공동 목표를 해칠 수 있다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "식신",
    "sources": [
      "zp37",
      "zp38"
    ],
    "traditionalSupport": "설기·생재의 전통 설명은 있으나 반복 생산·휴식·품질은 현대 운영의 비유다. 식신격의 취운을 운간 식신 하나에 대입하지 않는다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:식신",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "무보상 취미도 산출이며 생산량이 늘어도 수입은 늘지 않을 수 있다.",
    "fields": {
      "dayun": {
        "analysis": "반복 가능한 생산 방식은 장기 유지 비용을 보는 응용이다. 식신의 유입으로 능력 축적이 완료됐다고 보지 않는다.",
        "requiredContext": "기존 능력·유지 공정·회복 여력",
        "counterexample": "새로 배우는 사람에게 축적한 능력이 있다고 서술하지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "결과물의 공급과 품질 확인은 당해 실제 생산을 전제로 한 운영 질문이다. 생재를 수익 확정으로 번역하지 않는다.",
        "requiredContext": "올해 결과물·공급 조건·품질 기준",
        "counterexample": "돌봄·학습 산출에는 매출 기준을 붙이지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "작은 산출과 휴식의 관찰은 단기 가설이며 건강 처방이 아니다. 해당 절입 구간을 넘겨 생산성 변화를 단정하지 않는다.",
        "requiredContext": "구간 안의 산출 단위·자기 관찰 가능성",
        "counterexample": "휴식 필요는 월간 십성으로 진단하지 않으며 실제 건강 문제는 별도다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "상관",
    "sources": [
      "zp41",
      "zp42"
    ],
    "traditionalSupport": "상관의 수기와 구성별 취운 차이는 확인된다. 관행 검토·대안 시험은 편집자가 만든 비파괴적 적용이다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:상관",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "제안이 옳아도 안전 규정이나 권한 때문에 실행할 수 없을 수 있다.",
    "fields": {
      "dayun": {
        "analysis": "관행을 설명할 통로는 장기 소통 체계의 제안이다. 상관격·상관견관 또는 법적 갈등을 자동 판정하지 않는다.",
        "requiredContext": "기존 관행·변경 권한·검증 통로",
        "counterexample": "검증된 안전 절차를 단지 오래됐다는 이유로 바꾸지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "수신자와 기준은 당해 제안의 전달 조건이다. 반대 의견이 생긴 사실이나 수용 결과를 창작하지 않는다.",
        "requiredContext": "올해 실제 제안·수신자·평가 기준",
        "counterexample": "상대 의견이 없거나 미확인이라면 반대당했다고 쓰지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "비판과 대안을 작게 시험하는 방법은 가역성 조건을 추가한 현대 제안이다. 원문에 월별 실험 법칙은 없다.",
        "requiredContext": "구간 내 가역적 시험·안전 승인",
        "counterexample": "돌이킬 수 없는 의료·법률·금융 결정은 작은 시험 비유로 정당화하지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "편재",
    "sources": [
      "sm5"
    ],
    "traditionalSupport": "정재와 다른 재의 전통 사례는 있으나 가변 자원·외부 기회라는 현대 묶음은 직접 원문이 아니다. 신강·재다 등의 조건을 자동 계산했다고 보지 않는다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:편재",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "제안이 없거나 유동성이 부족하면 선택지 확대를 사실로 말할 수 없다.",
    "fields": {
      "dayun": {
        "analysis": "다양한 연결의 관리 여력은 장기 수용 한도에 관한 제안이다. 편재운이 새로운 인맥을 만들어낸다고 보지 않는다.",
        "requiredContext": "지속 연결·가용 자원·기존 의무",
        "counterexample": "학생·휴식기에 거래나 사업이 있다고 가정하지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "제안 규모와 확보 자원의 분리는 가능성과 실현의 구별이다. 올해 횡재나 매출을 뜻하지 않는다.",
        "requiredContext": "올해 실제 제안·확정 자원·회수 조건",
        "counterexample": "규모가 큰 제안이어도 실제 확보액이 0일 수 있다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "탐색 비용과 중단 기준은 단기 손실 제한을 위한 질문이다. 투자 조언이나 수익 예측이 아니다.",
        "requiredContext": "구간 내 탐색 비용·중단 가능성",
        "counterexample": "중단할 수 없는 기존 의무를 새로운 탐색 과제로 취급하지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "정재",
    "sources": [
      "sm5"
    ],
    "traditionalSupport": "재성의 생극·부담 조건은 전통 개념이다. 예산·시간표·확정액은 현실 검증이 필요한 현대 운영 항목이다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:정재",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "정재가 계산돼도 고정 소득이 없거나 지출이 소득보다 클 수 있다.",
    "fields": {
      "dayun": {
        "analysis": "지속 운영과 배분 체계는 기반 관리의 공통 질문이다. 향후 십년간 안정 수입이 보장되는 의미가 아니다.",
        "requiredContext": "지속 자원·고정 의무·유동성",
        "counterexample": "불규칙 수입이면 지속 운영은 수입 안정이 아닌 지출 대응일 수 있다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "수입·시간·지출의 확정 항목 확인은 당해 장부의 문제다. 해당 세운의 재성이 금액을 계산한 것은 아니다.",
        "requiredContext": "올해 실제 수입·지출·시간 기록",
        "counterexample": "예정된 입금이 취소되면 확정 항목에서 제외해야 한다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "예정과 확보 자원의 구별은 이번 구간의 집행 질문이다. 월주 재성이 입금 완료를 입증하지 않는다.",
        "requiredContext": "구간 내 집행 계획·실제 잔여 자원",
        "counterexample": "확보액이 있어도 이미 다른 의무에 묶여 있다면 가용액이 아니다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "편관",
    "sources": [
      "sm5",
      "zp2"
    ],
    "traditionalSupport": "동음양의 극과 제화 조건은 확인된다. 긴급 요구·지원 구조는 통제 상징의 현대적 적용이며 위기의 존재는 별도다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:편관",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "편관이 있어도 긴급 요구가 없을 수 있으며 제살·살인상생의 성립은 별도 검증 대상이다.",
    "fields": {
      "dayun": {
        "analysis": "준비와 지원 구조의 유지는 장기 대응 여력 제안이다. 계속 압박을 겪는다는 서사가 아니다.",
        "requiredContext": "지속 책임·결정권·지원 접근",
        "counterexample": "요구가 없는 기간에는 위기 대비를 당사자의 과거 경험으로 쓰지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "강한 요구의 범위와 감당 조건은 올해 확인된 과제에 한정한다. 사고·질병·승진 예측으로 확장하지 않는다.",
        "requiredContext": "올해 실제 요구·자원·거절 권한",
        "counterexample": "쉽게 처리할 과제를 편관 때문에 위협적인 사건으로 꾸미지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "급한 요구의 우선순위·지원 확인은 단기 대응 질문이다. 출처만으로 긴급 상황을 발명하지 않는다.",
        "requiredContext": "구간 안의 실제 긴급성·지원 담당",
        "counterexample": "긴급한 일이 없으면 우선순위 조정의 필요도 보류한다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "정관",
    "sources": [
      "sm5",
      "zp2"
    ],
    "traditionalSupport": "정관의 상극·공적 역할 상징은 확인된다. 현대 규정·평가 절차가 실제 존재한다는 근거는 아니다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:정관",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "공식 조직이 없는 사람에게 승진·인사평가를 가정할 수 없다.",
    "fields": {
      "dayun": {
        "analysis": "일관된 책임 수행 체계는 장기 약속의 관리 제안이다. 관운의 직위 획득으로 번역하지 않는다.",
        "requiredContext": "지속 규정·실제 맡은 책임·종료 조건",
        "counterexample": "부당하거나 불필요한 규칙은 준수보다 재협의가 필요할 수 있다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "평가 기준과 책임 경계는 당해 확인 가능한 절차의 질문이다. 올해 평가나 채용이 확정됐다는 뜻은 아니다.",
        "requiredContext": "올해 실제 평가 절차·역할 합의",
        "counterexample": "공식 평가가 없으면 상대가 나를 평가 중이라는 문장을 쓰지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "마감·승인·역할 명시는 구간 내 업무 정의다. 월간 정관이 승인권을 부여하지 않는다.",
        "requiredContext": "구간 안의 실제 마감·승인권자·담당",
        "counterexample": "개인의 역할 선언만으로 승인권자나 법적 의무를 확정하지 않는다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "편인",
    "sources": [
      "sm5",
      "zp2",
      "zp4"
    ],
    "traditionalSupport": "생조의 편정 구분은 확인되나 선별 수용·관점 전환의 심리적 차이는 직접 뒷받침되지 않는다. 인성 유사 견해와 도식 조건의 차이를 보존한다.",
    "classification": "E",
    "commonMeaningId": "conditional-common:편인",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "다른 관점이 실제 오류를 해결하지 못하거나 익숙한 자료가 더 적합할 수 있다.",
    "fields": {
      "dayun": {
        "analysis": "특화 지식의 활용 경로는 장기 탐색 전략 가설이다. 편인운에 전문성이나 특별한 재능이 발생했다는 뜻은 아니다.",
        "requiredContext": "실제 특화 자료·활용 분야·검증 방법",
        "counterexample": "전문 자료가 없는 상황에 기존 전문 지식이 있다고 가정하지 않는다.",
        "classification": [
          "E",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "익숙한 설명의 한계 구별은 당해 미해결 질문을 전제로 한다. 편인이 새로운 통찰의 정확성을 보장하지 않는다.",
        "requiredContext": "올해 실제 미해결 질문·기존 설명",
        "counterexample": "이미 해결된 질문에 막힘이나 고립 경험을 덧붙이지 않는다.",
        "classification": [
          "E",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "자료 비교와 적용 유예는 검증 단계의 제안이다. 유예가 항상 좋다는 원문 근거는 없다.",
        "requiredContext": "구간 내 비교 자료·시험 방법·유예 비용",
        "counterexample": "즉시 대응이 필요한 일에 조사를 이유로 무기한 유예하지 않는다.",
        "classification": [
          "E",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  },
  {
    "god": "정인",
    "sources": [
      "sm5",
      "zp2"
    ],
    "traditionalSupport": "생아·보호의 상징은 확인된다. 학습 기반·문서화와 지원의 실제 이용은 현대적 적용이고 합격 효과는 입증하지 않는다.",
    "classification": "C",
    "commonMeaningId": "conditional-common:정인",
    "independentTemporalKnowledgeCount": 0,
    "periodAssessment": "공통 질문 + 기간·맥락별 적용 조건; 세 독립 전통 지식으로 집계하지 않음",
    "counterexample": "지원이 제공돼도 이용 조건이 맞지 않거나 독립 수행을 방해할 수 있다.",
    "fields": {
      "dayun": {
        "analysis": "받은 지식·지원을 실행 기반으로 정리하는 것은 장기 활용 제안이다. 실제 지원을 받은 과거 사건으로 읽지 않는다.",
        "requiredContext": "지속 학습·제공된 자료·지원 이용 자격",
        "counterexample": "지원을 받지 않았다면 받은 지식이라는 과거 사실 문장은 보류한다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "saeun": {
        "analysis": "배울 내용과 받을 수 있는 도움 구별은 당해 접근 자원의 확인이다. 귀인 출현·합격을 예언하지 않는다.",
        "requiredContext": "올해 교육 내용·지원 자격·이용 가능성",
        "counterexample": "지원 제도가 있어도 본인이 자격을 충족하지 않을 수 있다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      },
      "wolun": {
        "analysis": "복습·문서화·질문 범위는 단기 학습 행동 제안이다. 월간 정인만으로 기억력이나 시험 결과를 판정하지 않는다.",
        "requiredContext": "구간 내 실제 학습 자료·질문 상대·목적",
        "counterexample": "문서화가 필요 없는 과제에서는 반복 기록이 실행을 늦출 수 있다.",
        "classification": [
          "C",
          "D"
        ],
        "directTraditionalSupport": false,
        "empiricallyValidated": false
      }
    }
  }
];
