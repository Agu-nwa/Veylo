import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InfoCard } from "@/components/public/InfoCard";
import { PageIntro } from "@/components/public/PageIntro";
import { SectionHeader } from "@/components/public/SectionHeader";

const steps = [
  {
    title: "Choose what you need",
    body: "Select pickup and delivery, errand run, business delivery, express, or scheduled delivery where available.",
  },
  {
    title: "Enter addresses and details",
    body: "Add pickup, drop-off, landmark, contact person, package category, value band, urgency, and delivery notes.",
  },
  {
    title: "Get an instant estimate",
    body: "Veylo shows a fare estimate before confirmation using route, service, urgency, package, and applicable pricing rules.",
  },
  {
    title: "Confirm and track",
    body: "After confirmation, the order moves through assignment, pickup, transit, delivery, proof, and support states.",
  },
];

const statuses = [
  "Created",
  "Quoted",
  "Assigning rider",
  "Rider assigned",
  "Picked up",
  "In transit",
  "Delivered",
  "Failed or disputed when needed",
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="How it works"
          title="From address to proof in a few clear steps."
          body="Veylo is designed to reduce uncertainty. The customer sees the fare, understands the process, tracks the order, and has a support path if something changes."
          chip="Clear booking flow"
        />

        <section className="container-shell pb-12">
          <SectionHeader
            eyebrow="Booking sequence"
            title="Simple for customers, structured for operations."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <InfoCard
                key={step.title}
                meta={`Step ${index + 1}`}
                title={step.title}
                body={step.body}
              />
            ))}
          </div>
        </section>

        <section className="container-shell pb-16">
          <div className="card rounded-[32px] p-6 md:p-8">
            <SectionHeader
              eyebrow="Status visibility"
              title="Every order should show what is happening next."
              body="The user should never have to guess whether the item has been assigned, picked up, delayed, delivered, or escalated."
            />
            <div className="grid gap-3 md:grid-cols-4">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#071a2f]"
                >
                  {status}
                </div>
              ))}
            </div>
            <Link
              href="/book"
              className="mt-7 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Start booking
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
