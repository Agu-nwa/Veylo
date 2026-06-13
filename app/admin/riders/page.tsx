import { AdminShell } from "@/components/admin/AdminShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const metrics = [
  { label: "Verified riders", value: "31", note: "Approved for active jobs" },
  { label: "Under review", value: "7", note: "Need document checks" },
  { label: "Suspended", value: "2", note: "Conduct or proof review" },
  { label: "Top riders", value: "9", note: "High completion and low disputes" },
];

const riders = [
  ["Verified Rider 014", "Verified", "326 jobs", "4.8"],
  ["Applicant 022", "Under review", "0 jobs", "N/A"],
  ["Verified Rider 031", "Verified", "141 jobs", "4.7"],
  ["Rider 008", "Suspended", "88 jobs", "4.1"],
];

function tone(status: string) {
  if (status === "Verified") return "success" as const;
  if (status === "Under review") return "warning" as const;
  return "danger" as const;
}

export default function AdminRidersPage() {
  return (
    <AdminShell
      eyebrow="Riders"
      title="Rider verification, performance, and suspension controls."
      body="Rider quality is central to Veylo trust. Admin needs identity checks, bike details, training, status, tier, payout, and dispute history."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Rider queue">
          <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
            {riders.map(([name, status, jobs, rating]) => (
              <div
                key={name}
                className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[1fr_0.8fr_0.7fr_0.5fr]"
              >
                <p className="text-sm font-medium text-[#071a2f]">{name}</p>
                <StatusChip tone={tone(status)}>{status}</StatusChip>
                <p className="text-sm text-[#667085]">{jobs}</p>
                <p className="text-sm font-medium text-[#071a2f]">{rating}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Verification checklist">
          <DataRow label="Identity check" value="Required" note="Government ID, live photo, phone verification." />
          <DataRow label="Bike details" value="Required" note="Bike ownership/permission and safety condition." />
          <DataRow label="Training" value="Required" note="OTP, proof, support, package handling, conduct." />
          <DataRow label="Guarantor/reference" value="Recommended" note="Used for trust and local accountability." />
        </Panel>
      </section>
    </AdminShell>
  );
}
