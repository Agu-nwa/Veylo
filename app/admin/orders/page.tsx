import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusChip } from "@/components/shared/StatusChip";
import { demoOrders } from "@/lib/order-data";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function tone(status: string) {
  if (status === "DELIVERED") return "success" as const;
  if (status === "IN_TRANSIT") return "warning" as const;
  if (status === "ASSIGNING_RIDER") return "info" as const;
  return "neutral" as const;
}

export default function AdminOrdersPage() {
  return (
    <AdminShell
      eyebrow="Orders"
      title="Admin order monitoring and status review."
      body="Operations needs a searchable order table with customer, route, fare, status, rider, proof, and support state."
    >
      <section className="card rounded-[32px] p-5 md:p-7">
        <div className="overflow-hidden rounded-[24px] border border-[#e5ded2] bg-[#fffdf8]">
          {demoOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="grid gap-3 border-b border-[#e5ded2] p-4 last:border-0 md:grid-cols-[0.8fr_1.4fr_0.7fr_0.9fr]"
            >
              <p className="text-sm font-medium text-[#071a2f]">{order.id}</p>
              <p className="text-sm text-[#667085]">
                {order.pickup} → {order.dropoff}
              </p>
              <p className="text-sm font-medium text-[#071a2f]">
                {money.format(order.fare)}
              </p>
              <StatusChip tone={tone(order.status)}>
                {order.status.replaceAll("_", " ").toLowerCase()}
              </StatusChip>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
