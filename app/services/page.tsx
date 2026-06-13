import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const services = [
  {
    title: "Pickup & Delivery",
    body: "Move parcels, documents, food packages, and personal items within active Owerri zones with status updates and proof where required.",
    meta: "Core service",
  },
  {
    title: "Errand Run",
    body: "Request simple errands such as pickup, drop-off, light purchase, receipt collection, or document movement with clear instructions.",
    meta: "Core service",
  },
  {
    title: "Business / Vendor Delivery",
    body: "Support repeat deliveries for Instagram vendors, boutiques, restaurants, offices, hotels, and SMEs with history and support.",
    meta: "Business",
  },
  {
    title: "Express Delivery",
    body: "Priority handling for urgent deliveries where route conditions and verified rider availability make it realistic.",
    meta: "Priority",
  },
  {
    title: "Scheduled Delivery",
    body: "Plan ahead for business dispatch, office errands, document runs, and recurring delivery windows.",
    meta: "Early phase",
  },
  {
    title: "Secure Document Courier",
    body: "Move eligible documents with OTP, recipient confirmation, photo proof, and stricter delivery controls.",
    meta: "Early phase",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Services"
          title="Delivery and errand services built around Owerri movement."
          body="Veylo starts with the practical movements people and businesses already need: pickup, delivery, errands, vendor dispatch, express handling, and scheduled routes."
          chip="Service menu"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Available services"
            title="Each service has clear scope, pricing factors, and limits."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <InfoCard
                key={service.title}
                title={service.title}
                body={service.body}
                meta={service.meta}
              />
            ))}
          </div>
          <Link
            href="/book"
            className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Estimate a service
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
