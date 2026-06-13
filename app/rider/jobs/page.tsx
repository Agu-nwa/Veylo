import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderJobsList } from "@/components/rider/RealRiderJobsList";

export default function RiderJobsPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealRiderJobsList />
      </main>
      <Footer />
    </>
  );
}
