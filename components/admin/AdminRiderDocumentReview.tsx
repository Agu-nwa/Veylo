"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

type RiderDocument = {
  _id?: string;
  id?: string;
  type?: string;
  url?: string;
  status?: DocumentStatus;
};

type RiderResponse = {
  rider: {
    _id?: string;
    id?: string;
    documents?: RiderDocument[];
  };
  document: RiderDocument;
};

function statusTone(status?: string) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
}

function isImageUrl(url?: string) {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(url);
}

export function AdminRiderDocumentReview({
  riderId,
  documents = [],
  onReviewed,
}: {
  riderId: string;
  documents?: RiderDocument[];
  onReviewed?: () => void;
}) {
  const [localDocuments, setLocalDocuments] = useState<RiderDocument[]>(documents);
  const [workingKey, setWorkingKey] = useState("");
  const [reason, setReason] = useState("Admin reviewed rider verification document.");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function reviewDocument(index: number, status: DocumentStatus) {
    try {
      setError("");
      setNotice("");
      setWorkingKey(`${index}-${status}`);

      const response = await apiRequest<RiderResponse>(
        `/api/admin/riders/${riderId}/documents/${index}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            reason,
          }),
        }
      );

      const updatedDocuments = response.data?.rider?.documents;

      if (updatedDocuments) {
        setLocalDocuments(updatedDocuments);
      } else {
        setLocalDocuments((current) =>
          current.map((document, documentIndex) =>
            documentIndex === index ? { ...document, status } : document
          )
        );
      }

      setNotice(`Document marked ${status.toLowerCase()}.`);
      onReviewed?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not review rider document"
      );
    } finally {
      setWorkingKey("");
    }
  }

  return (
    <div className="mt-5 rounded-[22px] border border-[#e5ded2] bg-[#fffdf8] p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-[#071a2f]">
            Rider document review
          </p>
          <p className="mt-1 text-xs leading-5 text-[#667085]">
            Approve or reject submitted ID, bike, reference, photo, and training
            documents before final rider verification.
          </p>
        </div>

        <StatusChip tone="info">{localDocuments.length} documents</StatusChip>
      </div>

      <label className="mt-4 block">
        <span className="label">Review reason</span>
        <textarea
          className="field"
          rows={3}
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

      {localDocuments.length ? (
        <div className="mt-5 grid gap-3">
          {localDocuments.map((document, index) => (
            <div
              key={document._id || document.id || `${document.type}-${index}`}
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-[#071a2f]">
                      {(document.type || "Document")
                        .replaceAll("_", " ")
                        .toLowerCase()}
                    </p>
                    <StatusChip tone={statusTone(document.status)}>
                      {(document.status || "PENDING").toLowerCase()}
                    </StatusChip>
                  </div>

                  {document.url ? (
                    <div className="mt-3">
                      {isImageUrl(document.url) ? (
                        <img
                          src={document.url}
                          alt="Rider document"
                          className="max-h-48 rounded-2xl border border-[#e5ded2] object-cover"
                        />
                      ) : null}

                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-xs font-medium text-[#1f7a55]"
                      >
                        Open document
                      </a>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-[#667085]">
                      No document URL stored.
                    </p>
                  )}
                </div>

                <div className="grid shrink-0 gap-2 sm:grid-cols-2 md:min-w-[220px]">
                  <button
                    type="button"
                    onClick={() => reviewDocument(index, "APPROVED")}
                    disabled={workingKey !== "" || reason.trim().length < 5}
                    className="rounded-full bg-[#071a2f] px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
                  >
                    {workingKey === `${index}-APPROVED`
                      ? "Approving..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    onClick={() => reviewDocument(index, "REJECTED")}
                    disabled={workingKey !== "" || reason.trim().length < 5}
                    className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-xs font-medium text-[#071a2f] disabled:opacity-60"
                  >
                    {workingKey === `${index}-REJECTED`
                      ? "Rejecting..."
                      : "Reject"}
                  </button>

                  <button
                    type="button"
                    onClick={() => reviewDocument(index, "PENDING")}
                    disabled={workingKey !== "" || reason.trim().length < 5}
                    className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-xs font-medium text-[#071a2f] disabled:opacity-60 sm:col-span-2"
                  >
                    {workingKey === `${index}-PENDING`
                      ? "Resetting..."
                      : "Reset to pending"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[#f2d59b] bg-[#fff5dc] p-4 text-sm leading-6 text-[#8a5a00]">
          No rider documents submitted yet. Ask the applicant to upload ID, bike
          document, rider photo, permission note, or reference evidence from
          /riders/status.
        </div>
      )}
    </div>
  );
}
