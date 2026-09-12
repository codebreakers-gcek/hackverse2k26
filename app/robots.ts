import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hackverse.codebreakersgcek.tech";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/minecraft/", "/og-image.png", "/twitter-image.png", "/googlebd4a646d4549ad60.html"],
        disallow: ["/admin", "/admin/*", "/api/", "/api/*"],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Cloudflare-AlwaysOnline",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
          "Applebot",
        ],
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/", "/api/*"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
