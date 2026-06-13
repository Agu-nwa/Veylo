import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessReports } from "@/components/business/RealBusinessReports";

export default function BusinessReportsPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBusinessReports />
      </main>
      <Footer />
    </>
  );
}
