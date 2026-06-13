import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderJobsList } from "@/components/rider/RealRiderJobsList";

export default async function RiderJobsPage() {
  await requirePageRole(["RIDER", "ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealRiderJobsList />
      </main>
      <Footer />
    </>
  );
}
