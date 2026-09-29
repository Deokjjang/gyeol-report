"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const rawPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

const PIXEL_ID =
  rawPixelId && /^\d+$/.test(rawPixelId)
    ? rawPixelId
    : undefined;

export default function MetaPixel() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (!PIXEL_ID) {
      return;
    }

    // 최초 PageView는 아래 Meta Pixel 기본 코드가 전송하므로
    // 여기서는 중복 전송하지 않는다.
    if (firstRender.current) {
      firstRender.current = false;
      previousPath.current = pathname;
      return;
    }

    // Next.js App Router에서 실제 경로가 바뀐 경우만 PageView 전송
    if (!pathname || pathname === previousPath.current) {
      return;
    }

    previousPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {
              if(f.fbq)return;
              n=f.fbq=function(){
                n.callMethod
                  ? n.callMethod.apply(n,arguments)
                  : n.queue.push(arguments)
              };
              if(!f._fbq)f._fbq=n;
              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];
              t=b.createElement(e);
              t.async=!0;
              t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <noscript
        dangerouslySetInnerHTML={{
          __html: `
            <img
              height="1"
              width="1"
              style="display:none"
              src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1"
              alt=""
            />
          `,
        }}
      />
    </>
  );
}
