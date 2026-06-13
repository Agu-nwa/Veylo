import { AdvancedBookingFlow } from "@/components/booking/AdvancedBookingFlow";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium text-[#1f7a55]">Customer booking</p>
          <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
            Book with a clear estimate before confirmation.
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[#667085]">
            This upgraded frontend flow captures service type, locations,
            package details, policy confirmations, quote generation, quote
            expiry, quote refresh, and order creation state.
          </p>
        </div>

        <AdvancedBookingFlow />
      </main>
      <Footer />
    </>
  );
}
