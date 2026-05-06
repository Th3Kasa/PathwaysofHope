import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Pathways of Hope — Kapoeta Children's Shelter",
  description:
    "A faith-driven charity bringing restored dignity, safety, and opportunity to 60 children in Kapoeta, South Sudan. 100% of donations reach the children.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pathwaysofhope.org.au"),
  openGraph: {
    title: "Pathways of Hope",
    description: "60 children. One shelter. 100% to the children.",
    images: ["/images/kapoeta/children-group.jpg"],
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
        <link rel="icon" href="/images/kapoeta/logo.jpg" type="image/jpeg" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
