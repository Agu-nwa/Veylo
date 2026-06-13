"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type BusinessProfile = {
  id: string;
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
  id: string;
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

function statusTone(status: string) {
  if (["ACTIVE", "APPROVED"].includes(status)) return "success" as const;
  if (["PENDING", "UNDER_REVIEW"].includes(status)) return "warning" as const;
  if (["SUSPENDED", "REJECTED", "PAUSED"].includes(status)) return "danger" as const;
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
        <p className="text-sm text-[#667085]">Loading real business requests...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business records are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This screen now connects to the real admin backend. You need an ADMIN
          session to view business requests and approved business profiles.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/business/request"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Submit business request
          </Link>
        </div>

        <p className="mt-5 text-xs leading-5 text-[#98a2b3]">
          Next phase will add a safe local admin seed script so you can create an
          admin account without exposing public admin registration.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real admin data</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Business requests and profiles.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This screen now reads real business requests and approved business
              profiles from MongoDB through protected admin APIs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-right">
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
              <p className="text-xs text-[#667085]">Requests</p>
              <p className="mt-1 text-2xl font-medium text-[#071a2f]">
                {requests.length}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
              <p className="text-xs text-[#667085]">Profiles</p>
              <p className="mt-1 text-2xl font-medium text-[#071a2f]">
                {profiles.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card rounded-[32px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1f7a55]">
                Business requests
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
                Submitted business leads
              </h2>
            </div>
            <StatusChip tone="info">{requests.length} total</StatusChip>
          </div>

          <div className="mt-6 grid gap-3">
            {requests.length ? (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[#071a2f]">
                          {request.businessName}
                        </p>
                        <StatusChip tone={statusTone(request.status)}>
                          {request.status.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#667085]">
                        {request.businessType} · {request.weeklyDeliveryEstimate || "No volume stated"}
                      </p>

                      {request.message ? (
                        <p className="mt-2 text-xs leading-5 text-[#667085]">
                          {request.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-[#667085]">
                        {request.contactName || "Contact"}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#071a2f]">
                        {request.contactPhone}
                      </p>
                      {request.contactEmail ? (
                        <p className="mt-1 text-xs text-[#667085]">
                          {request.contactEmail}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm leading-6 text-[#667085]">
                  No business requests yet. Submit one from the business request
                  page to test the full flow.
                </p>
                <Link
                  href="/business/request"
                  className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
                >
                  Submit business request
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card rounded-[32px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1f7a55]">
                Business profiles
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
                Approved accounts
              </h2>
            </div>
            <StatusChip tone="info">{profiles.length} total</StatusChip>
          </div>

          <div className="mt-6 grid gap-3">
            {profiles.length ? (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-[#071a2f]">
                      {profile.businessName}
                    </p>
                    <StatusChip tone={statusTone(profile.accountStatus)}>
                      {profile.accountStatus.toLowerCase()}
                    </StatusChip>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {profile.businessType} · {profile.planType}
                  </p>

                  <div className="mt-3 grid gap-2 text-xs text-[#667085]">
                    <p>Phone: {profile.contactPhone}</p>
                    <p>Monthly orders: {profile.monthlyOrderCount ?? 0}</p>
                    <p>Discount cap: ₦{profile.discountCap ?? 0}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm leading-6 text-[#667085]">
                  No approved business profiles yet. Admin approval workflow will
                  connect in a later operations phase.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
