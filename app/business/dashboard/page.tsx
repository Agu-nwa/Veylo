import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessDashboard } from "@/components/business/RealBusinessDashboard";

export default function BusinessDashboardPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBusinessDashboard />
      </main>
      <Footer />
    </>
  );
}
