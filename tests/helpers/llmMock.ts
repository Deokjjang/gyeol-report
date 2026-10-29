/**
 * OpenAI Responses 스트림 목업(P3 실패 주입, 비용 0). 호출마다 behaviors를 차례로 쓴다.
 * status: HTTP 오류(출력 0) / cutAt: 그 글자 수에서 연결이 끊김 / finish: completed | incomplete(max_output_tokens) / hang: 끝내지 않음(타임아웃).
 */
import type { Brief } from "@/lib/brief/schema";
import { writeDeterministicChapter } from "@/lib/writer/deterministic";
import { renderChapter } from "@/lib/writer/format";
import { buildWriterPrompt, type WriterChapter } from "@/lib/writer/prompt";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { norm } from "@/lib/writer/safety/sentences";

export type MockBehavior = { status?: number; text?: string; cutAt?: number; finish?: "completed" | "incomplete"; hang?: boolean };
export type MockCall = { body: Record<string, unknown> };

export function mockOpenAi(behaviors: MockBehavior[]): { fetch: typeof fetch; calls: MockCall[] } {
  const calls: MockCall[] = [];
  const impl = async (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const b = behaviors[Math.min(calls.length, behaviors.length - 1)];
    calls.push({ body: JSON.parse(String(init?.body ?? "{}")) });
    const signal = init?.signal;
    if (b.status) return new Response(JSON.stringify({ error: { message: `mock ${b.status}` } }), { status: b.status, headers: { "x-request-id": `mock-${calls.length}` } });
    const text = b.text ?? "";
    const enc = new TextEncoder();
    const ev = (o: unknown) => enc.encode(`data: ${JSON.stringify(o)}\n\n`);
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        const fail = () => controller.error(new Error("aborted"));
        signal?.addEventListener("abort", fail, { once: true });
        const end = b.cutAt ?? text.length;
        for (let i = 0; i < end; i += 200) {
          if (signal?.aborted) return;
          controller.enqueue(ev({ type: "response.output_text.delta", delta: text.slice(i, Math.min(end, i + 200)) }));
          await new Promise(r => setTimeout(r, 0));
        }
        if (b.hang) return; // 끝내지 않는다 — 호출 쪽 타임아웃·중단만이 끝낸다.
        if (b.cutAt !== undefined) { controller.error(new Error("socket hang up")); return; }
        const usage = { input_tokens: 12_000, output_tokens: Math.ceil(text.length / 1.5), input_tokens_details: { cached_tokens: 0 } };
        controller.enqueue(ev(b.finish === "incomplete"
          ? { type: "response.incomplete", response: { usage, incomplete_details: { reason: "max_output_tokens" } } }
          : { type: "response.completed", response: { usage } }));
        controller.close();
      },
    });
    return new Response(body, { status: 200, headers: { "content-type": "text/event-stream", "x-request-id": `mock-${calls.length}` } });
  };
  return { fetch: impl as typeof fetch, calls };
}

/** 목업 작가 원고: 결정론 장 + 장마다 다른 덧붙임 문단(분량 하한을 넘기도록). */
export function mockBookText(brief: Brief, chapters?: readonly WriterChapter[]): string {
  const plan = chapters ?? buildWriterPrompt(brief).chapters;
  const avoid = new Set<string>(); // 실제 작가처럼 책 안에서 같은 문장을 두 번 쓰지 않는다
  return plan.map(ch => {
    const c = writeDeterministicChapter(brief, ch, { avoid });
    for (const s of c.sections) for (const p of s.paragraphs) for (const x of splitSentences(p)) avoid.add(norm(x));
    // 분량 하한을 넘기도록 장 번호가 들어간(책 안에서 겹치지 않는) 덧붙임 문단.
    const filler = [`${ch.n}장에서 본 모습은 하루아침에 생긴 것이 아니라 오래 다듬어진 결입니다.`, `그래서 ${ch.n}장의 결은 작은 습관 하나만 바꿔도 결과가 달라지는 편이에요.`, `오늘 ${ch.n}장에서 한 가지를 골라 일주일만 지켜보세요.`, `그게 ${ch.n}장의 숙제이고, 일주일 뒤 ${ch.n}장을 다시 펼치면 달라진 점이 보입니다.`, `${ch.n}장의 이야기를 누군가에게 한 줄로 말해 보는 것도 좋은 연습입니다.`];
    const chars = c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0);
    const extra = ch.keys ? [] : Array.from({ length: Math.max(1, Math.ceil((1100 - chars) / 200)) }, (_, i) => ({ heading: `${ch.n}장을 덮으며 ${i + 1}`, paragraphs: [filler.map(x => `${x.replace(/\.$/, "")}(${i + 1}).`).join(" ")] }));
    return renderChapter({ ...c, sections: [...c.sections, ...extra] });
  }).join("\n\n") + "\n";
}
