import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const categories = [
  "Track order",
  "Pricing question",
  "Failed pickup",
  "Failed delivery",
  "Damage claim",
  "Lost item",
  "Payment",
  "Cancellation",
  "Business support",
  "Rider support",
  "Safety report",
];

export default function SupportPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Support"
          title="Clear help paths for delivery issues, pricing questions, and proof review."
          body="Support should be structured by order ID, issue type, proof, rider notes, customer notes, policy rules, and resolution history."
          chip="Support center"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Support categories"
            title="Users should know where to go when something changes."
          />
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#071a2f]"
              >
                {category}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoCard
              title="What to include"
              body="Add your order ID, issue category, clear explanation, photos or proof, recipient details where needed, and what outcome you need."
            />
            <InfoCard
              title="What support reviews"
              body="Support checks order timeline, fare details, OTP events, photo proof, rider notes, customer notes, and policy rules."
            />
          </div>

          <Link
            href="/support/new"
            className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Open support ticket
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
