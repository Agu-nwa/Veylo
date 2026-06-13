"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import { AdminRiderDocumentReview } from "@/components/admin/AdminRiderDocumentReview";

type RiderDocument = {
  _id?: string;
  id?: string;
  type?: string;
  url?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
};

type RiderProfile = {
  id?: string;
  _id?: string;
  displayName: string;
  phone: string;
  residentialArea?: string;
  bikeAccessType?: string;
  dispatchExperience?: string;
  referencePhone?: string;
  verificationStatus: string;
  tier: string;
  suspensionStatus?: string;
  rating?: number;
  completedJobs?: number;
  acceptanceRate?: number;
  completionRate?: number;
  disputeRate?: number;
  proofComplianceRate?: number;
  documents?: RiderDocument[];
  createdAt?: string;
};

type RidersResponse = {
  riders: RiderProfile[];
};

type VerificationResponse = {
  rider: RiderProfile;
};

function itemId(item: { id?: string; _id?: string }) {
  return item.id || item._id || "";
}

function statusTone(status: string) {
  if (status === "VERIFIED") return "success" as const;
  if (["PENDING", "UNDER_REVIEW"].includes(status)) return "warning" as const;
  if (["SUSPENDED", "REJECTED"].includes(status)) return "danger" as const;
  return "info" as const;
}

function documentHealth(documents?: RiderDocument[]) {
  const docs = documents ?? [];

  if (!docs.length) return "No documents";

  const approved = docs.filter((document) => document.status === "APPROVED").length;
  const rejected = docs.filter((document) => document.status === "REJECTED").length;

  return `${approved}/${docs.length} approved${rejected ? ` · ${rejected} rejected` : ""}`;
}


function riderVerificationReadiness(documents?: RiderDocument[]) {
  const docs = documents ?? [];

  const hasApproved = (type: string) =>
    docs.some((document) => document.type === type && document.status === "APPROVED");

  const hasGovernmentId = hasApproved("GOVERNMENT_ID");
  const hasTraining = hasApproved("TRAINING_ACKNOWLEDGEMENT");
  const hasBikeDocument = hasApproved("BIKE_DOCUMENT") || hasApproved("BIKE_PERMISSION");

  const missing = [];

  if (!hasGovernmentId) missing.push("approved government ID");
  if (!hasBikeDocument) missing.push("approved bike document or bike permission");
  if (!hasTraining) missing.push("approved training acknowledgement");

  return {
    ready: missing.length === 0,
    missing,
  };
}

export function RealAdminRiders() {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("UNDER_REVIEW");
  const [tier, setTier] = useState("STANDARD");
  const [suspensionStatus, setSuspensionStatus] = useState("NONE");
  const [reason, setReason] = useState("Admin reviewed rider verification status.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const selectedRider =
    riders.find((rider) => itemId(rider) === selectedId) ?? riders[0] ?? null;

  async function loadRiders() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RidersResponse>("/api/admin/riders");
      const loaded = response.data?.riders ?? [];

      setRiders(loaded);

      if (!selectedId && loaded.length) {
        const first = loaded[0];
        setSelectedId(itemId(first));
        setVerificationStatus(first.verificationStatus || "UNDER_REVIEW");
        setTier(first.tier || "STANDARD");
        setSuspensionStatus(first.suspensionStatus || "NONE");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load riders");
    } finally {
      setLoading(false);
    }
  }

  function selectRider(rider: RiderProfile) {
    setSelectedId(itemId(rider));
    setVerificationStatus(rider.verificationStatus || "UNDER_REVIEW");
    setTier(rider.tier || "STANDARD");
    setSuspensionStatus(rider.suspensionStatus || "NONE");
    setReason(`Admin reviewed ${rider.displayName}.`);
    setNotice("");
    setError("");
  }

  async function updateVerification() {
    if (!selectedRider) return;

    try {
      setError("");
      setNotice("");
      setSaving(true);

      const response = await apiRequest<VerificationResponse>(
        `/api/admin/riders/${itemId(selectedRider)}/verification`,
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

      const updated = response.data?.rider;

      if (updated) {
        setRiders((current) =>
          current.map((rider) =>
            itemId(rider) === itemId(updated) ? updated : rider
          )
        );
        setVerificationStatus(updated.verificationStatus);
        setTier(updated.tier);
        setSuspensionStatus(updated.suspensionStatus || "NONE");
      }

      setNotice("Rider verification updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update rider verification"
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadRiders();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real rider records...</p>
      </section>
    );
  }

  if (error && !riders.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider operations are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login as admin to review rider applications, documents, verification
          status, suspension state, tier, and performance metrics.
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

  const verified = riders.filter((rider) => rider.verificationStatus === "VERIFIED");
  const pending = riders.filter((rider) =>
    ["PENDING", "UNDER_REVIEW"].includes(rider.verificationStatus)
  );
  const suspended = riders.filter((rider) => rider.verificationStatus === "SUSPENDED");
  const withDocuments = riders.filter((rider) => (rider.documents ?? []).length > 0);

  const metrics = [
    {
      label: "Total riders",
      value: String(riders.length),
      note: "Profiles and applicants",
    },
    {
      label: "Verified",
      value: String(verified.length),
      note: "Can receive rider jobs",
    },
    {
      label: "Pending review",
      value: String(pending.length),
      note: "Needs admin verification",
    },
    {
      label: "With documents",
      value: String(withDocuments.length),
      note: `${suspended.length} suspended`,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real rider admin</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Rider verification and documents.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              Review rider applications, approve submitted documents, verify
              qualified riders, suspend risky riders, and manage rider tiers.
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
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Rider queue"
          body="Select a rider to review details, documents, and verification status."
        >
          {riders.length ? (
            <div className="grid gap-3">
              {riders.map((rider) => {
                const id = itemId(rider);

                return (
                  <button
                    key={id || rider.phone}
                    type="button"
                    onClick={() => selectRider(rider)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedId === id
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
                          <StatusChip tone="info">{rider.tier}</StatusChip>
                        </div>

                        <p
                          className={`mt-2 text-xs leading-5 ${
                            selectedId === id ? "text-white/70" : "text-[#667085]"
                          }`}
                        >
                          {rider.phone} · {rider.residentialArea || "No area"}
                        </p>

                        <p
                          className={`mt-1 text-[11px] ${
                            selectedId === id ? "text-white/60" : "text-[#98a2b3]"
                          }`}
                        >
                          {documentHealth(rider.documents)}
                        </p>
                      </div>

                      <p className="text-xs">
                        {rider.createdAt
                          ? new Date(rider.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No rider profiles yet. Rider applications from /riders/apply
                will appear here.
              </p>
              <Link
                href="/riders/apply"
                className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                Open rider application
              </Link>
            </div>
          )}
        </Panel>

        <Panel
          title="Selected rider"
          body="Review profile, documents, verification, suspension, and tier."
        >
          {selectedRider ? (
            <div>
              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                    {selectedRider.displayName}
                  </p>
                  <StatusChip tone={statusTone(selectedRider.verificationStatus)}>
                    {selectedRider.verificationStatus.replaceAll("_", " ").toLowerCase()}
                  </StatusChip>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {[
                    ["Phone", selectedRider.phone],
                    ["Area", selectedRider.residentialArea || "Not set"],
                    [
                      "Bike access",
                      selectedRider.bikeAccessType?.replaceAll("_", " ").toLowerCase() ||
                        "Not set",
                    ],
                    [
                      "Experience",
                      selectedRider.dispatchExperience?.replaceAll("_", " ").toLowerCase() ||
                        "Not set",
                    ],
                    ["Reference", selectedRider.referencePhone || "Not set"],
                    ["Documents", documentHealth(selectedRider.documents)],
                    ["Completed jobs", String(selectedRider.completedJobs ?? 0)],
                    ["Proof compliance", `${selectedRider.proofComplianceRate ?? 0}%`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                    >
                      <p className="text-xs text-[#667085]">{label}</p>
                      <p className="mt-1 break-all text-sm font-medium text-[#071a2f]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <AdminRiderDocumentReview
                riderId={itemId(selectedRider)}
                documents={selectedRider.documents ?? []}
                onReviewed={loadRiders}
              />

              {(() => {
                const readiness = riderVerificationReadiness(selectedRider.documents);

                return (
                  <div
                    className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                      readiness.ready
                        ? "border-[#b7dfcf] bg-[#e8f6ef] text-[#1f7a55]"
                        : "border-[#f2d59b] bg-[#fff5dc] text-[#8a5a00]"
                    }`}
                  >
                    {readiness.ready
                      ? "Rider has the required approved documents for verification."
                      : `Before verification, approve: ${readiness.missing.join(", ")}.`}
                  </div>
                );
              })()}

              <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm font-medium text-[#071a2f]">
                  Verification decision
                </p>
                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  Verifying a rider promotes the linked user account into RIDER
                  access. Suspension blocks trust and tier progression.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="label">Verification status</span>
                    <select
                      className="field"
                      value={verificationStatus}
                      onChange={(event) => setVerificationStatus(event.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under review</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="SUSPENDED">Suspended</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </label>

                  <label>
                    <span className="label">Tier</span>
                    <select
                      className="field"
                      value={tier}
                      onChange={(event) => setTier(event.target.value)}
                    >
                      <option value="NEW">New</option>
                      <option value="STANDARD">Standard</option>
                      <option value="PRIORITY">Priority</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="label">Suspension status</span>
                  <select
                    className="field"
                    value={suspensionStatus}
                    onChange={(event) => setSuspensionStatus(event.target.value)}
                  >
                    <option value="NONE">None</option>
                    <option value="TEMPORARY">Temporary</option>
                    <option value="INDEFINITE">Indefinite</option>
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
                  onClick={updateVerification}
                  disabled={saving || reason.trim().length < 5}
                  className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Update rider verification"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select a rider to review.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
