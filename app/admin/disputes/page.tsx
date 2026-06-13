import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminDisputes } from "@/components/admin/RealAdminDisputes";

export default function AdminDisputesPage() {
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
