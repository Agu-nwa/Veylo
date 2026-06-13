import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";
import { demoOrders } from "@/lib/order-data";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (status === "DELIVERED") return "success" as const;
  if (status === "ASSIGNING_RIDER") return "info" as const;
  if (status === "IN_TRANSIT") return "warning" as const;
  return "neutral" as const;
}

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium text-[#1f7a55]">Orders</p>
          <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
            Track delivery status, proof, rider, and support.
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[#667085]">
            This frontend list prepares the backend order history view. Each
            order links to a dynamic detail route with timeline, rider profile,
            OTP, proof, and support.
          </p>
        </div>

        <section className="grid gap-4">
          {demoOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="card rounded-[26px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
                      {order.id}
                    </h2>
                    <StatusChip tone={statusTone(order.status)}>
                      {order.status.replaceAll("_", " ").toLowerCase()}
                    </StatusChip>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {order.pickup} to {order.dropoff}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-[#667085]">Estimated fare</p>
                  <p className="mt-1 text-lg font-medium text-[#071a2f]">
                    {money.format(order.fare)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
