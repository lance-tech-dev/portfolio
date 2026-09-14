import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-afa534f0b0d04dcaad86dbe1fb8dad05.r2.dev",
      },
    ],
  },
};

export default nextConfig;
