import type { Metadata } from "next";
import { FreeLanding } from "../../components/growth/FreeLanding";
import { FREE_COPY } from "../../lib/growth/model";
import { freeExamples } from "../../lib/book/example";
import { giftEventPublicView, signupPublicView } from "../../lib/ops/config";
import { SHARE_ORIGIN } from "../../lib/sharing/reportShareMetadata";

/**
 * F 캠페인 랜딩(/free): 「명리 특징과 MBTI 성향, 비슷하다고 느낀 적 없나요?」로 들어온 사람에게 가입하면 내 책 한 권 무료.
 * 서버 시각 + DB 켜짐/꺼짐으로 혜택을 보일지 정한다(종료·멈춤이면 혜택 문구 없이 일반 소개 + 상품 보기). 예시는 가상 인물 서하은의 예시 리포트 본문 그대로.
 */
export const dynamic = "force-dynamic";
const OG_IMAGE = `${SHARE_ORIGIN}/example/og`;
export const metadata: Metadata = {
  title: { absolute: `${FREE_COPY.question} | 결리포트` },
  description: FREE_COPY.lead,
  alternates: { canonical: `${SHARE_ORIGIN}/free` },
  openGraph: { title: `${FREE_COPY.question} | 결리포트`, description: FREE_COPY.lead, url: `${SHARE_ORIGIN}/free`, type: "website", siteName: "결리포트", locale: "ko_KR", images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "결리포트" }] },
  twitter: { card: "summary_large_image", title: `${FREE_COPY.question} | 결리포트`, description: FREE_COPY.lead, images: [OG_IMAGE] },
};

export default async function FreePage() {
  const { createOpsStores } = await import("../../lib/ops/store");
  const { signupGrantOn } = await import("../../lib/ops/gift/service");
  const on = await signupGrantOn(createOpsStores().signup);
  return <FreeLanding signup={signupPublicView(on)} event={giftEventPublicView()} examples={freeExamples()} />;
}
