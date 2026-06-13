import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const segments = [
  {
    title: "Instagram vendors",
    body: "Send customer orders with clearer pricing, order history, rider status, and proof instead of chasing random riders.",
  },
  {
    title: "Restaurants and food vendors",
    body: "Use visible status, express options where available, and proof steps for time-sensitive customer deliveries.",
  },
  {
    title: "Boutiques and SMEs",
    body: "Deliver fashion, accessories, documents, and customer orders with package categories and support visibility.",
  },
  {
    title: "Offices, hotels, and schools",
    body: "Request repeat deliveries, document movement, errands, monthly summaries, and invoice-ready history.",
  },
];

const plans = [
  {
    title: "Pay-as-you-go Business",
    body: "For small vendors testing Veylo with delivery history, standard support, and per-order automated estimates.",
    meta: "Starter",
  },
  {
    title: "Vendor Monthly Plan",
    body: "For repeat vendors that need plan discounts, monthly summaries, business support, and clearer delivery tracking.",
    meta: "Growth",
  },
  {
    title: "Corporate Account",
    body: "For offices, hotels, schools, supermarkets, and organizations that need invoice-ready delivery operations.",
    meta: "Corporate",
  },
];

export default function BusinessDeliveryPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Business delivery"
          title="Reliable delivery operations without hiring your own rider team."
          body="Veylo helps vendors and organizations manage repeat deliveries with clearer fares, proof, delivery history, support, and plan discounts where approved."
          chip="For vendors and teams"
        />

        <section className="container-shell pb-12">
          <SectionHeader
            eyebrow="Who it serves"
            title="Built for the businesses that move items every week."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {segments.map((segment) => (
              <InfoCard key={segment.title} title={segment.title} body={segment.body} />
            ))}
          </div>
        </section>

        <section className="container-shell pb-16">
          <div className="card rounded-[32px] p-6 md:p-8">
            <SectionHeader
              eyebrow="Plans"
              title="Start simple, then grow into stronger delivery controls."
              body="Business accounts should improve repeat ordering, support, delivery history, and reporting without promising impossible cheapest-delivery claims."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <InfoCard key={plan.title} title={plan.title} body={plan.body} meta={plan.meta} />
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Request business account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
