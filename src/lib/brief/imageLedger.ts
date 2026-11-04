/**
 * 이미지 대장(최종판 1-7 ②): 지금까지 만든 책(P6c·P6d·P6e 시험본·로컬 DB Book)의 핵심 이미지 한 줄을 일주별로 모은 표.
 * 같은 일주의 기존 이미지 핵심 명사를 브리프 chart.avoidImages("피할 이미지")로 넘긴다. 대장은 tools/final/image-ledger.ts가 만든다(호출 0).
 * 운영에서 새로 나온 책은 대장에 자동으로 더해지지 않는다(DB 조회·새 표가 필요해 이번 범위 밖, 보고서에 적음).
 */
import ledger from "./data/image-ledger.json";

export type ImageLedger = { readonly version: string; readonly built: string; readonly byDayPillar: Readonly<Record<string, readonly { readonly line: string; readonly noun: string; readonly source: string }[]>> };
export const IMAGE_LEDGER = ledger as ImageLedger;

/** 핵심 명사: 줄 끝 낱말(문장부호·조사 없이). "빗속에서도 꺼지지 않는 캠핑 랜턴" → "랜턴", "카페 불빛" → "불빛". 한 글자면 앞 낱말까지. */
export function imageNoun(line: string): string {
  const words = line.replace(/[.,!?·"“”'‘’⟪⟫]/g, " ").trim().split(/\s+/).filter(Boolean);
  const raw = words.at(-1) ?? "", stripped = raw.replace(/(을|를|은|는|의|에|와|과|도)$/, "");
  // 한 글자 낱말(강·흙·불·손)은 혼자서는 너무 흔하다 → 앞 낱말과 함께("큰 강", "화단 흙"): 그 두 낱말이 이어 나올 때만 피한다.
  const last = stripped.length >= 2 ? stripped : raw;
  return last.length >= 2 ? last : words.slice(-2).join(" ");
}
/** 그림이 아닌 흔한 말(관계·추상 낱말): 피할 이미지로 쓰지 않는다(궁합 표지 "…돕는 사이" 등). */
const NOT_IMAGE = new Set(["사이", "사람", "사업", "길", "이야기", "온도", "마음", "힘", "책", "관계", "두 사람", "하루", "시간", "순간", "방식", "자리", "일"]);

/** 이 일주들(한자 간지)의 피할 명사(중복 없이). */
export function avoidImagesFor(dayPillars: readonly string[], l: ImageLedger = IMAGE_LEDGER): string[] {
  return [...new Set(dayPillars.flatMap(d => (l.byDayPillar[d] ?? []).map(x => x.noun)).filter(n => n.length >= 2 && /^[가-힣 ]+$/.test(n) && !/(다|요|죠)$/.test(n) && !NOT_IMAGE.has(n)))];
}

/** 줄 안에 든 피할 명사. */
export const avoidNounsIn = (line: string, avoid: readonly string[]) => avoid.filter(n => n && line.includes(n));
