import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";

export default function BookingConfirmedPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-14">
        <section className="card max-w-3xl rounded-[32px] p-6 md:p-10">
          <StatusChip tone="success">Booking confirmed</StatusChip>
          <h1 className="mt-5 text-[34px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f]">
            Your Veylo order has entered assignment.
          </h1>
          <p className="mt-5 text-sm leading-6 text-[#667085]">
            This page is ready for the backend phase, where confirmed orders,
            quote IDs, payment state, rider assignment, OTP, proof, and order
            timeline will be persisted.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              Track order
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              Go to dashboard
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
