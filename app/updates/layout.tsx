import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "News, milestones and progress from the Kapoeta Children's Shelter and Pathways of Hope.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
