"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type Quote = {
  quoteId: string;
  status: string;
  serviceType?: string;
  finalFare: number;
  fareBreakdown?: Array<{
    code: string;
    label: string;
    amount: number;
    kind: string;
    note?: string;
  }>;
  protections?: string[];
  summaryFactors?: string[];
  pickupAddress?: string;
  pickupLandmark?: string;
  dropoffAddress?: string;
  dropoffLandmark?: string;
  packageCategory?: string;
  urgency?: string;
  valueBand?: string;
  isBusinessAccount?: boolean;
  ruleVersion?: string;
  validUntil?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AdminQuotesResponse = {
  quotes?: Quote[];
  pricingQuotes?: Quote[];
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["QUOTE_ACCEPTED", "ACCEPTED", "ORDER_CREATED"].includes(status)) {
    return "success" as const;
  }

  if (["QUOTE_CREATED", "PENDING", "ACTIVE"].includes(status)) {
    return "warning" as const;
  }

  if (["QUOTE_EXPIRED", "EXPIRED", "CANCELLED", "REJECTED"].includes(status)) {
    return "danger" as const;
  }

  return "info" as const;
}

export function RealAdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote.quoteId === selectedQuoteId) ?? null,
    [quotes, selectedQuoteId]
  );

  async function loadQuotes() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AdminQuotesResponse>("/api/admin/quotes");

      const loadedQuotes =
        response.data?.quotes ?? response.data?.pricingQuotes ?? [];

      setQuotes(loadedQuotes);

      if (!selectedQuoteId && loadedQuotes.length) {
        setSelectedQuoteId(loadedQuotes[0].quoteId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin quotes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real backend quotes...</p>
      </section>
    );
  }

  if (error && !quotes.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Quote records are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to the protected backend admin quotes API.
          Login as admin to review real quote activity, fare breakdowns,
          validity windows, and pricing rule versions.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Admin overview
          </Link>
        </div>
      </section>
    );
  }

  const acceptedQuotes = quotes.filter((quote) =>
    ["QUOTE_ACCEPTED", "ACCEPTED", "ORDER_CREATED"].includes(quote.status)
  );

  const expiredQuotes = quotes.filter((quote) =>
    ["QUOTE_EXPIRED", "EXPIRED"].includes(quote.status)
  );

  const businessQuotes = quotes.filter((quote) => quote.isBusinessAccount);

  const quoteValue = quotes.reduce(
    (sum, quote) => sum + Number(quote.finalFare || 0),
    0
  );

  const metricCards = [
    {
      label: "Total quotes",
      value: String(quotes.length),
      note: "Real backend quotes",
    },
    {
      label: "Accepted",
      value: String(acceptedQuotes.length),
      note: "Converted or ready for orders",
    },
    {
      label: "Expired",
      value: String(expiredQuotes.length),
      note: "Quote validity ended",
    },
    {
      label: "Quote value",
      value: money.format(quoteValue),
      note: `${businessQuotes.length} business quotes`,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real admin quotes</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Quote activity and fare review.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads real quote records from MongoDB through the
              protected admin API. Use it to review fare logic, rule versions,
              quote expiry, and business pricing behavior.
            </p>
          </div>

          <button
            type="button"
            onClick={loadQuotes}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh quotes
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Quote list"
          body="Newest quote records from customer and business quote flows."
        >
          {quotes.length ? (
            <div className="grid gap-3">
              {quotes.map((quote) => (
                <button
                  key={quote.quoteId}
                  type="button"
                  onClick={() => setSelectedQuoteId(quote.quoteId)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedQuoteId === quote.quoteId
                      ? "border-[#071a2f] bg-[#071a2f] text-white"
                      : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f] hover:border-[#071a2f]/30"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{quote.quoteId}</p>
                        <StatusChip tone={statusTone(quote.status)}>
                          {quote.status.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                      </div>

                      <p
                        className={`mt-2 text-xs leading-5 ${
                          selectedQuoteId === quote.quoteId
                            ? "text-white/70"
                            : "text-[#667085]"
                        }`}
                      >
                        {quote.pickupAddress ?? "Pickup"} →{" "}
                        {quote.dropoffAddress ?? "Drop-off"}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          selectedQuoteId === quote.quoteId
                            ? "text-white/60"
                            : "text-[#98a2b3]"
                        }`}
                      >
                        {quote.isBusinessAccount ? "business quote" : "customer quote"} ·{" "}
                        {quote.ruleVersion ?? "rule not shown"}
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      {money.format(quote.finalFare)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No real quotes yet. Generate one from the booking page or
                business new delivery page.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
                >
                  Customer quote
                </Link>
                <Link
                  href="/business/new-delivery"
                  className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
                >
                  Business quote
                </Link>
              </div>
            </div>
          )}
        </Panel>

        <Panel
          title="Selected quote"
          body="Fare breakdown, protections, validity, and pricing rule version."
        >
          {selectedQuote ? (
            <div className="grid gap-4">
              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                    {selectedQuote.quoteId}
                  </p>
                  <StatusChip tone={statusTone(selectedQuote.status)}>
                    {selectedQuote.status.replaceAll("_", " ").toLowerCase()}
                  </StatusChip>
                </div>

                <p className="mt-5 text-xs text-[#667085]">Final fare</p>
                <p className="mt-1 text-4xl font-medium tracking-[-0.05em] text-[#071a2f]">
                  {money.format(selectedQuote.finalFare)}
                </p>

                <div className="mt-5 grid gap-3">
                  <div>
                    <p className="text-xs text-[#667085]">Route</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedQuote.pickupAddress ?? "Pickup"} →{" "}
                      {selectedQuote.dropoffAddress ?? "Drop-off"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">Package</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedQuote.packageCategory ?? "Package"} ·{" "}
                      {selectedQuote.urgency ?? "STANDARD"} ·{" "}
                      {selectedQuote.valueBand ?? "Normal value"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">Pricing rule</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedQuote.ruleVersion ?? "Not available"}
                    </p>
                  </div>

                  {selectedQuote.validUntil ? (
                    <div>
                      <p className="text-xs text-[#667085]">Valid until</p>
                      <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                        {new Date(selectedQuote.validUntil).toLocaleString()}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm font-medium text-[#071a2f]">
                  Fare breakdown
                </p>

                {selectedQuote.fareBreakdown?.length ? (
                  <div className="mt-4 grid gap-2">
                    {selectedQuote.fareBreakdown.map((item) => (
                      <div
                        key={`${item.code}-${item.label}`}
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
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    No fare breakdown stored for this quote.
                  </p>
                )}
              </div>

              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm font-medium text-[#071a2f]">
                  Protections and factors
                </p>

                <div className="mt-4 grid gap-2">
                  {(selectedQuote.protections || selectedQuote.summaryFactors || [])
                    .slice(0, 8)
                    .map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-3 text-xs leading-5 text-[#667085]"
                      >
                        {item}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select a quote to review its pricing details.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
