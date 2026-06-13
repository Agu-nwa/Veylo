import { AdminShell } from "@/components/admin/AdminShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const metrics = [
  { label: "Pending assignment", value: "5", note: "Need rider assignment" },
  { label: "Active jobs", value: "18", note: "Across Owerri zones" },
  { label: "Failed pickup risk", value: "2", note: "Need support check" },
  { label: "Available riders", value: "24", note: "Mock live supply" },
];

const queue = [
  ["VYL-2401", "Ikenegbu → World Bank", "In transit", "Verified Rider 014"],
  ["VYL-2403", "Douglas → IMSU area", "Assigning", "Unassigned"],
  ["VYL-2404", "New Owerri → Aladinma", "Created", "Unassigned"],
  ["VYL-2405", "Wetheral → Ikenegbu", "Pickup risk", "Rider 021"],
];

export default function AdminDispatchPage() {
  return (
    <AdminShell
      eyebrow="Dispatch"
      title="Live dispatch queue and rider assignment."
      body="This screen prepares the operations desk for assigning riders, watching active jobs, and escalating failed pickup or delivery risks."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Dispatch queue">
          <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
            {queue.map(([id, route, status, rider]) => (
              <div
                key={id}
                className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[0.8fr_1.4fr_0.8fr_1fr]"
              >
                <p className="text-sm font-medium text-[#071a2f]">{id}</p>
                <p className="text-sm text-[#667085]">{route}</p>
                <p className="text-sm font-medium text-[#1f7a55]">{status}</p>
                <p className="text-sm text-[#667085]">{rider}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Assignment controls">
          <StatusChip tone="warning">Backend required</StatusChip>
          <div className="mt-5">
            <DataRow label="Assign rider" value="Pending API" note="Backend will validate rider availability and status." />
            <DataRow label="Override status" value="Reason required" note="All admin overrides must create audit logs." />
            <DataRow label="Escalate support" value="Ticket-linked" note="Failed pickup and delivery should connect to support." />
          </div>
        </Panel>
      </section>
    </AdminShell>
  );
}
