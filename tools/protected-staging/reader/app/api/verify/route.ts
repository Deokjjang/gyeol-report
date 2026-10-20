import { MAX_ARTIFACT_BYTES, verifyBook } from '../../../../artifact';
import { readerAccess, reviewConfiguration, reviewHeaders } from '../../../access';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const reply = (status: number, value: unknown) => Response.json(value, { status, headers: reviewHeaders });
  if (!readerAccess(process.env, request.headers.get('host'))) return reply(404, { ok: false, error: 'NOT_FOUND' });
  const config = reviewConfiguration(process.env);
  if (!config) return reply(503, { ok: false, error: 'VERIFIED_REVIEW_CONFIGURATION_REQUIRED' });
  // Next dev may normalize its internal URL to localhost even when the exact
  // validated browser Host is127.0.0.1. Pin the local browser origin explicitly.
  const origin = process.env.VERCEL ? new URL(request.url).origin : 'http://127.0.0.1:4318';
  if (request.headers.get('origin') !== origin || request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')
    return reply(403, { ok: false, error: 'SAME_ORIGIN_REQUIRED' });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, { ok: false, error: 'JSON_REQUIRED' });
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { ok: false, error: 'SIGNED_ARTIFACT_REQUIRED' });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength;
      if (size > MAX_ARTIFACT_BYTES + 4096) { await reader.cancel(); return reply(413, { ok: false, error: 'ARTIFACT_TOO_LARGE' }); } chunks.push(value); }
    const result = verifyBook(JSON.parse(Buffer.concat(chunks).toString('utf8')), config.key, config.source);
    return reply(result.ok ? 200 : 422, result);
  } catch { return reply(400, { ok: false, error: 'ARTIFACT_INVALID' }); }
}
