"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useT, type Dict } from "@/lib/i18n";

/** A bilingual "back" link. Label is provided as an {en, ar} pair by the caller. */
export function BackLink({ href, label }: { href: string; label: Dict<string> }) {
  const t = useT();
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#6366f1] transition-colors mb-6"
    >
      <ArrowLeft size={16} /> {t(label)}
    </Link>
  );
}
