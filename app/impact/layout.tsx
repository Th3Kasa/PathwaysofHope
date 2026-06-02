import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Milestone by milestone — what your support has built at the Kapoeta Children's Shelter, and what comes next.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
