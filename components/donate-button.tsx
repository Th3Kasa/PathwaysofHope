"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface DonateButtonProps {
  goalId?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost";
  children?: React.ReactNode;
}

export function DonateButton({
  goalId,
  className,
  size = "md",
  variant = "primary",
  children,
}: DonateButtonProps) {
  const t = useT();
  const href = goalId ? `/donate?goal=${goalId}` : "/donate";
  const label = children ?? t({ en: "Give Now", ar: "تبرّع الآن" });

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: "bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-sm",
    outline: "border-2 border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white",
    ghost: "text-[#4f46e5] hover:bg-[#d6d3d1]",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {label}
    </Link>
  );
}
