import { AuthShell } from "@/components/auth/AuthShell";
import { RiderApplicationForm } from "@/components/rider/RiderApplicationForm";

export default function RiderApplyPage() {
  return (
    <AuthShell
      eyebrow="Rider application"
      title="Apply to become a verified Veylo rider."
      body="Veylo onboards riders carefully. Verification, training, conduct, proof rules, and payout clarity protect customers, businesses, riders, and the platform."
      chip="Rider onboarding"
      sideTitle="Rider requirements"
      sideItems={[
        "Create a Veylo account with the same email or phone.",
        "Provide bike access, location, experience, and reference.",
        "Accept proof, conduct, delivery, and support rules.",
        "Wait for admin verification before receiving jobs.",
      ]}
    >
      <RiderApplicationForm />
    </AuthShell>
  );
}
