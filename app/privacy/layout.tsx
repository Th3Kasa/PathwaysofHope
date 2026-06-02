import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pathways of Hope collects, uses and protects your personal information, in line with the Privacy Act 1988 and the Australian Privacy Principles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
