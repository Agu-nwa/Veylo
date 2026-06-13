export function DataRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#e5ded2] py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-[#071a2f]">{label}</p>
        {note ? <p className="mt-1 text-xs leading-5 text-[#667085]">{note}</p> : null}
      </div>
      <p className="text-right text-sm font-medium text-[#071a2f]">{value}</p>
    </div>
  );
}
