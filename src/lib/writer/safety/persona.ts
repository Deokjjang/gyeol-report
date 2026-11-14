/**
 * W4 Q2-4 「남의 성격 문장」(결정론·호출 0): 지식 DB 행동 차원의 끝 설명(behavior-ontology poles.*.description — 연결 이유 문장이 그대로 쓰는 말)을
 * 사람 묘사로 쓸 때, 그 사람(또는 그 특성)의 값과 방향이 맞는지 본다.
 *  - persona_mismatch(HARD): 그 절(마디)의 주인(MBTI 유형·특성 이름·당신)의 그 차원 값이 |v| ≥ 0.3이고 설명의 끝과 반대.
 *    예: ENTJ(사교 에너지 +)에게 「약속이 이어지면 지쳐서 혼자 있는 시간이 꼭 필요한 편」.
 *  - persona_copy(SOFT): 방향은 맞지만(또는 값이 없거나 약함) 설명 문구를 그대로(15자 이상) 옮겼다 → 이 사람 근거와 묶어 새 문장으로.
 * 주인 찾기: 마디(「…인데」「…지만」「…반면」「,」로 나눔)에 MBTI 유형 이름이 있으면 그 유형, 특성 이름이 있으면 그 특성, 둘 다 없으면 이 책 주인공(MBTI).
 * 「둘 다」는 그 마디의 주인 모두를 본다. 주인 값을 모르면(MBTI 없음·특성에 그 차원 없음) 방향은 보지 않는다.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import { nameTokens } from "./info";
import type { Brief } from "@/lib/brief/schema";

export type PersonaDim = { readonly id: string; readonly sign: 1 | -1; readonly core: string; readonly key: string };
export type PersonaOwner = { readonly label: string; readonly re: RegExp; readonly tags: Readonly<Record<string, number>> };
export type PersonaCtx = { readonly dims: readonly PersonaDim[]; readonly owners: readonly PersonaOwner[]; readonly self: readonly PersonaOwner[] };
export type PersonaHit = { readonly rule: "persona_mismatch" | "persona_copy"; readonly detail: string };

export const PERSONA_MIN = 0.3;
/** 설명이 본문에 들었다고 볼 최소 길이(공백·문장부호 뺀 글자) — 그보다 짧은 설명은 앞 이만큼만 본다. */
const MATCH_CHARS = 12, COPY_CHARS = 15;
const norm = (t: string) => t.replace(/[\s\p{P}\p{S}]/gu, "");
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 차원 끝 설명의 핵심(「…편입니다.」 꼬리를 뗀 말, 공백·문장부호 뺌). */
export function personaDims(k: Pick<Knowledge, "ontology">): PersonaDim[] {
  const out: PersonaDim[] = [];
  for (const d of k.ontology.dimensions) for (const [pole, sign] of [["plus", 1], ["minus", -1]] as const) {
    const desc = d.poles[pole]?.description ?? "";
    const core = norm(desc.replace(/\s?(?:편|쪽)(?:입니다|이에요|예요)\.?$/, "").replace(/(?:입니다|합니다|해요)\.?$/, ""));
    if (core.length >= 8) out.push({ id: d.id, sign, core, key: `${d.id}${sign > 0 ? "+" : "-"}` });
  }
  return out;
}

/** 책의 주인: MBTI 유형(사람마다) · 특성 이름(그 특성의 지식 DB 차원 값). 궁합은 두 사람. */
export function personaContext(brief: Brief, k: Pick<Knowledge, "ontology" | "mbti" | "features">): PersonaCtx {
  const owners: PersonaOwner[] = [], self: PersonaOwner[] = [];
  const types: string[] = [brief.mbti?.type, brief.partner?.mbti?.type].flatMap(x => (x ? [String(x)] : []));
  for (const t of [...new Set(types)]) {
    const p = k.mbti.get(t as never); if (!p) continue;
    const o = { label: t, re: new RegExp(`(?<![A-Za-z])${t}(?![A-Za-z])`), tags: p.dimensionTags };
    owners.push(o);
    // 한 사람 책의 「당신」 = 그 MBTI. 궁합은 마디에 이름이 없으면 주인을 정하지 않는다.
    if (!brief.partner && t === brief.mbti?.type) self.push(o);
  }
  for (const t of brief.traits) {
    const f = k.features.get(t.featureId); if (!f || f.family === "relation") continue;
    const name = t.name.replace(/\s?\([^)]*\)/g, "").trim();
    // 이름 핵심 낱말도(「토 많음」 → 「흙 기운」「토 기운」, 「양인살」 → 「양인」) — 시험 책 오탐 1건(흙 기운을 특성으로 못 알아봄).
    const keys = [...new Set([name, ...nameTokens(name)])].filter(x => x.length >= 2);
    if (!keys.length) continue;
    owners.push({ label: name, re: new RegExp(`(?<![가-힣])(?:${keys.map(esc).join("|")})`), tags: f.dimensionTags });
  }
  return { dims: personaDims(k), owners, self };
}

const CLAUSE = /(?<=인데|지만|반면|면서도|는데)\s|,\s/;
/** 한 문장 검사. 첫 걸린 것만 돌려준다. */
export function personaHit(sentence: string, ctx: PersonaCtx): PersonaHit | null {
  const whole = norm(sentence);
  if (!ctx.dims.some(d => whole.includes(d.core.slice(0, MATCH_CHARS)))) return null;
  let copy: PersonaHit | null = null;
  for (const clause of sentence.split(CLAUSE)) {
    const n = norm(clause);
    const dims = ctx.dims.filter(d => n.includes(d.core.slice(0, Math.min(MATCH_CHARS, d.core.length))));
    if (!dims.length) continue;
    const named = ctx.owners.filter(o => o.re.test(clause));
    const who = named.length ? named : ctx.self;
    for (const d of dims) {
      for (const o of who) {
        const v = o.tags[d.id];
        if (typeof v === "number" && Math.abs(v) >= PERSONA_MIN && Math.sign(v) !== d.sign) return { rule: "persona_mismatch", detail: `${o.label}의 ${d.id}는 ${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}인데 「${d.key}」 설명을 붙였다` };
      }
      if (!copy && d.core.length >= COPY_CHARS && n.includes(d.core)) copy = { rule: "persona_copy", detail: `차원 설명 「${d.key}」 그대로` };
    }
  }
  return copy;
}
