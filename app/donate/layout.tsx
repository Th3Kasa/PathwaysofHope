import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Give once or monthly to the Kapoeta Children's Shelter. Choose a project or sponsor a child — 100% of donations reach the children.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
