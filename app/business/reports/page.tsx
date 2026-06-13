import { BusinessShell } from "@/components/business/BusinessShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";

const metrics = [
  { label: "Monthly deliveries", value: "84", note: "Mock report period" },
  { label: "Completed", value: "76", note: "90.4% completion" },
  { label: "Failed / reviewed", value: "8", note: "Needs support analysis" },
  { label: "Total spend", value: "₦214k", note: "Invoice-ready placeholder" },
];

export default function BusinessReportsPage() {
  return (
    <BusinessShell
      eyebrow="Reports"
      title="Monthly business delivery summaries and invoice-ready history."
      body="Reports help businesses understand delivery spend, failed deliveries, discounts, proof status, and repeat-route activity."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Report summary">
          <DataRow label="Plan discount applied" value="₦18,000" note="Backend will calculate from approved discount rules." />
          <DataRow label="Average delivery fare" value="₦2,548" note="Useful for business planning." />
          <DataRow label="Top route" value="Ikenegbu → World Bank" note="Repeat routes can improve pricing intelligence later." />
          <DataRow label="Proof completion" value="94%" note="OTP and photo proof where required." />
        </Panel>

        <Panel title="Export placeholder">
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">Download report</p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Backend will later generate CSV/PDF reports with order IDs, dates, routes,
              fares, discounts, proof status, and support notes.
            </p>
            <button className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white">
              Download placeholder
            </button>
          </div>
        </Panel>
      </section>
    </BusinessShell>
  );
}
