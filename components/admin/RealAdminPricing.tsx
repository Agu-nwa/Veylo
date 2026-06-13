"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import Link from "next/link";

type PricingRule = {
  _id?: string;
  id?: string;
  ruleVersion: string;
  baseFare: number;
  distanceRate: number;
  timeRate: number;
  packageHandlingFees?: Record<string, number>;
  urgencyMultipliers?: Record<string, number>;
  zoneDifficultyRules?: Record<string, number>;
  fareFloor: number;
  fareCap: number;
  surchargeCap: number;
  discountCap: number;
  quoteExpiryMinutes: number;
  active: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PricingResponse = {
  pricing: {
    activeRule: PricingRule;
    rules: PricingRule[];
  };
};

type PricingUpdateResponse = {
  rule: PricingRule;
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusTone(active: boolean) {
  return active ? "success" : "info";
}

export function RealAdminPricing() {
  const [activeRule, setActiveRule] = useState<PricingRule | null>(null);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [form, setForm] = useState({
    ruleVersion: `VEYLO-RULES-${Date.now()}`,
    baseFare: "900",
    distanceRate: "180",
    timeRate: "40",
    fareFloor: "1000",
    fareCap: "15000",
    surchargeCap: "3500",
    discountCap: "500",
    quoteExpiryMinutes: "15",
    standardMultiplier: "1",
    expressMultiplier: "1.35",
    scheduledMultiplier: "1.1",
    smallParcelFee: "100",
    documentFee: "50",
    fragileFee: "350",
    normalZone: "1",
    difficultZone: "1.25",
    reason: "Admin pricing rule update",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function loadPricing() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<PricingResponse>("/api/admin/pricing-rules");

      const pricing = response.data?.pricing;

      setActiveRule(pricing?.activeRule ?? null);
      setRules(pricing?.rules ?? []);

      if (pricing?.activeRule) {
        const rule = pricing.activeRule;

        setForm((current) => ({
          ...current,
          ruleVersion: `VEYLO-RULES-${Date.now()}`,
          baseFare: String(rule.baseFare ?? current.baseFare),
          distanceRate: String(rule.distanceRate ?? current.distanceRate),
          timeRate: String(rule.timeRate ?? current.timeRate),
          fareFloor: String(rule.fareFloor ?? current.fareFloor),
          fareCap: String(rule.fareCap ?? current.fareCap),
          surchargeCap: String(rule.surchargeCap ?? current.surchargeCap),
          discountCap: String(rule.discountCap ?? current.discountCap),
          quoteExpiryMinutes: String(
            rule.quoteExpiryMinutes ?? current.quoteExpiryMinutes
          ),
          standardMultiplier: String(
            rule.urgencyMultipliers?.STANDARD ?? current.standardMultiplier
          ),
          expressMultiplier: String(
            rule.urgencyMultipliers?.EXPRESS ?? current.expressMultiplier
          ),
          scheduledMultiplier: String(
            rule.urgencyMultipliers?.SCHEDULED ?? current.scheduledMultiplier
          ),
          smallParcelFee: String(
            rule.packageHandlingFees?.["Small parcel"] ?? current.smallParcelFee
          ),
          documentFee: String(
            rule.packageHandlingFees?.Document ?? current.documentFee
          ),
          fragileFee: String(
            rule.packageHandlingFees?.["Fragile item"] ?? current.fragileFee
          ),
          normalZone: String(
            rule.zoneDifficultyRules?.NORMAL ?? current.normalZone
          ),
          difficultZone: String(
            rule.zoneDifficultyRules?.DIFFICULT ?? current.difficultZone
          ),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load pricing rules");
    } finally {
      setLoading(false);
    }
  }

  async function createPricingRule() {
    try {
      setError("");
      setNotice("");
      setSaving(true);

      const response = await apiRequest<PricingUpdateResponse>(
        "/api/admin/pricing-rules",
        {
          method: "PATCH",
          body: JSON.stringify({
            ruleVersion: form.ruleVersion,
            baseFare: toNumber(form.baseFare),
            distanceRate: toNumber(form.distanceRate),
            timeRate: toNumber(form.timeRate),
            fareFloor: toNumber(form.fareFloor),
            fareCap: toNumber(form.fareCap),
            surchargeCap: toNumber(form.surchargeCap),
            discountCap: toNumber(form.discountCap),
            quoteExpiryMinutes: toNumber(form.quoteExpiryMinutes),
            active: true,
            packageHandlingFees: {
              "Small parcel": toNumber(form.smallParcelFee),
              Document: toNumber(form.documentFee),
              "Fragile item": toNumber(form.fragileFee),
            },
            urgencyMultipliers: {
              STANDARD: toNumber(form.standardMultiplier),
              EXPRESS: toNumber(form.expressMultiplier),
              SCHEDULED: toNumber(form.scheduledMultiplier),
            },
            zoneDifficultyRules: {
              NORMAL: toNumber(form.normalZone),
              DIFFICULT: toNumber(form.difficultZone),
            },
            reason: form.reason,
          }),
        }
      );

      const newRule = response.data?.rule;

      if (newRule) {
        setActiveRule(newRule);
        setRules((current) => [newRule, ...current]);
      }

      setNotice("New active pricing rule created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create pricing rule");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadPricing();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real pricing rules...</p>
      </section>
    );
  }

  if (error && !activeRule) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Pricing rules are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to the protected backend pricing rule API. Login
          as admin to view and update active fare rules.
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

  const metricCards = [
    {
      label: "Base fare",
      value: money.format(activeRule?.baseFare ?? 0),
      note: "Starting fare before route factors",
    },
    {
      label: "Distance rate",
      value: money.format(activeRule?.distanceRate ?? 0),
      note: "Per distance unit estimate",
    },
    {
      label: "Time rate",
      value: money.format(activeRule?.timeRate ?? 0),
      note: "Time and movement factor",
    },
    {
      label: "Quote expiry",
      value: `${activeRule?.quoteExpiryMinutes ?? 0} min`,
      note: "Backend quote validity window",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real pricing rules</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Backend fare control.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads and creates real backend pricing rules. The
              frontend still cannot override final fare.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPricing}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh pricing
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel
          title="Active pricing rule"
          body="This is the active backend rule used by quote generation."
        >
          {activeRule ? (
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#071a2f]">
                      {activeRule.ruleVersion}
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                      Fare floor {money.format(activeRule.fareFloor)} · Fare cap{" "}
                      {money.format(activeRule.fareCap)}
                    </p>
                  </div>
                  <StatusChip tone={statusTone(activeRule.active)}>
                    {activeRule.active ? "active" : "inactive"}
                  </StatusChip>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                  <p className="text-xs text-[#667085]">Surcharge cap</p>
                  <p className="mt-1 text-sm font-medium text-[#071a2f]">
                    {money.format(activeRule.surchargeCap)}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                  <p className="text-xs text-[#667085]">Discount cap</p>
                  <p className="mt-1 text-sm font-medium text-[#071a2f]">
                    {money.format(activeRule.discountCap)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                <p className="text-xs text-[#667085]">Urgency multipliers</p>
                <div className="mt-3 grid gap-2 text-sm text-[#071a2f]">
                  {Object.entries(activeRule.urgencyMultipliers || {}).map(
                    ([key, value]) => (
                      <p key={key}>
                        {key}: {value}
                      </p>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
                <p className="text-xs text-[#667085]">Package handling fees</p>
                <div className="mt-3 grid gap-2 text-sm text-[#071a2f]">
                  {Object.entries(activeRule.packageHandlingFees || {}).map(
                    ([key, value]) => (
                      <p key={key}>
                        {key}: {money.format(value)}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              No active pricing rule found.
            </p>
          )}
        </Panel>

        <Panel
          title="Create new active rule"
          body="This creates a new pricing rule and deactivates the previous active rule."
        >
          <form className="grid gap-4">
            <label>
              <span className="label">Rule version</span>
              <input
                className="field"
                value={form.ruleVersion}
                onChange={(event) => updateField("ruleVersion", event.target.value)}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="label">Base fare</span>
                <input
                  className="field"
                  value={form.baseFare}
                  onChange={(event) => updateField("baseFare", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Distance rate</span>
                <input
                  className="field"
                  value={form.distanceRate}
                  onChange={(event) => updateField("distanceRate", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Time rate</span>
                <input
                  className="field"
                  value={form.timeRate}
                  onChange={(event) => updateField("timeRate", event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="label">Fare floor</span>
                <input
                  className="field"
                  value={form.fareFloor}
                  onChange={(event) => updateField("fareFloor", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Fare cap</span>
                <input
                  className="field"
                  value={form.fareCap}
                  onChange={(event) => updateField("fareCap", event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="label">Standard multiplier</span>
                <input
                  className="field"
                  value={form.standardMultiplier}
                  onChange={(event) =>
                    updateField("standardMultiplier", event.target.value)
                  }
                />
              </label>

              <label>
                <span className="label">Express multiplier</span>
                <input
                  className="field"
                  value={form.expressMultiplier}
                  onChange={(event) =>
                    updateField("expressMultiplier", event.target.value)
                  }
                />
              </label>

              <label>
                <span className="label">Scheduled multiplier</span>
                <input
                  className="field"
                  value={form.scheduledMultiplier}
                  onChange={(event) =>
                    updateField("scheduledMultiplier", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="label">Small parcel fee</span>
                <input
                  className="field"
                  value={form.smallParcelFee}
                  onChange={(event) => updateField("smallParcelFee", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Document fee</span>
                <input
                  className="field"
                  value={form.documentFee}
                  onChange={(event) => updateField("documentFee", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Fragile fee</span>
                <input
                  className="field"
                  value={form.fragileFee}
                  onChange={(event) => updateField("fragileFee", event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="label">Surcharge cap</span>
                <input
                  className="field"
                  value={form.surchargeCap}
                  onChange={(event) => updateField("surchargeCap", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Discount cap</span>
                <input
                  className="field"
                  value={form.discountCap}
                  onChange={(event) => updateField("discountCap", event.target.value)}
                />
              </label>

              <label>
                <span className="label">Expiry minutes</span>
                <input
                  className="field"
                  value={form.quoteExpiryMinutes}
                  onChange={(event) =>
                    updateField("quoteExpiryMinutes", event.target.value)
                  }
                />
              </label>
            </div>

            <label>
              <span className="label">Admin reason</span>
              <textarea
                className="field"
                rows={4}
                value={form.reason}
                onChange={(event) => updateField("reason", event.target.value)}
              />
            </label>

            {notice ? (
              <div className="rounded-2xl border border-[#b7dfcf] bg-[#e8f6ef] p-4 text-sm leading-6 text-[#1f7a55]">
                {notice}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={createPricingRule}
              disabled={saving || form.reason.trim().length < 5}
              className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Creating rule..." : "Create active pricing rule"}
            </button>
          </form>
        </Panel>
      </section>

      <Panel
        title="Pricing rule history"
        body="Recently created pricing rules."
      >
        {rules.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {rules.slice(0, 8).map((rule) => (
              <div
                key={rule._id || rule.id || rule.ruleVersion}
                className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#071a2f]">
                    {rule.ruleVersion}
                  </p>
                  <StatusChip tone={statusTone(rule.active)}>
                    {rule.active ? "active" : "inactive"}
                  </StatusChip>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  Base {money.format(rule.baseFare)} · Floor{" "}
                  {money.format(rule.fareFloor)} · Cap {money.format(rule.fareCap)}
                </p>

                {rule.createdAt ? (
                  <p className="mt-2 text-[11px] text-[#98a2b3]">
                    {new Date(rule.createdAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#667085]">
            No pricing rule history yet.
          </p>
        )}
      </Panel>
    </div>
  );
}
