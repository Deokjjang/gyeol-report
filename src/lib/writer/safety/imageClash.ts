/**
 * 그림 한 줄 안의 시간·계절 모순(AM 1-1 ③, 결정론). 표지·핵심 이미지·카드 그림 줄에 쓴다.
 * 예: 「겨울 밤 물 위에 오래 떠 있는 따뜻한 해」(밤인데 해), 「한겨울 땡볕」, 「봄 단풍」.
 * 「해 짧은 한겨울」처럼 해가 낮의 길이를 말하는 꼴은 모순이 아니다(밤 낱말이 없으면 보지 않는다).
 */
const NIGHT = /(?<![가-힣])밤|봄밤|여름밤|가을밤|겨울밤|자정|한밤|깊은 밤|어둠 속|달빛|별빛|야경/;
/** 하늘의 해·햇빛(연도의 「해」가 아닌 꼴): 끝·조사·빛·살·볕이 붙은 해, 또는 햇살·태양·한낮. */
const SUN = /(?<![가-힣])해(?=$|[가-힣]?$|(가|를|는|처럼|와|과|빛|살|볕)(?![가-힣])|\s(가|를|는|처럼|와|과))|햇살|햇빛|햇볕|태양|한낮|정오|대낮|땡볕|뙤약볕/;
const WINTER = /한겨울|겨울|눈 덮인|눈 쌓인|눈보라|꽁꽁|얼음|성에/;
const SUMMER = /한여름|여름|무더위|열대야|폭염|땡볕|뙤약볕/;
const SPRING = /(?<![가-힣])봄|봄볕|봄비|꽃샘/;
const AUTUMN = /가을|단풍|낙엽/;

export function imageClash(line: string): string | null {
  const v = line.replace(/\s+/g, " ").trim();
  if (NIGHT.test(v) && SUN.test(v)) return `밤(${v.match(NIGHT)![0]})과 해(${v.match(SUN)![0]})`;
  if (WINTER.test(v) && SUMMER.test(v) && v.match(WINTER)![0] !== v.match(SUMMER)![0]) return `겨울(${v.match(WINTER)![0]})과 여름(${v.match(SUMMER)![0]})`;
  if (SPRING.test(v) && AUTUMN.test(v)) return `봄(${v.match(SPRING)![0]})과 가을(${v.match(AUTUMN)![0]})`;
  return null;
}
