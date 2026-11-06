// 운영 Q 7: 관리자 주문 상세 「계산 검증」 칸 — 엔진이 이 입력에 쓴 시간대·태양시 보정·절입·대운 계산을 그대로 보인다(호출 0, DB 읽기는 가짜).
import { readFileSync } from "node:fs";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

const ADMIN = "11111111-1111-4111-8111-111111111111";
const h = vi.hoisted(() => ({ detail: {} as Record<string, unknown> }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: "sb=1" }) }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); }, useRouter: () => ({ refresh() {} }) }));
vi.mock("@/lib/account/supabase", () => ({ createAccountPort: () => ({ currentUser: async () => ({ id: ADMIN, lastSignInAt: new Date().toISOString() }), finish: (r: unknown) => r }) }));
vi.mock("@/lib/ops/store", () => ({
  OPS_RPC_TIMEOUT_MS: 1000,
  createOpsStores: () => ({ db: { rpc: () => ({ abortSignal: async () => ({ data: h.detail, error: null }) }) }, generation: { call: async () => ({ ok: true, providers: {} }) }, order: { call: async () => ({ ok: true }) }, audit: async () => true }),
}));

import DetailPage from "@/app/admin/orders/[code]/page";
import { calcBasisLink, calcCheck, CALC_BASIS_TOPICS, githubAnchor, legacyCalcBook } from "@/lib/ops/admin/manse";

beforeEach(() => { vi.stubEnv("ADMIN_USER_IDS", ADMIN); });
afterEach(() => { vi.unstubAllEnvs(); });

const person = (birthDate: string, time: { birthTime?: string; slot?: string; unknown?: boolean }, gender: "MALE" | "FEMALE" | "" = "FEMALE") => ({
  name: "시험", birthDate, gender, mbtiType: "", calendarType: "solar", timezone: "Asia/Seoul",
  birthTime: time.birthTime ?? "", birthTimeUnknown: time.unknown === true, approximateBirthTimeSlot: time.slot ?? "",
  birthTimePrecision: time.unknown ? "unknown" : time.slot ? "approximate" : "exact",
});
const row = (c: ReturnType<typeof calcCheck>, label: string) => c.rows.find(r => r.label === label)?.value;

describe("calcCheck(엔진 값 그대로)", () => {
  it("회귀 표본 2000-05-11 17:05 양력 여성: UTC+9, −30분, 입하 절입, 역행 6일 3시간, 대운수 2, 보정 없으면 癸酉", () => {
    const c = calcCheck(person("2000-05-11", { birthTime: "17:05" }));
    expect(c.ok).toBe(true);
    expect(row(c, "입력값")).toBe("2000-05-11 양력 · 정확 · 17:05");
    expect(row(c, "시간대(tzdata)")).toBe("UTC+9 · 표준시(동경 135°)");
    expect(row(c, "태양시 보정")).toBe("−30분 (동경 127.5° 기준) · 시계 17:05 → 태양시 16:35 · 표 아래 문구 「태양시 기준 · 30분 보정 (17:05 → 16:35)」");
    expect(row(c, "절입")).toBe("이 달 절입 입하 2000-05-05 13:50 KST · 다음 절입 망종 2000-06-05 17:58 KST");
    expect(row(c, "대운 방향")).toMatch(/^역행 \(년간 庚\(경\) 양 · 여/);
    expect(row(c, "대운 시작 계산")).toBe("직전 절입 입하 2000-05-05 13:50 KST → 출생까지 6일 3시간 → 첫 대운 庚辰(경진) 시작 2002-05-27 23:05 KST(엔진 정밀 계산) → 대운수 2 = 그때의 만 나이");
    expect(row(c, "예전 책의 대운수")).toMatch(/^2 — 옛 셈법\(날수 ÷ 3\)/);
    expect(row(c, "대운 목록(새 책 표기)")).toMatch(/^경진 대운: 2002년 5월 무렵부터 \(대운수 2\) \/ 기묘 대운: 2012년 5월 무렵부터 \(대운수 12\)/);
    expect(row(c, "보정 없이 셌다면")).toBe("시계 시각 그대로면 시주 癸酉(계유) (지금 계산 시주 壬申(임신) · 다름)");
    expect(c.rows.find(r => r.label === "태양시 보정")?.topic).toBe("solar");
  });
  it("1987 여름(서머타임 UTC+10): 보정 −90분, 대략 라벨은 당시 시계 기준과 예전 라벨을 함께", () => {
    const exact = calcCheck(person("1987-07-15", { birthTime: "19:45" }, "MALE"));
    expect(row(exact, "시간대(tzdata)")).toBe("UTC+10 · 당시 서머타임");
    expect(row(exact, "태양시 보정")).toBe("−90분 (동경 127.5° 기준) · 시계 19:45 → 태양시 18:15 · 표 아래 문구 「태양시 기준 · 90분 보정 (19:45 → 18:15) · 당시 서머타임 반영」");
    // 서머타임 시작으로 없는 시각(1987-05-10 02:30): 엔진은 바뀌기 전(UTC+9)으로 읽는다 → 실제 태양시 02:00.
    const gap = calcCheck(person("1987-05-10", { birthTime: "02:30" }));
    expect(row(gap, "시간대(tzdata)")).toBe("UTC+9 · 표준시(동경 135°) · 서머타임 시작 등으로 없는 시각 → 바뀌기 전 기준으로 셈(그 순간 이후 UTC+10 · 당시 서머타임)");
    expect(row(gap, "태양시 보정")).toContain("시계 02:30 → 태양시 02:00");
    const approx = calcCheck(person("1987-07-15", { slot: "YUSI" }, "MALE"));
    expect(row(approx, "입력값")).toBe("1987-07-15 양력 · 대략 · 유시 18:30~20:29 (이 변경 전 입력 화면 라벨: 유시 17:30~19:29)");
    expect(row(approx, "태양시 보정")).toMatch(/^−90분 .* · 대략 시간대는 태양시 시진 그대로$/);
    expect(row(approx, "대운 시작 계산")).toMatch(/KST\(가운데 \d{4}-\d{2}-\d{2} \d{2}:\d{2}\)\(엔진 정밀 계산\) → 대운수 \d+ = 그때의 만 나이$/);
    expect(row(approx, "보정 없이 셌다면")).toBeUndefined();
  });
  it("UTC+8:30 시기(1957 겨울)는 보정 0분, 서머타임 1957 여름은 UTC+9:30", () => {
    expect(row(calcCheck(person("1957-01-10", { birthTime: "10:00" })), "시간대(tzdata)")).toBe("UTC+8:30 · 당시 표준시(동경 127.5°)");
    expect(row(calcCheck(person("1957-01-10", { birthTime: "10:00" })), "태양시 보정")).toMatch(/^0분 /);
    expect(row(calcCheck(person("1957-07-10", { birthTime: "10:00" })), "시간대(tzdata)")).toBe("UTC+9:30 · 당시 서머타임");
  });
  it("시간 모름: 시주·보정 없이 셈한 줄 없음, 설명서 6번 링크", () => {
    const c = calcCheck(person("1999-07-31", { unknown: true }, "MALE"));
    expect(c.ok).toBe(true);
    expect(row(c, "입력값")).toBe("1999-07-31 양력 · 모름(시주 만들지 않음)");
    expect(c.rows[0].topic).toBe("unknown");
    expect(row(c, "태양시 보정")).toMatch(/^시간 모름/);
    expect(row(c, "보정 없이 셌다면")).toBeUndefined();
  });
  it("성별 없음·입력 없음·잘못된 입력에서도 깨지지 않는다", () => {
    expect(row(calcCheck(person("1999-07-31", { birthTime: "08:27" }, "")), "대운")).toBe("성별이 없어 대운을 세지 않음");
    expect(calcCheck(null)).toEqual({ ok: false, reason: "입력 없음", rows: [] });
    expect(calcCheck({ name: "x" })).toEqual({ ok: false, reason: "생년월일 없음", rows: [] });
    expect(calcCheck({ birthDate: "1999-07-31", birthTime: "25:99" })).toMatchObject({ ok: false, reason: "계산 불가(입력 확인)" });
  });
  it("태양시 보정 전 계산판: 2026-10-27 KST까지 발행한 책", () => {
    expect(legacyCalcBook("2026-10-27T14:59:59.000Z")).toBe(true);
    expect(legacyCalcBook("2026-10-27T15:00:00.000Z")).toBe(false);
    expect([legacyCalcBook(null), legacyCalcBook(undefined), legacyCalcBook("x")]).toEqual([false, false, false]);
  });
  it("설명서 링크 앵커가 calc-basis.md 제목과 맞는다(깃허브 앵커 규칙)", () => {
    const md = readFileSync("docs/v5/ops/calc-basis.md", "utf8");
    const anchors = new Set([...md.matchAll(/^#{2,3} (.+)$/gm)].map(m => githubAnchor(m[1])));
    for (const heading of Object.values(CALC_BASIS_TOPICS)) expect(anchors.has(githubAnchor(heading)), heading).toBe(true);
    expect(calcBasisLink("solar")).toBe("https://github.com/Deokjjang/gyeol-report/blob/master/docs/v5/ops/calc-basis.md#1-태양시-보정--왜-30분을-빼나요");
    expect(githubAnchor(CALC_BASIS_TOPICS.dst)).toBe("7-옛-표준시서머타임-시기에-태어났을-때");
  });
});

/** 페이지 나무에서 이름으로 컴포넌트 요소를 찾는다(맨 위 AdminShell은 비동기 최근 동작 패널이 있어 통째로 그리지 않는다). */
function findElement(node: ReactNode, name: string): ReactElement | undefined {
  if (Array.isArray(node)) { for (const n of node) { const f = findElement(n, name); if (f) return f; } return; }
  if (!isValidElement(node)) return;
  if (typeof node.type === "function" && node.type.name === name) return node;
  return findElement((node.props as { children?: ReactNode }).children, name);
}
const detailOf = (input: unknown, publishedAt: string | null) => ({ ok: true, order: { orderCode: "GR-ABCD", paymentOrderId: "po", status: "paid", amount: 9900, reportId: "r1", userId: null, productType: "saju_mbti_compatibility" },
  input, book: publishedAt ? { status: "COMPLETED", publishedAt, productVersion: "v4" } : null, job: null, attempts: [], state: null, runs: [], versions: [], requests: [], refund: null, audit: [] });
async function inputHtml(input: unknown, publishedAt: string | null = null) {
  h.detail = detailOf(input, publishedAt);
  const page = await DetailPage({ params: Promise.resolve({ code: "GR-ABCD" }) });
  const section = findElement(page, "InputSection");
  expect(section).toBeTruthy();
  return renderToStaticMarkup(section!);
}

describe("주문 상세 페이지 「계산 검증」 칸", () => {
  it("궁합(대략 1987 여름 × 시간 모름), 보정 전 계산판 배지와 설명서 링크", async () => {
    const out = await inputHtml({ productKey: "saju_mbti_compatibility", relationshipType: "love", personA: person("1987-07-15", { slot: "YUSI" }, "MALE"), personB: person("1999-07-31", { unknown: true }) }, "2026-10-20T03:00:00.000Z");
    expect(out).toContain("계산 검증");
    expect(out).toContain("이 책은 태양시 보정 전 계산판");
    expect(out).toContain("대략 · 유시 18:30~20:29");
    expect(out).toContain("모름(시주 만들지 않음)");
    expect(out).toContain(`href="${calcBasisLink("legacy")}"`);
    // 이름 칸(입력값)·네 기둥·계산 검증에 두 사람(A·B)이 다 보인다.
    expect(out.match(/>(A|B)<\/p>/g)?.length).toBe(4);
    expect(out.match(/>(A|B) 이름</g)?.length).toBe(2);
  });
  it("정확 시각·새 계산판이면 배지 없음, 입력 없음·사람 칸 비어도 깨지지 않음", async () => {
    const out = await inputHtml({ productKey: "saju_mbti_full", person: person("2000-05-11", { birthTime: "17:05" }), userContext: {} }, "2026-11-01T03:00:00.000Z");
    expect(out).not.toContain("태양시 보정 전 계산판");
    expect(out).toContain("시계 시각 그대로면 시주 癸酉(계유)");
    expect(await inputHtml({ productKey: "saju_mbti_compatibility", personA: null, personB: { birthDate: "bad" } })).toContain("생년월일 없음");
    h.detail = detailOf(null, null);
    expect(await DetailPage({ params: Promise.resolve({ code: "GR-ABCD" }) })).toBeTruthy();
  });
});
