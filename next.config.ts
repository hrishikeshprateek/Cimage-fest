import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Programme rail on the About page uses next/image with media from the
    // CIMAGE S3 bucket (see lib/assets.ts → asset()).
    remotePatterns: [
      { protocol: "https", hostname: "cimage-web.s3.ap-south-1.amazonaws.com" },
    ],
  },
};

export default nextConfig;
