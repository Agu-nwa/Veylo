import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-shell py-14">
        <section className="card max-w-3xl rounded-[32px] p-6 md:p-10">
          <StatusChip tone="warning">Page not found</StatusChip>
          <h1 className="mt-5 text-[34px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f]">
            This Veylo page is not available.
          </h1>
          <p className="mt-5 text-sm leading-6 text-[#667085]">
            You can book a delivery, track an order, or contact support from the working pages below.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/book"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              Book delivery
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              Contact support
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
