import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessHistory } from "@/components/business/RealBusinessHistory";

export default function BusinessHistoryPage() {
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
