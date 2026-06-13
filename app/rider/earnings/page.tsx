import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderEarnings } from "@/components/rider/RealRiderEarnings";

export default function RiderEarningsPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealRiderEarnings />
      </main>
      <Footer />
    </>
  );
}
