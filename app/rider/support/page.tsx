import Link from "next/link";
import { RiderShell } from "@/components/rider/RiderShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";

export default function RiderSupportPage() {
  return (
    <RiderShell
      eyebrow="Rider support"
      title="Support for job issues, failed pickup, failed delivery, payout, and proof."
      body="Rider support must be structured so operations can review order ID, route, proof, rider note, customer note, and status history."
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Rider support categories">
          <DataRow label="Job issue" value="Order-linked" note="Use when route, contact, or package details are unclear." />
          <DataRow label="Failed pickup" value="Reason required" note="Customer unavailable, address unclear, item not ready, restricted item." />
          <DataRow label="Failed delivery" value="Reason required" note="Recipient unavailable, wrong address, unsafe area, payment issue." />
          <DataRow label="Payout question" value="Payout-linked" note="Backend will connect payout status later." />
          <DataRow label="Proof problem" value="Evidence-linked" note="OTP, photo proof, recipient confirmation, rider note." />
        </Panel>

        <Panel title="Open rider support ticket">
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">
              Rider support uses the same structured ticket system.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Backend will later link rider tickets to job ID, rider ID, order timeline,
              proof uploads, payout records, and admin resolution.
            </p>
            <Link
              href="/support/new"
              className="mt-5 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Open support ticket
            </Link>
          </div>
        </Panel>
      </section>
    </RiderShell>
  );
}
