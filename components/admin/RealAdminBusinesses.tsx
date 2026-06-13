"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import { BusinessStatusControl } from "@/components/admin/BusinessStatusControl";
import { BusinessRequestDecisionControl } from "@/components/admin/BusinessRequestDecisionControl";

type BusinessProfile = {
  id?: string;
  _id?: string;
  businessName: string;
  businessType: string;
  contactPhone: string;
  contactEmail?: string;
  address?: string;
  planType: string;
  accountStatus: string;
  weeklyDeliveryEstimate?: string;
  approvedDiscountRate?: number;
  discountCap?: number;
  monthlyOrderCount?: number;
  createdAt?: string;
};

type BusinessRequest = {
  id?: string;
  _id?: string;
  businessName: string;
  businessType: string;
  contactName?: string;
  contactPhone: string;
  contactEmail?: string;
  weeklyDeliveryEstimate?: string;
  message?: string;
  status: string;
  createdAt?: string;
};

type AdminBusinessesResponse = {
  businesses: {
    profiles: BusinessProfile[];
    requests: BusinessRequest[];
  };
};

function itemId(item: { id?: string; _id?: string }) {
  return item.id || item._id || "";
}

function statusTone(status: string) {
  if (["ACTIVE", "APPROVED"].includes(status)) return "success" as const;
  if (["PENDING", "UNDER_REVIEW", "PAUSED"].includes(status)) {
    return "warning" as const;
  }
  if (["SUSPENDED", "REJECTED"].includes(status)) return "danger" as const;
  return "info" as const;
}

export function RealAdminBusinesses() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBusinesses() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AdminBusinessesResponse>(
        "/api/admin/businesses"
      );

      setProfiles(response.data?.businesses?.profiles ?? []);
      setRequests(response.data?.businesses?.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load businesses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBusinesses();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real business records...</p>
      </section>
    );
  }

  if (error && !profiles.length && !requests.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business operations are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login as admin to review business requests, approve business profiles,
          manage plans, pause accounts, and adjust business discounts.
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

  const activeProfiles = profiles.filter((profile) => profile.accountStatus === "ACTIVE");
  const pendingRequests = requests.filter((request) =>
    ["PENDING", "UNDER_REVIEW"].includes(request.status)
  );
  const rejectedRequests = requests.filter((request) => request.status === "REJECTED");
  const approvedRequests = requests.filter((request) => request.status === "APPROVED");

  const metrics = [
    {
      label: "Business profiles",
      value: String(profiles.length),
      note: `${activeProfiles.length} active accounts`,
    },
    {
      label: "Pending requests",
      value: String(pendingRequests.length),
      note: "Needs admin review",
    },
    {
      label: "Approved requests",
      value: String(approvedRequests.length),
      note: "Converted or accepted",
    },
    {
      label: "Rejected requests",
      value: String(rejectedRequests.length),
      note: "Not approved",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real business admin</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Business requests and profiles.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              Review incoming business account requests, approve matching user
              accounts into business profiles, and manage active business plan
              controls.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBusinesses}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh businesses
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
          title="Business requests"
          body="Requests submitted from the public business account form."
        >
          {requests.length ? (
            <div className="grid gap-4">
              {requests.map((request) => {
                const requestId = itemId(request);

                return (
                  <div
                    key={requestId || request.businessName}
                    className="rounded-[26px] border border-[#e5ded2] bg-[#fffdf8] p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                            {request.businessName}
                          </p>
                          <StatusChip tone={statusTone(request.status)}>
                            {request.status.replaceAll("_", " ").toLowerCase()}
                          </StatusChip>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                          {request.businessType} · {request.weeklyDeliveryEstimate || "Volume not set"}
                        </p>

                        <div className="mt-3 grid gap-2 text-xs text-[#667085]">
                          <p>Contact: {request.contactName || "Not provided"}</p>
                          <p>Phone: {request.contactPhone}</p>
                          <p>Email: {request.contactEmail || "Not provided"}</p>
                        </div>

                        {request.message ? (
                          <p className="mt-3 text-sm leading-6 text-[#475467]">
                            {request.message}
                          </p>
                        ) : null}
                      </div>

                      {request.createdAt ? (
                        <p className="text-xs text-[#98a2b3]">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      ) : null}
                    </div>

                    {requestId ? (
                      <BusinessRequestDecisionControl
                        requestId={requestId}
                        businessName={request.businessName}
                        currentStatus={request.status}
                        onDecision={loadBusinesses}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No business requests yet. Requests submitted from
                /business/request will appear here.
              </p>
              <Link
                href="/business/request"
                className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                Open request form
              </Link>
            </div>
          )}
        </Panel>

        <Panel
          title="Business profiles"
          body="Approved business profiles used by business dashboard and pricing."
        >
          {profiles.length ? (
            <div className="grid gap-4">
              {profiles.map((profile) => {
                const profileId = itemId(profile);

                return (
                  <div
                    key={profileId || profile.businessName}
                    className="rounded-[26px] border border-[#e5ded2] bg-[#fffdf8] p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                            {profile.businessName}
                          </p>
                          <StatusChip tone={statusTone(profile.accountStatus)}>
                            {profile.accountStatus.toLowerCase()}
                          </StatusChip>
                          <StatusChip tone="info">{profile.planType}</StatusChip>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                          {profile.businessType} · {profile.weeklyDeliveryEstimate || "Volume not set"}
                        </p>

                        <div className="mt-3 grid gap-2 text-xs text-[#667085]">
                          <p>Phone: {profile.contactPhone}</p>
                          <p>Email: {profile.contactEmail || "Not provided"}</p>
                          <p>Monthly orders: {profile.monthlyOrderCount ?? 0}</p>
                          <p>Discount rate: {profile.approvedDiscountRate ?? 0}%</p>
                          <p>Discount cap: ₦{profile.discountCap ?? 0}</p>
                        </div>
                      </div>

                      {profile.createdAt ? (
                        <p className="text-xs text-[#98a2b3]">
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      ) : null}
                    </div>

                    {profileId ? (
                      <BusinessStatusControl
                        businessId={profileId}
                        businessName={profile.businessName}
                        currentStatus={profile.accountStatus}
                        currentPlanType={profile.planType}
                        currentDiscountRate={profile.approvedDiscountRate}
                        currentDiscountCap={profile.discountCap}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              No approved business profiles yet.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
