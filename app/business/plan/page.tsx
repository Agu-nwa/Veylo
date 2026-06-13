import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessPlan } from "@/components/business/RealBusinessPlan";

export default async function BusinessPlanPage() {
  await requirePageRole(["BUSINESS", "ADMIN"]);

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
