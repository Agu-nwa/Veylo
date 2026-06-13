import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";

export default function RiderApplyPage() {
  return (
    <AuthShell
      eyebrow="Rider application"
      title="Apply to become a verified Veylo rider."
      body="Veylo should onboard quality riders carefully. Verification, training, conduct, proof rules, and payout clarity protect the whole network."
      chip="Rider onboarding"
      sideTitle="Rider requirements"
      sideItems={[
        "Identity verification and clear profile.",
        "Bike details, phone number, and reference.",
        "Training on OTP, proof, package handling, and support.",
        "Professional conduct and safe delivery standards.",
      ]}
    >
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          Rider application
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          This is a frontend application form. Backend will later handle document
          upload, review status, verification, training, and rider account approval.
        </p>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Full name" placeholder="Enter full name" />
            <FormField label="Phone number" placeholder="Enter phone number" />
          </div>

          <FormField label="Residential area" placeholder="Example: Ikenegbu, New Owerri" />

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Bike access</span>
              <select className="field">
                <option>I own a bike</option>
                <option>I have permission to use a bike</option>
                <option>I work with a fleet</option>
              </select>
            </label>

            <label>
              <span className="label">Dispatch experience</span>
              <select className="field">
                <option>Less than 6 months</option>
                <option>6 months - 1 year</option>
                <option>1 - 3 years</option>
                <option>3+ years</option>
              </select>
            </label>
          </div>

          <FormField label="Guarantor or reference phone" placeholder="Enter reference phone" />

          <textarea
            className="field"
            rows={5}
            placeholder="Tell us about your dispatch experience and active routes"
          />

          <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
            <input type="checkbox" className="mt-1 h-4 w-4" />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                I agree to rider conduct rules
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                No false status updates, harassment, item tampering, or unsafe behavior.
              </span>
            </span>
          </label>

          <button
            type="button"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Submit application placeholder
          </button>
        </form>

        <Link
          href="/rider"
          className="mt-5 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
        >
          View rider console shell
        </Link>
      </div>
    </AuthShell>
  );
}
