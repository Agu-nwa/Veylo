import { RiderShell } from "@/components/rider/RiderShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

export default function RiderProfilePage() {
  return (
    <RiderShell
      eyebrow="Profile"
      title="Rider verification, documents, training, and conduct status."
      body="Rider profile screens help Veylo manage trust: identity, bike details, training, rating, tier, and suspension state."
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Rider account">
          <StatusChip tone="success">Verified</StatusChip>
          <div className="mt-6">
            <DataRow label="Display name" value="Verified Rider 014" note="Customer-facing rider profile name." />
            <DataRow label="Rating" value="4.8" note="Based on completed delivery feedback." />
            <DataRow label="Completed jobs" value="326" note="Used for rider trust and tiering." />
            <DataRow label="Tier" value="Priority rider" note="Mock performance tier." />
          </div>
        </Panel>

        <Panel title="Verification checklist">
          <DataRow label="Identity check" value="Verified" note="Government ID and live profile check." />
          <DataRow label="Phone verification" value="Verified" note="Backend will later verify phone." />
          <DataRow label="Bike details" value="Reviewed" note="Bike access and safety condition." />
          <DataRow label="Training" value="Completed" note="OTP, proof, support, package handling, restricted items." />
          <DataRow label="Conduct rules" value="Accepted" note="No harassment, false status, tampering, or unsafe behavior." />
        </Panel>
      </section>
    </RiderShell>
  );
}
