import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { RealRiderJobDetail } from "@/components/rider/RealRiderJobDetail";

export default async function RiderJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <RealRiderJobDetail orderId={id} />
      </main>
      <Footer />
    </>
  );
}
