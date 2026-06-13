import { StatusChip } from "@/components/shared/StatusChip";

export function PageIntro({
  eyebrow,
  title,
  body,
  chip = "Veylo",
}: {
  eyebrow: string;
  title: string;
  body: string;
  chip?: string;
}) {
  return (
    <section className="container-shell py-10 md:py-14">
      <div className="max-w-3xl">
        <StatusChip tone="info">{chip}</StatusChip>
        <p className="mt-6 text-sm font-medium text-[#1f7a55]">{eyebrow}</p>
        <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[44px]">
          {title}
        </h1>
        <p className="mt-5 text-[16px] leading-7 text-[#667085]">{body}</p>
      </div>
    </section>
  );
}
