export function Panel({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card rounded-[28px] p-6 md:p-7">
      <div className="mb-6">
        <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          {title}
        </h2>
        {body ? <p className="mt-3 text-sm leading-6 text-[#667085]">{body}</p> : null}
      </div>
      {children}
    </section>
  );
}
