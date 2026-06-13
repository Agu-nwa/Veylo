import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminQuotes } from "@/components/admin/RealAdminQuotes";

export default async function AdminQuotesPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminQuotes />
      </main>
      <Footer />
    </>
  );
}
