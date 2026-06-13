import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminDisputes } from "@/components/admin/RealAdminDisputes";

export default async function AdminDisputesPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminDisputes />
      </main>
      <Footer />
    </>
  );
}
