import { requirePageAuth } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealProfilePanel } from "@/components/profile/RealProfilePanel";

export default async function ProfilePage() {
  await requirePageAuth();

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealProfilePanel />
      </main>
      <Footer />
    </>
  );
}
