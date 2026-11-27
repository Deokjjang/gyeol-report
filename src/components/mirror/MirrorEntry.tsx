"use client";
/** 「남이 본 나」 입구("/" — 정식 공개 · "/start" — 숨은 공개, 관문이 열려 있을 때만 그려진다). 화면 본체 · 스타일 · three는 그릴 때만 따로 받아 온다 — 책 · 결제 화면 번들에는 들어가지 않는다. */
import dynamic from "next/dynamic";

const MirrorApp = dynamic(() => import("./MirrorApp"), { ssr: false, loading: () => <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#000" }} /> });
/** appPath: 이 서비스의 시작 주소("/" 정식 공개 · "/start" 숨은 공개). 로그인 뒤 돌아올 곳 · 주소 정리에 쓴다. */
export function MirrorEntry({ appPath = "/" }: { appPath?: "/" | "/start" }) { return <MirrorApp appPath={appPath} />; }
