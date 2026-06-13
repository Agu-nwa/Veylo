import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const contactPaths = [
  {
    title: "Customer support",
    body: "For order tracking, pricing questions, failed pickup, failed delivery, cancellation, claims, and safety reports.",
  },
  {
    title: "Business inquiries",
    body: "For vendor plans, business dashboard access, monthly reports, corporate accounts, and dedicated rider requests.",
  },
  {
    title: "Rider applications",
    body: "For verified riders who want structured delivery jobs, clear payout logic, training, and performance growth.",
  },
  {
    title: "Partnerships",
    body: "For hotels, offices, schools, restaurants, supermarkets, pharmacies where appropriate, and local operators.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Contact"
          title="Reach the right Veylo team for support, business, rider, or partnership needs."
          body="Veylo should keep contact routes professional and structured so customers, vendors, riders, and partners know where to start."
          chip="Contact Veylo"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Contact paths"
            title="One brand, separate support needs."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {contactPaths.map((path) => (
              <InfoCard key={path.title} title={path.title} body={path.body} />
            ))}
          </div>

          <div className="mt-8 card rounded-[28px] p-6 md:p-8">
            <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
              MVP contact form placeholder
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Backend will later power real ticket creation, order-linked support,
              rider application, and business account requests. For now this
              confirms the frontend structure.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="field" placeholder="Full name" />
              <input className="field" placeholder="Phone or email" />
              <select className="field">
                <option>Customer support</option>
                <option>Business inquiry</option>
                <option>Rider application</option>
                <option>Partnership</option>
              </select>
              <input className="field" placeholder="Order ID, if available" />
              <textarea
                className="field md:col-span-2"
                placeholder="Tell us what you need"
                rows={5}
              />
            </div>
            <button className="mt-6 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white">
              Submit placeholder
            </button>
          </div>

          <Link
            href="/book"
            className="mt-8 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Go to booking
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
