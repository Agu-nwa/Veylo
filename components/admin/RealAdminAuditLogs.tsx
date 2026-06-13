"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type AuditLog = {
  id?: string;
  _id?: string;
  actorId?: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};

type AuditLogsResponse = {
  auditLogs: AuditLog[];
};

function logId(log: AuditLog, index: number) {
  return log.id || log._id || `${log.action}-${log.entityId}-${index}`;
}

function actionTone(action: string) {
  if (
    action.includes("LOGIN") ||
    action.includes("CREATED") ||
    action.includes("UPLOADED")
  ) {
    return "success" as const;
  }

  if (
    action.includes("UPDATED") ||
    action.includes("ASSIGNED") ||
    action.includes("STATUS")
  ) {
    return "warning" as const;
  }

  if (
    action.includes("CANCEL") ||
    action.includes("REJECT") ||
    action.includes("SUSPEND") ||
    action.includes("DELETE")
  ) {
    return "danger" as const;
  }

  return "info" as const;
}

export function RealAdminAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredLogs = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return auditLogs;

    return auditLogs.filter((log) =>
      [
        log.action,
        log.entityType,
        log.entityId,
        log.actorRole,
        log.reason,
        log.actorId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [auditLogs, query]);

  const selectedLog = useMemo(
    () =>
      filteredLogs.find((log, index) => logId(log, index) === selectedId) ??
      filteredLogs[0] ??
      null,
    [filteredLogs, selectedId]
  );

  async function loadAuditLogs() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AuditLogsResponse>(
        "/api/admin/audit-logs"
      );

      const loaded = response.data?.auditLogs ?? [];

      setAuditLogs(loaded);

      if (loaded.length) {
        setSelectedId(logId(loaded[0], 0));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load audit logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real audit logs...</p>
      </section>
    );
  }

  if (error && !auditLogs.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Audit logs are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page connects to the protected backend audit log API. Login as
          admin to review system actions, actor roles, changed entities, proof
          uploads, order updates, pricing changes, and security events.
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

  const authLogs = auditLogs.filter((log) => log.action.includes("AUTH"));
  const orderLogs = auditLogs.filter((log) => log.entityType === "DeliveryOrder");
  const proofLogs = auditLogs.filter((log) => log.entityType === "Proof");
  const adminLogs = auditLogs.filter((log) => log.actorRole === "ADMIN");

  const metrics = [
    {
      label: "Total logs",
      value: String(auditLogs.length),
      note: "Persisted backend events",
    },
    {
      label: "Auth events",
      value: String(authLogs.length),
      note: "Login/register/session actions",
    },
    {
      label: "Order events",
      value: String(orderLogs.length),
      note: "Order state and operations",
    },
    {
      label: "Admin actions",
      value: String(adminLogs.length),
      note: "Actions performed by admin",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real audit logs</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Operations audit trail.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads real backend audit logs. Use it to trace auth
              events, proof uploads, rider assignment, order cancellation,
              status changes, pricing rule updates, and admin actions.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAuditLogs}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh logs
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
          title="Audit log stream"
          body="Search and review backend activity records."
        >
          <label className="block">
            <span className="label">Search logs</span>
            <input
              className="field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search action, role, entity, reason, or ID"
            />
          </label>

          <div className="mt-5 grid gap-3">
            {filteredLogs.length ? (
              filteredLogs.map((log, index) => {
                const id = logId(log, index);

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedId === id
                        ? "border-[#071a2f] bg-[#071a2f] text-white"
                        : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f] hover:border-[#071a2f]/30"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{log.action}</p>
                          <StatusChip tone={actionTone(log.action)}>
                            {log.actorRole || "SYSTEM"}
                          </StatusChip>
                        </div>

                        <p
                          className={`mt-2 text-xs leading-5 ${
                            selectedId === id ? "text-white/70" : "text-[#667085]"
                          }`}
                        >
                          {log.entityType}
                          {log.entityId ? ` · ${log.entityId}` : ""}
                        </p>

                        {log.reason ? (
                          <p
                            className={`mt-1 text-[11px] ${
                              selectedId === id
                                ? "text-white/60"
                                : "text-[#98a2b3]"
                            }`}
                          >
                            {log.reason}
                          </p>
                        ) : null}
                      </div>

                      {log.createdAt ? (
                        <p className="text-xs">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm leading-6 text-[#667085]">
                  No audit logs match this search.
                </p>
              </div>
            )}
          </div>
        </Panel>

        <Panel
          title="Selected audit record"
          body="Inspect actor, entity, reason, and before/after data."
        >
          {selectedLog ? (
            <div className="grid gap-4">
              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                    {selectedLog.action}
                  </p>
                  <StatusChip tone={actionTone(selectedLog.action)}>
                    {selectedLog.actorRole || "SYSTEM"}
                  </StatusChip>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    ["Actor ID", selectedLog.actorId || "Not available"],
                    ["Entity type", selectedLog.entityType],
                    ["Entity ID", selectedLog.entityId || "Not available"],
                    ["Reason", selectedLog.reason || "No reason stored"],
                    [
                      "Created",
                      selectedLog.createdAt
                        ? new Date(selectedLog.createdAt).toLocaleString()
                        : "Not available",
                    ],
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

              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm font-medium text-[#071a2f]">After data</p>
                <pre className="mt-4 max-h-[360px] overflow-auto rounded-2xl border border-[#e5ded2] bg-[#f7f3ec] p-4 text-xs leading-5 text-[#475467]">
                  {JSON.stringify(selectedLog.after ?? {}, null, 2)}
                </pre>
              </div>

              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <p className="text-sm font-medium text-[#071a2f]">Before data</p>
                <pre className="mt-4 max-h-[260px] overflow-auto rounded-2xl border border-[#e5ded2] bg-[#f7f3ec] p-4 text-xs leading-5 text-[#475467]">
                  {JSON.stringify(selectedLog.before ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select an audit record to inspect details.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
