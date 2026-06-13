import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Start with a real Veylo account."
      body="Customers can book faster, businesses can request plans, and riders can apply through role-based onboarding."
      chip="Signup"
      sideTitle="Account types"
      sideItems={[
        "Customer: book deliveries, track orders, and open support.",
        "Business: request vendor plans, reports, and repeat delivery support.",
        "Rider: apply for verified rider onboarding.",
        "Admin: internal access only after backend role approval.",
      ]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
