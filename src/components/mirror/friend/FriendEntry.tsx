"use client";
/** /@아이디 랜딩 입구: 친구 응답 화면은 브라우저에서만 그린다(기기 토큰 · 이어서 하기). three는 쓰지 않는다(가벼운 2D 별자리). */
import dynamic from "next/dynamic";
import type { ConstellationShape } from "../../../lib/mirror/constellation";

const FriendApp = dynamic(() => import("./FriendApp"), { ssr: false, loading: () => <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#000" }} /> });
/** appPath: 「나도 해 보기」 · 「친구에게 물어보기」가 가는 이 서비스 시작 주소(정식 공개 뒤 "/", 그 전 "/start" — 서버가 관문으로 정한다). */
export function FriendEntry(props: { handle: string; name: string; line: string | null; shape: ConstellationShape | null; appPath: "/" | "/start" }) { return <FriendApp {...props} />; }
