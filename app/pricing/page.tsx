import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const factors = [
  {
    title: "Base fare",
    body: "The starting fee for opening a delivery job, dispatch handling, and rider assignment.",
  },
  {
    title: "Distance and route time",
    body: "The estimated route distance and movement effort between pickup and drop-off.",
  },
  {
    title: "Service and urgency",
    body: "Pickup, errand, business delivery, express, or scheduled delivery may price differently.",
  },
  {
    title: "Package handling",
    body: "Document, small parcel, fragile, food, pharmacy where appropriate, or high-value categories may require different handling.",
  },
  {
    title: "Surcharges and waiting",
    body: "Peak, rain, night, rider availability, or waiting beyond the grace period may affect the final fare.",
  },
  {
    title: "Business discounts",
    body: "Approved vendor and corporate plans may receive discounts within approved plan limits.",
  },
];

const examples = [
  ["Short delivery", "Usually lower city fare", "Good for nearby parcel or document movement."],
  ["Express delivery", "Higher priority fare", "Used where faster assignment is realistic and safe."],
  ["Business delivery", "Plan discount may apply", "Useful for vendors with repeat customer orders."],
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Pricing"
          title="Clear fare estimates before you confirm."
          body="Veylo pricing is designed to be visible before booking. The estimate is based on delivery details, route factors, urgency, package category, business discounts, and applicable rules."
          chip="Automated estimate"
        />

        <section className="container-shell pb-12">
          <SectionHeader
            eyebrow="Fare factors"
            title="The estimate should explain the main reasons behind the price."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {factors.map((factor) => (
              <InfoCard key={factor.title} title={factor.title} body={factor.body} />
            ))}
          </div>
        </section>

        <section className="container-shell pb-16">
          <div className="card rounded-[32px] p-6 md:p-8">
            <SectionHeader
              eyebrow="Example quote logic"
              title="Examples are illustrative, not fixed universal prices."
              body="Owerri routes, timing, package type, waiting, and rider availability can change the final estimate."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {examples.map(([title, price, body]) => (
                <div key={title} className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                  <p className="text-sm font-medium text-[#1f7a55]">{price}</p>
                  <h3 className="mt-2 text-lg font-medium text-[#071a2f]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">{body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/book"
              className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Estimate a fare
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
