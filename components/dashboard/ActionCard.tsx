import Link from "next/link";

export function ActionCard({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <article className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
      <h3 className="text-base font-medium text-[#071a2f]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#667085]">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-full border border-[#d8d0c3] px-4 py-2 text-sm font-medium text-[#071a2f]"
      >
        {label}
      </Link>
    </article>
  );
}
