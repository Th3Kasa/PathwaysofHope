import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Admin-uploaded and AI-generated photos stored in Vercel Blob
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/impact", destination: "/missions/kapoeta", permanent: true },
    ];
  },
};

export default nextConfig;
