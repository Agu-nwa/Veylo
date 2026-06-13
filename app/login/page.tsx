import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Access your Veylo account."
      body="Customers, riders, businesses, and operations teams use secure role-based access for delivery records, quotes, orders, rider jobs, support, and admin operations."
      chip="Account access"
      sideTitle="What login unlocks"
      sideItems={[
        "Customer delivery history and saved routes.",
        "Business delivery reports and plan discounts.",
        "Rider job console and earnings view.",
        "Admin operations access for approved staff only.",
      ]}
    >
      <LoginForm />
    </AuthShell>
  );
}
