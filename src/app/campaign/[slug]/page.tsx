import { redirect } from "next/navigation";
import { campaignUtm } from "../../../lib/growth/model";
export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false},referrer:"no-referrer" as const};
/**
 * 운영 Q 10부: 오픈 이벤트(공식 주소 /campaign/gyeol-opening-2026)는 11월 1일에 끝났다. 옛 이벤트 주소는 모두 캠페인 랜딩(/free)으로 보낸다(307, 임시 — F 2026-11-11).
 * /free는 지금 진행 중인 캠페인(가입하면 내 책 한 권 무료)을 보여 주고, 끝났으면 일반 소개 + 상품 보기. 광고 유입 표시(허용된 utm_* 값)만 그대로 넘긴다.
 * next.config.ts의 redirects는 쓰지 않는다(v4 검증 기록이 그 파일의 바이트를 고정). 상태 JSON(/campaign/[slug]/state)은 그대로 둔다.
 */
export default async function Page({searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const query=new URLSearchParams(campaignUtm(await searchParams)).toString();
  redirect(query?`/free?${query}`:"/free");
}
