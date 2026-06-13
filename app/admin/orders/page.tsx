import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminOrders } from "@/components/admin/RealAdminOrders";

export default async function AdminOrdersPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminOrders />
      </main>
      <Footer />
    </>
  );
}
