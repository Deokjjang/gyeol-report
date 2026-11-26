/**
 * ZW-2 4부 — 명반 화면 뷰(순수 데이터, 클라이언트 · 서버 어디서나). 저장된 명반(ZiweiChart)만 읽는다 — 다시 계산하지 않는다.
 * 명반 부품(components/ziwei)은 이 값을 props로만 받는다(상품 책 밖 — 나중의 프로필 「타고난 결」 칸 — 에서도 쓸 수 있게).
 * - 12칸: 전통 배치(위 巳午未申 · 오른쪽 酉戌 · 아래 亥子丑寅 · 왼쪽 卯辰, 4×4 바깥 고리) + 가운데(이름 · 오행국 · 명궁 · 신궁).
 * - 밝기: 근거 「통용」인 칸의 주성에만 점(3단). 그 밖은 표시하지 않는다.
 * - 주석(해당하는 사람만, 화면에만): 경 · 무 · 임년 사화 · 설과 입춘 사이 출생.
 */
import { BODY_PALACE_NAME, BRANCH_KO, FIVE_CLASS_INFO, MUTAGEN_NAMES, PALACE_NAMES, STAR_NAMES, type Branch, type Brightness3, type MutagenId, type PalaceId, type StarId, type StarKind } from "./ids";
import type { ZiweiChart } from "./types";

export const ZIWEI_SCHOOL_NOTE = "이 해에 태어난 분은 유파에 따라 사화가 다르게 붙기도 해요. 결리포트는 가장 널리 쓰는 표를 따릅니다.";
export const ZIWEI_YEAR_NOTE = "자미두수는 음력 설을 해의 시작으로 봐서, 사주와 태어난 해의 간지가 다를 수 있어요.";
/** 전통 배치: 지지 → [행, 열](4×4, 0부터). */
export const CELL_POS: Readonly<Record<Branch, readonly [number, number]>> = {
  巳: [0, 0], 午: [0, 1], 未: [0, 2], 申: [0, 3], 酉: [1, 3], 戌: [2, 3], 亥: [3, 3], 子: [3, 2], 丑: [3, 1], 寅: [3, 0], 卯: [2, 0], 辰: [1, 0],
};
export type ZiweiStarView = { readonly id: StarId; readonly ko: string; readonly easy: string; readonly kind: StarKind; readonly mutagen?: { readonly id: MutagenId; readonly ko: string; readonly easy: string }; readonly bright?: Brightness3 };
export type ZiweiCellView = {
  readonly branch: Branch; readonly branchKo: string; readonly row: number; readonly col: number;
  readonly palace: PalaceId; readonly easy: string; readonly ko: string; readonly life: boolean; readonly body: boolean;
  readonly majors: readonly ZiweiStarView[]; readonly minors: readonly ZiweiStarView[];
  readonly empty: boolean; readonly borrow?: { readonly from: PalaceId; readonly fromEasy: string; readonly majors: readonly string[] };
  readonly decade: { readonly start: number; readonly end: number; readonly current: boolean; readonly next: boolean };
};
export type ZiweiBoardView = {
  readonly calcVersion: string;
  readonly cells: readonly ZiweiCellView[];
  readonly center: { readonly fiveClass: string; readonly life: string; readonly body: string; readonly yearGanji: string };
  readonly mutagens: readonly { readonly id: MutagenId; readonly ko: string; readonly easy: string; readonly star: string; readonly starEasy: string; readonly palaceEasy: string }[];
  readonly decades: readonly { readonly palaceEasy: string; readonly start: number; readonly end: number; readonly current: boolean; readonly next: boolean }[];
  readonly notes: { readonly school?: string; readonly year?: string };
};
const starView = (id: StarId, mut?: MutagenId, bright?: Brightness3): ZiweiStarView => ({ id, ko: STAR_NAMES[id].ko, easy: STAR_NAMES[id].easy, kind: STAR_NAMES[id].kind,
  ...(mut ? { mutagen: { id: mut, ko: MUTAGEN_NAMES[mut].ko, easy: MUTAGEN_NAMES[mut].easy } } : {}), ...(bright ? { bright } : {}) });

export function ziweiBoardView(chart: ZiweiChart): ZiweiBoardView {
  const placed = new Map(chart.stars.map(s => [s.id, s] as const)), mutOf = new Map(chart.mutagens.map(m => [m.star, m.mutagen] as const));
  const cur = chart.now.current !== undefined ? chart.decadals[chart.now.current] : undefined, next = chart.now.next !== undefined ? chart.decadals[chart.now.next] : undefined;
  const cells: ZiweiCellView[] = chart.palaces.map(p => {
    const [row, col] = CELL_POS[p.branch];
    const bright = (s: StarId) => { const x = placed.get(s); return x?.brightnessBasis === "통용" && x.brightness ? x.brightness.level : undefined; };
    const from = p.empty && p.borrowFrom ? chart.palaces.find(x => x.id === p.borrowFrom) : undefined;
    return { branch: p.branch, branchKo: BRANCH_KO[p.branch], row, col, palace: p.id, easy: PALACE_NAMES[p.id].easy, ko: PALACE_NAMES[p.id].ko, life: p.id === "myeong", body: p.isBody,
      majors: p.majors.map(s => starView(s, mutOf.get(s), bright(s))), minors: [...p.helpers, ...p.malefics, ...p.loves].map(s => starView(s, mutOf.get(s))),
      empty: p.empty, ...(from ? { borrow: { from: from.id, fromEasy: PALACE_NAMES[from.id].easy, majors: from.majors.map(s => STAR_NAMES[s].ko) } } : {}),
      decade: { start: p.decadal.startYear, end: p.decadal.endYear, current: cur?.palace === p.id, next: next?.palace === p.id } };
  });
  return {
    calcVersion: chart.calcVersion, cells,
    center: { fiveClass: FIVE_CLASS_INFO[chart.fiveClass.id].ko, life: `${BRANCH_KO[chart.lifePalace.branch]}(${chart.lifePalace.branch}) 칸`, body: `${BODY_PALACE_NAME.easy} · ${PALACE_NAMES[chart.bodyPalace.palace].easy} 칸`, yearGanji: `${chart.year.stem}${chart.year.branch}` },
    mutagens: (["rok", "gwon", "gwa", "gi"] as const).map(m => { const x = chart.mutagens.find(y => y.mutagen === m)!; return { id: m, ko: MUTAGEN_NAMES[m].ko, easy: MUTAGEN_NAMES[m].easy, star: STAR_NAMES[x.star].ko, starEasy: STAR_NAMES[x.star].easy, palaceEasy: PALACE_NAMES[x.palace].easy }; }),
    decades: chart.decadals.map(d => ({ palaceEasy: PALACE_NAMES[d.palace].easy, start: d.startYear, end: d.endYear, current: cur?.index === d.index, next: next?.index === d.index })),
    notes: { ...(chart.mutagens.some(m => m.schoolVariant) ? { school: ZIWEI_SCHOOL_NOTE } : {}), ...(chart.year.differsFromSaju ? { year: ZIWEI_YEAR_NOTE } : {}) },
  };
}
