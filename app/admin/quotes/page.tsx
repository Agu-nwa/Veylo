import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminQuotes } from "@/components/admin/RealAdminQuotes";

export default function AdminQuotesPage() {
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
