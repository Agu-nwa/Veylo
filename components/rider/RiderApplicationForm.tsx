"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type RiderApplicationResponse = {
  profile: {
    id?: string;
    _id?: string;
    displayName: string;
    phone: string;
    residentialArea?: string;
    bikeAccessType?: string;
    dispatchExperience?: string;
    referencePhone?: string;
    verificationStatus: string;
    tier: string;
  };
  note?: string;
};

export function RiderApplicationForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    residentialArea: "",
    bikeAccessType: "OWN_BIKE",
    dispatchExperience: "LESS_THAN_6_MONTHS",
    referencePhone: "",
    experienceNote: "",
  });

  const [conductAccepted, setConductAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] =
    useState<RiderApplicationResponse["profile"] | null>(null);
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitApplication() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RiderApplicationResponse>(
        "/api/rider/applications",
        {
          method: "POST",
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            residentialArea: form.residentialArea,
            bikeAccessType: form.bikeAccessType,
            dispatchExperience: form.dispatchExperience,
            referencePhone: form.referencePhone,
            experienceNote: form.experienceNote,
            conductAccepted,
          }),
        }
      );

      setSubmitted(response.data?.profile ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit rider application"
      );
    } finally {
      setLoading(false);
    }
  }

  const disabled =
    loading ||
    !form.fullName ||
    !form.email ||
    !form.phone ||
    !form.residentialArea ||
    !form.referencePhone ||
    !conductAccepted;

  if (submitted) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="success">Application submitted</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider application received.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Your rider profile has been created for admin review. Veylo operations
          will verify your details before you can receive rider jobs.
        </p>

        <div className="mt-7 rounded-[26px] border border-[#b7dfcf] bg-[#e8f6ef] p-5">
          <p className="text-sm text-[#667085]">Applicant</p>
          <p className="mt-1 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
            {submitted.displayName}
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-[#667085]">Status</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {submitted.verificationStatus}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Tier</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {submitted.tier}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Phone</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {submitted.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/riders/status"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Check application status
          </Link>
          <Link
            href="/riders"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Rider information
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
        Rider application
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#667085]">
        Apply with the same email or phone used on your Veylo account. Admin
        must verify you before rider jobs become available.
      </p>

      <div className="mt-5 rounded-2xl border border-[#f2d59b] bg-[#fff5dc] p-4 text-sm leading-6 text-[#8a5a00]">
        Before applying, create a normal Veylo account using this same email or
        phone. The application will attach to that account.
      </div>

      <form className="mt-7 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Full name</span>
            <input
              className="field"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Enter full name"
            />
          </label>

          <label>
            <span className="label">Phone number</span>
            <input
              className="field"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Enter phone number"
            />
          </label>
        </div>

        <label>
          <span className="label">Email address</span>
          <input
            className="field"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Use the email on your Veylo account"
          />
        </label>

        <label>
          <span className="label">Residential area</span>
          <input
            className="field"
            value={form.residentialArea}
            onChange={(event) =>
              updateField("residentialArea", event.target.value)
            }
            placeholder="Example: Ikenegbu, New Owerri"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Bike access</span>
            <select
              className="field"
              value={form.bikeAccessType}
              onChange={(event) =>
                updateField("bikeAccessType", event.target.value)
              }
            >
              <option value="OWN_BIKE">I own a bike</option>
              <option value="PERMISSIONED_BIKE">
                I have permission to use a bike
              </option>
              <option value="FLEET">I work with a fleet</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <label>
            <span className="label">Dispatch experience</span>
            <select
              className="field"
              value={form.dispatchExperience}
              onChange={(event) =>
                updateField("dispatchExperience", event.target.value)
              }
            >
              <option value="LESS_THAN_6_MONTHS">Less than 6 months</option>
              <option value="6_TO_12_MONTHS">6 to 12 months</option>
              <option value="1_TO_3_YEARS">1 to 3 years</option>
              <option value="3_PLUS_YEARS">3+ years</option>
            </select>
          </label>
        </div>

        <label>
          <span className="label">Guarantor or reference phone</span>
          <input
            className="field"
            value={form.referencePhone}
            onChange={(event) =>
              updateField("referencePhone", event.target.value)
            }
            placeholder="Enter reference phone"
          />
        </label>

        <label>
          <span className="label">Experience note</span>
          <textarea
            className="field"
            rows={5}
            value={form.experienceNote}
            onChange={(event) =>
              updateField("experienceNote", event.target.value)
            }
            placeholder="Tell us about your dispatch experience and active routes"
          />
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
          <input
            type="checkbox"
            checked={conductAccepted}
            onChange={(event) => setConductAccepted(event.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <span>
            <span className="block text-sm font-medium text-[#071a2f]">
              I agree to rider conduct rules
            </span>
            <span className="mt-1 block text-xs leading-5 text-[#667085]">
              No false status updates, harassment, item tampering, unsafe
              behavior, or proof manipulation.
            </span>
          </span>
        </label>

        {error ? (
          <div className="rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={submitApplication}
          disabled={disabled}
          className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit rider application"}
        </button>
      </form>

      <Link
        href="/register"
        className="mt-5 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
      >
        Create user account first
      </Link>
    </div>
  );
}
