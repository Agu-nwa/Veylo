import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealOrderDetail } from "@/components/orders/RealOrderDetail";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealOrderDetail orderId={id} />
      </main>
      <Footer />
    </>
  );
}
