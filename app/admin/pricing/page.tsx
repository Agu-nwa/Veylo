import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminPricing } from "@/components/admin/RealAdminPricing";

export default function AdminPricingPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminPricing />
      </main>
      <Footer />
    </>
  );
}
