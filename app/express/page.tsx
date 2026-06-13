import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

export default function ExpressPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Express delivery"
          title="Priority delivery without reckless promises."
          body="Express delivery gives priority handling where rider availability and route conditions make it realistic. Veylo should communicate speed with safety, not guaranteed instant delivery everywhere."
          chip="Priority service"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="How express works"
            title="Faster assignment, clearer status, controlled pricing."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Priority handling"
              body="Express orders are prioritized when verified rider supply and active zones allow it."
            />
            <InfoCard
              title="Urgency pricing"
              body="Express may apply an urgency multiplier with surcharge protection and clear quote expiry."
            />
            <InfoCard
              title="Status and proof"
              body="Pickup OTP, delivery OTP, photo proof where required, and support remain visible."
            />
          </div>
          <Link
            href="/book"
            className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Estimate express fare
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
