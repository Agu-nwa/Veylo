import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";

export function AuthShell({
  eyebrow,
  title,
  body,
  chip,
  children,
  sideTitle,
  sideItems,
}: {
  eyebrow: string;
  title: string;
  body: string;
  chip: string;
  children: React.ReactNode;
  sideTitle: string;
  sideItems: string[];
}) {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <aside>
            <StatusChip tone="info">{chip}</StatusChip>
            <p className="mt-6 text-sm font-medium text-[#1f7a55]">{eyebrow}</p>
            <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {title}
            </h1>
            <p className="mt-5 text-[16px] leading-7 text-[#667085]">{body}</p>

            <div className="mt-8 card rounded-[28px] p-6">
              <h2 className="text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
                {sideTitle}
              </h2>
              <div className="mt-5 grid gap-3">
                {sideItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] px-4 py-3 text-sm leading-6 text-[#475467]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="card rounded-[32px] p-5 md:p-7">{children}</section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function AuthSwitch({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-[#667085]">
      {text}{" "}
      <Link href={href} className="font-medium text-[#071a2f]">
        {label}
      </Link>
    </p>
  );
}
