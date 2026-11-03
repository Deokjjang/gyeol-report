/** 본문 용어 찾기(P6c-ui2 g): Book에 남길 용어 고르기(writer/book.ts)와 화면 첫 등장 표시(BookReader)가 같은 규칙을 쓴다.
 * 낱말로 나온 곳만: 앞은 한글이 아니고, 뒤는 한글이 아니거나 조사 뒤 한글이 아님("상관없이"·"관대한"·"장생하는"은 아님). */
const PARTICLE = "(?:은|는|이|가|을|를|의|와|과|에|에서|에게|으로|로|도|만|이라|이에요|이고|이며|처럼|까지|부터)";
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** names 중 하나. 긴 이름부터(“망신살”이 “망신”보다 먼저). g 플래그로 여러 곳을 찾는다. */
export const termPattern = (names: readonly string[]) =>
  new RegExp(`(?<![가-힣])(${[...names].sort((a, b) => b.length - a.length).map(escape).join("|")})(?=$|[^가-힣]|${PARTICLE}(?:$|[^가-힣]))`, "gu");
