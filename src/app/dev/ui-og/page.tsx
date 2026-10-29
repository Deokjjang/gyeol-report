import { notFound } from "next/navigation";
import { OgComposition } from "./OgComposition";

export const metadata = { title: "OG", robots: { index: false, follow: false } };

// P5 공유 이미지(1200×630) 원본: 실제 표지 컴포넌트와 명조로 그린 뒤 tools/p5/og.mts가 캡처한다. 개발 서버에서만.
export default function UiOgPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <OgComposition />;
}
