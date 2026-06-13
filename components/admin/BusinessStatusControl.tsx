"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type BusinessStatus = "PENDING" | "ACTIVE" | "PAUSED" | "SUSPENDED" | "REJECTED";
type PlanType = "PAY_AS_YOU_GO" | "GROWTH_VENDOR" | "CORPORATE";

type BusinessStatusResponse = {
  business: {
    _id?: string;
    id?: string;
    businessName?: string;
    accountStatus: BusinessStatus;
    planType: PlanType;
    approvedDiscountRate?: number;
    discountCap?: number;
  };
};

function statusTone(status: string) {
  if (status === "ACTIVE") return "success" as const;
  if (["PENDING", "PAUSED"].includes(status)) return "warning" as const;
  if (["SUSPENDED", "REJECTED"].includes(status)) return "danger" as const;
  return "info" as const;
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function BusinessStatusControl({
  businessId,
  businessName,
  currentStatus,
  currentPlanType,
  currentDiscountRate,
  currentDiscountCap,
}: {
  businessId: string;
  businessName: string;
  currentStatus: string;
  currentPlanType: string;
  currentDiscountRate?: number;
  currentDiscountCap?: number;
}) {
  const [accountStatus, setAccountStatus] = useState<BusinessStatus>(
    (currentStatus as BusinessStatus) || "PENDING"
  );
  const [planType, setPlanType] = useState<PlanType>(
    (currentPlanType as PlanType) || "PAY_AS_YOU_GO"
  );
  const [approvedDiscountRate, setApprovedDiscountRate] = useState(
    String(currentDiscountRate ?? 0)
  );
  const [discountCap, setDiscountCap] = useState(String(currentDiscountCap ?? 0));
  const [reason, setReason] = useState(
    `Admin updated business status for ${businessName}.`
  );
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function updateBusinessStatus() {
    try {
      setError("");
      setNotice("");
      setSaving(true);

      const response = await apiRequest<BusinessStatusResponse>(
        `/api/admin/businesses/${businessId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            accountStatus,
            planType,
            approvedDiscountRate: toNumber(approvedDiscountRate),
            discountCap: toNumber(discountCap),
            reason,
          }),
        }
      );

      const updated = response.data?.business;

      if (updated) {
        setAccountStatus(updated.accountStatus);
        setPlanType(updated.planType);
        setApprovedDiscountRate(String(updated.approvedDiscountRate ?? 0));
        setDiscountCap(String(updated.discountCap ?? 0));
      }

      setNotice("Business status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update business status"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-5 rounded-[22px] border border-[#e5ded2] bg-[#fffdf8] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#071a2f]">
            Business status control
          </p>
          <p className="mt-1 text-xs leading-5 text-[#667085]">
            Update active status, plan type, discount rate, and discount cap.
          </p>
        </div>

        <StatusChip tone={statusTone(accountStatus)}>
          {accountStatus.toLowerCase()}
        </StatusChip>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">Account status</span>
          <select
            className="field"
            value={accountStatus}
            onChange={(event) =>
              setAccountStatus(event.target.value as BusinessStatus)
            }
          >
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>

        <label>
          <span className="label">Plan type</span>
          <select
            className="field"
            value={planType}
            onChange={(event) => setPlanType(event.target.value as PlanType)}
          >
            <option value="PAY_AS_YOU_GO">Pay as you go</option>
            <option value="GROWTH_VENDOR">Growth vendor</option>
            <option value="CORPORATE">Corporate</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">Approved discount rate</span>
          <input
            className="field"
            value={approvedDiscountRate}
            onChange={(event) => setApprovedDiscountRate(event.target.value)}
            placeholder="Example: 5"
          />
        </label>

        <label>
          <span className="label">Discount cap</span>
          <input
            className="field"
            value={discountCap}
            onChange={(event) => setDiscountCap(event.target.value)}
            placeholder="Example: 500"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="label">Admin reason</span>
        <textarea
          className="field"
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>

      {notice ? (
        <div className="mt-4 rounded-2xl border border-[#b7dfcf] bg-[#e8f6ef] p-4 text-sm leading-6 text-[#1f7a55]">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={updateBusinessStatus}
        disabled={saving || reason.trim().length < 5}
        className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Updating..." : "Update business status"}
      </button>
    </div>
  );
}
