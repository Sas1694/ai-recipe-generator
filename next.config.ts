import type { NextConfig } from "next";
import { MAX_IMAGE_SIZE_MB } from "@/shared/config/limits";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${MAX_IMAGE_SIZE_MB}mb`,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
