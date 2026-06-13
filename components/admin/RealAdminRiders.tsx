"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type RiderProfile = {
  id: string;
  userId?: string;
  displayName: string;
  phone: string;
  residentialArea?: string;
  bikeAccessType?: string;
  dispatchExperience?: string;
  referencePhone?: string;
  verificationStatus: string;
  rating?: number;
  completedJobs?: number;
  acceptanceRate?: number;
  completionRate?: number;
  disputeRate?: number;
  proofComplianceRate?: number;
  tier: string;
  suspensionStatus?: string;
  createdAt?: string;
};

type RidersResponse = {
  riders: RiderProfile[];
};

type RiderVerificationResponse = {
  rider: RiderProfile;
};

const verificationStatuses = [
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "SUSPENDED",
  "REJECTED",
];

const tiers = ["NEW", "STANDARD", "PRIORITY", "SUSPENDED"];
const suspensionStatuses = ["NONE", "TEMPORARY", "INDEFINITE"];

function statusTone(status: string) {
  if (["VERIFIED", "PRIORITY"].includes(status)) return "success" as const;
  if (["PENDING", "UNDER_REVIEW", "NEW", "STANDARD"].includes(status)) {
    return "warning" as const;
  }
  if (["SUSPENDED", "REJECTED", "INDEFINITE", "TEMPORARY"].includes(status)) {
    return "danger" as const;
  }
  return "info" as const;
}

export function RealAdminRiders() {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("VERIFIED");
  const [tier, setTier] = useState("STANDARD");
  const [suspensionStatus, setSuspensionStatus] = useState("NONE");
  const [reason, setReason] = useState("Admin rider verification review");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedRider = useMemo(
    () => riders.find((rider) => rider.id === selectedRiderId) ?? null,
    [riders, selectedRiderId]
  );

  async function loadRiders() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RidersResponse>("/api/admin/riders");
      const loadedRiders = response.data?.riders ?? [];

      setRiders(loadedRiders);

      if (!selectedRiderId && loadedRiders.length) {
        const first = loadedRiders[0];
        setSelectedRiderId(first.id);
        setVerificationStatus(first.verificationStatus || "PENDING");
        setTier(first.tier || "NEW");
        setSuspensionStatus(first.suspensionStatus || "NONE");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load riders");
    } finally {
      setLoading(false);
    }
  }

  function selectRider(rider: RiderProfile) {
    setSelectedRiderId(rider.id);
    setVerificationStatus(rider.verificationStatus || "PENDING");
    setTier(rider.tier || "NEW");
    setSuspensionStatus(rider.suspensionStatus || "NONE");
    setNotice("");
    setError("");
  }

  async function updateRider() {
    if (!selectedRiderId) return;

    try {
      setError("");
      setNotice("");
      setUpdating(true);

      const response = await apiRequest<RiderVerificationResponse>(
        `/api/admin/riders/${selectedRiderId}/verification`,
        {
          method: "PATCH",
          body: JSON.stringify({
            verificationStatus,
            tier,
            suspensionStatus,
            reason,
          }),
        }
      );

      const updatedRider = response.data?.rider;

      if (updatedRider) {
        setRiders((current) =>
          current.map((rider) =>
            rider.id === updatedRider.id ? updatedRider : rider
          )
        );
      }

      setNotice("Rider verification updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update rider verification"
      );
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    loadRiders();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real riders...</p>
      </section>
    );
  }

  if (error && !riders.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider records are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to protected admin rider APIs. Login with the
          seeded ADMIN account to view and manage rider verification.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/riders/apply"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Rider application
          </Link>
        </div>
      </section>
    );
  }

  const verified = riders.filter((rider) => rider.verificationStatus === "VERIFIED");
  const pending = riders.filter((rider) =>
    ["PENDING", "UNDER_REVIEW"].includes(rider.verificationStatus)
  );
  const suspended = riders.filter((rider) =>
    ["SUSPENDED", "REJECTED"].includes(rider.verificationStatus)
  );

  const metricCards = [
    {
      label: "Total riders",
      value: String(riders.length),
      note: "All rider profiles",
    },
    {
      label: "Verified",
      value: String(verified.length),
      note: "Eligible for dispatch assignment",
    },
    {
      label: "Pending review",
      value: String(pending.length),
      note: "Needs admin decision",
    },
    {
      label: "Suspended/rejected",
      value: String(suspended.length),
      note: "Not eligible for dispatch",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real rider admin</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Rider verification and operations.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads real rider profiles from MongoDB and updates rider
              verification through protected admin APIs.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRiders}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh riders
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
          title="Rider profiles"
          body="Real rider profiles available for verification and dispatch eligibility review."
        >
          {riders.length ? (
            <div className="grid gap-3">
              {riders.map((rider) => (
                <button
                  key={rider.id}
                  type="button"
                  onClick={() => selectRider(rider)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedRiderId === rider.id
                      ? "border-[#071a2f] bg-[#071a2f] text-white"
                      : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f] hover:border-[#071a2f]/30"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{rider.displayName}</p>
                        <StatusChip tone={statusTone(rider.verificationStatus)}>
                          {rider.verificationStatus.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                      </div>

                      <p
                        className={`mt-2 text-xs leading-5 ${
                          selectedRiderId === rider.id
                            ? "text-white/70"
                            : "text-[#667085]"
                        }`}
                      >
                        {rider.phone} · {rider.residentialArea || "Area not set"}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          selectedRiderId === rider.id
                            ? "text-white/60"
                            : "text-[#98a2b3]"
                        }`}
                      >
                        {rider.tier} · {rider.completedJobs ?? 0} completed jobs
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      {rider.rating ? `${rider.rating}/5` : "No rating"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No riders yet. Run the local rider seed script or let rider
                applicants register before review.
              </p>
            </div>
          )}
        </Panel>

        <Panel
          title="Verification decision"
          body="Update rider eligibility. Verified riders can be assigned in dispatch."
        >
          {selectedRider ? (
            <div>
              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                      {selectedRider.displayName}
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                      {selectedRider.phone}
                    </p>
                  </div>

                  <StatusChip tone={statusTone(selectedRider.verificationStatus)}>
                    {selectedRider.verificationStatus.replaceAll("_", " ").toLowerCase()}
                  </StatusChip>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-[#667085]">
                  <p>Area: {selectedRider.residentialArea || "Not set"}</p>
                  <p>Bike: {selectedRider.bikeAccessType || "Not set"}</p>
                  <p>Experience: {selectedRider.dispatchExperience || "Not set"}</p>
                  <p>Completion: {selectedRider.completionRate ?? 0}%</p>
                  <p>Proof compliance: {selectedRider.proofComplianceRate ?? 0}%</p>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <label>
                  <span className="label">Verification status</span>
                  <select
                    className="field"
                    value={verificationStatus}
                    onChange={(event) => setVerificationStatus(event.target.value)}
                  >
                    {verificationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="label">Tier</span>
                  <select
                    className="field"
                    value={tier}
                    onChange={(event) => setTier(event.target.value)}
                  >
                    {tiers.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="label">Suspension status</span>
                  <select
                    className="field"
                    value={suspensionStatus}
                    onChange={(event) => setSuspensionStatus(event.target.value)}
                  >
                    {suspensionStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="label">Admin reason</span>
                  <textarea
                    className="field"
                    rows={4}
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
                  onClick={updateRider}
                  disabled={updating || reason.trim().length < 5}
                  className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Update rider"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select a rider profile to update verification status.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
