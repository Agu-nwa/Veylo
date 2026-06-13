"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";
import { Panel } from "@/components/dashboard/Panel";
import { RiderDocumentUploadPanel } from "@/components/rider/RiderDocumentUploadPanel";
import { RiderTrainingChecklist } from "@/components/rider/RiderTrainingChecklist";

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
  createdAt?: string;
  updatedAt?: string;
  documents?: Array<{
    _id?: string;
    id?: string;
    type?: string;
    url?: string;
    status?: string;
  }>;
};

type StatusResponse = {
  application: {
    submitted: boolean;
    profile: RiderProfile | null;
  };
};

function statusTone(status?: string) {
  if (status === "VERIFIED") return "success" as const;
  if (["PENDING", "UNDER_REVIEW"].includes(status || "")) {
    return "warning" as const;
  }
  if (["SUSPENDED", "REJECTED"].includes(status || "")) {
    return "danger" as const;
  }
  return "info" as const;
}

function statusMessage(status?: string) {
  if (status === "VERIFIED") {
    return "Your rider profile has been verified. You can now access rider jobs and rider operations.";
  }

  if (status === "UNDER_REVIEW") {
    return "Your application is under review. Veylo operations may check your account, phone, reference, bike access, and conduct readiness.";
  }

  if (status === "PENDING") {
    return "Your application has been submitted and is waiting for admin review.";
  }

  if (status === "SUSPENDED") {
    return "Your rider profile is suspended. Contact support if you believe this needs review.";
  }

  if (status === "REJECTED") {
    return "Your rider application was not approved. You may contact support for clarification.";
  }

  return "No rider application status is available yet.";
}

export function RiderApplicationStatus() {
  const [application, setApplication] =
    useState<StatusResponse["application"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStatus() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<StatusResponse>(
        "/api/rider/application-status"
      );

      setApplication(response.data?.application ?? null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load rider application status"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">
          Loading rider application status...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Login required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider application status is protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login with the same account used for your rider application to view
          your current approval status.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login
          </Link>
          <Link
            href="/riders/apply"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Apply as rider
          </Link>
        </div>
      </section>
    );
  }

  if (!application?.submitted || !application.profile) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="info">No application found</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          No rider application is attached to this account.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Apply using the same email or phone on your Veylo account. Once
          submitted, your application status will appear here.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/riders/apply"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Apply as rider
          </Link>
          <Link
            href="/profile"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            View profile
          </Link>
        </div>
      </section>
    );
  }

  const profile = application.profile;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone={statusTone(profile.verificationStatus)}>
              {profile.verificationStatus.replaceAll("_", " ").toLowerCase()}
            </StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Rider application status.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
              {statusMessage(profile.verificationStatus)}
            </p>
          </div>

          <StatusChip tone="info">{profile.tier}</StatusChip>
        </div>

        <div className="mt-7 rounded-[26px] border border-[#e5ded2] bg-[#fffdf8] p-5">
          <p className="text-sm text-[#667085]">Applicant</p>
          <p className="mt-1 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
            {profile.displayName}
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-[#667085]">Phone</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {profile.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Area</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {profile.residentialArea || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Bike access</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {profile.bikeAccessType?.replaceAll("_", " ").toLowerCase() ||
                  "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Experience</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {profile.dispatchExperience
                  ?.replaceAll("_", " ")
                  .toLowerCase() || "Not set"}
              </p>
            </div>
          </div>
        </div>

        <RiderDocumentUploadPanel initialDocuments={profile.documents ?? []} />

        <RiderTrainingChecklist initialDocuments={profile.documents ?? []} />

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {profile.verificationStatus === "VERIFIED" ? (
            <Link
              href="/rider"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              Open rider dashboard
            </Link>
          ) : (
            <Link
              href="/support/new"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              Contact support
            </Link>
          )}

          <button
            type="button"
            onClick={loadStatus}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh status
          </button>
        </div>
      </section>

      <Panel
        title="Review process"
        body="What happens before a rider is allowed to receive jobs."
      >
        <div className="grid gap-3">
          {[
            "Application submitted and attached to your user account.",
            "Admin reviews phone, location, reference, bike access, experience, and conduct readiness.",
            "If approved, your user role becomes RIDER and your profile becomes VERIFIED.",
            "Verified riders can access rider jobs, earnings, proof uploads, and support tools.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm leading-6 text-[#475467]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-[#f2d59b] bg-[#fff5dc] p-4 text-sm leading-6 text-[#8a5a00]">
          Veylo should not allow fully open rider onboarding. Verified riders,
          proof rules, and admin review protect trust and delivery quality.
        </div>
      </Panel>
    </div>
  );
}
