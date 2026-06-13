import { AdminShell } from "@/components/admin/AdminShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const disputes = [
  ["DSP-001", "Pricing question", "VYL-2401", "Open"],
  ["DSP-002", "Failed delivery", "VYL-BIZ-095", "Reviewing"],
  ["DSP-003", "Damage claim", "VYL-2402", "Resolved"],
];

function tone(status: string) {
  if (status === "Resolved") return "success" as const;
  if (status === "Reviewing") return "warning" as const;
  return "danger" as const;
}

export default function AdminDisputesPage() {
  return (
    <AdminShell
      eyebrow="Disputes"
      title="Review evidence, rider notes, customer notes, and policy rules."
      body="Disputes should be resolved using order timeline, OTP, photo proof, rider notes, customer proof, pricing audit, and policy rules."
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Dispute queue">
          <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
            {disputes.map(([id, type, order, status]) => (
              <div
                key={id}
                className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[0.8fr_1.2fr_0.9fr_0.8fr]"
              >
                <p className="text-sm font-medium text-[#071a2f]">{id}</p>
                <p className="text-sm text-[#667085]">{type}</p>
                <p className="text-sm text-[#667085]">{order}</p>
                <StatusChip tone={tone(status)}>{status}</StatusChip>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Review checklist">
          <DataRow label="Order timeline" value="Required" note="Every status event and actor." />
          <DataRow label="OTP and proof" value="Required" note="Pickup and delivery confirmation events." />
          <DataRow label="Rider notes" value="Required" note="Failed pickup/delivery reasons where applicable." />
          <DataRow label="Pricing audit" value="Required" note="For pricing question disputes." />
        </Panel>
      </section>
    </AdminShell>
  );
}
