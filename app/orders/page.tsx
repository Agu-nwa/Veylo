import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealOrdersList } from "@/components/orders/RealOrdersList";

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium text-[#1f7a55]">Orders</p>
          <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
            Your real delivery history.
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[#667085]">
            This page now reads account-linked orders from the backend instead
            of mock order data.
          </p>
        </div>

        <RealOrdersList />
      </main>
      <Footer />
    </>
  );
}
