import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const faqs = [
  {
    q: "How do I book a delivery?",
    a: "Choose a service, enter pickup and drop-off details, describe the item or task, select urgency, review your fare estimate, and confirm.",
  },
  {
    q: "How is my fare calculated?",
    a: "The estimate considers route distance, route time, service type, urgency, package category, zone access, waiting rules, surcharges, and business discounts where approved.",
  },
  {
    q: "Does Express guarantee instant delivery?",
    a: "No. Express means priority handling where rider availability and route conditions make it realistic. It should never imply reckless speed.",
  },
  {
    q: "How are riders verified?",
    a: "Riders should pass identity checks, profile review, phone verification, bike/document checks, training, and conduct requirements before approval.",
  },
  {
    q: "What items are restricted?",
    a: "Unsafe, illegal, cash-heavy, unapproved high-value, weapons, dangerous chemicals, and restricted items are not accepted. Some categories need extra proof or review.",
  },
  {
    q: "What happens if delivery fails?",
    a: "The order is marked failed pickup or failed delivery with a reason. Support may guide retry, return, cancellation, or review depending on policy.",
  },
  {
    q: "Can businesses get discounts?",
    a: "Approved business accounts may receive plan discounts, delivery history, reports, support paths, and invoice-ready summaries.",
  },
  {
    q: "How do I report a problem?",
    a: "Open a support request with your order ID, issue category, explanation, and any proof that can help review the case faster.",
  },
];

export default function FAQsPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="FAQs"
          title="Answers before users need support."
          body="The FAQ library should reduce confusion around booking, pricing, riders, proof, cancellations, failed delivery, business accounts, and claims."
          chip="Help library"
        />

        <section className="container-shell pb-16">
          <SectionHeader
            eyebrow="Common questions"
            title="Clear policies create more trust and fewer disputes."
          />
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.q} className="card rounded-[24px] p-5 md:p-6">
                <h3 className="text-base font-medium text-[#071a2f]">{faq.q}</h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">{faq.a}</p>
              </article>
            ))}
          </div>
          <Link
            href="/book"
            className="mt-8 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Book a delivery
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
