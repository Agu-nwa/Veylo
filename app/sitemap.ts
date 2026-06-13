import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://veylo.ng";

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
