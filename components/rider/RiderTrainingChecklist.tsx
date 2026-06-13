"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type RiderDocument = {
  _id?: string;
  id?: string;
  type?: string;
  url?: string;
  status?: string;
};

type TrainingResponse = {
  profile: {
    documents?: RiderDocument[];
  };
  documents: RiderDocument[];
};

const checklistItems = [
  {
    key: "otpRulesAccepted",
    title: "OTP rules",
    body: "I will not mark pickup or delivery complete unless the correct OTP or confirmation process has been followed.",
  },
  {
    key: "proofRulesAccepted",
    title: "Proof rules",
    body: "I will upload accurate proof when required and will not manipulate delivery proof, status, or confirmation records.",
  },
  {
    key: "packageHandlingAccepted",
    title: "Package handling",
    body: "I will handle packages carefully and report damaged, unsafe, restricted, or unclear items.",
  },
  {
    key: "conductRulesAccepted",
    title: "Professional conduct",
    body: "I will communicate respectfully with customers, businesses, recipients, and support staff.",
  },
  {
    key: "supportRulesAccepted",
    title: "Support escalation",
    body: "I will contact Veylo support when pickup, delivery, payment, proof, or recipient issues need review.",
  },
  {
    key: "safetyRulesAccepted",
    title: "Safety and route responsibility",
    body: "I will avoid unsafe delivery behavior and will not create false pickup, delivery, or location updates.",
  },
] as const;

function statusTone(status?: string) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
}

export function RiderTrainingChecklist({
  initialDocuments = [],
}: {
  initialDocuments?: RiderDocument[];
}) {
  const existingTraining = initialDocuments.find(
    (document) => document.type === "TRAINING_ACKNOWLEDGEMENT"
  );

  const [checked, setChecked] = useState<Record<string, boolean>>({
    otpRulesAccepted: false,
    proofRulesAccepted: false,
    packageHandlingAccepted: false,
    conductRulesAccepted: false,
    supportRulesAccepted: false,
    safetyRulesAccepted: false,
  });

  const [acknowledgementName, setAcknowledgementName] = useState("");
  const [trainingDocument, setTrainingDocument] = useState<RiderDocument | null>(
    existingTraining ?? null
  );
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function toggle(key: string, value: boolean) {
    setChecked((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submitTraining() {
    try {
      setError("");
      setNotice("");
      setLoading(true);

      const response = await apiRequest<TrainingResponse>(
        "/api/rider/training-acknowledgement",
        {
          method: "POST",
          body: JSON.stringify({
            ...checked,
            acknowledgementName,
          }),
        }
      );

      const training = response.data?.documents?.find(
        (document) => document.type === "TRAINING_ACKNOWLEDGEMENT"
      );

      setTrainingDocument(training ?? null);
      setNotice("Training acknowledgement submitted for admin review.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit training acknowledgement"
      );
    } finally {
      setLoading(false);
    }
  }

  const allChecked = Object.values(checked).every(Boolean);
  const disabled = loading || !allChecked || acknowledgementName.trim().length < 2;

  return (
    <section className="mt-6 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-[#1f7a55]">
            Rider training acknowledgement
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
            Confirm Veylo rider operating rules.
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            This acknowledgement is saved as a rider verification document.
            Admin can approve or reject it from the rider review screen.
          </p>
        </div>

        {trainingDocument ? (
          <StatusChip tone={statusTone(trainingDocument.status)}>
            {trainingDocument.status?.toLowerCase() || "pending"}
          </StatusChip>
        ) : (
          <StatusChip tone="warning">not submitted</StatusChip>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        {checklistItems.map((item) => (
          <label
            key={item.key}
            className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
          >
            <input
              type="checkbox"
              checked={checked[item.key]}
              onChange={(event) => toggle(item.key, event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium text-[#071a2f]">
                {item.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#667085]">
                {item.body}
              </span>
            </span>
          </label>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="label">Acknowledgement name</span>
        <input
          className="field"
          value={acknowledgementName}
          onChange={(event) => setAcknowledgementName(event.target.value)}
          placeholder="Type your full name"
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
        onClick={submitTraining}
        disabled={disabled}
        className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit training acknowledgement"}
      </button>
    </section>
  );
}
