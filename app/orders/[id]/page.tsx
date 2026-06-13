import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { StatusChip } from "@/components/shared/StatusChip";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { ProofSupportPanel } from "@/components/orders/ProofSupportPanel";
import { RiderProfileCard } from "@/components/orders/RiderProfileCard";
import { getOrderById } from "@/lib/order-data";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <StatusChip tone="info">Order detail</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {order.id}
            </h1>
            <p className="mt-4 text-[16px] leading-7 text-[#667085]">
              {order.pickup} to {order.dropoff}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm text-[#667085]">Estimated fare</p>
            <p className="mt-1 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
              {money.format(order.fare)}
            </p>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <OrderTimeline order={order} />

          <div className="grid gap-6">
            <RiderProfileCard rider={order.rider} />
            <ProofSupportPanel />
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/orders"
            className="inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Back to orders
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
