import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBookingFlow } from "@/components/booking/RealBookingFlow";

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBookingFlow />
      </main>
      <Footer />
    </>
  );
}
