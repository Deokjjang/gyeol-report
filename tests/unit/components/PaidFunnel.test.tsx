import { readFileSync } from "node:fs";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NewReportPage from "../../../src/app/report/new/page";
import Launcher from "../../../src/components/payment/DevTossCheckoutLauncher";
import { getReportProduct } from "../../../src/lib/payment/reportProductCatalog";
import { prePaymentRefundNoticeKo } from "../../../src/lib/legal/refundPolicy";

// A deterministic hook harness exercises the existing event handlers without a browser or providers.
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], cursor: 0, product: "saju-mbti-full" }));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  use: () => ({ product: hooks.product }),
  useId: () => "checkout-notice",
  useState: (initial: unknown) => {
    const index = hooks.cursor++;
    if (!(index in hooks.slots)) hooks.slots[index] = typeof initial === "function" ? initial() : initial;
    return [hooks.slots[index], (next: unknown) => {
      hooks.slots[index] = typeof next === "function" ? next(hooks.slots[index]) : next;
    }];
  },
}));

type Props = Record<string, unknown> & { children?: ReactNode };
function elements(node: ReactNode): ReactElement<Props>[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<Props>(node)) return [];
  return [node, ...elements(node.props.children)];
}
function page() {
  hooks.cursor = 0;
  return NewReportPage({});
}
function checkout() {
  const tree = page();
  const entry = elements(tree).find((element) => element.type === Launcher)!;
  return { entry, tree: Launcher(entry.props as Parameters<typeof Launcher>[0]) };
}
function input(name: string) {
  return elements(page()).find((element) => element.props.name === name)!;
}
function change(name: string, value: string, checked = false) {
  const field = input(name);
  expect(field).toBeDefined();
  (field.props.onChange as (event: unknown) => void)({ target: { value, checked } });
}
function paymentButton() {
  return elements(checkout().tree).find((element) => element.type === "button" && element.props["aria-describedby"] === "checkout-notice")!;
}
function agreeAll() {
  const checks = elements(checkout().tree).filter((element) => typeof element.props.labelKo === "string" && "checked" in element.props);
  for (const check of checks) (check.props.onChange as (checked: boolean) => void)(true);
  return checks.length;
}
function complete() {
  if (hooks.product === "compatibility") {
    change("personAName", "사람 하나"); change("personABirthDate", "1999-07-31");
    change("personBName", "사람 둘"); change("personBBirthDate", "2000-02-03");
  } else {
    change("name", "검증 이름"); change("birthDate", "1999-07-31");
  }
}
const products = [
  ["saju-mbti-full", "saju_mbti_full"], ["career-money-study", "career_money_study"],
  ["love-marriage-child", "love_marriage_child"], ["compatibility", "saju_mbti_compatibility"],
  ["major-fortune", "major_fortune"], ["annual-fortune", "annual_fortune"],
] as const;

beforeEach(() => { hooks.slots = []; hooks.cursor = 0; hooks.product = "saju-mbti-full"; });

describe("paid funnel contracts and progressive review", () => {
  it.each(products)("%s preserves product, catalog price, required fields and five separate consents", (slug, type) => {
    hooks.product = slug;
    expect(getReportProduct(type)?.amount).toBe(1290);
    expect(checkout().entry.props.productType).toBe(type);
    expect(paymentButton().props.disabled).toBe(true);
    expect(elements(checkout().tree).find((el) => "hidden" in el.props)?.props.hidden).toBe(true);
    const required = elements(page()).filter((el) => el.props["aria-required"] === "true").map((el) => el.props.name);
    expect(required).toEqual(slug === "compatibility"
      ? ["personAName", "personABirthDate", "personBName", "personBBirthDate", "relationshipType"]
      : ["name", "birthDate", ...(slug === "annual-fortune" ? ["selectedYear"] : [])]);
    complete();
    expect(elements(checkout().tree).find((el) => "hidden" in el.props)?.props.hidden).toBe(false);
    expect(paymentButton().props.disabled).toBe(true);
    expect(agreeAll()).toBe(5);
    expect(paymentButton().props.disabled).toBe(false);
    // Every consent still independently gates payment.
    for (let index = 0; index < 5; index++) {
      const checks = elements(checkout().tree).filter((el) => typeof el.props.labelKo === "string" && "checked" in el.props);
      (checks[index].props.onChange as (value: boolean) => void)(false);
      expect(paymentButton().props.disabled).toBe(true);
      (checks[index].props.onChange as (value: boolean) => void)(true);
    }
    const name = slug === "compatibility" ? "personBName" : "name";
    change(name, "");
    expect(paymentButton().props.disabled).toBe(true);
    expect(elements(checkout().tree).find((el) => "hidden" in el.props)?.props.hidden).toBe(true);
    change(name, "수정 이름");
    expect(paymentButton().props.disabled).toBe(false); // Mounted consent state survives edits.
  });

  it.each(["saju-mbti-full", "compatibility"])("%s preserves exact / approximate / unknown behavior and payload", (slug) => {
    hooks.product = slug; complete();
    const name = (field: string) => slug === "compatibility" ? `personA${field[0].toUpperCase()}${field.slice(1)}` : field;
    change(name("birthTime"), "08:30");
    change(name("timeBranch"), "JINSI");
    let snapshot = checkout().entry.props.inputSnapshot as { reportInputPayload: { person?: Record<string, unknown>; personA?: Record<string, unknown> } };
    expect(snapshot.reportInputPayload.person ?? snapshot.reportInputPayload.personA).toMatchObject({ birthTime: "08:30", approximateBirthTimeSlot: "JINSI", birthTimeUnknown: false });
    change(name("birthTimeUnknown"), "", true);
    expect(input(name("birthTime")).props.value).toBe("");
    expect(input(name("timeBranch")).props.value).toBe("");
    change(name("timeBranch"), "MYOSI");
    expect(input(name("birthTimeUnknown")).props.checked).toBe(false);
    snapshot = checkout().entry.props.inputSnapshot as typeof snapshot;
    expect(snapshot.reportInputPayload.person ?? snapshot.reportInputPayload.personA).toMatchObject({ birthTime: "", approximateBirthTimeSlot: "MYOSI", birthTimeUnknown: false });
    expect(JSON.stringify(checkout().entry.props.reviewGroups)).toContain("묘시");
  });

  it("keeps all seven compatibility relationships and distinct A/B review values", () => {
    hooks.product = "compatibility"; complete();
    const choices = elements(input("relationshipType")).filter((el) => el.type === "option");
    expect(choices.map((el) => el.props.value)).toEqual(["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"]);
    change("relationshipType", "businessPartner");
    const review = JSON.stringify(checkout().entry.props.reviewGroups);
    for (const text of ["사람 A", "사람 B", "사람 하나", "사람 둘", "2000-02-03", "사업·협업"]) expect(review).toContain(text);
  });

  it("keeps annual year and optional context in the original payload", () => {
    hooks.product = "annual-fortune"; complete(); agreeAll();
    change("selectedYear", ""); expect(paymentButton().props.disabled).toBe(true);
    change("selectedYear", "2026");
    change("jobStatus", "student"); change("relationshipStatus", "single"); change("detailedJob", "대학생");
    const snapshot = checkout().entry.props.inputSnapshot as { reportInputPayload: unknown };
    expect(snapshot.reportInputPayload).toMatchObject({ productOptions: { selectedYear: "2026" }, userContext: { jobStatus: "student", relationshipStatus: "single", detailJob: "대학생", focusAreas: [] } });
    expect(JSON.stringify(checkout().entry.props.reviewGroups)).toContain("2026");
    expect(paymentButton().props.disabled).toBe(false);
  });

  it("keeps under-14 blocking and the additional minor confirmation", () => {
    complete(); const year = new Date().getUTCFullYear();
    change("birthDate", `${year - 16}-01-01`);
    const checks = elements(checkout().tree).filter((el) => typeof el.props.labelKo === "string" && "checked" in el.props);
    expect(checks).toHaveLength(6);
    for (const check of checks.slice(0, 5)) (check.props.onChange as (v: boolean) => void)(true);
    expect(paymentButton().props.disabled).toBe(true);
    (checks[5].props.onChange as (v: boolean) => void)(true);
    expect(paymentButton().props.disabled).toBe(false);
    change("birthDate", `${year - 10}-01-01`); agreeAll();
    expect(paymentButton().props.disabled).toBe(true);
  });

  it("keeps canonical disclosures, policy links, accessible groups and reduced motion", () => {
    complete(); const tree = elements(checkout().tree);
    expect(tree.some((el) => el.props.children === prePaymentRefundNoticeKo)).toBe(true);
    expect(tree.filter((el) => el.type === "a").map((el) => el.props.href)).toEqual(["/refund", "/terms", "/privacy", "/refund", "/business"]);
    expect(tree.some((el) => el.type === "fieldset")).toBe(true);
    const text = JSON.stringify(tree.map((el) => typeof el.props.children === "string" ? el.props.children : ""));
    for (const term of ["최대 24시간", "90일", "만 14세", "만 19세", "사람 상담 아님"]) expect(text).toContain(term);
    const css = readFileSync("src/components/payment/paidFunnel.module.css", "utf8");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(":focus-visible");
    expect(css).not.toContain("transition: all");
  });
});
