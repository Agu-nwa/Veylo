import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#e5ded2] py-10">
      <div className="container-shell grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-medium text-[#071a2f]">Veylo</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#667085]">
            A calm, proof-backed logistics booking layer for deliveries,
            errands, verified riders, business accounts, and transparent fare
            estimates across Owerri.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-[#667085]">
          <Link href="/book">Book delivery</Link>
          <Link href="/orders">Track order</Link>
          <Link href="/admin">Admin preview</Link>
          <Link href="/">Safety</Link>
        </div>
      </div>
    </footer>
  );
}
