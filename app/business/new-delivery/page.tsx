import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessNewDelivery } from "@/components/business/RealBusinessNewDelivery";

export default function BusinessNewDeliveryPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBusinessNewDelivery />
      </main>
      <Footer />
    </>
  );
}
