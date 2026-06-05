import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smallest), then WebP, then fall back to the original.
    formats: ["image/avif", "image/webp"],
    // Photos are cached at the edge for a year once optimized.
    minimumCacheTTL: 31536000,
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
