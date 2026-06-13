import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://veylo.ng";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/how-it-works",
          "/services",
          "/business-delivery",
          "/pricing",
          "/safety",
          "/riders",
          "/riders/apply",
          "/support",
          "/support/new",
          "/faqs",
          "/contact",
          "/express",
          "/markets",
        ],
        disallow: [
          "/admin",
          "/dashboard",
          "/profile",
          "/orders",
          "/login",
          "/register",
          "/rider",
          "/business/dashboard",
          "/business/history",
          "/business/new-delivery",
          "/business/plan",
          "/business/reports",
          "/business/support",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
