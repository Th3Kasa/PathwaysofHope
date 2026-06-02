import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about donating, tax receipts, where your money goes, recurring gifts, and how we keep your trust.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
