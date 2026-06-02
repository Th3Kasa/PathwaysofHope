import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Pathways of Hope — Kapoeta Children's Shelter",
    template: "%s · Pathways of Hope",
  },
  description:
    "A faith-driven Australian charity partnering with local leaders to bring safety, education and a sustainable future to children in Kapoeta, South Sudan. 100% of donations reach the children.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pathwaysofhope.org.au"),
  openGraph: {
    type: "website",
    siteName: "Pathways of Hope",
    title: "Pathways of Hope — Kapoeta Children's Shelter",
    description: "Safety, education and a future for children in Kapoeta, South Sudan. 100% of donations reach the children.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Pathways of Hope — Kapoeta Children's Shelter",
    description: "Safety, education and a future for children in Kapoeta, South Sudan. 100% of donations reach the children.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
