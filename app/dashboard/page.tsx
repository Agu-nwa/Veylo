import { requirePageAuth } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealCustomerDashboard } from "@/components/dashboard/RealCustomerDashboard";

export default async function DashboardPage() {
  await requirePageAuth();

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealCustomerDashboard />
      </main>
      <Footer />
    </>
  );
}
