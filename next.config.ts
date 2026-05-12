import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { MAX_IMAGE_SIZE_MB } from "@/shared/config/limits";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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

export default withNextIntl(nextConfig);
