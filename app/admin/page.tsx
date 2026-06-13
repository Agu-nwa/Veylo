import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminOverview } from "@/components/admin/RealAdminOverview";

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminOverview />
      </main>
      <Footer />
    </>
  );
}
