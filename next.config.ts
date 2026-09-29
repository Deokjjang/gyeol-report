import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sharing crawlers must receive resolved OG metadata in the initial HTML head.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
