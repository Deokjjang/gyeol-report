/**
 * 로컬 개발 전용 목업 작가(P6d-ops E2E, API 호출 0). next dev + OPS_MOCK_WRITER일 때만 켜진다.
 * OPS_MOCK_WRITER=ok: 결정론 장면 은행 글에 장마다 다른 문단을 덧붙여 "작가 원고"처럼 흘려보낸다(시험용, 고객 원고 아님).
 * OPS_MOCK_WRITER=fail: 출력 전 529(과부하)로 실패한다(제본 중·재시도 화면 확인용).
 * OPS_FORCE_ANTHROPIC_DOWN=1 (P6e-ops 8): "Anthropic 장애"를 강제한다. 정식본(Anthropic) 시도만 출력 전 529로 실패시키고,
 *   임시본(OpenAI) 시도는 그대로 실제 호출한다. 실호출로 "장애 → 임시본 → 정식본 교체" 경로를 한 번 돌려 볼 때만 쓴다. next dev에서만 켜진다.
 */
import type { Brief } from "../../brief/schema";
import type { ReportInputPayload } from "../../report-generation/reportInputTypes";
import { buildBrief } from "../../brief";
import { payloadToBriefInput } from "../../writer/book";
import { writeDeterministicChapter } from "../../writer/deterministic";
import { keyLabelOf } from "../../writer/chunked/intake";
import { renderChapter } from "../../writer/format";
import { buildWriterPrompt } from "../../writer/prompt";
import { kstDate, writerKnowledge } from "../../writer/publish";
import type { StreamCompletionInput, StreamCompletionResult } from "../../llm/types";

export function devMockMode(env: Readonly<Record<string, string | undefined>> = process.env): "ok" | "fail" | null {
  if (env.NODE_ENV !== "development") return null;
  return env.OPS_MOCK_WRITER === "ok" || env.OPS_MOCK_WRITER === "fail" ? env.OPS_MOCK_WRITER : null;
}

function mockText(brief: Brief): string {
  return buildWriterPrompt(brief).chapters.map(ch => {
    const c = writeDeterministicChapter(brief, ch, {});
    const chars = c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0);
    const extra = ch.keys ? [] : Array.from({ length: Math.max(1, Math.ceil((1100 - chars) / 200)) }, (_, i) => ({ heading: `${ch.n}장 정리 ${i + 1}`,
      paragraphs: [`${ch.n}장에서 본 모습은 오래 다듬어진 결입니다(${i + 1}). 작은 습관 하나만 바꿔도 ${ch.n}장의 결과가 달라집니다(${i + 1}). 오늘 ${ch.n}장에서 한 가지를 골라 일주일만 지켜보세요(${i + 1}).`] }));
    return renderChapter({ ...c, sections: [...c.sections, ...extra] });
  }).join("\n\n");
}

/** 정식본 시도만 실패시키는 개발 전용 플래그. 운영(NODE_ENV=production)에서는 항상 false. */
export function devForceAnthropicDown(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return env.NODE_ENV === "development" && env.OPS_FORCE_ANTHROPIC_DOWN === "1";
}

/**
 * AM2 장 묶음(세운·대운): 사용자 메시지의 묶음 머리글 목록(「## N. 제목 (### key / …)」)에 있는 장·key만 쓴다. 1장이 든 묶음은 [표지]·[키워드]도.
 * 덧붙이는 문단은 다른 장을 가리키지 않는 말로(장 묶음 차단 검사에 걸리지 않게).
 */
export function mockChunkText(brief: Brief, user: string): string | null {
  const i = user.indexOf("이번 묶음의 장 머리글은 아래 그대로입니다."); if (i < 0) return null;
  const heads = user.slice(i).split("\n").slice(1).map(l => l.match(/^## (\d+)\. .*?(?: \(### (.+)\))?$/)).filter((m): m is RegExpMatchArray => Boolean(m));
  const plan = buildWriterPrompt(brief).chapters;
  const out = heads.map(m => {
    const ch = plan.find(c => c.n === Number(m[1])); if (!ch) return "";
    // AM2-3 1-1: 머리글은 key 이름(「5월 · 을사월」) — 브리프 타임라인으로 key를 되찾는다.
    const byLabel = new Map((brief.timeline?.entries ?? []).map(e => [keyLabelOf(e), e.key] as const));
    const keys = m[2]?.split(" / ### ").map(h => byLabel.get(h.trim()) ?? h.trim());
    const c = writeDeterministicChapter(brief, ch, keys ? { keys } : {});
    const chars = c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0);
    const extra = ch.keys ? [] : Array.from({ length: Math.max(1, Math.ceil((ch.targetChars[0] - chars) / 200)) }, (_, j) => ({ heading: `작게 시작하는 법 ${j + 1}`,
      paragraphs: [`오래 다듬어진 결은 작은 습관에서 먼저 드러납니다(${j + 1}). 작은 습관 하나만 바꿔도 결과가 달라질 수 있어요(${j + 1}). 한 가지를 골라 일주일만 지켜보세요(${j + 1}).`] }));
    return renderChapter({ ...c, sections: [...c.sections, ...extra] });
  }).filter(Boolean).join("\n\n");
  const first = heads.some(m => m[1] === "1");
  return `${first ? `[표지] ${brief.chart.coreImage.line}\n${brief.product === "annual_fortune" ? "[키워드] 단단함 · 기회 · 쉼\n" : ""}\n` : ""}${out}`;
}

export function devMockStream(mode: "ok" | "fail", payload: ReportInputPayload, policyAt: string) {
  let text: string | null = null, brief: Brief | null = null;
  return async (input: StreamCompletionInput): Promise<StreamCompletionResult> => {
    const usage = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
    if (mode === "fail") return { text: "", finishReason: "error", usage, costUsd: 0, requestId: "dev-mock", error: { code: "http_529", message: "mock overloaded", status: 529 } };
    brief ??= buildBrief(payloadToBriefInput(payload as never, kstDate(policyAt), policyAt) as never, writerKnowledge().k);
    const chunk = mockChunkText(brief, input.user);
    if (chunk !== null) { for (let i = 0; i < chunk.length; i += 400) input.onText?.(chunk.slice(i, i + 400)); return { text: chunk, finishReason: "complete", usage: { ...usage, outputTokens: Math.ceil(chunk.length / 1.5) }, costUsd: 0, requestId: "dev-mock" }; }
    text ??= mockText(brief);
    for (let i = 0; i < text.length; i += 400) input.onText?.(text.slice(i, i + 400));
    return { text, finishReason: "complete", usage: { ...usage, outputTokens: Math.ceil(text.length / 1.5) }, costUsd: 0, requestId: "dev-mock" };
  };
}
