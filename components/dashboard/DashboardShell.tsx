import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { StatusChip } from "@/components/shared/StatusChip";

export function DashboardShell({
  eyebrow,
  title,
  body,
  chip,
  children,
  actionHref,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  body: string;
  chip: string;
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <StatusChip tone="info">{chip}</StatusChip>
            <p className="mt-5 text-sm font-medium text-[#1f7a55]">{eyebrow}</p>
            <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {title}
            </h1>
            <p className="mt-4 text-[16px] leading-7 text-[#667085]">{body}</p>
          </div>

          {actionHref && actionLabel ? (
            <Link
              href={actionHref}
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              {actionLabel}
            </Link>
          ) : null}
        </div>

        {children}
      </main>
      <Footer />
    </>
  );
}
