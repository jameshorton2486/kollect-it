import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { 
        userAgent: "*", 
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/checkout/",
          "/account/",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://kollect-it.com/sitemap.xml",
    host: "https://kollect-it.com",
  };
}

