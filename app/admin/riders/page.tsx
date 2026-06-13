import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminRiders } from "@/components/admin/RealAdminRiders";

export default function AdminRidersPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminRiders />
      </main>
      <Footer />
    </>
  );
}
