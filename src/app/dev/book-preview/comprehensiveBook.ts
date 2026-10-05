import type { BookPage } from "./bookTypes";

/** Presentation definitions only; stage calculation/placement stays canonical.
 * Names describe symbolic stages, not health, death or actual life events. */
export const COMPREHENSIVE_STAGE_MEANINGS: Readonly<Record<string, string>> = {
  장생: "새로 자라나는 단계. 배우고 시작하며 힘을 익히는 모습에 빗댑니다.",
  목욕: "새 모습에 적응하는 단계. 감각과 표현이 살아나고 주변 반응을 의식하는 모습에 빗댑니다.",
  관대: "갖춘 모습을 밖에 보이는 단계. 자신 있게 나서고 역할을 맡으려는 모습에 빗댑니다.",
  건록: "제 몫을 해낼 기반을 갖춘 단계. 스스로 생활을 꾸리고 책임지는 모습에 빗댑니다.",
  제왕: "힘이 가장 왕성한 단계. 주도권과 자신감이 크고 자기 뜻도 강해지는 모습에 빗댑니다.",
  쇠: "왕성한 힘을 거두는 단계. 경험을 바탕으로 무리하지 않고 고르는 모습에 빗댑니다.",
  병: "바깥 활동보다 안을 살피는 단계. 변화에 민감하고 상태를 돌아보는 모습이지, 질병을 뜻하지 않습니다.",
  사: "움직임을 멈추고 깊이 생각하는 단계. 집중과 숙고의 상징이지, 죽음을 뜻하지 않습니다.",
  묘: "기운을 안에 저장하는 단계. 경험과 생각을 모아두고 쉽게 꺼내지 않는 모습에 빗댑니다.",
  절: "이전 흐름이 끊기고 새 출발을 기다리는 단계. 익숙한 방식과 거리를 두는 모습에 빗댑니다.",
  태: "새 기운이 막 생기는 단계. 아직 드러나지 않은 가능성과 준비의 모습에 빗댑니다.",
  양: "기운을 보살피며 키우는 단계. 안정된 바탕에서 배우고 힘을 기르는 모습에 빗댑니다.",
};
export const COMPREHENSIVE_PLAIN_MEANINGS: Readonly<Record<string, string>> = {
  sinsal_gongmang: "기대한 만큼 채워지지 않는 느낌을 돌아보는 표식. 손실이나 실패를 확정하는 뜻은 아닙니다.",
  twelve_sinsal_yukhae: "가까운 사이에서 기대나 말이 어긋나 마음에 남기 쉬운 모습을 살피는 표식.",
  twelve_sinsal_jaesal: "제약이나 압박 속에서 대응할 방법을 찾는 모습을 살피는 표식. 재난을 예고하는 뜻은 아닙니다.",
};

/** Comprehensive's front is a reading invitation; the existing detailed end
 * index and every stable anchor/page number are left exactly where they are. */
export function comprehensiveBookContents(pages: BookPage[]): BookPage[] {
  return pages.map(p => {
    if (p.kind !== "contents" || p.id !== "contents") return p;
    const groups = [
      ["나를 읽는 두 가지 결", ["core"]],
      ["내가 가진 힘과 좋은 패", ["chapter-strengths", "chapter-fortune"]],
      ["사람 사이에서, 사랑 안에서", ["chapter-relationships", "chapter-love"]],
      ["일과 돈에 드러나는 나", ["chapter-work", "chapter-money"]],
      ["나를 지치게 하는 습관", ["chapter-shadow"]],
      ["이런 나를 오래 잘 쓰는 법", ["chapter-environment", "chapter-direction"]],
    ] as const;
    return { ...p, entries: groups.flatMap(([title, ids]) => {
      const entry = ids.flatMap(id => p.entries.find(e => e.targetId === id) ?? [])[0];
      return entry ? [{ ...entry, title }] : [];
    }) };
  });
}
