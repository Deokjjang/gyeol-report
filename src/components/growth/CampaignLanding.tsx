"use client";
import { useEffect, useRef, useState } from "react";
import { BOOKS } from "../../lib/book/product";
import { campaignEvent,campaignOffer,type CampaignPresentation } from "../../lib/growth/model";
import s from "./campaign.module.css";
export function CampaignLanding({campaign,utm,member=false,local=false}:{campaign:CampaignPresentation;utm:Record<string,string>;member?:boolean;local?:boolean}) {
  const home=local?"/dev/book-flow":"/",busyRef=useRef(false),viewEvent=useRef("");
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[available,setAvailable]=useState(campaign.active);
  useEffect(()=>{if(!viewEvent.current){viewEvent.current=crypto.randomUUID();campaignEvent("campaign_landing_opened",campaign.slug,local,viewEvent.current);}},[campaign.slug,local]);
  async function begin(){
    if(busyRef.current)return;busyRef.current=true;setBusy(true);setError("");
    const eventId=crypto.randomUUID();campaignEvent("campaign_cta_clicked",campaign.slug,local,eventId);
    try {
      const r=await fetch(local?"/dev/campaign/entry":"/api/campaign-entry",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({slug:campaign.slug,utm})});
      if(!r.ok){setError("참여 상태를 확인하지 못했습니다. 다시 시도해 주세요.");return;}
      const result=await r.json();
      if(result.unavailable){setAvailable(false);return;}
      const login=local?"/dev/account?view=login":"/login";
      if(result.next===login)campaignEvent("campaign_signup_started",campaign.slug,local,eventId);
      window.location.assign([login,home].includes(result.next)?result.next:home);
    }catch{setError("연결을 확인한 뒤 다시 시도해 주세요.");}finally{busyRef.current=false;setBusy(false);}
  }
  const date=(value:string)=>new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(value));
  return <main className={s.root} data-campaign-landing><header className={s.header}><a href={home}>결리포트<small>GYEOL REPORT</small></a><a href={local?"/dev/account":member?"/account":"/login"}>{member?"내 서재":"로그인"}</a></header>
    <article className={s.sheet}>{local?<p className={s.note}>로컬 캠페인 검수 · 실제 고객 혜택 아님</p>:null}<p className={s.eyebrow}>A BOOK ABOUT YOU</p><h1>{campaign.message}</h1>
      <section className={s.offer} aria-label="캠페인 혜택">{!available?<p>{campaign.status==="SCHEDULED"?"아직 참여할 수 없는 캠페인입니다.":"현재 이 캠페인의 신규 혜택을 받을 수 없습니다."}</p>:member?<p>책을 고르고 나의 이야기를 이어가세요. 신규가입 혜택은 기존 회원에게 지급되지 않습니다.</p>:<><p>{campaignOffer(campaign)}</p>{campaign.offer!=="NONE"?<small>신규 계정에 한해 지급됩니다. 친구 초대·다른 캠페인의 신규가입 혜택과 중복되지 않습니다.</small>:null}</>}
        {campaign.startsAt?<small>시작 · {date(campaign.startsAt)} KST</small>:null}{campaign.endsAt?<small>종료 · {date(campaign.endsAt)} KST</small>:null}
        {available&&campaign.coupon?<small>쿠폰 사용기한 · {date(campaign.coupon.expiresAt)} KST<br/>최소 주문금액 {campaign.coupon.minOrder.toLocaleString("ko-KR")}원 · {campaign.coupon.products.length?campaign.coupon.products.map(k=>BOOKS.find(b=>b.productKey===k)?.title.replace("\n"," ")??"").join(", "):"6상품 적용"} · 이용권과 동시 사용 불가</small>:null}
      </section>
      {available&&!member?<button className={s.cta} disabled={busy} onClick={()=>void begin()}>내 책 만들기 →</button>:<a className={s.cta} href={home}>책 고르기 →</a>}
      {error?<p role="alert">{error}</p>:null}
      <section className={s.books} aria-label="여섯 권의 책">{BOOKS.map(b=><a key={b.id} href={`${local?"/dev/book-flow":"/"}${local?`?product=${b.slug}`:""}`}><span style={{background:b.color,color:b.ink}}><small>GYEOL<br/>REPORT</small><strong>{b.title.replace("\n"," ")}</strong><small>ISSUE {b.issue}</small></span></a>)}</section>
      <p className={s.note}>나라는 사람부터 일, 사랑, 두 사람의 관계와 시간의 흐름까지.<br/>지금 궁금한 이야기를 골라보세요.</p>
    </article></main>;
}
