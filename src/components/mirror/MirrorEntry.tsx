"use client";
/** "/" 자리의 「남이 본 나」 입구(공개 관문이 열려 있을 때만 그려진다). 화면 본체 · 스타일 · three는 그릴 때만 따로 받아 온다 — 책 · 결제 화면 번들에는 들어가지 않는다. */
import dynamic from "next/dynamic";

const MirrorApp = dynamic(() => import("./MirrorApp"), { ssr: false, loading: () => <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#000" }} /> });
export function MirrorEntry() { return <MirrorApp />; }
