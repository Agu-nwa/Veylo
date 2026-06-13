import Link from "next/link";
import { BusinessShell } from "@/components/business/BusinessShell";
import { StatusChip } from "@/components/shared/StatusChip";

const orders = [
  ["VYL-BIZ-091", "Ikenegbu to Aladinma", "₦2,100", "Delivered"],
  ["VYL-BIZ-092", "Wetheral to World Bank", "₦2,650", "In transit"],
  ["VYL-BIZ-093", "Nekede to IMSU area", "₦3,050", "Assigning rider"],
  ["VYL-BIZ-094", "New Owerri to Ikenegbu", "₦1,850", "Delivered"],
  ["VYL-BIZ-095", "Douglas to World Bank", "₦2,400", "Support review"],
];

function tone(status: string) {
  if (status === "Delivered") return "success" as const;
  if (status === "In transit") return "warning" as const;
  if (status === "Assigning rider") return "info" as const;
  return "danger" as const;
}

export default function BusinessHistoryPage() {
  return (
    <BusinessShell
      eyebrow="Delivery history"
      title="Track business deliveries, proof status, fares, and support history."
      body="Business customers need a clear delivery record that can later become invoice-ready reporting."
    >
      <section className="card rounded-[32px] p-5 md:p-7">
        <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
          {orders.map(([id, route, fare, status]) => (
            <Link
              key={id}
              href="/orders/VYL-2401"
              className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[1fr_1.4fr_0.6fr_0.8fr]"
            >
              <p className="text-sm font-medium text-[#071a2f]">{id}</p>
              <p className="text-sm text-[#667085]">{route}</p>
              <p className="text-sm font-medium text-[#071a2f]">{fare}</p>
              <StatusChip tone={tone(status)}>{status}</StatusChip>
            </Link>
          ))}
        </div>
      </section>
    </BusinessShell>
  );
}
