import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminBusinesses } from "@/components/admin/RealAdminBusinesses";

export default async function AdminBusinessesPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminBusinesses />
      </main>
      <Footer />
    </>
  );
}
