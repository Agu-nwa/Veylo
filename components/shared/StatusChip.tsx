type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneMap: Record<Tone, string> = {
  neutral: "border-[#d8d0c3] bg-[#f2ede4] text-[#475467]",
  success: "border-[#b7dfcf] bg-[#e8f6ef] text-[#1f7a55]",
  warning: "border-[#f2d59b] bg-[#fff5dc] text-[#a16207]",
  danger: "border-[#f5b5af] bg-[#fff0ee] text-[#b42318]",
  info: "border-[#b7cce7] bg-[#edf5ff] text-[#1d4e89]",
};

export function StatusChip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}
