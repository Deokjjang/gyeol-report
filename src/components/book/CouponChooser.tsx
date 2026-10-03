"use client";
import { useEffect, useRef, useState } from "react";
import type { CouponQuote, CouponSelection } from "../../lib/coupons/service";
import s from "./flow.module.css";
import { interaction } from "../../lib/analytics/client";
export type CouponChoice={selection?:CouponSelection;quote:CouponQuote|null};
export function CouponChooser({productType,disabled,ticketSelected,member,onChange}:{productType:string;disabled:boolean;ticketSelected:boolean;member:boolean;onChange:(value:CouponChoice)=>void}) {
  const [code,setCode]=useState(""),[message,setMessage]=useState(""),[loading,setLoading]=useState(false);
  const [grants,setGrants]=useState<{grantId:string;name:string}[]>([]);
  const [selectedGrant,setSelectedGrant]=useState("");
  const state=useRef({active:false,seq:0});
  useEffect(()=>{
    const lifecycle=state.current;lifecycle.active=true;const id=++lifecycle.seq;
    const abort=new AbortController();
    void fetch("/dev/account/api/coupon-quote",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productType}),signal:abort.signal}).then(async r=>{const b=await r.json();if(r.ok&&!abort.signal.aborted&&id===lifecycle.seq)onChange({quote:b});}).catch(()=>{});
    if(member)void fetch("/dev/account/api/coupon-list",{cache:"no-store",signal:abort.signal}).then(async r=>{const b=await r.json();if(r.ok&&!abort.signal.aborted)setGrants(b.items??[]);}).catch(()=>{});
    return ()=>{abort.abort();lifecycle.active=false;lifecycle.seq++;};
  },[productType,member,onChange]);
  async function apply(selection?:CouponSelection){
    const lifecycle=state.current,id=++lifecycle.seq;setLoading(true);setMessage("");setSelectedGrant(selection?.grantId??"");onChange({quote:null});
    try{
      const r=await fetch("/dev/account/api/coupon-quote",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productType,...(selection?{selection}:{})})});
      const b=await r.json();if(!lifecycle.active||id!==lifecycle.seq)return;
      if(!r.ok||!b.ok){setMessage(b.error??"쿠폰을 확인해 주세요.");onChange({quote:null});}
      else{if(selection)interaction("coupon_applied",productType);onChange({selection,quote:b});setMessage(selection?`${b.coupon.name} · 적용됨`:"쿠폰을 적용하지 않습니다.");}
    }catch{if(lifecycle.active&&id===lifecycle.seq)setMessage("쿠폰을 확인하지 못했습니다. 다시 시도해 주세요.");}
    finally{if(lifecycle.active&&id===lifecycle.seq)setLoading(false);}
  }
  return <fieldset className={s.coupon} disabled={disabled||loading}><legend>쿠폰</legend>
    {grants.length?<label>보유 쿠폰<select aria-label="보유 쿠폰" value={selectedGrant} onChange={e=>{setCode("");void apply(e.target.value?{grantId:e.target.value}:undefined);}}><option value="">선택 안 함</option>{grants.map(g=><option key={g.grantId} value={g.grantId}>{g.name}</option>)}</select></label>:null}
    <div><label className={s.couponCode}>쿠폰 코드<input autoComplete="off" maxLength={40} value={code} onChange={e=>setCode(e.target.value)} placeholder="코드 입력" /></label><button type="button" onClick={()=>void apply({code:code.trim()})} disabled={!code.trim()}>적용</button><button type="button" onClick={()=>{setCode("");void apply();}}>해제</button></div>
    {ticketSelected?<p>이용권 사용 중에는 쿠폰을 적용하지 않습니다.</p>:<p aria-live="polite">{loading?"쿠폰 확인 중…":message}</p>}
  </fieldset>;
}
