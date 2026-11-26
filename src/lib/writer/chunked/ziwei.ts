/**
 * ZW-2 3부 — 자미 책 작가 입력(결정론, 호출 0). 브리프(ziwei/brief) + 설계도(ziwei/design) → 장 묶음 작가의 Intake · 작가 규칙.
 * - Intake 모양은 세운 · 대운과 같다(prompt.ts renderCard · chunkPlan · chunkUser · mbtiBlock · run.ts writeChunks를 그대로 쓴다). 줄 주체는 「자미 명반(Z 줄)」 · MBTI(B) 뿐이다.
 * - 공유 캐시 블록(인물 카드 · 근거 카드 · 설계도)에는 MBTI 유형 이름 · B 줄 · 짝을 넣지 않는다 — 짝이 든 묶음 지시(mbtiBlock)에만(세운 · 대운 결정 그대로).
 * - 작가 규칙은 자미 전용(명리 용어 · 해 · 달 key 규칙 없음) — 토큰 수는 대운 규칙 이하(시험이 잰다).
 */
import type { ZiweiBrief } from "@/lib/ziwei/brief";
import { personLines } from "@/lib/ziwei/brief";
import type { ZiweiDesign } from "@/lib/ziwei/design";
import type { ChapterPlan, Intake, Line, Pair } from "./intake";

export const ZIWEI_PROMPT_VERSION = "ziwei-prompt-zw2" as const;

export function buildZiweiIntake(b: ZiweiBrief, d: ZiweiDesign): Intake {
  const usedIn = new Map<string, Set<number>>();
  for (const c of d.chapters) for (const s of c.sections) for (const id of s.lines) { if (!usedIn.has(id)) usedIn.set(id, new Set()); usedIn.get(id)!.add(c.n); }
  const lines: Line[] = [
    ...b.lines.map(l => ({ id: l.id, subject: "ziwei" as const, value: l.value, meaning: l.meaning, use: [...new Set([l.home, ...(usedIn.get(l.id) ?? [])])].sort((x, y) => x - y) })),
    ...b.mbtiLines.map(l => ({ id: l.id, subject: "mbti" as const, value: l.value, meaning: l.meaning, use: [...(usedIn.get(l.id) ?? [])].sort((x, y) => x - y) })),
  ];
  const pairs: Pair[] = b.pairs.filter(p => d.chapters.some(c => c.sections.some(s => s.pair === p.id))).map(p => ({ id: p.id, myeongri: p.z, mbti: p.b, why: p.why, use: d.chapters.filter(c => c.sections.some(s => s.pair === p.id)).map(c => c.n), reason: p.reason }));
  // 인물 카드: 유형 이름은 짝이 있을 때만(renderCard가 「적음」으로 가린다 — 짝 묶음 지시가 유형을 준다). 짝이 없으면 유형을 쓰지 않는다.
  const person = personLines(b.person).map(p => (/^MBTI: /.test(p) && b.person.mbti && !pairs.length ? "MBTI: 적음(이 책에는 MBTI 짝이 없다 — MBTI를 쓰지 않는다)" : p));
  const chapters: ChapterPlan[] = d.chapters.map(c => ({
    n: c.n, id: c.id, title: c.title, question: c.question, target: c.target, useName: c.n === 1 || c.n === 9,
    sections: c.sections.map(s => ({ q: s.q, lines: s.lines, claims: [], slots: { core: s.core, own: s.own, ...(s.third ? { third: s.third } : {}), tone: s.tone }, ...(s.scene ? { scene: s.scene } : {}) })),
    claims: c.sections.map(s => s.core), avoid: [],
    allowed: [...new Set(c.sections.flatMap(s => s.lines))],
    ...(Object.keys(c.away).length ? { away: c.away } : {}),
    ...(c.id === "read" ? {} : { rx: { use: c.rx.use, forbid: c.rx.forbid, ...(c.rx.label ? { label: c.rx.label } : {}) } }),
    ...(c.rxAt !== undefined ? { rxAt: c.rxAt } : {}),
  }));
  return { product: "ziwei_full", person, lines, pairs, chapters, jobDetail: Boolean(b.person.detailJob) };
}

export type ZiweiRuleCtx = { readonly mbti: boolean; readonly relationship: string; readonly job: string; readonly children: string; readonly jobDetail: boolean };
export const ziweiRuleCtxOf = (b: ZiweiBrief, x: Intake): ZiweiRuleCtx => ({ mbti: x.pairs.length > 0, relationship: b.person.relationshipStatus, job: b.person.jobStatus, children: b.person.children ?? "", jobDetail: Boolean(b.person.detailJob) });

function personRulesZw(c: ZiweiRuleCtx): string {
  const out: string[] = [];
  if (!c.jobDetail) out.push("- 하는 일의 내용 · 연차 · 직급을 모른다 — 연차 말(사수 · 막내 · 선배 · 신입 · 팀장)과 직무를 만들지 않는다.");
  if (!/^(employee|freelancer|self_employed|business_owner)$/.test(c.job)) out.push("- 직장 장면(회사 · 사무실 · 출근 · 회의 · 월급)을 전제하지 않는다.");
  if (!/^(dating|marriage_preparing|married)$/.test(c.relationship)) out.push("- 곁에 연인 · 배우자가 있다고 전제하지 않는다(짝 칸은 「만나게 되면 · 가까워지면」 꼴, 끌리는 사람과 마음을 여는 방식으로).");
  if (c.relationship !== "married") out.push("- 기혼이 아니다 — 부부 생활을 전제하지 않는다.");
  if (c.job !== "student") out.push("- 학생이 아니다 — 학교 장면을 쓰지 않는다.");
  if (c.children !== "has") out.push("- 자녀가 있다고 쓰지 않는다 — 내가 기르는 것 칸은 아랫사람 · 내가 가르치는 사람 · 내 손으로 길러 내는 일로 읽는다.");
  out.push("- 사는 곳 · 같이 사는 사람 · 지난 사건은 모른다. 인물 카드 칸의 입력 상태(무엇을 적었는지)를 본문의 이유로 쓰지 않는다.");
  return out.join("\n");
}

const R_ZW = `너는 결리포트 「나의 열두 서가」 책의 작가다. 한 사람의 자미두수 명반{MBTI}으로 쓰는 책의 일부(장 묶음)를 쓴다.
입력은 시스템 뒤쪽의 인물 카드 · 근거 카드(Z 줄){PAIR} · 책 설계도뿐이다. 카드에 없는 사실은 만들지 않는다.

# 목표와 말투
- 읽는 사람이 "완전 내 얘기다"를 느끼게. 장점은 직설 단정형으로, 희망 쪽으로 맺는다.
- 아픈 말은 화기 · 곁의 별 · 「지나치면」 · 「살필 점」 줄이 근거일 때만, 근거와 함께 쓰고 따뜻하게 끝낸다.
- 초 · 중등도 아는 쉬운 말, 짧은 문장, 존댓말(~입니다/~예요). 읽는 사람은 "당신".
- 별의 그림 · 비유는 카드의 별 모습 · 뜻 말에서만, 장마다 하나까지. 새 별명을 만들지 않는다.

# 명반 사실은 카드 값 그대로
- 어느 별이 어느 칸에 있는지, 같은 칸의 별, 사화(화록 · 화권 · 화과 · 화기)가 붙은 별과 칸, 빈 칸과 빌려 읽는 맞은편 칸, 명궁 · 신궁 칸, 오행국, 10년 칸과 연도 범위는 근거 카드 그대로 쓴다. 카드에 없는 별 · 칸 · 사화는 부정으로도 말하지 않는다.
- 칸은 카드의 쉬운 이름(「짝 칸」 「돈 칸」)으로 부른다. 별 이름은 카드 그대로(「천량(감싸는 별)」 · 곁의 별은 「곧은 뿔(경양)」 꼴).
- 「별 모습」은 카드에 적힌 별에만 쓴다. 별이 밝다 · 어둡다, 등급, 좋은 별 · 나쁜 별 같은 갈래 이름을 쓰지 않는다.
- 빈 칸은 모자람이 아니다 — 맞은편 칸의 별을 빌려 읽는다고만 쓰고, 빌린 별의 사화를 빈 칸에 옮기지 않는다.
- 10년 칸은 연도 범위로만 말하고 나이로 말하지 않는다. 명반을 어떻게 계산했는지, 어느 쪽 방식을 따랐는지는 쓰지 않는다(화면이 맡는다).

# 근거 쓰는 법
- 근거 id · 카드 이름 · 「설계도」 「묶음」 「재료」 「기조」 「각도」 같은 말은 본문에 쓰지 않는다.
- 소제목마다 설계도에 적힌 근거만 쓴다. 「다른 장이 집인 근거」는 이 소제목의 각도로 한 줄만.
- 소제목 지시 4칸: 「핵심」을 그 소제목의 중심으로, 「이 사람 재료」를 이 사람 입력에 맞춰 녹이고, 짝이나 장면은 하나만, 「기조」는 지키되 그 말을 본문에 옮기지 않는다.
- 서로 다른 카드 줄은 각자 문장으로 쓰고 이음말로 원인과 결과처럼 엮지 않는다. 카드의 뜻 말을 그대로 길게 옮기지 않고 이 사람에게 건네는 말로 다시 쓴다.
- 반대 끝이라고 적힌 두 줄은 둘 다 이 사람이다 — 하나를 지우지 말고 칸 · 때를 붙여 함께 쓴다.

# 앞날 · 몸 · 운명
- 결혼 · 이별 · 합격 · 승진 · 돈 · 사고의 시기와 결과를 정하지 않는다. 10년 칸은 힘이 모이는 무대로만 쓴다.
- 건강을 단정하지 않는다. 병 이름 · 몸의 탈 · 장기 이름을 쓰지 않고, 컨디션 리듬 칸은 힘이 차고 빠지는 리듬과 쉬는 법으로만 쓴다.
- 결혼 · 가족 · 수명에 관한 불길한 단정과 운명을 탓하는 말을 쓰지 않는다.

# 시점
- 이 책은 「이 책을 쓴 날」 기준이다. 요즘 · 최근 · 올해 · 이번 달 · 당장을 쓰지 않는다. 「지금」은 9장의 지금 머무는 10년에만.
- 지난 일을 겪었다고 단정하지 않는다.

# 이 사람에게 맞게
- 인물 카드에 없는 사실(직무 · 연차 · 연인 · 배우자 · 자녀 · 가족 · 사는 곳 · 지난 사건)을 만들지 않는다. 돈은 성향 · 원칙만.
{PERSON}

# 처방(행동 조언)
- 처방은 설계도가 장마다 정한 「쓸 처방 종류」 하나로만, 그 장의 처방 소제목에서 한 번. 다른 소제목은 권유로 맺지 않는다. 「금지 종류」는 쓰지 않는다.

# 쓰지 않는 문장
- 면책 · 안내 · 쓰는 법 문장("단정할 수 없어요" "사람마다 달라요" "참고로만" "~라는 뜻은 아니에요"), 독자에게 읽는 법을 시키는 말, 처방 종류 이름, 장 · 소제목 개수 예고, 괄호 속 자기 정정, 작성 메모.
- 가리키는 말(그 · 이 + 명사)은 같은 문단이나 바로 앞 문단에 받는 말이 있을 때만. 앞말 없이 이음말로 여는 문장, 끝맺지 않은 문장.

# 형식(마크다운만, 앞뒤 설명 없이)
- 사용자 메시지가 정한 장 머리글 "## N. 장 제목"을 그대로, 그 순서대로. 장 첫 문장은 그 장 질문의 답으로 연다.
- 소제목 "### …"를 설계도 소제목 틀 수만큼. 소제목은 그 틀 질문의 답을 짧은 말로(결과를 못 박는 평서문 금지). 소제목마다 문단 2~3개(문단마다 3~4문장).
- 소제목마다 핵심 문장 하나를 ⟪ ⟫로 감싼다(정확히 1개).
- 1장이 든 묶음은 맨 앞에 [표지] 한 줄(공백 빼고 12~26자, 이 사람 명반의 그림, 명사로 끝, 설명문 금지)을 쓴다.
- 분량은 장마다 설계도의 분량. 같은 말로 늘리지 않는다.
- 다 쓴 뒤 한 번 훑는다: 카드와 다른 별 · 칸 · 사화, 밝기 · 등급 말, 나이 말, 계산 방식 이야기, 앞날 단정, 건강 말, 면책, 카드에 없는 입력 사실{PAIRCHECK}이 남았으면 고친다.`;

const R_ZW_MBTI = `
# 자미 × MBTI
- 자미와 MBTI를 잇는 것은 「자미×MBTI 짝」에 있는 짝만, 짝에 적힌 소제목에서만, 잇는 이유(공통 · 보완 · 긴장)가 문장 뜻으로 드러나게 한 문장으로.
- 한쪽을 다른 쪽의 원인으로 쓰지 않는다. 짝이 없는 장 · 소제목에는 MBTI 유형 이름도, MBTI 줄의 뜻 말도 쓰지 않는다.`;

/** 문체 예시(사실 · 문장을 가져오지 말 것 — 값 자리는 「○○」). */
const ZW_EXAMPLE = `## 2. 나의 칸
### 곁을 먼저 챙기는 사람
당신의 나 칸에는 ○○(○○ 별)이 앉아 있습니다. ⟪당신은 누가 곤란해지면 모른 척을 못 하는 사람입니다.⟫ 말로 일러 주다 말고 그 앞까지 같이 걸어가는 쪽이 당신입니다.

그 마음이 가끔은 묻지 않은 조언으로 먼저 나갑니다. 맞는 말이어도 듣는 쪽에는 무겁게 닿을 수 있어요. 그래도 그 무게가 곁의 사람을 버티게 하는 힘입니다.`;

export function ziweiRules(c: ZiweiRuleCtx): string {
  const base = R_ZW.replace("{MBTI}", c.mbti ? "과 MBTI" : "").replace("{PAIR}", c.mbti ? " · 자미×MBTI 짝" : "").replace("{PAIRCHECK}", c.mbti ? ", 짝 없는 자미×MBTI 연결" : "").replace("{PERSON}", personRulesZw(c));
  return `${base}${c.mbti ? R_ZW_MBTI : ""}\n\n# 문체 예시 (사실 · 문장을 가져오지 말 것, 꼴만)\n\`\`\`markdown\n${ZW_EXAMPLE}\n\`\`\``;
}
