import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MetaSettingsLink from "../../../src/components/analytics/MetaSettingsLink";
import { META_CARD_SEEN_KEY, META_CONSENT_VERSION } from "../../../src/lib/analytics/metaConsent";

const read = (path: string) => readFileSync(path, "utf8");

describe("Meta consent card (mobile visible, once, footer settings)", () => {
  it("is no longer hidden on small screens and sits above the Book page navigation", () => {
    const css = read("src/components/analytics/metaConsent.module.css");
    expect(css).not.toMatch(/max-width:\s*768px/);
    expect(css).not.toContain("display: none");
    // .pageNav is 54px + safe area at the bottom of the Book.
    expect(css).toMatch(/\.root \{[^}]*bottom: calc\(66px \+ env\(safe-area-inset-bottom, 0px\)\)/);
  });

  it("shows the first-visit card once per consent version and drops the floating settings button", () => {
    const source = read("src/components/analytics/MetaPixel.tsx");
    expect(META_CARD_SEEN_KEY).toContain(META_CONSENT_VERSION);
    expect(source).toContain("result.choice === null && result.ready === true && !cardSeen()");
    expect(source).toContain("if (firstVisit) markCardSeen();");
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
