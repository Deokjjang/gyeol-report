import type { RelationSource } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_RESEARCH_SOURCES = [
  {
    "id": "sm2",
    "title": "三命通會 卷二",
    "author": "萬民英（明）",
    "edition": "維基文庫 四庫全書本 전사; 원본 영인 전체 교감 아님",
    "url": "https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷02",
    "kind": "historical_transcription",
    "accessed": "2026-10-13",
    "sections": [
      "論十干合",
      "論十干化氣",
      "論支元六合",
      "論支元三合",
      "論六害",
      "論三刑",
      "論衝擊"
    ],
    "supports": "5천간합·6육합·4삼합·6해·6충·형의 구성과 성립/작용의 차이, 합화 별도 조건, 형 분류의 다른 전승을 실제 전사 본문에서 확인.",
    "limitations": [
      "전통 주장의 존재를 확인했으며 실증 효력을 확인한 것이 아니다.",
      "문헌의 성별·도덕·건강·사건 단정은 고객 해석에 채택하지 않는다.",
      "四庫土局4지지는 현행4삼합3지지 목록에 합치지 않는다."
    ]
  },
  {
    "id": "dt",
    "title": "滴天髓",
    "author": null,
    "edition": "維基文庫 輯要 온라인 본문·주석; 저자 귀속·주석 층위 미확정",
    "url": "https://zh.wikisource.org/wiki/滴天髓",
    "kind": "historical_transcription",
    "accessed": "2026-10-13",
    "sections": [
      "地支의 沖/合/刑害 논의",
      "旺者沖衰衰者拔，衰者沖旺旺神發 주변"
    ],
    "supports": "충의 왕쇠 차이와 형해를 일률적으로 흉으로 볼 수 없다는 현재 전사의 논의를 확인.",
    "limitations": [
      "다른 판본의 闡微 장을 읽었다고 주장하지 않는다.",
      "현 전사에서 찾지 못한 支神只以沖為重 등의 문구는 출처로 사용하지 않는다."
    ]
  },
  {
    "id": "zp7",
    "title": "子平真詮 七、論刑沖會合解法",
    "author": "沈孝瞻",
    "edition": "典藏網 온라인 전사; 원본 판본 대조 미완료",
    "url": "https://www.diancangwang.cn/xuanxuewushu/03cf53eede8a/e441cca6da67.html",
    "kind": "historical_transcription",
    "accessed": "2026-10-13",
    "sections": [
      "七 전체: 卯酉沖의 합·삼합 해법",
      "子卯刑 예",
      "解而復得刑沖 / 解又生刑 사례"
    ],
    "supports": "합으로 해충·해형하는 경우와 해법의 참여자가 다시 묶여 충·형이 남는 조건부 사례를 확인. 삼형 유래를 의심하는 원문 입장도 보존.",
    "limitations": [
      "전사 일부는 三會·取庑 등 표기 차이가 있어 교감 전 보류.",
      "申子辰을 이 절이 會/三會로 부른 것을 현대 방합의 정의로 합치지 않는다."
    ]
  },
  {
    "id": "zp5",
    "title": "子平真詮 五、論十干合而不合",
    "author": "沈孝瞻",
    "edition": "MingSage 古籍原句 층위만 고전으로 사용; 사이트 해설·영문 제외",
    "url": "https://www.mingsage.com/zh/classics/zi-ping-zhen-quan/lun-shi-gan-he-er-bu-he",
    "kind": "historical_transcription",
    "accessed": "2026-10-13",
    "sections": [
      "隔位 / 遠隔의 合而不合",
      "合一留一 / 本身之合",
      "爭合妒合의 조건"
    ],
    "supports": "거리·방해·본신합·다중 합의 차이를 확인. 원거리 천간을 半合이라 부르는 본문의 용례는 지지 반합과 다르다.",
    "limitations": [
      "사이트 현대 해설을 원문 저자의 직접 주장으로 채택하지 않는다.",
      "격간·원거리 제한은 현행 모든 원국쌍 일치 판정에 반영되어 있지 않다."
    ]
  },
  {
    "id": "pa",
    "title": "사주클래스 명리 사전: 파(破)",
    "author": null,
    "edition": "현대 웹 제공자 자체 해설",
    "url": "https://sajuclass.com/명리-사전/합충형파해/파/",
    "kind": "modern_provider",
    "accessed": "2026-10-13",
    "sections": [
      "파의6쌍 표",
      "합·형과의 중복 및 여러 견해"
    ],
    "supports": "현대 제공자가 쓰는 파6쌍을 직접 확인하고 기존 표와 대조했다.",
    "limitations": [
      "저자 자격·고전 직접 계보·조합별 독립 작용은 미확인.",
      "질병·사건·강도 순위를 객관적 계산으로 채택하지 않는다."
    ]
  },
  {
    "id": "half",
    "title": "사주클래스 명리 사전: 삼합(三合)",
    "author": null,
    "edition": "현대 웹 제공자 자체 해설",
    "url": "https://sajuclass.com/명리-사전/합충형파해/삼합/",
    "kind": "modern_provider",
    "accessed": "2026-10-13",
    "sections": [
      "4삼합 구성",
      "生旺/旺庫의 반합",
      "왕지 없는 生庫의 제외·약한 작용 견해"
    ],
    "supports": "왕지 포함 반합과 생고 쌍의 다른 취급이 존재함을 확인. 저장소의12쌍과 별도 비교 목록으로 보존.",
    "limitations": [
      "고전 최초 전거·전승별 전체 교감 미확인.",
      "8쌍 목록은 확인한4삼합과 왕지 기준을 대조한 연구 목록이며 새 producer가 아니다."
    ]
  },
  {
    "id": "wonjin",
    "title": "원진살(怨嗔煞)",
    "author": "현묘",
    "edition": "2019-06-28 현대 저자 웹 글",
    "url": "https://yavares.tistory.com/143",
    "kind": "modern_author",
    "accessed": "2026-10-13",
    "sections": [
      "적용",
      "성립의 여러 방법 / 인접 기준",
      "참고자료"
    ],
    "supports": "원진6쌍·인접 원국 조건·교차 일지 적용이라는 저자의 견해를 확인. 전승의 차이 자체를 보존.",
    "limitations": [
      "동물 설화의 고전 기원·조합별 효력은 확인하지 못했다.",
      "간접 언급 책·팟캐스트를 직접 읽은 출처로 기재하지 않는다.",
      "정신·건강·애증·최강 쌍 단정은 채택하지 않는다."
    ]
  },
  {
    "id": "kci",
    "title": "십이지(十二支)의 상호작용 관계로서 충(衝)·형(刑)에 관한 근원 고찰",
    "author": "김만태",
    "edition": "한국학36(3),2013,134–164; DOI10.25024/ksq.36.3.201309.134; 초록·서지정보만 열람",
    "url": "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001802048",
    "kind": "academic_abstract",
    "accessed": "2026-10-13",
    "sections": [
      "KCI 한국어 초록",
      "저자·발행 정보"
    ],
    "supports": "충·형·원진 해석 원리와 개고의 논쟁이 연구된다는 초록 수준의 확인.",
    "limitations": [
      "전문·각주·원전 인용 검증은 수행하지 못했다.",
      "초록만으로 원진6쌍 고전 계보·개인 예측 효력을 입증하지 않는다.",
      "참고문헌은 직접 열람한 문헌 목록이 아니다."
    ]
  },
  {
    "id": "repo",
    "title": "기존 명리 관계 생산자",
    "author": null,
    "edition": "기준95d59c50600a504b40bc9a031c96dee7ba0a1694",
    "url": "local:src/lib/saju/relations.ts",
    "kind": "repository",
    "accessed": "2026-10-13",
    "sections": [
      "src/lib/saju/constants.ts",
      "src/lib/report-knowledge/compatibilityRelationRules.ts",
      "src/lib/report-knowledge/annualFortuneYearRules.ts",
      "src/lib/report-knowledge/sajuFeatureExtractionRules.ts",
      "src/lib/interpretation-v4/foundationSupplement.ts"
    ],
    "supports": "기존 조합표·지원 경로·위치·첫 ref·원진 투영의 실제 구현 확인.",
    "limitations": [
      "코드 지원은 전통 작용 전체나 예측 효력을 검증한 것이 아니다."
    ]
  },
  {
    "id": "foundation",
    "title": "기존 foundation 관계9항목",
    "author": null,
    "edition": "기준SHA의 자료 그대로",
    "url": "local:src/lib/report-knowledge/sajuFoundationKnowledge.ts",
    "kind": "repository",
    "accessed": "2026-10-13",
    "sections": [
      "rr:profile:stem_hap",
      "rr:profile:yukhap",
      "rr:profile:chung",
      "rr:profile:samhap",
      "rr:profile:hyeong",
      "rr:profile:hae",
      "rr:profile:banhap",
      "rr:profile:pa",
      "rr:profile:wonjin"
    ],
    "supports": "기존 ID·표기·정의·별칭의 보존 기준.",
    "limitations": [
      "기존 일반 정의를 분야별 예측의 승인으로 쓰지 않는다."
    ]
  },
  {
    "id": "authored",
    "title": "관계 연구의 조건부 현대 생활 질문",
    "author": null,
    "edition": "이번 작업에서 작성한 편집 연구; 외부 AI·runtime 사용 없음",
    "url": "local:relation-research",
    "kind": "authored",
    "accessed": "2026-10-13",
    "sections": [
      "관계 프로필의 조건부 추론",
      "64조합의 제한적 현대 장면",
      "72분야의 주 질문과 두 번째 검토 각도"
    ],
    "supports": "실제 생활 조건을 확인한 뒤 검토할 질문·판단 기준·금지 조건. 전통적 독립 사실로 집계하지 않는다.",
    "limitations": [
      "생활 예시가 있다고 그 관계에 고유한 작용이 증명된 것이 아니다.",
      "고객 사용·Evidence 연결·점수·원고 출력 모두 승인되지 않았다."
    ]
  }
] as const satisfies readonly RelationSource[];
