import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderEarnings } from "@/components/rider/RealRiderEarnings";

export default async function RiderEarningsPage() {
  await requirePageRole(["RIDER", "ADMIN"]);

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
