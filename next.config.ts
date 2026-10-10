import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/account/tickets/:path*", "/dev/account/tickets/:path*"].map(source => ({ source, headers: [
      { key: "Cache-Control", value: "private, no-store" }, { key: "Referrer-Policy", value: "no-referrer" }, { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ] }));
  },
  // Local-only Phase 10A SQL fixture; never initialized in Production.
  serverExternalPackages: ["@electric-sql/pglite"],
  // Sharing crawlers must receive resolved OG metadata in the initial HTML head.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
