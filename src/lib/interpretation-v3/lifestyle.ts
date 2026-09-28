import type { Evidence } from "./types";
/** User-specified symbolic lifestyle library; no health/relocation/event promise. */
export const ELEMENT_LIFESTYLE = {
  wood: { missing: ["학습과 계획", "자연 속 걷기", "작은 새 프로젝트"], excess: ["진행 중인 계획의 우선순위 정리"] },
  fire: { missing: ["낮 시간의 햇빛", "감정 표현", "사회 활동"], excess: ["활동 사이의 조용한 휴식"] },
  earth: { missing: ["생활 루틴", "일정과 공간 정리"], excess: ["고정 루틴에 작은 변화 넣기"] },
  metal: { missing: ["무리 없는 근력 활동", "물건 정리", "수치와 기준 기록"], excess: ["기준 밖의 선택을 위한 여유 남기기"] },
  water: { missing: ["독서와 생각 정리", "기록", "안전한 수영", "휴식"], excess: ["생각을 작은 실행으로 마무리하기"] },
} as const;
export function lifestyleSuggestions(evidence: readonly Evidence[]) {
  return evidence.flatMap(e => {
    if (e.scope !== "natal" || e.kind !== "element" || e.certainty !== "confirmed" || !e.sourceRefs.length || !e.lineage.length || !e.value || typeof e.value !== "object") return [];
    const value = e.value as { element?: string; condition?: string; method?: string; version?: string };
    if (value.method !== "canonical-weighted" || !value.version || !value.element || !Object.hasOwn(ELEMENT_LIFESTYLE, value.element) || !["missing", "excess"].includes(value.condition ?? "")) return [];
    const element = value.element as keyof typeof ELEMENT_LIFESTYLE, condition = value.condition as "missing" | "excess";
    return [{ evidenceRefs: [e.id], sourceRefs: [...e.sourceRefs, "GYEOL-V3-PHASE-0-1-COMMON-CORE-01:element-lifestyle"], element, condition,
      choices: ELEMENT_LIFESTYLE[element][condition], rationale: "확인된 오행 균형을 생활의 리듬으로 옮기는 선택지입니다.", caution: "활동과 환경 선택은 개인의 안전과 여건에 맞추세요." }];
  });
}
