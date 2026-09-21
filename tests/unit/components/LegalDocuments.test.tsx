import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Terms from "../../../src/app/terms/page";
import Privacy from "../../../src/app/privacy/page";
import Refund from "../../../src/app/refund/page";
import Business from "../../../src/app/business/page";
import LegacyTerms from "../../../src/app/legal/terms/page";
import LegacyPrivacy from "../../../src/app/legal/privacy/page";
import LegacyRefund from "../../../src/app/legal/refund/page";
import LegacyBusiness from "../../../src/app/legal/business-info/page";
import Footer from "../../../src/components/legal/BusinessFooter";
import { GYEOL_BUSINESS_INFO as business } from "../../../src/lib/legal/businessInfo";
import { termsPolicySections } from "../../../src/lib/legal/termsPolicy";
import * as privacy from "../../../src/lib/legal/privacyPolicy";
import { refundPolicyStateRows, refundPolicyRequiredNotices, refundPolicySupportRequestGuidanceKo } from "../../../src/lib/legal/refundPolicy";

const pages = [["/terms", Terms, LegacyTerms], ["/privacy", Privacy, LegacyPrivacy],
  ["/refund", Refund, LegacyRefund], ["/business", Business, LegacyBusiness]] as const;
const text = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

describe("legal document rendering", () => {
  it.each(pages)("%s preserves aliases, one main/H1 and current-page navigation", (path, Page, Legacy) => {
    const html = renderToStaticMarkup(<Page />);
    expect(Legacy).toBe(Page);
    expect(html.match(/<main\b/g)).toHaveLength(1);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<h[3-6]\b|<footer\b/);
    expect(html).toContain(`href="${path}" aria-current="page"`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    for (const href of ["/terms", "/privacy", "/refund", "/business", "/"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).not.toContain("rounded-2xl");
    expect(html).not.toContain("확정 즉시 업데이트");
  });

  it("renders every terms clause and links to canonical details", () => {
    const html = renderToStaticMarkup(<Terms />);
    for (const section of termsPolicySections) {
      expect(html).toContain(`<h2>${section.titleKo}</h2>`);
      for (const paragraph of section.bodyKo) expect(text(html)).toContain(paragraph);
    }
    for (const condition of ["상품별 1,290원", "최대 24시간 이내 제공", "생성일로부터 90일", "만 19세 미만", "만 14세 미만", "고의 또는 중대한 과실", "7일 이내"]) {
      expect(text(html)).toContain(condition);
    }
    expect(html).not.toContain(business.businessAddressKo);
    expect(html).not.toContain("parentChild");
  });

  it("renders all ten refund states exactly once without duplicating the product catalog", () => {
    const html = renderToStaticMarkup(<Refund />);
    for (const row of refundPolicyStateRows) {
      expect(text(html).split(row.handlingKo)).toHaveLength(2);
      expect(text(html)).toContain(row.statusKo);
    }
    expect(text(html)).toContain(refundPolicyRequiredNotices[3]);
    expect(text(html)).toContain(refundPolicySupportRequestGuidanceKo);
    expect(html).toContain('href="/terms"');
    expect(html).not.toContain("판매 상품");
    expect(html).toContain('<th scope="row">');
  });

  it("preserves all privacy items, retention exceptions, overseas scope and rights", () => {
    const html = renderToStaticMarkup(<Privacy />);
    const content = text(html);
    for (const item of [...privacy.privacyPolicyCollectionItems, ...privacy.privacyPolicyPurposeItems,
      privacy.privacyPolicyServiceRetentionKo, privacy.privacyPolicyLegalRetentionKo,
      privacy.privacyPolicyOverseasProcessingKo, privacy.privacyPolicyUnder14Ko,
      privacy.privacyPolicyMinorNoticeKo, privacy.privacyPolicySensitiveInfoLimitKo,
      privacy.privacyPolicyNoResidentRegistrationNumberKo, privacy.privacyPolicyUserRightsKo]) {
      expect(content).toContain(item);
    }
    for (const row of privacy.privacyPolicyRetentionRows) {
      expect(content).toContain(row.categoryKo);
      expect(content).toContain(row.periodKo);
    }
    for (const row of privacy.privacyPolicyExternalServiceRows) {
      expect(content).toContain(row.providerKo === "호스팅 제공자" ? business.hostingProvider : row.providerKo);
      expect(content).toContain(row.purposeKo);
    }
    expect(content).toContain("카드번호 등 결제수단 상세 정보를 직접 저장하지 않습니다.");
    expect(html.match(/<table\b/g)).toHaveLength(2);
    expect(html.match(/<h2\b/g)).toHaveLength(11);
    expect(html).not.toContain("deterministic");
  });

  it("synchronizes business details and actionable contacts across every relevant surface", () => {
    for (const Page of [Business, Privacy, Refund, Footer]) {
      const html = renderToStaticMarkup(<Page />);
      expect(html).toContain('href="tel:050-6664-8562"');
      expect(html).toContain('href="mailto:support@dvem.ai"');
    }
    for (const Page of [Business, Footer]) {
      const html = renderToStaticMarkup(<Page />);
      for (const value of [business.businessName, business.representativeKo, business.businessRegistrationNumber,
        business.businessAddressKo, "2026-인천연수구-2118"]) expect(html).toContain(value);
    }
    const footer = renderToStaticMarkup(<Footer />);
    expect(footer).not.toContain("<dl");
    expect(footer).not.toContain("<details");
    expect(footer.match(/href="\/(terms|privacy|refund|business)"/g)).toHaveLength(4);
    expect(renderToStaticMarkup(<Business />)).toContain(business.hostingProvider);
  });

  it("has no obsolete business values anywhere in user-facing source", () => {
    function checkDirectory(directory: string) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) checkDirectory(path);
        else if (/\.(tsx?|css|json)$/.test(entry.name)) {
          const source = readFileSync(path, "utf8");
          expect(source, path).not.toContain("010" + "-3156-8568");
          expect(source, path).not.toContain("신고 진행" + " 중");
        }
      }
    }
    checkDirectory(join(process.cwd(), "src"));
  });

  it("provides scoped focus, wrapping, reduced-motion and readable document styles", () => {
    const css = readFileSync("src/components/legal/legal.module.css", "utf8");
    for (const marker of [":focus-visible", "prefers-reduced-motion", "overflow-wrap: anywhere", "font-size: 16px", "min-height: 44px"]) expect(css).toContain(marker);
    expect(css).not.toMatch(/transition:\s*all|animation:/);
  });
});
