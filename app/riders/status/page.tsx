import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RiderApplicationStatus } from "@/components/rider/RiderApplicationStatus";

export default function RiderStatusPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RiderApplicationStatus />
      </main>
      <Footer />
    </>
  );
}
