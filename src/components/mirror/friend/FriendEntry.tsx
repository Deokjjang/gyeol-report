"use client";
/** /@아이디 랜딩 입구: 친구 응답 화면은 브라우저에서만 그린다(기기 토큰 · 이어서 하기). three는 쓰지 않는다(가벼운 2D 별자리). */
import dynamic from "next/dynamic";
import type { ConstellationShape } from "../../../lib/mirror/constellation";

const FriendApp = dynamic(() => import("./FriendApp"), { ssr: false, loading: () => <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#000" }} /> });
export function FriendEntry(props: { handle: string; name: string; line: string | null; shape: ConstellationShape | null }) { return <FriendApp {...props} />; }
