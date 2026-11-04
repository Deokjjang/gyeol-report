/**
 * 로컬 개발 전용 목업 작가(P6d-ops E2E, API 호출 0). next dev + OPS_MOCK_WRITER일 때만 켜진다.
 * OPS_MOCK_WRITER=ok: 결정론 장면 은행 글에 장마다 다른 문단을 덧붙여 "작가 원고"처럼 흘려보낸다(시험용, 고객 원고 아님).
 * OPS_MOCK_WRITER=fail: 출력 전 529(과부하)로 실패한다(제본 중·재시도 화면 확인용).
 */
import type { Brief } from "../../brief/schema";
import type { ReportInputPayload } from "../../report-generation/reportInputTypes";
import { buildBrief } from "../../brief";
import { payloadToBriefInput } from "../../writer/book";
import { writeDeterministicChapter } from "../../writer/deterministic";
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

export function devMockStream(mode: "ok" | "fail", payload: ReportInputPayload, policyAt: string) {
  let text: string | null = null;
  return async (input: StreamCompletionInput): Promise<StreamCompletionResult> => {
    const usage = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
    if (mode === "fail") return { text: "", finishReason: "error", usage, costUsd: 0, requestId: "dev-mock", error: { code: "http_529", message: "mock overloaded", status: 529 } };
    text ??= mockText(buildBrief(payloadToBriefInput(payload as never, kstDate(policyAt)) as never, writerKnowledge().k));
    for (let i = 0; i < text.length; i += 400) input.onText?.(text.slice(i, i + 400));
    return { text, finishReason: "complete", usage: { ...usage, outputTokens: Math.ceil(text.length / 1.5) }, costUsd: 0, requestId: "dev-mock" };
  };
}
