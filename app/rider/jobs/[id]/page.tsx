import Link from "next/link";
import { RiderShell } from "@/components/rider/RiderShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import { getRiderJobById } from "@/lib/rider-data";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default async function RiderJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getRiderJobById(id);

  return (
    <RiderShell
      eyebrow="Job detail"
      title={`${job.id}: ${job.service}`}
      body="This screen prepares the active rider workflow: accept/reject, pickup checklist, OTP, proof, failed delivery reason, and support escalation."
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Route and payout">
          <StatusChip tone="info">{job.status.replaceAll("_", " ").toLowerCase()}</StatusChip>
          <div className="mt-6">
            <DataRow label="Pickup" value={job.pickup} note="Confirm address and landmark before moving." />
            <DataRow label="Drop-off" value={job.dropoff} note="Recipient confirmation required at delivery." />
            <DataRow label="Package" value={job.packageCategory} note={job.note} />
            <DataRow label="Distance" value={job.distance} note="Mock route estimate." />
            <DataRow label="Estimated payout" value={money.format(job.estimatedPayout)} note="Backend will calculate real payout." />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button className="rounded-full bg-[#1f7a55] px-5 py-3 text-sm font-medium text-white">
              Accept job
            </button>
            <button className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]">
              Reject with reason
            </button>
          </div>
        </Panel>

        <Panel title="Pickup and delivery checklist">
          <div className="grid gap-3">
            {[
              "Confirm pickup location and contact instruction.",
              "Collect only the described item.",
              "Enter pickup OTP after collecting item.",
              "Upload photo proof where required.",
              "Confirm recipient and enter delivery OTP.",
              "Use failed pickup/delivery reason if the job cannot continue.",
            ].map((item, index) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#071a2f] text-xs font-medium text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[#475467]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white">
              Enter pickup OTP
            </button>
            <button className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]">
              Upload proof
            </button>
          </div>
        </Panel>
      </section>

      <div className="mt-8">
        <Link
          href="/rider/jobs"
          className="inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
        >
          Back to jobs
        </Link>
      </div>
    </RiderShell>
  );
}
