export function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="text-sm font-medium text-[#1f7a55]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
        {title}
      </h2>
      {body ? <p className="mt-4 text-sm leading-6 text-[#667085]">{body}</p> : null}
    </div>
  );
}
