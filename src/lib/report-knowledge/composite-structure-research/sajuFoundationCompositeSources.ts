import type { CompositeSource } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_SOURCES = [
  {
    "id": "sm1",
    "kind": "historical_transcription",
    "title": "三命通會 四庫全書本 卷一",
    "url": "https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷01",
    "accessed": "2026-10-13",
    "scope": "論五行의 木·火·土·金·水, 徐大升 논설. 상생 과용·계절·강약 부분을 읽음.",
    "limits": "온라인 전사 열람. 전 판본 교감 아님. 납음 문단의 주장을 정오행 규칙에 섞지 않음. 빈부·질병·가족 예언 채택 안 함."
  },
  {
    "id": "sm5",
    "kind": "historical_transcription",
    "title": "三命通會 四庫全書本 卷五",
    "url": "https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷05",
    "accessed": "2026-10-13",
    "scope": "正官·偏官·正財·偏財·印綬·傷官·食神 관련 성립·거류·생제 조건.",
    "limits": "여러 논설을 집성한 전사본. 서로 다른 격국·시점의 조건을 단일 공식으로 병합하지 않음."
  },
  {
    "id": "dt",
    "kind": "historical_transcription",
    "title": "滴天髓輯要 온라인 합본",
    "url": "https://zh.wikisource.org/wiki/滴天髓",
    "accessed": "2026-10-13",
    "scope": "衰旺·中和·寒暖 안의 燥濕·月令·通隔·母子와 천간·지지의 조건.",
    "limits": "원문·주해의 층위 및 저자 귀속을 확정한 비판 판본 아님. 관찰·예측의 경험적 검증 아님."
  },
  {
    "id": "zp6",
    "kind": "historical_transcription",
    "title": "子平真詮 六 論十干得時不旺失時不弱",
    "url": "https://www.donglishuzhai.net/chapter/3719.html",
    "accessed": "2026-10-13",
    "scope": "월령 외 다른 자리의 손익, 통근과 천간 동류 수의 차이.",
    "limits": "사이트의 교정 표시 포함. 표본적 원문 판독이며 수치 강약 공식으로 사용하지 않음."
  },
  {
    "id": "zp8",
    "kind": "historical_transcription",
    "title": "子平真詮 八 論用神",
    "url": "https://www.donglishuzhai.net/chapter/3721.html",
    "accessed": "2026-10-13",
    "scope": "월령 주객과 財生官·官印·殺印·食財의 역할 차이.",
    "limits": "사이트의 東里山人按은 후대 편집 주이며 원저자 설명과 분리. 부억의 용신 개념으로 자동 병합 안 함."
  },
  {
    "id": "zp9",
    "kind": "historical_transcription",
    "title": "子平真詮 九 論用神成敗救應",
    "url": "https://www.donglishuzhai.net/chapter/3722.html",
    "accessed": "2026-10-13",
    "scope": "성립·파괴·구응을 나누는 조건. 식재·재관·인성 및 관살의 반전 조건.",
    "limits": "격국 취용의 맥락이며 실제 재물·성공·사건 예언을 승인하지 않음."
  },
  {
    "id": "zp14",
    "kind": "historical_transcription",
    "title": "子平真詮 十四 論用神配氣候得失",
    "url": "https://www.donglishuzhai.net/chapter/3727.html",
    "accessed": "2026-10-13",
    "scope": "월령 격국과 한난의 상호 검토, 겨울·여름의 목 및 금수상관 예외.",
    "limits": "전사 교정과 원문 구별. 현대 기후·체온·심리 평가의 근거 아님."
  },
  {
    "id": "repo-foundation",
    "kind": "repository",
    "title": "기존 canonical 구조 정의 29개",
    "path": "src/lib/report-knowledge/sajuFoundationKnowledge.ts",
    "scope": "기준 SHA의 기존 ID·별칭·정의·지원 설명",
    "limits": "내부 정의의 존재이며 외부 전거·성립 완성 보증 아님."
  },
  {
    "id": "repo-rules",
    "kind": "repository",
    "title": "V4 구조 14 규칙·평가·강약",
    "path": "src/lib/interpretation-v4/structureRules.ts",
    "scope": "structureEvidence.ts·strength.ts·structureTypes.ts 함께 검토",
    "limits": "보수적인 내부 정책. 고전 수식 아님."
  },
  {
    "id": "repo-legacy",
    "kind": "repository",
    "title": "원생 휴리스틱과 facts 매핑",
    "path": "src/lib/saju/structureAnalysis.ts",
    "scope": "실제 push 11종·별도 강약; 사전 선언 14종과 구별. mapper/types 및 V2 toSpecialPatterns 확인",
    "limits": "enum·매핑·fixture 존재는 실제 producer가 있다는 증거 아님."
  },
  {
    "id": "authored",
    "kind": "editorial_research",
    "title": "이번 작업의 조건부 연구와 현대 적용",
    "scope": "구조별 추론 C, 분야별 질문·상황 D, 미검증 E, 반려 F를 분리 작성",
    "limits": "고전 직역·전통 확정 명제·경험적 사실·계산 증거가 아니다. 고객 적용 승인 0."
  }
] as const satisfies readonly CompositeSource[];
