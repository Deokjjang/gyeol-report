import type { MetadataRoute } from "next";

// P5: 홈 화면 추가·Safari 제안용 매니페스트. 아이콘은 새 표지 디자인(파일명에 버전).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "결리포트",
    short_name: "결리포트",
    description: "사주와 MBTI로 쓰는 나에 관한 한 권",
    start_url: "/",
    display: "browser",
    background_color: "#f6f2e9",
    theme_color: "#f6f2e9",
    icons: [
      { src: "/brand/icon-192-v5.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512-v5.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-v5.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
