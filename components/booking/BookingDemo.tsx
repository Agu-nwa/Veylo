"use client";

import { useMemo, useState } from "react";
import { serviceCards } from "@/lib/mock-data";
import { generateMockQuote } from "@/lib/pricing/mockQuoteAdapter";
import type { PricingQuote, QuoteInput, ServiceType, Urgency } from "@/lib/types";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function BookingDemo() {
  const [form, setForm] = useState<QuoteInput>({
    serviceType: "PICKUP_DELIVERY",
    pickup: "Ikenegbu, Owerri",
    dropoff: "World Bank, Owerri",
    packageCategory: "Small parcel",
    urgency: "STANDARD",
    valueBand: "Normal value",
    isBusiness: false,
  });

  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedService = useMemo(
    () => serviceCards.find((service) => service.type === form.serviceType),
    [form.serviceType]
  );

  const update = <Key extends keyof QuoteInput>(key: Key, value: QuoteInput[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function handleEstimate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const nextQuote = await generateMockQuote(form);
    setQuote(nextQuote);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
      <form onSubmit={handleEstimate} className="card rounded-[28px] p-5 md:p-7">
        <div>
          <p className="text-sm font-medium text-[#1f7a55]">Booking flow</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-[#071a2f]">
            Estimate a delivery before confirming.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            This is a frontend mock of the automated quote experience. Backend
            will later own the final production pricing engine.
          </p>
        </div>

        <div className="mt-7 grid gap-5">
          <label>
            <span className="label">Service type</span>
            <select
              className="field"
              value={form.serviceType}
              onChange={(event) =>
                update("serviceType", event.target.value as ServiceType)
              }
            >
              {serviceCards.map((service) => (
                <option key={service.type} value={service.type}>
                  {service.title}
                </option>
              ))}
            </select>
            {selectedService ? (
              <span className="mt-2 block text-xs leading-5 text-[#667085]">
                {selectedService.pricingNote}
              </span>
            ) : null}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Pickup address</span>
              <input
                className="field"
                value={form.pickup}
                onChange={(event) => update("pickup", event.target.value)}
                placeholder="Where should the rider pick up?"
                required
              />
            </label>

            <label>
              <span className="label">Drop-off address</span>
              <input
                className="field"
                value={form.dropoff}
                onChange={(event) => update("dropoff", event.target.value)}
                placeholder="Where should the rider deliver?"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="label">Package category</span>
              <select
                className="field"
                value={form.packageCategory}
                onChange={(event) => update("packageCategory", event.target.value)}
              >
                <option>Small parcel</option>
                <option>Document</option>
                <option>Food package</option>
                <option>Fragile item</option>
                <option>Pharmacy item where appropriate</option>
              </select>
            </label>

            <label>
              <span className="label">Urgency</span>
              <select
                className="field"
                value={form.urgency}
                onChange={(event) => update("urgency", event.target.value as Urgency)}
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
                onChange={(event) => update("valueBand", event.target.value)}
              >
                <option>Normal value</option>
                <option>High value</option>
                <option>Low value</option>
              </select>
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
            <input
              type="checkbox"
              checked={Boolean(form.isBusiness)}
              onChange={(event) => update("isBusiness", event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                Apply business account logic
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                Simulates approved vendor discount for repeat delivery accounts.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
            <input required type="checkbox" className="mt-1 h-4 w-4" />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                I confirm this is not restricted or unsafe
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                Cash-heavy, illegal, unsafe, and unapproved high-value items are
                restricted during MVP.
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#102a43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating estimate..." : "Generate instant estimate"}
          </button>
        </div>
      </form>

      <aside className="card rounded-[28px] p-5 md:p-7">
        <p className="text-sm font-medium text-[#071a2f]">Fare estimate</p>

        {!quote ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[#d8d0c3] bg-[#fffdf8] p-6">
            <p className="text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
              Awaiting details
            </p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              The fare estimate will show total fare, key pricing factors,
              waiting warning, quote expiry, and support-ready pricing data.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="rounded-3xl bg-[#071a2f] p-6 text-white">
              <p className="text-sm text-white/70">Estimated fare</p>
              <p className="mt-2 text-4xl font-medium tracking-[-0.05em]">
                {money.format(quote.finalFare)}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">
                Valid for {quote.validMinutes} minutes. Quote expires around{" "}
                {new Date(quote.expiresAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                .
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {quote.breakdown.map((item) => (
                <div
                  key={`${item.code}-${item.label}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#071a2f]">
                        {item.label}
                      </p>
                      {item.note ? (
                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        item.kind === "discount"
                          ? "text-[#1f7a55]"
                          : "text-[#071a2f]"
                      }`}
                    >
                      {item.kind === "protection"
                        ? "Checked"
                        : `${item.kind === "discount" ? "-" : ""}${money.format(
                            item.amount
                          )}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-[#e5ded2] bg-[#f2ede4] p-5">
              <p className="text-sm font-medium text-[#071a2f]">
                Before confirmation
              </p>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                {quote.waitingRule}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                {quote.restrictedItemNotice}
              </p>
            </div>

            <button className="mt-5 w-full rounded-full bg-[#1f7a55] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Confirm mock order
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
