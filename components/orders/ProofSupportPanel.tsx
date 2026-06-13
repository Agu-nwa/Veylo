import Link from "next/link";
import { StatusChip } from "@/components/shared/StatusChip";

export function ProofSupportPanel() {
  return (
    <section className="card rounded-[28px] p-6">
      <p className="text-sm font-medium text-[#1f7a55]">OTP, proof, support</p>
      <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
        Confirmation controls.
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[#e5ded2] bg-[#fffdf8] p-5">
          <StatusChip tone="warning">Pickup code</StatusChip>
          <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
            4821
          </p>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Share only after the rider collects the correct item.
          </p>
        </div>

        <div className="rounded-3xl border border-[#e5ded2] bg-[#fffdf8] p-5">
          <StatusChip tone="neutral">Delivery code</StatusChip>
          <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
            Pending
          </p>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Delivery code appears when the rider reaches the recipient.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-[#e5ded2] bg-[#fffdf8] p-5">
        <p className="text-sm font-medium text-[#071a2f]">Photo proof</p>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Pickup proof has been saved. Delivery proof will appear after the
          rider completes the drop-off and recipient confirmation.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/support/new"
          className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
        >
          Open support ticket
        </Link>
        <Link
          href="/faqs"
          className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
        >
          Read delivery rules
        </Link>
      </div>
    </section>
  );
}
