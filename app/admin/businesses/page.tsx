import { AdminShell } from "@/components/admin/AdminShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const metrics = [
  { label: "Active businesses", value: "12", note: "Approved accounts" },
  { label: "Under review", value: "4", note: "Need account decision" },
  { label: "Monthly volume", value: "318", note: "Mock business orders" },
  { label: "Discount applied", value: "₦62k", note: "Within plan limits" },
];

const businesses = [
  ["Ikenegbu Fashion Vendor", "Growth Vendor", "Active", "84 deliveries"],
  ["World Bank Restaurant", "Pay-as-you-go", "Active", "37 deliveries"],
  ["New Owerri Office", "Corporate", "Under review", "0 deliveries"],
  ["Campus Vendor", "Growth Vendor", "Paused", "52 deliveries"],
];

function tone(status: string) {
  if (status === "Active") return "success" as const;
  if (status === "Under review") return "warning" as const;
  return "danger" as const;
}

export default function AdminBusinessesPage() {
  return (
    <AdminShell
      eyebrow="Businesses"
      title="Business accounts, plan discounts, and delivery reporting."
      body="Admin should review business requests, account status, plan rules, monthly delivery summaries, and discount limits."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6">
        <Panel title="Business account list">
          <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
            {businesses.map(([name, plan, status, volume]) => (
              <div
                key={name}
                className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[1.3fr_0.9fr_0.8fr_0.8fr]"
              >
                <p className="text-sm font-medium text-[#071a2f]">{name}</p>
                <p className="text-sm text-[#667085]">{plan}</p>
                <StatusChip tone={tone(status)}>{status}</StatusChip>
                <p className="text-sm text-[#667085]">{volume}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </AdminShell>
  );
}
