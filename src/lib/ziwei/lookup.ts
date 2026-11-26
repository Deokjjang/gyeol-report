/**
 * ZW-1 4부 · 명반 × 지식 DB 조회(순수 함수, 호출 0). 명반(chart.ts computeZiweiChart)과 DB(knowledge.ts loadZiweiKnowledge)를 받아
 * 이 고객에게 나갈 수 있는 항목 · 줄만 고른다. 고객 문구를 새로 만들지 않는다(데이터 선택만).
 * - 12궁 + 신궁: 궁 항목 · 렌즈 한 줄(입력 상태 줄이 있으면 그 줄, 없으면 default) · 주성(그 칸 palaceNuance, 밝기 근거 「통용」일 때만 밝기 글) · 보좌 · 살성 · 연애 별 · 쌍성
 * - 공궁: 빌려 읽기 규칙 + 맞은편 칸 주성(쌍성 항목 포함)과 그 별들의 palaceNuance[빈 칸](DB 줄은 빌려 읽어도 맞게 썼다 — dbCheck BORROW_UNSAFE)
 * - 사화 4(앉은 별 · 칸) + 생년 사화 연간 표 한 줄 · 오행국
 * - 심화 4궁(명궁 · 부처궁 · 재백궁 · 관록궁): 단독 주성 → 별 id, 쌍성 → 쌍성 id, 공궁 → "empty"(+ 빌린 쌍성)
 * - MBTI(유형이 있을 때만): 명궁 주성(비면 빌린 주성)의 짝
 * 장면은 모두 brief/facts.ts sceneFits(requires, 프로필, 글)로 거른다. 항목의 원래 장면 칸(scenes · scene)은 빼고 거른 장면만 돌려준다.
 * 필요한데 DB에 없는 것은 missing에 DB id로 모은다(항목은 있는데 칸이 빠졌으면 "<id>#<칸>").
 * 「같은 무대」 대응표(stageMap)는 데이터만이라 여기서 쓰지 않는다.
 */
import type { Domain, MbtiType, ZIWEI_JOB_STATES, ZIWEI_RELATIONSHIP_STATES } from "@/data/knowledge-v5/schema";
import { sceneFits, toFactProfile, type CustomerFacts, type FactProfile } from "@/lib/brief/facts";
import { pairIdOf, type Branch, type Brightness3, type Brightness7, type FiveClassId, type MajorStarId, type MutagenId, type PalaceId, type StarId } from "./ids";
import type {
  ZiweiDeep, ZiweiEmptyEntry, ZiweiFiveClassEntry, ZiweiKnowledge, ZiweiMbtiRule, ZiweiMutagenEntry, ZiweiMutagenYear, ZiweiPairEntry, ZiweiPalaceEntry, ZiweiScene, ZiweiStar,
} from "./knowledge";
import type { ZiweiChart, ZiweiPalace } from "./types";

/** 조회에 쓰는 고객 입력. CustomerFacts(brief/facts.ts)를 그대로 넘겨도 된다. */
export type ZiweiFacts = Pick<CustomerFacts, "relationshipStatus" | "jobStatus" | "children"> & { readonly mbti?: MbtiType | null };

/** 궁 렌즈 상태(스키마 ZIWEI_*_STATES). 장면 거름(FactProfile)과 다르다: 썸은 렌즈에서 「some」, 장면에서는 「dating」. */
export type ZiweiLensState = {
  readonly relationship: (typeof ZIWEI_RELATIONSHIP_STATES)[number] | "unknown";
  readonly children: "has" | "none" | "unknown";
  readonly job: (typeof ZIWEI_JOB_STATES)[number];
};
/** 입력 원문(reportInputTypes) → 렌즈 상태. 결혼 준비 = 연애 중, 직장인 = employed, 자영업 · 사업 = business, 학생 = student, 나머지 · 미입력 = other. 연애 미입력 · 자녀 미입력은 unknown(default 줄). */
export function ziweiLensState(f: ZiweiFacts): ZiweiLensState {
  const r = f.relationshipStatus;
  const relationship = r === "single" || r === "some" || r === "dating" || r === "married" ? r : r === "marriage_preparing" ? "dating" : "unknown";
  const j = f.jobStatus;
  const job = j === "employee" ? "employed" : j === "self_employed" || j === "business_owner" ? "business" : j === "student" ? "student" : "other";
  return { relationship, children: f.children ?? "unknown", job };
}

export type ZiweiLensRead = { readonly key: "default" | `${"relationship" | "children" | "job"}.${string}`; readonly line: string };
/** 렌즈 한 줄: 연애 → 자녀 → 일 순서로 그 상태 줄이 있으면 그 줄, 없으면 default. 자녀 미입력은 「자녀 미입력 렌즈」(children.none: 아랫사람 · 내가 길러 내는 것 — dbCheck 규칙)를 읽는다. */
export function ziweiLensLine(entry: Pick<ZiweiPalaceEntry, "lens">, s: ZiweiLensState): ZiweiLensRead {
  const l = entry.lens;
  const rel = s.relationship === "unknown" ? undefined : l.relationship?.[s.relationship];
  if (rel) return { key: `relationship.${s.relationship}`, line: rel };
  const childKey = s.children === "unknown" ? "none" : s.children;
  const child = l.children?.[childKey];
  if (child) return { key: `children.${childKey}`, line: child };
  const job = l.job?.[s.job];
  if (job) return { key: `job.${s.job}`, line: job };
  return { key: "default", line: l.default };
}

/** 거른 장면 하나(어느 영역 장면인지 — 심화 · 짝의 장면 하나는 영역 없음). */
export type ZiweiPickedScene = ZiweiScene & { readonly domain: Domain | null };
/** DB 항목 + 거른 장면. 항목의 원래 장면 칸은 뺐다(거르지 않은 장면이 새어 나가지 않게). 그 밖의 칸은 DB 그대로 — 칸 · 밝기로 고른 줄은 따로 준다. */
export type ZiweiPicked<T> = { readonly id: string; readonly entry: Omit<T, "scenes" | "scene">; readonly scenes: readonly ZiweiPickedScene[] };

export type ZiweiMajorRead = {
  readonly star: MajorStarId;
  readonly entry: ZiweiPicked<ZiweiStar> | null;
  /** 그 별의 palaceNuance[이 칸]. */
  readonly nuance: string | null;
  /** 이 칸 밝기 근거가 「통용」일 때만: 3단 · 그 단의 별 모습(brightness[단]) · forYou.bright/dark(보통이면 없음). 그 밖은 null(밝기 말을 쓰지 않는다). */
  readonly brightness: { readonly raw: Brightness7; readonly level: Brightness3; readonly text: string | null; readonly forYou: string | null } | null;
};
export type ZiweiMinorRead = { readonly star: StarId; readonly entry: ZiweiPicked<ZiweiStar> | null };
export type ZiweiPairRead = { readonly id: string; readonly entry: ZiweiPicked<ZiweiPairEntry> | null };
/** 공궁 빌려 읽기: 맞은편 칸 주성 · 쌍성, 별마다 palaceNuance[빈 칸]. */
export type ZiweiBorrowRead = {
  readonly from: PalaceId;
  readonly rule: ZiweiPicked<ZiweiEmptyEntry> | null;
  readonly majors: readonly { readonly star: MajorStarId; readonly entry: ZiweiPicked<ZiweiStar> | null; readonly nuance: string | null }[];
  readonly pair: ZiweiPairRead | null;
};
export type ZiweiPalaceRead = {
  readonly palace: PalaceId;
  readonly branch: Branch;
  readonly isBody: boolean;
  readonly entry: ZiweiPicked<ZiweiPalaceEntry> | null;
  readonly lens: ZiweiLensRead | null;
  readonly majors: readonly ZiweiMajorRead[];
  readonly helpers: readonly ZiweiMinorRead[];
  readonly malefics: readonly ZiweiMinorRead[];
  readonly loves: readonly ZiweiMinorRead[];
  readonly pair: ZiweiPairRead | null;
  /** 공궁일 때만. */
  readonly borrow: ZiweiBorrowRead | null;
};
export const ZIWEI_DEEP_PALACES = ["myeong", "bucheo", "jaebaek", "gwanrok"] as const;
export type ZiweiDeepPalace = (typeof ZIWEI_DEEP_PALACES)[number];
export type ZiweiDeepRead = {
  readonly palace: ZiweiDeepPalace;
  readonly kind: "single" | "pair" | "empty";
  /** 주성 id · 쌍성 id · "empty". */
  readonly bundle: string;
  readonly entry: ZiweiPicked<ZiweiDeep> | null;
  /** 공궁일 때만(그 궁 읽기의 borrow와 같은 것). */
  readonly borrow: ZiweiBorrowRead | null;
};
export type ZiweiMbtiRead = {
  readonly type: MbtiType;
  /** 명궁이 비어 맞은편 칸 주성을 빌렸는가. */
  readonly borrowed: boolean;
  readonly stars: readonly MajorStarId[];
  readonly rules: readonly { readonly star: MajorStarId; readonly entry: ZiweiPicked<ZiweiMbtiRule> | null }[];
};
export type ZiweiLookup = {
  readonly profile: FactProfile;
  readonly lensState: ZiweiLensState;
  /** 12궁(PALACES 순서). */
  readonly palaces: readonly ZiweiPalaceRead[];
  readonly body: { readonly palace: PalaceId; readonly entry: ZiweiPicked<ZiweiPalaceEntry> | null; readonly lens: ZiweiLensRead | null };
  readonly mutagens: readonly { readonly mutagen: MutagenId; readonly star: StarId; readonly palace: PalaceId; readonly schoolVariant: boolean; readonly entry: ZiweiPicked<ZiweiMutagenEntry> | null }[];
  /** 생년 사화 연간 표의 그 해 천간 줄. */
  readonly mutagenYear: ZiweiMutagenYear | null;
  readonly fiveClass: { readonly id: FiveClassId; readonly number: number; readonly entry: ZiweiFiveClassEntry | null };
  /** 심화 4궁(ZIWEI_DEEP_PALACES 순서). */
  readonly deep: readonly ZiweiDeepRead[];
  /** MBTI 유형이 없으면 null. */
  readonly mbti: ZiweiMbtiRead | null;
  /** 장면 수: 남긴 것 · requires로 뺀 것 · 글(입력에 없는 가족 등 — sceneTextFits)로 뺀 것. 같은 항목은 한 번만 센다. */
  readonly sceneCount: { readonly kept: number; readonly droppedByRequires: number; readonly droppedByText: number };
  /** 필요한데 DB에 없는 id(중복 없이, 처음 나온 순서). 비어 있어야 한다. */
  readonly missing: readonly string[];
};

type Sceneful = { readonly id: string; readonly scenes?: Partial<Record<Domain, readonly ZiweiScene[]>>; readonly scene?: ZiweiScene };

export function lookupZiwei(chart: ZiweiChart, kb: ZiweiKnowledge, facts: ZiweiFacts): ZiweiLookup {
  // toFactProfile은 연애 · 일 · 자녀 세 칸만 읽는다(나머지는 형식 맞춤).
  const profile = toFactProfile({
    name: "", gender: null, birthDate: "", birthTimeUnknown: false, mbti: null, detailJob: "",
    relationshipStatus: facts.relationshipStatus, jobStatus: facts.jobStatus, ...(facts.children ? { children: facts.children } : {}),
  });
  const lensState = ziweiLensState(facts);
  const missing = new Set<string>();
  const sceneCount = { kept: 0, droppedByRequires: 0, droppedByText: 0 };

  const fit = (domain: Domain | null, s: ZiweiScene): ZiweiPickedScene[] => {
    if (!sceneFits(s.requires, profile)) { sceneCount.droppedByRequires++; return []; }
    if (!sceneFits(s.requires, profile, s.text)) { sceneCount.droppedByText++; return []; }
    sceneCount.kept++;
    return [{ ...s, domain }];
  };
  // 같은 항목(별이 제 칸 · 빌린 칸에 두 번 나오는 등)은 한 번만 고른다.
  const memo = new Map<string, unknown>();
  const pick = <T extends Sceneful>(e: T): ZiweiPicked<T> => {
    const hit = memo.get(e.id);
    if (hit) return hit as ZiweiPicked<T>;
    const { scenes: many, scene: one, ...entry } = e;
    const scenes = [
      ...Object.entries(many ?? {}).flatMap(([d, list]) => (list ?? []).flatMap(s => fit(d as Domain, s))),
      ...(one ? fit(null, one) : []),
    ];
    const out: ZiweiPicked<T> = { id: e.id, entry, scenes };
    memo.set(e.id, out);
    return out;
  };
  const need = <T extends Sceneful>(e: T | undefined | null, id: string): ZiweiPicked<T> | null => {
    if (!e) { missing.add(id); return null; }
    return pick(e);
  };

  const star = (id: StarId) => need(kb.stars.get(id), `zw:star:${id}`);
  const nuanceOf = (id: MajorStarId, palace: PalaceId): string | null => {
    const raw = kb.stars.get(id);
    const line = raw?.palaceNuance?.[palace] ?? null;
    if (raw && !line) missing.add(`zw:star:${id}#palaceNuance.${palace}`);
    return line;
  };
  const placed = new Map(chart.stars.map(s => [s.id, s]));
  const major = (id: MajorStarId, palace: PalaceId): ZiweiMajorRead => {
    const entry = star(id);
    const nuance = nuanceOf(id, palace);
    const p = placed.get(id);
    if (!p?.brightness || p.brightnessBasis !== "통용") return { star: id, entry, nuance, brightness: null };
    const raw = kb.stars.get(id);
    const level = p.brightness.level;
    const text = raw?.brightness?.[level] ?? null;
    const forYou = level === "normal" ? null : (raw?.forYou[level] ?? null);
    if (raw && !text) missing.add(`zw:star:${id}#brightness.${level}`);
    if (raw && level !== "normal" && !forYou) missing.add(`zw:star:${id}#forYou.${level}`);
    return { star: id, entry, nuance, brightness: { raw: p.brightness.raw, level, text, forYou } };
  };
  const minor = (id: StarId): ZiweiMinorRead => ({ star: id, entry: star(id) });
  const pair = (id: string): ZiweiPairRead => ({ id, entry: need(kb.pairs.get(id), `zw:pair:${id}`) });
  const palaceEntry = (key: PalaceId | "sin") => need(kb.palaces.get(key), `zw:palace:${key}`);
  const lensOf = (key: PalaceId | "sin") => { const raw = kb.palaces.get(key); return raw ? ziweiLensLine(raw, lensState) : null; };

  const byId = new Map(chart.palaces.map(p => [p.id, p]));
  const borrowOf = (p: ZiweiPalace): ZiweiBorrowRead | null => {
    if (!p.empty) return null;
    const from = p.borrowFrom ? byId.get(p.borrowFrom) : undefined;
    // 엔진 불변식(공궁에는 borrowFrom이 있다)이 깨진 경우 — 시험이 잡도록 missing에 남긴다.
    if (!from) { missing.add(`engine:borrowFrom:${p.id}`); return null; }
    return {
      from: from.id,
      rule: need(kb.emptyRule, "zw:empty:rule"),
      majors: from.majors.map(id => ({ star: id, entry: star(id), nuance: nuanceOf(id, p.id) })),
      pair: from.pair ? pair(from.pair) : null,
    };
  };

  const palaces: ZiweiPalaceRead[] = chart.palaces.map(p => ({
    palace: p.id, branch: p.branch, isBody: p.isBody,
    entry: palaceEntry(p.id), lens: lensOf(p.id),
    majors: p.majors.map(id => major(id, p.id)),
    helpers: p.helpers.map(minor), malefics: p.malefics.map(minor), loves: p.loves.map(minor),
    pair: p.pair ? pair(p.pair) : null,
    borrow: borrowOf(p),
  }));
  const readOf = new Map(palaces.map(r => [r.palace, r]));

  const deep: ZiweiDeepRead[] = ZIWEI_DEEP_PALACES.map(palace => {
    const p = byId.get(palace)!;
    const kind = p.majors.length === 0 ? "empty" : p.majors.length === 1 ? "single" : "pair";
    const bundle = kind === "empty" ? "empty" : kind === "single" ? p.majors[0] : (p.pair ?? pairIdOf(p.majors[0], p.majors[1]));
    return { palace, kind, bundle, entry: need(kb.deep.get(`${palace}:${bundle}`), `zw:deep:${palace}:${bundle}`), borrow: kind === "empty" ? readOf.get(palace)!.borrow : null };
  });

  let mbti: ZiweiMbtiRead | null = null;
  if (facts.mbti) {
    const type = facts.mbti;
    const life = byId.get("myeong")!;
    const borrowed = life.empty;
    const stars = borrowed ? (readOf.get("myeong")!.borrow?.majors.map(m => m.star) ?? []) : life.majors;
    mbti = { type, borrowed, stars, rules: stars.map(s => ({ star: s, entry: need(kb.mbti.get(`${s}:${type}`), `zw-mbti:${s}:${type}`) })) };
  }

  const mutagens = chart.mutagens.map(m => ({ ...m, entry: need(kb.mutagens.get(m.mutagen), `zw:mutagen:${m.mutagen}`) }));
  const mutagenYear = kb.yearTable.get(chart.year.stem) ?? null;
  if (!mutagenYear) missing.add(`yearTable:${chart.year.stem}`);
  const fiveClassEntry = kb.fiveClasses.get(chart.fiveClass.id) ?? null;
  if (!fiveClassEntry) missing.add(`zw:class:${chart.fiveClass.id}`);

  return {
    profile, lensState, palaces,
    body: { palace: chart.bodyPalace.palace, entry: palaceEntry("sin"), lens: lensOf("sin") },
    mutagens, mutagenYear,
    fiveClass: { id: chart.fiveClass.id, number: chart.fiveClass.number, entry: fiveClassEntry },
    deep, mbti, sceneCount, missing: [...missing],
  };
}
