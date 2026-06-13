"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type CancelResponse = {
  order?: {
    orderId: string;
    status: string;
  };
  timeline?: Array<unknown>;
};

const cancellableStatuses = [
  "CREATED",
  "QUOTED",
  "ASSIGNING_RIDER",
  "RIDER_ASSIGNED",
  "RIDER_EN_ROUTE",
  "ARRIVED_PICKUP",
];

export function OrderCancellationBox({
  orderId,
  currentStatus,
  compact = false,
}: {
  orderId: string;
  currentStatus: string;
  compact?: boolean;
}) {
  const router = useRouter();

  const [reason, setReason] = useState("Customer requested cancellation.");
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  const canCancel = cancellableStatuses.includes(currentStatus) && !cancelled;

  async function cancelOrder() {
    try {
      setError("");
      setLoading(true);

      await apiRequest<CancelResponse>(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({
          reason,
        }),
      });

      setCancelled(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not cancel order. The backend may have rejected this transition."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] ${
        compact ? "p-5" : "mt-5 p-5"
      }`}
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-[#071a2f]">Cancel order</p>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Cancellation is allowed only before pickup. After pickup, use
            dispute, failure, proof, or support workflows.
          </p>
        </div>

        <StatusChip tone={canCancel ? "warning" : "info"}>
          {canCancel ? "cancellable" : "locked"}
        </StatusChip>
      </div>

      <label className="mt-4 block">
        <span className="label">Cancellation reason</span>
        <textarea
          className="field"
          rows={compact ? 3 : 4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={!canCancel}
        />
      </label>

      {!canCancel ? (
        <div className="mt-4 rounded-2xl border border-[#e5ded2] bg-[#f7f3ec] p-4 text-sm leading-6 text-[#667085]">
          This order cannot be cancelled from status{" "}
          <strong>{currentStatus.replaceAll("_", " ").toLowerCase()}</strong>.
        </div>
      ) : null}

      {cancelled ? (
        <div className="mt-4 rounded-2xl border border-[#b7dfcf] bg-[#e8f6ef] p-4 text-sm leading-6 text-[#1f7a55]">
          Order cancelled successfully. Refresh or reopen the page to see the
          updated status.
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={cancelOrder}
        disabled={!canCancel || loading || reason.trim().length < 5}
        className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Cancelling..." : "Cancel order"}
      </button>
    </section>
  );
}
