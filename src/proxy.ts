import { NextResponse, type NextRequest } from "next/server";
import { devRoutesBlocked, isDevPath } from "./lib/devRouteGate";
import { mirrorRoutesEnabled } from "./lib/mirror/gate";

/** 「남이 본 나」 링크 gyeolreport.com/@아이디 → 내부 주소 /u/아이디(Next 폴더 이름 @는 병렬 라우트라 쓰지 않는다). 아이디에 마침표가 있어도(@minji.k) 정적 파일로 보지 않는다. */
export function mirrorHandleFromPath(pathname: string): string | null {
  const m = /^\/@([A-Za-z0-9._]{3,20})$/.exec(pathname);
  return m ? m[1] : null;
}

// v5 최종3: 배포 빌드에서는 /dev/* 를 404로 막는다(라우트·서버 함수 실행 전). 다른 주소에는 이 proxy가 돌지 않는다(matcher).
// 「남이 본 나」(명령 1/3): /@아이디는 공개 관문이 열려 있을 때만 /u/아이디로 넘긴다(닫혀 있으면 그대로 → 404, 지금과 같다).
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (devRoutesBlocked() && isDevPath(path)) {
    return new NextResponse(null, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
  }
  const handle = mirrorHandleFromPath(path);
  if (handle && mirrorRoutesEnabled()) {
    const url = request.nextUrl.clone();
    url.pathname = `/u/${handle}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

// 주의(명령 2/3): "/@:path*"는 Next 안의 path-to-regexp가 "앞뒤 구분자 없이 반복 불가"로 거부해 proxy 전체가 등록되지 않았다(/dev 차단 포함).
// 아이디 규칙(3~20자, 영문 · 숫자 · . · _)을 그대로 패턴으로 둔다 — tests/unit/mirror/routes.test.ts가 Next의 path-to-regexp로 컴파일을 확인한다.
export const config = { matcher: ["/dev/:path*", "/@:handle([A-Za-z0-9._]{3,20})"] };
