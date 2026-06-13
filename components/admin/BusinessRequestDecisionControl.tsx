"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type Decision = "APPROVE" | "REJECT" | "UNDER_REVIEW";
type AccountStatus = "PENDING" | "ACTIVE" | "PAUSED" | "SUSPENDED" | "REJECTED";
type PlanType = "PAY_AS_YOU_GO" | "GROWTH_VENDOR" | "CORPORATE";

type DecisionResponse = {
  request: {
    _id?: string;
    id?: string;
    businessName: string;
    status: string;
  };
  profile?: {
    _id?: string;
    id?: string;
    businessName: string;
    accountStatus: string;
    planType: string;
  } | null;
};

function statusTone(status: string) {
  if (status === "APPROVED" || status === "ACTIVE") return "success" as const;
  if (status === "PENDING" || status === "UNDER_REVIEW") return "warning" as const;
  if (status === "REJECTED" || status === "SUSPENDED") return "danger" as const;
  return "info" as const;
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function BusinessRequestDecisionControl({
  requestId,
  businessName,
  currentStatus,
  onDecision,
}: {
  requestId: string;
  businessName: string;
  currentStatus: string;
  onDecision?: () => void;
}) {
  const [decision, setDecision] = useState<Decision>("APPROVE");
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("ACTIVE");
  const [planType, setPlanType] = useState<PlanType>("GROWTH_VENDOR");
  const [approvedDiscountRate, setApprovedDiscountRate] = useState("5");
  const [discountCap, setDiscountCap] = useState("500");
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState(`Admin reviewed ${businessName}.`);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function submitDecision() {
    try {
      setError("");
      setNotice("");
      setSaving(true);

      const response = await apiRequest<DecisionResponse>(
        `/api/admin/business-requests/${requestId}/decision`,
        {
          method: "PATCH",
          body: JSON.stringify({
            decision,
            accountStatus: decision === "APPROVE" ? accountStatus : "REJECTED",
            planType,
            approvedDiscountRate: toNumber(approvedDiscountRate),
            discountCap: toNumber(discountCap),
            address: address.trim() || undefined,
            reason,
          }),
        }
      );

      const requestStatus = response.data?.request?.status;
      const profileName = response.data?.profile?.businessName;

      setNotice(
        profileName
          ? `${profileName} approved and business profile created/updated.`
          : `Business request updated to ${requestStatus}.`
      );

      onDecision?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update business request decision"
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
            Business request decision
          </p>
          <p className="mt-1 text-xs leading-5 text-[#667085]">
            Approve only after the business owner has a matching user account
            with the same email or phone.
          </p>
        </div>

        <StatusChip tone={statusTone(currentStatus)}>
          {currentStatus.replaceAll("_", " ").toLowerCase()}
        </StatusChip>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">Decision</span>
          <select
            className="field"
            value={decision}
            onChange={(event) => setDecision(event.target.value as Decision)}
          >
            <option value="APPROVE">Approve</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="REJECT">Reject</option>
          </select>
        </label>

        <label>
          <span className="label">Account status</span>
          <select
            className="field"
            value={accountStatus}
            onChange={(event) =>
              setAccountStatus(event.target.value as AccountStatus)
            }
            disabled={decision !== "APPROVE"}
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="PAUSED">Paused</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label>
          <span className="label">Plan</span>
          <select
            className="field"
            value={planType}
            onChange={(event) => setPlanType(event.target.value as PlanType)}
            disabled={decision !== "APPROVE"}
          >
            <option value="PAY_AS_YOU_GO">Pay as you go</option>
            <option value="GROWTH_VENDOR">Growth vendor</option>
            <option value="CORPORATE">Corporate</option>
          </select>
        </label>

        <label>
          <span className="label">Discount rate</span>
          <input
            className="field"
            value={approvedDiscountRate}
            onChange={(event) => setApprovedDiscountRate(event.target.value)}
            disabled={decision !== "APPROVE"}
          />
        </label>

        <label>
          <span className="label">Discount cap</span>
          <input
            className="field"
            value={discountCap}
            onChange={(event) => setDiscountCap(event.target.value)}
            disabled={decision !== "APPROVE"}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="label">Business address</span>
        <input
          className="field"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          disabled={decision !== "APPROVE"}
          placeholder="Optional business address"
        />
      </label>

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
        onClick={submitDecision}
        disabled={saving || reason.trim().length < 5}
        className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving decision..." : "Save decision"}
      </button>
    </div>
  );
}
