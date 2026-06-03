"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavTabItem {
  id: string;
  href: string;
  label: string;
}

interface Props {
  items: NavTabItem[];
  activeHref: string;
  scrolled: boolean;
}

export function AnimatedNavigationTabs({ items, activeHref, scrolled }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <ul className="flex items-center">
      {items.map((item) => {
        const isActive = activeHref === item.href || (item.href !== "/" && activeHref.startsWith(item.href));
        const isHover = hoverId === item.id;

        return (
          <li key={item.id} className="relative">
            <Link
              href={item.href}
              className={cn(
                "relative block px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                isActive
                  ? scrolled ? "text-[#6366f1]" : "text-white"
                  : scrolled
                  ? "text-[#374151] hover:text-[#6366f1]"
                  : "text-white/80 hover:text-white"
              )}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <span className="relative z-10">{item.label}</span>

              {/* Hover background pill */}
              {isHover && (
                <motion.span
                  layoutId="nav-hover-bg"
                  className={cn(
                    "absolute inset-0 rounded-md",
                    scrolled ? "bg-[#6366f1]/8" : "bg-white/10"
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>

            {/* Active underline */}
            {isActive && (
              <motion.span
                layoutId="nav-active-line"
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#6366f1] rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
