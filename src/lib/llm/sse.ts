export type SseMessage = { readonly event: string | null; readonly data: string };

/** text/event-stream 본문을 메시지 단위로 읽는다. 연결이 끊기면 reader의 오류가 그대로 던져진다. */
export async function* parseSse(body: ReadableStream<Uint8Array>): AsyncGenerator<SseMessage> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let event: string | null = null;
  let data: string[] = [];
  const dispatch = (): SseMessage | null => {
    const message = data.length ? { event, data: data.join("\n") } : null;
    event = null; data = [];
    return message;
  };
  const readLine = (line: string): SseMessage | null => {
    if (line === "") return dispatch();
    if (line.startsWith(":")) return null;
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    else if (field === "data") data.push(value);
    return null;
  };
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      // 끝의 "\r"은 다음 조각의 "\n"과 한 줄바꿈일 수 있어 남겨 둔다.
      buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, "\n").replace(/\r(?!$)/g, "\n");
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const message = readLine(line);
        if (message) yield message;
      }
    }
    buffer += decoder.decode();
    for (const line of buffer.replace(/\r\n?/g, "\n").split("\n")) {
      const message = readLine(line);
      if (message) yield message;
    }
    const last = dispatch();
    if (last) yield last;
  } finally {
    reader.cancel().catch(() => undefined);
  }
}
