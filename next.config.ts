import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/impact", destination: "/missions/kapoeta", permanent: true },
    ];
  },
};

export default nextConfig;
