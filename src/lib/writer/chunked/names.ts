/**
 * AM2-11 1부 3 — 재료 지시어를 이름으로(세운·대운 작가 카드 경로만, 결정론 · 호출 0).
 * P10 annual-1 7월 「그 해에도 같은 자리에」(재료 줄 「그 해에도 같은 자리에 걸림」을 옮김) · p6a 2028년 1월 「…같은 자리에 있었지만」 — 카드 · 설계 · key 재료의
 * 지시어(그 해 · 이 해 · 그 달 · 이 달 · 이 대운 · 그 대운 · 그때 · 같은 자리 · 그 자리 · 이 자리)는 작가가 앞 문장을 받는 말로 옮긴다. 이름(「2027년」 「9월 · 기유월」
 * 「계축 대운」 「태어난 날 자리」)으로 바꾼다. 머리 문장(시스템이 책에 넣는 글)과 작가 규칙은 바꾸지 않는다.
 */
/** 남은 지시어(검사 · 시험). 「그때마다」 「습관이 자리 잡기」 「마음이 달아오르기」처럼 낱말 안 · 다른 뜻은 뺀다. */
/** 지시어 뒤에 올 수 있는 조사(「이 대운은」 「그 해가」 「그 자리의」). 그 밖 글자가 이어지면 다른 낱말(「이 달라」 「이 해석」)이다. */
const PJ = "(?:은|는|이|가|을|를|의|에서|에게|에는|에도|에|도|와|과|으로|로|부터|까지|처럼|만|엔|보다)?(?![가-힣])";
// 우리말 관용(「그 자리에서」 = 곧바로 · 「그때그때」 · 「그때부터」 · 「같은 자리에서 같은 일」 · 「이번 주」)은 key · 원국 자리를 가리키지 않아 뺀다.
export const DEICTIC = new RegExp(`(?<![가-힣])(?:그 ?해|이 해|그 달|이 달|이 대운|그 대운|그때(?!그때|부터|마다)|같은 자리(?!에서 같은)|그 자리(?!에서)|이 자리|이번(?=:))${PJ}`);
const DEICTIC_G = new RegExp(DEICTIC.source, "g");
const LABEL = /^(20\d\d년 [가-힣]{2}년|(?:20\d\d년 )?(?:1[0-2]|[1-9])월 · [가-힣]{2}월)/;
const SEAT = /태어난 (?:해|달|날|시각)(?:·(?:해|달|날|시각))*/;

export type NameCtx = {
  /** 책의 해(세운 「2027년」, 대운 「2026년」). */ readonly year: string;
  /** 대운 이름(「계축 대운」). 없으면 대운 지시어는 그대로(검사가 남김을 센다). */ readonly dayun?: string;
};
/** 한 줄 · 한 글의 지시어를 이름으로. own = 그 글이 속한 key 이름(「5월 · 을사월」 · 「2030년 경술년」)이 있으면 그 이름이 「그 달 · 이 해」를 받는다. */
export function nameDeictics(t: string, c: NameCtx, own?: string, o: { readonly seat?: string; readonly mbti?: boolean; /** 자리 값이 없는 원국 줄: 「이 자리」를 받는 그 줄 이름(「쇠(衰)」). */ readonly name?: string } = {}): string {
  if (!t || !DEICTIC.test(t)) return t;
  const label = own ?? LABEL.exec(t)?.[1];
  const isMonth = Boolean(label && /월$/.test(label));
  const yearOf = label && !isMonth ? label.replace(/ [가-힣]{2}년$/, "") : c.year;
  const seat = SEAT.exec(t)?.[0] ?? o.seat;
  // 우리말 장소 관용(원국 자리가 아님): 「그 자리에 머무는」 → 「제자리에 머무는」 · 「같은 자리를 지키」 → 「한자리를 지키」 · 「같은 자리에서」 → 「한자리에서」 · 「같은 자리만 맴」 → 「제자리만 맴」.
  let s = t.replace(/(?<![가-힣])그 자리에 머무/g, "제자리에 머무").replace(/(?<![가-힣])같은 자리를 지키/g, "한자리를 지키").replace(/(?<![가-힣])같은 자리에서(?! 같은)/g, "한자리에서").replace(/(?<![가-힣])같은 자리만 맴/g, "제자리만 맴");
  s = s
    .replace(/(?<![가-힣])그 ?해가 속한 대운/g, `${c.year}이 속한 대운`)
    .replace(/세운은 그해 날씨/g, "세운은 해마다의 날씨");
  // 바꾼 이름 뒤 조사는 이름의 받침에 맞춘다(「이 해를」 → 「2027년을」).
  const R = (w: string, to: string) => { s = s.replace(new RegExp(`(?<![가-힣])(?:${w})(${PJ.replace(/\(\?!\[가-힣\]\)$/, "")})(?![가-힣])`, "g"), (_m, j: string) => `${to}${rejosa(to, j ?? "")}`); };
  if (c.dayun) R("이 대운|그 대운", c.dayun);
  R("그 ?해|이 해", yearOf);
  if (isMonth) R("그 달|이 달", label!);
  // 자리: 같은 줄(원국 줄은 값)의 「태어난 X」 자리, 없으면 대운 관계 줄의 「대운 10년의 흐름 자리」. MBTI 줄의 「이 자리」는 지금 눈앞(Se)이라 「눈앞」.
  const seatName = o.mbti ? "눈앞" : seat ? `${seat} 자리` : /대운 10년의 흐름 자리/.test(s) ? "대운 10년의 흐름 자리" : o.name;
  if (seatName) R("그 자리(?!에서)|이 자리|같은 자리(?!에서 같은)", seatName);
  // 그때(시점을 받는 말): 이름을 알 수 없는 글 안의 「그때」는 「그럴 때」로.
  s = s.replace(new RegExp(`(?<![가-힣])그때(?!그때|부터|마다)(${PJ.replace(/\(\?!\[가-힣\]\)$/, "")})(?![가-힣])`, "g"), (_m, j: string) => `그럴 때${j ?? ""}`);
  return s;
}
const batchim = (w: string) => { const ch = w.trim().slice(-1), code = ch.charCodeAt(0) - 0xac00; if (code < 0 || code > 11171) return /[0-9]$/.test(ch) ? !/[2459]$/.test(ch) : false; return code % 28; };
/** 조사를 앞말 받침에 맞춘다(은/는 · 이/가 · 을/를 · 와/과 · 으로/로 — ㄹ 받침은 「로」). */
function rejosa(word: string, j: string): string {
  const b = batchim(word), has = Boolean(b), rieul = b === 8;
  switch (j) {
    case "은": case "는": return has ? "은" : "는";
    case "이": case "가": return has ? "이" : "가";
    case "을": case "를": return has ? "을" : "를";
    case "와": case "과": return has ? "과" : "와";
    case "으로": case "로": return has && !rieul ? "으로" : "로";
    default: return j;
  }
}
/** 남은 지시어 목록(검사): 머리 문장 · 규칙 글은 넣지 않는다. */
export const deicticsIn = (t: string) => [...(t ?? "").matchAll(DEICTIC_G)].map(m => m[0]);
