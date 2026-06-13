import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminBusinesses } from "@/components/admin/RealAdminBusinesses";

export default function AdminBusinessesPage() {
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
