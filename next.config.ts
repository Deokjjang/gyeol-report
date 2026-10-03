import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local-only Phase 10A SQL fixture; never initialized in Production.
  serverExternalPackages: ["@electric-sql/pglite"],
  // Sharing crawlers must receive resolved OG metadata in the initial HTML head.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
