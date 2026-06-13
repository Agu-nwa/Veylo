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

type RiderProfile = {
  documents?: RiderDocument[];
};

type RiderDocumentResponse = {
  profile: RiderProfile;
  documents: RiderDocument[];
};

type UploadResponse = {
  url: string;
  filename: string;
  contentType: string;
  size: number;
};

const documentTypes = [
  {
    value: "GOVERNMENT_ID",
    label: "Government ID",
  },
  {
    value: "RIDER_PHOTO",
    label: "Rider profile photo",
  },
  {
    value: "BIKE_DOCUMENT",
    label: "Bike document",
  },
  {
    value: "BIKE_PERMISSION",
    label: "Bike permission",
  },
  {
    value: "REFERENCE_NOTE",
    label: "Reference note",
  },
  {
    value: "TRAINING_ACKNOWLEDGEMENT",
    label: "Training acknowledgement",
  },
  {
    value: "OTHER",
    label: "Other document",
  },
];

function statusTone(status?: string) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
}

function isImageUrl(url?: string) {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(url);
}

export function RiderDocumentUploadPanel({
  initialDocuments = [],
}: {
  initialDocuments?: RiderDocument[];
}) {
  const [documents, setDocuments] = useState<RiderDocument[]>(initialDocuments);
  const [documentType, setDocumentType] = useState("GOVERNMENT_ID");
  const [file, setFile] = useState<File | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function uploadFile() {
    if (!file) return manualUrl.trim();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/rider-documents", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const payload = (await response.json()) as {
      ok: boolean;
      data: UploadResponse | null;
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data?.url) {
      throw new Error(payload.message || "Could not upload rider document");
    }

    return payload.data.url;
  }

  async function saveDocument() {
    try {
      setError("");
      setNotice("");
      setUploading(true);

      const url = await uploadFile();

      if (!url) {
        throw new Error("Upload a file or paste a document URL.");
      }

      const response = await apiRequest<RiderDocumentResponse>(
        "/api/rider/documents",
        {
          method: "POST",
          body: JSON.stringify({
            type: documentType,
            url,
          }),
        }
      );

      setDocuments(response.data?.documents ?? []);
      setFile(null);
      setManualUrl("");
      setNotice("Rider document saved for admin review.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save document");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="mt-6 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-[#1f7a55]">Rider documents</p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
            Upload verification documents.
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Upload ID, bike document, permission note, rider photo, or reference
            evidence. Admin must review documents before full rider trust is
            established.
          </p>
        </div>

        <StatusChip tone="info">{documents.length} documents</StatusChip>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[22px] border border-[#e5ded2] bg-[#fffdf8] p-4">
          <p className="text-sm font-medium text-[#071a2f]">Add document</p>

          <label className="mt-4 block">
            <span className="label">Document type</span>
            <select
              className="field"
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
            >
              {documentTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="label">Upload file</span>
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
            <span className="label">Or paste document URL</span>
            <input
              className="field"
              value={manualUrl}
              onChange={(event) => setManualUrl(event.target.value)}
              placeholder="Optional if uploading file"
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
            onClick={saveDocument}
            disabled={uploading || (!file && !manualUrl.trim())}
            className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploading ? "Saving document..." : "Save document"}
          </button>
        </div>

        <div className="rounded-[22px] border border-[#e5ded2] bg-[#fffdf8] p-4">
          <p className="text-sm font-medium text-[#071a2f]">Submitted documents</p>

          {documents.length ? (
            <div className="mt-4 grid gap-3">
              {documents.map((document, index) => (
                <div
                  key={document._id || document.id || `${document.type}-${index}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#071a2f]">
                        {(document.type || "Document")
                          .replaceAll("_", " ")
                          .toLowerCase()}
                      </p>
                      <p className="mt-1 text-xs text-[#667085]">
                        Awaiting admin document review.
                      </p>
                    </div>

                    <StatusChip tone={statusTone(document.status)}>
                      {document.status?.toLowerCase() || "pending"}
                    </StatusChip>
                  </div>

                  {document.url ? (
                    <div className="mt-3">
                      {isImageUrl(document.url) ? (
                        <img
                          src={document.url}
                          alt="Rider document"
                          className="max-h-56 rounded-2xl border border-[#e5ded2] object-cover"
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
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              No documents submitted yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
