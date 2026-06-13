import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";

const links = [
  ["Overview", "/rider"],
  ["Jobs", "/rider/jobs"],
  ["Earnings", "/rider/earnings"],
  ["Profile", "/rider/profile"],
  ["Support", "/rider/support"],
];

export function RiderShell({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8">
          <StatusChip tone="info">Rider console</StatusChip>
          <p className="mt-6 text-sm font-medium text-[#1f7a55]">{eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-[16px] leading-7 text-[#667085]">
            {body}
          </p>

          <nav className="mt-7 flex gap-2 overflow-x-auto pb-2">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#071a2f]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {children}
      </main>
      <Footer />
    </>
  );
}
