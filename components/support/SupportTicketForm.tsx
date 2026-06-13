"use client";

import { useState } from "react";
import type { SupportCategory } from "@/lib/types";
import { StatusChip } from "@/components/shared/StatusChip";

const categories: Array<{ value: SupportCategory; label: string; note: string }> = [
  {
    value: "TRACK_ORDER",
    label: "Track order",
    note: "Use this when you need help understanding the current delivery status.",
  },
  {
    value: "PRICING_QUESTION",
    label: "Pricing question",
    note: "Use this for fare estimate, surcharge, discount, or waiting fee questions.",
  },
  {
    value: "FAILED_PICKUP",
    label: "Failed pickup",
    note: "Use this if pickup could not happen or the rider could not collect the item.",
  },
  {
    value: "FAILED_DELIVERY",
    label: "Failed delivery",
    note: "Use this if the recipient was unavailable, address was wrong, or delivery could not complete.",
  },
  {
    value: "DAMAGE_CLAIM",
    label: "Damage claim",
    note: "Use this when an item appears damaged and proof is available.",
  },
  {
    value: "LOST_ITEM",
    label: "Lost item",
    note: "Use this if an item cannot be located after pickup or delivery attempt.",
  },
  {
    value: "PAYMENT",
    label: "Payment",
    note: "Use this for payment confirmation, pending payment, refund, or reconciliation questions.",
  },
  {
    value: "CANCELLATION",
    label: "Cancellation",
    note: "Use this for cancellation fee, rider already moving, or order cancellation review.",
  },
  {
    value: "BUSINESS_SUPPORT",
    label: "Business support",
    note: "Use this for business account, reports, plan discount, or vendor delivery issues.",
  },
  {
    value: "RIDER_SUPPORT",
    label: "Rider support",
    note: "Use this for rider job, payout, proof, status update, or account questions.",
  },
  {
    value: "SAFETY_REPORT",
    label: "Safety report",
    note: "Use this for unsafe behavior, restricted items, harassment, or urgent safety concern.",
  },
];

export function SupportTicketForm() {
  const [category, setCategory] = useState<SupportCategory>("TRACK_ORDER");
  const [submitted, setSubmitted] = useState(false);

  const selected = categories.find((item) => item.value === category);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <aside className="card h-fit rounded-[28px] p-5 md:p-6">
        <p className="text-sm font-medium text-[#1f7a55]">Support category</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          Choose the issue type.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Good support starts with the right category, order ID, explanation,
          and proof. Backend will later create a real ticket record.
        </p>

        <div className="mt-6 grid gap-3">
          {categories.map((item) => {
            const active = item.value === category;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-[#071a2f] bg-[#071a2f] text-white"
                    : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f]"
                }`}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span
                  className={`mt-1 block text-xs leading-5 ${
                    active ? "text-white/68" : "text-[#667085]"
                  }`}
                >
                  {item.note}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="card rounded-[28px] p-5 md:p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-medium text-[#1f7a55]">Ticket details</p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
              Tell Veylo what happened.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Include the order ID and any proof that helps support review
              faster.
            </p>
          </div>
          <StatusChip tone={submitted ? "success" : "info"}>
            {submitted ? "Submitted" : selected?.label ?? "Support"}
          </StatusChip>
        </div>

        {submitted ? (
          <div className="mt-7 rounded-[28px] border border-[#b7dfcf] bg-[#e8f6ef] p-6">
            <StatusChip tone="success">Support request created</StatusChip>
            <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
              Ticket placeholder saved.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#475467]">
              This is a frontend confirmation. Backend will later save the
              ticket, attach proof, link the order, notify support, and show
              status updates.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Create another ticket
            </button>
          </div>
        ) : (
          <form className="mt-7 grid gap-5">
            <label>
              <span className="label">Support category</span>
              <select
                className="field"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as SupportCategory)
                }
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="label">Order ID</span>
                <input className="field" placeholder="Example: VYL-2401" />
              </label>

              <label>
                <span className="label">Contact phone or email</span>
                <input className="field" placeholder="Where support can reach you" />
              </label>
            </div>

            <label>
              <span className="label">Subject</span>
              <input
                className="field"
                placeholder="Short summary of the issue"
              />
            </label>

            <label>
              <span className="label">What happened?</span>
              <textarea
                className="field"
                rows={6}
                placeholder="Explain the issue clearly. Add location, rider status, proof, payment note, or delivery details where useful."
              />
            </label>

            <label>
              <span className="label">Proof placeholder</span>
              <input className="field" type="file" />
              <span className="mt-2 block text-xs leading-5 text-[#667085]">
                File upload is frontend-only for now. Backend will later handle
                secure proof storage.
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
              <input type="checkbox" className="mt-1 h-4 w-4" />
              <span>
                <span className="block text-sm font-medium text-[#071a2f]">
                  I confirm this information is accurate
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#667085]">
                  False reports, incomplete proof, or unclear order details may
                  delay support review.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Submit support request
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
