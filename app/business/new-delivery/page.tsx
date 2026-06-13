import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessNewDelivery } from "@/components/business/RealBusinessNewDelivery";

export default async function BusinessNewDeliveryPage() {
  await requirePageRole(["BUSINESS", "ADMIN"]);

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
