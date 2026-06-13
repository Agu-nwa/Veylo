"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type QuoteResponse = {
  quote: {
    quoteId: string;
    finalFare: number;
    fareBreakdown: Array<{
      code: string;
      label: string;
      amount: number;
      kind: string;
      note?: string;
    }>;
    protections: string[];
    summaryFactors: string[];
    validUntil: string;
    status: string;
    ruleVersion: string;
    waitingRule: string;
    restrictedItemNotice: string;
  };
};

type OrderResponse = {
  order: {
    orderId: string;
    status: string;
    fare: number;
  };
  timeline: Array<unknown>;
  pickupOtp?: string;
  deliveryOtp?: string;
  otpNotice?: string;
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function RealBookingFlow() {
  const [form, setForm] = useState({
    pickupAddress: "Ikenegbu, Owerri",
    pickupLandmark: "Near main junction",
    dropoffAddress: "World Bank, Owerri",
    dropoffLandmark: "Estate gate",
    packageCategory: "Small parcel",
    urgency: "STANDARD",
    valueBand: "Normal value",
    contactName: "Demo Customer",
    contactPhone: "08000000001",
    recipientName: "Recipient User",
    recipientPhone: "08000000002",
    note: "Handle carefully",
  });

  const [quote, setQuote] = useState<QuoteResponse["quote"] | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function createQuote() {
    try {
      setError("");
      setOrder(null);
      setLoading("quote");

      const response = await apiRequest<QuoteResponse>("/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          serviceType: "PICKUP_DELIVERY",
          pickupAddress: form.pickupAddress,
          pickupLandmark: form.pickupLandmark,
          dropoffAddress: form.dropoffAddress,
          dropoffLandmark: form.dropoffLandmark,
          packageCategory: form.packageCategory,
          urgency: form.urgency,
          valueBand: form.valueBand,
          isBusinessAccount: false,
        }),
      });

      setQuote(response.data?.quote ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create quote");
    } finally {
      setLoading("");
    }
  }

  async function acceptAndCreateOrder() {
    if (!quote) return;

    try {
      setError("");
      setLoading("order");

      await apiRequest(`/api/quotes/${quote.quoteId}/accept`, {
        method: "PATCH",
      });

      const response = await apiRequest<OrderResponse>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          quoteId: quote.quoteId,
          pickup: {
            address: form.pickupAddress,
            landmark: form.pickupLandmark,
            contactName: form.contactName,
            phone: form.contactPhone,
          },
          dropoff: {
            address: form.dropoffAddress,
            landmark: form.dropoffLandmark,
            recipientName: form.recipientName,
            phone: form.recipientPhone,
          },
          package: {
            category: form.packageCategory,
            valueBand: form.valueBand,
            note: form.note,
            restrictedItemConfirmed: true,
          },
          waitingRuleAccepted: true,
        }),
      });

      setOrder(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create order. Please login first."
      );
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
      <section className="card rounded-[32px] p-5 md:p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-medium text-[#1f7a55]">Real backend quote</p>
            <h1 className="mt-2 text-[30px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[40px]">
              Book a real Veylo delivery.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              This form now creates a real backend quote, accepts it, and creates
              a MongoDB-backed order when you are logged in.
            </p>
          </div>
          <StatusChip tone={order ? "success" : quote ? "warning" : "info"}>
            {order ? "Order created" : quote ? "Quote ready" : "Booking"}
          </StatusChip>
        </div>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Pickup address</span>
              <input
                className="field"
                value={form.pickupAddress}
                onChange={(event) => updateField("pickupAddress", event.target.value)}
              />
            </label>

            <label>
              <span className="label">Pickup landmark</span>
              <input
                className="field"
                value={form.pickupLandmark}
                onChange={(event) => updateField("pickupLandmark", event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Drop-off address</span>
              <input
                className="field"
                value={form.dropoffAddress}
                onChange={(event) => updateField("dropoffAddress", event.target.value)}
              />
            </label>

            <label>
              <span className="label">Drop-off landmark</span>
              <input
                className="field"
                value={form.dropoffLandmark}
                onChange={(event) => updateField("dropoffLandmark", event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="label">Package</span>
              <select
                className="field"
                value={form.packageCategory}
                onChange={(event) => updateField("packageCategory", event.target.value)}
              >
                <option>Small parcel</option>
                <option>Document</option>
                <option>Food package</option>
                <option>Fragile item</option>
              </select>
            </label>

            <label>
              <span className="label">Urgency</span>
              <select
                className="field"
                value={form.urgency}
                onChange={(event) => updateField("urgency", event.target.value)}
              >
                <option value="STANDARD">Standard</option>
                <option value="EXPRESS">Express</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </label>

            <label>
              <span className="label">Value band</span>
              <select
                className="field"
                value={form.valueBand}
                onChange={(event) => updateField("valueBand", event.target.value)}
              >
                <option>Normal value</option>
                <option>Low value</option>
                <option>High value</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Pickup contact name</span>
              <input
                className="field"
                value={form.contactName}
                onChange={(event) => updateField("contactName", event.target.value)}
              />
            </label>

            <label>
              <span className="label">Pickup contact phone</span>
              <input
                className="field"
                value={form.contactPhone}
                onChange={(event) => updateField("contactPhone", event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Recipient name</span>
              <input
                className="field"
                value={form.recipientName}
                onChange={(event) => updateField("recipientName", event.target.value)}
              />
            </label>

            <label>
              <span className="label">Recipient phone</span>
              <input
                className="field"
                value={form.recipientPhone}
                onChange={(event) => updateField("recipientPhone", event.target.value)}
              />
            </label>
          </div>

          <label>
            <span className="label">Package note</span>
            <textarea
              className="field"
              rows={4}
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
              {error}{" "}
              <Link href="/login" className="font-medium underline">
                Login here
              </Link>
              .
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={createQuote}
              disabled={loading !== ""}
              className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading === "quote" ? "Creating quote..." : "Generate real quote"}
            </button>

            <button
              type="button"
              onClick={acceptAndCreateOrder}
              disabled={!quote || loading !== ""}
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f] disabled:opacity-50"
            >
              {loading === "order" ? "Creating order..." : "Accept quote & create order"}
            </button>
          </div>
        </form>
      </section>

      <aside className="grid gap-5">
        <section className="card rounded-[30px] p-5">
          <p className="text-sm font-medium text-[#1f7a55]">Quote result</p>

          {quote ? (
            <div className="mt-5">
              <p className="text-sm text-[#667085]">Quote ID</p>
              <p className="mt-1 break-all text-sm font-medium text-[#071a2f]">
                {quote.quoteId}
              </p>

              <p className="mt-5 text-sm text-[#667085]">Final fare</p>
              <p className="mt-1 text-4xl font-medium tracking-[-0.05em] text-[#071a2f]">
                {money.format(quote.finalFare)}
              </p>

              <div className="mt-5 grid gap-2">
                {quote.fareBreakdown.map((item) => (
                  <div
                    key={item.code}
                    className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-3"
                  >
                    <div className="flex justify-between gap-4">
                      <p className="text-sm font-medium text-[#071a2f]">
                        {item.label}
                      </p>
                      <p className="text-sm text-[#475467]">
                        {money.format(item.amount)}
                      </p>
                    </div>
                    {item.note ? (
                      <p className="mt-1 text-xs leading-5 text-[#667085]">
                        {item.note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-5 text-[#667085]">
                Valid until {new Date(quote.validUntil).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Generate a quote to see backend pricing, breakdown, protections,
              and expiry.
            </p>
          )}
        </section>

        <section className="card rounded-[30px] p-5">
          <p className="text-sm font-medium text-[#1f7a55]">Order result</p>

          {order?.order ? (
            <div className="mt-5">
              <p className="text-sm text-[#667085]">Order ID</p>
              <p className="mt-1 text-xl font-medium text-[#071a2f]">
                {order.order.orderId}
              </p>

              <p className="mt-4 text-sm text-[#667085]">Status</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {order.order.status}
              </p>

              {order.pickupOtp || order.deliveryOtp ? (
                <div className="mt-5 rounded-2xl bg-[#fff5dc] p-4">
                  <p className="text-sm font-medium text-[#071a2f]">
                    OTPs shown once for testing
                  </p>
                  <p className="mt-2 text-sm text-[#667085]">
                    Pickup OTP: {order.pickupOtp}
                  </p>
                  <p className="text-sm text-[#667085]">
                    Delivery OTP: {order.deliveryOtp}
                  </p>
                </div>
              ) : null}

              <Link
                href={`/orders/${order.order.orderId}`}
                className="mt-5 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                View order page
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Login first, then accept a quote to create a real database-backed
              order.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}
