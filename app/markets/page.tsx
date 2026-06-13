import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

export default function MarketsPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Market run"
          title="A later pilot for simple, well-defined market errands."
          body="Market Run should only launch when task rules, payment handling, receipt proof, substitutions, and support review are clear. For now, it remains a controlled future service."
          chip="Pilot service"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Pilot rules"
            title="Do not launch ambiguous errands without controls."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Clear list required"
              body="The customer must provide a clear item list, budget, pickup point, and substitution rule."
            />
            <InfoCard
              title="Receipt and photo proof"
              body="Receipts, item photos, and rider notes help support review if a task is disputed."
            />
            <InfoCard
              title="Payment rules"
              body="Cash-heavy or unclear purchase handling should remain restricted until backend and operations are ready."
            />
          </div>
          <Link
            href="/services"
            className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            View active services
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
