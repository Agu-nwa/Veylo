import type { RiderProfile } from "@/lib/types";
import { StatusChip } from "@/components/shared/StatusChip";

export function RiderProfileCard({ rider }: { rider: RiderProfile }) {
  return (
    <section className="card rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#1f7a55]">Assigned rider</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
            {rider.name}
          </h2>
        </div>
        <StatusChip tone="success">Verified</StatusChip>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl bg-[#f2ede4] p-4">
          <p className="text-xs text-[#667085]">Rating</p>
          <p className="mt-1 text-sm font-medium text-[#071a2f]">
            {rider.rating} / 5.0
          </p>
        </div>

        <div className="rounded-2xl bg-[#f2ede4] p-4">
          <p className="text-xs text-[#667085]">Completed jobs</p>
          <p className="mt-1 text-sm font-medium text-[#071a2f]">
            {rider.completedJobs}
          </p>
        </div>

        <div className="rounded-2xl bg-[#f2ede4] p-4">
          <p className="text-xs text-[#667085]">Contact policy</p>
          <p className="mt-1 text-sm leading-6 text-[#071a2f]">
            {rider.phonePolicy}
          </p>
        </div>
      </div>
    </section>
  );
}
