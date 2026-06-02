import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Missions",
  description:
    "Where Pathways of Hope works — beginning with the Kapoeta Children's Shelter in South Sudan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
