"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type BusinessRequestResponse = {
  businessRequest: {
    id: string;
    businessName: string;
    businessType: string;
    contactName?: string;
    contactPhone: string;
    contactEmail?: string;
    weeklyDeliveryEstimate?: string;
    message?: string;
    status: string;
    createdAt?: string;
  };
};

const businessTypes = [
  "Instagram vendor",
  "Restaurant",
  "Boutique",
  "Office",
  "School",
  "Hotel",
  "Supermarket",
  "Pharmacy",
  "Other SME",
];

const deliveryEstimates = [
  "1 - 5 deliveries weekly",
  "6 - 15 deliveries weekly",
  "16 - 40 deliveries weekly",
  "40+ deliveries weekly",
  "Not sure yet",
];

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function RealBusinessRequestForm() {
  const [form, setForm] = useState({
    businessName: "",
    businessType: "Instagram vendor",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    weeklyDeliveryEstimate: "1 - 5 deliveries weekly",
    message: "",
  });

  const [accepted, setAccepted] = useState(false);
  const [businessRequest, setBusinessRequest] =
    useState<BusinessRequestResponse["businessRequest"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitRequest() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<BusinessRequestResponse>(
        "/api/business/request",
        {
          method: "POST",
          body: JSON.stringify({
            businessName: form.businessName,
            businessType: form.businessType,
            contactName: optional(form.contactName),
            contactPhone: form.contactPhone,
            contactEmail: optional(form.contactEmail),
            weeklyDeliveryEstimate: optional(form.weeklyDeliveryEstimate),
            message: optional(form.message),
          }),
        }
      );

      setBusinessRequest(response.data?.businessRequest ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit business request"
      );
    } finally {
      setLoading(false);
    }
  }

  const disabled =
    loading ||
    !form.businessName.trim() ||
    !form.businessType.trim() ||
    !form.contactPhone.trim() ||
    !accepted;

  if (businessRequest) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="success">Request submitted</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business request received.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Your request has been saved to the Veylo backend. Operations can now
          review the account and decide the right business delivery plan.
        </p>

        <div className="mt-7 rounded-[26px] border border-[#b7dfcf] bg-[#e8f6ef] p-5">
          <p className="text-sm text-[#667085]">Business</p>
          <p className="mt-1 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
            {businessRequest.businessName}
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-[#667085]">Type</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {businessRequest.businessType}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Status</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {businessRequest.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Phone</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {businessRequest.contactPhone}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setBusinessRequest(null);
              setForm({
                businessName: "",
                businessType: "Instagram vendor",
                contactName: "",
                contactPhone: "",
                contactEmail: "",
                weeklyDeliveryEstimate: "1 - 5 deliveries weekly",
                message: "",
              });
              setAccepted(false);
            }}
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Submit another request
          </button>

          <Link
            href="/business-delivery"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Back to business delivery
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="card h-fit rounded-[32px] p-6 md:p-8">
        <StatusChip tone="info">Business account</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Request a Veylo business delivery account.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#667085]">
          This form now writes directly to the backend. Veylo can review vendor,
          restaurant, office, and SME delivery needs before approving business
          plans.
        </p>

        <div className="mt-7 grid gap-3">
          {[
            "Repeat delivery support for vendors and SMEs.",
            "Backend-reviewed business account requests.",
            "Plan, discount, and reporting foundation already prepared.",
            "Admin business review APIs are ready for operations.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm leading-6 text-[#475467]"
            >
              {item}
            </div>
          ))}
        </div>
      </aside>

      <section className="card rounded-[32px] p-6 md:p-8">
        <p className="text-sm font-medium text-[#1f7a55]">Business details</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          Tell us about the business.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Submit accurate business information so operations can review the
          account properly.
        </p>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Business name</span>
              <input
                className="field"
                value={form.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
                placeholder="Example: Ikenegbu Fashion Vendor"
              />
            </label>

            <label>
              <span className="label">Business type</span>
              <select
                className="field"
                value={form.businessType}
                onChange={(event) =>
                  updateField("businessType", event.target.value)
                }
              >
                {businessTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Contact name</span>
              <input
                className="field"
                value={form.contactName}
                onChange={(event) =>
                  updateField("contactName", event.target.value)
                }
                placeholder="Person Veylo should contact"
              />
            </label>

            <label>
              <span className="label">Contact phone</span>
              <input
                className="field"
                value={form.contactPhone}
                onChange={(event) =>
                  updateField("contactPhone", event.target.value)
                }
                placeholder="Phone number"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Contact email</span>
              <input
                className="field"
                type="email"
                value={form.contactEmail}
                onChange={(event) =>
                  updateField("contactEmail", event.target.value)
                }
                placeholder="Optional email"
              />
            </label>

            <label>
              <span className="label">Weekly delivery estimate</span>
              <select
                className="field"
                value={form.weeklyDeliveryEstimate}
                onChange={(event) =>
                  updateField("weeklyDeliveryEstimate", event.target.value)
                }
              >
                {deliveryEstimates.map((estimate) => (
                  <option key={estimate}>{estimate}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span className="label">Message</span>
            <textarea
              className="field"
              rows={5}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us what kind of deliveries you need, where you operate, and your delivery volume."
            />
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                I confirm this business request is accurate
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                Veylo may review delivery volume, business type, service area,
                and plan fit before approval.
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
            onClick={submitRequest}
            disabled={disabled}
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit business request"}
          </button>
        </form>
      </section>
    </div>
  );
}
