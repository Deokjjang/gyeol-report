"use client";
/** 새 내 계정(/me) 입구: 브라우저에서만 그린다(로그인 상태 · 서재 묶음). three는 쓰지 않는다. */
import dynamic from "next/dynamic";

const MeApp = dynamic(() => import("./MeApp"), { ssr: false, loading: () => <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#000" }} /> });
export function MeEntry(props: { appPath: "/" | "/start"; ticketShop: boolean }) { return <MeApp {...props} />; }
