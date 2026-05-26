import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/generate", "/recipes", "/auth", "/api", "/monitoring"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
