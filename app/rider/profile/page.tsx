import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderProfile } from "@/components/rider/RealRiderProfile";

export default async function RiderProfilePage() {
  await requirePageRole(["RIDER", "ADMIN"]);

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
