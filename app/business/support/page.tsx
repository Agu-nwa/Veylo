import Link from "next/link";
import { BusinessShell } from "@/components/business/BusinessShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";

export default function BusinessSupportPage() {
  return (
    <BusinessShell
      eyebrow="Business support"
      title="Support for business deliveries, reports, discounts, and account review."
      body="Business support should connect delivery issues to order IDs, proof, route history, plan rules, support notes, and monthly reports."
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Business support categories">
          <DataRow label="Failed delivery" value="Order-linked" note="Use when recipient, address, or rider issue prevented completion." />
          <DataRow label="Pricing question" value="Quote-linked" note="Support can review quote breakdown, discount, surcharge, and waiting fee." />
          <DataRow label="Report issue" value="Monthly report" note="Use when business history or report summary needs review." />
          <DataRow label="Plan review" value="Account-linked" note="Use for vendor plan, corporate account, or discount review." />
        </Panel>

        <Panel title="Open business ticket">
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">
              Business support uses the same ticket system with business category.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Backend will later connect tickets to business ID, order IDs, reports, proof,
              billing notes, and account manager review.
            </p>
            <Link
              href="/support/new"
              className="mt-5 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Open support ticket
            </Link>
          </div>
        </Panel>
      </section>
    </BusinessShell>
  );
}
