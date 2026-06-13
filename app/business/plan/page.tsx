import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessPlan } from "@/components/business/RealBusinessPlan";

export default function BusinessPlanPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBusinessPlan />
      </main>
      <Footer />
    </>
  );
}
