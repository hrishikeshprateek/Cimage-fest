import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Programme rail on the About page uses next/image with media from the
    // CIMAGE S3 bucket (see lib/assets.ts → asset()).
    remotePatterns: [
      { protocol: "https", hostname: "cimage-web.s3.ap-south-1.amazonaws.com" },
    ],
  },
  // Long cache for static media in /public (video, images, fonts). These rarely
  // change; bump the filename if you replace one. Fixes the very short default
  // TTL that made repeat visits re-download the hero video.
  async headers() {
    return [
      {
        source:
          "/:path*.(mp4|webm|webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
