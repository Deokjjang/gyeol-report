/**
 * 삭제 후 정리(P3.5 A4, 결정론·호출 0).
 * ① 삭제로 소제목 본문이 2문장 이하가 되면 앞 소제목에 합친다(첫 소제목이면 다음 소제목에).
 * ② "앞에서 본 X"의 X가 책 앞쪽에 소개된 적이 없으면 "앞에서 본"을 지우고, X를 짧게 처음 소개하는 문장(쉬운 이름 + 이미지 한 구)을 앞에 둔다.
 */
import { josa } from "@/lib/brief/labels";
import type { Brief } from "@/lib/brief/schema";
import type { BookSection } from "../format";
import { splitSentences } from "./patterns";

const sentenceCount = (s: BookSection) => s.paragraphs.reduce((n, p) => n + splitSentences(p).length, 0);
const appendTo = (s: BookSection, extra: readonly string[]): BookSection => ({ ...s, paragraphs: [...s.paragraphs.slice(0, -1), [s.paragraphs.at(-1), ...extra].filter(Boolean).join(" ")] });

/** shrunk: 문장 삭제로 줄어든 소제목. 2문장 이하로 남았으면 이웃 소제목에 합친다. */
export function mergeShrunk(sections: readonly BookSection[], shrunk: ReadonlySet<BookSection>): { sections: BookSection[]; merged: number } {
  const out: BookSection[] = []; let merged = 0;
  const thin = (s: BookSection) => shrunk.has(s) && sentenceCount(s) <= 2;
  for (const s of sections) {
    if (thin(s) && out.length) { out[out.length - 1] = appendTo(out[out.length - 1], s.paragraphs); merged++; continue; }
    out.push(s);
  }
  if (out.length > 1 && thin(out[0])) { const [first, next] = out; out.splice(0, 2, { ...next, paragraphs: [[...first.paragraphs, next.paragraphs[0]].join(" "), ...next.paragraphs.slice(1)] }); merged++; }
  return { sections: out, merged };
}

const BACKREF = /(앞에서 본|앞서 본|앞 장에서 본|앞에서 말한|앞에서 나온) /;
const noHan = (s: string) => s.replace(/\s*\([^)]*\)/g, "").replace(/[一-鿿]+/g, "").trim();
const lastWord = (s: string) => s.trim().split(/\s+/).at(-1) ?? "";

type Ref = { readonly tokens: readonly string[]; readonly intro: string };
function refsOf(brief: Brief): Ref[] {
  return brief.traits.map(t => {
    const name = noHan(t.name);
    const tokens = [...new Set([t.easyName, lastWord(t.easyName), name, lastWord(t.image.metaphor)].filter(x => x.length >= 2))];
    return { tokens, intro: `${t.easyName}${name && name !== t.easyName ? `(${name})` : ""}${josa(t.easyName, "은는").slice(-1)} ${t.image.metaphor} 같은 기운입니다.` };
  });
}

/** 책 앞쪽 글(prior)에 X가 소개됐는지 보고 고친다. prior는 이 함수가 문장을 지나가며 늘린다. */
export function fixBackrefs(sections: readonly BookSection[], brief: Brief, prior: { text: string }): { sections: BookSection[]; fixed: number } {
  const refs = refsOf(brief); let fixed = 0;
  const out = sections.map(s => ({ ...s, paragraphs: s.paragraphs.map(p => splitSentences(p).reduce((para, sen) => {
    const m = sen.match(BACKREF);
    let result = sen;
    if (m && m.index !== undefined) {
      const head = sen.slice(m.index + m[0].length, m.index + m[0].length + 24);
      const ref = refs.find(r => r.tokens.some(t => head.includes(t)));
      const introduced = ref ? ref.tokens.some(t => prior.text.includes(t)) : prior.text.includes(head.split(/\s+/)[0]?.replace(/(의|은|는|이|가)$/, "") ?? "");
      if (!introduced) { result = `${ref ? `${ref.intro} ` : ""}${sen.replace(BACKREF, "")}`; fixed++; }
    }
    prior.text += ` ${result}`;
    return result === sen ? para : para.replace(sen, result);
  }, p)) }));
  return { sections: out, fixed };
}
