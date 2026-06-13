import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const riderRules = [
  {
    title: "Verification",
    body: "Riders should submit identity, phone, bike details, profile photo, and references before approval.",
  },
  {
    title: "Training",
    body: "Riders must understand pickup, delivery, OTP, proof, package handling, support, and restricted item rules.",
  },
  {
    title: "Fair payout logic",
    body: "Jobs should show estimated payout, route details, waiting rules, and minimum payout protection where applicable.",
  },
  {
    title: "Professional conduct",
    body: "No harassment, item tampering, false status updates, unauthorized stops, or unsafe behavior.",
  },
];

export default function RidersPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Rider signup"
          title="Structured jobs for verified riders across Owerri."
          body="Veylo should attract quality riders, not just volume. The rider experience must be clear, fair, disciplined, and support-backed."
          chip="Rider network"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Rider standards"
            title="Better rider quality creates better customer trust."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {riderRules.map((rule) => (
              <InfoCard key={rule.title} title={rule.title} body={rule.body} />
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Apply as rider
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
