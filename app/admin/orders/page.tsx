import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminOrders } from "@/components/admin/RealAdminOrders";

export default function AdminOrdersPage() {
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
