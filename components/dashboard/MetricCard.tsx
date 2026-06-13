export function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="card rounded-[24px] p-5">
      <p className="text-sm text-[#667085]">{label}</p>
      <p className="mt-2 text-3xl font-medium tracking-[-0.045em] text-[#071a2f]">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-[#667085]">{note}</p>
    </article>
  );
}
