import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const safety = [
  {
    title: "Verified riders",
    body: "Rider identity, profile, training, conduct rules, and performance history should be visible to build trust.",
  },
  {
    title: "Pickup and delivery OTP",
    body: "Codes reduce false pickup and false delivery claims by confirming when the item changes hands.",
  },
  {
    title: "Photo proof",
    body: "Where required, proof supports support review, dispute resolution, and delivery accountability.",
  },
  {
    title: "Restricted item policy",
    body: "Unsafe, illegal, cash-heavy, unapproved high-value, and restricted items are not accepted in MVP flow.",
  },
  {
    title: "Claims review",
    body: "Damage or loss reports need order ID, evidence, package category, declared value band, and review.",
  },
  {
    title: "Support escalation",
    body: "Users should have clear paths for pricing questions, failed pickup, failed delivery, safety report, and disputes.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Safety and trust"
          title="Trust should be visible before the user needs support."
          body="Veylo is built around verification, status, OTP, proof, support, restricted item rules, and professional rider conduct."
          chip="Proof-backed delivery"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Trust system"
            title="The operational controls that protect customers, riders, and the platform."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {safety.map((item) => (
              <InfoCard key={item.title} title={item.title} body={item.body} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
