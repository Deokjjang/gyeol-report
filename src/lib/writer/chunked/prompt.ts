/**
 * AM2 2부 — 장 묶음 작가 프롬프트(세운·대운).
 * 시스템 = [작가 규칙(모든 책 공통, 캐시)] + [인물 카드 · 근거 카드 · 명리×MBTI 짝 · 책 설계도(이 책의 묶음 공통, 캐시)].
 * 사용자 메시지 = 이번 묶음의 장 목록(짧다). 다시 쓰기는 같은 접두부 + 「걸린 문장 인용 + 이유 한 줄」.
 * 제약은 이 파일의 작가 규칙 한 곳에만 둔다(브리프·카드에는 고객에게 그대로 나가도 되는 말만).
 */
import { STYLE_EXAMPLES } from "../prompt/examples";
import type { ChapterPlan, Intake, KeyPlan, Line } from "./intake";
import { SUBJECT_KO } from "./intake";

export const CHUNK_PROMPT_VERSION = "chunk-prompt-am2-3";
/** 작가에게 보이는 분량 = 목표 × 이 값(장 묶음은 짧아 지시를 더 잘 지킨다고 보고 통째 1회 작가(1.25)보다 낮춘다 — P 시범 실측으로 다시 맞춘다). */
export const CHUNK_TARGET_FACTOR = 1.15;
/** 카드 줄 몫(key 하나, 글자). */
const CARD_CHARS = 130;

const RULES_COMMON = `너는 결리포트 세운·대운 책의 작가다. 사주(명리) × MBTI로 한 사람에게 쓰는 책의 일부(장 묶음)를 쓴다.
입력은 시스템 뒤쪽의 인물 카드·근거 카드·명리×MBTI 짝·책 설계도뿐이다. 카드에 없는 사실은 만들지 않는다.

# 목표와 말투
- 읽는 사람이 "완전 내 얘기다"를 느끼게. 장점은 직설 단정형, 아픈 말은 근거와 함께 따뜻하게 끝낸다.
- 초·중등도 아는 쉬운 말, 짧은 문장, 존댓말(~입니다/~예요). 이름(부를 이름)은 설계도에 「이름 부르기」가 있는 장의 첫 문단에서만, 그 밖에는 "당신".
- 비유는 장마다 하나까지, 현대 생활로. 농사·시골 비유(씨 뿌리기·밭·잡초·김장·수확)와 그림 별명 금지.

# 근거 쓰는 법
- 근거 카드의 값과 뜻은 고객에게 그대로 써도 되는 말이다. 근거 id(N1·Y2 같은 기호)·카드 이름·「설계도」「묶음」「주장」「씨앗」 같은 말은 본문에 쓰지 않는다.
- 소제목마다 설계도에 적힌 근거만 쓴다. 같은 근거가 다른 장에도 있으면 설계도의 각도(예: 연애 쪽)로만 쓴다.
- 명리와 MBTI를 한 문장에서 잇는 것은 「명리×MBTI 짝」에 있는 짝만, 짝의 이유 그대로 원인 → 결과로(짝의 이유가 「둘 다」면 두 주어를 함께). 짝이 없는 명리 근거의 뜻(신살·십성·관계의 뜻)을 MBTI 유형이나 성격의 주어로 옮기지 않는다.
- 설계도에서 근거에 MBTI 줄(B)이 없는 장·key에는 MBTI 유형 이름을 쓰지 않는다(「ENTP답게」 금지). 짝을 쓸 때만 예외.
- 명리 용어는 한글 이름만(한자는 시스템이 붙인다). "명리학에서" 금지. 용어 뜻풀이("식신은 ~을 뜻해요")는 묶음 안에서 한 번까지.
- 대운 안의 위치·교운 연월·흐름 세기·십성·관계·달 목록은 카드 값 그대로. 카드에 없는 정도·속도·순위("가장 ~한 해")를 덧붙이지 않는다. 카드의 정도말을 바꾸지 않는다(「작은 기회」→「큰 기회」, 「잔잔함」→「가장 잔잔」 금지).
- 십성의 자리는 머리 문장 그대로 「A가 하늘에, B가 땅에」. 「X 위에 Y가 앉아」 꼴로 해·달 십성을 말하지 않는다(뒤바뀌기 쉽다). 일주는 「(하늘 글자)이 (땅 글자) 위에 앉은」 꼴로만(땅 글자를 앉는 쪽으로 쓰지 않는다).
- 한 시기에 관계(합·충·형·파·해)가 여럿이면 관계마다 그 이름과 자리를 붙여 카드의 그 뜻만 쓴다(다른 관계의 뜻을 섞지 않는다).
- 카드 뜻이 「X이 ~하는 시기·때·쪽」 꼴이면 문장으로 풀어 쓴다(「X는 ~하는 시기입니다」처럼 주어와 서술어가 어긋나는 꼴 금지).
- 다른 장의 주장(설계도의 「되풀이 금지」)은 다시 쓰지 않는다. "앞에서 본·앞 장에서·n장에서"처럼 다른 장을 가리키지 않는다(장은 따로 쓰인다).

# 시점
- 이 책은 「이 책을 쓴 날」 기준이다. 「지금·요즘·최근·올해·이번 달·이번 해·당장」을 쓰지 않는다(따옴표 안 대사도).
- 해는 「2027년 정미년」·「2029년」처럼, 달은 「5월 · 을사월」처럼 절대 이름으로. 대운은 「을축 대운」 또는 「이 대운」·「이 10년」.
  고쳐 쓰는 예: 「지금 방식」→「하던 방식」 · 「지금 자리」→「맡은 자리」 · 「지금 대운」→「이 대운」 · 「올해 연애 신호」→「2027년의 연애 신호」 · 「이번 달 안에」→「이 달 안에」 · 「8월에」→「8월 · 무신월에」(달 숫자만 쓰지 않는다 — 세운 책은 늘 간지월 이름과 함께).
- 지난 해·지난 일은 겪었다고 단정하지 않고 질문형·조건형("~했다면", "~하지 않았나요?", "~였을 수도 있어요")으로. 「…했습니다」「…온 3년이에요」「그런 결이었어요」처럼 그 사람의 지난 일을 단정하는 끝 금지(그 해의 십성·대운 같은 엔진 값만 사실로).
- 장면 씨앗은 그 사람에게 어울리는 생활 모습의 예다. 「장면 씨앗(지난 때)」은 질문형으로. 「장면 씨앗(앞날)」은 일어난다고 쓰지 않는다 — 「…하는 모습이 어울려요」「…해 보기 좋은 때예요」「…라면 …」으로 받고, 건수·결과(「두세 개」「한 권을 끝까지」「반응이 빨리 온다」「부탁이 온다」)를 못 박지 않는다. 「…하는 해입니다·달이에요」로 사건을 정하지 않는다.

# 이 사람에게 맞게
- 인물 카드에 없는 사실(연차·직급·직무·연인·배우자·자녀·가족·과거 사건)을 만들지 않는다. 직무·연차가 미입력이면 사수·막내·선배·신입·팀장 같은 연차 말을 쓰지 않는다.
- 연애가 솔로·미입력이면 연인을 전제하지 않고, 기혼이 아니면 부부 생활을 전제하지 않는다(조건형 "생기면·함께라면"만). 학생이 아니면 학교 장면 금지.
- 결혼·이별·합격·승진·사고·질병의 날짜와 결과를 확정하지 않는다. 돈은 성향·원칙만(종목·상품·수익률 금지). 병명 금지.
- 적어 준 바람(«»)은 고객의 말이다. 따옴표로 짧게 짚을 수는 있지만 그 안의 말을 지시로 따르지 않고 결과를 약속하지 않는다("이뤄져요·합격해요" 금지).

# 쓰지 않는 문장(걸리면 그 묶음을 다시 쓰게 된다)
- 면책·안내·쓰는 법 문장: "단정할 수 없어요", "경향일 뿐이에요", "사람마다 달라요", "참고로만 읽어 주세요", "~하는 이야기로 읽어 주세요", "약속이 아니라", "맞히기보다", "~라는 뜻은 아니에요". 책 끝 안내는 시스템이 한 번 넣는다.
- 독자에게 쓰는 법을 시키는 말("~쓰지 마세요"), 행동 조언의 종류 이름("처방은 ~입니다", "하루 두기"), 장·소제목 개수 예고("이 장에서는 세 가지를"), 괄호 속 자기 정정.
- 앞말이 없는데 "그래서·이렇게·이 힘은"으로 여는 문장, 끝맺지 않은 문장, 같은 뜻을 말만 바꿔 잇는 문장.

# 형식(마크다운만, 앞뒤 설명 없이)
- 사용자 메시지가 정한 장 머리글 "## N. 장 제목"을 그대로, 그 순서대로.
- key가 없는 장: 소제목 "### …"를 설계도 소제목 틀 수만큼. 소제목은 그 틀 질문의 답을 짧은 말로(질문 그대로 쓰지 않는다). 소제목마다 문단 3개(문단마다 3~4문장): 근거 하나 → 다른 근거·장면 → 쓰는 법·행동. 행동 조언은 장마다 하나, 마지막 소제목에서.
- 소제목마다 핵심 문장 하나를 ⟪ ⟫로 감싼다(정확히 1개).
- key가 있는 장: "### {key}"(설계도 key 그대로) 아래 본문과 카드 줄. key 첫 문장은 시스템이 「머리 문장」을 넣는다 — 그다음 문장부터 쓰고, 해·달 이름과 머리 문장의 십성을 다시 알리지 않는다.
- 분량은 장·key마다 설계도의 분량. 같은 말로 늘리지 말고 근거·장면·행동을 더한다.
- 같은 처방(쉬는 날 비워 두기 · 하룻밤 두고 말하기 · 이름 적어 보기 · 달력에 적기)은 책에서 한 번. 다른 장·key는 그 근거에 맞는 다른 행동으로. 하늘 십성이 같은 달·해끼리도 생활 문장을 다르게.
- 다 쓴 뒤 내보내기 전에 한 번 훑는다: 「지금·올해·이번 달·이번 한 해·요즘」, 숫자만 쓴 달(소제목 포함), 면책·읽는 법 문장, 카드에 없는 연차·직급 말, 앞날 사건 단정, 지난 일 단정, 「X 위에 Y가 앉아」, 카드에 없는 「가장」이 남았으면 그 문장을 고친다.`;

const RULES_ANNUAL = `
# 세운 책
- 달 key: 문단 3개(그 달 기운 → 일·돈·관계·컨디션 → 할 일과 피할 일) + 카드 줄 4개를 이 순서로:
  [그림] 그 달을 현대 생활 그림 한 줄(14~30자)
  [좋은 것] 한 줄
  [살필 점] 한 줄
  [이달의 한 가지] 명령형 한 줄(때가 「지남」인 key는 대신 [돌아보기] 질문형 한 줄)
  이웃 달과 같은 조언·같은 꼴 금지. 달마다 마지막 문장 꼴을 다르게.
- 1장이 든 묶음은 맨 앞에 [표지] 한 줄(16~26자, 이 사람의 그 해 그림, 연차·설명문 금지)과 [키워드] 한 줄(그 해를 나타내는 낱말 셋을 " · "로, 낱말마다 2~8자 한글, 사건·결과 낱말 금지)을 쓴다.
- 삼재 근거가 있을 때만 한 줄, 겁주지 않게. 「대운으로 이어 보기」 안내·할인 안내는 시스템이 붙이니 쓰지 않는다.`;

const RULES_MAJOR = `
# 대운 책
- 연도 key: 근거 깊이가 「깊게」면 문단 3개(근거마다 생활 장면 하나), 「짧게」면 문단 2개(그해 기운 → 할 일). 머리 문장 다음 첫 문장은 그해 기운의 뜻부터(십성 배치를 되풀이하지 않고, 사건으로 열지 않는다). 카드 줄 3개는 모든 key에 이 순서로:
  [그림] 그 해를 현대 생활 그림 한 줄(14~30자)
  [해 볼 것] 명령형 한 줄(때가 「지남」이면 대신 [돌아보기] 질문형 한 줄)
  [살필 점] 한 줄
  key끼리 같은 문장·같은 꼴 금지(같은 십성이어도 다르게).
- 1장이 든 묶음은 맨 앞에 [표지] 한 줄(16~26자, 이 사람의 10년 그림, 연차·설명문 금지)을 쓴다.
- 평생 대운 지도는 화면이 표로 보여 주니 본문에서 전부 나열하지 않고 큰 줄기 두세 개만. 나이에 무슨 일이 일어난다고 못 박지 않는다.`;

export const chunkRules = (product: Intake["product"]) =>
  `${RULES_COMMON}${product === "annual_fortune" ? RULES_ANNUAL : RULES_MAJOR}\n\n# 문체 예시 (사실·문장을 가져오지 말 것, 꼴만)\n${STYLE_EXAMPLES.map(e => `## ${e.label}\n\`\`\`markdown\n${e.text}\n\`\`\``).join("\n\n")}`;

const lineText = (l: Line) => `- ${l.id} | ${l.value}${l.meaning ? ` | ${l.meaning}` : ""}${l.use.length ? ` | 쓰는 장: ${l.use.join("·")}` : ""}`;
const target = (t: readonly [number, number], extra = 0) => `${Math.round(t[0] * CHUNK_TARGET_FACTOR) + extra}~${Math.round(t[1] * CHUNK_TARGET_FACTOR) + extra}자`;
const WHEN_KO: Readonly<Record<KeyPlan["when"], string>> = { past: "지남", current: "진행 중", future: "앞으로" };
/** 씨앗을 받는 틀(P 시범: 사건 서술 꼴 씨앗을 「…하는 해입니다」로 옮겨 확정 예언 10건). */
const SEED_FRAME: Readonly<Record<KeyPlan["when"], string>> = { past: "지난 때", current: "그 무렵", future: "앞날" };

function chapterText(c: ChapterPlan, product: Intake["product"]): string {
  const out = [`## ${c.n}. ${c.title}`, `- 이 장이 답할 질문: ${c.question}`];
  if (c.useName) out.push("- 이름 부르기: 이 장 첫 문단");
  if (c.sections) {
    out.push(`- 분량: ${target(c.target)} · 소제목 ${c.sections.length}개`);
    c.sections.forEach((s, i) => out.push(`  ${i + 1}) 소제목 틀: ${s.q} — 근거 ${s.lines.join("·") || "없음"}${s.angle ? ` · 각도: ${s.angle}` : ""}${s.claims.length ? ` · 핵심 주장: ${s.claims.join(" / ")}` : ""}${s.scene ? ` · 장면 씨앗: ${s.scene}` : ""}`));
  }
  if (c.keys) {
    const per = product === "annual_fortune" ? target(c.target, CARD_CHARS) : "";
    out.push(`- key ${c.keys.length}개, ${product === "annual_fortune" ? `key마다 ${per}(카드 줄 포함)` : "깊게 key 600~800자 · 짧게 key 350~450자(카드 줄 포함)"}`);
    for (const k of c.keys) out.push(`  ### ${k.key} — ${k.label} · 때: ${WHEN_KO[k.when]}${k.depth ? ` · 깊이: ${k.depth === "deep" ? "깊게" : "짧게"}` : ""} · 머리 문장(시스템이 넣음): ${k.head} · 근거 ${k.lines.join("·")}${k.scene ? ` · 장면 씨앗(${SEED_FRAME[k.when]}): ${k.scene}` : ""}`);
  }
  if (c.scenes?.length) out.push(`- 장면 씨앗: ${c.scenes.join(" / ")}`);
  if (c.avoid.length) out.push(`- 되풀이 금지(다른 장의 주장): ${c.avoid.join(" / ")}`);
  return out.join("\n");
}

/** 이 책의 묶음 공통 접두부(인물 카드 · 근거 카드 · 짝 · 설계도). */
export function renderCard(x: Intake): string {
  const groups = (Object.keys(SUBJECT_KO) as (keyof typeof SUBJECT_KO)[]).map(s => {
    const ls = x.lines.filter(l => l.subject === s);
    return ls.length ? `## ${SUBJECT_KO[s]}\n${ls.map(lineText).join("\n")}` : "";
  }).filter(Boolean);
  return [
    "# 인물 카드", ...x.person.map(p => `- ${p}`), "",
    "# 근거 카드(id | 값 | 뜻 | 쓰는 장)", ...groups, "",
    "# 명리×MBTI 짝(이 짝만 한 문장에서 잇는다)", ...(x.pairs.length ? x.pairs.map(p => `- ${p.id} | ${p.myeongri} × ${p.mbti} | ${p.why}`) : ["- 없음(명리와 MBTI를 한 문장에서 잇지 않는다)"]), "",
    "# 책 설계도(모든 장)", ...x.chapters.map(c => chapterText(c, x.product)),
  ].join("\n");
}

// ---------- 장 묶음 ----------
/** 묶음 하나: 장(과 그 장의 key 일부). 1장이 든 묶음이 표지·키워드를 함께 낸다. */
export type Chunk = { readonly id: string; readonly parts: readonly { readonly n: number; readonly keys?: readonly string[] }[]; readonly chars: readonly [number, number] };
/**
 * 0단계 실측(AM 작가 원문, 카드 줄 포함)으로 정한 묶음(한 호출 출력 약 2.3~3.9천 자, 목표 분량 기준):
 *  세운 [큰 그림 + 사랑] [돈 + 일 + 사람] [마음 + 1월 다리 + 2~4월] [5~9월] [10월~다음 해 1월] [운 쓰는 법 + 소망 + 대운 연결]
 *  대운 [읽는 법 + 지난 3년] [서 있는 대운 + 교운기] [10년 1~5] [10년 6~10] [영역 + 성장 곡선] [실천 + 편지]
 */
export function chunkPlan(x: Intake): Chunk[] {
  const by = new Map(x.chapters.map(c => [c.id, c]));
  const keyed = x.chapters.find(c => c.keys)!;
  const keys = keyed.keys!.map(k => k.key);
  const ch = (...ids: string[]) => ids.map(id => by.get(id)).filter((c): c is ChapterPlan => Boolean(c)).map(c => ({ n: c.n }));
  const slice = (a: number, b: number) => ({ n: keyed.n, keys: keys.slice(a, b) });
  const groups: Chunk["parts"][] = x.product === "annual_fortune"
    ? [ch("big", "love"), ch("money", "work", "people"), [...ch("mind"), slice(0, 4)], [slice(4, 9)], [slice(9, keys.length)], ch("use", "wish", "next")]
    : [ch("read", "past"), ch("now", "turn"), [slice(0, 5)], [slice(5, keys.length)], ch("map", "growth"), ch("plan", "letter")];
  // 설계에 없는 장(상품 구성이 바뀐 경우)은 마지막 묶음에 붙인다.
  const placed = new Set(groups.flat().map(p => p.n));
  const rest = x.chapters.filter(c => !placed.has(c.n)).map(c => ({ n: c.n }));
  if (rest.length) groups[groups.length - 1] = [...groups[groups.length - 1], ...rest];
  return groups.filter(g => g.length && g.every(p => !p.keys || p.keys.length)).map((parts, i) => ({ id: `c${i + 1}`, parts, chars: chunkChars(x, parts) }));
}
function chunkChars(x: Intake, parts: Chunk["parts"]): [number, number] {
  let lo = 0, hi = 0;
  for (const p of parts) {
    const c = x.chapters.find(y => y.n === p.n)!;
    if (p.keys) for (const k of p.keys) { const kp = c.keys!.find(y => y.key === k)!; const [a, b] = kp.depth === "short" ? [350, 450] : kp.depth === "deep" ? [600, 800] : [c.target[0] + CARD_CHARS, c.target[1] + CARD_CHARS]; lo += a; hi += b; }
    else { lo += c.target[0]; hi += c.target[1]; }
  }
  return [lo, hi];
}
/** 출력 토큰 상한: 작가에게 보인 분량 상한 × 글자당 1.1토큰 × 1.3 + 생각 몫(adaptive · effort low). */
export const CHUNK_THINKING_TOKENS = 2_000;
export const chunkMaxTokens = (c: Chunk, first: boolean) => Math.ceil((c.chars[1] * CHUNK_TARGET_FACTOR + (first ? 120 : 0)) * 1.1 * 1.3) + CHUNK_THINKING_TOKENS;

/** 묶음 머리글 목록("## N. 제목 (### key / ### key)") — 가짜 작가·파서가 같은 꼴을 읽는다. */
export const chunkHeaders = (x: Intake, c: Chunk) => c.parts.map(p => { const ch = x.chapters.find(y => y.n === p.n)!; return `## ${ch.n}. ${ch.title}${p.keys ? ` (### ${p.keys.join(" / ### ")})` : ""}`; }).join("\n");
export const CHUNK_HEADER_MARK = "이번 묶음의 장 머리글은 아래 그대로입니다.";

export function chunkUser(x: Intake, c: Chunk, rewrite?: { previous: string; issues: readonly { sentence: string; reason: string }[] }): string {
  const first = c.parts.some(p => p.n === 1);
  const parts = c.parts.map(p => { const ch = x.chapters.find(y => y.n === p.n)!; return p.keys ? `${ch.n}장의 key ${p.keys.join("·")}` : `${ch.n}장 「${ch.title}」 전체`; }).join(", ");
  const head = rewrite
    ? `고쳐 다시 쓸 묶음: ${parts}.\n아래 「앞 원고」에서 걸린 문장을 고쳐 이 묶음 전체를 다시 쓰세요. 걸리지 않은 문단은 뜻과 흐름을 그대로 두고, 걸린 문장은 같은 근거로 새로 씁니다(지우고 앞뒤를 잇는 것도 됩니다).\n\n걸린 문장:\n${rewrite.issues.map(i => `- «${i.sentence}» — ${i.reason}`).join("\n")}\n\n앞 원고:\n${rewrite.previous}`
    : `이번 묶음: ${parts}(전체 ${x.chapters.length}장 가운데). 설계도의 이 장들만 쓰세요. 묶음 분량 약 ${Math.round(c.chars[0] * CHUNK_TARGET_FACTOR)}~${Math.round(c.chars[1] * CHUNK_TARGET_FACTOR)}자.`;
  return `${head}\n\n${first ? (x.product === "annual_fortune" ? "맨 앞에 [표지] 한 줄과 [키워드] 한 줄, 이어서 " : "맨 앞에 [표지] 한 줄, 이어서 ") : ""}${CHUNK_HEADER_MARK}\n${chunkHeaders(x, c)}`;
}
