import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession } from "../account/policy";
import { localTicketUserId } from "../tickets/localDatabase";
import { localAccountAllowed } from "../account/gate";
import { isRecord } from "../report-generation/productPublishGate";
import { claimCookieName, CLAIM_COOKIE_SECONDS } from "../library/server";
import { quoteCoupon, reserveCouponOrder, validCouponSelection, localCouponCheckout, type CouponIdentity, type CouponStore } from "./service";

export const LOCAL_COUPON_COOKIE="gyeol-local-coupon-session";
export function localCouponIdentity(user:string|null,secret:string):CouponIdentity {
  const id=user?localTicketUserId(user):null;
  return {user:id,actor:id?`user:${id}`:`guest:${createHash("sha256").update(secret).digest("hex")}`};
}
const messages:Record<string,string>={
  COUPON_NOT_FOUND:"쿠폰 코드를 확인해 주세요.",COUPON_EXPIRED:"사용 기간이 지난 쿠폰입니다.",
  COUPON_NOT_STARTED:"아직 사용할 수 없는 쿠폰입니다.",COUPON_INACTIVE:"현재 사용할 수 없는 쿠폰입니다.",
  MEMBER_REQUIRED:"회원만 사용할 수 있는 쿠폰입니다.",PRODUCT_INELIGIBLE:"이 상품에는 적용할 수 없는 쿠폰입니다.",
  USAGE_LIMIT:"사용 가능한 쿠폰 수량을 모두 사용했습니다.",MIN_ORDER_AMOUNT:"최소 주문 금액을 확인해 주세요.",
  MINIMUM_PAYMENT:"쿠폰 적용 후 결제 금액이 최소 결제 금액보다 작습니다.",FIRST_PURCHASE_ONLY:"첫 구매에만 사용할 수 있는 쿠폰입니다.",
  PAYMENT_RECONCILIATION_REQUIRED:"결제 결과를 확인 중입니다. 쿠폰을 다시 사용하기 전에 확인이 필요합니다.",
  DELIVERY_RECOVERY_PENDING:"결제는 완료됐습니다. 책 발행 복구 결과를 확인해 주세요.",
};
// Only mounted in the existing loopback dev route. No public grant/claim/confirm.
export async function handleLocalCoupons(request:NextRequest,action:string,auth:AccountPort,store:CouponStore) {
  if(!localAccountAllowed(request))return new NextResponse(null,{status:404});
  let secret=request.cookies.get(LOCAL_COUPON_COOKIE)?.value;
  if(!secret||!/^[a-f0-9]{64}$/.test(secret))secret=randomBytes(32).toString("hex");
  let purchaseClaim: {orderId:string;secret:string}|undefined;
  const json=(body:object,status=200)=>{
    const response=NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store","Vary":"Cookie","Referrer-Policy":"no-referrer"}});
    response.cookies.set(LOCAL_COUPON_COOKIE,secret!,{httpOnly:true,sameSite:"strict",path:"/",maxAge:86400});
    if(purchaseClaim)response.cookies.set(claimCookieName(purchaseClaim.orderId,true),purchaseClaim.secret,{httpOnly:true,sameSite:"lax",path:"/",maxAge:CLAIM_COOKIE_SECONDS});
    return auth.finish(response);
  };
  if(!["quote","list","claim","prepare","complete","release","fixture"].includes(action))return json({},404);
  if(request.method!==(action==="list"?"GET":"POST"))return json({},405);
  const url=new URL(request.url);if(request.headers.get("host"))url.host=request.headers.get("host")!;
  if(action!=="list"&&request.headers.get("origin")!==url.origin)return json({},403);
  try{
    const user=await auth.currentUser(),snapshot=user?await auth.read(user):null;
    if(user&&(!snapshot||accountSession(user,snapshot).status!=="member"))return json({},401);
    const identity=localCouponIdentity(user?.id??null,secret);
    if(action==="list")return json(await store.call("list",identity));
    const raw=await request.text();if(raw.length>16384)return json({},413);
    let b:unknown;try{b=JSON.parse(raw);}catch{return json({},400);}
    const fields:Record<string,string[]>={quote:["productType","selection"],claim:["code"],prepare:["requestId","payload","consent","selection"],complete:["orderId"],release:["orderId"],fixture:[]};
    if(!isRecord(b)||Object.keys(b).some(k=>!fields[action].includes(k)))return json({},400);
    if((await auth.currentUser())?.id!==user?.id)return json({},401);
    let result;
    if(action==="fixture"){
      const {localCouponFixture}=await import("./localDatabase");result=await localCouponFixture(identity);
    }else if(action==="quote"){
      if(b.selection!==undefined&&!validCouponSelection(b.selection))return json({},400);
      result=await quoteCoupon(store,identity,b.productType,b.selection);
    }else if(action==="claim"){
      if(!user||!validCouponSelection(b))return json({},400);
      result=await store.call("claim",identity,b);
    }else if(action==="prepare"){
      if(typeof b.requestId!=="string"||!validCouponSelection(b.selection))return json({},400);
      const claimSecret=createHash("sha256").update(`${secret}:${b.requestId}`).digest("hex");
      result=await reserveCouponOrder(store,identity,{requestId:b.requestId,payload:b.payload,consent:b.consent,selection:b.selection,claimHash:user?null:createHash("sha256").update(claimSecret).digest("hex")});
      if(result.ok&&result.orderId&&!user)purchaseClaim={orderId:result.orderId,secret:claimSecret};
      if(result.ok&&isRecord(b.payload))result={...result,tossCheckoutRequest:localCouponCheckout(b.payload.productKey,result)};
    }else{
      if(typeof b.orderId!=="string"||!/^coupon-local-[a-f0-9-]{36}$/.test(b.orderId))return json({},400);
      if(action==="release")result=await store.call("release",identity,{orderId:b.orderId});
      else{const {completeLocalCoupon}=await import("./localDatabase");result=await completeLocalCoupon(store,identity,b.orderId);}
    }
    return json(result.ok?result:{...result,error:messages[("code" in result?result.code:"") as string]??"쿠폰 적용 상태를 다시 확인해 주세요."},result.ok?200:400);
  }catch{return json({ok:false,error:"쿠폰 상태를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요."},503);}
}
