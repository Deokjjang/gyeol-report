/**
 * 브리프 토큰 추정(실측은 P6 작가 호출에서). 한글 음절 1.5자 ≈ 1토큰, 한자 1자 ≈ 1토큰, 그 밖(영문·숫자·JSON 기호) 3.5자 ≈ 1토큰.
 * 종합 기준 10k 토큰 이내 목표.
 */
export const TOKEN_METHOD = "추정: 한글 1.5자/토큰, 한자 1자/토큰, 기타 3.5자/토큰 (JSON 직렬화 기준)";
export const BRIEF_TOKEN_BUDGET = 10_000;

export function estimateTokens(text: string): number {
  let hangul = 0, han = 0, other = 0;
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    if (c >= 0xac00 && c <= 0xd7a3) hangul++;
    else if (c >= 0x4e00 && c <= 0x9fff) han++;
    else other++;
  }
  return Math.ceil(hangul / 1.5 + han + other / 3.5);
}

export function sectionBudget(brief: Record<string, unknown>): { estimatedTokens: number; bySection: Record<string, number> } {
  const bySection: Record<string, number> = {};
  for (const [k, v] of Object.entries(brief)) if (k !== "budget" && v !== undefined) bySection[k] = estimateTokens(JSON.stringify(v));
  return { estimatedTokens: Object.values(bySection).reduce((a, b) => a + b, 0), bySection };
}
