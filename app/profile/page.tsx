import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

export default function ProfilePage() {
  return (
    <DashboardShell
      eyebrow="Profile"
      title="Your Veylo profile and account preferences."
      body="This frontend screen prepares the account page backend will later connect to real user data, verification, saved addresses, role, and support preferences."
      chip="Customer profile"
      actionHref="/book"
      actionLabel="Book delivery"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Account summary">
          <StatusChip tone="success">Frontend profile</StatusChip>
          <div className="mt-6">
            <DataRow label="Name" value="Demo Customer" note="Backend will store real full name." />
            <DataRow label="Phone" value="08000000000" note="Phone verification will be added later." />
            <DataRow label="Email" value="customer@veylo.test" note="Email verification will be added later." />
            <DataRow label="Role" value="Customer" note="Role-based access will protect dashboards." />
          </div>
        </Panel>

        <Panel title="Preferences and saved details">
          <DataRow
            label="Default pickup area"
            value="Ikenegbu"
            note="Saved routes improve repeat booking."
          />
          <DataRow
            label="Support preference"
            value="Phone / WhatsApp"
            note="Support channels will be connected in backend."
          />
          <DataRow
            label="Business account"
            value="Not linked"
            note="A customer can later request vendor or corporate access."
          />
          <Link
            href="/business/request"
            className="mt-6 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            Request business access
          </Link>
        </Panel>
      </div>
    </DashboardShell>
  );
}
