"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/book", label: "Book", icon: "+" },
  { href: "/orders", label: "Orders", icon: "◷" },
  { href: "/support", label: "Support", icon: "?" },
  { href: "/profile", label: "Account", icon: "◌" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e5ded2] bg-[#fffdf8]/94 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition ${
                active
                  ? "bg-[#071a2f] text-white"
                  : "text-[#667085] hover:bg-[#f2ede4] hover:text-[#071a2f]"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1 text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
