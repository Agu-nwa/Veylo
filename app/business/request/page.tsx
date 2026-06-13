import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealBusinessRequestForm } from "@/components/business/RealBusinessRequestForm";

export default function BusinessRequestPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealBusinessRequestForm />
      </main>
      <Footer />
    </>
  );
}
