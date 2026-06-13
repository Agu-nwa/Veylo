"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { serviceCards } from "@/lib/mock-data";
import { createMockOrder, refreshQuote, requestQuote } from "@/lib/api-client";
import type {
  BookingDraft,
  MockOrderResponse,
  QuoteUiState,
} from "@/lib/contracts/booking-contracts";
import type { PricingQuote, ServiceType, Urgency } from "@/lib/types";
import { StatusChip } from "@/components/shared/StatusChip";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const steps = [
  { id: 1, label: "Service" },
  { id: 2, label: "Locations" },
  { id: 3, label: "Package" },
  { id: 4, label: "Quote" },
];

const initialDraft: BookingDraft = {
  serviceType: "PICKUP_DELIVERY",
  pickup: "Ikenegbu, Owerri",
  dropoff: "World Bank, Owerri",
  packageCategory: "Small parcel",
  urgency: "STANDARD",
  valueBand: "Normal value",
  isBusiness: false,
  pickupLandmark: "Near main junction",
  pickupContactName: "Pickup contact",
  pickupContactPhone: "08000000000",
  dropoffLandmark: "Close to estate gate",
  recipientName: "Recipient",
  recipientPhone: "08100000000",
  deliveryNote: "Handle with care and call support if address is unclear.",
  restrictedItemConfirmed: false,
  waitingRuleAccepted: false,
};

export function AdvancedBookingFlow() {
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [quoteState, setQuoteState] = useState<QuoteUiState>("IDLE");
  const [order, setOrder] = useState<MockOrderResponse | null>(null);

  const selectedService = useMemo(
    () => serviceCards.find((service) => service.type === draft.serviceType),
    [draft.serviceType]
  );

  const update = <Key extends keyof BookingDraft>(
    key: Key,
    value: BookingDraft[Key]
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const goNext = () => setStep((current) => Math.min(current + 1, 4));
  const goBack = () => setStep((current) => Math.max(current - 1, 1));

  async function generateQuote() {
    setQuoteState("GENERATING");
    const nextQuote = await requestQuote(draft);
    setQuote(nextQuote);
    setQuoteState("READY");
    setStep(4);
  }

  async function handleRefreshQuote() {
    setQuoteState("GENERATING");
    const nextQuote = await refreshQuote(draft);
    setQuote(nextQuote);
    setQuoteState("REFRESHED");
  }

  async function handleConfirmOrder() {
    if (!quote) return;
    setQuoteState("ACCEPTED");
    const response = await createMockOrder(draft, quote);
    setOrder(response);
  }

  const canGenerateQuote =
    draft.pickup.trim().length > 2 &&
    draft.dropoff.trim().length > 2 &&
    draft.restrictedItemConfirmed &&
    draft.waitingRuleAccepted;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="card h-fit rounded-[28px] p-5 md:p-6">
        <p className="text-sm font-medium text-[#071a2f]">Booking progress</p>

        <div className="mt-5 grid gap-3">
          {steps.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                step === item.id
                  ? "border-[#071a2f] bg-[#071a2f] text-white"
                  : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f]"
              }`}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs opacity-70">Step {item.id}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-[#f2ede4] p-5">
          <p className="text-sm font-medium text-[#071a2f]">Trust reminders</p>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-[#667085]">
            <li>• Fare estimate appears before confirmation.</li>
            <li>• Restricted items must be confirmed.</li>
            <li>• Waiting rules are visible before booking.</li>
            <li>• Backend later stores quote, audit, and order events.</li>
          </ul>
        </div>
      </aside>

      <section className="card rounded-[28px] p-5 md:p-7">
        {step === 1 ? (
          <div>
            <StepHeader
              eyebrow="Step 1"
              title="Choose the service type."
              body="The service selected controls the pricing factors, proof requirements, and operational handling."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {serviceCards.map((service) => {
                const active = draft.serviceType === service.type;
                return (
                  <button
                    key={service.type}
                    type="button"
                    onClick={() => update("serviceType", service.type)}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      active
                        ? "border-[#071a2f] bg-[#071a2f] text-white"
                        : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f]"
                    }`}
                  >
                    <h3 className="text-base font-medium">{service.title}</h3>
                    <p
                      className={`mt-3 text-sm leading-6 ${
                        active ? "text-white/72" : "text-[#667085]"
                      }`}
                    >
                      {service.description}
                    </p>
                    <p
                      className={`mt-4 text-xs leading-5 ${
                        active ? "text-white/62" : "text-[#667085]"
                      }`}
                    >
                      {service.pricingNote}
                    </p>
                  </button>
                );
              })}
            </div>

            <FooterActions onNext={goNext} />
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <StepHeader
              eyebrow="Step 2"
              title="Enter pickup and drop-off details."
              body="Addresses, landmarks, and contacts help reduce failed pickup, failed delivery, and support disputes."
            />

            <div className="mt-6 grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="label">Pickup address</span>
                  <input
                    className="field"
                    value={draft.pickup}
                    onChange={(event) => update("pickup", event.target.value)}
                  />
                </label>
                <label>
                  <span className="label">Drop-off address</span>
                  <input
                    className="field"
                    value={draft.dropoff}
                    onChange={(event) => update("dropoff", event.target.value)}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="label">Pickup landmark</span>
                  <input
                    className="field"
                    value={draft.pickupLandmark}
                    onChange={(event) =>
                      update("pickupLandmark", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span className="label">Drop-off landmark</span>
                  <input
                    className="field"
                    value={draft.dropoffLandmark}
                    onChange={(event) =>
                      update("dropoffLandmark", event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="label">Pickup contact phone</span>
                  <input
                    className="field"
                    value={draft.pickupContactPhone}
                    onChange={(event) =>
                      update("pickupContactPhone", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span className="label">Recipient phone</span>
                  <input
                    className="field"
                    value={draft.recipientPhone}
                    onChange={(event) =>
                      update("recipientPhone", event.target.value)
                    }
                  />
                </label>
              </div>
            </div>

            <FooterActions onBack={goBack} onNext={goNext} />
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <StepHeader
              eyebrow="Step 3"
              title="Describe the item or task."
              body="Package category, value band, urgency, and policy confirmation protect the customer, rider, and platform."
            />

            <div className="mt-6 grid gap-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label>
                  <span className="label">Package category</span>
                  <select
                    className="field"
                    value={draft.packageCategory}
                    onChange={(event) =>
                      update("packageCategory", event.target.value)
                    }
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
                    value={draft.urgency}
                    onChange={(event) =>
                      update("urgency", event.target.value as Urgency)
                    }
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
                    value={draft.valueBand}
                    onChange={(event) => update("valueBand", event.target.value)}
                  >
                    <option>Normal value</option>
                    <option>High value</option>
                    <option>Low value</option>
                  </select>
                </label>
              </div>

              <label>
                <span className="label">Delivery note</span>
                <textarea
                  className="field"
                  rows={5}
                  value={draft.deliveryNote}
                  onChange={(event) => update("deliveryNote", event.target.value)}
                />
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                <input
                  type="checkbox"
                  checked={Boolean(draft.isBusiness)}
                  onChange={(event) => update("isBusiness", event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-medium text-[#071a2f]">
                    Apply business account logic
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#667085]">
                    Simulates an approved vendor discount line item.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                <input
                  type="checkbox"
                  checked={draft.restrictedItemConfirmed}
                  onChange={(event) =>
                    update("restrictedItemConfirmed", event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-medium text-[#071a2f]">
                    I confirm this is not restricted or unsafe
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#667085]">
                    Unsafe, illegal, cash-heavy, and unapproved high-value items
                    are not accepted in MVP.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                <input
                  type="checkbox"
                  checked={draft.waitingRuleAccepted}
                  onChange={(event) =>
                    update("waitingRuleAccepted", event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-medium text-[#071a2f]">
                    I understand waiting rules
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#667085]">
                    Waiting beyond the free grace period may affect the final
                    fare.
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={generateQuote}
                disabled={!canGenerateQuote || quoteState === "GENERATING"}
                className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quoteState === "GENERATING"
                  ? "Generating quote..."
                  : "Generate instant quote"}
              </button>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <StepHeader
              eyebrow="Step 4"
              title="Review quote and confirm order."
              body="The user should understand the fare, expiry, waiting rule, support path, and what proof will be collected."
            />

            {!quote ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#d8d0c3] bg-[#fffdf8] p-6">
                <p className="text-sm leading-6 text-[#667085]">
                  No quote generated yet. Go back and complete the package step.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[28px] bg-[#071a2f] p-6 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/70">Estimated fare</p>
                      <p className="mt-2 text-4xl font-medium tracking-[-0.05em]">
                        {money.format(quote.finalFare)}
                      </p>
                    </div>
                    <QuoteStateChip state={quoteState} />
                  </div>

                  <p className="mt-5 text-sm leading-6 text-white/72">
                    Quote valid for {quote.validMinutes} minutes. Backend will
                    later enforce quote expiry and refresh logic.
                  </p>

                  <div className="mt-5 space-y-2">
                    {quote.summaryFactors.map((factor) => (
                      <div
                        key={factor}
                        className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/78"
                      >
                        {factor}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      disabled={quoteState === "EXPIRED" || Boolean(order)}
                      className="rounded-full bg-[#1f7a55] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {order ? "Order created" : "Accept quote and create order"}
                    </button>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setQuoteState("EXPIRED")}
                        className="rounded-full border border-white/18 px-5 py-3 text-sm font-medium text-white"
                      >
                        Simulate expired
                      </button>
                      <button
                        type="button"
                        onClick={handleRefreshQuote}
                        className="rounded-full border border-white/18 px-5 py-3 text-sm font-medium text-white"
                      >
                        Refresh quote
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {quote.breakdown.map((line) => (
                    <div
                      key={`${line.code}-${line.label}`}
                      className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#071a2f]">
                            {line.label}
                          </p>
                          {line.note ? (
                            <p className="mt-1 text-xs leading-5 text-[#667085]">
                              {line.note}
                            </p>
                          ) : null}
                        </div>
                        <p
                          className={`text-right text-sm font-medium ${
                            line.kind === "discount"
                              ? "text-[#1f7a55]"
                              : "text-[#071a2f]"
                          }`}
                        >
                          {line.kind === "protection"
                            ? "Checked"
                            : `${line.kind === "discount" ? "-" : ""}${money.format(
                                line.amount
                              )}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order ? (
              <div className="mt-6 rounded-[28px] border border-[#b7dfcf] bg-[#e8f6ef] p-6">
                <StatusChip tone="success">Order created</StatusChip>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
                  {order.orderId}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#475467]">
                  {order.message}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#475467]">
                  {order.nextAction}
                </p>
                <Link
                  href="/orders"
                  className="mt-5 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
                >
                  View order tracking
                </Link>
              </div>
            ) : null}

            <div className="mt-7">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
              >
                Back to package details
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function StepHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-[#1f7a55]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#071a2f] md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#667085]">{body}</p>
    </div>
  );
}

function FooterActions({
  onBack,
  onNext,
}: {
  onBack?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
        >
          Back
        </button>
      ) : null}
      {onNext ? (
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
        >
          Continue
        </button>
      ) : null}
    </div>
  );
}

function QuoteStateChip({ state }: { state: QuoteUiState }) {
  if (state === "ACCEPTED") return <StatusChip tone="success">Accepted</StatusChip>;
  if (state === "EXPIRED") return <StatusChip tone="danger">Expired</StatusChip>;
  if (state === "REFRESHED") return <StatusChip tone="info">Refreshed</StatusChip>;
  if (state === "GENERATING") return <StatusChip tone="warning">Generating</StatusChip>;
  return <StatusChip tone="success">Ready</StatusChip>;
}
