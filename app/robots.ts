import type { MetadataRoute } from "next";

import { env } from "@/shared/config/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/generate",
          "/recipes",
          "/auth",
          "/api",
          "/monitoring",
          "/es/generate",
          "/es/recipes",
          "/es/auth",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
