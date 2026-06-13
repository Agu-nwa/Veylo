import Link from "next/link";
import { AccountMenu } from "@/components/shared/AccountMenu";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/business-delivery", label: "Business" },
  { href: "/safety", label: "Safety" },
  { href: "/support", label: "Support" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e5ded2]/80 bg-[#f7f3ec]/86 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#071a2f] text-sm font-medium text-white">
            V
          </span>
          <span className="text-[15px] font-medium tracking-[-0.01em] text-[#071a2f]">
            Veylo
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#475467] transition hover:text-[#071a2f]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AccountMenu />
      </div>
    </header>
  );
}
