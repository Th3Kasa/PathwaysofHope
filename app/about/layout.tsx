import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our model, our board, and the promise behind every gift to Pathways of Hope — partnership from within, not aid from a distance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
