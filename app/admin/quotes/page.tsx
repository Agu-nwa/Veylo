import { AdminShell } from "@/components/admin/AdminShell";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const quoteRows = [
  ["QUOTE-182031", "VYL-2401", "QUOTE_ACCEPTED", "₦2,400", "VEYLO-MVP-RULES-v1"],
  ["QUOTE-182044", "Pending order", "QUOTE_EXPIRED", "₦3,050", "VEYLO-MVP-RULES-v1"],
  ["QUOTE-182052", "VYL-BIZ-091", "QUOTE_ACCEPTED", "₦2,150", "VEYLO-MVP-RULES-v1"],
  ["QUOTE-182060", "No order", "QUOTE_ABANDONED", "₦1,850", "VEYLO-MVP-RULES-v1"],
];

function tone(status: string) {
  if (status === "QUOTE_ACCEPTED") return "success" as const;
  if (status === "QUOTE_EXPIRED") return "warning" as const;
  return "neutral" as const;
}

export default function AdminQuotesPage() {
  return (
    <AdminShell
      eyebrow="Quote logs"
      title="Quote generated, viewed, accepted, expired, refreshed, and abandoned."
      body="Quote logs help Veylo understand pricing acceptance, quote expiry, customer hesitation, business discounts, and route pricing quality."
    >
      <Panel title="Quote log table">
        <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
          {quoteRows.map(([quote, order, status, fare, rule]) => (
            <div
              key={quote}
              className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[1fr_1fr_1fr_0.6fr_1.2fr]"
            >
              <p className="text-sm font-medium text-[#071a2f]">{quote}</p>
              <p className="text-sm text-[#667085]">{order}</p>
              <StatusChip tone={tone(status)}>{status}</StatusChip>
              <p className="text-sm font-medium text-[#071a2f]">{fare}</p>
              <p className="text-sm text-[#667085]">{rule}</p>
            </div>
          ))}
        </div>
      </Panel>
    </AdminShell>
  );
}
