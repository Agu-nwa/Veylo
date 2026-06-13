"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

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
  rating?: number;
  completedJobs?: number;
  acceptanceRate?: number;
  completionRate?: number;
  disputeRate?: number;
  proofComplianceRate?: number;
  tier: string;
  suspensionStatus?: string;
};

type RiderProfileResponse = {
  profile: RiderProfile;
};

function statusTone(status: string) {
  if (["VERIFIED", "PRIORITY"].includes(status)) return "success" as const;
  if (["PENDING", "UNDER_REVIEW", "NEW", "STANDARD"].includes(status)) {
    return "warning" as const;
  }
  if (["SUSPENDED", "REJECTED", "TEMPORARY", "INDEFINITE"].includes(status)) {
    return "danger" as const;
  }
  return "info" as const;
}

export function RealRiderProfile() {
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    phone: "",
    residentialArea: "",
    bikeAccessType: "OWN_BIKE",
    dispatchExperience: "1_TO_3_YEARS",
    referencePhone: "",
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

  async function loadProfile() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RiderProfileResponse>(
        "/api/rider/profile"
      );

      const loadedProfile = response.data?.profile ?? null;
      setProfile(loadedProfile);

      if (loadedProfile) {
        setForm({
          displayName: loadedProfile.displayName || "",
          phone: loadedProfile.phone || "",
          residentialArea: loadedProfile.residentialArea || "",
          bikeAccessType: loadedProfile.bikeAccessType || "OWN_BIKE",
          dispatchExperience:
            loadedProfile.dispatchExperience || "1_TO_3_YEARS",
          referencePhone: loadedProfile.referencePhone || "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      setError("");
      setNotice("");
      setSaving(true);

      const response = await apiRequest<RiderProfileResponse>(
        "/api/rider/profile",
        {
          method: "PATCH",
          body: JSON.stringify({
            displayName: form.displayName,
            phone: form.phone,
            residentialArea: form.residentialArea,
            bikeAccessType: form.bikeAccessType,
            dispatchExperience: form.dispatchExperience,
            referencePhone: form.referencePhone,
          }),
        }
      );

      setProfile(response.data?.profile ?? null);
      setNotice("Rider profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real rider profile...</p>
      </section>
    );
  }

  if (error && !profile) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Rider login required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider profile is protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login with a rider account to view and update your rider profile.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as rider
          </Link>
          <Link
            href="/rider"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Rider dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real rider profile</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {profile?.displayName || "Rider profile"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
              This profile is loaded from the rider backend and can be updated
              through the real rider profile API.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusChip tone={statusTone(profile?.verificationStatus || "")}>
              {profile?.verificationStatus?.replaceAll("_", " ").toLowerCase()}
            </StatusChip>
            <StatusChip tone="info">{profile?.tier}</StatusChip>
          </div>
        </div>

        <form className="mt-7 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Display name</span>
              <input
                className="field"
                value={form.displayName}
                onChange={(event) =>
                  updateField("displayName", event.target.value)
                }
              />
            </label>

            <label>
              <span className="label">Phone</span>
              <input
                className="field"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
          </div>

          <label>
            <span className="label">Residential area</span>
            <input
              className="field"
              value={form.residentialArea}
              onChange={(event) =>
                updateField("residentialArea", event.target.value)
              }
              placeholder="Example: Ikenegbu, Owerri"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">Bike access</span>
              <select
                className="field"
                value={form.bikeAccessType}
                onChange={(event) =>
                  updateField("bikeAccessType", event.target.value)
                }
              >
                <option value="OWN_BIKE">Own bike</option>
                <option value="PERMISSIONED_BIKE">Permissioned bike</option>
                <option value="FLEET">Fleet</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label>
              <span className="label">Dispatch experience</span>
              <select
                className="field"
                value={form.dispatchExperience}
                onChange={(event) =>
                  updateField("dispatchExperience", event.target.value)
                }
              >
                <option value="LESS_THAN_6_MONTHS">Less than 6 months</option>
                <option value="6_TO_12_MONTHS">6 to 12 months</option>
                <option value="1_TO_3_YEARS">1 to 3 years</option>
                <option value="3_PLUS_YEARS">3+ years</option>
              </select>
            </label>
          </div>

          <label>
            <span className="label">Reference phone</span>
            <input
              className="field"
              value={form.referencePhone}
              onChange={(event) =>
                updateField("referencePhone", event.target.value)
              }
              placeholder="Optional reference contact"
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
            onClick={saveProfile}
            disabled={saving || !form.displayName || !form.phone}
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save rider profile"}
          </button>
        </form>
      </section>

      <Panel
        title="Rider verification health"
        body="Verification and performance fields are controlled by operations."
      >
        <div className="grid gap-3">
          {[
            ["Profile ID", profile?.id || profile?._id || "Not available"],
            ["Verification", profile?.verificationStatus || "Not set"],
            ["Tier", profile?.tier || "Not set"],
            ["Suspension", profile?.suspensionStatus || "NONE"],
            ["Rating", profile?.rating ? `${profile.rating}/5` : "No rating"],
            ["Completed jobs", String(profile?.completedJobs ?? 0)],
            ["Acceptance rate", `${profile?.acceptanceRate ?? 0}%`],
            ["Completion rate", `${profile?.completionRate ?? 0}%`],
            ["Proof compliance", `${profile?.proofComplianceRate ?? 0}%`],
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/rider/jobs"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            View jobs
          </Link>
          <Link
            href="/rider/earnings"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            View earnings
          </Link>
        </div>
      </Panel>
    </div>
  );
}
