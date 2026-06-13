import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderProfile } from "@/components/rider/RealRiderProfile";

export default function RiderProfilePage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealRiderProfile />
      </main>
      <Footer />
    </>
  );
}
