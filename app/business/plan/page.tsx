import Link from "next/link";
import { BusinessShell } from "@/components/business/BusinessShell";
import { StatusChip } from "@/components/shared/StatusChip";

const plans = [
  {
    title: "Pay-as-you-go Business",
    price: "Starter",
    body: "For small vendors testing Veylo with delivery history and standard support.",
    features: ["Per-order estimates", "Delivery history", "Standard support", "Business profile"],
  },
  {
    title: "Vendor Monthly Plan",
    price: "Growth",
    body: "For repeat vendors that need discounts, reports, support, and delivery visibility.",
    features: ["Plan discount", "Monthly report", "Priority support", "Repeat delivery tools"],
  },
  {
    title: "Corporate Account",
    price: "Corporate",
    body: "For offices, schools, hotels, supermarkets, and approved organizations.",
    features: ["Invoice-ready history", "Multiple requesters later", "Support line", "Scheduled delivery support"],
  },
];

export default function BusinessPlanPage() {
  return (
    <BusinessShell
      eyebrow="Plan"
      title="Business delivery plans should improve reliability, not promise unrealistic cheapest delivery."
      body="Veylo plans should be based on delivery history, support, reports, approved discounts, and predictable operations."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.title} className="card rounded-[28px] p-6">
            <StatusChip tone="info">{plan.price}</StatusChip>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
              {plan.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#667085]">{plan.body}</p>

            <div className="mt-6 grid gap-3">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] px-4 py-3 text-sm text-[#475467]"
                >
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/business/request"
              className="mt-6 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Request plan
            </Link>
          </article>
        ))}
      </section>
    </BusinessShell>
  );
}
