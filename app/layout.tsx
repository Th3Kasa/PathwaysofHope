import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/lib/i18n";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Pathways of Hope — Kapoeta Children's Shelter",
    template: "%s · Pathways of Hope",
  },
  description:
    "A compassion-driven Australian charity partnering with local leaders to bring safety, education and a sustainable future to children in Kapoeta, South Sudan. 100% of donations reach the children.",
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
    <html lang="en" className={cn("h-full", "font-sans", jakarta.variable, lora.variable)}>
      <body className="min-h-full flex flex-col antialiased">
        <LanguageProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
