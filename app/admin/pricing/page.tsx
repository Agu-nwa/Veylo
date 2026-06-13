import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminPricing } from "@/components/admin/RealAdminPricing";

export default async function AdminPricingPage() {
  await requirePageRole(["ADMIN"]);

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
