/**
 * ZW-1 1부 · 엔진 구조 시험: 매핑 빠짐 · 라이브러리 표 = 우리 표 · 全書 밝기 근거 · 결정론 · 서버 전용 · 계산 시간 · 판정 준비.
 */
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { astro } from "iztro";
import { BRIGHTNESS_TABLE, brightnessBasisOf, MUTAGEN_TABLE, ZHUANSHU_BRIGHTNESS, zhuanshuBrightness, ZIWEI_CALC_VERSION, ZIWEI_LIBRARY_VERSION } from "@/lib/ziwei/basis";
import { computeZiweiChart } from "@/lib/ziwei/chart";
import {
  BRANCHES, HELPER_STARS, LOVE_STARS, MAJOR_STARS, MALEFIC_STARS, PALACE_NAMES, PALACES, STAR_NAMES, STAR_PAIRS, STEMS,
  ZH_BRIGHTNESS, ZH_FIVE_CLASS, ZH_MUTAGEN, ZH_PALACE, ZH_STAR, type MajorStarId, type StarId,
} from "@/lib/ziwei/ids";
import { ZiweiTimeUnknownError } from "@/lib/ziwei/lunar";
import { ziweiReadiness } from "@/lib/ziwei/readiness";
import { randomInputs } from "./helpers";

const ROOT = resolve(__dirname, "../../..");
const req = createRequire(resolve(ROOT, "package.json"));
/** 라이브러리 내부 키(pinyin) → 우리 id. */
const KEY: Readonly<Record<string, StarId>> = {
  ziweiMaj: "jami", tianjiMaj: "cheongi", taiyangMaj: "taeyang", wuquMaj: "mugok", tiantongMaj: "cheondong", lianzhenMaj: "yeomjeong", tianfuMaj: "cheonbu",
  taiyinMaj: "taeeum", tanlangMaj: "tamrang", jumenMaj: "geomun", tianxiangMaj: "cheonsang", tianliangMaj: "cheonryang", qishaMaj: "chilsal", pojunMaj: "pagun",
  zuofuMin: "jwabo", youbiMin: "ubil", wenchangMin: "munchang", wenquMin: "mungok", tiankuiMin: "cheongoe", tianyueMin: "cheonwol", lucunMin: "nokjon", tianmaMin: "cheonma",
  qingyangMin: "gyeongyang", tuoluoMin: "tara", huoxingMin: "hwaseong", lingxingMin: "yeongseong", dikongMin: "jigong", dijieMin: "jigeop",
  hongluan: "hongnan", tianxi: "cheonhui", tianyao: "cheonyo", xianchi: "hamji",
};
const LEVEL: Readonly<Record<string, string>> = { miao: "묘", wang: "왕", de: "득", li: "리", ping: "평", bu: "불", xian: "함", "": "" };

describe("매핑 · 표", () => {
  it("라이브러리 간체 이름 → id 표에 별 32 · 궁 12 · 사화 4 · 국 5 · 밝기 7이 빠짐없다", () => {
    const zhStar = req("iztro/lib/i18n/locales/zh-CN/star.js").default as Record<string, string>;
    const all: StarId[] = [...MAJOR_STARS, ...HELPER_STARS, ...MALEFIC_STARS, ...LOVE_STARS];
    expect(new Set(Object.values(ZH_STAR))).toEqual(new Set(all));
    for (const [key, id] of Object.entries(KEY)) expect(ZH_STAR[zhStar[key]], key).toBe(id);
    expect(new Set(Object.values(ZH_PALACE))).toEqual(new Set(PALACES));
    expect(Object.keys(ZH_MUTAGEN)).toHaveLength(4);
    expect(Object.keys(ZH_FIVE_CLASS)).toHaveLength(5);
    expect(Object.keys(ZH_BRIGHTNESS)).toHaveLength(7);
    expect(STAR_PAIRS).toHaveLength(24);
    expect(Object.keys(STAR_NAMES)).toHaveLength(32);
  });

  it("밝기 표 · 사화 표가 라이브러리 2.6.5 내장 표와 같다(우리 표가 원천, 라이브러리 출력은 매 명반 맞댄다)", () => {
    const { STARS_INFO } = req("iztro/lib/data/stars.js") as { STARS_INFO: Record<string, { brightness?: string[] }> };
    for (const [key, info] of Object.entries(STARS_INFO)) {
      const id = KEY[key];
      if (!id || !info.brightness) continue;
      const ours = BRIGHTNESS_TABLE[id as keyof typeof BRIGHTNESS_TABLE];
      expect(ours?.map(l => l ?? ""), key).toEqual(info.brightness.map(l => LEVEL[l]));
    }
    expect(Object.keys(BRIGHTNESS_TABLE).sort()).toEqual(Object.entries(STARS_INFO).filter(([k, v]) => KEY[k] && v.brightness).map(([k]) => KEY[k]).sort());
    const { heavenlyStems } = req("iztro/lib/data/heavenlyStems.js") as { heavenlyStems: Record<string, { mutagen: string[] }> };
    const pin = ["jia", "yi", "bing", "ding", "wu", "ji", "geng", "xin", "ren", "gui"];
    STEMS.forEach((s, i) => expect(MUTAGEN_TABLE[s], s).toEqual(heavenlyStems[`${pin[i]}Heavenly`].mutagen.map(k => KEY[k])));
  });

  it("라이브러리는 정확한 버전으로 고정되고(^ · ~ 없음) 기록 버전과 같다", () => {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
    expect(pkg.dependencies.iztro).toBe(ZIWEI_LIBRARY_VERSION);
    expect(pkg.dependencies["korean-lunar-calendar"]).toBe("0.4.0");
    expect(req("iztro/package.json").version).toBe(ZIWEI_LIBRARY_VERSION);
    expect(ZIWEI_CALC_VERSION).toMatch(/^ziwei-v\d+-/);
  });

  it("全書 卷三 밝기: 기록 126칸 중 125칸 같음, 다른 칸은 천기 辰 하나, 빈칸 42 → 근거 통용 125 · 학파차이 1 · 추정 42", () => {
    let recorded = 0, same = 0, blank = 0;
    const conflicts: string[] = [];
    for (const star of Object.keys(ZHUANSHU_BRIGHTNESS) as MajorStarId[]) {
      const ref = zhuanshuBrightness(star);
      BRANCHES.forEach(b => {
        const raw = BRIGHTNESS_TABLE[star]![("寅卯辰巳午未申酉戌亥子丑").indexOf(b)]!;
        const basis = brightnessBasisOf(star, b, raw);
        if (ref[b]) { recorded++; if (ref[b] === raw) { same++; expect(basis).toBe("통용"); } else { conflicts.push(`${star}${b}`); expect(basis).toBe("학파차이"); } }
        else { blank++; expect(basis).toBe("추정"); }
      });
    }
    expect({ recorded, same, blank, conflicts }).toEqual({ recorded: 126, same: 125, blank: 42, conflicts: ["cheongi辰"] });
    expect(brightnessBasisOf("munchang", "寅", "함")).toBe("추정");
  });

  it("쉬운 이름: 주성 14는 0부 확정안, 형제궁 · 부모궁 · 신궁은 덕짱 수정안", () => {
    expect(MAJOR_STARS.map(id => STAR_NAMES[id].easy)).toEqual(["이끄는 별", "궁리하는 별", "비추는 별", "해내는 별", "누리는 별", "선 긋는 별", "지키는 별", "살피는 별", "바라는 별", "따지는 별", "돕는 별", "감싸는 별", "밀고 가는 별", "새로 짜는 별"]);
    expect(PALACE_NAMES.hyeongje.easy).toBe("형제와 곁의 동료");
    expect(PALACE_NAMES.bumo.easy).toBe("부모와 윗사람");
  });
});

describe("명반 성질", () => {
  it("결정론: 같은 입력은 같은 명반, 라이브러리 전역 설정을 바꾸지 않는다", () => {
    const before = JSON.stringify(astro.getConfig());
    for (const input of randomInputs(11, 40)) expect(computeZiweiChart(input, "2026-11-24")).toEqual(computeZiweiChart({ ...input }, "2026-11-24"));
    expect(JSON.stringify(astro.getConfig())).toBe(before);
  });

  it("밝기 근거가 별 칸마다 붙는다(천기 辰 = 학파차이, 보좌 · 살성 = 추정, 연애 별 = 없음)", () => {
    let seenConflict = false;
    for (const input of randomInputs(12, 400)) {
      const c = computeZiweiChart(input, "2026-11-24");
      for (const s of c.stars) {
        if (s.kind === "love") expect(s.brightness).toBeNull();
        if (s.brightness === null) expect(s.brightnessBasis).toBeNull();
        else expect(s.brightnessBasis).toBe(brightnessBasisOf(s.id, s.branch, s.brightness.raw));
        if (s.id === "cheongi" && s.branch === "辰") { seenConflict = true; expect(s.brightnessBasis).toBe("학파차이"); }
        if (s.kind === "helper" || s.kind === "malefic") expect(s.brightnessBasis === null || s.brightnessBasis === "추정").toBe(true);
      }
    }
    expect(seenConflict).toBe(true);
  }, 120_000);

  it("경 · 무 · 임년 사화는 학파차이 표시가 붙는다", () => {
    const flagged = new Set<string>();
    for (const input of randomInputs(13, 300)) {
      const c = computeZiweiChart(input, "2026-11-24");
      const any = c.mutagens.some(m => m.schoolVariant);
      expect(any, c.year.stem).toBe(["戊", "庚", "壬"].includes(c.year.stem));
      if (any) flagged.add(c.year.stem);
    }
    expect([...flagged].sort()).toEqual(["壬", "庚", "戊"].sort());
  }, 120_000);

  it("계산 시간: 명반 1개 평균 100ms 미만(측정값은 판정 파일에 적는다)", () => {
    const inputs = randomInputs(14, 300);
    computeZiweiChart(inputs[0], "2026-11-24");
    const t0 = performance.now();
    for (const i of inputs) computeZiweiChart(i, "2026-11-24");
    const avg = (performance.now() - t0) / inputs.length;
    console.log(`[ziwei] 명반 1개 평균 ${avg.toFixed(2)}ms (n=${inputs.length})`);
    expect(avg).toBeLessThan(100);
  }, 120_000);
});

describe("판정 준비 · 서버 전용", () => {
  it("시각 완전 미상은 불가(12시진 선택지), 시진만 · 정확한 시각은 가능, 범위 밖은 불가", () => {
    const unknown = ziweiReadiness({ birthDate: "1990-05-17", birthTime: "", birthTimeUnknown: true });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok && unknown.code === "ZIWEI_NEED_SLOT") expect(unknown.slots).toHaveLength(12);
    else throw new Error("ZIWEI_NEED_SLOT이어야 한다");
    expect(ziweiReadiness({ birthDate: "1990-05-17", birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: "OSI" })).toEqual({ ok: true });
    expect(ziweiReadiness({ birthDate: "1990-05-17", birthTime: "12:10", birthTimeUnknown: false })).toEqual({ ok: true });
    expect(ziweiReadiness({ birthDate: "1899-12-31", birthTime: "12:10", birthTimeUnknown: false })).toMatchObject({ ok: false, code: "ZIWEI_OUT_OF_RANGE" });
    expect(ziweiReadiness({ birthDate: "2050-12-31", birthTime: "12:10", birthTimeUnknown: false })).toMatchObject({ ok: false, code: "ZIWEI_OUT_OF_RANGE" });
    expect(() => computeZiweiChart({ birthDate: "1990-05-17", birthTime: "", birthTimeUnknown: true, gender: "MALE" }, "2026-11-24")).toThrow(ZiweiTimeUnknownError);
  });

  it("계산 라이브러리는 서버 전용 어댑터(chart.ts) 한 곳에서만 import하고, 클라이언트 파일은 자미 계산 모듈을 import하지 않는다", () => {
    const files: string[] = [];
    const walk = (dir: string) => { for (const f of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) { const p = `${dir}/${f.name}`; if (f.isDirectory()) walk(p); else if (/\.(ts|tsx|js|mjs)$/.test(f.name)) files.push(p); } };
    walk("src");
    const text = (p: string) => readFileSync(resolve(ROOT, p), "utf8");
    expect(files.filter(f => /from "iztro"|require\("iztro"\)|from "iztro\//.test(text(f)))).toEqual(["src/lib/ziwei/chart.ts"]);
    expect(text("src/lib/ziwei/chart.ts").startsWith('import "server-only";')).toBe(true);
    const client = files.filter(f => /^["']use client["']/m.test(text(f).slice(0, 200)));
    expect(client.filter(f => /@\/lib\/ziwei\/(chart|lunar|readiness)|korean-lunar-calendar/.test(text(f)))).toEqual([]);
  });
});
