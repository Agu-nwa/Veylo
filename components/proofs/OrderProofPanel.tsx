"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type ProofType =
  | "PICKUP_OTP"
  | "DELIVERY_OTP"
  | "PHOTO_PROOF"
  | "RECIPIENT_CONFIRMATION"
  | "RIDER_NOTE"
  | "ADMIN_OVERRIDE";

type ProofRecord = {
  _id?: string;
  id?: string;
  orderId: string;
  proofType: ProofType;
  uploadedBy?: string;
  imageUrl?: string;
  note?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};

type ProofCreateResponse = {
  proof: ProofRecord;
};

type ProofListResponse = {
  proofs: ProofRecord[];
};

type ProofUploadResponse = {
  imageUrl: string;
  filename: string;
  contentType: string;
  size: number;
};

const proofTypes: Array<{ value: ProofType; label: string; note: string }> = [
  {
    value: "PICKUP_OTP",
    label: "Pickup OTP",
    note: "Use when pickup verification is confirmed.",
  },
  {
    value: "DELIVERY_OTP",
    label: "Delivery OTP",
    note: "Use when recipient delivery verification is confirmed.",
  },
  {
    value: "PHOTO_PROOF",
    label: "Photo proof",
    note: "Upload JPG, PNG, WEBP, or PDF proof. Max 5MB.",
  },
  {
    value: "RECIPIENT_CONFIRMATION",
    label: "Recipient confirmation",
    note: "Use when recipient confirms delivery or item condition.",
  },
  {
    value: "RIDER_NOTE",
    label: "Rider note",
    note: "Use for movement, pickup, waiting, or delivery notes.",
  },
  {
    value: "ADMIN_OVERRIDE",
    label: "Admin override",
    note: "Use only for operations/admin evidence notes.",
  },
];

function proofTone(type: string) {
  if (["PICKUP_OTP", "DELIVERY_OTP", "RECIPIENT_CONFIRMATION"].includes(type)) {
    return "success" as const;
  }

  if (["PHOTO_PROOF", "RIDER_NOTE"].includes(type)) {
    return "warning" as const;
  }

  return "info" as const;
}

function isImageUrl(url?: string) {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(url);
}

export function OrderProofPanel({ orderId }: { orderId: string }) {
  const [proofs, setProofs] = useState<ProofRecord[]>([]);
  const [proofType, setProofType] = useState<ProofType>("RIDER_NOTE");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [note, setNote] = useState("");
  const [metadataText, setMetadataText] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingProof, setSavingProof] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProofs() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<ProofListResponse>(
        `/api/orders/${orderId}/proofs`
      );

      setProofs(response.data?.proofs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load proofs");
    } finally {
      setLoading(false);
    }
  }

  function parseMetadata() {
    const trimmed = metadataText.trim();

    if (!trimmed) return {};

    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error("Metadata must be valid JSON or empty.");
    }
  }

  async function uploadProofFile() {
    if (!file) return "";

    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/proofs", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const payload = (await response.json()) as {
        ok: boolean;
        data: ProofUploadResponse | null;
        message?: string;
        error?: {
          code: string;
          details?: unknown;
        };
      };

      if (!response.ok || !payload.ok || !payload.data?.imageUrl) {
        throw new Error(payload.message || "Could not upload proof file");
      }

      return payload.data.imageUrl;
    } finally {
      setUploadingFile(false);
    }
  }

  async function createProof() {
    try {
      setError("");
      setNotice("");
      setSavingProof(true);

      let finalImageUrl = imageUrl.trim();

      if (file) {
        finalImageUrl = await uploadProofFile();
      }

      const response = await apiRequest<ProofCreateResponse>("/api/proofs", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          proofType,
          imageUrl: finalImageUrl || undefined,
          note: note.trim() || undefined,
          metadata: parseMetadata(),
        }),
      });

      const proof = response.data?.proof;

      if (proof) {
        setProofs((current) => [proof, ...current]);
      }

      setNotice("Proof saved successfully.");
      setFile(null);
      setImageUrl("");
      setNote("");
      setMetadataText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save proof");
    } finally {
      setSavingProof(false);
      setUploadingFile(false);
    }
  }

  useEffect(() => {
    loadProofs();
  }, [orderId]);

  const selected = proofTypes.find((item) => item.value === proofType);

  const disabled =
    savingProof ||
    uploadingFile ||
    (proofType === "PHOTO_PROOF" && !file && !imageUrl.trim()) ||
    (!note.trim() && proofType !== "PHOTO_PROOF");

  return (
    <section className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-[#1f7a55]">Proof and evidence</p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
            Proof-backed delivery record.
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Upload delivery evidence or add OTP notes, rider notes, recipient
            confirmations, and admin overrides.
          </p>
        </div>

        <StatusChip tone="info">{proofs.length} proofs</StatusChip>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[22px] border border-[#e5ded2] bg-[#fffdf8] p-4">
          <p className="text-sm font-medium text-[#071a2f]">Add proof</p>

          <label className="mt-4 block">
            <span className="label">Proof type</span>
            <select
              className="field"
              value={proofType}
              onChange={(event) => setProofType(event.target.value as ProofType)}
            >
              {proofTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs leading-5 text-[#667085]">
              {selected?.note}
            </span>
          </label>

          <label className="mt-4 block">
            <span className="label">Upload proof file</span>
            <input
              className="field"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <span className="mt-2 block text-xs leading-5 text-[#667085]">
              JPG, PNG, WEBP, or PDF. Max 5MB. Stored locally for development.
            </span>
          </label>

          <label className="mt-4 block">
            <span className="label">Or paste image/proof URL</span>
            <input
              className="field"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Optional if uploading a file"
            />
          </label>

          <label className="mt-4 block">
            <span className="label">Proof note</span>
            <textarea
              className="field"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Example: Rider arrived at pickup and package was handed over."
            />
          </label>

          <label className="mt-4 block">
            <span className="label">Metadata JSON</span>
            <textarea
              className="field"
              rows={3}
              value={metadataText}
              onChange={(event) => setMetadataText(event.target.value)}
              placeholder='Optional. Example: {"otp":"123456","location":"Ikenegbu"}'
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
            onClick={createProof}
            disabled={disabled}
            className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploadingFile
              ? "Uploading file..."
              : savingProof
                ? "Saving proof..."
                : "Save proof"}
          </button>
        </div>

        <div className="rounded-[22px] border border-[#e5ded2] bg-[#fffdf8] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#071a2f]">Saved proofs</p>
            <button
              type="button"
              onClick={loadProofs}
              className="text-xs font-medium text-[#1f7a55]"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-[#667085]">Loading proofs...</p>
          ) : proofs.length ? (
            <div className="mt-4 grid gap-3">
              {proofs.map((proof, index) => (
                <div
                  key={proof._id || proof.id || `${proof.proofType}-${index}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StatusChip tone={proofTone(proof.proofType)}>
                      {proof.proofType.replaceAll("_", " ").toLowerCase()}
                    </StatusChip>

                    {proof.createdAt ? (
                      <p className="text-[11px] text-[#98a2b3]">
                        {new Date(proof.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>

                  {proof.note ? (
                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                      {proof.note}
                    </p>
                  ) : null}

                  {proof.imageUrl ? (
                    <div className="mt-3">
                      {isImageUrl(proof.imageUrl) ? (
                        <img
                          src={proof.imageUrl}
                          alt="Delivery proof"
                          className="max-h-56 rounded-2xl border border-[#e5ded2] object-cover"
                        />
                      ) : null}

                      <a
                        href={proof.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-xs font-medium text-[#1f7a55]"
                      >
                        Open proof file
                      </a>
                    </div>
                  ) : null}

                  {proof.metadata && Object.keys(proof.metadata).length ? (
                    <pre className="mt-3 overflow-x-auto rounded-2xl border border-[#e5ded2] bg-[#f7f3ec] p-3 text-xs text-[#475467]">
                      {JSON.stringify(proof.metadata, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              No proof records yet. Add an OTP note, rider note, recipient
              confirmation, admin override, or uploaded proof file.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
