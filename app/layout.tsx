import type { Metadata, Viewport } from "next";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://veylo.ng"),
  title: {
    default: "Veylo | Verified Rider Delivery Across Owerri",
    template: "%s | Veylo",
  },
  description:
    "Book verified dispatch riders for deliveries, errands, express delivery, and business logistics across Owerri with clear fare estimates, status updates, proof, and support.",
  manifest: "/manifest.webmanifest",
  applicationName: "Veylo",
  keywords: [
    "Veylo",
    "Owerri logistics",
    "Owerri delivery",
    "dispatch rider Owerri",
    "errand service Owerri",
    "business delivery Owerri",
  ],
  authors: [{ name: "Veylo" }],
  creator: "Veylo",
  publisher: "Veylo",
  openGraph: {
    title: "Veylo | Verified Rider Delivery Across Owerri",
    description:
      "Book verified riders for deliveries, errands, and business logistics across Owerri with clear pricing, proof, and support.",
    url: "https://veylo.ng",
    siteName: "Veylo",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veylo | Verified Rider Delivery Across Owerri",
    description:
      "Book verified riders for deliveries, errands, and business logistics across Owerri.",
  },
  appleWebApp: {
    capable: true,
    title: "Veylo",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#071a2f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen pb-24 lg:pb-0">{children}</div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
