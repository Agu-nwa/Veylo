import { AdminShell } from "@/components/admin/AdminShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";

const metrics = [
  { label: "Orders today", value: "68", note: "Mock operations count" },
  { label: "Completion rate", value: "92%", note: "Core quality metric" },
  { label: "Avg delivery time", value: "38 min", note: "Route intelligence input" },
  { label: "Contribution/order", value: "₦310", note: "Placeholder economics" },
];

export default function AdminAnalyticsPage() {
  return (
    <AdminShell
      eyebrow="Analytics"
      title="Operational metrics for route quality, rider reliability, and unit economics."
      body="Analytics should help Veylo improve pricing, rider supply, completion rate, support load, business conversion, and expansion decisions."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Operational health">
          <DataRow label="Rider acceptance rate" value="84%" note="Supply quality and payout fairness signal." />
          <DataRow label="Support tickets / 100 orders" value="6" note="Trust and process clarity signal." />
          <DataRow label="Failed pickup rate" value="3.4%" note="Address, contact, and readiness issues." />
          <DataRow label="Failed delivery rate" value="2.8%" note="Recipient, address, or timing issues." />
        </Panel>

        <Panel title="Business health">
          <DataRow label="Repeat customer rate" value="37%" note="Retention and trust indicator." />
          <DataRow label="Business order share" value="46%" note="Repeat density anchor." />
          <DataRow label="Quote acceptance" value="64%" note="Pricing clarity and willingness to pay." />
          <DataRow label="Dispute rate" value="2.1%" note="Proof and support quality." />
        </Panel>
      </section>
    </AdminShell>
  );
}
