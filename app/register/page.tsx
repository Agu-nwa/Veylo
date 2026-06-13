import Link from "next/link";
import { AuthShell, AuthSwitch } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Start with a simple Veylo account."
      body="The account flow should stay calm and practical. Customers can book faster, businesses can request plans, and riders can apply through guided onboarding."
      chip="Signup"
      sideTitle="Account types"
      sideItems={[
        "Customer: book deliveries, track orders, and open support.",
        "Business: request vendor plans, reports, and repeat delivery support.",
        "Rider: apply for verified rider onboarding.",
        "Admin: internal access only after backend role approval.",
      ]}
    >
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          Create your account
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Backend will later validate details, verify phone/email, hash passwords,
          and assign the correct role.
        </p>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Full name" placeholder="Enter full name" />
            <FormField label="Phone number" placeholder="Enter phone number" />
          </div>

          <FormField label="Email address" placeholder="Enter email address" type="email" />

          <label>
            <span className="label">Account type</span>
            <select className="field">
              <option>Customer</option>
              <option>Business / Vendor</option>
              <option>Rider applicant</option>
            </select>
          </label>

          <FormField label="Password" placeholder="Create password" type="password" />

          <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
            <input type="checkbox" className="mt-1 h-4 w-4" />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                I agree to Veylo delivery rules
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                Restricted items, waiting rules, proof, and support policies apply.
              </span>
            </span>
          </label>

          <button
            type="button"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Create frontend account
          </button>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/business/request"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Request business account
          </Link>
          <Link
            href="/riders/apply"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Apply as rider
          </Link>
        </div>

        <AuthSwitch text="Already have an account?" href="/login" label="Log in" />
      </div>
    </AuthShell>
  );
}
