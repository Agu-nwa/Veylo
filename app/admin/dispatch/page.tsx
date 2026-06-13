import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminDispatch } from "@/components/admin/RealAdminDispatch";

export default async function AdminDispatchPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminDispatch />
      </main>
      <Footer />
    </>
  );
}
