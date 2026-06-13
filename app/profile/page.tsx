import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealProfilePanel } from "@/components/profile/RealProfilePanel";

export default function ProfilePage() {
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
