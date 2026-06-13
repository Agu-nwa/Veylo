import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessHistory } from "@/components/business/RealBusinessHistory";

export default async function BusinessHistoryPage() {
  await requirePageRole(["BUSINESS", "ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBusinessHistory />
      </main>
      <Footer />
    </>
  );
}
