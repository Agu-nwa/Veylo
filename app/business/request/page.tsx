import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";

export default function BusinessRequestPage() {
  return (
    <AuthShell
      eyebrow="Business request"
      title="Request a Veylo business delivery account."
      body="Business accounts are for vendors, SMEs, offices, hotels, schools, supermarkets, restaurants, and approved organizations that need repeat delivery support."
      chip="Business onboarding"
      sideTitle="Business account benefits"
      sideItems={[
        "Repeat delivery creation and history.",
        "Approved plan discounts within limits.",
        "Monthly report and invoice-ready summary.",
        "Priority support path for delivery issues.",
      ]}
    >
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          Business account request
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          This is a frontend request form. Backend will later store requests,
          review status, business verification, plan rules, and discount limits.
        </p>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Business name" placeholder="Enter business name" />
            <FormField label="Contact phone" placeholder="Enter phone number" />
          </div>

          <FormField label="Business email" placeholder="Enter business email" type="email" />

          <label>
            <span className="label">Business type</span>
            <select className="field">
              <option>Instagram vendor</option>
              <option>Restaurant / food vendor</option>
              <option>Boutique / fashion</option>
              <option>Office / school / hotel</option>
              <option>Supermarket / pharmacy where appropriate</option>
              <option>Other SME</option>
            </select>
          </label>

          <label>
            <span className="label">Estimated weekly deliveries</span>
            <select className="field">
              <option>1 - 10</option>
              <option>11 - 30</option>
              <option>31 - 75</option>
              <option>75+</option>
            </select>
          </label>

          <textarea
            className="field"
            rows={5}
            placeholder="Tell us what kind of deliveries your business needs"
          />

          <button
            type="button"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Submit request placeholder
          </button>
        </form>

        <Link
          href="/business/dashboard"
          className="mt-5 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
        >
          View business dashboard shell
        </Link>
      </div>
    </AuthShell>
  );
}
