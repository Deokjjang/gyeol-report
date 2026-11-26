/**
 * ZW-2 — 자미 책 가짜 작가(호출 0, 개발 · 시험 전용 — 고객 원고가 아니다). 묶음 지시의 장 머리글만 읽어 설계도 소제목마다 근거 줄의 뜻으로 문단을 만든다.
 * 4부 화면 확인 · 6부 가짜 작가 전 과정이 같은 경로(buildZiweiSnapshot → 투영)를 지나게 한다. 문단 교체 요청은 걸린 문장을 뺀 글을 돌려준다.
 */
import type { StreamCompletionInput, StreamCompletionResult } from "@/lib/llm/types";
import type { Intake } from "./intake";
import { CHUNK_HEADER_MARK } from "./prompt";

const RX_LINE: Readonly<Record<string, string>> = {
  "말 다듬기·한 박자": "말을 꺼내기 전에 한 박자 쉬어 보세요.", "끝까지 듣기": "상대의 말을 끝까지 듣고 나서 답해 보세요.", "하루 묵히기": "큰 결정은 하룻밤 묵혀 두세요.",
  "보내기 전 다시 읽기": "보내기 전에 한 번 더 읽어 보세요.", "값 매기기": "내 시간에 값을 붙여 보세요.", "월급날·먼저 떼어 두기": "돈이 들어오는 날 모을 몫을 먼저 떼어 두세요.",
  "돈이 들어오는 날·먼저 떼어 두기": "돈이 들어오는 날 모을 몫을 먼저 떼어 두세요.", "사람 고르기": "곁에 둘 사람을 천천히 가려 보세요.", "쉬기·잠": "쉬는 날을 먼저 정해 두세요.",
  "혼자 시간": "혼자만의 시간을 하루에 조금 남겨 두세요.", "끝낼 일 하나": "하나만 골라 끝까지 마쳐 보세요.", "연락·안부": "오랜만인 사람에게 안부를 건네 보세요.",
  "한마디 건네기": "고마운 사람에게 한마디 건네 보세요.", "몸 움직이기": "가볍게 걸으며 몸을 움직여 보세요.", "적기·목록": "떠오르는 것을 목록으로 적어 보세요.",
};
const clip = (t: string) => t.replace(/\s+/g, " ").trim();
const sentenceOf = (t: string) => { const s = clip(t).split(/(?<=[.!?])\s+/)[0] ?? ""; return s && !/[.!?]$/.test(s) ? `${s}.` : s; };

/** 묶음 원고(장 머리글 · 소제목 · 문단). 첫 묶음은 [표지] 한 줄. */
export function ziweiMockChunk(x: Intake, user: string): string | null {
  if (user.includes("\n고칠 자리:\n")) {
    const [, rest = ""] = user.split("\n고칠 자리:\n");
    const out: string[] = [];
    let id: string | null = null, para = "", bad: string[] = [];
    const flush = () => { if (!id) return; const kept = para.split(/(?<=[.!?])\s+/).filter(s => s && !bad.some(b => s.includes(b) || b.includes(s))).join(" "); out.push(`[¶${id}]\n${kept || "이 칸의 별은 당신의 결을 조용히 받쳐 줍니다."}`); };
    for (const line of rest.split("\n")) {
      const t = /^- \[¶([0-9.*]+)\]/.exec(line); if (t) { flush(); id = t[1]; para = ""; bad = []; continue; }
      const p = /^ {2}(?:고칠 문단|지금 글): (.*)$/.exec(line); if (p) { para = p[1].replace(/ \/ /g, " "); continue; }
      const b = /^ {2}· (?:걸린 문장 )?«(.*)» — /.exec(line); if (b) bad.push(b[1]);
    }
    flush();
    return out.join("\n");
  }
  const i = user.indexOf(CHUNK_HEADER_MARK); if (i < 0) return null;
  const heads = user.slice(i).split("\n").slice(1).map(l => /^## (\d+)\. /.exec(l)).filter((m): m is RegExpExecArray => Boolean(m)).map(m => Number(m[1]));
  const lineOf = new Map(x.lines.map(l => [l.id, l] as const));
  const body = heads.map(n => {
    const ch = x.chapters.find(c => c.n === n); if (!ch) return "";
    const secs = (ch.sections ?? []).map((s, si) => {
      const ls = s.lines.map(id => lineOf.get(id)).filter((l): l is NonNullable<typeof l> => Boolean(l) && l!.subject === "ziwei" && Boolean(l!.meaning));
      const a = ls[0], b = ls[1] ?? ls[0];
      const p1 = `⟪${sentenceOf(a?.meaning ?? "당신의 칸에는 당신만의 별이 앉아 있습니다.")}⟫ ${a ? `${clip(a.value.split(" · ")[0])}이 이 소제목의 무대입니다.` : ""}`.trim();
      const p2 = `${sentenceOf(b?.meaning ?? "그 결은 당신을 오래 받쳐 줍니다.")} 그 결은 당신을 오래 받쳐 줍니다.`;
      const rx = ch.rx && (ch.rxAt ?? (ch.sections ?? []).length - 1) === si ? ` ${RX_LINE[ch.rx.label ?? ""] ?? RX_LINE[ch.rx.use ?? ""] ?? "오늘 한 가지를 골라 해 보세요."}` : "";
      return `### ${s.q.replace(/[?？]$/, "")}\n${p1}\n\n${p2}${rx}`;
    });
    return `## ${ch.n}. ${ch.title}\n${secs.join("\n\n")}`;
  }).filter(Boolean).join("\n\n");
  return `${heads.includes(1) ? "[표지] 열두 칸에 앉은 나의 별 지도\n\n" : ""}${body}`;
}

export function ziweiMockStream(x: Intake) {
  return async (input: StreamCompletionInput): Promise<StreamCompletionResult> => {
    const text = ziweiMockChunk(x, input.user) ?? "";
    for (let i = 0; i < text.length; i += 400) input.onText?.(text.slice(i, i + 400));
    return { text, finishReason: "complete", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: Math.ceil(text.length / 1.5) }, costUsd: 0, requestId: "ziwei-mock" };
  };
}

/** 결제 입력 원문으로 같은 작가 입력을 다시 만들어 가짜 작가를 돌린다(개발 미리보기 · 시험). */
export async function ziweiMockStreamFor(payload: import("@/lib/report-generation/reportInputTypes").ReportInputPayload, policyAt: string) {
  const { ziweiPlanFor } = await import("./ziweiPublish");
  return ziweiMockStream(ziweiPlanFor(payload, policyAt).intake);
}
