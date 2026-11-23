/**
 * ZW-1 소형 검증기(시험 전용 — 계산 라이브러리를 쓰지 않고 따로 짠 삼합파 핵심 경로).
 * 입력: 음력 해 간지 · 윤달 규칙을 적용한 달 · 날 · 시진 번호(子=0) · 성별. 지지 번호는 子=0 … 亥=11.
 * 출력: 명궁 · 신궁 지지, 12궁 천간(오호둔), 오행국(명궁 납음), 자미 위치, 14주성 위치, 생년 사화, 대한 12구간.
 */
const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
const STEMS = "甲乙丙丁戊己庚辛壬癸";
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** 60갑자 납음 오행(두 간지씩 한 묶음, 갑자·을축 = 금 …). */
const NAYIN = "金火木土金火水土金木水土火木水金火木土金火水土金木水土火木水";
const CLASS_NUMBER: Record<string, number> = { 水: 2, 木: 3, 金: 4, 土: 5, 火: 6 };
const sexagenary = (stem: number, branch: number) => {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return i;
  throw new Error("간지 짝이 아님");
};

export type VerifierInput = { yearStem: string; yearBranch: string; month: number; day: number; hour: number; male: boolean };
export type VerifierOutput = {
  life: string; body: string;
  palaceStems: Record<string, string>; // 지지 → 천간
  classNumber: number;
  majors: Record<string, string>; // 별 id → 지지
  mutagens: [string, string, string, string]; // 록권과기 별 id
  decadals: { branch: string; start: number; end: number }[];
};

const MUTAGENS: Record<string, [string, string, string, string]> = {
  甲: ["yeomjeong", "pagun", "mugok", "taeyang"], 乙: ["cheongi", "cheonryang", "jami", "taeeum"], 丙: ["cheondong", "cheongi", "munchang", "yeomjeong"],
  丁: ["taeeum", "cheondong", "cheongi", "geomun"], 戊: ["tamrang", "taeeum", "ubil", "cheongi"], 己: ["mugok", "tamrang", "cheonryang", "mungok"],
  庚: ["taeyang", "mugok", "taeeum", "cheondong"], 辛: ["geomun", "taeyang", "mungok", "munchang"], 壬: ["cheonryang", "jami", "jwabo", "mugok"],
  癸: ["pagun", "geomun", "taeeum", "tamrang"],
};

export function verifyChart(x: VerifierInput): VerifierOutput {
  const ys = STEMS.indexOf(x.yearStem), yb = BRANCHES.indexOf(x.yearBranch);
  if (ys < 0 || yb < 0 || x.month < 1 || x.month > 12 || x.day < 1 || x.day > 30 || x.hour < 0 || x.hour > 11) throw new Error("검증기 입력 오류");
  // 명궁: 寅에서 달만큼 순행(정월 = 寅) 뒤 시진만큼 역행. 신궁: 달만큼 순행 뒤 시진만큼 순행.
  const life = mod(2 + (x.month - 1) - x.hour, 12);
  const body = mod(2 + (x.month - 1) + x.hour, 12);
  // 오호둔: 갑기 → 寅궁 병, 을경 → 무, 병신 → 경, 정임 → 임, 무계 → 갑.
  const yinStem = mod((ys % 5) * 2 + 2, 10);
  const stemAt = (b: number) => mod(yinStem + mod(b - 2, 12), 10);
  const palaceStems: Record<string, string> = {};
  for (let b = 0; b < 12; b++) palaceStems[BRANCHES[b]] = STEMS[stemAt(b)];
  // 오행국 = 명궁 간지의 납음 오행.
  const classNumber = CLASS_NUMBER[NAYIN[Math.floor(sexagenary(stemAt(life), life) / 2)]];
  // 자미: 날 + k가 국수로 나눠떨어지는 가장 작은 k, 몫 q. 寅에서 q−1칸 순행 뒤 k가 짝수면 k칸 순행, 홀수면 k칸 역행.
  let k = 0;
  while ((x.day + k) % classNumber !== 0) k++;
  const q = (x.day + k) / classNumber;
  const ziwei = mod(2 + (q - 1) + (k % 2 === 0 ? k : -k), 12);
  // 천부는 寅申 축 대칭.
  const tianfu = mod(4 - ziwei, 12);
  const majors: Record<string, string> = {};
  const put = (id: string, b: number) => { majors[id] = BRANCHES[mod(b, 12)]; };
  // 자미 계열(역행): 자미 0, 천기 −1, 태양 −3, 무곡 −4, 천동 −5, 염정 −8.
  put("jami", ziwei); put("cheongi", ziwei - 1); put("taeyang", ziwei - 3); put("mugok", ziwei - 4); put("cheondong", ziwei - 5); put("yeomjeong", ziwei - 8);
  // 천부 계열(순행): 천부 0, 태음 1, 탐랑 2, 거문 3, 천상 4, 천량 5, 칠살 6, 파군 10.
  put("cheonbu", tianfu); put("taeeum", tianfu + 1); put("tamrang", tianfu + 2); put("geomun", tianfu + 3);
  put("cheonsang", tianfu + 4); put("cheonryang", tianfu + 5); put("chilsal", tianfu + 6); put("pagun", tianfu + 10);
  // 대한: 명궁부터 국수 세, 양남음녀 순행 · 음남양녀 역행.
  const forward = (ys % 2 === 0) === x.male;
  const decadals = Array.from({ length: 12 }, (_, i) => ({ branch: BRANCHES[mod(life + (forward ? i : -i), 12)], start: classNumber + 10 * i, end: classNumber + 10 * i + 9 }));
  return { life: BRANCHES[life], body: BRANCHES[body], palaceStems, classNumber, majors, mutagens: MUTAGENS[x.yearStem], decadals };
}
