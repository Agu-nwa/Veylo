import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealAdminAuditLogs } from "@/components/admin/RealAdminAuditLogs";

export default function AdminAuditLogsPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealAdminAuditLogs />
      </main>
      <Footer />
    </>
  );
}
