import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminAnalytics } from "@/components/admin/RealAdminAnalytics";

export default async function AdminAnalyticsPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminAnalytics />
      </main>
      <Footer />
    </>
  );
}
