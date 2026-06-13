"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type TicketCategory = "BUSINESS_SUPPORT" | "RIDER_SUPPORT";

type SupportTicketResponse = {
  ticket: {
    ticketId: string;
    orderId?: string;
    category: string;
    subject: string;
    status: string;
    priority: string;
    createdAt?: string;
  };
};

function splitContact(value: string) {
  const contact = value.trim();

  if (!contact) return {};

  if (contact.includes("@")) {
    return { contactEmail: contact };
  }

  return { contactPhone: contact };
}

export function RoleSupportTicketForm({
  audience,
  category,
  title,
  body,
  dashboardHref,
}: {
  audience: "Business" | "Rider";
  category: TicketCategory;
  title: string;
  body: string;
  dashboardHref: string;
}) {
  const [form, setForm] = useState({
    orderId: "",
    contact: "",
    subject: "",
    message: "",
  });

  const [confirmed, setConfirmed] = useState(false);
  const [ticket, setTicket] = useState<SupportTicketResponse["ticket"] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitTicket() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<SupportTicketResponse>(
        "/api/support/tickets",
        {
          method: "POST",
          body: JSON.stringify({
            orderId: form.orderId.trim() || undefined,
            category,
            subject: form.subject,
            message: form.message,
            evidenceUrls: [],
            ...splitContact(form.contact),
          }),
        }
      );

      setTicket(response.data?.ticket ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create ticket");
    } finally {
      setLoading(false);
    }
  }

  const disabled =
    loading ||
    form.subject.trim().length < 3 ||
    form.message.trim().length < 10 ||
    !confirmed;

  if (ticket) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="success">{audience} ticket created</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Support request submitted.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Your support request has been saved to the backend and can be reviewed
          by Veylo operations.
        </p>

        <div className="mt-7 rounded-[26px] border border-[#b7dfcf] bg-[#e8f6ef] p-5">
          <p className="text-sm text-[#667085]">Ticket ID</p>
          <p className="mt-1 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
            {ticket.ticketId}
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-[#667085]">Category</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {ticket.category.replaceAll("_", " ").toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Status</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {ticket.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Priority</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {ticket.priority}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setTicket(null);
              setForm({
                orderId: "",
                contact: "",
                subject: "",
                message: "",
              });
              setConfirmed(false);
            }}
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Create another ticket
          </button>

          <Link
            href={dashboardHref}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Back to dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="card h-fit rounded-[32px] p-6 md:p-8">
        <StatusChip tone="info">{audience} support</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#667085]">{body}</p>

        <div className="mt-7 grid gap-3">
          {[
            "Support requests are saved to the backend.",
            "Order IDs help operations review faster.",
            "Admin can review these tickets from protected operations screens.",
            "Proof upload will connect in a later evidence phase.",
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
        <p className="text-sm font-medium text-[#1f7a55]">Ticket details</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          Tell Veylo what happened.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Add the order ID if the issue is linked to a delivery.
        </p>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Order ID</span>
              <input
                className="field"
                value={form.orderId}
                onChange={(event) => updateField("orderId", event.target.value)}
                placeholder="Optional: VYL-..."
              />
            </label>

            <label>
              <span className="label">Contact phone or email</span>
              <input
                className="field"
                value={form.contact}
                onChange={(event) => updateField("contact", event.target.value)}
                placeholder="Where support can reach you"
              />
            </label>
          </div>

          <label>
            <span className="label">Subject</span>
            <input
              className="field"
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              placeholder="Short summary"
            />
          </label>

          <label>
            <span className="label">Message</span>
            <textarea
              className="field"
              rows={6}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Explain the issue clearly. Include delivery status, payment note, rider note, business note, or proof details."
            />
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                I confirm this information is accurate
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                Clear and accurate reports help Veylo support review faster.
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
            onClick={submitTicket}
            disabled={disabled}
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit support request"}
          </button>
        </form>
      </section>
    </div>
  );
}
