import Link from "next/link";
import { RiderShell } from "@/components/rider/RiderShell";
import { StatusChip } from "@/components/shared/StatusChip";
import { riderJobs } from "@/lib/rider-data";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function tone(status: string) {
  if (status === "OFFERED") return "info" as const;
  if (status === "ACCEPTED") return "success" as const;
  if (status === "IN_TRANSIT") return "warning" as const;
  return "neutral" as const;
}

export default function RiderJobsPage() {
  return (
    <RiderShell
      eyebrow="Jobs"
      title="Review job offers, active jobs, route details, and estimated payout."
      body="Riders need short operational screens: pickup, drop-off, package, payout, expiry, accept/reject, OTP, proof, and support."
    >
      <section className="grid gap-4">
        {riderJobs.map((job) => (
          <Link
            key={job.id}
            href={`/rider/jobs/${job.id}`}
            className="card rounded-[26px] p-5 transition hover:border-[#071a2f]/30"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
                    {job.id}
                  </h2>
                  <StatusChip tone={tone(job.status)}>
                    {job.status.replaceAll("_", " ").toLowerCase()}
                  </StatusChip>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  {job.pickup} to {job.dropoff}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  {job.service} · {job.packageCategory} · {job.distance}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-[#667085]">Estimated payout</p>
                <p className="mt-1 text-lg font-medium text-[#071a2f]">
                  {money.format(job.estimatedPayout)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </RiderShell>
  );
}
