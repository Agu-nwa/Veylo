import { requirePageRole } from "@/lib/server/auth/page-guards";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RoleSupportTicketForm } from "@/components/support/RoleSupportTicketForm";

export default async function BusinessSupportPage() {
  await requirePageRole(["BUSINESS", "ADMIN"]);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RoleSupportTicketForm
          audience="Business"
          category="BUSINESS_SUPPORT"
          title="Business support for delivery operations."
          body="Create support tickets for vendor deliveries, business reports, payment questions, repeated delivery issues, plan questions, and account support."
          dashboardHref="/business/dashboard"
        />
      </main>
      <Footer />
    </>
  );
}
