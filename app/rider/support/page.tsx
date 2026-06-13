import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RoleSupportTicketForm } from "@/components/support/RoleSupportTicketForm";

export default function RiderSupportPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RoleSupportTicketForm
          audience="Rider"
          category="RIDER_SUPPORT"
          title="Rider support for jobs, status, and payouts."
          body="Create support tickets for assigned jobs, proof issues, payout questions, failed pickup, failed delivery, account verification, and rider operations support."
          dashboardHref="/rider"
        />
      </main>
      <Footer />
    </>
  );
}
