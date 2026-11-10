import "server-only";
import { after } from "next/server";
import { DIRECT_SOURCE, FUNNEL_SOURCE_COOKIE, TEST_BROWSER_COOKIE, parseFunnelSource, type FunnelSource, type FunnelStep } from "./funnelModel";

/**
 * F 후속 「퍼널 유입 연결」: 서버가 세는 단계(신규 가입·가입 이용권 지급·무료 책). 그 요청에 딸려 온 「유입 표시」 쿠키(처음 유입 값)로 「날짜 × 단계 × 유입」 +1.
 * 사용자 id는 시험 계정인지 보는 데만 쓰고 저장하지 않는다. 「시험」 브라우저 표시가 있거나 시험 계정이면 세지 않는다. 실패해도 요청 결과에 영향 없음.
 */
type CookieJar = { get(name: string): { value: string } | undefined };
export type ServerFunnelDeps = { tester(userId: string): Promise<boolean>; hit(data: FunnelSource & { step: FunnelStep }): Promise<unknown> };

export function requestFunnelSource(cookies: CookieJar): FunnelSource { return parseFunnelSource(cookies.get(FUNNEL_SOURCE_COOKIE)?.value) ?? DIRECT_SOURCE; }

export async function countServerFunnel(cookies: CookieJar, userId: string | null, steps: readonly FunnelStep[], deps?: ServerFunnelDeps): Promise<number> {
  if (!steps.length || cookies.get(TEST_BROWSER_COOKIE)?.value === "1") return 0;
  const d = deps ?? await defaultDeps();
  try { if (userId && await d.tester(userId)) return 0; } catch { /* 확인 못 하면 센다(시험 계정은 소수) */ }
  const src = requestFunnelSource(cookies);
  let n = 0;
  for (const step of steps) { try { await d.hit({ step, ...src }); n++; } catch { /* 무시 */ } }
  return n;
}

/** 응답을 늦추지 않게 응답 뒤(after)에 센다. 쿠키 값은 지금 읽어 둔다. */
export function scheduleServerFunnel(cookies: CookieJar, userId: string | null, steps: readonly FunnelStep[]) {
  const jar = new Map([FUNNEL_SOURCE_COOKIE, TEST_BROWSER_COOKIE].flatMap(k => { const v = cookies.get(k); return v ? [[k, v] as const] : []; }));
  try { after(() => countServerFunnel({ get: k => jar.get(k) }, userId, steps).then(() => undefined, () => undefined)); } catch { /* 요청 밖(시험 등) */ }
}

async function defaultDeps(): Promise<ServerFunnelDeps> {
  const [{ liveTestAccountIds }, { createOpsStores }] = await Promise.all([import("../ops/notify/deps"), import("../ops/store")]);
  const funnel = createOpsStores().funnel;
  return { tester: async id => (await liveTestAccountIds()).has(id.toLowerCase()), hit: data => funnel.call("hit", data) };
}
