import { randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { metaOrigin } from "../../../../../lib/analytics/metaConsent";
import { metaDeliveryReady, metaRequestConsent } from "../../../../../lib/analytics/metaDelivery";

// The SDK can only see this constant, empty document. Opaque sandbox origin
// prevents it from reading the parent's URL, DOM, auth cookies or report inputs.
export async function GET(request: NextRequest) {
  if (!metaOrigin(new URL(request.url).origin) || !metaDeliveryReady() ||
    await metaRequestConsent(request) !== true || new URL(request.url).search) return new Response(null, { status: 404 });
  const nonce = randomBytes(16).toString("base64");
  return new Response(`<!doctype html><html><head><meta name="referrer" content="no-referrer"><title>광고 성과 측정</title></head><body><script nonce="${nonce}">
  (() => {
    const pixel='1912751453433745', seen=new Set();
    const fbq=window.fbq=function(){fbq.callMethod?fbq.callMethod.apply(fbq,arguments):fbq.queue.push(arguments)};
    fbq.queue=[];fbq.loaded=true;fbq.version='2.0';window._fbq=fbq;
    fbq('set','autoConfig',false,pixel);fbq('consent','grant');fbq('init',pixel);
    addEventListener('message',e=>{
      if(e.source!==parent||!['https://www.gyeolreport.com','https://gyeolreport.com'].includes(e.origin))return;
      const d=e.data;if(!d||d.type!=='gyeol:pixel'||!d.event||!d.eventId||typeof d.eventId!=='string'||!/^([a-f0-9-]{36}|(registration|purchase)_[a-f0-9]{32})$/.test(d.eventId)||seen.has(d.eventId))return;
      if(!['PageView','ViewContent','InitiateCheckout','CompleteRegistration','Purchase'].includes(d.event))return;
      const p=d.params||{},allowed=['content_ids','content_type','num_items','value','currency'];
      if(Object.keys(p).some(k=>!allowed.includes(k)))return;
      if(['ViewContent','InitiateCheckout','Purchase'].includes(d.event)&&(!Array.isArray(p.content_ids)||p.content_ids.length!==1||!['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune'].includes(p.content_ids[0])||p.content_type!=='product'||!Number.isSafeInteger(p.value)||p.value<=0||p.currency!=='KRW'||(p.num_items!==undefined&&p.num_items!==1)))return;
      if(d.event==='PageView'&&Object.keys(p).length)return;
      if(d.event==='CompleteRegistration'&&(!d.eventId.startsWith('registration_')||Object.keys(p).length))return;
      if(d.event==='Purchase'&&(!d.eventId.startsWith('purchase_')||!(p.value>0)||p.currency!=='KRW'))return;
      if(seen.size>=100)return;seen.add(d.eventId);fbq('trackSingle',pixel,d.event,p,{eventID:d.eventId});
    });
    const s=document.createElement('script');s.async=true;s.referrerPolicy='no-referrer';s.src='https://connect.facebook.net/en_US/fbevents.js';
    s.onload=()=>parent.postMessage({type:'gyeol:pixel-ready'},'*');document.head.appendChild(s);
  })();</script></body></html>`, { headers: {
    "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store", "referrer-policy": "no-referrer",
    "content-security-policy": `default-src 'none'; script-src 'nonce-${nonce}' https://connect.facebook.net; connect-src https://www.facebook.com https://connect.facebook.net; img-src https://www.facebook.com; sandbox allow-scripts; frame-ancestors 'self'; base-uri 'none'; form-action 'none'`,
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
  } });
}
