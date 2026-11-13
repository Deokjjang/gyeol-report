/**
 * AM2-8 뿌리 4(재료 사전 품질, 호출 0): 세운 · 대운 카드 · 화면에 들어가는 재료 사전 전수 검사.
 * 사전 = MBTI 장면 씨앗 전부 · 할 일 문형 전부 · 처방 종류 이름 · 십성 시기(뜻 · 열쇠말 · 장면 · 할 일 · 살필 점) · 배지 뜻 · 간지 그림 줄 ·
 *   관계 · 십성 짧은 뜻(labels · core) · 영역 줄(DOMAIN_BY_TEN_GOD) · 세운 · 대운 심화 재료(deep/annual-* · major-* · mbti-growth · year-energy · seat-meaning).
 * (1) 문장 꼴(낮은 오탐 결정론): 목적격 뒤 피동(「마음을 확인될 때까지」) · 빈 자리 조사(「의 는」) · 겹친 말(「적어 준 적어 준」) · 끝에 남은 「 · 」.
 * (2) 씨앗 · 할 일 · 십성 장면은 모두 필요 입력 꼬리표가 있다(input-needs.json).
 * (3) 기혼에게 살아남는 씨앗 · 할 일 · 장면에 연애 시작 말이 없다. (4) 쉬는 중 · 학생에게 살아남는 씨앗 · 할 일 · 장면에 일터 말이 없다.
 */
import { describe, expect, it } from "vitest";
import { CHAPTER_RX, RX } from "@/lib/brief/prescriptions";
import { inputsOf, itemFits, needsFor } from "@/lib/brief/premise";
import { REL_SHORT, REL_ROW, TEN_GOD_ROW, TEN_GOD_SHORT, SEAT_SHORT_KO } from "@/lib/brief/core";
import { FLOW_DESC, GROUP_EASY, HALF_HAP_PLAIN, REL_PLAIN, TEN_GOD_EASY } from "@/lib/brief/labels";
import { DOMAIN_BY_TEN_GOD } from "@/lib/brief/productEvidence";
import { writerKnowledge } from "@/lib/writer/publish";
import { LOVE_START, WORKPLACE } from "./am28-words";

type Item = { src: string; id: string; text: string; tag?: "seed" | "todo" | "tgp" };
const DEEP = /^(annual-|major-)|^(mbti-growth|year-energy|seat-meaning)$/;
function dictionary(): Item[] {
  const { k } = writerKnowledge();
  const out: Item[] = [];
  const put = (src: string, id: string, text: string | undefined, tag?: Item["tag"]) => { if (text && text.trim()) out.push({ src, id, text, ...(tag ? { tag } : {}) }); };
  for (const [type, doms] of k.mbtiSeeds) for (const [dom, seeds] of Object.entries(doms)) for (const s of seeds) put("씨앗", `${type}:${dom}:${s.id}`, s.text, "seed");
  for (const a of k.actions) a.text.forEach((t, i) => put("할 일 문형", `${a.id}#${i}`, t, "todo"));
  for (const [kd] of RX) put("처방 종류", kd, kd);
  for (const [ch, kinds] of Object.entries(CHAPTER_RX)) for (const kd of kinds) put("처방 종류", `${ch}:${kd}`, kd);
  for (const [tg, e] of k.tenGodPeriod) for (const unit of ["year", "month"] as const) {
    const x = e[unit] as { meaning: string; action?: string; keywords: readonly string[]; scenes: readonly { text: string }[]; caution?: readonly { text: string }[] };
    put("십성 시기 뜻", `${tg}:${unit}`, x.meaning); put("십성 시기 할 일", `${tg}:${unit}`, x.action);
    x.keywords.forEach((w, i) => put("십성 열쇠말", `${tg}:${unit}#${i}`, w));
    x.scenes.forEach((s, i) => put("십성 장면", `${tg}:${unit}#${i}`, s.text, "tgp"));
    (x.caution ?? []).forEach((c, i) => put("십성 살필 점", `${tg}:${unit}#${i}`, c.text));
  }
  for (const b of k.badges) put("배지 뜻", `${b.kind}:${b.pair ?? ""}`, b.line);
  for (const [g, e] of k.ganji) put("간지 그림 줄", g, e.imageLine);
  for (const [name, table] of Object.entries({ REL_PLAIN, TEN_GOD_EASY, GROUP_EASY, FLOW_DESC, REL_SHORT, REL_ROW, TEN_GOD_SHORT, TEN_GOD_ROW } as Record<string, Readonly<Record<string, string>>>)) for (const [key, v] of Object.entries(table)) put("짧은 뜻", `${name}.${key}`, v);
  put("짧은 뜻", "HALF_HAP_PLAIN", HALF_HAP_PLAIN);
  for (const v of [SEAT_SHORT_KO.day.close, SEAT_SHORT_KO.day.life, SEAT_SHORT_KO.month, SEAT_SHORT_KO.monthLife, SEAT_SHORT_KO.year, SEAT_SHORT_KO.hour]) put("짧은 뜻", "SEAT_SHORT_KO", v);
  for (const [tg, lines] of Object.entries(DOMAIN_BY_TEN_GOD)) lines.forEach((l, i) => put("영역 줄", `${tg}#${i}`, l));
  for (const [topic, entries] of k.deep) if (DEEP.test(topic)) for (const e of entries) for (const [facet, lines] of Object.entries(e.items)) lines.forEach((l, i) => put("심화 재료", `${topic}:${e.key}:${facet}#${i}`, l));
  return out;
}

/** 문장 꼴(결정론, 낮은 오탐). 이름 · 뜻 · 고친 예는 판독에서 나온 것만. */
const FORM: readonly { name: string; re: RegExp }[] = [
  // 목적격 조사 뒤 「-되다」 피동(「좋아하는 마음을 확인될 때까지」): 「을/를 + 두~네 글자 + 될 · 되는 · 된 · 되기 · 됨」이 때 · 끝 말로 맺을 때.
  // 꾸밈 꼴(「작업물을 공개된 곳에 올려」 — 목적어는 뒤 동사의 것)은 오탐이라 뺀다.
  { name: "목적격 뒤 피동", re: /(?:을|를) [가-힣]{2,4}(?:될|되는|된|되기|됨)(?= ?(?:때|까지|뒤|후|만큼)|[.,]|$)/ },
  // 빈 자리 조사(값이 빠진 틀 「ENFP의 는」): 붙은 조사 뒤에 또 홀로 선 조사.
  { name: "빈 자리 조사", re: /(?<=[가-힣A-Za-z)」])(?:의|을|를) (?:은|는|이|가|을|를|도)(?=\s|$)/ },
  // 겹친 말(「적어 준 적어 준」): 두 글자 이상 낱말(또는 두 낱말)이 띄어 쓴 채 그대로 되풀이.
  { name: "겹친 말", re: /(?<![가-힣])([가-힣]{2,}(?: [가-힣]{1,})?) \1(?![가-힣])/ },
  // 끝에 남은 가운뎃점 · 빈 마디(「… · 」 「 ·  · 」).
  { name: "끝에 남은 가운뎃점", re: /^\s*·|·\s*$|·\s*·/ },
];
/** 일부러 되풀이하는 말(「한 걸음 한 걸음」 「하나하나」 꼴은 띄어 쓴 되풀이로 겹친 말이 아니다). */
const REDUP_OK = /^(한 (걸음|번|칸|줄|명|가지|장|개)|조금|천천히|하나|차곡|꾸준히|오래|자꾸|점점|더|또)$/;

const facts = (job: string, rel: string) => ({ relationship: rel, children: "unknown", job: { status: job, class: job === "student" ? "student" : "none", detail: "" } });

describe("AM2-8 재료 사전 전수 검사(호출 0)", () => {
  const items = dictionary();
  const form = items.flatMap(it => FORM.flatMap(f => { const m = it.text.match(f.re); if (!m) return []; if (f.name === "겹친 말" && REDUP_OK.test(m[1])) return []; return [`${f.name} · ${it.src} ${it.id} · ${it.text}`]; }));
  const untagged = items.filter(it => it.tag && needsFor(it.tag, it.text) === null).map(it => `${it.src} ${it.id} · ${it.text}`);
  const survive = (job: string, rel: string) => { const x = inputsOf(facts(job, rel)); return items.filter(it => it.tag && itemFits(it.tag, it.text, x)); };
  const married = survive("employee", "married").filter(it => LOVE_START.test(it.text)).map(it => `${it.src} ${it.id} · ${it.text.match(LOVE_START)![0]} · ${it.text}`);
  const noWork = [...new Set(["unemployed", "student"].flatMap(job => survive(job, "single").filter(it => WORKPLACE.test(it.text)).map(it => `${job} · ${it.src} ${it.id} · ${it.text.match(WORKPLACE)![0]} · ${it.text}`)))];
  it("사전이 비지 않았다(씨앗 · 할 일 · 십성 장면 · 심화 재료)", () => {
    for (const s of ["씨앗", "할 일 문형", "처방 종류", "십성 시기 뜻", "십성 장면", "배지 뜻", "간지 그림 줄", "짧은 뜻", "영역 줄", "심화 재료"]) expect(items.some(it => it.src === s), s).toBe(true);
    if (process.env.AM28_REPORT) process.stdout.write(`AM28_DICT ${JSON.stringify({ items: items.length, form: form.length, untagged: untagged.length, married: married.length, noWork: noWork.length, samples: { form: form.slice(0, 40), untagged: untagged.slice(0, 20), married: married.slice(0, 30), noWork: noWork.slice(0, 40) } })}\n`);
  });
  it("(1) 문장 꼴 검사는 판독 인용 꼴을 잡고, 맞는 꼴은 지나간다", () => {
    const hit = (t: string) => FORM.filter(f => { const m = t.match(f.re); return m && !(f.name === "겹친 말" && REDUP_OK.test(m[1])); }).map(f => f.name);
    expect(hit("좋아하는 마음을 확인될 때까지 아끼기")).toEqual(["목적격 뒤 피동"]);
    expect(hit("ENFP의 는 장면")).toEqual(["빈 자리 조사"]);
    expect(hit("고객이 적어 준 적어 준 바람")).toEqual(["겹친 말"]);
    expect(hit("내 몫 지키기 · ")).toEqual(["끝에 남은 가운뎃점"]);
    for (const ok of ["좋아하는 마음이 확인될 때까지 아끼기", "작은 작업물을 공개된 곳에 올려 보세요", "친구의 소개 자리에 같이 가 주겠다고 나서기", "한 걸음 한 걸음 나아가기", "내 몫 지키기 · 같은 편"]) expect(hit(ok), ok).toEqual([]);
  });
  it("(1) 문장 꼴: 목적격 뒤 피동 · 빈 자리 조사 · 겹친 말 · 끝에 남은 가운뎃점이 없다", () => { expect(form).toEqual([]); });
  it("(2) 씨앗 · 할 일 · 십성 장면은 모두 필요 입력 꼬리표가 있다", () => { expect(untagged).toEqual([]); });
  it("(3) 기혼에게 살아남는 씨앗 · 할 일 · 장면에 연애 시작 말이 없다", () => { expect(married).toEqual([]); });
  it("(4) 쉬는 중 · 학생에게 살아남는 씨앗 · 할 일 · 장면에 일터 말이 없다", () => { expect(noWork).toEqual([]); });
});
