import Link from "next/link";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const metrics = [
  { label: "Monthly deliveries", value: "84", note: "Mock business volume" },
  { label: "Completed", value: "76", note: "8 pending or failed" },
  { label: "Plan discount", value: "₦18k", note: "Applied this month" },
  { label: "Total spend", value: "₦214k", note: "Invoice-ready summary" },
];

const recentOrders = [
  ["VYL-BIZ-091", "Ikenegbu to Aladinma", "Delivered"],
  ["VYL-BIZ-092", "Wetheral to World Bank", "In transit"],
  ["VYL-BIZ-093", "Nekede to IMSU area", "Assigning rider"],
  ["VYL-BIZ-094", "New Owerri to Ikenegbu", "Delivered"],
];

export default function BusinessDashboardPage() {
  return (
    <DashboardShell
      eyebrow="Business dashboard lite"
      title="Repeat deliveries, plan discounts, reports, and business support."
      body="This is the frontend shell for vendors, SMEs, offices, hotels, schools, and approved business accounts that need predictable delivery operations."
      chip="Business account"
      actionHref="/business/new-delivery"
      actionLabel="Create delivery"
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Business delivery history"
          body="Business users need order ID, route, fare, proof, status, support path, and monthly reporting."
        >
          <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
            {recentOrders.map(([id, route, status]) => (
              <div
                key={id}
                className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[1fr_1.4fr_0.7fr]"
              >
                <p className="text-sm font-medium text-[#071a2f]">{id}</p>
                <p className="text-sm text-[#667085]">{route}</p>
                <p className="text-sm font-medium text-[#1f7a55]">{status}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Plan and reporting">
          <DataRow
            label="Current plan"
            value="Growth Vendor"
            note="Mock account tier for repeat vendors."
          />
          <DataRow
            label="Discount rule"
            value="Within limit"
            note="Backend will enforce approved discount caps."
          />
          <DataRow
            label="Monthly report"
            value="Preview ready"
            note="Download will be added after backend reporting."
          />
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Request corporate account
          </Link>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <ActionCard
          title="Create repeat delivery"
          body="Use saved customer details, repeat routes, and instant business quote logic."
          href="/business/new-delivery"
          label="Create delivery"
        />
        <ActionCard
          title="Open business support"
          body="Ask about failed delivery, pricing, monthly reports, invoice-ready history, or account review."
          href="/business/support"
          label="Business support"
        />
        <ActionCard
          title="View business offer"
          body="Review vendor plan, corporate account, dedicated rider add-on, and reporting direction."
          href="/business/plan"
          label="View plans"
        />
      </section>

      <section className="mt-6">
        <Panel
          title="Operational note"
          body="Veylo should not promise guaranteed cheapest delivery. The business value is reliability, proof, repeat history, support, and controlled pricing."
        >
          <StatusChip tone="success">Backend-ready business account shell</StatusChip>
        </Panel>
      </section>
    </DashboardShell>
  );
}
