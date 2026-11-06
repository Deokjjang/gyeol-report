import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MetaSettingsLink from "../../../src/components/analytics/MetaSettingsLink";
import { META_CARD_SEEN_KEY, META_CONSENT_VERSION } from "../../../src/lib/analytics/metaConsent";

const read = (path: string) => readFileSync(path, "utf8");

describe("Meta consent card (mobile visible, once, footer settings)", () => {
  it("is visible on small screens and sits in the page flow, never over a button, field or page navigation", () => {
    const css = read("src/components/analytics/metaConsent.module.css");
    expect(css).not.toMatch(/max-width:\s*768px/);
    expect(css).not.toContain("display: none");
    expect(css).toMatch(/\.root \{[^}]*order: -1/);
    expect(css).not.toMatch(/\.root \{[^}]*position: fixed/);
    // Fixed-height Book screens subtract the card so the page navigation stays inside the viewport.
    expect(read("src/app/dev/book-preview/book.module.css")).toContain("var(--meta-card-h, 0px)");
  });

  it("shows the first-visit card once per consent version and drops the floating settings button", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    expect(META_CARD_SEEN_KEY).toContain(META_CONSENT_VERSION);
    expect(source).toContain("result.choice === null && result.ready === true && !cardSeen()");
    expect(source).toContain("if (firstVisit || result.choice !== null) markCardSeen();");
    // Closing counts as declining and is remembered in localStorage and a 1-year cookie.
    expect(source).toContain("const dismiss = (withChoice: boolean) => { markCardSeen(); setCard(false); setOpen(false); if (withChoice) void choose(false); };");
    expect(source).toContain("onClick={() => dismiss(true)}>닫기");
    expect(source).toContain("SEEN_MAX_AGE = 60 * 60 * 24 * 365");
    expect(source).not.toContain("광고 측정 설정{choice");
    expect(source).not.toContain("styles.settings");
  });

  it("loads the Pixel only after consent", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    expect(source).toContain('{!bundleCallback && choice === true && ready && <iframe ref={frame} src="/api/analytics/meta/pixel"');
    expect(source.match(/\/api\/analytics\/meta\/pixel/g)).toHaveLength(1);
  });

  it("offers a footer '광고 설정' link in both footers, rendered only where the panel can open", () => {
    expect(renderToStaticMarkup(<MetaSettingsLink />)).toBe("");
    expect(read("src/components/analytics/MetaSettingsLink.tsx")).toContain(">광고 설정</button>");
    expect(read("src/components/legal/BusinessFooter.tsx")).toContain("<MetaSettingsLink />");
    expect(read("src/app/dev/book-preview/BookPages.tsx")).toContain("<MetaSettingsLink /></nav>");
  });
});
