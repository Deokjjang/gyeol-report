/**
 * 공유 카드 · 링크 미리보기에 들어가는 글자(SPEC 「공유 카드(9:16)」). 브라우저 카드(2D 캔버스)와 서버 미리보기(next/og)가 같은 값을 쓴다.
 * 빼는 것: "남이 본 나 × 내가 아는 나", 단계 이름, "별을 달아 줘".
 */
export const DEFAULT_LINE = "나는 어떤 사람이야?";
export const LINE_MAX = 20;
export type CardText = { handle: string; sync: string; syncLabel: string; count: string | null; line: string; link: string };

export function cardText(o: { handle: string; sync: number | null; friends: number; showCount: boolean; line: string | null }): CardText {
  return {
    handle: `@${o.handle}`,
    sync: o.sync === null ? "?%" : `${o.sync}%`,
    syncLabel: "싱크로율",
    count: o.showCount && o.friends > 0 ? `친구 ${o.friends}명이 답해 줬어요` : null,
    line: o.line?.trim() || DEFAULT_LINE,
    link: `gyeolreport.com/@${o.handle}`,
  };
}
