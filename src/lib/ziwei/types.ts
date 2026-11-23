import type { ZIWEI_BASIS, ZIWEI_CALC_VERSION, BrightnessBasis } from "./basis";
import type { Branch, Brightness3, Brightness7, FiveClassId, MajorStarId, MutagenId, PalaceId, StarId, StarKind, Stem } from "./ids";

/** ZW-1 자미두수 명반(클라이언트에서도 읽을 수 있는 순수 데이터). 계산은 chart.ts(서버 전용). */
export type ZiweiGender = "MALE" | "FEMALE";
export type KoreanLunarDate = { readonly year: number; readonly month: number; readonly day: number; readonly leap: boolean };

export type ZiweiStarPlacement = {
  readonly id: StarId;
  readonly kind: StarKind;
  readonly palace: PalaceId;
  readonly branch: Branch;
  /** 밝기: 7단 원값과 3단. 표가 없는 별 · 칸은 null. */
  readonly brightness: { readonly raw: Brightness7; readonly level: Brightness3 } | null;
  /** 밝기 근거(통용만 본문 · 카드 근거로 쓴다 — 학파차이 · 추정이면 카드에 밝기 말을 붙이지 않는다). 밝기 없으면 null. */
  readonly brightnessBasis: BrightnessBasis | null;
  readonly mutagen?: MutagenId;
};

export type ZiweiDecadal = {
  readonly index: number;
  readonly palace: PalaceId;
  readonly branch: Branch;
  readonly stem: Stem;
  /** 세는 나이(내부 기록). 고객에게는 연도 범위만 보인다. */
  readonly startAge: number;
  readonly endAge: number;
  /** 실제 출생 음력 해 기준 연도 범위(운반 날짜와 무관). */
  readonly startYear: number;
  readonly endYear: number;
};

export type ZiweiPalace = {
  readonly id: PalaceId;
  readonly branch: Branch;
  readonly stem: Stem;
  readonly isBody: boolean;
  readonly majors: readonly MajorStarId[];
  readonly helpers: readonly StarId[];
  readonly malefics: readonly StarId[];
  readonly loves: readonly StarId[];
  /** 주성이 없는 칸(공궁). borrowFrom = 빌려 읽는 맞은편 칸. */
  readonly empty: boolean;
  readonly borrowFrom?: PalaceId;
  /** 쌍성 id(주성 둘이 같은 칸) — 없으면 없음. */
  readonly pair?: string;
  /** 삼방사정: [본궁, 맞은편, 삼합 둘]. */
  readonly sanbang: readonly [PalaceId, PalaceId, PalaceId, PalaceId];
  readonly decadal: ZiweiDecadal;
};

export type ZiweiChart = {
  readonly calcVersion: typeof ZIWEI_CALC_VERSION;
  readonly basis: typeof ZIWEI_BASIS;
  readonly birth: {
    readonly gender: ZiweiGender;
    readonly precision: "exact" | "approximate";
    /** 자미 날짜(사주 엔진의 태양시 · 통자시 날짜 = 사주 일주 날짜, 양력). */
    readonly date: string;
    readonly lunar: KoreanLunarDate;
    /** 윤달 규칙을 적용한 달(1~12)과, 윤12월 후반이라 다음 해 정월로 넘어갔는지. */
    readonly month: number;
    readonly monthRolledToNextYear: boolean;
    readonly day: number;
    readonly hourBranch: Branch;
    readonly hourIndex: number;
  };
  /** 음력 해(설 경계) 간지 · 음양. 사주(입춘 경계) 해 간지와 다를 수 있다. */
  readonly year: { readonly stem: Stem; readonly branch: Branch; readonly yang: boolean; readonly differsFromSaju: boolean };
  readonly lifePalace: { readonly branch: Branch };
  readonly bodyPalace: { readonly branch: Branch; readonly palace: PalaceId };
  readonly fiveClass: { readonly id: FiveClassId; readonly number: number };
  readonly direction: "forward" | "backward";
  readonly palaces: readonly ZiweiPalace[];
  readonly stars: readonly ZiweiStarPlacement[];
  readonly mutagens: readonly { readonly mutagen: MutagenId; readonly star: StarId; readonly palace: PalaceId; readonly schoolVariant: boolean }[];
  readonly pairs: readonly { readonly id: string; readonly palace: PalaceId }[];
  readonly decadals: readonly ZiweiDecadal[];
  /** 기준일(asOf)의 지금 · 다음 대한(기준일이 첫 대한 전이면 current 없음). */
  readonly now: { readonly asOf: string; readonly current?: number; readonly next?: number };
};
