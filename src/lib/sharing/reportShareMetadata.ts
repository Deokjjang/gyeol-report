import type { Metadata } from "next";

export const SHARE_ORIGIN = "https://gyeolreport.com";
export const SHARE_IMAGE = `${SHARE_ORIGIN}/brand/gyeol-report-og.png`;
export const SHARE_TOKEN_PATTERN = /^gr_[A-Za-z0-9_-]{32}$/;
export const BRAND_DESCRIPTION = "타고난 성격과 삶의 흐름을 읽고, 나만의 결을 발견해 더 나은 선택과 미래를 설계합니다.";

const products = {
  "saju-mbti-full": ["종합 리포트", BRAND_DESCRIPTION],
  "career-money-study": ["직업·재물·학업 리포트", "일하고 배우며 쌓아가는 나의 결. 타고난 강점과 선택의 기준을 발견합니다."],
  "love-marriage-child": ["연애·결혼·자녀 리포트", "사랑하고 관계 맺는 나의 결. 소중한 사람과 함께할 내일을 그려봅니다."],
  compatibility: ["궁합 리포트", "서로 다른 두 사람의 결을 읽고, 더 깊이 이해하며 함께할 방향을 찾아봅니다."],
  "major-fortune": ["대운 리포트", "삶의 큰 흐름 속 나의 결을 읽고, 다가올 시간을 위한 선택의 기준을 세웁니다."],
  "annual-fortune": ["세운 리포트", "올해의 흐름과 나의 결을 살펴보고, 하루하루의 선택과 내일을 설계합니다."],
} as const;

export type ReportShareDescription = { title: string; description: string; productSlug: string };
export type ReportShareData = ReportShareDescription & { url: string };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function sanitizeShareName(value: unknown): string {
  if (typeof value !== "string") return "";
  // Names only: strip markup, controls and bidi overrides; React escapes metadata attributes.
  const plain = value.slice(0, 500).normalize("NFC").replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{M}\p{N} .·'-]/gu, "").replace(/\s+/g, " ").trim();
  return Array.from(plain).slice(0, 20).join("");
}

export function describeReportShare(snapshot: unknown): ReportShareDescription {
  const data = record(snapshot);
  const draft = record(data.draft);
  const evidence = record(data.evidencePacket);
  const productSlug = typeof data.productSlug === "string" && Object.hasOwn(products, data.productSlug)
    ? data.productSlug as keyof typeof products : "saju-mbti-full";
  const name = sanitizeShareName(draft.personLabel ?? draft.personALabel ??
    record(record(draft.people).personA).name ?? evidence.personLabel ?? record(evidence.personContext).name);
  const [product, description] = products[productSlug];
  return { title: name ? `${name}님의 ${product}` : `나의 ${product}`, description, productSlug };
}

export function shareUrl(token: string): string {
  return `${SHARE_ORIGIN}/r/${token}`;
}

export function reportShareMetadata(data?: ReportShareData | null): Metadata {
  const title = data?.title ?? "결리포트";
  const description = data?.description ?? BRAND_DESCRIPTION;
  return {
    title: { absolute: title }, description, referrer: "no-referrer",
    robots: { index: false, follow: false, nocache: true, noarchive: true },
    ...(data ? { alternates: { canonical: data.url } } : {}),
    openGraph: {
      title, description, ...(data ? { url: data.url } : {}), type: "website",
      siteName: "결리포트", locale: "ko_KR",
      images: [{ url: SHARE_IMAGE, width: 1536, height: 1024, alt: "GYEOL REPORT" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}
