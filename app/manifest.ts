import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Veylo",
    short_name: "Veylo",
    description:
      "Book verified riders for deliveries, errands, and business logistics across Owerri.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#071a2f",
    orientation: "portrait-primary",
    icons: [],
  };
}
