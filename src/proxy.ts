import { NextResponse, type NextRequest } from "next/server";
import { devRoutesBlocked, isDevPath } from "./lib/devRouteGate";

// v5 최종3: 배포 빌드에서는 /dev/* 를 404로 막는다(라우트·서버 함수 실행 전). 다른 주소에는 이 proxy가 돌지 않는다(matcher).
export function proxy(request: NextRequest) {
  if (devRoutesBlocked() && isDevPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dev/:path*"] };
