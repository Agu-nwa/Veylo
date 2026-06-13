import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";
import { serviceCards } from "@/lib/mock-data";

const trustItems = [
  {
    title: "Verified riders",
    body: "Rider profiles, verification status, ratings, and conduct rules help customers know who is handling their item.",
  },
  {
    title: "Clear fare estimates",
    body: "Customers see an automated estimate before confirmation with route, urgency, package, and applicable rules.",
  },
  {
    title: "Pickup and delivery proof",
    body: "OTP, timeline updates, and proof records reduce false pickup, false delivery, and unresolved disputes.",
  },
  {
    title: "Support path",
    body: "Pricing questions, failed pickup, failed delivery, cancellation, claims, and safety reports have clear support routes.",
  },
];

const audienceCards = [
  {
    title: "For everyday users",
    body: "Send parcels, documents, food packages, and personal items without guessing rider cost or delivery status.",
  },
  {
    title: "For vendors",
    body: "Give customers clearer delivery history, proof, status updates, and repeat delivery support.",
  },
  {
    title: "For businesses",
    body: "Use Veylo as a practical logistics layer without hiring, chasing, or managing your own rider team.",
  },
];

const processSteps = [
  "Enter pickup and drop-off details",
  "Choose service, package, and urgency",
  "Review instant fare estimate",
  "Confirm order and track rider status",
  "Use OTP and proof for pickup/delivery",
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="container-shell grid gap-10 pb-16 pt-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:pb-24 lg:pt-16">
          <div>
            <StatusChip tone="info">Owerri-first logistics platform</StatusChip>

            <h1 className="mt-6 max-w-3xl text-[34px] font-medium leading-[1.05] tracking-[-0.055em] text-[#071a2f] md:text-[44px]">
              Book verified riders for deliveries and errands across Owerri.
            </h1>

            <p className="mt-6 max-w-2xl text-[16px] leading-7 text-[#667085]">
              Veylo helps people, vendors, and businesses move items with clear
              fare estimates, status updates, verified rider handling, delivery
              proof, and support when something changes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="rounded-full bg-[#071a2f] px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-[#102a43]"
              >
                Estimate a delivery
              </Link>
              <Link
                href="/business-delivery"
                className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-6 py-3 text-center text-sm font-medium text-[#071a2f] transition hover:border-[#071a2f]/30"
              >
                Business delivery
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Instant estimate", "Verified riders", "Proof-backed"].map(
                (item) => (
                  <div key={item} className="card rounded-2xl px-4 py-3">
                    <p className="text-sm font-medium text-[#071a2f]">{item}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="card rounded-[34px] p-5 md:p-7">
            <div className="rounded-[28px] bg-[#071a2f] p-6 text-white">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm text-white/70">Delivery estimate</p>
                  <p className="mt-2 text-4xl font-medium tracking-[-0.05em]">
                    ₦2,400
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    Ikenegbu pickup to World Bank drop-off.
                  </p>
                </div>
                <StatusChip tone="success">Quoted</StatusChip>
              </div>

              <div className="mt-7 space-y-3">
                {[
                  ["Service", "Pickup & Delivery"],
                  ["Package", "Small parcel"],
                  ["Timing", "Standard"],
                  ["Proof", "Pickup OTP required"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 text-sm"
                  >
                    <span className="text-white/60">{label}</span>
                    <span className="text-white/90">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                "Quote expires if route conditions change",
                "Waiting fee notice shown before confirmation",
                "Support can review pricing questions",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] px-4 py-3 text-sm text-[#475467]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell py-12">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-medium text-[#1f7a55]">Services</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
              Start with the delivery needs Owerri already has.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Veylo focuses first on small goods, errands, vendor delivery,
              express handling, and business logistics before expanding into
              more complex services.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((service) => (
              <article key={service.type} className="card rounded-[24px] p-5">
                <h3 className="text-lg font-medium tracking-[-0.02em] text-[#071a2f]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  {service.description}
                </p>
                <p className="mt-5 rounded-2xl bg-[#f2ede4] p-3 text-xs leading-5 text-[#475467]">
                  {service.pricingNote}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-shell py-12">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-[#1f7a55]">How it works</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
                A clearer operating flow than calling random riders.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#667085]">
                The product is designed around trust: clear details, clear fare,
                visible status, verified rider handling, proof, and support.
              </p>
            </div>

            <div className="card rounded-[28px] p-6">
              <div className="grid gap-3">
                {processSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#071a2f] text-sm font-medium text-white">
                      {index + 1}
                    </span>
                    <p className="pt-2 text-sm leading-6 text-[#475467]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-12">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-medium text-[#1f7a55]">Trust system</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
              Trust should be visible before users ask for it.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <article key={item.title} className="card rounded-[24px] p-5">
                <h3 className="text-lg font-medium tracking-[-0.02em] text-[#071a2f]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-shell py-12">
          <div className="card rounded-[34px] bg-[#071a2f] p-6 text-white md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-medium text-white/68">
                  Business delivery
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  Reliable delivery operations without hiring your own rider
                  team.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">
                  Built for Instagram vendors, boutiques, restaurants, offices,
                  hotels, schools, pharmacies where appropriate, and SMEs that
                  need repeat delivery history, proof, reports, and support.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/business/request"
                    className="rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
                  >
                    Request business account
                  </Link>
                  <Link
                    href="/business-delivery"
                    className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-medium text-white"
                  >
                    Learn more
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] bg-white/8 p-5">
                {audienceCards.map((item) => (
                  <div
                    key={item.title}
                    className="border-b border-white/10 py-4 last:border-0"
                  >
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/66">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell pb-16 pt-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Book faster", "Create a delivery request and get a clear estimate."],
              ["Track clearly", "Follow rider status, OTP, proof, and support."],
              ["Grow with business", "Request vendor or corporate delivery support."],
            ].map(([title, body]) => (
              <article key={title} className="card rounded-[24px] p-5">
                <h3 className="text-lg font-medium tracking-[-0.02em] text-[#071a2f]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
