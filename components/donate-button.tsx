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
    primary: "bg-[#B85C38] text-white hover:bg-[#8B3E23]",
    outline: "border-2 border-[#B85C38] text-[#B85C38] hover:bg-[#B85C38] hover:text-white",
    ghost: "text-[#B85C38] hover:bg-[#EDD9B4]",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#B85C38] focus:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {label}
    </Link>
  );
}
