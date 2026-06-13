import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";

export default function NewSupportTicketPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium text-[#1f7a55]">Open support ticket</p>
          <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
            Get help with a delivery, fare, proof, payment, or safety issue.
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[#667085]">
            Veylo support should be structured around order ID, issue category,
            proof, timeline, rider notes, customer notes, and policy review.
          </p>
        </div>

        <SupportTicketForm />
      </main>
      <Footer />
    </>
  );
}
