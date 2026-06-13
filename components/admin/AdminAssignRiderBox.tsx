"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type RiderProfile = {
  id: string;
  displayName: string;
  phone: string;
  residentialArea?: string;
  verificationStatus: string;
  tier: string;
};

type RidersResponse = {
  riders: RiderProfile[];
};

type AssignRiderResponse = {
  order: {
    orderId: string;
    status: string;
    riderId?: string;
  };
  rider: RiderProfile;
};

export function AdminAssignRiderBox({ orderId }: { orderId: string }) {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [reason, setReason] = useState("Assigning verified rider from admin orders");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const verifiedRiders = riders.filter(
    (rider) => rider.verificationStatus === "VERIFIED"
  );

  async function loadRiders() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RidersResponse>("/api/admin/riders");
      const loaded = response.data?.riders ?? [];

      setRiders(loaded);

      const firstVerified = loaded.find(
        (rider) => rider.verificationStatus === "VERIFIED"
      );

      if (firstVerified && !selectedRiderId) {
        setSelectedRiderId(firstVerified.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load riders");
    } finally {
      setLoading(false);
    }
  }

  async function assignRider() {
    try {
      setError("");
      setNotice("");
      setAssigning(true);

      const response = await apiRequest<AssignRiderResponse>(
        `/api/admin/orders/${orderId}/assign-rider`,
        {
          method: "PATCH",
          body: JSON.stringify({
            riderProfileId: selectedRiderId,
            reason,
          }),
        }
      );

      const riderName = response.data?.rider?.displayName || "Rider";
      setNotice(`${riderName} assigned successfully. Refresh orders to see latest status.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not assign rider. Check rider verification and order status."
      );
    } finally {
      setAssigning(false);
    }
  }

  useEffect(() => {
    loadRiders();
  }, []);

  return (
    <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#071a2f]">Assign rider</p>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Shortcut from admin orders. Only verified riders can be assigned.
          </p>
        </div>
        <StatusChip tone="info">{verifiedRiders.length} verified</StatusChip>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-[#667085]">Loading riders...</p>
      ) : (
        <>
          <label className="mt-5 block">
            <span className="label">Verified rider</span>
            <select
              className="field"
              value={selectedRiderId}
              onChange={(event) => setSelectedRiderId(event.target.value)}
            >
              <option value="">Select rider</option>
              {verifiedRiders.map((rider) => (
                <option key={rider.id} value={rider.id}>
                  {rider.displayName} · {rider.phone} · {rider.tier}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="label">Assignment reason</span>
            <textarea
              className="field"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>

          {verifiedRiders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-[#f2d59b] bg-[#fff5dc] p-4 text-sm leading-6 text-[#8a5a00]">
              No verified riders found. Run the rider seed or verify a rider in
              /admin/riders.
            </div>
          ) : null}

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
            onClick={assignRider}
            disabled={
              assigning ||
              !selectedRiderId ||
              reason.trim().length < 5 ||
              verifiedRiders.length === 0
            }
            className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {assigning ? "Assigning..." : "Assign rider"}
          </button>
        </>
      )}
    </div>
  );
}
