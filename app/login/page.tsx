import Link from "next/link";
import { AuthShell, AuthSwitch } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Access your Veylo account."
      body="Customers, riders, businesses, and operations teams will use secure role-based access once backend authentication is connected."
      chip="Account access"
      sideTitle="What login will unlock"
      sideItems={[
        "Customer delivery history and saved routes.",
        "Business delivery reports and plan discounts.",
        "Rider job console and earnings view.",
        "Admin operations access for approved staff only.",
      ]}
    >
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          Welcome back
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          This is a frontend-only login screen. Backend will later handle sessions,
          password security, OTP, roles, and protected routes.
        </p>

        <form className="mt-7 grid gap-5">
          <FormField label="Email or phone" placeholder="Enter your email or phone" />
          <FormField label="Password" placeholder="Enter password" type="password" />

          <button
            type="button"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Continue to account
          </button>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/book"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Continue as guest
          </Link>
          <Link
            href="/support"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Need help?
          </Link>
        </div>

        <AuthSwitch text="New to Veylo?" href="/register" label="Create account" />
      </div>
    </AuthShell>
  );
}
