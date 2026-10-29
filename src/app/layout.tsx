import type { Metadata, Viewport } from "next";
import { bookExperiencePublicEnabled } from "../lib/book/publicGate";
import { BookFooterRoute } from "../components/book/BookRoutes";
import { Noto_Serif_KR } from "next/font/google";
import MetaPixel from "../components/analytics/MetaPixel";
import BusinessFooter from "../components/legal/BusinessFooter";
import {
  BRAND_DESCRIPTION,
  SHARE_IMAGE,
  SHARE_IMAGE_SIZE,
} from "../lib/sharing/reportShareMetadata";
import "./globals.css";

// 책 본문·제목 명조 1종(SIL OFL 1.1). 한글은 unicode-range 조각으로 필요한 글자만 받고, latin 조각만 미리 받는다.
// display optional: 첫 방문에 늦게 온 글꼴로 다시 그리며 생기는 LCP 지연·흔들림을 막는다(그 방문은 폴백 명조, 다음부터 웹 글꼴).
const serif = Noto_Serif_KR({
  variable: "--font-noto-serif",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "optional",
  fallback: ["AppleMyungjo", "Nanum Myeongjo", "Batang", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gyeolreport.com"),
  title: {
    default: "결리포트",
    template: "%s | 결리포트",
  },
  description: BRAND_DESCRIPTION,
  applicationName: "결리포트",
  // P5 아이콘(새 표지 디자인, 파일명에 버전). favicon.ico는 app/ 파일 규칙 그대로.
  icons: {
    icon: [{ url: "/brand/icon-v5.svg", type: "image/svg+xml" }, { url: "/brand/icon-192-v5.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/brand/apple-touch-icon-v5.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  keywords: [
    "결리포트",
    "사주",
    "MBTI",
    "자기이해",
    "명리학",
    "성향 분석",
  ],
  openGraph: {
    title: "결리포트",
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: SHARE_IMAGE,
        ...SHARE_IMAGE_SIZE,
        alt: "GYEOL REPORT",
      },
    ],
    url: "https://gyeolreport.com",
    siteName: "결리포트",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "결리포트",
    description: BRAND_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1916" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {bookExperiencePublicEnabled() ? <BookFooterRoute /> : <BusinessFooter />}
        <MetaPixel />
      </body>
    </html>
  );
}
