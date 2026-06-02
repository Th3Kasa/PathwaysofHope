import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency & Financials",
  description:
    "What we've raised, what we've delivered, and real monthly operating statements from the Kapoeta Children's Shelter.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
