import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BusinessFooter from "../components/legal/BusinessFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gyeolreport.com"),
  title: {
    default: "결리포트",
    template: "%s | 결리포트",
  },
  description:
    "사주 구조와 MBTI 자기인식을 함께 살펴보는 자기이해 리포트.",
  applicationName: "결리포트",
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
    description:
      "사주 구조와 MBTI 자기인식을 함께 살펴보는 자기이해 리포트.",
    url: "https://gyeolreport.com",
    siteName: "결리포트",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "결리포트",
    description:
      "사주 구조와 MBTI 자기인식을 함께 살펴보는 자기이해 리포트.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BusinessFooter />
      </body>
    </html>
  );
}
