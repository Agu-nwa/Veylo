export function InfoCard({
  title,
  body,
  meta,
}: {
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    <article className="card rounded-[24px] p-5 md:p-6">
      {meta ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[#1f7a55]">
          {meta}
        </p>
      ) : null}
      <h3 className="text-lg font-medium tracking-[-0.025em] text-[#071a2f]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#667085]">{body}</p>
    </article>
  );
}
