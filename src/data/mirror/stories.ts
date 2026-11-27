/**
 * 「남이 본 나」 이야기 종류(SPEC 「이야기 — 받은 이야기 · 모두의 이야기」). id는 DB(mirror_stories.kind) 값과 같다.
 * 쓰는 순간 방향을 잡아 주는 다섯 가지 — 웃기고 따뜻한 이야기가 쌓이게.
 */
export const STORY_KINDS = [
  { id: "funny", label: "웃겼던 일" },
  { id: "thanks", label: "고마웠던 일" },
  { id: "cool", label: "멋있었던 순간" },
  { id: "better", label: "덕분에 좋아진 일" },
  { id: "surprise", label: "의외였던 모습" },
] as const;
export type StoryKind = typeof STORY_KINDS[number]["id"];
export const STORY_KIND_LABEL: Readonly<Record<StoryKind, string>> = Object.fromEntries(STORY_KINDS.map(k => [k.id, k.label])) as Record<StoryKind, string>;
export const isStoryKind = (v: unknown): v is StoryKind => typeof v === "string" && STORY_KINDS.some(k => k.id === v);
/** 본문 최대 글자 수 · 글자 수를 보여 주기 시작하는 지점. */
export const STORY_MAX = 500;
export const STORY_COUNT_FROM = 400;
/** 신고가 이 수에 닿으면 자동으로 숨긴다. */
export const STORY_HIDE_REPORTS = 3;
