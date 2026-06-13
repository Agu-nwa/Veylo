import { StatusChip } from "@/components/shared/StatusChip";

export function InternalNotice({
  title = "Internal operations screen",
  body = "This screen is for Veylo operations and will be protected by backend authentication and role-based access control.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="mb-6 rounded-[24px] border border-[#f2d59b] bg-[#fff5dc] p-4">
      <StatusChip tone="warning">Internal</StatusChip>
      <p className="mt-3 text-sm font-medium text-[#071a2f]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#667085]">{body}</p>
    </div>
  );
}
