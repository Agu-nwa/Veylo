"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type DisputeRecord = {
  id?: string;
  _id?: string;
  disputeId?: string;
  ticketId?: string;
  orderId?: string;
  category?: string;
  subject?: string;
  message?: string;
  reason?: string;
  resolution?: string;
  status: string;
  priority?: string;
  customerName?: string;
  riderName?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AdminDisputesResponse = {
  disputes?: DisputeRecord[];
  tickets?: DisputeRecord[];
  supportTickets?: DisputeRecord[];
  disputeQueue?: DisputeRecord[];
};

type DisputeUpdateResponse = {
  dispute?: DisputeRecord;
  ticket?: DisputeRecord;
};

const statusOptions = [
  "OPEN",
  "UNDER_REVIEW",
  "WAITING_FOR_USER",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
];

function recordId(record: DisputeRecord) {
  return record.id || record._id || record.disputeId || record.ticketId || "";
}

function displayId(record: DisputeRecord) {
  return record.disputeId || record.ticketId || record.id || record._id || "Record";
}

function statusTone(status: string) {
  if (["RESOLVED", "CLOSED"].includes(status)) return "success" as const;

  if (["OPEN", "UNDER_REVIEW", "WAITING_FOR_USER", "ESCALATED"].includes(status)) {
    return "warning" as const;
  }

  if (["REJECTED", "FAILED", "CANCELLED"].includes(status)) return "danger" as const;

  return "info" as const;
}

function priorityTone(priority?: string) {
  if (["HIGH", "URGENT", "CRITICAL"].includes(priority || "")) return "danger" as const;
  if (["MEDIUM", "NORMAL"].includes(priority || "")) return "warning" as const;
  return "info" as const;
}

export function RealAdminDisputes() {
  const [records, setRecords] = useState<DisputeRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [nextStatus, setNextStatus] = useState("UNDER_REVIEW");
  const [resolution, setResolution] = useState("Admin reviewed this dispute record.");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedRecord = useMemo(
    () => records.find((record) => recordId(record) === selectedId) ?? null,
    [records, selectedId]
  );

  async function loadDisputes() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AdminDisputesResponse>("/api/admin/disputes");

      const loaded =
        response.data?.disputes ??
        response.data?.tickets ??
        response.data?.supportTickets ??
        response.data?.disputeQueue ??
        [];

      setRecords(loaded);

      if (!selectedId && loaded.length) {
        setSelectedId(recordId(loaded[0]));
        setNextStatus(loaded[0].status || "UNDER_REVIEW");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load disputes");
    } finally {
      setLoading(false);
    }
  }

  function selectRecord(record: DisputeRecord) {
    setSelectedId(recordId(record));
    setNextStatus(record.status || "UNDER_REVIEW");
    setResolution(record.resolution || "Admin reviewed this dispute record.");
    setNotice("");
    setError("");
  }

  async function updateDispute() {
    if (!selectedRecord) return;

    const id = recordId(selectedRecord);

    if (!id) {
      setError("This record has no valid backend ID.");
      return;
    }

    try {
      setError("");
      setNotice("");
      setUpdating(true);

      const response = await apiRequest<DisputeUpdateResponse>(
        `/api/admin/disputes/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: nextStatus,
            resolution,
            reason: resolution,
          }),
        }
      );

      const updated = response.data?.dispute ?? response.data?.ticket;

      if (updated) {
        setRecords((current) =>
          current.map((record) =>
            recordId(record) === recordId(updated) ? updated : record
          )
        );
      }

      setNotice("Dispute record updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update dispute. The backend may have rejected this status change."
      );
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    loadDisputes();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real dispute records...</p>
      </section>
    );
  }

  if (error && !records.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Dispute records are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page connects to the protected backend dispute and support-risk
          API. Login as admin to review escalations, delivery issues, and
          operations risk records.
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

  const openRecords = records.filter((record) =>
    ["OPEN", "UNDER_REVIEW", "WAITING_FOR_USER", "ESCALATED"].includes(record.status)
  );

  const resolvedRecords = records.filter((record) =>
    ["RESOLVED", "CLOSED"].includes(record.status)
  );

  const highPriority = records.filter((record) =>
    ["HIGH", "URGENT", "CRITICAL"].includes(record.priority || "")
  );

  const orderLinked = records.filter((record) => record.orderId);

  const metrics = [
    {
      label: "Total records",
      value: String(records.length),
      note: "Disputes and support-risk records",
    },
    {
      label: "Open review",
      value: String(openRecords.length),
      note: "Needs admin attention",
    },
    {
      label: "Resolved",
      value: String(resolvedRecords.length),
      note: "Closed or resolved",
    },
    {
      label: "High priority",
      value: String(highPriority.length),
      note: `${orderLinked.length} linked to orders`,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real dispute operations</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Disputes and support-risk review.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads real backend dispute/support-risk records and lets
              admin review escalation status, linked orders, priority, and
              resolution notes.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDisputes}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh disputes
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
          title="Dispute queue"
          body="Real escalation records requiring admin review."
        >
          {records.length ? (
            <div className="grid gap-3">
              {records.map((record) => (
                <button
                  key={recordId(record) || displayId(record)}
                  type="button"
                  onClick={() => selectRecord(record)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedId === recordId(record)
                      ? "border-[#071a2f] bg-[#071a2f] text-white"
                      : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f] hover:border-[#071a2f]/30"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{displayId(record)}</p>
                        <StatusChip tone={statusTone(record.status)}>
                          {record.status.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                        {record.priority ? (
                          <StatusChip tone={priorityTone(record.priority)}>
                            {record.priority.toLowerCase()}
                          </StatusChip>
                        ) : null}
                      </div>

                      <p
                        className={`mt-2 text-xs leading-5 ${
                          selectedId === recordId(record)
                            ? "text-white/70"
                            : "text-[#667085]"
                        }`}
                      >
                        {record.subject || record.category || "Dispute record"}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          selectedId === recordId(record)
                            ? "text-white/60"
                            : "text-[#98a2b3]"
                        }`}
                      >
                        {record.orderId ? `Order ${record.orderId}` : "No order linked"}
                      </p>
                    </div>

                    {record.createdAt ? (
                      <p className="text-xs">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No dispute or risk records yet. Create a support ticket or
                delivery issue to populate this queue.
              </p>
              <Link
                href="/support/new"
                className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                Create support ticket
              </Link>
            </div>
          )}
        </Panel>

        <Panel
          title="Selected record"
          body="Review details and apply admin resolution status."
        >
          {selectedRecord ? (
            <div>
              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                    {displayId(selectedRecord)}
                  </p>
                  <StatusChip tone={statusTone(selectedRecord.status)}>
                    {selectedRecord.status.replaceAll("_", " ").toLowerCase()}
                  </StatusChip>
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <p className="text-xs text-[#667085]">Subject</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedRecord.subject || selectedRecord.category || "No subject"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">Message</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedRecord.message ||
                        selectedRecord.reason ||
                        "No message stored for this record."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">Order</p>
                    {selectedRecord.orderId ? (
                      <Link
                        href={`/orders/${selectedRecord.orderId}`}
                        className="mt-1 inline-flex text-sm font-medium text-[#1f7a55]"
                      >
                        {selectedRecord.orderId}
                      </Link>
                    ) : (
                      <p className="mt-1 text-sm text-[#071a2f]">
                        No order linked
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm font-medium text-[#071a2f]">
                  Admin decision
                </p>
                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  The backend controls allowed dispute updates and may reject
                  invalid transitions.
                </p>

                <label className="mt-5 block">
                  <span className="label">Next status</span>
                  <select
                    className="field"
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="label">Resolution note</span>
                  <textarea
                    className="field"
                    rows={5}
                    value={resolution}
                    onChange={(event) => setResolution(event.target.value)}
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
                  onClick={updateDispute}
                  disabled={updating || resolution.trim().length < 5}
                  className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Update dispute"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select a dispute record to review details.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
