import { describe, expect, it } from "vitest";
import { classify, DEFAULT_TARGETS, parseArgs, visibleText } from "../../../scripts/verify-books-readonly";

const page = (body: string) => `<!DOCTYPE html><html><head><title>결리포트</title><script>self.__next_f.push([1,"x"])</script></head><body>${body}</body></html>`;
const longText = "사주와 MBTI로 보는 나의 이야기. ".repeat(6);
const home = DEFAULT_TARGETS[0];
const robots = DEFAULT_TARGETS.find((t) => t.path === "/robots.txt")!;

describe("verify-books-readonly public page check (no network)", () => {
  it("uses public pages only, no share token", () => {
    expect(DEFAULT_TARGETS.map((t) => t.path)).toEqual(["/", "/products", "/products/saju-mbti-full", "/campaign/gyeol-opening-2026", "/sitemap.xml", "/robots.txt"]);
    expect(DEFAULT_TARGETS.some((t) => t.path.startsWith("/r/"))).toBe(false);
    expect(parseArgs(["--base", "https://example.test", "--path", "/legal"]).targets.at(-1)).toMatchObject({ path: "/legal" });
    expect(() => parseArgs(["https://gyeolreport.com/r/gr_x"])).toThrow();
  });

  it("passes a 200 page with text and ignores head/script text", () => {
    expect(visibleText(page("<p>가 나</p>"))).toBe("가 나");
    expect(classify(home, page(`<main><h1>결리포트</h1><p>${longText}</p></main>`), 200).result).toBe("PASS");
  });

  it("fails 5xx, non-200, empty and Next.js error pages", () => {
    expect(classify(home, page(`<p>${longText}</p>`), 500).result).toBe("FAIL");
    expect(classify(home, page(`<p>${longText}</p>`), 404).result).toBe("FAIL");
    expect(classify(home, "", 200).result).toBe("FAIL");
    expect(classify(home, page(`<h2>Application error: a server-side exception has occurred</h2><p>${longText}</p>`), 200).result).toBe("FAIL");
    expect(classify(home, `<html id="__next_error__"><body>${longText}</body></html>`, 200).result).toBe("FAIL");
    expect(classify(home, page(`<p>${longText}</p><script>self.__next_f.push([1,"{\\"digest\\":\\"123\\"}"])</script>`), 200).result).toBe("FAIL");
  });

  it("treats a missing sitemap/robots as WARN but a server error as FAIL", () => {
    expect(classify(robots, "", 404).result).toBe("WARN");
    expect(classify(robots, "User-agent: *\nAllow: /\n", 200).result).toBe("PASS");
    expect(classify(robots, "", 502).result).toBe("FAIL");
  });
});
